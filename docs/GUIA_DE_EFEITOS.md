# Guia de design de efeitos do Sōkon

Síntese das quatro pesquisas em `docs/pesquisa/efeitos/`:

| Arquivo | Assunto |
|---|---|
| `1_forma_anime.md` | Forma no anime |
| `2_jogos_de_luta.md` | Hits dos jogos de luta |
| `3_tecnicas_toon.md` | Técnicas de efeito estilizado |
| `4_ferramenta_profissional.md` | O que deixa uma ferramenta de efeitos profissional |

Quando um número aqui é recomendação nossa, e não medida publicada, isso vem dito. Quem julga é o dono, no vídeo.

## 1. Forma (o que mais erramos)

1. **Redesenhar a silhueta a cada desenho.** Um efeito de anime não é uma forma que cresce e some: o
   contorno muda de um desenho para o outro (Takashi Hashimoto). Uma forma só, escalada e apagada, é o
   erro nº 1, e foi o que fizemos até 25/11.
2. **Grande, médio, pequeno bem separados:** uma ou duas pontas dominantes, algumas médias, muitas
   pequenas. Como régua, comprimentos perto de 100%, 55% e 25%. Tamanhos parecidos (100/90/80) viram
   estrela genérica.
3. **Direção, não simetria:** o efeito abre em cone ou em V a favor do golpe, com a maior ponta no
   eixo da força. Do lado de quem bate, quase nada.
4. **Círculo e linha, depois quebrar:** um núcleo (disco ou anel), pontas retas e angulosas no estilo
   Kanada para impacto e energia, e lascas curvas com cabeça grossa e cauda fina. Cada ponta tem um lado
   mais reto e outro curvo, e termina afiada.
5. **Pouco ruído:** forma simples e reconhecível. Detalhe fino espalhado pelo efeito inteiro lê como
   "fibra" e como CG. O ruído só come a borda e só quando o efeito está se desfazendo.
6. **Silhueta:** pintada toda de uma cor só, ainda tem que dar para ler o golpe.

## 2. Tempo (60 quadros por segundo no jogo)

- **Anatomia:** clarão (1 a 2 desenhos), pico já no primeiro quarto da vida do efeito, 1 a 2 desenhos
  segurados piscando entre dois padrões, depois dissipação.
- **Exposição de anime:** cada desenho dura 2 a 4 quadros do jogo (de 2 em 2 ou de 3 em 3). O
  intervalo de 2 a 4 é recomendação nossa.
- **Com o hitstop:** o clarão entra no quadro do contato, o efeito fica no máximo durante a parada e o
  resto se desenrola depois. Régua do Guilty Gear Strive: hitstop de 11 a 15 quadros do nível 0 ao 4;
  counter médio 21 quadros, counter grande 31.
- **Sumir rasgando:** buracos crescem, lascas se soltam e encolhem. A transparência entra só no fim.

## 3. Cor

- **Faixas:** 3 a 4 faixas chapadas. Branco quase puro só no núcleo e só por 1 a 3 desenhos. A rampa
  é amarelo, laranja, vermelho e marrom escuro.
- **Contorno:** sem linha preta fina em volta. O escuro entra como massa (borda grossa vermelho-escura,
  quadro de impacto).
- **Brilho:** camada aditiva à parte (no jogo, `soma`).
- **Uma cor, um significado, no jogo inteiro:** acerto quente (branco, amarelo, laranja), defesa fria
  (azul e branco), counter com a cor própria dele (o vermelho é o padrão da Arc).
- **Elemento:** variante de elemento (fogo, raio, gelo) é troca de paleta do mesmo desenho, não um
  desenho novo.
- **A luz do cenário não tinge o efeito** (patch do Skullgirls). A luz do efeito tinge os lutadores,
  não o contrário.

## 4. Tamanho e legibilidade por golpe

Recomendação nossa, calibrada pelo Strive. Altura relativa à do lutador; o Sōkon tem cerca de 250 px
do mundo.

| Golpe | Forma | Tamanho | Vida do efeito |
|---|---|---|---|
| Fraco | 3 a 5 pontas, poucas linhas | 15–25% | 6–9 quadros |
| Médio | pontas + linhas + anel fino | 25–35% | 9–12 quadros |
| Forte | pontas grandes, anel grosso, lascas, poeira se for no chão | 35–55% | 12–18 quadros |
| Especial | forte + cor do elemento | 40–60% | 14–20 quadros |
| Counter | o mesmo golpe + cor de counter + clarão | +20–30% | +4–8 quadros |
| Defesa | anel ou escudo, sem lascas | 60–80% do acerto equivalente | 6–10 quadros |

- **Não cobrir o rosto:** o centro do efeito fica longe do rosto de quem apanha, e o forte não passa
  de cerca de metade da altura do lutador.
- **Camadas com tempos próprios:** anel (o fundo de luz), clarão, forma principal, linhas, lascas e
  partículas, poeira no chão. Os inícios diferem 2 a 3 quadros.
- **Tremor:** quem apanha treme mais que quem bate; na horizontal no chão, na vertical no ar; o
  tremor diminui aos poucos.

## 5. Como produzimos (a partir de 26/11)

1. **Forma:** desenhos-chave gerados pelo Codex (`codex exec`, imagem), isolados em fundo preto e
   pedidos com as regras 1 a 6. Para cada efeito, uma **sequência de 3 a 5 desenhos** (clarão,
   abertura, pico, quebra), feita a partir do primeiro para manter o desenho.
2. **Vida:** o Sōkon FX (Fazedor, forma Imagem) toca a sequência com exposição de anime, treme como
   desenho à mão, rasga no fim (a claridade é o mapa de erosão), troca a paleta e exporta.
3. **Reaproveitamento:** um bom conjunto de formas serve o elenco inteiro com giro, espelho, tamanho e
   paleta. Desenho novo só onde o golpe pede.

## 6. Para o Sōkon FX ficar profissional

Prioridade, da pesquisa de ferramentas:

1. Desfazer e refazer com histórico.
2. Projeto que nunca se perde: salvamento automático, versões, arquivo do projeto.
3. Biblioteca de presets com miniatura animada e categorias do jogo.
4. Semente explícita e grade de variações (6 a 12 de uma vez, clicar para adotar).
5. Prévia igual à folha: fps do jogo, loop, quadro a quadro, câmera lenta, troca de fundo.
6. Export previsível: resumo antes, nome automático, metadados.
7. Curvas com easing e degrau, exposição por camada.
8. Busca de controle e campos de arrastar.
9. Visual cinza neutro e uma cor de destaque.
10. No celular: alvos de 44–48 px, barra fixa (Play, Desfazer, Variações, Exportar).
