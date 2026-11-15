# EffectCraft integration — M1

## Why the integration uses the upstream binary

EffectCraft's Rust code has separate engine, CLI, MCP and UI layers. VFX Studio uses the public engine-command API instead of duplicating internal crates or modifying the application without tests. The upstream revision is stored in `effectcraft.lock.json`.

### On a development computer

```bash
python -m pip install -r requirements.txt
python tools/effectcraft.py install
python tools/effectcraft.py build
python tools/effectcraft.py editor
```

The build helper builds the upstream desktop app and CLI in release mode. For a faster CLI-only debug build, use:

```bash
cd vendor/effectcraft
cargo build -p effectcraft-cli --locked
cd ../..
```

### Produce the first editable impact and game spritesheet

```bash
python tools/vfx_pipeline.py \
  --cli vendor/effectcraft/target/debug/effectcraft-cli \
  --recipe recipes/hit-light.json \
  --out dist/hit-light \
  --frames 10 --fps 24 --columns 4
```

This creates:
- `dist/hit-light/effect.ecproj` — the real EffectCraft native editable project
- `dist/hit-light/frames/` — frames rendered through the CLI with `--transparent`
- `dist/hit-light/atlas.png` — untrimmed PNG spritesheet
- `dist/hit-light/atlas.json` — animation frame coordinates and timing

The first impact recipe is intentionally simple (two colored circles with scale/opacity keyframes), intended as an **integration fixture**, not as final approved anime artwork. No character sprites are inserted or redrawn.

### MCP

```bash
python tools/effectcraft_mcp_smoke.py \
  --cli vendor/effectcraft/target/debug/effectcraft-cli \
  --out dist/mcp-smoke.png
```

This uses stdin/stdout JSON-RPC 2.0, initializing MCP, discovering available tools, invoking `get_state`, and rendering a transparent PNG. The UI bridge requires a desktop window and is a later step.

### GitHub Actions

- `check.yml`: fast offline Python tests, runs every push/PR.
- `effectcraft-smoke.yml`: checks out **pinned real Rust source**, builds EffectCraft CLI, tests MCP, creates `.ecproj` and renders/exports an animation. Runs on relevant pushes or manually.
- Output artifact: `effectcraft-vfx-smoke` once the Rust workflow succeeds.

**Known boundary:** the automated smoke test validates a headless CLI, not a graphical desktop session. UI functionality must still be tested in a real desktop environment.

## Extending the recipe format

Each JSON recipe is an array of commands accepted by `effectcraft-cli run --commands`. For example, `comp.new`, `layer.newShape`, and `prop.addKey`. Commands are not a parallel custom engine; they are EffectCraft's public commands. Consult the pinned upstream [agents reference](https://github.com/storytold/effectcraft/blob/main/docs/agents.md) for actual command parameters.
