var gameTypeEnum = {
	CHOOSE:0,
	COUNT:1,
	GRAB:2,
	MATCH:3,
	SEQUENCE:4,
	TARGET:5,
	TRACE:6,
	TAP:7,
};

var yogomeGames = function () {
	var gameLives = 0
	var timeCount = 0
	var addingTime = true
	var yogoUrl = 'epicweb/minigames/'
	var urlMap = '#/minigames/'
	var relativeUrl = "../"

	var configFiles = [
		"iMagicGames",
		"optimizedGames",
		"onGoingGames",
		"aprendeGames",
        "michoMauGames",
        "pruebaGames",
	]
	


	function getGames(pathTag){
		var urlSet
		if(pathTag === "absolute"){
			urlSet = yogoUrl
		}else if(pathTag === "custom")
			urlSet = ""
		else
			urlSet = relativeUrl
		var allGames = []
		for(var confIndex = 0; confIndex < configFiles.length; confIndex++)
		{
			var configName = configFiles[confIndex]
			if(parent[configName]) {
                
				var configFile = parent[configName]
				var games = configFile.minigames
				for (var gIndex = 0; gIndex < games.length; gIndex++) {
					var game = games[gIndex]
					var gameId = game.name.replace(/\s/g, "")
					game.id = gameId
					game.config = configFile.config
					game.url = urlSet + game.url
					game.mapUrl = urlMap + game.mapUrl
					game.mapUrl = urlSet + urlMap + gameId
				}
				allGames = allGames.concat(games)
			}else if(window[configName]){
				var configFile = window[configName]
				var games = configFile.minigames
				for (var gIndex = 0; gIndex < games.length; gIndex++) {
					var game = games[gIndex]
					var gameId = game.name.replace(/\s/g, "")
					game.id = gameId
					game.config = configFile.config
					game.url = urlSet + game.url
					game.mapUrl = urlMap + game.mapUrl
					game.mapUrl = urlSet + urlMap + gameId
				}
				allGames = allGames.concat(games)
			}
		}

		return allGames

	}
	
	function getObjectGames(path) {
		var object = {}

		var games = getGames(path)

		for(var gIndex = 0; gIndex < games.length; gIndex++){
			var game = games[gIndex]
			var gameId = game.name.replace(/\s/g, "")
			game.id = gameId
			object[gameId] = game
		}
		return object
	}

	function addTime(){
		timeCount++
		if(addingTime){
			setTimeout(addTime,1000)
		}
	}

	function returnData(){

		addingTime = false
		return {timeReady:timeCount,lives:gameLives}
	}

	function mixpanelCall(callName,gameIndex,lives,childata) {

		//var gamesList = getGames()

		var email = "noEmail"
		var playerId = "noPlayerId"
		var hasMap = false

		if (childata) {

			email = childata.parentMail
			playerId = childata.remoteId
			if (childata.isMap) {
				hasMap = true
			}
		}

		timeCount = 0
		addingTime = true
		addTime()

//		console.log('gameIndex sent ' + gameIndex)

		gameLives = lives || 1

	}

	return{
		getGames:getGames,
		returnData:returnData,
		mixpanelCall:mixpanelCall,
		getObjectGames:getObjectGames
	}
		
}()