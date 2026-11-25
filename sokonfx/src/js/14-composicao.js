// Composição de camadas: um efeito feito de vários (o soco pesado da bíblia: estrela, onda de choque,
// faíscas, poeira, detritos), cada camada com o tipo dela, quando começa, onde fica, tamanho, giro,
// opacidade e se soma como luz. A primeira camada da lista fica embaixo.
//
// Cada camada guarda o tipo inteiro (não só o nome): a composição continua igual mesmo se o tipo
// salvo mudar ou sumir. Para desenhar uma camada, o tipo dela vai para a tela, os 16 quadros são
// desenhados e guardados ("assados"), e a tela volta exatamente ao que era.

const composicao={ativa:false,camadas:[],cache:new Map()};
let compondo=false;

// O tipo que está na tela, com a referência de imagem, no formato do "Salvar tipo".
function tipoDaTela(){
 const kind=el('kind').value,ref=userRefs.get(kind);
 return {name:el('presetName').value.trim()||kind,values:Object.fromEntries(savedFields.map(id=>[id,el(id).value])),
  reference:ref?{name:ref.name,data:ref.data}:null,seed,haloEnabled,customParticleTint,linked:el('linkTint').checked};
}
const composicaoChave=tipo=>JSON.stringify([tipo.values,tipo.seed,tipo.haloEnabled,tipo.customParticleTint,tipo.linked,tipo.reference?.data||null]);

function composicaoCamada(tipo){
 return {tipo,nome:tipo.name||tipo.values.kind,inicio:0,dx:0,dy:0,escala:100,angulo:0,opacidade:100,soma:false,espelhar:false,oculta:false,camada:'frente',ancora:'golpe'};
}

// ---- Partes puras ----

function composicaoTotal(camadas){
 const visiveis=camadas.filter(c=>!c.oculta);
 return visiveis.length?Math.max(...visiveis.map(c=>c.inicio+frames)):frames;
}

// O quadro i da composição a partir dos quadros assados de cada camada (canvas 512).
function composicaoDesenhar(ctx,camadas,quadrosDe,i){
 for(const c of camadas){
  if(c.oculta)continue;
  const j=i-c.inicio;if(j<0||j>=frames)continue;
  const q=quadrosDe(c)?.[j];if(!q)continue;
  ctx.save();
  ctx.globalAlpha=Math.max(0,Math.min(1,c.opacidade/100));
  if(c.soma)ctx.globalCompositeOperation='lighter';
  ctx.translate(256+c.dx,256+c.dy);ctx.rotate(c.angulo*Math.PI/180);
  const k=c.escala/100;ctx.scale(c.espelhar?-k:k,k);ctx.translate(-256,-256);
  ctx.drawImage(q,0,0);
  ctx.restore();
 }
}

// ---- Na página ----

// O quadro i do que está valendo: a composição (se ligada) ou o efeito da tela.
function desenharQuadro(ctx,i){
 i=tempoMapa(i,quadrosTotais());
 if(composicao.ativa&&!compondo&&composicao.camadas.length)
  composicaoDesenhar(ctx,composicao.camadas,c=>composicao.cache.get(composicaoChave(c.tipo)),i);
 else draw(ctx,i);
}
function quadrosTotais(){return composicao.ativa&&composicao.camadas.length?composicaoTotal(composicao.camadas):frames}

// Assa as camadas que faltam e devolve a tela ao que era.
let composicaoFila=Promise.resolve();
function composicaoAssar(){
 composicaoFila=composicaoFila.then(async()=>{
  const faltam=composicao.camadas.filter(c=>!composicao.cache.has(composicaoChave(c.tipo)));
  if(!faltam.length)return;
  const salvo=tipoDaTela(),frame=el('frame').value,nome=el('presetName').value,status=el('presetStatus').textContent,inicio=start;
  compondo=true;el('compStatus').value='Desenhando as camadas…';
  try{
   for(const c of faltam){
    const chave=composicaoChave(c.tipo);if(composicao.cache.has(chave))continue;
    await aplicarTipo(c.tipo,{jogo:false});
    // Tipo antigo sem algum campo fica com o valor da tela nessa hora (como ao abrir um tipo):
    // a camada guarda o tipo completo, para sair igual daqui em diante.
    const completo={...tipoDaTela(),name:c.tipo.name};c.tipo=completo;
    const quadros=[];
    for(let i=0;i<frames;i++){const t=document.createElement('canvas');t.width=t.height=512;const x=t.getContext('2d');x.save();draw(x,i);x.restore();quadros.push(t)}
    composicao.cache.set(composicaoChave(completo),quadros);
   }
  }finally{
   await aplicarTipo(salvo,{jogo:false});
   el('frame').value=frame;el('presetName').value=nome;el('presetStatus').textContent=status;start=inicio;
   compondo=false;el('compStatus').value='';
   composicaoMudou();
  }
 });
 return composicaoFila;
}

function composicaoMudou(){
 const total=quadrosTotais(),antes=+el('frame').max+1;
 el('frame').max=total-1;if(+el('frame').value>total-1)el('frame').value=total-1;
 for(const id of ['jogoInicio','jogoFim'])el(id).max=total;
 if(+el('jogoFim').value===antes||+el('jogoFim').value>total)el('jogoFim').value=total;
 if(+el('jogoInicio').value>total)el('jogoInicio').value=1;
 try{previa.sujo=true}catch{}
 preview();
}

