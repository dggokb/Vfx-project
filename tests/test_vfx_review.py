import sys
import tempfile
import unittest
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from vfx_review import inspect_frames


class FrameReviewTests(unittest.TestCase):
    def test_rejects_empty_static_and_edge_touching_sequences(self):
        with tempfile.TemporaryDirectory() as tmp:
            directory = Path(tmp)
            image = Image.new("RGBA", (12, 12))
            for point, message in [(None, "empty"), ((5, 5), "static"), ((0, 4), "margin")]:
                if point:
                    image.putpixel(point, (255, 255, 255, 255))
                for i in range(2):
                    image.save(directory / f"{i}.png")
                with self.assertRaisesRegex(ValueError, message):
                    inspect_frames(directory, {"margin": 1, "allowed_empty": []})
