// Confere os geradores novos na interface: cada um mostra só os controles dele; voltar para um
// efeito antigo devolve o painel antigo como era; o export e a prévia no jogo funcionam com eles.
//   node sokonfx/testes/geradores.test.cjs
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),os=require('os');
const raiz=path.join(__dirname,'..');
let falhas=0;
const ok=(cond,msg)=>{if(!cond){falhas++;console.log('FALHOU',msg)}};
(async()=>{
 const {montar}=await import(path.join(raiz,'build.mjs'));
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'sokonfx-ger-'));
 const html=path.join(tmp,'SokonFX.html');fs.writeFileSync(html,montar());
 const b=await chromium.launch();const p=await b.newPage();
 const erros=[];p.on('pageerror',e=>erros.push(e.message));
 await p.goto('file://'+html);
 const visiveis=()=>p.evaluate(()=>[...el('ajustes').querySelectorAll('label,button,details,.gerador-params')].filter(e=>e.offsetParent!==null).map(e=>e.id||e.textContent.trim().slice(0,30)).join('|'));
 const troca=k=>p.evaluate(k=>{el('kind').value=k;el('kind').oninput({})},k);
 const novos=await p.evaluate(()=>Object.keys(geradores));
 ok(JSON.stringify(novos)==='["Defesa","Choque","Raio","Linhas de mangá","Aura","Detritos","Explosão","Onda de choque","Faíscas","Gelo","Vento e vórtices","Feixe de energia","Teletransporte","Portal","Gases e vapores","Energia sombria","Decal (marca no chão)","Rastro do golpe","Poeira","Partículas","Brilhos e flashes","Energia espiritual"]','geradores registrados '+novos);
 for(const antigo of ['Impacto','Fumaça','Pressão de ar','Ponto de luz']){
  await troca(antigo);const antes=await visiveis();
  for(const novo of novos){
   await troca(novo);
   const painel=await p.evaluate(k=>[...document.querySelectorAll('.gerador-params')].filter(c=>!c.hidden).map(c=>c.dataset.gerador),novo);
   ok(JSON.stringify(painel)===JSON.stringify([novo]),`${novo}: só o painel dele (${painel})`);
   ok(!(await p.$eval('#styleMix',e=>e.offsetParent!==null)),`${novo}: controles antigos escondidos`);
   ok(await p.$eval('#tint',e=>e.offsetParent!==null)&&await p.$eval('#power',e=>e.offsetParent!==null),`${novo}: cor e intensidade à vista`);
  }
  await troca(antigo);
  ok(await visiveis()===antes,`${antigo}: o painel volta igual depois dos geradores novos`);
 }
 // Export e prévia no jogo com um gerador novo.
 for(const novo of novos){
  await troca(novo);
  const r=await p.evaluate(()=>{const {folha,dados}=jogoMontar(jogoOpcoes());return {w:folha.width,h:folha.height,q:dados.quadros.length,vazios:dados.quadros.filter(q=>q[2]===1&&q[3]===1).length}});
  ok(r.q===16&&r.w>50&&r.h>50,`${novo}: export monta a folha ${JSON.stringify(r)}`);
  // Nada encosta na borda do quadro de 512 (a borda da folha cortaria o desenho no jogo).
  const borda=await p.evaluate(()=>{let pior=0;for(let i=0;i<16;i++){const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');draw(x,i);
   const d=x.getImageData(0,0,512,512).data;for(let k=0;k<512;k++)for(const [px,py] of [[k,0],[k,511],[0,k],[511,k]])pior=Math.max(pior,d[(py*512+px)*4+3])}return pior});
  ok(borda<=10,`${novo}: nada na borda do quadro (alfa ${borda})`);
 }
 // Nada na borda em nenhuma variação dos geradores novos (os casos da trava de pixels).
 const casos=require('./casos.cjs').filter(c=>novos.includes(c.valores.kind));
 for(const caso of casos){
  const borda=await p.evaluate(async c=>{await aplicarTipo({name:c.nome,values:c.valores,seed:c.seed,haloEnabled:true,customParticleTint:'#ff781a',linked:true});let pior=0;
   for(let i=0;i<16;i++){const k=document.createElement('canvas');k.width=k.height=512;const x=k.getContext('2d');draw(x,i);
    const d=x.getImageData(0,0,512,512).data;for(let j=0;j<512;j++)for(const [px,py] of [[j,0],[j,511],[0,j],[511,j]])pior=Math.max(pior,d[(py*512+px)*4+3])}return pior},caso);
  ok(borda<=10,`${caso.nome}: nada na borda (alfa ${borda})`);
 }
 // A aura é um laço: o quadro depois do último (16) é igual ao primeiro, com e sem dois em dois.
 await troca('Aura');
 for(const dois of ['1','']){
  const igual=await p.evaluate(d=>{el('auDois').value=d;const h=i=>{const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');draw(x,i);return c.toDataURL()};return h(0)===h(16)},dois);
  ok(igual,'aura fecha o laço (dois em dois: '+(dois?'sim':'não')+')');
 }
 ok(erros.length===0,'erros '+erros);
 await b.close();fs.rmSync(tmp,{recursive:true});
 console.log(falhas?`${falhas} falhas`:'geradores novos: tudo certo');
 process.exit(falhas?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
