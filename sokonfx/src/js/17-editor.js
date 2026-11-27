// Ferramentas do editor (bíblia, "Recursos que o editor também precisa ter"):
//  - Onion skin ("Vizinhos"): o quadro anterior (avermelhado) e o seguinte (esverdeado), apagados,
//    por baixo do quadro na prévia quadrada. Só na prévia; não vai para o export.
//  - Rampa de cor: controles (o desenho está em desenharGerador).
//  - Export em lote: vários tipos salvos num .zip só, cada um com as opções de export dele.

// ---- Vizinhos ----
let onionTela=null;
function onionDesenhar(ctx,i){
 const n=quadrosTotais();
 if(!onionTela){onionTela=document.createElement('canvas');onionTela.width=onionTela.height=512}
 const o=onionTela.getContext('2d');
 for(const [j,cor] of [[i-1,'#ff5a5a'],[i+1,'#5aff9a']]){
  if(j<0||j>=n)continue;
  o.clearRect(0,0,512,512);o.save();desenharQuadro(o,j);o.restore();
  o.save();o.globalCompositeOperation='source-atop';o.fillStyle=cor;o.globalAlpha=.55;o.fillRect(0,0,512,512);o.restore();
  ctx.save();ctx.globalAlpha=.32;ctx.drawImage(onionTela,0,0);ctx.restore();
 }
}
el('onion').onclick=()=>{const liga=el('onion').getAttribute('aria-pressed')!=='true';el('onion').setAttribute('aria-pressed',String(liga));preview()};

// ---- Rampa de cor ----
el('rampaLiga').addEventListener('input',()=>{el('rampaLiga').value=el('rampaLiga').checked?'1':'';preview()});
el('rampaCor').addEventListener('input',preview);
el('rampaInicio').addEventListener('input',()=>{el('rampaInicioValor').value=el('rampaInicio').value+'%';preview()});
// Dissolução e sombra no chão (acabamentos dos geradores novos; o desenho está em 09a-geradores.js).
for(const id of ['dissLiga','dissBorda','sombraLiga'])el(id).addEventListener('input',()=>{el(id).value=el(id).checked?'1':'';preview()});
for(const [id,un] of [['dissInicio','%'],['sombraY',''],['sombraForca','%']])el(id).addEventListener('input',()=>{el(id+'Valor').value=el(id).value+un;preview()});

// ---- Export em lote ----

// O nome da pasta de um tipo: o que ele guardou no export, ou o nome dele sem acento e espaço.
function loteNome(tipo,usados){
 let base=(tipo.jogo?.jogoNome||tipo.name||tipo.values?.kind||'efeito').normalize('NFD').replace(/[̀-ͯ]/g,'')
  .toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')||'efeito';
 let nome=base,k=2;while(usados.has(nome))nome=base+'_'+(k++);
 usados.add(nome);return nome;
}

el('jogoLote').onclick=()=>{
 const lista=el('jogoLoteLista'),tipos=storedTypes();
 lista.textContent='';
 if(!tipos.length){lista.hidden=false;lista.textContent='Nenhum tipo salvo neste navegador.';return}
 for(const t of tipos){
  const l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.checked=true;c.value=t.name;
  l.append(c,' '+t.name+(t.composicao?' (composição)':''));lista.append(l);
 }
 const b=document.createElement('button');b.type='button';b.className='primary';b.textContent='Baixar os marcados';
 b.onclick=()=>loteExportar([...lista.querySelectorAll('input:checked')].map(c=>tipos.find(t=>t.name===c.value)).filter(Boolean));
 lista.append(b);lista.hidden=false;
};

