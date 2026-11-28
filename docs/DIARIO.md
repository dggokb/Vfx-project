# Diário do Sōkon FX

Uma entrada por rodada: o pedido, o que mudou, como foi conferido e o que falta. A mais nova
embaixo.

## 25/11 — O repositório vira o Sōkon FX

- **Pedido:** rever o projeto com uma direção melhor. O dono já tinha o Sōkon FX (HTML com canvas)
  e os hits do jogo já saem dele; a ideia é transformá-lo na ferramenta da
  [bíblia](biblia/BIBLIA_DE_VFX.md), sem refazer o que existe.
- **Feito:** o pipeline EffectCraft saiu da branch (guardado no histórico, commit `d9d100f`); a
  pesquisa de técnica ficou em `docs/pesquisa/`. O HTML do dono foi separado em `sokonfx/src/`
  (estilo, marcação, 15 arquivos de código, a imagem da pressão de ar à parte) e o
  `build.mjs` monta de volta um HTML único.
- **Conferido:** o primeiro build saiu **idêntico byte a byte** ao arquivo do dono. A trava de
  pixels (129 casos × 16 quadros) passa, e falha quando um número do gerador muda (testado
  mexendo no `tau` da pressão de ar: 13 casos acusados).
- **Achado:** a ferramenta guarda estado entre trocas de tipo (perfis, aparência), então o teste
  abre uma página limpa por caso.

## 25/11 — As duas versões viram uma

- **Problema:** o `SokonFX_4.html` do jogo (cópia da versão 3 com **Claridade da sombra** e
  **Dissipar em curvas** na Fumaça, de 21/11) e a versão nova do dono (com Água, Ponto de luz e
  Pressão de ar) se separaram. As 5 fumaças `_s4` que estão no jogo só saíam no `_4`.
- **Feito:** os dois controles entraram na versão nova (`03-fumaca.js`, `10-desenho.js`,
  `13-tipos.js`, `pagina.html`), do jeito que estavam no `_4`. Os tipos das fumaças do jogo estão
  em `sokonfx/tipos/jogo_fumacas_s4.json`.
- **Conferido:** carregadas como tipo salvo, as 5 fumaças saem **pixel a pixel iguais** aos 16
  quadros de cada uma guardados no jogo (`art/vfx/sokon/quadros/fumaca_*_s4`); na versão sem os
  controles saíam diferentes em até 148 mil pixels por quadro. Os outros 124 casos não mudaram.
  A referência da trava passou a ser este build.
- **Atenção para tipos antigos:** sem o campo `smokeForm` (mais novo que eles), um tipo de fumaça
  cai no **Linear** ao carregar por "Tipos salvos", que é como foi feito. O `gerar.js` do jogo não
  faz isso: ele deixa o que estiver na tela, e a versão nova abre no **Super pulo**.

## 25/11 — Exportar para o jogo

- **Pedido:** o Sōkon FX tem de ser a ferramenta "suprema"; o primeiro passo combinado foi tirar a
  conversão manual do caminho. Até aqui o dono exportava a folha 4×4 e uma sessão do jogo
  convertia: recorte, origem, escala, "reforça o brilho" (alfa^0,5, feito à mão quatro vezes em
  21/11), tempo e luz.
- **Feito:** painel **Exportar para o jogo** (`15-jogo-export.js`): nome da pasta, origem marcada
  na prévia (a cruz aparece com o painel aberto e não vai para o export), tamanho no jogo
  (1x = pixelScale 1,5, o dos impactos v09), resolução da folha (100/75/50%), primeiro e último
  quadro, segurar um quadro (`marcaMs`), reforço do brilho (alfa^(1/(1+v))), soma e luz no
  lutador. Sai um `.zip` com `<nome>/folha.webp` (WebP sem perda) e `<nome>/efeito.json`. O
  "Salvar tipo" guarda essas opções (`jogo`); tipos antigos abrem como antes.
- **Conferido:** `testes/export.test.cjs` baixa o zip pela página em 3 casos (o tipo "H" do dono
  com luz e reforço, uma fumaça do jogo com resolução 50%, trecho e quadro segurado, e a pressão
  de ar com soma) e confere zip, os campos que o `EfeitosVideo.ler` exige e cada quadro da folha
  decodificada contra o desenho. Fora do teste, o mesmo H passou pelo `tools/sprites/efeito_video.py`
  do jogo (16 PNGs, origem 256,256, 1x): **efeito.json idêntico** (quadros, deslocamentos,
  altura, tempos) e folha com o mesmo alfa (cor até 1 nível de diferença nos pixels visíveis).
- **No motor do jogo (PC):** o zip do H (reforço de brilho e luz `#F5C83E`) foi solto no lugar do
  `impacto_v09_forte` numa cópia de trabalho do jogo, só para o teste, e gravado com
  `gradle :pc:gravarLuta -Proteiro="segura:D espera:3.2 solta:D grava:55:g tecla:L fim"` (Ryūga
  chuta o Kōga). O `EfeitosVideo` leu a pasta sem erro, a faísca nasceu na ponta do pé e a luz
  apareceu no chão. Depois o jogo voltou ao que era (nada foi commitado lá).
- **Falta:** ver no celular e o dono julgar o painel e o efeito no vídeo.

## 25/11 — Prévia no jogo

- **Pedido:** seguir o plano: o preview de gameplay, para julgar o efeito no tamanho e no tempo da
  luta, no PC e no celular, sem precisar gravar vídeo no jogo.
- **Feito:** painel **Prévia no jogo** (`16-previa-jogo.js`). Com ele aberto, a prévia quadrada dá
  lugar a um palco 16:9:
  - fundo: um **print da luta** do aparelho (fica guardado no navegador), escuro, claro, ou duas
    silhuetas na escala de um lutador quando não há print;
  - calibragem: altura do lutador no jogo (px do mundo) e a altura dele no print, medida tocando na
    cabeça e nos pés; o ponto do golpe marcado com um toque;
  - o efeito tocado é o mesmo que o export gera, como o motor toca a faísca: 60 Hz, duração de
    `(max(6, pausa) + 8)` quadros (×0,7 nos `impacto_v0*`), folha esticada para caber,
    `FAISCA_ESCALA` (1; 1,15 no especial; 1,25 no Super), ângulo, espelho e soma em duas passadas,
    lidos de `GameView` e `EfeitosVideo` do jogo;
  - força L/M/H/especial/Super com a pausa (8, 11, 16), contador da pausa, câmera lenta (¼);
  - **comparar** com um efeito do jogo: o `.zip` (do Sōkon FX ou do celular, com deflate) ou a
    folha + `efeito.json` soltos, lado a lado, as duas janelas centradas no golpe.
  - A luz que o efeito joga nos lutadores **não** é simulada (o aviso está no painel).
- **Conferido:** `testes/previa.test.cjs` (tempos L/M/H 187/222/280 ms, quadro por idade, zips
  dos dois tipos, efeito só depois do golpe e sumido no fim, toque para golpe e altura, lado a lado,
  fechar). No PC, com um quadro da gravação do jogo como print (só no rascunho; não entra aqui),
  o H do dono lado a lado com o `impacto_v09_forte` do jogo. Na gravação do motor de 25/11, a
  faísca ficou na tela do quadro 11 ao 28 (cerca de 17 a 60 Hz, ~283 ms); o preview calcula 280 ms.
  Tela de celular (Pixel 7, emulada): palco e painel cabem.
- **Falta:** o dono usar no celular com um print de verdade e dizer se o tamanho e o tempo batem
  com o que ele vê no jogo.

## 25/11 — Composição de camadas

- **Pedido:** o passo seguinte do plano: um efeito feito de vários, como o soco pesado do Kōga na
  bíblia (estrela, onda de choque, faíscas, poeira, detritos).
