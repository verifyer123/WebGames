
var epicSiteMain =  function(){
	var gameFrame
	var gameContainer

	var DEFAULT_SRC = "../epicMap/index.html?language=" + language

	function loadGame(src){
		var home = document.getElementById("home")
		home.style.visibility = "visible"
		home.style.opacity = 0

		TweenMax.to(home,1,{opacity:1,onComplete:NextFunction});
		function NextFunction(){
			var characterSelector = document.getElementById("characterSelector")
			characterSelector.style.visibility = "hidden"
			// window.open(url, "_self")
			if(gameFrame)
				gameContainer.removeChild(gameFrame);
			else
				gameFrame = document.createElement("iframe")
			gameFrame.src= src || DEFAULT_SRC
			gameFrame.style.borderStyle = "none"
			gameFrame.scrolling = "no"
			gameFrame.width = "100%"
			gameFrame.height = "100%"
			gameContainer.appendChild(gameFrame);
		}
	}

	function checkPlayer(src){
		// src = src || "#/map"
		// console.log(src)
		var currentPlayer = epicModel.getPlayer()
		if(!currentPlayer.yogotar){
			window.open("#/yogotarselector", "_self")
		}else loadGame(src)

	}

	function main(){
		epicModel.loadPlayer()
	}

	function charSelected(yogotar, url){
		url = "#/map"
		var currentPlayer = epicModel.getPlayer()
		currentPlayer.yogotar = yogotar
		var data = epicCharacters["yogotar" + currentPlayer.yogotar]
		var card = {id: "yogotar" + currentPlayer.yogotar, xp:0, data:data}
		currentPlayer.cards.push(card)
		epicModel.savePlayer(currentPlayer)
		window.open(url, "_self")

	}

	// function loadCharSelector() {
	// 	// var home = document.getElementById("home")
	// 	// home.style.visibility = "hidden"
	// 	startCharSelector()
	// }

	gameContainer = document.getElementById("game-container")
	// epicModel.loadPlayer(loadGame)

	return{
		charSelected:charSelected,
		startGame:main,
		loadGame:loadGame,
		checkPlayer:checkPlayer
	}
}()

// window.addEventListener("resize", loadGame);