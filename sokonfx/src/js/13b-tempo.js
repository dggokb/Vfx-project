// Curva de tempo (o "Curve Editor" e os keyframes de ritmo da bíblia): o quadro i que se vê vem do
// quadro tempoMapa(i) do efeito. "Normal" não muda nada. As curvas prontas e a livre (Bézier com
// dois pontos arrastáveis) remapeiam o tempo; "Segurar o contato" para no quadro do contato e depois
// corre o resto no tempo que sobra.

// Bézier de (0,0) a (1,1) com pontos (x1,y1) e (x2,y2): o y para um x (busca binária no parâmetro).
function tempoBezier(x1,y1,x2,y2,x){
 const b=(a,c,t)=>3*a*(1-t)*(1-t)*t+3*c*(1-t)*t*t+t*t*t;
 let lo=0,hi=1;for(let k=0;k<30;k++){const m=(lo+hi)/2;if(b(x1,x2,m)<x)lo=m;else hi=m}
 return b(y1,y2,(lo+hi)/2);
}
function tempoCurvaAtual(){
 const c=el('tempoCurva').value,n=id=>+el(id).value/100;
 if(c==='rapido')return [.1,.75,.35,1];
 if(c==='lento')return [.6,0,.9,.3];
 if(c==='livre')return [n('tempoX1'),n('tempoY1'),n('tempoX2'),n('tempoY2')];
 return null;
}
function tempoMapa(i,total){
 const c=el('tempoCurva').value;
 if(c==='linear'||total<2)return i;
 if(c==='contato'){
  const k=Math.min(total-1,+el('tempoContato').value),h=Math.min(+el('tempoSegura').value,total-1-k);
  if(i<=k)return i;if(i<=k+h)return k;
  const resto=total-1-k-h;return resto>0?Math.round(k+(i-k-h)*(total-1-k)/resto):total-1;
 }
 const [x1,y1,x2,y2]=tempoCurvaAtual();
 return Math.max(0,Math.min(total-1,Math.round(tempoBezier(x1,y1,x2,y2,i/(total-1))*(total-1))));
}

// O gráfico: a curva, os pontos (arrastáveis na livre) e os quadros como degraus.
function tempoDesenharGrafico(){
 const c=el('tempoGrafico'),x=c.getContext('2d'),W=c.width,M=18,L=W-2*M,total=quadrosTotais();
 x.clearRect(0,0,W,W);x.strokeStyle='#3a3940';x.lineWidth=1;x.strokeRect(M,M,L,L);
 const px=v=>M+v*L,py=v=>M+(1-v)*L;
 x.strokeStyle='#ffac48';x.lineWidth=2;x.beginPath();
 for(let i=0;i<total;i++){const j=tempoMapa(i,total)/(total-1||1),a=i/(total),b=(i+1)/total;i?x.lineTo(px(a),py(j)):x.moveTo(px(a),py(j));x.lineTo(px(b),py(j))}
 x.stroke();
 const curva=tempoCurvaAtual();
 if(el('tempoCurva').value==='livre'&&curva){
  const [x1,y1,x2,y2]=curva;x.strokeStyle='#7fe0ff';x.lineWidth=1;
  x.beginPath();x.moveTo(px(0),py(0));x.lineTo(px(x1),py(y1));x.moveTo(px(1),py(1));x.lineTo(px(x2),py(y2));x.stroke();
  for(const [a,b] of [[x1,y1],[x2,y2]]){x.fillStyle='#7fe0ff';x.beginPath();x.arc(px(a),py(b),7,0,Math.PI*2);x.fill()}
 }
 for(const [id,txt] of [['tempoContato',''],['tempoSegura',' quadros']])el(id+'Valor').value=el(id).value+txt;
 for(const l of [el('tempoContato').closest('label'),el('tempoSegura').closest('label')])l.hidden=el('tempoCurva').value!=='contato';
}
let tempoSegurado=null;
el('tempoGrafico').addEventListener('pointerdown',e=>{
 if(el('tempoCurva').value!=='livre')return;
 const c=el('tempoGrafico'),r=c.getBoundingClientRect(),M=18,L=c.width-2*M;
 const v=[(e.clientX-r.left)*c.width/r.width,(e.clientY-r.top)*c.height/r.height].map((z,k)=>k?1-(z-M)/L:(z-M)/L);
 const pts=[['tempoX1','tempoY1'],['tempoX2','tempoY2']].map(([a,b])=>[a,b,+el(a).value/100,+el(b).value/100]);
 const perto=pts.map(([a,b,x,y])=>[a,b,Math.hypot(x-v[0],y-v[1])]).sort((p,q)=>p[2]-q[2])[0];
 tempoSegurado=[perto[0],perto[1]];c.setPointerCapture(e.pointerId);e.preventDefault();
});
el('tempoGrafico').addEventListener('pointermove',e=>{
 if(!tempoSegurado)return;
 const c=el('tempoGrafico'),r=c.getBoundingClientRect(),M=18,L=c.width-2*M;
 const x=Math.max(0,Math.min(1,((e.clientX-r.left)*c.width/r.width-M)/L)),y=Math.max(-.5,Math.min(1.5,1-((e.clientY-r.top)*c.height/r.height-M)/L));
 el(tempoSegurado[0]).value=Math.round(x*100);el(tempoSegurado[1]).value=Math.round(y*100);tempoMudou();
});
el('tempoGrafico').addEventListener('pointerup',()=>{tempoSegurado=null});
function tempoMudou(){tempoDesenharGrafico();try{previa.sujo=true}catch{}preview()}
for(const id of ['tempoCurva','tempoContato','tempoSegura'])el(id).addEventListener('input',tempoMudou);
el('tempo').addEventListener('toggle',tempoDesenharGrafico);
