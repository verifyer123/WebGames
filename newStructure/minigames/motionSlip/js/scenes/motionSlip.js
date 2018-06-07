
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var motionSlip = function(){
    
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
                name: "atlas.motionSlip",
                json: "images/motionSlip/atlas.json",
                image: "images/motionSlip/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/motionSlip/timeAtlas.json",
                image: "images/motionSlip/timeAtlas.png",
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
				file:"images/motionSlip/gametuto.png"
			}
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "water_splash",
				file: soundsPath + "water_splash.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
            {	name: "punch1",
				file: soundsPath + "punch1.mp3"},
            {	name: "step",
				file: soundsPath + "step.mp3"},
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
				name:"oona",
				file:"images/spines/oona.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 187
    var tutoGroup
    var gameSong
    var coin
    var hand
    var tiles = []
    var oona
    var obstaclesGroup
    var speed
    var speedChange
    var rand
    var delays
    var highlight
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        speed = 0
        speedChange = 1
        rand = -1
        delays = [{in: 1000, out: 1000},
                  {in: 2200},
                  {in: 350, out: 350},]
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.motionSlip','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.motionSlip','life_box')

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
        
        var back = game.add.graphics(0, 0)
        back.beginFill(0xBDFFD3)
        back.drawRect(0, 0, game.world.width, game.world.height)
        sceneGroup.add(back)
        
        var mount = sceneGroup.create(game.world.centerX, 20, "atlas.motionSlip", "mountain")
        mount.anchor.setTo(0.5, 0)
        
        var forest = game.add.tileSprite(game.world.centerX, game.world.centerY - 50, game.world.width, 200, "atlas.motionSlip", "forest")
        forest.anchor.setTo(0.5, 1)
        sceneGroup.add(forest)
        tiles[0] = forest
        
        var trees = game.add.tileSprite(game.world.centerX, forest.y - 100, game.world.width, 300, "atlas.motionSlip", "trees")
        trees.anchor.setTo(0.5, 0)
        sceneGroup.add(trees)
        tiles[1] = trees
        
        var grass = game.add.tileSprite(game.world.centerX, game.world.height - 150, game.world.width, 250, "atlas.motionSlip", "grass")
        grass.anchor.setTo(0.5, 1)
        sceneGroup.add(grass)
        tiles[2] = grass
    }

	function update(){
        
            
        for(var i = 0; i < tiles.length; i++){
            tiles[i].tilePosition.x -= speed * (i + 0.5)
        }
        
        if(gameActive){
            game.physics.arcade.overlap(oona.collider, obstaclesGroup, oonaVSobstacle, null, this)
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
        particle.makeParticles('atlas.motionSlip',key);
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

				particle.makeParticles('atlas.motionSlip',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.motionSlip','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.motionSlip','smoke');
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
        timerGroup.scale.setTo(1.5)
        //timerGroup.alpha = 0
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

    function addCoin(){
        
        coin.x = oona.x
        coin.y = oona.y
        var time = 300

        sound.play("rightChoice")
        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function createOona(){
        
        oona = game.add.spine(120, game.world.centerY + 150, "oona")
        oona.setAnimationByName(0, "idle", true)
        oona.setSkinByName("normal")
        oona.opt = 2
        sceneGroup.add(oona)
        
        var collider = sceneGroup.create(oona.x + 20, oona.y - 10, "atlas.motionSlip", "star")
        collider.anchor.setTo(0.5)
        collider.scale.setTo(0.5)
        collider.alpha = 0
        game.physics.arcade.enable(collider)
        
        oona.collider = collider
        
        var tunel = sceneGroup.create(game.world.width, game.world.centerY + 170, 'atlas.motionSlip', "frontTunel")
        tunel.anchor.setTo(0, 1)
        tunel.exists = false
        tunel.visible = false
        tunel.checkWorldBounds = true
        tunel.events.onOutOfBounds.add(function(){ this.kill })
        game.physics.arcade.enable(tunel)
        oona.tunel = tunel
    }
    
    function createButtons(){
        
        var board = sceneGroup.create(0, game.world.height, "atlas.motionSlip", "board")
        board.anchor.setTo(0, 1)
        board.width = game.world.width
        
        var actions = ["climb", "crawl", "jump"]
        var pivot = 0.5
        
        for(var i = 0; i < 3; i++){
            
            subGroup = game.add.group()
            sceneGroup.add(subGroup)
            
            var btn = subGroup.create(board.centerX * pivot, board.centerY - 15, "atlas.motionSlip", actions[i] + "Off")
            btn.anchor.setTo(0.5)
            btn.inputEnabled = true
            btn.events.onInputDown.add(btnDown, this)
            btn.events.onInputUp.add(btnUp, this)
            btn.opt = i
            
            var btnOn = subGroup.create(board.centerX * pivot, board.centerY - 15, "atlas.motionSlip", actions[i] + "On")
            btnOn.anchor.setTo(0.5)
            btnOn.alpha = 0
            
            pivot += 0.5
        }
        
        highlight = sceneGroup.create(btn.x, btn.y, "atlas.motionSlip", "highlight")
        highlight.anchor.setTo(0.5)
        highlight.scale.setTo(2)
    }
    
    function btnDown(btn){
        
        if(gameActive){
            sound.play("pop")
            changeImage(1, btn.parent)  
            oona.opt = btn.opt
            highlight.x = btn.x
            highlight.y = btn.y
        }
    }
    
    function btnUp(btn){
        
        changeImage(0, btn.parent)
    }
    
    function createObstacles(){
        
        obstaclesGroup = game.add.group()
        obstaclesGroup.enableBody = true
        obstaclesGroup.physicsBodyType = Phaser.Physics.ARCADE
        sceneGroup.add(obstaclesGroup)
        
        var obtacleName = ["wall", "tunel", "gap"] 
        obstaclesGroup.obtacleName = obtacleName
        
        for(var i = 0; i < 3; i++){
    
            var obj = obstaclesGroup.create(game.world.width, game.world.centerY + 170, 'atlas.motionSlip', obtacleName[i])
            obj.anchor.setTo(0, 1)
            obj.exists = false
            obj.visible = false
            obj.checkWorldBounds = true
            obj.events.onOutOfBounds.add(resetObj, this)
            obj.col = true
        }
        obj.y += 161
    }
    
    function resetObj(obj){
        
        obj.kill()
        if(gameActive){
            trowObstacle()
        }
    }
    
    function trowObstacle(){
        
        var obst = obstaclesGroup.getFirstExists(false)
        rand = getRand()
        speed = speedChange
        
        if (obst)
        {
            var spawnY
            rand === 2 ? spawnY = game.world.centerY + 331 : spawnY = game.world.centerY + 170
            if(rand === 1){
                oona.tunel.reset(game.world.width, spawnY)
                oona.tunel.body.velocity.x = -speed * 150
            }
            obst.reset(game.world.width, spawnY)
            obst.loadTexture('atlas.motionSlip', obstaclesGroup.obtacleName[rand])
            obst.body.velocity.x = -speed * 150
            obst.col = true
        }
    }
    
    function oonaVSobstacle(oonaColl, obst){
        
        if(obst.col){
            obst.col = false

            if(oona.opt === rand){
                addCoin()
                particleCorrect.x = oona.x
                particleCorrect.y = oona.y
                particleCorrect.start(true, 1200, null, 6)
                changeAction(oona.opt, obst)
                
                if(pointsBar.number !== 0 && pointsBar.number % 6 === 0){
                    speedChange++
                    delays[0].in -=  50
                    delays[0].out -= 50
                    delays[1].in -= 100
                    delays[2].in /= speedChange * 0.4
                    delays[2].out /= speedChange * 0.4
                }
            }
            else{
                missPoint()
                particleWrong.x = oona.x
                particleWrong.y = oona.y
                particleWrong.start(true, 1200, null, 6)
                gameActive = false
                changeAction(rand + 3, obst)
                

                game.time.events.add(1200,function(){
                    if(lives !== 0)
                        reborn(obst)
                },this)
            }
        }
    }           
    
    function changeAction(opt, obst){
        
        switch(opt){
                
            case 0: //climb
                sound.play("step")
                oona.setAnimationByName(0, "climb", true)
                speed = 0.8
                obst.body.velocity.x = -speed * 150
                game.add.tween(oona).to({y: oona.y - 250}, delays[opt].in, Phaser.Easing.linear, true).onComplete.add(function(){
                    oona.setAnimationByName(0, "jump", true)
                    speed = 2
                    sound.play("whoosh")
                    obst.body.velocity.x = -speed * 150
                    game.add.tween(oona).to({y: oona.y + 250}, delays[opt].out, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                        oona.setAnimationByName(0, "run", true)
                        restoreSpeed(obst)
                    })
                })
            break
            
            case 1: //crawl
                sound.play("step")
                oona.setAnimationByName(0, "down", true)
                speed = 1
                obst.body.velocity.x = -speed * 150
                oona.tunel.body.velocity.x = -speed * 150
                game.time.events.add(delays[opt].in,function(){
                    restoreSpeed(obst)
                    oona.setAnimationByName(0, "run", true)
                },this)
            break
            
            case 2: //jump
                sound.play("whoosh")
                oona.setAnimationByName(0, "jump", true)
                if(speed < 2) 
                    speed = 2 
                obst.body.velocity.x = -speed * 150
                game.add.tween(oona).to({y: oona.y - 100}, delays[opt].in, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
                    game.add.tween(oona).to({y: oona.y + 100}, delays[opt].out, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                        restoreSpeed(obst)
                        oona.setAnimationByName(0, "run", true)
                    })
                })
            break    
            
            case 3:
            case 4:
                speed = 0
                obst.body.velocity.x = speed
                if(rand === 1)
                    oona.tunel.body.velocity.x = speed
                sound.play("punch1")
                oona.setAnimationByName(0, "lose_hit", false)
                oona.addAnimationByName(0, "losestill_hit", true)
            break
            
            case 5:
                speed = 0
                obst.body.velocity.x = speed
                if(rand === 1)
                    oona.tunel.body.velocity.x = speed
                oona.setAnimationByName(0, "jump", false)
                
                game.add.tween(oona).to({x: oona.x + 110}, 400, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
                    oona.setAnimationByName(0, "lose_falling", false)
                    game.time.events.add(700,function(){
                        sound.play("water_splash")
                    },this)
                })
            break
        }
    }
    
    function restoreSpeed(obst){
        
        speed = speedChange
        obst.body.velocity.x = -speed * 150
        
        if(rand === 1)
            oona.tunel.body.velocity.x = -speed * 150
    }
    
    function reborn(obst){
        
        speed = 2
        obst.body.velocity.x = -speed * 150
        
        if(rand === 1)
            oona.tunel.body.velocity.x = -speed * 150
        
        game.time.events.add(1500,function(){
            speed = 0
            obst.body.velocity.x = speed

            if(rand === 1)
                oona.tunel.body.velocity.x = speed
        },this)
        
        game.add.tween(oona).to({x: -200}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
            oona.setAnimationByName(0, "run", true)
            game.add.tween(oona).to({x: 120}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                oona.setAnimationByName(0, "idle", true)
                
                initGame()
            })
        })
    }
    
    function initGame(){
            
        game.time.events.add(1200,function(){
            gameActive = true
            oona.setAnimationByName(0, "run", true)
            trowObstacle()
        },this)
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 2)
        if(x === rand)
            return getRand()
        else
            return x     
    }
	
	return {
		
		assets: assets,
		name: "motionSlip",
		update: update,
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
            gameSong = sound.play("gameSong", {loop:true, volume:0.4})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            createObstacles()
            createOona()
            createButtons()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()