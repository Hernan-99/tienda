/*------------------------------------------------*/
/*---------------VARIABLES GLOBALES---------------*/
/*------------------------------------------------*/
const btnAgregar = $("#agregar"); // selector con jquery
const btnBorrar = $("#borrar"); // selector con jquery
const inputIngresar = $("#ingresar"); // selector con jquery
const dialog = $("dialog")[0]; // selector con jquery sin # porque estamos seleccionando la etiqueta y no el id

let listaProductos = [
  // { nombre: "Carne", cantidad: 2, precio: 200 },
  // { nombre: "Fideos", cantidad: 3, precio: 110.45 },
  // { nombre: "Manteca", cantidad: 1, precio: 80 },
  // { nombre: "Harina", cantidad: 2, precio: 93.5 },
];

/*------------------------------------------------*/
/*---------------FUNCIONES GLOBALES---------------*/
/*------------------------------------------------*/

/*-------------------------------------------*/
/*----------MANEJO DEL LOCALSTORAGE----------*/
/*-------------------------------------------*/
const guardarListaProductos = lista => {
  let productos = JSON.stringify(lista);
  localStorage.setItem("LISTA", productos);
};

const leerListaProductos = () => {
  let lista = [];
  let productos = localStorage.getItem("LISTA");
  if (productos) {
    try {
      lista = JSON.parse(productos);
    } catch {
      lista = [];
      guardarListaProductos(lista);
    }
  }
  return lista;
};
/*-------------------------------------------*/

async function borrarProducto(id) {
  console.log("hola", id);
  // listaProductos.splice(id, 1);
  try {
    await apiProd.del(id);
    renderLista();
  } catch (error) {
    console.error("Error en borrado de producto con id", id);
  }
}

const cambiarValor = async (tipo, id, el) => {
  const valor = el.value;

  //calculo el index del producto desde el id
  const index = listaProductos.findIndex(prod => prod.id == id);
  //ternario para que lo pase a number si es precio o a parseInt si es cantidad
  tipo === "precio" ? Number(valor) : parseInt(valor);
  console.log(cambiarValor, tipo, id, index, valor);

  // console.dir(el);
  listaProductos[index][tipo] = valor;
  guardarListaProductos(listaProductos);

  //Actualiza el producto en el backend
  const prod = listaProductos[index];
  try {
    await apiProd.put(prod, id);
  } catch (error) {
    console.error(`Error en actualizacion de ${tipo} del producto`, error);
  }
};

const renderLista = async () => {
  try {
    //leer la plantilla handlebars desde un archivo externo
    // ---con fetch---
    // const datos = await fetch("../plantilla_lista.hbs");
    // const plantilla = await datos.json();// esto nos da un error porque la plantilla no es un json
    // const plantilla = await datos.text();
    // console.log(typeof plantilla, plantilla);

    // ---con ajax de jquery---
    const plantilla = await $.ajax({
      url: "../plantilla_lista.hbs",
      method: "get",
    });

    /*COMPILAMOS LA PLANTILLA HANDLEBARS */
    var template = Handlebars.compile(plantilla);

    /*OBTENGO LA LISTA DE PRODUCTOS DE LA WEB*/
    listaProductos = await apiProd.get();

    /*ALMACENO LA LISTA OBTENIDA EN EL LOCALSTORAGE*/
    guardarListaProductos(listaProductos);
    // A TRAVES DE FUNCION TEMPLATE OBTENEMOS LA INTEGRACION DE LOS DATOS CON LA PLANTILLA
    // $("#lista").html(template({ listaProductos: listaProductos }));
    $("#lista").html(template({ listaProductos: listaProductos })); //simplifico

    const ul = $("#contenedorLista");
    // componentHandler.upgradeElements(ul);
    componentHandler.upgradeElements(ul);
  } catch (error) {
    console.error("error en handlebars", error);
  }
};

const eventosAgregarBorrar = () => {
  // ingreso del nuevo producto
  btnAgregar.click(async () => {
    //jquery
    const nombre = inputIngresar.val(); //jquery

    if (nombre) {
      // listaProductos.push({ nombre: producto, cantidad: 1, precio: 0 });

      try {
        const producto = { nombre: nombre, cantidad: 1, precio: 0 };
        await apiProd.post(producto);
        renderLista(); //actualizo la lista para que aparesca el nuevo producto
        inputIngresar.val("");
      } catch (error) {
        console.error("Error entrada producto", error);
      }
    }
  });

  // borrdo del nuevo producto
  btnBorrar.click(() => {
    //jquery
    if (listaProductos.length) {
      dialog.showModal();
    }
    // if (confirm("¿Desea borrar todos los productos?")) {
    //   listaProductos = [];
    //   renderLista();
    // }
  });
};

