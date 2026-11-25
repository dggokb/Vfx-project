// Aura (energia, Tōkon, SHINKAI): labaredas de luz em volta do corpo, subindo e balançando, com
// fagulhas que sobem. É um laço: o quadro 16 emenda no 0 (tudo anda em ciclos inteiros). A
// origem fica embaixo (os pés), o meio fica vazio para o lutador. Não gira com a Direção.
registrarGerador({
 nome:'Aura',
 perfil:{tint:'#ff7a2a',particles:14},
 semGiro:true,origem:{y:440},
 params:[
  {id:'auForma',rotulo:'Forma',tipo:'select',padrao:'corpo',opcoes:[['corpo','Corpo inteiro'],['chao','Só no chão'],['bola','Bola (mão, carga)']]},
  {id:'auAltura',rotulo:'Altura',tipo:'range',min:80,max:400,padrao:300,unidade:' px'},
  {id:'auLargura',rotulo:'Largura',tipo:'range',min:40,max:260,padrao:120,unidade:' px'},
  {id:'auQtd',rotulo:'Labaredas',tipo:'range',min:5,max:60,padrao:34},
  {id:'auChama',rotulo:'Tamanho das labaredas',tipo:'range',min:20,max:200,padrao:90,unidade:'%'},
  {id:'auBalanco',rotulo:'Balanço',tipo:'range',min:0,max:100,padrao:45,unidade:'%'},
  {id:'auCiclos',rotulo:'Ciclos no laço',tipo:'range',min:1,max:3,padrao:2},
  {id:'auBrilho',rotulo:'Brilho de fundo',tipo:'range',min:0,max:100,padrao:30,unidade:'%'},
  {id:'auDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.auDois),fase=q/n*Math.PI*2,pal=p.paleta,forca=.75+p.forca/28;
  // Cabe no quadro de 512 com a origem nos pés (y 440): nada passa do topo nem dos lados.
  const H=Math.min(p.auAltura*forca,300),Wd=Math.min(p.auLargura*forca,250),ciclos=p.auCiclos;
  const bola=p.auForma==='bola',chao=p.auForma==='chao';
  // Centro da forma: o meio do corpo, o chão ou a bola na altura da mão.
  const cy=bola?-H*.45:chao?0:-H*.45,rx=bola?Wd*.45:Wd*.55,ry=bola?Wd*.45:chao?Wd*.18:H*.5;
  ctx.save();ctx.translate(0,cy);brilhoFundo(ctx,Math.max(rx,ry)*1.25,p.cor,p.auBrilho/100);ctx.restore();
  const rnd=aleatorio(0xa0a);
  const chamas=[];
  for(let j=0;j<p.auQtd;j++){
   const a=(j+rnd()*.7)/p.auQtd*Math.PI*2,k=1+Math.floor(rnd()*ciclos),off=rnd()*Math.PI*2;
   const cima=(1-Math.sin(a))/2;
   chamas.push({x:Math.cos(a)*rx,y:cy+Math.sin(a)*ry,fundo:Math.sin(a)<0,tam:(.45+.35*rnd())*(.6+.9*cima),k,off,larg:.8+.5*rnd()});
  }
  // As de trás primeiro, mais fundas; as da frente por cima.
  chamas.sort((a,b)=>a.y-b.y);
  const base=(bola?Wd*.35:Wd*.42)*p.auChama/100;
  // Faixa por faixa em todas as línguas (todas as bordas, depois a cor, o meio e o miolo): a aura
  // vira uma silhueta só, com o claro por dentro, em vez de várias chamas contornadas.
  const formas=chamas.map(c=>{
   const pulso=.62+.38*Math.sin(fase*c.k+c.off);
   const h=base*1.9*c.tam*pulso,w=base*1.05*c.larg,s=Math.sin(fase*c.k+c.off*1.7)*h*.35*p.auBalanco/100;
   return k=>{const ww=w*k,hh=h*(.3+.7*k);
    ctx.moveTo(c.x-ww/2,c.y);ctx.quadraticCurveTo(c.x-ww*.55,c.y-hh*.55,c.x+s*k,c.y-hh);ctx.quadraticCurveTo(c.x+ww*.55,c.y-hh*.5,c.x+ww/2,c.y);
    ctx.quadraticCurveTo(c.x,c.y+ww*.35,c.x-ww/2,c.y);ctx.closePath()};
  });
  [[pal.borda,1],[pal.cor,.86],[pal.meio,.6],[pal.miolo,.3]].forEach(([cor,k],n)=>{
   ctx.beginPath();chamas.forEach((c,j)=>{if(n===3&&c.fundo)return;formas[j](k)});ctx.fillStyle=cor;ctx.fill('nonzero');
  });
  // Fagulhas que sobem em laço: cada uma sobe um número inteiro de alturas por ciclo.
  const fr=aleatorio(0xe11);
  for(let j=0;j<p.particulas;j++){
   const x0=(fr()-.5)*rx*2.2,y0=fr(),vel=1+Math.floor(fr()*2),tam=3+fr()*5,alto=(bola?ry*3:H*1.15);
   const v=(y0+vel*q/n)%1,y=(bola?cy+ry:0)-v*alto,k=Math.sin(v*Math.PI);
   if(k<.08)continue;
   ctx.save();ctx.translate(x0+Math.sin(fase*vel+j)*8,y);ctx.rotate(-Math.PI/2);
   faixas(ctx,kk=>caminhoLasca(ctx,tam*2.4*k,tam*k,kk),[pal.cor,pal.miolo],[1,.5]);ctx.restore();
  }
 }
});
