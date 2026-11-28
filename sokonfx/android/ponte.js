// Sōkon FX no app Android: o WebView não baixa link com "download" (blob/data). Esta ponte troca o clique
// desses links por uma chamada ao app (SokonAndroid.salvar), que grava o arquivo em Download/SokonFX.
// Vale também para o editor de partículas (o iframe do Arcadia), ligado quando ele carrega.
(function(){
 if(!window.SokonAndroid)return;
 function base64(buf){
  var u=new Uint8Array(buf),partes=[];
  for(var i=0;i<u.length;i+=0x8000)partes.push(String.fromCharCode.apply(null,u.subarray(i,i+0x8000)));
  return btoa(partes.join(''));
 }
 function salvar(a,w){
  var nome=a.download||'arquivo',href=a.href,b=w.__blobsSokon&&w.__blobsSokon.get(href);
  if(/^data:/.test(href)){var m=/^data:([^;,]*)(;base64)?,(.*)$/.exec(href)||[];
   SokonAndroid.salvar(nome,m[1]||'application/octet-stream',m[2]?m[3]:btoa(unescape(decodeURIComponent(m[3]||''))));return}
  var p=b?Promise.resolve(b):w.fetch(href).then(function(r){return r.blob()});
  p.then(function(bl){return bl.arrayBuffer().then(function(buf){SokonAndroid.salvar(nome,bl.type||'application/octet-stream',base64(buf))})})
   .catch(function(e){SokonAndroid.erro(String(e))});
 }
 function ligar(w){
  try{
   if(!w||w.__ponteSokon)return;w.__ponteSokon=1;
   var mapa=w.__blobsSokon=new Map(),cria=w.URL.createObjectURL,revoga=w.URL.revokeObjectURL;
   w.URL.createObjectURL=function(o){var u=cria.call(w.URL,o);if(o instanceof w.Blob)mapa.set(u,o);return u};
   w.URL.revokeObjectURL=function(u){setTimeout(function(){mapa.delete(u)},60000);return revoga.call(w.URL,u)};
   var P=w.HTMLAnchorElement.prototype,orig=P.click;
   P.click=function(){if(this.download&&/^(blob:|data:)/.test(this.href)){salvar(this,w);return}return orig.apply(this,arguments)};
   w.document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[download]');
    if(a&&/^(blob:|data:)/.test(a.href)){e.preventDefault();e.stopPropagation();salvar(a,w)}},true);
   new w.MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){
    if(n.tagName==='IFRAME'){n.addEventListener('load',function(){ligar(n.contentWindow)});ligar(n.contentWindow)}})})}).observe(w.document.documentElement,{childList:true,subtree:true});
  }catch(e){}
 }
 ligar(window);
})();
