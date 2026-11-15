#!/usr/bin/env python3
"""Install/build/launch an immutable upstream EffectCraft checkout."""
import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCK = ROOT / "effectcraft.lock.json"
CHECKOUT = ROOT / "vendor" / "effectcraft"


def run(command: list[str], *, cwd: Path | None = None) -> None:
    print("+", " ".join(command), file=sys.stderr, flush=True)
    subprocess.run(command, cwd=cwd, check=True)


def require(command: str) -> None:
    if shutil.which(command) is None:
        raise RuntimeError(f"Required executable not found in PATH: {command}")


def git_stdout(*args: str) -> str:
    return subprocess.check_output(
        ["git", "-C", str(CHECKOUT), *args], text=True
    ).strip()


def spec() -> dict:
    return json.loads(LOCK.read_text(encoding="utf-8"))


def install() -> None:
    require("git")
    lock = spec()
    repo, revision = lock["upstream"], lock["revision"]
    if not CHECKOUT.exists():
        CHECKOUT.parent.mkdir(parents=True, exist_ok=True)
        run(["git", "clone", repo, str(CHECKOUT)])
    if not (CHECKOUT / ".git").exists():
        raise RuntimeError(f"Path is not a Git checkout: {CHECKOUT}")
    origin = git_stdout("remote", "get-url", "origin")
    canonical = lambda s: s.rstrip("/").removesuffix(".git")
    if canonical(origin) != canonical(repo):
        raise RuntimeError(f"Unexpected upstream remote: {origin}")
    if git_stdout("status", "--porcelain"):
        raise RuntimeError("Upstream has local edits; refusing to overwrite")
    try:
        known = git_stdout("rev-parse", "--verify", f"{revision}^{{commit}}")
    except subprocess.CalledProcessError:
        run(["git", "fetch", "origin", revision], cwd=CHECKOUT)
        known = git_stdout("rev-parse", "--verify", f"{revision}^{{commit}}")
    if known != revision:
        raise RuntimeError("Pinned SHA verification failed")
    if git_stdout("rev-parse", "HEAD") != revision:
        run(["git", "checkout", "--detach", revision], cwd=CHECKOUT)
    print(f"EffectCraft pinned to {revision}")


def status() -> None:
    lock = spec()
    print(f"Expected: {lock['upstream']} @ {lock['revision']}")
    if (CHECKOUT / ".git").exists():
        require("git")
        head = git_stdout("rev-parse", "HEAD")
        print(f"Installed: {head}")
        if head != lock["revision"]:
            raise RuntimeError("Checkout does not match the pinned commit")
    else:
        print("Not installed. Run: python tools/effectcraft.py install")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["status", "install", "build", "editor", "demo", "mcp"])
    args = parser.parse_args()
    try:
        if args.action == "status":
            status()
        elif args.action == "install":
            install()
        else:
            install()
            require("cargo")
            if args.action == "build":
                cmd = ["cargo", "build", "--release", "-p", "effectcraft", "-p", "effectcraft-cli"]
            elif args.action == "editor":
                cmd = ["cargo", "run", "--release", "-p", "effectcraft"]
            elif args.action == "demo":
                cmd = ["cargo", "run", "--release", "-p", "effectcraft", "--", "--demo"]
            else:
                cmd = ["cargo", "run", "--release", "-p", "effectcraft-cli", "--", "mcp", "--autosave"]
            run(cmd, cwd=CHECKOUT)
        return 0
    except (RuntimeError, subprocess.CalledProcessError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
