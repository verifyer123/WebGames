 
var soundsPath = "../../shared/minigames/sounds/"

var smart = function(){


	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/smart/atlas.json",
                image: "images/smart/atlas.png"
            },
            {   
                name: "atlas.time",
                json: "images/smart/timeAtlas.json",
                image: "images/smart/timeAtlas.png"
            },
        ],
        images: [
            {
                name:'tutorial_image',
                file:"images/smart/tutorial_image.png"
            }
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
            	name:'cashRegister',
            	file:soundsPath+'cashRegister.mp3'
            },
            {
                name:'beepSupermarket',
                file:soundsPath+'beepSupermarket.mp3'
            }

		],
        spines:[
            {
                name: "products",
                file: "images/spines/products/products.json"
            },
            {
                name: "sign",
                file: "images/spines/sign/sign.json"
            }
        ]
        
    }

    var NUM_LIFES = 3
    var LEVEL_TIMER = 8
    var INITIAL_TIME = 15000
    var DELTA_TIME = 100
    var MIN_TIME = 10000
    var MAX_MULTIPLIER = 3

    var BIT_DELTA = 20

    var DELTA_IMAGE_X = 30
    var DELTA_IMAGE_Y = 30

    var DELTA_TIME_TUTORIAL = 500

    var bitImagesNames = ['MILK_SCREEN','OJ_SCREEN','BREAD_SCREEN','APPLE_SCREEN','BANANA_SCREEN','CARROT_SCREEN']

    var lives
	var sceneGroup = null
    var gameIndex = 150
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

    var currentButtonSelected
    var signsArray

    var objectValues

    var operationGroup 
    var productsOperation
    var voidOperation
    var numbersOperation
    var resultOperation

    var pruductSpines

    var hiddenProductsNumer

    var resultObjects
    var needObjects 
    var pointsToGive

    //var littleBits
    var currentLittleBit

    var boxPositions

    var hand
    var tutorialTween, tutorialProductTween

    var cashMachine

    var tutorialButtons 

    var canTouch
    var tutorialObjects, tutorialObjectsId, tutorialChildrenId

    var correctObjectSprite

    var tweenButton

    var tutorialindividualvalue = 0

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

        inTutorial = 0

        signsArray = []

        objectValues = [9,3,4,6,11,5]
        productsOperation = []
        voidOperation = []
        numbersOperation = []

        pruductSpines = []

        hiddenProductsNumer = 1

        resultObjects = []

        tutorialButtons = []

        needObjects = 0
        pointsToGive = 0
        currentLittleBit = 0

        canTouch = false
        tutorialObjects = []
        tutorialObjectsId = 0
        tutorialChildrenId = 0

        game.input.maxPointers = 1

        loadSounds()
	}


    function preload(){

        game.stage.disableVisibilityChange = false;

        game.load.spritesheet("coin", 'images/smart/coin.png', 122, 123, 12)

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
       		stopTimer()
           missPoint()
           // operationGroup.visible = false
           setTimeout(setRound,700)
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
               addPoint(pointsToGive)
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

        //sound.play("magic")
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
        
    }
    
    function update() {


        if(!gameActive){
        	return
        }
        if(canTouch){
	        updateTouch()
	    }
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

    function checkCollision(obj){
        for(var i = 0; i < buttonGroup; i ++){
            var collide = checkOverlap(buttonGroup.children[i],obj)
            if(collide){
            	//console.log("Collision")
                return buttonGroup.children[i]
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

        if(lives<=0){
            return
        }

    	for(var i = 0; i < 3; i ++){
    		numbersOperation[i].visible = false
    	}

        currentLittleBit = 0

        sound.play('cashRegister')
        operationGroup.visible = false
       
        
        resultObjects = []

        if(currentLevel>=LEVEL_TIMER){
            if(!timeOn){
               timeOn = true
               
               positionTimer()
            }
        }

         setTimeout(function(){
            operationGroup.visible = true
            if(timeOn){
                startTimer(currentTime)
                if(currentTime > MIN_TIME){
                    currentTime-= DELTA_TIME
                }
            }

        },500)

        if(currentLevel==6){
            hiddenProductsNumer++
        }
        else if(currentLevel==12){
            hiddenProductsNumer++
        }

        for(var i = 0; i < voidOperation.length; i++){
        	for(var j = 0; j < voidOperation[i].length; j++){
        		voidOperation[i].children[j].visible = false
        		productsOperation[i].children[j].visible = false
        	}
        }

        pointsToGive = hiddenProductsNumer
        needObjects = hiddenProductsNumer

        var ids = [0,1,2]
        var productsIds = [0,1,2,3,4,5]
        var total = 0
        for(var i = 0; i < hiddenProductsNumer; i ++){
            var r = game.rnd.integerInRange(0,ids.length-1)
            var imageBitId = ids[r]
            ids.splice(r,1)
            r = game.rnd.integerInRange(0,productsIds.length-1)
            var productResultId = productsIds[r]
            productsIds.splice(r,1)

            var multiplier = game.rnd.integerInRange(1,MAX_MULTIPLIER)
            var initX = -((multiplier-1)/2) * DELTA_IMAGE_X
            var initY = -((multiplier-1)/2) * DELTA_IMAGE_Y
            for(var index = 0; index < multiplier; index ++){

            	if(multiplier==1){
	            	productsOperation[imageBitId].children[index].y = 0
	            	productsOperation[imageBitId].children[index].x = 0
	            	voidOperation[imageBitId].children[index].y = 0
	            	voidOperation[imageBitId].children[index].x = 0
	            }
	            else if(multiplier == 2){
	            	if(index==0){
		            	productsOperation[imageBitId].children[index].y = 0
		            	productsOperation[imageBitId].children[index].x = -DELTA_IMAGE_X/1.5
		            	voidOperation[imageBitId].children[index].y = 0
	            		voidOperation[imageBitId].children[index].x = -DELTA_IMAGE_X/1.5
		            }
		            else{
		            	productsOperation[imageBitId].children[index].y = 0
		            	productsOperation[imageBitId].children[index].x = DELTA_IMAGE_X/1.5
		            	voidOperation[imageBitId].children[index].y = 0
	            		voidOperation[imageBitId].children[index].x = DELTA_IMAGE_X/1.5
		            }
	            }
	            else if(multiplier == 3){
	            	if(index==0){
		            	productsOperation[imageBitId].children[index].y = -DELTA_IMAGE_Y
		            	productsOperation[imageBitId].children[index].x = 0
		            	voidOperation[imageBitId].children[index].y = -DELTA_IMAGE_Y
	            		voidOperation[imageBitId].children[index].x = 0
		            }
		            else if(index == 1){
		            	productsOperation[imageBitId].children[index].y = 0
		            	productsOperation[imageBitId].children[index].x = -DELTA_IMAGE_X/1.5
		            	voidOperation[imageBitId].children[index].y = 0
	            		voidOperation[imageBitId].children[index].x = -DELTA_IMAGE_X/1.5
		            }
		            else{
		            	productsOperation[imageBitId].children[index].y = 0
		            	productsOperation[imageBitId].children[index].x = DELTA_IMAGE_X/1.5
		            	voidOperation[imageBitId].children[index].y = 0
	            		voidOperation[imageBitId].children[index].x = DELTA_IMAGE_X/1.5
		            }
	            }

            	productsOperation[imageBitId].children[index].loadTexture('atlas.game','QUESTION_SCREEN',0,false)
            	voidOperation[imageBitId].children[index].visible = true
            	productsOperation[imageBitId].children[index].visible = true
            }
            tutorialindividualvalue = objectValues[productResultId]
            total += (multiplier*objectValues[productResultId])

            resultObjects.push({imageBitId:imageBitId,productResultId:productResultId,multiplier:multiplier})
        }



        for(var i = 0; i < ids.length; i++){
            var r = game.rnd.integerInRange(0,productsIds.length-1)
            var productResultId = productsIds[r]
            productsIds.splice(r,1)

            var multiplier = game.rnd.integerInRange(1,MAX_MULTIPLIER)
            var initY = -((multiplier-1)/2) * DELTA_IMAGE_Y
            var initX = -((multiplier-1)/2) * DELTA_IMAGE_X
            for(var index =0; index < multiplier; index ++){
            	if(multiplier==1){
	            	productsOperation[ids[i]].children[index].y = 0
	            	productsOperation[ids[i]].children[index].x = 0
	            }
	            else if(multiplier == 2){
	            	if(index==0){
		            	productsOperation[ids[i]].children[index].y = 0
		            	productsOperation[ids[i]].children[index].x = -DELTA_IMAGE_X/1.5
		            }
		            else{
		            	productsOperation[ids[i]].children[index].y = 0
		            	productsOperation[ids[i]].children[index].x = DELTA_IMAGE_X/1.5
		            }
	            }
	            else if(multiplier == 3){
	            	if(index==0){
		            	productsOperation[ids[i]].children[index].y = -DELTA_IMAGE_Y
		            	productsOperation[ids[i]].children[index].x = 0
		            }
		            else if(index == 1){
		            	productsOperation[ids[i]].children[index].y = 0
		            	productsOperation[ids[i]].children[index].x = -DELTA_IMAGE_X/1.5
		            }
		            else{
		            	productsOperation[ids[i]].children[index].y = 0
		            	productsOperation[ids[i]].children[index].x = DELTA_IMAGE_X/1.5
		            }
	            }
	            productsOperation[ids[i]].children[index].loadTexture('atlas.game',bitImagesNames[productResultId],0,false)
	            productsOperation[ids[i]].children[index].visible = true

	            

	        }

	        if(inTutorial!=-1){
            	tutorialObjects.push({object:productsOperation[ids[i]],multiplier:multiplier, individualValue: objectValues[productResultId]})
            }

            total += (multiplier*objectValues[productResultId])
        }

        result.setText(total)


        gameActive = true

        currentLevel ++

        if(inTutorial!=-1){

        	for(var i = 0; i <2; i ++){
        		numbersOperation[i].x = tutorialObjects[i].object.x 
        		numbersOperation[i].y = tutorialObjects[i].object.y + 60
        	}

            numbersOperation[2].x = productsOperation[resultObjects[0].imageBitId].x
            numbersOperation[2].y = productsOperation[resultObjects[0].imageBitId].y + 60

        	setTimeout(setNumberTutorial,300)

            //evalTutorial()
        }
        else{canTouch = true}
    }

    function setNumberTutorial(){
    	if(tutorialObjectsId < tutorialObjects.length){
	    	if(tutorialChildrenId < tutorialObjects[tutorialObjectsId].multiplier){
	    		numbersOperation[tutorialObjectsId].visible = true
	    		numbersOperation[tutorialObjectsId].setText(tutorialObjects[tutorialObjectsId].individualValue)
	    		var tween = game.add.tween(tutorialObjects[tutorialObjectsId].object.children[tutorialChildrenId].scale).to({x:1.5,y:1.5},DELTA_TIME_TUTORIAL,Phaser.Easing.linear,true)
	    		tween.yoyo(true)
	    		tween.onComplete.add(function(){
	    			if(tutorialObjects[tutorialObjectsId].multiplier!=1){
		    			numbersOperation[tutorialObjectsId].visible = false
		    		}
	    			tutorialChildrenId++
	    			setTimeout(setNumberTutorial,300)
	    		})

	    	}
	    	else{
	    		if(tutorialObjects[tutorialObjectsId].multiplier!=1){
		    		numbersOperation[tutorialObjectsId].visible = true
		    		numbersOperation[tutorialObjectsId].setText(tutorialObjects[tutorialObjectsId].individualValue * tutorialObjects[tutorialObjectsId].multiplier)
		    		var tween = game.add.tween(tutorialObjects[tutorialObjectsId].object.scale).to({x:1.5,y:1.5},DELTA_TIME_TUTORIAL,Phaser.Easing.linear,true)
		    		tween.yoyo(true)
		    		tween.onComplete.add(function(){
		    			tutorialChildrenId = 0
		    			tutorialObjectsId++
		    			setTimeout(setNumberTutorial,300)
		    		})
		    	}
		    	else{
		    		numbersOperation[tutorialObjectsId].visible = true
		    		tutorialObjectsId++
		    		tutorialChildrenId = 0
		    		setTimeout(setNumberTutorial,300)
		    	}
	    	}
	    }
	    else{
	    	canTouch = true
	    	tutorialProductTween = game.add.tween(tutorialButtons[resultObjects[0].productResultId].scale).to({x:1.3,y:1.3},DELTA_TIME_TUTORIAL,Phaser.Easing.linear,true)
            tutorialProductTween.yoyo(true)
            tutorialProductTween.loop(true)
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
    	if(canTouch){
	    	currentButtonSelected = button
	    }
    }

    function leaveButton(button,pointer){
        var id = button.id

        var correctObject = false
        if(pointer.y < game.world.centerY+50){

            if(inTutorial!=-1){
                if(id != resultObjects[0].productResultId){
                    button.visible = false
                    return
                }
            }

            for(var i = 0; i < resultObjects.length; i++){
                if(resultObjects[i].productResultId == id){

                    correctObject = true
                    resultObjects[i].multiplier --

                    if(inTutorial!=-1){
                        numbersOperation[2].visible = true
                        numbersOperation[2].value += tutorialindividualvalue 
                        numbersOperation[2].setText(numbersOperation[2].value)

                    }

					productsOperation[resultObjects[i].imageBitId].children[resultObjects[i].multiplier].loadTexture('atlas.game',bitImagesNames[id],0,false)

                    button.x = game.world.centerX-150
                    button.y = game.world.centerY
                    tweenButton = button
                    game.add.tween(tweenButton).to({x:game.world.centerX},200,Phaser.Easing.linear,true).onComplete.add(function(){
                        game.add.tween(tweenButton).to({x:game.world.centerX+250,alpha:0},300,Phaser.Easing.linear,true).onComplete.add(function(){
                            tweenButton.visible = false
                            tweenButton.alpha = 1
                            tweenButton = null
                        })
                        sound.play("beepSupermarket")
                        
                    })

                    sound.play('pop')

                    if(resultObjects[i].multiplier==0){

                        //productsOperation[resultObjects[i].imageBitId].loadTexture('atlas.game',bitImagesNames[id],0,false)
                        needObjects--
                    }
                }
            }
        }
        else{
            button.visible = false
            sbutton = null
            return

        }

        if(!correctObject){

            button.visible = false
            button = null
            canTouch = false
            sound.play('wrong')
            missPoint()

            if(timeOn){
                stopTimer()
            }
            correctObjectSprite = []
            for(var i = 0; i < resultObjects.length; i++){

            	tweenTint(tutorialButtons[resultObjects[i].productResultId], 0xffffff, 0x00ff00, 300);
                
	            correctObjectSprite.push(tutorialButtons[resultObjects[i].productResultId])
	            
	            var tween1 = game.add.tween(tutorialButtons[resultObjects[i].productResultId]).to({angle:-30},100,Phaser.Easing.linear)
	            var tween2 = game.add.tween(tutorialButtons[resultObjects[i].productResultId]).to({angle:30},200,Phaser.Easing.linear)
	            var tween3 = game.add.tween(tutorialButtons[resultObjects[i].productResultId]).to({angle:-30},200,Phaser.Easing.linear)
	            var tween4 = game.add.tween(tutorialButtons[resultObjects[i].productResultId]).to({angle:0},100,Phaser.Easing.linear)

	            tween1.chain(tween2)
	            tween2.chain(tween3)
	            tween3.chain(tween4)

	            tween1.start()

            }

            setTimeout(function(){
                for(var i = 0; i < correctObjectSprite.length; i++){  
                    tweenTint(correctObjectSprite[i], 0x00ff00, 0xffffff, 300);
                }
            },300)

            setTimeout(function(){
            	for(var i = 0; i < resultObjects.length; i++){
	            	for(var j =0; j < resultObjects[i].multiplier; j++ ){
		            	productsOperation[resultObjects[i].imageBitId].children[j].loadTexture('atlas.game',bitImagesNames[resultObjects[i].productResultId],0,false)
		            }
		        }
            },500)

            setTimeout(setRound,1500)
        }
        else if(needObjects==0){
            sound.play('magic')
            Coin({x:game.world.centerX,y:game.world.centerY-280},pointsBar,100)
            if(timeOn){
                stopTimer()
            }
            //operationGroup.visible = false
            inTutorial=-1
            hand.visible = false
           	if(tutorialProductTween!=null){
	            tutorialProductTween.stop()
	            for(var i = 0; i < tutorialButtons.length; i++){
		            tutorialButtons[i].scale.setTo(1)
		        }
	        }
            evalTutorial()
            canTouch = false
            setTimeout(setRound,2000)
        }


    }

    function tweenTint(obj, startColor, endColor, time) {    
	    // create an object to tween with our step value at 0    
	    var colorBlend = {step: 0};    
	    // create the tween on this object and tween its step property to 100    
	    var colorTween = game.add.tween(colorBlend).to({step: 100}, time);        
	    // run the interpolateColor function every time the tween updates, feeding it the    
	    // updated value of our tween each time, and set the result as our tint    
	    colorTween.onUpdateCallback(function() {      
	    	obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);       
	    });       
	    // set the object to the start color straight away    
	    obj.tint = startColor;            
	    // start the tween    
	    colorTween.start();
	}

    function evalTutorial(){
    	if(tutorialTween !=null){
    		return
    	}

    	hand.visible = true
    	switch(inTutorial){
    		case 0:
    		hand.loadTexture('atlas.game','handDown')
    		hand.x = boxPositions[resultObjects[0].productResultId].x + game.world.centerX
    		hand.y = boxPositions[resultObjects[0].productResultId].y + game.world.height
    		tutorialTween = game.add.tween(hand).to({x:game.world.centerX,y:game.world.centerY-100},2000,Phaser.Easing.linear,true)
    		tutorialTween.onComplete.add(function(){
    			tutorialTween = null
    			hand.loadTexture('atlas.game','handUp')
    			setTimeout(evalTutorial,500)
    		})
    		break
    		
    		default:
    		inTutorial = -1
    		hand.visible = false
    		break

    	}
    }

    function createSign(id){

        var group = game.add.group()
        //var sign = group.create(0,-10,'atlas.game','SIGN')
        var sign = game.add.spine(0,50,'sign')
        sign.setSkinByName('normal')
        sign.setAnimationByName(0,'idle',true)
        group.add(sign)
        //sign.anchor.setTo(0.5)

        var empty 
        var slotIndex
        for(var index = 0, n = sign.skeletonData.slots.length; index < n; index++){
            var slotData = sign.skeletonData.slots[index]
            if(slotData.name === "empty"){
                slotIndex = index
            }
        }

        if (slotIndex){
            empty = sign.slotContainers[slotIndex]
        }

        
        var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#4B212", align: "center"}
        var text = new Phaser.Text(sceneGroup.game, 0, 10, "$"+objectValues[id], fontStyle)
        text.anchor.setTo(0.5)
        empty.add(text)
        group.text = text
        group.id = id
        group.value = objectValues[id]
        sceneGroup.add(group)
        return group
    }

    function createSpine(key,id){
        var spine = game.add.spine(game.world.centerX,game.world.centerY,"products")
        spine.setSkinByName(key)
        spine.setAnimationByName(0,"idle",true)
        spine.visible = false
        spine.id = id
        return spine
    }

    function clickProduct(button,pointer){
    	if(canTouch){
            console.log("clickProduct")
	        var id = button.id
	        currentButtonSelected = pruductSpines[id]
	        currentButtonSelected.visible = true
	    }
    }
    
    function createScene(){

        sceneGroup = game.add.group() 

        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        var backgroundTop = game.add.tileSprite(0,0,game.world.width,game.world.height,"atlas.game","BG_TILE")
        backgroundGroup.add(backgroundTop)

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

        /*var table = game.add.tileSprite(0,game.world.centerY,game.world.width,game.world.centerY,"atlas.game","TABLE")
        table.anchor.setTo(0,0)
        sceneGroup.add(table)*/

		var cashierTable = game.add.tileSprite(0,game.world.centerY-30,game.world.width,215,'atlas.game','CASHIER_TABLE')
        cashierTable.anchor.setTo(0,0.5)
        sceneGroup.add(cashierTable)

        var cashier = sceneGroup.create(game.world.centerX, game.world.centerY-50,"atlas.game","SCANNER")
        cashier.anchor.setTo(0.5)


        var machine = sceneGroup.create(game.world.centerX,-25,'atlas.game','CASHIER_SCREEN')
        machine.anchor.setTo(0.5,0)
        machine.scale.setTo(1.1)

        var basketGroup = game.add.group()
        basketGroup.scale.setTo(0.9)
        basketGroup.x = game.world.centerX
        basketGroup.y = game.world.height
        sceneGroup.add(basketGroup)

        var basket = sceneGroup.create(0,100,"atlas.game","BASKET")
        basket.anchor.setTo(0.5,1)
        basketGroup.add(basket)

        signsArray.push(createSign(0))
        signsArray[0].x = basket.x+230
        signsArray[0].y = basket.y-520
        signsArray[0].angle = 15
        basketGroup.add(signsArray[0])

        signsArray.push(createSign(1))
        signsArray[1].x = basket.x
        signsArray[1].y = basket.y-540
        signsArray[1].angle = 15
        basketGroup.add(signsArray[1])

        signsArray.push(createSign(2))
        signsArray[2].x = basket.x-140
        signsArray[2].y = basket.y-500
        signsArray[2].angle = 15
        basketGroup.add(signsArray[2])

        var milkBox = sceneGroup.create(basket.x+170,basket.y-400,'atlas.game','MILK_BASKET')
        milkBox.anchor.setTo(0.5)
        milkBox.inputEnabled = true
        milkBox.id = 0
        milkBox.events.onInputDown.add(clickProduct,this)
        tutorialButtons.push(milkBox)
        basketGroup.add(milkBox)

        var juiceBox = sceneGroup.create(basket.x,basket.y-400,'atlas.game','OJ_BASKET')
        juiceBox.anchor.setTo(0.5)
        juiceBox.inputEnabled = true
        juiceBox.id = 1
        juiceBox.events.onInputDown.add(clickProduct,this)
        tutorialButtons.push(juiceBox)
        basketGroup.add(juiceBox)

        var breadBox = sceneGroup.create(basket.x-170,basket.y-400,'atlas.game','BREAD_BASKET')
        breadBox.anchor.setTo(0.5)
        breadBox.inputEnabled = true
        breadBox.id = 2
        breadBox.events.onInputDown.add(clickProduct,this)
        tutorialButtons.push(breadBox)
        basketGroup.add(breadBox)


        signsArray.push(createSign(3))
        signsArray[3].x = basket.x-270
        signsArray[3].y = basket.y-350
        signsArray[3].angle = -15
        basketGroup.add(signsArray[3])

        signsArray.push(createSign(4))
        signsArray[4].x = basket.x+250
        signsArray[4].y = basket.y-400
        signsArray[4].angle = 15
        basketGroup.add(signsArray[4])

        signsArray.push(createSign(5))
        signsArray[5].x = basket.x-100
        signsArray[5].y = basket.y-340
        signsArray[5].angle = -15
        basketGroup.add(signsArray[5])


        var appleBox = sceneGroup.create(basket.x-180,basket.y-270,'atlas.game','APPLE_BASKET')
        appleBox.anchor.setTo(0.5)
        appleBox.inputEnabled = true
        appleBox.id = 3
        appleBox.events.onInputDown.add(clickProduct,this)
        tutorialButtons.push(appleBox)
        basketGroup.add(appleBox)
        var bananaBox = sceneGroup.create(basket.x+220,basket.y-270,'atlas.game','BANANA_BASTE')
        bananaBox.anchor.setTo(0.5)
        bananaBox.inputEnabled = true
        bananaBox.id = 4
        bananaBox.events.onInputDown.add(clickProduct,this)
        tutorialButtons.push(bananaBox)
        basketGroup.add(bananaBox)
        var carrotBox = sceneGroup.create(basket.x,basket.y-240,'atlas.game','CARROT_BASKET')
        carrotBox.anchor.setTo(0.5)
        carrotBox.inputEnabled = true
        carrotBox.id = 5
        carrotBox.events.onInputDown.add(clickProduct,this)
        tutorialButtons.push(carrotBox)
        basketGroup.add(carrotBox)

        boxPositions = [{x:milkBox.world.x,y:milkBox.world.y},{x:juiceBox.world.x,y:juiceBox.world.y},{x:breadBox.world.x,y:breadBox.world.y},{x:appleBox.world.x,y:appleBox.world.y},{x:bananaBox.world.x,y:bananaBox.world.y},{x:carrotBox.world.x,y:carrotBox.world.y}]

        operationGroup = game.add.group()
        operationGroup.x = game.world.centerX
        operationGroup.y = machine.y + machine.height - 115
        operationGroup.visible = false

        var voidGroup = game.add.group()
        voidGroup.x = -220
        operationGroup.add(voidGroup)
        voidGroup.visible = false

        for(var i = 0; i < 3; i++){
        	var voidSprite = voidGroup.create(0,0,'atlas.game','VOID')
        	voidSprite.anchor.setTo(0.5)
	        voidSprite.visible = false
        }

        voidOperation.push(voidGroup)

        var productGroup = game.add.group()
        productGroup.x = -220
        operationGroup.add(productGroup)
        for(var i = 0; i < 3; i++){
	        var productSprite = productGroup.create(0,0,'atlas.game','QUESTION_SCREEN')
	        productSprite.anchor.setTo(0.5)
	        productSprite.scale.setTo(0.9)
	        productSprite.visible = false
	    }
	    productsOperation.push(productGroup)


        var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#BFE54F", align: "center"}
        var operation = new Phaser.Text(sceneGroup.game, -140, 0, "+", fontStyle)
        operation.anchor.setTo(0.5)
        operationGroup.add(operation)

        voidGroup = game.add.group()
        voidGroup.x = -50
        operationGroup.add(voidGroup)
        voidGroup.visible = false

        for(var i = 0; i < 3; i++){
        	var voidSprite = voidGroup.create(0,0,'atlas.game','VOID')
        	voidSprite.anchor.setTo(0.5)
	        voidSprite.visible = false
        }

        voidOperation.push(voidGroup)

        productGroup = game.add.group()
        productGroup.x = -60
        operationGroup.add(productGroup)
        for(var i = 0; i < 3; i++){
	        var productSprite = productGroup.create(0,0,'atlas.game','QUESTION_SCREEN')
	        productSprite.anchor.setTo(0.5)
	        productSprite.scale.setTo(0.9)
	        productSprite.visible = false
	    }
	    productsOperation.push(productGroup)
        

        operation = new Phaser.Text(sceneGroup.game, 20, 0, "+", fontStyle)
        operation.anchor.setTo(0.5)
        operationGroup.add(operation)

       	voidGroup = game.add.group()
        voidGroup.x = 50
        operationGroup.add(voidGroup)
        voidGroup.visible = false

        for(var i = 0; i < 3; i++){
        	var voidSprite = voidGroup.create(0,0,'atlas.game','VOID')
        	voidSprite.anchor.setTo(0.5)
	        voidSprite.visible = false
        }

        voidOperation.push(voidGroup)

        productGroup = game.add.group()
        productGroup.x = 100
        operationGroup.add(productGroup)
        for(var i = 0; i < 3; i++){
	        var productSprite = productGroup.create(0,0,'atlas.game','QUESTION_SCREEN')
	        productSprite.anchor.setTo(0.5)
	        productSprite.scale.setTo(0.9)
	        productSprite.visible = false
	    }
	    productsOperation.push(productGroup)

        operation = new Phaser.Text(sceneGroup.game, 180, 0, "=", fontStyle)
        operation.anchor.setTo(0.5)
        operationGroup.add(operation)

        result = new Phaser.Text(sceneGroup.game, 240, 0, "0", fontStyle)
        result.anchor.setTo(0.5)
        operationGroup.add(result)

        fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#BFE54F", align: "center"}

        var number = new Phaser.Text(sceneGroup.game, -120, 70, "0", fontStyle)
        number.anchor.setTo(0.5)
        numbersOperation.push(number)
        operationGroup.add(number)
        number.visible = false

        number = new Phaser.Text(sceneGroup.game, -20, 70, "0", fontStyle)
        number.anchor.setTo(0.5)
        numbersOperation.push(number)
        operationGroup.add(number)
        number.visible = false

        number = new Phaser.Text(sceneGroup.game, -20, 70, "0", fontStyle)
        number.anchor.setTo(0.5)
        numbersOperation.push(number)
        operationGroup.add(number)
        number.visible = false
        number.value = 0


        pruductSpines.push(createSpine('milk',0))
        pruductSpines.push(createSpine('orange',1))
        pruductSpines.push(createSpine('bread',2))
        pruductSpines.push(createSpine('apple',3))
        pruductSpines.push(createSpine('bannana',4))
        pruductSpines.push(createSpine('carrot',5))
        
        /*for(var i = 0; i < pruductSpines.length; i++){
            basketGroup.add(pruductSpines[i])
        }*/

        sceneGroup.add(operationGroup)


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
		name: "smart",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()
