// Guarda o Sōkon FX no aparelho para abrir sem internet. Abre o que está guardado na hora e, com
// internet, baixa a versão nova por trás (vale na próxima vez que abrir).
const CACHE='sokonfx-v1',ARQUIVOS=['./','./index.html','./manifest.webmanifest','./icone-192.png','./icone-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQUIVOS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 e.respondWith(caches.open(CACHE).then(async c=>{
  const guardado=await c.match(e.request,{ignoreSearch:true});
  const rede=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>guardado);
  return guardado||rede;
 }));
});