async function loteExportar(tipos){
 if(!tipos.length){el('jogoStatus').value='Marque pelo menos um tipo.';return}
 // Guarda a tela inteira (tipo, export, composição) para devolver no fim.
 const tela=tipoDaTela(),exportar=jogoLer(),comp=composicaoLer(),nomeTela=el('presetName').value,status=el('presetStatus').textContent;
 const arquivos=[],usados=new Set(),feitos=[];
 el('jogoStatus').value=`Montando ${tipos.length} efeitos…`;
 try{
  for(const t of tipos){
   await aplicarTipo(t);
   composicaoAplicar(t.composicao||null);await composicaoFila;
   const nome=loteNome(t,usados);el('jogoNome').value=nome;
   const {folha,dados}=jogoMontar({...jogoOpcoes(),nome});
   jogoSemPaleta(folha);
   const webp=await new Promise(r=>folha.toBlob(r,'image/webp',1));
   if(!webp||webp.type!=='image/webp')throw Error('este navegador não grava WebP (use o Chrome)');
   arquivos.push({nome:nome+'/folha.webp',dados:new Uint8Array(await webp.arrayBuffer())},{nome:nome+'/efeito.json',dados:new TextEncoder().encode(JSON.stringify(dados,null,1)+'\n')});
   feitos.push(nome);
  }
  const zip=jogoZip(arquivos),url=URL.createObjectURL(zip),a=document.createElement('a');
  a.href=url;a.download='sokonfx_lote.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
  el('jogoStatus').value=`sokonfx_lote.zip: ${feitos.join(', ')}. Solte as pastas em assets/efeitos/.`;
 }catch(e){el('jogoStatus').value='Não exportou o lote: '+e.message}
 finally{
  await aplicarTipo(tela,{jogo:false});jogoAplicar(exportar);composicaoAplicar(comp);await composicaoFila;
  el('presetName').value=nomeTela;el('presetStatus').textContent=status;el('jogoLoteLista').hidden=true;preview();
 }
}

// ---- Caminho do rastro desenhado com o dedo ----
// Botão na prévia: arrasta o dedo (ou o mouse) e o caminho vira o rasPontos do Rastro do golpe, no
// espaço do gerador (centro do quadro, desfazendo a Direção, para o rastro cair onde se desenhou).
let rastroDesenhando=null;
el('rastroDesenhar').onclick=()=>{
 rastroDesenhando=rastroDesenhando?null:[];
 el('rastroDesenhar').textContent=rastroDesenhando?'Arraste na prévia o caminho do golpe · cancelar':'Desenhar o caminho na prévia';
 if(rastroDesenhando&&playing)el('play').onclick();
};
stage.addEventListener('pointerdown',e=>{
 if(!rastroDesenhando)return;
 e.preventDefault();e.stopImmediatePropagation();stage.setPointerCapture(e.pointerId);rastroDesenhando=[canvasPoint(e)];
},true);
stage.addEventListener('pointermove',e=>{if(rastroDesenhando?.length){const p=canvasPoint(e),u=rastroDesenhando.at(-1);if(Math.hypot(p.x-u.x,p.y-u.y)>6)rastroDesenhando.push(p)}});
stage.addEventListener('pointerup',()=>{
 if(!rastroDesenhando?.length)return;
 const a=-+el('angle').value*Math.PI/180,pts=rastroDesenhando.map(p=>{const x=p.x-256,y=p.y-256;return [Math.round(x*Math.cos(a)-y*Math.sin(a)),Math.round(x*Math.sin(a)+y*Math.cos(a))]});
 rastroDesenhando=null;el('rastroDesenhar').textContent='Desenhar o caminho na prévia';
 if(pts.length<2)return;
 el('rasPontos').value=JSON.stringify(pts);el('rasCaminho').value='desenhado';preview();
});

// Depois de abrir um tipo: os números dos acabamentos e o gráfico da curva de tempo seguem os campos.
function acabamentosAtualizar(){
 for(const id of ['rampaLiga','dissLiga','dissBorda','sombraLiga']){const e=el(id);e.checked=e.value==='1'||e.value==='true'}
 for(const [id,un] of [['rampaInicio','%'],['dissInicio','%'],['sombraY',''],['sombraForca','%']])el(id+'Valor').value=el(id).value+un;
 tempoDesenharGrafico();
}

