
var soundsPath = "../../shared/minigames/sounds/"
var pullTheMonster = function(){
    
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
                name: "atlas.pullTheMonster",
                json: "images/pullTheMonster/atlas.json",
                image: "images/pullTheMonster/atlas.png",
            },
        ],
        images: [

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
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 138
    var overlayGroup
    var battleSong
    var coin
    var rope
    var nao, robot
    var meter
    var strengthBar
    var colorsLvl1, colorsLvl21, colorsLvl22
    var lvl, size, moveTime
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        lvl = false
        size = 3
        moveTime = 1500
        
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
    
    function missPoint(){
        
        sound.play("wrong")
		        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.pullTheMonster','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.pullTheMonster','life_box')

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
        battleSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function preload(){
        
		buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('battleSong', soundsPath + 'songs/battleLoop.mp3');
        
		game.load.image('howTo',"images/pullTheMonster/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/pullTheMonster/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/pullTheMonster/introscreen.png")
		game.load.image('background',"images/pullTheMonster/background.png")
        game.load.spritesheet("coin", 'images/spines/coin.png', 122, 123, 12)
        
        game.load.spine("nao", "images/spines/nao/Nao.json")
        game.load.spine("robot", "images/spines/robot/robot.json")
		
		console.log(localization.getLanguage() + ' language')
        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
			sound.play("pop")

            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
                initGame()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.pullTheMonster','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.pullTheMonster',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.pullTheMonster','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }

	function createBackground(){
        
        var background = sceneGroup.create(0, 0, 'background')
        background.width = game.world.width
        background.heigth = game.world.heigth
        
        var naoGround = game.add.tileSprite(game.world.centerX, 0, 155, 340, 'atlas.pullTheMonster', "naoGround")
        naoGround.anchor.setTo(0.5)
        sceneGroup.add(naoGround)
        
        var monsterGround = game.add.tileSprite(game.world.centerX, game.world.height, 210, 150, 'atlas.pullTheMonster', "monsterGround")
        monsterGround.anchor.setTo(0.5, 1)
        sceneGroup.add(monsterGround)
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
        particle.makeParticles('atlas.pullTheMonster',key);
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

				particle.makeParticles('atlas.pullTheMonster',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.pullTheMonster','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.pullTheMonster','smoke');
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
        
        particleWrong = createPart('wrong')
        sceneGroup.add(particleWrong)
    }
    
    function positionTimer(){
        
        timerGroup = game.add.group()
        timerGroup.scale.setTo(1.5)
        //timerGroup.alpha = 0
        sceneGroup.add(timerGroup)
        
        var clock = game.add.image(0, 0, "atlas.time", "clock")
        clock.scale.setTo(0.7)
        clock.alpha = 1
        timerGroup.add(clock)
        
        timeBar = game.add.image(clock.position.x + 40, clock.position.y + 40, "atlas.time", "bar")
        timeBar.scale.setTo(8, 0.45)
        timeBar.alpha = 1
        timerGroup.add(timeBar)
        
        timerGroup.x = game.world.centerX - clock.width * 0.75
        timerGroup.y = clock.height * 0.3
   }
    
    function stopTimer(){
        
        tweenTiempo.stop()
        tweenTiempo = game.add.tween(timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        tweenTiempo = game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        tweenTiempo.onComplete.add(function(){
            stopTimer()
            win(false)
        })
    }
	
	function initCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.8)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0

    }

    function addCoin(){
        
        coin.x = game.world.centerX
        coin.y = game.world.centerY
        time = 300

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
	
    function players(){
            
        nao = game.add.spine(game.world.centerX, 300, "nao")
        nao.setAnimationByName(0, "IDLE", true)
        nao.setSkinByName("normal")
        sceneGroup.add(nao)
        
        rope = sceneGroup.create(game.world.centerX - 20, game.world.centerY + 50, 'atlas.pullTheMonster', "rope")
        rope.anchor.setTo(0.5)
        rope.angle = - 5
        
        robot = game.add.spine(game.world.centerX, game.world.height , "robot")
        robot.setAnimationByName(0, "IDLE", true)
        robot.setSkinByName("normal")
        sceneGroup.add(robot)
    }
    
    function strengthMetter(){
        
        var back = game.add.graphics(game.world.width - 90, 120)
        back.beginFill(0xE34F49)
        back.drawRect(0, 0, 50, 500)
        sceneGroup.add(back)
        
        strengthBar = game.add.sprite(game.world.width, 100, 'atlas.pullTheMonster', 'strengthBar')
        strengthBar.anchor.setTo(1, 0)
        
        meterColors()
        sceneGroup.add(strengthBar)
        
        var strengthBtn = sceneGroup.create(strengthBar.centerX, strengthBar.height + 30, 'atlas.pullTheMonster', 'strengthBtn')
        strengthBtn.anchor.setTo(0.5)
        strengthBtn.pressed = false
        strengthBtn.inputEnabled = true
        strengthBtn.events.onInputDown.add(pressBtn ,this)
        
        meter = sceneGroup.create(strengthBar.centerX, 130, 'atlas.pullTheMonster', 'meter') 
        meter.anchor.setTo(0.5)
    }
    
    function meterColors(){
        
        colorsLvl1 = game.add.group()
        colorsLvl1.x = strengthBar.centerX
        //colorsLvl1.alpha = 0
        sceneGroup.add(colorsLvl1)
        
        for(var c = 0; c < 2; c++){
            var col = colorsLvl1.create(0, strengthBar.centerY - 40, 'atlas.pullTheMonster', 'barColors')
            col.anchor.setTo(0.5, 0)
            col.scale.setTo(1, 3)
        }
        colorsLvl1.children[0].angle = 180
        
        
        colorsLvl21 = game.add.group()
        colorsLvl21.x = strengthBar.centerX
        colorsLvl21.alpha = 0
        sceneGroup.add(colorsLvl21)
        
        for(var c = 0; c < 2; c++){
            var col = colorsLvl21.create(0, strengthBar.centerY - 170, 'atlas.pullTheMonster', 'barColors')
            col.anchor.setTo(0.5, 0)
            col.scale.setTo(1, 1.5)
        }
        colorsLvl21.children[0].angle = 180
        
       
        colorsLvl22 = game.add.group()
        colorsLvl22.x = strengthBar.centerX
        colorsLvl22.alpha = 0
        sceneGroup.add(colorsLvl22)
        
        for(var c = 0; c < 2; c++){
            var col = colorsLvl22.create(0, strengthBar.centerY + 90, 'atlas.pullTheMonster', 'barColors')
            col.anchor.setTo(0.5, 0)
            col.scale.setTo(1, 1.5)
        }
        colorsLvl22.children[0].angle = 180
    }
    
    function pressBtn(btn){
        
        if(!btn.pressed && gameActive){
            btn.pressed = true
            gameActive = false
            meter.swing.stop()
            sound.play('cut')
            if(!lvl){
                getHighLvl1(meter.y)
            }
            else{
                getHighLvl2(meter.y)
            }
            game.add.tween(btn.scale).to({x:0.5, y:0.5}, 100, Phaser.Easing.linear, true).onComplete.add(function() 
            {
                game.add.tween(btn.scale).to({x: 1, y: 1}, 100, Phaser.Easing.linear, true).onComplete.add(function(){
                    btn.pressed = false
                })
            })
        }
    }
    
    function getHighLvl1(strg){
          
        var middlePoint = colorsLvl1.centerY
        gameActive = false
        nao.setAnimationByName(0, "IDLE", true)
        
        if(strg < middlePoint - colorsLvl1.height * 0.2){
            missPoint()
            robot.setAnimationByName(0, "WIN", true)
        }
        else if(strg > middlePoint + colorsLvl1.height * 0.25){
            missPoint()
            robot.setAnimationByName(0, "WIN", true)
        }
        else{
            addCoin()
            robot.setAnimationByName(0, "LOSE", false)
            robot.addAnimationByName(0, "LOSESTILL", true)
        }
        
        if(pointsBar.number >= 12){
            lvl = true
            colorsLvl1.alpha = 0
            colorsLvl21.alpha = 1
            colorsLvl22.alpha = 1
            size = 1.5
        }
        else if(pointsBar.number >= 6){
            reduceSize(colorsLvl1)
        }
        
        game.time.events.add(1500,function(){
            if(lives !== 0){
                robot.setAnimationByName(0, "IDLE", true)
                nao.setAnimationByName(0, "IDLE", true)
                initGame()
            }
        },this)
    }
    
    function getHighLvl2(strg){
        
        var mid1 = colorsLvl21.centerY
        var mid2 = colorsLvl22.centerY
        gameActive = false
        nao.setAnimationByName(0, "IDLE", true)
        
        if(strg < colorsLvl1.centerY){
            if(strg < mid1 - colorsLvl21.height * 0.2){
                missPoint()
                robot.setAnimationByName(0, "WIN", true)
            }
            else if(strg > mid1 + colorsLvl21.height * 0.25){
                missPoint()
                robot.setAnimationByName(0, "WIN", true)
            }
            else{
                addCoin()
                robot.setAnimationByName(0, "LOSE", false)
                robot.addAnimationByName(0, "LOSESTILL", true)
            }
        }
        else{
            if(strg < mid2 - colorsLvl22.height * 0.2){
                missPoint()
                robot.setAnimationByName(0, "WIN", true)
            }
            else if(strg > mid2 + colorsLvl22.height * 0.25){
                missPoint()
                robot.setAnimationByName(0, "WIN", true)
            }
            else{
                addCoin()
                robot.setAnimationByName(0, "LOSE", false)
                robot.addAnimationByName(0, "LOSESTILL", true)
            }
        }
        
        if(pointsBar.number >= 18){
            reduceSize(colorsLvl21)
            reduceSize(colorsLvl22)
        }
        if(pointsBar.number >= 22){
            moveTime -= 200
        }
        
        game.time.events.add(1500,function(){
            if(lives !== 0){
                robot.setAnimationByName(0, "IDLE", true)
                nao.setAnimationByName(0, "IDLE", true)
                initGame()
            }
        },this)
    }
    
    function reduceSize(grp){
        
        if(size >= 1)
            size -= 0.5
        
        for(var s = 0; s < grp.length; s++){
            grp.children[s].scale.setTo(1, size)
        }
    }
    
    function initGame(){
        
        meter.y = 130
        meter.swing = game.add.tween(meter).to({y:strengthBar.height - 40}, moveTime, Phaser.Easing.linear, false, 0, -1)
        meter.swing.yoyo(true, 0)
        
        /*rope.swing = game.add.tween(rope).to({y:rope.y - 40}, 200, Phaser.Easing.linear, false, 0, -1)
        rope.swing.yoyo(true, 0)*/
        
        game.time.events.add(1500,function(){
            nao.setAnimationByName(0, "PULL", true)
            if(!lvl){
                robot.setAnimationByName(0, "PULL1", true)
            }
            else{
                robot.setAnimationByName(0, "PULL2", true)
            }
            gameActive = true
            meter.swing.start()
            
        },this)
    }
    
	return {
		
		assets: assets,
		name: "pullTheMonster",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            battleSong = game.add.audio('battleSong')
            game.sound.setDecodedCallback(battleSong, function(){
                battleSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            players()
            strengthMetter()
            initCoin()
            createParticles()
			
			buttons.getButton(battleSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()