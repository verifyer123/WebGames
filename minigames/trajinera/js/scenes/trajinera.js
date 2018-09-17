var soundsPath = "../../shared/minigames/sounds/"

var trajinera = function(){

    var TRAJINERA_TYPE = {
        NORMAL:0,
        MOVE:1,
        FALL:2,
        FIRE:3,
    }

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/trajinera/atlas.json",
                image: "images/trajinera/atlas.png",
            },
        ],
        images: [
            {
                name:"forest",
                file:"images/trajinera/forest.png"
            },
            {
                name:"grass",
                file:"images/trajinera/grass.png"
            },
            {
                name:"mountain",
                file:"images/trajinera/mountain.png"
            },
            {
                name:"tree",
                file:"images/trajinera/tree.png"
            },
            {
                name:"water",
                file:"images/trajinera/water_patron.png"
            },
            {
                name:"forest",
                file:"images/trajinera/forest.png"
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
            {   name: "jump01",
                file: soundsPath + "jump01.wav"},  
        ],
        
    }
    
    var INITIAL_LIVES = 1

    var MOUNTAIN_SPEED = -7
    var CLOUD_SPEED = -5
    var FOREST_SPEED = -6
    var TREES_SPEED = -1
    var GRASS_SPEED = -1
    var NORMAL_WATER_SPEED = 0.1
    var WATER_SPEED = 0
    var PLANTS_SPEED = 0

    var TIME_FIRE = 2000
    var FIRE_ON_TIME = 1000

    var X_LIMIT
    var MIN_X = -200

    var MIN_SEPARATION_BOAT = 350
    var MAX_SEPARATION_BOAT = 600

    var MIN_SEPARATION_PLANT = 100
    var MAX_SEPARATION_PLANT = 300

    var MIN_SEPARATION_CLOUD = 50
    var MAX_SEPARATION_CLOUD = 200

    var INIT_SPEED = 7
    var DELTA_SPEED = 0.1
    var JUMP_SPEED = -15
    var GRAVITY = 0.3

    var DELTA_MOVE_BOAT = 100
    var SPEED_MOVE_BOAT = 3

    var BOATS_TO_UNLOCK = 3

    var Y_BOATS
    var Y_PLANT, Y_PLANT_TOP
    var Y_CLOUD
    var BOAT_FLOATING_Y = 5
    var BOAT_REACTING_Y = 100
    var BOAT_MOVE_Y = 0.1
    
    var gameIndex = 31
    var gameId = 1000021
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null
    var skinTable

    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var spaceBar
    var mountain, forest, trees, grass, water
    var waterPlantGroup, trajineraGroup, cloudGroup
    var button
    var isFalling
    var gameStarted 
    var lastBoat, lastPlant, lastPlantTop, lastCloud
    var currentSpeed 

    var availableBoat
    var currentBoats

    var player
    var buddy

    function getSkins(){
        
        var dataStore = amazing.getProfile()
        
        if(!dataStore){
            skinTable = [1,1,1,1]
        }else{
         
            skinTable = dataStore
        }
        
    }

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        isFalling = true
        gameStarted = false
        X_LIMIT = game.world.width + 200
        Y_BOATS = game.world.height - 300
        currentSpeed = 0
        availableBoat = 0
        currentBoats = 0
        Y_PLANT = game.world.height - 250
        Y_PLANT_TOP = game.world.height - 430
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
        
        game.forceSingleUpdate = true
        game.stage.disableVisibilityChange = false;

        game.load.spine('mascot', "images/spines/skeleton.json");
                
        /*if(amazing.getMinigameId()){
            marioSong = sound.setSong(soundsPath + 'songs/la_fiesta.mp3',0.3)
        }else{*/
            game.load.audio('arcadeSong', soundsPath + 'songs/la_fiesta.mp3');
        //}


    }

    
    function stopGame(win){
    	isFalling = true
    	currentSpeed = 0

        heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        gameActive = false

        
        if(amazing.getMinigameId() && marioSong!=null){
            marioSong.pause()
        }else{
            marioSong.stop()
        }

        
                
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
        tweenScene.onComplete.add(function(){
            
            var resultScreen = sceneloader.getScene("result")
            resultScreen.setScore(true, pointsBar.number,gameIndex)
        
            sceneloader.show("result")
        })
    }
    
    function addPoint(number,obj){

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
        pointsText.x = pointsImg.x + pointsImg.width * 0.6
        pointsText.y = pointsImg.height * 0.3
        pointsText.anchor.setTo(0.5,0)
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

    

    function update(){

    	for(var i =0; i < trajineraGroup.length; i++){
    		if(trajineraGroup.children[i].visible){
    			var trajinera = trajineraGroup.children[i]
    			if(!trajinera.falling){
    				if(!trajinera.reacting){
    					trajinera.y+=trajinera.direction*BOAT_MOVE_Y
    					if((trajinera.direction == -1 &&  trajinera.y < Y_BOATS -BOAT_FLOATING_Y) || (trajinera.direction == 1 &&  trajinera.y > Y_BOATS +BOAT_FLOATING_Y)){
    						trajinera.direction *= -1
    					}
    				}
    				else{
    					trajinera.y+=trajinera.direction*(BOAT_MOVE_Y+1)
    					if(trajinera.y > Y_BOATS + BOAT_REACTING_Y){
    						trajinera.direction = -1
    						trajinera.reacting = false
    					}
    				}
    			}
    		}
    	}

    	if(!isFalling){
            mountain.tilePosition.x -= (MOUNTAIN_SPEED+currentSpeed)
            forest.tilePosition.x -= (FOREST_SPEED+currentSpeed)
            trees.tilePosition.x -= (TREES_SPEED+currentSpeed)
            grass.tilePosition.x -= (GRASS_SPEED+currentSpeed)
            water.tilePosition.x -= (WATER_SPEED+NORMAL_WATER_SPEED+currentSpeed)

            for(var i =0; i < waterPlantGroup.length; i++){
            	if(waterPlantGroup.children[i].visible){
            		var plant = waterPlantGroup.children[i]
            		plant.x-=(currentSpeed+NORMAL_WATER_SPEED)
            		if(plant.x <= -150){
            			plant.visible = false
            		}
            	}
            }

            for(var i =0; i < cloudGroup.length; i++){
            	if(cloudGroup.children[i].visible){
            		var cloud = cloudGroup.children[i]
            		cloud.x-=((currentSpeed*0)+NORMAL_WATER_SPEED+0.5)
            		if(cloud.x <= -150){
            			cloud.visible = false
            		}
            	}
            }
        }
        else{
            water.tilePosition.x -= NORMAL_WATER_SPEED
            for(var i =0; i < waterPlantGroup.length; i++){
            	if(waterPlantGroup.children[i].visible){
            		var plant = waterPlantGroup.children[i]
            		plant.x-=(NORMAL_WATER_SPEED)
            		if(plant.x <= -150){
            			plant.visible = false
            		}
            	}
            }

            for(var i =0; i < cloudGroup.length; i++){
            	if(cloudGroup.children[i].visible){
            		var cloud = cloudGroup.children[i]
            		cloud.x-=(NORMAL_WATER_SPEED+0.5)
            		if(cloud.x <= -150){
            			cloud.visible = false
            		}
            	}
            }
        }

    	if(!gameActive){
    		return
    	}

    	


        if(!gameStarted){
            if(game.input.activePointer.isDown){
                currentSpeed = INIT_SPEED
                isFalling = false
                buddy.setAnimationByName(0,"RUN",true)
                touchFloat()
                gameStarted = true
            }
            return
        }


        

         for(var i= 0; i < trajineraGroup.length; i++){
            if(trajineraGroup.children[i].visible){
            	var trajinera = trajineraGroup.children[i]
            	var inCollision = checkOverlap(player,trajinera.collision)
            	if(inCollision){
            		console.log("incollision")

            	}

                var trajinera = trajineraGroup.children[i]
                switch(trajinera.type){
                    case TRAJINERA_TYPE.NORMAL:
                    if(!isFalling){
                        trajinera.x -= currentSpeed
                    }
                    if(inCollision && trajinera.giveCoin){
                    	trajinera.giveCoin = false
                    	trajinera.reacting = true
                    	trajinera.direction = 1
                    	touchFloat()
                    }

                    break
                    case TRAJINERA_TYPE.MOVE:
                    if(!isFalling){
                        trajinera.initX -= currentSpeed
                    }
                    trajinera.x = trajinera.initX + trajinera.moveX
                    trajinera.moveX += trajinera.direction * SPEED_MOVE_BOAT
                    if((trajinera.direction == -1 && trajinera.moveX < -DELTA_MOVE_BOAT) || (trajinera.direction == 1 && trajinera.moveX > DELTA_MOVE_BOAT)){
                        trajinera.direction*=-1
                    }

                    if(inCollision && trajinera.giveCoin){
                    	trajinera.giveCoin = false
                    	//trajinera.reacting = true
                    	//trajinera.direction = 1
                    	touchFloat()
                    }
                    break
                    case TRAJINERA_TYPE.FALL:
                    if(!isFalling){
                        trajinera.x -= currentSpeed
                    }

                    if(inCollision){
                    	gameStarted = false
                    	buddy.setAnimationByName(0,"LOSE",false)
                    	game.add.tween(trajinera).to({y:game.world.height-200,alpha:0},500,Phaser.Easing.linear,true)
                    	game.add.tween(player).to({y:game.world.height-250,alpha:0},500,Phaser.Easing.linear,true)
                    	trajinera.falling = true
                    	missPoint()
                    }
                    
                    break
                    case TRAJINERA_TYPE.FIRE:

                    if(!isFalling){
                        trajinera.x -= currentSpeed
                    }
                    
                    if(!trajinera.fireOn){
                    	if(trajinera.timeFire < game.time.now){
                    		trajinera.fireOn = true
                    		trajinera.timeFire = game.time.now + FIRE_ON_TIME
                    		trajinera.loadTexture("atlas.game","boat4_fire")
                    	}
                    }
                    else{
                    	if(trajinera.timeFire < game.time.now){
                    		trajinera.fireOn = true
                    		trajinera.timeFire = game.time.now + (game.rnd.integerInRange(TIME_FIRE-500,TIME_FIRE))
                    		trajinera.loadTexture("atlas.game","boat4")
                    	}
                    }

                    if(inCollision){
                    	if(trajinera.fireOn){
                    		gameActive = false
                    		buddy.setAnimationByName(0,"LOSE",false)
                    		game.add.tween(player).to({y:player.y-150},200,Phaser.Easing.linear,true).onComplete.add(function(){
                    			game.add.tween(player).to({y:player.y+300,alpha:0},400,Phaser.Easing.linear,true)
                    		})
                    		missPoint()
                    		return
                    	}
                    	else{
                    		if(trajinera.giveCoin){
                    			trajinera.giveCoin = false
                    			trajinera.reacting = true
                    			trajinera.direction = 1
                    			touchFloat()
                    		}
                    	}
                    }

                    break
                }


            }
        }

        if(lastBoat.x < X_LIMIT){
        	var x = lastBoat.x + game.rnd.integerInRange(MIN_SEPARATION_BOAT,MAX_SEPARATION_BOAT)

        	var type
        	if(lastBoat.type<2){
        		type = game.rnd.integerInRange(0,availableBoat)
        	}
        	else{
        		type = game.rnd.integerInRange(0,1)
        		x-=100
        	}
        	lastBoat = getTrajinera(type,x)
        }

        if(lastPlant.x < X_LIMIT){
        	var x = lastPlant.x + game.rnd.integerInRange(MIN_SEPARATION_PLANT,MAX_SEPARATION_PLANT)
        	lastPlant = getPlant(x,Y_PLANT)
        }

        if(lastPlantTop.x < X_LIMIT){
        	var x = lastPlantTop.x + game.rnd.integerInRange(MIN_SEPARATION_PLANT,MAX_SEPARATION_PLANT)
        	lastPlantTop = getPlant(x,Y_PLANT_TOP)
        }

        if(lastCloud.x < X_LIMIT){
        	var x = lastCloud.x + game.rnd.integerInRange(MIN_SEPARATION_CLOUD,MAX_SEPARATION_CLOUD)
        	lastCloud = getCloud(x)
        }
        //if(!isFalling){
	        player.y += player.velocityY
	        player.velocityY+= GRAVITY
	    //}

	    if(player.y >= Y_BOATS){
	    	buddy.setAnimationByName(0,"LOSE",false)
        	//game.add.tween(trajinera).to({y:game.world.height-200,alpha:0},500,Phaser.Easing.linear,true)
        	game.add.tween(player).to({y:player.y+100,alpha:0},500,Phaser.Easing.linear,true)
	    	missPoint()
	    	gameActive = false

	    }

    }

    function touchFloat(){

        if(lives<=0){
            return
        }

    	if(gameStarted){
    		addPoint(1,{x:game.world.width-80,y:80})
    	}
        sound.play("jump01")
    	player.velocityY = JUMP_SPEED
    	currentBoats++
    	currentSpeed+=DELTA_SPEED

    	isFalling = false
    	if(currentBoats>=BOATS_TO_UNLOCK && availableBoat<3){
    		currentBoats=0
    		availableBoat++
    	}

    }

    function tap(){
        button.loadTexture("atlas.game","boton_off")
        isFalling = true
        player.velocityY = 30
    }

    function releasetap(){
        button.loadTexture("atlas.game","boton_on")
        //isFalling = false
    }


    function getTrajinera(type,x){
        var key
         switch(type){
            case TRAJINERA_TYPE.NORMAL:
            key = "boat2"
            break
            case TRAJINERA_TYPE.MOVE:
            key = "boat1"
            break
            case TRAJINERA_TYPE.FALL:
            key = "boat3"
            break
            case TRAJINERA_TYPE.FIRE:
            key = "boat4"
            break

        }
        for(var i =0; i < trajineraGroup.length; i++){
            if(!trajineraGroup.children[i].visible){
                var trajinera = trajineraGroup.children[i]
                trajinera.visible = true
                trajinera.type = type
                trajinera.giveCoin = true
                trajinera.loadTexture("atlas.game",key)
                if(type == TRAJINERA_TYPE.FIRE){
                    trajinera.timeFire = game.time.now + (game.rnd.integerInRange(TIME_FIRE-500,TIME_FIRE))
                    trajinera.fireOn = false
                }
                else if(type == TRAJINERA_TYPE.MOVE){
                    trajinera.initX = x
                    trajinera.moveX = 0
                    trajinera.direction = game.rnd.integerInRange(0,1)
                    if(trajinera.direction== 0){
                        trajinera.direction=-1
                    }
                }
                trajinera.reacting = false
                trajinera.falling = false
                trajinera.direction = 1
                return trajinera
            }
        }
        

        var trajinera = trajineraGroup.create(x,Y_BOATS,"atlas.game",key)
        trajinera.anchor.setTo(0.5,1)
        trajinera.type = type

        if(type == TRAJINERA_TYPE.FIRE){
            trajinera.timeFire = game.time.now + (game.rnd.integerInRange(TIME_FIRE-500,TIME_FIRE))
            trajinera.fireOn = false
        }
        else if(type == TRAJINERA_TYPE.MOVE){
            trajinera.initX = x
            trajinera.moveX = 0
            trajinera.direction = game.rnd.integerInRange(0,1)
            if(trajinera.direction== 0){
                trajinera.direction=-1
            }
        }

        trajinera.collision = game.add.graphics()
        //trajinera.collision.beginFill(0xff0000)
        trajinera.collision.drawRect(-110,-50,220,50)
        //trajinera.collision.endFill()
        trajinera.addChild(trajinera.collision)
        trajinera.giveCoin = true

        trajinera.reacting = false
        trajinera.falling = false

        trajinera.direction = 1
        return trajinera
    }

    function getCloud(x){
    	y = game.rnd.integerInRange(game.world.height -200 -256 -54 -220,100)
		for(var i =0; i < cloudGroup.length; i++){
    		if(!cloudGroup.children[i].visible){
    			var cloud = cloudGroup.children[i]
    			cloud.visible = true
    			cloud.x = x
    			cloud.y = y
    			cloud.loadTexture("atlas.game","cloud"+game.rnd.integerInRange(1,5))
    			return cloud
    		}
    	}

    	var cloud = cloudGroup.create(x,y,"atlas.game","cloud"+game.rnd.integerInRange(1,5))
    	cloud.anchor.setTo(0.5)
    	return cloud
    }

    function getPlant(x,y){
    	for(var i =0; i < waterPlantGroup.length; i++){
    		if(!waterPlantGroup.children[i].visible){
    			var plant = waterPlantGroup.children[i]
    			plant.visible = true
    			plant.x = x
    			plant.y = y
    			plant.loadTexture("atlas.game","water_plant"+game.rnd.integerInRange(1,2))
    			return plant
    		}
    	}

    	var plant = waterPlantGroup.create(x,y,"atlas.game","water_plant"+game.rnd.integerInRange(1,2))
    	plant.anchor.setTo(0.5)
    	return plant

    }

    function createBackground(){

        var bmd = game.add.bitmapData(game.world.width, game.world.height)

        var y = 0;

        for (var i = 0; i < game.world.height/2; i++)
        {
            var c = Phaser.Color.interpolateColor(0xa0d3f2, 0xc4e1f2, game.world.height, i);

            bmd.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c));
            y += 2;
        }

        var background = game.add.sprite(0, 0, bmd);
        sceneGroup.add(background)

        cloudGroup = game.add.group()
        sceneGroup.add(cloudGroup)

        mountain = game.add.tileSprite(0,game.world.height -200 -256 -54 -320,game.world.width,256,"mountain")
        sceneGroup.add(mountain)

        forest = game.add.tileSprite(0,game.world.height -200 -256 -54 -240,game.world.width,256,"forest")
        sceneGroup.add(forest)

        trees = game.add.tileSprite(0,game.world.height -200 -256 -54 -240,game.world.width,256,"tree")
        sceneGroup.add(trees)

        grass = game.add.tileSprite(0,game.world.height -200 -256 -54,game.world.width,64,"grass")
        sceneGroup.add(grass)

        water = game.add.tileSprite(0,game.world.height -200 -256,game.world.width,256,"water")
        sceneGroup.add(water)

        waterPlantGroup = game.add.group()
        sceneGroup.add(waterPlantGroup)

        trajineraGroup = game.add.group()
        sceneGroup.add(trajineraGroup)

        var backControl = game.add.graphics()
        backControl.y = game.world.height - 200
        backControl.beginFill(0x3f3b5e)
        backControl.drawRect(0,0,game.world.width,20)
        backControl.endFill()
        backControl.beginFill(0x20173d)
        backControl.drawRect(0,20,game.world.width,200-20)
        backControl.endFill()
        sceneGroup.add(backControl)

        var ligthAdorn = sceneGroup.create(game.world.centerX,game.world.height-180,"atlas.game","iluminacion_tablero")
        ligthAdorn.anchor.setTo(0.5)

        var adorn = sceneGroup.create(game.world.centerX,game.world.height-90,"atlas.game","decoracion_tablero")
        adorn.anchor.setTo(0.5)

        button = sceneGroup.create(game.world.centerX,game.world.height-90,"atlas.game","boton_off")
        button.anchor.setTo(0.5)
        button.inputEnabled = true
        button.events.onInputDown.add(tap,this)
        button.events.onInputUp.add(releasetap,this)

        lastBoat = getTrajinera(0,150)
        lastBoat.giveCoin = false

        while(lastBoat.x < X_LIMIT){
        	var x = lastBoat.x + game.rnd.integerInRange(MIN_SEPARATION_BOAT,MAX_SEPARATION_BOAT)
        	var type = game.rnd.integerInRange(0,availableBoat)
        	lastBoat = getTrajinera(type,x)
        }

        lastPlant = getPlant(0,Y_PLANT)

        while(lastPlant.x < X_LIMIT){
        	var x = lastPlant.x + game.rnd.integerInRange(MIN_SEPARATION_PLANT,MAX_SEPARATION_PLANT)
        	lastPlant = getPlant(x,Y_PLANT)
        }

        lastPlantTop = getPlant(0,Y_PLANT_TOP)

        while(lastPlantTop.x < X_LIMIT){
        	var x = lastPlantTop.x + game.rnd.integerInRange(MIN_SEPARATION_PLANT,MAX_SEPARATION_PLANT)
        	lastPlantTop = getPlant(x,Y_PLANT_TOP)
        }

        lastCloud = getCloud(0)

        while(lastCloud.x < X_LIMIT){
        	var x = lastCloud.x + game.rnd.integerInRange(MIN_SEPARATION_CLOUD,MAX_SEPARATION_CLOUD)
        	lastCloud = getCloud(x)
        }

        createPlayer()

    }

    function createPlayer(){
    	player = game.add.graphics()
    	player.x = 150
    	player.y = Y_BOATS-50
    	//player.beginFill(0x00ff00)
    	player.drawRect(-30,-50,60,50)
    	//player.endFill()
    	sceneGroup.add(player)
    	player.velocityY = 0

    	buddy = game.add.spine(0,0, "mascot");
        buddy.isRunning = true
        buddy.scale.setTo(0.5,0.5)
        //characterGroup.add(buddy) 
        buddy.setAnimationByName(0, "RUN", true);
        buddy.setSkinByName('normal');
        
        getSkins()
        
        var newSkin = buddy.createCombinedSkin(
            'combined',     
            'glasses' + skinTable[0],        
            'hair' +  skinTable[1],
            'skin' + skinTable[2],
            'torso' + skinTable[3]
        );
        
        buddy.setSkinByName('combined')
        buddy.setAnimationByName(0,"IDLE",true)

        player.addChild(buddy)
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
    
    function create(){
    	
        sceneGroup = game.add.group()

        game.camera.focusOnXY(game.world.centerX, game.world.centerY);

        initialize()

        createBackground()

        //if(!amazing.getMinigameId()){
            marioSong = game.add.audio('arcadeSong')
            game.sound.setDecodedCallback(marioSong, function(){
                marioSong.loopFull(0.6)
            }, this);   
        //}

        game.onPause.add(function(){
            
            //if(amazing.getMinigameId()){
                marioSong.pause()
            //}

           
            
            game.sound.mute = true
        } , this);

        game.onResume.add(function(){
            
            if(amazing.getMinigameId()){
                if(lives > 0){
                    marioSong.play()
                }
            }
            
            game.sound.mute = false
        }, this);


        animateScene()

        loadSounds()

        createObjects()


        createPointsBar()
        createHearts()

        spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        
    }

    
    return {
        assets: assets,
        name: "trajinera",
        create: create,
        preload: preload,
        update: update
    }

}()

function lerp(a,b,t){
   return a + t * (b - a);
}
