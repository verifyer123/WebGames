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
    
    var INITIAL_LIVES = 1
    var INITIAL_LIFE = 100
    var DELTA_LIFE = 25
    var INITIAL_TIME = 10000
    var DELTA_TIME = 100
    var INITIAL_TIME_ATTACK = 4000
    var DELTA_TIME_ATTACK = 100
    var RANGE_TIME_ATTACK = 500
    var MIN_TIME_ATTACK = 2000
    var TIME_RESTORE_HIT = 600
    
    var TOTAL_MONSTERS = 3
    var COINS_MOVE_TIME = 600

    var TACO_VELOCITY_X = 20
    var TACO_VELOCITY_Y = 20
    var TACO_GRAVITY = 2
    var TACO_Y_DISSAPEAR
    var TACO_DELTA_ALPHA_DISSAPEAR = 0.001

    var TACOS_TO_COIN = 20
    var COIN_BY_TACOS = 5

    var gameIndex = 31
    var gameId = 100018
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
    var timeToAttack, currentTimeAttack
    var currentLevel

    var inDefense, hitted
    var currentMonster

    var coinGroup
    var tacoGroup
    var monster

    var createdTacos

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        TACO_Y_DISSAPEAR = game.world.centerY
        lifeAmount = INITIAL_LIFE
        timeAmount = INITIAL_TIME
        canTap = true
        currentLevel = 0
        inDefense = true
        hitted = false
        currentMonster = -1
        createdTacos = 0
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
            marioSong = sound.setSong(soundsPath + 'songs/timberman.mp3',0.3)
        }else{
            game.load.audio('arcadeSong', soundsPath + 'songs/timberman.mp3');
        }


    }

    
    function stopGame(win){

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
        updateTimeBar()
        //updateLifeBar()
        var coin 
        for(var i =0; i < coinGroup.length; i++){
            if(coinGroup.children[i].visible && coinGroup.children[i].tapped){
                coin = coinGroup.children[i]

                if(coin.currentTime>=COINS_MOVE_TIME){
                    addPoint(1,{x:game.world.width-80,y:80})
                    coin.visible = false

                }
                else{
                    coin.x = lerp(coin.startX,game.world.width-80,(coin.currentTime/COINS_MOVE_TIME))
                    coin.y = lerp(coin.startY,80,(coin.currentTime/COINS_MOVE_TIME))
                    currentTime += game.time.elapsed
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
    }


    function tap(){
        if(hitted){
            return
        }
        canTap = false

        lifeAmount-=1
        updateLifeBar()

        //monsterAnimation

        //playerAnimation
    }

    function makeSpecial(){
        if(hitted){
            return
        }
        //special animation
    }

    function defense(){
        //defense animation
        inDefense = true
    }

    function stopDefense(){
        inDefense = false
    }

    function enemyAttack(){
        if(!inDefense){
            //player hit and cannot attack
            hitted = true

            setTimeout(restoreHit,TIME_RESTORE_HIT)
        }
    }

    function restoreHit(){
        hitted = false

    }

    function updateTimeBar(){
        timeAmount-=game.time.elapsed/1000;
        var porcentage = timeAmount/roundTime;
        console.log("Time amount ",porcentage)

        if(porcentage<=0){
            stopGame()
        }

    }

    function updateLifeBar(){

        var porcentage = lifeAmount/roundLife
        console.log("Life amount ",porcentage)

        if(porcentage<=0){
            //monsterDie
            //dropCoins
            setTimeout(setRound,500)
        }
    }

    function updateSpecial(){

    }

    function setRound(){
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


        //decide monster

        var temp = game.rnd.integerInRange(0,TOTAL_MONSTERS)
        if(temp == currentMonster){
            currentMonster = game.rnd.integerInRange(0,TOTAL_MONSTERS)
        }
        else{
            currentMonster = temp
        }

    }

    function createCoin(){

        for(var i =0; i < coinGroup.length; i++){
            if(!coinGroup.children[i].visible){
                var coin = coinGroup.children[i]
                coin.visible = true
                coin.tapped = false
                return coin
            }
        }

        var coin = coinGroup.create(0,0,"atlas.game","coin")
        coin.anchor.setTo(0.5)
        coin.tapped = false
        coin.inputEnabled = true
        coin.events.onInputDown.add(tapCoin)

    }

    function createTaco(){
        for(var i =0; i < tacoGroup.length; i++){
            if(!tacoGroup.children[i].visible){
                var taco = tacoGroup.children[i]
                taco.visible = true
                taco.alpha = 1
                taco.x = monster.x
                taco.y = monster.y
                taco.vel_X = game.rnd.integerInRange(-TACO_VELOCITY_X,TACO_VELOCITY_X)
                taco.vel_Y = -game.rnd.integerInRange(TACO_VELOCITY_Y/2,TACO_VELOCITY_Y)
                taco.timeToAlpha = game.time.now + TACO_TIME_DISSAPEAR
                return
            }
        }

        var taco = tacoGroup.create(monster.x,monster.y,"atlas.game","taco")
        taco.anchor.setTo(0.5)
        taco.vel_X = game.rnd.integerInRange(-TACO_VELOCITY_X,TACO_VELOCITY_X)
        taco.vel_Y = -game.rnd.integerInRange(TACO_VELOCITY_Y/2,TACO_VELOCITY_Y)
        taco.alpha = 1
        taco.timeToAlpha = game.time.now + TACO_TIME_DISSAPEAR

    }

    function tapCoin(coinTarget){
        if(coinTarget.tapped){
            return
        }

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
        var background = game.add.graphics()
        background.beginFill(0xffffff)
        background.drawRect(0,0,game.world.width,game.world.height)
        background.endFill()
        sceneGroup.add(background)

        tacoGroup = game.add.group()
        sceneGroup.add(tacoGroup)

        coinGroup = game.add.group()
        sceneGroup.add(coinGroup)



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
