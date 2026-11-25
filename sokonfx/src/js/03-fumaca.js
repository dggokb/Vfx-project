function bendSmoke(ctx,x,y,t){
 const force=+el('windForce').value/100;
 if(!force)return;
 const m=ctx.getTransform(),angle=+el('angle').value*Math.PI/180;
 const c=Math.cos(angle),s=Math.sin(angle);
 const a=c*m.a-s*m.b,b=s*m.a+c*m.b,d=s*m.c+c*m.d,h=c*m.c-s*m.d;
 const px=m.a*x+m.c*y+m.e-256,py=m.b*x+m.d*y+m.f-256;
 const dx=256+c*px-s*py-el('windX').value,dy=256+s*px+c*py-el('windY').value;
 const dir=+el('windAngle').value*Math.PI/180,u=Math.cos(dir),v=Math.sin(dir);
 const along=dx*u+dy*v,cross=-dx*v+dy*u;
 const width=+el('windWidth').value/2,reach=along<0?38:145;
 // Integrate exposure from the emitter to this puff. Past contact keeps
 // carrying the puff downwind even after its centre leaves the narrow jet.
 const pathX=a*x+h*y,pathY=b*x+d*y;
 let exposure=0;
 for(let i=0;i<16;i++){
  const back=(i+.5)/16;
  const sx=dx-back*pathX,sy=dy-back*pathY;
  const axial=sx*u+sy*v,lateral=-sx*v+sy*u;
  exposure+=Math.exp(-.5*((axial/(axial<0?38:145))**2+(lateral/width)**2))/16;
 }
 const local=Math.exp(-.5*((along/reach)**2+(cross/width)**2));
 const amount=force*(58*local+270*t*exposure);
 const det=a*d-b*h;
 const lx=(d*u-h*v)/det,ly=(a*v-b*u)/det;
 const gx=-amount*(along*u/(reach*reach)-cross*v/(width*width));
 const gy=-amount*(along*v/(reach*reach)+cross*u/(width*width));
 const localX=gx*a+gy*b,localY=gx*h+gy*d;
 ctx.translate(x+amount*lx,y+amount*ly);
 const limit=Math.min(1,.7/(Math.hypot(lx,ly)*Math.hypot(localX,localY)||1));
 ctx.transform(1+lx*localX*limit,ly*localX*limit,lx*localY*limit,1+ly*localY*limit,0,0);
 ctx.translate(-x,-y);
}
function drawSmokeRing(ctx,t,profile,color,strength){
 const random=generator(seed),tau=Math.PI*2;
 const travel=1-(1-t)**2;
 const radius=+el('ringRadius').value+(44+strength)*travel;
 const count=16+4*Number(el('plumes').value);
 const opacity=Math.min(1,t*14)*(1-t*t);
 for(let i=0;i<count;i++){
  const angle=tau*(i+random()*.4)/count;
  const r=radius+(random()-.5)*(5+7*t);
  const x=Math.cos(angle)*r,y=Math.sin(angle)*r;
  const size=(.82+.36*random())*(5+r*Math.PI/count+7*travel);
  ctx.save();bendSmoke(ctx,x,y,t);ctx.translate(x,y);ctx.rotate(angle);
  ctx.scale(profile.rimWidth/100,1);ctx.globalAlpha*=opacity*.9;
  ctx.fillStyle=color;ctx.beginPath();
  ctx.ellipse(0,0,size*.76,size*1.3,0,0,tau);ctx.fill();
  ctx.globalAlpha*=.15+.35*profile.styleMix/100;
  ctx.fillStyle='#fff';ctx.beginPath();
  ctx.ellipse(size*.25,0,size*.23*profile.coreWidth/100,size*.73,-.16,0,tau);
  ctx.fill();ctx.restore();
 }
 for(let i=0;i<profile.particles;i++){
  const angle=random()*tau,r=radius+(random()-.35)*(10+45*travel);
  const x=r*Math.cos(angle),y=r*Math.sin(angle),size=1+3*random();
  ctx.save();bendSmoke(ctx,x,y,t);ctx.globalAlpha*=opacity*.55;
  materialParticle(ctx,i,x,y,size,size*.7,angle,color);ctx.restore();
 }
}
function smokeOrigins(){
 const x=Number(el('dissolveX').value),y=Number(el('dissolveY').value);
 if(x<0)return [];
 let extra=[];
 try{const stored=JSON.parse(el('moreDissolve').value);if(Array.isArray(stored))extra=stored.filter(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite))}catch{}
 return [[x,y],...extra].map(([px,py])=>new DOMPoint(px,py));
}
function drawJumpSmoke(ctx,t,tipOffset,color,strength,plumeSeed,profile){
 const random=generator(plumeSeed),volume=Number(el('jumpVolume').value)/100;
 const curl=Number(el('jumpCurl').value)/100;
 const opening=(Number(el('jumpOpen').value)-1)/15;
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
 const release=smooth((t-opening)/(1-opening));
 const direction=el('jumpDirection').value;
 function travel(side){
  if(direction==='up')return [side*.18,-1];
  if(direction==='left')return [-1,-.24];
  if(direction==='right')return [1,-.24];
  return [side,-.32];
 }
 const rise=smooth(t/.65),growth=.22+.78*smooth(t/.48);
 const height=(90+strength*10)*rise;
 const cel=profile.styleMix/100,outer=profile.rimWidth/100;
 const joinHeight=200*Number(el('joinAt').value)/100;
 const drift=y=>tipOffset*smooth(-y/joinHeight);
 const rgb=color.slice(1).match(/../g).map(c=>parseInt(c,16));
 const ink=(white,gain)=>'rgb('+rgb.map(c=>Math.round((c+(255-c)*white)*gain)).join(',')+')';
 ctx.save();ctx.translate(0,64);ctx.shadowColor=color;ctx.shadowBlur=profile.light*.22;
 // A single outline grows from the floor. Its right flank rolls inward to open the curl.
 const width=(35+72*growth)*outer*Math.sqrt(volume);
 const lift=34+height;
 const jitter=(random()-.5)*.12;
 const erosion=smooth((release-.46)/.54);
 const offsets=smokeZones.map(zone=>[+el("offset"+zone+"X").value,+el("offset"+zone+"Y").value]);
 const roll=Number(el('jumpRoll').value)/100;
 const phase=t*6.4+jitter*8;
 // Counter-rotating eddies carry the lit folds and the outside edge through the same flow.
 const eddies=[[-.43+.12*Math.sin(phase),-.49-.14*t,1],[.35+.13*Math.cos(phase),-.72+.09*Math.sin(phase),-1]];
 function point(x,y){
  const above=Math.max(0,-y);
  const [dx,dy]=travel(x<0?-1:1);
  const top=smooth((above-.4)/.59),base=1-smooth((above-.055)/.345);
  const weights=[top,1-top-base,base];
  const delta=axis=>weights.reduce((sum,w,i)=>sum+w*offsets[i][axis]*(i===2&&axis===0?x/1.03:1),0)*growth;
  for(const [cx,cy,spin] of eddies){
   const vx=x-cx,vy=(y-cy)*1.6;
   const twist=spin*roll*(1.5+.95*Math.sin(phase+spin))*Math.exp(-3.4*(vx*vx+vy*vy))*smooth(above/.2);
   const c=Math.cos(twist),sn=Math.sin(twist);
   x=cx+c*vx-sn*vy;y=cy+(sn*vx+c*vy)/1.6;
  }
  x+=roll*.095*Math.sin(12*y+phase*1.7)*smooth(above/.3);
  y+=roll*.055*Math.sin(9*x-phase)*smooth(above/.35);
  return [delta(0)+width*(x+jitter*above)+drift(-above*lift)+dx*release*above*18,
          delta(1)+y*lift+dy*release*above*18];
 }

 ctx.save();bendSmoke(ctx,0,-lift*.45,t);
 if(collectHandles && !smokeHandles.length){
  const matrix=new DOMMatrix().translate(256,256).rotate(+el('angle').value).translate(-256,-256).multiply(ctx.getTransform());
  const anchors=[[-.42,-.99],[.86,-.40],[1.03,-.055]];
  smokeHandles=anchors.map(([x,y],i)=>{
   const p=new DOMPoint(...point(x,y)).matrixTransform(matrix);
   return {zone:smokeZones[i],x:p.x,y:p.y,matrix,weight:growth};
  });
 }
 // Independent pockets of air thin the plume locally, including the shaded folds.
 const pockets=generator(plumeSeed^0x3a1ed);
 const origins=smokeOrigins(),manual=origins.length>0;
 const toStage=manual?new DOMMatrix().translate(256,256).rotate(+el('angle').value).translate(-256,-256).multiply(ctx.getTransform()):null;
 for(const center of origins){
  if(release<=0)break;
  const hole=new Path2D();hole.rect(-8192,-8192,16384,16384);
  const inverse=toStage.inverse();
  for(let k=0;k<48;k++){
   const a=k*Math.PI/24,r=release*210*(1+.13*Math.cos(3*a)+.07*curl*Math.sin(5*a));
   const q=new DOMPoint(center.x+r*Math.cos(a),center.y+r*Math.sin(a)).matrixTransform(inverse);
   if(k)hole.lineTo(q.x,q.y);else hole.moveTo(q.x,q.y);
  }
  hole.closePath();ctx.clip(hole,'evenodd');
 }
 for(let i=0;i<8;i++){
  const angle=i*Math.PI*.25+(pockets()-.5)*.36;
  const spread=.46+pockets()*.47;
  const cx=spread*Math.cos(angle),cy=-.54+.50*spread*Math.sin(angle);
  const lag=pockets()*.29,rotation=pockets()*Math.PI;
  const location=manual?new DOMPoint(...point(cx,cy)).matrixTransform(toStage):null;
  const delay=manual?Math.min(.9,.14+Math.min(...origins.map(p=>Math.hypot(location.x-p.x,location.y-p.y)))/350):lag;
  const amount=smooth((release-delay)/(1-delay));
  if(amount<=0)continue;
  const cut=new Path2D();
  cut.rect(-8192,-8192,16384,16384);
  for(let j=0;j<32;j++){
   const a=j*Math.PI/16;
   const r=amount*(1+.14*Math.sin(3*a+rotation)+.08*Math.cos(5*a-rotation));
   const px=cx+r*.94*Math.cos(a);
   const py=cy+r*.49*(Math.sin(a)+.26*curl*Math.cos(2*a+rotation));
   const xy=point(px,py);
   if(j===0)cut.moveTo(...xy);else cut.lineTo(...xy);
  }
  cut.closePath();ctx.clip(cut,'evenodd');
 }
 // Irregular bites grow from the perimeter and progressively consume the last islands.
 if(erosion>0){
  for(let i=0;i<18;i++){
   const a=2*Math.PI*(i+.25*pockets())/18;
   const cx=1.03*Math.cos(a),cy=-.52+.55*Math.sin(a);
   const progress=Math.max(0,erosion*(1.2+.5*pockets())-.15);
   if(!progress)continue;
   const cut=new Path2D();cut.rect(-8192,-8192,16384,16384);
   for(let j=0;j<24;j++){
    const b=j*Math.PI/12,r=progress*(.92+.15*Math.sin(3*b+a));
    const q=point(cx+r*Math.cos(b),cy+r*.75*Math.sin(b));
    if(j)cut.lineTo(...q);else cut.moveTo(...q);
   }
   cut.closePath();ctx.clip(cut,'evenodd');
  }
 }

 let pathX,pathY;
 function startFold(x,y){pathX=x;pathY=y;ctx.beginPath();ctx.moveTo(...point(x,y))}
 function curve(x1,y1,x2,y2,x3,y3){
  for(let k=1;k<=12;k++){
   const u=k/12,v=1-u;
   ctx.lineTo(...point(v**3*pathX+3*v*v*u*x1+3*v*u*u*x2+u**3*x3,
                       v**3*pathY+3*v*v*u*y1+3*v*u*u*y2+u**3*y3));
  }
  pathX=x3;pathY=y3;
 }
 startFold(-.76,0);
 curve(-1,.01,-.9,-.09,-.77,-.15);
 curve(-.58,-.29,-1.03,-.31,-.97,-.48);
 curve(-1.02,-.59,-.84,-.68,-.80,-.69);
 curve(-.96,-.85,-.66,-1.01,-.42,-.99);
 curve(-.14,-1.17,.25,-1.11,.43,-.99);
 curve(.75,-.98,.96,-.81,.82,-.67);
 curve(.92,-.57,.80,-.51,.70,-.49);
 curve(.63,-.50,.87,-.51,.86,-.40);
 curve(.87,-.34,.69,-.30,.66,-.26);
 curve(.99,-.29,1.14,-.11,1.03,-.055);
 curve(.94,.016,.48,0,.33,0);
 ctx.closePath();ctx.fillStyle=ink(.13*cel,1-.20*cel);ctx.fill();
 ctx.clip();ctx.shadowBlur=0;
 // Light follows the same outer silhouette. The scalloped edge describes the rolling fold.
 const shadow=.10*(profile.coreWidth/100-1);
 startFold(-1.3,-1.4);
 curve(-1.3,-1.4,1.3,-1.4,1.3,-1.4);
 curve(1.3,-1.3,1.3,-.44+shadow,1.3,-.44+shadow);
 curve(.96,-.36,.58,-.43,.33,-.56+shadow);
 curve(.04,-.52,-.36,-.48,-.46,-.67+shadow);
 curve(-.73,-.65,-.85,-.79,-1.3,-.78);
 ctx.closePath();ctx.fillStyle=ink(.38+.56*cel,1);ctx.fill();
 startFold(-.68,-.39);
 curve(-.46,-.53,-.22,-.28,.03,-.33);
 curve(.36,-.48,.81,-.50,1.15,-.26);
 curve(1.12,-.13,.80,-.07,.62,-.16+shadow);
 curve(.41,-.02,.03,-.03,-.11,-.20+shadow);
 curve(-.45,-.16,-.42,-.33,-.68,-.39);
 ctx.closePath();ctx.fill();ctx.restore();
 // Small detached puffs follow the same plume and wind as the main body.
 for(let i=0;i<profile.particles;i++){
  const side=random()*2-1,delay=random()*.35,size=2+random()*4;
  const age=Math.max(0,(t-delay)/(1-delay));
  if(age<=0||age>=1)continue;
  const y=-age*(60+height*(.45+.55*Math.abs(side)));
  const x=side*(12+age*100)*outer+drift(y);
  ctx.save();bendSmoke(ctx,x,y,t);ctx.globalAlpha*=.72*Math.sin(Math.PI*age);
  materialParticle(ctx,i,x,y,size*1.6,size,side*.8,color);ctx.restore();
 }
 ctx.restore();
}
function drawSmoke(ctx,t,profile,color,strength,plumeSeed=seed,tipOffset=0){
 const random=generator(plumeSeed^0xab529d);
 const channels=color.slice(1).match(/../g).map(v=>parseInt(v,16));
 const tint=(gain,white)=>'rgb('+channels.map(v=>Math.round(v*gain+white)).join(',')+')';
 // Claridade da sombra: 0 é a sombra de antes (65% da cor); 100 quase a própria cor.
 const sl=+el('shadeLight').value/100,curl=+el('curl').value/100;
 const shade=tint(.65+.3*sl,0),light=tint(.78,48);
 const dense=6+strength, height=128+strength*2;
 function spreadAt(y){
  const z=Math.max(0,Math.min(1,-y/(height*el('joinAt').value/100)));
  return tipOffset*z*z*(3-2*z);
 }
 ctx.save();ctx.translate(0,64);
 for(let i=0;i<dense;i++){
  const delay=i/dense*.42,age=(t-delay)/(1-delay);
  const side=random()*2-1, swirl=random()*6.28, swell=random();
  if(age<=0||age>=1)continue;
  const y=-age*height+10*Math.sin(swirl+age*4);
  const x=side*(5+age*42)+Math.sin(swirl+age*5)*age*23+spreadAt(y);
  const radius=(9+age*(30+swell*19))*Math.min(1,age*9);
  ctx.save();bendSmoke(ctx,x,y,t);ctx.translate(x,y);ctx.scale(profile.rimWidth/100,1);
  // Dissipar em curvas: a transparência some menos e, da metade da vida em diante, cada bola é
  // comida por dentro por outra que cresce deslocada; sobram meias-luas que se afinam até sumir.
  const fadeAlpha=(1-age**2)*.86,keep=Math.max(0,1-Math.max(0,age-.82)/.18)*.95;
  ctx.globalAlpha*=Math.min(1,age*10)*(fadeAlpha+(keep-fadeAlpha)*curl);
  const bite=curl>0?Math.max(0,Math.min(1,(age-.3)/.62))*curl:0;
  if(bite>0){
   // Um corte por tufo, vindo de um lado (o giro do tufo) e crescendo: o tufo inteiro vira uma
   // meia-lua virada para o outro lado, que afina até sumir.
   const cut=radius*(.35+1.0*bite),off=radius*(.75-.2*bite);
   ctx.save();ctx.beginPath();ctx.rect(-4*radius,-4*radius,8*radius,8*radius);
   ctx.ellipse(-Math.cos(swirl)*off,-Math.abs(Math.sin(swirl))*off*.6,cut,cut*.85,0,0,Math.PI*2);
   ctx.clip('evenodd');
  }
  // Overlapping scallops drift together as one billow.
  for(let l=0;l<5;l++){
   const angle=swirl+l*Math.PI*2/5+age*.6;
   const dx=Math.cos(angle)*radius*.44,dy=Math.sin(angle)*radius*.34;
   ctx.beginPath();ctx.ellipse(dx,dy,radius*.78,radius*.67,angle*.12,0,Math.PI*2);
   ctx.fillStyle=l<2?shade:color;ctx.fill();
  }
  if(bite>0)ctx.restore();
  if(bite>.2){ctx.restore();continue;}
  ctx.globalAlpha*=.25+.56*profile.styleMix/100;
  ctx.beginPath();ctx.ellipse(-radius*.18,-radius*.38,radius*.47*profile.coreWidth/100,radius*.22,-.25,0,Math.PI*2);
  ctx.fillStyle=light;ctx.fill();ctx.restore();
 }
 ctx.globalAlpha*=.38*Math.sin(t*Math.PI);
 for(let i=0;i<profile.particles;i++){
  const side=random()*2-1,phase=random()*6.28,age=random()*.35+t*.65;
  const radius=2+random()*6;
  const y=-age*(height+20),x=side*(15+age*62)+Math.sin(phase+t*5)*15+spreadAt(y);
  ctx.save();bendSmoke(ctx,x,y,t);
  materialParticle(ctx,i,x,y,radius*1.5,radius,side*.6,color);ctx.restore();
 }
 ctx.restore();
}
