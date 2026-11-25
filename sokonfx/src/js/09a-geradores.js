// Geradores novos (a partir de 25/11): cada um se registra com os controles e a função que desenha.
// O painel se monta sozinho; os efeitos antigos (Impacto, Corte, ... Pressão de ar) seguem no
// caminho de sempre e não mudam (trava de pixels).
//
// Regras de arte do jogo (skill vfx-luta do jogo e a bíblia), que todo gerador segue:
//  - efeito é luz: a coisa mais clara da tela, sem contorno preto;
//  - faixas chapadas do escuro para o branco: borda saturada, meio claro, miolo branco;
//  - o golpe estoura grande no contato (quadros 0–1) e depois se desfaz QUEBRANDO a forma
//    (fragmenta e dispersa), não por transparência;
//  - tempo de dois em dois (cada desenho fica 2 quadros), como no anime;
//  - aponta para a direita (o jogo espelha).

const geradores={};
const geradorCampos=['rampaLiga','rampaCor','rampaInicio','dissLiga','dissInicio','dissBorda','dissModo','sombraLiga','sombraY','sombraForca','tempoCurva','tempoX1','tempoY1','tempoX2','tempoY2','tempoContato','tempoSegura'],
 geradorPadroes={rampaLiga:'',rampaCor:'#ffffff',rampaInicio:'40',dissLiga:'',dissInicio:'55',dissBorda:'1',dissModo:'ruido',sombraLiga:'',sombraY:'470',sombraForca:'35',
  tempoCurva:'linear',tempoX1:'30',tempoY1:'30',tempoX2:'70',tempoY2:'70',tempoContato:'2',tempoSegura:'0'};

// Cores: mistura de duas cores #rrggbb (a de 0 a 1) e a paleta de faixas de uma cor.
function corMistura(a,b,k){
 const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),x=p(a),y=p(b);
 return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('');
}
function corPaleta(cor){
 // Borda: a cor mais funda (um pouco mais escura e saturada); meio: a cor clareada; miolo branco.
 return {borda:corMistura(cor,'#000000',.18),cor,meio:corMistura(cor,'#ffffff',.55),miolo:'#ffffff'};
}

// Tempo de dois em dois: o quadro i vira o desenho do par dele (0,0,2,2,4,4...).
const doisEmDois=(i,ligado)=>ligado?i-i%2:i;

// Desenha a mesma forma em faixas: forma(k) monta o caminho com o tamanho k (1 = inteira).
function faixas(ctx,forma,cores,tamanhos=[1,.74,.46]){
 cores.forEach((cor,n)=>{if(!cor)return;ctx.beginPath();forma(tamanhos[n]??tamanhos.at(-1));ctx.fillStyle=cor;ctx.fill()});
}

// Um polígono pontudo (estrela de raios desiguais) em volta da origem.
function caminhoEstrela(ctx,raios,k=1,giro=0){
 const n=raios.length;
 raios.forEach(([r,a],i)=>{const ang=giro+a,x=Math.cos(ang)*r*k,y=Math.sin(ang)*r*k;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});
 ctx.closePath();
}

