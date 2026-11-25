// Detritos (terra, pedra, estilhaços): pedaços irregulares sobem do contato, giram, caem com
// gravidade e quicam no chão; poeira chapada abre no chão e se parte em bolas que somem. Não é
// luz: pedra tem lado aceso e lado de sombra (duas cores chapadas), sem contorno preto.
registrarGerador({
 nome:'Detritos',
 perfil:{tint:'#a68a6a',particles:16},
 semGiro:true,origem:{y:400},
 params:[
  {id:'detQtd',rotulo:'Pedaços',tipo:'range',min:3,max:40,padrao:14},
  {id:'detTamanho',rotulo:'Tamanho dos pedaços',tipo:'range',min:20,max:250,padrao:100,unidade:'%'},
  {id:'detForcaPulo',rotulo:'Força do estouro',tipo:'range',min:20,max:220,padrao:145,unidade:'%'},
  {id:'detEspalha',rotulo:'Espalhamento',tipo:'range',min:10,max:180,padrao:120,unidade:'°'},
  {id:'detDirecao',rotulo:'Para onde vão',tipo:'range',min:-90,max:90,padrao:0,unidade:'°'},
  {id:'detGravidade',rotulo:'Gravidade',tipo:'range',min:0,max:200,padrao:100,unidade:'%'},
  {id:'detPoeira',rotulo:'Poeira no chão',tipo:'checkbox',padrao:true},
  {id:'detCorPoeira',rotulo:'Clareza da poeira',tipo:'range',min:0,max:100,padrao:60,unidade:'%'},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const t=i/(n-1),forca=.75+p.forca/28,pal=p.paleta;
  const aceso=corMistura(p.cor,'#ffffff',.35),sombra=corMistura(p.cor,'#1a1420',.42),risco=corMistura(p.cor,'#ffffff',.7);
  const chao=0,g=900*p.detGravidade/100,v0=520*p.detForcaPulo/100*forca;
  const perto=(x,y,r)=>Math.max(0,Math.min(1,(240-Math.abs(x)-r)/40,(y+392-r)/40));
  // Poeira: bolas chapadas que abrem no chão (emissão, expansão) e se partem e somem (dispersão).
  if(p.detPoeira){
   const pr=aleatorio(0xd057),cor=corMistura(p.cor,'#e8e2da',p.detCorPoeira/100),somb=corMistura(cor,'#3a3340',.25);
   for(let j=0;j<9;j++){
    const lado=(j/8-.5)*2,abre=suave(Math.min(1,t*2.6)),r=(16+pr()*22)*forca*(1-Math.max(0,t-.45)/.55*.9);
    const x=lado*150*forca*abre*(.6+.4*pr()),y=chao-r*.55-pr()*10*abre;
    if(r<2||t>.97)continue;
    ctx.fillStyle=somb;ctx.beginPath();ctx.ellipse(x,y,r*1.15,r*.85,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=cor;ctx.beginPath();ctx.ellipse(x-r*.12,y-r*.14,r*.95,r*.66,0,0,Math.PI*2);ctx.fill();
   }
  }
  // Pedaços: polígonos irregulares; física simples com quique (perde 45% da velocidade).
  const rnd=aleatorio(0x5a3);
  const dir=-Math.PI/2+p.detDirecao*Math.PI/180,esp=p.detEspalha*Math.PI/180;
  for(let j=0;j<p.detQtd;j++){
   const a=dir+(rnd()-.5)*esp,v=v0*(.45+.65*rnd()),tam=(7+rnd()*16)*p.detTamanho/100*forca,lados=5+Math.floor(rnd()*3);
   const forma=[...Array(lados)].map((_,k)=>[(.65+.45*rnd())*tam,k/lados*Math.PI*2+rnd()*.5]);
   const giro=(rnd()-.5)*14,atraso=rnd()*.08,T=Math.max(0,t-atraso)*0.75;
   let vx=Math.cos(a)*v,vy=Math.sin(a)*v,x=0,y=-4,tt=T;
   // Integra em pedaços de tempo até T, com quique no chão.
   for(let s=0;s<60&&tt>0;s++){const dt=Math.min(tt,.0125);x+=vx*dt;y+=vy*dt;vy+=g*dt;if(y>chao-tam*.5&&vy>0){y=chao-tam*.5;vy*=-.45;vx*=.7}tt-=dt}
   // No fim encolhem e se partem (somem quebrando).
   const fim=Math.max(0,(t-.7)/.3),k=(1-fim)*perto(x,y,tam*1.2);
   if(k<=.05)continue;
   ctx.save();ctx.translate(x,y);ctx.rotate(giro*T);ctx.scale(k,k);
   ctx.beginPath();caminhoEstrela(ctx,forma);ctx.fillStyle=sombra;ctx.fill();
   ctx.beginPath();caminhoEstrela(ctx,forma.map(([r,an])=>[r*.78,an]),1);ctx.save();ctx.clip();
   ctx.fillStyle=aceso;ctx.beginPath();ctx.ellipse(-tam*.25,-tam*.3,tam*.85,tam*.65,0,0,Math.PI*2);ctx.fill();ctx.restore();
   ctx.fillStyle=risco;ctx.beginPath();caminhoLasca(ctx,tam*.7,tam*.16);ctx.save();ctx.translate(0,0);ctx.restore();
   ctx.restore();
  }
  // Pedrinhas: pontos que sobem mais alto e caem rápido.
  const pr2=aleatorio(0x9e1);
  for(let j=0;j<p.particulas;j++){
   const a=dir+(pr2()-.5)*esp*1.2,v=v0*(.7+.6*pr2()),T=t*.75,x=Math.cos(a)*v*T,y=Math.sin(a)*v*T+g*T*T/2,s=(2+pr2()*3)*forca*(1-Math.max(0,t-.6)/.4);
   const ss=s*perto(x,y,s);if(y>chao||ss<.6)continue;
   ctx.fillStyle=pr2()<.5?aceso:sombra;ctx.beginPath();ctx.arc(x,y,ss,0,Math.PI*2);ctx.fill();
  }
 }
});
