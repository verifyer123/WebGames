var soundsPath = "../../shared/minigames/sounds/"


var towerBuffet = function(){
    

	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/towerBuffet/atlas.json",
                image: "images/towerBuffet/atlas.png"
            },
            {
                name: "atlas.time",
                json: "images/towerBuffet/timeAtlas.json",
                image: "images/towerBuffet/timeAtlas.png"
            },
            {
                name: "atlas.nutrimental_ES",
                json: "images/towerBuffet/ES_nutrimental_atlas.json",
                image: "images/towerBuffet/ES_nutrimental_atlas.png",
            },
            {
                name: "atlas.nutrimental_EN",
                json: "images/towerBuffet/EN_nutrimental_atlas.json",
                image: "images/towerBuffet/EN_nutrimental_atlas.png",
            },

        ],
        images: [
            /*{   name:"tutorial_image",
                file: "images/towerBuffet/tutorial_image.png"}*/
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
                name: 'gameSong',
                file: soundsPath + 'songs/running_game.mp3'
                }

            
        ],
        spines:[
            {
                name:'monster',
                file:'images/spines/monster/monster.json'
            },
            {
                name:'theffanie',
                file:'images/spines/theffanie/theffanie.json'
            }

		]
    }

    var NUM_LIFES = 3
    var INITIAL_TIME = 8000
    var DELTA_TIME = 500
    var MIN_TIME = 1000
    var LEVLES_TO_TIMER = 6

    var INITIAL_VELOCITY = 4
    var DELTA_VELOCITY = 0.2
    var DISTANCE_BETWEEN_PRODUCTS = 200
    var INITIAL_X

    var lives
	var sceneGroup = null
    var gameIndex = 164
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

    var shade
    var extraShade
    var carpetLines

    var lang

    var theffanieSpine
    var monsterSpine

    var arrayObject
    var currentNutrimentalGruop

    var currentVelocity
    var stars
    var wall
    var floor
    var floorLimit

    var canTouch
    var countNoCurrentNutrimental

    var lastObject

    var productsGroup

    var catchProduct

    var nutrimentalObjects

    var totallyCatch 

   	var nutrimentalGroupsPassed

   	var inTutorial 
   	var stopByTutorial 

   	var linesValue
   	var isCorrect

   	var tutorialObjects
   	var tutorialTimeout

   	var currentCorrectLine

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

        carpetLines = []

        linesValue = [0,1,2]

        if(lang=="ES"){
        	arrayObject = [{angle:0,x:-8,y:0,products:["dairy_1","dairy_3","protein_1","protein_4","leguminosa_1","leguminosa_2","leguminosa_3"]},{angle:120,x:3,y:-6,products:["grain_1","grain_2","grain_3","grain_4","grain_5"]},{angle:240,x:2,y:9,products:["fruit_1","fruit_2","fruit_3","veggie_1","veggie_2","veggie_3"]}]
        }else{
        	arrayObject = [{angle:0,x:-45,y:3,on:true,products:["protein_1","protein_2","protein_4"]},{angle:90,x:-45,y:3,on:true,products:["veggie_1","veggie_2","veggie_3"]},{angle:180,x:-45,y:3,on:true,products:["fruit_1","fruit_2","fruit_3"]},{angle:270,x:-45,y:3,on:true,products:["grain_4","grain_2","grain_3"]},{angle:0,x:-45,y:3,on:false,products:["dairy_1","dairy_2","dairy_3"]}]
        }

        currentVelocity = INITIAL_VELOCITY

        gameActive = false
        catchProduct = 0
        canTouch = true

        countNoCurrentNutrimental = 0

        INITIAL_X = game.world.width + 200
        totallyCatch = 0

        nutrimentalGroupsPassed = 0

        stopByTutorial = false
        tutorialObjects =[]

        loadSounds()
        
	}

    function preload(){
        game.stage.disableVisibilityChange = false;


		lang = localization.getLanguage()
        game.load.image('tutorial_image',"images/towerBuffet/tutorial_image_"+lang+".png")
        game.load.spritesheet("coin", 'images/towerBuffet/coin.png', 122, 123, 12)

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
        if(tweenTiempo){
          tweenTiempo.stop()
      }
      tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, 500, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
      })
    }

    function startTimer(time){
       tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
       tweenTiempo.onComplete.add(function(){
           //missPoint()
           stopTimer()
           //canPlant=false
           win = false
           evaluateApple()
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
        	gameActive = false
        	monsterSpine.setAnimationByName(0,'win',false)
        	monsterSpine.addAnimationByName(0,'winstill',true)
        	theffanieSpine.setAnimationByName(0,'lose',true)
            stopGame(false)
        }
        else{
        	theffanieSpine.setAnimationByName(0,'hit',false)
        	if(lives>1){
        		theffanieSpine.addAnimationByName(0,'run',true)
        	}
        	else{
        		theffanieSpine.addAnimationByName(0,'run_tired',true)
        	}
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
        if(!gameActive){
			return
        }
        if(!stopByTutorial){
	        stars.tilePosition.x -=currentVelocity
	        floor.tilePosition.x -=currentVelocity
	        floorLimit.tilePosition.x -=currentVelocity
	        wall.tilePosition.x -=currentVelocity

	        for(var i = 0; i < carpetLines.length; i ++){
	        	carpetLines[i].tilePosition.x-=currentVelocity
	        }
        
	        
	        updateObjects()


	        if(monsterSpine.nextX > monsterSpine.x){
	        	monsterSpine.x += 3
	        }
	    }

	    upddateTouch()
    }

    function upddateTouch(){
    	if(game.input.activePointer.isDown){
    		if(canTouch){
    			canTouch = false

    			

    			for(var i = 0; i <carpetLines.length; i++ ){
	    			if(game.input.activePointer.y > carpetLines[i].y-(carpetLines[i].height/2) && game.input.activePointer.y < carpetLines[i].y+(carpetLines[i].height/2)){
	    				
	    				if(inTutorial!=-1){
	    					if(i != currentCorrectLine){
	    						canTouch = true
	    						return
	    					}
							theffanieSpine.autoUpdate = true
							monsterSpine.autoUpdate = true
		    				clearTimeout(tutorialTimeout)
		    				hand.visible = false
		    				inTutorial ++
		    				if(inTutorial >=3){
		    					inTutorial = -1
		    				}
		    				stopByTutorial = false
		    			}

		    			theffanieSpine.y = carpetLines[i].y+20
	    				break
	    			}	
	    		}
    		}
    	}
    	else{
    		if(inTutorial==-1){
	    		canTouch = true
	    	}
    	}
    }


    function updateObjects(){
    	for(var i = 0; i < productsGroup.length; i++){
    		if(productsGroup.children[i].visible){
    			productsGroup.children[i].x -= currentVelocity
    			var y = Math.abs(theffanieSpine.y - productsGroup.children[i].y)
    			if(y < 30){
    				if(productsGroup.children[i].x < theffanieSpine.x+80 && productsGroup.children[i].x > theffanieSpine.x-80){
    					productsGroup.children[i].visible = false
    					checkCollision(productsGroup.children[i])
    				}
    			}

    			if(productsGroup.children[i].x < -100){
    				productsGroup.children[i].visible = false
    			}
    		}
    	}

    	if(inTutorial!=-1){
    		for(var i = 0; i < tutorialObjects.length; i++){
    			if(tutorialObjects[i].x < game.world.centerX+100){
    				canTouch = true
    				stopByTutorial = true
    				currentCorrectLine = tutorialObjects[i].line
    				evalTutorial(tutorialObjects[i])
    				tutorialObjects.splice(i,1)
    				theffanieSpine.autoUpdate = false
    				monsterSpine.autoUpdate = false
    				break
    			}
    		}
    	}


    	if(lastObject.x < game.world.width-300){
    		linesValue = [0,1,2]
    		if(inTutorial!=-1){
    			if(theffanieSpine.y < carpetLines[1].y){
    				linesValue = [1,2]
    			}
    			else if(theffanieSpine.y < carpetLines[2].y){
					linesValue = [0,2]
    			}
    			else{
    				linesValue = [0,1]
    			}
		    	isCorrect = true
		    	getObject()
		    	isCorrect = false
		    	getObject()
    		}
    		else{
    			var r = game.rnd.integerInRange(1,2)
    			for(var i = 0; i < r; i++){
    				getObject()
    			}
    		}
    		
    	}
    }

    function checkCollision(object){
    	sound.play('pop')
    	if(object.index == currentNutrimentalGruop){
    		Coin(object,pointsBar,100)
    		catchProduct ++
    		totallyCatch ++
    		if(catchProduct>=3){
    			currentNutrimentalGruop = game.rnd.integerInRange(0,arrayObject.length-1)
    			if(nutrimentalGroupsPassed!=-1){
    				nutrimentalGroupsPassed++
    				if(nutrimentalGroupsPassed==arrayObject.length){
    					nutrimentalGroupsPassed=-1
    					//nutrimentalObjects.visible = false
    					nutrimentalObjects.tint = 0x000000
    				}
    				else{
	    				currentNutrimentalGruop = nutrimentalGroupsPassed
	    			}
    				
    			}

		    	catchProduct = 0
		    	checkNutrimental()

		    	currentVelocity+=DELTA_VELOCITY
    		}

    		if(totallyCatch>30){
				nutrimentalObjects.visible = false
    		}
    	}
    	else{
    		missPoint()
    		monsterSpine.nextX+=100

    	}
    }
    

    function createTutorial(){
        
        tutoGroup = game.add.group()

        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }




    function setRound(){
    	gameActive = true

    	theffanieSpine.setAnimationByName(0,'run',true)
    	monsterSpine.setAnimationByName(0,'run',true)
    	canTouch = false
    	//currentNutrimentalGruop = game.rnd.integerInRange(0,arrayObject.length-1)
    	currentNutrimentalGruop = 0
    	catchProduct = 0
    	checkNutrimental()
    	linesValue = [0,2]
    	isCorrect = true
    	getObject()
    	isCorrect = false
    	getObject()
    }

    function getObject(){
    	var r = game.rnd.integerInRange(0,linesValue.length-1)
    	var line = linesValue[r]
    	linesValue.splice(r,1)
    	y = carpetLines[line].y

    	var index = game.rnd.integerInRange(0,arrayObject.length-1)
    	if(index != currentNutrimentalGruop){
    		countNoCurrentNutrimental++
    		if(countNoCurrentNutrimental>=2){
    			countNoCurrentNutrimental=0
    			index = currentNutrimentalGruop
    		}
    	}
    	else{
    		countNoCurrentNutrimental = 0
    	}

    		//index = currentNutrimentalGruop
    	if(inTutorial!=-1){
    		if(isCorrect){
    			index = currentNutrimentalGruop
    		}
    		else{
    			index = currentNutrimentalGruop
    			var a = game.rnd.integerInRange(0,1)
    			if(a==0){
    				a = -1
    			}

    			index +=a

    			if(index < 0){
    				index = arrayObject.length-1
    			}
    			else if(index > arrayObject.length-1){
    				index = 0
    			}
    		}
    	}

    	var key = game.rnd.integerInRange(0,arrayObject[index].products.length-1)
    	key = arrayObject[index].products[key]

    	for(var i =0; i < productsGroup.length; i ++){
    		if(!productsGroup.children[i].visible){
    			productsGroup.children[i].visible = true
    			productsGroup.children[i].x = INITIAL_X
    			productsGroup.children[i].y = y
    			productsGroup.children[i].loadTexture('atlas.game',key,0,false)
    			lastObject = productsGroup.children[i]
    			productsGroup.children[i].index = index
    			if(inTutorial!=-1){
		    		if(isCorrect){
		    			tutorialObjects.push(productsGroup.children[i])
		    			productsGroup.children[i].line = line
		    		}
		    	}
    			return
    		}
    	}


    	var product = productsGroup.create(INITIAL_X, y, 'atlas.game',key)
		product.anchor.setTo(0.5)
		lastObject = product

		product.index = index

		if(inTutorial!=-1){
    		if(isCorrect){
    			tutorialObjects.push(product)
    			product.line = line
    		}
    	}


    }

    function checkNutrimental(){
    	if(lang=="ES"){
    		shade.angle = arrayObject[currentNutrimentalGruop].angle
    		shade.x = shade.initX+arrayObject[currentNutrimentalGruop].x
    		shade.y = shade.initY+arrayObject[currentNutrimentalGruop].y
    	}
    	else{
    		if(arrayObject[currentNutrimentalGruop].on){
    			shade.loadTexture('atlas.nutrimental_EN','shade_US',0,false)
    			extraShade.visible = true
    		}
    		else{
    			shade.loadTexture('atlas.nutrimental_EN','shade_complete',0,false)
    			extraShade.visible = false
    		}

    		shade.angle = arrayObject[currentNutrimentalGruop].angle
    		shade.x = shade.initX+arrayObject[currentNutrimentalGruop].x
    		shade.y = shade.initY+arrayObject[currentNutrimentalGruop].y

    	}
    }


    function evalTutorial(object){
    	hand.visible = true
    	hand.x = theffanieSpine.x +50
    	hand.y = object.y
    	handTutorialLoop()
    }

    function handTutorialLoop(){
    	hand.loadTexture('atlas.game','handDown',0,false)
    	tutorialTimeout = setTimeout(function(){
    		hand.loadTexture('atlas.game','handUp',0,false)
    		tutorialTimeout = setTimeout(handTutorialLoop,500)
    	},500)
    }

    
    function createScene(){
        //yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)


		initialize()

        var bmd = game.add.bitmapData(1, game.world.height)

        var y = 0;

        for (var i = 0; i < game.world.height/2; i++)
        {
            var c = Phaser.Color.interpolateColor(0x00aa89, 0x071742, game.world.height, i);

            bmd.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c));

            y += 2;
        }

        var background = game.add.sprite(0, 0, bmd);
        background.scale.setTo(game.world.width,1)
        sceneGroup.add(background)

        stars = game.add.tileSprite(0,0,game.world.width,game.world.centerY,'atlas.game','stars')
        sceneGroup.add(stars)

        wall = game.add.tileSprite(0,0,game.world.width,game.world.centerY,'atlas.game','background')
        sceneGroup.add(wall)

        var board = sceneGroup.create(game.world.width - 200, 200,'atlas.game','board')
        board.anchor.setTo(0.5)

        if(lang == "ES"){
        
	        var nutrimental = sceneGroup.create(board.x, board.y+30,'atlas.nutrimental_ES','nutrimetal_mx')
	        nutrimental.anchor.setTo(0.5)

	        nutrimentalObjects = sceneGroup.create(nutrimental.x, nutrimental.y,'atlas.nutrimental_ES','nutriobjects_mx')
	        nutrimentalObjects.anchor.setTo(0.5)

	        shade = sceneGroup.create(nutrimental.x-8, nutrimental.y,'atlas.nutrimental_ES','shade_mx')
	        shade.initX = shade.x+9
	        shade.initY = shade.y
	        shade.anchor.setTo(0.5)

	    }
	    else{
	    	var nutrimental = sceneGroup.create(board.x, board.y+30,'atlas.nutrimental_EN','nutrimental_US')
	        nutrimental.anchor.setTo(0.5)

	        nutrimentalObjects = sceneGroup.create(nutrimental.x+8, nutrimental.y,'atlas.nutrimental_EN','nutriobjects_us')
	        nutrimentalObjects.anchor.setTo(0.5)

	        shade = sceneGroup.create(nutrimental.x-45, nutrimental.y+3,'atlas.nutrimental_EN','shade_US')
	        shade.initX = shade.x+45
	        shade.initY = shade.y-3
	        shade.anchor.setTo(0.5)

	        extraShade = sceneGroup.create(nutrimental.x+122, nutrimental.y-78,'atlas.nutrimental_EN','shade_complete')
	        extraShade.anchor.setTo(0.5)
	        extraShade.scale.setTo(0.45)
	    }
	    

        floor = game.add.tileSprite(0,game.world.centerY,game.world.width,game.world.centerY,'atlas.game','floor_background')
        sceneGroup.add(floor)

        floorLimit = game.add.tileSprite(0,game.world.centerY-20,game.world.width,40,'atlas.game','floor')
        sceneGroup.add(floorLimit)

        var initY = game.world.centerY + 110
        for(var i = 0; i < 3; i ++){
        	var line = game.add.tileSprite(0,initY,game.world.width,128,'atlas.game','carpet')
        	line.anchor.setTo(0,0.5)
        	carpetLines.push(line)
        	sceneGroup.add(line)
        	initY += 140
        }

        productsGroup = game.add.group()
        sceneGroup.add(productsGroup)

        

        monsterSpine = game.add.spine(0,carpetLines[0].y-100,'monster')

        //theffanieSpine.anchor.setTo(0.5)
        monsterSpine.setSkinByName('normal')
        monsterSpine.setAnimationByName(0,'idle',true)
        monsterSpine.nextX = monsterSpine.x
        sceneGroup.add(monsterSpine)


        theffanieSpine = game.add.spine(200,carpetLines[1].y+20,'theffanie')
        theffanieSpine.scale.setTo(0.5)
        theffanieSpine.setSkinByName('normal')
        theffanieSpine.setAnimationByName(0,'idle',true)
        sceneGroup.add(theffanieSpine)

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

        

        createPointsBar()
        createHearts()
        
        correctParticle = createPart('atlas.game','star')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)

        hand = sceneGroup.create(0,0,'atlas.game','handUp')
        hand.anchor.setTo(0.5)
        hand.visible = false

        createTutorial()
    
    }
    
	return {
		assets: assets,
		name: "towerBuffet",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()
