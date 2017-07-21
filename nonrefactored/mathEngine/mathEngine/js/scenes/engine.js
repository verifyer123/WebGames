
var soundsPath = "../../shared/minigames/sounds/"
var engine = function(){
    
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
                name: "atlas.engine",
                json: "images/engine/atlas.json",
                image: "images/engine/atlas.png",
            },
        ],
        images: [
			{   name:"background",
				file: "images/engine/fondo.png"},
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
			{	name: "carGo",
				file: soundsPath + "carAcceleration.mp3"},
			{	name: "gear",
				file: soundsPath + "gear.mp3"},
			{	name: "drag",
				file: soundsPath + "drag.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 62
	var indexGame
    var overlayGroup
    var spaceSong
	var car, motorGroup
	var result
	var motorToUse
	var timeToUse
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		timeToUse = 17000

        
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
        
        var pointsText = lookParticle('textPart')
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
        
		sound.play("explosion")
		createPart('damaged',car.text)
		        
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
		
		if(timeToUse > 1000){
			timeToUse-= 1000
		}
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.engine','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.engine','life_box')

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
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;
        
        game.load.spine('car', "images/spines/car.json")  
		game.load.spine('motor',"images/spines/motor.json")
        game.load.audio('spaceSong', soundsPath + 'songs/funky_monkey.mp3');
        
		game.load.image('howTo',"images/engine/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/engine/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/engine/introscreen.png")
		
		console.log(localization.getLanguage() + ' language')
        
    }
    
	function showMotor(delay,obj,appear){
		
		game.time.events.add(delay,function(){
			
			if(appear){
				
				sound.play("cut")
				obj.alpha = 1
				obj.y = 0
				game.add.tween(obj).from({y:-500},500,"Linear",true)
			}else{
				
				sound.play("cut")
				game.add.tween(obj).to({y:obj.y - 500,alpha:0},500,"Linear",true)
			}
			
		})
	}
	
	function setNumbers(){
		
		var number1 = game.rnd.integerInRange(20,160)
		var number2 = game.rnd.integerInRange(10,number1 - 10)
		
		result = number1 - number2
		var index = game.rnd.integerInRange(0,2)
		
		car.text.setText(number1 + ' - ' + number2)
		
		for(var i = 0; i< motorGroup.length; i++){
			
			var motor = motorGroup.children[i]
			
			motor.number = result - (game.rnd.integerInRange(1,10))
			
			if(i == index){
				motor.number = result
			}
			
			motor.text.setText(motor.number)
		}
		
		car.setSkinByName('car' + game.rnd.integerInRange(1,3))
	}
	
	function showScene(show){
		
		var delay = 0
		if(show){
			
			setNumbers()
			
			for(var i = 0; i < motorGroup.length; i++){
				
				var motor = motorGroup.children[i]
				showMotor(delay,motor,true)
				
				delay+= 300
			}
			
			delay+= 200
			game.time.events.add(delay,function(){
				
				sound.play("carGo")
				
				car.alpha = 1
				game.add.tween(car).from({x:-200},1000,"Linear",true).onComplete.add(function(){
					
					car.setAnimationByName(0,"IDLE",true)
					popObject(clock,0)
					
					clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeToUse,"Linear",true)
					
					clock.tween.onComplete.add(function(){
						missPoint()
					})
					
					gameActive = true
					
				})

				car.setAnimationByName(0,"MOVE",true)
			})
			
		}else{
			
			sound.play("carGo")
			createPart('smoke',car.text,125)
			
			car.setAnimationByName(0,"MOVE",true)
			
			game.add.tween(car).to({x:game.world.width + 200},1000,"Linear",true).onComplete.add(function(){
				car.x = game.world.centerX
				car.alpha = 0
			})
			
			delay = 300
			for(var i = 0; i < motorGroup.length;i++){
				
				var motor = motorGroup.children[i]
				showMotor(delay,motor,false)
				delay+= 100
			}
		}
			
		
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
                
				showScene(true)
				overlayGroup.y = -game.world.height
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.engine','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.engine',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.engine','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = sceneGroup.create(0,0,'background')
		background.origWidth = background.width 
		background.width = game.world.width
		background.height = (background.width / background.origWidth) * background.height
		
		var floor = sceneGroup.create(0,game.world.height,'atlas.engine','base')
		floor.anchor.setTo(0,1)
		floor.width = game.world.width
		
		var floor2 = game.add.tileSprite(0,game.world.height -floor.height * 0.8,game.world.width,90,'atlas.engine','BaseCarros')
		floor2.anchor.setTo(0,1)
		sceneGroup.add(floor2)
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
				
				console.log(particle)
                
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
            
            particle.x = obj.world.x
            particle.y = obj.world.y + offX
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

				particle.makeParticles('atlas.engine',tag);
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
		createParticles('damaged',1)

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
		
        var exp = sceneGroup.create(0,0,'atlas.engine','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.engine','smoke');
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
		
		sound.play("drag")
		
		if(clock.tween){
			clock.tween.stop()
			clock.bar.scale.x = clock.bar.origScale
			
			game.add.tween(clock).to({alpha:0},500,"Linear",true)
		}
		
		gameActive = false
		
		var parent = obj.parent
		
		game.add.tween(parent).to({alpha:0},500,"Linear",true)
		
		if(result == parent.number){
			
			addPoint(1)
			createPart('star',obj)
			
			game.time.events.add(1000,showScene)
			
			game.time.events.add(3000,function(){
				showScene(true)
			})
			
		}else{
			
			createPart('wrong',obj)
			sound.play("wrong")
			
			game.time.events.add(1000,function(){
				
				missPoint()
				
				car.setAnimationByName(0,"LOSE",false)
				car.addAnimationByName(0,"LOSESTILL",true)
				
			})
			
		}
		
		motorToUse.text.setText(parent.number)
		motorToUse.x = obj.world.x
		motorToUse.y = obj.world.y
		motorToUse.alpha = 1
		
		sound.play("cut")
		
		game.add.tween(motorToUse).to({alpha:0},250,"Linear",true,250)
		game.add.tween(motorToUse).to({y:car.text.world.y,x:car.text.world.x},500,"Linear",true).onComplete.add(function(){
			sound.play("gear")

			var tween = game.add.tween(car.scale).to({x:1.2,y:1.2},100,"Linear",true,0,0)
			tween.yoyo(true,0)
		})
	}
	
	function createCar(){
		
		car = game.add.spine(game.world.centerX, game.world.height - 145,'car')
		car.setSkinByName('car1')
		car.setAnimationByName(0,"IDLE",true)
		car.alpha = 0
		sceneGroup.add(car)
		
		var slot = getSpineSlot(car, "empty")
		
		var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 0,0, "0", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		slot.add(pointsText)
		car.text = pointsText
		
		car.autoUpdateTransform()
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
	
	function createMotor(){
		
		motorGroup = game.add.group()
		sceneGroup.add(motorGroup)
		
		var pivotX = game.world.centerX - 200
		for(var i = 0; i < 3 ; i++){
			
			var motorG = game.add.group()
			motorG.alpha = 0
			motorG.x = pivotX
			motorGroup.add(motorG)
			
			var chain = motorG.create(0,0,'atlas.engine','chain')
			chain.anchor.setTo(0.5,0)
			
			var motor = motorG.create(0,chain.height,'atlas.engine','motor')
			motor.inputEnabled = true
			motor.events.onInputDown.add(inputButton)
			motor.alpha = 0
			motor.anchor.setTo(0.5,0.5)
			
			var anim = game.add.spine(motor.x, motor.y + 25,'motor')
			anim.setSkinByName('normal')
			anim.setAnimationByName(0,"IDLE",true)
			motorG.add(anim)
			
			var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, motor.x, motor.y + 45, "0", fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			motorG.add(pointsText)
			
			motorG.text = pointsText
			motorG.number = 0
			
			pivotX+= 200
		}
		
		motorToUse = game.add.group()
		motorToUse.alpha = 0
		sceneGroup.add(motorToUse)
		
		var anim = game.add.spine(0, 25,'motor')
		anim.setSkinByName('normal')
		anim.setAnimationByName(0,"IDLE",true)
		motorToUse.add(anim)

		var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 0,45, "0", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		motorToUse.add(pointsText)
		
		motorToUse.text = pointsText
		
	}
	
	function createClock(){
		
        clock = game.add.group()
		clock.alpha = 0
        clock.x = game.world.centerX
		clock.scale.setTo(0.85,0.85)
        clock.y = 65
		clock.alpha = 0
        sceneGroup.add(clock)
        
        var clockImage = clock.create(0,0,'atlas.engine','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.engine','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
        
        clock.bar = clockBar
        
    }
	
	return {
		
		assets: assets,
		name: "engine",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			createCar()
			createMotor()
			createClock()
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
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()