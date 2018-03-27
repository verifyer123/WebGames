
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
    var tutorialTween

    var cashMachine



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

        signsArray = []

        objectValues = [9,3,4,6,11,5]
        productsOperation = []
        voidOperation = []
        numbersOperation = []

        pruductSpines = []

        hiddenProductsNumer = 1

        resultObjects = []

        needObjects = 0
        pointsToGive = 0
        currentLittleBit = 0

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
        
        // addNumberPart(batteryGroup,'-1')
    }
    
    function update() {


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
        currentLittleBit = 0
        /*for(var i = 0; i < littleBits.length; i++){
            littleBits[i].visible = false
        }*/

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
        else if(currentLevel==7){
            hiddenProductsNumer--
        }
        else if(hiddenProductsNumer==12){
            hiddenProductsNumer++
        }

        for(var i = 0; i < voidOperation.length; i++){
        	voidOperation[i].visible = false
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
            numbersOperation[imageBitId].setText(multiplier)

            productsOperation[imageBitId].loadTexture('atlas.game','QUESTION_SCREEN',0,false)
            voidOperation[imageBitId].visible = true

            total += (multiplier*objectValues[productResultId])

            resultObjects.push({imageBitId:imageBitId,productResultId:productResultId,multiplier:multiplier})
        }



        for(var i = 0; i < ids.length; i++){
            var r = game.rnd.integerInRange(0,productsIds.length-1)
            var productResultId = productsIds[r]
            productsIds.splice(r,1)

            var multiplier = game.rnd.integerInRange(1,MAX_MULTIPLIER)
            numbersOperation[ids[i]].setText(multiplier)

            productsOperation[ids[i]].loadTexture('atlas.game',bitImagesNames[productResultId],0,false)

            total += (multiplier*objectValues[productResultId])
        }

        result.setText(total)


        gameActive = true

        currentLevel ++

        if(inTutorial!=-1){
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
    	currentButtonSelected = button
    }

    function leaveButton(button,pointer){
        var id = button.id

        button.visible = false
        button = null
        var correctObject = false
        if(pointer.y < game.world.centerY){

            if(inTutorial!=-1){
                if(id != resultObjects[0].productResultId){
                    return
                }
            }

            for(var i = 0; i < resultObjects.length; i++){
                if(resultObjects[i].productResultId == id){

                    correctObject = true
                    resultObjects[i].multiplier --

                    numbersOperation[resultObjects[i].imageBitId].setText(resultObjects[i].multiplier)

                    game.add.tween(numbersOperation[resultObjects[i].imageBitId].scale).to({x:2,y:2},300,Phaser.Easing.linear,true).yoyo(true)

                    sound.play('pop')

                    if(resultObjects[i].multiplier==0){

                        productsOperation[resultObjects[i].imageBitId].loadTexture('atlas.game',bitImagesNames[id],0,false)
                        needObjects--
                    }
                }
            }
        }
        else{return}

        if(!correctObject){
            
            sound.play('wrong')
            missPoint()
            if(timeOn){
                stopTimer()
            }
            //operationGroup.visible = false
            setTimeout(setRound,700)
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
            evalTutorial()
            setTimeout(setRound,700)
        }

    }

    function evalTutorial(){
    	if(tutorialTween !=null){
    		return
    	}

    	hand.visible = true
    	switch(inTutorial){
    		case 0:
    		hand.loadTexture('atlas.game','handDown')
            console.log("tutorial 0")
    		hand.x = boxPositions[resultObjects[0].productResultId].x
    		hand.y = boxPositions[resultObjects[0].productResultId].y
    		tutorialTween = game.add.tween(hand).to({x:productsOperation[resultObjects[0].imageBitId].world.x,y:productsOperation[resultObjects[0].imageBitId].world.y},2000,Phaser.Easing.linear,true)
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
        var text = new Phaser.Text(sceneGroup.game, 0, 10, objectValues[id], fontStyle)
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
        var id = button.id
        currentButtonSelected = pruductSpines[id]
        currentButtonSelected.visible = true
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



        var machine = sceneGroup.create(game.world.centerX,0,'atlas.game','CASHIER_SCREEN')
        machine.anchor.setTo(0.5,0)

        var cashTable = sceneGroup.create(game.world.centerX, machine.y + machine.height + 120,'atlas.game','CASHIER_TABLE')
        cashTable.anchor.setTo(0.5)

        var basket = sceneGroup.create(game.world.centerX,game.world.height,"atlas.game","BASKET")
        basket.anchor.setTo(0.5,1)

        signsArray.push(createSign(0))
        signsArray[0].x = basket.x+230
        signsArray[0].y = basket.y-520
        signsArray[0].angle = 15

        signsArray.push(createSign(1))
        signsArray[1].x = basket.x
        signsArray[1].y = basket.y-540
        signsArray[1].angle = 15

        signsArray.push(createSign(2))
        signsArray[2].x = basket.x-140
        signsArray[2].y = basket.y-500
        signsArray[2].angle = 15

        var milkBox = sceneGroup.create(basket.x+170,basket.y-400,'atlas.game','MILK_BASKET')
        milkBox.anchor.setTo(0.5)
        milkBox.inputEnabled = true
        milkBox.id = 0
        milkBox.events.onInputDown.add(clickProduct,this)

        var juiceBox = sceneGroup.create(basket.x,basket.y-400,'atlas.game','OJ_BASKET')
        juiceBox.anchor.setTo(0.5)
        juiceBox.inputEnabled = true
        juiceBox.id = 1
        juiceBox.events.onInputDown.add(clickProduct,this)

        var breadBox = sceneGroup.create(basket.x-170,basket.y-400,'atlas.game','BREAD_BASKET')
        breadBox.anchor.setTo(0.5)
        breadBox.inputEnabled = true
        breadBox.id = 2
        breadBox.events.onInputDown.add(clickProduct,this)


        signsArray.push(createSign(3))
        signsArray[3].x = basket.x-270
        signsArray[3].y = basket.y-350
        signsArray[3].angle = -15

        signsArray.push(createSign(4))
        signsArray[4].x = basket.x+250
        signsArray[4].y = basket.y-400
        signsArray[4].angle = 15

        signsArray.push(createSign(5))
        signsArray[5].x = basket.x-100
        signsArray[5].y = basket.y-340
        signsArray[5].angle = -15

        



        var appleBox = sceneGroup.create(basket.x-180,basket.y-270,'atlas.game','APPLE_BASKET')
        appleBox.anchor.setTo(0.5)
        appleBox.inputEnabled = true
        appleBox.id = 3
        appleBox.events.onInputDown.add(clickProduct,this)
        var bananaBox = sceneGroup.create(basket.x+220,basket.y-270,'atlas.game','BANANA_BASTE')
        bananaBox.anchor.setTo(0.5)
        bananaBox.inputEnabled = true
        bananaBox.id = 4
        bananaBox.events.onInputDown.add(clickProduct,this)
        var carrotBox = sceneGroup.create(basket.x,basket.y-240,'atlas.game','CARROT_BASKET')
        carrotBox.anchor.setTo(0.5)
        carrotBox.inputEnabled = true
        carrotBox.id = 5
        carrotBox.events.onInputDown.add(clickProduct,this)

        boxPositions = [{x:milkBox.x,y:milkBox.y},{x:juiceBox.x,y:juiceBox.y},{x:breadBox.x,y:breadBox.y},{x:appleBox.x,y:appleBox.y},{x:bananaBox.x,y:bananaBox.y},{x:carrotBox.x,y:carrotBox.y}]

        
        


        operationGroup = game.add.group()
        operationGroup.x = game.world.centerX
        operationGroup.y = game.world.centerY - 320
        operationGroup.visible = false

        var voidSprite = operationGroup.create(-150,0,'atlas.game','VOID')
        voidSprite.anchor.setTo(0.5)
        voidSprite.scale.setTo(1)
        voidOperation.push(voidSprite)
        voidSprite.visible = false

        var productSprite = operationGroup.create(-150,0,'atlas.game','QUESTION_SCREEN')
        productSprite.anchor.setTo(0.5)
        productSprite.scale.setTo(0.9)
        productsOperation.push(productSprite)

        

        var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#BFE54F", align: "center"}
        var operation = new Phaser.Text(sceneGroup.game, -100, 0, "+", fontStyle)
        operation.anchor.setTo(0.5)
        operationGroup.add(operation)

        voidSprite = operationGroup.create(-50,0,'atlas.game','VOID')
        voidSprite.anchor.setTo(0.5)
        voidSprite.scale.setTo(1)
        voidOperation.push(voidSprite)
        voidSprite.visible = false

        productSprite = operationGroup.create(-50,0,'atlas.game','QUESTION_SCREEN')
        productSprite.anchor.setTo(0.5)
        productSprite.scale.setTo(0.9)
        productsOperation.push(productSprite)

        

        operation = new Phaser.Text(sceneGroup.game, 0, 0, "+", fontStyle)
        operation.anchor.setTo(0.5)
        operationGroup.add(operation)

        voidSprite = operationGroup.create(50,0,'atlas.game','VOID')
        voidSprite.anchor.setTo(0.5)
        voidSprite.scale.setTo(1)
        voidOperation.push(voidSprite)
        voidSprite.visible = false

        productSprite = operationGroup.create(50,0,'atlas.game','QUESTION_SCREEN')
        productSprite.anchor.setTo(0.5)
        productSprite.scale.setTo(0.9)
        productsOperation.push(productSprite)

        

        operation = new Phaser.Text(sceneGroup.game, 100, 0, "=", fontStyle)
        operation.anchor.setTo(0.5)
        operationGroup.add(operation)

        result = new Phaser.Text(sceneGroup.game, 150, 0, "0", fontStyle)
        result.anchor.setTo(0.5)
        operationGroup.add(result)

        fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#BFE54F", align: "center"}

        var number = new Phaser.Text(sceneGroup.game, -120, 50, "1", fontStyle)
        number.anchor.setTo(0.5)
        numbersOperation.push(number)
        operationGroup.add(number)

        number = new Phaser.Text(sceneGroup.game, -20, 50, "1", fontStyle)
        number.anchor.setTo(0.5)
        numbersOperation.push(number)
        operationGroup.add(number)

        number = new Phaser.Text(sceneGroup.game, 90, 50, "1", fontStyle)
        number.anchor.setTo(0.5)
        numbersOperation.push(number)
        operationGroup.add(number)

       //littleBits = []

        /*for(var i = 0; i < 6; i++){
            var bit = operationGroup.create(0,0,'atlas.game','QUESTION_SCREEN')
            bit.anchor.setTo(0.5)
            bit.scale.setTo(0.3)
            bit.visibe = false
            bit.y = 50
            littleBits.push(bit)

        }*/

        pruductSpines.push(createSpine('milk',0))
        pruductSpines.push(createSpine('orange',1))
        pruductSpines.push(createSpine('bread',2))
        pruductSpines.push(createSpine('apple',3))
        pruductSpines.push(createSpine('bannana',4))
        pruductSpines.push(createSpine('carrot',5))
        
        


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
