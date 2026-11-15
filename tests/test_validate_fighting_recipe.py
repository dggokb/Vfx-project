"""Verify fighting recipe gates (artistic review remains outside this validator)."""
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "tools" / "validate_fighting_recipe.py"
SPEC = importlib.util.spec_from_file_location("vfx_recipe_check", SCRIPT)
module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(module)


def fixture():
    return json.loads((ROOT / "recipes" / "briefs" / "hit-light.json").read_text())


def commands():
    return json.loads((ROOT / "recipes" / "hit-light.json").read_text())


class FightingRecipeTests(unittest.TestCase):
    def validate(self, b, c, frames=10, fps=24):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            brief = root / "hit-light.brief.json"
            recipe = root / "hit-light.json"
            brief.write_text(json.dumps(b))
            recipe.write_text(json.dumps(c))
            return module.check(brief, recipe, frames=frames, fps=fps)

    def test_valid_fixture(self):
        result = self.validate(fixture(), commands())
        self.assertEqual(result["status"], "technical-fixture")
        self.assertTrue(result["gameplay_review_required"])

    def test_bad_hitstop(self):
        b = fixture()
        b["gameplay"]["hitstop_policy"] = "not-a-policy"
        with self.assertRaisesRegex(ValueError, "hitstop"):
            self.validate(b, commands())

    def test_wrong_timing(self):
        b = fixture()
        b["timing"]["peak"] = 9
        with self.assertRaisesRegex(ValueError, "phases"):
            self.validate(b, commands())

    def test_wrong_fps(self):
        with self.assertRaisesRegex(ValueError, "--fps"):
            self.validate(fixture(), commands(), fps=30)

    def test_invalid_pivot(self):
        b = fixture()
        b["render"]["pivot"] = [500, 128]
        with self.assertRaisesRegex(ValueError, "pivot outside"):
            self.validate(b, commands())

    def test_flattened_cannot_claim_multi_pass(self):
        b = fixture()
        b["art"]["layers"][0]["plane"] = "behind_character"
        b["art"]["layers"][1]["plane"] = "front_detail"
        with self.assertRaisesRegex(ValueError, "multipass"):
            self.validate(b, commands())

    def test_cannot_mark_approved_without_gameplay(self):
        b = fixture()
        b["status"] = "art-approved"
        b["verification"]["review_status"] = "art-approved"
        with self.assertRaisesRegex(ValueError, "art-approved requires"):
            self.validate(b, commands())

    def test_canvas_mismatch(self):
        c = commands()
        c[0]["params"]["width"] = 512
        with self.assertRaisesRegex(ValueError, "composition canvas"):
            self.validate(fixture(), c)


if __name__ == "__main__":
    unittest.main()
