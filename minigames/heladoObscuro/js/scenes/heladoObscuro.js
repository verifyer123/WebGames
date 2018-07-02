var soundsPath = "../../shared/minigames/sounds/"
var heladoObscuro = function(){

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/heladoObscuro/atlas.json",
                image: "images/heladoObscuro/atlas.png",
            },
        ],
        images: [
            {
                name:"stars",
                file:"images/heladoObscuro/stars.png"
            }
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
    var INITIAL_TIME_APPEAR = 2000
    var DELTA_TIME_APPEAR = 10
    var MIN_TIME_APPEAR = 500

    var INITIAL_PROBABILITY_ENEMY = 0.05
    var DELTA_PROBABILITY_ENEMY = 0.01
    var MAX_PROBABILITY_ENEMY = 0.5

    var SPEED_MOVE_DOWN = 1
    var LIMIT_Y

    var INITIAL_SPEED = 3
    var DELTA_SPEED = 0.1
    var MAX_SPEED = 15
    var CLOUD_NUMBER = 5
    var MOVE_FACTOR = 0.6

    var ICE_BALLS = 12
    var ENENMY_BALLS = 4
    var DELTA_CLOUDS = 300
    var MIN_DISTANCE_COLLISION = 60
    var OFFSET_Y = 60
    var PROBABILITY_EXTRA_POINTS = 0.3
    
    var gameIndex = 31
    var gameId = 100008
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null

    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var player
    var iceGroup, enemyGroup

    var currentTimeAppear, currentProbability, currentSpeed
    var lastObjectCollision
    var moon, clouds

    var ballTimeOut
    var starsTile
    var gameGroup
    var currentExtraPoints
    var currentExtraVal
    var currentExtraIce

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        currentTimeAppear = INITIAL_TIME_APPEAR
        currentProbability = INITIAL_PROBABILITY_ENEMY
        currentSpeed = INITIAL_SPEED
        clouds = []
        currentExtraPoints = 0
        currentExtraVal = -1
        currentExtraIce = -1
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

    function getDistance(current,next){
        if(current.y > next.y){
            var d = Math.sqrt(Math.pow(current.x-next.x,2)+Math.pow(current.y-next.y,2))
            if(d < MIN_DISTANCE_COLLISION){
                return true
            }
        }
        return false
    }


    function update(){
        
        for(var i=0; i < CLOUD_NUMBER; i++){
            clouds[i].x+=clouds[i].velocity
            if(clouds[i].x > game.world.width + 200){
                clouds[i].x = - 200
                clouds[i].velocity = (game.rnd.frac()*0.1)+0.3
            }
        }

        if(!gameActive){
            return
        }

        if(game.input.activePointer.isDown){
            player.x = game.input.activePointer.x
        }
    	else{
        	if(leftKey.isDown){
        		if(player.x > 10){
	        		player.x -= 10
	            }
	        }
	        else if(rightKey.isDown){
	        	if(player.x < game.world.width - 10){
	        		player.x += 10
	            }
	        }
	    }
        

        for(var i=0; i < iceGroup.length; i++){
            if(iceGroup.children[i].visible){
                if(iceGroup.children[i].tag=="ice"){
                    var ice = iceGroup.children[i]
                    if(ice.inPlayer){

                    }
                    else{
                        ice.y += currentSpeed

                        if(getDistance(lastObjectCollision,ice)){

                            

                            if(lastObjectCollision.val == ice.val){
                                currentExtraPoints++
                            }
                            else{
                                currentExtraPoints = 0
                            }

                            ice.x = lastObjectCollision.x
                            if(player.nextBall==null){
                            	ice.y = lastObjectCollision.y - OFFSET_Y -5
                            }
                            else{
	                            ice.y = lastObjectCollision.y - OFFSET_Y
	                        }
                            ice.inPlayer = true
                            ice.lastBall = lastObjectCollision
                            lastObjectCollision.nextBall = ice
                            lastObjectCollision = ice



                            if(currentExtraPoints>=2){
                                currentExtraPoints = 0
                                createPart('star', ice)
                                addPoint(3,{x:game.world.width-50,y:50})
                            }
                            else{
                                addPoint(1,{x:game.world.width-50,y:50})
                            }
                        }
                        else{
                            if(ice.y > game.world.height){
                                ice.visible = false
                                missPoint()
                            }
                        }
                    }
                }
                else if(iceGroup.children[i].tag=="enemy"){
                    var enemy = iceGroup.children[i]
                    if(enemy.inPlayer){

                    }
                    else{
                        enemy.y += currentSpeed

                        if(getDistance(lastObjectCollision,enemy)){
                            
                            enemy.x = lastObjectCollision.x
                            enemy.y = lastObjectCollision.y - OFFSET_Y
                            enemy.inPlayer = true
                            enemy.lastBall = lastObjectCollision
                            lastObjectCollision.nextBall = enemy
                            lastObjectCollision = enemy

                            missPoint()
                        }
                        else{
                            if(enemy.y > game.world.height){
                                enemy.visible = false
                            }
                        }
                    }
                }
            }


        }


        var moveDown = false


        if(lastObjectCollision.y < LIMIT_Y){
            moveDown = true
            player.y+=SPEED_MOVE_DOWN
            //player.nextBall.y+=SPEED_MOVE_DOWN
            for(var i=0; i < CLOUD_NUMBER; i++){
                clouds[i].y+=(SPEED_MOVE_DOWN*0.5)
                if(clouds[i].y > game.world.height){
                    clouds[i].y -= (DELTA_CLOUDS*CLOUD_NUMBER)
                }
            }

            moon.y+=SPEED_MOVE_DOWN*0.1
            starsTile.tilePosition.y+=SPEED_MOVE_DOWN*0.1
        }

        if(player.nextBall!=null){
            var objectEval = player.nextBall
            while(objectEval!=null){
                if(moveDown){
                    objectEval.y+=SPEED_MOVE_DOWN
                }

                var delta = objectEval.x - objectEval.lastBall.x
                delta = delta*MOVE_FACTOR
                objectEval.x -= delta
                objectEval = objectEval.nextBall
            }
        }
        

    }


    function setRound(){
        ballTimeOut = setTimeout(getBall,currentTimeAppear)
    }

    function getBall(){
        if(gameActive){
            var r = game.rnd.frac()
            var ball
            if(r < currentProbability){
                ball = getEnemy()
            }
            else{
                ball = getIce()
            }

            if(currentProbability < MAX_PROBABILITY_ENEMY){
                currentProbability += DELTA_PROBABILITY_ENEMY
            }

            if(currentTimeAppear > MIN_TIME_APPEAR){
                currentTimeAppear -= DELTA_TIME_APPEAR
            }

            if(currentSpeed < MAX_SPEED){
                currentSpeed += DELTA_SPEED
            }

            ballTimeOut = setTimeout(getBall,currentTimeAppear)
        }
    }

    function createBackground(){

        var background = game.add.graphics()
        background.beginFill(0x1d1533)
        background.drawRect(0,0,game.world.width,game.world.height)
        background.endFill()
        sceneGroup.add(background)

        starsTile = game.add.tileSprite(0,0,game.world.width,game.world.height,"stars")
        sceneGroup.add(starsTile)

        moon = sceneGroup.create(game.world.width - 80,80,"atlas.game","moon")
        moon.anchor.setTo(0.5)

        for(var i =0; i < CLOUD_NUMBER; i++){
            var c = sceneGroup.create(game.rnd.integerInRange(0,game.world.width),game.world.height-(DELTA_CLOUDS*i),"atlas.game","cloud")
            c.anchor.setTo(0.5)
            c.scale.setTo(game.rnd.integerInRange(0.5,0.9))
            c.velocity = (game.rnd.frac()*0.1)+0.3
            clouds.push(c)
        }

        gameGroup = game.add.group()
        sceneGroup.add(gameGroup)

        player = gameGroup.create(0,0,"atlas.game","cone")
        player.x = game.world.centerX
        player.y = game.world.height - 300
        player.anchor.setTo(0.5,0.2)
        player.scale.setTo(0.75)
        player.nextBall = null

        lastObjectCollision = player
        
        LIMIT_Y = game.world.centerY 

        

        iceGroup = game.add.group()
        gameGroup.add(iceGroup)

        enemyGroup = game.add.group()
        gameGroup.add(enemyGroup)

       

        var bottomBanner = game.add.graphics()
        bottomBanner.beginFill(0xf7f7f7)
        bottomBanner.drawRect(0,game.world.height - 200, game.world.width,200)
        bottomBanner.endFill()
        sceneGroup.add(bottomBanner)

        var logo = sceneGroup.create(game.world.centerX,game.world.height - 100,"atlas.game","logo")
        logo.anchor.setTo(0.5)

    }

    function getIce(){



        for(var i =0; i < iceGroup.length; i++){
            if(!iceGroup.children[i].visible && iceGroup.children[i].tag == "ice"){
                var ice = iceGroup.children[i]
                ice.visible = true
                ice.y = -100
                ice.x = game.rnd.integerInRange(50,game.world.width-50)
                ice.inPlayer = false
                ice.lastBall = null
                ice.nextBall = null
                ice.val = game.rnd.integerInRange(0,ICE_BALLS-1)
                ice.loadTexture("atlas.game","nieve"+ice.val)
                if(currentExtraIce == -1){
                    if(game.rnd.frac()<PROBABILITY_EXTRA_POINTS){
                        currentExtraIce = 1
                        currentExtraVal = ice.val
                    }
                }
                else{
                    if(currentExtraIce < 3){
                        ice.val = currentExtraVal
                        ice.loadTexture("atlas.game","nieve"+ice.val)
                        currentExtraIce++
                    }
                    else{
                        currentExtraIce=-1
                        currentExtraVal=-1 
                    }
                }
                iceGroup.bringToTop(ice)



                return ice
            }
        }
        var iceVal = game.rnd.integerInRange(0,ICE_BALLS-1)
        var ice = iceGroup.create(0,0,"atlas.game","nieve"+iceVal)
        ice.val = iceVal
        ice.x = game.rnd.integerInRange(50,game.world.width-50)
        ice.y = -100
        ice.anchor.setTo(0.5)
        ice.scale.setTo(0.8)
        
        if(currentExtraIce == -1){
            if(game.rnd.frac()<PROBABILITY_EXTRA_POINTS){
                currentExtraIce = 1
                currentExtraVal = ice.val
            }
        }
        else{
            if(currentExtraIce < 3){
                ice.val = currentExtraVal
                ice.loadTexture("atlas.game","nieve"+ice.val)
                currentExtraIce++
                //console.log(ice.val,currentExtraIce)
            }
            else{
                currentExtraIce=-1
                currentExtraVal=-1 
            }
        }
        ice.inPlayer = false
        //iceGroup.add(ice)
        ice.lastBall = null
        ice.nextBall = null
        ice.tag = "ice"
        return ice
    }

    function getEnemy(){
        for(var i =0; i < iceGroup.length; i++){
            if(!iceGroup.children[i].visible && iceGroup.children[i].tag == "enemy"){
                var enemy = iceGroup.children[i]
                enemy.visible = true
                enemy.y = -100
                enemy.x = game.rnd.integerInRange(50,game.world.width-50)
                enemy.inPlayer = false
                enemy.lastBall = null
                enemy.nextBall = null
                enemy.loadTexture("atlas.game","enemy"+game.rnd.integerInRange(0,ENENMY_BALLS-1))
                iceGroup.bringToTop(enemy)
                return enemy
            }
        }

        var enemy = iceGroup.create(0,0,"atlas.game","enemy"+game.rnd.integerInRange(0,ENENMY_BALLS-1))
        enemy.x = game.rnd.integerInRange(50,game.world.width-50)
        enemy.y = -100
        enemy.anchor.setTo(0.5)
        enemy.scale.setTo(0.6)
        /*enemy.beginFill(0x000000)
        enemy.drawCircle(-20,-20,30)
        enemy.endFill()*/
        enemy.inPlayer = false
        //iceGroup.add(enemy)
        enemy.lastBall = null
        enemy.nextBall = null
        enemy.tag = "enemy"
        return enemy
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

        if(amazing.getMinigameId()){
			marioSong = game.add.audio('arcadeSong')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.6)
			}, this);	
		}

        game.onPause.add(function(){
			
			if(amazing.getMinigameId()){
				marioSong.pause()
			}

            if(ballTimeOut != null){
                clearTimeout(ballTimeOut)
            }
			
	        game.sound.mute = true
	    } , this);

	    game.onResume.add(function(){
			
			if(amazing.getMinigameId()){
				if(lives > 0){
					marioSong.play()
				}
			}
			ballTimeOut = setTimeout(getBall,currentTimeAppear)
	        game.sound.mute = false
	    }, this);

        spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        createPointsBar()
        createHearts()

        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        animateScene()

        loadSounds()

        createObjects()
        setRound()
    }

    
    return {
        assets: assets,
        name: "heladoObscuro",
        create: create,
        preload: preload,
        update: update
    }
}()