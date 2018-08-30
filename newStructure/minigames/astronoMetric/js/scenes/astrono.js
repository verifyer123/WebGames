
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
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
			},
			{   
				name: "atlas.tutorial",
				json: tutorialPath+"images/tutorial/tutorial_atlas.json",
				image: tutorialPath+"images/tutorial/tutorial_atlas.png"
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
		],
		spritesheets: [
			{
				name:"hand",
				file:"images/spine/hand.png",
				width:115,
				height:111,
				frames:4
			},
			{
				name:"coin",
				file:"images/spine/coin.png",
				width:122,
				height:123,
				frames:12
			}
		],
		spines:[
			{
				name:"yogotars",
				file:"images/spine/yogotars/astronometric.json"
			}
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
	var gameIndex = 63
	var tutoGroup
	var astronoSong
	var heartsGroup = null
	var clock
	var timeValue
	var quantNumber
	var inputsEnabled
	var index
	var coinsGroup=null
	var oona,oof;
	var pointsBar
	var roundCounter
	var rect;
	var signGroup
	var yogotarsGroup
	var figuresList
	var starsList
	var starsGroup
	var pointerGame
	var tutorial
	var handTween
	var starsInGame
	var lines
	var figure;
	var currentLine
	var startDrag
	var currentFigure
	var isActive
	var correctParticle
	var wrongParticle
	var canvasGroup
	var nameGroup
	var hand,coinS

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

		game.stage.backgroundColor = "#ffffff"
		//gameActive = true
		lives = NUM_LIFES
		timeValue = 10
		tutorial=true;
		quantNumber = 2
		roundCounter = 0
		figure = game.add.graphics();
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

	function setAnimationRules(oona,oof){
		oona.setMixByName("idle", "win", 0.1);
		oona.setMixByName("idle", "lose", 0.1);
		oona.setMixByName("lose", "idle", 0.1);

		oof.setMixByName("idle", "win", 0.1);
		oof.setMixByName("idle", "lose", 0.1);
		oof.setMixByName("lose", "idle", 0.1);
	}
	function yogotarsInBack(oona,oof){
		oona.x=game.world.centerX-230;
		oona.y=game.world.height-100;
		oona.scale.setTo(0.8,0.8)

		oof.x=game.world.centerX+230;
		oof.y=game.world.height-100;
		oof.scale.setTo(-0.8,0.8)

		yogotarsGroup.add(oona);
		yogotarsGroup.add(oof);
	}
	function runAnimations(oona,oof,event){
		if(event=="win"){
			oof.setAnimationByName(0,"win",false).onComplete=function(){
				oof.setAnimationByName(0,"idle",true);
			}
			oona.setAnimationByName(0,"win",false).onComplete=function(){
				oona.setAnimationByName(0,"idle",true);
			}
		}else{
			oof.setAnimationByName(0,"lose",false).onComplete=function(){
				if(lives>0){
					oof.setAnimationByName(0,"idle",true);
				}else{
					oof.setAnimationByName(0,"lose",true);
				}
			}
			oona.setAnimationByName(0,"lose",false).onComplete=function(){
				if(lives>0){
					oona.setAnimationByName(0,"idle",true);
				}else{
					oona.setAnimationByName(0,"lose",true);
				}
			}
		}
	}

	function createGameObjects(){
		for(var figureIndex = 0; figureIndex < FIGURES.length; figureIndex++){
			var figureData = FIGURES[figureIndex]

			var figure = signGroup.create(0, -40, "atlas.astrono", figureData.name)
			figure.anchor.setTo(0.5, 0.5)
			figure.kill()
			figuresList[figureData.name] = {sprite: figure, figureData: figureData}
		}

		for(var starIndex = 0; starIndex < MAX_STARTS; starIndex++){
			var star = createSpine("stars", "normal")
			star.setAnimation(["idle"])
			starsGroup.add(star)
			starsList.push(star)
			star.sprite = game.add.sprite(0,0)
			star.add(star.sprite)

			star.alpha = 0
			star.index = starIndex
		}
		starsGroup.bringToTop(hand)
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
			star.setAnimation(["wrong"])
			wrongParticle.x = star.centerX
			wrongParticle.y = star.centerY
			wrongParticle.start(true, 1000, null, 5)
		}

		var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
			astronoSong.stop();
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

		/*game.load.image('introscreen',"images/astrono/introscreen.png")
		game.load.image('howTo',"images/astrono/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/astrono/play" + localization.getLanguage() + ".png")*/
		game.load.spine('stars', "images/spine/stars.json")


		game.load.image('tutorial_image',"images/astrono/tutorial_image.png")
		// //loadType(gameIndex)


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
		currentFigure.sprite.y = -25;
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
			console.log(starsInGame)
		}

	}

	function startRound(notStarted) {
		game.add.tween(nameGroup).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true)
		game.add.tween(nameGroup.scale).to({x:0.4, y:0.4}, 500, Phaser.Easing.Cubic.Out, true)
		var round = ROUNDS[roundCounter]
		starsGroup.add(figure)

		roundCounter = roundCounter + 1 < ROUNDS.length ? roundCounter + 1 : roundCounter
		if(!tutorial){
			createClock()
			game.add.tween(clock.bar.scale).to({x: clock.bar.origScale}, 300, Phaser.Easing.Cubic.Out, true)
		}

		for(var starIndex = 0; starIndex < starsInGame.length; starIndex++){
			var star = starsInGame[starIndex]

			star.setAnimation(["idle"])
			star.line = null
			star.lineIndex = null
		}

		lines = []
		starsInGame = []


		generateFigure(round)
		if(tutorial){
			hand.alpha=1;
			tutorialLevel();
		}
		game.time.events.add(800, function () {
			isActive = true
			if(!tutorial){
				createClock()
				startTimer(incorrectReaction)
			}else{

			}
		})
		// isActive = true
	}

	function missPoint(){

		sound.play("wrong")
		inputsEnabled = false

		lives--;
		runAnimations(oona,oof,"lose")
		heartsGroup.text.setText('X ' + lives)

		var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			
			game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		})

		if(lives === 0){
			stopGame(false)
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

		tutoGroup.y = -game.world.height
		startRound()


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
		boundsB.width=boundsB.width/3.3;
		boundsB.height=boundsB.height/3.3;
		return Phaser.Rectangle.intersects(boundsA , boundsB);

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
			correctParticle.x = game.input.mousePointer.x; correctParticle.y = game.input.mousePointer.y;
			correctParticle.start(true, 1000, null, 3)
			lines.push(currentLine)
		}
	}

	function checkCorrectFigure() {
		var isCorrect = true;
		tutorial=false;
		hand.alpha=0;
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

	function createAstronoUI(oona,oof) {
		
				
		var starTile = game.add.tileSprite(0,0,game.world.width*2, game.world.height*2, "atlas.astrono", "stars_tile")
		starTile.anchor.setTo(0.5, 0.5);
		starTile.y = 0;
		sceneGroup.add(starTile)
		
		var mountains = game.add.tileSprite(0,0,game.world.width*2, 224, "atlas.astrono", "mountains")
		mountains.anchor.setTo(0.5, 0.5)
		mountains.y = game.world.height-240
		sceneGroup.add(mountains)


//		cloud.update = function () {
//			this.tilePosition.x += 0.5
//		}

		var floor = game.add.tileSprite(0,0,game.world.width, 196, "atlas.astrono", "floor")
		floor.anchor.setTo(0, 1)
		floor.y = game.world.height + 2
		sceneGroup.add(floor)

		yogotarsGroup = game.add.group();
		sceneGroup.add(yogotarsGroup);

		signGroup = game.add.group()
		signGroup.x = game.world.centerX
		signGroup.y = game.world.height - 273 * 0.5
		sceneGroup.add(signGroup)

		yogotarsInBack(oona,oof)
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

		wrongParticle = createPart("smoke")
		wrongParticle.x = signGroup.x
		wrongParticle.y = signGroup.y
		sceneGroup.add(wrongParticle)

		canvasGroup = game.add.group()
		sceneGroup.add(canvasGroup)
		
		starsGroup = game.add.group()
		starsGroup.x = game.world.centerX
		starsGroup.y = game.world.centerY - 80
		sceneGroup.add(starsGroup)

		nameGroup = game.add.group()
		nameGroup.x = game.world.centerX
		nameGroup.y = game.world.centerY - 80
		sceneGroup.add(nameGroup)
		nameGroup.alpha = 0
		nameGroup.scale.setTo(0.4, 0.4)

		coinsGroup= game.add.group()
		sceneGroup.add(coinsGroup)



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
		showFigure();
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

		getCoins(nameGroup)
		// correctParticle.start(true, 1000, null, 5)
		game.add.tween(currentFigure.sprite.scale).to({x:1.2, y:1.2}, 300, Phaser.Easing.Sinusoidal.In, true).yoyo(true)

		for(var starIndex = 0; starIndex < starsInGame.length; starIndex++){
			var star = starsInGame[starIndex]
			game.add.tween(star.scale).to({x: 1.5, y:1.5}, 300, Phaser.Easing.Sinusoidal.In, true).yoyo(true)
			game.add.tween(star).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true, 1000)
			star.setAnimation(["win"])
			correctParticle.x = star.centerX; correctParticle.y = star.centerY
			correctParticle.start(true, 1000, null, 3)
		}

		for(var lineIndex = 0; lineIndex < lines.length; lineIndex++){
			var line = lines[lineIndex]
			game.add.tween(line).to({alpha:0}, 400, Phaser.Easing.Cubic.Out, true, 1000)
		}

		game.add.tween(currentFigure.sprite).to({alpha: 0}, 300, Phaser.Easing.Sinusoidal.In, true, 1000)
		game.add.tween(currentFigure.sprite.scale).to({x: 0.4, y:0.4}, 300, Phaser.Easing.Sinusoidal.In, true, 1000)
		game.time.events.add(1600,function(){
			figure.clear();
			startRound();
		})
	}
	function showFigure(){
		figure.beginFill(0xffff00,0.5);
		starsGroup.sendToBack(figure);
		for(var starIndex = 0; starIndex < starsInGame.length; starIndex++){
			var star = starsInGame[starIndex]
			if(starIndex==0)figure.moveTo(star.x,star.y);
			figure.lineTo(star.x,star.y)
		}
		figure.endFill();
	}
	function tutorialLevel(){
		handTween=game.add.tween(hand).to({x:starsInGame[1].x,y:starsInGame[1].y},900,Phaser.Easing.linear,true).onComplete.add(function(){
			handTween=game.add.tween(hand).to({x:starsInGame[2].x,y:starsInGame[2].y},900,Phaser.Easing.linear,true).onComplete.add(function(){
				handTween=game.add.tween(hand).to({x:starsInGame[0].x,y:starsInGame[0].y},900,Phaser.Easing.linear,true).onComplete.add(function(){
					if(tutorial)tutorialLevel();
				})
			})
		})
	}

	function createCoin(){
		coinS = game.add.sprite(0, 0, "coin")
		coinS.anchor.setTo(0.5)
		coinS.scale.setTo(0.8)
		coinS.animations.add('coin')
		coinS.animations.play('coin', 24, true)
		coinS.alpha = 0
		coinsGroup.add(coinS)
		coinS.kill()

		hand = game.add.sprite(0, 0, "hand")
		hand.animations.add('hand')
		hand.animations.play('hand', 4, false)
		hand.alpha = 0
		starsGroup.add(hand)
	}

	function getCoins(player){
		var coin=coinsGroup.getFirstDead();

		if(coin==undefined){
			game["coinS"+index] = game.add.sprite(0, 0, "coin")
			game["coinS"+index].anchor.setTo(0.5)
			game["coinS"+index].scale.setTo(0.8)
			game["coinS"+index].animations.add('coin')
			game["coinS"+index].animations.play('coin', 24, true)
			game["coinS"+index].alpha = 0
			coinsGroup.add(game["coinS"+index])
			coin=game["coinS"+index];
			index++;
			addCoin(coin,player)
		}else{
			addCoin(coin,player)
		}
	}
	function addCoin(coin,obj){

		if(coin.motion)
			coin.motion.stop()

		coin.reset(obj.centerX,obj.centerY);

		game.add.tween(coin).to({alpha:1}, 100, Phaser.Easing.linear, true)

		coin.motion = game.add.tween(coin).to({y:coin.y - 100}, 200, Phaser.Easing.Cubic.InOut,true)
		coin.motion.onComplete.add(function(){
			coin.motion = game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true)
			coin.motion.onComplete.add(function(){
				coin.motion = game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true)
				coin.motion.onComplete.add(function(){
					addPoint(1);
					coin.kill();
					//					createTextPart('+1',pointsBar.text)
				})
			})
		})
	}


	function incorrectReaction(){

		var localizedName = localizationData[localization.getLanguage()][currentFigure.figureData.name]
		var toScale = {}
		isActive = false;
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
		//game.add.tween(nameGroup).to({alpha:1}, 500, Phaser.Easing.Cubic.Out, true)
		//game.add.tween(nameGroup.scale).to({x:toScale.x, y:toScale.y}, 500, Phaser.Easing.Back.Out, true)

		missPoint()
		// correctParticle.start(true, 1000, null, 5)
		game.add.tween(currentFigure.sprite.scale).to({x:1.2, y:1.2}, 300, Phaser.Easing.Sinusoidal.In, true).yoyo(true)

		for(var starIndex = 0; starIndex < starsInGame.length; starIndex++){
			var star = starsInGame[starIndex]
			game.add.tween(star.scale).to({x: 1.5, y:1.5}, 300, Phaser.Easing.Sinusoidal.In, true).yoyo(true)
			game.add.tween(star).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true, 1000)
			star.setAnimation(["wrong"])
			wrongParticle.x = star.centerX; wrongParticle.y = star.centerY
			wrongParticle.start(true, 1000, null, 3)
		}

		for(var lineIndex = 0; lineIndex < lines.length; lineIndex++){
			var line = lines[lineIndex]
			game.add.tween(line).to({alpha:0}, 400, Phaser.Easing.Cubic.Out, true, 1000)
		}

		game.add.tween(currentFigure.sprite).to({alpha: 0}, 300, Phaser.Easing.Sinusoidal.In, true, 1000)
		game.add.tween(currentFigure.sprite.scale).to({x: 0.4, y:0.4}, 300, Phaser.Easing.Sinusoidal.In, true, 1000)

		if(lives !== 0)
			game.time.events.add(1600, startRound)
	}

	function createHearts(){

		heartsGroup = game.add.group()
		heartsGroup.y = 10
		sceneGroup.add(heartsGroup)


		var pivotX = 10
		var group = game.add.group()
		group.x = pivotX
		heartsGroup.add(group)

		var heartImg = group.create(0,0,'atlas.astrono','life_box')

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
	function render(){
		 game.debug.rectangle(rect, '#ffffff', false);
	}

	return {
		assets: assets,
		name: "astrono",
		preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		update:function() {
			if (isActive) {
				if (startDrag)
					update()

				if (lines.length >= currentFigure.figureData.correctIndex.length) {
					if(!tutorial){
						if (clock.tween)
							clock.tween.stop()
					}
					var isCorrect = checkCorrectFigure()
					if(currentLine)
						currentLine.clear()
					isActive = false
					if(isCorrect){
						correctReaction();
						runAnimations(oona,oof,"win");
					}
					else{
						incorrectReaction();
					}
				}
			}
		},
		create: function(event){

			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

			var background = sceneGroup.create(-2,-2,'skygradient')
			background.width = game.world.width+2
			background.height = game.world.height+2

//			var swatch = game.add.tileSprite(0,0,game.world.width, game.world.height, "atlas.astrono", "skypattern")
//			swatch.alpha = 0.2
//			sceneGroup.add(swatch)


			oona=game.add.spine(0,0,"yogotars");
			oof=game.add.spine(0,0,"yogotars");
			oona.setSkinByName("normal1");
			oof.setSkinByName("normal2");
			setAnimationRules(oona,oof);
			oona.setAnimationByName(0,"idle",true);
			oof.setAnimationByName(0,"idle",true);

			createAstronoUI(oona,oof)



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
			createHearts()
			createCoin()
			createGameObjects()
			

			// startRound(true)
			createTutorial()

			buttons.getButton(astronoSong,sceneGroup)
		}
	}
}()