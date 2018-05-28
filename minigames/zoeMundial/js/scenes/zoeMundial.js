var soundsPath = "../../shared/minigames/sounds/"
var zoeMundial = function(){

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/zoeMundial/atlas.json",
                image: "images/zoeMundial/atlas.png",
            },
        ],
        images: [
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
    
    var INITIAL_LIVES = 3
    var INITIAL_VELOCITY = 5;
    var DELTA_VELOCITY = 0.2;
    var END_VELOCITY = 5;
    var INIT_BOTTLE_Y = -100;
    var DELTA_WATER = 0.03;
    var DELTA_APPEAR_WATER = 7000;
    var DELTA_WATER_PLUS = 10
    var WATER_INITIAL_LIVE = 100
    var BOTTLE_VELOCITY = 10
    var BOTLLE_MAX_VELOCITY = 20
    var BOTTLE_DELTA_VELOCITY = 0.5
    var COLLISIONS_TO_BALLON = 6
    var LIVE_BARS = 9
    var DELTA_BALL_LEVEL = 2

    var skinTable
    
    var gameIndex = 27
    var gameId = 100004
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null


    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var player, playerMaterial, playerSpine
    var ballMaterial, ballGroup
    var worldMaterial

    var bottleGroup;
    var waterLive 
    var currentVelocityWater
    var timeAppearWater 
    var currentCollisions
    var currentLevel

    var ballColisionGroup, playerCollisionGroup

    var leftKey, rightKey

    var liveBars
    var tintArray = [0xd32929,0xe06420,0xe29e14,0xe8da2e,0xbad72a,0x82cc35,0x4ac03f,0x19aea8,0x00a5dd]
    var waterVelocity = BOTTLE_VELOCITY
    var waterTypes = [
    {names:["agua1","agua3","agua4","agua5","agua6","agua7","agua8","agua9","agua10","agua11","agua12"],plusValue:DELTA_WATER_PLUS,probability:0.9},
    {names:["agua2"],plusValue:DELTA_WATER_PLUS+50,probability:1}
    ]


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
        skinTable = []
        inTap = false
        currentX = 100
        waterLive = WATER_INITIAL_LIVE
        currentVelocityWater = INITIAL_VELOCITY
        currentCollisions = 0
        liveBars = []
        currentLevel = 0
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

        game.load.spine('playerSpine', "images/spines/player.json");
                
        if(amazing.getMinigameId()){
            marioSong = sound.setSong(soundsPath + 'songs/retrowave.mp3',0.3)
        }else{
            game.load.audio('arcadeSong', soundsPath + 'songs/retrowave.mp3');
        }


    }

    
    function stopGame(win){

        playerSpine.setAnimationByName(0,"lose",false)
        playerSpine.addAnimationByName(0,"lose_still",false)

        heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        gameActive = false

        
        if(amazing.getMinigameId()){
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


    function update(){
        updateWater()
        if(!gameActive){
            return
        }
        
        updatePlayer()

        updateBalls()

        
    }

    function updateBalls(){
        //for(var i = 0; i < )
        var visibleBalls = false
        for(var i =0; i < ballGroup.length; i++){
            var ball = ballGroup.children[i]
            if(!ball.visible){
            	continue
            }

            visibleBalls = true

            if(ball.body.y > game.world.height){

                missPoint()

                if(ballGroup.length <=1){
	                ball.body.y = -100
	                ball.body.x = game.rnd.integerInRange(100,game.world.width-100)
	                ball.body.velocity.y = 0
	                ball.body.velocity.x = 0
	            }
	            else{
	            	ball.body.velocity.y = 0
	                ball.body.velocity.x = 0
	            	ball.visible = false
	            }
            }
        }

        if(!visibleBalls){
            createBall()
        }
    }

    function updatePlayer(){
        if(game.input.activePointer.isDown){
            player.body.x = game.input.activePointer.x
            playerSpine.x = game.input.activePointer.x
        }
        else{
        	if(leftKey.isDown){
        		if(player.body.x > 100){
	        		player.body.x -= 10
	            	playerSpine.x -= 10
	            }
	        }
	        else if(rightKey.isDown){
	        	if(player.body.x < game.world.width - 100){
	        		player.body.x += 10
	            	playerSpine.x += 10
	            }
	        }
	    }

        var lastWaterLive = Math.floor(waterLive/10)

        waterLive -=DELTA_WATER

        var currentWaterLive = Math.floor(waterLive/10)
        if(lastWaterLive!=currentWaterLive){
        	modifyWaterLive(lastWaterLive)
        }

        if(waterLive < 0){
            stopGame()
        }
    }

    function modifyWaterLive(liveId){
    	for(var i = 0; i < liveBars.length; i++){
    		if(i < liveId-1){
    			liveBars[i].visible = true
    		}
    		else{
    			liveBars[i].visible = false
    		}
    	}
        
    }

    function updateWater(){

        if(timeAppearWater < game.time.now){
            timeAppearWater = game.time.now + DELTA_APPEAR_WATER
            createWater()
        }

        for(var i = 0; i < bottleGroup.length; i++){
            if(bottleGroup.children[i].visible){
                var bottle = bottleGroup.children[i]
                bottle.y += waterVelocity
                if(bottle.y > game.world.centerY && gameActive){
                    var col = checkOverlap(bottle,player)
                    if(col){
                        bottle.visible = false
                        takeWater(bottle.value)
                    }
                    else{
                        if(bottle.y > game.world.height+100){
                            bottle.visible = false
                        }
                    }
                }

                if(bottle.shine.visible){
                	bottle.shine.angle += 5
                }

            }
        }
    }

    function takeWater(value){
    	sound.play("pop")
        waterLive+=value
        if(waterLive>WATER_INITIAL_LIVE){
            waterLive = WATER_INITIAL_LIVE

        }

        if(waterVelocity < BOTLLE_MAX_VELOCITY){
        	waterVelocity += BOTTLE_DELTA_VELOCITY
        }
        var x = Math.floor(waterLive/10)
        modifyWaterLive(x+1)
    }

    function createBackground(){

    	var stadium = sceneGroup.create(game.world.centerX,0,"atlas.game","estadio")
    	stadium.anchor.setTo(0.5,0)
    	//stadium.scale.setTo(0.6)

    	var banners = game.add.tileSprite(0,game.world.height-350,game.world.width,134,"atlas.game","banners")
    	sceneGroup.add(banners)

    	var grass = sceneGroup.create(game.world.centerX,game.world.height,"atlas.game","cancha")
    	grass.anchor.setTo(0.5,1)

    	var people = game.add.tileSprite(0,180,game.world.width,126,"atlas.game","aficionados")
    	sceneGroup.add(people)

    	people = game.add.tileSprite(0,450,game.world.width,126,"atlas.game","aficionados")
    	sceneGroup.add(people)

    	

    	var barandal = game.add.tileSprite(0,game.world.height-380,game.world.width,32,"atlas.game","barandal")
    	sceneGroup.add(barandal)

    	var backLive = sceneGroup.create(game.world.width-10,game.world.centerY-200,"atlas.game","barra_energia")
    	backLive.anchor.setTo(1,0.5)

    	var initY = backLive.y + backLive.height/2 -40
    	var deltaLiveBar = -28
    	for(var i =0; i < LIVE_BARS; i++){
    		var group = game.add.group()
    		group.x = backLive.x - backLive.width +7
    		group.y = initY + (deltaLiveBar*i)
    		sceneGroup.add(group)
    		var bar = group.create(0,0,"atlas.game","energia")
    		bar.tint = tintArray[i]

    		var shine = group.create(0,0,"atlas.game","energia_brillo")

    		liveBars.push(group)
    	}

    	var luz1 = sceneGroup.create(game.world.width+30,-100,"atlas.game","Luz")
    	luz1.anchor.setTo(1,0)
    	luz1.angle = -10
    	//luz.scale.setTo(1.2)

    	var tween1 = game.add.tween(luz1).to({angle:20},1500,Phaser.Easing.linear,true)
    	tween1.yoyo(true,0)
    	tween1.loop(true)
    	//tween1.onComplete.add(, this);

    	var luz2 = sceneGroup.create(-30,-100,"atlas.game","Luz")
    	luz2.anchor.setTo(1,0)
    	luz2.scale.setTo(-1,1)
    	luz2.angle = 10

    	var tween2 =game.add.tween(luz2).to({angle:-20},1500,Phaser.Easing.linear,true).yoyo(true)
    	tween2.yoyo(true,0)
    	tween2.loop(true)


    }

    function collideBody(body, bodyBody, shapeA, shapeB, equation){
    	if(lives<=0){
    		return
    	}

        var x = player.body.x - body.x
        var y = player.body.y - body.y

        var d = Math.sqrt(Math.pow(x,2)+Math.pow(y,2))
        var r = d/2

        var cos = x/d
        var sin = y/d

        var x2 = r*cos
        var y2 = r*sin
        body.velocity.y = 0
        body.velocity.x = 0
        body.applyImpulse([35*cos,40],x2,y2)
        //body.applyImpulse([35*cos,40],0,0)

        currentCollisions ++
        addPoint(1,{x:game.world.width-100,y:50})
        sound.play("punch")

        if(currentCollisions > (COLLISIONS_TO_BALLON+(currentLevel*DELTA_BALL_LEVEL))){
        	currentLevel++
            currentCollisions = 0
            //DELTA_WATER*=1.1
            createBall()
        }

        playerSpine.setAnimationByName(0,"punch",false)
        playerSpine.addAnimationByName(0,"idle",true)

    }


    function createPlayer(){
    	/*player = game.add.group()
    	player.x = game.world.centerX
    	player.y = game.world.height-220
    	sceneGroup.add(player)*/

        player = sceneGroup.create(game.world.centerX,game.world.height-220,"atlas.game","jugador")
        player.anchor.setTo(0.5)
        player.scale.setTo(0.8)
        player.alpha = 0
        game.physics.p2.enable(player,false )
        player.body.clearShapes()
        player.body.setCircle(40,0,-120)
        player.body.mass = 0.1
        player.body.name = "player"
        player.body.onBeginContact.add(collideBody,this)
        playerMaterial = game.physics.p2.createMaterial('spriteMaterial', player.body);
        player.body.kinematic = true
        player.body.x = game.world.centerX
        //player.body.data.shapes[0].sensor = true
        player.body.setCollisionGroup(playerCollisionGroup);
        player.body.collides([ballColisionGroup])
        //player.sprite = sprite

        /*var spriteCollision = player.create(0,0,"atlas.game","jugador")
        spriteCollision.anchor.setTo(0.5)
        spriteCollision.scale.setTo(0.8)
        player.spriteCollision = spriteCollision*/

        playerSpine = game.add.spine(game.world.centerX,game.world.height-220+190,"playerSpine")
        playerSpine.setSkinByName("normal")
        playerSpine.setAnimationByName(0,"idle",true)
        sceneGroup.add(playerSpine)
    }

    function createBall(){

    	for(var i =0; i < ballGroup.length; i++){
    		if(!ballGroup.children[i].visible){
    			ballGroup.children[i].visible = true
    			ballGroup.children[i].body.x = game.rnd.integerInRange(100,game.world.width-100)
    			ballGroup.children[i].body.y = -100
    			ballGroup.children[i].body.velocity.y = 0
	            ballGroup.children[i].body.velocity.x = 0
	            return
    		}
    	}

        var ball = sceneGroup.create(game.rnd.integerInRange(100,game.world.width-100),-100,"atlas.game","balon")
        ball.anchor.setTo(0.5)
        //ball.scale.setTo(0.8)
        game.physics.p2.enable(ball,false)
        ball.body.clearShapes()
        ball.body.setCircle(40)
        var ballMaterial = game.physics.p2.createMaterial('spriteMaterial', ball.body);
        //ball.body.data.shapes[0].sensor = true
        ball.body.name="ball"
        ball.body.setCollisionGroup(ballColisionGroup);
        ball.body.collides([playerCollisionGroup]);

        var contactMaterial = game.physics.p2.createContactMaterial(worldMaterial, ballMaterial);

        contactMaterial.friction = 0;     // Friction to use in the contact of these two materials.
        contactMaterial.restitution =1.15;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
        contactMaterial.stiffness = 1e7;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
        contactMaterial.relaxation = 3; 



        ballGroup.add(ball)
    }
https://open.spotify.com/track/4MorYttxU39XKVoRlCopyz

    function createWater(){
    	var randomAngle = game.rnd.integerInRange(0,1)
    	if(randomAngle ==0){
    		randomAngle =-1
    	}

    	var probability = game.rnd.frac()

    	var keyName
    	var plusValue
    	var shineVisible = false

    	for(var i =0; i < waterTypes.length; i++){
    		if(waterTypes[i].probability >= probability){
    			var name = waterTypes[i].names[game.rnd.integerInRange(0,waterTypes[i].names.length-1)]
    			keyName = name
    			plusValue = waterTypes[i].plusValue

    			if(keyName == "agua2"){
    				shineVisible = true
    			}
    			break
    		}
    	}

    	
        var x = game.rnd.integerInRange(100,game.world.width-100)
        for(var i =0; i < bottleGroup.length; i++){
            if(!bottleGroup.children[i].visible){
                var bottle = bottleGroup.children[i]
                bottle.sprite.loadTexture("atlas.game",keyName)
                bottle.visible = true
                bottle.sprite.angle = -30
                bottle.x = x
                bottle.y = INIT_BOTTLE_Y
                bottle.value = plusValue

                bottle.shine.visible = shineVisible
                
                return bottle
            }
        }

        var group = game.add.group()
        bottleGroup.add(group)
        group.x = x
        group.y = INIT_BOTTLE_Y
        group.value = plusValue

        var shine = group.create(0,0,"atlas.game","brillo")
        shine.anchor.setTo(0.5)
        shine.scale.setTo(1.1)
        group.shine = shine

        var bottle = group.create(0,0,"atlas.game",keyName)
        bottle.angle = -30
        bottle.anchor.setTo(0.5)
        bottle.scale.setTo(1.2)
        group.sprite = bottle

        
       
        shine.visible = shineVisible

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
    	
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 900
        sceneGroup = game.add.group()

        

        initialize()

        createBackground()

        bottleGroup = game.add.group()
        sceneGroup.add(bottleGroup)

        game.physics.p2.setImpactEvents(true);
        playerCollisionGroup = game.physics.p2.createCollisionGroup();
        ballColisionGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();

        createPlayer()

        ballGroup = game.add.group()
        sceneGroup.add(ballGroup)

        worldMaterial = game.physics.p2.createMaterial('worldMaterial');
        game.physics.p2.setBoundsToWorld(true,true,false,false,false)
        game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterial = game.physics.p2.createContactMaterial(playerMaterial, ballMaterial);

        createBall()

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
			
			if(amazing.getMinigameId()){
				if(lives > 0){
					marioSong.play()
				}
			}
			
	        game.sound.mute = false
	    }, this);

        createPointsBar()
        createHearts()

        animateScene()

        loadSounds()

        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        //particlesGroup = game.add.group()
        //sceneGroup.add(particlesGroup)
        //createParticles('star',5)
        createObjects()
        gameActive = true

        timeAppearWater = game.time.now + DELTA_APPEAR_WATER
    }

    
    return {
        assets: assets,
        name: "zoeMundial",
        create: create,
        preload: preload,
        update: update
    }
}()