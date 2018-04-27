
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"
var addressInTown = function(){
    
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
                name: "atlas.addressInTown",
                json: "images/addressInTown/atlas.json",
                image: "images/addressInTown/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/addressInTown/timeAtlas.json",
                image: "images/addressInTown/timeAtlas.png",
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
				file:"images/addressInTown/gametuto.png"
			},
            {
				name:'street',
				file:"images/addressInTown/street.png"
			}

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "carAcceleration",
				file: soundsPath + "carAcceleration.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/cooking_in_loop.mp3'
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
				file:"images/spines/oof.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 197
    var tutoGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var street
    var streetGroup
    var oof
    var canMove
    var timeAttack
    var gameTime
    var rand
    var testCollision
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        canMove = true
        testCollision = false
        timeAttack = false
        gameTime = 10000
        rand
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.addressInTown','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.addressInTown','life_box')

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
        
        oof.alpha = 1
        game.add.tween(oof).from({x: -100}, 1000, Phaser.Easing.linear,true).onComplete.add(function(){
            initGame()  
        })
    }
    
	function createBackground(){
            
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.addressInTown", "tile"))
            
        street = sceneGroup.create(game.world.centerX, game.world.centerY + 25, "street")
        street.anchor.setTo(0.5)
        street.scale.setTo(1, 0.75)
        street.width = game.world.width + 20
    }

	function update(){
        
        if(gameActive && !canMove && testCollision){
            
            for(var i = 0; i < streetGroup.length; i++){
                
                if(streetGroup.children[i] !== oof){
                
                    for(var j = 0; j < streetGroup.children[i].length; j++){

                        if(checkOverlap(streetGroup.children[i].children[j].box, oof.box)){
                            checkPlace(streetGroup.children[i].children[j].box)
                        }
                    }
                }
            }
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
        particle.makeParticles('atlas.addressInTown',key);
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

				particle.makeParticles('atlas.addressInTown',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.addressInTown','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.addressInTown','smoke');
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
        game.add.tween(timerGroup.timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        timerGroup.tweenTiempo = game.add.tween(timerGroup.timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        timerGroup.tweenTiempo.onComplete.add(function(){
            gameActive = false
            canMove = false
            testCollision = false
            stopTimer()
            if(oof.trip)
                oof.trip.stop()
            missPoint(oof)
            oof.setAnimationByName(0, "LOSE_" + oof.view, true)
            game.add.tween(oof.bubble.scale).to({x: 0, y: 0}, 250, Phaser.Easing.linear,true).onComplete.add(function(){
                game.time.events.add(1000,function(){
                    if(lives !== 0)
                        restartAssets(false)
                })
            })
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
        
        sound.play("rightChoice")
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
    
    function createButtons(){
        
        var board = sceneGroup.create(game.world.centerX, game.world.height, "atlas.addressInTown", "board")
        board.anchor.setTo(0.5, 1)
        board.scale.setTo(1.2)
        
        var buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        var pivot = 0.6
        
        for(var i = 0; i < 4; i++){
            
            var btn = buttonsGroup.create(board.centerX * pivot, board.centerY - 5, "atlas.addressInTown", "btn" + i)
            btn.anchor.setTo(0.5)
            btn.scale.setTo(1.2)
            btn.dir = i
            btn.inputEnabled = true
            btn.events.onInputDown.add(giveDirection,this)
            
            pivot += 0.27
        }
    }
    
    function giveDirection(dir){
        
        if(gameActive && canMove){
            canMove = false
            sound.play("pop")
            game.add.tween(dir.scale).to({x:0.6, y:0.6},100,Phaser.Easing.In,true,0,0).yoyo(true, 0).onComplete.add(function(){
                dir.scale.setTo(1.2)
            })
            moveOof(dir.dir)
        }
    }
    
    function createBuildings(){
        
        streetGroup = game.add.group()
        sceneGroup.add(streetGroup)
        
        var pivotY = 0.58
        var aux = 0
        
        for(var i = 0; i < 3; i++){
            
            var pivotX = 0.25
            var subGroup = game.add.group()
            streetGroup.add(subGroup)
            
            for(var j = 0; j < 3; j++){
            
                var build = subGroup.create(street.centerX * pivotX, (street.centerY - 40) * pivotY, "atlas.addressInTown", "building" + aux)
                build.anchor.setTo(0.5)
                build.scale.setTo(0.8, 0.7)
                
                var box = game.add.graphics(0, 0)
                box.beginFill(0x00ff00)
                box.drawRect(-50, 100, 100, 100)
                box.alpha = 0
                box.place = aux
                build.addChild(box)
                build.box = box
        
                pivotX += 0.75
                aux++
        
                if(aux === 3){
                    build.y -= 15
                    build.box.y += 15
                }
            }
            pivotY += 0.45
        }
    }
    
    function createOof(){
        
        oof = game.add.spine(0, 0, "oof")
        oof.setAnimationByName(0, "IDLE_L&R", true)
        oof.setSkinByName("normal")
        streetGroup.add(oof)
        
        oof.actualPosX = 0
        oof.actualPosY = 3
        
        oof.tourX = [-106, 145]
        oof.tourY =[-320, -110, 100, 320]
        
        oof.x = street.centerX + oof.tourX[oof.actualPosX]
        oof.y = street.centerY + oof.tourY[oof.actualPosY]
        
        oof.view = "L&R"
        
        var bubble = game.add.sprite(-20, -100, "atlas.addressInTown", "bubble")
        bubble.anchor.setTo(0.5, 1)
        bubble.scale.setTo(0)
        oof.addChild(bubble)
        oof.bubble = bubble
        
        var destiny = game.add.sprite(0, -20, "atlas.addressInTown", "mini8")
        destiny.anchor.setTo(0.5, 1)
        bubble.addChild(destiny)
        bubble.destiny = destiny
            
        var box = game.add.graphics(0, 0)
        box.beginFill(0x0000ff)
        box.drawRect(-50, -75, 60, 50)
        box.alpha = 0
        oof.addChild(box)
        oof.box = box
        
        streetGroup.setChildIndex(oof, oof.actualPosY)
        oof.alpha = 0
    }
    
    function moveOof(opt){
        
        var speed = gameTime * 0.1
        
        switch(opt){
                
            case 0:
                if(oof.actualPosY > 0){
                    sound.play("carAcceleration")
                    oof.actualPosY--
                    streetGroup.setChildIndex(oof, oof.actualPosY)
                    oof.scale.setTo(1)
                    oof.setAnimationByName(0, "RUN_BACK", true)
                    oof.view = "BACK"
                    oof.trip = game.add.tween(oof).to({y: street.centerY + oof.tourY[oof.actualPosY]}, speed, Phaser.Easing.linear,true)
                    oof.trip.onComplete.add(function(){
                        oof.setAnimationByName(0, "IDLE_BACK", true)
                        canMove = true
                        sound.stop("carAcceleration")
                    })
                }
                else{
                    canMove = true
                }
            break
            
            case 1:
                testCollision = true
                sound.play("carAcceleration")
                if(oof.actualPosX !== 1){
                    oof.actualPosX++
                    oof.scale.setTo(1)
                    oof.setAnimationByName(0, "RUN_L&R", true)
                    oof.view = "L&R"
                    oof.trip = game.add.tween(oof).to({x: street.centerX + oof.tourX[oof.actualPosX]}, speed, Phaser.Easing.linear,true)
                    oof.trip.onComplete.add(function(){
                        oof.setAnimationByName(0, "IDLE_L&R", true)
                        canMove = true
                        testCollision = false
                        sound.stop("carAcceleration")
                    })
                }
                else{
                    oof.scale.setTo(1)
                    oof.setAnimationByName(0, "RUN_L&R", true)
                    oof.view = "L&R"
                    oof.trip = game.add.tween(oof).to({x: oof.x + 150}, speed, Phaser.Easing.linear,true)
                    oof.trip.onComplete.add(function(){
                        oof.scale.setTo(-1, 1)
                        game.add.tween(oof).to({x: oof.x - 150}, speed, Phaser.Easing.linear,true).onComplete.add(function(){
                            oof.setAnimationByName(0, "IDLE_L&R", true)
                            canMove = true
                            testCollision = false
                            sound.stop("carAcceleration")
                        })
                    })
                }
            break
            
            case 2:
                if(oof.actualPosY < 3){
                    sound.play("carAcceleration")
                    oof.actualPosY++
                    streetGroup.setChildIndex(oof, oof.actualPosY)
                    oof.scale.setTo(1)
                    oof.setAnimationByName(0, "RUN_FRONT", true)
                    oof.view = "FRONT"
                    oof.trip = game.add.tween(oof).to({y: street.centerY + oof.tourY[oof.actualPosY]}, speed, Phaser.Easing.linear,true)
                    oof.trip.onComplete.add(function(){
                        oof.setAnimationByName(0, "IDLE_FRONT", true)
                        canMove = true
                        sound.stop("carAcceleration")
                    })
                }
                else{
                    canMove = true
                }
            break
            
            case 3:
                testCollision = true
                sound.play("carAcceleration")
                if(oof.actualPosX !== 0){
                    oof.actualPosX--
                    oof.scale.setTo(-1, 1)
                    oof.setAnimationByName(0, "RUN_L&R", true)
                    oof.view = "L&R"
                    oof.trip = game.add.tween(oof).to({x: street.centerX + oof.tourX[oof.actualPosX]}, speed, Phaser.Easing.linear,true)
                    oof.trip.onComplete.add(function(){
                        oof.setAnimationByName(0, "IDLE_L&R", true)
                        canMove = true
                        testCollision = false
                        sound.stop("carAcceleration")
                    })
                }
                else{
                    oof.scale.setTo(-1, 1)
                    oof.setAnimationByName(0, "RUN_L&R", true)
                    oof.view = "L&R"
                    oof.trip = game.add.tween(oof).to({x: oof.x - 150}, speed, Phaser.Easing.linear,true)
                    oof.trip.onComplete.add(function(){
                        oof.setAnimationByName(0, "RUN_L&R", true)
                        oof.scale.setTo(1)
                        game.add.tween(oof).to({x: oof.x + 150}, speed, Phaser.Easing.linear,true).onComplete.add(function(){
                            oof.setAnimationByName(0, "IDLE_L&R", true)
                            canMove = true
                            testCollision = false
                            sound.stop("carAcceleration")
                        })
                    })
                }
            break
        }
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds()
        var boundsB = spriteB.getBounds()

        return Phaser.Rectangle.intersects(boundsA , boundsB)
    }
    
    function checkPlace(box){
        
        if(testCollision){
            testCollision = false
            
            if(box.place === rand){
                if(timeAttack)
                    stopTimer()
                canMove = false
                gameActive = false
                oof.trip.stop()
                addCoin(oof)
                game.add.tween(oof).to({x: box.parent.centerX}, 500, Phaser.Easing.linear,true).onComplete.add(function(){
                    oof.setAnimationByName(0, "WIN_L&R", true)
                    game.add.tween(oof.bubble.scale).to({x: 0, y: 0}, 250, Phaser.Easing.linear,true).onComplete.add(function(){
                        if(pointsBar.number === 15){
                            timeAttack = true
                            game.add.tween(timerGroup).to({alpha: 1}, 300, Phaser.Easing.linear, true)
                        }
                        game.time.events.add(1000,function(){
                            game.add.tween(oof).to({x: street.centerX + oof.tourX[oof.actualPosX]}, 500, Phaser.Easing.linear,true).onComplete.add(function(){
                                restartAssets(true)
                            })
                        })
                    })
                })
            }
        }
    }
    
    function restartAssets(ans){
        
        var delay = 100
        
        if(pointsBar.number > 4){
            changeBiuldings()
            delay = 400
        }
        
        if(ans){    
            if(pointsBar.number > 25){
                gameTime > 1000 ? gameTime -= 1000 : gameTime = 1000
            }
            game.time.events.add(delay,function(){
                initGame()
            })
        }
        else{
            if(oof.view === "L&R"){
                var moveToStart = game.add.tween(oof).to({x: street.centerX + oof.tourX[oof.actualPosX]}, 500, Phaser.Easing.linear,true)
            }
            else{
                var moveToStart = game.add.tween(oof).to({y: street.centerY + oof.tourY[oof.actualPosY]}, 500, Phaser.Easing.linear,true)
            }
            moveToStart.onComplete.add(function(){
                initGame()
            })
        }
    }
    
    function changeBiuldings(){
        
        var aux = 0
        var pos = []
        
        for(var i = 0; i < 9; i++){
            pos[i] = i
        }
        
        Phaser.ArrayUtils.shuffle(pos)
        
        for(var i = 0; i < streetGroup.length; i++){
                
            if(streetGroup.children[i] !== oof){

                for(var j = 0; j < streetGroup.children[i].length; j++){

                    shrinkDown(streetGroup.children[i].children[j], pos[aux])
                    streetGroup.children[i].children[j].box.place = pos[aux]
                    aux++
                }
            }
        }
    }
    
    function shrinkDown(build, index){
        
        game.add.tween(build.scale).to({x: 0, y: 0}, 300, Phaser.Easing.linear,true).onComplete.add(function(){
            build.loadTexture("atlas.addressInTown", "building" + index)
            game.add.tween(build.scale).to({x: 0.8, y: 0.7}, 300, Phaser.Easing.linear,true)
        })    
    }
    
    function initGame(){

        rand = getRand()
        oof.setAnimationByName(0, "IDLE_" + oof.view, true)
        oof.bubble.destiny.loadTexture("atlas.addressInTown", "mini" + rand)
        game.add.tween(oof.bubble.scale).to({x: 1, y: 1}, 300, Phaser.Easing.linear,true).onComplete.add(function(){
            gameActive = true
            canMove = true
            testCollision = false
            game.time.events.add(800,function(){
                if(timeAttack)
                    startTimer(gameTime)
            })
        })    
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 8)
        if(x === rand)
            return getRand()
        else
            return x
    }
	
	return {
		
		assets: assets,
		name: "addressInTown",
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
            createButtons()
            createBuildings()
            createOof()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()