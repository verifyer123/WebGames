var gameFrame

function loadGame(){
	if(gameFrame)
		gameContainer.removeChild(gameFrame);
	else
		gameFrame = document.createElement("iframe")
	gameFrame.src= amazing.config.minigameUrl
	gameFrame.style.borderStyle = "none"
	gameFrame.scrolling = "no"
	gameFrame.width = window.innerWidth
	gameFrame.height = window.innerHeight
	gameContainer.appendChild(gameFrame);
}

window.onload =  function(){
	gameContainer = document.getElementById("game-container")
	epicModel.loadPlayer(loadGame)
}

// window.addEventListener("resize", loadGame);