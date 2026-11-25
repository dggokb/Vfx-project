// Vento e vórtices: traços de ar em fita pontuda. Rajada: arcos que correm para a frente e se
// comem pelo rabo (nascem na frente, somem por trás). Vórtice: traços em espiral girando em volta
// de um eixo de pé, mais largo em cima (o redemoinho, o tornado).
registrarGerador({
 nome:'Vento e vórtices',
 perfil:{tint:'#cfeeff',particles:10},
 params:[
  {id:'venTipo',rotulo:'Tipo',tipo:'select',padrao:'rajada',opcoes:[['rajada','Rajada'],['vortice','Vórtice (redemoinho)']]},
  {id:'venTracos',rotulo:'Traços',tipo:'range',min:2,max:24,padrao:8},
  {id:'venTamanho',rotulo:'Tamanho',tipo:'range',min:30,max:200,padrao:100,unidade:'%'},
  {id:'venEspessura',rotulo:'Espessura',tipo:'range',min:2,max:40,padrao:18,unidade:' px'},
  {id:'venGiro',rotulo:'Velocidade',tipo:'range',min:20,max:300,padrao:100,unidade:'%'},
  {id:'venDois',rotulo:'Animar de dois em dois',tipo:'checkbox',padrao:true},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const q=doisEmDois(i,p.venDois),t=q/(n-1),pal=p.paleta,forca=.75+p.forca/28,S=p.venTamanho/100*forca,W=p.venEspessura*forca;
  const rnd=aleatorio(0x7e47),cores=[pal.cor,pal.meio,pal.miolo],tam=[1,.62,.3];
  // Uma fita ao longo de f(s), s de a até b (0 a 1), pontuda nas duas pontas.
  const fita=(f,a,b,w)=>{if(b-a<.02||w<.6)return;const m=18,pts=[],ls=[];
   for(let j=0;j<=m;j++){const s=a+(b-a)*j/m;pts.push(f(s));const e=Math.min(j,m-j)/(m/2);ls.push(w*Math.pow(e,.7)*(.4+.6*(j/m)))}
   faixas(ctx,k=>caminhoFita(ctx,pts,ls,k),cores,tam)};
  if(p.venTipo==='vortice'){
   ctx.rotate(-+el('angle').value*Math.PI/180);
   const H=300*S,base=H*.45;
   for(let j=0;j<p.venTracos;j++){
    const y0=(j+.5)/p.venTracos,fase=rnd()*Math.PI*2,giro=(1+rnd())*p.venGiro/100;
    const raio=y=>14*S+(1-y)*90*S;           // mais largo em cima
    const f=s=>{const y=y0-.1+.2*s,a=fase+s*2.4+t*giro*Math.PI*2;return [Math.cos(a)*raio(y),base-y*H+Math.sin(a)*raio(y)*.25]};
    const vida=Math.min(1,t*1.4+rnd()*.2),a=Math.max(0,vida*1.2-.45),b=Math.min(1,vida*1.6);
    fita(f,a,b,W*(1-t*.4));
   }
  }else{
   for(let j=0;j<p.venTracos;j++){
    const y=(rnd()-.5)*220*S,curva=(rnd()-.5)*.9,comp=(140+120*rnd())*S,atraso=rnd()*.35,vel=p.venGiro/100;
    const vida=(t-atraso)/(.65*(1/vel)+.15);if(vida<=0||vida>=1)continue;
    const x0=-150*S+vida*90*S*vel;
    const f=s=>{const x=x0+s*comp;return [x,y+Math.sin(s*Math.PI)*curva*60*S-curva*s*30*S]};
    // Nasce pela frente e some por trás (o rabo come a fita).
    fita(f,Math.max(0,vida*1.3-.35),Math.min(1,vida*2.2),W*(.6+.5*rnd()));
   }
  }
  // Partículas de poeira/folha levadas pelo ar.
  const fr=aleatorio(0xa1e);
  for(let j=0;j<p.particulas;j++){
   const x=-180*S+((fr()+t*p.venGiro/100*1.3)%1)*360*S,y=(fr()-.5)*240*S,s=(2+fr()*3)*forca*Math.sin(Math.PI*Math.min(1,t*1.2));
   if(s<.6)continue;
   ctx.save();ctx.translate(x,y);faixas(ctx,k=>caminhoLasca(ctx,s*4,s,k),[pal.cor,pal.miolo],[1,.5]);ctx.restore();
  }
 }
});
