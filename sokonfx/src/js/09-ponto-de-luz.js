function drawFocus(ctx,t,color,profile,strength){
 const random=generator(seed),count=+el('beams').value,width=+el('beamWidth').value;
 const variant=el('drawing').selectedIndex;
 const pulse=Math.sin(Math.PI*t),level=Math.min(1,t*8)*Math.min(1,(1-t)*6);
 ctx.globalAlpha=level;ctx.globalCompositeOperation='lighter';
 const rays=[];
 for(let i=0;i<count;i++){
  const fraction=(i+.5)/count,jitter=(random()-.5)*.22;
  let a=fraction*2*Math.PI+jitter;
  if(variant===1)a=-Math.PI/2+(fraction-.5)*1.8+jitter;
  if(variant===2)a=(i%2)*Math.PI+jitter+(fraction-.5)*.5;
  if(variant===3)a=(fraction-.5)*1.45+jitter;
  const length=(115+random()*95)*profile.diameter/100;
  const w=width*(.6+.7*random()),front=length*Math.max(0,1-t*(3+random()));
  rays.push([a,length]);
  ctx.save();ctx.rotate(a);
  const gradient=ctx.createLinearGradient(0,0,length,0);
  gradient.addColorStop(0,'#fff7de');gradient.addColorStop(.25,color+'ae');gradient.addColorStop(1,color+'00');
  ctx.fillStyle=gradient;ctx.beginPath();ctx.moveTo(front,-1-front*w/length);
  ctx.lineTo(length,-w);ctx.lineTo(length,w);ctx.lineTo(front,1+front*w/length);ctx.closePath();ctx.fill();ctx.restore();
 }
 for(let i=0;i<profile.particles;i++){
  const [a,len]=rays[i%count],r=(1-(random()+t*1.45)%1)*len;
  ctx.save();ctx.rotate(a);ctx.fillStyle=color;ctx.fillRect(r,-1,2+random()*6,1.6);ctx.restore();
 }
 const charge=Math.min(1,t*3)*(.6+.4*pulse),core=(2+strength*.55)*charge;
 if(core>0){
  const radius=core+profile.light*.55;
  const halo=ctx.createRadialGradient(0,0,0,0,0,radius);
  halo.addColorStop(0,'#ffffff');halo.addColorStop(.2,color+'cf');halo.addColorStop(1,color+'00');
  ctx.fillStyle=halo;ctx.fillRect(-radius,-radius,2*radius,2*radius);
  ctx.fillStyle='#fffbe9';ctx.beginPath();ctx.arc(0,0,core,0,2*Math.PI);ctx.fill();
 }
}
