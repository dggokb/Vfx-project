// Fazedor: o motor de efeito por ruído em degraus (o jeito das ferramentas de efeito de jogo).
// O efeito é um CAMPO (onde ele é forte: a bola e a cauda, a coroa do estouro, a coluna, a aura em
// volta do corpo) comido por um RUÍDO animado e cortado em DEGRAUS de cor chapada (contorno escuro,
// base, cor, meio, miolo claro), com um brilho em volta. Nada é desenhado à mão: a chama ferve
// sozinha, a borda é viva, e o estouro se desfaz quebrando (o ruído come a forma), não apagando.
// Roda na placa de vídeo (WebGL2); a cor da energia dá os cinco degraus.
const FAZEDOR_VS=`#version 300 es
in vec2 a;void main(){gl_Position=vec4(a,0,1);}`;
const FAZEDOR_FS=`#version 300 es
precision highp float;
out vec4 o;
uniform vec2 res;uniform vec3 m0,m1;      // pixel da tela -> espaço do gerador
uniform float t,T,R,L,amp,esc,vel,cresce,quebra,anel1,anel2,brilho,halo;
uniform int forma,ruido,nemb;
uniform vec4 emb[24];
uniform vec3 cor[5];
uniform sampler2D mA,mB;uniform float temB,mistura,raioD,escImg,boil;uniform vec2 ancora;uniform int recolor;uniform vec2 fluxo,centroUV,centroP;uniform int radial;   // o desenho do dono (começo e fim)
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
float snoise(vec2 v){
 const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
 vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
 vec2 i1=(x0.x>x0.y)?vec2(1,0):vec2(0,1);vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;
 i=mod289(i);vec3 p=permute(permute(i.y+vec3(0,i1.y,1))+i.x+vec3(0,i1.x,1));
 vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);m=m*m;m=m*m;
 vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;
 m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
 vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.*dot(m,g);}
float fbm(vec2 p){float v=0.,a=.5;for(int k=0;k<5;k++){v+=snoise(p)*a;p=p*2.03+vec2(17.1,9.3);a*=.5;}return v/.97;}
// O tipo de ruído: fogo (nuvem torcida), elétrico (veios finos), fumaça (macia e larga).
float base(vec2 p){
 if(ruido==1)return 1.-2.*pow(abs(fbm(p*1.3)),.6);
 if(ruido==2)return fbm(p*.6)*.8;
 return fbm(p);}
// Em loop: dois ruídos que correm, misturados pelo tempo (o quadro T volta igual ao 0).
float laco(vec2 p,vec2 corre){
 float a=t/T;float n1=base(p+corre*t),n2=base(p+corre*(t-T));
 return (n1*(1.-a)+n2*a)/sqrt((1.-a)*(1.-a)+a*a);}
float ruidoEm(vec2 q,vec2 corre){
 if(ruido==0){float w=laco(q*.5+vec2(3.1,7.7),corre*.6);q+=vec2(w*.55,w*.35);}
 return .5+.5*laco(q,corre);}
const float LIM[5]=float[5](.16,.27,.42,.60,.80);
float segmento(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h);}
void main(){
 vec2 px=vec2(gl_FragCoord.x,res.y-gl_FragCoord.y);
 vec2 p=vec2(dot(m0,vec3(px,1)),dot(m1,vec3(px,1)));
 float v=-1.,f,n;float r=length(p);
 if(forma==0){
  // Bola em voo para a direita: bola + cauda que afina; o ruído corre para trás.
  float bola=1.-r/R,atras=clamp(-p.x/L,0.,1.),larg=R*(1.-.82*atras);
  float cauda=p.x<0.?(1.-abs(p.y)/max(larg,1.))*pow(1.-atras,.7)-.4*smoothstep(.8,1.,atras):-1.;
  f=max(bola*1.25,cauda);
  for(int k=0;k<24;k++){if(k>=nemb)break;f=max(f,(1.-length(p-emb[k].xy)/emb[k].z)*.75);}
  n=ruidoEm(vec2(p.x/(R*1.85*esc),p.y/(R*.67*esc)),vec2(vel*.42,0));
  v=f-.1*atras+(n-.5)*amp*(.55+1.5*atras)*clamp(f*3.+.35,0.,1.);
  for(int k=0;k<2;k++){float rx=k==0?anel1:anel2;if(rx<=0.)continue;
   float l=length(p/vec2(rx,R*1.32));float g=length(vec2(dFdx(l),dFdy(l)));
   v=max(v,(1.-abs(l-1.)/max(g*6.,1e-4))*.68);}
 }else if(forma==1){
  // Estouro: coroa de pontas afiadas (grandes e pequenas) que cresce, mais para trás que para a
  // frente; depois o ruído, esticado na direção das pontas, come a forma em lascas.
  vec2 dir=p/max(r,1e-3);float th=atan(dir.y,dir.x),u=t/max(T-1.,1.);
  float a1=fract(th/6.2832*7.+.13),a2=fract(th/6.2832*14.+.5);
  float coroa=max(pow(1.-abs(a1*2.-1.),2.4),.55*pow(1.-abs(a2*2.-1.),2.4));
  float tam=.5+.5*(.5+.5*fbm(dir*1.4+vec2(5.,1.)));
  float atrasDir=.4+.6*max(0.,-dir.x)+.15*abs(dir.y);
  float Rt=R*cresce*(.55+1.6*coroa*tam)*atrasDir+R*.45*cresce;
  f=1.-r/Rt;
  for(int k=0;k<24;k++){if(k>=nemb)break;f=max(f,(1.-length(p-emb[k].xy)/emb[k].z)*.8);}
  float rr=r/(R*.92*esc)-u*1.6*vel;
  n=.5+.5*base(dir*2.6+vec2(rr,rr*.6)+dir*rr*.35);
  float buraco=quebra*clamp(1.-r/(R*cresce*1.4),0.,1.)*1.4;
  v=f*1.15+(n-.5)*amp*1.1*clamp(f*3.+.12,0.,1.)-quebra*.8-buraco;
 }else if(forma==2){
  // Coluna (labareda, gêiser): sai do chão e sobe afinando; o ruído sobe.
  vec2 b=vec2(-44.,180.);vec2 d=p-b;float sobe=clamp(-d.y/L,0.,1.);
  float w=R*(1.-.55*sobe);
  f=d.y>0.?1.-length(vec2(d.x,d.y*1.6))/R:(1.-abs(d.x)/max(w,1.))*pow(1.-sobe,.6)-.4*smoothstep(.8,1.,sobe);
  for(int k=0;k<24;k++){if(k>=nemb)break;f=max(f,(1.-length(p-emb[k].xy)/emb[k].z)*.75);}
  n=ruidoEm(vec2(p.x/(R*.67*esc),p.y/(R*1.85*esc)),vec2(0,vel*.42));
  v=f-.1*sobe+(n-.5)*amp*(.55+1.5*sobe)*clamp(f*3.+.35,0.,1.);
 }else if(forma==3){
  // Aura no corpo: a silhueta de um lutador (cápsula) um pouco maior que ele, com as chamas
  // subindo mais grossas em cima. No jogo vai atrás do lutador: só a borda aparece.
  vec2 q0=p-vec2(-44.,0.);float corpo=R*.95;
  float sd=segmento(q0,vec2(0,-110),vec2(0,130))-corpo;
  float alto=clamp((130.-q0.y)/(240.+L),0.,1.);
  float esp=R*.5*(.6+1.6*alto)+L*.35*alto*alto;
  // Por dentro do corpo a chama baixa para o laranja (a aura é a borda; o lutador cobre o meio).
  f=sd+R*.15>0.?1.-(sd+R*.15)/esp:1.-min(1.,-(sd+R*.15)/(R*1.1))*.55;
  for(int k=0;k<24;k++){if(k>=nemb)break;f=max(f,(1.-length(p-emb[k].xy)/emb[k].z)*.75);}
  n=ruidoEm(vec2(p.x/(R*.67*esc),p.y/(R*1.85*esc)),vec2(0,vel*.42));
  v=f*.95+(n-.5)*amp*(.7+1.2*alto)*clamp(f*3.+.35,0.,1.);
 }else if(forma==4){
  // Desenhada: o campo é o desenho do dono (na tela, sem girar), e se tiver o desenho do fim, ele
  // se transforma de um no outro. Traço grosso vira miolo claro; traço fino fica só na cor.
  // Estourando: o desenho cresce a partir do centro dele (cresce) e depois se quebra (quebra).
  vec2 uv=px/res;uv=centroUV+(uv-centroUV)/max(cresce,.05);
  float m=texture(mA,uv).a;if(temB>0.)m=mix(m,texture(mB,uv).a,mistura);
  // A curva da tinta: as faixas de fora (contorno, vermelho, laranja) ficam largas e o miolo claro só
  // onde a tinta está forte.
  f=pow(m,1.5)*.98-.04-.4*(1.-smoothstep(0.,.12,m));
  for(int k=0;k<24;k++){if(k>=nemb)break;f=max(f,(1.-length(p-emb[k].xy)/emb[k].z)*.75);}
  vec2 d=p-centroP;float rd=length(d);
  if(radial==1){
   // Para fora: o ruído esticado na direção do centro para fora (lascas compridas).
   vec2 dir=d/max(rd,1e-3);float rr=rd/(R*.92*esc)-t/max(T-1.,1.)*1.6*vel;
   n=.5+.5*base(dir*2.6+vec2(rr,rr*.6)+dir*rr*.35);
  }else{
   vec2 ef=abs(fluxo.x)>abs(fluxo.y)?vec2(1.85,.67):abs(fluxo.y)>0.?vec2(.67,1.85):vec2(1.,1.);
   n=ruidoEm(p/(R*ef*esc),fluxo*vel*.42);
  }
  float buraco=quebra*clamp(1.-rd/(raioD*cresce*.8),0.,1.)*1.4;
  // O miolo forte fica liso (o claro chapado do concept); quebrando, o ruído cresce e parte a forma.
  float calma=1.-.75*smoothstep(.75,1.,m);
  v=f+(n-.5)*amp*1.1*(1.+2.*quebra)*calma*clamp(f*3.+.3,0.,1.)-quebra*.55-buraco;
  }else if(forma==6){
  // Imagem (forma pronta, desenhada ou gerada): a imagem entra do contato, crescendo; o "calor" dela
  // (a claridade: branco > amarelo > laranja > contorno) é o mapa de erosão: ao se desfazer, o contorno
  // vai primeiro e o miolo por último, em pedaços (o ruído só come a borda), e os pedaços ganham borda
  // escura. Tremido leve de desenho à mão (boil). Cores da imagem ou os degraus da cor da energia.
  vec2 d=p;float rd=length(d);vec2 dir=d/max(rd,1e-3);
  float rr=rd/(R*.92*esc)-t/max(T-1.,1.)*1.6*vel;
  n=.5+.5*base(dir*2.6+vec2(rr,rr*.6)+dir*rr*.35);
  vec2 q=d/(escImg*max(cresce,.05))+ancora;
  q+=(vec2(base(p*.02+t*.37),base(p*.02+vec2(9.,3.)-t*.37)))*boil*.006;
  vec4 im=(q.x<0.||q.y<0.||q.x>1.||q.y>1.)?vec4(0):texture(mA,q);
  float h=im.a*dot(im.rgb,vec3(.3,.55,.15));
  v=h+.1+(n-.5)*amp*.6*(.35+quebra*1.6)-quebra*1.3;
  float aa2=max(fwidth(v),.004),a2=smoothstep(-aa2,aa2,v)*smoothstep(.02,.12,im.a);
  vec3 c2;
  if(recolor==1){c2=cor[0];for(int k=1;k<5;k++)c2=mix(c2,cor[k],smoothstep(LIM[k]-.02,LIM[k]+.02,h*.95+.04-quebra*.35));}
  else c2=im.rgb;
  // borda dos pedaços: uma faixa escura onde a erosão está cortando
  float beira=(1.-smoothstep(0.,.07,v))*min(1.,quebra*8.);
  c2=mix(c2,cor[0],beira*.9);
  o=vec4(c2*a2,a2);return;
 }
 // Degraus chapados, com a beira de cada degrau macia em um pixel.
 float aa=max(fwidth(v)*.9,.004);vec3 c=cor[0];float al=smoothstep(LIM[0]-aa,LIM[0]+aa,v);
 // Quebrando, o contorno escuro some antes (sem mancha escura onde a forma está se desfazendo).
 al*=1.-min(1.,quebra*2.5)*(1.-smoothstep(LIM[1]-aa,LIM[1]+aa,v));
 for(int k=1;k<5;k++)c=mix(c,cor[k],smoothstep(LIM[k]-aa,LIM[k]+aa,v));
 // Brilho: abaixo do primeiro degrau, o campo ainda acende um véu da cor (abraça a forma), e um
 // halo redondo no centro (bola e estouro).
 float veu=smoothstep(LIM[0]-.45,LIM[0],v);veu=veu*veu*.5*brilho*(1.-quebra);
 float hal=halo*exp(-r*r/(2.*R*R*1.8))*.35;
 float ga=clamp(max(veu,hal),0.,1.)*(1.-al);
 o=vec4(c*al+cor[2]*ga,al+ga);
}`;

