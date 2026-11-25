// Afterimage (cópias que ficam): o sprite do lutador (carregado do aparelho) deixa cópias tingidas
// na cor para trás, que aparecem em sequência e somem se partindo em fatias horizontais que
// escorregam (o "zanzoken" do anime). Sem sprite, usa uma silhueta de lutador.
registrarGerador({
 nome:'Afterimage',
 perfil:{tint:'#57c8ff',particles:0},
 semGiro:true,origem:{y:470},
 params:[
  {id:'aftSprite',rotulo:'Sprite do lutador (do aparelho)',tipo:'imagem',padrao:''},
  {id:'aftAltura',rotulo:'Altura do lutador',tipo:'range',min:80,max:420,padrao:320,unidade:' px'},
  {id:'aftCopias',rotulo:'Cópias',tipo:'range',min:1,max:8,padrao:4},
  {id:'aftDistancia',rotulo:'Distância entre cópias',tipo:'range',min:4,max:120,padrao:36,unidade:' px'},
  {id:'aftTinge',rotulo:'Tingir na cor',tipo:'range',min:0,max:100,padrao:80,unidade:'%'},
  {id:'aftOpacidade',rotulo:'Opacidade',tipo:'range',min:10,max:100,padrao:70,unidade:'%'},
  {id:'aftFatias',rotulo:'Some em fatias',tipo:'checkbox',padrao:true},
  {id:'aftOriginal',rotulo:'Mostrar o lutador na frente',tipo:'checkbox',padrao:false},
 ],
 desenhar(ctx,{i,n,p,aleatorio}){
  const t=i/(n-1),img=geradorImagem(p.aftSprite),H=Math.min(440,p.aftAltura*(.75+p.forca/28));
  // O desenho do lutador numa tela própria (sprite ou silhueta), com a base no chão (origem).
  const W=img?Math.round(H*img.naturalWidth/img.naturalHeight):Math.round(H*.45);
  const fonte=document.createElement('canvas');fonte.width=Math.max(1,W);fonte.height=Math.max(1,Math.round(H));
  const f=fonte.getContext('2d');
  if(img)f.drawImage(img,0,0,fonte.width,fonte.height);
  else{f.fillStyle='#ffffff';f.translate(W/2,H);f.scale(H/250,H/250);f.beginPath();f.ellipse(0,-225,20,25,0,0,7);f.fill();
   f.beginPath();f.moveTo(-34,-195);f.lineTo(34,-195);f.lineTo(28,-100);f.lineTo(42,0);f.lineTo(14,0);f.lineTo(0,-80);f.lineTo(-14,0);f.lineTo(-42,0);f.lineTo(-28,-100);f.closePath();f.fill()}
  // A cópia tingida.
  const copia=document.createElement('canvas');copia.width=fonte.width;copia.height=fonte.height;const c=copia.getContext('2d');
  c.drawImage(fonte,0,0);c.globalCompositeOperation='source-atop';c.globalAlpha=p.aftTinge/100;c.fillStyle=p.cor;c.fillRect(0,0,copia.width,copia.height);
  c.globalAlpha=.35*p.aftTinge/100;c.fillStyle=p.paleta.miolo;c.fillRect(0,0,copia.width,copia.height*.08);
  const rnd=aleatorio(0xaf7);
  // Cópias: a k-ésima (mais velha = mais longe) nasce no quadro k e vive até se partir.
  for(let k=p.aftCopias;k>=1;k--){
   const nasce=(k-1)/(n-1)*2.2,v=(t-nasce)/(.55+.1*k);if(v<0||v>=1)continue;
   const ang=+el('angle').value*Math.PI/180,x=-k*p.aftDistancia*Math.cos(ang),y=-k*p.aftDistancia*Math.sin(ang),alfa=p.aftOpacidade/100*(1-.12*k);
   if(!p.aftFatias||v<.35){ctx.save();ctx.globalAlpha=alfa*(p.aftFatias?1:1-v);ctx.drawImage(copia,x-W/2,y-H);ctx.restore();continue}
   // Fatias que escorregam para trás e afinam até sumir.
   const u=(v-.35)/.65,faixas=14,fh=copia.height/faixas;
   for(let s=0;s<faixas;s++){const desliza=-(rnd()*.8+.2)*u*90,alt=fh*(1-u*.85);if(alt<.5)continue;
    ctx.save();ctx.globalAlpha=alfa;ctx.drawImage(copia,0,s*fh,copia.width,alt,x-W/2+desliza,y-H+s*fh,copia.width,alt);ctx.restore()}
  }
  if(p.aftOriginal)ctx.drawImage(fonte,-W/2,-H);
 }
});
