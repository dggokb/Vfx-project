// Linhas de mangá: concentração (cunhas que apontam para o meio e deixam o meio limpo) ou
// velocidade (riscos paralelos na direção do golpe). Estouram cheias no contato, trocam de lugar a
// cada par de quadros (o tremido do mangá animado) e se recolhem para fora até sumir.
registrarGerador({
 nome:'Linhas de mangá',
 perfil:{tint:'#ffffff',particles:0},
 params:[
  {id:'linTipo',rotulo:'Tipo',tipo:'select',padrao:'concentracao',opcoes:[['concentracao','Concentração (para o meio)'],['velocidade','Velocidade (paralelas)']]},
  {id:'linQtd',rotulo:'Quantidade',tipo:'range',min:8,max:160,padrao:40},
  {id:'linMeio',rotulo:'Meio limpo',tipo:'range',min:10,max:220,padrao:90,unidade:' px'},
  {id:'linComprimento',rotulo:'Comprimento',tipo:'range',min:20,max:240,padrao:110,unidade:' px'},
  {id:'linGrossura',rotulo:'Grossura',tipo:'range',min:1,max:24,padrao:5,unidade:' px'},
  {id:'linBranco',rotulo:'Quanto é branco',tipo:'range',min:0,max:100,padrao:70,unidade:'%'},
  {id:'linSome',rotulo:'Começa a sumir no quadro',tipo:'range',min:2,max:15,padrao:7},
  {id:'linDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.linDois),pal=p.paleta,escala=.75+p.forca/28;
  const u=q<p.linSome?0:(q-p.linSome+1)/(n-p.linSome);
  const rnd=aleatorio(0x1135+q*7919),qtd=p.linQtd,G=p.linGrossura*escala;
  const corDe=()=>rnd()*100<p.linBranco?[pal.meio,pal.miolo]:[pal.cor,pal.meio];
  if(p.linTipo==='velocidade'){
   // Riscos paralelos ao golpe (eixo x), mais densos no meio, que correm para trás.
   const altura=360*escala;
   for(let j=0;j<qtd;j++){
    const y=Math.max(-240,Math.min(240,(rnd()-.5)*altura*(.4+.6*rnd()))),c=Math.min(230,p.linComprimento*escala*(.4+.8*rnd())*(1-u));
    const x=Math.max(-246+c*.45,Math.min(246-c*.55,(rnd()-.6)*260*escala-u*120));
    const g=G*(.35+.9*rnd())*(1-u*.7);if(c<4||g<.6)continue;
    ctx.save();ctx.translate(x,y);faixas(ctx,k=>caminhoLasca(ctx,c,g,k),corDe(),[1,.45]);ctx.restore();
   }
   return;
  }
  // Concentração: cunhas pontudas para o meio; o meio limpo cresce quando somem.
  for(let j=0;j<qtd;j++){
   const a=(j+rnd()*.8)/qtd*Math.PI*2,meio=p.linMeio*escala*(1+u*1.6)*(.85+.3*rnd());
   const g=G*(.5+1.1*rnd())*(1-u*.6);
   const c=Math.min(p.linComprimento*escala*(.45+.9*rnd())*(1-u),246-meio-g*1.5);
   if(c<4||g<.6)continue;
   ctx.save();ctx.rotate(a);
   const cor=corDe();
   faixas(ctx,k=>{const x0=meio+c*(1-k)*.3;ctx.moveTo(x0,0);ctx.lineTo(meio+c,-g*k/2);ctx.lineTo(meio+c+g*1.5,0);ctx.lineTo(meio+c,g*k/2);ctx.closePath()},cor,[1,.45]);
   ctx.restore();
  }
 }
});
