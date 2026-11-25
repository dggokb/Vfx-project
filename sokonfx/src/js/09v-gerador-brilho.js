// Brilhos e flashes. Brilho: estrelinhas de quatro pontas que piscam e giram espalhadas (o brilho
// de preparação, o "plim" de um olho ou de uma lâmina). Clarão: disco branco de borda pontuda que
// cobre tudo por 2 quadros e se abre num anel que se parte (o flash do contato forte).
registrarGerador({
 nome:'Brilhos e flashes',
 perfil:{tint:'#fff1a8',particles:0},
 params:[
  {id:'briTipo',rotulo:'Tipo',tipo:'select',padrao:'brilho',opcoes:[['brilho','Brilho (estrelinhas)'],['clarao','Clarão (flash)']]},
  {id:'briQtd',rotulo:'Quantidade',tipo:'range',min:1,max:20,padrao:5},
  {id:'briTamanho',rotulo:'Tamanho',tipo:'range',min:20,max:250,padrao:100,unidade:'%'},
  {id:'briEspalha',rotulo:'Espalhamento',tipo:'range',min:0,max:220,padrao:120,unidade:' px'},
  {id:'briDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.briDois),pal=p.paleta,forca=.75+p.forca/28,S=p.briTamanho/100*forca,rnd=aleatorio(0xb71);
  if(p.briTipo==='clarao'){
   const R=Math.min(220,150*S);
   if(q<2){const raios=[];for(let j=0;j<32;j++)raios.push([R*(j%2?.82:1+.1*rnd())*(q?1:.9),j*Math.PI/16]);
    faixas(ctx,k=>caminhoEstrela(ctx,raios,k),[pal.cor,pal.meio,pal.miolo],[1,.86,.7]);return}
   const v=(q-2)/(n-3),r=R*(1+v*.4),w=R*.22*(1-v)**1.4;if(w<.6)return;
   for(let j=0;j<10;j++){const a0=j/10*Math.PI*2+rnd()*.2,a1=a0+Math.PI*2/10*(1-v*.7);
    faixas(ctx,k=>{const m=8,pts=[],ls=[];for(let s=0;s<=m;s++){const a=a0+(a1-a0)*s/m;pts.push([Math.cos(a)*r,Math.sin(a)*r]);ls.push(w*Math.pow(Math.min(s,m-s)/(m/2),.6))}caminhoFita(ctx,pts,ls,k)},[pal.cor,pal.miolo],[1,.5])}
   return;
  }
  // Estrelinhas: cada uma nasce num quadro, abre, gira um pouco e fecha (2 a 6 desenhos).
  for(let j=0;j<p.briQtd;j++){
   const x=(rnd()-.5)*2*p.briEspalha*(j?1:0),y=(rnd()-.5)*2*p.briEspalha*.7*(j?1:0),ini=Math.floor(rnd()*(n*.55)),dur=3+Math.floor(rnd()*7),tam=(30+40*rnd())*S;
   const v=(q-ini)/dur;if(v<0||v>1)continue;
   const k=Math.sin(Math.PI*v)**.7,r=tam*k,giro=v*.6;
   if(r<1)continue;
   ctx.save();ctx.translate(x,y);ctx.rotate(giro);
   faixas(ctx,kk=>caminhoEstrela(ctx,[[r,0],[r*.12,Math.PI/4],[r*.62,Math.PI/2],[r*.12,3*Math.PI/4],[r,Math.PI],[r*.12,5*Math.PI/4],[r*.62,3*Math.PI/2],[r*.12,7*Math.PI/4]],kk),[pal.cor,pal.meio,pal.miolo],[1,.66,.36]);
   // Riscos em X finos, maiores que a estrela.
   ctx.rotate(Math.PI/4);for(const a of [0,Math.PI/2]){ctx.save();ctx.rotate(a);faixas(ctx,kk=>caminhoLasca(ctx,r*2.2,r*.06+1,kk),[pal.meio,pal.miolo],[1,.5]);ctx.rotate(Math.PI);faixas(ctx,kk=>caminhoLasca(ctx,r*2.2,r*.06+1,kk),[pal.meio,pal.miolo],[1,.5]);ctx.restore()}
   ctx.restore();
  }
 }
});
