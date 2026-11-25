// Explosão: clarão branco no contato, bola de fogo feita de bolas chapadas que crescem juntas
// (uma silhueta só, faixa por faixa), esfria do branco ao laranja e à fumaça, e no fim se parte em
// bolas soltas que sobem e encolhem (emissão → expansão → deformação → fragmentação → dispersão,
// o diagrama da bíblia). Anel de choque e estilhaços opcionais.
registrarGerador({
 nome:'Explosão',
 perfil:{tint:'#ff7a1a',particles:14},
 semGiro:true,origem:{y:320},
 params:[
  {id:'expTamanho',rotulo:'Tamanho',tipo:'range',min:40,max:200,padrao:100,unidade:'%'},
  {id:'expBolas',rotulo:'Bolas de fogo',tipo:'range',min:5,max:40,padrao:18},
  {id:'expSobe',rotulo:'Subida',tipo:'range',min:0,max:200,padrao:100,unidade:'%'},
  {id:'expFumaca',rotulo:'Vira fumaça',tipo:'range',min:0,max:100,padrao:70,unidade:'%'},
  {id:'expAnel',rotulo:'Anel de choque',tipo:'checkbox',padrao:true},
  {id:'expQuebra',rotulo:'Quebra no quadro',tipo:'range',min:3,max:14,padrao:8},
  {id:'expDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.expDois),t=q/(n-1),forca=.75+p.forca/28,R=105*p.expTamanho/100*forca;
  const u=q<p.expQuebra?0:(q-p.expQuebra+1)/(n-p.expQuebra);
  // Esfriar: do fogo (cor) à fumaça cinza, mais forte com "Vira fumaça".
  const frio=Math.min(1,t*1.25)*p.expFumaca/100,fumo='#6a6470';
  const borda=corMistura(corMistura(p.cor,'#5a1408',.45),fumo,frio),cor=corMistura(p.cor,'#8a8290',frio),
   meio=corMistura(corMistura(p.cor,'#ffe9a0',.6),'#b6aebb',frio),miolo=corMistura('#ffffff','#d8d2dc',frio);
  // Anel de choque: fino, rápido, se parte.
  if(p.expAnel&&q>=1&&q<n*.6){
   const v=(q-1)/(n*.6-1),r=R*(.7+1.3*Math.sqrt(v)),w=R*.12*(1-v)**1.3;
   if(w>.6)for(let j=0;j<8;j++){const a0=j/8*Math.PI*2,a1=a0+Math.PI*2/8*(1-v*.55);
    faixas(ctx,k=>{const m=8,pts=[],ls=[];for(let s=0;s<=m;s++){const a=a0+(a1-a0)*s/m;pts.push([Math.cos(a)*r,Math.sin(a)*r*.45+R*.3]);ls.push(w*Math.pow(Math.min(s,m-s)/(m/2),.6))}caminhoFita(ctx,pts,ls,k)},[p.paleta.meio,p.paleta.miolo],[1,.45])}
  }
  // As bolas: posição dentro de uma esfera achatada embaixo, raio cresce rápido e depois encolhe.
  const rnd=aleatorio(0xe4b),cresce=suave(Math.min(1,(q+1)/4));
  const bolas=[];
  for(let j=0;j<p.expBolas;j++){
   const a=rnd()*Math.PI*2,d=Math.sqrt(rnd()),r0=(.3+.45*rnd())*R,altura=rnd();
   const espalha=1+u*(1.2+rnd()),sobe=(t*R*.5+u*R*.45*(.5+rnd()))*p.expSobe/100;
   const x=Math.cos(a)*d*R*.75*cresce*espalha,y=Math.sin(a)*d*R*.6*cresce*espalha-altura*R*.35*cresce-sobe;
   const r=r0*cresce*(1-u*(.55+.4*rnd()));
   if(r>1)bolas.push([x,y,r]);
  }
  // Clarão do contato: só o branco nos 2 primeiros desenhos, maior que a bola.
  if(q<2){const est=aleatorio(0xf1a),raios=[];for(let j=0;j<24;j++)raios.push([(j%2?.55:1)*R*(1.1+.5*est())*(q?.9:1.15),j*Math.PI/12+est()*.2]);
   faixas(ctx,k=>caminhoEstrela(ctx,raios,k),[p.paleta.meio,'#ffffff'],[1,.7]);}
  // Faixa por faixa em todas as bolas: uma silhueta só, o miolo encolhe enquanto esfria.
  const calor=Math.max(0,1-t*1.6);
  [[borda,1],[cor,.84],[meio,.64],[miolo,.18+.32*calor]].forEach(([c,k],m)=>{
   if(m===3&&calor<=0&&frio>.5)return;
   ctx.beginPath();for(const [x,y,r] of bolas){ctx.moveTo(x+r*k,y-r*(1-k)*.3);ctx.arc(x,y-r*(1-k)*.3,r*k,0,Math.PI*2)}ctx.fillStyle=c;ctx.fill();
  });
  // Estilhaços: riscos que voam para fora e encurtam.
  const fr=aleatorio(0x5717);
  for(let j=0;j<p.particulas;j++){
   const a=-Math.PI/2+(fr()-.5)*Math.PI*1.7,vel=.6+fr(),comp=14+fr()*26,vida=Math.min(1,t/(.45+fr()*.4));
   if(vida>=1)continue;
   const d=R*(.3+1.6*vel*Math.sqrt(vida)),k=1-vida;
   ctx.save();ctx.translate(Math.cos(a)*d,Math.sin(a)*d+R*.6*vida*vida);ctx.rotate(a);
   faixas(ctx,kk=>caminhoLasca(ctx,comp*(.4+.6*k),(3+fr()*3)*k,kk),[p.paleta.cor,p.paleta.miolo],[1,.45]);ctx.restore();
  }
 }
});
