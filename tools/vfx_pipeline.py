#!/usr/bin/env python3
"""Generate an editable EffectCraft project and lossless game-ready sprite atlas.

Recipe is a JSON array of EffectCraft engine commands, not an invented .ecproj format.
"""
import argparse
import json
import hashlib
import math
import subprocess
import sys
from pathlib import Path

from vfx_review import inspect_frames, read_decision

ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / "tools" / "pack_spritesheet.py"


def run(args: list[str]) -> None:
    print("+", " ".join(args), flush=True)
    subprocess.run(args, check=True)


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--cli", type=Path, required=True, help="Path to built effectcraft-cli executable")
    p.add_argument("--recipe", type=Path, required=True)
    p.add_argument("--out", type=Path, required=True, help="Output directory")
    p.add_argument("--frames", type=int, default=12)
    p.add_argument("--fps", type=float, default=24.0)
    p.add_argument("--columns", type=int, default=4)
    args = p.parse_args()
    if args.frames < 1 or args.columns < 1 or not math.isfinite(args.fps) or args.fps <= 0:
        p.error("frames/columns must be positive; fps must be finite and positive")
    recipe = json.loads(args.recipe.read_text(encoding="utf-8"))
    if not isinstance(recipe, list) or not recipe:
        p.error("recipe must contain a nonempty array of EffectCraft commands")
    if any(not isinstance(x, dict) or not isinstance(x.get("command"), str)
           or not isinstance(x.get("params"), dict) for x in recipe):
        p.error("each command needs a string 'command' and object 'params'")
    # Every render requires the versioned production playbook and learning log.
    # Save the exact knowledge-base fingerprints with this render for traceability.
    preflight = subprocess.run(
        [sys.executable, str(ROOT / "tools" / "vfx_preflight.py"),
         "--effect", args.recipe.stem, "--json"],
        check=True, text=True, capture_output=True,
    )
    knowledge = json.loads(preflight.stdout)
    print("VFX knowledge preflight OK: master guide + lessons + sources checked.", flush=True)
    decision = read_decision(args.recipe, recipe, ROOT)
    knowledge["decision"] = decision
    knowledge["recipe_sha256"] = hashlib.sha256(args.recipe.read_bytes()).hexdigest()
    cli = str(args.cli.resolve())
    destination = args.out.resolve()
    destination.mkdir(parents=True, exist_ok=True)
    project = destination / "effect.ecproj"
    knowledge_path = destination / "knowledge.json"
    if project.exists() or knowledge_path.exists():
        p.error("refusing to overwrite existing project or knowledge record")
    frame_dir = destination / "frames"
    frame_dir.mkdir(parents=True, exist_ok=True)
    if list(frame_dir.glob("*.png")):
        p.error("frames directory must not contain old PNG files")
    run([cli, "run", "--commands", str(args.recipe.resolve()), "--empty", "--save-as", str(project)])
    if not project.is_file():
        raise RuntimeError("EffectCraft returned success without creating project")
    for n in range(args.frames):
        name = frame_dir / f"frame_{n:04d}.png"
        run([cli, "render-frame", "--project", str(project), "--time",
             f"{n / args.fps:.9f}", "--out", str(name), "--transparent"])
        if not name.is_file():
            raise RuntimeError(f"EffectCraft returned success without frame {n}")
    knowledge["observed_frames"] = inspect_frames(frame_dir, decision)
    atlas = destination / "atlas.png"
    run([sys.executable, str(PACK), "--input", str(frame_dir), "--output",
         str(atlas), "--columns", str(args.columns), "--fps", str(args.fps)])
    manifest = json.loads(atlas.with_suffix(".json").read_text(encoding="utf-8"))
    if manifest["frame_count"] != args.frames:
        raise RuntimeError("frame count mismatch after packing")
    knowledge_path.write_text(json.dumps(knowledge, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Success: {project}, {atlas}, {atlas.with_suffix('.json')}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, RuntimeError, subprocess.CalledProcessError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
