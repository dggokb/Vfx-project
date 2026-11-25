# Sōkon FX

Gerador de efeitos visuais 2D do **SŌKON: BLOODLINES**. Os efeitos saem de geradores com
parâmetros e semente (impacto, corte, projétil, fogo, água, gosma, fumaça, ponto de luz, pressão
de ar, defesa, choque, raio, linhas de mangá, aura, detritos, explosão, onda de choque,
faíscas, gelo, vento e vórtices, feixe de energia, teletransporte, portal, gases e vapores,
energia sombria), não de desenho quadro a quadro. É um **HTML único que funciona offline**, no PC e no
celular.

- **Usar:** abra [`sokonfx/dist/SokonFX.html`](sokonfx/dist/SokonFX.html) no navegador (ou o link do
  GitHub Pages, quando estiver ligado). Os tipos salvos ficam no navegador; use **Baixar todos os
  tipos** para guardar o JSON e importar em outro aparelho.
- **No celular sem internet:** pelo link do GitHub Pages, use "instalar" ou "adicionar à tela
  inicial"; o app passa a abrir offline (`sokonfx/site/`: manifesto, ícones e service worker).
- **Para o jogo:** abra **Exportar para o jogo**, dê o nome da pasta, marque a origem tocando na
  prévia, escolha tamanho, quadros, tempo, reforço de brilho, soma e luz, e baixe o `.zip`. Ele traz
  a pasta `<nome>/` com `folha.webp` e `efeito.json` no formato que o jogo lê
  (`assets/efeitos/<nome>/`, o `EfeitosVideo`), sem conversão. O `efeito.json` guarda também o tipo
  e as opções usadas (`sokonfx`), para refazer o efeito depois.
- **Ver na luta:** abra **Prévia no jogo**, carregue um print da luta, meça o lutador (toque na
  cabeça e nos pés) e marque o ponto do golpe. O efeito toca no tempo e no tamanho do motor do
  jogo, com a pausa de cada força, e dá para comparar lado a lado com um efeito que já está no
  jogo (o `.zip` ou a folha + `efeito.json`).
- **Vários efeitos num só:** em **Composição de camadas**, adicione o efeito da tela (ou um tipo
  salvo) como camada, mude a tela, adicione outra. Cada camada tem início, posição, tamanho, giro,
  opacidade e soma como luz; a prévia, a prévia no jogo e o export passam a usar a composição.
- **Editor:** **Vizinhos** (onion skin) na prévia; **Rampa de cor** nos geradores novos; **Baixar
  vários tipos salvos** num `.zip` só, em Exportar para o jogo.
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
| `sokonfx/src/js/09a-geradores.js` | registro dos geradores novos (um arquivo `09x-gerador-*.js` por gerador) |
| `sokonfx/src/assets/` | imagens embutidas no HTML (`ASSET("nome")` no código) |
| `sokonfx/dist/SokonFX.html` | o que se abre; gerado, nunca editado à mão |
| `sokonfx/tipos/` | tipos salvos do dono e os que estão no jogo |
| `sokonfx/testes/` | trava de pixels contra `testes/referencia/` |
| `docs/biblia/` | a bíblia de VFX (o roteiro da ferramenta) |
| `docs/pesquisa/` | pesquisa de técnica (Arc System Works, After Effects) |
| `docs/DIARIO.md` | o que foi feito e decidido, rodada a rodada |

## Trava de pixels

`npm test` confere que o `dist` está em dia, roda a trava de pixels, o teste do export (baixa o
`.zip` pela página, confere zip, `efeito.json` do jeito que o jogo lê e cada quadro da folha) e o
da prévia no jogo (tempo do motor, zips, toques, lado a lado) e o da composição (camadas iguais
ao tipo numa página limpa, a tela volta ao que era, salvar e abrir).

A trava desenha 129 casos (cada efeito, as variações dos controles, os tipos do dono e as
fumaças que estão no jogo), 16 quadros cada, e compara pixel a pixel com a referência aprovada
no mesmo navegador. Reorganizar código não pode mudar nenhum pixel. Quando um gerador muda **de
propósito** e o dono aprova, a referência é trocada pelo dist novo, com a razão no diário.

## Histórico

Até 25/11/2026 este repositório era um pipeline em volta do EffectCraft. Ele está guardado no histórico, no
commit `d9d100f` (`git checkout d9d100f`).

## Licença

Código MIT ([LICENSE](LICENSE)). As referências visuais de terceiros usadas para estudo **não** ficam
neste repositório (ele é público).