let fazedorGL=null;
function fazedorContexto(){
 if(fazedorGL!==null)return fazedorGL;
 const tela=document.createElement('canvas'),gl=tela.getContext('webgl2',{premultipliedAlpha:true,preserveDrawingBuffer:true,antialias:false});
 if(!gl)return fazedorGL=false;
 const sh=(tipo,src)=>{const s=gl.createShader(tipo);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s};
 const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,FAZEDOR_VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FAZEDOR_FS));gl.linkProgram(pr);gl.useProgram(pr);
 const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const a=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
 const u={};for(const n of ['res','m0','m1','t','T','R','L','amp','esc','vel','cresce','quebra','anel1','anel2','brilho','halo','forma','ruido','nemb','emb[0]','cor[0]','mA','mB','temB','mistura','fluxo','centroUV','centroP','radial','raioD','escImg','boil','ancora','recolor'])u[n]=gl.getUniformLocation(pr,n);
 const textura=()=>{const x=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,x);for(const [k,v] of [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,k,v);return x};
 const texA=textura(),texB=textura();gl.uniform1i(u.mA,0);gl.uniform1i(u.mB,1);
 return fazedorGL={tela,gl,u,texA,texB};
}

// Os cinco degraus de uma cor, do contorno ao miolo. Cor quente puxa o escuro para o vermelho
// (fogo); cor fria, para o anil (energia).
function fazedorDegraus(cor){
 const [r,,b]=[1,3,5].map(i=>parseInt(cor.slice(i,i+2),16)),quente=r>=b;
 return (quente?[corMistura(cor,'#3a0000',.8),corMistura(cor,'#c00000',.55),cor,corMistura(cor,'#ffe040',.75),'#fffbea']
  :[corMistura(cor,'#000020',.75),corMistura(cor,'#2010a0',.45),cor,corMistura(cor,'#ffffff',.55),'#f4fbff'])
  .flatMap(c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)/255));
}

