// Rastro do golpe (motion trail). Segue as regras do jogo: nasce no começo do caminho, cresce
// junto com o golpe e se apaga pelo fundo, de trás para a frente; é exagerado; os riscos são
// irregulares e pontudos. O caminho é um arco ou um traço desenhado com o dedo na prévia.
// Estilos: os da proposta por personagem (docs/efeitos-referencia-tokon.md no jogo).
registrarGerador({
 nome:'Rastro do golpe',
 perfil:{tint:'#dff6ff',particles:0},
 params:[
  {id:'rasEstilo',rotulo:'Estilo',tipo:'select',padrao:'veu',opcoes:[['veu','Véu com riscos finos'],['riscos','Riscos paralelos (garras)'],['pincel','Pincelada larga (pesado)'],
   ['arco','Arco limpo em camadas'],['seda','Fita de seda que ondula'],['rasgado','Arco de energia rasgado'],['fogo','Arco de fogo em línguas'],['tinta','Mancha de tinta que escorre'],
   ['vapor','Faixa de vapor'],['lamina','Risco único de lâmina'],['leque','Leque de riscos finos'],['arcoiris','Fita que muda de cor']]},
  {id:'rasCaminho',rotulo:'Caminho',tipo:'select',padrao:'arco',opcoes:[['arco','Arco'],['desenhado','Desenhado na prévia']]},
  {id:'rasPontos',tipo:'oculto',padrao:'[]'},
  {id:'rasRaio',rotulo:'Raio do arco',tipo:'range',min:40,max:230,padrao:170,unidade:' px'},
  {id:'rasArco',rotulo:'Tamanho do arco',tipo:'range',min:20,max:300,padrao:150,unidade:'°'},
  {id:'rasLargura',rotulo:'Largura',tipo:'range',min:4,max:160,padrao:70,unidade:' px'},
  {id:'rasRiscos',rotulo:'Riscos finos',tipo:'range',min:0,max:30,padrao:12},
  {id:'rasVeu',rotulo:'Véu (opacidade)',tipo:'range',min:10,max:100,padrao:55,unidade:'%'},
  {id:'rasSentido',rotulo:'Sentido',tipo:'select',padrao:'horario',opcoes:[['horario','De cima para baixo'],['anti','De baixo para cima']]},
  {id:'rasGolpe',rotulo:'Fim do golpe no quadro',tipo:'range',min:2,max:12,padrao:5},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const pal=p.paleta,forca=.75+p.forca/28,W=p.rasLargura*forca,est=p.rasEstilo;
  // O caminho: P(u) e a normal N(u), u de 0 (começo do golpe) a 1 (fim).
  let P,N;
  let pts=[];try{pts=JSON.parse(p.rasPontos)}catch{}
  if(p.rasCaminho==='desenhado'&&pts.length>=2){
   const L=[0];for(let j=1;j<pts.length;j++)L.push(L[j-1]+Math.hypot(pts[j][0]-pts[j-1][0],pts[j][1]-pts[j-1][1]));
   const tot=L.at(-1)||1;
   const em=u=>{const d=u*tot;let j=1;while(j<pts.length-1&&L[j]<d)j++;const k=(d-L[j-1])/((L[j]-L[j-1])||1);return [pts[j-1][0]+(pts[j][0]-pts[j-1][0])*k,pts[j-1][1]+(pts[j][1]-pts[j-1][1])*k]};
   P=em;N=u=>{const a=em(Math.max(0,u-.01)),b=em(Math.min(1,u+.01));const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1;return [-dy/d,dx/d]};
  }else{
   const R=Math.min(230,p.rasRaio*forca),arco=p.rasArco*Math.PI/180,s=p.rasSentido==='anti'?-1:1,a0=-s*arco/2;
   P=u=>{const a=a0+s*arco*u;return [Math.cos(a)*(R-W*.35),Math.sin(a)*(R-W*.35)]};N=u=>{const a=a0+s*arco*u;return [Math.cos(a),Math.sin(a)]};
  }
  const ponto=(u,off)=>{const [x,y]=P(u),[nx,ny]=N(u);return [x+nx*off,y+ny*off]};
  const golpe=p.rasGolpe,cabeca=Math.min(1,(i+1)/golpe),rabo=Math.max(0,(i-golpe*.5)/(n-1-golpe*.5))**.8;
  if(cabeca<=rabo+.01)return;
  const rnd=aleatorio(0x7a11+(est==='seda'||est==='vapor'?i:0));
  // Uma fita ao longo do caminho entre u0 e u1, com deslocamento lateral e largura por ponto.
  const fita=(u0,u1,off,larg,cores,tams,m=40,onda=0)=>{if(u1-u0<.005)return;const fp=[],fl=[];
   for(let j=0;j<=m;j++){const v=j/m,u=u0+(u1-u0)*v;fp.push(ponto(u,off+(onda?Math.sin(u*18+i*.9)*onda:0)));fl.push(larg(v))}
   faixas(ctx,k=>caminhoFita(ctx,fp,fl,k),cores,tams)};
  const cheia=v=>W*Math.pow(v,.7)*Math.pow(1-v,.15);
  const riscos=(qtd,g,cores)=>{for(let j=0;j<qtd;j++){const off=(rnd()-.5)*W*.85,ini=rabo+(cabeca-rabo)*rnd()*.6,fim=Math.min(cabeca,ini+(cabeca-rabo)*(.25+.6*rnd())),gg=g*(.6+.8*rnd());
   fita(ini,fim,off,v=>gg*Math.sin(Math.PI*v)**.6,cores,[1,.5],14)}};
  if(est==='veu'){
   ctx.save();ctx.globalAlpha=p.rasVeu/100;fita(rabo,cabeca,0,cheia,[pal.cor,pal.meio],[1,.6]);ctx.restore();
   riscos(p.rasRiscos,2.4*forca,[pal.miolo]);
  }else if(est==='riscos'){
   const q=Math.max(2,Math.min(5,Math.round(p.rasRiscos/3)||3));
   for(let j=0;j<q;j++){const off=(j/(q-1)-.5)*W*.9;fita(rabo+j*.02,cabeca,off,v=>5*forca*Math.pow(v,.9),[pal.cor,pal.miolo],[1,.45])}
  }else if(est==='pincel'){
   ctx.save();ctx.globalAlpha=p.rasVeu/100;
   fita(rabo,cabeca,0,v=>cheia(v)*1.4*(.85+.3*rnd()),[corMistura(pal.cor,'#8a8f9a',.4),pal.meio],[1,.7],60);ctx.restore();
   riscos(p.rasRiscos+6,3.2*forca,[pal.meio,pal.miolo]);
  }else if(est==='seda'){
   fita(rabo,cabeca,0,v=>W*.28*Math.sin(Math.PI*Math.min(1,v*1.1))**.5,[pal.cor,pal.meio,pal.miolo],[1,.6,.25],60,W*.35);
  }else if(est==='arco'){
   fita(rabo,cabeca,0,cheia,[pal.borda,pal.cor,pal.meio,pal.miolo],[1,.74,.48,.22],50);
  }else if(est==='rasgado'||est==='fogo'){
   fita(rabo,cabeca,0,v=>cheia(v)*(est==='rasgado'?.85+.3*rnd():1),[pal.borda,pal.cor,pal.meio,pal.miolo],[1,.74,.48,.22],50);
   if(est==='fogo')for(let j=0;j<10;j++){const u=rabo+(cabeca-rabo)*(j+.5)/10,[x,y]=ponto(u,W*.45),[nx,ny]=N(u),h=W*(.5+.6*rnd())*(u-rabo)/(cabeca-rabo+1e-6);
    ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(ny,nx));faixas(ctx,k=>{const ww=h*.4*k,hh=h*k;ctx.moveTo(0,-ww);ctx.quadraticCurveTo(hh*.5,-ww*.6,hh,0);ctx.quadraticCurveTo(hh*.5,ww*.6,0,ww);ctx.closePath()},[pal.borda,pal.cor,pal.meio],[1,.7,.4]);ctx.restore()}
   else{const fr=aleatorio(0x5af+i);for(let j=0;j<10;j++){const u=rabo+(cabeca-rabo)*fr(),[x,y]=ponto(u,(fr()-.5)*W*1.6),s=(3+fr()*4)*forca;
    ctx.save();ctx.translate(x,y);ctx.rotate(fr()*6);faixas(ctx,k=>caminhoLasca(ctx,s*3,s,k),[pal.cor,pal.miolo],[1,.45]);ctx.restore()}}
  }else if(est==='tinta'){
   const tinta=corMistura(pal.cor,'#0a0010',.6);
   fita(rabo,cabeca,0,v=>cheia(v)*.9,[tinta,corMistura(pal.cor,'#0a0010',.25),pal.cor],[1,.55,.2],50);
   const fr=aleatorio(0x71a);for(let j=0;j<8;j++){const u=rabo+(cabeca-rabo)*fr(),[x,y]=ponto(u,W*.3),esc=(i/(n-1))*60*forca*(.4+fr());
    ctx.fillStyle=tinta;ctx.beginPath();ctx.moveTo(x-4*forca,y);ctx.lineTo(x+4*forca,y);ctx.lineTo(x+2,y+esc);ctx.arc(x,y+esc,3*forca,0,Math.PI);ctx.closePath();ctx.fill()}
  }else if(est==='vapor'){
   ctx.save();ctx.globalAlpha=p.rasVeu/100*(1-rabo*.6);fita(rabo,cabeca,0,v=>cheia(v)*1.2,[pal.meio,pal.miolo],[1,.4],50,W*.08);ctx.restore();
  }else if(est==='lamina'){
   fita(rabo,cabeca,0,v=>Math.max(1.5,W*.12)*Math.pow(v,1.2),[pal.cor,pal.miolo],[1,.4]);
  }else if(est==='leque'){
   const q=Math.max(4,p.rasRiscos);for(let j=0;j<q;j++){const off=(j/(q-1)-.5)*W*1.4,ini=rabo+rnd()*.1;fita(ini,cabeca,off,v=>2*forca*Math.pow(v,.8)*(.6+.8*rnd()),[pal.miolo],[1],24)}
   fita(Math.max(rabo,cabeca-.15),cabeca,W*.75,v=>3*forca*Math.sin(Math.PI*v),[pal.cor],[1],10);
  }else if(est==='arcoiris'){
   const cores=['#ff5a7a','#ffb43a','#fff25a','#5aff8a','#5ad8ff','#a07aff'];
   for(let j=0;j<cores.length;j++){const u0=rabo+(cabeca-rabo)*j/cores.length,u1=rabo+(cabeca-rabo)*(j+1.15)/cores.length;
    fita(u0,Math.min(cabeca,u1),0,v=>W*.55*Math.pow((j+v)/cores.length,.6),[cores[j],corMistura(cores[j],'#ffffff',.6)],[1,.45],10)}
  }
  // A borda da frente do golpe: um fio claro na cabeça (menos na lâmina, no vapor e na tinta).
  if(!['lamina','vapor','tinta','riscos','leque'].includes(est))fita(Math.max(rabo,cabeca-.35),cabeca,W*.35,v=>4*forca*v,[pal.meio,pal.miolo],[1,.5],16);
 }
});
{const b=document.createElement('button');b.type='button';b.id='rastroDesenhar';b.textContent='Desenhar o caminho na prévia';
 document.querySelector('.gerador-params[data-gerador="Rastro do golpe"]').append(b)}
