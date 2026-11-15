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

## 2026-11-15 — Pesquisa direcionada: Arc System Works como referência principal de luta

- **Descoberta com fonte pública:** a [ASW Academy](https://www.arcsystemworks.jp/academy/) tem aulas de 2026 dedicadas a VFX de jogos de luta (hit/slash e gelo/fluídos) e aulas de 2025 sobre os efeitos de *Guilty Gear -Strive-*.
- **Relato específico (fonte secundária):** para preservar a leitura, separar massas grandes atrás dos lutadores e detalhes pequenos à frente. O efeito deve ajudar a comunicar trajetória/alcance em concordância com a área de ataque; ver [manual ArcSys](ARCSYS_FIGHTING_VFX.md).
- **Nossa adaptação:** exigir plano de oclusão, frame de colisão, política de hit-stop, pivô, perspectiva, frames de poses e restrições de render na recipe; sem brief, não executar o pipeline.
- **Lacuna identificada:** o atlas único do pipeline não implementa desenho atrás e à frente do personagem ao mesmo tempo. Futuros efeitos que exigem passes separados **não estão prontos para uso final**.
- **Estado:** pesquisa aplicada a documentação e regras de pré-validação; **não houve ainda revisão visual de uma nova arte ArcSys-style**. Não declarar qualidade artística aprovada.

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

### 2026-11-15 — Hit Heavy, auditoria independente

O núcleo atinge o máximo no quadro 2. As onze lascas mantêm movimento depois que ele some. Aos 320 px a cauda já perde leitura nos quadros 12–14. Para o próximo impacto, compare no jogo uma cauda mais curta antes de adicionar glow. O último quadro vazio é intencional. Evidência em [projeto e frames](../projects/hit-heavy/) e [auditoria](AUDIT_REPORT.md). Estado artístico WIP.

### 2026-11-15 — Integração dos gates ArcSys

O contrato de gameplay agora é validado junto com decisões citadas e margens observadas. Camadas omitidas no brief e segunda composição são rejeitadas. Light e heavy passaram novamente no EffectCraft real. Fases temporais declaradas ainda precisam de inspeção visual e confirmação no jogo.

### 2026-11-15 — SŌKON Pack v1

Criados cinco efeitos no EffectCraft 0.24.1, com 54 PNGs e projetos nativos. A cauda do impacto forte foi reduzida de 16 para 12 frames conforme a lição da auditoria. Leve/médio/forte usam silhuetas e quantidades de lascas diferentes (4/7/11). Defesa usa crescente aberta e spray, pouso usa paths Bezier acima do solo. A inspeção dos quadros mostra geometrias ainda marcadas na defesa e lobos repetidos na poeira. Recomenda-se ruptura de silhueta adicional na próxima revisão. O teste de atlas recuperou os pixels de todos os frames. Margem mínima de 39 px. Evidência e critérios em projects/sokon-pack-v1/README.md e no ZIP packs/sokon-vfx-pack-v1.zip. Status WIP com gameplay pendente.
