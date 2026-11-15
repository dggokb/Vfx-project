# Auditoria independente do VFX Studio · 15 de novembro de 2026

## A. Resumo executivo

A main examinada foi 320d19f43b117e0b56efe949c99b1898da304d6a. A integração headless funciona com o binário Linux oficial 0.24.1. Reproduzimos integralmente os frames históricos, criamos uma composição vetorial de 15 camadas, editamos seu projeto salvo e verificamos a mudança na imagem. O pacote do impacto forte está [em projects/hit-heavy](../projects/hit-heavy/). Estado artístico WIP. Desktop, importação no jogo, desempenho em celular e equivalência geral ao Adobe After Effects permanecem sem comprovação experimental.

O checkout Rust do lock é dc2380b070fab3d80a16d00d0ea2f19e6cafa876. A tag v0.24.1 resolve para 582344dd4ef462362c02e56e3094de7af01847ab. Há 442 arquivos de diferença. Compartilhar o número de versão não torna as builds intercambiáveis. O teste prático usa a distribuição da tag. O job histórico da revisão do lock compilou com Cargo; não repetimos a compilação local (cargo ausente). Instalamos a distribuição oficial extraindo seu tar.gz, cujo SHA-256 foi 5ce0393690144227fa9186e82308ad638a6ef6d9f976c996e6d03b5b51b65a7b.

## B. Matriz de funcionalidades

| Recurso | Estado | Evidência e limite |
|---|---|---|
| CLI, inicialização MCP, comunicação | Confirmado por execução | Ajuda CLI, initialize, tools/list com 27 ferramentas, get_state, execute_command e render_frame. PNG 128×128 com centro visível e canto alfa zero. |
| Composição e Shape Layers | Confirmado por execução | comp.new, layer.newShape e shape.newPath geraram massas e fragmentos editáveis. |
| Keyframes e interpolação | Confirmado por execução | Curvas de posição, escala e opacidade; 16 amostras distintas incluindo o fim vazio. |
| Graph Editor, gráficos de valor/velocidade; Easy Ease, Bezier e Hold | Confirmado por documentação/código | docs/user/guides/animate-with-keyframes.md e testes upstream de velocidade. Não exercitamos os controles de UI. Valor e velocidade são grandezas distintas; easing temporal difere da geometria da trajetória. |
| Trim Paths, Offset Paths, Repeater | Confirmado por documentação/código | crates/automation/tests/qa/shapes.rs testa revelação do traço, expansão e repetição. Esse teste upstream não foi executado aqui. |
| Máscaras e track mattes | Confirmado por documentação/código | Comandos de máscara e testes de composição upstream. Máscara delimita uma camada; matte usa outra camada como fonte de alfa/luminância. Modos individuais não testados. |
| Motion blur | Confirmado por documentação/código | docs/effects.md lista Pixel e Temporal Motion Blur. Amostras afetam qualidade/custo, shutter angle afeta exposição. Não verificamos controles equivalentes em cada modo. |
| Aplicação e composição de efeitos, Glow | Confirmado por execução | effect.apply resolveu ec.stylize.glow. Uma cópia reaberta com Glow mudou RGB e alfa no frame 2. O projeto entregue conserva o desenho original sem halo. Ordem entre filtros diferentes não testada. |
| Expressões | Parcialmente implementado quanto à paridade | crates/expr/src/prelude.js e docs/scripting-parity.md documentam posterizeTime, wiggle, loopOut e limites; equivalência de tipos, bordas e resultados AE não medida. |
| Pré-composição | Confirmado por documentação/código | docs/agents.md descreve precomp e limites de unprecompose. Separar camadas por função, como fazemos aqui, por si só não cria uma composição aninhada. |
| Partículas | Confirmado por documentação/código | docs/effects.md lista emissores 2D/3D e Playground. As lascas deste teste são paths keyframed; nenhum emissor foi testado. |
| Frames transparentes e atlas | Confirmado por execução | PNG RGBA, áreas transparentes, cobertura variável. Coordenadas do JSON recuperam os pixels de cada frame. Packer Python externo ao render. |
| Salvar, reabrir, editar .ecproj | Confirmado por execução | CLI salvou o projeto, carregou de disco para aplicar Glow, salvou uma cópia e reabriu essa cópia para render comparativo. |
| Timing e leitura de jogo | Parcialmente implementado | Contraste de poses e desaceleração observados. Hit-stop e leitura sobre lutadores não testados. |
| Aprovação automática profissional, compreensão da IA, desktop e paridade total AE | Não comprovado | Não há teste capaz de inferir essas propriedades a partir do sucesso deste pipeline. |

