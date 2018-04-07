window.minigame = window.minigame || {}

function startCharSelector(){
	// var div = document.getElementById("characterSelector")
	// div.style.visibility = "visible"
	// div.style.opacity = 1
	window.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, null, {init: init, create: create }, true, true);
	// div.style.visibility = "hidden"

	function preloadScenes(sceneList){
		//$(".epic-loader").css("display", "show")

    	function onCompletePreloading(){

			function onLoadFile(event){
	    		var loaderScene = sceneloader.getScene("preloaderIntro")
	    		loaderScene.updateLoadingBar(event.totalLoaded, event.totalFiles)
	    	}

	    	function onCompleteSceneLoading(){
				//$(".epic-loader").css("display", "none")
				sceneloader.show("characterSelect")
	    	}

	      	sceneloader.preload(sceneList, {onLoadFile: onLoadFile, onComplete: onCompleteSceneLoading})
            sceneloader.show("preloaderIntro")
    	}

        // document.body.style.visibility = "visible"
    	sceneloader.preload([preloaderIntro], {onComplete: onCompletePreloading})
	}

    function init(){

        var fullWidth = 540
        var fullHeight = 960

        var ratio = window.innerWidth / window.innerHeight
        var gameHeight = Math.round(fullHeight)
        var gameWidth = Math.round(fullHeight * ratio)

        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
        game.scale.setGameSize(gameWidth, gameHeight); game.input.maxPointers = 1

        game.stage.backgroundColor = "#ffffff"
        game.time.advancedTiming = true
        game.stage.disableVisibilityChange = true;
        game.clearBeforeRender = false
		game.input.maxPointers = 1

		game.plugins.add(Fabrique.Plugins.Spine);
		game.kineticScrolling = game.plugins.add(Phaser.Plugin.KineticScrolling);

		this.game.kineticScrolling.configure({
			kineticMovement: true,
			// timeConstantScroll: 325, //really mimic iOS
			horizontalScroll: true,
			verticalScroll: false,
			horizontalWheel: false,
			// verticalWheel: true,
			deltaWheel: 40,
			// onUpdate: null
		});
		
		function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

		var language = getParameterByName("language")
		language = language ? language.toUpperCase() : "EN"
		console.log(language + ' language')
		
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

startCharSelector()