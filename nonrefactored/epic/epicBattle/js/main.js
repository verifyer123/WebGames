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
					sceneloader.show("vs")
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
		var allCharacters = []
		for(var key in epicCharacters){
			var character = epicCharacters[key]
			allCharacters.push(character)
		}

		var players = parent.epicModel || epicModel
		// if(typeof parent.epicModel == "undefined")
		//TODO uncomment this on dev
		// players.loadPlayer()

		var currentPlayer = players.getPlayer()
		var cards = currentPlayer.cards
		var mainCharName = epicCharacters["yogotar" + currentPlayer.yogotar]
		console.log(mainCharName)
		// charactersSet.push(mainCharName)

		var battleIndex = parent.env ? (parent.env.battleIndex ? parent.env.battleIndex : 0) : 0
		var enemyCards = currentPlayer.battles[battleIndex] || battleService.getOpponents(1)
		currentPlayer.battles[battleIndex] = enemyCards

		//TODO: change when card Selector is ready
		var selectedCard = cards[0]
		var selectedCards = [selectedCard]
		charactersSet = selectedCards.concat(enemyCards)
		// var charIndex = game.rnd.integerInRange(0, allCharacters.length - 1)

		// charactersSet.push(allCharacters[charIndex])

		//TODO: change charactersSet to player and enemy cards for both battle and versus
		console.log(charactersSet)
		vs.setCharacters(charactersSet)
		battle.setCharacters(charactersSet)
		battle.setBackground()
		charactersEntity.preloadCards(vs, charactersSet)

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

