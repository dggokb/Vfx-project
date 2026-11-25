function draw(ctx,index,local=false){
 drawBase(ctx,index,local);
 const kind=el('kind').value;
 if(local||!userRefs.has(kind)||kind==='Pressão de ar')return;
 ctx.save();ctx.beginPath();ctx.rect(0,0,512,512);ctx.clip();
 ctx.translate(kind==='Ponto de luz'?+el('focusX').value:256,kind==='Ponto de luz'?+el('focusY').value:256);
 ctx.rotate(+el('angle').value*Math.PI/180);drawReferenceLayer(ctx,kind,index/(frames-1),profiles[kind]);ctx.restore();
}
function drawBase(ctx,index,local=false){
 const random=generator(seed),t=index/(frames-1),strength=+el('power').value,color=el('tint').value;
 ctx.save();if(!local){ctx.beginPath();ctx.rect(0,0,512,512);ctx.clip();ctx.translate(el('kind').value==='Ponto de luz'?+el('focusX').value:256,el('kind').value==='Ponto de luz'?+el('focusY').value:256);ctx.rotate(+el('angle').value*Math.PI/180)}
 function polygon(points,fill){if(kind==='Impacto')impactPath(ctx,points,el('material').value,t);else {ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();}
 if(kind==='Impacto'){
  ctx.save();
  ctx.shadowColor=color+Math.round(255*glow).toString(16).padStart(2,'0');
  ctx.shadowBlur=28*glow;
  ctx.fillStyle=fill;ctx.fill();
  ctx.restore();
  if(mix && points.length<=4){
   const [a,b,c]=points;
   face([a,b,[(b[0]+c[0])*.5,(b[1]+c[1])*.5]],'rgba(75,24,51,'+.52*mix+')');
  }
  return;
 }
 const ys=points.map(point=>point[1]),low=Math.min(...ys),high=Math.max(...ys);
 paint(ctx,fill,mix,points.reduce((sum,p)=>sum+p[0],0)/points.length,(low+high)/2,Math.max(1,(high-low)/2))}
 function face(points,ink){
  ctx.beginPath();ctx.moveTo(...points[0]);
  for(const point of points.slice(1))ctx.lineTo(...point);
  ctx.closePath();ctx.fillStyle=ink;ctx.fill();
 }
 function starLayer(points,fill){
  polygon(points,fill);
  if(!mix)return;
  ctx.save();impactPath(ctx,points,el('material').value,t);ctx.clip();
  for(let i=0;i<points.length;i+=2){
   const tip=points[i],right=points[i+1],left=points[(i+points.length-1)%points.length];
   const ridge=[tip[0]*.19,tip[1]*.19];
   face([ridge,tip,right],'rgba(87,30,56,'+.55*mix+')');
   face([ridge,[tip[0]*.89,tip[1]*.89],[left[0]*.71,left[1]*.71]],'rgba(255,251,217,'+.62*mix+')');
  }
  ctx.restore();
 }
 const jump=el('kind').value==='Fumaça' && el('smokeForm').value==='jump';
 // A fumaça que se desfaz em curvas some pelo corte, não pela transparência geral do fim.
 const curlFade=el('kind').value==='Fumaça'?+el('curl').value/100:0;
 const fade=jump?1:Math.min(1,(1-t)*2.4)*(1-curlFade)+curlFade;ctx.globalAlpha=fade;
 const kind=el('kind').value,profile=profiles[kind];
 if(kind==='Pressão de ar'){drawAir(ctx,t,color,profile,strength);ctx.restore();return}
 if(kind==='Ponto de luz'){drawFocus(ctx,t,color,profile,strength);ctx.restore();return}
 if(!local && kind!=='Impacto'){renderOther(ctx,kind,index,profile,color,strength);ctx.restore();return}
 if(local)ctx.globalAlpha=1;
 const art=el('artStyle').value;
 if(kind==='Impacto' && art==='manga')ctx.filter='grayscale(1) contrast(350%)';
 const glow=profile.light/100;
 const mix=kind==='Impacto'&&art==='anime'?Math.max(.85,profile.styleMix/100):profile.styleMix/100;
 const motion=el('motion').value;
 const directional=kind==='Impacto' && (motion==='in'||motion==='out');
 let travel=t;
 if(directional){
  travel=motion==='in'?1-t:t;
  const scale=.10+.90*(1-(1-travel)**2);
  ctx.scale(scale,scale);
 }
 if(haloEnabled)lighting(ctx,kind,directional?travel:t,color,profile.light);
 if(kind==='Impacto'){
 const points=[];
 const drawing=el('drawing').value;
 let rays=strength+4;
 if(drawing==='cross')rays=4*Math.max(2,Math.round(rays/4));
 if(drawing==='twin')rays=2*Math.ceil(rays/2);
 const spacing=2*Math.PI/rays;
 const lengths=Array.from({length:rays},(_,i)=>{
  const length=68+random()*95;
  if(drawing==='cross')return i%(rays/4)===0?145+.22*length:.38*length;
  if(drawing==='saw')return 68+.42*length;
  return length;
 });
 const width=profile.riskWidth;
 for(let i=0;i<rays;i++){
  const a=i*spacing;
  const r=lengths[i]*(directional?1:(1+.35*Math.sin(t*4))*(1-.75*t));
  // Above 250%, broaden the base toward the shorter adjacent tip.
  const broadening=Math.max(0,(width-250)/750);
  const limit=.92*Math.min(lengths[i],lengths[(i+1)%rays]);
  const base=(22*Math.min(width,250)/100+broadening*(limit-55))*(directional?1:1-t);
  let valley=a+.2+broadening*(spacing/2-.2);
  let tip=a;
  let root=base;
  if(drawing==='saw'){tip+=spacing*.33;valley=a+spacing*.93;root=Math.min(r*.84,base*2.5)}
  if(drawing==='twin'){
   tip+=(i%2===0?1:-1)*spacing*.23;
   valley=a+spacing*.5;
   if(i%2===0)root=Math.max(base,limit*.64*(directional?1:1-t));
  }
  points.push([r*Math.cos(aim(tip)),r*Math.sin(aim(tip))],[root*Math.cos(aim(valley)),root*Math.sin(aim(valley))])
  // Anchor the cut in the radial fan to the contact point as the cone closes.
  if(profile.focus && a<=Math.PI && a+spacing>Math.PI){
   const seam=valley>Math.PI?points.length-1:points.length;
   const fade=Math.min(1,profile.focus/15);
   const joint=[-base*(1-fade),0];
   points.splice(seam,0,joint,joint);
  };
 }
 const material=el('material').value;
 const rayColor=art==='manga'?'#161616':color,coreColor=art==='manga'?'#ffffff':elementsPalette[el('material').value][1];
 function layer(width,scale){
  return points.map(([x,y],i)=>{
   let factor=1;
   if(i%2 && width!==100){
    const radius=Math.hypot(x,y);
    const limit=Math.min(Math.hypot(...points[i-1]),Math.hypot(...points[(i+1)%points.length]));
    factor=width<100?width/100:1+(width-100)/150*Math.max(0,limit/Math.max(radius,.001)-1)*.9;
   }
   return [x*factor*scale,y*factor*scale];
  });
 }
 const shell=layer(profile.rimWidth,1),inner=layer(profile.coreWidth,.66);
 const streaks=Array.from({length:strength*2},()=>({
  angle:aim(random()*Math.PI*2),
  radius:(16+random()*65+120*travel)*profile.diameter/100,
  width:(2+random()*3)*profile.outerWidth/100
 }));
 const opening=+el('openingFrame').value||7;
 if(motion==='out' && index+1>=opening){
  const progress=(index+2-opening)/(frames+1-opening);
  ctx.globalAlpha=Math.min(1,(1-t)*8);
  const headings=streaks.map(streak=>streak.angle).concat(externalHeadings(profile.particles));
  burstCore(shell,progress,rayColor,polygon,headings,inner);

  ctx.globalAlpha=fade;
 }else{
  if(material==='Vento'){
   for(let j=0;j<3;j++){ctx.beginPath();ctx.ellipse(0,0,22+travel*65+j*7,17+travel*44+j*5,0,j*2+travel,j*2+travel+1.8);ctx.strokeStyle=j===1?coreColor:rayColor;ctx.lineWidth=2+j;ctx.stroke()}
  }else{
   starLayer(shell,rayColor);starLayer(inner,coreColor);
   if(material==='Gelo'||material==='Pedra'){
    for(let j=0;j<inner.length;j+=4)face([[0,0],inner[j],inner[(j+1)%inner.length]],material==='Gelo'?'#64a8d7':'#765544');
   }
  }
 }
 for(const [number,streak] of streaks.entries()){
  ctx.save();
  if(material==='Pedra')ctx.translate(0,travel*travel*48);
  ctx.rotate(streak.angle);
  elementalStreak(ctx,material,streak.radius,streak.width,travel,rayColor,coreColor,number,polygon);
  ctx.restore();
 }
 if(material==='Pedra' && t>.24){
  const dust=generator(seed^0x35df);ctx.save();ctx.globalAlpha*=.36*Math.sin(Math.PI*(t-.24)/.76);
  for(let j=0;j<profile.particles;j++){
   const x=(dust()-.5)*(48+180*t),y=18+36*t-dust()*21;
   ctx.beginPath();ctx.ellipse(x,y,6+11*t,4+6*t,0,0,Math.PI*2);ctx.fillStyle=rayColor;ctx.fill();
  }ctx.restore();
 }
 }else if(el('kind').value==='Corte'){
 for(let i=0;i<strength;i++){const offset=(random()-.5)*44,r=118+random()*84;
 ctx.beginPath();ctx.moveTo(-r+62*t,74+offset);ctx.quadraticCurveTo(10,42+offset,r-36*(1-t),-108+offset);ctx.quadraticCurveTo(8,42+offset+(23-20*t)*(i%4===0?profile.coreWidth:profile.rimWidth)/100,-r+62*t,74+offset);ctx.closePath();paint(ctx,i%4===0?'#fff6d6':color,mix,10,offset,80)}
 }else{
 const x=-50+110*t;
 for(let i=0;i<strength*2;i++){const y=(random()-.5)*70,w=(4+random()*13)*profile.rimWidth/100,len=50+random()*108,phase=random()*6.28;
 polygon([[x+30,y],[x-16,y-w],[x-len+13*Math.sin(phase+7*t),y*.6],[x-20,y+w]],i%4===0?'#fff6d6':color)}
 ctx.beginPath();ctx.ellipse(x,0,48,36,0,0,Math.PI*2);paint(ctx,color,mix,x,0,36);ctx.beginPath();ctx.ellipse(x+8,0,32,21*profile.coreWidth/100,0,0,Math.PI*2);paint(ctx,'#fff7df',mix,x+8,0,21)
 }
 scatter(ctx,kind,travel,color,profile.particles);
 if(kind==='Impacto'&&art==='brush'){
  const grain=generator(seed^0x91bf);ctx.save();ctx.globalCompositeOperation='destination-out';
  for(let j=0;j<320;j++){
   const a=aim(grain()*Math.PI*2),r=grain()*210,len=3+grain()*19;
   ctx.save();ctx.rotate(a);ctx.fillStyle='#000';ctx.fillRect(r,-1,len,.5+grain()*1.6);ctx.restore();
  }ctx.restore();
 }
 ctx.restore()
}
