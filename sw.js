self.addEventListener("install", e => {
  console.log("sw instalado");
});
self.addEventListener("activate", e => {
  console.log("sw activado");
});
self.addEventListener("fetch", e => {
  console.log("sw fetc");
});
