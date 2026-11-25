// Prévia no jogo: o efeito tocado como o motor do jogo toca a faísca do golpe (GameView e
// EfeitosVideo), em cima de um print da luta (ou de silhuetas), na escala dos lutadores.
//  - O efeito é o mesmo que o "Exportar para o jogo" gera (jogoMontar): o que se vê é o que vai.
//  - Tempo: o motor anda a 60 Hz; a faísca dura (max(6, pausa) + 8) quadros, vezes 0,7 nos
//    impacto_v0* (RITMO_IMPACTO_V06), e o efeito inteiro é esticado para caber nesse tempo
//    (tocarDurando: ritmo = duração natural / duração pedida).
//  - Tamanho: FAISCA_ESCALA (1 no L, M e H; 1,15 no especial) e 1,25 no Super; px do mundo =
//    px da folha × tamanho / pixelScale.
//  - Ângulo para cima gira ao contrário do relógio; espelhado gira ao contrário; soma em duas
//    passadas (cobre com 1 − soma, soma com soma), como o EfeitosVideo.pintar.
//  - A luz que o efeito joga nos lutadores (o "luz" do efeito.json) não é simulada aqui.

const PREVIA_PASSO_MS=1000/60;
const PREVIA_FORCAS={L:{pausa:8,escala:1},M:{pausa:11,escala:1},H:{pausa:16,escala:1},
 especial:{pausa:16,escala:1.15},Super:{pausa:16,escala:1.25}};
const PREVIA_ANTES_MS=350,PREVIA_DEPOIS_MS=450;

// ---- Partes puras ----

// Quanto tempo a faísca fica na tela (ms) e o ritmo em que a folha anda.
function previaTempo(pausa,ritmoImpacto,naturalMs){
 const alvo=(Math.max(6,pausa)+8)*PREVIA_PASSO_MS*(ritmoImpacto?0.7:1);
 return {alvoMs:alvo,ritmo:naturalMs>0&&alvo>0?naturalMs/alvo:1};
}
// O quadro da folha numa idade (ms do efeito), ou -1 depois do fim (EfeitosVideo.Folha.quadroEm).
function previaQuadroEm(duracoesMs,idade){
 let fim=0;for(let i=0;i<duracoesMs.length;i++){fim+=duracoesMs[i];if(idade<fim)return i}
 return -1;
}
// A vida da luz (0 a 1 do tempo do efeito): acende em 15% e apaga no resto (EfeitosVideo.vida).
function previaVida(t){if(t<0||t>=1)return 0;const k=t<.15?t/.15:(1-t)/.85;return k*k}
// Idade do efeito no passo n de 60 Hz, tendo nascido no passo n0.
function previaIdade(n,n0,ritmo){return n<n0?-1:(n-n0)*PREVIA_PASSO_MS*ritmo}

// Desenha um quadro da folha com a origem em (x, y) da tela, como o EfeitosVideo.desenhar.
function previaDesenharFolha(ctx,folha,dados,q,x,y,k,espelhado,graus){
 const [fx,fy,w,h,dx,dy]=dados.quadros[q];
 ctx.save();
 if(graus)ctx.translate(x,y),ctx.rotate((espelhado?graus:-graus)*Math.PI/180),ctx.translate(-x,-y);
 if(espelhado)ctx.translate(x,0),ctx.scale(-1,1),ctx.translate(-x,0);
 const soma=Math.max(0,Math.min(1,dados.soma||0));
 const pintar=()=>ctx.drawImage(folha,fx,fy,w,h,x+dx*k,y+dy*k,w*k,h*k);
 if(soma<1){ctx.globalAlpha=1-soma;pintar()}
 if(soma>0){ctx.globalAlpha=soma;ctx.globalCompositeOperation='lighter';pintar()}
 ctx.restore();
}

// ---- Arquivos do aparelho: a cena (IndexedDB, para não perder ao fechar) e o efeito comparado ----

function previaBanco(){
 return new Promise((ok,erro)=>{const r=indexedDB.open('sokonfx',1);
  r.onupgradeneeded=()=>r.result.createObjectStore('arquivos');r.onsuccess=()=>ok(r.result);r.onerror=()=>erro(r.error)});
}
async function previaGuardar(chave,valor){
 try{const db=await previaBanco();await new Promise((ok,erro)=>{const t=db.transaction('arquivos','readwrite');
  valor===null?t.objectStore('arquivos').delete(chave):t.objectStore('arquivos').put(valor,chave);t.oncomplete=ok;t.onerror=()=>erro(t.error)})}catch{}
}
async function previaLer(chave){
 try{const db=await previaBanco();return await new Promise(ok=>{const r=db.transaction('arquivos').objectStore('arquivos').get(chave);
  r.onsuccess=()=>ok(r.result);r.onerror=()=>ok(undefined)})}catch{return undefined}
}

