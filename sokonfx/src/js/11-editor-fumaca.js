let pickingWind=false;
el('windPick').onclick=()=>{
 pickingWind=!pickingWind;
 el('windPick').textContent=pickingWind?'Toque no ponto da fumaça · cancelar':'Posicionar vento na prévia';
 preview();
};
let choosingDissolve=false;
function toggleDissolve(value){
 choosingDissolve=value;
 el('pickDissolve').textContent=value?'Concluir marcação':'Marcar pontos de dissipação';
}
el('pickDissolve').onclick=()=>{
 if(editingSmoke)setSmokeEditor(false);
 if(pickingWind)el('windPick').onclick();
 toggleDissolve(!choosingDissolve);
 if(choosingDissolve){if(playing)el('play').onclick();el('frame').value=+el('jumpOpen').value-1}
 preview();
};
el('autoDissolve').onclick=()=>{toggleDissolve(false);el('moreDissolve').value='[]';el('dissolveX').value=el('dissolveY').value=-1;preview()};
stage.onpointerdown=e=>{
 if(choosingDissolve && el('kind').value==='Fumaça' && el('smokeForm').value==='jump'){
  const p=canvasPoint(e),list=smokeOrigins();
  const hit=list.findIndex(q=>Math.hypot(p.x-q.x,p.y-q.y)<10);
  if(hit>=0)list.splice(hit,1);else list.push(p);
  el('dissolveX').value=list.length?Math.round(list[0].x):-1;
  el('dissolveY').value=list.length?Math.round(list[0].y):-1;
  el('moreDissolve').value=JSON.stringify(list.slice(1).map(q=>[Math.round(q.x),Math.round(q.y)]));
  preview();return;
 }
 const focus=el('kind').value==='Ponto de luz';
 if(!focus&&(!pickingWind||el('kind').value!=='Fumaça'))return;
 const box=stage.getBoundingClientRect();
 const side=Math.min(box.width,box.height);
 for(const [id,pos,origin,size] of [[focus?'focusX':'windX',e.clientX,box.left,box.width],[focus?'focusY':'windY',e.clientY,box.top,box.height]]){
  el(id).value=Math.round(Math.max(0,Math.min(512,512*(pos-origin-(size-side)/2)/side)));
 }
 if(focus)preview();else el('windPick').onclick();
};
function windGuide(ctx){
 if(!pickingWind||el('kind').value!=='Fumaça')return;
 ctx.save();ctx.translate(+el('windX').value,+el('windY').value);ctx.rotate(+el('windAngle').value*Math.PI/180);
 ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(0,0,+el('windWidth').value/2,0,2*Math.PI);ctx.stroke();ctx.setLineDash([]);
 ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(30,0);ctx.lineTo(22,-5);ctx.moveTo(30,0);ctx.lineTo(22,5);ctx.stroke();ctx.restore();
}
const smokeZones=['Topo','Dobra','Base'];
let editingSmoke=false,collectHandles=false,smokeHandles=[],heldHandle=null;
function smokeEditorActive(){
 return editingSmoke && el('kind').value==='Fumaça' && el('smokeForm').value==='jump';
}
function setSmokeEditor(enabled){
 editingSmoke=enabled;heldHandle=null;
 stage.style.touchAction=enabled?'none':'';
 el('editSmoke').textContent=enabled?'Concluir edição':'Editar silhueta na prévia';
 if(enabled){
  if(playing)el('play').onclick();
  el('frame').value=8;
  if(pickingWind)el('windPick').onclick();
 }
 preview();
}
el('editSmoke').onclick=()=>setSmokeEditor(!editingSmoke);
el('resetSmoke').onclick=()=>{
 for(const zone of smokeZones)for(const axis of ['X','Y'])el('offset'+zone+axis).value=0;
 preview();
};
function canvasPoint(e){
 const box=stage.getBoundingClientRect(),side=Math.min(box.width,box.height);
 return new DOMPoint((e.clientX-box.left-(box.width-side)/2)*512/side,(e.clientY-box.top-(box.height-side)/2)*512/side);
}
stage.addEventListener('pointerdown',e=>{
 if(!smokeEditorActive())return;
 const p=canvasPoint(e);
 const handle=smokeHandles.find(h=>Math.hypot(h.x-p.x,h.y-p.y)<20);
 if(!handle)return;
 e.preventDefault();e.stopImmediatePropagation();stage.setPointerCapture(e.pointerId);
 heldHandle={handle,p,x:+el('offset'+handle.zone+'X').value,y:+el('offset'+handle.zone+'Y').value};
},true);
stage.onpointermove=e=>{
 if(!heldHandle||!smokeEditorActive())return;
 const {handle,p,x,y}=heldHandle,now=canvasPoint(e),inv=handle.matrix.inverse();
 const dx=now.x-p.x,dy=now.y-p.y;
 el('offset'+handle.zone+'X').value=Math.round(Math.max(-220,Math.min(220,x+(inv.a*dx+inv.c*dy)/handle.weight)));
 el('offset'+handle.zone+'Y').value=Math.round(Math.max(-220,Math.min(220,y+(inv.b*dx+inv.d*dy)/handle.weight)));
 preview();
};
stage.onlostpointercapture=stage.onpointercancel=stage.onpointerup=()=>{heldHandle=null};
function paintSmokeHandles(ctx){
 for(const h of smokeHandles){
  ctx.save();ctx.fillStyle='#ffad40';ctx.strokeStyle='#16161c';ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(h.x,h.y,7,0,2*Math.PI);ctx.fill();ctx.stroke();
  ctx.font='bold 13px sans-serif';ctx.strokeText(h.zone,h.x+10,h.y+4);ctx.fillText(h.zone,h.x+10,h.y+4);ctx.restore();
 }
}
