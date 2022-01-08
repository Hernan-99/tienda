const CACHE_STATIC_NAME = "static-v0.1";
const CACHE_INMUTABLE_NAME = "inmutable-v0.1";
const CACHE_DYNAMIC_NAME = "dynamic-v0.1";

self.addEventListener("install", e => {
  console.log("sw instalado");

  //skip waiting automatico
  self.skipWaiting();

  /*ABRO ESPACIO PARA EL CACHE */
  const cacheStatic = caches.open(CACHE_STATIC_NAME).then(cache => {
    // console.log(cache);

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
    // console.log(cache);

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
  e.waitUntil(Promise.all[(cacheStatic, cacheInmutable)]);
});

self.addEventListener("activate", e => {
  console.log("sw activado!!");

  //borramos los caches desactualizados y los actualizamos
  const cacheWhiteList = [
    CACHE_STATIC_NAME,
    CACHE_INMUTABLE_NAME,
    CACHE_DYNAMIC_NAME,
  ];

  //borramos los caches desactualizados
  e.waitUntil(
    caches.keys().then(keys => {
      // console.log(keys);

      return Promise.all(
        keys.map(key => {
          console.log(key);

          if (!cacheWhiteList.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", e => {
  // console.log("sw fetch");
  let { url, method } = e.request; //destructuring objet
  // console.log(method, url);

  if (method == "GET" && !url.includes("mockapi.io")) {
    const respuesta = caches.match(e.request).then(rta => {
      if (rta) {
        // console.log("Existe el recurso en alguno de los cache", url);
        return rta;
      }
      // console.error("No existe el recurso en ninguno de los cache", url);
      return fetch(e.request).then(nuevaRta => {
        caches.open(CACHE_DYNAMIC_NAME).then(cache => {
          cache.put(e.request, nuevaRta);
        });
        return nuevaRta.clone();
      });
    });
    e.respondWith(respuesta);
  } else {
    // console.warn("BYPASS", method, url);
  }
});
