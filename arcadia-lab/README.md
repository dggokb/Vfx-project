# Arcadia Lab — experimento isolado
Upstream: https://github.com/xaidan777/Arcadia-Effects/tree/ed2bd1b371ecdaae9274f207c77535c61610f0f8
Licença MIT preservada em upstream/LICENSE. Foram importados código, documentação e ferramentas, não bibliotecas JSON com texturas ou imagens de terceiros. Alterações do laboratório: formas próprias e novos presets; o editor original SōkonFX não é substituído.

## Executar
```
npm install
npm run arcadia:build
npm run arcadia:test
```
Abra arcadia-lab/dist/SokonArcadia.html diretamente no Chrome, sem servidor. O HTML é gerado localmente. O catálogo e as configurações usam armazenamento do navegador; faça backup dos tipos. A interface original continua em inglês/russo; os controles adicionais e presets estão em português. Não publique o servidor upstream sem autenticação.

## MVP
Guard (ar branco, arcos curtos); Guard Break (mais arcos e irregularidade, sem vidro); Heavy Hit Spark; Dash Smoke; Ground Impact Dust. Todos editáveis no catálogo de fábrica. As máscaras novas são rasterizadas em 256 px (original: 128), sem modificar as máscaras antigas. A fumaça utiliza contornos orgânicos, curl noise e subemissão; não é simulação física de fluidos nem cel shading completo. Dissipação por redução geométrica/subemissão, ainda sem erosão multi-ponto. A prévia permite carregar print local e marcar contato. Exportação experimental usa funções puras do export atual, mantém a origem no centro e gera folha.webp + efeito.json; precisa de validação visual dentro do jogo.

## Limites / próximos passos
O teste também chama validate.mjs e simhash.mjs para os 13 presets de fábrica (8 originais e 5 novos); os arquivos gerados ficam em dist/presets. Comparar imagem por imagem com a bíblia de VFX; medir performance e memória; melhorar dissipação, sombreamento por massas, vetores de alta resolução, tradução completa e experiência no celular. Não importar sprites/prints privados no GitHub. Não substituir a main até aprovação artística. O teste do laboratório exercita render real, atlas e export, mas não mede fidelidade visual nem roda o motor do jogo.
