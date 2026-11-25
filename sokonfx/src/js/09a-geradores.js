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
const geradorCampos=['rampaLiga','rampaCor','rampaInicio'],geradorPadroes={rampaLiga:'',rampaCor:'#ffffff',rampaInicio:'40'};

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
 return p.tipo==='select'?e.value:+e.value;
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
 if(!geradorTela){geradorTela=document.createElement('canvas');geradorTela.width=geradorTela.height=512}
 const x=geradorTela.getContext('2d');x.clearRect(0,0,512,512);x.save();
 x.translate(g.origem?.x??256,g.origem?.y??256);if(!g.semGiro)x.rotate(+el('angle').value*Math.PI/180);
 g.desenhar(x,{i:index,t:index/(frames-1),n:frames,p,semente:seed,aleatorio:s=>generator((seed^s)>>>0)});
 x.restore();x.save();x.globalCompositeOperation='destination-in';x.drawImage(geradorBeira(),0,0);x.restore();
 ctx.drawImage(geradorTela,0,0);
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
 const manter=new Set((g.comuns||geradorComuns).concat(['kind','generate','presetName','keep','backup','restore','savedTypes','presetStatus','save','geradorParams','rampaBloco','composicao','gamePreview','gameExport','refUpload','refStatus','refClear','fps']));
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
