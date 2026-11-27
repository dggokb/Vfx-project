// Sōkon Lab — experimental editable presets, all units in composition pixels / seconds.
(function(){
'use strict';
const A=window.AFX,M=A.Model,C=A.Curve,G=A.Grad;
const tr=(pairs)=>({keys:pairs.map(([t,v])=>A.Track.newKey(t,v))});
const shape=(id,p={})=>({kind:'shape',id,p});
const preset=(id,d)=>M.layerPresets.find(x=>x.id===id).make(d);
function doc(id,name,dur,frames){
  const d=M.newDoc();d.id='sokon:'+id;d.name=name;d.comp.dur=dur;
  Object.assign(d.exp,{cols:4,rows:Math.ceil(frames/4),frames,cellW:384,cellH:384,mode:'rgba',ss:1});
  return d;
}
function arc(d,i,hard){
  const l=M.newSprite(d,'Arco de pressão '+(i+1)), delay=i*(hard?.032:.027);
  l.start=delay;l.end=d.comp.dur;l.blend='normal';
  Object.assign(l.sp,{sprite:shape('sokonArc',{spread:hard?1.57:1.15,th:hard?.12:.075,jag:hard?.13:.025,var:i}),size:hard?240:150,
    x:tr([[0,-26],[.1,5],[d.comp.dur-delay,hard?67:30]]),aspect:hard?.82:.66,rot:i%2?5:-5,glow:0,
    scale:tr([[0,.36],[.08,.9],[d.comp.dur-delay,hard?1.65:1.22]])});
  l.opacity=tr([[0,0],[.018,i===0?.93:.54],[.12,i===0?.65:.32],[d.comp.dur-delay,0]]);
  return l;
}
function air(hard){
  const d=doc(hard?'guard_break':'guard',hard?'SŌKON — Guard Break / pressão de ar':'SŌKON — Guard / pressão de ar',hard?.40:.25,hard?12:8);
  d.layers=Array.from({length:hard?4:2},(_,i)=>arc(d,i,hard));
  const p=M.newEmitter(d,'Filamentos de ar');p.end=.06;p.blend='normal';
  Object.assign(p.em,{dir:'dir',angle:0,spread:hard?110:65,speed:hard?440:240,speedRnd:.45,bursts:[{t:0,n:hard?20:7}],seed:817});
  Object.assign(p.pt,{sprite:shape('sokonArc',{spread:.55,th:.055,jag:.09}),life:hard?.23:.15,lifeRnd:.2,size:hard?36:23,sizeRnd:.55,alignVel:true,spin:0,drag:2,grad:G.presets.white.make(),sizeOL:C.presets.shrink.make(),opacityOL:C.presets.fadeOut.make(),glow:0});
  d.layers.unshift(p);return d;
}
function hit(){
 const d=doc('heavy_hit','SŌKON — Heavy Hit Spark',.30,12);
 for(const [name,size,color,rot] of [['Núcleo',150,[255,255,240],9],['Pontas quentes',270,[255,151,42],-12],['Pontas externas',320,[255,71,20],4]]){
   const l=M.newSprite(d,name);l.end=.20;l.blend='add';l.opacity=tr([[0,.1],[.022,1],[.07,.9],[.20,0]]);
   Object.assign(l.sp,{sprite:shape('sokonBurst',{n:16,inr:.13,var:Math.round(size/10)%4}),size,rot,color,glow:0,scale:tr([[0,.32],[.045,1],[.20,.83]])});d.layers.push(l);
 }
 const s=preset('sparks',d);s.end=.055;Object.assign(s.em,{seed:907,speed:510,bursts:[{t:0,n:23}]});Object.assign(s.pt,{life:.20,lifeRnd:.25,gravY:60,glow:.1});d.layers.unshift(s);return d;
}
function dust(ground){
 const d=doc(ground?'ground_dust':'dash_smoke',ground?'SŌKON — Ground Impact Dust':'SŌKON — Dash Smoke',ground?.98:.88,16);
 const make=(name,offset,color,n,size)=>{const p=M.newEmitter(d,name);p.end=.12;p.blend='normal';
 Object.assign(p.em,{x:offset,y:108,shape:'box',sx:ground?48:24,sy:12,dir:'dir',angle:ground?-90:205,spread:ground?138:40,speed:ground?275:185,speedRnd:.52,seed:100+offset+size,bursts:[{t:0,n}]});
 Object.assign(p.pt,{sprite:shape('sokonPuff'),life:ground?.57:.48,lifeRnd:.18,size,sizeRnd:.42,gravY:-35,drag:3.1,spin:40,spinRnd:.5,turbMode:'curl',turbAmp:80,turbScale:65,turbRise:20,turbWind:ground?0:-45,turbRamp:.7,grad:G.make([[0,color],[.70,color],[1,'#b9a28c']]),sizeOL:C.make([[0,.28],[.32,1],[.68,.84],[1,.08]]),opacityOL:C.make([[0,1],[.72,.96],[1,0]]),glow:0});
 const sub=p.em.sub;Object.assign(sub,{on:true,emit:'life',rate:8,startAt:.5,dir:'inherit',speed:60,inherit:.25,budget:160});
 Object.assign(sub.pt,{sprite:shape('sokonPuff'),life:.16,lifeRnd:.2,size:size*.18,sizeRnd:.4,grad:G.make([[0,color],[1,'#b9a28c']]),opacityOL:C.presets.fadeOut.make(),sizeOL:C.presets.shrink.make(),glow:0});return p;};
 d.layers=[make('Luz da poeira',0,'#ead6b5',ground?16:11,64),make('Massa da poeira',-8,'#a58c73',ground?20:13,78)];
 if(ground){const s=preset('debris',d);s.end=.08;Object.assign(s.em,{y:108,dir:'dir',angle:-90,spread:145,speed:310,seed:452,bursts:[{t:0,n:14}]});Object.assign(s.pt,{life:.38,lifeRnd:.15,size:19,gravY:720,glow:0});d.layers.unshift(s);}
 return d;
}
const defs=[['guard','Guard — pressão de ar',()=>air(false)],['guard_break','Guard Break — pressão de ar',()=>air(true)],['heavy_hit','Heavy Hit Spark',hit],['dash_smoke','Dash Smoke',()=>dust(false)],['ground_dust','Ground Impact Dust',()=>dust(true)]];
A.SokonPresets=defs.map(([id,name,build])=>({id:'sokon_'+id,name:'SŌKON / '+name,thumbT:(id.includes('dust')||id==='dash_smoke') ? .18 : .065,build}));
A.Factory.push(...A.SokonPresets);
})();