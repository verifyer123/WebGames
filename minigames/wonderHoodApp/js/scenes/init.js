var soundsPath = "../../shared/minigames/sounds/"
var initScene = function(){

	var assets = {
		atlases: [
            {   
                name: "atlas.init",
                json: "images/init/atlas.json",
                image: "images/init/atlas.png",
            },
        ],
        images: [
            {
                name:"pasto",
                file:"images/init/pasto.png"
            },
            {
                name:"arbusto",
                file:"images/init/arbustos.png"
            },
            {
                name:"mountain",
                file:"images/init/mountain.png"
            },

        ],
        sounds: [
            {   name: "magic",
                file: soundsPath + "magic.mp3"},
            {   name: "wrong",
                file: soundsPath + "wrong.mp3"},
            {   name: "pop",
                file: soundsPath + "pop.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "punch",
                file: soundsPath + "punch1.mp3"},  
        ],
	}

	var sceneGroup
	var button

	function loadSounds(){
        sound.decode(assets.sounds)
    }

	function preload(){

	}

	function update(){

	}

	function onClikc(){
		/*var scaleTween = game.add.tween(obj.scale).to({x:0.8,y:0.8}, 100, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){*/
           // game.add.tween(obj.scale).to({x:1,y:1}, 300, Phaser.Easing.linear, true)
            
            var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,500)
            alphaTween.onComplete.add(function(){
                amazing.setMixPanelTrack("wonderHood2","enterGame")
                sceneloader.show("wonderHood")
            })
       // })
	}

	function create(){
        amazing.setMixPanelTrack("wonderHood2","loadGame")
		sceneGroup = game.add.group()
		loadSounds()
		game.stage.backgroundColor = "#ffffff"

		var background = game.add.graphics()
		background.beginFill(0x6eb7c1) 
		background.drawRect(0,0,game.world.width,game.world.height)
		background.endFill()
		sceneGroup.add(background)

		var mountain = game.add.tileSprite(0,game.world.height-900,game.world.width,512,"mountain")
		sceneGroup.add(mountain)

		var arbusto = game.add.tileSprite(0,game.world.height- 700,game.world.width,512,"arbusto")
		sceneGroup.add(arbusto)

		var pasto = game.add.tileSprite(0,game.world.height- 256,game.world.width,256,"pasto")
		sceneGroup.add(pasto)

		var baseButton = sceneGroup.create(game.world.centerX, game.world.height - 290, "atlas.init","base_botton")
		baseButton.scale.setTo(0.8)
		baseButton.anchor.setTo(0.5)

		button = sceneGroup.create(game.world.centerX, game.world.height - 300, "atlas.init","botton")
		button.anchor.setTo(0.5)
		button.inputEnabled = true
		button.events.onInputDown.add(onClikc,this)
		button.tween = game.add.tween(button.scale).to({x:0.8,y:0.8},500,Phaser.Easing.linear,true)
		button.tween.yoyo(true)
		button.tween.loop(true)

		var logo = sceneGroup.create(game.world.centerX, -200,"atlas.init","wonder_logo")
		logo.anchor.setTo(0.5)
		logo.tween = game.add.tween(logo).to({y:game.world.centerY-90},1500,Phaser.Easing.Bounce.Out,true)


	}

	return {
        assets: assets,
        name: "initScene",
        create: create,
        preload: preload,
        update: update
    }
}()