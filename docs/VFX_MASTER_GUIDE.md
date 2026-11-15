# VFX Studio — Manual Mestre de VFX 2D
## Técnicas de Adobe After Effects aplicadas ao EffectCraft

**Versão:** 1.0 · **Pesquisa verificada:** 2026-11-15 · **Linguagem:** pt-BR · **Uso:** obrigatório em todo novo efeito.

> Este é um **guia de direção, composição e animação**, não uma afirmação de equivalência completa entre Adobe After Effects e EffectCraft. O After Effects é a referência conceitual; executamos nossas animações com a versão fixada de **EffectCraft**. Toda possibilidade específica do EffectCraft precisa ser confirmada na CLI/MCP dessa versão. Referências externas e limites estão em [VFX_SOURCES.md](VFX_SOURCES.md). Evoluções práticas ficam em [VFX_LEARNING_LOG.md](VFX_LEARNING_LOG.md).

## Especialização para jogos de luta — PRIORIDADE MÁXIMA

Antes de qualquer impacto, defesa, slash, dash, trail ou projétil, ler [ARCSYS_FIGHTING_VFX.md](ARCSYS_FIGHTING_VFX.md), com fontes diretas da Arc System Works Academy e as restrições de oclusão/hitbox/hit-stop. Este manual cobre a **técnica de animação e composição**; o documento ArcSys cobre o **contrato de gameplay e direção de luta**. Os dois são necessários.

## 0. A regra que vem antes dos efeitos

**Um VFX profissional comunica um evento do jogo antes de impressionar visualmente.** Primeiro, a forma e o ritmo; depois, detalhes. Em jogos, o impacto deve dizer *onde*, *quando*, *qual direção* e *quanta força*; deve também desaparecer sem confundir a próxima ação. Artistas da GDC priorizam jogabilidade, forma/área, contraste/foco, identidade de cor e timing; estudos sobre VFX estilizados também apontam a importância de ritmo, saturação e clareza do contorno. [S09, S10, S11]

**Ordem de produção:** brief → silhueta e poses-chave → animatic em tons de cinza → curvas e espaçamento → formas secundárias → cor → glow/blur → export → teste no tamanho real → correção → registro.

**Proibido:** tratar simples círculos com escala/opacidade como “arte de impacto profissional”, usar brilho para esconder forma fraca, encher a tela de partículas sem direção, cortar o VFX nas bordas ou chamar mock de render final.

## 1. Anatomia temporal do VFX

Uma animação de ataque costuma ter estas **batidas** (a distribuição exata depende da mecânica):

1. **Preparação / telegraph**: quando a ação exige indicação antecipada, energia se concentra; para golpes reativos, preparação pode pertencer ao personagem, e o VFX começar no contato.
2. **Contato / flash**: contraste alto e curto; foco na colisão.
3. **Expansão / choque**: corpo principal se abre e deixa explícita a direção/força.
4. **Ruptura / follow-through**: lascas, faíscas, riscos ou poeira herdam a velocidade e perdem energia.
5. **Dissipação**: massas se separam, perdem opacidade/área e deixam a tela limpa.

**Frame de impacto** é uma escolha de direção: pode ser branco e pequeno, branco e grande, vazado, rachado ou sem flash. Primeiro definir a silhueta legível do ápice.

**Ritmo** ≠ espaçamento uniforme. Evitar “20 quadros da mesma forma crescendo linearmente”. Fazer saltos perceptíveis de geometria e ritmo: ataque rápido → ápice abrupto → cauda mais longa e progressivamente fragmentada.

### Exemplos de planejamento (heurísticas internas, NÃO normas da Adobe)

| Família | Exemplo inicial a 24 fps | Enfoque |
|---|---|---|
| Acerto leve | 6–10 frames | Flash no contato, expansão curta, saída rápida |
| Acerto médio | 8–14 frames | Núcleo, choque e mais ruptura lateral |
| Acerto pesado | 10–18 frames | Massa principal, clímax agressivo, detritos desacelerando |
| Bloqueio/defesa | 5–10 frames | Contato oval/achatado, pressão se dispersando |
| Dash / pouso | 8–16 frames | Direção tangencial ao piso, poeira segue inércia |
| Trail de golpe | Segue frames da ação | Nasce da trajetória do membro/arma, desaparece ao terminar a ação |

