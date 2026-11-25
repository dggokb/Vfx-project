function drawMaterial(ctx,kind,t,profile,color,strength){
 const rand=generator(seed),power=.7+strength/23;
 const lift=Math.sin(Math.PI*t),mix=profile.styleMix/100;
 ctx.save();ctx.translate(0,60);ctx.scale(power,power);
 ctx.shadowColor=color;ctx.shadowBlur=profile.light*.17;
 function oval(x,y,rx,ry,angle,ink){
  ctx.beginPath();ctx.ellipse(x,y,rx,ry,angle,0,2*Math.PI);
  ctx.fillStyle=ink;ctx.fill();
 }
 if(kind==='Fogo'){
  for(let i=0;i<9;i++){
   const x=(i-4)*10,w=(16+rand()*10)*profile.rimWidth/100;
   const h=(75+rand()*55-Math.abs(x))*(.55+lift);
   const bend=Math.sin(t*9+rand()*4)*24;
   function flame(scale,ink){
    ctx.save();ctx.translate(x,0);ctx.scale(scale,scale);ctx.beginPath();
    ctx.moveTo(-w,0);ctx.bezierCurveTo(-w*1.6,-h*.45,bend+10,-h*.55,bend,-h);
    ctx.bezierCurveTo(bend+w,-h*.55,w*1.7,-h*.24,w,0);
    ctx.quadraticCurveTo(0,15,-w,0);ctx.fillStyle=ink;ctx.fill();ctx.restore();
   }
   flame(1,color);flame((.43+.19*mix)*profile.coreWidth/100,'#ffdf83');
  }
 }else if(kind==='Água'){
  for(let i=0;i<7;i++){
   const dx=(i-3)*(16+16*t),h=(75+rand()*65)*lift;
   const tip=dx*(1.3+t*.4),y=-h+18*t;
   ctx.beginPath();ctx.moveTo(dx*.46-9*profile.rimWidth/100,2);
   ctx.quadraticCurveTo(dx*.94,-h*.84,tip,y);
   ctx.quadraticCurveTo(dx*.82,-h*.52,dx*.46+12,5);
   ctx.fillStyle=color;ctx.fill();
   oval(tip,y,(4+2*mix)*profile.coreWidth/100,7,dx*.008,'#d4fbff');
  }
  oval(0,4,32+80*t,4+4*lift,0,color);
 }else{
  const w=33+57*t,h=18+20*lift;
  oval(0,0,w,h,0,color);
  for(let i=0;i<5;i++){
   const x=(i-2)*16,y=-(36+rand()*65)*lift;
   const tip=x*(1+.7*t),r=(8+rand()*9)*profile.rimWidth/100;
   ctx.beginPath();ctx.moveTo(x-13,2);ctx.quadraticCurveTo(tip-4,y*.55,tip-r,y);
   ctx.lineTo(tip+r,y);ctx.quadraticCurveTo(tip+3,y*.52,x+14,2);
   ctx.fillStyle=color;ctx.fill();oval(tip,y,r,r*.9,0,color);
   oval(tip-r*.3,y-r*.38,r*(.18+.22*mix)*profile.coreWidth/100,r*.15,-.4,'#eaffbd');
  }
 }
 for(let i=0;i<profile.particles;i++){
  const a=rand(),b=rand(),c=rand();
  if(kind==='Fogo'){
   const age=(a+t*.82)%1;
   materialParticle(ctx,i,(b-.5)*(68+60*age)+9*Math.sin(c*6+age*5),-age*172,1+c*2,2+c*4,.25,'#ffd477');
  }else{
   const slime=kind==='Gosma',x=(a-.5)*(35+t*(slime?150:270));
   const y=-(40+b*(slime?65:145))*lift+14*t;
   const r=(slime?4:1.5)+c*(slime?6:3);
   materialParticle(ctx,i,x,y,r,r*(slime?1.05:1.65),x*.005,color);
  }
 }
 ctx.restore();
}
const drawings={
 Impacto:['Estrela clássica','Clarão em cruz','Serra giratória','Pontas duplas'],
 Corte:['Arco','Corte largo','Estocada','Lâmina dupla'],
 Projétil:['Esfera','Onda larga','Lança','Disparo duplo'],
 Fogo:['Labareda','Muralha','Tocha','Chama dupla'],
 Água:['Respingo','Leque','Jato','Jato duplo'],
 'Pressão de ar':['Anel circular','Onda rente ao chão','Arco frontal','Espiral'],
 'Ponto de luz':['Circular','Feixes de cima','Feixes laterais','Leque'],
 Fumaça:['Pluma','Cortina baixa','Coluna fina','Pluma inclinada'],
 Gosma:['Bolha','Poça larga','Filamento','Fluxo duplo']
};
function materialParticle(ctx,i,x,y,rx,ry,angle,color){
 const profile=profiles[el('kind').value];
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(rx*profile.particleWidth/100,ry);
 ctx.beginPath();
 switch(i%profile.shapes){
 case 1:ctx.arc(0,0,1,0,Math.PI*2);break;
 case 2:ctx.moveTo(-1,1);ctx.lineTo(0,-1);ctx.lineTo(1,1);ctx.closePath();break;
 case 3:ctx.moveTo(0,-1.6);ctx.lineTo(.7,0);ctx.lineTo(0,1.4);ctx.lineTo(-.7,0);ctx.closePath();break;
 default:ctx.ellipse(0,0,1,1,0,0,Math.PI*2);
 }
 ctx.fillStyle=el('linkTint').checked?color:el('particleTint').value;ctx.fill();ctx.restore();
}
const layerCanvas=document.createElement('canvas');
layerCanvas.width=layerCanvas.height=512;
function renderOther(ctx,kind,index,profile,color,strength){
 const motion=el('motion').value,opening=+el('openingFrame').value-1;
 const splitting=kind!=='Fumaça' && motion==='out' && index>=opening;
 let phase=(splitting?opening:index)/(frames-1);
 if(kind!=='Fumaça' && motion==='in')phase=1-phase;
 const layer=layerCanvas.getContext('2d');
 layer.clearRect(0,0,512,512);layer.save();layer.translate(256,256);
 const variant=el('drawing').selectedIndex,vertical=['Fogo','Água','Gosma','Fumaça'].includes(kind);
 const spread=1-.72*profile.focus/100;
 const width=(variant===1?1.35:variant===2?.64:1)*spread;
 const height=variant===1?.78:variant===2?1.25:1;
 const scale=profile.diameter/100;
 layer.scale(scale*(vertical?width:height),scale*(vertical?height:width));
 if(haloEnabled && vertical)lighting(layer,kind,phase,color,profile.light*.55);
 if(kind==='Fumaça'){
  const count=+el('plumes').value,gap=+el('gap').value;
  const mirror=el('smokeMirror').value;
  if(mirror==='flip')layer.scale(-1,1);
  if(el("smokeForm").value==="ring"){
   drawSmokeRing(layer,phase,profile,color,strength);
  }else for(let j=0;j<count;j++){
   const partner=count-1-j;
   const group=mirror==='pairs'?Math.min(j,partner):j;
   const plumeSeed=seed^Math.imul(group,0x45d9f3b);
   layer.save();layer.translate((j-(count-1)/2)*gap,64);
   if(mirror==='pairs' && j>partner)layer.scale(-1,1);
   if(variant===3)layer.transform(1,0,-.45,1,0,0);
   for(const [id,sign] of [['rise',1],['fall',-1]]){
    const reach=+el(id).value/100;
    if(!reach)continue;
    layer.save();layer.scale(1,sign*reach);layer.translate(0,-64);
    const side=j-(count-1)/2;
    const tipOffset=side*(+el('tipGap').value-gap)*(mirror==='pairs'&&j>partner?-1:1);
    if(el('smokeForm').value==='jump')drawJumpSmoke(layer,phase,tipOffset,color,strength,plumeSeed,profile);
    else drawSmoke(layer,phase,profile,color,strength,plumeSeed,tipOffset);
    layer.restore();
   }
   layer.restore();
  }
  layer.restore();ctx.drawImage(layerCanvas,-256,-256);return;
 }
 const copies=variant===3?2:1;
 for(let j=0;j<copies;j++){
  layer.save();
  if(copies===2){layer.translate(vertical?(j?32:-32):0,vertical?0:(j?24:-24));layer.rotate(j?.16:-.16);layer.scale(.78,.78)}
  if(vertical)drawMaterial(layer,kind,phase,profile,color,strength);
  else draw(layer,phase*(frames-1),true);
  layer.restore();
 }
 layer.restore();
 if(!splitting){ctx.drawImage(layerCanvas,-256,-256);return}
 const count=+el('pieces').value,progress=(index-opening+1)/(frames-opening);
 const random=generator(seed^0x8338);
 for(let i=0;i<count;i++){
  const start=i*2*Math.PI/count,end=(i+1)*2*Math.PI/count;
  let angle=(start+end)/2;
  const shape=el('openingShape').value,jitter=random()-.5;
  if(shape==='cross')angle=Math.round(angle/(Math.PI/2))*Math.PI/2;
  if(shape==='fan')angle=Math.sin(angle)*.8;
  if(shape==='spiral')angle+=progress*1.8;
  if(shape==='random')angle+=jitter*.65;
  const reach=progress*(50+100*random())*scale;
  ctx.save();ctx.translate(reach*Math.cos(angle),reach*Math.sin(angle));ctx.scale(1-.65*progress,1-.65*progress);
  ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,365,start,end);ctx.closePath();ctx.clip();
  ctx.drawImage(layerCanvas,-256,-256);ctx.restore();
 }
}
