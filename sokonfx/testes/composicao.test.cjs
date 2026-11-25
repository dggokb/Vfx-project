// Confere a "Composição de camadas":
//  - uma camada assada numa página que já carregou outros tipos sai pixel a pixel igual ao tipo
//    aberto numa página limpa (o estado que a ferramenta guarda entre trocas não vaza);
//  - depois de assar, a tela volta ao que era (tipo e desenho);
//  - uma camada sem mudanças = o próprio efeito; o início atrasado estica a composição;
//  - o export leva todos os quadros e a composição no efeito.json;
//  - o "Salvar tipo" guarda a composição e ela volta igual numa página nova.
//   node sokonfx/testes/composicao.test.cjs
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),os=require('os');
const {renderizar}=require('./render.cjs');

const raiz=path.join(__dirname,'..');
let falhas=0;
const ok=(cond,msg)=>{if(!cond){falhas++;console.log('FALHOU',msg)}};
const H=JSON.parse(fs.readFileSync(path.join(raiz,'tipos','dono.json'),'utf8')).types[0];
const AR={name:'ar',values:{kind:'Pressão de ar',airEdge:'spiked',airFlow:'pulse',styleMix:'35'},seed:991,haloEnabled:true,customParticleTint:'#ff781a',linked:true};
const sujeira=[
 {name:'f',values:{kind:'Fumaça',smokeForm:'jump',jumpRoll:'140',tint:'#ffffff'},seed:5,haloEnabled:false,customParticleTint:'#33aaff',linked:false},
 {name:'c',values:{kind:'Corte',styleMix:'100',rimWidth:'200'},seed:77,haloEnabled:true,customParticleTint:'#ff781a',linked:true},
 {name:'i',values:{kind:'Impacto',material:'Raio',artStyle:'manga',focus:'90',diameter:'180'},seed:3,haloEnabled:false,customParticleTint:'#ff781a',linked:true},
];

// Hashes dos quadros na página: do que vale (desenharQuadro), do efeito da tela (draw) ou de canvases.
const hashes=(p,modo,arg)=>p.evaluate(async({modo,arg})=>{
 const h=async c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;const b=new Uint8Array(await crypto.subtle.digest('SHA-256',d));return [...b.slice(0,8)].map(x=>x.toString(16).padStart(2,'0')).join('')};
 const um=f=>{const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.save();f(x);x.restore();return c};
 if(modo==='assado')return Promise.all(composicao.cache.get(composicaoChave(composicao.camadas[arg].tipo)).map(h));
 const n=modo==='valendo'?quadrosTotais():16;
 return Promise.all([...Array(n).keys()].map(i=>h(um(x=>modo==='valendo'?desenharQuadro(x,i):draw(x,i)))));
},{modo,arg});