Os intervalos acima são **estimativas para prototipagem**, não resultados medidos nem duração obrigatória. Ajustar ao hit-stop, sistema de combate, FPS e escala reais. Diferenciar duração *do efeito* de duração *do evento/hitbox*.

## 2. Técnicas essenciais de After Effects — traduzidas em decisões visuais

### 2.1 Keyframes, espaçamento e Graph Editor

- **Value Graph:** revela valores de posição, escala, opacidade etc. ao longo do tempo.
- **Speed Graph:** revela velocidade entre keyframes. Intervalo temporal menor para o mesmo deslocamento = movimento mais rápido.
- **Easy Ease:** suaviza entradas/saídas, mas **não** é um botão universal de qualidade. Para golpes, frequentemente manter a abertura instantânea, desaceleração assimétrica e dissolução final mais lenta; suavização em todas as chaves pode enfraquecer a pancada.
- **Hold/Stepped:** adequado para estalos, troca de desenho, flashes de um frame e estilo anime com poses fortes; não aplicar sem propósito.
- **Bezier:** adequado para aceleração e desaceleração controladas. O desenho da curva deve seguir a intenção do movimento. [S01, S02]

**Exercício padrão:** renderizar primeiro só 4 poses: antes / contato / expansão / desaparecimento. Se o impacto não for legível nessas 4 poses, não prosseguir para Glow.

### 2.2 Shape Layers e operadores de path

- **Paths e strokes:** constroem arcos de energia, anéis, rachaduras, lâminas, riscos e contornos desenhados sem perder editabilidade.
- **Trim Paths:** revela/esconde parte de um contorno, útil para sweep/arc/trail.
- **Offset Paths:** expande/contrai um path sem destruir o original, útil para ondas de choque e contornos em camadas.
- **Repeater:** multiplica elementos rítmicos sem desenho manual; não deixar a repetição mecanicamente uniforme quando o estilo pede caos.
- **Pucker/Bloat:** deforma a borda e pode criar ruptura menos circular; usar com moderação para não perder direção.
- **Máscaras/track mattes:** recortam ou revelam camadas, preservando um núcleo, uma janela ou um padrão de dissipação. [S03, S04, S05]

**Orientação estética:** muitos impactos de luta ficam melhores com silhueta irregular e vazios internos do que com um círculo perfeito. Fazer o corpo de cor forte, o flash de valor alto e os fragmentos como grupos distintos.

### 2.3 Hierarquia do brilho / glow

A ordem de leitura deve ser: **silhueta do corpo → zona quente do núcleo → detalhe secundário → halo suave**. Brilho não deve substituir massa. Testar duas versões:
- **Sem glow:** contorno/forma continuam legíveis?
- **Com glow:** a identidade da forma não virou uma mancha?

Tratar raio/intensidade de glow como parâmetros de direção, não aumentar ambos até estourar. Preferir corpo opaco/sólido em golpes estilizados, mantendo brilho periférico apenas onde cabe. Para fumaça e poeira, glow geralmente é desnecessário.

### 2.4 Motion blur e frame stepping

Motion blur simula exposição durante movimento. No AE, o **shutter angle** e amostras controlam extensão/qualidade do borrão; o efeito **Posterize Time** reduz a taxa percebida de uma camada. [S06]

Em VFX anime:
- **Smear frame desenhado** (forma esticada/agressiva) e **motion blur óptico** não são sinônimos.
- Preferir o smear de silhueta quando blur contínuo apagar o traço.
- Aplicar blur seletivo nas partículas ou na cauda do trail, deixando o núcleo/impacto nítido.
- Renderizar um teste com blur desligado; se a leitura melhorar, reduzir.
- O FPS da composição e a cadência efetiva de desenho podem ser diferentes: não importar cegamente `posterizeTime(12)` sem testar equivalência no EffectCraft.

### 2.5 Expressões — para variar, não para substituir direção

