window.minigame = window.minigame || {}
initMixPanel(false)
function startGame(){
	window.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.CANVAS, null, {init: init, create: create }, false, true);
    document.body.style.visibility = "hidden"

	function preloadScenes(sceneList){

    	function onCompletePreloading(){

			function onLoadFile(event){
	    		var loaderScene = sceneloader.getScene("preloaderIntro")
	    		loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
	    	}

	    	function onCompleteSceneLoading(){
				sceneloader.show("instructions")
	    	}

	      	sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})
            sceneloader.show("preloaderIntro")
    	}

        document.body.style.visibility = "visible"
    	sceneloader.preload([preloaderIntro], {onComplete: onCompletePreloading})
	}
	
    function init(){

        var fullWidth = 540
        var fullHeight = 960

        var ratio = document.body.clientWidth / document.body.clientHeight
        var gameHeight = Math.round(fullHeight)
        var gameWidth = Math.round(fullHeight * ratio)

        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
        game.scale.setGameSize(gameWidth, gameHeight)
		amazing.checkBrowser(game)

        game.stage.backgroundColor = "#ffffff"
        game.time.advancedTiming = true
        game.stage.disableVisibilityChange = true;        
        
        game.plugins.add(Fabrique.Plugins.Spine);
        //game.add.plugin(PhaserSpine.SpinePlugin);
        var fontStyle = {font: "36px Baloo", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var textTest = new Phaser.Text(game, 0, 0, "0", fontStyle)
        textTest.visible = false
        
        amazing.getInfo()
        amazing.setMinigameId()
        amazing.setProfile()
        amazing.savePlaycount();
        
        window.minigame.game = window.game
        
    	sceneloader.init(game)
    	sound.init(game)
    }

    function create(){
        
    	preloadScenes([
            instructions,
            dotBlocks,
            result,
    	])
    }
}

minigame.orientation.init(startGame)
