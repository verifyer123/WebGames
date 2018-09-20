var soundsPath = "../../shared/minigames/sounds/"
var canvasGraphics
var playerSprite
var bPong = function(){

    var PLATFORM_TYPE = {
        NORMAL:0,
        WATER:1,
        FIRE:2
    }

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/bPong/atlas.json",
                image: "images/bPong/atlas.png",
            },
        ],
        images: [
            {   name: "black_grass_left",
                file:  "images/bPong/black_grass_left.png"},
            {   name: "black_grass_right",
                file:  "images/bPong/black_grass_right.png"},
            {   name: "fire_square",
                file:  "images/bPong/fire_square.png"},
            {   name: "grass_square",
                file:  "images/bPong/grass_square.png"},
            {   name: "water_square",
                file:  "images/bPong/water_square.png"},
            {   name: "night_sky",
                file:  "images/bPong/night_sky.png"},

        ],
        sounds: [
            {   name: "magic",
                file: soundsPath + "magic.mp3"},
            {   name: "bomb",
                file: soundsPath + "explosion.mp3"},
            {   name: "pop",
                file: soundsPath + "coin.wav"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
        ],
        
    }
    
    var INITIAL_LIVES = 1
    var POINTS_FOR_BEER = 10
    var Y_BALL = 200
    var Y_LAST 
    var WIDTH_PLATFORM = 64
    var PLATFORMS_TO_BEER = 5
    var HEIGTH_PLATFORM = 64
    var PROBABILTY_WATER = 0.2
    var PROBABILTY_FIRE = 0.05
    var PLATFORM_SPEED_MIN = 3
    var PLATFORM_SPEED_MAX = 6
    var MAX_DANGE_PLATFORMS = 2

    var VELOCITY_JUMP = -25
    var GRAVITY = 2
    var MAX_VELOCITY = 30

    var BALL_Y_DIFFERENCE = 5

    var MIN_TREE = 500
    var MAX_TREE = 800

    var gameIndex = 31
    var gameId = 1000023
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null

    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var spaceBar
    var player
    var platformGroup
    var lastPlatform
    var currentPlatform
    var countToBeer
    var canTap
    var currentDangerPlatforms 
    var glassGroup

    var treesGroup
    var lastTree, tileLeft, tileRight

    var beerParticle, waterParticle, fireParticle

    function loadSounds(){
        sound.decode(assets.sounds)
        sound.setVolumeAudios(0.1,assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        Y_LAST = game.world.height+100
        countToBeer = 0
        canTap = true
        currentDangerPlatforms = 0
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
            marioSong = sound.setSong(soundsPath + 'songs/game_on.mp3',0.3)
        }else{
            game.load.audio('arcadeSong', soundsPath + 'songs/game_on.mp3');
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

        if(spaceBar.isDown){
            if(canTap){
                canTap = false
                if(!player.inJump){
                    player.inJump = true
                    player.velocity = VELOCITY_JUMP
                }
            }
        }

        if(game.input.activePointer.isDown){
            if(canTap){
                canTap = false
                if(!player.inJump){
                    player.inJump = true
                    player.velocity = VELOCITY_JUMP
                }
            }
        }

        if(!spaceBar.isDown && !game.input.activePointer.isDown){
            canTap = true
        }

        if(player.inJump){
            player.y += player.velocity
            if(player.velocity < MAX_VELOCITY){
                player.velocity += GRAVITY
            }
            currentPlatform = null
        }

        var delta = 0
        if(player.y > Y_BALL){
            delta = player.y - Y_BALL
            player.y -= delta
            tileLeft.tilePosition.y -= delta
            tileRight.tilePosition.y -= delta
        }


        for(var i =0; i < platformGroup.length; i++){
            if(platformGroup.children[i].visible){
                var platform = platformGroup.children[i]
                if(delta!=0){
                    platform.y -= delta
                    if(platform.glass != null){
                        platform.glass.y-= delta
                    }

                }

                if(platform.direction != 0){
                    platform.x += platform.direction*platform.velocity
                    if(platform.glass != null){
                        platform.glass.x+=platform.direction*platform.velocity
                    }
                    if(currentPlatform == platform){
                        player.x += platform.direction*platform.velocity
                    }

                    if(platform.direction == -1 && platform.x < 0){
                        platform.direction = 1
                    }
                    else if(platform.direction == 1 && platform.x > game.world.width - platform.width){
                        platform.direction = -1
                    }
                }

                if(player.inJump && platform.canCollision){
                    if(checkOverlap(player,platform) && player.velocity>0){
                        if(player.x > platform.x+5 && player.x < platform.x + platform.width - 5){
                            if(platform.type==PLATFORM_TYPE.NORMAL){
                                currentPlatform = platform
                                player.inJump = false
                                player.y = platform.y - BALL_Y_DIFFERENCE
                                if(platform.direction == 0){
                                    platform.direction = game.rnd.integerInRange(0,1)
                                    if(platform.direction == 0){
                                        platform.direction = -1
                                    }
                                }
                                if(platform.canGiveCoin){
                                    /*if(platform.glass != null){
                                        if(checkOverlap(player,platform.glass)){
                                            addPoint(POINTS_FOR_BEER,{x:game.world.width - 80, y: 80})
                                            beerParticle.x = player.x
                                            beerParticle.y = player.y - 100
                                            beerParticle.start(true,500,null,20)
                                            platform.glass.canGiveCoin = false
                                            player.x = platform.glass.x
                                            createTextPart('+'+POINTS_FOR_BEER, platform.glass)

                                        }
                                        else{
                                            addPoint(1,{x:game.world.width - 80, y: 80})
                                        }
                                    }
                                    else{*/
                                        addPoint(1,{x:game.world.width - 80, y: 80})
                                    //}
                                    platform.canGiveCoin = false
                                }
                                /*else if(platform.glass != null){
                                    if(platform.glass.canGiveCoin){
                                        if(checkOverlap(player,platform.glass)){
                                            addPoint(POINTS_FOR_BEER,{x:game.world.width - 80, y: 80})
                                            beerParticle.x = player.x
                                            beerParticle.y = player.y - 100
                                            beerParticle.start(true,500,null,20)
                                            platform.glass.canGiveCoin = false
                                            player.x = platform.glass.x
                                            createTextPart('+'+POINTS_FOR_BEER, platform.glass)
                                        }
                                    }
                                }*/

                            }
                            else{
                                if(platform.type==PLATFORM_TYPE.WATER){
                                    waterParticle.x = player.x
                                    waterParticle.y = player.y
                                    waterParticle.start(true,500,null,10)
                                }
                                else if(platform.type==PLATFORM_TYPE.FIRE){
                                    fireParticle.x = player.x
                                    fireParticle.y = player.y
                                    fireParticle.start(true,500,null,10)
                                }
                                player.visible = false
                                stopGame()
                            }
                        }
                    }

                    if(platform.glass != null){
                        if(platform.glass.canGiveCoin){
                            if(checkOverlap(player,platform.glass)){
                                addPoint(POINTS_FOR_BEER,{x:game.world.width - 80, y: 80})
                                beerParticle.x = platform.glass.x
                                beerParticle.y = platform.glass.y
                                beerParticle.start(true,500,null,20)
                                platform.glass.canGiveCoin = false
                                player.x = platform.glass.x

                                createTextPart('+'+POINTS_FOR_BEER, platform.glass)

                                currentPlatform = platform
                                player.inJump = false
                                player.y = platform.y - BALL_Y_DIFFERENCE
                                if(platform.direction == 0){
                                    platform.direction = game.rnd.integerInRange(0,1)
                                    if(platform.direction == 0){
                                        platform.direction = -1
                                    }
                                }
                            }
                        }
                    }
                }



                if(platform.y < 0){
                    platform.canCollision = false
                }

                if(platform.y < -100){
                    platform.visible = false
                    if(platform.glass != null){
                        platform.glass.visible = false
                        platform.glass = null
                    }
                }

            }
        }

        for(var i =0; i < treesGroup.length; i++){
            if(treesGroup.children[i].visible){
                treesGroup.children[i].y -= delta
                if(treesGroup.children[i].y < -100){
                    treesGroup.children[i].visible = false
                }
            }
        }

        if(lastTree.y < game.world.height+100){
            lastTree = getTree(lastTree.y + game.rnd.integerInRange(MIN_TREE,MAX_TREE))
        }

        if(lastPlatform.y < game.world.height+100){
            var r = game.rnd.frac()
            if(r < PROBABILTY_WATER){
                r = 1
            }
            else if(r < PROBABILTY_WATER+PROBABILTY_FIRE){
                r = 2
            }
            else{
                r = 0
            }
            lastPlatform = getPlatform(game.rnd.integerInRange(0,game.world.width),lastPlatform.y+HEIGTH_PLATFORM*3,r)
        }
        
    }


    

    function getPlatform(_x,_y,type){

        if(currentDangerPlatforms>=MAX_DANGE_PLATFORMS){
            currentDangerPlatforms=0
            type = PLATFORM_TYPE.NORMAL
        }

        var key
        switch(type){
            case PLATFORM_TYPE.NORMAL:
            key = "grass_square"
            break
            case PLATFORM_TYPE.WATER:
            currentDangerPlatforms++
            key = "water_square"
            break
            case PLATFORM_TYPE.FIRE:
            currentDangerPlatforms++
            key = "fire_square"
            break
        }

        if(type == PLATFORM_TYPE.NORMAL){
            countToBeer ++
        }

        var numOfTiles = game.rnd.integerInRange(1,3)
        for(var i =0; i < platformGroup.length; i++){
            if(!platformGroup.children[i].visible && platformGroup.children[i].type == type){
                var platform = platformGroup.children[i]
                platform.visible = true
                platform.x =_x
                platform.y = _y
                platform.width = numOfTiles*WIDTH_PLATFORM
                platform.direction = game.rnd.integerInRange(-1,1)
                platform.velocity = game.rnd.integerInRange(PLATFORM_SPEED_MIN,PLATFORM_SPEED_MAX)
                platform.canCollision = true
                platform.canGiveCoin = true
                if(type == PLATFORM_TYPE.NORMAL){
                    if(countToBeer!=PLATFORMS_TO_BEER){
                        platform.glass = null
                    }
                    else{
                        platform.width = WIDTH_PLATFORM
                        platform.glass = getGlass(platform.x+platform.width/2,platform.y-20)
                        
                        countToBeer = 0
                    }
                }

                return platform
            }
        }

        var platform = game.add.tileSprite(_x,_y,numOfTiles*WIDTH_PLATFORM,64,key)
        platformGroup.add(platform)
        platform.type = type
        platform.direction = game.rnd.integerInRange(-1,1)
        platform.velocity = game.rnd.integerInRange(PLATFORM_SPEED_MIN,PLATFORM_SPEED_MAX)
        platform.canCollision = true
        platform.canGiveCoin = true
        if(type== PLATFORM_TYPE.NORMAL){

            if(countToBeer!=PLATFORMS_TO_BEER){
                platform.glass = null
            }
            else{
                platform.width = WIDTH_PLATFORM
                //platform.glass = getGlass(platform.x+(numOfTiles*WIDTH_PLATFORM)/2,platform.y-20)
                platform.glass = getGlass(platform.x+platform.width/2,platform.y-20)
                countToBeer = 0
            }
        }

        return platform
    }

    function getGlass(x,y){
        for(var i =0; i < glassGroup.length; i++){
            if(!glassGroup.children[i].visible){
                glassGroup.children[i].visible = true
                glassGroup.children[i].x = x
                glassGroup.children[i].y = y
                glassGroup.children[i].canGiveCoin = true
                return glassGroup.children[i]
            }
        }

        var glass = glassGroup.create(x,y,"atlas.game","glass")
        glass.anchor.setTo(0.5)
        glass.canGiveCoin = true
        return glass
    }

    function getTree(y){

        var side = game.rnd.integerInRange(0,1)

        for(var i =0; i < treesGroup.length; i++){
            if(!treesGroup.children[i].visible){
                var tree = treesGroup.children[i]
                tree.visible = true
                if(side == 0){
                    tree.x = tree.width/2
                    tree.scale.setTo(-1,1)
                }else{
                    tree.x = game.world.width - (tree.width/2)
                    tree.scale.setTo(1,1)
                }
                tree.y = y
                return tree
            }
        }

        var tree = treesGroup.create(0,y,"atlas.game","branch")
        tree.anchor.setTo(0.5)
        if(side == 0){
            tree.x = tree.width/2
            tree.scale.setTo(-1,1)
        }else{
            tree.x = game.world.width - (tree.width/2)
        }
        return tree
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
        var background = game.add.tileSprite(0,0,game.world.width,game.world.height,"night_sky")
        sceneGroup.add(background)

        tileLeft = game.add.tileSprite(0,0,128,game.world.height,"black_grass_left")
        sceneGroup.add(tileLeft)

        tileRight = game.add.tileSprite(game.world.width-128,0,128,game.world.height,"black_grass_right")
        sceneGroup.add(tileRight)

        platformGroup = game.add.group()
        sceneGroup.add(platformGroup)

    }

    function createPlayer(){

        player = sceneGroup.create(game.world.centerX,Y_BALL,"atlas.game","ball")
        player.anchor.setTo(0.5)
        player.inJump = false
        player.velocity = 0

        glassGroup = game.add.group()
        sceneGroup.add(glassGroup)

        treesGroup = game.add.group()
        sceneGroup.add(treesGroup)

        beerParticle = game.add.emitter(0, 0, 100);
        beerParticle.makeParticles("atlas.game","beer_particle");
        beerParticle.gravity = 300;

        waterParticle = game.add.emitter(0, 0, 100);
        waterParticle.makeParticles("atlas.game","water_particle");
        waterParticle.gravity = 300;

        fireParticle = game.add.emitter(0, 0, 100);
        fireParticle.makeParticles("atlas.game","burn_ball_particle");
        fireParticle.gravity = 300;

    }

    function initGame(){
        var initPlatform = getPlatform(game.world.centerX - WIDTH_PLATFORM/2,Y_BALL+BALL_Y_DIFFERENCE,PLATFORM_TYPE.NORMAL)
        initPlatform.width = WIDTH_PLATFORM
        initPlatform.direction = game.rnd.integerInRange(0,1)
        if(initPlatform.direction == 0){
            initPlatform.direction = -1
        }
        currentPlatform = initPlatform
        lastPlatform = initPlatform

        while(lastPlatform.y < game.world.height+100){
            var r = game.rnd.frac()
            if(r < PROBABILTY_WATER){
                r = 1
            }
            else{
                r = 0
            }
            lastPlatform = getPlatform(game.rnd.integerInRange(0,game.world.width),lastPlatform.y+HEIGTH_PLATFORM*3,r)
        }

        lastTree = getTree(game.rnd.integerInRange(MIN_TREE,MAX_TREE))

        while(lastTree.y < game.world.height + 100){
            lastTree = getTree(lastTree.y+game.rnd.integerInRange(MIN_TREE,MAX_TREE))
        }
    }


    function checkOverlap(spriteA, spriteB) {

        if(spriteA.worldTransform==null || spriteB.worldTransform==null){
            return false
        }

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB);

    }
    

    function create(){
    	
        sceneGroup = game.add.group()


        initialize()

        createBackground()
        createPlayer()

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
            gameInPause = true
	    } , this);

	    game.onResume.add(function(){
			
			if(amazing.getMinigameId()){
				if(lives > 0){
					marioSong.play()
				}
			}
			if(lives > 0){
	           game.sound.mute = false
            }
            gameInPause = false
	    }, this);


        animateScene()

        loadSounds()

        createObjects()


        createPointsBar()
        createHearts()

        initGame()

        spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    }

    
    return {
        assets: assets,
        name: "bPong",
        create: create,
        preload: preload,
        update: update
    }

}()

function lerp(a,b,t){
   return a + t * (b - a);
}
