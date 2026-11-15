# VFX Studio

**Professional 2D game visual effects production pipeline** built around the open-source [EffectCraft](https://github.com/storytold/effectcraft).

Our first milestone is repeatable VFX authoring and game-ready exports: **EffectCraft project → RGBA PNG frames → transparent spritesheet + timing JSON**.

> **Current status (2026-11-15):** the pinned upstream EffectCraft CLI has been compiled successfully in GitHub Actions, and a separate official v0.24.1 binary completed the MCP + transparent VFX render/export smoke test. These checks prove the headless pipeline, **not** professional artistic quality or the desktop UI. The EffectCraft source/binaries are not vendored in this repo.

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

## Mandatory VFX craft workflow (After Effects research)

**Before every new VFX**, agents and collaborators must read:

1. [AGENTS.md](AGENTS.md) — mandatory production rules.
2. [docs/ARCSYS_FIGHTING_VFX.md](docs/ARCSYS_FIGHTING_VFX.md) — **fighting game VFX craft based on Arc System Works sources**.
3. [docs/VFX_MASTER_GUIDE.md](docs/VFX_MASTER_GUIDE.md) — researched After Effects techniques adapted to EffectCraft.
4. [docs/VFX_LEARNING_LOG.md](docs/VFX_LEARNING_LOG.md) — living record of failures, corrections and approved patterns.
5. [docs/VFX_SOURCES.md](docs/VFX_SOURCES.md) — primary references and provenance.
6. [docs/VFX_BRIEF_TEMPLATE.md](docs/VFX_BRIEF_TEMPLATE.md) — storyboard/acceptance template.

Every fighting-game recipe now needs a `recipes/briefs/<name>.json` with gameplay/timing/draw-order metadata validated by `tools/validate_fighting_recipe.py`. The exporter runs an **automatic knowledge preflight** and records SHA-256 digests of these documents in its `knowledge.json` output for traceability. It cannot replace a human/agent actually reading the docs or visually reviewing the result.

```bash
python tools/vfx_preflight.py --effect hit-light
```

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

GitHub Actions runs offline Python tests on each push/PR. A separate integration workflow compiles the pinned EffectCraft CLI; the official release smoke workflow has already verified MCP and real PNG alpha / spritesheet export. The current hit-light recipe is a **technical fixture**, not production-approved art.

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
