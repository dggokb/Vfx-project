// Confere as ferramentas do editor: vizinhos (onion skin) só na prévia, rampa de cor salva e
// aplicada nos geradores novos, e o export em lote (um .zip com uma pasta por tipo, cada um com as
// opções de export dele, e a tela volta ao que era).
//   node sokonfx/testes/editor.test.cjs
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),os=require('os');
const raiz=path.join(__dirname,'..');
let falhas=0;
const ok=(cond,msg)=>{if(!cond){falhas++;console.log('FALHOU',msg)}};
function lerZip(buf){const a={};let p=0;while(buf.readUInt32LE(p)===0x04034b50){const t=buf.readUInt32LE(p+18),n=buf.readUInt16LE(p+26),e=buf.readUInt16LE(p+28);
 a[buf.toString('utf8',p+30,p+30+n)]=buf.subarray(p+30+n+e,p+30+n+e+t);p+=30+n+e+t}return a}
(async()=>{
 const {montar}=await import(path.join(raiz,'build.mjs'));
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'sokonfx-ed-'));
 const html=path.join(tmp,'SokonFX.html');fs.writeFileSync(html,montar());
 const b=await chromium.launch();const p=await b.newPage({acceptDownloads:true});
 const erros=[];p.on('pageerror',e=>erros.push(e.message));
 await p.goto('file://'+html);
 await p.evaluate(()=>{localStorage.clear();if(playing)el('play').onclick();el('kind').value='Choque';el('kind').oninput({});el('frame').value=6;preview()});
 // Vizinhos: mais pixels na prévia, nada muda no quadro do export.
 const conta=()=>p.evaluate(()=>{const d=stage.getContext('2d').getImageData(0,0,512,512).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>8)n++;return n});
 const quadro=()=>p.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=512;desenharQuadro(c.getContext('2d'),6);return c.toDataURL()});
 const sem=await conta(),q0=await quadro();
 await p.click('#onion');
 ok(await conta()>sem,'vizinhos aparecem na prévia');
 ok(await quadro()===q0,'vizinhos não entram no quadro do export');
 await p.click('#onion');
 // Rampa: aparece nos geradores novos, some nos antigos; muda a cor do fim; salva e volta.
 ok(!(await p.$eval('#rampaBloco',e=>e.hidden)),'rampa à vista no gerador novo');
 const cores=()=>p.evaluate(()=>{const m=i=>{const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');draw(x,i);const d=x.getImageData(0,0,512,512).data;let r=0,g=0,bb=0,n=0;for(let k=0;k<d.length;k+=4)if(d[k+3]>200){r+=d[k];g+=d[k+1];bb+=d[k+2];n++}return [r/n|0,g/n|0,bb/n|0]};return [m(0),m(12)]});
 const antes=await cores();
 await p.evaluate(()=>{el('rampaLiga').checked=true;el('rampaLiga').dispatchEvent(new Event('input'));el('rampaCor').value='#2040ff';el('rampaInicio').value='10'});
 const depois=await cores();
 ok(JSON.stringify(depois[0])===JSON.stringify(antes[0]),'rampa não muda o começo '+JSON.stringify([antes[0],depois[0]]));
 ok(depois[1][2]>antes[1][2]+20,'rampa azula o fim '+JSON.stringify([antes[1],depois[1]]));
 await p.evaluate(()=>{el('presetName').value='choque azul';window.confirm=()=>true;el('keep').onclick()});
 const salvo=await p.evaluate(()=>storedTypes().find(t=>t.name==='choque azul'));
 ok(salvo?.values?.rampaLiga==='1'&&salvo.values.rampaCor==='#2040ff','rampa salva no tipo');
 await p.evaluate(()=>{el('kind').value='Impacto';el('kind').oninput({})});
 ok(await p.$eval('#rampaBloco',e=>e.hidden),'rampa some no efeito antigo');
 // Lote: dois tipos com opções de export diferentes; a tela volta ao Impacto com seed 4242.
 await p.evaluate(async()=>{
  const fogo={name:'Fogo Forte',values:{kind:'Explosão'},seed:11,haloEnabled:true,customParticleTint:'#ff781a',linked:true,jogo:{jogoNome:'explosao_forte',jogoTamanho:'150',jogoSoma:'100'}};
  persistTypes([...storedTypes(),fogo]);seed=4242;el('jogoNome').value='minha_tela';
 });
 const telaAntes=await p.evaluate(()=>JSON.stringify([tipoDaTela(),jogoLer()]));
 await p.click('#gameExport summary');await p.click('#jogoLote');
 const marcados=await p.$$eval('#jogoLoteLista input',i=>i.length);
 const [down]=await Promise.all([p.waitForEvent('download'),p.click('#jogoLoteLista button')]);
 const zip=lerZip(fs.readFileSync(await down.path()));
 const pastas=[...new Set(Object.keys(zip).map(k=>k.split('/')[0]))].sort();
 ok(marcados===2&&JSON.stringify(pastas)==='["choque_azul","explosao_forte"]','uma pasta por tipo '+JSON.stringify(pastas));
 const ex=JSON.parse(zip['explosao_forte/efeito.json'].toString());
 ok(ex.soma===1&&Math.abs(ex.pixelScale-1)<1e-6&&/Explosão/.test(ex.video),'cada tipo com as opções de export dele '+JSON.stringify([ex.soma,ex.pixelScale,ex.video]));
 ok(JSON.parse(zip['choque_azul/efeito.json'].toString()).sokonfx.tipo.values.rampaLiga==='1','o choque vai com a rampa');
 ok(await p.evaluate(()=>JSON.stringify([tipoDaTela(),jogoLer()]))===telaAntes,'a tela volta ao que era depois do lote');
 // Curva de tempo: normal não muda; segurar o contato repete o quadro; a livre muda o ritmo.
 const mapa=await p.evaluate(()=>{const r={};const m=()=>[...Array(16).keys()].map(i=>tempoMapa(i,16));
  el('tempoCurva').value='linear';r.normal=m();el('tempoCurva').value='contato';el('tempoContato').value=3;el('tempoSegura').value=4;r.contato=m();
  el('tempoCurva').value='rapido';r.rapido=m();el('tempoCurva').value='livre';el('tempoX1').value=0;el('tempoY1').value=100;el('tempoX2').value=0;el('tempoY2').value=100;r.livre=m();
  el('tempoCurva').value='linear';return r});
 ok(JSON.stringify(mapa.normal)===JSON.stringify([...Array(16).keys()]),'curva normal não muda');
 ok(JSON.stringify(mapa.contato.slice(0,8))==='[0,1,2,3,3,3,3,3]'&&mapa.contato[15]===15&&mapa.contato.every((v,i,a)=>!i||v>=a[i-1]),'segurar o contato '+mapa.contato);
 ok(mapa.rapido[3]>3&&mapa.rapido[15]===15,'rápido no começo '+mapa.rapido);
 ok(mapa.livre[2]>mapa.normal[2],'curva livre '+mapa.livre);
 // Arrastar um ponto no gráfico muda a curva livre.
 await p.click('#tempo summary');await p.selectOption('#tempoCurva','livre');await p.$eval('#tempoGrafico',e=>e.scrollIntoView({block:'center'}));
 const g=await p.$eval('#tempoGrafico',e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width}});
 const antesX=await p.$eval('#tempoX1',e=>e.value);
 await p.mouse.move(g.x+g.w*(18+.3*204)/240,g.y+g.w*(18+.7*204)/240);await p.mouse.down();await p.mouse.move(g.x+g.w*.8,g.y+g.w*.2,{steps:4});await p.mouse.up();
 ok(await p.$eval('#tempoX1',e=>e.value)!==antesX,'arrastar o ponto no gráfico');
 await p.selectOption('#tempoCurva','linear');
 // Caminho do rastro desenhado com o mouse na prévia.
 await p.evaluate(()=>{el('kind').value='Rastro do golpe';el('kind').oninput({})});
 await p.click('#rastroDesenhar');
 const st=await p.$eval('#stage',e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}});
 const lado=Math.min(st.w,st.h),ox=st.x+(st.w-lado)/2,oy=st.y+(st.h-lado)/2;
 await p.mouse.move(ox+lado*.2,oy+lado*.3);await p.mouse.down();
 for(const [fx,fy] of [[.35,.2],[.55,.25],[.7,.45],[.75,.7]])await p.mouse.move(ox+lado*fx,oy+lado*fy,{steps:3});
 await p.mouse.up();
 const pontos=JSON.parse(await p.$eval('#rasPontos',e=>e.value));
 ok(pontos.length>=4&&await p.$eval('#rasCaminho',e=>e.value)==='desenhado','caminho desenhado vira o rasPontos ('+pontos.length+' pontos)');
 // Luz na prévia: com o "luz" do export, a cena clareia em volta do golpe.
 const luz=await p.evaluate(async()=>{el('kind').value='Choque';el('kind').oninput({});el('jogoLuz').checked=true;jogoAtualizar();
  el('gamePreview').open=true;await new Promise(r=>setTimeout(r,50));previa.parado=true;previa.sujo=true;
  const soma=()=>{previaDesenhar(450);const d=palco.getContext('2d').getImageData(0,0,palco.width,palco.height).data;let s=0;for(let i=0;i<d.length;i+=16)s+=d[i]+d[i+1]+d[i+2];return s};
  el('previaLuz').checked=false;const sem=soma();el('previaLuz').checked=true;const com=soma();el('gamePreview').open=false;return {sem,com}});
 ok(luz.com>luz.sem*1.02,'luz do efeito clareia a cena '+JSON.stringify(luz));
 // Alta (2x): a folha sai com o dobro de pixels e o mesmo tamanho no jogo.
 const alta=await p.evaluate(()=>{el('kind').value='Hit (à mão)';el('kind').oninput({});const r={};
  for(const k of ['1','2']){el('jogoAlta').value=k;const {folha,dados}=jogoMontar(jogoOpcoes());r[k]={w:folha.width,ps:dados.pixelScale,alt:dados.altura}}
  el('jogoAlta').value='1';return r});
 ok(alta['2'].w>alta['1'].w*1.8&&Math.abs(alta['2'].ps-alta['1'].ps*2)<1e-6&&Math.abs(alta['2'].alt-alta['1'].alt)<2,'alta 2x: dobro de pixels, mesmo tamanho no jogo '+JSON.stringify(alta));
 // Kit: duas peças (núcleo na frente no golpe; poeira atrás no chão, do quadro 2), em 2x.
 await p.evaluate(async()=>{composicao.camadas=[];composicao.cache.clear();
  el('kind').value='Hit (à mão)';el('kind').oninput({});el('presetName').value='nucleo';composicaoAdicionar(tipoDaTela());await composicaoFila;
  el('kind').value='Poeira';el('kind').oninput({});el('presetName').value='poeira';composicaoAdicionar(tipoDaTela());await composicaoFila;
  Object.assign(composicao.camadas[1],{inicio:2,camada:'atras',ancora:'chao',soma:false});composicao.camadas[0].soma=true;
  el('jogoNome').value='hit_concept';el('jogoAlta').value='2';el('fps').value='24';jogoAtualizar()});
 const antesKit=await p.evaluate(()=>JSON.stringify([tipoDaTela(),composicaoLer().camadas.length]));
 const [dk]=await Promise.all([p.waitForEvent('download'),p.click('#jogoKit')]);
 const zk=lerZip(fs.readFileSync(await dk.path()));
 const kit=JSON.parse(zk['hit_concept/kit.json'].toString());
 ok(kit.formato==='sokonfx-kit-v1'&&kit.pecas.length===2,'kit.json com 2 peças');
 ok(JSON.stringify(kit.pecas[1])===JSON.stringify({efeito:'hit_concept_2',atrasoMs:83,camada:'atras',ancora:'chao'}),'peça do chão '+JSON.stringify(kit.pecas[1]));
 const p1=JSON.parse(zk['hit_concept_1/efeito.json'].toString()),p2=JSON.parse(zk['hit_concept_2/efeito.json'].toString());
 ok(p1.soma===1&&p1.pixelScale===3&&p1.quadros.length===16&&!p2.soma,'peças com soma e alta '+JSON.stringify([p1.soma,p1.pixelScale,p2.soma]));
 ok(p2.quadros.every(q=>q[5]+q[3]<=24),'a poeira fica no chão (até 8 px do mundo abaixo dele) '+JSON.stringify(p2.quadros.map(q=>q[5]+q[3])));
 ok(await p.evaluate(()=>JSON.stringify([tipoDaTela(),composicaoLer().camadas.length]))===antesKit,'a tela e a composição voltam depois do kit');
 ok(erros.length===0,'erros '+erros);
 await b.close();fs.rmSync(tmp,{recursive:true});
 console.log(falhas?`${falhas} falhas`:'editor: tudo certo');process.exit(falhas?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
