
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var greetChirp = function(){
    
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
                name: "atlas.greetChirp",
                json: "images/greetChirp/atlas.json",
                image: "images/greetChirp/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/greetChirp/timeAtlas.json",
                image: "images/greetChirp/timeAtlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        images: [
            {
				name:'background',
				file:"images/greetChirp/background.png"
			},
            {
				name:'window',
				file:"images/greetChirp/window.png"
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
                file: soundsPath + 'songs/wormwood.mp3'
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
				name:"theffanie",
				file:"images/spines/theffanie/theffanie.json"
			},
            {
				name:"owl",
				file:"images/spines/birds/owl.json"
			},
            {
				name:"pigeon",
				file:"images/spines/birds/pigeon.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 200
    var tutoGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var window
    var birdsGroup
    var currentBird
    var timePic
    var rand
    var timeAttack
    var gameTime
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        rand = -1
        timeAttack = false
        gameTime = 8000
        
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
        game.add.tween(sceneGroup).to({alpha:1},1000, Phaser.Easing.Cubic.Out,true)

    }
	
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    } 
    
    function addNumberPart(obj,number,isScore){
        
        var pointsText = lookParticle('text')
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y
            pointsText.anchor.setTo(0.5,0.5)
            pointsText.setText(number)
            pointsText.scale.setTo(1,1)

            var offsetY = -100

            pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
            
            deactivateParticle(pointsText,800)
            if(isScore){
                
                pointsText.scale.setTo(0.7,0.7)
                var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
                tweenScale.onComplete.add(function(){
                    game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
                })

                offsetY = 100
            }
            
            game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        }
        
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
            stopGame(false)
        }
        
        addNumberPart(heartsGroup.text,'-1',true)
        
    }
    
    function addPoint(number){
        
        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)		
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.greetChirp','xpcoins')
        pointsImg.anchor.setTo(1,0)
    
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.45
        pointsText.y = pointsImg.height * 0.25
        pointsBar.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
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

        var heartImg = group.create(0,0,'atlas.greetChirp','life_box')

        pivotX+= heartImg.width * 0.45
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = heartImg.height * 0.15
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
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
        
        
        var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
        
        file:"images/greetChirp/tutorial_image_%input.png"
        
		game.load.image('tutorial_image',"images/greetChirp/tutorial_image_" + localization.getLanguage() + "_" + inputName + ".png")
        
        //loadType(gameIndex)
    }
    
    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }
    
    function onClickPlay() {
        tutoGroup.y = -game.world.height
        timePic.tint = 0xFFFFFF
        initGame()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
            
        sceneGroup.create(0, 0, "background").width = game.world.width
        
        var back = sceneGroup.create(0, 100, "background")
        back.width = game.world.width
        
        timePic = sceneGroup.create(game.world.centerX, game.world.centerX + 50, "atlas.greetChirp", "morning")
        timePic.anchor.setTo(0.5)
        timePic.states = ["morning", "afternoon", "evening"]
        timePic.tint = 0x000000
        
        createBirds()
        
        window = sceneGroup.create(game.world.centerX, game.world.centerY + 100, "window")
        window.anchor.setTo(0.5)
        
        //createBirds(timePic)
    }

	function update(){
        
    }
    
	function createTextPart(text,obj){
        
        var pointsText = lookParticle('text')
        
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y - 60
            pointsText.setText(text)
            pointsText.scale.setTo(1,1)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
        
    }
    
    function lookParticle(key){
        
        for(var i = 0;i<particlesGroup.length;i++){
            
            var particle = particlesGroup.children[i]
			//console.log(particle.tag + ' tag,' + particle.used)
            if(!particle.used && particle.tag == key){
                
				particle.used = true
                particle.alpha = 1
                
                particlesGroup.remove(particle)
                particlesUsed.add(particle)
				                
                return particle
                break
            }
        }
    }
    
    function deactivateParticle(obj,delay){
        
        game.time.events.add(delay,function(){
            
            obj.used = false
            particlesUsed.remove(obj)
            particlesGroup.add(obj)
            
        },this)
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.greetChirp',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
        return particle
    }
    
    function createParticles(tag,number){
                
        for(var i = 0; i < number;i++){
            
            var particle
            if(tag == 'text'){
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                var particle = game.add.emitter(0, 0, 100);

				particle.makeParticles('atlas.greetChirp',tag);
				particle.minParticleSpeed.setTo(-200, -50);
				particle.maxParticleSpeed.setTo(200, -100);
				particle.minParticleScale = 0.6;
				particle.maxParticleScale = 1.5;
				particle.gravity = 150;
				particle.angularDrag = 30;
				
				particlesGroup.add(particle)
				
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            //particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
	
	function addParticles(){
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',3)
		createParticles('wrong',1)
		createParticles('text',5)
		createParticles('smoke',1)

	}

	function setExplosion(obj){
        
        var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
        
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xffffff)
        rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        rect.alpha = 0
        rect.endFill()
		sceneGroup.add(rect)
		
		game.add.tween(rect).from({alpha:1},500,"Linear",true)
		
        var exp = sceneGroup.create(0,0,'atlas.greetChirp','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.greetChirp','smoke');
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = posX;
        particlesGood.y = posY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('smoke')
        sceneGroup.add(particleWrong)
    }
    
    function positionTimer(){
        
        timerGroup = game.add.group()
        timerGroup.alpha = 0
        sceneGroup.add(timerGroup)
        
        var clock = timerGroup.create(game.world.centerX, 65, "atlas.time", "clock")
        clock.anchor.setTo(0.5)
        
        var timeBar = timerGroup.create(clock.centerX - 175, clock.centerY + 19, "atlas.time", "bar")
        timeBar.anchor.setTo(0, 0.5)
        timeBar.scale.setTo(11.5, 0.65)
        timerGroup.timeBar = timeBar
   }
    
    function stopTimer(){
        
        timerGroup.tweenTiempo.stop()
        game.add.tween(timerGroup.timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        timerGroup.tweenTiempo = game.add.tween(timerGroup.timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        timerGroup.tweenTiempo.onComplete.add(function(){
            gameActive = false
            stopTimer()
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
        
        coin.x = game.world.centerX
        coin.y = game.world.centerY
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
    
    function createBirds(){
        
        birdsGroup = game.add.group()
        sceneGroup.add(birdsGroup)
        
        var owl = game.add.spine(timePic.centerX - 60, timePic.centerY * 1.6, "owl")
        owl.setAnimationByName(0, "fly", true)
        owl.setSkinByName("normal")
        owl.standX = owl.x
        owl.standY = owl.y
        owl.alpha = 0
        birdsGroup.add(owl)
        birdsGroup.owl = owl
        
        var pigeon = game.add.spine(timePic.centerX - 60, timePic.centerY * 1.57, "pigeon")
        pigeon.setAnimationByName(0, "fly", true)
        pigeon.setSkinByName("normal")
        pigeon.standX = pigeon.x
        pigeon.standY = pigeon.y
        pigeon.alpha = 0
        birdsGroup.add(pigeon)
        birdsGroup.pigeon = pigeon
    }
    
    function createTheffanie(){
        
        theffanie = game.add.spine(timePic.centerX + 120,  game.world.height - 130, "theffanie")
        theffanie.setAnimationByName(0, "idle", true)
        theffanie.setSkinByName("normal")
        theffanie.scale.setTo(-0.9, 0.9)
        sceneGroup.add(theffanie)
    }
    
    function createButtons(){
        
        var fontStyle = {font: "28px VAGRounded", fontWeight: "bold", fill: "#0000FF", align: "center"}
        
        buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        var pivot = 0.6
        
        for(var i = 0; i < 2; i++){
            
            var subGroup = game.add.group()
            subGroup.tag = -1
            buttonsGroup.add(subGroup)
            
            var btnOff = subGroup.create(game.world.centerX * pivot, game.world.height - 80, "atlas.greetChirp", "btnOff")
            btnOff.anchor.setTo(0.5)
            btnOff.inputEnabled = true
            btnOff.events.onInputDown.add(pressDown,this)
            btnOff.events.onInputUp.add(pressUp,this)
            
            var btnOn = subGroup.create(game.world.centerX * pivot, game.world.height - 80, "atlas.greetChirp", "btnOn")
            btnOn.anchor.setTo(0.5)
            btnOn.alpha = 0
            
            var salute = new Phaser.Text(sceneGroup.game, btnOff.x, btnOff.y, '', fontStyle)
            salute.anchor.setTo(0.5)
            salute.stroke = "#eeeeee"
            salute.strokeThickness = 10
            salute.alpha = 0
            subGroup.add(salute)
            subGroup.text = salute
            
            pivot += 0.8
        }
        
        if(localization.getLanguage() === 'EN'){
            buttonsGroup.salutes = ["Buenos días", "Buenas tardes", "Buenas noches"]
        }
        else{
            buttonsGroup.salutes = ["Good morning", "Good afternoon", "Good evening"]
        }
    }
    
    function pressDown(btn){
        
        if(gameActive){
            btn.parent.children[0].alpha = 0
            btn.parent.children[1].alpha = 1
            btn.parent.text.scale.setTo(0.9)
            gameActive = false
            win(btn.parent.tag)
        }
    }
    
    function pressUp(btn){
        
        btn.parent.children[0].alpha = 1
        btn.parent.children[1].alpha = 0
        btn.parent.text.scale.setTo(1)
    }
    
    function win(ans){
        
        if(ans === rand){
            addCoin(game.world)
            theffanie.setAnimationByName(0, "good", true)
            currentBird.setAnimationByName(0, "fly", true)
            
            if(pointsBar.number > 15){
                gameTime > 500 ? gameTime -= 1000 : gameTime = 500
            }
        }
        else{
            missPoint(game.world)
            theffanie.setAnimationByName(0, "lose", true)
            currentBird.setAnimationByName(0, "bad", true)
        }
        
        if(pointsBar.number === 10){
            timeAttack = true
            game.add.tween(timerGroup).to({alpha: 1}, 300, Phaser.Easing.linear, true)
        }
        
        game.time.events.add(500,function(){
            sceneGroup.swap(birdsGroup, window)
        })
        
        game.add.tween(currentBird.scale).to({x: 0.5, y:0.5},1500,Phaser.Easing.linear,true)
        game.add.tween(currentBird).to({x: currentBird.x + 150, y:currentBird.y - 500},1500,Phaser.Easing.linear,true).onComplete.add(function(){
            currentBird.alpha = 0
            currentBird.scale.setTo(1)
            currentBird.x = currentBird.standX
            currentBird.y = currentBird.standY
            for(var i = 0; i < buttonsGroup.length; i++)
                game.add.tween(buttonsGroup.children[i].text).to({alpha:0},300,Phaser.Easing.linear,true)
            
            game.time.events.add(1500,function(){
                if(lives !== 0)
                    initGame()
            })
        })
    }
    
    function initGame(){
        
        rand = getRand()
        animateScene()
        theffanie.setAnimationByName(0, "idle", true)
        timePic.loadTexture("atlas.greetChirp", timePic.states[rand])
        game.time.events.add(800,function(){
            bringTheBird()
            game.time.events.add(2000,function(){
                gameActive = true
                if(timeAttack)
                    startTimer(gameTime)
            })
        })
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 2)
        if(x === rand)
            return getRand()
        else
            return x
    }
    
    function bringTheBird(){
        
        switch(rand){
            case 0:
                currentBird = birdsGroup.pigeon
                theffanie.setAnimationByName(0, "idle_day", true)
            break
            
            case 1:
                currentBird = birdsGroup.pigeon
                theffanie.setAnimationByName(0, "idle", true)
            break
            
            case 2:
                currentBird = birdsGroup.owl 
                theffanie.setAnimationByName(0, "idle_nigth", true)
            break
        }
        
        currentBird.alpha = 1
        currentBird.setAnimationByName(0, "fly", true)
        game.add.tween(currentBird.scale).from({x: 0.5, y:0.5},1500,Phaser.Easing.linear,true)
        game.add.tween(currentBird).from({x: currentBird.x - 50, y:currentBird.y - 500},1500,Phaser.Easing.linear,true).onComplete.add(function(){
            currentBird.setAnimationByName(0, "idle", true)
            sceneGroup.swap(birdsGroup, window)
            
            theffanie.addAnimationByName(0, "idle", true)
            
            var pos = game.rnd.integerInRange(0, 1)
            buttonsGroup.children[pos].text.setText(buttonsGroup.salutes[rand])
            buttonsGroup.children[pos].tag = rand
            var aux = getRand()
            buttonsGroup.children[1 - pos].text.setText(buttonsGroup.salutes[aux])
            buttonsGroup.children[1 - pos].tag = aux
            
            sound.play("cut")
            for(var i = 0; i < buttonsGroup.length; i++){
                buttonsGroup.children[i].text.alpha = 1
                game.add.tween(buttonsGroup.children[i].text.scale).from({x:0},300,Phaser.Easing.linear,true)
            }
        })
    }
	
	return {
		
		assets: assets,
		name: "greetChirp",
		update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
            var wihte = game.add.graphics(0, 0)
            wihte.beginFill(0xFFFFFF)
            wihte.drawRect(0, 0, game.world.width, game.world.height)
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
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
            positionTimer()
            createTheffanie()
            createButtons()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()