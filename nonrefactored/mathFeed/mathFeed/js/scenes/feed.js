
var soundsPath = "../../shared/minigames/sounds/"
var feed = function(){
    
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
                name: "atlas.feed",
                json: "images/feed/atlas.json",
                image: "images/feed/atlas.png"
            }
        ],
        images: [
            {   name:"fondo",
				file: "images/feed/fondo.png"}
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
                file: soundsPath + "gameLose.mp3"},
            {   name: "combo",
                file: soundsPath + "combo.mp3"},
            {   name: "swallow",
                file: soundsPath + "swallow.mp3"},
            {   name: "bah",
                file: soundsPath + "bah.mp3"},
            {   name: "collapse",
                file: soundsPath + "towerCollapse.mp3"}
		]
    }

    var NUM_LIFES = 3
    var MAX_NUM_BRICKS = 14
    var CONTAINERS = ["0xFFE000", "0x1FD7DB", "0xF400FF"]
    var BRICK_HEIGHT = 82

    var ROUNDS = [
        {numbers:[5,3,7,5,2,2], colors:[0,1,0,0,2,1], pointsForNextRound:1},
        {numbers:[2,2,2,3,3,3], pointsForNextRound:5},
        {numbers:[2,3,4,6,8,9,9,7], pointsForNextRound:15},
        {numbers:[12,14,15,16,18,21,21,5], pointsForNextRound:30},
        {numbers:[12,14,15,21,24,28,33,27,26,23,5], pointsForNextRound:40}]
    
    var lives
	var sceneGroup = null
    var gameIndex = 30
    var tutoGroup
    var feedSong
    var heartsGroup = null
    var pullGroup = null
    var numPoints
    var inputsEnabled
    var pointsBar
    var brickList
    var bricksInGame
    var numSpaces
    var gameGroup
    var maxHeight
    var brickSelected
    var spineObj1
    var spineObj2
    var roundCounter
    var timeNextBrick
    var timeBetween
    var gameActive
    var swipe
    var pointsNextRound
    var addBrickCounter
    var speed
    var indexCounter

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = false
        lives = NUM_LIFES
        numPoints = 0
        roundCounter = 0
        addBrickCounter = 0
        pointsNextRound = 0
        indexCounter = 0
        speed = 5
        timeBetween = 3000
        brickList = []
        bricksInGame = []
        brickSelected = null
        numSpaces = Math.floor(game.world.height / BRICK_HEIGHT)

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        inputsEnabled = false
        maxHeight = game.world.height - 178
        timeNextBrick = 0
        
        loadSounds()
        
	}

    function addPoint(number){

        // sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)

        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        addNumberPart(pointsBar.text,'+' + number)

        // if(pointsBar.number % 2 == 0){
        timeBetween-=timeBetween * 0.02
        // speed += speed * 0.02
        if (pointsBar.number >= pointsNextRound){
            roundCounter = roundCounter + 1 > ROUNDS.length - 1 ? ROUNDS.length - 1 : roundCounter + 1
            if (roundCounter < ROUNDS.length - 1)
                addBrickCounter = 0
        }
        // }

    }
    
    function createBrick(index) {
        var containerGroup = game.add.group()
        containerGroup.x = 0
        containerGroup.y = 0

        // console.log(brickName)
        var container = containerGroup.create(0, 0, "atlas.feed", "container")
        container.anchor.setTo(0.5, 0.5)
        var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var numberText = new Phaser.Text(game, 0, 0, "0", fontStyle)
        numberText.anchor.setTo(0.5, 0.5)
        numberText.x = 0
        numberText.y = 2
        containerGroup.add(numberText)
        containerGroup.text = numberText
        containerGroup.container = container
        // containerGroup.originalIndex = index
        brickList.push(containerGroup)

        var glow = containerGroup.create(0, 0, "atlas.feed", "glow")
        glow.anchor.setTo(0.5, 0.5)
        glow.alpha = 0
        containerGroup.glow = glow

        var particle = createPart("star")
        containerGroup.particle = particle
        containerGroup.add(particle)

        pullGroup.add(containerGroup)

        container.events.onInputDown.add(onClickBrick)

    }
    
    function createPointsBar(){

        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)

        var pointsImg = pointsBar.create(-10,10,'atlas.feed','xpcoins')
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

        for(var brickIndex = 0; brickIndex < MAX_NUM_BRICKS; brickIndex++){
            createBrick(brickIndex)
        }

    }
    
    function createPart(key){
        var yOffset = yOffset || 0
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.feed',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

        // particlesGood.x = obj.x;
        // particlesGood.y = yOffset
        // particlesGood.start(false, 1000, null, 3);

        // obj.add(particlesGood)
        // obj.particle = particlesGood
        return particle
        
    }

    function stopGame(win){
                
        //objectsGroup.timer.pause()
        //timer.pause()
        feedSong.stop()
        inputsEnabled = false
        gameActive = false
        
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2000)
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
        game.load.audio('dojoSong', soundsPath + 'songs/wormwood.mp3');
        
        game.load.image('introscreen',"images/feed/introscreen.png")
		game.load.image('howTo',"images/feed/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/feed/play" + localization.getLanguage() + ".png")

        game.load.spine('yogotar', "images/spine/skeleton.json")
    }

    function addNumberPart(obj,number,fontStyle,direction,offset){

        var direction = direction || 100
        var fontStyle = fontStyle || {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var offset = offset || {x:0, y:0}

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

    function trimBrick(brick, easing) {
        if (brickSelected === brick)
            brickSelected = null

        game.add.tween(brick).to({alpha:0}, 800, easing, true).onComplete.add(function () {
            gameGroup.remove(brick)
            pullGroup.add(brick)
        })
        brick.container.inputEnabled = false
        bricksInGame.splice(brick.index, 1)
        brickList.unshift(brick)
    }

    function onClickBrick(obj) {
        if (gameActive) {
            if (brickSelected) {
                game.add.tween(brickSelected.glow).to({alpha: 0}, 400, Phaser.Easing.Cubic.Out, true)
                brickSelected.container.inputEnabled = true
            }

            var container = obj.parent
            brickSelected = container
            game.add.tween(container.glow).to({alpha: 1}, 400, Phaser.Easing.Cubic.Out, true)
            obj.inputEnabled = false
        }

        // trimBrick(container)
    }

    function addBrick(toY) {
        var round = ROUNDS[roundCounter]
        var roundNumbers = round.numbers
        timeNextBrick = 0
        pointsNextRound = round.pointsForNextRound
        var roundColors = round.colors

        var brick = brickList[brickList.length - 1]
        brickList.pop()
        pullGroup.remove(brick)
        gameGroup.add(brick)
        bricksInGame.push(brick)
        brick.color = roundColors ? roundColors[addBrickCounter] : game.rnd.integerInRange(0, CONTAINERS.length - 1)
        indexCounter++
        // brick.color = indexCounter % CONTAINERS.length
        brick.container.tint = CONTAINERS[brick.color]
        brick.alpha = 1
        brick.scale.x = 1
        brick.scale.y = 1
        brick.glow.alpha = 0
        brick.x = 0
        brick.y = toY || -50
        brick.timeElapsed = 0

        if ((addBrickCounter == 0)&&(roundCounter > 0))
            roundNumbers = Phaser.ArrayUtils.shuffle(roundNumbers)
        var number = roundNumbers[addBrickCounter]
        addBrickCounter = addBrickCounter + 1 < roundNumbers.length ? addBrickCounter + 1 : 0
        // console.log(rndNumber)
        brick.text.setText(number)
        brick.number = number

        brick.container.inputEnabled = true

    }
    
    function startRound() {

        for(var brickIndex = 0; brickIndex < 6; brickIndex++){
            var toY = (maxHeight - (brickIndex) * 80)
            addBrick(toY)
        }

    }

    function missPoint(){
        
        sound.play("wrong")
        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives === 0){
            stopGame(false)
        }
        // else{
        //     // startRound()
        // }
        
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

        var heartImg = group.create(0,0,'atlas.feed','life_box')

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
            gameActive = true
        })
    }
    
    function checkAnswer(brickNumber, yogotar) {

        if(brickNumber % yogotar.number === 0){
            sound.play("magic")
            sound.play("swallow")
            yogotar.correctPart.start(true, 1000, null, 3)
            yogotar.setAnimationByName(0, "WIN", false)

            var result = brickNumber / yogotar.number
            addPoint(1)
            var fontStyle = {font: "68px VAGRounded", fontWeight: "bold", fill: "#080788", align: "center"}
            addNumberPart(yogotar, result, fontStyle, -200, {x:0, y:-80})
        }else {
            sound.play("wrong")
            yogotar.wrongPart.start(true, 1000, null, 3)
            yogotar.setAnimationByName(0, "SICK", false)
            sound.play("bah")

            missPoint()
        }
        yogotar.addAnimationByName(0, "IDLE", true)
    }
    
    function brickAnimation(toX) {
        var toX = toX ? toX * -1 : 10
        // var toY = toX * 0.5
        for(var brickIndex = 0; brickIndex<bricksInGame.length; brickIndex++){
            var brick = bricksInGame[brickIndex]
            game.add.tween(brick).to({x:toX}, 150, Phaser.Easing.Cubic.InOut, true)
            // game.add.tween(brick).to({y:brick.y + toY}, 150, null, true)
            // game.add.tween(brick).to({y:brick.y + toY * -1}, 150, null, true, 150)
        }
        game.time.events.add(160, function () {

            returnBrickAnimation(toX)

        }, this)
    }

    function returnBrickAnimation(toX) {
        brickAnimation(toX)
    }
    
    function moveBrick(direction) {
        var toX, yogotar
        if(direction === "right"){
            toX = 180
            yogotar = spineObj2
        }else if(direction === "left"){
            toX = - 180
            yogotar = spineObj1
        }
        yogotar.setAnimationByName(0, "EAT", false)
        sound.play("swipe")
        game.add.tween(brickSelected.scale).to({x:0.4, y:0.4}, 600, Phaser.Easing.Cubic.Out, true)
        game.add.tween(brickSelected).to({x:toX}, 600, Phaser.Easing.Cubic.Out, true).onComplete.add(function(brickTween){
            checkAnswer(brickTween.number, yogotar)
            // timeNextBrick = timeBetween - 500
        })
        game.add.tween(brickSelected).to({y:maxHeight - 70}, 600, Phaser.Easing.Quadratic.InOut, true)
        // game.add.tween(brickSelected.glow).to({alpha:0}, 400, Phaser.Easing.Cubic.Out, true)
        trimBrick(brickSelected, Phaser.Easing.Cubic.In)
        brickSelected = null
    }

    function createSpines() {
        var fontStyle = {font: "58px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

        var yogotarsGroup = game.add.group()
        yogotarsGroup.x = game.world.centerX
        yogotarsGroup.y = game.world.centerY
        sceneGroup.add(yogotarsGroup)

        spineObj1 = game.add.spine(-200, maxHeight * 0.5 - 40, "yogotar")
        spineObj1.scale.setTo(0.8,0.8)
        spineObj1.setSkinByName("Eagle")
        spineObj1.setAnimationByName(0, "IDLE", true)
        yogotarsGroup.add(spineObj1)
        spineObj1.number = 2

        var globe1 = yogotarsGroup.create(0,0, 'atlas.feed', 'sign_a')
        globe1.anchor.setTo(0.5, 0.5)
        globe1.x = spineObj1.x; globe1.y = -10
        var numberText1 = new Phaser.Text(game, globe1.x, globe1.y - 12, "2", fontStyle)
        numberText1.anchor.setTo(0.5, 0.5)
        yogotarsGroup.add(numberText1)
        spineObj1.text = numberText1

        spineObj2 = game.add.spine(200, maxHeight * 0.5 - 40, "yogotar")
        spineObj2.scale.setTo(-0.8,0.8)
        spineObj2.setSkinByName("Luna")
        spineObj2.setAnimationByName(0, "IDLE", true)
        yogotarsGroup.add(spineObj2)
        spineObj2.number = 3

        var globe2 = yogotarsGroup.create(0,0, 'atlas.feed', 'sign_b')
        globe2.anchor.setTo(0.5, 0.5)
        globe2.x = spineObj2.x; globe2.y = -10
        var numberText2 = new Phaser.Text(game, globe2.x, globe2.y - 12, "3", fontStyle)
        numberText2.anchor.setTo(0.5, 0.5)
        yogotarsGroup.add(numberText2)
        spineObj2.text = numberText2

        var correctPart = createPart("star")
        spineObj1.add(correctPart)
        correctPart.y = -110
        spineObj1.correctPart = correctPart

        var correctPart2 = createPart("star")
        spineObj2.add(correctPart2)
        correctPart2.y = -110
        spineObj2.correctPart = correctPart2

        var wrongPart = createPart("wrong")
        spineObj1.add(wrongPart)
        wrongPart.y = -110
        spineObj1.wrongPart = wrongPart

        var wrongPart2 = createPart("wrong")
        spineObj2.add(wrongPart2)
        wrongPart2.y = -110
        spineObj2.wrongPart = wrongPart2

    }
    
    function update() {

        var colorCounter = []
        var colorsCounters = []
        colorsCounters.push(colorCounter)

        for(var brickIndex = 0; brickIndex < bricksInGame.length; brickIndex++){
            var brick = bricksInGame[brickIndex]
            brick.index = brickIndex
            brick.toY = (maxHeight - (brick.index) * 80)
            if (brick.y < brick.toY){
                // brick.timeElapsed += game.time.elapsedMS
                // console.log(brick.timeElapsed)
                // var vel = 8 * brick.timeElapsed / 1000
                brick.y += speed
            }
            else {
                brick.y = (maxHeight - (brick.index) * 80)
                if (brick.y <= 0) {
                    brickAnimation()
                    sound.play("collapse")
                    stopGame()
                }
                brick.timeElapsed = 0
                if ((colorCounter.length > 0)&&(colorCounter[colorCounter.length - 1].color !== brick.color)){
                    colorCounter = []
                    colorsCounters.push(colorCounter)
                }
                colorCounter.push(brick)
            }
        }

        for(var colorsIndex = 0; colorsIndex < colorsCounters.length; colorsIndex++) {
            var colorsSelected = colorsCounters[colorsIndex]
            if (colorsSelected.length >= 3) {
                for (var colorIndex = colorsSelected.length - 1; colorIndex >= 0; colorIndex--) {
                    var colorSelected = colorsSelected[colorIndex]
                    colorSelected.particle.start(true, 1000, null, 3)
                    trimBrick(colorSelected, Phaser.Easing.Cubic.Out)
                }
                sound.play("combo")
                addPoint(1)
            }
        }

        var direction = swipe.check()

        if (direction!==null && brickSelected) {
            // direction= { x: x, y: y, direction: direction }
            switch(direction.direction) {
                case swipe.DIRECTION_LEFT || swipe.DIRECTION_UP_LEFT || swipe.DIRECTION_DOWN_LEFT:
                    moveBrick("left")
                    break;
                case swipe.DIRECTION_RIGHT || swipe.DIRECTION_DOWN_RIGHT || swipe.DIRECTION_UP_RIGHT:
                    moveBrick("right")
                    break;
            }
        }


        // timeElapsed += game.time.elapsedMS
        timeNextBrick += game.time.elapsedMS

        if((timeNextBrick >= timeBetween)&&(pointsBar.number > 0)){
            addBrick()
        }

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
		
		var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.feed','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		//console.log(inputName)
		var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.feed',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.feed','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
	return {
		assets: assets,
		name: "feed",
        preload:preload,
        update:function(event) {
            if(gameActive)
                update()
        },
        create: function(event){

            swipe = new Swipe(game)
			sceneGroup = game.add.group()

            var background = sceneGroup.create(game.world.centerX,game.world.centerY,'fondo')
            background.anchor.setTo(0.5, 0.5)
            // background.width = game.world.width+2
            // background.height = game.world.height+2
            var backgroundLeft = sceneGroup.create(game.world.centerX - background.width,game.world.centerY,'fondo')
            backgroundLeft.anchor.setTo(0.5, 0.5)
            backgroundLeft.scale.x = -1
            var backgroundRight = sceneGroup.create(game.world.centerX + background.width,game.world.centerY,'fondo')
            backgroundRight.anchor.setTo(0.5, 0.5)
            backgroundRight.scale.x = -1
            var floor = game.add.tileSprite(game.world.centerX , game.world.height + 20, game.world.width, 158, "atlas.feed", "floor")
            floor.anchor.setTo(0.5, 1)
            sceneGroup.add(floor)
            
            feedSong = game.add.audio('dojoSong')
            game.sound.setDecodedCallback(feedSong, function(){
                feedSong.loopFull(0.6)
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
            createSpines()
            createGameObjects()
            startRound()

            createTutorial()
            
		}
	}
}()