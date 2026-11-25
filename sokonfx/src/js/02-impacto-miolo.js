function externalHeadings(count){
 const random=generator(seed^0x519abe);
 return Array.from({length:count},()=>{
  const angle=aim(random()*Math.PI*2);
  // scatter samples three more values per particle for its size and travel.
  random();random();random();
  return angle;
 });
}
function burstCore(points, progress, color, polygon, headings, inner=points.map(([x,y])=>[x*.66,y*.66])){
 const random=generator(seed^0x432db9);
 const count=Number(el('pieces').value);
 function edge(position,outline=points){
  const i=Math.floor(position),fraction=position-i;
  const a=outline[i%outline.length],b=outline[(i+1)%outline.length];
  return a.map((v,j)=>v+(b[j]-v)*fraction);
 }
 for(let i=0;i<count;i++){
   const start=i*points.length/count,end=(i+1)*points.length/count;
   const piece=[[0,0],edge(start)];
   for(let k=Math.floor(start)+1;k<end;k++)piece.push(points[k]);
   piece.push(edge(end));
   const inside=[[0,0],edge(start,inner),...inner.slice(Math.floor(start)+1,Math.ceil(end)),edge(end,inner)];
   const [mx,my]=edge((start+end)/2);
   const cx=mx*2/3,cy=my*2/3;
   const radial=Math.atan2(cy,cx);
   let direction=radial+(random()-.5)*.32;
   switch(el('openingShape').value){
    case 'cross': direction=Math.round(radial/(Math.PI/2))*Math.PI/2+(direction-radial); break;
    case 'fan': direction=.78*Math.sin(direction); break;
    case 'radial':
    case 'random': {
     direction=radial;
     let best=0;
     for(const angle of headings){
      const alignment=Math.cos(angle-radial);
      if(alignment>best){direction=angle;best=alignment}
     }
     break;
    }
    case 'spiral': direction+=progress*2.3; break;
   }
   const distance=progress*(62+random()*91)*profiles.Impacto.diameter/100;
   const size=(1-progress)**(1.4+random());
   const spin=progress*(random()-.5)*2.5;
   if(['radial','random'].includes(el('openingShape').value)){
    const ux=Math.cos(direction),uy=Math.sin(direction);
    // Keep the original vertices at release, then collapse their cross-track offsets.
    const lateral=size*Math.exp(-9*progress);
    function follow([px,py]){
     const along=(mx*ux+my*uy)*.66*(1-size)+distance+(px*ux+py*uy)*size;
     const across=(-px*uy+py*ux)*lateral;
     return [along*ux-across*uy,along*uy+across*ux];
    }
    polygon(piece.map(follow),color);
    polygon(inside.map(follow),elementsPalette[el('material').value][1]);
    continue;
   }
   const transform=([x,y])=>{
    const dx=(x-cx)*size,dy=(y-cy)*size;
    return [cx+distance*Math.cos(direction)+dx*Math.cos(spin)-dy*Math.sin(spin),
            cy+distance*Math.sin(direction)+dx*Math.sin(spin)+dy*Math.cos(spin)];
   };
   polygon(piece.map(transform),color);
   polygon(inside.map(transform),elementsPalette[el('material').value][1]);
 }
}
// Evaluate the gust in preview coordinates, then convert displacement back
// into each puff's local space (including mirrored and rotated plumes).
