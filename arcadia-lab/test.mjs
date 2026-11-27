import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {execFileSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
execFileSync(process.execPath,[path.join(root,'build.mjs')],{stdio:'inherit'});
execFileSync(process.execPath,[path.join(root,'validate-presets.mjs')],{stdio:'inherit'});
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.join(root,'dist/SokonArcadia.html')).href);
 await page.waitForFunction(()=>window.AFX?.state?.doc&&window.AFX?.SokonLab);
 const reports=await page.evaluate(async()=>{
 const A=window.AFX,out=[];
 for(const p of A.SokonPresets){
  const doc=p.build(), e=new A.Engine(), c=document.createElement('canvas');c.width=doc.comp.w;c.height=doc.comp.h;
  const ctx=c.getContext('2d',{willReadFrequently:true});let visible=0,last=0;
  for(const t of [0.03,0.07,0.13,doc.comp.dur]){
   e.render(doc,t,ctx);const bytes=ctx.getImageData(0,0,c.width,c.height).data;let count=0;for(let i=3;i<bytes.length;i+=4)if(bytes[i]>10)count++;
   if(t===doc.comp.dur)last=count;else visible=Math.max(visible,count);
  }
  const a=A.Atlas.build(doc);const z=await A.SokonLab.gameExport(doc,p.id);
  out.push({id:p.id,visible,last,frames:a.info.frames,exportFrames:z.data.quadros.length,zip:z.zip.size,finite:z.data.quadros.flat().every(Number.isFinite),width:a.canvas.width});
 }
 return out;
 });
 for(const r of reports){console.log(r);assert(r.visible>20,r.id+' empty');assert(r.last===0,r.id+' final cutoff');assert(r.frames===r.exportFrames);assert(r.zip>100);assert(r.finite);assert(r.width>0);}
 await page.locator('#sokon-load').click();await page.locator('#sokon-preview').click();await page.locator('#sokon-close').click();
 assert.deepEqual(errors,[]);
 console.log('Arcadia Lab: five presets, transparent end, atlas and game export verified');
}finally{await browser.close();}
