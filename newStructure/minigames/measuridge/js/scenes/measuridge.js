
var soundsPath = "../../shared/minigames/sounds/"

var measuridge = function(){
    
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
                name: "atlas.measuridge",
                json: "images/measuridge/atlas.json",
                image: "images/measuridge/atlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/measuridge/gametuto.png"
			},
            {
				name:'sky',
				file:"images/measuridge/sky.png"
			}

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "water_splash",
				file: soundsPath + "water_splash.mp3"},
            {	name: "throw",
				file: soundsPath + "throw.mp3"},
            {	name: "stoneDoor",
				file: soundsPath + "stoneDoor.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/circus_gentlejammers.mp3'
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
				name:"estrella",
				file:"images/spines/estrella/estrella.json"
			},
            {
				name:"splash",
				file:"images/spines/splash/splash.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var particleCorrect, particleWrong
    var gameIndex = 217
    var tutoGroup
    var pointsBar
    var heartsGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var tiles = []
    var platformGroup
    var estrella
    var line
    var click
    var swingç
    var PLATFORM_WIDTH
    var PLATFORM_POS
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        click = false
        swing = false
        
        PLATFORM_WIDTH = 300
        PLATFORM_POS = 500
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.measuridge','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.measuridge','life_box')

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
        
        particleWrong.x = obj.x 
        particleWrong.y = obj.y
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
        
        var sky = sceneGroup.create(-5, 0, "sky")
        sky.width = game.world.width +10
        sky.height = game.world.height
        
        var clouds = game.add.tileSprite(0, 0, game.world.width, 500, "atlas.measuridge", "clouds")
        sceneGroup.add(clouds)
        tiles[0] = clouds
        
        var mountian = game.add.tileSprite(0, 180, game.world.width, 500, "atlas.measuridge", "mountian")
        sceneGroup.add(mountian)
        tiles[1] = mountian
        
        var tree = game.add.tileSprite(0, game.world.height - 130, game.world.width, 500, "atlas.measuridge", "tree")
        tree.anchor.setTo(0,1)
        sceneGroup.add(tree)
        tiles[2] = tree
    }

	function update(){
        
        tiles[0].tilePosition.x += 0.2
        
        if(gameActive){
            
            if(click){
                if(platformGroup.x < game.world.centerX + 60){
                    platformGroup.x += 5
                    
                    line.clear()
                    line.lineStyle(12, 0x8235FC, 1)
                    line.alpha = 1
                    line.moveTo(estrella.centerX + 38, estrella.centerY + 36)
                    line.lineTo(platformGroup.pole.world.x - 13, platformGroup.pole.world.y - 50)

                    for(var i = 1; i < tiles.length; i++){
                        tiles[i].tilePosition.x += 0.5 * i
                    }
                }
                else{
                    stopWalk()

                }
            }
            
            if(swing){
            
                line.clear()
                line.lineStyle(12, 0x8235FC, 1)
                line.alpha = 1
                line.moveTo(estrella.centerX + 53, estrella.centerY + 18)
                line.lineTo(platformGroup.pole.world.x - 13, platformGroup.pole.world.y - 50)
                
                for(var i = 1; i < tiles.length; i++){
                        tiles[i].tilePosition.x -= 0.5 * i
                }
            }
        }
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.measuridge',key);
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
                   if(pointsBar.number > 10 && pointsBar.number % 2 === 0){
                       PLATFORM_WIDTH > 100 ? PLATFORM_WIDTH -= 50 : PLATFORM_WIDTH = 100
                       PLATFORM_POS < 650 ? PLATFORM_POS += 50 : PLATFORM_POS = 650
                   }
               })
           })
        })
    }
    
    function createFloor(){
        
        var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        platformGroup = game.add.group()
        sceneGroup.add(platformGroup)
        
        var platform = game.add.tileSprite(game.world.centerX + 80, game.world.height, PLATFORM_WIDTH, 480, "atlas.measuridge", "earth")
        platform.anchor.setTo(0,1)
        platformGroup.add(platform)
        platformGroup.platform = platform
        
        var grass = game.add.tileSprite(0, -480, PLATFORM_WIDTH, 39, "atlas.measuridge", "grass")
        platform.addChild(grass)
        platform.grass = grass
        
        var floor = game.add.tileSprite(-game.world.centerX - 100, game.world.height, game.world.width + 50, 480, "atlas.measuridge", "earth")
        floor.anchor.setTo(0,1)
        platformGroup.add(floor)
        
        var grass = game.add.tileSprite(0, -480, game.world.width + 50, 39, "atlas.measuridge", "grass")
        floor.addChild(grass)
        
        for(var i = 0; i < 4; i++){
            
            var circle = game.add.graphics(game.world.centerX - 90 - (170 * i), game.world.centerY + 80)
            circle.beginFill(0x202020, 0.4)
            circle.drawCircle(0, 0, 80)
            platformGroup.add(circle)
            
            var name = new Phaser.Text(sceneGroup.game, 0, 5, i+"m", fontStyle)
            name.anchor.setTo(0.5)
            circle.addChild(name)
        }
        
        var pole = platformGroup.create(game.world.centerX - 90, 480, "atlas.measuridge", "pole")
        pole.anchor.setTo(0.5, 1)
        pole.scale.setTo(1.4)
        platformGroup.pole = pole
        
        var water = game.add.tileSprite(0, game.world.height, game.world.width, 130, "atlas.measuridge", "water")
        water.anchor.setTo(0,1)
        sceneGroup.add(water)
    }
    
    function createEstrella(){
        
        estrella = game.add.spine(game.world.centerX - 190, 480, "estrella")
        estrella.scale.setTo(0.4)
        estrella.setAnimationByName(0, "idle", true)
        estrella.setSkinByName("normal")
        sceneGroup.add(estrella)
        
        var box = game.add.graphics(-220, -350)
        box.beginFill(0x0000ff)
        box.drawRect(0, 0, 300, 350)
        box.alpha = 0
        box.inputEnabled = true
        box.events.onInputDown.add(startWalk, this)
        box.events.onInputUp.add(stopWalk, this)
        estrella.addChild(box)
        estrella.box = box
        
        var feet = game.add.graphics(-100, -50)
        feet.beginFill(0xff0000)
        feet.drawRect(0, 0, 150, 50)
        feet.alpha = 0
        estrella.addChild(feet)
        estrella.feet = feet
        
        splash = game.add.spine(-80, game.world.height - 70, "splash")
        splash.setAnimationByName(0, "", true)
        splash.setSkinByName("normal")
        sceneGroup.add(splash)
        
        line = game.add.graphics(0,0)
        line.lineStyle(12, 0x8235FC, 1)
        line.beginFill()
        line.moveTo(estrella.centerX + 38, estrella.centerY + 36)
        line.lineTo(platformGroup.pole.world.x - 13, platformGroup.pole.world.y - 50)
        line.endFill()
        sceneGroup.add(line)
        
        estrella.box.inputEnabled = false
    }
    
    function startWalk(box){
        
        if(gameActive){
            estrella.setAnimationByName(0, "walk", true)
            click = true
            
        }
    }
    
    function stopWalk(box){
        
        if(gameActive){
            
            click = false
            swing = true
            estrella.box.inputEnabled = false
            estrella.setAnimationByName(0, "swing", true)
            
            var distance = platformGroup.pole.world.x - estrella.x
            var timer = distance * 2
           
            game.add.tween(estrella).to({x:estrella.x + distance}, timer * 2,Phaser.Easing.linear,true)
            sound.play("throw")
            game.add.tween(estrella).to({y:estrella.y + distance}, timer, Phaser.Easing.Cubic.Out,true).onComplete.add(function(){
                game.add.tween(estrella).to({y:480}, timer, Phaser.Easing.Cubic.In,true).onComplete.add(function(){
                    swing = false
                    gameActive = false
                    game.add.tween(line).to({alpha:0}, 300, Phaser.Easing.linear,true)
                    
                    checkLanding()
                })
            })
            
            game.add.tween(platformGroup).to({x:-150}, timer * 2,Phaser.Easing.linear,true)
        }
    }
    
    function checkLanding(){
        
        if(platformGroup.platform.overlap(estrella.feet)){
            estrella.setAnimationByName(0, "idle", true)
            addCoin(estrella)
            game.add.tween(estrella).to({x:game.world.centerX - 190}, 500, Phaser.Easing.linear, true, 500)
            for(var i = 1; i < tiles.length; i++){
                game.add.tween(tiles[i].tilePosition).to({x:0}, 500,Phaser.Easing.linear, true, 500)
            }
            game.add.tween(platformGroup).to({x:0}, 500,Phaser.Easing.linear, true, 500)
            game.add.tween(platformGroup.platform).to({x:0}, 500,Phaser.Easing.linear, true, 500).onComplete.add(function(){
                clearLine()
                restartPlatform()
            })
        }
        else{
            estrella.setAnimationByName(0, "lose", false)
            estrella.addAnimationByName(0, "losestill", false).onComplete = function(){
                splash.x = estrella.x
                sound.play("water_splash")
                splash.setAnimationByName(0, "splash", false).onComplete = function(){
                    missPoint(splash)
                    if(lives > 0){
                        game.add.tween(platformGroup).to({x:0}, 500,Phaser.Easing.linear, true, 500).onComplete.add(function(){
                            estrella.x = game.world.centerX - 190
                            estrella.setToSetupPose()
                            estrella.setAnimationByName(0, "idle", true)
                            game.add.tween(estrella).from({x:0}, 500,Phaser.Easing.linear, true).onComplete.add(function(){
                                clearLine()
                                initGame()
                            })
                        })
                    }
                }
            }
        }
    }
    
    function restartPlatform(){
        
        var W = game.rnd.integerInRange(PLATFORM_WIDTH*0.5, PLATFORM_WIDTH)
        var P = game.rnd.integerInRange(420, PLATFORM_POS)
       
        platformGroup.platform.x = P
        platformGroup.platform.width = platformGroup.platform.grass.width = W
        
        game.time.events.add(800,function(){
            sound.play("stoneDoor")
        })
        game.add.tween(platformGroup.platform).from({y:game.world.height*1.5}, 800, Phaser.Easing.linear, true, 800).onComplete.add(initGame)
    }
    
    function clearLine(){
        line.clear()
        line.lineStyle(12, 0x8235FC, 1)
        line.alpha = 1
        line.moveTo(estrella.centerX + 38, estrella.centerY + 36)
        line.lineTo(platformGroup.pole.world.x - 13, platformGroup.pole.world.y - 50)
    }
    
    function initGame(){
                       
        gameActive = true
        estrella.box.inputEnabled = true
    }
	
	return {
		
		assets: assets,
		name: "measuridge",
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
            createFloor()
            createEstrella()
            createCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()