// Poeira (e terra/areia): bolas chapadas que saem rente ao chão (para os dois lados, para a frente
// ou para trás), crescem e se partem em bolas menores que somem — o diagrama de dissipação da
// bíblia. Volume em três faixas (sombra embaixo, cor, luz em cima), sem contorno.
registrarGerador({
 nome:'Poeira',
 perfil:{tint:'#d8cfc2',particles:10},
 semGiro:true,origem:{y:440},
 params:[
  {id:'poeLado',rotulo:'Para onde',tipo:'select',padrao:'ambos',opcoes:[['ambos','Os dois lados (pouso)'],['frente','Para a frente'],['tras','Para trás (arrancada)']]},
  {id:'poeBolas',rotulo:'Bolas',tipo:'range',min:3,max:30,padrao:12},
  {id:'poeTamanho',rotulo:'Tamanho',tipo:'range',min:30,max:200,padrao:100,unidade:'%'},
  {id:'poeAlcance',rotulo:'Alcance',tipo:'range',min:20,max:220,padrao:170,unidade:' px'},
  {id:'poeSobe',rotulo:'Subida',tipo:'range',min:0,max:200,padrao:60,unidade:'%'},
  {id:'poeDesfaz',rotulo:'Desfaz no quadro',tipo:'range',min:3,max:14,padrao:7},
  {id:'poeDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.poeDois),t=q/(n-1),forca=.75+p.forca/28,R=26*p.poeTamanho/100*forca;
  const u=q<p.poeDesfaz?0:(q-p.poeDesfaz+1)/(n-p.poeDesfaz),sai=suave(Math.min(1,(q+1)/6));
  const sombra=corMistura(p.cor,'#3a3238',.38),luz=corMistura(p.cor,'#ffffff',.55);
  const rnd=aleatorio(0xd057),bolas=[];
  for(let j=0;j<p.poeBolas;j++){
   const lado=p.poeLado==='ambos'?(j%2?1:-1):p.poeLado==='frente'?1:-1,v=.25+.75*rnd(),r0=R*(.6+.8*rnd())*(1.2-v*.5);
   const x=lado*Math.min(230,p.poeAlcance*forca)*v*sai*(1+u*.25),y=-r0*.6-rnd()*R*.6*sai-t*R*1.5*p.poeSobe/100*(.4+rnd());
   // Ao desfazer, cada bola vira duas menores que se afastam.
   if(u===0)bolas.push([x,y,r0*(.4+.6*sai)]);
   else for(const d of [-1,1])bolas.push([x+d*r0*.6*u,y-u*R*.4*rnd(),r0*(1-u)*(.62+.2*rnd())]);
  }
  [[sombra,1,0,.08],[p.cor,.88,-.05,-.06],[luz,.5,-.18,-.3]].forEach(([c,k,dx,dy])=>{
   ctx.beginPath();for(const [x,y,r] of bolas)if(r>1){ctx.moveTo(x+dx*r+r*k,y+dy*r);ctx.arc(x+dx*r,y+dy*r,r*k,0,Math.PI*2)}ctx.fillStyle=c;ctx.fill();
  });
  // Grãos de terra que pulam.
  const fr=aleatorio(0x6a0);
  for(let j=0;j<p.particulas;j++){const lado=p.poeLado==='frente'?1:p.poeLado==='tras'?-1:(fr()<.5?-1:1),T=t*.8,vx=lado*(80+180*fr()),vy=-(120+220*fr());
   const x=vx*T,y=vy*T+500*T*T;if(y>0)continue;const s=(1.6+fr()*2.4)*forca;ctx.fillStyle=fr()<.5?sombra:p.cor;ctx.beginPath();ctx.arc(x,y,s,0,Math.PI*2);ctx.fill()}
 }
});