Conceitos do After Effects:
- `time * 40`: rotação contínua (graus por segundo em uma propriedade de rotação).
- `wiggle(2, 30)`: variação de propriedade, com frequência 2/s e amplitude em torno de 30 nas unidades da propriedade.
- `loopOut("cycle")`: repetir uma animação já keyframed.
- `posterizeTime(12)`: diminuir amostragem temporal de uma expressão. [S07, S08]

**Cuidado:** essas são fórmulas da **linguagem do AE**. O EffectCraft inclui um motor de expressões, mas suporte de função, propriedade, sintaxe e comportamento exatos precisam de teste na versão fixada antes de usar em produção. Preferir keyframes explícitos para os clímax, usando expressões para detalhes secundários controlados.

### 2.6 Precomposition, camadas e matrizes

Separar visualmente por função:
1. **CORE:** pico luminoso e núcleo de impacto.
2. **BODY:** massa principal colorida e contorno.
3. **SHOCK:** onda, anel ou ar comprimido.
4. **DEBRIS:** lascas/faíscas fragmentadas.
5. **SMOKE:** poeira ou vapor residual.
6. **GLOW:** halo, duplicação borrada, detalhes luminosos controlados.

Isso facilita correções sem refazer a imagem. A composição deve poder desligar cada função isoladamente para diagnóstico. Distinguir **pivô de colocação no jogo** de **centro geométrico do desenho**.

## 3. Direção de formas: como parar de produzir efeitos genéricos

**Prioridade 1: silhueta.** Se toda a animação for preenchida de branco, ainda deve existir um “golpe” reconhecível. Se só restar uma bola, redesenhar a massa.

**Prioridade 2: movimento direcional.** Um slash cresce ao longo de um arco; uma onda de chão se abre rente ao piso; um soco bloqueado gera pressão no ponto de contato; o rastro acompanha a mão/perna, não se comporta como um projétil disparado.

**Prioridade 3: hierarquia de escala.** Núcleo (primário), massa (primário), lascas (secundário), poeira (terciário). Evitar 20 elementos competindo pelo mesmo contraste.

**Prioridade 4: assimetria com intenção.** Irregularidade não é ruído aleatório. Lasca tem base, direção e momento de saída. Espinhos/triângulos devem apontar para fora do impacto, não para dentro sem motivo.

**Prioridade 5: destino de cada elemento.** Fragmentos desaceleram e dissipam/encolhem; fumaça expande e perde densidade; ondas de choque alargam e afinam. Se a partícula simplesmente some sem causa visual, experimentar uma saída melhor.

**Princípios de produção de jogos:** contraste e foco devem apontar para o evento, não esconder leitura de hitbox, lutador, defesa ou próximo ataque. [S09, S10, S12]

## 4. Receitas de direção — um ponto de partida para o catálogo

### A. HIT LIGHT — contato curto

- Pequeno flash central 1–2 frames, corpo irregular compacto e 2–5 lascas com direções complementares.
- Crescimento mais rápido que dissipação. Camadas: CORE, BODY, DEBRIS.
- Verificar: legível sem glow e sem manchas retangulares.

### B. HIT MEDIUM — peso e direção

- Massa lateral ou radial conforme o vetor do golpe, núcleo claro sem dominar tudo, choque secundário em timing diferente.
- Não “apenas aumentar o hit light”: alterar **estrutura e ritmo**.

### C. HIT HEAVY — clímax anime

- Núcleo branco marcante, corpo laranja/amarelo grande e opaco, borda irregular, lascas com follow-through, final menos preenchido.
- Ter ao menos uma pose de ápice forte: **não** tornar tudo uma linha longa à frente da mão.
- Testar o contato sobre personagem e rival sem esconder a reação/hitbox além do necessário.

### D. GUARD PRESSURE — pressão de ar em 3/4

- Não é magia circular nem projétil.
- A colisão forma uma gota/oval comprimido que abre **para fora da superfície de defesa**, vista em 3/4; bordas finas, cauda difusa, ápice de curto alcance.
- Versões leve/média/forte mantêm a mesma linguagem formal; variam extensão, ritmo e quantidade de spray.

### E. DASH / LANDING SMOKE — poeira

