// Monta o Sōkon FX num HTML único, que abre offline no PC e no celular:
//   node sokonfx/build.mjs            -> sokonfx/dist/SokonFX.html
//   node sokonfx/build.mjs --conferir -> falha se o dist não for o que o src gera
// src/pagina.html tem a marcação; src/estilo.css o estilo; src/js/*.js o código, juntado em
// ordem de nome num <script> só (as funções de um arquivo enxergam as dos outros);
// ASSET("arquivo") vira a imagem de src/assets embutida como data URL.
// ARCADIA_PAGINA() vira a página inteira do editor de partículas Arcadia (vendor/arcadia, MIT),
// com CSS e scripts embutidos: o gerador Partículas a abre num quadro isolado (iframe srcdoc).
import {readFileSync,writeFileSync,readdirSync,mkdirSync,existsSync} from 'node:fs';
import {dirname,join,extname} from 'node:path';
import {fileURLToPath} from 'node:url';

const raiz=dirname(fileURLToPath(import.meta.url));
const src=join(raiz,'src');
const tipos={'.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg'};

// A página do Arcadia num texto só: o CSS e cada <script src> entram inline, e a tradução
// para o português (js/core/i18n-pt.js, nossa) entra logo antes do i18n.js.
export function montarArcadia(){
 const pasta=join(raiz,'vendor','arcadia');
 const ler=f=>readFileSync(join(pasta,f),'utf8');
 const seguro=t=>t.replace(/<\/(script)/gi,'<\\/$1');
 let html=ler('index.html').replace('<link rel="stylesheet" href="css/editor.css">',()=>'<style>'+ler('css/editor.css')+'</style>');
 let scripts=0;
 html=html.replace(/<script src="([^"]+)"><\/script>/g,(_,f)=>{
  scripts++;
  const pt=f==='js/core/i18n.js'&&existsSync(join(pasta,'js/core/i18n-pt.js'))?'<script>'+seguro(ler('js/core/i18n-pt.js'))+'</script>\n':'';
  // Depois dos modelos de fábrica dele, os nossos (vendor/arcadia/sokon/*.json).
  if(f==='js/core/fxpresets.js'&&ler('js/core/sokon-modelos.js').split('SOKON_MODELOS()').length!==2)throw Error('sokon-modelos.js precisa de exatamente um SOKON_MODELOS()');
  const sokon=f==='js/core/fxpresets.js'?'\n<script>'+seguro(ler('js/core/sokon-modelos.js').replace('SOKON_MODELOS()',()=>JSON.stringify(
   readdirSync(join(pasta,'sokon')).filter(n=>n.endsWith('.json')).sort().map(n=>JSON.parse(ler('sokon/'+n))))))+'</script>':'';
  return pt+'<script>'+seguro(ler(f))+'</script>'+sokon;
 });
 if(scripts<20)throw Error('vendor/arcadia/index.html: só '+scripts+' scripts encontrados');
 if(/<(script|link)[^>]+(src|href)=/.test(html))throw Error('vendor/arcadia: sobrou recurso externo na página');
 return html;
}

export function montar(){
 const ler=f=>readFileSync(join(src,f),'utf8');
 const js=readdirSync(join(src,'js')).filter(f=>f.endsWith('.js')).sort().map(f=>ler('js/'+f)).join('')
  .replace(/ASSET\("([^"]+)"\)/g,(_,nome)=>{
   const tipo=tipos[extname(nome).toLowerCase()];
   if(!tipo)throw Error('asset sem tipo conhecido: '+nome);
   return JSON.stringify(`data:${tipo};base64,`+readFileSync(join(src,'assets',nome)).toString('base64'));
  })
  // Todo "<" vira \u003C: a página do Arcadia não pode fechar o <script> do Sōkon por engano.
  .replace(/ARCADIA_PAGINA\(\)/g,()=>JSON.stringify(montarArcadia()).replace(/</g,'\\u003C'));
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
