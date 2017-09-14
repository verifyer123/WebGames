
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
	// var operationsSong
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
	var correctButton
	var clientData
	var options
	var buttonSelected
	var timerText
	var differenceTimeText
	var correctParticle
	var wrongParticle
	var missingOperand

	function tweenTint(obj, startColor, endColor, time, delay, callback) {
		// check if is valid object
		time = time || 250
		delay = delay || 0

		if (obj) {
			// create a step object
			var colorBlend = { step: 0 };
			// create a tween to increment that step from 0 to 100.
			obj.colorTween = game.add.tween(colorBlend).to({ step: 100 }, time, Phaser.Easing.Linear.None, delay);
			// add an anonomous function with lexical scope to change the tint, calling Phaser.Colour.interpolateColor
			obj.colorTween.onUpdateCallback(function () {
				obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
			})
			// set object to the starting colour
			obj.tint = startColor;
			// if you passed a callback, add it to the tween on complete
			if (callback) {
				obj.colorTween.onComplete.add(callback, this);
			}
			// finally, start the tween
			obj.colorTween.start();
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
	
	function addButtons() {
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
			button.img.tint = 0xffffff

			game.add.tween(button).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true, 300 * (numOptions - optionIndex))
			game.add.tween(button.scale).to({x:1, y:1}, 300, Phaser.Easing.Back.Out, true, 300 * (numOptions - optionIndex))

			if (clientData.correctAnswer === value){
				correctButton = button
			}
		}
	}

	function onClickButton(obj) {
		startTimer = false

		var button = obj.parent
		game.add.tween(button.scale).to({x:1.2, y: 0.9}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)

		for(var indexButton = 0; indexButton < buttonList.length; indexButton++){
			var buttonToTween = buttonList[indexButton]
			buttonToTween.img.inputEnabled = false
			if(buttonToTween !== button)
				game.add.tween(buttonToTween).to({alpha:0.5}, 300, Phaser.Easing.Cubic.Out, true)
		}
		buttonSelected = button
		game.add.tween(timerText.scale).to({x:1.2, y:1.2}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)

		if(cliente)
			cliente.buttonOnClick(button.value, timeElapsed)

		timeElapsed = 0
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

			var buttonImg = button.create(0, 0, "atlas.operations", "button2")
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

		particle.makeParticles('atlas.operations',key);
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
		// operationsSong.stop()
		clock.tween.stop()
		inputsEnabled = false
		cliente.removeEventListener("onTurnEnds", checkAnswer)

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

		game.stage.disableVisibilityChange = true;
		// game.load.audio('operationsSong', soundsPath + 'songs/wormwood.mp3');

		// game.load.image('introscreen',"images/operations/introscreen.png")
		// game.load.image('howTo',"images/operations/how" + localization.getLanguage() + ".png")
		// game.load.image('buttonText',"images/operations/play" + localization.getLanguage() + ".png")

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
		options = cliente ? cliente.currentOptions : [120, 200, 0]

		clientData = (cliente)&&(cliente.currentData) ? cliente.currentData : {
			operand1 : 0,
			operand2 : 0,
			opedator : "+",
			correctAnswer : 0,
			type :"yei"
		}

		addButtons()
		equationText.text = clientData.operand1 + clientData.opedator + clientData.operand2 + "=" + clientData.result
		equationText.alpha = 0
		equationText.scale.x = 0.4; equationText.scale.y = 0.4
		game.add.tween(equationText.scale).to({x:1, y:1}, 500, Phaser.Easing.Back.Out, true)
		game.add.tween(equationText).to({alpha: 1}, 500, Phaser.Easing.Cubic.Out, true)

		game.add.tween(differenceTimeText).to({alpha:0}, 200, Phaser.Easing.Cubic.Out, true)
		startTimer = true
	}
	
	function addToPull(obj) {
		pullGroup.add(obj)
	}
	
	function clearStage() {
		for(var buttonIndex = 0; buttonIndex < options.length; buttonIndex++){
			var button = buttonList[buttonIndex]
			var dissapear = game.add.tween(button).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true)
			dissapear.onComplete.add(addToPull)
			game.add.tween(button.scale).to({x:0.4, y:0.4}, 300, Phaser.Easing.Cubic.Out, true)
		}

		game.add.tween(equationText).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true)
		game.add.tween(equationText.scale).to({x:0.4, y:0.4}, 300, Phaser.Easing.Cubic.Out, true)

		game.add.tween(differenceTimeText).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true)
		game.add.tween(differenceTimeText.scale).to({x:0.4, y:0.4}, 300, Phaser.Easing.Cubic.Out, true)
		var resetTimer = game.add.tween(timerText).to({alpha:0}, 200, Phaser.Easing.Cubic.Out, true)
		resetTimer.onComplete.add(function () {
			timerText.text = "00:00"
			game.add.tween(timerText).to({alpha:1}, 200, Phaser.Easing.Cubic.In, true)
			game.add.tween(differenceTimeText.scale).to({x:1.2, y:1.2}, 300, Phaser.Easing.Cubic.Out, true).yoyo(true)
		})
	}
	
	function checkAnswer(event) {
		switch ("?"){
			case clientData.operand1:
				clientData.operand1 = clientData.correctAnswer
				break
			case clientData.operand2:
				clientData.operand2 = clientData.correctAnswer
				break
			case clientData.result:
				clientData.result = clientData.correctAnswer
				break

		}
		console.log(missingOperand)
		equationText.text = clientData.operand1 + clientData.opedator + clientData.operand2 + "=" + clientData.result
		game.add.tween(equationText.scale).to({x:1.2, y:1.2}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)

		if(correctButton.value !== buttonSelected.value){
			// tweenTint(buttonSelected.img, 0xffffff, 0x00f414, 400)
			tweenTint(buttonSelected.img, 0xffffff, 0xbc0a00, 200)
		}
		// tweenTint(correctButton.img, 0xffffff, 0x64FF57, 400)
		tweenTint(correctButton.img, 0xffffff, 0x00f414, 200)

		console.log(event.timeDifference)
		if(event.timeDifference){
			var seconds = Math.floor(event.timeDifference * 0.001)
			var decimals = Math.floor(event.timeDifference * 0.01) % 10
			var centimals = (Math.floor(event.timeDifference / 10) % 10)
			// elapsedSeconds = Math.round(elapsedSeconds * 100) / 100
			var result = (seconds < 10) ? "0" + seconds : seconds;
			result += ":" + decimals + centimals

			if(cliente.numPlayer === event.numPlayer){
				differenceTimeText.text = "-" + result
				differenceTimeText.fill = "#00a413"
			}else{
				differenceTimeText.text = "+" + result
				differenceTimeText.fill = "#bc0a00"
			}

			game.add.tween(differenceTimeText).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true)
			game.add.tween(differenceTimeText.scale).to({x:1, y:1}, 300, Phaser.Easing.Back.Out, true)

			correctParticle.x = differenceTimeText.world.x
			correctParticle.y = differenceTimeText.world.y
			wrongParticle.x = differenceTimeText.world.x
			wrongParticle.y = differenceTimeText.world.y
		}else{
			correctParticle.x = buttonSelected.centerX
			correctParticle.y = buttonSelected.centerY
			wrongParticle.x = buttonSelected.centerX
			wrongParticle.y = buttonSelected.centerY
		}

		if(cliente.numPlayer === event.numPlayer){
			sound.play("magic")
			correctParticle.start(true, 1000, null, 5);
		}else{
			sound.play("wrong")
			wrongParticle.start(true, 1000, null, 5);
		}

		// game.time.events.add(3000, clearStage)

	}

	return {
		assets: assets,
		name: "operations",
		preload:preload,
		update:function () {
			if(startTimer){
				timeElapsed += game.time.elapsedMS
				var seconds = Math.floor(timeElapsed * 0.001)
				var decimals = Math.floor(timeElapsed * 0.01) % 10
				var centimals = (Math.floor(timeElapsed / 10) % 10)
				// elapsedSeconds = Math.round(elapsedSeconds * 100) / 100
				var result = (seconds < 10) ? "0" + seconds : seconds;
				result += ":" + decimals + centimals
				timerText.text = result
			}
		},
		create: function(event){

			sceneGroup = game.add.group()

			var background = game.add.graphics()
			background.beginFill(0xFF4560)
			background.drawRect(-2,-2, game.world.width + 2, game.world.height + 2)
			background.endFill()
			sceneGroup.add(background)

			// operationsSong = game.add.audio('operationsSong')
			// game.sound.setDecodedCallback(operationsSong, function(){
			// 	operationsSong.loopFull(0.6)
			// }, this);

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

			var fontStyle2 = {font: "72px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			equationText = game.add.text(game.world.centerX,150,"0+0=?", fontStyle2)
			equationText.anchor.setTo(0.5, 0.5)
			sceneGroup.add(equationText)

			var fontStyle3 = {font: "52px Arial", fontWeight: "bold", fill: "#ffffff", align: "center"}
			timerText = game.add.text(game.world.centerX - 30,250,"0:00", fontStyle3)
			timerText.anchor.setTo(0.5, 0.5)
			sceneGroup.add(timerText)

			var stopWatch = sceneGroup.create(0, 245, "atlas.operations", "stopwatch")
			stopWatch.x = game.world.centerX - 140
			stopWatch.anchor.setTo(0.5, 0.5)

			var fontStyle4 = {font: "42px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "left"}
			differenceTimeText = game.add.text(game.world.centerX + 110,250,"+0:00", fontStyle4)
			differenceTimeText.anchor.setTo(0.5, 0.5)
			differenceTimeText.fill = "#bc0a00"
			differenceTimeText.stroke = '#FFFFFF';
			differenceTimeText.strokeThickness = 6;
			differenceTimeText.alpha = 0
			sceneGroup.add(differenceTimeText)

			if(cliente){
				cliente.addEventListener("onTurnEnds", checkAnswer)
				cliente.addEventListener("showPossibleAnswers", startRound)
			}

			createGameObjects()
			startRound(true)

			correctParticle = createPart("star")
			sceneGroup.add(correctParticle)
			wrongParticle = createPart("wrong")
			sceneGroup.add(wrongParticle)

			// buttons.getButton(operationsSong,sceneGroup)
		}
	}
}()