# SŌKON · VFX Pack v1

Primeira versão para avaliação visual, renderizada no EffectCraft oficial Linux 0.24.1. Status WIP, com integração no jogo pendente.

| Efeito | Frames a 24 fps | Duração | Pivô em pixels |
|---|---|---|---|
| hit-light | 8 | 0,333 s | 192, 192 |
| hit-medium | 10 | 0,417 s | 192, 192 |
| hit-heavy | 12 | 0,500 s | 192, 192 |
| guard | 10 | 0,417 s | 170, 192 |
| landing | 14 | 0,583 s | 192, 304 |

Canvas comum de 384×384. Cada pasta contém projeto editável effect.ecproj, frames RGBA, atlas.png, atlas.json com coordenadas e pivô, preview.gif, review.jpg, teste em fundo claro, receita nativa, brief de gameplay, decisão citada, knowledge.json e log do render. O GIF usa fundo de revisão; a sequência PNG preserva transparência.

## Aplicação do aprendizado

Impactos têm geometrias, quantidade de detritos e duração diferentes. O núcleo recua antes das lascas. A cauda do forte foi reduzida de 16 para 12 frames em relação ao experimento de auditoria. A defesa usa uma crescente aberta com spray para fora do contato. A poeira fica rente ao chão, se espalha em duas direções e sobe levemente durante a dissipação. As receitas mantêm as camadas editáveis.

O primeiro frame deve começar no contato confirmado pelo jogo, ou no pouso. O player precisa implementar pause_vfx_with_game. Todos os efeitos usam atlas achatado. Posicionar no contato e revisar a oclusão dos lutadores. O pouso deve ser alinhado ao plano do solo pelo pivô. O pivô é medido da esquerda e do topo do canvas. O último quadro é vazio intencionalmente. Filtragem do atlas e interpretação do alpha precisam de teste no consumidor.

## Revisão e limites

Inspecionamos os frames completos e versões claras/escuras. Os 54 quadros têm canvas constante, alpha, margens livres e correspondência pixel a pixel com as células do atlas. O menor espaço livre medido foi 39 px no pouso. qa.json registra os resultados por efeito.

Os impactos permanecem geométricos e precisam de avaliação de direção de arte. A defesa tem bordas angulares que podem pedir suavização. A fumaça usa lobos repetidos e pode precisar de ruptura adicional. A revisão de hitbox, hit-stop e leitura sobre Ryūga/Yín-lù está pendente. Nenhuma aprovação artística final foi atribuída.

## Reprodução

Execute python tools/build_sokon_pack.py na raiz do repositório para recriar as cinco receitas e seus briefs. Renderize cada receita com tools/vfx_pipeline.py, passando --frames de acordo com a tabela e --fps 24. Use um diretório de saída novo. O binário oficial usado foi o mesmo verificado na auditoria; a revisão Rust do lock ainda precisa de sua própria comparação.

