// Hit (à mão): faísca de acerto desenhada como animação de anime, não como vetor.
//  - Borda de pincel: cada lado de cada ponta é uma linha que ondula e engrossa (subdividida e
//    deslocada por ruído), não uma reta.
//  - Faixas que não são cópias: o miolo é outro desenho, deslocado e mais torto que a borda.
//  - Pincel seco: riscos finos radiais comem a faixa de fora (o rastro da pincelada).
//  - Desenho novo a cada par de quadros (as pontas mudam de lugar e de tamanho), e a forma se quebra
//    em lascas que voam e afinam, em vez de crescer e encolher por escala.
registrarGerador({
 nome:'Hit (à mão)',
 perfil:{tint:'#ff8a1e',particles:14},
 params:[
  {id:'hitEstilo',rotulo:'Estilo',tipo:'select',padrao:'eletrico',opcoes:[['eletrico','Elétrico em camadas (concept)'],['pincel','Pincel']]},
  {id:'hitTamanho',rotulo:'Tamanho',tipo:'range',min:40,max:200,padrao:100,unidade:'%'},
  {id:'hitPontas',rotulo:'Pontas grandes',tipo:'range',min:4,max:18,padrao:11},
  {id:'hitDirecional',rotulo:'Puxa para a direção do golpe',tipo:'range',min:0,max:100,padrao:70,unidade:'%'},
  {id:'hitPincel',rotulo:'Pincel seco',tipo:'range',min:0,max:100,padrao:60,unidade:'%'},
  {id:'hitTorto',rotulo:'Traço torto',tipo:'range',min:0,max:100,padrao:60,unidade:'%'},
  {id:'hitLinhas',rotulo:'Linhas de impacto',tipo:'range',min:0,max:30,padrao:12},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const par=Math.floor(i/2),pal=p.paleta,forca=.75+p.forca/28,R=150*p.hitTamanho/100*forca,torto=p.hitTorto/100;
  const fogo=corMistura(p.cor,'#a01a06',.35);
  // Um desenho por par de quadros: o gerador de acaso muda com o par (a forma é redesenhada).
  const rnd=aleatorio(0x417+par*7919),base=aleatorio(0x417);
  // Etapas (em pares de quadros): 0 estoura, 1 abre, 2 parte, 3-4 lascas, 5+ fagulhas.
  const etapa=par,tam=[.82,1,1.05,1.08,1.1,1.1,1.1,1.1][etapa]??1.1;
  // As pontas: ângulos parecidos de um par para o outro (a mesma explosão), comprimentos não.
  const N=p.hitPontas,pontas=[];
  for(let j=0;j<N;j++){
   const a0=j/N*Math.PI*2+(base()-.5)*.7,a=a0+(rnd()-.5)*.22;
   const dir=Math.cos(a)*p.hitDirecional/100,comp=R*tam*(.35+.85*base()**1.5+.25*rnd())*(1+.7*dir)*(1-.3*(dir<0?-dir:0));
   pontas.push({a,comp,larg:(.08+.07*base())*R*(.8+.4*rnd())});
  }
  pontas.sort((x,y)=>x.a-y.a);
  // Contorno de uma ponta (dois lados curvos que ondulam) até a ponta, com vales entre as pontas.
  const caminho=(k,vale,miolo)=>{
   const pts=[];
   pontas.forEach((pt,j)=>{
    const prox=pontas[(j+1)%N],meio=(pt.a+((prox.a<pt.a?prox.a+Math.PI*2:prox.a)))/2;
    const c=pt.comp*k*(miolo?.55+.2*rnd():1),l=pt.larg*k;
    pts.push([Math.cos(pt.a-l/c*1.2)*c*.35,Math.sin(pt.a-l/c*1.2)*c*.35]);
    // a ponta, um pouco torta (gancho)
    const g=(rnd()-.5)*.16*torto;pts.push([Math.cos(pt.a+g)*c,Math.sin(pt.a+g)*c]);
    pts.push([Math.cos(pt.a+l/c*1.2)*c*.35,Math.sin(pt.a+l/c*1.2)*c*.35]);
    pts.push([Math.cos(meio)*R*vale*k,Math.sin(meio)*R*vale*k]);
   });
   return pts;
  };
  // Borda de pincel: subdivide cada lado e empurra pela normal com ruído (espessura que varia).
  const pincel=(pts,amp,sem)=>{
   const r=aleatorio(sem),out=[];
   for(let j=0;j<pts.length;j++){const [x0,y0]=pts[j],[x1,y1]=pts[(j+1)%pts.length],d=Math.hypot(x1-x0,y1-y0),m=Math.max(2,Math.round(d/14));
    const nx=-(y1-y0)/(d||1),ny=(x1-x0)/(d||1),curva=(r()-.5)*d*.22*torto;
    for(let s=0;s<m;s++){const t=s/m,arco=Math.sin(Math.PI*t)*curva+(s?(r()-.5)*amp*torto:0);out.push([x0+(x1-x0)*t+nx*arco,y0+(y1-y0)*t+ny*arco])}}
   return out;
  };
  const encher=(pts,cor)=>{ctx.beginPath();pts.forEach(([x,y],j)=>j?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=cor;ctx.fill()};
  // Pincel seco: riscos radiais finos que apagam parte da faixa de fora.
  const seco=(qtd,r0,r1,sem)=>{if(!qtd)return;const r=aleatorio(sem);ctx.save();ctx.globalCompositeOperation='destination-out';
   for(let j=0;j<qtd;j++){const a=r()*Math.PI*2,ra=r0+(r1-r0)*r(),c=(r1-r0)*(.25+.6*r()),g=1.6+r()*3.6;
    ctx.save();ctx.rotate(a);ctx.translate(ra+c/2,0);ctx.beginPath();caminhoLasca(ctx,c,g);ctx.fill();ctx.restore()}
   ctx.restore()};
  if(p.hitEstilo==='eletrico'&&etapa<=1){
   const r1=aleatorio(0x1e1+par),vermelho=corMistura(p.cor,'#d81a08',.7),fio=corMistura(p.cor,'#5a0600',.85),amarelo=corMistura(p.cor,'#fff04a',.7);
   // Pontas de uma camada: ângulos próprios (desencontrados das outras), comprimentos desiguais,
   // puxadas para a direção do golpe.
   const camada=(qtd,esc,sem)=>{const r=aleatorio(sem),ps=[];for(let j=0;j<qtd;j++){const a=j/qtd*Math.PI*2+(r()-.5)*.6,dir=Math.cos(a)*p.hitDirecional/100*.45;
    ps.push({a,c:R*tam*esc*(.45+.75*r()**1.3)*(1+.6*dir),l:R*(.14+.1*r())*esc})}return ps.sort((x,y)=>x.a-y.a)};
   // Contorno serrilhado: cada lado da ponta em zigue-zague (dentes desiguais), como raio.
   const contorno=(ps,vale,sem)=>{const r=aleatorio(sem),out=[];
    ps.forEach((pt,j)=>{const nx=ps[(j+1)%ps.length],meio=(pt.a+(nx.a<pt.a?nx.a+Math.PI*2:nx.a))/2;
     const lado=(a0,a1,r0,r1)=>{const m=4+Math.floor(r()*3);for(let s=0;s<=m;s++){const t=s/m,a=a0+(a1-a0)*t,rr=r0+(r1-r0)*t,dente=(s%2?1:-1)*(.02+.035*r())*torto*rr*.5;out.push([Math.cos(a+dente/Math.max(rr,1)*3)*rr,Math.sin(a+dente/Math.max(rr,1)*3)*rr])}};
     const base=pt.c*.22,ab=pt.l/Math.max(pt.c,1)*1.9;
     lado(pt.a-ab,pt.a,base,pt.c);lado(pt.a,pt.a+ab,pt.c,base);out.push([Math.cos(meio)*R*vale,Math.sin(meio)*R*vale]);});
    return out};
   const camadas=[[camada(N+3,1.12,0x101+par),vermelho,.36],[camada(N+1,.92,0x202+par),p.cor,.34],[camada(N,.7,0x303+par),amarelo,.32],[camada(N-2,.46,0x404+par),pal.miolo,.3]];
   camadas.forEach(([ps,cor,vale],k)=>{const pts=contorno(ps,vale*(1+.3*k),0x50+k+par);
    if(k===0){ctx.beginPath();pts.forEach(([x,y],j)=>j?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.lineWidth=Math.max(1.5,R*.018);ctx.strokeStyle=fio;ctx.lineJoin='miter';ctx.stroke()}
    encher(pts,cor);if(k<2)seco(Math.round((k?40:80)*p.hitPincel/100),R*.3,R*1.35,0x5c+k+par);
   });
   // A luz em volta vai por trás de tudo (depois do pincel seco, que não pode cortá-la).
   ctx.save();ctx.globalCompositeOperation='destination-over';brilhoFundo(ctx,R*1.5*tam,corMistura(p.cor,'#ff5a10',.4),etapa?.55:.8);ctx.restore();
   // O estouro branco do contato.
   const rr=R*(etapa?.24:.34),bl=[];for(let j=0;j<16;j++)bl.push([rr*(j%2?.5:1)*(.75+.5*r1()),j/16*Math.PI*2]);ctx.beginPath();caminhoEstrela(ctx,bl);ctx.fillStyle=pal.miolo;ctx.fill();
  }else if(etapa<=2){
   const parte=etapa===2;
   // Faixa de fora, com pincel seco; meio; miolo (outro desenho, deslocado).
   const fora=pincel(caminho(1,.2,false),R*.06,0x11+par);
   if(!parte){
    encher(fora,fogo);seco(Math.round(120*p.hitPincel/100),R*.22,R*1.4,0x5c+par);
    encher(pincel(caminho(.8,.19,false),R*.05,0x22+par),p.cor);seco(Math.round(50*p.hitPincel/100),R*.3,R*1.1,0x6d+par);
    const dx=(rnd()-.5)*R*.12,dy=(rnd()-.5)*R*.12;ctx.save();ctx.translate(dx,dy);
    encher(pincel(caminho(.66,.26,true),R*.05,0x33+par),pal.meio);
    encher(pincel(caminho(etapa?.5:.62,.3,true),R*.04,0x44+par),pal.miolo);
    // O clarão branco do contato no meio (irregular), maior no primeiro par.
    if(etapa<2){const rr=R*(etapa?.2:.3),bl=[];for(let j=0;j<14;j++)bl.push([rr*(j%2?.55:1)*(.8+.4*rnd()),j/14*Math.PI*2]);ctx.beginPath();caminhoEstrela(ctx,bl);ctx.fillStyle=pal.miolo;ctx.fill()}
    ctx.restore();
   }else{
    // Parte: cada ponta vira uma lasca solta (sem o centro), com a cor esfriando.
    for(const pt of pontas){const c=pt.comp*1.05,l=pt.larg*.8;ctx.save();ctx.rotate(pt.a);ctx.translate(c*.55,0);
     const lasca=pincel([[-c*.42,0],[-c*.08,-l/2],[c*.5,0],[-c*.08,l/2]],R*.05,0x77+pontas.indexOf(pt)+par);
     encher(lasca,fogo);encher(lasca.map(([x,y])=>[x*.72+c*.08,y*.55]),p.cor);encher(lasca.map(([x,y])=>[x*.45+c*.12,y*.25]),pal.miolo);ctx.restore()}
   }
  }else if(etapa<=4){
   // Lascas: afinam e voam para fora, cada vez mais finas e escuras.
   const v=(etapa-2)/2.5;
   for(const pt of pontas){const c=pt.comp*(1-v*.45),l=pt.larg*(.6-v*.35),d=pt.comp*(.7+v*.6);if(l<.8)continue;
    ctx.save();ctx.rotate(pt.a+(rnd()-.5)*.08);ctx.translate(d,0);
    const lasca=pincel([[-c*.4,0],[0,-l/2],[c*.45,0],[0,l/2]],R*.04,0x99+par+pontas.indexOf(pt));
    encher(lasca,fogo);encher(lasca.map(([x,y])=>[x*.7,y*.45]),etapa===3?pal.meio:p.cor);ctx.restore()}
  }
  // Linhas de impacto (mangá) só no estouro.
  if(etapa<=1)for(let j=0;j<p.hitLinhas;j++){const a=rnd()*Math.PI*2,r0=R*(1.05+.25*rnd()),c=R*(.3+.5*rnd()),g=1.4+rnd()*2.4;
   ctx.save();ctx.rotate(a);ctx.translate(r0+c/2,0);ctx.beginPath();caminhoLasca(ctx,c,g);ctx.fillStyle=etapa?pal.meio:pal.miolo;ctx.fill();ctx.restore()}
  // Fagulhas: pontos e riscos curtos que saem e se apagam afinando.
  const fr=aleatorio(0xfa9);
  for(let j=0;j<p.particulas;j++){const a=fr()*Math.PI*2+Math.cos(fr()*6)*.2,vel=.6+fr()*.8,vida=i/(n-1)/(.55+fr()*.4);if(vida<=.05||vida>=1)continue;
   const d=R*(.4+1.5*vel*Math.sqrt(vida)),s=(2+fr()*3.5)*forca*(1-vida);if(s<.6)continue;
   ctx.save();ctx.rotate(a);ctx.translate(d,0);ctx.beginPath();caminhoLasca(ctx,s*4.5,s);ctx.fillStyle=fr()<.5?pal.miolo:p.cor;ctx.fill();ctx.restore()}
 }
});
