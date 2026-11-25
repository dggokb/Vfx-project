// Choque (clash): dois golpes se batem. Duas lanças de luz cruzadas em X estouram inteiras no
// contato com um clarão de quatro pontas no meio; um anel fino abre e se parte; as lanças afinam e
// se partem em lascas que correm para fora pelo próprio eixo. Linhas de mangá finas em volta.
registrarGerador({
 nome:'Choque',
 perfil:{tint:'#ffcf3a',particles:16},
 params:[
  {id:'chqAbertura',rotulo:'Abertura do X',tipo:'range',min:10,max:120,padrao:75,unidade:'°'},
  {id:'chqComprimento',rotulo:'Comprimento das lanças',tipo:'range',min:40,max:240,padrao:120,unidade:'%'},
  {id:'chqEspessura',rotulo:'Espessura das lanças',tipo:'range',min:4,max:50,padrao:18,unidade:' px'},
  {id:'chqAnel',rotulo:'Anel de choque',tipo:'checkbox',padrao:true},
  {id:'chqLinhas',rotulo:'Linhas em volta',tipo:'range',min:0,max:40,padrao:14},
  {id:'chqQuebra',rotulo:'Quebra no quadro',tipo:'range',min:2,max:14,padrao:5},
  {id:'chqBrilho',rotulo:'Brilho de fundo',tipo:'range',min:0,max:100,padrao:40,unidade:'%'},
  {id:'chqDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.chqDois),pal=p.paleta,escala=.75+p.forca/28;
  const L=Math.min(200,150*p.chqComprimento/100*escala),W=p.chqEspessura*escala,ab=p.chqAbertura*Math.PI/180;
  const quebra=p.chqQuebra,u=q<quebra?0:(q-quebra+1)/(n-quebra);
  const cores=[pal.borda,pal.cor,pal.meio,pal.miolo],tam=[1,.75,.5,.24];
  brilhoFundo(ctx,L*.9*(1-.5*u),p.cor,p.chqBrilho/100*(1-u)**1.5);
  // Anel: fino, abre rápido e se parte em arcos.
  if(p.chqAnel&&q>=1){
   const ra=aleatorio(0xa9e1),v=(q-1)/(n-2),r=L*(.35+.75*Math.sqrt(v)),w=W*.55*(1-v)**1.4;
   if(w>.6){const partes=7;for(let j=0;j<partes;j++){
    const a0=j/partes*Math.PI*2+ra()*.3,a1=a0+(Math.PI*2/partes)*(.55+.35*ra())*(1-v*.6);
    faixas(ctx,k=>{const m=10,pts=[],ls=[];for(let s=0;s<=m;s++){const a=a0+(a1-a0)*s/m;pts.push([Math.cos(a)*r,Math.sin(a)*r*.62]);ls.push(w*Math.pow(Math.min(s,m-s)/(m/2),.6))}caminhoFita(ctx,pts,ls,k)},[pal.cor,pal.miolo],[1,.45]);
   }}
  }
  // Linhas de mangá finas em volta, que trocam a cada desenho.
  const lr=aleatorio(0x11e5+q*7919);
  for(let j=0;j<p.chqLinhas;j++){
   const a=lr()*Math.PI*2,r0=Math.min(220,L*(.45+.35*lr())*(1+u*.8)),c=Math.min(L*(.25+.5*lr())*(1-u),(236-r0)/1.05),lw=1.5+lr()*2.5;
   if(c<3)continue;
   ctx.save();ctx.rotate(a);ctx.translate(r0+c/2,0);
   faixas(ctx,k=>caminhoLasca(ctx,c,lw,k),[pal.meio,pal.miolo],[1,.5]);ctx.restore();
  }
  // As duas lanças em X: inteiras até a quebra, depois afinam e se partem pelo eixo.
  const cresce=[.75,1,1.04,1.06][q]??1.06;
  for(const s of [-1,1]){
   ctx.save();ctx.rotate(s*ab/2);
   const pecas=u===0?[[-1,1]]:[[-1,-.62],[-.5,-.18],[-.08,.08],[.18,.5],[.62,1]];
   pecas.forEach(([a,b],j)=>{
    const meio=(a+b)/2,enc=u*.45,a2=meio+(a-meio)*(1-enc),b2=meio+(b-meio)*(1-enc),corre=meio*L*.2*u;
    const m=10,pts=[],ls=[];
    for(let t=0;t<=m;t++){const x=(a2+(b2-a2)*t/m)*L*cresce+corre;pts.push([x,0]);
     const pontas=Math.min(1,Math.abs(x)/(L*cresce));ls.push(W*(1-u)**1.2*(u===0?Math.pow(1-pontas,.7)+.08:Math.pow(Math.min(t,m-t)/(m/2),.6)))}
    if(Math.max(...ls)<.7)return;
    faixas(ctx,k=>caminhoFita(ctx,pts,ls,k),cores,tam);
   });
   ctx.restore();
  }
  // Clarão de quatro pontas no meio, desigual, só no começo.
  if(q<4){const t=[1.15,1,.62,.3][q],r=L*.55*t;
   faixas(ctx,k=>caminhoEstrela(ctx,[[r,0],[r*.1,Math.PI/4],[r*.62,Math.PI/2],[r*.1,3*Math.PI/4],[r*.95,Math.PI],[r*.1,5*Math.PI/4],[r*.62,3*Math.PI/2],[r*.1,7*Math.PI/4]],k),[pal.cor,pal.meio,pal.miolo],[1,.7,.42]);}
  // Faíscas soltas que voam para os lados.
  const fr=aleatorio(0xf00d);
  for(let j=0;j<p.particulas;j++){
   const a=fr()*Math.PI*2,vel=.4+fr()*.9,comp=12+fr()*22,larg=2.5+fr()*3,vida=Math.min(1,q/(n-1)/(.6+fr()*.35));
   if(vida<=0||vida>=1)continue;
   const k=1-vida,d=Math.min(L*(.1+1.2*vel*Math.sqrt(vida)),236-comp*.6);
   ctx.save();ctx.translate(Math.cos(a)*d,Math.sin(a)*d);ctx.rotate(a);
   faixas(ctx,kk=>caminhoLasca(ctx,comp*(.4+.6*k),larg*k,kk),[pal.cor,pal.miolo],[1,.45]);ctx.restore();
  }
 }
});
