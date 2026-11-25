const pressureAtlas=new Image();
pressureAtlas.onload=()=>preview();
pressureAtlas.src=ASSET("pressao-ar.webp");
const pressureTint=document.createElement('canvas');
let pressureColor='';
function referenceAtlas(color){
 if(color===pressureColor)return pressureTint;
 pressureTint.width=pressureAtlas.naturalWidth;pressureTint.height=pressureAtlas.naturalHeight;
 const ink=pressureTint.getContext('2d');
 ink.drawImage(pressureAtlas,0,0);
 if(color!=='#b8e8fa'){
  const pixels=ink.getImageData(0,0,pressureTint.width,pressureTint.height);
  const rgb=parseInt(color.slice(1),16),channels=[rgb>>16,(rgb>>8)&255,rgb&255];
  for(let i=0;i<pixels.data.length;i+=4){
   if(!pixels.data[i+3])continue;
   const light=pixels.data[i]/255,brightness=pixels.data[i+1]/255;
   for(let k=0;k<3;k++)pixels.data[i+k]=brightness*(channels[k]+(255-channels[k])*light);
  }
  ink.putImageData(pixels,0,0);
 }
 pressureColor=color;return pressureTint;
}
