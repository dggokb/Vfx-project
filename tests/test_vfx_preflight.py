"""The knowledge-base is required at every render, not optional context."""
import json
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class KnowledgeGateTests(unittest.TestCase):
    def test_preflight_emits_versioned_provenance(self):
        r = subprocess.run(
            [sys.executable, str(ROOT / "tools" / "vfx_preflight.py"),
             "--effect", "hit-light", "--json"],
            text=True, capture_output=True,
        )
        self.assertEqual(r.returncode, 0, r.stderr)
        data = json.loads(r.stdout)
        self.assertEqual(data["effect"], "hit-light")
        self.assertTrue(data["review_required"])
        self.assertIn("docs/VFX_MASTER_GUIDE.md", data["required_reading_sha256"])
        self.assertIn("docs/VFX_LEARNING_LOG.md", data["required_reading_sha256"])
        self.assertTrue(all(len(v) == 64 for v in data["required_reading_sha256"].values()))

    def test_invalid_effect_id_fails(self):
        r = subprocess.run(
            [sys.executable, str(ROOT / "tools" / "vfx_preflight.py"),
             "--effect", "../oops", "--json"],
            text=True, capture_output=True,
        )
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("effect id", r.stderr)


if __name__ == "__main__":
    unittest.main()
