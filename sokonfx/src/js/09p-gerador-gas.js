// Gases e vapores: nuvem de bolas chapadas (como a fumaça, mas na cor: veneno, vapor, névoa) que
// brota, incha e deriva, e se desfaz em bolas menores que se separam e encolhem; bolhas opcionais.
registrarGerador({
 nome:'Gases e vapores',
 perfil:{tint:'#7bd650',particles:8},
 semGiro:true,origem:{y:330},
 params:[
  {id:'gasTamanho',rotulo:'Tamanho',tipo:'range',min:40,max:200,padrao:100,unidade:'%'},
  {id:'gasBolas',rotulo:'Bolas',tipo:'range',min:5,max:30,padrao:14},
  {id:'gasDeriva',rotulo:'Deriva (vento)',tipo:'range',min:-100,max:100,padrao:20,unidade:'%'},
  {id:'gasSobe',rotulo:'Subida',tipo:'range',min:0,max:200,padrao:60,unidade:'%'},
  {id:'gasDesfaz',rotulo:'Desfaz no quadro',tipo:'range',min:3,max:14,padrao:8},
  {id:'gasDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.gasDois),t=q/(n-1),forca=.75+p.forca/28,R=80*p.gasTamanho/100*forca;
  const u=q<p.gasDesfaz?0:(q-p.gasDesfaz+1)/(n-p.gasDesfaz);
  const sombra=corMistura(p.cor,'#1c2418',.35),cor=p.cor,luz=corMistura(p.cor,'#ffffff',.45);
  const rnd=aleatorio(0x6a5),cresce=suave(Math.min(1,(q+1)/5)),bolas=[];
  for(let j=0;j<p.gasBolas;j++){
   const a=rnd()*Math.PI*2,d=Math.sqrt(rnd()),r0=(.35+.4*rnd())*R;
   const x=Math.cos(a)*d*R*1.1*cresce*(1+u*1.3)+t*R*p.gasDeriva/100,y=Math.sin(a)*d*R*.6*cresce*(1+u)-t*R*p.gasSobe/100*(.6+.6*rnd());
   const r=r0*cresce*(1-u*(.6+.35*rnd()));if(r>1.5)bolas.push([x,y,r]);
  }
  // Sombra embaixo-direita, cor, luz em cima-esquerda: três faixas deslocadas (volume chapado).
  [[sombra,1,0,0],[cor,.9,-.06,-.08],[luz,.55,-.22,-.3]].forEach(([c,k,dx,dy])=>{
   ctx.beginPath();for(const [x,y,r] of bolas){ctx.moveTo(x+dx*r+r*k,y+dy*r);ctx.arc(x+dx*r,y+dy*r,r*k,0,Math.PI*2)}ctx.fillStyle=c;ctx.fill();
  });
  // Bolhas: anéis que sobem e estouram.
  const fr=aleatorio(0xb0b);
  for(let j=0;j<p.particulas;j++){
   const v=(fr()+t*1.2)%1,x=(fr()-.5)*R*2,y=-v*R*2.2,r=(4+fr()*7)*forca*Math.sin(Math.PI*v);
   if(r<1.2)continue;
   ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.arc(x,y,r*.65,0,Math.PI*2,true);ctx.fillStyle=luz;ctx.fill('evenodd');
  }
 }
});