- No dash, a poeira é arrastada para trás do deslocamento; no pouso, expande rente ao chão e sobe em volumes coerentes.
- Evitar fumaça sólida, repetitiva ou que permaneça imóvel.
- As massas devem se separar e dissipar, mantendo contato visual com o chão.

### F. STRIKE TRAIL — rastro, **não** poder

- É uma **consequência do deslocamento** de braço/perna/arma. Começa próximo do movimento real, cresce e afina ao longo do arco.
- Ponta curva/cortante; massa pode ser opaca, com apenas cauda translúcida; manter origem presa ao ponto certo.
- **Nunca refazer o personagem inteiro para adicionar trail**: compor VFX sobre a sequência original com layer separado, coordenadas e pivô controlados.
- Separar a cobertura do movimento e o acabamento do impacto: o trail pode cessar antes da onda de choque.

## 5. Prática: técnica de blockout (GDC / VFX Apprentice)

1. Compor primeiro **sólidos simples em cinza** com centro, massas e vazios.
2. Definir 3–5 poses decisivas antes de keyframes intermediários.
3. Anotar a curva de intensidade do efeito (ex.: 0 → 15 → 100 → 55 → 20 → 0).
4. Validar em loop, um frame de cada vez e na resolução real do jogo.
5. Só então trocar sólidos por paths detalhados, preencher cores, adicionar detritos, blur e glow.

A experiência de treino de timing no Real Time VFX mostra que blocos simples conservam a sensação de impacto mesmo sem texturas e shaders. Essa é uma técnica de processo, não uma garantia de qualidade automática. [S13]

## 6. Exportação, alfa, spritesheet e qualidade técnica

**Padrão de entrega do VFX Studio:**
- Original editável: `.ecproj`, mais receita de criação (JSON) quando automatizada.
- Frames: `frame_0000.png`, `frame_0001.png` etc., mesmo canvas, RGBA quando há transparência real.
- Pacote: `atlas.png` RGBA + `atlas.json` com coordenadas, FPS e duração.
- Preview: GIF/MP4 apenas para revisão, não substitui frames-fonte.
- Fundo: alfa verdadeiro, **não** cromakey verde/pretão.

**Canal alfa:** com “straight” o RGB não carrega a cor de fundo multiplicada; com “premultiplied”, valores RGB foram modificados pelo matte. Interpretar errado cria bordas escuras ou claras. A Adobe documenta essa diferença explicitamente. [S14, S15]

**Atenção ao motor EffectCraft:** o PNG do preview pode ser codificado em RGB se **todos os pixels forem totalmente opacos**, mesmo quando se pede modo transparente. Isso não prova erro de transparência. O teste correto cria fundo realmente transparente, verifica pixel alfa 0 no canto e conteúdo não transparente no centro. Caso do teste real em 2026-11-15 registrado no log.

**Prevenção de cortes:** deixar margem suficiente para forma, glow, blur e fragmentos no maior frame, e inspecionar pixel de borda. Não aceitar riscos horizontais/verticais criados por clipping.

**Importação no jogo:** confirmar se o engine usa alpha straight/premultiplied; filtrar cor/alpha com consistência. Em atlas com filtragem bilinear/mips, usar padding/extrusão compatíveis com engine para evitar vazamento entre células; alguns formatos e ferramentas permitem padding e “Alpha is Transparency”. [S16] O packer atual preserva canvas sem padding extra: **não** afirmar que resolveu bleeding para todos os motores. Se surgir, implementar opção de padding sob teste, sem reescalar a arte.

**Frame rate:** documentar FPS lógico do efeito e timing por frame. Ex.: 10 frames a 24 fps = ~0,417 s (o último índice é 9). A duração visual real depende da política de exibição do último frame no motor. Conferir com a animação rodando dentro do jogo.

## 7. Integração com EffectCraft (verificada vs planejada)

