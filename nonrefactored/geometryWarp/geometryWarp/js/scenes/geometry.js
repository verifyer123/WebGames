
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
			{	name: "laser",
				file: soundsPath + "laser2.mp3"},
			{	name: "laserExplode",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "explosion",
				file: soundsPath + "explosion.mp3"},
			{	name: "swipe",
				file: soundsPath + "swipe.mp3"},
			{	name: "wrong",
				file: soundsPath + "wrong.mp3"},
			{	name: "right",
				file: soundsPath + "rightChoice.mp3"},
			{   name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{   name: "error",
				file: soundsPath + "error.mp3"}
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
		{name:"trapezio" ,angles: 4}
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
	var gameGroup
	var correctParticle
	var wrongParticle
	var isActive

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
		timeValue = 4000
		quantNumber = 2
		roundCounter = 0
		timeElapsed = timeValue
		asteroidsList = []
		asteroidsInGame = []
		speed = 1.5
		isActive = false

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

		if(pointsBar.number % 5 === 0){
			timeValue-=timeValue * 0.20
			speed += 0.5
		}

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


		spineGroup.setAnimation = function (animations, onComplete, args) {
			var entry
			for(var index = 0; index < animations.length; index++) {
				var animation = animations[index]
				var loop = index === animations.length - 1
				if (index === 0)
					entry = spineSkeleton.setAnimationByName(0, animation, loop)
				else
					spineSkeleton.addAnimationByName(0, animation, loop)

			}

			if (args)
				entry.args = args

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

	function tweenTint(obj, startColor, endColor, time, delay, callback, yoyo) {
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

			if(yoyo) {
				colorTween.yoyo(true)
			}
			// finally, start the tween
			colorTween.start();
		}
	}
	
	function shotAction(input) {
		if((asteroidsInGame[0])&&(!ship.shooting)&&(ship.active)){
			ship.shooting = true
			ship.shot.alpha = 1
			ship.shot.y = -25
			sound.play("laser")

			btnOn.index = input.index - 1
			btnOn.x = btnOn.index * 150
			if(btnOn.tween1)
				btnOn.tween1.stop()
			if(btnOn.tween2)
				btnOn.tween2.stop()

			btnOn.tween1 = game.add.tween(btnOn.scale).to({x:1, y:1}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)
			btnOn.tween2 = game.add.tween(btnOn).to({alpha:1}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)
			ship.angles = LADOS_INDEX[btnOn.index + 1].angles
			ship.setSkinByName(SHIPS_SKINS[btnOn.index + 1])

			tweenTint(input.btnOff, 0xffffff, 0xff0000, 200, 0, null, true)

			// if(asteroidsInGame[0].angles === ship.angles){
			//
			// }
		}
	}
	
	function createGeometryUI() {
		var lineGroup = game.add.group()
		lineGroup.x = game.world.centerX
		lineGroup.y = game.world.height - 100
		sceneGroup.add(lineGroup)

		var line = lineGroup.create(0, 0, "atlas.geometry", "line")
		line.anchor.setTo(0.5, 0.5)

		btnOn = lineGroup.create(-150, 0, "atlas.geometry", "on")
		btnOn.index = -1
		btnOn.anchor.setTo(0.5, 0.5)
		btnOn.scale.setTo(0.6, 0.6)
		btnOn.alpha = 0
		btnOn.tint = 0xff0000

		var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
		var starX = -150
		for(var btnIndex = 0; btnIndex < 3; btnIndex++){
			var x = starX + btnIndex * 150
			var btnOff = lineGroup.create(x, 0, "atlas.geometry", "off")
			btnOff.anchor.setTo(0.5, 0.5)

			var textAngle = LADOS_INDEX[btnIndex].angles
			var angleText = new Phaser.Text(game, 0, 5, textAngle, fontStyle)
			angleText.anchor.setTo(0.5, 0.5)
			angleText.x = x
			lineGroup.add(angleText)

			var input = game.add.graphics()
			input.beginFill(0xffffff)
			input.drawRect(0,0,100,100)
			input.endFill()
			input.alpha = 0
			lineGroup.add(input)
			input.x = x - 50
			input.y = -50
			input.btnOff = btnOff

			input.inputEnabled = true
			input.index = btnIndex
			input.events.onInputDown.add(shotAction)
		}

		correctParticle = createPart("star")
		sceneGroup.add(correctParticle)

		wrongParticle = createPart("wrong")
		sceneGroup.add(wrongParticle)
		// btnOn.alpha = 0

	}

	function updateShot(){
		if(ship.shooting){
			ship.shot.y -= 10
			var collide = checkOverlap(ship.shot, asteroidsInGame[0].hitBox)
			if (collide) {
				ship.shooting = false
				if(asteroidsInGame[0].angles === ship.angles){
					correctParticle.x = asteroidsInGame[0].centerX
					correctParticle.y = asteroidsInGame[0].centerY
					sceneGroup.bringToTop(correctParticle)
					correctParticle.start(true, 1000, null, 5)
					destroyAsteroid(0)
					sound.play("laserExplode")
					addPoint(1)
				}else{
					sound.play("error")
					wrongParticle.x = asteroidsInGame[0].centerX
					wrongParticle.y = asteroidsInGame[0].centerY
					sceneGroup.bringToTop(wrongParticle)
					wrongParticle.start(true, 1000, null, 5)
					asteroidsInGame[0].speed = 10
					ship.active = false
				}
				ship.shot.y = 20
				ship.shot.alpha = 0
			}
		}
	}
	
	function createGameObjects(){
		pullGroup = game.add.group()
		pullGroup.x = -game.world.centerX * 2
		pullGroup.y = -game.world.centerY * 2
		sceneGroup.add(pullGroup)
		pullGroup.alpha = 0

		gameGroup = game.add.group()
		gameGroup.x = game.world.centerX
		sceneGroup.add(gameGroup)

		for(var figureIndex = 0; figureIndex < 6; figureIndex++){
			var asteroid = createSpine("figures", "ship1")
			asteroid.setAnimation(["IDLE"])
			pullGroup.add(asteroid)
			asteroidsList.push(asteroid)
			asteroid.speed = 0

			var hitBox2 = new Phaser.Graphics(game)
			hitBox2.beginFill(0xFFFFFF)
			hitBox2.drawRect(0,0,100, 100)
			hitBox2.alpha = 0
			hitBox2.endFill()
			hitBox2.x = -hitBox2.width * 0.5
			hitBox2.y = -hitBox2.height + 50
			asteroid.add(hitBox2)
			asteroid.hitBox = hitBox2
		}

		ship = createSpine("ship", "ship1")
		ship.setAnimation(["IDLE"])
		sceneGroup.add(ship)
		ship.x = game.world.centerX
		ship.y = game.world.centerY + 200
		ship.index = 1
		var shot = ship.create(0,20,"atlas.geometry", "shot")
		shot.anchor.setTo(0.5, 0.5)
		shot.alpha = 0
		ship.shot = shot

		var hitBox = new Phaser.Graphics(game)
		hitBox.beginFill(0xFFFFFF)
		hitBox.drawRect(0,0,100, 100)
		hitBox.alpha = 0
		hitBox.endFill()
		hitBox.x = -hitBox.width * 0.5
		hitBox.y = -hitBox.height + 55
		ship.add(hitBox)
		ship.hitBox = hitBox

	}

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);

		particle.makeParticles('atlas.geometry',key);
		particle.minParticleSpeed.setTo(-200, -200);
		particle.maxParticleSpeed.setTo(200, 200);
		particle.minParticleScale = 0.6;
		particle.maxParticleScale = 1;
		// particle.gravity = 100;
		// particle.angularDrag = 30;

		return particle

	}

	function stopGame(win){

		//objectsGroup.timer.pause()
		//timer.pause()
		isActive = false
		geometrySong.stop()
		// clock.tween.stop()
		inputsEnabled = false

		var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2200)
		tweenScene.onComplete.add(function(){

			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number, gameIndex)

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

	function startRound() {
		ship.active = true
		isActive = true
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
			ship.spine.setAnimationByName(0, "LOSE", false)
		}
		else{
			// startRound()
			ship.setAnimation(["DAMAGED", "DAMAGED", "IDLE"])
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

	function onClickPlay(rect) {
		rect.inputEnabled = false
		sound.play("pop")
		game.add.tween(tutoGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){

			tutoGroup.y = -game.world.height
			startRound()
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
	
	function spawnAsteroid() {
		var asteroid = asteroidsList.pop()
		gameGroup.add(asteroid)
		asteroid.y = -100
		var rndIndex = game.rnd.integerInRange(0, FIGURES.length - 1)
		asteroid.setSkinByName(FIGURES[rndIndex].name)
		asteroid.angles = FIGURES[rndIndex].angles
		asteroidsInGame.push(asteroid)
	}
	
	function resetAsteroid(){
		var asteroid = this.args
		console.log(asteroid)
		pullGroup.add(asteroid)
		asteroidsList.push(asteroid)
	}

	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

	}

	function destroyAsteroid(asteroidIndex){
		var removedAsteroid = asteroidsInGame.splice(asteroidIndex, 1)
		removedAsteroid[0].setAnimation(["LOSE", "IDLE"], resetAsteroid, removedAsteroid[0])
	}

	function update() {
		timeElapsed += game.time.elapsedMS
		if(timeElapsed >= timeValue){
			timeElapsed = 0
			spawnAsteroid()
		}

		// if((asteroidsInGame[0])&&(!ship.shooting)){
		// 	if(asteroidsInGame[0].angles === ship.angles){
		// 		ship.shooting = true
		// 		ship.shot.alpha = 1
		// 		ship.shot.y = -25
		// 	}
		// }

		updateShot()

		for(var asteroidIndex = asteroidsInGame.length - 1; asteroidIndex >= 0; asteroidIndex--){
			var asteroid = asteroidsInGame[asteroidIndex]
			asteroid.y += asteroid.speed > 0 ? asteroid.speed : speed
			asteroid.angle += speed
			var collide = checkOverlap(ship.hitBox, asteroid.hitBox)
			if(collide){
				missPoint()
				sound.play("explosion")
				destroyAsteroid(asteroidIndex)
				ship.shot.y = -25
				ship.shot.alpha = 0
				ship.shooting = false
				ship.active = true
				asteroid.speed = 0
			}
		}

		// var direction = swipe.check()
		// if (direction !== null) {
		// 	switch (direction.direction) {
		// 		case swipe.DIRECTION_LEFT:
		// 			btnOn.index = btnOn.index - 1 < -1 ? -1 : btnOn.index - 1
		// 			game.add.tween(btnOn).to({x:btnOn.index * 150}, 500, Phaser.Easing.Cubic.Out, true)
		// 			ship.angles = LADOS_INDEX[btnOn.index + 1].angles
		// 			ship.setSkinByName(SHIPS_SKINS[btnOn.index + 1])
		// 			break;
		// 		case swipe.DIRECTION_RIGHT:
		// 			btnOn.index = btnOn.index + 1 > 1 ? 1 : btnOn.index + 1
		// 			game.add.tween(btnOn).to({x:btnOn.index * 150}, 500, Phaser.Easing.Cubic.Out, true)
		// 			ship.angles = LADOS_INDEX[btnOn.index + 1].angles
		// 			ship.setSkinByName(SHIPS_SKINS[btnOn.index + 1])
		// 			break;
		// 	}
		// }
	}

	return {
		assets: assets,
		name: "geometry",
		preload:preload,
		update:function() {
			if(isActive)
				update()
		},
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
			createTutorial()

			buttons.getButton(geometrySong,sceneGroup)
		}
	}
}()