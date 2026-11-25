// Faíscas: um leque de riscos de luz que saem rápido do ponto, esticados pela velocidade, caem com
// gravidade, encurtam e se apagam afinando. Brilho curto no ponto, no começo.
registrarGerador({
 nome:'Faíscas',
 perfil:{tint:'#ffb431',particles:40},
 params:[
  {id:'faiCone',rotulo:'Abertura do leque',tipo:'range',min:10,max:360,padrao:110,unidade:'°'},
  {id:'faiVelocidade',rotulo:'Velocidade',tipo:'range',min:20,max:200,padrao:100,unidade:'%'},
  {id:'faiGravidade',rotulo:'Gravidade',tipo:'range',min:0,max:200,padrao:80,unidade:'%'},
  {id:'faiRastro',rotulo:'Rastro',tipo:'range',min:0,max:200,padrao:100,unidade:'%'},
  {id:'faiTamanho',rotulo:'Grossura',tipo:'range',min:30,max:250,padrao:100,unidade:'%'},
  {id:'faiDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:false},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.faiDois),t=q/(n-1),pal=p.paleta,forca=.75+p.forca/28;
  const rnd=aleatorio(0xfa15),cone=p.faiCone*Math.PI/180,g=420*p.faiGravidade/100;
  if(q<3){const r=26*forca*[1.3,1,.5][q];brilhoFundo(ctx,r*2.4,p.cor,.8);
   faixas(ctx,k=>caminhoEstrela(ctx,[[r,0],[r*.2,Math.PI/4],[r*.7,Math.PI/2],[r*.2,3*Math.PI/4],[r*.9,Math.PI],[r*.2,5*Math.PI/4],[r*.7,3*Math.PI/2],[r*.2,7*Math.PI/4]],k),[pal.meio,pal.miolo],[1,.55]);}
  for(let j=0;j<p.particulas;j++){
   const a=(rnd()-.5)*cone,v=(260+340*rnd())*p.faiVelocidade/100*forca,vida=.45+.55*rnd(),larg=(3.6+4*rnd())*p.faiTamanho/100*forca;
   const tt=t*.6/vida;if(tt>=.6)continue;
   const T=tt,k=1-T/.6;
   const x=Math.cos(a)*v*T,y=Math.sin(a)*v*T+g*T*T/2,vx=Math.cos(a)*v,vy=Math.sin(a)*v+g*T;
   const vel=Math.hypot(vx,vy),comp=Math.max(larg*2,(14+vel*.09)*p.faiRastro/100*(.4+.6*k));
   const lw=larg*(.35+.65*k);if(lw<.5)continue;
   ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(vy,vx));
   faixas(ctx,kk=>caminhoLasca(ctx,comp,lw,kk),[pal.borda,pal.cor,pal.miolo],[1,.75,.42]);ctx.restore();
  }
 }
});
