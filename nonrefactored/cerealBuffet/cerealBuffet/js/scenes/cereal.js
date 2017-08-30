
var soundsPath = "../../shared/minigames/sounds/"
var cereal = function(){
    
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
                name: "atlas.cereal",
                json: "images/cereal/atlas.json",
                image: "images/cereal/atlas.png",
            },
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
			{	name: "bite",
				file: soundsPath + "bite.mp3"},
			{	name: "explode",
				file: soundsPath + "explode.mp3"},
			{	name: "brightTransition",
				file: soundsPath + "brightTransition.mp3"},
			{	name: "moleHit",
				file: soundsPath + "moleHit.mp3"},
			{	name: "bomb",
				file: soundsPath + "bomb.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 87
	var indexGame
    var overlayGroup
    var spaceSong
	var yogotar
	var door
	var nachos,sign
	var numberToAsk
	var moveFloor
	var nachoUse
	var wall
	var table
	var pixMove = 0
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		timeToUse = 10000
		moveFloor = false
		pixMove = 0
        
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
		
		if(timeToUse > 3000){
			timeToUse-= 1000
		}
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.cereal','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.cereal','life_box')

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
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 4000)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
		buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false;
        
        game.load.spine('door', "images/spines/door.json")  
		game.load.spine('yogotar', "images/spines/tono.json") 
        game.load.audio('spaceSong', soundsPath + 'songs/la_fiesta.mp3');
        
		game.load.image('howTo',"images/cereal/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/cereal/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/cereal/introscreen.png")
		
		console.log(localization.getLanguage() + ' language')
        
    }
    
    function createOverlay(){
        
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xffffff)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0
        rect.endFill()
		sceneGroup.add(rect)
		sceneGroup.whiteFade = rect
		
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
                
				overlayGroup.y = -game.world.height
				showScene()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.cereal','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.cereal',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.cereal','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		wall = game.add.tileSprite(-250,45,game.world.width * 10,475,'atlas.cereal','pasillo')
		wall.scale.x*=1.3
		wall.angle = -17
		sceneGroup.add(wall)
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0x6a17c2)
        rect.drawRect(0,game.world.height * 0.47,game.world.width, game.world.height * 0.6)
        rect.endFill()
		sceneGroup.add(rect)
		
		var bar = sceneGroup.create(-50,75,'atlas.cereal','columna')
		bar.angle = 75
		bar.anchor.setTo(0.5,1)
		
		background = game.add.tileSprite(-200,game.world.centerY + 35,game.world.width * 1.5,298,'atlas.cereal','tilefloor')
		background.origX = background.tilePosition.x
		background.tilePosition.x-= 150
		sceneGroup.add(background)
		
		background.angle = -17
		
		table = game.add.group()
		table.x = game.world.centerX
		table.y = game.world.height - 10
		table.posX = table.x
		table.posY = table.y
		sceneGroup.add(table)
		
		var tableImg = table.create(0,0,'atlas.cereal','mesa')
		tableImg.anchor.setTo(0.5,1)
		
		
	}
	
	function update(){
		
		if(moveFloor){
			background.tilePosition.x++
			wall.tilePosition.x+=0.25
			pixMove++
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

				particle.makeParticles('atlas.cereal',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.cereal','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.cereal','smoke');
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
		
		sound.play("cut")
		gameActive = false
		
		var tween = game.add.tween(obj.scale).to({x:0.7,y:0.7},200,"Linear",true)
		tween.yoyo(true,0)
		
		yogotar.number+= 1
		
		if(nachoUse.tween){
			nachoUse.tween.stop()
		}
		
		nachoUse.alpha = 1
		nachoUse.x = nachos.world.x
		nachoUse.y = nachos.world.y
		
		nachoUse.tween = game.add.tween(nachoUse).to({x:yogotar.x,y:yogotar.y,alpha:0},350,"Linear",true)
		nachoUse.tween.onComplete.add(function(){
			
			createPart('star',yogotar.pos)
			createTextPart('+1',yogotar.pos)
			gameActive = true
			
			sound.play("bite")
		})
		
	}
	
	function createYogotar(){
		
		yogotar = game.add.group()
		yogotar.x = game.world.centerX + 200
		yogotar.y = game.world.centerY
		yogotar.posX = yogotar.x
		yogotar.posY = yogotar.y
		yogotar.number = 0
		yogotar.alpha = 0
		sceneGroup.add(yogotar)
		
		var pos = yogotar.create(0,-50,'atlas.cereal','button')
		pos.anchor.setTo(0.5,0.5)
		pos.alpha = 0
		yogotar.pos = pos
		
		var anim = game.add.spine(0,0,'yogotar')
		anim.setSkinByName("normal")
		anim.setAnimationByName(0,"IDLE",true)
		anim.scale.setTo(1.7,1.7)
		yogotar.add(anim)
		
		yogotar.anim = anim
		
		var globeGroup = game.add.group()
		globeGroup.y = -325
		globeGroup.alpha = 0
		globeGroup.scale.setTo(0.8,0.8)
		yogotar.add(globeGroup)
		
		var globe = globeGroup.create(0,0,'atlas.cereal','globe')
		globe.anchor.setTo(0.5,0.5)
		
		var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, -25, "0", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
        globeGroup.add(pointsText)
		
		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
		
		yogotar.globe = globeGroup
		yogotar.text = pointsText

		door = game.add.spine(game.world.centerX - 100,game.world.centerY,'door')
		door.setSkinByName("normal")
		door.posX = door.x
		door.posY = door.y 
		door.alpha = 0
		door.scale.setTo(1.7,1.7)
		sceneGroup.add(door)
	}
	
	function createNachos(){
		
		nachos = table.create(0,-240,'atlas.cereal','bowl')
		nachos.anchor.setTo(0.5,0.5)
		nachos.alpha = 0
		nachos.inputEnabled = true
		nachos.events.onInputDown.add(inputButton)
		
		nachoUse = sceneGroup.create(0,0,'atlas.cereal','bowl')
		nachoUse.anchor.setTo(0.5,0.5)
		nachoUse.alpha = 0
		
	}
	
	function setNumbers(){
		
		yogotar.number = 0
		numberToAsk = game.rnd.integerInRange(2,10)
		
		yogotar.text.setText(numberToAsk)
		
	}
	
	function showScene(){
		
		yogotar.x = yogotar.posX
		yogotar.y = yogotar.posY
		yogotar.alpha = 1
		yogotar.anim.setAnimationByName(0,"WALK",true)
		
		setNumbers()
		
		game.add.tween(yogotar).from({x:game.world.width + 100,y:yogotar.y - 150},1000,"Linear",true).onComplete.add(function(){
			
			yogotar.anim.setAnimationByName(0,"IDLE",true)
			
			var delay = 500
			var animList = [yogotar.globe,nachos]
			for(var i = 0; i < animList.length;i++){
				var obj = animList[i]
				popObject(obj,delay)
				delay += 250
			}
			
			game.time.events.add(delay, function(){
				
				gameActive = true
				yogotar.anim.setAnimationByName(0,"WALK",true)
				yogotar.tween = game.add.tween(yogotar).to({x:game.world.centerX - 200,y:game.world.centerY+100},timeToUse,"Linear",true)
				yogotar.tween.onComplete.add(function(){
					
					yogotar.anim.setAnimationByName(0,"IDLE",true)
					if(yogotar.number == numberToAsk){
						
						addPoint(5)
						createPart('star',yogotar.pos)
						
						showGood(true)
					}else{
						
						missPoint()
						showGood(false)

					}
				})
			})
			
		})
		
	}
	
	function whiteFade(){
		
		sceneGroup.whiteFade.alpha = 1
		game.add.tween(sceneGroup.whiteFade).to({alpha:0},500,"Linear",true)
		
		background.tilePosition.x-=pixMove
		wall.tilePosition.x-= pixMove * 0.25
		pixMove = 0
	}
	
	function showGood(win){
		
		gameActive = false
		yogotar.anim.setAnimationByName(0,"WALK",true)
		moveFloor = true
		
		game.add.tween(yogotar).to({x:game.world.centerX + 100,y:game.world.centerY + 25},1000,"Linear",true)
		game.add.tween(table).to({x:game.world.width + 400,y:table.y - 200},1000,"Linear",true)
		
		game.add.tween(nachos).to({alpha:0},500,"Linear",true)
		
		door.alpha = 1
		door.x = door.posX
		door.y = door.posY
		door.setAnimationByName(0,"LOSE",false)
		
		game.add.tween(door).from({x:-200,y:door.y + 125},1000,"Linear",true).onComplete.add(function(){
			
			moveFloor = false
			yogotar.anim.setAnimationByName(0,"IDLE",true)
		})
		
		var delay = 1500
		
		game.time.events.add(delay,function(){
			
			if(win){
				
				whiteFade()
				game.add.tween(yogotar.globe).to({alpha:0},500,"Linear",true)
				sound.play("brightTransition")
				yogotar.anim.setAnimationByName(0,"WIN",false)
				yogotar.anim.addAnimationByName(0,"IDLE",true)
				
				game.time.events.add(1000,function(){
					
					sound.play("explode")
					door.setAnimationByName(0,"WIN",false)
					
					createPart('smoke',yogotar.pos, - 150)
					
					game.add.tween(door).to({alpha:0,x:door.x + 300,y:door.y - 100},600,"Linear",true,1000)
					
					game.time.events.add(1000,function(){
						
						yogotar.anim.setAnimationByName(0,"WALK",true)
						moveFloor = true
						
						game.add.tween(yogotar).to({x:game.world.width +100,y:yogotar.posY - 150},1000,"Linear",true)
						
						table.x = table.posX
						table.y = table.posY
						game.add.tween(table).from({x:-400,y:table.y + 250},1000,"Linear",true).onComplete.add(function(){
							
							moveFloor = false
							showScene()
						})
					})
					
				})
			}else{
				
				whiteFade()
				sound.play("brightTransition")
				yogotar.anim.setAnimationByName(0,"LOSE",false)
				yogotar.anim.addAnimationByName(0,"LOSESTILL",true)
				
				game.time.events.add(1000,function(){
					
					createPart('wrong',yogotar.pos,-100)
					sound.play("bomb")
					sound.play("moleHit")
					door.setAnimationByName(0,"LOSE",false)
					game.add.tween(door).to({x:door.x - 50,y:door.y+25},500,"Linear",true)
				})
			}
		})
		
	}
	
	return {
		
		assets: assets,
		name: "cereal",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			yogomeGames.mixpanelCall("enterGame",gameIndex);
			
			createBackground()
			createYogotar()
			createNachos()
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