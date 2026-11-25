# Pesquisa 3: técnicas de VFX estilizado (anime/toon) para o Sōkon FX

Objetivo: levantar o que os profissionais usam em VFX estilizado em tempo real e que dá para reproduzir num editor Canvas2D + WebGL2 que assa (bake) tudo em folha de sprites. O Sōkon FX já tem campo erodido por ruído e cortado em 5 faixas de cor. O que segue diz o que falta em volta desse motor para ele ficar "profissional".

Legenda: **[verificado]** = li na fonte primária. **[não verificado]** = vem de resumo, comentário de fórum, página de produto, ou é inferência minha.

---

## 1. Técnicas guiadas por textura

### 1.1 Erosão alfa (dissolve por limiar): a base de quase tudo

A ideia é animar um limiar sobre uma máscara em tons de cinza. A forma vai se "comendo" até sumir. [verificado, vfxdoc]

```
duro:   a = step(t, mask)                       // 0 ou 1, serrilha
macio:  a = smoothstep(t - f, t + f, mask)      // f = largura da pena
```

Pegadinha importante [verificado, vfxdoc]: com pena f > 0, um limiar que vai só de 0 a 1 não apaga tudo nem mostra tudo. O limiar precisa percorrer de `-f` a `1+f`. No Sōkon, a curva de "erosão" deve ser remapeada assim por dentro, para que 0% e 100% signifiquem de fato "cheio" e "vazio".

Variações usadas por profissionais (thread "Alpha/Opacity/Clip/Erode workflow" no realtimevfx) [verificado]:
- **Subtrair e multiplicar** (simonschreibt, Travis): `a = saturate(mask - t) * k`. Dá contorno duro. Com `ceil()` a borda fica quantizada e pode aparecer uma borda escura.
- **Linear Burn / Color Burn** (MikeH): o Color Burn divide pelo inverso do quanto foi subtraído. O branco continua branco e o degradê encurta, deixando a borda mais afiada à medida que a forma morre. **Borda quente:** o inverso do Linear Burn vai para a emissão, então a borda brilha e apaga conforme o alfa sobe.
- **Ruído equalizado** (MikeH): passar o ruído por "Equalize" (histograma plano) faz o limiar revelar a mesma quantidade de pixels por unidade de tempo. Sem isso, a textura já traz um ease-in-out embutido. A curva de tempo deve estar na timeline, não escondida na textura.

**Erosão direcional** [verificado, realtimevfx]: multiplique (ou some) um degradê à máscara antes do limiar. Assim a forma some a partir de um lado (da raiz para a ponta de um corte, do centro para fora numa explosão).
```
m' = mask * lerp(1, gradiente, peso)    // ou mask - gradiente*peso
```

