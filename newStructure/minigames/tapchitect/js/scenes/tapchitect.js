
var soundsPath = "../../shared/minigames/sounds/"
var tapchitect = function(){

	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/tapchitect/atlas.json",
                image: "images/tapchitect/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/tapchitect/timeAtlas.json",
                image: "images/tapchitect/timeAtlas.png"
            },
        ],
        images: [

            {
                name:'tutorial_image',
                file:"images/tapchitect/tutorial_image.png"
            },
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {
                name: 'spaceSong',
                file: soundsPath + 'songs/childrenbit.mp3'
            }
			
		],
        spines:[
            {   name:'arthurius',
                file:' images/spines/normal.json'
            }
        ]
    }

    var MINIMUM_DISTACNCE = 60
    var DELTA_CLIF = 260
    var VEL = 10
    var VEL_FALL = 10
    var yogotar
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
    var numPoints
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 156
	var indexGame
    var overlayGroup
    var spaceSong
	var fog, cloud
	var cliffsGroup, trianglesGroup
	var objToUse
	var medLine
	var medList
	var levelsArray = [[{type:0,x:-200,y:0}]]

    var currentLevelNumber
    var currentLevel

    var briedGroup

    var currentButton
    var levelTrinaglesNeed

    var yogotar
    var inMovement

    var canTouch

    var hand
    var inTutorial
    var tutorialTween

    var lastX
    var lastSpace 
    var realGame

    var inFall
    var blinkTimes 

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        currentLevelNumber = 0
        currentButton = null
        numPoints = 0
        inMovement = false
        canTouch = false
        inTutorial = 0
        lastX = game.world.centerX-380
        lastSpace = null
        realGame = false
        inFall = false
        blinkTimes = 0
        loadSounds()

        
	}
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;

        game.load.spritesheet("coin", 'images/tapchitect/coin.png', 122, 123, 12)
        
    }

    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

    }
	
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.game','life_box')

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
               coins.x=objectBorn.x
               coins.y=objectBorn.y
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

    }
    

    
    function stopGame(){
        
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    

    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)

    }

    function onClickPlay(){
        overlayGroup.y = -game.world.height
        setRound()
    }
    
    function update(){

        if(inMovement){
            yogotar.x-=VEL
            for(var i = 0; i < cliffsGroup.length; i++){
                cliffsGroup.children[i].x -= VEL
                //console.log(cliffsGroup.children[i].x)
                if(cliffsGroup.children[i].x < -500){
                    cliffsGroup.children[i].visible = false
                }

            }

            for(var i = 0; i < briedGroup.length; i++){
                if(briedGroup.children[i].visible){
                    briedGroup.children[i].x -= VEL
                    if(briedGroup.children[i].x < -500){
                        briedGroup.children[i].visible = false
                    }
                }
            }

            if(yogotar.x <=game.world.centerX - DELTA_CLIF+100){
                yogotar.x = game.world.centerX - DELTA_CLIF+100
                inMovement = false
                realGame = true
                canTouch = true
                inTutorial = -1
                VEL = 2
                //setRound()
            }
        }

        if(realGame){
        	if(!inFall){
	            for(var i = 0; i < cliffsGroup.length; i++){
	                if(cliffsGroup.children[i].visible){
	                    cliffsGroup.children[i].x -= VEL
	                    //console.log(cliffsGroup.children[i].x)
	                    if(cliffsGroup.children[i].x < -200){
	                        cliffsGroup.children[i].visible = false
	                    }
	                }
	            }

	            for(var i = 0; i < briedGroup.length; i++){
	                if(briedGroup.children[i].visible){
	                    briedGroup.children[i].x -= VEL
	                    if(briedGroup.children[i].x < -500){
	                        briedGroup.children[i].visible = false
	                    }
	                }
	            }

	            if(yogotar.x > lastSpace.world.x-(lastSpace.width/2)){
	            	yogotar.setAnimationByName(0,'LOSE',true)
	            	inFall = true
	            	missPoint()

	            }
	        }
	        else{
	        	yogotar.y += VEL_FALL
	        	if(yogotar.y > game.world.height+300){
	        		yogotar.y = game.world.height-535
	        		for(var i = 0; i < briedGroup.length; i++){
		                if(briedGroup.children[i].visible){
		                    game.add.tween(briedGroup.children[i]).to({x:briedGroup.children[i].x+100},200,Phaser.Easing.linear,true)
		                }
		            }
		            inFall = false
		            realGame = false
		           	yogotar.visible = false
		           	yogotar.setAnimationByName(0,'IDLE',true)
		            setTimeout(revive,400)
	        	}
	        	
	        }

        }
        
        fog.tilePosition.x+= 0.5
        cloud.tilePosition.x-= 0.2
        
        updateTouch()
        
    }

    function revive(){
    	if(yogotar.visible){
    		yogotar.visible = false
    	}
    	else{
    		yogotar.visible = true
    		blinkTimes++
    	}

    	if(blinkTimes<7){
    		setTimeout(revive,400)
    	}
    	else{
    		blinkTimes = 0
    		yogotar.setAnimationByName(0,'RUN',true)
    		realGame = true
    	}
    }

    function updateTouch(){
        if(!canTouch){
            return
        }
        if(currentButton!=null){
            if(game.input.activePointer.isDown){
               
                currentButton.x = game.input.activePointer.x
                currentButton.y = game.input.activePointer.y
                
            }
            else{
                var canCreate = true
                var stablishTriangle = false
                
                if(lastSpace.type == currentButton.type){
                    var d = Math.sqrt(Math.pow(lastSpace.world.x - currentButton.x,2) +Math.pow(lastSpace.world.y - currentButton.y,2))
                    if(d<= MINIMUM_DISTACNCE){
                        levelTrinaglesNeed--
                        lastSpace.inUse = true
                        //lastSpace.loadTexture('atlas.game','triangle'+currentButton.type)
                        lastSpace.loadTexture('atlas.game','triangle'+lastSpace.type)
                        stablishTriangle= true


                        if(levelTrinaglesNeed<=0 && inTutorial!=-1){
                            canCreate = false
                            yogotar.setAnimationByName(0,'RUN',true)
                            var tween = game.add.tween(yogotar).to({x:game.world.centerX+340},1000,Phaser.Easing.linear,true)
                            tween.onComplete.add(function(){

                                canTouch = false 
                                //moveCamera()
                                inMovement = true
                                createBridgePoints(0)
                                lastSpace.x = game.world.width-50
                                lastSpace.loadTexture('atlas.game','triangle0')
                                createBridgePoints(0) 
                                lastSpace.loadTexture('atlas.game','triangle0')
                                createBridgePoints(0)
                            })

                            Coin({x:game.world.centerX,y:game.world.centerY},pointsBar,500)
                        }
                        else if(inTutorial==-1){
                        	Coin({x:game.world.centerX,y:game.world.centerY},pointsBar,500)
                        }
                        

                        if(inTutorial!=-1){
                            inTutorial++
                            if(tutorialTween!=null){
                                tutorialTween.stop()

                                tutorialTween = null
                            }
                            
                            evalTutorial()
                        }
                        else{

                        }

                    }
                }
                if(stablishTriangle){
                    if(canCreate){
                        if(inTutorial!=-1){
                            createBridgePoints(2)
                        }
                        else{
                            VEL+=0.03
                            createBridgePoints()
                        }
                    }
                    currentButton.x = currentButton.startX
                    currentButton.y = currentButton.startY
                    currentButton.scale.setTo(0)
                    game.add.tween(currentButton.scale).to({x:1,y:1},500,Phaser.Easing.linear,true)
                }
                else{
                    game.add.tween(currentButton).to({x:currentButton.startX,y:currentButton.startY},500,Phaser.Easing.linear,true)
                }
                currentButton = null
            }
        }
    }

    function moveCamera(){
            //game.add.tween(yogotar).to({x:game.world.centerX - DELTA_CLIF})
            for(var i = 0; i < cliffsGroup.length; i++){
                cliffsGroup.children[i].x -= VEL
                if(cliffsGroup.children[i].x < -200){
                    cliffsGroup.children[i].x += 600
                }

            }

            for(var i = 0; i < briedGroup.length; i++){
                if(briedGroup.children[i].visible){
                    briedGroup.children[i].x -= VEL
                    if(briedGroup.children[i].x < -200){
                        briedGroup.children[i].visible = false
                    }
                }
            }
    }


    function setRound(){
        levelTrinaglesNeed = 2
        canTouch = true
        currentLevel = levelsArray[0]
        createBridgePoints(0)
        evalTutorial()

    }

    function createBridgePoints(tutorial){
        var type = game.rnd.integerInRange(0,2)
        if(tutorial!=null){
            type = tutorial
        }
        var w = 0
        if(lastSpace!=null){
            lastX = lastSpace.x
            w = lastSpace.width/2
        }
        else{
            w = -1
        }
        lastSpace = setPoint(type,lastX,0)
        if(w!=-1){
            lastSpace.x+=(lastSpace.width/2)+w
        }
        
    }

    function setPoint(type,x,y){
    	var delta = 0
    	if(type==1){
    		delta = 12
    	}
    	else if(type == 2){
    		delta = 10
    	}
        for(var i = 0; i < briedGroup.length; i++){
            if(!briedGroup.children[i].visible){
                briedGroup.children[i].visible = true
                briedGroup.children[i].loadTexture('atlas.game','triangle_line_'+type)
                briedGroup.children[i].type = type
                briedGroup.children[i].x = x
                briedGroup.children[i].y = y+delta
                briedGroup.children[i].inUse = false
                return briedGroup.children[i]
            }
        }

        var triangle = briedGroup.create(x,y+delta,'atlas.game','triangle_line_'+type)
        triangle.type=type
        triangle.inUse = false
        triangle.anchor.setTo(0.5)
        return triangle

    }

    function evalTutorial(){
        if(tutorialTween !=null){
            return
        }

        hand.visible = true
        switch(inTutorial){
            case 0:
            hand.loadTexture('atlas.game','handDown')
            hand.x = trianglesGroup.children[0].startX
            hand.y = trianglesGroup.children[0].startY
            tutorialTween = game.add.tween(hand).to({x:briedGroup.x-100,y:briedGroup.y},1000,Phaser.Easing.linear,true)
            tutorialTween.onComplete.add(function(){
                tutorialTween = null
                hand.loadTexture('atlas.game','handUp')
                setTimeout(evalTutorial,500)
            })
            break

            case 1:
            hand.loadTexture('atlas.game','handDown')
            hand.x = trianglesGroup.children[2].startX
            hand.y = trianglesGroup.children[2].startY
            tutorialTween = game.add.tween(hand).to({x:briedGroup.x+150,y:briedGroup.y},1000,Phaser.Easing.linear,true)
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

	function createBackground(){
		
		var sky = sceneGroup.create(0,0,'atlas.game','sky')
		sky.width = game.world.width
		sky.height = game.world.height
		
		cloud = game.add.tileSprite(0,200,game.world.width,214,'atlas.game','cloud')
		cloud.anchor.setTo(0,0.5)
		sceneGroup.add(cloud)
		
		var mountain3 = game.add.tileSprite(0,game.world.height - 475,game.world.width,285,'atlas.game','bot_mountain')
		mountain3.anchor.setTo(0,1)
		sceneGroup.add(mountain3)
		
		var mountain2 = game.add.tileSprite(0,game.world.height - 200,game.world.width, 436,'atlas.game','mountain2')
		mountain2.anchor.setTo(0,1)
		mountain2.alpha = 0.7
		mountain2.tilePosition.x-= 200
		sceneGroup.add(mountain2)
		
		var mountain = game.add.tileSprite(0,game.world.height,game.world.width,361,'atlas.game','mountain1')
		mountain.anchor.setTo(0,1)
		sceneGroup.add(mountain)
		
		fog = game.add.tileSprite(0,game.world.height,game.world.width, 349,'atlas.game','fog')
		fog.anchor.setTo(0,1)
		sceneGroup.add(fog)
		
		var tween = game.add.tween(fog).to({alpha: 0.3},1500,"Linear",true,0,-1)
		tween.yoyo(true,0)
		
	}

	
	function createCliffs(){
		
		cliffsGroup = game.add.group()
		sceneGroup.add(cliffsGroup)
		
		var pivotX = game.world.centerX - 300
		for(var i = 0; i < 2;i++){
			
			var cliff = cliffsGroup.create(pivotX,game.world.height,'atlas.game','cliff' + (i + 1))
			cliff.anchor.setTo(0.5,1)
			cliff.scale.setTo(1,1.2)
            pivotX+=600
			
		}
	}

    function clickButton(button,pointer){
        currentButton = button
    }
	
	function createTriangles(){
		
		trianglesGroup = game.add.group()
		sceneGroup.add(trianglesGroup)


		var positions = [{x:game.world.centerX,y:game.world.height-100},{x:game.world.centerX-100,y:game.world.height-250},{x:game.world.centerX+100,y:game.world.height-250}]
		
		var pivotX = game.world.centerX - 200
		for(var i = 0; i < 3; i++){
			
			var triangle = trianglesGroup.create(positions[i].x,positions[i].y,'atlas.game','triangle' + i)
            triangle.type = i
			triangle.anchor.setTo(0.5,0.5)
			triangle.inputEnabled = true
			triangle.events.onInputDown.add(clickButton,this)
			triangle.startX = triangle.x
			triangle.startY = triangle.y
            pivotX += 200
			
		}		
		
	}
	

    function createScene(){
        sceneGroup = game.add.group()
            
        createBackground()
        createCliffs()

        


        createTriangles()
     
        spaceSong = game.add.audio('spaceSong')
        game.sound.setDecodedCallback(spaceSong, function(){
            //spaceSong.loopFull(0.6)
        }, this);
        
        game.onPause.add(function(){
            game.sound.mute = true
        } , this);

        game.onResume.add(function(){
            game.sound.mute = false
        }, this);
        
        initialize()
                    
        createPointsBar()
        createHearts()


        briedGroup = game.add.group()
        briedGroup.x = game.world.centerX
        briedGroup.y = game.world.centerY
        sceneGroup.add(briedGroup)

        yogotar = game.add.spine(game.world.centerX -DELTA_CLIF, game.world.height-535, 'arthurius')
        sceneGroup.add(yogotar)
        yogotar.setSkinByName('normal')
        yogotar.setAnimationByName(0,'IDLE',true)
        yogotar.scale.setTo(0.5)

        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0

        hand = sceneGroup.create(0,0,'atlas.game','handUp')
        hand.anchor.setTo(0.5)
        hand.visible = false
        
        buttons.getButton(spaceSong,sceneGroup)
        createOverlay()

        correctParticle = createPart('atlas.game','star')
        
        animateScene()
    }
	
	return {
		
		assets: assets,
		name: "tapchitect",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene,
        
	}
}()