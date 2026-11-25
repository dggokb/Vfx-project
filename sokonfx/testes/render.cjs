// Renderiza casos do Sōkon FX num Chromium sem tela e devolve os pixels de cada quadro.
// Um caso: {nome, modo:'tipo'|'gerar', valores:{id: valor}, seed, halo?, linked?, custom?}
//  - 'tipo'  carrega como "Tipos salvos" da própria página (o caminho do usuário);
//  - 'gerar' aplica controle a controle, como o art/vfx/sokon/gerar.js do jogo.
const {chromium}=require('playwright');
const path=require('path');

async function abrir(browser,html){
 const p=await browser.newPage();
 const erros=[];p.on('pageerror',e=>erros.push(e.message));
 await p.goto('file://'+path.resolve(html));
 await p.evaluate(()=>localStorage.clear());
 await p.evaluate(()=>{playing=false});
 return {p,erros};
}

// Cada caso numa página recém-aberta: a ferramenta guarda estado entre trocas de tipo (perfis,
// aparências), e o teste não pode depender da ordem dos casos.
async function renderizar(browser,html,caso){
 const {p,erros}=await abrir(browser,html);
 try{return await desenhar(p,caso)}
 finally{await p.close();if(erros.length)throw Error(caso.nome+': '+erros.join('; '))}
}

function desenhar(p,caso){
 return p.evaluate(caso=>{
  const el=id=>document.getElementById(id);
  playing=false;
  if(caso.modo==='gerar'){
   if(caso.valores.kind){el('kind').value=caso.valores.kind;el('kind').oninput({});}
   for(const [id,v] of Object.entries(caso.valores)){
    if(id==='kind')continue;
    const e=el(id);if(!e)continue;
    if(e.type==='checkbox')e.checked=v;else e.value=v;
    if(e.oninput)e.oninput();else if(e.onchange)e.onchange();
   }
   seed=caso.seed;
  }else{
   const preset={name:'__caso',values:caso.valores,seed:caso.seed,haloEnabled:caso.halo??true,
    customParticleTint:caso.custom??'#ff781a',linked:caso.linked??true};
   persistTypes([preset]);showTypes([preset]);
   el('savedTypes').value='__caso';el('savedTypes').onchange();
   playing=false;
  }
  const quadros=caso.quadros??[...Array(16).keys()];
  return Promise.all(quadros.map(async i=>{
   const c=document.createElement('canvas');c.width=c.height=512;
   const ctx=c.getContext('2d');draw(ctx,i);
   const px=ctx.getImageData(0,0,512,512).data;
   if(caso.bruto){let s='';for(let k=0;k<px.length;k+=8192)s+=String.fromCharCode.apply(null,px.subarray(k,k+8192));return btoa(s);}
   const d=new Uint8Array(await crypto.subtle.digest('SHA-256',px));
   return [...d.slice(0,8)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }));
 },caso);
}

// Quantos pixels diferem (algum canal com diferença > tolerancia) num quadro, entre duas páginas.
async function diferenca(browser,htmlA,htmlB,caso,i,tolerancia=0){
 const a=Buffer.from((await renderizar(browser,htmlA,{...caso,quadros:[i],bruto:true}))[0],'base64');
 const b=Buffer.from((await renderizar(browser,htmlB,{...caso,quadros:[i],bruto:true}))[0],'base64');
 let n=0,max=0;
 for(let k=0;k<a.length;k+=4){let m=0;for(let c=0;c<4;c++)m=Math.max(m,Math.abs(a[k+c]-b[k+c]));if(m>tolerancia)n++;max=Math.max(max,m);}
 return {pixels:n,max};
}

module.exports={abrir,renderizar,diferenca};