// Lê um .zip (guardado ou deflate, como os do celular e os do Sōkon FX): {caminho: Uint8Array}.
async function previaLerZip(buf){
 const v=new DataView(buf),bytes=new Uint8Array(buf),dec=new TextDecoder();
 let fimCentral=-1;
 for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--)if(v.getUint32(i,true)===0x06054b50){fimCentral=i;break}
 if(fimCentral<0)throw Error('não é um .zip');
 const n=v.getUint16(fimCentral+10,true);let p=v.getUint32(fimCentral+16,true);
 const arquivos={};
 for(let i=0;i<n;i++){
  if(v.getUint32(p,true)!==0x02014b50)throw Error('zip estragado');
  const metodo=v.getUint16(p+10,true),tam=v.getUint32(p+20,true),nl=v.getUint16(p+28,true),el=v.getUint16(p+30,true),cl=v.getUint16(p+32,true),local=v.getUint32(p+42,true);
  const nome=dec.decode(bytes.subarray(p+46,p+46+nl));
  const inicio=local+30+v.getUint16(local+26,true)+v.getUint16(local+28,true),dados=bytes.subarray(inicio,inicio+tam);
  if(metodo===0)arquivos[nome]=dados.slice();
  else if(metodo===8)arquivos[nome]=new Uint8Array(await new Response(new Blob([dados]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());
  p+=46+nl+el+cl;
 }
 return arquivos;
}

// Um efeito do jogo a partir dos arquivos escolhidos: um .zip, ou a folha.webp + o efeito.json.
async function previaCarregarEfeito(arquivos){
 let json=null,imagem=null,nome='';
 for(const f of arquivos){
  if(/\.zip$/i.test(f.name)){
   const z=await previaLerZip(await f.arrayBuffer());
   const caminhoJson=Object.keys(z).find(k=>/(^|\/)efeito\.json$/.test(k));
   if(!caminhoJson)throw Error('o zip não tem efeito.json');
   const pasta=caminhoJson.replace(/efeito\.json$/,'');
   const caminhoFolha=Object.keys(z).find(k=>k.startsWith(pasta)&&/folha\.(webp|png)$/i.test(k));
   if(!caminhoFolha)throw Error('o zip não tem a folha');
   json=new TextDecoder().decode(z[caminhoJson]);imagem=new Blob([z[caminhoFolha]],{type:'image/webp'});
   nome=pasta.replace(/\/$/,'').split('/').pop()||f.name.replace(/\.zip$/i,'');
  }else if(/\.json$/i.test(f.name))json=await f.text();
  else imagem=f;
 }
 if(!json||!imagem)throw Error('escolha o .zip, ou a folha e o efeito.json juntos');
 const dados=JSON.parse(json);
 if(!Array.isArray(dados.quadros)||!Array.isArray(dados.duracoesMs))throw Error('efeito.json sem quadros ou duracoesMs');
 const folha=await createImageBitmap(imagem,{premultiplyAlpha:'none'});
 return {folha,dados,nome:nome||dados.nome||'comparado'};
}

// ---- Na página ----

const palco=el('palco');
const previa={atual:null,sujo:true,cena:null,comparado:null,inicio:performance.now(),marcando:null,medida:[]};
const previaCampos=['previaFundo','previaAltura','previaMedida','previaX','previaY','previaForca','previaPausa','previaRitmo','previaEsquerda','previaAngulo','previaLenta','previaLuz'];

function previaAberta(){return el('gamePreview').open}

// O efeito atual, refeito quando algo mudou (o mesmo do export).
function previaEfeitoAtual(){
 if(!previa.sujo&&previa.atual)return previa.atual;
 previa.sujo=false;
 try{const {folha,dados}=jogoMontar(jogoOpcoes());previa.atual={folha,dados,nome:'Sōkon FX'};el('previaStatus').value=''}
 catch(e){previa.atual=null;el('previaStatus').value='Não montou: '+e.message}
 return previa.atual;
}

// Escala (px da tela por px do mundo) e o ponto do golpe.
function previaCalibragem(){
 const altura=+el('previaAltura').value||250;
 if(previa.cena)return {px:(+el('previaMedida').value||altura)/altura,largura:previa.cena.width,alturaTela:previa.cena.height};
 return {px:1.2,largura:960,alturaTela:540};
}

function previaDesenharFundo(ctx,c){
 const fundo=el('previaFundo').value;
 if(previa.cena&&fundo==='cena'){ctx.drawImage(previa.cena,0,0);return}
 ctx.fillStyle=fundo==='claro'?'#e9e6df':'#1b1c24';ctx.fillRect(0,0,c.largura,c.alturaTela);
 if(previa.cena)return;
 // Sem print: duas silhuetas do tamanho de um lutador (só para a escala; não é arte do jogo).
 const chao=470,h=(+el('previaAltura').value||250)*c.px,esq=el('previaEsquerda').checked;
 ctx.fillStyle=fundo==='claro'?'#b9b5ad':'#3a3b47';ctx.fillRect(0,chao,c.largura,c.alturaTela-chao);
 for(const [x,rival] of [[esq?580:380,false],[esq?380:580,true]]){
  ctx.save();ctx.translate(x,chao);ctx.fillStyle=fundo==='claro'?(rival?'#8d8a84':'#6f6c67'):(rival?'#5d5f6e':'#4a4c59');
  const s=h/250;ctx.scale(esq?-s:s,s);
  ctx.beginPath();ctx.ellipse(0,-225,20,25,0,0,7);ctx.fill();
  ctx.beginPath();ctx.moveTo(-34,-195);ctx.lineTo(34,-195);ctx.lineTo(28,-100);ctx.lineTo(42,0);ctx.lineTo(14,0);ctx.lineTo(0,-80);ctx.lineTo(-14,0);ctx.lineTo(-42,0);ctx.lineTo(-28,-100);ctx.closePath();ctx.fill();
  if(!rival){ctx.beginPath();ctx.moveTo(20,-185);ctx.lineTo(100,-160);ctx.lineTo(100,-145);ctx.lineTo(18,-160);ctx.fill()}
  else{ctx.beginPath();ctx.moveTo(-20,-185);ctx.lineTo(-40,-130);ctx.lineTo(-28,-125);ctx.lineTo(-10,-170);ctx.fill()}
  ctx.restore();
 }
}

// Um painel: fundo, efeito no passo n e o texto. Devolve se o efeito ainda estava na tela.
function previaPainel(ctx,c,efeito,n,n0,x0,larguraJanela,rotulo){
 const forca=PREVIA_FORCAS[el('previaForca').value]||PREVIA_FORCAS.H;
 const pausa=+el('previaPausa').value;
 ctx.save();ctx.beginPath();ctx.rect(0,0,larguraJanela,c.alturaTela);ctx.clip();ctx.translate(-x0,0);
 previaDesenharFundo(ctx,c);
 let visivel=false,tempo=null;
 if(efeito){
  const natural=efeito.dados.duracoesMs.reduce((a,b)=>a+b,0);
  tempo=previaTempo(pausa,el('previaRitmo').checked,natural);
  const q=previaQuadroEm(efeito.dados.duracoesMs,previaIdade(n,n0,tempo.ritmo));
  if(q>=0&&n>=n0){
   visivel=true;
   const luz=efeito.dados.luz;
   if(luz&&el('previaLuz').checked){
    const idade=previaIdade(n,n0,tempo.ritmo),total=efeito.dados.duracoesMs.reduce((a,b)=>a+b,0),vt=previaVida(idade/total);
    const gx=+el('previaX').value,gy=+el('previaY').value,r=luz.alcance*c.alturaTela;
    const g=ctx.createRadialGradient(gx,gy,0,gx,gy,r),a=Math.round(255*Math.min(1,luz.forca*vt*.85)).toString(16).padStart(2,'0');
    g.addColorStop(0,luz.cor+a);g.addColorStop(1,luz.cor+'00');
    ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle=g;ctx.fillRect(gx-r,gy-r,2*r,2*r);ctx.restore();
   }
   const k=forca.escala*c.px/efeito.dados.pixelScale;
   previaDesenharFolha(ctx,efeito.folha,efeito.dados,q,+el('previaX').value,+el('previaY').value,k,el('previaEsquerda').checked,+el('previaAngulo').value);
  }
 }
 ctx.restore();
 // Texto por cima: o nome e o tempo, e a pausa enquanto os lutadores estão parados.
 const congelado=n>=n0&&n<n0+pausa;
 ctx.save();ctx.font='bold 22px system-ui,sans-serif';ctx.lineWidth=5;ctx.strokeStyle='#0008';ctx.fillStyle='#fff';
 const linha1=rotulo+(tempo?` · ${Math.round(tempo.alvoMs)} ms`:'');
 ctx.strokeText(linha1,14,32);ctx.fillText(linha1,14,32);
 if(congelado){const t=`pausa ${n-n0+1}/${pausa}`;ctx.fillStyle='#ffd36b';ctx.strokeText(t,14,62);ctx.fillText(t,14,62)}
 ctx.restore();
 return visivel;
}

function previaQuadro(agora){
 if(!previaAberta()||previa.parado)return;
 requestAnimationFrame(previaQuadro);
 previaDesenhar(agora-previa.inicio);
}
// Desenha o palco em `decorrido` ms do relógio da prévia (também usado pelo teste).
function previaDesenhar(decorrido){
 const c=previaCalibragem(),efeito=previaEfeitoAtual(),comp=previa.comparado;
 const lado=!!comp,janela=lado?Math.min(c.largura,Math.round(c.alturaTela*0.9)):c.largura;
 const W=lado?janela*2+8:c.largura;
 if(palco.width!==W||palco.height!==c.alturaTela){palco.width=W;palco.height=c.alturaTela}
 const lenta=el('previaLenta').checked?4:1;
 const duracoes=[efeito,comp].filter(Boolean).map(e=>{const nat=e.dados.duracoesMs.reduce((a,b)=>a+b,0);return previaTempo(+el('previaPausa').value,el('previaRitmo').checked,nat).alvoMs});
 const ciclo=PREVIA_ANTES_MS+Math.max(+el('previaPausa').value*PREVIA_PASSO_MS,...duracoes,0)+PREVIA_DEPOIS_MS;
 const t=(decorrido/lenta)%ciclo;
 const n=Math.floor(t/PREVIA_PASSO_MS),n0=Math.round(PREVIA_ANTES_MS/PREVIA_PASSO_MS);
 const ctx=palco.getContext('2d');ctx.clearRect(0,0,palco.width,palco.height);
 const x0=lado?Math.max(0,Math.min(c.largura-janela,+el('previaX').value-janela/2)):0;
 previaPainel(ctx,c,efeito,n,n0,x0,janela,'Sōkon FX');
 if(lado){ctx.save();ctx.translate(janela+8,0);previaPainel(ctx,c,comp.folha?comp:null,n,n0,x0,janela,comp.nome);ctx.restore()}
 previaMarcas(ctx,c,x0,lado,janela);
}

// As marcas enquanto se calibra: o ponto do golpe e a medida do lutador.
function previaMarcas(ctx,c,x0,lado,janela){
 if(!previa.marcando)return;
 const cruz=(x,y,cor)=>{for(const [w,k] of [[5,'#16161c'],[2,cor]]){ctx.lineWidth=w;ctx.strokeStyle=k;ctx.beginPath();ctx.moveTo(x-14,y);ctx.lineTo(x+14,y);ctx.moveTo(x,y-14);ctx.lineTo(x,y+14);ctx.stroke()}};
 ctx.save();ctx.translate(-x0,0);
 if(previa.marcando==='golpe')cruz(+el('previaX').value,+el('previaY').value,'#ffad40');
 for(const p of previa.medida)cruz(p.x,p.y,'#7fe0ff');
 ctx.restore();
 ctx.save();ctx.font='bold 22px system-ui,sans-serif';ctx.lineWidth=5;ctx.strokeStyle='#000a';ctx.fillStyle='#7fe0ff';
 const t=previa.marcando==='golpe'?'Toque onde o golpe acerta':previa.medida.length?'Agora toque nos pés':'Toque no alto da cabeça do lutador';
 ctx.strokeText(t,14,c.alturaTela-18);ctx.fillText(t,14,c.alturaTela-18);ctx.restore();
}

function previaPonto(e){
 const box=palco.getBoundingClientRect(),c=previaCalibragem();
 const lado=!!previa.comparado,janela=lado?Math.min(c.largura,Math.round(c.alturaTela*0.9)):c.largura;
 const x0=lado?Math.max(0,Math.min(c.largura-janela,+el('previaX').value-janela/2)):0;
 let x=(e.clientX-box.left)*palco.width/box.width,y=(e.clientY-box.top)*palco.height/box.height;
 if(lado&&x>janela)x-=janela+8;
 return {x:Math.round(x+x0),y:Math.round(y)};
}
palco.addEventListener('pointerdown',e=>{
 if(!previa.marcando)return;
 e.preventDefault();
 const p=previaPonto(e);
 if(previa.marcando==='golpe'){el('previaX').value=p.x;el('previaY').value=p.y;previaFimMarca();return}
 previa.medida.push(p);
 if(previa.medida.length===2){
  el('previaMedida').value=Math.max(10,Math.round(Math.abs(previa.medida[1].y-previa.medida[0].y)));
  previaFimMarca();
 }
});
function previaFimMarca(){previa.marcando=null;previa.medida=[];previaAtualizar()}
el('previaMarcarGolpe').onclick=()=>{previa.marcando=previa.marcando==='golpe'?null:'golpe';previa.medida=[]};
el('previaMarcarAltura').onclick=()=>{previa.marcando=previa.marcando==='altura'?null:'altura';previa.medida=[]};

async function previaUsarCena(blob){
 if(!blob){previa.cena=null;return}
 try{previa.cena=await createImageBitmap(blob)}catch{previa.cena=null;el('previaStatus').value='Não abriu a imagem da cena.'}
}
el('previaCena').onchange=async()=>{
 const f=el('previaCena').files[0];if(!f)return;
 await previaUsarCena(f);await previaGuardar('cena',f);
 if(previa.cena){
  el('previaFundo').value='cena';
  // Sem medida ainda: chuta o lutador com 55% da altura do print e o golpe no meio.
  el('previaMedida').value=Math.round(previa.cena.height*0.55);
  el('previaX').value=Math.round(previa.cena.width/2);el('previaY').value=Math.round(previa.cena.height*0.5);
  el('previaStatus').value='Cena carregada. Marque a altura do lutador e o ponto do golpe.';
 }
 el('previaCena').value='';previaAtualizar();
};
el('previaCenaTirar').onclick=async()=>{
 await previaUsarCena(null);await previaGuardar('cena',null);
 el('previaFundo').value='escuro';el('previaX').value=518;el('previaY').value=290;el('previaMedida').value=300;previaAtualizar();
};
el('previaComparar').onchange=async()=>{
 const arquivos=[...el('previaComparar').files];if(!arquivos.length)return;
 try{previa.comparado=await previaCarregarEfeito(arquivos);el('previaStatus').value='Comparando com '+previa.comparado.nome+'.'}
 catch(e){el('previaStatus').value='Não abriu para comparar: '+e.message}
 el('previaComparar').value='';previaAtualizar();
};
el('previaCompararTirar').onclick=()=>{previa.comparado=null;previaAtualizar()};
el('previaForca').addEventListener('input',()=>{el('previaPausa').value=(PREVIA_FORCAS[el('previaForca').value]||PREVIA_FORCAS.H).pausa;previaAtualizar()});

function previaAtualizar(){
 el('previaPausaValor').value=el('previaPausa').value+' quadros';
 el('previaAnguloValor').value=el('previaAngulo').value+'°';
 el('previaCompararTirar').hidden=!previa.comparado;
 el('previaCenaTirar').hidden=!previa.cena;
 el('previaMedidaLinha').hidden=!previa.cena;
 localStorage.setItem('sokonfx.previa.v1',JSON.stringify(Object.fromEntries(previaCampos.map(id=>[id,el(id).type==='checkbox'?el(id).checked:el(id).value]))));
}
for(const id of previaCampos)el(id).addEventListener('input',previaAtualizar);

// Mostrar o palco no lugar da prévia quadrada enquanto o painel está aberto.
el('gamePreview').addEventListener('toggle',()=>{
 const aberto=previaAberta();
 palco.hidden=!aberto;stage.hidden=aberto;
 stage.parentElement.querySelector('footer').hidden=aberto;
 if(aberto){
  if(el('gameExport').open&&jogoMarcandoOrigem)el('jogoOrigemMarcar').onclick();
  previa.sujo=true;previa.inicio=performance.now();requestAnimationFrame(previaQuadro);
 }else previa.marcando=null;
});
// Marcar a origem do export pede a prévia quadrada.
el('jogoOrigemMarcar').addEventListener('click',()=>{if(previaAberta())el('gamePreview').open=false},true);
// Qualquer ajuste do efeito (fora do painel da prévia) refaz o efeito tocado.
for(const tipo of ['input','change','click'])el('ajustes').addEventListener(tipo,e=>{if(!e.target.closest('#gamePreview'))previa.sujo=true});

(()=>{
 try{const salvo=JSON.parse(localStorage.getItem('sokonfx.previa.v1')||'null');
  if(salvo)for(const id of previaCampos)if(salvo[id]!==undefined){if(el(id).type==='checkbox')el(id).checked=salvo[id];else el(id).value=salvo[id]}}catch{}
 previaAtualizar();
 previaLer('cena').then(async blob=>{if(blob){await previaUsarCena(blob);previaAtualizar()}});
})();
// Sem print, as silhuetas trocam de lado com quem bate: o ponto do golpe vai junto.
el('previaEsquerda').addEventListener('input',()=>{if(!previa.cena){el('previaX').value=960-+el('previaX').value;previaAtualizar()}});
