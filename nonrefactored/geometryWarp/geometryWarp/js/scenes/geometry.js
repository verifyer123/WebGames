
var soundsPath = "../../shared/minigames/sounds/"
var geometry = function(){

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
				name: "atlas.geometry",
				json: "images/geometry/atlas.json",
				image: "images/geometry/atlas.png"
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

	var SHIPS_SKINS = [
		"ship1",
		"ship2",
		"ship3"
	]

	var LADOS_INDEX = [
		{angles: 3},
		{angles: 4},
		{angles: 5}
	]

	var FIGURES = [
		{name:"cuadrado" ,angles: 4},
		{name:"equilatero" ,angles: 3},
		{name:"isosceles" ,angles: 3},
		{name:"pentagono" ,angles: 5},
		{name:"pentagono1" ,angles: 5},
		{name:"rectangulo" ,angles: 4},
		{name:"rombo" ,angles: 4},
		{name:"scaleno" ,angles: 3},
		{name:"trapezio" ,angles: 4},
	]

	// var ROUNDS = [
	//     {continent: "america", flags: ["mexico", "usa"]},
	//     {continent: "america", numFlags: 4},
	//     {continent: "random", numFlags: 4}]

	var lives
	var sceneGroup = null
	var gameIndex = 33
	var tutoGroup
	var geometrySong
	var heartsGroup = null
	var pullGroup = null
	var clock
	var timeValue
	var quantNumber
	var inputsEnabled
	var pointsBar
	var roundCounter
	var btnOn
	var swipe
	var ship
	var timeElapsed
	var asteroidsList
	var asteroidsInGame
	var speed

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function preload(){

		game.stage.disableVisibilityChange = false;
		game.load.audio('geometrySong', soundsPath + 'songs/wormwood.mp3');

		game.load.image('introscreen',"images/geometry/introscreen.png")
		game.load.image('howTo',"images/geometry/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/geometry/play" + localization.getLanguage() + ".png")

		game.load.spine('ship', "images/spine/ship/ship.json")
		game.load.spine('figures', "images/spine/figures/figures.json")

		buttons.getImages(game)

	}

	function initialize(){

		game.stage.backgroundColor = "#ffffff"
		//gameActive = true
		lives = NUM_LIFES
		timeValue = 2000
		quantNumber = 2
		roundCounter = 0
		timeElapsed = 0
		asteroidsList = []
		asteroidsInGame = []
		speed = 2

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
		// }

	}

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.geometry','xpcoins')
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
			spineSkeleton.setToSetupPose()
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
	
	function createGeometryUI() {
		var lineGroup = game.add.group()
		lineGroup.x = game.world.centerX
		lineGroup.y = game.world.height - 100
		sceneGroup.add(lineGroup)

		var line = lineGroup.create(0, 0, "atlas.geometry", "line")
		line.anchor.setTo(0.5, 0.5)

		var starX = -150
		for(var btnIndex = 0; btnIndex < 3; btnIndex++){
			var x = starX + btnIndex * 150
			var btnOff = lineGroup.create(x, 0, "atlas.geometry", "off")
			btnOff.anchor.setTo(0.5, 0.5)
		}

		btnOn = lineGroup.create(-150, 0, "atlas.geometry", "on")
		btnOn.index = -1
		btnOn.anchor.setTo(0.5, 0.5)
		// btnOn.alpha = 0

	}
	
	function createGameObjects(){
		pullGroup = game.add.group()
		pullGroup.x = -game.world.centerX * 2
		pullGroup.y = -game.world.centerY * 2
		sceneGroup.add(pullGroup)
		pullGroup.alpha = 0

		ship = createSpine("ship", "ship1")
		ship.setAnimation(["IDLE"])
		sceneGroup.add(ship)
		ship.x = game.world.centerX
		ship.y = game.world.centerY + 200
		ship.index = 1

		for(var figureIndex = 0; figureIndex < 6; figureIndex++){
			var asteroid = createSpine("figures", "ship1")
			asteroid.setAnimation(["IDLE"])
			pullGroup.add(asteroid)
			asteroidsList.push(asteroid)
		}

	}

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);

		particle.makeParticles('atlas.geometry',key);
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
		geometrySong.stop()
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

	function startRound(notStarted) {


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

		var heartImg = group.create(0,0,'atlas.geometry','life_box')

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

	function startTimer(onComplete) {
		var delay = 500
		// clock.bar.scale.x = clock.bar.origScale
		if (clock.tween)
			clock.tween.stop()


		clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeValue * quantNumber * 1000,Phaser.Easing.linear,true )
		clock.tween.onComplete.add(function(){
			onComplete()
		})
	}

	function onClickPlay(rect) {
		rect.inputEnabled = false
		sound.play("pop")
		game.add.tween(tutoGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){

			tutoGroup.y = -game.world.height
			// startTimer(missPoint)
		})
	}

	function createTutorial(){

		tutoGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
		sceneGroup.add(tutoGroup)

		var rect = new Phaser.Graphics(game)
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

		var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.geometry','gametuto')
		tuto.anchor.setTo(0.5,0.5)

		var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)

		var inputName = 'movil'

		if(game.device.desktop){
			inputName = 'desktop'
		}

		//console.log(inputName)
		var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.geometry',inputName)
		inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)

		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.geometry','button')
		button.anchor.setTo(0.5,0.5)

		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
	}

	function createClock(){

		clock = game.add.group()
		clock.x = game.world.centerX
		clock.y = game.world.centerY + 80
		sceneGroup.add(clock)

		var clockImage = clock.create(0,0,'atlas.geometry','clock')
		clockImage.anchor.setTo(0.5,0.5)

		var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.geometry','bar')
		clockBar.anchor.setTo(0,0.5)
		clockBar.width = clockImage.width*0.76
		clockBar.height = 22
		clockBar.origScale = clockBar.scale.x

		clock.bar = clockBar

	}
	
	function spawnAsteroid() {
		var asteroid = asteroidsList[asteroidsInGame.length]
		sceneGroup.add(asteroid)
		asteroid.x = game.world.centerX
		asteroid.y = -100
		var rndIndex = game.rnd.integerInRange(0, FIGURES.length - 1)
		asteroid.setSkinByName(FIGURES[rndIndex].name)
		asteroid.angles = FIGURES[rndIndex].angles
		asteroidsInGame.push(asteroid)
	}
	
	function update() {
		timeElapsed += game.time.elapsedMS
		if(timeElapsed >= timeValue){
			timeElapsed = 0
			spawnAsteroid()
		}

		for(var asteroidIndex = asteroidsInGame.length - 1; asteroidIndex >= 0; asteroidIndex--){
			var asteroid = asteroidsInGame[asteroidIndex]
			asteroid.y += speed
			if(asteroid.y >= ship.y - 100){
				asteroid.setAnimation(["LOSE"])
				asteroidsInGame.splice(asteroidIndex, 1)
			}
		}

		var direction = swipe.check()
		if (direction !== null) {
			switch (direction.direction) {
				case swipe.DIRECTION_LEFT:
					btnOn.index = btnOn.index - 1 < -1 ? -1 : btnOn.index - 1
					game.add.tween(btnOn).to({x:btnOn.index * 150}, 500, Phaser.Easing.Cubic.Out, true)
					ship.index = btnOn.index + 1
					ship.setSkinByName(SHIPS_SKINS[btnOn.index + 1])
					break;
				case swipe.DIRECTION_RIGHT:
					btnOn.index = btnOn.index + 1 > 1 ? 1 : btnOn.index + 1
					game.add.tween(btnOn).to({x:btnOn.index * 150}, 500, Phaser.Easing.Cubic.Out, true)
					ship.index = btnOn.index + 1
					ship.setSkinByName(SHIPS_SKINS[btnOn.index + 1])
					break;
			}
		}
	}

	return {
		assets: assets,
		name: "geometry",
		preload:preload,
		update:update,
		create: function(event){

			swipe = new Swipe(game)
			sceneGroup = game.add.group()

			var background = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.geometry', "tile")
			sceneGroup.add(background)
			
			background.update = function () {
				this.tilePosition.y += 5
			}

			geometrySong = game.add.audio('geometrySong')
			game.sound.setDecodedCallback(geometrySong, function(){
				geometrySong.loopFull(0.6)
			}, this);

			game.onPause.add(function(){
				game.sound.mute = true
			} , this);

			game.onResume.add(function(){
				game.sound.mute = false
			}, this);

			initialize()

			createHearts()
			createPointsBar()
			createGeometryUI()
			createGameObjects()
			// createClock()
			startRound(true)
			createTutorial()

			buttons.getButton(geometrySong,sceneGroup)
		}
	}
}()