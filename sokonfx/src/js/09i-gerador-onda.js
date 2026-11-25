// Onda de choque: anel que abre rápido do ponto do golpe, em faixas (frente clara, rastro na cor),
// afinando enquanto abre; vários anéis em sequência; no fim se parte em arcos. A perspectiva achata
// o anel até deitar no chão.
registrarGerador({
 nome:'Onda de choque',
 perfil:{tint:'#9fdcff',particles:0},
 params:[
  {id:'ondTamanho',rotulo:'Tamanho final',tipo:'range',min:40,max:240,padrao:200,unidade:' px'},
  {id:'ondPerspectiva',rotulo:'Deitado no chão',tipo:'range',min:0,max:90,padrao:0,unidade:'%'},
  {id:'ondEspessura',rotulo:'Espessura',tipo:'range',min:4,max:60,padrao:26,unidade:' px'},
  {id:'ondAneis',rotulo:'Anéis',tipo:'range',min:1,max:4,padrao:2},
  {id:'ondAtraso',rotulo:'Atraso entre anéis (quadros)',tipo:'range',min:1,max:6,padrao:2},
  {id:'ondQuebra',rotulo:'Quebra (fração da vida)',tipo:'range',min:30,max:95,padrao:60,unidade:'%'},
  {id:'ondDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:false},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.ondDois),pal=p.paleta,forca=.75+p.forca/28,achata=1-p.ondPerspectiva/100*.85;
  const R=Math.min(232,p.ondTamanho*forca),W=p.ondEspessura*forca;
  for(let a=0;a<p.ondAneis;a++){
   const ini=a*p.ondAtraso,dur=n-1-ini-a;if(q<ini||dur<=0)continue;
   const v=(q-ini)/dur;if(v>1)continue;
   const r=R*(1-a*.18)*(1-(1-v)**2.4),w=W*(1-a*.25)*(1-v)**1.1;
   if(w<.6||r<2)continue;
   const quebra=p.ondQuebra/100,u=v<quebra?0:(v-quebra)/(1-quebra);
   const rnd=aleatorio(0x0da+a*97),partes=u>0?9:1,f1=rnd()*6.28,f2=rnd()*6.28;
   // Traço de mão: o raio ondula um pouco em volta (não é um círculo de compasso).
   const torto=ang=>1+.016*Math.sin(3*ang+f1)+.008*Math.sin(5*ang+f2);
   for(let j=0;j<partes;j++){
    const a0=u>0?j/partes*Math.PI*2+rnd()*.25:0,tam=u>0?Math.PI*2/partes*(1-u*.7)*(.6+.4*rnd()):Math.PI*2;
    const m=u>0?12:96,pts=[],ls=[];
    for(let s=0;s<=m;s++){const ang=a0+tam*s/m;pts.push([Math.cos(ang)*r*torto(ang),Math.sin(ang)*r*achata*torto(ang)]);
     // A espessura é maior na frente (embaixo, perto de quem vê) quando deitado.
     const frente=1+(1-achata)*.6*Math.sin(ang);ls.push(w*frente*(u>0?Math.pow(Math.min(s,m-s)/(m/2),.6):1))}
    // A frente (lado de fora) clara; o rastro (dentro) na cor: duas fitas, a clara por cima, deslocada.
    faixas(ctx,k=>caminhoFita(ctx,pts,ls,k),[pal.borda,pal.cor,pal.meio],[1,.72,.42]);
    const fora=pts.map(([x,y])=>{const d=Math.hypot(x,y/achata)||1;return [x*(1+w*.22/d),y*(1+w*.22/d)]});
    faixas(ctx,k=>caminhoFita(ctx,fora,ls.map(l=>l*.38),k),[pal.miolo],[1]);
   }
  }
 }
});