function registrarGerador(g){
 geradores[g.nome]=g;
 for(const p of g.params){geradorCampos.push(p.id);geradorPadroes[p.id]=String(p.padrao)}
 // O que a interface antiga espera de todo tipo: perfil e nomes de desenho.
 profiles[g.nome]={rimWidth:100,coreWidth:100,diameter:100,focus:0,particleWidth:100,shapes:1,riskWidth:100,outerWidth:100,
  styleMix:0,particles:24,light:0,...g.perfil};
 drawings[g.nome]=g.desenhos||['Padrão','Padrão','Padrão','Padrão'];
 const opcao=new Option(g.nome,g.nome);el('kind').add(opcao);
 // Os controles dele, escondidos até ele ser escolhido.
 const caixa=document.createElement('div');caixa.className='gerador-params';caixa.dataset.gerador=g.nome;caixa.hidden=true;
 for(const p of g.params){
  const l=document.createElement('label');
  let e;
  if(p.tipo==='oculto'){e=document.createElement('input');e.type='hidden';e.id=p.id;e.value=p.padrao;caixa.append(e);continue}
  if(p.tipo==='imagem'){
   // A imagem do aparelho vira um data URL guardado no campo (vai junto no tipo salvo).
   const guarda=document.createElement('input');guarda.type='hidden';guarda.id=p.id;guarda.value='';caixa.append(guarda);
   const arq=document.createElement('input');arq.type='file';arq.accept='image/png,image/webp,image/jpeg';
   arq.onchange=async()=>{const f=arq.files[0];if(!f)return;const img=new Image();img.src=URL.createObjectURL(f);await img.decode();
    const k=Math.min(1,512/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);guarda.value=c.toDataURL('image/png');arq.value='';preview()};
   l.append(p.rotulo,arq);caixa.append(l);continue;
  }
  if(p.tipo==='select'){e=document.createElement('select');for(const [v,t] of p.opcoes)e.add(new Option(t,v))}
  else if(p.tipo==='checkbox'){e=document.createElement('input');e.type='checkbox';l.className='jogo-check'}
  else{e=document.createElement('input');Object.assign(e,{type:'range',min:p.min,max:p.max,step:p.passo||1})}
  e.id=p.id;
  if(p.tipo==='checkbox')e.checked=!!p.padrao;else e.value=p.padrao;
  // Checkbox guarda "1"/"" no value, como os outros campos salvos (texto).
  if(p.tipo==='checkbox'){e.value=p.padrao?'1':'';e.addEventListener('input',()=>{e.value=e.checked?'1':'';preview()})}
  if(p.tipo==='range'){const s=document.createElement('output');s.id=p.id+'Valor';s.value=p.padrao+(p.unidade||'');
   e.addEventListener('input',()=>{s.value=e.value+(p.unidade||'');preview()});l.append(p.rotulo+' ',s,e)}
  else{if(p.tipo==='select')e.addEventListener('input',preview);l.append(p.rotulo,e)}
  caixa.append(l);
 }
 el('geradorParams').append(caixa);
}

// Os campos salvos dos geradores são texto (como os outros); o checkbox acompanha o value.
function geradorValor(p){
 const e=el(p.id);
 if(p.tipo==='checkbox'){e.checked=e.value==='1'||e.value==='true';return e.checked}
 return p.tipo==='select'||p.tipo==='oculto'||p.tipo==='imagem'?e.value:+e.value;
}

// A beira do quadro: o desenho se apaga nos últimos 28 px (como o --borda do conversor do jogo),
// para nunca sair cortado reto na folha, com qualquer ajuste.
const GERADOR_BEIRA=28;
let geradorMascara=null,geradorTela=null;
function geradorBeira(){
 if(geradorMascara)return geradorMascara;
 const m=document.createElement('canvas');m.width=m.height=512;const x=m.getContext('2d');
 x.fillStyle='#fff';x.fillRect(0,0,512,512);x.globalCompositeOperation='destination-out';
 for(const [x0,y0,x1,y1] of [[0,0,GERADOR_BEIRA,0],[512,0,512-GERADOR_BEIRA,0],[0,0,0,GERADOR_BEIRA],[0,512,0,512-GERADOR_BEIRA]]){
  const g=x.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,'#000');g.addColorStop(1,'#0000');x.fillStyle=g;x.fillRect(0,0,512,512);
 }
 return geradorMascara=m;
}
// Desenha o quadro de um gerador: origem no meio (ou onde ele pedir), girado pela Direção.
function desenharGerador(ctx,index){
 const g=geradores[el('kind').value];
 const p=Object.fromEntries(g.params.map(q=>[q.id,geradorValor(q)]));
 p.cor=el('tint').value;p.forca=+el('power').value;p.particulas=+el('particles').value;
 // Rampa de cor: da Cor da energia até a Cor no fim, a partir de "Começa a mudar em".
 const rampa=el('rampaLiga');rampa.checked=rampa.value==='1'||rampa.value==='true';
 if(rampa.checked){const ini=+el('rampaInicio').value/100,t=index/(frames-1);p.cor=corMistura(p.cor,el('rampaCor').value,suave(Math.max(0,(t-ini)/(1-ini||1))))}
 p.paleta=corPaleta(p.cor);
 const k=Math.max(1,Math.round(ctx.getTransform().a*100)/100),lado=Math.round(512*k);
 if(!geradorTela||geradorTela.width!==lado){geradorTela=document.createElement('canvas');geradorTela.width=geradorTela.height=lado}
 const x=geradorTela.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,lado,lado);x.save();x.scale(k,k);
 x.translate(g.origem?.x??256,g.origem?.y??256);if(!g.semGiro)x.rotate(+el('angle').value*Math.PI/180);
 g.desenhar(x,{i:index,t:index/(frames-1),n:frames,p,semente:seed,aleatorio:s=>generator((seed^s)>>>0)});
 x.restore();
 const liga=id=>{const e=el(id);e.checked=e.value==='1'||e.value==='true';return e.checked};
 if(liga('dissLiga'))geradorDissolver(x,index,+el('dissInicio').value/100,liga('dissBorda')?p.paleta.miolo:null,el('dissModo').value);
 x.save();x.globalCompositeOperation='destination-in';x.drawImage(geradorBeira(),0,0,lado,lado);x.restore();
 if(liga('sombraLiga'))geradorSombra(ctx,+el('sombraY').value,+el('sombraForca').value/100);
 ctx.drawImage(geradorTela,0,0,512,512);
}

