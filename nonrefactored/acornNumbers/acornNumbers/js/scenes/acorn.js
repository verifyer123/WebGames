
var soundsPath = "../../shared/minigames/sounds/"
var acorn = function(){

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
                name: "atlas.acorn",
                json: "images/acorn/atlas.json",
                image: "images/acorn/atlas.png"
            }
        ],
        images: [
            {   name:"fondo",
				file: "images/acorn/fondo.png"},
            {   name:"montains",
                file: "images/acorn/fondo1.png"}
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

    var NUM_LANES = 3
    var TOP_LANE_Y = 545
    var LANE_HEIGHT = 150

    // var ROUNDS = [
    //     {continent: "america", flags: ["mexico", "usa"]},
    //     {continent: "america", numFlags: 4},
    //     {continent: "random", numFlags: 4}]

    var lives
	var sceneGroup = null
    var gameIndex = 33
    var tutoGroup
    var acornSong
    var heartsGroup = null
    var pullGroup = null
    var clock
    var timeValue
    var quantNumber
    var inputsEnabled
    var pointsBar
    var roundCounter
    var background
    var ardilla
    var swipe
    var runnerMode
    var mountains
    var boardGroup
    var blocksGroup

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
        runnerMode = false

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

        var pointsImg = pointsBar.create(-10,10,'atlas.acorn','xpcoins')
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

    }

    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.acorn',key);
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
        acornSong.stop()
        clock.tween.stop()
        inputsEnabled = false

        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 750)
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
        game.load.audio('acornSong', soundsPath + 'songs/wormwood.mp3');

        game.load.image('introscreen',"images/acorn/introscreen.png")
		game.load.image('howTo',"images/acorn/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/acorn/play" + localization.getLanguage() + ".png")

        game.load.spine('ardilla', "images/spine/skeleton.json")
    }

    function addNumberPart(obj,number){

        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)

        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},250,null,true,500)

        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

    }

    function startRound() {
        inputsEnabled = true
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

        var heartImg = group.create(0,0,'atlas.acorn','life_box')

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

    function onClickPlay(rect) {
        rect.inputEnabled = false
        sound.play("pop")
        game.add.tween(tutoGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){

            tutoGroup.y = -game.world.height
            startRound()
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

		var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.acorn','gametuto')
		tuto.anchor.setTo(0.5,0.5)

        var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)

		var inputName = 'movil'

		if(game.device.desktop){
			inputName = 'desktop'
		}

		//console.log(inputName)
		var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.acorn',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)

		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.acorn','button')
		button.anchor.setTo(0.5,0.5)

		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function changeLane() {
        var toY = TOP_LANE_Y + LANE_HEIGHT * (ardilla.currentLane - 1) + 50
        game.add.tween(ardilla).to({y:toY}, 500, Phaser.Easing.Cubic.Out, true)
    }
    
    function checkAnswer(block) {
        if(inputsEnabled){
            inputsEnabled = false

            if (block.number === boardGroup.answer) {
                blocksGroup.particleCorrect.x = block.x
                blocksGroup.particleCorrect.y = block.y

                blocksGroup.particleCorrect.start(true, 1000, null, 3);

                ardilla.setAnimation("LOSESTILL")

                // runnerMode = true
            }else{
                blocksGroup.particleWrong.x = block.x
                blocksGroup.particleWrong.y = block.y

                blocksGroup.particleWrong.start(true, 1000, null, 3);
            }
        }
    }
    
    function createBlocks() {
        blocksGroup = game.add.group()
        blocksGroup.x = game.width - 100
        sceneGroup.add(blocksGroup)
        blocksGroup.blocks = []
        var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

        for(var blockIndex = 0; blockIndex < NUM_LANES; blockIndex++){
            var block = blocksGroup.create(0, 0,'atlas.acorn','respuesta')
            block.y = TOP_LANE_Y + (LANE_HEIGHT * blockIndex)
            block.anchor.setTo(0.5, 0.5)
            blocksGroup.add(block)
            blocksGroup.blocks[blockIndex] = block

            var text = new Phaser.Text(game, 0, block.y + 5, "0", fontStyle)
            text.anchor.setTo(0.5, 0.5)
            blocksGroup.add(text)
            block.text = text
            block.number = 0
            block.inputEnabled = true

            block.events.onInputDown.add(checkAnswer)
        }

        var particleCorrect = createPart('star')
        blocksGroup.add(particleCorrect)
        blocksGroup.particleCorrect = particleCorrect

        var particleWrong = createPart('wrong')
        blocksGroup.add(particleWrong)
        blocksGroup.particleWrong = particleWrong

    }

    function createBoard(){
        boardGroup = game.add.group()
        boardGroup.x = 180
        boardGroup.y = game.world.centerY - 60
        sceneGroup.add(boardGroup)
        var board = boardGroup.create(0,0,'atlas.acorn', 'tabla')
        board.anchor.setTo(0.5, 0.5)
        var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var number1 = new Phaser.Text(game, -86, -28, "0", fontStyle)
        number1.anchor.setTo(0.5, 0.5)
        boardGroup.add(number1)

        var operator = new Phaser.Text(game, 0, -32, "+", fontStyle)
        operator.anchor.setTo(0.5, 0.5)
        boardGroup.add(operator)

        var number2 = new Phaser.Text(game, 86, -28, "0", fontStyle)
        number2.anchor.setTo(0.5, 0.5)
        boardGroup.add(number2)

        boardGroup.answer = 0
    }
    
    function createSpine() {
        ardilla = game.add.group()
        ardilla.x = 150
        ardilla.y = TOP_LANE_Y + LANE_HEIGHT + 50
        sceneGroup.add(ardilla)

        var ardillaSpine = game.add.spine(0, 0, "ardilla")
        ardillaSpine.x = 0; ardillaSpine.y = 0
        ardillaSpine.scale.setTo(0.8,0.8)
        ardillaSpine.setSkinByName("normal")
        ardillaSpine.setAnimationByName(0, "IDLE", true)
        // ardillaSpine.y = TOP_LANE_Y + LANE_HEIGHT + 50
        ardillaSpine.currentLane = 2
        ardilla.add(ardillaSpine)

        var hitBox = new Phaser.Graphics(game)
        hitBox.beginFill(0xFFFFFF)
        hitBox.drawRect(0,0,100, 100)
        hitBox.alpha = 0.4
        hitBox.endFill()
        hitBox.x = -hitBox.width * 0.5
        hitBox.y = -hitBox.height
        ardilla.add(hitBox)
        ardilla.hitBox = hitBox
        
        ardilla.setAnimation = function (animation) {
            ardillaSpine.setAnimationByName(0, animation, false)
            ardillaSpine.addAnimationByName(0, "IDLE", true)
        }
    }
    
    function update() {
        if(runnerMode) {
            background.tilePosition.x -= 5
            mountains.tilePosition.x -= 0.5

            var direction = swipe.check()

            if (direction !== null) {
                switch (direction.direction) {
                    case swipe.DIRECTION_UP:
                        ardilla.currentLane = ardilla.currentLane - 1 > 0 ? ardilla.currentLane - 1 : 1
                        changeLane()
                        break;
                    case swipe.DIRECTION_DOWN:
                        ardilla.currentLane = ardilla.currentLane + 1 <= NUM_LANES ? ardilla.currentLane + 1 : NUM_LANES
                        changeLane()
                        break;
                }
            }
        }
    }

	return {
		assets: assets,
		name: "acorn",
        preload:preload,
        update:update,
		create: function(event){

            swipe = new Swipe(game)
		    sceneGroup = game.add.group()

            mountains = game.add.tileSprite(0,0,game.world.width,961,'montains')
            sceneGroup.add(mountains)

            background = game.add.tileSprite(0,0,game.world.width,961,'fondo')
            sceneGroup.add(background)

            acornSong = game.add.audio('acornSong')
            game.sound.setDecodedCallback(acornSong, function(){
                acornSong.loopFull(0.6)
            }, this);

            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);

            initialize()

            createHearts()
            createPointsBar()
            createGameObjects()
            createBoard()
            createBlocks()
            createSpine()
            createTutorial()

		}
	}
}()