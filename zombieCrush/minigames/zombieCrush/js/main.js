var game = null

function startGame(){
    
    var screenBody = document.body
    screenBody.style.opacity = 0;
    
	game = new Phaser.Game(document.body.clientWidth, document.body.clientWidth, Phaser.AUTO, null, {init: init, create: create }, false, true);	    

	function preloadScenes(sceneList){

    	function onCompletePreloading(){
    		sceneloader.show("yogomeIntro")

			function onLoadFile(event){
	    		var loaderScene = sceneloader.getScene("yogomeIntro")
	    		loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
	    	}

	    	function onCompleteSceneLoading(){
	    		//sceneloader.show("instructionsScreen")
				//sceneloader.show("mathQuiz")
				//sceneloader.show("resultScreen")
				sceneloader.show("instructions")
	    	}

	      	sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})

    	}

    	sceneloader.preload([yogomeIntro], {onComplete: onCompletePreloading})
	}

    function init(){
        var fullWidth = 540
        var fullHeight = 960

        var ratio = document.body.clientWidth / document.body.clientHeight
        var gameHeight = Math.round(fullHeight)
        var gameWidth = Math.round(fullHeight * ratio)

        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
        game.scale.setGameSize(gameWidth, gameHeight)

        game.stage.backgroundColor = "#FFFFFF"
        game.time.advancedTiming = true
        game.stage.disableVisibilityChange = true;        

    	sceneloader.init(game)

        /*var language
        if(parent.window.location.search){
            var params = parent.window.location.search.trim(1)
            var regex = /language=(..)/i
            var result = regex.exec(params)
            if(result){
                language = result[result.index].toUpperCase()    
            }else{
                language = "EN"
            }
            language = "ES"
            
        }

        localization.setLanguage(language)
    	sound.init(game)*/
    }

    function create(){
        
        var screenBody = document.body
        screenBody.style.opacity = 1;
        
    	preloadScenes([
            instructions,
            mainGame,
            result,
    	])
    		    	
    }
}

window.onload = startGame