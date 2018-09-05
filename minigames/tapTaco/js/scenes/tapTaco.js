var soundsPath = "../../shared/minigames/sounds/"
var tapTaco = function(){

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/tapTaco/atlas.json",
                image: "images/tapTaco/atlas.png",
            },
        ],
        images: [
            {   name: "grass",
                file: "images/tapTaco/grass.png"},
            {   name: "ground",
                file: "images/tapTaco/ground.png"},
            {   name: "background_tile",
                file: "images/tapTaco/background_tile.png"},

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
            {   name: "cut",
                file: soundsPath + "shootBall.mp3"},  
            {   name: "explode",
                file: soundsPath + "explode.mp3"},
            {   name: "cheers",
                file: soundsPath + "cheers.mp3"},
            {   name: "fireExplosion",
                file: soundsPath + "fireExplosion.mp3"},
            {   name: "knockOut1",
                file: soundsPath + "knockOut1.mp3"},
            {   name: "powerUp",
                file: soundsPath + "laserPull.mp3"},
            {   name: "powerUp2",
                file: soundsPath + "swordSmash.mp3"},
            {   name: "shield",
                file: soundsPath + "shield.mp3"},
        ],
        
    }
    
    var INITIAL_LIVES = 1
    var INITIAL_LIFE = 100
    var DELTA_LIFE = 25
    var INITIAL_TIME = 40000
    var DELTA_TIME = 100
    var INITIAL_TIME_ATTACK = 8000
    var DELTA_TIME_ATTACK = 100
    var RANGE_TIME_ATTACK = 500
    var MIN_TIME_ATTACK = 2000
    var TIME_RESTORE_HIT = 2000
    
    var TOTAL_MONSTERS = 5
    var COINS_MOVE_TIME = 400
    var COIN_TIME = 8000

    var TACO_VELOCITY_X = 10
    var TACO_VELOCITY_Y = 20
    var TACO_GRAVITY = 2
    var TACO_Y_DISSAPEAR
    var TACO_DELTA_ALPHA_DISSAPEAR = 0.1

    var TACOS_TO_COIN = 5
    var COIN_BY_TACOS = 5
    var COIN_VELOCITY_X = 8
    var COIN_VELOCITY_Y = 20
    var COIN_GRAVITY = 2
    var TACO_Y_DISSAPEAR

    var SPECIAL_MAX_TIME = 12000

    var TIME_CHANGE_FRAME_EXPLOSION = 100

    var TIME_ANTICIPATION = 800

    var ANIMATIONS_SEQUENCE = [1,2,3,1,4,2,3]

    var SPECIAL_DAMAGE = 4
    var SPECIAL_DAMAGE_TIME = 200


    var BOSS_NAMES = ["PASTOR","CANASTA","ASADA","COCHINITA","ACORAZADO"]

    var gameIndex = 31
    var gameId = 1000018 
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null


    var particlesGroup
    var particlesUsed
    var heartsGroup = null
    var spaceBar

    var canTap
    var lifeAmount, timeAmount, roundLife, roundTime
    var timeToAttack, currentTimeAttack, monsterInAttack
    var currentLevel

    var barLive, barTime, barLiveMask, barTimeMask
    var bossTextName, bossTextTime, bossTextLive
    var bossTextName2, bossTextTime2, bossTextLive2

    var inDefense, hitted
    var currentMonster
    var specialTime, specialArc, specialButton

    var coinGroup
    var tacoGroup
    var monster
    var clientesArray

    var createdTacos

    var hitGroup

    var explosionAnim
    var inBoss

    var taquero
    var inSpecial
    var timeSpecial
    var markArray, currentMarkId

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        TACO_Y_DISSAPEAR = game.world.centerY-50
        COIN_Y_DISSAPEAR = game.world.centerY+230
        lifeAmount = INITIAL_LIFE
        timeAmount = INITIAL_TIME
        canTap = true
        currentLevel = 0
        inDefense = false
        hitted = false
        inBoss = true
        currentMonster = -1
        createdTacos = 0
        specialTime = 0
        hitImagesArray = []
        inSpecial = false
        markArray = []
        currentMarkId = 0
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
            marioSong = sound.setSong(soundsPath + 'songs/la_fiesta.mp3',0.3)
        }else{
            game.load.audio('arcadeSong', soundsPath + 'songs/la_fiesta.mp3');
        }

        game.load.spine('monster', "images/spines/monsters/monsters.json");
        game.load.spine('cliente1', "images/spines/clientes/cliente1.json");
        game.load.spine('cliente2', "images/spines/clientes/cliente2.json");
        game.load.spine('cliente3', "images/spines/clientes/cliente3.json");
        game.load.spine('cliente4', "images/spines/clientes/cliente4.json");
        game.load.spine('cliente5', "images/spines/clientes/cliente5.json");
        game.load.spine('taquero', "images/spines/taquero/taquero.json");

    }

    
    function stopGame(win){

        heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        gameActive = false
        taquero.setAnimationByName(0,"lose",true)
        
        if(amazing.getMinigameId() && marioSong!=null){
            marioSong.pause()
        }else{
            marioSong.stop()
        }
                
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
        tweenScene.onComplete.add(function(){
            game.onResume.removeAll()
            game.onPause.removeAll()
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

    	if(!gameActive){
    		return
    	}

       	/*if(game.input.activePointer.isDown || spaceBar.isDown){
            if(canTap){
                tap()
            }
        }   
    
        if(!game.input.activePointer.isDown && !spaceBar.isDown){
            canTap = true
        }*/

        updateSpecial()

        var coin 
        for(var i =0; i < coinGroup.length; i++){
            if(coinGroup.children[i].visible){
                coin = coinGroup.children[i]

                if(coin.tapped){

                    if(coin.currentTime>=COINS_MOVE_TIME){
                        addPoint(1,{x:game.world.width-80,y:80})
                        coin.visible = false

                    }
                    else{
                        coin.x = lerp(coin.startX,game.world.width-80,(coin.currentTime/COINS_MOVE_TIME))
                        coin.y = lerp(coin.startY,80,(coin.currentTime/COINS_MOVE_TIME))
                        coin.currentTime += game.time.elapsed
                    }
                }
                else{
                    if(coin.timeMove < game.time.now){
                        coin.tapped = true
                        coin.startX = coin.x
                        coin.startY = coin.y
                    }
                    else{
                        if(coin.y < COIN_Y_DISSAPEAR){
                            coin.x += coin.vel_X
                            coin.y += coin.vel_Y
                           
                            coin.vel_Y+=COIN_GRAVITY
                        }
                        else{
                        	coin.y = COIN_Y_DISSAPEAR
                        }
                        
                    }
                }

            }
        }

        var taco
        for(var i =0; i < tacoGroup.length; i++){
            if(tacoGroup.children[i].visible){
                taco = tacoGroup.children[i]
                taco.x += taco.vel_X
                taco.y += taco.vel_Y
                taco.vel_Y+=TACO_GRAVITY
                if(taco.y > TACO_Y_DISSAPEAR){
                    taco.alpha-=TACO_DELTA_ALPHA_DISSAPEAR
                    if(taco.alpha<=0){
                        taco.visible = false
                    }
                }
            }
        }

        for(var i =0; i < hitGroup.length; i++){
            if(hitGroup.children[i].visible){
                var hit = hitGroup.children[i]
                if(hit.disapearTime<game.time.now){
                    hit.visible = false
                }
            }
        }
        if(inBoss){
	        updateTimeBar()

	        if(currentTimeAttack < game.time.now && !inSpecial){
	        	monsterInAttack = true

	        	if(timeToAttack > MIN_TIME_ATTACK){
	        		timeToAttack-=DELTA_TIME_ATTACK
	        	}

	        	currentTimeAttack = timeToAttack + game.rnd.integerInRange(-RANGE_TIME_ATTACK, RANGE_TIME_ATTACK) + game.time.now
	        	monster.setAnimationByName(0,"anticipation",false)
	        	setTimeout(function(){
	        		if(!inSpecial){
	        			enemyAttack()
	        		}
	        	},TIME_ANTICIPATION)
	        }
	    }
	    else{
	    	if(explosionAnim.currentTime < game.time.now){
	    		explosionAnim.idFrame++
	    		if(explosionAnim.idFrame <= 6){
	    			explosionAnim.loadTexture("atlas.game","boss_smoke"+explosionAnim.idFrame)
	    			explosionAnim.currentTime = game.time.now + TIME_CHANGE_FRAME_EXPLOSION
	    		}
	    		else if(explosionAnim.idFrame == 7){
	    			setTimeout(setRound,500)
	    		}
	    	}
	    }

	    if(inSpecial){
	    	if(timeSpecial<game.time.now){
	    		monster.setAnimationByName(0,"hit",false)
	        	monster.addAnimationByName(0,"idle",true)
	    		timeSpecial = game.time.now + SPECIAL_DAMAGE_TIME
	    		lifeAmount-=SPECIAL_DAMAGE
	    		if(lifeAmount <0){
	    			lifeAmount = 0
	    		}
	    		updateLifeBar()
	    		markArray[currentMarkId].alpha = 1
	    		markArray[currentMarkId].visible = true
	    		currentMarkId ++
	    		if(currentMarkId >= markArray.length){
	    			currentMarkId = 0
	    		}
	    	}

	    }

	    for(var i =0; i < markArray.length; i++){
	    	if(markArray[i].alpha !=0){
	    		markArray[i].alpha-=0.05
	    		if(markArray[i].alpha<=0){
	    			markArray[i].alpha = 0
	    			markArray[i].visible = false
	    		}
	    	}
	    }
    }


    function tap(){

    	//1,2,3,1,4,2,3

        if(hitted){
            return
        }

        if(!inBoss){
        	return
        }
        if(inSpecial){
        	return
        }

        canTap = false

        lifeAmount-=1

        sound.play("cut")

        if(!monsterInAttack){
	        monster.setAnimationByName(0,"hit",false)
	        monster.addAnimationByName(0,"idle",true)
	    }
	    if(!taquero.inAnim){
		    var anim =  taquero.setAnimationByName(0,"hit"+ANIMATIONS_SEQUENCE[taquero.currentIdAnim],false)
		    taquero.currentIdAnim ++
		    if(taquero.currentIdAnim>=ANIMATIONS_SEQUENCE.length){
		    	taquero.currentIdAnim = 0
		    }
		    taquero.inAnim = true
		    anim.onComplete = function(){
		    	taquero.inAnim = false
		    }
		    taquero.addAnimationByName(0,"idle",false)
		}
	   

        getHit(game.rnd.integerInRange(game.world.centerX-200,game.world.centerX+200),game.rnd.integerInRange(game.world.centerY-200,game.world.centerY+200))

        updateLifeBar()

        createTaco()
        createdTacos++
        if(createdTacos>=TACOS_TO_COIN){
            createCoin()
            createdTacos = 0
        }

        //monsterAnimation

        //playerAnimation
    }

    function makeSpecial(){
        if(hitted){
            return
        }

        sound.play("powerUp")
        sound.play("powerUp2")
        inSpecial = true
        taquero.inAnim = false
        timeSpecial = game.time.now + SPECIAL_DAMAGE_TIME
        //special animation
        var anim = taquero.setAnimationByName(0,"hit_special",false)
        anim.onComplete = function(){
        	inSpecial = false
        	specialTime = 0
        	if(lifeAmount<=0){
        		endRound()
        	}
        }
        taquero.addAnimationByName(0,"idle",true)
    }

    function startDefense(){

    	if(inSpecial){
    		return
    	}
    	if(hitted){
    		return
    	}
    	taquero.inAnim = false
        //defense animation
        inDefense = true
        taquero.setAnimationByName(0,"shield",true)

    }

    function stopDefense(){
    	if(inSpecial){
    		return
    	}
    	if(hitted){
    		return
    	}

    	taquero.inAnim = false
        inDefense = false
        taquero.setAnimationByName(0,"idle",true)
    }

    function enemyAttack(){
    	var anim = monster.setAnimationByName(0,"atack",false)
    	anim.onComplete = function(){
    		monsterInAttack = false
    	}
    	monster.addAnimationByName(0,"idle",true)
        if(!inDefense){
            //player hit and cannot attack
            sound.play("knockOut1")
            taquero.inAnim = false
            hitted = true
            taquero.setAnimationByName(0,"dazed",true)
            console.log("Hitted")
            setTimeout(restoreHit,TIME_RESTORE_HIT)
        }
        else{
        	sound.play("shield")
        }
    }

    function restoreHit(){
        hitted = false
        console.log("can tap again")
        taquero.inAnim = false
        taquero.setAnimationByName(0,"idle",true)

    }

    function updateTimeBar(){
        if(timeAmount<0){
            return
        }

        timeAmount-=game.time.elapsed;
        var porcentage = timeAmount/roundTime;
        //console.log("Time amount ",porcentage)
        barTime.x = barTime.endX + (porcentage*406)
        barTimeMask.x = barTime.x
        var secondsTime = Math.round(timeAmount/1000)
        bossTextTime.setText(secondsTime+" seg")
        bossTextTime2.setText(secondsTime+" seg")
        if(porcentage<=0){
            stopGame()
        }

    }

    function updateLifeBar(){
        if(lifeAmount < 0){
            return
        }

        var porcentage = lifeAmount/roundLife
        barLive.x = barLive.endX + (porcentage*406)
        barLiveMask.x = barLive.x
        bossTextLive.setText(lifeAmount)
        bossTextLive2.setText(lifeAmount)
        if(lifeAmount<=0 && !inSpecial){
            //monsterDie
            //dropCoins
            endRound()
            //setTimeout(setRound,500)
        }
    }

    function updateSpecial(){
        if(specialTime < SPECIAL_MAX_TIME){
            specialTime += game.time.elapsed
            if(specialTime >= SPECIAL_MAX_TIME){
                specialTime = SPECIAL_MAX_TIME
                specialButton.inputEnabled = true
                specialButton.loadTexture("atlas.game","special_off")
            }

            var porcentage = specialTime/SPECIAL_MAX_TIME
            specialArc.clear()
            specialArc.lineStyle(8,0x00c251)
            specialArc.arc(0, 0, 50, 0, Math.PI*2*porcentage, false);
        }
    }

    function endRound(){
    	sound.play("cheers")
    	sound.play("fireExplosion")
    	monster.visible = false
    	explosionAnim.loadTexture("atlas.game","boss_smoke1")
    	explosionAnim.visible = true
    	explosionAnim.currentTime = game.time.now + TIME_CHANGE_FRAME_EXPLOSION
    	explosionAnim.idFrame = 1
    	inBoss = false
    	taquero.setAnimationByName(0,"win",true)

    	taquero.inAnim = false
    }

    function setRound(){
    	inBoss = true
    	taquero.setAnimationByName(0,"idle",true)
    	taquero.inAnim = false
        lifeAmount = INITIAL_LIFE + (DELTA_LIFE*currentLevel)
        timeAmount = INITIAL_TIME - (DELTA_TIME*currentLevel)
        timeToAttack = INITIAL_TIME_ATTACK - (DELTA_TIME_ATTACK*currentLevel)
        if(timeToAttack < MIN_TIME_ATTACK){
            timeToAttack = MIN_TIME_ATTACK
        }

        roundLife = lifeAmount
        roundTime = timeAmount

        currentTimeAttack = timeToAttack + game.rnd.integerInRange(-RANGE_TIME_ATTACK, RANGE_TIME_ATTACK) + game.time.now
        updateLifeBar()
        updateTimeBar()


        var temp = game.rnd.integerInRange(1,TOTAL_MONSTERS)
        console.log(temp,currentMonster)
        if(temp == currentMonster){
            currentMonster = game.rnd.integerInRange(0,TOTAL_MONSTERS)
        }
        else{
            currentMonster = temp
        }

        monster.setSkinByName("normal"+currentMonster)
        monster.setToSetupPose()
        monster.setAnimationByName(0,"idle",true)
        monster.visible = true

        if(currentMonster == 2){
            monster.y = game.world.centerY+290
        }
        else if(currentMonster == 4){
            monster.y = game.world.centerY+280
        }
        else{
            monster.y = game.world.centerY+250
        }

        bossTextName.setText(BOSS_NAMES[currentMonster-1])
        bossTextName2.setText(BOSS_NAMES[currentMonster-1])

        monsterInAttack = false
        hitted = false
        currentLevel++
    }

    

    function getHit(_x,_y){
        for(var i =0; i < hitGroup.length; i++){
            if(!hitGroup.children[i].visible){
                var hit = hitGroup.children[i]
                hit.visible = true
                hit.x = _x
                hit.y = _y
                hit.secondImage.scale.setTo(0)
                hit.secondImage.angle = game.rnd.integerInRange(0,360)
                var t = game.add.tween(hit.secondImage.scale).to({x:1,y:1},300,Phaser.Easing.linear,true)
                t.yoyo(true)
                hit.disapearTime = game.time.now + 600
                return
            }
        }

        var hit = hitGroup.create(_x,_y,"atlas.game","circle_hit")
        hit.anchor.setTo(0.5)


        var secondImage = hitGroup.create(0,0,"atlas.game","circle_smash")
        secondImage.anchor.setTo(0.5)
        secondImage.scale.setTo(0)
        secondImage.hit = hit
        secondImage.angle = game.rnd.integerInRange(0,360)
        hit.secondImage =secondImage
        hit.addChild(secondImage)

        var t = game.add.tween(hit.secondImage.scale).to({x:1,y:1},100,Phaser.Easing.linear,true)
        t.yoyo(true)
        hit.disapearTime = game.time.now + 200

    }

    function createTaco(){
        for(var i =0; i < tacoGroup.length; i++){
            if(!tacoGroup.children[i].visible){
                var taco = tacoGroup.children[i]
                taco.visible = true
                taco.alpha = 1
                taco.x = monster.x
                taco.y = monster.y-300
                var r = game.rnd.integerInRange(0,1)
                if(r == 0){
                    taco.vel_X = game.rnd.integerInRange(-TACO_VELOCITY_X,-TACO_VELOCITY_X+2)
                }
                else{
                    taco.vel_X = game.rnd.integerInRange(TACO_VELOCITY_X,TACO_VELOCITY_X-2)
                }
                taco.vel_Y = -game.rnd.integerInRange(TACO_VELOCITY_Y/2,TACO_VELOCITY_Y)
                //taco.timeToAlpha = game.time.now + TACO_TIME_DISSAPEAR
                taco.loadTexture("atlas.game","taco"+game.rnd.integerInRange(1,3))
                return
            }
        }

        var taco = tacoGroup.create(monster.x,monster.y-300,"atlas.game","taco"+game.rnd.integerInRange(1,3))
        taco.anchor.setTo(0.5)
        var r = game.rnd.integerInRange(0,1)
        if(r == 0){
            taco.vel_X = game.rnd.integerInRange(-TACO_VELOCITY_X,-TACO_VELOCITY_X+2)
        }
        else{
            taco.vel_X = game.rnd.integerInRange(TACO_VELOCITY_X,TACO_VELOCITY_X-2)
        }
        taco.vel_Y = -game.rnd.integerInRange(TACO_VELOCITY_Y/2,TACO_VELOCITY_Y)
        taco.alpha = 1
        //taco.timeToAlpha = game.time.now + TACO_TIME_DISSAPEAR

    }



    function createCoin(){

        for(var i =0; i < coinGroup.length; i++){
            if(!coinGroup.children[i].visible){
                var coin = coinGroup.children[i]
                coin.visible = true
                coin.tapped = false
                coin.x = monster.x
                coin.y = monster.y-300
                coin.vel_X = game.rnd.integerInRange(-COIN_VELOCITY_X,COIN_VELOCITY_X)
                coin.vel_Y = -game.rnd.integerInRange(COIN_VELOCITY_Y/2,COIN_VELOCITY_Y)
                coin.timeMove = game.time.now + COIN_TIME
                coin.currentTime = 0
                return coin
            }
        }

        var coin = coinGroup.create(monster.x,monster.y-300,"atlas.game","coin")
        coin.anchor.setTo(0.5)
        coin.scale.setTo(0.7)
        coin.tapped = false
        coin.inputEnabled = true
        coin.vel_X = game.rnd.integerInRange(-COIN_VELOCITY_X,COIN_VELOCITY_X)
        coin.vel_Y = -game.rnd.integerInRange(COIN_VELOCITY_Y/2,COIN_VELOCITY_Y)
        coin.events.onInputDown.add(tapCoin)
        coin.timeMove = game.time.now + COIN_TIME
        coin.currentTime = 0

    }

    function tapCoin(coinTarget){
        console.log("tapcoin",coinTarget)

        if(coinTarget.tapped){
            return
        }
        coinTarget.tapped = true
        coinTarget.startX = coinTarget.x
        coinTarget.startY = coinTarget.y
        coinTarget.currentTime = 0
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

    function createBackground(){
        var bmd = game.add.bitmapData(game.world.width, game.world.height)

        var y = 0;

        for (var i = 0; i < game.world.height/2; i++)
        {
            var c = Phaser.Color.interpolateColor(0xe3834e, 0xfbd385, game.world.height, i);

            bmd.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c));
            y += 2;
        }

        var background = game.add.sprite(0, 0, bmd);
        sceneGroup.add(background)

        var backImage = game.add.tileSprite(0,game.world.height-256-512,game.world.width,512,"background_tile")
        sceneGroup.add(backImage)

        var ground = game.add.tileSprite(0,game.world.height-256,game.world.width,256,"ground")
        sceneGroup.add(ground)
        
        var cliente



        var people = sceneGroup.create(game.world.width+110,game.world.height-230-190,"atlas.game","people2")
        people.anchor.setTo(1,1)

        clienteSpine = game.add.spine(game.world.width - 30, game.world.height-460, "cliente4")
        clienteSpine.setSkinByName("normal")
        clienteSpine.setAnimationByName(0,"idle",true)
        sceneGroup.add(clienteSpine)

        people = sceneGroup.create(game.world.width+100,game.world.height-230-160,"atlas.game","people1")
        people.anchor.setTo(1,1)

        clienteSpine = game.add.spine(game.world.width - 70, game.world.height-400, "cliente5")
        clienteSpine.setSkinByName("normal")
        clienteSpine.setAnimationByName(0,"idle",true)
        sceneGroup.add(clienteSpine)

        people = sceneGroup.create(game.world.width+70,game.world.height-230-110,"atlas.game","people2")
        people.anchor.setTo(1,1)

        people = sceneGroup.create(game.world.width+60,game.world.height-230-80,"atlas.game","people1")
        people.anchor.setTo(1,1)

        clienteSpine = game.add.spine(game.world.width - 110, game.world.height-320, "cliente1")
        clienteSpine.setSkinByName("normal")
        clienteSpine.setAnimationByName(0,"idle",true)
        sceneGroup.add(clienteSpine)

        clienteSpine = game.add.spine(game.world.width - 50, game.world.height-340, "cliente2")
        clienteSpine.setSkinByName("normal")
        clienteSpine.setAnimationByName(0,"idle",true)
        clienteSpine.scale.setTo(-1,1)
        sceneGroup.add(clienteSpine)

        people = sceneGroup.create(game.world.width+20,game.world.height-230-30,"atlas.game","people2")
        people.anchor.setTo(1,1)

        people = sceneGroup.create(game.world.width+10,game.world.height-230,"atlas.game","people1")
        people.anchor.setTo(1,1)

        clienteSpine = game.add.spine(game.world.width - 150, game.world.height-255, "cliente3")
        clienteSpine.setSkinByName("normal")
        clienteSpine.setAnimationByName(0,"idle",true)
        sceneGroup.add(clienteSpine)

        clienteSpine = game.add.spine(game.world.width - 90, game.world.height-255, "cliente4")
        clienteSpine.setSkinByName("normal")
        clienteSpine.setAnimationByName(0,"idle",true)
        sceneGroup.add(clienteSpine)

        clienteSpine = game.add.spine(game.world.width - 30, game.world.height-255, "cliente5")
        clienteSpine.setSkinByName("normal")
        clienteSpine.setAnimationByName(0,"idle",true)
        sceneGroup.add(clienteSpine)






        people = sceneGroup.create(-110,game.world.height-230-190,"atlas.game","people2")
        people.anchor.setTo(1,1)
        people.scale.setTo(-1,1)

        clienteSpine = game.add.spine(30, game.world.height-460, "cliente3")
        clienteSpine.setSkinByName("normal")
        clienteSpine.setAnimationByName(0,"idle",true)
        clienteSpine.scale.setTo(-1,1)
        sceneGroup.add(clienteSpine)

        people = sceneGroup.create(-100,game.world.height-230-160,"atlas.game","people1")
        people.anchor.setTo(1,1)
        people.scale.setTo(-1,1)

        clienteSpine = game.add.spine(70, game.world.height-400, "cliente4")
        clienteSpine.setSkinByName("normal")
        clienteSpine.setAnimationByName(0,"idle",true)
        clienteSpine.scale.setTo(-1,1)
        sceneGroup.add(clienteSpine)

        people = sceneGroup.create(-70,game.world.height-230-110,"atlas.game","people2")
        people.anchor.setTo(1,1)
        people.scale.setTo(-1,1)

        people = sceneGroup.create(-60,game.world.height-230-80,"atlas.game","people1")
        people.anchor.setTo(1,1)
        people.scale.setTo(-1,1)

        clienteSpine = game.add.spine(110, game.world.height-320, "cliente5")
        clienteSpine.setSkinByName("normal")
        clienteSpine.setAnimationByName(0,"idle",true)
        clienteSpine.scale.setTo(-1,1)
        sceneGroup.add(clienteSpine)

        clienteSpine = game.add.spine( 50, game.world.height-340, "cliente3")
        clienteSpine.setSkinByName("normal")
        clienteSpine.setAnimationByName(0,"idle",true)
        clienteSpine.scale.setTo(-1,1)
        sceneGroup.add(clienteSpine)

        people = sceneGroup.create(-20,game.world.height-230-30,"atlas.game","people2")
        people.anchor.setTo(1,1)
        people.scale.setTo(-1,1)

        people = sceneGroup.create(-10,game.world.height-230,"atlas.game","people1")
        people.anchor.setTo(1,1)
        people.scale.setTo(-1,1)

        clienteSpine = game.add.spine( 150, game.world.height-255, "cliente2")
        clienteSpine.setSkinByName("normal")
        clienteSpine.setAnimationByName(0,"idle",true)
        sceneGroup.add(clienteSpine)

        clienteSpine = game.add.spine(90, game.world.height-255, "cliente3")
        clienteSpine.setSkinByName("normal")
        clienteSpine.setAnimationByName(0,"idle",true)
        clienteSpine.scale.setTo(-1,1)
        sceneGroup.add(clienteSpine)

        clienteSpine = game.add.spine( 30, game.world.height-255, "cliente1")
        clienteSpine.setSkinByName("normal")
        clienteSpine.setAnimationByName(0,"idle",true)
        clienteSpine.scale.setTo(-1,1)
        sceneGroup.add(clienteSpine)

        var redShadow = sceneGroup.create(game.world.centerX,game.world.height-256,"atlas.game","red_light_people") 
        redShadow.anchor.setTo(0.5,1) 
        redShadow.scale.setTo(game.world.width/redShadow.width,1)

        var grass = game.add.tileSprite(0,game.world.height-256,game.world.width,64,"grass")
        sceneGroup.add(grass)

        var shadow = sceneGroup.create(game.world.centerX,game.world.height,"atlas.game","shadow")
        shadow.anchor.setTo(0.5,1)
        shadow.scale.setTo(game.world.width/shadow.width,1)

        var backBarLive = sceneGroup.create(game.world.centerX+206,120,"atlas.game","white_bar")
        backBarLive.anchor.setTo(1,0.5)

        var fontStyle = {font: "20px VAGRounded", fontWeight: "bold", fill: "#000000", align: "right"}
        bossTextLive2 = new Phaser.Text(sceneGroup.game, 0, 5, "300", fontStyle)
        bossTextLive2.x = game.world.centerX+203 - 50
        bossTextLive2.y = backBarLive.y-10 + 12
        bossTextLive2.anchor.setTo(1,0.5)
        sceneGroup.add(bossTextLive2)

        barLive = sceneGroup.create(game.world.centerX+203,120,"atlas.game","red_bar")
        barLive.anchor.setTo(1,0.5)
        barLive.endX = game.world.centerX-203

        /*barLiveMask = sceneGroup.create(game.world.centerX+203,120,"atlas.game","red_bar")
        barLiveMask.anchor.setTo(1,0.5)*/

        barLiveMask= game.add.graphics(game.world.centerX+203,120)
        barLiveMask.beginFill(0xffffff)
        barLiveMask.moveTo(10,-23)
        barLiveMask.lineTo(-22,23)
        barLiveMask.lineTo(-500,23)
        barLiveMask.lineTo(-500,-23)
        barLiveMask.lineTo(0,-23)
        barLiveMask.endFill()
        sceneGroup.add(barLiveMask)

        var mask = game.add.graphics()
        mask.beginFill(0xffffff)
        mask.drawRect(backBarLive.x - 410,backBarLive.y-22,406,45)
        mask.endFill()
        sceneGroup.add(mask)
        barLive.mask = mask

        var tacoIcone = sceneGroup.create(backBarLive.x-410,backBarLive.y-10,"atlas.game","icon_taco")
        tacoIcone.anchor.setTo(0.5)

        var fontStyle = {font: "20px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "right"}
        bossTextLive = new Phaser.Text(sceneGroup.game, 0, 5, "300", fontStyle)
        bossTextLive.x = barLive.x - 50
        bossTextLive.y = tacoIcone.y + 12
        bossTextLive.anchor.setTo(1,0.5)
        sceneGroup.add(bossTextLive)

        bossTextLive.mask = barLiveMask


        var backBarTime = sceneGroup.create(game.world.centerX+206,180,"atlas.game","white_small_bar")
        backBarTime.anchor.setTo(1,0.5)

        var fontStyle = {font: "15px VAGRounded", fontWeight: "bold", fill: "#000000", align: "left"}
        bossTextName2 = new Phaser.Text(sceneGroup.game, 0, 5, BOSS_NAMES[0], fontStyle)
        bossTextName2.x = backBarTime.x-410 + 50
        bossTextName2.y = backBarTime.y-10 +12
        bossTextName2.anchor.setTo(0,0.5)
        sceneGroup.add(bossTextName2)

        var fontStyle = {font: "15px VAGRounded", fontWeight: "bold", fill: "#000000", align: "right"}
        bossTextTime2 = new Phaser.Text(sceneGroup.game, 0, 5, "12 seg", fontStyle)
        bossTextTime2.x = game.world.centerX+203 - 20
        bossTextTime2.y = backBarTime.y-10 +12
        bossTextTime2.anchor.setTo(1,0.5)
        sceneGroup.add(bossTextTime2)

        barTime = sceneGroup.create(game.world.centerX+203,180,"atlas.game","orange_bar")
        barTime.anchor.setTo(1,0.5)
        barTime.endX = game.world.centerX-203


        barTimeMask= game.add.graphics(game.world.centerX+203,180)
        barTimeMask.beginFill(0xffffff)
        barTimeMask.moveTo(10,-23)
        barTimeMask.lineTo(-22,23)
        barTimeMask.lineTo(-500,23)
        barTimeMask.lineTo(-500,-23)
        barTimeMask.lineTo(0,-23)
        barTimeMask.endFill()
        sceneGroup.add(barTimeMask)

        mask = game.add.graphics()
        mask.beginFill(0xffffff)
        mask.drawRect(backBarTime.x - 410,backBarTime.y-22,406,45)
        mask.endFill()
        sceneGroup.add(mask)
        barTime.mask = mask

        var bossIcone = sceneGroup.create(backBarTime.x-410,backBarTime.y-10,"atlas.game","icon_boss")
        bossIcone.anchor.setTo(0.5)

        var fontStyle = {font: "15px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "left"}
        bossTextName = new Phaser.Text(sceneGroup.game, 0, 5, BOSS_NAMES[0], fontStyle)
        bossTextName.x = bossIcone.x + 50
        bossTextName.y = bossIcone.y +12
        bossTextName.anchor.setTo(0,0.5)
        sceneGroup.add(bossTextName)
        bossTextName.mask = barTimeMask

        var fontStyle = {font: "15px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "right"}
        bossTextTime = new Phaser.Text(sceneGroup.game, 0, 5, "12 seg", fontStyle)
        bossTextTime.x = barTime.x - 20
        bossTextTime.y = bossIcone.y +12
        bossTextTime.anchor.setTo(1,0.5)
        sceneGroup.add(bossTextTime)
        bossTextTime.mask = barTimeMask

        

        var attack = sceneGroup.create(game.world.centerX,game.world.height-110,"atlas.game","attack_off")
        attack.anchor.setTo(0.5)
        attack.scale.setTo(1.3)
        attack.inputEnabled = true
        attack.events.onInputDown.add(function(target){
            target.loadTexture("atlas.game","attack_on")
            tap()
        })
        attack.events.onInputUp.add(function(target){
            target.loadTexture("atlas.game","attack_off")
        })

        var defense = sceneGroup.create(game.world.centerX + 150,game.world.height-110,"atlas.game","shield_off")
        defense.anchor.setTo(0.5)
        defense.inputEnabled = true
        defense.events.onInputDown.add(function(target){
            target.loadTexture("atlas.game","shield_on")
            startDefense()
        })
        defense.events.onInputUp.add(function(target){
            target.loadTexture("atlas.game","shield_off")
            stopDefense()
        })

        specialArc = game.add.graphics(game.world.centerX-150,game.world.height-110)
        specialArc.lineStyle(8,0x00c251)
        specialArc.arc(0, 0, 50, 0, Math.PI/2, false);
        sceneGroup.add(specialArc)
        specialArc.angle = -90

        specialButton = sceneGroup.create(game.world.centerX-150,game.world.height-110,"atlas.game","special_on")
        specialButton.anchor.setTo(0.5)
        specialButton.inputEnabled = false
        specialButton.events.onInputDown.add(function(target){
            if(specialTime>=SPECIAL_MAX_TIME){
                target.loadTexture("atlas.game","special_on")
                target.inputEnabled = false
                //specialPorcentage = 0
                makeSpecial()
            }
        })
        specialButton.events.onInputUp.add(function(target){
            target.loadTexture("atlas.game","special_off")
            specialPorcentage = 0
            
        })

        monster = game.add.spine(game.world.centerX,game.world.centerY+250,"monster")
        monster.setSkinByName("normal2")
        monster.setAnimationByName(0,"hit",true)
        sceneGroup.add(monster)

        explosionAnim = sceneGroup.create(monster.x,monster.y,"atlas.game","boss_smoke1")
        explosionAnim.anchor.setTo(0.5,1)
        explosionAnim.visible = false
        explosionAnim.currentTime = 0


        tacoGroup = game.add.group()
        sceneGroup.add(tacoGroup)

        coinGroup = game.add.group()
        sceneGroup.add(coinGroup)
        

        hitGroup = game.add.group()
        sceneGroup.add(hitGroup)

        var mark = sceneGroup.create(game.world.centerX,game.world.centerY,"atlas.game","attack_special1")
        mark.anchor.setTo(0.5)
        mark.alpha = 0
        mark.visible = false
        markArray.push(mark)

        mark = sceneGroup.create(game.world.centerX,game.world.centerY,"atlas.game","attack_special2")
        mark.anchor.setTo(0.5)
        mark.alpha = 0
        mark.visible = false
        markArray.push(mark)

        mark = sceneGroup.create(game.world.centerX,game.world.centerY,"atlas.game","attack_special3")
        mark.anchor.setTo(0.5)
        mark.alpha = 0
        mark.visible = false
        markArray.push(mark)

        taquero = game.add.spine(game.world.centerX,game.world.centerY+230,"taquero")
        taquero.setSkinByName("normal")
        taquero.setAnimationByName(0,"idle",true)
        taquero.scale.setTo(0.4)
        sceneGroup.add(taquero)
        taquero.currentIdAnim = 0
        taquero.inAnim = false




    }



    
    
    function create(){
    	
        sceneGroup = game.add.group()

        game.camera.focusOnXY(game.world.centerX, game.world.centerY);

        initialize()

        createBackground()

        if(!amazing.getMinigameId()){
			marioSong = game.add.audio('timberman')
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


        animateScene()

        loadSounds()

        createObjects()


        createPointsBar()
        createHearts()

        spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        setRound()

        

    }

    
    return {
        assets: assets,
        name: "tapTaco",
        create: create,
        preload: preload,
        update: update
    }

}()

function lerp(a,b,t){
   return a + t * (b - a);
}
