// Ferramentas do editor (bíblia, "Recursos que o editor também precisa ter"):
//  - Onion skin ("Vizinhos"): o quadro anterior (avermelhado) e o seguinte (esverdeado), apagados,
//    por baixo do quadro na prévia quadrada. Só na prévia; não vai para o export.
//  - Rampa de cor: controles (o desenho está em desenharGerador).
//  - Export em lote: vários tipos salvos num .zip só, cada um com as opções de export dele.

// ---- Vizinhos ----
let onionTela=null;
function onionDesenhar(ctx,i){
 const n=quadrosTotais();
 if(!onionTela){onionTela=document.createElement('canvas');onionTela.width=onionTela.height=512}
 const o=onionTela.getContext('2d');
 for(const [j,cor] of [[i-1,'#ff5a5a'],[i+1,'#5aff9a']]){
  if(j<0||j>=n)continue;
  o.clearRect(0,0,512,512);o.save();desenharQuadro(o,j);o.restore();
  o.save();o.globalCompositeOperation='source-atop';o.fillStyle=cor;o.globalAlpha=.55;o.fillRect(0,0,512,512);o.restore();
  ctx.save();ctx.globalAlpha=.32;ctx.drawImage(onionTela,0,0);ctx.restore();
 }
}
el('onion').onclick=()=>{const liga=el('onion').getAttribute('aria-pressed')!=='true';el('onion').setAttribute('aria-pressed',String(liga));preview()};

// ---- Rampa de cor ----
el('rampaLiga').addEventListener('input',()=>{el('rampaLiga').value=el('rampaLiga').checked?'1':'';preview()});
el('rampaCor').addEventListener('input',preview);
el('rampaInicio').addEventListener('input',()=>{el('rampaInicioValor').value=el('rampaInicio').value+'%';preview()});

// ---- Export em lote ----

// O nome da pasta de um tipo: o que ele guardou no export, ou o nome dele sem acento e espaço.
function loteNome(tipo,usados){
 let base=(tipo.jogo?.jogoNome||tipo.name||tipo.values?.kind||'efeito').normalize('NFD').replace(/[̀-ͯ]/g,'')
  .toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')||'efeito';
 let nome=base,k=2;while(usados.has(nome))nome=base+'_'+(k++);
 usados.add(nome);return nome;
}

el('jogoLote').onclick=()=>{
 const lista=el('jogoLoteLista'),tipos=storedTypes();
 lista.textContent='';
 if(!tipos.length){lista.hidden=false;lista.textContent='Nenhum tipo salvo neste navegador.';return}
 for(const t of tipos){
  const l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.checked=true;c.value=t.name;
  l.append(c,' '+t.name+(t.composicao?' (composição)':''));lista.append(l);
 }
 const b=document.createElement('button');b.type='button';b.className='primary';b.textContent='Baixar os marcados';
 b.onclick=()=>loteExportar([...lista.querySelectorAll('input:checked')].map(c=>tipos.find(t=>t.name===c.value)).filter(Boolean));
 lista.append(b);lista.hidden=false;
};

async function loteExportar(tipos){
 if(!tipos.length){el('jogoStatus').value='Marque pelo menos um tipo.';return}
 // Guarda a tela inteira (tipo, export, composição) para devolver no fim.
 const tela=tipoDaTela(),exportar=jogoLer(),comp=composicaoLer(),nomeTela=el('presetName').value,status=el('presetStatus').textContent;
 const arquivos=[],usados=new Set(),feitos=[];
 el('jogoStatus').value=`Montando ${tipos.length} efeitos…`;
 try{
  for(const t of tipos){
   await aplicarTipo(t);
   composicaoAplicar(t.composicao||null);await composicaoFila;
   const nome=loteNome(t,usados);el('jogoNome').value=nome;
   const {folha,dados}=jogoMontar({...jogoOpcoes(),nome});
   const webp=await new Promise(r=>folha.toBlob(r,'image/webp',1));
   if(!webp||webp.type!=='image/webp')throw Error('este navegador não grava WebP (use o Chrome)');
   arquivos.push({nome:nome+'/folha.webp',dados:new Uint8Array(await webp.arrayBuffer())},{nome:nome+'/efeito.json',dados:new TextEncoder().encode(JSON.stringify(dados,null,1)+'\n')});
   feitos.push(nome);
  }
  const zip=jogoZip(arquivos),url=URL.createObjectURL(zip),a=document.createElement('a');
  a.href=url;a.download='sokonfx_lote.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
  el('jogoStatus').value=`sokonfx_lote.zip: ${feitos.join(', ')}. Solte as pastas em assets/efeitos/.`;
 }catch(e){el('jogoStatus').value='Não exportou o lote: '+e.message}
 finally{
  await aplicarTipo(tela,{jogo:false});jogoAplicar(exportar);composicaoAplicar(comp);await composicaoFila;
  el('presetName').value=nomeTela;el('presetStatus').textContent=status;el('jogoLoteLista').hidden=true;preview();
 }
}
