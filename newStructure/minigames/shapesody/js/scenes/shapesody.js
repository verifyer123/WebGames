var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"


var shapesody = function(){

	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/shapesody/atlas.json",
                image: "images/shapesody/atlas.png"
            },
            {
                name: "atlas.time",
                json: "images/shapesody/timeAtlas.json",
                image: "images/shapesody/timeAtlas.png"
            },

        ],
        images: [
            {   name:"tutorial_image",
                file: "images/shapesody/tutorial_image.png"}
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
            {
                name: 'ocarina_circle',
                file: soundsPath + 'ocarina_1.mp3'
            },
            {
                name: 'ocarina_heart',
                file: soundsPath + 'ocarina_2.mp3'
            },
            {
                name: 'ocarina_pentagon',
                file: soundsPath + 'ocarina_3.mp3'
            },
            {
                name: 'ocarina_rhombus',
                file: soundsPath + 'ocarina_4.mp3'
            },
            {
                name: 'ocarina_square',
                file: soundsPath + 'ocarina_5.mp3'
            },
            {
                name: 'ocarina_star',
                file: soundsPath + 'ocarina_6.mp3'
            },
            {
                name: 'ocarina_trapezoid',
                file: soundsPath + 'ocarina_7.mp3'
            },
            {
                name: 'ocarina_triangle',
                file: soundsPath + 'ocarina_8.mp3'
            }

            
        ],
        spines:[
            {
                name:'arthurius',
                file:'images/spines/arthurius/arthurius.json'
            },
            {
                name:'logs',
                file:'images/spines/logs/logs.json'
            },

		]
    }

    var NUM_LIFES = 3
    var INITIAL_TIME = 15000
    var DELTA_TIME = 500
    var MIN_TIME = 5000
    var LEVELS_TO_TIMER = 2

    var DELTA_WATER = 180
    var DELTA_GRASS = 300

    var SHAPE_NAMES = ["circle","heart","pentagon","rhombus","square","star","trapezoid","triangle"]
    var BUTTONS_NUMBER = 3

    var INITIAL_DIFFICULT = 2.9
    var DELTA_DIFFICULT = 0.2
    var MAX_DIFFICULT = 5

    var DELTA_SECUENCE = 100
    var DELTA_BUTTON_SECUENCE = 150

    var TIME_NEXT_SOUND = 500
    var SECUENCE_INITIAL_SCALE = 0.7
    var SECUENCE_COMPLETE_SCALE = 1

    var BLINK_TIMES = 3

    var SPEED_BACKGROUND = 3

    var lives
	var sceneGroup = null
    var gameIndex = 184
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

    var water

    var arthuriusSpine

    var currentShapes

    var ribbonLeft, ribbonRight, ribbonBack

    var secuenceGroup
    var buttonGroup
    var backgroundMoveGroup
    var logsGroup 

    var currentDifficult
    var correctSecuence, secuenceIndex

    var buttonContainer
    var currentLog

    var currentBlinks 
    var moveActivated

    var backgroundHeigth 
    var initialY 

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
        correctSecuence = []
        secuenceIndex = 0

        currentDifficult = INITIAL_DIFFICULT
        moveActivated = false

        loadSounds()
        
	}

    function preload(){
        game.stage.disableVisibilityChange = false;

        game.load.spritesheet("coin", 'images/shapesody/coin.png', 122, 123, 12)

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

    function positionTimer(){
      clock=game.add.image(game.world.centerX-150,40,"atlas.time","clock")
      clock.scale.setTo(.7)
      timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
      timeBar.scale.setTo(8,.45)
      sceneGroup.add(clock)
      sceneGroup.add(timeBar)
      timeBar.alpha=1
      clock.alpha=1
    }

    function stopTimer(){
        if(tweenTiempo!=null){
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
           if(lives>0){
                setTimeout(nextRound,500)
                //nextRound()
           }
       })
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
    	water.tilePosition.x +=0.1
    	water.tilePosition.y +=0.1
    	if(moveActivated){
    		updateMove()
    	}
    }

    function updateMove(){
    	for(var i = 0; i < backgroundMoveGroup.length; i++){
    		backgroundMoveGroup.children[i].y -=SPEED_BACKGROUND
    		if(backgroundMoveGroup.children[i].y + backgroundMoveGroup.children[i].height < 0){
    			backgroundMoveGroup.children[i].y += backgroundHeigth
    		}
    	}

    	for(var i = 0; i < logsGroup.length; i++){
    		if(logsGroup.children[i].visible){
	    		logsGroup.children[i].y -=SPEED_BACKGROUND
	    		if(logsGroup.children[i].y < -300){
	    			logsGroup.children[i].visible = false
                    logsGroup.children[i].setAnimationByName(0,"win",false)
	    		}
	    	}
    	}

    	arthuriusSpine.y -= SPEED_BACKGROUND
    	if(arthuriusSpine.y < initialY){
    		var delta = initialY - arthuriusSpine.y
    		arthuriusSpine.y +=delta
    		for(var i = 0; i < backgroundMoveGroup.length; i++){
    			backgroundMoveGroup.children[i].y += delta
    		}
    		moveActivated = false
    		nextRound()
    	}
    }
    

    function createTutorial(){
        
        tutoGroup = game.add.group()

        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

        
    }

    function setRound(){
        decideShapes()

        correctSecuence = []
        secuenceIndex = 0

        var difficult = Math.floor(currentDifficult)

        if(currentDifficult < MAX_DIFFICULT){
        	currentDifficult+=DELTA_DIFFICULT
        }
        arthuriusSpine.setAnimationByName(0,"play",true)
        var initX = -((difficult-1)/2)*DELTA_SECUENCE
        for(var i = 0; i < difficult; i++){
        	var x = initX + (DELTA_SECUENCE*i) 
        	getSecuence(x)
        }	

        if(ribbonLeft.x != game.world.centerX + correctSecuence[0].x + 60){
        	game.add.tween(ribbonLeft).to({x:game.world.centerX+correctSecuence[0].x+60},200,Phaser.Easing.linear,true)
        	game.add.tween(ribbonRight).to({x:game.world.centerX+correctSecuence[correctSecuence.length-1].x-60},200,Phaser.Easing.linear,true)
        	ribbonBack.scale.setTo(difficult-0.5,1)
        }


        initX = -DELTA_BUTTON_SECUENCE
        for(var i = 0; i < 3; i ++){
        	var x = initX + (DELTA_BUTTON_SECUENCE*i) 
        	getButton(i,x)
        }

        startScecuence()

        if(currentLevel > LEVELS_TO_TIMER){
            if(!timeOn){
                positionTimer()
                timeOn = true
            }

            
        }

        currentLevel++

    }

    function startScecuence(){
    	if(secuenceIndex<correctSecuence.length){
	    	game.add.tween(correctSecuence[secuenceIndex].scale).to({x:SECUENCE_INITIAL_SCALE,y:SECUENCE_INITIAL_SCALE},200,Phaser.Easing.linear,true)
	    	//tween.onComplete.add(startScecuence)
	    	sound.play("ocarina_"+correctSecuence[secuenceIndex].name)
	    	secuenceIndex++

	    	setTimeout(startScecuence,TIME_NEXT_SOUND)
	    	//dar play a sound
	    }
	    else{
	    	showBar()
	    	secuenceIndex = 0
	    	canTouch = true
	    	arthuriusSpine.setAnimationByName(0,"idle",false)
            if(timeOn){
                startTimer(currentTime)

                if(currentTime>MIN_TIME){
                    currentTime-=DELTA_TIME
                }
            }
	    	if(inTutorial!=-1){
	    		evalTutorial()
	    	}
	    }
    }

    function getSecuence(x){
    	var random = game.rnd.integerInRange(0,2)
    	
    	var textureName = currentShapes[random]

    	for(var i = 0; i < secuenceGroup.length; i++){
    		if(!secuenceGroup.children[i].visible){
    			var object = secuenceGroup.children[i]
    			object.visible = true
    			object.scale.setTo(0)
    			object.x = x
    			object.id = random
    			object.name = textureName
    			object.shape.loadTexture("atlas.game",textureName)
    			correctSecuence.push(object)
    			return
    		}
    	}

    	var object = secuenceGroup.create(x,0,"atlas.game","contianer_shape")
    	object.anchor.setTo(0.5)
    	object.scale.setTo(0)
    	object.id = random
    	object.name = textureName
    	correctSecuence.push(object)

    	var shape = secuenceGroup.create(0,0,"atlas.game",textureName)
    	shape.anchor.setTo(0.5)
    	object.addChild(shape)
    	object.shape = shape


    }

    function getButton(i,x){
    	var textureName = currentShapes[i]
    	for(var i = 0; i < buttonGroup.length; i++){
    		if(!buttonGroup.children[i].visible){
    			var object = buttonGroup.children[i]
    			object.visible = true
    			object.x = x
    			object.shape.loadTexture("atlas.game",textureName)
    			object.id = i
    			object.name = textureName
    			return
    		}
    	}

    	var object = buttonGroup.create(x,0,"atlas.game","container_interact")
    	object.anchor.setTo(0.5)
    	object.inputEnabled = true
    	object.id = i
    	object.name = textureName
    	object.events.onInputDown.add(clickButton,this)
    	//object.events.onInputUp.add(exitButton,this)
    	var shape = buttonGroup.create(0,0,"atlas.game",textureName)
    	shape.anchor.setTo(0.5)
    	object.addChild(shape)
    	object.shape = shape
    }


    function getLogs(y,anim){
    	var logs = null
    	for(var i = 0; i < logsGroup.length; i++){
    		if(!logsGroup.children[i].visible){
    			logs = logsGroup.children[i]
    			break
    		}
    	}

    	if(logs==null){
    		logs = game.add.spine(game.world.centerX,y,"logs")
    		logs.setSkinByName("normal")
    		logsGroup.add(logs)
    	}


    	logs.y = y
    	logs.visible = true
    	anim = logs.setAnimationByName(0,anim,false)

        console.log(logs)

    	return {anim:anim,log:logs}

    }



    function evalTutorial(){
    	hand.visible = true
    	hand.loadTexture("atlas.game","handDown")
        hand.x = game.world.centerX - (DELTA_BUTTON_SECUENCE) + (correctSecuence[inTutorial].id * DELTA_BUTTON_SECUENCE)+50
        hand.y = buttonContainer.y + 100+50
        tutorialTimeout =  setTimeout(function(){
        	hand.loadTexture("atlas.game","handUp")
        	 tutorialTimeout =  setTimeout(evalTutorial,500)
        },500)
    }

    function clickButton(button){

    	if(!canTouch){
    		return
    	}

    	sound.play("ocarina_"+button.name)

        if(correctSecuence[secuenceIndex].id == button.id){
        	game.add.tween(correctSecuence[secuenceIndex].scale).to({x:SECUENCE_COMPLETE_SCALE,y:SECUENCE_COMPLETE_SCALE},100,Phaser.Easing.linear,true)
        	secuenceIndex++
        	
        	if(inTutorial!=-1){
        		clearTimeout(tutorialTimeout)
        		inTutorial++
        	}

        	if(secuenceIndex==correctSecuence.length){
        		inTutorial = -1
        		hand.visible = false
        		hideBar()
        		if(timeOn){
                    stopTimer()
                }
        		var anim = getLogs(arthuriusSpine.y+250, "correct")
        		anim.anim.onComplete = function(){
        			Coin(arthuriusSpine,pointsBar,100)
        			startWalk(anim.log,true)
        			for(var i = 0; i < correctSecuence.length; i++){
        				game.add.tween(correctSecuence[i].scale).to({x:0,y:0},300,Phaser.Easing.linear,true)
        			}
        		}
        		canTouch = false
        	}
        	else{
        		if(inTutorial!=-1){
	        		evalTutorial()
	        	}
        	}

        }
        else{

        	if(inTutorial!=-1){
        		return
        	}

            if(timeOn){
                stopTimer()
            }

        	canTouch = false
        	hideBar()
        	arthuriusSpine.setAnimationByName(0,"play",false)
        	var anim = getLogs(arthuriusSpine.y+250, "wrong")
        	anim.anim.onComplete = function(){
    			startWalk(anim.log,false)
    		}
        }


    }

    function startWalk(logs,correct){
    	arthuriusSpine.setAnimationByName(0,"play",true)
    	if(!correct){
    		var tween = game.add.tween(arthuriusSpine).to({y:arthuriusSpine.y+150},1000,Phaser.Easing.linear,true)
    		tween.onComplete.add(function(){
    			setTimeout(function(){
	    			var anim = arthuriusSpine.setAnimationByName(0,"lose",false)
	    			game.add.tween(arthuriusSpine.scale).to({x:0,y:0},600,Phaser.Easing.linear,true)
	    			anim.onComplete = function(){
	    				arthuriusSpine.y = arthuriusSpine.y-150
	    				arthuriusSpine.scale.setTo(0.25)
	    				arthuriusSpine.setAnimationByName(0,"idle",true)
	    				blinkYogotar()
	    			}
    			},600)
    			logs.setAnimationByName(0,"lose",false).onComplete = function(){
                    logs.visible = false
                }

    			missPoint()
    		})
    	}
    	else{
    		var tween = game.add.tween(arthuriusSpine).to({y:arthuriusSpine.y+480},1000,Phaser.Easing.linear,true)
    		tween.onComplete.add(function(){
    			arthuriusSpine.setAnimationByName(0,"idle",true)
    			moveActivated = true

    		})
    	}
    }



    function blinkYogotar(){
    	if(currentBlinks < BLINK_TIMES){
    		if(arthuriusSpine.visible){
    			arthuriusSpine.visble = false
    		}
    		else{
    			arthuriusSpine.visble = true
    			currentBlinks++
    		}	

    		setTimeout(function(){
    			blinkYogotar()

    		},1000)
    	}
    	else{
    		currentDifficult-=DELTA_DIFFICULT
    		nextRound()
    	}
    }

    function nextRound(){
    	for(var i = 0; i < secuenceGroup.length; i++){
			secuenceGroup.children[i].visible = false
		}

		for(var i = 0; i < buttonGroup.length; i++){
			buttonGroup.children[i].visible = false
		}

		setRound()
    }



    function exitButton(button){
    	button.loadTexture("atlas.game","container_interact")
    }

    function decideShapes(){

    	currentShapes = []
    	var temp = SHAPE_NAMES.slice()
    	for(var i = 0; i < BUTTONS_NUMBER; i++){
    		var randomIndex = game.rnd.integerInRange(0,temp.length-1)
    		currentShapes.push(temp[randomIndex])
    		temp.splice(randomIndex,1)
    	}

    }

  	function showBar(){
  		game.add.tween(buttonContainer).to({y:game.world.height-200},300,Phaser.Easing.linear,true)
  	}

  	function hideBar(){
  		game.add.tween(buttonContainer).to({y:game.world.height},300,Phaser.Easing.linear,true)
  	}
    
    
    function createBackground(){

        water = game.add.tileSprite(0,0,game.world.width,game.world.height, "atlas.game","water")
        backgroundGroup.add(water)

        backgroundMoveGroup = game.add.group()
    	backgroundGroup.add(backgroundMoveGroup)

        var currentY = 0
        for(var i = 0; i < 3; i ++){
        	var bottom = game.add.tileSprite(0,currentY,game.world.width,122,"atlas.game","cliff_bottom")
        	backgroundMoveGroup.add(bottom)
        	bottom.anchor.setTo(0,0.5)

        	currentY += DELTA_WATER

        	var grass = game.add.tileSprite(0,currentY,game.world.width,DELTA_GRASS,"atlas.game","grass")
        	backgroundMoveGroup.add(grass)

        	var top = game.add.tileSprite(0,currentY,game.world.width,82,"atlas.game","cliff_top")
        	backgroundMoveGroup.add(top)
        	top.anchor.setTo(0,0.5)

        	currentY += DELTA_GRASS
        }

        backgroundMoveGroup.bringToTop(backgroundMoveGroup.children[0])

        backgroundHeigth = currentY

        logsGroup = game.add.group()
        backgroundGroup.add(logsGroup)

        arthuriusSpine = game.add.spine(game.world.centerX,DELTA_WATER+(DELTA_GRASS/1.3),"arthurius")
        sceneGroup.add(arthuriusSpine)
        arthuriusSpine.setSkinByName("normal")
        arthuriusSpine.setAnimationByName(0,"idle",true)
        arthuriusSpine.scale.setTo(0.25)
        initialY = arthuriusSpine.y

        buttonContainer = game.add.tileSprite(0,game.world.height,game.world.width,287,"atlas.game","container_2")
        sceneGroup.add(buttonContainer)

        ribbonBack = sceneGroup.create(game.world.centerX,168,"atlas.game","container_middle")
        ribbonBack.anchor.setTo(0.5)
        ribbonBack.scale.setTo(1,1)


        ribbonLeft = sceneGroup.create(game.world.centerX+10,190,"atlas.game","container_end_left")
        ribbonLeft.anchor.setTo(1,0.5)

        ribbonRight = sceneGroup.create(game.world.centerX-10,190,"atlas.game","container_end_rigth")
        ribbonRight.anchor.setTo(0,0.5)

        secuenceGroup = game.add.group()
        sceneGroup.add(secuenceGroup)
        secuenceGroup.x = game.world.centerX
        secuenceGroup.y = 165

        buttonGroup = game.add.group()
        sceneGroup.add(buttonGroup)
        buttonGroup.x = game.world.centerX
        buttonGroup.y = 100

        buttonContainer.addChild(buttonGroup)

    }
    
    function createScene(){

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        createBackground()

        backgroundSound = game.add.audio('gameSong')
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

        initialize()

        createPointsBar()
        createHearts()
        
        correctParticle = createPart('atlas.game','starParicle')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)

        hand = sceneGroup.create(0,0,'atlas.game','handUp')
        hand.anchor.setTo(0.5)
        hand.visible = false

        createTutorial()
    
    }
    
	return {
		assets: assets,
		name: "shapesody",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()
