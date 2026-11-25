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
for(const kind of ['Defesa','Choque','Raio','Linhas de mangá','Aura','Detritos','Explosão','Onda de choque','Faíscas','Gelo','Vento e vórtices','Feixe de energia','Teletransporte','Portal','Gases e vapores','Energia sombria','Decal (marca no chão)','Rastro do golpe','Poeira','Partículas','Brilhos e flashes','Energia espiritual','Afterimage','Hit (à mão)'])for(const power of ['3','9','14'])
 casos.push(c(`${kind} força ${power}`,{kind,power}));
for(const defForma of ['arco','duplo','anel'])casos.push(c(`Defesa ${defForma}`,{kind:'Defesa',defForma,defTamanho:'160',defAbertura:'150',defEspessura:'40',defQuebra:'4',defPedacos:'11',defBrilho:'0',defDois:''}));
casos.push(c('Choque variado',{kind:'Choque',chqAbertura:'110',chqComprimento:'200',chqEspessura:'40',chqAnel:'',chqLinhas:'40',chqQuebra:'9',chqBrilho:'100',chqDois:''}));
casos.push(c('Raio variado',{kind:'Raio',raiQtd:'8',raiComprimento:'240',raiEspalha:'360',raiZigue:'100',raiRamos:'6',raiEspessura:'25',raiQuebra:'3',raiDois:''}));
for(const auForma of ['corpo','chao','bola'])casos.push(c(`Aura ${auForma}`,{kind:'Aura',auForma,auAltura:'380',auLargura:'200',auQtd:'50',auChama:'150',auBalanco:'100',auCiclos:'3',auBrilho:'0',auDois:''}));
casos.push(c('Detritos variado',{kind:'Detritos',detQtd:'35',detTamanho:'220',detForcaPulo:'200',detEspalha:'40',detDirecao:'-60',detGravidade:'40',detPoeira:'',detCorPoeira:'0'}));
casos.push(c('Explosão variada',{kind:'Explosão',expTamanho:'190',expBolas:'40',expSobe:'200',expFumaca:'0',expAnel:'',expQuebra:'4',expDois:''}));
casos.push(c('Onda variada',{kind:'Onda de choque',ondTamanho:'240',ondPerspectiva:'90',ondEspessura:'60',ondAneis:'4',ondAtraso:'1',ondQuebra:'30',ondDois:'1'}));
casos.push(c('Faíscas variadas',{kind:'Faíscas',faiCone:'360',faiVelocidade:'200',faiGravidade:'0',faiRastro:'200',faiTamanho:'250',faiDois:'1',particles:'60'}));
casos.push(c('Gelo variado',{kind:'Gelo',gelPontas:'24',gelTamanho:'200',gelLeque:'360',gelGrossura:'250',gelQuebra:'4',gelDois:''}));
for(const venTipo of ['rajada','vortice'])casos.push(c(`Vento ${venTipo}`,{kind:'Vento e vórtices',venTipo,venTracos:'24',venTamanho:'200',venEspessura:'40',venGiro:'300',venDois:''}));
casos.push(c('Feixe variado',{kind:'Feixe de energia',fexComprimento:'420',fexLargura:'140',fexTremido:'100',fexCheio:'2',fexEspiral:'',fexDois:''}));
casos.push(c('Teletransporte aparece',{kind:'Teletransporte',telModo:'aparece',telAltura:'420',telLargura:'220',telRiscos:'40',telDois:''}));
casos.push(c('Portal variado',{kind:'Portal',porRaio:'220',porBracos:'10',porRachas:'14',porAberto:'2',porAchata:'80',porDois:''}));
casos.push(c('Gás variado',{kind:'Gases e vapores',gasTamanho:'200',gasBolas:'30',gasDeriva:'-100',gasSobe:'200',gasDesfaz:'3',gasDois:'',particles:'40'}));
casos.push(c('Sombria variada',{kind:'Energia sombria',somTentaculos:'16',somAltura:'400',somLargura:'240',somEnrola:'100',somEscuro:'100',somQuebra:'3',somDois:''}));
casos.push(c('Choque com rampa',{kind:'Choque',rampaLiga:'1',rampaCor:'#3050ff',rampaInicio:'0'}));
for(const decTipo of ['rachadura','queimado','cratera'])casos.push(c(`Decal ${decTipo}`,{kind:'Decal (marca no chão)',decTipo,decTamanho:'230',decRachas:'20',decAchata:'0',decBrasa:'100',decFecha:'4'}));
casos.push(c('Rastro variado',{kind:'Rastro do golpe',rasRaio:'230',rasArco:'300',rasLargura:'160',rasRiscos:'30',rasVeu:'100',rasSentido:'anti',rasGolpe:'2'}));
for(const poeLado of ['frente','tras'])casos.push(c(`Poeira ${poeLado}`,{kind:'Poeira',poeLado,poeBolas:'30',poeTamanho:'200',poeAlcance:'220',poeSobe:'200',poeDesfaz:'3',poeDois:''}));
for(const parForma of ['bola','estrela','lasca','pena','quadrado'])casos.push(c(`Partículas ${parForma}`,{kind:'Partículas',parForma,parLeque:'360',parGravidade:'-100',parGiro:'200',parTamanho:'300',particles:'60'}));
casos.push(c('Clarão',{kind:'Brilhos e flashes',briTipo:'clarao',briTamanho:'250'}));
casos.push(c('Espiritual variada',{kind:'Energia espiritual',espQtd:'20',espTamanho:'200',espLargura:'240',espAltura:'380',espCauda:'200',espDois:''}));
casos.push(c('Explosão dissolve e sombra',{kind:'Explosão',dissLiga:'1',dissInicio:'20',dissBorda:'',sombraLiga:'1',sombraY:'300',sombraForca:'80'}));
for(const rasEstilo of ['riscos','pincel','arco','seda','rasgado','fogo','tinta','vapor','lamina','leque','arcoiris'])casos.push(c(`Rastro ${rasEstilo}`,{kind:'Rastro do golpe',rasEstilo}));
casos.push(c('Rastro desenhado',{kind:'Rastro do golpe',rasCaminho:'desenhado',rasPontos:'[[-180,-60],[-60,-140],[80,-90],[170,40],[120,160]]',rasEstilo:'rasgado'}));
for(const dissModo of ['fora','dentro','baixo','cima'])casos.push(c(`Dissolver ${dissModo}`,{kind:'Choque',dissLiga:'1',dissInicio:'10',dissModo}));
for(const parEmissor of ['linha','chao','circulo'])casos.push(c(`Partículas emissor ${parEmissor}`,{kind:'Partículas',parEmissor,parArea:'200'}));
casos.push(c('Afterimage sem fatias',{kind:'Afterimage',aftCopias:'8',aftDistancia:'20',aftTinge:'0',aftFatias:'',aftOriginal:'1'}));
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
