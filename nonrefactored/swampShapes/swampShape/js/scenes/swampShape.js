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
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "wrongItem",
				file: soundsPath + "wrongItem.mp3"},
            {	name: "break",
				file: soundsPath + "glassbreak.mp3"},
            {	name: "powerup",
				file: soundsPath + "powerup.mp3"},
            {	name: "balloon",
				file: soundsPath + "inflateballoon.mp3"},
			{	name: "explode",
				file: soundsPath + "explode.mp3"},
			{	name: "shootBall",
				file: soundsPath + "shootBall.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"}
		],
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
			name:"rectangleH",
			correctIndex: [{x:2, y:0}, {x:0, y:-1}, {x:-2, y:0}, {x:0, y:1}]
		},
		{
			name:"rectangleV",
			correctIndex:[{x:1, y:0}, {x:0, y:-2}, {x:-1, y:0}, {x:0, y:2}]
		},
		{
			name:"triangleIso",
			correctIndex: [{x:2, y:0}, {x:-1, y:-2}, {x:-1, y:2}]
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
		{figure:"triangle"}
	]

	var COORDINATES = [{x:-180, y:-180}, {x:0, y:-180}, {x: 180, y:-180}, {x: 180, y:0}, {x:180, y:180}, {x:0, y:180}, {x:-180, y:180}, {x:-180, y:0}]
	
	var sceneGroup = null;
	var heartsIcon;
	var lives = 1;
	var coins = 0;
    var shapesBottle = new Array;
    var bottle;
    var pointerGame
	var wrongParticle
	var correctParticle
	var currentLine
	var lines
	var canvasGroup
	var flyList
	var starsGroup
	var figuresList
	var tutoGroup
	var startDrag
	var roundCounter
	var flysInGame
	var isActive
	var currentFigure

    function preload() {
		game.load.audio('sillyAdventureGameLoop',  soundsPath + 'songs/sillyAdventureGameLoop.mp3');
		/*Default*/
		buttons.getImages(game);
		game.load.image('introscreen',"images/swampShape/introscreen.png")
		game.load.image('howTo',"images/swampShape/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/swampShape/play" + localization.getLanguage() + ".png")
		
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
		flyList = []
		flysInGame = []
		lines = []
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
	
	function recursiveSumResult(finalResults) {
		var checkLine = lines.pop()
		var sumResult = checkLine.result
		for(var lineIndex = lines.length - 1; lineIndex >= 0; lineIndex--){
			var line = lines[lineIndex]
			if((checkLine.result.x === line.result.x)&&(checkLine.result.y === line.result.y)){
				// console.log("equal")
				sumResult.x += line.result.x
				sumResult.y += line.result.y
				lines.splice(lineIndex, 1)
			}
		}
		// console.log(sumResult)
		finalResults.push(sumResult)
		if(lines.length>0)
			recursiveSumResult(finalResults)
	}
	
	function checkFigure() {
		var finalResults = []
		recursiveSumResult(finalResults)
		console.log(finalResults)

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
		
		console.log("isSquare? ", isRight)
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
			console.log("complete")
			checkFigure()
			isActive = false
		}
	}

	function createGameObjects(){
		for(var figureIndex = 0; figureIndex < FIGURES.length; figureIndex++){
			var figureData = FIGURES[figureIndex]

			var figure = sceneGroup.create(0, -40, "atlas.swampShape", figureData.name)
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

		for(var starIndex = 0; starIndex < COORDINATES.length; starIndex++){
			var firefly = starsGroup.create(0,0, "atlas.swampShape", "firefly")
			firefly.anchor.setTo(0.5, 0.5)
			var coordinate = COORDINATES[starIndex]
			// firefly.setAnimation(["IDLE_1"])
			flyList.push(firefly)
			// firefly.sprite = game.add.sprite(0,0)
			// firefly.add(firefly.sprite)

			// firefly.alpha = 0
			firefly.x = coordinate.x; firefly.y = coordinate.y
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

	/*CREATE SCENE*/
    function createScene() {
		sceneGroup = game.add.group();
		loadSounds();
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		var background = game.add.tileSprite(0, 0, game.width, game.height, 'atlas.swampShape', "swamp-03");
		sceneGroup.add(background);

		bottle = sceneGroup.create(0, 0, "atlas.swampShape", "swamp-05");
		bottle.anchor.setTo(0.5, 0.5);
		bottle.x = game.world.centerX;
		bottle.y = game.height - bottle.height / 1.8;
		bottle.id = 0;

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

		initialize()

		createGameObjects()
		createTutorial()

		correctParticle = createPart("star")
		// correctParticle.x = signGroup.x
		// correctParticle.y = signGroup.y
		sceneGroup.add(correctParticle)

		wrongParticle = createPart("wrong")
		// wrongParticle.x = signGroup.x
		// wrongParticle.y = signGroup.y
		sceneGroup.add(wrongParticle)

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
						var result = {x :(from.world.x / 180) - (to.world.x / 180), y :(from.world.y / 180) - (to.world.y / 180)}
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
			// sound.play("cut")
			lines.push(currentLine)
			console.log(lines.length)
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

	function startRound(notStarted) {
		var round = ROUNDS[roundCounter]

		if(round.figure === "random"){
			var rndFigure = FIGURES[game.rnd.integerInRange(0, FIGURES.length - 1)]
			currentFigure = figuresList[rndFigure.name]
		}
		else
			currentFigure = figuresList[round.figure]

		// game.add.tween(nameGroup).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true)
		// game.add.tween(nameGroup.scale).to({x:0.4, y:0.4}, 500, Phaser.Easing.Cubic.Out, true)
		// var round = ROUNDS[roundCounter]
		// roundCounter = roundCounter + 1 < ROUNDS.length ? roundCounter + 1 : roundCounter
		//
		// game.add.tween(clock.bar.scale).to({x: clock.bar.origScale}, 300, Phaser.Easing.Cubic.Out, true)
		// for(var starIndex = 0; starIndex < starsInGame.length; starIndex++){
		// 	var star = starsInGame[starIndex]
		// 	star.setAnimation(["IDLE_1"])
		// 	star.line = null
		// 	star.lineIndex = null
		// }
		// lines = []
		// starsInGame = []

		// generateFigure(round)
		// game.time.events.add(800, function () {
		// 	isActive = true
		// 	startTimer(stopGame)
		// })
		isActive = true
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