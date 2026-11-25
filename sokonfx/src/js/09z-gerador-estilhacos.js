// Estilhaços: o que o golpe joga longe na linha dele, para os dois lados (o concept do dono):
// lâminas brancas curvas (como talhos de faca, com a sombra cinza-clara num lado) e raios amarelos em
// zigue-zague grosso; saem já longos no contato, correm para fora, afinam e somem; fagulhas junto.
registrarGerador({
 nome:'Estilhaços',
 perfil:{tint:'#ffc21e',particles:16},
 params:[
  {id:'estLaminas',rotulo:'Lâminas brancas',tipo:'range',min:0,max:20,padrao:7},
  {id:'estRaios',rotulo:'Raios',tipo:'range',min:0,max:16,padrao:5},
  {id:'estComprimento',rotulo:'Comprimento',tipo:'range',min:30,max:200,padrao:100,unidade:'%'},
  {id:'estAbertura',rotulo:'Abertura em volta da linha',tipo:'range',min:5,max:180,padrao:55,unidade:'°'},
  {id:'estTras',rotulo:'Para trás também',tipo:'range',min:0,max:100,padrao:55,unidade:'%'},
  {id:'estDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.estDois),t=q/(n-1),pal=p.paleta,forca=.75+p.forca/28,L=165*p.estComprimento/100*forca,ab=p.estAbertura*Math.PI/180;
  const rnd=aleatorio(0xe57),cinza='#c9ccd6',laranja=corMistura(p.cor,'#d0300a',.55);
  const direcao=()=>{const tras=rnd()*100<p.estTras;return (tras?Math.PI:0)+(rnd()-.5)*ab};
  const vida=(atraso,dur)=>Math.max(0,Math.min(1,(t-atraso)/dur));
  // Lâmina: um lado reto, o outro em arco, ponta fina; a sombra cinza no lado de baixo.
  for(let j=0;j<p.estLaminas;j++){
   const a=direcao(),c=L*(.5+.6*rnd()),g=c*(.16+.08*rnd()),r0=L*(.22+.25*rnd()),atraso=rnd()*.08,v=vida(atraso,.55+.2*rnd()),cur=(rnd()<.5?-1:1);
   if(v>=1)continue;
   const d=Math.min(236-c*(1-v*.5),r0+L*1.3*v),k=1-v,cc=c*(1-v*.5),gg=g*k;if(gg<.7)continue;
   ctx.save();ctx.rotate(a);ctx.translate(d,0);ctx.scale(1,cur);
   ctx.beginPath();ctx.moveTo(-cc*.5,0);ctx.quadraticCurveTo(0,-gg*1.6,cc*.5,-gg*.2);ctx.lineTo(cc*.5,0);ctx.quadraticCurveTo(0,gg*.4,-cc*.5,0);ctx.closePath();ctx.fillStyle=cinza;ctx.fill();
   ctx.beginPath();ctx.moveTo(-cc*.48,-gg*.05);ctx.quadraticCurveTo(0,-gg*1.5,cc*.5,-gg*.2);ctx.quadraticCurveTo(0,-gg*.3,-cc*.48,-gg*.05);ctx.closePath();ctx.fillStyle='#ffffff';ctx.fill();
   ctx.restore();
  }
  // Raios: zigue-zague grosso de 3 dentes, amarelo com borda laranja e miolo claro.
  for(let j=0;j<p.estRaios;j++){
   const a=direcao(),c=L*(.45+.5*rnd()),g=c*(.14+.06*rnd()),r0=L*(.2+.3*rnd()),v=vida(rnd()*.06,.45+.2*rnd());
   if(v>=1)continue;
   const d=Math.min(236-c,r0+L*1.1*v),cc=c*(1-v*.4),gg=g*(1-v);if(gg<.7)continue;
   ctx.save();ctx.rotate(a);ctx.translate(d,0);
   const z=[[-cc*.5,0],[-cc*.15,-gg*1.2],[-cc*.05,gg*.2],[cc*.2,-gg*.9],[cc*.25,gg*.3],[cc*.5,0]];
   const forma=k=>{ctx.beginPath();z.forEach(([x,y],m)=>{const yy=y*k;m?ctx.lineTo(x*(.6+.4*k),yy-gg*.5*k):ctx.moveTo(x*(.6+.4*k),yy-gg*.5*k)});for(let m=z.length-1;m>=0;m--){const [x,y]=z[m];ctx.lineTo(x*(.6+.4*k)-gg*.3*k,y*k+gg*.5*k)}ctx.closePath()};
   for(const [cor,k] of [[laranja,1],[p.cor,.7],[pal.miolo,.3]]){forma(k);ctx.fillStyle=cor;ctx.fill()}
   ctx.restore();
  }
  // Fagulhas.
  const fr=aleatorio(0xfa1);
  for(let j=0;j<p.particulas;j++){const a=(fr()<p.estTras/100?Math.PI:0)+(fr()-.5)*ab*1.6,v=vida(0,.5+.4*fr()),d=Math.min(236,L*(.3+1.6*v)*(.6+.6*fr())),s=(2+fr()*3)*forca*(1-v);
   if(v>=1||s<.6)continue;ctx.save();ctx.rotate(a);ctx.translate(d,0);faixas(ctx,k=>caminhoLasca(ctx,s*4,s,k),[p.cor,pal.miolo],[1,.45]);ctx.restore()}
 }
});
