
window.onload =  function(){
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

	function loadCharSelector() {
		// var home = document.getElementById("home")
		// var miObjeto = $("#home");
		// TweenMax.to(miObjeto,1,{opacity:0,onComplete:NextFunction});
		// function NextFunction(){
		// 	miObjeto.hide();
		// }
		// miObjeto.show()
	}

	gameContainer = document.getElementById("game-container")
	epicModel.loadPlayer(loadGame, loadCharSelector)
}

// window.addEventListener("resize", loadGame);