var instructionsScreen = function(){

	var localizationData = {
		"EN":{
			"answer":"Answer",
			"operationsCorrectly":"Operations Correctly",
			"go":"OK",
            "language":"en",
		},

		"ES":{
			"answer":"Contesta",
			"operationsCorrectly":"Operaciones Correctamente",
			"go":"OK",
            "language":"es",
		}
	}

	var assets = {
		atlases: [
			{
				name: "atlas.instructionsScreen",
				json: "images/instructions/atlas.json",
				image: "images/instructions/atlas.png",
			}
		],
        images: [
            {   name:"fondo",
				file: "images/instructions/background.png"},
		],
        sounds: [
            {	name: "pop",
				file: "sounds/pop.mp3"},
        ]    
	}
    

	var sceneGroup

	function createInstructions(){
        
		var circleGroup = new Phaser.Group(sceneGroup.game)

		var circleSprite = circleGroup.create(0, 0, "atlas.instructionsScreen", "circle")
		circleSprite.anchor.setTo(0.5, 0.5)

		var fontStyle = {font: "150px VAGRounded", fill: "#ffffff", align: "center"}

		var label = new Phaser.Text(sceneGroup.game, 0, 0, "10", fontStyle)
		label.anchor.setTo(0.5, 0.5)
		circleGroup.add(label)

		fontStyle.font = "100px VAGRounded"
		var topText = new Phaser.Text(sceneGroup.game, 0, 0, localization.getString(localizationData, "answer"), fontStyle)
		topText.anchor.setTo(0.5, 0.5)
		topText.y = circleSprite.height * -0.8
		circleGroup.add(topText)


		fontStyle.font = "40px VAGRounded"

		var bottomText = new Phaser.Text(sceneGroup.game, 0, 0, localization.getString(localizationData, "operationsCorrectly"), fontStyle)
		bottomText.anchor.setTo(0.5, 0.5)
		bottomText.y = circleSprite.height * 0.8
		circleGroup.add(bottomText)

		return circleGroup
	}
    
    function loadSounds(){
		sound.decode(assets.sounds)
	}
    
	function startGame(obj){
        
        sound.play("pop")
        obj.inputEnabled = false
        
        var scaleTween = game.add.tween(obj.scale).to({x:0.8,y:0.8}, 100, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(obj.scale).to({x:1,y:1}, 300, Phaser.Easing.linear, true)
            
            var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,500)
            alphaTween.onComplete.add(function(){
                sceneloader.show("mathQuiz")
            })
            
        })
        
        mixpanel.track(
            "enterGame",
            {"gameName": "mathQuiz"}
        );
		
	}

	function createButton(){
        
		var buttonGroup = new Phaser.Group(sceneGroup.game)

		var buttonSprite = buttonGroup.create(0, 0, "atlas.instructionsScreen", "okBtn")
		buttonSprite.anchor.setTo(0.5, 0.5)

		buttonSprite.inputEnabled = true
		buttonSprite.events.onInputUp.add(startGame, this)

		return buttonGroup
	}

	function createScene(){

		sceneGroup = game.add.group()
        
        var language = localization.getString(localizationData,"language")
        var plattform = 'Mobile'
        
        if(game.device.desktop == true){
            plattform = 'Desktop'
        }
        
        var background = sceneGroup.create(0,0,'fondo')
        background.width = game.world.width
        background.height = game.world.height
        
        var howP = sceneGroup.create(game.world.centerX, 120, 'atlas.instructionsScreen','howP' + language)
        howP.anchor.setTo(0.5,0.5)
        
        var instructions = sceneGroup.create(game.world.centerX, game.world.centerY - 50, 'atlas.instructionsScreen','ins' + plattform + language)
        instructions.anchor.setTo(0.5,0.5)
        
        var yogotar = sceneGroup.create(game.world.centerX - 100, game.world.height,'atlas.instructionsScreen','eagle')
        yogotar.anchor.setTo(0.5,1)

		var buttonGo = createButton()
		buttonGo.x = game.world.centerX + 150
		buttonGo.y = game.world.height * 0.84
		sceneGroup.add(buttonGo)
        
        mixpanel.track(
            "loadGame",
            {"gameName": "mathQuiz"}
        );
	}

	function initialize(){
		game.stage.backgroundColor = "#ffffff"
        loadSounds()
	}

	return {
		name: "instructionsScreen",
		assets: assets,
		create: createScene,
		init: initialize
	}
}()