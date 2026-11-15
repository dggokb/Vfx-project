"""Offline smoke tests for transparent spritesheet production."""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
TOOL = ROOT / "tools" / "pack_spritesheet.py"


def invoke(folder: Path, output: Path):
    return subprocess.run(
        [sys.executable, str(TOOL), "--input", str(folder),
         "--output", str(output), "--columns", "4", "--fps", "24"],
        text=True, capture_output=True,
    )


class SpriteSheetTests(unittest.TestCase):
    def test_alpha_preserved_and_natural_order(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "frames"
            source.mkdir()
            for i in range(1, 12):
                frame = Image.new("RGBA", (16, 12), (0, 0, 0, 0))
                frame.putpixel((0, 0), (i, 30, 60, 255))
                frame.save(source / f"frame_{i}.png")
            atlas = root / "atlas.png"
            result = invoke(source, atlas)
            self.assertEqual(result.returncode, 0, result.stderr)
            metadata = json.loads(atlas.with_suffix(".json").read_text())
            with Image.open(atlas) as image:
                self.assertEqual(image.size, (64, 36))
                self.assertEqual(image.mode, "RGBA")
                self.assertEqual(image.getpixel((15, 11))[3], 0)
                self.assertEqual(image.getpixel((0, 0))[0], 1)
                self.assertEqual(image.getpixel((16, 0))[0], 2)
                self.assertEqual(image.getpixel((32, 24))[0], 11)
            self.assertEqual(metadata["frame_count"], 11)
            self.assertEqual(metadata["frames"][-1]["name"], "frame_11.png")

    def test_rejects_rgb_without_alpha(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            Image.new("RGB", (8, 8), "red").save(root / "1.png")
            result = invoke(root, root / "out.png")
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("no alpha channel", result.stderr)

    def test_rejects_different_canvas_sizes(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            Image.new("RGBA", (8, 8)).save(root / "1.png")
            Image.new("RGBA", (8, 9)).save(root / "2.png")
            result = invoke(root, root / "out.png")
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("identical dimensions", result.stderr)


if __name__ == "__main__":
    unittest.main()
