
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
                name: "atlas.mathRun",
                json: "images/mathRun/atlas.json",
                image: "images/mathRun/atlas.png",
            }
        ],
        images: [
            {   name:"tutorial_image",
                file: "images/mathRun/tutorial_image_%input.png"
            },
            {   name:"sky",
                file: "images/mathRun/sky.png"
            },
            {   name:"mountains",
                file: "images/mathRun/mountains.png"
            },
            {   name:"hills",
                file: "images/mathRun/hills.png"
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
            {	name: "splash",
				file: soundsPath + "splash.mp3"},
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
                width: 88,
                height: 78,
                frames: 17
            },
            {   name: "brown",
                file: "images/spines/bMonster.png",
                width: 83,
                height: 84,
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
    var tileGroup
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
        enemyLvl = 1
        playingTuto = false
        
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
                doJump(900)
            }
        }
    }
    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

    }
	
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    } 
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.mathRun','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.mathRun','life_box')

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
            stopGame()
        }
    }
    
    function stopGame(){
        
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        player.touched = true
        player.body.collideWorldBounds = false
        tileGroup.castles.setAll("body.velocity.x", 0)
        landGroup.setAll("body.velocity.x", 0)
        coinsGroup.setAll("body.velocity.x", 0)
        arthurius.setAnimationByName(0, "lose", true)
        gameSong.stop()
        		
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function preload(){
        
		//buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false
        
        //loadType(gameIndex)
    }
    
    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }
    
    function onClickPlay() {
        tutoGroup.y = -game.world.height
        //initGame()
        initTuto()
    }

	function createBackground(){
        
        var sky = sceneGroup.create(0,0,'sky')
        sky.width = game.world.width
        sky.height = game.world.height - 200
        
        tileGroup = game.add.group()
        sceneGroup.add(tileGroup)
        
        var mountains = game.add.tileSprite(0, game.world.height - 100, game.world.width, game.world.height - 200, 'mountains')
        mountains.anchor.setTo(0,1)
        tileGroup.add(mountains)
        tileGroup.mountains = mountains
        
        createCastles()
        
        var hills = game.add.tileSprite(0, game.world.height + 50, game.world.width, game.world.height - 240, 'hills')
        hills.anchor.setTo(0,1)
        tileGroup.add(hills)
        tileGroup.hills = hills
    }
    
    function createCastles(){

        var castleGroup = game.add.group()
        castleGroup.enableBody = true
        castleGroup.createMultiple(10, "atlas.mathRun", 'castle0')
        castleGroup.setAll('anchor.x', 0)
        castleGroup.setAll('anchor.y', 1)
        castleGroup.setAll('checkWorldBounds', true)
        castleGroup.setAll('outOfBoundsKill', true)
        castleGroup.setAll('exists', false)
        castleGroup.setAll('visible', false)
        castleGroup.setAll('tag', getRand(2, -1))
        castleGroup.forEach(function(obj){
            obj.body.allowGravity = false
            obj.events.onOutOfBounds.add(resetObj, this)
        },this)
        tileGroup.add(castleGroup)
        tileGroup.castles = castleGroup
        
        var pivotX = 0
        var type = [2, 1, 0, 2]
        for(var i = 0; i < type.length; i++){
            createTown(pivotX, type[i])
            pivotX += 120
        }
        createTown(game.world.width - 50, 2)
    }
    
    function createTown(x, type){
        
        var obj = tileGroup.castles.getFirstExists(false)
            
        if(obj){

            obj.loadTexture('atlas.mathRun', "castle" + type)
            obj.tag = type
            obj.reset(x, game.world.centerY + 160)
        }
    }
    
    function resetObj(castle){
        
        castle.kill()
        var obj = tileGroup.castles.getFirstExists(false)
        
        if(obj){
            obj.loadTexture('atlas.mathRun', "castle" + castle.tag)
            obj.reset(game.world.width, game.world.centerY + 160)
            obj.tag = getRand(2, castle.tag)
            obj.body.velocity.x = -30
        }
    }

	function update(){
        
        if(gameActive){
            
            tileGroup.mountains.tilePosition.x -= 0.1
            tileGroup.hills.tilePosition.x -= 2
        
            if(jumpButton.isDown && game.physics.arcade.collide(player, landGroup) && !player.isJumpin){
                doJump(900)
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

            if(landGroup.lastObj.x <= game.world.width - landGroup.lastObj.width + 5){
                
                newPath()
                coinCounter++
                enemyCounter++
            }
        }
        else{
            if(playingTuto){
                if(jumpButton.isDown && game.physics.arcade.collide(player, landGroup) && !player.isJumpin){
                    doJump(900)
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
            
            if(landGroup.lastObj.x <= game.world.width - landGroup.lastObj.width + 5){
                tutoPath()
            }
        }
        
        game.physics.arcade.collide(player, landGroup, land, null, this)
        game.physics.arcade.collide(enemiesGroup, landGroup)
        game.physics.arcade.overlap(player, coinsGroup, null, colectCoin, this)
        game.physics.arcade.overlap(player, enemiesGroup, null, hitEnemy, this)
        
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
                        boardGroup.forEachAlive(fadeOut, this)
                    })
                }
            }
        }
    }
    
    function newPath(){

        var obj = landGroup.getFirstExists(false)

        if(obj && gameActive){
            var rand = game.rnd.integerInRange(0, 1)
            
            if(rand !== 0){
                obj.loadTexture('atlas.mathRun', "floor")
                obj.tag = "floor"
                obj.reset(game.world.width, game.world.height)
            }
            else{
                rand = null
                obj.loadTexture('atlas.mathRun', "brick")
                obj.tag = "brick"
                
                if(landGroup.lastObj.tag === "floor"){
                    
                    rand = game.rnd.integerInRange(1, 2)
                    obj.reset(game.world.width, (game.world.height - 200) - (obj.height * rand))
                }
                else{
                    if(landGroup.lastObj.y < game.world.centerY - obj.height){
                        rand = game.rnd.integerInRange(-2, 0)
                    }
                    else{
                        if(landGroup.lastObj.y > game.world.height - 400){
                            rand = game.rnd.integerInRange(1, 2)
                        }
                        else{
                            rand = game.rnd.integerInRange(0, 2)
                        }
                    }
                    
                    obj.reset(game.world.width, landGroup.lastObj.y - (obj.height * rand))
                }
            }
            
            if(coinCounter === coinsGroup.rand){
                game.time.events.add(coinsGroup.delay, throwCoin, this, obj)
                coinsGroup.delay > 200 ? coinsGroup.delay = 200 : 350
            }
            if(enemyCounter === enemiesGroup.rand){
                game.time.events.add(350, throwEnemy, this, obj)
            }
            
            obj.body.velocity.x = -225
            landGroup.lastObj = obj
            landGroup.lastObj.tag = obj.tag
        }
    }
    
    function createPart(key){
        
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.mathRun',key);
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
        hand.addChild(text)
        hand.text = text
    }

    function addCoin(obj){
        
        coin.x = obj.centerX
        coin.y = obj.centerY
        var time = 300
        
        particleCorrect.x = obj.centerX 
        particleCorrect.y = obj.centerY
        particleCorrect.start(true, 1200, null, 10)

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
                   if(pointsBar.number == 5)
                       enemiesGroup.canThrow = true
                   if(pointsBar.number == 10)
                       enemyLvl = enemiesGroup.length - 1
               })
           })
        })
    }
    
    function createBoard(){
                
        var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var bar = new Phaser.Graphics(game, game.world.centerX - 250, 80)
        bar.beginFill(0x000000)
        bar.drawRoundedRect(0, 0, 500, 150, 30)
        bar.endFill()
        bar.alpha = 0.6
        sceneGroup.add(bar)
        
        boardGroup = game.add.group()
        sceneGroup.add(boardGroup)
        boardGroup.bar = bar
        
        var operator = new Phaser.Text(sceneGroup.game, bar.centerX * 0.75, bar.centerY, '+', fontStyle)
        operator.anchor.setTo(0.5)
        boardGroup.add(operator)
        boardGroup.operator = operator
        
        var sing = new Phaser.Text(sceneGroup.game, bar.centerX * 1.25, bar.centerY, '=', fontStyle)
        sing.anchor.setTo(0.5)
        boardGroup.add(sing)
        
        fontStyle.font = "70px VAGRounded"
        fontStyle.fill = "#000000"
        var pivotX = 0.5
        
        for(var i = 0; i < 3; i++){
            var coin = boardGroup.create(bar.centerX * pivotX, bar.centerY, "atlas.mathRun", "coin")
            coin.anchor.setTo(0.5)
            coin.scale.setTo(0.8)
            coin.number = -1
            
            var text = new Phaser.Text(sceneGroup.game, -3, 5, '10', fontStyle)
            text.anchor.setTo(0.5)
            coin.addChild(text)
            coin.text = text
            
            pivotX += 0.5
        }
        
        var coinMissing = boardGroup.create(bar.centerX * 1.5, bar.centerY, "atlas.mathRun", "coinmissing")
        coinMissing.anchor.setTo(0.5)
        coinMissing.scale.setTo(0.8)
        
        boardGroup.coinMissing = coinMissing
        boardGroup.coinResult = coin
        
        boardGroup.setAll("alpha", 0)
        bar.scale.setTo(1,0)
    }
    
    function createLand(){
        
        landGroup = game.add.group()
        landGroup.enableBody = true
        landGroup.physicsBodyType = Phaser.Physics.ARCADE
        landGroup.createMultiple(10, "atlas.mathRun", 'floor')
        landGroup.setAll('anchor.x', 0)
        landGroup.setAll('anchor.y', 1)
        landGroup.setAll('tag', 'floor')
        landGroup.setAll('checkWorldBounds', true)
        landGroup.setAll('outOfBoundsKill', true)
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
    
    function createPlayer(){
        
        player = sceneGroup.create(300, game.world.height -landGroup.lastObj.height, 'atlas.mathRun', 'star')
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
        coinsGroup.createMultiple(10, "atlas.mathRun", 'coin')
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
        coinsGroup.rand = getRand(2,5, 0)
        coinsGroup.delay = 150
    }
    
    function createEnemies(){
        
        enemiesGroup = game.add.group()
        enemiesGroup.enableBody = true
        enemiesGroup.physicsBodyType = Phaser.Physics.ARCADE
        enemiesGroup.createMultiple(2, 'pink')
        enemiesGroup.createMultiple(2, 'brown')
        enemiesGroup.setAll('anchor.x', 0)
        enemiesGroup.setAll('anchor.y', 1)
        enemiesGroup.setAll('checkWorldBounds', true)
        enemiesGroup.setAll('outOfBoundsKill', true)
        enemiesGroup.setAll('exists', false)
        enemiesGroup.setAll('visible', false)
        enemiesGroup.setAll('.body.allowGravity', true)
        enemiesGroup.setAll('.body.bounce.y', 0.2)
        enemiesGroup.canThrow = false
        enemiesGroup.rand = getRand(2,5, 0)
        sceneGroup.add(landGroup)
        
        var frames = 20
        var tag = "pink"
        
        for(var i = 0; i < enemiesGroup.length; i++){
            
            if(i > 1){
                frames = 24
                tag = "brown"
            }
            
            enemiesGroup.children[i].animations.add('walk')
            enemiesGroup.children[i].animations.play('walk', frames, true)
            enemiesGroup.children[i].tag = tag
        }
    }
    
    function throwEnemy(platform){
        
        enemyCounter = 0
        enemiesGroup.rand = getRand(3,4, enemiesGroup.rand)
        
        do {
            var obj = enemiesGroup.getRandom(0, enemyLvl)
        } while (obj.alive == true)
        
        if(obj && enemiesGroup.canThrow){
            
            obj.reset(game.world.width, platform.y - platform.height - 100)
            obj.body.velocity.x = -100
        }
    }
    
    function throwCoin(platform){
        
        coinCounter = 0
        coinsGroup.rand = getRand(1,2, coinsGroup.rand)
        
        var obj = coinsGroup.getFirstExists(false)
        
        if(obj && coinsGroup.canThrow){
            
            setCoinNumber(obj)
            if(platform.tag == "floor"){
                obj.reset(game.world.width, platform.y - platform.height - (100 * game.rnd.integerInRange(1, 2)))
            }
            else{
                obj.reset(game.world.width, platform.y - platform.height - 200 - (10 * game.rnd.integerInRange(2, 6)))
            }
            
            obj.body.velocity.x = -225
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
                boardGroup.forEachAlive(fadeOut, this)
                game.time.events.add(500, setQuestion)
            })
        }
        
    }
    
    function hitEnemy(dude, enemy){
        
        if(!player.touched){
            
            if(enemy.tag == "pink"){
                if(dude.y < enemy.y - enemy.height){
                    doJump(1400)
                    addCoin(enemy)
                    deactivateObj(enemy)
                    sound.play("splash")
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
        
        game.add.tween(obj).to({alpha:0},200,Phaser.Easing.linear,true)
    }
    
    function fallFromLand(){
        
        if(gameActive){
            if(player.y >= game.world.height){

                missPoint(arthurius)

                if(lives > 0){
                    doJump(1850)
                    arthurius.setAnimationByName(0, "lose", true)
                }
                else{
                    gameActive = false
                    player.body.collideWorldBounds = false
                    tileGroup.castles.setAll("body.velocity.x", 0)
                    landGroup.setAll("body.velocity.x", 0)
                    coinsGroup.setAll("body.velocity.x", 0)
                    doJump(800)
                    arthurius.setAnimationByName(0, "lose", true)
                }
            }
        }
    }
    
    function initGame(){
        
        gameActive = true
        
        tileGroup.castles.forEachAlive(function(obj){
            obj.body.velocity.x = -30
        },this)
        
        landGroup.forEachAlive(function(obj){
            obj.body.velocity.x = -225
        },this)
        
        arthurius.setAnimationByName(0, "run", true)
        player.isRunning = true
        //setQuestion()
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
            return getRand(limit, opt)
        else
            return x     
    }
    
    //····················tuto····················//
    
    function initTuto(){
        
        tutoPath()
        tileGroup.castles.forEachAlive(function(obj){
            obj.body.velocity.x = -30
        },this)
        
        landGroup.forEachAlive(function(obj){
            obj.body.velocity.x = -225
        },this)
        
        player.isRunning = true
        arthurius.setAnimationByName(0, "run", true)
        
        setTutoQuestion()
        
        game.time.events.add(2500, function(){
            tileGroup.castles.setAll("body.velocity.x", 0)
            landGroup.setAll("body.velocity.x", 0)
            coinsGroup.setAll("body.velocity.x", 0)
            arthurius.setAnimationByName(0, "idle", true)   
            
            showQuestion()
        })
    }
    
    function tutoPath(){
        
        var obj = landGroup.getFirstExists(false)
        
        if(obj){
            obj.loadTexture('atlas.mathRun', "floor")
            obj.tag = "floor"
            obj.reset(game.world.width, game.world.height)
            obj.body.velocity.x = -225
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
                })
            })
        })
    }
	
	return {
		
		assets: assets,
		name: "mathRun",
		update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
			sceneGroup = game.add.group()
			
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
			            
			createPointsBar()
			createHearts()
            createBoard()
            createLand()
            createCoins()
            createEnemies()
            createPlayer()
            createCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()