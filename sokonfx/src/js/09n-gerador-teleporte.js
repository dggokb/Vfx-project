// Teletransporte (vanish): o sumiço do anime. Uma coluna de riscos verticais de luz (a altura do
// lutador) que aparece cheia no contato, treme a cada par de quadros e encolhe para o meio e para
// cima até virar um fio e sumir; faíscas sobem. "Aparecer" toca o mesmo ao contrário.
registrarGerador({
 nome:'Teletransporte',
 perfil:{tint:'#7af0ff',particles:14},
 semGiro:true,origem:{y:470},
 params:[
  {id:'telModo',rotulo:'Modo',tipo:'select',padrao:'some',opcoes:[['some','Sumir'],['aparece','Aparecer']]},
  {id:'telAltura',rotulo:'Altura (o lutador)',tipo:'range',min:100,max:420,padrao:330,unidade:' px'},
  {id:'telLargura',rotulo:'Largura',tipo:'range',min:30,max:220,padrao:110,unidade:' px'},
  {id:'telRiscos',rotulo:'Riscos',tipo:'range',min:4,max:40,padrao:16},
  {id:'telDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  let q=doisEmDois(i,p.telDois);if(p.telModo==='aparece')q=n-1-q-(p.telDois&&(n-1-q)%2?1:0);
  const t=Math.max(0,q)/(n-1),pal=p.paleta,forca=.75+p.forca/28;
  const H=Math.min(440,p.telAltura*forca),W=p.telLargura*forca,fecha=suave(Math.min(1,t*1.4));
  const rnd=aleatorio(0x7e1+q*7919);
  // Riscos: fitas verticais pontudas, a coluna fecha para o meio e sobe.
  for(let j=0;j<p.telRiscos;j++){
   const x=(rnd()-.5)*W*(1-fecha*.92),alto=H*(.45+.55*rnd())*(1-fecha*.55),base=-rnd()*H*.15-fecha*H*.25,g=(3+rnd()*7)*forca*(1-fecha*.7);
   if(g<.6||alto<4)continue;
   ctx.save();ctx.translate(x,base-alto/2);ctx.rotate(-Math.PI/2);
   faixas(ctx,k=>caminhoLasca(ctx,alto,g,k),[pal.borda,pal.cor,pal.miolo],[1,.7,.36]);ctx.restore();
  }
  // Fio do meio: o último a sumir.
  if(t<.95){const g=W*.18*(1-t)**1.6,alto=H*(1-t*.6);
   if(g>.6){ctx.save();ctx.translate(0,-H*.5-t*H*.2);ctx.rotate(-Math.PI/2);faixas(ctx,k=>caminhoLasca(ctx,alto,g,k),[pal.cor,pal.meio,pal.miolo],[1,.66,.34]);ctx.restore()}}
  // Faíscas que sobem.
  const fr=aleatorio(0x5be);
  for(let j=0;j<p.particulas;j++){
   const x=(fr()-.5)*W,y=-fr()*H-t*H*.6*(.5+fr()),s=(2+fr()*4)*forca*(1-t);
   if(s<.6||y<-430)continue;
   ctx.save();ctx.translate(x,y);ctx.rotate(-Math.PI/2);faixas(ctx,k=>caminhoLasca(ctx,s*4,s,k),[pal.cor,pal.miolo],[1,.5]);ctx.restore();
  }
 }
});
