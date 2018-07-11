
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


	function getGames(pathTag){
		var urlSet
		if(pathTag === "absolute"){
			urlSet = yogoUrl
		}else if(pathTag === "custom")
			urlSet = ""
		else
			urlSet = relativeUrl

		var games = [

			{name:'Math Run',url:urlSet + 'mathRun/',mapUrl:urlMap + 'mathRun', sceneName:'mathRun',subject:'math',review:false,objective:20,demo:false,type:gameTypeEnum.COUNT},//1
			{name:'WildDentist',url:urlSet + 'wildDentist/',mapUrl:urlMap + 'wildDentist', sceneName:'wildDentist',subject:'health',review:false,objective:25,demo:false,type:gameTypeEnum.CHOOSE},//2
			{name:'SushiTowers',url:urlSet + 'sushiTowers/',mapUrl:urlMap + 'sushiTowers', sceneName:'sushiTowers',subject:'math',review:false,objective:25,demo:false,type:gameTypeEnum.MATCH},//3
		]

		for(var gIndex = 0; gIndex < games.length; gIndex++){
			var game = games[gIndex]
			var gameId = game.name.replace(/\s/g, "")
			games[gIndex].mapUrl = urlSet + urlMap + gameId
			games[gIndex].id = gameId
		}

		return games

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

		var gamesList = getGames()

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

		console.log('gameIndex sent ' + gameIndex)

		gameLives = lives || 1

		mixpanel.track(
			callName,
			{
				"minigame": gamesList[gameIndex].name,
				"subject": gamesList[gameIndex].subject,
				"app": "epicWeb",
				"isMap": hasMap,
				"email": email,
				"user_id": playerId
			}
		);
	}

	return{
		getGames:getGames,
		returnData:returnData,
		mixpanelCall:mixpanelCall,
		getObjectGames:getObjectGames
	}
		
}()