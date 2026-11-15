#!/usr/bin/env python3
"""Combine equal-sized RGBA PNG frames into a lossless transparent atlas."""
import argparse
import json
import math
import re
from pathlib import Path

from PIL import Image


def natural_key(path: Path):
    return [int(s) if s.isdigit() else s.lower()
            for s in re.split(r"(\d+)", path.name)]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--fps", type=float, default=24)
    parser.add_argument("--manifest", type=Path)
    args = parser.parse_args()
    if args.columns < 1 or not math.isfinite(args.fps) or args.fps <= 0:
        parser.error("columns must be >=1; fps must be positive and finite")
    paths = sorted(args.input.glob("*.png"), key=natural_key)
    if not paths:
        parser.error("input directory contains no PNG frames")
    frames_rgba = []
    for path in paths:
        with Image.open(path) as image:
            if "A" not in image.getbands() and "transparency" not in image.info:
                parser.error(f"{path} has no alpha channel")
            frames_rgba.append(image.convert("RGBA"))
    width, height = frames_rgba[0].size
    if any(image.size != (width, height) for image in frames_rgba):
        parser.error("all frames must have identical dimensions")
    rows = math.ceil(len(paths) / args.columns)
    atlas = Image.new("RGBA", (width * args.columns, height * rows), (0, 0, 0, 0))
    frames = []
    for index, (path, frame) in enumerate(zip(paths, frames_rgba)):
        x, y = (index % args.columns) * width, (index // args.columns) * height
        atlas.alpha_composite(frame, (x, y))
        frames.append({
            "name": path.name, "x": x, "y": y,
            "width": width, "height": height,
            "duration_ms": round(1000 / args.fps, 3),
        })
    args.output.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(args.output)
    manifest = {
        "schema_version": 1, "atlas": args.output.name,
        "frame_count": len(frames), "columns": args.columns, "rows": rows,
        "fps": args.fps, "frames": frames,
    }
    out = args.manifest or args.output.with_suffix(".json")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Packed {len(frames)} frames -> {args.output}")


if __name__ == "__main__":
    main()
