# SŌKON · Impacto forte · MVP conceitual

MVP para avaliação de direção visual. Impacto direcional de contato, com núcleo branco, corpo laranja, transições amarelas, pontas curvas, abertura do centro e fragmentos em dissipação.

## Entrega

12 frames a 24 fps, duração de 0,5 s. Dez desenhos distintos em dez camadas de footage, ápice mantido nos frames 2–3, final vazio no frame 11. Canvas 768×768. Pivô de contato proposto (288,384), em pixels a partir do canto superior esquerdo. O preview.gif repete a animação com pausa de 0,5 s no final para facilitar revisão. slow.gif é a versão desacelerada. dark-light.gif permite comparar a leitura nos dois fundos. Esses fundos pertencem apenas aos previews.

effect.ecproj guarda as exposições e opacidades editáveis. A pasta source contém os PNGs usados por cada camada. Mantenha source ao lado do projeto para abrir em outra máquina. Frames RGBA e atlas.png foram renderizados no EffectCraft oficial Linux 0.24.1. atlas.json contém coordenadas, pivô, FPS e política de hit-stop proposta. commands.json registra todos os comandos nativos. exposures.json documenta as durações de cada desenho.

## Autoria e aplicação do aprendizado

A arte foi criada com a ferramenta de geração de imagens integrada. Selecionamos desenhos de uma folha de animação e geramos uma pintura separada para o ápice, pois o primeiro atlas encostava pontas nas células. A segunda tentativa de correção do atlas perdeu limpeza e foi descartada. Os desenhos selecionados foram recortados e alinhados em canvas comum. O ponto de contato foi identificado manualmente em cada pintura.

A mudança de forma entre contato, ápice, ruptura, lobos separados e resíduos é fornecida pelos desenhos distintos. O EffectCraft importa os assets, controla exposição e opacidade e produz os renders finais. O projeto contém pinturas raster, cuja geometria interna é editada no PNG de origem. Ele não oferece paths vetoriais independentes para cada língua laranja ou parte do núcleo.

A referência ArcSys orientou contraste de poses, contato definido e dissipação com vazios internos. O manual orientou separação temporal e a prioridade da silhueta sobre o glow. A lição da auditoria orientou a cauda curta e o encerramento limpo. A forma dominante foi revista antes de aplicar qualquer bloom adicional.

## Verificação de produção

qa.json registra os 12 quadros e seus hashes, bboxes, transparência e comparação exata com as células do atlas. A margem mínima é de 62 px. O projeto e a mídia foram copiados para outra pasta e renderizados a partir de um diretório diferente, com igualdade de pixels no ápice. Na cópia reaberta, alterar a opacidade de apex.png e salvar outro projeto mudou o resultado renderizado.

Usamos comandos nativos e preflight da base de conhecimento. O renderer geral do repositório valida receitas de shapes; a montagem de footage deste MVP foi executada por commands.json, com QA específico de mídia e frames. knowledge.json identifica essa rota. A revisão estrutural das receitas de shapes não cobre automaticamente esta composição.

O núcleo abre no frame 1, o ápice ocupa 2–3, a ruptura começa no 4 e o centro esvazia nos frames seguintes. Há transição perceptível entre a pintura do ápice e a folha usada na cauda, que pode exigir desenho intermediário se incomodar em gameplay. O contato foi alinhado visualmente, com revisão final pendente no jogo. O efeito ainda precisa ser avaliado junto dos lutadores, escala de combate, hit-stop e oclusão antes de ser aprovado como asset de produção. A cor e a transparência dos PNGs devem ser testadas no consumidor.

## Reprodução do render

Execute a partir desta pasta, com CLI apontando para o EffectCraft 0.24.1. Preserve os PNGs de source.

```bash
"$CLI" run --commands commands.json --empty --save-as reproduced.ecproj
"$CLI" render-frame --project reproduced.ecproj --frame 2 --out apex-test.png --transparent
```

A receita é relativa à pasta do projeto. As imagens-fonte foram geradas uma vez e estão incluídas. Para alterar o desenho de uma fase, edite o PNG correspondente e recarregue o footage no editor.

## Direção enviada à geração de imagens

Arte original de impacto de soco forte para jogo de luta anime 2D. Fundo alpha, contorno limpo, branco intenso no contato, transições quentes em amarelo e laranja, grandes línguas curvas assimétricas, pontas afiladas e lascas douradas. Doze fases previstas em atlas 4×3, ponto de contato fixo, ápice compacto e forte, ruptura progressiva, centro transparente na cauda e final vazio. A pintura adicional do ápice pediu margem ampla e corpo laranja sólido, com recorte de fissuras e fragmentos. Foram usadas duas imagens aprovadas visualmente como fonte e uma tentativa de edição descartada.