// funcion mostrar ventana modal
const mostrarModal = () => {
  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }

  //Aceptamos el borrado de todos los productos
  $("dialog .aceptar").click(async () => {
    // listaProductos = [];
    dialog.close();
    await apiProd.delAll();
    renderLista();
  });

  $("dialog .cancelar").click(() => {
    dialog.close();
  });
};

const registrarSw = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      // console.log("load");
      this.navigator.serviceWorker
        .register("./sw.js")
        .then(reg => {
          // console.log("el service worker se registro correctamente", reg);

          /*aca vamos a hacer un skipwaiting automatico escuchando el cambio de estado
        del SW para luego reiniciarlo */

          //evento que detecta cambios del sw
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            installingWorker.onstatechange = () => {
              console.warn("SW----->", installingWorker.state);
              if (installingWorker.state == "activated") {
                console.log("REINICIANDO...");

                //reinicio la pagina a los 2 segundos
                setTimeout(() => {
                  console.log("Ok");
                  location.reload();
                }, 2000);
              }
            };
          };
        })
        .catch(err => {
          console.error(
            "el service woeker no esta disponible en navigator",
            err
          );
        });
    });
  } else {
    console.error("sw no esta disponible en navigator");
  }
};

const handlebarsTest = () => {
  // compile the template
  // var template = Handlebars.compile("Handlebars <b>{{doesWhat}}</b>");
  // // execute the compiled template and print the output to the console
  // console.log(template({ doesWhat: "rocks!" }));
};

// const testCache = () => {
//   if (window.caches) {
//     console.log("el browser soporta caches");

//     /*CREANDO ESPACIOS EN CACHE*/
//     caches.open("cache-1");
//     caches.open("cache-2");
//     caches.open("cache-3");

//     /*CHECKEADNO SI UN CACHE EXISTE*/
//     caches.has("cache-2").then(rta => console.log(rta));

//     /*BORRANDO UN CACHE*/
//     caches.delete("cache-2").then(rta => console.log(rta));

//     /*LISTANDO LOS CACHES*/
//     caches.keys().then(rta => console.log(rta));

//     /*-------------------------------------------*/
//     /*ABRIENDO UN NUEVO CACHE Y TRABAJANDO CON EL*/
//     /*-------------------------------------------*/
//     caches.open("cache-v1.1").then(cache => {
//       console.log(cache);

//       /*AGREGANDO UN RECURSO AL CACHE*/
//       // cache.add("./index.html");

//       /*AGREGANDO VARIOS RECURSOS AL CACHE*/
//       cache
//         .addAll([
//           "./index.html",
//           "./css/estilos.css",
//           "./images/supermercado.jpg",
//         ])
//         .then(() => {
//           console.log("Recursos agregados");

//           /*BORRANDO UN RECURSO DEL CACHE*/
//           cache.delete("/css/estilos.css");

//           /*VERIFICANDO SI UN RECURSO EXISTE EN EL CACHE*/

//           cache.match("/index.html").then(rta => {
//             if (rta) {
//               console.log("recurso encontrado");
//             } else {
//               console.log("recurso no encontrado");
//             }
//           });

//           /*CREO O MODIFICO EL CONTENIDO DE UN RECURSO DEL CACHE*/
//           cache.put("/index.html", new Response("Hola mundo"));

//           /*LISTO TODOS LOS RECURSOS QUE TIENE ESTE CACHE*/
//           cache
//             .keys()
//             .then(recursos => console.log("recursos de cahce", recursos));

//           cache.keys().then(recursos => {
//             recursos.forEach(recurso => {
//               console.log(recurso.url);
//             });

//             /*LISTO TODOS LOS NOMBRES DE LOS ESPACIOS DE CACHE EN CACHES (CacheStorage)*/
//             caches
//               .keys()
//               .then(nombres => console.log("nombres de caches", nombres));
//           });
//         });
//     });
//   } else {
//     console.log("el browser no soporta caches");
//   }
// };

const start = () => {
  // console.log(document.querySelector("title").textContent);
  registrarSw();
  eventosAgregarBorrar();
  mostrarModal();
  // handlebarsTest();
  // testCache();
  // console.log(leerListaProductos());
  renderLista();
};

/*------------------------------------------------*/
/*-------------------EJECUCION--------------------*/
/*------------------------------------------------*/
start();
// window.onload = start;