registrarGerador({
 nome:'Fazedor',
 perfil:{tint:'#ff7a12',particles:14},
 origem:{x:300,y:256},
 params:[
  {id:'fzForma',rotulo:'Forma',tipo:'select',padrao:'voo',opcoes:[['voo','Bola em voo (loop)'],['estouro','Estouro'],['coluna','Coluna / labareda (loop)'],['aura','Aura no corpo (loop)'],['desenho','Desenhada (o seu desenho)'],['hit','Hit em camadas (gerado)'],['imagem','Imagem (forma pronta)']]},
  {id:'fzFluxo',rotulo:'Para onde a matéria corre',tipo:'select',padrao:'sobe',opcoes:[['sobe','Sobe'],['tras','Para trás (esquerda)'],['frente','Para a frente (direita)'],['desce','Desce'],['fora','Para fora (do centro do desenho)'],['parado','Ferve no lugar']]},
  {id:'fzTempoDesenho',rotulo:'O desenho no tempo',tipo:'select',padrao:'ferve',opcoes:[['ferve','Ferve (loop)'],['estoura','Estoura e se quebra'],['transforma','Do desenho do começo ao do fim']]},
  {id:'fzRuido',rotulo:'Matéria',tipo:'select',padrao:'fogo',opcoes:[['fogo','Fogo'],['eletrico','Elétrico'],['fumaca','Fumaça / vapor']]},
  {id:'fzTamanho',rotulo:'Tamanho',tipo:'range',min:40,max:200,padrao:100,unidade:'%'},
  {id:'fzAlcance',rotulo:'Cauda / altura',tipo:'range',min:40,max:400,padrao:260,unidade:' px'},
  {id:'fzForca',rotulo:'Força do ruído',tipo:'range',min:0,max:200,padrao:100,unidade:'%'},
  {id:'fzEscala',rotulo:'Tamanho do ruído',tipo:'range',min:40,max:250,padrao:100,unidade:'%'},
  {id:'fzVelocidade',rotulo:'Velocidade',tipo:'range',min:0,max:300,padrao:100,unidade:'%'},
  {id:'fzBrilho',rotulo:'Brilho em volta',tipo:'range',min:0,max:200,padrao:100,unidade:'%'},
  {id:'fzAneis',rotulo:'Anéis em volta da bola',tipo:'checkbox',padrao:true},
  {id:'fzDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:false},
  {id:'fzPontas',rotulo:'Hit: pontas',tipo:'range',min:5,max:30,padrao:14},
  {id:'fzComprimento',rotulo:'Hit: comprimento',tipo:'range',min:60,max:260,padrao:200,unidade:' px'},
  {id:'fzCurva',rotulo:'Hit: curva das pontas',tipo:'range',min:0,max:100,padrao:45,unidade:'%'},
  {id:'fzAbre',rotulo:'Hit: para onde abre',tipo:'range',min:-180,max:180,padrao:-35,unidade:'°'},
  {id:'fzAbertura',rotulo:'Hit: abertura',tipo:'range',min:90,max:360,padrao:330,unidade:'°'},
  {id:'fzRaios',rotulo:'Hit: raios de luz',tipo:'range',min:0,max:10,padrao:3},
  {id:'fzContorno',rotulo:'Hit: contorno por dentro',tipo:'range',min:0,max:100,padrao:50,unidade:'%'},
  {id:'fzCamadas',rotulo:'Hit: camadas',tipo:'range',min:1,max:3,padrao:3},
  {id:'fzImagem',rotulo:'Imagem da forma (efeito sobre fundo preto ou transparente)',tipo:'imagem',padrao:'',lado:1024},
  {id:'fzImgGrade',rotulo:'Imagem: desenhos na folha (colunas × linhas, lidos em linha)',tipo:'select',padrao:'1x1',opcoes:[['1x1','Um desenho só'],['2x1','2 × 1'],['3x1','3 × 1'],['4x1','4 × 1'],['2x2','2 × 2'],['3x2','3 × 2'],['3x3','3 × 3']]},
  {id:'fzImgCor',rotulo:'Imagem: cores',tipo:'select',padrao:'imagem',opcoes:[['imagem','As da imagem'],['energia','Os degraus da cor da energia']]},
  {id:'fzImgEntra',rotulo:'Imagem: quadros para abrir',tipo:'range',min:1,max:8,padrao:3},
  {id:'fzImgQuebra',rotulo:'Imagem: começa a quebrar em',tipo:'range',min:10,max:90,padrao:40,unidade:'%'},
  {id:'fzImgTremido',rotulo:'Imagem: tremido de desenho à mão',tipo:'range',min:0,max:100,padrao:35,unidade:'%'},
  {id:'fzDesenhoA',tipo:'oculto',padrao:''},
  {id:'fzDesenhoB',tipo:'oculto',padrao:''},
 ],
 desenhar(ctx,{i,n,p,aleatorio,semente}){
  const g=fazedorContexto();
  if(!g){ctx.fillStyle='#fff';ctx.font='16px sans-serif';ctx.fillText('Este navegador não tem WebGL2 (o Fazedor precisa).',-200,0);return}
  const {tela,gl,u}=g,W=ctx.canvas.width,H=ctx.canvas.height;
  if(tela.width!==W||tela.height!==H){tela.width=W;tela.height=H}
  const q=doisEmDois(i,p.fzDois),forma=['voo','estouro','coluna','aura','desenho','hit','imagem'].indexOf(p.fzForma);
  const forca=.75+p.forca/28,R=56*p.fzTamanho/100*forca*(forma===1?1.25:1),L=p.fzAlcance,ue=q/(n-1);
  // Brasas (partículas do mesmo material): correm com o efeito e encolhem.
  const emb=[],rnd=aleatorio(0xfa2e),nb=Math.min(24,p.particulas);
  for(let k=0;k<nb;k++){
   const fase=rnd(),lado=(rnd()-.5)*2,tam=.5+.6*rnd(),r3=rnd();
   if(forma===1){const a=Math.PI+(r3-.5)*3.6,v=R*(2.2+3.2*rnd()),vida=.45+.5*rnd(),T2=ue/vida;if(T2>=1||ue<.04)continue;
    const s=1-(1-T2)**3;emb.push(Math.cos(a)*v*s,Math.sin(a)*v*s+T2*T2*R*1.2,R*.2*(1-T2)**.7*(.6+.6*rnd()),0);continue}
   const f=(fase+q/n*2)%1;
   if(forma===0)emb.push(-R*.5-f*L*1.15,lado*R*(.7+f*.9)+Math.sin(f*9+fase*20)*8,R*.22*tam*(1-f)**.6,0);
   else if(forma===2)emb.push(-44+lado*R*(.6+f*.8),180-f*L*1.1,R*.2*tam*(1-f)**.6,0);
   else emb.push(-44+lado*R*(1.2+f*.6),130-f*(300+L*.6),R*.18*tam*(1-f)**.6,0);
  }
  const M=ctx.getTransform().inverse(),kt=ctx.getTransform().a?Math.hypot(ctx.getTransform().a,ctx.getTransform().b):1;
  const camadasHit=forma===5?fazedorHit(p,semente):null;
  const A=camadasHit?camadasHit.at(-1).m:fazedorMascara('fzDesenhoA'),B=fazedorMascara('fzDesenhoB'),fl={sobe:[0,1],tras:[1,0],frente:[-1,0],desce:[0,-1],parado:[0,0],fora:[0,0]}[p.fzFluxo]||[0,1];
  const estoura=forma===5||forma===4&&p.fzTempoDesenho==='estoura',ce=A.centro,cP=[(ce[0]*kt),(ce[1]*kt)];
  if(forma>=4){
   // Brasas do desenho: nascem nos pontos fortes dele e correm para onde a matéria corre; estourando,
   // saem voando do centro na direção das pontas.
   emb.length=0;const pts=A.fortes;const r2=aleatorio(0xd35e);
   for(let k=0;k<nb&&pts.length;k++){const [cx,cy]=pts[Math.floor(r2()*pts.length)],tam=.5+.6*r2();let X,Y,raio;
    if(estoura){const vida=.45+.5*r2(),T2=ue/vida;if(T2>=1||ue<.04)continue;const a=Math.atan2(cy-ce[1],cx-ce[0])+(r2()-.5)*.5,v=A.raio*(1.2+2*r2()),sx=1-(1-T2)**3;
     X=(ce[0]+Math.cos(a)*v*sx)*kt;Y=(ce[1]+Math.sin(a)*v*sx+T2*T2*A.raio*.6)*kt;raio=R*.2*tam*(1-T2)**.7}
    else{const f=(r2()+q/n*2)%1,fo=p.fzFluxo==='fora',ang=Math.atan2(cy-ce[1],cx-ce[0]);
     X=(cx-(fo?-Math.cos(ang):fl[0])*f*120+(r2()-.5)*20)*kt;Y=(cy-(fo?-Math.sin(ang):fl[1])*f*120+(r2()-.5)*20)*kt;raio=R*.2*tam*(1-f)**.6}
    emb.push(M.a*X+M.c*Y+M.e,M.b*X+M.d*Y+M.f,raio,0)}
  }
  const {texA,texB}=g;
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texA);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,A.c);
  gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,texB);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,B.c);
  gl.uniform1f(u.temB,B.vazio||forma===5||p.fzTempoDesenho!=='transforma'?0:1);gl.uniform1f(u.mistura,suave(ue));gl.uniform2f(u.fluxo,fl[0],fl[1]);
  gl.uniform2f(u.centroUV,ce[0]/512,ce[1]/512);gl.uniform2f(u.centroP,M.a*cP[0]+M.c*cP[1]+M.e,M.b*cP[0]+M.d*cP[1]+M.f);
  gl.uniform1i(u.radial,p.fzFluxo==='fora'||forma===5?1:0);gl.uniform1f(u.raioD,A.raio);
  gl.viewport(0,0,W,H);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform2f(u.res,W,H);gl.uniform3f(u.m0,M.a,M.c,M.e);gl.uniform3f(u.m1,M.b,M.d,M.f);
  gl.uniform1f(u.t,q);gl.uniform1f(u.T,n);gl.uniform1f(u.R,R);gl.uniform1f(u.L,L);
  gl.uniform1f(u.amp,p.fzForca/100*(forma===5?.5:1));gl.uniform1f(u.esc,p.fzEscala/100);gl.uniform1f(u.vel,p.fzVelocidade/100);
  gl.uniform1i(u.forma,Math.min(forma,4));gl.uniform1i(u.ruido,['fogo','eletrico','fumaca'].indexOf(p.fzRuido));
  const giro=q/n*Math.PI*4,aneis=forma===0&&p.fzAneis;
  gl.uniform1f(u.anel1,aneis?R*(.12+.5*Math.abs(Math.cos(giro))):0);gl.uniform1f(u.anel2,aneis?R*(.12+.5*Math.abs(Math.sin(giro))):0);
  gl.uniform1f(u.cresce,forma===1||estoura?(.4+.6*Math.min(1,1-(1-Math.min(1,ue/.18))**3))*(1+.3*ue):1);
  gl.uniform1f(u.quebra,forma===1||estoura?Math.max(0,(ue-.42)/.58)**1.25:0);
  gl.uniform1f(u.brilho,p.fzBrilho/100);gl.uniform1f(u.halo,forma===0?p.fzBrilho/100:forma===1?p.fzBrilho/100*Math.max(0,1-ue*1.6):0);
  const e=new Float32Array(96);e.set(emb.slice(0,96));gl.uniform4fv(u['emb[0]'],e);gl.uniform1i(u.nemb,emb.length/4);
  gl.uniform3fv(u['cor[0]'],new Float32Array(fazedorDegraus(p.cor)));
  const passada=()=>{gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(tela,0,0);ctx.restore()};
  if(forma===6){
   // A imagem (um desenho, ou uma folha de desenhos-chave tocados em sequência): tratada uma vez e
   // guardada. Na sequência, cada desenho fica o seu tempo (o primeiro, o clarão, curto; os do meio,
   // mais) e o último se desfaz rasgando; com um desenho só, ele abre do contato e depois rasga.
   const seq=fazedorImagem(p.fzImagem,p.fzImgGrade);if(!seq){return}
   const N=seq.length,S=470*p.fzTamanho/100*forca/1.4;
   let im,cresce,quebra;
   if(N===1){im=seq[0];const ab=Math.max(1,p.fzImgEntra)/(n-1),ini=p.fzImgQuebra/100,sx=Math.min(1,ue/ab);
    cresce=(.45+.55*(1-(1-sx)**3))*(1+.12*ue);quebra=Math.max(0,(ue-ini)/(1-ini))**1.15}
   else{
    const pesos=seq.map((_,k)=>k===0?.6:k===1?1.2:k===N-1?3:2.6),tot=pesos.reduce((x,y)=>x+y,0);
    let acc=0,k=0;for(;k<N-1;k++){if(ue*tot<acc+pesos[k])break;acc+=pesos[k]}
    im=seq[k];cresce=1+.06*ue;
    const iniUlt=(tot-pesos[N-1])/tot,meio=iniUlt+(1-iniUlt)*Math.max(.15,Math.min(.85,(p.fzImgQuebra/100)));
    quebra=k===N-1?Math.max(0,(ue-meio)/(1-meio))**1.1:0;
   }
   gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texA);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im.c);
   gl.uniform1i(u.forma,6);gl.uniform1f(u.escImg,S);gl.uniform2f(u.ancora,im.ancora[0],im.ancora[1]);gl.uniform1i(u.recolor,p.fzImgCor==='energia'?1:0);
   gl.uniform1f(u.boil,p.fzImgTremido/100);gl.uniform1f(u.amp,p.fzForca/100);
   gl.uniform1f(u.cresce,cresce);gl.uniform1f(u.quebra,quebra);
   // brasas: saem dos pontos fortes do desenho da vez, voando do contato
   const eb=[],rb=aleatorio(0x1a9e);
   for(let j=0;j<nb&&im.fortes.length;j++){const [fx,fy]=im.fortes[Math.floor(rb()*im.fortes.length)],vida=.4+.5*rb(),T2=ue/vida;if(T2>=1||ue<.05)continue;
    const bx=(fx-im.ancora[0])*S,by=(fy-im.ancora[1])*S,a=Math.atan2(by,bx),v=S*(.25+.35*rb())*(1-(1-T2)**3);
    eb.push(bx+Math.cos(a)*v,by+Math.sin(a)*v+T2*T2*S*.12,R*.16*(1-T2)**.7*(.6+.6*rb()),0)}
   const e2=new Float32Array(96);e2.set(eb.slice(0,96));gl.uniform4fv(u['emb[0]'],e2);gl.uniform1i(u.nemb,eb.length/4);
   passada();return;
  }
  if(!camadasHit){passada();return}
  // Hit: de trás para a frente. A de trás quebra um pouco depois (a última a sumir), a da frente antes;
  // as brasas só na da frente.
  const todas=camadasHit;
  for(const {m,ci,total} of todas){
   const atraso=(total-1-ci)*.08,u2=Math.max(0,Math.min(1,ue-atraso*.5));
   gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texA);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,m.c);
   gl.uniform1f(u.raioD,m.raio);
   gl.uniform1f(u.cresce,(.4+.6*Math.min(1,1-(1-Math.min(1,u2/.18))**3))*(1+.3*u2));
   gl.uniform1f(u.quebra,Math.max(0,(u2-.42-atraso)/(.58-atraso))**1.25);
   gl.uniform1i(u.nemb,ci===total-1?emb.length/4:0);
   gl.uniform1f(u.brilho,ci===total-1?p.fzBrilho/100*.6:0);
   passada();
  }
 }
});

