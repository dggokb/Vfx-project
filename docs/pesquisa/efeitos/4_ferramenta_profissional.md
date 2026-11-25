# Sōkon FX: o que faz uma ferramenta de efeitos parecer profissional

Pesquisa feita em 25/11/2026 em documentação oficial, notas de versão e fóruns de Effekseer, Pixel FX Designer/SpriteMancer, EmberGen, Unity (Shuriken/VFX Toolbox), Unreal Niagara, Spine, Aseprite, TVPaint, Procreate Dreams, Rive, After Effects/Trapcode Particular e Blender, mais guias de toque da Apple e do Google. Itens marcados com **[não verificado]** vieram de memória ou de fonte secundária e não foram confirmados numa página oficial nesta pesquisa.

## 1. Resumo em uma frase

As ferramentas profissionais não ganham por ter mais geradores. Elas ganham por cinco coisas: **(a)** o que você faz nunca se perde (undo completo, salvar com incremento, projeto que reabre igual); **(b)** ver o resultado final na velocidade final o tempo todo; **(c)** acervo de presets com miniatura que vira ponto de partida; **(d)** variação controlada por semente, inclusive em lote; **(e)** exportação sem surpresa (grade, recorte, nomes e metadados previsíveis). O Sōkon FX já tem muito do motor. O que falta para ficar profissional é quase todo **acabamento de fluxo e de interface**.

## 2. O que cada ferramenta ensina

**EmberGen (JangaFX)** é a melhor referência de UX para quem gera flipbooks.
- O menu File tem **Save, Save As e "Increment and Save"**: salva `projeto2` a partir de `projeto1` e passa a trabalhar nele. O título mostra "(Edited)" quando há mudança não salva.
- A **Export Variations** roda a simulação N vezes e exporta N variações. Você marca quais parâmetros variam (Shift+clique no círculo de override), e uma opção decide se a primeira variação usa os valores atuais. A documentação recomenda variar **sementes** e não intensidade, porque a semente muda a forma sem mudar a escala do efeito. As simulações são determinísticas: o projeto reabre igual.
- Cada parâmetro tem um **estado de override**: nenhum, keyframe (timeline), modulação (pin) ou aleatório.
- No painel de propriedades há abas **Favoritos** (parâmetros com estrela), **Timeline** (só os animados) e **Randomized** (só os aleatórios, com sliders de faixa e "Randomize All"). Há busca de parâmetro com **Ctrl+P**, e os campos aceitam **expressão matemática**.
- A timeline tem snap a frame, alternância segundos/frames (Shift+F), região de loop ajustável (L), autokey (A), passo de um frame (Z), play (Espaço) e uma barra que escolhe **qual trecho da timeline vai para a exportação**.
- A aba Export mostra o arquivo exportado de verdade. Dá para ver um canal por vez (R/G/B/A) e tocar o flipbook no FPS-alvo, com zoom por frame e setas para andar.
- O Project Manager traz projetos recentes, mais de 100 presets só de leitura com categorias, e lista de projetos ordenável e pesquisável.

**Effekseer**
- A árvore de nós aceita arrastar para reordenar, olho de visibilidade por nó (Shift liga e desliga os filhos) e menu de contexto.
- F-curves animam posição, rotação, escala e cor. A versão 1.60 trouxe **muitos tipos de easing prontos** (bounce etc.) e função degrau.
- **Semente global**: com o mesmo valor, o efeito repete igual a cada play; com 0, varia.
- O **gravador** exporta folha de sprites com "X Count" (colunas), *Frequency* (pula frames) e geração de alfa conforme o blend. O próprio manual avisa que o alfa pode sair errado com cores escuras em modo aditivo.
- Exporta um **pacote** com todos os arquivos do efeito e converte pela linha de comando sem abrir a interface.

