# Como os jogos de luta fazem os efeitos de acerto (hit effects)

Pesquisa para o Sōkon (sprites anime pintados à mão, motor próprio em Java/Android, efeito como folha de sprites pré-renderizada, blend aditivo opcional, luz que tinge os lutadores). Data: 25/11/2026.

**Legenda de confiança**
- **[F]** fonte primária: desenvolvedor, palestra, site oficial, patch notes, ou wiki de frame data que mede o jogo (Dustloop).
- **[S]** fonte secundária: imprensa ou fórum de VFX.
- **[NV]** não verificado: observação de quem joga ou dedução minha, sem fonte que confirme. Vale confirmar quadro a quadro no vídeo antes de copiar.

**Aviso honesto:** quase nenhum estúdio japonês publicou como faz a faísca de acerto em si. As palestras conhecidas (GDC 2015 da Arc, CEDEC 2015, CEDEC 2024 da Capcom) tratam de personagem, shader, animação e física. Os números confiáveis que existem são de **tempo** (hitstop, slowdown, cor por mecânica), e é daí que sai a maior parte das regras práticas abaixo.

---

## 1. Arc System Works (Guilty Gear Xrd/Strive, DBFZ, Granblue Versus)

### O que se sabe de fonte primária
- **Xrd foi feito para "matar o 3D".** Na GDC 2015, Junya C. Motomura contou que os personagens têm cerca de 40 mil polígonos, sem normal map, com cel-shading controlado à mão pelos artistas. A luz é própria: o rosto fica sempre claro, mesmo que a luz do cenário dissesse o contrário. O tom de cor sai da textura e não de luz dinâmica. A animação usa só poses-chave, sem interpolação corrigida, imitando sprite e cel. [F, Game Watch sobre a GDC 2015]
- **Revelator** acrescentou luz de borda (rim light), luzes pontuais e luz ambiente por cenário nos personagens, além de decalques de dano. Cada cenário tem cores definidas uma a uma para cada personagem. [F, CGWORLD vol.215] → É o mesmo problema do Sōkon (luz tingindo o lutador), e a solução deles foi **ajustar à mão por cenário**, não deixar a luz decidir.
- **Ferramentas do time de efeitos do Strive:** 3ds Max, Photoshop, After Effects e CLIP STUDIO PAINT, com efeito em tempo real no Unreal. Palestra de Kazuya Ogawa, artista de efeitos de BlazBlue CS, Xrd e Strive. [F, CGWORLD Creators Camp 2021] → **Clip Studio no pipeline quer dizer que eles desenham quadros 2D à mão** e os aplicam em malhas e partículas.
- **Counter no Strive:** a palavra "Counter" ocupa a tela, e o art director Sakamura disse: "pensamos nisso não só do ponto de vista visual, mas também como mecânica de jogo". [F, entrevista Unreal Engine]
- **A Arc errou na legibilidade e admitiu publicamente.** Depois do beta, escreveu que "alguns trabalhos de câmera, como o efeito no counter hit, afetam o ritmo do jogo, os comandos e a visibilidade". Também que "personagens se misturam ao fundo e ficam difíceis de ver", e que o contador de hits antigo ficava "escondido pelos modelos dos personagens". Katano disse que estavam testando "efeitos e visuais considerados tabu em jogos de luta". [F, Developer's Backyard vol.1 e vol.5]

### Números do Guilty Gear Strive (Dustloop, medidos no jogo) [F]
| Nível do golpe | Hitstop | Hitstun em pé | Blockstun no chão |
|---|---|---|---|
| Lv0 | 11 | 12 | 9 |
| Lv1 | 12 | 14 | 11 |
| Lv2 | 13 | 16 | 13 |
| Lv3 | 14 | 19 | 16 |
| Lv4 | 15 | 21 | 18 |

Counter hit em 4 graus. Quanto maior o grau, "mais dramáticos o visual e o áudio, hitstop mais longo, slowdown mais longo, e no Large, zoom de câmera":
- **Very Small:** hitstop normal, sem slowdown.
- **Small:** hitstop normal, 11F de slowdown.
- **Mid:** hitstop fixo de **21F** e 25F de slowdown.
- **Large:** hitstop fixo de **31F** e 35F de slowdown, com zoom.

Outras sinalizações:
- **Instant Block:** o defensor **pisca branco** e aparece "JUST!".
- **Burst:** Gold tem 16F de hitstop, Blue tem 15F.
- **Roman Cancel tem uma cor por função:** vermelho (combo), azul (neutro, slowdown de 59F), roxo e amarelo (defensivo, causa Guard Crush). **A cor do círculo de choque é a informação.**
- **R.I.S.C. cheio:** um "!" amarelo piscando, e qualquer golpe vira Large Counter.

### O que a comunidade de VFX deduz (sem confirmação da Arc)
- No DBFZ, "muita animação 2D tradicional por poses-chave, só que em várias malhas 3D individuais" (bgolus, realtimevfx). [S]
- Num efeito do Strive analisado quadro a quadro, a conclusão foi: "são 100% flipbooks"; dá para imitar com dissolve map, "mas sem o mesmo controle". O único 3D seria um anel em volta do personagem. Outros veem flipbook aplicado sobre cone ou hemisfério com UV rolando. [S, realtimevfx]
- Efeito em taxa baixa, casando com o personagem em poses fixas. Há a observação de que personagem a cerca de 24 fps com efeito suave a 60 fps fica estranho. [S/NV]

**Resumo da Arc:** desenho 2D à mão (quadros em Clip/Photoshop), tocado em poucos quadros e segurado (limited animation). Às vezes vai num cone, anel ou plano 3D para ganhar perspectiva. O tempo vem das regras de hitstop e slowdown, e **cor e texto são mecânica**.

---

## 2. Jogos 2D desenhados à mão

- **Skullgirls (Lab Zero):**
  - A faísca é informação de sistema. Zaimont: "se eu fizer um infinito em você, você vê as faíscas mudarem e ouve o som mudar", e só então o defensor pode escapar. [F, Gamasutra 2011]
  - No Encore entraram "hit effects paletizados (fogo, eletricidade etc.)", e passar do limite de combo dispara **faísca verde** mais o Infinity Breaker. [F, patch notes de 07/02/2014, via busca]
  - Em patch posterior, efeitos que ajustam a paleta (fogo da Parasoul, eletricidade da Robo-Fortune) **deixaram de ser afetados pela luz do cenário**. [F, patch notes, via busca] → Direto para o Sōkon: **a luz que tinge o lutador não deve tingir o efeito.**
  - Animação: um soco precisa se ler em cerca de 6 quadros; "mesmo um quadro de antecipação" melhora a leitura; smear e overshoot de 1 quadro dão força. [F, GDC 2014, Mariel Cartwright]
- **Them's Fightin' Herds:** roda no Z-Engine do Skullgirls. Faísca no atacante e reação no oponente para ajudar a reconhecer o golpe. [S]
- **BlazBlue:** no counter hit, "o oponente pisca vermelho e o narrador diz Counter". Hitstun, tempo sem tech e hitstop (só do defensor) aumentam. Golpe de nível alto ganha bônus grande no counter. Há ainda o Fatal Counter. [F, Dustloop BBCSE] Golpe físico dá hitstop nos dois; projétil, em geral só no defensor. [F]
- **Street Fighter III 3rd Strike:**
  - Parry pisca o personagem de **azul**, e o Guard Parry (o "Red Parry") pisca **vermelho**. [S, vários guias]
  - As faíscas têm tamanhos distintos por força e uma faísca própria de defesa. [NV: confirmar em sprite rip]
- **Street Fighter 6:**
  - Os efeitos de Drive descendem do Focus Attack do SF4, com "respingos de tinta coloridos" em volta do personagem. [S, PC Gamer e Red Bull]
  - A inspiração declarada pelo diretor Nakayama é hip-hop, urbano e grafite. [S]
  - Crítica comum: os efeitos são "planos, pictóricos e muito contrastados" perto do personagem realista. [S, opinião]
  - Na apresentação da Capcom sobre o editor de efeitos do RE Engine, o Hadouken é dividido em **carga → disparo → voo → impacto**, cada fase um efeito próprio com muitos emissores. O Shin Shoryuken é dividido em elementos e fases, como um "acerto no queixo diante da câmera" que segue a câmera. [F, Capcom R&D 2023]
  - A tinta exige **blend normal (alfa)**, porque cor escura e saturada não sai com aditivo. [NV, dedução técnica]
- **Fatal Fury: City of the Wolves:** mistura de quadrinho americano e anime, para os personagens "saltarem". O fundo pontilhado (retícula) foi "a forma mais simples de passar o ar de comic". Os efeitos mais carregados ficam reservados aos cinemáticos (Redline, Hidden Gear). O contorno forte ajuda a destacar o personagem. [F/S, PlayStation Blog, Creative Bloq, Siliconera]
- **KOF XIII:** sprites desenhados sobre modelos 3D de referência. [S] Não há fonte sobre as faíscas.
- **Melty Blood, Under Night, Pocket Bravery:** **nada publicado** sobre as faíscas. Pelo que se vê jogando, Under Night e Melty usam faíscas geométricas, com estilhaços e anéis duros, e flashes de tela curtos. [NV]

---

## 3. Taxonomia e legibilidade

### Princípios com fonte
1. **O efeito é regido pelo tempo, por isso a densidade importa.** [F, Sakurai, série "On Creating Games"]
2. **Estrutura em camadas, cada uma saindo numa hora** (Kevin Leroy, ex-Riot): um "quadro de acerto" muito curto, "meu tempo favorito é 0,1 s", que prende o olho; o brilho principal some primeiro; depois o flare; as faíscas um pouco depois; e os pontinhos ficam por último como cauda. Textura em preto e branco, com a cor dada no motor. [S, 80.lv]
3. **O efeito vai no máximo durante o hitstop**, porque é quando o golpe está no ápice. [S, memória de leitura de artigo da CGWORLD sobre Granblue Relink]
4. **Hitstop (Sakurai, 8 técnicas):**
   - Tremer mais quem apanha.
   - Não mover a hitbox.
   - Tremer na horizontal no chão e na vertical no ar.
   - Diminuir o tremor aos poucos.
   - Controlar a duração.
   - Interpolar até a pose de dano.
   - Deixar o atacante se mover um pouco.
   - Ajustar o tremor pela distância da câmera.
   [F, vídeo do Sakurai, resumo da Nintendo Wire]
5. **Counter não pode ser ambíguo:** o jogador tem que saber que foi counter. Os recursos usuais são cor própria, flash maior e texto. [F, GGST e BlazBlue; S para a regra geral]
6. **Defesa é mais suave que acerto:** um ripple ou anel, frequentemente azul ou branco, e menos caótico. [S/NV, convenção observada]
7. **Não cobrir o lutador:** o beta do Strive mostrou que efeito de câmera e efeito grande escondem posição e informação. [F]

### Tabela de tipos (convenção do gênero + recomendação para o Sōkon)
Os tempos e tamanhos são **recomendação minha** a 60 fps, calibrada pelos hitstops medidos do GGST. Não são medidas de um jogo específico.

| Tipo | Forma | Cor típica | Tamanho (relativo à altura do lutador) | Duração do efeito | Hitstop de referência |
|---|---|---|---|---|---|
| Fraco | estrela pequena, 3 a 5 pontas, poucas linhas | branco, núcleo amarelado | 15–25% | 6–9 F | 9–11 F |
| Médio | estrela + linhas de velocidade + anel fino | branco → laranja | 25–35% | 9–12 F | 12–13 F |
| Forte | estrela grande, anel grosso, estilhaços, poeira se for no chão | branco → laranja/vermelho | 35–55% | 12–18 F | 14–15 F |
| Especial | forte + cor do elemento do personagem | cor do elemento | 40–60% | 14–20 F | 14–16 F |
| Counter | o mesmo golpe + **cor de counter** (vermelho é o padrão Arc) + flash + texto | vermelho/amarelo | +20–30% | +4–8 F | GGST: 21 F (Mid) / 31 F (Large) |
| Defesa | anel/ripple ou escudo hexagonal, sem estilhaços | azul/branco | 60–80% do acerto equivalente | 6–10 F | menor que no acerto |
| Defesa perfeita / parry | flash no corpo do defensor | branco (GG IB), azul (SF3) | só silhueta | 4–8 F | — |
| Guard crush | anel quebrando, estilhaços de vidro | amarelo/laranja | grande | 15–25 F | longo |
| Super / Ultra | flash de tela + freeze + efeito próprio | do personagem | tela | — | super freeze |

### Regras de cor
- **Uma cor = um significado, em todo o jogo**:
  - vermelho = counter (Arc);
  - azul = defesa ou parry;
  - branco = defesa perfeita;
  - amarelo = guard crush ou perigo (o "!" do R.I.S.C.);
  - verde = sistema especial (Skullgirls, para o infinito).
  A cor do elemento (fogo, raio) fica só nos especiais daquele personagem.
- **Núcleo branco-quente, borda saturada.** Essa parte é aditiva. Contornos e "tinta" escuros vão em alfa normal. [NV, prática corrente]

---

## 4. Produção: quanto desenho, quanta variação

- **O gênero reaproveita muito.** A faísca de acerto é um conjunto comum para todo o elenco, de 3 a 5 tamanhos ou forças, mais defesa e counter. As variantes por elemento (fogo, raio) entram via **paleta**, como no Skullgirls Encore. O próprio padrão do MUGEN, que imita Capcom e SNK, separa faísca de acerto e de defesa por número de animação no `fightfx.air`, por exemplo `sparkno = 2` e `guard.sparkno = 40`. [S, fórum MUGEN] [NV: o número exato de faíscas por jogo comercial]
- **Variação barata:**
  - rotação aleatória (em 0–360° para estrela; com faixa de ±15–30° em volta do ângulo do golpe para faísca direcional);
  - espelhar;
  - escala de 0,9 a 1,1;
  - sortear entre 2 ou 3 desenhos;
  - deslocar 1 ou 2 quadros o início de cada camada.
  [NV, prática de VFX; a direção pelo ângulo do golpe aparece no fórum]
- **Quadros:** o efeito anime tocado "nos 2s ou 3s", ou seja cada desenho fica 2 ou 3 quadros a 60 fps, dá **4 a 8 desenhos únicos** por faísca e casa com o personagem em limited animation. [S/NV] A Arc anima o personagem só por poses-chave. [F]
- **Ritmo junto do hitstop:** no breakdown do combo "estilo Guilty Gear" do 80.lv, "todos os VFX foram remapeados no tempo para casar com os hitstops". O primeiro quadro, ou os dois primeiros, aparecem **dentro do congelamento**, e o resto se desenrola depois. [S]
- **Por fases e camadas:** o Hadouken do SF6 tem um efeito por fase. [F] A faísca boa tem de 3 a 5 camadas independentes:
  1. flash/núcleo, 1–3 F, aditivo;
  2. estrela ou forma principal, flipbook;
  3. linhas radiais ou de velocidade;
  4. anel de choque;
  5. estilhaços ou partículas, e poeira no chão.
- **Blend:**
  - **aditivo** para núcleo, brilho e faíscas, e isso exige fundo médio ou escuro, senão estoura;
  - **alfa normal** para tinta, contorno escuro, fumaça e poeira;
  - os jogos com estética de tinta (SF6) e os de contorno escuro (Strive) usam alfa por necessidade. [NV]
- **Luz:** a Arc ajusta a cor do personagem por cenário à mão. [F] O Skullgirls tirou os efeitos de paleta da influência da luz do cenário. [F]

---

## 5. Regras práticas para o Sōkon

1. **Um kit comum de faísca:** fraca, média, forte, defesa, counter e guard crush, com 4 a 8 desenhos cada, tocados nos 2s. As variações por elemento saem do mesmo desenho por paleta ou tinta, não de desenho novo.
2. **O 1º quadro (flash) entra no quadro do contato e fica congelado durante o hitstop**, ou avança devagar. O desenrolar vem depois do hitstop. Nunca terminar o efeito antes de acabar o hitstop.
3. **Hitstop de referência por força, inspirado no GGST:** 11 / 12 / 13 / 14 / 15 F. Counter médio vai para cerca de 21 F e counter grande para cerca de 31 F, com slowdown. Para celular, considerar uma escala menor, porque 31 F é meio segundo.
4. **Counter com cor fixa** (vermelho), flash no corpo e texto "COUNTER". Defesa em azul ou branco e mais fraca que o acerto. Defesa perfeita como flash branco na silhueta.
5. **Tamanho máximo da faísca forte em cerca de metade da altura do lutador.** O núcleo fica fora do rosto: deslocar para o ponto de contato e para fora do corpo de quem apanha.
6. **Efeitos imunes à luz que tinge o lutador**, como no patch do Skullgirls, para que a cor de counter ou defesa não mude conforme o cenário.
7. **Duas famílias de blend:** brilho aditivo por cima e tinta ou poeira em alfa por baixo. Testar sempre sobre o cenário mais claro.
8. **Variação na hora de tocar:** rotação, espelho, escala ±10% e sorteio entre 2 ou 3 desenhos, para o mesmo golpe repetido não ficar igual.
9. **Tremer:** quem apanha treme mais. No chão, tremor horizontal; no ar, vertical. Tela tremendo só no forte, no counter e no super, com o tremor decaindo.
10. **CPU:** o counter e a defesa visíveis valem igual para golpes da CPU. Se a CPU confirma combos no counter, a faísca precisa sair dos mesmos ganchos.

---

## Fontes

Primárias:
- GDC Vault, "GuiltyGearXrd's Art Style: The X Factor Between 2D and 3D" (Motomura, 2015): https://gdcvault.com/play/1022031/GuiltyGearXrd-s-Art-Style-The
- Game Watch, cobertura da palestra (40 mil polígonos, sem normal map, só poses-chave, luz do rosto): https://game.watch.impress.co.jp/docs/news/20150307_691725.html
- CGWORLD vol.215, Xrd REVELATOR (rim light, luz por cenário, decalques de dano): https://cgworld.jp/feature/201607-cgw215t2-guilty-2.html
- CGWORLD Creators Camp 2021, Kazuya Ogawa, fundos e efeitos do Strive (ferramentas): https://cgworld.jp/special/cgwcc2021/schedule/arc/index.html
- Guilty Gear Strive Developer's Backyard vol.1: https://arcsystemworks.jp/guiltygear/db/en/volume1.php
- Guilty Gear Strive Developer's Backyard vol.5: https://www.guiltygear.com/ggst/en/news/db5/
- Unreal Engine, entrevista sobre o Strive (citação do Sakamura sobre o Counter; página bloqueou leitura direta, citação via busca): https://www.unrealengine.com/en-US/developer-interviews/how-guilty-gear--strive--hits-an-ultra-combo-with-groundbreaking-visuals-and-gameplay
- Dustloop, mecânicas do GGST (hitstop por nível, graus de counter, IB, cores do RC): https://www.dustloop.com/w/GGST/Mechanics
- Dustloop, dano no GGST (slowdown): https://www.dustloop.com/w/GGST/Damage
- Dustloop, counter hit no BlazBlue CS: https://dustloop.com/w/Offense_(BBCSE)
- Gamasutra, entrevista com Zaimont (faíscas mudam no infinito): https://gamedeveloper.com/design/interview-an-upstart-fighting-game-developer-s-radical-re-think
- Patch notes do Skullgirls Encore (efeitos paletizados, faísca verde; via busca): https://skullgirls.com/?p=1054 e https://wiki.gbl.gg/w/Skullgirls/Patch_Notes
- GDC 2014, Mariel Cartwright, "Fluid and Powerful Animation within Frame Restrictions": https://gdcvault.com/play/1020575/Animation-Bootcamp-Fluid-and-Powerful (resumo: https://80.lv/articles/tips-on-making-fluid-and-powerful-animations)
- Capcom R&D, editor de efeitos do RE Engine (fases do Hadouken, Shin Shoryuken): https://www.docswell.com/s/CAPCOM_RandD/538NVE-RE2023
- 4Gamer, CEDEC 2024, física do SF6: https://4gamer.net/games/635/G063504/20240830070/
- Sakurai, vídeo sobre hitstop: https://www.youtube.com/watch?v=tycbMSjDDLg (resumo: https://nintendowire.com/news/2022/12/12/this-week-in-sakurai-12-5-12-11-fine-tuning-hit-stop-and-cheating-the-system/)
- PlayStation Blog, entrevista do Fatal Fury CotW: https://blog.playstation.com/2024/09/10/fatal-fury-city-of-the-wolves-interview-snk-director-discusses-the-series-new-direction/

Secundárias:
- realtimevfx, tópico do DBFZ: https://realtimevfx.com/t/dragonball-fighter-z/2522
- realtimevfx, engenharia reversa de um efeito do Strive: https://realtimevfx.com/t/please-help-me-reverse-engineer-this-effect-from-guilty-gear-strive/30609
- 80.lv, combo estilo Guilty Gear (VFX remapeados no hitstop): https://80.lv/articles/animating-guilty-gear-inspired-fighting-game-combo-in-maya
- 80.lv, Kevin Leroy (camadas do hit, 0,1 s): https://80.lv/articles/constructing-vfx-worthy-of-league-of-legends
- Zenn, memória de leitura da CGWORLD (efeito no máximo durante o hitstop, Granblue Relink): https://zenn.dev/nakaigames/articles/8096347013222d
- PC Gamer sobre a tinta do SF6: https://pcgamer.com/with-street-fighter-6-capcom-is-finally-challenging-the-competition
- Red Bull, SF6 contra SF5: https://www.redbull.com/ca-en/street-fighter-6-vs-street-fighter-5
- Creative Bloq, arte do Fatal Fury CotW: https://www.creativebloq.com/3d/video-game-design/how-fatal-fury-city-of-the-wolves-reimagines-its-anime-pixel-art-fighters-for-a-new-era
- StrategyWiki, parry do SF3: https://strategywiki.org/wiki/Street_Fighter_III:_3rd_Strike/Gameplay
- Fórum MUGEN, sparkno e guard.sparkno: https://mugenguild.com/forum/topics/make-every-character-use-hit-sparks-data-folder--180013.0.html

**Não consegui ler** (bloqueio ou fora do ar): o PDF da palestra do Motomura (ggxrd.com), a legenda do vídeo do New Frame Plus sobre GG/DBFZ, as páginas de dados do SF6 na SuperCombo, a coluna SF Seminar da Capcom e o TV Tropes "Hit Spark". **Os hitstops do SF6 não estão aqui por isso.** Um número de SFV que apareceu na busca (8/12/16 F) não foi confirmado.
