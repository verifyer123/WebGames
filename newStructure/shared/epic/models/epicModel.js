var epicModel = function () {
	var DEFAULT_CARD = {id:"yogotarEagle", xp:0, data:epicCharacters["yogotarEagle"]}

	var player = {
		minigames:{},
		battles:[],
		cards:[],
		yogotar:null,
		minigamesPlayed:0,
		currentPosition:0,
		currentMinigame:0,
		paidUser:false,
		powerCoins:0,
		level:1,
		version: 0.2
	}

	function initializePlayer() {
		var minigames = yogomeGames.getObjectGames()

		for(var key in minigames){
			if(!player.minigames[key]){
				player.minigames[key] = minigames[key]
				player.minigames[key].completed = false
				player.minigames[key].record = 0
			}
		}

	}

	// function callMixpanelLogin(subscribed){
	// 	var credentials = epicModel.getCredentials()
	// 	mixpanel.track(
	// 		"onLoginSuccess",
	// 		{"user_id": credentials.educationID,
	// 			"subscribed":subscribed}
	// 	);
	// 	mixpanel.people.increment("loginCount");
	// 	// console.log("loginMixpanel", subscribed)
	// }
	
	function updateData() {
		var playerData = loginModal.getChildData()
		player = playerData.gameData || player
		// console.log(credentials.gameData, "Game DATA")
		initializePlayer()
		console.log("updateData")

		if((typeof epicSiteMain !== "undefined") && (typeof epicSiteMain.updatePlayerInfo === "function")){
			epicSiteMain.updatePlayerInfo()
		}

	}


	function loadPlayer (forceLogin, callback, checkAge) {
		// var credentials = getCredentials()
		var onLogin = function () {
			updateData()
			callback()
		}
		loginModal.showLogin(true, true, onLogin)

	}

	function savePlayer(currentPlayer, forceLogin, loginTag) {
		player = currentPlayer
		loginModal.saveChild(player)
	}


	return{
		loadPlayer:loadPlayer,
		getPlayer:function(){return player},
		savePlayer:savePlayer,
	}
}()

/*
parent(email, pwd) return (
 */
