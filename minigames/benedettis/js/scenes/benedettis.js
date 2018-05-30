var soundsPath = "../../shared/minigames/sounds/"
var benedettis = function(){
    

	assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/benedettis/atlas.json",
                image: "images/benedettis/atlas.png",
            },
        ],
        images: [
            {   name: "spring",
                file: "images/benedettis/spring.png"},
		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "wrongItem",
				file: soundsPath + "wrongItem.mp3"},
            {	name: "break",
				file: soundsPath + "glassbreak.mp3"},
            {	name: "punch",
				file: soundsPath + "punch1.mp3"},
            {   name: "powerup",
                file: soundsPath + "powerup.mp3"},
            
		],
	}
    
    var COLORS = [0x22bbff,0x13ff84,0xffcf1f,0xe84612]
    var FALING_NAMES = ["captus","ventilador","yunque","zapato"]
    var PIZZA_NAMES = ["pizza_mediana","pizza_grande","pizza_super","pizza_mega"]
    var INITIAL_LIVES = 3
    var SPEED = 225
    var TIME_ADD = 600
    var JUMP_FORCE = 1100
    var DEBUG_PHYSICS = true
    var ANGLE_VALUE = 3
    var WORLD_GRAVITY = 1600
    var OFF_BRICK = 330
    var BOT_OFFSET = 105
    var TIME_DELIVER_PIZZA = 60
    var LEVEL_DELTA = 3
    var PIZZA_DELIVER = 5
    var DELTA_PIZZA_DELIVER_LEVEL = 1
    var DELTA_THIEF = 5
    var DELTA_DELIVER_TIME = 2
    var FALLING_SPEED = 10
    var DELTA_FALLING = 3
    var OFFSET_BETWEEN_WINDOWS = 130
    var PROBABILITY_PIZZA = 0.6
    var WINDOWS_TO_PIZZA = 6
    var TIME_CHECK_TROW_OBJECT = 3000
    var DELTA_LEVEL_TIME_TROW = 150
    var DELTA_PROBABILITY_TROW = 0.1
    var INITIAL_PROBABILITY_TROW = 0.2
    var INITIAL_PROBABILITY_THIEF = 0
    var DELTA_PROBABILITY_THIEF = 0.1
    var MAX_DELTA_THIEF = 0.5
    var BLINK_TIMES = 3
    var TIME_BLINK = 200
    var DELTA_ALPHA_PIZZAS = 0.01
    var MIN_DELTA_FLOWER = 200
    var MAX_DELTA_FLOWER = 500
    var PROBABILITY_FLOWER = 0.3
    var MAX_SAME_THIEFS = 2
    var gameIndex = 28
    var gameId = 100005
    
    var gameCollisionGroup, playerCollisionGroup
    var cursors
    var moveLeft, moveRight, moveUp
    var marioSong = null
    var platNames,itemNames
    var objectsGroup
    var piecesGroup
    var lastOne = null
    var pivotObjects
    var player
    var skinTable
	var sceneGroup = null
    var pointsGroup = null
    var gameActive = null
    var characterGroup = null
    var pointsBar = null
    var lives = null
    var heartsGroup = null 
    var currentTimeToDeliver, initialTimeDeliver
    var currentLevel
    var pizzasToDeliver, currentDeliveredPizzas
    var fallingObjects, probabilityThrowObject, timeTrow, timerFalling
    var liveBar
    var currentWindows
    var initialBackground, background
    var panel
    var probability_thief
    var pizzaText, pizzaIcon, pizzaGroup, currentPizzaIndex
    var fallingPizzas
    var flowerGroupLeft, flowerGroupRigth, lasFlowerLeft, lastFlowerRigth
    var sameThiefs
	function loadSounds(){
		sound.decode(assets.sounds)
	}

    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    }  
    
	function initialize(){
        gameIndex = amazing.getId(gameId)
        platNames = ['blue_plat']
        itemNames = ['coin','spring','coin','coin','coin']
        game.stage.backgroundColor = "#ffffff"
        gameActive = false
        moveUp = false
        objectsGroup = null
        lives = INITIAL_LIVES
        pivotObjects = game.world.centerY - 50
        tooMuch = false
        lastOne = null
        moveLeft = false
        moveRight = false
        skinTable = []
        currentTimeToDeliver = TIME_DELIVER_PIZZA
        currentLevel = 0
        currentDeliveredPizzas = 0
        currentWindows = 0
        probabilityThrowObject = INITIAL_PROBABILITY_TROW
        timeTrow = TIME_CHECK_TROW_OBJECT
        probability_thief = INITIAL_PROBABILITY_THIEF
        currentPizzaIndex = 0
        lasFlowerLeft = null
        lastFlowerRigth = null
        sameThiefs = 0
        
	}
    
    function animateScene() {
                        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        
        
    } 
    
    function preload() {
        
        game.plugins.add(Fabrique.Plugins.Spine);
        
        game.load.spine('mascot', "images/spines/benni/benni.json");
        game.load.spine('cliente', "images/spines/clientes/clientes.json");
        game.load.spine('ladron', "images/spines/ladron/ladron.json");
        game.load.spine('jumper', "images/spines/jumper/jumper.json");
        game.stage.disableVisibilityChange = false;
        
        game.load.spritesheet('coinS', 'images/benedettis/coinS.png', 68, 70, 12);
        game.load.spritesheet('monster', 'images/benedettis/monster.png', 292, 237, 17);
        		
		if(amazing.getMinigameId()){
			marioSong = sound.setSong(soundsPath + 'songs/running_game.mp3',0.5)
		}else{
			game.load.audio('runningSong', soundsPath + 'songs/running_game.mp3');
		}
		
        
    }
    
    function inputButton(obj){
                
        if(gameActive == true){
            if(obj.tag == 'left'){
                moveLeft = true
                moveRight = false
                characterGroup.scale.x = 1
                obj.loadTexture("atlas.game","boton_izquierdo_push")
            }else{
                moveLeft = false
                moveRight = true
                characterGroup.scale.x = -1
                obj.loadTexture("atlas.game","boton_derecho_push")
            }
        }
        
        //obj.parent.children[1].alpha = 0
    }
    
    function releaseButton(obj){
        
        if(gameActive == true){
            if(obj.tag =='left'){
                moveLeft = false
                obj.loadTexture("atlas.game","boton_izquierda")
            }else{
                moveRight = false
                obj.loadTexture("atlas.game","boton_derecha")
            }
        }
        
        //obj.parent.children[1].alpha = 1
    }
    
    function createControls(){
        
        var spaceButtons = 220
        
        var bottomRect = sceneGroup.create(0,0,'atlas.game','fondo_control')
        bottomRect.width = game.world.width
        bottomRect.x = game.world.centerX
        bottomRect.y = game.world.height
        bottomRect.anchor.setTo(0.5,1)

        var logo = sceneGroup.create(game.world.centerX,game.world.height - bottomRect.height*0.75, "atlas.game","logo_benedettis")
        logo.anchor.setTo(0.5)
        //logo.scale.setTo(0.9)
        
        sceneGroup.limit = bottomRect
        
        var groupButton = game.add.group()
        groupButton.x = game.world.centerX + 75
        groupButton.y = game.world.height -95
        groupButton.scale.setTo(1)
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        /*var button1 = groupButton.create(0,0, 'atlas.game','right_press')
        button1.anchor.setTo(0.5,0.5)*/
        
        var button2 = groupButton.create(0,15, 'atlas.game','boton_derecha')
        button2.anchor.setTo(0.5,0.5)
        //button2.scale.setTo(0.7)
        button2.inputEnabled = true
        button2.tag = 'right'
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)
        
        var groupButton = game.add.group()
        groupButton.x = game.world.centerX - 75
        groupButton.y = game.world.height -95
        groupButton.scale.setTo(1)
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        /*var button1 = groupButton.create(0,0, 'atlas.game','left_press')
        button1.anchor.setTo(0.5,0.5)*/
        
        var button2 = groupButton.create(0,15, 'atlas.game','boton_izquierda')
        button2.anchor.setTo(0.5,0.5)
        //button2.scale.setTo(0.7)
        button2.inputEnabled = true
        button2.tag = 'left'
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)
        
    }
    
    function stopWorld(){

        buddy.setAnimationByName(0,"lose",false)
        var tweenLose = game.add.tween(buddy).to({y:buddy.y - 150}, 1000, Phaser.Easing.Cubic.Out, true)
        tweenLose.onComplete.add(function(){
            game.add.tween(buddy).to({y:buddy.y + game.world.height + game.world.height * 0.2}, 500, Phaser.Easing.Cubic.In, true)
            game.add.tween(objectsGroup).to({y:objectsGroup.y - game.world.height * 0.4},500,Phaser.Easing.linear,true)
        })
    
    }
    
    function stopGame(win){
        
		if(amazing.getMinigameId()){
			marioSong.pause()
		}else{
			marioSong.stop()
		}
        
        sound.play("gameLose")
        stopWorld()
        //game.add.tween(objectsGroup).to({alpha:0},250, Phaser.Easing.Cubic.In,true)
        if(timerFalling!=null){
            clearTimeout(timerFalling)
        }
        worldGroup.alpha = 0
        game.add.tween(worldGroup).to({alpha:1},250,Phaser.Easing.linear,true)
        
        //objectsGroup.timer.pause()
        gameActive = false
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)
            
            //amazing.saveScore(pointsBar.number) 
            
			sceneloader.show("result")
		})
    }
    
    function addPoint(obj,part){
        
        var partName = part || 'ring'
        sound.play("pop")
                
        createPart(partName, obj)
        createTextPart('+1', obj)
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        //console.log(obj.tag + ' tag')
        addNumberPart(pointsBar.text,'+1')
        
    }
    
    function addNumberPart(obj,number){
        
        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)
        
        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
        tweenScale.onComplete.add(function(){
            game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
        })
    }
    
    function missPoint(){
        
        if(lives <= 0){
        	return
        }

        //if (lives >0){
        lives--;
        //}

        if(lives <=0 ){
            characterGroup.alpha = 1
        	stopGame()
        }
        
        sound.play('wrong')
        createPart('wrong',player)
        //changeImage(0,heartsGroup.children[lives])
        heartsGroup.text.setText('X ' + lives)
        //buddy.setAnimationByName(0, "RUN_LOSE", 0.8);
        
        addNumberPart(heartsGroup.text,'-1')
        
    }
    
    function positionPlayer(){
        
        if(player.body.x > game.world.height * 0.95){
            player.body.x = 5
        }else if(player.body.x < 10){
            player.body.x = game.world.height * 0.9
        }
        
        if(player.body.y > player.lastpos + 5){
            player.falling = true    
        }else{
            player.falling = false
        }
        
        characterGroup.x = player.x
        characterGroup.y = player.y +44 
        
        if(player.body.y > game.world.height - sceneGroup.limit.height  - player.height * 0.25 && player.falling){
            
            //stopGame()
            
            missPoint()

            if(lives > 0){
            	blink()
            	characterGroup.invensible = true
            }

            player.body.y = game.world.centerY
            player.body.x = game.world.centerX
            player.body.velocity.y = 0

            doJump()
        }
        
        player.lastpos = player.body.y

    }
    
    function deactivateObj(obj){
        
        obj.active = false
        obj.alpha = 0
        
        objectsGroup.remove(obj)
        piecesGroup.add(obj)
        
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
    
    function fadePlat(object){
        
        object.tween = game.add.tween(object).to({alpha:0},300,Phaser.Easing.liner,true).onComplete.add(function(){
            deactivateObj(object)
            addObjects()
        },this)
    }
    
    /*function setBalloons(){
        
        game.physics.p2.gravity.y = 0
        player.body.velocity.y = 0
        
        sound.play("pop")
        sound.play("balloon")
        
        player.active = false
        moveUp = true
        buddy.setAnimationByName(0, "JUMP_BALLOONS", true)
        
        var newSkin = buddy.createCombinedSkin(
                'combined2',     
                'glasses' + skinTable[0],        
                'hair' +  skinTable[1],
                'skin' + skinTable[2],
                'torso' + skinTable[3],
                'balloons'
        );

        buddy.setSkinByName('combined2')
        
        buddy.setToSetupPose()
        
        game.time.events.add(3000,function(){
                        
            player.active = true
            moveUp = false
            
            game.physics.p2.gravity.y = WORLD_GRAVITY
            
            buddy.setSkinByName('combined')
            buddy.setToSetupPose()
        },this)
    }*/
    
    function checkObjects(){
        
        for(var i = 0; i<objectsGroup.length; i++){
            
            var object = objectsGroup.children[i]
            
            if(object.active){
                
                var tag = object.tag
                
                if(checkOverlap(player,object)){
                    
                    var checkTop = player.world.y < object.world.y - object.height * 0.5 && player.falling && player.active
                    
                    if(tag == 'plataforma'){
                        
                        if(checkTop){
	                    	if(object.pizza.visible ){

	                        	object.pizza.visible = false
	                        	if(!object.haveThief){
	                        		deliverPizza()
	                        	}
	                        	else{
                                    console.log("hit from thief")
	                        		hit(DELTA_THIEF)
	                        	}
	                        }

                            doJump()
                        }

                    }else if(tag == 'coin'){
                        
                        addPoint(object,'star')
                        deactivateObj(object)
                        
                    }else if(tag == 'spring' && checkTop){
                        
                        doJump(JUMP_FORCE * 2)
                        sound.play('powerup')
                        object.spine.setAnimationByName(0,"jump",false)
                        
                        var offset = 1
                        if(characterGroup.scale.x < 0){ offset = -1}
                        game.add.tween(characterGroup).to({angle:characterGroup.angle + (360 * offset)},500,Phaser.Easing.linear,true)
                    }else if(tag == 'balloons' && player.active){
                        
                        setBalloons()
                        deactivateObj(object)
                        createPart('star',object)
                    }else if(tag == 'monster' && player.active){
                        
                        if(Math.abs(player.body.x - object.world.x) < 50 && Math.abs(player.body.y - object.world.y) < 50)
                        stopGame()
                    }
                    
                }
                
                if(object.world.y > game.world.height){
                    deactivateObj(object)
                    
                    if(tag == 'plataforma'){

                    	if(object.person){
                    		object.person.visible = false
                            object.thief.visible = false
                    	}

                    	if(object.pizza){
                    		object.pizza.visible = false
                    	}
                    	//console.log("addObject")
                        addObjects()
                    }
                    
                }
                
                
            }
            
        }


        for(var i = 0; i < fallingObjects.length; i++){
        	if(fallingObjects.children[i].visible){
        		var fall = fallingObjects.children[i]
        		fall.y += FALLING_SPEED

        		//console.log("object falling ",fall.y, player.y, fall.alpha, fall.visible)
        		if(checkOverlap(player,fall) && fall.y > 0){
                    //console.log("hit from object falling")
        			hit(DELTA_FALLING)
        			fall.visible = false
        		}

        		if(fall.y >= game.world.height){
        			fall.visible = false
        		}


        	}
        }

        
        
        var bar = sceneGroup.limit
        if(player.body.y <= game.world.centerY){

            var value = game.world.centerY - player.body.y
            
            value*=0.8
            
            objectsGroup.y+=value
            player.body.y+=value
            for(var i = 0; i < fallingObjects.length; i++){
            	if(fallingObjects.children[i].visible){
	            	var fall = fallingObjects.children[i]
	        		fall.y += value
	        	}
            }

            for(var i = 0; i < fallingPizzas.length; i++){
    			if(fallingPizzas.children[i].visible){
    				fallingPizzas.children[i].y +=value
    			}
    		}

    		for(var i = 0; i < flowerGroupLeft.length; i++){
    			var flower = flowerGroupLeft.children[i]
    			flower.y +=value
    			if(flower.y > game.world.height){
    				flower.y = lasFlowerLeft.y - game.rnd.integerInRange(MIN_DELTA_FLOWER,MAX_DELTA_FLOWER)
    				lasFlowerLeft = flower
    			}
    		}

    		for(var i = 0; i < flowerGroupRigth.length; i++){
    			var flower = flowerGroupRigth.children[i]
    			flower.y +=value
    			if(flower.y > game.world.height){
    				flower.y = lastFlowerRigth.y - game.rnd.integerInRange(MIN_DELTA_FLOWER,MAX_DELTA_FLOWER)
    				lastFlowerRigth = flower
    			}
    		}

            if(initialBackground.y < game.world.height){
            	initialBackground.y+=value
            }
            background.tilePosition.y+=value

        }
        
    }
    
    function doJump(value){
        
        if(!gameActive){
            return
        }
        
        var jumpValue = value
        
        if(jumpValue == null){ jumpValue = JUMP_FORCE}
        sound.play("whoosh")
        
        buddy.setAnimationByName(0, "jump", true);
        //buddy.addAnimationByName(0, "LAND", false);

        if(game.physics.p2.gravity.y == 0){
            game.physics.p2.gravity.y = WORLD_GRAVITY
            //marioSong.loopFull(0.5)
        }
        
        /*var bar = sceneGroup.limit
        if(player.body.y <= bar.body.y + bar.height){
            //console.log('move')
            game.add.tween(objectsGroup).to({y:objectsGroup.y + 150},200,Phaser.Easing.linear,true)
        }*/
        
        player.body.moveUp(jumpValue)        
    
    }
    
    function update(){
        
        if(gameActive == false){
            return
        }

        for(var i = 0; i < fallingPizzas.length; i++){
    		if(fallingPizzas.children[i].visible){
    			var pizza = fallingPizzas.children[i]
    			pizza.y += FALLING_SPEED
    			pizza.alpha-=DELTA_ALPHA_PIZZAS

    			if(pizza.alpha <= 0){
    				pizza.visible = false
    			}
    		}
    	}
        
        positionPlayer()        
        
        if(cursors.left.isDown && !moveLeft){
            player.body.x-= 10
            
            if(characterGroup.scale.x != 1){
                
                characterGroup.scale.x = 1
            }
            
        }
        
        if(cursors.right.isDown && !moveRight){
            player.body.x+= 10
            if(characterGroup.scale.x != -1){
                
                characterGroup.scale.x = -1
            }
        }
        
        if(moveLeft){
            
            player.body.x-= 10
        }else if(moveRight){
            
            player.body.x+= 10
        }
        
        if(moveUp){
            player.body.y-=15
        }
        
        checkObjects()

        currentTimeToDeliver -= game.time.elapsed/1000;

        changeLive()
        if(currentTimeToDeliver <= 0){
            endTime()
        }
    }

    function changeLive(){

    	liveBar.mask.scale.setTo(currentTimeToDeliver/initialTimeDeliver, 1)
    	if(currentTimeToDeliver <= 0){
            console.log("missPoint")
    		missPoint()
    		if(lives > 0){
    			currentTimeToDeliver = TIME_DELIVER_PIZZA - (LEVEL_DELTA * currentLevel)
    		}
    	}
    }

    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(10,10,'atlas.game','xpcoins')
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.85
        pointsText.y = pointsImg.height * 0.3
        pointsText.anchor.setTo(1,0)
        pointsBar.add(pointsText)
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.x = game.world.width - 20
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartsImg = group.create(0,0,'atlas.game','life_box')
        heartsImg.anchor.setTo(1,0)
        
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, "0", fontStyle)
        pointsText.x = -heartsImg.width * 0.38
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
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y - 60
            pointsText.setText(text)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
        
    }
    
    function lookParticle(key){
        
        for(var i = 0;i<particlesGroup.length;i++){
            
            var particle = particlesGroup.children[i]
            if(!particle.used && particle.tag == key){
                
                particle.used = true
                particle.alpha = 1
                return particle
                break
            }
        }
        
    }
    
    function deactivateParticle(obj,delay){
        
        game.time.events.add(delay,function(){
            obj.used = false
        },this)
    }
    
    function createPart(key,obj){
        
        key+='Part'
        var particle = lookParticle(key)
        if(particle){
            
            particle.x = obj.world.x
            particle.y = obj.world.y
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
    
    function activateObject(child,posX,posY){

        
         piecesGroup.remove(child)
         objectsGroup.add(child)

         var tag = child.tag
         child.active = true
         child.alpha = 1
         child.y = posY
         child.x = posX

         /*if(child.tag == "spring"){
            child.alpha = 0
         }*/
    }
    
    function addItem(obj){
                
        Phaser.ArrayUtils.shuffle(itemNames)
        
        var tag = itemNames[0]
        
        //console.log(tag + ' tag')
        
        for(var i = 0; i < piecesGroup.length;i++){
            
            var item = piecesGroup.children[i]
            
            if(!item.active && item.tag == tag){
                
                var posX = obj.x
                
                if(item.tag == 'monster'){
                    posX = obj.x
                    while(Math.abs(obj.x - posX) < 100){
                        posX = game.rnd.integerInRange(100,game.world.width - 100)
                    }
                    
                }

                
                activateObject(item,posX,obj.y - obj.height * 0.5 - item.height * 0.6)
                break
            }
        
        }
    }
    
    function addObstacle(tag){
        
        for(var i = 0; i < piecesGroup.length;i++){
            
            var object = piecesGroup.children[i]
            if(!object.active && object.tag == tag){
                
                var posX = game.rnd.integerInRange(100,game.world.width - 100)
                var havePizza = false
                if(object.tag=="plataforma"){

                	object.cortine.loadTexture("atlas.game","ventana_"+game.rnd.integerInRange(1,6))
                	if(lastOne){
                		if(lastOne.x < 200){
                			posX = game.rnd.integerInRange(lastOne.x + OFFSET_BETWEEN_WINDOWS, game.world.width-100)
                		}
                		else if(lastOne.x > game.world.width - 200){
                			posX = game.rnd.integerInRange(100, lastOne.x - OFFSET_BETWEEN_WINDOWS)
                		}
                		else{
                			var r = game.rnd.frac()
                			if(r < 0.5){
                				posX = game.rnd.integerInRange(100,lastOne.x - OFFSET_BETWEEN_WINDOWS)
                			}else{
                				posX = game.rnd.integerInRange(lastOne.x + OFFSET_BETWEEN_WINDOWS, game.world.width-100)
                			}
                		}
                	}

                	if(game.rnd.frac()<PROBABILITY_FLOWER){
                		object.flower.visible = true
                		var type = game.rnd.frac()
                		if(type< 0.5){
                			object.flower.loadTexture("atlas.game","enredadera_2")
                		}
                		else{
                			object.flower.loadTexture("atlas.game","enredadera_3")
                		}
                		object.flower.x = game.rnd.integerInRange(10,30)

                	}
                	else{
                		object.flower.visible = false
                	}
                	

                	if(currentWindows >= WINDOWS_TO_PIZZA){
                		if(game.rnd.frac()>PROBABILITY_PIZZA){
                			object.pizza.visible = true
                			object.person.visible = true
                			currentWindows =0
                			havePizza = true
                			var r = game.rnd.frac()
                			if(r < probability_thief && sameThiefs < MAX_SAME_THIEFS){
                				object.haveThief = true
                                //object.person.loadTexture("atlas.game","cliente")
                                object.person.visible = false
                                object.thief.visible = true
                                object.person.setAnimationByName(0,"idle",true)
                                sameThiefs ++
                				
                			}
                			else{
                                sameThiefs = 0
                                object.haveThief = false
                				//object.person.loadTexture("atlas.game","ladron")
                                object.person.visible = true
                                object.thief.visible = false
                                object.person.setAnimationByName(0,"idle",true)
                                object.person.setSkinByName("client"+game.rnd.integerInRange(1,4))
                			}
                		}
                	}

                	currentWindows ++
                }

                activateObject(object,posX,pivotObjects)

                if(Math.random()*3 >1.5 && object.tag == 'plataforma' && lastOne && !havePizza){
                    addItem(object)
                }
                
                lastOne = object
                
                pivotObjects-= 150
                
                break
            }
        }
    }
    
    function createObstacle(type, number){
        
        for(var o = 0; o<number;o++){
            
            if(type == 'coin'){
                
                obj = game.add.sprite(0, 0, 'coinS');
                piecesGroup.add(obj)
                obj.animations.add('walk');
                obj.animations.play('walk',24,true); 
                
            }else if(type == 'monster'){
                
                obj = game.add.sprite(0, 0, 'monster');
                obj.scale.setTo(0.5,0.5)
                piecesGroup.add(obj)
                obj.animations.add('walk');
                obj.animations.play('walk',24,true); 
            
            }else if(type=='plataforma'){
            	var obj = piecesGroup.create(0,0,'atlas.game',type)

            	var cortine = sceneGroup.create(0,-90,"atlas.game","ventana_1")
            	cortine.anchor.setTo(0.5)
            	obj.addChild(cortine)

            	var windowAsset = sceneGroup.create(0,-90,"atlas.game","marco_ventana")
            	windowAsset.anchor.setTo(0.5)
            	obj.addChild(windowAsset)

            	
            	obj.cortine = cortine

            	obj.haveThief = false

            	var person = game.add.spine(0,-30,"cliente")
                person.setSkinByName("client1")
                person.setAnimationByName(0,"idle",true)
            	//person.anchor.setTo(0.5)
            	obj.addChild(person)
            	person.visible = false
            	obj.person = person


                var thief = game.add.spine(0,-30,"ladron")
                thief.setSkinByName("normal")
                thief.setAnimationByName(0,"idle",true)
                //thief.anchor.setTo(0.5)
                obj.addChild(thief)
                thief.visible = false
                obj.thief = thief

                var mask = game.add.graphics()
                mask.beginFill(0xff0000)
                mask.drawRect(-60,-150,120,125)
                mask.endFill()
                obj.addChild(mask)
                person.mask = mask
                thief.mask = mask

                var pizza = sceneGroup.create(30,-150,"atlas.game","pizza")
                pizza.anchor.setTo(0.5)
                pizza.visible = false
                obj.addChild(pizza)

                obj.pizza = pizza



            	var flower = sceneGroup.create(0,0,"atlas.game","enredadera_2")
            	flower.anchor.setTo(0.5,0)
            	obj.addChild(flower)
            	flower.visible = false
            	obj.flower = flower

            }
            else if(type == "spring"){
                var obj = piecesGroup.create(0,0,type)
                obj.alpha = 0
                var spine = game.add.spine(0,15,"jumper")
                //spine.setAnimationByName(0,"idle",false)
                spine.setSkinByName("normal")
                obj.addChild(spine)
                obj.spine = spine
            }
            else{
                
                var obj = piecesGroup.create(0,0,'atlas.game',type)

            }
            
            obj.anchor.setTo(0.5,0.5)
            obj.tag = type
            obj.alpha = 0
            obj.active = false
        }
        
    }
    
    function createObjects(){
        
        createObstacle('plataforma',18)
        //createObstacle('coin',20)
        createObstacle('spring',10)

        fallingObjects = game.add.group()
        sceneGroup.add(fallingObjects)

        createParticles('star',5)
        createParticles('wrong',5)
        createParticles('text',8)
       	
        //objectsGroup.children[0].x = player.body.x
        
    }

    function createFlowers(){
    	flowerGroupRigth = game.add.group()
        sceneGroup.add(flowerGroupRigth)
    	for(var i =0; i < 6; i++){
    		var flower = flowerGroupRigth.create(game.world.width,0,"atlas.game","enredadera_4")
    		flower.anchor.setTo(1,0)
    	}

    	flowerGroupLeft = game.add.group()
        sceneGroup.add(flowerGroupLeft)
    	for(var i =0; i < 6; i++){
    		var flower = flowerGroupLeft.create(0,0,"atlas.game","enredadera_1")
    		flower.anchor.setTo(0,0)
    	}
    }

    function setFlowers(){
    	for(var i =0; i < flowerGroupRigth.length; i++){
    		var flower = flowerGroupRigth.children[i]
    		var y
    		if(lastFlowerRigth==null){
    			y = game.rnd.integerInRange(0,game.world.centerY)
    		}
    		else{
    			y = lastFlowerRigth.y - game.rnd.integerInRange(MIN_DELTA_FLOWER,MAX_DELTA_FLOWER)
    		}

    		flower.y = y
    		lastFlowerRigth = flower
    	}

    	for(var i =0; i < flowerGroupLeft.length; i++){
    		var flower = flowerGroupLeft.children[i]
    		var y
    		if(lasFlowerLeft==null){
    			y = game.rnd.integerInRange(0,game.world.centerY)
    		}
    		else{
    			y = lasFlowerLeft.y - game.rnd.integerInRange(MIN_DELTA_FLOWER,MAX_DELTA_FLOWER)
    		}

    		flower.y = y
    		lasFlowerLeft = flower
    	}
    }

    function getFallingObject(){
    	var name = FALING_NAMES[game.rnd.integerInRange(0,FALING_NAMES.length-1)]
    	for(var i =0; i < fallingObjects.length; i++){
    		if(!fallingObjects.children[i].visible){

    			var fall = fallingObjects.children[i]
                fall.y = player.y - game.world.height
                fall.x = game.rnd.integerInRange(100,game.world.width - 100)
    			fall.visible = true
    			fall.loadTexture("atlas.game",name)
    			return
    		}
    	}

    	var fall = fallingObjects.create(game.rnd.integerInRange(100,game.world.width - 100),player.y - game.world.height,"atlas.game",name)
    	fall.anchor.setTo(0.5)

    }
    
    function checkTag(){
        
        Phaser.ArrayUtils.shuffle(platNames)
        
        tag = platNames[0]
        
        
        return tag
    }
    
    function addObjects(){
        
        var tag = "plataforma"
        //console.log("addObject")
        addObstacle(tag)
                
    }
    
    function getSkins(){
        
        var dataStore = amazing.getProfile()
        
        if(!dataStore){
            skinTable = [1,1,1,1]
        }else{
            skinTable = dataStore
        }
                
    }

    function deliverPizza(){
        currentDeliveredPizzas++
        currentTimeToDeliver+= DELTA_DELIVER_TIME
        changeLive()
        addPoint(player,'star')
        sound.play("magic")
        pizzaText.setText("x "+(pizzasToDeliver - currentDeliveredPizzas))
        if(currentDeliveredPizzas >= pizzasToDeliver){
            finishRound()
        }
        buddy.setAnimationByName(0,"land",false)
    }

    function hit(value){
    	if(characterGroup.invensible){
    		return
    	}

        if(lives<=0){
            return
        }

        blink()
    	sound.play("punch")
        currentTimeToDeliver -= value
        changeLive()
        if(currentTimeToDeliver <= 0){
            endTime()
        }


        getFallingPizza(player.body.x,player.body.y)
        buddy.setAnimationByName(0, "hit", false);

    }

    function getFallingPizza(x,y){
    	for(var i =0; i < fallingPizzas.length; i++){
    		if(!fallingPizzas.children[i].visible){
    			var pizza = fallingPizzas.children[i]
    			pizza.visible = true
    			pizza.alpha = 1
    			pizza.x = x
    			pizza.y = y
    			pizza.loadTexture("atlas.game",PIZZA_NAMES[currentPizzaIndex])
    			return
    		}
    	}

    	var pizza = fallingPizzas.create(x,y,"atlas.game",PIZZA_NAMES[currentPizzaIndex])
    	pizza.anchor.setTo(0.5)

    }

    function setRound(){
        gameActive = true
        game.physics.p2.gravity.y = 0
        currentTimeToDeliver = TIME_DELIVER_PIZZA - (LEVEL_DELTA * currentLevel)
        initialTimeDeliver = currentTimeToDeliver
        changeLive()
        pizzasToDeliver = PIZZA_DELIVER + currentLevel
        currentLevel ++
        currentDeliveredPizzas = 0
        initialBackground.y = 0
        //pivotObjects = game.world.centerY - 50
        characterGroup.y = game.world.height - BOT_OFFSET * 3
        player.body.y = characterGroup.y
        player.lastpos = player.y
        player.falling = false
        objectsGroup.y = 0
        lastOne = null
        buddy.setAnimationByName(0, "idle", true);
        pizzaText.setText("x "+pizzasToDeliver)
        pizzaIcon.loadTexture("atlas.game",PIZZA_NAMES[currentPizzaIndex])
        timerFalling = setTimeout(throwObject,timeTrow)
        game.time.events.add(500,doJump,this)
        var skin = ""
        switch(currentPizzaIndex){
            case 0:
            skin = "green_pizza"
            break
            case 1:
            skin = "red_pizza"
            break
            case 2:
            skin = "purple_pizza"
            break
            case 3:
            skin = "withe_pizza"
            break

        }
        buddy.setAnimationByName(0, "idle", true);
        buddy.setSkinByName(skin)

        lasFlowerLeft = null
        lastFlowerRigth = null
        setFlowers()

        for(var i = 0;i<12;i++){
            addObjects()
        }
        
    }

    function throwObject(){
    	if(!gameActive){
    		return
    	}
    	var r = game.rnd.frac()
    	if(r < probabilityThrowObject){
    		getFallingObject()
    	}
    	timerFalling = setTimeout(throwObject,timeTrow)
    }

    function finishRound(){
        gameActive = false
        game.physics.p2.gravity.y = 0
        timeTrow += DELTA_LEVEL_TIME_TROW
        probabilityThrowObject += DELTA_PROBABILITY_TROW
        currentPizzaIndex++
        if(currentPizzaIndex == PIZZA_NAMES.length){
        	currentPizzaIndex = 0
        }

        if(probability_thief < MAX_DELTA_THIEF){
        	probability_thief += DELTA_PROBABILITY_THIEF
        }
        player.body.velocity.y = 0

        game.add.tween(panel).to({alpha:1},500,Phaser.Easing.linear,true).onComplete.add(function(){
        	game.add.tween(panel).to({alpha:0},500,Phaser.Easing.linear,true)
            for(var i = 0; i < fallingObjects.length; i++){
                if(fallingObjects.children[i].visible){
                    fallingObjects.children[i].visible = false
                }
            }
        	for(var i = objectsGroup.length-1; i >=0; i--){
        		var object = objectsGroup.children[i]
        		deactivateObj(object)
                    
                if(object.tag == 'plataforma'){

                	if(object.person){
                		object.person.visible = false
                        object.thief.visible = false

                	}

                    


                	if(object.pizza){
                		object.pizza.visible = false
                	}
                }
        	}

        	pivotObjects = game.world.centerY - 50
        	
        	setTimeout(setRound,100)
        })


        //Panel in out
        // when animation finish restartGame
    }

    function endTime(){
        missPoint()
        //mezymiss animation
        gameActive = false
        setTimeout(function(){
            gameActive = true
        },500)
    }

    function blink(){

        if(lives<=0){
            return
        }

        if(characterGroup.alpha ==1){
            characterGroup.alpha = 0
        }
        else{
            characterGroup.blink ++
            characterGroup.alpha = 1
            if(characterGroup.blink>=BLINK_TIMES){
            	characterGroup.invensible = false
                //gameActive = true
                characterGroup.blink = 0
                return
            }
        }

        setTimeout(blink,TIME_BLINK)
    }
    
	return {
        
		assets: assets,
		name: "benedettis",
		create: function(event){
            
            cursors = game.input.keyboard.createCursorKeys()
            
            game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.gravity.y = 0;
            game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            game.physics.p2.world.setGlobalStiffness(1e5);
            
            game.physics.p2.setBoundsToWorld(true, true, true, true, true)
            
            playerCollisionGroup = game.physics.p2.createCollisionGroup()
            gameCollisionGroup = game.physics.p2.createCollisionGroup()
            
			sceneGroup = game.add.group()

            
            background = game.add.tileSprite(0,0,game.world.width,game.world.height,"atlas.game","ladrillo_patron")
            sceneGroup.add(background)

            initialBackground = game.add.group()
            sceneGroup.add(initialBackground)

            var piso = game.add.tileSprite(0,game.world.height-300,game.world.width,100,"atlas.game","piso_patron")
            initialBackground.add(piso)

            var puerta = initialBackground.create(game.world.centerX,game.world.height-400,"atlas.game","puerta")
            puerta.anchor.setTo(0.5)

           	var maseta = initialBackground.create(game.world.centerX-100,game.world.height-350,"atlas.game","maseta")
           	maseta.anchor.setTo(0.5)

           	maseta = initialBackground.create(game.world.centerX+100,game.world.height-350,"atlas.game","maseta")
           	maseta.anchor.setTo(0.5)

            createFlowers()

            worldGroup = game.add.group()
            //worldGroup.scale.setTo(0.5,0.5)
            //worldGroup.x = 100
            sceneGroup.add(worldGroup)
            
            loadSounds()
			initialize()       
            
			if(!amazing.getMinigameId()){
				marioSong = game.add.audio('runningSong')
				game.sound.setDecodedCallback(marioSong, function(){
					marioSong.loopFull(0.6)
				}, this);	
			}
            
            piecesGroup = game.add.group()
            worldGroup.add(piecesGroup)
            
            objectsGroup = game.add.group()
            worldGroup.add(objectsGroup)
            
            particlesGroup = game.add.group()
            worldGroup.add(particlesGroup)
            
            characterGroup = game.add.group()
            characterGroup.x = game.world.centerX
            characterGroup.y = game.world.height - BOT_OFFSET * 3
            characterGroup.blink = 0
            characterGroup.invensible = false
            worldGroup.add(characterGroup)
            
            buddy = game.add.spine(0,0, "mascot");
            //buddy.scale.setTo(0.55,0.55)
            characterGroup.add(buddy)
            buddy.setAnimationByName(0, "idle", true);
            //buddy.setSkinByName('normal');
            
            
            buddy.setSkinByName('green_pizza')
            
            //createTrail()
            
            player = worldGroup.create(characterGroup.x, characterGroup.y,'atlas.game','Benni')
            player.active = true
            player.anchor.setTo(0.5,1)
            player.scale.setTo(0.4,0.5)
            player.alpha = 0
            game.physics.p2.enable(player,false)
            player.body.fixedRotation = true
            player.body.mass = 50
            player.lastpos = player.y
            player.body.setCollisionGroup(playerCollisionGroup)
            
            player.body.collides([gameCollisionGroup])
            
            player.body.collideWorldBounds = false;

            fallingPizzas = game.add.group()
            sceneGroup.add(fallingPizzas)

            
            
            createObjects()
            
            createPointsBar()
            createHearts()
            createControls()   
            
            game.onPause.add(function(){
				
				if(amazing.getMinigameId()){
					marioSong.pause()
				}
				
                game.sound.mute = true

                if(timerFalling!=null){
                    clearTimeout(timerFalling)
                }
            } , this);

            game.onResume.add(function(){
				
				if(amazing.getMinigameId()){
					if(lives > 0){
						marioSong.play()
					}
				}
                if(timerFalling==null && gameActive){
                    throwObject()
                }
				
                game.sound.mute = false
            }, this);
            
            //createControls()
            
            game.physics.p2.setImpactEvents(true);

            var containerBar = sceneGroup.create(game.world.centerX-150,100,'atlas.game','Contenedor_barra')
	        containerBar.anchor.setTo(0,0.5)

	        liveBar = sceneGroup.create(containerBar.x+5,containerBar.y,'atlas.game','barra_vida')
	        liveBar.anchor.setTo(0,0.5)
	        liveBar.canDecrease = true


	        var mask = game.add.graphics(0,0)
	        mask.beginFill(0xff0000)
	        mask.drawRect(0,-25, 330,50)
	        mask.endFill()
	        liveBar.mask = mask
	        liveBar.addChild(mask)

	        panel = game.add.graphics()
	        panel.beginFill(0xffffff)
	        panel.drawRect(0,0,game.world.width,game.world.height)
	        panel.endFill()
	        panel.alpha = 0


	        pizzaGroup = game.add.group()
	        sceneGroup.add(pizzaGroup)
	        pizzaGroup.x = game.world.centerX - 60
	        pizzaGroup.y = 10

	        var backPizzaGroup = game.add.graphics()
	        backPizzaGroup.beginFill(0x666666)
	        backPizzaGroup.drawRoundedRect(0,0,200,50,20)
	        backPizzaGroup.endFill()
	        pizzaGroup.add(backPizzaGroup)

	        pizzaIcon = pizzaGroup.create(50,25,"atlas.game",PIZZA_NAMES[currentPizzaIndex])
	        pizzaIcon.anchor.setTo(0.5)
	        pizzaIcon.scale.setTo(0.5)

	        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        	pizzaText = new Phaser.Text(sceneGroup.game,90, 25, "x 0", fontStyle)
        	pizzaText.anchor.setTo(0,0.5)
        	pizzaGroup.add(pizzaText)


        	

            
            animateScene()

            setRound()


            
            
		},
        preload:preload,
        update:update,
		show: function(event){
			loadSounds()
			initialize()
		}
	}

}()