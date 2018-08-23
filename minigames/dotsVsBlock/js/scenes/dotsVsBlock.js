var soundsPath = "../../shared/minigames/sounds/"
var dotsVsBlock = function(){

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/dotsVsBlock/atlas.json",
                image: "images/dotsVsBlock/atlas.png",
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
    
    var INITIAL_LIVES = 3
    var DIAMETER_DOT = 20
    var INITIAL_PROBABILITY_BLOCK = 0.3
    var DELTA_PROBABILITY = 0.01
    var MAX_PROBABILITY = 0.8
    var WIDT_BLOCK = 100
    var INITIAL_MIN = 1
    var INITIAL_MAX = 3
    var DELTA_MIN = 0.2
    var DELTA_MAX = 0.5
    var BLOCK_IN_LINE = 5
    
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

    var startPointX
    var currentDots, currentProbability
    var minRange, maxRange
    var ballsGroup
    var initialBall
    var blockGroup
    var currentY
    var initX, ballY 
    var touchStarted

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        startPointX = game.world.centerX
        currentDots = 1
        currentProbability = INITIAL_PROBABILITY_BLOCK
        minRange = INITIAL_MIN
        maxRange = INITIAL_MAX
        currentY = game.world.height - (WIDT_BLOCK*5.5)
        initX = game.world.centerX - (WIDT_BLOCK * ((BLOCK_IN_LINE/2)-1))
        touchStarted = false
        ballY = game.world.height - DIAMETER_DOT*2
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

        if(game.input.activePointer.isDown){
            touchStarted = true
            updateLine(game.input.activePointer)
        }
        else{
            if(touchStarted){
                touchStarted = false
            }
        }

    }

    function updateLine(pointer){
        var deltaX = initX - pointer.x
        var deltaY = ballY - pointer.y
        var d = Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2))
        var ang = Math.acos(deltaX/d) * (180/Math.PI)


    }

    function setRound(){

    }

    function shoot(){

    }


    function createBackground(){

        game.physics.startSystem(Phaser.Physics.ARCADE);

        var background = game.add.graphics()
        background.beginFill(0x000000)
        background.drawRect(game.world.width,game.world.height,0,0)
        background.endFill()
        sceneGroup.add(background)

        ballsGroup = game.add.group()
        sceneGroup.add(ballsGroup)
        ballsGroup.enableBody = true;
        ballsGroup.physicsBodyType = Phaser.Physics.ARCADE;

        blockGroup = game.add.group()
        sceneGroup.add(blockGroup)
        blockGroup.enableBody = true;
        blockGroup.physicsBodyType = Phaser.Physics.ARCADE;

        initialBall = getBall(game.world.centerX,ballY)

        while(currentY > 0){
            decideLine()
        }


    }

    function decideLine(){

        for(var i = 0; i < BLOCK_IN_LINE; i ++){
            var random = game.rnd.frac()
            if(random < currentProbability){
                var block = getBlock(game.rnd.integerInRange(minRange,maxRange),initX + (WIDT_BLOCK*i),currentY)
            }
        }
        currentY -=WIDT_BLOCK
    }

    function getBall(x,y){
        var ball = game.add.graphics()
        ball.x = x
        ball.y = y
        ball.beginFill(0xffffff)
        ball.drawCircle(0,0,DIAMETER_DOT)
        ball.endFill()
        ballsGroup.add(ball)

        
        ball.body.setCircle(DIAMETER_DOT,-DIAMETER_DOT/2,-DIAMETER_DOT/2)
        ball.body.collideWorldBounds = true
        ball.body.onCollide = new Phaser.Signal();
        ball.body.onCollide.add(hitSprite, this);
        return ball
    }

    function getBlock(value,x,y){

        for(var i =0; i < blockGroup.length; i++){
            if(!blockGroup.children[i].visible){
                var block = blockGroup.children[i]
                block.visible = true
                block.x = x
                block.y = y
                block.text.setText(value)
                block.value = value
                
                return block
            }
        }

        var block = game.add.graphics()
        block.x = x
        block.y = y
        
        block.beginFill(0xff0000)

        block.drawRoundedRect(-WIDT_BLOCK/2,-WIDT_BLOCK/2,WIDT_BLOCK,WIDT_BLOCK,20)
        block.endFill()
        blockGroup.add(block)
        block.value = value

        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var numberText = new Phaser.Text(sceneGroup.game, 0, 0, value, fontStyle)
        numberText.anchor.setTo(0.5)

        block.addChild(numberText)
        block.text = numberText

        game.physics.arcade.enable(block)

        return block
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

        //spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


        animateScene()

        loadSounds()

        createObjects()
        createRope()
        getQuad()

        createPointsBar()
        createHearts()

        setRound()
    }

    function render(){
        
        for(var i=0; i < blockGroup.length; i++){
            game.debug.body(blockGroup.children[i])
        }

        for(var i=0; i < ballsGroup.length; i++){
            game.debug.body(ballsGroup.children[i])
        }


    }

    
    return {
        assets: assets,
        name: "megablockTower",
        create: create,
        preload: preload,
        update: update,
        render:render
    }

}()

function lerp(a,b,t){
   return a + t * (b - a);
}
