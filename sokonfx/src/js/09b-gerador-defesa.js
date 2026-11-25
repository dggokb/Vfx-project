// Defesa (guard): o golpe bate num escudo de luz. Um arco virado para quem bate (a esquerda; o
// golpe vem andando para a direita) estoura inteiro no contato, solta lascas para trás e para os
// lados e depois se parte em pedaços que se afastam e afinam até sumir.
registrarGerador({
 nome:'Defesa',
 perfil:{tint:'#5fd4ff',particles:18},
 desenhos:['Arco','Anel','Arco duplo','Arco largo'],
 params:[
  {id:'defForma',rotulo:'Forma do escudo',tipo:'select',padrao:'arco',opcoes:[['arco','Arco'],['duplo','Arco duplo'],['anel','Anel inteiro']]},
  {id:'defTamanho',rotulo:'Tamanho',tipo:'range',min:40,max:220,padrao:100,unidade:'%'},
  {id:'defAbertura',rotulo:'Abertura do arco',tipo:'range',min:30,max:170,padrao:110,unidade:'°'},
  {id:'defEspessura',rotulo:'Espessura',tipo:'range',min:4,max:60,padrao:22,unidade:' px'},
  {id:'defQuebra',rotulo:'Quebra no quadro',tipo:'range',min:2,max:14,padrao:6},
  {id:'defPedacos',rotulo:'Pedaços ao quebrar',tipo:'range',min:3,max:14,padrao:5},
  {id:'defBrilho',rotulo:'Brilho de fundo',tipo:'range',min:0,max:100,padrao:35,unidade:'%'},
  {id:'defDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.defDois),pal=p.paleta,escala=p.defTamanho/100*(.75+p.forca/28);
  const quebra=p.defQuebra,ab=p.defAbertura*Math.PI/360,R=128*escala,W=p.defEspessura*escala*1.25;
  const abre=[.9,1,1.06,1.1][q]??(1.1+.01*(q-3));
  const u=q<quebra?0:(q-quebra+1)/(n-quebra);
  const anel=p.defForma==='anel';
  const cores=[pal.borda,pal.cor,pal.meio,pal.miolo],tam=[1,.78,.52,.26];
  // O contato fica na origem: o arco tem a barriga nela e as pontas voltam para a direita.
  brilhoFundo(ctx,R*1.1*(1-u*.5),p.cor,p.defBrilho/100*(1-u)**1.5);
  const centro=R*abre;
  const pedaco=(a0,a1,r,w,cx,grossura=1)=>k=>{
   const m=18,pts=[],ls=[];
   for(let j=0;j<=m;j++){const a=Math.PI+a0+(a1-a0)*j/m;pts.push([cx+Math.cos(a)*r,Math.sin(a)*r]);
    const fim=Math.min(j,m-j)/(m/2);ls.push(w*grossura*Math.pow(fim,.5))}
   caminhoFita(ctx,pts,ls,k);
  };
  const arcos=p.defForma==='duplo'?[[1,1,0],[.72,.6,R*.34]]:[[1,1,0]];
  const rnd=aleatorio(0xd3f);
  for(const [raio,peso,atras] of arcos){
   const r=centro*raio,cx=centro+atras,w=W*peso*(1-u)**1.25;
   if(w<.7)continue;
   const a0=anel?-Math.PI:-ab,a1=anel?Math.PI:ab;
   if(u===0){faixas(ctx,pedaco(a0,a1,r,w,cx),cores,tam);continue}
   // Quebrado: pedaços desiguais (grossuras diferentes) encolhem, saem para fora e giram um pouco.
   const cortes=[0];for(let j=1;j<p.defPedacos;j++)cortes.push(j/p.defPedacos+(rnd()-.5)*.95/p.defPedacos);cortes.push(1);
   for(let j=0;j<p.defPedacos;j++){
    const b0=a0+(a1-a0)*cortes[j],b1=a0+(a1-a0)*cortes[j+1],meio=(b0+b1)/2,enc=.55*u+.1,gr=.7+rnd()*.6;
    const ang=Math.PI+meio,voa=R*(.15+.55*rnd())*u,gira=(rnd()-.5)*.6*u;
    const px=cx+Math.cos(ang)*r,py=Math.sin(ang)*r;
    ctx.save();ctx.translate(Math.cos(ang)*voa,Math.sin(ang)*voa);ctx.translate(px,py);ctx.rotate(gira);ctx.translate(-px,-py);
    faixas(ctx,pedaco(meio-(meio-b0)*(1-enc),meio+(b1-meio)*(1-enc),r,w,cx,gr),cores,tam);
    ctx.restore();
   }
  }
  // Estalo no contato: raios desiguais e pontudos (não uma estrela regular), só no começo.
  if(q<4){
   const est=aleatorio(0x51a),raios=[],nr=14,tamEst=[1.05,1,.62,.3][q];
   for(let j=0;j<nr*2;j++){const longo=j%2===0;raios.push([(longo?R*(.35+.55*est()**1.6):R*(.07+.05*est()))*tamEst,(j+est()*.6-.3)*Math.PI/nr])}
   faixas(ctx,k=>caminhoEstrela(ctx,raios,k),[pal.cor,pal.meio,pal.miolo],[1,.66,.36]);
  }
  // Lascas: saem do contato para trás (esquerda) e para os lados, afinam e encurtam até sumir.
  const lr=aleatorio(0x1a5),qtd=p.particulas;
  for(let j=0;j<qtd;j++){
   const a=Math.PI+(lr()*2-1)*(anel?Math.PI:ab*.9),vel=.5+lr()*.9,comp=16+lr()*34,larg=3+lr()*5,atraso=lr()*.2;
   const vida=Math.max(0,Math.min(1,(q/(n-1)-atraso)/(.8-atraso)));
   if(vida<=0||vida>=1)continue;
   const dist=R*(.15+1.5*vel*Math.sqrt(vida)),k=1-vida;
   ctx.save();ctx.translate(Math.cos(a)*dist,Math.sin(a)*dist);ctx.rotate(a);
   faixas(ctx,kk=>caminhoLasca(ctx,comp*(.4+.6*k),larg*k,kk),[pal.borda,pal.meio,pal.miolo],[1,.7,.4]);
   ctx.restore();
  }
 }
});
