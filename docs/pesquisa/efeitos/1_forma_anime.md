# Forma de efeitos 2D estilo anime: faísca de golpe, explosão, fogo e energia

Pesquisa feita em 25/11/2026 para o Sōkon. Foco: **desenho da forma** (onde as tentativas procedurais erraram), depois tempo e cor.

Como ler as marcas:
- **[fonte]**: está na página citada (lida por mim).
- **[trecho]**: só vi em trecho de busca, não li a página inteira.
- **[síntese]**: conclusão minha juntando as fontes, ou prática comum que observei. Não é citação.
- **[não verificado]**: não consegui confirmar.

O livro *Elemental Magic* (Joseph Gilland, vols. 1 e 2) **não pôde ser lido**: O'Reilly, Taylor & Francis e a tese finlandesa que o resume bloquearam o acesso (403 ou Cloudflare). Só confirmei trechos curtos de prévia. Ele aparece abaixo só onde eu tinha esses trechos.

---

## 1. Linguagem de forma

### 1.1 O princípio-mãe: a silhueta carrega o movimento
- **Takashi Hashimoto** (diretor de efeitos de anime, palestra na CEDEC 2011): o cel é chapado, então **é o contorno que carrega o movimento**. Ele julga fogo, fumaça e faísca pela silhueta e varia de propósito a largura e a amplitude dela **de um quadro para o outro** [fonte: Gigazine].
- **Jason Keyser** (VFX Apprentice): primeiro anime "quadrados e círculos cinza" e confira se funcionam em movimento. Textura e cor vêm depois [fonte: Toon Boom].
- **Teste prático**: pinte o efeito todo de preto sobre fundo branco. Se ainda der para ler a direção do golpe, a força e o centro, a forma está boa [síntese].

### 1.2 Hierarquia grande / médio / pequeno
- Hashimoto: **"as partes que se movem são grandes; os pequenos vão alternados entre elas"**. Ele também controla a **densidade de fragmentos por quadro** e tira peças quando o quadro fica cheio [fonte: Gigazine].
- Guia de VFX do League of Legends, via VFX Apprentice [fonte]:
  - O **elemento primário** tem valor alto, silhueta clara, opacidade alta e um foco nítido.
  - Os **secundários** têm valor mais baixo, menos opacidade, formas mais simples e menos movimento, para não disputar com o primário.
- O "grande-médio-pequeno" (BMS) **vale também para os espaços negativos**, os buracos entre as formas, e não só para as formas [trecho: curso FX Design Principles da VFX Apprentice].
- Regra 3-3-3 (vfxdoc): três tamanhos × três velocidades × três ritmos. Pequeno = rápido e seco; médio = sincopado; grande = contínuo [fonte].
- **Regra prática** [síntese]: uma massa dominante, 2 ou 3 médias e vários pequenos. Os níveis precisam ser **claramente diferentes**. Três raios de 100%, 90% e 80% não formam hierarquia; 100%, 55% e 25% formam.

### 1.3 Reto contra curvo, e por elemento
- **Raio e luz no estilo Kanada**: "feito de muitos ângulos e linhas rígidas", com retas, ângulos fortes e tempo irregular [fonte: Animetudes]. Na explosão de *Arcadia of My Youth*, o clarão tem **bordas retas e angulares**, e a explosão **começa como um círculo** e depois se espalha em todas as direções [fonte: Full Frontal].
- **Fogo no estilo Kanada** ("fogo líquido"): curvo e orgânico, **sem contorno nítido**. O movimento vem do jogo entre manchas de cor, e as linhas "se juntam e se dispersam em volta de pontos de tensão" [fonte: Animetudes].
- **Kameda** (*FMA: Brotherhood*, *Mob Psycho*): fogo e fumaça às vezes **muito angulares**, pincelada preta grossa e, nos raios, "pontos de concentração em forma de estrela ou círculo" [fonte: Animetudes].
- **Imaishi** (*Promare*): as curvas do fogo de Kanada viram **formas quase todas triangulares**, e o movimento continua vindo da relação entre as cores [fonte: Animetudes].
- **Ikeda (Pokelabo, CEDEC 2019)** [fonte: slides]:
  - As formas universais do efeito são **o círculo e a linha**. O círculo casa com o fundo pelo contorno, pelo detalhe e pela direção da força; a linha (horizontal ou vertical) indica a direção da força.
  - Processo: forma universal → **quebrar** a forma → arrumar → pintar.
  - O efeito exagerado é **"desenhado à mão, contorno afiado, se rasga (ちぎれる)"**, e corta degradê, cor e detalhe para ficar "パキッ" (seco, nítido).
