function preview(){if(compondo)return;const ctx=stage.getContext('2d');ctx.clearRect(0,0,512,512);smokeHandles=[];collectHandles=smokeEditorActive();if(el('onion').getAttribute('aria-pressed')==='true')onionDesenhar(ctx,+el('frame').value);desenharQuadro(ctx,+el('frame').value);collectHandles=false;windGuide(ctx);jogoGuia(ctx);if(!playing && el('kind').value==='Fumaça' && el('smokeForm').value==='jump' && +el('dissolveX').value>=0){
 ctx.save();ctx.beginPath();for(const p of smokeOrigins()){ctx.moveTo(p.x+6,p.y);ctx.arc(p.x,p.y,6,0,2*Math.PI)}ctx.strokeStyle='#17161c';ctx.lineWidth=4;ctx.stroke();ctx.strokeStyle='#ffb14b';ctx.lineWidth=2;ctx.stroke();ctx.restore();
 }if(smokeEditorActive())paintSmokeHandles(ctx);el('counter').value=(+el('frame').value+1)+'/'+quadrosTotais()}
function tick(now){if(playing&&!compondo){const n=quadrosTotais();el('frame').value=Math.min(n-1,Math.floor((now-start)*+el('fps').value/1000)%(n+3));preview()}requestAnimationFrame(tick)}
el('generate').onclick=()=>{seed=crypto.getRandomValues(new Uint32Array(1))[0];el('frame').value=0;start=performance.now();preview()};
el('play').onclick=()=>{playing=!playing;el('play').textContent=playing?'Pausar':'Reproduzir';start=performance.now()-el('frame').value*1000/el('fps').value};
let customParticleTint=el('particleTint').value;
el('particleTint').oninput=()=>{
 customParticleTint=el('particleTint').value;
 el('linkTint').checked=false;
 preview();
};
el('linkTint').onchange=()=>{
 el('particleTint').value=el('linkTint').checked?el('tint').value:customParticleTint;
 preview();
};
let haloEnabled=true;
el('halo').onclick=()=>{
 haloEnabled=!haloEnabled;
 el('halo').setAttribute('aria-pressed',String(haloEnabled));
 el('halo').textContent='Halo de fundo · '+(haloEnabled?'ligado':'desligado');
 preview();
};
function showOpening(){
 for(const label of document.querySelectorAll('.opening-setting')){
  label.hidden=el('kind').value==='Fumaça'||el('motion').value!=='out';
 }
}
el('motion').oninput=()=>{showOpening();preview()};
el('pieces').oninput=()=>{el('pieceValue').value=el('pieces').value;preview()};
el('artStyle').oninput=preview;
el('material').oninput=()=>{
 el('tint').value=elementsPalette[el('material').value][0];el('tint').oninput();
};
el('drawing').oninput=preview;
el('openingShape').oninput=preview;
el('openingFrame').oninput=()=>{
 el('openingValue').value=el('openingFrame').value;
 preview();
};
el('frame').oninput=()=>{playing=false;el('play').textContent='Reproduzir';preview()};
for(const key of ['rimWidth','coreWidth','diameter','focus','riskWidth','outerWidth','particleWidth','shapes']){
 el(key).oninput=()=>{
  profiles[el('kind').value][key]=+el(key).value;
  el(key+'Value').value=el(key).value+(key==='shapes'?'':'%');
  preview();
 };
}
const widths=['rimWidth','coreWidth','diameter','focus','particleWidth','shapes'];
for(const kind of Object.keys(profiles))if(kind!=='Impacto')Object.assign(profiles[kind],{rimWidth:100,coreWidth:100,diameter:100,focus:0,particleWidth:100,shapes:1});
const appearances={};
function recordAppearance(){
 return {drawing:el('drawing').value,motion:el('motion').value,openingFrame:el('openingFrame').value,pieces:el('pieces').value,openingShape:el('openingShape').value,particleTint:el('particleTint').value,linked:el('linkTint').checked,halo:haloEnabled,custom:customParticleTint};
}
const defaultAppearance=recordAppearance();
let activeKind=el('kind').value;
el('kind').oninput=(event)=>{
 const next=el('kind').value;
 geradoresAntes();
 if(event && activeKind!==next){
  appearances[activeKind]=recordAppearance();
  const settings=appearances[next]||defaultAppearance;
  for(const id of ['drawing','motion','openingFrame','pieces','openingShape','particleTint'])el(id).value=settings[id];
  el('openingValue').value=settings.openingFrame;el('pieceValue').value=settings.pieces;
  customParticleTint=settings.custom;el('linkTint').checked=settings.linked;
  if(haloEnabled!==settings.halo)el('halo').onclick();
  profiles[activeKind].tint=el('tint').value;
  el('tint').value=profiles[next].tint||'#ff781a';
  if(el('linkTint').checked)el('particleTint').value=el('tint').value;
 }
 for(const label of document.querySelectorAll('.smoke-setting'))label.hidden=next!=='Fumaça';
 const isAir=next==='Pressão de ar';
 for(const label of document.querySelectorAll('.air-setting'))label.hidden=!isAir;
 const isLight=next==='Ponto de luz';
 for(const label of document.querySelectorAll('.light-setting'))label.hidden=!isLight;
 el('styleMix').closest('label').hidden=isLight||isAir;
 refreshSmoke();
 refreshRef();
 activeKind=next;
 showOpening();
 for(const label of document.querySelectorAll('.impact-setting'))label.hidden=next!=='Impacto' && !!label.querySelector('#riskWidth,#outerWidth,#material,#artStyle');
 if(isLight||isAir){for(const label of document.querySelectorAll('.impact-setting,.opening-setting'))label.hidden=!label.querySelector('#drawing,#diameter')}
 if(next==='Fumaça'||isLight||isAir)el('motion').closest('label').hidden=true;
 for(const [i,name] of drawings[next].entries())el('drawing').options[i].textContent=name;
 for(const key of widths){el(key).value=profiles[next][key];el(key+'Value').value=profiles[next][key]+(key==='shapes'?'':'%')}
 const profile=profiles[el('kind').value];
 for(const id of ['particles','light','styleMix'])el(id).value=profile[id];
 geradoresMostrar(next);
 preview();
};
for(const id of ['particles','light','styleMix'])el(id).oninput=()=>{
 profiles[el('kind').value][id]=+el(id).value;preview();
};
for(const id of ['power','angle'])el(id).oninput=preview;
el('tint').oninput=()=>{
 if(el('linkTint').checked)el('particleTint').value=el('tint').value;
 preview();
};
el('save').onclick=()=>{const sheet=document.createElement('canvas');sheet.width=sheet.height=2048;const ctx=sheet.getContext('2d');
 for(let i=0;i<frames;i++){ctx.save();ctx.translate((i%4)*512,Math.floor(i/4)*512);draw(ctx,i);ctx.restore()}
 sheet.toBlob(blob=>{const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=el('kind').value+'-cel'+profiles[el('kind').value].styleMix+'-'+seed+'-4x4-'+el('fps').value+'fps.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000)})};
