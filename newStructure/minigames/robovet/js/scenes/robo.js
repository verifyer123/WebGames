
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var robo = function(){

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
				name: "atlas.robo",
				json: "images/robo/atlas.json",
				image: "images/robo/atlas.png"
			},

		],
		images: [
			{   name:"fondo",
				file: "images/robo/fondo.png"}
		],
		sounds: [
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "magic",
				file: soundsPath + "magic.mp3"},
			{	name: "cut",
				file: soundsPath + "cut.mp3"},
			{	name: "drag",
				file: soundsPath + "drag.mp3"},
			{	name: "flip",
				file: soundsPath + "flipCard.mp3"},
			{	name: "swipe",
				file: soundsPath + "swipe.mp3"},
			{	name: "wrong",
				file: soundsPath + "wrong.mp3"},
			{	name: "right",
				file: soundsPath + "rightChoice.mp3"},
			{   name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{   name: "stop",
				file: soundsPath + "stop.mp3"},
			{   name: "robotWin",
				file: soundsPath + "robotWin.mp3"},
			{   name: "robotLose",
				file: soundsPath + "robotLose.mp3"}
		]
	}

	var NUM_LIFES = 3
	var NUM_OPTIONS = 3

	// var ROUNDS = [
	//     {continent: "america", flags: ["mexico", "usa"]},
	//     {continent: "america", numFlags: 4},
	//     {continent: "random", numFlags: 4}]

	var ROBOTS = ["dog1", "dog2"]

	var lives
	var sceneGroup = null
	var gameIndex = 51
	var tutoGroup
	var roboSong
	var heartsGroup = null
	var pullGroup = null
	var clock
	var timeValue
	var quantNumber
	var inputsEnabled
	var pointsBar
	var roundCounter
	var optionList
	var margins
	var barGroup
	var leftRieles
	var rightRieles
	var dog
	var engine
	var answerCompleted
	var electricBand
	var canAnswer


	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

	}

	function initialize(){

		game.stage.backgroundColor = "#ffffff"
		//gameActive = true
		lives = NUM_LIFES
		timeValue = 7
		quantNumber = 2
		roundCounter = 0
		optionList = []
		canAnswer = true

		sceneGroup.alpha = 0
		game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
		inputsEnabled = false

		loadSounds()

	}

	function update(){
	
	}

	function addPoint(number){

		sound.play("magic")
		pointsBar.number+=number;
		pointsBar.text.setText(pointsBar.number)

		var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		})

		addNumberPart(pointsBar.text,'+' + number)

		// if(pointsBar.number % 2 == 0){
		timeValue-=timeValue * 0.10
		// }

	}

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.robo','xpcoins')
		pointsImg.anchor.setTo(1,0)

		var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
		pointsText.x = -pointsImg.width * 0.45
		pointsText.y = pointsImg.height * 0.25
		pointsBar.add(pointsText)

		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

		pointsBar.text = pointsText
		pointsBar.number = 0

	}
	
	function addOptions(values) {
		values = values || [0,0,0]

		for(var optionIndex = 0; optionIndex < values.length; optionIndex++){
			var option = optionList[optionIndex]
			option.x = margins[optionIndex].x
			option.y = margins[optionIndex].y
			option.originalX = option.x, option.originalY = option.y
			barGroup.add(option)

			option.numberText.text = values[optionIndex]
			option.value = values[optionIndex]
			option.alpha = 0
			option.scale.x = 0.4, option.scale.y = 0.4

			var delay = 300 * (optionIndex) + 500
			game.add.tween(option.scale).to({x:1, y:1}, 400, Phaser.Easing.Back.Out, true, delay)
			var buttonAppear = game.add.tween(option).to({alpha:1}, 400, Phaser.Easing.Cubic.Out, true, delay)
			buttonAppear.onStart.add(function () {
				sound.play("pop")
			})
			buttonAppear.onComplete.add(function (obj) {
				obj.bg.inputEnabled = true
			})
		}

		game.time.events.add(300 * values.length, function () {
			startTimer()
		})
	}

	function onDragStart(obj, pointer) {

		sound.play("drag")
		var option = obj.parent
		option.deltaX = pointer.x - obj.world.x
		option.deltaY = pointer.y - obj.world.y

		option.startX = (obj.world.x - barGroup.x)
		option.startY = (obj.world.y - barGroup.y)

		if(option.answer) {
			option.answer.option = null
			option.answer = null
		}

		barGroup.add(option)

		if(option.tween)
			option.tween.stop()

		option.tween = game.add.tween(option.scale).to({x: 1.1, y: 1.1}, 200, Phaser.Easing.Cubic.Out, true)

	}

	function onDragUpdate(obj, pointer, x, y) {
		var option = obj.parent
		obj.x = 0
		obj.y = 0
		option.x = option.startX + x - option.deltaX
		option.y = option.startY + y - option.deltaY

	}

	function checkCollision(option) {
		var answer

		for(var slotIndex = 0, n = engine.answers.length; slotIndex<n; slotIndex++){
			var slotToCheck = engine.answers[slotIndex]
			var collide = checkOverlap(slotToCheck, option.hitBox)
			if((collide)&&(!slotToCheck.option))
				answer = slotToCheck
		}

		return answer
	}
	
	function dissapearNumbers() {
		for(var optionIndex = 0; optionIndex < NUM_OPTIONS; optionIndex++){
			var option = optionList[optionIndex]
			game.add.tween(option).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true)
			game.add.tween(option.scale).to({x:0.4, y:0.4}, 500, Phaser.Easing.Back.InOut, true)
		}

		for(var answerIndex = 0; answerIndex < engine.answers.length; answerIndex++){
			var answer = engine.answers[answerIndex]
			game.add.tween(answer).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true)
			game.add.tween(answer.scale).to({x:0.4, y:0.4}, 500, Phaser.Easing.Back.InOut, true)
		}
	}
	
	function moveDogAway(correct){
		if(correct){
			var moveDog = game.add.tween(dog).to({x:game.world.width + 220}, 1200, null, true, 1000)
		}else{
			var moveDog = game.add.tween(dog).to({x:-320}, 1900, null, true, 1000)
		}
		var engineLoopEffect = game.add.tween(engine.scale).to({x:1.1, y:0.9}, 300, Phaser.Easing.Sinusoidal.Out, false).yoyo(true)
		engine.engineLoopEffect = engineLoopEffect
		engineLoopEffect.loop(true)

		moveDog.onStart.add(function () {
			if(correct){
				leftRieles.callAll("playAnimation")
				rightRieles.callAll("playAnimation")
				electricBand.loopFull(1)
				engine.engineLoopEffect.start()
				dissapearNumbers()
			}else{
				leftRieles.callAll("playAnimation")
				electricBand.loopFull(1)
				engine.engineLoopEffect.start()
				dissapearNumbers()
			}
		})
		moveDog.onComplete.add(function () {
			dog.x = -220
			startRound()
			dog.setAnimation(["SLEEP"])
		})
	}

	function wrongReaction() {
		dog.setAnimation(["LOSE", "LOSESTILL"])
		sound.play("robotLose")
		console.log("wrongReaction")
		canAnswer = false


		missPoint()

		if(lives === 0){
			stopGame(false)
		}
		else{
			moveDogAway(false)
		}
	}
	
	function rightReaction() {

		console.log("rigth rectino")
		sound.play("robotWin")
		dog.setAnimation(["WAKE_UP", "WIN"])
		addPoint(1)

		moveDogAway(true)
	}
	
	function checkCorrect(x, y) {

		if(!canAnswer){
			return
		}

		answerCompleted = true

		var answers = []
		for(var answerIndex = 0, n = engine.answers.length; answerIndex < n; answerIndex++){
			var answer = engine.answers[answerIndex]
			if(answer.option) {
				answer.option.bg.inputEnabled = false
				answers.push(answer.option.value)
			}
		}

		var callback
		clock.tween.stop()
		canAnswer = false
		if((answers[0] * answers[1]) === dog.answer){
			
			engine.correctParticle.start(true, 1000, null, 5)
			callback = rightReaction
			sound.play("right")
		}else{
			engine.wrongParticle.x = x || engine.x
			engine.wrongParticle.y = y || engine.y - 150
			engine.wrongParticle.start(true, 1000, null, 5)
			callback = wrongReaction
			sound.play("wrong")
		}
		

		var engineOnEffect = game.add.tween(engine.scale).to({x:0.9, y:1.1}, 300, Phaser.Easing.Sinusoidal.Out, true, 800).yoyo(true)
		engineOnEffect.onStart.add(callback)

	}
	
	function checkAnswers() {
		var answerCounter = 0
		for(var answerIndex = 0, n = engine.answers.length; answerIndex < n; answerIndex++){
			var answer = engine.answers[answerIndex]
			if(answer.option)
				answerCounter++
		}
		if (answerCounter === engine.answers.length){
			checkCorrect()
		}
	}

	function onDragStop(obj) {
		var option = obj.parent
		obj.x = 0
		obj.y = 0
		obj.inputEnabled = false

		if(option.tween)
			option.tween.stop()

		game.add.tween(option.scale).to({x: 1, y: 1}, 400, Phaser.Easing.Cubic.Out, true)

		var answer = checkCollision(option)
		if (answer && canAnswer){
			sound.play("stop")
			option.x = (option.centerX - engine.x)
			option.y = (option.centerY - engine.y)
			engine.add(option)

			option.tween = game.add.tween(option).to({x: answer.x, y: answer.y}, 400, Phaser.Easing.Cubic.Out, true)
			option.tween.onComplete.add(function () {
				obj.inputEnabled = true
				checkAnswers()
			})
			answer.option = option
			option.answer = answer

		}else{
			sound.play("cut")
			option.tween = game.add.tween(option).to({x: option.originalX, y: option.originalY}, 600, Phaser.Easing.Cubic.Out, true)
			option.tween.onComplete.add(function () {
				obj.inputEnabled = true
			})
		}


	}

	function createGameObjects(){
		pullGroup = game.add.group()
		pullGroup.x = -game.world.centerX * 2
		pullGroup.y = -game.world.centerY * 2
		sceneGroup.add(pullGroup)
		pullGroup.alpha = 0

		for(var optionIndex = 0; optionIndex < NUM_OPTIONS; optionIndex++){
			var option = game.add.group()
			option.alpha = 0
			option.scale.x = 0.4, option.scale.y = 0.4
			pullGroup.add(option)

			var optionBG = option.create(0, 0, "atlas.robo", "option")
			optionBG.anchor.setTo(0.5, 0.5)

			var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var numberText = new Phaser.Text(game, 0, 5, "0", fontStyle)
			numberText.anchor.setTo(0.5, 0.5)
			option.numberText = numberText
			option.add(numberText)

			var hitBox = new Phaser.Graphics(game)
			hitBox.beginFill(0xFFFFFF)
			hitBox.drawRect(0,0,50, 50)
			hitBox.alpha = 0
			hitBox.endFill()
			hitBox.x = -hitBox.width * 0.5
			hitBox.y = -hitBox.height * 0.5
			option.add(hitBox)
			option.hitBox = hitBox

			optionBG.inputEnabled = true
			optionBG.input.enableDrag(true)
			optionBG.events.onDragStart.add(onDragStart, this)
			optionBG.events.onDragUpdate.add(onDragUpdate, this)
			optionBG.events.onDragStop.add(onDragStop, this)
			option.bg = optionBG
			optionBG.inputEnabled = false

			optionList.push(option)

		}

	}

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);

		particle.makeParticles('atlas.robo',key);
		particle.minParticleSpeed.setTo(-200, -50);
		particle.maxParticleSpeed.setTo(200, -100);
		particle.minParticleScale = 0.6;
		particle.maxParticleScale = 1;
		particle.gravity = 150;
		particle.angularDrag = 30;

		return particle

	}

	function stopGame(win){

		//objectsGroup.timer.pause()
		//timer.pause()
		roboSong.stop()
		clock.tween.stop()
		inputsEnabled = false

		var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2500)
		tweenScene.onComplete.add(function(){

			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number, gameIndex)

			//amazing.saveScore(pointsBar.number)
			sceneloader.show("result")
			sound.play("gameLose")
		})
	}

	function preload(){

		game.stage.disableVisibilityChange = false;
		game.load.audio('roboSong', soundsPath + 'songs/chemical_electro.mp3')
		game.load.audio('electricBand', soundsPath + 'electricBand.mp3');

		/*game.load.image('introscreen',"images/robo/introscreen.png")
		game.load.image('howTo',"images/robo/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/robo/play" + localization.getLanguage() + ".png")*/

		game.load.image('tutorial_image',"images/robo/tutorial_image.png")


		game.load.spine('dogs', "images/spine/dogs.json")

		game.load.spritesheet('riel', 'images/robo/riel.png', 308, 102, 23)

		
		//loadType(gameIndex)

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
	
	function generateQuestion(round) {
		round = round || {maxNumber:9}

		var number1 = game.rnd.integerInRange(2, round.maxNumber)
		var number2 = game.rnd.integerInRange(1, round.maxNumber)
		var fakeOption = game.rnd.integerInRange(1, round.maxNumber)
		var answer = number1 * number2
		var values = [number1, number2, fakeOption]
		values = Phaser.ArrayUtils.shuffle(values)

		dog.numberText.text = answer
		dog.answer = answer
		return values

	}
	
	function engineEffect(obj) {
		var engineLoopEffect = game.add.tween(obj.scale).to({x:1.1, y:0.9}, 300, Phaser.Easing.Sinusoidal.Out, false).yoyo(true)
		engineLoopEffect.loop(true)
		obj.engineLoopEffect = engineLoopEffect

		var engineOnEffect = game.add.tween(obj.scale).to({x:0.9, y:1.1}, 300, Phaser.Easing.Sinusoidal.Out, false, 800).yoyo(true)
		obj.engineOnEffect = engineOnEffect

	}

	function startRound(notStarted) {
		leftRieles.callAll("playAnimation")
		rightRieles.callAll("playAnimation")
		answerCompleted = false
		canAnswer = true

		for(var answerIndex = 0, n = engine.answers.length; answerIndex < n; answerIndex++){
			var answer = engine.answers[answerIndex]
			if(answer.option){
				engine.remove(answer.option)
				pullGroup.add(answer.option)

				answer.option.answer = null
				answer.option = null
			}
		}

		game.add.tween(clock.bar.scale).to({x:clock.bar.origScale}, 600, Phaser.Easing.Cubic.Out, true)

		var values = generateQuestion()
		var dogMove = game.add.tween(dog).to({x:game.world.centerX}, 1200, null, true)

		if(notStarted){
			var engineLoopEffect = game.add.tween(engine.scale).to({x:1.1, y:0.9}, 300, Phaser.Easing.Sinusoidal.Out, true).yoyo(true)
			engine.engineLoopEffect = engineLoopEffect
			engineLoopEffect.loop(true)
			electricBand.loopFull(1)
		}

		dogMove.onComplete.add(function () {
			leftRieles.callAll("stopAnimation")
			rightRieles.callAll("stopAnimation")
			electricBand.stop()
			sound.play("swipe")
			for(var answerIndex = 0; answerIndex < engine.answers.length; answerIndex++){
				var answer = engine.answers[answerIndex]
				game.add.tween(answer).to({alpha:1}, 500, Phaser.Easing.Cubic.Out, true)
				game.add.tween(answer.scale).to({x:1, y:1}, 500, Phaser.Easing.Back.InOut, true)
			}
			addOptions(values)
			engine.engineLoopEffect.stop()
			game.add.tween(engine.scale).to({x:1, y:1}, 300, Phaser.Easing.Sinusoidal.Out, true)
		})

	}

	function missPoint(){


		lives--;
		heartsGroup.text.setText('X ' + lives)

		var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		})


		addNumberPart(heartsGroup.text,'-1')
	}

	function createHearts(){

		heartsGroup = game.add.group()
		heartsGroup.y = 10
		sceneGroup.add(heartsGroup)

		var pivotX = 10
		var group = game.add.group()
		group.x = pivotX
		heartsGroup.add(group)

		var heartImg = group.create(0,0,'atlas.robo','life_box')

		pivotX+= heartImg.width * 0.45

		var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
		pointsText.x = pivotX
		pointsText.y = heartImg.height * 0.15
		pointsText.setText('X ' + lives)
		heartsGroup.add(pointsText)

		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

		heartsGroup.text = pointsText

	}

	function startTimer() {
		if (clock.tween)
			clock.tween.stop()


		clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeValue * quantNumber * 1000,Phaser.Easing.linear,true )
		clock.tween.onComplete.add(function(){
			if(!answerCompleted) {
				checkCorrect(clock.centerX, clock.centerY)
				game.add.tween(clock.scale).to({x:1.1, y:1.1}, 300, Phaser.Easing.Cubic.Out, true).yoyo(true)
			}
		})
	}

	function onClickPlay(rect) {
		

		tutoGroup.y = -game.world.height
		startRound(true)
	}

	function createTutorial(){

		tutoGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
		sceneGroup.add(tutoGroup)

		tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

	}

	function createClock(){

		clock = game.add.group()
		clock.x = game.world.centerX
		clock.y = 100
		sceneGroup.add(clock)

		var clockImage = clock.create(0,0,'atlas.robo','clock')
		clockImage.anchor.setTo(0.5,0.5)

		var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.robo','bar')
		clockBar.anchor.setTo(0,0.5)
		clockBar.width = clockImage.width*0.76
		clockBar.height = 22
		clockBar.origScale = clockBar.scale.x

		clock.bar = clockBar

	}

	function createSpine(skeleton, skin, idleAnimation, x, y) {
		idleAnimation = idleAnimation || "IDLE"
		var spineGroup = game.add.group()
		x = x || 0
		y = y || 0

		var spineSkeleton = game.add.spine(0, 0, skeleton)
		spineSkeleton.x = x; spineSkeleton.y = y
		// spineSkeleton.scale.setTo(0.8,0.8)
		spineSkeleton.setSkinByName(skin)
		spineSkeleton.setAnimationByName(0, idleAnimation, true)
        
		spineSkeleton.autoUpdateTransform ()
        
		spineGroup.add(spineSkeleton)


		spineGroup.setAnimation = function (animations, onComplete) {

			var entry
			for(var index = 0; index < animations.length; index++) {
				var animation = animations[index]
				var loop = index === animations.length - 1
				if (index === 0)
					entry = spineSkeleton.setAnimationByName(0, animation, loop)
				else
					spineSkeleton.addAnimationByName(0, animation, loop)

			}
			if(onComplete){
				entry.onComplete = onComplete
			}
		}

		spineGroup.setSkinByName = function (skin) {
			spineSkeleton.setSkinByName(skin)
		}

		spineGroup.setAlive = function (alive) {
			spineSkeleton.autoUpdate = alive
		}

		spineGroup.getSlotContainer = function (slotName) {
			var slotIndex
			for(var index = 0, n = spineSkeleton.skeletonData.slots.length; index < n; index++){
				var slotData = spineSkeleton.skeletonData.slots[index]
				if(slotData.name === slotName){
					slotIndex = index
				}
			}

			if (slotIndex){
				return spineSkeleton.slotContainers[slotIndex]
			}
		}

		spineGroup.spine = spineSkeleton

		return spineGroup
	}
	
	function createRoboUI() {
		var base = game.add.tileSprite(0, 0, game.world.width, 242, "atlas.robo", "base")
		base.y = game.world.height
		base.anchor.setTo(0, 1)
		sceneGroup.add(base)

		engine = game.add.group()
		engine.x = game.world.centerX
		engine.y = base.y - base.height + 10
		sceneGroup.add(engine)
		engineEffect(engine)

		var engineBG = engine.create(0,0, "atlas.robo", "operacion")
		engineBG.anchor.setTo(0.5, 1)

		var xImage = engine.create(0,0, "atlas.robo", "x")
		xImage.y = -125
		xImage.anchor.setTo(0.5, 0.5)

		var answer1 = engine.create(0, 0, "atlas.robo", "answer")
		answer1.x = -82
		answer1.y = -124
		answer1.anchor.setTo(0.5, 0.5)
		answer1.alpha = 0
		answer1.scale.x = 0.4, answer1.scale.y = 0.4

		var answer2 = engine.create(0, 0, "atlas.robo", "answer")
		answer2.x = 82
		answer2.y = -124
		answer2.anchor.setTo(0.5, 0.5)
		answer2.alpha = 0
		answer2.scale.x = 0.4, answer2.scale.y = 0.4

		engine.answers = [answer1, answer2]

		var n = Math.ceil(game.world.width * 0.5 / 308)
		leftRieles = game.add.group()
		leftRieles.x = game.world.width * 0.5 - 295 * 0.5
		sceneGroup.add(leftRieles)

		rightRieles = game.add.group()
		rightRieles.x = game.world.width * 0.5 + 295 * 0.5
		sceneGroup.add(rightRieles)

		for(var rielIndex = 0; rielIndex < n; rielIndex++){
			var x = -rielIndex * 308

			var riel = game.add.sprite(x, game.world.centerY - 65, 'riel')
			riel.anchor.setTo(1, 0)
			riel.animations.add('run')
			leftRieles.add(riel)

			riel.playAnimation = function () {
				this.animations.play('run', 24, true)
			}

			riel.stopAnimation = function () {
				this.animations.stop()
			}
		}

		for(var rielIndex = 0; rielIndex < n; rielIndex++){
			var x = rielIndex * 308

			var riel = game.add.sprite(x, game.world.centerY - 65, 'riel')
			riel.anchor.setTo(0, 0)
			riel.animations.add('run')
			rightRieles.add(riel)

			riel.playAnimation = function () {
				this.animations.play('run', 24, true)
			}

			riel.stopAnimation = function () {
				this.animations.stop()
			}
		}

		barGroup = game.add.group()
		barGroup.x = game.world.centerX
		barGroup.y = game.world.height - 100
		sceneGroup.add(barGroup)

		var startX = -172
		margins = []
		for(var baseIndex = 0; baseIndex < NUM_OPTIONS; baseIndex++){
			var x = 172 * baseIndex + startX
			var margin = barGroup.create(x,0, "atlas.robo", "margin")
			margin.anchor.setTo(0.5, 0.5)
			margins.push(margin)
		}

		dog = createSpine("dogs","dog1")
		dog.x = -220
		dog.y = game.world.centerY - 60
		sceneGroup.add(dog)
		dog.setAnimation(["SLEEP"])
		var slot = dog.getSlotContainer("empty")

		var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var numberText = new Phaser.Text(game, 0, 5, "0", fontStyle)
		numberText.anchor.setTo(0.5, 0.5)
		dog.numberText = numberText
		slot.add(numberText)

	}

	return {
		assets: assets,
		name: "robo",
		update:update,
		preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){

			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

			var background = game.add.tileSprite(-2 , -2, game.world.width + 2, game.world.height + 2, "fondo")
			sceneGroup.add(background)

			roboSong = game.add.audio('roboSong')
			electricBand = game.add.audio('electricBand')
			game.sound.setDecodedCallback(roboSong, function(){
				roboSong.loopFull(0.6)
			}, this);

			game.onPause.add(function(){
				game.sound.mute = true
			} , this);

			game.onResume.add(function(){
				game.sound.mute = false
			}, this);

			initialize()

			createRoboUI()

			createHearts()
			createPointsBar()
			createGameObjects()
			createClock()
			createTutorial()

			var correctParticle = createPart("star")
			correctParticle.x = engine.x
			correctParticle.y = engine.y - 150
			sceneGroup.add(correctParticle)
			engine.correctParticle = correctParticle

			var wrongParticle = createPart("smoke")
			wrongParticle.x = engine.x
			wrongParticle.y = engine.y - 150
			sceneGroup.add(wrongParticle)
			engine.wrongParticle = wrongParticle

			buttons.getButton(roboSong,sceneGroup)
		}
	}
}()