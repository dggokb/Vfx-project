// Trava o visual: o Sōkon FX montado do src tem de desenhar cada caso (casos.cjs) pixel a pixel
// igual à referência aprovada (testes/referencia/SokonFX.html), no mesmo navegador.
//   node sokonfx/testes/pixels.test.cjs
// Mudou um gerador de propósito e o dono aprovou? Copie o dist novo para a referência e anote.
// As fumaças que estão no jogo (tipos/jogo_fumacas_s4.json, feitas no SokonFX_4 do jogo) entram
// como tipo salvo: sem "smokeForm" (o controle é mais novo que elas) caem no Linear, como foram feitas.
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),os=require('os');
const {renderizar,diferenca}=require('./render.cjs');
const casos=require('./casos.cjs');

const raiz=path.join(__dirname,'..');
const referencia=path.join(__dirname,'referencia','SokonFX.html');
const s4=JSON.parse(fs.readFileSync(path.join(raiz,'tipos','jogo_fumacas_s4.json'),'utf8'))
 .map(t=>({nome:'jogo '+t.nome,modo:'tipo',valores:t.valores,seed:t.seed}));

(async()=>{
 const {montar}=await import(path.join(raiz,'build.mjs'));
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'sokonfx-'));
 const atual=path.join(tmp,'SokonFX.html');fs.writeFileSync(atual,montar());
 const b=await chromium.launch();
 const todos=[...casos,...s4];
 let falhas=0,feitos=0;
 const fila=[...todos];
 async function trabalhador(){
  for(let caso;(caso=fila.shift());){
   const [a,r]=await Promise.all([renderizar(b,atual,caso),renderizar(b,referencia,caso)]);
   const ruins=a.map((h,i)=>h===r[i]?-1:i).filter(i=>i>=0);
   if(ruins.length){
    falhas++;
    const d=await diferenca(b,atual,referencia,caso,ruins[0]);
    console.log(`FALHOU ${caso.nome}: quadros ${ruins.join(',')} diferentes (quadro ${ruins[0]}: ${d.pixels} px, até ${d.max})`);
   }
   feitos++;
  }
 }
 await Promise.all([...Array(4)].map(trabalhador));
 await b.close();fs.rmSync(tmp,{recursive:true});
 console.log(`${feitos} casos, ${falhas} com diferença`);
 process.exit(falhas?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
