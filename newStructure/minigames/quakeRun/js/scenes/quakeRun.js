
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var quakeRun = function(){
    
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
                name: "atlas.quakeRun",
                json: "images/quakeRun/atlas.json",
                image: "images/quakeRun/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/quakeRun/timeAtlas.json",
                image: "images/quakeRun/timeAtlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/quakeRun/tutorial_image_%input.png"
			},
            {
				name:'background',
				file:"images/quakeRun/background.png"
			},
            {
				name:'back',
				file:"images/quakeRun/back.png"
			},
            {
				name:'house',
				file:"images/quakeRun/house.png"
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
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "step",
				file: soundsPath + "step.mp3"},
            {	name: "stoneDoor",
				file: soundsPath + "stoneDoor.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/funny_invaders.mp3'
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
				name:"zombie",
				file:"images/spines/zombie.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 203
    var tutoGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var groundGroup
    var zombieGroup
    var wavesGroup
    var gameTime
    var level
    var counter
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        gameTime = 10000
        level = 3
        counter = 0
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.quakeRun','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.quakeRun','life_box')

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
        
        var background = sceneGroup.create(0, 0, "background")
        background.width = game.world.width
        background.height = game.world.height
        
        var ground = sceneGroup.create(game.world.centerX, game.world.height, "back")
        ground.width = game.world.width * 1.2
        ground.spawnX = ground.x
        ground.anchor.setTo(0.5, 1)
        sceneGroup.mount = ground
        
        var moon = sceneGroup.create(game.world.centerX * 1.5, 150, "atlas.quakeRun", "moon")
        moon.anchor.setTo(0.5)
        
        pivot = 0
        
        for(var i = 0; i < 3; i++){
            
            var cloud = sceneGroup.create(game.world.centerX * pivot, 80 + (50 * i), "atlas.quakeRun", "cloud" + i)
            cloud.anchor.setTo(0, 0.5)
            pivot += 0.5
            
            game.add.tween(cloud).to({x: cloud.x + game.rnd.integerInRange(-50, 200)}, game.rnd.integerInRange(4000, 4500), Phaser.Easing.linear, true, 0, -1, true)
        }
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
        particle.makeParticles('atlas.quakeRun',key);
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

				particle.makeParticles('atlas.quakeRun',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.quakeRun','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.quakeRun','smoke');
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
        //timerGroup.alpha = 0
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
    
    function createGrounds(){
        
        groundGroup = game.add.group()
        sceneGroup.add(groundGroup)
        
        for(var i = 0; i < 3; i++){
            
            var level = groundGroup.create(game.world.centerX, (game.world.height + 35) - (80 * i), "atlas.quakeRun", "ground" + i)
            level.width = game.world.width * 1.1
            level.anchor.setTo(0.5, 1)
            level.spawnX = level.x
        } 
        
        var lastGround = game.add.group()
        lastGround.spawnX = lastGround.x
        groundGroup.add(lastGround)
        groundGroup.lastGround = lastGround
        
        groundGroup.remove(level)
        lastGround.add(level)
        lastGround.level = level
        
        var house = game.add.sprite(lastGround.level.centerX, lastGround.level.centerY - 20, "house")
        house.anchor.setTo(0.5, 1)
        
        var pivotX = 1
        var pivotY = 0.95
        
        for(var i = 0; i < 4; i++){
            
            var room = lastGround.create(house.centerX, house.centerY + 50, "atlas.quakeRun", "room" + i)
            room.anchor.setTo(pivotX, pivotY)
            
            if(i % 2){
                pivotX = 1
            }
            else{
                pivotX = 0
            }
            
            if(i == 1)
                pivotY = 0
        }
        
        createZombies()
        
        lastGround.add(house)
        lastGround.house = house
    }
    
    function createZombies(){
        
        zombieGroup = game.add.group()
        groundGroup.lastGround.add(zombieGroup)
        
        for(var i = 0; i < 10; i++){
            
            var zombie = game.add.spine(-50, 0, "zombie")
            zombie.scale.setTo(0.35)
            zombie.setAnimationByName(0, "idle", true)
            zombie.setSkinByName("normal0")
            zombie.saved = false
            zombie.alpha = 0
            zombieGroup.add(zombie)
        
            var box = game.add.graphics(0, 0)
            box.beginFill(0x00aaff)
            box.drawRect(-125, -360, 250, 320)
            box.alpha = 0
            box.inputEnabled = true
            box.events.onInputDown.add(saveZombie, this)
            zombie.addChild(box)
            zombie.box = box
        }
    }
    
    function createWave(){
        
        wavesGroup = game.add.group()
        wavesGroup.x = game.world.centerX
        wavesGroup.y = game.world.height - 200
        wavesGroup.alpha = 0
        sceneGroup.add(wavesGroup)
        
        var offset = -15
        
        for(var i = 0; i < 4; i++){
            var wave = wavesGroup.create(offset * i, 0, "atlas.quakeRun", "wave" + i)
            wave.anchor.setTo(0.5)
            wave.spawnX = wave.x
            offset += 10
        }
    }
    
    function saveZombie(obj){
        
        if(!gameActive){
            obj.parent.setAnimationByName(0, "lose", false)
            return
        }
        
        if(gameActive && !obj.parent.saved){
               
            var border 
            var fall = 500
            var jump = 70
            var distance 
            obj.parent.saved = true
            obj.scale.setTo(0)
            //addCoin(obj.parent)
            sound.play("rightChoice")

            if(obj.parent.x < game.world.centerX){
                border = groundGroup.lastGround.house.x - groundGroup.lastGround.house.width * 0.35
                obj.parent.scale.setTo(-0.35, 0.35)
                distance = -70
            }
            else{
                border = groundGroup.lastGround.house.x + groundGroup.lastGround.house.width * 0.3
                obj.parent.scale.setTo(0.35)
                distance = 70
            }
                
            obj.parent.setAnimationByName(0, "run", true)
            game.add.tween(obj.parent).to({x: border}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
                obj.parent.setAnimationByName(0, "jump", true)
                game.add.tween(obj.parent).to({x: obj.parent.x + distance * 1.5}, fall * 1.5, Phaser.Easing.Cubic.Out, true)
                sound.play("swipe")
                game.add.tween(obj.parent).to({y: obj.parent.y - jump * 0.7}, fall * 0.5, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
                    game.add.tween(obj.parent).to({y: groundGroup.lastGround.house.y}, fall, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                        sound.play("step")
                        obj.parent.setAnimationByName(0, "run", true)
                        game.add.tween(obj.parent).to({x: obj.parent.x + distance * 1.4}, fall * 0.7, Phaser.Easing.linear, true)
                    })
                })
            })
            
            counter++
            if(counter === level){
                gameActive = false
                if(wavesGroup.upMove){
                    wavesGroup.upMove.stop()
                    wavesGroup.fadeOut.start()
                }
            }
        }
    }
    
    function win(){
            
        gameActive = false
        var ans = true
        
        for(var i = 0; i < level; i++){
            if(!zombieGroup.children[i].saved){
                zombieGroup.children[i].setAnimationByName(0, "lose", false)
                ans = false
            }
        }
        
        if(ans){
            level < 10 ? level++ : level = 10
            if(level > 7){
                gameTime > 3000 ? gameTime -= 1000 : gameTime = 2500
            }
            addCoin(game.world)
        }
        else{
            missPoint(game.world)
        }
        
        if(lives !== 0){
            game.time.events.add(700,function(){
                restarAssetes()
            })
        }
    }
    
    function restarAssetes(){
        
        for(var i = 0; i < zombieGroup.length; i++){
            zombieGroup.children[i].saved = false
            zombieGroup.children[i].x = -50
            zombieGroup.children[i].alpha = 0
            zombieGroup.children[i].box.scale.setTo(1)
        }
        
        counter = 0
        wavesGroup.y = game.world.height - 200
        
        for(var i = 0; i < groundGroup.length; i++){
            if(groundGroup.children[i].shake){
                groundGroup.children[i].shake.stop()
                game.add.tween(groundGroup.children[i]).to({x: groundGroup.children[i].spawnX}, 600, Phaser.Easing.Cubic.InOut, true)
            }
        }
        
        if(sceneGroup.mount.shake){
            sceneGroup.mount.shake.stop()
            game.add.tween(sceneGroup.mount).to({x: sceneGroup.mount.spawnX}, 600, Phaser.Easing.Cubic.InOut, true)
        }
        
        game.time.events.add(700,function(){
            initGame()
        })
    }
    
    function initGame(){
       
        var delay = 200
            
        for(var i = 0; i < level; i++){
            
            popObject(zombieGroup.children[i], delay)
            delay += 200
        }
    
        game.time.events.add(delay - 200,function(){
            startShake()
            gameActive = true
        })
    }
    
    function popObject(obj,delay){
         
        var posY 
        game.rnd.integerInRange(0, 1) === 0 ? posY = game.world.centerY + 160 : posY = game.world.centerY - 40
        
        var posX
        game.rnd.integerInRange(0, 1) === 0 ? posX = game.rnd.integerInRange(-150, -50) : posX = game.rnd.integerInRange(50, 150)
        
        obj.x = posX + game.world.centerX 
        obj.y = posY
        
        obj.setAnimationByName(0, "idle", true)
        obj.setSkinByName("normal" + game.rnd.integerInRange(0, 1))
        
        game.time.events.add(delay,function(){
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x:0, y:0},250,Phaser.Easing.linear,true)
        })
    }
    
    function startShake(){
        
        var laps = [0, 0.5, 0.8]
        wavesGroup.alpha = 1
        
        for(var i = 0; i < wavesGroup.length; i++){
            shakeWave(wavesGroup.children[i], 0)
        }
        
        wavesGroup.fadeOut = game.add.tween(wavesGroup).to({alpha:0}, gameTime * 0.1, Phaser.Easing.linear, false)
        wavesGroup.fadeOut.onComplete.add(stopShake)
        
        wavesGroup.upMove = game.add.tween(wavesGroup).from({y: game.world.height + 60}, gameTime, Phaser.Easing.linear, true)
        wavesGroup.upMove.onComplete.add(function(){
            wavesGroup.fadeOut.start()
        })
        
        for(var i = 0; i < groundGroup.length; i++){
            shakeWave(groundGroup.children[i], laps[i])
        }
        
        shakeWave(sceneGroup.mount, laps[2])
    }
    
    function shakeWave(obj, time){
        
        obj.shakeDelay = game.time.events.add(gameTime * time,function(){
            sound.play("stoneDoor")
            game.add.tween(obj).to({x: obj.x - 20}, game.rnd.integerInRange(150, 300), Phaser.Easing.Cubic.InOut, true).onComplete.add(function(){
                obj.shake = game.add.tween(obj).to({x: obj.x + 40}, game.rnd.integerInRange(150, 300), Phaser.Easing.Cubic.InOut, true, 0, -1, true)
            }) 
        })
    }
    
    function stopShake(){
        
        gameActive = false
        
        for(var i = 0; i < wavesGroup.length; i++){
            wavesGroup.children[i].shake.stop()
            wavesGroup.children[i].x = wavesGroup.children[i].spawnX
        }

        for(var i = 0; i < groundGroup.length; i++){
            if(groundGroup.children[i].shakeDelay){
                game.time.events.remove(groundGroup.children[i].shakeDelay)
            }
            if(groundGroup.children[i].shake){
                groundGroup.children[i].shake.stop()
                game.add.tween(groundGroup.children[i]).to({x: groundGroup.children[i].spawnX}, 600, Phaser.Easing.Cubic.InOut, true)
            }
        }
        
        if(sceneGroup.mount.shakeDelay){
            game.time.events.remove(sceneGroup.mount.shakeDelay)
        }
        if(sceneGroup.mount.shake){
            sceneGroup.mount.shake.stop()
            game.add.tween(sceneGroup.mount).to({x: sceneGroup.mount.spawnX}, 600, Phaser.Easing.Cubic.InOut, true)
        }
        
        win()
    }
	
	return {
		
		assets: assets,
		name: "quakeRun",
		//update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
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
            //positionTimer()
            createGrounds()
            createWave()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()