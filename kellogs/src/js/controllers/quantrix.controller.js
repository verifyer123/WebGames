
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
        route : _QUANTRIX.DEFAULT_GAMES_ROUTE,
        name : _QUANTRIX.DEFAULT_GAME,
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

    _QUANTRIX._activeRoute;

    _QUANTRIX._minigamesLength = 0;

    // FUNCIONES GLOBALES DE LA APLICACIÓN
    _QUANTRIX._getNextMinigame = function(gameRoute){
        var currentIndex = _QUANTRIX.GAMES[_QUANTRIX._activeRoute].index,
        nextIndex = currentIndex + 1 <= _QUANTRIX._minigamesLength ? currentIndex + 1 : -1;
        return nextIndex;
    }

    _QUANTRIX._initMinigame = function(gameRoute){
        // _replaceInLocalstorage(response.token);
        if (!gameRoute) {
            _activeMinigame = new _QUANTRIX.Minigame(_minigameConfig);
            _activeMinigame.init();
        }
        else{
            var gamesAvailable = new _QUANTRIX.GameAvailable({
                data : {
                    "child_id" : 66,
                    "token" : _QUANTRIX.Storage.getInLocalstorage(_QUANTRIX.LOCALSTORAGE.TOKEN),
                },
                onSuccess : function(response){
                    var nextIndex = _QUANTRIX.GAMES[gameRoute].index;
                    for (var key in _QUANTRIX.GAMES) {
                        for (var ney in response.minigames){
                            // score en variable global
                            if (_QUANTRIX.GAMES[key].index == response.minigames[ney].minigame_id ) {
                                _QUANTRIX.GAMES[key].score = response.minigames[ney].score;
                            }
                            // minigame activo
                            if (response.minigames[ney].minigame_id == nextIndex) {
                                _minigameConfig.name = _QUANTRIX.GAMES[gameRoute].url;
                                _activeMinigame = new _QUANTRIX.Minigame(_minigameConfig);
                                _activeMinigame.init();
                                _QUANTRIX._activeRoute = gameRoute;
                                _changeBrowserUrl(gameRoute);
                            }
                        }
                    }
                },
                onError : function(){
                    console.log('ERROR_____');
                    var response = {
                        "zucaritas" : {
                            index : 1,
                            score : 20
                        },
                        "frostyRun" : {
                            index : 2,
                            score : 10
                        },
                        "cerealBuffet" : {
                            index : 3,
                            score : 30
                        },
                        "hoverRide" : {
                            index : 4,
                            score : 50
                        },
                        "melvinTravel" : {
                            index : 5,
                            score : 40
                        },
                        "loopRoll" : {
                            index : 6,
                            score : 40
                        },
                        "frooTemple" : {
                            index : 7,
                            score : 40
                        },
                        "frootMath" : {
                            index : 8,
                            score : 40
                        }
                    }
                    var nextIndex = _QUANTRIX.GAMES[gameRoute].index;
                    for(var key in response){
                        if (response[key].index == nextIndex) {
                            _QUANTRIX.GAMES[gameRoute].score = response[key].score;
                            _minigameConfig.name = _QUANTRIX.GAMES[gameRoute].url;
                            _activeMinigame = new _QUANTRIX.Minigame(_minigameConfig);
                            _activeMinigame.init();
                            _QUANTRIX._activeRoute = gameRoute;
                            _changeBrowserUrl(gameRoute);
                        }
                        else{
                            // _activeMinigame = new _QUANTRIX.Minigame(_minigameConfig);
                            // _activeMinigame.showError("no disponible");
                            console.log("no disponible");
                        }
                    }
                }
                // onError : _QUANTRIX._goDashboard
            });
        }
    }

    _QUANTRIX._nextMinigame = function(){
        var currentIndex = _QUANTRIX.GAMES[_QUANTRIX._activeRoute].index,
        nextIndex = currentIndex + 1;
        for (var key in _QUANTRIX.GAMES) {
            if (_QUANTRIX.GAMES[key].index == nextIndex) {
                _QUANTRIX._initMinigame(key);
            }
        }
    }

    // _QUANTRIX._gotoMinigame = function(){
    //   var currentIndex = _QUANTRIX.GAMES[_QUANTRIX._activeRoute].index,
    //   nextIndex = currentIndex + 1;
    //   for (var key in _QUANTRIX.GAMES) {
    //     if (_QUANTRIX.GAMES[key].index == nextIndex) {
    //       _QUANTRIX._initMinigame(key);
    //     }
    //   }
    // }

    _QUANTRIX._notifyMinigamePlayed = function(response){
        // console.log("NOTIFY_____");
        // console.log(response);
        _QUANTRIX.Storage.replaceInLocalstorage(parent._QUANTRIX.LOCALSTORAGE.TOKEN, response.token);
    }

    _QUANTRIX._goDashboard = function(){
        // window.location.href =
        console.log('saliendo al Dashboard');
    }

    // FUNCIONES LOCALES DEL CONTROLADOR

    var _initRouteListeners = function(){
        window.addEventListener("hashchange", function(e){
            _assignRouteActive();
            _QUANTRIX._initMinigame(_QUANTRIX._activeRoute);
        }, false);
    }

    /**
    * Obtiene la ruta del minigame activo o en su caso, asigna la Ruta
    * por defecto. No devuelve la ruta sino que se la asigna a la variable
    * de configuracion _minigameConfig
    */

    var _assignRouteActive = function(){
        var hashRoute;
        _QUANTRIX._activeRoute = window.location.href.split('#')[1]
        hashRoute = _QUANTRIX.GAMES[_QUANTRIX._activeRoute];
        if (hashRoute) {
            _minigameConfig.name = hashRoute.url;
        }
        else{
            _QUANTRIX._activeRoute = _QUANTRIX.DEFAULT_GAME;
            _minigameConfig.name = _QUANTRIX.GAMES[_QUANTRIX.DEFAULT_GAME].url;
            _changeBrowserUrl(_QUANTRIX.DEFAULT_GAME);
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
        for (var key in _QUANTRIX.GAMES) {
            _QUANTRIX._minigamesLength++;
        }
        var login = new parent._QUANTRIX.Login({
	        onSuccess : function(response){
                response.child_id = parseInt(response.child_id);
                console.log('EXITO LOGIN');
                //borrar con el login
                parent._QUANTRIX.Storage.replaceInLocalstorage(parent._QUANTRIX.LOCALSTORAGE.TOKEN, response.token);
                parent._QUANTRIX.Storage.replaceInLocalstorage(parent._QUANTRIX.LOCALSTORAGE.CHILD_ID, response.child_id);
                //borrar con el login
	          	_QUANTRIX._initMinigame(_QUANTRIX._activeRoute);
	        }
      	});

    }
    init();

})()
