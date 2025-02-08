var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has("nombre") || !params.has("sala")) {
  window.location = "index.html";
  throw new Error("El nombre o sala son necesarios");
}

let usuario = {
  nombre: params.get("nombre"),
  sala: params.get("sala"),
};

socket.on("connect", function () {
  console.log("Conectado al servidor");

  socket.emit("entrarChat", usuario, function (resp) {
    console.log("Usuarios conectados", resp);
  });
});

// escuchar
socket.on("disconnect", function () {
  console.log("Perdimos conexión con el servidor");
});

// Enviar información
/* socket.emit(
  "enviarMensaje",
  {
    usuario: "Fernando",
    mensaje: "Hola Mundo",
  },
  function (resp) {
    console.log("respuesta server: ", resp);
  }
); */

// Escuchar información
socket.on("enviarMensaje", function (mensaje) {
  console.log("Servidor:", mensaje);
});

// Escuchar cambios de usuario (Entra o sale del chat) listaPersonas
socket.on("listaPersonas", function (personas) {
  console.log(personas);
});

// Mensaje privado

socket.on("mensajePrivado", function (mensaje) {
  console.log("mensaje Privado", mensaje);
});