// ---- Export em peças (kit) ----
// Cada camada visível da composição vira uma pasta (o desenho dela com posição, tamanho, giro,
// espelho e opacidade já aplicados, no tamanho e na resolução do export), e o kit.json diz ao jogo
// como tocar: quando cada peça entra (atrasoMs), se vai na frente ou atrás dos lutadores e se nasce
// na ponta do golpe ou no chão sob quem apanha. Peça que soma vai com "soma": 1.
function kitPecaDesenho(c){
 return (ctx,i)=>{
  const k=ctx.getTransform().a,L=Math.round(512*k),t=document.createElement('canvas');t.width=t.height=L;const x=t.getContext('2d');x.scale(k,k);draw(x,i);
  ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,c.opacidade/100));ctx.translate(256+c.dx,256+c.dy);ctx.rotate(c.angulo*Math.PI/180);
  const e=c.escala/100;ctx.scale(c.espelhar?-e:e,e);ctx.translate(-256,-256);ctx.drawImage(t,0,0,512,512);ctx.restore();
 };
}
async function kitExportar(){
 const camadas=composicao.camadas.filter(c=>!c.oculta);
 if(!camadas.length){el('jogoStatus').value='Monte uma composição primeiro (Composição de camadas).';return}
 const op=jogoOpcoes();
 if(!jogoNomeValido(op.nome)){el('jogoStatus').value='Nome só com letras minúsculas, números e _ (é o nome do kit no jogo).';return}
 const tela=tipoDaTela(),exportar=jogoLer(),ativa=composicao.ativa,nomeTela=el('presetName').value,status=el('presetStatus').textContent;
 const arquivos=[],pecas=[];
 el('jogoStatus').value=`Montando ${camadas.length} peças…`;
 try{
  composicao.ativa=false;
  for(const [n,c] of camadas.entries()){
   await aplicarTipo(c.tipo,{jogo:false});
   const g=geradores[c.tipo.values.kind],nome=`${op.nome}_${n+1}`;
   // No chão: a origem da peça é o chão do desenho dela (a origem do gerador), não o ponto do golpe.
   const origem=c.ancora==='chao'?{origemX:256+c.dx,origemY:(g?.origem?.y??256)+c.dy}:{};
   const {folha,dados}=jogoMontar({...op,...origem,nome,inicio:0,fim:frames-1,segurar:-1,soma:c.soma?1:op.soma,luz:n===0?op.luz:null,
    desenhar:kitPecaDesenho(c),descricao:`Sōkon FX: peça ${n+1} do kit ${op.nome} (${c.nome})`});
   jogoSemPaleta(folha);
   const webp=await new Promise(r=>folha.toBlob(r,'image/webp',1));
   if(!webp||webp.type!=='image/webp')throw Error('este navegador não grava WebP (use o Chrome)');
   arquivos.push({nome:nome+'/folha.webp',dados:new Uint8Array(await webp.arrayBuffer())},{nome:nome+'/efeito.json',dados:new TextEncoder().encode(JSON.stringify(dados,null,1)+'\n')});
   pecas.push({efeito:nome,atrasoMs:Math.round(c.inicio*1000/op.fps),camada:c.camada||'frente',ancora:c.ancora||'golpe'});
  }
  const kit={formato:'sokonfx-kit-v1',nome:op.nome,pecas,fonte:'Sōkon FX'};
  arquivos.push({nome:op.nome+'/kit.json',dados:new TextEncoder().encode(JSON.stringify(kit,null,1)+'\n')});
  const zip=jogoZip(arquivos),url=URL.createObjectURL(zip),a=document.createElement('a');
  a.href=url;a.download=op.nome+'_kit.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
  el('jogoStatus').value=`${op.nome}_kit.zip: ${pecas.length} peças e o kit.json. Solte todas as pastas em assets/efeitos/.`;
 }catch(e){el('jogoStatus').value='Não exportou o kit: '+e.message}
 finally{
  await aplicarTipo(tela,{jogo:false});jogoAplicar(exportar);composicao.ativa=ativa;el('compAtiva').checked=ativa;
  el('presetName').value=nomeTela;el('presetStatus').textContent=status;composicaoMudou();
 }
}
el('jogoKit').onclick=kitExportar;
