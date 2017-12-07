var epicModel = function () {
	var player = {
		minigames:[],
		battles:[],
		cards:[],
		characters:[],
		yogotar:"Dinamita",
		currentPosition:0,
		currentMinigame:0,
		paidUser:true,
		version: 0.1
	}

	function loadPlayer (loadGame) {
		var minigames = epicYogomeGames.getGames()

		for(var mgIndex = 0; mgIndex < minigames.length; mgIndex++){
			var minigame = minigames[mgIndex]
			minigame.completed = false
			minigame.record = 0
			player.minigames.push(minigame)
		}

		var data = epicCharacters["yogotar" + player.yogotar]
		var card = {id: "yogotar" + player.yogotar, xp:0, data:data}
		player.cards.push(card)
		console.log("epicCharacters", card)

		// var characters = epicCharacters
		// for(var charIndex = 0; charIndex < epicCharacters.length; charIndex++ ){
		// 	var character = epicCharacters[charIndex]
		// 	character.captured = false
		// 	character.xp = 0
		// }
		console.log("players", player)
		if(loadGame)loadGame()
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
