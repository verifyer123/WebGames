
var soundsPath = "../../shared/minigames/sounds/"

var mamboJumpO = function(){
    
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
                name: "atlas.mamboJumpO",
                json: "images/mamboJumpO/atlas.json",
                image: "images/mamboJumpO/atlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/mamboJumpO/gametuto.png"
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
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "bongoes",
				file: soundsPath + "bongoes.wav"},
            {	name: "cowbell",
				file: soundsPath + "cowbell.mp3"},
            {	name: "guiro",
				file: soundsPath + "guiro.wav"},
            {	name: "maraca",
				file: soundsPath + "maraca.mp3"},
            {	name: "triangle",
				file: soundsPath + "triangle.wav"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/la_fiesta.mp3'
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
				name:"dinamita",
				file:"images/spines/dinamita/dinamita.json"
			},
            {
				name:"disc",
				file:"images/spines/disc/vinyl disc.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var particleCorrect, particleWrong
    var gameIndex = 102
    var tutoGroup
    var pointsBar
    var heartsGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var dinamita
    var itemsGroup
    var assetsGroup
    var SPEED
    var THE_CHOSSEN_ONE
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        SPEED = 4000
        THE_CHOSSEN_ONE = -1
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.mamboJumpO','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.mamboJumpO','life_box')

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
        
        /*game.add.tween(dinamita).to({x:game.world.width - 20}, 500, Phaser.Easing.linear,true).onComplete.add(function(){
            dinamita.setAnimationByName(0, "good", false)
            dinamita.addAnimationByName(0, "run", true)
            game.add.tween(dinamita).to({x:490}, 500, Phaser.Easing.linear,true).onComplete.add(function(){
                initGame()
            })
        })*/
        var delay = initTuto()
        
        game.time.events.add(delay + 1000, function(){
            itemsGroup.forEachAlive(fadeOut,this)
            game.add.tween(dinamita).to({x:game.world.width - 20}, 500, Phaser.Easing.linear,true).onComplete.add(function(){
                dinamita.setAnimationByName(0, "good", false)
                dinamita.addAnimationByName(0, "run", true)
                game.add.tween(dinamita).to({x:490}, 500, Phaser.Easing.linear,true).onComplete.add(function(){
                    initGame()
                })
            })
        })
    }
    
    function fadeOut(obj){

        game.add.tween(obj).to({alpha: 0}, 200, Phaser.Easing.linear, true).onComplete.add(function(){
            obj.kill()
            obj.alpha = 1
        })
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.mamboJumpO", "tile"))
        
        var disc = game.add.spine(0, game.world.centerY, "disc")
        disc.setAnimationByName(0, "IDLE", true)
        disc.setSkinByName("normal")
        //disc.scale.setTo(0.8)
        sceneGroup.add(disc)
        
        var shadow = sceneGroup.create(game.world.width + 200, -15, "atlas.mamboJumpO", "needleShadow")
        shadow.anchor.setTo(1,0)
        
        var circle = game.add.graphics(0, game.world.centerY - 70)
        circle.beginFill(0xFF0000, 0)
        circle.arc(0, 0, disc.width * 0.5, game.math.degToRad(-20), game.math.degToRad(180), false)
        circle.inputEnabled = true
        circle.events.onInputDown.add(changeLine, this)
    }

	function update(){
        
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.mamboJumpO',key);
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
                   if(pointsBar.number > 15 && pointsBar.number % 2 === 0){
                       SPEED > 1500 ? SPEED -= 500 : SPEED = 1500
                   }
               })
           })
        })
    }
    
    function createDinamita(){
        
        dinamita = game.add.spine(game.world.width + 100, game.world.centerY - 30, "dinamita")
        dinamita.setAnimationByName(0, "run", true)
        dinamita.setSkinByName("normal")
        
        var box = game.add.graphics(-30, -20)
        box.beginFill(0xff0000, 0)
        box.drawRect(0, 0, 50, 50)
        dinamita.addChild(box)
        dinamita.box = box
    }
    
    function createItems(){
        
        itemsGroup = game.add.group()
        itemsGroup.items = ["bongoes", "cowbell", "guiro", "maraca", "triangle"]
        itemsGroup.createMultiple(12, "atlas.mamboJumpO", 'star')
        itemsGroup.setAll('anchor.x', 1)
        itemsGroup.setAll('anchor.y', 0.5)
        itemsGroup.setAll('checkWorldBounds', true)
        itemsGroup.setAll('outOfBoundsKill', true)
        itemsGroup.setAll('exists', false)
        itemsGroup.setAll('visible', false)
        itemsGroup.setAll('tag', -1)
        itemsGroup.setAll('hit', false)
        
        var needle = game.add.sprite(game.world.width + 100, -15, "atlas.mamboJumpO", "needle")
        needle.anchor.setTo(1,0)
        game.add.tween(needle).to({y:needle.y +10}, 300, Phaser.Easing.linear, true, 0, -1, true)
        
        assetsGroup = game.add.group()
        sceneGroup.add(assetsGroup)
        
        assetsGroup.add(needle)
        assetsGroup.add(dinamita)
        assetsGroup.add(itemsGroup)
        
        var speaker = assetsGroup.create(game.world.width - 130, game.world.height - 100, "atlas.mamboJumpO", "speaker")
        speaker.anchor.setTo(0.5)
        assetsGroup.speaker = speaker
    }
    
    function changeLine(circle){
        
        if(gameActive){
        
            var distance = Math.round(Phaser.Math.distance(circle.x, circle.y, game.input.x, game.input.y))
            var posX

            if(distance >= 200 && distance < 323){
                posX = circle.x + 250
            }
            else if(distance >= 323 && distance < 452){
                posX = circle.x + 380
            }
            else if(distance >= 452){
                posX = circle.x + 490
            }
            
            sound.play("cut")
            game.add.tween(dinamita).to({ x:posX},250,Phaser.Easing.linear,true)
        }
        
    }
    
    function checkChoise(obj){
        
        if(gameActive){
            if(obj.overlap(dinamita.box)){
                if(obj.tag === THE_CHOSSEN_ONE){
                    dinamita.setAnimationByName(0, "good", false)
                    dinamita.addAnimationByName(0, "run", true)
                    addCoin(obj)
                }
                else{
                    if(lives > 1){
                        dinamita.setAnimationByName(0, "hit", false)
                        dinamita.addAnimationByName(0, "run", true)
                        missPoint(obj)
                    }
                    else{
                        missPoint(obj)
                        dinamita.setAnimationByName(0, "lose", false)
                    }
                }
            }
        }
        sound.stop(itemsGroup.items[THE_CHOSSEN_ONE])
        assetsGroup.sendToBack(itemsGroup)
        itemsGroup.sendToBack(obj)
        game.add.tween(obj.scale).to({x:0.75/ obj.shrink, y:0.75/obj.shrink}, SPEED, Phaser.Easing.linear,true).onComplete.add(function(){
            obj.scale.setTo(1)
            obj.kill()
        })
        game.time.events.add(SPEED * 0.5, function(){
            assetsGroup.bringToTop(itemsGroup)
        })
    }

    function initGame(){
        
        gameActive = true
        game.time.events.add(500, throwObstacle)
    }
    
    function throwObstacle(){
        
        if(gameActive){
            
            var pivotX = 320 
            var pivotY = 270 
            var grow = 0.8
            var shrink = 1
            
            Phaser.ArrayUtils.shuffle(itemsGroup.items)
            
            THE_CHOSSEN_ONE = game.rnd.integerInRange(1, 3)
            
            for(var i = 1; i < 4; i++){
                  
                var obj = itemsGroup.getFirstExists(false)

                if(obj){
                     
                    obj.loadTexture("atlas.mamboJumpO", itemsGroup.items[i])
                    obj.tag = i
                    obj.shrink = shrink
                    obj.reset(0, game.world.centerY + (125 * i))

                    sound.play(itemsGroup.items[THE_CHOSSEN_ONE])
                    game.add.tween(assetsGroup.speaker.scale).to({x:1.3, y: 1.3}, 150, Phaser.Easing.linear,true, 0, 0, true)
                    
                    game.add.tween(obj).to({x:pivotX}, SPEED, Phaser.Easing.linear,true, 0, 0, true)
                    game.add.tween(obj.scale).from({x:grow, y:grow}, SPEED, Phaser.Easing.linear, true)
                    
                    var go = game.add.tween(obj).to({y:game.world.centerY - 20}, SPEED, Phaser.Easing.Cubic.In, true)
                    go.onComplete.add(checkChoise, this)
                    
                    var back = game.add.tween(obj).to({y: game.world.centerY - pivotY}, SPEED, Phaser.Easing.Cubic.Out, false)
                    go.chain(back)
                    
                    pivotX += 140
                    pivotY += 60
                    shrink += 0.4
                    grow += 0.2
                }
            }
            game.time.events.add(SPEED + 300, throwObstacle)
        }
    }
    
    function initTuto(){
        
        var posX = [300, 430, 390, 430, 260]
        var posY = [60, 10, -110, -260, -340]
        var delay = 300
        var aux = 1
        
        for(var i = 0; i < 5; i++){
            
            var obj = itemsGroup.getFirstExists(false)
            
            if(obj){
                obj.tag = i
                obj.loadTexture("atlas.mamboJumpO", itemsGroup.items[i])
                obj.reset(posX[i], game.world.centerY - posY[i])
                var objTween = game.add.tween(obj).from({x:0}, 1000, Phaser.Easing.linear,true, delay)
                objTween.onComplete.add(tutoSounds, this)
                game.add.tween(obj).from({y:game.world.centerY + (130 * aux)}, 1000, Phaser.Easing.Cubic.In,true, delay)
                delay += 2800
                if(i === 0 || i === 2)
                    aux ++
            }
        }
        
        return delay
    }
    
    function tutoSounds(obj){
        
        sound.play(itemsGroup.items[obj.tag])
        game.add.tween(obj.scale).to({x:1.3, y: 1.3}, 150, Phaser.Easing.linear,true, 0, 0, true)
        game.add.tween(assetsGroup.speaker.scale).to({x:1.3, y: 1.3}, 150, Phaser.Easing.linear,true, 0, 0, true)
        
    }
	
	return {
		
		assets: assets,
		name: "mamboJumpO",
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
            gameSong = sound.play("gameSong", {loop:true, volume:0.3})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			         
            createDinamita()
            createItems()
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