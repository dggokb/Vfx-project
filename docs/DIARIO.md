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
- **Achados:** a ferramenta guarda estado entre trocas de tipo (perfis, aparência), então o teste
  abre uma página limpa por caso. Os controles do Ponto de luz (quantidade e largura dos feixes,
  foco) não entram no "Salvar tipo".
