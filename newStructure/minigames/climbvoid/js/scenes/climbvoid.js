var soundsPath = "../../shared/minigames/sounds/"


var climbvoid = function(){

	var COLLISION_TYPE={
		WALL:1,
		WALL_LOSE:2,
		SPIDER:3,
		JEWEL:4,
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
                json: "images/climbvoid/atlas.json",
                image: "images/climbvoid/atlas.png"
            },

        ],
        images: [
            {   name:"tutorial_image",
                file: "images/climbvoid/tutorial_image.png"}
		],
		sounds: [
            {	name: "pop",
                file: soundsPath + "pop.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "right",
				file: soundsPath + "rightChoice.mp3"},
            {   name: "magic",
                file: soundsPath + "magic.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {
                name: 'gameSong',
                file: soundsPath + 'songs/mysterious_garden.mp3'},
            
        ],
        spines:[
            {
                name:'nao',
                file:'images/spines/nao/nao.json'
            },
            {
                name:'spider',
                file:'images/spines/spider/spider.json'
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

    var MIN_HEIGHT = 120
    var MAX_HEIGHT = 300
    
    var MIN_DISTANCE = 300
    var MAX_DISTANCE = 400

    var MIN_DISTANCE_OBJECT = 1000
    var MAX_DISTANCE_OBJECT = 1500
    var MAX_DELTA_DISTANCE = 500
    var DELTA_DISTANCE = 10

    var PORCENTAGE_DOUBLE = 0.4
    var SPINE_SCALE = 0.3
    var PROBABILTY_SPIDER = 0.7

    var BLINK_TIMES = 3
    var TIME_BLINK = 400
    var HAND_OFFSET = 150
    var MULTIPLIER_FORCE = 1.5
    var MIN_TIME_FORCE = 500
    var MAX_TIME_FORCE = 1500

    var JEWEL_TO_RANDOM = 7

    var JUNGLE_TILE_HEIGTH = 959
    var COLOR_STEPS = 50
    var COLOR_BACK_ARRAY = [0xfff761,0xea61ff,0x61a5ff,0xa07aff]
    var COLOR_JUNGLE_ARRAY = [0xff8b33,0xe033ff,0x3386ff,0x7a55e0]
    var DISTANCE_CHANGE_COLOR = 300

    var lives
	var sceneGroup = null
    var gameIndex = 194
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

    var gameActive
    var jungleTile
    var wallLeft
    var wallRigth
    var webLeft
    var webRigth

    var yogotarGroup
    var climbGroup
    var spidersGroup
    var jewelGroup
    var lastObject
    var graphicCollisions
    var loseCollision

    var firstTouch

    var currentDistanceObject
    var nextDistance
    var jumpEffect

    var nextWalls
    var floor
    var currentTimeForce
    var multiplierForce 

    var currentDeltaDistance
    var createJewel
    var jewelCount

    var jewelPoints
    var nextLevelJewel
    var jewelText

    var fadePanel
    var currentColorStep
    var bmd, colorIndex, distanceChangeColor
    var currentCollider
    var jewelsParticle

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
        gameActive = false
        firstTouch = false
        currentColorStep = 0

        currentDistanceObject = 0
        colorIndex = 0

        graphicCollisions = []
        nextWalls = []

        multiplierForce = 1
        currentTimeForce = 0
        nextLevelJewel = 2

        currentDeltaDistance = 0
        createJewel = false
        jewelCount = 0
        distanceChangeColor = 0

        currentCollider = null

        loadSounds()
        
	}

    function preload(){
        game.stage.disableVisibilityChange = false;

        game.load.spritesheet("coin", 'images/climbvoid/coin.png', 122, 123, 12)

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

    function Coin(objectBorn,objectDestiny,time,amount){

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
               addPoint(amount)
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

    }
    
    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height
        gameActive = true
        setRound()

    }

    function changeColor(){

        currentColorStep++
        if(currentColorStep>COLOR_STEPS){
            currentColorStep = 0
            colorIndex++
            if(colorIndex>=COLOR_JUNGLE_ARRAY.length){
                colorIndex = 0
            }
        }
        var nextColorIndex = colorIndex+1
        if(nextColorIndex>=COLOR_JUNGLE_ARRAY.length){
            nextColorIndex=0
        }
        var jungleColor = Phaser.Color.interpolateColor(COLOR_JUNGLE_ARRAY[colorIndex], COLOR_JUNGLE_ARRAY[nextColorIndex],COLOR_STEPS,currentColorStep);
        var backColor = Phaser.Color.interpolateColor(COLOR_BACK_ARRAY[colorIndex], COLOR_BACK_ARRAY[nextColorIndex],COLOR_STEPS,currentColorStep);

        for(var i =0; i < jungleTile.length; i++){
            jungleTile.children[i].tint = jungleColor
        }

        bmd.clear()

        var y = 0;

        for (var i = 0; i < game.world.height/2; i++)
        {
            var c = Phaser.Color.interpolateColor(0xffffff, backColor, game.world.height, i);

            bmd.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c));

            y += 2;
        }



    }
    
    function update() {
        if(!gameActive){
            return
        }

        updateInput()

        updatePosition()

        updateFalling()
    }

    function updateFalling(){
        if(currentCollider!=null){
            var deltaY = (yogotarGroup.body.y+50) - currentCollider.world.y 
            if(deltaY > currentCollider.height){
                jump()
            }
        }
    }

    function updateInput(){

    	for(var i = 0; i < graphicCollisions.length; i ++){
    		var doCollision = true

    		if(graphicCollisions[i].world.x < game.world.centerX){
    			if(yogotarGroup.body.velocity.x > 0){
    				doCollision = false
    			}
    		}
    		else if(graphicCollisions[i].world.x > game.world.centerX){
    			if(yogotarGroup.body.velocity.x < 0){
    				doCollision = false
    			}
    		}

    		if(doCollision && graphicCollisions[i].canCollide){
	            game.physics.arcade.collide(yogotarGroup, graphicCollisions[i]);
	        }
        }

    	if(!game.input.activePointer.isDown){

            yogotarGroup.canMove = true

        }

    }

    function updatePosition(){

    	if(yogotarGroup.body.y < game.world.centerY){

    		var delta = game.world.centerY - yogotarGroup.body.y
    		currentDistanceObject += delta
            distanceChangeColor+=delta

            if(distanceChangeColor >= DISTANCE_CHANGE_COLOR){
                changeColor()
                distanceChangeColor = 0
            }

    		if(currentDistanceObject >= nextDistance && !createJewel){
    			currentDistanceObject = 0
    			nextDistance = game.rnd.integerInRange(MIN_DISTANCE_OBJECT-currentDeltaDistance,MAX_DISTANCE_OBJECT-currentDeltaDistance)
    			var random = game.rnd.frac()

                if(currentDeltaDistance<MAX_DELTA_DISTANCE){
                    currentDeltaDistance+=DELTA_DISTANCE
                }
    			if(random<PROBABILTY_SPIDER){
    				setSpider()
    			}
    			else{
                    if(jewelCount > JEWEL_TO_RANDOM){
    				    setJewel()
                    }
                    else{
                        createJewel = true
                    }
    			}

    		}
            for(var i = 0; i < spidersGroup.length; i++){
                var spider = spidersGroup.children[i]
        		if(spider.visible){
        			spider.y += delta
        			spider.canCollide = true
                    if(spider.y > game.world.height && spider.giveCoin){
                        Coin(spider,pointsBar,100,1)
                        spider.giveCoin = false
                    }
        			if(spider.y > game.world.height + 200){
        				spider.visible = false
        			}
        			
        		}
            }
            for(var i = 0; i < jewelGroup.length; i++){
                var jewel = jewelGroup.children[i]
        		if(jewel.visible){
        			jewel.y += delta
        			jewel.canCollide = true
        			if(jewel.y > game.world.height + 100){
        				jewel.visible = false
        			}
        			
        		}
                
            }


    		if(jumpEffect.alpha!=0){
    			jumpEffect.y += delta
    		}

            for(var i =0; i < jungleTile.length; i++){
    		  jungleTile.children[i].y += delta 
              if(jungleTile.children[i].y > game.world.height+100){
                jungleTile.children[i].y -= JUNGLE_TILE_HEIGTH*3
              }
            }

    		wallRigth.tilePosition.y += delta 
    		wallLeft.tilePosition.y += delta 

    		webLeft.tilePosition.y += delta 
    		webRigth.tilePosition.y += delta 
    		if(floor.visible){
    			floor.y+=delta
    			if(floor.y > game.world.height+300){
    				floor.visible = false
    			}
    		}

    		yogotarGroup.body.y += delta

    		for(var i = 0; i < climbGroup.length; i++){
    			climbGroup.children[i].y += delta

                if(climbGroup.children[i].y > game.world.height && climbGroup.children[i].visible){
                    climbGroup.children[i].graphics.canCollide = false
                }

    			if(climbGroup.children[i].y > game.world.height+100 && climbGroup.children[i].visible){
    				climbGroup.children[i].visible = false

                    if(!climbGroup.children[i].canReturn){
                        continue
                    }

    				var random = game.rnd.frac()
    				
                    if(!createJewel){
    		            if(random<PORCENTAGE_DOUBLE){
    		            	var reference = lastObject.y
    		                setWall(reference,0)
    		                setWall(reference,1,false)
    		            }
    		            else{
    		                var side = game.rnd.integerInRange(0,1)
    		                setWall(lastObject.y,side)
    		            }
                    }
                    else{
                        var reference = lastObject.y
                        if(jewelCount < 3){

                            setWall(reference,0)
                            setWall(reference,1,false)
                        }
                        else{
                            var side = game.rnd.integerInRange(0,1)
                            setWall(reference,side)
                        }

                        setJewel(reference-250)
                        createJewel = false
                        nextDistance = game.rnd.integerInRange(-reference+MIN_DISTANCE_OBJECT-currentDeltaDistance,-reference+MAX_DISTANCE_OBJECT-currentDeltaDistance)
                    }
    			}
    		}

    	}

    	if(firstTouch){
    		if(yogotarGroup.y > game.world.height + 100 && !yogotarGroup.invensible){
    			missPoint()
    			gameActive = false
    			yogotarGroup.body.velocity.x = 0
    			yogotarGroup.body.velocity.y = 0
    			game.physics.arcade.gravity.y = 0

               restartDie()
                
    		}
    	}

    	for(var i = 0; i < loseCollision.length; i ++){
            game.physics.arcade.collide(yogotarGroup, loseCollision.children[i]);
        }

        for(var i = 0; i < spidersGroup.length; i++){
            var spider = spidersGroup.children[i]
            if(spider.visible && spider.canCollide){
            	game.physics.arcade.overlap(yogotarGroup,spider,function(){
            		hit(null, spider)
            	},null,this);
            }
            
        }

        for(var i = 0; i < jewelGroup.length; i++){
            var jewel = jewelGroup.children[i]
            if(jewel.visible && jewel.canCollide){
            	game.physics.arcade.overlap(yogotarGroup,jewel,function(){
            		hit(null, jewel)
            	},null,this)
            }
        }
        

        if(inTutorial>=0 && inTutorial!=-1){
        	if(yogotarGroup.y < nextWalls[inTutorial].y-50){
        		inTutorial++
        		gameActive = false
        		hand.visible = true

        		if(hand.x > game.world.centerX){
        			hand.x = game.world.centerX - HAND_OFFSET
        		}
        		else{
        			hand.x = game.world.centerX + HAND_OFFSET
        		}

                hand.y = yogotarGroup.y+100
        		game.physics.arcade.gravity.y = 0
        		yogotarGroup.body.velocity.x = 0
        		yogotarGroup.body.velocity.y = 0
        	}
        }
    }
    

    function createTutorial(){
        
        tutoGroup = game.add.group()

        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

    }

    function setRound(){
    	hand.visible = true
    	hand.x = game.world.centerX + HAND_OFFSET
    	hand.y = yogotarGroup.y+100
    	evalTutorial()

    }


    function evalTutorial(){
    	if(lives>0){
	    	hand.loadTexture("atlas.game","handDown")
			tutorialTimeout = setTimeout(function(){
	    		hand.loadTexture("atlas.game","handUp")
	    		tutorialTimeout = setTimeout(evalTutorial,500)
	    	},500)
		}

    }

    function setWall(referenceY,side,isLast){
        if(isLast==null){
            isLast = true
        }

        var height = game.rnd.integerInRange(MIN_HEIGHT,MAX_HEIGHT)
        var y = game.rnd.integerInRange(MIN_DISTANCE,MAX_DISTANCE)
        y = referenceY - y
        createClimbWall(y,side,height,isLast)

    }


    
    function createClimbWall(y,side,climbHeight,isLast){
        if(isLast==null){
            isLast = true
        }
        for(var i = 0; i < climbGroup.length; i++){
        	if(!climbGroup.children[i].visible){
        		var climb = climbGroup.children[i]
        		climb.visible = true
        		climb.y = y
        		if(side == 0){
		            climb.x = game.world.centerX - 270
		        }
		        else{
		            climb.x = game.world.centerX + 270
		        }
		        climbHeight = climbHeight-48
		        climb.tile.height = climbHeight
		        climb.cornDown.y = climbHeight-2
		        climb.graphics.clear()
		        climb.graphics.drawRect(0,-40,83,climbHeight+48)
                climb.totalHeigth = climbHeight+48
                climb.graphics.canCollide = true
		        if(side == 1){
		            climb.scale.setTo(-1,1)
		            climb.graphics.x =83    
		        }
		        else{
		        	climb.scale.setTo(1,1)
		        	climb.graphics.x = 20   
		        }

		        climb.graphics.body.setSize(62,climbHeight+48,0,0)
                if(isLast){
                    lastObject = climb
                    climb.canReturn = true
                }
                else{
                    climb.canReturn = false
                }
                
		        return

        	}
        }
        var x 
        if(side == 0){
            x = game.world.centerX - 270
        }
        else{
            x = game.world.centerX + 270 
        }

        var group = game.add.group()
        group.x = x
        group.y = y
        climbHeight = climbHeight-48

        var tile = game.add.tileSprite(0,0,83,climbHeight,"atlas.game","medioTile")
        group.tile = tile
        group.add(tile)

        var cornUp = group.create(0,1,"atlas.game","puntaTile")
        group.cornUp = cornUp
        cornUp.anchor.setTo(0,1)

        var cornDown = group.create(0,climbHeight-2,"atlas.game","otrapuntaTile")
        group.cornDown = cornDown
        cornDown.anchor.setTo(0,0)

        var graphics = game.add.graphics(0,-20)
        graphics.drawRect(0,-40,83,climbHeight+48)
        graphics.group = group
        group.graphics = graphics
        group.add(graphics)
        game.physics.arcade.enable(graphics)
        graphicCollisions.push(graphics)
        graphics.canCollide = true
        climbGroup.add(group)
        if(isLast){
            lastObject = group
            group.canReturn = true 
        }
        else{
            group.canReturn = false
        }

        if(side == 1){
            group.scale.setTo(-1,1)
            graphics.x +=83
        }
        group.totalHeigth = climbHeight+48

        graphics.body.allowGravity = false
        graphics.body.immovable = true
        graphics.typeCollision = COLLISION_TYPE.WALL
        
    }

    function setSpider(){

        for(var i = 0; i < spidersGroup.length; i++){
            if(!spidersGroup.children[i].visible){
                var spider = spidersGroup.children[i]
                spider.visible = true

                spider.x = game.world.centerX
                spider.y = -100
                spider.visible = true
                spider.spine.setAnimationByName(0,"appear",false)
                spider.spine.addAnimationByName(0,"idle",true)
                spider.giveCoin = true
                return
            }
        }

        var spider = game.add.graphics(-100,-100)
        spider.drawRect(0,0,100,100)
        game.physics.arcade.enable(spider)
        spider.body.setSize(100,100,-50,-100)
        spider.body.allowGravity = false
        spider.body.immovable = true
        spider.typeCollision = COLLISION_TYPE.SPIDER
        spider.canCollide = false
        spider.giveCoin = true

        var tile = game.add.sprite(0,-160,"atlas.game","rope")
        tile.anchor.setTo(0.5)
        spider.addChild(tile)

        var spineSpider = game.add.spine(0,0,"spider")
        spineSpider.setSkinByName("normal")
        spineSpider.setAnimationByName(0,"appear",false)
        spineSpider.addAnimationByName(0,"idle",true)
        spineSpider.scale.setTo(0.8)
        spider.addChild(spineSpider)
        spidersGroup.add(spider)
        spider.visible = false
        spider.spine = spineSpider


    	spider.x = game.world.centerX
    	spider.y = -100
    	spider.visible = true

    }

    function setJewel(y){
        if(y==null){
            y = -100
        }

        for(var i = 0; i < jewelGroup.length; i++){
            if(!jewelGroup.children[i].visible){
                var jewel = jewelGroup.children[i]

                jewel.x = game.world.centerX
                jewel.y = y
                jewel.visible = true
                return
            }
        }

        var jewel = jewelGroup.create(-100,y,"atlas.game","ruby")
        jewel.anchor.setTo(0.5)
        jewel.scale.setTo(0.7)
        game.physics.arcade.enable(jewel)
        jewel.body.setSize(100,150,0,0)
        jewel.body.allowGravity = false
        jewel.body.immovable = true
        jewel.typeCollision = COLLISION_TYPE.JEWEL
        jewel.canCollide = false

    	jewel.x = game.world.centerX
    	//jewel.y = -100
    	jewel.visible = true
    }

    
    function createBackground(){

        bmd = game.add.bitmapData(1, game.world.height)

        var y = 0;

        for (var i = 0; i < game.world.height/2; i++)
        {
            var c = Phaser.Color.interpolateColor(0xffffff, 0xfff761, game.world.height, i);

            bmd.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c));

            y += 2;
        }

        game.physics.startSystem(Phaser.Physics.Arcade)
        game.physics.arcade.gravity.y = 0

        var background = game.add.sprite(0, 0, bmd);
        background.scale.setTo(game.world.width,1)
        backgroundGroup.add(background)
        var width = 82
        var w = game.world.centerX - 270
        var delta  = 0

        if(w > width){
            delta = w - width
            width = w

        }

        jungleTile = game.add.group()
        backgroundGroup.add(jungleTile)
        for(var i = 0; i < 3; i ++){
            var tile = jungleTile.create(game.world.centerX,-(i*JUNGLE_TILE_HEIGTH),"atlas.game","fondo")
            tile.anchor.setTo(0.5,0)
            tile.tint = 0xff8b33
        }

        wallLeft = game.add.tileSprite(game.world.centerX - 350 - delta,0,width,game.world.height,"atlas.game","tile")
        backgroundGroup.add(wallLeft)
        wallLeft.anchor.setTo(1,0)
        wallLeft.scale.setTo(-1,1)

        wallRigth = game.add.tileSprite(game.world.centerX + 350 + delta,0,width,game.world.height,"atlas.game","tile")
        wallRigth.anchor.setTo(1,0)
        backgroundGroup.add(wallRigth)

        webLeft = game.add.tileSprite(game.world.centerX - 270,0,59,game.world.height,"atlas.game","tileSpider")
        backgroundGroup.add(webLeft)

        webRigth = game.add.tileSprite(game.world.centerX + 270,0,59,game.world.height,"atlas.game","tileSpider")
        webRigth.anchor.setTo(1,0)
        backgroundGroup.add(webRigth)

        climbGroup = game.add.group()
        sceneGroup.add(climbGroup)

        floor = game.add.tileSprite(0,game.world.height,62,game.world.width,"atlas.game","medioTile")
        floor.angle = -90
        sceneGroup.add(floor)

        createClimbWall(game.world.height-210,0,200)
        createClimbWall(game.world.height-210,1,200)
        setWall(lastObject.y,0)
        nextWalls.push(lastObject)
        setWall(lastObject.y,1)
        nextWalls.push(lastObject)

        for(var i = 0 ; i < 4; i ++){
            var reference = game.world.height
            if(lastObject!=null){
                reference = lastObject.y
            }

           	
            var random = game.rnd.frac()
            if(random<PORCENTAGE_DOUBLE){
                setWall(reference,0)
                setWall(reference,1,false)
            }
            else{
                var side = game.rnd.integerInRange(0,1)
                setWall(reference,side)
            }

            if(nextWalls.length<3){
            	nextWalls.push(lastObject)
            }
        }

        yogotarGroup = game.add.graphics()
        yogotarGroup.x = game.world.centerX-70
        yogotarGroup.y = game.world.height-250
        yogotarGroup.inWall = false
        //yogotarGroup.beginFill(0x00ff00)
        yogotarGroup.drawRect(0,0,140,200)
        //yogotarGroup.endFill()
        yogotarGroup.spine = spine

        game.physics.arcade.enable(yogotarGroup)

        var spine = game.add.spine(60,200, "nao")
        yogotarGroup.addChild(spine)
        spine.scale.setTo(SPINE_SCALE)
        spine.setSkinByName("normal")
        spine.setAnimationByName(0,"idle_floor",true)
        yogotarGroup.spine = spine
        yogotarGroup.body.setSize(60,50,30,140)

        yogotarGroup.body.onCollide = new Phaser.Signal();
        yogotarGroup.body.onCollide.add(hit, this);
        yogotarGroup.blink = 0
        yogotarGroup.invensible = false
        yogotarGroup.isFalling = false
       //yogotarGroup.body.gravity.y = 0

        sceneGroup.add(yogotarGroup)


        loseCollision = game.add.group()
        sceneGroup.add(loseCollision)

        var collision = game.add.graphics()
        collision.x = game.world.centerX - 370
        collision.drawRect(0,0,100,game.world.height)
        game.physics.arcade.enable(collision)
        collision.body.setSize(100,game.world.height,0,0)
        loseCollision.add(collision)
        collision.body.allowGravity = false
        collision.body.immovable = true
        collision.typeCollision = COLLISION_TYPE.WALL_LOSE

        collision = game.add.graphics(game.world.centerX + 370,0)
        game.physics.arcade.enable(collision)
        collision.body.setSize(100,game.world.height,-100,0)
        loseCollision.add(collision)
        collision.body.allowGravity = false
        collision.body.immovable = true
        collision.typeCollision = COLLISION_TYPE.WALL_LOSE

        spidersGroup = game.add.group()
        sceneGroup.add(spidersGroup)

        

        jewelGroup = game.add.group()
        sceneGroup.add(jewelGroup)

        jumpEffect = sceneGroup.create(0,0,"atlas.game","efect")
        jumpEffect.anchor.setTo(0.5)
        jumpEffect.alpha = 0

        var borde = sceneGroup.create(10,100,"atlas.game","boardGris")
        borde.anchor.setTo(0,0.5)
        borde.scale.setTo(1.2,1)

        jewelPoints = game.add.group()
        sceneGroup.add(jewelPoints)
        jewelPoints.y = 100
        jewelPoints.x = 10

        var jewelImage = jewelPoints.create(25,0,"atlas.game","gema")
        jewelImage.anchor.setTo(0.5)

        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        jewelText = new Phaser.Text(sceneGroup.game, 0, 18, "0/2", fontStyle)
        jewelText.anchor.setTo(0,0.5)
        jewelText.x = 60
        jewelText.y = 2
        jewelPoints.add(jewelText)


        var touchGraphic = game.add.graphics()
        touchGraphic.beginFill(0x00ff00)
        touchGraphic.alpha = 0
        touchGraphic.drawRect(0,0,game.world.width,game.world.height)
        touchGraphic.endFill()
        touchGraphic.inputEnabled = true

        touchGraphic.events.onInputDown.add(function(){

        	if(!gameActive && inTutorial!=1 && inTutorial!=2 && inTutorial!=3){
        		return
        	}

            if(yogotarGroup.isFalling){
                return
            }

        	if(inTutorial!=-1){
        		if(!hand.visible){
        			return
        		}
        		else{
                    if((hand.x > game.world.centerX && game.input.activePointer.x < game.world.centerX) || (hand.x < game.world.centerX && game.input.activePointer.x > game.world.centerX)){
                        return
                    }
        			gameActive = true
        		}

        	}

        	firstTouch = true
            var direction 
            if(game.input.activePointer.x < game.world.centerX){
                direction = -1
                yogotarGroup.spine.scale.setTo(-SPINE_SCALE,SPINE_SCALE)
            }
            else{
            	yogotarGroup.spine.scale.setTo(SPINE_SCALE,SPINE_SCALE)
                direction = 1
            }
            yogotarGroup.body.velocity.x = 0
            if(yogotarGroup.canMove){
                yogotarGroup.body.velocity.x += (1500*direction)
            }
            yogotarGroup.body.velocity.y = 0
            game.physics.arcade.gravity.y = 0

            
        },this)


        touchGraphic.events.onInputUp.add(function(){

        	if(!gameActive || !firstTouch){
        		return
        	}

        	if(!yogotarGroup.inWall){
        		return
        	}

        	if(yogotarGroup.body.x < game.world.centerX){
	            jumpEffect.x = yogotarGroup.x+45
	            jumpEffect.scale.setTo(1,1)
	        }
	        else{
	            jumpEffect.x = yogotarGroup.x+70

	            jumpEffect.scale.setTo(-1,1)
	        }

	        jumpEffect.y = yogotarGroup.y+160
	        jumpEffect.alpha = 0
	        game.add.tween(jumpEffect).to({alpha:1},300,Phaser.Easing.linear,true)
	        game.add.tween(jumpEffect).to({alpha:0},300,Phaser.Easing.linear,true,300)

            var deltaTime = game.time.now - currentTimeForce

            if(deltaTime > MIN_TIME_FORCE){
                if(deltaTime<MAX_TIME_FORCE){
                    deltaTime -=MIN_TIME_FORCE
                    multiplierForce = lerp(1,MULTIPLIER_FORCE,(deltaTime/(MAX_TIME_FORCE - MIN_TIME_FORCE)))
                }
                else{
                    multiplierForce = MULTIPLIER_FORCE
                }

            }

        	jump()


        },this)

        sceneGroup.add(touchGraphic)

        nextDistance = game.rnd.integerInRange(MIN_DISTANCE_OBJECT,MAX_DISTANCE_OBJECT)

        fadePanel = game.add.graphics()
        fadePanel.beginFill(0xffffff)
        fadePanel.drawRect(0,0,game.world.width,game.world.height)
        fadePanel.endFill()

        fadePanel.alpha = 0

    }

    function restartDie(){
        if(lives<0){
            return
        }
        var fade = game.add.tween(fadePanel).to({alpha:1},400,Phaser.Easing.linear,true)
        fade.onComplete.add(function(){
            yogotarGroup.x = game.world.centerX-70
            yogotarGroup.y = game.world.height-250
            yogotarGroup.inWall = false
            yogotarGroup.spine.setAnimationByName(0,"idle_floor",true)
            firstTouch = false
            yogotarGroup.isFalling = false
            floor.y = game.world.height
            floor.visible = true
            createClimbWall(game.world.height-210,0,200,false)
            createClimbWall(game.world.height-210,1,200,false)

            var fade = game.add.tween(fadePanel).to({alpha:0},400,Phaser.Easing.linear,true)
            fade.onComplete.add(function(){
                gameActive = true
            })
        })

        for(var i = 0; i < spidersGroup.length; i++){
            var spider = spidersGroup.children[i]
            if(spider.visible){
                if(spider.y > game.world.centerY){
                    spider.visible = false
                    spider.y = -100
                }
            }
        }
    }

    function jump(){

    	if(inTutorial!=-1){
    		hand.visible = false
    		if(inTutorial>=2){
    			inTutorial=-1
    			clearTimeout(tutorialTimeout)
    		}
    	}
    	yogotarGroup.inWall = false
        currentCollider = null
        game.physics.arcade.gravity.y = 100
        var direction 
        if(yogotarGroup.body.x < game.world.centerX){
            direction = 1
            yogotarGroup.spine.scale.setTo(SPINE_SCALE,SPINE_SCALE)
        }
        else{
            direction = -1
            yogotarGroup.spine.scale.setTo(-SPINE_SCALE,SPINE_SCALE)
        }

        yogotarGroup.body.velocity.x = 120*direction
        yogotarGroup.body.velocity.y = -800 * multiplierForce
        game.physics.arcade.gravity.y = 700

        multiplierForce = 1

        yogotarGroup.spine.setAnimationByName(0,"jump",true)
    }

    function hit(sprite1,sprite2){

        switch(sprite2.typeCollision){
        	case COLLISION_TYPE.WALL:
	        yogotarGroup.body.velocity.x = 0
	        yogotarGroup.body.velocity.y = 0
            if(inTutorial==-1){
                game.physics.arcade.gravity.y = 50
            }
	        yogotarGroup.inWall = true
	        yogotarGroup.spine.setAnimationByName(0,"idle_wall",true)
            currentTimeForce = game.time.now
            currentCollider = sprite2
            if(!game.input.activePointer.isDown){
                jump()
            }

	        break
	        case COLLISION_TYPE.WALL_LOSE:
            if(!yogotarGroup.invensible){
    	        yogotarGroup.body.velocity.x = 0
    	        yogotarGroup.body.velocity.y = 0
    	        yogotarGroup.spine.setAnimationByName(0,"lose_wall",false).onComplete = function(){
                    if(lives>0){
    	        	  jump()
                    }
    	        }
	        
	        	missPoint()
	        }
            else{
                jump()
            }

	        break
	        case COLLISION_TYPE.SPIDER:
	        yogotarGroup.body.velocity.x = 0
	        yogotarGroup.body.velocity.y = 0
	        sprite2.y = game.world.height

            if(!yogotarGroup.invensible){
                missPoint()
            }
            //yogotarGroup.invensible = true

            game.physics.arcade.gravity.y = 0
            game.add.tween(yogotarGroup).to({y:game.world.height+80},1000,Phaser.Easing.linear,true).onComplete.add(function(){
                gameActive = false
                restartDie()
                
            })
	        yogotarGroup.spine.setAnimationByName(0,"lose_spider",false)
            yogotarGroup.isFalling = true

	        sprite2.visible = false
	       	sprite2.canCollide = false
	        break
	        case COLLISION_TYPE.JEWEL:
	        Coin(yogotarGroup,pointsBar,100,5)
	        sprite2.y = game.world.height
	        sprite2.visible = false
	        sprite2.canCollide = false
            jewelCount ++
            if(jewelCount == nextLevelJewel){
                jewelsParticle.x = jewelText.world.x
                jewelsParticle.y = jewelText.world.y
                jewelsParticle.start(true, 1000, null, 5)

                nextLevelJewel += (nextLevelJewel-1)
                game.add.tween(jewelPoints.scale).to({x:1.2,y:1.2},300,Phaser.Easing.linear,true).yoyo(true)
            }

            jewelText.setText(jewelCount+"/"+nextLevelJewel)

	        break
    	}

    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB);

    }

    function blink(){

        if(yogotarGroup.alpha ==1){
            yogotarGroup.alpha = 0
        }
        else{
            yogotarGroup.blink ++
            yogotarGroup.alpha = 1
            if(yogotarGroup.blink>=BLINK_TIMES){
            	yogotarGroup.invensible = false
                gameActive = true
                yogotarGroup.blink = 0

                return
            }
        }

        setTimeout(blink,TIME_BLINK)
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
        	
            game.sound.mute = true
        } , this);


        game.onResume.removeAll()
        game.onResume.add(function(){
        	
            game.sound.mute = false
        }, this);


        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0


        hand = sceneGroup.create(0,game.world.centerY+100,'atlas.game','handUp')
        hand.anchor.setTo(0.5)
        hand.visible = false

        createPointsBar()
        createHearts()
        
        correctParticle = createPart('atlas.game','star')
        jewelsParticle = createPart('atlas.game','star')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)

        createTutorial()

    }

    function render(){
        /*game.debug.body(yogotarGroup)
        for(var i = 0; i < graphicCollisions.length; i++){
             game.debug.body(graphicCollisions[i])
        }

        for(var i = 0; i < loseCollision.length; i++){
             game.debug.body(loseCollision.children[i])
        }
        for(var i = 0; i < jewelGroup.length; i++){
     	      game.debug.body(jewelGroup.children[i])   
        }

     	for(var i = 0; i < spidersGroup.length; i++){
          game.debug.body(spidersGroup.children[i])   
        }*/

        game.debug.text(game.time.fps || '--', 2, 14, "#00ff00"); 
    }

    
	return {
		assets: assets,
		name: "climbvoid",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene,
        //render:render
	}
}()

function lerp(a,b,t){
    return a + (b - a) * t;
}
