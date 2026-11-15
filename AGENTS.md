# VFX Studio — instruções obrigatórias para agentes e colaboradores

Estas regras valem **em toda tarefa de criação, revisão, exportação ou automação de um VFX** neste repositório, independentemente de quem execute o trabalho (agente, IDE, operador humano ou outro modelo).

## Leitura obrigatória ANTES de gerar um novo efeito

1. Leia [docs/VFX_MASTER_GUIDE.md](docs/VFX_MASTER_GUIDE.md) — princípios de Adobe After Effects adaptados a VFX 2D de jogos.
2. Leia [docs/VFX_LEARNING_LOG.md](docs/VFX_LEARNING_LOG.md) — correções e descobertas reais; a lição mais recente pode prevalecer sobre uma heurística inicial.
3. Leia [docs/VFX_SOURCES.md](docs/VFX_SOURCES.md) e [docs/EFFECTCRAFT_INTEGRATION.md](docs/EFFECTCRAFT_INTEGRATION.md).
4. Consulte [docs/VFX_BRIEF_TEMPLATE.md](docs/VFX_BRIEF_TEMPLATE.md) e anote intenção, tamanho, pivô, FPS, ritmo, direção e critérios objetivos antes de produzir.
5. Execute `python tools/vfx_preflight.py --effect NOME_DO_EFEITO` (o pipeline executa esta checagem automaticamente).

## Procedimento de produção não negociável

- **Bloqueio de leitura:** silhueta → poses/ritmo em blocos sem efeitos → intensidade → cores → brilho/partículas → render → QA.
- Use **EffectCraft real** para projetos/editáveis e animação; comandos/receitas só com IDs/params verificados na versão fixada em `effectcraft.lock.json`. Adobe After Effects é a referência de técnicas, **não é** o binário usado neste projeto.
- Renderize frames reais antes de declarar um efeito pronto. GIFs ou ilustrações sintéticas de demonstração devem ser rotulados como tal.
- Exporte PNG com canal alfa e mesmo canvas/pivô; confira sequência, ordem, falta de cortes, transparência, leitura em fundo claro/escuro e escala de jogo.
- Não desenhe por cima/refaça sprites de personagens sem solicitação; efeitos de ataque e trails devem ser assets separados.
- Registre verificações e ressalvas. **Nunca** marque “aprovado” porque apenas compilou ou porque um teste de mock passou.
- Se surgir defeito, corrigir e registrar causa → ajuste → evidência no diário antes de promover uma receita ao catálogo de produção.
- Ao finalizar o trabalho, adicione uma entrada concisa a `docs/VFX_LEARNING_LOG.md`; quando a descoberta for geral, atualize também o manual e seus links de fontes.
- Os exemplos de duração/cores do manual são **pontos de partida de direção de arte**, não leis universais. A referência aprovada do efeito e o feedback do solicitante sempre têm prioridade.

## Portões de qualidade

1. **Leitura:** a ação é reconhecível sem brilho nem textura?
2. **Tempo:** existe contraste entre pré-ação, ápice e dissipação?
3. **Arte:** paleta e forma servem ao golpe? Bloom não apaga o desenho?
4. **Técnica:** alfa, margens, canvases, pivô, ordem de frames e formatos corretos?
5. **Evidência:** vídeo/GIF e PNG reais inspecionados + teste de integração registrável?
6. **Conhecimento:** registrar o que funcionou e o que falhou.

Se qualquer portão falhar, classifique como **WIP**; não chame de VFX profissional concluído.
