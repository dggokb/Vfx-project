"""Connect a cited production decision to commands and measurable output."""
import hashlib
import json
from pathlib import Path

from PIL import Image


def read_decision(recipe_path, commands, root):
    brief = json.loads(recipe_path.with_suffix(".brief.json").read_text())
    for key, doc in (("lesson", "VFX_LEARNING_LOG.md"), ("principle", "VFX_MASTER_GUIDE.md")):
        quote = brief[key]
        if len(quote.strip()) < 16 or quote not in (root / "docs" / doc).read_text():
            raise ValueError(f"Missing or stale citation: {key}")
    if not brief["decision"].strip() or not brief["required_commands"]:
        raise ValueError("Describe the decision and the commands implementing it")
    for required in brief["required_commands"]:
        if required not in {step["command"] for step in commands}:
            raise ValueError(f"Missing planned command: {required}")
    return brief


def inspect_frames(directory, brief):
    signatures = set()
    rows = []
    files = sorted(directory.glob("*.png"))
    for i, path in enumerate(files):
        with Image.open(path) as image:
            alpha = image.convert("RGBA").getchannel("A")
            box = alpha.getbbox()
            if not box and i not in brief["allowed_empty"]:
                raise ValueError(f"Unexpected empty frame: {path.name}")
            if box and min(box[0], box[1], image.width-box[2], image.height-box[3]) < brief["margin"]:
                raise ValueError(f"Insufficient transparent margin: {path.name}")
            pixels = image.convert("RGBA").tobytes()
            signatures.add(hashlib.sha256(pixels).digest())
            rows.append({"frame": path.name, "alpha_bbox": box})
    if len(signatures) < min(2, len(files)):
        raise ValueError("Animation is static")
    return rows
