var soundsPath = "../../shared/minigames/sounds/"
var hyperBabys = function(){

    var BABY_STATES = {
        WALK:0,
        EAT:1,
        LOSE:2,
        TOUCH:3,
        WAIT:4
    }

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/hyperBabys/atlas.json",
                image: "images/hyperBabys/atlas.png",
            },
        ],
        images: [
            {   name:"back1",
                file: "images/hyperBabys/distroller1.jpg"},
            {   name:"back2",
                file: "images/hyperBabys/distroller2.jpg"},
            {   name:"babyWalking0",
                file: "images/hyperBabys/gateando.png"},
            {   name:"babyIdle0",
                file: "images/hyperBabys/baby.png"},
            {   name:"babyWalking1",
                file: "images/hyperBabys/gateandoblue.png"},
            {   name:"babyIdle1",
                file: "images/hyperBabys/walk1.png"},
            {   name:"warning",
                file: "images/hyperBabys/warning.jpg"},

        ],
        sounds: [
            {   name: "magic",
                file: soundsPath + "magic.mp3"},
            {   name: "swipe",
                file: soundsPath + "swipe.mp3"},
            {   name: "wrong",
                file: soundsPath + "wrong.mp3"},
            {   name: "pop",
                file: soundsPath + "pop.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "explode",
                file: soundsPath + "explode.mp3"},
        ],
    }
    
    var INITIAL_LIVES = 3
    var BABY_LIVE = 5000
    var CAMERA_VEL = 10
    var LEVEL_Y = 1024
    var BABY_SPEED = 3
    var BABY_JUMP_FORCE = 500
    var STAIR_POS_ENTER = 100
    var STAIR_POS_EXIT = 1000
    var INITIAL_POS = {x:4000,y:1800}
    var MAX_BABYS = 2
    var WAIT_TIME_MIN = 2000
    var WAIT_TIME_MAX = 5000

    var PROBABILITY_JUMP = 0.5
    var MIN_TIME_JUMP = 1000
    var MAX_TIME_JUMP = 1500

    var MIN_DISTANCE = 100

    var COOKIES_POSITIONS 
    var ENTERTAIMENT_POSITIONS 

    var skinTable
    
    var gameIndex = 20
    var gameId = 5766289444306944
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = true
    var lives = null

    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var cursors

    var warningGroup
    var babysGroup
    var cameraHeigth, cameraWidth

    var minTimeAppearBaby = 5000
    var maxTimeAppearbaby = 9000

    var minTimeStart = 3000
    var maxTimeStart = 5000

    var timeAppearBaby

    var collisionGroup
    var cookieGroup
    var entertaimentGroup

    var touchImage, touchInBaby
    var availableCookies

    var currentBaby

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
        COOKIES_POSITIONS = [{x:game.world.centerX,y:1700},{x:game.world.centerX,y:800}]
        console.log(COOKIES_POSITIONS)
        ENTERTAIMENT_POSITIONS = [{x:INITIAL_POS.x,y:INITIAL_POS.y}]
        touchInBaby = false
        currentBaby = 0
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
                
        if(amazing.getMinigameId()){
            marioSong = sound.setSong(soundsPath + 'songs/retrowave.mp3',0.3)
        }else{
            game.load.audio('arcadeSong', soundsPath + 'songs/retrowave.mp3');
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
                
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
        tweenScene.onComplete.add(function(){
            
            var resultScreen = sceneloader.getScene("result")
            resultScreen.setScore(true, pointsBar.number,gameIndex)
        
            sceneloader.show("result")
        })
    }
    
    function addPoint(number,obj){
        
        sound.play("pop")
        createPart('star', obj)
        createTextPart('+' + number, obj)
        
        pointsBar.number+= number

        pointsBar.text.setText(pointsBar.number)
   
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
        else{
            //nextRound()
        }
        
    }
    


    
    function update(){
        //console.log("dsada")
        if(!gameActive){
            return
        }

        if (cursors.up.isDown)
        {
            game.camera.y -= CAMERA_VEL;
        }
        else if (cursors.down.isDown)
        {
            game.camera.y += CAMERA_VEL;
        }

        if (cursors.left.isDown)
        {
            game.camera.x -= CAMERA_VEL;
        }
        else if (cursors.right.isDown)
        {
            game.camera.x += CAMERA_VEL;
        }

        if(touchInBaby){
        	var horizontal = false 
        	var vertical = false
        	if(game.input.activePointer.x > cameraWidth -100 || game.input.activePointer.x < 100){
        		horizontal = true
        	}

        	if(game.input.activePointer.y > cameraHeigth -100 || game.input.activePointer.y < 100){
        		vertical = true
        	}

        	if(horizontal || vertical){

        		var cameraPosition = {x:cameraWidth/2,y:cameraHeigth/2}
	        	var x = game.input.activePointer.x - cameraPosition.x
	            var y = game.input.activePointer.y - cameraPosition.y
	            var h = Math.sqrt(Math.pow(x,2) + Math.pow(y,2)) 
                var cos = x/h
                var sin = y/h

                //if(horizontal){
                	game.camera.x += CAMERA_VEL*cos
                //}

                //if(vertical){
                	game.camera.y += CAMERA_VEL*sin
                //3}
	        }

	        touchImage.x = game.input.activePointer.x + game.camera.x
	    	touchImage.y = game.input.activePointer.y + game.camera.y

        }
        else{

	        if(game.input.activePointer.isDown){
	            slideComponent.updateSlide(game.input.activePointer.x,game.input.activePointer.y)
	           	touchImage.x = game.input.activePointer.x + game.camera.x
	    		touchImage.y = game.input.activePointer.y + game.camera.y
	        }
	        else{
	            slideComponent.endScroll()
	            slideComponent.updateFriction()
	            touchImage.x = -100
	    		touchImage.y = -100
	        }
	    }

        updateWarning()

        if(timeAppearBaby!=-1){
            if(game.time.now > timeAppearBaby){
                var baby = createBaby()
                initBaby(baby)
                timeAppearBaby =game.rnd.integerInRange(minTimeAppearBaby,maxTimeAppearbaby) + game.time.now
                if(babysGroup.length==MAX_BABYS){
                	timeAppearBaby = -1
                }
            }
        }

        updateBabys()

    }



    function updateWarning(){
        var cameraPosition = {x:game.camera.x+cameraWidth/2,y:game.camera.y+cameraHeigth/2}
        warningGroup.x = game.camera.x
        warningGroup.y = game.camera.y
        for(var i = 0; i < babysGroup.length; i++){
            var baby = babysGroup.children[i]
            if(baby.state!=BABY_STATES.EAT){
            	continue
            }
            var x = baby.x - cameraPosition.x
            var y = baby.y - cameraPosition.y
            if(Math.abs(x) >= cameraWidth/2 || Math.abs(y) >= cameraHeigth/2){
                if(baby.warning==null){
                    baby.warning = createWarning()
                }
                else{
                    var h = Math.sqrt(Math.pow(x,2) + Math.pow(y,2)) 
                    var cos = x/h
                    var sin = y/h

                    baby.warning.x = cameraWidth/2 + (cos*(cameraWidth/2))
                    baby.warning.y = cameraHeigth/2 + (sin*(cameraHeigth/2))
                }
            }
            else{
                if(baby.warning!=null){
                    baby.warning.visible = false
                    baby.warning=null
                }
            }

        }
    }

    function updateBabys(){
        for(var i = 0; i < babysGroup.length; i++){
            var baby = babysGroup.children[i]

            if(baby.state == BABY_STATES.LOSE){
                continue
            }

            for(var j = 0; j < collisionGroup.length; j++){
            	game.physics.arcade.collide(baby,collisionGroup.children[j])
            }


            if(baby.state==BABY_STATES.WALK){

            	if(baby.x < STAIR_POS_EXIT){
	            	if(baby.onStairs){
	                	if(baby.stairsUp){
	                		jump(baby)
	                	}
	                	baby.x += BABY_SPEED

	                	if(baby.x> STAIR_POS_EXIT){
	                		baby.onStairs = false
	                	}
	                }
	                else{
	                	if(baby.x < STAIR_POS_ENTER){

	                		baby.onStairs = true
	                	}
	                	else{
	                		baby.x -= BABY_SPEED
	                	}
	                }

	                continue
	            }


                var sameLevel = false
                var destinationObject = baby.cookie
                if(destinationObject==null){
                	destinationObject = baby.destination
                }

                if((baby.y < LEVEL_Y && destinationObject.y < LEVEL_Y) || (baby.y > LEVEL_Y && destinationObject.y > LEVEL_Y)){
                    sameLevel = true
                }

                if(sameLevel){

                    var dir 

                    if(!baby.inGround && baby.lastDirection!=0){
                    	dir = baby.lastDirection
                    }
                    else{
                    	dir = destinationObject.x  - baby.x 
                    	baby.lastDirection = dir
                    	if(Math.abs(dir) < MIN_DISTANCE && baby.cookie){
	                        jump(baby)
	                    }
                    }

                    if(dir <= 0){
                        dir = -1
                    }
                    else{
                        dir = 1
                    }

                    baby.x += (dir*BABY_SPEED)
                    if(baby.cookie!=null){
	                    var collision = checkOverlap(baby,baby.cookie)
	                    if(collision){
                            baby.loadTexture("babyIdle"+baby.type)
	                        baby.state = BABY_STATES.EAT
	                        baby.body.allowGravity = false
	                        baby.body.velocity.x = 0
	                        baby.body.velocity.y = 0
	                    }
	                }
	                else{
	                	if(destinationObject.x  - baby.x < 100){
	                		setCookie(baby)
	                	}
	                }

                }
                else{

                    baby.x -= BABY_SPEED
                }
            }
            else if(baby.state == BABY_STATES.EAT){

            	baby.live -= game.time.elapsed

            	if(baby.live <=0){
            		console.log("EnterSugarState")
                    baby.cookie.ocupated = false
                    baby.body.allowGravity = true
                    baby.state = BABY_STATES.LOSE;
                    if(baby.warning!=null){
                        baby.warning.visible = false
                        baby.warning = null
                    }
                    sceneGroup.add(baby);
                    missPoint();
                    if(lives > 0){
                        timeAppearBaby = game.rnd.integerInRange(minTimeAppearBaby,maxTimeAppearbaby) + game.time.now
                    }
            	}

            	if(game.input.activePointer.isDown){
            		var collision = checkOverlap(baby,touchImage)
            		if(collision){
                        baby.loadTexture("babyWalking"+baby.type)
            			touchInBaby = true
            			baby.state = BABY_STATES.TOUCH
            			baby.cookie.ocupated = false
            		}
            	}
            }
            else if(baby.state == BABY_STATES.TOUCH){
            	if(game.input.activePointer.isDown){
            		baby.x = touchImage.x
            		baby.y = touchImage.y
            	}
            	else{
            		touchInBaby = false
            		var collision = false
            		for(var j =0; j < entertaimentGroup.length; j++){
            			collision = checkOverlap(baby,entertaimentGroup.children[i])
	            		if(collision){
	            			break
	            		}
            		}

            		if(collision){
            			baby.state = BABY_STATES.WAIT
                        baby.waitTime = game.time.now + game.rnd.integerInRange(WAIT_TIME_MIN,WAIT_TIME_MAX)
            		}	
            		else{
            			baby.state = BABY_STATES.WALK
            			initBaby(baby)
            		}
            	}
            }
            else if(baby.state == BABY_STATES.WAIT){
                if(baby.waitTime < game.time.now){
                	baby.state = BABY_STATES.WALK
                	initBaby(baby)
                }

            }

        }
    }

    function initBaby(baby){
    	baby.onStairs = false
    	baby.stairsUp = false
    	baby.inGround = false
        baby.waitTime = 0
    	baby.body.allowGravity = true
    	baby.lastDirection = 0
    	baby.body.velocity.y -= BABY_JUMP_FORCE
        baby.jumpTime = game.rnd.integerInRange(MIN_TIME_JUMP,MAX_TIME_JUMP) + game.time.now
        baby.loadTexture("babyWalking"+baby.type)
        //timeAppearBaby =game.rnd.integerInRange(minTimeAppearBaby,maxTimeAppearbaby) + game.time.now
        setCookie(baby)

    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB);

    }

    function jump(baby){
    	if(baby.inGround){
    		baby.inGround = false
    		baby.body.velocity.y = -BABY_JUMP_FORCE
    	}
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
    
    function createWarning(){
        for(var i = 0; i < warningGroup.length; i ++){
            if(!warningGroup.children[i].visible){
                var warning = warningGroup.children[i]
                warning.visible = true
                return warning
            }
        }

        var warning = warningGroup.create(0,0,"warning")
        warning.anchor.setTo(0.5)
        return warning
    }

    function createBaby(){
        for (var i = 0; i < babysGroup.length; i++){
            if(!babysGroup.children[i].visible){
                var baby = babysGroup.children[i]
                baby.visible = true
                baby.x = INITIAL_POS.x
                baby.y = INITIAL_POS.y
                baby.warning = null
                baby.state = BABY_STATES.WALK
                baby.live = BABY_LIVE
                baby.inGround = false
                baby.lastDirection = 0
                baby.body.allowGravity = true
                return baby
            }
        }

        var sprite = game.add.sprite(INITIAL_POS.x, INITIAL_POS.y,"babyWalking");
        sprite.anchor.setTo(0.5)
        sprite.scale.setTo(1.4)
        babysGroup.add(sprite)
        sprite.warning = null
        game.physics.enable(sprite, Phaser.Physics.ARCADE);
        sprite.body.setSize(100,120,0,0)
        sprite.body.onCollide = new Phaser.Signal();
        sprite.body.onCollide.add(collision, this);
        sprite.body.collideWorldBounds = true
        sprite.body.checkCollision.up = false;
        sprite.body.checkCollision.left = false;
        sprite.body.checkCollision.right = false;
        
        sprite.state = BABY_STATES.WALK
        sprite.live = BABY_LIVE
        sprite.inGround = false
        sprite.lastDirection = 0
        sprite.type = currentBaby
        currentBaby++
        if(currentBaby>=2){
            currentBaby = 0
        }
        return sprite
    }

    function collision(baby,sprite2){
    	if(!baby.inGround){
    		baby.inGround = true
    	}
    }

    function setCookie(baby){
    	var tempCookies = []
        for(var i = 0; i < COOKIES_POSITIONS.length; i++){
            if(baby.cookieId!=null){
                if(baby.cookieId == i){
                    continue
                }
            }
            tempCookies.push(i)
        }
        console.log(tempCookies)
    	

    	var founded = false
    	var idCookie
        
        var tries = 0
    	while(!founded && tempCookies.length>0 && tries < 4){
            var id = game.rnd.integerInRange(0,tempCookies.length-1)
        	idCookie = tempCookies[id]
            console.log(idCookie)
        	founded=!cookieGroup.children[idCookie].ocupated 
            console.log(founded)
        	if(!founded){
        		tempCookies.splice(id,1)
        	}
            tries++
	    }

        console.log(founded,tries)
	    if(founded){
	    	baby.cookie = cookieGroup.children[idCookie]
	        baby.cookie.ocupated = true
	        if(baby.y > LEVEL_Y && baby.cookie.y < LEVEL_Y){
	            baby.stairsUp = true
	        }
	        baby.cookieId = idCookie
	    }
	    else{
	    	baby.cookie = null
	    	baby.cookieId = null
	    	baby.destination = {x:game.rnd.integerInRange(STAIR_POS_EXIT,game.world.width-500),y:0}
	    	var r = game.rnd.frac()
	    	if(r>0.5){
	    		baby.destination.y = game.world.height - 100
	    	}
	    	else{
	    		baby.destination.y = LEVEL_Y - 100
	    	}

	    	if(baby.y > LEVEL_Y && baby.destination.y < LEVEL_Y){
	            baby.stairsUp = true
	        }
	    }

	    

    }
    

    function createBackground(){
    	collisionGroup = game.add.group()
    	sceneGroup.add(collisionGroup)

    	var floor = game.add.graphics(0,game.world.height-50)
    	floor.beginFill(0xff0000)
    	floor.drawRect(0,0,game.world.width,50)
    	floor.endFill()
    	game.physics.enable(floor, Phaser.Physics.ARCADE);
        floor.body.immovable = true
        floor.body.allowGravity = false
        collisionGroup.add(floor)

        floor = game.add.graphics(900,game.world.centerY)
    	floor.beginFill(0xff0000)
    	floor.drawRect(0,0,game.world.width-900,50)
    	floor.endFill()
    	game.physics.enable(floor, Phaser.Physics.ARCADE);
        floor.body.checkCollision.down = false;
        floor.body.checkCollision.left = false;
        floor.body.checkCollision.right = false;
        floor.body.immovable = true
        floor.body.allowGravity = false
        collisionGroup.add(floor)

        var stair = game.add.graphics(50,game.world.height-200)
    	stair.beginFill(0xff0000)
    	stair.drawRect(0,0,200,100)
    	stair.endFill()
    	game.physics.enable(stair, Phaser.Physics.ARCADE);
        stair.body.checkCollision.down = false;
        stair.body.checkCollision.left = false;
        stair.body.checkCollision.right = false;
        stair.body.immovable = true
        stair.body.allowGravity = false
        collisionGroup.add(stair)

        stair = game.add.graphics(150,game.world.height-300)
    	stair.beginFill(0xff0000)
    	stair.drawRect(0,0,200,100)
    	stair.endFill()
    	game.physics.enable(stair, Phaser.Physics.ARCADE);
        stair.body.checkCollision.down = false;
        stair.body.checkCollision.left = false;
        stair.body.checkCollision.right = false;
        stair.body.immovable = true
        stair.body.allowGravity = false
        collisionGroup.add(stair)

        stair = game.add.graphics(250,game.world.height-400)
    	stair.beginFill(0xff0000)
    	stair.drawRect(0,0,200,100)
    	stair.endFill()
    	game.physics.enable(stair, Phaser.Physics.ARCADE);
        stair.body.checkCollision.down = false;
        stair.body.checkCollision.left = false;
        stair.body.checkCollision.right = false;
        stair.body.immovable = true
        stair.body.allowGravity = false
        collisionGroup.add(stair)

        stair = game.add.graphics(350,game.world.height-500)
    	stair.beginFill(0xff0000)
    	stair.drawRect(0,0,200,100)
    	stair.endFill()
    	game.physics.enable(stair, Phaser.Physics.ARCADE);
        stair.body.checkCollision.down = false;
        stair.body.checkCollision.left = false;
        stair.body.checkCollision.right = false;
        stair.body.immovable = true
        stair.body.allowGravity = false
        collisionGroup.add(stair)

        stair = game.add.graphics(450,game.world.height-600)
    	stair.beginFill(0xff0000)
    	stair.drawRect(0,0,200,100)
    	stair.endFill()
    	game.physics.enable(stair, Phaser.Physics.ARCADE);
        stair.body.checkCollision.down = false;
        stair.body.checkCollision.left = false;
        stair.body.checkCollision.right = false;
        stair.body.immovable = true
        stair.body.allowGravity = false
        collisionGroup.add(stair)

        stair = game.add.graphics(550,game.world.height-700)
    	stair.beginFill(0xff0000)
    	stair.drawRect(0,0,200,100)
    	stair.endFill()
    	game.physics.enable(stair, Phaser.Physics.ARCADE);
        stair.body.checkCollision.down = false;
        stair.body.checkCollision.left = false;
        stair.body.checkCollision.right = false;
        stair.body.immovable = true
        stair.body.allowGravity = false
        collisionGroup.add(stair)

        stair = game.add.graphics(650,game.world.height-800)
    	stair.beginFill(0xff0000)
    	stair.drawRect(0,0,200,100)
    	stair.endFill()
    	game.physics.enable(stair, Phaser.Physics.ARCADE);
        stair.body.checkCollision.down = false;
        stair.body.checkCollision.left = false;
        stair.body.checkCollision.right = false;
        stair.body.immovable = true
        stair.body.allowGravity = false
        collisionGroup.add(stair)

        stair = game.add.graphics(750,game.world.height-900)
    	stair.beginFill(0xff0000)
    	stair.drawRect(0,0,200,100)
    	stair.endFill()
    	game.physics.enable(stair, Phaser.Physics.ARCADE);
        stair.body.checkCollision.down = false;
        stair.body.checkCollision.left = false;
        stair.body.checkCollision.right = false;
        stair.body.immovable = true
        stair.body.allowGravity = false
        collisionGroup.add(stair)

        stair = game.add.graphics(850,game.world.height-1000)
    	stair.beginFill(0xff0000)
    	stair.drawRect(0,0,200,100)
    	stair.endFill()
    	game.physics.enable(stair, Phaser.Physics.ARCADE);
        stair.body.checkCollision.down = false;
        stair.body.checkCollision.left = false;
        stair.body.checkCollision.right = false;
        stair.body.immovable = true
        stair.body.allowGravity = false
        collisionGroup.add(stair)


        cookieGroup = game.add.group()
        sceneGroup.add(cookieGroup)

        for(var i = 0; i < COOKIES_POSITIONS.length; i++){
        	var cookie = game.add.graphics(COOKIES_POSITIONS[i].x,COOKIES_POSITIONS[i].y)
        	cookie.beginFill(0x00ff00)
        	cookie.drawRect(-50,-50,100,100)
        	cookie.endFill()
        	cookieGroup.add(cookie)
        	cookie.ocupated = false
        }

        entertaimentGroup = game.add.group()
        sceneGroup.add(entertaimentGroup)

        for(var i = 0; i < ENTERTAIMENT_POSITIONS.length; i++){
        	var entertaiment = game.add.graphics(ENTERTAIMENT_POSITIONS[i].x,ENTERTAIMENT_POSITIONS[i].y)
        	entertaiment.beginFill(0x0000ff)
        	entertaiment.drawRect(-50,-50,100,100)
        	entertaiment.endFill()
        	cookieGroup.add(entertaiment)
        }

        touchImage = sceneGroup.create(0,0,"atlas.game","star")
        touchImage.anchor.setTo(0.5)


    }

    
    function create(){
    	
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 500
        cameraHeigth = game.world.height
        cameraWidth = game.world.width
        game.world.setBounds(0, 0, 4096, 2048);
        sceneGroup = game.add.group()

        initialize()

        var bg1 = sceneGroup.create(0,0,"back1")
        var bg2 = sceneGroup.create(bg1.width,0,"back2")

        babysGroup = game.add.group()
        sceneGroup.add(babysGroup)
        
        game.camera.y = game.world.height - cameraHeigth

        cursors = game.input.keyboard.createCursorKeys();

        slideComponent.enableDirection(game.camera,true,true)
        slideComponent.setHorizontalLimits(0,game.world.width - cameraWidth)
        slideComponent.setVerticalLimits(0,game.world.height - cameraHeigth)

        warningGroup = game.add.group()
        sceneGroup.add(warningGroup)

        timeAppearBaby = 1000 + game.time.now
        createBackground()

        createPointsBar()
        createHearts()

        loadSounds()
        animateScene()

    }

    function render(){
    	for(var i = 0; i < babysGroup.length; i ++){
    		game.debug.body(babysGroup.children[i])
    	}

    	for(var i = 0; i < collisionGroup.length; i ++){
    		game.debug.body(collisionGroup.children[i])
    	}

    }

    
    return {
        assets: assets,
        name: "hyperBabys",
        create: create,
        preload: preload,
        update: update,
        //render:render
    }
}()