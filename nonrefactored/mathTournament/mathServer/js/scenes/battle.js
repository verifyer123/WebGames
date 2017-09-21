
var soundsPath = "../../shared/minigames/sounds/"
var battle = function(){

    var localizationData = {
        "EN":{
            "howTo":"How to Play?",
            "moves":"Moves left"
        },

        "ES":{
            "moves":"Movimientos extra",
            "howTo":"�C�mo jugar?"
        }
    }


    var assets = {
        atlases: [
            {
                name: "atlas.battle",
                json: "images/battle/atlas.json",
                image: "images/battle/atlas.png"
            }
        ],
        images: [
            {   name:"fondo",
                file: "images/battle/fondo1.jpg"}
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
                file: soundsPath + "swordSmash.mp3"}
        ]
    }

    var NUM_LIFES = 3
    var NUM_OPTIONS = 3
    var MAX_HP = 100
	var WIDTH_DISTANCE = 220
	var HP_BAR_WIDTH = 350

    var ROUNDS = [
        {minNumber: 2, maxNumber: 10, operator:"x"}
        ]

    var MONSTERS = [
        {skin:"monster1", spineIndex:0, colorProyectile:"0xFFFE00", name:"Breeze"},
        {skin:"monster2", spineIndex:0, colorProyectile:"0x84FF00", name:"Bloom"},
        {skin:"monster3", spineIndex:0, colorProyectile:"0xFF8B00", name:"Typhoon"},
        {skin:"monster4", spineIndex:1, colorProyectile:"0x30FF00", name:"Whirlpool"},
        {skin:"monster5", spineIndex:0, colorProyectile:"0x00FFF5", name:"Bermuda"},
        {skin:"monster6", spineIndex:0, colorProyectile:"0xF400FF", name:"Monsoon"},
        {skin:"monster7", spineIndex:2, colorProyectile:"0xFF000C", name:"Batclops"},
        {skin:"monster8", spineIndex:2, colorProyectile:"0x00FF89", name:"Bloobarian"},
        {skin:"monster9", spineIndex:2, colorProyectile:"0x0057FF", name:"Grunth"}
        ]

    var SPINES = [
        {skeleton:"monster12356", defaultSkin:"monster1"},
        {skeleton:"monster4", defaultSkin:"monster4"},
        {skeleton:"monster789", defaultSkin:"monster7"}
    ]

    var lives
    var sceneGroup = null
    var gameIndex = 58
    var tutoGroup
    var battleSong
    var pullGroup = null
    var clock
    var timeValue
    var inputsEnabled
    var monsterCounter
    var player2
    var player1
    var battleGroup
    var indicator
    var killedMonsters
    var monsters
    var hitParticle
	var serverData
	var equation
	var alphaMask
	var ready, go

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){

        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        lives = NUM_LIFES
        timeValue = 60
        monsterCounter = 0
        killedMonsters = 0
        monsters = []

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        inputsEnabled = false

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
    
    function winPlayer(player) {
    	player.setAnimation(["WIN", "WINSTILL"])
		battleSong.stop()
		sound.play("winBattle")

		var toCamaraX = player.x < game.world.centerX ? 0 : game.world.width
		game.add.tween(game.camera.scale).to({x:1.6, y:1.6}, 2000, Phaser.Easing.Cubic.Out, true)
		game.add.tween(game.camera).to({x:toCamaraX, y:player.y - 250}, 2000, Phaser.Easing.Cubic.Out, true)
		game.time.events.add(6000, stopGame)
	}

    function receiveAttack(target, from) {
		target.hpBar.removeHealth(20)
        sound.play("hit")

		target.statusAnimation = target.hpBar.health <= 20 ? "TIRED" : "IDLE"
		target.setAnimation(["HIT", target.statusAnimation])
		console.log(target.spine.state)
		target.hit.start(true, 1000, null, 5)

        if(target.hpBar.health > 0)
            game.time.events.add(2000, startRound)
        else{
            // dino.setAnimation(["HIT", "IDLE"])
            // game.time.events.add(2000, defeatPlayer, null, target)
			defeatPlayer(target)
			game.time.events.add(3000, winPlayer, null, from)
        }
    }

	function playerAttack(fromPlayer, targetPlayer, typeAttack, asset){
		inputsEnabled = false
		var toCamaraX = fromPlayer.x < game.world.centerX ? 0 : game.world.width
		game.add.tween(game.camera.scale).to({x:1.6, y:1.6}, 2000, Phaser.Easing.Cubic.Out, true)
		game.add.tween(game.camera).to({x:toCamaraX, y:fromPlayer.y - 250}, 2000, Phaser.Easing.Cubic.Out, true)
		game.add.tween(alphaMask).to({alpha:0.7}, 1000, Phaser.Easing.Cubic.Out, true)

		// if (fromPlayer.hpBar.health > 0){
		fromPlayer.setAnimation(["ATTACK", fromPlayer.statusAnimation])
		fromPlayer.spine.speed = 0.5
		fromPlayer.startPower.alpha = 1
		fromPlayer.startPower.animations.play('start', 12, false)

		game.time.events.add(2000, function () {
			fromPlayer.spine.speed = 1
			game.add.tween(game.camera.scale).to({x:1, y:1}, 1000, Phaser.Easing.Cubic.Out, true)
			game.add.tween(game.camera).to({x:0, y:0}, 1000, Phaser.Easing.Cubic.Out, true)
			game.add.tween(alphaMask).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true)

			var proyectile = fromPlayer.idlePower
			sceneGroup.bringToTop(proyectile)
			// var proyectile = sceneGroup.create(0, 0, 'atlas.battle', asset)
			// proyectile.x = fromPlayer.from.x
			// proyectile.y = fromPlayer.from.y
			// proyectile.scale.x = fromPlayer.scaleShoot.from.x
			// proyectile.scale.y = fromPlayer.scaleShoot.from.y
			// proyectile.anchor.setTo(0.5, 0.5)
			// proyectile.tint = fromPlayer.proyectile

			typeAttack(proyectile, fromPlayer, targetPlayer)
		})
		// }
	}

    function defeatPlayer(player) {
		player.setAnimation(["HIT", player.statusAnimation])

        game.time.events.add(400, function () {
			player.setAnimation(["LOSE", "LOSESTILL"])
			// var dissapear = game.add.tween(player).to({alpha: 0}, 800, Phaser.Easing.Cubic.Out, true)
			// dissapear.onComplete.add(stopGame)
			// stopGame()
		})
    }

	function blowAttack(proyectile, from, target){
		sound.play("swordSmash")

		var toScale = target.scaleShoot
		game.add.tween(proyectile.scale).to({x: toScale.to.x, y: toScale.to.y}, 1200, null, true)

		var toHit = target.hitDestination
		game.add.tween(proyectile).to({x: toHit.x, y: toHit.y}, 1200, null, true).onComplete.add(function () {
			game.add.tween(proyectile).to({alpha: 0}, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(function () {
				proyectile.destroy()
			})
			receiveAttack(target, from)
		})

	}

    function createProyectile(proyectile, from, target){
        sound.play("throw")

		// var toScale = target.scaleShoot
		var toHit = target.hitDestination
		game.add.tween(proyectile).to({x: toHit.x}, 1600, null, true)
        // game.add.tween(proyectile.scale).to({x: toScale.to.x, y: toScale.to.y}, 1600, null, true)

        var first = game.add.tween(proyectile).to({y: toHit.y - 350}, 800, Phaser.Easing.Cubic.Out, true)
        first.onComplete.add(function () {
            game.add.tween(proyectile).to({y: toHit.y}, 800, Phaser.Easing.Cubic.In, true).onComplete.add(function () {
                game.add.tween(proyectile).to({alpha: 0}, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(function () {
                    // proyectile.destroy()
					proyectile.alpha = 0
					proyectile.x = from.from.x
					proyectile.y = from.from.y
                })
                receiveAttack(target, from)
            })
        })

    }

    function hideQuestion(){
        game.add.tween(equation).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)
    }

    function checkAnswer(event) {
		var data = server ? server.currentData.data : {operand1:100, opedator:"+", operand2:100, result:200, correctAnswer:200}
		switch ("?"){
			case data.operand1:
				data.operand1 = data.correctAnswer
				break
			case data.operand2:
				data.operand2 = data.correctAnswer
				break
			case data.result:
				data.result = data.correctAnswer
				break

		}
		equation.text = data.operand1 + data.opedator + data.operand2 + "=" + data.result

    	game.add.tween(equation.scale).to({x:1.2, y:1.2}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)
    	if(event.numPlayer === 1)
			playerAttack(player1, player2, createProyectile, "proyectile")
		else if(event.numPlayer === 2)
			playerAttack(player2, player1, createProyectile, "proyectile")
		else{
    		player1.setAnimation(["HIT", "IDLE"])
			player2.setAnimation(["HIT", "IDLE"])
			game.time.events.add(1000, startRound)
		}
    }

	function createHpbar(scale){
		scale = scale || 1
		var anchorX = scale < 1 ? 0 : 1

    	var hpGroup = game.add.group()
		hpGroup.scale.setTo(0.8 * scale, 0.8)
		hpGroup.health = MAX_HP

		var rectBg = game.add.graphics()
		rectBg.beginFill(0x000000)
		rectBg.alpha = 0.4
		rectBg.drawRect(0,0, 390, 50)
		rectBg.endFill()
		rectBg.x = -195
		rectBg.y = -25 - 5
		hpGroup.add(rectBg)

		var hpBg = sceneGroup.create(-150, -6, 'atlas.battle', 'energy')
		hpBg.anchor.setTo(0, 0.5)
		hpBg.scale.setTo(0.9, 0.9)
		hpBg.width = HP_BAR_WIDTH

		hpGroup.add(hpBg)

		var container = hpGroup.create(0, -22, 'atlas.battle', 'lifebar')
		container.anchor.setTo(0.5, 0.5)
		container.scale.setTo(0.8, 0.8)


		var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var healthText = new Phaser.Text(game, 0, 5, "100/100", fontStyle)
		healthText.x = -80
		healthText.y = -50
		healthText.anchor.setTo(0.5,0.5)
		healthText.scale.x = scale
		hpGroup.add(healthText)
		hpGroup.healthText = healthText

		hpGroup.removeHealth = function (number) {
			this.health -= number
			var newWidth = this.health * HP_BAR_WIDTH * 0.01
			game.add.tween(hpBg).to({width:newWidth}, 1000, Phaser.Easing.Cubic.Out, true)

			this.healthText.text = this.health + "/100"
			game.add.tween(this.healthText.scale).to({x:1.2 * scale, y:1.2}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)
		}

		hpGroup.resetHealth = function () {
			this.health = MAX_HP
		}

		var fontStyle2 = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var name = new Phaser.Text(game, 0, 5, "", fontStyle2)
		name.stroke = '#2a2a2a';
		name.strokeThickness = 6;
		name.x = 0
		name.y = -3
		name.anchor.setTo(anchorX,0.5)
		name.scale.x = scale
		hpGroup.add(name)
        hpGroup.name = name

		return hpGroup
	}

    function createPlayer(data, position, scale) {
		var shadow = sceneGroup.create(0, 0, 'atlas.battle', 'shadow')
		shadow.anchor.setTo(0.5, 0.5)

		var player = createSpine(data.avatar, "normal")
		player.scale.setTo(0.6 * scale, 0.6)
		sceneGroup.add(player)
		player.statusAnimation = "IDLE"
		console.log("width", player.width)
		player.x = position.x
		player.y = position.y
		player.alpha = 1
		shadow.x = player.x
		shadow.y = player.y
		player.proyectile = MONSTERS[monsterCounter].colorProyectile

		var from = {}
		from.x = player.x + 100 * scale
		from.y = player.y - 100
		player.from = from

		var hitDestination = {}
		hitDestination.x = player.x
		hitDestination.y = player.y - 100
		player.hitDestination = hitDestination

		var scaleShoot = {from:{x: 1, y: 1}, to:{x: 1, y: 1}}
		player.scaleShoot = scaleShoot

		//
		var explode = createPart("proyectile")
		explode.y = -100
		// explode.x = hitDestination2.x
		player.add(explode)
		hitParticle = explode
		hitParticle.forEach(function(particle) {particle.tint = 0xffffff})
		player.hit = hitParticle

		var hpBar = createHpbar(scale)
		hpBar.x = player.x
		hpBar.y = 120
		sceneGroup.add(hpBar)
		hpBar.name.text = serverData.p2.nickname
		player.hpBar = hpBar
		// monsterHpBar = hpBar1

		var idleSheet = game.add.sprite(1024, 600, 'idlePower')
		idleSheet.animations.add('idle')
		idleSheet.anchor.setTo(0.5, 0.5)
		sceneGroup.add(idleSheet)
		idleSheet.x = from.x
		idleSheet.y = from.y
		idleSheet.alpha = 0
		player.idlePower = idleSheet

		var startSheet = game.add.sprite(1024, 600, 'startPower')
		var startAnimation = startSheet.animations.add('start')
		startSheet.anchor.setTo(0.5, 0.5)
		sceneGroup.add(startSheet)
		startSheet.x = from.x
		startSheet.y = from.y
		startSheet.alpha = 0
		player.startPower = startSheet

		startAnimation.onComplete.add(function () {
			startSheet.alpha = 0
			idleSheet.alpha = 1
			idleSheet.animations.play('idle', 12, true)
		}, this);

		player.spine.setMixByName("RUN", "IDLE", 0.3)

		return player
	}
	
	function createGameObjects(){
        pullGroup = game.add.group()
        pullGroup.x = -game.world.centerX * 2
        pullGroup.y = -game.world.centerY * 2
        sceneGroup.add(pullGroup)
        pullGroup.alpha = 0

		player1 = createPlayer(serverData.p1, {x:WIDTH_DISTANCE, y: game.world.height - 150}, 1)
		player2 = createPlayer(serverData.p2, {x:game.world.width - WIDTH_DISTANCE, y: game.world.height - 150}, -1)
		var input1 = game.add.graphics()
		input1.beginFill(0xffffff)
		input1.drawCircle(0,0, 200)
		input1.alpha = 0
		input1.endFill()
		player1.add(input1)
		input1.inputEnabled = true
		input1.events.onInputDown.add(function () {
			playerAttack(player1, player2, createProyectile, "proyectile")
		})

		var input2 = game.add.graphics()
		input2.beginFill(0xffffff)
		input2.drawCircle(0,0, 200)
		input2.alpha = 0
		input2.endFill()
		player2.add(input2)
		input2.inputEnabled = true
		input2.events.onInputDown.add(function () {
			playerAttack(player2, player1, createProyectile, "proyectile")
		})

		// var cloud = createSpine("cloud", "normal")
		// cloud.setAnimation(["RUN"])
		// cloud.x = game.world.centerX
		// cloud.y = game.world.height - 200
		// sceneGroup.add(cloud)

    }

    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.battle',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = 0.6;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle

    }

    function stopGame(){

        //objectsGroup.timer.pause()
        //timer.pause()
		// sound.play("uuh")

        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1800)
        tweenScene.onComplete.add(function(){
			game.camera.x = 0
			game.camera.y = 0
			game.camera.scale.x = 1
			game.camera.scale.y = 1
            // var numPoints = killedMonsters * 5
            // var resultScreen = sceneloader.getScene("result")
            // resultScreen.setScore(true, pointsBar.number, gameIndex)

            //amazing.saveScore(pointsBar.number)
			if(server){
				server.removeEventListener('afterGenerateQuestion', generateQuestion);
				server.removeEventListener('onTurnEnds', checkAnswer);
			}
            sceneloader.show("result")
            sound.play("gameLose")
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

		addNumberPart(pointsBar.text,'+' + number)

	}

    function preload(){

        game.stage.disableVisibilityChange = true;
        game.load.audio('battleSong', soundsPath + 'songs/battleSong.mp3');
        game.load.spine('luna', "images/spines/Luna/luna.json")
        game.load.spine('eagle', "images/spines/Eagle/eagle.json")
        game.load.spine('cloud', "images/spines/nube/normal.json")
		game.load.spritesheet('startPower', 'images/battle/START.png', 200, 200, 11)
		game.load.spritesheet('idlePower', 'images/battle/IDLE.png', 200, 200, 11)

		game.load.image('ready',"images/battle/ready" + localization.getLanguage() + ".png")
		game.load.image('go',"images/battle/go" + localization.getLanguage() + ".png")
        buttons.getImages(game)

    }

    function showReadyGo() {
		var tweenReady1 = game.add.tween(ready).to({alpha:1}, 600, Phaser.Easing.Cubic.Out, true)
		game.add.tween(ready.scale).to({x:0.5, y:0.5}, 600, Phaser.Easing.Back.Out, true)
		var tweenReady2 = game.add.tween(ready).to({alpha:0}, 200, Phaser.Easing.Cubic.Out, null, 1000)

		var tweenReady3 = game.add.tween(go).to({alpha:1}, 300, Phaser.Easing.Quintic.Out)
		var tweenScale = game.add.tween(go.scale).to({x:0.5, y:0.5}, 300, Phaser.Easing.Quintic.Out)
		var tweenReady4 = game.add.tween(go).to({alpha:0}, 200, Phaser.Easing.Cubic.Out, null, 1000)

		tweenReady1.chain(tweenReady2)
		tweenReady2.chain(tweenReady3)
		tweenReady3.chain(tweenReady4)
		tweenReady3.onStart.add(function(){
			tweenScale.start()
		})
	}
    
    function enterGame() {
		player1.originalX = player1.x
		player1.x = -100
		player1.setAnimation(["RUN", "IDLE"])
		game.add.tween(player1).to({x:player1.originalX}, 1200, Phaser.Easing.Cubic.Out, true)

		// player1.hpBar.originalY = player1.hpBar.y
		player1.hpBar.alpha = 0
		game.add.tween(player1.hpBar).to({alpha:1}, 1200, Phaser.Easing.Cubic.Out, true, 600)

		player2.originalX = player2.x
		player2.x = game.world.width + 100
		player2.setAnimation(["RUN", "IDLE"])
		game.add.tween(player2).to({x:player2.originalX}, 1200, Phaser.Easing.Cubic.Out, true)

		// player2.hpBar.originalY = player2.hpBar.y
		player2.hpBar.alpha = 0
		game.add.tween(player2.hpBar).to({alpha:1}, 1200, Phaser.Easing.Cubic.Out, true, 600)

		game.time.events.add(1200, showReadyGo)

	}

    function startRound() {
        hideQuestion()
		if(server)
			server.generateQuestion()

		// game.time.events.add(1000, generateQuestion)
    }

    function numbersEffect() {
        sound.play("cut")

        equation.alpha = 0

		equation.scale.x = 0.2
		equation.scale.y = 0.2

        game.add.tween(equation.scale).to({x: 1,y:1}, 800, Phaser.Easing.Bounce.Out, true)
        game.add.tween(equation).to({alpha:1}, 800, Phaser.Easing.Cubic.Out, true)
    }

    function enableCircle(option) {
        option.circle.inputEnabled = true
    }

    function generateQuestion(data) {
        // var round = ROUNDS[roundCounter] ? ROUNDS[roundCounter] : ROUNDS[ROUNDS.length - 1]
		// console.log(data)
        equation.text = data.operand1 + data.opedator + data.operand2 + "=" + data.result
        numbersEffect()

    }

    function createbattleUI() {

        var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#350A00", align: "center"}

        var questionGroup = game.add.group()
		questionGroup.x = game.world.centerX
        questionGroup.y = 100
        sceneGroup.add(questionGroup)

		var container = questionGroup.create(0,0, "atlas.battle", "container")
		container.anchor.setTo(0.5, 0.5)
		container.scale.setTo(0.9, 0.6)

        equation = new Phaser.Text(game, 0, -5, "0+0=?", fontStyle)
		equation.alpha = 0
		equation.anchor.setTo(0.5,0.5)
		questionGroup.add(equation)

        var correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
		sceneGroup.correctParticle = correctParticle

        var wrongParticle = createPart("wrong")
		sceneGroup.add(wrongParticle)
		sceneGroup.wrongParticle = wrongParticle

		ready = sceneGroup.create(game.world.centerX, game.world.centerY, "ready")
		ready.anchor.setTo(0.5, 0.5)
		ready.alpha = 0

		go = sceneGroup.create(game.world.centerX, game.world.centerY, "go")
		go.anchor.setTo(0.5, 0.5)
		go.alpha = 0

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

	function addNumberPart(obj,number, offsetY){
		offsetY = offsetY || 100
		var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

		var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
		pointsText.x = obj.world ? obj.world.x : obj.centerX
		pointsText.y = obj.world ? obj.world.y : obj.centerY
		pointsText.anchor.setTo(0.5,0.5)
		sceneGroup.add(pointsText)

		game.add.tween(pointsText).to({y:pointsText.y + offsetY},800,Phaser.Easing.linear,true)
		game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)

		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

	}

    return {
        assets: assets,
        name: "battle",
        preload:preload,
        create: function(event){

        	sceneGroup = game.add.group();
            serverData = server ? server.currentData : {
            	p1:{nickname:"Player1", avatar:"eagle"},
				p2:{nickname:"Player2", avatar:"luna"}
            }
            //yogomeGames.mixpanelCall("enterGame",gameIndex);

			var fondo = sceneGroup.create(0,0,'fondo')
			fondo.anchor.setTo(0.5, 1)
			fondo.scale.setTo(1, 1)
			fondo.x = game.world.centerX
			fondo.y = game.world.height
			// fondo.width = game.world.width
			// fondo.height = game.world.height
			alphaMask = game.add.graphics()
			alphaMask.beginFill(0x000000)
			alphaMask.drawRect(-2,-2, game.world.width + 2, game.world.height + 2)
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

            initialize()

            createGameObjects()
            createbattleUI()
			// game.time.events.add(500, startRound)
			enterGame()
			if(server){
				server.addEventListener('afterGenerateQuestion', generateQuestion);
				server.addEventListener('onTurnEnds', checkAnswer);
			}else{
				game.time.events.add(1000, function () {
					generateQuestion({operand1:100, opedator:"+", operand2:100, result:200})
				})
			}
            // createTutorial()

            buttons.getButton(battleSong,sceneGroup)

        }
    }
}()