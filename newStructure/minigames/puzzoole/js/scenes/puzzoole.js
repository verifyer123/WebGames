
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"
var puzzoole = function(){
    
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
                name: "atlas.puzzoole",
                json: "images/puzzoole/atlas.json",
                image: "images/puzzoole/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/puzzoole/timeAtlas.json",
                image: "images/puzzoole/timeAtlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
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
            {   name: 'gameSong',
                file: soundsPath + 'songs/childrenbit.mp3'
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
				name:"bear",
				file:"images/spines/bear/bear.json"
			},
            {
				name:"chicken",
				file:"images/spines/chicken/chicken.json"
			},
            {
				name:"croc",
				file:"images/spines/crocodile/crocodile.json"
			},
            {
				name:"fish",
				file:"images/spines/fish/fish.json"
			},
            {
				name:"frog",
				file:"images/spines/frog/frog.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 186
    var tutoGroup
    var gameSong
    var coin
    var hand
    var tile
    var board
    var animalsGroup
    var arrowGroup
    var animationsGroup
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
        gameTime = 9000
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.puzzoole','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.puzzoole','life_box')

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
		game.load.image('tutorial_image',"images/puzzoole/gametuto" + localization.getLanguage() + ".png")
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
            
        tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.puzzoole", "tile")
        sceneGroup.add(tile)
    }

	function update(){
        
        tile.tilePosition.x += 1
        tile.tilePosition.y += 1
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
        particle.makeParticles('atlas.puzzoole',key);
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

				particle.makeParticles('atlas.puzzoole',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.puzzoole','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.puzzoole','smoke');
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
        
        hand = game.add.sprite(0, 0, "hand")
        hand.animations.add('hand')
        hand.animations.play('hand', 24, true)
        hand.alpha = 0

    }

    function addCoin(){
        
        coin.x = game.world.centerX
        coin.y = game.world.centerY
        var time = 300

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function createBoard(){
        
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        board = sceneGroup.create(game.world.centerX, 130, "atlas.puzzoole", "board")
        board.scale.setTo(1, 0.8)
        board.anchor.setTo(0.5, 0)
        
        var name = new Phaser.Text(sceneGroup.game, 0, 70, "", fontStyle)
        name.anchor.setTo(0.5)
        name.scale.setTo(1, 1.2)
        //name.setText('')
        name.setShadow(0, 7, 'rgba(0,0,0,0.2)', 0)
        board.addChild(name)
        board.text = name
        
        if(localization.getLanguage() === 'EN'){
            var words = ["Mammals", "Birds", "Reptiles", "Fishes", "Amphibians"]
        }
        else{
            var words = ["Mamíferos", "Aves", "Reptiles", "Peces", "Anfibios"]
        }
        board.words = words
    }
    
    function createButtons(){
        
        var okBtn = sceneGroup.create(game.world.centerX, game.world.height - 30, "atlas.puzzoole", "okBtn")
        okBtn.anchor.setTo(0.5, 1)
        okBtn.inputEnabled = true
        okBtn.events.onInputDown.add(checkAnswer, this)
        
        arrowGroup = game.add.group()
        sceneGroup.add(arrowGroup)
    
        var pivot = 0.7
           
        for(var i = 0; i < 3; i++){
            
            var subGroup = game.add.group()
            arrowGroup.add(subGroup)
            
            var arrow = subGroup.create(game.world.centerX * 1.7, game.world.centerY * pivot, "atlas.puzzoole", "arrow")
            arrow.level = i
            arrow.anchor.setTo(0.5)
            arrow.plus = true
            arrow.inputEnabled = true
            arrow.events.onInputDown.add(slideImage, this)
            
            arrow = subGroup.create(game.world.centerX * 0.3, game.world.centerY * pivot, "atlas.puzzoole", "arrow")
            arrow.scale.setTo(-1, 1)
            arrow.anchor.setTo(0.5)
            arrow.level = i
            arrow.plus = false
            arrow.inputEnabled = true
            arrow.events.onInputDown.add(slideImage, this)
            
            pivot += 0.4
        }
    } 
    
    function slideImage(btn){
        
        if(gameActive){
        
            var section = animalsGroup.children[btn.level]
            
            if(btn.plus){
                if(section.tag < 4){
                    sound.play("cut")
                    gameActive = false
                    section.tag ++
                
                    var tweenScale = game.add.tween(btn.scale).to({x:0.6,y:0.6},100,Phaser.Easing.linear,true,0,0)
                    tweenScale.yoyo(true,0).onComplete.add(function(){
                        btn.scale.setTo(1)
                    })

                    changeImage(section.tag, section)
                    game.add.tween(section.children[section.tag].scale).from({x:0},200, Phaser.Easing.linear,true).onComplete.add(function(){
                        gameActive = true
                    })
                    
                    arrowGroup.children[btn.level].children[1].alpha = 1
                    if(section.tag === 4){
                        arrowGroup.children[btn.level].children[0].alpha = 0.5
                    }
                }
            }
            else{
                if(section.tag > 0){
                    sound.play("cut")
                    gameActive = false
                    section.tag --
                
                    var tweenScale = game.add.tween(btn.scale).to({x:-0.6,y:0.6},100,Phaser.Easing.linear,true,0,0)
                    tweenScale.yoyo(true,0).onComplete.add(function(){
                        btn.scale.setTo(-1, 1)
                    })

                    changeImage(section.tag, section)
                    game.add.tween(section.children[section.tag].scale).from({x:0},200, Phaser.Easing.linear,true).onComplete.add(function(){
                        gameActive = true
                    })
                    
                    arrowGroup.children[btn.level].children[0].alpha = 1
                    if(section.tag === 0){
                        arrowGroup.children[btn.level].children[1].alpha = 0.5
                    }
                }
            }
        }
    }
    
    function createAnimals(){
        
        animalsGroup = game.add.group()
        sceneGroup.add(animalsGroup)
        
        var pivot = 0.7
        
        for(var i = 0; i < 3; i++){
            
            subGroup = game.add.group()
            animalsGroup.add(subGroup)
            
            for(var j = 0; j < 5; j++){
                
                var part = subGroup.create(game.world.centerX, game.world.centerY * pivot, "atlas.puzzoole", assets.spines[j].name + i)
                part.anchor.setTo(0.5)
                part.scale.setTo(0.8)
                part.alpha = 0
                subGroup.tag = j
            }
            
            pivot += 0.4
        }
    }
    
    function createAnimations(){
        
        animationsGroup = game.add.group()
        sceneGroup.add(animationsGroup)
        
        for(var i = 0; i < 5; i++){
            var anim = game.add.spine(game.world.centerX, game.world.height - 150, assets.spines[i].name)
            anim.setAnimationByName(0, "win", true)
            anim.setSkinByName("normal")
            anim.alpha = 0
            animationsGroup.add(anim)
        }
    }
    
    function checkAnswer(btn){
        
        if(gameActive){
            
            if(timeAttack)
                stopTimer()
            
            gameActive = false
            sound.play("pop")
            
            var tweenScale = game.add.tween(btn.scale).to({x:0.6,y:0.6},100,Phaser.Easing.linear,true,0,0)
            tweenScale.yoyo(true,0).onComplete.add(function(){
                btn.scale.setTo(1)
            })
            
            var delay = 200
            
            for(var i = 0; i < animalsGroup.length; i++){
                giveOrTake(delay, animalsGroup.children[i])
                delay += 300
            }
            
            var ans
            
            for(var i = 0; i < animalsGroup.length; i++){
                
                if(animalsGroup.children[i].tag === rand){
                    ans = true
                }
                else{
                    ans = false
                    break
                }
            }
            
            game.time.events.add(delay + 100,function(){
                win(ans)
            })
        }
    }
    
    function giveOrTake(delay, obj){
        
        game.time.events.add(delay,function(){
            
            if(obj.tag === rand){
                sound.play("rightChoice")
                particleCorrect.x = obj.centerX
                particleCorrect.y = obj.centerY
                particleCorrect.start(true, 1200, null, 10)
            }
            else{
                sound.play("wrong")
                particleWrong.x = obj.centerX
                particleWrong.y = obj.centerY
                particleWrong.start(true, 1200, null, 10)
            }
        },this)
    }
    
    function win(ans){
            
        if(ans){
            addCoin()
            
            var delay = 2000
            for(var i = 0; i < animalsGroup.length; i++)
                game.add.tween(animalsGroup.children[i].children[rand]).to({alpha:0},250,Phaser.Easing.linear,true)
            game.add.tween(animationsGroup.children[rand]).to({alpha:1},250,Phaser.Easing.linear,true,0,0).yoyo(true, delay)
            delay += 500
            
            if(pointsBar.number > 10 && pointsBar.number % 2 === 0){
                gameTime > 4000 ? gameTime -= 1000 : gameTime = 4000
            }
        }
        else{
            missPoint()
        
            var delay = 200
            for(var i = 0; i < animalsGroup.length; i++){
                var tag = animalsGroup.children[i].tag
                popObject(animalsGroup.children[i].children[tag], delay, false)
                delay += 300
            }
        }
        
        if(pointsBar.number === 4){
            game.add.tween(timerGroup).to({alpha: 1}, 500, Phaser.Easing.linear, true)
            timeAttack = true
        }
        
        if(lives !== 0){
            game.time.events.add(delay + 100,function(){
                initGame()
            })
        }
    }
    
    function initGame(){
        
        rand = getRand(rand)
        board.text.setText(board.words[rand])
        
        var delay = 200
        
        for(var i = 0; i < animalsGroup.length; i++){
            var image = getRand(rand)
            popObject(animalsGroup.children[i].children[image], delay, true)
            animalsGroup.children[i].tag = image
            delay += 300
            
            arrowGroup.children[i].setAll("alpha", 1)
            if(image === 4){
                arrowGroup.children[i].children[0].alpha = 0.5
            }
            if(image === 0){
                arrowGroup.children[i].children[1].alpha = 0.5
            }
        }

        game.time.events.add(delay + 100,function(){
            gameActive = true
            if(timeAttack)
                startTimer(gameTime)
        },this)
    }
	
    function getRand(opt){
        var x = game.rnd.integerInRange(0, 4)
        if(x === opt)
            return getRand(opt)
        else
            return x     
    }
    
    function popObject(obj, delay, out){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            if(out)
                game.add.tween(obj.scale).from({ y:0},250,Phaser.Easing.linear,true)
            else
                game.add.tween(obj.scale).to({ y:0},250,Phaser.Easing.linear,true).onComplete.add(function(){
                    obj.alpha = 0
                    obj.scale.setTo(0.8)
                })
        },this)
    }
    
	return {
		
		assets: assets,
		name: "puzzoole",
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
            createBoard()
            createButtons()
            createAnimals()
            createAnimations()
            positionTimer()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()