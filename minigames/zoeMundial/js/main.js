window.minigame = window.minigame || {}
var completeLoading = false
var completeAnimation = false
function startGame(){
	window.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.CANVAS, null, {init: init, create: create, preload:preload }, false, true);
    //document.body.style.visibility = "hidden"
    
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

        amazing.savePlaycount();
        amazing.getInfo()
        amazing.setMinigameId()
        amazing.setProfile()
        
        window.minigame.game = window.game
        
    	sceneloader.init(game)
    	sound.init(game)
    }

    function create(){

        /*
        var a = game.add.sprite(game.world.centerX-142,game.world.centerY,"a")
        a.anchor.setTo(0.5)
        a.scale.setTo(0.2)
        var m = game.add.sprite(game.world.centerX-89,game.world.centerY,"m")
        m.anchor.setTo(0.5)
        m.scale.setTo(0.2)
        var a2 = game.add.sprite(game.world.centerX-37,game.world.centerY,"a")
        a2.anchor.setTo(0.5)
        a2.scale.setTo(0.2)
        var z = game.add.sprite(game.world.centerX+4,game.world.centerY,"z")
        z.anchor.setTo(0.5)
        z.scale.setTo(0.2)
        var i = game.add.sprite(game.world.centerX+33,game.world.centerY,"i")
        i.anchor.setTo(0.5)
        i.scale.setTo(0.2)
        var n = game.add.sprite(game.world.centerX+63,game.world.centerY,"n")
        n.anchor.setTo(0.5)
        n.scale.setTo(0.2)
        var g = game.add.sprite(game.world.centerX+105,game.world.centerY,"g")
        g.anchor.setTo(0.5)
        g.scale.setTo(0.2)
        var signo = game.add.sprite(game.world.centerX+141,game.world.centerY,"signo")
        signo.anchor.setTo(0.5)
        signo.scale.setTo(0.2)
        var getIn = game.add.sprite(game.world.centerX+43,game.world.centerY+35,"by_g")
        getIn.anchor.setTo(0.5)
        getIn.scale.setTo(0.2)

        var mask = game.add.graphics(game.world.centerX,game.world.centerY)
        mask.beginFill(0xffffff)
        mask.drawRect(-175,-50,340,100)
        mask.endFill()

        a.mask = mask
        m.mask = mask
        a2.mask = mask
        z.mask = mask
        i.mask = mask
        n.mask = mask
        g.mask = mask
        //signo.mask = mask

        a.y -=100
        m.y -=100
        a2.y -=100
        z.y -=100
        i.y -=100
        n.y -=100
        g.y -=100
        signo.x = game.world.width + 50

        var maskGetIn = game.add.graphics(game.world.centerX+43,game.world.centerY+35)
        maskGetIn.beginFill(0xd1196d)
        maskGetIn.drawRect(-50,-15,100,30)
        maskGetIn.endFill()
        //maskGetIn.scale.setTo(1,1)

        //getIn.mask = maskGetIn

        game.add.tween(a).to({y:game.world.centerY},150,Phaser.Easing.linear,true)
        game.add.tween(m).to({y:game.world.centerY},150,Phaser.Easing.linear,true,150)
        game.add.tween(a2).to({y:game.world.centerY},150,Phaser.Easing.linear,true,300)
        game.add.tween(z).to({y:game.world.centerY},150,Phaser.Easing.linear,true,450)
        game.add.tween(i).to({y:game.world.centerY},150,Phaser.Easing.linear,true,600)
        game.add.tween(n).to({y:game.world.centerY},150,Phaser.Easing.linear,true,750)
        game.add.tween(g).to({y:game.world.centerY},150,Phaser.Easing.linear,true,900)

        game.add.tween(maskGetIn.scale).to({x:0},300,Phaser.Easing.linear,true,900)

        var t1 =game.add.tween(signo).to({x:game.world.centerX+141},200,Phaser.Easing.linear,true,1200)
        t1.onComplete.add(function(){
            game.add.tween(signo).to({angle:-10},50,Phaser.Easing.linear,true).onComplete.add(function(){
                game.add.tween(signo).to({angle:10},100,Phaser.Easing.linear,true).onComplete.add(function(){
                    game.add.tween(signo).to({angle:-10},100,Phaser.Easing.linear,true).onComplete.add(function(){
                        game.add.tween(signo).to({angle:0},50,Phaser.Easing.linear,true).onComplete.add(completeSplash)
                    })
                })
            })
        })*/

        


        
    	preloadScenes([
            instructions,
            zoeMundial,
            result,
    	])
    }

    /*function completeSplash(){
        setTimeout(function(){
            game.stage.backgroundColor = "#ffffff"
            preloadScenes([
                instructions,
                zoeMundial,
                result,
            ])
        },1000)
    }*/
}

minigame.orientation.init(startGame)
