window.minigame = window.minigame || {}
var completeLoading = false
var completeAnimation = false
var backgroundColor = 0xd1196d
initMixPanel(true)
function startGame(){
	window.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.CANVAS, null, {init: init, create: create, preload:preload }, false, true);
    //document.body.style.visibility = "hidden"
    window.game.nextTitleScene = "instructions"
	function preloadScenes(sceneList){

    	function onCompletePreloading(){

			function onLoadFile(event){
	    		var loaderScene = sceneloader.getScene("preloaderIntro")
	    		loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
	    	}

	    	function onCompleteSceneLoading(){
                completeLoading = true
                if(completeAnimation){
				    sceneloader.show("instructions")
                }
	    	}

	      	sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})
            sceneloader.show("preloaderIntro")
    	}

        document.body.style.visibility = "visible"
    	sceneloader.preload([preloaderIntro], {onComplete: onCompletePreloading})
	}

    function preload(){

        game.load.image("signo","images/splash/!.png")
        game.load.image("a","images/splash/a.png")
        game.load.image("by_g","images/splash/by_g.png")
        game.load.image("g","images/splash/g.png")
        game.load.image("i","images/splash/i.png")
        game.load.image("m","images/splash/m.png")
        game.load.image("n","images/splash/n.png")
        game.load.image("z","images/splash/z.png")
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

        game.stage.backgroundColor = "#d1196d"
        game.time.advancedTiming = true
        game.stage.disableVisibilityChange = true;        
        
        game.plugins.add(Fabrique.Plugins.Spine);
        //game.add.plugin(PhaserSpine.SpinePlugin);

        
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
            zoeMundial,
            result,
    	])
    }

}

minigame.orientation.init(startGame)
