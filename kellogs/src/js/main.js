var APP = {
  /**
   * Versión del proyecto.
   */
  VERSION : "0.1.0",
  /**
   * Nombre de las variables en el localstorage
   */
  LOCALSTORAGE : {
    TOKEN : "token",
    CHILD_ID : "child_id",
  },
  /**
   * Links absolutos de los endpoints.
   */
  SERVICES : {
    // inicia sesion
    LOGIN : "",
    // envia un token y el record que obtuvo
    GAME_PLAYED : "",
    // obtiene los juegos disponibles
    GAME_AVAILABLE : "",
    GAME_FINISHED : ""
  },
  /**
   * Ruta en la que busca los minigames para la carpeta src.
   */
  DEFAULT_GAMES_ROUTE : "../minigames/",
  /**
   * Ruta en la que busca los minigames para la carpeta dist.
   */
  DEFAULT_GAMES_ROUTE_DIST : "minigames/",
  /**
   * Minigame que se carga porr defecto o si la ruta es introducida mal.
   */
  DEFAULT_GAME : "PowerJump",
  /**
   * Minigames.
   */
  GAMES : {
    /**
     * Url que se usará para entrar al minigame.
     */
    "PowerJump" : {
      /**
       * Carpeta dentro del directorio DEFAULT_GAMES_ROUTE que contiene
       * al minigame.
       */
      url : "zucaritas/",
      /**
       * Indice del minigame.
       */
      index : 1
    },
    "FrostyRun" : {
      url : "frostyRun/",
      index : 2
    },
    "CerealBuffet" : {
      url : "cerealBuffet/",
      index : 3
    },
    "HoverRide" : {
      url : "hoverRide/",
      index : 4
    },
    "MelvinTravel" : {
      url : "melvinTravel/",
      index : 5
    },
    "LoopRoll" : {
      url : "loopRoll/",
      index : 6
    },
    "FrooTemple" : {
      url : "frooTemple/",
      index : 7
    },
    "FrootMath" : {
      url : "frootMath/",
      index : 8
    },
    "DrumsAndFroots" : {
      url : "drumsAndFroots/",
      index : 9
    },
    "FrootusPoocus" : {
      url : "frootusPoocus/",
      index : 10
    },
  }
}
