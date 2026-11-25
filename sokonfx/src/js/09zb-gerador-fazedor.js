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
 float v,f,n;float r=length(p);
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
 }else{
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
 }
 // Degraus chapados, com a beira de cada degrau macia em um pixel.
 float aa=max(fwidth(v)*.9,.004);vec3 c=cor[0];float al=smoothstep(LIM[0]-aa,LIM[0]+aa,v);
 for(int k=1;k<5;k++)c=mix(c,cor[k],smoothstep(LIM[k]-aa,LIM[k]+aa,v));
 // Brilho: abaixo do primeiro degrau, o campo ainda acende um véu da cor (abraça a forma), e um
 // halo redondo no centro (bola e estouro).
 float veu=smoothstep(LIM[0]-.45,LIM[0],v);veu=veu*veu*.5*brilho;
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
 const u={};for(const n of ['res','m0','m1','t','T','R','L','amp','esc','vel','cresce','quebra','anel1','anel2','brilho','halo','forma','ruido','nemb','emb[0]','cor[0]'])u[n]=gl.getUniformLocation(pr,n);
 return fazedorGL={tela,gl,u};
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
  {id:'fzForma',rotulo:'Forma',tipo:'select',padrao:'voo',opcoes:[['voo','Bola em voo (loop)'],['estouro','Estouro'],['coluna','Coluna / labareda (loop)'],['aura','Aura no corpo (loop)']]},
  {id:'fzRuido',rotulo:'Matéria',tipo:'select',padrao:'fogo',opcoes:[['fogo','Fogo'],['eletrico','Elétrico'],['fumaca','Fumaça / vapor']]},
  {id:'fzTamanho',rotulo:'Tamanho',tipo:'range',min:40,max:200,padrao:100,unidade:'%'},
  {id:'fzAlcance',rotulo:'Cauda / altura',tipo:'range',min:40,max:400,padrao:260,unidade:' px'},
  {id:'fzForca',rotulo:'Força do ruído',tipo:'range',min:0,max:200,padrao:100,unidade:'%'},
  {id:'fzEscala',rotulo:'Tamanho do ruído',tipo:'range',min:40,max:250,padrao:100,unidade:'%'},
  {id:'fzVelocidade',rotulo:'Velocidade',tipo:'range',min:0,max:300,padrao:100,unidade:'%'},
  {id:'fzBrilho',rotulo:'Brilho em volta',tipo:'range',min:0,max:200,padrao:100,unidade:'%'},
  {id:'fzAneis',rotulo:'Anéis em volta da bola',tipo:'checkbox',padrao:true},
  {id:'fzDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:false},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const g=fazedorContexto();
  if(!g){ctx.fillStyle='#fff';ctx.font='16px sans-serif';ctx.fillText('Este navegador não tem WebGL2 (o Fazedor precisa).',-200,0);return}
  const {tela,gl,u}=g,W=ctx.canvas.width,H=ctx.canvas.height;
  if(tela.width!==W||tela.height!==H){tela.width=W;tela.height=H}
  const q=doisEmDois(i,p.fzDois),forma=['voo','estouro','coluna','aura'].indexOf(p.fzForma);
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
  const M=ctx.getTransform().inverse();
  gl.viewport(0,0,W,H);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform2f(u.res,W,H);gl.uniform3f(u.m0,M.a,M.c,M.e);gl.uniform3f(u.m1,M.b,M.d,M.f);
  gl.uniform1f(u.t,q);gl.uniform1f(u.T,n);gl.uniform1f(u.R,R);gl.uniform1f(u.L,L);
  gl.uniform1f(u.amp,p.fzForca/100);gl.uniform1f(u.esc,p.fzEscala/100);gl.uniform1f(u.vel,p.fzVelocidade/100);
  gl.uniform1i(u.forma,forma);gl.uniform1i(u.ruido,['fogo','eletrico','fumaca'].indexOf(p.fzRuido));
  const giro=q/n*Math.PI*4,aneis=forma===0&&p.fzAneis;
  gl.uniform1f(u.anel1,aneis?R*(.12+.5*Math.abs(Math.cos(giro))):0);gl.uniform1f(u.anel2,aneis?R*(.12+.5*Math.abs(Math.sin(giro))):0);
  gl.uniform1f(u.cresce,forma===1?(.4+.6*Math.min(1,1-(1-Math.min(1,ue/.18))**3))*(1+.3*ue):1);
  gl.uniform1f(u.quebra,forma===1?Math.max(0,(ue-.42)/.58)**1.25:0);
  gl.uniform1f(u.brilho,p.fzBrilho/100);gl.uniform1f(u.halo,forma===0?p.fzBrilho/100:forma===1?p.fzBrilho/100*Math.max(0,1-ue*1.6):0);
  const e=new Float32Array(96);e.set(emb.slice(0,96));gl.uniform4fv(u['emb[0]'],e);gl.uniform1i(u.nemb,emb.length/4);
  gl.uniform3fv(u['cor[0]'],new Float32Array(fazedorDegraus(p.cor)));
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(tela,0,0);ctx.restore();
 }
});
