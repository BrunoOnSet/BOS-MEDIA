const CACHE="bos-media-v2.13";
const ASSETS=["./","./index.html","./style.css?v=2.13","./app.js?v=2.13","./manifest.webmanifest","./icon-192.png","./icon-512.png","./logo-bruno-guillard.png","./assets/logo-bos-header.jpg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  if(e.request.mode==="navigate"||["document","style","script"].includes(e.request.destination)){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(net=>{const cp=net.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return net;})));
  }
});
