
var soundsPath = "../../shared/minigames/sounds/"

var mathRun = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.runneryogome",
                json: "images/runneryogome/atlas.json",
                image: "images/runneryogome/atlas.png",
            }
        ],
        images: [
            {   name:"tutorial_image",
                file: "images/runneryogome/tutorial_image_%input.png"
            },
            {   name:"sky",
                file: "images/runneryogome/sky.png"
            },
            {   name:"mountains",
                file: "images/runneryogome/mountains.png"
            },
            {   name:"hills",
                file: "images/runneryogome/hills.png"
            }
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/marioSong.mp3'
            }
		],
        spritesheets: [
            {   name: "coin",
                file: "images/spines/coin.png",
                width: 122,
                height: 123,
                frames: 12
            },
            {   name: "hand",
                file: "images/spines/hand.png",
                width: 115,
                height: 111,
                frames: 23
            },
            {   name: "pink",
                file: "images/spines/pMonster.png",
                width: 135,
                height: 149,
                frames: 16
            },
            {   name: "brown",
                file: "images/spines/bMonster.png",
                width: 135,
                height: 149,
                frames: 16
            },
        ],
        spines:[
			{
				name:"arthurius",
				file:"images/spines/skeleton.json"
			}
		]
    }

    var SPEED = 225
    var JUMP_FORCE = 900
    var check
    var lives = null
	var sceneGroup = null
    var gameActive
    var particleCorrect, particleWrong
    var gameIndex = 2
    var tutoGroup
    var pointsBar
    var heartsGroup
    var gameSong
    var coin
    var hand
    var tiles = []
    var castleGroup
    var boardGroup
    var landGroup
    var jumpButton
    var button
    var player
    var arthurius
    var coinsGroup
    var coinCounter
    var enemiesGroup
    var enemyCounter
    var enemyLvl
    var result
    var playingTuto
    var easyMode
    var COIN_LIMIT
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        gameActive = false
        coinCounter = 0
        enemyCounter = 0
        enemyLvl = 3
		check=false;
        playingTuto = false
        easyMode = true
        
        button = new Phaser.Graphics(game)
        button.beginFill(0xffffff)
        button.drawRect(0, 0, game.world.width, game.world.height)
        button.endFill()
        button.alpha = 0
        button.inputEnabled = true
        button.isPressed = false
        button.events.onInputDown.add(inputButton)
        button.events.onInputUp.add(function(){
            button.isPressed = false
        })
        sceneGroup.add(button)
        loadSounds()
	}
    
    function inputButton(){   
        
        if(gameActive || playingTuto){
            if(!player.isJumpin && !button.isPressed && player.isRunning){
                button.isPressed = true
                doJump(JUMP_FORCE)
            }
        }
    }
    
    function animateScene() {
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.runneryogome','xpcoins')
        pointsImg.anchor.setTo(1,0)
    
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.45
        pointsText.y = pointsImg.height * 0.25
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
        pointsBar.add(pointsText)
        pointsBar.text = pointsText
        pointsBar.number = 0
    }
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        var pivotX = 10
        
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.runneryogome','life_box')

        pivotX += heartImg.width * 0.45
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = heartImg.height * 0.15
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        heartsGroup.text = pointsText
    }
    
    function addPoint(number){
        
        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
    }
    
    function missPoint(obj){
        
        sound.play("wrong")
        
        particleWrong.x = obj.centerX 
        particleWrong.y = obj.centerY
        particleWrong.start(true, 1200, null, 10)
		 
        if(lives > 0){
            lives--;
            heartsGroup.text.setText('X ' + lives)
        }
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            gameActive = false
            stopGame()
        }
    }
    
    function stopGame(){
        
		sound.play("wrong")
		sound.play("gameLose")
		
        player.touched = true
        player.body.collideWorldBounds = false
        landGroup.setAll("body.velocity.x", 0)
        coinsGroup.setAll("body.velocity.x", 0)
        arthurius.setAnimationByName(0, "lose", true)
        
        		
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)
            gameSong.stop()
			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function preload(){	
        game.stage.disableVisibilityChange = false
    }
    
    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }
    
    function onClickPlay() {
        tutoGroup.y = -game.world.height
        initTuto()
    }

	function createBackground(){
        
        var sky = sceneGroup.create(0,0,'sky')
        sky.width = game.world.width
        sky.height = game.world.height - 200

        for(var i = 0; i < 2; i++){

            var mountains = sceneGroup.create(0, game.world.height - 100, "mountains")
            mountains.anchor.setTo(0,1)
            mountains.x = mountains.width * i
            mountains.speed = 0.1
            tiles.push(mountains)
        }
        
        createCastles()

        for(var i = 0; i < 2; i++){

            var hills = sceneGroup.create(0, game.world.height + 50, 'hills')
            hills.anchor.setTo(0,1)
            hills.x = hills.width * i
            hills.speed = 2
            tiles.push(hills)
        }
    }
    
    function createCastles(){

        castleGroup = game.add.group()
        castleGroup.SPEED = 1.2
        castleGroup.createMultiple(10, "atlas.runneryogome", 'castle0')
        castleGroup.setAll('anchor.x', 0)
        castleGroup.setAll('anchor.y', 1)
        castleGroup.setAll('exists', false)
        castleGroup.setAll('visible', false)
        castleGroup.setAll('tag', getRand(0, 2, -1))
        sceneGroup.add(castleGroup)
        
        var pivotX = 0
        var type = [2, 1, 0, 2]
        for(var i = 0; i < type.length; i++){
            createTown(pivotX, type[i])
            pivotX += 120
        }
    }
    
    function createTown(x, type){
        
        var obj = castleGroup.getFirstExists(false)
            
        if(obj){

            obj.loadTexture('atlas.runneryogome', "castle" + type)
            obj.tag = type
            obj.reset(x, game.world.centerY + 160)
        }
    }
    
    function resetObj(castle){
        
        castle.kill()
        var obj = castleGroup.getFirstExists(false)
        
        if(obj){
            obj.loadTexture('atlas.runneryogome', "castle" + castle.tag)
            obj.reset(game.world.width, game.world.centerY + 160)
            obj.tag = getRand(0, 2, castle.tag)
        }
    }

	function update(){
            
        if(gameActive){

            moveScene()
            landGroup.forEachAlive(removeLand,this)

            if(jumpButton.isDown && checkTouchDown() && !player.isJumpin){
                doJump(900)
                checkTouchDown()
            }

            if(player.isJumpin){
                player.body.velocity.y -= 2
            }

            if(jumpButton.isUp && !button.isPressed){
                if(player.body.velocity.y < 0){
                    player.body.velocity.y += 20
                }
                else{
                    player.isJumpin = false
                }
            }

            if(landGroup.lastObj.x <= game.world.width - landGroup.lastObj.width + 10 && gameActive){
                
                newPath()
                coinCounter++
                enemyCounter++
            }
        }
        else{
            if(playingTuto){
                if(jumpButton.isDown && checkTouchDown() && !player.isJumpin){
                    doJump(900)
                    checkTouchDown()
                }
                
                if(player.isJumpin){
                    player.body.velocity.y -= 2
                }
                
                if(jumpButton.isUp && !button.isPressed){
                    if(player.body.velocity.y < 0){
                        player.body.velocity.y += 20
                    }
                    else{
                        player.isJumpin = false
                    }
                }
            }
            
            if(landGroup.lastObj.x <= game.world.width - landGroup.lastObj.width + 30){
                tutoPath()
            }
        }
        game.physics.arcade.collide(player, landGroup, land, null, this)
        if(enemiesGroup.canThrow){
            game.physics.arcade.collide(enemiesGroup, landGroup)
            game.physics.arcade.overlap(player, enemiesGroup, null, hitEnemy, this)
        }
        if(coinsGroup.canThrow)
            game.physics.arcade.overlap(player, coinsGroup, null, colectCoin, this)
        
        positionPlayer()
    }

    function checkTouchDown(){

        return game.physics.arcade.collide(player, landGroup)
    }

    function moveScene(){
        for(var i = 0; i < tiles.length; i++){
            tiles[i].x -= tiles[i].speed
            if(tiles[i].x <= -tiles[i].width){
                tiles[i].x = game.world.width + tiles[i].width * 0.33
            }
        }

        castleGroup.forEachAlive(function(castle){
            castle.x -= castleGroup.SPEED
            if(castle.x <= -castle.width){
                resetObj(castle)
            }
        })
    }

    function positionPlayer(){

        player.x = 100
        arthurius.x = player.x
        arthurius.y = player.y + 10
    }
    
    function doJump(force){
       
        var f = 0 || force
        player.body.velocity.y -= f
        player.isJumpin = true
        sound.play("whoosh")
        player.isRunning = false
        arthurius.setAnimationByName(0, "jump", true)
    }
    
    function land(){
        
        if(gameActive){
            if(!player.isRunning){
                player.isRunning = true
                arthurius.setAnimationByName(0, "land", true)
                arthurius.addAnimationByName(0, "run", true)
            }
            player.touchDown = false
        }
        else if(playingTuto){
            if(!player.isRunning){
                player.isRunning = true
                arthurius.setAnimationByName(0, "land", true)
                arthurius.addAnimationByName(0, "idle", true)
                
                if(hand.coin.alive){
                    game.add.tween(hand.text).to({alpha:1},200,Phaser.Easing.linear,true)
                    hand.animations.paused = true
                }
                else{
                    playingTuto = false
                    initGame()
                    game.add.tween(hand).to({alpha:0},250,Phaser.Easing.linear,true).onComplete.add(function(){
                        hand.animations.stop()
                        hand.destroy()
                    })
                }
            }
        }
    }
    
    function newPath(){

        var obj = landGroup.getFirstExists(false)

        if(obj && gameActive){
            var rand = game.rnd.integerInRange(0, 1)
            
            if(rand == 0){
                obj.loadTexture('atlas.runneryogome', "floor")
                obj.tag = "floor"
                obj.reset(game.world.width, game.world.height)
            }
            else{
                obj.loadTexture('atlas.runneryogome', "brick")
                obj.tag = "brick"
                
                if(landGroup.lastObj.tag === "floor"){
                    
                    rand = game.rnd.integerInRange(1, 2)
                    obj.reset(game.world.width - 10, (game.world.height - 200) - (obj.height * rand))
                }
                else{
                    if(landGroup.lastObj.y < game.world.centerY){
                        rand = game.rnd.integerInRange(0, 2)
                    }
                    else{
                        if(landGroup.lastObj.y > game.world.height - 400){
                            rand = game.rnd.integerInRange(1, 2) * -1
                        }
                        else{
                            rand = game.rnd.integerInRange(0, 2) * -1
                        }
                    }
                    obj.reset(game.world.width, landGroup.lastObj.y + (obj.height * rand))
                }
                if(easyMode)
                    alwaysFloor()
            }
            
            obj.body.velocity.x = -SPEED
            landGroup.lastObj = obj
            landGroup.lastObj.tag = obj.tag
            
            if(coinCounter === coinsGroup.rand){
                game.time.events.add(coinsGroup.delay, throwCoin, this, obj)
                coinsGroup.delay > 200 ? coinsGroup.delay = 200 : 350
            }
            if(enemyCounter === enemiesGroup.rand){
                game.time.events.add(350, throwEnemy, this, obj)
            }
        }
    }
    
    function alwaysFloor(){
        var obj = landGroup.getFirstExists(false)
        
        if(obj){
            obj.loadTexture('atlas.runneryogome', "floor")
            obj.tag = "floor"
            obj.reset(game.world.width, game.world.height)
            obj.body.velocity.x = -SPEED
        }
    }
    
    function createPart(key){
        
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.runneryogome',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
        particle.gravity = -1300;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
        return particle
    }
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('smoke')
        sceneGroup.add(particleWrong)
    }
	
	function createCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.8)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0
        
        hand = game.add.sprite(0, 0, "hand")
        hand.animations.add('hand')
        hand.animations.play('hand', 24, true)
        hand.alpha = 0
        hand.coin = null
        
        if(localization.getLanguage() === 'ES'){
            var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
            var text =  new Phaser.Text(sceneGroup.game, 55, -50, 'Manten presionado', fontStyle)
        }
        else{
            var fontStyle = {font: "70px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
            var text =  new Phaser.Text(sceneGroup.game, 55, -50, 'Hold', fontStyle)
        }
        
        text.anchor.setTo(0.5)
        text.alpha = 0
        text.stroke = "#00aa55"
        text.strokeThickness = 20
        hand.addChild(text)
        hand.text = text
    }

    function addCoin(obj){
        
        coin.x = obj.centerX
        coin.y = obj.centerY
        var time = 300
        
        particleCorrect.x = obj.centerX 
        particleCorrect.y = obj.centerY
        particleCorrect.start(true, 1200, null, 6)

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
                   if(pointsBar.number == 3)
                       easyMode = false
                   if(pointsBar.number == 8)
                       enemiesGroup.canThrow = true
                   if(pointsBar.number == 12)
                       enemyLvl = enemiesGroup.length - 1
               })
           })
        })
    }
    
    function createBoard(){
                
        var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var bar = new Phaser.Graphics(game, game.world.centerX - 260, 70)
        bar.beginFill(0x000000)
        bar.drawRoundedRect(0, 0, 500, 150, 30)
        bar.endFill()
        bar.alpha = 0.6
        sceneGroup.add(bar)
        
        boardGroup = game.add.group()
        sceneGroup.add(boardGroup)
        boardGroup.bar = bar
        
        var operator = new Phaser.Text(sceneGroup.game, bar.centerX - 90, bar.centerY, '+', fontStyle)
        operator.anchor.setTo(0.5)
        boardGroup.add(operator)
        boardGroup.operator = operator
        
        var sing = new Phaser.Text(sceneGroup.game, bar.centerX + 90, bar.centerY, '=', fontStyle)
        sing.anchor.setTo(0.5)
        boardGroup.add(sing)
        
        fontStyle.font = "70px VAGRounded"
        fontStyle.fill = "#000000"
        var pivotX = -180
        
        for(var i = 0; i < 3; i++){
            
            var coin = boardGroup.create(bar.centerX + pivotX, bar.centerY, "atlas.runneryogome", "coin")
            coin.anchor.setTo(0.5)
            coin.scale.setTo(0.8)
            coin.number = -1
            
            var text = new Phaser.Text(sceneGroup.game, -3, 5, '10', fontStyle)
            text.anchor.setTo(0.5)
            coin.addChild(text)
            coin.text = text
            
            pivotX += 180
        }
        
        var coinMissing = boardGroup.create(coin.centerX, coin.centerY, "atlas.runneryogome", "coinmissing")
        coinMissing.anchor.setTo(0.5)
        coinMissing.scale.setTo(0.8)
        
        boardGroup.coinMissing = coinMissing
        boardGroup.coinResult = coin
        
        boardGroup.setAll("alpha", 0)
        
        COIN_LIMIT = boardGroup.bar.centerY + 180
    }
    
    function createLand(){
        
        landGroup = game.add.group()
        landGroup.enableBody = true
        landGroup.physicsBodyType = Phaser.Physics.ARCADE
        landGroup.createMultiple(15, "atlas.runneryogome", 'floor')
        landGroup.setAll('anchor.x', 0)
        landGroup.setAll('anchor.y', 1)
        landGroup.setAll('tag', 'floor')
        landGroup.setAll('exists', false)
        landGroup.setAll('visible', false)
        landGroup.setAll('body.immovable', true)
        landGroup.setAll('body.allowGravity', false)
        landGroup.setAll('body.syncBounds', true)
        sceneGroup.add(landGroup)
        
        for(var i = 0; i < 6; i++){
        
            var obj = landGroup.getFirstExists(false)
            if(obj){
                obj.tag = "floor"
                obj.reset(obj.width * i, game.world.height)
            }
        }
        landGroup.lastObj = obj
        landGroup.lastObj.tag = "floor"
    }

    function removeLand(obj){

        if(obj.x <= -obj.width){
            deactivateObj(obj)
        }
    }
    
    function createPlayer(){
        
        player = sceneGroup.create(300, game.world.height -landGroup.lastObj.height, 'atlas.runneryogome', 'star')
        player.anchor.setTo(0.5, 1)
        player.alpha = 0
        game.physics.enable(player, Phaser.Physics.ARCADE)
        player.body.mass = 50
        player.body.collideWorldBounds = true
        player.body.onWorldBounds = new Phaser.Signal()
        player.body.onWorldBounds.add(fallFromLand,this)
        player.body.checkCollision.up = false
        player.canJump = true
        player.isJumpin = false
        player.touched = false
        player.isRunning = true
        
        arthurius = game.add.spine(player.x, player.y, "arthurius")
        arthurius.scale.setTo(0.3)          
        arthurius.setAnimationByName(0, "idle", true)
        arthurius.setSkinByName('normal')
        sceneGroup.add(arthurius)
    }
    
    function createCoins(){
        
        var fontStyle = {font: "70px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        
        coinsGroup = game.add.group()
        coinsGroup.enableBody = true
        coinsGroup.physicsBodyType = Phaser.Physics.ARCADE
        coinsGroup.createMultiple(10, "atlas.runneryogome", 'coin')
        coinsGroup.setAll('anchor.x', 0)
        coinsGroup.setAll('anchor.y', 1)
        coinsGroup.setAll('scale.x', 0.7)
        coinsGroup.setAll('scale.y', 0.7)
        coinsGroup.setAll('checkWorldBounds', true)
        coinsGroup.setAll('outOfBoundsKill', true)
        coinsGroup.setAll('exists', false)
        coinsGroup.setAll('visible', false)
        coinsGroup.setAll('body.immovable', true)
        coinsGroup.setAll('body.allowGravity', false)
        coinsGroup.setAll('body.syncBounds', true)
        coinsGroup.forEach(function(obj){
            var text =  new Phaser.Text(sceneGroup.game, 55, -50, '18', fontStyle)
            text.anchor.setTo(0.5)
            obj.addChild(text)
            obj.text = text
        },this)
        sceneGroup.add(coinsGroup)
        coinsGroup.canThrow = false
        coinsGroup.rand = getRand(2, 5, 0)
        coinsGroup.delay = 150
    }
     
    function createEnemies(){
        
        enemiesGroup = game.add.group()
        enemiesGroup.enableBody = true
        enemiesGroup.physicsBodyType = Phaser.Physics.ARCADE
        enemiesGroup.createMultiple(4, 'pink')
        enemiesGroup.createMultiple(4, 'brown')
        enemiesGroup.setAll('anchor.x', 1)
        enemiesGroup.setAll('anchor.y', 1)
        enemiesGroup.setAll('checkWorldBounds', true)
        enemiesGroup.setAll('outOfBoundsKill', true)
        enemiesGroup.setAll('exists', false)
        enemiesGroup.setAll('visible', false)
        enemiesGroup.setAll('.body.allowGravity', true)
        enemiesGroup.canThrow = false
        enemiesGroup.rand = getRand(2, 5, 0)
        sceneGroup.add(landGroup)
        
        var frames = 24
        var tag = "pink"
        
        for(var i = 0; i < enemiesGroup.length; i++){
            
            if(i > 3){
                tag = "brown"
            }
           
            enemiesGroup.children[i].animations.add('walk')
            enemiesGroup.children[i].animations.play('walk', frames, true)
            enemiesGroup.children[i].tag = tag
            enemiesGroup.children[i].scale.setTo(-0.6, 0.6)
            enemiesGroup.children[i].body.setSize(110, 90, 10, 40)
        }
    }
    
    function throwEnemy(platform){
        
        enemyCounter = 0
        enemiesGroup.rand = getRand(3, 4, enemiesGroup.rand)
        
        do {
            var obj = enemiesGroup.getRandom(0, enemyLvl)
        } while (obj.alive == true)
        
        if(obj && enemiesGroup.canThrow){
            
            obj.reset(game.world.width, platform.y - platform.height - 150)
            obj.body.velocity.x = -80
        }
    }
    
    function throwCoin(platform){
        
        coinCounter = 0
        coinsGroup.rand = getRand(1,2, coinsGroup.rand)
        
        var obj = coinsGroup.getFirstExists(false)
        
        if(obj && coinsGroup.canThrow && gameActive){
            
            setCoinNumber(obj)
            if(platform.tag == "floor"){
                obj.reset(game.world.width, platform.y - platform.height - (110 * game.rnd.integerInRange(1, 2)))
            }
            else{
                var coinHeight = platform.y - platform.height - 200 - (10 * game.rnd.integerInRange(2, 6))
                
                if(coinHeight < COIN_LIMIT)
                    coinHeight += 200
                
                obj.reset(game.world.width, coinHeight)
            }
            
            obj.body.velocity.x = -SPEED
        }
    }   
    
    function setCoinNumber(coin){
        
        var number = result
        
        if(Math.random() * 3 > 1){
            while(number == result){
                number = game.rnd.integerInRange(1,9)
            }
        }
        
        coin.text.setText(number)
        coin.number = number
    }
    
    function colectCoin(dude, obj){
        
        coinsGroup.canThrow = false
 
        if(obj.number == result){
            addCoin(obj)
            sound.play("rightChoice")
        }
        else{
            missPoint(obj)
        }
        
        boardGroup.coinMissing.alpha = 0
        popObject(boardGroup.coinResult, 0)
        coinsGroup.forEachAlive(deactivateObj, this)
        
        if(lives > 0){
            game.time.events.add(1500, function(){
                boardGroup.forEach(fadeOut, this)
                game.time.events.add(500, setQuestion)
            })
        }
        else{
            gameActive = false
        }
        
    }
    
    function hitEnemy(dude, enemy){
        
        if(!player.touched){
        
            if(enemy.tag == "pink"){
                if(dude.y < enemy.y - 40){
                    doJump(1400)
                    addCoin(enemy)
                    deactivateObj(enemy)
                }
                else{
                    player.touched = true
                    missPoint(dude)
                    arthurius.setAnimationByName(0, "lose", true)
                    game.add.tween(arthurius).from({ alpha:0},100,Phaser.Easing.linear,true,0,5,true).onComplete.add(function(){
                        if(lives > 0){
                            player.touched = false
                            arthurius.setAnimationByName(0, "run", true)
                        }
                    })
                }
            }
            else{
                player.touched = true
                missPoint(dude)
                arthurius.setAnimationByName(0, "lose", true)
                game.add.tween(arthurius).from({ alpha:0},100,Phaser.Easing.linear,true,0,5,true).onComplete.add(function(){
                    if(lives > 0){
                        player.touched = false
                        arthurius.setAnimationByName(0, "run", true)
                    }
                })
            }
        }
    }
    
    function deactivateObj(obj){

        obj.body.velocity.x = 0
        obj.y = -500
        obj.kill()
    }
    
    function fadeOut(obj){
        game.add.tween(obj).to({alpha:0},100,Phaser.Easing.linear,true)
    }
    
    function fallFromLand(){
        
        if(gameActive && player.y >= game.world.height){
            
            missPoint(arthurius)

            if(lives > 0){
                doJump(JUMP_FORCE * 2)
                arthurius.setAnimationByName(0, "lose", true)
            }
            else{
                gameActive = false
                player.body.collideWorldBounds = false
                coinsGroup.setAll("body.velocity.x", 0)
                landGroup.setAll("body.velocity.x", 0)
                doJump(JUMP_FORCE)
                arthurius.setAnimationByName(0, "lose", true)
            }
        }
    }
    
    function initGame(){
        
        gameActive = true
        
        landGroup.forEachAlive(function(obj){
            obj.body.velocity.x = -SPEED
        },this)
        
        arthurius.setAnimationByName(0, "run", true)
        player.isRunning = true
        
        newPath()
    }
    
    function setQuestion(){
        
        if(game.rnd.integerInRange(1,2) === 1){
            
            var numA = game.rnd.integerInRange(1,8)
            var numB = game.rnd.integerInRange(1,9 - numA)
        
            result = numA + numB
            boardGroup.operator.setText("+")
        }
        else{
            var numA = game.rnd.integerInRange(2,9)
            var numB = game.rnd.integerInRange(1,numA - 1)
            
            result = numA - numB
            boardGroup.operator.setText("-")
        }
        
        boardGroup.children[2].text.setText(numA)
        boardGroup.children[3].text.setText(numB)
        boardGroup.children[4].text.setText(result)
        
        var delay = 200
        
        for(var i = 0; i < boardGroup.length - 2; i++){
            popObject(boardGroup.children[i], delay)
            delay += 200
        }
        popObject(boardGroup.children[5], delay)
        
        game.time.events.add(delay, function(){
            coinsGroup.canThrow = true
        })
    }
    
    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({ x:0, y:0},200,Phaser.Easing.linear,true)
        },this)
    }
    
    function getRand(min ,limit, opt){
        var m = 0 || min
        var x = game.rnd.integerInRange(m, limit)
        if(x === opt)
            return getRand(min, limit, opt)
        else
            return x     
    }
    
    //····················tuto····················//
    
    function initTuto(){
        
        tutoPath()
       castleGroup.forEachAlive(function(obj){
           game.add.tween(obj).to({x: obj.x - 100},2500,Phaser.Easing.linear,true)
       },this)
        
       landGroup.forEachAlive(function(obj){
           obj.body.velocity.x = -SPEED
       },this)
        
        player.isRunning = true
        arthurius.setAnimationByName(0, "run", true)
        
        setTutoQuestion()
        
        game.time.events.add(2500, function(){
            landGroup.setAll("body.velocity.x", 0)
            coinsGroup.setAll("body.velocity.x", 0)
            arthurius.setAnimationByName(0, "idle", true)   
            
            showQuestion()
        })
    }
    
    function tutoPath(){
        
        var obj = landGroup.getFirstExists(false)
        
        if(obj && lives > 0){
            obj.loadTexture('atlas.runneryogome', "floor")
            obj.tag = "floor"
            obj.reset(game.world.width, game.world.height)
            obj.body.velocity.x = -SPEED
            landGroup.lastObj = obj
            landGroup.lastObj.tag = obj.tag
        }
    }
    
    function setTutoQuestion(platform){
        
        if(game.rnd.integerInRange(1,2) === 1){
            
            var numA = game.rnd.integerInRange(1,8)
            var numB = game.rnd.integerInRange(1,9 - numA)
        
            result = numA + numB
            boardGroup.operator.setText("+")
        }
        else{
            var numA = game.rnd.integerInRange(2,9)
            var numB = game.rnd.integerInRange(1,numA - 1)
            
            result = numA - numB
            boardGroup.operator.setText("-")
        }
        
        boardGroup.children[2].text.setText(numA)
        boardGroup.children[3].text.setText(numB)
        boardGroup.children[4].text.setText(result)
        
        var obj = coinsGroup.getFirstExists(false)

        if(obj){
            
            obj.text.alpha = 0
            obj.text.setText(result)
            obj.number = result
            obj.reset(game.world.width, game.world.centerY + 20)
            game.add.tween(obj).to({x:player.x - 10},2500,Phaser.Easing.linear,true)
            hand.coin = obj
        }
    }
    
    function showQuestion(){
        
        game.add.tween(boardGroup.bar.scale).to({y:1},200,Phaser.Easing.linear,true).onComplete.add(function(){
            
            var delay = 200
        
            for(var i = 0; i < boardGroup.length - 2; i++){
                popObject(boardGroup.children[i], delay)
                delay += 200
            }
            popObject(boardGroup.children[5], delay)
            delay+=200
            popObject(coinsGroup.getFirstExists().text, delay)
            
            game.time.events.add(delay, function(){
                hand.x = game.world.centerX
                hand.y = game.world.centerY
                game.add.tween(hand).to({alpha:1},200,Phaser.Easing.linear,true).onComplete.add(function(){
                    playingTuto = true
                    coinsGroup.canThrow = true
                })
            })
        })
    }
	
	return {
		
		assets: assets,
		name: "mathRun",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			game.input.mspointer.capture = false;
			createBackground()
            
            game.physics.startSystem(Phaser.Physics.ARCADE)
            game.physics.arcade.gravity.y = 1500
            
            initialize()
            gameSong = sound.play("gameSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this)

            game.onResume.add(function(){
                game.sound.mute = false
            }, this)
			            
			
            createLand()
            createCoins()
            createEnemies()
            createPlayer()
            createBoard()
            createPointsBar()
			createHearts()
            
            createCoin()
            createParticles()
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()