function composicaoLer(){return composicao.camadas.length?{ativa:composicao.ativa,camadas:composicao.camadas.map(c=>({...c}))}:null}
function composicaoAplicar(dados){
 composicao.camadas=(dados?.camadas||[]).filter(c=>c?.tipo?.values).map(c=>({...composicaoCamada(c.tipo),...c}));
 composicao.ativa=!!dados?.ativa&&composicao.camadas.length>0;
 el('compAtiva').checked=composicao.ativa;
 composicaoListar();composicaoAssar();composicaoMudou();
}

const compCampos=[['inicio','Começa no quadro','number',0,48,1],['dx','Mover para o lado','range',-256,256,1],['dy','Mover para cima/baixo','range',-256,256,1],
 ['escala','Tamanho (%)','range',10,300,5],['angulo','Girar (°)','range',-180,180,1],['opacidade','Opacidade (%)','range',0,100,1]];
const compMarcas=[['soma','Soma como luz'],['espelhar','Espelhar'],['oculta','Esconder']];

function composicaoListar(){
 const lista=el('compLista');lista.textContent='';
 composicao.camadas.forEach((c,n)=>{
  const caixa=document.createElement('fieldset');caixa.className='camada';
  const titulo=document.createElement('legend');titulo.textContent=`${n+1}. ${c.nome} (${c.tipo.values.kind})`;caixa.append(titulo);
  for(const [campo,rotulo,tipo,min,max,passo] of compCampos){
   const l=document.createElement('label'),saida=document.createElement('output'),e=document.createElement('input');
   Object.assign(e,{type:tipo,min,max,step:passo,value:c[campo]});e.dataset.campo=campo;saida.value=c[campo];
   e.addEventListener('input',()=>{c[campo]=+e.value;saida.value=e.value;composicaoMudou()});
   if(tipo==='range')l.append(rotulo+' ',saida,e);else l.append(rotulo,e);caixa.append(l);
  }
  // No jogo: na frente ou atrás dos lutadores; nasce na ponta do golpe ou no chão sob quem apanha.
  for(const [campo,rotulo,ops] of [['camada','No jogo',[['frente','Na frente dos lutadores'],['atras','Atrás dos lutadores']]],['ancora','Nasce',[['golpe','Na ponta do golpe'],['chao','No chão, sob quem apanha']]]]){
   const l=document.createElement('label'),e=document.createElement('select');for(const [v,t] of ops)e.add(new Option(t,v));
   e.value=c[campo]||ops[0][0];e.dataset.campo=campo;e.addEventListener('input',()=>{c[campo]=e.value});l.append(rotulo,e);caixa.append(l);
  }
  for(const [campo,rotulo] of compMarcas){
   const l=document.createElement('label'),e=document.createElement('input');l.className='jogo-check';
   e.type='checkbox';e.checked=c[campo];e.dataset.campo=campo;
   e.addEventListener('input',()=>{c[campo]=e.checked;composicaoMudou()});
   l.append(rotulo,e);caixa.append(l);
  }
  const botoes=document.createElement('div');botoes.className='camada-botoes';
  const botao=(texto,acao)=>{const b=document.createElement('button');b.type='button';b.textContent=texto;b.onclick=acao;botoes.append(b)};
  botao('Subir',()=>{if(n>0){[composicao.camadas[n-1],composicao.camadas[n]]=[composicao.camadas[n],composicao.camadas[n-1]];composicaoListar();composicaoMudou()}});
  botao('Descer',()=>{if(n<composicao.camadas.length-1){[composicao.camadas[n+1],composicao.camadas[n]]=[composicao.camadas[n],composicao.camadas[n+1]];composicaoListar();composicaoMudou()}});
  botao('Levar para a tela',async()=>{await aplicarTipo(c.tipo,{jogo:false});el('compStatus').value=`A camada ${n+1} está na tela: ajuste e use "Trocar pela tela".`;if(composicao.ativa)el('compAtiva').click()});
  botao('Trocar pela tela',()=>{c.tipo=tipoDaTela();c.nome=c.tipo.name;composicaoListar();composicaoAssar()});
  botao('Tirar',()=>{composicao.camadas.splice(n,1);if(!composicao.camadas.length){composicao.ativa=false;el('compAtiva').checked=false}composicaoListar();composicaoMudou()});
  caixa.append(botoes);lista.append(caixa);
 });
 el('compVazia').hidden=composicao.camadas.length>0;
}

function composicaoTiposSalvos(){
 const s=el('compAdicionarTipo');s.length=1;
 for(const t of storedTypes())s.add(new Option(t.name,t.name));
}
function composicaoAdicionar(tipo){
 composicao.camadas.push(composicaoCamada(tipo));
 if(!composicao.ativa){composicao.ativa=true;el('compAtiva').checked=true}
 composicaoListar();composicaoAssar();composicaoMudou();
}
el('compAdicionarTela').onclick=()=>composicaoAdicionar(tipoDaTela());
el('compAdicionarTipo').onfocus=composicaoTiposSalvos;
el('compAdicionarTipo').onchange=()=>{
 const t=storedTypes().find(t=>t.name===el('compAdicionarTipo').value);
 el('compAdicionarTipo').value='';
 if(t)composicaoAdicionar(JSON.parse(JSON.stringify({name:t.name,values:t.values,reference:t.reference||null,seed:t.seed,haloEnabled:t.haloEnabled,customParticleTint:t.customParticleTint,linked:t.linked})));
};
el('compAtiva').addEventListener('input',()=>{composicao.ativa=el('compAtiva').checked&&composicao.camadas.length>0;if(!composicao.camadas.length)el('compAtiva').checked=false;composicaoMudou()});
el('composicao').addEventListener('toggle',composicaoTiposSalvos);
composicaoListar();
