
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var circus = function(){
    
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
                name: "atlas.circus",
                json: "images/circus/atlas.json",
                image: "images/circus/atlas.png",
            },

        ],
        images: [
			{   name:"background",
				file: "images/circus/fondo.png"},
		],
		jsons: [
			{
				name: 'pickedEnergy', 
				file: 'particles/battle/pickedEnergy/specialBar1.json'
			},
			{
				name: 'fireFloor', 
				file: 'particles/battle/fireFloor/fireFloor1.json'
			}
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "flesh",
				file: soundsPath + "flesh.mp3"},
			{	name: "punch",
				file: soundsPath + "punch1.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background,floor
	var base, buttonsGroup, yogotar
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 38
	var indexGame
	var result
    var overlayGroup
    var spaceSong
	var timerGroup
	var numLimit, timeToUse
	var clickLatch = false
	
	var numberOptions = [3,4,6]
	
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){
        game.stage.backgroundColor = "#ffffff"
        lives = 1
		numLimit = 5
		timeToUse = 1250
        
		loadSounds()
	}

    function popObject(obj,delay,appear){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
			if(appear){

				obj.alpha = 1
            	game.add.tween(obj.scale).from({x:0, y:0},250,Phaser.Easing.linear,true)
			}else{
				game.add.tween(obj.scale).to({x:0,y:0},250,"Linear",true).onComplete.add(function(){
					obj.scale.setTo(1,1)
					obj.alpha = 0
				})
			}
            
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
		
		if(pointsBar.number % 3 == 0){
			if(numLimit < 9){
				numLimit++
				timeToUse-=100
			}
		}
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.circus','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.circus','life_box')

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
		
		yogotar.setAnimationByName(0,"LOSE",false)
		
		var obj = sceneGroup.create(yogotar.x, yogotar.y- 50,'atlas.circus','star')
		obj.anchor.setTo(0.5,0.5)
		obj.alpha = 0

		createPart('smoke',obj)
		
		game.time.events.add(500,function(){
			sound.play("flesh")
			
		})
		
		game.time.events.add(750,function(){
			sound.play("punch")
		})
		
        gameActive = false
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2200)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        game.stage.disableVisibilityChange = false;

        
        game.load.spine('yogotar', "images/spines/skeleton.json")  
        game.load.audio('spaceSong', soundsPath + 'songs/circus_gentlejammers.mp3');
        
		/*game.load.image('howTo',"images/circus/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/circus/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/circus/introscreen.png")*/

		epicparticles.loadEmitter(game.load, "pickedEnergy")
		epicparticles.loadEmitter(game.load, "fireFloor")
		
		game.load.image('tutorial_image',"images/circus/tutorial_image.png")
		//loadType(gameIndex)

    }
    
	function showButtons(appear){
		
		var delay = 0
		for(var i = 0; i < buttonsGroup.length;i++){
			
			var button = buttonsGroup.children[i]
			if(appear){
				popObject(button,delay,appear)
			}else{
				popObject(button,delay,appear)
			}
			
			delay+= 100
			
		}
		
		if(appear){
			
			setOperation()
			
			game.time.events.add(delay,function(){
				gameActive = true
				
				timerGroup.number = 10
				timerGroup.text.setText(timerGroup.number)
				
				popObject(timerGroup,0,true)
				popObject(base.text,200,true)
				
				game.time.events.add(1000,setTimer)
			})
		}
	}
	
	function setTimer(){
		
		if(!gameActive){
			return
		}
		
		createTextPart('-1',timerGroup.text)
		
		timerGroup.number--
		timerGroup.text.setText(timerGroup.number)
		
		popObject(timerGroup,0,true)
		
		if(timerGroup.number < 1){
			missPoint()
		}else{
			if(gameActive){
				game.time.events.add(timeToUse,setTimer)
			}
		}
		
	}
	
	function setOperation(){
		
		var number1 = numberOptions[game.rnd.integerInRange(0,numberOptions.length - 1)]
		var number2 = game.rnd.integerInRange(2,numLimit)
		
		base.text.setText(number1 + ' X ' + number2)
		result = number1 * number2
		
		var index =  game.rnd.integerInRange(0,2)
		for(var i = 0; i < buttonsGroup.length;i++){
			
			var button = buttonsGroup.children[i]
			if(index == i){
				button.number = result
			}else{
				var number3 = number2
				while(number3 == number2){
					number3 = game.rnd.integerInRange(2,numLimit)
				}
				button.number = number1 * number3
				
			}
			
			button.text.setText(button.number)
		}
		
		popObject(button.text,0,true)
	}
	
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
        
        /*var rect = new Phaser.Graphics(game)
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
				showButtons(true)
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.circus','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)

		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.circus',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.circus','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
    	
		overlayGroup.y = -game.world.height
		showButtons(true)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width, 501,'background')
		sceneGroup.add(background)
		
		floor = game.add.tileSprite(0,background.height,game.world.width,497,'atlas.circus','fondo2')
		sceneGroup.add(floor)
	}
	
	
	function update(game){
		epicparticles.update()

		background.tilePosition.x--
		floor.tilePosition.x+= 0.6

		if (game.input.activePointer.isDown == true){
			if (clickLatch == false) {
				var emitter = epicparticles.newEmitter("pickedEnergy")
				emitter.x = game.input.activePointer.x
				emitter.y = game.input.activePointer.y
			}

			clickLatch = true
		} else {
			clickLatch = false
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
				
				//console.log(particle)
                
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
    
    function createPart(key,obj,offsetX){
        
        var offX = offsetX || 0
        var particle = lookParticle(key)
		
        if(particle){
            
            particle.x = obj.world.x + offX
            particle.y = obj.world.y
            particle.scale.setTo(1,1)
            //game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            //game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            particle.start(true, 1500, null, 6);
			
			game.add.tween(particle).to({alpha:0},500,"Linear",true,1000).onComplete.add(function(){
				deactivateParticle(particle,0)
			})
			
        }
        
        
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

				particle.makeParticles('atlas.circus',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.circus','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.circus','smoke');
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
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
		var parent = obj.parent
		
		sound.play("pop")
		
		var tween = game.add.tween(parent.scale).to({x:0.6,y:0.6},200,"Linear",true)
		tween.yoyo(true,0)
		
		gameActive = false
		
		if(parent.number == result){
			addPoint(1)
			createPart('star',obj)
			
			yogotar.setAnimationByName(0,"WIN",false)
			yogotar.addAnimationByName(0,"IDLE",true)
			game.time.events.add(1100,restartScene)
		}else{
			missPoint()
			createPart('wrong',obj)
		}
		
	}
	
	function restartScene(){
		
		showButtons(false)
		game.add.tween(timerGroup).to({alpha:0},300,"Linear",true)
		game.add.tween(base.text).to({alpha:0},300,"Linear",true,200)
		
		game.time.events.add(1000,function(){
			showButtons(true)
		})
		
	}
	
	function createBase(){
		
		base = game.add.group()
		base.x = game.world.centerX
		base.y = game.world.height - 25
		sceneGroup.add(base)
		
		var baseImg = base.create(0,0,'atlas.circus','base')
		baseImg.anchor.setTo(0.5,1)
		
		var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, -baseImg.height * 0.82, "3 X 5", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		pointsText.alpha = 0
        base.add(pointsText)
		
		base.text = pointsText
		
		yogotar = game.add.spine(game.world.centerX,game.world.height - 350,"yogotar")
		yogotar.setAnimationByName(0,"IDLE",true)
		yogotar.setSkinByName("normal")
		sceneGroup.add(yogotar)
	}
	
	function createButtons(){
		
		buttonsGroup = game.add.group()
		sceneGroup.add(buttonsGroup)
		
		var pivotX = base.x - 150
		var pivotY = base.y - 100
		for(var i = 0;i < 3; i++){
			
			var button = game.add.group()
			button.alpha = 0
			button.pressed = false
			button.x = pivotX
			button.y = pivotY
			buttonsGroup.add(button)
			
			var buttonImage = button.create(0,0,'atlas.circus','btn')
			buttonImage.anchor.setTo(0.5,0.5)
			buttonImage.inputEnabled = true
			buttonImage.events.onInputDown.add(inputButton)
			
			var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, 0,0, "0", fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			button.add(pointsText)
			
			button.text = pointsText
			
			pivotX+= button.width * 1.12
		}
		
	}
	
	function createTimer(){
		
		timerGroup = game.add.group()
		timerGroup.x = game.world.centerX - 200
		timerGroup.y = game.world.height - 335
		timerGroup.alpha = 0
		sceneGroup.add(timerGroup)
		
		var timerImg = timerGroup.create(0,0,'atlas.circus','time')
		timerImg.anchor.setTo(0.5,0.5)
		
		var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 35,-5, 10, fontStyle)
		pointsText.angle = -15
		pointsText.anchor.setTo(0.5,0.5)
		timerGroup.add(pointsText)
		
		timerGroup.number = 10
		timerGroup.text = pointsText
		
	}
	
	return {
		
		assets: assets,
		name: "circus",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createBase()
			createButtons()
			createTimer()
			addParticles()
                        			
            spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.6)
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
			
			buttons.getButton(spaceSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
	}
}()