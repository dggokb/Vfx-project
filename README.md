# VFX Studio

**Professional 2D game visual effects production pipeline** built around the open-source [EffectCraft](https://github.com/storytold/effectcraft).

Our first milestone is repeatable VFX authoring and game-ready exports: **EffectCraft project → RGBA PNG frames → transparent spritesheet + timing JSON**.

> **Current status:** initial toolchain and tests are committed. EffectCraft is pinned but **not included or compiled** in this repository. The install helper clones the upstream project to a Git-ignored local directory.

## Requirements

- Python **3.10+**, [Pillow](requirements.txt)
- Git and internet access to retrieve EffectCraft
- Rust/Cargo **1.95+** and platform-native build dependencies to compile the editor

## Install and launch EffectCraft

```bash
python -m pip install -r requirements.txt
python tools/effectcraft.py status
python tools/effectcraft.py install    # clone and pin the upstream revision
python tools/effectcraft.py build      # release-build the desktop app + CLI
python tools/effectcraft.py editor     # launch the editor
python tools/effectcraft.py demo       # launch with its built-in demo
python tools/effectcraft.py mcp        # start headless MCP server with autosave
```

The source will live in `vendor/effectcraft/` (excluded from our Git repository). Source revision and version are declared in [effectcraft.lock.json](effectcraft.lock.json). The upstream project is large; release builds may take a long time.

## Export a game spritesheet

Create an animation in EffectCraft and export a **numbered transparent PNG sequence** through the render queue. Then:

```bash
python tools/pack_spritesheet.py \
  --input exports/impact \
  --output dist/impact.png \
  --columns 4 \
  --fps 24
```

Produces **dist/impact.png** (unmodified RGBA pixels on a transparent atlas) and **dist/impact.json** (frame order, coordinates, dimensions and duration). Frames are sorted naturally, such that `frame_2.png` precedes `frame_10.png`.

Requirements: identical canvas dimensions for every frame and a real alpha channel. The exporter deliberately **does not** trim, mirror, resize, recolor or regenerate art.

## Quality and validation

```bash
python -m unittest discover -s tests -v
```

GitHub Actions runs offline Python validation on every push and pull request. Full EffectCraft compilation and rendered VFX presets are **future milestones**, not claimed as completed here.

## Files

```text
.github/workflows/check.yml   Python validation
docs/ARCHITECTURE.md          boundaries, quality rules and roadmap
effectcraft.lock.json         upstream commit pin
presets/catalog.json          VFX families (planned)
projects/README.md            where to keep EffectCraft .ecproj projects
tools/effectcraft.py          upstream installer/launcher
tools/pack_spritesheet.py     PNG atlas + JSON exporter
tests/                        offline exporter tests
vendor/                       ignored EffectCraft checkout
```

## Licensing and attribution

VFX Studio's own bootstrap code is MIT-licensed (see [LICENSE](LICENSE)). EffectCraft is a **separate upstream project** under **MIT OR Apache-2.0**. Any distribution containing its code or binaries must follow the relevant licenses, NOTICE and third-party attribution requirements. Upstream: [EffectCraft](https://github.com/storytold/effectcraft).

VFX Studio is independent of any particular game; the SŌKON fighting game can be one of its test consumers.
