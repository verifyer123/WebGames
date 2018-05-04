
var soundsPath = "../../shared/minigames/sounds/"


var smoothieLoops = function(){


	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/smoothieLoops/atlas.json?v4",
                image: "images/smoothieLoops/atlas.png"
            },
            {   
                name: "atlas.time",
                json: "images/smoothieLoops/timeAtlas.json",
                image: "images/smoothieLoops/timeAtlas.png"
            },
        ],
        images: [
            /*{
                name:'tutorial_image',
                file:"images/smoothieLoops/tutorial_image.png"
            }*/
		],
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
                file: soundsPath + "error.mp3"
            },
            {   name: "combo",
                file: soundsPath + "combo.mp3"},
            {
                name:'smartSong',
                file: soundsPath + 'songs/childrenbit.mp3'
            },
            {
            	name:'workingMachine',
            	file:soundsPath+'cashRegister.mp3'
            },
            {
                name:'blend',
                file:soundsPath+'blendingSound.mp3'
            },
            {
                name:'drop',
                file:soundsPath+'waterDrop.mp3'
            },
            {
                name:'pouring',
                file:soundsPath+'pouring.mp3'
            }

		],
        spines:[
            {
                name: "dinamita",
                file: "images/spines/dinamita/dinamita.json"
            },
            {
                name: "smootmachine",
                file: "images/spines/smootmachine/smoothiemachine.json?v2"
            }
        ]
    }

    var NUM_LIFES = 1
    var LEVEL_TIMER = 2
    var INITIAL_TIME = 15000
    var DELTA_TIME = 100
    var MIN_TIME = 10000
    var MAX_DRINKS = 3

    var INITI_POS
    var DELTA_BUTTON = 70

    var TUTORIAL_TWEEN_VELOCITY = 500
    var BOARD_BUTTONS_SCALE = 0.7

    var lives
	var sceneGroup = null
    var gameIndex = 152
    var tutoGroup
    var backgroundSound
    var timeValue
    var numPoints
    var gameGroup
    var heartsGroup
    var pointsBar
    var gameActive = false

    var timeOn = false
    var clock, tweenTiempo, timeBar
    var currentLevel
    var currentTime

    var currentButtonSelected
    var hand
    var inTutorial
    var tutorialTween

    var yogotar
    var machineSpine

    var loopText
    var buttons_Area

    var arrayButtons

    var bananaSecuence = [0,1,3,2]
    var strawberrySecuence = [0,1,4,2]
    var coffeeSecuence = [0,1,5,2]

    var correctSecuence

    var currentSecuence

    var drinkType 
    var drinkCount

    var playedLoops
    var currentIngredientAnimation

    var okBtn
    var inAnimation

    var tutorialButtons

    var loopButton

    var lButton

    var dialog
    var rectAnswer

    var clouds

    var boardGroup
    var boardImageFruit
    var boardImageSmoothie

    var boardButtons
    var boardTween
    var tutorialBoardTween
    var tutorialButtonTween
    var errorTween


	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = NUM_LIFES
        numPoints = 0

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        
        currentLevel = 0
        timeOn = false

        inTutorial = 0
        arrayButtons = []
        playedLoops = 0

        boardImages = []
        boardButtons = []

        currentTime = INITIAL_TIME

        loadSounds()
	}


    function preload(){

        game.stage.disableVisibilityChange = false;

        game.load.spritesheet("coin", 'images/smoothieLoops/coin.png', 122, 123, 12)
        game.load.image("tutorial_image","images/smoothieLoops/tutorial_image_"+localization.getLanguage()+".png")
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
      clock=game.add.image(game.world.centerX-150,20,"atlas.time","clock")
      clock.scale.setTo(.7)
      timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
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
      game.add.tween(timeBar.scale).to({x:8,y:.45}, 500, Phaser.Easing.Linear.Out, true, 100)
    }

    function startTimer(time){
       tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
       tweenTiempo.onComplete.add(function(){
       		smoothieBad()
           // operationGroup.visible = false
           //setTimeout(setRound,700)
       })
    }


    function Coin(objectBorn,objectDestiny,time){
       
       
       //objectBorn= Objeto de donde nacen
       coins.x=objectBorn.x
       coins.y=objectBorn.y



        correctParticle.x = objectBorn.x
        correctParticle.y = objectBorn.y
        correctParticle.start(true, 1000, null, 5)

       game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
       game.add.tween(coins).to({y:objectBorn.y-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
           game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
               coins.x=objectBorn.centerX
               coins.y=objectBorn.centerY
               addPoint(1)
           })
       })
    }

    function stopGame(){
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
        console.log("miss point here")
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
    
    function update() {

        clouds.tilePosition.x -=0.1

        if(!gameActive){
        	return
        }

        updateTouch()
    }

    function updateTouch(){
        if(game.input.activePointer.isDown){
        	if(currentButtonSelected!=null){

    	    	currentButtonSelected.x = game.input.activePointer.x
    	    	currentButtonSelected.y = game.input.activePointer.y

    	    }
        }
        else{
            if(currentButtonSelected!=null){
                leaveButton(currentButtonSelected,{x:game.input.activePointer.x,y:game.input.activePointer.y})
                currentButtonSelected = null
            }
        }
    }


    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

    }

    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height
        tutoGroup.destroy()
        inputsEnabled = true
        setRound()

    }


    function setRound(){
        if(rectAnswer.x > 0){
            rectAnswer.x = -500
        }

    	lButton.visible = true
    	lButton.x = lButton.startPos.x
    	lButton.y = lButton.startPos.y
        inAnimation = false
        currentIngredientAnimation = 0
        yogotar.setAnimationByName(0,'idle',true)
        machineSpine.setAnimationByName(0,'idle',true)

        for(var i = 0; i < arrayButtons.length; i++ ){
            arrayButtons[i].scale.setTo(1)
            arrayButtons[i].x = arrayButtons[i].startPos.x
            arrayButtons[i].y = arrayButtons[i].startPos.y
            arrayButtons[i].inArea = false
        }

        var r = game.rnd.integerInRange(1,3)
        drinkCount = game.rnd.integerInRange(1,3)
        if(inTutorial!=-1){
        	r = 1
        	drinkCount = 2
        }

        dialog.text.setText('x '+drinkCount)
        drinkType = r
        switch(r){
            case 1:
            correctSecuence = bananaSecuence
            dialog.smoothie.loadTexture('atlas.game','smoothie_banana',0,false)
            boardImageFruit.loadTexture("atlas.game","banana")
            boardImageSmoothie.loadTexture("atlas.game","smoothie_banana")
            break
            case 2:
            correctSecuence = strawberrySecuence
            dialog.smoothie.loadTexture('atlas.game','smoothie_fresa',0,false)
            boardImageFruit.loadTexture("atlas.game","fresawn")
            boardImageSmoothie.loadTexture("atlas.game","smoothie_fresa")
            break
            case 3:
            correctSecuence = coffeeSecuence
            dialog.smoothie.loadTexture('atlas.game','smoothie_cafe',0,false)
            boardImageFruit.loadTexture("atlas.game","cofi")
            boardImageSmoothie.loadTexture("atlas.game","smoothie_cafe")
            break
        }

        if(timeOn){
            if(currentTime>MIN_TIME){
                currentTime-=DELTA_TIME
            }
            startTimer(currentTime)
        }
        else{
            if(currentLevel>LEVEL_TIMER){
                timeOn = true
                positionTimer()
                startTimer(currentTime)
            }
        }


        game.add.tween(dialog.scale).to({x:1,y:1},500,Phaser.Easing.linear,true)

        loopText.setText(1)
        loopButton.visible = false
        loopText.value = 1
        playedLoops = 0

        arrayButtons = []

        gameActive = true

        currentLevel ++

        if(inTutorial!=-1){
            showBoard()
            evalTutorial()
        }
    }


    function createTouch(){
        touch = game.add.sprite(-100,-100,'atlas.game','star')
        touch.alpha = 0.5
        touch.anchor.setTo(0.5)
        touch.scale.setTo(0.2)
    
    }


    
    function clickButton(button,pointer){
    	if(inTutorial!=-1 ){
            if(button.inArea){
    	   	   return
            }

            if((inTutorial==0 && button.id != 0)||(inTutorial==1 && button.id != 1)||(inTutorial==2 && button.id != 3)||(inTutorial==3 && button.id != 2)||(inTutorial==4 && button.id != 6)){
                return
            }
    	}

        if(!inAnimation){
            sceneGroup.bringToTop(button)
        	currentButtonSelected = button
        }
    }

    function leaveButton(button,pointer){
        var id = button.id

        if(inTutorial==0 && button.id!=0){
        	button.x = button.startPos.x
            button.y = button.startPos.y
        	return
        }

        if(pointer.y > buttons_Area.y - (buttons_Area.height/2) ){
        	if(button.id != 6 && arrayButtons.length<4 && !button.inArea){
                sound.play('pop')
	            button.x = INITI_POS.x + (arrayButtons.length*DELTA_BUTTON)
	            button.y = INITI_POS.y
	            arrayButtons.push(button)
	            if(arrayButtons.length==4){
	                okBtn.alpha = 1
	            }

	            if(inTutorial!=-1){
	            	inTutorial++
	            	if(tutorialTween!=null){
						tutorialTween.stop()
						tutorialTween = null
						game.tweens.removeAll()
						
					}
                    tutorialButtonTween.stop()
                    tutorialBoardTween.stop()
                    tutorialButtonTween = null
                    tutorialBoardTween = null
	            	evalTutorial()
	            }
                else{
                    //hideBoard()
                }

	            button.inArea = true

	            adjustLoop()
	        }
	        else if(button.id==6){
	        	///loopButton
                 sound.play('pop')
	        	if(inTutorial!=-1){
	            	inTutorial++
	            	if(tutorialTween!=null){
						tutorialTween.stop()
						tutorialTween = null
						game.tweens.removeAll()
						
					}
                    tutorialButtonTween.stop()
                    tutorialBoardTween.stop()
                    tutorialButtonTween = null
                    tutorialBoardTween = null
	            	evalTutorial()
	            }

	        	//poner boton loop
	        	button.visible = false

	        	loopButton.visible = true

	        	adjustLoop()

	        }
            else{
                button.x = button.startPos.x
                button.y = button.startPos.y
                button.inArea = false
                var id = arrayButtons.indexOf(button)
                if(id != -1){
                    //
                    arrayButtons.splice(id,1)
                    for(var i = id; i < arrayButtons.length; i++){
                        arrayButtons[i].x -=DELTA_BUTTON
                    }
                    
                    okBtn.alpha = 0.5
                }

                adjustLoop()
                }
        }
        else{
            button.x = button.startPos.x
            button.y = button.startPos.y
            button.inArea = false
            var id = arrayButtons.indexOf(button)
            if(id != -1){
                //
                arrayButtons.splice(id,1)
                for(var i = id; i < arrayButtons.length; i++){
                    arrayButtons[i].x -=DELTA_BUTTON
                }
                
                okBtn.alpha = 0.5
            }

            adjustLoop()

            return
        }

    }

    function adjustLoop(){
    	if(loopButton.visible){
	    	var m = (arrayButtons.length*4)
	    	if(m == 0){
	    		m = 4
	    	}
	    	else if(m > loopButton.parts.length){
	    		m = loopButton.parts.length
	    	}
	    	for(var i = 0; i<m; i++){
	    		loopButton.parts[i].visible = true
	    	}

	    	for(var i = m; i<loopButton.parts.length; i++){
	    		loopButton.parts[i].visible = false
	    	}
	    	if(arrayButtons.length>0){
		    	loopButton.final.x = -111 + ((arrayButtons.length-1)*70)
		    }
		    else{
		    	loopButton.final.x = -111
		    }
	    }
    }

    function clickOk(){

        if(okBtn.alpha == 0.5){
            return
        }


        var correct = true

        if(inTutorial!=-1){
            if(inTutorial!=6){
                return
            }
        	inTutorial++
        	if(tutorialTween!=null){
				tutorialTween.stop()
				tutorialTween = null
				game.tweens.removeAll()
				
			}
            tutorialBoardTween.stop()
            tutorialBoardTween = null

            
        	evalTutorial()
        }


        if(timeOn){
            stopTimer()
        }
        sound.play("pop")

        hideBoard()

        game.add.tween(dialog.scale).to({x:0,y:0},500,Phaser.Easing.linear,true)

        switch(drinkType){
            case 1:
            machineSpine.setSkinByName('banana_smoothie')
            break
            case 2:
            machineSpine.setSkinByName('strawberry_smoothie')
            break
            case 3:
            machineSpine.setSkinByName('coffee_smoothie')
            break
        }
        inAnimation = true
        okBtn.alpha = 0.5
        //if(correct){
        startSmothies()
        //}
    }

    function startSmothies(){
        if(playedLoops<loopText.value){
            //console.log("loopText "+playedLoops)
            if(playedLoops!=drinkCount){
                if(currentIngredientAnimation<correctSecuence.length){
                    if(currentIngredientAnimation>0){
                        arrayButtons[currentIngredientAnimation-1].scale.setTo(1)
                    }
                    arrayButtons[currentIngredientAnimation].scale.setTo(1.2)
                    rectAnswer.x = arrayButtons[currentIngredientAnimation].x - rectAnswer.width/2
                    rectAnswer.y = arrayButtons[currentIngredientAnimation].y - rectAnswer.height/2
                    sceneGroup.bringToTop(rectAnswer)
                    sceneGroup.bringToTop(arrayButtons[currentIngredientAnimation])
                    if(arrayButtons[currentIngredientAnimation].id != correctSecuence[currentIngredientAnimation]){
                        rectAnswer.tint = 0xff0000


                        makeTweenError(boardButtons[currentIngredientAnimation],BOARD_BUTTONS_SCALE)

                        smoothieBad()
                        return
                    }
                    else{
                        rectAnswer.tint = 0x00ff00
                    }
                   
                   
                }


                switch(currentIngredientAnimation){
                    case 0:
                        currentIngredientAnimation ++
                        var machineWorking = machineSpine.setAnimationByName(0,'put_milk',false)
                        machineWorking.onComplete = startSmothies
                        sound.play("pouring")
                    break
                    case 1:
                        currentIngredientAnimation ++
                        var machineWorking = machineSpine.setAnimationByName(0,'put_ice',false)
                        machineWorking.onComplete = startSmothies
                        sound.play("drop")
                    break
                    case 2:
                        currentIngredientAnimation ++
                        var machineWorking = machineSpine.setAnimationByName(0,'put_ingredient',false)
                        machineWorking.onComplete = startSmothies
                        sound.play("drop")
                    break
                    case 3:
                        currentIngredientAnimation ++
                        var machineWorking = machineSpine.setAnimationByName(0,'blender',false)
                        machineWorking.onComplete = startSmothies
                        sound.play("blend")
                    break
                    case 4:
                        arrayButtons[3].scale.setTo(1)
                        currentIngredientAnimation ++
                        var machineWorking = machineSpine.setAnimationByName(0,'finish',false)
                        machineWorking.onComplete = startSmothies
                        loopButton.final.scale.setTo(1.2)
                        rectAnswer.x = -500
                    break
                    case 5:
                        currentIngredientAnimation ++
                        var machineWorking = machineSpine.setAnimationByName(0,'deliver',false)
                        machineWorking.onComplete = startSmothies
                        //currentIngredientAnimation = 0
                        //playedLoops++
                        //createPart('star',yogotar)
                    break
                    case 6:
                        var machineWorking = machineSpine.setAnimationByName(0,'restart',false)
                        machineWorking.onComplete = startSmothies
                        currentIngredientAnimation = 0
                        loopButton.final.scale.setTo(1.1)
                        playedLoops++
                    break

                }
                
            }
            else{
                //lose
                dialog.scale.setTo(1)
                makeTweenError(dialog,1)
                smoothieBad()
            }
        }
        else{
            if(playedLoops==drinkCount){
                //correct
                //addPoint()
                if(timeOn){
                    stopTimer()
                }

                Coin(yogotar,pointsBar,500)
                var dinamitaWin =yogotar.setAnimationByName(0,'win',false)
                dinamitaWin.onComplete = setRound
                //setTimeout(setRound,1000)
            }
            else{
                //lose
                dialog.scale.setTo(1)
                makeTweenError(dialog,1)
                smoothieBad()
            }
        }
    }

    function showBoard(){
        if(boardGroup.alpha == 0){
            game.add.tween(boardGroup).to({alpha:1,angle:0},500,Phaser.Easing.linear,true)
        }
        /*if(inTutorial==-1){
            setTimeout(hideBoard,4000)
        }*/
    }

    function hideBoard(){
        game.add.tween(boardGroup).to({alpha:0,angle:90},500,Phaser.Easing.linear,true)

    }

    function makeTweenError(object,initialScale){
        if(errorTween!=null){
            errorTween.stop()
            dialog.scale.setTo(1)
        }

        for(var i = 0; i < boardButtons.length; i ++){
            boardButtons[i].scale.setTo(BOARD_BUTTONS_SCALE)
        }

        errorTween = game.add.tween(object.scale).to({x:initialScale+0.2,y:initialScale + 0.2+0.2},500,Phaser.Easing.linear,true)

        errorTween.yoyo(true)
        errorTween.loop(true)


    }

    function smoothieBad(){
        if(timeOn){
           stopTimer()
        }
        missPoint()
        machineSpine.setAnimationByName(0,'lose',false)
        var dinamitalose =yogotar.setAnimationByName(0,'lose',false)
        dinamitalose.onComplete = restarRound

        showBoard()
    }

    function restarRound(){
        if(rectAnswer.x > 0){
            rectAnswer.x = -500
        }

        lButton.visible = true
        lButton.x = lButton.startPos.x
        lButton.y = lButton.startPos.y
        inAnimation = false
        currentIngredientAnimation = 0
        yogotar.setAnimationByName(0,'idle',true)
        machineSpine.setAnimationByName(0,'idle',true)

        for(var i = 0; i < arrayButtons.length; i++ ){
            arrayButtons[i].scale.setTo(1)
            arrayButtons[i].x = arrayButtons[i].startPos.x
            arrayButtons[i].y = arrayButtons[i].startPos.y
            arrayButtons[i].inArea = false
        }



        if(timeOn){
            startTimer(currentTime)
        }

        loopText.setText(1)
        loopButton.visible = false
        loopText.value = 1
        playedLoops = 0

        arrayButtons = []

        game.add.tween(dialog.scale).to({x:1,y:1},500,Phaser.Easing.linear,true)

    }

    function clickLoop(){
        if(inAnimation){
            return
        }
        var last = loopText.value
        loopText.value++
        if(loopText.value >3){
        	loopText.value = 1
        }

        if(inTutorial!=-1){
            if(inTutorial!=5){
                loopText.value = last

                return
            }
        	if(loopText.value==drinkCount){
        		inTutorial++
        		if(tutorialTween!=null){
					tutorialTween.stop()
					tutorialTween = null
					game.tweens.removeAll()
					
				}
        		evalTutorial()
        	}
        }
        loopText.setText(loopText.value)
        sound.play('pop')
    }

    function evalTutorial(){
    	if(tutorialTween !=null){
    		return
    	}

    	hand.visible = true
    	switch(inTutorial){
    		case 0:
    		hand.loadTexture('atlas.game','handDown')
    		hand.x = tutorialButtons[0].startPos.x+50
    		hand.y = tutorialButtons[0].startPos.y+50

            if(tutorialButtonTween==null){

                tutorialButtonTween = game.add.tween(tutorialButtons[0].scale).to({x:1.2,y:1.2},TUTORIAL_TWEEN_VELOCITY,Phaser.Easing.linear,true)
                tutorialButtonTween.yoyo(true)
                tutorialButtonTween.loop(true)

                tutorialBoardTween = game.add.tween(boardButtons[0].scale).to({x:BOARD_BUTTONS_SCALE + 0.2,y:BOARD_BUTTONS_SCALE + 0.2},TUTORIAL_TWEEN_VELOCITY,Phaser.Easing.linear,true)
                tutorialBoardTween.yoyo(true)
                tutorialBoardTween.loop(true)
            }

    		tutorialTween = game.add.tween(hand).to({x:buttons_Area.x,y:buttons_Area.y+50},1000,Phaser.Easing.linear,true)
    		tutorialTween.onComplete.add(function(){
    			tutorialTween = null
    			hand.loadTexture('atlas.game','handUp')
    			setTimeout(evalTutorial,500)
    		})
    		break

    		case 1:
    		hand.loadTexture('atlas.game','handDown')
    		hand.x = tutorialButtons[1].startPos.x+50
    		hand.y = tutorialButtons[1].startPos.y+50


            if(tutorialButtonTween==null){
                tutorialButtons[0].scale.setTo(1)
                boardButtons[0].scale.setTo(BOARD_BUTTONS_SCALE)



                tutorialButtonTween = game.add.tween(tutorialButtons[1].scale).to({x:1.2,y:1.2},TUTORIAL_TWEEN_VELOCITY,Phaser.Easing.linear,true)
                tutorialButtonTween.yoyo(true)
                tutorialButtonTween.loop(true)

                tutorialBoardTween = game.add.tween(boardButtons[1].scale).to({x:BOARD_BUTTONS_SCALE + 0.2,y:BOARD_BUTTONS_SCALE + 0.2},TUTORIAL_TWEEN_VELOCITY,Phaser.Easing.linear,true)
                tutorialBoardTween.yoyo(true)
                tutorialBoardTween.loop(true)
            }

    		tutorialTween = game.add.tween(hand).to({x:buttons_Area.x,y:buttons_Area.y+50},1000,Phaser.Easing.linear,true)
    		tutorialTween.onComplete.add(function(){
    			tutorialTween = null
    			hand.loadTexture('atlas.game','handUp')
    			setTimeout(evalTutorial,500)
    		})
    		break
    		
    		case 2:
    		hand.loadTexture('atlas.game','handDown')
    		hand.x = tutorialButtons[3].startPos.x+50
    		hand.y = tutorialButtons[3].startPos.y+50


            if(tutorialButtonTween==null){
                tutorialButtons[1].scale.setTo(1)
                boardButtons[1].scale.setTo(BOARD_BUTTONS_SCALE)

                tutorialButtonTween = game.add.tween(tutorialButtons[3].scale).to({x:1.2,y:1.2},TUTORIAL_TWEEN_VELOCITY,Phaser.Easing.linear,true)
                tutorialButtonTween.yoyo(true)
                tutorialButtonTween.loop(true)

                tutorialBoardTween = game.add.tween(boardButtons[2].scale).to({x:BOARD_BUTTONS_SCALE + 0.2,y:BOARD_BUTTONS_SCALE + 0.2},TUTORIAL_TWEEN_VELOCITY,Phaser.Easing.linear,true)
                tutorialBoardTween.yoyo(true)
                tutorialBoardTween.loop(true)
            }

    		tutorialTween = game.add.tween(hand).to({x:buttons_Area.x,y:buttons_Area.y+50},1000,Phaser.Easing.linear,true)
    		tutorialTween.onComplete.add(function(){
    			tutorialTween = null
    			hand.loadTexture('atlas.game','handUp')
    			setTimeout(evalTutorial,500)
    		})
    		break

    		case 3:
    		hand.loadTexture('atlas.game','handDown')
    		hand.x = tutorialButtons[2].startPos.x+50
    		hand.y = tutorialButtons[2].startPos.y+50

            if(tutorialButtonTween==null){
                tutorialButtons[3].scale.setTo(1)
                boardButtons[2].scale.setTo(BOARD_BUTTONS_SCALE)

                tutorialButtonTween = game.add.tween(tutorialButtons[2].scale).to({x:1.2,y:1.2},TUTORIAL_TWEEN_VELOCITY,Phaser.Easing.linear,true)
                tutorialButtonTween.yoyo(true)
                tutorialButtonTween.loop(true)

                tutorialBoardTween = game.add.tween(boardButtons[3].scale).to({x:BOARD_BUTTONS_SCALE + 0.2,y:BOARD_BUTTONS_SCALE + 0.2},TUTORIAL_TWEEN_VELOCITY,Phaser.Easing.linear,true)
                tutorialBoardTween.yoyo(true)
                tutorialBoardTween.loop(true)
            }

    		tutorialTween = game.add.tween(hand).to({x:buttons_Area.x,y:buttons_Area.y+50},1000,Phaser.Easing.linear,true)
    		tutorialTween.onComplete.add(function(){
    			tutorialTween = null
    			hand.loadTexture('atlas.game','handUp')
    			setTimeout(evalTutorial,500)
    		})
    		break

    		case 4:
    		hand.loadTexture('atlas.game','handDown')
    		hand.x = tutorialButtons[6].startPos.x+50
    		hand.y = tutorialButtons[6].startPos.y+50

            if(tutorialButtonTween==null){
                tutorialButtons[2].scale.setTo(1)
                boardButtons[3].scale.setTo(BOARD_BUTTONS_SCALE)

                tutorialButtonTween = game.add.tween(tutorialButtons[6].scale).to({x:1.2,y:1.2},TUTORIAL_TWEEN_VELOCITY,Phaser.Easing.linear,true)
                tutorialButtonTween.yoyo(true)
                tutorialButtonTween.loop(true)

                tutorialBoardTween = game.add.tween(dialog.scale).to({x:1.2,y:1.2},TUTORIAL_TWEEN_VELOCITY,Phaser.Easing.linear,true)
                tutorialBoardTween.yoyo(true)
                tutorialBoardTween.loop(true)
            }

    		tutorialTween = game.add.tween(hand).to({x:buttons_Area.x,y:buttons_Area.y+50},1000,Phaser.Easing.linear,true)
    		tutorialTween.onComplete.add(function(){
    			tutorialTween = null
    			hand.loadTexture('atlas.game','handUp')
    			setTimeout(evalTutorial,500)
    		})
    		break

    		case 5:
    		hand.loadTexture('atlas.game','handDown')
    		hand.x = loopButton.final.world.x+50
    		hand.y = loopButton.final.world.y+50
            if(tutorialBoardTween==null){
                tutorialButtons[6].scale.setTo(1)
                dialog.scale.setTo(1)
                tutorialBoardTween = game.add.tween(dialog.scale).to({x:1.2,y:1.2},TUTORIAL_TWEEN_VELOCITY,Phaser.Easing.linear,true)
                tutorialBoardTween.yoyo(true)
                tutorialBoardTween.loop(true)
            }

    		setTimeout(function(){
    			tutorialTween = null
    			hand.loadTexture('atlas.game','handUp')
    			setTimeout(evalTutorial,500)
    		},500)
    		
    		break

    		case 6:
    		hand.loadTexture('atlas.game','handDown')
    		hand.x = okBtn.x+50
    		hand.y = okBtn.y+50
            dialog.scale.setTo(1)
    		setTimeout(function(){
    			tutorialTween = null
    			hand.loadTexture('atlas.game','handUp')
    			setTimeout(evalTutorial,500)
    		},500)
    		
    		break
    		
    		default:
    		inTutorial = -1
    		hand.visible = false
    		break

    	}
    }

    function setBoardTween(){
        //boardTween
    }
    
    function createScene(){

        sceneGroup = game.add.group() 

        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        var backgroundTop = game.add.graphics(0,0)
        backgroundTop.beginFill(0xbffff8)
        backgroundTop.drawRect(0,0,game.world.width,game.world.height)
        backgroundTop.endFill()

        backgroundGroup.add(backgroundTop)

        var floor = game.add.tileSprite(0,game.world.centerY+100, game.world.width, game.world.height-(game.world.centerY+100), 'atlas.game','tile')
        backgroundGroup.add(floor)

        clouds = game.add.tileSprite(0,0,game.world.width,500,'atlas.game','tile_nubes')
        backgroundGroup.add(clouds)


         initialize()


        backgroundSound = game.add.audio('smartSong')
        game.sound.setDecodedCallback(backgroundSound, function(){
            backgroundSound.loopFull(0.6)
        }, this);
        
        game.onPause.add(function(){
            //console.log("Game paused")
            game.sound.mute = true
        } , this);

        game.onResume.add(function(){
            //console.log("Game resume")
            game.sound.mute = false
        }, this);



        machineSpine = game.add.spine(game.world.centerX-100,game.world.centerY+140,'smootmachine')
        machineSpine.setSkinByName("coffee_smoothie")
        machineSpine.setAnimationByName(0,"idle",true)
        sceneGroup.add(machineSpine)

        yogotar = game.add.spine(game.world.centerX+170,game.world.centerY+140,'dinamita')
        yogotar.scale.setTo(-1,1)
        yogotar.setSkinByName("normal")
        yogotar.setAnimationByName(0,"idle",true)
        sceneGroup.add(yogotar)


        buttons_Area = sceneGroup.create(game.world.centerX, game.world.centerY+400,'atlas.game','barra')
        buttons_Area.anchor.setTo(0.5,0.5)

        var buttons_Menu = sceneGroup.create(game.world.centerX, game.world.centerY+250,'atlas.game','barra_buttons')
        buttons_Menu.anchor.setTo(0.5,0.5)

        INITI_POS = {x:game.world.centerX - 175,y:buttons_Area.y+7}

        okBtn = sceneGroup.create(game.world.centerX+190, game.world.centerY+400,'atlas.game','ok')
        okBtn.anchor.setTo(0.5,0.5)
        okBtn.alpha = 0.5
        okBtn.inputEnabled = true
        okBtn.events.onInputDown.add(clickOk,this)

        tutorialButtons = []
        //buttons

        loopButton = game.add.group()
        loopButton.x = game.world.centerX
        loopButton.y = buttons_Area.y

       

        rectAnswer = game.add.graphics()
        rectAnswer.beginFill(0xffffff);
        rectAnswer.drawRoundedRect(0,0,100,80,30)
        rectAnswer.endFill()
        sceneGroup.add(rectAnswer)
        rectAnswer.x = -500

        var button = sceneGroup.create(game.world.centerX-180, game.world.centerY+210,'atlas.game','milk')
        button.anchor.setTo(0.5)
        button.inputEnabled = true
        button.id = 0
        button.startPos = {x:button.x,y:button.y}
        button.events.onInputDown.add(clickButton,this)
        tutorialButtons.push(button)

        button.inArea = false

        button = sceneGroup.create(game.world.centerX-80, game.world.centerY+210,'atlas.game','ice')
        button.anchor.setTo(0.5)
        button.inputEnabled = true
        button.id = 1
        button.startPos = {x:button.x,y:button.y}
        button.events.onInputDown.add(clickButton,this)
        tutorialButtons.push(button)
        button.inArea = false

        button = sceneGroup.create(game.world.centerX+20, game.world.centerY+210,'atlas.game','licuar')
        button.anchor.setTo(0.5)
        button.inputEnabled = true
        button.id = 2
        button.startPos = {x:button.x,y:button.y}
        button.events.onInputDown.add(clickButton,this)
        tutorialButtons.push(button)
        button.inArea = false

        button = sceneGroup.create(game.world.centerX-180, game.world.centerY+280,'atlas.game','banana')
        button.anchor.setTo(0.5)
        button.inputEnabled = true
        button.id = 3
        button.startPos = {x:button.x,y:button.y}
        button.events.onInputDown.add(clickButton,this)
        tutorialButtons.push(button)
        button.inArea = false

        button = sceneGroup.create(game.world.centerX-80, game.world.centerY+280,'atlas.game','fresawn')
        button.anchor.setTo(0.5)
        button.inputEnabled = true
        button.id = 4
        button.startPos = {x:button.x,y:button.y}
        button.events.onInputDown.add(clickButton,this)
        tutorialButtons.push(button)
        button.inArea = false

        button = sceneGroup.create(game.world.centerX+20, game.world.centerY+280,'atlas.game','cofi')
        button.anchor.setTo(0.5)
        button.inputEnabled = true
        button.id = 5
        button.startPos = {x:button.x,y:button.y}
        button.events.onInputDown.add(clickButton,this)
        tutorialButtons.push(button)
        button.inArea = false

        lButton = sceneGroup.create(game.world.centerX+150, game.world.centerY+250,'atlas.game','loop')
        lButton.anchor.setTo(0.5)
        lButton.inputEnabled = true
        lButton.startPos = {x:lButton.x,y:lButton.y}
        lButton.id = 6
        lButton.events.onInputDown.add(clickButton,this)
        tutorialButtons.push(lButton)
        lButton.inArea = false
        var fontStyle = {font: "25px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}


         var initial_part = loopButton.create(-224,-1,'atlas.game','loop_1')
        initial_part.anchor.setTo(0.5)

        loopButton.parts = []
        var x = -209
        for(var i = 0; i < 30; i++){
            var part = loopButton.create(x,-26,'atlas.game','loop_2')
            part.anchor.setTo(0.5)
            loopButton.parts.push(part)
            x+=part.width
        }

        var final_part = loopButton.create(95,0,'atlas.game','loop_3')
        final_part.anchor.setTo(0.5)
        final_part.inputEnabled = true
        final_part.events.onInputDown.add(clickLoop,this)


        loopButton.final = final_part

        loopText = new Phaser.Text(sceneGroup.game, -3, 20, "1", fontStyle)
        loopText.anchor.setTo(0.5)
        final_part.addChild(loopText)
        loopText.value = 1
        loopButton.visible = false

        sceneGroup.add(loopButton)
        
        //buttons


        dialog = game.add.group()
        
        dialog.x = yogotar.x +20
        dialog.y = yogotar.y - 300


        var dialogBack = dialog.create(0,0,'atlas.game','dilogo')
        dialogBack.scale.setTo(1.25)
        dialogBack.anchor.setTo(0.5)

        var smoothie = dialog.create(-35,-45,'atlas.game','smoothie_banana')
        smoothie.anchor.setTo(0.5)
        smoothie.scale.setTo(1.4)
        dialog.smoothie = smoothie

        fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        var textDialog = new Phaser.Text(sceneGroup.game, 30, -35, "x 3", fontStyle)
        textDialog.anchor.setTo(0.5)
        dialog.add(textDialog)
        dialog.text = textDialog

        sceneGroup.add(dialog)
        dialog.scale.setTo(0)

        boardGroup = game.add.group()
        sceneGroup.add(boardGroup)
        boardGroup.x = game.world.centerX - 250
        boardGroup.y = game.world.centerY - 260
        boardGroup.alpha = 0
        boardGroup.angle = 90

        var boardImage = boardGroup.create(0,0,"atlas.game","board")
        boardImage.scale.setTo(1.1)
        boardImage.anchor.setTo(0,1)

        var product = boardGroup.create(45,-70,"atlas.game","milk")
        product.scale.setTo(0.7)
        product.anchor.setTo(0.5)
        boardButtons.push(product)

        product = boardGroup.create(95,-70,"atlas.game","plus")
        //product.scale.setTo(0.7)
        product.anchor.setTo(0.5)

        product = boardGroup.create(145,-70,"atlas.game","ice")
        product.scale.setTo(0.7)
        product.anchor.setTo(0.5)
        boardButtons.push(product)

        product = boardGroup.create(195,-70,"atlas.game","plus")
        //product.scale.setTo(0.7)
        product.anchor.setTo(0.5)

        boardImageFruit = boardGroup.create(245,-70,"atlas.game","milk")
        boardImageFruit.scale.setTo(0.7)
        boardImageFruit.anchor.setTo(0.5)
        boardButtons.push(boardImageFruit)

        product = boardGroup.create(295,-70,"atlas.game","plus")
        //product.scale.setTo(0.7)
        product.anchor.setTo(0.5)

        product = boardGroup.create(345,-70,"atlas.game","licuar")
        product.scale.setTo(0.7)
        product.anchor.setTo(0.5)
        boardButtons.push(product)

        product = boardGroup.create(395,-70,"atlas.game","igual")
        //product.scale.setTo(0.7)
        product.anchor.setTo(0.5)

        boardImageSmoothie = boardGroup.create(445,-70,"atlas.game","smoothie_banana")
        //product.scale.setTo(0.7)
        boardImageSmoothie.anchor.setTo(0.5)

        var text = "RECIPE"
        if(localization.getLanguage()=="ES"){
            text = "RECETA"
        }

        fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var textRecipe = new Phaser.Text(sceneGroup.game, boardImage.width/2, -110, text, fontStyle)
        textRecipe.anchor.setTo(0.5)
        boardGroup.add(textRecipe)


        hand = sceneGroup.create(0,0,'atlas.game','handUp')
        hand.anchor.setTo(0.5)
        hand.visible = false

        createTouch()
        createPointsBar()
        createHearts()
        createTutorial()

        correctParticle = createPart('atlas.game','star')


        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)

        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0

    }


    
	return {
		assets: assets,
		name: "smoothieLoops",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()
