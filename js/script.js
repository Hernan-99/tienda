/*------------------------------------------------*/
/*---------------VARIABLES GLOBALES---------------*/
/*------------------------------------------------*/
const btnAgregar = document.getElementById("agregar");
const btnBorrar = document.getElementById("borrar");
const inputIngresar = document.getElementById("ingresar");
let listaProductos = [
  { nombre: "Carne", cantidad: 2, precio: 200 },
  { nombre: "Fideos", cantidad: 3, precio: 110.45 },
  { nombre: "Manteca", cantidad: 1, precio: 80 },
  { nombre: "Harina", cantidad: 2, precio: 93.5 },
];

let crearLista = true;
let ul;

/*------------------------------------------------*/
/*---------------FUNCIONES GLOBALES---------------*/
/*------------------------------------------------*/

function borrarProducto(index) {
  console.log("hola", index);
  listaProductos.splice(index, 1);
  renderLista();
}

const cambiarValor = (tipo, index, el) => {
  const valor = el.value;
  //ternario para que lo pase a number si es precio o a parseInt si es cantidad
  tipo === "precio" ? Number(valor) : parseInt(valor);
  console.log(cambiarValor, tipo, index, valor);
  listaProductos[index][tipo] = valor;
  // console.dir(el);
};

const renderLista = () => {
  if (crearLista) {
    ul = document.createElement("ul");
    ul.classList.add("demo-list-icon", "mdl-list", "w-100");
  }
  ul.innerHTML = "";
  listaProductos.forEach((producto, index) => {
    console.log(producto, index);
    ul.innerHTML += `
<!-- LISTA -->
            <li class="mdl-list__item">
            <!-- ICONO DEL PRODUCTO -->
              <span class="mdl-list__item-primary-content w-10">
              <i class="material-icons mdl-list__item-icon"
                  >local_grocery_store</i
                  >
                  </span>
                  
                  <!-- NOMBRE DEL PRODUCTO -->
                  <span class="mdl-list__item-primary-content w-30"> ${producto.nombre} </span>
                  
                  <!-- CANTIDAD DEL PRODUCTO -->
                  <span class="mdl-list__item-primary-content w-20">
                  <!-- Textfield with Floating Label -->
                <div
                class="
                mdl-textfield mdl-js-textfield
                mdl-textfield--floating-label
                "
                >
                <input onchange="cambiarValor('cantidad', ${index},this)"
                class="mdl-textfield__input"
                type="text"
                value="${producto.cantidad}"
                id="cantidad-${index}"
                />
                <label class="mdl-textfield__label" for="cantidad-${index}"
                >Cantidad</label
                >
                </div>
                </span>
                
                <!-- PRECIO DEL PRODUCTO -->
                <span class="mdl-list__item-primary-content w-20 ml-icon">
                <!-- Textfield with Floating Label -->
                <div
                class="
                mdl-textfield mdl-js-textfield
                mdl-textfield--floating-label
                "
                >
                <input onchange="cambiarValor('precio', ${index}, this)" value="$ ${producto.precio}" class="mdl-textfield__input" type="text" id="precio-${index}" />
                <label class="mdl-textfield__label" for="precio-${index}"
                    >Precio($)</label
                    >
                    </div>
                    </span>
                    <!-- ACCION(boton para borrar producto) -->
              <span class="mdl-list__item-primary-content w-20 ml-icon">
              <!-- Colored FAB button with ripple -->
              <button
              onclick="borrarProducto(${index})"
                  class="
                  mdl-button mdl-js-button
                    mdl-button--fab
                    mdl-js-ripple-effect
                    mdl-button--colored
                  "
                  >
                  <i class="material-icons">remove_shopping_cart</i>
                  </button>
              </span>
              </li>`;
  });
  if (crearLista) {
    document.getElementById("lista").appendChild(ul);
  } else {
    componentHandler.upgradeElements(ul);
  }
  crearLista = false;
};

const eventosAgregarBorrar = () => {
  // ingreso del nuevo producto
  btnAgregar.addEventListener("click", () => {
    const producto = inputIngresar.value;

    if (producto) {
      listaProductos.push({ nombre: producto, cantidad: 1, precio: 0 });
      renderLista(); //actualizo la lista para que aparesca el nuevo producto
      inputIngresar.value = "";
    }
  });

  // ingreso del nuevo producto
  btnBorrar.addEventListener("click", () => {
    if (confirm("¿Desea borrar todos los productos?")) {
      listaProductos = [];
      renderLista();
    }
  });
};

const registrarSw = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      console.log("load");
      this.navigator.serviceWorker
        .register("/sw.js")
        .then(reg => {
          console.log("el service worker se registro correctamente", reg);
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

const start = () => {
  console.log(document.querySelector("title").textContent);
  renderLista();
  eventosAgregarBorrar();
  registrarSw();
};

/*------------------------------------------------*/
/*-------------------EJECUCION--------------------*/
/*------------------------------------------------*/
start();
// window.onload = start;
