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
