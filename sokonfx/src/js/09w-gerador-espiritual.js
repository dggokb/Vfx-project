// Energia espiritual (fogo-fátuo, alma): chamas-gota claras com cauda longa que sobem balançando em
// volta, em laço (o quadro 16 emenda no 0). Mais clara e mais lenta que a Aura; boa para Komyo,
// espíritos e o SHINKAI de técnica.
registrarGerador({
 nome:'Energia espiritual',
 perfil:{tint:'#8fd8ff',particles:12},
 semGiro:true,origem:{y:420},
 params:[
  {id:'espQtd',rotulo:'Chamas',tipo:'range',min:2,max:20,padrao:7},
  {id:'espTamanho',rotulo:'Tamanho',tipo:'range',min:30,max:200,padrao:100,unidade:'%'},
  {id:'espLargura',rotulo:'Largura da volta',tipo:'range',min:20,max:240,padrao:130,unidade:' px'},
  {id:'espAltura',rotulo:'Altura',tipo:'range',min:60,max:380,padrao:300,unidade:' px'},
  {id:'espCauda',rotulo:'Cauda',tipo:'range',min:0,max:200,padrao:100,unidade:'%'},
  {id:'espDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.espDois),fase=q/n,pal=p.paleta,forca=.75+p.forca/28,S=p.espTamanho/100*forca;
  const H=Math.min(380,p.espAltura*forca),Wd=Math.min(220,p.espLargura*forca),rnd=aleatorio(0x5b1);
  for(let j=0;j<p.espQtd;j++){
   const off=rnd(),vel=1+Math.floor(rnd()*2),lado=rnd()*Math.PI*2,r=(14+10*rnd())*S;
   const v=(off+vel*fase)%1,y=-v*H,x=Math.sin(lado+v*Math.PI*2*vel)*Wd*.5,vis=Math.sin(Math.PI*v);
   if(vis<.1)continue;
   // Cauda: fita que segue o caminho para baixo (de onde veio), afinando.
   const pts=[],ls=[];
   for(let s=0;s<=14;s++){const vv=v-s/14*.18*p.espCauda/100;pts.push([Math.sin(lado+vv*Math.PI*2*vel)*Wd*.5,-vv*H]);ls.push(r*1.6*vis*(1-s/14)**1.3)}
   faixas(ctx,k=>caminhoFita(ctx,pts,ls,k),[pal.cor,pal.meio],[1,.5]);
   ctx.save();ctx.translate(x,y);
   faixas(ctx,k=>{const rr=r*vis*k;ctx.moveTo(0,-rr*2.1);ctx.quadraticCurveTo(rr*1.2,-rr*.4,0,rr);ctx.quadraticCurveTo(-rr*1.2,-rr*.4,0,-rr*2.1)},[pal.cor,pal.meio,pal.miolo],[1,.72,.42]);
   ctx.restore();
  }
  // Pontinhos de luz soltos.
  const fr=aleatorio(0x1e5);
  for(let j=0;j<p.particulas;j++){const v=(fr()+fase)%1,x=(fr()-.5)*Wd*1.3,y=-v*H,s=(1.5+fr()*2.5)*forca*Math.sin(Math.PI*v);if(s<.6)continue;
   ctx.fillStyle=fr()<.5?pal.miolo:pal.meio;ctx.beginPath();ctx.arc(x,y,s,0,Math.PI*2);ctx.fill()}
 }
});
