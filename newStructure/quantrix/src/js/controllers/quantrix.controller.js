(function(){

  // variables globales

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

  var _activeMinigame;

  var _getRouteActive = function(){
    var hashRoute = _QUANTRIX.GAMES[window.location.href.split('#')[1]] ;
    if (hashRoute) {
      _minigameConfig.name = hashRoute;
    }
    else{
      _minigameConfig.name = _QUANTRIX.DEFAULT_GAME;
      _changeBrowserUrl(_QUANTRIX.DEFAULT_GAME);
    }
  }

  var _changeBrowserUrl = function(hashRoute){
    var route = window.location.href;
    window.location.href = route.split('#')[0] + "#" + hashRoute;
  }

  var _initMinigame = function(){
    _activeMinigame = new _QUANTRIX.Minigame(_minigameConfig);
    _activeMinigame.init();
  }

  var _deleteActiveMinigame = function(){}

  var init = function(){
    _getRouteActive();
    _initMinigame();
  }

  init();

})()
