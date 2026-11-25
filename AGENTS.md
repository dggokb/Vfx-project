# Regras para quem mexer no Sōkon FX

1. **Edite `sokonfx/src/`, nunca o `dist/`.** Depois: `npm run build` e `npm test`. Os dois têm de
   passar antes do commit.
2. **Nada já aprovado muda sem querer.** A trava de pixels compara cada caso com a referência.
   Mudança visual de um gerador existente só com pedido do dono; aí troque a referência e anote
   no `docs/DIARIO.md` o porquê.
3. **Tipos salvos continuam abrindo.** O formato `sokonfx-types-v1` é do dono: campo novo entra
   com valor padrão que reproduz o desenho antigo.
4. **Um HTML único, offline, no PC e no celular.** Sem servidor, sem CDN, sem dependência em
   tempo de execução. Controles têm de caber e funcionar no toque.
5. **Repositório público.** Não entram sprites do jogo, referências de outros jogos ou imagens de
   terceiros. O preview com lutador e cenário carrega os arquivos do aparelho do dono.
6. **Quem julga o visual é o dono**, no jogo. Um teste que passa só prova que nada mudou ou que o
   formato está certo; não prova que o efeito ficou bom.
7. **O jogo é o destino.** O export segue o leitor `EfeitosVideo` do jogo (`folha.webp` +
   `efeito.json`). As regras de arte do jogo (efeito é luz, sem contorno preto, cada personagem
   com o seu VFX) estão na skill `vfx-luta` do repositório do jogo e valem para os geradores.
8. Ao terminar uma rodada, uma entrada curta no `docs/DIARIO.md`: pedido, o que mudou, como foi
   conferido, o que falta.