- **Lição para a faísca de golpe** [síntese]: junte as três gramáticas numa peça só: **um disco ou anel** (círculo), **raios retos e angulares** (linha) e **lascas curvas que se rasgam** (fogo e energia). Uma estrela só de triângulos retos e iguais é a gramática mais pobre que existe.

### 1.4 Afinamento, curva S e curva C
- Fogo estilizado (Daniélle Viljoen, via VFX Apprentice) [fonte]:
  - O bloqueio começa por uma **curva S** que define o vento e a forma geral.
  - O contorno é feito de **formas C** com **ganchos** nas pontas, para não ficar um "tubo de pasta de dente".
  - A base é forte e o fogo **afina** ao subir.
  - Misture tamanhos de ganchos e Cs. Erro clássico: fogo "perfeito demais".
- Corte de espada (Jason Tom Lee) [fonte]:
  - Forma de lua crescente ou bandeira: **a cabeça que avança é grossa, a cauda é fina**. O afinamento "implica passagem de tempo e velocidade".
  - Curva única e limpa. Esse quadro de clímax "existe só por 1 a 2 quadros".
- Desenhar fogo de verdade com "cúspides e curvas" (cusps and curves) é o que a Pixar pediu nas silhuetas de *Elemental* [trecho: artigo da Pixar na SIGGRAPH 2023]: **pontas afiadas alternando com barrigas redondas**.
- Movimento (guia do LoL, via VFX Apprentice): **a borda que avança é a mais clara e a de maior contraste**; o rastro é escuro e de baixa frequência [fonte].

### 1.5 Agrupamento, espaço negativo e irregularidade
- Explosão em mangá (Yūko Satō, Netorabo) [fonte]:
  - Esboce **círculos de vários tamanhos sobrepostos, sem regularidade**.
  - No arte-final, **quebre o círculo** de propósito, com saliências e reentrâncias.
  - Centro claro, fora escuro.
  - Não preencha todos os círculos de fora, porque fica artificial.
- Hashimoto quebra a regularidade de propósito [fonte: Gigazine]:
  - embaralha a ordem dos desenhos;
  - reaproveita desenhos espelhados ou de cabeça para baixo;
  - troca loops de fogo de 6, 8 ou 16 quadros por desenhos novos;
  - põe "enganchos" (引っかかり) que prendem o olho.
- Kanada usava régua e régua de elipse e depois **quebrava a regularidade**, interrompendo ou continuando linhas em pontos inesperados (o que ele chamava de "skipping") [fonte: Animetudes].
- O erro do ruído (realtimevfx, faísca "explosiva e de fogo") [fonte]:
  - O problema principal era "**alta frequência de detalhe no efeito inteiro**". O ruído procedural era "fibroso, sem formas distinguíveis".
  - O conserto foi uma textura de fogo **mais simples**, com formas reconhecíveis, e o detalhe tirado de um dos elementos.
  - O guia do LoL diz o mesmo: evite textura fotográfica e **detalhe procedural ruidoso**; pinte à mão, misturando bordas duras e moles [fonte: VFX Apprentice].

### 1.6 Direção: sair do ponto de impacto
- A forma pode e deve indicar direção [trecho: Game Developer]. Na explosão do episódio 33 de *Brotherhood*, Kameda usa um **formato em V** tirado de Kanada [fonte: Animetudes].
- A faísca deve **abrir num cone a favor do golpe** (para onde a força vai), com o maior raio nesse eixo e raios menores espalhados fora dele [síntese]. A explosão perfeitamente radial e simétrica é o maior sinal de "efeito genérico".