// ---- O desenho do dono ----
// Cada desenho é uma máscara de 512×512 (a prévia), guardada no tipo como PNG (fzDesenhoA/B).
// Pinta-se com pincel macio direto na prévia: onde a tinta acumula o efeito é forte (miolo claro),
// na beira do traço ele fica na cor. A prévia mostra o efeito pronto enquanto se desenha.
// Os desenhos já abertos ficam guardados pelo PNG (fazedorGuardados): trocar de tipo e voltar, ou
// uma composição com dois desenhos, não recarrega nada. fazedorAtual[campo] é o desenho na tela (o que
// está sendo pintado é uma cópia, que só vira um guardado novo quando o traço termina).
const fazedorGuardados=new Map(),fazedorCarregando=new Map(),fazedorAtual={};
function fazedorVazio(){const c=document.createElement('canvas');c.width=c.height=512;return {c,src:'',vazio:true,fortes:[],centro:[256,256],raio:100}}
function fazedorCarregar(valor){
 if(fazedorCarregando.has(valor))return fazedorCarregando.get(valor);
 const pr=new Promise(ok=>{const img=new Image();img.onload=()=>{const m=fazedorVazio();m.c.getContext('2d').drawImage(img,0,0,512,512);m.src=valor;fazedorFortes(m);
  fazedorGuardados.set(valor,m);fazedorCarregando.delete(valor);ok(m);preview()};img.onerror=()=>{fazedorCarregando.delete(valor);ok(null)};img.src=valor});
 fazedorCarregando.set(valor,pr);return pr;
}
function fazedorMascara(campo){
 const valor=el(campo).value||'',atual=fazedorAtual[campo];
 if(atual&&atual.src===valor)return atual;
 if(!valor)return fazedorAtual[campo]=fazedorVazio();
 if(fazedorGuardados.has(valor))return fazedorAtual[campo]=fazedorGuardados.get(valor);
 fazedorCarregar(valor);return fazedorVazio();
}
// Espera os desenhos que estão nos campos carregarem (aplicarTipo usa antes de montar ou exportar).
function fazedorEsperar(){
 const im=el('fzImagem').value,gr=el('fzImgGrade').value;
 return Promise.all(['fzDesenhoA','fzDesenhoB'].map(id=>{const v=el(id).value;return v&&!fazedorGuardados.has(v)?fazedorCarregar(v):null}).concat(im&&!fazedorImagens.has(gr+'|'+im)?[fazedorImagemCarregar(im,gr)]:[]));
}
// Os pontos fortes do desenho (de onde saem as brasas) e se ele está vazio.
function fazedorFortes(m){
 const d=m.c.getContext('2d',{willReadFrequently:true}).getImageData(0,0,512,512).data;m.fortes=[];
 for(let y=0;y<512;y+=8)for(let x=0;x<512;x+=8)if(d[(y*512+x)*4+3]>150)m.fortes.push([x,y]);
 m.vazio=!m.fortes.length&&![...Array(4096).keys()].some(k=>d[k*256+3]>20);
 // O centro (média dos pontos fortes) e o tamanho do desenho (de onde ele estoura e até onde quebra).
 const n=m.fortes.length;m.centro=n?[m.fortes.reduce((a,q)=>a+q[0],0)/n,m.fortes.reduce((a,q)=>a+q[1],0)/n]:[256,256];
 m.raio=n?Math.sqrt(m.fortes.reduce((a,q)=>a+(q[0]-m.centro[0])**2+(q[1]-m.centro[1])**2,0)/n)*1.4+10:100;
}
{
 const caixa=document.querySelector('.gerador-params[data-gerador="Fazedor"]'),bloco=document.createElement('div');bloco.className='fz-desenho';
 bloco.innerHTML=`<p class="nota">Desenhe a forma: pinte onde o efeito é forte. Traço grosso vira miolo claro, traço fino fica só na cor. Com o desenho do fim, o efeito se transforma do primeiro no segundo ao longo dos quadros.</p>
<button type="button" id="fzDesenhar">Desenhar na prévia</button>
<label>Qual desenho<select id="fzQual"><option value="fzDesenhoA">O do começo</option><option value="fzDesenhoB">O do fim</option></select></label>
<label>Tamanho do pincel <output id="fzPincelValor">40 px</output><input type="range" id="fzPincel" min="4" max="160" value="40"></label>
<label>Força do pincel (quente) <output id="fzPincelForcaValor">70%</output><input type="range" id="fzPincelForca" min="5" max="100" value="70"></label>
<label class="jogo-check">Afinar até a ponta (pontas afiadas)<input type="checkbox" id="fzAfinar" checked></label>
<label class="jogo-check">Borracha<input type="checkbox" id="fzBorracha"></label>
<button type="button" id="fzLimpar">Apagar este desenho</button>`;
 caixa.append(bloco);
}
let fazedorPintando=null,fazedorAtivo=false;
el('fzPincel').oninput=()=>{el('fzPincelValor').value=el('fzPincel').value+' px'};
el('fzPincelForca').oninput=()=>{el('fzPincelForcaValor').value=el('fzPincelForca').value+'%'};
el('fzDesenhar').onclick=()=>{
 fazedorAtivo=!fazedorAtivo;
 el('fzDesenhar').textContent=fazedorAtivo?'Pintando na prévia · terminar':'Desenhar na prévia';
 el('fzDesenhar').classList.toggle('primary',fazedorAtivo);
 stage.style.touchAction=fazedorAtivo?'none':'';
 if(fazedorAtivo&&el('fzForma').value!=='desenho'){el('fzForma').value='desenho';preview()}
};
el('fzLimpar').onclick=()=>{const campo=el('fzQual').value;el(campo).value='';fazedorMascara(campo);preview()};
// Uma pincelada: o traço inteiro é montado à parte (manchas macias, que se juntam num traço com o
// meio cheio e a beira macia) e entra no desenho com a força do pincel. Assim a força manda na cor:
// fraca fica no vermelho e laranja, forte chega no miolo claro. Passar de novo por cima reforça.
let fazedorAntes=null,fazedorTracoTela=null,fazedorPontos=[];
// O traço inteiro é redesenhado dos pontos a cada movimento: com "afinar", ele sai grosso de onde
// começou e afina até a ponta (a ponta acompanha o dedo); a caneta com pressão afina e engrossa.
// O traço de cone: pontos -> um traço (cinza sobre preto juntando as manchas pelo maior valor, que
// depois vira a tinta) no canvas t. Usado pelo pincel e pelo hit gerado.
function fazedorCone(t,pts,r0,afina){
 const g=t.getContext('2d',{willReadFrequently:true});
 g.globalCompositeOperation='source-over';g.fillStyle='#000';g.fillRect(0,0,512,512);g.globalCompositeOperation='lighten';
 const seg=[0];for(let i=1;i<pts.length;i++)seg.push(seg[i-1]+Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y));
 const total=seg.at(-1);let proxima=0,i=0;
 const mancha=(x,y,r)=>{if(r<.4)return;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#000000');
  g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill()};
 if(pts.length===1)mancha(pts[0].x,pts[0].y,r0*(pts[0].pr??1));
 for(let sd=0;pts.length>1&&sd<=total;sd+=.75){
  while(i<seg.length-2&&seg[i+1]<sd)i++;
  const k=(sd-seg[i])/Math.max(1e-6,seg[i+1]-seg[i]),A=pts[i],B=pts[i+1],pr=(A.pr??1)+((B.pr??1)-(A.pr??1))*k;
  const r=r0*pr*(afina?Math.max(.03,1-sd/Math.max(total,1))**.8:1);
  if(sd>=proxima){mancha(A.x+(B.x-A.x)*k,A.y+(B.y-A.y)*k,r);proxima=sd+Math.max(.6,r*.22)}
 }
 g.globalCompositeOperation='source-over';
 const im=g.getImageData(0,0,512,512),d=im.data;for(let i=0;i<d.length;i+=4){d[i+3]=d[i];d[i]=d[i+1]=d[i+2]=255}
 g.putImageData(im,0,0);
}
function fazedorRedesenhar(){fazedorCone(fazedorTracoTela,fazedorPontos,+el('fzPincel').value/2,el('fzAfinar').checked)}
function fazedorJuntar(){
 const m=fazedorMascara(el('fzQual').value),g=m.c.getContext('2d');
 g.save();g.globalCompositeOperation='copy';g.drawImage(fazedorAntes,0,0);g.restore();
 g.save();g.globalAlpha=+el('fzPincelForca').value/100;g.globalCompositeOperation=el('fzBorracha').checked?'destination-out':'source-over';
 g.drawImage(fazedorTracoTela,0,0);g.restore();m.vazio=false;
}
function fazedorTraco(p,e){
 const pr=e&&e.pointerType==='pen'&&e.pressure>0?.25+.75*e.pressure:1,u=fazedorPontos.at(-1);
 if(u&&Math.hypot(p.x-u.x,p.y-u.y)<2)return;
 fazedorPontos.push({x:p.x,y:p.y,pr});fazedorPintando=p;fazedorRedesenhar();fazedorJuntar();preview();
}
stage.addEventListener('pointerdown',e=>{
 if(!fazedorAtivo||el('kind').value!=='Fazedor')return;
 e.preventDefault();e.stopImmediatePropagation();stage.setPointerCapture(e.pointerId);fazedorPintando=null;
 const campo=el('fzQual').value,orig=fazedorMascara(campo),m=fazedorVazio();m.c.getContext('2d').drawImage(orig.c,0,0);m.src=orig.src;fazedorAtual[campo]=m;
 fazedorAntes=document.createElement('canvas');fazedorAntes.width=fazedorAntes.height=512;fazedorAntes.getContext('2d').drawImage(m.c,0,0);
 fazedorTracoTela=document.createElement('canvas');fazedorTracoTela.width=fazedorTracoTela.height=512;
 fazedorPontos=[];fazedorTraco(canvasPoint(e),e);
},true);
stage.addEventListener('pointermove',e=>{if(fazedorAtivo&&fazedorPintando)fazedorTraco(canvasPoint(e),e)});
stage.addEventListener('pointerup',()=>{
 if(!fazedorPintando)return;fazedorPintando=null;
 const campo=el('fzQual').value,m=fazedorMascara(campo);fazedorFortes(m);
 const url=m.vazio?'':m.c.toDataURL('image/png');el(campo).value=url;m.src=url;if(url)fazedorGuardados.set(url,m);preview();
});