**Pixel FX Designer / SpriteMancer (CodeManu)**
- Paleta importada de até 256 cores, com cores ignoráveis; pixelização e dithering próprios; camadas de partícula com ordem de frente e trás; loop sem emenda; exporta PNG, GIF ou a versão sem pixelização. Glow, contorno e sépia aparecem em tempo real.
- **As reclamações dos usuários valem como lição**: grade da folha fixa (pediram para escolher linhas e colunas), frames que não dividem a folha certinho, emissor descentralizado. Exportação imprevisível é o que mais irrita.
- O sucessor SpriteMancer passou para grafo de nós com timeline de keyframes, loop sem emenda e controle de FPS.

**Unity**
- Shuriken tem o modo **"Random Between Two Curves"**: duas curvas formam um envelope e cada partícula sorteia um valor entre elas. Gradientes podem ser salvos como preset.
- O VFX Toolbox Image Sequencer (experimental) monta flipbooks a partir de sequências, com retime, controle de aceleração e criação de loop com pontos de sincronia. Salva o processo como **template reexportável** e consegue quebrar uma folha pronta em frames.

**Unreal Niagara**
- É uma **pilha de módulos** executada de cima para baixo, com módulos "scratch pad" locais ao efeito e parâmetros de usuário expostos para fora.
- O **Flipbook Baker** gera uma imagem com um tile por frame. "Frames Per Dimension" define a grade e "Texture Size" o tamanho total.

**Spine**
- O **Ghosting** (onion skin) tem quantidade antes e depois, passo, opção de mostrar só keyframes, ancoragem no frame 0, silhueta e raio-X.
- O empacotador tem **strip whitespace** com limiar de alfa, padding, escala, premultiply alpha (tem que bater com o shader do jogo) e bleed.

**Aseprite**
- A exportação de folha tem trim por frame ou da folha inteira, três tipos de padding (shape, borda, interno), divisão por camada ou por tag com `{tag}` e `{layer}` no nome, e JSON de frames e tags.
- Tags dão nome a trechos da timeline. O onion skin respeita a tag em loop. Dá para tocar para frente, ao contrário ou em ping-pong **[ping-pong: fonte secundária]**.

**TVPaint**
- A light table mostra as imagens anteriores e seguintes esmaecidas, inclusive entre clipes. A exposure sheet (folha X) não foi confirmada nesta pesquisa **[não verificado]**.

**Procreate Dreams (a referência de toque)**
- Desfazer com dois dedos (segurar repete), refazer com três dedos.
- Pinça para zoom, "pinça rápida" para enquadrar tudo, toque duplo na timeline para aproximar.
- Três dedos na horizontal mudam a escala de tempo; um dedo arrasta a timeline.
- Jogar a agulha para a esquerda toca do começo. Quatro dedos entram em tela cheia, onde um dedo faz scrub.
- Um segundo dedo enquanto arrasta ativa o **snap**.
- Onion skin com cor, quantidade e opacidade configuráveis.

**Rive**
- O painel de interpolação fica ao lado da timeline: seleciona as chaves e escolhe o tipo.
- O Graph Editor (Shift+F3) substitui a timeline e alterna entre gráfico de valor e de velocidade (Shift+G). Tem auto-bezier.
- Sem nada selecionado, o inspector mostra a **interpolação padrão das novas chaves**. A lista de atalhos abre com Shift+/.
- O editor não tem suporte oficial a celular.

**After Effects / Trapcode Particular**
- AE: Graph Editor com gráfico de valor e de velocidade, e **Easy Ease com F9** sobre as chaves selecionadas.
- O Particular Designer tem quatro áreas: **Presets** em categorias com miniatura, **Preview**, **Blocos/Controles** com miniaturas vivas que mudam quando você edita a curva, e a **cadeia de efeitos**.
- Alt+clique num preset **soma** um sistema em vez de substituir. Presets próprios ficam numa categoria "Custom".

**Blender (convenção de campo numérico)**
- Arrastar na horizontal muda o valor; Ctrl dá passos discretos e Shift dá precisão; Ctrl+roda edita sem clicar.
- Arrastar na vertical sobre vários campos edita todos de uma vez.

## 3. Ranking: as 15 funções de maior impacto para um artista solo de jogo de luta

