window.minigame = window.minigame || {}
//window.onerror = function(){
//	location.reload()
//}

function startGame(){
	window.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.CANVAS, null, {init: init, create: create }, true, true);
    document.body.style.visibility = "hidden"
   
	function preloadScenes(sceneList){

    	function onCompletePreloading(){

			function onLoadFile(event){
                
	    		var loaderScene = sceneloader.getScene("preloaderIntro")
	    		loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
	    	}

	    	function onCompleteSceneLoading(){
					sceneloader.show("battle")
	    	}

	      	sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})
            sceneloader.show("preloaderIntro")
    	}

        document.body.style.visibility = "visible"
    	sceneloader.preload([preloaderIntro], {onComplete: onCompletePreloading})
	}

    function init(){

        var fullWidth = 1024
        var fullHeight = 768

        var ratio = document.body.clientWidth / document.body.clientHeight
        var gameHeight = Math.round(fullHeight)
        var gameWidth = Math.round(fullHeight * ratio)

        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
        game.scale.setGameSize(gameWidth, gameHeight)

        game.stage.backgroundColor = "#ffffff"
        game.time.advancedTiming = true
        game.stage.disableVisibilityChange = true;
        
        


        // game.plugins.add(Fabrique.Plugins.Spine);
        game.plugins.add(PhaserSpine.SpinePlugin);

        // var language = "EN"
        // if(window.location.search){
        //     var params = window.location.search.trim(1)
        //     var regex = /language=(..)/i
        //     var result = regex.exec(params)
        //     if(result){
        //         language = result[result.index].toUpperCase()
        //     }else{
        //         language = "EN"
        //     }
        //
        // }

		localization.setLanguage(parent.language)

		var charactersSet = []
		var allCharacters = epicCharacters
		for(var pIndex = 0; pIndex < epicCharacters.length; pIndex++){
			var character = epicCharacters[pIndex]
			character.index = pIndex
			epicCharacters[character.id] = character
		}

		var players = parent.epicModel || epicModel
		var currentPlayer = players.getPlayer()
		var mainCharName = allCharacters["yogotar" + currentPlayer.yogotar]
		console.log(mainCharName)
		charactersSet.push(mainCharName)
		// allCharacters = epicCharacters.slice()
		// allCharacters = Phaser.ArrayUtils.shuffle(allCharacters)
		var charIndex = game.rnd.integerInRange(0, allCharacters.length - 1)
		charactersSet.push(allCharacters[charIndex])

		console.log(charactersSet)
		battle.setCharacters(charactersSet)
		vs.setCharacters(charactersSet)
		battle.setBackground()
		charactersEntity.preloadCards(battle, [{id:"toxicEarth1", xp:0}], [])

        window.minigame.game = window.game
    	sceneloader.init(game)
    	sound.init(game)
    }

    function create(){
		console.log("createEpicBattle")
    	preloadScenes([
           // preloaderIntro,
    		battle,
			vs,
            //result,
    	])
    }
}

startGame()

