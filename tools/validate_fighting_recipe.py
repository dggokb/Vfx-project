#!/usr/bin/env python3
"""Validate a fighting-game VFX recipe and its mandatory gameplay brief.

Static validation cannot judge artistic quality, occlusion, or actual in-game hitbox
alignment. These remain external review gates even when the script succeeds.
"""
import argparse
import json
import math
import re
import sys
from pathlib import Path

EVENTS = {"hit", "guard", "parry", "clash", "slash", "trail", "dash",
          "landing", "projectile", "super", "other"}
STRENGTHS = {"light", "medium", "heavy", "special", "super", "not_applicable"}
HITSTOP = {"pause_vfx_with_game", "continue_vfx_during_stop", "engine_defined"}
PLANES = {"behind_character", "character_plane", "front_detail", "ground"}
PROJECTIONS = {"side", "three_quarter", "front", "top_down"}
ORIENTATIONS = {"right", "left", "both", "not_applicable"}
STATUSES = {"wip", "technical-fixture", "art-approved"}
REVIEW = {"pending", "verified", "not_applicable"}
FRAME_KEYS = ("contact", "peak", "breakup", "settle", "clear")


def expect(cond, message: str) -> None:
    if not cond:
        raise ValueError(message)


def object_at(root, key: str) -> dict:
    value = root.get(key)
    expect(isinstance(value, dict), f"missing/invalid {key} object")
    return value


def nonempty(value) -> bool:
    return isinstance(value, str) and bool(value.strip())


def number(value) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def positive_int(value) -> bool:
    return type(value) is int and value > 0


