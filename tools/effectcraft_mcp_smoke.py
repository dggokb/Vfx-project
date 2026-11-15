#!/usr/bin/env python3
"""Basic MCP JSON-RPC end-to-end test against a real compiled EffectCraft CLI.

Checks initialize, tools/list, get_state, and transparent render_frame to PNG.
"""
import argparse
import json
import queue
import subprocess
import sys
import tempfile
import threading
from pathlib import Path

from PIL import Image


class McpClient:
    def __init__(self, executable: str):
        self.proc = subprocess.Popen(
            [executable, "mcp", "--demo"],
            stdin=subprocess.PIPE, stdout=subprocess.PIPE,
            stderr=None, text=True, bufsize=1,
        )
        self.messages = queue.Queue()
        self._reader = threading.Thread(target=self._read, daemon=True)
        self._reader.start()
        self.next_id = 0

    def _read(self):
        try:
            for line in self.proc.stdout:
                try:
                    self.messages.put(json.loads(line))
                except json.JSONDecodeError as exc:
                    self.messages.put({"local_error": f"invalid JSON-RPC response: {exc}"})
        finally:
            self.messages.put(None)

    def send(self, message):
        self.proc.stdin.write(json.dumps(message, separators=(",", ":")) + "\n")
        self.proc.stdin.flush()

    def request(self, method: str, params=None, timeout=120):
        self.next_id += 1
        reqid = self.next_id
        self.send({"jsonrpc": "2.0", "id": reqid, "method": method, "params": params or {}})
        while True:
            try:
                response = self.messages.get(timeout=timeout)
            except queue.Empty:
                raise RuntimeError(f"MCP timeout for {method}") from None
            if response is None:
                raise RuntimeError(f"MCP server closed stdout ({method}); code={self.proc.poll()}")
            if "local_error" in response:
                raise RuntimeError(response["local_error"])
            if response.get("id") != reqid:
                continue  # notifications are allowed
            if "error" in response:
                raise RuntimeError(f"MCP {method}: {response['error']}")
            return response.get("result", {})

    def tool(self, name, arguments=None):
        result = self.request("tools/call", {"name": name, "arguments": arguments or {}})
        if result.get("isError"):
            raise RuntimeError(f"EffectCraft tool {name}: {result}")
        return result

    def close(self):
        if self.proc.stdin:
            self.proc.stdin.close()
        try:
            self.proc.wait(timeout=8)
        except subprocess.TimeoutExpired:
            self.proc.kill()
            self.proc.wait(timeout=5)


def smoke(cli: str, output: Path):
    client = McpClient(cli)
    try:
        initialized = client.request("initialize", {
            "protocolVersion": "2025-06-18",
            "capabilities": {},
            "clientInfo": {"name": "vfx-studio-smoke", "version": "0.2.0"},
        })
        if "serverInfo" not in initialized:
            raise RuntimeError(f"Missing serverInfo in initialize reply: {initialized}")
        client.send({"jsonrpc": "2.0", "method": "notifications/initialized"})
        tools = client.request("tools/list").get("tools", [])
        names = {t.get("name") for t in tools}
        required = {"get_state", "render_frame"}
        if not required.issubset(names):
            raise RuntimeError(f"MCP missing tools: {sorted(required - names)}")
        client.tool("get_state")
        # The upstream demo fills its entire canvas; EffectCraft correctly encodes
        # fully opaque images as RGB even when transparent=True. Test a *real*
        # alpha composition instead of incorrectly requiring RGBA for the demo.
        client.tool("execute_command", {"command": "comp.new", "params": {
            "name": "VFX Smoke", "width": 128, "height": 128,
            "frameRate": 24, "duration": 0.5
        }})
        client.tool("execute_command", {"command": "layer.newShape", "params": {
            "name": "Alpha Circle", "kind": "ellipse",
            "size": [64, 64], "position": [64, 64],
            "fill": "#ff8a00"
        }})
        output.parent.mkdir(parents=True, exist_ok=True)
        client.tool("render_frame", {"comp": "VFX Smoke", "time": 0.0, "max_side": 256,
                                     "transparent": True, "path": str(output.resolve())}
        if not output.is_file():
            raise RuntimeError("MCP render_frame did not produce a PNG")
        with Image.open(output) as im:
            if im.format != "PNG" or "A" not in im.getbands():
                raise RuntimeError(f"Expected alpha-enabled PNG; got {im.format} {im.mode}")
            if im.getpixel((0, 0))[3] != 0:
                raise RuntimeError("Corner should be fully transparent")
            if im.getpixel((64, 64))[3] == 0:
                raise RuntimeError("Expected visible shape at composition centre")
            print(f"PASS: EffectCraft MCP, {len(names)} tools, transparent PNG {im.size}")
    finally:
        client.close()


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--cli", type=Path, required=True)
    p.add_argument("--out", type=Path)
    args = p.parse_args()
    if args.out:
        smoke(str(args.cli.resolve()), args.out)
    else:
        with tempfile.TemporaryDirectory() as d:
            smoke(str(args.cli.resolve()), Path(d) / "mcp.png")


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, OSError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
