
var soundsPath = "../../shared/minigames/sounds/"
var paper = function(){

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
				name: "atlas.paper",
				json: "images/paper/atlas.json",
				image: "images/paper/atlas.png"
			}
		],
		images: [
			{
				name:"grid",
				file:"images/paper/grid.png"
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
				file: soundsPath + "wrong.mp3"},
			{	name: "right",
				file: soundsPath + "rightChoice.mp3"},
			{   name: "gameLose",
				file: soundsPath + "gameLose.mp3"}
		]
	}

	var NUM_LIFES = 3

	// var ROUNDS = [
	//     {continent: "america", flags: ["mexico", "usa"]},
	//     {continent: "america", numFlags: 4},
	//     {continent: "random", numFlags: 4}]

	var fragmentSrc = [

		"precision mediump float;",

		"uniform float     time;",
		"uniform vec2      resolution;",
		"uniform sampler2D iChannel0;",
		"uniform float offsetX;",

		"void main( void ) {",

		"vec2 uv = gl_FragCoord.xy / resolution.xy;",
		"uv.y *= -1.0;",
		"uv.x += offsetX;",
		"uv.y += (sin((uv.x + (time * 0.2)) * 5.0) * 0.003) + (sin((uv.x + (time * 0.2)) * 16.0) * 0.003) + 0.034;",
		"vec4 texColor = texture2D(iChannel0, uv);",
		"gl_FragColor = texColor;",

		"}"
	];

	var lives
	var sceneGroup = null
	var gameIndex = 33
	var tutoGroup
	var paperSong
	var heartsGroup = null
	var pullGroup = null
	var clock
	var timeValue
	var quantNumber
	var inputsEnabled
	var pointsBar
	var roundCounter
	var coordinates
	var shipList
	var pondGroup
	var filter
	var boardGroup
	var tokenList
	var tokensInGame
	var impactSheet
	var correctParticle
	var wrongParticle
	var shipsIngame
	var rock

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
		shipList = []
		tokenList = []
		tokensInGame = []
		shipsIngame = []

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

		var pointsImg = pointsBar.create(-10,10,'atlas.paper','xpcoins')
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
	
	function addShips(numShips) {
		var rndCoord = coordinates.slice()
		rndCoord = Phaser.ArrayUtils.shuffle(rndCoord)

		shipsIngame = []
		for(var shipIndex = 0; shipIndex < numShips; shipIndex++){
			var ship = shipList[shipIndex]
			var coordinate = rndCoord[shipIndex]
			pondGroup.add(ship)
			ship.x = coordinate.x
			ship.y = coordinate.y
			ship.index = coordinate.index
			shipsIngame.push(ship)
		}
	}
	
	function createGameObjects(){
		pullGroup = game.add.group()
		pullGroup.x = -game.world.centerX * 2
		pullGroup.y = -game.world.centerY * 2
		sceneGroup.add(pullGroup)
		pullGroup.alpha = 0

		impactSheet = game.add.sprite(1024, 1024, 'impact')
		impactSheet.animations.add('pound')
		impactSheet.anchor.setTo(0.5, 0.5)
		pullGroup.add(impactSheet)

		for(var shipIndex = 0; shipIndex < 20; shipIndex++){
			var ship = createSpine("ship", "side")
			// var ship = pullGroup.create(0, 0, "atlas.paper", "ship_side")
			// ship.anchor.setTo(0.5, 1)
			// ship.x = game.world.centerX
			// ship.y = game.world.centerY
			pullGroup.add(ship)
			ship.setAnimation(["SIDEIDLE"])
			shipList.push(ship)
		}

		for(var shipIndex = 0; shipIndex < 20; shipIndex++){
			var token = pullGroup.create(0, 0, "atlas.paper", "token")
			token.anchor.setTo(0.5, 0.5)
			tokenList.push(token)
		}

		rock = pullGroup.create(0, 0, "atlas.paper", "rock")
		rock.anchor.setTo(0.5, 0.5)

	}

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);

		particle.makeParticles('atlas.paper',key);
		particle.minParticleSpeed.setTo(-200, -50);
		particle.maxParticleSpeed.setTo(200, -100);
		particle.minParticleScale = 0.2;
		particle.maxParticleScale = 0.5;
		// particle.gravity = 150;
		// particle.angularDrag = 30;
		particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)

		return particle

	}

	function stopGame(win){

		//objectsGroup.timer.pause()
		//timer.pause()
		paperSong.stop()
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
		game.load.audio('paperSong', soundsPath + 'songs/wormwood.mp3');

		game.load.image('introscreen',"images/paper/introscreen.png")
		game.load.image('howTo',"images/paper/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/paper/play" + localization.getLanguage() + ".png")

		game.load.spine('background', "images/spine/background/skeleton.json")
		game.load.spine('ship', "images/spine/ships/boats.json")
		game.load.spritesheet('impact', 'images/paper/impact.png', 256, 256, 8)

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

	function startRound(notStarted) {
		addShips(3)
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
		var startX = -200
		var heartGroup = game.add.group()
		heartGroup.x = game.world.centerX
		heartGroup.y = game.world.height - 80
		heartGroup.y = game.world.height - 80
		sceneGroup.add(heartGroup)

		for(var heartIndex = 0; heartIndex < 3; heartIndex++){
			var heart = heartGroup.create(0, 0, "atlas.paper", "heart")
			heart.anchor.setTo(0.5, 0.5)
			heart.x = heartIndex * 200 + startX
		}
	}

	function onClickPlay(rect) {
		rect.inputEnabled = false
		sound.play("pop")
		game.add.tween(tutoGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
			tutoGroup.y = -game.world.height
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
			callBoard()
		})

		tutoGroup.add(rect)

		var plane = tutoGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
		plane.anchor.setTo(0.5,0.5)

		var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.paper','gametuto')
		tuto.anchor.setTo(0.5,0.5)

		var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)

		var inputName = 'movil'

		if(game.device.desktop){
			inputName = 'desktop'
		}

		//console.log(inputName)
		var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.paper',inputName)
		inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)

		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.paper','button')
		button.anchor.setTo(0.5,0.5)

		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
	}
	
	function waveUpdate() {
		this.tilePosition.x -= 0.2
	}

	function callBoard(){
		var tween1 = game.add.tween(boardGroup).to({y:game.world.centerY}, 1200, Phaser.Easing.Cubic.Out, true, 1200)
		var tween2 = game.add.tween(boardGroup.alphaRect).to({alpha:0.6}, 1200, Phaser.Easing.Cubic.Out, true, 1200)
		inputsEnabled = true
	}
	
	function sinkShip(ship) {
		ship.setAnimation(["SIDELOSE"])
		game.add.tween(ship.scale).to({x:0.3, y:0.3}, 400, Phaser.Easing.Cubic.In, true, 300)
		game.add.tween(ship).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true, 600)
	}
	
	function rockImpact() {
		pondGroup.add(impactSheet)
		impactSheet.x = rock.x
		impactSheet.y = rock.y
		impactSheet.animations.play('pound', 18, false)

		var isCorrect = false
		var shipToSink
		for(var shipIndex = 0; shipIndex < shipsIngame.length; shipIndex++){
			var ship = shipsIngame[shipIndex]
			var shipCollide = ship.index === rock.index
			if (shipCollide){
				isCorrect = true
				shipToSink = ship
				break
			}
		}

		if(isCorrect){
			correctParticle.x = rock.world.x
			correctParticle.y = rock.world.y
			correctParticle.start(true, 1000, null, 8)
			sinkShip(shipToSink)
		}
		else{
			wrongParticle.x = rock.world.x
			wrongParticle.y = rock.world.y
			wrongParticle.start(true, 1000, null, 8)
		}

		pullGroup.add(rock)
	}
	
	function startRockFalling(token) {
		var coordinate = coordinates[token.cordIndex]
		rock.x = coordinate.x
		rock.y = coordinate.y
		rock.alpha = 0
		rock.scale.x = 1
		rock.scale.y = 1
		pondGroup.add(rock)
		rock.index = token.cordIndex

		game.add.tween(rock.scale).to({x:0.4, y:0.4}, 700, Phaser.Easing.Cubic.Out, true)
		game.add.tween(rock).to({alpha:1}, 200, Phaser.Easing.Cubic.Out, true)
		game.time.events.add(700, rockImpact, null)
	}
	
	function startShoots() {
		for(var tokenIndex = 0; tokenIndex < tokensInGame.length; tokenIndex++){
			var token = tokensInGame[tokenIndex]

			game.time.events.add(800 * tokenIndex, startRockFalling, null, token)
		}
	}

	function hideBoard(btn){
		btn.inputEnabled = false
		game.add.tween(btn.scale).to({x:1.2, y:1.1}, 150, Phaser.Easing.Cubic.Out, true).yoyo(true)
		var hide = game.add.tween(boardGroup).to({y:-game.world.height * 0.5}, 1200, Phaser.Easing.Cubic.Out, true, 300)
		game.add.tween(boardGroup.alphaRect).to({alpha:0}, 1200, Phaser.Easing.Cubic.Out, true, 600)
		hide.onComplete.add(startShoots)
	}
	
	function returnToken(token) {
		tokensInGame.splice(token.index, 1)
		tokenList.push(token)
		pullGroup.add(token)
	}
	
	function pinchOnMap(circle) {
		if(inputsEnabled){
			if(!circle.token){
				var token = tokenList.pop()
				token.x = circle.x
				token.y = circle.y
				token.scale.x = 0.4; token.scale.y = 0.4
				token.alpha = 0
				token.cordIndex = circle.index
				boardGroup.add(token)
				token.index = tokensInGame.length
				tokensInGame.push(token)
				circle.token = token
				game.add.tween(token.scale).to({x:1, y:1}, 400, Phaser.Easing.Back.Out, true)
				game.add.tween(token).to({alpha:1}, 200, Phaser.Easing.Cubic.Out, true)
			}else{
				game.add.tween(circle.token.scale).to({x:0.4, y:0.4}, 200, Phaser.Easing.Back.Out, true)
				var dissapear = game.add.tween(circle.token).to({alpha:0}, 200, Phaser.Easing.Cubic.Out, true)
				circle.token = null
				dissapear.onComplete.add(returnToken)
			}
		}
	}
	
	function createBoard() {

		var alphaRect = game.add.graphics()
		alphaRect.beginFill(0x000000)
		alphaRect.drawRect(-2,-2, game.world.width + 2, game.world.height + 2)
		alphaRect.alpha = 0
		sceneGroup.add(alphaRect)

		boardGroup = game.add.group()
		boardGroup.x = game.world.centerX
		boardGroup.y = -game.world.height * 0.5
		sceneGroup.add(boardGroup)

		var board = boardGroup.create(0,0,"atlas.paper","board")
		board.y = -64
		board.anchor.setTo(0.5, 0.5)
		boardGroup.alphaRect = alphaRect

		var button = boardGroup.create(0, 0, "atlas.paper", "okbutton")
		button.anchor.setTo(0.5, 0.5)
		button.y = 400

		button.inputEnabled = true
		button.events.onInputDown.add(hideBoard)

		var startX = -15
		var startY = -270
		for (var circleIndex = 0; circleIndex < 28; circleIndex++) {
			var xIndex = ((circleIndex + 1) % 4) - 1
			var yIndex = Math.ceil((circleIndex + 1) / 4) - 1
			var x = startX + 68.8 * xIndex
			var y = startY + 68.8 * yIndex

			var circle = game.add.graphics()
			circle.beginFill(0xffffff)
			circle.drawCircle(0,0, 25)
			circle.endFill()
			circle.x = x
			circle.y = y
			boardGroup.add(circle)
			circle.index = circleIndex

			circle.inputEnabled = true
			circle.events.onInputDown.add(pinchOnMap)
		}
	}
	
	function createPondPoints(){

		pondGroup = game.add.group()
		pondGroup.x = game.world.centerX
		pondGroup.y = game.world.centerY - 65
		sceneGroup.add(pondGroup)

		var insidePond = game.add.group()
		pondGroup.add(insidePond)

		var pond = pondGroup.create(0, 0, "atlas.paper", "pond")
		pond.anchor.setTo(0.5, 0.5)

		var waterRect = game.add.graphics()
		waterRect.beginFill(0x06FCE3)
		waterRect.drawRect(0,0, 600, 900)
		waterRect.endFill()
		// waterRect.x = -waterRect.width * 0.5
		// waterRect.y = -waterRect.height * 0.5

		var water = game.add.sprite(0,0, waterRect.generateTexture())
		water.anchor.setTo(0.5, 0.5)
		insidePond.add(water)
		waterRect.destroy()

		var grid = insidePond.create(0, 0, "grid")
		grid.anchor.setTo(0.5, 0.5)

		var wave = game.add.tileSprite(0 , 0, 500, 800, "atlas.paper", "wave")
		wave.alpha = 0.2
		wave.anchor.setTo(0.5, 0.5)
		insidePond.add(wave)
		wave.update = waveUpdate

		var mask = game.add.graphics(0,0)
		mask.beginFill(0xFFFFFF)
		mask.drawRoundedRect(0, 0, 468, 750, 80)
		mask.endFill()
		mask.x = game.world.centerX - 468 * 0.5
		mask.y = game.world.centerY - 65 - 750 * 0.5

		insidePond.mask = mask
		// var offSetValue = (game.world.width - 512) / 512

		// var customUniforms = {
		// 	iChannel0: { type: 'sampler2D', value: grid.texture, textureData: { repeat: true } },
		// 	offsetX: { type: '1f', value: offSetValue }
		// };

		// filter = new Phaser.Filter(game, customUniforms, fragmentSrc);
		// filter.setResolution(512, 1024)

		// grid.filters = [ filter ];

		var startX = -46
		var startY = -258
		coordinates = []
		for (var circleIndex = 0; circleIndex < 28; circleIndex++) {
			var xIndex = ((circleIndex + 1) % 4) - 1
			var yIndex = Math.ceil((circleIndex + 1) / 4) - 1
			var x = startX + 86 * xIndex
			var y = startY + 86 * yIndex
			coordinates.push({x:x, y:y, index:circleIndex})
		}
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

	return {
		assets: assets,
		name: "paper",
		preload:preload,
		update:function () {
			// filter.update()
		},
		create: function(event){

			sceneGroup = game.add.group()
			// yogomeGames.mixpanelCall("enterGame",gameIndex)

			var background = game.add.graphics()
			background.beginFill(0x7df431)
			background.drawRect(0, 0, game.world.width + 2, game.world.height + 2)
			background.endFill()
			sceneGroup.add(background)

			createPondPoints()

			paperSong = game.add.audio('paperSong')
			game.sound.setDecodedCallback(paperSong, function(){
				paperSong.loopFull(0.6)
			}, this);

			game.onPause.add(function(){
				game.sound.mute = true
			} , this);

			game.onResume.add(function(){
				game.sound.mute = false
			}, this);

			initialize()

			createHearts()
			createBoard()
			createPointsBar()
			createGameObjects()

			var shadowSpine1 = createSpine("background", "top")
			shadowSpine1.x = game.world.width
			shadowSpine1.y = 0
			sceneGroup.add(shadowSpine1)
			shadowSpine1.setAnimation(["top"])

			var shadowSpine2 = createSpine("background", "low")
			shadowSpine2.x = 0
			shadowSpine2.y = game.world.height
			sceneGroup.add(shadowSpine2)
			shadowSpine2.setAnimation(["low"])

			startRound(true)
			createTutorial()

			correctParticle = createPart("star")
			sceneGroup.add(correctParticle)
			wrongParticle = createPart("wrong")
			sceneGroup.add(wrongParticle)

			buttons.getButton(paperSong,sceneGroup)
		}
	}
}()