// Confere a "Prévia no jogo": o tempo do motor, o quadro em cada idade, a leitura de .zip (o do
// Sōkon FX e um com deflate, como o do celular), o efeito aparecendo só depois do golpe e sumindo
// no fim, a comparação lado a lado e as marcações por toque.
//   node sokonfx/testes/previa.test.cjs
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),os=require('os'),zlib=require('zlib');

const raiz=path.join(__dirname,'..');
let falhas=0;
const ok=(cond,msg)=>{if(!cond){falhas++;console.log('FALHOU',msg)}};
const perto=(a,b,tol=0.01)=>Math.abs(a-b)<=tol;

// Um .zip com deflate (o que o celular faz), montado aqui.
function zipDeflate(arquivos){
 const partes=[],centrais=[];let pos=0;
 for(const [nome,dados] of Object.entries(arquivos)){
  const n=Buffer.from(nome),comp=zlib.deflateRawSync(dados),crc=zlib.crc32(dados);
  const cab=Buffer.alloc(30);cab.writeUInt32LE(0x04034b50,0);cab.writeUInt16LE(20,4);cab.writeUInt16LE(8,8);
  cab.writeUInt32LE(crc,14);cab.writeUInt32LE(comp.length,18);cab.writeUInt32LE(dados.length,22);cab.writeUInt16LE(n.length,26);
  const cen=Buffer.alloc(46);cen.writeUInt32LE(0x02014b50,0);cen.writeUInt16LE(20,4);cen.writeUInt16LE(20,6);cen.writeUInt16LE(8,10);
  cen.writeUInt32LE(crc,16);cen.writeUInt32LE(comp.length,20);cen.writeUInt32LE(dados.length,24);cen.writeUInt16LE(n.length,28);cen.writeUInt32LE(pos,42);
  partes.push(cab,n,comp);centrais.push(cen,n);pos+=30+n.length+comp.length;
 }
 const central=Buffer.concat(centrais),fim=Buffer.alloc(22);
 fim.writeUInt32LE(0x06054b50,0);fim.writeUInt16LE(Object.keys(arquivos).length,8);fim.writeUInt16LE(Object.keys(arquivos).length,10);
 fim.writeUInt32LE(central.length,12);fim.writeUInt32LE(pos,16);
 return Buffer.concat([...partes,central,fim]);
}

