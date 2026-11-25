const userRefs=new Map(),refRequests=new Map(),refErrors=new Map();
function refreshRef(){
 const kind=el('kind').value,item=userRefs.get(kind);
 el('refClear').hidden=!item;
 el('refStatus').textContent=refErrors.get(kind)||item?.name||'';
}
async function loadRef(kind,src,name){
 const token=Symbol();refRequests.set(kind,token);refErrors.delete(kind);
 if(!src){userRefs.delete(kind);refreshRef();preview();return}
 try{
  if(!/^(blob:|data:image\/(png|webp|jpeg);base64,)/.test(src))throw Error();
  const image=new Image();image.src=src;await image.decode();
  if(refRequests.get(kind)!==token)return;
  const scale=Math.min(1,512/Math.max(image.width,image.height));
  const sprite=document.createElement('canvas');sprite.width=Math.max(1,Math.round(image.width*scale));sprite.height=Math.max(1,Math.round(image.height*scale));
  sprite.getContext('2d').drawImage(image,0,0,sprite.width,sprite.height);
  userRefs.set(kind,{sprite,name,data:sprite.toDataURL('image/png')});
  if(kind==='Pressão de ar' && el('kind').value===kind){el('airEdge').value='spiked';refreshSmoke()}
 }catch{if(refRequests.get(kind)===token)refErrors.set(kind,'Não foi possível abrir a imagem.')}
 refreshRef();preview();
}
el('refUpload').onchange=async event=>{
 const file=event.target.files[0];if(!file)return;
 const url=URL.createObjectURL(file);event.target.value='';
 try{await loadRef(el('kind').value,url,file.name)}finally{URL.revokeObjectURL(url)}
};
el('refClear').onclick=()=>loadRef(el('kind').value,null);
function drawRefSprite(ctx,item,x,y,size){
 const image=item.sprite,scale=size/Math.max(image.width,image.height);
 ctx.drawImage(image,x-image.width*scale/2,y-image.height*scale/2,image.width*scale,image.height*scale);
}
function drawReferenceLayer(ctx,kind,t,profile){
 const item=userRefs.get(kind);if(!item||kind==='Pressão de ar')return;
 const progress=el('motion').value==='in'?1-t:t;
 let x=0,y=0;
 if(kind==='Projétil'||kind==='Corte')x=(progress-.5)*210;
 if(['Fogo','Água','Gosma','Fumaça'].includes(kind))y=54-110*t;
 ctx.save();ctx.globalAlpha=Math.min(1,t*9,(1-t)*5);
 drawRefSprite(ctx,item,x,y,(55+100*Math.sin(Math.PI*t))*profile.diameter/100);
 ctx.restore();
}