### 1.7 O que faz uma faísca parecer "anime" e não uma estrela genérica [síntese das fontes acima]
| Genérico (estrela) | Anime |
|---|---|
| Simetria radial, N pontas iguais | Assimétrica e direcional (cone ou V a favor do golpe) |
| Só triângulos retos | Disco ou anel + raios retos angulares + lascas curvas que se rasgam |
| Pontas de tamanho parecido | Grande/médio/pequeno bem separados, também nos buracos entre as formas |
| Uma forma que cresce e some (escala + opacidade) | **Cada desenho é uma silhueta nova** (Hashimoto); a forma muda de verdade de um quadro para o outro |
| Degradê suave | 2 a 4 faixas de cor chapadas, bordas duras, brilho só por composição |
| Some por transparência | **Se rasga em pedaços** que se espalham e encolhem |
| Tempo linear, quadro a quadro | Desenhos segurados (de 2 em 2 ou de 3 em 3), irregulares, com explosão de tensão |
| Sem contexto | Linhas de velocidade e de foco, às vezes um quadro de impacto invertido |

---

## 2. Anatomia da faísca no tempo

### 2.1 As fases
O guia do LoL usa três estágios: **antecipação curta → impacto no máximo de valor e saturação, pronto já no primeiro quarto da vida do efeito → dissipação** que limpa a cena [fonte: VFX Apprentice]. Stefan Jevremović (Nordeus) diz o mesmo: o clímax tem mais elementos e mais contraste; a dissipação tem pouco contraste e é curta [fonte: 80.lv]. A VFX Apprentice separa o efeito de **impulso** (estoura forte e some do mesmo jeito: é a faísca) do efeito de **ritmo** (loops) [fonte].

Sequência aplicada à faísca [síntese, com números como ponto de partida e não como regra publicada]:
1. **Clarão** (1 a 2 desenhos): disco ou forma angular quase branca, pequeno e muito brilhante. Hashimoto, em *Gundam Unicorn*: "um clarão azul forte" e depois um clarão amarelo que escurece ao se expandir [fonte: Full Frontal]. Elogio no realtimevfx: "clarão branco → clarão preto → rampa de saída" dá profundidade [fonte].
2. **Quadro de impacto** (opcional, 1 a 3 quadros): inversão preto e branco, ou silhueta chapada. A duração de 1 a 3 quadros vem de fonte fraca [não verificado: arhfoundation]. Kameda faz quadros de impacto "muitas vezes em preto e branco", com pincel [fonte: Animetudes]. Ter sido Kanada a introduzir o quadro de impacto preto é afirmação de fã [não verificado]. Uma versão em UE5 de *My Hero Academia* usou 7 materiais, cada um aparecendo 1 quadro, dentro de 12 quadros [trecho: 80.lv].
3. **Expansão** (2 a 3 desenhos): a forma principal no tamanho máximo, com os raios saindo na direção do golpe. É aqui que mora o pico (primeiro quarto da vida).
4. **Segurar** (1 a 2 desenhos): a forma quase parada, só "piscando". Hashimoto faz o pisca-pisca (パカパカ) **alternando dois padrões A e B** e intercalando células de cor; um elemento fica 2 quadros e outro 3 [fonte: Gigazine]. Kameda cicla pincel e fogo **sem intervalos**, só alternando, para dar o tremor [fonte: Animetudes].
5. **Dissipação** (3 a 5 desenhos): ver 2.3.

### 2.2 Tempo, desenhos segurados e parada no golpe (hitstop)
- **Anime segura desenhos.** Kanada animava efeitos de 3 em 3 [fonte: Animetudes, "first realist"]. O 3D da Sanzigen anima de 3 em 3 para combinar com o 2D [fonte: Animetudes, Imaishi]. O estilo Kanada "só vive com quadros limitados e modulação intensa": tensão acumulada e depois soltura súbita, com slow-in e slow-out [fonte: Animetudes].
- **Tempos diferentes no mesmo efeito.** Hashimoto [fonte: Full Frontal]:
  - duas explosões de fundo de 2 em 2 e **alternadas** (quando uma se mexe, a outra para);
  - a explosão em primeiro plano de 1 em 1, para parecer mais perto.
- Exemplo real de exposição de uma faísca mágica a 24 fps: implosão em 7, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1 (acelera); explosão em 1 por desenho [fonte: Clip Studio Tips].
- Animação tem menos informação que filmagem real, então o tempo deve ser **um pouco mais rápido** [fonte: Hashimoto, Gigazine].
- **A parada no golpe** (Guilty Gear Xrd, a 60 fps), conforme o nível do ataque [fonte: Dustloop]:

  | Nível do ataque | Lv0 | Lv1 | Lv2 | Lv3 | Lv4 |
  |---|---|---|---|---|---|
  | Parada (quadros) | 11 | 12 | 13 | 14 | 15 |
  | Extra para quem leva, em contra-ataque | +0 | +2 | +4 | +8 | +12 |

