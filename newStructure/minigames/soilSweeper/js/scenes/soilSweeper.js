
var soundsPath = "../../shared/minigames/sounds/"

var soilSweeper = function(){
    
	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/soilSweeper/atlas.json",
                image: "images/soilSweeper/atlas.png"
            },
            {   
                name: "atlas.time",
                json: "images/soilSweeper/timeAtlas.json",
                image: "images/soilSweeper/timeAtlas.png"
            },

        ],
        images: [
            {   name:"tutorial_image",
				file: "images/soilSweeper/tutorial_image.png"}
		],
		sounds: [
            {	name: "pop",
                file: soundsPath + "pop.mp3"},
		    {	name: "explode",
				file: soundsPath + "explode.mp3"},
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
                file: soundsPath + 'songs/happy_game_memories.mp3'
                }
		],
        spines:[
            {
            	name:"tomikoSpine",
            	file:"images/spines/Tomiko/tomiko.json"
            }
        ]
    }

    var NUM_LIFES = 3
    var X_SPACES = 4
    var DELTA_SPACE_X = 100
    var DELTA_SPACE_Y = 100
    var Y_SPACES = 8

    var INITIAL_TIME = 16000
    var DELTA_TIME = 250
    var MIN_TIME = 10000
    var LEVLES_TO_TIMER = 3

    var INITIAL_SOILS = 1
    var DELTA_SOIL_LEVEL = 0.3
    var MAX_SOILS = (X_SPACES*Y_SPACES)/2


    var currentSoils
    
    var lives
	var sceneGroup = null
    var gameIndex = 159
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

    var gridArray
    var spacesInLine
    var currentDirection

    var space_0

    var inTutorial
    var hand
    var tutorialTween
    var indexhandTutorial

    var canTouch 

    var releaseTouch

    var groundGroup
    var groundArray

    var numberGroup

    var touchPositions

    var soilPositions

    var extraEvaluationArray

    var slotsArray
    var dangerArray

    var extraSoilsGroup

    var tomikoSpine



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
        canTouch = false
        releaseTouch = true

        quadsHide = 0
        inTutorial = 0
        groundArray = []

        touchPositions = []
        soilPositions = []

        currentSoils = INITIAL_SOILS

        slotsArray = []

        loadSounds()
        
	}

	function initTouchPositions(){
		for(var i = 0; i < X_SPACES; i ++){
			for(var j = 0; j < Y_SPACES; j++){
				touchPositions.push({x:i,y:j, soil:false})
			}
		}
	}

	function restartGroundArray(){
		slotsArray = []
		for(var i = 0; i < X_SPACES; i ++){
			for(var j = 0; j < Y_SPACES; j++){
				groundArray[i][j].loadTexture('atlas.game','soil',0,false)
				groundArray[i][j].soil = false
				groundArray[i][j].evaluated = false
				groundArray[i][j].inputEnabled = true
				slotsArray.push(groundArray[i][j])
			}
		}

		for(var i = 0; i < numberGroup.length; i ++){
			numberGroup.children[i].visible = false
		}

		for(var i = 0; i < extraSoilsGroup.length; i ++){
			extraSoilsGroup.children[i].visible = false
		}
	}


    function preload(){
        game.stage.disableVisibilityChange = false;
        game.load.spritesheet("coin", 'images/soilSweeper/coin.png', 122, 123, 12)
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
        tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, 500, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
        })
    }

    function startTimer(time){
       tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
       tweenTiempo.onComplete.add(function(){
           missPoint()
           stopTimer()
           if(lives>0){
           		startTimer(currentTime)


           		
           }
       })
    }

    function Coin(objectBorn,objectDestiny,time, value){
       
       
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
           game.add.tween(coins).to({x:objectDestiny.x,y:objectDestiny.y},200,Phaser.Easing.Cubic.InOut,true,time)
           game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
               coins.x=objectBorn.x
               coins.y=objectBorn.y
               //var points = Math.round(currentSoils)
               addPoint(value)
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
        	
			if(timeOn){
				stopTimer()
			}

            stopGame(false)
        }

    }
    


    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height
        inputsEnabled = true
        setRound()

    }
    
    function update() {
        
    }

    function onClickSlot(button,pointer){
    	//console.log("touch")
    	if(inTutorial!=-1){
    		if(button.indexX != slotsArray[indexhandTutorial].indexX || button.indexY != slotsArray[indexhandTutorial].indexY){
    			return
    		}
    	}

    	var miss = false
    	if(canTouch){
    		sound.play("pop")
        	canTouch = false

			if(button.soil){
				button.loadTexture('atlas.game','toxic',0,false)
				missPoint()
				miss = true
				/*if(lives>0){
					tomikoSpine.setAnimationByName(0,'LOSE',false)
					tomikoSpine.addAnimationByName(0,'IDLE',true)
				}
				else{*/
					tomikoSpine.setAnimationByName(0,'LOSESTILL',true)
				//}
				//canTouch = true

				setTimeout(setRound,1500)
				return

			}
			else{
				var haveNumber = evaluatePos(button.indexX,button.indexY)
				if(haveNumber==0){
					
					addExtraSlotsToEvaluation(button.indexX,button.indexY)
					
					button.loadTexture('atlas.game','soil_green',0,false)
					
					extraEvaluate()
				}
				else{
					extraEvaluationArray = []
					getNumber(button.x,button.y,haveNumber)
    				canTouch = true

				}

				var index = slotsArray.indexOf(button)
				if(index == -1){
					//console.log("error")
				}
				else{
					slotsArray.splice(index,1)
				}


				if(inTutorial!=-1 && slotsArray.length>0){
		    		indexhandTutorial = game.rnd.integerInRange(0,slotsArray.length-1)
		    		if(tutorialTween!=null){
		    			clearTimeout(tutorialTween)
		    		}
		    		evalTutorial()
		    	}
				
			}

			button.evaluated = true
			button.inputEnabled = false	

			for(var i = 0; i < dangerArray.length; i++){
				if(dangerArray[i].evaluated){
					continue
				}

				var aislated = isAislatedToxic(dangerArray[i].indexX,dangerArray[i].indexY)
				//console.log(aislated,dangerArray[i].indexX,dangerArray[i].indexY)
				if(aislated){
					dangerArray[i].evaluated = true
					dangerArray[i].inputEnabled = false
					getAlphaSoil(dangerArray[i].x,dangerArray[i].y)
					Coin(dangerArray[i],pointsBar,500,1)
					sound.play("right")
				}
			}
			var allToxic = true
			for(var i = 0; i < dangerArray.length; i++){
				if(!dangerArray[i].evaluated){
					allToxic = false
				}
			}

			if(allToxic){
				if(coins>0){
					Coin({x:game.world.centerX,y:game.world.centerY},pointsBar,500,coins)
				}
				sound.play("magic")
				setTimeout(setRound,1500)
				tomikoSpine.setAnimationByName(0,'WIN',true)
				inTutorial =-1
				if(tutorialTween!=null){
	    			clearTimeout(tutorialTween)
	    		}
	    		hand.visible = false
				return
			}


			if(!miss){
				if(slotsArray.length<=0){
					var coins = 0
					for(var i = 0; i < dangerArray.length; i++){
						dangerArray[i].loadTexture('atlas.game','toxic')
						if(!dangerArray[i].evaluated){
							coins++
						}
					}
					if(coins>0){
						Coin({x:game.world.centerX,y:game.world.centerY},pointsBar,500,coins)
					}
					sound.play("magic")
					setTimeout(setRound,1500)
					tomikoSpine.setAnimationByName(0,'WIN',true)
					inTutorial =-1
					if(tutorialTween!=null){
		    			clearTimeout(tutorialTween)
		    		}
		    		hand.visible = false
					
				}
				else{
					tomikoSpine.setAnimationByName(0,'GOOD',false)
					tomikoSpine.addAnimationByName(0,'IDLE',true)
				}
			}

			
        }
    }

    function isAislatedToxic(toxicX,toxicY){
    	var aislated = true
    	for(var a = -1; a <= 1; a++){
			for(var b = -1; b <= 1; b++){

				if(a ==0 && b ==0){
					continue
				}

				if(toxicX+a<0 || toxicY+b<0 || toxicX+a == X_SPACES || toxicY+b==Y_SPACES){
					continue
				}
				//console.log(groundArray[toxicX+a][toxicY+b].evaluated, groundArray[toxicX+a][toxicY+b])
				if(!groundArray[toxicX+a][toxicY+b].evaluated){
					//console.log(groundArray[toxicX+a][toxicY+b].evaluated,groundArray[toxicX+a][toxicY+b])
					aislated = false
					break
				}
			}
			if(!aislated){
				break
			}
		}

		return aislated
    }

    function addExtraSlotsToEvaluation(x,y){
    	for(var a = -1; a <= 1; a++){
			for(var b = -1; b <= 1; b++){

				if(a ==0 && b ==0){
					continue
				}

				if(x+a<0 || y+b<0 || x+a == X_SPACES || y+b==Y_SPACES){
					continue
				}

				if(!groundArray[x+a][y+b].evaluated){
					extraEvaluationArray.push(groundArray[x+a][y+b])
				}
				else{
					//console.log(x+a,y+b)
				}
				
			}
		}
    }

    function extraEvaluate(){
    	for(var i = 0; i < extraEvaluationArray.length; i++){
    		var number = evaluatePos(extraEvaluationArray[i].indexX,extraEvaluationArray[i].indexY)
    		if(number==0){
    			addExtraSlotsToEvaluation(extraEvaluationArray[i].indexX,extraEvaluationArray[i].indexY)
				extraEvaluationArray[i].loadTexture('atlas.game','soil_green',0,false)
				
			}
			else{
				getNumber(extraEvaluationArray[i].x,extraEvaluationArray[i].y,number)
			}

			var index = slotsArray.indexOf(extraEvaluationArray[i])
			if(index == -1){
				//console.log("error")
			}
			else{
				slotsArray.splice(index,1)
			}

			extraEvaluationArray[i].evaluated = true
			extraEvaluationArray[i].inputEnabled = false
    	}
    	extraEvaluationArray = []
    	canTouch = true
    }


    function evaluatePos(x,y){
    	var haveNumber = 0
		for(var a = -1; a <= 1; a++){
			for(var b = -1; b <= 1; b++){
				if(a ==0 && b ==0){
					continue
				}
				if(x+a<0 || y+b<0 ||x+a == X_SPACES || y+b==Y_SPACES){
					continue
				}
				//console.log(x+a,y+b)
				if(groundArray[x+a][y+b].soil){
					haveNumber++
				}
				

			}
		}
		return haveNumber
    }

    function evaluateTouchPosition(){
        var position = {x:0,y:0,inGrid: false}
        var x = (game.input.activePointer.x - space_0.x)/DELTA_SPACE_X 
        var y = (game.input.activePointer.y - space_0.y)/DELTA_SPACE_Y 
        x = Math.round(x)
        y = Math.round(y)

        if(x >= 0 && x <X_SPACES && y >= 0 && y < Y_SPACES){
            position.x = x
            position.y = y
            position.inGrid = true
        }

        return position

    }

    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }


    

    function setRound(){
    	if(lives<=0){
    		return
    	}
    	tomikoSpine.addAnimationByName(0,'IDLE',true)
    	extraEvaluationArray = []
    	restartGroundArray()
    	initTouchPositions()
    	randomSoil()
    	canTouch = true

    	if(inTutorial!=-1){
    		indexhandTutorial = game.rnd.integerInRange(0,slotsArray.length-1)
    		evalTutorial()
    	}
    }

    function randomSoil(){

    	if(currentSoils<MAX_SOILS){
    		currentSoils+=DELTA_SOIL_LEVEL
    	}

    	var difficult = Math.round(currentSoils)

    	dangerArray = []
    	var tempPositions = []
    	for(var i = 0; i < X_SPACES*Y_SPACES; i++){
			tempPositions.push(i)
    	}
    	for(var i = 0; i < difficult; i++){
    		var index = game.rnd.integerInRange(0,tempPositions.length-1)
    		//console.log(tempPositions[index])
    		touchPositions[tempPositions[index]].soil = true
    		var index = slotsArray.indexOf(groundArray[touchPositions[tempPositions[index]].x][touchPositions[tempPositions[index]].y])
    		slotsArray.splice(index,1)
    		dangerArray.push(groundArray[touchPositions[tempPositions[index]].x][touchPositions[tempPositions[index]].y])
    		groundArray[touchPositions[tempPositions[index]].x][touchPositions[tempPositions[index]].y].soil = true
    		tempPositions.splice(index,1)
    	}


    }


    

    function evalTutorial(){

    	hand.visible = true
    	hand.x = slotsArray[indexhandTutorial].x+50
    	hand.y = slotsArray[indexhandTutorial].y+50
    	hand.loadTexture('atlas.game','handDown',0,false)
    	tutorialTween = setTimeout(function(){
    		hand.loadTexture('atlas.game','handUp',0,false)
    		tutorialTween = setTimeout(evalTutorial,500)
    	},500)

    }

    function getNumber(x,y,number){
    	for(var i = 0; i < numberGroup.length; i++){
    		if(!numberGroup.children[i].visible){
    			numberGroup.children[i].visible = true
    			numberGroup.children[i].x = x
    			numberGroup.children[i].y = y
    			numberGroup.children[i].number.setText(number)
    			return
    		}
    	}

    	var numberText = numberGroup.create(x,y,'atlas.game','hint_container')
    	numberText.anchor.setTo(0.5)
    	var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var t = new Phaser.Text(sceneGroup.game, 0, 0, number, fontStyle)
        t.anchor.setTo(0.5)
        numberText.addChild(t)
        numberText.number = t
    }

    function getAlphaSoil(x,y){
    	for(var i = 0; i < extraSoilsGroup.length; i++){
    		if(!extraSoilsGroup.children[i].visible){
    			extraSoilsGroup.children[i].visible = true
    			extraSoilsGroup.children[i].x = x
    			extraSoilsGroup.children[i].y = y
    			return
    		}
    	}

    	var soil = extraSoilsGroup.create(x,y,'atlas.game','toxic')
    	soil.anchor.setTo(0.5)
    	soil.alpha = 0.5


    }

    
    
    function createScene(){
        //yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        initialize()
        var backgroundTile = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.game','grass_back')
        sceneGroup.add(backgroundTile)

        var tileBottom = game.add.tileSprite(0,game.world.height-60,game.world.width,60,'atlas.game','grass_front')
        sceneGroup.add(tileBottom)

        var tileTop = game.add.tileSprite(game.world.centerX,30,game.world.width,60,'atlas.game','grass_front')
        tileTop.anchor.setTo(0.5)
        tileTop.angle = 180
        sceneGroup.add(tileTop)

        var tileLeft = game.add.tileSprite(30,game.world.centerY,game.world.height,60,'atlas.game','grass_front')
        tileLeft.anchor.setTo(0.5)
        tileLeft.angle = 90
        sceneGroup.add(tileLeft)

        var tileRight = game.add.tileSprite(game.world.width-30,game.world.centerY,game.world.height,60,'atlas.game','grass_front')
        tileRight.anchor.setTo(0.5)
        tileRight.angle = -90
        sceneGroup.add(tileRight)


        space_0 = {x:game.world.centerX - (((X_SPACES-1)/2)*DELTA_SPACE_X), y: game.world.centerY -(((Y_SPACES-1)/2)*DELTA_SPACE_Y)}

        var topLefCorner = {x:space_0.x - (DELTA_SPACE_X/2), y: space_0.y - (DELTA_SPACE_Y/2)}
        lineBackground = game.add.graphics(0,0)


        groundGroup = game.add.group()
        sceneGroup.add(groundGroup)

        for(var i = 0; i < X_SPACES; i++){
        	groundArray[i] = []
        	for(var j = 0; j < Y_SPACES; j++){
        		// poner sprite images
        		var sprite = groundGroup.create(space_0.x + DELTA_SPACE_X*i, space_0.y +DELTA_SPACE_Y*j,'atlas.game','soil')
        		sprite.anchor.setTo(0.5)
        		groundArray[i][j] = sprite
        		sprite.indexX = i
        		sprite.indexY = j
        		sprite.inputEnabled = true
        		sprite.events.onInputDown.add(onClickSlot)
        	}
        }

        for(var i = 0; i <= X_SPACES; i++){
            lineBackground.lineStyle(5, 0xffffff);
            lineBackground.moveTo(topLefCorner.x +(DELTA_SPACE_X*i),topLefCorner.y);
            lineBackground.lineTo(topLefCorner.x +(DELTA_SPACE_X*i), topLefCorner.y + (DELTA_SPACE_Y*Y_SPACES) );
        }

        for(var i = 0; i <= Y_SPACES; i++){
            lineBackground.lineStyle(5, 0xffffff);
            lineBackground.moveTo(topLefCorner.x ,topLefCorner.y+(DELTA_SPACE_Y*i));
            lineBackground.lineTo(topLefCorner.x+ (DELTA_SPACE_X*X_SPACES), topLefCorner.y +(DELTA_SPACE_Y*i) );
        }
        sceneGroup.add(lineBackground)
        

        

        numberGroup = game.add.group()
        sceneGroup.add(numberGroup)
        
        extraSoilsGroup = game.add.group()
        sceneGroup.add(extraSoilsGroup)

        tomikoSpine = game.add.spine(60, game.world.height-20, 'tomikoSpine')
        //tomikoSpine.anchor.setTo(0.5)
        tomikoSpine.scale.setTo(0.5)
        tomikoSpine.setSkinByName('normal')
        tomikoSpine.setAnimationByName(0,'IDLE',true)
        sceneGroup.add(tomikoSpine)

        
        gameGroup = game.add.group()
        gameGroup.x = game.world.centerX
        gameGroup.y = game.world.centerY
        sceneGroup.add(gameGroup)


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

        
        hand = sceneGroup.create(0,0,'atlas.game','handUp')
        hand.anchor.setTo(0.5)
        hand.visible = false
        
        

        createPointsBar()
        createHearts()


        correctParticle = createPart('atlas.game','star')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)

        createTutorial()

        
    }
    
	return {
		assets: assets,
		name: "soilSweeper",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()



function lerp(a,b,t){
    return a + (b - a) * t;
}