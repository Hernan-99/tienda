const apiProd = (function () {
  // servicio de API REST lista productos contra mockapi.io
  const getURL = id => {
    return (
      "https://619c174868ebaa001753c77d.mockapi.io/Alimentos/" + (id || "")
    ); // si el id esta lo agrego y sino no
  };

  /*GET*/
  const get = async () => {
    try {
      let productos = await $.ajax({ url: getURL() });
      return productos;
    } catch (error) {
      console.error("Error GET", error);
      return [];
    }
  };

  /*POST*/
  const post = async prod => {
    try {
      return await $.ajax({
        url: getURL(),
        method: "post",
        data: prod,
      });
    } catch (error) {
      console.error("Error POST", error);
      return {};
    }
  };

  /*PUT*/
  const put = async (prod, id) => {
    try {
      return await $.ajax({
        url: getURL(id),
        method: "put",
        data: prod,
      });
    } catch (error) {
      console.error("Error put", error);
      return {};
    }
  };

  /*DELETE*/
  const del = async id => {
    try {
      return await $.ajax({
        url: getURL(id),
        method: "delete",
      });
    } catch (error) {
      console.error("Error delete", error);
      return {};
    }
  };

  /*DELETE ALL*/

  const delAll = async () => {
    const progress = document.querySelector("progress");
    progress.style.display = "block";

    let porcentaje = 0;

    //calculo del porcentaje de la barra de borrado
    for (let i = 0; i < listaProductos.length; i++) {
      porcentaje = parseInt((i * 1000) / listaProductos.length);
      console.log(porcentaje);
      progress.value = porcentaje; //alimentamos la barra de porcentaje

      const id = listaProductos[i].id;
      try {
        await del(id);
      } catch (error) {
        console.error("Error en el Delete all en id", id, error);
      }
    }
    //cuando el porcentaje se completa
    porcentaje = 100;
    console.log(porcentaje);
    progress.value = porcentaje;

    //despues de 2 segundos ocultamos la barra
    setTimeout(() => {
      progress.style.display = "none";
    }, 2000);
  };

  console.warn("libreria instalada");

  // PUBLICACION
  return {
    get: () => get(),
    post: productos => post(productos),
    put: (productos, id) => put(productos, id),
    del: id => del(id),
    delAll: () => delAll(),
  };
})();
