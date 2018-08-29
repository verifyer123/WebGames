var iMagicMain =  function(){
	var DEVICE_WIDTH = 540
	var DEVICE_HEIGHT = 960

	var gameFrame
	var gameContainer
	var charactersFrame

	var DEFAULT_SRC = "../minigames/epicMap/index.html?language=" + language
	var INTR0_TIME = 3000
	var BUTTON_DELAY = 1000

	var popAudio = new Audio('sounds/pop.mp3');
	var currentTimeout
	var delayTime = 0
	var currentSrc //= DEFAULT_SRC


	function loadGame(src){

		currentSrc = src
		// $(".game-canvas p").style.visibility = "hidden"
		// $("#sectionInfo").css("visibility", "hidden")
		//';ljxz  window.open(url, "_self")
		if (gameFrame) {
			gameContainer.removeChild(gameFrame);
			gameFrame = null
		}

		gameFrame = document.createElement("iframe")
		console.log(src)
		gameFrame.src = src //+ "&rand=" + Math.round(Math.random() * 10000000);
		gameFrame.style.borderStyle = "none"
		gameFrame.style.position = "absolute"
		gameFrame.style.top = "0"
		gameFrame.style.zIndex = "3"
		// gameFrame.scrolling = "yes"
		gameFrame.width = "100%"
		gameFrame.height = "100%"
		gameContainer.appendChild(gameFrame);

	}

//	$( window ).on( "orientationchange", function( event ) {
//		window.setTimeout(function () {
//			initSkin()
//			loadGame(currentSrc)
//		}, 500)
//
//	});


	gameContainer = document.getElementById("game-container")
	// epicModel.loadPlayer(loadGame)

	return{
		startGame:loadGame,
	}
}()



// window.addEventListener("resize", loadGame);