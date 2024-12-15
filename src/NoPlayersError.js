class NoPlayersError extends Error {
    constructor(message = "No se han agregado jugadores. Por favor, añada al menos un jugador antes de comenzar.") {
      super(message);
      this.name = "NoPlayersError";
    }
  }
  
  export default NoPlayersError;