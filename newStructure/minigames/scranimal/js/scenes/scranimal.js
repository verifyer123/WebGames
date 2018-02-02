
var soundsPath = "../../shared/minigames/sounds/"


var scranimal = function(){
    
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
                name: "atlas.scranimal",
                json: "images/scranimal/atlas.json",
                image: "images/scranimal/atlas.png"
            },
            {   
                name: "atlas.time",
                json: "images/scranimal/timeAtlas.json",
                image: "images/scranimal/timeAtlas.png"
            }
        ],
        /*images: [
            {   name:"fondo",
				file: "images/sympho/fondo.png"}
		],*/
		sounds: [
            {   name: "magic",
                //file: soundsPath + "gameLose.mp3"},
                file: soundsPath + "magic.mp3"},
            {   name: "gameLose",
                //file: soundsPath + "magic.mp3"}
                file: soundsPath + "gameLose.mp3"},
            {
                name:"pop",
                file: soundsPath + "pop.mp3"
            },
            {   name: "wrong",
                file: soundsPath + "wrong.mp3"}

		]
    }

    var NUM_LIFES = 3
    var INITIAL_TIME = 20000
    var DELTA_TIME = 300
    var MIN_TIME = 13000
    var LEVELS_TO_TIMER = 3
    var DELTA_LEVEL = 0.4
    var ANIMAL_LEVEL_NAMES = []
    var ARRAY_WIDTH = 7
    var ARRAY_HEIGHT = 9
    var INITIAL_LINES = 3
    var DELTA_QUAD = 69
    var INITIAL_POSITION
    var PROBABILITY_CORRECT_LETTER = 0.2
    var INITIAL_TIME_QUAD = 6000
    var DELTA_TIME_QUAD = 100
    var MIN_TIME_QUAD = 3000
    var VEL_QUAD = 4
    var Y_OUT_MAP
    var NUMBER_QUADS_SAME_TIME = 3

    
    var lives
	var sceneGroup = null
    var gameIndex = 136
    var tutoGroup
    var backgroundSound
    var timeValue
    var numPoints
    var gameGroup
    var heartsGroup
    var pointsBar

    var timeOn = false
    var clock, tweenTiempo, timeBar

    var currentLevel = 0
    var currentTime
    var correctParticle

    var currentName 
    var animalImage

    var okBtn
    var animalTextName

    var quadsGroup
    var boardMask
    var currentNameArray

    var arrayValues
    var touch

    var arraySequence
    var gameActive = false
    var touchIsDown

    var circleGroup
    var timeCreateQuad
    var changingAnimal

    var restoreQuads 
    var gamePaused

    var nextWords
    var lettersArray
    var animalwords

    var mask 
    var correctTimes 

    var currentMaxWords 


	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = NUM_LIFES
        numPoints = 0

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
       
        currentTime = INITIAL_TIME

        currentLevel = 0
        timeOn = false
        currentCorrectLetters = []

        arraySequence= []

        INITIAL_POSITION = {x:game.world.centerX-(DELTA_QUAD*3), y:game.world.centerY+420}

        touchIsDown = false

        timeCreateQuad = INITIAL_TIME_QUAD

        Y_OUT_MAP = INITIAL_POSITION.y-(DELTA_QUAD*ARRAY_HEIGHT)

        changingAnimal = false
        restoreQuads = []

        gamePaused = false

        nextWords = []

        correctTimes = 0

        currentMaxWords = 5

        loadSounds()
        //4 words and behind
        ANIMAL_LEVEL_NAMES[0] = ["BEAR","BIRD","CAT","COW","DOG","FOX","FROG","LION","PIG","SEAL","WOLF"]
        //5
        ANIMAL_LEVEL_NAMES[1] = ["HORSE","SHEEP","TIGER","ZEBRA"]
        //6
        ANIMAL_LEVEL_NAMES[2] = ["BEAVER","COYOTE","DONKEY","FALCON","LIZARD","MONKEY","RABBIT","TOUCAN"]
        //7
        ANIMAL_LEVEL_NAMES[3] = ["BUFFALO","CHICKEN","GIRAFFE","PENGUIN","RACCOON"]
        //8 and more
        ANIMAL_LEVEL_NAMES[4] = ["ANTEATER","CHAMELEON","CROCODILE","ELEPHANT","HEDGEHOG","KANGAROO","STINGRAY"]

        initiArray()
	}


    function initiArray(){
        arrayValues = []
        for(var i = 0; i < ARRAY_WIDTH; i ++){
            arrayValues[i] = []
            for(var j = 0; j < ARRAY_HEIGHT; j++){
                arrayValues[i][j] = {value: "", object:null}
            }
        }

    }


    function preload(){
        game.stage.disableVisibilityChange = false;

        game.load.audio('scranimalSong', soundsPath + 'songs/childrenbit.mp3');
        
        game.load.image('introscreen',"images/scranimal/introscreen.png")
        game.load.image('howTo',"images/scranimal/how" + localization.getLanguage() + ".png")
        game.load.image('buttonText',"images/scranimal/play" + localization.getLanguage() + ".png")

        game.load.spritesheet("coin", 'images/scranimal/coin.png', 122, 123, 12)

        buttons.getImages(game)

    }

    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.scranimal','hearts')

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

        var pointsImg = pointsBar.create(-10,10,'atlas.scranimal','xpcoins')
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

    function positionTimer(){
      clock=game.add.image(game.world.centerX-150,50,"atlas.time","clock")
      clock.scale.setTo(.7)
      timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
      timeBar.scale.setTo(8,.45)
      backgroundGroup.add(clock)
      backgroundGroup.add(timeBar)
      timeBar.alpha=1
      clock.alpha=1
    }

    function stopTimer(){
        if(tweenTiempo){
          tweenTiempo.stop()
      }
      tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, 500, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
      })
    }

    function startTimer(time){
       tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
       tweenTiempo.onComplete.add(function(){
           missPoint()
           stopTimer()
           endRound()
           canPlant=false
       })
    }

    function Coin(objectBorn,objectDestiny,time){
       
       
       //objectBorn= Objeto de donde nacen
       coins.x=objectBorn.x
       coins.y=objectBorn.y
       
       /*var emitter = epicparticles.newEmitter("pickedEnergy")
       emitter.duration=1;
       emitter.x = coins.x
       emitter.y = coins.y*/

        correctParticle.x = objectBorn.x
        correctParticle.y = objectBorn.y
        correctParticle.start(true, 1000, null, 5)

       game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
       game.add.tween(coins).to({y:objectBorn.y-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
           game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
               coins.x=objectBorn.centerX
               coins.y=objectBorn.centerY
               //addPoint(1)
           })
       })
    }

    function stopGame(){
        console.log("stopGame")
        gameActive = false
        backgroundSound.stop()
        sound.play("gameLose")
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 750)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, numPoints, gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
            
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
        numPoints+=number
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        addNumberPart(pointsBar.text,'+' + number)

    }
    
    function missPoint(){
        
    	//loseRabit()
        sound.play("wrong")
        
        lives--;
        heartsGroup.text.setText('X ' + lives)

        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        addNumberPart(heartsGroup.text,'-1')
        
        if(lives === 0){
            stopGame(false)
        }
        else{
            //nextRound()
        }
        
        // addNumberPart(batteryGroup,'-1')
    }
    


    function onClickPlay(rect) {
        //console.log('enter tuto')
        rect.inputEnabled = false
        sound.play("pop")

        game.add.tween(tutoGroup).to({alpha:0},500,Phaser.Easing.Linear.none,true).onComplete.add(function(){

            tutoGroup.y = -game.world.height
            inputsEnabled = true
            setRound()
            // startTimer(missPoint)
        })
    }
    
    function update() {
        if(gameActive){
            updateQuads()

            updateTouch()
        }
    }

    function updateTouch(){
        if(game.input.activePointer.isDown){
            if(touch.x == -100 && !touchIsDown){
                touch.x = game.input.activePointer.x
                touch.y = game.input.activePointer.y
                touchIsDown = true
            }
        }
        else{
            touch.x = -100
            touch.y = -100
            touchIsDown= false
        }
        
    }

    function updateQuads(){
        if(touch.x!=-100){
            var quad = checkCollision(touch)

            if(quad!=null){
                if(quad.selected){

                    for(var i = quad.id+1; i< arraySequence.length; i++){
                        arraySequence[i].circle.text.setText(i)
                        arraySequence[i].id = i-1
                    }

                    quad.sprite.loadTexture('atlas.scranimal',quad.sprite.currentTextureKey,0,false)
                    arraySequence.splice(quad.id,1)
                    quad.id = -1
                    quad.selected = false
                    quad.circle.visible = false
                    quad.circle.text.setText("")
                    if(arraySequence.length==0){
                        okBtn.alpha = 0.5
                    }
                   // quad.circle.visible = false

                }
                else{

                    quad.sprite.loadTexture('atlas.scranimal','SELECTION',0,false)
                    quad.id = arraySequence.length
                    quad.selected = true
                    //console.log(quad)
                    quad.circle.visible = true
                    quad.circle.text.setText(arraySequence.length+1)

                    arraySequence.push(quad)

                    //if(arraySequence.length>0){
                    okBtn.alpha = 1
                    //}


                    if(currentName.length == arraySequence.length){
                        var correct = true
                        for(var i = 0; i < currentName.length; i++){
                            if(currentName[i]!=arraySequence[i].text.text){
                                correct=false
                                //console.log(currentName[i],arraySequence[i].text.text)
                                break
                            }
                        }

                        if(correct){
                            game.add.tween(okBtn.scale).to({x:1.5,y:1.5},300,Phaser.Easing.Linear.none,true).yoyo(true)
                        }
                    }

                    sound.play("pop")

                }

                touch.x = -100
                touch.y = -100
                //console.log(arraySequence)
            }
            else{

            }
        }

        for(var i = 0; i < quadsGroup.length; i++){
            if(quadsGroup.children[i].visible){
                if(quadsGroup.children[i].nextY!=-1){
                    quadsGroup.children[i].y+=VEL_QUAD
                    if(quadsGroup.children[i].y >= quadsGroup.children[i].nextY){
                        //console.log("Math nextY")
                        quadsGroup.children[i].y = quadsGroup.children[i].nextY
                        quadsGroup.children[i].nextY = -1
                        if(quadsGroup.children[i].indexJ==ARRAY_HEIGHT-1){
                            stopGame()
                        }
                    }
                    //console.log(quadsGroup.children[i].nexY)
                }
            }
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
		
		var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.scranimal','tutorial_image')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}

		var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.scranimal',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.scranimal','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }

    function checkCollision(obj){
        for(var i = 0; i < quadsGroup.length; i ++){
            if(quadsGroup.children[i].visible){
                var collide = checkOverlap(quadsGroup.children[i].sprite,obj)
                if(collide){
                    return quadsGroup.children[i]
                }
            }
        }

        return null
    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }

    function setRound(){

        mask = game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.drawRect(0, game.world.centerY-170, game.world.width,game.world.centerY+170);
        animalwords = []
        getNextName()
        getNextName()
        getNextName()
        getNextName()
        getNextName()
        getNextName()
        getNextName()
        getNextName()
        getNextName()
        getNextName()

        //getNextName()
        createLettersArray()
        createAnimal()
        
        for(var i =0; i<ARRAY_WIDTH;i++){
            for(var j = 0; j < 4; j++){
                var quad = setQuad(i,j)

                if(i == ARRAY_WIDTH-1 && j==2){
                    //tween.onComplete.add(startRound)
                    startRound()
                }
            }
        }

        currentMaxWords = 2
        setTimeout(createNewQuad,timeCreateQuad)

    }

    function getNextName(){
        var levelIndex = game.rnd.realInRange(0,currentLevel)
        if(currentLevel < 4.9){
            currentLevel+=DELTA_LEVEL
        }
        else{
            currentLevel = 4.9
        }

        levelIndex = Math.floor(levelIndex)
        var r = game.rnd.integerInRange(0,ANIMAL_LEVEL_NAMES[levelIndex].length-1)
        nextWords.push(ANIMAL_LEVEL_NAMES[levelIndex][r])
        animalwords.push(ANIMAL_LEVEL_NAMES[levelIndex][r])
    }

    function createAnimal(){

        if(timeBar!=null){
            startTimer(currentTime)
            if(currentTime>MIN_TIME){
                currentTime-=DELTA_TIME
            }

        }

        getNextName()
        getNextName()
        
        arraySequence = []

        currentName = nextWords[0]
        nextWords.splice(0,1)
        //console.log(currentName)
        currentNameArray = []
        for(var i = 0; i< currentName.length;i++){
            currentNameArray.push(currentName[i])
        }
        //console.log(currentNameArray)

        animalImage.loadTexture('atlas.scranimal',currentName,0,false)

        animalTextName.setText(currentName)
        game.add.tween(animalImage.scale).to({x:1,y:1},500, Phaser.Easing.Linear.none, true)

    }

    function createLettersArray(){
        lettersArray = []

        if(animalwords.length<2){
            getNextName()
            getNextName()
        }

        for(var i = 0; i < 2; i++){
            for(var j = 0; j < animalwords[i].length;j++){
                //if(lettersArray.indexOf(nextWords[i][j])==-1){
                    lettersArray.push(animalwords[i][j])
                //}
                //console.log(animalwords[i][j])
            }
        }

        animalwords.splice(0,1)
        animalwords.splice(0,1)

    }

    function createNewQuad(){
        if(!gameActive){
            return
        }
        setTimeout(createNewQuad,timeCreateQuad)
        if(changingAnimal || gamePaused ){
            return
        }
        if(timeCreateQuad>MIN_TIME_QUAD){
            timeCreateQuad-=DELTA_TIME_QUAD
        }

        var randomNumber = game.rnd.integerInRange(1,3)

        for(var r = 0 ; r< randomNumber; r++){

            var i = game.rnd.integerInRange(0,ARRAY_WIDTH-1)
            var j =-1
            for(var h = 0; h< ARRAY_HEIGHT; h++){
                if(arrayValues[i][h].value == ""){
                    j = h
                    break
                }
            }

            if(j == -1){
                //stopGame()
                return 
            }

            var quad = setQuad(i,j)
        }

        //setTimeout(createNewQuad,timeCreateQuad)
    }

    function setQuad(i,j){
        var r = game.rnd.frac()
        var letter
        /*if(r< PROBABILITY_CORRECT_LETTER){
            var indexLetter = game.rnd.integerInRange(0,currentNameArray.length-1)
            letter = currentNameArray[indexLetter]
            currentNameArray.splice(indexLetter,1)
            if(currentNameArray.length==0){
                for(var help = 0; help< currentName.length;help++){
                    currentNameArray.push(currentName[help])
                }
            }
        }
        else{
            var letter = game.rnd.integerInRange(65,90)
            letter = String.fromCharCode(letter);
        }*/
        var index = game.rnd.integerInRange(0,lettersArray.length-1)
        letter = lettersArray[index]
        lettersArray.splice(index,1)
        if(lettersArray.length<=0){
            createLettersArray()
        }
        var x = INITIAL_POSITION.x + (DELTA_QUAD*i)
        var y = Y_OUT_MAP - (DELTA_QUAD*j)
        //
        var quad = getQuad(x,y,letter)
        quad.selected = false
        quad.indexI = i
        quad.indexJ = j

        quad.nextY = INITIAL_POSITION.y -(DELTA_QUAD*j)

        arrayValues[i][j].value = letter
        arrayValues[i][j].object = quad

        return quad
    }

    function startRound(){
        inEvaluation = false
        gameActive = true
    }

    function clickOk(){
        if(okBtn.alpha==0.5){
            return
        }
        else{
            okBtn.alpha ==0.5
        }
        changingAnimal = true
        var correct = true
        if(currentName.length == arraySequence.length){
            for(var i = 0; i < currentName.length; i++){
                if(currentName[i]!=arraySequence[i].text.text){
                    correct=false
                    //console.log(currentName[i],arraySequence[i].text.text)
                    break
                }
            }
        }
        else{
            correct = false
        }

        if(timeBar!=null){
            stopTimer()
        }

        if(!correct){
            missPoint()
        }
        else{
            //for(var i = 0; i < arraySequence.length; i++){
                Coin(arraySequence[arraySequence.length-1],pointsBar,50)
                addPoint(arraySequence.length)
            //}

            correctTimes ++
            if(correctTimes==3){
                positionTimer()
                //startTimer()
            }
        }


        endRound(correct)

    }

    function endRound(correct){

        var text = []
        restoreQuads = []
        for(var i = 0; i < arraySequence.length; i++){
            arraySequence[i].circle.visible = false
            arraySequence[i].circle.text.setText("")
            restoreQuads.push(arraySequence[i])
            text.push(arraySequence[i].text.text)
            var tween = game.add.tween(arraySequence[i].scale).to({x:0,y:0},200,Phaser.Easing.linear,true)

            arrayValues[arraySequence[i].indexI][arraySequence[i].indexJ].value = ""
            arrayValues[arraySequence[i].indexI][arraySequence[i].indexJ].object = null

            if(i == arraySequence.length-1){
                tween.onComplete.add(endChangeAnimal)
            }

           
        }

        if(!correct){
            animalwords.unshift(text)
        }

        //console.log(arrayValues)
        animalTextName.setText("")

        game.add.tween(animalImage.scale).to({x:0,y:0},400, Phaser.Easing.Linear.none, true).onComplete.add(createAnimal)
    }

    function endChangeAnimal(){
        for(var i = 0; i < restoreQuads.length; i++){
            restoreQuads[i].scale.setTo(1)
            restoreQuads[i].x = -100
            restoreQuads[i].y = -100
            restoreQuads[i].visible = false
        }
        changingAnimal = false
        startMoveDown()

    }

    function startMoveDown(){
        //console.log(arrayValues)
        var downQuads = []
        for(var i = 0; i < ARRAY_WIDTH; i++){
            var firstEmptyId = -1

            for(var j = 0; j<ARRAY_HEIGHT; j++){
                if(arrayValues[i][j].value == ""){
                    if(firstEmptyId == -1){
                        firstEmptyId = j
                    }
                }
                else{
                    if(firstEmptyId!=-1){
                        //arrayValues[i][j].object.y = INITIAL_POSITION.y - (DELTA_QUAD*firstEmptyId)
                        downQuads.push({object:arrayValues[i][j].object,y:INITIAL_POSITION.y - (DELTA_QUAD*firstEmptyId)})
                        arrayValues[i][firstEmptyId].object = arrayValues[i][j].object
                        arrayValues[i][firstEmptyId].value = arrayValues[i][j].value

                        arrayValues[i][firstEmptyId].object.indexJ = firstEmptyId             
                        

                        arrayValues[i][j].object = null
                        arrayValues[i][j].value = ""
                        firstEmptyId=-1
                        j = firstEmptyId+1
                        
                    }
                }
            }

           
        }


        if(downQuads.length>0){

            for(var i = 0; i < downQuads.length;i++){
                downQuads[i].object.nextY = downQuads[i].y
            }
        }

    }



    function getQuad(x,y,letter){
        var randomTexture = game.rnd.integerInRange(0,4)
        var key
        switch(randomTexture){
            case 0:
            key = 'BLUE_BRICK'
            break
            case 1:
            key = 'GREEN_BRICK'
            break
            case 2:
            key = 'PINK_BRICK'
            break
            case 3:
            key = 'PRPL_BRICK'
            break
            case 4:
            key = 'YELLOW_BRICK'
            break
        }

        for(var i =0; i < quadsGroup.length; i++){
            if(!quadsGroup.children[i].visible){
                quadsGroup.children[i].x = x
                quadsGroup.children[i].y = y
                quadsGroup.children[i].text.setText(letter)
                quadsGroup.children[i].sprite.loadTexture('atlas.scranimal',key,0,false)
                quadsGroup.children[i].sprite.currentTextureKey = key
                quadsGroup.children[i].visible = true
                return quadsGroup.children[i]
            }
        }

        var o  = game.add.group()
        var sprite = o.create(0,0,'atlas.scranimal',key)
        sprite.anchor.setTo(0.5)
        o.sprite = sprite
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        var text = new Phaser.Text(sceneGroup.game, 0, 10, letter, fontStyle)
        //console.log(letter)
        text.anchor.setTo(0.5)
        o.add(text)
        o.x = x
        o.y = y
        o.text = text
        o.sprite.currentTextureKey = key

        quadsGroup.add(o)

        //game.physics.arcade.enable(o);


        var circle  = game.add.group()
        var spriteCircle = game.add.sprite(-25, -20);
        spriteCircle.anchor.setTo(0.5)

        var g = game.add.graphics(0, 0);
        g.beginFill(0xffffff, 1);
        g.drawCircle(0, 0, 20);

        spriteCircle.addChild(g)

        circle.add(spriteCircle)

        var fontStyle = {font: "15px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        var textCircle = new Phaser.Text(sceneGroup.game, -25, -15, "", fontStyle)
        textCircle.anchor.setTo(0.5)
        circle.add(textCircle)


        circle.visible = false
        circle.text = textCircle

        o.circle = circle
        o.add(circle)

        o.mask = mask
        return o

    }

    function createTouch(){
        touch = game.add.sprite(-100,-100,'atlas.scranimal','star')
        touch.alpha = 0
        touch.anchor.setTo(0.5)
        touch.scale.setTo(0.2)
        game.physics.arcade.enable(touch);
    }

    
    function createScene(){
        //yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel);

        /*game.physics.startSystem(Phaser.Physics.ARCADE)
        game.physics.arcade.gravity.y = 0;
        game.physics.arcade.setBoundsToWorld(false,false,false,false,false)*/

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        var background = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.scranimal','TILE_BG')
        background.anchor.setTo(0,0)
        backgroundGroup.add(background)

        var wordBox = sceneGroup.create(game.world.centerX+80,game.world.centerY-310,'atlas.scranimal','WORD_BOX')
        wordBox.anchor.setTo(1,0.5)

        var slotAnimal = sceneGroup.create(game.world.centerX+170, game.world.centerY-275, 'atlas.scranimal','ANIMAL_PIC')
        //slotAnimal.scale.setTo(2.5)
        slotAnimal.anchor.setTo(0.5)

        animalImage = sceneGroup.create(game.world.centerX+170, game.world.centerY-260, 'atlas.scranimal','PIG')
        animalImage.anchor.setTo(0.5)
        animalImage.scale.setTo(0)

        var board = sceneGroup.create(game.world.centerX, game.world.centerY+150,'atlas.scranimal','BOARD')
        board.anchor.setTo(0.5)

        okBtn = sceneGroup.create(game.world.centerX-100, game.world.centerY-230,'atlas.scranimal','ok_off')
        okBtn.anchor.setTo(0.5)
        okBtn.scale.setTo(1.2)
        okBtn.inputEnabled = true
        okBtn.alpha = 0.5
        okBtn.events.onInputDown.add(function(){okBtn.loadTexture('atlas.scranimal', 'ok_on')})
        okBtn.events.onInputUp.add(clickOk)

        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        animalTextName = new Phaser.Text(sceneGroup.game, 0, 0, "", fontStyle)
        animalTextName.anchor.setTo(0.5)
        animalTextName.x = wordBox.x - wordBox.width * 0.5
        animalTextName.y = wordBox.y
        sceneGroup.add(animalTextName)

        
        gameGroup = game.add.group()
        sceneGroup.add(gameGroup)

        quadsGroup = game.add.group()
        sceneGroup.add(quadsGroup)

        circleGroup = game.add.group()
        sceneGroup.add(circleGroup)

        backgroundSound = game.add.audio('scranimalSong')
        game.sound.setDecodedCallback(backgroundSound, function(){
            backgroundSound.loopFull(0.6)
        }, this);
        
        game.onPause.add(function(){
            game.sound.mute = true
            gamePaused = true
        } , this);

        game.onResume.add(function(){
            game.sound.mute = false
            gamePaused = false
        }, this);


        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0


        
        //sprite.mask = mask;
        
        initialize()

        createTouch()
        createPointsBar()
        createHearts()
        createTutorial()

        //positionTimer()

        correctParticle = createPart('atlas.scranimal','star')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)


    }
    
	return {
		assets: assets,
		name: "scranimal",
        update:update,
        preload:preload,
		create: createScene
	}
}()
