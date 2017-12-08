window.minigame = window.minigame || {}

function startCharSelector(){
	var div = document.getElementById("characterSelector")
	window.game = new Phaser.Game(div.clientWidth, div.clientHeight, Phaser.canvas, "characterSelector", {init: init, create: create }, true, true);
	// div.style.visibility = "hidden"

	function preloadScenes(sceneList){

    	function onCompletePreloading(){

			function onLoadFile(event){
	    		var loaderScene = sceneloader.getScene("preloaderIntro")
	    		loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
	    	}

	    	function onCompleteSceneLoading(){
				sceneloader.show("characterSelect")
	    	}

	      	sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})
            // sceneloader.show("preloaderIntro")
    	}

        // document.body.style.visibility = "visible"
    	sceneloader.preload([preloaderIntro], {onComplete: onCompletePreloading})
	}

    function init(){

        var fullWidth = 540
        var fullHeight = 960

        var ratio = div.clientWidth / div.clientHeight
        var gameHeight = Math.round(fullHeight)
        var gameWidth = Math.round(fullHeight * ratio)

        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
        game.scale.setGameSize(gameWidth, gameHeight)

        game.stage.backgroundColor = "#ffffff"
        game.time.advancedTiming = true
        game.stage.disableVisibilityChange = true;
        game.clearBeforeRender = false

		game.plugins.add(Fabrique.Plugins.Spine);
        
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
    }

    function create(){

    	preloadScenes([
            characterSelect,
    	])
    }
}

// startCharSelector()