
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var uni = function(){

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
				name: "atlas.uni",
				json: "images/uni/atlas.json",
				image: "images/uni/atlas.png"
			},

		],
		images: [
			{   name:"fondo",
				file: "images/uni/fondo.png"}
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
			{	name: "brightTransition",
				file: soundsPath + "brightTransition.mp3"},
			{   name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{   name: "alarmBell",
				file: soundsPath + "alarmBell.mp3"},
			{   name: "horse_gallop",
				file: soundsPath + "horse_gallop.mp3"}
		]
	}

	var NUM_LIFES = 3
	var MAX_UNICORNS = 20
	var MAX_DONKEYS = 5

	var ROUNDS = [
	    {minNumber:3, maxNumber:5},
	    {minNumber:5, maxNumber:8},
	    {minNumber:5, maxNumber:8, minDonkeys:1, maxDonkeys:3},
	    {minNumber:5, maxNumber:9, minDonkeys:1, maxDonkeys:3},
	    {minNumber:9, maxNumber:15, minDonkeys:1, maxDonkeys:5},
	    {minNumber:15, maxNumber:20},
	    {minNumber:12, maxNumber:17, minDonkeys:1, maxDonkeys:3},
	    {minNumber:20, maxNumber:20},
		{minNumber:9, maxNumber:15, minDonkeys:1, maxDonkeys:5}]

	var lives
	var sceneGroup = null
	var gameIndex = 53
	var tutoGroup
	var uniSong
	var heartsGroup = null
	var pullGroup = null
	var clock
	var timeValue
	var quantNumber
	var inputsEnabled
	var pointsBar
	var roundCounter
	var unicornList
	var donkeyList
	var gameGroup
	var objectsInGame
	var clockCounter
	var answer
	var dreamGroup
	var theffanie
	var isCorrect

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

		game.stage.backgroundColor = "#ffffff"
		//gameActive = true
		lives = NUM_LIFES
		timeValue = 20
		quantNumber = 2
		roundCounter = 0
		unicornList= []
		donkeyList = []
		objectsInGame = []

		sceneGroup.alpha = 0
		game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
		inputsEnabled = false

		loadSounds()

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
		roundCounter = roundCounter + 1 < ROUNDS.length ? roundCounter + 1 : ROUNDS.length - 1
		// }

	}

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.uni','xpcoins')
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

	function createGameObjects(){
		pullGroup = game.add.group()
		pullGroup.x = -game.world.centerX * 2
		pullGroup.y = -game.world.centerY * 2
		sceneGroup.add(pullGroup)
		pullGroup.alpha = 0

		var startX = - 90
		var startY = -190

		for (var uniIndex = 0; uniIndex < MAX_UNICORNS; uniIndex++){
			var xIndex = ((uniIndex + 1) % 5) - 1
			var yIndex = Math.ceil((uniIndex + 1) / 5) - 1
			var x = startX + 90 * xIndex
			var y = startY + 90 * yIndex

			var unicorn = createSpine("unicorn","normal")
			unicorn.originalX = x
			unicorn.originalY = y
			pullGroup.add(unicorn)
			unicornList.push(unicorn)
			unicorn.tag = "unicorn"
		}

		for (var donkeyIndex = 0; donkeyIndex < MAX_DONKEYS; donkeyIndex++){
			var donkey = createSpine("donkey", "normal")
			pullGroup.add(donkey)
			donkeyList.push(donkey)
		}

	}

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);

		particle.makeParticles('atlas.uni',key);
		particle.minParticleSpeed.setTo(-200, -50);
		particle.maxParticleSpeed.setTo(200, -100);
		particle.minParticleScale = 0.5;
		particle.maxParticleScale = 0.8;
		particle.gravity = 150;
		particle.angularDrag = 30;

		return particle

	}

	function stopGame(win){

		sound.play("alarmBell")

		uniSong.stop()
		clock.tween.stop()

		var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Sinusoidal.In, true, 3000)
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
		game.load.audio('uniSong', soundsPath + 'songs/fantasy_ballad.mp3');

		/*game.load.image('introscreen',"images/uni/introscreen.png")
		game.load.image('howTo',"images/uni/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/uni/play" + localization.getLanguage() + ".png")*/

		game.load.spine('theffanie', "images/spine/theffanie/theffanie.json")
		game.load.spine('unicorn', "images/spine/unicorn/unicorn.json")
		game.load.spine('donkey', "images/spine/donkey/donkey.json")

		

		game.load.image('tutorial_image',"images/uni/tutorial_image.png")
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
	
	function addUnicorns(num, donkeys) {

		unicornList = Phaser.ArrayUtils.shuffle(unicornList)
		for(var uniIndex = 0; uniIndex < num; uniIndex++){
			var unicorn = unicornList[uniIndex]
			unicorn.x = -game.world.centerX - 50
			unicorn.y = game.rnd.integerInRange(-150, 150)
			var toX = unicorn.originalX
			var toY = unicorn.originalY
			var delay = 50 * uniIndex
			moveSpine(unicorn, toX, toY, delay, Phaser.Easing.Sinusoidal.Out)
			pullGroup.remove(unicorn)
			gameGroup.add(unicorn)
			objectsInGame.push(unicorn)
		}

		for(var donkeyIndex = 0; donkeyIndex < donkeys; donkeyIndex++){
			var donkey = donkeyList[donkeyIndex]
			var unicorn = unicornList[num + donkeyIndex]
			donkey.x = -game.world.centerX - 50
			donkey.y = game.rnd.integerInRange(-150, 150)
			var toX = unicorn.originalX
			var toY = unicorn.originalY
			var delay = 50 * uniIndex
			moveSpine(donkey, toX, toY, delay, Phaser.Easing.Sinusoidal.Out)
			pullGroup.remove(donkey)
			gameGroup.add(donkey)
			
			objectsInGame.push(donkey)
		}

		game.time.events.add(3100, function () {
			sound.play("cut")

			var numberText = clockCounter.numberText
			var button = dreamGroup.button.parent
			numberText.text = 0
			clockCounter.number = 0

			game.add.tween(button.scale).to({x:1, y:1}, 800, Phaser.Easing.Back.Out, true)
			var appearButton = game.add.tween(button).to({alpha:1}, 800, Phaser.Easing.Cubic.Out, true)

			game.add.tween(numberText.scale).to({x:1, y:1}, 800, Phaser.Easing.Back.Out, true)
			game.add.tween(numberText).to({alpha:1}, 800, Phaser.Easing.Cubic.Out, true)

			dreamGroup.button.inputEnabled = true
			clockCounter.mas.inputEnabled = true
			clockCounter.menos.inputEnabled = true

			appearButton.onComplete.add(startTimer)
		})

	}

	function removeUnicorns() {
		for(var objectIndex = 0; objectIndex < objectsInGame.length; objectIndex++){
			var object = objectsInGame[objectIndex]
			gameGroup.remove(object)
			pullGroup.add(object)
		}
		objectsInGame = []
	}
	
	function startRound(notStarted) {
		var round = ROUNDS[roundCounter]
		game.add.tween(clock.bar.scale).to({x:clock.bar.origScale}, 600, Phaser.Easing.Cubic.Out, true)

		isCorrect = false
		var button = dreamGroup.button.parent
		var numberText = clockCounter.numberText

		sound.play("cut")
		game.add.tween(button.scale).to({x:0.4, y:0.4}, 800, Phaser.Easing.Back.Out, true)
		game.add.tween(button).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)

		game.add.tween(numberText.scale).to({x:0.4, y:0.4}, 800, Phaser.Easing.Back.Out, true)
		game.add.tween(numberText).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)
		removeUnicorns()

		var numUnicorns = game.rnd.integerInRange(round.minNumber, round.maxNumber)
		var donkeys
		if(round.minDonkeys)
			donkeys = game.rnd.integerInRange(round.minDonkeys, round.maxDonkeys)
		addUnicorns(numUnicorns, donkeys)
		answer = numUnicorns

	}

	function missPoint(){

		sound.play("wrong")
		inputsEnabled = false

		lives--;
		heartsGroup.text.setText('X ' + lives)

		var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		})

		if(lives === 0){
			stopGame(false)
		}
		else{
			startRound()
		}

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

		var heartImg = group.create(0,0,'atlas.uni','life_box')

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
		var delay = 500
		// clock.bar.scale.x = clock.bar.origScale
		if (clock.tween)
			clock.tween.stop()


		clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeValue * quantNumber * 1000,Phaser.Easing.linear,true )
		clock.tween.onComplete.add(function(){
			if(!isCorrect)
				wrongReaction()
		})
	}
	
	function showDream() {
		sound.play("swipe")
		var showDream = game.add.tween(dreamGroup).to({y: -2},1200,Phaser.Easing.Exponential.Out,true)
		showDream.onComplete.add(function () {
			sound.play("brightTransition")
			game.add.tween(dreamGroup.bright).to({alpha: 1},1000,Phaser.Easing.Cubic.Out,true).yoyo(true)
			var bgAppear = game.add.tween(dreamGroup.bg).to({alpha:1}, 1000, Phaser.Easing.Cubic.In, true)
			bgAppear.onComplete.add(startRound)
		})
	}

	function onClickPlay(rect) {
	
		tutoGroup.y = -game.world.height
		showDream()

	}

	function createTutorial(){

		tutoGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
		sceneGroup.add(tutoGroup)

		tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

		/*var rect = new Phaser.Graphics(game)
		rect.beginFill(0x000000)
		rect.drawRect(0,0,game.world.width *2, game.world.height *2)
		rect.alpha = 0.7
		rect.endFill()
		rect.inputEnabled = true
		rect.events.onInputDown.add(function(){
			onClickPlay(rect)

		})

		tutoGroup.add(rect)

		var plane = tutoGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
		plane.anchor.setTo(0.5,0.5)

		var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.uni','gametuto')
		tuto.anchor.setTo(0.5,0.5)

		var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)

		var inputName = 'movil'

		if(game.device.desktop){
			inputName = 'desktop'
		}

		//console.log(inputName)
		var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.uni',inputName)
		inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)

		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.uni','button')
		button.anchor.setTo(0.5,0.5)

		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
	}


	function createClock(){

		clock = game.add.group()
		clock.x = game.world.centerX
		clock.y = 80
		sceneGroup.add(clock)

		var clockImage = clock.create(0,0,'atlas.uni','clock')
		clockImage.anchor.setTo(0.5,0.5)

		var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.uni','bar')
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
	
	function addCounter(obj, number) {
		sound.play("pop")

		var numberText = clockCounter.numberText
		if(clockCounter.scaleNumber){
			clockCounter.scaleNumber.stop()
			numberText.scale.x = 1, numberText.scale.y = 1
		}
		if(clockCounter.scaleObj){
			clockCounter.scaleObj.stop()
			obj.scale.x = 1, obj.scale.y = 1
		}

		var scaleObj = game.add.tween(obj.scale).to({x:1.2, y:1.2}, 300, Phaser.Easing.Cubic.Out, true).yoyo(true)
		clockCounter.scaleObj = scaleObj

		var scaleNumber = game.add.tween(numberText.scale).to({x:1.2, y:1.2}, 300, Phaser.Easing.Cubic.Out, true).yoyo(true)
		clockCounter.scaleNumber = scaleNumber

		if(clockCounter.number + number > 20)
			clockCounter.number = 0
		else if(clockCounter.number + number < 0)
			clockCounter.number = 20
		else
			clockCounter.number += number

		clockCounter.numberText.text = clockCounter.number
	}
	
	function moveSpine(spine, toX, toY, delay, easing) {
		var moveTween = game.add.tween(spine).to({x:toX, y:toY}, 3000, easing, true, delay)
		moveTween.onStart.add(function () {
			sound.play("horse_gallop")
			spine.setAnimation(["JUMP"])
		})
		moveTween.onComplete.add(function () {
			spine.setAnimation(["IDLE"])
		})
		moveTween.onUpdateCallback(function () {
			gameGroup.sort('y', Phaser.Group.SORT_ASCENDING)
		})
	}
	
	function rightReaction() {
		addPoint(1)

		for(var spineIndex = 0; spineIndex < objectsInGame.length; spineIndex++){
			var spine = objectsInGame[spineIndex]
			var toY = game.rnd.integerInRange(-190, 190)
			var delay = 1000 + (spineIndex * 50)
			moveSpine(spine, game.world.centerX + 50, toY, delay, Phaser.Easing.Sinusoidal.In)

		}

		sceneGroup.correctParticle.x = clockCounter.centerX
		sceneGroup.correctParticle.y = clockCounter.centerY
		sceneGroup.correctParticle.start(true, 1000, null, 5)
		var totalDelay = objectsInGame.length * 50

		game.time.events.add(totalDelay + 4000, startRound)
	}
	
	function wrongReaction() {
		theffanie.setAnimation(["WAKE_UP", "WAKE_UPSTILL"])
		sceneGroup.wrongParticle.x = clockCounter.centerX
		sceneGroup.wrongParticle.y = clockCounter.centerY
		sceneGroup.wrongParticle.start(true, 1000, null, 5)
        
		for(var objIndex = 0; objIndex < objectsInGame.length; objIndex++){
			var spine = objectsInGame[objIndex]
			spine.setAnimation(["LOSE"])
		}
        
        missPoint()
        if(lives===0){
		var shockEffect = game.add.tween(clockCounter).to({x: clockCounter.x + 20}, 200, null, true)
		shockEffect.onComplete.add(function () {
			game.add.tween(clockCounter).to({x: clockCounter.x - 20}, 200, null, true).yoyo(true).loop(true)
		})

		game.add.tween(gameGroup).to({alpha: 0},600,Phaser.Easing.Cubic.Out,true, 600)
		game.add.tween(dreamGroup.bright).to({alpha: 1},600,Phaser.Easing.Cubic.Out,true, 600).yoyo(true)
		var bgDissapear = game.add.tween(dreamGroup.bg).to({alpha:0}, 600, Phaser.Easing.Cubic.In, true, 600)
		bgDissapear.onComplete.add(function () {
			var showDream = game.add.tween(dreamGroup).to({y: game.world.height},800,Phaser.Easing.Cubic.In,true, 400)
			showDream.onStart.add(function () {
				sound.play("swipe")
			})
		})
        }else{
        game.time.events.add(700, function () {
            theffanie.setAnimation(["IDLE"])
        })
        }
		
	}
	
	function checkCorrect(obj) {
		isCorrect = true
		clock.tween.stop()

		var button = obj.parent
		var numberText = clockCounter.numberText
		obj.inputEnabled = false
		clockCounter.mas.inputEnabled = false
		clockCounter.menos.inputEnabled = false

		game.add.tween(numberText.scale).to({x:1.1, y:1.1}, 800, Phaser.Easing.Back.Out, true).yoyo(true)

		game.add.tween(button.scale).to({x:1.1, y:0.8}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)
		if (clockCounter.number === answer){
			rightReaction()
		}else
			wrongReaction()
	}
	
	function createUniUI() {
		dreamGroup = game.add.group()
		dreamGroup.y = game.world.height
		sceneGroup.add(dreamGroup)

		var background = game.add.tileSprite(0,0,game.world.width, 626, "fondo")
		background.x = game.world.centerX
		background.anchor.setTo(0.5, 0)
		dreamGroup.add(background)
		background.alpha = 0
		dreamGroup.bg = background

		var brightRect = game.add.graphics()
		brightRect.beginFill(0xffffff)
		brightRect.drawRect(0,0,game.world.width *2, game.world.height *2)
		brightRect.endFill()
		brightRect.alpha = 0
		dreamGroup.add(brightRect)
		dreamGroup.bright = brightRect

		gameGroup = game.add.group()
		gameGroup.x = game.world.centerX
		gameGroup.y = game.world.centerY
		dreamGroup.add(gameGroup)

		var nubes = game.add.tileSprite(0,0,game.world.width, 444, "atlas.uni", "nubes")
		nubes.x = game.world.centerX
		nubes.y = game.world.height + 20
		nubes.tilePosition.y -= 2
		nubes.anchor.setTo(0.5, 1)
		dreamGroup.add(nubes)
		game.add.tween(nubes.scale).to({x:1.02, y:0.97}, 800, Phaser.Easing.Sinusoidal.Out, true).yoyo(true).loop(true)

		var buro = sceneGroup.create(0,0,"atlas.uni", "buro")
		buro.x = game.world.centerX + 170
		buro.y = game.world.height
		buro.anchor.setTo(0.5, 1)

		theffanie = createSpine("theffanie","normal")
		theffanie.x = game.world.width * 0.5 - 200
		theffanie.y = game.world.height - 80
		sceneGroup.add(theffanie)

		clockCounter = game.add.group()
		clockCounter.x = buro.x
		clockCounter.y = game.world.height - 250
		sceneGroup.add(clockCounter)

		// var inputClock = new Phaser.Graphics(game)
		// inputClock.beginFill(0xFFFFFF)
		// inputClock.drawRect(0,0,180, 180)
		// inputClock.alpha = 0
		// inputClock.endFill()
		// inputClock.x = -90, inputClock.y = -90
		// // input.inputEnabled = true
		// inputClock.events.onInputDown.add(addCounter)
		// clockCounter.input = inputClock
		// clockCounter.add(inputClock)

		var clockImg = clockCounter.create(0,0,"atlas.uni","clockImg")
		clockImg.anchor.setTo(0.5, 0.5)
		game.add.tween(clockImg.scale).to({x:1.05, y:0.95}, 300, Phaser.Easing.Sinusoidal.Out, true).yoyo(true).loop(true)

		var fontStyle = {font: "68px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
		var numberText = new Phaser.Text(game, 0, 10, "0", fontStyle)
		numberText.anchor.setTo(0.5, 0.5)
		clockCounter.add(numberText)
		numberText.alpha = 0
		numberText.scale.setTo(0.4, 0.4)
		clockCounter.numberText = numberText
		clockCounter.number = 0

		var button = game.add.group()
		button.x = game.world.centerX
		button.y = game.world.centerY + 140
		dreamGroup.add(button)

		var buttonImg = button.create(0,0,"atlas.uni", "rdyButton")
		buttonImg.events.onInputDown.add(checkCorrect)
		buttonImg.anchor.setTo(0.5, 0.5)
		button.alpha = 0
		buttonImg.scale.setTo(0.8, 0.8)
		dreamGroup.button = buttonImg

		var fontStyle2 = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var readyText = new Phaser.Text(game, 0, -5, "OK", fontStyle2)
		readyText.anchor.setTo(0.5, 0.5)
		readyText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
		button.add(readyText)

		var minButton = button.create(0,0,"atlas.uni","menos")
		minButton.anchor.setTo(0.5, 0.5)
		minButton.x = - 120
		minButton.events.onInputDown.add(function (obj) {
			addCounter(obj, -1)
		})
		clockCounter.menos = minButton

		var maxButton = button.create(0,0,"atlas.uni","mas")
		maxButton.anchor.setTo(0.5, 0.5)
		maxButton.x = 120
		maxButton.events.onInputDown.add(function (obj) {
			addCounter(obj, +1)
		})
		clockCounter.mas = maxButton

		var correctParticle = createPart("star")
		sceneGroup.correctParticle = correctParticle

		var wrongParticle = createPart("wrong")
		sceneGroup.wrongParticle = wrongParticle
	}
	
	function createBackground() {
		var background = game.add.tileSprite(0,0,game.world.width, game.world.height, "atlas.uni", "room")
		sceneGroup.add(background)

		var window = sceneGroup.create(0,0, "atlas.uni", "window")
		window.x = game.world.centerX + 80, window.y = game.world.centerY + 80
		window.anchor.setTo(0.5, 0.5)
	}

	return {
		assets: assets,
		name: "uni",
		preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){

			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

			createBackground()
			createUniUI()

			uniSong = game.add.audio('uniSong')
			game.sound.setDecodedCallback(uniSong, function(){
				uniSong.loopFull(0.6)
			}, this);

			game.onPause.add(function(){
				game.sound.mute = true
			} , this);

			game.onResume.add(function(){
				game.sound.mute = false
			}, this);

			initialize()

			// createHearts()
			createPointsBar()
            createHearts()
			createGameObjects()
			createClock()
			createTutorial()

			buttons.getButton(uniSong,sceneGroup)
		}
	}
}()