
var soundsPath = "../../shared/minigames/sounds/"

var aniMarathon = function(){
    
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
                name: "atlas.aniMarathon",
                json: "images/aniMarathon/atlas.json",
                image: "images/aniMarathon/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/aniMarathon/timeAtlas.json",
                image: "images/aniMarathon/timeAtlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/aniMarathon/gameTuto.png"
			},
            {
				name:'mountain0',
				file:"images/aniMarathon/mountain0.png"
			},
            {
				name:'mountain1',
				file:"images/aniMarathon/mountain1.png"
			},
            

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
            {	name: "robotWhoosh",
				file: soundsPath + "robotWhoosh.mp3"},
            {	name: "throw",
				file: soundsPath + "throw.mp3"},
            {	name: "punch",
				file: soundsPath + "punch2.mp3"},
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
				name:"oof",
				file:"images/spines/oof/oof.json"
			},
            {
				name:"monster",
				file:"images/spines/monster/monster.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var particleCorrect, particleWrong
    var gameIndex = 221
    var tutoGroup
    var pointsBar
    var heartsGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var cloudsGroup
    var mountainsArray = []
    var floorGroup
    var boardText
    var oof
    var obstaclesGroup
    var buttonsGroup
    var gap
    var SPEED
    var randObstacle
    var GAME_TIME
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#fff00f"
        lives = 3
        gameActive = false
        SPEED = 250
        gap = false
        randObstacle = -1
        GAME_TIME = 5000
        
        loadSounds()
	}
    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},500, Phaser.Easing.Cubic.Out,true)

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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.aniMarathon','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.aniMarathon','life_box')

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
        
        var back = game.add.graphics(0, 0)
        back.beginFill(0xffd585)
        back.drawRect(0, 0, game.world.width, game.world.height)
        sceneGroup.add(back)
        
        var sun = sceneGroup.create(game.world.centerX + 100, 80, "atlas.aniMarathon", "sun")
        
        cloudsGroup = game.add.group()
        cloudsGroup.x = game.world.width
        sceneGroup.add(cloudsGroup)
        
        for(var i = 0; i < 2; i++){
            
            var cloud = cloudsGroup.create(game.world.centerX * 0.6, 170, "atlas.aniMarathon", "cloud" + i)
            cloud.anchor.setTo(0.5)
            
            var mountain = sceneGroup.create(0, game.world.height - 150, "mountain" + i)
            mountain.anchor.setTo(0, 1)
            mountainsArray[i] = mountain
        }
        
        cloud.x += 250
        cloud.y += 80
        mountain.x += 540
    }

	function update(){
        
        if(cloudsGroup.x > -game.world.width)
            cloudsGroup.x -= 0.15
        else
            cloudsGroup.x = game.world.width
        
        if(gameActive){
            
            mountainsArray.forEach(function(mount){
                if(mount.x > -500)
                    mount.x -= SPEED * 0.005
                else
                    mount.x = game.world.width
            },this)
        }
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.aniMarathon',key);
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
    
    function createTimer(){
        
        timerGroup = game.add.group()
        timerGroup.alpha = 0
        sceneGroup.add(timerGroup)
        
        var clock = timerGroup.create(game.world.centerX, 75, "atlas.time", "clock")
        clock.anchor.setTo(0.5)
        
        var timeBar = timerGroup.create(clock.centerX - 175, clock.centerY + 19, "atlas.time", "bar")
        timeBar.anchor.setTo(0, 0.5)
        timeBar.scale.setTo(11.5, 0.65)
        timerGroup.timeBar = timeBar
   }
    
    function stopTimer(){
        
        timerGroup.tweenTiempo.stop()
        game.add.tween(timerGroup.timeBar.scale).to({x:11.5}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        timerGroup.tweenTiempo = game.add.tween(timerGroup.timeBar.scale).to({x:0}, time, Phaser.Easing.Linear.Out, true, 100)
        timerGroup.tweenTiempo.onComplete.add(function(){
            stopTimer()
            game.add.tween(timerGroup).to({alpha:0},200,Phaser.Easing.linear,true)
            game.add.tween(boardText).to({alpha:0},200,Phaser.Easing.linear,true, 1700).onComplete.add(function(){
                boardText.text.alpha = 0
            })
            badAction()
        })
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

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
                   if(pointsBar.number > 10 && pointsBar.number % 2 === 0)
                       GAME_TIME > 1000 ? GAME_TIME -= 500 : GAME_TIME = 1000
               })
           })
        })
    }
    
    function createFloor(){
        
        floorGroup = game.add.group()
        floorGroup.enableBody = true
        floorGroup.physicsBodyType = Phaser.Physics.ARCADE
        floorGroup.createMultiple(10, "atlas.aniMarathon", 'floor')
        floorGroup.setAll('anchor.x', 0)
        floorGroup.setAll('anchor.y', 1)
        floorGroup.setAll('checkWorldBounds', true)
        floorGroup.setAll('outOfBoundsKill', true)
        floorGroup.setAll('exists', false)
        floorGroup.setAll('visible', false)
        sceneGroup.add(floorGroup)
        
        for(var i = 0; i < 4; i++){
            
            var floor = floorGroup.getFirstExists(false)
            floor.reset(i * floor.width, game.world.height)
        }
        
        nextStep = "floor"
    }
    
    function createObstacles(){
        
        obstaclesGroup = game.add.group()
        obstaclesGroup.enableBody = true
        obstaclesGroup.physicsBodyType = Phaser.Physics.ARCADE
        obstaclesGroup.setAll('checkWorldBounds', true)
        obstaclesGroup.setAll('outOfBoundsKill', true)
        obstaclesGroup.setAll('exists', false)
        obstaclesGroup.setAll('visible', false)
        sceneGroup.add(obstaclesGroup)
        
        var water = obstaclesGroup.create(game.world.width, game.world.height, "atlas.aniMarathon", "edge")
        water.anchor.setTo(0, 1)
        water.options = [1,2,3]
        
            var obj = game.add.sprite(water.width - 9, 0, "atlas.aniMarathon", "water")
            obj.anchor.setTo(0, 1)
            water.addChild(obj)

            var obj = game.add.sprite(obj.width + water.width - 9, 0, "atlas.aniMarathon", "water")
            obj.anchor.setTo(0, 1)
            water.addChild(obj)

            var edge = game.add.sprite((obj.width * 2) + water.width - 18, 0, "atlas.aniMarathon", "edge")
            edge.anchor.setTo(1, 1)
            edge.scale.setTo(-1, 1)
            water.addChild(edge)
        
        
        var shortLog = obstaclesGroup.create(0, 0, "atlas.aniMarathon", "logTop")
        shortLog.anchor.setTo(0, 1)
        shortLog.options = [0,1,3]
        
        
        var longLog = obstaclesGroup.create(0, 0, "atlas.aniMarathon", "log")
        longLog.anchor.setTo(0, 1)
        longLog.options = [0,1,3]
        
            var logTop = game.add.sprite(-11, -longLog.height, "atlas.aniMarathon", "logTop")
            logTop.anchor.setTo(0, 1)
            longLog.addChild(logTop)
    }
    
    function createBoard(){
        
        boardText = sceneGroup.create(game.world.centerX, 200, "atlas.aniMarathon", "board")
        boardText.alpha = 0
        boardText.anchor.setTo(0.5)

        var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#603813"}
        
        var text = new Phaser.Text(sceneGroup.game, 0, 3, "asdas", fontStyle)
        text.anchor.setTo(0.5)
        text.alpha = 0
        boardText.addChild(text)
        boardText.text = text
    }
    
    function createPlayers(){
        
        oof = game.add.spine(140, game.world.height - 110, "oof")
        oof.setAnimationByName(0, "idle", true)
        oof.setSkinByName("normal")
        sceneGroup.add(oof)
    }
    
    function createButtons(){
        
        buttonsGroup = game.add.group()
        if(localization.getLanguage() === 'EN'){
            buttonsGroup.text = ["Cuernos", "Piernas", "Tentáculos", "Plumas", "Cola", "Alas", "Pico", "Ojo"]
        }
        else{
            buttonsGroup.text = ["Horns", "Legs", "Tentacles", "Feathers", "Tail", "Wings", "Beak", "Eye"]
        }
        sceneGroup.add(buttonsGroup)
        
        var pivotX = 0.3
        
        for(var i = 0; i < 5; i++){
            
            var btn = buttonsGroup.create(game.world.centerX * pivotX, game.world.centerY - 120, "atlas.aniMarathon", "opt"+i)
            btn.anchor.setTo(0.5)
            btn.tag = -1
            btn.text = ""
            btn.alpha = 0
            btn.inputEnabled = true
            btn.events.onInputDown.add(slectAction, this)
            
            pivotX += 0.35
        }
    }
    
    function slectAction(btn){
        
        if(!gameActive && btn.alpha !== 0){
            
            stopTimer()
            sound.play("pop")
            game.add.tween(timerGroup).to({alpha:0},200,Phaser.Easing.linear,true)
            game.add.tween(boardText).to({alpha:0},200,Phaser.Easing.linear,true, 1700).onComplete.add(function(){
                boardText.text.alpha = 0
            })
            
            game.add.tween(btn.scale).to({x:0.6,y:0.6}, 100, Phaser.Easing.linear, true, 0, 0, true).onComplete.add(function(){
                buttonsGroup.forEach(fadeOut, this)
            })
            boardText.text.setText(btn.text)
            game.add.tween(boardText.text).to({alpha:1}, 100, Phaser.Easing.linear, true)
            
            if(obstaclesGroup.children[randObstacle].options.includes(btn.tag)){
                executeAction(btn.tag)
                addCoin(oof)
            }
            else{
                badAction()
            }
        }
    }
    
    function fadeOut(obj){

        game.add.tween(obj).to({alpha: 0}, 200, Phaser.Easing.linear, true, 200)
    }
    
    function executeAction(opt){
       
        var floorTime = 0
        if(randObstacle === 0)
            floorTime = 500
            
        gameActive = true
        obstaclesGroup.children[randObstacle].body.velocity.x = -SPEED
        floorGroup.setAll("body.velocity.x", -SPEED, true, true)
        game.time.events.add(floorTime, moveFloor)
        
        switch(opt){
            case 0: //hit
                oof.setAnimationByName(0, "hit", true)
                game.time.events.add(650, function(){
                    sound.play("punch")
                    game.add.tween(obstaclesGroup.children[randObstacle]).to({angle: 90}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
                        obstaclesGroup.children[randObstacle].angle = 0
                    })
                    game.add.tween(obstaclesGroup.children[randObstacle]).to({x: game.world.width + 150, y:0}, 500, Phaser.Easing.linear, true)
                })
                game.time.events.add(2000, selectObstacle, this, 600)
                oof.addAnimationByName(0, "run", true)
            break
            
            case 1: //jump
                sound.play("whoosh")
                oof.setAnimationByName(0, "run", true)
                game.add.tween(oof).to({y: oof.y - 300}, 1200, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
                    game.add.tween(oof).to({y: oof.y + 300}, 1200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                        oof.setAnimationByName(0, "run", true)
                        selectObstacle(800)
                    })
                })
            break
            
            case 2: //swim
                oof.setAnimationByName(0, "run_fast", true)
                game.add.tween(oof).to({y: oof.y + 100}, 500, Phaser.Easing.Cubic.In, true, 800).onComplete.add(function(){
                    sound.play("robotWhoosh")
                    game.add.tween(oof).to({y: oof.y - 100}, 500, Phaser.Easing.Cubic.Out, true, 600).onComplete.add(function(){
                        oof.setAnimationByName(0, "run", true)
                        selectObstacle(600)
                    })
                })
            break
            
            case 3: //fly
                sound.play("throw")
                oof.setAnimationByName(0, "fly", true)
                game.add.tween(oof).to({y: oof.y - 250}, 400, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                    game.add.tween(oof).to({y: oof.y + 250}, 400, Phaser.Easing.Cubic.Out, true, 1600).onComplete.add(function(){
                        oof.setAnimationByName(0, "run", true)
                        selectObstacle(500)
                    })
                })
            break
        }
    }
    
    function badAction(){
        
        var floorTime = 0
        var delay = 500
        if(randObstacle === 0){
            floorTime = 500
            delay = 1300
        }
        
        gameActive = true
        obstaclesGroup.children[randObstacle].body.velocity.x = -SPEED
        floorGroup.setAll("body.velocity.x", -SPEED, true, true)
        game.time.events.add(floorTime, moveFloor)
        
        game.time.events.add(delay, function(){
            gameActive = false
            obstaclesGroup.children[randObstacle].body.velocity.x = 0
            floorGroup.setAll("body.velocity.x", 0, true, true)
            oof.setAnimationByName(0, "lose", false).onComplete = function(){
                missPoint(obstaclesGroup.children[randObstacle])
                if(lives > 0){
                    gameActive = true
                    obstaclesGroup.children[randObstacle].body.velocity.x = -SPEED
                    floorGroup.setAll("body.velocity.x", -SPEED, true, true)
                    game.time.events.add(floorTime, moveFloor)
                    oof.setAnimationByName(0, "run", true)
                    game.add.tween(oof).from({x: -150}, 1300, Phaser.Easing.linear, true, 1000).onComplete.add(function(){
                        selectObstacle(800)
                    })
                }   
            }
        })
    }
    
    function initGame(){
        
        gameActive = true
        oof.setAnimationByName(0, "run", true)
        floorGroup.setAll("body.velocity.x", -SPEED, true, true)
        moveFloor()
        selectObstacle(1300)
    }
    
    function moveFloor(){
        
        if(gameActive && !gap){
            
            var floor = floorGroup.getFirstExists(false)
                
            if(floor){
                
                floor.reset(game.world.width, game.world.height)
                floor.body.velocity.x = -SPEED
            }

            game.time.events.add(650, moveFloor)
        }
    }
    
    function getRand(opt, limit){
        var x = game.rnd.integerInRange(0, limit)
        if(x === opt)
            return getRand(opt, limit)
        else
            return x     
    }
    
    function selectObstacle(timer){
        
        randObstacle = getRand(randObstacle, 2)
        var aux = game.rnd.integerInRange(0, obstaclesGroup.children[randObstacle].options.length - 1)
        var solution = obstaclesGroup.children[randObstacle].options[aux]
        
        var auxArray = []
        auxArray[0] = solution
        
        for(var i = 1; i < 5; i++){
            auxArray[i] = fillArray(auxArray, buttonsGroup.text.length - 1)
        }  
        Phaser.ArrayUtils.shuffle(auxArray)
        
        for(var i = 0; i < buttonsGroup.length; i++){
            buttonsGroup.children[i].loadTexture("atlas.aniMarathon", "opt" + auxArray[i])
            buttonsGroup.children[i].tag = auxArray[i]
            buttonsGroup.children[i].text = buttonsGroup.text[auxArray[i]]
        }
        
        game.time.events.add(timer,throwObstacle)
    }
    
    function fillArray(array, limit){
        var x = game.rnd.integerInRange(0, limit)
        if(array.includes(x))
            return fillArray(array, limit)
        else
            return x
    }
    
    function throwObstacle(){
        
        if(randObstacle === 0){
            
            gap = true
            obstaclesGroup.children[randObstacle].reset(game.world.width, game.world.height)
            game.time.events.add(2000, function(){
                gap = false
                moveFloor()
            })
        }
        else{
            obstaclesGroup.children[randObstacle].reset(game.world.width, game.world.height - 110)
        }
        
        obstaclesGroup.children[randObstacle].body.velocity.x = -SPEED
        game.time.events.add(1400, stopAll)
    }
    
    function stopAll(slow){
        
        gameActive = false
        obstaclesGroup.children[randObstacle].body.velocity.x = 0
        floorGroup.setAll("body.velocity.x", 0, true, true)
        
        game.add.tween(timerGroup).to({alpha:1},200,Phaser.Easing.linear,true)
        game.add.tween(boardText).to({alpha:1},200,Phaser.Easing.linear,true)
        
        var delay = 200
        for(var i = 0; i < buttonsGroup.length; i++){
            popObject(buttonsGroup.children[i], delay)
            delay += 150
        }
        
        oof.setAnimationByName(0, "asd", true)
        game.time.events.add(delay, startTimer, this, GAME_TIME)
    }
    
    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x:0, y:0},200,Phaser.Easing.linear,true)
        },this)
    }
    
	return {
		
		assets: assets,
		name: "aniMarathon",
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
            gameSong = sound.play("gameSong", {loop:true, volume:0.5})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            createTimer()
            createBoard()
            createFloor()
            createObstacles()
            createPlayers()
            createButtons()
            createCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()