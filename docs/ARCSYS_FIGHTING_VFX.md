# Arc System Works — escola de VFX para jogos de luta
**VFX Studio / versão 1.0 / 2026-11-15**

> **Referência principal para criação e revisão de VFX de luta.** O nome correto do estúdio é **Arc System Works (ArcSys)**, criador de *Guilty Gear* e de *Dragon Ball FighterZ*. São técnicas e princípios de design, **não** assets nem código extraídos dos jogos. Criar arte original, sem copiar sprites, texturas, personagens ou golpes proprietários.
>
> **Rigor das evidências:** “relato oficial” significa descrição pública da ASW ou entrevistas de sua equipe; “síntese secundária” significa reportagem sobre uma palestra; “regra do VFX Studio” é nossa adaptação, a validar no jogo. Não afirmar que assistimos ou analisamos frame a frame os vídeos se só consultamos descrições e reportagens.

## 1. Material oficial e o que ensina

| ID | Fonte | Aprendizado fundamentado |
|---|---|---|
| ARC01 | [ASW Academy — Como fazer efeitos de jogos de luta, parte 1 (22/abr/2026)](https://www.arcsystemworks.jp/movie/movie-31203/) e [índice oficial ASW Academy](https://www.arcsystemworks.jp/academy/) | Introduz papel de VFX em jogo de luta; exemplos de **hit** e **slash**; conceitos de comunicação visual |
| ARC02 | [ASW Academy — Como fazer efeitos de jogos de luta, parte 2 (29/abr/2026)](https://www.arcsystemworks.jp/movie/movie-31206/) | Exemplos de gelo e efeitos fluidos; storyboards, texturas, ajustes no motor. Não confundir simulação 3D com recurso pronto do EffectCraft |
| ARC03 | [ASW Academy — Técnicas de produção de efeitos em *Guilty Gear -Strive-* 1 (8/out/2025)](https://www.youtube.com/watch?v=vha6dkrVvZ0) | Segundo a descrição oficial, efeitos vistosos **sem sacrificar a visibilidade** |
| ARC04 | [ASW Academy — *Guilty Gear -Strive-* 2 (15/out/2025)](https://www.youtube.com/watch?v=nTZM-1SDAp4) | Produção de efeitos para story mode / encenação; separar cutscene de gameplay |
| ARC05 | [Unreal Engine — entrevista com a equipe de *Guilty Gear -Strive-*](https://www.unrealengine.com/developer-interviews/how-guilty-gear--strive--hits-an-ultra-combo-with-groundbreaking-visuals-and-gameplay?lang=en-US) | A equipe relata **direção manual de cor/sombreamento**, animação limitada intencional e cooperação entre efeitos, animação, programação e cenários |
| ARC06 | [GDC — Motomura, *Guilty Gear Xrd's Art Style: The X Factor Between 2D and 3D* (2015)](https://www.gdcvault.com/play/1022031) | 3D com linguagem de anime 2D, escolhas artísticas deliberadas acima da reprodução física automática |
| ARC07 | [CGWORLD 2021 — Background & Effects Artwork de Strive](https://cgworld.jp/special/cgwcc2021/schedule/arc/index.html) | Palestra de Kazuya Ogawa, artista de efeitos; lista **After Effects, Photoshop, Clip Studio Paint e 3ds Max** como ferramentas usadas para a parte de efeitos |
| ARC08 | [GameMakers — síntese da ASW Academy 2026](https://gamemakers.jp/article/2026_05_07_136647/) | Síntese secundária: efeito comunica alcance/trajectória; alinhamento entre representação e ataque; impactos, slashes, gelo e água |
| ARC09 | [GameMakers — síntese da ASW Academy 2025](https://gamemakers.jp/article/2025_10_10_120081/) | Síntese secundária: **grandes massas atrás dos personagens** e faíscas/detalhes menores à frente; draw priority, dithering, materiais, VAT e arte manual em cutscenes |

**Limite:** não se pode deduzir parâmetros exatos, frame counts, hit-stop, blend mode ou material/shader da ASW a partir dos resumos. Os exemplos abaixo são **regras internas de produção e testes**, não uma receita revelada pela ArcSys. Para aprofundamento, assistir diretamente às aulas e anotar tempos/frames com evidência.

## 2. Dez mandamentos de VFX para luta

1. **Gameplay é o contrato.** O efeito deve comunicar ataque, defesa, alcance e força — e não indicar um golpe onde o motor não permite contato. Referências ARC01, ARC08.
2. **Lutadores visíveis.** Separar massa de fundo e detalhes de primeiro plano. Aumentar espetáculo pelo desenho, não ocultando corpo/hitbox. ARC03, ARC09.
3. **Impacto no contato correto.** Sincronizar o frame zero do VFX com o evento de colisão do jogo, não com o início do ataque. A referência interna pode ter preparação apenas se a mecânica tiver telegraph apropriado.
4. **Frame de ápice forte, não interpolação genérica.** Projetar pose de contacto, pico, ruptura e dissipação; preferir smear desenhado e holds deliberados quando ajudam a linguagem anime. ARC05 (direção intencional) + adaptação nossa.
5. **Direção legível.** Hit segue vetor de contato; slash acompanha arco da arma/membro; dash/landing seguem plano do solo; guard aponta para fora do ponto defendido.
6. **Hierarquia de massa.** Body de cor sólida, hot core, lascas com orientação, detalhes secundários e glow de acabamento. Se cortar o glow, o golpe deve continuar funcionando.
7. **Coerência de força.** Leve/médio/forte não são só escala: mudam silhueta, quantidade de massa, dispersão, duração e ritmo. Heurística interna.
8. **Planos/oclusão explícitos.** Definir ``behind_character``, ``character_plane`` e ``front_detail``; evitar massas opacas cobrindo o lutador no primeiro plano. ARC03, ARC09.
9. **Câmera é contexto.** ASW usa técnicas cinematográficas e 3D; para sprites 2D, o default é **câmera lateral fixa**, pivô/perspectiva corretos e asset 2D original. Não inserir uma câmera 3D por imitação superficial. ARC05, ARC06.
10. **Sem teste no jogo, sem aprovação artística.** Validar frame a frame, em velocidade real, com fundo claro e escuro, ambos lutadores, HUD e situações de combo; registrar evidências e rejeições.

## 3. Receita temporal: cinco fases

A receita **deve registrar frames inteiros**, relativos ao início do VFX (primeiro quadro = 0).

| Fase | Pergunta que a pose deve responder | Arte |
|---|---|---|
| `contact` | Onde o golpe acertou? | hotspot, flash, forma de origem |
| `peak` | Qual foi a força e direção? | silhueta máxima; body, hot core, contraste |
| `breakup` | Para onde a energia foi? | lascas com momentum; choque não tapa lutador |
| `settle` | Como a energia desacelera? | massa secundária menor, dissipação, poeira |
| `clear` | Quando a tela fica livre? | sem partículas persistentes não planejadas |

Pares de poses entre as batidas podem ter tempos distintos; não usar Ease em tudo. A evolução `contact <= peak <= breakup <= settle <= clear < frame_count` é validável estaticamente, mas **não comprova** que o ritmo visual funciona.

**Hit-stop pertence ao jogo.** Declarar `hitstop_policy`: `pause_vfx_with_game`, `continue_vfx_during_stop` ou `engine_defined`. É proibido descrever hit-stop como “feito pelo EffectCraft” sem integração concreta do player do jogo. Testar a cadência real de animação com hit-stop e com a versão sem pausa.

## 4. Ordem de desenho e espaço visual

Default interno inspirado na solução relatada pela ASW:
- ``background_mass``: onda, arco, poeira grande, ring e brilho largo **atrás** do plano do personagem.
- ``contact_core``: zona de impacto pontual, pode cruzar área do contato por curta duração.
- ``foreground_accents``: pequenas faíscas, fragmentos e highlights **na frente**, com área limitada.
- ``optional_ground``: poeira/pressão do solo ancorada ao chão. Evitar “pedaço do cenário” embutido na textura.

**Aviso:** exportar um único atlas achatado impede escolher prioridade de desenho por subcamada no game. Se a receita exigir BG e FG distintos, produzir **dois atlases independentes**, ou render em passes separados e preservar pivô/timing comum. O pipeline atual gera **um atlas**, portanto uma receita que exige profundidade real entre personagens deve ficar **pendente de integração** até existir export multipass.

## 5. Família de golpes e sinais visuais

**Hit leve:** flash conciso, baixo bloqueio visual, saída rápida, corpo compacto, poucas lascas.

**Hit médio:** assimetria mais marcada, body expressivo, ruptura mais longa, zona principal ainda localizada na colisão.

**Hit forte:** silhueta explosiva, massa opaca estilizada, core de contraste alto e fragmentos que continuam o movimento; **não** esticar todo o frame para a frente como um “poder” se o golpe é físico.

**Guard / parry / clash:** não usar o mesmo hit com cor diferente. Definir superfícies de contato, reação da defesa e direção de dispersão da pressão; para defesa em 3/4, a gota/oval abre para fora do choque.

**Slash / strike trail:** o trail começa na trajetória do membro ou lâmina; não é um projétil. Precisa de curvas e de uma ponta compatível com a velocidade; vincular pivô e orientação ao personagem. Visual sobreposto pode variar o brilho sem recriar o sprite.

**Projétil/energia:** distinguir telegraph, viagem, ativo, choque e dissipação; área visual principal não deve mentir sobre a área ativa do hitbox. Se ele já não está ativo, um resto de fumaça pode persistir, mas não deve sugerir nova colisão.

**Dash / landing smoke:** massas que se expandem rente ao piso seguindo a inércia; curva de dissipação e base encostada no solo. Não deixar arte atravessar o chão.

**Super/overdrive:** pode conter camadas cinematográficas, porém deve respeitar estados de jogador e câmera do jogo; separar gameplay VFX, HUD, zoom, câmera e efeitos de tela em sistemas independentes.

## 6. Critérios verificáveis por receita (nova convenção)

Toda recipe `recipes/NOME.json` terá um **brief sidecar** `recipes/briefs/NOME.json`. Ele não substitui os comandos nativos do EffectCraft, apenas define o que verificar. Campos mínimos:

- identidade: `id`, `schema_version`, `status`;
- contrato de gameplay: `event`, `strength`, `hitbox_reference`, `collision_frame`, `hitstop_policy`, `plane_policy`;
- projeção: `projection`, `orientation`, `pivot`, `canvas`;
- tempo: `fps`, `frames`, frames de `contact`/`peak`/`breakup`/`settle`/`clear`;
- arte: `silhouette_goal`, `direction_goal`, `layers` com `plane` e `role`;
- auditoria: `references`, `known_limitations`, `review_status`, `evidence`.

Os campos numéricos e estruturais são verificáveis automaticamente pelo script `tools/validate_fighting_recipe.py`. O julgamento de forma, alcance, gameplay e legibilidade **continua humano ou por inspeção visual com evidência**.

### Gates: condições de falha

**Bloquear antes de renderizar:**
- briefing ausente, campos obrigatórios em branco, canvas inválido, pivô fora do canvas, FPS e frame count não compatíveis com a composição;
- fases em ordem errada, colisão fora da duração, camera/perspectiva não declaradas;
- ausência de planos/objetivos visuais, referência ausente, inconsistência de ID;
- status de “arte aprovada” sem evidência de revisão e de integração real.

**Não marcar automaticamente como aprovado:**
- correspondência pixel a pixel entre VFX e hitbox do jogo: precisa de **dados reais do motor**;
- obscurecimento de personagens, silhueta anime, sensação de força e fidelidade ao concept: exige **preview em gameplay**;
- efeito “profissional”: depende de inspeção de frames e aprovação artística;
- paridade completa entre funcionalidades After Effects e EffectCraft.

## 7. Loop de aprendizado obrigatório

**Antes:** ler `AGENTS.md`, `VFX_MASTER_GUIDE.md`, `VFX_LEARNING_LOG.md` e este manual; preencher brief com referências + hipótese + poses-chave.

**Durante:** gerar rough de timing; comparar 4 poses e o loop; inspecionar dano/defesa/hitstop; anotar cada correção na mudança de parâmetros.

**Depois:** registrar no diário: diferença entre hipótese e resultado, frames com falha, mudança feita, render real, resultado no jogo, lição generalizável e decisão de status (`wip` / `technical-fixture` / `art-approved`).

**Evidência mínima:** link do projeto editável, atlas, GIF ou vídeo reais e workflow; captura em gameplay para aprovação visual. **Hash de documentação não demonstra leitura/compreensão**.

## 8. Ajustes de produção para SŌKON (exemplos, não padrões universais)

- Estética anime 2D: cel shading e contornos vivos; sem look 3D.
- Impactos: core branco, body laranja amplo, lascas amarelas; fundos com alpha; nas versões fortes evitar explosão comprida e magra sem massa; usar bordas irregulares.
- Trails nascem do membro/arma, ficam separados dos sprites dos personagens.
- Defesa: ar comprimido em 3/4 com sensação de gota que atinge a água, pequeno/oval e dissipa.
- Fumaças: dash/landing com continuidade e dissipação curta.
- Todos os critérios devem ser recalibrados conforme referências aprovadas por projeto. O material da ArcSys é uma **escola de direção**, não um style pack de outra franquia.

## 9. Fontes

Ver [docs/VFX_SOURCES.md](VFX_SOURCES.md) (ARC01–ARC09) e links diretos nesta seção. A documentação foi construída a partir de **fontes públicas e descrições oficiais**, não a partir de extração de sprites ou do acesso interno ao processo proprietário da ASW.
