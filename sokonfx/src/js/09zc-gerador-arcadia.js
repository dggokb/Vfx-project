// Arcadia (partículas): o editor de partículas Arcadia Effector (Anton Chuev, licença MIT; sokonfx/vendor/arcadia)
// dentro do Sōkon. O efeito dele (um JSON) fica guardado no tipo, no campo arcEfeito; o motor dele
// desenha cada quadro do Sōkon, e daí em diante vale tudo do Sōkon: composição, prévia no jogo, kit
// e export no formato do jogo.
//
// O editor roda num quadro isolado (iframe com a página dele inteira, montada pelo build): o estilo e o
// código dele não esbarram nos do Sōkon. O mesmo quadro desenha escondido e, aberto, cobre a tela.
// Campo vazio = o modelo do jogo (vendor/arcadia/sokon/hit_forte.json, o hit forte do Sōkon).

const ARCADIA_MODELO='fx_sokon_hit';
const arcadia={janela:null,pronto:null,efeitos:new Map(),esperas:[],tela:null};

function arcadiaAbrir(){
 if(arcadia.pronto)return arcadia.pronto;
 const f=document.createElement('iframe');f.id='arcadiaQuadro';f.title='Editor de partículas (Arcadia)';
 arcadia.pronto=new Promise(res=>f.addEventListener('load',()=>{arcadia.janela=f.contentWindow;res(arcadia.janela)},{once:true}));
 f.srcdoc=ARCADIA_PAGINA();
 el('arcadiaEditor').append(f);
 return arcadia.pronto;
}
function arcadiaModelo(){
 const W=arcadia.janela,m=W.AFX.Factory.find(p=>p.id===ARCADIA_MODELO)||W.AFX.Factory[0];
 return m.build();
}
// O efeito de um texto (cache por texto: a composição pode ter várias camadas de Partículas).
// Sem textura ele fica pronto na hora; com textura (data URL) chega depois e redesenha.
function arcadiaEfeito(texto){
 const W=arcadia.janela;if(!W||!W.AFX)return null;
 const ja=arcadia.efeitos.get(texto);
 if(ja)return ja.doc?ja:null;
 const entrada={doc:null,motor:null};arcadia.efeitos.set(texto,entrada);
 if(arcadia.efeitos.size>8)arcadia.efeitos.delete(arcadia.efeitos.keys().next().value);
 const pronto=doc=>{entrada.doc=doc;entrada.motor=new W.AFX.Engine();arcadia.esperas.splice(0).forEach(r=>r())};
 if(!texto){pronto(arcadiaModelo());return entrada}
 let arquivo=null;try{arquivo=JSON.parse(texto)}catch{}
 W.AFX.Model.loadEffectFile(arquivo,doc=>{pronto(doc||arcadiaModelo());preview()});
 return entrada.doc?entrada:null;
}
// Espera o editor e o efeito do campo ficarem prontos (aplicarTipo usa antes de montar ou exportar).
function arcadiaEsperar(){
 if(el('kind').value!=='Arcadia (partículas)')return null;
 return arcadiaAbrir().then(()=>new Promise(res=>{if(arcadiaEfeito(el('arcEfeito').value))res();else arcadia.esperas.push(res)})).then(arcadiaTexturas);
}
// As texturas do efeito (data URL) carregam à parte: espera estarem prontas antes de desenhar ou exportar.
function arcadiaTexturas(){
 const W=arcadia.janela,e=arcadiaEfeito(el('arcEfeito').value);if(!W||!e)return;
 const faltam=()=>(e.doc.textures||[]).some(t=>!W.AFX.Sprites.texs.has(t.id));
 if(!faltam())return;
 return new Promise(res=>{let n=0;const v=()=>{if(!faltam()||++n>200)res();else setTimeout(v,25)};v()});
}

