
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var rockOrama = function(){
    
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
                name: "atlas.rockOrama",
                json: "images/rockOrama/atlas.json",
                image: "images/rockOrama/atlas.png",
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
				file:"images/rockOrama/gametuto.png"
			},
            {
				name:'backLigth',
				file:"images/rockOrama/backLigth.png"
			},
            {
				name:'courtine',
				file:"images/rockOrama/courtine.png"
			}

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "error",
				file: soundsPath + "wrong.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "smallWin",
				file: soundsPath + "smallWin.wav"},
            {	name: "winBreak",
				file: soundsPath + "winBreak.mp3"},
            {	name: "bass",
				file: soundsPath + "bass.wav"},
            {	name: "drumkit",
				file: soundsPath + "drumkit.wav"},
            {	name: "electricGuitar",
				file: soundsPath + "electricGuitar.mp3"},
            {	name: "synth",
				file: soundsPath + "synth.wav"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'rockSong',
                file: soundsPath + 'songs/funky_monkey.mp3'
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
				name:"drumkit",
				file:"images/spines/drumkit/drumkit.json"
			},
			{
				name:"bass",
				file:"images/spines/bass/bass.json"
			},
            {
				name:"electricGuitar",
				file:"images/spines/guitar/guitar.json"
			},
            {
				name:"synth",
				file:"images/spines/synth/synth.json"
			},
            {
				name:"speaker",
				file:"images/spines/speaker/speaker.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 170
    var tutoGroup
    var rockSong
    var coin
    var instrumentsGroup
    var buttonsGroup
    var speakerGroup
    var coneLigth
    var index
    var level
    var correctAnswer = []
    var hand
    var tutorial = true
    var courtinesGroup
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        index = 0
        level = 3
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.rockOrama','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.rockOrama','life_box')

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
        rockSong.stop()
        		
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
        
        var back = sceneGroup.create(0, 0, "atlas.rockOrama", "back")
        back.width = game.world.width
        back.height = game.world.height
        
        var backLigth = sceneGroup.create(0, 0, "backLigth")
        backLigth.scale.setTo(1, 0.7)
        backLigth.width = game.world.width
            
        sceneGroup.add(game.add.tileSprite(0, backLigth.height, game.world.width, game.world.centerY + 60, "atlas.rockOrama", "tile"))
        
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, 45, "atlas.rockOrama", "top"))
       
        var bottom = sceneGroup.create(-5, game.world.height - 50, "atlas.rockOrama", "bottom")
        bottom.anchor.setTo(0, 1)
        bottom.width = game.world.width + 10
        
        var stage = sceneGroup.create(game.world.centerX, game.world.centerY - 100, "atlas.rockOrama", "stage")
        stage.anchor.setTo(0.5)
        
        speakerGroup = game.add.group()
        sceneGroup.add(speakerGroup)
        
        var pivotX = 0.5
        var pivotY = 1
        
        for(var i = 0; i < 4; i++){
            
            var speaker = game.add.spine(stage.centerX * pivotX, stage.centerY * pivotY, "speaker")
            //anim.scale.setTo(0.5)
            speaker.setAnimationByName(0, "idle", true)
            speaker.setSkinByName("normal")
            speakerGroup.add(speaker) 
            
            pivotY += 0.5
            if(i == 1){
                pivotX++ 
                pivotY = 1
            }
        }
        speakerGroup.children[1].x -= 60
        speakerGroup.children[2].scale.setTo(-1, 1)
        speakerGroup.children[3].x += 60
        speakerGroup.children[3].scale.setTo(-1, 1)
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
        particle.makeParticles('atlas.rockOrama',key);
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

				particle.makeParticles('atlas.rockOrama',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.rockOrama','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.rockOrama','smoke');
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
	
	function initCoin(){
        
        coin = game.add.sprite(0, 0, "coin")
        coin.anchor.setTo(0.5)
        coin.scale.setTo(0.5)
        coin.animations.add('coin')
        coin.animations.play('coin', 24, true)
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
    
    function rockBand(){
        
        instrumentsGroup = game.add.group()
        sceneGroup.add(instrumentsGroup)  
         
        for(var i = 0; i < 4; i++)
        {
            var anim = game.add.spine(buttonsGroup.children[i].centerX, buttonsGroup.children[i].centerY + buttonsGroup.children[i].height * 0.5, assets.spines[i].name)
            anim.scale.setTo(0.5)
            anim.setAnimationByName(0, "IDLE", true)
            anim.setSkinByName("normal")
            instrumentsGroup.add(anim)
            buttonsGroup.children[i].song = i
        }
        
        coneLigth = sceneGroup.create(0, 0, "atlas.rockOrama", "coneLigth")
        coneLigth.anchor.setTo(0.5, 1)
        coneLigth.scale.setTo(1, 2)
    }
    
    function inputButtons(){
        
        buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)  
        
        var box = game.add.graphics(game.world.centerX - 75, game.world.centerY - 260)
        box.beginFill(0xFF3300)
        box.drawRect(0, 0, 150, 180)
        box.alpha = 0
        box.inputEnabled = false
        box.events.onInputDown.add(playASong, this)
        buttonsGroup.add(box)
        pivot += 0.6
        
        var pivot = 0.4
        
        for(var t = 0; t < 3; t++)
        {
            var box = game.add.graphics((game.world.centerX * pivot) - 75, game.world.centerY + 80)
            box.beginFill(0xFF3300)
            box.drawRect(0, 0, 150, 180)
            box.alpha = 0
            box.inputEnabled = false
            box.events.onInputDown.add(playASong, this)
            buttonsGroup.add(box)
            pivot += 0.6
        }
    }
    
    function playASong(box){
        
        if(tutorial && gameActive){
            
            instrumentsGroup.children[box.song].setAnimationByName(0, "PLAY", true)
            sound.play(assets.spines[box.song].name)
            index++
            if(index !== level)
                handPos()
            else{
                gameActive = false
                tutorial = false
                hand.destroy()
                buttonsGroup.setAll("inputEnabled", true)
                
                game.time.events.add(1000,function(){
                    coneLigth.y = 0
                    sound.play('winBreak')
                    for(var i = 0; i < instrumentsGroup.length; i++){
                        instrumentsGroup.children[i].setAnimationByName(0, "PLAY", false)
                        instrumentsGroup.children[i].addAnimationByName(0, "IDLE", true)
                    }
                },this)  
                
                
                game.time.events.add(3800,function(){
                    game.add.tween(courtinesGroup.children[0].scale).to({x:1}, 500, Phaser.Easing.linear,true)
                    game.add.tween(courtinesGroup.children[1].scale).to({x:1}, 500, Phaser.Easing.linear,true).onComplete.add(function(){
                        game.time.events.add(400,function(){
                            if(lives !== 0)
                                initGame()
                        },this)
                    })
                },this)
            }
        }
        else{
            if(gameActive && index <= level){

                coneLigth.x = box.centerX
                coneLigth.y = box.centerY + 100

                if(correctAnswer[index] === box.song){

                    instrumentsGroup.children[box.song].setAnimationByName(0, "PLAY", true)
                    index++
                    sound.play(assets.spines[box.song].name)
                    if(index === level)
                        rockMyWorld(true)
                }
                else{
                    sound.play('error')
                    instrumentsGroup.children[box.song].setAnimationByName(0, "WRONG", true)
                    rockMyWorld(false)
                }
            }
        }
    }
    
    function rockMyWorld(win){
        
        gameActive = false
        
        if(win){
            
            if(pointsBar.number !== 0 && pointsBar.number % 3 === 0){
                level++
            }
            
            game.time.events.add(1000,function(){
                coneLigth.y = 0
                sound.play('winBreak')
                addCoin()
                for(var i = 0; i < instrumentsGroup.length; i++){
                    instrumentsGroup.children[i].setAnimationByName(0, "PLAY", false)
                    instrumentsGroup.children[i].addAnimationByName(0, "IDLE", true)
                }
                for(var i = 0; i < speakerGroup.length; i++){
                    speakerGroup.children[i].setAnimationByName(0, "play", true)
                }
            },this)  
        }
        else{
            coneLigth.y = 0
            game.time.events.add(1000,function(){
                sound.play('smallWin')
                missPoint()
                for(var i = 0; i < instrumentsGroup.length; i++){
                    instrumentsGroup.children[i].setAnimationByName(0, "WRONG", false)
                    instrumentsGroup.children[i].addAnimationByName(0, "IDLE", true)
                }
            },this)
        }
        
        game.time.events.add(3800,function(){
            game.add.tween(courtinesGroup.children[0].scale).to({x:1}, 500, Phaser.Easing.linear,true)
            game.add.tween(courtinesGroup.children[1].scale).to({x:1}, 500, Phaser.Easing.linear,true).onComplete.add(function(){
                for(var i = 0; i < speakerGroup.length; i++){
                    speakerGroup.children[i].setAnimationByName(0, "idle", true)
                }
                game.time.events.add(400,function(){
                    if(lives !== 0)
                        initGame()
                },this)
            })
        },this)
    }
    
    function initGame(){
        
        var delay = 500
        index = 0
        
        game.add.tween(courtinesGroup.children[0].scale).to({x:0}, delay,Phaser.Easing.linear,true)
        game.add.tween(courtinesGroup.children[1].scale).to({x:0}, delay,Phaser.Easing.linear,true).onComplete.add(function(){
            
            for(var i = 0; i < level; i++){
                
                correctAnswer[i] = game.rnd.integerInRange(0, 3)
                playDemo(correctAnswer[i], delay)
                delay += 1000
            }
            
            if(level > 5){
                game.time.events.add(delay + 100,function(){
                    delay += changePositions()
                },this)
            }
            
            game.time.events.add(delay + 100,function(){
                coneLigth.y = 0
                gameActive = true
                if(tutorial)
                    handPos()
            },this)
        })
    }
    
    function playDemo(i, delay){
        
            game.time.events.add(delay,function(){
            
                coneLigth.x = buttonsGroup.children[i].centerX
                coneLigth.y = buttonsGroup.children[i].centerY + 110
                game.add.tween(instrumentsGroup.children[i].scale).to({x:0.9, y:0.9}, 300,Phaser.Easing.linear,true).onComplete.add(function(){
                    sound.play(assets.spines[buttonsGroup.children[i].song].name)
                    game.add.tween(instrumentsGroup.children[i].scale).to({x:0.5, y:0.5}, 300,Phaser.Easing.linear,true)
                })
                instrumentsGroup.children[i].setAnimationByName(0, "PLAY", false)
                instrumentsGroup.children[i].addAnimationByName(0, "IDLE", true)
        },this)    
    }
    
    function handPos(){
        
        hand.alpha = 1
        hand.x = buttonsGroup.children[correctAnswer[index]].centerX
        hand.y = buttonsGroup.children[correctAnswer[index]].centerY 
        
        coneLigth.x = buttonsGroup.children[correctAnswer[index]].centerX
        coneLigth.y = buttonsGroup.children[correctAnswer[index]].centerY + 100
        
        buttonsGroup.setAll("inputEnabled", false)
        buttonsGroup.children[correctAnswer[index]].inputEnabled = true
    }
    
    function createCourtines(){
        
        courtinesGroup = game.add.group()
        sceneGroup.add(courtinesGroup)
        
        for(var i = 0; i < 2; i++){
            
            var court = game.add.tileSprite(game.world.width * i, 0, game.world.centerX, game.world.centerY + 343, "courtine")
            court.anchor.setTo(i, 0)
            courtinesGroup.add(court)
        }
    }
    
    function changePositions(){

        var delay = 500
        var rand = game.rnd.integerInRange(1, 3)
        
        game.add.tween(courtinesGroup.children[0].scale).to({x:1}, delay, Phaser.Easing.linear,true)
        game.add.tween(courtinesGroup.children[1].scale).to({x:1}, delay, Phaser.Easing.linear,true).onComplete.add(function(){
            
            scramble(rand)
            game.time.events.add(delay + 300,function(){
                game.add.tween(courtinesGroup.children[0].scale).to({x:0}, 500, Phaser.Easing.linear,true)
                game.add.tween(courtinesGroup.children[1].scale).to({x:0}, 500, Phaser.Easing.linear,true)
            },this)
        })
        
        return delay 
    }
    
    function scramble(opt){
                 
        var aux = buttonsGroup.children[opt].x
        
        switch(opt){
                
            case 1:
                for(var i = 1; i < 3; i++){
                    buttonsGroup.children[i].x = buttonsGroup.children[i+1].x
                    instrumentsGroup.children[i].x = buttonsGroup.children[i].centerX
                }
                buttonsGroup.children[3].x = aux
                instrumentsGroup.children[3].x = buttonsGroup.children[3].centerX
            break
            
            case 2:
                buttonsGroup.children[2].x = buttonsGroup.children[1].x
                instrumentsGroup.children[2].x = buttonsGroup.children[2].centerX
                
                buttonsGroup.children[1].x = aux
                instrumentsGroup.children[1].x = buttonsGroup.children[1].centerX
            break
            
            case 3:
                for(var i = 3; i > 1; i--){
                    buttonsGroup.children[i].x = buttonsGroup.children[i-1].x
                    instrumentsGroup.children[i].x = buttonsGroup.children[i].centerX
                }
                buttonsGroup.children[1].x = aux
                instrumentsGroup.children[1].x = buttonsGroup.children[1].centerX
            break
        }
    }
	
	return {
		
		assets: assets,
		name: "rockOrama",
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
                        			
            /*rockSong = game.add.audio('rockSong')
            game.sound.setDecodedCallback(rockSong, function(){
                rockSong.loopFull(0.6)
            }, this);*/
            
            initialize()
            rockSong = sound.play("rockSong", {loop:true, volume:0.2})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			         
            inputButtons()
            rockBand()
            initCoin()
            createCourtines()
            createPointsBar()
			createHearts()
            createParticles()
			
			buttons.getButton(rockSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()