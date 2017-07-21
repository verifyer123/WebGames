
var soundsPath = "../../shared/minigames/sounds/"
var astrono = function(){

	var localizationData = {
		"EN":{
			"howTo":"How to Play?",
			"moves":"Moves left",
			"triangle":"Triangle",
			"square":"Square",
			"rectangle":"Rectangle",
			"rhomboid":"Rhombus",
			"trapezoid":"Trapezoid",
			"pentagon":"Pentagon",
			"hexagon":"Hexagon"
		},

		"ES":{
			"moves":"Movimientos extra",
			"howTo":"¿Cómo jugar?",
			"triangle":"Triángulo",
			"square":"Cuadrado",
			"rectangle":"Rectángulo",
			"rhomboid":"Rombo",
			"trapezoid":"Trapecio",
			"pentagon":"Pentágono",
			"hexagon":"Hexágono"
		}
	}


	var assets = {
		atlases: [
			{
				name: "atlas.astrono",
				json: "images/astrono/atlas.json",
				image: "images/astrono/atlas.png"
			}
		],
		images: [
			{   name:"skygradient",
				file: "images/astrono/skygradient.png"}
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
	var MAX_STARTS = 6

	var FIGURES = [
		{
			name:"rectangle",
			coordinates: [{x:-180, y:-120}, {x: 180, y:-120}, {x:180, y:120}, {x:-180, y:120}],
			correctIndex:["01", "12", "23", "03"]
		},
		{
			name:"rhomboid",
			coordinates: [{x:0, y:-180}, {x: 180, y:0}, {x:0, y:180}, {x:-180, y:0}],
			correctIndex:["01", "12", "23", "03"]
		},
		{
			name:"square",
			coordinates: [{x:-180, y:-180}, {x: 180, y:-180}, {x:180, y:180}, {x:-180, y:180}],
			correctIndex:["01", "12", "23", "03"]
		},
		{
			name:"triangle",
			coordinates: [{x:-180, y:120}, {x:0, y:-180}, {x: 180, y:120}],
			correctIndex:["01", "12", "02"]
		},
		{
			name:"trapezoid",
			coordinates: [{x:-120, y:-180}, {x: 120, y:-180}, {x:180, y:120}, {x:-180, y:120}],
			correctIndex:["01", "12", "23", "03"]
		},
		{
			name:"pentagon",
			coordinates: [{x:-120, y:160}, {x: 120, y:160}, {x:180, y:-60}, {x:0, y:-200}, {x:-180, y:-60}],
			correctIndex:["01", "12", "23", "34", "04"]
		},
		{
			name:"hexagon",
			coordinates: [{x:-180, y:-80}, {x:0, y:-200}, {x: 180, y:-80}, {x:180, y:120}, {x:0, y:240}, {x:-180, y:120}],
			correctIndex:["01", "12", "23", "34", "45", "05"]
		}
	]

	var ROUNDS = [
		{figure:"triangle"},
		{figure:"square"},
		{figure:"rectangle"},
		{figure:"rhomboid"},
		{figure:"trapezoid"},
		{figure:"pentagon"},
		{figure:"hexagon"},
		{figure:"random"},
	]

	var lives
	var sceneGroup = null
	var gameIndex = 62
	var tutoGroup
	var astronoSong
	var heartsGroup = null
	var clock
	var timeValue
	var quantNumber
	var inputsEnabled
	var pointsBar
	var roundCounter
	var signGroup
	var figuresList
	var starsList
	var starsGroup
	var pointerGame
	var starsInGame
	var line1
	var lines
	var currentLine
	var startDrag
	var currentFigure
	var isActive
	var correctParticle
	var wrongParticle
	var canvasGroup
	var nameGroup

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

		game.stage.backgroundColor = "#ffffff"
		//gameActive = true
		lives = NUM_LIFES
		timeValue = 10
		quantNumber = 2
		roundCounter = 0
		figuresList = []
		starsList = []
		starsInGame = []
		lines = []
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

		// if(pointsBar.number % 2 == 0){
		timeValue-=timeValue * 0.08
		// }

	}

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.astrono','xpcoins')
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
		for(var figureIndex = 0; figureIndex < FIGURES.length; figureIndex++){
			var figureData = FIGURES[figureIndex]

			var figure = signGroup.create(0, -40, "atlas.astrono", figureData.name)
			figure.anchor.setTo(0.5, 0.5)
			figure.kill()
			figuresList[figureData.name] = {sprite: figure, figureData: figureData}
		}

		canvasGroup = game.add.group()
		sceneGroup.add(canvasGroup)

		starsGroup = game.add.group()
		starsGroup.x = game.world.centerX
		starsGroup.y = game.world.centerY - 80
		sceneGroup.add(starsGroup)

		for(var starIndex = 0; starIndex < MAX_STARTS; starIndex++){
			var star = createSpine("stars", "normal")
			star.setAnimation(["IDLE_1"])
			starsGroup.add(star)
			starsList.push(star)
			star.sprite = game.add.sprite(0,0)
			star.add(star.sprite)

			star.alpha = 0
			star.index = starIndex
		}

		line1 = game.add.graphics(0,0)
		sceneGroup.add(line1)

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
			spineSkeleton.setToSetupPose  ()
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

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);

		particle.makeParticles('atlas.astrono',key);
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
		// wrongParticle.start(true, 1000, null, 5)
		astronoSong.stop()
		// clock.tween.stop()
		inputsEnabled = false
		isActive = false
		sound.play("wrong")

		for(var starIndex = 0; starIndex < starsInGame.length; starIndex++){
			var star = starsInGame[starIndex]
			star.setAnimation(["WRONG"])
			wrongParticle.x = star.centerX
			wrongParticle.y = star.centerY
			wrongParticle.start(true, 1000, null, 5)
		}

		var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
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
		game.load.audio('astronoSong', soundsPath + 'songs/the_buildup.mp3');

		game.load.image('introscreen',"images/astrono/introscreen.png")
		game.load.image('howTo',"images/astrono/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/astrono/play" + localization.getLanguage() + ".png")
		game.load.spine('stars', "images/spine/stars.json")

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
	
	function generateFigure(round) {
		sound.play("swipe")
		if(round.figure === "random"){
			var rndFigure = FIGURES[game.rnd.integerInRange(0, FIGURES.length - 1)]
			currentFigure = figuresList[rndFigure.name]
		}
		else
			currentFigure = figuresList[round.figure]

		currentFigure.sprite.alpha = 0
		currentFigure.sprite.scale.x = 0.4; currentFigure.sprite.scale.y = 0.4
		game.add.tween(currentFigure.sprite).to({alpha:1}, 500, Phaser.Easing.Cubic.Out, true)
		game.add.tween(currentFigure.sprite.scale).to({x:1, y:1}, 500, Phaser.Easing.Cubic.Out, true)
		currentFigure.sprite.revive()

		var coordinates = currentFigure.figureData.coordinates

		for(var startIndex = 0; startIndex < coordinates.length; startIndex++){
			var coordinate = coordinates[startIndex]
			var star = starsList[startIndex]

			// star.alpha = 1
			game.add.tween(star).to({alpha:1, x: coordinate.x, y: coordinate.y}, 800, Phaser.Easing.Cubic.Out, true)
			// star.x = coordinate.x
			// star.y = coordinate.y
			starsInGame.push(star)
		}
	}

	function startRound(notStarted) {
		game.add.tween(nameGroup).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true)
		game.add.tween(nameGroup.scale).to({x:0.4, y:0.4}, 500, Phaser.Easing.Cubic.Out, true)
		var round = ROUNDS[roundCounter]
		roundCounter = roundCounter + 1 < ROUNDS.length ? roundCounter + 1 : roundCounter

		game.add.tween(clock.bar.scale).to({x: clock.bar.origScale}, 300, Phaser.Easing.Cubic.Out, true)
		for(var starIndex = 0; starIndex < starsInGame.length; starIndex++){
			var star = starsInGame[starIndex]
			star.setAnimation(["IDLE_1"])
			star.line = null
			star.lineIndex = null
		}
		lines = []
		starsInGame = []

		generateFigure(round)
		game.time.events.add(800, function () {
			isActive = true
			startTimer(stopGame)
		})
		// isActive = true
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

	function startTimer(onComplete) {
		var delay = 500
		// clock.bar.scale.x = clock.bar.origScale
		if (clock.tween)
			clock.tween.stop()


		clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeValue * 1000,Phaser.Easing.linear,true )
		clock.tween.onComplete.add(function(){
			if(isActive) {
				onComplete()
			}
		})
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

		var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.astrono','gametuto')
		tuto.anchor.setTo(0.5,0.5)

		var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)

		var inputName = 'movil'

		if(game.device.desktop){
			inputName = 'desktop'
		}

		var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.astrono',inputName)
		inputLogo.anchor.setTo(0.5,0.5)
		// inputLogo.scale.setTo(0.7,0.7)

		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.astrono','button')
		button.anchor.setTo(0.5,0.5)

		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
	}

	function createClock(){

		clock = game.add.group()
		clock.x = game.world.centerX
		clock.y = 80
		sceneGroup.add(clock)

		var clockImage = clock.create(0,0,'atlas.astrono','clock')
		clockImage.anchor.setTo(0.5,0.5)

		var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.astrono','bar')
		clockBar.anchor.setTo(0,0.5)
		clockBar.width = clockImage.width*0.76
		clockBar.height = 22
		clockBar.origScale = clockBar.scale.x

		clock.bar = clockBar

	}

	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

	}
	
	function checkExistedLine() {
		var exists = false
		for(var lineIndex = 0; lineIndex < lines.length; lineIndex++){
			var line = lines[lineIndex]
			exists = exists || line.lineIndex === currentLine.lineIndex
		}
		if(exists){
			currentLine.clear()
			currentLine = null
		}else{
			sound.play("cut")
			lines.push(currentLine)
		}
	}
	
	function checkCorrectFigure() {
		var isCorrect = true
		for(var lineIndex = 0; lineIndex < lines.length; lineIndex++){
			var line = lines[lineIndex]

			var correctIndex = currentFigure.figureData.correctIndex
			var correctLine = false
			for(var i = 0; i < correctIndex.length; i++){
				var correct = correctIndex[i]
				if(correct === line.lineIndex){
					correctLine = true
					break;
				}
			}
			isCorrect = correctLine && isCorrect
		}
		return isCorrect
	}

	function checkCollision() {

		for(var starIndex = 0; starIndex < starsInGame.length; starIndex++){
			var star = starsInGame[starIndex]
			var collide = checkOverlap(pointerGame, star)
			if(collide) {
				var exists = false
				if (currentLine) {
					exists = (currentLine.star === star)
				}
				if(!exists){
					if(currentLine){
						var from = currentLine.star.sprite
						var to = star.sprite
						currentLine.clear()
						currentLine.lineStyle(10, 0xFFFFFF, 1)
						currentLine.alpha = 1
						currentLine.moveTo(from.world.x,from.world.y)
						currentLine.lineTo(to.world.x,to.world.y)
						var fromIndex = currentLine.star.index
						var toIndex = star.index
						var lineIndex = fromIndex < toIndex ? fromIndex.toString() + toIndex.toString() : toIndex.toString() + fromIndex.toString()
						currentLine.lineIndex = lineIndex
						checkExistedLine()
					}
					var line = game.add.graphics(0,0)
					canvasGroup.add(line)
					line.star = star
					// lines.push(line)
					currentLine = line
					break
				}
			}
		}
	}

	function onDragStart(obj, pointer) {
		pointerGame.x = pointer.x
		pointerGame.y = pointer.y

		startDrag = true
		sound.play("flip")
	}

	function onDragUpdate(obj, pointer) {
		obj.x = 0
		obj.y = 0

		pointerGame.x = pointer.x
		pointerGame.y = pointer.y

		// var starSelected = pointerGame.starSelected
		// if(starSelected){
		//
		// }
	}

	function onDragStop(obj) {
		startDrag = false
		if(currentLine)
			currentLine.clear()
			currentLine = null
		pointerGame.x = 0
		pointerGame.y = 0
	}
	
	function createAstronoUI() {
		var cloud = game.add.tileSprite(0,0,game.world.width, 296, "atlas.astrono", "cloud")
		cloud.anchor.setTo(0, 1)
		cloud.y = game.world.height - 100
		sceneGroup.add(cloud)
		
		cloud.update = function () {
			this.tilePosition.x += 0.5
		}

		var floor = game.add.tileSprite(0,0,game.world.width, 196, "atlas.astrono", "floor")
		floor.anchor.setTo(0, 1)
		floor.y = game.world.height + 2
		sceneGroup.add(floor)

		signGroup = game.add.group()
		signGroup.x = game.world.centerX
		signGroup.y = game.world.height - 273 * 0.5
		sceneGroup.add(signGroup)

		var sign = signGroup.create(0, 0, "atlas.astrono", "sign")
		sign.anchor.setTo(0.5, 0.5)

		var rectangle = game.add.graphics()
		rectangle.beginFill(0xffffff)
		rectangle.drawRect(0,0, game.world.width, game.world.height)
		rectangle.endFill()
		rectangle.alpha = 0
		rectangle.inputEnabled = true
		rectangle.input.enableDrag(true)
		rectangle.events.onDragStart.add(onDragStart)
		rectangle.events.onDragUpdate.add(onDragUpdate)
		rectangle.events.onDragStop.add(onDragStop)
		sceneGroup.add(rectangle)

		var graphic = game.add.graphics()
		graphic.beginFill(0xffffff)
		graphic.drawRect(0,0, 50, 50)
		graphic.endFill()

		pointerGame = game.add.sprite(0,0, graphic.generateTexture())
		pointerGame.anchor.setTo(0.5, 0.5)
		pointerGame.alpha = 0
		sceneGroup.add(pointerGame)
		graphic.destroy()

		correctParticle = createPart("star")
		correctParticle.x = signGroup.x
		correctParticle.y = signGroup.y
		sceneGroup.add(correctParticle)

		wrongParticle = createPart("wrong")
		wrongParticle.x = signGroup.x
		wrongParticle.y = signGroup.y
		sceneGroup.add(wrongParticle)

		nameGroup = game.add.group()
		nameGroup.x = game.world.centerX
		nameGroup.y = game.world.centerY - 80
		sceneGroup.add(nameGroup)
		nameGroup.alpha = 0
		nameGroup.scale.setTo(0.4, 0.4)

		var containerName = nameGroup.create(0, 0, "atlas.astrono", "container_name")
		containerName.anchor.setTo(0.5, 0.5)

		var fontStyle = {font: "42px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
		var figureName = new Phaser.Text(game, 0, 2, "Pentagono", fontStyle)
		figureName.anchor.setTo(0.5, 0.5)
		nameGroup.add(figureName)
		nameGroup.name = figureName
	}
	
	function update() {
		checkCollision()
		if(currentLine){
			var from = currentLine.star.sprite
			currentLine.clear()
			currentLine.lineStyle(10, 0xFFFFFF, 1)
			currentLine.alpha = 1
			currentLine.moveTo(from.world.x,from.world.y)
			currentLine.lineTo(pointerGame.x,pointerGame.y)
		}
	}

	function correctReaction() {

		var localizedName = localizationData[localization.getLanguage()][currentFigure.figureData.name]
		var toScale = {}
		if(currentFigure.figureData.name === "triangle"){
			toScale.x = 0.8
			toScale.y = 0.8
			nameGroup.y = game.world.centerY - 55
		}else{
			toScale.x = 0.9
			toScale.y = 0.9
			nameGroup.y = game.world.centerY - 80
		}

		nameGroup.name.text = localizedName
		game.add.tween(nameGroup).to({alpha:1}, 500, Phaser.Easing.Cubic.Out, true)
		game.add.tween(nameGroup.scale).to({x:toScale.x, y:toScale.y}, 500, Phaser.Easing.Back.Out, true)

		addPoint(1)
		// correctParticle.start(true, 1000, null, 5)
		game.add.tween(currentFigure.sprite.scale).to({x:1.2, y:1.2}, 300, Phaser.Easing.Sinusoidal.In, true).yoyo(true)

		for(var starIndex = 0; starIndex < starsInGame.length; starIndex++){
			var star = starsInGame[starIndex]
			game.add.tween(star.scale).to({x: 1.5, y:1.5}, 300, Phaser.Easing.Sinusoidal.In, true).yoyo(true)
			game.add.tween(star).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true, 1000)
			star.setAnimation(["IDLE"])
			correctParticle.x = star.centerX; correctParticle.y = star.centerY
			correctParticle.start(true, 1000, null, 3)
		}

		for(var lineIndex = 0; lineIndex < lines.length; lineIndex++){
			var line = lines[lineIndex]
			game.add.tween(line).to({alpha:0}, 400, Phaser.Easing.Cubic.Out, true, 1000)
		}

		game.add.tween(currentFigure.sprite).to({alpha: 0}, 300, Phaser.Easing.Sinusoidal.In, true, 1000)
		game.add.tween(currentFigure.sprite.scale).to({x: 0.4, y:0.4}, 300, Phaser.Easing.Sinusoidal.In, true, 1000)
		game.time.events.add(1600, startRound)
	}

	return {
		assets: assets,
		name: "astrono",
		preload:preload,
		update:function() {
			if (isActive) {
				if (startDrag)
					update()

				if (lines.length >= currentFigure.figureData.correctIndex.length) {
					if (clock.tween)
						clock.tween.stop()
					var isCorrect = checkCorrectFigure()
					if(currentLine)
						currentLine.clear()
					isActive = false
					if(isCorrect)
						correctReaction()
					else
						stopGame()
				}
			}
		},
		create: function(event){

			sceneGroup = game.add.group()

			var background = sceneGroup.create(-2,-2,'skygradient')
			background.width = game.world.width+2
			background.height = game.world.height+2

			var swatch = game.add.tileSprite(0,0,game.world.width, game.world.height, "atlas.astrono", "skypattern")
			swatch.alpha = 0.2
			sceneGroup.add(swatch)

			createAstronoUI()

			astronoSong = game.add.audio('astronoSong')
			game.sound.setDecodedCallback(astronoSong, function(){
				astronoSong.loopFull(0.6)
			}, this);

			game.onPause.add(function(){
				game.sound.mute = true
			} , this);

			game.onResume.add(function(){
				game.sound.mute = false
			}, this);

			initialize()

			createPointsBar()
			createGameObjects()
			createClock()
			// startRound(true)
			createTutorial()

			buttons.getButton(astronoSong,sceneGroup)
		}
	}
}()