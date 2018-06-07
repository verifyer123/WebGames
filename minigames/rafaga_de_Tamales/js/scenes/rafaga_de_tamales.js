var soundsPath = "../../shared/minigames/sounds/"
var spinePath = "../../shared/minigames/images/spines/"
var rafaga_de_tamales = function(){
	assets = {
        atlases: [
            {   
                name: "atlas.rafaga_de_tamales",
                json: "images/rafaga_de_tamales/atlas.json",
                image: "images/rafaga_de_tamales/atlas.png",
            },
        ],
        /*images: [
            {   name:"fondo",
				file: "images/delicafe/fondo.png"},
		],*/
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: "explode",
                file: soundsPath + "explode.mp3"},
            
		],
	}
    
    var INITIAL_LIVES = 3
    var DELTA_TIME = 50
    var NUMBER_CUT_OBJECTS = 3
    var MAX_OBJECTS = 8
    var DELTA_PROBABILITY_BOMB = 0.03
    var MAX_PROBABILTY_BOMB = 0.3
    var ROUNDS_TUTORIAL = 3
    var VELOCITY_X = 150
    var BLADE_INITIAL_SCALE = 0.5
    var BLADE_FINAL_SCALE = 0.1
    var BLADE_COUNT = 100
    var BLADE_DELTA = (BLADE_INITIAL_SCALE - BLADE_FINAL_SCALE)/BLADE_COUNT
    var MAX_LINE_DISTANCE = 2

    var WAIT_ONE_BY_ONE = 200
    var HIT_COMBO_TIME = 1000

    var PROBABILITY_EXTRA_POINTS = 0.2
    var ROUND_EXTRA_POINTS = 6
    var TIME_EXTRA_POINTS = 2000
    var DISTANCE_TO_PLUS = 100

    
    var gameIndex = 19
    var gameId = 5679382827892736
    var marioSong = null
	var sceneGroup = null
    var pointsGroup = null
    var gameActive = true
    var valuesList = null
    var objectsGroup

    var timer
    var timeGroup = null
    var pointsBar = null

    var lives = null
    var particlesGroup
    var particlesUsed
    var heartsGroup = null


    var cutObjectsGroup
    var bombGroup
    var bodyTouch

    var currentObjects 
    var currentMaxWrong

    var inRound 
    var currentRound
    var probabiltyBomb 
    var lastPoint
    var canCut 
    var sameFrames

    var bladeGroup
    var touchPositions

    var roundType
    var objectsWait
    var hitComboArray

    var extraPointsObject 
    var inExtraPoints
    var currentDistance 

    var partsGroup 

    var shade


	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#000000"
        lives = INITIAL_LIVES
        
        currentObjects = 1
        currentMaxWrong = 0
        inRound = false
        currentRound = 0
        probabiltyBomb = 0
        lastPoint = {x:0,y:0}
        canCut = false
        sameFrames = 0
        touchPositions = []
        objectsWait = []
        hitComboArray = []
        inExtraPoints = false
        currentDistance = 0
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
       
        //game.load.spritesheet('fireSpritesheet', 'images/rafaga_de_tamales/fire.png', 320, 440, 23);
        		
		if(amazing.getMinigameId()){
			marioSong = sound.setSong(soundsPath + 'songs/la_fiesta.mp3',0.3)
		}else{
			game.load.audio('arcadeSong', soundsPath + 'songs/la_fiesta.mp3');
		}
		var fontStyle = {font: "30px AvenirHeavy", fontWeight: "bold", fill: "#000000", align: "center"}
		var text = new Phaser.Text(game, 0, 10, "2", fontStyle)
		text.visible = false
    }

    
    function stopGame(){
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
        
        sound.play("magic")
        createPart('star', obj)
        createTextPart('+' + number, obj)
        
        pointsBar.number+= number

        pointsBar.text.setText(pointsBar.number)
   
    }

    function missPoint(){
        console.log("misspoint")
        sound.play("wrong")
        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            stopGame(false)
        }
        
        createTextPart('-1',heartsGroup.text)
        
    }


    
    function update(){
        updateBlade()
        if(gameActive == false){
            moveArrayTouch()
            
            return
        }


        if(inRound){

            if(roundType == 1){
                for(var i = 0; i < objectsWait.length; i ++){
                    if(objectsWait[i].wait !=-1){
                        if(objectsWait[i].wait < game.time.now){
                            objectsWait[i].body.velocity.y = objectsWait[i].next_vel_y
                            objectsWait[i].body.velocity.x = objectsWait[i].next_vel_x
                            objectsWait[i].wait = -1
                            objectsWait[i].body.data.gravityScale = 1;
                        }
                    }
                }
            }

            var cutFinish = analizeGroupRound(cutObjectsGroup)
            var bombFinish = analizeGroupRound(bombGroup)

            if(cutFinish && bombFinish){

                inRound = false
                if(!inExtraPoints){
	                startNewRound()
	            }
            }

            if(extraPointsObject.body.data.gravityScale == 1){
                if(extraPointsObject.body.x < -200 || extraPointsObject.body.x > game.world.x +200){
                    extraPointsObject.visible = false
                    extraPointsObject.body.setZeroVelocity()
                }
            }


        }
        updateParts()
        updateSwipe()
    }

    function updateParts(){
    	for(var i = 0 ; i<partsGroup.length;i++){
    		if(partsGroup.children[i].visible){
    			if(partsGroup.children[i].body.y > game.world.height + 100){
    				partsGroup.children[i].visible = false
    				partsGroup.children[i].body.gravityScale = 0
    			}
    		}
    	}
    }


    function analizeGroupRound(group){
        var finishRound = true
        for(var i = 0; i< group.length; i++){
            if(group.children[i].wait!=-1){
                finishRound = false
                continue
            }

            if(group.children[i].visible){
                finishRound = false
                if(group.children[i].body.x < -100 || group.children[i].body.x> game.world.width+100){
                    group.children[i].visible = false
                    group.children[i].body.setZeroVelocity()
                    group.children[i].body.data.gravityScale = 0
                    group.children[i].wait = -1
                    if(group!=bombGroup){
                        missPoint()
                    }
                    continue
                }

                if(group.children[i].body.y > game.world.height+100 && group.children[i].body.velocity.y >0){
                    group.children[i].visible = false
                    group.children[i].body.setZeroVelocity()
                    group.children[i].body.data.gravityScale = 0
                    group.children[i].wait = -1
                    if(group!=bombGroup){
                        missPoint()
                    }
                }

            }
        }
        
        return finishRound

    }

    function updateSwipe(){
        if(game.input.activePointer.isDown){
            bodyTouch.x = game.input.activePointer.x
            bodyTouch.y= game.input.activePointer.y

            if(lastPoint.x == 0 && lastPoint.y == 0){
                lastPoint.x = bodyTouch.x
                lastPoint.y = bodyTouch.y
            }

            if(!canCut){
                var d = Math.sqrt(Math.pow((bodyTouch.x - lastPoint.x),2) + Math.pow((bodyTouch.y - lastPoint.y),2))
                if(d > 30){
                    canCut = true
                }
                else{
                    moveArrayTouch()
                }

            }
            else{
                var d = Math.sqrt(Math.pow((bodyTouch.x - lastPoint.x),2) + Math.pow((bodyTouch.y - lastPoint.y),2))
                if(d<5){
                    sameFrames++
                    if(sameFrames>=10){
                        canCut = false
                    }
                    moveArrayTouch()
                }
                else{

                    if(d>MAX_LINE_DISTANCE){
                        
                        var segments = Math.floor(d/MAX_LINE_DISTANCE)
                        for(var i = 0; i < segments; i++){
                            var t= {x:0,y:0}
                            t.x = lerp(lastPoint.x,bodyTouch.x,(i+1)/segments)
                            t.y = lerp(lastPoint.y,bodyTouch.y,(i+1)/segments)

                            touchPositions.push(t)
                            if(touchPositions.length > bladeGroup.length){
                                touchPositions.shift()
                            }
                        }
                    }

                    sameFrames = 0
                    lastPoint.x = bodyTouch.x
                    lastPoint.y = bodyTouch.y

                    touchPositions.push({x:lastPoint.x,y:lastPoint.y})
                    if(touchPositions.length > bladeGroup.length){
                        touchPositions.shift()
                    }


                    if(inExtraPoints){
                        currentDistance += d
                        var d_toExtra = Math.sqrt(Math.pow((bodyTouch.x - extraPointsObject.body.x),2) + Math.pow((bodyTouch.y - extraPointsObject.body.y),2))
                        if(d_toExtra<50 && currentDistance>DISTANCE_TO_PLUS){
                            extraPointsObject.scale.setTo(extraPointsObject.scale.x+0.02)
                            addPoint(1,extraPointsObject.body)
                            currentDistance -= DISTANCE_TO_PLUS
                            if(shade.alpha<0.85){
	                            shade.alpha+=0.05
	                        }


                        }
                    }
                }
                
            }
            



            //lastPoint.x = bodyTouch.x
            //lastPoint.y = bodyTouch.y
        }
        else{
            bodyTouch.x = 0
            bodyTouch.y = 0
            lastPoint.x = 0
            lastPoint.y = 0
            canCut = false
            moveArrayTouch()

        }


        
    }

    function moveArrayTouch(){
        if(touchPositions.length>0){
            //if(touchPositions[0].x!=-100){
                touchPositions.push({x:-100,y:-100})
                if(touchPositions.length > bladeGroup.length){
                    touchPositions.shift()
                }
            //}
        }
    }


    function updateBlade(){
        var indexBlade = 0
        //console.log(touchPositions.length)
        for(var i = touchPositions.length-1; i>= 0; i--){
            bladeGroup.children[indexBlade].alpha = 1
            if(canCut){
				bladeGroup.children[indexBlade].scale.setTo(bladeGroup.children[indexBlade].normalScale)
            }
            else{
            	if(bladeGroup.children[indexBlade].scale.x!=0){
	            	bladeGroup.children[indexBlade].scale.setTo(bladeGroup.children[indexBlade].scale.x-0.1)

	            	if(bladeGroup.children[indexBlade].scale.x<0){
	            		touchPositions.shift()
	            		bladeGroup.children[indexBlade].scale.setTo(0)
	            	}
	            }

            }
            if(touchPositions[i]!=null){
	            if(bladeGroup.children[indexBlade].body == null){
	                bladeGroup.children[indexBlade].x = touchPositions[i].x
	                bladeGroup.children[indexBlade].y = touchPositions[i].y
	            }
	            else{
	                bladeGroup.children[indexBlade].body.x = touchPositions[i].x
	                bladeGroup.children[indexBlade].body.y = touchPositions[i].y
	            }
	        }
	        else{
	        	bladeGroup.children[indexBlade].scale.setTo(0)
	        }
            indexBlade++
        }
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(0,10,'atlas.rafaga_de_tamales','xpcoins')
        pointsImg.x = game.world.width - pointsImg.width * 1.2
        pointsImg.width *=1
        pointsImg.height *=1
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.6
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

        group.create(0,0,'atlas.rafaga_de_tamales','life_box')

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
                particle = particlesGroup.create(-200,0,'atlas.rafaga_de_tamales',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }

    function setExplosion(obj,offsetY){
        
        var offY = offsetY || 0

        var exp = sceneGroup.create(0,0,'atlas.rafaga_de_tamales','explosion')
        exp.x = obj.x
        exp.y = obj.y + offY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        starParticles(obj,'smoke')
        
    }
    
    function starParticles(obj,idString){
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.rafaga_de_tamales',idString);
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
    
    function createObjects(){
        
        particlesGroup = game.add.group()
        sceneGroup.add(particlesGroup)
        
        particlesUsed = game.add.group()
        sceneGroup.add(particlesUsed)
        
        createParticles('star',5)
        createParticles('wrong',1)
        createParticles('text',8)
                
    }

    function startNewRound(){
        switch(currentRound){
            case 0: case 1:
            currentObjects = 1
            probabiltyBomb = 0
            break
            case 2:
            currentObjects=1
            probabiltyBomb=1
            break
            case 3:
            currentObjects = 2
            probabiltyBomb = 0
            default:
                if(currentObjects < MAX_OBJECTS){
                    currentObjects += game.rnd.integerInRange(0,1)
                }
                if(probabiltyBomb < MAX_PROBABILTY_BOMB){
                    probabiltyBomb+= game.rnd.realInRange(0,DELTA_PROBABILITY_BOMB)
                }
            break
        }

        setTimeout(setRound,1000)
    }

    function setRound(){
        roundType = game.rnd.integerInRange(0,1)

        /*roundType =0 all in one
        roundType = 1 on by one*/
        objectsWait = []
        hitComboArray = []

        currentRound++
        //console.log("SetRound")

        for(var i = 0; i < currentObjects; i++){
            var object
            var r = game.rnd.frac()
            if(r < probabiltyBomb){
                object = getWrongObject()
            }
            else{
                object = getCutObject()
            }

            object.body.x = game.rnd.integerInRange(game.world.centerX - game.world.width/3, game.world.centerX+game.world.width/3)
            object.body.y = game.world.height+100
            object.body.angularVelocity = game.rnd.integerInRange(-2,2)
            var vel_y = -game.rnd.integerInRange(700,900)
            var vel_x
            if(object.body.x<game.world.centerX - game.world.width/5){
                vel_x = game.rnd.integerInRange(0,VELOCITY_X)
            }
            else if(object.body.x>game.world.centerX + game.world.width/5){
                vel_x = game.rnd.integerInRange(-VELOCITY_X,0)
            }
            else{
                vel_x = game.rnd.integerInRange(-VELOCITY_X,VELOCITY_X)
            }
            if(roundType==0){
                object.body.velocity.y = vel_y
                object.body.velocity.x = vel_x

                object.body.data.gravityScale = 1;
            }
            else{
                object.next_vel_x = vel_x
                object.next_vel_y = vel_y
                object.wait = game.time.now + (WAIT_ONE_BY_ONE*i)
                objectsWait.push (object)
                object.body.data.gravityScale = 0
            }
        }

        if(currentRound > ROUND_EXTRA_POINTS){
        	console.log("SetExtra")
            var r = game.rnd.frac()
            console.log(r,PROBABILITY_EXTRA_POINTS)
            if(r< PROBABILITY_EXTRA_POINTS && !extraPointsObject.visible){
            	console.log("SetExta points")
                r = game.rnd.integerInRange(0,1)
                extraPointsObject.body.setZeroVelocity()
                if(r ==0){
                    extraPointsObject.body.x = -100
                    extraPointsObject.body.velocity.x = 100
                }
                else{
                    extraPointsObject.body.x = game.world.width+100
                    extraPointsObject.body.velocity.x = -100
                }

                extraPointsObject.body.y = game.rnd.integerInRange(game.world.centerY - 300, game.world.centerY + 300)
                extraPointsObject.body.velocity.y = game.rnd.integerInRange(-100,100)
                extraPointsObject.body.angularVelocity = game.rnd.integerInRange(-3,3)
                extraPointsObject.body.data.gravityScale = 0
                extraPointsObject.visible = true
                extraPointsObject.scale.setTo(1)
            }
        }

        inRound = true
    }

    function getCutObject(){

        var r = game.rnd.integerInRange(0,NUMBER_CUT_OBJECTS-1)
        for(var i = 0; i < cutObjectsGroup.length; i++){
            if(!cutObjectsGroup.children[i].visible && cutObjectsGroup.children[i].type==r){
                cutObjectsGroup.children[i].visible = true
                return cutObjectsGroup.children[i]
            }
        }

        var object = createCutObject(r)
        return object
    }


    function createCutObject(r){

        var key

        switch(r){
            case 0:
            key = "chile"
            break
            case 1:
            key = "dulce"
            break
            case 2:
            key = "pina"
            break

        }
        
        var object = game.add.sprite(0,0,'atlas.rafaga_de_tamales',key)
        object.type = r
        game.physics.p2.enable(object,false);
        object.anchor.setTo(0.5)
        object.wait = -1
        //object.visible = false
        //object.body.static = true
        //object.body.collideWorldBounds = false;
        object.body.name = "correct"
        object.body.key = key
        cutObjectsGroup.add(object)
        object.body.data.gravityScale = 0;
        object.body.data.shapes[0].sensor = true
        //object.body.createBodyCallback(bodyTouch.sprite, collisionCut, this);
        return object
        
    }



    function getWrongObject(){
        for(var i = 0; i < bombGroup.length; i++){
            if(!bombGroup.children[i].visible){
                bombGroup.children[i].visible = true
                return bombGroup.children[i]
            }
        }

        var object = createWrongObject()
        return object
    }


    function createWrongObject(){
        
        var object = game.add.sprite(0,0,'atlas.rafaga_de_tamales','bomba')
        game.physics.p2.enable(object,false);
        object.anchor.setTo(0.5)
        object.wait = -1
        //object.visible = false
        //object.body.static = true
        //object.body.collideWorldBounds = false;
        object.body.name = "bomb"
        bombGroup.add(object)
        object.body.data.gravityScale = 0;
        object.body.data.shapes[0].sensor = true
        //object.body.createBodyCallback(bodyTouch.sprite, collisionCut, this);
        return object
        
    }


    function createTouchCut(){
        var touch = game.add.sprite(0,0,'atlas.rafaga_de_tamales','rafaja')
        touch.scale.setTo(0.2)
        game.physics.p2.enable(touch,false);
        touch.alpha = 0
        bodyTouch = touch.body
        bodyTouch.data.gravityScale = 0;

        bodyTouch.name = "touch"
        bodyTouch.data.shapes[0].sensor = true
        bodyTouch.onBeginContact.add(collisionCut,this)

    }

    function collisionCut(body, bodyB, shapeA, shapeB, equatio){
        if(!gameActive){
            return
        }

        if(body==null){
            return
        }

        if(body.name == "touch" || body.name == "blade"){
            return
        }

        if(!canCut){
            return
        }

        if(inExtraPoints){
            return
        }

        if(body.name == "extra"){
            activateExtra()
            return
        }


        if(body.name == "bomb" && body.sprite.visible){
            stopGame()
            setExplosion(body.sprite,0)
            sound.play("explode")
        }
        else if(body.name=="correct" && body.sprite.visible){
            starParticles(body.sprite,"migajas_"+body.key)
            addPoint(1,body)
            hitComboArray.push(game.time.now)
            if(hitComboArray.length>=3){
                if(game.time.now - hitComboArray[hitComboArray.length-3] < HIT_COMBO_TIME){
                    //addPoint(1,body)
                }
            }


            createPartTamal(body.key+'_p1',body.x,body.y,body.angularVelocity,body.velocity.x,body.velocity.y)
            createPartTamal(body.key+'_p2',body.x,body.y,-body.angularVelocity,-body.velocity.x,body.velocity.y)
          
        }

        body.sprite.visible = false
        body.setZeroVelocity()
        body.data.gravityScale = 0
        body.y = game.world.height + 100
        body.sprite.wait = -1
        

    }

    function createPartTamal(key,x,y,angular,velX,velY){
    	var o = null
    	for(var i = 0; i < partsGroup.length; i++){
            if(!partsGroup.children[i].visible){
                o = partsGroup.children[i]
               	o.visible = true
               	o.body.gravityScale = 1
                o.loadTexture('atlas.rafaga_de_tamales',key,0,false)
                break
                //return partsGroup.children[i]
            }
        }
        if(o==null){

        	o = partsGroup.create(0,0,'atlas.rafaga_de_tamales',key)
        	o.anchor.setTo(0.5)

        	game.physics.p2.enable(o)

     		o.body.name = "touch"

     		//o.body.data.gravityScale = 0;
        	o.body.data.shapes[0].sensor = true
        }

        o.body.x = x
        o.body.y = y

        o.body.angularVelocity = angular
        o.body.velocity.x = velX
        o.body.velocity.y = velY
    }

    function activateExtra(){
        //console.log("Activate extra")
        inExtraPoints = true
        for(var i = 0; i < cutObjectsGroup.length; i++){
            if(cutObjectsGroup.children[i].visible){
                cutObjectsGroup.children[i].body.setZeroVelocity()
                cutObjectsGroup.children[i].body.data.gravityScale = 0
                cutObjectsGroup.children[i].body.angularVelocity = 0
            }
        }

        for(var i = 0; i < bombGroup.length; i++){
            if(bombGroup.children[i].visible){
                bombGroup.children[i].body.setZeroVelocity()
                bombGroup.children[i].body.data.gravityScale = 0
                bombGroup.children[i].body.angularVelocity = 0
            }
        }
        extraPointsObject.body.setZeroVelocity()
        extraPointsObject.body.angularVelocity = 0

        setTimeout(desactivateExtra,TIME_EXTRA_POINTS)
    }

    function desactivateExtra(){
        
        for(var i = 0; i < cutObjectsGroup.length; i++){
            if(cutObjectsGroup.children[i].visible){
                addPoint(1,cutObjectsGroup.children[i].body)
                createPartTamal(cutObjectsGroup.children[i].body.key+'_p1',cutObjectsGroup.children[i].body.x,cutObjectsGroup.children[i].body.y,game.rnd.integerInRange(-3,3),game.rnd.integerInRange(-10,10),1)
            	createPartTamal(cutObjectsGroup.children[i].body.key+'_p2',cutObjectsGroup.children[i].body.x,cutObjectsGroup.children[i].body.y,game.rnd.integerInRange(-3,3),game.rnd.integerInRange(-10,10),1)
            	//addPoint(1,cutObjectsGroup.children[i].body)
                cutObjectsGroup.children[i].visible = false
                cutObjectsGroup.children[i].body.x = -100
                cutObjectsGroup.children[i].body.y = -100



            }
        }

        for(var i = 0; i < bombGroup.length; i++){
            if(bombGroup.children[i].visible){
                bombGroup.children[i].visible = false
                bombGroup.children[i].body.x = -100
                bombGroup.children[i].body.y = -100
            }
        }

        extraPointsObject.visible = false
        extraPointsObject.body.x = -200
        extraPointsObject.body.y = -200
        inExtraPoints = false

        shade.alpha = 0

        if(!inRound){
        	startNewRound()
        }
    }

    function createBlade(){
        bladeGroup = game.add.group()
        sceneGroup.add(bladeGroup)
        var starsWithBody = 10
        for(var i = 1; i < BLADE_COUNT; i++){
            var blade = bladeGroup.create(0,0,'atlas.rafaga_de_tamales','rafaja')
            blade.scale.setTo(BLADE_INITIAL_SCALE - (BLADE_DELTA*i))
            blade.anchor.setTo(0.5,0.5)
            blade.alpha = 0
            blade.normalScale = blade.scale.x
            if(i<starsWithBody){
                game.physics.p2.enable(blade,false);
                blade.body.static = true
                blade.body.data.shapes[0].sensor = true
                blade.body.onBeginContact.add(collisionCut,this)
                blade.body.name="blade"

            }
        }
    }
    

    function create(){

        sceneGroup = game.add.group()

        var background = game.add.sprite(game.world.centerX,game.world.centerY,'atlas.rafaga_de_tamales','background')
        background.anchor.setTo(0.5)
        sceneGroup.add(background)

        var scaleX = game.world.width/background.width
        var scaleY = game.world.height/background.height

        if(scaleX > scaleY){
            if(scaleX > 1){
                background.scale.setTo(scaleX)
            }
        }
        else{
            if(scaleY > 1){
                background.scale.setTo(scaleY)
            }
        }

        game.physics.startSystem(Phaser.Physics.P2JS)
        game.physics.p2.gravity.y = 400;
        game.physics.p2.setBoundsToWorld(false,false,false,false,false)
        sceneGroup.add(background)

        

       

        cutObjectsGroup = game.add.group()
        sceneGroup.add(cutObjectsGroup)

        bombGroup = game.add.group()
        sceneGroup.add(bombGroup)

        partsGroup = game.add.group()
        sceneGroup.add(partsGroup)
        
        shade = game.add.graphics(0, 0);
        shade.beginFill(0x000000, 1);
    	shade.drawRect(0,0 , game.world.width, game.world.height);
    	shade.endFill()
    	shade.alpha = 0

    	sceneGroup.add(shade)
        
       	extraPointsObject = game.add.sprite(-200,-200,'atlas.rafaga_de_tamales','combo')
        extraPointsObject.anchor.setTo(0.5)

        game.physics.p2.enable(extraPointsObject,false);
        extraPointsObject.body.data.gravityScale = 0
        extraPointsObject.body.data.shapes[0].sensor = true
        extraPointsObject.body.name = "extra"
        extraPointsObject.visible = false
         sceneGroup.add(extraPointsObject)

        
        //game.physics.p2.setImpactEvents(true);
        
        loadSounds()
        initialize()  
        
        objectsGroup = game.add.group()
        sceneGroup.add(objectsGroup)
        
        
        game.onPause.add(function(){
			
			game.sound.mute = true
			if(amazing.getMinigameId()){
				marioSong.pause()
			}
			
		} , this);

		game.onResume.add(function(){
			game.sound.mute = false
			
			if(amazing.getMinigameId()){
				if(lives>0){
					marioSong.play()
				}
			}
			
		}, this);
        
        
            
		if(!amazing.getMinigameId()){
			
			marioSong = game.add.audio('arcadeSong')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.3)
			}, this);
		}
        
        
        createPointsBar()
        createHearts()
        animateScene()

        createTouchCut()
        //createCutObject()
        startNewRound()
        
        createBlade()
        createObjects()



    }

    
	return {
		assets: assets,
		name: "rafaga_de_tamales",
		create: create,
        preload: preload,
        update: update,
	}
}()

function lerp(a,b,t){
   return a + t * (b - a);
}