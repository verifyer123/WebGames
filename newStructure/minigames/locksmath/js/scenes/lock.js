
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var lock = function(){

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
				name: "atlas.lock",
				json: "images/lock/atlas.json",
				image: "images/lock/atlas.png"
			},
			{   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }

		],
		images: [
			{   name:"fondowin",
				file: "images/lock/fondowin.png"},
			{   name:"fondolose",
				file: "images/lock/fondolose.png"}
		],
		sounds: [
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "magic",
				file: soundsPath + "magic.mp3"},
			{	name: "drag",
				file: soundsPath + "drag.mp3"},
			{	name: "cut",
				file: soundsPath + "cut.mp3"},
			{	name: "lock",
				file: soundsPath + "lock.mp3"},
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
			{   name: "slot",
				file: soundsPath + "stop.mp3"},
			{   name: "laugh",
				file: soundsPath + "laugh.mp3"},
			{   name: "anger",
				file: soundsPath + "anger.mp3"},
			{   name: "stoneDoor",
				file: soundsPath + "stoneDoor.mp3"},
			{   name: "goldShine",
				file: soundsPath + "goldShine.mp3"},
			{   name: "secret",
				file: soundsPath + "secret.mp3"},
			{   name: "rolling",
				file: soundsPath + "rolling.mp3"},
			{   name: "towercollapse",
				file: soundsPath + "towercollapse.mp3"},
			{   name: "brightTransition",
				file: soundsPath + "brightTransition.mp3"}
		]
	}

	var NUM_LIFES = 3
	var NUM_OPTIONS = 3
	var SLOTS = [{name:"MISSING1", scale:0.5}, {name:"MISSING2", scale:0.75}, {name:"MISSING3", scale:1}]
	var ROUNDS = [
		{den:{min: 3, max:3}, numMax:3},
		{den:{min: 4, max:4}, numMax:4},
		{den:{min: 5, max:5}, numMax:5},
		{den:{min: 6, max:6}, numMax:6},
		{den:{min: 8, max:8}, numMax:8},
		{den:{min: 3, max:6}, numMax:6},
		{den:{min: 4, max:8}, numMax:8},
		{den:{min: 2, max:9}, numMax:9}
	]

	// var ROUNDS = [
	//     {continent: "america", flags: ["mexico", "usa"]},
	//     {continent: "america", numFlags: 4},
	//     {continent: "random", numFlags: 4}]

    var lives
	var sceneGroup = null
	var gameIndex = 48
	var tutoGroup
	var lockSong
	var heartsGroup = null
	var pullGroup = null
	var clock
	var timeValue
	var quantNumber
	var inputsEnabled
	var pointsBar
	var roundCounter
	var blockList
	var barGroup
	var lock
	var doorLeft, doorRight
	var winGroup, loseGroup
	var alphaBright
	var answersChecked

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
		timeValue = 10
		quantNumber = 3
		roundCounter = 0
		answersChecked = false

		sceneGroup.alpha = 0
		game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
		inputsEnabled = false
		blockList = []

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
		roundCounter = roundCounter + 1 < ROUNDS.length ? roundCounter + 1 : ROUNDS.length - 1
		timeValue-=timeValue * 0.10
		// }

	}

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.lock','xpcoins')
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

	function addBlocks(options) {
		var startX = -barGroup.width * 0.5 + 90
		var spaceWidth = barGroup.width / (NUM_OPTIONS + 1) + 30

		for(var blockIndex = 0; blockIndex < NUM_OPTIONS; blockIndex++){
			var block = blockList[blockIndex]
			pullGroup.remove(block)
			barGroup.add(block)
			block.x = startX + (spaceWidth * blockIndex)
			block.y = -5
			block.alpha = 0
			block.scale.x = 0.4, block.scale.y = 0.4

			block.originalX = block.x
			block.originalY = block.y

			var numerador = options[blockIndex].num
			var denominador = options[blockIndex].den
			var value = numerador / denominador

			block.numberText.text = numerador + "/" + denominador
			block.value = value

			var blockTween = game.add.tween(block).to({alpha:1}, 200, Phaser.Easing.Cubic.Out, true, 200 * (blockIndex + 1))
			game.add.tween(block.scale).to({x:1, y:1}, 200, Phaser.Easing.Back.Out, true, 200 * (blockIndex + 1))
			blockTween.onStart.add(function () {
				sound.play("pop")
			})
			blockTween.onComplete.add(function (obj) {
				obj.bg.inputEnabled = true
			})
		}

		startTimer(checkCorrect, 200 * NUM_OPTIONS)
	}

	function onDragStart(obj, pointer) {

		// lock.spine.slotContainers[6].add(blockList[0])
		sound.play("drag")
		var block = obj.parent
		block.deltaX = pointer.x - obj.world.x
		block.deltaY = pointer.y - obj.world.y

		block.startX = (obj.world.x - barGroup.x) * lock.scale.x
		block.startY = (obj.world.y - barGroup.y) * lock.scale.y

		if(block.slot) {
			block.slot.block = null
			block.slot = null
		}

		barGroup.add(block)

		if(block.tween)
			block.tween.stop()

		block.tween = game.add.tween(block.scale).to({x: 1, y: 1}, 200, Phaser.Easing.Cubic.Out, true)

	}

	function onDragUpdate(obj, pointer, x, y) {
		var block = obj.parent
		obj.x = 0
		obj.y = 0
		block.x = block.startX + x - block.deltaX
		block.y = block.startY + y - block.deltaY

	}
	
	function closeDoors(obj) {
		var callback = obj.callback
		sound.play("stoneDoor")

		game.add.tween(doorLeft).to({x:0}, 800, Phaser.Easing.Cubic.Out, true)
		var closeDoor = game.add.tween(doorRight).to({x:game.world.width}, 800, Phaser.Easing.Cubic.Out, true)
		closeDoor.onComplete.add(callback)
	}
	
	function startWin() {

		sound.play("secret")

		var forwardEffect = game.add.tween(winGroup.scale).to({x:1.2, y:1.2}, 2000, Phaser.Easing.Cubic.Out, false, 1000)
		var hideAll = game.add.tween(sceneGroup).to({alpha:0}, 2000, Phaser.Easing.Cubic.Out, false, 1000)
		hideAll.onStart.add(function () {
			sound.play("brightTransition")
		})
		hideAll.onComplete.add(function () {
			winGroup.scale.x = 1
			winGroup.scale.y = 1
			winGroup.alpha = 0
			winGroup.alpha = 0
			doorRight.x = game.world.width * 1.5
			doorLeft.x = -game.world.width * 0.5
			winGroup.jewel.x = 0
			winGroup.jewel.y = winGroup.jewel.originalY
			winGroup.jewel.scale.x = 1, winGroup.jewel.scale.y = 1
			winGroup.add(winGroup.jewel)
			winGroup.jewel.animations.play('spin', 10, true)
			winGroup.jewel.alpha = 1
			clock.bar.scale.x = clock.bar.origScale

			sceneGroup.callback = startRound
			game.add.tween(sceneGroup).to({alpha:1}, 1200, Phaser.Easing.Cubic.In, true).onComplete.add(closeDoors)
		})

		winGroup.jewel.x = winGroup.jewel.world.x
		winGroup.jewel.y = winGroup.jewel.world.y
		sceneGroup.add(winGroup.jewel)


		var moveJewel = game.add.tween(winGroup.jewel).to({x: pointsBar.centerX, y: pointsBar.centerY}, 1200, Phaser.Easing.Cubic.In, false, 200)
		var scaleJewel = game.add.tween(winGroup.jewel.scale).to({x: 0.5, y: 0.5}, 600, Phaser.Easing.Cubic.Out, false)
		var dissapearJewel =game.add.tween(winGroup.jewel).to({alpha:0}, 400, Phaser.Easing.Cubic.Out, false)
		moveJewel.onStart.add(function(){
			winGroup.jewel.animations.stop()
			scaleJewel.start()
		})
		moveJewel.onComplete.add(function () {
			dissapearJewel.start()
			addPoint(5)
			forwardEffect.start()
			hideAll.start()
		})
		
		var scaleTween = game.add.tween(winGroup.jewel.scale).to({x: 1.2,y:1.2}, 200, Phaser.Easing.linear, true, 1000)
		scaleTween.onStart.add(function () {
			sound.play("goldShine")
		})
		scaleTween.onComplete.add(function(){
			game.add.tween(winGroup.jewel.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
			moveJewel.start()
		})
	}
	
	function shockingEffect(rock) {
		rock.setAlive(false)

		sceneGroup.toX = 20
		sound.play("towercollapse")

		var shockRight = game.add.tween(sceneGroup).to({x:sceneGroup.toX}, 200, Phaser.Easing.Sinusoidal.InOut, false)
		var shockLeft = game.add.tween(sceneGroup).to({x:-sceneGroup.toX}, 200, Phaser.Easing.Sinusoidal.InOut, false)
		shockRight.onComplete.add(function () {
			shockLeft.start()
		})
		shockLeft.onComplete.add(function () {
			shockRight.start()
		})

		var zoomEffect = game.add.tween(loseGroup.scale).to({x:1.1, y:1.1}, 200, Phaser.Easing.Cubic.Out, true)
		zoomEffect.onComplete.add(function () {
			var endZoom = game.add.tween(loseGroup.scale).to({x:1, y:1}, 200, Phaser.Easing.Cubic.Out, true)
			endZoom.onComplete.add(function () {
				shockRight.start()
			})
		})
		
		stopGame()
	}
	
	function startLose() {
		var stoneSound = sound.play("rolling")

		game.add.tween(loseGroup.rock.scale).to({x:1, y:1}, 1200, Phaser.Easing.Cubic.In, true)
		var rockFalling = game.add.tween(loseGroup.rock).to({y:220}, 1200, Phaser.Easing.Cubic.In, true)
		rockFalling.onComplete.add(shockingEffect)
	}
	
	function createReaction(obj) {
		var callback
		var isCorrect = obj ? obj.isCorrect : false

		if(isCorrect){
			sound.play("laugh")
			lock.setAnimation(["WIN"])
			winGroup.alpha = 1
			callback = function(){
				startWin()
			}
		}else {
			sound.play("anger")
			lock.setAnimation(["LOSE"])
			loseGroup.alpha = 1
			callback = function(){
				startLose()
			}
		}
		var dissapear = game.add.tween(lock).to({alpha:0}, 600, Phaser.Easing.Cubic.Out, true, 2000)
		lock.callback = callback
		dissapear.onComplete.add(openDoors)
		
	}

	function endTime(){
		
		var bargroupTween = game.add.tween(barGroup).to({alpha:0}, 800, Phaser.Easing.Cubic.In, true)
		lock.wrongParticle.start(true, 1000, null, 5)
		sound.play("wrong")
		barGroup.isCorrect = false
		bargroupTween.onComplete.add(createReaction)

	}
	
	function checkCorrect() {
		answersChecked = true

		if (clock.tween)
			clock.tween.stop()

		var prevSlot
		var isCorrect = true
		for(var slotIndex = 0, n = lock.slotContainers.length; slotIndex < n; slotIndex++){
			var slot = lock.slotContainers[slotIndex]
			if(slot.block) {
				slot.block.bg.inputEnabled = false
				slot.block.bg.input.enableDrag(true)

				if(prevSlot){
					isCorrect = (prevSlot.block.value <= slot.block.value) && isCorrect
				}
				prevSlot = slot
			}else
				isCorrect = false

		}

		var bargroupTween = game.add.tween(barGroup).to({alpha:0}, 800, Phaser.Easing.Cubic.In, true)
		if(isCorrect){
			lock.correctParticle.start(true, 1000, null, 5)
			sound.play("right")
		}else {
			lock.wrongParticle.start(true, 1000, null, 5)
			sound.play("wrong")
		}
		barGroup.isCorrect = isCorrect

		bargroupTween.onComplete.add(createReaction)
	}
	
	function checkSlots() {
		var slotCounter = 0
		for(var slotIndex = 0, n = lock.slotContainers.length; slotIndex < n; slotIndex++){
			var slot = lock.slotContainers[slotIndex]
			if(slot.block)
				slotCounter++
		}

		if (slotCounter === lock.slotContainers.length){

			checkCorrect()

		}
	}

	function onDragStop(obj) {
		var block = obj.parent
		obj.x = 0
		obj.y = 0
		obj.inputEnabled = false

		if(block.tween)
			block.tween.stop()

		var slot = checkCollision(block)
		if (slot){
			sound.play("slot")

			block.x = (block.centerX - slot.centerX) * (1 - lock.scale.x + 1)//scale dif
			block.y = (block.centerY - slot.centerY) * (1 - lock.scale.x + 1)//scale dif
			slot.add(block)
			block.scale.x = (1 - lock.scale.x + 1)
			block.scale.y = (1 - lock.scale.x + 1)

			block.tween = game.add.tween(block).to({x: 0, y: 0}, 400, Phaser.Easing.Cubic.Out, true)
			game.add.tween(block.scale).to({x: slot.toScale, y: slot.toScale}, 400, Phaser.Easing.Cubic.Out, true)
			block.tween.onComplete.add(function () {
				obj.inputEnabled = true
				checkSlots()
			})
			slot.block = block
			block.slot = slot

		}else{
			sound.play("cut")
			block.tween = game.add.tween(block).to({x: block.originalX, y: block.originalY}, 600, Phaser.Easing.Cubic.Out, true)
			block.tween.onComplete.add(function () {
				obj.inputEnabled = true
			})
		}


	}

	function checkCollision(block) {
		var slot

		for(var slotIndex = 0, n = lock.slotContainers.length; slotIndex<n; slotIndex++){
			var slotToCheck = lock.slotContainers[slotIndex]
			var collide = checkOverlap(slotToCheck, block.hitBox)
			if((collide)&&(!slotToCheck.block))
				slot = slotToCheck
		}

		return slot
	}

	function createGameObjects(){
		pullGroup = game.add.group()
		pullGroup.x = -game.world.centerX * 2
		pullGroup.y = -game.world.centerY * 2
		sceneGroup.add(pullGroup)
		pullGroup.alpha = 0

		for(var blockIndex = 0; blockIndex < NUM_OPTIONS; blockIndex++){
			var block = game.add.group()
			pullGroup.add(block)

			var blockBg = block.create(0, 0, "atlas.lock", "block")
			blockBg.anchor.setTo(0.5, 0.5)

			var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			// var numerador = new Phaser.Text(sceneGroup.game, 0, -20, "1", fontStyle)
			// numerador.anchor.setTo(0.5, 0.5)
			// block.add(numerador)
			//
			// var line = game.add.graphics()
			// line.beginFill(0xffffff)
			// line.drawRoundedRect(0, 0, 30, 5, 2)
			// line.x = -15
			// line.y = -7
			// line.endFill()
			// block.add(line)
			//
			// var denominador = new Phaser.Text(sceneGroup.game, 0, 20, "1", fontStyle)
			// denominador.anchor.setTo(0.5, 0.5)
			// block.add(denominador)
			var numberText = new Phaser.Text(game, 0, 0, "1/2", fontStyle)
			numberText.anchor.setTo(0.5, 0.5)
			block.numberText = numberText
			block.add(numberText)

			var hitBox = new Phaser.Graphics(game)
			hitBox.beginFill(0xFFFFFF)
			hitBox.drawRect(0,0,50, 50)
			hitBox.alpha = 0
			hitBox.endFill()
			hitBox.x = -hitBox.width * 0.5
			hitBox.y = -hitBox.height * 0.5
			block.add(hitBox)
			block.hitBox = hitBox

			blockBg.inputEnabled = true
			blockBg.input.enableDrag(true)
			blockBg.events.onDragStart.add(onDragStart, this)
			blockBg.events.onDragUpdate.add(onDragUpdate, this)
			blockBg.events.onDragStop.add(onDragStop, this)
			block.bg = blockBg
			blockBg.inputEnabled = false

			blockList.push(block)
		}

	}

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);

		particle.makeParticles('atlas.lock',key);
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
		lockSong.stop()
		if(clock.tween)
			clock.tween.stop()

		var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1800)
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
		game.load.audio('lockSong', soundsPath + 'songs/jungle_fun.mp3');

		game.load.image('introscreen',"images/lock/introscreen.png")
		game.load.image('howTo',"images/lock/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/lock/play" + localization.getLanguage() + ".png")

		game.load.image('door',"images/lock/door.png")
		game.load.spine('lock', "images/spine/lock.json")
		game.load.spine('rock', "images/spine/roca.json")
		game.load.spritesheet('jewel', 'images/lock/diamond.png', 84, 76, 23)

		buttons.getImages(game)

		game.load.image('tutorial_image',"images/lock/tutorial_image.png")
		loadType(gameIndex)


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
		var num = round.numMax
		var den = round.den
		var options = []
		var nums = []
		var dens = []

		for(var numIndex = 1; numIndex <= num; numIndex++){
			nums.push(numIndex)
		}

		for(var denIndex = den.min; denIndex <= den.max; denIndex++){
			dens.push(denIndex)
		}
		nums = Phaser.ArrayUtils.shuffle(nums)
		dens = Phaser.ArrayUtils.shuffle(dens)

		var lastValue
		for(var optionIndex = 0; optionIndex < NUM_OPTIONS; optionIndex++){
			var denominador = dens[optionIndex]
			if (denominador)
				lastValue = denominador
			else
				denominador = lastValue

			var numerador = nums[optionIndex]
			var option = {num: numerador, den: denominador}
			options.push(option)
		}

		return options
	}
	
	function startRound(notStarted) {

		for(var slotIndex = 0, n = lock.slotContainers.length; slotIndex < n; slotIndex++){
			var slot = lock.slotContainers[slotIndex]
			if(slot.block){
				slot.remove(slot.block)
				pullGroup.add(slot.block)

				slot.block.slot = null
				slot.block = null
			}
		}

		lock.setAnimation(["IDLE"])
		// lock.x = game.world.centerX
		// lock.y = game.world.centerY + 20
		lock.y = -200
		lock.alpha = 1
		answersChecked = false
		sound.play("swipe")
		var lockTween = game.add.tween(lock).to({y:game.world.centerY + 20 }, 800, Phaser.Easing.Back.Out, true)
		lockTween.onComplete.add(function () {
			sound.play("lock")
		})

		barGroup.scale.x = 0.4, barGroup.scale.y = 0.4
		game.add.tween(barGroup).to({alpha:1}, 600, Phaser.Easing.Cubic.Out, true, 1200).onStart.add(function () {
			sound.play("cut")
		})

		var round = ROUNDS[roundCounter]
		var options = generateQuestion(round)
		game.add.tween(barGroup.scale).to({x:1, y:1}, 600, Phaser.Easing.Cubic.Out, true, 1200).onComplete.add(function(){
			addBlocks(options)
		})
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

	// function createHearts(){
	//
	//     heartsGroup = game.add.group()
	//     heartsGroup.y = 10
	//     sceneGroup.add(heartsGroup)
	//
	//     var pivotX = 10
	//     var group = game.add.group()
	//     group.x = pivotX
	//     heartsGroup.add(group)
	//
	//     var heartImg = group.create(0,0,'atlas.lock','life_box')
	//
	//     pivotX+= heartImg.width * 0.45
	//
	//     var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
	//     var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
	//     pointsText.x = pivotX
	//     pointsText.y = heartImg.height * 0.15
	//     pointsText.setText('X ' + lives)
	//     heartsGroup.add(pointsText)
	//
	//     pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
	//
	//     heartsGroup.text = pointsText
	//
	// }

	function startTimer(onComplete, delay) {
		var delay = 500
		// clock.bar.scale.x = clock.bar.origScale
		if (clock.tween)
			clock.tween.stop()


		clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeValue * quantNumber * 1000,Phaser.Easing.linear,true,delay )
		clock.tween.onComplete.add(function(){
			if(!answersChecked){
				//onComplete()
				endTime()
			}

		})
	}

	function onClickPlay(rect) {

		tutoGroup.y = -game.world.height
		// sceneGroup.callback = startLose
		// loseGroup.alpha = 1
		// openDoors(sceneGroup)
		startRound()
	}

	function createTutorial(){

		tutoGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
		sceneGroup.add(tutoGroup)

		createTutorialGif(tutoGroup,onClickPlay)

		
	}

	function createClock(){

		clock = game.add.group()
		clock.x = game.world.centerX
		clock.y = 100
		sceneGroup.add(clock)

		var clockImage = clock.create(0,0,'atlas.lock','clock')
		clockImage.anchor.setTo(0.5,0.5)

		var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.lock','bar')
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
	
	function openDoors(obj) {
		var callback = obj.callback
		sound.play("stoneDoor")
		
		var openDoor = game.add.tween(doorLeft).to({x: -270}, 600, Phaser.Easing.Cubic.Out, true)
		game.add.tween(doorRight).to({x: game.world.width + 270}, 600, Phaser.Easing.Cubic.Out, true)

		openDoor.onComplete.add(callback)
	}

	function createDoors() {
		doorLeft = game.add.group()
		sceneGroup.add(doorLeft)

		var doorLeftTile = game.add.tileSprite(0 , 0, game.world.width * 0.5, game.world.height, "door")
		doorLeft.add(doorLeftTile)

		var barLeft = game.add.graphics()
		barLeft.beginFill(0x3E5F85)
		barLeft.drawRect(0,0,20, game.world.height + 2)
		barLeft.x = game.world.width * 0.5 - 20
		barLeft.endFill()
		doorLeft.add(barLeft)

		doorRight = game.add.group()
		doorRight.x = game.world.width
		sceneGroup.add(doorRight)

		var doorRightTile = game.add.tileSprite(0 , 0, game.world.width * 0.5, game.world.height, "door")
		doorRightTile.scale.x *= -1
		doorRight.add(doorRightTile)

		var barRight = game.add.graphics()
		barRight.beginFill(0x3E5F85)
		barRight.drawRect(0,0,20, game.world.height + 2)
		barRight.x = -game.world.width * 0.5
		barRight.endFill()
		doorRight.add(barRight)

		lock = createSpine("lock", "normal")
		// var lockData = lock.slotContainers
		lock.x = game.world.centerX
		lock.y = -200
		lock.setAnimation(["IDLE"])
		lock.slotContainers = []
		// lock.alpha = 0
		sceneGroup.add(lock)

		var swatch = game.add.tileSprite(0 , 0, game.world.width, 196, "atlas.lock", "swatch")
		sceneGroup.add(swatch)

		var correctParticle = createPart("star")
		lock.add(correctParticle)
		lock.correctParticle = correctParticle

		var wrongParticle = createPart("wrong")
		lock.add(wrongParticle)
		lock.wrongParticle = wrongParticle

		for(var slotIndex = 0, n = SLOTS.length; slotIndex < n; slotIndex++){
			var slotName = SLOTS[slotIndex].name
			var slot = lock.getSlotContainer(slotName)
			slot.toScale = SLOTS[slotIndex].scale
			lock.slotContainers.push(slot)
		}
	}

	function createBarBlocks() {
		barGroup = game.add.group()
		barGroup.x = game.world.centerX
		barGroup.y = game.world.height - 100
		barGroup.alpha = 0
		sceneGroup.add(barGroup)

		var bar = barGroup.create(0,0,"atlas.lock", "base")
		bar.anchor.setTo(0.5, 0.5)
	}
	
	function createWinScreen() {
		winGroup = game.add.group()
		winGroup.x = game.world.centerX
		winGroup.y = game.world.centerY
		sceneGroup.add(winGroup)
		winGroup.alpha = 0

		var background = winGroup.create(0,0,'fondowin')
		background.anchor.setTo(0.5, 0.5)

		var base = winGroup.create(0,0,"atlas.lock","base2")
		base.y = 350
		base.anchor.setTo(0.5, 0.5)

		var jewelSprite = game.add.sprite(0, 0, 'jewel')
		jewelSprite.anchor.setTo(0.5, 0.5)
		jewelSprite.animations.add('spin')
		jewelSprite.y = base.y - 80
		jewelSprite.originalY = jewelSprite.y
		winGroup.add(jewelSprite)
		winGroup.jewel = jewelSprite

		jewelSprite.animations.play('spin', 10, true)
	}
	
	function createLoseScreen() {
		loseGroup = game.add.group()
		loseGroup.x = game.world.centerX
		loseGroup.y = game.world.centerY
		sceneGroup.add(loseGroup)
		loseGroup.alpha = 0

		var background = loseGroup.create(0,0,'fondolose')
		background.anchor.setTo(0.5, 0.5)

		var rock = createSpine("rock", "normal", "IDLE", 0, 112)
		rock.y = -350 + rock.height * 0.5
		rock.scale.setTo(0.4, 0.4)
		loseGroup.add(rock)
		loseGroup.rock = rock
	}

	return {
		assets: assets,
		name: "lock",
		preload:preload,
		create: function(event){

			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

			createWinScreen()
			createLoseScreen()

			alphaBright = new Phaser.Graphics(game)
			alphaBright.beginFill(0x000000)
			alphaBright.drawRect(0,0,game.world.width *2, game.world.height *2)
			alphaBright.alpha = 0
			alphaBright.endFill()
			sceneGroup.add(alphaBright)

			lockSong = game.add.audio('lockSong')
			game.sound.setDecodedCallback(lockSong, function(){
				lockSong.loopFull(0.6)
			}, this);

			game.onPause.add(function(){
				game.sound.mute = true
			} , this);

			game.onResume.add(function(){
				game.sound.mute = false
			}, this);

			initialize()
			createGameObjects()
			createDoors()
			createBarBlocks()

			// createHearts()
			createPointsBar()
			createClock()
			createTutorial()

			buttons.getButton(lockSong,sceneGroup)
		}
	}
}()