const presetKey='sokonfx.presets.v1';
const smokeDefaults={shadeLight:'0',curl:'0',jumpRoll:"85",offsetTopoX:"0",offsetTopoY:"0",offsetDobraX:"0",offsetDobraY:"0",offsetBaseX:"0",offsetBaseY:"0",moreDissolve:"[]",dissolveX:"-1",dissolveY:"-1",jumpDirection:"out",jumpOpen:"8",jumpCurl:"100",jumpVolume:"100",airCopies:'10',airEdge:"round",airInterval:"auto",airParticleGap:"100",airRingGap:"100",airFlow:"out",airWidth:"8",airWaves:"3",smokeForm:"linear",ringRadius:"70",beams:'6',beamWidth:'16',focusX:'256',focusY:'256',tipGap:'48',joinAt:'100',windForce:'0',windWidth:'85',windAngle:'0',windX:'256',windY:'240',plumes:'2',gap:'48',rise:'100',fall:'0',smokeMirror:'off'};
function refreshSmoke(){
 const smoke=el('kind').value==='Fumaça';
 const grouped=smoke && el('smokeForm').value!=='ring' && Number(el('plumes').value)>1;
 for(const id of ['gap','tipGap','joinAt'])el(id).closest('label').hidden=!grouped;
 for(const label of document.querySelectorAll(".jump-setting"))label.hidden=el("kind").value!=="Fumaça"||el("smokeForm").value!=="jump";
 el('airCopiesControl').hidden=el('kind').value!=='Pressão de ar'||el('airEdge').value!=='spiked';
 el("ringControl").hidden=el("kind").value!=="Fumaça" || el("smokeForm").value!=="ring";
 for(const [id,unit] of Object.entries({shadeLight:'%',curl:'%',jumpRoll:'%',jumpVolume:"%",jumpCurl:"%",jumpOpen:"",airCopies:'',airParticleGap:'%',airRingGap:'%',airWaves:'',airWidth:' px',ringRadius:' px',tipGap:' px',joinAt:'%',windForce:'%',windAngle:'°',windWidth:' px',plumes:'',gap:' px',rise:'%',fall:'%'}))el(id+'Value').value=el(id).value+unit;
}
for(const id of Object.keys(smokeDefaults))el(id).oninput=()=>{refreshSmoke();preview()};
const savedFields=[...Object.keys(smokeDefaults),'kind','artStyle','material','drawing','styleMix','tint','power','particles','light','motion','openingFrame','pieces','openingShape','rimWidth','coreWidth','diameter','focus','riskWidth','outerWidth','particleTint','particleWidth','shapes','angle','fps',...geradorCampos];
let sessionTypes=[],sessionOnly=false;
function storedTypes(){
 if(sessionOnly)return sessionTypes;
 try{
  const data=JSON.parse(localStorage.getItem(presetKey)||'[]');
  if(Array.isArray(data))sessionTypes=data;
 }catch{}
 return sessionTypes;
}
function persistTypes(types){
 sessionTypes=types;
 try{localStorage.setItem(presetKey,JSON.stringify(types));sessionOnly=false}catch{sessionOnly=true}
}
function downloadTypes(types){
 const blob=new Blob([JSON.stringify({format:'sokonfx-types-v1',types},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download='SokonFX-tipos.json';link.click();
 setTimeout(()=>URL.revokeObjectURL(url),30000);
}
el('backup').onclick=()=>{
 const types=storedTypes();
 if(types.length)downloadTypes(types);
 else el('presetStatus').textContent='Nenhum tipo salvo nesta cópia.';
};
el('restore').onchange=async()=>{
 const file=el('restore').files[0];
 if(!file)return;
 try{
  const data=JSON.parse(await file.text());
  const incoming=Array.isArray(data)?data:data.types;
  if(!Array.isArray(incoming)||!incoming.every(p=>typeof p?.name==='string'&&p.name.trim()&&Object.hasOwn(profiles,p.values?.kind)&&Number.isInteger(p.seed)))throw Error();
  const merged=storedTypes().slice();
  for(const item of incoming){
   if(merged.some(p=>JSON.stringify(p)===JSON.stringify(item)))continue;
   let name=item.name,n=2;
   while(merged.some(p=>p.name===name))name=item.name+' ('+(n++)+')';
   merged.push({...item,name});
  }
  persistTypes(merged);showTypes(merged);
  el('presetStatus').textContent='Importação concluída. Escolha um tipo salvo.';
 }catch{el('presetStatus').textContent='Arquivo de tipos inválido.'}
 el('restore').value='';
};
function showTypes(types){
 const select=el('savedTypes');
 select.length=1;
 for(const type of types)select.add(new Option(type.name,type.name));
}
try{showTypes(storedTypes())}catch{el('presetStatus').textContent='Não foi possível acessar os tipos salvos neste navegador.'}
el('keep').onclick=()=>{
 const name=el('presetName').value.trim();
 if(!name){el('presetStatus').textContent='Digite um nome para salvar.';el('presetName').focus();return}
 try{
  const types=storedTypes();
  const index=types.findIndex(type=>type.name===name);
  if(index>=0 && !confirm('Substituir o tipo “'+name+'”?'))return;
  const values=Object.fromEntries(savedFields.map(id=>[id,el(id).value]));
  const ref=userRefs.get(values.kind);
  const preset={name,values,reference:ref?{name:ref.name,data:ref.data}:null,seed,haloEnabled,customParticleTint,linked:el('linkTint').checked,jogo:jogoLer(),...(composicaoLer()?{composicao:composicaoLer()}:{})};
  if(index>=0)types[index]=preset;else types.push(preset);
  persistTypes(types);downloadTypes(types);
  showTypes(types);
  el('savedTypes').value='';
  el('presetStatus').textContent='Tipo salvo. Guarde o JSON para importar na próxima versão.';
 }catch{el('presetStatus').textContent='Falha ao salvar. Verifique o armazenamento do navegador.'}
};
// Põe um tipo salvo na tela. Devolve a promessa da imagem de referência dele (se tiver).
// O compositor usa com {jogo:false}: as opções de export da tela não mudam ao desenhar uma camada.
function aplicarTipo(preset,{jogo=true}={}){
  for(const id of savedFields)el(id).value=preset.values[id]??(id==='airCopies'&&preset.values.drawing==='saw'?'4':undefined)??(id==='tipGap'?preset.values.gap:undefined)??smokeDefaults[id]??geradorPadroes[id]??(['rimWidth','coreWidth','diameter'].includes(id)?100:id==='focus'?0:id==='drawing'?'star':id==='artStyle'?'original':id==='material'?'Energia':el(id).value);
  if(preset.values.kind==='Fumaça' && preset.values.plumes===undefined){
   const wasDouble=preset.values.drawing==='twin';
   el('plumes').value=wasDouble?2:1;
   if(wasDouble)el('drawing').selectedIndex=0;
  }
  refreshSmoke();
  const profile=profiles[el('kind').value];
  for(const id of ['styleMix','particles','light'])profile[id]=+el(id).value;
  for(const id of ['rimWidth','coreWidth','diameter','focus','riskWidth','outerWidth','particleWidth','shapes']){
   profile[id]=+el(id).value;
   el(id+'Value').value=el(id).value+(id==='shapes'?'':'%');
  }
  seed=preset.seed;customParticleTint=preset.customParticleTint;
  el('linkTint').checked=preset.linked;
  if(haloEnabled!==preset.haloEnabled)el('halo').onclick();
  el('pieceValue').value=el('pieces').value;el('openingValue').value=el('openingFrame').value;
  el('presetName').value=preset.name;
  el('frame').value=0;start=performance.now();
  el('kind').oninput();
  const ref=loadRef(preset.values.kind,preset.reference?.data,preset.reference?.name);
  if(jogo&&preset.jogo)jogoAplicar(preset.jogo);
  try{acabamentosAtualizar()}catch{}
  // Os desenhos do Fazedor vêm como PNG e o editor do Arcadia abre num quadro à parte: quem monta
  // camadas ou exporta espera os dois ficarem prontos.
  return Promise.all([ref,typeof fazedorEsperar==='function'?fazedorEsperar():null,typeof arcadiaEsperar==='function'?arcadiaEsperar():null]);
}
el('savedTypes').onchange=()=>{
 try{
  const preset=storedTypes().find(type=>type.name===el('savedTypes').value);
  if(!preset)return;
  aplicarTipo(preset);
  if(preset.composicao)composicaoAplicar(preset.composicao);
  el('presetStatus').textContent='Tipo carregado: '+preset.name;
  el('savedTypes').value='';
 }catch{el('presetStatus').textContent='Não foi possível carregar este tipo.'}
};
