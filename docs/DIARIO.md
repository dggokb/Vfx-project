# Diário do Sōkon FX

Uma entrada por rodada: o pedido, o que mudou, como foi conferido e o que falta. A mais nova
embaixo.

## 25/11 — O repositório vira o Sōkon FX

- **Pedido:** rever o projeto com uma direção melhor. O dono já tinha o Sōkon FX (HTML com canvas)
  e os hits do jogo já saem dele; a ideia é transformá-lo na ferramenta da
  [bíblia](biblia/BIBLIA_DE_VFX.md), sem refazer o que existe.
- **Feito:** o pipeline EffectCraft saiu da branch (guardado na tag `arquivo-effectcraft`); a
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
