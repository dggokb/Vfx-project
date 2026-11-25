// Rastro do golpe (motion trail): o arco do golpe como um véu claro com riscos finos (a referência
// do dono: véu branco meio transparente com muitos riscos finos dentro). Segue as regras do jogo:
// nasce no começo do caminho, cresce junto com o golpe e se apaga pelo fundo, de trás para a frente;
// é exagerado (do tamanho do membro ou maior); os riscos são irregulares e pontudos.
registrarGerador({
 nome:'Rastro do golpe',
 perfil:{tint:'#dff6ff',particles:0},
 params:[
  {id:'rasRaio',rotulo:'Raio do arco',tipo:'range',min:40,max:230,padrao:170,unidade:' px'},
  {id:'rasArco',rotulo:'Tamanho do arco',tipo:'range',min:20,max:300,padrao:150,unidade:'°'},
  {id:'rasLargura',rotulo:'Largura',tipo:'range',min:10,max:160,padrao:70,unidade:' px'},
  {id:'rasRiscos',rotulo:'Riscos finos',tipo:'range',min:0,max:30,padrao:12},
  {id:'rasVeu',rotulo:'Véu (opacidade)',tipo:'range',min:10,max:100,padrao:55,unidade:'%'},
  {id:'rasSentido',rotulo:'Sentido',tipo:'select',padrao:'horario',opcoes:[['horario','De cima para baixo'],['anti','De baixo para cima']]},
  {id:'rasGolpe',rotulo:'Fim do golpe no quadro',tipo:'range',min:2,max:12,padrao:5},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const pal=p.paleta,forca=.75+p.forca/28,R=Math.min(230,p.rasRaio*forca),W=p.rasLargura*forca,arco=p.rasArco*Math.PI/180;
  const s=p.rasSentido==='anti'?-1:1,a0=-s*arco/2;
  // Cabeça avança até o fim do golpe; o rabo começa a comer a partir do meio do golpe.
  const golpe=p.rasGolpe,cabeca=Math.min(1,(i+1)/golpe),rabo=Math.max(0,(i-golpe*.5)/(n-1-golpe*.5))**.8;
  if(cabeca<=rabo+.01)return;
  const ponto=(u,r)=>{const a=a0+s*arco*u;return [Math.cos(a)*r,Math.sin(a)*r]};
  // O véu: fita grossa (mais larga perto da cabeça), meio transparente.
  const m=40,pts=[],ls=[];
  for(let j=0;j<=m;j++){const u=rabo+(cabeca-rabo)*j/m;pts.push(ponto(u,R-W*.35));const v=j/m;ls.push(W*Math.pow(v,.7)*Math.pow(1-v,.15))}
  ctx.save();ctx.globalAlpha=p.rasVeu/100;faixas(ctx,k=>caminhoFita(ctx,pts,ls,k),[pal.cor,pal.meio],[1,.6]);ctx.restore();
  // Riscos finos: arcos irregulares dentro do véu, pontudos, de comprimentos diferentes.
  const rnd=aleatorio(0x7a11);
  for(let j=0;j<p.rasRiscos;j++){
   const off=(rnd()-.5)*W*.85,ini=rabo+(cabeca-rabo)*rnd()*.6,fim=Math.min(cabeca,ini+(cabeca-rabo)*(.25+.6*rnd()));
   if(fim-ini<.02)continue;
   const q=14,rp=[],rl=[],g=(1.2+2.4*rnd())*forca;
   for(let k=0;k<=q;k++){const u=ini+(fim-ini)*k/q;rp.push(ponto(u,R-W*.35+off));rl.push(g*Math.sin(Math.PI*k/q)**.6)}
   faixas(ctx,k=>caminhoFita(ctx,rp,rl,k),[pal.miolo],[1]);
  }
  // A borda da frente do golpe: um fio claro na cabeça.
  const fp=[],fl=[];for(let j=0;j<=16;j++){const u=Math.max(rabo,cabeca-.35)+(cabeca-Math.max(rabo,cabeca-.35))*j/16;fp.push(ponto(u,R));fl.push(4*forca*(j/16))}
  faixas(ctx,k=>caminhoFita(ctx,fp,fl,k),[pal.meio,pal.miolo],[1,.5]);
 }
});
