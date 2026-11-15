"""Local pipeline tests using a fake CLI; real EffectCraft is tested in its separate workflow."""
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "tools" / "vfx_pipeline.py"


class PipelineTests(unittest.TestCase):
    def test_cli_generate_render_and_atlas(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            fake = root / "effectcraft-cli"
            fake.write_text(
                "#!/usr/bin/env python3\n"
                "import json, sys\n"
                "from pathlib import Path\n"
                "from PIL import Image\n"
                "a=sys.argv[1:]\n"
                "out=Path(a[a.index('--save-as')+1] if a[0]=='run' else a[a.index('--out')+1])\n"
                "out.parent.mkdir(parents=True, exist_ok=True)\n"
                "if a[0]=='run': out.write_text('mock project')\n"
                "else:\n img=Image.new('RGBA',(8,8)); img.putpixel((1,1),(230,120,15,150+int(out.stem[-1]))); img.save(out)\n",
                encoding="utf-8",
            )
            fake.chmod(0o755)
            recipe = root / "recipe.json"
            recipe.write_text(json.dumps([
                {"command":"comp.new","params":{"width":8,"height":8}}
            ]), encoding="utf-8")
            brief = json.loads((ROOT / "recipes/hit-light.brief.json").read_text())
            brief["required_commands"] = ["comp.new"]
            recipe.with_suffix(".brief.json").write_text(json.dumps(brief))
            output = root / "output"
            result = subprocess.run([
                sys.executable, str(SCRIPT), "--cli", str(fake), "--recipe", str(recipe),
                "--out", str(output), "--frames", "5", "--columns", "3"
            ], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            with Image.open(output / "atlas.png") as atlas:
                self.assertEqual(atlas.size, (24,16))
                self.assertEqual(atlas.getpixel((1,1)), (230,120,15,150))
                self.assertEqual(atlas.getpixel((23,15)), (0,0,0,0))
            manifest = json.loads((output / "atlas.json").read_text())
            self.assertEqual(manifest["frame_count"],5)
            self.assertEqual(manifest["frames"][4]["name"],"frame_0004.png")


if __name__ == "__main__":
    unittest.main()