Critério: tempo poupado por efeito multiplicado pelo número de efeitos (são dezenas de hits, defesas, especiais, Super e Ultra), somado ao quanto a função faz a ferramenta *parecer* séria.

1. **Undo/redo completo e confiável, com histórico visível.** Todas as ferramentas pesquisadas têm. É a base de tudo: sem ele, o artista tem medo de experimentar. Cobre qualquer mudança (parâmetro, camada, curva, preset aplicado). Mostre um painel de histórico com nome da ação ("Raio: largura 12→18") e agrupe arrastos num passo só. No celular, use os gestos do Procreate Dreams: dois dedos desfazem, três refazem.
2. **Projeto que reabre exatamente igual, mais "Salvar com incremento" e autosave.** Vem do EmberGen: determinismo, Increment and Save e marca de "(editado)". No navegador isso significa autosave local (IndexedDB) com as últimas N versões, exportar e importar o projeto em `.json`, e nome versionado (`hit_fogo_v03`). Um único arquivo HTML que perde trabalho ao fechar a aba nunca vai parecer profissional.
3. **Biblioteca de presets e efeitos com miniatura animada.** Copia o Particular Designer e o Project Manager do EmberGen: categorias (Hit leve, Hit pesado, Defesa, Corte, Fogo, Raio, Super...), miniatura que toca ao passar o dedo ou o mouse, estrela de favorito, "Salvar como preset" e Alt+clique para **somar** a camada ao efeito atual. Para quem faz 50 efeitos parecidos, é o maior ganho de velocidade.
4. **Semente explícita por camada, mais "Variações" em grade.** Junta a semente global do Effekseer com a Export Variations do EmberGen. Mostre 6 a 12 miniaturas da mesma receita com sementes diferentes; clicar numa adota aquela semente. Exportar todas de uma vez dá `hit_01_a/b/c`, ótimo para o jogo sortear e evitar repetição. Regra do EmberGen: varie a semente, não a intensidade.
5. **Preview final no FPS-alvo, com loop, passo e câmera lenta.** Play/pausa no Espaço, passo com vírgula e ponto (ou Z), loop numa região marcada (L), velocidade 0,25x, 0,5x e 1x, contador de frame e alternância frames/segundos. O preview deve ser **o que vai sair na folha** (com recorte e fundo), como a aba Export do EmberGen. Para hit spark de luta, o que importa são 2 a 4 frames lidos um por um.
6. **Exportação previsível e configurável.** É a dor nº 1 dos usuários do Pixel FX Designer. Ofereça colunas e linhas definidas pelo usuário ou "auto quadrado"; tamanho do frame; recorte por frame ou da folha inteira com offset salvo no JSON; padding e extrude/bleed; premultiplied ou alfa reto, explicado no tooltip; potência de 2 opcional; "pular frames" como o Frequency do Effekseer; e trecho de exportação marcado na timeline. Mostre antes de exportar: "Folha 1024×512, 6×3, 18 frames, 37 KB".
7. **Convenção de nomes e metadados automáticos.** Use um modelo de nome com variáveis no estilo Aseprite (`{personagem}_{golpe}_{tipo}_{variacao}_{fps}`). O JSON deve sair no formato que o jogo lê: pivô ou âncora, fps, frames de impacto, loop sim ou não, blend aditivo ou normal, semente e versão da ferramenta. O nome e os metadados certos poupam o passo manual no projeto do jogo.
8. **Exportação em lote de um "kit" de golpe.** Exporta de uma vez as variações de leve, médio e pesado, defesa e contra-ataque, como template reexportável (Image Sequencer da Unity). Ao mudar a paleta do personagem, um clique regera o kit inteiro. Já existe no Sōkon; o que falta é ele virar **receita salva e reexecutável**.
9. **Timeline com keyframes e editor de curvas com easing pronto.** Painel de interpolação ao lado da timeline (Rive); biblioteca de easings (Effekseer 1.60); F9 para "suavizar" (AE); gráfico de valor e de velocidade; interpolação padrão para novas chaves. Para luta, inclua easings de impacto: "estoura e segura" (ease-out forte) e degrau, que imita a contagem de frames do anime.
10. **"Aleatório entre duas curvas" e faixas de valor.** Vem do Shuriken: cada parâmetro aceita constante, faixa, curva ou envelope entre duas curvas. Dá vida sem perder o controle. Combina com o item 4.
11. **Onion skin e referência configuráveis.** Quantidade antes e depois, cor por lado (o costume é azul e vermelho ou verde), opacidade, só keyframes e silhueta (Spine e Procreate). Inclua **sobreposição de referência**: o sprite do personagem no frame do golpe, a hitbox e a linha do chão. É o que faz o efeito casar com o golpe.
12. **Pilha de camadas com olho, solo, trava, duplicar e arrastar.** Árvore do Effekseer e pilha do Niagara: ordem visível, olho (Shift para filhos), solo, duplicar, renomear, cor de etiqueta, modo de mistura por camada e grupo (pasta). Aplicar efeitos *depois* (brilho, contorno, pixelização) como modificadores não destrutivos, ligáveis e desligáveis.
13. **Favoritos e busca de parâmetro.** Abas Favoritos, Animados e Aleatórios do EmberGen, mais Ctrl+P ou "/" para achar um parâmetro pelo nome. Com muitos geradores, achar o controle é metade do tempo.
14. **Campos numéricos de arrastar, com expressão e redefinição.** Convenção do Blender: arrastar muda, Shift dá precisão, Ctrl dá passo; duplo clique digita; aceitar `*2` ou `+10` (EmberGen); clique direito ou toque longo volta ao padrão; valor alterado em destaque (negrito ou ponto colorido). Ligar parâmetros ("largura segue escala") é um bônus.
15. **Atalhos de teclado com folha de atalhos e paleta de comandos.** Espaço toca, Ctrl+Z/Ctrl+Shift+Z, Ctrl+S, Ctrl+D duplica, H esconde, L faz loop, F enquadra, `?` mostra os atalhos (Rive usa Shift+/). Uma paleta de comandos (Ctrl+K) com busca dá ar de ferramenta moderna.

