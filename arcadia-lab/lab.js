(function(){
'use strict';
const A=window.AFX;
function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),30000);}
async function gameExport(doc,name,origin=[doc.comp.w/2,doc.comp.h/2],size=1){
 if(!jogoNomeValido(name))throw Error('Nome inválido: use minúsculas, números e _');
 if(!Number.isFinite(size)||size<=0||!origin.every(Number.isFinite))throw Error('Origem/escala inválida');
 const ft=A.Atlas.frameTimes(doc), n=ft.times.length;
 if(n<1||n>64||doc.comp.w>1024||doc.comp.h>1024)throw Error('Limite do laboratório: 64 quadros, 1024 px');
 const eng=new A.Engine(), c=canvas(doc.comp.w,doc.comp.h), ctx=c.getContext('2d',{willReadFrequently:true});
 const boxes=[], sizes=[], crops=[];
 for(const t of ft.times){
  eng.render(doc,t,ctx);
  const b=jogoCaixa(ctx.getImageData(0,0,c.width,c.height).data,c.width,c.height);
  boxes.push(b);
  if(!b){sizes.push([1,1]);crops.push(null);continue;}
  const [x,y,x1,y1]=b,w=x1-x,h=y1-y, crop=canvas(w,h);
  crop.getContext('2d').drawImage(c,x,y,w,h,0,0,w,h);sizes.push([w,h]);crops.push(crop);
 }
 if(!boxes.some(Boolean))throw Error('Efeito sem pixels visíveis');
 const pack=jogoEmpacotar(sizes);
 if(pack.altura>JOGO_LADO_MAX||pack.largura>JOGO_LADO_MAX)throw Error('Folha excede 4096 px');
 const sheet=canvas(pack.largura,pack.altura), sctx=sheet.getContext('2d');
 crops.forEach((c,i)=>{if(c)sctx.drawImage(c,...pack.lugares[i]);});
 const data=jogoDados(boxes,pack.lugares,sizes,{nome:name,origemX:origin[0],origemY:origin[1],resolucao:1,tamanho:size,inicio:0,fps:ft.fps,segurar:-1,segurarMs:0,soma:0,luz:null,descricao:'Arcadia Lab: '+doc.name});
 // Respect non-uniform atlas cuts when available; avoid cumulative millisecond drift.
 if(Array.isArray(doc.exp.cuts)&&doc.exp.cuts.length===n-1){
  const boundaries=[0,...doc.exp.cuts,1];data.duracoesMs=boundaries.slice(1).map((v,i)=>Math.max(1,Math.round((v-boundaries[i])*(ft.t1-ft.t0)*1000)));
 }
 const webp=await new Promise(resolve=>sheet.toBlob(resolve,'image/webp',1));
 if(!webp||webp.type!=='image/webp')throw Error('WebP não suportado neste navegador');
 const json=new TextEncoder().encode(JSON.stringify(data,null,2)+'\n');
 const zip=jogoZip([{nome:name+'/folha.webp',dados:new Uint8Array(await webp.arrayBuffer())},{nome:name+'/efeito.json',dados:json}]);
 return {zip,data,sheet};
}
A.SokonLab={gameExport};
function mount(){
 if(!A.state||!A.state.doc){setTimeout(mount,100);return;}
 const tools=document.createElement('div');tools.id='sokon-lab-tools';
 tools.innerHTML='<strong>SŌKON FX LAB</strong><select id="sokon-preset" aria-label="Preset experimental"></select><button id="sokon-load">Abrir preset</button><button id="sokon-preview">Prévia no jogo</button><button id="sokon-export">Exportar para o jogo</button><span id="sokon-lab-status" role="status"></span>';
 document.getElementById('topbar').after(tools);
 const el=id=>document.getElementById(id), select=el('sokon-preset'), status=el('sokon-lab-status');
 for(const def of A.SokonPresets){const o=document.createElement('option');o.value=def.id;o.textContent=def.name;select.append(o);}
 el('sokon-load').onclick=()=>{const d=A.SokonPresets.find(p=>p.id===select.value).build();A.openDoc(d);};
 el('sokon-export').onclick=async()=>{const d=A.state.doc;const name=prompt('Nome da pasta do efeito','sokon_'+select.value.replace(/^sokon_/,''));if(!name)return;try{status.textContent='Exportando…';const out=await gameExport(d,name);download(out.zip,name+'.zip');status.textContent='Exportado: '+out.data.quadros.length+' quadros';}catch(e){status.textContent=e.message;}};
 const panel=document.createElement('section');panel.id='sokon-lab-preview';panel.hidden=true;
 panel.innerHTML='<div><button id="sokon-close">Fechar</button> <label>Print local do jogo <input type="file" id="sokon-background" accept="image/*"></label> <label>Escala <input type="range" id="sokon-scale" min="20" max="180" value="65"></label> <button id="sokon-replay">Repetir</button></div><p>Toque no ponto de contato. Imagens permanecem no aparelho. A prévia não altera o arquivo.</p><canvas id="sokon-stage" width="960" height="540"></canvas>';
 document.body.append(panel);
 const stage=el('sokon-stage'), ctx=stage.getContext('2d');let image=null,anchor=[480,270],start=0,raf=0,engine,fx,doc;
 function restart(){doc=A.state.doc;engine=new A.Engine();fx=canvas(doc.comp.w,doc.comp.h);start=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(draw);}
 function draw(now){if(panel.hidden)return;ctx.clearRect(0,0,stage.width,stage.height);ctx.fillStyle='#222a34';ctx.fillRect(0,0,stage.width,stage.height);if(image){const k=Math.min(stage.width/image.width,stage.height/image.height);ctx.drawImage(image,(stage.width-image.width*k)/2,(stage.height-image.height*k)/2,image.width*k,image.height*k);}
 const t=(now-start)/1000;if(t<doc.comp.dur){engine.render(doc,t,fx.getContext('2d'));const k=+el('sokon-scale').value/100;ctx.drawImage(fx,anchor[0]-fx.width*k/2,anchor[1]-fx.height*k/2,fx.width*k,fx.height*k);}ctx.strokeStyle='#ffffff77';ctx.beginPath();ctx.moveTo(anchor[0]-5,anchor[1]);ctx.lineTo(anchor[0]+5,anchor[1]);ctx.moveTo(anchor[0],anchor[1]-5);ctx.lineTo(anchor[0],anchor[1]+5);ctx.stroke();raf=requestAnimationFrame(draw);}
 el('sokon-preview').onclick=()=>{panel.hidden=false;restart();};
 el('sokon-close').onclick=()=>{panel.hidden=true;cancelAnimationFrame(raf);};
 el('sokon-replay').onclick=restart;el('sokon-scale').oninput=restart;
 stage.onclick=e=>{const r=stage.getBoundingClientRect();anchor=[(e.clientX-r.left)*stage.width/r.width,(e.clientY-r.top)*stage.height/r.height];restart();};
 el('sokon-background').onchange=e=>{const file=e.target.files[0];if(!file)return;const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{image=img;URL.revokeObjectURL(url);restart();};img.onerror=()=>{URL.revokeObjectURL(url);status.textContent='Imagem inválida';};img.src=url;};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();