# Architecture — VFX Studio v0.1

## Design decision

EffectCraft is maintained upstream. VFX Studio uses it as a compositing and animation backend, **not** as copied/rebranded code. The Git-ignored local checkout is pinned to a known commit in `effectcraft.lock.json`.

## Pipeline

1. **Editor**: upstream EffectCraft UI creates a composition and stores it as `.ecproj`.
2. **Automation**: EffectCraft's own CLI / MCP controls compositions, keyframes, effects and renders.
3. **Render**: transparent RGBA PNG sequence exported by EffectCraft.
4. **Packaging**: the VFX Studio Python exporter packs those frames without modification into a transparent atlas, and emits per-frame rectangles/duration as JSON.
5. **Consumption**: any 2D game engine can map the JSON frames to its own animation format.

EffectCraft's Rust codebase separates its project model, effects, renderer, engine, egui UI, CLI and MCP automation. We avoid dependencies on private Rust internals at this stage.

## Minimum VFX quality rules

- Constant, explicit frame size; consistent anchor/pivot.
- Alpha channel is mandatory for game exports; no green/black chroma backgrounds.
- No visual elements clipped by image boundaries.
- VFX and character sprites remain separate, composited in the game.
- Preserve source frame order, geometry, pixel values and timing; reject accidental RGB or mismatched frame sizes.
- Maintain animation preview/review before approving production presets.

## Roadmap / actual status

- **M0 implemented**: version pin, install/build/launch helper, atlas/JSON exporter, Python CI tests and catalog.
- **M1 not yet verified**: compile upstream on a workstation/CI, test MCP bridge and headless rendering with the pinned revision.
- **M2 planned**: six editable `.ecproj` starter effects (light/medium/heavy hit, guard air pressure, dash smoke and strike trail).
- **M3 planned**: frame-preview/contact-sheet validation, palette variants, standardized pivots, batch rendering and formats for common engines.

The catalog describes *planned* VFX families, not rendered or approved content.

## Compliance

Upstream [EffectCraft](https://github.com/storytold/effectcraft) uses `MIT OR Apache-2.0`. Any distributed fork, original binaries or upstream assets require the upstream LICENSE/NOTICE and applicable third-party attributions. This separate bootstrap is MIT-licensed.