| Conceito de AE | Caminho EffectCraft | Estado |
|---|---|---|
| Composição | `comp.new`, arquivo `.ecproj` | Confirmado por integração real |
| Shape layers | `layer.newShape` com `kind`, `size`, `fill`, `position` | Confirmado no recipe/render |
| Keyframes | `prop.addKey` em `transform/scale` / `opacity` | Integrado no recipe/render |
| Prévia com alpha | `effectcraft-cli render-frame --transparent` / MCP `render_frame` | Confirmado com canvas transparente |
| Render de sequência | Sequência PNG via CLI + packer Python | Confirmado no pipeline |
| MCP | `effectcraft-cli mcp` com `tools/list` e `tools/call` | Confirmado em CI |
| Path trim/offset/repeater | Operações de path e shape pelo editor/engine | Documentado upstream; **parâmetros de comando requerem inspeção antes do uso** |
| Blur, glow, motion blur | Lista de efeitos e propriedades do EffectCraft | Documentado upstream; qualidade específica ainda requer render e review |
| Expressões `wiggle/loopOut/posterizeTime` | Motor de expressões EffectCraft | **Não assumir paridade exata**; validar cada função |
| UI desktop | Editor egui do EffectCraft | **Não testado** no pipeline headless |

Para novos comandos: primeiro usar `effectcraft-cli commands` / `effectcraft-cli exec --list --schemas` ou MCP `list_commands` / `describe_command`; **depois** montar parâmetros. Código-fonte upstream em revisão fixa, não copiar exemplos de versão diferente às cegas.

### Execução real mínima

```bash
python tools/vfx_preflight.py --effect hit-light
python tools/vfx_pipeline.py \
  --cli vendor/effectcraft/target/debug/effectcraft-cli \
  --recipe recipes/hit-light.json \
  --out dist/hit-light \
  --frames 10 --fps 24 --columns 4
```

O runner executa comandos nativos, salva `effect.ecproj` e rende PNGs antes de montar o atlas. Esse `hit-light` atual é apenas **fixture técnico simples**; o roteiro acima define o caminho de melhoria artística.

## 8. Revisão obrigatória: 3 modos de leitura + QA

**Modo 1 — forma:** ver o GIF em monocromático/sem glow. Silhueta, direção, escala e hierarquia funcionam? O frame máximo é memorável?

**Modo 2 — timing:** verificar início, clímax, cauda e último frame, tanto no GIF quanto frame a frame. Frames intermediários são funcionais ou só cópias de escala? Final termina limpo?

**Modo 3 — jogo:** testar sobre cenários claro/escuro, com personagem e rival visíveis, na escala de celular e em gameplay. Projeção/3⁄4 respeita espaço? Não tapa o HUD ou o ataque seguinte?

**QA automático mínimo:**
- PNGs do mesmo tamanho, ordenados e com pixel alfa correto.
- Pivô documentado, frame count e FPS consistentes com JSON.
- Nenhuma imagem inteiramente vazia sem intenção declarada.
- Transparência de cantos e espaço livre de borda; detectar clipping visual por inspeção.
- Arquivos reais anexados; não substituir por imagem simulada.

**Decisão de aceite:** [ ] leitura [ ] ritmo [ ] cor/identidade [ ] consistência [ ] alfa/export [ ] render real [ ] revisão no jogo [ ] conhecimento registrado. Se falhar, manter como WIP.

## 9. Como o conhecimento cresce a cada efeito

No começo da tarefa: **leia este manual + o diário** e preencha [VFX_BRIEF_TEMPLATE.md](VFX_BRIEF_TEMPLATE.md).

No fim de cada tentativa: registrar em [VFX_LEARNING_LOG.md](VFX_LEARNING_LOG.md): efeito, hipótese, tecnologia/versão, experimento, observação visual, erro, correção, evidência (link de commit/workflow/artefatos), estado. Se a lição for transferível, atualizar a seção correspondente do manual, data e fontes.

Não existe aprendizado permanente automático só por rodar o binário. O que garantimos no repositório é **processo documentado, leitura obrigatória para agentes, checagem de arquivos no pipeline e log versionado no Git**.

---

**Referências e evidência:** [docs/VFX_SOURCES.md](VFX_SOURCES.md). As marcações `[S01]` etc. identificam fontes nesse arquivo; receitas concretas e faixas de frames são heurísticas editoriais do VFX Studio, derivadas dos princípios, não cópias de tutoriais nem especificações oficiais.
