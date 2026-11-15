# Fontes estudadas — VFX Studio

**Pesquisa:** 2026-11-15. Fontes primárias da Adobe, manuais de ferramentas, apresentações de profissionais de jogos e discussão técnica de comunidade. Sínteses em [VFX_MASTER_GUIDE.md](VFX_MASTER_GUIDE.md). URLs não constituem endosso ou prova de paridade técnica entre After Effects e EffectCraft.

| ID | Fonte | Aprendizado aplicado |
|---|---|---|
| S01 | [Adobe — Animation basics](https://helpx.adobe.com/after-effects/desktop/animate-in-after-effects/animation-basics/animation-basics.html) | Animação por propriedades, keyframes, gráficos de valor e velocidade |
| S02 | [Adobe — Speed between keyframes](https://helpx.adobe.com/after-effects/desktop/animate-in-after-effects/speed-between-keyframes/speed.html) | Gráfico de velocidade, influência, Easy Ease, distinção entre intervalos temporais e distância |
| S03 | [Adobe — Shape attributes & path operations](https://helpx.adobe.com/after-effects/desktop/drawing-painting-and-paths/shapes-and-shape-attributes/shape-attributes-paint-operations-path.html) | Trim Paths, Repeater, Offset Paths e deformadores |
| S04 | [Adobe — Offset Paths](https://helpx.adobe.com/after-effects/desktop/drawing-painting-and-paths/shapes-and-shape-attributes/use-offset-paths.html) | Crescimento/contração de paths sem destruir a forma |
| S05 | [Adobe — Alpha channels, masks & mattes](https://helpx.adobe.com/after-effects/desktop/work-with-transparency-and-compositing/work-with-alpha-channels-and-masks/alpha-channels-masks-mattes.html) | Máscaras, alfa, recorte e composição |
| S06 | [Adobe — Time effects](https://helpx.adobe.com/after-effects/desktop/apply-effects-and-animation-presets/list-of-effects/time-effects.html) | Motion blur, shutter angle/samples, Posterize Time |
| S07 | [Adobe — Expression language](https://helpx.adobe.com/after-effects/desktop/work-with-expressions/expression-language-reference/expression-language-reference.html) | Expressões, tempo, loop e posterizeTime |
| S08 | [Adobe — Expression examples](https://helpx.adobe.com/after-effects/desktop/work-with-expressions/expression-examples/expression-examples.html) | Uso prático de wiggle e variação controlada |
| S09 | [GDC 2017 — Artistic Principles of VFX (Keyser, Chamberlin)](https://media.gdcvault.com/gdc2017/Presentations/Chamberlin_Keyser_ArtisticPrinciplesVFX.pdf) | Gameplay, shape, área, contraste/foco, cor, timing |
| S10 | [GDC 2018 — Zip! Thwack! Ping! Animation Principles of VFX (Lyndon)](https://media.gdcvault.com/gdc2018/presentations/Lyndon_Michael_ZipThwackPing.pdf) | Animação aplicada a VFX: timing, poses, antecipação, squash & stretch, follow-through |
| S11 | [Shin & Kim (2024) — Directing of Stylized Game Effects to Increase Hit Impact](https://aodr.org/xml/39681/39681.pdf) | Estudo sobre clareza de forma, saturação, timing e percepção de impacto |
| S12 | [Real Time VFX — VFX learning adventure](https://realtimevfx.com/t/shackmans-vfx-learning-adventure/26212) | Direção de forma, intensidade e contraste em função da importância no jogo |
| S13 | [Real Time VFX / VFX Apprentice — Block-ins and Timing](https://realtimevfx.com/t/block-ins-and-timing/29830) | Pré-visualização com sólidos e timing antes do polimento |
| S14 | [Adobe — Straight vs premultiplied alpha](https://helpx.adobe.com/after-effects/desktop/work-with-footage-items/import-and-interpret-footage-items/importing-interpreting-footage-items.html) | Halos e interpretação dos canais alfa |
| S15 | [Adobe — Render/export basics](https://helpx.adobe.com/after-effects/desktop/render-and-export/basics-of-rendering-and-exporting/basics-rendering-exporting.html) | Render Queue, canais de saída, RGB+Alpha e codec adequado |
| S16 | [Unity Manual — Sprite Atlas](https://docs.unity3d.com/cn/2018.3/Manual/class-SpriteAtlas.html) e [Sprite import settings](https://docs.unity3d.com/cn/2022.3/Manual/texture-type-sprite.html) | Padding e parâmetros de importação/alpha para evitar bleeding e artefatos |
| S17 | [EffectCraft — Agents/CLI/MCP (rev fixada)](https://github.com/storytold/effectcraft/blob/dc2380b070fab3d80a16d00d0ea2f19e6cafa876/docs/agents.md) | Comandos nativos, projetos, renderização de frames, automação |
| S18 | [EffectCraft — Architecture (rev fixada)](https://github.com/storytold/effectcraft/blob/dc2380b070fab3d80a16d00d0ea2f19e6cafa876/docs/architecture.md) | Camadas engine/render/effects/export/UI, formato `.ecproj` |
| S19 | [EffectCraft — MCP conventions (rev fixada)](https://github.com/storytold/effectcraft/blob/dc2380b070fab3d80a16d00d0ea2f19e6cafa876/docs/mcp.md) | Ferramentas MCP, isolamento de arquivos, limites da automação |
| S20 | [EffectCraft — Release 0.24.1](https://github.com/storytold/effectcraft/releases/tag/v0.24.1) | Binário Linux utilizado no teste de integração real |

**Critérios de confiabilidade:** propriedades do AE vêm da Adobe; regras de direção e produção são sínteses originais de apresentações e experiência de profissionais de VFX; compatibilidade do EffectCraft vem de seus documentos/código e dos testes do nosso próprio repositório. Não inferir que um efeito com o mesmo nome tenha controles ou resultados pixel a pixel idênticos.

**Nota sobre GDC PDFs:** resumo baseado no texto recuperável da apresentação; não interpretar uma figura específica como medição sem consultar a lâmina correspondente. A referência acadêmica S11 contém achados específicos de seu próprio experimento, não metas universais de design.
