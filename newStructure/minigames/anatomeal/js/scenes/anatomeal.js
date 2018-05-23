
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var anatomeal = function(){
    
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
                name: "atlas.anatomeal",
                json: "images/anatomeal/atlas.json",
                image: "images/anatomeal/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/anatomeal/timeAtlas.json",
                image: "images/anatomeal/timeAtlas.png",
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
				file:"images/anatomeal/gametuto.png"
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
            {	name: "robotWhoosh",
				file: soundsPath + "robotWhoosh.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/running_game.mp3'
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
				name:"dinamita",
				file:"images/spines/operando.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 206
    var tutoGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var foodGroup
    var dinamita
    var bodyParts
    var tutoCount
    var timeAttack
    var gameTime
    var foodCount
    var level
    var tutorial
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        bodyParts = []
        tutoCount = 0
        foodCount = 0
        timeAttack = false
        gameTime = 10000
        level = 2
        tutorial = true
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.anatomeal','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.anatomeal','life_box')

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
        createBodyArray()
        dinamita.alpha = 1
        game.add.tween(dinamita).from({y: - 100},1500,Phaser.Easing.linear,true).onComplete.add(function(){
            initTuto()
        })
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
            
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.anatomeal", "tile"))
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
        particle.makeParticles('atlas.anatomeal',key);
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

				particle.makeParticles('atlas.anatomeal',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.anatomeal','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.anatomeal','smoke');
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
            missPoint(dinamita)
            dinamita.setAnimationByName(0, "lose", true)
            foodGroup.setAll("inputEnabled", false)
            
            if(lives !== 0){
                for(var i = 0; i < bodyParts.length; i++){
                    fadeIn(bodyParts[i].img, 200, 0)
                }
                for(var i = 0; i < foodGroup.length; i++){
                    fadeIn(foodGroup.children[i], 100, 0)
                    foodGroup.children[i].x = foodGroup.children[i].spawnX
                    foodGroup.children[i].y = foodGroup.children[i].spawnY
                }
                
                game.time.events.add(1500,function(){
                    dinamita.setAnimationByName(0, "lose", true)
                    restartAssets()
                })
            }
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
    
    function createDinamita(){
        
        var bed = sceneGroup.create(game.world.centerX, game.world.centerY, "atlas.anatomeal", "bed")
        bed.anchor.setTo(0.5)
        
        dinamita = game.add.spine(bed.x, bed.y, "dinamita")
        dinamita.setAnimationByName(0, "idle", true)
        dinamita.setSkinByName("normal")
        dinamita.alpha = 0
        sceneGroup.add(dinamita)    
    }
    
    function createBodyArray(){
        
        var slotNames = ["empty_torso_lungs", "empty_head", "emoty_hand", "empty_arm", "empty_leg"]
         
        for(var i = 0; i < slotNames.length; i++){
            
            var slot = getSpineSlot(dinamita, slotNames[i])
            slot.children[0].alpha = 0
            bodyParts[bodyParts.length] = {img: slot.children[0], used: false, tag: i}
        }
        
        bodyParts[3].tag = 2
        bodyParts[4].tag = 3
    }
    
    function getSpineSlot(spine, slotName){
		
		var slotIndex
		for(var index = 0, n = spine.skeletonData.slots.length; index < n; index++){
			var slotData = spine.skeletonData.slots[index]
			if(slotData.name === slotName){
				slotIndex = index
			}
		}

		if (slotIndex){
			return spine.slotContainers[slotIndex]
		}
	}
    
    function createBoard(){
        
        var board = sceneGroup.create(0, game.world.height, "atlas.anatomeal", "board")
        board.anchor.setTo(0, 1)
        board.width = game.world.width
        
        foodGroup = game.add.group()
        sceneGroup.add(foodGroup)
        
        var pivot = 0.25
        
        for(var i = 0; i < 4; i++){
            
            if(i !== 2){
                var name = "food" + i
            }
            else{
                var name = "food" + i + "opt" + 0
            }
            var food = foodGroup.create(board.centerX * pivot, board.centerY, "atlas.anatomeal", name)
            food.anchor.setTo(0.5)
            food.tag = i
            food.alpha = 0
            food.spawnX = food.x
            food.spawnY = food.y
            food.inputEnabled = true
            food.input.enableDrag()
            food.events.onDragStop.add(setFood, this)
            pivot += 0.45
        }
        
        foodGroup.setAll("inputEnabled", false)
    }
    
    function setFood(obj){
        
        if(!gameActive){
            game.add.tween(obj).to({x: obj.spawnX, y: obj.spawnY},200,Phaser.Easing.linear,true)
            return
        }
        else{
            
            var part
            
            for(var i = 0; i < bodyParts.length; i++){
                if(checkOverlap(obj, bodyParts[i].img) && !bodyParts[i].used && bodyParts[i].img.alpha === 1){
                    part = bodyParts[i]
                    break
                }
            }
            
            if(part){
                if(part.tag === obj.tag){
                    fadeIn(part.img, 200, 0)
                    part.used = true
                    dinamita.setAnimationByName(0, "win", true)
                    game.add.tween(obj).to({x: part.img.world.x, y: part.img.world.y},300,Phaser.Easing.linear,true)
                    game.add.tween(obj.scale).to({x: 0, y: 0},300,Phaser.Easing.linear,true).onComplete.add(function(){
                        dinamita.addAnimationByName(0, "idle", true)
                        addCoin(obj)
                        sound.play("robotWhoosh")
                        obj.alpha = 0
                        obj.scale.setTo(1)
                        obj.x = obj.spawnX
                        obj.y = obj.spawnY
                        obj.inputEnabled = false 

                        if(tutorial){
                            game.time.events.add(1000,restartAssets)
                        }
                        else{
                            foodCount++
                            if(foodCount === level && lives !== 0){
                                game.time.events.add(1500,restartAssets)
                                if(timeAttack){
                                    gameTime > 2000 ? gameTime -= 1000 : gameTime = 2000
                                    stopTimer()
                                }
                            }
                        }
                    })
                }
                else{
                    game.add.tween(obj).to({x: obj.spawnX, y: obj.spawnY},200,Phaser.Easing.linear,true)
                    if(timeAttack && lives !== 0){
                        dinamita.setAnimationByName(0, "lose", true)
                        dinamita.addAnimationByName(0, "idle", true)
                        missPoint(obj)
                        sound.play("wrong")
                    }
                }
            }
            else{
                game.add.tween(obj).to({x: obj.spawnX, y: obj.spawnY},200,Phaser.Easing.linear,true)
            }
        }
    }
    
    function restartAssets(){
        
        dinamita.addAnimationByName(0, "idle", true)
        sound.play("rightChoice")
        
        if(pointsBar.number === 18){
            timeAttack = true
            game.add.tween(timerGroup).to({alpha: 1}, 200, Phaser.Easing.linear, true)
        }
        
        if(tutorial){
            tutoCount++
            initTuto()
        }
        else{
            foodCount = 0
            foodGroup.setAll("inputEnabled", false)
            for(var i = 0; i < bodyParts.length; i++){
                bodyParts[i].used = false
            }
            level < 4 ? level++ : level = 4
            
            game.time.events.add(500,initGame)
        }
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds()
        var boundsB = spriteB.getBounds()

        return Phaser.Rectangle.intersects(boundsA , boundsB )
    }
    
    function initGame(){
        
        var delay = 200
       
        var pos = []
        
        for(var i = 0; i < level; i++){
            if(i === 2){
                var rand = game.rnd.integerInRange(2, 3)
                fadeIn(bodyParts[rand].img, delay, 1)
                pos[i] = bodyParts[rand].tag
                
                if(level === 4){
                    fadeIn(bodyParts[4].img, delay, 1)
                    pos[pos.length] = bodyParts[4].tag
                }
                break
            }
            else{
                fadeIn(bodyParts[i].img, delay, 1)
                pos[i] = bodyParts[i].tag
            }
            delay += 200
        }
        
        delay += 1000
        
        Phaser.ArrayUtils.shuffle(pos)
        
        for(var i = 0; i < level; i++){
           
            if(pos[i] === 2){
                foodGroup.children[i].loadTexture("atlas.anatomeal", "food2opt" + game.rnd.integerInRange(0, 1))
                foodGroup.children[i].tag = pos[i]
            }
            else{
                foodGroup.children[i].loadTexture("atlas.anatomeal", "food" + pos[i])
            }
            foodGroup.children[i].tag = pos[i]
            popUp(foodGroup.children[i], delay)
            foodGroup.children[i].inputEnabled = true
            delay += 200
        }
        
        game.time.events.add(delay,function(){
            gameActive = true
            if(timeAttack)
                startTimer(gameTime)
        })    
    }
    
    function initTuto(){
        
        if(tutoCount < bodyParts.length){
            
            if(tutoCount === 3){
                foodCount--
                foodGroup.children[foodCount].loadTexture("atlas.anatomeal", "food2opt1")
            }
            
            fadeIn(bodyParts[tutoCount].img, 200, 1)
            popUp(foodGroup.children[foodCount],1200)
            foodGroup.children[foodCount].inputEnabled = true
            foodCount++
        }
        else{
            tutorial = false
            foodGroup.setAll("inputEnabled", false)
            for(var i = 0; i < bodyParts.length; i++){
                bodyParts[i].used = false
            }
            foodCount = 0
            initGame()
        }
        gameActive = true
    }
    
    function fadeIn(obj,delay,alpha){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            game.add.tween(obj).to({alpha: alpha},1000,Phaser.Easing.linear,true)
        },this)
    } 
    
    function popUp(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("pop")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x: 0, y:0},250,Phaser.Easing.linear,true)
        },this)
    } 
    
	return {
		
		assets: assets,
		name: "anatomeal",
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
            createDinamita()
            positionTimer()
            createBoard()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()