
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
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
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
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
            {	name: "hit",
				file: soundsPath + "squeeze.mp3"},
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
            {   name: "win",
                file: soundsPath + "moleHit.mp3"},
            {   name: "knockout",
                file: soundsPath + "knockOut1.mp3"},
            {   name:"acornSong",
				file: soundsPath + 'songs/childrenbit.mp3'}
		]
    }

    var NUM_LIFES = 3

    var NUM_LANES = 3
    var TOP_LANE_Y = 545
    var LANE_HEIGHT = 150
    var NUM_OBJECTS = 50
    var DISTANCE_BETWEEN = 420

    var ROUNDS = [
        {acorn: 7, stone:3, operator:"+", maxNumber:5},
        {acorn: 6, stone:4, operator:"+", maxNumber:5},
        {acorn: 7, stone:7, operator:"+", maxNumber:5}]
    var OBJECTS = [{image:"stone", event:"hit"}, {image:"acorn", event:"addPoint"}]
    var OPERATIONS = ["+", "-"]

    var lives
	var sceneGroup = null
    var gameIndex = 34
    var tutoGroup
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
    var gameGroup
    var distance
    var currentDistance
    var objectList
    var particleCorrect
    var particleWrong
    var grabGroup
    var speed
    var canSwipe

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
                obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
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
        objectList = []

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        inputsEnabled = false
        distance = 0
        currentDistance = 0
        speed = 4
        canSwipe = false

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

        gameGroup = game.add.group()
        sceneGroup.add(gameGroup)

        for(var objectIndex = 0; objectIndex < NUM_OBJECTS; objectIndex++){
            var objectData = OBJECTS[objectIndex % OBJECTS.length]
            var object = pullGroup.create(0,0,'atlas.acorn',objectData.image)
            object.anchor.setTo(0.5, 0.5)
            object.event = objectData.event
            objectList.push(object)
            object.name = objectData.image
        }

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
        sound.stop("acornSong")
        // clock.tween.stop()
        // runnerMode = false
        inputsEnabled = false
        canSwipe = false
        // ardilla.setAnimation(["LOSE"])

        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 3000)
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

        /*game.load.image('introscreen',"images/acorn/introscreen.png")
		game.load.image('howTo',"images/acorn/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/acorn/play" + localization.getLanguage() + ".png")*/

        var inputName = 'movil'

        if(game.device.desktop){
            inputName = 'desktop'
        }

        game.load.image('tutorial_image',"images/acorn/tutorial_image_"+inputName+".png")

        game.load.spine('ardilla', "images/spine/skeleton.json")

        buttons.getImages()
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
    
    function generateQuestion() {
        var round = ROUNDS[roundCounter] ? ROUNDS[roundCounter] : ROUNDS[ROUNDS.length - 1]

        var number1 = game.rnd.integerInRange(0, round.maxNumber)
        var number2 = game.rnd.integerInRange(0, round.maxNumber)
        var answer

        var operation = round.operator
        if(round.operator === "random")
            operation = OPERATIONS[game.rnd.integerInRange(0, OPERATIONS.length - 1)]

        if (operation === "+"){
            answer = number1 + number2
        }else if(operation === "-"){
            if (number2 > number1){
                var prev = number2
                number2 = number1
                number1 = prev
            }
            answer = number1 - number2
        }

        boardGroup.answer = answer
        boardGroup.number1.setText(number1)
        boardGroup.operator.setText(operation)
        boardGroup.number2.setText(number2)

        var fakeAnswers = []
        for(var answerIndex = 0; answerIndex < round.maxNumber + round.maxNumber + 1; answerIndex++){
            if (answerIndex !== answer)
                fakeAnswers.push(answerIndex)
        }

        fakeAnswers = Phaser.ArrayUtils.shuffle(fakeAnswers)

        var correctBox = game.rnd.integerInRange(0, NUM_LANES - 1)
        for (var blockIndex = 0; blockIndex < NUM_LANES; blockIndex++){
            var block = blocksGroup.blocks[blockIndex]
            block.inputEnabled = true
            block.tint = "0xffffff"
            if (correctBox === blockIndex) {
                block.text.setText(answer)
                block.number = answer
            }
            else {
                block.text.setText(fakeAnswers[blockIndex])
                block.number = fakeAnswers[blockIndex]
            }
        }

    }

    function startRound() {
        var round = ROUNDS[roundCounter] ? ROUNDS[roundCounter] : ROUNDS[ROUNDS.length - 1]
        speed = speed + roundCounter

        inputsEnabled = true
        objectList = Phaser.ArrayUtils.shuffle(objectList)

        addObjects(round)
        roundCounter++
    }

    function missPoint(){

        sound.play("wrong")
        // inputsEnabled = false

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
            // startRound()
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
        tutoGroup.y = -game.world.height
    }

    function createTutorial(){

        tutoGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)


        /*var rect = new Phaser.Graphics(game)
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

		var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.acorn',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)

		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.acorn','button')
		button.anchor.setTo(0.5,0.5)

		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }
    
    function changeLane() {
        sound.play("cut")
        var toY = TOP_LANE_Y + LANE_HEIGHT * (ardilla.currentLane - 1) + 50
        game.add.tween(ardilla).to({y:toY}, 500, Phaser.Easing.Cubic.Out, true)
    }
    
    function checkAnswer(block) {
        if(inputsEnabled){
            block.inputEnabled = false
            var tween = game.add.tween(blocksGroup).to({alpha:0}, 600, Phaser.Easing.Cubic.Out, false, 750)
            var buttonEffect = game.add.tween(block.scale).to({x: 1.2, y: 1.2}, 300, Phaser.Easing.Cubic.Out, true)
            buttonEffect.onComplete.add(function () {
                game.add.tween(block.scale).to({x: 1, y: 1}, 300, Phaser.Easing.Cubic.In, true)
            })

            if (block.number === boardGroup.answer) {
                particleCorrect.x = block.x + blocksGroup.x
                particleCorrect.y = block.y

                particleCorrect.start(true, 1000, null, 3);
                tweenTint(block, 0xffffff, 0x46FF46, 500)
                ardilla.setAnimation(["WIN"])
                sound.play("win")

                // runnerMode = true
                inputsEnabled = false
                tween.start()
                addPoint(1)
                tween.onComplete.add(function () {
                    ardilla.setAnimation(["RUN"])
                    runnerMode = true
                    canSwipe = true
                    //inputsEnabled = false
                })
            }else{
                //inputsEnabled = false
                particleWrong.x = block.x + blocksGroup.x
                particleWrong.y = block.y

                particleWrong.start(true, 1000, null, 3);
                tweenTint(block, 0xffffff, 0xff5151, 500)
                missPoint()
                if (lives === 0)
                    ardilla.setAnimation(["SAD"])
                else
                    ardilla.setAnimation(["SAD","IDLE"])
                // tween.onComplete.add(function () {
                //     // runnerMode = true
                // })
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

            var text = new Phaser.Text(game, 0, block.y + 5, "0", fontStyle)
            text.anchor.setTo(0.5, 0.5)
            blocksGroup.add(text)
            block.text = text
            block.number = 0
            block.inputEnabled = true

            block.events.onInputDown.add(checkAnswer)
            blocksGroup.blocks.push(block)
        }

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
        boardGroup.number1 = number1

        var operator = new Phaser.Text(game, 0, -32, "+", fontStyle)
        operator.anchor.setTo(0.5, 0.5)
        boardGroup.add(operator)
        boardGroup.operator = operator

        var number2 = new Phaser.Text(game, 86, -28, "0", fontStyle)
        number2.anchor.setTo(0.5, 0.5)
        boardGroup.add(number2)
        boardGroup.number2 = number2

        boardGroup.answer = 0
    }
    
    function removeObjects() {
        for(var objectIndex = 0; objectIndex < gameGroup.objects.length; objectIndex++){
            var object = gameGroup.objects[objectIndex]
            gameGroup.remove(object)
            pullGroup.add(object)
        }
    }
    
    function addObjects(round) {
        var objectsNumber = round.acorn + round.stone
        var counters = {acorn:0, stone:0}
        gameGroup.objects = []
        distance = game.width + 100 + (DISTANCE_BETWEEN * objectsNumber)
        // var DISTANCE_BETWEEN = (distance - game.width - 100) / objectsNumber
        for(var objectIndex = 0; objectIndex < objectList.length; objectIndex++){
            var object = objectList[objectIndex]

            if(counters[object.name] < round[object.name] ) {
                object.x = game.width + DISTANCE_BETWEEN * gameGroup.objects.length + 100
                var randomLane = game.rnd.integerInRange(1, NUM_LANES)
                object.y = TOP_LANE_Y + LANE_HEIGHT * (randomLane - 1)
                pullGroup.remove(object)
                gameGroup.add(object)
                gameGroup.objects.push(object)
                object.collided = false
                object.alpha = 1
                object.scale.x = 1
                object.scale.y = 1

                counters[object.name]++
            }
        }

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
        hitBox.alpha = 0
        hitBox.endFill()
        hitBox.x = -hitBox.width * 0.5
        hitBox.y = -hitBox.height
        ardilla.add(hitBox)
        ardilla.hitBox = hitBox
        
        ardilla.setAnimation = function (animations, loop) {
            ardillaSpine.setAnimationByName(0, animation, loop)
            if(!loop){
                ardillaSpine.addAnimationByName(0, "IDLE", true)
            }
            for(var index = 0; index < animations.length; index++) {
                var animation = animations[index]
                var loop = index == animations.length - 1
                if (index === 0)
                    ardillaSpine.setAnimationByName(0, animation, loop)
                else
                    ardillaSpine.addAnimationByName(0, animation, loop)
            }
        }
    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
    
    function rotateObject(object) {
        game.add.tween(object).to({angle: 360}, 600, Phaser.Easing.Cubic.Out, true)
    }
    
    function hitObject(object) {
        runnerMode = false

        sound.play("hit")
        var secondAnimation = lives > 0 ? "RUN" : "LOSESTILL"
        ardilla.setAnimation(["HIT", secondAnimation])
        var toX = (-object.world.x + ardilla.x) + 300
        currentDistance -= toX
        game.add.tween(background.tilePosition).to({x: background.tilePosition.x + toX}, 800, Phaser.Easing.Cubic.Out, true)
        game.add.tween(boardGroup).to({x: boardGroup.x + toX}, 800, Phaser.Easing.Cubic.Out, true)
        game.add.tween(blocksGroup).to({x: blocksGroup.x + toX}, 800, Phaser.Easing.Cubic.Out, true)
        var tween = game.add.tween(gameGroup).to({x: gameGroup.x + toX}, 800, Phaser.Easing.Cubic.Out, true)
        tween.onComplete.add(function () {
            if (lives > 0) {
                runnerMode = true
                object.collided = false
            }else
                sound.play("knockout")
        })
    }
    
    function grabObject(object) {

        object.x = object.world.x - ardilla.x
        object.y = object.world.y - ardilla.y
        ardilla.add(object)

        rotateObject(object)
        game.add.tween(object).to({x: 0}, 200, Phaser.Easing.Cubic.Out, true)
        var tween = game.add.tween(object).to({y: - 140}, 400, Phaser.Easing.Cubic.Out, true)
        game.add.tween(object.scale).to({x: 1.4, y:1.4}, 400, Phaser.Easing.Cubic.Out, true)
        tween.onComplete.add(function () {
            particleCorrect.x = object.world.x
            particleCorrect.y = object.world.y

            particleCorrect.start(true, 1000, null, 1)
            game.add.tween(object).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true)
        })
    }
    
    function update() {

        if (canSwipe) {
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

        if(runnerMode) {

            background.tilePosition.x -= speed
            mountains.tilePosition.x -= speed * 0.1
            boardGroup.x -= speed
            blocksGroup.x -= speed
            gameGroup.x -= speed
            currentDistance += speed

            if (boardGroup.x < 0 - boardGroup.width){
                var diffDistance = distance - currentDistance
                boardGroup.x = diffDistance + 180
                blocksGroup.x = diffDistance + game.width - 100
                blocksGroup.alpha = 1
                generateQuestion()
            }

            // timeElapsed += game.time.elapsedMS

            for(var objectIndex = 0; objectIndex < gameGroup.objects.length; objectIndex++){
                var object = gameGroup.objects[objectIndex]
                var isCollision = checkOverlap(object, ardilla.hitBox)
                if ((isCollision)&&(!object.collided)){
                    object.collided = true
                    switch (object.event){
                        case "hit":
                            missPoint()
                            hitObject(object)
                            break
                        case "addPoint":
                            grabObject(object)
                            addPoint(1)
                            break
                    }
                }
            }

            if (distance <= currentDistance){
                runnerMode = false
                canSwipe = true
                inputsEnabled = true
                currentDistance = 0
                gameGroup.x = 0
                ardilla.setAnimation(["IDLE"], true)
                removeObjects()
                startRound()
            }
        }
    }

	return {
		assets: assets,
		name: "acorn",
        preload:preload,
        update:update,
		getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){

            swipe = new Swipe(game)
		    sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

            mountains = game.add.tileSprite(0,0,game.world.width,961,'montains')
            sceneGroup.add(mountains)

            background = game.add.tileSprite(0,0,game.world.width,961,'fondo')
            sceneGroup.add(background)
			// acornSong = game.add.audio('acornSong')
            // game.sound.setDecodedCallback(acornSong, function(){
            //     acornSong.loopFull(0.6)
            // }, this);

            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);

            initialize()
			var acornSong = sound.play("acornSong", {loop:true, volume:0.6})

            createHearts()
            createPointsBar()
            createBoard()
            createBlocks()
            createSpine()
            createGameObjects()
            generateQuestion()
            startRound()
            createTutorial()

            grabGroup = game.add.group()
            sceneGroup.add(grabGroup)

            particleCorrect = createPart('star')
            sceneGroup.add(particleCorrect)

            particleWrong = createPart('wrong')
            sceneGroup.add(particleWrong)

            buttons.getButton(acornSong,sceneGroup)
		}
	}
}()