- **Feito:** painel **Composição de camadas** (`14-composicao.js`). Faz-se um efeito na tela e
  **Adicionar o efeito da tela**, ou adiciona-se um tipo salvo. Cada camada tem: começa no quadro,
  mover para o lado e para cima/baixo, tamanho, giro, opacidade, soma como luz, espelhar, esconder,
  subir/descer, **Levar para a tela** (para ajustar) e **Trocar pela tela** (para gravar o ajuste).
  A primeira camada fica embaixo. Com a composição ligada, a prévia quadrada, a **Prévia no jogo** e
  o **Exportar para o jogo** usam a composição; o número de quadros acompanha (uma camada que começa
  no quadro 4 leva a 20). O "Salvar tipo" guarda a composição (com o tipo inteiro de cada camada),
  e o `efeito.json` também.
- **Como desenha:** cada camada põe o tipo dela na tela, desenha os 16 quadros, guarda e devolve a
  tela ao que era (tipo, quadro, nome). Tipo antigo com campo faltando pega o valor da tela nessa
  hora (é assim desde a ferramenta original ao abrir um tipo); a camada passa a guardar o tipo
  completo, para sair sempre igual depois.
- **Conferido:** `testes/composicao.test.cjs`: camada desenhada numa página que já abriu outros
  tipos sai pixel a pixel igual ao tipo numa página limpa; a tela volta ao mesmo tipo e desenho;
  uma camada sem mudanças = o próprio efeito; início atrasado estica a composição; mover, girar e
  esconder; export com 20 quadros e a composição no `efeito.json`; tipo salvo com composição volta
  igual numa página nova. Exemplo visto: o H do dono + um anel de pressão de ar somando, do
  quadro 2.
- **Falta:** o dono montar uma composição de verdade e julgar na prévia no jogo e no jogo.

## 25/11 — Geradores novos: Defesa, Choque, Raio e Linhas de mangá

- **Pedido:** "vai fazendo tudo"; o dono autorizou fazer aqui também o que era de Fable. Passo 5
  do plano: geradores que o jogo ainda não tem.
- **Como entram:** um registro (`09a-geradores.js`): cada gerador declara os controles e a função
  que desenha; o painel se monta sozinho, os controles do efeito antigo somem enquanto ele está
  escolhido e voltam iguais ao trocar de volta. Os campos entram no "Salvar tipo". Os efeitos
  antigos não mudaram (os 129 casos de antes continuam pixel a pixel).
- **Regras de arte que todos seguem** (skill `vfx-luta` do jogo, bíblia e as referências do dono):
  faixas chapadas da borda funda (não preta) ao miolo branco; estoura inteiro no contato; some
  quebrando a forma (pedaços que afinam), não por transparência; dois em dois; aponta para a
  direita; brilho de fundo pouco e opcional; nada encosta na borda do quadro de 512.
- **Defesa:** arco de luz com a barriga no ponto do contato (onde o jogo põe a defesa), estalo de
  raios desiguais, lascas para trás e para os lados, e o arco se parte em pedaços desiguais.
  Formas: arco, arco duplo, anel. A primeira versão tinha uma estrela de 5 pontas regular (cara de
  clip-art, o "amador" que o dono já reprovou) e o brilho no lugar errado; refeita.
- **Choque (clash):** duas lanças em X com clarão de 4 pontas desigual, anel fino que se parte,
  linhas finas em volta e faíscas; as lanças estilhaçam pelo próprio eixo.
- **Raio:** zigue-zague com poucos trechos e ângulos duros (a primeira versão parecia galho),
  ramificações, raio novo a cada par de quadros, partido em traços no fim.
- **Linhas de mangá:** concentração (cunhas para o meio, meio limpo que cresce) ou velocidade
  (riscos paralelos), trocando a cada par de quadros. Branco puro some em fundo claro; o padrão é
  70% branco e o resto na cor.
- **Conferido:** 19 casos novos na trava (todos diferentes entre si; com dois em dois, 8 desenhos
  em 16 quadros); `testes/geradores.test.cjs` (painel de cada um, volta do painel antigo igual,
  export, nada na borda; o Choque passava da borda e foi corrigido). Vistos quadro a quadro em fundo
  escuro e claro.
- **Falta:** o dono julgar; nenhum deles foi para o jogo ainda.

## 25/11 — Aura, Detritos e a beira do quadro

- **Aura** (energia, Tōkon, SHINKAI): labaredas em volta do corpo, só no chão ou em bola (mão,
  carga), com fagulhas subindo; é um **laço** (o quadro depois do último é igual ao primeiro,
  conferido no teste). Origem nos pés, não gira com a Direção. Primeiras versões: velas soltas,
  depois cada língua contornada; ficou desenhando faixa por faixa em todas as línguas juntas (todas
  as bordas, depois a cor, o meio e o miolo), e a aura vira uma silhueta só com o claro por dentro.
- **Detritos** (terra, pedra): pedaços irregulares com lado aceso e lado de sombra (não é luz, então
  não fica branco), gravidade e quique no chão, pedrinhas e poeira chapada que abre e se parte.
- **Beira do quadro:** com os controles no máximo, vários geradores passavam do quadro de 512 (a
  folha cortaria reto no jogo). Os geradores novos agora se apagam nos últimos 28 px, como o
  `--borda` do conversor do jogo; o teste confere a beira em todas as variações da trava.
- **Conferido:** 158 casos na trava (os 129 antigos sem mudança, conferidos antes de trocar a
  referência com `CASOS=` no teste de pixels); `geradores.test.cjs` com os 6 geradores.
- **Falta:** o dono julgar os 6 na prévia no jogo; a aura dos lutadores no jogo hoje é desenhada pelo
  código do jogo (`GameView`), então usar esta precisa de decisão dele.

## 25/11 — Instalar no celular e usar sem internet

