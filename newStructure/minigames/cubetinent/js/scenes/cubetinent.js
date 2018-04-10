var soundsPath = "../../shared/minigames/sounds/"


var cubetinent = function(){

	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/cubetinent/atlas.json",
                image: "images/cubetinent/atlas.png"
            },
        ],
        images: [
            {   name:"tutorial_image",
                file: "images/cubetinent/tutorial_image.png"},
            {   name:"stars",
                file:"images/cubetinent/stars.png"
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
        ],
        spines:[
            {
                name:'luna',
                file:'images/spines/luna/luna.json'
            },
            {
                name:'meteor',
                file:'images/spines/meteor/meteor.json'
            },

		]
    }

    var NUM_LIFES = 3

    var DELTA_BUTTON = 170

    var DELTA_RAW = 105
    //var INITIAL_RAW = 300
    var DELTA_QUAD = 120

    var INITIA_VELOCITY = 1
    var DELTA_VELOCITY = 0.02
    var MAX_VELOCITY = 3

    var LIMIT_Y_CREATE_NEW_RAW

    var LIMIT_Y_DESTROY_CUBE = -100

    var OFFSET_YOGOTAR_CUBE = -30
    var OFFSET_LETTER = -50
    var LETTER_PROBABILITY = 0.3
    var MAX_PROBABILITY_LETTER = 0.6

    var FALLING_TIME = 800
    var BLINK_TIMES = 3
    var TIME_BLINK = 400

    var INITIAL_DIFFICULT = 1.5
    var DELTA_DIFFCULT = 0.1
    var MAX_DIFFICULT = 4

    var DELTA_LETTER_CONTAINER = 50
    var INITIAL_Y

    var CONTINENT_IMAGE_NAMES = ["america", "asia", "europe", "africa", "antratica", "australia"]

    var OFFSET_STROKE = 35
    
    var lives
	var sceneGroup = null
    var gameIndex = 176
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

    var coins

    var inTutorial
    var hand

    var yogotar
    var squareRaws

    var nextY

    var cubesGroup
    var letterGroup
    var containerGroup
    var circleGroup

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

    var planet 

    var lang
    var continentNames

    var currentLetters
    var temporalCorrectLetters
    var totalLetters
    var lettersDifficult

    var currentCircleIndex 
    var tutorialTimeout
    var tutorialNextQuad

    var stroke1, stroke2

    var nextCube1, nextCube2
    var passRawFour

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
        INITIAL_Y = game.world.centerY
        nextY = INITIAL_Y
        INITIAL_Y += OFFSET_YOGOTAR_CUBE
        nextRawNum = 2
        isNextJumpPair = true

        moveVelocity = INITIA_VELOCITY

        LIMIT_Y_CREATE_NEW_RAW = game.world.height
        canTouch = true
        canJump = true
        nextRawPlus = true
        currentPositionId = 0
        currentCircleIndex = 0

        lettersDifficult = INITIAL_DIFFICULT

        passRawFour = false

        lang = localization.getLanguage()
        if(lang == "ES"){
            planetArray = ["AMERICA","ASIA","EUROPE","AFRICA","ANTARTICA","AUSTRALIA"]
        }
        else{
            continentNames = ["AMERICA","ASIA","EUROPA","AFRICA","ANTARTIDA","OCEANIA"]
        }

        loadSounds()
        
	}

    function preload(){
        game.stage.disableVisibilityChange = false;

        game.load.spritesheet("coin", 'images/cubetinent/coin.png', 122, 123, 12)

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


    function Coin(objectBorn,objectDestiny,time){

       coins.x=objectBorn.centerX
       coins.y=objectBorn.centerY
       

       correctParticle.x = objectBorn.x
        correctParticle.y = objectBorn.y
        correctParticle.start(true, 1000, null, 5)

       game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
       game.add.tween(coins).to({y:objectBorn.centerY-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
           game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
               coins.x=objectBorn.centerX
               coins.y=objectBorn.centerY
               addPoint(1)
               setRound()
           })
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
        hand.visible = true
        tutorialNextQuad = squareRaws[0][1]
        hand.x = tutorialNextQuad.x+20
        hand.y = tutorialNextQuad.y
        evalTutorial()

    }

    function createTutorial(){
        
        tutoGroup = game.add.group()

        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

        
    }

    function setRound(){
        for(var i = 0; i < containerGroup.length; i++){
            containerGroup.children[i].visible = false
        }

        for(var i = 0; i < circleGroup.length; i++){
            circleGroup.children[i].visible = false
        }

        

        getWord()


        for(var i = 0; i < letterGroup.length; i++){
            if(letterGroup.children[i].visible){
                var value = getRandomLetter(letterGroup.children[i].correct)
                letterGroup.children[i].text.setText(value)
                letterGroup.children[i].value = value
            }
        }
    }

    function evalTutorial(){
    	
    	hand.loadTexture("atlas.game","handDown")

    	tutorialTimeout = setTimeout(function(){
    		hand.loadTexture("atlas.game","handUp")
    		tutorialTimeout = setTimeout(evalTutorial,500)
    	},500)
    }
    
    function update() {
        if(gameActive){
            updateMove()
            updateInput()
        }
    }


    function updateMove(){


    	if(inTutorial==-1){
	        if(yogotar.y < 0){
	            fall()
	        }
	    }
	    else{
	    	 if(yogotar.y < INITIAL_Y){
	    	 	return
	    	 }
	    }


        for(var index = 0; index < cubesGroup.length; index++){
            if(cubesGroup.children[index].visible){
            	var cube = cubesGroup.children[index]
                cube.y -= moveVelocity

                if(cube.y<LIMIT_Y_DESTROY_CUBE){
                    cube.visible = false
                }
            }
        }


        for(var index = 0; index < letterGroup.length; index++){
            if(letterGroup.children[index].visible && letterGroup.children[index].active){
            	var letter = letterGroup.children[index]
                letter.y -= moveVelocity

                if(letter.y<LIMIT_Y_DESTROY_CUBE){
                    letter.visible = false
                }
            }
        }


        if(lastCube.y < LIMIT_Y_CREATE_NEW_RAW){
            nextY = lastCube.y
            if(LETTER_PROBABILITY < MAX_PROBABILITY_LETTER){
            	LETTER_PROBABILITY+=0.1
            }
            setSquaresLine()
        }

        if(hand.visible){
            hand.x = tutorialNextQuad.x+20
            hand.y = tutorialNextQuad.y
        }

        if(stroke1.visible){
            stroke1.x = nextCube1.x
            stroke1.y = nextCube1.y - OFFSET_STROKE
        }

        if(stroke2.visible){
            stroke2.x = nextCube2.x
            stroke2.y = nextCube2.y - OFFSET_STROKE
        }


        if(canJump){
            yogotar.y -= moveVelocity
        }
        else{
            var y = squareRaws[0][0].y
            
            yogotar.x =  lerp(yogotar.x,yogotar.newX,0.1)
            yogotar.y =  lerp(yogotar.y,y + OFFSET_YOGOTAR_CUBE,0.1)

            if(Math.abs(yogotar.y - (y + OFFSET_YOGOTAR_CUBE)) < 10){
                yogotar.x = yogotar.newX
                yogotar.y = y+OFFSET_YOGOTAR_CUBE
                canJump = true



                if(inTutorial!=-1){
                    hand.visible = true
                }
                evaluateJump()
            }
        }
    }

    function setNextStroke(){
        stroke1.visible = true
        stroke2.visible = true
        if(squareRaws[0].length==4){
            passRawFour =  true
            nextCube1 = squareRaws[0][currentPositionId]
            nextCube2 = squareRaws[0][currentPositionId+1]
        }
        else if(squareRaws[0].length==3){
            if(passRawFour){
                if(currentPositionId>0){
                    nextCube1 = squareRaws[0][currentPositionId-1]
                }
                else{
                    stroke1.visible = false
                    nextCube1 = null
                }

                if(currentPositionId<3){
                    nextCube2 = squareRaws[0][currentPositionId]
                }
                else{
                    stroke2.visible = false
                    nextCube2 = null
                }
            }
            else{
                nextCube1 = squareRaws[0][currentPositionId]
                nextCube2 = squareRaws[0][currentPositionId+1]
            }
        }


        if(stroke1.visible){
            stroke1.x = nextCube1.x
            stroke1.y = nextCube1.y - OFFSET_STROKE
        }

        if(stroke2.visible){
            stroke2.x = nextCube2.x
            stroke2.y = nextCube2.y - OFFSET_STROKE
        }

    }

    function fall(){
        gameActive = false
        missPoint()
        yogotar.setAnimationByName(0,"lose",true)
        var tween = game.add.tween(yogotar).to({y:yogotar.y + game.world.height+OFFSET_YOGOTAR_CUBE},FALLING_TIME,Phaser.Easing.linear,true)
        tween.onComplete.add(restartYogotar)
    }

    function restartYogotar(){
        //gameActive = true
        yogotar.inFallinCube = null
        //yogotar.setAnimationByName(0,"idle",true)

        if(squareRaws[0].length == 4){
        	squareRaws.splice(0,1)
            nextRawPlus = true
        }
        else{
            nextRawPlus = true
        }

        var middleIndex = Math.round((squareRaws[0].length-1)/2)
        yogotar.x = squareRaws[0][middleIndex].x
        yogotar.y = squareRaws[0][middleIndex].y+ OFFSET_YOGOTAR_CUBE
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
                    
                    if(Math.abs(game.input.activePointer.x - yogotar.x) < DELTA_QUAD){

                        if(game.input.activePointer.x < yogotar.x){
                            doJump(-1)
                        }
                        else{
                            doJump(1)
                        }
                    }
                }
            }
            else{
                canTouch = true
            }

        }
    }

    function doJump(direction){

        if(yogotar.y > game.world.height - (DELTA_QUAD*2)){
            return
        }

        stroke1.visible = false
        stroke2.visible = false

        if(inTutorial!=-1){

        	if(!((hand.x > yogotar.x && direction==1) || (hand.x < yogotar.x && direction==-1))){
        		return
        	}

            
        	if(yogotar.y < INITIAL_Y){
        		yogotar.y = INITIAL_Y
        	}
        }

        if(hand.visible){
        	inTutorial++
            hand.visible = false
            switch(inTutorial){
                case 6:
                id = 1
                break
                case 7:
                id = 1
                break
                case 8:
                id = 2
                break
                case 9:
                hand.visible = false
                inTutorial = -1
                return
                break
            }

            if(inTutorial!=-1){
                tutorialNextQuad = squareRaws[1][id]
                hand.x = tutorialNextQuad.x+20
                hand.y = tutorialNextQuad.y
            	clearTimeout(tutorialTimeout)
            	evalTutorial()
            }
           
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
                setNextStroke()
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
                setNextStroke()
            }
        }
    }

    function hit(){
        sound.play("punch")
        missPoint()
        gameActive = false
        var anim = yogotar.setAnimationByName(0,"hit",true)
        anim.onComplete = function(){
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
       
        if(cube.haveLetter!=null){
            var correct = false
            for(var i = 0; i < currentLetters.length; i ++){
                //console.log(cube.haveLetter.value)
                if(cube.haveLetter.value == currentLetters[i].letter){
                    currentLetters[i].circle.visible = false
                    currentLetters[i].text.setText(currentLetters[i].letter)
                    correct = true
                    currentLetters.splice(i,1)
                    if(currentLetters.length == 0){
                        gameActive = false
                        var anim = yogotar.setAnimationByName(0,"win",false)
                        anim.onComplete = function(){
                            yogotar.setAnimationByName(0,"idle",true)
                            gameActive = true
                        }
                        Coin({x:game.world.centerX,y:game.world.height-60},pointsBar,100)
                    }
                    else{
                        temporalCorrectLetters = currentLetters.slice()
                    }
                }
            }

            cube.haveLetter.visible = false

            if(!correct){
                hit()
            }

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
        var canGetLetter = false
        var nextLetterCorrect = null
        if(nextRawNum == 2 || nextRawNum == 4){
            canGetLetter = true
        }


        for(var index =0; index < nextRawNum; index++){
            var cube
            
            cube = getNormalCube(initPos + (DELTA_QUAD*index),nextY)
            cube.haveLetter = null
            cube.correctLetter = false
            rawArray.push(cube)

            random = game.rnd.frac()
            if(canGetLetter){

                if(currentLetters.length==0){
                     cube.haveLetter = null
                     continue
                }

                if(random < LETTER_PROBABILITY || nextRawNum == 2 || (inTutorial!=-1 && inTutorial<6)){
                    var correct
                    if(nextLetterCorrect!=null){
                        correct = !nextLetterCorrect
                        nextLetterCorrect = null
                    }
                    else{
                        var random = game.rnd.frac()
                        if(random <0.5){
                            correct = false
                        }
                        else{
                            correct = true
                        }
                        nextLetterCorrect = correct
                    }

                    if(inTutorial!=-1 && inTutorial<6){
                    	switch(inTutorial){
                    		case 0:
                    		correct = false
                    		break
                    		case 1:
                    		correct = true
                    		break
                    		case 2:
                    		correct = false
                    		break
                    		case 3:
                    		correct = false
                    		break
                    		case 4:
                    		correct = true
                    		break
                    		case 5:
                    		correct = false
                    		break
                    	}
                    	inTutorial++
                    }

                    var value = getRandomLetter(correct)
                    var letter = getLetter(initPos + (DELTA_QUAD*index), nextY+OFFSET_LETTER, value)
                    cube.haveLetter = letter
                    letter.correct = correct
                }
                else{
                    cube.haveLetter = null
                }
            }

        }

        squareRaws.push(rawArray)

        lastCube = rawArray[rawArray.length-1]

        nextRawNum++
        if(nextRawNum>4){
            nextRawNum = 3
        }

    }

    function getRandomLetter(correct){
        if(correct){
        	if(temporalCorrectLetters.length == 0){
                temporalCorrectLetters = currentLetters.slice()
            }
            var index = game.rnd.integerInRange(0,temporalCorrectLetters.length-1)
            var value = temporalCorrectLetters[index].letter
            temporalCorrectLetters.splice(index,1)

            if(temporalCorrectLetters.length == 0){
                temporalCorrectLetters = currentLetters.slice()
            }
            return value
        }
        else{
            return totalLetters[game.rnd.integerInRange(0,totalLetters.length-1)]
        }
    }

    function removeLetter(letter){
    	for(var i = 0; i < temporalCorrectLetters; i ++){
    		if(temporalCorrectLetters[i].letter == letter){
    			temporalCorrectLetters.splice(i,1)
    			break
    		}
    	}

    	for(var i = 0; i < currentLetters; i ++){
    		if(currentLetters[i].letter == letter){
    			currentLetters.splice(i,1)
    			break
    		}
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

        var cube = cubesGroup.create(x,y,"atlas.game","cube")
        cube.anchor.setTo(0.5)
        return cube
    }

    
    function getLetter(x,y,value){
         for(var index =0; index < letterGroup.length; index++){
            if(!letterGroup.children[index].visible){
                var letter = letterGroup.children[index]
                letter.visible = true
                letter.alpha = 1
                letter.x = x
                letter.y = y
                letter.active = true
                letter.text.setText(value)
                letter.value = value
                return letter
            }

        }

        var letter = letterGroup.create(x,y,"atlas.game", "letter_container")
        letter.anchor.setTo(0.5)
        //letter.scale.setTo(0.5)
        letter.active = true
        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var letterText = new Phaser.Text(sceneGroup.game, 0, 0, value, fontStyle)
        letterText.anchor.setTo(0.5)
        letter.addChild(letterText)
        letter.text = letterText
        letter.value = value
        return letter

    }

    function getWord(){
        var index = game.rnd.integerInRange(0,continentNames.length-1)
        var continent = continentNames[index]
        planet.loadTexture("atlas.game",CONTINENT_IMAGE_NAMES[index],0,false)   
        game.add.tween(planet.scale).to({x:1.2,y:1.2},400,Phaser.Easing.linear,true).yoyo(true)  
        var letters = continent.split("")
        currentLetters = []
        totalLetters = []
        temporalCorrectLetters = []
        currentCircleIndex = 0
        var temp = []
        for(var i = 0; i < letters.length; i++){
            temp.push({letter:letters[i],id:i})
        }
        var difficult = Math.round(lettersDifficult)
        for(var i = 0; i < lettersDifficult; i++){
            var index = game.rnd.integerInRange(0,temp.length-1)
            currentLetters.push({letter:temp[index].letter,id: temp[index].id})
            
            letters[temp[index].id] = "?"
            temp.splice(index,1)
        }

        //console.log(letters)
        //console.log(temp)

        var initX = game.world.centerX - (((letters.length-1)/2)*DELTA_LETTER_CONTAINER) 
        for(var i =0 ; i < letters.length;i++){
            pushContainerLetter(initX + (DELTA_LETTER_CONTAINER*i),letters[i])
            if(letters[i]!="?"){


                totalLetters.push(letters[i])
            }
        }
        temporalCorrectLetters = currentLetters.slice(0)

        if(lettersDifficult < MAX_DIFFICULT){
        	lettersDifficult+=DELTA_DIFFCULT
        }

    }

    function pushContainerLetter(x,value){

        for(var index =0; index < containerGroup.length; index++){
            if(!containerGroup.children[index].visible){
                var containerLetter = containerGroup.children[index]
                containerLetter.visible = true
                containerLetter.x = x
                containerLetter.setText(value)

                if(value == "?"){
                    for(var i = 0; i < currentLetters.length; i++){
                        if(currentLetters[i].id == index){
                            currentLetters[i].circle = getCircle(x)
                            currentLetters[i].text = containerLetter
                            setTween(containerLetter)


                            break
                        }
                    }
                    
                }

                return 
            }
        }

        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var containerLetter = new Phaser.Text(sceneGroup.game, x, 0, value, fontStyle)
        containerLetter.anchor.setTo(0.5)

        containerGroup.add(containerLetter)

        if(value == "?"){
            for(var i = 0; i < currentLetters.length; i++){
                if(currentLetters[i].id == index){
                    currentLetters[i].circle = getCircle(x)
                    setTween(containerLetter)
                    currentLetters[i].text = containerLetter
                }
                
            }
            
        }
        return

    }

    function setTween(letterObject){
        var tween1 = game.add.tween(letterObject).to({angle:-30},200,Phaser.Easing.linear)
        var tween2 = game.add.tween(letterObject).to({angle:30},400,Phaser.Easing.linear)
        var tween3 = game.add.tween(letterObject).to({angle:-30},400,Phaser.Easing.linear)
        var tween4 = game.add.tween(letterObject).to({angle:0},200,Phaser.Easing.linear)



        tween1.chain(tween2)
        tween2.chain(tween3)
        tween3.chain(tween4)

        tween1.start()

    }

    function getCircle(x){
        for(var index =0; index < circleGroup.length; index++){
            if(!circleGroup.children[index].visible){
                var circle = circleGroup.children[index]
                circle.visible = true
                circle.x = x
                return circle
            }
        }

        var circle = game.add.graphics(0,0)
        circle.beginFill(0xff0000)
        circle.drawCircle(0,0,45)
        circle.endFill()

        circle.x = x
        circle.y = -5

        circleGroup.add(circle)
        return circle
    }


    function createBackground(){

        var background = game.add.graphics(0,0)
        background.beginFill(0x04292b)
        background.drawRect(0,0,game.world.width,game.world.height)
        background.endFill()
        backgroundGroup.add(background)


        var backgroundImage = game.add.tileSprite(0,game.world.height,game.world.width,game.world.height,"atlas.game","space")
        backgroundImage.anchor.setTo(0,1)
        backgroundGroup.add(backgroundImage)

        var backgroundStars = game.add.tileSprite(0,0,game.world.width,game.world.height,"stars")
        backgroundGroup.add(backgroundStars)


        cubesGroup = game.add.group()
        sceneGroup.add(cubesGroup)

        stroke1 = sceneGroup.create(-200,0,"atlas.game","stroke_white")
        stroke1.anchor.setTo(0.5)

        stroke2 = sceneGroup.create(-200,0,"atlas.game","stroke_white")
        stroke2.anchor.setTo(0.5)

        letterGroup = game.add.group()
        sceneGroup.add(letterGroup)

        var initialCube = cubesGroup.create(game.world.centerX, nextY,"atlas.game","cube")
        initialCube.anchor.setTo(0.5)

        


        yogotar = game.add.spine(game.world.centerX, nextY + OFFSET_YOGOTAR_CUBE, "luna")
        yogotar.setSkinByName("normal")
        yogotar.setAnimationByName(0,"idle",true)
        sceneGroup.add(yogotar)
        yogotar.inFallinCube = null
        yogotar.blink = 0

        planet = sceneGroup.create(game.world.width - 150, 150, "atlas.game","america")
        planet.anchor.setTo(0.5)
        planet.scale.setTo(0.7)

        var wordContainer = game.add.tileSprite(game.world.centerX, game.world.height,game.world.width,117, "atlas.game","word_container")
        wordContainer.anchor.setTo(0.5,1)
        sceneGroup.add(wordContainer)

        circleGroup = game.add.group()
        sceneGroup.add(circleGroup)
        circleGroup.y = game.world.height - 60
        //circleGroup.x = game.world.centerX

        containerGroup = game.add.group()
        sceneGroup.add(containerGroup)
        containerGroup.y = game.world.height - 60
        //containerGroup.x = game.world.centerX

        getWord()

        while(nextY<LIMIT_Y_CREATE_NEW_RAW){
            setSquaresLine()
        }

        nextCube1 = squareRaws[0][0]

        stroke1.x = nextCube1.x
        stroke1.y = nextCube1.y - OFFSET_STROKE

        nextCube2 = squareRaws[0][1]

        stroke2.x = nextCube2.x
        stroke2.y = nextCube2.y - OFFSET_STROKE



        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0

        correctParticle = createPart('atlas.game','star')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)

        hand = sceneGroup.create(0,game.world.centerY+100,'atlas.game','handUp')
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
		name: "cubetinent",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()
