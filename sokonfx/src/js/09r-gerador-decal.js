// Decal (marca no chão): rachadura, queimado ou cratera no plano do chão (achatado). Aparece no
// contato, as rachaduras brilham na cor e esfriam até o escuro, e no fim a marca se fecha das
// pontas para o meio. Não é luz: a marca é escura; a luz é só a brasa nas rachaduras.
registrarGerador({
 nome:'Decal (marca no chão)',
 perfil:{tint:'#ff9a3a',particles:0},
 semGiro:true,origem:{y:400},
 params:[
  {id:'decTipo',rotulo:'Tipo',tipo:'select',padrao:'rachadura',opcoes:[['rachadura','Rachadura'],['queimado','Queimado'],['cratera','Cratera']]},
  {id:'decTamanho',rotulo:'Tamanho',tipo:'range',min:40,max:230,padrao:170,unidade:' px'},
  {id:'decRachas',rotulo:'Rachaduras',tipo:'range',min:3,max:20,padrao:9},
  {id:'decAchata',rotulo:'Deitado no chão',tipo:'range',min:0,max:85,padrao:65,unidade:'%'},
  {id:'decBrasa',rotulo:'Brasa nas rachaduras',tipo:'range',min:0,max:100,padrao:80,unidade:'%'},
  {id:'decFecha',rotulo:'Some a partir do quadro',tipo:'range',min:4,max:15,padrao:10},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const t=i/(n-1),forca=.75+p.forca/28,R=Math.min(232,p.decTamanho*forca),ach=1-p.decAchata/100;
  const abre=suave(Math.min(1,(i+1)/2.5)),fecha=i<p.decFecha?0:(i-p.decFecha+1)/(n-p.decFecha);
  const escuro='#2a2226',meioEscuro='#4a3f44';
  const calor=Math.max(0,1-t*1.6)*p.decBrasa/100,brasa=corMistura(meioEscuro,corMistura(p.cor,'#ffffff',.3),calor);
  ctx.save();ctx.scale(1,ach);
  const rnd=aleatorio(0xdeca1);
  // Mancha (queimado e cratera): elipses chapadas irregulares.
  if(p.decTipo!=='rachadura'){
   const r=R*.55*abre*(1-fecha*.8);
   if(r>2){const pts=[...Array(14)].map((_,j)=>[r*(.8+.35*rnd()),j/14*Math.PI*2]);
    ctx.beginPath();caminhoEstrela(ctx,pts);ctx.fillStyle=escuro+'cc';ctx.fill();
    if(p.decTipo==='cratera'){ctx.beginPath();caminhoEstrela(ctx,pts,.62);ctx.fillStyle=meioEscuro;ctx.fill();
     ctx.beginPath();ctx.ellipse(-r*.15,-r*.18,r*.5,r*.32,0,0,Math.PI*2);ctx.fillStyle='#4a4044';ctx.fill()}}
  }
  // Rachaduras: linhas quebradas do centro, com galhos; brasa por dentro enquanto está quente.
  for(let j=0;j<p.decRachas;j++){
   let ang=j/p.decRachas*Math.PI*2+rnd()*.5,x=0,y=0;const pts=[[0,0]],comp=R*(.55+.45*rnd())*abre;
   for(let s=0;s<5;s++){ang+=(rnd()-.5)*.7;const d=comp/5;x+=Math.cos(ang)*d;y+=Math.sin(ang)*d;pts.push([x,y])}
   const corte=Math.max(1,Math.round(pts.length*(1-fecha)));const vivos=pts.slice(0,corte+1);
   if(vivos.length<2)continue;
   const ls=vivos.map((_,s)=>(24-s*3.6)*forca);
   faixas(ctx,k=>caminhoFita(ctx,vivos,ls,k),[escuro,meioEscuro,calor>.05?brasa:null,calor>.4?corMistura(brasa,'#ffffff',.5):null],[1,.66,.4,.16]);
  }
  ctx.restore();
 }
});
