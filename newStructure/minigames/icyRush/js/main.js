window.minigame = window.minigame || {}

function startGame(){
	window.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.canvas, null, {init: init, create: create }, false, true);
    document.body.style.visibility = "hidden"

	function preloadScenes(sceneList){

    	function onCompletePreloading(){

			function onLoadFile(event){
	    		var loaderScene = sceneloader.getScene("preloaderIntro")
	    		loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
	    	}

	    	function onCompleteSceneLoading(){
				sceneloader.show("icyRush")
	    	}

	      	sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})
            sceneloader.show("preloaderIntro")
    	}

        document.body.style.visibility = "visible"
    	sceneloader.preload([preloaderIntro], {onComplete: onCompletePreloading})
	}

    function init(){

        document.getElementsByTagName('canvas').id = 'canvas';
        var fullWidth = 540
        var fullHeight = 960

        var ratio = document.body.clientWidth / document.body.clientHeight
        var gameHeight = Math.round(fullHeight)
        var gameWidth = Math.round(fullHeight * ratio)

        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
        game.scale.setGameSize(gameWidth, gameHeight)

        game.stage.backgroundColor = "#ffffff"
        game.time.advancedTiming = true
        game.stage.disableVisibilityChange = true;        

        game.plugins.add(PhaserSpine.SpinePlugin);
        
        var language = "EN"
        if(window.location.search){
            var params = window.location.search.trim(1)
            var regex = /language=(..)/i
            var result = regex.exec(params)
            if(result){
                language = result[result.index].toUpperCase()    
            }else{
                language = "EN"
            }
            
        }

        localization.setLanguage(language)

        window.minigame.game = window.game
    	sceneloader.init(game)
    	sound.init(game)
        epicparticles.init(game)
    }

    function create(){

    	preloadScenes([
            icyRush,
            result,
    	])
    }
}

minigame.orientation.init(startGame)