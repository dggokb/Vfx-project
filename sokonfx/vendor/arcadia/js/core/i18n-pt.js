// Arcadia Effector — tradução para português do Brasil (Sōkon FX). Chave: o texto em inglês.
// PT_UI espelha o dicionário RU de i18n.js; PT_DICAS espelha TIPS (cada dica com 30 a 120 caracteres).
window.AFX_PT = {
 ui: {
    // barra do topo e painéis
    'Undo': 'Desfazer', 'Redo': 'Refazer', 'Save': 'Salvar',
    'Global Settings': 'Configurações gerais',
    'Effects Catalog': 'Catálogo de efeitos',
    'Textures': 'Texturas',
    'Inspector': 'Inspetor',
    'Settings': 'Configurações',
    'Language': 'Idioma',
    'Help': 'Ajuda',
    'Version': 'Versão',
    'Close': 'Fechar',
    'Author': 'Autor',
    'Anton Chuev': 'Anton Chuev',
    'Arcaidia Effector is an editor for authoring 2D effects for game projects. Its architecture is designed to be as efficient as possible for hybrid work with agentic LLM systems.':
        'O Arcaidia Effector é um editor para criar efeitos 2D para jogos. A arquitetura foi pensada para ser o mais eficiente possível no trabalho híbrido com sistemas de agentes LLM.',
    'It ships with orchestrators and skills that let an LLM not only author effects, but also change the functionality of the editor itself.':
        'Vem com orquestradores e skills que deixam um LLM não só criar efeitos, mas também mudar o funcionamento do próprio editor.',
    'Failed to open the effect from URL': 'Não foi possível abrir o efeito pelo link',

    // gerais
    'Preview': 'Prévia', 'Atlas': 'Folha', 'Fit': 'Encaixar',
    'Checker': 'Xadrez', 'Dark bg': 'Fundo escuro', 'Black bg': 'Fundo preto', 'Light bg': 'Fundo claro',
    'particles': 'partículas', 'atlas': 'folha', 'frames': 'quadros', 'cell': 'célula', 'footage fps': 'fps da animação',

    // reprodução da aba da folha e marcadores de quadro na régua
    'Playback': 'Reprodução', 'Frame': 'Quadro', 'Atlas end': 'Fim da folha',
    's': 's', 'f': 'q', 'deg': 'graus', 'px/s': 'px/s', 'color': 'cor',
    'Accept': 'Aceitar', 'Cancel': 'Cancelar',

    // configurações gerais
    'Composition': 'Composição', 'Width': 'Largura', 'Height': 'Altura',
    'Duration': 'Duração', 'Project FPS': 'FPS do projeto',
    'Camera': 'Câmera', 'Compression': 'Compressão',
    'Atlas Export': 'Exportar folha', 'Columns': 'Colunas', 'Rows': 'Linhas', 'Frames': 'Quadros',
    'Cell W': 'Célula W', 'Cell H': 'Célula H',
    'Mode': 'Modo',
    'Color, transparent bg': 'Cor, fundo transparente',
    'Color on black': 'Cor sobre preto',
    'Mask (white on black)': 'Máscara (branco sobre preto)',
    'Mask threshold': 'Limiar da máscara',
    'Supersample 2x': 'Suavização 2x',
    'Show atlas': 'Ver folha', 'Download PNG': 'Baixar PNG', 'Meta JSON': 'Meta JSON',
    'Export sequence': 'Exportar sequência',
    'Export PNG sequence': 'Exportar sequência PNG',
    'Export': 'Exportar',
    'Frame W': 'Quadro W', 'Frame H': 'Quadro H', 'FPS': 'FPS',
    'File name': 'Nome do arquivo',
    'one .zip archive': 'um arquivo .zip',
    'too many frames — lower the fps or shorten the range': 'quadros demais — baixe o fps ou encurte o intervalo',
    'Rendering frames': 'Desenhando os quadros',
    'Packing the archive': 'Empacotando o arquivo',
    'Sequence saved': 'Sequência salva',
    'Sequence export cancelled': 'Exportação da sequência cancelada',
    'Sequence export failed': 'Falha ao exportar a sequência',

    // catálogo
    'New': 'Novo', 'Import': 'Importar',
    'Mine': 'Meus', 'Factory': 'De fábrica', 'factory preset': 'predefinição de fábrica',
    'Unsaved': 'Não salvos', 'not saved': 'não salvo',
    'Remove from session': 'Tirar da sessão',
    'Discard unsaved effect': 'Descartar efeito não salvo',
    'Empty. The Save button adds the current effect.': 'Vazio. O botão Salvar adiciona o efeito atual.',
    'Open': 'Abrir',
    'Reset edits (to factory)': 'Desfazer edições (voltar ao de fábrica)',
    'Reset edits (to saved)': 'Desfazer edições (voltar ao salvo)',
    'Delete from catalog': 'Apagar do catálogo',
    'Delete effect': 'Apagar efeito',
    'Saved': 'Salvo', 'Saved to localStorage': 'Salvo no localStorage',
    'Server save error': 'Erro ao salvar no servidor',
    'Failed to read the effect.': 'Não foi possível ler o efeito.',
    'Not an Arcaidia Effector file.': 'Não é um arquivo do Arcaidia Effector.',
    'Failed to parse JSON.': 'Não foi possível ler o JSON.',
    'localStorage is full (likely textures). Use run.bat: the server stores effects as files.':
        'O localStorage está cheio (provavelmente pelas texturas). Use o run.bat: o servidor guarda os efeitos em arquivos.',
    'Session does not fit in localStorage: save your effects to the catalog.':
        'A sessão não cabe no localStorage: salve seus efeitos no catálogo.',

    // texturas
    'No textures. Import a PNG or drop a file into the window. Drag a texture from the list into the preview or onto the timeline to create a sprite layer.':
        'Sem texturas. Importe um PNG ou solte um arquivo na janela. Arraste uma textura da lista para a prévia ou para a linha do tempo para criar uma camada de sprite.',
    'Drag a row into the preview or onto the timeline to create a layer.': 'Arraste uma linha para a prévia ou para a linha do tempo para criar uma camada.',
    'footage': 'animação', 'no data': 'sem dados',
    'Grid': 'Grade',
    'cols': 'col.', 'rows': 'lin.',
    'Drop to import': 'Solte para importar',
    'Add sprite atlas': 'Adicionar folha de sprites', 'Atlas grid': 'Grade da folha',
    'Sheet': 'Folha', 'Import sheet...': 'Importar folha...',
    'Choose sheet...': 'Escolher folha...',
    'Sprite atlas': 'Folha de sprites',
    'Drop a sprite sheet here': 'Solte uma folha de sprites aqui',
    'Choose file...': 'Escolher arquivo...',
    'or take one from the project:': 'ou pegue uma do projeto:',
    'Load a PNG sheet or pick one from the project — the grid is guessed from the aspect ratio.':
        'Carregue uma folha PNG ou escolha uma do projeto — a grade é deduzida pela proporção.',
    'No sheet selected — pick a texture or import one.': 'Nenhuma folha escolhida — pegue uma textura ou importe uma.',
    'no grid on this texture — press Grid': 'esta textura não tem grade — aperte Grade',
    'stretched over the layer window': 'esticado na janela da camada', 'loops': 'em loop',
    'Frame size': 'Tamanho do quadro',
    'Square cells:': 'Células quadradas:',
    'the image is not evenly divisible by this grid': 'a imagem não se divide por igual nesta grade',

    // inspetor
    'Select a layer to edit its parameters.': 'Escolha uma camada para editar os parâmetros.',
    'Layer': 'Camada', 'Blend': 'Mistura',
    'Normal': 'Normal', 'Add (lighter)': 'Somar (add)', 'Screen': 'Tela (screen)', 'Multiply': 'Multiplicar',
    'Opacity': 'Opacidade',
    'Start (s)': 'Início (s)',
    'Emission end (s)': 'Fim da emissão (s)', 'End (s)': 'Fim (s)',
    'Emitter': 'Emissor', 'Shape': 'Forma',
    'Point': 'Ponto', 'Circle / Ellipse': 'Círculo / elipse', 'Box': 'Retângulo', 'Line': 'Linha',
    'Position X': 'Posição X', 'Position Y': 'Posição Y',
    'Size X': 'Tamanho X', 'Size Y': 'Tamanho Y',
    'Direction': 'Direção',
    'Outward': 'Para fora', 'Inward': 'Para dentro', 'Omni': 'Todas as direções', 'By angle': 'Por ângulo',
    'Angle': 'Ângulo', 'Angle spread': 'Abertura do ângulo',
    'Speed': 'Velocidade', 'Speed random': 'Variação da velocidade',
    'Rate (per sec)': 'Fluxo (por s)',
    'Seed': 'Semente',
    'Smooth emission': 'Emissão suave',
    'Particle': 'Partícula', 'Sprite': 'Sprite',
    'Life (s)': 'Vida (s)', 'Life random': 'Variação da vida',
    'Size': 'Tamanho', 'Size random': 'Variação do tamanho',
    'Size over life': 'Tamanho na vida',
    'Size over trail': 'Tamanho ao longo do rastro',
    'Opacity over life': 'Opacidade na vida',
    'Color over life': 'Cor na vida',
    'Tint texture': 'Tingir textura',
    'Footage FPS': 'FPS da animação',
    'Rotation & Shape': 'Rotação e forma',
    'Rotation': 'Rotação', 'Random rotation': 'Rotação aleatória',
    'Spin (deg/s)': 'Giro (graus/s)', 'Spin random': 'Variação do giro',
    'Align to velocity': 'Alinhar à velocidade',
    'Stretch': 'Esticar',
    'Physics': 'Física',
    'Gravity X': 'Gravidade X', 'Gravity Y': 'Gravidade Y',
    'Drag': 'Freio do ar', 'Turbulence': 'Turbulência', 'Turb. frequency': 'Frequência da turb.',
    'Turbulence type': 'Tipo de turbulência',
    'Noise (per particle)': 'Ruído (por partícula)',
    'Curl field (vortices)': 'Campo curl (redemoinhos)',
    'Vortex size': 'Tamanho do redemoinho',
    'Turb. octaves': 'Oitavas da turb.',
    'Field rise (px/s)': 'Subida do campo (px/s)',
    'Wind (px/s)': 'Vento (px/s)',
    'Field seed': 'Semente do campo',
    'Laminar base': 'Base laminar',
    // pós-efeito de distorção
    'Post effect': 'Pós-efeito', 'Effect': 'Efeito',
    'Turbulent displace': 'Distorção turbulenta',
    'Amount': 'Quantidade',
    'Displace amount': 'Força da distorção',
    'Field': 'Campo',
    'Swirl (no holes)': 'Redemoinho (sem buracos)', 'Tear (sharper rips)': 'Rasgo (cortes mais secos)',
    'Fold size': 'Tamanho da dobra',
    'Fold stretch': 'Alongamento da dobra',
    'Detail octaves': 'Oitavas de detalhe',
    'Evolution (Hz)': 'Evolução (Hz)',
    'Calm base': 'Base calma',
    'Calm amount': 'Força da calma',
    'Calm line Y': 'Linha da calma Y',
    'Calm falloff': 'Queda da calma',
    'Appearance': 'Aparência',
    'Sprite squash': 'Achatamento do sprite',
    'Glow': 'Brilho',
    'Glow size': 'Tamanho do brilho', 'Glow softness': 'Suavidade do brilho',
    'Radial fade': 'Esmaecer radial',
    'Fade X': 'Esmaecer: X', 'Fade Y': 'Esmaecer: Y', 'Fade radius': 'Esmaecer: raio',
    'Softness': 'Suavidade',
    'Gizmos': 'Controles',
    'Forces': 'Forças',
    'gravity': 'gravidade', 'curl': 'curl', 'wind': 'vento', 'path': 'caminho', 'peak': 'pico',
    'no field forces': 'sem forças de campo',
    'noise turbulence is per-particle': 'a turbulência de ruído é própria de cada partícula',
    'Layer glow': 'Brilho da camada',

    // pós-efeitos (camada Post FX)
    'Post FX': 'Pós-efeito',
    'Effect strength': 'Força do efeito',
    'Motion blur': 'Borrão de movimento',
    'Directional': 'Direcional',
    'Radial (zoom / spin)': 'Radial (zoom / giro)',
    'Length': 'Comprimento',
    'Spin': 'Giro',
    'Center X': 'Centro X', 'Center Y': 'Centro Y',
    'Blur length': 'Comprimento do borrão', 'Blur angle': 'Ângulo do borrão',
    'Quality': 'Qualidade',
    'Samples': 'Amostras',
    'Half resolution': 'Meia resolução',
    // pós-efeito pixel art
    'Pixel art': 'Pixel art',
    'Pixel grid': 'Grade de pixels',
    'Art resolution': 'Resolução da arte',
    'cells': 'células', 'per cell': 'por célula',
    'uneven blocks': 'blocos desiguais',
    'Square blocks': 'Blocos quadrados',
    'Pixel aspect': 'Proporção do pixel',
    'Grid offset X': 'Deslocamento da grade X', 'Grid offset Y': 'Deslocamento da grade Y',
    'Sampling': 'Amostragem', 'Sample': 'Amostra',
    'Average (area)': 'Média (área)', 'Point (nearest)': 'Ponto (mais próximo)',
    'Peak (keep detail)': 'Pico (guarda detalhe)',
    'Alpha gain': 'Ganho de alfa',
    'Alpha': 'Alfa', 'Cut (1-bit)': 'Corte (1 bit)', 'Steps': 'Degraus', 'Soft (keep)': 'Suave (como está)',
    'Alpha cutoff': 'Corte de alfa',
    'Alpha steps': 'Degraus de alfa',
    'Color quantize': 'Redução de cores',
    'Saturation': 'Saturação', 'Contrast': 'Contraste',
    'Quantize': 'Quantizar', 'None': 'Nenhum',
    'Levels (posterize)': 'Níveis (posterizar)', 'Palette': 'Paleta', 'Ramp by brightness': 'Rampa por luminosidade',
    'Levels per channel': 'Níveis por canal',
    'Mono (1-bit)': 'Mono (1 bit)', 'Game Boy (4)': 'Game Boy (4)', 'CGA (16)': 'CGA (16)',
    'PICO-8 (16)': 'PICO-8 (16)', 'Sweetie (16)': 'Sweetie (16)', 'NES (54)': 'NES (54)',
    'Ember ramp (12)': 'Brasa, rampa (12)', 'Ice ramp (12)': 'Gelo, rampa (12)',
    'Brightness ramp': 'Rampa de luminosidade', 'Ramp steps': 'Degraus da rampa',
    'Dither': 'Pontilhado', 'Dither amount': 'Força do pontilhado',
    'Outline': 'Contorno', 'Outline side': 'Lado do contorno', 'Outline color': 'Cor do contorno',
    'Outside silhouette': 'Fora da silhueta', 'Inside edge': 'Na borda de dentro',
    'Pixel art 1:1': 'Pixel art 1:1',
    'from the Pixel art layer': 'da camada de pixel art',
    'no Pixel art layer in the stack — falling back to Cell W/H':
        'não há camada de pixel art na pilha — usando Célula W/H',
    'Atlas exports 1:1 at': 'A folha sai 1:1 em',
    'Atlas uses the topmost pixel-art layer, not this one': 'A folha usa a camada de pixel art mais de cima, não esta',
    'Turn on Pixel art 1:1 in Atlas Export to ship this resolution':
        'Ligue Pixel art 1:1 em Exportar folha para sair nesta resolução',
    'Pixel Art (adjustment)': 'Pixel art (ajuste)',

    'Glow radius (px)': 'Raio do brilho (px)',
    'Render': 'Desenho', 'Trail (path line)': 'Rastro (linha do trajeto)',
    'Trail core': 'Núcleo do rastro',
    'Zigzag (deg/s)': 'Zigue-zague (graus/s)',
    'Branching': 'Ramificação',
    'Branch chance (per sec)': 'Chance de galho (por s)',
    'Branch spread': 'Abertura do galho',
    'Branch life scale': 'Vida do galho, fração',
    'Branch size scale': 'Tamanho do galho, fração',
    'Branch speed scale': 'Velocidade do galho, fração',
    'Max generations': 'Máx. de gerações',
    'Lightning': 'Raio',

    // subemissor
    'Sub-emitter': 'Subemissor',
    'Enable sub-emitter': 'Ligar subemissor',
    'Emit': 'Emissão',
    'At parent death': 'Na morte da mãe',
    'Along parent life': 'Durante a vida da mãe',
    'Both': 'Os dois',
    'Sub rate (per sec)': 'Fluxo sub (por s)',
    'Start at (life)': 'Começar em (fração da vida)',
    'Count at death': 'Quantidade na morte',
    'Sub direction': 'Direção sub',
    'Along parent velocity': 'Junto com a velocidade da mãe',
    'Opposite parent velocity': 'Contra a velocidade da mãe',
    'Away from emitter': 'Para longe do emissor',
    'Sub spread': 'Abertura sub',
    'Sub speed': 'Velocidade sub',
    'Sub speed random': 'Variação da velocidade sub',
    'Inherit velocity': 'Herdar velocidade',
    'Generation scale': 'Escala por geração',
    'Sub budget': 'Limite sub',
    'Draw under parents': 'Desenhar sob as mães',
    'Sub particle': 'Partícula sub',
    'Sub rotation & shape': 'Rotação e forma sub',
    'Sub physics': 'Física sub',
    'Sub appearance': 'Aparência sub',
    'Sub rate': 'Fluxo sub',
    'Sub particle size': 'Tamanho da partícula sub',
    'Sub gravity X': 'Gravidade sub X', 'Sub gravity Y': 'Gravidade sub Y',
    'Sub turbulence': 'Turbulência sub',
    'Firework (sub-emitter)': 'Fogos (subemissor)',

    'Source': 'Origem', 'Base size': 'Tamanho base',
    'Transform': 'Transformação', 'Scale': 'Escala', 'Aspect X/Y': 'Proporção X/Y',
    'Color & Look': 'Cor e aparência', 'Color': 'Cor',

    // widgets
    'Key at current time': 'Chave no tempo atual',
    'Curve preset...': 'Curva pronta...',
    'Gradient preset...': 'Degradê pronto...',
    'Shapes': 'Formas',
    'No textures yet. Import them in the Textures panel.': 'Ainda sem texturas. Importe no painel Texturas.',
    'Random': 'Aleatório', 'Variant': 'Variante',
    'Emission bursts: time (s) / count': 'Rajadas de emissão: tempo (s) / quantidade',
    'Burst': 'Rajada',
    'Value:': 'Valor:',

    // formas e parâmetros
    'Soft Circle': 'Círculo suave', 'Circle': 'Círculo', 'Ring': 'Anel', 'Square': 'Quadrado',
    'Polygon': 'Polígono', 'Star': 'Estrela', 'Streak': 'Traço', 'Spark': 'Faísca',
    'Smoke Puff': 'Nuvem de fumaça', 'Cartoon Puff': 'Nuvem de desenho', 'Shard': 'Estilhaço',
    'Flame Tongue': 'Língua de fogo', 'Ember': 'Brasa',
    'Thickness': 'Espessura', 'Sides': 'Lados', 'Points': 'Pontas', 'Inner radius': 'Raio interno',
    'Taper': 'Afinamento',
    'texture?': 'textura?',

    // curvas e degradês prontos
    'Constant 1': 'Constante 1', 'Fade Out': 'Sumir', 'Fade In': 'Surgir',
    'Flash Pulse': 'Pulso de clarão', 'Bell': 'Sino', 'Grow': 'Crescer', 'Fast Grow': 'Crescer rápido',
    'Shrink': 'Encolher', 'Pop & Decay': 'Estouro e queda',
    'Fire': 'Fogo', 'Plasma': 'Plasma', 'Smoke': 'Fumaça', 'Light Smoke': 'Fumaça clara',
    'Sparks': 'Faíscas', 'Ice': 'Gelo', 'Energy': 'Energia', 'Poison': 'Veneno', 'White': 'Branco', 'Gold': 'Ouro',

    // camadas prontas (menu)
    'Flash': 'Clarão', 'Shockwave': 'Onda de choque', 'Fireball': 'Bola de fogo',
    'Debris': 'Destroços', 'Particle Ring': 'Anel de partículas', 'Flame (stream)': 'Chama (jato)',
    'Snow / Ash': 'Neve / cinza',

    // linha do tempo
    'Presets': 'Prontos',
    'Layers': 'Camadas', 'Graph': 'Gráfico',
    'No layers. Add buttons are at the top of the timeline.': 'Sem camadas. Os botões de adicionar ficam no alto da linha do tempo.',

    // cola de atalhos da linha do tempo (tecla + ação)
    'Space': 'Espaço', 'Del': 'Del',
    'Shift+click': 'Shift+clique', 'Shift+drag': 'Shift+arrastar',
    'RMB key': 'Botão dir. na chave', 'Ctrl+wheel': 'Ctrl+roda',
    'MMB drag': 'Arrastar c/ botão do meio', 'MMB click': 'Clique do meio', 'Dbl-click': 'Clique duplo',
    'play': 'tocar', 'parameters': 'parâmetros', 'delete': 'apagar',
    'multi-select': 'seleção múltipla', 'easing': 'suavização', 'zoom': 'zoom',
    'pan': 'mover a vista', 'reset view': 'resetar a vista', 'no snap': 'sem ímã',
    'add / remove point': 'pôr / tirar ponto',
    'Rename': 'Renomear', 'Duplicate': 'Duplicar',
    'Move up': 'Subir', 'Move down': 'Descer', 'Delete': 'Apagar',
    'Linear': 'Linear', 'Easy Ease': 'Suave (Easy Ease)', 'Easy In': 'Entrada suave (Easy In)',
    'Easy Out': 'Saída suave (Easy Out)', 'Hold / Flat': 'Degrau (Hold / Flat)',
    'Delete key(s)': 'Apagar chave(s)',
    'Over particle life': 'Na vida da partícula',
    'No animated properties. Enable a stopwatch on a parameter.': 'Nenhuma propriedade animada. Ligue o cronômetro de um parâmetro.',
    'Select a layer.': 'Escolha uma camada.',
    'Select a property or a curve on the left.': 'Escolha uma propriedade ou curva à esquerda.',
    '(X axis — particle life 0..1, drag points, double-click to add/remove)':
        '(eixo X — vida da partícula 0..1, arraste os pontos, clique duplo põe/tira)',
    'Emitter X': 'Emissor X', 'Emitter Y': 'Emissor Y',
    'Spread': 'Abertura', 'Rate': 'Fluxo', 'Particle size': 'Tamanho da partícula',

    // caminho de movimento (motion path)
    'Motion Path': 'Caminho de movimento',
    'Enable path': 'Ligar caminho',
    'Path mode': 'Modo do caminho',
    'Emit along path': 'Emitir ao longo do caminho',
    'Guide particles': 'Guiar partículas',
    'Emit and guide': 'Emitir e guiar',
    'Smooth curve': 'Curva suave',
    'Closed path': 'Caminho fechado',
    'Nodes — offsets from the emitter position': 'Nós — deslocamentos a partir da posição do emissor',
    'Node': 'Nó',
    'Delete node': 'Apagar nó',
    'Spawn along': 'Distribuir nascimento',
    'Even': 'Uniforme',
    'At path start': 'No início do caminho',
    'Spawn jitter': 'Dispersão do nascimento',
    'Emit direction': 'Direção de saída',
    'Use emitter direction': 'Direção do emissor',
    'Along the path': 'Ao longo do caminho',
    'Across the path': 'Atravessando o caminho',
    'Attract': 'Atração',
    'Lock to path': 'Prender ao caminho',
    'Flow speed': 'Velocidade do fluxo',
    'Fast search': 'Busca rápida',
    'Path jitter': 'Dispersão do caminho', 'Path attract': 'Atração do caminho',
    'Path lock': 'Prender ao caminho', 'Path flow': 'Fluxo do caminho',
    'Path node': 'Nó do caminho',
    'Insert node here': 'Inserir nó aqui',
    'Animate node': 'Animar nó',
    'Remove node animation': 'Tirar animação do nó',
    'animated': 'animado',
    'Reverse direction': 'Inverter caminho',
    'Disable path': 'Desligar caminho',
    'Blade (path)': 'Lâmina (caminho)',
    'Path Flow (S-curve)': 'Fluxo no caminho (curva S)',

    // camadas de ajuste: quais camadas afetam (pós-efeito / campo de força)
    'Affected layers': 'Camadas afetadas',
    'All layers below': 'Todas as camadas abaixo',
    'Nothing below to affect': 'Nada abaixo para afetar',
    'Selected layers': 'Camadas escolhidas',
    'out of reach': 'fora de alcance',
    'Move the layer above the ones it should affect': 'Suba a camada acima das que ela deve afetar',
    'Affect all below': 'Afetar tudo abaixo',
    'Group blend': 'Mistura do grupo',

    // camada de CAMPO DE FORÇA (force)
    'Force': 'Campo de força',
    'Force field': 'Campo de força',
    'Master strength': 'Força geral',
    'No fields — the layer does nothing.': 'Sem campos — a camada não faz nada.',
    'Delete field': 'Apagar campo',
    'Enabled': 'Ligado',
    'Type': 'Tipo',
    'Collapse': 'Contrair', 'Expand': 'Expandir', 'Drive': 'Girar',
    'Collapse (pull in)': 'Contrair — puxa para o centro',
    'Expand (push out)': 'Expandir — empurra para fora',
    'Drive (orbit)': 'Girar — leva em círculo',
    'Strength': 'Força',
    'Falloff': 'Queda',
    'Scale X': 'Tamanho X', 'Scale Y': 'Tamanho Y',
    'px/s²': 'px/s²',
    'force fields': 'campos de força',
    'no active fields in this layer': 'nenhum campo ativo nesta camada',
    'select an emitter or a force field layer': 'escolha uma camada de emissor ou de campo de força',

    // avisos
    'Copied layers': 'Camadas copiadas',
    'Pasted layers': 'Camadas coladas',
    'Meta copied to clipboard': 'Meta copiada para a área de transferência'
 },
 dicas: {
    // barra do topo, configurações, ajuda
    'Undo the last change to the effect (Ctrl+Z)': 'Desfaz a última mudança no efeito (Ctrl+Z)',
    'Redo the change you just undid (Ctrl+Y or Ctrl+Shift+Z)':
        'Refaz a mudança que acabou de desfazer (Ctrl+Y ou Ctrl+Shift+Z)',
    'Save the effect to the catalog: a file in library/ with the server, otherwise localStorage (Ctrl+S)':
        'Salva o efeito no catálogo: arquivo em library/ com o servidor, senão no localStorage (Ctrl+S)',
    'The effect has unsaved changes — save it to the catalog (Ctrl+S)':
        'O efeito tem mudanças não salvas — salve no catálogo (Ctrl+S)',
    'Download the sprite atlas as a PNG built with the Atlas Export settings':
        'Baixa a folha de sprites em PNG, montada com as opções de Exportar folha',
    'Save the effect as a numbered PNG sequence (.zip)': 'Salva o efeito como sequência de PNGs numerados (.zip)',
    'Effect name — shown in the catalog and used for saved and exported file names':
        'Nome do efeito — aparece no catálogo e nos nomes dos arquivos salvos e exportados',
    'Editor settings: interface language (switching it reloads the page)':
        'Configurações do editor: idioma da interface (trocar recarrega a página)',
    'About Arcaidia Effector: version, author and contacts': 'Sobre o Arcaidia Effector: versão, autor e contatos',
    'Close the help window and return to the editor': 'Fecha a janela de ajuda e volta ao editor',
    'Interface language; the page reloads and unsaved edits stay in the session':
        'Idioma da interface; a página recarrega e as edições não salvas ficam na sessão',

    // catálogo
    'New empty effect (current edits stay in the session)': 'Novo efeito vazio (as edições atuais ficam na sessão)',
    'Open an effect from a .json file (you can also drop the file into the window)':
        'Abre um efeito de um arquivo .json (também dá para soltar o arquivo na janela)',
    'Download the current effect as a .json file with its textures embedded':
        'Baixa o efeito atual como arquivo .json, com as texturas embutidas',
    'Unsaved draft that lives only in the session: Save puts it into the catalog':
        'Rascunho não salvo, existe só na sessão: Salvar coloca no catálogo',
    'Discard this unsaved draft from the session — its edits are lost':
        'Descarta este rascunho não salvo da sessão — as edições se perdem',
    'Unsaved edits (kept in the session)': 'Há edições não salvas (guardadas na sessão)',
    'Factory preset: click to open a working copy, right-click to reset your edits':
        'Predefinição de fábrica: clique abre uma cópia de trabalho, botão direito desfaz suas edições',
    'Saved effect: click to open it, right-click to reset your edits or delete it':
        'Efeito salvo: clique abre, botão direito desfaz suas edições ou apaga o efeito',
    'Delete this saved effect from the catalog; with the server its file is removed too':
        'Apaga este efeito salvo do catálogo; com o servidor, o arquivo também é apagado',

    // configurações gerais: composição, câmera, exportar folha
    'Composition width in pixels — the canvas the effect is rendered on':
        'Largura da composição em pixels — a tela onde o efeito é desenhado',
    'Composition height in pixels; exports fit the composition into a frame keeping its aspect':
        'Altura da composição em pixels; ao exportar, ela cabe no quadro mantendo a proporção',
    'Length of the composition in seconds — the range of the timeline and playback':
        'Duração da composição em segundos — o trecho da linha do tempo e da reprodução',
    'Frame rate for key snapping, frame stepping and the default fps of the sequence export':
        'Taxa de quadros: ímã das chaves, passo por quadro e fps padrão da exportação de sequência',
    'Camera tilt to the effect plane. 0 — side view, 37 — game isometry (scaleY 0.8).':
        'Inclinação da câmera sobre o plano do efeito. 0 — vista de lado, 37 — isometria do jogo (scaleY 0.8).',
    'Vertical scale this camera compression gives to the effect plane':
        'Escala vertical que esta compressão da câmera dá ao plano do efeito',
    'Columns in the atlas grid; changing it resets Frames to columns × rows':
        'Colunas da grade da folha; ao mudar, Quadros volta a colunas × linhas',
    'Rows in the atlas grid; changing it resets Frames to columns × rows':
        'Linhas da grade da folha; ao mudar, Quadros volta a colunas × linhas',
    'How many frames to sample between Start and End, one per cell; at most columns × rows':
        'Quantos quadros tirar entre Início e Fim, um por célula; no máximo colunas × linhas',
    'Export 1:1 at the grid of the Pixel art layer: no supersampling, nearest filtering, no Cell W/H':
        'Exporta 1:1 na grade da camada de pixel art: sem supersample, filtro nearest, sem Célula W/H',
    'Width of one atlas cell in pixels; the composition is fitted inside keeping its aspect':
        'Largura de uma célula da folha em pixels; a composição cabe dentro mantendo a proporção',
    'Height of one atlas cell in pixels; the sheet is columns × Cell W by rows × Cell H':
        'Altura de uma célula da folha em pixels; a folha fica colunas × Célula W por linhas × Célula H',
    'First atlas frame boundary — the same blue marker on the timeline ruler':
        'Primeiro limite dos quadros da folha — o mesmo marcador azul na régua da linha do tempo',
    'Last atlas frame boundary — the hollow marker on the ruler; -1 — the end of the composition':
        'Último limite dos quadros da folha — o marcador vazado na régua; -1 — fim da composição',
    'Atlas pixels: color with alpha, color on a black background, or a white-on-black alpha mask':
        'Pixels da folha: cor com alfa, cor sobre fundo preto ou máscara de alfa branca sobre preto',
    '0 — soft mask, higher — hard binarization': '0 — máscara suave; mais alto — corte seco em preto e branco',
    'Render at double size and scale down — smoother edges, slower export':
        'Desenha em tamanho dobrado e reduz — bordas mais lisas, exportação mais lenta',
    'Open the Atlas tab: the assembled sheet and its frame playback on the side':
        'Abre a aba Folha: a folha montada e a reprodução dos quadros ao lado',
    'Copy the atlas description (grid, cell size, frames, fps) to the clipboard as JSON':
        'Copia a descrição da folha (grade, célula, quadros, fps) como JSON para a área de transferência',

    // janela de exportar sequência PNG
    'Width of every exported PNG frame; the composition is fitted inside':
        'Largura de cada quadro PNG exportado; a composição cabe dentro',
    'Height of every exported PNG frame; the composition is fitted inside':
        'Altura de cada quadro PNG exportado; a composição cabe dentro',
    'Frames per second of the sequence: frame count = (End − Start) × FPS':
        'Quadros por segundo da sequência: nº de quadros = (Fim − Início) × FPS',
    'The moment the sequence starts from, in seconds': 'Momento em que a sequência começa, em segundos',
    'The moment the sequence ends at, in seconds (up to the composition length)':
        'Momento em que a sequência termina, em segundos (até a duração da composição)',
    'Frame pixels: color with alpha, color on black, or a white-on-black alpha mask':
        'Pixels dos quadros: cor com alfa, cor sobre preto ou máscara de alfa branca sobre preto',
    'Frame = the Pixel art layer grid, nearest interpolation': 'Quadro = grade da camada de pixel art, interpolação nearest',
    'Name of the archive and the prefix of every frame file inside it':
        'Nome do arquivo .zip e prefixo de cada arquivo de quadro dentro dele',
    'Render every frame and download them as one .zip archive with meta.json':
        'Desenha todos os quadros e baixa num único arquivo .zip com meta.json',
    'Close the dialog; during an export this stops the rendering':
        'Fecha a janela; durante a exportação, para o desenho dos quadros',

    // texturas, janelas da folha e da grade
    'Import images (or drop files into the window)': 'Importa imagens (ou solte os arquivos na janela)',
    'Add a sprite atlas: the grid is guessed from the aspect ratio and confirmed in a dialog':
        'Adiciona uma folha de sprites: a grade é deduzida pela proporção e confirmada numa janela',
    'Drag into the preview or onto the timeline to create a layer with this texture':
        'Arraste para a prévia ou para a linha do tempo para criar uma camada com esta textura',
    'Footage atlas: set the grid and fps of this sheet; click again to clear the mark':
        'Folha animada: define a grade e o fps desta folha; clicar de novo tira a marca',
    'Remove the texture from the effect; layers that use it will draw nothing':
        'Tira a textura do efeito; as camadas que a usam ficam sem desenho',
    'Columns of frames in the footage grid; drag or double-click to type':
        'Colunas de quadros na grade da animação; arraste ou dê clique duplo para digitar',
    'Rows of frames in the footage grid; drag or double-click to type':
        'Linhas de quadros na grade da animação; arraste ou dê clique duplo para digitar',
    'Native frame rate of the sheet: a new atlas layer lasts frames ÷ fps seconds':
        'Taxa de quadros original da folha: uma nova camada de folha dura quadros ÷ fps segundos',
    'A grid of square cells that divides the sheet without a remainder':
        'Uma grade de células quadradas que divide a folha sem sobra',
    'How many columns of frames the sheet holds': 'Quantas colunas de quadros cabem na folha',
    'How many rows of frames the sheet holds': 'Quantas linhas de quadros cabem na folha',
    'Apply this grid: frames are cut from the sheet by columns and rows':
        'Aplica esta grade: os quadros são recortados da folha por colunas e linhas',
    'Close the dialog without changing anything': 'Fecha a janela sem mudar coisa alguma',
    'Pick a sprite sheet image on disk; you can also drop it onto this box':
        'Escolhe no disco a imagem da folha de sprites; também dá para soltar nesta caixa',
    'Use this project texture as the sheet and set its grid below':
        'Usa esta textura do projeto como folha e define a grade logo abaixo',
    'Use the chosen sheet with this grid': 'Usa a folha escolhida com esta grade',

    // inspetor: camada
    'How the layer mixes with the layers below: Add and Screen brighten, Multiply darkens':
        'Como a camada se mistura com as de baixo: Somar e Tela clareiam, Multiplicar escurece',
    'Layer opacity multiplier; animate it to fade the whole layer in or out':
        'Multiplicador de opacidade da camada; anime para a camada toda surgir ou sumir',
    'Mix of the processed frame with the clean one (0 — bypass)':
        'Mistura do quadro processado com o limpo (0 — desligado)',
    'Common multiplier for every field of this layer (0 — bypass). Animate it to fade the forces in':
        'Multiplicador comum de todos os campos da camada (0 — desligado). Anime para as forças entrarem aos poucos',
    'When the layer window opens, in seconds; moving it keeps the window length':
        'Quando a janela da camada abre, em segundos; mover mantém o tamanho da janela',
    'When the layer window closes, in seconds — the end of the bar on the timeline':
        'Quando a janela da camada fecha, em segundos — o fim da barra na linha do tempo',
    'Can be negative: the simulation starts before composition zero':
        'Pode ser negativo: a simulação começa antes do zero da composição',
    'When the emitter stops spawning; live particles still finish their life':
        'Quando o emissor para de soltar partículas; as vivas terminam a vida delas',
    'Post-process: blurred additive glow of the whole layer (best for trails)':
        'Pós-processo: brilho borrado e somado da camada toda (melhor para rastros)',
    'Blur radius of the layer glow in pixels — larger means a wider, softer halo':
        'Raio do borrão do brilho da camada em pixels — maior dá um halo mais largo e suave',
    'Fade the whole layer by distance from a movable center (drag the orange gizmo in the preview)':
        'Esmaece a camada toda pela distância de um centro móvel (arraste o controle laranja na prévia)',
    'Horizontal position of the fade center, px from the composition center':
        'Posição horizontal do centro do esmaecer, px a partir do centro da composição',
    'Vertical position of the fade center, px from the composition center':
        'Posição vertical do centro do esmaecer, px a partir do centro da composição',
    'Distance from the center at which the layer fades out completely':
        'Distância do centro em que a camada some por completo',
    'Soft edge as a fraction of the radius (0 — hard cut)': 'Borda suave como fração do raio (0 — corte seco)',

    // inspetor: emissor, rajadas, ramificação
    'Where particles are born: a point, inside an ellipse, on a ring, inside a box or along a line':
        'Onde as partículas nascem: num ponto, dentro de elipse, num anel, num retângulo ou numa linha',
    'Horizontal position, px from the composition center (positive is right)':
        'Posição horizontal, px a partir do centro da composição (positivo é à direita)',
    'Vertical position, px from the composition center (positive is down)':
        'Posição vertical, px a partir do centro da composição (positivo é para baixo)',
    'Shape radius or half-width; for a ring — its radius, for a line — half its length':
        'Raio ou meia largura da forma; no anel — o raio, na linha — metade do comprimento',
    'Shape half-height; for a ring — the thickness of its band': 'Meia altura da forma; no anel — a espessura da faixa',
    'Launch direction: away from the center, toward it, any way, or by Angle within the spread':
        'Direção de saída: para fora do centro, para dentro, qualquer uma ou pelo Ângulo dentro da abertura',
    'Launch angle for the By angle direction, also tilts the Line shape: 0 — right, 90 — down':
        'Ângulo de saída para Por ângulo; também inclina a forma Linha: 0 — direita, 90 — baixo',
    'Width of the random cone around the launch angle, in degrees (360 — full circle)':
        'Largura do cone aleatório em volta do ângulo de saída, em graus (360 — círculo inteiro)',
    'Launch speed of new particles in pixels per second': 'Velocidade de saída das novas partículas, em pixels por segundo',
    'Random speed spread per particle: 0.5 gives from 50% to 150% of Speed':
        'Variação aleatória da velocidade por partícula: 0.5 dá de 50% a 150% da Velocidade',
    'Particles born per second while the emission window is open':
        'Partículas que nascem por segundo enquanto a janela de emissão está aberta',
    'Spawn each particle at its exact moment inside a step — removes rows behind fast emitters':
        'Solta cada partícula no momento exato dentro do passo — tira as fileiras atrás de emissores rápidos',
    'Random seed: another value gives a new particle layout with the same settings':
        'Semente aleatória: outro valor dá nova distribuição de partículas com as mesmas opções',
    'One-shot bursts: at the given second the emitter releases that many particles at once':
        'Rajadas únicas: no segundo indicado, o emissor solta essa quantidade de partículas de uma vez',
    'Burst time in seconds from the layer start; drag or double-click to type':
        'Tempo da rajada em segundos desde o início da camada; arraste ou dê clique duplo para digitar',
    'How many particles this burst releases; drag or double-click to type':
        'Quantas partículas esta rajada solta; arraste ou dê clique duplo para digitar',
    'Remove this burst from the emitter': 'Remove esta rajada do emissor de partículas',
    'Add a burst of 10 particles 0.1 s after the last one': 'Adiciona uma rajada de 10 partículas 0.1 s depois da última',
    'Each particle may spawn a branch from its position': 'Cada partícula pode soltar um galho a partir da sua posição',
    'Largest angle between a branch and the direction of its parent, in degrees':
        'Maior ângulo entre um galho e a direção da partícula-mãe, em graus',
    'Branch lifetime as a fraction of the remaining life of its parent':
        'Vida do galho como fração da vida que resta à partícula-mãe',
    'Branch size as a fraction of the size of its parent': 'Tamanho do galho como fração do tamanho da partícula-mãe',
    'Branch speed as a fraction of the speed of its parent': 'Velocidade do galho como fração da velocidade da partícula-mãe',
    'How deep branches can branch further': 'Quantas vezes os galhos podem se ramificar de novo',

    // inspetor: caminho de movimento
    'Animated path: particles are born along it and/or follow it (drag the nodes in the preview)':
        'Caminho animável: as partículas nascem nele e/ou o seguem (arraste os nós na prévia)',
    'Emit — the emitter shape is replaced by the path; Guide — particles are pulled along it':
        'Emitir — o caminho substitui a forma do emissor; Guiar — o caminho puxa as partículas',
    'Catmull-Rom curve through the nodes (from 3 nodes) — off gives a straight polyline':
        'Curva Catmull-Rom pelos nós (a partir de 3 nós) — desligado dá uma linha reta quebrada',
    'Connect the last node back to the first one, closing the path into a loop':
        'Liga o último nó ao primeiro, fechando o caminho num laço',
    'Path nodes: offsets from the emitter position; X and Y of each can be animated':
        'Nós do caminho: deslocamentos a partir do emissor; X e Y de cada um podem ser animados',
    'Delete this node (a path always keeps at least two)': 'Apaga este nó (o caminho sempre fica com pelo menos dois)',
    'Node offset from the emitter position along X, px; you can also drag the node in the preview':
        'Deslocamento do nó a partir do emissor em X, px; também dá para arrastar o nó na prévia',
    'Node offset from the emitter position along Y, px; you can also drag the node in the preview':
        'Deslocamento do nó a partir do emissor em Y, px; também dá para arrastar o nó na prévia',
    'Add a node after the last one, continuing the direction of the path':
        'Adiciona um nó depois do último, seguindo a direção do caminho',
    'How births spread along the path: at random, evenly spaced, or all at its start':
        'Como os nascimentos se espalham no caminho: ao acaso, por igual ou todos no início',
    'Scatter of the birth point across the path': 'Dispersão do ponto de nascimento atravessando o caminho',
    'Where the path aims new particles; the emitter Direction is used when this is off':
        'Para onde o caminho aponta as novas partículas; desligado, vale a Direção do emissor',
    'Spring pulling particles to the nearest point of the path (damped by Drag)':
        'Mola que puxa as partículas ao ponto mais próximo do caminho (amortecida pelo Freio do ar)',
    'Hard follow: 1 — particles stick to the path and move only along it':
        'Seguir firme: 1 — as partículas grudam no caminho e só andam ao longo dele',
    'Speed along the path tangent (negative — backwards)': 'Velocidade ao longo da tangente do caminho (negativo — para trás)',
    'Look for the nearest path point near the last one: about 3x faster; turn off if the path crosses itself':
        'Busca o ponto mais próximo perto do anterior: uns 3x mais rápido; desligue se o caminho se cruza',

    // inspetor: partícula, rotação, física, aparência
    'Draw each particle as a sprite, or as a trail line along the path it has travelled':
        'Desenha cada partícula como sprite ou como linha de rastro pelo trajeto percorrido',
    'White core line on top of the trail (lightning)': 'Linha branca de núcleo por cima do rastro (raio)',
    'Particle image: a procedural shape or an imported texture — click to choose':
        'Imagem da partícula: forma procedural ou textura importada — clique para escolher',
    'How long each particle lives, in seconds': 'Quanto tempo cada partícula vive, em segundos',
    'Random lifetime spread per particle: 0.5 gives from 50% to 150% of Life':
        'Variação aleatória da vida por partícula: 0.5 dá de 50% a 150% da Vida',
    'Particle size at birth in pixels; the Size over life curve scales it':
        'Tamanho da partícula ao nascer, em pixels; a curva Tamanho na vida escala esse valor',
    'Random size spread per particle: 0.5 gives from 50% to 150% of Size':
        'Variação aleatória do tamanho por partícula: 0.5 dá de 50% a 150% do Tamanho',
    'Size multiplier over the particle life: the left edge is birth, the right edge is death':
        'Multiplicador do tamanho na vida da partícula: a borda esquerda é o nascimento, a direita é a morte',
    'Width along the trail: 0 — start (base), 1 — tip': 'Largura ao longo do rastro: 0 — começo (base), 1 — ponta',
    'Opacity over the particle life: the left edge is birth, the right edge is death':
        'Opacidade na vida da partícula: a borda esquerda é o nascimento, a direita é a morte',
    'Particle color over its life: the left end at birth, the right end at death':
        'Cor da partícula na vida: a ponta esquerda no nascimento, a direita na morte',
    'Color the texture by Color over life instead of its own colors (not for footage sheets)':
        'Pinta a textura com Cor na vida em vez das cores dela (não vale para folhas animadas)',
    'Frame rate of a footage texture per particle; 0 stretches all frames over its life':
        'Taxa de quadros da textura animada em cada partícula; 0 estica todos os quadros na vida dela',
    'Starting rotation of each particle, in degrees': 'Rotação inicial de cada partícula, em graus',
    'Random start rotation: 1 — any angle, 0.5 — within ±90° of Rotation':
        'Rotação inicial aleatória: 1 — qualquer ângulo, 0.5 — até ±90° da Rotação',
    'Rotation speed of each particle in degrees per second (negative spins the other way)':
        'Velocidade de giro de cada partícula em graus por segundo (negativo gira ao contrário)',
    'Random spin spread per particle: 1 gives from zero to double the Spin':
        'Variação aleatória do giro por partícula: 1 dá de zero ao dobro do Giro',
    'Turn each particle to face its direction of motion instead of using rotation and spin':
        'Vira cada partícula para a direção em que anda, em vez de usar rotação e giro',
    'Elongate particles along their velocity — faster ones stretch more (motion blur)':
        'Alonga as partículas na direção da velocidade — as rápidas esticam mais (borrão de movimento)',
    'Constant horizontal acceleration in px/s² (positive pulls right)':
        'Aceleração horizontal constante em px/s² (positivo puxa para a direita)',
    'Constant vertical acceleration in px/s² (positive pulls down)':
        'Aceleração vertical constante em px/s² (positivo puxa para baixo)',
    'Air resistance: how quickly particles lose speed (0 — none)':
        'Freio do ar: quão rápido as partículas perdem velocidade (0 — nenhum)',
    'Noise — own wiggle per particle; Curl — a swirling field shared by neighbours (flame tongues)':
        'Ruído — tremor próprio de cada partícula; Curl — campo de redemoinhos comum às vizinhas (línguas de fogo)',
    'Strength of the turbulent push in px/s² — how hard the particles are shaken':
        'Força do empurrão turbulento em px/s² — o quanto as partículas são sacudidas',
    'How fast the field boils in place': 'Quão rápido o campo ferve no lugar',
    'Eddy diameter in px — roughly the width of one flame tongue':
        'Diâmetro do redemoinho em px — mais ou menos a largura de uma língua de fogo',
    '1 — one big stream; 3 — big stream plus fine shredding':
        '1 — um jato grande; 3 — jato grande mais fiapos finos',
    'The field floats up with the plume. Best at 0.6-0.7 of the particle rise speed':
        'O campo sobe junto com a coluna. Melhor em 0.6-0.7 da velocidade de subida das partículas',
    'The field as a medium velocity: drag pulls the particle toward the flow instead of kicking it. Needs Drag > 0.':
        'O campo vira velocidade do meio: o arrasto puxa a partícula para o fluxo em vez de chutá-la. Pede Freio do ar > 0.',
    'Different value — a different field for the same design': 'Outro valor — outro campo para o mesmo desenho',
    'Ramps turbulence in over the particle life: 0 — full from birth, 1 — calm at the base, shredded at the tip':
        'Aumenta a turbulência na vida da partícula: 0 — total desde o nascimento, 1 — calma na base, rasgada na ponta',
    'Per-step random kinks of the velocity direction (lightning)':
        'Dobras aleatórias a cada passo na direção da velocidade (raio)',
    'How much camera compression flattens the particle sprite': 'Quanto a compressão da câmera achata o sprite da partícula',
    'Additive glow halo around each particle; above 1 adds extra passes (not for textures)':
        'Halo de brilho somado em volta de cada partícula; acima de 1 faz passadas extras (não para texturas)',
    'Size of the glow halo relative to the sprite size': 'Tamanho do halo de brilho em relação ao tamanho do sprite',
    'Blur radius as a fraction of sprite size': 'Raio do borrão como fração do tamanho do sprite',

    // inspetor: subemissor e camadas afetadas
    'Every particle of this layer emits its own particles with their own sprite, curves and physics':
        'Cada partícula desta camada solta as próprias partículas, com sprite, curvas e física próprios',
    'When children are born: all at once as the parent dies, steadily during its life, or both':
        'Quando as filhas nascem: todas de uma vez na morte da mãe, sem parar durante a vida dela, ou os dois',
    'Per PARENT particle — the total load scales with the number of parents':
        'Por partícula-MÃE — o peso total cresce com o número de mães',
    'Fraction of the parent life before children start spawning':
        'Fração da vida da mãe antes de as filhas começarem a nascer',
    'Burst emitted at the moment the parent dies': 'Rajada solta no momento em que a mãe morre',
    'Where children fly: any way, along the motion of the parent, against it, or away from the emitter':
        'Para onde as filhas voam: qualquer direção, junto com a mãe, contra ela ou para longe do emissor',
    'Width of the random cone around the sub direction, in degrees':
        'Largura do cone aleatório em volta da Direção sub, em graus',
    'Launch speed of child particles in pixels per second': 'Velocidade de saída das partículas-filhas em pixels por segundo',
    'Random speed spread per child: 0.5 gives from 50% to 150% of Sub speed':
        'Variação aleatória da velocidade por filha: 0.5 dá de 50% a 150% da Velocidade sub',
    'How much of the parent velocity is added to the child': 'Quanto da velocidade da mãe é somado à filha',
    'Above 1 children emit children too, reusing the same sub particle block':
        'Acima de 1, as filhas também soltam filhas, usando o mesmo bloco de Partícula sub',
    'Size / life / rate multiplier applied to each deeper generation':
        'Multiplicador de tamanho / vida / fluxo aplicado a cada geração seguinte',
    'Hard cap on live child particles — over it new children are dropped':
        'Teto fixo de partículas-filhas vivas — acima dele, as novas não nascem',
    'Draw the child particles beneath their parents instead of on top of them':
        'Desenha as partículas-filhas por baixo das mães, e não por cima',
    'Nothing checked — every matching layer below. Check layers to narrow it down':
        'Nada marcado — vale para todas as camadas compatíveis abaixo. Marque camadas para restringir',
    'Include this layer; with nothing checked, every matching layer below is affected':
        'Inclui esta camada; sem nada marcado, todas as camadas compatíveis abaixo são afetadas',
    'Clear the checks: the layer works on every matching layer below again':
        'Limpa as marcas: a camada volta a agir em todas as camadas compatíveis abaixo',
    'How the processed group composites back into the stack: the picked layers are isolated, so additive ones need Add':
        'Como o grupo processado volta à pilha: as camadas escolhidas ficam isoladas, então as de soma pedem Somar',

    // inspetor: campo de força
    'Add one more radial field to this layer (Collapse by default)':
        'Adiciona mais um campo radial a esta camada (Contrair por padrão)',
    'Turn this field on or off without deleting it': 'Liga ou desliga este campo sem apagá-lo',
    'Collapse pulls to the center, Expand pushes away, Drive swirls around; negative strength flips it':
        'Contrair puxa para o centro, Expandir empurra para fora, Girar roda em volta; força negativa inverte',
    'Acceleration at the center of the field. Negative reverses the direction':
        'Aceleração no centro do campo. Negativa inverte a direção',
    'How fast the force dies toward the edge: 0 — flat field with a hard rim, 1 — linear, 3+ — a narrow core':
        'Quão rápido a força cai até a borda: 0 — campo plano com borda seca, 1 — linear, 3+ — núcleo estreito',
    'Field center, px from the composition center; you can drag the field in the preview':
        'Centro do campo, px a partir do centro da composição; dá para arrastar o campo na prévia',
    'Half-width of the area of effect: outside the ellipse the force is exactly zero':
        'Meia largura da área de ação: fora da elipse a força é exatamente zero',
    'Half-height of the area of effect in px; on screen the camera compression flattens it':
        'Meia altura da área de ação em px; na tela, a compressão da câmera achata essa área',
    'Delete this field from the force layer': 'Apaga este campo da camada de força',

    // inspetor: pós-efeitos (borrão, distorção)
    'Which post effect processes the layers below: motion blur, turbulent displace or pixel art':
        'Qual pós-efeito processa as camadas abaixo: borrão de movimento, distorção turbulenta ou pixel art',
    'Directional — one smear angle for the whole frame; Radial — zoom and spin around a center':
        'Direcional — um só ângulo de borrão no quadro todo; Radial — zoom e giro em volta de um centro',
    'Zoom smear measured at the far corner of the frame (0 — off)':
        'Borrão de zoom medido no canto mais distante do quadro (0 — desligado)',
    'Total smear length in pixels along the blur angle (0 — off)':
        'Comprimento total do borrão em pixels na direção do ângulo (0 — desligado)',
    'Angular smear around the center': 'Borrão de giro em volta do centro',
    'Center of the radial blur, px from the composition center; drag it in the preview':
        'Centro do borrão radial, px a partir do centro da composição; arraste na prévia',
    'Direction of the smear in degrees: 0 — horizontal, 90 — vertical':
        'Direção do borrão em graus: 0 — horizontal, 90 — vertical',
    'Samples are gathered by doubling passes: 16 samples cost 4 full-frame passes. Raise it if the smear looks stepped':
        'Amostras vêm de passadas que dobram: 16 amostras = 4 passadas no quadro. Aumente se o borrão ficar em degraus',
    'Blur on a half-size buffer: 4x fewer pixels, slightly softer. Affects the exported atlas too':
        'Borrão em buffer de meio tamanho: 4x menos pixels, um pouco mais suave. Vale também para a folha exportada',
    'How far the frame is pushed. Layer opacity scales it — animate opacity to fade the distortion in':
        'Quanto o quadro é empurrado. A opacidade da camada escala isso — anime-a para a distorção entrar aos poucos',
    'Swirl keeps the area, so no black holes appear; Tear rips sharper but can punch voids in the mass':
        'Redemoinho mantém a área, sem buracos pretos; Rasgo corta mais seco, mas pode abrir vazios na massa',
    'Horizontal size of one fold — roughly the width of a flame tongue':
        'Tamanho horizontal de uma dobra — mais ou menos a largura de uma língua de fogo',
    'Vertical stretch of the folds. Fire wants 2-3: tall thin tongues, not round blobs':
        'Alongamento vertical das dobras. Fogo pede 2-3: línguas altas e finas, não bolhas redondas',
    '1 — one big wave; 3 — big wave plus fine shredding': '1 — uma onda grande; 3 — onda grande mais fiapos finos',
    'How fast the folds are reborn in place': 'Quão rápido as dobras renascem no lugar',
    'The field floats up so the folds lick with the plume instead of standing still like wavy glass':
        'O campo sobe e as dobras lambem junto com a coluna, em vez de ficarem paradas como vidro ondulado',
    'Damps the distortion below the line so the flame stays welded to the ground':
        'Amortece a distorção abaixo da linha para a chama ficar presa ao chão',
    'Height of the calm line, px from the composition center; below it the distortion is damped':
        'Altura da linha da calma, px a partir do centro da composição; abaixo dela a distorção é amortecida',
    'Distance below the line over which the damping reaches full strength':
        'Distância abaixo da linha até o amortecimento chegar à força total',

    // inspetor: pixel art
    'Pixel-art width in cells; the height follows the composition and pixel aspect. Atlas 1:1 exports it':
        'Largura do pixel art em células; a altura segue a composição e a proporção do pixel. A folha 1:1 sai nela',
    'Keep every block a whole number of composition pixels so the pixel staircase stays even':
        'Mantém cada bloco com número inteiro de pixels da composição para a escadinha ficar regular',
    'Height / width of one art pixel. 1 — square; 2 — tall pixels, a match for a compressed isometric camera':
        'Altura / largura de um pixel da arte. 1 — quadrado; 2 — pixels altos, para câmera isométrica achatada',
    'Shift the grid inside one cell to line the blocks up with the center of the effect':
        'Desloca a grade dentro de uma célula para alinhar os blocos com o centro do efeito',
    'How a block gets its color: Peak keeps bright sparks, Average is smooth, Point is the hardest':
        'Como o bloco pega a cor: Pico guarda faíscas claras, Média é suave, Ponto é o mais duro',
    'Multiplies alpha before the cutoff — raise it to turn thin faded strokes back into solid pixels':
        'Multiplica o alfa antes do corte — aumente para traços finos e fracos voltarem a ser pixels cheios',
    'Cut — 1-bit alpha like real pixel art; Steps — a few transparency levels; Soft — keep the gradient':
        'Corte — alfa de 1 bit como pixel art de verdade; Degraus — alguns níveis; Suave — mantém o degradê',
    'Coverage a block needs to become a pixel. Lower — fatter silhouette; animate it for a dissolve':
        'Cobertura que o bloco precisa para virar pixel. Mais baixo — silhueta mais gorda; anime para dissolver',
    'How many transparency levels a block can take': 'Quantos níveis de transparência um bloco pode ter',
    'Applied before quantizing: averaging a block washes the chroma out, this puts it back':
        'Aplicada antes de reduzir as cores: a média do bloco desbota a cor, e isto a devolve',
    'Contrast boost applied before quantizing; 1 leaves the colors unchanged':
        'Reforço de contraste antes de reduzir as cores; 1 deixa as cores como estão',
    'Reduce colors: Levels posterize the channels, Palette snaps to fixed colors, Ramp maps brightness':
        'Reduz cores: Níveis posterizam os canais, Paleta usa cores fixas, Rampa troca pela luminosidade',
    'How many brightness levels each color channel keeps': 'Quantos níveis de luminosidade cada canal de cor mantém',
    'Fixed palette: every pixel takes the nearest of its colors':
        'Paleta fixa: cada pixel pega a cor mais próxima dela',
    'Colors for brightness: dark pixels take the left end of the gradient, bright ones the right':
        'Cores por luminosidade: pixels escuros pegam a ponta esquerda do degradê, os claros a direita',
    'How many separate colors are taken from the brightness ramp': 'Quantas cores separadas são tiradas da rampa de luminosidade',
    'Ordered Bayer dither on the art grid — reads as a pixel pattern; works on colors and alpha':
        'Pontilhado Bayer ordenado na grade da arte — vira padrão de pixels; age na cor e no alfa',
    'Strength of the dither pattern; 0 turns dithering off': 'Força do padrão de pontilhado; 0 desliga o pontilhado',
    'One art pixel along the silhouette — the readability trick almost every sprite sheet uses':
        'Um pixel da arte em volta da silhueta — o truque de leitura que quase toda folha de sprites usa',
    'Draw the outline outside the silhouette or along its inner edge':
        'Desenha o contorno fora da silhueta ou na borda de dentro dela',
    'Color of the one-pixel silhouette outline': 'Cor do contorno de um pixel em volta da silhueta',
    'Atlas cell = the art grid, nearest filtering; keep this layer on top — layers above stay smooth':
        'Célula da folha = grade da arte, filtro nearest; deixe esta camada no topo — as de cima ficam lisas',

    // inspetor: sprite e folha
    'Sprite image: a procedural shape or an imported texture — click to choose':
        'Imagem do sprite: forma procedural ou textura importada — clique para escolher',
    'Sprite size in pixels along its longer side, before Scale is applied':
        'Tamanho do sprite em pixels no lado maior, antes de aplicar a Escala',
    'Frame rate of a footage texture; 0 stretches all frames over the layer window':
        'Taxa de quadros da textura animada; 0 estica todos os quadros na janela da camada',
    'Tint of the procedural shape; imported textures keep their own colors':
        'Cor da forma procedural; texturas importadas mantêm as cores delas',
    'How much camera compression flattens the sprite (1 — lying on the ground)':
        'Quanto a compressão da câmera achata o sprite (1 — deitado no chão)',
    'Additive glow halo around the shape; above 1 adds extra passes (not for textures)':
        'Halo de brilho somado em volta da forma; acima de 1 faz passadas extras (não para texturas)',
    'Size multiplier on top of the base size; animate it to grow or shrink the layer':
        'Multiplicador sobre o tamanho base; anime para a camada crescer ou encolher',
    'Width-to-height ratio: above 1 stretches the image wide, below 1 makes it tall':
        'Razão largura/altura: acima de 1 estica a imagem na largura, abaixo de 1 na altura',
    'Rotation of the layer image in degrees (positive turns clockwise)':
        'Rotação da imagem da camada em graus (positivo gira no sentido horário)',
    'Sprite sheet the frames come from — click to pick a texture or import a new one':
        'Folha de sprites de onde vêm os quadros — clique para escolher uma textura ou importar outra',
    'Open the sheet dialog: pick or drop an image and set its grid':
        'Abre a janela da folha: escolha ou solte uma imagem e defina a grade',
    'Edit the frame grid (columns, rows, fps) of the current sheet':
        'Edita a grade de quadros (colunas, linhas, fps) da folha atual',
    'On-screen size of one frame (its longer side)': 'Tamanho de um quadro na tela (pelo lado maior)',

    // widgets: chaves, curvas, degradês, escolha de sprite
    'Stopwatch: animate with keyframes; click again to drop the keys and keep the current value':
        'Cronômetro: anima com chaves; clicar de novo tira as chaves e mantém o valor atual',
    'Add a keyframe at the current time, or remove the one already there':
        'Põe uma chave no tempo atual, ou tira a que já está lá',
    'Drag a point to move it. Double-click to add or remove.': 'Arraste um ponto para movê-lo. Clique duplo põe ou tira.',
    'Replace the curve with a ready-made shape (fade out, grow, pulse…)':
        'Troca a curva por uma forma pronta (sumir, crescer, pulso…)',
    'Click to add a stop. Right-click a stop to remove it.': 'Clique para pôr um ponto de cor. Botão direito no ponto o tira.',
    'Click to pick for coloring, drag to move, right-click to remove the stop':
        'Clique escolhe o ponto para colorir, arrastar move, botão direito tira o ponto',
    'Color of the selected stop (click a stop under the strip first)':
        'Cor do ponto escolhido (antes, clique num ponto embaixo da faixa)',
    'Replace the gradient with a ready-made palette (fire, smoke, ice…)':
        'Troca o degradê por uma paleta pronta (fogo, fumaça, gelo…)',
    'A fixed shape variant, or Random to give each particle its own':
        'Uma variante fixa da forma, ou Aleatório para cada partícula ter a sua',
    'Use this imported texture as the image': 'Usa esta textura importada como imagem',
    'Import a new sprite sheet from disk and set its grid':
        'Importa uma nova folha de sprites do disco e define a grade',

    // formas e seus parâmetros (sprites.js)
    'Round blob with a soft falloff — glows, smoke, energy': 'Mancha redonda com queda suave — brilhos, fumaça, energia',
    'Solid disc with a crisp edge — droplets, dots, bubbles': 'Disco cheio com borda nítida — gotas, pontos, bolhas',
    'Hollow ring with adjustable thickness — shockwaves and pulses':
        'Anel vazado com espessura ajustável — ondas de choque e pulsos',
    'Ring band thickness as a fraction of its radius': 'Espessura da faixa do anel como fração do raio',
    'Solid square — pixels, confetti and digital bits': 'Quadrado cheio — pixels, confete e pedaços digitais',
    'Regular polygon with an adjustable number of sides': 'Polígono regular com número de lados ajustável',
    'How many sides the polygon shape has': 'Quantos lados a forma de polígono tem',
    'Star with adjustable points and depth — magic and sparkles':
        'Estrela com pontas e profundidade ajustáveis — magia e cintilância',
    'How many points (rays) the star shape has': 'Quantas pontas (raios) a forma de estrela tem',
    'Star depth: inner radius as a fraction of the outer one': 'Profundidade da estrela: raio interno como fração do externo',
    'Long soft streak along X — pair it with Align to velocity or Stretch':
        'Traço longo e suave em X — combine com Alinhar à velocidade ou Esticar',
    'Four-point glint with a bright core — twinkles and hit sparks':
        'Brilho de quatro pontas com núcleo claro — cintilar e faíscas de golpe',
    'Flame tongue with its tip along +X, 4 variants — use with Align to velocity':
        'Língua de fogo com a ponta em +X, 4 variantes — use com Alinhar à velocidade',
    'How sharply the flame tongue narrows toward its tip': 'Quão forte a língua de fogo afina até a ponta',
    'Hot white core with a soft halo — embers that burn white on Add':
        'Núcleo branco quente com halo suave — brasas que ficam brancas em Somar',
    'Cluster of soft blobs, 4 variants — smoke, dust and clouds':
        'Grupo de manchas suaves, 4 variantes — fumaça, poeira e nuvens',
    'Bumpy cartoon puff with a crisp edge, 4 variants — stylized smoke':
        'Nuvem de desenho irregular com borda nítida, 4 variantes — fumaça estilizada',
    'Irregular sharp shard, 4 variants — debris, glass and rocks':
        'Estilhaço irregular e pontudo, 4 variantes — destroços, vidro e pedras',

    // prévia e reprodução da folha
    'Animated preview of the composition with gizmos, zoom and pan (F — fit)':
        'Prévia animada da composição com controles, zoom e arrasto da vista (F — encaixar)',
    'The assembled sprite sheet as it will be exported, with frame playback on the side':
        'A folha de sprites montada como vai ser exportada, com a reprodução dos quadros ao lado',
    'Fit the view to the window (F or double-click an empty spot)':
        'Encaixa a vista na janela (F ou clique duplo num lugar vazio)',
    'Zoom to 100% — one composition pixel per pixel of the canvas':
        'Zoom em 100% — um pixel da composição por pixel da tela',
    'Background under the effect — only for viewing, it never gets into the export':
        'Fundo sob o efeito — só para ver, nunca entra na exportação',
    'Show position, fade and path controllers (drag moves them, Alt+click on the path adds a node)':
        'Mostra os controles de posição, esmaecer e caminho (arrastar move, Alt+clique no caminho põe um nó)',
    'Arrows showing where a resting particle is pushed: gravity, curl, wind, path pull and force fields':
        'Setas: para onde uma partícula parada é empurrada — gravidade, curl, vento, caminho e campos de força',
    'Fit the frame to the panel (double-click the frame)': 'Encaixa o quadro no painel (clique duplo no quadro)',
    'Wheel — zoom, drag — pan, double-click — fit': 'Roda — zoom, arrastar — mover a vista, clique duplo — encaixar',
    'Step to the previous atlas frame (playback pauses)':
        'Vai ao quadro anterior da folha (a reprodução pausa)',
    'Play only the atlas frames at the panel fps, the way the game will (Space)':
        'Toca só os quadros da folha no fps do painel, do jeito que o jogo vai tocar (Espaço)',
    'Step to the next atlas frame (playback pauses)': 'Vai ao próximo quadro da folha (a reprodução pausa)',
    'Playback rate; empty — the atlas own fps (frames / range)':
        'Ritmo da reprodução; vazio — o fps da própria folha (quadros / intervalo)',

    // linha do tempo: transporte e novas camadas
    'Jump to the start of the composition (Home)': 'Pula para o início da composição (Home)',
    'Step one frame back (Left arrow; with Shift — 10 frames)':
        'Volta um quadro (seta para a esquerda; com Shift — 10 quadros)',
    'Play or pause the composition (Space)': 'Toca ou pausa a composição (Espaço)',
    'Stop playback and return to the start': 'Para a reprodução e volta ao início',
    'Step one frame forward (Right arrow; with Shift — 10 frames)':
        'Avança um quadro (seta para a direita; com Shift — 10 quadros)',
    'Jump to the end of the composition (End)': 'Pula para o fim da composição (End)',
    'Loop playback: start over after the end instead of stopping':
        'Reprodução em loop: recomeça depois do fim em vez de parar',
    'Current time / composition length, then the frame number': 'Tempo atual / duração da composição, depois o número do quadro',
    'Add a particle emitter layer above the selected layer': 'Adiciona uma camada de emissor de partículas acima da camada escolhida',
    'Add a layer with a single sprite (a shape or a texture) above the selected one':
        'Adiciona uma camada com um só sprite (forma ou textura) acima da escolhida',
    'New sprite atlas layer (sheet frames, no preset animation)':
        'Nova camada de folha de sprites (quadros da folha, sem animação pronta)',
    'New post-effect layer (processes everything below it)': 'Nova camada de pós-efeito (processa tudo que está abaixo dela)',
    'New force field layer: radial fields that pull, push or swirl the particles of the emitters below':
        'Nova camada de campo de força: campos radiais que puxam, empurram ou giram partículas dos emissores abaixo',
    'Add a ready-made layer: flash, shockwave, fire, sparks, lightning and more':
        'Adiciona uma camada pronta: clarão, onda de choque, fogo, faíscas, raio e mais',
    'Dope sheet: keys and bars. Right-click a key for easing. Shift+click for multi-select.':
        'Folha de chaves: chaves e barras. Botão direito na chave muda a suavização. Shift+clique escolhe várias.',
    'Animation graphs and over-life curves': 'Gráficos de animação e curvas na vida da partícula',

    // linha do tempo: camadas, barras, chaves, curvas, gráfico
    'Emitter layer: spawns particles and simulates them': 'Camada de emissor: solta partículas e simula o movimento delas',
    'Sprite layer: a single shape or texture with an animated transform':
        'Camada de sprite: uma só forma ou textura com transformação animada',
    'Atlas layer: plays the frames of a sprite sheet': 'Camada de folha: toca os quadros de uma folha de sprites',
    'Post FX layer: processes the image of the layers below it':
        'Camada de pós-efeito: processa a imagem das camadas abaixo dela',
    'Force field layer: pushes the particles of the emitters below it':
        'Camada de campo de força: empurra as partículas dos emissores abaixo dela',
    'Click or drag to move the playhead; hold Shift to turn off frame snapping':
        'Clique ou arraste para mover a agulha do tempo; segure Shift para tirar o ímã dos quadros',
    'Show or hide the animated properties and curves of this layer (U)':
        'Mostra ou esconde as propriedades animadas e as curvas desta camada (U)',
    'Show or hide the layer, both in the preview and in the export':
        'Mostra ou esconde a camada, tanto na prévia quanto na exportação',
    'Solo: while any layer is soloed, only soloed layers are drawn':
        'Solo: enquanto alguma camada estiver em solo, só as camadas em solo são desenhadas',
    'Delete this layer (the Del key deletes all selected layers)':
        'Apaga esta camada (a tecla Del apaga todas as camadas escolhidas)',
    'Click — select (Shift — add), double-click — rename, drag — reorder, right-click — menu':
        'Clique — escolhe (Shift — soma), clique duplo — renomeia, arrastar — reordena, botão direito — menu',
    'Emission window — drag to move, drag an edge to trim; particles outlive its end':
        'Janela de emissão — arraste para mover, arraste a borda para cortar; as partículas vivem além do fim',
    'Post-effect window — drag to move, drag an edge to trim when the effect works':
        'Janela do pós-efeito — arraste para mover, arraste a borda para cortar quando ele age',
    'Force window — drag to move, drag an edge to trim when the fields act':
        'Janela da força — arraste para mover, arraste a borda para cortar quando os campos agem',
    'Visibility window — drag to move, drag an edge to trim; all selected bars move together':
        'Janela de visibilidade — arraste para mover, a borda para cortar; as barras escolhidas vão juntas',
    'Animated property: click to edit its keys and curves in the graph':
        'Propriedade animada: clique para editar as chaves e curvas no gráfico',
    'Animated color: move its keys here, the graph does not edit colors':
        'Cor animada: mova as chaves aqui, o gráfico não edita cores',
    'Double-click to add a key at that moment; drag the keys to move them':
        'Clique duplo põe uma chave nesse momento; arraste as chaves para movê-las',
    'Drag to move (selected keys move together), Shift+click adds to selection, right-click — easing':
        'Arraste para mover (as escolhidas vão juntas), Shift+clique soma à seleção, botão direito — suavização',
    'Over-life curve (0..1). Click to edit in the graph.':
        'Curva na vida da partícula (0..1). Clique para editar no gráfico.',
    'Particle life: 0 on the left, 1 on the right. Click to open the graph.':
        'Vida da partícula: 0 à esquerda, 1 à direita. Clique para abrir o gráfico.',
    'Particle color over life (0..1). Click the strip to add a stop, right-click removes, double-click picks a color.':
        'Cor da partícula na vida (0..1). Clique na faixa põe um ponto, botão direito tira, clique duplo escolhe a cor.',
    'Click the strip to add a color stop at that point of the particle life':
        'Clique na faixa para pôr um ponto de cor nesse momento da vida da partícula',
    'Drag to move. Right-click to remove. Double-click for color.': 'Arraste para mover. Botão direito tira. Clique duplo escolhe a cor.',
    'Show this property in the graph to edit its keys and Bezier handles':
        'Mostra esta propriedade no gráfico para editar as chaves e as alças Bézier',
    'Color tracks are edited in the dope sheet, not in the graph':
        'As faixas de cor se editam na folha de chaves, não no gráfico',
    'Show this over-life curve in the graph (X axis — particle life 0..1)':
        'Mostra esta curva da vida no gráfico (eixo X — vida da partícula 0..1)'
 }
};
// Sōkon FX: a forma "Bolota com sombra" (sprites.js).
Object.assign(window.AFX_PT.ui, {
 'Shaded Puff': 'Bolota com sombra', 'Bumps': 'Bolinhas', 'Shadow tone': 'Tom da sombra', 'Cool shadow': 'Sombra fria',
 'Shadow side': 'Lado da sombra', 'Shadow size': 'Tamanho da sombra', 'Light size': 'Tamanho da luz'
});
Object.assign(window.AFX_PT.dicas, {
 'Cartoon smoke puff in two tones: light on top, a darker shadow on one side': 'Bolota de fumaça de desenho em dois tons: luz por cima e sombra mais escura de um lado',
 'How many round bumps make the outline of the puff': 'Quantas bolinhas redondas formam o contorno da bolota',
 'Brightness of the shadow side: lower is a darker shadow': 'Claridade do lado da sombra: quanto menor, mais escura a sombra',
 'How much the shadow leans to blue (0 keeps it neutral gray)': 'Quanto a sombra puxa para o azul (0 deixa cinza neutro)',
 'Direction of the shadow in degrees: 90 is below, 0 is to the right': 'Direção da sombra em graus: 90 é embaixo, 0 é à direita',
 'How far the light part moves away, showing more shadow': 'Quanto a parte clara se afasta, deixando aparecer mais sombra',
 'Size of the light part relative to the whole puff': 'Tamanho da parte clara em relação à bolota inteira'
});
