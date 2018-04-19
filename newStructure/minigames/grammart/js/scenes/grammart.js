
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var grammart = function(){

	var assets = {
        atlases: [
            {
                name: "atlas.game",
                json: "images/grammart/atlas.json",
                image: "images/grammart/atlas.png"
            },
            {
                name: "atlas.time",
                json: "images/grammart/timeAtlas.json",
                image: "images/grammart/timeAtlas.png"
            },

        ],
        images: [
			{
				name:'tutorial_image',
				file:"images/grammart/tutorial_image_%input.png"
			},
			{
				name:'tutorial_desktop',
				file:"images/grammart/flechitas.png"
			},
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
		],
		spines:[
			{
				name:"luna",
				file:"images/spine/luna/luna.json"
			}
		]
    }

    var NUM_LIFES = 3

    var NUM_LANES = 3
    var TOP_LANE_Y = 565
    var LANE_HEIGHT = 150
    var NUM_OBJECTS = 50
    var DISTANCE_BETWEEN = 500
    var DELTA_LETTER = 40
    var INITIAL_DIFFICULT = 1
    var MAX_DIFFICUT = 3
    var DELTA_DIFFICULT = 0.2

    var INITIAL_TIME = 8000
    var DELTA_TIME = 500
    var MIN_TIME = 1000
    var LEVLES_TO_TIMER = 6

    var ROUNDS = [
        {cono: 2, caution:3, operator:"+", maxNumber:5},
        {cono: 2, caution:4, operator:"+", maxNumber:5},
        {cono: 2, caution:7, operator:"+", maxNumber:5}]
    var OBJECTS = [{image:"caution", event:"hit"},{image:"cono", event:"hit"}]

    var NAMES = {
        "EN":[
            "RESTAURANT",
            "LIBRARY",
            "SUPERMARKET",
            "PASTELERIA",
            "COFFEE",
            "PET STORE",
            "OUTLET",
            "ICECREAM",
            "PAWN SHOP",
            "VIDEOGAMES",
            "OTRO VIDEO",
            "SHOES STORE",
            "BANK",
            "DRUG STORE",
            "SHOTGUN",
            "CINEMA",
            "PHONE",
            "MUSIC STORE",
        ],

        "ES":[
            "RESTAURANT",
            "LIBRARY",
            "SUPERMARKET",
            "PASTELERIA",
            "COFFEE",
            "PET STORE",
            "OUTLET",
            "ICECREAM",
            "PAWN SHOP",
            "VIDEOGAMES",
            "OTRO VIDEO",
            "SHOES STORE",
            "BANC",
            "DRUG STORE",
            "SHOTGUN",
            "CINEMA",
            "PHONE",
            "MUSIC STORE",
        ]
    }

    var lives
	var sceneGroup = null
    var gameIndex = 191
    var tutoGroup
    var heartsGroup = null
    var pullGroup = null
    var clock
    var timeValue
    var quantNumber
    var inputsEnabled
    var pointsBar
    var roundCounter
    var floor
    var luna
    var swipe
    var runnerMode
    var stores
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
    var lang
    var fontStyleStore
    var currentStore
    var correctLetters
    var currentDifficult
    var posibleLetters
    var currentRound, roundsNeed
    var hiddenLetters
    var initialTilePosition
    var iconsGroup
    var hand
    var inTutorial
    var tutorialTimeOut

    var tutorialObstacle
    var inDesktop, flechitas
    var canTutorialRun

    var timeOn = false
    var clock, tweenTiempo, timeBar

    var currentLevel = 0
    var currentTime

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
        correctLetters = []
        currentDifficult = INITIAL_DIFFICULT

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        inputsEnabled = false
        distance = 0
        currentDistance = 0
        speed = 4
        canSwipe = false
        inTutorial = 0
        lang = localization.getLanguage()
        fontStyleStore = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        canTutorialRun = true
        loadSounds()

        currentTime = INITIAL_TIME
        currentLevel = 0
        timeOn = false
        canTouch = false


	}

	function initLetters(){
		posibleLetters = []
		for(var i = 0; i <= 25; i ++){
			posibleLetters.push(String.fromCharCode(65+i))
		}
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
            var object = pullGroup.create(0,0,'atlas.game',objectData.image)
            object.anchor.setTo(0.5, 0.5)
            object.event = objectData.event
            objectList.push(object)
            object.name = objectData.image
        }

    }

    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.game',key);
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
           })
       })
    }

    function positionTimer(){
      clock=game.add.image(game.world.centerX-150,40,"atlas.game","clock")
      clock.scale.setTo(.7)
      timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.game","bar")
      timeBar.scale.setTo(8,.45)
      sceneGroup.add(clock)
      sceneGroup.add(timeBar)
      timeBar.alpha=1
      clock.alpha=1
    }

    function stopTimer(){
        if(tweenTiempo){
          tweenTiempo.stop()
      }
      tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, 500, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
      	if(lives>0){
      		startTimer(currentTime)
      	}
      })
    }

    function startTimer(time){
       tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
       tweenTiempo.onComplete.add(function(){
           missPoint()
           stopTimer()
       })
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


        var round = ROUNDS[roundCounter] ? ROUNDS[roundCounter] : ROUNDS[ROUNDS.length - 1]
        console.log(round)
        speed = speed + roundCounter

        inputsEnabled = true
        objectList = Phaser.ArrayUtils.shuffle(objectList)

        addObjects(round)
        roundCounter++

        if(currentLevel > LEVLES_TO_TIMER){
        	if(!timeOn){
        		timeOn = true
        		positionTimer()
        	}

        	startTimer(currentTime)

        	if(currentTime > MIN_TIME){
        		currentTime-=DELTA_TIME
        	}
        }

    }


    function setWord(){
    	initLetters()
    	hiddenLetters = []
    	currentRound = 0
    	correctLetters = []
        var index = game.rnd.integerInRange(0,NAMES[lang].length-1)

        for(var i = 0; i < iconsGroup.length; i++){
        	iconsGroup.children[i].loadTexture("atlas.game","icon"+(index+1))
        }

        currentStore = NAMES[lang][index]
        
        var difficult = Math.round(currentDifficult)
        roundsNeed = difficult
        if(currentDifficult < MAX_DIFFICUT){
        	currentDifficult+=DELTA_DIFFICULT
        }
        var tempIndex = []
        for(var i = 0; i < currentStore.length; i++){
        	tempIndex.push(i)
        }

        for(var i = 0; i < difficult; i++){
        	var indexRandom = game.rnd.integerInRange(0,tempIndex.length-1)
        	var same = false
        	if(currentStore[tempIndex[indexRandom]] == " "){
        		i--
        		continue
        	}
        	for(var j = 0; j < correctLetters.length; j++){
        		if(currentStore[correctLetters[j]] == currentStore[tempIndex[indexRandom]]){
        			same = true
        		}
        	}
        	if(same){
        		i--
        		continue
        	}
        	else{
        		var index = posibleLetters.indexOf(currentStore[tempIndex[indexRandom]])
        		posibleLetters.splice(index,1)
        	}

        	correctLetters.push(tempIndex[indexRandom])
        	tempIndex.splice(indexRandom,1)

        }
        


        var initX = -((currentStore.length-1)/2)*DELTA_LETTER
        for(var i = 0; i< currentStore.length; i++){
        	var hidden = false
        	for(var j = 0; j < correctLetters.length; j++){
	        	if(i==correctLetters[j]){
	        		hidden = true
	        	}
	        	
        	}
        	if(hidden){
        		var letter = getLetter(initX+(i*DELTA_LETTER),"?")
        		hiddenLetters.push(letter)

        	}
        	else{
        		getLetter(initX+(i*DELTA_LETTER),currentStore[i])
        	}
        }

        fillBlocks()
    }

    function fillBlocks(){
    	var currentCorrectIndex = correctLetters[currentRound]
    	var randomPosition = game.rnd.integerInRange(0,NUM_LANES-1)

    	for(var blockIndex = 0; blockIndex < NUM_LANES; blockIndex++){
    		if(blockIndex == randomPosition){
    			blocksGroup.children[blockIndex].text.setText(currentStore[currentCorrectIndex])
    			blocksGroup.children[blockIndex].value = currentStore[currentCorrectIndex]
    			if(inTutorial!=-1){
        			hand.x = blocksGroup.x + 50
        			hand.y = blocksGroup.children[blockIndex].y + 50
        		}
    		}
    		else{
    			var randomLetter = game.rnd.integerInRange(0,posibleLetters.length-1)
    			blocksGroup.children[blockIndex].text.setText(posibleLetters[randomLetter])
    			posibleLetters.splice(randomLetter,1)
    			blocksGroup.children[blockIndex].value = posibleLetters[randomLetter]
    		}
    	}

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

        var heartImg = group.create(0,0,'atlas.game','life_box')

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
        inputsEnabled = true
        evalTutorial()
    }

    function createTutorial(){

        tutoGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

    }
    
    function changeLane() {
    	if(inTutorial!=-1){
    		inTutorial = -1
    		clearTimeout(tutorialTimeOut)
    		hand.visible = false
    		flechitas.visible = false
    		canTutorialRun = true
    		
    	}
        sound.play("cut")
        var toY = TOP_LANE_Y + LANE_HEIGHT * (luna.currentLane - 1) + 50
        game.add.tween(luna).to({y:toY}, 500, Phaser.Easing.Cubic.Out, true)
    }
    
    function checkAnswer(block) {

    	if(lives < 0){
    		return
    	}

        if(inputsEnabled){

        	if(inTutorial!=-1){
        		if (block.value != currentStore[correctLetters[currentRound]]) {
        			return
        		}
        	}

            block.inputEnabled = false
            var tween = game.add.tween(blocksGroup).to({alpha:0}, 600, Phaser.Easing.Cubic.Out, false, 750)
            var buttonEffect = game.add.tween(block.scale).to({x: 1.2, y: 1.2}, 300, Phaser.Easing.Cubic.Out, true)

            buttonEffect.onComplete.add(function () {
                game.add.tween(block.scale).to({x: 1, y: 1}, 300, Phaser.Easing.Cubic.In, true)
            })

            if (block.value === currentStore[correctLetters[currentRound]]) {
                particleCorrect.x = block.x + blocksGroup.x
                particleCorrect.y = block.y

                particleCorrect.start(true, 1000, null, 3);
                tweenTint(block, 0xffffff, 0x46FF46, 500)
                luna.setAnimation(["CORRECT","IDLE"])
                sound.play("win")


                if(inTutorial!=-1){
                	inTutorial++
                	hand.visible = false
                	clearTimeout(tutorialTimeOut)
                }

                inputsEnabled = false
                tween.start()
                addPoint(1)
                hiddenLetters[currentRound].setText(block.value+" ")
                currentRound ++
                if(currentRound < roundsNeed){
                	block.inputEnabled = true
                	tween.onComplete.add(function(){
                		inputsEnabled=true
                		fillBlocks()
                		block.tint = 0xFFFFFF
                		game.add.tween(blocksGroup).to({alpha:1}, 600, Phaser.Easing.Cubic.Out, true, 750)

                	})
                	
                }
                else{
                	for(var i = 0; i < blocksGroup.length; i++){
                		blocksGroup.children[i].inputEnabled = false
                	}

                	if(timeOn){
                		stopTimer()
                	}

                	inputsEnabled = true
	                tween.onComplete.add(function () {
	                	
	                    luna.setAnimation(["RUN"])
	                    runnerMode = true
	                    canSwipe = true

	                })
	            }

                

            }else{

                tweenTint(block, 0xffffff, 0xff5151, 500)
                missPoint()
                if (lives === 0)
                    luna.setAnimation(["LOSE"])
                else
                    luna.setAnimation(["WRONG","IDLE"])

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
            var block = blocksGroup.create(0, 0,'atlas.game','cuadrado')
            block.y = TOP_LANE_Y + (LANE_HEIGHT * blockIndex)
            block.anchor.setTo(0.5, 0.5)
            //blocksGroup.add(block)

            var text = new Phaser.Text(game, 0,  10, "0", fontStyle)
            text.anchor.setTo(0.5, 0.5)
            //blocksGroup.add(text)
            block.addChild(text)
            block.text = text
            block.number = 0
            block.inputEnabled = true

            block.events.onInputDown.add(checkAnswer)
            blocksGroup.blocks.push(block)
        }

    }

    function createBoard(){
        boardGroup = game.add.group()
        boardGroup.x = game.world.centerX
        boardGroup.y = game.world.centerY - 300
        sceneGroup.add(boardGroup)

        boardGroup.answer = 0

        iconsGroup = game.add.group()
        iconsGroup.x = game.world.centerX
        iconsGroup.y = game.world.centerY - 100
        sceneGroup.add(iconsGroup)

        var icon = iconsGroup.create(-40,0,"atlas.game","icon1")
        icon.anchor.setTo(0.5)
        icon.scale.setTo(0.6)
        icon = iconsGroup.create(60,0,"atlas.game","icon1")
        icon.anchor.setTo(0.5)
        icon.scale.setTo(0.6)
        icon = iconsGroup.create(-370,-20,"atlas.game","icon1")
        icon.anchor.setTo(0.5)
        icon.scale.setTo(0.6)
        icon = iconsGroup.create(370,-20,"atlas.game","icon1")
        icon.anchor.setTo(0.5)
        icon.scale.setTo(0.6)



    }


    function getLetter(x,letter){
    	for(var i = 0; i < boardGroup.length; i++){
    		if(!boardGroup.children[i].visible){
    			var l = boardGroup.children[i]
    			l.setText(letter)
    			l.visible = true
    			l.x = x
    			
    			return l
    		}
    	}

    	var name = new Phaser.Text(game, x, 0, letter+" ", fontStyleStore)
        name.anchor.setTo(0.5, 0.5)
        name.setShadow(5, 5, 'rgba(83,35,186,0.5)');
        //name.setShadow(5, 5, 'rgba(0,0,0, 0.5)');
        
        boardGroup.add(name)

        return name
    }
    
    function removeObjects() {
        for(var objectIndex = 0; objectIndex < gameGroup.objects.length; objectIndex++){
            var object = gameGroup.objects[objectIndex]
            gameGroup.remove(object)
            pullGroup.add(object)
        }
    }
    
    function addObjects(round) {
        var objectsNumber = round.cono + round.caution
        var counters = {cono:0, caution:0}
        gameGroup.objects = []
        distance = game.world.width + 100 + (DISTANCE_BETWEEN * objectsNumber)
        var offset = (distance % 1122)
        distance += (1122 - offset)


        for(var objectIndex = 0; objectIndex < objectList.length; objectIndex++){
            var object = objectList[objectIndex]

            if(counters[object.name] < round[object.name] ) {
                object.x = game.width + DISTANCE_BETWEEN * gameGroup.objects.length + 100
                var randomLane = game.rnd.integerInRange(1, NUM_LANES)

                if(inTutorial!=-1){
                	if(objectIndex == 0){
                		randomLane = 2
                		tutorialObstacle = object
                	}
                }

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
        luna = game.add.group()
        luna.x = 150
        luna.y = TOP_LANE_Y + LANE_HEIGHT + 50
        sceneGroup.add(luna)

        var lunaSpine = game.add.spine(0, 0, "luna")
        lunaSpine.x = 0; lunaSpine.y = 0
        lunaSpine.scale.setTo(0.8,0.8)
        lunaSpine.setSkinByName("normal")
        lunaSpine.setAnimationByName(0, "IDLE", true)
        lunaSpine.currentLane = 2
        luna.add(lunaSpine)

        var hitBox = new Phaser.Graphics(game)
        hitBox.beginFill(0xFFFFFF)
        hitBox.drawRect(0,0,100, 100)
        hitBox.alpha = 0
        hitBox.endFill()
        hitBox.x = -hitBox.width * 0.5
        hitBox.y = -hitBox.height
        luna.add(hitBox)
        luna.hitBox = hitBox
        
        luna.setAnimation = function (animations, loop) {
            lunaSpine.setAnimationByName(0, animation, loop)
            if(!loop){
                lunaSpine.addAnimationByName(0, "IDLE", true)
            }
            for(var index = 0; index < animations.length; index++) {
                var animation = animations[index]
                var loop = index == animations.length - 1
                if (index === 0)
                    lunaSpine.setAnimationByName(0, animation, loop)
                else
                    lunaSpine.addAnimationByName(0, animation, loop)
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
        var secondAnimation = lives > 0 ? "RUN" : "LOSE"
        luna.setAnimation(["WRONG", secondAnimation])
        var toX = (-object.world.x + luna.x) + 300
        currentDistance -= toX
        game.add.tween(floor.tilePosition).to({x: floor.tilePosition.x + toX}, 800, Phaser.Easing.Cubic.Out, true)
        game.add.tween(stores.tilePosition).to({x: stores.tilePosition.x + toX}, 800, Phaser.Easing.Cubic.Out, true)
        game.add.tween(boardGroup).to({x: boardGroup.x + toX}, 800, Phaser.Easing.Cubic.Out, true)
        game.add.tween(iconsGroup).to({x: iconsGroup.x + toX}, 800, Phaser.Easing.Cubic.Out, true)
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

        object.x = object.world.x - luna.x
        object.y = object.world.y - luna.y
        luna.add(object)

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
                        luna.currentLane = luna.currentLane - 1 > 0 ? luna.currentLane - 1 : 1
                        changeLane()
                        break;
                    case swipe.DIRECTION_DOWN:
                        luna.currentLane = luna.currentLane + 1 <= NUM_LANES ? luna.currentLane + 1 : NUM_LANES
                        changeLane()
                        break;
                }
            }
        }


        if(runnerMode && canTutorialRun) {

            floor.tilePosition.x -= speed
            stores.tilePosition.x -= speed
            boardGroup.x -= speed
            blocksGroup.x -= speed
            gameGroup.x -= speed
            currentDistance += speed
            iconsGroup.x-=speed

            if (boardGroup.x < 0 - boardGroup.width){
                var diffDistance = distance - currentDistance
                boardGroup.x = diffDistance + game.world.centerX
                blocksGroup.x = diffDistance + game.width - 100
                iconsGroup.x = diffDistance + game.world.centerX
                blocksGroup.alpha = 1
                //generateQuestion()

                for(var i = 0; i < boardGroup.length; i++){
                	boardGroup.children[i].visible = false
                }

                for(var i = 0; i < blocksGroup.length; i++){
                	blocksGroup.children[i].tint = 0xFFFFFF
                	blocksGroup.children[i].inputEnabled = true
                }

                setWord()
            }



            // timeElapsed += game.time.elapsedMS

            for(var objectIndex = 0; objectIndex < gameGroup.objects.length; objectIndex++){
                var object = gameGroup.objects[objectIndex]
                var isCollision = checkOverlap(object, luna.hitBox)
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

            if(inTutorial!=-1){
            	var m = Math.abs(tutorialObstacle.world.x - luna.x)
	            if(m < 300){
	            	canTutorialRun = false
	            	hand.visible = true
	            	evalTutorial()
	            }
	        }

            if (distance <= currentDistance){
            	//if(stores.tilePosition.x < initialTilePosition){
        		stores.tilePosition.x = initialTilePosition
                runnerMode = false
                canSwipe = true
                inputsEnabled = true
                currentDistance = 0
                gameGroup.x = 0
                luna.setAnimation(["IDLE"], true)
                removeObjects()
                startRound()
	            //}
            }
        }
    }

    function evalTutorial(){

    	hand.visible = true
    	switch(inTutorial){
    		case 0:
	    	hand.loadTexture("atlas.game","handDown")
	    	tutorialTimeOut = setTimeout(function(){
	    		hand.loadTexture("atlas.game","handUp")
	    		tutorialTimeOut = setTimeout(evalTutorial,500)
	    	},500)
	    	break
	    	case 1:
	    	if(inDesktop){
	    		flechitas.visible = true
	    		hand.y = game.world.centerY + (60*hand.up) + 20
	    		hand.x = game.world.width - 150
	    		hand.loadTexture("atlas.game","handDown")
	    		tutorialTimeOut = setTimeout(function(){
	    			hand.up *=-1
		    		hand.loadTexture("atlas.game","handUp")
		    		tutorialTimeOut = setTimeout(evalTutorial,500)
		    	},500)
	    	}
	    	else{
	    		hand.y = game.world.centerY - 100
	    		hand.x = game.world.width - 200
	    		hand.loadTexture("atlas.game","handDown")
	    		game.add.tween(hand).to({y:game.world.centerY + 100},500,Phaser.Easing.linear,true).onComplete.add(function(){
	    			hand.loadTexture("atlas.game","handUp")
	    			tutorialTimeOut = setTimeout(evalTutorial,500)
	    		})
	    	}
	    	break
	    }
    }

	return {
		assets: assets,
		name: "grammart",
        preload:preload,
        update:update,
		getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){

            swipe = new Swipe(game)
		    sceneGroup = game.add.group(); //yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

            var sky = game.add.graphics()
            sky.beginFill(0x86C5FC)
            sky.drawRect(0,0,game.world.width,300)
            sky.endFill()
            sceneGroup.add(sky)

            floor = game.add.tileSprite(0,game.world.height,game.world.width,game.world.centerY,"atlas.game",'tilepiso')
            floor.anchor.setTo(0,1)
            sceneGroup.add(floor)

            floor.tilePosition.y = 30

            stores = game.add.tileSprite(0,game.world.centerY +50,game.world.width,502,"atlas.game",'tile')
            //stores = game.add.sprite(game.world.centerX,game.world.centerY +100,"atlas.game",'tile')
            stores.anchor.setTo(0,1)
            stores.scale.setTo(1,0.8)
            //var porcentage = 
            initialTilePosition = -(1122/2) + game.world.centerX
            stores.tilePosition.x = initialTilePosition
            //console.log(initialTilePosition)
            sceneGroup.add(stores)



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
            createGameObjects()
            createSpine()
            flechitas = sceneGroup.create(game.world.width - 200,game.world.centerY,'tutorial_desktop')
            flechitas.anchor.setTo(0.5)
            flechitas.visible = false
            hand = sceneGroup.create(0,0,'atlas.game','handUp')
	        hand.anchor.setTo(0.5)
	        hand.up = -1
	        hand.visible = false
            startRound()
            setWord()

            inputsEnabled = false
            createTutorial()


            grabGroup = game.add.group()
            sceneGroup.add(grabGroup)

            particleCorrect = createPart('star')
            sceneGroup.add(particleCorrect)

            inDesktop = game.device.desktop

            buttons.getButton(acornSong,sceneGroup)
		}
	}
}()