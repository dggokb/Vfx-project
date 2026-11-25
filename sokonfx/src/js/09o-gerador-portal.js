// Portal (ruptura espacial): um disco que se abre girando em espiral de faixas, com rachaduras de
// luz saindo da borda; fica girando e depois fecha para o meio e some num estalo.
registrarGerador({
 nome:'Portal',
 perfil:{tint:'#b45cff',particles:10},
 params:[
  {id:'porRaio',rotulo:'Tamanho',tipo:'range',min:40,max:220,padrao:150,unidade:' px'},
  {id:'porBracos',rotulo:'Braços da espiral',tipo:'range',min:2,max:10,padrao:5},
  {id:'porRachas',rotulo:'Rachaduras',tipo:'range',min:0,max:14,padrao:7},
  {id:'porAberto',rotulo:'Quadros aberto',tipo:'range',min:2,max:12,padrao:8},
  {id:'porAchata',rotulo:'De lado',tipo:'range',min:0,max:80,padrao:0,unidade:'%'},
  {id:'porDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.porDois),pal=p.paleta,forca=.75+p.forca/28,R=Math.min(220,p.porRaio*forca);
  const abreAte=3,fechaDe=Math.min(n-3,abreAte+p.porAberto);
  const k=q<abreAte?suave((q+1)/abreAte):q<fechaDe?1:Math.max(0,1-(q-fechaDe+1)/(n-1-fechaDe));
  const r=R*k,giro=q*.45,ach=1-p.porAchata/100;
  ctx.save();ctx.scale(1,ach);
  // Disco escuro-colorido de fundo (o buraco), depois os braços em espiral, do escuro ao claro.
  if(r>2){
   ctx.fillStyle=corMistura(p.cor,'#120018',.55);ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
   const cores=[pal.borda,pal.cor,pal.meio,pal.miolo];
   for(let b=0;b<p.porBracos;b++){
    const fase=b/p.porBracos*Math.PI*2+giro,m=22,pts=[],ls=[];
    for(let s=0;s<=m;s++){const u=s/m,ang=fase+u*3.4,rr=r*(1-u*.92);pts.push([Math.cos(ang)*rr,Math.sin(ang)*rr]);ls.push(r*.2*Math.sin(Math.PI*u)**.8)}
    faixas(ctx,kk=>caminhoFita(ctx,pts,ls,kk),cores,[1,.74,.48,.22]);
   }
   // Aro claro e pontudo na borda.
   const rnd=aleatorio(0x907),raios=[];for(let j=0;j<40;j++)raios.push([r*(j%2?.97:1.04+.06*rnd()),j*Math.PI/20+giro*.3]);
   ctx.beginPath();caminhoEstrela(ctx,raios);ctx.arc(0,0,r*.9,0,Math.PI*2,true);ctx.fillStyle=pal.meio;ctx.fill('evenodd');
  }
  ctx.restore();
  // Rachaduras: raios quebrados saindo da borda (no plano da tela), que piscam de dois em dois.
  const rr=aleatorio(0xc4a+q*31);
  for(let j=0;j<p.porRachas*(k>0?1:0);j++){
   const a=rr()*Math.PI*2,pts=[[Math.cos(a)*r,Math.sin(a)*r*ach]];let x=pts[0][0],y=pts[0][1],ang=a;
   for(let s=0;s<4;s++){ang+=(rr()-.5)*.9;const d=R*(.08+.12*rr())*k;x+=Math.cos(ang)*d;y+=Math.sin(ang)*d;pts.push([x,y])}
   const ls=pts.map((_,s)=>6*forca*k*(1-s/pts.length));
   faixas(ctx,kk=>caminhoFita(ctx,pts,ls,kk),[pal.cor,pal.miolo],[1,.45]);
  }
  // Estalo ao fechar.
  if(q>=n-3&&q<n-1){const e=R*.35*(q===n-3?1:.5);faixas(ctx,kk=>caminhoEstrela(ctx,[[e,0],[e*.15,Math.PI/4],[e*.8,Math.PI/2],[e*.15,3*Math.PI/4],[e,Math.PI],[e*.15,5*Math.PI/4],[e*.8,3*Math.PI/2],[e*.15,7*Math.PI/4]],kk),[pal.cor,pal.miolo],[1,.5])}
 }
});
