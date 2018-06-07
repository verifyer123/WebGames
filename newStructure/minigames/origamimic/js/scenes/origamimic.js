
var soundsPath = "../../shared/minigames/sounds/"

var origamimic = function(){
    
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
                name: "atlas.origamimic",
                json: "images/origamimic/atlas.json",
                image: "images/origamimic/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/origamimic/timeAtlas.json",
                image: "images/origamimic/timeAtlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/origamimic/gametuto.png"
			},
            {
				name:'mountains',
				file:"images/origamimic/mountains.png"
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
            {	name: "energyCharge2",
				file: soundsPath + "energyCharge2.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/asianLoop2.mp3'
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
				name:"tomiko",
				file:"images/spines/tomiko/tomiko.json"
			},
            {
				name:"origami",
				file:"images/spines/origami/origami.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var particleCorrect, particleWrong
    var gameIndex = 212
    var tutoGroup
    var pointsBar
    var heartsGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var tomiko
    var origanim
    var paper
    var pointsGroup
    var linesGroup
    var dotsArray = []
    var pivot
    var LEVEL
    var CORRECT_ORDER
    var timeAttack
    var gameTime
    var tuto
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        pivot = 0
        LEVEL = 3
        CORRECT_ORDER = []
        timeAttack = false
        gameTime = 5000
        tuto = true
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.origamimic','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.origamimic','life_box')

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
        initTuto()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        var background = sceneGroup.create(0, 0, "atlas.origamimic", "background")
        background.width = game.world.width
        background.height = game.world.height
        
        var mountains = sceneGroup.create(0, game.world.height, "mountains")
        mountains.anchor.setTo(0, 1)
        mountains.width = game.world.width
        mountains.height = game.world.height
    }

	function update(){
        
        if(gameActive && click){
            
            pointer.x = game.input.x
			pointer.y = game.input.y
            
            if(dotsArray.length > 0){
                
                var lastObj = dotsArray[pivot - 1]

                linesGroup.line.clear()
                linesGroup.line.lineStyle(10, 0xFF2277, 1)
                linesGroup.line.alpha = 1
                linesGroup.line.moveTo(lastObj.x,lastObj.y)
                linesGroup.line.lineTo(pointer.x,pointer.y)
            }
            
            startChain()
        }
    }
    
    function startChain(){
    
        for(var i = 0; i < pointsGroup.length; i++){
            if(checkOverlap(pointer, pointsGroup.children[i]) && pointsGroup.children[i].active){
                traceChain(pointsGroup.children[i])
            }
        }
    }
    
    function traceChain(dot){
        
        if(!gameActive || !dot.active){
			return
		}
        
        dot.active = false
        
        dotsArray[dotsArray.length] = dot
        
        if(dotsArray.length > 1){
			
			var lastObj = dotsArray[pivot - 1]
        
            var line = linesGroup.children[0]
            line.moveTo(lastObj.x,lastObj.y)
            line.lineTo(dot.x,dot.y)
            line.alpha = 1
            sound.play('cut')
        }
        
        var scaleTween = game.add.tween(dot.scale).to({x:0.5,y:0.5}, 100, Phaser.Easing.linear, true, 0, 0)
		scaleTween.yoyo(true,0).onComplete.add(function(){
            dot.scale.setTo(1)
        })
        
        pivot++
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.origamimic',key);
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
            gameActive = false
            stopTimer()
            checkAnswer()
        })
    }
	
	function initCoin(){
        
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
                   
                    if(pointsBar.number !== 0 && pointsBar.number % 4 === 0)
                        LEVEL < 5 ? LEVEL++ : LEVEL = 5
                   
                    if(pointsBar.number === 13){
                        timeAttack = true
                        game.add.tween(timerGroup).to({alpha: 1}, 300, Phaser.Easing.linear, true)
                    }
                   
                    if(timeAttack && pointsBar.number % 3 === 0){
                        gameTime > 1600 ? gameTime -= 500 : gameTime = 1600
                    }
               })
           })
        })
    }
    
    function createTomiko(){
         
        tomiko = game.add.spine(game.world.centerX - 100, game.world.height - 10, "tomiko")
        tomiko.setAnimationByName(0, "idle", true)
        tomiko.setSkinByName("frog")
        sceneGroup.add(tomiko)
        
        origanim = game.add.spine(game.world.centerX, game.world.centerY - 80, "origami")
        origanim.setAnimationByName(0, "", false)
        origanim.setSkinByName("fox")
        origanim.alpha = 0
        origanim.anims = ["fox", "frog", "swan"]
        sceneGroup.add(origanim)
    }
    
    function createPaper(){
        
        paper = sceneGroup.create(game.world.centerX, game.world.centerY - 80, "atlas.origamimic", "paper")
        paper.anchor.setTo(0.5)
        
        linesGroup = game.add.group()
		sceneGroup.add(linesGroup)
		
		for(var i = 0; i < 2;i++){
			
			var line = game.add.graphics(0,0)
			line.lineStyle(10, 0xFF2277, 1)
			line.beginFill()
			line.moveTo(0,0)
			line.lineTo(-100,-100)
			line.endFill()
			line.alpha = 0
			linesGroup.add(line)
            linesGroup.line = line
		}
        
        pointsGroup = game.add.group()
        sceneGroup.add(pointsGroup)
        
        pointsGroup.dotPos = new Array(5)
        for (var i = 0; i < 5; i++) {
            pointsGroup.dotPos[i] = new Array(5)
        }
        
        var pivotY = paper.y - paper.height * 0.5
        
        for(var i = 0; i < 5; i++){
            
            var pivotX = paper.x - paper.width * 0.5
            
            for(var j = 0; j < 5; j++){
                
                var dot = pointsGroup.create(pivotX, pivotY, "atlas.origamimic", "dot")
                dot.anchor.setTo(0.5)
                dot.active = false
                dot.alpha = 0
                dot.pos = [j,i]
                pointsGroup.dotPos[j][i] = dot
                pivotX += paper.width * 0.25
            }
            pivotY += paper.height * 0.25
        }
        
        pointer = sceneGroup.create(-10, -10, "atlas.origamimic", "sakura")
		pointer.scale.setTo(0.8)
		pointer.anchor.setTo(0.5)
        
        game.input.onDown.add(clickDown,this)
		game.input.onUp.add(clickUp,this)
    }
    
    function clickDown(){
        
        if(gameActive){
            sound.play("cut")
            click = true
        }
    }
    
    function clickUp(){
        
        click = false
        pointer.y = -100
        
        if(gameActive){
            
            if(tuto){
                hand.first.stop()
                hand.second.stop()
                hand.destroy()
                tuto = false
            }

            if(dotsArray && dotsArray.length > 1){
                linesGroup.line.clear()    
                checkAnswer()
                if(timeAttack)
                    stopTimer()
            }
            else{
                pivot = 0
                dotsArray = []
                linesGroup.line.clear()
                for(var i = 0; i < CORRECT_ORDER.length; i++){
                    pointsGroup.dotPos[CORRECT_ORDER[i][0]][CORRECT_ORDER[i][1]].active = true
                }
            }
        }
    }
    
    function checkAnswer(){
        
        gameActive = false
        var ans = true
        
        if(dotsArray.length !== LEVEL){
            ans = false
        }
        else{
            if(dotsArray[0].pos[1] === CORRECT_ORDER[0][1]){
                for(var i = 0; i < dotsArray.length; i++){
                
                    if(dotsArray[i].pos[1] === CORRECT_ORDER[i][1]){
                        if(dotsArray[i].pos[0] !== CORRECT_ORDER[i][0]){
                            ans = false
                            break
                        }
                    }
                    else{
                        ans = false
                        break
                    }
                }
            }
            else if(dotsArray[dotsArray.length - 1].pos[1] === CORRECT_ORDER[0][1]){
                
                for(var i = dotsArray.length - 1; i > -1; i--){
                    if(dotsArray[dotsArray.length - 1 - i].pos[1] === CORRECT_ORDER[i][1]){
                        if(dotsArray[dotsArray.length - 1 - i].pos[0] !== CORRECT_ORDER[i][0]){
                            ans = false
                            break
                        }
                    }
                    else{
                        ans = false
                        break
                    }
                }
            }
            else{
                ans = false
            }
        }
        
        win(ans)
    }
    
    function win(ans){
        
        for(var i = 0; i < pointsGroup.length; i++)
            game.add.tween(pointsGroup.children[i]).to({alpha:0},200,Phaser.Easing.linear,true)
        
        for(var i = 0; i < linesGroup.length; i++){
            var line = linesGroup.children[i]
            line.clear()
            line.lineStyle(10, 0xFF2277, 1)
            line.moveTo(0, 0)
            line.lineTo(-100, -100)
            line.alpha = 0
        }
        
        game.time.events.add(200, function(){
            paper.alpha = 0
            origanim.alpha = 1
            var rand = game.rnd.integerInRange(0, 2)
            origanim.setSkinByName(origanim.anims[rand])
            tomiko.setSkinByName(origanim.anims[rand])
        })
        
        sound.play("energyCharge2")
        if(ans){
            origanim.setAnimationByName(0, "good", false).onComplete = function(){
                addCoin(paper)
                tomiko.setAnimationByName(0, "good", true)
            }
        }
        else{
            origanim.setAnimationByName(0, "lose", false).onComplete = function(){
                missPoint(paper)
                tomiko.setAnimationByName(0, "lose", false)
                tomiko.addAnimationByName(0, "losestill", true)
            }
        }
        
        if(lives !== 0){
            CORRECT_ORDER = []
            dotsArray = []
            pivot = 0
            pointsGroup.setAll("active", false)

            game.time.events.add(5500,function(){
                game.add.tween(origanim).to({alpha:0},400,Phaser.Easing.linear,true).onComplete.add(function(){
                    game.add.tween(paper).to({alpha:1},400,Phaser.Easing.linear,true).onComplete.add(function(){
                        tomiko.setAnimationByName(0, "idle", true)
                        initGame()
                    })
                })
            
            })
           
        }
    }
    
    function initGame(){
    
        var delay = spreadDots()
        game.time.events.add(delay,function(){
            gameActive = true
            if(timeAttack)
                startTimer(gameTime)
        })     
    }
    
    function spreadDots(){
        
        var delay = 250
        var y = game.rnd.integerInRange(0, 5 - LEVEL)
        var x = game.rnd.integerInRange(0, 4)

        for(var i = y; i < y + LEVEL; i++){

            pointsGroup.dotPos[x][i].active = true
            CORRECT_ORDER[CORRECT_ORDER.length] = [x,i]
            
            popObject(pointsGroup.dotPos[x][i], delay)
            delay += 250

            if(x === 0)
                x = game.rnd.integerInRange(0, x + 2)
            else if(x === 4)
                x = game.rnd.integerInRange(x - 2, 4)
            else
                x = game.rnd.integerInRange(x - 1, x + 1)
        }
        
        return delay
    }
    
    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("pop")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x:0, y:0},200,Phaser.Easing.linear,true)
        },this)
    }
    
    function initTuto(){
        
        var delay = spreadDots()
        
        game.time.events.add(delay + 100, function(){
            
            hand.x = pointsGroup.dotPos[CORRECT_ORDER[0][0]][CORRECT_ORDER[0][1]].centerX
            hand.y = pointsGroup.dotPos[CORRECT_ORDER[0][0]][CORRECT_ORDER[0][1]].centerY

            var first = game.add.tween(hand).to({x:pointsGroup.dotPos[CORRECT_ORDER[1][0]][CORRECT_ORDER[1][1]].centerX, y:pointsGroup.dotPos[CORRECT_ORDER[1][0]][CORRECT_ORDER[1][1]].centerY},600,Phaser.Easing.linear,false)

            var second = game.add.tween(hand).to({x:pointsGroup.dotPos[CORRECT_ORDER[2][0]][CORRECT_ORDER[2][1]].centerX, y:pointsGroup.dotPos[CORRECT_ORDER[2][0]][CORRECT_ORDER[2][1]].centerY},600,Phaser.Easing.linear,false)
            second.onComplete.add(function(){
                hand.x = pointsGroup.dotPos[CORRECT_ORDER[0][0]][CORRECT_ORDER[0][1]].centerX
                hand.y = pointsGroup.dotPos[CORRECT_ORDER[0][0]][CORRECT_ORDER[0][1]].centerY
                first.start()
            })

            first.chain(second)
            
            hand.first = first
            hand.second = second
            
            hand.alpha = 1
            game.add.tween(hand.scale).from({x:0, y:0},200,Phaser.Easing.linear,true).onComplete.add(function(){
                first.start()
                gameActive = true
            })
        })
        
    }

	return {
		
		assets: assets,
		name: "origamimic",
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
            createTimer()
            createPaper()
            createTomiko()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()