(async()=>{
 const {montar}=await import(path.join(raiz,'build.mjs'));
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'sokonfx-previa-'));
 const html=path.join(tmp,'SokonFX.html');fs.writeFileSync(html,montar());
 const b=await chromium.launch();
 const p=await b.newPage({viewport:{width:1280,height:800}});
 const erros=[];p.on('pageerror',e=>erros.push(e.message));
 await p.goto('file://'+html);
 await p.evaluate(()=>{localStorage.clear();if(playing)el('play').onclick()});

 // Tempo do motor: (max(6, pausa) + 8) quadros a 60 Hz, vezes 0,7 nos impacto_v0*.
 const t=await p.evaluate(()=>({
  L:previaTempo(8,true,672),M:previaTempo(11,true,672),H:previaTempo(16,true,672),
  semRitmo:previaTempo(16,false,672),curta:previaTempo(2,false,100),
  q:[previaQuadroEm([42,42],0),previaQuadroEm([42,42],41.9),previaQuadroEm([42,42],42),previaQuadroEm([42,42],84)],
  idade:[previaIdade(5,10,1),previaIdade(10,10,2),previaIdade(13,10,2)],
 }));
 ok(perto(t.L.alvoMs,186.67)&&perto(t.M.alvoMs,221.67)&&perto(t.H.alvoMs,280),'durações L/M/H '+JSON.stringify([t.L.alvoMs,t.M.alvoMs,t.H.alvoMs]));
 ok(perto(t.H.ritmo,2.4),'ritmo do H com 672 ms de folha '+t.H.ritmo);
 ok(perto(t.semRitmo.alvoMs,400),'sem o ritmo de 70% '+t.semRitmo.alvoMs);
 ok(perto(t.curta.alvoMs,233.33),'pausa mínima de 6 quadros '+t.curta.alvoMs);
 ok(JSON.stringify(t.q)==='[0,0,1,-1]','quadro por idade '+JSON.stringify(t.q));
 ok(t.idade[0]===-1&&t.idade[1]===0&&perto(t.idade[2],100),'idade a 60 Hz '+JSON.stringify(t.idade));

 // Zip: o do próprio Sōkon FX (sem compressão) e um com deflate.
 const json=JSON.stringify({nome:'x',pixelScale:1.5,quadros:[[0,0,2,2,-1,-1]],duracoesMs:[42]});
 const png=Buffer.from(await p.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=2;const x=c.getContext('2d');x.fillStyle='#fc0';x.fillRect(0,0,2,2);return c.toDataURL('image/png').split(',')[1]}),'base64');
 const deflate=zipDeflate({'pasta/efeito.json':Buffer.from(json),'pasta/folha.webp':png});
 const z=await p.evaluate(async({json,png,deflate})=>{
  const bytes=b=>Uint8Array.from(atob(b),c=>c.charCodeAt(0));
  const proprio=jogoZip([{nome:'meu/folha.webp',dados:bytes(png)},{nome:'meu/efeito.json',dados:new TextEncoder().encode(json)}]);
  const a=await previaCarregarEfeito([new File([proprio],'meu.zip')]);
  const d=await previaCarregarEfeito([new File([bytes(deflate)],'celular.zip')]);
  const soltos=await previaCarregarEfeito([new File([bytes(png)],'folha.webp'),new File([json],'efeito.json')]);
  let erro='';try{await previaCarregarEfeito([new File([json],'efeito.json')])}catch(e){erro=e.message}
  return {a:[a.nome,a.folha.width,a.dados.quadros.length],d:[d.nome,d.folha.width],s:[soltos.nome,soltos.folha.height],erro};
 },{json,png:png.toString('base64'),deflate:deflate.toString('base64')});
 ok(JSON.stringify(z.a)==='["meu",2,1]','zip do Sōkon FX '+JSON.stringify(z.a));
 ok(JSON.stringify(z.d)==='["pasta",2]','zip com deflate '+JSON.stringify(z.d));
 ok(JSON.stringify(z.s)==='["x",2]','folha e efeito.json soltos '+JSON.stringify(z.s));
 ok(/folha e o efeito\.json/.test(z.erro),'falta a folha: '+z.erro);

 // No palco: nada antes do golpe, efeito depois, nada no fim do ciclo.
 await p.evaluate(()=>{el('kind').value='Impacto';el('kind').oninput({})});
 await p.click('#gamePreview summary');
 await p.evaluate(()=>{previa.parado=true});
 const pixels=ms=>p.evaluate(ms=>{previaDesenhar(ms);const d=palco.getContext('2d').getImageData(0,0,palco.width,palco.height).data;
  const x=+el('previaX').value,y=+el('previaY').value;let n=0;
  // Pixels claros e quentes perto do golpe (o fundo escuro e as silhuetas são cinza).
  for(let j=Math.max(0,y-120);j<Math.min(palco.height,y+120);j++)for(let i=Math.max(0,x-120);i<Math.min(palco.width,x+120);i++){
   const k=(j*palco.width+i)*4;if(d[k]>150&&d[k]-d[k+2]>40)n++}
  return n},ms);
 const antes=await pixels(200),durante=await pixels(420),depois=await pixels(1000);
 ok(antes===0,'sem efeito antes do golpe '+antes);
 ok(durante>200,'efeito no golpe '+durante);
 ok(depois===0,'efeito já sumiu depois de 280 ms '+depois);
 ok(await p.$eval('#stage',e=>e.hidden)&&!(await p.$eval('#palco',e=>e.hidden)),'palco no lugar da prévia quadrada');

 // Marcar o golpe e a altura por toque, e comparar lado a lado.
 const box=await p.$eval('#palco',e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,W:e.width,H:e.height}});
 const clica=(x,y)=>p.mouse.click(box.x+x*box.w/box.W,box.y+y*box.h/box.H);
 await p.click('#previaMarcarGolpe');await clica(450,250);
 ok(await p.$eval('#previaX',e=>e.value)==='450'&&await p.$eval('#previaY',e=>e.value)==='250','ponto do golpe por toque');
 await p.setInputFiles('#previaCena',{name:'print.png',mimeType:'image/png',buffer:Buffer.from(await p.evaluate(async()=>{const c=document.createElement('canvas');c.width=800;c.height=450;c.getContext('2d').fillRect(0,0,800,450);return c.toDataURL('image/png').split(',')[1]}),'base64')});
 await p.waitForTimeout(300);
 ok(await p.$eval('#previaFundo',e=>e.value)==='cena'&&!(await p.$eval('#previaMedidaLinha',e=>e.hidden)),'print carregado');
 await p.evaluate(()=>previaDesenhar(0));
 const box2=await p.$eval('#palco',e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,W:e.width,H:e.height}});
 ok(box2.W===800&&box2.H===450,'palco do tamanho do print '+box2.W+'x'+box2.H);
 await p.click('#previaMarcarAltura');
 await p.mouse.click(box2.x+300*box2.w/box2.W,box2.y+100*box2.h/box2.H);
 await p.mouse.click(box2.x+300*box2.w/box2.W,box2.y+400*box2.h/box2.H);
 ok(Math.abs(+(await p.$eval('#previaMedida',e=>e.value))-300)<=2,'altura medida por toque '+await p.$eval('#previaMedida',e=>e.value));
 const zipPath=path.join(tmp,'comparar.zip');
 fs.writeFileSync(zipPath,zipDeflate({'impacto_teste/efeito.json':Buffer.from(json),'impacto_teste/folha.webp':png}));
 await p.setInputFiles('#previaComparar',zipPath);await p.waitForTimeout(300);
 await p.evaluate(()=>previaDesenhar(420));
 ok(await p.$eval('#palco',e=>e.width)===405*2+8,'lado a lado: duas janelas '+await p.$eval('#palco',e=>e.width));
 ok(/impacto_teste/.test(await p.$eval('#previaStatus',e=>e.value)),'status da comparação');
 await p.click('#previaCompararTirar');await p.evaluate(()=>previaDesenhar(420));
 ok(await p.$eval('#palco',e=>e.width)===800,'parar de comparar');
 // Fechar o painel volta a prévia quadrada.
 await p.click('#gamePreview summary');
 await p.waitForTimeout(100);
 ok(!(await p.$eval('#stage',e=>e.hidden))&&await p.$eval('#palco',e=>e.hidden),'fechar volta a prévia quadrada');
 ok(erros.length===0,'erros na página '+erros);
 await b.close();fs.rmSync(tmp,{recursive:true});
 console.log(falhas?`${falhas} falhas`:'prévia no jogo: tudo certo');
 process.exit(falhas?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
