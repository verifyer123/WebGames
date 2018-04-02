
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var brainRail = function(){
    
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
                name: "atlas.brainRail",
                json: "images/brainRail/atlas.json",
                image: "images/brainRail/atlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        images: [
            {
				name:'board',
				file:"images/brainRail/board.png"
			},
            {
				name:'tutorial_image',
				file:"images/brainRail/gametuto.png"
			},
            {
				name:'handDown',
				file:"images/brainRail/handDown.png"
			},
            {
				name:'handUp',
				file:"images/brainRail/handUp.png"
			}

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "rolling",
				file: soundsPath + "rolling.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'branSong',
                file: soundsPath + 'songs/dancing_baby.mp3'
            }
		],
        spritesheets: [
            {   name: "coin",
                file: "images/spines/coin.png",
                width: 122,
                height: 123,
                frames: 12
            }
        ],
        spines:[
			{
				name:"arm",
				file:"images/spines/arm/arm.json"
			},
            {
				name:"eyes",
				file:"images/spines/eyes/eyes.json"
			},
            {
				name:"head",
				file:"images/spines/head/head.json"
			},
            {
				name:"leg",
				file:"images/spines/leg/leg.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 161
    var tutoGroup
    var branSong
    var coin
    var bodyGroup
    var buttonsGroup
    var signalGroup
    var stations = [{color: 'green', part: 'head', endX: 0, endY: 0, btnX: 0, btnY: 0},
                    {color: 'red', part: 'eyes', endX: 0, endY: 0, btnX: 0, btnY: 0},
                    {color: 'blue', part: 'arm', endX: 0, endY: 0, btnX: 0, btnY: 0},
                    {color: 'yellow', part: 'leg', endX: 0, endY: 0}]
    var rand
    var timeTravel
    var destiny
    var index
    var handsGroup
    var tuto
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        rand = -1
        timeTravel = 1600
        index = 0
        tuto = true
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.brainRail','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.brainRail','life_box')

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
        branSong.stop()
        		
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
        initTuto()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.brainRail', 'tile'))
        
        var board = sceneGroup.create(game.world.centerX, game.world.centerY + 30, 'board')
        board.anchor.setTo(0.5)
        board.scale.setTo(0.9)
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
        particle.makeParticles('atlas.brainRail',key);
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

				particle.makeParticles('atlas.brainRail',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.brainRail','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.brainRail','smoke');
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
       coin.scale.setTo(0.8)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0

    }

    function addCoin(objectBorn){
        
        coin.x = objectBorn.centerX
        coin.y = objectBorn.centerY
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
    
    function bodyParts(){
        
        bodyGroup = game.add.group()
        sceneGroup.add(bodyGroup)
        
        for(var i = 0; i < stations.length; i++){
            
            var body = game.add.spine(0, 0, stations[i].part)
            //body.scale.setTo(0.8)
            //body.setAnimationByName(0, "IDLE", true)
            body.setSkinByName("normal")
            bodyGroup.add(body)
        }
        
        bodyGroup.children[0].x = game.world.centerX -30    
        bodyGroup.children[0].y = game.world.centerY -100   
        
        bodyGroup.children[1].x = game.world.centerX + 100
        bodyGroup.children[1].y = game.world.height - 80
        
        bodyGroup.children[2].x = game.world.centerX + 70
        bodyGroup.children[2].y = game.world.centerY - 240
        
        bodyGroup.children[3].x = game.world.centerX + 190
        bodyGroup.children[3].y = game.world.centerY - 20
        
        for(var i = 0; i < stations.length; i++){
            
            stations[i].endX = bodyGroup.children[i].x
            stations[i].endY = bodyGroup.children[i].y
        }
    }
    
    function colorButtons(){
        
        buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        for(var i = 0; i < 3; i++){
            
            var subGroup = game.add.group()
            subGroup.yellow = 1
            buttonsGroup.add(subGroup)
            
            var btn = subGroup.create(0, 0, 'atlas.brainRail', stations[i].color + '_btn')
            btn.anchor.setTo(0.5)
            btn.inputEnabled = false
            btn.events.onInputDown.add(changeWay ,this)
            btn.tint = 0x505050 
            
            btn = subGroup.create(0, 0, 'atlas.brainRail', 'yellow_btn')
            btn.anchor.setTo(0.5)
            btn.alpha = 0
            btn.inputEnabled = false
            btn.events.onInputDown.add(changeWay ,this)
            btn.tint = 0x505050 
        }
        
        buttonsGroup.children[0].x = game.world.centerX - 135   
        buttonsGroup.children[0].y = game.world.centerY + 60  
        buttonsGroup.children[0].children[1].angle = 90
       
        buttonsGroup.children[1].x = game.world.centerX - 135
        buttonsGroup.children[1].y = game.world.centerY + 230
        
        buttonsGroup.children[2].x = game.world.centerX + 65
        buttonsGroup.children[2].y = game.world.centerY + 230
        
        for(var i = 0; i < stations.length - 1; i++){
            
            stations[i].btnX = buttonsGroup.children[i].x
            stations[i].btnY = buttonsGroup.children[i].y
        }
    }
    
    function changeWay(btn){
        
        if(gameActive){
            
            sound.play('pop')
            changeImage(btn.parent.yellow, btn.parent)
        
            btn.parent.yellow === 0 ? btn.parent.yellow = 1 : btn.parent.yellow = 0   
            
            if(tuto){
                buttonsGroup.children[index].setAll('inputEnabled', false)
                index++
                nextStep()
            }
        }
    }
    
    function batSiganl(){
        
        signalGroup = game.add.group()
        sceneGroup.add(signalGroup)
        
        for(var i = 0; i < stations.length; i++){
            
            var signal = signalGroup.create(stations[0].btnX, 240, 'atlas.brainRail', stations[i].color)
            signal.anchor.setTo(0.5)
            signal.alpha = 0
        }
    }
    
    function initGame(){
        
        startTour()
        gameActive = true
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 3)
        if(x === rand)
            return getRand()
        else
            return x     
    }
    
    function startTour(){
        
        rand = getRand()
        changeImage(rand, signalGroup)
        destiny = signalGroup.children[rand]
        destiny.x = stations[0].btnX 
        destiny.y = 240
        
        sound.play('pop')
        game.add.tween(destiny.scale).from({x: 0, y: 0}, 800, Phaser.Easing.linear, true).onComplete.add(function(){
            game.time.events.add(600,function(){
                changeDirection(0)
            })
        })
    }
    
    function changeDirection(state){
        
        sound.play('rolling')
        switch(state){
            case 0:
                game.add.tween(destiny).to({y: stations[0].btnY}, timeTravel, Phaser.Easing.linear, true).onComplete.add(function(){
                    buttonsGroup.children[0].yellow === 1 ? changeDirection(1) : changeDirection(2)   
                })
            break
            
            case 1:
                game.add.tween(destiny).to({x: stations[0].endX + 5}, 400, Phaser.Easing.linear, true).onComplete.add(function(){
                    game.add.tween(destiny).to({y: stations[0].endY + 5}, 800, Phaser.Easing.linear, true).onComplete.add(function(){
                        win(0)
                    })
                })
            break
            
            case 2:
                game.add.tween(destiny).to({y: stations[1].btnY}, timeTravel, Phaser.Easing.linear, true).onComplete.add(function(){
                    buttonsGroup.children[1].yellow === 1 ? changeDirection(3) : changeDirection(4)   
                })
            break
            
            case 3:
                game.add.tween(destiny).to({y: stations[1].endY - 30}, 600, Phaser.Easing.linear, true).onComplete.add(function(){
                    game.add.tween(destiny).to({x: stations[1].endX, y: stations[1].endY - 30}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                        win(1)
                    })
                })
            break
            
            case 4:
                game.add.tween(destiny).to({x: stations[2].btnX}, timeTravel, Phaser.Easing.linear, true).onComplete.add(function(){
                    buttonsGroup.children[2].yellow === 1 ? changeDirection(5) : changeDirection(6)   
                })
            break
            
            case 5:
                game.add.tween(destiny).to({y: stations[2].endY}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                    win(2)
                })
            break
            
            case 6:
                game.add.tween(destiny).to({x: stations[3].endX -15}, 400, Phaser.Easing.linear, true).onComplete.add(function(){
                    game.add.tween(destiny).to({y: stations[3].endY}, 800, Phaser.Easing.linear, true).onComplete.add(function(){
                        win(3)
                    })
                })
            break
        }
    }
    
    function win(ans){
        
        gameActive = false
        game.add.tween(destiny).to({alpha: 0}, 300, Phaser.Easing.linear, true)
        
        if(ans === rand){
            bodyGroup.children[rand].setAnimationByName(0, "IDLE", true)
            sound.play('rightChoice')
            addCoin(signalGroup.children[ans])
            particleCorrect.x = signalGroup.children[ans].x 
            particleCorrect.y = signalGroup.children[ans].y
            particleCorrect.start(true, 1200, null, 6)
            game.time.events.add(1300,function(){
                    bodyGroup.children[rand].addAnimationByName(0, "IDLE", false)
            })
        }
        else{
            missPoint()
        }
        
        if(pointsBar.number !== 0 && pointsBar.number % 5 === 0 && timeTravel > 200){
            timeTravel -= 200
        }
        
        for(var i = 0; i < buttonsGroup.length; i++){
            buttonsGroup.children[i].setAll('inputEnabled', true)
            changeImage(0, buttonsGroup.children[i])
        }
        buttonsGroup.setAll('yellow', 1)
        
        game.time.events.add(1500,function(){
            if(lives !== 0)
                initGame()
        })
    }
    
    function initTuto(){
        
        startTourTuto()
        gameActive = true
    }
    
    function initHand(){
        
        handsGroup = game.add.group()
        handsGroup.alpha = 0
        sceneGroup.add(handsGroup)
        
        var handUp = handsGroup.create(0, 0, 'handUp') // 0
        handUp.alpha = 0
        
        var handDown = handsGroup.create(0, 0, 'handDown') // 1
        handDown.alpha = 0
        
        handsGroup.tween = game.add.tween(handsGroup).to({y:handsGroup.y + 10}, 400, Phaser.Easing.linear, true)
            
        handsGroup.tween.onComplete.add(function(){
            
            changeImage(0, handsGroup)
            game.add.tween(handsGroup).to({y:handsGroup.y - 10}, 400, Phaser.Easing.linear, true).onComplete.add(function(){
                handsGroup.tween.start()
                changeImage(1, handsGroup)
            })
        })
    }
    
    function startTourTuto(){
        
        rand = 3
        changeImage(rand, signalGroup)
        destiny = signalGroup.children[rand]
        destiny.x = stations[0].btnX 
        destiny.y = 240
        index = 0
        //buttonsGroup.children[0].setAll('tint', 0x505050)
        
        sound.play('pop')
        game.add.tween(destiny.scale).from({x: 0, y: 0}, 800, Phaser.Easing.linear, true).onComplete.add(function(){
            game.time.events.add(600,function(){
                nextStep()
            })
        })
    }
    
    function nextStep(){
        
        sound.play('rolling')
        switch(index){
            case 0:
                game.add.tween(destiny).to({y: stations[0].btnY - 100}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                    handPos()
                })
            break

            case 1:
                game.add.tween(destiny).to({y: stations[1].btnY - 100}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
                    handPos()
                })
            break
            
            case 2:
                game.add.tween(destiny).to({y: stations[1].btnY}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
                    game.add.tween(destiny).to({x: stations[2].btnX - 100}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
                        handPos()
                    })
                })
            break
            
            case 3:
                tuto = false
                game.add.tween(destiny).to({x: stations[3].endX -15}, 400, Phaser.Easing.linear, true).onComplete.add(function(){
                    game.add.tween(destiny).to({y: stations[3].endY}, 800, Phaser.Easing.linear, true).onComplete.add(function(){
                        handsGroup.destroy()
                        sound.play('rightChoice')
                        bodyGroup.children[3].setAnimationByName(0, "IDLE", true)
                        particleCorrect.x = signalGroup.children[3].x 
                        particleCorrect.y = signalGroup.children[3].y
                        particleCorrect.start(true, 1200, null, 6)
                        gameActive = false
                        game.add.tween(destiny).to({alpha: 0}, 300, Phaser.Easing.linear, true)
                        
                        for(var i = 0; i < buttonsGroup.length; i++){
                            buttonsGroup.children[i].setAll('inputEnabled', true)
                            changeImage(0, buttonsGroup.children[i])
                        }
                        buttonsGroup.setAll('yellow', 1)
                        game.time.events.add(1500,function(){
                            bodyGroup.children[3].addAnimationByName(0, "IDLE", false)
                            initGame()
                        })
                    })
                })
            break
        }
    }
    
    function handPos(){
        
        handsGroup.alpha = 1
        handsGroup.setAll('x', buttonsGroup.children[index].centerX) 
        handsGroup.setAll('y', buttonsGroup.children[index].centerY) 
        
        buttonsGroup.children[index].setAll('tint', 0xffffff)
        buttonsGroup.children[index].setAll('inputEnabled', true)
    }
	
	return {
		
		assets: assets,
		name: "brainRail",
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
            
            initialize()
            branSong = sound.play("branSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            bodyParts()
            colorButtons()
            batSiganl()
            initCoin()
            initHand()
            createParticles()
			
			buttons.getButton(branSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()