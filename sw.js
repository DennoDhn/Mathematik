/* MATHE HERO: GitHub-Pages-safe application shell, network-first on reconnection.
   Built-in URLs are relative to the Service Worker scope, so project subpaths work. */
const CACHE = "mathe-hero-offline-v12";
const ASSETS = [
 "./","./index.html","./styles.css",
 "./lessons.js","./math-engine.js","./curriculum.js","./additional-lessons.js",
 "./visuals.js","./tutorials.js","./app.js","./manifest.webmanifest","./icon.svg",
 "./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png"
];
self.addEventListener("install",event=>{
 event.waitUntil(
  caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())
 );
});
self.addEventListener("activate",event=>{
 event.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("mathe-hero-")&&k!==CACHE).map(k=>caches.delete(k))))
   .then(()=>self.clients.claim())
 );
});
self.addEventListener("fetch",event=>{
 const request=event.request;
 if(request.method!=="GET")return;
 const url=new URL(request.url);
 const scope=new URL("./",self.registration.scope);
 if(url.origin!==scope.origin || !url.pathname.startsWith(scope.pathname))return;
 const key=request.mode==="navigate"?"./index.html":request;
 event.respondWith((async()=>{
  try{
   const fresh=await fetch(request);
   if(fresh.ok){
    const copy=fresh.clone();
    event.waitUntil(caches.open(CACHE).then(cache=>cache.put(key,copy)).catch(()=>{}));
   }
   return fresh;
  }catch{
   const cached=await caches.match(key);
   return cached||Response.error();
  }
 })());
});