Fora do top 15, mas baratos: notas no projeto (EmberGen mostra ícone quando há nota); "comparar A/B" (antes e depois com divisor); medidor de custo (frames, KB, overdraw); tour guiado de primeira vez.

## 4. Convenções visuais das ferramentas profissionais

- **Tema escuro neutro.** Cinza quase sem saturação (algo como #1e1e1e a #2b2b2b nos painéis, um pouco mais claro no inspector). O motivo técnico é o contraste simultâneo: o entorno muda como você percebe a cor e o brilho do que está no meio. O GIMP adota cinza médio pelo mesmo motivo e o Kdenlive recebeu crítica por um escuro azulado. Para efeito aditivo, ofereça **troca de fundo do preview** (preto, cinza médio, xadrez e o cenário do jogo), porque efeito que só funciona no preto engana.
- **Uma cor de destaque só**, usada para seleção, foco e chave ativa. Mais cores separadas por função: keyframe, aleatório e modulado (os três estados de override do EmberGen podem ter ícone e cor próprios).
- **Layout fixo e previsível.** Viewport no centro, camadas ou árvore à esquerda, inspector à direita, timeline e curvas embaixo. Painéis redimensionáveis e recolhíveis, com tela cheia por painel (EmberGen) e layout salvo.
- **Inspector agrupado** em seções recolhíveis (Forma, Movimento, Cor, Tempo, Pós), com o nome da seção fixo no topo ao rolar e "resetar seção". Rótulo à esquerda, controle à direita, alinhados em grade.
- **Controles compactos.** Linhas de 22 a 26 px no desktop, fonte de 11 a 12 px, números em fonte tabular e unidades visíveis (px, f, °, %).
- **Tooltips com nome, atalho e uma linha de explicação**, e "(i)" nos campos técnicos (premultiply, bleed, semente).
- **Estados claros**: botão desligado diferente de ativo, indicador de "não salvo", barra de progresso de exportação e mensagens de erro que dizem como resolver.
- **Mostre números o tempo todo**: frame atual / total, fps, tamanho do frame, contagem de partículas e tempo de render (o EmberGen tem um overlay de estatísticas).

## 5. Adaptação ao celular

O Rive não roda bem em tablet e a maioria das ferramentas pesquisadas é só desktop. Sair-se bem no toque é uma oportunidade de diferencial.

- **Alvos de toque de no mínimo 44 pt (Apple) ou 48 dp (Material)**. No desktop, a ferramenta pode ser compacta; detecte `pointer: coarse` e aumente.
- **Layout de uma coluna**: preview em cima, ocupando cerca de metade da tela; timeline fina embaixo do preview; inspector como **folha inferior** (bottom sheet) arrastável em três alturas; camadas e presets em gaveta.
- **Gestos padrão do Procreate Dreams**: 2 dedos desfazem, 3 refazem, pinça dá zoom, pinça rápida enquadra, 1 dedo arrasta a timeline, toque duplo aproxima.
- **Scrub tocando e arrastando no próprio preview** (em tela cheia), e "jogar" a agulha para tocar.
- **Slider de toque**: arrastar horizontal no campo muda o valor e afastar o dedo verticalmente diminui a sensibilidade (ajuste fino); toque longo abre teclado numérico e "voltar ao padrão". **[conceito comum em apps móveis; não verificado numa fonte específica]**
- **Snap com segundo dedo** enquanto arrasta uma chave ou ponto de curva (Procreate Dreams).
- **Barra de ação fixa** com as quatro ações mais comuns (Play, Desfazer, Variações, Exportar), ao alcance do polegar.
- **Nunca depender de hover**: miniatura de preset toca com toque longo; tooltip vira toque no "(i)".
- Exportação no celular: compartilhar via Web Share API ou baixar um .zip, com o nome já no padrão.

## 6. Ordem sugerida para o Sōkon FX

1. **Base de confiança** (itens 1, 2 e 14): undo com histórico, autosave, versões e projeto em arquivo, campos de arrastar com reset.
2. **Velocidade de produção** (3, 4, 5, 13): presets com miniatura, grade de variações por semente, preview com loop, passo e câmera lenta, favoritos e busca.
3. **Saída sem surpresa** (6, 7, 8): diálogo de exportação com resumo e prévia da folha, modelo de nome, JSON completo, kit como receita reexecutável.
4. **Animação fina** (9, 10, 11, 12): painel de easing, envelope de duas curvas, onion skin e referência do personagem, pilha com solo e trava.
5. **Polimento visual e móvel** (15 e seções 4 e 5): tema neutro unificado, tooltips, atalhos com `?`, folha inferior e gestos.

## 7. Itens não verificados ou com ressalva

- O ping-pong do Aseprite veio de uma página de documentação não oficial.
- A exposure sheet do TVPaint não foi confirmada.
- As faixas de tamanho de controle (22–26 px) e as cores de tema são prática comum observada, não regra publicada.
- Não achei, nesta pesquisa, se o Effekseer tem painel de histórico de undo nem como ele copia e cola nós.
- Não achei a existência de biblioteca de presets de curva no VFX Graph.
- Os dados do Pixel FX Designer são de posts de 2018 a 2022; o produto foi substituído pelo SpriteMancer.
- O valor padrão de tile de 128×128 no Niagara Baker vem da versão coreana da documentação.

## 8. Fontes

- EmberGen UI reference: https://docs.jangafx.com/embergen/pages/references/ui_reference.html
- EmberGen randomização / Export Variations: https://docs.jangafx.com/embergen/pages/references/How-To%20Guides/randomization.html
- EmberGen produto: https://jangafx.com/embergen/
- Effekseer tool reference: https://effekseer.github.io/Help_Tool/en/ToolReference/index.html
- Effekseer 1.60 novidades: https://effekseer.github.io/Help_Tool/en/ReleaseNotes/160.html
- Effekseer gravação (sprite sheet): https://effekseer.github.io/Help_Tool/en/ToolReference/record.html
- Effekseer configurações globais (semente): https://effekseer.github.io/Help_Tool/en/ToolReference/global.html
- Effekseer GIF transparente (fórum itch): https://itch.io/post/9143494
- Pixel FX Designer: https://codemanu.itch.io/particle-fx-designer
- Pixel FX Designer, pedido de linhas e colunas: https://itch.io/t/2969626/setting-vertical-and-horizontal-rows-in-animations-exported
- Pixel FX Designer, folha quebrada: https://itch.io/t/463261/png-export-spritesheet-not-at-all-like-render-very-broken
- SpriteMancer, timeline: https://codemanu.itch.io/spritemancer/devlog/499926/spritemancer-v0201-timeline-update-released
- SpriteMancer no Steam: https://store.steampowered.com/app/1858750/SpriteMancer
- Unity, propriedades ao longo do tempo (Random Between Two Curves): https://docs.unity3d.com/Manual/varying-particle-system-properties-over-time.html
- Unity, ParticleSystemCurveMode.TwoCurves: https://docs.unity3d.com/ScriptReference/ParticleSystemCurveMode.TwoCurves.html
- Unity VFX Toolbox Image Sequencer: https://blog.unity.com/technology/experimental-feature-vfx-toolbox-image-sequencer e https://github.com/Unity-Technologies/VFXToolbox
- Niagara Scratch Pad: https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-scratch-pad-modules-in-unreal-engine
- Niagara Flipbook Baker: https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-flipbook-baker-quick-start-guide-in-unreal-engine
- Spine Ghosting: https://es.esotericsoftware.com/spine-ghosting
- Spine Texture Packer: https://en.esotericsoftware.com/spine-texture-packer
- Aseprite animação: https://www.aseprite.org/docs/animation/
- Aseprite sprite sheets (mirror não oficial): https://mintlify.com/aseprite/aseprite/features/sprite-sheets
- Aseprite CLI (JP): https://chiepomme.github.io/aseprite-docs-jp/cli.html
- Aseprite onion skin em loop: https://community.aseprite.org/t/onion-skin-timeline-wrapping/8815
- TVPaint light table: https://doc.tvpaint.com/docs/animation-advanced-functions/light-table/light-table-overview
- Procreate Dreams gestos: https://help.procreate.com/dreams/handbook/interface-and-gestures/gestures
- Procreate Dreams timeline: https://help.procreate.com/dreams/handbook/interface-and-gestures/timeline
- Rive interpolação: https://rive.app/docs/editor/animate-mode/interpolation-easing
- Rive graph editor: https://rive.app/docs/editor/animate-mode/graph-editor
- Rive atalhos: https://rive.app/docs/editor/keyboard-shortcuts
- Rive sem suporte móvel: https://rive.app/community/forums/support/fsnLLkXUaA62/rive-editor-doesnt-work-on-android-mobiletablet/ftElYkUd1871
- After Effects velocidade e Easy Ease: https://helpx.adobe.com/after-effects/using/speed.html e https://www.adobe.com/learn/after-effects/web/adjusting-keyframes-dynamic-movement
- Trapcode Particular Designer: https://help.maxon.net/rg/en-us/Content/html/Particles-and-3D/Trapcode%20Particular/overview-of-the-designer.html
- Trapcode Particular presets: https://help.maxon.net/rg/en-us/Content/html/Particles-and-3D/Trapcode%20Particular/presets.html
- Blender campos numéricos: https://docs.blender.org/manual/en/latest/interface/controls/buttons/fields.html
- GIMP, especificação de tema (cinza médio): https://developer.gimp.org/core/specifications/theme/
- Cinza neutro e percepção de cor: https://photography.tutsplus.com/tutorials/want-better-color-use-neutral-gray-themes-in-adobe-photoshop-and-lightroom--cms-23342
- Apple, alvo de toque 44 pt: https://developer.apple.com/design/tips
- Google, alvo de toque 48 dp: https://support.google.com/accessibility/android/answer/7101858