def check(brief_path: Path, recipe_path: Path, frames=None, fps=None) -> dict:
    try:
        data = json.loads(brief_path.read_text(encoding="utf-8"))
        commands = json.loads(recipe_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(str(exc)) from exc
    expect(isinstance(data, dict), "brief must be a JSON object")
    expect(type(data.get("schema_version")) is int and data["schema_version"] == 1,
           "brief schema_version must be 1")
    id_ = data.get("id")
    expect(nonempty(id_) and bool(re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_-]*", id_)),
           "brief.id must be a safe nonempty slug")
    expect(id_ == recipe_path.stem, "brief.id must match recipe filename")
    status = data.get("status")
    expect(status in STATUSES, "invalid brief.status")
    game = object_at(data, "gameplay")
    expect(game.get("event") in EVENTS, "gameplay.event invalid")
    expect(game.get("strength") in STRENGTHS, "gameplay.strength invalid")
    expect(nonempty(game.get("hitbox_reference")), "gameplay.hitbox_reference required")
    expect(game.get("hitbox_verification") in REVIEW, "gameplay.hitbox_verification invalid")
    expect(game.get("occlusion_review") in REVIEW, "gameplay.occlusion_review invalid")
    expect(game.get("hitstop_policy") in HITSTOP, "gameplay.hitstop_policy invalid")
    expect(nonempty(game.get("direction")), "gameplay.direction required")
    # Never claim real separate draw planes if current exporter produces a single atlas.
    expect(game.get("layer_strategy") == "single_flattened",
           "multipass is not implemented; only single_flattened is currently supported")

    camera = object_at(data, "camera")
    expect(camera.get("projection") in PROJECTIONS, "camera.projection invalid")
    expect(camera.get("orientation") in ORIENTATIONS, "camera.orientation invalid")
    expect(type(camera.get("locked")) is bool, "camera.locked boolean required")

    render = object_at(data, "render")
    for dim in ("width", "height", "frames"):
        expect(positive_int(render.get(dim)), f"render.{dim} must be a positive integer")
    expect(number(render.get("fps")) and render["fps"] > 0,
           "render.fps must be positive and finite")
    expect(render.get("alpha") == "required", "render.alpha must be required")
    pivot = render.get("pivot")
    expect(isinstance(pivot, list) and len(pivot) == 2 and all(number(x) for x in pivot),
           "render.pivot must be [x, y]")
    expect(0 <= pivot[0] < render["width"] and 0 <= pivot[1] < render["height"],
           "render.pivot outside canvas")
    if frames is not None:
        expect(render["frames"] == frames, "CLI --frames does not match brief.render.frames")
    if fps is not None:
        expect(abs(render["fps"] - fps) < 0.000001,
               "CLI --fps does not match brief.render.fps")

    timing = object_at(data, "timing")
    for key in FRAME_KEYS:
        expect(type(timing.get(key)) is int, f"timing.{key} must be integer frame index")
    indices = [timing[key] for key in FRAME_KEYS]
    expect(0 <= indices[0] <= indices[1] <= indices[2] <= indices[3] <= indices[4] < render["frames"],
           "timing phases must be ordered and within frames")
    expect(type(game.get("collision_frame")) is int and
           0 <= game["collision_frame"] < render["frames"],
           "gameplay.collision_frame out of range")
    expect(game["collision_frame"] == timing["contact"],
           "gameplay.collision_frame must match timing.contact for this recipe convention")

    art = object_at(data, "art")
    expect(nonempty(art.get("silhouette_goal")), "art.silhouette_goal required")
    expect(nonempty(art.get("direction_goal")), "art.direction_goal required")
    colors = art.get("palette")
    expect(isinstance(colors, list) and bool(colors) and
           all(isinstance(c, str) and bool(re.fullmatch(r"#[0-9a-fA-F]{6}", c)) for c in colors),
           "art.palette must contain hex RGB colors")
    layers = art.get("layers")
    expect(isinstance(layers, list) and bool(layers), "art.layers must be a nonempty list")
    layer_names = set()
    planes = set()
    for layer in layers:
        expect(isinstance(layer, dict), "each art.layers entry must be an object")
        expect(nonempty(layer.get("name")) and nonempty(layer.get("role")),
               "layer name/role required")
        expect(layer.get("plane") in PLANES, "invalid layer drawing plane")
        expect(layer["name"] not in layer_names, "duplicate layer name")
        layer_names.add(layer["name"])
        planes.add(layer["plane"])
    expect(not ({"behind_character", "front_detail"} <= planes),
           "back+front layers require multipass output, unsupported by flattened atlas")
    references = art.get("references")
    expect(isinstance(references, list) and bool(references), "art.references required")
    for ref in references:
        expect(isinstance(ref, dict) and
               nonempty(ref.get("title")) and nonempty(ref.get("usage")) and
               isinstance(ref.get("url"), str) and ref["url"].startswith("https://"),
               "art.references must contain title, https url, usage")

    review = object_at(data, "verification")
    expect(review.get("review_status") == status,
           "verification.review_status must match brief.status")
    expect(review.get("gameplay_preview") in REVIEW, "gameplay_preview status invalid")
    evidence = review.get("evidence")
    expect(isinstance(evidence, list) and
           all(isinstance(e, str) and e.startswith("https://") for e in evidence),
           "evidence must be a list of https URLs")
    limitations = review.get("known_limitations")
    expect(isinstance(limitations, list) and all(nonempty(x) for x in limitations),
           "known_limitations must be a list of nonempty strings")

    expect(isinstance(commands, list) and bool(commands), "recipe commands must be nonempty list")
    for cmd in commands:
        expect(isinstance(cmd, dict) and nonempty(cmd.get("command")) and
               isinstance(cmd.get("params"), dict), "every recipe command needs command+params")
    first = commands[0]
    expect(first["command"] == "comp.new", "first command must be comp.new")
    comp = first["params"]
    expect(comp.get("width") == render["width"] and comp.get("height") == render["height"],
           "composition canvas differs from brief.render")
    expect(number(comp.get("frameRate")) and abs(comp["frameRate"] - render["fps"]) < 0.000001,
           "composition frameRate differs from brief.render.fps")
    expect(number(comp.get("duration")) and comp["duration"] + 1e-6 >=
           render["frames"] / render["fps"],
           "composition duration shorter than requested frame sequence")
    created_layers = {
        cmd["params"].get("name")
        for cmd in commands
        if cmd["command"] in ("layer.newShape", "layer.newSolid", "layer.newText")
        and nonempty(cmd["params"].get("name"))
    }
    expect(layer_names <= created_layers,
           f"brief layers not created by recipe: {sorted(layer_names - created_layers)}")
    for cmd in commands:
        if cmd["command"] == "prop.addKey" and "time" in cmd["params"]:
            t = cmd["params"]["time"]
            expect(number(t) and 0 <= t <= comp["duration"],
                   "prop.addKey time outside composition")

    if status == "art-approved":
        expect(game["hitbox_reference"] != "unlinked-fixture" and
               game["hitbox_verification"] == "verified" and
               game["occlusion_review"] == "verified" and
               review["gameplay_preview"] == "verified" and bool(evidence),
               "art-approved requires verified gameplay, real hitbox/occlusion review and evidence")
    return {
        "schema_version": 1, "recipe": id_, "status": status,
        "frames": render["frames"], "fps": render["fps"], "canvas": [render["width"], render["height"]],
        "layers": len(layers), "frame_stages": indices,
        "gameplay_review_required": status != "art-approved",
        "warning": "Structure validated only; artistic quality and game hitbox alignment are not automatically tested"
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--recipe", required=True, type=Path)
    parser.add_argument("--brief", required=True, type=Path)
    parser.add_argument("--frames", type=int)
    parser.add_argument("--fps", type=float)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    try:
        result = check(args.brief, args.recipe, frames=args.frames, fps=args.fps)
    except (ValueError, TypeError) as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1
    if args.json:
        print(json.dumps(result, sort_keys=True))
    else:
        print(f"PASS structural fighting recipe: {result['recipe']} — {result['status']}")
        print(result["warning"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