**Erosão em degraus = aparência de desenho à mão** [verificado, thread Infernal Vel'Koz]: o mapa de erosão foi pintado com platôs de valor chapado, não com degradê suave. O resultado "pula" de estágio em estágio, como quadros de animação 2D. Para o Sōkon: além de quantizar a cor (o que já faz), quantize **o próprio campo de erosão** (`mask = floor(mask*N)/N`, ou permita pintar platôs com o pincel). Então cada degrau de limiar some com uma "mancha" inteira de uma vez.

**Cor e alfa em tempos diferentes** [verificado, Travis no thread Vel'Koz]: use um segundo smoothstep para a emissão/cor, com limiar adiantado em relação ao alfa. A cor "esfria" antes de a forma sumir.
```
alpha = smoothstep(tA - f, tA + f, m)
quente = smoothstep(tC - f, tC + f, m)    // tC > tA: o núcleo esfria primeiro
cor = gradientMap(quente)
```

**Borda de duas cores (burn edge)** [verificado em shaders de exemplo: gamedev.net, godotshaders]: a faixa entre dois limiares próximos vira a borda.
```
corpo = step(t, m)
faixa = step(t, m) - step(t + w, m)        // w = largura da borda
faixa2 = step(t, m) - step(t + w*0.5, m)   // borda interna mais fina
cor = mix(corBase, corBorda1, faixa); cor = mix(cor, corBorda2, faixa2)
```
O Effekseer tem isso pronto: "Alpha Cutoff" com "Edge", que recolore só a região de alfa baixo perto do corte e é descrito como útil "para expressões toon". [verificado, docs Effekseer]

**Erosão por dither** [verificado, vfxdoc]: um padrão Bayer em espaço de tela, com step, gera pseudo-transparência só com 0 e 1. É útil se o jogo usar paleta fechada ou pixel art.

### 1.2 Gradient map (rampa de cor) e empacotamento de canais

- O padrão é a **textura em cinza mais a cor por rampa/LUT**. Stefan Jevremović (Nordeus) usa o **R** como base mapeado numa rampa de 1 a 4 cores convertida em LUT, o **G** como emissão e o **B** como alfa. Assim duas "cores" se animam separadas numa textura só. [verificado, 80.lv "VFX Staples"]
- O núcleo fica claro e quente, as bordas escuras e saturadas (fogo: amarelo no centro, vermelho na borda). [verificado, thread Vel'Koz]
- Mitch McClellan empacota R = forma animada, G = círculo base, B = contorno, e compõe por lerps em camadas. [verificado]
- Para o Sōkon: o campo atual pode virar **3 canais independentes** (forma/alfa, calor/emissão, máscara de borda/contorno), cada um com curva própria. As 5 faixas viram um **gradient map editável** (paradas com posição e cor, e uma opção "duro/suave" por parada).

### 1.3 Ruído rolando (panning) e distorção UV

- Uma textura principal rola e outra rola em velocidade diferente e a distorce. Também se subtrai um ruído "dissolve" rolando da textura principal para ela se desfazer com o tempo. [verificado, 80.lv feixe de fogo anime]
- A distorção UV usa 2 canais (R = x, G = y) centrados em cinza médio (0,5 = sem distorção): `uv' = uv + (tex(dist, uv + vel*t).rg*2-1) * força`. [verificado, Effekseer e vfxdoc]
- Fogo simples [verificado, Kristian Dixon]: o rolamento entra **só na leitura do mapa de distorção**, não na textura do fogo. Um degradê vertical limita a força (base firme, ponta tremendo).
- "Dissolve por flowmap/ruído UV, em que a primeira textura distorce antes de revelar a segunda, para dar um movimento contínuo." [verificado, 80.lv estilo Zelda]

### 1.4 Flowmap pintado

- O vetor de fluxo é codificado em RG, com o cinza médio como neutro: `flow = tex*2-1`. [verificado, vfxdoc]
- Para não esticar infinitamente, usam-se **duas fases** defasadas em meio ciclo, misturadas por um peso em triângulo:
```
p0 = fract(t/T); p1 = fract(t/T + 0.5)
c = mix(tex(uv + flow*p0), tex(uv + flow*p1), abs(1 - 2*p0))
```
  O vfxdoc descreve a defasagem em texto. A fórmula de peso acima é o padrão da indústria, não está transcrita da fonte [não verificado na fonte].
- Ferramentas usadas: Flowmap Painter (Teck), ou o Liquify do Photoshop assado em flowmap (blog oficial Unreal 2014). [verificado]
- Para o Sōkon: um **pincel de fluxo** (arrastar = pintar direção) que guarda RG, aplicado ao campo de ruído. Isso dá fumaça e fogo "dirigidos" pelo artista em vez de ruído isotrópico genérico.

### 1.5 Coordenadas polares (efeitos radiais)

O nó do Unity Shader Graph faz o seguinte [verificado]:
```
d = uv - centro
r = 2 * escalaRadial * length(d)
θ = atan2(d.x, d.y) / 6.28 * escalaAngular
uvPolar = (r, θ)
```
Usos:
- **Anel de choque:** uma textura de faixa (espinhos/ruído) em `uvPolar`, rolando em r para expandir. A erosão é animada junto. Os anéis de poeira do "Kamehameha" usam uma textura espinhosa rolando em X sobre um cone e se desfazem no fim. [verificado, 80.lv Alisavakis]
- **Portal / carga:** ruído em polar rolando em θ e r dá giro e sucção para dentro, com gradient map e **color banding** por cima. [verificado, mesmo artigo]
- **Linhas de velocidade (speed lines) e raios do hit spark:** um ruído 1D em θ, esticado em r, mais um limiar.
- Cuidados [verificado, realtimevfx "pinched triangles" e "radial UV"]: aparecem costura em θ = 0/1 (a textura precisa ser tileável em X) e pinçamento no centro. Mascare o centro ou some um círculo.

### 1.6 Formas de "malha" num editor 2D

No 3D, cortes, cones e anéis são malhas com UV planificada e textura rolando por cima [verificado, "Soulercoasters" no realtimevfx e 80.lv]. No Sōkon dá para emular com **mapeamentos de UV analíticos**:
- **Arco de corte (slash):** `u = (θ - θ0)/(θ1 - θ0)` ao longo do arco, `v = (r - rIn)/(rOut - rIn)` na espessura. Um degradê em u (cabeça brilhante, cauda que some), mais ruído esticado em u, mais erosão direcional da cauda para a cabeça. No fórum da Unreal: multiplicar dois degradês e esticar o UV contra o movimento. [verificado]
- **Cone/anel em perspectiva falsa:** a elipse achatada de um anel polar com escala Y < 1 (anel de chão). Um "cone" é um anel com rIn que cresce mais devagar que rOut.
- **Camadas aninhadas:** três malhas encaixadas com materiais preto, azul vivo e laranja vivo dão profundidade e um movimento que parece complexo [verificado, Kamehameha]. No 2D isso é a mesma forma desenhada 3 vezes com escala e defasagem de tempo diferentes e cores diferentes. É um "modo eco" barato e muito eficaz.

### 1.7 Luz falsa em efeito chapado

- **Normal a partir da própria forma** [verificado, Mitch McClellan]: um brilho radial na forma, multiplicado pela máscara, invertido, vira altura, e a altura vira normal. Depois:
```
NdotL = dot(n.xy, dirLuz)
luz   = smoothstep(0, 0.05, NdotL)                // corte duro em 2 tons
rim   = smoothstep(r0, r0+0.01, (1 - n.z) * pow(max(NdotL,0), k))
cor   = mix(corSombra, corLuz, luz); cor = mix(cor, corRim, rim)
```
  No Sōkon: `altura = blur(campo)`, normal por diferenças finitas, direção de luz global da cena. Assim fumaça e explosões ganham "sombra de anime" de 2 tons, consistente com o personagem. O pôster da SIGGRAPH 2004 (McGuire) já fazia fumaça cartoon com sprites de 2 tons e normal map. [verificado no resumo da busca, não li o PDF inteiro]
- O Guilty Gear Xrd não tem tom intermediário no cel shading: "the surface is either lit, or not". O controle preciso de onde a sombra cai é o que vende o 2D. [verificado, slides do Motomura, GDC 2015]
- Vertex color com borda "afiável" (Charles Thomas, citado por Simon Trümpler) [verificado]: a mesma ideia de um **parâmetro de dureza por camada**, que vai de linear a degrau.

---

## 2. Anatomia de um hit spark / impacto

### 2.1 Camadas (ordem típica)

A explosão estilizada do "Frag Launcher" tem 18 camadas em 6 grupos [verificado, realtimevfx]:
1. **Onda de choque:** nasce primeiro e serve de "fundo de luz" para o flash.
2. **Fumaça:** marrom escura, atrás de tudo, entra quase junto e fica até o fim.
3. **Flash instantâneo:** curto, claro e concentrado, dura **2 a 3 frames**.
4. **Núcleo (burst core):** partículas rápidas com muito arrasto. **Devem sumir antes de parar.**
5. **Anel (burst ring):** sai do centro e se dissolve enquanto expande. Shader com máscara de borda suave, sem flipbook.
6. **Faíscas:** dois tipos, com rastro e esticadas por velocidade. **Morrem um pouco depois do anel.**

Os inícios das camadas diferem só **2 a 3 frames** entre si, e acertar isso levou muitas iterações. [verificado]

Mais regras de profissionais:
- **Pico de valor e saturação no primeiro quarto da vida**, depois uma dissipação/erosão suave. Nunca curva linear. [verificado, guia de estilo de VFX do LoL, via VFX Apprentice]
- **No pico, maior contraste e alta saturação. Na saída, baixo contraste e baixa opacidade.** [verificado, 80.lv Nordeus]
- **Três fases:** antecipação, clímax (o máximo de elementos) e dissipação curta. [verificado, VFX Apprentice e Nordeus]
- **Defesa ≠ dano:** um golpe bloqueado costuma ter efeito de "ondulação" suave, quase sempre azulado. O acerto é mais caótico. [não verificado: wiki do Smash e TV Tropes]
- **Impact frame:** inserir um quadro de contraste extremo (às vezes preto e branco, silhuetas) no instante do contato, como faz a Ufotable. [verificado, blog "Demon Slayer visual grammar"]
- **Brilho antes do corte:** cada golpe de espada é precedido por um brilho na lâmina e reforçado por uma forma de luz e faíscas. Golpes "de tecido" usam uma luz mais macia e borrada. [verificado, mesmo blog]
- **Reaproveitar:** as faíscas e os espinhos de impacto são o mesmo setup do muzzle flash com outra textura e outro ângulo de emissão. [verificado, 80.lv Zelda]
- Golpe (swing) em **no máximo ~6 frames**. O efeito de acerto deve ser "uma explosão" rápida. Congelar atacante e defensor alguns frames (hitstop). [verificado, blog Aztez]

### 2.2 Receita de tempo sugerida (60 fps de jogo)

**Esta tabela é minha síntese, não vem de uma fonte.** Os números de "2 a 3 frames" e a ordem das camadas vêm do breakdown verificado; o resto é estimativa para calibrar no vídeo.

| Camada | Início (f) | Vida (f) | Escala na vida | Alfa / erosão |
|---|---|---|---|---|
| Flash (estrela/disco branco) | 0 | 2-3 | 0,6 → 1,2, ease-out forte | cheio e corta seco (sem fade) |
| Anel de choque (polar) | 0-1 | 8-12 | 0,3 → 1,6, ease-out (expo) | erosão de 0 a 1 a partir de ~40% da vida, borda 2 tons |
| Núcleo (forma pintada, 5 faixas) | 1 | 6-10 | 0,8 → 1,1 rápido, depois para | limiar de cor adiantado em relação ao alfa |
| Raios / speed lines (polar, θ com ruído) | 1 | 4-6 | comprimento cresce, largura cai | step duro, morre de dentro para fora |
| Faíscas (esticadas por velocidade) | 1-2 | 8-14 | comprimento ∝ velocidade, arrasto alto | somem um pouco depois do anel |
| Fumaça / poeira | 2-3 | 20-40 | cresce devagar, ease-out | erosão em degraus, luz falsa de 2 tons |

---

## 3. Como o procedural deixa de parecer "CG genérico"

1. **Formas desenhadas à mão por cima do ruído.** O guia do LoL manda evitar textura fotográfica e "ruído procedural barulhento", e misturar formas pintadas duras e macias. [verificado, VFX Apprentice] Para o Sōkon: uma **biblioteca de máscaras-forma** (gota, lâmina, estrela de 4 a 8 pontas assimétrica, meia-lua, respingo) que modula o campo: `campo = forma * (1 - k) + forma * ruído * k`. O ruído só "come" a borda, não define a silhueta.
2. **Controlar a frequência de detalhe.** Use 1 ou 2 oitavas de ruído grandes, não fBm fino. Para efeito estilizado, formas mais simples leem melhor, "sem ruído supérfluo". [verificado no resumo da busca sobre o GDC "Art Directing VFX for Stylized Games"; a palestra em si é paga e não vi]
3. **Faixa de valor.** Evite 0% e 100%. Pinte o corpo em valores médios e guarde o pico para o flash e o núcleo. **A borda da frente é a mais clara e de maior contraste** (claro colado em escuro puxa o olho para a frente). [verificado, guia do LoL]
4. **Cor:** uma dominante e um complemento dessaturado só em detalhes pequenos. [verificado, guia do LoL] **Teste em escala de cinza:** se não lê em cinza, não lê. [verificado, 80.lv feixe de fogo]
5. **Quebrar simetria e escolher seeds à mão.** O artista do estilo Zelda escolhe seeds manualmente para manter os elementos sincronizados. [verificado, 80.lv Zelda] Para o Sōkon: seed visível e travável por camada, botão "rolar seed" com histórico, e jitter angular e de escala nos raios.
6. **Animar em 2s/3s.** Ação em 12 fps (on twos), slow-motion em 1s, mas o **tremor de câmera em 24 fps** para suavizar. Ritmo: preparar (longo), golpe (curto, às vezes 1 quadro), relaxar (longo). [verificado, blog Demon Slayer] Um exportador com "hold" (cada desenho repetido 2 ou 3 frames) cria a sensação de animação 2D e ainda **corta pela metade o número de quadros da folha**. Variar 1s/2s/3s dentro do mesmo efeito dá textura. [verificado, Animation Mentor]
7. **Smear e esticamento.** Um smear no arco do golpe, e um segundo só em golpes carregados. [verificado no resumo, guia de pixel art 2026, fonte secundária] Faíscas e gotas esticadas por velocidade (`comprimento = base + k*|v|`, orientadas por v) são a versão de partícula. Aprenda o tempo pelo som: "se você ouve o som do efeito na cabeça, o tempo está funcionando". [verificado, 80.lv feixe de fogo]
8. **Encurtar.** Efeito que se arrasta polui e esconde silhuetas. A dissipação deve ser curta. [verificado, LoL e Nordeus]

---

## 4. O que faz as ferramentas parecerem "profissionais"

| Ferramenta | Recursos que importam | Fonte |
|---|---|---|
| **Pixel FX Designer** | paleta importada (até 256 cores), dithering customizado, pixelização ajustável, camadas de partícula (frente/trás), caminhos desenhados com easing, timeline, emissores copiáveis, glow/outline como pós, loop perfeito, export em folha/quadros/GIF com **auto-trim**, mais de 1.000 formas de partícula e projetos de exemplo | Steam e devlog [verificado] |
| **BlastFX** (concorrente) | rastros com curva de cor e de tamanho independentes, export em folha | itch.io [não verificado: só o resumo] |
| **EmberGen** | simulação na GPU **editada em tempo real** com a timeline em loop, mais de 100 projetos-preset e um marketplace de presets, flipbook montado com inspetor, export de cor final, **motion vectors, normal, 6-point lighting, profundidade**, EXR/PNG/TGA | site JangaFX [verificado] |
| **Houdini Labs Flipbook Textures** | passes separados (cor final, alfas separados, emissivo/não emissivo, normal, motion vector, profundidade), codificações de MV (R8G8, R16G16), **padding** entre tiles, linhas × colunas × resolução por quadro, start/end/**incremento** (pular quadros) | docs SideFX [verificado] |
| **Effekseer** | F-Curves para posição, ângulo, escala e cor; textura de alfa com UV própria; **distorção UV**; **Alpha Cutoff com Edge** (borda toon); falloff; textura de blend; dados por partícula (custom data) dirigindo o dissolve; janela "gravar" que exporta **folha de sprites** com tamanho e colunas definidos | docs Effekseer [verificado]; export em folha [verificado só por uma página japonesa de produto] |
| **Spine** | deformação de malha reduz quadros desenhados; partículas só por ferramentas de terceiros (Fxpine, SpineFX) | fórum Esoteric e itch [não verificado na doc oficial] |
| **TVPaint / Krita / Toon Boom** (FX à mão) | quadro a quadro, onion skin, mesa de luz, exposição por quadro (1s/2s/3s) | [não verificado: não achei fonte primária específica de pipeline de FX nesta rodada] |

Padrões comuns (minha síntese):
1. **Prévia em tempo real com loop** e scrub na timeline.
2. **Curvas por parâmetro** (editor de curva com presets de easing e chaves que aceitam "degrau"). A doc do Effekseer avisa que a F-curve aproximada pode perder mudanças bruscas. Uma chave do tipo "constante/step" é necessária para animação em 2s. [verificado]
3. **Aleatoriedade com seed** reproduzível e travável.
4. **Biblioteca de presets** e projetos de exemplo como ponto de partida e como material de aprendizado.
5. **Export completo:** folha com padding, trim, número de colunas, incremento de quadro, e **mapas extras** (emissivo separado, normal, às vezes motion vector).
6. **Paleta fechada / dithering** opcional para casar com a arte do jogo.

---

## 5. Prioridades para o Sōkon FX (do maior ganho para o menor)

1. **Gradient map editável** substituindo as 5 faixas fixas: paradas livres, duro/suave por parada, e uma rampa de **borda** separada (borda de 2 tons via dois limiares).
2. **Dois limiares por camada:** alfa e calor/cor com curvas separadas, e remap interno `[-f, 1+f]` para que a curva de erosão vá de cheio a vazio de verdade.
3. **Erosão direcional e em degraus:** um degradê (linear/radial/ao longo do arco) somado à máscara, e uma quantização do campo de erosão (platôs) para o "pulo" de desenho à mão.
4. **Modo de UV polar e de arco** para anel, raios, portal e slash, com máscara de centro e ruído tileável em θ.
5. **Biblioteca de formas pintadas mais o pincel atual**: o ruído só come a borda da forma.
6. **Pincel de flowmap** (direção) e distorção UV com rolamento só no mapa de distorção.
7. **Luz falsa de 2 tons** a partir do campo (altura → normal → NdotL com smoothstep estreito, mais rim), com luz global da cena.
8. **Timeline estilo hit spark:** template de camadas (flash, anel, núcleo, raios, faíscas, fumaça) com offsets em frames e curvas de escala ease-out. Mais um preset "defesa" (ondulação azul) diferente de "dano".
9. **Exposição em 1s/2s/3s por camada** no export, e chaves "step" nas curvas.
10. **Seeds travadas e presets**; vista em **escala de cinza**; export com padding/trim e, opcionalmente, um canal emissivo separado.

---

## Fontes

- vfxdoc, Alpha Erosion: https://vfxdoc.readthedocs.io/en/latest/shaders/alpha-erosion/
- vfxdoc, Flowmaps: https://vfxdoc.readthedocs.io/en/latest/articles/flowmaps/
- realtimevfx, "What is your Alpha/Opacity Mask/Clip/Erode animation workflow like?": https://realtimevfx.com/t/what-is-your-alpha-opacity-mask-clip-erode-animation-workflow-like/7705
- realtimevfx, "About Fire from Infernal Velkoz": https://realtimevfx.com/t/about-fire-from-infernal-velkoz/13491
- realtimevfx, "Battlerite Erosion UE4": https://realtimevfx.com/t/battlerite-erosion-ue4/4706
- realtimevfx, Stylized Frag Launcher Explosion breakdown: https://realtimevfx.com/t/stylized-frag-launcher-explosion-overwatch-inspiration-breakdown-posted/1894?page=2
- realtimevfx, VFX Basics: Mesh Soulercoasters: https://realtimevfx.com/t/vfx-basics-mesh-soulercoasters/1987
- realtimevfx, Talk: How (not) to create Textures for VFX (GDC/ADDON 2022): https://realtimevfx.com/t/talk-how-not-to-create-textures-for-vfx-gdc-addon-2022/20043
- Simon Trümpler, Stylized VFX in RiME: https://simonschreibt.de/gat/stylized-vfx-in-rime/
- Simon Trümpler, How (not) to create textures for VFX: https://simonschreibt.de/gat/how-not-to-create-textures-for-vfx/
- Unreal Fest Europe 2018, Stylized VFX in RiME: https://www.unrealengine.com/events/unreal-fest-europe-2018/stylized-vfx-in-rime
- 80.lv, VFX Staples: Shape, Color and Motion (Stefan Jevremović): https://80.lv/articles/vfx-staples-shape-color-and-motion/
- 80.lv, Anime-inspired stylized fire beam (UE): https://80.lv/articles/using-unreal-engine-to-make-an-anime-inspired-stylized-fire-beam-vfx
- 80.lv, Crafting a Kamehameha-like VFX (Harry Alisavakis): https://80.lv/articles/crafting-a-kamehameha-like-vfx-001agt/
- 80.lv, Creating stylized combat VFX in the Zelda style: https://80.lv/articles/creating-stylized-combat-vfx-in-the-zelda-style/
- 80.lv, Stylized animated 2D effects tips (Dmitry Sarkisov): https://80.lv/articles/stylized-animated-2d-effects-tips-and-tricks
- VFX Apprentice, 10 League of Legends VFX design tips: https://www.vfxapprentice.com/blog/10-league-of-legends-vfx-design-tips
- VFX Apprentice, The soul of effects: timing: https://www.vfxapprentice.com/blog/the-soul-of-effects-what-is-timing-in-vfx
- Riot, Dev: League's VFX style guide: https://nexus.leagueoflegends.com/en-us/2017/10/dev-leagues-vfx-style-guide/ (o PDF original agora redireciona; usei o resumo da VFX Apprentice)
- GDC Vault, Art Directing VFX for Stylized Games (2017): https://gdcvault.com/play/1024715/Art-Directing-VFX-for-Stylized (pago, não assistido)
- Junya Motomura, GuiltyGearXrd's Art Style (GDC 2015), slides: https://www.ggxrd.com/Motomura_Junya_GuiltyGearXrd.pdf
- "Demon Slayer visual grammar": https://jbsiraudin.github.io/blog/demon-slayer-visual-grammar
- Aztez, Anatomy of a successful attack: https://aztez.com/blog/2014/01/06/anatomy-of-a-successful-attack/
- Mitch McClellan, 2D toon shading for VFX flipbooks: https://mitchmcclellan.com/2D-toon-shading-for-vfx-flipbooks/
- McGuire, Real-Time Cartoon Rendering of Smoke (SIGGRAPH 2004 poster): https://history.siggraph.org/wp-content/uploads/2023/01/2004-Poster-026-Mcguire_Real-Time-Cartoon-Rendering-of-Smoke.pdf
- Kristian Dixon, UV Distortion: https://kristian-dixon.github.io//2024/12/31/UV-Distortion.html
- Unreal blog, Photoshop-generated flow maps: https://www.unrealengine.com/blog/photoshop-generated-flow-maps
- gamedev.net shaderlab, Sprite dissolve effect: https://gamedev.net/shaderlab/14-sprite-dissolve-effect/
- godotshaders, 2D dissolve with burn edge: https://godotshaders.com/shader/2d-dissolve-with-burn-edge/
- Unity Shader Graph, Polar Coordinates node: https://docs.unity3d.com/Packages/com.unity.shadergraph@8.1/manual/Polar-Coordinates-Node.html
- Effekseer, Basic Render Settings (Advanced): https://effekseer.github.io/Help_Tool/en/ToolReference/rendererCommonAd.html
- Effekseer, Tutorial 13 (distorção): https://effekseer.github.io/Help_Tool/en/ToolTutorial/13.html
- Pixel FX Designer (Steam): https://store.steampowered.com/app/939360
- Pixel FX Designer devlog 1.1.7.0: https://codemanu.itch.io/particle-fx-designer/devlog/190180/pixel-fx-designer-v1170-released
- BlastFX: https://mnkytech.itch.io/blastfx [não verificado]
- EmberGen: https://jangafx.com/software/embergen
- SideFX Labs Flipbook Textures: https://www.sidefx.com/docs/houdini/nodes/out/labs--flipbook_textures-1.0.html
- Fxpine (partículas para Spine): https://binarybiscuit.itch.io/fxpine [não verificado]
- Animation Mentor (1s/2s/3s): https://www.animationmentor.com/?p=86525 [não verificado: só o resumo]
- Guia de pixel art com hitstop e smear (2026, fonte secundária): https://gamineai.com/blog/pixel-art-combat-fx-hitstop-smear-frames-impact-timing-2026 [não verificado]
- SSBWiki, Sparks (efeito de defesa vs dano): https://www.ssbwiki.com/Sparks [não verificado]
