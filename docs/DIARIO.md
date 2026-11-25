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
