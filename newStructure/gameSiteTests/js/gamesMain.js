var gamesMain =  function(){
	var DEVICE_WIDTH = 540
	var DEVICE_HEIGHT = 960

	var gameFrame
	var gameContainer
	var charactersFrame

	var DEFAULT_SRC = "../pruebas/epicMap/index.html?language=" + language
	var INTR0_TIME = 3000
	var BUTTON_DELAY = 1000

	var popAudio = new Audio('sounds/pop.mp3');
	var currentTimeout
	var delayTime = 0
	var currentSrc //= DEFAULT_SRC


	function loadGame(src){

		currentSrc = src
		if (gameFrame) {
			gameContainer.removeChild(gameFrame);
			gameFrame = null
		}

		gameFrame = document.createElement("iframe")
		console.log(src)
		gameFrame.src = src 
		gameFrame.style.borderStyle = "none"
		gameFrame.style.position = "absolute"
		gameFrame.style.top = "0"
		gameFrame.style.zIndex = "3"
		gameFrame.width = "100%"
		gameFrame.height = "100%"
		gameContainer.appendChild(gameFrame);

	}

	gameContainer = document.getElementById("game-container")

	return{
		startGame:loadGame,
	}
}()



// window.addEventListener("resize", loadGame);