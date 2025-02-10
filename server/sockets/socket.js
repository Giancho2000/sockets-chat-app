const { io } = require("../server");
const { Usuarios } = require("../classes/usuarios");
const { crearMensaje } = require("../utils/utils");

const usuarios = new Usuarios();

io.on("connection", (client) => {
  client.on("entrarChat", (data, callback) => {
    if (!data.nombre || !data.sala) {
      return callback({
        error: true,
        mensaje: "El nombre/Sala es necesario",
      });
    }

    client.join(data.sala);

    usuarios.agregarPersona(client.id, data.nombre, data.sala);

    client.broadcast
      .to(data.sala)
      .emit("listaPersonas", usuarios.getPersonasPorSala(data.sala));

    client.broadcast
      .to(data.sala)
      .emit(
        "notificarSalida",
        crearMensaje("Administrador", `${data} se unio al chat`)
      );

    callback(usuarios.getPersonasPorSala(data.sala));
  });

  client.on("enviarMensaje", (data, callback) => {
    let persona = usuarios.buscarPersona(client.id);
    let mensaje = crearMensaje(persona.nombre, data.mensaje);

    client.broadcast.to(persona.sala).emit("enviarMensaje", mensaje);

    callback(mensaje);
  });

  client.on("disconnect", () => {
    let personaEliminada = usuarios.borrarPersona(client.id);

    client.broadcast
      .to(personaEliminada.sala)
      .emit(
        "notificarSalida",
        crearMensaje("Administrador", `${personaEliminada} Salio del chat`)
      );

    client.broadcast
      .to(personaEliminada.sala)
      .emit(
        "listaPersonas",
        usuarios.getPersonasPorSala(personaEliminada.sala)
      );
  });

  //Mensajes Privados
  client.on("mensajePrivado", (data) => {
    const persona = usuarios.buscarPersona(client.id);

    client.broadcast
      .to(data.para)
      .emit("mensajePrivado", crearMensaje(persona.nombre, data.mensaje));
  });
});
