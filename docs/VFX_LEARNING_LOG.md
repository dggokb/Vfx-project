# Diário vivo de aprendizado — VFX Studio

Atualizar **após toda tentativa relevante de novo efeito**. Este documento guarda decisões reutilizáveis; [VFX_MASTER_GUIDE.md](VFX_MASTER_GUIDE.md) contém o método principal. Não apagar falhas: marcar como resolvidas e registrar como.

## 2026-11-15 — Integração real EffectCraft 0.24.1

- **Contexto:** repositório `dggokb/Vfx-project`. O pipeline cria composição EffectCraft com `comp.new` / `layer.newShape`, anima `transform/scale` e `transform/opacity` e exporta 10 PNGs a 24 fps para um atlas.
- **Evidência real:** [workflow oficial de render](https://github.com/dggokb/Vfx-project/actions/runs/43711782704) — execução concluída com sucesso; MCP, PNG transparente, `.ecproj`, 10 frames, spritesheet e JSON.
- **Falha anterior:** [run anterior](https://github.com/dggokb/Vfx-project/actions/runs/43676609080) compilou o CLI mas o smoke exigiu RGBA no projeto de demonstração, que era totalmente opaco. O encoder da automação do EffectCraft pode escrever RGB quando todos os pixels são opacos; **não** é evidência de falha de alpha.
- **Correção validada:** criar uma composição com fundo efetivamente transparente e círculo visível; verificar canto alfa 0 e centro alfa >0; não apenas verificar a existência do quarto canal numa cena opaca.
- **Outra falha de CI resolvida:** Ubuntu 24.04 usa `libasound2t64` no pacote de runtime usado no workflow oficial; a instalação anterior tentava `libasound2`.
- **Lição de arte:** o primeiro hit-light em círculos é **somente smoke test técnico**, não um efeito final de qualidade profissional. Próxima iteração precisa de silhueta irregular, lascas, ritmo mais orgânico e avaliação em escala real.
- **Status:** integração **headless** verificada; editor desktop/UI e paridade total de expressão/effects **não verificados**.

## Template para nova entrada

### AAAA-MM-DD — Nome do VFX / versão

- **Objetivo de gameplay / aparência esperada:**
- **Referência aprovada pelo solicitante:**
- **Hipótese:** o que será testado e por quê?
- **EffectCraft:** versão/revisão, caminhos de recipe/projeto, comando/efeitos usados:
- **Parâmetros testados:** resolução, FPS, frames, pivô, cores, curvas:
- **Evidência:** workflow, commit, frames, GIF ou vídeo **real**:
- **Observação:** quais frames e qual problema visual apareceu?
- **Falha, causa provável e correção:**
- **Resultado:** WIP / tecnicamente validado / arte aprovada / rejeitado:
- **Lição reutilizável:** regra concreta para a próxima criação:
- **Atualização do guia principal (se necessária):**
