var soundsPath = "../../shared/minigames/sounds/"
var pinDot = function(){

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/pinDot/atlas.json",
                image: "images/pinDot/atlas.png",
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
    var INITIAL_ANGULAR_VELOCITY = 1*(Math.PI/180)
    var DELTA_ANGULAR_VELOCITY = 0.2*(Math.PI/180)
    var INITIAL_SET_DOTS = 5
    var MAX_SET_DOTS = 10
    var DELTA_SET_DOTS = 1
    var INITIAL_PUT_DOTS = 5
    var MAX_PUT_DOTS = 15
    var DELTA_PUT_DOTS = 1.3
    var DISTANCE_DOT = 200
    var DOT_RADIUS = 20
    var INIT_PUSH_Y = 100
    var DELTA_BETWEEN_DOTS = 50

    var skinTable
    
    var gameIndex = 29
    var gameId = 100006
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null



    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var rotatingGroup
    var dotsGroup
    var unusedDotsGroup
    var currentAngularVelocity, currentSetDots, currentPutDots, currentLevel
    var panel
    var canTap 
    var leveltext
    var backgroundColor 
    var textGroup
    var numText 

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        currentAngularVelocity = INITIAL_ANGULAR_VELOCITY
        currentSetDots = INITIAL_SET_DOTS
        currentPutDots = INITIAL_PUT_DOTS
        canTap = true
        currentLevel = 1
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
        
        if(!gameActive){
            return
        }
        
        rotatingGroup.rotation+=currentAngularVelocity

        if(rotatingGroup.rotation > Math.PI*2){
            rotatingGroup.rotation -= Math.PI*2
        }

        for(var i = 0; i < rotatingGroup.length; i++){
            //rotatingGroup.children[i].rotation+=currentAngularVelocity
            //if(rotatingGroup.children[i].text.visible){
                //console.log(rotatingGroup.children[i])
                //rotatingGroup.children[i].text.rotation = -rotatingGroup.children[i].rotation
            //}
        }

        if(game.input.activePointer.isDown){
            if(canTap){
                canTap = false
                moveDot()
            }
        }
        else{
            canTap = true
        }

    }

    function moveDot(){
        if(dotsGroup.length>0){
            game.add.tween(dotsGroup.children[0]).to({y:INIT_PUSH_Y-100},100,Phaser.Easing.linear,true).onComplete.add(tap)
        }
    }

    function tap(){
        var dot = dotsGroup.children[0]
        dot.y = 0
        dot.line.alpha = 1
        dot.rotation = (Math.PI*2) - rotatingGroup.rotation
        
        var collide = false
        for(var i =0; i < rotatingGroup.length; i++){
            var r = Math.abs(dot.rotation - rotatingGroup.children[i].rotation)
            if(r < Math.PI/28){
                collide = true
                missPoint()
                gameActive = false

                game.add.tween(sceneGroup.scale).to({x:2,y:2},200,Phaser.Easing.linear,true)
                game.add.tween(sceneGroup).to({x:-game.world.centerX,y:-game.world.centerY+100},200,Phaser.Easing.linear,true)

                currentLevel--

                currentAngularVelocity-= DELTA_ANGULAR_VELOCITY

                currentSetDots-=DELTA_SET_DOTS

                currentPutDots-=DELTA_PUT_DOTS
                currentPutDots = Math.round(currentPutDots)
                

                backgroundColor.tint = 0xff0000
                game.add.tween(backgroundColor).to({y:0},200,Phaser.Easing.linear,true).onComplete.add(function(){
                    if(lives>0){
                        setTimeout(endRound,200)
                    }
                })

            }
        }
        rotatingGroup.add(dot)

        for(var i =0; i < dotsGroup.length; i++){
            dotsGroup.children[i].y -= DELTA_BETWEEN_DOTS
        }


        if(!collide){
            numText.setText("X "+dotsGroup.length)
            addPoint(1,{x:game.world.width-100,y:30})
            if(dotsGroup.length==0){
                backgroundColor.tint = 0x00ff00
                game.add.tween(backgroundColor).to({y:0},200,Phaser.Easing.linear,true).onComplete.add(function(){
                    setTimeout(endRound,200)
                })
            }
        }


    }


    function setRound(){
        var angle = 360/currentSetDots
        var currentAngle = 0
        numText.setText("X "+currentPutDots)
        for(var i =0; i < currentSetDots; i++){
            var dot = getPin()
            rotatingGroup.add(dot)
            
            dot.rotation = currentAngle*(Math.PI/180)
            currentAngle+=angle
        }

        for(var i =0; i < currentPutDots; i++){
            var dot = getPin()
            dot.line.alpha = 0
            dot.y = INIT_PUSH_Y + (DELTA_BETWEEN_DOTS*i)
            dotsGroup.add(dot)
            
        }

        leveltext.setText(currentLevel)

        gameActive = true
    }

    function endRound(){
        gameActive = false

        currentLevel++

        currentAngularVelocity+= DELTA_ANGULAR_VELOCITY

        if(currentSetDots < MAX_SET_DOTS){
            currentSetDots+=DELTA_SET_DOTS
        }

        if(currentPutDots < MAX_PUT_DOTS){
            currentPutDots= Math.round(INITIAL_PUT_DOTS +(DELTA_PUT_DOTS*currentLevel))
        }

        game.add.tween(panel).to({alpha:1},500,Phaser.Easing.linear,true).onComplete.add(function(){
            for(var i = rotatingGroup.length-1; i >= 0; i--){
                rotatingGroup.children[i].rotation = 0
                unusedDotsGroup.add(rotatingGroup.children[i])
            }

            for(var i = dotsGroup.length-1; i >= 0; i--){
                dotsGroup.children[i].rotation = 0
                unusedDotsGroup.add(dotsGroup.children[i])
            }
            sceneGroup.scale.setTo(1)
            sceneGroup.x = 0
            sceneGroup.y = 0
            rotatingGroup.rotation =0

            backgroundColor.y = game.world.height

            game.add.tween(panel).to({alpha:0},500,Phaser.Easing.linear,true)
            setTimeout(setRound,100)
        })
    }

    function createBackground(){

        var background = game.add.graphics()
        background.beginFill(0xffffff)
        background.drawRect(game.world.width,game.world.height,0,0)
        background.endFill()
        sceneGroup.add(background)

        backgroundColor = game.add.graphics(0,0)
        backgroundColor.y = game.world.height
        backgroundColor.beginFill(0xffffff)
        backgroundColor.drawRect(0,0,game.world.width,game.world.height)
        backgroundColor.endFill()
        sceneGroup.add(backgroundColor)

        var blackCenter = game.add.graphics(game.world.centerX, game.world.centerY-100)
        blackCenter.beginFill(0x000000)
        blackCenter.drawCircle(0,0,200)
        blackCenter.endFill()
        sceneGroup.add(blackCenter)

        
        unusedDotsGroup = game.add.group()
        unusedDotsGroup.x = game.world.centerX
        unusedDotsGroup.y = game.world.centerY - 100
        rotatingGroup = game.add.group()
        rotatingGroup.x = game.world.centerX
        rotatingGroup.y = game.world.centerY - 100
        sceneGroup.add(rotatingGroup)
        dotsGroup = game.add.group()
        dotsGroup.x = game.world.centerX
        dotsGroup.y = game.world.centerY - 100
        sceneGroup.add(dotsGroup)


        var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        leveltext = new Phaser.Text(sceneGroup.game, game.world.centerX, game.world.centerY-100, currentLevel, fontStyle)
        leveltext.anchor.setTo(0.5)
        sceneGroup.add(leveltext)

        var circleImage = game.add.graphics()
        circleImage.x = 80
        circleImage.y = game.world.height - 100
        circleImage.beginFill()
        circleImage.drawCircle(0,0,40)
        circleImage.endFill()
        sceneGroup.add(circleImage)

        var fontStyle = {font: "25px VAGRounded", fontWeight: "bold", fill: "#000000", align: "left"}
        numText = new Phaser.Text(sceneGroup.game, 110, game.world.height-95, "X 0", fontStyle)
        numText.anchor.setTo(0,0.5)
        sceneGroup.add(numText)

        panel = game.add.graphics()
        panel.beginFill(0xffffff)
        panel.drawRect(0,0,game.world.width,game.world.height)
        panel.endFill()
        panel.alpha = 0
        sceneGroup.add(panel)

    }

    function getPin(){

        for(var i =0; i < unusedDotsGroup.length; i++){
            return unusedDotsGroup.children[i]
        }   

        var dot = game.add.group()
        unusedDotsGroup.add(dot)

        var dotBall = game.add.graphics(0,0)
        dotBall.beginFill(0x000000)
        dotBall.drawCircle(0,DISTANCE_DOT,DOT_RADIUS)
        dotBall.endFill()

        dot.add(dotBall)
        dot.dotBall = dotBall

        var line = game.add.graphics()
        line.lineStyle(2,0x000000,1)
        line.y = DISTANCE_DOT/2
        line.lineTo(0,DISTANCE_DOT/2)
        dot.add(line)
        dot.line = line

        return dot
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

        createObjects()
        setRound()

    }

    
    return {
        assets: assets,
        name: "pinDot",
        create: create,
        preload: preload,
        update: update
    }
}()