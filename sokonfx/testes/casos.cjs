// Os casos que travam o visual: cada tipo no padrão, as variações dos controles de cada um e os
// tipos que já estão no jogo. Mudou um gerador de propósito? Atualize a referência (README).
const fs=require('fs'),path=require('path');
const S=75823;
const c=(nome,valores,extra={})=>({nome,modo:'tipo',valores,seed:S,...extra});
const casos=[];
for(const kind of ['Impacto','Corte','Projétil','Fogo','Água','Gosma','Fumaça','Ponto de luz','Pressão de ar'])
 for(const styleMix of ['0','50','100'])casos.push(c(`${kind} cel${styleMix}`,{kind,styleMix}));
for(const material of ['Energia','Fogo','Água','Gosma','Raio','Gelo','Vento','Pedra','Nanquim'])
 for(const artStyle of ['original','anime','manga','brush'])
  casos.push(c(`Impacto ${material} ${artStyle}`,{kind:'Impacto',material,artStyle,styleMix:'40'}));
for(const kind of ['Impacto','Corte','Projétil','Fogo','Água','Gosma','Ponto de luz','Pressão de ar'])
 for(const drawing of ['star','cross','saw','twin'])casos.push(c(`${kind} desenho ${drawing}`,{kind,drawing}));
for(const motion of ['pulse','in'])casos.push(c(`Impacto movimento ${motion}`,{kind:'Impacto',motion}));
for(const openingShape of ['radial','cross','fan','spiral','random'])
 casos.push(c(`Impacto abertura ${openingShape}`,{kind:'Impacto',motion:'out',openingShape,pieces:'80',openingFrame:'5'}));
casos.push(c('Impacto larguras',{kind:'Impacto',rimWidth:'200',coreWidth:'40',diameter:'150',focus:'80',riskWidth:'500',outerWidth:'200',particleWidth:'250',shapes:'4',particles:'60',power:'14',light:'100',angle:'90'}));
casos.push(c('Impacto sem halo e cor própria',{kind:'Impacto',particleTint:'#33aaff'},{halo:false,linked:false,custom:'#33aaff'}));
for(const smokeForm of ['linear','ring','jump'])for(const plumes of ['1','3'])
 casos.push(c(`Fumaça ${smokeForm} ${plumes}`,{kind:'Fumaça',smokeForm,plumes,windForce:'60',windAngle:'120'}));
for(const smokeMirror of ['flip','pairs'])casos.push(c(`Fumaça espelho ${smokeMirror}`,{kind:'Fumaça',smokeForm:'linear',plumes:'2',smokeMirror,rise:'150',fall:'60'}));
for(const jumpDirection of ['out','up','left','right'])
 casos.push(c(`Fumaça pulo ${jumpDirection}`,{kind:'Fumaça',smokeForm:'jump',jumpDirection,jumpRoll:'140',jumpCurl:'180',jumpVolume:'150',jumpOpen:'5',offsetTopoX:'20',offsetDobraY:'-15',moreDissolve:'[[300,200]]',dissolveX:'250',dissolveY:'230'}));
for(const airFlow of ['out','in','pulse'])for(const airEdge of ['round','spiked'])
 casos.push(c(`Ar ${airFlow} ${airEdge}`,{kind:'Pressão de ar',airFlow,airEdge,airCopies:'14',airWaves:'4',airInterval:'1',airRingGap:'200',airParticleGap:'50',airWidth:'14'}));
casos.push(c('Ponto de luz feixes',{kind:'Ponto de luz',beams:'12',beamWidth:'30',focusX:'200',focusY:'300'}));
// Os geradores novos (registro em 09a-geradores.js): o padrão e as variações dos controles.
for(const kind of ['Defesa','Choque','Raio','Linhas de mangá','Aura','Detritos'])for(const power of ['3','9','14'])
 casos.push(c(`${kind} força ${power}`,{kind,power}));
for(const defForma of ['arco','duplo','anel'])casos.push(c(`Defesa ${defForma}`,{kind:'Defesa',defForma,defTamanho:'160',defAbertura:'150',defEspessura:'40',defQuebra:'4',defPedacos:'11',defBrilho:'0',defDois:''}));
casos.push(c('Choque variado',{kind:'Choque',chqAbertura:'110',chqComprimento:'200',chqEspessura:'40',chqAnel:'',chqLinhas:'40',chqQuebra:'9',chqBrilho:'100',chqDois:''}));
casos.push(c('Raio variado',{kind:'Raio',raiQtd:'8',raiComprimento:'240',raiEspalha:'360',raiZigue:'100',raiRamos:'6',raiEspessura:'25',raiQuebra:'3',raiDois:''}));
for(const auForma of ['corpo','chao','bola'])casos.push(c(`Aura ${auForma}`,{kind:'Aura',auForma,auAltura:'380',auLargura:'200',auQtd:'50',auChama:'150',auBalanco:'100',auCiclos:'3',auBrilho:'0',auDois:''}));
casos.push(c('Detritos variado',{kind:'Detritos',detQtd:'35',detTamanho:'220',detForcaPulo:'200',detEspalha:'40',detDirecao:'-60',detGravidade:'40',detPoeira:'',detCorPoeira:'0'}));
for(const linTipo of ['concentracao','velocidade'])
 casos.push(c(`Linhas ${linTipo}`,{kind:'Linhas de mangá',linTipo,linQtd:'120',linMeio:'40',linComprimento:'220',linGrossura:'14',linBranco:'20',linSome:'3',linDois:''}));
// Os tipos salvos do dono (sokonfx-types-v1).
const tiposDir=path.join(__dirname,'..','tipos');
for(const f of fs.existsSync(tiposDir)?fs.readdirSync(tiposDir):[]){
 const d=JSON.parse(fs.readFileSync(path.join(tiposDir,f),'utf8'));
 if(d.format==='sokonfx-types-v1')for(const t of d.types)
  casos.push({nome:`tipo ${f} ${t.name}`,modo:'tipo',valores:t.values,seed:t.seed,halo:t.haloEnabled,linked:t.linked,custom:t.customParticleTint});
}
module.exports=casos;
