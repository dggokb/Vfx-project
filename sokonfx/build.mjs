// Monta o Sōkon FX num HTML único, que abre offline no PC e no celular:
//   node sokonfx/build.mjs            -> sokonfx/dist/SokonFX.html
//   node sokonfx/build.mjs --conferir -> falha se o dist não for o que o src gera
// src/pagina.html tem a marcação; src/estilo.css o estilo; src/js/*.js o código, juntado em
// ordem de nome num <script> só (as funções de um arquivo enxergam as dos outros);
// ASSET("arquivo") vira a imagem de src/assets embutida como data URL.
import {readFileSync,writeFileSync,readdirSync,mkdirSync} from 'node:fs';
import {dirname,join,extname} from 'node:path';
import {fileURLToPath} from 'node:url';

const raiz=dirname(fileURLToPath(import.meta.url));
const src=join(raiz,'src');
const tipos={'.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg'};

export function montar(){
 const ler=f=>readFileSync(join(src,f),'utf8');
 const js=readdirSync(join(src,'js')).filter(f=>f.endsWith('.js')).sort().map(f=>ler('js/'+f)).join('')
  .replace(/ASSET\("([^"]+)"\)/g,(_,nome)=>{
   const tipo=tipos[extname(nome).toLowerCase()];
   if(!tipo)throw Error('asset sem tipo conhecido: '+nome);
   return JSON.stringify(`data:${tipo};base64,`+readFileSync(join(src,'assets',nome)).toString('base64'));
  });
 const pagina=ler('pagina.html');
 for(const marca of ['{{ESTILO}}','{{SCRIPT}}'])
  if(pagina.split(marca).length!==2)throw Error('pagina.html precisa de exatamente um '+marca);
 return pagina.replace('{{ESTILO}}',()=>ler('estilo.css')).replace('{{SCRIPT}}',()=>js);
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
 const saida=join(raiz,'dist','SokonFX.html');
 const html=montar();
 if(process.argv.includes('--conferir')){
  let atual='';try{atual=readFileSync(saida,'utf8')}catch{}
  if(atual!==html){console.error('dist/SokonFX.html está desatualizado: rode node sokonfx/build.mjs');process.exit(1)}
  console.log('dist/SokonFX.html em dia');
 }else{
  mkdirSync(dirname(saida),{recursive:true});writeFileSync(saida,html);
  console.log('gerado',saida,(html.length/1024).toFixed(0)+' KB');
 }
}
