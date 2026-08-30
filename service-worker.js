const CACHE="punya-yatra-v4";
const BASE=new URL("./",self.registration.scope).pathname;
const local=path=>new URL(path,self.registration.scope).pathname;
const CORE=[
  BASE,
  local("offline.html"),
  local("favicon.ico"),
  local("favicon.png"),
  local("assets/images/icon-192.png"),
  local("assets/images/icon-512.png"),
  local("assets/images/punya-yatra-logo.png"),
  local("manifest.webmanifest"),
  local("assets/css/exquisite.css"),
  local("assets/css/premium.css"),
  local("assets/css/pages.css"),
  local("assets/css/enhancements.css"),
  local("assets/js/includes.js"),
  local("assets/js/page-show.js")
];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;

  if(event.request.mode==="navigate"){
    event.respondWith(fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request,copy));
      return response;
    }).catch(()=>caches.match(event.request).then(hit=>hit||caches.match(local("offline.html")))));
    return;
  }

  event.respondWith(caches.match(event.request).then(cached=>{
    const network=fetch(event.request).then(response=>{
      if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
      return response;
    }).catch(()=>cached);
    return cached||network;
  }));
});
