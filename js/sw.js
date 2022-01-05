self.addEventListener("install", e => {
  console.log("sw instalado");
});
self.addEventListener("activate", e => {
  console.log("sw activado");
});
self.addEventListener("fetch", e => {
  // console.log("sw fetc");

  if (0) {
    // anula la operacion del sw

    // let url = e.request;
    // let method = e.request;

    // let { url, method } = e.request; //simplificacion1
    let { url: ruta, method: metodo } = e.request; //simplificacion2
    console.log(metodo, ruta);
    console.warn("es un css", ruta.includes(".css") ? "si" : "no");
    console.log("");

    if (0) {
      //anula la operacion de operacion fallida
      if (ruta.includes("estilos.css")) {
        // let respuesta = null;
        let respuesta = new Response(
          `
        .mdl-layout {
          min-width: 360px;
        }
        .w-10 {
          width: 10%;
        }
        .w-20 {
          width: 20%;
        }
        .w-30 {
          width: 30%;
        }
        .w-40 {
          width: 40%;
        }
        
        .w-50 {
          width: 50%;
        }
        .w-60 {
          width: 60%;
        }
        
        .w-70 {
          width: 70%;
        }
        .w-80 {
          width: 80%;
        }
        .w-90 {
          width: 90%;
        }
        .w-100 {
          width: 100%;
        }
        
        .ml-icon {
          margin-left: 20px;
        }
        .contenedor {
          padding: 20px;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
        
        .contenedor_header_img img {
          width: 100%;
          min-width: 360px;
          /* max-width: 900px; */
          display: block;
          margin-right: 0;
          margin-left: 0;
        }
        `,
          { headers: { "content-type": "text/css" } }
        );
        e.respondWith(respuesta);
      }
    } else {
      // let respuesta = fetch(e.request);
      // let respuesta = fetch(e.request.url);
      let respuesta = fetch(ruta);
      e.respondWith(respuesta);
    }
  }
});
