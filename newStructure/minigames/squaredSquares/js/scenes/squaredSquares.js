var soundsPath = "../../shared/minigames/sounds/"


var squaredSquares = function(){

    var CUBE_TYPE = {
        NOMARL:0,
        FALL:1,
        TRAFFIC:2
    }

	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/squaredSquares/atlas.json",
                image: "images/squaredSquares/atlas.png"
            },
        ],
        images: [
            {   name:"tutorial_image",
                file: "images/squaredSquares/tutorial_image.png"},
            {   name:"stars",
                file:"images/squaredSquares/stars.png"
                }
		],
		sounds: [
            {	name: "pop",
                file: soundsPath + "pop.mp3"},
		    {	name: "fall",
				file: soundsPath + "falling.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "right",
				file: soundsPath + "rightChoice.mp3"},
            {   name: "magic",
                //file: soundsPath + "gameLose.mp3"},
                file: soundsPath + "magic.mp3"},
            {   name: "gameLose",
                //file: soundsPath + "magic.mp3"}
                file: soundsPath + "gameLose.mp3"},
            {
                name: 'gameSong',
                file: soundsPath + 'songs/retrowave.mp3'
            },
            {
                name:"down",
                file: soundsPath+"shootBall.mp3"
            },
            {
                name:"punch",
                file: soundsPath+"punch1.mp3"
            },
            {
                name:"trafficChange",
                file: soundsPath+"flipCard.mp3"
            }
        ],
        spines:[
            {
                name:'cube',
                file:'images/spines/cube/cube.json'
            },
            {
                name:'justice',
                file:'images/spines/justice/justice.json'
            },

		]
    }

    var NUM_LIFES = 3

    var DELTA_BUTTON = 170


    var DELTA_RAW = 120
    var INITIAL_RAW = 300
    var DELTA_QUAD = 130

    var INITIA_VELOCITY = 1
    var DELTA_VELOCITY = 0.1
    var MAX_VELOCITY = 5

    var LIMIT_Y_CREATE_NEW_RAW

    var LIMIT_Y_DESTROY_CUBE = -100

    var INITIAL_PROBABILITY = 0
    var DELTA_PROBABILITY = 0.02
    var MAX_ROBABILITY = 0.4
    var TRAFIC_PROBABILITY = 0.6

    var DELTA_FALL = 700

    var OFFSET_YOGOTAR_CUBE = -20
    var OFFSET_TRAFFIC_CUBE = 80

    var TRAFFIC_MIN_TIME = 1000
    var TRAFFIC_MAX_TIME = 1500

    var FALLING_TIME = 800

    var COIN_PROBABILITY = 0.25
    var OFFSET_COIN = -50

    var BLINK_TIMES = 3
    var TIME_BLINK = 400

    
    var lives
	var sceneGroup = null
    var gameIndex = 171
    var tutoGroup
    var backgroundSound
    var timeValue
    var numPoints
    var gameGroup
    var heartsGroup
    var pointsBar
    var gameActive 

    var timeOn = false
    var clock, tweenTiempo, timeBar

    var currentLevel = 0
    var currentTime
    var correctParticle

    var inTutorial
    var hand

    var yogotar
    var squareRaws

    var nextY

    var cubesGroup
    var fallGroup
    var trafficGroup
    var coinsGroup

    var nextRawNum
    var isNextJumpPair

    var moveVelocity 

    var lastCube

    var canJump
    var canTouch

    var nextRawPlus
    var currentPositionId

    var probabilityEnemyCube
    var lastCube


	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = NUM_LIFES
        numPoints = 0

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        gameActive = false
        currentLevel = 0
        timeOn = false

        inTutorial = 0

        squareRaws = []
        nextY = INITIAL_RAW

        nextRawNum = 2
        isNextJumpPair = true

        moveVelocity = INITIA_VELOCITY
        probabilityEnemyCube = INITIAL_PROBABILITY

        LIMIT_Y_CREATE_NEW_RAW = game.world.height+200
        canTouch = true
        canJump = true
        nextRawPlus = true
        currentPositionId = 0
        loadSounds()
        
	}

    function preload(){
        game.stage.disableVisibilityChange = false;

        game.load.spritesheet("coin", 'images/squaredSquares/coin.png', 122, 123, 12)

    }

    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.game','hearts')

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

    function createPointsBar(){

        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)

        var pointsImg = pointsBar.create(-10,10,'atlas.game','xpcoins')
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
    
    function createPart(atlas,key){

        var particles = game.add.emitter(0, 0, 100);

        particles.makeParticles(atlas,key);
        particles.minParticleSpeed.setTo(-200, -50);
        particles.maxParticleSpeed.setTo(200, -100);
        particles.minParticleScale = 0.2;
        particles.maxParticleScale = 1;
        particles.gravity = 150;
        particles.angularDrag = 30;

        return particles
    }


    function Coin(coins,objectDestiny,time){

       correctParticle.x = coins.x
        correctParticle.y = coins.y
        correctParticle.start(true, 1000, null, 5)

       game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
       game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
            coins.visible = false
            coins.animations.stop(null,true)
            coins.alpha = 1
            //coins.animations
           addPoint(1)
       })
    }

    function stopGame(){

        backgroundSound.stop()
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
    
    

    function addNumberPart(obj,number){

        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)

        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.Linear.none,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.Linear.none,true,500)

        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

    }

    function addPoint(number){

        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        numPoints++
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        addNumberPart(pointsBar.text,'+' + number)

    }
    
    function missPoint(){
        
        sound.play("wrong")
        
        lives--;
        heartsGroup.text.setText('X ' + lives)

        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        addNumberPart(heartsGroup.text,'-1')

        stopTouch = true
        
        if(lives === 0){
            stopGame(false)
        }
        else{
            //nextRound()
        }
        
        // addNumberPart(batteryGroup,'-1')
    }
    


    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height
        gameActive = true
        setRound()

    }

    function createTutorial(){
        
        tutoGroup = game.add.group()

        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

        
    }

    function setRound(){
        
    }

    function evalTutorial(){

    }
    
    function update() {
        if(gameActive){
            updateMove()
            updateInput()
        }
    }


    function updateMove(){

        for(var index = 0; index < cubesGroup.length; index++){
            if(cubesGroup.children[index].visible){
                cubesGroup.children[index].y -= moveVelocity

                if(cubesGroup.children[index].y<LIMIT_Y_DESTROY_CUBE){
                    cubesGroup.children[index].visible = false
                }
            }
        }

        for(var index = 0; index < fallGroup.length; index++){
            if(fallGroup.children[index].visible && !fallGroup.children[index].isFalling){
                fallGroup.children[index].y -= moveVelocity

                if(fallGroup.children[index].y<LIMIT_Y_DESTROY_CUBE){
                    fallGroup.children[index].visible = false
                }

                if(fallGroup.children[index].active){
                    if(fallGroup.children[index].time < game.time.now){
                        fallGroup.children[index].isFalling = true
                        sound.play("fall")
                        fallGroup.children[index].fallingTween = game.add.tween(fallGroup.children[index]).to({y:fallGroup.children[index].y + game.world.height},FALLING_TIME,Phaser.Easing.linear,true)
                    }
                }
            }
        }

        for(var index = 0; index < trafficGroup.length; index++){
            if(trafficGroup.children[index].visible){
                trafficGroup.children[index].y -= moveVelocity

                if(trafficGroup.children[index].y<LIMIT_Y_DESTROY_CUBE){
                    trafficGroup.children[index].visible = false
                }

                if(trafficGroup.children[index].active){
                    if(trafficGroup.children[index].time < game.time.now){
                        if(trafficGroup.children[index].isUp){
                            trafficGroup.children[index].setAnimationByName(0,"down",false)
                        }
                        else{
                            trafficGroup.children[index].setAnimationByName(0,"up",false)
                        }
                        trafficGroup.children[index].isUp = !trafficGroup.children[index].isUp
                        trafficGroup.children[index].time = getTimeChangeTrafficLigth()
                        sound.play("trafficChange")
                    }
                }
            }
        }


        for(var index = 0; index < coinsGroup.length; index++){
            if(coinsGroup.children[index].visible && coinsGroup.children[index].active){
                coinsGroup.children[index].y -= moveVelocity

                if(coinsGroup.children[index].y<LIMIT_Y_DESTROY_CUBE){
                    coinsGroup.children[index].visible = false
                    coinsGroup.children[index].animations.stop(null,true)
                }
            }
        }


        if(lastCube.y < LIMIT_Y_CREATE_NEW_RAW){
            nextY = lastCube.y
            if(lastCube.type == CUBE_TYPE.TRAFFIC){
                nextY -=OFFSET_TRAFFIC_CUBE
            }
            setSquaresLine()
        }


        if(canJump){
            yogotar.y -= moveVelocity
            if(yogotar.y < LIMIT_Y_DESTROY_CUBE+DELTA_QUAD){
                fall()
            }
        }
        else{
            var y = squareRaws[0][0].y
            if(squareRaws[0][0].type == CUBE_TYPE.TRAFFIC){
                y -= OFFSET_TRAFFIC_CUBE
            }
            yogotar.x =  lerp(yogotar.x,yogotar.newX,0.1)
            yogotar.y =  lerp(yogotar.y,y + OFFSET_YOGOTAR_CUBE,0.1)

            if(Math.abs(yogotar.y - (y + OFFSET_YOGOTAR_CUBE)) < 10){
                yogotar.x = yogotar.newX
                yogotar.y = y+OFFSET_YOGOTAR_CUBE
                canJump = true
                evaluateJump()
            }
        }

        if(yogotar.inFallinCube!=null){
            if(yogotar.inFallinCube.time < game.time.now){
                fall()
            }
        }
    }

    function restartYogotar(){
        //gameActive = true
        yogotar.inFallinCube = null
        //yogotar.setAnimationByName(0,"idle",true)
        var middleIndex = Math.round((squareRaws[0].length-1)/2)
        yogotar.x = squareRaws[0][middleIndex].x
        yogotar.y = squareRaws[0][middleIndex].y+ OFFSET_YOGOTAR_CUBE
        if(squareRaws[0][middleIndex].type == CUBE_TYPE.TRAFFIC){
            yogotar.y -=OFFSET_TRAFFIC_CUBE
            squareRaws[0][middleIndex].active = false
            if(!squareRaws[0][middleIndex].isUp){
                squareRaws[0][middleIndex].setAnimationByName(0,"up",true)
            }
        }

        if(squareRaws[0][middleIndex].haveCoin!=null){
            Coin(squareRaws[0][middleIndex].haveCoin,pointsBar,300)
        }

        if(squareRaws[0].length == 4){
            nextRawPlus = false
        }
        else{
            nextRawPlus = true
        }
        squareRaws.splice(0,1)
        currentPositionId = middleIndex
        yogotar.visible = false
        setTimeout(blink,TIME_BLINK)
    }

    function blink(){
        if(yogotar.visible){
            yogotar.visible = false
        }
        else{
            yogotar.blink ++
            yogotar.visible = true
            if(yogotar.blink>=BLINK_TIMES){
                gameActive = true
                yogotar.blink = 0
                yogotar.setAnimationByName(0,"idle",true)
                return
            }
        }
        setTimeout(blink,TIME_BLINK)
    }

    function lerp(a,b,t){
        return a + (b - a) * t;
    }

    function updateInput(){
        if(canJump){
            if(game.input.activePointer.isDown){
                if(canTouch){
                    if(game.input.activePointer.x < game.world.centerX){
                        doJump(-1)
                    }
                    else{
                        doJump(1)
                    }
                }
            }
            else{
                canTouch = true
            }

        }
    }

    function doJump(direction){
        if(yogotar.y > game.world.height - DELTA_QUAD){
            return
        }

        yogotar.inFallinCube = null
        yogotar.scale.setTo(direction*1,1)
        yogotar.setAnimationByName(0,"jump",false)
        yogotar.addAnimationByName(0,"idle",true)
        canJump = false
        yogotar.newX = yogotar.x + (direction * (DELTA_QUAD/2))
        yogotar.direction = direction

        sound.play("down")

    }

    function evaluateJump(){
        if(nextRawPlus){
            if(yogotar.direction == -1){
                yogotar.direction = 0
            }

            currentPositionId = currentPositionId + yogotar.direction
            if(currentPositionId<0 || currentPositionId>=squareRaws[0].length){
                //fall
                fall()

            }
            else{
                evaluateCube(squareRaws[0][currentPositionId])
            }
        }else{
            if(yogotar.direction == 1){
                yogotar.direction = 0
            }

            currentPositionId = currentPositionId + yogotar.direction
            if(currentPositionId<0 || currentPositionId>=squareRaws[0].length){
                //fall
                fall()
            }
            else{
                evaluateCube(squareRaws[0][currentPositionId])
            }
        }
    }

    function fall(){
        gameActive = false
        yogotar.setAnimationByName(0,"lose",true)
        var tween = game.add.tween(yogotar).to({y:yogotar.y + game.world.height+OFFSET_YOGOTAR_CUBE},FALLING_TIME,Phaser.Easing.linear,true)
        tween.onComplete.add(restartYogotar)
    }

    function hit(){
        sound.play("punch")
        missPoint()
        gameActive = false
        var anim = yogotar.setAnimationByName(0,"hit",true)
        anim.onComplete = function(){
            console.log(gameActive = true)
            if(lives>0){
                yogotar.setAnimationByName(0,"idle",true)
                gameActive = true
            }
            else{
                 yogotar.setAnimationByName(0,"lose",true)
            }
            
        }
        
    }

    function evaluateCube(cube){
        switch(cube.type){
            case CUBE_TYPE.NOMARL:
            break
            case CUBE_TYPE.FALL:
            yogotar.inFallinCube = cube
            cube.active = true
            cube.time = game.time.now + DELTA_FALL
            break
            case CUBE_TYPE.TRAFFIC:
            if(!cube.isUp){
                cube.setAnimationByName(0,"up",false)
                hit()
            }

            cube.active = false 

            break
        }

        if(cube.haveCoin!=null){
            Coin(cube.haveCoin,pointsBar,300)
        }

        if(squareRaws[0].length == 4){
            nextRawPlus = false
        }
        else{
            nextRawPlus = true
        }
        if(moveVelocity < MAX_VELOCITY){
            moveVelocity += DELTA_VELOCITY
        }
        squareRaws.splice(0,1)



    }
    

    

    function setSquaresLine(){
        nextY += DELTA_RAW
        var initPos =  game.world.centerX - (((nextRawNum - 1)/2)*DELTA_QUAD)
        var rawArray = []
        for(var index =0; index < nextRawNum; index++){
            var cube
            var random = game.rnd.frac()
            if(random < probabilityEnemyCube){
                random = game.rnd.frac()
                if(random <TRAFIC_PROBABILITY){
                    cube = getTrafficCube(initPos + (DELTA_QUAD*index),nextY)
                }
                else{
                    cube = getFallinCube(initPos + (DELTA_QUAD*index),nextY)
                }
            }
            else{
                cube = getNormalCube(initPos + (DELTA_QUAD*index),nextY)
            }
            rawArray.push(cube)

            random = game.rnd.frac()
            if(random < COIN_PROBABILITY){
                var coin = getCoin(initPos + (DELTA_QUAD*index),nextY+OFFSET_COIN)
                cube.haveCoin = coin
            }
            else{
                cube.haveCoin = null
            }

        }

        squareRaws.push(rawArray)

        lastCube = rawArray[rawArray.length-1]

        nextRawNum++
        if(nextRawNum>4){
            nextRawNum = 3
        }
        if(probabilityEnemyCube< MAX_ROBABILITY){
            probabilityEnemyCube += DELTA_PROBABILITY
        }

    }

    function getNormalCube(x,y){
        for(var index =0; index < cubesGroup.length; index++){
            if(!cubesGroup.children[index].visible){
                var cube = cubesGroup.children[index]
                cube.x = x
                cube.y = y
                cube.visible = true
                return cube
            }
        }

        var cube = cubesGroup.create(x,y,"atlas.game","block_normal")
        cube.anchor.setTo(0.5)
        cube.type = CUBE_TYPE.NOMARL
        return cube
    }

    function getFallinCube(x,y){
        for(var index =0; index < fallGroup.length; index++){
            if(!fallGroup.children[index].visible){
                var cube = fallGroup.children[index]

                if(cube.fallingTween != null){
                   cube.fallingTween.stop() 
                }

                cube.x = x
                cube.y = y
                cube.visible = true
                cube.active = false
                cube.time = 0
                cube.isFalling = false



                return cube
            }
        }

        var cube = fallGroup.create(x,y,"atlas.game","block_falling")
        cube.anchor.setTo(0.5)
        cube.type = CUBE_TYPE.FALL
        cube.active = false
        cube.time = 0
        cube.isFalling = false
        return cube
    }

    function getTrafficCube(x,y){
        y += OFFSET_TRAFFIC_CUBE
        for(var index =0; index < trafficGroup.length; index++){
            if(!trafficGroup.children[index].visible){
                var cube = trafficGroup.children[index]
                cube.x = x
                cube.y = y
                cube.visible = true
                cube.setAnimationByName(0,"up",false)
                cube.time = getTimeChangeTrafficLigth()
                cube.isUp = true
                cube.active = true
                trafficGroup.bringToTop(cube)
                return cube
            }
        }

        var cube = game.add.spine(x,y,"cube")
        cube.setSkinByName("normal")
        cube.setAnimationByName(0,"up",false)
        cube.type = CUBE_TYPE.TRAFFIC
        cube.time = getTimeChangeTrafficLigth()
        cube.isUp = true
        cube.active = true
        cube.scale.setTo(0.55)
        trafficGroup.add(cube)
        return cube
    }

    function getCoin(x,y){
         for(var index =0; index < coinsGroup.length; index++){
            if(!coinsGroup.children[index].visible){
                var coin = coinsGroup.children[index]
                coin.visible = true
                coin.alpha = 1
                coin.x = x
                coin.y = y
                coin.animations.play("coin",24,true)
                coin.active = true
                return coin
            }

        }

        var coin = coinsGroup.create(x,y, "coin")
        coin.anchor.setTo(0.5)
        coin.scale.setTo(0.5)
        coin.animations.add("coin");
        coin.animations.play("coin", 24, true);
        coin.active = true
        return coin

    }


    function getTimeChangeTrafficLigth(){
        var time = game.rnd.integerInRange(TRAFFIC_MIN_TIME,TRAFFIC_MAX_TIME)
        time+=game.time.now
        return time
    }

    function createBackground(){

        var background = game.add.graphics(0,0)
        background.beginFill(0x04292b)
        background.drawRect(0,0,game.world.width,game.world.height)
        background.endFill()
        backgroundGroup.add(background)

        var backgroundStars = game.add.tileSprite(0,0,game.world.width,game.world.centerY,"stars")
        backgroundGroup.add(backgroundStars)

        var backgroundImage = game.add.tileSprite(0,game.world.height,game.world.width,828,"atlas.game","background")
        backgroundImage.anchor.setTo(0,1)
        backgroundGroup.add(backgroundImage)

        fallGroup = game.add.group()
        sceneGroup.add(fallGroup)

        cubesGroup = game.add.group()
        sceneGroup.add(cubesGroup)
       
        trafficGroup = game.add.group()
        sceneGroup.add(trafficGroup)

        coinsGroup = game.add.group()
        sceneGroup.add(coinsGroup)

        var initialCube = cubesGroup.create(game.world.centerX, nextY,"atlas.game","block_normal")
        initialCube.anchor.setTo(0.5)


        yogotar = game.add.spine(game.world.centerX, nextY + OFFSET_YOGOTAR_CUBE, "justice")
        yogotar.setSkinByName("normal")
        yogotar.setAnimationByName(0,"idle",true)
        sceneGroup.add(yogotar)
        yogotar.inFallinCube = null
        yogotar.blink = 0

        while(nextY<LIMIT_Y_CREATE_NEW_RAW){
            setSquaresLine()
        }


        correctParticle = createPart('atlas.game','star')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)

        hand = sceneGroup.create(0,0,'atlas.game','handUp')
        hand.anchor.setTo(0.5)
        hand.visible = false


        var leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        leftKey.onDown.add(function(){
            if(canJump && gameActive){
                doJump(-1)
            }
        }, this);


        var rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        rightKey.onDown.add(function(){
        
            if(canJump && gameActive){
                doJump(1)
            }
        }, this);

    }
    

    
    function createScene(){
        //yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        

        backgroundSound = game.add.audio('gameSong')
        game.sound.setDecodedCallback(backgroundSound, function(){
            backgroundSound.loopFull(0.6)
        }, this);
        
        game.onPause.add(function(){
            game.input.enabled = false;
            game.sound.mute = true
        } , this);

        game.onResume.add(function(){
            game.input.enabled = true;
            game.sound.mute = false
        }, this);


        
        initialize()

        createBackground()
        createPointsBar()
        createHearts()
        createTutorial()
    
    }
    
	return {
		assets: assets,
		name: "squaredSquares",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()
