
var soundsPath = "../../shared/minigames/sounds/"
var hackATon = function(){
    
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
                name: "atlas.hackATon",
                json: "images/hackATon/atlas.json",
                image: "images/hackATon/atlas.png",
            }
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
    var gameIndex = 132
    var overlayGroup
    var hackSong
    var coin
    var estrella
    var estrellaCollider
    var actions = ['avoid', 'climb', 'jump', 'squat']
    var obstacles = ['banana', 'stairs', 'sewer', 'post']
    var actionsGroup
    var obstaclesGroup
    var speed
    var speedRise
    var city
    var floor
    var rnd
    var toDo
    var climUp, roll, down, squat
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        speed = 0
        speedRise = 3
        rnd = -1
        toDo = -1
        climUp = 1100
        roll = 400
        down = 300
        squat = 2000
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.hackATon','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.hackATon','life_box')

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
        hackSong.stop()
        		
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
        
        game.load.audio('hackSong', soundsPath + 'songs/classic_arcade.mp3');
        
		game.load.image('howTo',"images/hackATon/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/hackATon/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/hackATon/introscreen.png")
		game.load.image('tile',"images/hackATon/tile.png")
        game.load.image('city',"images/hackATon/city.png")
		game.load.image('floor',"images/hackATon/floor.png")
        game.load.spritesheet("coin", 'images/spines/coin.png', 122, 123, 12)
        
        game.load.spine("estrella", "images/spines/estrella.json")
		
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
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.hackATon','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.hackATon',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.hackATon','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        var background = sceneGroup.create(0, 0, 'atlas.hackATon', 'background')
        background.width = game.world.width
        background.height = game.world.height
        
        var tile = game.add.tileSprite(0, 0, game.world.width, 500, 'tile')
        sceneGroup.add(tile)
        
        city = game.add.tileSprite(game.world.centerX, game.world.height, game.world.width, 1000, 'city')
        city.anchor.setTo(0.5, 1)
        sceneGroup.add(city)
        
        floor = game.add.tileSprite(game.world.centerX, game.world.height, game.world.width, 960, 'floor')
        floor.anchor.setTo(0.5, 1)
        sceneGroup.add(floor)
    }

	function update(){
        
        city.tilePosition.x -= speed * 0.3
        floor.tilePosition.x -= speed
        
        if(gameActive){
            
            if (obstaclesGroup.children[rnd].x > -200){
                    obstaclesGroup.children[rnd].x -= speed 
            }
            else if(obstaclesGroup.children[rnd] !== undefined){
                obstaclesGroup.children[rnd].x = game.world.width
                rnd = getRand()
                estrellaCollider.body.enable = true
                
                if(rnd === 3){
                    sceneGroup.swap(obstaclesGroup, estrella)
                }
            }
        }
        
        game.physics.arcade.overlap(estrellaCollider, obstaclesGroup.children[rnd], estrellaVSobstacle, null, this)
    }
    
    function estrellaVSobstacle(e, o){
        
        estrellaCollider.body.enable = false
        
        if(toDo === rnd){
            hackingStar(toDo)
            addCoin()
            particleCorrect.x = estrella.x
            particleCorrect.y = estrella.y
            particleCorrect.start(true, 1200, null, 6)
        }
        else{
            gameActive = false
            speed = 0
            hackingStar(6)
            missPoint()
            
            game.time.events.add(1200,function(){
                if(lives !== 0)
                    rebor()
            },this)
        }
        
        if(pointsBar.number !== 0 && pointsBar.number % 6 === 0){
            speedRise++
            climUp -= 150
            roll -= 50
            down -= 100
            squat -= 200
        }
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
        particle.makeParticles('atlas.hackATon',key);
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

				particle.makeParticles('atlas.hackATon',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.hackATon','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.hackATon','smoke');
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
	
	function initCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.5)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0

    }

    function addCoin(){
        
        coin.x = estrella.centerX
        coin.y = estrella.centerY
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
    
    function startStar(){
        
        estrella = game.add.spine(100, game.world.centerY + 240, "estrella")
        estrella.setAnimationByName(0, "IDLE", true)
        estrella.setSkinByName("normal")
        sceneGroup.add(estrella)
        
        estrellaCollider = sceneGroup.create(120, estrella.y, "atlas.hackATon", "star")
        estrellaCollider.anchor.setTo(0.5)
        estrellaCollider.scale.setTo(0.5)
        estrellaCollider.alpha = 0
        game.physics.arcade.enable(estrellaCollider)
    }
    
    function starbuttons(){
        
        var piv = -1.5
        
        actionsGroup = game.add.group()
        sceneGroup.add(actionsGroup)
        
        for(var a = 0; a < 4; a++){
            
            var button = game.add.group()
            button.x = game.world.centerX + (piv * 130)
            button.y = game.world.height - 100
            actionsGroup.add(button)
            
            var btnOff = button.create(0, 0, 'atlas.hackATon', actions[a])
            btnOff.anchor.setTo(0.5)
            btnOff.inputEnabled = true
            btnOff.action = a
            btnOff.events.onInputDown.add(btnPressed, this) 
                    
            piv++
        }
    }
    
    function btnPressed(btn){
        
        if(gameActive){
    
            sound.play('pop')
            game.add.tween(btn.parent.scale).to({x:0.5, y:0.5}, 150, Phaser.Easing.linear, true).onComplete.add(function(){
                game.add.tween(btn.parent.scale).to({x: 1, y: 1}, 150, Phaser.Easing.linear, true)
            })
            toDo = btn.action
        }
    }
    
    function hackingStar(opt){
        
        var _ = speedRise 
       
        switch(opt){
            case 0: //avoid
                estrella.setAnimationByName(0, "ROLL", true)
                speed *= 1.5
                 game.add.tween(estrella).to({y: estrella.y - 100}, roll, Phaser.Easing.linear, true).onComplete.add(function(){
                    game.add.tween(estrella).to({y: estrella.y + 100}, down, Phaser.Easing.linear, true)
                    speed = speedRise
                    estrella.addAnimationByName(0, "RUN", true)
                })
            break
            case 1: //climb
                estrella.setAnimationByName(0, "STAIRS", true)
                speed *= 0.6
                game.add.tween(estrella).to({y: estrella.y - 40}, climUp, Phaser.Easing.linear, true).onComplete.add(function(){
                    hackingStar(4)
                    game.add.tween(estrella).to({y: estrella.y + 40}, down, Phaser.Easing.linear, true)
                    speed = speedRise
                })
            break
            case 2: //jump
                estrella.setAnimationByName(0, "JUMP", true)
                speed *= 1.5
                game.time.events.add(roll * 2,function(){
                    speed = speedRise
                    hackingStar(4)
                },this)
            break
            case 3: //squat
                estrella.setAnimationByName(0, "DOWN", true)
                speed *= 0.5
                game.time.events.add(squat,function(){
                    speed = speedRise
                    estrella.addAnimationByName(0, "RUN", true)
                    sceneGroup.swap(obstaclesGroup, estrella)
                },this)
            break
            case 4:
                estrella.setAnimationByName(0, "RUN", true)
            break
            case 5:
                estrella.addAnimationByName(0, "IDLE", true)
            break
            case 6:
                estrella.setAnimationByName(0, "LOSE", false)
                estrella.addAnimationByName(0, "LOSESTILL", true)
                speed = 0
            break
        }
    }
    
    function expedables(){
        
        obstaclesGroup = game.add.group()
        sceneGroup.add(obstaclesGroup)
        
        for(var a = 0; a < 4; a++){
            
            var obstacle = game.add.group()
            obstacle.x = game.world.width
            obstacle.y = game.world.centerY + 220
            obstacle.scale.setTo(1.3)
            obstacle.enableBody = true
            obstacle.physicsBodyType = Phaser.Physics.ARCADE
            obstaclesGroup.add(obstacle)
            
            var obstSign = obstacle.create(0, 0, 'atlas.hackATon', actions[a] + 'Sign')
            obstSign.anchor.setTo(0, 1)
            obstSign.body.enable = false
            obstacle.sign = obstSign
            
            var obstItem = obstacle.create(0, obstSign.y + 50, 'atlas.hackATon', obstacles[a])
            obstItem.anchor.setTo(-0.4, 1)
        }
    }
    
    function rebor(){
        
        speed = 3
        
        game.add.tween(obstaclesGroup.children[rnd]).to({x: -200}, 1600, Phaser.Easing.linear, true).onComplete.add(function(){
            speed = 0
        })
        game.add.tween(estrella).to({x: -200}, 1600, Phaser.Easing.linear, true).onComplete.add(function(){
            hackingStar(4)
            game.add.tween(estrella).to({x: 100}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                hackingStar(5) 
                estrellaCollider.body.enable = true
                initGame()
            })
        })
        
    }
    
    function initGame(){
        
        rnd = getRand()
        
        if(rnd === 3){
            sceneGroup.swap(obstaclesGroup, estrella)
        }
        
        game.time.events.add(1200,function(){
            gameActive = true
            speed = speedRise
            hackingStar(4)
        },this)
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 3)
        if(x === rnd)
            return getRand()
        else
            return x     
    }
	
	return {
		
		assets: assets,
		name: "hackATon",
		update: update,
        preload:preload,
		create: function(event){
            
            game.physics.startSystem(Phaser.Physics.ARCADE)
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            hackSong = game.add.audio('hackSong')
            game.sound.setDecodedCallback(hackSong, function(){
                hackSong.loopFull(0.6)
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
            expedables()
            startStar()
            starbuttons()
            initCoin()
            createParticles()
			
			buttons.getButton(hackSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()