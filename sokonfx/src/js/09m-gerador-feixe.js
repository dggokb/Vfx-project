// Feixe de energia: dispara fino da origem para a frente, abre na largura toda, pulsa com a borda
// tremida (desenho novo a cada par de quadros), afina até virar um fio e se parte. Clarão na boca
// do disparo; espiral opcional em volta.
registrarGerador({
 nome:'Feixe de energia',
 perfil:{tint:'#6fe7ff',particles:12},
 origem:{x:52,y:256},
 params:[
  {id:'fexComprimento',rotulo:'Comprimento',tipo:'range',min:60,max:420,padrao:380,unidade:' px'},
  {id:'fexLargura',rotulo:'Largura',tipo:'range',min:8,max:140,padrao:56,unidade:' px'},
  {id:'fexTremido',rotulo:'Borda tremida',tipo:'range',min:0,max:100,padrao:45,unidade:'%'},
  {id:'fexCheio',rotulo:'Quadros cheio',tipo:'range',min:2,max:12,padrao:8},
  {id:'fexEspiral',rotulo:'Espiral em volta',tipo:'checkbox',padrao:true},
  {id:'fexDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.fexDois),pal=p.paleta,forca=.75+p.forca/28;
  const L=p.fexComprimento,Wmax=p.fexLargura*forca;
  // Tempo: dispara (0-1), cheio (até 2 + cheio), afina até o fio e se parte no fim.
  const cheioAte=Math.min(n-3,2+p.fexCheio);
  const alcance=q===0?.55:1,larg=q<2?[.25,.7][q]:q<=cheioAte?1:Math.max(0,1-(q-cheioAte)/(n-1-cheioAte))**1.5;
  const partido=q>cheioAte+1;
  const rnd=aleatorio(0xbea+q*7919);
  const W=Wmax*larg;
  // Corpo: fita reta com a borda tremida, ponta arredondada-pontuda na frente.
  const m=24,pts=[],ls=[];
  for(let j=0;j<=m;j++){const s=j/m;pts.push([s*L*alcance,0]);
   const boca=Math.min(1,s*8),fim=s>.9?(1-s)/.1:1,treme=1+(rnd()-.5)*p.fexTremido/100*.5;
   ls.push(Math.max(0,W*boca*(.35+.65*fim)*treme))}
  if(!partido){
   faixas(ctx,k=>caminhoFita(ctx,pts,ls,k),[pal.borda,pal.cor,pal.meio,pal.miolo],[1,.8,.56,.28]);
  }else if(W>.6){
   // Partido: pedaços do fio que afinam.
   for(let j=0;j<m;j+=3){if(rnd()<.35)continue;const a=pts[j],b=pts[Math.min(m,j+2)];
    faixas(ctx,k=>caminhoFita(ctx,[a,[(a[0]+b[0])/2,0],b],[ls[j]*.2,ls[j],ls[j]*.2],k),[pal.cor,pal.miolo],[1,.4])}
  }
  // Espiral: duas fitas finas enroladas no feixe.
  if(p.fexEspiral&&!partido&&W>4){
   for(const fase of [0,Math.PI]){const sp=[],sl=[];
    for(let j=0;j<=40;j++){const s=j/40,a=s*14+fase+q*.9;sp.push([s*L*alcance,Math.sin(a)*W*.75]);sl.push(Math.max(.5,W*.12*(Math.cos(a)>0?1:.5)))}
    faixas(ctx,k=>caminhoFita(ctx,sp,sl,k),[pal.meio,pal.miolo],[1,.5]);}
  }
  // Clarão na boca: raios desiguais, maior no disparo.
  if(q<=cheioAte){const r=Wmax*(q<2?1.6:1.05)*(.85+.3*rnd()),raios=[];for(let j=0;j<16;j++)raios.push([(j%2?.3:1)*r*(.7+.5*rnd()),j*Math.PI/8]);
   faixas(ctx,k=>caminhoEstrela(ctx,raios,k),[pal.cor,pal.meio,pal.miolo],[1,.66,.34])}
  // Partículas soltas correndo junto.
  const fr=aleatorio(0xbee+q);
  for(let j=0;j<p.particulas;j++){const x=fr()*L*alcance,y=(fr()-.5)*Wmax*1.8,s=(2+fr()*3)*forca*larg;if(s<.6)continue;
   ctx.save();ctx.translate(x,y);faixas(ctx,k=>caminhoLasca(ctx,s*5,s,k),[pal.cor,pal.miolo],[1,.5]);ctx.restore()}
 }
});
