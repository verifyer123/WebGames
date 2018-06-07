
var soundsPath = "../../shared/minigames/sounds/"

var circuitch = function(){
    
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
                name: "atlas.circuitch",
                json: "images/circuitch/atlas.json",
                image: "images/circuitch/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/circuitch/timeAtlas.json",
                image: "images/circuitch/timeAtlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/circuitch/gametuto.png"
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
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/funky_monkey.mp3'
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
				name:"razzle",
				file:"images/spines/razzle/razzle.json"
			},
            {
				name:"computer",
				file:"images/spines/computer/computer.json"
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
    var boardGroup
    var computers = []
    var razzle
    var LEVEL  
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        LEVEL = 3
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.circuitch','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.circuitch','life_box')

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
        
        //tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.puzzoole", "tile")
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.circuitch", "tile"))
    }

	function update(){
        
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.circuitch',key);
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
        //timerGroup.alpha = 0
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
            gameActive = false
            stopTimer()
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
               })
           })
        })
    }
    
    function createBoard(){
        
        boardGroup = game.add.group()
        sceneGroup.add(boardGroup)
        
        boardGroup.matrix = new Array(6)
        for (var i = 0; i < 6; i++) {
            boardGroup.matrix[i] = new Array(6)
        }
        
        var pivotY = 0.3
        
        for(var i = 0; i < 6; i++){
            
            var subGroup = game.add.group()
            boardGroup.add(subGroup)
            
            var pivotX = 0.25
            
            for(var j = 0; j < 6; j++){
                
                var square = subGroup.create(game.world.centerX * pivotX, game.world.centerY * pivotY, "atlas.circuitch", "slot")
                square.anchor.setTo(0.5)
                square.scale.setTo(0.9)
                
                boardGroup.matrix[j][i] = square
                boardGroup.matrix[j][i].empty = true
                
                pivotX += 0.3
            }
            pivotY += 0.2
        }
        
        var base = sceneGroup.create(game.world.centerX, square.y + 49, "atlas.circuitch", "base")
        base.anchor.setTo(0.5, 0)
        base.scale.setTo(16.1, 2)
    }
    
    function createRazzle(){
        //RUN_LEFT&RIGTH     RUN_BACK   RUN_FRONT
        razzle = game.add.spine(boardGroup.matrix[2][2].x, boardGroup.matrix[2][2].y +30, "razzle")
        razzle.setAnimationByName(0, "IDLE", true)
        razzle.setSkinByName("razzle")
        razzle.canMove = true
        razzle.pos = [2,2]
        boardGroup.children[2].add(razzle)
        
        for(var i = 0; i < 36; i++){
            
            var computer = game.add.spine(0, 0, "computer")
            computer.setAnimationByName(0, "IDLE", true)
            computer.setSkinByName("computer")
            computers[i] = computer
        }
    }
    
    function createButtons(){
        
        var btnBoard = sceneGroup.create(game.world.centerX, game.world.height, "atlas.circuitch", "btnBoard")
        btnBoard.anchor.setTo(0.5, 1)
        
        var btnGroup = game.add.group()
        sceneGroup.add(btnGroup)
        
        var pivotX = 0.65
        var pivotY = - 60
        
        for(var i = 0; i < 4; i++){
            
            var btn = btnGroup.create(btnBoard.centerX * pivotX, btnBoard.centerY - 23, "atlas.circuitch", "btn"+i)
            btn.inputEnabled = true
            btn.events.onInputDown.add(pressBtn, this)
            btn.anchor.setTo(0.5)
            btn.dir = i
            
            if(i < 2)
                pivotX += 0.35
            
            if(i === 1 || i === 3){
                btn.y += pivotY
                pivotY *= -1
            }
        }
        
        btn.x = btnBoard.centerX
    }
    
    function pressBtn(btn){
        
        if(gameActive && razzle.canMove){
            
            sound.play("pop")
            razzle.canMove = false
            game.add.tween(btn.scale).to({x:0.6,y:0.6}, 100, Phaser.Easing.linear, true, 0, 0, true)
            moveRazzle(btn.dir)
        }
    }
    
    function moveRazzle(dir){
        
        if(gameActive && !razzle.canMove){
            
            var x = razzle.pos[0]
            var y = razzle.pos[1]
            var room = false

            switch(dir){
                case 0: //left
                    
                    if(x > 0){
                        if(boardGroup.matrix[x-1][y].empty){
                            room = true
                            x--
                            razzle.scale.setTo(-1,1)
                            razzle.setAnimationByName(0, "RUN_LEFT&RIGTH", true)
                        }
                        else if(x-1 > 0 && boardGroup.matrix[x-2][y].empty){
                            room = true
                            x--
                            razzle.scale.setTo(-1,1)
                            razzle.setAnimationByName(0, "RUN_LEFT&RIGTH", true)
                            movePc(boardGroup.matrix[x][y].children[0], boardGroup.matrix[x-1][y])
                        }
                    }
                break
                
                case 1: //up
                
                    if(y > 0){
                        if(boardGroup.matrix[x][y-1].empty){
                            room = true
                            y--
                            razzle.setAnimationByName(0, "RUN_BACK", true)
                            game.time.events.add(500, function(){
                                boardGroup.children[y].add(razzle)
                            })
                        }
                        else if(y-1 > 0 && boardGroup.matrix[x][y-2].empty){
                            room = true
                            y--
                            razzle.setAnimationByName(0, "RUN_BACK", true)
                            movePc(boardGroup.matrix[x][y].children[0], boardGroup.matrix[x][y-1])
                            game.time.events.add(500, function(){
                                boardGroup.children[y].add(razzle)
                            })
                        }
                    }
                break
                
                case 2: //rigth
                            
                    if(x < 5){
                        if(boardGroup.matrix[x+1][y].empty){
                            room = true
                            x++
                            razzle.scale.setTo(1)
                            razzle.setAnimationByName(0, "RUN_LEFT&RIGTH", true)
                        }
                        else if(x+1 < 5 && boardGroup.matrix[x+2][y].empty){
                            room = true
                            x++
                            razzle.scale.setTo(1)
                            razzle.setAnimationByName(0, "RUN_LEFT&RIGTH", true)
                            movePc(boardGroup.matrix[x][y].children[0], boardGroup.matrix[x+1][y])
                        }
                    }
                break
                
                case 3: //down
                    
                    if(y < 5){
                        if(boardGroup.matrix[x][y+1].empty){
                            room = true
                            y++
                            boardGroup.children[y].add(razzle)
                            razzle.setAnimationByName(0, "RUN_FRONT", true)
                        }
                        else if(y+1 < 5 && boardGroup.matrix[x][y+2].empty){
                            room = true
                            y++
                            boardGroup.children[y].add(razzle)
                            razzle.setAnimationByName(0, "RUN_FRONT", true)
                            movePc(boardGroup.matrix[x][y].children[0], boardGroup.matrix[x][y+1], boardGroup.matrix[x][y+1].parent)
                        }
                    }
                break
            }
            
            if(room){
                game.add.tween(razzle).to({x:boardGroup.matrix[x][y].x, y:boardGroup.matrix[x][y].y + 30}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
                    razzle.pos[0] = x
                    razzle.pos[1] = y
                    razzle.canMove = true
                    razzle.setAnimationByName(0, "IDLE", true)
                })
            }
            else{
                game.time.events.add(500, function(){
                    razzle.canMove = true
                })
            }
        }
    }
    
    function movePc(pc, slot, downLine){
        
        var pos = pc.worldPosition
        var row = downLine || pc.parent.parent
        
        pc.parent.empty = true
        pc.parent.removeChild(pc)
        
        row.add(pc)
        pc.x = pos.x
        pc.y = pos.y
        game.add.tween(pc).to({x:slot.x, y:slot.y + 40}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
            pc.x = 0
            pc.y = 40
            slot.empty = false
            slot.addChild(pc)
        })
    }
    
    function initGame(){
        
        gameActive = true
        placePc()
    }
    
    function placePc(){
        
        for(var i = 0; i < LEVEL; i++){
            
            var slot = getRand()
            slot.empty = false
            computers[i].setAnimationByName(0, "IDLE", true)
            computers[i].y = 40
            slot.addChild(computers[i])
            game.add.tween(computers[i].scale).from({x:0,y:0}, 200, Phaser.Easing.linear, true)
        }
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(1, 4)
        var y = game.rnd.integerInRange(1, 4)
        
        if(!boardGroup.matrix[x][y].empty || (x === razzle.pos[0] && y === razzle.pos[1]))
            return getRand()
        else
            return boardGroup.matrix[x][y]    
    }
	
	return {
		
		assets: assets,
		name: "circuitch",
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
            //createTimer()
            createBoard()
            createRazzle()
            createButtons()
            createCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()