- No Street Fighter V, a parada é "para a apresentação visual" e segue um sistema por jogo [trecho: Capcom].
- Sakurai: durante a parada, quem leva o golpe **treme, começando forte e diminuindo**; o tremor é lateral no chão e vertical no ar [fonte: Source Gaming].
- **Sincronia** [síntese]:
  - A faísca nasce no primeiro quadro da parada e **continua animando** enquanto os lutadores estão congelados.
  - O clarão e o pico cabem nos ~11 a 15 quadros de parada; a dissipação segue quando a ação volta.
  - A 60 fps, "de 2 em 2 no anime" (12 desenhos por segundo) dá cerca de 5 quadros de jogo por desenho. Para faísca, use **2 a 4 quadros de jogo por desenho**: o clarão mais curto, a dissipação mais longa.
  - Uma faísca de golpe leve com 6 a 8 desenhos dura uns 18 a 28 quadros. Isso é estimativa, não número publicado.
  - O efeito de fogo que continua ativo depois que o oponente já pode agir confunde quem joga. No realtimevfx, a onda de choque foi acelerada para acabar antes disso [fonte].

### 2.3 Dissipação: quebrar em pedaços em vez de só sumir
- "**Efeito de primeira linha some de um jeito bonito.**" Ikeda (Pokelabo) dá seis formas de sumir [fonte: slides]:
  - **Diretas**: (1) ficar transparente, (2) encolher, em todos os eixos ou num só, (3) mover a textura ou a cor.
  - **Indiretas**: (1) fugir (crescer ou sair de cena), (2) ser tapado (por um flash ou uma onda), (3) não mostrar nada e deixar outro recurso falar.
  - As mesmas técnicas servem para entrar em cena.
- A Pixar dissolveu as nuvens de *Red: Crescer É uma Fera* **subdividindo as formas com o tempo**, e não baixando a opacidade, com tempo de subdivisão variado por peça [fonte: VFX Voice].
- Chris Graf: um respingo passa de lâminas grandes para gotas **à medida que o espaço negativo entra** [fonte: Toon Boom].
- No realtimevfx, o efeito "corta seco no fim"; o conserto foi escurecer e baixar a opacidade junto [fonte].
- **Regra** [síntese]: na faísca anime, a dissipação é o espaço negativo **comendo a forma** (buracos aparecem e crescem), as pontas **se soltando em lascas** que voam e encolhem, e **só no fim** um pouco de transparência. Não faça o desenho inteiro perder alfa por igual.

---

## 3. Cor de fogo e energia no anime

- **Estrutura de valor**: centro claro, fora escuro, que é a base até no mangá em preto e branco [fonte: Netorabo]. Rampa de calor de Hashimoto: **amarelo vivo → laranja → vermelho → marrom escuro**, com o clarão inicial em contraste forte (azul) [fonte: Full Frontal]. Rampa elogiada no realtimevfx: branco → amarelo → laranja → vermelho [fonte].
- **Quantos passos**:
  - 1 a 4 cores no degradê principal [fonte: Stefan Jevremović, 80.lv].
  - Colorização anime em geral usa 2 ou 3 tons por área (base, sombra, às vezes luz) [trecho: tutoriais de cel].
  - O efeito exagerado **corta degradê, cor e detalhe** [fonte: Pokelabo].
  - **Para a faísca**: 3 a 4 faixas chapadas (núcleo quase branco, cor saturada, cor de sombra ou borda) e mais um brilho de composição [síntese].
- **Onde pôr o contraste**: no centro e na borda que avança. Para separar camadas, **limite a faixa de valor do elemento secundário**: o anel externo só em laranja e vermelho, sem ir do branco ao preto, deixa a hierarquia clara [fonte: realtimevfx].
- **Branco puro**: o guia do LoL evita 0% e 100% no corpo do efeito e guarda o valor mais claro **para o clarão instantâneo** do impacto [fonte: VFX Apprentice]. No anime vale o mesmo raciocínio: branco só no núcleo e só por 1 a 3 desenhos [síntese].
- **Contorno**:
  - O fogo de Kanada não tem contorno nítido; a cor faz o movimento [fonte: Animetudes].
  - O preto entra como **massa** (pincel de Kameda contra fogo amarelo, quadro de impacto preto e branco) ou como faixa escura de "rampa de saída", **não como linha preta fina em volta de tudo** [fonte: Animetudes; síntese].
  - A linha de cor (色トレス) no lado da sombra marca a passagem de luz para sombra [trecho: Clip Studio].
