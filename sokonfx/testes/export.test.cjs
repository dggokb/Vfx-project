// Confere o "Exportar para o jogo": baixa o .zip pela página, como o dono faria, e verifica
//  - o zip (CRC e tamanhos) e a pasta <nome>/folha.webp + efeito.json;
//  - o efeito.json do jeito que o EfeitosVideo.ler do jogo lê (campos, tipos, luz válida);
//  - cada quadro da folha, decodificada, contra o mesmo quadro desenhado de novo e recortado.
//   node sokonfx/testes/export.test.cjs [pasta para guardar os zips]
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),os=require('os'),zlib=require('zlib');

const raiz=path.join(__dirname,'..');
let falhas=0;
const ok=(cond,msg)=>{if(!cond){falhas++;console.log('FALHOU',msg)}};

function lerZip(buf){
 const arquivos={};let p=0;
 while(buf.readUInt32LE(p)===0x04034b50){
  const metodo=buf.readUInt16LE(p+8),crc=buf.readUInt32LE(p+14),tam=buf.readUInt32LE(p+18),n=buf.readUInt16LE(p+26),extra=buf.readUInt16LE(p+28);
  const nome=buf.toString('utf8',p+30,p+30+n),dados=buf.subarray(p+30+n+extra,p+30+n+extra+tam);
  ok(metodo===0,'zip sem compressão');ok(zlib.crc32(dados)===crc,'CRC de '+nome);
  arquivos[nome]=dados;p+=30+n+extra+tam;
 }
 ok(buf.readUInt32LE(p)===0x02014b50,'diretório central do zip');
 return arquivos;
}

