var epicModel = function () {
	var player = {
		minigames:[],
		battles:[],
		cards:[],
		characters:[],
		yogotar:null,
		currentPosition:0,
		currentMinigame:0,
		paidUser:true,
		version: 0.1
	}

	function loadPlayer (loadGame, charSelector) {
		var minigames = epicYogomeGames.getGames()

		for(var mgIndex = 0; mgIndex < minigames.length; mgIndex++){
			var minigame = minigames[mgIndex]
			minigame.completed = false
			player.minigames.push(minigame)
		}

		// for(var battleIndex = 0; battleIndex < 50; battleIndex++){
		// 	player.battles.push(false)
		// }

		var data = epicCharacters["yogotar" + player.yogotar]
		var card = {id: "yogotar" + player.yogotar, xp:0, data:data}
		player.cards.push(card)
		// player.cards.push({id:"yogotarArthurius", xp:0, data:epicCharacters["yogotarArthurius"]})
		console.log("epicCharacters", card)

		// var characters = epicCharacters
		// for(var charIndex = 0; charIndex < epicCharacters.length; charIndex++ ){
		// 	var character = epicCharacters[charIndex]
		// 	character.captured = false
		// 	character.xp = 0
		// }
		console.log("players", player)
		if((loadGame)&&(player.yogotar))loadGame()
		else charSelector()
	}

	function savePlayer(currentPlayer) {
		player = currentPlayer
	}
	
	return{
		loadPlayer:loadPlayer,
		getPlayer:function(){return player},
		savePlayer:savePlayer
	}
}()