- **Brilho**: no anime, o brilho é etapa de composição (撮影). A composição é "passo-chave" do trabalho de Hashimoto [fonte: Full Frontal]. Desenhe chapado e ponha o brilho como camada aditiva à parte (cor de efeito em volta + luz em modo Adição + desfoque no pico) [fonte: Clip Studio Tips].
- **Cor por elemento**:
  - Pegue uma cor dominante e uma complementar dessaturada só em detalhes pequenos [fonte: VFX Apprentice/LoL].
  - Desenhe em escala de cinza para poder tingir em tempo de execução [fonte: realtimevfx, raio 2D].
  - Na prática anime [síntese]: fogo = branco-amarelo, laranja, vermelho; raio = branco, ciano ou violeta com linhas retas; energia ou ki = branco com auréola saturada; golpe físico = branco, amarelo e laranja, ou neutro com inversão.

---

## 4. Faça e não faça (erros comuns em faísca procedural) [síntese das fontes]

**Faça**
- Desenhe **cada quadro como silhueta nova**. Mude o número, o ângulo e o comprimento das pontas entre desenhos.
- Construa pelo **círculo e pela linha**, depois **quebre**: saliências, reentrâncias, pontas tortas, buracos.
- Separe bem os tamanhos (cerca de 100%, 55% e 25%) e faça o mesmo com os espaços negativos.
- Oriente pelo golpe: cone ou V, com o maior raio no eixo da força.
- Misture **retas angulares** (energia, impacto) com **lascas curvas** de cabeça grossa e cauda fina.
- Segure desenhos e varie o tempo; coloque elementos em tempos diferentes (de 2 em 2 e de 3 em 3, alternados).
- Faça o pico no primeiro quarto do efeito e dentro da parada no golpe.
- Dissipe **rasgando**: buracos crescem, lascas se soltam, transparência só no fim.
- Use poucas faixas de cor chapadas e ponha o brilho à parte.
- Teste a silhueta em preto e confira também em vídeo lento.

**Não faça**
- Estrela de N pontas iguais e simétricas (o "very wrong shape" típico).
- Um único desenho que só cresce e perde alfa.
- Ruído procedural fino no efeito inteiro ("alta frequência de detalhe"), com fibras sem forma reconhecível.
- Detalhe uniforme: tudo com o mesmo contraste disputa atenção ("se tudo é importante, nada é" [fonte: realtimevfx/LoL]).
- Degradê suave e contorno preto fino em volta de tudo.
- Fogo "perfeito demais", em loop curto e visivelmente repetido.
- Efeito que fica na tela depois do fim do golpe, ou que corta seco.
- Pixels ou pontas soltas que quebram a curva principal do corte [fonte: Jason Tom Lee].

---

## Fontes

