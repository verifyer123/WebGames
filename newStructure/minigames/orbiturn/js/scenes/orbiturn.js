var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"


var orbiturn = function(){

    var localizationData = {
        "EN":{
            "hold":"HOLD",
            "release":"RELEASE"
        },

        "ES":{
            "hold":"MANTENER",
            "release":"LIBERAR"
        }
    }

    var GAME_STATE = {
        MOVEMENT_RIGTH:0,
        MOVEMENT_LEFT:1,
        MOVEMENT_OBJECT:2
    }

	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/orbiturn/atlas.json",
                image: "images/orbiturn/atlas.png"
            },

        ],
        images: [
            {   name:"tutorial_image",
                file: "images/orbiturn/tutorial_image_%input.png"}
		],
		sounds: [
            {	name: "pop",
                file: soundsPath + "pop.mp3"},
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
                file: soundsPath + 'songs/mysterious_garden.mp3'
            },

            
        ],
        spines:[
            {
                name:'ship',
                file:'images/spines/ship/ship.json'
            },
            {
                name:'dust',
                file:'images/spines/dust/dust.json'
            },

		]
    }

    var NUM_LIFES = 3
    var INITIAL_TIME = 15000
    var DELTA_TIME = 500
    var MIN_TIME = 5000
    var LEVELS_TO_TIMER = 2

    var INITIAL_VELOCITY = 0.5
    var DELTA_VELOCITY = 0.05
    var MAX_VELOCITY = 2

    var SHAPES_NAME = ["circle","rectangle","triangle","trapezium","rhombus","square","trapezoid","rhomboid"]
    var DELTA_ANGLE = 80
    var INITIAL_APPEAR_TIME = 3000
    var DELTA_APPEAR_TIME = 150
    var MIN_APPEAR_TIME = 1000

    var SCALE_YOGOTAR = 0.5
    var SHAPE_SCALE =1
    var POSITION_OBJECT = -150
    var LAPS_TO_CHANGE = 5
    var MAX_SAME_SHAPE = 3
    var OFFSET_SHAPE = 40


    var lives
	var sceneGroup = null
    var gameIndex = 189
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

    var inTutorial
    var hand
    var canTouch
    var tutorialTween
    var tutorialTimeout

    var planet
    var yogotarGroup, yogotar

    var currentVelocity 
    var currentShapes
    var shape1, shape2
    var gameplayState 

    var currentAppearTime
    var objectsGroup

    var gameActive 
    var currentObjects, maxObjects
    var needChange

    var dust
    var objectTimeout
    var currentSameShape
    var lastShape
    var firstRound
    var objectTutorialAppeared 

    var holdTutorial, releaseTutorial, holdCircle


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
        canTouch = false

        inTutorial = 0

        currentVelocity = INITIAL_VELOCITY

        currentShapes = SHAPES_NAME.slice()
        gameplayState = GAME_STATE.MOVEMENT_RIGTH

        currentAppearTime = INITIAL_APPEAR_TIME
        gameActive = false
        needChange = false

        currentSameShape = 0
        lastShape = ""
        firstRound = true

        objectTutorialAppeared = false

        loadSounds()
        
	}

    function preload(){
        game.stage.disableVisibilityChange = false;

        game.load.spritesheet("coin", 'images/orbiturn/coin.png', 122, 123, 12)

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
       
       
       //objectBorn= Objeto de donde nacen
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
        inputsEnabled = true
        setRound()

    }
    
    function update() {
        planet.angle+=0.2
        if(!gameActive){
            return
        }

        var canMove = updateInput()

        if(holdTutorial.visible){
            holdCircle.angle+=1
        }

        

        if(!canMove){
        	return
        }

        switch(gameplayState){
            case GAME_STATE.MOVEMENT_RIGTH:
            yogotarGroup.angle += currentVelocity
            if(yogotarGroup.angle > 360){
                yogotarGroup.angle -=360
            }
            break
            case GAME_STATE.MOVEMENT_LEFT:
            yogotarGroup.angle -= currentVelocity
            if(yogotarGroup.angle < 0){
                yogotarGroup.angle +=360
            }
            break
            case GAME_STATE.MOVEMENT_OBJECT:
            for(var i = 0; i < objectsGroup.length; i++){
                if(objectsGroup.children[i].visible){
                    objectsGroup.children[i].angle += objectsGroup.children[i].direction * currentVelocity
                    if(objectsGroup.children[i].angle < 0){
		                objectsGroup.children[i].angle +=360
		            }
		            else if(objectsGroup.children[i].angle > 360){
		            	objectsGroup.children[i].angle -=360
		            }
                }
            }
            break
        }

        

        collidePlayer()


    }

    function updateInput(){

    	var canMove = true
    	if(game.input.activePointer.isDown){
            if(!yogotar.isDown){
                yogotar.setSkinByName(shape2)
                yogotarGroup.shape.loadTexture("atlas.game",shape2)
                dust.setAnimationByName(0,"transform",false)
                yogotar.isDown = true
                yogotar.setToSetupPose();
            }
            if(inTutorial!=-1 && objectTutorialAppeared){
	            if(inTutorial==1){
	            	canMove = false
	            	evalTutorial()
	            }
	            else{
	            	
	            	holdTutorial.visible = false
	            }
	        }
        }
        else{
            if(yogotar.isDown){
                yogotar.setSkinByName(shape1)
                yogotarGroup.shape.loadTexture("atlas.game",shape1)
                dust.setAnimationByName(0,"transform",false)
                yogotar.isDown = false
                yogotar.setToSetupPose();
            }

            if(inTutorial!=-1 && objectTutorialAppeared){
	            if(inTutorial==0 || inTutorial == 2){
	            	canMove = false
	            	evalTutorial()
	            }
	            else{
	            	releaseTutorial.visible = false
	            }
	        }
        }

        return canMove


    }
    

    function createTutorial(){
        
        tutoGroup = game.add.group()

        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

    }

    function setRound(){
        
        gameActive = true
        needChange = false
        yogotar.setToSetupPose()
        currentObjects =0
        maxObjects = game.rnd.integerInRange(8,10)
        var index 
        if(!firstRound){
	        index = game.rnd.integerInRange(0,2)
	        shape1 = currentShapes[index]
	        currentShapes.splice(index, 1)
	        //firstRound = false
	    }

	   	

        index = game.rnd.integerInRange(0,2)
        shape2 = currentShapes[index]
        currentShapes.splice(index, 1)
        if(!firstRound){
	        if(yogotar.isDown){
	            yogotar.setSkinByName(shape2)
	            yogotarGroup.shape.loadTexture("atlas.game",shape2)
	            dust.setAnimationByName(0,"transform")
	        }
	        else{
	            yogotar.setSkinByName(shape1)
	            yogotarGroup.shape.loadTexture("atlas.game",shape1)
	            dust.setAnimationByName(0,"transform")
	        }
	    }
	    else{
	    	firstRound = false
	    }

        yogotar.setToSetupPose()

        if(currentShapes.length == 0){
            currentShapes = SHAPES_NAME.slice()
        }

        if(currentLevel < 2){
            yogotar.setAnimationByName(0,"run",true)
            var random = game.rnd.integerInRange(0,1)
            if(random == 0){
                gameplayState = GAME_STATE.MOVEMENT_RIGTH
                yogotar.scale.setTo(SCALE_YOGOTAR)
                yogotarGroup.shape.scale.setTo(SHAPE_SCALE)
                yogotarGroup.shape.x = - OFFSET_SHAPE
            }
            else{
                gameplayState = GAME_STATE.MOVEMENT_LEFT
                yogotar.scale.setTo(-SCALE_YOGOTAR,SCALE_YOGOTAR)
                yogotarGroup.shape.scale.setTo(-SHAPE_SCALE,SHAPE_SCALE)
                yogotarGroup.shape.x = OFFSET_SHAPE


            }
            currentLevel++
        }
        else{
        	currentLevel = 0
            yogotar.setAnimationByName(0,"idle",true)
            gameplayState = GAME_STATE.MOVEMENT_OBJECT

            setTimeout(function(){
            	yogotarGroup.alpha = 0
            },300)
            gameActive = false
            dust.setAnimationByName(0,"transform",false).onComplete = function(){
            	yogotarGroup.angle = 0
            	dust.setAnimationByName(0,"transform",false).onComplete = null
            	setTimeout(function(){
            		gameActive = true
	            	yogotarGroup.alpha = 1
	            },300)
            }
        }
        
	    objectTimeout = setTimeout(createObject,currentAppearTime)
	    

       	
    }

    function createObject(){
    	//console.log("createObject")
    	if(lives<0){
    		return
    	}

        var object = null
        var currentShape
        var rnd = game.rnd.integerInRange(0,1)

        if(inTutorial!=-1){
        	switch(inTutorial){
	    		case 0:
	    		rnd = 1
	    		break
	    		case 1:
	    		rnd = 0
	    		break
	    		case 2:
	    		rnd = 1
	    		break
	    	}
        }

        if(rnd == 0){
            currentShape = shape1
        }
        else{
            currentShape = shape2
        }

        

        if(lastShape == currentShape){
        	currentSameShape++
        	if(currentSameShape >= MAX_SAME_SHAPE){
        		if(rnd == 0){
		            currentShape = shape2
		           	rnd = 1
		        }
		        else{
		            currentShape = shape1
		            rnd = 0
		        }
		        lastShape = currentShape
		        currentSameShape = 0
        	}
        }
        else{
        	lastShape = currentShape
        }

        for(var i = 0; i < objectsGroup.length; i++){
            if(!objectsGroup.children[i].visible){
                object = objectsGroup.children[i]
                object.visible = true
                object.x = 0
                object.shape.loadTexture("atlas.game",currentShape)
                break
            }
        }

        if(object == null){
            object = game.add.group()
            objectsGroup.add(object)
            var shape =  objectsGroup.create(0,POSITION_OBJECT - 70,"atlas.game",currentShape)
            shape.anchor.setTo(0.5)
            object.add(shape)
            object.shape = shape
        }



        object.type = rnd
        object.evaluated = false
        objectTutorialAppeared = true

        switch(gameplayState){
            case GAME_STATE.MOVEMENT_RIGTH:
            object.scale.setTo(-1,1)
            object.angle = yogotarGroup.angle + DELTA_ANGLE
            if(object.angle>360){
                object.angle -=360
            }
            break
            case GAME_STATE.MOVEMENT_LEFT:
            object.angle = yogotarGroup.angle - DELTA_ANGLE
            if(object.angle<0){
                object.angle +=360
            }

            object.scale.setTo(-1,1)
            break
            case GAME_STATE.MOVEMENT_OBJECT:
            object.angle = yogotarGroup.angle + 180
            if(object.angle > 360){
                object.angle -= 360
            }
            object.direction = game.rnd.integerInRange(0,1)
            if(object.direction == 0){
                object.direction = -1
            }

            if(yogotar.scale.x < 0){
                object.scale.setTo(-1,1)
            }
            else{
                object.scale.setTo(-1,1)
            }
            break
        }
        currentObjects++
        if(currentObjects >= maxObjects){
            needChange = true
        }
        else{
            if(currentAppearTime > MIN_APPEAR_TIME){
                currentAppearTime -= DELTA_APPEAR_TIME
            }
           	if(inTutorial==-1){
            	objectTimeout = setTimeout(createObject,currentAppearTime)
            }
        }

        //console.log(yogotarGroup.angle, object.angle)

    }

    
    function collidePlayer(){
        var object
        var isVisible = false
        for(var i = 0; i < objectsGroup.length; i++){
            if(objectsGroup.children[i].visible){
            	isVisible = true
            	if(!objectsGroup.children[i].evaluated){
            		objectsGroup.children[i].evaluated = true
            		continue
            	}
                
                object = objectsGroup.children[i]

                var ang = Math.abs(object.angle - yogotarGroup.angle)

                var collide = checkOverlap(yogotarGroup.shape,object.shape)
                

                if(collide){

                	objectTutorialAppeared = false
                	if(inTutorial!=-1){
                		objectTimeout = setTimeout(createObject,currentAppearTime)
                	}
                	object.visible = false
                	object.x = 1000

                	if(inTutorial!=-1){
                		inTutorial++
                		if(inTutorial>=3){
                			inTutorial = -1
                		}
                	}

                    if((!yogotar.isDown && object.type == 0) || (yogotar.isDown && object.type == 1)){
                        Coin(yogotarGroup,pointsBar,100)
                        

                        if(currentVelocity < MAX_VELOCITY){
                        	currentVelocity += DELTA_VELOCITY
                        }

                    }
                    else{
                    	
                        missPoint()
                        gameActive = false

                        if(objectTimeout!=null){
                        	clearTimeout(objectTimeout)
                        }

                        if(lives > 0){
                            yogotar.setAnimationByName(0,"hit",false).onComplete = function(){
                                gameActive = true
                                yogotar.setAnimationByName(0,"run",true)
                                objectTimeout = setTimeout(createObject,currentAppearTime)
                            }
                        }else{
                            yogotar.setAnimationByName(0,"lose",false)
                        }

                        
                    }
                }
            }
        }

        if(!isVisible && needChange){
            setRound()
        }
    }


    function evalTutorial(){
    	switch(inTutorial){
    		case 0:
    		holdTutorial.visible = true
    		break
    		case 1:
    		releaseTutorial.visible = true
    		break
    		case 2:
    		holdTutorial.visible = true
    		break
    		default:
    		inTutorial = -1
    		break
    	}
    }

    

    
    function createBackground(){

        var background = backgroundGroup.create(game.world.centerX,game.world.centerY,"atlas.game","fondo")
        background.anchor.setTo(0.5)

        var w = game.world.width/background.width
        var h = game.world.height/background.height

        if(w >1 || h>1){
            if(w > h){
                background.scale.setTo(w)
            }
            else{
                background.scale.setTo(h)
            }
        }

        planet = backgroundGroup.create(game.world.centerX, game.world.centerY, "atlas.game","planet"+game.rnd.integerInRange(1,3))
        planet.anchor.setTo(0.5)

        yogotarGroup = game.add.group()
        sceneGroup.add(yogotarGroup)
        yogotarGroup.x = game.world.centerX
        yogotarGroup.y = game.world.centerY

        var index = game.rnd.integerInRange(0,currentShapes.length-1)
        shape1 = currentShapes[index]
        currentShapes.splice(index, 1)
       	//console.log(shape1)

        yogotar = game.add.spine(0,POSITION_OBJECT,"ship")
        yogotar.scale.setTo(0.5)
        yogotarGroup.add(yogotar)
        yogotar.setSkinByName(shape1)
        yogotar.setAnimationByName(0,"run",true)
        yogotar.isDown = false

        var shape = sceneGroup.create(-OFFSET_SHAPE,POSITION_OBJECT-70,"atlas.game",shape1)
        shape.anchor.setTo(0,0.5)
        shape.alpha = 0
        shape.scale.setTo(SHAPE_SCALE)
        yogotarGroup.add(shape)
        yogotarGroup.shape = shape

        dust = game.add.spine(0,POSITION_OBJECT,"dust")
        dust.scale.setTo(0.5)
        dust.setSkinByName("normal")
        yogotarGroup.add(dust)

        objectsGroup = game.add.group()
        objectsGroup.x = game.world.centerX
        objectsGroup.y = game.world.centerY
        sceneGroup.add(objectsGroup)

    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
    
    function createScene(){

        sceneGroup = game.add.group()
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        initialize()
        createBackground()

        backgroundSound = game.add.audio('gameSong')
        game.sound.setDecodedCallback(backgroundSound, function(){
            backgroundSound.loopFull(0.6)
        }, this);

        game.onPause.removeAll()
        game.onPause.add(function(){
        	if(objectTimeout!=null && inTutorial==-1){
                clearTimeout(objectTimeout)
            }
            game.sound.mute = true
        } , this);


        game.onResume.removeAll()
        game.onResume.add(function(){
        	if(gameActive && lives>0 && inTutorial==-1){
    			objectTimeout = setTimeout(createObject,currentAppearTime)
    		}
            game.sound.mute = false
        }, this);


        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0

        

        createPointsBar()
        createHearts()
        
        correctParticle = createPart('atlas.game','starParicle')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)

        holdTutorial = game.add.group()
        sceneGroup.add(holdTutorial)

        
        var deltaLine = 50
        var circlebtm = game.add.bitmapData(200,200);
        circlebtm.ctx.beginPath();
        circlebtm.ctx.lineWidth = "5";        
        circlebtm.ctx.strokeStyle = 'white';     
        circlebtm.ctx.setLineDash([12]);            
        circlebtm.ctx.arc(100,100,50,0,2*Math.PI,false);        
        circlebtm.ctx.stroke();       
        circlebtm.ctx.closePath();      


        holdCircle = holdTutorial.create(game.world.centerX-100,game.world.centerY+300,circlebtm)
        holdCircle.anchor.setTo(0.5)

        var handHold = holdTutorial.create(game.world.centerX-60,game.world.centerY+330,'atlas.game','handDown')
        handHold.anchor.setTo(0.5)

        var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var holdText = new Phaser.Text(sceneGroup.game,0, 18, localizationData[localization.getLanguage()]["hold"], fontStyle)
        holdText.x = game.world.centerX
        holdText.y = game.world.centerY+280
        holdTutorial.add(holdText)
        holdText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 0);
        holdText.angle = 10

        holdTutorial.visible = false


        releaseTutorial = game.add.group()
        sceneGroup.add(releaseTutorial)

        var handRelease = releaseTutorial.create(game.world.centerX-60,game.world.centerY+330,'atlas.game','handUp')
        handRelease.anchor.setTo(0.5)

        var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var releaseText = new Phaser.Text(sceneGroup.game,0, 18, localizationData[localization.getLanguage()]["release"], fontStyle)
        releaseText.x = game.world.centerX
        releaseText.y = game.world.centerY+280
        releaseTutorial.add(releaseText)
        releaseText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 0);
        releaseText.angle = 10

        releaseTutorial.visible = false


        createTutorial()
    
    }
    
	return {
		assets: assets,
		name: "orbiturn",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()
