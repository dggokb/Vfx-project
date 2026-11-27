# Arcadia Effector dentro do Sōkon FX

Cópia do editor de partículas **Arcaidia Effector**, de Anton Chuev, licença MIT (ver `LICENSE`).

- Origem: https://github.com/xaidan777/Arcadia-Effects
- Commit copiado: `ed2bd1b371ecdaae9274f207c77535c61610f0f8` (versão 1.02, 13/09/2026)
- Copiado: `index.html`, `css/`, `js/`, `docs/`, `skills/`, `CLAUDE.md` (renomeado `CLAUDE.original.md`, para não virar instrução de quem mexe no Sōkon). Ficaram de fora a biblioteca de exemplos
  (`library/`, com texturas pesadas), o servidor (`server.mjs`, `run.bat`) e as ferramentas de linha de comando.

O `sokonfx/build.mjs` junta esta pasta numa página só e a embute no `SokonFX.html`; o gerador
"Partículas" (`src/js/09zc-gerador-arcadia.js`) abre o editor por cima do Sōkon e desenha o efeito quadro a quadro.

As mudanças feitas aqui (tradução para o português, o hit do Sōkon na lista de modelos) estão listadas no fim deste arquivo.

## Mudanças em relação à origem

- `js/core/i18n-pt.js` (novo): tradução para o português do Brasil. `js/core/i18n.js` aceita o idioma `pt` e começa
  nele; `js/ui/app.js` mostra "Português" na escolha de idioma.
- `js/core/sokon-modelos.js` (novo): põe os modelos do jogo (`sokon/*.json`, o build os embute) no topo da lista de
  fábrica e liga `AFX.semServidor`.
- `js/ui/catalog.js`: com `AFX.semServidor`, o catálogo vai direto para o armazenamento do navegador, sem procurar o servidor.
- `sokon/hit_forte.json` (novo): o hit forte do Sōkon.
- `js/core/sprites.js`: forma nova **Bolota com sombra** (`puff`): bolota de fumaça de desenho em dois tons (sombra
  levemente azulada na forma inteira, luz por cima deslocada), 4 variações, controles de bolinhas, tom e lado da sombra,
  tamanho da sombra e da luz; desenhada em 256 px (`res`) e pintada multiplicando a cor (`tintMul`), para a sombra
  continuar mais escura que a luz em qualquer cor. Nomes em português em `i18n-pt.js`.
