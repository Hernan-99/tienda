const CACHE_STATIC_NAME = "static-v01";
const CACHE_INMUTABLE_NAME = "inmutable-v01";
const CACHE_DYNAMIC_NAME = "dynamic-v01";
self.addEventListener("install", e => {
  console.log("sw instalado");

  /*ABRO ESPACIO PARA EL CACHE */
  const cacheStatic = caches.open(CACHE_STATIC_NAME).then(cache => {
    console.log(cache);

    /*Guardando todos los recursos estaticos (sin num de version) 
    en la app shell (recursos necesarios para que la AWP funcione offline) */
    return cache.addAll([
      "/index.html",
      "/css/estilos.css",
      "/js/script.js",
      "/js/api.js",
      "/plantilla_lista.hbs",
      "/images/supermercado.jpg",
    ]);
  });

  const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then(cache => {
    console.log(cache);

    /*Guardando todos los recursos estaticos (con num de version)
     en la app shell (recursos necesarios para que la AWP funcione offline) */
    return cache.addAll([
      "/js/handlebars.min-v4.7.7.js",
      "https://code.getmdl.io/1.3.0/material.min.js",
      "https://code.jquery.com/jquery-3.6.0.min.js",
      "https://code.getmdl.io/1.3.0/material.indigo-pink.min.css",
    ]);
  });
  // e.waitUntil(Promise.all([cache])); este metodo sirve para que el sw se instale luego de que se cumplan las promesas
  e.waitUntil(cacheStatic, cacheInmutable);
});

self.addEventListener("activate", e => {
  console.log("sw activado");
});
self.addEventListener("fetch", e => {
  console.log("sw fetch");
  // let { url, method } = e.request; //destructuring objet
  // console.log(method, url);
});