// ---- Hit em camadas (gerado, sem pincel) ----
// Três camadas de pontas saindo do contato: atrás (maior, só até o laranja e amarelo), no meio e na
// frente (curta, chega no branco), cada ponta comprida, curva e de tamanho diferente. Antes de cada
// ponta entrar, um sulco com a forma dela (um pouco maior) é aberto no que já está desenhado: onde ela
// passa por cima de outra, fica a linha vermelha entre as duas (o contorno por dentro). Na frente, os
// raios de luz em zigue-zague. Cada "Gerar variação" (semente) dá outro hit; o resultado fica guardado.
const fazedorHitGuardado=new Map();
function fazedorHit(p,semente){
 const chave=JSON.stringify([semente,p.fzPontas,p.fzComprimento,p.fzCurva,p.fzAbre,p.fzAbertura,p.fzRaios,p.fzContorno,p.fzCamadas,p.fzTamanho]);
 if(fazedorHitGuardado.has(chave))return fazedorHitGuardado.get(chave);
 const rnd=generator((semente^0x417)>>>0),C=[256,256],tam=p.fzTamanho/100,L0=p.fzComprimento*tam,W0=58*tam,base=p.fzAbre*Math.PI/180,abre=p.fzAbertura*Math.PI/180;
 const tmp=document.createElement('canvas');tmp.width=tmp.height=512;
 const pincelada=(alvo,pts,r,forca,apagar)=>{fazedorCone(tmp,pts,r,true);const g=alvo.getContext('2d');g.save();g.globalAlpha=forca;
  g.globalCompositeOperation=apagar?'destination-out':'source-over';g.drawImage(tmp,0,0);g.restore()};
 const ponta=(a,comp,curva,de)=>{const pts=[];for(let k=0;k<=14;k++){const u=k/14,aa=a+curva*u*u,d=de+comp*u;pts.push({x:C[0]+Math.cos(aa)*d,y:C[1]+Math.sin(aa)*d})}return pts};
 const camadas=[];
 const conf=[{esc:1.2,qtd:.8,larg:1.1,forca:.66,miolo:0},{esc:1,qtd:1,larg:.95,forca:.86,miolo:.9},{esc:.68,qtd:.7,larg:.85,forca:1,miolo:.8}].slice(3-p.fzCamadas);
 for(const [ci,c] of conf.entries()){
  const m=fazedorVazio(),n=Math.max(3,Math.round(p.fzPontas*c.qtd));
  // miolo
  if(c.miolo)pincelada(m.c,[{x:C[0],y:C[1]}],W0*2.4*c.miolo,c.forca,false);
  const lista=[];
  for(let k=0;k<n;k++){
   const a=base+(k/n-.5)*abre+(rnd()-.5)*abre/n*1.4,lado=.55+.45*Math.cos(a-base);
   const comp=L0*c.esc*(.3+.7*rnd()**.6)*lado,curva=(rnd()-.5)*p.fzCurva/100*1.1,larg=W0*c.larg*(.55+.6*rnd())*(comp/L0)**.25;
   lista.push({a,comp,curva,larg,de:W0*(.3+.6*rnd())});
  }
  // as maiores primeiro (atrás), as menores por cima: os sulcos ficam nas pontas que cruzam
  lista.sort((x,y)=>y.comp-x.comp);
  for(const [j,q] of lista.entries()){
   const pts=ponta(q.a,q.comp,q.curva,q.de);
   if(j>0&&j<lista.length*.7&&p.fzContorno>0)pincelada(m.c,pts,q.larg*1.4,p.fzContorno/100*.38,true);
   pincelada(m.c,pts,q.larg,c.forca,false);
  }
  // raios de luz em zigue-zague, na camada da frente
  if(ci===conf.length-1)for(let k=0;k<p.fzRaios;k++){
   const a=base+(rnd()-.5)*abre*.9,comp=L0*(1.1+.6*rnd()),pts=[],dobras=1+Math.floor(rnd()*2),sx=-Math.sin(a),sy=Math.cos(a);
   for(let z=0;z<=dobras*2;z++){const u=z/(dobras*2),d=W0*.8+comp*u,off=(z%2?1:-1)*comp*.025*(z?1:0)*(1-u*.5);
    pts.push({x:C[0]+Math.cos(a)*d+sx*off,y:C[1]+Math.sin(a)*d+sy*off})}
   pincelada(m.c,pts,W0*.42,1,false);
  }
  fazedorFortes(m);m.centro=C;m.vazio=false;camadas.push({m,ci,total:conf.length});
 }
 if(fazedorHitGuardado.size>24)fazedorHitGuardado.delete(fazedorHitGuardado.keys().next().value);
 fazedorHitGuardado.set(chave,camadas);return camadas;
}

