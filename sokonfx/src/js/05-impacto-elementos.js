const elementsPalette={
 Raio:['#9365ff','#f8f4ff'],Gelo:['#52bcee','#ddfbff'],Vento:['#a6e4db','#f3fffc'],Pedra:['#9a6950','#e3c49c'],Nanquim:['#30283d','#bbb1c0'],
 Energia:['#ff781a','#fff5cd'],Fogo:['#ff5422','#ffed91'],
 Água:['#238ed6','#c8f6ff'],Gosma:['#68b932','#dcff9a']
};
function impactPath(ctx,points,material,t){
 ctx.beginPath();
 if(material==='Gosma'||material==='Nanquim'){
  const last=points[points.length-1],first=points[0];
  ctx.moveTo((last[0]+first[0])/2,(last[1]+first[1])/2);
  points.forEach(([x,y],i)=>{
   const next=points[(i+1)%points.length];
   ctx.quadraticCurveTo(x,y,(x+next[0])/2,(y+next[1])/2);
  });
 }else{
  ctx.moveTo(...points[0]);
  for(let i=1;i<=points.length;i++){
   const [x,y]=points[i%points.length],[a,b]=points[i-1];
   const dx=x-a,dy=y-b;
   if(material==='Fogo'){
    const curl=.18+.08*Math.sin(t*7+i);
    ctx.bezierCurveTo(a+dx*.35-dy*curl,b+dy*.35+dx*curl,a+dx*.72+dy*.09,b+dy*.72-dx*.09,x,y);
   }else if(material==='Água'){
    ctx.quadraticCurveTo(a+dx*.55+dy*.16,b+dy*.55-dx*.16,x,y);
   }else ctx.lineTo(x,y);
  }
 }
 ctx.closePath();
}
function elementalStreak(ctx,material,r,w,t,ink,highlight,number,polygon){
 ctx.fillStyle=ink;ctx.strokeStyle=ink;ctx.lineWidth=Math.max(1,w);
 ctx.beginPath();
 switch(material){
 case 'Raio':{
  const flicker=Math.floor(t*15/2)+number;
  const kink=(flicker%2?1:-1)*w*2;
  ctx.moveTo(r*.42,0);ctx.lineTo(r*.72,kink);ctx.lineTo(r*.76,-kink*.6);ctx.lineTo(r+28,0);ctx.stroke();
  if(flicker%3){ctx.beginPath();ctx.moveTo(r*.72,kink);ctx.lineTo(r*.86,kink*3);ctx.lineTo(r*.95,kink*2.7);ctx.lineWidth*=.42;ctx.stroke()}
  break;
 }
 case 'Gelo':
  polygon([[r-5,0],[r+5,-w*2],[r+28,-w],[r+16,w*1.6]],ink);
  polygon([[r+5,-w*2],[r+28,-w],[r+10,0]],highlight);break;
 case 'Vento':
  ctx.moveTo(r-12,-w*2);ctx.quadraticCurveTo(r+17,-w*4,r+28,0);
  ctx.quadraticCurveTo(r+17,-w*2,r-12,-w*2);ctx.fill();break;
 case 'Pedra':
  polygon([[r-4,0],[r+1,-w*2],[r+11,-w*1.5],[r+15,w],[r+6,w*2]],ink);break;
 case 'Nanquim':
  ctx.moveTo(r-15,0);ctx.quadraticCurveTo(r+4,-w*2,r+15,-w);
  ctx.quadraticCurveTo(r+25,w*2,r+9,w);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.arc(r+29,0,Math.max(1,w*.6),0,Math.PI*2);ctx.fill();break;
 default:polygon([[r,0],[r+16,-w],[r+32,0],[r+12,w]],ink);
 }
}
