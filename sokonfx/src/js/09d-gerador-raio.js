// Raio (eletricidade): raios em zigue-zague saem da origem para a frente (ou em volta), com
// ramificações. Cada par de quadros é um raio novo (o tremido da eletricidade, de dois em dois);
// miolo branco, faixa da cor, borda funda. No fim cada raio se parte em traços soltos que afinam.
registrarGerador({
 nome:'Raio',
 perfil:{tint:'#7aa8ff',particles:10},
 params:[
  {id:'raiQtd',rotulo:'Quantidade de raios',tipo:'range',min:1,max:10,padrao:3},
  {id:'raiComprimento',rotulo:'Comprimento',tipo:'range',min:40,max:260,padrao:150,unidade:' px'},
  {id:'raiEspalha',rotulo:'Espalhamento',tipo:'range',min:0,max:360,padrao:80,unidade:'°'},
  {id:'raiZigue',rotulo:'Zigue-zague',tipo:'range',min:0,max:100,padrao:55,unidade:'%'},
  {id:'raiRamos',rotulo:'Ramificações por raio',tipo:'range',min:0,max:6,padrao:2},
  {id:'raiEspessura',rotulo:'Espessura',tipo:'range',min:2,max:30,padrao:14,unidade:' px'},
  {id:'raiQuebra',rotulo:'Quebra no quadro',tipo:'range',min:2,max:14,padrao:8},
  {id:'raiBrilho',rotulo:'Brilho de fundo',tipo:'range',min:0,max:100,padrao:45,unidade:'%'},
  {id:'raiDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.raiDois),pal=p.paleta,escala=.75+p.forca/28;
  const L=p.raiComprimento*escala,W=p.raiEspessura*escala,u=q<p.raiQuebra?0:(q-p.raiQuebra+1)/(n-p.raiQuebra);
  // Nasce rápido: em 2 desenhos o raio chega ao comprimento todo.
  const chega=q===0?.82:1;
  brilhoFundo(ctx,L*.55,p.cor,p.raiBrilho/100*(1-u)**1.5*(q%4<2?1:.75));
  const cores=[pal.borda,pal.cor,pal.miolo],tam=[1,.62,.28];
  // Uma linha em zigue-zague de (0,0) até (comp, 0), deslocando os meios (sempre a mesma semente
  // no mesmo par de quadros).
  const zigue=(rnd,comp,amp,passos=3)=>{let pts=[[0,0],[comp,0]];
   for(let s=0;s<passos&&pts.length<40;s++){const novo=[pts[0]];
    for(let j=1;j<pts.length;j++){const [a,b]=[pts[j-1],pts[j]],d=Math.hypot(b[0]-a[0],b[1]-a[1]);
     novo.push([(a[0]+b[0])/2+(rnd()-.5)*d*amp*.3,(a[1]+b[1])/2+(rnd()-.5)*d*amp*1.15]);novo.push(b)}
    pts=novo;if(pts.length>=9)break}
   return pts;
  };
  const desenhaRaio=(pts,w,u)=>{
   const m=pts.length-1,ls=pts.map((_,j)=>w*Math.max(.15,1-j/m)**.8);
   if(u===0){faixas(ctx,k=>caminhoFita(ctx,pts,ls,k),cores,tam);return}
   // Partido: só alguns trechos sobram, cada vez mais curtos e finos.
   const rnd=aleatorio(0xb17+m);
   for(let j=0;j<m;j+=2){if(rnd()<u*.6)continue;
    const a=pts[j],b=pts[Math.min(m,j+1)],enc=u*.5;
    const t0=enc/2,t1=1-enc/2,pa=[a[0]+(b[0]-a[0])*t0,a[1]+(b[1]-a[1])*t0],pb=[a[0]+(b[0]-a[0])*t1,a[1]+(b[1]-a[1])*t1];
    const lw=ls[j]*(1-u)**1.2;if(lw<.6)continue;
    faixas(ctx,k=>caminhoFita(ctx,[pa,[(pa[0]+pb[0])/2,(pa[1]+pb[1])/2],pb],[lw*.2,lw,lw*.2],k),cores,tam);
   }
  };
  const base=aleatorio(0x7a1),par=aleatorio(0x5eed+q*104729);
  for(let r=0;r<p.raiQtd;r++){
   const dir=(p.raiQtd===1?0:(r/(p.raiQtd-1)-.5))*p.raiEspalha*Math.PI/180+(base()-.5)*.25;
   const comp=L*(.7+.3*base())*chega,pts=zigue(par,comp,p.raiZigue/100);
   ctx.save();ctx.rotate(dir);
   desenhaRaio(pts,W,u);
   // Ramos: saem de um ponto do raio, mais curtos e finos.
   for(let k=0;k<p.raiRamos;k++){
    const j=1+Math.floor(par()*(pts.length-3)),o=pts[j],ang=(par()<.5?-1:1)*(.35+par()*.6);
    ctx.save();ctx.translate(o[0],o[1]);ctx.rotate(ang);
    desenhaRaio(zigue(par,comp*(.22+.3*par()),p.raiZigue/100,2),W*.6,u);ctx.restore();
   }
   ctx.restore();
  }
  // Fagulhas: pontinhos que pulam e somem.
  const fr=aleatorio(0xfa6+q*31);
  for(let j=0;j<p.particulas;j++){
   const a=(fr()-.5)*Math.max(.6,p.raiEspalha*Math.PI/180)*1.3,d=L*(.2+.9*fr())*chega,s=(2+fr()*4)*(1-u);
   if(s<.6)continue;
   ctx.save();ctx.rotate(a);ctx.translate(d,(fr()-.5)*30);ctx.rotate(fr()*6);
   faixas(ctx,k=>caminhoLasca(ctx,s*3,s,k),[pal.cor,pal.miolo],[1,.5]);ctx.restore();
  }
  // Estalo de origem nos primeiros desenhos.
  if(q<2){const r=W*3.2*(q?1:1.2);faixas(ctx,k=>caminhoEstrela(ctx,[[r,0],[r*.25,Math.PI/4],[r*.7,Math.PI/2],[r*.25,3*Math.PI/4],[r*.9,Math.PI],[r*.25,5*Math.PI/4],[r*.7,3*Math.PI/2],[r*.25,7*Math.PI/4]],k),[pal.cor,pal.miolo],[1,.55])}
 }
});
