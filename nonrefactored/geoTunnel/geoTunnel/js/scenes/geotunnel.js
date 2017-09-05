
var soundsPath = "../../shared/minigames/sounds/"
var geotunnel = function(){

	var localizationData = {
		"EN":{
			"howTo":"How to Play?",
			"moves":"Moves left",
			"rhomboid":"Rhombus",
			"trapezoid":"Trapezoid",
			"hexagon":"Hexagon"
		},

		"ES":{
			"moves":"Movimientos extra",
			"howTo":"¿Cómo jugar?",
			"rhomboid":"Rombo",
			"trapezoid":"Trapecio",
			"hexagon":"Hexágono"
		}
	}

	var assets = {
		atlases: [
			{
				name: "atlas.geotunnel",
				json: "images/geotunnel/atlas.json",
				image: "images/geotunnel/atlas.png"
			}
		],
		images: [
			{   name:"fondo",
				file: "images/geotunnel/fondo.png"}
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
			{   name: "explode",
				file: soundsPath + "laserexplode.mp3"},
			{   name: "beep",
				file: soundsPath + "robotBeep.mp3"},
			{   name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{   name: "spaceship",
				file: soundsPath + "spaceship.mp3"},
			{   name: "whoosh",
				file: soundsPath + "whoosh.mp3"}
		]
	}

	var NUM_LIFES = 1
	var INIT_SPEED = 2.2
	var INIT_SPAWN_TIME = 3000
	var FORMS = ["form1", "form2", "form3", "form4", "form5", "form6"]

	var ROUNDS = [
		{order:["triangle"], figure:"rhomboid"},
		{order:["circle", "circle", "triangle", "circle", "triangle"], figure:"trapezoid"},
		{circles:12, triangles:5, order:"random", figure:"hexagon"},
		{circles:12, triangles:5, order:"random", figure:"random"}
	    ]

	var FIGURE_DATA = {
		"rhomboid":{numTriangles: 1},
		"trapezoid":{numTriangles: 2},
		"hexagon":{numTriangles: 5}
	}

	var FIGURES = ["rhomboid", "trapezoid", "hexagon"]

	var lives
	var sceneGroup = null
	var gameIndex = 85
	var tutoGroup
	var geotunnelSong
	var heartsGroup = null
	var pullGroup = null
	var clock
	var timeValue
	var quantNumber
	var inputsEnabled
	var pointsBar
	var roundCounter
	var filter
	var ship
	var cursors
	var figuresInGame
	var triangleList
	var circleList
	var figureList
	var timeElapsed
	var gameGroup
	var maxDistance
	var isActive
	var figureCounter
	var figureResult
	var correctParticle
	var wrongParticle
	var container
	var speed
	var timeSpawn
	var numSpawn
	var spaceButton

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
		figuresInGame = []
		triangleList = []
		circleList = []
		figureList = []
		timeElapsed = 0
		speed = INIT_SPEED
		timeSpawn = INIT_SPAWN_TIME
		numSpawn = 1

		sceneGroup.alpha = 0
		game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
		inputsEnabled = false

		loadSounds()

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
		timeSpawn = timeSpawn - timeSpawn * 0.2 < 500 ? 500 : timeSpawn - timeSpawn * 0.2
		speed += 1 * 0.2
		roundCounter = roundCounter + 1
		if(roundCounter % 6 === 0)
			numSpawn++
		// }

	}

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.geotunnel','xpcoins')
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

		for(var triangleIndex = 0; triangleIndex < 20; triangleIndex++){
			var triangle = pullGroup.create(0,0, "atlas.geotunnel", "triangle")
			triangle.anchor.setTo(0.5, 0.5)
			triangle.type = "triangle"
			triangleList.push(triangle)
		}

		for(var circleIndex = 0; circleIndex < 20; circleIndex++){
			var circle = pullGroup.create(0,0, "atlas.geotunnel", "foe")
			circle.anchor.setTo(0.5, 0.5)
			circle.type = "circle"
			circleList.push(circle)
		}

	}

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);

		particle.makeParticles('atlas.geotunnel',key);
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
		sound.play("explode")
		geotunnelSong.stop()
		inputsEnabled = false
		isActive = false

		game.add.tween(filter).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
			filter.destroy()
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number, gameIndex)

			//amazing.saveScore(pointsBar.number)
			sceneloader.show("result")
			sound.play("gameLose")
		})
	}

	function preload(){

		game.stage.disableVisibilityChange = false;
		game.load.audio('geotunnelSong', soundsPath + 'songs/game_on.mp3');

		game.load.image('introscreen',"images/geotunnel/introscreen.png")
		game.load.image('hex',"images/geotunnel/hex.png")
		game.load.image('howTo',"images/geotunnel/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/geotunnel/play" + localization.getLanguage() + ".png")
		game.load.script('filter', 'js/tunnel.js');
		game.load.spine('figures', "images/spine/figures/figures.json")

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
	
	function addFiguresList(round) {
		figureList = []
		if(round.order === "random"){
			for(var circleIndex = 0; circleIndex < round.circles; circleIndex++){
				figureList.push("circle")
			}

			for(var triangleIndex = 0; triangleIndex < round.triangles; triangleIndex++){
				figureList.push("triangle")
			}
			Phaser.ArrayUtils.shuffle(figureList)
		}else{
			figureList = round.order
		}
	}

	function startRound() {
		var round = roundCounter < ROUNDS.length ? ROUNDS[roundCounter] : ROUNDS[ROUNDS.length - 1]
		figureCounter = 0
		addFiguresList(round)
		var figure
		if(round.figure === "random"){
			var rndNumber = game.rnd.integerInRange(0, FIGURES.length - 1)
			figure = FIGURES[rndNumber]
		}else
			figure = round.figure
		figureResult = FIGURE_DATA[figure]

		ship.number = Math.PI / 2
		ship.direction = 1
		ship.triangles = 0
		ship.alpha = 1
		ship.y = game.world.height * 0.5 + 100
		ship.rotation = Math.PI
		ship.setSkinByName(FORMS[ship.triangles])

		var containerText = container.containerText
		containerText.scale.x = 0.4
		containerText.scale.y = 0.4
		containerText.alpha = 0
		containerText.text = localizationData[localization.getLanguage()][figure]
		game.add.tween(containerText.scale).to({x:1, y:1}, 500, Phaser.Easing.Back.Out, true, 500)
		game.add.tween(containerText).to({alpha:1}, 500, Phaser.Easing.Cubic.Out, true, 500)

		sound.play("spaceship")
		var moveShip = game.add.tween(ship).to({y:250}, 800, Phaser.Easing.Cubic.Out, true)
		moveShip.onComplete.add(function () {
			isActive = true
			ship.active = true
		})
		timeElapsed = 3000

	}

	function missPoint(){

		sound.play("wrong")
		inputsEnabled = false

		lives--;
		wrongParticle.x = ship.centerX
		wrongParticle.y = ship.centerY
		wrongParticle.start(true, 1000, null, 5)
		// heartsGroup.text.setText('X ' + lives)

		// var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
		// scaleTween.onComplete.add(function(){
		// 	game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		// })

		if(lives === 0){
			stopGame(false)
		}

		// addNumberPart(heartsGroup.text,'-1')
	}

	function createHearts(){

		heartsGroup = game.add.group()
		heartsGroup.y = 10
		sceneGroup.add(heartsGroup)

		var pivotX = 10
		var group = game.add.group()
		group.x = pivotX
		heartsGroup.add(group)

		var heartImg = group.create(0,0,'atlas.geotunnel','life_box')

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

			sceneGroup.rectInput.inputEnabled = true
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

		var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.geotunnel','gametuto')
		tuto.anchor.setTo(0.5,0.5)

		var tutoCompl = tutoGroup.create(game.world.centerX - 120, game.world.centerY + 125,'atlas.geotunnel','tcomplement')
		tutoCompl.anchor.setTo(0.5,0.5)

		var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)

		var inputName = 'movil'

		if(game.device.desktop){
			inputName = 'desktop'
		}

		//console.log(inputName)
		var inputLogo = tutoGroup.create(game.world.centerX + 120 ,game.world.centerY + 125,'atlas.geotunnel',inputName)
		inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)

		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.geotunnel','button')
		button.anchor.setTo(0.5,0.5)

		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
	}

	function spawnFigure() {
		var type = figureList[figureCounter]
		console.log(type, figureCounter)
		figureCounter = figureCounter + 1 < figureList.length ? figureCounter + 1 : 0
		var figure
		if(type === "triangle")
			figure = triangleList.pop()
		else
			figure = circleList.pop()

		gameGroup.add(figure)
		gameGroup.sendToBack(figure)
		figure.scale.x = 0.2
		figure.scale.y = 0.2
		figure.distance = 2
		figure.alpha = 1
		var rndAngle = game.rnd.integerInRange(0, 359)
		var toRadians = rndAngle * (180/Math.PI)
		figure.radians = toRadians
		figure.x = Math.cos(toRadians) * figure.distance
		figure.y = Math.sin(toRadians) * figure.distance
		figuresInGame.push(figure)
	}

	function clearFigures() {
		for(var figureIndex = 0; figureIndex < figuresInGame.length; figureIndex++){
			var figure = figuresInGame[figureIndex]
			game.add.tween(figure.scale).to({x:0.1, y:0.1}, 400, Phaser.Easing.Cubic.Out, true)
			var dissapear = game.add.tween(figure).to({alpha:0}, 400, Phaser.Easing.Cubic.Out, true)
			dissapear.onComplete.add(toPullGroup)
			
			if(figure.type === "triangle"){
				triangleList.push(figure)
			}else{
				circleList.push(figure)
			}
		}
		figuresInGame = []
	}

	function showCorrectParticle(){
		correctParticle.start(true, 1000, null, 5)
		addPoint(figureResult.numTriangles + 1)
	}
	
	function moveShipResult() {
		var tween1 = game.add.tween(ship).to({x:0, y:0}, 800, Phaser.Easing.Cubic.Out, null, 800)
		game.add.tween(ship).to({rotation: Math.PI * 2}, 800, Phaser.Easing.Cubic.Out, true, 800)
		// game.add.tween(ship).to({angle:360}, 800, Phaser.Easing.Cubic.Out, true, 1600)
		var tween2 = game.add.tween(ship.scale).to({x:1.2, y:1.2}, 400, Phaser.Easing.Cubic.Out).yoyo(true)
		var tween3 = game.add.tween(ship).to({alpha:0}, 800, Phaser.Easing.Cubic.Out)

		tween1.chain(tween2)
		tween2.chain(tween3)
		tween2.onStart.add(showCorrectParticle)
		tween1.onStart.add(function () {
			sound.play("swipe")
		})
		tween1.start()
		tween3.onComplete.add(startRound)
	}

	function completeRound() {
		isActive = false
		clearFigures()
		moveShipResult()
		game.add.tween(container.scale).to({x:1.2, y:1.2}, 300, Phaser.Easing.Cubic.Out, true, 1600).yoyo(true)
		game.add.tween(container.containerText).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true, 2400)
	}

	function addTriangle(){
		sound.play("beep")
		ship.triangles = ship.triangles + 1 > 5 ? 0 : ship.triangles + 1
		ship.setSkinByName(FORMS[ship.triangles])

		game.add.tween(ship.scale).to({x:1.2, y:1.2}, 300, Phaser.Easing.Sinusoidal.InOut, true).yoyo(true)
		if(ship.triangles >= figureResult.numTriangles){
			completeRound()
		}
		// pullGroup.add(triangle)
	}

	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

	}

	function toPullGroup(obj){
		pullGroup.add(obj)
	}

	function update() {
		// ship.number += 0.05
		if(ship.active) {
			ship.x = Math.cos(ship.number) * 250
			ship.y = Math.sin(ship.number) * 250
			ship.number += 0.05 * ship.direction
			ship.rotation = Math.atan2(ship.y, ship.x) + Math.PI / 2
			// console.log(ship.angle)
		}
		// ship.angle += 5
		if(game.device.desktop){
			if((spaceButton.isDown)&&(!spaceButton.isPressed)){
				spaceButton.isPressed = true
				changeDirection()
			}

			if(spaceButton.isUp){
				spaceButton.isPressed = false
			}

			//
		// 	if(cursors.left.isDown){
		// 		ship.number += 0.05
		// 	}else if(cursors.right.isDown){
		// 		ship.number -= 0.05
		// 	}
		}

		timeElapsed += game.time.elapsedMS
		if(timeElapsed >= timeSpawn){
			timeElapsed = 0
			for(var i=0; i<numSpawn; i++)
				spawnFigure()
		}

		for(var figureIndex = figuresInGame.length - 1; figureIndex >= 0; figureIndex--){
			var figure = figuresInGame[figureIndex]
			if(figure){
				figure.distance += figure.distance * speed * 0.01 //Math.tan(triangle.distance / game.world.centerX) * 2 + 2
				figure.x = Math.cos(figure.radians) * figure.distance
				figure.y = Math.sin(figure.radians) * figure.distance
				var scale = figure.distance * 0.5 / 140
				figure.scale.x = scale
				figure.scale.y = scale
				figure.angle += 2

				if(figure.distance >= maxDistance + 500){
					figuresInGame.splice(figureIndex, 1)
					pullGroup.add(figure)
					if(figure.type === "triangle")
						triangleList.unshift(figure)
					else if(figure.type === "circle")
						circleList.unshift(figure)
				}

				var collide = checkOverlap(figure, ship.hitBox)
				if(collide){
					figuresInGame.splice(figureIndex, 1)
					figure.x = 0
					figure.y = 0
					figure.scale.x = 1
					figure.scale.y = 1
					ship.add(figure)
					var dissapear = game.add.tween(figure).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)
					dissapear.onComplete.add(toPullGroup)
					if(figure.type === "triangle"){
						triangleList.unshift(figure)
						addTriangle()
					}else{
						circleList.unshift(figure)
						missPoint()
					}
				}
			}
		}

	}
	
	function createShip() {
		gameGroup = game.add.group()
		gameGroup.x = game.world.centerX
		gameGroup.y = game.world.centerY
		sceneGroup.add(gameGroup)

		// ship = gameGroup.create(0,0,"atlas.geotunnel", "token")
		// ship.anchor.setTo(0.5, 0.5)
		ship = createSpine("figures", "form1", "IDLE", 0, 0)
		ship.number = Math.PI / 2
		ship.direction = 1
		ship.triangles = 0
		ship.active = false
		ship.y = game.world.height * 0.5 + 100
		ship.rotation = Math.PI

		var hitBox = game.add.graphics()
		hitBox.beginFill(0xffffff)
		hitBox.drawRect(0,0, 30, 30)
		hitBox.x = -hitBox.width * 0.5
		hitBox.y = -hitBox.height * 0.5
		hitBox.alpha = 0
		hitBox.endFill()
		ship.add(hitBox)
		ship.hitBox = hitBox

		gameGroup.add(ship)
	}
	
	function changeDirection() {
		sound.play("cut")
		ship.direction*= -1
	}
	
	function createTextContainer() {
		container = game.add.group()
		container.x = game.world.centerX
		container.y = 100
		sceneGroup.add(container)

		var containerBg = game.add.graphics()
		containerBg.beginFill(0x000000)
		containerBg.drawRoundedRect(0,0, 250, 70, 30)
		containerBg.alpha = 0.4
		containerBg.endFill()
		containerBg.x = -250 * 0.5
		containerBg.y = -70 * 0.5
		container.add(containerBg)

		var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var containerText = new Phaser.Text(game, 0, 5, "Trapezoid", fontStyle)
		containerText.anchor.setTo(0.5, 0.5)
		containerText.alpha = 0
		container.add(containerText)
		container.containerText = containerText
	}
	
	return {
		assets: assets,
		name: "geotunnel",
		preload:preload,
		update:function () {
			if(isActive)
				update()
			if(filter)
				filter.update()
		},
		create: function(event){

			sceneGroup = game.add.group()
			yogomeGames.mixpanelCall("enterGame",gameIndex);
			// cursors = game.input.keyboard.createCursorKeys()
			spaceButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

			var background = game.add.sprite(0, 0, 'fondo')
			background.width = game.world.width
			background.height = game.world.height
			sceneGroup.add(background)

			filter = game.add.filter('Tunnel', game.world.width, game.world.height, background.texture)

			//	You have the following value to play with (default value is 2.0):
			filter.origin = 2.0;

			background.filters = [filter];

			var hexagonGroup = game.add.group()
			hexagonGroup.x = game.world.centerX
			hexagonGroup.y = game.world.centerY
			sceneGroup.add(hexagonGroup)
			maxDistance = game.world.centerX > game.world.centerY ? game.world.centerX : game.world.centerY

			// for(var lineIndex = 0; lineIndex < 6; lineIndex++){
			// 	var currentLine = game.add.graphics()
			// 	currentLine.lineStyle(5, 0x7F6E0D, 1)
			// 	currentLine.alpha = 0.5
			// 	currentLine.moveTo(game.world.centerX, game.world.centerY)
			// 	var radians = 60 * lineIndex * (Math.PI / 180)
			// 	var toX = game.world.centerX + Math.sin(radians) * width
			// 	var toY = game.world.centerY + Math.cos(radians) * width
			// 	currentLine.lineTo(toX, toY)
			// 	sceneGroup.add(currentLine)
			// }

			var hex = sceneGroup.create(0,0, "hex")
			hex.anchor.setTo(0.5, 0.5)
			hex.x = game.world.centerX
			hex.y = game.world.centerY
			hex.tint = 0x7F6E0D

			geotunnelSong = game.add.audio('geotunnelSong')
			game.sound.setDecodedCallback(geotunnelSong, function(){
				geotunnelSong.loopFull(0.6)
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
			createGameObjects()
			createShip()
			createTextContainer()
			// createClock()

			var rectInput = game.add.graphics()
			rectInput.beginFill(0x000000)
			rectInput.drawRect(-2,-2, game.world.width + 2, game.world.height + 2)
			rectInput.alpha = 0
			rectInput.endFill()
			rectInput.events.onInputDown.add(changeDirection)
			sceneGroup.rectInput = rectInput

			createTutorial()

			correctParticle = createPart("star")
			correctParticle.x = game.world.centerX
			correctParticle.y = game.world.centerY
			sceneGroup.add(correctParticle)

			wrongParticle = createPart("wrong")
			sceneGroup.add(wrongParticle)

			buttons.getButton(geotunnelSong,sceneGroup)
		}
	}
}()