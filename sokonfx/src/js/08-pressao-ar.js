function drawAir(ctx,t,color,profile,strength){
 const tau=Math.PI*2,variant=el('drawing').selectedIndex;
 const waves=Number(el('airWaves').value),width=Number(el('airWidth').value);
 const flow=el('airFlow').value,random=generator(seed);
 ctx.scale(profile.diameter/100,profile.diameter/100*(variant===1?.34:1));
 ctx.shadowColor=color;ctx.shadowBlur=haloEnabled?profile.light*.15:0;
 const spacing=Number(el("airRingGap").value)/100;
 const interval=el("airInterval").value;
 const delayStep=interval==='auto'?.055*spacing:Number(interval)/(frames-1);
 const particleSpread=Number(el("airParticleGap").value)/100;
 for(let wave=0;wave<waves;wave++){
  const delay=wave*delayStep,age=(t-delay)/(1-(waves-1)*delayStep);
  const offset=random()*tau;
  if(age<=0 || age>=1)continue;
  const progress=flow==='in'?1-age:flow==='pulse'?Math.sin(Math.PI*age):age;
  const separation=interval==='auto'?0:wave*spacing*9;
  const radius=7+(125+strength*2+separation)*(1-(1-progress)**2)+separation*.35;
  ctx.globalAlpha=Math.min(1,age*10,(1-age)*6)*(.85-wave*.07);
  if(el('airEdge').value==='spiked'){
   const custom=userRefs.get('Pressão de ar');
   if(custom||pressureAtlas.naturalWidth){
    const breakup=Math.min(15,Math.max(0,Math.round((age-.46)/.54*15)));
    const atlas=custom?null:referenceAtlas(color),scale=87/239;
    const copies=Number(el('airCopies').value);
    for(let j=0;j<copies;j++){
     const fraction=j/copies;
     const angle=variant===2?(copies===1?0:-1.04+2.08*j/(copies-1)):offset+fraction*tau;
     const distance=radius*(variant===3?.4+.58*fraction:.76);
     const reach=radius/122;
     ctx.save();
     ctx.rotate(angle+(variant===3?progress*.65:0));
     ctx.translate(distance,0);
     ctx.rotate(.69);
     ctx.scale(reach,reach*(.8+.2*width/8));
     if(custom)drawRefSprite(ctx,custom,10,-13,87);
     else ctx.drawImage(atlas,(breakup%4)*320,Math.floor(breakup/4)*256,320,256,
      -30-8*scale,-49-60*scale,320*scale,256*scale);
     ctx.restore();
    }
   }
   continue;
  }
  const sections=variant===2?1:4;
  for(let j=0;j<sections;j++){
   const start=variant===2?-1.04:offset+j*tau/sections;
   const span=variant===2?2.08:tau/sections*.93;
   const points=36;
   ctx.beginPath();
   for(let edge=0;edge<2;edge++){
    for(let k=0;k<=points;k++){
     const u=edge?1-k/points:k/points,along=(j+u)/sections;
     const a=start+u*span+(variant===3?progress*.65:0);
     const r=radius*(variant===3?.42+.58*along:1)+Math.sin(a*3+offset)*radius*.018
       -edge*Math.min(radius*.45,width)*Math.sin(Math.PI*u);
     const x=Math.cos(a)*r,y=Math.sin(a)*r;
     if(!edge&&!k)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
   }
   ctx.closePath();ctx.fillStyle=color;ctx.fill();
  }
 }
 const progress=flow==='in'?1-t:flow==='pulse'?Math.sin(Math.PI*t):t;
 ctx.globalAlpha=Math.sin(Math.PI*t)*.65;
 for(let i=0;i<profile.particles;i++){
  const a=variant===2?(random()-.5)*2:random()*tau;
  const r=(8+(125+strength*2)*(1-(1-progress)**2))*(1+particleSpread*(random()*.35-.3));
  materialParticle(ctx,i,r*Math.cos(a),r*Math.sin(a),2+random()*6,1,a,color);
 }
}
