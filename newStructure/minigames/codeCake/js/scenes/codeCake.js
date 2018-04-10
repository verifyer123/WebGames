
var soundsPath = "../../shared/minigames/sounds/"


var codeCake = function(){

	var SCROLL_STATE = {
		WAIT: 0,
		SCROLL: 1,
		SELECT: 2,
	}
    

	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/codeCake/atlas.json",
                image: "images/codeCake/atlas.png"
            },
            {   
                name: "atlas.time",
                json: "images/codeCake/timeAtlas.json",
                image: "images/codeCake/timeAtlas.png"
            },
        ],
        images: [
            {
                name:'tutorial_image',
                file:"images/codeCake/tutorial_image.png"
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
                name:'codeCakeSong',
                file: soundsPath + 'songs/childrenbit.mp3'
            },
            {
            	name:'machineWorking',
            	file:soundsPath+'machineWorking.mp3'
            }

		],
        spines:[
            {
                name: "oven_a",
                file: "images/spines/oven_a/oven_a.json"
            },
            {
                name: "oven_b",
                file: "images/spines/oven_b/oven_b.json"
            },
            {
                name: "oven_c",
                file: "images/spines/oven_c/oven_c.json"
            },
            {
                name: "oven_d",
                file: "images/spines/oven_d/oven_d.json"
            },
            {
                name: "light_bulbs",
                file: "images/spines/light_bulbs/light_bulbs.json"
            },
            {
                name: "conveyor",
                file: "images/spines/conveyor/conveyor.json"
            },
           
            {
                name: "smoke",
                file: "images/spines/smoke/smoke.json"
            },
        ]
    }

    var NUM_LIFES = 3
    var TIME_MOVEMENT = 1500
    var LEVEL_TIMER = 3
    var INITIAL_TIME = 30000
    var DELTA_TIME = 200
    var MIN_TIME = 20000
    var DELAY_EVALUATE_TIME = 1000

    var FRICTION = 0.9

    var imageNames = ['btn_base_0','btn_base_1','btn_topping_0','btn_topping_1','btn_topping_2','btn_topping_no','btn_fruit_0','btn_fruit_1','btn_fruit_2','btn_fruit_no','btn_extra_0','btn_extra_1','btn_extra_no']
        

    var lives
	var sceneGroup = null
    var gameIndex = 149
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

    var cakeGroup
    var spineMachines
    var spineConveyor

    var stationPositions
    var currentSequence
    var correctSequence

    var currentLevel 
    var currentTime

    var exampleCake


    var buttonGroup

    var currentButtonSelected


    var lastX 
    var lastDelta
    var startPointer
    var scrollState

    var stationButtons 
    var stationsImages

    var sampleImage 
    var glitterImages

    var stationBehindGruop

    var ligths

    var inTutorial 

    var hand
    var tutorialTween
    var timeOutTutorial
    var needUp

    var tutorialButtonInex
    var tutorialButtonArray 
    var stationTutorial
    var handState

    var smokeSpine

    var okPressed

    var machineGroup

    var tutorialScaleTween

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = NUM_LIFES
        numPoints = 0

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        spineMachines = []
        spineConveyor = []
        stationPositions = []

        currentSequence = [-1,-1,-1,-1]
        correctSequence = [-1,-1,-1,-1]

        stationPositions.push({x:game.world.centerX + 100,y: game.world.centerY - 500})
        stationPositions.push({x:game.world.centerX - 205,y: game.world.centerY - 315})
        stationPositions.push({x:game.world.centerX + 210,y: game.world.centerY - 140})
        stationPositions.push({x:game.world.centerX - 205,y: game.world.centerY + 35})
        stationPositions.push({x:game.world.centerX + 180,y: game.world.centerY + 215})
        stationPositions.push({x:game.world.centerX+90,y: game.world.centerY + 290})

        currentLevel = 0
        timeOn = false

        stationButtons = [null,null,null,null]

        currentTime = INITIAL_TIME
        scrollState = SCROLL_STATE.WAIT

        stationBehindGruop = []

        lastX = -1

        inTutorial = 0

        needUp = false
        stationTutorial = 1
        tutorialButtonInex = 0
        handState = SCROLL_STATE.WAIT

        tutorialButtonArray = []

        okPressed = false

        loadSounds()
	}


    function preload(){

        game.stage.disableVisibilityChange = false;

        game.load.spritesheet("coin", 'images/codeCake/coin.png', 122, 123, 12)

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
           setTimeout(setRound,700)
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


        if(game.input.activePointer.isDown && !needUp){
        	var canScrollTutorial = true

        	if(game.input.activePointer.y > game.world.height - 150){
        		if(lastX==-1){
        			lastX = game.input.activePointer.x
        			buttonGroup.force = 0
        			startPointer = {x:game.input.activePointer.x,y:game.input.activePointer.y}
        			scrollState = SCROLL_STATE.WAIT
        		}
        		else{
        			if(currentButtonSelected!=null){
	        			if(scrollState == SCROLL_STATE.WAIT){
	        				if(Math.abs(startPointer.x - game.input.activePointer.x)>20 && canScrollTutorial){

	        					scrollState = SCROLL_STATE.SCROLL
	        					sceneGroup.remove(currentButtonSelected)
	        					buttonGroup.add(currentButtonSelected)
	        					currentButtonSelected.x = currentButtonSelected.initialX
	        					currentButtonSelected.y = currentButtonSelected.initialY
                                currentButtonSelected.scale.setTo(1)
                                makeTutorialTween()
	        					currentButtonSelected = null
	        				}

	        				else if(Math.abs(startPointer.y - game.input.activePointer.y)>10){
	        					scrollState = SCROLL_STATE.SELECT
	        					buttonGroup.remove(currentButtonSelected)
	    						sceneGroup.add(currentButtonSelected)
	    						buttonGroup.force = 0
	        				}
	        				
	        			}
	        		}
	        		else{
	        			scrollState = SCROLL_STATE.SCROLL
	        		}

        			if(scrollState == SCROLL_STATE.SCROLL){

	        			var delta = game.input.activePointer.x - lastX
	        			if(delta < 0 && buttonGroup.x > -950 ){
			        		buttonGroup.x += delta
			        		if(buttonGroup.x < -950){
			        			buttonGroup.x = -950
			        		}
			        	}
			        	else if(delta>0 && buttonGroup.x < 0){
			        		buttonGroup.x += delta
			        		if(buttonGroup.x > 0 ){
			        			buttonGroup.x = 0
			        		}
			        	}
			        	lastX = game.input.activePointer.x
	        			lastDelta = delta
	        		}
	        		
        		}
        	}
        	if(scrollState == SCROLL_STATE.SELECT){
	        	updateTouch()
	        }

        }
        else{
        	if(!game.input.activePointer.isDown){
				needUp = false
        	}
        	if(lastX!=-1){
	        	buttonGroup.force = lastDelta
	        	//console.log(buttonGroup.force)
	        	lastX = -1
	        }

	        if(currentButtonSelected!=null){
	        	leaveButton(currentButtonSelected)
	        }
        }

        if(buttonGroup.force!=0){
        	if(buttonGroup.force < 0 && buttonGroup.x > -950 ){
        		buttonGroup.x += buttonGroup.force
        		if(buttonGroup.x < -950){
        			buttonGroup.x = -950
        		}
        	}
        	else if(buttonGroup.force>0 && buttonGroup.x < 0){
        		buttonGroup.x += buttonGroup.force
        		if(buttonGroup.x > 0 ){
        			buttonGroup.x = 0
        		}
        	}

        	buttonGroup.force*=FRICTION
        }

        if(inTutorial!=-1){
            evalTutorial()

        }


        


    }

    function updateTouch(){
    	if(currentButtonSelected==null){
	    	/*touch.x = game.input.activePointer.x
	    	touch.y = game.input.activePointer.y
	    	var button = checkCollision(touch)
	    	if(button!=null){
	    		currentButtonSelected = button
	    	}*/
	    }
	    else{
	    	currentButtonSelected.x = game.input.activePointer.x
	    	currentButtonSelected.y = game.input.activePointer.y

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
        currentSequence = [-1,-1,-1,-1]
        
        okPressed = false

        //randomSecuence 
        correctSequence[0] = game.rnd.integerInRange(0,1)
        correctSequence[1] = game.rnd.integerInRange(-1,2)
        correctSequence[2] = game.rnd.integerInRange(-1,2)
        correctSequence[3] = game.rnd.integerInRange(-1,1)
        //randomSecuence

        if(inTutorial!=-1){
        	correctSequence = [0,0,0,0]
        }

        if(currentLevel>=LEVEL_TIMER){
            if(!timeOn){
               timeOn = true
               
               positionTimer()
            }
            console.log("positionTimer")
            startTimer(currentTime)

            if(currentTime > MIN_TIME){
                currentTime-= DELTA_TIME
            }
        }

        exampleCake.base.loadTexture('atlas.game','base_'+correctSequence[0],0,false)

        //console.log(exampleCake.topping)
        if(correctSequence[1]!=-1){
            exampleCake.topping.loadTexture('atlas.game','topping_'+correctSequence[1],0,false)
            exampleCake.topping.visible = true
        }
        else{
            exampleCake.topping.visible = false
        }

        if(correctSequence[2]!=-1){
            exampleCake.fruit.loadTexture('atlas.game','fruit_'+correctSequence[2],0,false)
            exampleCake.fruit.visible = true
        }
        else{
            exampleCake.fruit.visible = false
        }

        if(correctSequence[3]!=-1){
            exampleCake.extra.loadTexture('atlas.game','extra_'+correctSequence[3],0,false)
            exampleCake.extra.visible = true

            if(correctSequence[3]==1){
            	exampleCake.extra.x = 15
            }
            else{
            	exampleCake.extra.x = 3
            }
        }
        else{
            exampleCake.extra.visible = false
        }


        for(var i = 0 ; i < stationsImages.length; i++){
        	stationsImages[i].visible = false
        	if(stationButtons[i]!=null){
	        	stationButtons[i].x = stationButtons[i].initialX
	        	stationButtons[i].y = stationButtons[i].initialY
	        	stationButtons[i].visible = true
	        	sceneGroup.remove(stationButtons[i])
	        	buttonGroup.add(stationButtons[i])
	        }
        }

        stationButtons = [null,null,null,null]

        exampleCake.visible = true
        exampleCake.alpha = 1

        gameActive = true

        currentLevel ++

        if(inTutorial!=-1){
        	evalTutorial()
            //console.log("tutorial")
            tutorialScaleTween = game.add.tween(tutorialButtonArray[tutorialButtonInex].scale).to({x:1.3,y:1.3},300,Phaser.Easing.linear,true)
            tutorialScaleTween.yoyo(true)
            tutorialScaleTween.loop(true)
        }
    }

    function makeTutorialTween(){
        if(inTutorial!=-1)
        tutorialScaleTween = game.add.tween(tutorialButtonArray[tutorialButtonInex].scale).to({x:1.3,y:1.3},300,Phaser.Easing.linear,true)
        tutorialScaleTween.yoyo(true)
        tutorialScaleTween.loop(true)
    }

    function startCakeMovement(){
    	//exampleCake.visible = false
        var cake = getCake()
        cake.alpha = 1
        cake.x = stationPositions[0].x
        cake.y = stationPositions[0].y
        cake.nextStation = 1
        cakeGroup.remove(cake)
        stationBehindGruop[0].add(cake)

        spineConveyor[0].setAnimationByName(0,"idle",false)
        spineConveyor[0].addAnimationByName(0,"idle",false)
        spineConveyor[0].addAnimationByName(0,"idle",false)
        spineConveyor[0].addAnimationByName(0,"stop",true)

        game.add.tween(cake).to({alpha:1,x:stationPositions[1].x,y:stationPositions[1].y-20},TIME_MOVEMENT,Phaser.Easing.linear,true).onComplete.add(function(currentTaget){
            evaluateStation(currentTaget)
        })
    }


    function createTouch(){
        touch = game.add.sprite(-100,-100,'atlas.game','star')
        touch.alpha = 0.5
        touch.anchor.setTo(0.5)
        touch.scale.setTo(0.2)
    }


    function getCake(){

        for(var i = 0; i < cakeGroup.length; i++){
            //console.log(cakeGroup.length)
            if(!cakeGroup.chidren[i].visible){
                initCake(cakeGroup.chidren[i])
                return cakeGroup.chidren[i]
            }
        }

        var cake = createSingleCake()
        return cake
    }

    function createSingleCake(){
        var cake = game.add.group()
        var sprite = game.add.sprite(0,0,'atlas.game','dough')
        sprite.anchor.setTo(0.5)
        cake.add(sprite)
        cake.base = sprite

        var topping = game.add.sprite(0,-40,'atlas.game','topping_1')
        topping.visible = false
        topping.anchor.setTo(0.5)
        cake.add(topping)
        cake.topping = topping

        var fruit = game.add.sprite(3,-61,'atlas.game','fruit_1')
        fruit.visible = false
        fruit.anchor.setTo(0.5)
        cake.add(fruit)
        cake.fruit = fruit

        var extra = game.add.sprite(0,-40,'atlas.game','extra_1')
        extra.visible = false
        extra.anchor.setTo(0.5)
        cake.add(extra)
        cake.extra = extra

        cake.alpha = 0
        return cake

    }

    function initCake(cake){
        cake.base.loadTexture('atlas.game','dough',0,false)
        cake.topping.visible = false
        cake.fruit.visible = false
        cake.extra.visible = false
        cake.alpha = 0
        cake.visible = true
    }

    function getEmptySpineSlot(spine){
    	var empty 
        var slotIndex
        for(var index = 0, n = spine.skeletonData.slots.length; index < n; index++){
            var slotData = spine.skeletonData.slots[index]
            if(slotData.name === "empty"){
                slotIndex = index
            }
        }

        if (slotIndex){
            empty = spine.slotContainers[slotIndex]
        }

        return empty
    }

    function evaluateStation(cake){

        if(cake.nextStation == stationPositions.length - 1){
            sound.play('magic')
            Coin(stationPositions[cake.nextStation],pointsBar,100)

            game.add.tween(cake.scale).to({x:cake.scale.x*1.3,y:cake.scale.y*1.3},DELAY_EVALUATE_TIME/2,Phaser.Easing.linear,true).yoyo(true)
			game.add.tween(exampleCake.scale).to({x:cake.scale.x*1.3,y:cake.scale.y*1.3},DELAY_EVALUATE_TIME/2,Phaser.Easing.linear,true).yoyo(true)

            

            setTimeout(function(){
            	setRound()
            	cake.visible = false
            	ligths.setAnimationByName(0,"off",true)
            },DELAY_EVALUATE_TIME)
            return
        }

        //ligths[cake.nextStation-1].loadTexture('atlas.game',ligths[cake.nextStation-1].color+'_LIGHT',0,false)
        if(cake.nextStation == stationPositions.length - 2){
	        ligths.setAnimationByName(0,"on",true)
	    }
        spineMachines[cake.nextStation-1].setAnimationByName(0,"correct",true)
        if(spineMachines[cake.nextStation-1].alpha!=1){
            spineMachines[cake.nextStation-1].alpha = 1
        }

        sound.play('machineWorking')

        //spineMachines[cake.nextStation].setAnimationByname()
        setTimeout(function(){
            if(currentSequence[cake.nextStation-1] == correctSequence[cake.nextStation-1]){
                switch(cake.nextStation-1){
                    case 0:
                    cake.base.loadTexture('atlas.game','base_'+currentSequence[cake.nextStation-1])
                    break
                    case 1:
                    if(currentSequence[cake.nextStation-1]!=-1){
                        cake.topping.loadTexture('atlas.game','topping_'+currentSequence[cake.nextStation-1])
                        cake.topping.visible = true
                    }

                    break
                    case 2:
                    if(currentSequence[cake.nextStation-1]!=-1){
                        cake.fruit.loadTexture('atlas.game','fruit_'+currentSequence[cake.nextStation-1])
                        cake.fruit.visible = true
                    }
                    break
                    case 3:
                    if(currentSequence[cake.nextStation-1]!=-1){
                        cake.extra.loadTexture('atlas.game','extra_'+currentSequence[cake.nextStation-1])
                        cake.extra.visible = true
                        if(currentSequence[cake.nextStation-1]==1){
                        	cake.extra.x = 0
                        }
                        else{
                        	cake.extra.x = 15
                        }
                    }
                    break
                }
                if(cake.nextStation<spineConveyor.length){
	                spineConveyor[cake.nextStation].setAnimationByName(0,"idle",false)
	                spineConveyor[cake.nextStation].addAnimationByName(0,"idle",false)
	                spineConveyor[cake.nextStation].addAnimationByName(0,"idle",false)
	        		spineConveyor[cake.nextStation].addAnimationByName(0,"stop",true)
	        	}
                spineMachines[cake.nextStation-1].setAnimationByName(0,"idle",true)
                //ligths[cake.nextStation-1].setAnimationByName(0,"off",true)
                stationBehindGruop[cake.nextStation-1].remove(cake)
                stationBehindGruop[cake.nextStation].add(cake)
                smokeSpine.visible = true
                smokeSpine.x = spineMachines[cake.nextStation-1].x +120*spineMachines[cake.nextStation-1].scale.x
                if(cake.nextStation-1==1){
                	smokeSpine.x-=100
                }
                smokeSpine.y = spineMachines[cake.nextStation-1].y-70
                smokeSpine.scale.setTo(spineMachines[cake.nextStation-1].scale.x,spineMachines[cake.nextStation-1].scale.y)
                smokeSpine.setAnimationByName(0,"correct",false)
                setTimeout(function(){
                	//smokeSpine.visible = false
                }, 600)

                cake.nextStation+=1
                if(cake.nextStation == stationPositions.length - 1){
                    game.add.tween(machineGroup).to({y:0},200,Phaser.Easing.linear,true)
                }
                

                cake.alpha = 0.2
                //cake.scale.setTo(cake.scale.x/5,cake.scale.y/5)
                game.add.tween(cake).to({alpha:1},TIME_MOVEMENT/4,Phaser.Easing.linear,true)
                game.add.tween(cake).to({x:stationPositions[cake.nextStation].x,y:stationPositions[cake.nextStation].y-20},TIME_MOVEMENT,Phaser.Easing.linear,true).onComplete.add(function(currentTaget){
                    evaluateStation(currentTaget)
                })

                sound.play("combo")
            }
            else{
            	//ligths[cake.nextStation-1].setAnimationByName(0,"off",true)
            	spineMachines[cake.nextStation-1].setAnimationByName(0,"wrong",false)
            	spineMachines[cake.nextStation-1].addAnimationByName(0,"idle",true)
            	//console.log("misspoint here")
                missPoint()
                cake.visible = false
                setRound()
            }
        },DELAY_EVALUATE_TIME)
    }


    function createSpineMachines(){
        for(var i = 1; i < stationPositions; i ++){
            var spine = game.add.spine(stationPositions[i].x,stationPositions[i].y,'machine')
            sceneGroup.add(spine)
            spineMachines.push(spine)
        }
    }

    function clickOk(){

        if(okPressed){
            return
        }
        okPressed = true
    	if(hand.visible){

            game.add.tween(machineGroup).to({y:100},400,Phaser.Easing.linear,true).onComplete.add(function(){
                startCakeMovement()
            })

            for(var i = 0; i < spineMachines.length; i++){
                game.add.tween(spineMachines[i]).to({alpha:0.3},400,Phaser.Easing.linear,true)
            }

    		hand.visible = false
            if(tutorialTween!=null){
                tutorialTween.stop()
            }
            if(timeOutTutorial!=null){
                clearTimeout(timeOutTutorial)
            }
    		//evalTutorial()
    	}
        else{
            startCakeMovement()
        }
    	if(timeOn){
	        stopTimer()
	    }
        
        //exampleCake.visible = false
    }

    function clickButton(button,pointer){
    	//console.log(button.key)

        if(inTutorial!=-1 && button == tutorialButtonArray[tutorialButtonInex]){
            tutorialScaleTween.stop()
        }
        button.scale.setTo(1.3)
    	currentButtonSelected = button
    }

    function leaveButton(button){
        //button.scale.setTo(1)
    	buttonGroup.force = 0
    	var key = button.key.split("_")
    	var type = key[1]
    	var id 
		if(key[2]=="no"){
			id = -1
			key = "base_0"
		}
		else{
			id = Number(key[2])
			key = key[1]+"_"+id
		}


		if(inTutorial!=-1){
	    	if(!((inTutorial == 0 && type == "base" && id==correctSequence[0]) || (inTutorial == 1 && type == "topping" && id==correctSequence[1]) || (inTutorial == 2 && type == "fruit" && id==correctSequence[2]) || (inTutorial == 3 && type == "extra" && id==correctSequence[3]))){
	    		button.x = button.initialX
		    	button.y = button.initialY
                button.scale.setTo(1)
                makeTutorialTween()
			    sceneGroup.remove(currentButtonSelected)
			    buttonGroup.add(currentButtonSelected)
			    currentButtonSelected = null
			    return
	    	}
	    }


    	for(var i = 1; i < stationPositions.length-1; i++){
    		var d = Math.sqrt(Math.pow(button.x - stationPositions[i].x,2) + Math.pow(button.y-stationPositions[i].y,2))
    		
    		if(d < 100){

    			if((i == 1 && type!="base") || (i == 2 && type!="topping") || (i ==3 && type!="fruit") || (i == 4 && type!="extra")){
                    button.scale.setTo(1)
    				break
    				
    			}

    			button.x = stationPositions[i].x
    			button.y = stationPositions[i].y

    			if(stationButtons[i-1]!=null){
    				stationButtons[i-1].x = stationButtons[i-1].initialX
    				stationButtons[i-1].y = stationButtons[i-1].initialY
    				stationButtons[i-1].visible = true
    				sceneGroup.remove(stationButtons[i-1])
	    			buttonGroup.add(stationButtons[i-1])
    			}

    			sound.play("pop")

    			stationButtons[i-1] = button
    			button.visible = false

                game.add.tween(button.scale).to({x:0,y:0},100,Phaser.Easing.linear,true).onComplete.add(function(){
                    button.scale.setTo(1)
                })

    			if(inTutorial!=-1){
    				if(tutorialTween!= null){
    					//tutorialTween.pause()
    					tutorialTween.stop()
						tutorialTween = null
    					game.tweens.removeAll()
    				}

                    tutorialScaleTween.stop()

    				inTutorial++
                    tutorialButtonInex++
                    stationTutorial++
                    if(tutorialButtonInex < tutorialButtonArray.length){
                        makeTutorialTween()                    }

    				//evalTutorial()
    			}

    			currentSequence[i-1] = id


    			stationsImages[i-1].loadTexture('atlas.game',key,0,false)
    			if(id==-1){
    				stationsImages[i-1].visible = false
    			}
    			else{
    				stationsImages[i-1].visible = true
    			}

    			currentButtonSelected = null
    			
    			return
    		}
    	}

        button.scale.setTo(1)
        if(inTutorial!=-1){
            makeTutorialTween()
        }
    	button.x = button.initialX
    	button.y = button.initialY
	    sceneGroup.remove(currentButtonSelected)
	    buttonGroup.add(currentButtonSelected)
	    currentButtonSelected = null
    }

    function evalTutorial(){
        if(tutorialButtonInex>3){
            inTutorial=-1
            handOk()
            return
        }

        if(currentButtonSelected!=null && scrollState == SCROLL_STATE.SELECT){
            if(handState == SCROLL_STATE.SCROLL){
                if(tutorialTween!=null){
                    tutorialTween.stop()
                }
                if(timeOutTutorial!=null){
                    clearTimeout(timeOutTutorial)
                }
            }
            else if(handState == SCROLL_STATE.WAIT){
                if(tutorialTween !=null){
                    return
                }
            }
            else if(handState==SCROLL_STATE.SELECT){
                return
            }

            handState = SCROLL_STATE.WAIT
            hand.loadTexture('atlas.game','handDown')
            hand.x = currentButtonSelected.x+50
            hand.y = currentButtonSelected.y+50
            tutorialTween = game.add.tween(hand).to({x:stationPositions[stationTutorial].x,y:stationPositions[stationTutorial].y},2000,Phaser.Easing.linear,true)
            tutorialTween.onComplete.add(function(){
                handState = SCROLL_STATE.SELECT
                tutorialTween = null
                hand.loadTexture('atlas.game','handUp')
                timeOutTutorial = setTimeout(function(){handState = SCROLL_STATE.WAIT},500)
            })
        }
        else if(tutorialButtonArray[tutorialButtonInex].world.x >= game.world.centerX-250 && tutorialButtonArray[tutorialButtonInex].world.x< game.world.centerX+150){
            //console.log("eter tutoria")
            if(handState == SCROLL_STATE.SCROLL){
                if(tutorialTween!=null){
                    tutorialTween.stop()
                }
                if(timeOutTutorial!=null){
                    clearTimeout(timeOutTutorial)
                }
            }
            else if(handState == SCROLL_STATE.WAIT){
                if(tutorialTween !=null){
                    return
                }
            }
            else if(handState==SCROLL_STATE.SELECT){
                return
            }

            handState = SCROLL_STATE.WAIT
            hand.loadTexture('atlas.game','handDown')
            hand.x = tutorialButtonArray[tutorialButtonInex].world.x+50
            hand.y = tutorialButtonArray[tutorialButtonInex].world.y+50
            tutorialTween = game.add.tween(hand).to({x:stationPositions[stationTutorial].x,y:stationPositions[stationTutorial].y},2000,Phaser.Easing.linear,true)
            tutorialTween.onComplete.add(function(){
                handState = SCROLL_STATE.SELECT
                tutorialTween = null
                hand.loadTexture('atlas.game','handUp')
                timeOutTutorial = setTimeout(function(){handState = SCROLL_STATE.WAIT},500)
            })
        }
        else if(tutorialButtonArray[tutorialButtonInex].world.x < game.world.centerX-200){
            if(handState == SCROLL_STATE.SCROLL){
                return
            }
            else if(handState == SCROLL_STATE.WAIT || handState == SCROLL_STATE.SELECT){
                if(tutorialTween!=null){
                    tutorialTween.stop()
                }
                if(timeOutTutorial!=null){
                    clearTimeout(timeOutTutorial)
                }
            }
            /*else if(handState==SCROLL_STATE.SELECT){
                return
            }*/

            handState = SCROLL_STATE.SCROLL
            hand.loadTexture('atlas.game','handDown')
            hand.x = game.world.centerX-150
            hand.y = game.world.height-5
            tutorialTween = game.add.tween(hand).to({x:game.world.centerX+100},2000,Phaser.Easing.linear,true)
            tutorialTween.onComplete.add(function(){
                //handState = SCROLL_STATE.SELECT
                hand.loadTexture('atlas.game','handUp')
                tutorialTween = null
                setTimeout(function(){handState = SCROLL_STATE.WAIT},500)
            })

        }

        else if(tutorialButtonArray[tutorialButtonInex].world.x > game.world.centerX+150){
            if(handState == SCROLL_STATE.SCROLL){
                return
            }
            else if(handState == SCROLL_STATE.WAIT || handState == SCROLL_STATE.SELECT){
                if(tutorialTween!=null){
                    tutorialTween.stop()
                }
                if(timeOutTutorial!=null){
                    clearTimeout(timeOutTutorial)
                }
            }
            /*else if(handState==SCROLL_STATE.SELECT){
                return
            }*/

            handState = SCROLL_STATE.SCROLL
            hand.loadTexture('atlas.game','handDown')
            hand.x = game.world.centerX+150
            hand.y = game.world.height-5
            tutorialTween = game.add.tween(hand).to({x:game.world.centerX-100},2000,Phaser.Easing.linear,true)
            tutorialTween.onComplete.add(function(){
                //handState = SCROLL_STATE.SELECT
                hand.loadTexture('atlas.game','handUp')
                tutorialTween = null
                setTimeout(function(){handState = SCROLL_STATE.WAIT},500)
            })

        }
    }

    function handOk(){
        if(!hand.visible){
            return
        }
        if(tutorialTween!=null){
            tutorialTween.stop()
        }
        if(timeOutTutorial!=null){
            clearTimeout(timeOutTutorial)
        }
        hand.loadTexture('atlas.game','handDown')
        hand.x = game.world.centerX+200
        hand.y = game.world.height-50
        setTimeout(function(){
            hand.loadTexture('atlas.game','handUp')
            tutorialTween = null
            setTimeout(handOk,500)
        },500)
    }

    
    function createScene(){

        sceneGroup = game.add.group() 

        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        var backColor = game.add.graphics(0,0)
        backColor.beginFill(0x2f3432)
        backColor.drawRect(0,0,game.world.width,game.world.height)
        backColor.endFill()
        backgroundGroup.add(backColor)

        var background = game.add.sprite(game.world.centerX,game.world.centerY,'atlas.game','background')
        background.anchor.setTo(0.5)
        backgroundGroup.add(background)


        initialize()

        machineGroup = game.add.group()
        sceneGroup.add(machineGroup)

        machineGroup.y = 0

        backgroundSound = game.add.audio('codeCakeSong')
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

        spineConveyor = []
        
        var band = game.add.spine(game.world.centerX,game.world.centerY-230,'conveyor')
        //band.anchor.setTo(0.5)
        band.scale.setTo(-0.5,0.5)
        band.setAnimationByName(0,"stop",true)
        band.setSkinByName("normal")
        machineGroup.add(band)
        spineConveyor.push(band)

        var group = game.add.group()
        machineGroup.add(group)
        stationBehindGruop.push(group)

        var station = game.add.spine(stationPositions[1].x,stationPositions[1].y+130,'oven_b')
        //station.anchor.setTo(0.5)
        station.scale.setTo(0.5)
        station.setAnimationByName(0,"idle",true)

        station.setSkinByName("normal")
        machineGroup.add(station)
        spineMachines.push(station)

        band = game.add.spine(game.world.centerX,game.world.centerY-50,'conveyor')
        //band.anchor.setTo(0.5)
        band.scale.setTo(0.5,0.5)
        band.setAnimationByName(0,"stop",true)
        band.setSkinByName("normal")
        machineGroup.add(band)
        spineConveyor.push(band)

        group = game.add.group()
        machineGroup.add(group)
        stationBehindGruop.push(group)

        station = game.add.spine(stationPositions[2].x,stationPositions[2].y+120,'oven_d')
        //station.anchor.setTo(0.5)
        station.scale.setTo(0.5)
        station.setAnimationByName(0,"idle",true)
        station.setSkinByName("normal")
        machineGroup.add(station)
        spineMachines.push(station)

        //station.tint = 0x0000ff
        band = game.add.spine(game.world.centerX,game.world.centerY+130,'conveyor')
        //band.anchor.setTo(0.5)
        band.scale.setTo(-0.5,0.5)
        band.setAnimationByName(0,"stop",true)
        band.setSkinByName("normal")
        machineGroup.add(band)
        spineConveyor.push(band)

        group = game.add.group()
        machineGroup.add(group)
        stationBehindGruop.push(group)

        station = game.add.spine(stationPositions[3].x,stationPositions[3].y+140,'oven_c')
        //station.anchor.setTo(0.5)
        station.scale.setTo(0.5)
        station.setAnimationByName(0,"idle",true)
        station.setSkinByName("normal")
        machineGroup.add(station)
        spineMachines.push(station)

        //station.tint = 0x00ffff
        band = game.add.spine(game.world.centerX,game.world.centerY+310,'conveyor')
        //band.anchor.setTo(0.5)
        band.scale.setTo(0.5)
        band.setAnimationByName(0,"stop",true)
        band.setSkinByName("normal")
        machineGroup.add(band)
        spineConveyor.push(band)

        group = game.add.group()
        machineGroup.add(group)
        stationBehindGruop.push(group)
        

        station = game.add.spine(stationPositions[4].x,stationPositions[4].y+150,'oven_a')
        //station.anchor.setTo(0.5)
        station.scale.setTo(-0.5,0.5)
        station.setAnimationByName(0,"idle",true)
        station.setSkinByName("normal")
        machineGroup.add(station)
        spineMachines.push(station)

        ligths = game.add.spine(stationPositions[4].x,stationPositions[4].y-100,'light_bulbs')
        ligths.scale.setTo(0.5)
        ligths.setAnimationByName(0,"off",true)
        ligths.setSkinByName("green")
        //ligth.anchor.setTo(0.5)
        ligths.color = 'GREEN'
        machineGroup.add(ligths)

        //station.tint = 0x00ff00
        var finish = machineGroup.create(game.world.centerX+90,game.world.centerY + 290,'atlas.game','FINAL_PLATE')
        finish.anchor.setTo(0.5)

        group = game.add.group()
        machineGroup.add(group)
        stationBehindGruop.push(group)

        var board = sceneGroup.create(game.world.centerX,game.world.height,'atlas.game','BOARD')
        board.anchor.setTo(0.5,1)

       

        buttonGroup = game.add.group()
        //buttonGroup.y = game.world.height - 80
        buttonGroup.x = 0

        var deltaButton = 100
        var initX = game.world.centerX -200
        for(var i = 0; i < imageNames.length; i++){
       		var button = buttonGroup.create(initX+(deltaButton*i),game.world.height - 80,'atlas.game',imageNames[i])
            if(i ==0 || i == 2 || i == 6|| i==10){
                tutorialButtonArray.push(button)
            }
       		button.anchor.setTo(0.5)
       		button.key = imageNames[i]
       		button.initialX = button.x
       		button.initialY = button.y
       		button.inputEnabled = true
       		var data = imageNames[i]
        	button.events.onInputDown.add(clickButton,this)
        	//button.events.onInputUp.add(leaveButton,this)
        }

        var maskGraphis = game.add.graphics()
        maskGraphis.beginFill(0xFF3300)
        maskGraphis.drawRect(game.world.centerX-250,game.world.height-160,370,150)
        maskGraphis.endFill()

        buttonGroup.mask = maskGraphis
        buttonGroup.force = 0

        sceneGroup.add(buttonGroup)

        var okBtn = sceneGroup.create(game.world.centerX+180,game.world.height-80,'atlas.game','button')
        okBtn.anchor.setTo(0.5)
        okBtn.inputEnabled = true
        okBtn.events.onInputDown.add(function(){
            okBtn.loadTexture("atlas.game","button_down")
            clickOk()
        },this)

        okBtn.events.onInputUp.add(function(){
            okBtn.loadTexture("atlas.game","button")
        },this)

        

        stationsImages = []
        var left = -1
        for(var i = 1; i < stationPositions.length-1; i++){
        	var image = sceneGroup.create(0,0,'atlas.game','fruit_0')
        	image.anchor.setTo(0.5)
        	image.scale.setTo(0.9)

        	if(i ==1){
        		image.scale.setTo(0.6)
        		image.x +=10
        	}
        	else if(i == 4){
        		image.x +=20
        	}
        	//image.x += left*55
        	//image.scale.setTo(0.4)
        	image.visible = false
        	//left*=-1
        	stationsImages.push(image)
        	var empty = getEmptySpineSlot(spineMachines[i-1])
        	empty.add(image)
        }
       





        cakeGroup = game.add.group()
        sceneGroup.add(cakeGroup)

        smokeSpine  = game.add.spine(game.world.centerX,game.world.centerY,'smoke')
        smokeSpine.visible = false
        //smokeSpine.setAnimationByName(0,"correct",true)
        smokeSpine.setSkinByName("normal")
        machineGroup.add(smokeSpine)


        sampleImage = sceneGroup.create(0,-10,'atlas.game','SAMPLE')
        sampleImage.anchor.setTo(0.5)

        glitterImages = []
        var glitter = sceneGroup.create(70,-70,'atlas.game','GLITTER')
        glitter.anchor.setTo(0.5)
        glitter.directionAngle = -1
        glitter.directionScale = -1
        glitterImages.push(glitter)

        glitter = sceneGroup.create(-70,70,'atlas.game','GLITTER')
        glitter.anchor.setTo(0.5)
        glitter.directionAngle = 1
        glitter.directionScale = -1
        glitterImages.push(glitter)

        exampleCake = getCake()
        exampleCake.x = game.world.centerX-200
        exampleCake.y = game.world.centerY+250

        exampleCake.add(sampleImage)
        exampleCake.add(glitterImages[0])
        exampleCake.add(glitterImages[1])
        //exampleCake.bringToTop(sampleImage)
        exampleCake.bringToTop(exampleCake.base)
        exampleCake.bringToTop(exampleCake.topping)
        exampleCake.bringToTop(exampleCake.fruit)
        exampleCake.bringToTop(exampleCake.extra)
        /*exampleCake.visible = true
        exampleCake.alpha = 1*/
        cakeGroup.remove(exampleCake)
        sceneGroup.add(exampleCake)

        hand = sceneGroup.create(0,0,'atlas.game','handUp')
        hand.anchor.setTo(0.5)

        //console.log(exampleCake)

        //createSpineMachines()

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
		name: "codeCake",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()
