
var soundsPath = "../../shared/minigames/sounds/"
var bomb = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
			"square":"Square",
			"triangle":"Triangle",
			"diamond":"Rhombus",
			"rectangle":"Rectangle",
			"circle":"Circle",
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
			"square":"Cuadrado",
			"triangle":"Triángulo",
			"diamond":"Rombo",
			"rectangle":"Rectángulo",
			"circle":"Círculo",
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.bomb",
                json: "images/bomb/atlas.json",
                image: "images/bomb/atlas.png",
            },
        ],
        images: [
			{   name:"background",
				file: "images/bomb/fondo.png"},
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
			{	name: "drag",
				file: soundsPath + "drag.mp3"},
			{	name: "secret",
				file: soundsPath + "secret.mp3"},
			{	name: "brightTransition",
				file: soundsPath + "brightTransition.mp3"},
			{	name: "buzzer",
				file: soundsPath + "buzzer.mp3"},
			
		],
    }
    
	var figureNames = ['square','triangle','diamond','rectangle','circle']
        
    var lives = null
	var sceneGroup = null
	var whiteFade
	var background
    var gameActive = true
	var shoot
	var numbersToAdd
	var addFigures
	var timeToUse
	var particlesGroup, particlesUsed
    var gameIndex = 52
	var explosion
	var dragObj
	var figToUse
	var indexGame
    var overlayGroup
    var spaceSong
	var board, base, buttonsGroup
	var figuresGroup, containersGroup
	var usedContainers, usedFigures
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		numbersToAdd = 6
		figToUse = null
		timeToUse = 35000
        
        loadSounds()
        
	}

    function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x:0, y:0.01},250,Phaser.Easing.linear,true)
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
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.bomb','xpcoins')
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
		heartsGroup.scale.setTo(0.85,0.85)
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.bomb','life_box')

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
    
	function moveObject(group,timeX,times){
		
		var tween = game.add.tween(group).to({x:group.x + 5},timeX,"Linear",true,0,times)
		tween.yoyo(true,0)
		
	}
	
	function figuresLose(){
		
		//createPart('wrong',dragObj)
		
		dragObj.inputEnabled = false
		game.add.tween(figuresGroup).to({alpha:0},200,"Liner",true)
		
		for(var i = 0; i < usedFigures.length;i++){
			var fig = usedFigures.children[i]
			setAnimDelay(game.rnd.integerInRange(0,500),"LOSE",fig.anim)
		}
		
		moveObject(board,100,11)
		moveObject(usedFigures,100,11)
		moveObject(usedContainers,100,11)
		
		game.time.events.add(1200,function(){
			
			for(var i = 0; i < usedFigures.length;i++){
			
				var posX = game.world.width * 1.5
				var off = 1

				if(Math.random() * 2 < 1){
					posX = -game.world.width * 0.5
					off = -1
				}
				var posY = game.world.centerY + (game.rnd.integerInRange(0,300) * off)

				var fig = usedFigures.children[i]


				game.add.tween(fig).to({angle:fig.angle + 360, x: posX},400,"Linear",true)

			}


			sound.play("explosion")
			explosion.alpha = 1

			explosion.setAnimationByName(0,"EXPLOTION",false)

			game.add.tween(usedContainers).to({alpha:0},200,"Linear",true)
			game.add.tween(board).to({angle:360,alpha:0},500,"Linear",true)

			game.add.tween(explosion).to({alpha:0},500,"Linear",true,500)
			})
		
	}
	
    function stopGame(win){
        
		sound.play("wrong")
		sound.play("gameLose")
		sound.play("buzzer")
		
		figuresLose()
		
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
        
        game.load.spine('figure', "images/spines/figure.json")  
		game.load.spine('explosion',"images/spines/explotion.json")
        game.load.audio('spaceSong', soundsPath + 'songs/technology_action.mp3');
        
		game.load.image('howTo',"images/bomb/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/bomb/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/bomb/introscreen.png")
		
		console.log(localization.getLanguage() + ' language')
        
    }
    
	function getFigure(group,tag){
		
		for(var i = 0; i < group.length;i++){
			
			var obj = group.children[i]
			if(!obj.used && obj.tag == tag){
				return obj
			}
		}
	}
	
	function activateFigure(obj, posX, posY,groupR,groupA){
		
		obj.used = true
		obj.alpha = 1
		obj.x = posX
		obj.y = posY
		
		groupR.remove(obj)
		groupA.add(obj)
		
	}
	
	function deactivateFigure(obj,groupR,groupA){
		
		obj.used = false
		obj.alpha = 0
		obj.x = -200
		
		groupR.remove(obj)
		groupA.add(obj)
		
	}
	
	function checkList(number,list){
		
		var hasNumber = false
		
		for(var i = 0; i < list.length;i++){
			if(number == list[i]){
				return true
			}
		}
		
		return false
	}
	
	function setContainers(){
		
		var offset = 111
		
		addFigures = 0
		
		var pivotX, pivotY
		pivotY = board.y - board.height * 0.265
		
		var count = 0
		var addedFigures = 0
		
		var listToUse = []
		for(var i = 0; i < 20;i++){
			listToUse[i] = i
		}
		
		Phaser.ArrayUtils.shuffle(listToUse)
		
		var listUsed = []
		for(var i = 0; i < numbersToAdd;i++){
			listUsed[i] = listToUse[i]
		}
		
		for(var i = 0 ; i < 5; i++){
			
			Phaser.ArrayUtils.shuffle(figureNames)
			pivotX = board.x - board.width * 0.31
			
			for(var u = 0; u < 4; u++){
				
				var obj = getFigure(containersGroup,figureNames[u])
				activateFigure(obj,pivotX, pivotY,containersGroup,usedContainers)
				
				if(addedFigures <= numbersToAdd && checkList(count,listUsed)){
					
					obj.active = true
					addedFigures++
				}else{
					
					obj.active = false
					
					var fig = getFigure(figuresGroup,figureNames[u])
					activateFigure(fig,obj.x, obj.y,figuresGroup,usedFigures)
				}
				
				pivotX += offset
				count++
			}
			
			pivotY += offset        
		}
		
	}
	
	function getDragFigure(tag){
		
		if(!gameActive){
			return
		}
		
		Phaser.ArrayUtils.shuffle(figureNames)
		var tagToUse = tag || figureNames[0]
		
		figToUse = getFigure(figuresGroup,tagToUse)
		activateFigure(figToUse,dragObj.x, dragObj.y,figuresGroup,usedFigures)
		figToUse.alpha = 0
		popObject(figToUse,0)
		
		
	}
	
    function createOverlay(){
        
        overlayGroup = game.add.group()
        sceneGroup.add(overlayGroup)
        
		setContainers()
		
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
                
				overlayGroup.y = -game.world.height
				gameActive = true
				
				getDragFigure()
				setClock()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.bomb','gametuto')
		tuto.anchor.setTo(0.5,0.5)
		
		var fontStyle = {font: "18px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, game.world.centerX - 115, game.world.centerY + 15, localization.getString(localizationData,"triangle"), fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		overlayGroup.add(pointsText)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.bomb',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.bomb','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.bomb','fondo')
		sceneGroup.add(background)
		
	}
	
	function update(){
		
		background.tilePosition.x-= 1
		if(!gameActive){
			return
		}
		
		if(figToUse){
			
			figToUse.x = dragObj.x
			figToUse.y = dragObj.y
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

				particle.makeParticles('atlas.bomb',tag);
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
		
		explosion = game.add.spine(game.world.centerX,game.world.centerY,'explosion')
		explosion.setSkinByName('normal')
		explosion.alpha = 0
		sceneGroup.add(explosion)
		//createParticles('smoke',1)

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
		
        var exp = sceneGroup.create(0,0,'atlas.bomb','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.bomb','smoke');
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
		
		sound.play("pop")
		
		var parent = obj.parent
		
		if(parent.tween){
			parent.tween.stop()
		}
		
		parent.scale.setTo(1,1)
		
		parent.tween = game.add.tween(parent.scale).to({x:0.8,y:0.8},100,"Linear",true,0,0)
		parent.tween.yoyo(true,0)
		
		if(figToUse){
			
			deactivateFigure(figToUse,usedFigures,figuresGroup)
			getDragFigure(obj.tag)
		}
	}
	
	function createBoard(){
		
		board = sceneGroup.create(game.world.centerX, game.world.centerY - 110,'atlas.bomb','tablero1')
		board.anchor.setTo(0.5,0.5)
		
	}
	
	function createClock(){
        
		var topBar = sceneGroup.create(-10,-3,'atlas.bomb','franja')
		topBar.width = game.world.width * 1.2
		topBar.height*= 1.2
		
        clock = game.add.group()
		clock.alpha = 0
        clock.x = game.world.centerX
		clock.scale.setTo(0.85,0.85)
        clock.y = 65
        sceneGroup.add(clock)
        
        var clockImage = clock.create(0,0,'atlas.bomb','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.bomb','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
        
        clock.bar = clockBar
        
    }
	
	function createFigures(){
		
		containersGroup = game.add.group()
		sceneGroup.add(containersGroup)
		
		usedContainers = game.add.group()
		sceneGroup.add(usedContainers)
		
		figuresGroup = game.add.group()
		sceneGroup.add(figuresGroup)
		
		usedFigures = game.add.group()
		sceneGroup.add(usedFigures)
		
		for(var i = 0; i < figureNames.length;i++){
			
			for(var u = 0; u < 10; u++){
				
				var container = containersGroup.create(-200,0,'atlas.bomb',figureNames[i] + '_cont')
				container.tag = figureNames[i]
				container.used = false
				container.anchor.setTo(0.5,0.5)
				
				var figGroup = game.add.group()
				figGroup.x = -200
				figGroup.y = 0
				figGroup.used = false
				figGroup.tag = figureNames[i]
				figuresGroup.add(figGroup)
				
				var figSpine = game.add.spine(0,43,'figure')
				figSpine.setSkinByName(figureNames[i])
				setAnimDelay(game.rnd.integerInRange(0,500),"IDLE",figSpine)
				figGroup.add(figSpine)
				
				figGroup.anim = figSpine
				
			}
		}
	}
	
	function setAnimDelay(delay,animName, anim){
		
		game.time.events.add(delay, function(){
			anim.setAnimationByName(0,animName,true)
		})
	}
	
	function createButtons(){
		
		var baseButtons = sceneGroup.create(game.world.centerX, game.world.height, 'atlas.bomb', 'baseBotones')
		baseButtons.height*= 0.85
		baseButtons.anchor.setTo(0.5,1)
		
		buttonsGroup = game.add.group()
		sceneGroup.add(buttonsGroup)
		
		var pivotX = game.world.centerX - 200
		var pivotY = game.world.height - 200
		
		for(var i = 0; i < 5; i++){
			
			var button = game.add.group()
			button.x = pivotX
			button.y = pivotY
			buttonsGroup.add(button)
			
			var buttonImg = button.create(0,0,'atlas.bomb','boton')
			buttonImg.inputEnabled = true
			buttonImg.events.onInputDown.add(inputButton)
			buttonImg.tag = figureNames[i]
			buttonImg.anchor.setTo(0.5,0.5)
			
			var fontStyle = {font: "27px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, localization.getString(localizationData,figureNames[i]), fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			button.add(pointsText)
			
			pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
			
			pivotX += 400
			
			if((i+1) % 2 == 0){
				pivotX = game.world.centerX - 200
				pivotY += 85
			}
			
			if(i == 4){
				button.x = game.world.centerX
				button.y = game.world.height - 45
			}
			
		}
		
		base = game.add.group()
		base.x = game.world.centerX
		base.y = game.world.height - 160
		base.scale.setTo(0.8,0.8)
		sceneGroup.add(base)
		
		var baseImg = base.create(0,0,'atlas.bomb','BaseFiguras')
		baseImg.anchor.setTo(0.5,0.5)
		
		dragObj = sceneGroup.create(game.world.centerX, game.world.height - 160,'atlas.bomb','button')
		dragObj.anchor.setTo(0.5,0.5)
		dragObj.inputEnabled = true
		dragObj.initX = dragObj.x
		dragObj.initY = dragObj.y
		dragObj.input.enableDrag(true)
		dragObj.events.onDragStart.add(onDragStart, this);
		dragObj.events.onDragStop.add(onDragStop, this);
		dragObj.alpha = 0
		
	}
	
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	function onDragStart(obj){
		
		if(!gameActive){
			return
		}
		
		obj.dragEnabled = false
		sound.play("drag")
		
	}
	
	function hideFigure(fig, delay, groupR, groupA){
		
		game.time.events.add(delay, function(){
			
			game.add.tween(fig).to({alpha:0},200,"Linear",true).onComplete.add(function(){
				deactivateFigure(fig,groupR,groupA)
			})
		})
	}
	
	function restartBoard(){
		
		sound.play("secret")
		
		var delay = 50
		
		for(var i = 0; i < usedFigures.length;i++){
			
			var cont = usedFigures.children[i]
			hideFigure(cont,delay,usedFigures,figuresGroup)
			delay += 50
			
		}
		
		for(var i = 0; i < usedContainers.length;i++){
			
			var cont = usedContainers.children[i]
			hideFigure(cont,delay,usedContainers,containersGroup)
			delay += 50
			
		}
		
		delay+= 500
		game.time.events.add(delay,function(){
			
			gameActive = true
			
			setContainers()
			
			setClock()
			game.add.tween(usedContainers).from({alpha:0},500,"Linear",true)
			game.add.tween(usedFigures).from({alpha:0},500,"Linear",true,200).onComplete.add(function(){
				
				restartDrag()
				getDragFigure()
			})
			
			sound.play("brightTransition")
			
		})
		
	}
	
	function setClock(){
		
		popObject(clock,0)
		var bar = clock.bar
		bar.scale.x = bar.origScale
		
		clock.tween = game.add.tween(bar.scale).to({x:0},timeToUse,"Linear",true,500)
		
		clock.tween.onComplete.add(function(){
			missPoint()
		})
		
	}
	
	function restartDrag(){
		
		if(lives > 0){
			dragObj.x = dragObj.initX
			dragObj.y = dragObj.initY
			dragObj.inputEnabled = true
		}
		
	}
	
	function onDragStop(obj){
		
		if(!gameActive){
			return
		}
		
		sound.play("cut")
		obj.inputEnabled = false
		
		for(var i = 0; i < usedContainers.length;i++){
			
			var cont = usedContainers.children[i]
			
			if(cont.active){
			
				//console.log(cont.active + ' active, ' + addFigures + ' figures,' + numbersToAdd + ' numbersToAdd')
				if(checkOverlap(figToUse,cont) && figToUse.tag == cont.tag && addFigures < numbersToAdd){

					addFigures++
					
					addPoint(1)
					createPart('star',cont)
					gameActive = false

					game.add.tween(figToUse).to({x:cont.x,y:cont.y,angle:figToUse.angle + 360},500,"Linear",true).onComplete.add(function(){
						
						figToUse = null

						if(addFigures < numbersToAdd){
							
							gameActive = true
							restartDrag()
							getDragFigure()
							
						}else{

							if(numbersToAdd < 19){
								numbersToAdd++
							}
							
							timeToUse-= 1000
							
							if(clock.tween){
								
								clock.tween.stop()
								game.add.tween(clock).to({alpha:0},500,"Linear",true,500)
							}
							
							restartBoard()
						}
					})

					return
				}
			}
			
		}
		game.add.tween(obj).to({x:obj.initX, y: obj.initY},250,"Linear",true).onComplete.add(function(){
			
			gameActive = true
			obj.inputEnabled = true
		})
		
	}
	
	return {
		
		assets: assets,
		name: "bomb",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			createBoard()
			createClock()
			createButtons()
			createFigures()
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