// Quais controles comuns cada gerador usa (o resto do painel antigo some enquanto ele está escolhido).
const geradorComuns=['kind','tint','power','angle','particles','fps','generate','presetName','keep','backup','restore','savedTypes','presetStatus','save','geradorParams','composicao','gamePreview','gameExport'];
let geradorEscondidos=[];
// Antes da troca de tipo: devolve o que o gerador anterior escondeu (a interface antiga decide depois).
function geradoresAntes(){for(const e of geradorEscondidos)e.hidden=false;geradorEscondidos=[]}
function geradoresMostrar(kind){
 const g=geradores[kind];
 for(const c of document.querySelectorAll('.gerador-params'))c.hidden=c.dataset.gerador!==kind;
 el('rampaBloco').hidden=!g;
 if(!g)return;
 const manter=new Set((g.comuns||geradorComuns).concat(['kind','generate','presetName','keep','backup','restore','savedTypes','presetStatus','save','geradorParams','rampaBloco','tempo','composicao','gamePreview','gameExport','refUpload','refStatus','refClear','fps']));
 for(const filho of el('ajustes').children){
  if(filho.hidden)continue;
  const ids=[filho.id,...[...filho.querySelectorAll('[id]')].map(e=>e.id)].filter(Boolean);
  if(ids.some(id=>manter.has(id)))continue;
  filho.hidden=true;geradorEscondidos.push(filho);
 }
 // A imagem de referência é dos efeitos antigos.
 for(const id of ['refUpload','refStatus','refClear']){const e=el(id),alvo=e.closest('label')||e;if(!alvo.hidden){alvo.hidden=true;geradorEscondidos.push(alvo)}}
}

// Uma fita pontuda ao longo de uma linha: pts [[x,y]...], larguras por ponto (k afina tudo).
function caminhoFita(ctx,pts,larguras,k=1){
 const n=pts.length,esq=[],dir=[];
 for(let i=0;i<n;i++){
  const a=pts[Math.max(0,i-1)],b=pts[Math.min(n-1,i+1)];
  let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;
  const w=larguras[i]*k/2;
  esq.push([pts[i][0]-dy*w,pts[i][1]+dx*w]);dir.push([pts[i][0]+dy*w,pts[i][1]-dx*w]);
 }
 esq.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
 for(let i=n-1;i>=0;i--)ctx.lineTo(...dir[i]);
 ctx.closePath();
}
// Losango pontudo nas duas pontas (lasca, faísca), deitado no eixo x.
function caminhoLasca(ctx,comp,larg,k=1){
 const c=comp*(.55+.45*k),l=larg*k;
 ctx.moveTo(-c*.45,0);ctx.lineTo(-c*.05,-l/2);ctx.lineTo(c*.55,0);ctx.lineTo(-c*.05,l/2);ctx.closePath();
}
// Brilho de fundo em duas cores (pouco: o desenho manda, o brilho só acompanha).
function brilhoFundo(ctx,raio,cor,forca){
 if(forca<=0||raio<=0)return;
 const g=ctx.createRadialGradient(0,0,0,0,0,raio);
 g.addColorStop(0,corMistura(cor,'#ffffff',.5)+Math.round(110*forca).toString(16).padStart(2,'0'));
 g.addColorStop(.45,cor+Math.round(60*forca).toString(16).padStart(2,'0'));g.addColorStop(1,cor+'00');
 ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,raio,0,Math.PI*2);ctx.fill();
}
const suave=u=>u<=0?0:u>=1?1:u*u*(3-2*u);