// O que o EfeitosVideo.ler do jogo exige (getJSONArray/getInt/getDouble e o lerLuz).
function conferirComoOJogo(d,largura,altura,nome){
 ok(Array.isArray(d.quadros)&&Array.isArray(d.duracoesMs)&&d.quadros.length>0,nome+': quadros e duracoesMs');
 ok(d.duracoesMs.length===d.quadros.length,nome+': uma duração por quadro');
 for(const q of d.quadros){
  ok(q.length===6&&q.slice(0,4).every(Number.isInteger)&&q.slice(4).every(Number.isFinite),nome+': quadro [x,y,l,a,dx,dy] '+q);
  ok(q[0]>=0&&q[1]>=0&&q[0]+q[2]<=largura&&q[1]+q[3]<=altura,nome+': quadro dentro da folha '+q);
 }
 ok(d.duracoesMs.every(ms=>ms>0),nome+': durações positivas');
 ok(d.pixelScale>0,nome+': pixelScale');
 ok(largura<=4096&&altura<=4096,nome+': folha até 4096 px');
 if(d.soma!==undefined)ok(d.soma>=0&&d.soma<=1,nome+': soma de 0 a 1');
 if(d.luz){
  ok(/^#[0-9A-Fa-f]{6}$/.test(d.luz.cor),nome+': luz.cor #RRGGBB');
  ok(d.luz.alcance>0,nome+': luz.alcance > 0');ok(d.luz.forca>=0&&d.luz.forca<=1,nome+': luz.forca de 0 a 1');
 }
}

const casos=[
 {nome:'impacto_h',tipo:'dono.json',opcoes:{jogoBrilho:'100',jogoLuz:true,jogoLuzCor:'#f5c83e',jogoLuzAlcance:'90',jogoLuzForca:'75'}},
 {nome:'fumaca_pulo_teste',tipo:'jogo_fumacas_s4.json:fumaca_pulo_s4',opcoes:{jogoOrigemX:'256',jogoOrigemY:'330',jogoResolucao:'50',jogoTamanho:'130',jogoInicio:'2',jogoFim:'15',jogoSegurar:'5',jogoSegurarMs:'200'}},
 {nome:'ar_soma',kind:'Pressão de ar',opcoes:{jogoSoma:'100',jogoTamanho:'50'}},
];

(async()=>{
 const {montar}=await import(path.join(raiz,'build.mjs'));
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'sokonfx-export-'));
 const html=path.join(tmp,'SokonFX.html');fs.writeFileSync(html,montar());
 const guardar=process.argv[2];
 const b=await chromium.launch();

 // Partes puras.
 {
  const p=await b.newPage();await p.goto('file://'+html);
  const r=await p.evaluate(()=>({
   crc:jogoCrc32(new TextEncoder().encode('123456789')),
   caixa:jogoCaixa(Uint8ClampedArray.from({length:4*4*4},(_,i)=>i===((1*4+2)*4+3)?200:0),4,4),
   vazio:jogoCaixa(new Uint8ClampedArray(64),4,4),
   pacote:jogoEmpacotar([[1000,10],[1000,20],[100,5]],2048),
   curva:Array.from(jogoCurvaAlfa(new Uint8ClampedArray([0,0,0,64,0,0,0,255,0,0,0,0]),1)),
   nomes:[jogoNomeValido('impacto_v10'),jogoNomeValido('Impacto'),jogoNomeValido('a-b')],
  }));
  ok(r.crc===0xCBF43926,'CRC32 de referência');
  ok(JSON.stringify(r.caixa)==='[2,1,3,2]','caixa do pixel único '+JSON.stringify(r.caixa));
  ok(r.vazio===null,'quadro vazio');
  ok(JSON.stringify(r.pacote)===JSON.stringify({lugares:[[0,0],[1002,0],[0,22]],largura:2002,altura:27}),'prateleiras '+JSON.stringify(r.pacote));
  ok(JSON.stringify(r.curva)==='[0,0,0,128,0,0,0,255,0,0,0,0]','alfa^0,5 '+JSON.stringify(r.curva));
  ok(JSON.stringify(r.nomes)==='[true,false,false]','nome da pasta');
  await p.close();
 }

 for(const caso of casos){
  const p=await b.newPage({acceptDownloads:true});
  const erros=[];p.on('pageerror',e=>erros.push(e.message));
  await p.goto('file://'+html);
  await p.evaluate(()=>{playing=false;localStorage.clear()});
  if(caso.tipo){
   const [arq,qual]=caso.tipo.split(':');
   const bruto=JSON.parse(fs.readFileSync(path.join(raiz,'tipos',arq),'utf8'));
   const tipos=bruto.types||bruto.map(t=>({name:t.nome,values:t.valores,seed:t.seed,haloEnabled:true,linked:true,customParticleTint:'#ff781a'}));
   const tipo=qual?tipos.find(t=>t.name===qual):tipos[0];
   await p.evaluate(t=>{persistTypes([t]);showTypes([t]);el('savedTypes').value=t.name;el('savedTypes').onchange();playing=false},tipo);
  }else await p.evaluate(k=>{el('kind').value=k;el('kind').oninput({});playing=false},caso.kind);
  await p.evaluate(({nome,opcoes})=>{
   el('gameExport').open=true;el('jogoNome').value=nome;
   for(const [id,v] of Object.entries(opcoes)){if(el(id).type==='checkbox')el(id).checked=v;else el(id).value=v}
   jogoAtualizar();
  },caso);
  const [download]=await Promise.all([p.waitForEvent('download'),p.click('#jogoExportar')]);
  const zipPath=path.join(tmp,caso.nome+'.zip');await download.saveAs(zipPath);
  const status=await p.$eval('#jogoStatus',e=>e.value);
  ok(download.suggestedFilename()===caso.nome+'.zip','nome do zip '+download.suggestedFilename());
  const zip=lerZip(fs.readFileSync(zipPath));
  ok(Object.keys(zip).sort().join()===[caso.nome+'/efeito.json',caso.nome+'/folha.webp'].join(),caso.nome+': arquivos '+Object.keys(zip));
  const dados=JSON.parse(zip[caso.nome+'/efeito.json'].toString('utf8'));
  const webp=zip[caso.nome+'/folha.webp'];
  ok(webp.toString('latin1',0,4)==='RIFF'&&webp.toString('latin1',8,12)==='WEBP',caso.nome+': folha é WebP');
  // Decodifica a folha e compara cada quadro com o mesmo quadro desenhado de novo.
  const r=await p.evaluate(async({b64,dados})=>{
   const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
   const bmp=await createImageBitmap(new Blob([bytes],{type:'image/webp'}),{premultiplyAlpha:'none',colorSpaceConversion:'none'});
   const c=document.createElement('canvas');c.width=bmp.width;c.height=bmp.height;
   const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(bmp,0,0);
   const op=jogoOpcoes(),{folha}=jogoMontar(op);
   const y=folha.getContext('2d',{willReadFrequently:true});
   const a=x.getImageData(0,0,c.width,c.height).data,e=y.getImageData(0,0,folha.width,folha.height).data;
   let difAlfa=0,difCor=0;
   for(let i=0;i<a.length;i+=4){difAlfa=Math.max(difAlfa,Math.abs(a[i+3]-e[i+3]));
    if(e[i+3]>=32)for(let k=0;k<3;k++)difCor=Math.max(difCor,Math.abs(a[i+k]-e[i+k]))}
   let visiveis=0;for(let i=3;i<a.length;i+=4)if(a[i]>10)visiveis++;
   return {largura:bmp.width,altura:bmp.height,mesmaFolha:c.width===folha.width&&c.height===folha.height,difAlfa,difCor,visiveis};
  },{b64:webp.toString('base64'),dados});
  conferirComoOJogo(dados,r.largura,r.altura,caso.nome);
  ok(r.mesmaFolha&&r.difAlfa===0&&r.difCor<=2,`${caso.nome}: folha decodificada igual ao desenho (alfa ${r.difAlfa}, cor ${r.difCor})`);
  ok(r.visiveis>1000,caso.nome+': a folha tem desenho');
  ok(dados.sokonfx?.tipo?.seed!==undefined&&dados.sokonfx?.exportar?.jogoNome===caso.nome,caso.nome+': guarda o tipo e as opções para refazer');
  ok(erros.length===0,caso.nome+': erros na página '+erros);
  console.log(`${caso.nome}: ${status}`);
  if(guardar){fs.mkdirSync(guardar,{recursive:true});fs.copyFileSync(zipPath,path.join(guardar,caso.nome+'.zip'))}
  await p.close();
 }

 // Opções específicas.
 const ler=n=>JSON.parse(lerZip(fs.readFileSync(path.join(tmp,n+'.zip')))[n+'/efeito.json'].toString('utf8'));
 const h=ler('impacto_h'),f=ler('fumaca_pulo_teste'),ar=ler('ar_soma');
 ok(h.pixelScale===1.5&&h.quadros.length===16&&h.duracoesMs.every(ms=>ms===42),'H: 1x, 16 quadros a 24 fps (42 ms), como os v09');
 ok(JSON.stringify(h.luz)==='{"cor":"#F5C83E","alcance":0.9,"forca":0.75}','H: luz '+JSON.stringify(h.luz));
 ok(h.soma===undefined&&h.marcaMs===undefined,'H: sem soma nem parada');
 ok(f.quadros.length===14&&JSON.stringify(f.trecho)==='[1,14]','fumaça: quadros 2 a 15');
 ok(Math.abs(f.pixelScale-1.5*0.5/1.3)<1e-3,'fumaça: pixelScale com resolução 50% e tamanho 1,3x '+f.pixelScale);
 ok(f.duracoesMs[4]===42+200&&f.marcaMs===4*42,'fumaça: quadro 5 segurado 200 ms');
 ok(f.luz===undefined,'fumaça: sem luz');
 ok(ar.soma===1&&ar.pixelScale===3,'ar: soma 1 e tamanho 0,5x');
 await b.close();fs.rmSync(tmp,{recursive:true});
 console.log(falhas?`${falhas} falhas`:'export: tudo certo');
 process.exit(falhas?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
