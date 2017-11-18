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
}

window.onload =  function(){
	gameContainer = document.getElementById("game-container")
	epicModel.loadPlayer(loadGame)
}

// window.addEventListener("resize", loadGame);