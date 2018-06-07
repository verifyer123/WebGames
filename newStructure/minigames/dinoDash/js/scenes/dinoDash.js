
var soundsPath = "../../shared/minigames/sounds/"

var dinoDash = function(){
    
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
                name: "atlas.dinoDash",
                json: "images/dinoDash/atlas.json",
                image: "images/dinoDash/atlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/dinoDash/tutorial_image_%input.png"
			},
            {
				name:'sky',
				file:"images/dinoDash/sky.png"
			}

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "pouring",
				file: soundsPath + "pouring.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "throw",
				file: soundsPath + "throw.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/classic_arcade.mp3'
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
            }
        ],
        spines:[
			{
				name:"dino",
				file:"images/spines/dino/dino.json"
			},
            {
				name:"oof",
				file:"images/spines/nao/nao.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var particleCorrect, particleWrong
    var gameIndex = 213
    var tutoGroup
    var pointsBar
    var heartsGroup
    var timerGroup
    var gameSong
    var coin
    var tilesGroup
    var obstaclesGroup
    var dino
    var oof
    var spaceKey
    var OBSTACLE_SPEED
    var SPAWN_TIME
    var WATER_LVL
    var JUMP_COUNTS
    var JUMP_SPEED
    var JUMP_LIMIT
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        OBSTACLE_SPEED = 300
        SPAWN_TIME = 2000
        WATER_LVL = 5
        JUMP_COUNTS = 0
        JUMP_SPEED = 400
        JUMP_LIMIT = 4
        
        
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        
        loadSounds()
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.dinoDash','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.dinoDash','life_box')

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
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            oof.setAnimationByName(0, "LOSE", false)
            oof.addAnimationByName(0, "LOSESTILL", true)
            stopGame()
        }
    }
    
    function stopGame(){
        
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
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
        game.time.events.add(300, initGame)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        tilesGroup = game.add.group()
        tilesGroup.speed = 0.5
        sceneGroup.add(tilesGroup)
        
        var sky = game.add.tileSprite(0, 0, game.world.width, game.world.centerY, "sky")
        sky.speed = 0.0005
        tilesGroup.add(sky)
        
        var mountains = game.add.tileSprite(0, game.world.centerY, game.world.width, 90, "atlas.dinoDash", "mountains")
        mountains.speed = 0.001
        mountains.anchor.setTo(0, 1)
        
        var road = game.add.tileSprite(0, mountains.y - 5, game.world.width, 500, "atlas.dinoDash", "road")
        road.speed = 0.0166
        tilesGroup.add(road)
        tilesGroup.road = road
        
        tilesGroup.add(mountains)
    }

	function update(){
        
        if(gameActive){
            
            if(spaceKey.isDown){
                if(!oof.isJumping){
                    oof.isJumping = true
                    jump()
                }
            }
            
            game.input.onDown.add(function(){
                if(!oof.isJumping){
                    oof.isJumping = true
                    jump()
                }
            })
            
            for(var i = 0; i < tilesGroup.length; i++){
                tilesGroup.children[i].tilePosition.x -= OBSTACLE_SPEED * tilesGroup.children[i].speed
            }
            
            game.physics.arcade.overlap(obstaclesGroup, oof.box, playerHitsObj, null, this)
        }
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.dinoDash',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
        particle.gravity = 150;
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
    }

    function addCoin(obj){
        
        coin.x = obj.centerX
        coin.y = obj.centerY
        var time = 300
        
        particleCorrect.x = obj.centerX 
        particleCorrect.y = obj.centerY
        particleCorrect.start(true, 1200, null, 10)
        sound.play("rightChoice")

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
                   if(pointsBar.number > 10 && pointsBar.number % 2 === 0){
                       OBSTACLE_SPEED < 700 ? OBSTACLE_SPEED += 100 : OBSTACLE_SPEED = 700
                       SPAWN_TIME > 1000 ? SPAWN_TIME -= 250 : SPAWN_TIME = 1000
                       JUMP_SPEED > 180 ? JUMP_SPEED -= 55 : JUMP_SPEED = 180
                       obstaclesGroup.setAll("body.velocity.x", -OBSTACLE_SPEED, true, true)
                       if(JUMP_LIMIT === 4)
                           JUMP_LIMIT--
                   }
               })
           })
        })
    }
    
    function createRuners(){
        
        dino =  game.add.spine(140, tilesGroup.road.centerY - 160, "dino")
        dino.setAnimationByName(0, "IDLE", true)
        dino.setSkinByName("normal")
        sceneGroup.add(dino)
        
        oof =  game.add.spine(140, tilesGroup.road.centerY - 10, "oof")
        oof.setAnimationByName(0, "IDLE", true)
        oof.setSkinByName("normal")
        oof.isJumping = false
        oof.scale.setTo(0.5)
        sceneGroup.add(oof)
        
        var box = game.add.graphics(-100, -360)
        box.beginFill(0x00aaff)
        box.drawRect(0, 0, 110, 100)
        box.alpha = 0
        game.physics.enable(box, Phaser.Physics.ARCADE)
        oof.addChild(box)
        oof.box = box
        
        var backBar = sceneGroup.create(game.world.centerX, game.world.height - 120, "atlas.dinoDash", "backBar")
        backBar.anchor.setTo(0.5)
        backBar.scale.setTo(1.2)
        sceneGroup.add(backBar)
        
        var water = game.add.tileSprite(backBar.x - 195, backBar.y - 5, 430, 42,  "atlas.dinoDash", "water")
        water.anchor.setTo(0, 0.5)
        oof.water = water
        sceneGroup.add(water)
        
        var bar = sceneGroup.create(game.world.centerX, game.world.height - 120, "atlas.dinoDash", "bar")
        bar.anchor.setTo(0.5)
        bar.scale.setTo(1.2)
        sceneGroup.add(bar)
    }
    
    function createAssets(){
        
        obstaclesGroup = game.add.group()
        obstaclesGroup.enableBody = true
        obstaclesGroup.physicsBodyType = Phaser.Physics.ARCADE
        obstaclesGroup.createMultiple(30, "atlas.dinoDash", 'bottle')
        obstaclesGroup.setAll('anchor.x', 0)
        obstaclesGroup.setAll('anchor.y', 1)
        obstaclesGroup.setAll('checkWorldBounds', true)
        obstaclesGroup.setAll('outOfBoundsKill', true)
        obstaclesGroup.setAll('exists', false)
        obstaclesGroup.setAll('visible', false)
        obstaclesGroup.setAll('tag', -1)
        sceneGroup.add(obstaclesGroup)
    }
    
    function jump(){
        
        sound.play("whoosh")
        var up = game.add.tween(oof).to({y:oof.y - 150}, JUMP_SPEED, Phaser.Easing.Cubic.Out, false)
        up.onComplete.add(function(){
            oof.setAnimationByName(0, "JUMP", false)
        })
        var down = game.add.tween(oof).to({y:oof.y}, JUMP_SPEED, Phaser.Easing.Cubic.In, false)
        down.onComplete.add(function(){
            oof.isJumping = false
            changeWaterStats()
        })
        
        up.chain(down)
        
        oof.setAnimationByName(0, "EXTRA_JUMP", false)
        up.start()
        JUMP_COUNTS ++
    }
    
    function changeWaterStats(){
        
        if(JUMP_COUNTS === JUMP_LIMIT){
            
            JUMP_COUNTS = 0
            
            if(WATER_LVL > 0){
                WATER_LVL--
                sound.play("pouring")
                game.add.tween(oof.water).to({width: oof.water.width - (430/5)}, 400, Phaser.Easing.linear, true)
            }
        }    
        checkWaterLevel()
    }
    
    function checkWaterLevel(){
        
        if(WATER_LVL > 0 && lives > 0){        
            if(WATER_LVL > 3){
                oof.setAnimationByName(0, "RUN", true)
                game.add.tween(dino).to({x: oof.x}, 1000, Phaser.Easing.linear, true)
            }
            else{
                oof.setAnimationByName(0, "TIRED" + WATER_LVL, true)
                game.add.tween(dino).to({x: oof.x + (70 * (5 - WATER_LVL))}, 1000, Phaser.Easing.linear, true)
            }
        }
        else{
            wasted()
        }
    }
    
    function wasted(){
        
        gameActive = false
        oof.setAnimationByName(0, "LOSE", false)
        oof.addAnimationByName(0, "LOSESTILL", true)
        game.add.tween(dino).to({x: game.world.width + 200}, 1000, Phaser.Easing.linear, true, 300)
        //missPoint(oof)
        obstaclesGroup.setAll("body.velocity.x", 0, true, true)
        
        if(lives > 1){
            missPoint(oof)
            obstaclesGroup.forEachAlive(fadeOut, this)
            game.time.events.add(1000, rehydrateOof)
        }
        else{
            if(lives > 0){
                missPoint(oof)
                oof.setAnimationByName(0, "LOSE", false)
                oof.addAnimationByName(0, "LOSESTILL", true)
            }
        }
    }
    
    function fadeOut(obj){

        game.add.tween(obj).to({alpha: 0}, 200, Phaser.Easing.linear, true, 800).onComplete.add(function(){
            obj.kill()
            obj.alpha = 1
        })
    }
    
    function playerHitsObj(box, obj){
        
        if(gameActive && !obj.hit){
            obj.hit = true
            
            if(obj.tag === 0){
                obj.kill()
                addCoin(oof)
                if(WATER_LVL < 5){
                    WATER_LVL++
                    game.add.tween(oof.water).to({width: oof.water.width + (430/5)}, 400, Phaser.Easing.linear, true)
                }
            }
            else{
                if(WATER_LVL > 0){
                    missPoint(oof)
                    WATER_LVL--
                    sound.play("pouring")
                    game.add.tween(oof.water).to({width: oof.water.width - (430/5)}, 400, Phaser.Easing.linear, true)
                    if(lives !== 0)
                        game.add.tween(oof).to({alpha: 0}, 80, Phaser.Easing.linear, true, 0, 3, true)
                }
            }
            
            if(lives !== 0)
                checkWaterLevel()
            else
                wasted()
        }
    }
    
    function rehydrateOof(){
        
        var obj = obstaclesGroup.getFirstExists(false)
        obj.loadTexture("atlas.dinoDash", 'bottle')
        obj.reset(oof.x + 60, oof.y - 50)
        
        obj.anchor.setTo(0.5)
        sound.play("throw")
        game.add.tween(obj).from({angle:720}, 1000, Phaser.Easing.linear, true)
        game.add.tween(obj).from({y:300}, 1000, Phaser.Easing.Cubic.In, true)
        game.add.tween(obj).from({x:game.world.width}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
            WATER_LVL = 5
            sound.play("pouring")
            game.add.tween(oof.water).to({width: 430}, 400, Phaser.Easing.linear, true).onComplete.add(function(){
                oof.setAnimationByName(0, "IDLE", true)
                fadeOut(obj)
                obj.anchor.setTo(0,1)
                game.time.events.add(500, function(){
                    gameActive = true
                    oof.setAnimationByName(0, "RUN", true)
                    game.add.tween(dino).to({x: oof.x}, 1500, Phaser.Easing.linear, true, 500).onComplete.add(function(){
                        initGame()
                    })
                })
            })
        })
    }
    
    function initGame(){

        oof.setAnimationByName(0, "RUN", true)
        dino.setAnimationByName(0, "RUN", true)
        gameActive = true
        throwObstacle()
    }
    
    function throwObstacle(){
        
        if(gameActive){
            
            var obj = obstaclesGroup.getFirstExists(false)
            
            if(obj){
                
                if(game.rnd.integerInRange(0, WATER_LVL) === 0){
                    obj.loadTexture("atlas.dinoDash", 'bottle')
                    obj.tag = 0
                }
                else{
                    obj.loadTexture("atlas.dinoDash", 'cactus' + game.rnd.integerInRange(0, 2))
                    obj.tag = 1
                }
                
                obj.hit = false
                obj.reset(game.world.width, tilesGroup.road.centerY)
                obj.body.velocity.x = -OBSTACLE_SPEED
            }
            
            var delay = game.rnd.integerInRange(SPAWN_TIME - 600, SPAWN_TIME + 100)
            game.time.events.add(delay, throwObstacle)
        }
    }
	
	return {
		
		assets: assets,
		name: "dinoDash",
		update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
                        			
            /*gameSong = game.add.audio('gameSong')
            game.sound.setDecodedCallback(gameSong, function(){
                gameSong.loopFull(0.6)
            }, this);*/
            
            initialize()
            gameSong = sound.play("gameSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            createRuners()
            createAssets()
            createCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()