// Confere o gerador Arcadia (partículas): o editor de partículas Arcadia embutido no Sōkon.
//   node sokonfx/testes/arcadia.test.cjs
// - o campo vazio desenha o hit forte do Sōkon (modelo de fábrica), com as faixas de cor chapadas;
// - o mesmo quadro sai igual, desenhado de novo depois de outro (simulação determinística);
// - o editor abre por cima com o hit, uma mudança nele volta em "Usar no Sōkon" e muda o desenho;
// - o tipo salvo guarda o efeito e volta igual; o export monta os 16 quadros;
// - nenhum erro na página nem dentro do quadro do editor.
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),os=require('os');
const raiz=path.join(__dirname,'..');
let falhas=0;
const ok=(cond,msg)=>{if(!cond){falhas++;console.log('FALHOU',msg)}};
(async()=>{
 const {montar}=await import(path.join(raiz,'build.mjs'));
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'sokonfx-arc-'));
 const html=path.join(tmp,'SokonFX.html');fs.writeFileSync(html,montar());
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});
 const erros=[];p.on('pageerror',e=>erros.push(e.message));
 await p.goto('file://'+html);
 await p.evaluate(async()=>{el('kind').value='Arcadia (partículas)';el('kind').oninput({});await arcadiaEsperar();
  const W=arcadia.janela;W.__erros=[];W.addEventListener('error',e=>W.__erros.push(e.message))});
 const quadro=i=>p.evaluate(i=>{const c=document.createElement('canvas');c.width=c.height=512;draw(c.getContext('2d'),i);return c.toDataURL()},i);
 const cores=i=>p.evaluate(i=>{const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');draw(x,i);
  const d=x.getImageData(0,0,512,512).data,conta=new Map();let cheios=0;
  for(let k=0;k<d.length;k+=4){if(d[k+3]<255)continue;cheios++;const h=(d[k]<<16)|(d[k+1]<<8)|d[k+2];conta.set(h,(conta.get(h)||0)+1)}
  return {cheios,faixas:[...conta.values()].filter(n=>n>400).length}},i);

 // Modelo: o hit do Sōkon.
 const modelo=await p.evaluate(()=>{const e=arcadiaEfeito(el('arcEfeito').value);return e&&e.doc.id+'|'+e.doc.name});
 ok(modelo==='fx_sokon_hit|Sōkon — Hit forte','campo vazio = hit do Sōkon ('+modelo+')');
 // Os modelos do jogo (vendor/arcadia/sokon/*.json) no topo da lista de fábrica, e cada um desenha.
 const fabrica=await p.evaluate(()=>{const A=arcadia.janela.AFX;return A.Factory.filter(f=>f.sokon).map(f=>{const d=f.build(),e=new A.Engine(),c=arcadia.janela.document.createElement('canvas');
  c.width=d.comp.w;c.height=d.comp.h;const x=c.getContext('2d');e.render(d,.08,x);const px=x.getImageData(0,0,c.width,c.height).data;let n=0;for(let k=3;k<px.length;k+=4)if(px[k]>40)n++;return f.id+':'+(n>3000)})});
 ok(JSON.stringify(fabrica)==='["fx_sokon_ouro:true","fx_sokon_ouro_anel:true","fx_sokon_ouro_forte:true","fx_sokon_ouro_fraco:true","fx_sokon_ouro_medio:true","fx_sokon_hit:true"]','modelos do jogo na fábrica '+fabrica);
 const pico=await cores(2);
 ok(pico.cheios>20000,'o hit enche o quadro no pico ('+pico.cheios+' px)');
 ok(pico.faixas>=4,'faixas de cor chapadas no pico ('+pico.faixas+')');
 ok((await cores(15)).cheios<pico.cheios/4,'o hit se desfaz até o último quadro');
 // Determinismo: o quadro 3 sai igual depois de desenhar o 12.
 const q3=await quadro(3);await quadro(12);
 ok(q3===await quadro(3),'o mesmo quadro sai igual desenhado de novo');

 // Editor: abre com o hit; desligar o anel e usar no Sōkon muda o campo e o desenho.
 await p.click('#arcadiaAbrir');
 await p.waitForFunction(()=>arcadia.janela&&arcadia.janela.AFX.state.doc&&arcadia.janela.AFX.state.doc.id==='fx_sokon_hit');
 ok(await p.evaluate(()=>el('arcadiaEditor').classList.contains('aberto')&&getComputedStyle(el('arcadiaEditor')).visibility==='visible'),'o editor abre por cima');
 const lingua=await p.evaluate(()=>[arcadia.janela.AFX.lang,!!arcadia.janela.AFX_PT]);
 if(lingua[1])ok(lingua[0]==='pt','o editor começa em português ('+lingua[0]+')');
 await p.evaluate(()=>{const W=arcadia.janela,l=W.AFX.state.doc.layers.find(l=>l.id==='lr_sk_arc');l.on=false;W.AFX.touchAll()});
 await p.click('#arcadiaUsar');
 ok(await p.evaluate(()=>!el('arcadiaEditor').classList.contains('aberto')),'Usar no Sōkon fecha o editor');
 ok(await p.evaluate(()=>JSON.parse(el('arcEfeito').value).doc.layers.find(l=>l.id==='lr_sk_arc').on===false),'a mudança do editor vai para o campo');
 const semAnel=await quadro(6);
 ok(semAnel!==await p.evaluate(()=>{const v=el('arcEfeito').value;el('arcEfeito').value='';const c=document.createElement('canvas');c.width=c.height=512;draw(c.getContext('2d'),6);el('arcEfeito').value=v;return c.toDataURL()}),'o desenho muda com o efeito editado');

 // Tipo salvo: guarda o efeito, volta igual e exporta os 16 quadros.
 const tipo=await p.evaluate(()=>({name:'arc_teste',...jogoTipoAtual()}));
 await p.evaluate(async t=>{el('arcEfeito').value='';el('kind').value='Impacto';el('kind').oninput({});await aplicarTipo(t)},tipo);
 ok(await quadro(6)===semAnel,'o tipo salvo volta com o efeito editado');
 const ex=await p.evaluate(()=>{const {folha,dados}=jogoMontar(jogoOpcoes());return {q:dados.quadros.length,vazios:dados.quadros.filter(q=>q[2]===1&&q[3]===1).length,w:folha.width}});
 ok(ex.q===16&&ex.vazios<=2&&ex.w>100,'export monta a folha '+JSON.stringify(ex));
 // Voltar ao hit do Sōkon esvazia o campo.
 await p.click('#arcadiaModelo');
 ok(await p.evaluate(()=>el('arcEfeito').value==='')&&await quadro(3)===q3,'Voltar ao hit do Sōkon');

 const dentro=await p.evaluate(()=>arcadia.janela.__erros);
 ok(erros.length===0,'erros na página: '+erros);
 ok(dentro.length===0,'erros no editor: '+dentro);
 await b.close();fs.rmSync(tmp,{recursive:true});
 console.log(falhas?`${falhas} falhas`:'arcadia: tudo certo');
 process.exit(falhas?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