- Gigazine: Takashi Hashimoto na CEDEC 2011. https://gigazine.net/gsc_news/en/20111019_anime_effect_cedec2011
- Full Frontal, Sakuga Espresso (Hashimoto em *Gundam Unicorn*). https://fullfrontal.moe/sakuga-expresso-gundam-unicorn-takashi-hashimoto/
- Full Frontal, Sakuga Espresso 16 (*Arcadia of My Youth*, Kanada). https://fullfrontal.moe/sakuga-expresso-16-arcadia-of-my-youth/
- Animetudes: Yoshinori Kanada and the nature of animation. https://animetudes.com/2021/07/21/yoshinori-kanada-and-the-nature-of-animation/
- Animetudes: The Kanada style now. https://animetudes.com/2021/07/09/the-kanada-style-now/
- Animetudes: Artist spotlight, Yoshimichi Kameda. https://animetudes.com/2021/07/04/artist-spotlight-yoshimichi-kameda/
- Animetudes: Artist spotlight, Hiroyuki Imaishi. https://animetudes.com/2021/07/11/artist-spotlight-hiroyuki-imaishi/
- Animetudes: Kanada, the first realist? https://animetudes.com/2021/04/10/kanada-the-first-realist/
- Animetudes: The new generation of the 1990s (quadros de impacto e smears). https://animetudes.com/2021/06/04/the-new-generation-of-the-1990s/
- Pokelabo/GREE, CEDEC 2019, "エフェクトデザインのイ・ロ・ハ" (slides). https://speakerdeck.com/gree_tech/kotusorijiao-emasu-ehuekutodezainnoiroha-a00e17af-f819-4b9e-bafe-f92da2a69bae
- Netorabo: explosão em mangá (Yūko Satō). https://nlab.itmedia.co.jp/nl/articles/1803/19/news106.html
- realtimevfx: Stylised explosive and fiery hit spark. https://realtimevfx.com/t/stylised-explosive-and-fiery-hit-spark-looking-for-feedback/11286
- realtimevfx: Fighting game character VFX showcase. https://realtimevfx.com/t/fighting-game-character-vfx-showcase-feedback/9498
- realtimevfx: Lightning explosion 2D VFX. https://realtimevfx.com/t/lightning-explosion-2d-vfx-animation/17815
- realtimevfx: Anatomy of a LoL missile, parte 2. https://realtimevfx.com/t/anatomy-of-a-league-of-legends-missile-part-2-what-are-we-communicating-with-our-vfx/13062
- VFX Apprentice: 10 dicas do guia de VFX do LoL. https://www.vfxapprentice.com/blog/10-league-of-legends-vfx-design-tips
- VFX Apprentice: fogo estilizado. https://www.vfxapprentice.com/blog/how-to-draw-stylized-fire-flames
- VFX Apprentice: timing em VFX. https://www.vfxapprentice.com/blog/the-soul-of-effects-what-is-timing-in-vfx
- VFX Apprentice: curso Animating Small 2D FX. https://www.vfxapprentice.com/courses/animating-small-2d-fx
- Toon Boom: Jason Keyser e Chris Graf. https://www.toonboom.com/?p=13788
- 80.lv: VFX Staples, Shape, Color and Motion (Stefan Jevremović). https://80.lv/articles/vfx-staples-shape-color-and-motion/
- VFX Voice: The return of hand-drawn and stylized effects animation. https://www.vfxvoice.com/the-return-of-hand-drawn-and-stylized-effects-animation/
- Jason Tom Lee: Slash Shape Fundamentals. https://jasontomlee.itch.io/slashfx/devlog/629732/tutorial-2-slash-shape-fundamentals
- Clip Studio Tips: How to Animate a Magic Spark. https://tips.clip-studio.com/en-us/articles/7666
- vfxdoc: regra 3-3-3. https://vfxdoc.readthedocs.io/en/latest/vfx/authoringvfx/
- Dustloop: dados de quadros do GG Xrd Rev2 (parada por nível de ataque). https://www.dustloop.com/w/GGXRD-R2/Frame_Data
- Source Gaming: Sakurai sobre a parada no golpe. https://sourcegaming.info/2015/11/11/thoughts-on-hitstop-sakurais-famitsu-column-vol-490-1/
- Capcom, SF Seminar (parada sistemática) [trecho]. https://game.capcom.com/cfn/sfv/column/131545?lang=en
- Pixar, Elemental Fire ("cusps and curves") [trecho, página redirecionada]. https://graphics.pixar.com/library/ElementalFire/paper.pdf
- Gilland, *Elemental Magic* vol. 1 (Routledge/Focal) [só prévia; conteúdo não verificado]. https://www.routledge.com/Elemental-Magic-Volume-I-The-Art-of-Special-Effects-Animation-1st-Edition/Gilland/p/book/9780240811635
- Arhfoundation, quadros de impacto (1 a 3 quadros) [não verificado, fonte fraca]. https://www.arhfoundation.org/impact-frames-meaning

Não verificado ou não encontrado:
- os princípios detalhados de Gilland;
- o livro de efeitos de Toshiyuki Inoue (P.A.WORKS, volume "explosão, fogo e fumaça");
- o PDF original do guia do LoL (fora do ar);
- contagem publicada de quadros de faísca em SF, BlazBlue ou Skullgirls;
- se a faísca anima durante a parada no golpe: é prática observada, sem fonte.
