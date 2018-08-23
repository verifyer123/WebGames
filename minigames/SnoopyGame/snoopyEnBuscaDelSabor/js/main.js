window.minigame = window.minigame || {}
var completeLoading = false
var completeAnimation = false
var backgroundColor = 0xad0209

function mixPanelTrack(minigameName,event,didWin,score){
    //console.log(minigameName)
    var userMail = null
    var gender = null
    var interests = null
    var birthday = null
    var userName = null

    if(event=="finishGame"){
        mixpanel.track(
            event,
            {"gameName": minigameName,"win":didWin, "numberOfObjects":score,"name":userName,"email":userMail,"gender":gender,"birthday":birthday,"interests":interests}
        );
    }
    else{
        mixpanel.track(
            event,
            {"gameName": minigameName,"name":userName,"email":userMail,"gender":gender,"birthday":birthday,"interests":interests}
        );
    }

    console.log("Enter to setMixPanelTrack")

    var params = {
       type: "analyticsMessage",
       data: {
           event: event,
           gameName: minigameName
       }
   }
    parent.postMessage(JSON.stringify(params), "*")
    
}

function startGame(){
    localStorage.removeItem("tutorial")
	window.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.CANVAS, null, {init: init, preload:preload, create: create }, false, true);
    document.body.style.visibility = "hidden"
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

        game.load.image("signo","../shared/images/splash/!.png")
        game.load.image("a","../shared/images/splash/a.png")
        game.load.image("by_g","../shared/images/splash/by_g.png")
        game.load.image("g","../shared/images/splash/g.png")
        game.load.image("i","../shared/images/splash/i.png")
        game.load.image("m","../shared/images/splash/m.png")
        game.load.image("n","../shared/images/splash/n.png")
        game.load.image("z","../shared/images/splash/z.png")

    }
	
    function init(){

        var fullWidth = 540
        var fullHeight = 960

        var ratio = document.body.clientWidth / document.body.clientHeight
        var gameHeight = Math.round(fullHeight)
        var gameWidth = Math.round(fullHeight * ratio)

        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
        game.scale.setGameSize(gameWidth, gameHeight)

        game.stage.backgroundColor = "#ad0209"
        game.time.advancedTiming = true
        game.stage.disableVisibilityChange = true;        
        
        game.plugins.add(Fabrique.Plugins.Spine);
        //game.add.plugin(PhaserSpine.SpinePlugin);
        
        window.minigame.game = window.game
        
    	sceneloader.init(game)
    	sound.init(game)
    }

    function create(){
        
    	preloadScenes([
            instructions,
            snoopyEnBuscaDelSabor,
            result,
    	])
    }
}

minigame.orientation.init(startGame)
