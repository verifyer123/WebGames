
var epicSiteMain =  function(){
	var gameFrame

	function loadGame(){
		if(gameFrame)
			gameContainer.removeChild(gameFrame);
		else
			gameFrame = document.createElement("iframe")
		gameFrame.src= amazing.config.minigameUrl
		gameFrame.style.borderStyle = "none"
		gameFrame.scrolling = "no"
		gameFrame.width = "100%"
		gameFrame.height = "100%"
		gameContainer.appendChild(gameFrame);

		var characterSelector = document.getElementById("characterSelector")
		characterSelector.style.visibility = "hidden"
	}

	function charSelected(yogotar){
		var currentPlayer = epicModel.getPlayer()
		currentPlayer.yogotar = yogotar
		epicModel.savePlayer(currentPlayer)

		var home = document.getElementById("home")
		home.style.visibility = "visible"
		home.style.opacity = 0

		TweenMax.to(home,1,{opacity:1,onComplete:NextFunction});
		function NextFunction(){
			epicModel.loadPlayer(loadGame)
		}

	}

	// function loadCharSelector() {
	// 	// var home = document.getElementById("home")
	// 	// home.style.visibility = "hidden"
	// 	startCharSelector()
	// }

	gameContainer = document.getElementById("game-container")
	epicModel.loadPlayer(loadGame)

	return{
		charSelected:charSelected
	}
}()

// window.addEventListener("resize", loadGame);