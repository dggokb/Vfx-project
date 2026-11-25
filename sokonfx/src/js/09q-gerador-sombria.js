// Energia sombria: tentáculos de tinta escura subindo e se enrolando, com o fio de luz da cor por
// dentro (efeito é luz: o escuro tem o miolo aceso), que se partem em gotas no fim; olhos de luz
// opcionais. Bom para poderes de trevas e espirituais (mude a cor para o espiritual).
registrarGerador({
 nome:'Energia sombria',
 perfil:{tint:'#c04cff',particles:12},
 semGiro:true,origem:{y:430},
 params:[
  {id:'somTentaculos',rotulo:'Tentáculos',tipo:'range',min:2,max:16,padrao:5},
  {id:'somAltura',rotulo:'Altura',tipo:'range',min:60,max:400,padrao:280,unidade:' px'},
  {id:'somLargura',rotulo:'Largura da base',tipo:'range',min:20,max:240,padrao:140,unidade:' px'},
  {id:'somEnrola',rotulo:'Enrolar',tipo:'range',min:0,max:100,padrao:55,unidade:'%'},
  {id:'somEscuro',rotulo:'Escuro do corpo',tipo:'range',min:0,max:100,padrao:45,unidade:'%'},
  {id:'somQuebra',rotulo:'Quebra no quadro',tipo:'range',min:3,max:15,padrao:10},
  {id:'somDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.somDois),t=q/(n-1),forca=.75+p.forca/28,pal=p.paleta;
  const H=Math.min(410,p.somAltura*forca),Wb=p.somLargura*forca,u=q<p.somQuebra?0:(q-p.somQuebra+1)/(n-p.somQuebra);
  const tinta=corMistura(p.cor,'#08000e',p.somEscuro/100*.85),meio=corMistura(p.cor,'#08000e',p.somEscuro/100*.4);
  const sobe=suave(Math.min(1,(q+1)/5)),rnd=aleatorio(0x5e9);
  for(let j=0;j<p.somTentaculos;j++){
   const x0=(j/(p.somTentaculos-1||1)-.5)*Wb,alto=H*(.5+.5*rnd())*sobe,fase=rnd()*6.28,enr=p.somEnrola/100*(.5+rnd());
   const m=20,pts=[],ls=[];
   for(let s=0;s<=m;s++){const v=s/m,y=-v*alto,x=x0*(1-v*.5)+Math.sin(v*5*enr+fase+q*.5)*46*forca*v+Math.sin(v*2+fase)*10;
    pts.push([x,y]);ls.push((40+18*rnd())*forca*(1-v)**.8*(1-u*.5))}
   const corte=u>0?Math.floor(m*(1-u*.8)):m;
   const vivos=pts.slice(0,corte+1),lv=ls.slice(0,corte+1);
   if(vivos.length>2)faixas(ctx,k=>caminhoFita(ctx,vivos,lv,k),[tinta,meio,pal.cor,pal.miolo],[1,.62,.3,.12]);
   // O que se partiu vira gotas que sobem e encolhem.
   if(u>0)for(let s=corte;s<m;s+=3){const [x,y]=pts[s],r=ls[s]*.6*(1-u);if(r<1)continue;
    ctx.save();ctx.translate(x,y-u*40);faixas(ctx,k=>{ctx.arc(0,0,r*k,0,Math.PI*2)},[tinta,pal.cor],[1,.45]);ctx.restore()}
  }
  // Fagulhas de luz da cor.
  const fr=aleatorio(0xda7);
  for(let j=0;j<p.particulas;j++){const v=(fr()+t)%1,x=(fr()-.5)*Wb*1.2,y=-v*H,s=(2+fr()*3)*forca*Math.sin(Math.PI*v);if(s<.6)continue;
   ctx.save();ctx.translate(x,y);ctx.rotate(-Math.PI/2);faixas(ctx,k=>caminhoLasca(ctx,s*4,s,k),[pal.cor,pal.miolo],[1,.5]);ctx.restore()}
 }
});
