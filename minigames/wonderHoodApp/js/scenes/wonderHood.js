var soundsPath = "../../shared/minigames/sounds/"
var wonderHood = function(){

	var OBJECT_TYPES = {
		OBSTCALE:1,
		APPLE:2,
		ENEMY:3,
        NO_MOVE_OBSTACLE:4,
        ENEMY2:5,
        NPC:6,
	}

    var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/wonderHood/atlas.json",
                image: "images/wonderHood/atlas.png",
            },
        ],
        images: [
            {
                name:"pasto",
                file:"images/wonderHood/pasto.png"
            },
            {
                name:"arbusto",
                file:"images/wonderHood/arbustos.png"
            },

        ],
        sounds: [
            {   name: "magic",
                file: soundsPath + "magic.mp3"},
            {   name: "wrong",
                file: soundsPath + "wrong.mp3"},
            {   name: "pop",
                file: soundsPath + "pop.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "punch",
                file: soundsPath + "punch1.mp3"},  
        ],
        
    }
    
    var INITIAL_LIVES = 1
    var ARROWS = 3
    var ARROW_SPEED = 700
    var MAX_ANGLE = 80
    var DELTA_IN_TIME = 0.05
    var MAX_TIME_TUTORIAl = 20
    var DELTA_TIME_TUTORIAL = 3
    var DELTA_ANGLE = 1
    var INITIAL_MOVE_Y = 100
    var DELTA_MOVE_Y = 25
    var MAX_MOVE_Y = 300
    var MAX_SPEED_Y = 4
    var INIT_SPEED_Y = 2
    var DELTA_SPEED_Y = 2
    var LEVELS_ACTIVATE_PLATTFORM = 2
    var LEVELS_ACTIVATE_ROCK = 1
    var LEVELS_ACTIVATE_BARREL = 10
    var PROBABILITY_BARREL = 0.5
    var BARREL_VELOCITY = 1
    var BARREL_MAX_Y = 100
    var CLOUDS_VELOCITY = 0.5

    var TRAYECT_INITIAL_SCALE = 0.3
    var TRAYECT_FINAL_SCALE = 0.05
    var TRAYECT_COUNT = 20
    var TRAYECT_DELTA = (TRAYECT_INITIAL_SCALE - TRAYECT_FINAL_SCALE)/TRAYECT_COUNT
    
    var OFFSET_ANGLE = 25
    
    var gameIndex = 30
    var gameId = 1
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null
    var gameMuted, muteButton
    var pauseButton, gamePaused


    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var canTap
    var currentLevel
    var currentArrows
    var currentTimeDots
    var bmd
    var spaceBar
    var player
    var arrowGroup
    var dotsGroup
    var currentAngle
    var currentArrow
    var inShot
    var lastPosition
    var apple
    var npc, npcGroup, platformNpc, enemyPlatform, enemyPlattformBase, enemyPlatform2
    var flashPanel
    var arrowNpcGroup, arrowEnemyGroup, arrowEnemyGroup2, arrowNoMoveGroup
    var rock, letrero
    var barrel, barrelAvailable
    var clouds

    var trayectGroup
    var touchPositions
    var bigMountain
    var fruitSlot, fruitSlotDog
    var physicsNames = ["Pyt","Yax","Mizzy","Spoty"]
    var fruitnames = ["calabaza","manzana","naranja","pina","sandia","uvas"]
    var offsetValues
    var offsetValuesSpine
    var rockOffset = [0,10,-20,20]
    var plattformOffset = [-70,-60,-90,-45]
    var offsetFruit = 4
    var waitUntilShot
    var playerSpinePivot
   	var pointsToGive

    var hand, inTutorial, tutorialTimeOut

    var gameOverGroup, gameOverPoints, gameOverPlace, gameOverTop, gameOverDude, gameOverTrophy, gameOverBack, gameOverButtonExit, gameOverCoin

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        canTap = true
        currentLevel = 1
        currentArrows = ARROWS
        currentTimeDots = MAX_TIME_TUTORIAl
        currentAngle = 0
        inShot = false
        arrowAvailable = false
        clouds = []
        touchPositions = []
        offsetValues = []
        offsetValuesSpine = []
        waitUntilShot = false
        pointsToGive = 1
        gameMuted = false
        gamePaused = false
        inTutorial = 0
    }
    

    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)        
        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        gameActive = true

    }
    
    
    function preload() {
    	var fontStyle = {font: "24px GothamCocogoose", fontWeight: "normal", fill: "#ffffff", align: "center"}
    	var test = new Phaser.Text(game, -100, -100, "0", fontStyle)
    	test.visible = false

    	fontStyle = {font: "24px Luckiest Guy", fontWeight: "normal", fill: "#ffffff", align: "center"}
    	test = new Phaser.Text(game, -100, -100, "0", fontStyle)
    	test.visible = false
        
        game.forceSingleUpdate = true
        game.stage.disableVisibilityChange = false;
        game.load.physics('physicsData', 'physics/physics.json');
        game.load.spine('playerSpine', "images/spines/meizy/meizy.json");
        game.load.spine('npcSpine', "images/spines/characters/characters.json");
        game.load.spine('dogSpine', "images/spines/dog/dog.json");
        if(amazing.getMinigameId()){
            marioSong = sound.setSong(soundsPath + 'songs/fantasy_ballad.mp3',0.3)
        }else{
            game.load.audio('arcadeSong', soundsPath + 'songs/fantasy_ballad.mp3');
        }

    }

    
    function stopGame(win){

        heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        gameActive = false

        
        if(amazing.getMinigameId()){
            marioSong.pause()
        }else{
            marioSong.stop()
        }

        player.spine.setAnimationByName(0,"lose",false)
        player.spine.setAnimationByName(0,"losestill",false)

        player.spineLegs.setAnimationByName(0,"lose",false)
        player.spineLegs.setAnimationByName(0,"losestill",false)

        amazing.setMixPanelTrack("wonderHood2","finishGame",true,pointsBar.number)

        console.log(npc.currentSkin)
        gameOverDude.loadTexture("atlas.game",physicsNames[npc.currentSkin]+"_finish")


        gameOverPoints.setText(pointsBar.number)

        var id = amazing.getMinigameIdentifier()

        gameOverTop.visible = false
        gameOverTrophy.visible = false
        gameOverPlace.visible = false
        gameOverCoin.x = game.world.centerX - 25
        gameOverPoints.x = game.world.centerX + 25

        if(id){
	        window.addEventListener("message", function(event){

	            if(event.data && event.data != ""){
	                var parsedData = {}
	                try {
	                   var parsedData = JSON.parse(event.data)
	                }catch(e){
	                   console.warn("Data is not JSON in message listener")
	                }
	                switch(parsedData.type){
	                case "rankMinigame":
	                    rankMinigame = parsedData.rankMinigame

				        if(rankMinigame<=3){
				        	gameOverTop.setText("Top 3")
				        	gameOverTrophy.loadTexture("atlas.game","r0")
				        }
				        else if(rankMinigame<=5){
				        	gameOverTop.setText("Top 5")
				        	gameOverTrophy.loadTexture("atlas.game","r1")
				        }
				        else if(rankMinigame<=10){
				        	gameOverTop.setText("Top 10")
				        	gameOverTrophy.loadTexture("atlas.game","r2")
				        }
				        else{
				        	gameOverTop.visible = false
				        	gameOverPlace.y-=20;
				        	gameOverTrophy.loadTexture("atlas.game","r3")
				        }

				        gameOverPlace.setText("#"+rankMinigame)
				        gameOverTop.visible = true
				        gameOverTrophy.visible = true
				        gameOverPlace.visible = true
				        gameOverCoin.x = game.world.centerX + 70
        				gameOverPoints.x = game.world.centerX + 120

	                    break
	                }
	            }
	        })
	    }
	    /*else{
	    	
	        gameOverTop.visible = false
	        gameOverTrophy.visible = false
	        gameOverPlace.visible = false
	        gameOverCoin.x = game.world.centerX - 40
	        gameOverPoints.x = game.world.centerX + 40


	    }*/
  
    	amazing.saveScore(pointsBar.number)
    	gameOverBack.visible = true
    	gameOverGroup.visible = true
    	game.add.tween(gameOverBack).to({alpha:0.5},500,Phaser.Easing.linear,true)
    	game.add.tween(gameOverGroup).to({y:0},500,Phaser.Easing.linear,true)

    }

    function returnGame(){
    	gameOverButtonExit.inputEnabled = false
    	tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true)
        tweenScene.onComplete.add(function(){
            
            /*var resultScreen = sceneloader.getScene("result")
            resultScreen.setScore(true, pointsBar.number,gameIndex)*/
            amazing.setMixPanelTrack("wonderHood2","retryGame")
                    
            amazing.setMixPanelTrack("wonderHood2","enterGame")
        	
            sceneloader.show("wonderHood")
        })
    }
    
    function addPoint(number,obj){
        
        //sound.play("pop")
        createPart('star', obj)
        createTextPart('+' + number, obj)
        
        pointsBar.number+= number

        pointsBar.text.setText(pointsBar.number)
   
    }

    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(0,10,'atlas.game','xpcoins')
        pointsImg.x = game.world.width - pointsImg.width * 1.2
        pointsImg.width *=1
        pointsImg.height *=1
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.75
        pointsText.y = pointsImg.height * 0.3
        pointsBar.add(pointsText)
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }

    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        group.create(0,0,'atlas.game','life_box')

        pivotX+= 47
        
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = 2
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
    
    
    function createTextPart(text,obj){
        
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = lookParticle('textPart')
        
        if(pointsText){
            
            pointsText.x = obj.x
            pointsText.y = obj.y - 60
            pointsText.setText(text)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
        
    }

    
    
    function starParticles(obj,idString){
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.game',idString);
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = obj.x;
        particlesGood.y = obj.y- 25;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
    
    function lookParticle(key){
        
        for(var i = 0;i<particlesGroup.length;i++){
            
            var particle = particlesGroup.children[i]
            if(!particle.used && particle.tag == key){
                
                particle.used = true
                particle.alpha = 1
                
                particlesGroup.remove(particle)
                particlesUsed.add(particle)
                
                return particle
                break
            }
        }
        
    }
    
    function deactivateParticle(obj,delay){
        
        game.time.events.add(delay,function(){
            obj.used = false
            
            particlesUsed.remove(obj)
            particlesGroup.add(obj)
            
        },this)
    }
    
    function createPart(key,obj){
        
        key+='Part'
        var particle = lookParticle(key)
        if(particle){
            
            particle.x = obj.x
            particle.y = obj.y
            particle.scale.setTo(1,1)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            deactivateParticle(particle,300)
        }

    }
    
    function createParticles(tag,number){
        
        tag+='Part'
        
        for(var i = 0; i < number;i++){
            
            var particle
            if(tag == 'textPart'){
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                particle = particlesGroup.create(-200,0,'atlas.game',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }

    function missPoint(){

        sound.play("wrong")
        
        lives--;
        heartsGroup.text.setText('X ' + lives)

        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        stopTouch = true
        
        if(lives === 0){
            stopGame()
        }
    
    }

    function updateTrayect(){
        var indexBlade = 0
        //console.log(touchPositions.length)
        if(touchPositions.length!=0){
            if(touchPositions[0].x==touchPositions[touchPositions.length-1].x){
                trayectGroup.children[trayectGroup.length-1].alpha = 0
                return
            }
        }

        if(!inShot && touchPositions.length!=0 ){
            touchPositions.push({x:touchPositions[touchPositions.length-1].x,y:touchPositions[touchPositions.length-1].y})
            if(touchPositions.length > trayectGroup.length){
                touchPositions.shift()
            }
            
        }

        for(var i = touchPositions.length-1; i>= 0; i--){
            
            if(trayectGroup.children[indexBlade].x != touchPositions[i].x){
                trayectGroup.children[indexBlade].alpha = 1

                trayectGroup.children[indexBlade].x = touchPositions[i].x
                trayectGroup.children[indexBlade].y = touchPositions[i].y
                
            }
            else{
                trayectGroup.children[indexBlade].alpha = 0
            }
            indexBlade++
        }
    }

    function update(){
        if(gamePaused){
            return
        }

        updateTrayect()
        if(lives>0){
            for(var i =0; i < clouds.length; i++){
                clouds[i].x+=CLOUDS_VELOCITY
                if(clouds[i].x > game.world.width+200){
                    clouds[i].x = -200
                }
            }
        }
        
        if(!gameActive){
            if(inTutorial == 2){
                if(!game.input.activePointer.isDown){
                    inTutorial =-1
                    if(tutorialTimeOut != null){
                        clearTimeout(tutorialTimeOut)
                    }
                    hand.visible = false
                    gameActive = true
                }
            }

            return
        }




        if(!waitUntilShot){
	        if(inShot){

	            if(lastPosition.x != currentArrow.body.x && lastPosition.y != currentArrow.body.y){
	                var x = currentArrow.body.x - lastPosition.x
	                var y = currentArrow.body.y - lastPosition.y
	                var h = Math.sqrt(Math.pow(x,2) + Math.pow(y,2))
	                var angle = Math.asin(y/h)
	                currentArrow.body.rotation = angle
	                lastPosition.x = currentArrow.body.x
	                lastPosition.y = currentArrow.body.y
	                touchPositions.push({x:currentArrow.body.x,y:currentArrow.body.y})
	                if(touchPositions.length > trayectGroup.length){
	                    touchPositions.shift()
	                }

	                if(lastPosition.x > game.world.width+50){

	                    disableBody()

	                    if(!arrowAvailable){
	                        endRound()
	                    }
	                    else{
	                        eliminateArrow()
	                        currentArrow = getArrow()
	                    }
	                }
	            }
	        }
	        else{
	            if(game.input.activePointer.isDown){
                    if(game.input.activePointer.y > muteButton.y+(muteButton.height/2)){
    	            	if(!dotsGroup.visible){
    	            		player.spine.setAnimationByName(0,"aim",true)
    	            		player.spineLegs.setAnimationByName(0,"aim",true)
    	            	}
    	                
    	                updateAngle()

                        if(inTutorial==0){
                            inTutorial =1
                            if(tutorialTimeOut != null){
                                clearTimeout(tutorialTimeOut)
                            }
                            hand.visible = false
                        }
                        else if(inTutorial == 1 && currentAngle >= 20){
                            currentAngle = 20
                            inTutorial = 2
                            hand.visible = true
                            hand.loadTexture("atlas.game","handDown")
                            hand.key = "down"
                            tutorialTimeOut = setTimeout(changeHand2,500)
                            gameActive = false
                        }


    	                dotsGroup.visible = true
                    }
	                
	            }
	            else{

	            	if(inTutorial == 1 && currentAngle < 20){
	            		inTutorial = 0
	            		setTimeout(changeHand1,100)
                        hand.visible = true
	            	}
	                else if(currentAngle != 0 && currentAngle < MAX_ANGLE && inTutorial!=0){
	                    dotsGroup.visible = false
	                    for(var i =0; i < dotsGroup.length; i++){
	                    	dotsGroup.children[i].x = -10
	                    }
	                    shot()
	                }
	                
	            }
	        }
	    }

        if(enemyPlatform.visible){

        	if(enemyPlatform.moveActivated){
        		enemyPlatform.body.y += enemyPlatform.direction * enemyPlatform.speed
        		if(arrowEnemyGroup.length>0){
        			for(var i = 0; i < arrowEnemyGroup.length; i++){
        				arrowEnemyGroup.children[i].body.y += enemyPlatform.direction * enemyPlatform.speed
        			}
        		}

        		if(enemyPlatform.direction == -1){
        			if(enemyPlatform.body.y < enemyPlatform.initialY - enemyPlatform.currentY){
        				enemyPlatform.direction = 1
        			}
        		}
        		else{
        			if(enemyPlatform.body.y > enemyPlatform.initialY){
        				enemyPlatform.direction = -1
        			}
        		}
        	}
        }

        if(enemyPlatform2.visible){

            if(enemyPlatform2.moveActivated){
                enemyPlatform2.body.y += enemyPlatform2.direction * enemyPlatform2.speed
                if(arrowEnemyGroup2.length>0){
                    for(var i = 0; i < arrowEnemyGroup2.length; i++){
                        arrowEnemyGroup2.children[i].body.y += enemyPlatform2.direction * enemyPlatform2.speed
                    }
                }

                if(enemyPlatform2.direction == -1){
                    if(enemyPlatform2.body.y < enemyPlatform2.initialY - enemyPlatform2.currentY){
                        enemyPlatform2.direction = 1
                    }
                }
                else{
                    if(enemyPlatform2.body.y > enemyPlatform2.initialY){
                        enemyPlatform2.direction = -1
                    }
                }
            }
        }


        if(platformNpc.visible){

        	if(platformNpc.moveActivated){
        		platformNpc.body.y += platformNpc.direction * platformNpc.speed
        		if(arrowNpcGroup.length>0){
        			for(var i = 0; i < arrowNpcGroup.length; i++){
        				arrowNpcGroup.children[i].body.y += platformNpc.direction * platformNpc.speed
        			}
        		}

        		if(platformNpc.direction == -1){
        			if(platformNpc.body.y < platformNpc.initialY - platformNpc.currentY){
        				platformNpc.direction = 1
        			}
        		}
        		else{
        			if(platformNpc.body.y > platformNpc.initialY){
        				platformNpc.direction = -1
        			}
        		}
        	}
            base.body.y = platformNpc.body.y - platformNpc.height/2 
            if(barrelAvailable){
                barrel.body.y = platformNpc.body.y - platformNpc.height/2 - npc.height/2- 10
                npc.body.y = barrel.body.y + barrel.delta
                barrel.delta += barrel.direction * BARREL_VELOCITY
                if(barrel.direction == -1 && barrel.delta < -BARREL_MAX_Y){
                    barrel.direction = 1
                }
                else if(barrel.direction == 1 && barrel.delta > BARREL_MAX_Y/2){
                    barrel.direction = -1
                }
            }
            else{
        	   npc.body.y = platformNpc.body.y - platformNpc.height/2 - npc.height/2- 10 + plattformOffset[npc.currentSkin]
            }



        }
        else if(rock.visible){
            npc.body.y = rock.body.y - 150 + rockOffset[npc.currentSkin]
        }

        
        if(arrowAvailable){
            //apple.body.y = npc.body.y - 75
            if(npc.spine.visible){
	            apple.body.x =fruitSlot.worldPosition.x
	        	apple.body.y = fruitSlot.worldPosition.y+offsetFruit
	        }
	        else{
	        	apple.body.x =fruitSlotDog.worldPosition.x
	        	apple.body.y = fruitSlotDog.worldPosition.y+offsetFruit
	        }
        }
        else{
            apple.body.x = currentArrow.body.x +40
            apple.body.y = currentArrow.body.y
        }

        
    }

    function disableBody(){
        currentArrow.body.static = true
        currentArrow.body.velocity.x = 0
        currentArrow.body.velocity.y = 0
        currentArrow.contactSignal.active = false
        inShot = false
    }

    function eliminateArrow(){
        //console.log("eliminate arrow")
        for(var i = 2; i >=0; i--){
            if(letrero.arrows[i].visible){
                letrero.arrows[i].visible = false
                break
            }
        }
    }


    function updateAngle(){
        currentAngle += DELTA_ANGLE 
        player.angle = 360 + OFFSET_ANGLE - currentAngle 
        //playerSpinePivot.angle = 360 + OFFSET_ANGLE- currentAngle 
        currentArrow.body.rotation  = (360 - currentAngle)*Math.PI/180
        for(var i =0; i < currentTimeDots; i++){
            var t = (i*DELTA_IN_TIME)
            dotsGroup.children[i].x = ((ARROW_SPEED * Math.cos(currentAngle*(Math.PI/180)) * t)) + player.x+10
            dotsGroup.children[i].y = player.y - (ARROW_SPEED * Math.sin(currentAngle*(Math.PI/180)) * t) + ((game.physics.p2.gravity.y * Math.pow(t,2))/2)
        }

        if(currentAngle > MAX_ANGLE){
            //dotsGroup.visible = false
            dotsGroup.visible = false
            for(var i =0; i < dotsGroup.length; i++){
            	dotsGroup.children[i].x = -10
            }
            shot()
        }
    }

    function shot(){
        //console.log("shot")
        var anim = player.spine.setAnimationByName(0,"throw",false)
        anim.onComplete = function(){
        	
        	player.angle = OFFSET_ANGLE
        	playerSpinePivot.angle = OFFSET_ANGLE
        }
        player.spineLegs.setAnimationByName(0,"throw",false)

        player.spine.addAnimationByName(0,"idle",true)
        player.spineLegs.addAnimationByName(0,"idle",true)

        
        currentArrow.available = true
        //console.log("ARROW SHOT",currentArrow.available,currentArrow.idNumber)
        lastPosition = {x:currentArrow.body.x,y:currentArrow.body.y}
        setTimeout(function(){
        	currentArrow.body.static = false
        	currentArrow.body.velocity.x = ARROW_SPEED * Math.cos(currentAngle*(Math.PI/180))
	   		currentArrow.body.velocity.y = -ARROW_SPEED * Math.sin(currentAngle*(Math.PI/180))
	        currentArrow.visible = true 
	        currentAngle = 0
	        waitUntilShot = false
	    },400)
        
        waitUntilShot = true
        inShot = true
    }


    function setRound(){

        bigMountain.x = game.world.width+game.world.centerX
        arrowAvailable = true
        if(currentTimeDots <= 0){
        	dotsGroup.visible = false
        	for(var i = 0; i < dotsGroup.length; i++){
	        	dotsGroup.children[i].visible = false
	        }
        }
        else{
        	activateDots(currentTimeDots)
        }

        currentArrow = getArrow()
        currentArrow.visible = false
        gameActive = true
        //apple.body.x = npc.body.x
        //apple.body.y = npc.body.y - 75
    }

    function endRound(){
        game.add.tween(bigMountain).to({x:game.world.centerX},500,Phaser.Easing.linear,true).onComplete.add(function(){

        	
        	for(var i=arrowNpcGroup.length-1; i >=0 ; i--){
        		arrowNpcGroup.children[i].visible = false
        		arrowGroup.add(arrowNpcGroup.children[i])
        	}

        	for(var i=arrowEnemyGroup.length-1; i >= 0; i--){
        		arrowEnemyGroup.children[i].visible = false
                /*var arrow = arrowEnemyGroup.children[i]
                arrowEnemyGroup.remove(arrow)*/
        		arrowGroup.add(arrowEnemyGroup.children[i])
        	}

            for(var i=arrowEnemyGroup2.length-1; i >= 0; i--){
                arrowEnemyGroup2.children[i].visible = false
                /*var arrow = arrowEnemyGroup.children[i]
                arrowEnemyGroup.remove(arrow)*/
                arrowGroup.add(arrowEnemyGroup2.children[i])
            }

            for(var i=arrowNoMoveGroup.length-1; i >= 0; i--){
                arrowNoMoveGroup.children[i].visible = false
                arrowGroup.add(arrowNoMoveGroup.children[i])
            }

            //console.log(arrowGroup.length)
            for(var i=0; i < arrowGroup.length; i++){
                arrowGroup.children[i].visible = false
                arrowGroup.children[i].contactSignal.active = true
            }


        	if(currentTimeDots>0){
        		currentTimeDots-=DELTA_TIME_TUTORIAL
        		if(currentTimeDots < 0){
        			currentTimeDots = 0
        		}
        	}

            for(var i=0; i < 3; i++){
                letrero.arrows[i].visible = true
            }

        	var changePlattform = true

            if(enemyPlatform2.visible){
                changePlattform = false
                platformNpc.moveActivated = false
                if(enemyPlatform2.currentY < MAX_MOVE_Y){
                    enemyPlatform2.currentY +=  DELTA_MOVE_Y
                }
                else if(enemyPlatform2.speed < MAX_SPEED_Y){
                    enemyPlatform2.speed += DELTA_SPEED_Y
                }
                else{
                    changePlattform = true
                }
                enemyPlatform2.body.y = enemyPlatform2.initialY - game.rnd.integerInRange(0,enemyPlatform2.currentY)
                enemyPlatform2.moveActivated = true

                if(!changePlattform){
                    setTimeout(function(){
                        platformNpc.moveActivated = true
                    },2000)
                }
            }

        	if(enemyPlatform.visible){
        		changePlattform = false
        		platformNpc.moveActivated = false
        		if(enemyPlatform.currentY < MAX_MOVE_Y){
        			enemyPlatform.currentY +=  DELTA_MOVE_Y
        		}
        		else if(enemyPlatform.speed < MAX_SPEED_Y){
        			enemyPlatform.speed += DELTA_SPEED_Y
        		}
        		else{
        			changePlattform = true
        		}
        		enemyPlatform.body.y = enemyPlatform.initialY - game.rnd.integerInRange(0,enemyPlatform.currentY)
        		enemyPlatform.moveActivated = true

        		if(!changePlattform){
        			setTimeout(function(){
        				platformNpc.moveActivated = true
        			},2000)
        		}
        	}
            //console.log(changePlattform)
        	if(platformNpc.visible && changePlattform){
                //console.log(platformNpc.currentY)
        		if(platformNpc.currentY < MAX_MOVE_Y){
        			platformNpc.currentY +=  DELTA_MOVE_Y
        		}
        		else if(platformNpc.speed < MAX_SPEED_Y){
        			platformNpc.speed += DELTA_SPEED_Y
        		}
        		else if(!enemyPlatform.visible){
        			enemyPlatform.visible = true
        			pointsToGive = 3
        			enemyPlatform.body.x = enemyPlatform.initialX
        			platformNpc.currentY =  INITIAL_MOVE_Y
        			platformNpc.speed =  INIT_SPEED_Y

        		}

        		platformNpc.body.y = platformNpc.initialY - game.rnd.integerInRange(0,platformNpc.currentY)
        		platformNpc.moveActivated = true
        	}

            if(currentLevel == LEVELS_ACTIVATE_ROCK){
                rock.visible = true
                rock.body.x = rock.initialX
            }

        	else if(currentLevel == LEVELS_ACTIVATE_PLATTFORM){
        		//console.log("activate plattform")
        		platformNpc.visible = true
        		pointsToGive = 2

        		platformNpc.body.x = platformNpc.initialX
        		base.body.x = platformNpc.body.x
                platformNpc.currentY = INITIAL_MOVE_Y
                rock.hole.visible = true
                base.visible = true
                //platformNpc.body.y = rock.body.y + 100
        	}

            if(currentLevel >= LEVELS_ACTIVATE_BARREL){
                if(game.rnd.frac() < PROBABILITY_BARREL){
                    barrelAvailable = true
                    barrel.body.x = platformNpc.body.x
                    npc.mask = barrel.barrelMask
                }
                else{
                    barrelAvailable = false
                    barrel.body.x = 1000
                    npc.mask = null
                }
            }

        	currentLevel ++

        	player.angle = OFFSET_ANGLE
        	playerSpinePivot.angle = OFFSET_ANGLE
        	var tempRandom = game.rnd.integerInRange(0,3)
        	if(tempRandom==npc.currentSkin){
        		tempRandom++
        		if(tempRandom>3){
        			tempRandom = 0
        		}
        	}
        	npc.currentSkin = tempRandom

        	if(npc.currentSkin<3){
        		npc.spine.visible = true
        		npc.spine.setSkinByName("normal"+npc.currentSkin)
        		npc.spine.setToSetupPose();
        		npc.spine.x = offsetValuesSpine[npc.currentSkin].x
        		npc.spine.y = offsetValuesSpine[npc.currentSkin].y
        		npc.spineDog.visible = false
        	}
        	else{
        		npc.spineDog.visible = true
        		npc.spineDog.x = offsetValuesSpine[npc.currentSkin].x
        		npc.spineDog.y = offsetValuesSpine[npc.currentSkin].y
        		npc.spine.visible = false
        	}

        	
        	npc.body.clearShapes()
        	npc.body.loadPolygon("physicsData",physicsNames[npc.currentSkin])
        	npc.body.y = offsetValues[npc.currentSkin]
        	
        	arrowAvailable = true
        	if(npc.spine.visible){
	        	apple.body.x =fruitSlot.worldPosition.x
	        	apple.body.y = fruitSlot.worldPosition.y+offsetFruit
	        }
	        else{
	        	apple.body.x =fruitSlotDog.worldPosition.x
        		apple.body.y = fruitSlotDog.worldPosition.y+offsetFruit
	        }
        	var fruitValue = game.rnd.integerInRange(0,fruitnames.length-1)
        	apple.loadTexture("atlas.game",fruitnames[fruitValue])
        	apple.body.clearShapes()
        	apple.body.loadPolygon("physicsData",fruitnames[fruitValue])

        	game.add.tween(bigMountain).to({x:-game.world.centerX},500,Phaser.Easing.linear,true).onComplete.add(setRound)
        	
        })


    }

    function setEnemy(){

    }
    

    function setDots(number){
        for(var i =0; i < number; i ++){
            var dot = game.add.graphics()
            dot.beginFill(0xffffff)
            dot.drawCircle(0,0,10)
            dot.endFill()
            dot.visible = false
            dotsGroup.add(dot)
        }
    }

    function activateDots(number){
        for(var i =0; i < number; i++){
            dotsGroup.children[i].visible = true
            dotsGroup.children[i].alpha = (number-i)/number
        }
        for(var i = number; i < dotsGroup.length; i++){
        	dotsGroup.children[i].visible = false
        }
    }

    function getArrow(){
        for(var i=0; i < arrowGroup.length; i++){
            if(!arrowGroup.children[i].visible){
                var arrow = arrowGroup.children[i]
                arrow.visible = true
                arrow.contactSignal.active = true
                arrow.body.x = player.x + 20
                arrow.body.y = player.y -5
                arrow.visible = false
                //player.addChild(arrow)
                return arrow
            }
        }

        stopGame()
        return arrowGroup.children[0]

    }

    function collisionArrow(body, bodyBody, shapeA, shapeB, equation){
        if(!arrowAvailable){
            return
        }

    	if(body.objectType == OBJECT_TYPES.OBSTCALE){
    		sound.play("pop")
    		disableBody()
            eliminateArrow()
    		arrowNpcGroup.add(currentArrow)
            currentArrow = getArrow()
    	}
    	else if(body.objectType == OBJECT_TYPES.NPC){
    		sound.play("pop")
    		disableBody()
            eliminateArrow()
    		arrowNpcGroup.add(currentArrow)
            currentArrow = getArrow()
            if(npc.spine.visible){
	            npc.spine.setAnimationByName(0,"hit",false)
	            npc.spine.addAnimationByName(0,"idle",true)
	        }
	        else{
	        	npc.spineDog.setAnimationByName(0,"hit",false)
	            npc.spineDog.addAnimationByName(0,"idle",true)
	        }
    	}
    	else if(body.objectType == OBJECT_TYPES.APPLE){
    		sound.play("pop")
    		addPoint(pointsToGive,{x:game.world.width-100,y:50})
            arrowAvailable = false
    	}
    	else if(body.objectType == OBJECT_TYPES.ENEMY){
    		sound.play("pop")
    		disableBody()
            eliminateArrow()
            arrowEnemyGroup.add(currentArrow)
            currentArrow = getArrow()
    	}
        else if(body.objectType == OBJECT_TYPES.ENEMY2){
        	sound.play("pop")
            disableBody()
            eliminateArrow()
            arrowEnemyGroup2.add(currentArrow)
            currentArrow = getArrow()
        }

        else if(body.objectType == OBJECT_TYPES.NO_MOVE_OBSTACLE){
        	sound.play("pop")
            disableBody()
            eliminateArrow()
            arrowNoMoveGroup.add(currentArrow)
            currentArrow = getArrow()

        }
    }

    
    function createPlayer(){

        player = game.add.graphics()
        player.x = game.world.centerX - 190
        player.y = game.world.height-200
        player.angle = OFFSET_ANGLE

        /*player.beginFill(0xff0000)
        player.drawRect(-50,-50,100,100)
        player.endFill()*/
        //player.alpha = 0.5

        playerSpinePivot = game.add.group()
        playerSpinePivot.x = player.x
        playerSpinePivot.y = player.y+100
        playerSpinePivot.angle = OFFSET_ANGLE
        sceneGroup.add(playerSpinePivot)

        var playerSpine = game.add.spine(0,50,"playerSpine")
        playerSpine.setSkinByName("body")
        playerSpine.setAnimationByName(0,"idle",true)
        playerSpine.scale.setTo(0.8)
        //playerSpinePivot.add(playerSpine)
        player.addChild(playerSpine)
        player.spine= playerSpine

        var playerSpineLegs = game.add.spine(player.x,player.y+50,"playerSpine")
        playerSpineLegs.setSkinByName("legs")
        playerSpineLegs.setAnimationByName(0,"idle",true)
        player.spineLegs = playerSpineLegs
        playerSpineLegs.scale.setTo(0.8)
        sceneGroup.add(playerSpineLegs)

        sceneGroup.add(player)
    }

    function createObjects(){
        
        particlesGroup = game.add.group()
        sceneGroup.add(particlesGroup)
        
        particlesUsed = game.add.group()
        sceneGroup.add(particlesUsed)
        
        createParticles('star',5)
        createParticles('wrong',1)
        createParticles('text',8)
                
    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB);

    }

    function createBackground(){

        game.physics.p2.gravity.y = 400;

        game.physics.p2.setBoundsToWorld(false,false,false,false,false)

        var background = game.add.graphics()
        background.beginFill(0xb7edb1)
        background.drawRect(0,0,game.world.width,game.world.height)
        background.endFill()
        sceneGroup.add(background)

        for(var i =0; i < 3; i ++){
            var cloud = sceneGroup.create(i*((game.world.width+400)/3),game.rnd.integerInRange(10,game.world.centerY-300),"atlas.game","nube"+(i+1))
            cloud.anchor.setTo(0.5)
            clouds.push(cloud)
        }

        var mountains = sceneGroup.create(game.world.centerX, game.world.centerY, "atlas.game","montañas")
        mountains.anchor.setTo(0.5)

        var arbusto = game.add.tileSprite(0,game.world.height - 400,game.world.width,258,"arbusto")
        sceneGroup.add(arbusto)

        var floor = game.add.tileSprite(0,game.world.height - 128,game.world.width,128,"atlas.game","tierra")
        sceneGroup.add(floor)

        var pasto = game.add.tileSprite(0,game.world.height - 220,game.world.width,128,"pasto")
        sceneGroup.add(pasto)

        letrero = sceneGroup.create(0,100,"atlas.game","tablero")
        letrero.arrows = []
        for(var i =0; i < 3; i++ ){
            var a = sceneGroup.create( 75+(i*40), letrero.height/2 + 28, "atlas.game","flecha_tablero")
            a.anchor.setTo(0.5)
            letrero.addChild(a)
            letrero.arrows[i] = a
        }

        dotsGroup = game.add.group()
        dotsGroup.visible = false
        sceneGroup.add(dotsGroup)

        arrowGroup = game.add.group()
        sceneGroup.add(arrowGroup)

        for(var i =0; i < ARROWS; i++){
            var arrow = sceneGroup.create(0,0,"atlas.game","flecha")
            arrow.anchor.setTo(0.5)
            arrow.visible = false
            arrowGroup.add(arrow)

            game.physics.p2.enable(arrow,false)
            arrow.body.static = true
            arrow.body.typeName = "arrow"
            arrow.body.clearShapes()
            arrow.body.setRectangle(10,15,35,0)
            arrow.available = true
            arrow.idNumber = i
            arrow.body.data.shapes[0].sensor = true
            arrow.contactSignal = arrow.body.onBeginContact.add(collisionArrow,this)
        }

        var floor = game.add.graphics()
        floor.x = game.world.centerX
        floor.y = game.world.height - 110
        floor.beginFill(0x0000ff)
        floor.drawRect(-game.world.centerX,-50,game.world.width,100)
        floor.endFill()
        
        game.physics.p2.enable(floor,false)
        floor.body.static = true
        floor.visible = false
        floor.body.objectType = OBJECT_TYPES.NO_MOVE_OBSTACLE

        

        offsetValues[0] = game.world.height - 240
        offsetValuesSpine[0] = {x:20,y:90}

        offsetValues[1] = game.world.height - 230
        offsetValuesSpine[1] = {x:20,y:80}

        offsetValues[2] = game.world.height - 260
        offsetValuesSpine[2] = {x:25,y:110}

        offsetValues[3] = game.world.height - 210
        offsetValuesSpine[3] = {x:25,y:65}

        platformNpc = sceneGroup.create(0,0, "atlas.game","tubo")
        platformNpc.x = 2500
        platformNpc.y = game.world.height - 15
        platformNpc.scale.setTo(1,5)
        platformNpc.anchor.setTo(0,0)
        platformNpc.initialY = platformNpc.y
        platformNpc.initialX = game.world.centerX +150 +20
        //sceneGroup.add(platformNpc)
        platformNpc.visible = false

        rock = sceneGroup.create(game.world.centerX + 150 + 10000, game.world.height-200, "atlas.game","roca")
        rock.anchor.setTo(0.5)
        rock.initialX = game.world.centerX +150 +20
        game.physics.p2.enable(rock,false)
        rock.body.clearShapes()
        rock.body.loadPolygon('physicsData',"roca")
        rock.body.static = true
        rock.body.objectType = OBJECT_TYPES.NO_MOVE_OBSTACLE
        rock.visible = false

        base = sceneGroup.create(rock.x,game.world.height - 200,"atlas.game","base")
        base.anchor.setTo(0.5)
        game.physics.p2.enable(base,false)
        base.body.static = true
        base.visible = false
        base.body.objectType = OBJECT_TYPES.OBSTCALE
        //var con = game.physics.p2.createDistanceConstraint(platformNpc, base, 10);
        npcGroup = game.add.group()
        sceneGroup.add(npcGroup)
        npc = sceneGroup.create(0,0)
        npc.currentSkin = game.rnd.integerInRange(0,2)
        //npc.currentSkin = 3

        npc.x = game.world.centerX + 145
        npc.y = offsetValues[npc.currentSkin]
        npc.initialY = npc.y

        npcGroup.add(npc)
        

        var temp = npc.currentSkin
        if(temp > 2){
        	temp =2
        }

        var npcSpine = game.add.spine(offsetValuesSpine[temp].x,offsetValuesSpine[temp].y,"npcSpine")
        npcSpine.setSkinByName("normal"+temp)
        npcSpine.setAnimationByName(0,"idle",true)
        npcSpine.scale.setTo(0.8)
        npc.spine = npcSpine
        npc.addChild(npcSpine)
        npc.spine.visible = false

        var npcSpineDog = game.add.spine(offsetValuesSpine[npc.currentSkin].x,offsetValuesSpine[npc.currentSkin].y,"dogSpine")
        npcSpineDog.setSkinByName("normal")
        npcSpineDog.setAnimationByName(0,"idle",true)
        npcSpineDog.scale.setTo(0.8)
        npc.spineDog = npcSpineDog
        npc.addChild(npcSpineDog)
        npcSpineDog.visible = false

        var empty 
        var slotIndex
        for(var index = 0, n = npcSpine.skeletonData.slots.length; index < n; index++){
            var slotData = npcSpine.skeletonData.slots[index]
            if(slotData.name === "meizi fruit"){
                slotIndex = index
            }
        }

        if (slotIndex){
            empty = npcSpine.slotContainers[slotIndex]
        }

        //console.log(empty,slotIndex)
        fruitSlot = empty

        for(var index = 0, n = npcSpineDog.skeletonData.slots.length; index < n; index++){
            var slotData = npcSpineDog.skeletonData.slots[index]
            if(slotData.name === "meizi fruit"){
                slotIndex = index
            }
        }

        if (slotIndex){
            empty = npcSpineDog.slotContainers[slotIndex]
        }

        //console.log(empty,slotIndex)
        fruitSlotDog = empty




        game.physics.p2.enable(npc,false)
        npc.body.static = true
        npc.body.objectType = OBJECT_TYPES.NPC
        npc.body.clearShapes()
        npc.body.loadPolygon('physicsData',physicsNames[npc.currentSkin])

        var fruitValue = game.rnd.integerInRange(0,fruitnames.length-1)

        apple = sceneGroup.create(0,0,"atlas.game",fruitnames[fruitValue])
        apple.anchor.setTo(0.5)
        //apple.x = fruitSlot.x
        //apple.y = fruitSlot.y
        //fruitSlot.add(apple)

        

        if(npc.currentSkin<3){
        	npc.spine.visible = true
        	apple.x = fruitSlot.worldPosition.x
        	apple.y = fruitSlot.worldPosition.y
        }
        else{
        	npcSpineDog.visible = true
        	apple.x = fruitSlotDog.worldPosition.x
       		apple.y = fruitSlotDog.worldPosition.y
        }


        game.physics.p2.enable(apple,false)
        apple.body.static = true
        apple.body.objectType = OBJECT_TYPES.APPLE
 		apple.body.clearShapes()
 		apple.body.loadPolygon('physicsData',fruitnames[fruitValue])
        apple.body.data.shapes[0].sensor = true
        

        

        var mask = game.add.graphics()
        mask.x = npc.x-15
        mask.y = 0
        mask.beginFill(0xff0000)
        mask.drawRect(0,0,50,game.world.height-200)
        mask.endFill()

        platformNpc.mask = mask

        game.physics.p2.enable(platformNpc,false)
        platformNpc.body.static = true
        platformNpc.body.objectType = OBJECT_TYPES.OBSTCALE

        

        var baseBar = sceneGroup.create(0,11,"atlas.game","tubo_top")
        baseBar.anchor.setTo(0.5)
        base.addChild(baseBar)

        platformNpc.currentY = INITIAL_MOVE_Y
        platformNpc.speed = INIT_SPEED_Y
        platformNpc.moveActivated = false
        platformNpc.direction = -1

        enemyPlatform = game.add.graphics()
        enemyPlatform.x = 2000
        enemyPlatform.y = npc.y + 250
        enemyPlatform.initialY = enemyPlatform.y
        enemyPlatform.initialX = npc.x - 120
        enemyPlatform.drawRect(-25,-200,50,400)
        enemyPlatform.visible = false
        game.physics.p2.enable(enemyPlatform,false)
        enemyPlatform.body.static = true
        enemyPlatform.body.objectType = OBJECT_TYPES.ENEMY

        enemyPlatform.currentY = INITIAL_MOVE_Y
        enemyPlatform.speed = INIT_SPEED_Y
        enemyPlatform.moveActivated = false
        enemyPlatform.direction = -1
        sceneGroup.add(enemyPlatform)

        var picos = sceneGroup.create(0,-180,"atlas.game","picos")
        picos.anchor.setTo(0.5)
        enemyPlatform.addChild(picos)

        var pilar = sceneGroup.create(0,-170,"atlas.game","pilar")
        pilar.anchor.setTo(0.5,0)
        enemyPlatform.addChild(pilar)

        pilar = sceneGroup.create(0,-56,"atlas.game","pilar")
        pilar.anchor.setTo(0.5,0)
        enemyPlatform.addChild(pilar)

        pilar = sceneGroup.create(0,-62,"atlas.game","pilar")
        pilar.anchor.setTo(0.5,0)
        enemyPlatform.addChild(pilar)


        enemyPlatform2 = game.add.graphics()
        enemyPlatform2.x = 2000
        enemyPlatform2.y = -50
        enemyPlatform2.initialY = enemyPlatform2.y
        enemyPlatform2.initialX = npc.x - 120
        enemyPlatform2.drawRect(-25,-200,50,400)
        enemyPlatform2.visible = false
        game.physics.p2.enable(enemyPlatform2,false)
        enemyPlatform2.body.static = true
        enemyPlatform2.body.objectType = OBJECT_TYPES.ENEMY2

        enemyPlatform2.currentY = INITIAL_MOVE_Y
        enemyPlatform2.speed = INIT_SPEED_Y
        enemyPlatform2.moveActivated = false
        enemyPlatform2.direction = -1
        sceneGroup.add(enemyPlatform2)

        var picos = sceneGroup.create(0,180,"atlas.game","picos")
        picos.anchor.setTo(0.5)
        picos.angle = 180
        enemyPlatform2.addChild(picos)

        var pilar = sceneGroup.create(0,170,"atlas.game","pilar")
        pilar.anchor.setTo(0.5,0)
        pilar.angle = 180
        enemyPlatform2.addChild(pilar)

        pilar = sceneGroup.create(0,56,"atlas.game","pilar")
        pilar.anchor.setTo(0.5,0)
        pilar.angle = 180
        enemyPlatform2.addChild(pilar)

        pilar = sceneGroup.create(0,62,"atlas.game","pilar")
        pilar.anchor.setTo(0.5,0)
        pilar.angle = 180
        enemyPlatform2.addChild(pilar)



        enemyPlattformBase = sceneGroup.create(npc.x - 120,game.world.height-170,"atlas.game","plantas")
        enemyPlattformBase.anchor.setTo(0.5)

        var pilarMask = game.add.graphics()
        pilarMask.x = npc.x - 150
        pilarMask.y = (game.world.height-160)/2
        pilarMask.beginFill(0xff0000)
        pilarMask.drawRect(-30,-(game.world.height-160)/2,60,game.world.height-160)
        pilarMask.endFill()
        sceneGroup.add(pilarMask)

        enemyPlatform.mask = pilarMask


        arrowNpcGroup = game.add.group()
        sceneGroup.add(arrowNpcGroup)

        arrowEnemyGroup = game.add.group()
        sceneGroup.add(arrowEnemyGroup)

        arrowEnemyGroup2 = game.add.group()
        sceneGroup.add(arrowEnemyGroup2)

        arrowNoMoveGroup = game.add.group()
        sceneGroup.add(arrowNoMoveGroup)


        /*flashPanel = game.add.graphics()
        flashPanel.beginFill(0xffffff)
        flashPanel.drawRect(0,0,game.world.width,game.world.height)
        flashPanel.endFill()
        flashPanel.alpha = 0*/

        

        var hole = sceneGroup.create(0, -61, "atlas.game","agujero")
        hole.anchor.setTo(0.5)
        rock.addChild(hole)
        rock.hole = hole
        hole.visible = false

        barrel = sceneGroup.create(1000,100,"atlas.game","barril")
        barrel.anchor.setTo(0.5)
        game.physics.p2.enable(barrel,false)
        barrel.body.static = true
        barrel.body.objectType = OBJECT_TYPES.OBSTCALE
        barrelAvailable = false
        barrel.direction = -1
        barrel.delta = 0

        var barrelMask = game.add.graphics()
        //barrelMask.anchor.setTo(0.5)
        barrelMask.beginFill(0xff0000)
        barrelMask.drawRect(-50,-200,100,150)
        //barrelMask.alpha = 1
        barrel.addChild(barrelMask)
        barrel.barrelMask = barrelMask




    }

    function createTrayect(){
        trayectGroup = game.add.group()
        sceneGroup.add(trayectGroup)
        for(var i = 1; i < TRAYECT_COUNT; i++){
            var blade = trayectGroup.create(0,0,'atlas.game','rafaja')
            blade.scale.setTo(TRAYECT_INITIAL_SCALE - (TRAYECT_DELTA*i))
            blade.anchor.setTo(0.5,0.5)
            blade.alpha = 0
            blade.normalScale = blade.scale.x
        }
    }

    function muteSounds(){
        console.log(game.sound.volume,game.sound.mute)
        if(!gameMuted){
            //game.sound.mute = true
            gameMuted = true
            sound.muteAudios(true,assets.sounds)
            marioSong.pause()
            muteButton.loadTexture("atlas.game","mute")
        }
        else{
            //game.sound.mute = false
            gameMuted = false
            sound.muteAudios(false,assets.sounds)
            marioSong.play()
            muteButton.loadTexture("atlas.game","sound")
        }
        
    }

    function pasueGame(){
        
        game.paused = !game.paused

        if(game.paused){
            pauseButton.loadTexture("atlas.game","play")
        }
        else{
            pauseButton.loadTexture("atlas.game","pause")
        }

    }

    function unpause(event){
        if(game.paused){
            if(event.x > pauseButton.x - pauseButton.width/2 && event.x < pauseButton.x + pauseButton.width/2){
                if(event.y > pauseButton.y - pauseButton.height/2 && event.y < pauseButton.y + pauseButton.height/2){
                    pasueGame()
                }
            }

            if(event.x > muteButton.x - muteButton.width/2 && event.x < muteButton.x + muteButton.width/2){
                if(event.y > muteButton.y - muteButton.height/2 && event.y < muteButton.y + muteButton.height/2){
                    muteSounds()
                }
            }
        }
    }

    function createUIBUttons(){
        muteButton = sceneGroup.create(game.world.width-80,150,"atlas.game","sound")
        muteButton.anchor.setTo(0.5)
        muteButton.inputEnabled = true
        muteButton.events.onInputDown.add(muteSounds,this)

        pauseButton = sceneGroup.create(game.world.width-160,150,"atlas.game","pause")
        pauseButton.anchor.setTo(0.5)
        pauseButton.inputEnabled = true
        pauseButton.events.onInputDown.add(pasueGame,this)
    }

    function createGameOver(){

    	gameOverBack = game.add.graphics()
    	sceneGroup.add(gameOverBack)
    	gameOverBack.beginFill(0x000000)
    	gameOverBack.drawRect(0,0,game.world.width,game.world.height)
    	gameOverBack.endFill()
    	gameOverBack.alpha = 0
    	gameOverBack.visible = false

    	gameOverGroup = game.add.group()
    	sceneGroup.add(gameOverGroup)
    	gameOverGroup.y = - game.world.height

    	var back = gameOverGroup.create(game.world.centerX,0,"atlas.game","tablero_finish")
    	back.anchor.setTo(0.5,0)

    	gameOverDude = gameOverGroup.create(game.world.centerX-30,game.world.centerY-80,"atlas.game","")
    	gameOverDude.anchor.setTo(0.5,1)

    	var fontStyle = {font: "24px GothamCocogoose", fontWeight: "normal", fill: "#ffffff", align: "center"}
    	var pointsText = new Phaser.Text(sceneGroup.game, game.world.centerX, game.world.centerY -40, "Tu puntuación", fontStyle)
    	pointsText.anchor.setTo(0.5)
    	gameOverGroup.add(pointsText)

    	gameOverTrophy = gameOverGroup.create(game.world.centerX - 100,game.world.centerY + 60,"atlas.game","r0")
    	gameOverTrophy.anchor.setTo(0.5)


    	fontStyle = {font: "20px Luckiest Guy", fontWeight: "normal", fill: "#ffffff", align: "center"}
        gameOverTop = new Phaser.Text(sceneGroup.game, game.world.centerX - 10, game.world.centerY + 40, "Top 10", fontStyle)
        gameOverTop.anchor.setTo(0.5)
        gameOverGroup.add(gameOverTop)

    	fontStyle = {font: "30px Luckiest Guy", fontWeight: "normal", fill: "#ffffff", align: "center"}
        gameOverPlace = new Phaser.Text(sceneGroup.game, game.world.centerX - 10, game.world.centerY + 85, "0", fontStyle)
        gameOverPlace.anchor.setTo(0.5)
        gameOverGroup.add(gameOverPlace)

        gameOverCoin = gameOverGroup.create(game.world.centerX + 70,game.world.centerY + 75,"atlas.game","coin")
    	gameOverCoin.anchor.setTo(0.5)

        fontStyle = {font: "27px Luckiest Guy", fontWeight: "normal", fill: "#ffffff", align: "center"}
        gameOverPoints = new Phaser.Text(sceneGroup.game, game.world.centerX + 120, game.world.centerY + 75, "0", fontStyle)
        gameOverPoints.anchor.setTo(0,0.5)
        gameOverGroup.add(gameOverPoints)

        gameOverButtonExit = gameOverGroup.create(game.world.centerX, game.world.centerY + 200, "atlas.game","reintentar")
        gameOverButtonExit.anchor.setTo(0.5)
        gameOverButtonExit.inputEnabled = true
        gameOverButtonExit.events.onInputDown.add(returnGame,this)

    }

    
    function create(){
        
        sceneGroup = game.add.group()

        game.camera.focusOnXY(game.world.centerX, game.world.centerY);

        game.physics.startSystem(Phaser.Physics.P2JS);

        //game.stage.backgroundColor = '#124184';

        initialize()
        
        createBackground()

        setDots(Math.round(currentTimeDots))
        createPlayer()

        bigMountain = sceneGroup.create(game.world.width+game.world.centerX,game.world.height,"atlas.game","montaña_ventana")
        bigMountain.anchor.setTo(0.5,1)
        var w = game.world.width/bigMountain.width
        bigMountain.scale.setTo(w,1)

        if(!amazing.getMinigameId()){
			marioSong = game.add.audio('arcadeSong')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.6)
			}, this);	
		}

        game.onPause.add(function(){
				
			if(amazing.getMinigameId()){
				marioSong.pause()
			}
			
	        game.sound.mute = true
	    } , this);

	    game.onResume.add(function(){
			
			if(amazing.getMinigameId() && !gameMuted){
				if(lives > 0){
					marioSong.play()
				}
			}
			
	        game.sound.mute = false
	    }, this);

        spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        createPointsBar()
        createHearts()

        createUIBUttons()

        animateScene()

        loadSounds()

        createObjects()
        createTrayect()
        setRound()

        hand = sceneGroup.create(game.world.centerX,game.world.centerY + 100,"atlas.game","handUp")
        hand.anchor.setTo(0.5)
        hand.visible = false
        hand.key = "up"

        setTimeout(startTutorial,1000)

        game.input.onDown.add(unpause, self);

        createGameOver()

        
    }

    function startTutorial(){
        hand.visible = true
        tutorialTimeOut = setTimeout(changeHand1,200)
    }

    function changeHand1(){
        if(hand.key=="up"){
            hand.loadTexture("atlas.game","handDown")
            hand.key = "down"
            tutorialTimeOut = setTimeout(changeHand1,500)
        }
        else{
            hand.loadTexture("atlas.game","handUp")
            hand.key = "up"
            tutorialTimeOut = setTimeout(changeHand1,200)
        }
    }

    function changeHand2(){
        if(hand.key=="up"){
            hand.loadTexture("atlas.game","handDown")
            hand.key = "down"
            tutorialTimeOut = setTimeout(changeHand1,200)
        }
        else{
            hand.loadTexture("atlas.game","handUp")
            hand.key = "up"
            tutorialTimeOut = setTimeout(changeHand1,500)
        }
    }


    
    return {
        assets: assets,
        name: "wonderHood",
        create: create,
        preload: preload,
        update: update
    }
}()