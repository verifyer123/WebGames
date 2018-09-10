
var soundsPath = "../../shared/minigames/sounds/"

var sushi = function(){

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
				name: "atlas.sushi",
				json: "images/sushi/atlas.json",
				image: "images/sushi/atlas.png"
			},

		],
		images: [
			{   name: "tutorial_image",
			 file: "images/sushi/tutorial_image.png"
			}
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
			 file: soundsPath + "wrongAnswer.mp3"},
			{	name: "right",
			 file: soundsPath + "rightChoice.mp3"},
			{   name: "gameLose",
			 file: soundsPath + "gameLose.mp3"},
			{   name: "swallow",
			 file: soundsPath + "swallow.mp3"},
			{   name: "drag",
			 file: soundsPath + "drag.mp3"},
			{   name: "dojoSong",
			 file: soundsPath + "songs/asianLoop2.mp3"}
		],
		spritesheets: [
			{
				name:"coin",
				file:"images/spine/coin/coin.png",
				width:122,
				height:123,
				frames:12
			},
			{
				name:"hand",
				file:"images/spine/hand/hand.png",
				width:115,
				height:111,
				frames:5
			}
		],
		spines:[
			{
				name:"octopus",
				file:"images/spine/Octopus/octopus.json"
			},
			{
				name:"players",
				file:"images/spine/yogo/yogo.json"
			}
		]
	}

	var NUM_LIFES = 3
	var MAX_NUM_SUSHIS = 30
	var SUSHIS = ["sushi1", "sushi2", "sushi3", "sushi4"]
	var SUSHI_DATA = {
		"sushi1":{num:1, denom:3},
		"sushi2":{num:1, denom:4},
		"sushi3":{num:2, denom:5},
		"sushi4":{num:2, denom:6}
	}
	var BAR_POSITIONS = [-203, -7, 189]

	var lives
	var sceneGroup = null
	var handGroup = null
	var heartsGroup = null
	var gameIndex = 76
	var tutoGroup
	var sushiSong
	var pullGroup = null
	var numPoints
	var inputsEnabled
	var checkingFrame
	var pointsBar
	var sushiList
	var notFinished
	var firstAnimation;
	var tutorial
	var sushisInGame
	var nextAnimation
	var gameGroup
	var maxHeight
	var roundCounter
	var timeNextSushi
	var timeBetween
	var gameActive
	var swipe
	var hand
	var coins
	var handleSushi
	var addBrickCounter
	var isCompleting
	var diferentSushi=[];
	var speed
	var creatingSushi;
	var yogotars
	var correctParticle, wrongParticle
	var barLanes
	var octopus
	var handMoving
	var notMissing
	var gameEnded

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		game.stage.backgroundColor = "#ffffff"
		gameActive = false
		lives = NUM_LIFES
		numPoints = 0
		creatingSushi=false;
		handMoving=false;
		isCompleting=false;
		notFinished=false
		notMissing=false;
		roundCounter = 0
		addBrickCounter = 0
		nextAnimation=false
		speed = 4
		timeBetween = 3000
		sushiList = []
		checkingFrame=0;
		sushisInGame = [[],[],[]]
		tutorial=true;
		sushisInGame[0].delaySushi = 0
		sushisInGame[1].delaySushi = 0
		sushisInGame[2].delaySushi = 0
		sushisInGame[0].merging = false
		sushisInGame[1].merging = false
		sushisInGame[2].merging = false
		gameEnded=false;
		sceneGroup.alpha = 0
		game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
		//inputsEnabled = true
		maxHeight = game.world.height - 50
		timeNextSushi = 0

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

		timeBetween-=timeBetween * 0.02
		speed += speed * 0.02

	}

	function createSushi(sushi) {


		var sprite = pullGroup.create(0, 0, "atlas.sushi", sushi)
		sprite.anchor.setTo(0.5, 0.5)		

		if(!sushiList[sushi])
			sushiList[sushi] = []
		sushiList[sushi].push(sprite)

		var sushiBg = pullGroup.create(0, 0, "atlas.sushi", "numberBg")
		sushiBg.anchor.setTo(0.5, 0.5)
		if(!sushiList.bg)
			sushiList.bg = []
		sushiList.bg.push(sushiBg)
		sprite.inputEnabled = true
		sprite.input.enableDrag(true)
		sprite.events.onDragStart.add(onDragStart, this)
		sprite.events.onDragUpdate.add(onDragUpdate, this)
		sprite.events.onDragStop.add(onDragStop, this)
		sprite.inputEnabled = false
		sprite.alive=false;
	}

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.sushi','xpcoins')
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

		gameGroup = game.add.group()
		gameGroup.x = game.world.centerX
		gameGroup.y = 0
		sceneGroup.add(gameGroup)

		for(var sushiNameIndex = 0; sushiNameIndex < SUSHIS.length; sushiNameIndex++){
			for(var sushiIndex = 0; sushiIndex < MAX_NUM_SUSHIS; sushiIndex++){
				createSushi(SUSHIS[sushiNameIndex])


			}
		}

	}

	function Coin(objectBorn,objectDestiny,time){
		coins.x=objectBorn.centerX
		coins.y=objectBorn.centerY
		game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
		game.add.tween(coins).to({y:objectBorn.centerY-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
			game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
			game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
				coins.x=objectBorn.centerX
				coins.y=objectBorn.centerY
				addPoint(1)
			})
		})
	}

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);

		particle.makeParticles('atlas.sushi',key);
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

		sushiSong.stop()
		game.input.enabled = false
		gameActive = false
		for(var yogoIndex = 0; yogoIndex < yogotars.length; yogoIndex++){
			var yogotar = yogotars[yogoIndex]
			yogotar.setAnimation(["lose"])
		}
		var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2500)
		tweenScene.onComplete.add(function(){

			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number, gameIndex)
			game.input.enabled = true
			sceneloader.show("result")
			sound.play("gameLose")
		})
	}

	function preload(){

		game.stage.disableVisibilityChange = false;
	}

	function addNumberPart(obj,number,fontStyle,direction,offset){

		direction = direction || 100
		fontStyle = fontStyle || {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		offset = offset || {x:0, y:0}

		var pointsText = new Phaser.Text(sceneGroup.game, offset.x, offset.y, number, fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		if (obj.world) {
			pointsText.x = obj.world.x
			pointsText.y = obj.world.y
			sceneGroup.add(pointsText)
		}else{
			if (obj.scale.x < 0)
				pointsText.scale.x = -1
			obj.add(pointsText)
		}

		game.add.tween(pointsText).to({y:pointsText.y + direction},800,Phaser.Easing.linear,true)
		game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)

		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

	}

	function createHearts(){

		heartsGroup = game.add.group()
		heartsGroup.y = 10
		sceneGroup.add(heartsGroup)


		var pivotX = 10
		var group = game.add.group()
		group.x = pivotX
		heartsGroup.add(group)

		var heartImg = group.create(0,0,'atlas.sushi','life_box')

		pivotX+= heartImg.width * 0.45

		var fontStyle2 = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle2)
		pointsText.x = pivotX
		pointsText.y = heartImg.height * 0.15
		pointsText.setText('X ' + lives)
		heartsGroup.add(pointsText)

		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

		heartsGroup.text = pointsText

	}

	function missPoint(){

		sound.play("wrong")

		lives--;
		heartsGroup.text.setText('X ' + lives)

		var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
			notMissing=false;
		})
		if(lives == 0){
			stopGame(false)
		}

		addNumberPart(heartsGroup.text,'-1')

	}

	function createTextGroup(num, denom){
		var operationGroup = game.add.group()

		var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var numerador = new Phaser.Text(sceneGroup.game, 0, -12, num, fontStyle)
		numerador.anchor.setTo(0.5, 0.5)
		operationGroup.add(numerador)
		operationGroup.num = numerador

		var line = game.add.graphics()
		line.beginFill(0xffffff)
		line.drawRoundedRect(0, 0, 30, 4, 2)
		line.x = -15
		line.y = -2
		line.endFill()
		operationGroup.add(line)

		var denominador = new Phaser.Text(sceneGroup.game, 0, 22, denom, fontStyle)
		denominador.anchor.setTo(0.5, 0.5)
		operationGroup.add(denominador)
		operationGroup.denom = denominador

		return operationGroup
	}

	function addSushi(name, lane, toY) {
		timeNextSushi = 0

		var dificulty = pointsBar.number;
		var dataSushi = SUSHI_DATA[name]

		dataSushi = SUSHI_DATA[name]

		var sushi = game.add.group()

		sushi.sushiList = []
		for(var containerIndex = 0; containerIndex < dataSushi.num; containerIndex++){
			var sushiSprite = sushiList[name].pop()

			sushiSprite.y = -sushiSprite.height * 0.5 * containerIndex
			sushiSprite.inputEnabled = true
			sushiSprite.originalY = sushiSprite.y
			sushi.sushiList.push(sushiSprite)
			sushi.add(sushiSprite)

			if(!sushi.container)
				sushi.container = sushiSprite
		}

		var randomSkin;
		var newSkin="";
		if(pointsBar.number>5){
			randomSkin=game.rnd.integerInRange(0,2);
			newSkin=name+randomSkin;
			if(randomSkin==0){
				newSkin=name;
			}
			sushiSprite.loadTexture("atlas.sushi",newSkin);
		}
		sushi.denom = dataSushi.denom
		sushi.name = name
		sushi.alpha = 0
		sushi.num = dataSushi.num
		sushi.lane = lane

		var bg = sushiList.bg.pop()
		bg.y = 0
		bg.alpha = 1
		sushi.bg = bg

		pullGroup.remove(sushiSprite)
		sushi.alive=true;
		gameGroup.add(sushi)
		sushi.scale.x = 1
		sushi.scale.y = 1
		sushi.x = BAR_POSITIONS[lane]
		sushi.y = toY || 330
		sushi.container.inputEnabled = true
		var operationText = createTextGroup(sushi.num, sushi.denom)
		operationText.y = -sushi.container.height * 0.10 * sushi.num
		operationText.add(bg)
		operationText.sendToBack(bg)
		sushi.add(operationText)
		sushi.operationText = operationText

		sushisInGame[lane].push(sushi)
		game.add.tween(sushi).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true)
	}

	function startRound() {

		for(var brickIndex = 0; brickIndex < 3; brickIndex++){
			var toY = (maxHeight)
			addSushi("sushi1", brickIndex, toY);
		}
		hand.x=game.world.centerX-200;
		hand.y=game.world.height-100;
		sceneGroup.add(hand)
		hand.alpha=1;
		sushisInGame[1][0].container.input.enabled=false;
	}

	function onClickPlay(rect) {
		tutoGroup.y = -game.world.height
		gameActive = true
		startRound()
	}

	function sushiAnimation(lane) {
		var toX = 40
		var disableInputs
		for(var sushiIndex = 0; sushiIndex<sushisInGame[lane].length; sushiIndex++){
			toX = game.rnd.integerInRange(-100,100);
			var sushi = sushisInGame[lane][sushiIndex];
			for(var disable=0; disable<sushisInGame[lane][sushiIndex].sushiList.length;disable++){
				disableInputs=sushisInGame[lane][sushiIndex].sushiList[disable];
				disableInputs.input.enabled=false;
			}
			sushi.container.input.enabled=false;
			game.add.tween(sushi).to({x:sushi.x + toX, y: game.world.height+300}, 900, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
				if(lives>0){
					destroySushi(lane);
					octopus.setAnimation(["idle"])
				}
			});
		}
	}

	function createSpines() {
		var nao = createSpine("players", "nao")
		nao.x = game.world.centerX + 92
		nao.y = game.world.height - 100
		nao.scale.setTo(-0.5, 0.5)
		sceneGroup.add(nao)

		var tomiko = createSpine("players", "tomiko")
		tomiko.x = game.world.centerX - 98
		tomiko.y = game.world.height - 100
		tomiko.scale.setTo(0.5, 0.5)
		sceneGroup.add(tomiko)

		yogotars = [tomiko, nao]
	}

	function destroyBg(operationText) {
		var sushi = operationText.parent
		var bg = sushi.bg

		if(sushi.num <= 0){
			pullGroup.add(bg)
			sushiList.bg.push(bg)
			sushi.destroy()
		}
	}

	function removeSushi(sushi) {

		for(var containerIndex = 0, num = sushi.sushiList.length; containerIndex < num; containerIndex++){
			var container = sushi.sushiList[containerIndex]
			sushi.remove(container)
			pullGroup.add(container)
			sushiList[sushi.name].push(container)
		}
		sushisInGame[sushi.lane].merging = false
		pullGroup.add(sushi.bg)
		sushiList.bg.push(sushi.bg)
		sushi.alive=false;
		sushi.destroy()
		isCompleting=false;
	}
	function removeHandleSushi(sushi) {

		for(var containerIndex = 0, num = sushi.sushiList.length; containerIndex < 1; containerIndex++){
			var container = sushi.sushiList[containerIndex]
			sushi.remove(container)
			pullGroup.add(container)
			sushiList[sushi.name].push(container)
		}
		sushisInGame[sushi.lane].merging = false
		pullGroup.add(sushi.bg)
		sushiList.bg.push(sushi.bg)
		sushi.alive=false;
		sushi.destroy()
		isCompleting=false;
	}

	function moveSushi(args) {

		var toX = args.position.x - gameGroup.x
		var toY = args.position.y - gameGroup.y

		var tweenMove = game.add.tween(args.sushi).to({x: [toX, toX], y:[toY, toY], alpha:[1,0]}, 600, Phaser.Easing.Cubic.Out, true)
		game.add.tween(args.sushi.scale).to({x:0.5, y:0.5}, 300, Phaser.Easing.Cubic.Out, true)
		tweenMove.onComplete.add(removeSushi)
		sound.play("swipe")
		sound.play("swallow")

		sushisInGame[args.sushi.lane].splice(args.sushi.index, 1)
	}

	function sushiCompleted(sushi) {
		sound.play("combo")

		correctParticle.x = sushi.centerX
		correctParticle.y = sushi.centerY
		correctParticle.start(true, 1000, null, 5)
		sushi.completed = true
		for(var containerIndex = 0; containerIndex < sushi.sushiList.length; containerIndex++){
			var container = sushi.sushiList[containerIndex]
			container.inputEnabled = false
		}
		var toYogotar
		if(sushi.lane < 1){
			toYogotar = 0
		}else if(sushi.lane > 1){
			toYogotar = 1
		}else{
			toYogotar = game.rnd.integerInRange(0, yogotars.length - 1)
		}

		var yogotar = yogotars[toYogotar]
		var toX = toYogotar > 0 ? yogotar.centerX - 50 : yogotar.centerX + 50
		var args = {sushi:sushi, position:{x:toX, y:yogotar.centerY}}

		yogotar.setAnimation(["win", "eat", "idle"])
		game.time.events.add(1350, moveSushi, null, args)
		Coin(sushi,pointsBar,100);
		if(tutorial){
			hand.alpha=0;
			tutorial=false;
		}
	}

	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB);
	}

	function onDragStart(obj, pointer) {

		sound.play("drag")
		inputsEnabled=false;
		var option = obj.parent
		handleSushi=option;
		option.inBottom = false
		option.deltaX = pointer.x - obj.world.x
		option.deltaY = pointer.y - obj.world.y - obj.originalY

		option.startX = (obj.world.x - gameGroup.x)
		option.startY = (obj.world.y - gameGroup.y - obj.originalY)

		gameGroup.bringToTop(option)

		if(option.scaleTween)
			option.scaleTween.stop()
		
		if(option.index !== null){
			sushisInGame[option.lane].splice(option.index, 1)
			option.index = null
		}

	}

	function onDragUpdate(obj, pointer, x, y) {

		var option = obj.parent
		obj.x = 0
		obj.y = obj.originalY
		option.x = option.startX + x - option.deltaX
		option.y = option.startY + y - option.deltaY - obj.originalY * 2

		gameGroup.bringToTop(option)
	}

	function onDragStop(obj) {

		var option = obj.parent
		handleSushi=null;
		obj.x = 0
		obj.y = obj.originalY

		option.scale.setTo(1,1);
		var lineToCollide = option.lane
		for(var barIndex = 0; barIndex < barLanes.length; barIndex++){
			var bar = barLanes[barIndex]
			var collide = checkOverlap(bar, option)
			if(collide){
				lineToCollide = barIndex
			}
		}

		var toX = BAR_POSITIONS[lineToCollide];
		var sushiLane = sushisInGame[lineToCollide];
		var lastSushi

		if(sushiLane.length > 1){
			lastSushi = sushiLane[sushiLane.length-1]
		}

		var toY = option.y
		var refSushi;
		var cont =0 ;
		var prevSushi = null


		if(option.y<=300){
			option.y=300;
		}
		if (lastSushi){
			var sushiHeight = sushiLane[sushiLane.length - 2].y - sushiLane[sushiLane.length - 2].height+15 

			toY = sushiHeight

			if(toY <= 300){
				toY = 330
			}
		}else{
			toY = option.y
		}


		option.tween = game.add.tween(option).to({x: toX, y: option.y}, speed*30, Phaser.Easing.Cubic.In, true)
		var thisOption=option
		if(thisOption && option){
			for(var containerIndex = 0; containerIndex < thisOption.sushiList.length; containerIndex++){
				var container = thisOption.sushiList[containerIndex]
				container.inputEnabled = true
			}
			for(var checkPositions=0; checkPositions<sushisInGame[lineToCollide].length; checkPositions++){
				if(option.y<sushisInGame[lineToCollide][checkPositions].y){
					cont++;
				}else{
					break;
				}
				prevSushi = sushisInGame[lineToCollide][checkPositions]
				prevSushi.index = cont
			}

			thisOption.lane = lineToCollide
			thisOption.tween = null
			thisOption.index = cont
			sushisInGame[lineToCollide].splice(cont,0,option);
			sushisInGame[lineToCollide].delaySushi = 100
		}
		checkingFrame=0;
		sound.play("cut")
	}

	function moveGroupText(sushi) {
		var numText = sushi.operationText.num
		numText.text = sushi.num
		sushi.bringToTop(sushi.operationText)
		var toYOperation = -sushi.container.height * 0.15 * sushi.num

		if (numText.tween1)
			numText.tween1.stop()
		if (numText.tween2)
			numText.tween2.stop()

		numText.tween1 = game.add.tween(numText.scale).to({x:1.2, y:1.1}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)
		numText.tween2 = game.add.tween(sushi.operationText).to({y:toYOperation}, 300, Phaser.Easing.Cubic.Out, true)
	}

	function mergeSushis(sushi, prevSushi){
		sushi.container = null
		game.input.enabled = false
		sound.play("flip")
		var numNeeded = prevSushi.denom - prevSushi.num
		var difNumSushi = sushi.num - numNeeded < 0 ? sushi.num : numNeeded
		prevSushi.num += difNumSushi
		sushi.num -= difNumSushi
		var totalSushis = prevSushi.num + sushi.num
		
		for(var containerIndex = 0, num = sushi.sushiList.length; containerIndex < num; containerIndex++){
			var container = sushi.sushiList.shift()

			if(containerIndex < difNumSushi){
				var toY = -container.height * 0.4 * (totalSushis - 1 - (num - containerIndex - 1))
				var actualY = container.world.y - prevSushi.container.world.y -10
				container.y = actualY
				game.add.tween(container).to({y:toY}, 300, null, true).onComplete.add(function(obj){
					game.input.enabled = true
				});

				prevSushi.add(container)
				prevSushi.sushiList.push(container)
			}else{
				var toY = container.height * 0.5 * (difNumSushi - containerIndex) 
				game.add.tween(container).to({y:toY}, 300, null, true).onComplete.add(function(obj){
					game.input.enabled = true
				});
				if(!sushi.container)
					sushi.container = container
				gameGroup.bringToTop(sushi)
				sushi.sushiList.push(container)
			}
			container.originalY = toY
		}
		moveGroupText(prevSushi)
		
		if(tutorial && sushisInGame[1][0].sushiList[1]){
			sushisInGame[1][0].sushiList[0].input.enabled=false;
			sushisInGame[1][0].sushiList[1].input.enabled=false;
		}

		if(sushi.num <= 0) {
			sushisInGame[sushi.lane].splice(sushi.index, 1)
			pullGroup.add(sushi.bg)
			sushiList.bg.push(sushi.bg)
			sushi.destroy()
		}else{
			game.add.tween(sushi).to({y:prevSushi.y - prevSushi.height + prevSushi.container.height * 0.5}, 300, null, true)
			moveGroupText(sushi)
		}
		if(prevSushi.num === prevSushi.denom && !notMissing){
			isCompleting=true;
			sushisInGame[prevSushi.lane].merging = true
			checkingFrame=0;
			sushiCompleted(prevSushi)
		}
		
	}

	function tutorialLevel(){
		if(handleSushi!=null){
			hand.x=handleSushi.x+400;
			hand.y=handleSushi.y;
			handMoving=true;
			firstAnimation=game.add.tween(hand).to({x:sushisInGame[1][0].x+400,y:sushisInGame[1][0].y},2000,Phaser.Easing.Cubic.Linear,true).onComplete.add(function(){
				handMoving=false;
			});
		}else if(sushisInGame[0][0]!=null){
			hand.x=sushisInGame[0][0].x+400;
			hand.y=sushisInGame[0][0].y;
			handMoving=true;
			firstAnimation=game.add.tween(hand).to({x:sushisInGame[1][0].x+400,y:sushisInGame[1][0].y},2000,Phaser.Easing.Cubic.Linear,true).onComplete.add(function(){
				handMoving=false;
			});
		}else if(sushisInGame[2][0]!=null){
			handMoving=true;
			hand.x=sushisInGame[2][0].x+400;
			hand.y=sushisInGame[2][0].y;
			firstAnimation=game.add.tween(hand).to({x:sushisInGame[1][0].x+400,y:sushisInGame[1][0].y},2000,Phaser.Easing.Cubic.Linear,true).onComplete.add(function(){
				handMoving=false;
			});
		}else if(sushisInGame[1][1]!=null){
			handMoving=true;
			hand.x=sushisInGame[1][1].x+400;
			hand.y=sushisInGame[1][1].y;
			firstAnimation=game.add.tween(hand).to({x:sushisInGame[1][0].x+400,y:sushisInGame[1][0].y},2000,Phaser.Easing.Cubic.Linear,true).onComplete.add(function(){
				handMoving=false;	
			});
		}
	}

	function update() {

		if(gameEnded)
			return


			for(var lineIndex = 0; lineIndex < sushisInGame.length; lineIndex++) {
				var sushiLane = sushisInGame[lineIndex]
				var allBottom = true
				var lastSushi

				var totalNum = 0
				for (var sushiIndex = 0; sushiIndex < sushiLane.length; sushiIndex++) {
					var sushi = sushiLane[sushiIndex]
					sushi.inBottom = false
					sushi.index = sushiIndex
					var prevSushi = sushiLane[sushiIndex - 1] !== sushi ? sushiLane[sushiIndex - 1] : null
					if (prevSushi) {
						sushi.toY = prevSushi.y - prevSushi.height + 15
					}
					else
						sushi.toY = maxHeight

					if (sushi.y < sushi.toY) {
						sushi.y += speed
					}else{
						sushi.y=maxHeight
						if (sushiIndex > 0 && prevSushi)
							sushi.toY = prevSushi.y - prevSushi.height + 15
						else{


							sushi.toY = maxHeight

						}

						totalNum += sushi.num
						if(sushi.completed)
							totalNum = 0

						var notCompleted = ((prevSushi) && (!prevSushi.completed) && (!sushi.completed))
						if ((prevSushi) && (prevSushi.denom === sushi.denom) && (notCompleted)) {
							mergeSushis(sushi, prevSushi)
						}

						if((sushi.y >= maxHeight)||((prevSushi)&&(prevSushi.inBottom))){
							sushi.inBottom = true
						}
						sushi.y=sushi.toY;
						lastSushi = sushi
					}

					allBottom = allBottom && sushi.inBottom
				}
				if(sushiLane.delaySushi > 0)
					sushiLane.delaySushi -= speed

				if(checkingFrame==60 || (lastSushi && lastSushi.inBottom)){
					checkingFrame=0;
					if((allBottom)&&(lastSushi)&&(lastSushi.inBottom)&&(lastSushi.y <= 330)&&(!sushiLane.merging) && (!isCompleting) && (!creatingSushi) && sushisInGame[lineIndex].length>5){
						if(handleSushi!=null)handleSushi.inputEnabled=false;
						sushiAnimation(lineIndex)
						sound.play("wrong")
						notMissing=true;
						wrongParticle.x = lastSushi.centerX
						wrongParticle.y = lastSushi.centerY
						wrongParticle.start(true, 1000, null, 5)
						missPoint()
						octopus.setAnimation(["lose"]);
						gameEnded = true
						return
					}
				}else{
					addCheckingFrame();
				}
			}
		timeNextSushi += game.time.elapsedMS

		if((timeNextSushi >= timeBetween)&&(pointsBar.number > 0)){

			var arrayLane = new Array(0,1,2)
			arrayLane = Phaser.ArrayUtils.shuffle(arrayLane)

			for(var laneIndex = 0; laneIndex < arrayLane.length; laneIndex++){
				var chosenLane = arrayLane[laneIndex]
				if(sushisInGame[chosenLane].delaySushi <= 0) {
					var randomNum = game.rnd.integerInRange(0, SUSHIS.length - 1)
					addSushi(SUSHIS[randomNum], chosenLane)
					creatingSushi=true;
					game.time.events.add(100,function(){
						creatingSushi=false;
					});
					break
				}
			}
		}
		if(tutorial && !handMoving)tutorialLevel()
	}

	function addCheckingFrame(){
		checkingFrame++;
	}

	function destroySushi(lane){
		var moveLastSushi=sushisInGame[lane].length;

		for(var sushiIndex = 0; sushiIndex<sushisInGame[lane].length; sushiIndex++){
			var sushi = sushisInGame[lane][sushiIndex]
			sushi.destroy();
			sushisInGame[lane][sushiIndex].destroy();
			sushisInGame[lane].splice(0, 1)
		}

		gameEnded=false;
	}

	function createTutorial(){

		tutoGroup = game.add.group()
		sceneGroup.add(tutoGroup)
		tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
	}

	function createSpine(skeleton, skin, idleAnimation, x, y) {
		idleAnimation = idleAnimation || "idle"
		var spineGroup = game.add.group()
		x = x || 0
		y = y || 0

		var spineSkeleton = game.add.spine(0, 0, skeleton)
		spineSkeleton.x = x; spineSkeleton.y = y
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

	function updateRoll() {
		this.tilePosition.y += speed * 0.5
	}


	return {
		assets: assets,
		name: "sushi",
		update:function(event) {
			if(gameActive)
				update()
		},
		create: function(event){


			sceneGroup = game.add.group(); 
			handGroup = game.add.group();

			document.addEventListener("contextmenu", function(e){
				e.preventDefault();
			}, false);

			var bgRect = game.add.graphics()
			bgRect.beginFill(0x150426)
			bgRect.drawRect(0,0,game.world.width, game.world.height)
			bgRect.endFill()
			sceneGroup.add(bgRect)

			var floor = game.add.tileSprite(0 , 0, game.world.width, game.world.height - 240, "atlas.sushi", "swatch")
			floor.y = game.world.height+100
			floor.anchor.setTo(0, 1)
			sceneGroup.add(floor)

			var buildings = game.add.tileSprite(0 , 0, game.world.width, 275, "atlas.sushi", "buildingBg")
			buildings.y = 74
			buildings.anchor.setTo(0, 0)
			sceneGroup.add(buildings)

			var barTop = game.add.graphics()
			barTop.beginFill(0xFF4817)
			barTop.drawRect(0,0,game.world.width, 40)
			barTop.endFill()
			sceneGroup.add(barTop)

			var background = sceneGroup.create(game.world.centerX,game.world.centerY,"atlas.sushi",'fondo')
			background.y = background.height * 0.5 + 50
			background.anchor.setTo(0.5, 0.5)

			octopus = createSpine("octopus", "normal")
			octopus.x = game.world.centerX
			octopus.y = background.y + 110
			sceneGroup.add(octopus)

			var scenary = sceneGroup.create(game.world.centerX,game.world.centerY,"atlas.sushi",'scenary')
			scenary.y = scenary.height * 0.5 + 38
			scenary.anchor.setTo(0.5, 0.5)

			var lamp = game.add.tileSprite(0 , 0, game.world.width, 63, "atlas.sushi", "lamp")
			lamp.y = 40
			sceneGroup.add(lamp)

			//Coins
			coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin");
			coins.anchor.setTo(0.5);
			coins.scale.setTo(0.5);
			coins.animations.add('coin');
			coins.animations.play('coin', 24, true);
			coins.alpha=0;
			for(var fillDiferentSushi=0; fillDiferentSushi<Object.keys(SUSHI_DATA).length; fillDiferentSushi++){
				diferentSushi[fillDiferentSushi]="sushi"+(fillDiferentSushi+1)
			}

			var barsGroup = game.add.group()
			barsGroup.x = game.world.centerX
			barsGroup.y = game.world.height
			sceneGroup.add(barsGroup)
			barLanes = []
			for(var barIndex = 0; barIndex <3; barIndex++){

				var singleBar = game.add.group()
				singleBar.x = BAR_POSITIONS[barIndex]
				barsGroup.add(singleBar)

				var bar = game.add.graphics()
				bar.beginFill(0xD6C26D)
				bar.drawRect(0,0,107, game.world.height - 330)
				bar.endFill()

				var barSprite = game.add.sprite(0, 0, bar.generateTexture())
				bar.destroy()
				barSprite.anchor.setTo(0.5, 1)
				singleBar.add(barSprite)

				var rollTile = game.add.tileSprite(3, 0, 128, game.world.height - 330, "atlas.sushi", "roll")
				rollTile.anchor.setTo(0.5, 1)
				singleBar.add(rollTile)

				rollTile.update = updateRoll
				barLanes.push(singleBar)

			}
			hand=game.add.sprite(100,100, "hand")
			hand.anchor.setTo(0,0);
			hand.scale.setTo(0.7,0.7);
			hand.animations.add('hand');
			hand.animations.play('hand',2, false);
			hand.alpha=0;
			handGroup.add(hand);

			sushiSong = game.add.audio('dojoSong')

			game.sound.setDecodedCallback(sushiSong, function(){
				sushiSong.loopFull(0.6)
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
			createSpines()
			createGameObjects()

			createTutorial()

			correctParticle = createPart("star")
			sceneGroup.add(correctParticle)
			wrongParticle = createPart("wrong")
			sceneGroup.add(wrongParticle)

			buttons.getButton(sushiSong,sceneGroup)
		}
	}
}()