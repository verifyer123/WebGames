
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var symphoMaster = function(){


	var assets = {
        atlases: [
            {   
                name: "atlas.sympho",
                json: "images/sympho/atlas.json",
                image: "images/sympho/atlas.png"
            },
            {   
                name: "atlas.time",
                json: "images/sympho/timeAtlas.json",
                image: "images/sympho/timeAtlas.png"
            },

        ],

		sounds: [
            {	name: "pop",
                file: soundsPath + "pop.mp3"},
		    {	name: "snapshot",
				file: soundsPath + "snapshot.mp3"},
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
                name: "instrument_0",
                file: soundsPath + "french_horn.mp3"
            },
            {
                name: "instrument_1",
                file: soundsPath + "flute.mp3"
            },
            {
                name: "instrument_2",
                file: soundsPath + "guitar.mp3"
            },
            {
                name: "instrument_3",
                file: soundsPath + "piano.mp3"
            },
            {
                name: "instrument_4",
                file: soundsPath + "trombone.mp3"
            }

		]
    }



    var NUM_LIFES = 3
    var MAX_SPACES = 5
    var INSTRUMENT_NUMBER = 5
    var INITIAL_QUESTIONS = 3
    var DELTA_SPACES = 85
    var INITIAL_TIME  = 30000
    var DELTA_TIME = 200
    var MIN_TIME = 22000
    var MAX_TIMES_RESTART=1

    var button_initial_positions
    
    var lives
	var sceneGroup = null
    var gameIndex = 118
    var tutoGroup
    var backgroundSound
    var batteryGroup = null
    var timeValue
    var quantNumber
    var numPoints
    var inputsEnabled
    var gameGroup
    var spineObj
    var roundCounter
    var camara
    var heartsGroup
    var pointsBar
    var buttonsGroup
    var instrumentsGroup
    var particlesGroup
    var spineGroup
    var spaceGroup
    var notesGroup
    var spaces = []
    var instrumentButtons = []
    var currentQuestions = 3
    var currentLevel = 1
    var answerSequence = []
    var correctSequence = []
    var retrySequence = []
    var currentButton
    var particlesArray = []
    var timeOn = false
    var clock, tweenTiempo, timeBar
    var emptyObject
    var currentTime = INITIAL_TIME
    var currentConcertId
    var instrumentAduios = []
    var skinNames = ["clarinet","flute","guitar","piano","trumpet"]
    var canPressOk = false
    var okBtnImg
    var restartBtnImg
    var timesRestarted = 0
    var canRestart = false
    var inEvaluate = false
    var inTutorial = true
    var tutorialId = 0
    var roundWin

	function loadSounds(){
		sound.decode(assets.sounds)
	}



	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = NUM_LIFES
        timeValue = 4000
        quantNumber = 2
        numPoints = 0
        roundCounter = 0

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        inputsEnabled = false
        spineObj = null
        currentTime = INITIAL_TIME

        button_initial_positions = []
        button_initial_positions[0] = {x: game.world.centerX-180, y: game.world.centerY+180}
        button_initial_positions[1] = {x: game.world.centerX, y: game.world.centerY+180}
        button_initial_positions[2] = {x: game.world.centerX+180, y: game.world.centerY+180}
        button_initial_positions[3] = {x: game.world.centerX-90, y: game.world.centerY+360}
        button_initial_positions[4] = {x: game.world.centerX+90, y: game.world.centerY+360}
        

        currentQuestions = INITIAL_QUESTIONS
        currentLevel = 1
        timeOn = false
        roundWin = false

        currentConcertId = 0
        instrumentAduios = []
        canPressOk = false

        timesRestarted = 0
        canRestart = false 
        inEvaluate = false

        inTutorial = true
        tutorialId = 0
        particlesArray= []
        answerSequence = []
    	correctSequence = []
    	retrySequence = []
    	spaces = []
    	instrumentButtons = []

        loadSounds()
        
	}

    function preload(){
        game.stage.disableVisibilityChange = false;

        game.load.spine('instruments', "images/spines/instruments/instruments.json")
        game.load.spine('notes', "images/spines/notes/musical_notes.json")

        game.load.audio('symphoSong', soundsPath + 'songs/childrenbit.mp3');
        
        /*game.load.image('introscreen',"images/sympho/introscreen.png")
        game.load.image('howTo',"images/sympho/how" + localization.getLanguage() + ".png")
        game.load.image('buttonText',"images/sympho/play" + localization.getLanguage() + ".png")*/



        game.load.spritesheet("coin", 'images/sympho/coin.png', 122, 123, 12)


        var inputName = 'movil'
        
        if(game.device.desktop){
            inputName = 'desktop'
        }


        game.load.image('tutorial_image',"images/sympho/tutorial_image_"+inputName+".png")
        //loadType(gameIndex)

        

    }

    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.sympho','hearts')

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

        var pointsImg = pointsBar.create(-10,10,'atlas.sympho','xpcoins')
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

    function createSpine(params){
        var name = params.name
        var skin = params.skin
        var animation = params.animation
        var delay = params.delay || 500
        var duration = params.duration || 3000

        var directions = params.directions || {fromX: -400, fromY: 0, toX: 400, toY: 0}

        spineObj = game.add.spine(0,0, name);
        spineObj.scale.setTo(0.6,0.6)
        spineObj.rHeight = params.height
        spineObj.setAnimationByName(0, animation, true);
        spineObj.setSkinByName(skin);
        spineObj.x = directions.fromX
        spineObj.y = directions.fromY + spineObj.rHeight * 0.5
        spineObj.angle = angle(directions)
        gameGroup.add(spineObj)
        if (directions.fromX > directions.toX) {
            spineObj.scale.x = spineObj.scale.x * -1
            spineObj.angle = spineObj.angle - 180
        }

        var tween = game.add.tween(spineObj).to({x: directions.toX, y: directions.toY + spineObj.rHeight * 0.5}, duration, Phaser.Easing.Linear.none, false, delay)
        tween.onComplete.add(function () {
            missPoint()
            spineObj.alpha = 0
        })
        spineObj.tween = tween
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
      clock=game.add.image(game.world.centerX-150,20,"atlas.time","clock")
      clock.scale.setTo(.7)
      timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
      timeBar.scale.setTo(8,.45)
      backgroundGroup.add(clock)
      backgroundGroup.add(timeBar)
      timeBar.alpha=1
      clock.alpha=1
    }

    function stopTimer(){
      tweenTiempo.stop()
      tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, 500, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
      })
    }

    function startTimer(time){
       tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
       tweenTiempo.onComplete.add(function(){
           missPoint()
           stopTimer()
           canPlant=false
       })
    }

    function Coin(objectBorn,objectDestiny,time){
       
       
       //objectBorn= Objeto de donde nacen
       coins.x=objectBorn.centerX
       coins.y=objectBorn.centerY
       
       /*var emitter = epicparticles.newEmitter("pickedEnergy")
       emitter.duration=1;
       emitter.x = coins.x
       emitter.y = coins.y*/
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
        
        if(lives === 0){
            stopGame(false)
        }
        else{
            nextRound()
        }
        
        // addNumberPart(batteryGroup,'-1')
    }
    


    function onClickPlay(rect) {
        
        tutoGroup.y = -game.world.height
        inputsEnabled = true
        setRound()

    }
    
    function update() {
        for(var i=0; i < instrumentsGroup.length; i ++){
            instrumentsGroup.children[i].spine.x = instrumentsGroup.children[i].x
            instrumentsGroup.children[i].spine.y = instrumentsGroup.children[i].y
            instrumentsGroup.children[i].spine.scale.setTo(instrumentsGroup.children[i].scale.x,instrumentsGroup.children[i].scale.y)
        }
    }

    function createTutorial(){
        
        tutoGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

    }


    function createButtons(){

        instrumentsGroup = game.add.group()
        sceneGroup.add(instrumentsGroup)

        spineGroup = game.add.group()
        sceneGroup.add(spineGroup)

        for(var i =0; i < 10; i++){
            
            createSingleButton()
            
        }

        particlesGroup = game.add.group()
        sceneGroup.add(particlesGroup)

        for(var i = 0; i < MAX_SPACES; i++){
            var particle = createPart('atlas.sympho','star')
            particlesArray.push(particle)
            particlesGroup.add(particle)
        }

    }

    function createSingleButton(){
        var ins = instrumentsGroup.create(-2000,0,'atlas.sympho','flautin')
        ins.instrumentId = 0
        ins.alpha = 0
        ins.anchor.setTo(0.5,0.5)
        ins.inputEnabled = true
        ins.input.enableDrag(true)
        ins.events.onDragStart.add(onDragStart, this)
        ins.events.onDragUpdate.add(onDragUpdate, this)
        ins.events.onDragStop.add(onDragStop, this)
        ins.inScene = false

        var group = game.add.group()
        var button =  game.add.spine(0,ins.height/2,'instruments')
        button.setAnimationByName(0,"IDLE",true)
        button.setSkinByName(skinNames[0])
        button.scale.setTo(0.3,0.3)
        group.add(button)
        group.scale.setTo(0,0)
        spineGroup.add(group)
       
        ins.spine = group
        ins.anim = button
        ins.scale.setTo(0,0)

        return ins
    }

    function createQuestions(){
        spaceGroup = game.add.group()
        sceneGroup.add(spaceGroup)

        notesGroup = game.add.group()
        sceneGroup.add(notesGroup)

        for(var i = 0; i < MAX_SPACES; i++){
            var space = spaceGroup.create(0,game.world.centerY-120,'atlas.sympho','destiny')
            space.anchor.setTo(0.5,0.5)
            space.scale.setTo(0,0)
            space.empty = true

            var group = game.add.group()
            var note = game.add.spine(0,0,'notes')
            note.setAnimationByName(0,"IDLE_NOTE",true)
            note.setSkinByName("normal")
            note.scale.setTo(0.3,0.3)
            group.add(note)
            group.scale.setTo(0,0)
            space.note = group
            notesGroup.add(group)

        }
    }

    function onDragStart(obj, pointer){

        spineGroup.bringToTop(obj.spine)

        currentButton = obj
        obj.startX = obj.originalPos.x
        obj.startY = obj.originalPos.y

        if(obj.tween)
            obj.tween.stop()

        obj.tween = game.add.tween(obj.scale).to({x: 1.1, y: 1.1}, 200, Phaser.Easing.Cubic.Out, true)
    }

    function onDragUpdate(obj, pointer, x, y){

        if(obj.y < game.world.centerY + 100 && obj.y > game.world.centerY - 120){
            if(obj.tween)
                obj.tween.stop()
            var t = (obj.y - (game.world.centerY -120))/(game.world.centerY + 100-(game.world.centerY - 120))
            var newScale = lerp(0.6,1.1,t)
            obj.scale.setTo(newScale)
        }
    }

    function lerp(a,b,t){
        return a + (b - a) * t;
    }

    function onDragStop(obj){
        if(inEvaluate){
            return
        }

        currentButton = null
        if(obj.tween)
            obj.tween.stop()

        game.add.tween(obj.scale).to({x: 1, y: 1}, 200, Phaser.Easing.Cubic.Out, true)

        var answerSlot = checkCollision(obj)
        if(answerSlot){
            
            if(!answerSlot.empty && answerSlot.button!=null){
                game.add.tween(answerSlot.button.scale).to({x: 0, y: 0}, 200, Phaser.Easing.Cubic.Out, true).onComplete.add(liberateButton)
                
            }
            
            if(!obj.currentSlot){
	            var newButton = GetButton()
	            newButton.scale.setTo(0,0)
	            newButton.x = obj.startX
	            newButton.y = obj.startY
	            newButton.instrumentId = obj.instrumentId
	            newButton.inScene = true
	            newButton.anim.setSkinByName(skinNames[newButton.instrumentId])

	            newButton.scaleTween = game.add.tween(newButton.scale).to({x: 1, y: 1}, 200, Phaser.Easing.Cubic.Out, true)
	            newButton.originalPos = obj.originalPos
	        }
	        else{
	        	obj.currentSlot.empty = true
	        	obj.currentSlot.button = false
	        	answerSequence[obj.currentSlot.positionId]=-1
	        	obj.currentSlot = null
	        }


            obj.currentSlot = answerSlot
            answerSlot.empty = false
            answerSlot.button = obj
            answerSequence[answerSlot.positionId] = obj.instrumentId
            //obj.inputEnabled = false
            obj.tween = game.add.tween(obj).to({x: answerSlot.x, y: answerSlot.y}, 200, Phaser.Easing.Cubic.Out, true)
            game.add.tween(obj.scale).to({x: 0.6, y: 0.6}, 200, Phaser.Easing.Cubic.Out, true)





        } else{

        	if(!obj.currentSlot){
	            obj.tween = game.add.tween(obj).to({x: obj.startX, y: obj.startY}, 200, Phaser.Easing.Cubic.Out, true)
	            game.add.tween(obj.scale).to({x: 1, y: 1}, 200, Phaser.Easing.Cubic.Out, true)
	        }
	        else{
	        	obj.currentSlot.empty = true
	        	obj.currentSlot.button = false
	        	answerSequence[obj.currentSlot.positionId]=-1
	        	obj.currentSlot = null
	        	obj.inScene = false
	        	game.add.tween(obj.scale).to({x: 0, y: 0}, 200, Phaser.Easing.Cubic.Out, true).onComplete.add(liberateButton)
	        }
        }

        var ready = true
        for(var i = 0; i < currentQuestions; i++){
        	if(answerSequence[i]==null){
        		ready = false
        		break
        	}
        	else if(answerSequence[i]==-1){
        		ready = false
        		break
        	}
        }

        if(ready){
        	canPressOk = true
        	okBtnImg.inputEnabled = true
    		okBtnImg.alpha = 1 
        }
        else{
        	canPressOk = false
        	okBtnImg.inputEnabled = false
    		okBtnImg.alpha = 0.5 
        }
    }

    function checkCollision(obj){
        for(var i = 0; i < currentQuestions; i ++){
            var collide = checkOverlap(spaceGroup.children[i],obj)
            if(collide){
                return spaceGroup.children[i]
            }
        }

        return null
    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }

    function GetButton(){

        for(var i = 0; i < instrumentsGroup; i++){
            if(!instrumentsGroup.children[i].inScene){
                return instrumentsGroup.children[i]
            }
        }

        return createSingleButton()

    }

    function setRound(){
    	canPressOk = false
    	okBtnImg.inputEnabled = false
        okBtnImg.alpha = 0.5 

        restartBtnImg.alpha = 1
        restartBtnImg.inputEnabled = true

        inEvaluate = false

        canRestart = true
        timesRestarted = 0

        for(var i =0; i < instrumentsGroup.length; i++){
            liberateButton(instrumentsGroup.children[i])
        }

        instrumentsGroup.setAll('inputEnabled',false)
        currentConcertId = 0
        answerSequence = []
        correctSequence = []
        retrySequence = []
        
        var instrumentIds = [0,0,0,0,0]

        for(var i = 0; i < currentQuestions; i++){

            var r = game.rnd.integerInRange(0,instrumentIds.length-1)
            
            if(instrumentIds[r]<2){
            	instrumentIds[r]++
            }
            else{
            	r = game.rnd.integerInRange(0,instrumentIds.length-1)
            }
            correctSequence.push(r)
            //instrumentIds.splice(r,1)
        }

        var positionArray = button_initial_positions.slice()

        for(var i = 0; i < INSTRUMENT_NUMBER; i++){
            var r = game.rnd.integerInRange(0,positionArray.length-1)
            if(inTutorial){
            	r = 0
            }

            var p = positionArray[r]
            positionArray.splice(r,1)
            instrumentsGroup.children[i].x = p.x
            instrumentsGroup.children[i].y = p.y
            instrumentsGroup.children[i].originalPos = p
            instrumentsGroup.children[i].instrumentId = i
            instrumentsGroup.children[i].anim.setSkinByName(skinNames[i])
            instrumentsGroup.children[i].inScene = true

            //instrumentsGroup.children[i].inputEnabled = true
            if(!inTutorial){
            	instrumentsGroup.children[i].scaleTween = game.add.tween(instrumentsGroup.children[i].scale).from({x:0,y:0}).to({x:1, y:1}, 500, Phaser.Easing.linear, true)
            }
        }

        var lastTween
        var initialX = game.world.centerX - (((currentQuestions-1)/2)*DELTA_SPACES)
        for(var i = 0; i < currentQuestions; i++){

            spaceGroup.children[i].x = initialX + (i*DELTA_SPACES)
            spaceGroup.children[i].positionId = i
            spaceGroup.children[i].empty = false

            spaceGroup.children[i].note.x = spaceGroup.children[i].x
            spaceGroup.children[i].note.y = spaceGroup.children[i].y-80
            
            if(!inTutorial){
	            game.add.tween(spaceGroup.children[i].scale).from({x:0,y:0}).to({x:0.6, y:0.6}, 500, Phaser.Easing.linear, true)
	            lastTween = game.add.tween(spaceGroup.children[i].note.scale).from({x:0,y:0}).to({x:0.6, y:0.6}, 500, Phaser.Easing.linear, true)
	        }
	        else{
	        	spaceGroup.children[i].scale.setTo(0,0)
	        	spaceGroup.children[i].note.scale.setTo(0,0)
	        }

        }


        

        if(!inTutorial){
        	instrumentsGroup.setAll('inputEnabled',true)
	        restartBtnImg.loadTexture('atlas.sympho','sound_push')
	        lastTween.onComplete.add(playConcert)
	    }
	    else{
	    	playTutorial()
	    }
        

    }

    function playTutorial(){
    	if(tutorialId < INSTRUMENT_NUMBER){

    		setTimeout(function(){playInstrumentSound('instrument_'+tutorialId); tutorialId++;},1000)
    		
    		var tween_1 = game.add.tween(instrumentsGroup.children[tutorialId].scale).from({x:0,y:0}).to({x:1, y:1}, 1000, Phaser.Easing.linear,true).onComplete.add(playTutorial)

    	}
    	else{
    		instrumentsGroup.setAll('inputEnabled',true)
    		inTutorial = false

    		setTimeout(function(){
	    		for(var i = 0; i < currentQuestions; i++){
		    		game.add.tween(spaceGroup.children[i].scale).from({x:0,y:0}).to({x:0.6, y:0.6}, 500, Phaser.Easing.linear, true)
			        lastTween = game.add.tween(spaceGroup.children[i].note.scale).from({x:0,y:0}).to({x:0.6, y:0.6}, 500, Phaser.Easing.linear, true)
			    }

			    restartBtnImg.loadTexture('atlas.sympho','sound_push')
		        lastTween.onComplete.add(playConcert)
	    	},1000)
    	}
    }

    function playConcert(){

    	if(inEvaluate){
    		return
    	}

        if(currentConcertId < currentQuestions){
            playInstrumentSound('instrument_'+correctSequence[currentConcertId])
            spaceGroup.children[currentConcertId].empty = true
            game.add.tween(spaceGroup.children[currentConcertId].scale).to({x:1, y:1}, 2000, Phaser.Easing.linear, true)
            game.add.tween(spaceGroup.children[currentConcertId].note.scale).to({x:1, y:1}, 2000, Phaser.Easing.linear, true).onComplete.add(playConcert)
            currentConcertId++
        }
        else{
            if(timeOn){
                startTimer(currentTime)
                if(currentTime > MIN_TIME){
                    currentTime -= DELTA_TIME
                }
            }
            currentConcertId = 0
            if(timesRestarted < MAX_TIMES_RESTART){
	            restartBtnImg.loadTexture('atlas.sympho','sound_on')
	            canRestart = true
	        }
	        else{
	        	canRestart = false
	        	restartBtnImg.alpha = 0.5
	        	restartBtnImg.inputEnabled = false
	        }
            
        }
    }

    function playInstrumentSound(key){
        sound.play(key)
    }


    function evaluate(){

        if(correctSequence[currentConcertId] == answerSequence[currentConcertId]){
            particlesArray[currentConcertId].x = spaceGroup.children[currentConcertId].x
            particlesArray[currentConcertId].y = spaceGroup.children[currentConcertId].y
            particlesArray[currentConcertId].start(true, 1000, null, 5)
            playInstrumentSound('instrument_'+correctSequence[currentConcertId])
            currentConcertId++

            if(currentConcertId >= currentQuestions){
                Coin(emptyObject,pointsBar,3)
                roundWin = true
                nextRound()
            }
            else{
                setTimeout(evaluate,2000)
            }
        }
        else{
        	playInstrumentSound('instrument_'+correctSequence[currentConcertId])
            var button = spaceGroup.children[currentConcertId].button
            var tween_1 = game.add.tween(button.spine).to({angle:20}, 100, Phaser.Easing.Cubic.Out)
            var tween_2 = game.add.tween(button.spine).to({angle:-20}, 100, Phaser.Easing.Cubic.Out)
            var tween_3 = game.add.tween(button.spine).to({angle:20}, 100, Phaser.Easing.Cubic.Out)
            var tween_4 = game.add.tween(button.spine).to({angle:-20}, 100, Phaser.Easing.Cubic.Out)
            var tween_5 = game.add.tween(button.spine).to({angle:0}, 100, Phaser.Easing.Cubic.Out)

            tween_1.chain(tween_2)
            tween_2.chain(tween_3)
            tween_3.chain(tween_4)
            tween_4.chain(tween_5)
            tween_1.start()


            var correctButton 
            for(var i = 0; i < instrumentsGroup.length; i++){
            	if(instrumentsGroup.children[i].inScene && instrumentsGroup.children[i].instrumentId == correctSequence[currentConcertId] && instrumentsGroup.children[i].currentSlot==null){
            		correctButton = instrumentsGroup.children[i]
            		break
            	}
            }

            if(correctButton.scaleTween){
            	correctButton.scaleTween.stop()
            }

            var correctTween_1 = game.add.tween(correctButton.scale).to({x:1.5, y:1.5}, 100, Phaser.Easing.Cubic.Out)
            var correctTween_2 = game.add.tween(correctButton.scale).to({x:1.2, y:1.2}, 100, Phaser.Easing.Cubic.Out)

            correctTween_1.chain(correctTween_2)
            correctTween_1.start()
            roundWin = false
            missPoint()
        }
    }

    function clickReturn(){

        if(canRestart){
	        restartBtnImg.loadTexture('atlas.sympho','sound_push')
	        timesRestarted++
	        playConcert()

	    }

    }

    function liberateButton(currentTarget){
        currentTarget.inScene = false
        currentTarget.x = -2000
        currentTarget.currentSlot = null
    }

    function clickOk(){
        instrumentsGroup.setAll('inputEnabled',false)

    	okBtnImg.loadTexture('atlas.sympho', 'ok_off')

    	if(tweenTiempo && timeOn){
	    	stopTimer()
	    }

    	okBtnImg.inputEnabled = false

        for(var i = 0; i < currentQuestions; i++){
            if(i == -1){
                return
            }
        }

        currentConcertId = 0
        inEvaluate = true
        evaluate()

    }

    function nextRound(){

        setTimeout(function(){
            var lastTween

            for(var i = 0; i < instrumentsGroup.length; i++){

                game.add.tween(instrumentsGroup.children[i].scale).from({x:instrumentsGroup.children[i].scale.x,y:instrumentsGroup.children[i].scale.y}).to({x:0, y:0}, 500, Phaser.Easing.linear, true)
            }

            for(var i = 0; i < currentQuestions; i++){
                spaceGroup.children[i].empty = true
                game.add.tween(spaceGroup.children[i].scale).from({x:1,y:1}).to({x:0, y:0}, 500, Phaser.Easing.linear, true)

                spaceGroup.children[i].note.x = spaceGroup.children[i].x
                lastTween = game.add.tween(spaceGroup.children[i].note.scale).from({x:1,y:1}).to({x:0, y:0}, 500, Phaser.Easing.linear, true)

            }

            lastTween.onComplete.add(newRound)


        }, 500)

    }

    function newRound(){
        if(currentQuestions < MAX_SPACES){
            if(roundWin)
                currentQuestions++
        }
        else{
            if(!timeOn){
               timeOn = true
               positionTimer()
            }
        }
        setRound()
        
    }



    function createScene(){
        yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)
        var scaleX = game.world.width/540

        var background = game.add.tileSprite(game.world.centerX,0,game.world.width,game.world.height/2,'atlas.sympho','background_top')
        background.anchor.setTo(0.5,0)
        backgroundGroup.add(background)

        background = backgroundGroup.create(game.world.centerX,game.world.centerY,'atlas.sympho','background_down')
        background.scale.setTo(scaleX,1.2)
        background.anchor.setTo(0.5,0)

        var partitura = backgroundGroup.create(game.world.centerX,game.world.height*0.25,'atlas.sympho','partitura')
        partitura.anchor.setTo(0.5,0.5)
        partitura.scale.setTo(1.15,1.15)

        background = backgroundGroup.create(game.world.centerX,game.world.centerY,'atlas.sympho','center')
        background.anchor.setTo(0.5,0.5)
        background.scale.setTo(scaleX,1.2)

        gameGroup = game.add.group()
        gameGroup.x = game.world.centerX
        gameGroup.y = game.world.centerY
        sceneGroup.add(gameGroup)


        buttonsGroup = game.add.group()
        buttonsGroup.x = game.world.centerX
        buttonsGroup.y = game.world.centerY
        sceneGroup.add(buttonsGroup)

        okBtnImg = buttonsGroup.create(100, 0, 'atlas.sympho', 'ok_off')
        okBtnImg.anchor.setTo(0.5, 0.5)
        okBtnImg.inputEnabled = false
        okBtnImg.alpha = 0.5 
        okBtnImg.pressed = false
        okBtnImg.events.onInputDown.add(function(){okBtnImg.loadTexture('atlas.sympho', 'ok_on')})
        okBtnImg.events.onInputUp.add(clickOk)

        restartBtnImg = buttonsGroup.create(-100, 0, 'atlas.sympho', 'sound_on')
        restartBtnImg.anchor.setTo(0.5, 0.5)
        restartBtnImg.inputEnabled = true
        restartBtnImg.pressed = false
        restartBtnImg.events.onInputDown.add(function(){restartBtnImg.loadTexture('atlas.sympho', 'sound_push')})
        restartBtnImg.events.onInputUp.add(clickReturn)

        var lines = sceneGroup.create(game.world.centerX,game.world.height*0.25,'atlas.sympho','pentagrama')
        lines.anchor.setTo(0.5,0.5)
        lines.scale.x = 1.2

        var group = game.add.group()
        group.x = game.world.centerX - 240
        group.y = game.world.centerY - 180
        var note = game.add.spine(0,0,'notes')
        note.setAnimationByName(0,"IDLE_STAFF",true)
        note.setSkinByName("normal")
        note.scale.setTo(0.3,0.3)
        group.add(note)
        sceneGroup.add(group)

        backgroundSound = game.add.audio('symphoSong')
        
        game.sound.setDecodedCallback(backgroundSound, function(){
            backgroundSound.loopFull(0.6)
        }, this);
        
        game.onPause.add(function(){
            game.sound.mute = true
        } , this);

        game.onResume.add(function(){
            game.sound.mute = false
        }, this);


        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0

        emptyObject = game.add.sprite(game.world.centerX, game.world.centerY-180,'atlas.sympho','flautin')
        emptyObject.alpha = 0
        emptyObject.anchor.setTo(0.5,0.5)
        
        initialize()

        
        createPointsBar()
        createHearts()
        
        createQuestions()

        createButtons()

        createTutorial()

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)
        backgroundSound.volume = 0.3

    
    }
    
	return {
		assets: assets,
		name: "symphoMaster",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()