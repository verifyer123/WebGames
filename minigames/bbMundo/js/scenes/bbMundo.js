var soundsPath = "../../shared/minigames/sounds/"
var bbMundo = function(){

	var FOOD_TYPE = {
		GOOD:1,
		WRONG:2
	}

    var BABY_STATE = {
        HAPPY:1,
        NORMAL:2,
        CRYING:3
    }

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/bbMundo/atlas.json",
                image: "images/bbMundo/atlas.png",
            },
        ],
        images: [
            {
                name:"edificios",
                file:"images/bbMundo/edificios.png"
            },
            {
                name:"pasto",
                file:"images/bbMundo/pasto.png"
            },
            {
                name:"arbusto",
                file:"images/bbMundo/arbustos.png"
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
            {   name: "bite",
                file: soundsPath + "bite.mp3"},  
        ],
        
    }
    
    var INITIAL_LIVES = 3
    var INITIAL_PROBABILITY_WRONG_FOOD = 0.2
    var DELTA_PROBABILTY = 0.03
    var MAX_PROBABILiTY = 0.7
    var INITIAL_TIME_APPEAR = 1.5
    var DELTA_TIME_APPEAR = 0.02
    var NEW_DELTA = 0.003
    var MIN_TIME_APPEAR =0.5
    var MAX_GOOD = 3

    var DELTA_BAR = 0.0015
    var INITIAL_BAR_VALUE = 1

    var skinTable
    
    var gameIndex = 29
    var gameId = 100010
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null


    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var player
    var baby

    var currentTimeAppear
    var currentProbabilityWrong

    var foodGroup
    var arrayCurrentFood
    var canTap
    var currentGood, currentBad
    var barValue
    var timer
    var bebeSpine
    var marthaSpine

    var liveBar
    var babyIcon
    var tapArray

    var hitImage
    var spaceBar
    var canTouch

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        currentTimeAppear = INITIAL_TIME_APPEAR
        currentProbabilityWrong = INITIAL_PROBABILITY_WRONG_FOOD
        arrayCurrentFood = []
        canTap = true
        currentGood = 0
        currentBad = 0
        barValue = INITIAL_BAR_VALUE
        tapArray = []
        timer = 0
        MIN_TIME_APPEAR = 0.5
        DELTA_TIME_APPEAR = 0.02
        canTouch = true
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

        game.load.spine('bebe', "images/spines/bebe/bebe.json");
        game.load.spine('martha', "images/spines/martha/martha.json");
                
        if(amazing.getMinigameId()){
            
        }else{
            //game.load.audio('arcadeSong', soundsPath + 'songs/sillyAdventureGameLoop.mp3');
        }

        marioSong = sound.setSong(soundsPath + 'songs/sillyAdventureGameLoop.mp3',0.3)


    }

    
    function stopGame(win){

        heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        gameActive = false

        
        /*if(marioSong!=null){
            marioSong.pause()
        }else{
            
        }*/

        marioSong.pause()

        player.spine.setAnimationByName(0,"lose",true)
        baby.spine.setAnimationByName(0,"lose",true)
                
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
        
        if(!gameActive){
            return
        }

        if(spaceBar.isDown){
            if(canTouch){
                canTouch = false
                Tap()
            }
        }
        else{
            canTouch = true
        }

        if(timer < currentTimeAppear){
            //console.log(timer)
            timer+=game.time.elapsed/1000
        }
        else{
            timer = 0
            getFood()
        }

        for(var i =0; i < arrayCurrentFood.length;i++){
        	arrayCurrentFood[i].x+=arrayCurrentFood[i].veltX
        	arrayCurrentFood[i].y+=arrayCurrentFood[i].veltY
        	arrayCurrentFood[i].veltX+=arrayCurrentFood[i].deltatX
        	arrayCurrentFood[i].veltY+=arrayCurrentFood[i].deltatY
        	if(arrayCurrentFood[i].scale.x < 1){
        		arrayCurrentFood[i].scale.setTo(arrayCurrentFood[i].scale.x+arrayCurrentFood[i].deltatScale)
        		
        	}

        	if(arrayCurrentFood[i].y>game.world.height-400 && arrayCurrentFood[i].deltatScale>0){
        		arrayCurrentFood[i].deltatScale = -arrayCurrentFood[i].deltatScale*3
        		arrayCurrentFood[i].scale.setTo(1+arrayCurrentFood[i].deltatScale)
        	}
        }
        if(arrayCurrentFood.length!=0){
	        if(arrayCurrentFood[0].x < baby.x+10){
	        	arrayCurrentFood[0].visible = false
                baby.isEating = true

	        	if(arrayCurrentFood[0].type == FOOD_TYPE.WRONG){
                    baby.spine.setAnimationByName(0,"eat_bad",false).onComplete = function(){
                        baby.isEating = false
                        babySetIdle()
                    }
                    
	        		missPoint()
	        	}
	        	else{
                   
	        		addPoint(1,{x:game.world.width-50,y:50})
                    barValue = INITIAL_BAR_VALUE
                    baby.spine.setAnimationByName(0,"eat_good",false).onComplete = function(){
                        baby.isEating = false
                        babySetIdle()
                    }
                    
	        	}
	        	sound.play("bite")
	        	arrayCurrentFood.splice(0,1)
	        	
	        }
	    }

        barValue-=DELTA_BAR
        changeLive()


        if(barValue <= INITIAL_BAR_VALUE/3 && !baby.isCrying){
            //baby cry
            baby.isCrying = true
        }
        else if(barValue >= INITIAL_BAR_VALUE/3 && baby.isCrying){
            baby.isCrying = false
        }

        if(barValue<=0){
            stopGame()
        }

        /*if(game.input.activePointer.isDown){
        	
        }
        else{
        	canTap = true
        }*/
        
    }

    function Tap(){
    	if(canTap){
    		canTap = false
    		animTap()
            player.spine.setAnimationByName(0,"hit",false)
            player.spine.addAnimationByName(0,"idle",true)
            setTimeout(function(){
            	if(arrayCurrentFood.length!=0){
	        		if(arrayCurrentFood[0].x < baby.x +75 && arrayCurrentFood[0].x > baby.x + 10){
	        			sound.play("pop")
	        			hitImage.x = arrayCurrentFood[0].x
	        			hitImage.y = arrayCurrentFood[0].y
	        			hitImage.visible = true
	        			setTimeout(function(){
	        				hitImage.visible = false
	        			},100)

	        			var t = game.add.tween(arrayCurrentFood[0]).to({x:arrayCurrentFood[0].x - 70, y:arrayCurrentFood[0].y - 150},500,Phaser.Easing.Quadratic.Out,true)
	        			game.add.tween(arrayCurrentFood[0].scale).to({x:0, y:0},500,Phaser.Easing.Quadratic.Out,true)
	        			t.onComplete.add(function(currentTarget){
	        				currentTarget.visible = false
	        			})
	        			hitImage.x = arrayCurrentFood[0].x
	        			if(arrayCurrentFood[0].type == FOOD_TYPE.GOOD){
	        				//missPoint()
	        				
	        			}
	        			else{
	        				addPoint(1,{x:game.world.width-50,y:50})
	        			}

	        			arrayCurrentFood.splice(0,1)
	        		}
	        	}
            },100)
    		
    	}
    }


    function changeLive(){

        liveBar.mask.scale.setTo(barValue/INITIAL_BAR_VALUE, 1)
        if(barValue <= 0){
            stopGame()
            /*if(lives > 0){
                barValue = INITIAL_BAR_VALUE
            }*/
        }
        else{
            if(barValue > (INITIAL_BAR_VALUE/3)*2 ){
                if(baby.state!=BABY_STATE.HAPPY){
                    baby.state = BABY_STATE.HAPPY
                    babyIcon.loadTexture("atlas.game","icon_happy")
                    //console.log("SetHappy")
                    if(!baby.isEating){
                        babySetIdle()
                    }
                }

            }
            else if(barValue > INITIAL_BAR_VALUE/3){
                if(baby.state!=BABY_STATE.NORMAL){
                    baby.state = BABY_STATE.NORMAL
                    babyIcon.loadTexture("atlas.game","icon_normal")
                    //console.log("SetNormal")
                    if(!baby.isEating){
                        babySetIdle()
                    }
                }

            }

            else if(barValue > 0 ){
                if(baby.state!=BABY_STATE.CRYING){
                    baby.state = BABY_STATE.CRYING
                    babyIcon.loadTexture("atlas.game","icon_sad")
                    //console.log("Setcraying")
                    if(!baby.isEating){
                        babySetIdle()
                    }
                }

            }
        }
    }

    function babySetIdle(){
        if(baby.state == BABY_STATE.HAPPY){
            baby.spine.setAnimationByName(0,"idle_happy",true)
        }
        else if(baby.state == BABY_STATE.NORMAL){
            baby.spine.setAnimationByName(0,"idle",true)
        }
        else if(baby.state == BABY_STATE.CRYING){
            baby.spine.setAnimationByName(0,"idle_cry",true)
        }
    }


    function setRound(){
        //timer = setTimeout(getFood,INITIAL_TIME_APPEAR)
    }

    function getFood(){

    	if(!gameActive){
    		return
    	}

    	if(currentTimeAppear > MIN_TIME_APPEAR){
            if(currentTimeAppear > 0){
        		currentTimeAppear-=DELTA_TIME_APPEAR
                if(currentTimeAppear <=0){
                    currentTimeAppear = 0
                }
            }
    	}
        else{
            MIN_TIME_APPEAR = 0
            DELTA_TIME_APPEAR = NEW_DELTA

        }

    	if(currentProbabilityWrong < MAX_PROBABILiTY){
    		currentProbabilityWrong+=DELTA_PROBABILTY
    	}

    	var type = FOOD_TYPE.GOOD
    	
    	if((game.rnd.frac() < currentProbabilityWrong || currentGood>=MAX_GOOD) && currentBad<MAX_GOOD){
    		type = FOOD_TYPE.WRONG
    		currentGood = 0
    		currentBad++
    	}
    	else{
    		currentGood++
    		currentBad = 0
    	}



    	var food
    	for(var i =0; i < foodGroup.length; i++){
    		if(!foodGroup.children[i].visible){
    			food = foodGroup.children[i]
    			food.visible = true
    			break
    		}
    	}

    	if(food == null){
    		food = foodGroup.create(0,0,"atlas.game","good1")
            food.anchor.setTo(0.5)
    	}

    	food.scale.setTo(0)
    	food.x = game.world.centerX+100
    	food.y = game.world.centerY-60
    	food.veltX = -0.3
    	food.deltatX = -0.015
    	food.veltY = -7
    	food.deltatY = 0.18
    	arrayCurrentFood.push(food)
    	food.deltatScale = 0.013
    	food.type = type

    	if(type == FOOD_TYPE.GOOD){
            food.loadTexture("atlas.game","good"+game.rnd.integerInRange(1,8))
    	}else{
            food.loadTexture("atlas.game","bad"+game.rnd.integerInRange(1,6))
    	}



    	//timer = setTimeout(getFood,currentTimeAppear)

    }

    function createPlayer(){
    	player = game.add.graphics()
    	player.x = game.world.centerX - 160
    	player.y = game.world.height - 50
    	player.beginFill(0xff0000)
    	player.drawRect(-50,-50,100,100)
        player.alpha = 0
    	player.endFill()
    	sceneGroup.add(player)

        player.spine = game.add.spine(game.world.centerX - 160,game.world.height,"martha")
        player.spine.setSkinByName("normal")
        player.spine.setAnimationByName(0,"idle",true)
        //player.addChild(player.spine)
        sceneGroup.add(player.spine)

        var shadowbaby = sceneGroup.create(game.world.centerX-40, game.world.height - 60,"atlas.game","sombra_andadera")
        shadowbaby.anchor.setTo(0.5)

    	baby = game.add.graphics()
    	baby.x = game.world.centerX - 40
    	baby.y = game.world.height - 50
    	baby.beginFill(0x00ff00)
    	baby.drawRect(-25,-25,50,50)
        baby.alpha = 0
    	baby.endFill()
    	sceneGroup.add(baby)
        baby.isCrying = false
        baby.state = BABY_STATE.HAPPY
        baby.isEating = false

        baby.spine = game.add.spine(game.world.centerX - 40,game.world.height - 40,"bebe")
        baby.spine.setSkinByName("normal")
        baby.spine.setAnimationByName(0,"idle_happy",true)
        //baby.addChild(baby.spine)
        sceneGroup.add(baby.spine)

        foodGroup = game.add.group()
        sceneGroup.add(foodGroup)

        hitImage = sceneGroup.create(0,0,"atlas.game","hit")
        hitImage.anchor.setTo(0.5)
        hitImage.visible = false
        
    }

    function createBackground(){

        var background = game.add.graphics()
        background.beginFill(0xd4f7ff)
        background.drawRect(0,0,game.world.width,game.world.height)
        background.endFill()
        sceneGroup.add(background)

        var edificios = game.add.tileSprite(0,game.world.height-900,game.world.width,512,"edificios")
        sceneGroup.add(edificios)

        var sand = game.add.tileSprite(0,game.world.height-200,game.world.width,200,"atlas.game","tierra")
        sceneGroup.add(sand)

        var arbusto = game.add.tileSprite(0,game.world.height-600,game.world.width,256,"arbusto")
        sceneGroup.add(arbusto)

        var pasto = game.add.tileSprite(0,game.world.height-436,game.world.width,256,"pasto")
        sceneGroup.add(pasto)

        var arenero = sceneGroup.create(game.world.width,game.world.height-250,"atlas.game","arenero")
        arenero.anchor.setTo(0.5)

        var columpio = sceneGroup.create(game.world.width - 150,game.world.height-350,"atlas.game","columpio")
        columpio.anchor.setTo(0.5)

        var picnic = sceneGroup.create(game.world.centerX + 50,game.world.height-280,"atlas.game","picnic")
        picnic.anchor.setTo(0.5)

        var banca = sceneGroup.create(game.world.centerX - 100,game.world.height-320,"atlas.game","banca")
        banca.anchor.setTo(0.5)

        var button = sceneGroup.create(game.world.width-100,game.world.height-100,"atlas.game","boton_off")
        button.anchor.setTo(0.5)
        button.inputEnabled= true
        button.events.onInputDown.add(function(){
        	button.loadTexture("atlas.game","boton_on")
        	Tap()
        })

        button.events.onInputUp.add(function(){
        	button.loadTexture("atlas.game","boton_off")
        	canTap = true
        })

        var tap = sceneGroup.create(button.x-60,button.y - 70,"atlas.game","tap")
        tap.anchor.setTo(0.5)
        tap.angle = -30
        tap.scale.setTo(0)
        tap.alpha = 0
        tap.maxScale = 0.9
        tapArray.push(tap)

        tap = sceneGroup.create(button.x-20,button.y - 130,"atlas.game","tap")
        tap.anchor.setTo(0.5)
        tap.angle = -10
        tap.alpha = 0
        tap.scale.setTo(0)
        tap.maxScale = 1
        tapArray.push(tap)

        tap = sceneGroup.create(button.x+40,button.y - 80,"atlas.game","tap")
        tap.anchor.setTo(0.5)
        tap.angle = 20
        tap.alpha = 0
        tap.scale.setTo(0)
        tap.maxScale = 0.95
        tapArray.push(tap)



        var containerBar = sceneGroup.create(game.world.centerX-205,100,"atlas.game",'contenedor_vida')
        containerBar.anchor.setTo(0,0.5)

        liveBar = sceneGroup.create(containerBar.x+5,containerBar.y,"atlas.game",'barra_vida')
        liveBar.anchor.setTo(0,0.5)
        liveBar.canDecrease = true

        babyIcon = sceneGroup.create(containerBar.x+(containerBar.width)+40,containerBar.y,"atlas.game","icon_happy")
        babyIcon.anchor.setTo(0.5)

        var mask = game.add.graphics(0,0)
        mask.beginFill(0xff0000)
        mask.drawRect(0,-25, 330,50)
        mask.endFill()
        liveBar.mask = mask
        liveBar.addChild(mask)

    }

    function animTap(){
    	var indexArray = [0,1,2]
    	var tap
    	while(tap==null && indexArray.length>0){
    		var r = game.rnd.integerInRange(0,indexArray.length-1)
    		if(tapArray[r].alpha == 0){
    			tap = tapArray[r]
    		}
    		else{
    			indexArray.splice(r,1)
    		}
    	}

    	if(tap==null){
    		/*var r = game.rnd.integerInRange(0,2)
    		tap = tapArray[r]
    		if(tap.tween!=null){
    			tap.tween.stop()
    		}*/
    		return
    	}

    	tap.scale.setTo(0)
    	tap.alpha = 0

    	game.add.tween(tap.scale).to({x:tap.maxScale,y:tap.maxScale},200,Phaser.Easing.linear,true)
    	var tween = game.add.tween(tap).to({alpha:1},200,Phaser.Easing.linear,true)
    	tween.onComplete.add(function(){
    		game.add.tween(tap.scale).to({x:0,y:0},200,Phaser.Easing.linear,true)
    		tween = game.add.tween(tap).to({alpha:0},200,Phaser.Easing.linear,true)
    	})
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

        //game.camera.focusOnXY(game.world.centerX, game.world.centerY);

        initialize()

        createBackground()
        createPlayer()



        game.onPause.add(function(){
			

			marioSong.pause()

			if(timer!=null){
				//clearTimeout(timer)
			}
			
	        game.sound.mute = true
	    } , this);

	    game.onResume.add(function(){
			

			if(lives > 0){
				marioSong.play()
				if(timer == null){
					//timer = setTimeout(getFood,currentTimeAppear)
				}
			}
			
			
			
	        game.sound.mute = false
	    }, this);

        spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        createPointsBar()
        createHearts()

        animateScene()

        loadSounds()

        createObjects()
        setRound()

    }

    
    return {
        assets: assets,
        name: "bbMundo",
        create: create,
        preload: preload,
        update: update
    }
}()