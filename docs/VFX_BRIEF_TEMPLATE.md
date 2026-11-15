# Brief + QA por efeito — copiar e preencher

> Ao iniciar um VFX novo, reler [ARCSYS_FIGHTING_VFX.md](ARCSYS_FIGHTING_VFX.md), [VFX_MASTER_GUIDE.md](VFX_MASTER_GUIDE.md) e [VFX_LEARNING_LOG.md](VFX_LEARNING_LOG.md). Para fighting games, criar o sidecar JSON `recipes/briefs/<nome>.json` conforme [hit-light.json](../recipes/briefs/hit-light.json) e validar via `tools/validate_fighting_recipe.py` antes do render.

## Brief
- **Nome / ID da receita:**
- **Jogo / plataforma / gameplay:** (genérico, SŌKON etc.)
- **Evento:** (hit, guard, dash, landing, trail, super etc.)
- **Mensagem visual:** (força, direção, perigo, defesa, leveza etc.)
- **Referência visual aprovada:**
- **Cor, contraste, silhueta, nível de detalhe:**
- **Perspectiva / ângulo / orientação:** (lateral, 3/4, frontal, top-down; direção)
- **Canvas / FPS / orçamento de frames:** (dimensões e alvo; não adivinhar)
- **Pivô de jogo / ponto de colisão:** (x, y e sua unidade)
- **Três poses-chave:** (contato, ápice, dissipação)
- **Curva de intensidade:** (ex.: 0 / 100 / 35 / 0)
- **Camadas:** (CORE, BODY, DEBRIS, SMOKE, GLOW etc.)
- **Planejamento de alfa:** (straight/premultiplied no engine, margens)
- **Critérios de aceitação visuais e técnicos:**

## Implementação
- **Revisão EffectCraft (`effectcraft.lock.json`):**
- **Recipe / `.ecproj`:**
- **CLI/MCP comandos verificados:**
- **Render real / GitHub Actions / evidência:**

## QA: não aprovar sem verificar
- [ ] Silhueta reconhecível em escala do jogo, também sem glow
- [ ] Timing do contato, ápice e dissipação
- [ ] Forma e direção condizem com o evento
- [ ] Coreografia não oculta personagem/rival/HUD de forma indevida
- [ ] Canvas, pivô, escala, número de frames e FPS consistentes
- [ ] PNG com alpha real quando há transparência, sem fundo preto/verde
- [ ] Nenhum corte/elemento estourando nas bordas
- [ ] Cores e detalhes consistentes com a referência aprovada
- [ ] Frames reais e preview verificados visualmente
- [ ] Dados de saída reimportados/testados no consumidor quando aplicável
- [ ] Entrada adicionada ao `docs/VFX_LEARNING_LOG.md`

**Estado final:** WIP / integração validada / arte aprovada / rejeitado. Se apenas o CI passou, registrar “integração validada”, não “arte aprovada”.
