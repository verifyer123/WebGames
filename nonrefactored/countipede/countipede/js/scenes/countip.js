
var soundsPath = "../../shared/minigames/sounds/"
var countip = function(){

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
				name: "atlas.countip",
				json: "images/countip/atlas.json",
				image: "images/countip/atlas.png"
			}
		],
		images: [
			{   name:"fondo",
				file: "images/countip/fondo.png"}
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
	var GRID_SIZE = 60
	var MAX_SPACE = 54

	// var ROUNDS = [
	//     {continent: "america", flags: ["mexico", "usa"]},
	//     {continent: "america", numFlags: 4},
	//     {continent: "random", numFlags: 4}]

	var lives
	var sceneGroup = null
	var gameIndex = 33
	var tutoGroup
	var countipSong
	var heartsGroup = null
	var pullGroup = null
	var clock
	var timeValue
	var quantNumber
	var inputsEnabled
	var pointsBar
	var roundCounter
	var worm
	var speed
	var swipe
	var hitBox
	var isActive
	var objectsInGame
	var objectList
	var wormGroup
	var timeElapsed
	var apple
	var grid
	var newDirection

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
		timeElapsed = 0
		speed = 2
		objectsInGame = []
		objectList = []

		// worm.col = 4
		// worm.row = 5
		// var coordinates = grid[worm.col][worm.row]
		// worm.x = coordinates.x
		// worm.y = coordinates.y

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

		var pointsImg = pointsBar.create(-10,10,'atlas.countip','xpcoins')
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

		apple = wormGroup.create(0,0,"atlas.countip","apple")
		apple.anchor.setTo(0.5, 0.5)
		apple.kill()

	}

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);

		particle.makeParticles('atlas.countip',key);
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
		countipSong.stop()
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

	function preload(){

		game.stage.disableVisibilityChange = false;
		game.load.audio('countipSong', soundsPath + 'songs/wormwood.mp3');

		game.load.image('introscreen',"images/countip/introscreen.png")
		game.load.image('howTo',"images/countip/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/countip/play" + localization.getLanguage() + ".png")
		game.load.image('box',"images/countip/box.png")
		game.load.spine('centipede', "images/spine/centipede.json")

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

	// function startSnake() {
	// 	var toCol = worm.col
	// 	var toRow = worm.row
	// 	switch (worm.direction) {
	// 		case "up":
	// 			toRow += 0
	// 			toCol += -1
	// 			break;
	// 		case "down":
	// 			toRow += 0
	// 			toCol += 1
	// 			break;
	// 		case "left":
	// 			toRow += -1
	// 			toCol += 0
	// 			break;
	// 		case "right":
	// 			toRow += 1
	// 			toCol += 0
	// 			break;
	// 	}
	// 	var nextCoordinate = grid[toCol] ? grid[toCol][toRow] : undefined
	// 	if(nextCoordinate){
	// 		// var move = game.add.tween(worm).to({x:nextCoordinate.x, y:nextCoordinate.y}, 500, null, true)
	// 		// move.onComplete.add(startSnake)
	// 		worm.col = toCol
	// 		worm.row = toRow
	// 		worm.x = nextCoordinate.x
	// 		worm.y = nextCoordinate.y
	// 	}
	// }

	function startRound(notStarted) {
		isActive = true
		// startSnake()
		addRandomApple()

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

		var heartImg = group.create(0,0,'atlas.countip','life_box')

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

		var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.countip','gametuto')
		tuto.anchor.setTo(0.5,0.5)

		var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)

		var inputName = 'movil'

		if(game.device.desktop){
			inputName = 'desktop'
		}

		//console.log(inputName)
		var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.countip',inputName)
		inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)

		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.countip','button')
		button.anchor.setTo(0.5,0.5)

		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
	}

	function createClock(){

		clock = game.add.group()
		clock.x = game.world.centerX
		clock.y = game.world.centerY + 80
		sceneGroup.add(clock)

		var clockImage = clock.create(0,0,'atlas.countip','clock')
		clockImage.anchor.setTo(0.5,0.5)

		var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.countip','bar')
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
	
	function addCircleWorm() {
		var circleGroup = game.add.group()
		wormGroup.add(circleGroup)

		var circle = game.add.graphics()
		circle.beginFill(0xffffff)
		circle.drawCircle(0,0, 55)
		circle.alpha = 0.5
		circle.endFill()

		var circleSprite = game.add.sprite(0,0)
		circleSprite.addChild(circle)
		circleSprite.anchor.setTo(0.5, 1)
		circleGroup.add(circleSprite)

		var num = worm.circles.length - 1
		var lastCircle = worm.circles[num]
		lastCircle.trace = []

		circleGroup.x = lastCircle.x
		circleGroup.y = lastCircle.y

		var hitbox = game.add.graphics()
		hitbox.beginFill(0xffffff)
		hitbox.drawRect(0,0,GRID_SIZE * 0.5, GRID_SIZE * 0.5)
		hitbox.endFill()
		hitbox.alpha = 0.4
		hitbox.x = -hitbox.width * 0.5
		hitbox.y = -hitbox.height * 0.5
		circleGroup.hitbox = hitbox
		circleGroup.add(hitbox)

		circleGroup.direction = lastCircle.direction
		circleGroup.traceIndex = 0
		circleGroup.trace = []
		worm.circles.push(circleGroup)

		wormGroup.sendToBack(circleGroup)

	}
	
	function createCountipUI() {

		var boxGroup = game.add.group()
		boxGroup.x = game.world.centerX
		boxGroup.y = game.world.centerY
		sceneGroup.add(boxGroup)

		var box = boxGroup.create(0, 0, "box")
		box.anchor.setTo(0.5, 0.5)

		hitBox = game.add.graphics()
		hitBox.beginFill(0xffffff)
		hitBox.drawRect(0,0,440, 575)
		hitBox.endFill()
		hitBox.alpha = 0.4
		hitBox.x = -hitBox.width * 0.5
		hitBox.y = -hitBox.height * 0.5 + 25
		boxGroup.add(hitBox)

		wormGroup = game.add.group()
		wormGroup.x = boxGroup.x
		wormGroup.y = boxGroup.y
		sceneGroup.add(wormGroup)

		worm = createSpine("centipede","front", "IDLE", 0, 25)
		worm.setAnimation(["IDLE"])
		wormGroup.add(worm)
		worm.direction = "down"
		newDirection = "down"
		worm.circles = []
		worm.trace = []
		worm.circles.push(worm)
		worm.oldX = 0
		worm.oldY = 0

		worm.hitbox = game.add.graphics()
		worm.hitbox.beginFill(0xffffff)
		worm.hitbox.drawRect(0,0,25, 25)
		worm.hitbox.endFill()
		worm.hitbox.alpha = 0.4
		worm.hitbox.x = -worm.hitbox.width * 0.5
		worm.hitbox.y = -worm.hitbox.height * 0.5
		worm.add(worm.hitbox)

		var exit = game.add.graphics()
		exit.beginFill(0x000000)
		exit.drawRect(0,0,150, 100)
		exit.endFill()
		exit.alpha = 0.4
		exit.x = -boxGroup.width * 0.5
		exit.y = -boxGroup.height * 0.5 + 75
		boxGroup.add(exit)
		wormGroup.exit = exit


		// addCircleWorm()
		// addCircleWorm()
		// addCircleWorm()
		// addCircleWorm()
		// addCircleWorm()
		// addCircleWorm()
	}
	
	function generateGrid() {
		var width = hitBox.width - GRID_SIZE
		var height = hitBox.height - GRID_SIZE
		var numRows = Math.ceil(height / GRID_SIZE)
		var numCols = Math.ceil(width / GRID_SIZE)
		console.log(numRows, numCols)
		grid = []

		var startX = -width * 0.5 + 70
		var startY = -height * 0.5 + 40
		for(var gridIndex = 0; gridIndex < numCols * numRows; gridIndex++) {

			if (gridIndex > 1) {
				var xIndex = (gridIndex % numCols) - 1
				var yIndex = Math.ceil((gridIndex + 1) / numCols) - 1

				var x = startX + GRID_SIZE * xIndex
				var y = startY + GRID_SIZE * yIndex
				var coordinates = {x: x, y: y}

				// var appleito = wormGroup.create(x,y,"atlas.countip","apple")
				// appleito.anchor.setTo(0.5, 0.5)
				// appleito.alpha = 0.4

				grid.push(coordinates)
			}
		}

	}
	
	function hideWorm() {
		var toX = wormGroup.exit.x + 95
		var toY = wormGroup.exit.y + 50

		for(var circleIndex = 0; circleIndex < worm.circles.length; circleIndex++){
			var circle = worm.circles[circleIndex]
			var delay = (circleIndex + 1) * 100
			var time = circleIndex * 100 + 400
			game.add.tween(circle).to({x:toX, y:toY}, time, null, true, delay)
			game.add.tween(circle).to({alpha:0}, time, Phaser.Easing.Cubic.In, true, delay * 2)
		}
	}
	
	function checkExit() {
		var head = worm.circles[0]
		var collide = checkOverlap2(worm.hitbox, wormGroup.exit)
		if(collide){
			isActive = false
			hideWorm()
		}
	}

	function checkOverlap(spriteA, spriteB) {

		// var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(spriteA , boundsB );

	}

	function checkOverlap2(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

	}
	
	function checkCollision(obj) {
		var collide = false
		for(var circleIndex = 0, num = worm.circles.length; circleIndex < num; circleIndex++){
			var circle = worm.circles[circleIndex]

			collide = checkOverlap(obj, circle.hitbox)
			if(collide)
				break;
		}
		return collide
	}
	
	function addRandomApple() {

		isActive = false
		apple.alpha = 0

		grid = Phaser.ArrayUtils.shuffle(grid)
		var randomElement = grid[0]

		var x = randomElement.x
		var y = randomElement.y
		var worldX = x + wormGroup.x - GRID_SIZE
		var worldY = y + wormGroup.y - GRID_SIZE
		var checkRect = new Phaser.Rectangle(worldX, worldY, GRID_SIZE * 2, GRID_SIZE * 2)

		// var rect = game.add.graphics()
		// rect.beginFill(0x000000)
		// rect.drawRect(worldX, worldY, GRID_SIZE * 2, GRID_SIZE * 2)
		// rect.endFill()
		// sceneGroup.add(rect)

		var collide = checkCollision(checkRect, true)
		if(collide){
			addRandomApple()
		}else {
			isActive = true
			apple.alpha = 1
			apple.x = x, apple.y = y
			apple.revive()
		}

	}
	
	function selfCollision() {
		var head = worm.circles[0]
		var collide = false
		for(var circleIndex = 1; circleIndex < worm.circles.length; circleIndex++){
			var circle = worm.circles[circleIndex]
			collide = checkOverlap2(circle.hitbox, head.hitbox)
			if ((collide)&&(circle.trace.length > 0)){
				isActive = false
				worm.setAnimation(["LOSE"])
				break;
			}

		}
		return collide
	}
	
	function checkBounds() {
		var rectangle = hitBox.getBounds()
		// rectangle.inflate(20, 20)
		var rectangle2 = worm.hitbox.getBounds()
		var contains = rectangle.containsRect(rectangle2)

		if(!contains){
			isActive = false
			worm.setAnimation(["LOSE"])
		}
	}
	
	// function changeDirection(circle, lastCircle) {
	// 	circle.direction = lastCircle.direction
	// }
	
	function updateTail() {
		for(var circleIndex = 1, num = worm.circles.length; circleIndex < num; circleIndex++){
			var circle = worm.circles[circleIndex]
			var pastCircle = worm.circles[circleIndex - 1]

			var spaceTrace = Math.round(MAX_SPACE / speed)
			if(pastCircle.trace[spaceTrace]){
				var trace = pastCircle.trace[circle.traceIndex]
				circle.x = trace.x, circle.y = trace.y
				circle.traceIndex++

				var trace = {x:circle.x, y:circle.y}
				circle.trace.push(trace)
			}
		}
	}
	
	function update() {

		var direction = swipe.check()
		if (direction !== null) {
			switch (direction.direction) {
				case swipe.DIRECTION_UP:
					if(worm.direction !== "down"){
						worm.direction = "up"
						worm.setSkinByName("bot")
					}
					break;
				case swipe.DIRECTION_DOWN:
					if(worm.direction !== "up") {
						worm.direction = "down"
						worm.setSkinByName("front")
					}
					break;
				case swipe.DIRECTION_LEFT:
					if(worm.direction !== "right") {
						worm.direction = "left"
						worm.scale.x = 1
						worm.setSkinByName("lefth&rigth")
					}
					break;
				case swipe.DIRECTION_RIGHT:
					if(worm.direction !== "left") {
						worm.direction = "right"
						worm.scale.x = -1
						worm.setSkinByName("lefth&rigth")
					}
					break;
			}
		}

		// if(worm.direction !== newDirection){
		// 	var difX = Math.abs(worm.oldX - worm.x)
		// 	var difY = Math.abs(worm.oldY - worm.y)
		// 	if((difX >= GRID_SIZE)||(difY >= GRID_SIZE)) {
		// 		worm.direction = newDirection
		// 		worm.oldX = worm.x
		// 		worm.oldY = worm.y
		// 	}
		// }

		if(worm.direction === "down"){
			worm.y += speed
		}else if(worm.direction === "up"){
			worm.y -= speed
		}else if(worm.direction === "left"){
			worm.x -= speed
		}else if(worm.direction === "right"){
			worm.x += speed
		}

		var trace = {x:worm.x, y:worm.y}
		worm.trace.push(trace)

		updateTail()
		checkBounds()

		// timeElapsed += game.time.elapsedMS
		var x = apple.world.x - apple.width * 0.5
		var y = apple.world.y - apple.height * 0.5
		var checkRect = new Phaser.Rectangle(x, y, apple.width, apple.height)

		var collision = checkCollision(checkRect)
		if(apple.alive) {
			if (collision) {
				apple.kill()
				addCircleWorm()
				addRandomApple()
			}
		}

		selfCollision()
		checkExit()

	}

	return {
		assets: assets,
		name: "countip",
		preload:preload,
		update:function(){
			if(isActive)
				update()
		},
		create: function(event){

			swipe = new Swipe(game)
			sceneGroup = game.add.group()

			var background = sceneGroup.create(-2,-2,'fondo')
			background.width = game.world.width+2
			background.height = game.world.height+2

			var swatch = game.add.tileSprite(0,0,game.world.width, game.world.height, "atlas.countip", "swatch")
			sceneGroup.add(swatch)
			swatch.alpha = 0.7

			countipSong = game.add.audio('countipSong')
			game.sound.setDecodedCallback(countipSong, function(){
				countipSong.loopFull(0.6)
			}, this);

			game.onPause.add(function(){
				game.sound.mute = true
			} , this);

			game.onResume.add(function(){
				game.sound.mute = false
			}, this);

			createCountipUI()
			generateGrid()
			initialize()

			createHearts()
			createPointsBar()
			createGameObjects()
			// createClock()
			createTutorial()

			// addRandomApple()

			buttons.getButton(countipSong,sceneGroup,game.world.width - 50)
		}
	}
}()