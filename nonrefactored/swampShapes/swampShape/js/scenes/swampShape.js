var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/swampShape/";

var swampShape = function(){

	assets = {
        atlases: [                
			{
                name: "atlas.swampShape",
                json:  imagePath + "atlas.json",
                image:  imagePath + "atlas.png",
			}],
        images: [],
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
				file: soundsPath + "gameLose.mp3"},
			{   name: "fireFly",
				file: soundsPath + "fliege.mp3"},
			{   name: "insectLaghing",
				file: soundsPath + "insectLaghing.mp3"}
		]
	}

	var MAX_STARTS = 8
	var FIGURES = [
		// {
		// 	name:"rectangle",
		// 	coordinates: [{x:-180, y:-120}, {x: 180, y:-120}, {x:180, y:120}, {x:-180, y:120}],
		// 	correctIndex:["01", "12", "23", "03"]
		// },
		// {
		// 	name:"rhomboid",
		// 	coordinates: [{x:0, y:-180}, {x: 180, y:0}, {x:0, y:180}, {x:-180, y:0}],
		// 	correctIndex:["01", "12", "23", "03"]
		// },
		{
			name:"square",
			correctIndex:[{x:2, y:0}, {x:0, y:-2}, {x:-2, y:0}, {x:0, y:2}]
		},
		{
			name:"triangle",
			correctIndex: [{x:2, y:0}, {x:-1, y:-2}, {x:-1, y:2}]
		},
		{
			name:"rectangle",
			correctIndex: [{x:2, y:0}, {x:0, y:-1}, {x:-2, y:0}, {x:0, y:1}]
		},
		{
			name:"rectangle2",
			correctIndex:[{x:1, y:0}, {x:0, y:-2}, {x:-1, y:0}, {x:0, y:2}]
		},
		{
			name:"isoceles",
			correctIndex: [{x:2, y:0}, {x:-1, y:-1}, {x:-1, y:1}]
		},
		{
			name:"rhombus",
			correctIndex: [{x:1, y:-1}, {x:-1, y:-1}, {x:-1, y:1}, {x:1, y:1}]
		},
		// {
		// 	name:"trapezoid",
		// 	coordinates: [{x:-120, y:-180}, {x: 120, y:-180}, {x:180, y:120}, {x:-180, y:120}],
		// 	correctIndex:["01", "12", "23", "03"]
		// },
		// {
		// 	name:"pentagon",
		// 	coordinates: [{x:-120, y:160}, {x: 120, y:160}, {x:180, y:-60}, {x:0, y:-200}, {x:-180, y:-60}],
		// 	correctIndex:["01", "12", "23", "34", "04"]
		// },
		// {
		// 	name:"hexagon",
		// 	coordinates: [{x:-180, y:-80}, {x:0, y:-200}, {x: 180, y:-80}, {x:180, y:120}, {x:0, y:240}, {x:-180, y:120}],
		// 	correctIndex:["01", "12", "23", "34", "45", "05"]
		// }
	]

	var ROUNDS = [
		{figure:"square"},
		{figure:"triangle"},
		{figure:"rhombus"},
		{figure:"rectangle"},
		{figure:"rectangle2"},
		{figure:"isoceles"},
		{figure:"random"}
	]

	var COORDINATES = [{x:-1, y:-1}, {x:0, y:-1}, {x: 1, y:-1}, {x: 1, y:0}, {x:1, y:1}, {x:0, y:1}, {x:-1, y:1}, {x:-1, y:0}]
	var DISTANCE = 180
	
	var sceneGroup = null
    var bottle;
    var pointerGame
	var wrongParticle
	var correctParticle
	var currentLine
	var lines
	var canvasGroup
	var starsGroup
	var figuresList
	var tutoGroup
	var startDrag
	var roundCounter
	var flysInGame
	var isActive
	var currentFigure
	var pointsBar
	var astronoSong
	var clock
	var timeValue

	var gameIndex = 65

	function preload() {
		game.load.audio('astronoSong',  soundsPath + 'songs/space_bridge.mp3');
		/*Default*/
		buttons.getImages(game);
		game.load.image('introscreen',"images/swampShape/introscreen.png")
		game.load.image('howTo',"images/swampShape/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/swampShape/play" + localization.getLanguage() + ".png")
		buttons.getImages(game)
		
		/*GAME*/
		// game.load.image("background",imagePath + "background.png");

		/*SPINE*/
		//game.load.spine("helicoptero", imagePath + "spine/helicoptero.json");

		
		
		
	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		game.stage.backgroundColor = "#ffffff"
		//gameActive = true
		// lives = NUM_LIFES
		// timeValue = 10
		// quantNumber = 2
		roundCounter = 0
		figuresList = []
		flysInGame = []
		lines = []
		timeValue = 12
		// isActive = false

		sceneGroup.alpha = 0
		game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
		// inputsEnabled = false

		loadSounds()

	}

	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

	}
	
	function recursiveSumResult(copyLines, finalResults) {
		var checkLine = copyLines.pop()
		var sumResult = checkLine.result
		for(var lineIndex = copyLines.length - 1; lineIndex >= 0; lineIndex--){
			var line = copyLines[lineIndex]
			if((checkLine.result.x === line.result.x)&&(checkLine.result.y === line.result.y)){
				// console.log("equal")
				sumResult.x += line.result.x
				sumResult.y += line.result.y
				copyLines.splice(lineIndex, 1)
			}
		}
		console.log(sumResult)
		finalResults.push(sumResult)
		if(copyLines.length>0)
			recursiveSumResult(copyLines, finalResults)
	}
	
	function hideFireflies() {

		for(var lineIndex = 0; lineIndex < lines.length; lineIndex++){
			var line = lines[lineIndex]
			correctParticle.x = line.star.world.x
			correctParticle.y = line.star.world.y
			correctParticle.start(true, 1000, null, 3)
			line.star.selected = true
			if(line.star.tween)
				line.star.tween.stop()
			if(line.star.tweenScale)
				line.star.tweenScale.stop()
			game.add.tween(line.star.scale).to({x: 1.5, y:1.5}, 300, Phaser.Easing.Sinusoidal.In, true).yoyo(true)
			game.add.tween(line).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true, 600)
			game.add.tween(line.star).to({x:bottle.x - starsGroup.x, y:bottle.y - starsGroup.y}, 800, Phaser.Easing.Cubic.Out, true, 600)
		}

		for(var flyIndex = 0; flyIndex < flysInGame.length; flyIndex++){
			var firefly = flysInGame[flyIndex]
			if(!firefly.selected){
				if(firefly.tween)
					firefly.tween.stop()
				if(firefly.tweenScale)
					firefly.tweenScale.stop()
				game.add.tween(firefly).to({alpha:0, x:0, y:0}, 500, Phaser.Easing.Cubic.Out, true, 1200)
			}
		}
		game.add.tween(currentFigure.sprite).to({alpha: 0}, 300, Phaser.Easing.Sinusoidal.In, true, 1200)
		game.add.tween(currentFigure.sprite.scale).to({x: 0.4, y:0.4}, 300, Phaser.Easing.Sinusoidal.In, true, 1200)

		game.time.events.add(2000, function () {
			clearLines()
			startRound()
		})

		game.time.events.add(600, function () {
			sound.play("fireFly")
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

	function createClock(){

		clock = game.add.group()
		clock.x = game.world.centerX
		clock.y = 80
		sceneGroup.add(clock)

		var clockImage = clock.create(0,0,'atlas.swampShape','clock')
		clockImage.anchor.setTo(0.5,0.5)

		var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.swampShape','bar')
		clockBar.anchor.setTo(0,0.5)
		clockBar.width = clockImage.width*0.76
		clockBar.height = 22
		clockBar.origScale = clockBar.scale.x

		clock.bar = clockBar

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
	
	function checkFigure() {
		var finalResults = []
		var copyArray = lines.slice()
		recursiveSumResult(copyArray, finalResults)
		// console.log(finalResults)

		var isRight = true
		for(var resultIndex = 0; resultIndex < finalResults.length; resultIndex++){
			var result = finalResults[resultIndex]
			var correctIndex = currentFigure.figureData.correctIndex
			var check = false
			for(var index = 0; index < correctIndex.length; index++){
				var correctResult = correctIndex[index]
				if(((result.x === correctResult.x)&&(result.y === correctResult.y))||
					((result.x === correctResult.x * -1) && (result.y === correctResult.y * -1))){
					check = true
				}
			}
			isRight = isRight && check
		}
		
		if(isRight){
			addPoint(1)
			hideFireflies()
		}else{
			for(var lineIndex = 0; lineIndex < lines.length; lineIndex++){
				var line = lines[lineIndex]
				wrongParticle.x = line.star.world.x
				wrongParticle.y = line.star.world.y
				wrongParticle.start(true, 1000, null, 3)
			}
			stopGame()
		}
	}

	function checkLines(){
		var resultX = 0, resultY = 0
		for(var lineIndex = 0; lineIndex < lines.length; lineIndex++){
			var line = lines[lineIndex]
			resultX += line.result.x
			resultY += line.result.y
		}

		// console.log(result)
		if((lines.length > 0)&&(resultX === 0)&&(resultY === 0)){
			// console.log("complete")
			checkFigure()
			isActive = false
			if (clock.tween)
				clock.tween.stop()

		}
	}

	function createGameObjects(){

		canvasGroup = game.add.group()
		sceneGroup.add(canvasGroup)

		starsGroup = game.add.group()
		starsGroup.x = game.world.centerX
		starsGroup.y = game.world.centerY - 80
		sceneGroup.add(starsGroup)

		for(var starIndex = 0; starIndex < COORDINATES.length; starIndex++){
			var firefly = starsGroup.create(0,0, "atlas.swampShape", "firefly")
			firefly.anchor.setTo(0.5, 0.5)
			// var coordinate = COORDINATES[starIndex]
			// firefly.setAnimation(["IDLE_1"])
			// firefly.sprite = game.add.sprite(0,0)
			// firefly.add(firefly.sprite)

			// firefly.alpha = 0
			firefly.x = 0; firefly.y = 0
			firefly.alpha = 0
			firefly.index = starIndex
			flysInGame.push(firefly)
		}

		// for(var startIndex = 0; startIndex < COORDINATES.length; startIndex++){
		// 	var coordinate = COORDINATES[startIndex]
		// 	var star = starsList[startIndex]
		//
		// 	// star.alpha = 1
		// 	game.add.tween(star).to({alpha:1, x: coordinate.x, y: coordinate.y}, 800, Phaser.Easing.Cubic.Out, true)
		// 	// star.x = coordinate.x
		// 	// star.y = coordinate.y
		// 	starsInGame.push(star)
		// }

	}

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.swampShape','xpcoins')
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

	/*CREATE SCENE*/
    function createScene() {
		sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex);;
		loadSounds();
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		var background = game.add.tileSprite(0, 0, game.width, game.height, 'atlas.swampShape', "background");
		sceneGroup.add(background);

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
		pointerGame.alpha = 0.5
		sceneGroup.add(pointerGame)
		graphic.destroy()

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

		createGameObjects()

		bottle = sceneGroup.create(0, 0, "atlas.swampShape", "bottle");
		bottle.anchor.setTo(0.5, 0.5);
		bottle.x = game.world.centerX;
		bottle.y = game.height - bottle.height / 1.8;
		bottle.id = 0;

		for(var figureIndex = 0; figureIndex < FIGURES.length; figureIndex++){
			var figureData = FIGURES[figureIndex]

			var figure = sceneGroup.create(bottle.x, bottle.y + 18, "atlas.swampShape", figureData.name)
			figure.anchor.setTo(0.5, 0.5)
			figure.kill()
			figuresList[figureData.name] = {sprite: figure, figureData: figureData}
		}

		createClock()
		createPointsBar()
		createTutorial()

		correctParticle = createPart("star")
		// correctParticle.x = signGroup.x
		// correctParticle.y = signGroup.y
		sceneGroup.add(correctParticle)

		wrongParticle = createPart("wrong")
		// wrongParticle.x = signGroup.x
		// wrongParticle.y = signGroup.y
		sceneGroup.add(wrongParticle)
		buttons.getButton(astronoSong,sceneGroup)

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

		var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.swampShape','gametuto')
		tuto.anchor.setTo(0.5,0.5)

		var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)

		var inputName = 'movil'

		if(game.device.desktop){
			inputName = 'desktop'
		}

		var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.swampShape',inputName)
		inputLogo.anchor.setTo(0.5,0.5)
		// inputLogo.scale.setTo(0.7,0.7)

		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.swampShape','button')
		button.anchor.setTo(0.5,0.5)

		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
	}

	function checkCollision() {
		// console.log(flysInGame.length)
		for(var starIndex = 0; starIndex < flysInGame.length; starIndex++){
			var star = flysInGame[starIndex]
			var collide = checkOverlap(pointerGame, star)
			// console.log(collide)
			if(collide) {
				var exists = false
				if (currentLine) {
					exists = (currentLine.star === star)
				}
				if(!exists){
					if(currentLine){
						var from = currentLine.star
						var to = star
						currentLine.clear()
						currentLine.lineStyle(10, 0xFFFFFF, 1)
						currentLine.alpha = 1
						currentLine.moveTo(from.world.x,from.world.y)
						currentLine.lineTo(to.world.x,to.world.y)
						var fromIndex = currentLine.star.index
						var toIndex = star.index
						var lineIndex = fromIndex < toIndex ? fromIndex.toString() + toIndex.toString() : toIndex.toString() + fromIndex.toString()
						currentLine.lineIndex = lineIndex
						var result = {x :(from.coordinate.x ) - (to.coordinate.x ), y :(from.coordinate.y ) - (to.coordinate.y )}
						currentLine.result = result
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
			// console.log(lines.length)
		}
	}

	function onDragStart(obj, pointer) {
		pointerGame.x = pointer.x
		pointerGame.y = pointer.y

		startDrag = true
		// sound.play("flip")
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

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);

		particle.makeParticles('atlas.swampShape',key);
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
		isActive = false
		sound.play("wrong")
		game.time.events.add(800, function () {
			sound.play("insectLaghing")
		})

		var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2000)
		tweenScene.onComplete.add(function(){

			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number, gameIndex)

			//amazing.saveScore(pointsBar.number)
			sceneloader.show("result")
			sound.play("gameLose")
		})
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

	function startRound(notStarted) {

		game.add.tween(clock.bar.scale).to({x: clock.bar.origScale}, 300, Phaser.Easing.Cubic.Out, true)
		sound.play("swipe")

		for(var flyIndex = 0; flyIndex < flysInGame.length; flyIndex++){
			var firefly = flysInGame[flyIndex]
			var coordinate = COORDINATES[flyIndex]
			firefly.selected = false

			firefly.x = 0; firefly.y = 0; firefly.alpha = 0
			firefly.scale.x = 1; firefly.scale.y = 1
			firefly.coordinate = coordinate
			var appear = game.add.tween(firefly).to({alpha:1, x:coordinate.x * 180, y:coordinate.y * 180}, 500, Phaser.Easing.Cubic.Out, true)
			appear.onComplete.add(function (obj) {
				var delay = game.rnd.integerInRange(100, 600)
				obj.tween = game.add.tween(obj).to({alpha:0.6}, 300, Phaser.Easing.Sinusoidal.InOut, true, delay).yoyo(true).loop(true)
				obj.tweenScale = game.add.tween(obj.scale).to({x:0.8, y:0.8}, 600, Phaser.Easing.Sinusoidal.InOut, true, delay).yoyo(true).loop(true)
			})
		}

		var round = ROUNDS[roundCounter]
		roundCounter = roundCounter + 1 < ROUNDS.length ? roundCounter + 1 : roundCounter

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

		game.time.events.add(800, function () {
			isActive = true
			startTimer(stopGame)
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

	function update() {
		checkCollision()
		if(currentLine){
			// console.log(currentLine)
			var from = currentLine.star
			currentLine.clear()
			currentLine.lineStyle(10, 0xFFFFFF, 1)
			currentLine.alpha = 1
			currentLine.moveTo(from.world.x,from.world.y)
			currentLine.lineTo(pointerGame.x,pointerGame.y)
		}
        
	}
		

	function clearLines() {
		for(var lineIndex = 0; lineIndex < lines.length; lineIndex++){
			var line = lines[lineIndex]
			line.clear()
			line.destroy()
		}
		lines = []
	}
	
	return {
		assets: assets,
		name: "swampShape",
		preload: preload,
		create: createScene,
		update:function() {
			if (isActive) {
				if (startDrag)
					update()
				else
					clearLines()

				checkLines()
				// if (lines.length >= currentFigure.figureData.correctIndex.length) {
				// 	// if (clock.tween)
				// 	// 	clock.tween.stop()
				// 	var isCorrect = checkCorrectFigure()
				// 	if(currentLine)
				// 		currentLine.clear()
				// 	isActive = false
				// 	if(isCorrect)
				// 		correctReaction()
				// 	else
				// 		stopGame()
				// }
			}
		},
		show: function(event){
			initialize()
		}		
	}
}()