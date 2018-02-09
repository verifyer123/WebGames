
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var port = function(){
    
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
                name: "atlas.port",
                json: "images/port/atlas.json",
                image: "images/port/atlas.png",
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
				file: soundsPath + "wrong.mp3"},
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "inflate",
				file: soundsPath + "inflateballoon.mp3"},
			{	name: "brake",
				file: soundsPath + "bird.mp3"},
			{	name: "wrongItem",
				file: soundsPath + "wrongItem.mp3"},
			
		],
    }
   
        
    var lives = null
	var sceneGroup = null
	var background, road
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
	var airPlane
    var gameIndex = 41
	var timeToUse
	var numLimit
	var result
	var indexGame
    var overlayGroup
    var spaceSong
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		timeToUse = 10000
		numLimit = 4
        
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
		
		if(pointsBar.number % 2 == 0){
			
			if(timeToUse > 2000){
				timeToUse-= 750
			}
			
			if(numLimit < 10){
				numLimit++
			}
		}
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.port','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.port','life_box')

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
		
		//yogotar.setAnimationByName(0,"LOSESTILL",true)
				
        gameActive = false
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 4000)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;
        
        game.load.spine('Oof', "images/spines/Oof.json")  
		game.load.spine('plane', "images/spines/avion.json")  
        game.load.audio('spaceSong', soundsPath + 'songs/funky_monkey.mp3');
		
		buttons.getImages(game)
        
		/*game.load.image('howTo',"images/port/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/port/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/port/introscreen.png")*/
		
		game.load.image('tutorial_image',"images/port/tutorial_image.png")
        loadType(gameIndex)

        
    }
    
	function showButtons(appear){
		
		var delay = 200
		
		popObject(operationGroup,delay,appear)
		
		for(var i = 0; i < buttonsGroup.length; i++){
			
			delay+= 200
			
			var button = buttonsGroup.children[i]
			popObject(button,delay,appear)
		}
		
		if(appear){
			game.time.events.add(delay,function(){
				gameActive = true
				
				var bar = clock.bar
				bar.scale.x = bar.origScale
				
				popObject(clock,0,true)
				
				bar.tween = game.add.tween(bar.scale).to({x:0},timeToUse,"Linear",true)
				bar.tween.onComplete.add(function(){
					missPoint()
					yogotar.setAnimationByName(0,"LOSESTILL",true)
				})
			})
		}
		
	}
	
	function setOperation(){
		
		var number1 = game.rnd.integerInRange(2,numLimit)
		var number2 = game.rnd.integerInRange(2,numLimit)
		
		operationGroup.text.setText(number1 + ' X ' + number2)
		result = number1 * number2
		
		var fResult = result
		while(fResult == result){
			fResult = number1 + game.rnd.integerInRange(2,numLimit)
		}
		
		var numList = [result,fResult]
		Phaser.ArrayUtils.shuffle(numList)
		
		for(var i = 0; i < buttonsGroup.length; i++){
			
			var button = buttonsGroup.children[i]
			button.text.setText(numList[i])
			button.number = numList[i]
		}
	}
	
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)
        
        createTutorialGif(overlayGroup,onClickPlay)

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
				setOperation()
				showButtons(true)
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.port','gametuto')
		tuto.scale.setTo(0.75,0.75)
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.port',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.port','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
        overlayGroup.y = -game.world.height
        setOperation()
        showButtons(true)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width,622,'atlas.port','cielo')
		sceneGroup.add(background)
		
		var mountains = sceneGroup.create(game.world.centerX, game.world.height - 615,'atlas.port','background')
		mountains.anchor.setTo(0.5,1)
		mountains.width = game.world.width
		
		road = game.add.tileSprite(0,game.world.height,game.world.width,643,'atlas.port','carretera')
		road.anchor.setTo(0,1)
		sceneGroup.add(road)
		
		road.tilePosition.x+= game.world.width * 0.15
		
		var line = sceneGroup.create(game.world.centerX,game.world.height,'atlas.port','linea')
		line.anchor.setTo(0.5,1)
		
	}
	
	function update(){
		
		background.tilePosition.x-= 0.4
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

				particle.makeParticles('atlas.port',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.port','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.port','smoke');
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
		
		gameActive = false
		var parent = obj.parent
		
		var tween = game.add.tween(parent.scale).to({x:0.7,y:0.7},250,"Linear",true,0,0)
		tween.yoyo(true,0)
		
		game.add.tween(clock).to({alpha:0},500,"Linear",true)
		
		var animName = "IDLE_L"
		
		if(obj.world.x > yogotar.x){
			animName = "IDLE_R"
		}
		
		yogotar.setAnimationByName(0,animName,true)
		
		if(parent.number == result){
			
			//yogotar.setAnimationByName(0,"WIN",true)
			
			addPoint(1)
			createPart('star',obj)
			
			if(clock.bar.tween){
				clock.bar.tween.stop()
			}
			
			getPlane(parent, true)
		}else{
			
			missPoint()
			createPart('wrong',obj)
			
			getPlane(parent, false)
		}
	}
	
	function getPlane(obj, win){
		
		airPlane.setAnimationByName(0,"WIN",true)
		
		airPlane.x = game.world.centerX
		airPlane.y = 150
		airPlane.scale.setTo(1,1)
		
		sound.play("inflate")
		
		game.add.tween(airPlane).to({alpha:1},1000,"Linear",true)
		game.add.tween(airPlane.scale).from({x:0,y:0},1000,"Linear",true).onComplete.add(function(){
			
			if(win){
				
				airPlane.setAnimationByName(0,"WIN",true)
				
				game.add.tween(airPlane.scale).to({x:1.3,y:1.3},1000,"Linear",true)
				game.add.tween(airPlane).to({x:obj.x,y:obj.y - 175},1000,"Linear",true).onComplete.add(function(){
					
					yogotar.setAnimationByName(0,"WIN",true)
					
					airPlane.setAnimationByName(0,"TO_LAND",true)
					
					game.time.events.add(500,function(){
						airPlane.setAnimationByName(0,"WIN",true)
					})
					
					sound.play("brake")
					createPart('smoke',obj.children[0],-120)
					game.add.tween(airPlane).to({y:game.world.height + 220},2000,"Linear",true).onComplete.add(function(){
						
						yogotar.setAnimationByName(0,"IDLE",true)
						showButtons(false)
						
						game.time.events.add(1000,function(){
							setOperation()
							showButtons(true)
						})
						
					})
				})
				
			}else{
				
				
				airPlane.setAnimationByName(0,"LOSE",true)
				
				game.add.tween(airPlane.scale).to({x:1.3,y:1.3},1000,"Linear",true)
				game.add.tween(airPlane).to({x:obj.x,y:obj.y - 175},1000,"Linear",true).onComplete.add(function(){
					
					yogotar.setAnimationByName(0,"LOSESTILL",true)
					sound.play("wrongItem")
					createPart('smoke',obj.children[0],-120)
					game.add.tween(airPlane).to({y:game.world.height + 200},2000,"Linear",true)
				})
			}
		})
	}
	
	function createYogotar(){
		
		yogotar = game.add.spine(game.world.centerX, game.world.height - 450,"Oof")
		yogotar.setAnimationByName(0,"IDLE",true)
		yogotar.setSkinByName("normal")
		yogotar.scale.setTo(1.2,1.2)
		sceneGroup.add(yogotar)
		
		airPlane = game.add.spine(game.world.centerX,100,"plane")
		airPlane.setAnimationByName(0,"WIN",true)
		airPlane.setSkinByName("normal")
		airPlane.alpha = 0
		sceneGroup.add(airPlane)
		
	}
	
	function createClock(){
        
        clock = game.add.group()
        clock.x = game.world.centerX
        clock.y = 100
		clock.alpha = 0
        sceneGroup.add(clock)
        
        var clockImage = clock.create(0,0,'atlas.port','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.port','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
        
        clock.bar = clockBar
        
    }
	
	function createButtons(){
		
		buttonsGroup = game.add.group()
		sceneGroup.add(buttonsGroup)
		
		var pivotX = game.world.centerX - 200
		for(var i = 0; i < 2 ; i++){
			
			var button = game.add.group()
			button.alpha = 0
			button.x = pivotX
			button.y = game.world.height - 150
			buttonsGroup.add(button)
			
			var imgButton = button.create(0,0,'atlas.port','boton_verde')
			imgButton.tint = 0x48c5ff
			imgButton.inputEnabled = true
			imgButton.anchor.setTo(0.5,0.5)
			imgButton.events.onInputDown.add(inputButton)
			
			var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, 0, -5, "0", fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			button.add(pointsText)
			
			pointsText.setShadow(3, 3, 'rgba(0,0,0,0.8)', 0);
			
			button.text = pointsText
			pivotX+=400
			
		}
	}
	
	function createOperation(){
		
		
		sceneGroup.remove(airPlane)
		sceneGroup.add(airPlane)
			
		operationGroup = game.add.group()
		operationGroup.x = game.world.centerX
		operationGroup.y = 230
		operationGroup.alpha = 0
		sceneGroup.add(operationGroup)
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRoundedRect(0,0,250, 125,30)
        rect.alpha = 0.8
        rect.endFill()
		rect.x-= rect.width * 0.5
		rect.y-= rect.height * 0.5
		operationGroup.add(rect)
		
		var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 2, "6 + 3", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		operationGroup.add(pointsText)
		
		operationGroup.text = pointsText
	}
	
	return {
		
		assets: assets,
		name: "port",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createYogotar()
			createClock()
			createButtons()
			createOperation()
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
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()