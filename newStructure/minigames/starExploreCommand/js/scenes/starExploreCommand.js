
var soundsPath = "../../shared/minigames/sounds/"

var starExploreCommand = function(){
    
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
                name: "atlas.starExploreCommand",
                json: "images/starExploreCommand/atlas.json",
                image: "images/starExploreCommand/atlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/starExploreCommand/tutorial_image_%input.png"
			},
            {
				name:'background',
				file:"images/starExploreCommand/background.png"
			}
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "energyCharge2",
				file: soundsPath + "energyCharge2.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "shoot",
				file: soundsPath + "shoot.mp3"},
            {	name: "bomb",
				file: soundsPath + "bomb.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/shooting_stars.mp3'
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
				name:"planets",
				file:"images/spines/planets/planets.json"
			},
            {
				name:"ship",
				file:"images/spines/ship/ship.json"
			},
            {
				name:"trash",
				file:"images/spines/trash/trash.json"
			},
            {
				name:"meteorite",
				file:"images/spines/meteorites/meteorite.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var particleCorrect, particleWrong
    var gameIndex = 211
    var tutoGroup
    var pointsBar
    var heartsGroup
    var gameSong
    var coin
    var space
    var ship
    var cursors
    var planets
    var obstaclesGroup
    var lang 
    var OBSTACLE_SPEED
    var SPAWN_TIME
    var OBSTACLE_SPAWN_Y
    var PLANETS_SPAWN_Y
    var PLANETS_DIRECTION
    var BULLET_DIRECTION
    var click
    var goingUp
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        OBSTACLE_SPEED = 400
        SPAWN_TIME = 1000
        OBSTACLE_SPAWN_Y = -50
        PLANETS_DIRECTION = game.world.height + 150
        PLANETS_SPAWN_Y = -150
        BULLET_DIRECTION = -700
        click = false
        goingUp = true
        
        cursors = game.input.keyboard.createCursorKeys()
         
        localization.getLanguage() === "ES" ? lang = "ES" : lang = "EN"
        
        loadSounds()
	}

    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
        },this)
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.starExploreCommand','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.starExploreCommand','life_box')

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
        initGame()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        space = sceneGroup.create(0, 0, "background")
        space.width = game.world.width
        space.height = game.world.height
    }

	function update(){
        //space.tilePosition.y += 1
        
        if(gameActive){
            
            ship.body.velocity.setTo(0, 0)

            if (cursors.left.isDown)
            {
                ship.body.velocity.x = -600
            }
            else if (cursors.right.isDown)
            {
                ship.body.velocity.x = 600
            }
            
            if(click){
                ship.x = game.input.x
            }
            
            if(checkOverlap(planets.orbit, ship) && !planets.contact){
                planets.contact = true
                addCoin(ship)
            }
            
            game.physics.arcade.overlap(ship.bullets, obstaclesGroup, playerHitsEnemy, null)
            game.physics.arcade.overlap(obstaclesGroup, ship, enemyHitsPlayer, null, this)
        }
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds()
        var boundsB = spriteB.getBounds()

        return Phaser.Rectangle.intersects(boundsA , boundsB)
    }
    
    function playerHitsEnemy(bullet, obj){
        
        if(gameActive){
            bullet.kill()
            sound.play("bomb")
            if(!obj.contact){
                obj.contact = true
                obj.body.velocity.y = 0
                var animacion = obj.anim.setAnimationByName(0, "LOSE", false)
                animacion.onComplete = function(){
                    obj.x = -200
                    obj.kill()
                }
            }
        }
    }
    
    function enemyHitsPlayer(obj, player){
        
        if(!ship.hit){
            ship.hit = true
            
            if(lives > 1){
                missPoint(ship)
                ship.anim.setAnimationByName(0, "HIT", false).onComplete = function(){
                    ship.anim.setAnimationByName(0, "IDLE", true)
                    ship.hit = false
                }
            }
            else{
                missPoint(ship)
                ship.body.velocity.setTo(0, 0)
                ship.anim.setAnimationByName(0, "LOSE", false)
            }
        }
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.starExploreCommand',key);
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
        
        hand = game.add.sprite(0, 0, "hand")
        hand.animations.add('hand')
        hand.animations.play('hand', 24, true)
        hand.alpha = 0

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
               })
           })
        })
    }
    
    function createPlanets(){
        
        planets = game.add.spine(50, -150, "planets")
        planets.setAnimationByName(0, "IDLE", true)    
        planets.NAMES = ["sun", "mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"]
        planets.setSkinByName(planets.NAMES[0])
        planets.contact = false
        planets.order = 0
        sceneGroup.add(planets)
        
        var board = game.add.sprite(-50, -60, "atlas.starExploreCommand", "name_sun_" + lang)
        board.anchor.setTo(0.5)
        board.scale.setTo(1.2)
        board.angle = -30
        planets.addChild(board)
        planets.board = board
        
        var orbit = game.add.sprite(0, 0, "atlas.starExploreCommand", "orbit")
        orbit.anchor.setTo(0,0.5)
        planets.addChild(orbit)
        planets.orbit = orbit
    }
    
    function createShip(){
        
        ship = sceneGroup.create(game.world.centerX, game.world.height - 150, "atlas.starExploreCommand", "body")
        ship.anchor.setTo(0.5)
        ship.hit = false
        ship.canon = ship.y - 50
        game.physics.enable(ship, Phaser.Physics.ARCADE)
        ship.body.collideWorldBounds = true
        
        var anim = game.add.spine(0, -1, "ship")
        anim.setAnimationByName(0, "IDLE", true)
        anim.setSkinByName("normal")
        anim.scale.setTo(1.1)
        ship.addChild(anim)
        ship.anim = anim
        
        var bullets = game.add.group()
        bullets.enableBody = true
        bullets.physicsBodyType = Phaser.Physics.ARCADE
        bullets.createMultiple(30, "atlas.starExploreCommand", 'bullet')
        bullets.setAll('anchor.x', 0.5)
        bullets.setAll('anchor.y', 1)
        bullets.setAll('checkWorldBounds', true)
        bullets.setAll('outOfBoundsKill', true)
        sceneGroup.add(bullets)
        ship.bullets = bullets
        
        game.input.onDown.add(function(){
            click = true
        })
        game.input.onUp.add(function(){
            click = false
        })
    }
    
    function createObstacles(){
        
        obstaclesGroup = game.add.group()
        obstaclesGroup.enableBody = true
        obstaclesGroup.physicsBodyType = Phaser.Physics.ARCADE
        obstaclesGroup.createMultiple(30, "atlas.starExploreCommand", 'body')
        obstaclesGroup.setAll('anchor.x', 0.5)
        obstaclesGroup.setAll('anchor.y', 0)
        obstaclesGroup.setAll('checkWorldBounds', true)
        obstaclesGroup.setAll('outOfBoundsKill', true)
        sceneGroup.add(obstaclesGroup)
        
        var aux = "meteorite"
        
        for(var i = 0; i < obstaclesGroup.length; i++){
            
            var anim = game.add.spine(0, 10, aux)
            anim.setAnimationByName(0, "IDLE", true)
            
            obstaclesGroup.children[i].tag = aux
            obstaclesGroup.children[i].addChild(anim)
            obstaclesGroup.children[i].anim = anim
            
            if(i === 14){
                aux = "trash"
            }
        }
    }
    
    function initGame(){
        
        gameActive = true
        
        game.time.events.add(500,function(){
            throwObstacle()
            releasePlanet()
            fireBullet()
        })
    }
    
    function fireBullet(){

        if(gameActive){
            
            var bullet = ship.bullets.getFirstExists(false)

            if (bullet){
                
                sound.play("shoot")
                bullet.reset(ship.x, ship.canon)
                bullet.body.velocity.y = BULLET_DIRECTION
            }
            game.time.events.add(400, fireBullet)
        }
    }
    
    function releasePlanet(){
        
        var side = game.rnd.integerInRange(0, 1)
        
        if(side === 0){
            planets.x = 50
            planets.board.angle = 30
            planets.board.x = 50
        }
        else{
            planets.x = game.world.width - 50
            planets.board.angle = -30
            planets.board.x = -50
        }
       
        planets.orbit.anchor.setTo(side, 0.5)
        planets.setSkinByName(planets.NAMES[planets.order])
        planets.setToSetupPose()
        planets.board.loadTexture("atlas.starExploreCommand", "name_" + planets.NAMES[planets.order] + "_" + lang)
        planets.contact = false
        
        planets.dropDown = game.add.tween(planets).to({ y:PLANETS_DIRECTION}, 8000, Phaser.Easing.linear, true)
        planets.dropDown.onComplete.add(function(){
            planets.y = PLANETS_SPAWN_Y
            
            if(goingUp){
                planets.order < planets.NAMES.length - 1 ? planets.order++ : turnArround()
            }
            else{
                planets.order > 0 ? planets.order-- : turnArround()
            }
            
            if(gameActive)
                game.time.events.add(200, releasePlanet)
        })
    }
    
    function throwObstacle(){
        
        if(gameActive){
            
            var obj = getRandomFromGroup()
            
            if(obj){
                if(obj.tag === "meteorite"){
                    obj.anim.setSkinByName("meteorite" + game.rnd.integerInRange(1,2))
                
                }
                else{
                    obj.anim.setSkinByName("trash" + game.rnd.integerInRange(1,4))
                }
                
                obj.anim.setAnimationByName(0, "IDLE", true)
                obj.anim.setToSetupPose()
                var spawnX = game.rnd.integerInRange(50, game.world.width - 50)
                obj.reset(spawnX, OBSTACLE_SPAWN_Y)
                obj.contact = false
                obj.body.velocity.y = OBSTACLE_SPEED
            }
            game.time.events.add(SPAWN_TIME, throwObstacle)
        }
    }
    
    function getRandomFromGroup(){
        
        var obj = obstaclesGroup.getRandom()
        
        if(obj.alive)
            return getRandomFromGroup()
        else{
            return obj
        }
    }
    
    function turnArround(){
        
        gameActive = false
        goingUp = !goingUp
        sound.play("energyCharge2")
        
        if(goingUp){
            var ang = 0
            var posY = game.world.height - 150
            PLANETS_DIRECTION = game.world.height + 150
            PLANETS_SPAWN_Y = -150
            OBSTACLE_SPAWN_Y = -50
        }
        else{
            var ang = 180
            var posY = 200
            PLANETS_DIRECTION = -150
            PLANETS_SPAWN_Y = game.world.height + 150
            OBSTACLE_SPAWN_Y = game.world.height
        }
        
        BULLET_DIRECTION *= -1
        OBSTACLE_SPEED *= -1
        planets.y = PLANETS_SPAWN_Y
        
        if(SPAWN_TIME > 200){
            SPAWN_TIME -= 100
        }
        else{
            SPAWN_TIME = 200
            OBSTACLE_SPEED < 0 ? OBSTACLE_SPEED -= 200 : OBSTACLE_SPEED += 200
        }
       
        ship.body.velocity.setTo(0, 0)
        game.add.tween(ship).to({x:game.world.centerX, y: posY}, 2000, Phaser.Easing.linear, true).onComplete.add(function(){
            game.add.tween(ship).to({angle:ang}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                goingUp ? ship.canon = ship.y - 50 : ship.canon = ship.y + 60
                initGame()
            })
        })
        
    }

	return {
		
		assets: assets,
		name: "starExploreCommand",
		update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
            game.physics.startSystem(Phaser.Physics.ARCADE)
			sceneGroup = game.add.group()
			
			createBackground()
            
            initialize()
            gameSong = sound.play("gameSong", {loop:true, volume:0.5})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this)

            game.onResume.add(function(){
                game.sound.mute = false
            }, this)
			            
			createPointsBar()
			createHearts()
            createPlanets()
            createShip()
            createObstacles()
            createCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()