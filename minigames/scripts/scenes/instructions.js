var instructionsScreen = function(){

	var assets = {
		atlases: [
			{
				name: "atlas.instructionsScreen",
				json: "images/instructions/atlas.json",
				image: "images/instructions/atlas.png",
			}
		]
	}

	var sceneGroup


	function createInstructions(){
		var circleGroup = new Phaser.Group(sceneGroup.game)

		var circleSprite = circleGroup.create(0, 0, "atlas.instructionsScreen", "circle")
		circleSprite.anchor.setTo(0.5, 0.5)

		var fontStyle = {font: "300px vag", fill: "#ffffff", align: "center"}

		var label = new Phaser.Text(sceneGroup.game, 0, 0, "10", fontStyle)
		label.anchor.setTo(0.5, 0.5)
		circleGroup.add(label)

		fontStyle.font = "150px vag"
		var topText = new Phaser.Text(sceneGroup.game, 0, 0, "Answer", fontStyle)
		topText.anchor.setTo(0.5, 0.5)
		topText.y = circleSprite.height * -0.8
		circleGroup.add(topText)


		fontStyle.font = "100px vag"

		var bottomText = new Phaser.Text(sceneGroup.game, 0, 0, "Operations correctly", fontStyle)
		bottomText.anchor.setTo(0.5, 0.5)
		bottomText.y = circleSprite.height * 0.8
		circleGroup.add(bottomText)

		return circleGroup
	}

	function startGame(){
		sceneloader.show("mathQuiz")
	}

	function createButton(){
		var buttonGroup = new Phaser.Group(sceneGroup.game)

		var buttonSprite = buttonGroup.create(0, 0, "atlas.instructionsScreen", "button")
		buttonSprite.anchor.setTo(0.5, 0.5)

		buttonSprite.inputEnabled = true
		buttonSprite.events.onInputUp.add(startGame, this)

		var fontStyle = {font: "100px vag", fill: "#ffffff", align: "center"}

		var label = new Phaser.Text(sceneGroup.game, 0, 0, "GO!", fontStyle)
		label.anchor.setTo(0.5, 0.5)
		buttonGroup.add(label)

		return buttonGroup
	}

	function createScene(){

		sceneGroup = game.add.group()

		var spriteScale = (game.world.height / 1920)
		sceneGroup.spriteScale = spriteScale

		var circleInstructions = createInstructions()
		circleInstructions.scale.setTo(spriteScale, spriteScale)
		circleInstructions.x = game.world.centerX
		circleInstructions.y = game.world.height * 0.4
		sceneGroup.add(circleInstructions)

		var buttonGo = createButton()
		buttonGo.scale.setTo(spriteScale, spriteScale)
		buttonGo.x = game.world.centerX
		buttonGo.y = circleInstructions.y + ((circleInstructions.height * 0.8)/ spriteScale)
		sceneGroup.add(buttonGo)
	}

	function initialize(){
		game.stage.backgroundColor = "#38b0f6"
	}

	return {
		name: "instructionsScreen",
		assets: assets,
		create: createScene,
		init: initialize
	}
}()