function lighting(ctx,kind,t,color,amount){
 if(!amount)return;
 ctx.save();
 let x=0,y=0,rx=150,ry=150,pulse=Math.exp(-3*t);
 if(kind==='Corte'){
  x=-95+210*t; y=35-77*t; rx=116; ry=19;
  pulse=.5+.5*Math.sin(Math.PI*t);
 }else if(kind==='Projétil'){
  x=-50+110*t; rx=97; ry=68; pulse=.88+.12*Math.cos(t*12);
 }
 ctx.translate(x,y);
 if(kind==='Corte')ctx.rotate(-.42);
 ctx.scale(rx,ry);
 ctx.globalAlpha*=amount/100*pulse;
 const glow=ctx.createRadialGradient(0,0,0,0,0,1);
 glow.addColorStop(0,'#fff8e9');glow.addColorStop(.23,color);
 glow.addColorStop(.57,color+'85');glow.addColorStop(1,color+'00');
 ctx.fillStyle=glow;ctx.fillRect(-1,-1,2,2);ctx.restore();
}
function aim(angle){
 const focus=profiles.Impacto.focus/100;
 if(!focus)return angle;
 const signed=Math.atan2(Math.sin(angle),Math.cos(angle));
 return signed*(1-.9*focus);
}
function scatter(ctx,kind,t,color,count){
 const random=generator(seed^0x519abe);
 for(let i=0;i<count;i++){
  const a=random(),b=random(),c=random(),d=random();
  let x,y,theta,length;
  if(kind==='Impacto'){
   theta=aim(a*Math.PI*2);const distance=(18+b*45+(80+c*103)*Math.sqrt(t))*profiles.Impacto.diameter/100;
   x=Math.cos(theta)*distance;y=Math.sin(theta)*distance+15*t*t*profiles.Impacto.diameter/100;
   length=3+d*11*(1-t);
  }else if(kind==='Corte'){
   x=-154+310*a+27*t;y=68-55*a-107*a*a+(b-.5)*(16+88*t);
   theta=-.35-.6*a+(c-.5)*.45;length=3+9*d;
  }else{
   const age=(a+t*1.25)%1;
   x=-50+110*t-12-age*(96+b*60);
   y=(c-.5)*(20+65*age)+Math.sin(age*5+b*6)*7;
   theta=(c-.5)*.45;length=(1-age)*(4+11*d);
  }
  ctx.save();ctx.translate(x,y);ctx.rotate(theta);
  ctx.fillStyle=!el('linkTint').checked ? el('particleTint').value : (i%4===0?'#fff7d7':color);
  const impact=kind==='Impacto';
  const width=(1.2+d)*(profiles[kind].particleWidth/100);
  const shape=i%profiles[kind].shapes;
  ctx.beginPath();
  const material=impact?el('material').value:'Energia';
  if(shape===0 && material==='Gosma')ctx.ellipse(0,0,width*2,width*1.65,0,0,Math.PI*2);
  else if(shape===0 && material==='Água')ctx.ellipse(0,0,length*.62,width,0,0,Math.PI*2);
  else if(shape===0 && material==='Fogo'){
   ctx.moveTo(-length,0);ctx.quadraticCurveTo(length*.1,-width*2,length*.7,-width);ctx.quadraticCurveTo(0,width*2,-length,0);
  }else switch(shape){
   case 1: ctx.ellipse(0,0,width*1.35,width,0,0,Math.PI*2); break;
   case 2: ctx.moveTo(-length*.6,width);ctx.lineTo(length,0);ctx.lineTo(-length*.2,-width*1.5);break;
   case 3: for(let k=0;k<8;k++){const angle=k*Math.PI/4;
    const radius=k%2===0?1:.25;
    const px=Math.cos(angle)*length*radius,py=Math.sin(angle)*width*2.8*radius;
    if(k===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
   }break;
   default:ctx.moveTo(-length,0);ctx.lineTo(0,-width);ctx.lineTo(length*.55,0);ctx.lineTo(0,width);
  }
  ctx.closePath();ctx.fill();ctx.restore();
 }
}
function paint(ctx,base,mix,x,y,radius){
 ctx.fillStyle=base;
 if(mix===0){ctx.fill();return}
 const shadow=base.slice(1).match(/../g).map((pair,i)=>
  Math.round(parseInt(pair,16)*(1-mix*[.58,.66,.42][i])));
 const shade='rgb('+shadow.join(',')+')';
 const band=ctx.createLinearGradient(x-radius*.3,y-radius,x+radius*.3,y+radius);
 band.addColorStop(0,base);band.addColorStop(.56,base);
 band.addColorStop(.561,shade);band.addColorStop(1,shade);
 ctx.strokeStyle='rgba(35,17,45,'+mix*.88+')';
 ctx.lineWidth=1+3*mix;ctx.lineJoin='round';ctx.stroke();
 ctx.fillStyle=band;ctx.fill();
}
// Split the filled star into radial triangles, then move each piece from its own centroid.
