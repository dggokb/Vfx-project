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
 ok(erros.length===0,'erros '+erros);
 await b.close();fs.rmSync(tmp,{recursive:true});
 console.log(falhas?`${falhas} falhas`:'editor: tudo certo');process.exit(falhas?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
