
var soundsPath = "../../shared/minigames/sounds/"
var operations = function(){

	var localizationData = {
		"EN":{
			"howTo":"How to Play?",
			"moves":"Moves left"
		},

		"ES":{
			"moves":"Movimientos extra",
			"howTo":"¿Cómo jugar?"
		}
	}


	var assets = {
		atlases: [
			{
				name: "atlas.operations",
				json: "images/operations/atlas.json",
				image: "images/operations/atlas.png"
			}
		],
		images: [
			{   name:"button2",
				file: "images/operations/button2.png"}
		],
		sounds: [
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "magic",
				file: soundsPath + "magic.mp3"},
			{	name: "cut",
				file: soundsPath + "cut.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"},
			{	name: "flip",
				file: soundsPath + "flipCard.mp3"},
			{	name: "swipe",
				file: soundsPath + "swipe.mp3"},
			{	name: "wrong",
				file: soundsPath + "wrong.mp3"},
			{	name: "right",
				file: soundsPath + "rightChoice.mp3"},
			{   name: "gameLose",
				file: soundsPath + "gameLose.mp3"}
		]
	}

	var NUM_LIFES = 3
	var MAX_OPTIONS = 8

	// var ROUNDS = [
	//     {continent: "america", flags: ["mexico", "usa"]},
	//     {continent: "america", numFlags: 4},
	//     {continent: "random", numFlags: 4}]

	var lives
	var sceneGroup = null
	var gameIndex = 33
	var operationsSong
	var pullGroup = null
	var clock
	var timeValue
	var quantNumber
	var inputsEnabled
	var roundCounter
	var buttonList
	var equationText
	var startTimer
	var timeElapsed

	function tweenTint(obj, startColor, endColor, time, delay, callback) {
		// check if is valid object
		time = time || 250
		delay = delay || 0

		if (obj) {
			// create a step object
			var colorBlend = { step: 0 };
			// create a tween to increment that step from 0 to 100.
			var colorTween = game.add.tween(colorBlend).to({ step: 100 }, time, Phaser.Easing.Linear.None, delay);
			// add an anonomous function with lexical scope to change the tint, calling Phaser.Colour.interpolateColor
			colorTween.onUpdateCallback(function () {
				obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step, 1);
			})
			// set object to the starting colour
			obj.tint = startColor;
			// if you passed a callback, add it to the tween on complete
			if (callback) {
				colorTween.onComplete.add(callback, this);
			}
			// finally, start the tween
			colorTween.start();
		}
	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		game.stage.backgroundColor = "#ffffff"
		//gameActive = true
		lives = NUM_LIFES
		timeValue = 7
		quantNumber = 2
		roundCounter = 0

		sceneGroup.alpha = 0
		game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
		inputsEnabled = false
		buttonList = []
		timeElapsed = 0

		loadSounds()

	}
	
	function addButtons(options) {
		var startY = game.world.height - 200
		for(var optionIndex = 0, numOptions = options.length; optionIndex < numOptions; optionIndex++){
			var button = buttonList[optionIndex]
			var value = options[optionIndex]
			button.value = value
			button.text.text = value
			sceneGroup.add(button)
			button.y = startY - optionIndex * 180
			button.x = game.world.centerX
			button.img.inputEnabled = true
			button.alpha = 0
			button.scale.x = 0.4; button.scale.y = 0.4
			game.add.tween(button).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true, 300 * (numOptions - optionIndex))
			game.add.tween(button.scale).to({x:1, y:1}, 300, Phaser.Easing.Back.Out, true, 300 * (numOptions - optionIndex))
		}
	}

	function onClickButton(obj) {
		startTimer = false
		timeElapsed = 0

		var button = obj.parent
		game.add.tween(button.scale).to({x:1.2, y: 0.9}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)
		tweenTint(button, 0xffffff, 0x8F8F8F, 300, function () {
			tweenTint(button, 0x8F8F8F, 0xffffff, 300)
		})

		for(var indexButton = 0; indexButton < buttonList.length; indexButton++){
			var buttonToTween = buttonList[indexButton]
			buttonToTween.img.inputEnabled = false
			if(buttonToTween !== button)
				game.add.tween(buttonToTween).to({alpha:0.5}, 300, Phaser.Easing.Cubic.Out, true)
		}

		cliente.buttonOnClick(button.value, timeElapsed)
	}
	
	function createGameObjects(){
		pullGroup = game.add.group()
		pullGroup.x = -game.world.centerX * 2
		pullGroup.y = -game.world.centerY * 2
		sceneGroup.add(pullGroup)
		pullGroup.alpha = 0

		for(var optionIndex = 0; optionIndex < MAX_OPTIONS; optionIndex++){
			var button = game.add.group()
			pullGroup.add(button)

			var buttonImg = button.create(0, 0, "button2")
			buttonImg.anchor.setTo(0.5, 0.5)
			var fontStyle = {font: "72px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
			var buttonText = game.add.text(0,0,"0", fontStyle)
			buttonText.anchor.setTo(0.5, 0.5)
			button.add(buttonText)
			button.text = buttonText

			buttonImg.inputEnabled = false
			buttonImg.events.onInputDown.add(onClickButton)
			button.img = buttonImg

			buttonList.push(button)
		}

	}

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);

		particle.makeParticles('atlas.sushi',key);
		particle.minParticleSpeed.setTo(-200, -50);
		particle.maxParticleSpeed.setTo(200, -100);
		particle.minParticleScale = 0.6;
		particle.maxParticleScale = 1;
		particle.gravity = 150;
		particle.angularDrag = 30;
		particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)

		return particle

	}

	function stopGame(win){

		//objectsGroup.timer.pause()
		//timer.pause()
		operationsSong.stop()
		clock.tween.stop()
		inputsEnabled = false

		var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 750)
		tweenScene.onComplete.add(function(){

			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, numPoints, gameIndex)

			//amazing.saveScore(pointsBar.number)
			sceneloader.show("result")
			sound.play("gameLose")
		})
	}

	function preload(){

		game.stage.disableVisibilityChange = false;
		game.load.audio('operationsSong', soundsPath + 'songs/wormwood.mp3');

		game.load.image('introscreen',"images/operations/introscreen.png")
		game.load.image('howTo',"images/operations/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/operations/play" + localization.getLanguage() + ".png")

		buttons.getImages(game)

	}

	function addNumberPart(obj,number){

		var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

		var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
		pointsText.x = obj.world.x
		pointsText.y = obj.world.y
		pointsText.anchor.setTo(0.5,0.5)
		sceneGroup.add(pointsText)

		game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
		game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)

		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

	}

	function startRound() {
		var options = cliente ? cliente.currentOptions : [120, 200, 300]
		addButtons(options)

		console.log(cliente.currentData)
		var data = (cliente)&&(cliente.currentData) ? cliente.currentData : {
			operand1 : 0,
			operand2 : 0,
			opedator : "+",
			correctAnswer : 0,
			type :"yei"
		}
		equationText.text = data.operand1 + data.opedator + data.operand2 + "=?"
		equationText.alpha = 0
		equationText.scale.x = 0.4; equationText.scale.y = 0.4
		game.add.tween(equationText.scale).to({x:1, y:1}, 500, Phaser.Easing.Back.Out, true)
		game.add.tween(equationText).to({alpha: 1}, 500, Phaser.Easing.Cubic.Out, true)
		startTimer = true
	}

	return {
		assets: assets,
		name: "operations",
		preload:preload,
		update:function () {
			if(startTimer){
				timeElapsed += game.time.elapsedMS
			}
		},
		create: function(event){

			sceneGroup = game.add.group()

			var background = game.add.graphics()
			background.beginFill(0xFF4560)
			background.drawRect(-2,-2, game.world.width + 2, game.world.height + 2)
			background.endFill()
			sceneGroup.add(background)

			operationsSong = game.add.audio('operationsSong')
			game.sound.setDecodedCallback(operationsSong, function(){
				operationsSong.loopFull(0.6)
			}, this);

			// game.onPause.add(function(){
			// 	game.sound.mute = true
			// } , this);
			//
			// game.onResume.add(function(){
			// 	game.sound.mute = false
			// }, this);

			initialize()

			var playerData = cliente ? cliente.player : {nickname:"Nickname"}
			var numPlayer = cliente ? cliente.numPlayer : 1
			var textInfo = playerData.nickname + " " + numPlayer
			var fontStyle = {font: "36px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var playerInfo = game.add.text(game.world.centerX,50,textInfo, fontStyle)
			playerInfo.anchor.setTo(0.5, 0.5)
			sceneGroup.add(playerInfo)

			var fontStyle = {font: "72px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			equationText = game.add.text(game.world.centerX,150,"0+0=?", fontStyle)
			equationText.anchor.setTo(0.5, 0.5)
			sceneGroup.add(equationText)

			createGameObjects()
			startRound(true)

			buttons.getButton(operationsSong,sceneGroup)
		}
	}
}()