(async()=>{
 const {montar}=await import(path.join(raiz,'build.mjs'));
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'sokonfx-comp-'));
 const html=path.join(tmp,'SokonFX.html');fs.writeFileSync(html,montar());
 const b=await chromium.launch();
 // O tipo da pressão de ar completo (todos os campos), como o "Salvar tipo" grava.
 {const p=await b.newPage();await p.goto('file://'+html);
  Object.assign(AR,await p.evaluate(async AR=>{localStorage.clear();await aplicarTipo(AR);return tipoDaTela()},AR),{name:'ar'});await p.close()}
 const limpo=await renderizar(b,html,{nome:'H limpo',modo:'tipo',valores:H.values,seed:H.seed,halo:H.haloEnabled,linked:H.linked,custom:H.customParticleTint});
 const arLimpo=await renderizar(b,html,{nome:'ar limpo',modo:'tipo',valores:AR.values,seed:AR.seed,halo:AR.haloEnabled,linked:AR.linked,custom:AR.customParticleTint});

 const p=await b.newPage({acceptDownloads:true});
 const erros=[];p.on('pageerror',e=>erros.push(e.message));
 await p.goto('file://'+html);
 await p.evaluate(async sujeira=>{localStorage.clear();if(playing)el('play').onclick();for(const t of sujeira)await aplicarTipo(t);
  await aplicarTipo({name:'tela',values:{kind:'Fogo',styleMix:'70',tint:'#ff3300'},seed:123,haloEnabled:true,customParticleTint:'#ff781a',linked:true})},sujeira);
 const telaAntes=await p.evaluate(()=>JSON.stringify(tipoDaTela())),desenhoAntes=await hashes(p,'tela');

 await p.evaluate(H=>{composicaoAdicionar(H);return composicaoFila},H);
 ok(JSON.stringify(await hashes(p,'assado',0))===JSON.stringify(limpo),'camada assada igual ao tipo numa página limpa');
 ok(await p.evaluate(()=>JSON.stringify(tipoDaTela()))===telaAntes,'a tela volta ao mesmo tipo');
 ok(JSON.stringify(await hashes(p,'tela'))===JSON.stringify(desenhoAntes),'a tela volta ao mesmo desenho');
 ok(JSON.stringify(await hashes(p,'valendo'))===JSON.stringify(limpo),'uma camada sem mudanças = o próprio efeito');

 await p.evaluate(AR=>{composicaoAdicionar(AR);composicao.camadas[1].inicio=4;composicaoMudou();return composicaoFila},AR);
 ok(JSON.stringify(await hashes(p,'assado',1))===JSON.stringify(arLimpo),'segunda camada assada igual à página limpa');
 ok(await p.evaluate(()=>composicao.camadas.every(c=>savedFields.every(id=>c.tipo.values[id]!==undefined))),'camadas guardam o tipo completo');
 const valendo=await hashes(p,'valendo');
 ok(valendo.length===20,'início no quadro 4 estica para 20 quadros: '+valendo.length);
 ok(valendo[2]===limpo[2],'quadro 2: só a primeira camada');
 ok(valendo[19]===arLimpo[15],'quadro 19: só o fim da segunda');
 ok(valendo[8]!==limpo[8]&&valendo[8]!==arLimpo[4],'quadro 8: as duas juntas');
 ok(await p.$eval('#frame',e=>e.max)==='19'&&await p.$eval('#jogoFim',e=>e.value)==='20','controles seguem os 20 quadros');
 // Mover, girar e esconder mudam; voltar ao normal volta igual.
 await p.evaluate(()=>{const c=composicao.camadas[0];c.dx=40;c.angulo=30;c.escala=80;c.soma=true;composicaoMudou()});
 ok((await hashes(p,'valendo'))[2]!==limpo[2],'camada movida muda o quadro');
 await p.evaluate(()=>{const c=composicao.camadas[0];Object.assign(c,{dx:0,angulo:0,escala:100,soma:false});composicao.camadas[1].oculta=true;composicaoMudou()});
 const soUma=await hashes(p,'valendo');
 ok(soUma.length===16&&JSON.stringify(soUma)===JSON.stringify(limpo),'esconder a segunda volta ao H');
 await p.evaluate(()=>{composicao.camadas[1].oculta=false;composicaoMudou()});

 // Export com a composição.
 await p.evaluate(()=>{el('gameExport').open=true;el('jogoNome').value='composto';jogoAtualizar()});
 const [download]=await Promise.all([p.waitForEvent('download'),p.click('#jogoExportar')]);
 const zip=fs.readFileSync(await download.path());
 const i=zip.indexOf('{\n "nome"'),j=zip.indexOf('\n}\n',i);
 const dados=JSON.parse(zip.toString('utf8',i,j+2));
 ok(dados.quadros.length===20&&/composição de 2 camadas/.test(dados.video),'export com 20 quadros e a descrição: '+dados.quadros.length+' '+dados.video);
 ok(dados.sokonfx?.composicao?.camadas?.length===2,'efeito.json guarda a composição');

 // Salvar tipo com a composição e abrir numa página nova.
 await p.evaluate(()=>{el('presetName').value='soco composto';window.confirm=()=>true;el('keep').onclick()});
 const salvo=await p.evaluate(()=>storedTypes().find(t=>t.name==='soco composto'));
 ok(salvo?.composicao?.camadas?.length===2,'o tipo salvo guarda as camadas');
 const p2=await b.newPage();p2.on('pageerror',e=>erros.push(e.message));
 await p2.goto('file://'+html);
 await p2.evaluate(async t=>{localStorage.clear();if(playing)el('play').onclick();persistTypes([t]);showTypes([t]);el('savedTypes').value=t.name;el('savedTypes').onchange();await composicaoFila},salvo);
 ok(JSON.stringify(await hashes(p2,'valendo'))===JSON.stringify(valendo),'a composição volta igual numa página nova');
 ok(await p2.$eval('#compAtiva',e=>e.checked)&&await p2.$$eval('#compLista fieldset',f=>f.length)===2,'painel mostra as 2 camadas');
 ok(erros.length===0,'erros na página '+erros);
 await b.close();fs.rmSync(tmp,{recursive:true});
 console.log(falhas?`${falhas} falhas`:'composição: tudo certo');
 process.exit(falhas?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
