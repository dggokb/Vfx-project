# Sōkon FX

Gerador de efeitos visuais 2D do **SŌKON: BLOODLINES**. Os efeitos saem de geradores com
parâmetros e semente (impacto, corte, projétil, fogo, água, gosma, fumaça, ponto de luz, pressão
de ar), não de desenho quadro a quadro. É um **HTML único que funciona offline**, no PC e no
celular.

- **Usar:** abra [`sokonfx/dist/SokonFX.html`](sokonfx/dist/SokonFX.html) no navegador (ou o link do
  GitHub Pages, quando estiver ligado). Os tipos salvos ficam no navegador; use **Baixar todos os
  tipos** para guardar o JSON e importar em outro aparelho.
- **Para onde vai:** o jogo lê cada efeito de `assets/efeitos/<nome>/` (`folha.webp` +
  `efeito.json`), no repositório do jogo.
- **Para onde vai a ferramenta:** a [bíblia de VFX](docs/biblia/BIBLIA_DE_VFX.md) — 40 famílias de
  geradores, compositor de camadas e preview de gameplay.

## Mexer no código

```bash
npm install                 # só o Playwright, para os testes
npm run build               # src/ -> sokonfx/dist/SokonFX.html
npm test                    # dist em dia + trava de pixels
```

| Caminho | O que é |
|---|---|
| `sokonfx/src/pagina.html`, `estilo.css` | marcação e estilo |
| `sokonfx/src/js/*.js` | o código, juntado em ordem de nome num `<script>` só |
| `sokonfx/src/assets/` | imagens embutidas no HTML (`ASSET("nome")` no código) |
| `sokonfx/dist/SokonFX.html` | o que se abre; gerado, nunca editado à mão |
| `sokonfx/tipos/` | tipos salvos do dono e os que estão no jogo |
| `sokonfx/testes/` | trava de pixels contra `testes/referencia/` |
| `docs/biblia/` | a bíblia de VFX (o roteiro da ferramenta) |
| `docs/pesquisa/` | pesquisa de técnica (Arc System Works, After Effects) |
| `docs/DIARIO.md` | o que foi feito e decidido, rodada a rodada |

## Trava de pixels

`npm test` desenha 129 casos (cada efeito, as variações dos controles, os tipos do dono e as
fumaças que estão no jogo), 16 quadros cada, e compara pixel a pixel com a referência aprovada
no mesmo navegador. Reorganizar código não pode mudar nenhum pixel. Quando um gerador muda **de
propósito** e o dono aprova, a referência é trocada pelo dist novo, com a razão no diário.

## Histórico

Até 25/11/2026 este repositório era um pipeline em volta do EffectCraft. Ele está guardado na tag
`arquivo-effectcraft`.

## Licença

Código MIT ([LICENSE](LICENSE)). As referências visuais de terceiros usadas para estudo **não** ficam
neste repositório (ele é público).
