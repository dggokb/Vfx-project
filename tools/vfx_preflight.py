#!/usr/bin/env python3
"""Knowledge-base gate for every EffectCraft VFX build.

This is a documentation/traceability check, not a substitute for reading the
manual or judging animation quality. Produces deterministic source digests.
"""
import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "AGENTS.md",
    "docs/ARCSYS_FIGHTING_VFX.md",
    "docs/VFX_MASTER_GUIDE.md",
    "docs/VFX_LEARNING_LOG.md",
    "docs/VFX_SOURCES.md",
    "docs/VFX_BRIEF_TEMPLATE.md",
    "docs/EFFECTCRAFT_INTEGRATION.md",
]


def knowledge_fingerprint(effect: str) -> dict:
    if not effect.strip() or not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_-]*", effect):
        raise ValueError("effect id must contain only letters, digits, underscores and hyphens")
    docs = {}
    for relative in REQUIRED:
        path = ROOT / relative
        if not path.is_file():
            raise ValueError(f"required VFX guidance is missing: {relative}")
        data = path.read_bytes()
        if len(data.strip()) < 100:
            raise ValueError(f"required VFX guidance is empty/incomplete: {relative}")
        docs[relative] = hashlib.sha256(data).hexdigest()
    return {
        "schema_version": 1,
        "effect": effect,
        "purpose": "VFX production knowledge provenance; not an artistic approval",
        "required_reading_sha256": docs,
        "review_required": True,
        "learning_log_update_required_after_iteration": True,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--effect", required=True, help="Effect/recipe slug")
    parser.add_argument("--json", action="store_true", help="Machine-readable report for pipeline")
    args = parser.parse_args()
    try:
        data = knowledge_fingerprint(args.effect)
    except ValueError as exc:
        parser.error(str(exc))
    if args.json:
        print(json.dumps(data, ensure_ascii=False, sort_keys=True))
    else:
        print(f"VFX knowledge base OK for {args.effect}: {len(data['required_reading_sha256'])} references")
        print("READ FIRST: docs/ARCSYS_FIGHTING_VFX.md + docs/VFX_MASTER_GUIDE.md + docs/VFX_LEARNING_LOG.md")
        print("WORKFLOW: silhouette -> timing blockout -> layers -> color/glow -> real render -> QA")
        print("AFTER ITERATION: update docs/VFX_LEARNING_LOG.md, preserving failures and evidence.")


if __name__ == "__main__":
    main()
