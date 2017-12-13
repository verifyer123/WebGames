
var soundsPath = "../../shared/minigames/sounds/"
var battle = function(){
	var server = parent.server || null
	var serverData = server ? server.currentData : {
		p1:{nickname:"Player1aa", avatar:"eagle"},
		p2:{nickname:"Player2", avatar:"arthurius"}
	}

    var localizationData = {
        "EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"question":"Question ",
			"winner":"WINNER"
        },

        "ES":{
            "moves":"Movimientos extra",
            "howTo":"�C�mo jugar?",
			"question":"Pregunta ",
			"winner":"GANADOR"
        }
    }


    var assets = {
        atlases: [
            {
                name: "atlas.battle",
                json: "images/battle/atlas.json",
                image: "images/battle/atlas.png"
            },
			{
				name: "atlas.cards",
				json: "images/cards/atlas.json",
				image: "images/cards/atlas.png"
			}
        ],
        images: [
			{
				name: "container",
				file: "images/battle/container.png"},
        ],
        sounds: [
            {	name: "pop",
                file: soundsPath + "pop.mp3"},
            {	name: "magic",
                file: soundsPath + "magic.mp3"},
            {	name: "throw",
                file: soundsPath + "throw.mp3"},
            {	name: "cut",
                file: soundsPath + "cut.mp3"},
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
            {   name: "hit",
                file: soundsPath + "towercollapse.mp3"},
            {   name: "whoosh",
                file: soundsPath + "whoosh.mp3"},
            {   name: "uuh",
                file: soundsPath + "uuh.mp3"},
            {   name: "fart",
                file: soundsPath + "splash.mp3"},
            {   name: "explosion",
                file: soundsPath + "fireExplosion.mp3"},
            {   name: "winBattle",
                file: soundsPath + "winBattle1.mp3"},
            {   name: "swordSmash",
                file: soundsPath + "swordSmash.mp3"},
			{   name: "comboSound",
                file: soundsPath + "mathTournament/comboSound.mp3"},
			{   name: "fireCharge",
                file: soundsPath + "mathTournament/fireCharge2.mp3"},
			{   name: "fireExplosion",
				file: soundsPath + "mathTournament/fireExplosion2.mp3"},
			{   name: "fireProjectile",
				file: soundsPath + "mathTournament/fireProjectile1.mp3"},
			{   name: "fireReveal",
				file: soundsPath + "mathTournament/fireReveal1.mp3"},
			{	name:"epicTapTouchGames",
				file:"sounds/battle/TapWhoosh.mp3"},
			{	name:"epicAttackButton",
				file:"sounds/battle/buttonTick.mp3"},
			{	name:"loseBattle",
				file:"sounds/battle/loseBattle1.mp3"},
			{	name:"starsCollision",
				file:"sounds/battle/starsCollision1.mp3"},
			{	name:"barLoad",
				file:"sounds/battle/barLoad1.mp3"},
			{	name:"levelBar",
				file:"sounds/battle/levelBar1.wav"},
			{	name:"levelUp",
				file:"sounds/battle/levelUp2.mp3"}
        ],
		spines: [
			// {
			// 	name:"yogotarEagle",
			// 	file:"images/spines/Eagle/eagle.json"
			// },
			// {
			// 	name:"yogotarEagle",
			// 	file:"images/spines/Eagle/eagle.json"
			// }
		],
		jsons: [
			{
				name:"sounds",
				file:"data/sounds/general.json"
			}
		]
    }

    var NUM_LIFES = 3
    var NUM_OPTIONS = 3
    var MAX_HP = 100
	var WIDTH_DISTANCE = 110
	var HP_BAR_WIDTH = 195
	var DATA_CHAR_PATH = "data/characters/"
	var ELEMENT_MULTIPLIERS = {
		"fire": {
			"water": 0.5,
			"earth": 2,
		},
		"water": {
			"fire": 2,
			"wind": 0.5,
		},
		"wind": {
			"water": 2,
			"earth": 0.5,
		},
		"earth": {
			"fire": 0.5,
			"wind": 2,
		}
	}
	var ATTACK = {
		"attack":{
			"base":10,
			"bonus":15
		},
		"special":{
			"base":15,
			"bonus":20
		}
	}

	var XP_TABLE = {
		HITS : {
			NORMAL : {
				PERFECT : 5,
				GOOD : 4,
				WEAK : 3,
			},
			SPECIAL : {
				PERFECT : 6,
				GOOD : 5,
				WEAK : 4,
			},
		},
		KILL : 10,
		DEATH : 2,
	}

	var POWER_LEVELS = {
		LOW:{
			color:0xFF0000,
			width:60
		},
		MED:{
			color:0xFFEB00,
			width:120
		},
		HIGH:{
			color:0x00F500,
			width:176
		}
	}

	var ELEMENTS = ["fire", "water", "wind", "earth"]

	var NUM_BACKGROUNDS = 3

    var lives
    var sceneGroup = null
    // var gameIndex = 58
    var tutoGroup
    var battleSong
    var pullGroup = null
    var timeValue
    var inputsEnabled
    var monsterCounter
    var players
    var killedMonsters
	var alphaMask
	var ready, go
	var hudGroup
	var frontGroup
	var controlGroup
	var tapGroup
	var soundsList
	var sumXp
	var elements
	var charactersCards
	var currentPlayer
	var model

    function loadSounds(){

		// console.log(assets.sounds)
		sound.decode(assets.sounds)
    }

    function getSoundsSpine(spine) {
		var events = spine.skeletonData.events
		// console.log(events, spine)
		var soundsAdded = {}

		for(var index = 0; index < events.length; index++){
			var event = events[index]
			var functionData = getFunctionData(event.name)

			if((functionData)&&(functionData.name === "PLAY")){
				var soundObj = {
					name:functionData.param,
					file:soundsList[functionData.param]
				}
				if(!soundsAdded[soundObj.name]){
					assets.sounds.push(soundObj)
					game.load.audio(soundObj.name, soundObj.file);
					soundsAdded[soundObj.name] = soundObj.name
				}
			}
		}
	}

    function initialize(){
        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        lives = NUM_LIFES
        timeValue = 60
        monsterCounter = 0
        killedMonsters = 0
		sumXp = 0

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true);
        var preloadAlpha = document.getElementById("preloadBattle");
        preloadAlpha.style.visibility = "hidden";
        inputsEnabled = false
		elements = {}
		model = parent.epicModel || epicModel
		currentPlayer = model.getPlayer()

        loadSounds()

    }

    function tweenTint(obj, startColor, endColor, time, delay, callback) {
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
                obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step)
            })
            // set object to the starting colour
            obj.tint = startColor;
            // if you passed a callback, add it to the tween on complete
            if (callback) {
                colorTween.onComplete.add(callback, this);
            }
            // finally, start the tween
            colorTween.start();
        }
    }

	function showResults(win) {
		var resultsGroup = win ? hudGroup.winGroup : hudGroup.loseGroup
		if(win){players[0].setAnimation(["WIN", "WINSTILL"], true)}

		game.time.events.add(500, function(){
			battleSong.stop()
			if(win){
				var battleIndex = parent.env ? (parent.env.battleIndex || 0) : 0
				var cardOwned = currentPlayer.battles[battleIndex][0].captured
				sound.play("winBattle");
				hudGroup.sumLvl(cardOwned)
				createConfeti()

				players[0].card.xp += sumXp
			}
			else{sound.play("loseBattle")}
			resultsGroup.y = 0

			game.add.tween(players[0].hpBar).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true)
			game.add.tween(players[1].hpBar).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true)

			game.add.tween(hudGroup.uiGroup).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)
			game.add.tween(resultsGroup).to({alpha:1}, 800, Phaser.Easing.Cubic.Out, true)
			game.add.tween(alphaMask).to({alpha:0.7}, 800, Phaser.Easing.Cubic.Out, true)
			inputsEnabled = true

		// var toCamaraX = player.x < game.world.centerX ? 0 : game.world.width
		// game.camera.follow(player)
			zoomCamera(1.5, 2000)
			var head = players[0].getSlotContainer("particle1")
			var followResults = game.add.graphics()
			followResults.beginFill(0x000000)
			followResults.drawCircle(0,0,100)
			followResults.endFill()
			followResults.alpha = 0
			followResults.x = win ? players[0].x : head.worldPosition.x
			followResults.y = win ? players[0].y - 160 : players[0].y
			sceneGroup.add(followResults)

			// var torso = players[0].getSlotContainer("torso1")
			// var toX = !win ? head.worldPosition.x - game.world.centerX * 0.5 : players[0].x //- 200 + 40//200 is the left bounds limit
			// var toY = -500
			// game.add.tween(game.camera).to({x:toX, y:toY}, 2000, Phaser.Easing.Cubic.Out, true)
			game.camera.follow(followResults)
		})
		
		// game.camera.follow(head)
	}

    function receiveAttack(target, from) {
		// target.hpBar.removeHealth(20)
		sound.play(from.projectileData.impact.soundID)

		target.statusAnimation = target.hpBar.health <= 20 ? "TIRED" : "IDLE"
		target.setAnimation(["HIT", target.statusAnimation], true)
		// console.log(target.spine.state)
		target.add(from.hit)
		from.hit.start(true, 1000, null, 5)
    }

    function returnCamera() {
		game.camera.follow(null)
    	game.add.tween(game.camera).to({x:0, y:0}, 1000, Phaser.Easing.Cubic.Out, true)
		zoomCamera(1, 1000)
		// game.add.tween(player1.hpBar.scale).to({x:0.8, y:0.8}, 2000, Phaser.Easing.Cubic.Out, true)
		game.add.tween(alphaMask).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true)
	}

	function zoomCamera(zoom, delay) {
		var scaleTween = game.add.tween(game.camera.scale).to({x:zoom, y:zoom}, delay, Phaser.Easing.Cubic.Out, true)
		var toScale1 = 1/zoom
		// game.add.tween(player1.hpBar.scale).to({x:toScale1, y:toScale1}, delay, Phaser.Easing.Cubic.Out, true)
		// game.add.tween(player2.hpBar.scale).to({x:toScale2, y:toScale1}, delay, Phaser.Easing.Cubic.Out, true)
		var actualScale = hudGroup.scale.x
		scaleTween.onUpdateCallback(function () {
			if(toScale1 < actualScale) {
				hudGroup.scale.x = Phaser.Math.clamp(1 / game.camera.scale.x, toScale1, actualScale)
				hudGroup.scale.y = Phaser.Math.clamp(1 / game.camera.scale.y, toScale1, actualScale)
				frontGroup.scale.x = Phaser.Math.clamp(1 / game.camera.scale.x, toScale1, actualScale)
				frontGroup.scale.y = Phaser.Math.clamp(1 / game.camera.scale.y, toScale1, actualScale)

			}else{
				hudGroup.scale.x = Phaser.Math.clamp(1/ game.camera.scale.x, actualScale, toScale1)
				hudGroup.scale.y = Phaser.Math.clamp(1/ game.camera.scale.y, actualScale, toScale1)
				frontGroup.scale.x = Phaser.Math.clamp(1/ game.camera.scale.x, actualScale, toScale1)
				frontGroup.scale.y = Phaser.Math.clamp(1/ game.camera.scale.y, actualScale, toScale1)
			}
		})
	}
	
	function proyectileUpdate(tween, percentage) {
    	var proyectile = sceneGroup.proyectile
		// var angle = Phaser.Math.angleBetweenPoints(proyectile.worldPosition, proyectile.previousPosition)
		// proyectile.rotation = -4.71239 + angle
		// console.log(angle)
		var zoom = (2 - proyectile.scale.y) * 1.5
		game.camera.scale.x = zoom; game.camera.scale.y = zoom
		var toScale1 = 1/zoom
		var actualScale = hudGroup.scale.x
		if(toScale1 < actualScale) {
			hudGroup.scale.x = Phaser.Math.clamp(1 / game.camera.scale.x, toScale1, actualScale)
			hudGroup.scale.y = Phaser.Math.clamp(1 / game.camera.scale.y, toScale1, actualScale)
			frontGroup.scale.x = Phaser.Math.clamp(1 / game.camera.scale.x, toScale1, actualScale)
			frontGroup.scale.y = Phaser.Math.clamp(1 / game.camera.scale.y, toScale1, actualScale)

		}else{
			hudGroup.scale.x = Phaser.Math.clamp(1/ game.camera.scale.x, actualScale, toScale1)
			hudGroup.scale.y = Phaser.Math.clamp(1/ game.camera.scale.y, actualScale, toScale1)
			frontGroup.scale.x = Phaser.Math.clamp(1/ game.camera.scale.x, actualScale, toScale1)
			frontGroup.scale.y = Phaser.Math.clamp(1/ game.camera.scale.y, actualScale, toScale1)
		}

	}
	
	function getMultiplier(elementFrom, elementTarget) {
    	return ELEMENT_MULTIPLIERS[elementFrom] && ELEMENT_MULTIPLIERS[elementFrom][elementTarget] || 1
	}

	function playerAttack(fromPlayer, targetPlayer, typeAttack, asset){
		// console.log(fromPlayer.multiplier)
    	var timeAttack = fromPlayer.numPlayer === 1 ? 2000 : 1000

    	game.add.tween(fromPlayer.hpBar).to({alpha:0}, 400, Phaser.Easing.Cubic.Out, true)
		game.add.tween(targetPlayer.hpBar).to({alpha:0}, 400, Phaser.Easing.Cubic.Out, true)

    	fromPlayer.setAnimation(["CHARGE"], false)
		fromPlayer.spine.speed = 0.5
		fromPlayer.proyectile.startPower.alpha = 1
		fromPlayer.proyectile.startPower.animations.play('start', fromPlayer.proyectile.startPower.fps, false)
		game.camera.follow(fromPlayer.proyectile.followObj)
		fromPlayer.proyectile.followObj.x = -110 * fromPlayer.scale.x
		fromPlayer.proyectile.followObj.y = -160 * fromPlayer.scale.x
		// game.add.tween(fromPlayer.proyectile.followObj).to({x:0}, 2000, Phaser.Easing.Cubic.In, true)

		var fromScale = fromPlayer.numPlayer === 1 ? 1 : 0.6
		// console.log("fromScale", fromScale)
		zoomCamera((2 - fromScale) * 1.5, 4000)
		game.add.tween(alphaMask).to({alpha:0.7}, 1000, Phaser.Easing.Cubic.Out, true)
		var toAngle
		if(fromPlayer.scaleReference > 0)
			toAngle = Phaser.Math.angleBetweenPoints(new Phaser.Point(fromPlayer.proyectile.centerX, fromPlayer.proyectile.centerY), new Phaser.Point(targetPlayer.hitDestination.x, targetPlayer.hitDestination.y - 150))
		else
			toAngle = Phaser.Math.angleBetweenPoints(new Phaser.Point(targetPlayer.hitDestination.x, 150), new Phaser.Point(fromPlayer.proyectile.centerX, fromPlayer.proyectile.centerY))
		// console.log(toAngle)
		toAngle = -1.5708 * fromPlayer.scaleReference + toAngle
		// console.log(toAngle)
		fromPlayer.proyectile.scale.x = fromScale; fromPlayer.proyectile.scale.y = fromScale
		game.add.tween(fromPlayer.proyectile.startPower).to({rotation:toAngle}, 2000, Phaser.Easing.Cubic.Out, true, 1000)
		game.add.tween(fromPlayer.proyectile.idlePower).to({rotation:toAngle}, 2000, Phaser.Easing.Cubic.Out, true, 1000)

		tapGroup.attackCallBack = function (percentage) {
			percentage = percentage || 0
			fromPlayer.spine.speed = 1
			var targetX = targetPlayer.x < game.world.centerX ? 0 : game.world.width
			fromPlayer.setAnimation(["ATTACK", "IDLE"], true)
			// game.add.tween(game.camera.scale).to({x:1.7, y:1.7}, 300, Phaser.Easing.Cubic.Out, true)
			// moveCamera.onComplete.add(returnCamera)

			var proyectile = fromPlayer.proyectile
			sceneGroup.bringToTop(proyectile)
			// game.camera.follow(proyectile, null, 0.1, 0.1)
			game.camera.x = 0
			game.camera.y = 0
			// var proyectile = sceneGroup.create(0, 0, 'atlas.battle', asset)
			// proyectile.x = fromPlayer.from.x
			// proyectile.y = fromPlayer.from.y
			// proyectile.scale.x = fromPlayer.scaleShoot.from.x
			// proyectile.scale.y = fromPlayer.scaleShoot.from.y
			// proyectile.anchor.setTo(0.5, 0.5)
			// proyectile.tint = fromPlayer.proyectile
			sceneGroup.proyectile = proyectile
			// proyectile.originalRotation = Phaser.Math.angleBetweenPoints(proyectile.previousPosition, proyectile.world)
			game.time.events.add(500, function () {
				typeAttack(proyectile, fromPlayer, targetPlayer, percentage)
			})
		}

		if(fromPlayer.numPlayer === 1) {
			console.log("start")
			tapGroup.start()
		}
		else {
			var percentage = game.rnd.integerInRange(0, 10) * 0.1
			game.time.events.add(2000, tapGroup.attackCallBack, null, percentage)
		}
	}

    function defeatPlayer(player) {
		// player.setAnimation(["HIT", player.statusAnimation])
		// game.add.tween(player.hpBar).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true)

        game.time.events.add(400, function () {
			player.setAnimation(["LOSE", "LOSESTILL"], true)
			// var dissapear = game.add.tween(player).to({alpha: 0}, 800, Phaser.Easing.Cubic.Out, true)
			// dissapear.onComplete.add(stopGame)
			// stopGame()
		})
    }

	function blowAttack(proyectile, from, target){
		sound.play("swordSmash")

		// var toScale = target.scaleShoot
		game.add.tween(proyectile.scale).to({x: toScale.to.x, y: toScale.to.y}, 1200, null, true)

		var toHit = target.hitDestination
		game.add.tween(proyectile).to({x: toHit.x, y: toHit.y}, 1200, null, true).onComplete.add(function () {
			game.add.tween(proyectile).to({alpha: 0}, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(function () {
				proyectile.alpha = 0
				proyectile.x = from.from.x
				proyectile.y = from.from.y
			})
			receiveAttack(target, from)
		})

	}

	function createTapGame(){
		var GRADIENT_WIDTH = 457
		var TIMEBAR_WIDTH = 180

		tapGroup = game.add.group()
		tapGroup.x = game.world.centerX;
		tapGroup.y = 230
		hudGroup.add(tapGroup)
		tapGroup.alpha = 0

		var gradientGroup = game.add.group()
		gradientGroup.scale.setTo(0.8, 0.8)
		tapGroup.add(gradientGroup)

		var gradient = game.add.tileSprite(-GRADIENT_WIDTH * 0.5, 5, 457, 103, "atlas.battle", "gradient")
		gradient.anchor.setTo(0, 0.5)
		gradient.width = 0
		gradientGroup.add(gradient)
		var counter = gradientGroup.create(0, 0, "atlas.battle", "counter")
		counter.anchor.setTo(0.5, 0.5)

		var tapArea = game.add.graphics()
		tapArea.beginFill(0x000000)
		tapArea.drawRect(-2, -2, game.world.width + 2, game.world.height + 2)
		tapArea.x = -game.world.width * 0.5 + 1; tapArea.y = -tapGroup.y + 1
		tapArea.endFill()
		tapArea.alpha = 0
		tapGroup.add(tapArea)

		var tapSpine = createSpine("tap", "normal", "TAP")
		// tapSpine.setAnimation(["tap"],true)
		tapSpine.y = - 120
		tapSpine.scale.setTo(0.5, 0.5)
		tapGroup.add(tapSpine)

		var timerBar = game.add.graphics()
		timerBar.beginFill(0xFF4004)
		timerBar.drawRect(0, 0, TIMEBAR_WIDTH, 10)
		timerBar.y = -56
		timerBar.endFill()
		tapGroup.add(timerBar)

		var fontStyle = {font: "70px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var attackText = game.add.text(game.world.centerX, 70, "PERFECT", fontStyle)
		attackText.anchor.setTo(0.5, 0.5)
		hudGroup.add(attackText)
		attackText.strokeThickness = 5
		attackText.stroke = "#000000"
		attackText.scale.setTo(0.8, 0.8)
		attackText.alpha = 0

		tapArea.events.onInputDown.add(function () {
			if(gradient.width < GRADIENT_WIDTH){
				var value = gradient.width / GRADIENT_WIDTH
				console.log("inputOn")
				sound.play("epicTapTouchGames", {pitch: 1 + (value * 0.25)})
				gradient.width = Phaser.Math.clamp(gradient.width + 30, 0, GRADIENT_WIDTH)
			}
		})

		function endTapAttack() {
			console.log("endTapAttack")
			var percentageWidth = gradient.width / GRADIENT_WIDTH
			var textString = percentageWidth < 0.5 ? "WEAK" : percentageWidth < 0.8 ? "GOOD" : "PERFECT"

			attackText.text = textString
			if(tapGroup.attackCallBack){tapGroup.attackCallBack(percentageWidth)}
			tapArea.inputEnabled = false
			game.add.tween(tapGroup).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true)
			var textTween = game.add.tween(attackText).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true)
			game.add.tween(attackText.scale).to({x:1, y:1}, 150, Phaser.Easing.Cubic.Out, true).yoyo(true)
			var textTween2 = game.add.tween(attackText).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, false, 1000)
			textTween.chain(textTween2)
		}

		tapGroup.update = function () {
			if(tapArea.inputEnabled){
				// gradient.width = Phaser.Math.clamp(gradient.width - 1, 0, GRADIENT_WIDTH)
				timerBar.width = Phaser.Math.clamp(timerBar.width - 1, 0, TIMEBAR_WIDTH)
				if(gradient.width >= GRADIENT_WIDTH - 10){
					endTapAttack()
				}else if(timerBar.width === 0){
					endTapAttack()
				}
			}
		}

		tapGroup.start = function () {
			tapArea.inputEnabled = true
			game.add.tween(tapGroup).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true)
			gradient.width = 0
			timerBar.width = TIMEBAR_WIDTH
		}

	}
	
	function createCaptured() {
		var captureGroup = game.add.group()
		captureGroup.x = game.world.centerX
		captureGroup.y = game.world.centerY + 80
		hudGroup.captureGroup = captureGroup
		hudGroup.add(captureGroup)

		var container = captureGroup.create(0,0,"container")
		container.anchor.setTo(0.5, 0.5)

		//TODO change to compatible multiple cards
		var card = charactersEntity.getCard(players[1].card)
		// card.scale.setTo(0.8, 0.8)
		captureGroup.add(card)

		var fontStyle = {font: "78px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var capturedText = game.add.text(0, -200, "Captured", fontStyle)
		capturedText.stroke = '#2a2a2a';
		capturedText.strokeThickness = 12;
		capturedText.anchor.setTo(0.5, 0.5)
		capturedText.setShadow(6, 6, 'rgba(0,0,0,0.5)', 0);
		captureGroup.add(capturedText)

		captureGroup.alpha = 0
	}
	
	function showCaptured() {
		var captureGroup = hudGroup.captureGroup
		var captureTween = game.add.tween(captureGroup).to({alpha:1}, 800, Phaser.Easing.Quintic.In, true)
		game.add.tween(captureGroup.scale).from({x:1.5, y:1.5}, 800, Phaser.Easing.Quintic.In, true)
		captureTween.onComplete.add(function () {
			sound.play("comboSound")
			game.time.events.add(500, showExit)
		})
		var battleIndex = parent.env ? (parent.env.battleIndex || 0) : 0
		var cardOwned = currentPlayer.battles[battleIndex][0].captured
		currentPlayer.cards.push(players[1].card)
	}

    function createProyectile(proyectile, from, target, percentage){

		var toScale = target.numPlayer === 1 ? 1 : 0.6

		var toHit = target.hitDestination
		game.add.tween(proyectile.followObj).to({y:0}, 1600, null, true)
		var moveProyectile = game.add.tween(proyectile).to({x: toHit.x}, 1600, null, true)
		moveProyectile.onUpdateCallback(proyectileUpdate)
        game.add.tween(proyectile.scale).to({x: toScale, y: toScale}, 1600, null, true)

        var first = game.add.tween(proyectile).to({y: 150}, 800, Phaser.Easing.Cubic.Out, true)
        first.onComplete.add(function () {
            game.add.tween(proyectile).to({y: toHit.y}, 800, Phaser.Easing.Cubic.In, true).onComplete.add(function () {
                game.add.tween(proyectile.idlePower).to({alpha: 0}, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(function () {
                    // proyectile.destroy()
					returnCamera()
					proyectile.startPower.alpha = 0
					proyectile.idlePower.alpha = 0
					proyectile.x = from.from.x
					proyectile.y = from.from.y
					sceneGroup.proyectile = null
					proyectile.startPower.rotation = 0
					proyectile.idlePower.rotation = 0
					game.add.tween(players[0].hpBar).to({alpha:1}, 500, Phaser.Easing.Cubic.Out, true)
					game.add.tween(players[1].hpBar).to({alpha:1}, 500, Phaser.Easing.Cubic.Out, true)

					//TODO add experience character if player id is 1
					if(from.numPlayer === 1){
						var index = percentage < 0.5 ? "WEAK" : percentage < 0.8 ? "GOOD" : "PERFECT"
						sumXp += XP_TABLE.HITS.NORMAL[index]
					}

					game.time.events.add(500, function () {
						var combinedDamage = 10 + (15 * percentage)
						//TODO: check if level is multiplier
						combinedDamage = Math.floor(combinedDamage * from.multiplier) * from.level
						target.hpBar.updateHealth(-combinedDamage)
						addNumberPart(target, -combinedDamage, "#FF0000", -100)

						if(target.hpBar.health > 0)
							if(target.numPlayer === 1)
								game.time.events.add(1000, startRound)
							else
								game.time.events.add(1600, playerAttack, null, players[1], players[0], createProyectile, "proyectile")
						else{
							if (from.numPlayer === 1)
								sumXp += XP_TABLE.KILL
							else
								sumXp += XP_TABLE.DEATH
							defeatPlayer(target)
							game.time.events.add(2000, showResults, null, from.numPlayer === 1)
						}
					})

                })
                receiveAttack(target, from)
            })
        })

    }

	function convertTimeFormat(timeValue){
		var seconds = Math.floor(timeValue * 0.001)
		var decimals = Math.floor(timeValue * 0.01) % 10
		var centimals = (Math.floor(timeValue / 10) % 10)
		// elapsedSeconds = Math.round(elapsedSeconds * 100) / 100
		var result = (seconds < 10) ? "0" + seconds : seconds;
		result += ":" + decimals + centimals
		return result
	}

	function createHpbar(scale, health){
		scale = scale || 1
		var anchorX = scale < 0 ? 1 : 0

    	var hpGroup = game.add.group()
		hpGroup.scale.setTo(1 * scale, 1)
		hpGroup.health = health
		hpGroup.maxHealth = health

		var groupBg = game.add.graphics()
		groupBg.beginFill(0x000000)
		groupBg.drawRoundedRect(0, 0, HP_BAR_WIDTH + 20, 100, 15)
		groupBg.x = -groupBg.width * 0.5
		groupBg.y = -groupBg.height * 0.5 - 18
		groupBg.alpha = 0.5
		groupBg.endFill()
		hpGroup.add(groupBg)

		var rectBg = game.add.graphics()
		rectBg.beginFill(0x000000)
		rectBg.alpha = 0.4
		rectBg.drawRect(0,0, HP_BAR_WIDTH, 17)
		rectBg.endFill()
		rectBg.x = -95 //+ HP_BAR_WIDTH
		rectBg.y = -22 - 7
		hpGroup.add(rectBg)

		var hpBg = sceneGroup.create(-95, -22, 'atlas.battle', 'energy')
		hpBg.anchor.setTo(0, 0.5)
		hpBg.scale.setTo(0.5, 0.5)
		hpBg.width = HP_BAR_WIDTH
		hpBg.height = 17

		hpGroup.add(hpBg)

		var container = hpGroup.create(0, -22, 'atlas.battle', 'lifebar')
		container.anchor.setTo(0.5, 0.5)
		container.scale.setTo(0.8 * -1, 0.8)

		var fontStyle = {font: "18px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var healthText = new Phaser.Text(game, 0, 5, health, fontStyle)
		healthText.x = -66
		healthText.y = -18
		healthText.anchor.setTo(0.5,0.5)
		healthText.scale.x = scale
		hpGroup.add(healthText)
		hpGroup.healthText = healthText

		hpGroup.updateHealth = function (number) {
			this.health = Phaser.Math.clamp(this.health + number, 0, this.maxHealth)
			var newWidth = this.health * HP_BAR_WIDTH / this.maxHealth
			// console.log(this.health, newWidth)
			game.add.tween(hpBg).to({width:newWidth}, 1000, Phaser.Easing.Cubic.Out, true)

			this.healthText.text = this.health
			// game.add.tween(this.healthText.scale).to({x:1.2 * scale, y:1.2}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)
		}

		// hpGroup.resetHealth = function () {
		// 	this.health = MAX_HP
		// }

		var tAlign = scale < 0 ? "right" : "left"
		var fontStyle2 = {font: "28px VAGRounded", fontWeight: "bold", fill: "#ffffff", boundsAlignH: "left"}
		var name = new Phaser.Text(game, 0, 5, "", fontStyle2)
		name.stroke = '#2a2a2a';
		name.strokeThickness = 6;
		name.x = -HP_BAR_WIDTH * 0.5
		name.y = -45
		name.anchor.setTo(anchorX,0.5)
		name.scale.x = scale
		hpGroup.add(name)
        hpGroup.name = name
		name.setTextBounds(0, 0, 150, 0);

		var barPowerDown = hpGroup.create(0,0,"atlas.battle","barpower_down")
		barPowerDown.anchor.setTo(0.5, 0.5)
		barPowerDown.y = 12
		barPowerDown.scale.setTo(0.7, 0.7)

		var barFiller = game.add.graphics()
		barFiller.beginFill(0xFFFFFF)
		barFiller.drawRoundedRect(0,0, 120, 26, 8)
		barFiller.x = -88
		barFiller.endFill()
		barFiller.width = 0

		hpGroup.add(barFiller)

		var barPower = hpGroup.create(0,0,"atlas.battle","barpower_up")
		barPower.anchor.setTo(0.5, 0.5)
		barPower.y = 12
		barPower.scale.setTo(0.7, 0.7)

		hpGroup.setPower = function (pwrLevel) {
			sound.play("barLoad")

			var powerData = POWER_LEVELS[pwrLevel]
			game.add.tween(barFiller).to({width:powerData.width}, 1200, Phaser.Easing.Cubic.Out, true)
			tweenTint(barFiller, POWER_LEVELS.LOW.color, powerData.color, 1200)
			game.add.tween(hpGroup.scale).to({x:1.1 * scale, y:1.1}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)
			inputsEnabled = true
		}

		return hpGroup
	}

    function createPlayer(spine, position, scale, playerScale) {

		playerScale = playerScale || 1
		var player = spine
		var spineScale = player.data.spine.options.scale
		player.scale.setTo(playerScale * 0.8 * spineScale * scale, playerScale * 0.8 * spineScale)
		sceneGroup.add(player)
		player.statusAnimation = "IDLE"
		// console.log("width", player.width)
		player.x = position.x
		player.y = position.y
		player.alpha = 1
		// player.colorProyectile = MONSTERS[monsterCounter].colorProyectile
		player.scaleReference = scale

		var shadow = player.create(0, 0, 'atlas.battle', 'shadow')
		shadow.anchor.setTo(0.5, 0.5)
		shadow.scale.setTo(1.2, 1.2)
		player.sendToBack(shadow)
		// shadow.x = player.x
		// shadow.y = player.y

		var from = {}
		from.x = player.x + 100 * playerScale * scale
		from.y = player.y - 100 * playerScale
		player.from = from

		var hitDestination = {}
		hitDestination.x = player.x
		hitDestination.y = player.y - 100 * playerScale
		player.hitDestination = hitDestination

		var scaleShoot = {from:{x: 1, y: 1}, to:{x: 1, y: 1}}
		player.scaleShoot = scaleShoot

		var hitParticle = createPart("impact" + spine.projectileName)
		hitParticle.y = -100
		sceneGroup.add(hitParticle)
		player.hit = hitParticle

		var hpBar = createHpbar(scale, player.data.stats.health)
		hpBar.x = player.x + 200 * scale
		hpBar.y = scale < 0 ? player.y - 110 : player.y - 15
		sceneGroup.add(hpBar)
		hpBar.name.text = player.data.name
		player.hpBar = hpBar
		// player.name = data.nickname

		var proyectile = game.add.group()
		proyectile.x = from.x; proyectile.y = from.y
		sceneGroup.add(proyectile)

		var followObj = game.add.graphics()
		// followObj.beginFill(0xffffff)
		followObj.drawRect(0, 0, 50, 50)
		followObj.x = -followObj.width * 0.5
		followObj.y = -followObj.height * 0.5 - 50
		proyectile.add(followObj)
		// followObj.endFill()
		proyectile.followObj = followObj

		var idleSheet = game.add.sprite(0, 0, 'idlePower' + spine.projectileName)
		idleSheet.fps = spine.projectileData.sheet.idle.fps
		idleSheet.animations.add('idle')
		idleSheet.anchor.setTo(0.5, 0.5)
		proyectile.add(idleSheet)
		// idleSheet.x = from.x
		// idleSheet.y = from.y
		idleSheet.alpha = 0
		proyectile.idlePower = idleSheet

		var startSheet = game.add.sprite(0, 0, 'startPower' + spine.projectileName)
		startSheet.fps = spine.projectileData.sheet.start.fps
		var startAnimation = startSheet.animations.add('start')
		startSheet.anchor.setTo(0.5, 0.5)
		proyectile.add(startSheet)
		// startSheet.x = from.x
		// startSheet.y = from.y
		startSheet.alpha = 0
		proyectile.startPower = startSheet

		player.proyectile = proyectile
		player.level = charactersEntity.getLevel(player.card.xp)

		startAnimation.onComplete.add(function () {
			startSheet.alpha = 0
			idleSheet.alpha = 1
			idleSheet.animations.play('idle', idleSheet.fps, true)
		}, this);

		player.spine.setMixByName("RUN", "IDLE", 0.3)
		player.spine.setMixByName("WIN", "IDLE", 0.3)

		return player
	}
	
	function createGameObjects(){
        pullGroup = game.add.group()
        pullGroup.x = -game.world.centerX * 2
        pullGroup.y = -game.world.centerY * 2
        sceneGroup.add(pullGroup)
        pullGroup.alpha = 0

		players[0] = createPlayer(players[0], {x:WIDTH_DISTANCE, y: game.world.height - 150}, 1)
		players[1] = createPlayer(players[1], {x:game.world.width - WIDTH_DISTANCE * 0.7, y: game.world.height -400}, -1, 0.6)
		players[0].multiplier = getMultiplier(players[0].data.stats.element, players[1].data.stats.element)
		players[1].multiplier = getMultiplier(players[1].data.stats.element, players[0].data.stats.element)
		// player2.scale.setTo(playerScale * -1, playerScale)

		// var input1 = game.add.graphics()
		// input1.beginFill(0xffffff)
		// input1.drawCircle(0,0, 200)
		// input1.alpha = 0
		// input1.endFill()
		// players[0].add(input1)
		// input1.inputEnabled = true
		// input1.events.onInputDown.add(function () {
		// 	// showResults(true)
		// 	// players[0].setAnimation(["LOSE", "LOSESTILL"], true)
		// 	sumXp = 20
		// 	controlGroup.hide.start()
		// 	game.time.events.add(1000, showResults, null, true)
		// 	// playerAttack(player1, player2, createProyectile, "proyectile")
		// })
		//
		// var input2 = game.add.graphics()
		// input2.beginFill(0xffffff)
		// input2.drawCircle(0,0, 200)
		// input2.alpha = 0
		// input2.endFill()
		// player2.add(input2)
		// input2.inputEnabled = true
		// input2.events.onInputDown.add(function () {
		// 	playerAttack(player2, player1, createProyectile, "proyectile")
		// })

		// var cloud = createSpine("cloud", "normal", "BITE")
		// // cloud.setAnimation(["BITE"])
		// cloud.x = game.world.centerX
		// cloud.y = game.world.height - 200
		// sceneGroup.add(cloud)

		createTapGame()

    }

	function createConfeti(){
		var emitter = game.add.emitter(game.world.centerX, -32, 400);
		emitter.makeParticles('confeti', [0, 1, 2, 3, 4, 5]);
		emitter.maxParticleScale = 0.6;
		emitter.minParticleScale = 0.3;
		emitter.setYSpeed(200, 300);
		// emitter.gravity = 0;
		emitter.width = game.world.width;
		emitter.minRotation = 0;
		emitter.maxRotation = 360;

		emitter.start(false, 10000, 100, 0);
		frontGroup.add(emitter)
		// hudGroup.sendToBack(emitter)

	}

    function createPart(key, atlas){
        var particle = game.add.emitter(0, 0, 100);

        if(atlas)
        	particle.makeParticles(atlas, key);
        else
        	particle.makeParticles(key)
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.1;
        particle.maxParticleScale = 0.3;
        particle.gravity = 150;
        particle.angularDrag = 30;
		particle.setAlpha(1, 0, 1000, Phaser.Easing.Cubic.In)

        return particle

    }

    function stopGame(tag){

		sound.stopAll()
		battleSong.stop()
		sound.play("pop")

        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 200)
        tweenScene.onComplete.add(function(){
			game.camera.x = 0
			game.camera.y = 0
			game.camera.scale.x = 1
			game.camera.scale.y = 1
			players[0].destroy()
			players[0].destroy()

			if(tag === "retry")
				sceneloader.show("battle")
			else if(tag === "exit") {
				window.open("../epicMap/", '_self')
				model.savePlayer(currentPlayer)
			}
        })
    }

	function addPoint(number){

		sound.play("magic")
		pointsBar.number+=number;
		pointsBar.text.setText(pointsBar.number)

		var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		})

		addNumberPart(pointsBar.text, number)

	}

	function preload(){

		game.stage.disableVisibilityChange = true;
		game.load.audio('battleSong', soundsPath + 'songs/battleSong.mp3');
		// game.load.spine(avatar1, "images/spines/"+directory1+"/"+avatar1+".json")
		// game.load.spine(avatar2, "images/spines/"+directory2+"/"+avatar2+".json")
		game.load.spine("tap", "images/spines/tap/tap.json")
		game.load.spritesheet('confeti', 'images/battle/confeti.png', 64, 64, 6)

		game.load.image('ready',"images/battle/ready" + localization.getLanguage() + ".png")
		game.load.image('go',"images/battle/go" + localization.getLanguage() + ".png")
		game.load.bitmapFont('WAG', 'fonts/WAG.png', 'fonts/WAG.xml');
		// buttons.getImages(game)
		// console.log(parent.isKinder)
		soundsList = game.cache.getJSON('sounds')
		// console.log(assets.spines[0].name, assets.spines[0].file)
		players = []
		var projectilesList = {}
		for(var pIndex = 0; pIndex < 2; pIndex++){

			var player = createSpine(assets.spines[pIndex].name, "normal")
			player.data = charactersCards[pIndex].data
			player.card = charactersCards[pIndex]
			player.numPlayer = pIndex + 1
			var projectileName = player.data.stats.element
			player.projectileName = projectileName
			player.projectileData = projectilesData[projectileName]

			if(typeof projectilesList[projectileName] === "undefined"){
				var sheetData = player.projectileData.sheet
				game.load.spritesheet('startPower' + projectileName, sheetData.start.path,
					sheetData.start.frameWidth, sheetData.start.frameHeight, sheetData.start.frameMax)
				game.load.spritesheet('idlePower' + projectileName, sheetData.idle.path,
					sheetData.idle.frameWidth, sheetData.idle.frameHeight, sheetData.idle.frameMax)

				projectilesList[projectileName] = sheetData
				game.load.image('impact' + projectileName, player.projectileData.impact.particles[0])
				console.log(player.projectileData.impact.particles[0])
				var name = player.projectileData.impact.soundID
				var file = soundsList[name]
				game.load.audio(name, file);
				assets.sounds.push({name:name, file:file})
			}

			getSoundsSpine(player.spine)
			players.push(player)
		}
	}
	
	function checkPowerBars() {
		inputsEnabled = false
		var midY = (players[0].y + players[1].y) * 0.5

		for(var pIndex = 0; pIndex < players.length; pIndex++){
			var elementName = players[pIndex].data.stats.element

			var element = game.add.sprite(0,0,"atlas.battle",elementName)
			element.anchor.setTo(0.5, 0.5)
			element.scale.setTo(0.5, 0.5)
			element.alpha = 0
			element.index = pIndex

			hudGroup.uiGroup.add(element)
			element.x = players[pIndex].hitDestination.x; element.y = players[pIndex].hitDestination.y - 100
			game.add.tween(element).to({alpha:1},600, Phaser.Easing.Cubic.Out, true)
			var moveElement1 = game.add.tween(element).to({x:game.world.centerX - 30 * players[pIndex].scaleReference},
				600, Phaser.Easing.Sinusoidal.In, true, 400)

			var fromScale = element.scale.x + 0.2 * players[pIndex].scaleReference
			var scaleTween = game.add.tween(element.scale).from({x:fromScale, y:fromScale}, 600, null, true, 400)
			game.add.tween(element).to({y:game.world.centerY},600, Phaser.Easing.Sinusoidal.In, true, 400)
			moveElement1.onStart.add(function () {
				sound.play("cut")
			})

			var moveElement2 = game.add.tween(element).to({x:players[pIndex].hpBar.x, y:players[pIndex].hpBar.y}, 400,
				null, false, 500)
			moveElement2.onStart.add(function (obj) {
				game.add.tween(obj.scale).to({x:0.25, y:0.25}, 400, null, true)
			})
			moveElement1.onComplete.add(function (obj) {
				game.add.tween(obj.scale).to({x:0.6, y:0.6}, 150, Phaser.Easing.Cubic.Out, true).yoyo(true)
				sound.play("starsCollision")
			})
			// var scaleElement = game.add.tween(element.scale).to({x:0.6, y:0.6}, 250, Phaser.Easing.Cubic.Out).yoyo(true)
			var alphaElement = game.add.tween(element).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, false)
			moveElement1.chain(moveElement2)
			moveElement2.chain(alphaElement)
			
			alphaElement.onStart.add(function (obj) {
				var powerLvl = players[obj.index].multiplier < 1 ? "LOW" :
					players[obj.index].multiplier > 1 ? "HIGH" : "MED"

				players[obj.index].hpBar.setPower(powerLvl)
			})


		}



	}

    function showReadyGo() {
		sound.play("swipe")
    	var tweenReady1 = game.add.tween(ready).to({alpha:1}, 600, Phaser.Easing.Cubic.Out, true)
		game.add.tween(ready.scale).to({x:0.3, y:0.3}, 600, Phaser.Easing.Back.Out, true)
		var tweenReady2 = game.add.tween(ready).to({alpha:0}, 200, Phaser.Easing.Cubic.Out, null, 1000)

		var tweenReady3 = game.add.tween(go).to({alpha:1}, 300, Phaser.Easing.Quintic.Out)
		var tweenScale = game.add.tween(go.scale).to({x:0.5, y:0.5}, 300, Phaser.Easing.Quintic.Out)
		var tweenReady4 = game.add.tween(go).to({alpha:0}, 200, Phaser.Easing.Cubic.Out, null, 1000)

		tweenReady1.chain(tweenReady2)
		tweenReady2.chain(tweenReady3)
		tweenReady3.chain(tweenReady4)
		tweenReady3.onStart.add(function(){
			tweenScale.start()
			sound.play("comboSound")
		})
		tweenReady4.onComplete.add(function(){
			startRound()
			checkPowerBars()
		})
	}
    
    function enterGame() {
		for(var pIndex = 0; pIndex < players.length; pIndex++){
			var player = players[pIndex]

			player.originalX = player.x
			player.x = player.numPlayer === 1 ? -100 : game.world.width + 100 //* player.scaleReference
			console.log(player.scaleReference, "scaleReference")
			player.setAnimation(["RUN", "IDLE"], true)
			game.add.tween(player).to({x:player.originalX}, 1200, Phaser.Easing.Cubic.Out, true)

			player.hpBar.alpha = 0
			game.add.tween(player.hpBar).to({alpha:1}, 1200, Phaser.Easing.Cubic.Out, true, 600)
		}

		game.time.events.add(1200, showReadyGo)

	}

    function startRound() {

		inputsEnabled = true
		controlGroup.show.start()
    }

    function enableCircle(option) {
        option.circle.inputEnabled = true
    }

	function showExit() {

		var exitButton = hudGroup.winGroup.exitButton
		var exitTween = game.add.tween(exitButton).to({alpha:1}, 500, Phaser.Easing.Cubic.Out, true)
		exitTween.onStart.add(function () {
			game.add.tween(exitButton.scale).to({x:0.9, y:0.9}, 500, Phaser.Easing.Sinusoidal.InOut, true).yoyo(true).loop(true)
		})
	}

    function createWinOverlay() {
		hudGroup.winGroup.alpha = 0
		hudGroup.winGroup.y = -game.world.height

    	var winBar = hudGroup.winGroup.create(0, 0, "atlas.battle", "win")
		winBar.anchor.setTo(0.5, 0)
		winBar.x = game.world.centerX

		var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var winText = game.add.text(0, -5, "VICTORY", fontStyle)
		winText.anchor.setTo(0.5, 0)
		hudGroup.winGroup.add(winText)
		winText.x = game.world.centerX
		winText.y = 135

		var exitButton = hudGroup.winGroup.create(0, game.world.height - 80, "atlas.battle", "go_01")
		exitButton.anchor.setTo(0.5, 0.5)
		exitButton.x = game.world.centerX
		exitButton.tag = "exit"
		// exitButton.inputEnabled = true
		exitButton.events.onInputDown.add(onClickBtn)
		exitButton.alpha = 0
		hudGroup.winGroup.exitButton = exitButton

		var xpGroup = game.add.group()
		xpGroup.x = game.world.centerX - 180
		xpGroup.y = game.world.height - 50
		hudGroup.winGroup.add(xpGroup)

		var xpBar = xpGroup.create(60,-9, "atlas.battle", "bar01")
		xpBar.anchor.setTo(0, 0.5)

		var xpContainer = xpGroup.create(0,0,"atlas.battle","xp")
		xpContainer.anchor.setTo(0, 0.5)

		var fontXp = {font: "22px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
		var sumXpText = game.add.text(155, 17, "0/0", fontXp)
		sumXpText.anchor.setTo(0.5, 0.5)
		xpGroup.add(sumXpText)

		var lvlGroup = game.add.group()
		lvlGroup.x = game.world.centerX + 140
		lvlGroup.y = game.world.height - 80
		hudGroup.winGroup.add(lvlGroup)
		var levelBg = lvlGroup.create(0,0,"atlas.battle","level")
		levelBg.anchor.setTo(0.5, 0.5)
		levelBg.scale.setTo(0.8, 0.8)

		var fontStyle2 = {font: "28px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var lvlLabel = game.add.text(0, -18, "Level", fontStyle2)
		lvlLabel.anchor.setTo(0.5, 0.5)
		lvlGroup.add(lvlLabel)

		var fontStyle3 = {font: "36px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var numLevel = game.add.text(0, 18, "1", fontStyle3)
		numLevel.anchor.setTo(0.5, 0.5)
		lvlGroup.add(numLevel)

		var starParticle = createPart("star", "atlas.battle")
		lvlGroup.add(starParticle)
		starParticle.y = numLevel.y

		var soundLevelHandle
		var callback
		function setLvlBar(currentXp, totalXp) {
			var currentLevel = charactersEntity.getLevel(currentXp)
			var expLevel = charactersEntity.getLevelXp(currentLevel)
			var expNextLevel = charactersEntity.getLevelXp(currentLevel + 1)
			var expNeeded = expNextLevel - expLevel
			console.log(currentXp, currentLevel, expNeeded)

			numLevel.text = currentLevel
			var difCurrentExp = currentXp - expLevel
			sumXpText.text = difCurrentExp + "/" + expNeeded

			var barPercentage = difCurrentExp / expNeeded
			xpBar.scale.x = barPercentage

			var tweenBar
			var toExp
			if(totalXp >= expNextLevel){
				var newCurrenXp = expNextLevel
				toExp = expNeeded
				tweenBar = game.add.tween(xpBar.scale).to({x:1}, 2000, null, true)
				tweenBar.onComplete.add(function () {
					sound.play("levelUp")
					soundLevelHandle._sound.playbackRate.value = 1
					xpBar.scale.x = 0
					game.add.tween(numLevel.scale).to({x:1.2, y:1.2}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)
					setLvlBar(newCurrenXp, totalXp)
					starParticle.start(true, 1000, null, 5)
				})
			}else {
				toExp = totalXp - expLevel
				var finalBarPercentage = toExp / expNextLevel
				console.log(currentXp, expNextLevel, finalBarPercentage)
				tweenBar = game.add.tween(xpBar.scale).to({x: finalBarPercentage}, 2000, Phaser.Easing.Cubic.Out, true)
				tweenBar.onComplete.add(function () {
					console.log("stop")
					soundLevelHandle.stop()
					sound.stop("levelUp")
					exitButton.inputEnabled = true
					var hideLvlGroup = game.add.tween(lvlGroup).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true, 1000)
					var hidexPGroup = game.add.tween(xpGroup).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true, 1000)
					hideLvlGroup.onComplete.add(function () {
						callback()
					})
				})
			}
			tweenBar.onUpdateCallback(function (tween, percentage) {
				var currentNum = Math.ceil(toExp * percentage)
				sumXpText.text = currentNum + "/" + expNeeded
				soundLevelHandle._sound.playbackRate.value = 1 + 1 * percentage
			})
		}

		hudGroup.sumLvl = function (cardOwned) {
			var currentXp = players[0].card.xp
			var totalXp = currentXp + sumXp
			soundLevelHandle = sound.play("levelBar", {loop : true})
			callback = cardOwned ? showExit : showCaptured
			setLvlBar(currentXp, totalXp)
		}

		// sumXp = 100
		// hudGroup.sumLvl()

	}
	
	function createLoseOverlay() {
		hudGroup.loseGroup.alpha = 0
		hudGroup.loseGroup.y = -game.world.height

		var loseBar = hudGroup.loseGroup.create(0, 110, "atlas.battle", "lose")
		loseBar.anchor.setTo(0.5, 0)
		loseBar.x = game.world.centerX

		var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var loseText = game.add.text(0, 22, "DON'T GIVE UP", fontStyle)
		loseText.anchor.setTo(0.5, 0)
		hudGroup.loseGroup.add(loseText)
		loseText.x = game.world.centerX
		loseText.y = 135

		var retryButton = hudGroup.loseGroup.create(0, game.world.height - 80, "atlas.battle", "retry01")
		retryButton.anchor.setTo(0.5, 0.5)
		retryButton.scale.setTo(0.5, 0.5)
		retryButton.x = game.world.centerX - 100
		retryButton.tag = "retry"
		retryButton.inputEnabled = true
		retryButton.events.onInputDown.add(onClickBtn)

		var exitButton = hudGroup.loseGroup.create(0, game.world.height - 80, "atlas.battle", "back01")
		exitButton.anchor.setTo(0.5, 0.5)
		exitButton.scale.setTo(0.5, 0.5)
		exitButton.x = game.world.centerX + 100
		exitButton.tag = "exit"
		exitButton.inputEnabled = true
		exitButton.events.onInputDown.add(onClickBtn)

	}

	function onClickBtn(btn) {
		if(inputsEnabled){
			inputsEnabled = false
			var toScaleX = btn.scale.x + 0.1
			var toScaleY = btn.scale.y - 0.1
			game.add.tween(btn.scale).to({x:toScaleX, y:toScaleY}, 200, Phaser.Easing.Sinusoidal.InOut, true).yoyo(true)

			if(btn.tag === "attack"){
				playerAttack(players[0], players[1], createProyectile)
				controlGroup.hide.start()
				sound.play("epicAttackButton")
			}else if(btn.tag === "retry")
				stopGame("retry")
			else if(btn.tag === "exit")
				stopGame("exit")
		}
	}
	
    function createbattleUI() {

		controlGroup = game.add.group()
		controlGroup.x = game.world.centerX
		controlGroup.y = game.world.height + 150
		controlGroup.scale.setTo(0.8, 0.8)
		hudGroup.add(controlGroup)

		var bar = controlGroup.create(0,0, "atlas.battle", "bottom_bar")
		bar.anchor.setTo(0.5, 1)

		var attackBtn = controlGroup.create(-130, -40, "atlas.battle", "attack")
		game.add.tween(attackBtn.scale).to({x: 1.1, y: 1.1}, 500, Phaser.Easing.Sinusoidal.InOut, true).yoyo(true).loop(true)
		attackBtn.anchor.setTo(0.5, 1)
		attackBtn.tag = "attack"
		attackBtn.inputEnabled = true
		attackBtn.events.onInputDown.add(onClickBtn)

		//TODO: Add special attacks
		// var specialBtn = controlGroup.create(115, -20, "atlas.battle", "special")
		// specialBtn.anchor.setTo(0.5, 1)
		// specialBtn.tag = "special"
		// specialBtn.inputEnabled = true
		// specialBtn.events.onInputDown.add(onClickAttack)
		
		controlGroup.hide = game.add.tween(controlGroup).to({y:game.world.height + 150}, 1000, Phaser.Easing.Cubic.Out, false, 500)
		controlGroup.show = game.add.tween(controlGroup).to({y:game.world.height}, 1000, Phaser.Easing.Cubic.Out)

		//
		// var wrongParticle = createPart("wrong")f
		// sceneGroup.add(wrongParticle)
		// sceneGroup.wrongParticle = wrongParticle

		ready = sceneGroup.create(game.world.centerX, game.world.centerY, "ready")
		ready.anchor.setTo(0.5, 0.5)
		ready.scale.setTo(0.6, 0.6)
		ready.alpha = 0

		go = sceneGroup.create(game.world.centerX, game.world.centerY, "go")
		go.anchor.setTo(0.5, 0.5)
		go.alpha = 0

		createWinOverlay()
		createLoseOverlay()

    }

    function getFunctionData(value) {
		var indexOfFunc = value.indexOf(":")
		var functionName = null
		var param = null

		if(indexOfFunc > -1){
			functionName = value.substr(0, indexOfFunc)
			param = value.substr(indexOfFunc + 1)
		}
		// console.log(functionName, param)

		return {name: functionName, param: param}
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
		// spineSkeleton.autoUpdateTransform ()
		spineGroup.add(spineSkeleton)


		spineGroup.setAnimation = function (animations, loop, onComplete, args) {
			var entry
			for(var index = 0; index < animations.length; index++) {
				var animation = animations[index]
				var isLoop = (index === animations.length - 1) && loop
				if (index === 0)
					entry = spineSkeleton.setAnimationByName(0, animation, isLoop)
				else
					spineSkeleton.addAnimationByName(0, animation, isLoop)

			}

			if (args)
				entry.args = args

			if(onComplete){
				entry.onComplete = onComplete
			}

			return entry
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

		spineSkeleton.onEvent.add(function (i,e) {
			var eventName = e.data.name

			if((!eventName)&&(typeof eventName !== 'string'))
				return

			var functionData = getFunctionData(eventName)
			if((!functionData)||(!functionData.name)){return}

			if(functionData.name === "PLAY"){
				console.log(functionData.param)
				sound.play(functionData.param)
			}
		})

		spineGroup.spine = spineSkeleton

		return spineGroup
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

        var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.battle','gametuto')
        tuto.anchor.setTo(0.5,0.5)

        var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
        howTo.anchor.setTo(0.5,0.5)
        howTo.scale.setTo(0.8,0.8)

        var inputName = 'movil'

        if(game.device.desktop){
            inputName = 'desktop'
        }

        var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.battle',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
        inputLogo.scale.setTo(0.7,0.7)

        var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.battle','button')
        button.anchor.setTo(0.5,0.5)

        var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
        playText.anchor.setTo(0.5,0.5)
    }

	function addNumberPart(obj,number, fill, offsetY){
		offsetY = offsetY || 100
		fill = fill || "#ffffff"
		var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: fill, align: "center"}

		var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
		pointsText.x = obj.world ? obj.world.x : obj.centerX
		pointsText.y = obj.world ? obj.world.y : obj.centerY - 100
		pointsText.anchor.setTo(0.5,0.5)
		sceneGroup.add(pointsText)

		game.add.tween(pointsText).to({y:pointsText.y + offsetY},1000,Phaser.Easing.Cubic.Out,true)
		game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.Cubic.In,true,1000)

		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

	}

    return {
        assets: assets,
        name: "battle",
        preload:preload,
		setCharacters:function (characters) {
			charactersCards = []
        	for(var charIndex = 0; charIndex < characters.length; charIndex++){
				var character = characters[charIndex]
				console.log(character, "character")
				// var jsonPath = DATA_CHAR_PATH + character.name + ".json"
				// assets.jsons.push({name:character.name + "Data", file:jsonPath})
				assets.spines.push({name:character.id, file:character.data.directory})
				charactersCards.push(character)
			}
		},
		setBackground:function (number) {
			number = number || game.rnd.integerInRange(1, NUM_BACKGROUNDS)
			var floorObj = {
				name:"floor",
				file:"images/battle/backgrounds/floor_" + number + ".png"
			}
			var bgObg = {
				name:"background",
				file:"images/battle/backgrounds/top_bg_" + number + ".png"
			}

			assets.images.push(floorObj)
			assets.images.push(bgObg)
		},
        create: function(event){

        	game.camera.bounds = new Phaser.Rectangle(-200,0,game.world.width + 200,game.world.height)
			// console.log(game.camera.bounds)
        	sceneGroup = game.add.group();
            //yogomeGames.mixpanelCall("enterGame",gameIndex);

			var fondo = sceneGroup.create(0,0,'background')
			fondo.anchor.setTo(0.5, 0)
			fondo.scale.setTo(1, 1)
			fondo.x = game.world.centerX
			fondo.y = -50

			var floor = game.add.tileSprite(-200, game.world.height, game.world.width + 200, game.world.height - 300, "floor")
			sceneGroup.add(floor)
			floor.anchor.setTo(0, 1)

			var gredient = game.add.tileSprite(-200, 0, game.world.width + 200, 256, "atlas.battle", "floor_gradient")
			gredient.blendMode = PIXI.blendModes.MULTIPLY
			gredient.y = game.world.height - floor.height
			sceneGroup.add(gredient)

			// fondo.width = game.world.width
			// fondo.height = game.world.height
			alphaMask = game.add.graphics()
			alphaMask.beginFill(0x000000)
			alphaMask.drawRect(-200,-100, game.world.width + 200, game.world.height + 100)
			alphaMask.endFill()
			sceneGroup.add(alphaMask)
			alphaMask.alpha = 0

            battleSong = game.add.audio('battleSong')
            game.sound.setDecodedCallback(battleSong, function(){
                battleSong.loopFull(0.6)
            }, this);

            // game.onPause.add(function(){
            //     game.sound.mute = true
            // } , this);
			//
            // game.onResume.add(function(){
            //     game.sound.mute = false
            // }, this);

			hudGroup = game.add.group();
			sceneGroup.add(hudGroup)
			hudGroup.fixedToCamera = true
			hudGroup.cameraOffset.setTo(0, 0);

			var uiGroup = game.add.group()
			hudGroup.add(uiGroup)
			hudGroup.uiGroup = uiGroup

			createCaptured()

			var winGroup = game.add.group()
			hudGroup.add(winGroup)
			hudGroup.winGroup = winGroup

			var loseGroup = game.add.group()
			hudGroup.add(loseGroup)
			hudGroup.loseGroup = loseGroup

			initialize()
			createGameObjects()
            createbattleUI()
			// game.time.events.add(500, startRound)
			enterGame()
            // createTutorial()

			sceneGroup.bringToTop(hudGroup)
            // buttons.getButton(battleSong,hudGroup, game.width - 50)

			frontGroup = game.add.group()
			sceneGroup.add(frontGroup)
			frontGroup.fixedToCamera = true
			frontGroup.cameraOffset.setTo(0, 0);

        }
    }
}()