// ---- Imagem como forma ----
// O efeito vem de uma imagem (desenhada ou gerada) sobre fundo preto ou transparente. Fundo preto:
// a claridade vira o alfa e a cor é desfeita do preto (o efeito é luz). A âncora (o contato) é o meio
// da parte mais clara (o miolo). Guardada pela própria imagem.
const fazedorImagens=new Map(),fazedorImagensCarregando=new Map();
function fazedorImagem(url,grade='1x1'){
 if(!url)return null;const chave=grade+'|'+url;
 if(fazedorImagens.has(chave))return fazedorImagens.get(chave);
 fazedorImagemCarregar(url,grade);return null;
}
// Trata um desenho: fundo preto vira transparente (a claridade é o alfa e a cor é desfeita do preto);
// a âncora é o meio da parte mais clara (o miolo; sem miolo, a do desenho anterior).
function fazedorTratar(c,anterior){
 const W=c.width,H=c.height,x=c.getContext('2d',{willReadFrequently:true});
 const d=x.getImageData(0,0,W,H),a=d.data;let transparente=false;for(let i=3;i<a.length;i+=16)if(a[i]<250){transparente=true;break}
 let sx=0,sy=0,sn=0,mx=0,my=0,mn=0;const fortes=[];
 for(let i=0,k=0;i<a.length;i+=4,k++){
  if(!transparente){const m=Math.max(a[i],a[i+1],a[i+2]),al=Math.min(1,Math.max(0,(m/255-.04)/.3));
   if(al>0){const q=Math.max(al,m/255);a[i]=Math.min(255,a[i]/q);a[i+1]=Math.min(255,a[i+1]/q);a[i+2]=Math.min(255,a[i+2]/q)}a[i+3]=Math.round(al*255)}
  const lum=(a[i]*.3+a[i+1]*.55+a[i+2]*.15)/255*a[i+3]/255;
  if(lum>.9){sx+=k%W;sy+=Math.floor(k/W);sn++}
  if(a[i+3]>128){mx+=k%W;my+=Math.floor(k/W);mn++}
  if((lum>.55||lum>.25&&sn===0)&&k%37===0)fortes.push([(k%W)/W,Math.floor(k/W)/H]);
 }
 x.putImageData(d,0,0);
 const ancora=sn>W*H*.002?[sx/sn/W,sy/sn/H]:anterior?anterior.ancora:mn?[mx/mn/W,my/mn/H]:[.5,.5];
 return {c,ancora,fortes,cheio:mn};
}
function fazedorImagemCarregar(url,grade='1x1'){
 const chave=grade+'|'+url;
 if(fazedorImagensCarregando.has(chave))return fazedorImagensCarregando.get(chave);
 const pr=new Promise(ok=>{const img=new Image();img.onerror=()=>{fazedorImagensCarregando.delete(chave);ok()};img.onload=()=>{
  const [cols,lins]=grade.split('x').map(Number),w=Math.floor(img.width/cols),h=Math.floor(img.height/lins),seq=[];
  for(let r=0;r<lins;r++)for(let q=0;q<cols;q++){const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,q*w,r*h,w,h,0,0,w,h);
   const t=fazedorTratar(c,seq.at(-1));if(t.cheio>w*h*.002||seq.length===0)seq.push(t)}
  fazedorImagens.set(chave,seq);fazedorImagensCarregando.delete(chave);ok();preview();
 };img.src=url});
 fazedorImagensCarregando.set(chave,pr);return pr;
}
