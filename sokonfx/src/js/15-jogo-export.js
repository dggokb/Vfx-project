// Exportar para o jogo: a pasta que o jogo lê em assets/efeitos/<nome>/ (EfeitosVideo.ler):
// folha.webp (os quadros recortados, em prateleiras) e efeito.json (onde cada quadro está na folha,
// onde o canto dele fica em relação à origem, quanto tempo dura, a escala e a luz). Segue o que o
// tools/sprites/efeito_video.py do jogo grava, para o efeito entrar sem conversão.

const JOGO_LARGURA_FOLHA=2048,JOGO_LADO_MAX=4096,JOGO_LIMIAR_ALFA=10;
// 1x no jogo = o tamanho dos impactos v09 (o canvas de 512 com pixelScale 1,5).
const JOGO_PIXEL_SCALE_1X=1.5;
const jogoCampos=['jogoNome','jogoOrigemX','jogoOrigemY','jogoTamanho','jogoResolucao','jogoAlta','jogoInicio','jogoFim',
 'jogoSegurar','jogoSegurarMs','jogoBrilho','jogoSoma','jogoLuz','jogoLuzCor','jogoLuzAlcance','jogoLuzForca'];

// ---- Partes puras (sem página): testadas em testes/export.test.cjs ----

// Reforço do brilho: alfa' = alfa^(1/(1+v)), v de 0 a 1. Com 1 dá alfa^0,5, o reforço que os
// impactos v09 receberam à mão.
function jogoCurvaAlfa(px,reforco){
 if(!(reforco>0))return px;
 const e=1/(1+reforco),tabela=new Uint8ClampedArray(256);
 for(let a=0;a<256;a++)tabela[a]=Math.round(255*Math.pow(a/255,e));
 for(let i=3;i<px.length;i+=4)px[i]=tabela[px[i]];
 return px;
}

// A caixa do que aparece (alfa acima do limiar): [x0,y0,x1,y1) ou null se o quadro é vazio.
function jogoCaixa(px,largura,altura,limiar=JOGO_LIMIAR_ALFA){
 let x0=largura,y0=altura,x1=-1,y1=-1;
 for(let y=0;y<altura;y++){
  const linha=y*largura*4;
  for(let x=0;x<largura;x++)if(px[linha+x*4+3]>limiar){
   if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;y1=y;
  }
 }
 return x1<0?null:[x0,y0,x1+1,y1+1];
}

// Prateleiras: lado a lado até a largura da folha, depois a linha de baixo (2 px entre eles).
function jogoEmpacotar(tamanhos,largura=JOGO_LARGURA_FOLHA){
 let x=0,y=0,linha=0;const lugares=[];
 for(const [w,h] of tamanhos){
  if(x+w>largura){x=0;y+=linha+2;linha=0}
  lugares.push([x,y]);x+=w+2;linha=Math.max(linha,h);
 }
 const W=Math.max(1,...tamanhos.map(([w],i)=>lugares[i][0]+w));
 const H=Math.max(1,...tamanhos.map(([,h],i)=>lugares[i][1]+h));
 return {lugares,largura:W,altura:H};
}

const jogoUm=v=>Math.round(v*10)/10;

// O efeito.json, a partir das caixas (em px do canvas de 512) e das opções.
function jogoDados(caixas,lugares,tamanhos,op){
 const validas=caixas.filter(Boolean);
 const uniao=validas.length?[Math.min(...validas.map(c=>c[0])),Math.min(...validas.map(c=>c[1])),
  Math.max(...validas.map(c=>c[2])),Math.max(...validas.map(c=>c[3]))]:[op.origemX,op.origemY,op.origemX+1,op.origemY+1];
 const res=op.resolucao;
 const pixelScale=Math.round(JOGO_PIXEL_SCALE_1X*res*(op.alta||1)/op.tamanho*10000)/10000;
 const quadros=caixas.map((c,i)=>{
  const [x0,y0]=c||uniao;
  return [lugares[i][0],lugares[i][1],tamanhos[i][0],tamanhos[i][1],jogoUm((x0-op.origemX*(op.alta||1))*res),jogoUm((y0-op.origemY*(op.alta||1))*res)];
 });
 const ms=Math.round(1000/op.fps);
 const duracoesMs=caixas.map(()=>ms);
 const dados={nome:op.nome,video:op.descricao,trecho:[op.inicio,op.inicio+caixas.length-1],passo:1,ancora:'origem',
  pixelScale,altura:jogoUm((uniao[3]-uniao[1])*res/pixelScale),quadros,duracoesMs};
 if(op.segurar>=0&&op.segurar<caixas.length&&op.segurarMs>0){
  dados.marcaMs=duracoesMs.slice(0,op.segurar).reduce((a,b)=>a+b,0);
  dados.duracoesMs[op.segurar]+=Math.round(op.segurarMs);
 }
 if(op.soma>0)dados.soma=Math.round(Math.min(1,op.soma)*1000)/1000;
 if(op.luz)dados.luz={cor:op.luz.cor.toUpperCase(),alcance:op.luz.alcance,forca:op.luz.forca};
 if(op.sokonfx)dados.sokonfx=op.sokonfx;
 return dados;
}

