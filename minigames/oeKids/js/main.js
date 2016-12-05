window.minigame = window.minigame || {}

function startGame(){
	window.game = new Phaser.Game(document.body.clientHeight, document.body.clientWidth, Phaser.AUTO, null, {init: init, create: create }, false, true);
    document.body.style.visibility = "hidden"

	function preloadScenes(sceneList){

    	function onCompletePreloading(){

			function onLoadFile(event){
	    		var loaderScene = sceneloader.getScene("preloaderIntro")
	    		loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
	    	}

	    	function onCompleteSceneLoading(){
				sceneloader.show("oeKids")
	    	}

	      	sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})
            sceneloader.show("preloaderIntro")
    	}

        document.body.style.visibility = "visible"
    	sceneloader.preload([preloaderIntro], {onComplete: onCompletePreloading})
	}

    function init(){

        var fullWidth = 960
        var fullHeight = 540

        var ratio = document.body.clientHeight / document.body.clientWidth
        var gameHeight = Math.round(fullHeight)
        var gameWidth = Math.round(fullHeight * ratio)
        gameWidth = fullWidth

        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
        game.scale.setGameSize(gameWidth, gameHeight)

        game.stage.backgroundColor = "#ffffff"
        game.time.advancedTiming = true
        game.stage.disableVisibilityChange = true;        

        game.plugins.add(Fabrique.Plugins.Spine);

        window.minigame.game = window.game
    	sceneloader.init(game)
    	sound.init(game)
    }

    function create(){

    	preloadScenes([
            instructions,
            oeKids,
            result,
    	])
    }
}

minigame.orientation.init(startGame)