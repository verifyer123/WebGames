window.minigame = window.minigame || {}

function startGame(){
	window.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.AUTO, null, {init: init, create: create }, true, true);
    document.body.style.visibility = "hidden"

	function preloadScenes(sceneList){

    	function onCompletePreloading(){

			function onLoadFile(event){
	    		var loaderScene = sceneloader.getScene("preloaderIntro")
	    		loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
	    	}

	    	function onCompleteSceneLoading(){
				sceneloader.show("flag")
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
		var actualGame="FlagRunner"

        var ratio = document.body.clientWidth / document.body.clientHeight
        var gameHeight = Math.round(fullHeight)
        var gameWidth = Math.round(fullHeight * ratio)

        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
        game.scale.setGameSize(gameWidth, gameHeight); game.input.maxPointers = 1

        game.stage.backgroundColor = "#ffffff"
        game.time.advancedTiming = true
        game.stage.disableVisibilityChange = true;        

        //game.plugins.add(Fabrique.Plugins.Spine);
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
		
		if(!parent.gameData){
			var games = yogomeGames.getObjectGames("custom");
			var gameName = games["Imagic"+actualGame];
			window.gameData=gameName;
			if(window.gameData.config.tutorial=="tutorialImagic"){
				localization.setLanguage("ES")
			}
		}else{
			if(parent.gameData.config.tutorial=="tutorialImagic"){
				localization.setLanguage("ES")
			}
		}

        window.minigame.game = window.game
    	sceneloader.init(game)
    	sound.init(game)
    }

    function create(){

    	preloadScenes([
            flag,
            result,
    	])
    }
}

minigame.orientation.init(startGame)