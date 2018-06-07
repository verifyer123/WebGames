
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var deliverInTown = function(){
    
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
                name: "atlas.deliverInTown",
                json: "images/deliverInTown/atlas.json",
                image: "images/deliverInTown/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/deliverInTown/timeAtlas.json",
                image: "images/deliverInTown/timeAtlas.png",
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
				file:"images/deliverInTown/gameTuto.png"
			},
            {
				name:'street',
				file:"images/deliverInTown/street.png"
			},
            {
				name:'tile',
				file:"images/deliverInTown/tile.png"
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
            {	name: "carAcceleration",
				file: soundsPath + "carAcceleration.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
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
				name:"car",
				file:"images/spines/car.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 198
    var tutoGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var codeGroup
    var cityGroup
    var buttonsGroup
    var street
    var car
    var testCollision
    var rand
    var originBubble
    var destinyBubble
    var timeAttack
    var gameTime
    var codeIndex
    var okBtn
    var tutorial = true 
    var tutoInstructions
    var tutoIndex
    var aux
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        testCollision = false
        rand = -1
        timeAttack = false
        gameTime = 15000
        if(tutorial){
            tutoInstructions = [1,4,1,4,0,3,2,3,2,5]
            tutoIndex = 0
        }
        aux = -1
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.deliverInTown','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.deliverInTown','life_box')

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
        
        car.alpha = 1
        game.add.tween(car).from({x: game.world.width + 100}, 1000, Phaser.Easing.linear,true).onComplete.add(function(){
            tutorial ? initTuto() : initGame()
        })
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
            
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.deliverInTown", "dock"))
        
        var codeBox = game.add.sprite(0, game.world.height + 20,  "atlas.deliverInTown", "codeBox")
        codeBox.anchor.setTo(0, 1)
        codeBox.scale.setTo(1, 1.03)
        
        var board = game.add.sprite(codeBox.width - 2, game.world.height + 20, "atlas.deliverInTown", "board")
        board.anchor.setTo(0, 1)
        board.width = game.world.width - codeBox.width + 2
        
        street = sceneGroup.create(codeBox.width - 2, game.world.height - 55, "street")
        street.anchor.setTo(0, 1)
        street.scale.setTo(0.7)
        street.width = game.world.width - codeBox.width + 4
        
        sceneGroup.add(codeBox)
        sceneGroup.add(board)
        
        createCity()
        createBoxes(codeBox)
        createButtons(board)
    }

	function update(){
        
        if(testCollision){
            
            for(var i = 0; i < cityGroup.length; i++){
                
                if(cityGroup.children[i] !== car){
                
                    for(var j = 0; j < cityGroup.children[i].length; j++){

                        if(checkOverlap(cityGroup.children[i].children[j].box, car.box)){
                            checkPlace(cityGroup.children[i].children[j].box)
                            break
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
        particle.makeParticles('atlas.deliverInTown',key);
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

				particle.makeParticles('atlas.deliverInTown',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.deliverInTown','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.deliverInTown','smoke');
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
        timerGroup.y = clock.height * 0.35
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
            game.add.tween(originBubble.scale).to({x: 0, y: 0}, 250, Phaser.Easing.linear,true)
            game.add.tween(destinyBubble.scale).to({x: 0, y: 0}, 250, Phaser.Easing.linear,true).onComplete.add(function(){
                game.time.events.add(500,win)
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
        hand.scale.setTo(0.8)

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
               })
           })
        })
    }
    
    function createCity(){
        
        cityGroup = game.add.group()
        sceneGroup.add(cityGroup)
        
        var pivotY = 0.61
        var aux = 0
        
        for(var i = 0; i < 3; i++){
            
            var pivotX = 0.5
            var subGroup = game.add.group()
            cityGroup.add(subGroup)
            
            for(var j = 0; j < 3; j++){
            
                var build = subGroup.create(street.centerX * pivotX, (street.centerY - 40) * pivotY, "atlas.deliverInTown", "building" + aux)
                build.anchor.setTo(0.5)
                build.scale.setTo(1, 0.9)
                
                var box = game.add.graphics(0, 0)
                box.beginFill(0x00ff00)
                box.drawRect(-25, 80, 50, 80)
                box.alpha = 0
                box.place = aux
                box.origin = false
                box.destiny = false
                build.addChild(box)
                build.box = box
        
                pivotX += 0.5
                aux++
        
                if(aux === 5){
                    build.y -= 15
                    build.box.y += 15
                }
            }
            pivotY += 0.4
        }
        
        createCar()
    }
    
    function createCar(){
        
        car = game.add.spine(0, 0, "car")
        car.setAnimationByName(0, "idle_l", true)
        car.setSkinByName("normal")
        cityGroup.add(car)
        
        car.actualPosX = 1
        car.actualPosY = 3
       
        car.tourX = [0.7, 1.25]
        car.tourY =[0.43, 0.8, 1.16, 1.55]
       
        car.x = street.centerX * car.tourX[car.actualPosX]
        car.y = street.centerY * car.tourY[car.actualPosY]
        
        car.view = "l"
        
        var box = game.add.graphics(0, 0)
        box.beginFill(0x0000ff)
        box.drawRect(-30, -75, 60, 50)
        box.alpha = 0
        box.origin = false
        box.destiny = false
        box.received = false
        car.addChild(box)
        car.box = box
        
        cityGroup.setChildIndex(car , car.actualPosY)
        car.alpha = 0
        
        createBubbles()
    }
    
    function createBubbles(){
        
        originBubble = sceneGroup.create(0, 0, "atlas.deliverInTown", "bubble")
        originBubble.anchor.setTo(0.5, 1)
        originBubble.scale.setTo(0)
        
        var destiny = game.add.sprite(0, -25, "atlas.deliverInTown", "box0")
        destiny.anchor.setTo(0.5, 1)
        destiny.scale.setTo(0.8)
        originBubble.addChild(destiny)
        originBubble.destiny = destiny 
        
        destinyBubble = sceneGroup.create(0, 0, "atlas.deliverInTown", "bubble")
        destinyBubble.anchor.setTo(0.5, 1)
        destinyBubble.scale.setTo(0)
        
        var destiny = game.add.sprite(0, -50, "atlas.deliverInTown", "btn0")
        destiny.anchor.setTo(0.5, 1)
        destiny.scale.setTo(1.2)
        destinyBubble.addChild(destiny)
        destinyBubble.destiny = destiny
    }
    
    function createBoxes(codeBox){
        
        codeGroup = game.add.group()
        sceneGroup.add(codeGroup)
        
        var pivot = 0.32
        
        for(var i = 0; i < 12; i++){
            
            var img = codeGroup.create(codeBox.centerX, codeBox.centerY * pivot, "atlas.deliverInTown", "btn0")
            img.anchor.setTo(0.5)
            img.scale.setTo(1.2, 1.1)
            img.alpha = 0
            img.action = -1
            img.spawnX = img.x
            img.spawnY = img.y
            img.inputEnabled = true
            img.input.enableDrag()
            img.events.onDragStop.add(deleteCode, this)
            
            pivot += 0.13
        }

        okBtn = sceneGroup.create(codeBox.centerX, codeBox.y - 70, "atlas.deliverInTown", "okBtn")
        okBtn.anchor.setTo(0.5)
        okBtn.scale.setTo(1.2)
        okBtn.inputEnabled = true
        okBtn.events.onInputDown.add(runCode, this)
        
        codeIndex = codeGroup.length - 1
        
        okBtn.alpha = 0
        okBtn.inputEnabled = false
    }
    
    function deleteCode(obj){
        
        obj.x = obj.spawnX
        obj.y = obj.spawnY
        
        if(obj.alpha === 1){
            codeIndex++
            sound.play("cut")
            var index = codeGroup.getIndex(obj)
            
            for(var i = index; i > 0; i--){
                
                codeGroup.children[i].action = codeGroup.children[i - 1].action
                codeGroup.children[i].alpha = codeGroup.children[i - 1].alpha
                if(codeGroup.children[i].action !== -1)
                        codeGroup.children[i].loadTexture("atlas.deliverInTown", "btn" + codeGroup.children[i - 1].action)
            }
        }
    }
    
    function createButtons(board){
        
        buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        var pivot = 0.44
        
        for(var i = 0; i < 6; i++){
            
            var img = buttonsGroup.create(board.centerX * pivot, board.centerY - 10, "atlas.deliverInTown", "btn" + i)
            img.anchor.setTo(0.5)
            img.scale.setTo(1.2)
            img.spawnX = img.x
            img.spawnY = img.y
            img.action = i
            img.inputEnabled = true
            img.input.enableDrag()
            img.events.onDragStop.add(setCode, this)
            
            pivot += 0.22
        }
        
        buttonsGroup.setAll("inputEnabled", false)
    }
    
    function setCode(obj){
        
        if(gameActive){
            
            for(var i = 0; i < codeGroup.length; i++){

                if(checkOverlap(codeGroup.children[i], obj)){

                    sound.play("robotWhoosh")
                    codeGroup.children[codeIndex].action = obj.action
                    codeGroup.children[codeIndex].loadTexture("atlas.deliverInTown", "btn" + obj.action)
                    codeGroup.children[codeIndex].alpha = 1
                    game.add.tween(obj.scale).from({x:0, y:0}, 200, Phaser.Easing.Cubic.InOut,true)
                    codeIndex--
                    
                    if(tutorial){
                        hand.alpha = 0
                        hand.move.stop()
                        obj.x = obj.spawnX
                        obj.y = obj.spawnY
                        posHand(buttonsGroup.children[tutoInstructions[tutoIndex]])
                        tutoIndex++
                    }
                    break
                }      
            }
        }
        obj.x = obj.spawnX
        obj.y = obj.spawnY
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds()
        var boundsB = spriteB.getBounds()

        return Phaser.Rectangle.intersects(boundsA , boundsB )
    }
    
    function runCode(btn){
        
        if(gameActive){
            
            sound.play("pop")
            gameActive = false
            buttonsGroup.setAll("inputEnabled", false)
            if(timeAttack)
                stopTimer()
            
            game.add.tween(btn.scale).to({x:0.5, y:0.5},100,Phaser.Easing.In,true,0,0).yoyo(true, 0)
            
            var action = codeGroup.children[codeGroup.length - 1].action
            if(action !== -1 && action !== 0 && action !== 5){
                sendInstruction(codeGroup.children[codeGroup.length - 1].action, codeGroup.length - 1)
            }
            else{
                game.add.tween(originBubble.scale).to({x: 0, y: 0}, 250, Phaser.Easing.linear,true)
                game.add.tween(destinyBubble.scale).to({x: 0, y: 0}, 250, Phaser.Easing.linear,true).onComplete.add(function(){
                    game.time.events.add(500,win)
                })
            }
            
            if(tutorial){
                tutorial = false
                hand.destroy()
            }
        }
    }
    
    function sendInstruction(action, index){
        
        deliveryTour(action)
        codeGroup.children[index].alpha = 0.5
        
        if(action === 0 || action === 5){     
            var delay = 0
        }
        else{
            var delay = 1400
            if(codeGroup.children[index - 1] && codeGroup.children[index - 1].action !== -1){
                var nextAction = codeGroup.children[index-1].action
                if(nextAction === 0 || nextAction === 5){
                    deliveryTour(nextAction)
                    aux = index - 1
                    index--
                }
            }
        }
        
        index--
        game.time.events.add(delay,function(){
            if(codeGroup.children[index] && codeGroup.children[index].action !== -1){
                sendInstruction(codeGroup.children[index].action, index)
            }
            else{
                game.add.tween(originBubble.scale).to({x: 0, y: 0}, 250, Phaser.Easing.linear,true)
                game.add.tween(destinyBubble.scale).to({x: 0, y: 0}, 250, Phaser.Easing.linear,true).onComplete.add(function(){
                    game.time.events.add(500,win)
                })
            }
        })
    }
    
    function deliveryTour(opt){
        
        var speed = 1000
        
        switch(opt){
                
            case 1:
                if(car.actualPosY > 0){
                    sound.play("carAcceleration")
                    car.actualPosY--
                    car.setAnimationByName(0, "run_back", true)
                    car.view = "back"
                    car.trip = game.add.tween(car).to({y: street.centerY * car.tourY[car.actualPosY]}, speed, Phaser.Easing.linear,true)
                    car.trip.onComplete.add(function(){
                        cityGroup.setChildIndex(car, car.actualPosY)
                        sound.stop("carAcceleration")
                        if(car.actualPosY === 0){
                            car.setAnimationByName(0, "idle_r", true)
                            car.view = "r"
                        }
                        else{
                            car.setAnimationByName(0, "idle_back", true)
                        }
                    })
                }
            break
            
            case 2:
                testCollision = true
                sound.play("carAcceleration")
                if(car.actualPosX !== 1){
                    car.actualPosX++
                    car.setAnimationByName(0, "run_r", true)
                    car.view = "r"
                    car.trip = game.add.tween(car).to({x: street.centerX * car.tourX[car.actualPosX]}, speed, Phaser.Easing.linear,true)
                    car.trip.onComplete.add(function(){
                        car.setAnimationByName(0, "idle_r", true)
                        testCollision = false
                        car.box.origin = false
                        car.box.destiny = false
                        sound.stop("carAcceleration")
                    })
                }
                else{
                    car.setAnimationByName(0, "run_r", true)
                    car.view = "l"
                    car.trip = game.add.tween(car).to({x: car.x + (street.centerX * 0.25)}, speed * 0.5, Phaser.Easing.linear,true)
                    car.trip.onComplete.add(function(){
                        car.setAnimationByName(0, "run_l", true)
                        game.add.tween(car).to({x: street.centerX * car.tourX[car.actualPosX]}, speed * 0.5, Phaser.Easing.linear,true).onComplete.add(function(){
                            car.setAnimationByName(0, "idle_l", true)
                            car.view = "l"
                            testCollision = false
                            car.box.origin = false
                            car.box.destiny = false
                            sound.stop("carAcceleration")
                        })
                    })
                }
            break
            
            case 3:
                if(car.actualPosY < 3){
                    sound.play("carAcceleration")
                    car.actualPosY++
                    car.setAnimationByName(0, "run_front", true)
                    car.view = "front"
                    car.trip = game.add.tween(car).to({y: street.centerY * car.tourY[car.actualPosY]}, speed, Phaser.Easing.linear,true)
                    car.trip.onComplete.add(function(){
                        cityGroup.setChildIndex(car, car.actualPosY)
                        car.setAnimationByName(0, "idle_front", true)
                        sound.stop("carAcceleration")
                    })
                }
            break
            
            case 4:
                testCollision = true
                sound.play("carAcceleration")
                if(car.actualPosX !== 0){
                    car.actualPosX--
                    car.setAnimationByName(0, "run_l", true)
                    car.view = "l"
                    car.trip = game.add.tween(car).to({x: street.centerX * car.tourX[car.actualPosX]}, speed, Phaser.Easing.linear,true)
                    car.trip.onComplete.add(function(){
                        car.setAnimationByName(0, "idle_l", true)
                        testCollision = false
                        car.box.origin = false
                        car.box.destiny = false
                        sound.stop("carAcceleration")
                    })
                }
                else{
                    car.setAnimationByName(0, "run_l", true)
                    car.view = "l"
                    car.trip = game.add.tween(car).to({x: car.x - (street.centerX * 0.25)}, speed * 0.5, Phaser.Easing.linear,true)
                    car.trip.onComplete.add(function(){
                        car.setAnimationByName(0, "run_r", true)
                        game.add.tween(car).to({x: street.centerX * car.tourX[car.actualPosX]}, speed * 0.5, Phaser.Easing.linear,true).onComplete.add(function(){
                            car.setAnimationByName(0, "idle_r", true)
                            car.view = "r"
                            testCollision = false
                            car.box.origin = false
                            car.box.destiny = false
                            sound.stop("carAcceleration")
                        })
                    })
                }
            break
            
            case 0:
                car.box.origin = true
            break
            
            case 5:
                car.box.destiny = true
            break
        }
    }
    
    function checkPlace(box){
        
        if(testCollision){
            testCollision = false
            
            if(car.box.origin && box.origin && !car.box.received){
                sound.play("cut")
                car.trip.pause()
                box.origin = false
                car.box.received = true
                if(aux !== -1)
                    codeGroup.children[aux].alpha = 0.5
                game.add.tween(originBubble.scale).to({x: 0, y: 0}, 250, Phaser.Easing.linear,true).onComplete.add(function(){
                    car.trip.resume()
                })
            }
            else if(car.box.destiny && box.destiny && car.box.received){
                sound.play("cut")
                car.trip.pause()
                box.destiny = false
                if(aux !== -1)
                    codeGroup.children[aux].alpha = 0.5
                car.setAnimationByName(0, "delivery_" + car.view, true)
                game.time.events.add(1000,function(){
                    car.addAnimationByName(0, "idle_" + car.view, true)
                game.add.tween(destinyBubble.scale).to({x: 0, y: 0}, 250, Phaser.Easing.linear,true).onComplete.add(function(){
                    car.trip.resume()
                    car.setAnimationByName(0, "run_" + car.view, true)
                })
                })
            }
        }
    }
    
    function win(){
        
        var ans = true
        
        for(var i = 0; i < cityGroup.length; i++){
                
            if(cityGroup.children[i] !== car){

                for(var j = 0; j < cityGroup.children[i].length; j++){

                    if(cityGroup.children[i].children[j].box.origin || cityGroup.children[i].children[j].box.destiny){
                        ans = false
                        break
                    }
                }
            }
        }
        
        if(ans){
            addCoin(car)
            car.setAnimationByName(0, "win_" + car.view, true)
            if(pointsBar.number === 10){
                timeAttack = true
                game.add.tween(timerGroup).to({alpha: 1}, 300, Phaser.Easing.linear, true)
            }
            
            if(pointsBar.number > 15){
                gameTime > 1000 ? gameTime -= 1000 : gameTime = 1000
            }
        }
        else{
            car.setAnimationByName(0, "lose_" + car.view, true)
            missPoint(car)
        }
        
        if(lives !== 0)
            ressetAssets()
    }
    
    function ressetAssets(){
        
        car.box.destiny = false
        car.box.origin = false
        car.box.received = false
        testCollision = false
        codeIndex = codeGroup.length - 1
        aux = -1
        
        for(var i = 0; i < cityGroup.length; i++){
                
            if(cityGroup.children[i] !== car){

                for(var j = 0; j < cityGroup.children[i].length; j++){

                    cityGroup.children[i].children[j].box.origin = false
                    cityGroup.children[i].children[j].box.destiny = false
                }
            }
        }
        
        for(var i = 0; i < codeGroup.length; i++){
                
            codeGroup.children[i].action = -1
            codeGroup.children[i].alpha = 0
        }
        
        game.time.events.add(1500,function(){
            initGame()
        })
    }
    
    function initGame(){
       
        buttonsGroup.setAll("inputEnabled", true)
        car.setAnimationByName(0, "idle_" + car.view, true)
        rand = getRand()
        originBubble.destiny.loadTexture("atlas.deliverInTown", "box" + game.rnd.integerInRange(0, 2))
        var place = getPlace()
        originBubble.x = place.x
        originBubble.y = place.y
        place.box.origin = true
        
        rand = getRand()
        destinyBubble.destiny.loadTexture("atlas.deliverInTown", "btn5")
        var place = getPlace()
        destinyBubble.x = place.x
        destinyBubble.y = place.y
        place.box.destiny = true
        
        sound.play("cut")
        game.add.tween(originBubble.scale).to({x: 1, y: 1}, 250, Phaser.Easing.linear,true).onComplete.add(function(){
            sound.play("cut")
            game.add.tween(destinyBubble.scale).to({x: 1, y: 1}, 250, Phaser.Easing.linear,true).onComplete.add(function(){
                gameActive = true
                testCollision = false
                game.time.events.add(800,function(){
                    if(timeAttack)
                        startTimer(gameTime)
                })
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
    
    function getPlace(){
        
        for(var i = 0; i < cityGroup.length; i++){
                
            if(cityGroup.children[i] !== car){

                for(var j = 0; j < cityGroup.children[i].length; j++){

                    if(cityGroup.children[i].children[j].box.place === rand){
                        return cityGroup.children[i].children[j]
                        break
                    }
                }
            }
        }
    }
    
    function setRoute(){
        
        
    }
    
    function initTuto(){
        
        car.setAnimationByName(0, "idle_" + car.view, true)
        rand = 0
        originBubble.destiny.loadTexture("atlas.deliverInTown", "box" + game.rnd.integerInRange(0, 2))
        var place = getPlace()
        originBubble.x = place.x
        originBubble.y = place.y
        place.box.origin = true
        
        rand = 8
        destinyBubble.destiny.loadTexture("atlas.deliverInTown", "btn5")
        var place = getPlace()
        destinyBubble.x = place.x
        destinyBubble.y = place.y
        place.box.destiny = true
        
        sound.play("cut")
        game.add.tween(originBubble.scale).to({x: 1, y: 1}, 250, Phaser.Easing.linear,true).onComplete.add(function(){
            sound.play("cut")
            game.add.tween(destinyBubble.scale).to({x: 1, y: 1}, 250, Phaser.Easing.linear,true).onComplete.add(function(){
                gameActive = true
                testCollision = false
                posHand(buttonsGroup.children[tutoInstructions[tutoIndex]])
                tutoIndex++
            })
        })    
    }
    
    function posHand(obj){
        
        if(tutoIndex < tutoInstructions.length){
            buttonsGroup.setAll("inputEnabled", false)
            obj.inputEnabled = true
            hand.x = obj.x
            hand.y = obj.y - 30
            hand.alpha = 1
            hand.move = game.add.tween(hand).to({x: codeGroup.children[codeIndex].x, y: codeGroup.children[codeIndex].y - 50}, 1000, Phaser.Easing.linear,false)
            hand.move.delay(800)
            hand.move.start()
            hand.move.repeat(-1)
            hand.move.repeatDelay(1000)
        }
        else{
            hand.x = okBtn.x
            hand.y = okBtn.y
            hand.alpha = 1
            okBtn.alpha = 1
            okBtn.inputEnabled = true
        }
    }
	
	return {
		
		assets: assets,
		name: "deliverInTown",
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
            gameSong = sound.play("gameSong", {loop:true, volume:0.5})
            
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
            //createButtons()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()