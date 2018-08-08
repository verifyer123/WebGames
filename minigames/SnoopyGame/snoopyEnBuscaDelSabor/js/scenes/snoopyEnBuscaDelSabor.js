var soundsPath = "../sounds/"
var snoopyEnBuscaDelSabor = function(){

    var OBJECT_TYPE = {
        PLATFORM:0,
        ENEMY_WATER:1,
        ENEMY_BIRD:2,
        ENEMY_ROCKET:3,
        ENEMY_BULLET:4,
        ENEMY_FALLING:5,
        ENEMY_WATER_STATIC:6,
        ENEMY_PUNCH_STATIC:7,
        ENEMY_PUNCH:8,
        COIN:9,
        CATSUP:10,
        ENEMY_BALLA:11,
        TRAMPOLIN:12,
        HOUSE:13,
        WATER_PLATFORM:14,
        WOOD:15,
        PLATFORM_NOTE:16,
        PLATFORM_SPECIAL:17,
        FLOOR:18
    }

    var WOODS_STATE = {
        INIT:0,
        FALLING:1,
        END:2,
        ASCENDING:3,
    }

    var HYDRANT_STATE = {
        INIT:0,
        FIRING:1,
        WAIT:2,
    }

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/snoopyEnBuscaDelSabor/atlas.json",
                image: "images/snoopyEnBuscaDelSabor/atlas.png",
            },
        ],
        images: [
         	{name:"tablero",
         	file:"images/snoopyEnBuscaDelSabor/tablero.png"}

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
            {   name: "falling",
                file: soundsPath + "falling.mp3"},  
        ],
    }
    
    var INITIAL_LIVES = 3
    var INITIAL_SPEED = 3
    var DELTA_SPEED = 0.03
    var SWIPE_MAGNITUD = 150
    var FALLING_SPEED = 2

    var DELTA_BIRD_DROP = 100
    var DELTA_TIME_SHOOT = 1800
    var BULLET_SPEED = 4
    var BULLET_SPEED_Y = 5
    var BULLET_ACELERATION_Y = 0.08
    var DELTA_TIME_WATER = 1000
    var DELTA_SCALE_WATER = 0.03
    var DELTA_TIME_PUNCH = 1000

    var Y_PLATFORM_HEIGTH = 100
    var FLOOR_Y

    var DELTA_BALLON_CHANGE = 200
    var DELTA_PUCH = 3

    var BLINK_TIMES = 3
    var TIME_BLINK = 400
    var BIRD_SPEED = 2

    var DISTANCE_MIN_MOUNTAIN = 400
    var DISTANCE_MAX_MOUNTAIN = 1300

    var DISTANCE_MIN_GRASS = 165
    var DISTANCE_MAX_GRASS = 500

    var DISTANCE_MIN_FENCE = 300
    var DISTANCE_MAX_FENCE = 500

    var VEL_MIN_CLOUD = 0
    var VEL_MAX_CLOUD = 1

    var WOOD_VELOCITY_SCALE = 0.02
    var WOOD_VELOCITY_FALLING = 1.5

    var DELTA_X = 2.5
    var INITAL_X = 200

    var NUM_FENCES = 3
    var TIME_LONG_TAP = 200
    	
    var X_DISSAPEAR
    var JUMP_VELOCITY = 450
    var JUMP_TRAMPOLIN = 800

    var gameIndex = 31
    var gameId = 100012
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null

    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var player

    var backgroundGroup
    var currentSpeed
    var tapPosition, canTouch
    var lastObject 
    var currentLevel, levelIndex
    var mountainGroup
    var currentDistanceMountain, lastMountain
    var grassGroup, lastGrass
    var fenceGroup, lastFence
    var cloudGroup
    var lastSpeed
    var woodGroup 
    var nextPlatfromsWater
    var inHit
    var jumpToOtherSide
    var startTapTime
    var firstTouch
    var moreVelocity
    var stopByHouse, lastFrameStopHouse
    var randomLevel
    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
        //gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        currentSpeed = 0
        canTouch = true
        levelIndex = 0
        FLOOR_Y = game.world.height - 150
        inHit = false
        X_DISSAPEAR = -game.world.width * 2
        jumpToOtherSide = false
        firstTouch = true
        moreVelocity = false
        stopByHouse = false
        lastFrameStopHouse = false
        randomLevel = 0
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
                
        /*if(amazing.getMinigameId()){
            marioSong = sound.setSong(soundsPath + 'songs/timberman.mp3',0.3)
        }else{*/
            game.load.audio('arcadeSong', soundsPath + 'songs/timberman.mp3');
        //}

        game.load.spine('snoopy','images/spine/snoopy/snoopy.json')
        game.load.spine('emilio','images/spine/emilio/emilio.json')

    }

    
    function stopGame(win){
        player.spine.setAnimationByName(0,"lose",true)
        heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        //gameActive = false
        currentSpeed = 0
        
        /*if(amazing.getMinigameId() && marioSong!=null){
            marioSong.pause()
        }else{*/
            marioSong.stop()
        //}
                
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
        tweenScene.onComplete.add(function(){
            
            var resultScreen = sceneloader.getScene("result")
            resultScreen.setScore(true, pointsBar.number,gameIndex)
        
            sceneloader.show("result")
        })
    }
    
    function addPoint(number,obj){
        currentSpeed+=DELTA_SPEED
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

    	if(!gameActive){
    		return
    	}

    	var cs = currentSpeed
        if(moreVelocity){
        	cs = currentSpeed*2
        }

        for(var i =0; i < cloudGroup.length; i++){
            if(cloudGroup.children[i].visible){
                var object = cloudGroup.children[i]
                //console.log(object.vel)
                object.x -= (object.vel+cs)
                if(object.x < X_DISSAPEAR){
                    object.visible = false
                    getCloud(game.world.width*2,game.rnd.integerInRange(0,game.world.centerY-100))
                }
            }
        }

        if(firstTouch){
			
            if(game.input.activePointer.isDown){
                currentSpeed = INITIAL_SPEED
               
                if(!inHit){
                	player.spine.setAnimationByName(0,"run",true)
                }
                firstTouch = false
            	canTouch = false
            }
            
            //return
        }
        else{

            updateInput()
        }

        //console.log(player.body.gravity)
        //var collideFloor = false

        if(player.x > INITAL_X){
            player.x-=DELTA_X
            
        }



        for(var i =0; i < mountainGroup.length; i++){
            if(mountainGroup.children[i].visible){
                var object = mountainGroup.children[i]
                object.x -= cs
                if(player.x > INITAL_X){
                    object.x-=DELTA_X
                }
                if(object.x < X_DISSAPEAR){
                    object.visible = false
                }
            }
        }


        for(var i =0; i < fenceGroup.length; i++){
            if(fenceGroup.children[i].visible){
                var object = fenceGroup.children[i]
                object.x -= cs
                if(player.x > INITAL_X){
                    object.x-=DELTA_X
                }
                if(object.x < X_DISSAPEAR){
                    object.visible = false
                }
            }
        }

        for(var i =0; i < grassGroup.length; i++){
            if(grassGroup.children[i].visible){
                var object = grassGroup.children[i]
                object.x -= cs
                if(player.x > INITAL_X){
                    object.x-=DELTA_X
                }
                if(object.x < X_DISSAPEAR){
                    object.visible = false
                }
            }
        }
        

        if(lastMountain.x -(lastMountain.width/2) < game.world.width+10){
            currentDistanceMountain = game.rnd.integerInRange(DISTANCE_MIN_MOUNTAIN,DISTANCE_MAX_MOUNTAIN) + lastMountain.x
            lastMountain = getMountain(currentDistanceMountain)
        }

        if(lastGrass.x -(lastGrass.width/2) < game.world.width+10){
            var d  = game.rnd.integerInRange(DISTANCE_MIN_GRASS,DISTANCE_MAX_GRASS) + lastGrass.x
            lastGrass = getGrass(d)
        }

        if(lastFence.x -(lastFence.width/2) < game.world.width+10){
            var d  = game.rnd.integerInRange(DISTANCE_MIN_FENCE,DISTANCE_MAX_FENCE) + lastFence.x
            lastFence = getFence(d)
        }

        for(var i =0; i < backgroundGroup.length; i++){
            if(backgroundGroup.children[i].visible){
                var object = backgroundGroup.children[i]
                object.x -= cs
                if(player.x > INITAL_X){
                    object.x-=DELTA_X
                }
            
                if(object.objectType == OBJECT_TYPE.PLATFORM){

                    if(object.x < X_DISSAPEAR){
                        object.visible = false
                    }

                    game.physics.arcade.overlap(player,object,hitSprite);
                }
                else if(object.objectType == OBJECT_TYPE.FLOOR){

                    if(object.x < X_DISSAPEAR){
                        object.visible = false
                    }

                    game.physics.arcade.overlap(player,object,hitSprite);
                }
                else if(object.objectType == OBJECT_TYPE.PLATFORM_NOTE){

                    if(object.x < X_DISSAPEAR){
                        object.visible = false
                    }

                    game.physics.arcade.overlap(player,object,hitSprite);
                }
                else if(object.objectType == OBJECT_TYPE.PLATFORM_SPECIAL){

                    if(object.x < X_DISSAPEAR){
                        object.visible = false
                    }

                    game.physics.arcade.overlap(player,object,hitSprite);
                }
                else if(object.objectType == OBJECT_TYPE.ENEMY_BIRD){

                	object.x -= BIRD_SPEED
                	if(game.time.now > object.dropObject.timeChangeImage){
                		object.dropObject.indexImage++
                		if(object.dropObject.indexImage>2){
                			object.dropObject.indexImage = 1
                		}
                		object.dropObject.loadTexture("atlas.game","globo"+object.dropObject.indexImage)
                		object.dropObject.timeChangeImage = game.time.now + DELTA_BALLON_CHANGE
                	}

                    if(!object.haveDrop){
                        if(object.x <= object.dropX){
                            object.haveDrop = true
                        }

                        object.dropObject.y = object.y + DELTA_BIRD_DROP

                        if(object.x < X_DISSAPEAR && (object.dropObject.y>game.world.height +object.dropObject.height || !object.dropObject)){
                            object.visible = false
                        }

                    }
                    else{
                        object.dropObject.y+=FALLING_SPEED
                        if(object.dropObject.visible){
                            game.physics.arcade.overlap(player,object.dropObject,hitEnemy);
                        }

                        if(object.x < X_DISSAPEAR && (object.dropObject.y>game.world.height +object.dropObject.height || !object.dropObject)){
                            object.visible = false
                        }
                    }
                }
                else if(object.objectType == OBJECT_TYPE.ENEMY_ROCKET){
                    if(object.x < X_DISSAPEAR){
                        object.visible = false
                    }

                    game.physics.arcade.overlap(player,object,hitEnemy);

                    if(object.timeWait <= game.time.now){
                        getBullet(object.x,object.y)
                        object.timeWait = game.time.now+DELTA_TIME_SHOOT
                    }
                }
                else if(object.objectType == OBJECT_TYPE.ENEMY_BULLET){
                    if(object.x < X_DISSAPEAR){
                        object.visible = false
                    }

                    object.x -= BULLET_SPEED
                    object.y += object.velocityY
                    object.velocityY += BULLET_ACELERATION_Y

                    game.physics.arcade.overlap(player,object,hitEnemy);

                }
                else if(object.objectType == OBJECT_TYPE.ENEMY_WATER_STATIC){
                    if(object.x < X_DISSAPEAR){
                        object.visible = false
                    }

                    game.physics.arcade.overlap(player,object,hitSprite);

                    if(object.state == HYDRANT_STATE.INIT){
                        if(object.timeWait <= game.time.now){
                            object.water1.visible = !object.water1.visible
                            object.water2.visible = !object.water2.visible
                            object.timeWait = game.time.now +100//+ DELTA_TIME_SHOOT
                            object.state = HYDRANT_STATE.FIRING
                        }
                    }
                    else if(object.state == HYDRANT_STATE.FIRING){
                        if(object.timeWait <= game.time.now){
                            object.timeWait = game.time.now +100
                            if(!object.water1[0].visible){
                                object.water1[0].visible = true
                                object.water2[0].visible = true
                            }
                            else if(!object.water1[1].visible){
                                object.water1[1].visible = true
                                object.water2[1].visible = true
                            }
                            else if(!object.water1[2].visible){
                                object.water1[2].visible = true
                                object.water2[2].visible = true
                            }
                            else if(!object.water1[3].visible){
                                object.water1[3].visible = true
                                object.water2[3].visible = true
                                object.timeWait = game.time.now + DELTA_TIME_SHOOT
                                object.state = HYDRANT_STATE.END
                            }
                        }
                    }
                    else if(object.state == HYDRANT_STATE.END){
                        if(object.timeWait <= game.time.now){
                            object.state = HYDRANT_STATE.INIT
                            object.timeWait= game.time.now +DELTA_TIME_SHOOT
                            for(var j=0; j < 4; j++){
                                object.water1[j].visible = false
                                object.water2[j].visible = false
                                object.water1[j].scale.setTo(0)
                                object.water2[j].scale.setTo(0)
                                object.water1[j].direction = 1
                                object.water2[j].direction = 1
                            }
                        }
                    }

                    for(var j=0; j < 4; j++){
                        if(object.water1[j].visible){
                            object.water1[j].x = object.x +object.water1[j].offset_X
                            object.water2[j].x = object.x +object.water2[j].offset_X
                            object.water1[j].scale.setTo(object.water1[j].scale.x+(DELTA_SCALE_WATER*object.water1[j].direction),object.water1[j].scale.x+(DELTA_SCALE_WATER*object.water1[j].direction))
                            object.water2[j].scale.setTo(object.water2[j].scale.x-(DELTA_SCALE_WATER*object.water2[j].direction),object.water2[j].scale.y+(DELTA_SCALE_WATER*object.water2[j].direction))
                            if(object.water1[j].direction == 1 && object.water1[j].scale.y >=1){
                            	object.water1[j].direction = -1
                            }
                            else if(object.water1[j].direction == -1 && object.water1[j].scale.y <=0.7){
                            	object.water1[j].direction = 1
                            }

                            if(object.water2[j].direction == 1 && object.water2[j].scale.y >=1){
                            	object.water2[j].direction = -1
                            }
                            else if(object.water2[j].direction == -1 && object.water2[j].scale.y <=0.7){
                            	object.water2[j].direction = 1
                            }

                            game.physics.arcade.overlap(player,object.water1[j],hitEnemy);
                            game.physics.arcade.overlap(player,object.water2[j],hitEnemy);
                        }
                    }

                }

                else if(object.objectType == OBJECT_TYPE.ENEMY_PUNCH_STATIC){
                    if(object.x < X_DISSAPEAR){
                        object.visible = false
                    }

                    game.physics.arcade.overlap(player,object,hitSprite);
                    //console.log(object.timeWait,game.time.now)
                    if(object.timeWait <= game.time.now && !object.hitObject.visible){
                        object.hitObject.visible = !object.hitObject.visible
                        //object.timeWait += DELTA_TIME_SHOOT
                    }

                    if(object.hitObject.visible){

                        object.hitObject.x = object.x - object.hitObject.currentDelta
                        game.physics.arcade.overlap(player,object.hitObject,hitEnemy);
                        object.hitObject.currentDelta += DELTA_PUCH*object.hitObject.direction
                        if(object.hitObject.direction==1){
                        	if(object.hitObject.currentDelta > (object.hitObject.width/3)*2){
                        		object.timeWait = game.time.now + 800
                        		object.hitObject.direction = 0
                        	}
                        }
                        else if(object.hitObject.direction==0 && object.timeWait<=game.time.now){
                        	object.hitObject.direction = -1
                        }
                        else if(object.hitObject.direction == -1){
                        	if(object.hitObject.currentDelta <=0){
                        		object.hitObject.visible = false
                        		object.hitObject.direction = 1
                        		object.hitObject.currentDelta = 0
                        		object.timeWait = game.time.now+DELTA_TIME_PUNCH
                        	}
                        }


                    }

                }
                else if(object.objectType == OBJECT_TYPE.ENEMY_BALLA){
                	if(object.x < X_DISSAPEAR){
                        object.visible = false
                    }

                    game.physics.arcade.overlap(player,object,hitEnemy);

                }
                else if(object.objectType == OBJECT_TYPE.TRAMPOLIN){
                	if(object.x < X_DISSAPEAR){
                        object.visible = false
                    }

                    game.physics.arcade.overlap(player,object,hitTrampolin);

                }
                
                else if(object.objectType == OBJECT_TYPE.COIN || object.objectType == OBJECT_TYPE.CATSUP){
                    if(object.x < X_DISSAPEAR){
                        object.visible = false
                    }
                    game.physics.arcade.overlap(player,object,hitCoin); 
                }

                else if(object.objectType == OBJECT_TYPE.WATER_PLATFORM){
                    if(object.x < X_DISSAPEAR){
                        object.visible = false
                    }
                    //console.log(object)
                    object.tilePosition.x+=1
                    object.front.tilePosition.x-=1

                    for(var j =0; j < object.wood.length; j++){
                        var wood = object.wood[j]
                        wood.x = object.x - (wood.width/2) + (object.width/2)
                        //console.log(wood.x)
                        if(wood.state == WOODS_STATE.INIT){
                            wood.scale.setTo(1,wood.scale.y+WOOD_VELOCITY_SCALE)
                            if(wood.scale.y >= 1){
                                wood.scale.setTo(1)
                                wood.state = WOODS_STATE.FALLING
                            }

                        }
                        else if(wood.state == WOODS_STATE.FALLING){
                            wood.y += WOOD_VELOCITY_FALLING
                            if(wood.y >= FLOOR_Y + 120){
                                wood.y = FLOOR_Y + 120
                                wood.alpha = 0
                                wood.state = WOODS_STATE.END
                            }
                        }
                        else if(wood.state == WOODS_STATE.END){
                            wood.scale.setTo(1,wood.scale.y-WOOD_VELOCITY_SCALE)
                            if(wood.scale.y <= 0){
                                wood.scale.setTo(1,0)
                                wood.state = WOODS_STATE.ASCENDING
                            }
                        }
                        else if(wood.state == WOODS_STATE.ASCENDING){
                            wood.y -= WOOD_VELOCITY_FALLING
                            if(wood.y < FLOOR_Y+10){
                                wood.y = FLOOR_Y+10
                                wood.alpha = 1
                                wood.state = WOODS_STATE.INIT
                            }
                        }


                        game.physics.arcade.overlap(player,wood,hitSprite); 

                    }
                }
                else if(object.objectType == OBJECT_TYPE.HOUSE){
                	if(object.x < X_DISSAPEAR){
                        object.visible = false
                    }
                    game.physics.arcade.overlap(player,object,hitSprite); 
                }
            }
        }

        if(player.y >= (game.world.height)+(player.height/2)){
            missPoint()
            
            var nextP

            for(var i =0; i < backgroundGroup.length; i++){
            	if(backgroundGroup.children[i].visible && backgroundGroup.children[i].objectType == OBJECT_TYPE.FLOOR){
            		var b = backgroundGroup.children[i]
            		//console.log(b.x,player.x)
            		if(b.x < 690 && b.x>player.x){
            			if(nextP==null){
            				nextP = b
            			}
            			else{
            				if(nextP.x > b.x){
            					nextP = b
            				}
            			}
            		}
            	}
            }

            var delta = nextP.x - player.x
            player.x += delta
            player.y = FLOOR_Y - 50
            player.invensible = true
            blink()

        }

        if(jumpToOtherSide){
        	jumpToOtherSide = false
        	if(currentSpeed>0){
	        	
	        	currentSpeed = -currentSpeed
	            player.scale.setTo(-player.scale.x,player.scale.y)
	            jump()
	        }
	        else{
	        	currentSpeed = -currentSpeed
	            player.scale.setTo(-player.scale.x,player.scale.y)
	        }
        }

        if(inHit && currentSpeed!=0){
        	currentSpeed = 0
        }

        if(stopByHouse){
        	lastFrameStopHouse = true
        	if(currentSpeed!=0){
        		lastSpeed = currentSpeed
        	}
        	currentSpeed = 0
        	stopByHouse = false
        }
        else if(lastFrameStopHouse){
        	currentSpeed = lastSpeed
        	stopByHouse = false
        	lastFrameStopHouse = false
        }




        if(lastObject!=null){
            if(lastObject.x <= game.world.width+200){

                createLevel(lastObject.x+lastObject.width)
                //lastObject = null
            }
        }
    }


    function updateInput(){
        

        if(game.input.activePointer.isDown){
            if(canTouch){
                if(tapPosition==null){
                    tapPosition = {x:game.input.activePointer.x,y:game.input.activePointer.y}
                    startTapTime = game.time.now
                }
                else if(startTapTime + TIME_LONG_TAP < game.time.now){
                	tapPosition = null
                	canTouch = false
                	shield()
                }
                else{
                    var deltaX = game.input.activePointer.x - tapPosition.x

                    if(deltaX > SWIPE_MAGNITUD){
                        //Barrer o girar
                        tapPosition = null
                        canTouch = false
                        swipeRigth()
                    }
                    else if(deltaX < -SWIPE_MAGNITUD){
                    	tapPosition = null
                        canTouch = false
                    	swipeLeft()
                    }
                }
            }
        }
        else{
            canTouch = true
            if(tapPosition != null){
                jump()
            }
            //console.log("disable shield")
            if(player.shield.visible){
            	//console.log("disable shield")
            	currentSpeed = lastSpeed
            	player.invensible = false
            	player.shield.visible = false
            	player.spine.setAnimationByName(0,"run",true)
            }

            tapPosition = null
        }
    }

    function shield(){
    	//console.log("enable shield")
    	player.shield.visible = true
    	player.invensible = true
    	if(currentSpeed!=0){
    		lastSpeed = currentSpeed
    	}
    	currentSpeed = 0
    	if(!inHit){
    		player.spine.setAnimationByName(0,"idle",true)
    	}
    }

    function jump(){
    	
	    if(inHit){
            return
        }
	    

        //if(player.)

        if(player.numberjumps<2){
            //player.body.allowGravity = true
            player.numberjumps ++
            player.body.velocity.y =-JUMP_VELOCITY
            if(player.numberjumps ==1){
                player.spine.setAnimationByName(0,"jump",true)
            }
            else{
                player.spine.setAnimationByName(0,"fly",true)
            }
            
        }

        if(!player.body.allowGravity){
        	player.body.allowGravity = true
        }
        
    }

    function swipeRigth(){
        //console.log("swipe Right")
        moreVelocity = true

        if(currentSpeed <0){
        	currentSpeed = -currentSpeed
        	player.scale.setTo(-player.scale.x,player.scale.y)
        }

        if(!inHit){
        	player.spine.setAnimationByName(0,"fly",true)
        	player.body.allowGravity = true
        }
        setTimeout(function(){
        	moreVelocity = false
        	//if()
        	player.body.allowGravity = true
        	if(player.numberjumps == 0){
        		player.spine.setAnimationByName(0,"run",true)
        	}
        },3000)

    }

    function swipeLeft(){
        //console.log("swipe Left")
        jumpToOtherSide = true
    }

    function hitSprite (sprite1, sprite2) {

        if((player.y - player.height/2)< (sprite2.y-sprite2.height/3) ){
        	if(sprite2.scale.x>=0.7 && sprite2.scale.y>=0.7&& sprite2.alpha ==1 && player.numberjumps>=0 && player.body.velocity.y >=0){
	            player.onFloor = true
	            if(currentSpeed<0){
	            	jumpToOtherSide = true
	            }
	            player.body.velocity.y = 0
	            //player.body.allowGravity = false
	            if(sprite2.objectType == OBJECT_TYPE.ENEMY_WATER_STATIC){
	            	player.y = sprite2.y - player.height/2 - sprite2.height/2
	            }
	            else if(sprite2.objectType == OBJECT_TYPE.ENEMY_PUNCH_STATIC){
	            	player.y = sprite2.y - player.height/2 - sprite2.height/2
	            }
	            else if(sprite2.objectType == OBJECT_TYPE.PLATFORM_NOTE){
	            	player.y = sprite2.y - player.height/2 + 20
	            }
	            else if(sprite2.objectType == OBJECT_TYPE.HOUSE){
	            	player.y = sprite2.y - player.height/2 - sprite2.height/2
	            }
	            else{
	            	player.y = sprite2.y - player.height/2
	            }

	            if(player.numberjumps!=0 && !inHit && !player.shield.visible){
	                if(currentSpeed==0){
	                    player.spine.setAnimationByName(0,"idle",true)
	                }
	                else{
	                    player.spine.setAnimationByName(0,"run",true)
	                }
	            }
	            player.numberjumps = 0
	        }

        }
        
        else if(sprite2.objectType == OBJECT_TYPE.HOUSE ){

            stopByHouse = true
            if(player.body.velocity.y >=0){
            	player.spine.setAnimationByName(0,"idle",true)
            }

        }
        else if(sprite2.objectType == OBJECT_TYPE.PLATFORM_SPECIAL){

        	jumpToOtherSide = true
        }

    }

    function hitEnemy(sprite1, sprite2){
    	if(!player.invensible){
	        sprite2.visible = false
	        sprite2.x = -1000
	        player.invensible = true
            var anim = player.spine.setAnimationByName(0,"hit",false)
            inHit = true
            if(currentSpeed!=0){
	            lastSpeed = currentSpeed
	        }
            //currentSpeed = 0
            missPoint()
            anim.onComplete = function(){
            	inHit = false
                if(lives>0){
                	//console.log("blink")
                	if(!player.shield.visible){
                    	currentSpeed = lastSpeed
                	}

                    if(player.shield.visible){
                    	player.spine.setAnimationByName(0,"idle",true)
                    }
                    else if(moreVelocity){
                    	player.spine.setAnimationByName(0,"fly",true)
                    }
                    else{
                    	player.spine.setAnimationByName(0,"run",true)
                    }
        	        blink()
                }
            }
	    }
	    else{
	    	if(player.shield.visible){
	    		sprite2.visible = false

	    		if(sprite2.objectType == OBJECT_TYPE.ENEMY_PUNCH){
	    			sprite2.currentDelta = 0
	    			sprite2.direction = 1
	    			sprite2.parentObject.timeWait = game.time.now + DELTA_TIME_PUNCH
	    		}
	    		else if(sprite2.parentObject != null){
	    			sprite2.parentObject.state = HYDRANT_STATE.INIT
                    sprite2.parentObject.timeWait= game.time.now + DELTA_TIME_SHOOT
                    for(var j=0; j < 4; j++){
                        sprite2.parentObject.water1[j].visible = false
                        sprite2.parentObject.water2[j].visible = false
                        sprite2.parentObject.water1[j].scale.setTo(0)
                        sprite2.parentObject.water2[j].scale.setTo(0)
                        sprite2.parentObject.water1[j].direction = 1
                        sprite2.parentObject.water2[j].direction = 1
                    }
	    		}
	    	}
	    }
    }

    function hitCoin(sprite1, sprite2){

        sprite2.visible = false
        sprite2.x = -1000
        if(sprite2.objectType == OBJECT_TYPE.COIN){
        	addPoint(1,{x:game.world.width-80,y:80})
        }
        else if(sprite2.objectType == OBJECT_TYPE.CATSUP){
        	addPoint(2,{x:game.world.width-80,y:80})
        }
    }

    function hitTrampolin(sprite1, sprite2){
    	player.numberjumps =1
    	player.body.velocity.y =-JUMP_TRAMPOLIN
    }


    function blink(){

        if(currentSpeed==0){
            player.alpha = 1
            return
        }

        if(player.alpha ==1){
            player.alpha = 0
        }
        else{
            player.blink ++
            player.alpha = 1
            if(player.blink>=BLINK_TIMES){
            	if(!player.shield.visible){
            		player.invensible = false
            	}

                player.blink = 0

                return
            }
        }
        setTimeout(blink,TIME_BLINK)
    }


    function getBird(x){
        for(var i =0; i < backgroundGroup.length; i++){
            if(!backgroundGroup.children[i].visible && backgroundGroup.children[i].objectType == OBJECT_TYPE.ENEMY_BIRD){
                var bird = backgroundGroup.children[i]
                bird.visible = true
                bird.x = x
                bird.y = 150
                bird.dropObject.visible = true
                bird.dropObject.x = x
                bird.dropObject.y = bird.y + DELTA_BIRD_DROP
                bird.dropX = (currentSpeed/FALLING_SPEED)*((game.world.height - 350)-bird.y)
                bird.haveDrop = false
                return
            }
        }

        var bird = game.add.graphics()
        bird.x = x
        bird.y = 150
        /*bird.beginFill(0xff0000)
        bird.drawRect(-50,-50,100,100)
        bird.endFill()*/
        backgroundGroup.add(bird)

        var spine = game.add.spine(0,25,"emilio")
        spine.setSkinByName("normal")
        spine.scale.setTo(0.7)
        spine.setAnimationByName(0,"idle",true)
        bird.addChild(spine)

        var dropObject = backgroundGroup.create(x,150+DELTA_BIRD_DROP,"atlas.game","globo1")
        dropObject.anchor.setTo(0.5)

        game.physics.arcade.enable(dropObject)
        dropObject.body.allowGravity = false
        dropObject.timeChangeImage = game.time.now+DELTA_BALLON_CHANGE
        dropObject.indexImage = 1
        //dropObject.body.offset.x = -50
        //dropObject.body.offset.y = -50

        bird.objectType = OBJECT_TYPE.ENEMY_BIRD
        dropObject.objectType = OBJECT_TYPE.ENEMY_FALLING

        bird.dropObject = dropObject
        bird.initY = bird.y

        bird.dropX = (currentSpeed/FALLING_SPEED)*((game.world.height - 250)-bird.y)
        bird.haveDrop = false

    }

    function getCanon(x,y){
    	y = y-50
        for(var i =0; i< backgroundGroup.length.length; i++){
            if(!backgroundGroup.children[i].visible && backgroundGroup.children[i].objectType == OBJECT_TYPE.ENEMY_ROCKET){
                var rocket = backgroundGroup.children[i]
                rocket.visible = true
                rocket.x = x
                rocket.y = y
                rocket.timeWait = game.time.now + DELTA_TIME_SHOOT
                return
            }

        }

        var rocket = backgroundGroup.create(x,y,"atlas.game","lanzador")
        rocket.timeWait = game.time.now + DELTA_TIME_SHOOT
        rocket.objectType = OBJECT_TYPE.ENEMY_ROCKET
        game.physics.arcade.enable(rocket)
        rocket.body.allowGravity = false
    }

    function getBullet(x,y){
        for(var i =0; i< backgroundGroup.length.length; i++){
            if(!backgroundGroup.children[i].visible && backgroundGroup.children[i].objectType == OBJECT_TYPE.ENEMY_BULLET){
                var bullet = backgroundGroup.children[i]
                bullet.visible = true
                bullet.x = x
                bullet.y = y
                return
            }
        }

        var bullet = backgroundGroup.create(x,y,"atlas.game","tomate")
        bullet.objectType = OBJECT_TYPE.ENEMY_BULLET
        game.physics.arcade.enable(bullet)
        bullet.body.allowGravity = false
        bullet.velocityY = -BULLET_SPEED_Y

    }

    function getHidrante(x,y){
    	y += Y_PLATFORM_HEIGTH/2 - 10
        for(var i =0; i< backgroundGroup.length.length; i++){
            if(!backgroundGroup.children[i].visible && backgroundGroup.children[i].objectType == OBJECT_TYPE.ENEMY_WATER_STATIC){
                var hydrant = backgroundGroup.children[i]
                hydrant.visible = true
                hydrant.x = x
                hydrant.y = y
                for(var j=0; j<4; j++ ){
                    hydrant.water1[j].visible = false
                    hydrant.water2[j].visible = false
                }
                hydrant.timeWait = game.time.now + DELTA_TIME_WATER
                return
            }
        }

        var hydrant = backgroundGroup.create(x,y,"atlas.game","hidrante")
     	hydrant.anchor.setTo(0.5)
     	hydrant.scale.setTo(0.8)
        hydrant.objectType = OBJECT_TYPE.ENEMY_WATER_STATIC
        game.physics.arcade.enable(hydrant)
        hydrant.state = HYDRANT_STATE.INIT

        hydrant.body.allowGravity = false
        hydrant.water1 = []
        for(var i =1; i<=4; i++ ){
            var h = backgroundGroup.create(hydrant.x + hydrant.width/2,y,"atlas.game","chorro"+i)
            h.anchor.setTo(0,0.5)
            h.offset_X = hydrant.width/2
            h.scale.setTo(0,0)

            if(i == 2){
                h.offset_X+=26*0.5
            }
            else if(i == 3){
                h.offset_X+=(26+57)*0.5
            }
            else if(i == 4){
                h.offset_X+=(26+57+63)*0.5
            }
            h.direction = 1
            h.objectType = OBJECT_TYPE.ENEMY_WATER
            game.physics.arcade.enable(h)
            h.body.allowGravity = false
            h.visible = false
            hydrant.water1.push(h)
            h.parentObject = hydrant
        }

        hydrant.water2 = []
        for(var i =1; i<=4; i++ ){
            var h = backgroundGroup.create(hydrant.x + hydrant.width/2,y,"atlas.game","chorro"+i)
            h.anchor.setTo(0,0.5)
            h.offset_X = -hydrant.width/2
            h.scale.setTo(0,0)

            if(i == 2){
                h.offset_X-=(26)*0.5
            }
            else if(i == 3){
                h.offset_X-=(26+57)*0.5
            }
            else if(i == 4){
                h.offset_X-=(26+57+63)*0.5
            }
            h.direction = 1
            h.objectType = OBJECT_TYPE.ENEMY_WATER
            game.physics.arcade.enable(h)
            h.body.allowGravity = false
            h.visible = false
            hydrant.water2.push(h)
            h.parentObject = hydrant
        }

        hydrant.timeWait = game.time.now + DELTA_TIME_WATER
    }

    
    function getCoin(_x,_y){
    	_y = _y+Y_PLATFORM_HEIGTH*0.1
        for(var i =0; i < backgroundGroup.length; i++){
            if(!backgroundGroup.children[i].visible && backgroundGroup.children[i].objectType == OBJECT_TYPE.COIN){
                var coin = backgroundGroup.children[i]
                coin.visible = true
                coin.x = _x
                coin.y = _y
                return
            }
        }

        var coin = backgroundGroup.create(_x,_y,"atlas.game","coin")
        coin.anchor.setTo(0.5)
        coin.objectType = OBJECT_TYPE.COIN
        game.physics.arcade.enable(coin)
        coin.body.allowGravity = false
    }

    function getCatsup(_x,_y){
        for(var i =0; i < backgroundGroup.length; i++){
            if(!backgroundGroup.children[i].visible && backgroundGroup.children[i].objectType == OBJECT_TYPE.CATSUP){
                var coin = backgroundGroup.children[i]
                coin.visible = true
                coin.x = _x
                coin.y = _y
                return
            }
        }

        var coin = backgroundGroup.create(_x,_y,"atlas.game","catsup")
        coin.anchor.setTo(0.5)
        coin.scale.setTo(0.7)
        coin.objectType = OBJECT_TYPE.CATSUP
        game.physics.arcade.enable(coin)
        coin.body.allowGravity = false
    }


    function getBirdHouse(_x,_y){
    	_y += Y_PLATFORM_HEIGTH-50
        for(var i =0; i< backgroundGroup.length.length; i++){
            if(!backgroundGroup.children[i].visible && backgroundGroup.children[i].objectType == OBJECT_TYPE.ENEMY_PUNCH_STATIC){
                var punch = backgroundGroup.children[i]
                punch.visible = true
                punch.x = _x
                punch.y = _y
                punch.timeWait = game.time.now + DELTA_TIME_PUNCH
                return
            }
        }

        var punch = backgroundGroup.create(_x,_y,"atlas.game","birdHouse")
        punch.anchor.setTo(0.5,0.5)
        punch.objectType = OBJECT_TYPE.ENEMY_PUNCH_STATIC
        game.physics.arcade.enable(punch)
        punch.body.allowGravity = false
        punch.timeWait = game.time.now + DELTA_TIME_PUNCH

        var mask = game.add.graphics()
        mask.x = -110
        mask.y = -30
        mask.beginFill(0xff0000)
        mask.drawRect(0,0,100,50)
        mask.endFill()
        punch.addChild(mask)

        punch.hitObject = backgroundGroup.create(_x-20,_y-5,"atlas.game","punchResort")
        punch.hitObject.anchor.setTo(0,0.5)
        punch.hitObject.visible = false
        game.physics.arcade.enable(punch.hitObject)
        punch.hitObject.body.allowGravity = false
        punch.hitObject.body.setSize(50,50,0,0)
        punch.hitObject.objectType = OBJECT_TYPE.ENEMY_PUNCH
        punch.hitObject.currentDelta = 0
        punch.hitObject.direction = 1
        punch.hitObject.parentObject = punch
        punch.hitObject.mask = mask

    }

    function getBalla(_x,_y){
    	_y += Y_PLATFORM_HEIGTH - 60
        for(var i =0; i< backgroundGroup.length.length; i++){
            if(!backgroundGroup.children[i].visible && backgroundGroup.children[i].objectType == OBJECT_TYPE.ENEMY_BALLA){
                var balla = backgroundGroup.children[i]
                balla.visible = true
                balla.x = _x
                balla.y = _y
                //balla.available = true
                return
            }
        }

        var balla = backgroundGroup.create(_x,_y,"atlas.game","balla")
        balla.anchor.setTo(0.5,0.5)
        balla.objectType = OBJECT_TYPE.ENEMY_BALLA
        game.physics.arcade.enable(balla)
        balla.body.allowGravity = false
        balla.body.setSize(50,100,50,0)
        //balla.available = true
    }

    function getWater(_x){

        //hay que evaluar si existe una cerca o un arbusto sobre el agua
        var found = false
        for(var i =0; i < grassGroup.length; i++){
            var grass = grassGroup.children[i]
            //console.log(grass.x,_x)
            if(grass.x>=_x){
                grass.visible = false
                if(!found){	
	                var d  = game.rnd.integerInRange(0,DISTANCE_MAX_GRASS) + _x + 512
	                lastGrass = getGrass(d)
	            }
	            found = true
            }
        }
        if(!found){
        	var d  = game.rnd.integerInRange(0,DISTANCE_MAX_GRASS) + _x + 512
	        lastGrass = getGrass(d)
        }


        for(var i =0; i < fenceGroup.length; i++){
            var fence = fenceGroup.children[i]
            if(fence.x +(fence.width/2) +(fence.width*(NUM_FENCES-1)) > _x && fence.x -(fence.width/2)<_x+512){
                fence.visible = false
                
                var d  = game.rnd.integerInRange(0,DISTANCE_MAX_FENCE) + _x + 512
                lastFence = getFence(d)
                
            }
        }




        //tiene que retonar el objeto
        for(var i =0; i < backgroundGroup.length; i++){
            if(!backgroundGroup.children[i].visible && backgroundGroup.children[i].objectType == OBJECT_TYPE.WATER_PLATFORM){
                var water = backgroundGroup.children[i]
                water.visible = true
                water.x = _x
                water.y = FLOOR_Y
                return water
            }
        }

        var water = game.add.tileSprite(_x,FLOOR_Y,512,256,"atlas.game","agua_back")
        //water.anchor.setTo(0,0)
        water.objectType = OBJECT_TYPE.WATER_PLATFORM
        //game.physics.arcade.enable(water)
        //water.body.allowGravity = false
        backgroundGroup.add(water)

        var waterFront = game.add.tileSprite(0,0,512,256,"atlas.game","agua_front")
        water.addChild(waterFront)
        water.front = waterFront
        water.wood = []
        for(var i =0; i < 2; i ++){
            var wood = woodGroup.create(_x,FLOOR_Y+10,"atlas.game","tronco")
           
            wood.anchor.setTo(0)
            wood.scale.setTo(1,0)
            game.physics.arcade.enable(wood)
            wood.objectType == OBJECT_TYPE.PLATFORM
            wood.body.allowGravity = false
            wood.state = WOODS_STATE.INIT
            water.wood.push(wood)
            //wood.parentObject = water
        }

        water.wood[1].scale.setTo(1)
        water.wood[1].alpha = 0
        water.wood[1].y =FLOOR_Y+120
        water.wood[1].state = WOODS_STATE.END

        /*water.wood[2].scale.setTo(0)
        water.wood[2].alpha = 0
        water.wood[2].y =FLOOR_Y+55
        water.wood[2].state = WOODS_STATE.ASCENDING

        water.wood[3].scale.setTo(1)
        water.wood[3].alpha = 1
        water.wood[3].y =FLOOR_Y+45
        water.wood[3].state = WOODS_STATE.FALLING*/

        return water
    }

    function getSnoopyHouse(_x,_y){
    	_y += Y_PLATFORM_HEIGTH - 70
        for(var i =0; i< backgroundGroup.length.length; i++){
            if(!backgroundGroup.children[i].visible && backgroundGroup.children[i].objectType == OBJECT_TYPE.HOUSE){
                var house = backgroundGroup.children[i]
                house.visible = true
                house.x = _x
                house.y = _y
                //balla.available = true
                return
            }
        }

        var house = backgroundGroup.create(_x,_y,"atlas.game","house")
        house.anchor.setTo(0.5,0.5)
        house.objectType = OBJECT_TYPE.HOUSE
        game.physics.arcade.enable(house)
        house.body.allowGravity = false
    }

    function getTrampolin(_x,_y){
    	_y += Y_PLATFORM_HEIGTH - 30
        for(var i =0; i< backgroundGroup.length.length; i++){
            if(!backgroundGroup.children[i].visible && backgroundGroup.children[i].objectType == OBJECT_TYPE.TRAMPOLIN){
                var trampolin = backgroundGroup.children[i]
                trampolin.visible = true
                trampolin.x = _x
                trampolin.y = _y
                //balla.available = true
                return
            }
        }

        var trampolin = backgroundGroup.create(_x,_y,"atlas.game","trampolin")
        trampolin.anchor.setTo(0.5,0.5)
        trampolin.objectType = OBJECT_TYPE.TRAMPOLIN
        game.physics.arcade.enable(trampolin)
        trampolin.body.allowGravity = false
        //trampolin.body.setSize(50,100,50,0)
        //balla.available = true
    }

    function getFloor(_x, type){
        //tiene que retonar el objeto
        var textureKey = "pasto_central"
        if(type == 1){
            textureKey = "pasto_derecho"
        }else if(type == -1){
            textureKey = "pasto_izquierdo"
        }
        
        for(var i =0; i < backgroundGroup.length; i++){
            if(!backgroundGroup.children[i].visible && backgroundGroup.children[i].objectType == OBJECT_TYPE.FLOOR){
                var piso = backgroundGroup.children[i]
                piso.visible = true
                piso.x = _x
                piso.y = FLOOR_Y
                piso.loadTexture("atlas.game",textureKey)
                return piso
            }
        }

        var piso = backgroundGroup.create(_x,FLOOR_Y,"atlas.game",textureKey)
        piso.anchor.setTo(0,0)
        piso.objectType = OBJECT_TYPE.FLOOR
        game.physics.arcade.enable(piso)
        piso.body.allowGravity = false
        return piso
    }

    function getSpecialFloor(_x, type){
    	var textureKey = "pasto_central"
        if(type == 1){
            textureKey = "pasto_derecho"
        }else if(type == -1){
            textureKey = "pasto_izquierdo"
        }

        
        for(var i =0; i < backgroundGroup.length; i++){
            if(!backgroundGroup.children[i].visible && backgroundGroup.children[i].objectType == OBJECT_TYPE.PLATFORM_SPECIAL){
                var piso = backgroundGroup.children[i]
                piso.visible = true
                piso.x = _x
                piso.y = FLOOR_Y -(2*Y_PLATFORM_HEIGTH)
                piso.loadTexture("atlas.game",textureKey)
                backgroundGroup.sendToBack(piso)
                return piso
            }
        }

        var piso = backgroundGroup.create(_x,FLOOR_Y-(2*Y_PLATFORM_HEIGTH),"atlas.game",textureKey)
        piso.anchor.setTo(0,0)
        piso.objectType = OBJECT_TYPE.PLATFORM_SPECIAL
        game.physics.arcade.enable(piso)
        piso.body.allowGravity = false
        piso.body.setSize(128,400,0,0)

        var tierra = game.add.tileSprite(0,128,128,300,"atlas.game","tierra")
        //var tierra = game.add.sprite(0,150,"atlas.game","tierra")
        piso.addChild(tierra)
        backgroundGroup.sendToBack(piso)
        return piso
    }


    function getPlatform(_x,_y){
    	for(var i =0; i < backgroundGroup.length; i++){
            if(!backgroundGroup.children[i].visible && backgroundGroup.children[i].objectType == OBJECT_TYPE.PLATFORM){
                var platform = backgroundGroup.children[i]
                platform.visible = true
                platform.x = _x
                platform.y = _y
                platform.loadTexture("atlas.game","plataforma")
                return
            }
        }

        var platform = backgroundGroup.create(_x,_y,"atlas.game","plataforma")
        platform.anchor.setTo(0,0)
        platform.objectType = OBJECT_TYPE.PLATFORM
        game.physics.arcade.enable(platform)
        platform.body.allowGravity = false
    }

    function getPlatformNote(_x,_y){
    	for(var i =0; i < backgroundGroup.length; i++){
            if(!backgroundGroup.children[i].visible && backgroundGroup.children[i].objectType == OBJECT_TYPE.PLATFORM_NOTE){
                var platform = backgroundGroup.children[i]
                platform.visible = true
                platform.x = _x
                platform.y = _y
                return
            }
        }

        var platform = backgroundGroup.create(_x,_y,"atlas.game","plataforma_sound")
        platform.anchor.setTo(0,0)
        platform.objectType = OBJECT_TYPE.PLATFORM_NOTE
        game.physics.arcade.enable(platform)
        platform.body.allowGravity = false
        platform.body.setSize(270,50,0,20)

    }

    
    function decideLevel(){

        var temp = game.rnd.integerInRange(1,11)
        if(randomLevel == temp){
        	randomLevel = game.rnd.integerInRange(1,11)
        }
        else{
        	randomLevel = temp
        }

        //randomLevel = 5

        switch(randomLevel){
        	case 1:
            currentLevel = level1
            break
            case 2:
            currentLevel = level2
            break
            case 3:
            currentLevel = level3
            break
            case 4:
            currentLevel = level4
            break
            case 5:
            currentLevel = level5
            break
            case 6:
            currentLevel = level6
            break
            case 7:
            currentLevel = level7
            break
            case 8:
            currentLevel = level8
            break
            case 9:
            currentLevel = level9
            break
            case 10:
            currentLevel = level10
            break
            case 11:
            var r = game.rnd.integerInRange(1,10)
            if(r < 3){
            	currentLevel = levelSpecial1
            }
            else{
            	randomLevel = game.rnd.integerInRange(1,10)
            	switch(randomLevel){
		        	case 1:
		            currentLevel = level1
		            break
		            case 2:
		            currentLevel = level2
		            break
		            case 3:
		            currentLevel = level3
		            break
		            case 4:
		            currentLevel = level4
		            break
		            case 5:
		            currentLevel = level5
		            break
		            case 6:
		            currentLevel = level6
		            break
		            case 7:
		            currentLevel = level7
		            break
		            case 8:
		            currentLevel = level8
		            break
		            case 9:
		            currentLevel = level9
		            break
		            case 10:
		            currentLevel = level10
		            break
		        }
            }
            break
        }
    }

    function createLevel(_x){
        var levelY
        //getBird(_x)
        lastObject = null

        //Se evaluan cada uno de los niveles
        //piso
        if(currentLevel[7][levelIndex] == ''){
            lastObject = getFloor(_x,0)
        }
        //water
        else if(currentLevel[7][levelIndex] == 'w'){
            lastObject = getWater(_x)
        }
        else if(currentLevel[7][levelIndex] == '>'){
            lastObject = getFloor(_x,1)
        }
        else if(currentLevel[7][levelIndex] == '<'){
            lastObject = getFloor(_x,-1)
            nextPlatfromsWater = lastObject
        }
        //piso
        //Obstaculos
        levelY = FLOOR_Y - Y_PLATFORM_HEIGTH
        //moneda
        if(currentLevel[6][levelIndex] == 'm'){
            getCoin(_x+(lastObject.width/2),levelY)
        }
        //catsup
        else if(currentLevel[6][levelIndex] == 'k'){
            getCatsup(_x+(lastObject.width/2),levelY)
        }
        //hidrante
        else if(currentLevel[6][levelIndex] == 'h'){
            getHidrante(_x+(lastObject.width/2),levelY)
        }
        //birdHouse
        else if(currentLevel[6][levelIndex] == 'b'){
            getBirdHouse(_x,levelY)
        }
        //tomateCanon
        else if(currentLevel[6][levelIndex] == "tc"){
            getCanon(_x,levelY)
        }
        //balla
        else if(currentLevel[6][levelIndex] == "bl"){
            getBalla(_x,levelY)
        }
        //snoopyHouse
        else if(currentLevel[6][levelIndex] == 's'){
            getSnoopyHouse(_x+(lastObject.width/2),levelY)
        }
        //trampolin
        else if(currentLevel[6][levelIndex] == 't'){
            getTrampolin(_x+(lastObject.width/2),levelY)
        }
        else if(currentLevel[6][levelIndex] == 'l'){
            getPlatform(_x,levelY)
        }
        //Obstaculos

        //plataformas 1
        levelY = FLOOR_Y - (Y_PLATFORM_HEIGTH*2)
        //moneda
        if(currentLevel[5][levelIndex] == 'm'){
            getCoin(_x+(lastObject.width/2),levelY)
        }
        //catsup
        else if(currentLevel[5][levelIndex] == 'k'){
            getCatsup(_x+(lastObject.width/2),levelY)
        }
        //platform
        else if(currentLevel[5][levelIndex] == 'l'){
            getPlatform(_x,levelY)
        }
        //platform note
        else if(currentLevel[5][levelIndex] == 'n'){
            getPlatformNote(_x,levelY)
        }
        //big Platform
        else if(currentLevel[5][levelIndex] == "bP"){
            getBigPlatform(_x)
        }
        else if(currentLevel[5][levelIndex] == 'p'){
        	getSpecialFloor(_x,0)
        }
        else if(currentLevel[5][levelIndex] == "<p"){
        	getSpecialFloor(_x,1)
        }
        else if(currentLevel[5][levelIndex] == ">p"){
        	getSpecialFloor(_x,-1)
        }
        else if(currentLevel[5][levelIndex] == 'h'){
            getHidrante(_x+(lastObject.width/2),levelY)
        }
        //birdHouse
        else if(currentLevel[5][levelIndex] == 'b'){
            getBirdHouse(_x,levelY)
        }
        //tomateCanon
        else if(currentLevel[5][levelIndex] == "tc"){
            getCanon(_x,levelY)
        }
        else if(currentLevel[5][levelIndex] == 's'){
            getSnoopyHouse(_x+(lastObject.width/2),levelY)
        }

        //plataformas 1

        //plataformas Above 1
        levelY = FLOOR_Y - (Y_PLATFORM_HEIGTH*3)
        //moneda
        if(currentLevel[4][levelIndex] == 'm'){
            getCoin(_x+(lastObject.width/2),levelY)
        }
        //catsup
        else if(currentLevel[4][levelIndex] == 'k'){
            getCatsup(_x+(lastObject.width/2),levelY)
        } 
        //platform
        else if(currentLevel[4][levelIndex] == 'l'){
            getPlatform(_x,levelY)
        }
        //platform note
        else if(currentLevel[4][levelIndex] == 'n'){
            getPlatformNote(_x,levelY)
        }
        else if(currentLevel[4][levelIndex] == 'h'){
            getHidrante(_x+(lastObject.width/2),levelY)
        }
        //birdHouse
        else if(currentLevel[4][levelIndex] == 'b'){
            getBirdHouse(_x,levelY)
        }
        //tomateCanon
        else if(currentLevel[4][levelIndex] == "tc"){
            getCanon(_x,levelY)
        }
        else if(currentLevel[4][levelIndex] == 's'){
            getSnoopyHouse(_x+(lastObject.width/2),levelY)
        }
        //plataformas Above 1

        //plataformas 2
        levelY = FLOOR_Y - (Y_PLATFORM_HEIGTH*4)
        //moneda
        if(currentLevel[3][levelIndex] == 'm'){
            getCoin(_x+(lastObject.width/2),levelY)
        }
        //catsup
        else if(currentLevel[3][levelIndex] == 'k'){
            getCatsup(_x+(lastObject.width/2),levelY)
        }
        //platform
        else if(currentLevel[3][levelIndex] == 'l'){
            getPlatform(_x,levelY)
        }
        //platform note
        else if(currentLevel[3][levelIndex] == 'n'){
            getPlatformNote(_x,levelY)
        }
        else if(currentLevel[3][levelIndex] == 'h'){
            getHidrante(_x+(lastObject.width/2),levelY)
        }
        //birdHouse
        else if(currentLevel[3][levelIndex] == 'b'){
            getBirdHouse(_x,levelY)
        }
        //tomateCanon
        else if(currentLevel[3][levelIndex] == "tc"){
            getCanon(_x,levelY)
        }
        else if(currentLevel[3][levelIndex] == 's'){
            getSnoopyHouse(_x+(lastObject.width/2),levelY)
        }
        //plataformas 2

        //plataformas Above 2
        levelY = FLOOR_Y - (Y_PLATFORM_HEIGTH*5)
        //moneda
        if(currentLevel[2][levelIndex] == 'm'){
            getCoin(_x+(lastObject.width/2),levelY)
        }
        //catsup
        else if(currentLevel[2][levelIndex] == 'k'){
            getCatsup(_x+(lastObject.width/2),levelY)
        }
        //platform
        else if(currentLevel[2][levelIndex] == 'l'){
            getPlatform(_x,levelY)
        }
        //platform note
        else if(currentLevel[2][levelIndex] == 'n'){
            getPlatformNote(_x,levelY)
        }
        else if(currentLevel[2][levelIndex] == 'h'){
            getHidrante(_x+(lastObject.width/2),levelY)
        }
        //birdHouse
        else if(currentLevel[2][levelIndex] == 'b'){
            getBirdHouse(_x,levelY)
        }
        //tomateCanon
        else if(currentLevel[2][levelIndex] == "tc"){
            getCanon(_x,levelY)
        }
        else if(currentLevel[2][levelIndex] == 's'){
            getSnoopyHouse(_x+(lastObject.width/2),levelY)
        }
        //plataformas Above 1

        levelY = FLOOR_Y - (Y_PLATFORM_HEIGTH*6)
        if(currentLevel[1][levelIndex] == 'm'){
            getCoin(_x+(lastObject.width/2),levelY)
        }
        //catsup
        else if(currentLevel[1][levelIndex] == 'k'){
            getCatsup(_x+(lastObject.width/2),levelY)
        }
        //platform
        else if(currentLevel[1][levelIndex] == 'l'){
            getPlatform(_x,levelY)
        }
        //platform note
        else if(currentLevel[1][levelIndex] == 'n'){
            getPlatformNote(_x,levelY)
        }
        else if(currentLevel[1][levelIndex] == 'h'){
            getHidrante(_x+(lastObject.width/2),levelY)
        }
        //birdHouse
        else if(currentLevel[1][levelIndex] == 'b'){
            getBirdHouse(_x,levelY)
        }
        //tomateCanon
        else if(currentLevel[1][levelIndex] == "tc"){
            getCanon(_x,levelY)
        }

        //volando
        levelY = FLOOR_Y - (Y_PLATFORM_HEIGTH*6)
        if(currentLevel[0][levelIndex] == 'm'){
            getCoin(_x+(lastObject.width/2),levelY)
        }
        //catsup
        else if(currentLevel[0][levelIndex] == 'k'){
            getCatsup(_x+(lastObject.width/2),levelY)
        }
        else if(currentLevel[0][levelIndex] == 'v'){
            getBird(_x)
        }

        //volando

        levelIndex++
        if(levelIndex >=  currentLevel[0].length){
        	levelIndex = 0
        	decideLevel()
        }

    }

    function createBackground(){

        var bmd = game.add.bitmapData(game.world.width, game.world.height)

        var y = 0;

        for (var i = 0; i < game.world.height/2; i++)
        {
            var c = Phaser.Color.interpolateColor(0x65a9f0, 0xbaefff, game.world.height, i);

            bmd.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c));
            y += 2;

        }

        var background = game.add.sprite(0, 0, bmd);
        sceneGroup.add(background)

        mountainGroup = game.add.group()
        sceneGroup.add(mountainGroup)

        currentDistanceMountain = game.rnd.integerInRange(0,DISTANCE_MAX_MOUNTAIN)
        lastMountain = getMountain(currentDistanceMountain)

        fenceGroup = game.add.group()
        sceneGroup.add(fenceGroup)

         var distance = game.rnd.integerInRange(0,DISTANCE_MAX_FENCE)
        lastFence = getFence(distance)

        grassGroup = game.add.group()
        sceneGroup.add(grassGroup)

        distance = game.rnd.integerInRange(0,DISTANCE_MAX_GRASS)
        lastGrass = getGrass(distance)

        cloudGroup = game.add.group()
        sceneGroup.add(cloudGroup)

        for(var i =0; i < 10; i++){
            var _x = game.rnd.integerInRange(0,game.world.width*2)
            var _y = game.rnd.integerInRange(0,game.world.centerY-100)
            var cloud = getCloud(_x,_y)
        }

        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        woodGroup = game.add.group()
        sceneGroup.add(woodGroup)

        lastObject = getFloor(-game.world.width,0)
        while(lastObject.x <= game.world.width+200){
        	lastObject = getFloor(lastObject.x + lastObject.width,0)
        }

        decideLevel()
    }

    function getMountain(_x){
        for(var i = 0; i < mountainGroup.length; i++){
            if(!mountainGroup.children[i].visible){
                var mountain = mountainGroup.children[i]
                mountain.visible = true
                mountain.land1.x = game.rnd.integerInRange(-150,-100)
                mountain.land2.x = game.rnd.integerInRange(100,150)
                mountain.x = _x
                return mountain
            }
        }

        var mountain = mountainGroup.create(_x,FLOOR_Y-50,"atlas.game","mountain")
        mountain.anchor.setTo(0.5,1)
        var landx = game.rnd.integerInRange(-150,-100)
        var land = sceneGroup.create(landx,100,"atlas.game","cerro_back")
        land.anchor.setTo(0.5,1)
        mountain.land1 = land
        mountain.addChild(land)
        var landx = game.rnd.integerInRange(100,150)
        land = sceneGroup.create(landx,100,"atlas.game","cerro_front")
        land.anchor.setTo(0.5,1)
        mountain.land2 = land
        mountain.addChild(land)
        return mountain
    }

    function getGrass(_x){
        for(var i = 0; i < grassGroup.length; i++){
            if(!grassGroup.children[i].visible){
                var grass = grassGroup.children[i]
                grass.visible = true
                grass.x = _x
                grass.loadTexture("atlas.game","arbusto_"+game.rnd.integerInRange(1,2))
                return grass
            }
        }

        var grass = grassGroup.create(_x,FLOOR_Y+10,"atlas.game","arbusto_"+game.rnd.integerInRange(1,2))
        grass.anchor.setTo(0.5,1)  
        return grass
    }

    function getFence(_x){
        for(var i = 0; i < fenceGroup.length; i++){
            if(!fenceGroup.children[i].visible){
                var fence = fenceGroup.children[i]
                fence.visible = true
                fence.x = _x
                return fence
            }
        }

        var fence = fenceGroup.create(_x,FLOOR_Y+20,"atlas.game","cerca")
        fence.anchor.setTo(0.5,1)  

        for(var i =0; i < NUM_FENCES-1; i++){
            var f = sceneGroup.create(i*104,0,"atlas.game","cerca")
            f.anchor.setTo(0.5,1)
            fence.addChild(f)
        }

        return fence
    }

    function getCloud(_x,_y){
        for(var i = 0; i < cloudGroup.length; i++){
            if(!cloudGroup.children[i].visible){
                var cloud = cloudGroup.children[i]
                cloud.visible = true
                cloud.x = _x
                cloud.y + _y
                cloud.loadTexture("atlas.game","cloud_"+game.rnd.integerInRange(1,7))
                cloud.vel = game.rnd.frac()*VEL_MAX_CLOUD
                return cloud
            }
        }

        var cloud = cloudGroup.create(_x,_y,"atlas.game","cloud_"+game.rnd.integerInRange(1,7))
        cloud.anchor.setTo(0.5,1)
        cloud.vel = game.rnd.frac()*VEL_MAX_CLOUD
        return cloud
    }


    

    function createPlayer(){

        player = game.add.graphics()
        
        //player.beginFill(0xffff00)
        player.drawRect(-15,-50,40,100)
        //player.endFill()

        player.x = INITAL_X
        player.y = game.world.height - 150
        sceneGroup.add(player)
        player.numberjumps = 0
        player.onFloor = false

        game.physics.arcade.enable(player)

        player.body.offset.x = -15
        player.body.offset.y = -50

        player.invensible = false
        player.blink = 0

        var playerSpine = game.add.spine(0,50,"snoopy")
        playerSpine.setSkinByName("normal")
        playerSpine.setAnimationByName(0,"idle",true)
        player.addChild(playerSpine)
        playerSpine.scale.setTo(0.5)
        player.spine = playerSpine

        var shield = game.add.sprite(0,0,"atlas.game","escudo")
        shield.anchor.setTo(0.5)
        shield.scale.setTo(0.7)
        player.addChild(shield)
        player.shield = shield
        shield.visible = false
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

    /*function createControls(){
    	var controlBack = game.add.tileSprite(0,game.world.height-256,game.world.width,256,"tablero")
    	sceneGroup.add(controlBack)

    	var control = sceneGroup.create(game.world.centerX,game.world.height,"atlas.game","tablero_botton")
    	control.anchor.setTo(0.5,1)

    	var button = sceneGroup.create(game.world.centerX,game.world.height - 100, "atlas.game","botton_off")
    	button.anchor.setTo(0.5)
    	button.inputEnabled = true

    	button.events.onInputDown.add(function(target){
    		target.loadTexture("atlas.game","botton_on")
    		jump()
    	},this)

    	button.events.onInputUp.add(function(target){
    		target.loadTexture("atlas.game","botton_off")
    	},this)
    }*/
    
    function create(){
    	
        sceneGroup = game.add.group()

        //game.camera.focusOnXY(game.world.centerX, game.world.centerY);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 650;

        initialize()

        createBackground()

        //if(!amazing.getMinigameId()){
			marioSong = game.add.audio('timberman')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.6)
			}, this);	
		//}

        game.onPause.add(function(){
			
			/*if(amazing.getMinigameId()){
				marioSong.pause()
			}*/

           
			
	        game.sound.mute = true
	    } , this);

	    game.onResume.add(function(){
			
			/*if(amazing.getMinigameId()){
				if(lives > 0){
					marioSong.play()
				}
			}
			*/
	        game.sound.mute = false
	    }, this);


        animateScene()

        loadSounds()

        createObjects()

        createPlayer()

        createPointsBar()
        createHearts()

        //createControls()

        var backMark = game.add.graphics()
        backMark.x = 0
        backMark.y = game.world.height-30
        backMark.beginFill(0x000000)
        backMark.drawRect(0,0,game.world.width,30)
        backMark.endFill()
        sceneGroup.add(backMark)
        backMark.alpha = 0.7

        var fontStyle = {font: "15px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "right"}
        var waterMark =  new Phaser.Text(sceneGroup.game, game.world.width-10, game.world.height-2, "©2018 PEANUTS WORLDWIDE LLC", fontStyle)
        waterMark.anchor.setTo(1,1)
        waterMark.alpha = 0.8
        sceneGroup.add(waterMark)

        var waterMark =  new Phaser.Text(sceneGroup.game, 10, game.world.height-2, "COME BIEN", fontStyle)
        waterMark.anchor.setTo(0,1)
        waterMark.alpha = 0.8
        sceneGroup.add(waterMark)
        
    }

    function render(){
        game.debug.body(player)
        for(var i=0; i < backgroundGroup.length; i++){
            game.debug.body(backgroundGroup.children[i])
        }


    }
    
    return {
        assets: assets,
        name: "snoopyEnBuscaDelSabor",
        create: create,
        preload: preload,
        update: update,
        //render:render
    }

}()



function lerp(a,b,t){
   return a + t * (b - a);
}
