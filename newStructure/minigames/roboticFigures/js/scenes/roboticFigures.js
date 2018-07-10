
var soundsPath = "../../shared/minigames/sounds/"
var roboticFigures = function(){
    
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
                name: "atlas.roboticFigures",
                json: "images/roboticFigures/atlas.json",
                image: "images/roboticFigures/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/roboticFigures/timeAtlas.json",
                image: "images/roboticFigures/timeAtlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/roboticFigures/gametuto.png"
			},
            {
				name:'background',
				file:"images/roboticFigures/background.png"
			},
            {
				name:'shadow',
				file:"images/roboticFigures/shadow.png"
			},
            {
				name:'base',
				file:"images/roboticFigures/base.png"
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
            {	name: "robotWhoosh",
				file: soundsPath + "robotWhoosh.mp3"},
            {	name: "robotLose",
				file: soundsPath + "robotLose.mp3"},
            {	name: "robotWin",
				file: soundsPath + "robotWin.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/upbeat_casual_8.mp3'
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
				name:"robot1",
				file:"images/spines/robots/robot1.json"
			},
            {
				name:"robot2",
				file:"images/spines/robots/robot2.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particleCorrect, particleWrong
    var gameIndex = 192
    var tutoGroup
    var pointsBar
    var heartsGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var circuitsGroup
    var slotsGroup
    var figuresGroup
    var robot
    var rand
    var counter
    var timeAttack
    var gameTime
    var level
    var playTuto = true
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        rand = -1
        counter = 0
        timeAttack = false
        gameTime = 10000
        level = 0
        
        loadSounds()
	}

    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
        },this)
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
    
    function addPoint(number){
        
        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.roboticFigures','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.roboticFigures','life_box')

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
    
    function stopGame(win){
        
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        gameSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
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
        
        playTuto ? initTuto() : initGame()
    }

	function createBackground(){
            
        var background = sceneGroup.create(-5, -5, "background")
        background.width = game.world.width + 10
        background.height = game.world.height + 10
    }

	function update(){
        
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.roboticFigures',key);
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
    
    function positionTimer(){
        
        timerGroup = game.add.group()
        timerGroup.scale.setTo(1.5)
        timerGroup.alpha = 0
        sceneGroup.add(timerGroup)
        
        var clock = game.add.image(0, 0, "atlas.time", "clock")
        clock.scale.setTo(0.7)
        timerGroup.add(clock)
        
        var timeBar = game.add.image(clock.position.x + 40, clock.position.y + 40, "atlas.time", "bar")
        timeBar.scale.setTo(8, 0.45)
        timerGroup.add(timeBar)
        timerGroup.timeBar = timeBar
        
        timerGroup.x = game.world.centerX - clock.width * 0.75
        timerGroup.y = clock.height * 0.3
   }
    
    function stopTimer(){
        
        timerGroup.tweenTiempo.stop()
        game.add.tween(timerGroup.timeBar.scale).to({x:8}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        timerGroup.tweenTiempo = game.add.tween(timerGroup.timeBar.scale).to({x:0}, time, Phaser.Easing.Linear.Out, true, 100)
        timerGroup.tweenTiempo.onComplete.add(function(){
            win(false)
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
        particleCorrect.start(true, 1200, null, 15)

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
                   if(pointsBar.number > 0 && pointsBar.number % 2 == 0){
                       level < 4 ? level += 2 : level = 5
                   }
                   if(pointsBar.number === 15){
                        game.add.tween(timerGroup).to({alpha: 1}, 500, Phaser.Easing.linear, true)
                        timeAttack = true
                   }
                   if(timeAttack && pointsBar.number % 2 == 0){
                        gameTime -= 500
                   }
               })
           })
        })
    }

    function createRobot(){
            
        var base = sceneGroup.create(game.world.centerX, game.world.centerY + 80, "base")
        base.anchor.setTo(0.5, 1)
        base.scale.setTo(1, 0.9)
        
        robot = game.add.group()
        sceneGroup.add(robot)
        
        for(var i = 1; i < 3; i++){
            var bot = game.add.spine(base.centerX, base.y - 30, "robot" + i)
            bot.setAnimationByName(0, "IDLE", true)
            bot.setSkinByName("normal")
            bot.alpha = 0
            robot.add(bot)
        }
        
        robot.bot = robot.children[0]
        game.rnd.integerInRange(0, 1) === 0 ? robot.bot = robot.bot.setSkinByName("normal") : robot.bot.setSkinByName("normal1")
    }
    
    function createMotherboard(){
        
        var shadow = sceneGroup.create(game.world.centerX, game.world.centerY + 90, "shadow")
        shadow.anchor.setTo(0.5, 0)
        shadow.scale.setTo(0.9)
        shadow.width = game.world.width
        
        var mother = sceneGroup.create(shadow.centerX, shadow.centerY, "atlas.roboticFigures", "mother")
        mother.anchor.setTo(0.5)
        
        circuitsGroup = game.add.group()
        sceneGroup.add(circuitsGroup)

        var bulbOn =  sceneGroup.create(mother.centerX + mother.width * 0.45, mother.centerY, "atlas.roboticFigures", "bitOn")
        bulbOn.anchor.setTo(0.5, 1)
        bulbOn.alpha = 0
        circuitsGroup.bulbOn = bulbOn
        
        var bulbOff =  sceneGroup.create(mother.centerX + mother.width * 0.45, mother.centerY, "atlas.roboticFigures", "bitOff")
        bulbOff.anchor.setTo(0.5, 1)
        circuitsGroup.bulbOff = bulbOff
        
        for(var i = 0; i < 6; i++){
            
            var circuit = circuitsGroup.create(mother.centerX, mother.centerY, "atlas.roboticFigures", "circuit" + i)
            circuit.anchor.setTo(0.5)
            circuit.alpha = 0
            circuit.slots = []
        }
        
        circuitsGroup.children[0].slots = [{x:-150, y:0},
                                           {x:0,    y:0},
                                           {x:150,  y:0}]
        
        circuitsGroup.children[1].slots = [{x:-150, y:-50},
                                           {x:-30,  y:-10},
                                           {x:65,   y:40},
                                           {x:150,  y:0}]
        
        circuitsGroup.children[2].slots = [{x:-130, y:-10},
                                           {x:-30,  y:-20},
                                           {x:50,   y:20},
                                           {x:140,  y:-10}]
        
        circuitsGroup.children[3].slots = [{x:-150, y:40},
                                           {x:-60,  y:40},
                                           {x:20,   y:0},
                                           {x:90,   y:-60},
                                           {x:160,  y:20}]
        
        circuitsGroup.children[4].slots = [{x:-150, y:-10},
                                           {x:-75,  y:-60},
                                           {x:0,    y:0},
                                           {x:80,   y:50},
                                           {x:140,  y:-40}]
        
        circuitsGroup.children[5].slots = [{x:-150, y:50},
                                           {x:-50,  y:50},
                                           {x:-80,  y:-60},
                                           {x:70,   y:-60},
                                           {x:60,  y:40},
                                           {x:150,  y:0}]
        
        slotsGroup = game.add.group()
        sceneGroup.add(slotsGroup)
        
        var aux = 0
        
        for(var i = 0; i < 8; i++){
            
            var subGroup =  game.add.group()
            subGroup.x = -50
            subGroup.y = -50
            subGroup.empty = true
            subGroup.tag = aux
            subGroup.alpha = 0
            slotsGroup.add(subGroup)
            
            var slot = subGroup.create(0, 0, "atlas.roboticFigures", "slot" + aux)
            slot.anchor.setTo(0.5)
            subGroup.slot = slot
            
            var fig = subGroup.create(0, 0, "atlas.roboticFigures", "fig" + aux)
            fig.alpha = 0
            fig.anchor.setTo(0.5)
            fig.scale.setTo(0.7)
            subGroup.fig = fig
            
            aux = i - aux
        }
    }
    
    function createButtons(){
        
        var board = sceneGroup.create(game.world.centerX, game.world.height, "atlas.roboticFigures", "board")
        board.anchor.setTo(0.5, 1)
        board.scale.setTo(0.9)
        board.width = game.world.width
        
        figuresGroup = game.add.group()
        sceneGroup.add(figuresGroup)
        
        var pivot = 0.4

        for(var i = 0; i < 4; i++){
            
            var figure = figuresGroup.create(board.centerX * pivot, board.centerY - 10, "atlas.roboticFigures", "fig" + i)
            figure.anchor.setTo(0.5)
            figure.scale.setTo(0)
            figure.spawnX = figure.x
            figure.spawnY = figure.y
            figure.tag = i
            figure.inputEnabled = true
            figure.input.enableDrag()
            figure.events.onDragStop.add(dragStop, this)
            figure.events.onDragStart.add(pickUpFigure, this)
            
            pivot += 0.4
        }        
        figuresGroup.setAll("inputEnabled", false)
    }
    
    function dragStop(btn){
        
        if(playTuto){
            setFigureTuto(btn)
        }
        else{
            setFigure(btn)
        }
    }
    
    function setFigure(fig){
        
        if(gameActive){
            
            var list = []

            for(var i = 0; i < slotsGroup.length; i++){

                if(checkOverlap(fig, slotsGroup.children[i]) && slotsGroup.children[i].empty){
                    list.push(slotsGroup.children[i])
                }        
            }
            
            var chosenOne
            
            if(list.length > 0){
                
                chosenOne = list[0]
            
                if(list.length > 1){
                    
                    for(var i = 1; i < list.length; i++){
                        
                        if(getIntersections(chosenOne, fig).volume < getIntersections(list[i], fig).volume){
                            chosenOne = list[i]
                        }
                    }
                }
                
                if(chosenOne.tag === fig.tag){
                    chosenOne.empty = false
                    chosenOne.fig.alpha = 1
                    counter++
                    if(counter === circuitsGroup.children[rand].slots.length){
                        fig.x = fig.spawnX
                        fig.y = fig.spawnY 
                        win(true)
                        lightUp(false)
                    }
                    else{
                        sound.play("robotWhoosh")
                        lightUp(true)
                        fig.x = fig.spawnX
                        fig.y = fig.spawnY  
                        fig.scale.setTo(1)
                        game.add.tween(fig.scale).from({x:0, y:0}, 200, Phaser.Easing.Cubic.InOut,true)
                    }
                }
                else{
                    //win(false)
                    missPoint(chosenOne)
                    game.add.tween(fig).to({x:fig.spawnX, y:fig.spawnY}, 200, Phaser.Easing.Cubic.InOut,true)
                }
            }
            else{
                game.add.tween(fig).to({x:fig.spawnX, y:fig.spawnY}, 200, Phaser.Easing.Cubic.InOut,true)
            }
            game.add.tween(fig.scale).to({x:1, y:1}, 200, Phaser.Easing.linear, true)
        }
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds()
        var boundsB = spriteB.getBounds()

        return Phaser.Rectangle.intersects(boundsA , boundsB )
    }
    
    function getIntersections(objA, objB){
        
        var boundA = objA.getBounds()
        var boundB = objB.getBounds()
        
        return Phaser.Rectangle.intersection(boundA , boundB )
    }
    
    function win(ans){

        gameActive = false
        figuresGroup.setAll("inputEnabled", false)
        
        figuresGroup.forEach(function(obj){
            obj.x = obj.spawnX
            obj.y = obj.spawnY
            game.add.tween(obj.scale).to({x:0, y:0}, 200, Phaser.Easing.Cubic.InOut,true,250)
        },this)
      
        if(timeAttack){
            stopTimer()
        }
        
        if(ans){
            addCoin(robot)
            sound.play("robotWin")
            robot.bot.setAnimationByName(0, "WIN", true)
        }
        else{
            sound.play("robotLose")
            robot.bot.setAnimationByName(0, "LOSE", true)
            game.time.events.add(700, missPoint, this, robot)
        }
        
        if(lives !== 0){
            game.time.events.add(1200,function(){
                restartAssets()
                game.time.events.add(1200,function(){
                    initGame()
                })
            })
        }
    }
    
    function lightUp(flash){
        
        circuitsGroup.bulbOn.alpha = 1
        circuitsGroup.bulbOff.alpha = 0
        
        if(flash){
            game.time.events.add(200,function(){  
                circuitsGroup.bulbOn.alpha = 0
                circuitsGroup.bulbOff.alpha = 1 
            })
        }
    }
    
    function restartAssets(){
        
        slotsGroup.forEach(fadeOut, this)
        
        figuresGroup.forEach(function(fig){
            fig.x = fig.spawnX
            fig.y = fig.spawnY
        },this)
        
        game.add.tween(circuitsGroup.children[rand]).to({alpha:0}, 400, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
            
            game.add.tween(robot.bot).to({alpha:0}, 500, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
                robot.bot.setAnimationByName(0, "IDLE", true)
                robot.bot = robot.children[0]
                game.rnd.integerInRange(0, 1) === 0 ? robot.bot = robot.bot.setSkinByName("normal") : robot.bot.setSkinByName("normal1")
            })  
        })   
        
        counter = 0
        lightUp(true)
    }
    
    function fadeOut(obj){
        
        game.add.tween(obj).to({alpha:0}, 400, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
            obj.fig.alpha = 0
            obj.x = -50
            obj.y = -50
            obj.empty = true
        })
    }
  
    function initGame(){
        
        for(var i = 0; i < figuresGroup.length; i++){
            sound.play("cut")
            game.add.tween(figuresGroup.children[i].scale).to({x:1, y:1}, 200, Phaser.Easing.Cubic.InOut,true)
        }
        
        assembleMother() 
            
        game.time.events.add(1300,function(){
            gameActive = true
            figuresGroup.setAll("inputEnabled", true)
            if(timeAttack)
                startTimer(gameTime)
        })
    }
    
    function assembleMother(){
        
        level < 5 ? rand = level : rand = getRand()
        
        var circuit = circuitsGroup.children[rand]
        
        var list = []
        for(var i = 0; i < slotsGroup.length; i++)
            list[i] = i
        
        Phaser.ArrayUtils.shuffle(list)
        
        var delay = 200
        
        game.rnd.integerInRange(0, 1) === 0 ? robot.bot = robot.children[0] : robot.bot = robot.children[1]
        game.add.tween(robot.bot).to({alpha:1}, 200, Phaser.Easing.Cubic.InOut,true, 500)
        
        sound.play("cut")
        game.add.tween(circuit).to({alpha:1}, 400, Phaser.Easing.Cubic.InOut,true, 500).onComplete.add(function(){
            
            for(var i = 0; i < circuit.slots.length; i++){
                slotsGroup.children[list[i]].x = circuit.x + circuit.slots[i].x
                slotsGroup.children[list[i]].y = circuit.y + circuit.slots[i].y
                game.add.tween(slotsGroup.children[list[i]]).to({alpha:1}, 400, Phaser.Easing.Cubic.InOut,true, delay)
                delay += 200
            }
        })        
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, level)
        if(x === rand)
            return getRand()
        else
            return x     
    }
    
    //·················· Tutorial ··················//
    
    function initTuto(){
        
        sound.play("cut")
        figuresGroup.forEach(function(obj){
            game.add.tween(obj.scale).to({x:1, y:1}, 200, Phaser.Easing.Cubic.InOut, true)    
        })
        
        game.rnd.integerInRange(0, 1) === 0 ? robot.bot = robot.children[0] : robot.bot = robot.children[1]
        game.add.tween(robot.bot).to({alpha:1}, 300, Phaser.Easing.Cubic.InOut,true, 500)
        
        var circuit = circuitsGroup.children[0]
        
        var list = []
        for(var i = 0; i < slotsGroup.length; i++)
            list[i] = i
        
        Phaser.ArrayUtils.shuffle(list)
        
        var delay = 200
        
        game.add.tween(circuit).to({alpha:1}, 400, Phaser.Easing.Cubic.InOut, true, 500).onComplete.add(function(){
            
            for(var i = 0; i < circuit.slots.length; i++){
                
                slotsGroup.children[list[i]].x = circuit.x + circuit.slots[i].x
                slotsGroup.children[list[i]].y = circuit.y + circuit.slots[i].y
                game.add.tween(slotsGroup.children[list[i]]).to({alpha:1}, 400, Phaser.Easing.Cubic.InOut, true, delay)
                delay += 200
            }
            
            game.time.events.add(delay, posHand, this, list, 0)
        })        
    }
    
    function posHand(list, k){
        
        var fig
        for(var i = 0; i < figuresGroup.length; i++){
            if(slotsGroup.children[list[k]].tag === figuresGroup.children[i].tag){
                fig = figuresGroup.children[i]
                break
            }
        }
        
        hand.x = fig.x 
        hand.y = fig.y
        hand.k = k
        hand.list = list
        hand.alpha = 1
        
        hand.slide = game.add.tween(hand).to({x:slotsGroup.children[list[k]].x, y:slotsGroup.children[list[k]].y}, 1000, Phaser.Easing.linear,true,100)
        hand.slide.repeat(-1)
        
        fig.inputEnabled = true
    }
    
    function setFigureTuto(fig){
        
        if(playTuto){

            var list = []

            for(var i = 0; i < slotsGroup.length; i++){

                if(checkOverlap(fig, slotsGroup.children[i]) && slotsGroup.children[i].empty){
                    list.push(slotsGroup.children[i])
                }        
            }

            var chosenOne

            if(list.length > 0){

                chosenOne = list[0]

                if(list.length > 1){

                    for(var i = 1; i < list.length; i++){

                        if(getIntersections(chosenOne, fig).volume < getIntersections(list[i], fig).volume){
                            chosenOne = list[i]
                        }
                    }
                }

                if(chosenOne == slotsGroup.children[hand.list[hand.k]]){
                    chosenOne.empty = false
                    chosenOne.fig.alpha = 1
                    counter++
                    fig.inputEnabled = false
                    if(counter === circuitsGroup.children[0].slots.length){
                        lightUp(false)
                        completeTuto()
                    }
                    else{
                        sound.play("robotWhoosh")
                        lightUp(true)
                        fig.x = fig.spawnX
                        fig.y = fig.spawnY 
                        fig.scale.setTo(1)
                        game.add.tween(fig.scale).from({x:0, y:0}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
                            hand.slide.stop()
                            posHand(hand.list, hand.k + 1)
                        })
                    }
                }
                else{
                    game.add.tween(fig).to({x:fig.spawnX, y:fig.spawnY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(restartHand, 2)
                }
            }
            else{
                game.add.tween(fig).to({x:fig.spawnX, y:fig.spawnY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(restartHand, 2)
                
            }
            game.add.tween(fig.scale).to({x:1, y:1}, 200, Phaser.Easing.linear, true)
        }
    }
    
    function pickUpFigure(fig){
        
        game.add.tween(fig.scale).to({x:1.2, y:1.2}, 100, Phaser.Easing.linear, true)
        
        if(playTuto){
            hand.slide.repeat(0)
            
        }
        if(gameActive){
            
        }
    }
    
    function restartHand(){
        hand.slide.stop()
        posHand(hand.list, hand.k)
    }
    
    function completeTuto(){
        
        playTuto = false
        figuresGroup.setAll("inputEnabled", false)
        
        figuresGroup.forEach(function(obj){
            obj.x = obj.spawnX
            obj.y = obj.spawnY 
            game.add.tween(obj.scale).to({x:0, y:0}, 200, Phaser.Easing.Cubic.InOut,true,250)
        },this)
      
        hand.destroy()
        sound.play("robotWin")
        robot.bot.setAnimationByName(0, "WIN", true)
       
        game.time.events.add(1200,function(){
            rand = 0
            restartAssets()
            game.time.events.add(1200,function(){
                initGame()
            })
        })
    }
    
	return {
		
		assets: assets,
		name: "roboticFigures",
		//update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
                        
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
            positionTimer()
            createRobot()
            createMotherboard()
            createButtons()
            createCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
		}
	}
}()