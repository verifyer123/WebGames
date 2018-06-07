
/**
 * Controlador principal.
 * Administra la inicialización de los minigames obteniendo los parámetros
 * de la url y llamando a los servicios necesarios para validar el token de
 * sesión.
 */

(function(){

	//VARIABLES LOCALES DEL CONTROLADOR

	/**
	 * Configuración inicial para crear un minigame.
	 */

	var _minigameConfig = {
		route : APP.DEFAULT_GAMES_ROUTE,
		name : APP.DEFAULT_GAME,
		container : "#game-container",
		content : "iframe",
		propertyUrl : "src",
		width : '100%',
		height : '100%',
		token : true
	}

	/**
	 * Objeto con el minigame activo
	 */

	var _activeMinigame;

	/**
	 * Url con id del minigame activo.
	 * e.g. smoothie-loops
	 */

	// VARIABLES GLOBALES DE LA APLICACIÓN

	APP._activeRoute;

	APP._minigamesLength = 0;

	// FUNCIONES GLOBALES DE LA APLICACIÓN
	APP._getNextMinigame = function(gameRoute){
		var currentIndex = APP.GAMES[APP._activeRoute].index,
			nextIndex = currentIndex + 1 <= APP._minigamesLength ? currentIndex + 1 : -1;
		return nextIndex;
	}

	APP._initMinigame = function(gameRoute){
		// _replaceInLocalstorage(response.token);
		if (!gameRoute) {
			_activeMinigame = new APP.Minigame(_minigameConfig);
			_activeMinigame.init();
		}
		else{
			var nextIndex = APP.GAMES[gameRoute].index;
			for (var key in APP.GAMES) {
				//for (var ney in response.minigames){
					// score en variable global
					//if (APP.GAMES[key].index == response.minigames[ney].minigame_id ) {
					APP.GAMES[key].score = 0//response.minigames[ney].score;
					//}
					// minigame activo
					//if (response.minigames[ney].minigame_id == nextIndex) {
					_minigameConfig.name = APP.GAMES[gameRoute].url;
					_activeMinigame = new APP.Minigame(_minigameConfig);
					_activeMinigame.init();
					APP._activeRoute = gameRoute;
					_changeBrowserUrl(gameRoute);
					//}
				//}
			}
		}
	}

	APP._nextMinigame = function(){
		var currentIndex = APP.GAMES[APP._activeRoute].index,
			nextIndex = currentIndex + 1;
		for (var key in APP.GAMES) {
			if (APP.GAMES[key].index == nextIndex) {
				APP._initMinigame(key);
			}
		}
	}

	// APP._gotoMinigame = function(){
	//   var currentIndex = APP.GAMES[APP._activeRoute].index,
	//   nextIndex = currentIndex + 1;
	//   for (var key in APP.GAMES) {
	//     if (APP.GAMES[key].index == nextIndex) {
	//       APP._initMinigame(key);
	//     }
	//   }
	// }

	APP._notifyMinigamePlayed = function(response){
		// console.log("NOTIFY_____");
		// console.log(response);
		APP.Storage.replaceInLocalstorage(parent.APP.LOCALSTORAGE.TOKEN, response.token);
	}

	APP._goDashboard = function(){
		// window.location.href =
		console.log('saliendo al Dashboard');
	}

	// FUNCIONES LOCALES DEL CONTROLADOR

	var _initRouteListeners = function(){
		window.addEventListener("hashchange", function(e){
			_assignRouteActive();
			APP._initMinigame(APP._activeRoute);
		}, false);
	}

	/**
	 * Obtiene la ruta del minigame activo o en su caso, asigna la Ruta
	 * por defecto. No devuelve la ruta sino que se la asigna a la variable
	 * de configuracion _minigameConfig
	 */

	var _assignRouteActive = function(){
		var hashRoute;
		APP._activeRoute = window.location.href.split('#')[1]
		hashRoute = APP.GAMES[APP._activeRoute];
		if (hashRoute) {
			_minigameConfig.name = hashRoute.url;
		}
		else{
			APP._activeRoute = APP.DEFAULT_GAME;
			_minigameConfig.name = APP.GAMES[APP.DEFAULT_GAME].url;
			_changeBrowserUrl(APP.DEFAULT_GAME);
		}
	}

	var _changeBrowserUrl = function(hashRoute){
		var route = window.location.href;
		window.location.href = route.split('#')[0] + "#" + hashRoute;
	}

	var _deleteActiveMinigame = function(){}

	var init = function(){
		_initRouteListeners();
		_assignRouteActive();
		for (var key in APP.GAMES) {
			APP._minigamesLength++;
		}
		APP._initMinigame(APP._activeRoute);

	}
	init();

})()
