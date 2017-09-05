
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
            // {   name:"fondo",
            //     file: "images/battle/fondo.png"}
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
            {   name: "evilLaugh",
                file: soundsPath + "evilLaugh.mp3"},
            {   name: "swordSmash",
                file: soundsPath + "swordSmash.mp3"}
        ]
    }

    var NUM_LIFES = 3
    var NUM_OPTIONS = 3
    var MAX_HP = 7

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
    var pointsBar
    var monsterCounter
    var player2
    var player1
    var battleGroup
    var indicator
    var killedMonsters
    var monsters
    var hitParticle

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
    
    function receiveAttack(target) {
		target.hpBar.removeHealth(2)
        sound.play("hit")

		target.statusAnimation = target.hpBar.health < 3 ? "TIRED" : "IDLE"
		target.setAnimation(["HIT", target.statusAnimation])
		target.hit.start(true, 1000, null, 5)

        if(target.hpBar.health > 0)
            game.time.events.add(1000, startRound)
        else{
            // dino.setAnimation(["HIT", "IDLE"])
            game.time.events.add(1000, defeatPlayer, null, target)
        }
    }

	function playerAttack(fromPlayer, targetPlayer, typeAttack, asset){
		inputsEnabled = false

		// if (fromPlayer.hpBar.health > 0){
		fromPlayer.setAnimation(["ATTACK", fromPlayer.statusAnimation])

		var proyectile = sceneGroup.create(0, 0, 'atlas.battle', asset)
		proyectile.x = fromPlayer.from.x
		proyectile.y = fromPlayer.from.y
		proyectile.scale.x = fromPlayer.scaleShoot.from.x
		proyectile.scale.y = fromPlayer.scaleShoot.from.y
		proyectile.anchor.setTo(0.5, 0.5)
		proyectile.tint = fromPlayer.proyectile

		game.time.events.add(500, function () {
			typeAttack(proyectile, fromPlayer, targetPlayer)
		})
		// }
	}
    
    function defeatPlayer(player) {
		player.setAnimation(["HIT", player.statusAnimation])

        game.time.events.add(400, function () {
			player.setAlive(false)
			sound.play("fart")
			var dissapear = game.add.tween(player).to({alpha: 0}, 800, Phaser.Easing.Cubic.Out, true)
		})

		//showWinScreen
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
			receiveAttack(target)
		})

	}

    function createProyectile(proyectile, from, target){
        sound.play("throw")

		var toScale = target.scaleShoot
		var toHit = target.hitDestination
		game.add.tween(proyectile).to({x: toHit.x}, 1600, null, true)
        game.add.tween(proyectile.scale).to({x: toScale.to.x, y: toScale.to.y}, 1600, null, true)

        var first = game.add.tween(proyectile).to({y: 46}, 800, Phaser.Easing.Cubic.Out, true)
        first.onComplete.add(function () {
            game.add.tween(proyectile).to({y: toHit.y}, 800, Phaser.Easing.Cubic.In, true).onComplete.add(function () {
                game.add.tween(proyectile).to({alpha: 0}, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(function () {
                    proyectile.destroy()
                })
                receiveAttack(target)
            })
        })

    }

    function hideQuestion(){
        game.add.tween(battleGroup.number1).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)
        game.add.tween(battleGroup.operator).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)
        game.add.tween(battleGroup.number2).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)

        for(var optionIndex = 0; optionIndex < battleGroup.options.length; optionIndex++) {
            var option = battleGroup.options[optionIndex]
            game.add.tween(option.scale).to({x:0.2, y:0.2}, 800, Phaser.Easing.Cubic.Out, true)
            game.add.tween(option).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)
        }
    }

    function checkAnswer(event) {
		console.log(event)
    	if(event.numPlayer === 1)
			playerAttack(player1, player2, createProyectile, "proyectile")
		else if(event.numPlayer === 2)
			playerAttack(player2, player1, createProyectile, "proyectile")
    }

	function createHpbar(){
		var hpGroup = game.add.group()
		hpGroup.health = 7

		var container = hpGroup.create(0, -22, 'atlas.battle', 'healthcontainer')
		container.anchor.setTo(0.5, 0.5)

		var hpBg = sceneGroup.create(0, 0, 'atlas.battle', 'hp_bar')
		hpBg.anchor.setTo(0.5, 0.5)
		hpGroup.add(hpBg)

		var startX = -hpBg.width * 0.5 + 20
		var spaceWidth = hpBg.width / MAX_HP - 2
		hpGroup.circles = []
		for(var circleIndex = 0; circleIndex < MAX_HP; circleIndex++){
			var x = startX + spaceWidth * circleIndex
			var graphics = game.add.graphics(0, 0);
			graphics.beginFill(0xFF0000, 1);
			graphics.drawCircle(x, 0, 22);
			hpGroup.add(graphics)
			hpGroup.circles.push(graphics)
		}

		hpGroup.removeHealth = function (number) {
			for(var hpIndex = 0; hpIndex < number; hpIndex++){
				var circle = this.circles[this.health - 1 - hpIndex]
				if(circle){
					game.add.tween(circle).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true)
					game.add.tween(circle).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true, 300)
					game.add.tween(circle).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true, 600)
					game.add.tween(circle).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true, 900)
					game.add.tween(circle).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true, 1200)
				}
			}
			this.health -= number
		}

		hpGroup.resetHealth = function () {
			this.health = MAX_HP
			for(var hpIndex = 0; hpIndex < this.circles.length; hpIndex++){
				var circle = this.circles[hpIndex]
				if(circle){
					game.add.tween(circle).to({alpha:1}, 600, Phaser.Easing.Cubic.Out, true)
				}
			}
		}

		var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#350A00", align: "center"}
		var name = new Phaser.Text(game, 0, 5, "", fontStyle)
		name.x = 80
		name.y = -50
		name.anchor.setTo(1,0.5)
		hpGroup.add(name)
        hpGroup.name = name

		return hpGroup
	}

	function createMonsters(){
        for(var monsterIndex = 0; monsterIndex < SPINES.length; monsterIndex++){
			var spineData = SPINES[monsterIndex]

            var monsterSpine = createSpine(spineData.skeleton, spineData.defaultSkin)
			monsterSpine.x = game.world.width + 110
			monsterSpine.y = monsterSpine.height + 120
			monsterSpine.scale.setTo(0.8, 0.8)
			sceneGroup.add(monsterSpine)
			monsterSpine.statusAnimation = "IDLE"
            monsterSpine.alpha = 0

            monsters.push(monsterSpine)
        }
    }

    function createGameObjects(){
        pullGroup = game.add.group()
        pullGroup.x = -game.world.centerX * 2
        pullGroup.y = -game.world.centerY * 2
        sceneGroup.add(pullGroup)
        pullGroup.alpha = 0

        var floor = sceneGroup.create(0, 0, 'atlas.battle', 'floor')
        floor.anchor.setTo(0.5, 0.5)
        floor.scale.setTo(0.65, 0.65)

        // createMonsters()

		var spineData = SPINES[MONSTERS[0].spineIndex]
		player2 = createSpine(spineData.skeleton, spineData.defaultSkin)
		player2.scale.setTo(0.8, 0.8)
		sceneGroup.add(player2)
		player2.statusAnimation = "IDLE"
        player2.x = game.world.width - 140
		player2.y = 360
        player2.alpha = 1
		floor.x = player2.x
		floor.y = player2.y
		player2.proyectile = MONSTERS[monsterCounter].colorProyectile

		var from2 = {}
		from2.x = player2.x - 40
		from2.y = player2.y - player2.height * 0.5 - 50
		player2.from = from2

		var hitDestination2 = {}
		hitDestination2.x = player2.x + 80
		hitDestination2.y = player2.y - player2.height * 0.5 + 50
		player2.hitDestination = hitDestination2

		var scale2 = {from:{x: 0.4, y: 0.4}, to:{x: 1, y: 1}}
		player2.scaleShoot = scale2

		var input2 = game.add.graphics()
		input2.beginFill(0xffffff)
		input2.drawCircle(0,0, 200)
		input2.endFill()
		player2.add(input2)
		input2.inputEnabled = true
		input2.events.onInputDown.add(function () {
			playerAttack(player2, player1, createProyectile, "proyectile")
		})
		//
        var explode = createPart("alecbuu")
        explode.y = player2.y - player2.height * 0.5
        explode.x = player2.x
        sceneGroup.add(explode)
        hitParticle = explode
        hitParticle.forEach(function(particle) {particle.tint = 0xffffff})
		player2.hit = hitParticle

        var monsterHpBar = createHpbar()
		monsterHpBar.x = player2.x - 250
		monsterHpBar.y = player2.y - player2.height + 30
        sceneGroup.add(monsterHpBar)
		monsterHpBar.name.text = MONSTERS[0].name
		player2.hpBar = monsterHpBar
        // monsterHpBar = hpBar1

        var floor2 = sceneGroup.create(0, 0, 'atlas.battle', 'floor')
        floor2.anchor.setTo(0.5, 0.5)

        player1 = createSpine("arthurius", "normal")
		player1.x = 105
		player1.y = player1.height + 280
		player1.proyectile = "0xFFFFFF"
		sceneGroup.add(player1)
		floor2.x = player1.x - 8
		floor2.y = player1.y - 40
		player1.statusAnimation = "IDLE"

		var from1 = {}
		from1.x = player1.x - 40
		from1.y = player1.y - player1.height * 0.5 - 50
		player1.from = from1

		var hitDestination1 = {}
		hitDestination1.x = player1.x + 80
		hitDestination1.y = player1.y - player1.height * 0.5 + 50
		player1.hitDestination = hitDestination1

		var scale1 = {from:{x: 0.4, y: 0.4}, to:{x: 1, y: 1}}
		player1.scaleShoot = scale1

		var input1 = game.add.graphics()
		input1.beginFill(0xffffff)
		input1.drawCircle(0,0, 200)
		input1.endFill()
		player1.add(input1)
		input1.inputEnabled = true
		input1.events.onInputDown.add(function () {
			playerAttack(player1, player2, createProyectile, "proyectile")
		})

        var explodeArthurius = createPart("proyectile")
        player1.add(explodeArthurius)
		explodeArthurius.y = -player1.height * 0.5 + 40
        player1.hit = explodeArthurius
        player1.hit.forEach(function(particle) {particle.tint = MONSTERS[monsterCounter].colorProyectile})

		var hpBar2 = createHpbar()
		hpBar2.x = player1.x + 310
		hpBar2.y = player1.y - 50
		sceneGroup.add(hpBar2)
		player1.hpBar = hpBar2
        hpBar2.name.text = "Arthurius"

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
        sound.play("uuh")
        battleSong.stop()
        player1.setAlive(false)
        var dissapear = game.add.tween(player1).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true, 600)
        dissapear.onStart.add(function () {
			sound.play("evilLaugh")
		})
        // clock.tween.stop()
        inputsEnabled = false

        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1800)
        tweenScene.onComplete.add(function(){

            // var numPoints = killedMonsters * 5
            var resultScreen = sceneloader.getScene("result")
            resultScreen.setScore(true, pointsBar.number, gameIndex)

            //amazing.saveScore(pointsBar.number)
            sceneloader.show("result")
            sound.play("gameLose")
        })
    }

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.battle','xpcoins')
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
        game.load.audio('battleSong', soundsPath + 'songs/mysterious_garden.mp3');

        game.load.image('introscreen',"images/battle/introscreen.png")
        game.load.image('howTo',"images/battle/how" + localization.getLanguage() + ".png")
        game.load.image('buttonText',"images/battle/play" + localization.getLanguage() + ".png")

        game.load.spine('monster12356', "images/spines/monster12356/monster12356.json")
        game.load.spine('monster4', "images/spines/monster4/monster4.json")
        game.load.spine('monster789', "images/spines/monster789/monster789.json")
        game.load.spine('arthurius', "images/spines/arthurius/arthurius.json")
        game.load.spine('flama', "images/spines/flama/flama.json")
        buttons.getImages(game)

    }

    function startRound() {
        hideQuestion()
        indicator.tweenRestart.start()
		server.generateQuestion()

		// game.time.events.add(1000, generateQuestion)
    }
    
    function numbersEffect() {
        sound.play("cut")

        battleGroup.number1.alpha = 0
        battleGroup.operator.alpha = 0
        battleGroup.number2.alpha = 0

        battleGroup.number1.scale.x = 0.2
        battleGroup.number1.scale.y = 0.2
        battleGroup.operator.scale.x = 0.2
        battleGroup.operator.scale.y = 0.2
        battleGroup.number2.scale.x = 0.2
        battleGroup.number2.scale.y = 0.2

        game.add.tween(battleGroup.number1.scale).to({x: 1,y:1}, 800, Phaser.Easing.Bounce.Out, true)
        game.add.tween(battleGroup.operator.scale).to({x: 1,y:1}, 800, Phaser.Easing.Bounce.Out, true)
        game.add.tween(battleGroup.number2.scale).to({x: 1,y:1}, 800, Phaser.Easing.Bounce.Out, true)
        game.add.tween(battleGroup.number1).to({alpha:1}, 800, Phaser.Easing.Cubic.Out, true)
        game.add.tween(battleGroup.operator).to({alpha:1}, 800, Phaser.Easing.Cubic.Out, true)
        game.add.tween(battleGroup.number2).to({alpha:1}, 800, Phaser.Easing.Cubic.Out, true)
    }
    
    function enableCircle(option) {
        option.circle.inputEnabled = true
    }

    function startIndicator(delay) {
        var timeTween = timeValue * 1000
        indicator.timer = game.add.tween(indicator).to({x:-190}, timeTween, null, true, delay)
        indicator.timer.onComplete.add(monsterAttack)

        // inputsEnabled = true
    }

    function generateQuestion(data) {
        // var round = ROUNDS[roundCounter] ? ROUNDS[roundCounter] : ROUNDS[ROUNDS.length - 1]
		console.log(data)

        battleGroup.answer = data.correctAnswer
        battleGroup.number1.setText(data.operand1)
        battleGroup.operator.setText(data.opedator)
        battleGroup.number2.setText(data.operand2)
        numbersEffect()

    }
    
    function createbattleUI() {

        battleGroup = game.add.group()
        battleGroup.x = game.world.centerX
        battleGroup.y = game.height - 200
        sceneGroup.add(battleGroup)

        var colorBox = new Phaser.Graphics(game)
        colorBox.beginFill(0x054954)
        colorBox.drawRect(0,0,game.width, 400)
        colorBox.endFill()
        colorBox.x = -game.width * 0.5
        colorBox.y = -200
        battleGroup.add(colorBox)

        var dashboad = battleGroup.create(0, 0, 'atlas.battle', 'UIcontainer')
        dashboad.anchor.setTo(0.5, 0.5)

        var fontStyle = {font: "54px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var options = []

        var spaceWidth = dashboad.width / 3
        var startX = -dashboad.width * 0.5 + 84
        
        for(var optionIndex = 0; optionIndex < NUM_OPTIONS; optionIndex++){
            var option = game.add.group()
            option.x = startX + spaceWidth * optionIndex
            option.y = 84
            option.alpha = 0
            battleGroup.add(option)

            var optionCircle = option.create(0, 0, 'atlas.battle', 'option')
            optionCircle.anchor.setTo(0.5, 0.5)
            optionCircle.inputEnabled = true
            optionCircle.events.onInputDown.add(checkAnswer)
            option.circle = optionCircle

            var numberText = new Phaser.Text(game, 0, 0, "0", fontStyle)
            // numberText.x = optionCircle.x
            // numberText.y = optionCircle.y - 3
            numberText.anchor.setTo(0.5,0.5)
            option.add(numberText)
            option.text = numberText
            options.push(option)
        }
        battleGroup.options = options

        fontStyle = {font: "72px VAGRounded", fontWeight: "bold", fill: "#350A00", align: "center"}

        var questionGroup = game.add.group()
        questionGroup.y = -50
        battleGroup.add(questionGroup)

        var number1 = new Phaser.Text(game, 0, 5, "00", fontStyle)
        number1.x = -40
        number1.y = 10
        number1.alpha = 0
        number1.anchor.setTo(1,0.5)
        questionGroup.add(number1)
        battleGroup.number1 = number1

        var operator = new Phaser.Text(game, 0, 5, "+", fontStyle)
        operator.x = 0
        operator.y = 5
        operator.alpha = 0
        operator.anchor.setTo(0.5,0.5)
        questionGroup.add(operator)
        battleGroup.operator = operator

        var number2 = new Phaser.Text(game, 0, 5, "00", fontStyle)
        number2.x = 40
        number2.y = 10
        number2.alpha = 0
        number2.anchor.setTo(0,0.5)
        questionGroup.add(number2)
        battleGroup.number2 = number2

        var correctParticle = createPart("star")
        battleGroup.add(correctParticle)
        battleGroup.correctParticle = correctParticle

        var wrongParticle = createPart("wrong")
        battleGroup.add(wrongParticle)
        battleGroup.wrongParticle = wrongParticle

        var barGraphics = game.add.graphics(0, 0)
        barGraphics.lineStyle(8, 0x000000, 1)
        barGraphics.beginFill(0xFFFFFF, 1)
        barGraphics.drawCircle(0, 0, 44)
        // battleGroup.add(barGraphics)
        //190
        indicator = game.add.sprite(-190, -120, barGraphics.generateTexture())
        indicator.anchor.setTo(0.5, 0.5)
        indicator.scale.x = 0.6
        indicator.scale.y = 0.6
        battleGroup.add(indicator)
        barGraphics.destroy()

        indicator.tweenRestart = game.add.tween(indicator).to({x:190}, 900, Phaser.Easing.Cubic.Out)
        indicator.tweenRestart.onStart.add(function () {
            sound.play("whoosh")
        })

    }
    
    function createSpine(skeleton, skin, idleAnimation, x, y) {
        idleAnimation = idleAnimation || "IDLE"
        var spineGroup = game.add.group()
        spineGroup.x = x || 0
        spineGroup.y = y || 0

        var spineSkeleton = game.add.spine(0, 0, skeleton)
        spineSkeleton.x = 0; spineSkeleton.y = 0
        // spineSkeleton.scale.setTo(0.8,0.8)
        spineSkeleton.setSkinByName(skin)
        spineSkeleton.setAnimationByName(0, idleAnimation, true)
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
            spineSkeleton.setToSetupPose()
        }
        
        spineGroup.setAlive = function (alive) {
            spineSkeleton.autoUpdate = alive
        }

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
            //yogomeGames.mixpanelCall("enterGame",gameIndex);

			var rectBg = game.add.graphics()
			rectBg.beginFill(0x181433)
			rectBg.drawRect(0, 0, game.world.width, game.world.height)
			rectBg.endFill()
			sceneGroup.add(rectBg)

			var wall = game.add.tileSprite(0,0,game.world.width, 320, 'atlas.battle','wall')
			sceneGroup.add(wall)

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
			var window = sceneGroup.create(game.world.centerX,game.world.centerY - 320, "atlas.battle", "window")
			window.anchor.setTo(0.5, 0.5)

			var pillar = sceneGroup.create(game.world.centerX - 150,game.world.centerY - 320, "atlas.battle", "pillar")
			pillar.anchor.setTo(0.5, 0.5)

			var pillar2 = sceneGroup.create(game.world.centerX + 150,game.world.centerY - 320, "atlas.battle", "pillar")
			pillar2.anchor.setTo(0.5, 0.5)

			var torch = createSpine("flama", "normal")
			torch.x = game.world.centerX - 230
			torch.y = game.world.centerY - 320
			sceneGroup.add(torch)

			var torch2 = createSpine("flama", "normal")
			torch2.x = game.world.centerX + 230
			torch2.y = game.world.centerY - 320
			sceneGroup.add(torch2)

            createGameObjects()
            createbattleUI()
            createPointsBar()
			server.addEventListener('afterGenerateQuestion', generateQuestion);
			server.addEventListener('onTurnEnds', checkAnswer);
			startRound()
            // createTutorial()

            buttons.getButton(battleSong,sceneGroup)

        }
    }
}()