// Dissolução: o efeito é comido por um ruído fixo a partir de "Começa em" (some por buracos que
// crescem, não por transparência); a beira dos buracos pode ficar acesa (o miolo da cor).
let geradorRuido=null;
function geradorDissolver(x,index,inicio,borda,modo='ruido'){
 const t=index/(frames-1),lim=Math.max(0,(t-inicio)/(1-inicio||1));
 if(lim<=0)return;
 if(!geradorRuido){
  // Ruído de valor em duas escalas, com semente fixa (o mesmo desenho sempre).
  const r=generator(0x5eed1),g1=[...Array(33*33)].map(r),g2=[...Array(129*129)].map(r);
  const amostra=(g,n,x,y)=>{const fx=x*n,fy=y*n,i=Math.floor(fx),j=Math.floor(fy),u=fx-i,v=fy-j,a=g[j*(n+1)+i],b=g[j*(n+1)+i+1],c=g[(j+1)*(n+1)+i],d=g[(j+1)*(n+1)+i+1];
   const s=w=>w*w*(3-2*w);return a+(b-a)*s(u)+(c-a)*s(v)+(a-b-c+d)*s(u)*s(v)};
  geradorRuido=new Float32Array(512*512);
  for(let y=0;y<512;y++)for(let xx=0;xx<512;xx++)geradorRuido[y*512+xx]=.86*amostra(g1,32,xx/512,y/512)+.14*amostra(g2,128,xx/512,y/512);
 }
 const L=x.canvas.width,esc=L/512,img=x.getImageData(0,0,L,L),d=img.data,faixa=.05;
 const rgb=borda?[1,3,5].map(i=>parseInt(borda.slice(i,i+2),16)):null;
 // Com direção: o ruído só quebra a borda de uma frente que anda (de fora, de dentro, de baixo, de cima).
 const frente=modo==='fora'?(xx,yy)=>1-Math.min(1,Math.hypot(xx-256,yy-256)/300):modo==='dentro'?(xx,yy)=>Math.min(1,Math.hypot(xx-256,yy-256)/300)
  :modo==='baixo'?(xx,yy)=>yy/512:modo==='cima'?(xx,yy)=>1-yy/512:null;
 for(let k=0;k<L*L;k++){
  if(!d[k*4+3])continue;
  const px=Math.min(511,((k%L)/esc)|0),py=Math.min(511,((k/L|0)/esc)|0),r=py*512+px;
  const nv=frente?.35*geradorRuido[r]+.65*frente(px,py):geradorRuido[r];
  if(nv<lim)d[k*4+3]=0;
  else if(rgb&&nv<lim+faixa){d[k*4]=rgb[0];d[k*4+1]=rgb[1];d[k*4+2]=rgb[2]}
 }
 x.putImageData(img,0,0);
}
// Sombra no chão: a silhueta do quadro, escura, deitada embaixo da linha do chão (achatada).
let geradorSombraTela=null;
function geradorSombra(ctx,chao,forca){
 const L=geradorTela.width;if(!geradorSombraTela||geradorSombraTela.width!==L){geradorSombraTela=document.createElement('canvas');geradorSombraTela.width=geradorSombraTela.height=L}
 const s=geradorSombraTela.getContext('2d');s.clearRect(0,0,L,L);s.drawImage(geradorTela,0,0);
 s.save();s.globalCompositeOperation='source-in';s.fillStyle='#000';s.fillRect(0,0,L,L);s.restore();
 ctx.save();ctx.globalAlpha=forca;ctx.translate(0,chao);ctx.scale(1,-.16);ctx.translate(0,-chao);ctx.drawImage(geradorSombraTela,0,0,512,512);ctx.restore();
}

// Imagens dos geradores (data URL → imagem pronta). Enquanto carrega, devolve null e redesenha
// a prévia quando chegar.
const geradorImagens=new Map();
function geradorImagem(url){
 if(!url)return null;
 let im=geradorImagens.get(url);
 if(!im){im=new Image();im.onload=()=>{try{previa.sujo=true}catch{}preview()};im.src=url;geradorImagens.set(url,im)}
 return im.complete&&im.naturalWidth?im:null;
}
