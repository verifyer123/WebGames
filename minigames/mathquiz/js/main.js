var game = null

function startGame(){
	game = new Phaser.Game("100", "100", Phaser.AUTO, null, {init:init, create: create }, false, true);	    

	function preloadScenes(sceneList){

    	function onCompletePreloading(){
    		sceneloader.show("yogomeIntro")

			function onLoadFile(event){
	    		var loaderScene = sceneloader.getScene("yogomeIntro")
	    		loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
	    	}

	    	function onCompleteSceneLoading(){
	    		sceneloader.show("instructionsScreen")
				//sceneloader.show("mathQuiz")
				//sceneloader.show("resultScreen")
				//sceneloader.show("creatPianoTiles")
	    	}

	      	sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})

    	}

    	sceneloader.preload([yogomeIntro], {onComplete: onCompletePreloading})
	}

    function init(){
    	game.stage.backgroundColor = "#FFFFFF"
    	game.time.advancedTiming = true
    	game.stage.disableVisibilityChange = true;

    	sceneloader.init(game)
    	sound.init(game)
    }

    function create(){

    	preloadScenes([
    		instructionsScreen,
    		mathQuiz,
    		resultScreen,
    		//creatPianoTiles,
    	])
    		    	
    }
}

window.onload = startGame