registrarGerador({
 nome:'Arcadia (partículas)',
 perfil:{tint:'#ff7a12',particles:24},
 origem:{x:256,y:256},
 semCor:true,
 comuns:['kind','angle','fps','geradorParams','composicao','gamePreview','gameExport'],
 params:[
  {id:'arcEfeito',tipo:'oculto',padrao:''},
  {id:'arcTamanho',rotulo:'Tamanho',tipo:'range',min:20,max:200,padrao:100,unidade:'%'},
  {id:'arcTempo',rotulo:'Tempo',tipo:'select',padrao:'inteiro',opcoes:[['inteiro','O efeito inteiro nos 16 quadros'],['fps','No ritmo do fps (corta o que passar)']]},
  {id:'arcInicio',rotulo:'Começa em',tipo:'range',min:0,max:95,padrao:0,unidade:'%'},
  {id:'arcFim',rotulo:'Termina em',tipo:'range',min:5,max:100,padrao:100,unidade:'%'},
 ],
 desenhar(x,{i,n,p}){
  if(!arcadia.janela){arcadiaAbrir().then(()=>preview());return}
  const e=arcadiaEfeito(p.arcEfeito);if(!e)return;
  const d=e.doc,dur=d.comp.dur,ini=Math.min(p.arcInicio,p.arcFim-1)/100*dur,fim=Math.max(p.arcFim,p.arcInicio+1)/100*dur;
  const t=p.arcTempo==='fps'?ini+i/(+el('fps').value||30):ini+(i+.5)/n*(fim-ini);
  const w=d.comp.w,h=d.comp.h;
  if(!arcadia.tela||arcadia.tela.width!==w||arcadia.tela.height!==h){arcadia.tela=arcadia.janela.document.createElement('canvas');arcadia.tela.width=w;arcadia.tela.height=h}
  e.motor.render(d,Math.min(t,dur),arcadia.tela.getContext('2d'));
  const s=p.arcTamanho/100;
  x.drawImage(arcadia.tela,-w/2*s,-h/2*s,w*s,h*s);
 }
});

// O editor por cima de tudo, com a barra do Sōkon em cima: Usar no Sōkon grava o efeito no campo.
{
 const caixa=document.createElement('div');caixa.id='arcadiaEditor';caixa.className='arcadia-editor';
 const barra=document.createElement('div');barra.className='arcadia-barra';
 const titulo=document.createElement('strong');titulo.textContent='Arcadia (partículas)';
 const credito=document.createElement('small');credito.textContent='Arcadia Effector, de Anton Chuev (licença MIT)';
 const usar=document.createElement('button');usar.id='arcadiaUsar';usar.textContent='Usar no Sōkon';
 const cancelar=document.createElement('button');cancelar.id='arcadiaCancelar';cancelar.textContent='Cancelar';
 barra.append(titulo,credito,usar,cancelar);caixa.append(barra);document.body.append(caixa);
 const fechar=()=>{caixa.classList.remove('aberto');document.body.classList.remove('arcadia-aberto')};
 usar.onclick=()=>{
  const W=arcadia.janela;if(!W||!W.AFX)return fechar();
  el('arcEfeito').value=JSON.stringify(W.AFX.Model.effectFile(W.AFX.state.doc));
  fechar();preview();
 };
 cancelar.onclick=fechar;
 // Os botões no painel do gerador.
 const painel=document.querySelector('.gerador-params[data-gerador="Arcadia (partículas)"]');
 const abrir=document.createElement('button');abrir.type='button';abrir.id='arcadiaAbrir';abrir.textContent='Abrir o editor de partículas';
 const voltar=document.createElement('button');voltar.type='button';voltar.id='arcadiaModelo';voltar.textContent='Voltar ao hit do Sōkon';
 const nota=document.createElement('small');nota.className='arcadia-nota';
 nota.textContent='Editor completo: camadas, linha do tempo, curvas e modelos prontos. Em "Usar no Sōkon" o efeito volta para cá e vai junto no tipo salvo.';
 painel.prepend(abrir,voltar,nota);
 voltar.onclick=()=>{el('arcEfeito').value='';preview()};
 abrir.onclick=async()=>{
  caixa.classList.add('aberto');document.body.classList.add('arcadia-aberto');
  const W=await arcadiaAbrir(),texto=el('arcEfeito').value;
  const mostrar=doc=>{W.AFX.openDoc(doc,{fresh:true});W.AFX.setPlaying(true)};
  if(!texto)return mostrar(arcadiaModelo());
  let arquivo=null;try{arquivo=JSON.parse(texto)}catch{}
  W.AFX.Model.loadEffectFile(arquivo,doc=>mostrar(doc||arcadiaModelo()));
 };
}
