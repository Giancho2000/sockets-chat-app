class Usuarios {
  constructor() {
    this.personas = [];
  }

  agregarPersona(id, nombre, sala) {
    let persona = { id, nombre, sala };

    this.personas.push(persona);

    return this.personas;
  }

  buscarPersona(id) {
    let persona = this.personas.filter((p) => p.id === id)[0];

    return persona;
  }

  getPersonas() {
    return this.personas;
  }

  getPersonasPorSala(sala) {
    const personasEnSala = this.personas.filter(
      (persona) => persona.sala === sala
    );

    return personasEnSala;
  }

  borrarPersona(id) {
    let personaEliminada = this.buscarPersona(id);
    this.personas = this.personas.filter((p) => p.id != id);

    return personaEliminada;
  }
}

module.exports = {
  Usuarios,
};
