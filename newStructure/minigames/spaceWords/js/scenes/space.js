
var soundsPath = "../../shared/minigames/sounds/"

var space = function(){
    
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
                name: "atlas.space",
                json: "images/space/atlas.json",
                image: "images/space/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/space/timeAtlas.json",
                image: "images/space/timeAtlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/space/tutorial_image.png"
			},
            {   name:"back",
				file: "images/space/back.png"
            },
            {   name:"bubbles",
				file: "images/space/bubbles.png"
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
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/space_music.mp3'
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
            {   name: "splash",
                file: "images/spines/splash.png",
                width: 240,
                height: 190,
                frames: 13
            }
        ],
        spines:[
			{
				name:"eagle",
				file:"images/spines/ship.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
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
    var capsulesGroup
    var eagle
    var splashGroup
    var waves = []
    var timeAttack
    var gameTime
    var answer
    
    var WORDS = [
        ['Alberca',['Pool','Watermelon']],
        ['Mano',['Hand','Man']],
        ['Noticias',['News','Notice']],
        ['Gato',['Cat','Kit']],
        ['Dinero',['Money','Diner']],   
        ['Ratón',['Mouse','Ratchet']],
        ['Horno',['Oven','Horn']],
        ['Árbol',['Tree','Three']],
        ['Casa',['House','Case']],
        ['Pelota',['Ball','Bowl']],
        ['Camioneta',['Truck','Track']],
        ['Brazo',['Arm','Hand']],
        ['Cena',['Dinner','Diner']],
        ['Cuerno',['Horn','Corn']],
        ['Fecha',['Date','Fetch']],   
        ['Silla',['Chair','Sit']],
        ['Cartón',['Cardboard','Cartoon']],
        ['Respuesta',['Answer','Contest']],
        ['Pan',['Bread','Bear']],
        ['Once',['Eleven','Even']],
        ['Flor',['Flower','Flavor']],
        ['Leche',['Milk','Leech']],
        ['Uvas',['Grapes','Grapefruits']],
        ['Cuchara',['Spoon','Spun']],
        ['Carro',['Car','Carr']],
        ['Casa árbol',['Treehouse','Threehouse']],
        ['Ganso',['Goose','Gang']],
        ['Borrego',['Sheep','Ship']],
        ['Lluvia',['Rain','Rein']],
        ['Leche',['Milk','Leech']],
        ['Sandía',['Watermelon','Sandy']],
    ]
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        timeAttack = false
        gameTime = 10000
        
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
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.space','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.space','life_box')

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
            
            game.add.tween(eagle).to({x: game.world.centerX, y:game.world.centerY - 200}, 400, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                eagle.setAnimationByName(0, "lose_parachute", true)
                game.add.tween(eagle).to({y:game.world.height - 100}, 4000, Phaser.Easing.Cubic.in, true).onComplete.add(function(){
                    eagle.addAnimationByName(0, "lose", true)
                    stopGame()
                })
            })
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

	function createBackground(){
        
        var background = sceneGroup.create(-2, -2, "back")
        background.width = game.world.width + 2
        background.height = game.world.height + 2
        
        var pink = game.add.tileSprite(0, game.world.height, game.world.width, 250, "bubbles")
        pink.anchor.setTo(0, 1)
        pink.rise = 1.2
        sceneGroup.add(pink)
        pink.wave = game.add.tween(pink.scale).to( {y:1.2}, 5000, Phaser.Easing.Sinusoidal.InOut, true, 0,-1, true)
        waves.push(pink)
    }

	function update(){
        
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.space',key);
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
            win(null, null, false)
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
                   if(pointsBar.number > 1){
                       game.add.tween(timerGroup).to({alpha: 1}, 500, Phaser.Easing.linear, true)
                       timeAttack = true
                   }
                   
                   if(timeAttack && pointsBar.number % 2){
                           gameTime > 500 ? gameTime -= 500 : gameTime = 500
                           waves.forEach(function(obj){
                               obj.wave.stop()
                               obj.wave = game.add.tween(obj.scale).to( {y:obj.rise}, gameTime * 0.5, Phaser.Easing.Sinusoidal.InOut, false, 0, -1, true)
                               game.add.tween(obj.scale).to( {y:1}, 300, Phaser.Easing.linear, true).chain(obj.wave)
                           })
                    }
               })
           })
        })
    }
    
    function createQuestionBoard(){
        
        boardGroup = game.add.group()
        boardGroup.rand = -1
        sceneGroup.add(boardGroup)
        
        var board = boardGroup.create(game.world.centerX, 220, "atlas.space", "display")
        board.anchor.setTo(0.5)
        board.scale.setTo(0)
        boardGroup.board = board
        
        var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var text = new Phaser.Text(sceneGroup.game, board.x, board.y + 10, "", fontStyle)
        text.anchor.setTo(0.5)
        text.stroke = "#00aa55"
        text.strokeThickness = 10
        text.alpha = 0
        boardGroup.add(text)
        boardGroup.text = text
    }
    
    function createCapsules(){
        
        capsulesGroup = game.add.group()
        sceneGroup.add(capsulesGroup)
        
        var pivot = 0.6
        
        for(var i = 0; i < 2; i++){
            
            var capsule = game.add.group()
            capsule.x = game.world.centerX * pivot
            capsule.y = game.world.height - 120
            capsule.alpha = 0
            capsulesGroup.add(capsule)
            
            var supGroup = game.add.group()
            capsule.add(supGroup)
            capsule.cards = supGroup
            
            for(var j = 0; j < 3; j++){
                
                var card = supGroup.create(0, 0, "atlas.space", "card" + j)
                card.anchor.setTo(0.5)
                
                if(j == 0){
                    card.inputEnabled = true
                    card.events.onInputUp.add(pressBtn, this)
                }
            }
            
            var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
            var text = new Phaser.Text(sceneGroup.game, card.x, card.y + 5, "Threehouse", fontStyle)
            text.anchor.setTo(0.5)
            capsule.add(text)
            capsule.text = text
        
            pivot += 0.8
        }
        
        var pinkFront = game.add.tileSprite(0, game.world.height, game.world.width, 100, "atlas.space", "bubblesFront")
        pinkFront.anchor.setTo(0, 1)
        pinkFront.rise = 0.8
        sceneGroup.add(pinkFront)
        
        pinkFront.wave = game.add.tween(pinkFront.scale).to( {y:0.8}, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0,-1, true)
        waves.push(pinkFront)
    }
    
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    } 
    
    function createEagle(){
        
        eagle = game.add.spine(180, 320, "eagle")
        eagle.initX = eagle.x
        eagle.initY = eagle.y
        eagle.scale.setTo(2.5)
        eagle.setAnimationByName(0, "idle", true)
        eagle.setSkinByName('ship')
        sceneGroup.add(eagle)
    }
    
    function createSplash(){
        
        splashGroup = game.add.group()
        sceneGroup.add(splashGroup)
        
        for(var i = 0; i < 2; i++){
            var object = game.add.sprite(capsulesGroup.children[i].x, capsulesGroup.children[i].y, 'splash')
            object.anchor.setTo(0.5)
            object.animations.add('walk')
            object.animations.play('walk', 24, false)
            object.alpha = 0
            splashGroup.add(object)
        }    
    }
    
    function pressBtn(card){
        
        if(gameActive){
            
            var cap = card.parent.parent
            
            gameActive = false
            game.add.tween(card.scale).to({x:1.3, y:1.3}, 100, Phaser.Easing.linear, true, 0, 0, true)
            if(timeAttack)
                stopTimer()
            
            var ans = cap.text.text == answer ? true : false
            eagle.landing.stop(true)
            game.add.tween(eagle).to({x:cap.x + 50, y: cap.y - 100}, 1000, Phaser.Easing.Cubic.InOut, true).onComplete.add(win,this,null,ans)
        }
    }
    
    function win(h,y, ans){
        
        var x
        for(var i = 0; i < capsulesGroup.length; i++){
            
            var cap = capsulesGroup.children[i]
            if(cap.text.text == answer){
                changeImage(1, cap.cards)
            }
            else{
                changeImage(2, cap.cards)
                x = capsulesGroup.getIndex(cap)
            }
        }
        
        if(ans){
            addCoin(eagle)
            eagle.setAnimationByName(0, "win", true)
        }
        else{
            missPoint(eagle)
            splashPink(splashGroup.children[x], 0)
            eagle.setAnimationByName(0, "hit", true)
            eagle.addAnimationByName(0, "idle", true)
        }
       
        game.time.events.add(2000, restartLvl)
    }
    
    function restartLvl(){
        
        if(lives > 0){
            game.add.tween(eagle).to({x: eagle.initX, y:eagle.initY}, 500, Phaser.Easing.Cubic.InOut, true)
            game.time.events.add(1000, initGame)
        }
        capsulesGroup.forEach(function(cap){
            game.add.tween(cap).to({alpha: 0}, 800, Phaser.Easing.Cubic.InOut, true)
        })
        game.add.tween(boardGroup.text).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true)
    }
    
    function initGame(){
        
        throwCapsule()
        eagle.addAnimationByName(0, "idle", true)
    }
    
    function throwCapsule(){
        
        var side = [1, -1]
        var question = selectText()
        answer = question[1][0]
        var options = [0,1]
        Phaser.ArrayUtils.shuffle(options)
        var delay = 1000
        
        boardGroup.text.setText(question[0])
        var pop = game.add.tween(boardGroup.board.scale).to({x:1.3, y:1.3}, 500, Phaser.Easing.Elastic.InOut, true, delay)
        pop.chain(game.add.tween(boardGroup.text).to({alpha:1}, 300, Phaser.Easing.Cubic.In, false))
        pop.onComplete.add(startLanding)
        
        for(var i = 0; i < capsulesGroup.length; i++){
            
            var cap = capsulesGroup.children[i]
            var ang = game.rnd.integerInRange(25, 65) * 10 * side[game.rnd.integerInRange(0, 1)]
            var alt = game.rnd.integerInRange(10, 60) * 10
            
            cap.text.setText(question[1][options[i]])
            cap.alpha = 1
            changeImage(0, cap.cards)
            game.add.tween(cap).from({y:alt}, delay, Phaser.Easing.Cubic.In, true)
            game.add.tween(cap).from({x: (game.world.width * i) - (110 * side[i]), angle:ang}, delay, Phaser.Easing.linear, true)
            game.add.tween(cap.text).to({alpha:1}, 300, Phaser.Easing.Cubic.In, true, delay + 500)
            
            splashPink(splashGroup.children[i], 1000)
        }
        
        console.log(answer)
    }
    
    function selectText(){
        
        do{
            var aux = game.rnd.integerInRange(0, WORDS.length -1)
        }while(aux == boardGroup.rand)
        
        boardGroup.rand = aux
        
        return WORDS[boardGroup.rand]
    }
    
    function splashPink(splash, delay){
        
        game.time.events.add(delay, function(){
            
            splash.alpha = 1
            splash.animations.play('walk', 48, false)
            game.add.tween(splash.scale).from({x:0.01,y:0.01},200,Phaser.Easing.Cubic.Out,true)
            
            game.add.tween(splash).to({alpha:0},300,Phaser.Easing.linear,true,300)
        })
    }
    
    function startLanding(){
        
        gameActive = true
        
        if(timeAttack)
            startTimer(gameTime)

        eagle.hover = game.add.tween(eagle).to({x: game.world.width - 70}, 1000, Phaser.Easing.Sinusoidal.InOut, true, 500, -1, true)
      
        eagle.landing = game.add.tween(eagle).to({y: game.world.height - 210}, gameTime, Phaser.Easing.linear, true, 500)
        eagle.landing.onComplete.add(function(){
            eagle.hover.stop()
        })
    }

	return {
		
		assets: assets,
		name: "space",
		//update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
            var back = game.add.graphics(0, 0)
            back.beginFill(0xFFFFFF)
            back.drawRect(0, 0, game.world.width, game.world.height)
            back.endFill()
            
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
            createTimer()
            createQuestionBoard()
            createEagle()
            createCapsules()
            createSplash()
            createCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()