- **Pedido:** o dono usa no PC e no celular ("às vezes eu posso estar fora do PC").
- **Feito:** `sokonfx/site/` (manifesto, ícones feitos com o próprio gerador de Choque e um
  service worker). O workflow do Pages publica `index.html` (o dist) com eles. Aberto pelo link, o
  navegador oferece "instalar"/"adicionar à tela inicial" e o app abre sem internet; com internet,
  baixa a versão nova por trás. Aberto como arquivo (file://), segue como antes.
- **Conferido:** num servidor local, o service worker assume a página; com a rede desligada, a
  página recarrega inteira (15 efeitos) e o manifesto responde.
- **Falta (do dono):** juntar a branch na `main` e ligar Settings → Pages → Source: GitHub Actions.

## 25/11 — Explosão, Onda de choque, Faíscas, Gelo, Vento e vórtices, Feixe de energia

- **Pedido:** seguir a lista do que falta da bíblia, nesta ordem: combate (Explosão, Ondas de
  choque, Faíscas), poderes (Gelo, Vento, Feixes), depois o editor.
- **Explosão:** clarão branco de raios desiguais no contato; bola de fogo de bolas chapadas
  desenhadas faixa por faixa (uma silhueta só); esfria do branco ao laranja e à fumaça ("Vira
  fumaça"); se parte em bolas que sobem e encolhem, como o diagrama de dissipação da bíblia; anel e
  estilhaços. Primeira versão subia até bater no topo; origem mais baixa e subida menor.
- **Onda de choque:** anéis em sequência que abrem do ponto, frente clara e rastro na cor, afinam e
  se partem em arcos; "deitado no chão" achata e engrossa a frente. O círculo perfeito parecia de
  compasso; ganhou uma ondulação leve de traço de mão (a primeira dose foi demais e virou polígono).
- **Faíscas:** leque de riscos esticados pela velocidade, com gravidade, encurtando e afinando.
- **Gelo:** pontas de cristal com face acesa, face de sombra e fio branco na aresta; crescem em 2
  desenhos e se estilhaçam em 3 pedaços cada, com geada em volta.
- **Vento e vórtices:** rajada (arcos que nascem pela frente e somem pelo rabo) ou vórtice (traços
  em espiral em volta de um eixo de pé, mais largo em cima), com poeira levada pelo ar.
- **Feixe de energia:** sai da esquerda do quadro (origem em x 52, até 420 px), dispara fino, abre,
  pulsa com a borda tremida e espiral, afina até o fio e se parte; clarão na boca. Os geradores
  agora podem escolher a origem em x e y.
- **Conferido:** 183 casos na trava (os antigos e os 6 geradores de antes sem mudança, conferidos
  com `CASOS=` antes de trocar a referência); `geradores.test.cjs` com os 12 geradores (painel,
  volta do painel antigo, export, nada na beira em todas as variações).
- **Falta:** o dono julgar; o vórtice ainda está ralo no padrão.

## 25/11 — Editor: vizinhos, rampa de cor e export em lote

- **Vizinhos (onion skin):** botão **Vizinhos** embaixo da prévia: o quadro anterior (avermelhado)
  e o seguinte (esverdeado), apagados, por baixo do quadro atual. Só na prévia; o export não muda
  (conferido no teste).
- **Rampa de cor:** nos geradores novos, **Rampa de cor** muda a Cor da energia até a **Cor no fim**,
  a partir de "Começa a mudar em" (o calor que esfria, a energia que apaga). Salva no tipo; nos
  efeitos antigos o bloco não aparece e nada muda (trava de pixels).
- **Export em lote:** em Exportar para o jogo, **Baixar vários tipos salvos**: marca os tipos e baixa
  um `sokonfx_lote.zip` com uma pasta por tipo, cada uma com as opções de export que o tipo guardou
  (e a composição, se tiver). A tela volta ao que era (tipo, export e composição).
- **Conferido:** `testes/editor.test.cjs`; a bateria inteira passa (183 casos sem diferença).

## 25/11 — Teletransporte, Portal, Gases e vapores, Energia sombria

- **Pedido:** "faz tudo": o que ainda cabia no Sōkon FX da lista da bíblia.
- **Teletransporte:** o sumiço do anime: coluna de riscos verticais da altura do lutador que treme
  de dois em dois e fecha para o meio e para cima até um fio; "Aparecer" toca ao contrário.
- **Portal:** disco que abre girando em espiral de faixas, aro pontudo claro, rachaduras de luz
  saindo da borda; fecha para o meio com um estalo. "De lado" achata.
- **Gases e vapores:** nuvem de bolas chapadas na cor (sombra, cor e luz deslocadas, volume sem
  contorno), que incha, deriva com o vento, sobe e se desfaz em bolas soltas; bolhas.
- **Energia sombria:** tentáculos de tinta escura com o fio de luz da cor por dentro (o escuro tem o
  miolo aceso, porque efeito é luz), enrolando e subindo; no fim se partem em gotas. Mudando a cor,
  serve de energia espiritual. Primeira versão saiu fina e o corpo escuro sumia no fundo.
- **Conferido:** 200 casos na trava (os 183 de antes sem mudança; um caso novo da rampa de cor no
  Choque); `geradores.test.cjs` com os 16 geradores.

## 25/11 — O resto do que cabe no Sōkon FX: decal, rastro, dissolução, sombra e os que estavam pela metade

- **Pedido:** seguir com os 4 que ainda cabiam (Decals, Motion Trails, Máscaras e dissolução,
  Sombras de efeitos) e dar gerador próprio ao que estava pela metade.
- **Acabamentos para todos os geradores novos** (no bloco da rampa de cor, salvos no tipo):
  **Dissolver no fim** (some por buracos de um ruído fixo, com a beira acesa na cor; o primeiro ruído
  era fino e parecia granulado) e **Sombra no chão** (a silhueta escura, achatada embaixo da linha do
  chão).
- **Decal (marca no chão):** rachadura, queimado ou cratera no plano do chão; brasa nas rachaduras
  que esfria; fecha das pontas para o meio. A primeira versão era fina demais para ler.
- **Rastro do golpe:** véu claro meio transparente com riscos finos dentro (a última referência do
  dono para o rastro), num arco; nasce no começo, cresce até o fim do golpe e se apaga pelo rabo
  (regras 5 a 8 da skill `vfx-luta`). O jogo hoje desenha o rastro pelo caminho detectado do membro;
  este serve para golpes sem caminho ou para testar o desenho.
- **Poeira** (e terra/areia pela cor): bolas chapadas rente ao chão, para os dois lados, para a
  frente ou para trás; cada uma vira duas menores ao desfazer; grãos que pulam.
- **Partículas:** emissor genérico (losango, bola, estrela, lasca, pena, quadrado; leque,
  velocidade, gravidade inclusive negativa, giro, vida).
- **Brilhos e flashes:** estrelinhas de 4 pontas com riscos em X que piscam espalhadas, ou o clarão
  (disco branco de borda pontuda por 2 quadros que vira anel e se parte).
- **Energia espiritual:** chamas-gota claras com cauda que sobem em volta, em laço.
- **Conferido:** 232 casos na trava (os 200 de antes sem mudança); `geradores.test.cjs` com os 22
  geradores novos (painel, volta do antigo, export, nada na beira em todas as variações).
- **Fica para o motor do jogo** (não é folha de sprites): afterimages, deformações, distorções,
  HUD, cinematics e transições. **Fica para depois no editor:** keyframes, curvas, nós, caminhos,
  emissor visual e vínculo com parte do personagem. **Não começado:** o VFX próprio de cada
  personagem (precisa do dono).

## 25/11 — Fechando o que faltava: curva de tempo, dissipação, luz, emissor, rastro, afterimage e os kits dos 16

- **Pedido:** "faz tudo q falta".
- **Curva de tempo** (o editor de curvas e de ritmo da bíblia; painel **Curva de tempo**): Normal
  (não muda nada), Rápido no começo, Lento no começo, Segurar o contato (quadro e quantos quadros) e
  Livre (Bézier com dois pontos que se arrastam no gráfico). Vale para todo efeito, antigo ou novo,
  e para a composição e o export; salva no tipo. O gráfico mostra os quadros como degraus.
- **Dissipação:** "Como dissolve": buracos espalhados, de fora para dentro, de dentro para fora, de
  baixo para cima, de cima para baixo (o ruído quebra a borda da frente).
- **Iluminação na prévia no jogo:** com o `"luz"` do export, uma luz da cor do efeito em volta do
  golpe, somada à cena, que acende em 15% do tempo e apaga no resto como a do jogo
  (`EfeitosVideo.vida`), com o alcance em alturas de tela. É aproximada: o jogo ilumina só os
  lutadores e o chão (o print é uma imagem só).
- **Partículas:** emissor em ponto, linha de pé, linha no chão ou círculo, com tamanho.
- **Rastro do golpe:** estilos da proposta por personagem (arco limpo, riscos de garra, pincelada
  larga, seda, arco rasgado, fogo, tinta que escorre, vapor, lâmina, leque, fita que muda de cor) e
  **caminho desenhado com o dedo** na prévia (o traço vira o caminho, desfazendo a Direção).
- **Afterimage:** o sprite do lutador carregado do aparelho (guardado no tipo, não no repositório)
  deixa cópias tingidas que aparecem em sequência e somem em fatias que escorregam; sem sprite, uma
  silhueta.
- **Kits dos 16 personagens** (`sokonfx/tipos/personagens.json`, 48 tipos): rastro, faísca de acerto
  e antecipação de cada um, a partir da tabela "Proposta de base: o kit de cada personagem" do
  `docs/efeitos-referencia-tokon.md` do jogo. Faísca: a família do H do dono, com a cor e o material
  de cada um. Os "a definir" da tabela ganharam a cor que a ficha já usa (pedra do Krüger, gelo do
  p14, dourado da Natisuko, ciano da Bonnie). Cada tipo já vem com o nome da pasta de export
  (`rastro_p01`, `faisca_p01`, `antecipacao_p01`...). São rascunho para o dono corrigir, como a
  própria tabela diz.
- **Conferido:** 303 casos na trava (os 220 de antes sem mudança; Rastro e Partículas mudaram de
  propósito e os 48 tipos dos kits entraram); `editor.test.cjs` com a curva (inclusive arrastar o
  ponto), o caminho desenhado com o mouse e a luz na prévia.
- **O que não dá para fazer aqui:** distorção e deformação de tela, HUD, cinematics e transições
  são do motor do jogo (shader e cenas no `GameView`), e o próprio `CLAUDE.md` do jogo deixa intro,
  abertura e cinematics para depois de fechar a jogabilidade. O editor de nós e o vínculo com parte
  do personagem também são do motor (a origem do export já é o ponto que o jogo prende na ponta do
  golpe).

## 25/11 — Desvetorizar: primeiro teste num hit normal

- **Pedido:** "agora precisamos começar a deixar mais profissional; como podemos desvetorizar?".
- **Primeira tentativa (descartada):** filtros por cima de efeitos prontos (tinta que espalha,
  contorno tremido, pincel seco, brilho em duas cores, granulação). O dono: "não entendi o que esse à
  mão faz de diferença além de deixar borrado". Tinha razão: o que se via era o desfoque do brilho, e a
  tinta comia os riscos finos do H. Lição: **filtro por cima não desvetoriza; a forma é que precisa
  ser desenhada diferente.**
- **Feito:** gerador **Hit (à mão)** (`09y-gerador-hit.js`), "faz um hit normal":
  - borda de pincel: cada lado das pontas ondula e engrossa (subdividido e empurrado por ruído);
  - as faixas não são cópias da mesma forma: o miolo é outro desenho, deslocado e mais torto;
  - pincel seco: riscos radiais finos comem a faixa de fora;
  - desenho novo a cada par de quadros (as pontas mudam de lugar e de tamanho);
  - estouro branco irregular no contato; depois a forma se parte em lascas que voam e afinam.
  - A primeira versão tinha pontas largas e onduladas (cara de folha) e miolo pequeno; afinadas,
    desiguais e com o estouro branco maior.
- **Conferido:** vídeo na prévia no jogo, lado a lado com o H do dono, no tempo do motor (pausa 16,
  280 ms) e a ¼; 1x lê bem mais forte que o H (talvez grande: o controle Tamanho ajusta). Na trava
  de pixels e no teste dos geradores.
- **Falta:** o dono dizer se é esse o caminho; se for, levar borda de pincel, faixas desencontradas,
  pincel seco e desenho por par de quadros para os outros geradores.

## 25/11 — O hit do concept do dono: núcleo elétrico em camadas e estilhaços

- **Pedido:** o dono mandou um concept de tela de luta e pediu o hit dele ("o que precisaríamos mudar
  hoje para conseguir um hit como esse").
- **Leitura do concept:** são umas sete peças: núcleo branco-amarelo-laranja-vermelho com pontas
  serrilhadas em camadas e fio vermelho-escuro; estilhaços longos (lâminas brancas curvas e raios
  amarelos) na linha do golpe, para os dois lados, indo a meia tela; anel fino dourado; luz laranja;
  fagulhas; e, no chão sob quem apanha, poeira em volutas, rachadura e pedras; ar nas costas de quem
  bate.
- **Feito:** o Hit (à mão) ganhou o estilo **Elétrico em camadas** (padrão): quatro camadas de pontas
  próprias, desencontradas (vermelho, a cor, amarelo, branco), borda serrilhada, fio vermelho-escuro,
  pincel seco, luz por trás. Gerador novo **Estilhaços**: lâminas brancas com sombra cinza e raios em
  zigue-zague, na linha do golpe e para trás. Composição de teste: anel + estilhaços + núcleo +
  fagulhas.
- **Conferido:** lado a lado com o recorte do concept. Primeiras versões: pontas finas e puxadas para um
  lado (parecia um feixe de raios, não um estouro); estilhaços pequenos; o pincel seco cortava a luz de
  fundo (agora a luz vai por trás no fim).
- **Falta para chegar ao concept:** estilhaços três vezes mais longos que o núcleo (o quadro de 512 não
  cabe: quadro em alta e peças separadas), as peças do chão presas no chão (o jogo precisa tocar um
  kit), e a luz nos lutadores.

## 25/11 — Desenho em alta (2x) e export em peças (kit)

- **Desenho em alta:** em Exportar para o jogo, "Desenho: Em alta (2x)". Os geradores novos desenham
  com o dobro de pixels (a tela deles acompanha a escala de quem desenha) e o `pixelScale` dobra:
  mesmo tamanho no jogo, folha mais nítida. Os efeitos antigos usam uma tela interna de 512 e saem
  esticados em 2x (sem ganho). A folha em 2x pode ter até 4096 px de largura; se ainda não couber, o
  export reduz a resolução em passos de 20% e avisa (o hit elétrico em 2x dava 2042×5561).
- **Export em peças (kit):** cada camada da composição ganhou "No jogo: na frente / atrás" e "Nasce:
  na ponta do golpe / no chão, sob quem apanha". O botão "Baixar a composição em peças (kit)" gera
  uma pasta por camada (com posição, tamanho, giro, espelho e opacidade da camada já desenhados; peça
  que soma vai com `"soma": 1`; a luz vai na primeira) e `<nome>/kit.json` (`sokonfx-kit-v1`: cada
  peça com `efeito`, `atrasoMs`, `camada`, `ancora`). Peça no chão tem a origem no chão do desenho dela.
- **Conferido:** `editor.test.cjs`: alta com o dobro de pixels e a mesma altura no jogo; kit com 2
  peças (núcleo na frente no golpe, somando; poeira atrás no chão, do quadro 2 = 83 ms), `pixelScale`
  3 em 2x, poeira assentada no chão, tela e composição de volta depois.
- **Falta:** o jogo ler o `kit.json` e tocar as peças (hoje toca um efeito por acerto).

## 25/11 — O kit do concept tocando no motor do jogo (PC, sem enviar ao jogo)

- **Feito no jogo (só na cópia de trabalho, não enviado):** `EfeitosVideo` lê `kit.json`
  (`sokonfx-kit-v1`) das pastas de `assets/efeitos` e toca as peças juntas (`tocarKit`): as do golpe
  na ponta do golpe, esticadas como a faísca; as do chão em `defender.x, defender.y` (os pés de quem
  apanha), no tempo delas; cada uma espera o atraso sem desenhar (idade negativa) e vai atrás dos
  lutadores se a camada pede. O `GameView.efeitoDeGolpe` procura `kit_fraco`, `kit_medio`,
  `kit_forte`, `kit_super` antes da faísca de sempre; sem kit, nada muda.
- **Teste:** o kit do concept (anel, estilhaços, núcleo elétrico, fagulhas no golpe; rachadura,
  poeira e pedras no chão; 2x, tamanho 1,2x) instalado como `kit_forte` e gravado no PC
  (`gradle :pc:gravarLuta -Proteiro="segura:D espera:3.2 solta:D grava:60:g tecla:L fim"`, Ryūga
  chuta o Kōga). As peças tocaram nos lugares certos; o log ficou em 52–59 fps no PC. A rachadura
  quase não aparece no chão escuro do cenário. Celular não visto (7 folhas em 2x de uma vez: medir lá).
- **Falta:** o dono julgar no vídeo e autorizar mandar o código (e o kit, se quiser) para a
  `game-luta-sprite-fable`.

## 25/11 — Fazedor: efeito por ruído em degraus (WebGL)

- **Por quê:** o dono quer um "fazedor" de efeito, porque conseguir um bom efeito em vídeo gerado
  é difícil. Desenhar formas por código (estrela, lasca, e depois os "carimbos" com contorno e faixas)
  não chegou perto da bola do Ryūga tirada de vídeo ("a intenção foi boa, mas n rolou"): os carimbos e
  a "Bola de energia" foram descartados sem entrar no repositório.
- **O jeito novo (o das ferramentas de efeito de jogo):** um campo (onde o efeito é forte) comido por
  ruído animado e cortado em cinco degraus de cor chapada (contorno escuro, base, cor, meio, miolo),
  com um véu de brilho em volta. Roda na placa de vídeo (WebGL2) e entra como o gerador **Fazedor**
  (`09zb-gerador-fazedor.js`): formas Bola em voo (loop), Estouro, Coluna/labareda (loop) e Aura no
  corpo (loop); matérias Fogo, Elétrico e Fumaça; tamanho, cauda/altura, força, tamanho e velocidade do
  ruído, brilho, anéis, brasas (Partículas) e dois em dois. A cor da energia dá os degraus (quente puxa
  o escuro para o vermelho; fria, para o anil). Loop sem emenda: dois ruídos que correm, misturados
  pelo tempo. O estouro se desfaz quebrando (o ruído esticado nas pontas come a forma), não apagando.
- **Conferido:** protótipo do S1 do Ryūga (voo e acerto) convertido com o `efeito_video.py` do jogo e
  gravado na luta ao lado do de hoje (só na cópia de trabalho; a bola original voltou). Na tela da
  ferramenta, `npm test`: 311 casos sem diferença, export, prévia, composição, geradores (com o
  Fazedor exportando e sem encostar na borda) e editor.
- **Falta:** o dono julgar; acertar luz e anéis da bola (a de hoje tem o miolo mais branco e anéis de
  luz); mais formas (feixe, onda no chão, rastro do golpe) e matérias (água, gelo).
- **Forma desenhada (25/11, pedido do dono: "faz uma forma de eu conseguir desenhar"):** a forma
  "Desenhada" usa o desenho do dono como campo. "Desenhar na prévia" pinta direto na prévia (dedo ou
  mouse) com pincel macio; a força do pincel manda na cor (fraca fica no vermelho e laranja, forte chega
  no miolo claro; cada traço entra com a força dele, passar de novo reforça), borracha e apagar. Dois
  desenhos: o do começo e, se quiser, o do fim (o efeito se transforma de um no outro ao longo dos
  quadros). "Para onde a matéria corre" (sobe, para trás, para a frente, desce, ferve no lugar); as
  brasas nascem nos pontos fortes do desenho. Os desenhos ficam no tipo salvo (PNG em fzDesenhoA/B).
- **Hit do concept no Fazedor (25/11):** pincel com "Afinar até a ponta" (o traço sai grosso de onde
  começa e afina até a ponta; caneta com pressão afina e engrossa) e traço com perfil de cone (as manchas
  se juntam pelo maior valor, sem encher), "O desenho no tempo" (ferve, estoura e se quebra, do começo
  ao fim) e a matéria correndo "para fora" do centro do desenho. A coroa do concept foi pintada com o
  mouse (miolo, 13 pontas grandes, 11 pequenas, 7 riscos longos) e montada em kit com o anel, as faíscas
  e o chão do kit anterior (`sokonfx/tipos/fazedor_hit_concept.json` tem o tipo com o desenho). Gravado
  no PC no `kit_forte` (só na cópia de trabalho do jogo). Os desenhos agora ficam guardados por PNG e
  `aplicarTipo` espera eles carregarem (antes a composição montava a camada vazia).
- **Hit em camadas, gerado (25/11, o dono: o pincel "depende muito de mim e faz a produção cair"):**
  forma "Hit em camadas (gerado)" no Fazedor, sem pincel. Três camadas de pontas saindo do contato
  (atrás maior e só até o amarelo, meio, frente curta que chega no branco), compridas, curvas e de
  tamanhos diferentes; antes de cada ponta entrar, um sulco com a forma dela é aberto no que já está
  desenhado, e onde ela cruza outra fica a linha vermelha entre as duas (contorno por dentro). Raios
  de luz retos com uma ou duas dobras na frente. Controles: pontas, comprimento, curva, para onde abre,
  abertura, raios, contorno por dentro, camadas. Cada "Gerar variação" dá outro hit (semente);
  o resultado fica guardado. O brilho vai só na camada da frente (as de trás somavam uma mancha).

## 25/11 — Pesquisa de design de efeitos e a forma "Imagem"

- **Pesquisa (o dono: "manda uns agentes pesquisar e faz vc se tornar um especialista"):** quatro
  relatórios em `docs/pesquisa/efeitos/` (técnicas de efeito estilizado e o que deixa uma ferramenta
  de efeitos profissional já estão; forma no anime e hits de jogos de luta chegando). O ponto comum:
  a silhueta vem de forma desenhada (à mão ou gerada como imagem), o ruído só come a borda.
- **Codex:** instalado e logado com a conta do dono (login por código); gera imagem daqui
  (`codex exec`, recurso image_generation). A primeira forma de hit gerada já respeita grande, médio,
  pequeno e a direção do golpe.
- **Forma "Imagem (forma pronta)" no Fazedor:** a imagem (fundo preto vira transparente; a âncora é o
  meio da parte mais clara) abre do contato em N quadros, segura com tremido de desenho à mão e se
  desfaz em pedaços usando a própria claridade como mapa de erosão (contorno primeiro, miolo por
  último), com borda escura nos pedaços; cores da imagem ou os degraus da cor da energia; brasas dos
  pontos fortes. Imagem até 1024 px (o campo de imagem aceita `lado`).
- **Guia e primeira forma "de verdade" (26/11):** `docs/GUIA_DE_EFEITOS.md` junta as quatro pesquisas
  (forma, tempo, cor, tamanho por golpe, como produzimos, o que falta na ferramenta). Regra nº 1:
  redesenhar a silhueta a cada desenho. O Codex desenhou a folha 2×2 de desenhos-chave do forte
  (clarão, abertura, pico, quebra); a forma Imagem do Fazedor ganhou "desenhos na folha" (colunas ×
  linhas): toca a sequência com exposição de anime (o clarão curto, o pico mais longo) e o último
  desenho se desfaz rasgando. O tipo está em `sokonfx/tipos/fazedor_forte_codex.json`.
- **Erro achado e corrigido:** a origem do export ficava sempre no centro (256), mas o Fazedor desenha o
  contato em 300 (o Feixe em 52...): o efeito saía deslocado no jogo (o "acima e à direita" do hit
  anterior). Agora a origem segue o ponto de contato do gerador enquanto não for marcada à mão; uma
  origem guardada num tipo, diferente do contato, vale como marcada.
- **No jogo (só na cópia de trabalho):** o kit do forte com a sequência, o anel centrado no contato e o
  chão, em 70% (perto de metade da altura do lutador), gravado num chute forte do Ryūga.
- **Rodada 2 do forte (26/11; o dono: "o desenho está torto, a dissipação muito ruim, não explode,
  aquilo faria com imagem recortada no Paint"):** o eixo do hit tem que seguir o golpe (o desenho aponta
  reto para a frente; o jogo gira pelo ângulo do golpe) e explosão é movimento entre desenhos, não 4
  recortes trocando. O Codex fez uma folha 3×3 de 9 desenhos na horizontal (clarão, explosão, pico,
  pico redesenhado, pontas se partindo, pedaços, restos). A forma Imagem ganhou: cada desenho cresce
  enquanto está na tela (soco ao entrar; depois do pico tudo segue para fora), flash branco no contato
  e halo da cor por baixo, e a saída "estilhaça" (o desenho se parte em células que voam do contato,
  giram, encolhem e esfriam para o vermelho) no lugar do ruído comendo a forma ("o ruído come" ficou
  como opção). Kit do forte sem o anel fino, gravado contra o hit de hoje.
- **Rodada 3, comparado com um jogo profissional (26/11):** o dono mandou gravações do Marvel Tōkon
  (Arc System Works). Lado a lado, o hit de lá: nasce cheio no primeiro quadro (sem crescer), placas
  rasgadas em zigue-zague (não chama lisa), sem contorno escuro (amarelo-creme, amarelo, ponta laranja),
  duas peças (estouro no contato e um jato fino na direção do golpe), e some em lascas amarelas que voam,
  em uns 5 desenhos. O Codex desenhou uma folha 3×2 original com essas regras; a forma Imagem ganhou
  "nasce cheio" (o estouro segura os dois primeiros desenhos) e "pedaços esfriam" (desligado: as lascas
  ficam amarelas). Tipo em `sokonfx/tipos/fazedor_hit_amarelo.json`; gravado no chute forte (só cópia
  de trabalho do jogo).
- **Rodada 4 (26/11; o dono: "o melhor feito até agora, mas dá para melhorar"):** o Codex refez a
  folha a partir da anterior (jato até a beira e grosso perto do estouro; a quebra lenta e perto do
  contato, rachando). Na ferramenta: o tempo do "nasce cheio" divide melhor (estouro 2 desenhos, quebra
  mais longa), "quanto os pedaços voam" (35% neste), brilho somado no export (soma 0,35), e a cor do
  desenho tirado do fundo preto deixou de escurecer nas bordas (a cor é desfeita pelo próprio brilho).
- **Rodada 5 (26/11; o dono: "muito grande e muito amarelo; não gosto quando abre e volta para o meio;
  tem que abrir e explodir"):** folha nova do Codex com miolo branco pequeno, faixa fina de amarelo e
  o resto laranja com pontas vermelho-alaranjadas; depois do estouro os pedaços se afastam do contato a
  cada desenho (o meio fica vazio). Na ferramenta, "explode para fora depois do estouro" (a escala cresce
  em volta do contato a partir do terceiro desenho; 45% neste) e os pedaços voam 100%. Tamanho no jogo
  62%. Tipo em `sokonfx/tipos/fazedor_hit_explode.json`.
- **Rodada 6 (26/11; o dono: "pedaços na direção do golpe, brilho e pressão de ar"):** "pedaços
  seguem o golpe" na forma Imagem (depois do estouro a imagem estica no eixo do golpe, achata no outro
  e anda para a frente; no estilhaço os pedaços puxam para a frente), 75% neste; a imagem some aos
  poucos na beira dela. Brilho do Fazedor em 90% (clarão no contato e halo) e o kit ganhou a pressão de
  ar (anel pontudo branco somando luz, um quadro depois). O desenho dentro do quadro ficou menor (110%)
  e o export maior (96%), para não cortar na beira do quadro de 512.
- **Rodada 7 (26/11):** o dono aprovou um hit desenhado pelo Codex em cima do chute (no estilo do concept
  dele) e lembrou que quem anima tem que ser o Sōkon FX, não o Codex. A forma Imagem ganhou "como abre:
  as pontas se desenham do centro" (um desenho só: a frente das pontas avança do contato, rasgada) e o
  estilhaço passou a cortar em fatias de raio (setores e duas faixas), que voam cada uma na sua direção.
  Erro meu: animei um desenho refeito pelo Codex, que saiu diferente do aprovado (menor, mais vermelho,
  pontas finas); o dono: "nada a ver com o anterior". Próximo: usar o próprio desenho aprovado (o Codex só
  apaga personagens e cenário dele).
- **Rodada 8 (27/11; o dono: "eu já saí do Codex para fazer uma coisa decente, por que voltaria para ele?",
  e depois "Arcadia: pode rodar, testa o hit nele"):** montei o hit aprovado no Arcadia Effector (editor de
  partículas MIT), sem Codex. Receita: pontas em três tamanhos (5 grandes deslocadas para o lado do golpe, 9
  médias, 20 pequenas, sementes escolhidas numa grade), cada grupo em 4 camadas aninhadas com a mesma semente
  (tamanhos 100/80/60/38%) em tons de cinza; nascem num anel em volta do núcleo, apontando para fora, e esticam
  pela velocidade. A pixelização de 1 px troca cada cinza por uma faixa da rampa de fogo (vermelho-escuro,
  vermelho, laranja, amarelo, branco) e corta a borda seca; um rasgo (displace tear) come a borda e outro, mais
  forte, o núcleo; raios, anel dourado e clarão por cima, sem faixas. Gravado no chute forte ao lado dos
  desenhos do Codex: nasce cheio, esfria e se quebra para fora sem voltar ao meio; perde em massa (o do Codex
  tem núcleo branco maior e mais pontas finas). O dono: "o mais perto de algo que chegamos"; pediu o motor
  inteiro no Sōkon.
- **Rodada 8, integração:** o Arcadia inteiro entrou em `sokonfx/vendor/arcadia/` e virou o gerador
  **Arcadia (partículas)**: o build embute a página dele (iframe srcdoc, sem servidor), o gerador desenha cada
  quadro com o motor dele e o editor abre por cima ("Usar no Sōkon" grava o efeito no tipo). O hit forte é o
  primeiro modelo de fábrica (`vendor/arcadia/sokon/hit_forte.json`). Teste novo `testes/arcadia.test.cjs` no
  `npm test`. Falta: o dono julgar no celular e afinar o hit (núcleo maior, mais pontas finas, menor no jogo).
- **Rodada 9 (27/11; o dono trocou a prova de conceito: uma imagem de duas faíscas douradas, uma radial e
  uma com anel):** feitas no Arcadia, sem Codex, e guardadas como modelos (`vendor/arcadia/sokon/faisca_dourada*.json`).
  Receita: raios são rastros (trail) que saem do centro, em fuso, com o primeiro terço apagado (o espaço escuro em
  volta do núcleo na radial); riscos e brasas nascem num anel em volta do núcleo (no ponto exato eles enchiam o
  centro); cores âmbar escuras porque a soma de luz clareia sozinha; anel fino (8% do raio) com pouco brilho; na
  com anel, 4+4 raios longos na diagonal dão a direção. Comparado lado a lado com a imagem do dono.
- **Rodada 9, no jogo (o dono: "isso tá INCRÍVEL"):** a faísca com anel exportada pelo "Exportar para o jogo"
  (Arcadia, 16 quadros a 30 fps até 85% do efeito, 260 px de altura) no lugar do kit do chute forte, só na cópia de
  trabalho do jogo. Com soma 100% o dourado lavava para branco no cenário claro; ficou soma 55%. O anel some com os
  raios (antes ficava no ar como um círculo pálido): modelo ajustado.
- **Rodada 10 (27/11; o dono: "aumentar o volume no forte e deixar esse volume sem o círculo no médio"):** dois
  modelos novos, `faisca_dourada_forte.json` (44 raios, 7+7 diagonais mais grossos, núcleo, cruz e brilho maiores,
  mais brasas e riscos, anel maior; 320 px no jogo) e `faisca_dourada_media.json` (a com anel, sem o anel; 260 px).
  Exportados pelo Sōkon (soma 55%) e postos no jogo como `kit_forte` e `kit_medio` (só na cópia de trabalho);
  gravados no chute forte (L) e no soco médio (K).
- **Rodada 10, fraco (o dono: "faz um fraco agora"):** `faisca_dourada_fraca.json` (16 raios curtos, um par na
  diagonal, núcleo e brilho pequenos, poucas brasas, sem anel, 0,45 s), 190 px no jogo, como `kit_fraco` (cópia de
  trabalho). Gravados os três: soco fraco (J), soco médio (K), chute forte (L).
- **Rodada 11 (27/11; o dono: "faz os dois", o Super e o acerto do poder):** `faisca_dourada_super.json` (a forte
  maior: 56 raios, 9+9 diagonais, núcleo branco grande, 100 brasas, segundo anel que sai depois; 340 px, e o jogo
  ainda põe 1,25× no Super) como `kit_super`, e `onda_acerto_fogo.json` (leque de raios laranja aberto para a
  frente, no sentido da bola, com brasas e riscos no mesmo leque; 210 px) no lugar do `onda_acerto_player_base`
  (o acerto do projétil do Ryūga; o da Yin-lu, azul, ficou). O gerador ganhou o segundo anel e direção e cor
  próprias para raios, riscos e brasas. Gravados no jogo (Super com 5 pancadas e a onda).
- **Rodada 12 (27/11; o dono: "pressão de ar na defesa melhor que a nossa de hoje, nesse estilo", com uma
  referência de meia-lua de ar com fibras):** `defesa_ar.json`, `_2`, `_3` (três sementes e aberturas). Uma frente
  curva (anel com máscara radial: só a parte da frente fica) avança contra a guarda e cresce; fibras em rastro nascem
  ao longo dela (caminho animado com o raio) e abrem em leque para trás a partir de um foco atrás da frente (com
  direção fixa elas se cruzavam); brilho azulado e clarão curto no contato. Exportadas (270 px, soma 50%, luz
  #E6F0FF) no lugar das `defesa_brilho_spray_aneis*` (as três que o jogo alterna), só na cópia de trabalho do jogo.
  Gravado no chute forte defendido.
- **Rodada 12, ajustes (o dono: "miolo muito fino; a referência é uma coisa só; posição ruim"; "menos redondo";
  "muito vertical, tem que ficar levemente 3/4"):** a meia-lua ganhou uma faixa grossa cinza-clara (anel largo com
  máscara) rasgada em fibras por uma distorção esticada (displace tear, aspect 0,14, só na faixa), borda de fora lisa
  e mais brilhante, e uma massa densa de fibras curtas presas à frente; os pontinhos soltos saíram. A frente fica 35 px
  à frente do contato (na guarda de quem defende, não em cima da perna de quem bate). Curva aberta: raio 300 com 40°
  para cada lado (antes 175 com 70°). Exportada com Direção −20° no Sōkon (gira em volta do contato: a ponta de cima
  para trás). Só na cópia de trabalho do jogo, no lugar das três `defesa_brilho_spray_aneis*`.
- **Rodada 12, nova leitura (o dono: "por que meia-lua?"; "pensa que um buraco se faz e o anel faz a pressão de ar;
  não são riscos, é efeito de ar"):** `defesa_anel_ar*.json`: elipse em pé (3/4) em volta de um buraco vazio, feita de
  partículas macias de ar que andam para fora esticadas, frente mais cheia, beira de dentro mais clara, distorção
  leve em fiapos. No jogo (giro −15°, soma 40%) parece vapor subindo e cobre o rosto de quem defende: mostrado ao
  dono para decidir a direção antes de refinar. O teste do Arcadia passou a conferir que todo modelo do jogo desenha.
- **Rodada 12, releitura da referência (o dono: "eu te mandei a imagem do que é"):** `defesa_pressao*.json`: anel de ar
  grosso em 3/4, quase fechado, com o buraco escuro rasgado por dentro, faixa branca colada na borda, desfoque radial a
  partir do buraco (as fibras são a textura da massa) e rastros finos passando da borda. No fundo preto ficou perto da
  referência; no jogo a massa se perde (somando luz vira um risco claro; opaca vira uma mancha cinza sobre o rosto).
  Não aprovado; o jogo voltou à defesa de antes.
- **Rodada 12, posição (o dono: "é reto na defesa, não na posição do golpe"; "vai ajustando, está indo bem"):** no
  jogo (cópia de trabalho), `DEFESA_NA_GUARDA` em `GameView`: a defesa nasce na frente do desenho de quem defende, na
  altura dos braços (68% da altura em pé, 60% agachado), e não na ponta do golpe. Os modelos `defesa_pressao*` têm a
  borda na origem e o anel do lado de quem bate, massa mais branca; exportados com soma 15%. `testarMotor`: só as 3
  falhas antigas.
- **Rodada 13 (27/11; o dono: "manda para o Fable; vamos tentar agora fumaças de pulo", com silhuetas de exemplo):**
  a defesa nova foi para a `game-luta-sprite-fable`. `fumaca_pulo.json`: rajada de bolotas (blob) num anel que voa
  para fora e freia, achatada em elipse pela câmera (cam.comp 73°, o meio fica vazio), sombra azul-acinzentada e branco
  em faixas, espinhos rente ao chão e bolotas que sobem nas pontas (a câmera achata o que sobe: velocidades para cima
  ~3×). Posta no lugar do `super_pulo_v01` (pulo comum e super pulo), só na cópia de trabalho.
- **Defeito achado e corrigido:** folha com 256 cores ou menos (faixas chapadas) o WebP grava em modo paleta, e o leitor
  de WebP do jogo no PC (TwelveMonkeys) a mostra como um retângulo branco. `jogoSemPaleta` no export (e no lote e no
  kit) varia até 2 tons nos pixels com cor quando a folha tem poucas cores. Visto na gravação antes e depois.
- **Rodada 13, super pulo coeso (o dono, objetivo: "faça até ficar uma fumaça coesa de super pulo"):**
  `fumaca_super_pulo.json`. A técnica que deu coesão: partículas macias (soft) que se fundem quando a pixelização corta
  a borda (metabolas), em três tons (sombra maior embaixo, meio, luz menor). Anel no chão achatado pela câmera, com o
  buraco; duas colunas que nascem na borda do anel, quase verticais (a compensação da câmera só na subida; o ângulo
  inclinado vira barra diagonal), com velocidades espalhadas (85%) para encher da base ao topo (sem isso o topo se
  solta), curvando para fora no alto; tudo desbota junto no fim. Exportada no `super_pulo_v01` (340 px), só na cópia de
  trabalho do jogo; gravado no super pulo.
- **Super pulo, dissipação:** ao sumir, o ponto mais fino (a frente do anel) partia a peça em duas. Uma base de
  partículas engrossa a frente, e anel, base e colunas desbotam juntos pela opacidade da camada: a fumaça some inteira.
  Conferido quadro a quadro no modelo (do estouro ao fim) e na gravação (peça única até sair da tela).
- **Super pulo, folha completa:** o export cortava em 85% da duração (a folha acabava com o U ainda cheio e no jogo ele
  sumiria de repente); exportada até 100%. Conferidos os 16 quadros da folha (o que o jogo toca): peça única do estouro ao
  U fino e esburacado do quadro 15; o 16 é vazio.
- **Super pulo refeito (o dono: "tá feio"; "só refaz"):** a massa única virou gosma em U. Nova: partícula = uma bolota
  desenhada (textura embutida no modelo: contorno de bolinhas, branco com sombra azul-acinzentada embaixo à direita);
  anel de bolotas no chão e duas colunas de bolotas que crescem no alto e curvam para fora, tamanhos variados. Para
  isso o Arcadia no Sōkon passou a restaurar texturas embutidas dos modelos (`sokon-modelos.js`) e o gerador espera
  as texturas antes de desenhar ou exportar (`arcadiaTexturas`). Só na cópia de trabalho do jogo.
- **Motor do Arcadia ganhou a "Bolota com sombra" (o dono: "faz"):** forma `puff` em `sprites.js`, em dois tons (sombra
  azulada e luz deslocada), com controles no editor (bolinhas, tom, frieza e lado da sombra, tamanho da sombra e da luz),
  4 variações, desenhada em 256 px e pintada multiplicando a cor da partícula (a sombra continua mais escura em qualquer
  cor). A fumaça do super pulo passou a usar essa forma, sem imagem importada; pode ser ajustada inteira no editor.
- **Super pulo no estilo da referência (o dono: "ainda não parece fumaça", com um GIF de poeira de super pulo e uma folha
  de fumaças de desenho):** a cara de fumaça vem da luz de cima em cada massa. Cada parte (rastro, cunhas, cabeças) é
  feita três vezes com a mesma semente, deslocada e cortada na borda: escura embaixo à direita, média, clara menor em
  cima à esquerda. Discos de borda dura formam os gomos (partícula macia fundida fica lisa). Cunhas afiadas = rastros
  (trail) que disparam do centro e freiam; anel achatado rasgado no chão; as cabeças sobem nas pontas. Duas cores:
  bege como a referência (`fumaca_super_pulo.json`) e branca com sombra azulada (`fumaca_super_pulo_branca.json`); no
  cenário dourado a bege some. Na cópia de trabalho do jogo está a branca.
- **Super pulo refinado (o dono: "vamos nos desprender da referência e seguir nosso caminho"):** branca, gomos de luz
  menores (34% em vez de 42%), colunas sobem mais (cabeças mais rápidas e mais leves) e se quebram em pedaços no fim,
  cunhas mais longas. O chão desceu 150 px no quadro para a subida caber; no export a origem Y vai para 406 (o
  `sokon.origemY` do modelo guarda isso). Na cópia de trabalho do jogo.
- **Anel do chão liso (o dono: "esse círculo que faz tremido, vamos fazer liso"):** saiu a distorção do anel e entrou um
  corte de borda só nele (fica uma linha branca limpa, sem o degradê da forma de anel). Na cópia de trabalho do jogo.
- **Pulo comum próprio (o dono: "pulo comum vamos ter que fazer um mais simples"; "tira o círculo da simples"):**
  `fumaca_pulo_comum.json`: a do super pulo menor e mais curta, cunhas e duas bolotas pequenas, sem o anel. No jogo,
  o pulo comum toca `fumaca_pulo_comum` (GameView) antes da fumaça do super pulo. Super pulo e pulo comum enviados para a
  `game-luta-sprite-fable`.
- **Fumaça do dash (o dono: "vamos fazer do dash agora"):** `fumaca_dash.json`, a do pulo com um lado só (massa chutada
  para trás dos pés, cunha apontando para o lutador, cabeça que sobe fofa e se quebra). Achado: no jogo o dash estava sem
  fumaça nenhuma, porque ela só saía pela poeira do motor de animação, desligado desde 21/11. Na cópia de trabalho do
  jogo, o `GameView` passou a tocar `fumaca_dash_v05` na largada do dash pelo estado do lutador (frente e para trás,
  espelhada pelo sentido do movimento); o motor, se ligado, não toca de novo. O teste do Arcadia confere cada modelo no
  instante da miniatura dele.
- **Dash refeito (o dono: "tá igual ao pulo, vamos fazer outra"; "pega das referências que mandei"; "mais fino na ponta"):**
  `fumaca_dash.json` novo, das referências de onda rasante e rastro de bolotas: línguas em rastro que disparam dos pés para
  trás (finas no pé, grossas atrás) e um rastro de bolotas que cresce para trás e se funde numa massa só; ponta fina nos pés.
  No jogo (cópia de trabalho) é o `fumaca_dash_v05`, tocado na largada do dash pelo estado do lutador.
- **Dash, tamanho e lado (o dono: "deixa a fumaça menor e tem que sair de trás quando vai para a frente e na frente quando
  dá backdash"):** no jogo (cópia de trabalho) a fumaça do dash toca a 70% e afastada 34 px dos pés, do lado de onde ele
  parte (`DASH_FUMACA_ESCALA`, `DASH_FUMACA_ATRAS`).
- **Ar batendo na parede (o dono: "pressão de ar batendo na parede"; "não vai usar a mesma pressão de ar"; "em formato de
  anel circular"; "tem que ser oval"):** `parede_ar.json`: anel de bolotas de ar que nasce no ponto da batida e se abre
  junto (uma rajada só, que freia), oco no meio, achatado em oval pela câmera e exportado girado 90° (em pé contra a
  parede). No jogo (cópia de trabalho): o motor grava a batida no lutador (`paredeQuadro`, `paredeX`, `paredeLado`) e o
  `GameView` toca `parede_ar` no aviso `WALL_BOUNCE`, no plano da parede atrás das costas, na altura do peito.
  Gravado no combo L, M, H do Ryūga encostado na parede.
- **Parede, mais fino e com spray (o dono: "tem que ser mais fino, do tamanho do corpo, e spray"):** anel de bolotas
  pequenas (mais juntas), spray de riscos e gotas que espirram do anel para fora; no jogo a 1,55× (oval da altura do
  corpo). Cópia de trabalho do jogo.
- **Parede vira splash (o dono: "faz depois de 2 frames a fumaça virar splash"):** as bolotas do anel vivem 0,1 s e
  na morte soltam 2 gotas compridas cada (sub-emissor do Arcadia, `emit: death`, `dir: inherit`), que espirram para fora
  e caem. Cópia de trabalho do jogo.
- **28/11 (o dono testou o APK: "dash e backdash não apareceu"; "o super pulo fumaça ficou muito grande"):** o dash não
  estava no APK (esperava a aprovação dele); foi para a `game-luta-sprite-fable` junto com o super pulo exportado a 320 px
  (era 480).
- **Poeiras (28/11; o dono: "estilo mais pontiagudo em ondas"; depois a lista de efeitos de um vídeo de referência,
  "18 19 20 vamos fazer e colocar"):** modelos `poeira_baixo.json` (espinhos em leque, golpe baixo), `poeira_queda.json`
  (nuvem bege com ondas pontudas, queda) e `fumaca_destrocos.json` (fumaça escura com pedras, queda pesada e quique).
  Correções: as línguas caíam abaixo do chão (menos gravidade) e a fumaça escura acabava cortada (vida menor).

- **Poeiras desfeitas (o dono: "Horrível"; "desfaz e faz um de cada vez"):** saíram `poeira_baixo.json` e
  `fumaca_destrocos.json`; fica só a da queda (nº 19), refeita no estilo de placas: poucas chapas retas e afiadas.
- **Poeira da queda no corpo caindo (o dono: "coloca em um corpo em queda e vê se faz sentido"):** do jeito que estava
  não fazia: saía para um lado só, na cabeça, pequena, abaixo do corpo e ainda aparecia quando ele levantava. A causa de
  estar abaixo: o export usava a origem no centro do quadro, e o chão do modelo fica 80 px abaixo (origem Y 336). Refeita
  como faixa baixa e larga, do comprimento do corpo deitado, com placas rentes ao chão para os dois lados, nuvem baixa
  para não esconder o corpo, 0,36 s. No jogo: 62 px de altura, uma vez só, na batida (sem a segunda depois do quique),
  30 px acima da linha do chão (o corpo deitado fica desenhado acima dela). Cópia de trabalho do jogo.
