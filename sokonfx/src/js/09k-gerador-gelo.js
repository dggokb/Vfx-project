// Gelo: pontas de cristal que brotam do ponto em leque, crescem inteiras em 2 desenhos, ficam, e
// se estilhaçam em lascas que caem. Cada ponta tem duas faces (uma acesa, outra de sombra) e o fio
// branco na aresta, como cristal de anime; geada (losangos pequenos) em volta.
registrarGerador({
 nome:'Gelo',
 perfil:{tint:'#7fd8ff',particles:18},
 params:[
  {id:'gelPontas',rotulo:'Pontas',tipo:'range',min:3,max:24,padrao:9},
  {id:'gelTamanho',rotulo:'Tamanho',tipo:'range',min:30,max:200,padrao:100,unidade:'%'},
  {id:'gelLeque',rotulo:'Abertura do leque',tipo:'range',min:20,max:360,padrao:140,unidade:'°'},
  {id:'gelGrossura',rotulo:'Grossura das pontas',tipo:'range',min:30,max:250,padrao:100,unidade:'%'},
  {id:'gelQuebra',rotulo:'Quebra no quadro',tipo:'range',min:3,max:15,padrao:9},
  {id:'gelDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.gelDois),pal=p.paleta,forca=.75+p.forca/28,L=Math.min(225,190*p.gelTamanho/100*forca);
  const cresce=[.55,.85,1,1][q]??1,u=q<p.gelQuebra?0:(q-p.gelQuebra+1)/(n-p.gelQuebra);
  const luz=corMistura(p.cor,'#ffffff',.62),sombra=corMistura(p.cor,'#20365a',.35),aresta='#ffffff';
  const rnd=aleatorio(0x6e10),leque=p.gelLeque*Math.PI/180;
  // Uma ponta: losango comprido (base larga, ponta fina), duas faces e a aresta do meio.
  const ponta=(c,w,cor1,cor2)=>{
   ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(c*.18,-w/2);ctx.lineTo(c,0);ctx.closePath();ctx.fillStyle=cor1;ctx.fill();
   ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(c*.18,w/2);ctx.lineTo(c,0);ctx.closePath();ctx.fillStyle=cor2;ctx.fill();
   ctx.beginPath();ctx.moveTo(c*.08,-w*.06);ctx.lineTo(c*.98,0);ctx.lineTo(c*.08,w*.06);ctx.closePath();ctx.fillStyle=aresta;ctx.fill();
  };
  const pontas=[...Array(p.gelPontas)].map((_,j)=>({a:(p.gelPontas===1?0:(j/(p.gelPontas-1)-.5))*leque+(rnd()-.5)*.25,
   c:L*(.45+.55*rnd()),w:(16+16*rnd())*p.gelGrossura/100*forca,quebra:[.3+.2*rnd(),.62+.15*rnd()]}));
  // As maiores atrás.
  pontas.sort((a,b)=>b.c-a.c);
  for(const pt of pontas){
   ctx.save();ctx.rotate(pt.a);
   if(u===0){ponta(pt.c*cresce,pt.w*(.6+.4*cresce),luz,sombra);ctx.restore();continue}
   // Estilhaça: a ponta vira três pedaços que se afastam pelo eixo, caem e encolhem.
   const cortes=[0,...pt.quebra,1];
   for(let s=0;s<3;s++){
    const a0=cortes[s]*pt.c,a1=cortes[s+1]*pt.c,k=1-u*.85,meio=(a0+a1)/2;
    ctx.save();ctx.translate(meio+u*pt.c*.35*(s+.5),u*u*90*(s+1)*.6);ctx.rotate(u*(s-1)*.8);ctx.scale(k,k);
    ctx.translate(-(a1-a0)/2,0);
    const w=pt.w*(1-cortes[s])*(.9);ponta(a1-a0,w,luz,sombra);ctx.restore();
   }
   ctx.restore();
  }
  // Geada: losangos pequenos que saem e somem encolhendo.
  const fr=aleatorio(0x9ead);
  for(let j=0;j<p.particulas;j++){
   const a=(fr()-.5)*leque*1.3,d=L*(.2+.9*fr())*Math.min(1,(q+1)/3),s=(3+fr()*5)*forca*(1-q/(n-1));
   if(s<.6)continue;
   ctx.save();ctx.rotate(a);ctx.translate(d,(fr()-.5)*20);ctx.rotate(fr()*3);
   ctx.beginPath();ctx.moveTo(-s,0);ctx.lineTo(0,-s*.6);ctx.lineTo(s,0);ctx.lineTo(0,s*.6);ctx.closePath();ctx.fillStyle=fr()<.5?aresta:luz;ctx.fill();ctx.restore();
  }
 }
});