// Zip sem compressão (o webp já vem comprimido): o bastante para levar a pasta inteira.
const jogoCrcTabela=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function jogoCrc32(bytes){let c=0xFFFFFFFF;for(let i=0;i<bytes.length;i++)c=jogoCrcTabela[(c^bytes[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0}
function jogoZip(arquivos){
 const enc=new TextEncoder(),partes=[],centrais=[];let pos=0;
 for(const {nome,dados} of arquivos){
  const n=enc.encode(nome),crc=jogoCrc32(dados),cab=new DataView(new ArrayBuffer(30));
  cab.setUint32(0,0x04034b50,true);cab.setUint16(4,20,true);cab.setUint16(6,0x0800,true);
  cab.setUint32(14,crc,true);cab.setUint32(18,dados.length,true);cab.setUint32(22,dados.length,true);cab.setUint16(26,n.length,true);
  const cen=new DataView(new ArrayBuffer(46));
  cen.setUint32(0,0x02014b50,true);cen.setUint16(4,20,true);cen.setUint16(6,20,true);cen.setUint16(8,0x0800,true);
  cen.setUint32(16,crc,true);cen.setUint32(20,dados.length,true);cen.setUint32(24,dados.length,true);cen.setUint16(28,n.length,true);cen.setUint32(42,pos,true);
  partes.push(new Uint8Array(cab.buffer),n,dados);centrais.push(new Uint8Array(cen.buffer),n);
  pos+=30+n.length+dados.length;
 }
 const tamCentral=centrais.reduce((a,p)=>a+p.length,0),fim=new DataView(new ArrayBuffer(22));
 fim.setUint32(0,0x06054b50,true);fim.setUint16(8,arquivos.length,true);fim.setUint16(10,arquivos.length,true);
 fim.setUint32(12,tamCentral,true);fim.setUint32(16,pos,true);
 return new Blob([...partes,...centrais,new Uint8Array(fim.buffer)],{type:'application/zip'});
}

function jogoNomeValido(nome){return /^[a-z0-9_]+$/.test(nome)}

// ---- Na página ----

function jogoOpcoes(){
 const n=id=>+el(id).value;
 const nome=el('jogoNome').value.trim()||el('jogoNome').placeholder;
 return {nome,origemX:n('jogoOrigemX'),origemY:n('jogoOrigemY'),tamanho:n('jogoTamanho')/100,resolucao:n('jogoResolucao')/100,
  inicio:Math.max(1,Math.min(n('jogoInicio'),n('jogoFim'),quadrosTotais()))-1,fim:Math.min(quadrosTotais(),Math.max(n('jogoInicio'),n('jogoFim')))-1,fps:n('fps'),
  segurar:n('jogoSegurar')-1,segurarMs:n('jogoSegurarMs'),reforco:n('jogoBrilho')/100,soma:n('jogoSoma')/100,
  luz:el('jogoLuz').checked?{cor:el('jogoLuzCor').value,alcance:n('jogoLuzAlcance')/100,forca:n('jogoLuzForca')/100}:null,alta:n('jogoAlta')||1};
}

// Desenha os quadros pedidos, recorta e monta a folha. Devolve a folha (canvas) e o efeito.json.
function jogoMontar(op){
 // Alta: desenha com o dobro de pixels (os geradores novos ficam nítidos; o tamanho no jogo é o mesmo).
 const alta=op.alta||1,L=512*alta,desenha=op.desenhar||desenharQuadro;
 const tela=document.createElement('canvas');tela.width=tela.height=L;
 const ctx=tela.getContext('2d',{willReadFrequently:true});
 const recortes=[],caixas=[];
 for(let i=op.inicio;i<=op.fim;i++){
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,L,L);ctx.save();ctx.scale(alta,alta);desenha(ctx,i);ctx.restore();
  const img=ctx.getImageData(0,0,L,L);
  jogoCurvaAlfa(img.data,op.reforco);
  const caixa=jogoCaixa(img.data,L,L);
  caixas.push(caixa);
  if(!caixa){recortes.push(null);continue}
  const [x0,y0,x1,y1]=caixa,peca=document.createElement('canvas');
  peca.width=x1-x0;peca.height=y1-y0;peca.getContext('2d').putImageData(img,-x0,-y0);
  if(op.resolucao===1){recortes.push(peca);continue}
  const menor=document.createElement('canvas');
  menor.width=Math.max(1,Math.round(peca.width*op.resolucao));menor.height=Math.max(1,Math.round(peca.height*op.resolucao));
  const m=menor.getContext('2d');m.imageSmoothingQuality='high';m.drawImage(peca,0,0,menor.width,menor.height);
  recortes.push(menor);
 }
 const tamanhos=recortes.map(r=>r?[r.width,r.height]:[1,1]);
 const {lugares,largura,altura}=jogoEmpacotar(tamanhos,Math.min(JOGO_LADO_MAX,JOGO_LARGURA_FOLHA*alta));
 // Não coube: tenta de novo com 20% menos resolução (até 30%), e o status avisa quanto ficou.
 if((largura>JOGO_LADO_MAX||altura>JOGO_LADO_MAX)&&op.resolucao>.35)return jogoMontar({...op,resolucao:Math.round(op.resolucao*80)/100,reduzida:true});
 if(largura>JOGO_LADO_MAX||altura>JOGO_LADO_MAX)throw Error(`a folha daria ${largura}×${altura} px (o jogo aceita até ${JOGO_LADO_MAX}): diminua a resolução ou os quadros`);
 const folha=document.createElement('canvas');folha.width=largura;folha.height=altura;
 const f=folha.getContext('2d');
 recortes.forEach((r,i)=>{if(r)f.drawImage(r,lugares[i][0],lugares[i][1])});
 const dados=jogoDados(caixas,lugares,tamanhos,{...op,descricao:op.descricao||(composicao.ativa&&composicao.camadas.length?`Sōkon FX: composição de ${composicao.camadas.length} camadas`:`Sōkon FX: ${el('kind').value}, semente ${seed}`),
  sokonfx:{tipo:jogoTipoAtual(),exportar:jogoLer(),...(composicao.ativa&&composicao.camadas.length?{composicao:composicaoLer()}:{})}});
 if(op.reduzida)dados.resolucaoReduzida=op.resolucao;
 return {folha,dados};
}

// O tipo que está na tela, no formato do "Salvar tipo" (para refazer o efeito depois).
function jogoTipoAtual(){
 return {values:Object.fromEntries(savedFields.map(id=>[id,el(id).value])),seed,haloEnabled,customParticleTint,linked:el('linkTint').checked};
}
function jogoLer(){return Object.fromEntries(jogoCampos.map(id=>[id,el(id).type==='checkbox'?el(id).checked:el(id).value]))}
function jogoAplicar(valores){
 for(const id of jogoCampos){
  if(valores?.[id]===undefined)continue;
  if(el(id).type==='checkbox')el(id).checked=!!valores[id];else el(id).value=valores[id];
 }
 // Uma origem guardada diferente do contato do gerador vale como marcada à mão.
 if(valores?.jogoOrigemX!==undefined&&typeof jogoOrigemDoGerador!=='undefined')jogoOrigemMarcada=+valores.jogoOrigemX!==jogoOrigemDoGerador[0]||+valores.jogoOrigemY!==jogoOrigemDoGerador[1];
 jogoAtualizar();
}

async function jogoExportar(){
 const op=jogoOpcoes();
 if(!jogoNomeValido(op.nome)){el('jogoStatus').value='Nome só com letras minúsculas, números e _ (é o nome da pasta no jogo).';return}
 try{
  el('jogoStatus').value='Montando…';
  const {folha,dados}=jogoMontar(op);
  // Qualidade 1 no WebP do Chrome é sem perda (conferido no teste).
  const webp=await new Promise(r=>folha.toBlob(r,'image/webp',1));
  if(!webp||webp.type!=='image/webp')throw Error('este navegador não grava WebP (use o Chrome)');
  const json=new TextEncoder().encode(JSON.stringify(dados,null,1)+'\n');
  const zip=jogoZip([{nome:op.nome+'/folha.webp',dados:new Uint8Array(await webp.arrayBuffer())},{nome:op.nome+'/efeito.json',dados:json}]);
  const url=URL.createObjectURL(zip),a=document.createElement('a');
  a.href=url;a.download=op.nome+'.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
  el('jogoStatus').value=`${op.nome}.zip: ${dados.quadros.length} quadros, folha ${folha.width}×${folha.height}, ${dados.altura} px de altura no jogo.${dados.resolucaoReduzida?` A folha não cabia em 4096 px: resolução reduzida para ${Math.round(dados.resolucaoReduzida*100)}%.`:''} Solte a pasta em assets/efeitos/.`;
 }catch(e){el('jogoStatus').value='Não exportou: '+e.message}
}

let jogoMarcandoOrigem=false;
function jogoAtualizar(){
 const n=id=>+el(id).value;
 el('jogoOrigemValor').value=`${n('jogoOrigemX')}, ${n('jogoOrigemY')}`;
 el('jogoTamanhoValor').value=(n('jogoTamanho')/100).toFixed(2).replace(/0$/,'')+'x';
 el('jogoBrilhoValor').value=n('jogoBrilho')?`alfa^${(1/(1+n('jogoBrilho')/100)).toFixed(2)}`:'desligado';
 el('jogoSomaValor').value=n('jogoSoma')+'%';
 el('jogoLuzAlcanceValor').value=(n('jogoLuzAlcance')/100).toFixed(2);
 el('jogoLuzForcaValor').value=(n('jogoLuzForca')/100).toFixed(2);
 el('jogoSegurarMsValor').value=n('jogoSegurarMs')+' ms';
 for(const r of document.querySelectorAll('.jogo-luz'))r.hidden=!el('jogoLuz').checked;
 el('jogoNome').placeholder=(el('kind').value.normalize('NFD').replace(/[^A-Za-z ]/g,'').trim().toLowerCase().replace(/ +/g,'_')||'efeito')+'_'+seed;
 if(typeof preview==='function')preview();
}
for(const id of jogoCampos)el(id).addEventListener('input',jogoAtualizar);
el('jogoLuz').addEventListener('change',jogoAtualizar);
el('gameExport').addEventListener('toggle',()=>{if(!el('gameExport').open&&jogoMarcandoOrigem)el('jogoOrigemMarcar').onclick();else preview()});
el('jogoOrigemMarcar').onclick=()=>{
 jogoMarcandoOrigem=!jogoMarcandoOrigem;
 el('jogoOrigemMarcar').textContent=jogoMarcandoOrigem?'Toque na prévia · cancelar':'Marcar origem na prévia';
 preview();
};
el('jogoOrigemCentro').onclick=()=>{el('jogoOrigemX').value=el('jogoOrigemY').value=256;jogoOrigemMarcada=true;jogoAtualizar()};
// A origem segue o ponto de contato do gerador (o Fazedor desenha o contato em 300, o Feixe em 52...)
// enquanto ela não for marcada à mão; antes, ficava sempre no centro e o efeito saía deslocado no jogo.
let jogoOrigemMarcada=false,jogoOrigemDoGerador=[256,256];
function jogoOrigemSegue(kind){
 const o=geradores[kind]?.origem,novo=[o?.x??256,o?.y??256];
 const atual=[+el('jogoOrigemX').value,+el('jogoOrigemY').value];
 if(!jogoOrigemMarcada||(atual[0]===jogoOrigemDoGerador[0]&&atual[1]===jogoOrigemDoGerador[1])){
  el('jogoOrigemX').value=novo[0];el('jogoOrigemY').value=novo[1];jogoOrigemMarcada=false;jogoAtualizar();
 }
 jogoOrigemDoGerador=novo;
}
el('jogoExportar').onclick=jogoExportar;
// O toque que marca a origem vem antes dos outros da prévia (vento, foco, dissipação).
stage.addEventListener('pointerdown',e=>{
 if(!jogoMarcandoOrigem)return;
 e.preventDefault();e.stopImmediatePropagation();
 const p=canvasPoint(e);
 el('jogoOrigemX').value=Math.round(Math.max(0,Math.min(512,p.x)));
 el('jogoOrigemY').value=Math.round(Math.max(0,Math.min(512,p.y)));
 el('jogoOrigemMarcar').onclick();jogoOrigemMarcada=true;jogoAtualizar();
},true);
// A cruz da origem na prévia, enquanto o painel está aberto (não vai para o export).
function jogoGuia(ctx){
 if(!el('gameExport').open)return;
 const x=+el('jogoOrigemX').value,y=+el('jogoOrigemY').value;
 ctx.save();ctx.lineWidth=4;ctx.strokeStyle='#16161c';
 for(const [w,c] of [[4,'#16161c'],[2,jogoMarcandoOrigem?'#ffad40':'#7fe0ff']]){
  ctx.lineWidth=w;ctx.strokeStyle=c;ctx.beginPath();
  ctx.moveTo(x-12,y);ctx.lineTo(x+12,y);ctx.moveTo(x,y-12);ctx.lineTo(x,y+12);ctx.stroke();
 }
 ctx.restore();
}
jogoAtualizar();