Referências técnicas consultadas: [índice Adobe com links por tópico S01–S08 e S14–S15](VFX_SOURCES.md), [Adobe sobre precomposição](https://helpx.adobe.com/after-effects/using/precomposing-nesting-pre-rendering.html), [Adobe sobre partículas](https://helpx.adobe.com/after-effects/desktop/apply-effects-and-animation-presets/list-of-effects/simulation-effects.html), [GDC sobre gameplay, contraste e ritmo](https://gdcvault.com/play/1023943/Visual-Effects-Bootcamp-Artistic-Principles) e [upstream fixado](https://github.com/storytold/effectcraft/tree/dc2380b070fab3d80a16d00d0ea2f19e6cafa876). Os conceitos centrais do manual são coerentes com essas referências. As faixas em frames são heurísticas de produção. A escolha de alpha straight/premultiplied no consumidor ainda precisa de um teste real de halos. A seção sobre pré-composição ensinava principalmente organização de camadas; a distinção acima importa.

## C. Achados por criticidade

| Grau | Esperado | Observado e consequência |
|---|---|---|
| Alto | Mesma revisão nas duas rotas ou evidências separadas | Lock e release divergem; o histórico verde da release não aprova automaticamente o checkout. |
| Alto | Cada criação incorpora decisões anteriores | Preflight original aceitava seis arquivos com 100 bytes e hashes. Nenhum conteúdo era apresentado ou associado à receita. |
| Alto | Detectar sequência estática, vazia ou cortada | CI verificava contagem declarada, canto do atlas e presença de algum conteúdo em qualquer célula. Uma única pose replicada podia passar. |
| Médio | Reexecução segura | Projeto parcial bloqueia retry no mesmo diretório; usar diretório novo após falha. Checagem de existência não é lock concorrente. |
| Médio | Dependências reproduzíveis | Pillow>=11,<13, Actions por tags, Rust stable no workflow. O helper de build não passava --locked. O pacote Linux era extraído sem comparar digest. |
| Médio | Comandos confiáveis e recursos limitados | Receitas são comandos upstream com acesso a operações de arquivo; executar apenas receitas confiáveis. Dimensões/contagem sem limite próprio; packer mantém todos os frames em memória. |
| Baixo | Precisão do manual | Render sequencial de PNGs era chamado de multipass. Pivô e extrusão não estão no manifesto do packer. |

Não identificamos defeito crítico demonstrado neste escopo. O repositório é uma camada de automação Python, com instalação, MCP, receita e empacotamento separados. O editor pertence ao upstream. presets/catalog.json e os diretórios de projeto não constituem por si uma ferramenta de autoria profissional.

## D. Histórico e correções

| Commit da main | Alteração inspecionada | Alcance |
|---|---|---|
| 39fe81a8 | Estrutura, lock, instalador, packer, testes de atlas | Sem teste real do motor nesse commit. |
| 42250c70 | Runner, receita, MCP e workflow de compilação | Teste local emprega CLI falsa; verifica orquestração. |
| a11c0725 | Checkout antes do cache Cargo | Build histórica bem-sucedida; o teste seguinte falhou em alfa. |
| 8ae6129c | libasound2t64 para Ubuntu 24.04 | Job do binário passou com o pacote corrigido. |
| a83fce37 | Guia, diário, brief, fontes e AGENTS | Conteúdo orienta autoria, sem enforcement nesse commit. |
| 320d19f4 | Fingerprints e preflight no runner | Segundo ZIP inclui knowledge.json; nenhuma evidência de entendimento. |

Na branch de auditoria: tools/vfx_review.py e vfx_pipeline.py associam citações, decisão, comandos e medições à receita; recipes/*.brief.json introduzem os briefs. tests/test_vfx_review.py cobre regressões negativas. Workflows observam o novo validador e guias; release confere o hash antes de extrair. tools/effectcraft.py usa Cargo --locked no build. Guia corrigido, instruções e diário ampliados. Arquivos existentes de projeto preservados.

## E. Testes e evidências

Ambiente Linux x86_64, Python 3.12, teste final com Pillow 12.3.0 em venv. Logs [unitários e MCP](evidence/tests.txt), [render completo](evidence/heavy-render.txt), [verificações de pixels](evidence/pixel-check.txt). Sete testes Python passaram; o fake em test_vfx_pipeline continua restrito à orquestração. Comandos para reproduzir, com CLI apontando para o executável da release e diretórios de saída novos:

```bash
python -m pip install -r requirements.txt
python -m unittest discover -s tests -v
python tools/effectcraft_mcp_smoke.py --cli "$CLI"
python tools/vfx_pipeline.py --cli "$CLI" --recipe recipes/hit-light.json --out dist/audit-light --frames 10
python tools/vfx_pipeline.py --cli "$CLI" --recipe recipes/hit-heavy.json --out dist/audit-heavy --frames 16 --fps 24 --columns 4
"$CLI" run effect.apply '{"effect":"Glow","layers":["Core"]}' --project dist/audit-heavy/effect.ecproj --save-as /tmp/edited.ecproj
"$CLI" render-frame --project /tmp/edited.ecproj --frame 2 --transparent --out /tmp/glow.png
```

| Execução histórica | Logs e ZIP verificados | Limite |
|---|---|---|
| [43711782704](https://github.com/dggokb/Vfx-project/actions/runs/43711782704) | Job 132804702540, artefato 14160469159, 14 arquivos. MCP 27 ferramentas, PNG 128×128; atlas 1024×768 RGBA. Os 10 PNGs coincidiram pixel a pixel com o render local. | Sem knowledge.json, edição posterior, avaliação visual ou análise por quadro no CI. |
| [43713622974](https://github.com/dggokb/Vfx-project/actions/runs/43713622974) | Job 132810344853, artefato 14160923362, 15 arquivos. Mesmo resultado visual; preflight aparece no log e knowledge.json no ZIP. | Mesma receita de dois círculos. Hash do manual não evidencia aplicação. |
| [43676609080](https://github.com/dggokb/Vfx-project/actions/runs/43676609080) | Job 132698026284 compilou a CLI e falhou com “Expected alpha-enabled PNG; got PNG RGB”. ZIP 14145764649 contém somente mcp-smoke.png RGB 256×144. Render da receita foi pulado. | Testava a demo opaca. Trocar a cena por círculo sobre transparência e testar alfa 0 e alfa positivo corrigiu a premissa; aceitar RGB indiscriminadamente esconderia defeitos. |

## F. Aprendizado reutilizável

AGENTS orienta quem consulta o repositório. O guia fornece poses, hierarquia, ritmo, alpha e critérios visuais; o diário guarda inclusive falhas. No runner original o subprocesso de preflight era real, mas o conhecimento verificável terminava nos digests. No novo fluxo é obrigatório citar guia e diário, explicar a decisão e declarar comandos e critérios de saída. O impacto forte aplica a lição sobre círculos por meio de shape.newPath e fragmentos com movimento independente. O runner mede a margem e os frames vazios, rejeita animação completamente estática e salva observações em [knowledge.json](../projects/hit-heavy/knowledge.json). O teste negativo exercita os três defeitos.

Isso permite auditar uma escolha. Um autor ainda pode copiar uma citação irrelevante, omitir um comando importante do brief ou usar limites frouxos. CLI direta, MCP, editor e packer isolado contornam o fluxo. Nenhum mecanismo demonstra compreensão interna, atualização automática do diário ou conformidade de qualquer agente externo. A lição desta iteração foi acrescentada ao diário para uso posterior.

## G. Teste artístico

[GIF animado](../projects/hit-heavy/preview.gif) · [projeto editável](../projects/hit-heavy/effect.ecproj) · [atlas](../projects/hit-heavy/atlas.png) · [coordenadas](../projects/hit-heavy/atlas.json) · [sequência](../projects/hit-heavy/frames/) · [receita](../recipes/hit-heavy.json).

Canvas 320×320, pivô proposto (160,160), 24 fps, 16 frames, 0,667 s. Quatro massas vetoriais sobrepostas e onze lascas separadas. O GIF compõe os renders sobre fundo escuro apenas para avaliação. Os PNGs conservam alpha. A inspeção da sequência inteira mostra contato pequeno no quadro 0, abertura abrupta no 1 e ápice no 2. Pontas longas na diagonal conduzem o olhar ao núcleo branco; o laranja mantém contorno visível. A saída separa núcleo e detritos, com final vazio intencional. A margem mínima observada é 33 px. Todas as células do atlas coincidem com os PNGs. O teste de edição produziu diferença máxima de 69 níveis no alfa do quadro 2.

A silhueta é legível, embora as quatro massas compartilhem o mesmo desenho-base e deem aspecto de estrela recortada. Nos quadros 12–14 as lascas têm pouca presença. Cabe testar uma cauda mais curta antes de aprovar em SŌKON. As lascas não usam simulador, o efeito não depende de 3D e nenhum frame-fonte foi pintado fora do EffectCraft.

## H. Próximos passos

1. Rodar a mesma bateria e comparar imagens da release com a revisão compilada do lock; escolher uma referência única ou manter matrizes distintas.
2. Importar atlas no jogo, posicionar no ponto de contato e revisar em velocidade real sobre lutadores e cenários claros/escuros. Confirmar alpha e filtragem na GPU do celular.
3. Publicar outputs de forma atômica e validar dimensões, limites e tempo máximo antes do render. Adicionar testes de concorrência e retry.
4. Tornar a promoção ao catálogo dependente de QA independente, revisão humana e teste no consumidor. Acrescentar fixtures de matte, blur, precomp, expressões e operadores de path antes de prometer equivalência por recurso.
