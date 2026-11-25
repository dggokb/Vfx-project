// Partículas: um emissor genérico (a bíblia: emissor, forças, giro). Forma, leque, velocidade,
// gravidade, giro e vida; cada partícula em duas faixas chapadas (cor e miolo), encolhendo até sumir.
registrarGerador({
 nome:'Partículas',
 perfil:{tint:'#ffd36a',particles:36},
 params:[
  {id:'parForma',rotulo:'Forma',tipo:'select',padrao:'losango',opcoes:[['losango','Losango'],['bola','Bola'],['estrela','Estrela'],['lasca','Lasca'],['pena','Pena / folha'],['quadrado','Quadrado (cubo)']]},
  {id:'parLeque',rotulo:'Leque',tipo:'range',min:0,max:360,padrao:140,unidade:'°'},
  {id:'parVelocidade',rotulo:'Velocidade',tipo:'range',min:0,max:200,padrao:100,unidade:'%'},
  {id:'parGravidade',rotulo:'Gravidade',tipo:'range',min:-100,max:200,padrao:40,unidade:'%'},
  {id:'parGiro',rotulo:'Giro',tipo:'range',min:0,max:200,padrao:60,unidade:'%'},
  {id:'parTamanho',rotulo:'Tamanho',tipo:'range',min:20,max:300,padrao:100,unidade:'%'},
  {id:'parVida',rotulo:'Vida',tipo:'range',min:20,max:100,padrao:80,unidade:'%'},
  {id:'parEmissor',rotulo:'Emissor',tipo:'select',padrao:'ponto',opcoes:[['ponto','Ponto'],['linha','Linha (de pé)'],['chao','Linha no chão'],['circulo','Círculo']]},
  {id:'parArea',rotulo:'Tamanho do emissor',tipo:'range',min:0,max:230,padrao:80,unidade:' px'},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const t=i/(n-1),pal=p.paleta,forca=.75+p.forca/28,rnd=aleatorio(0x9a47),leque=p.parLeque*Math.PI/180;
  const forma=(s,k)=>{switch(p.parForma){
   case 'bola':ctx.arc(0,0,s*k,0,Math.PI*2);break;
   case 'estrela':caminhoEstrela(ctx,[[s,0],[s*.3,Math.PI/4],[s,Math.PI/2],[s*.3,3*Math.PI/4],[s,Math.PI],[s*.3,5*Math.PI/4],[s,3*Math.PI/2],[s*.3,7*Math.PI/4]],k);break;
   case 'lasca':caminhoLasca(ctx,s*3.2,s*.9,k);break;
   case 'pena':ctx.moveTo(-s*1.6*k,0);ctx.quadraticCurveTo(0,-s*.9*k,s*1.6*k,0);ctx.quadraticCurveTo(0,s*.5*k,-s*1.6*k,0);break;
   case 'quadrado':ctx.rect(-s*k*.8,-s*k*.8,s*k*1.6,s*k*1.6);break;
   default:ctx.moveTo(-s*1.3*k,0);ctx.lineTo(0,-s*.75*k);ctx.lineTo(s*1.3*k,0);ctx.lineTo(0,s*.75*k);ctx.closePath()}};
  for(let j=0;j<p.particulas;j++){
   const a=(rnd()-.5)*leque,v=(120+300*rnd())*p.parVelocidade/100*forca,vida=p.parVida/100*(.55+.45*rnd()),atraso=rnd()*.15;
   const T=(t-atraso)/vida;if(T<=0||T>=1)continue;
   const e=rnd()-.5,ea=rnd()*Math.PI*2,[ex,ey]=p.parEmissor==='linha'?[0,e*p.parArea*2]:p.parEmissor==='chao'?[e*p.parArea*2,0]:p.parEmissor==='circulo'?[Math.cos(ea)*p.parArea,Math.sin(ea)*p.parArea]:[0,0];
   const tt=T*vida*.8,g=500*p.parGravidade/100,x=ex+Math.cos(a)*v*tt*(1-tt*.3),y=ey+Math.sin(a)*v*tt+g*tt*tt;
   const s=(7+7*rnd())*p.parTamanho/100*forca*(1-T)**.6;if(s<.6)continue;
   ctx.save();ctx.translate(x,y);ctx.rotate(rnd()*6.28+tt*(rnd()-.5)*20*p.parGiro/100);
   faixas(ctx,k=>forma(s,k),[pal.borda,pal.cor,pal.miolo],[1,.78,.4]);ctx.restore();
  }
 }
});
