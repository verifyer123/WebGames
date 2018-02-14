
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var invader = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
			"multiple":"Multiple"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
			"multiple":"Múltiplo"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.invader",
                json: "images/invader/atlas.json",
                image: "images/invader/atlas.png",
            },
             {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }

        ],
        images: [
			{   name:"background",
				file: "images/invader/fondo.png"},
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "bomb",
				file: soundsPath + "bomb.mp3"},
			{	name: "powerup",
				file: soundsPath + "powerup.mp3"},
			{	name: "robotWhoosh",
				file: soundsPath + "robotWhoosh.mp3"},
			{	name: "shootBall",
				file: soundsPath + "shootBall.mp3"},
			
		],
    }
    
	var SPEED = 5
	var INITIAL_LIVES = 3
       
	var gameSpeed
    var lives = null
	var sceneGroup = null
	var background, stars
    var gameActive = true
	var characterGroup, baseGroup
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 47
	var canClock
	var indexGame
    var overlayGroup
	var shipGroup
    var spaceSong
	var timeToSpawn
	var moveLeft, moveRight
	var movingLeft
	var cursors
	var buttonPressed
	var rotatePlayer
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
		moveLeft = false
		moveRight = false
		buttonPressed = false
		timeToSpawn = 2500
		gameSpeed = SPEED
		canClock = false
		rotatePlayer = true
        
        loadSounds()
        
	}

    function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("pop")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x:0, y:0.01},250,Phaser.Easing.linear,true)
			game.add.tween(obj).from({angle:obj.angle-360},500,"Linear",true)
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
		
		if(timeToSpawn > 750){
			timeToSpawn-= 100
		}
		
		if(gameSpeed > 1){
			 gameSpeed+= 0.4
		 }
		
		if(pointsBar.number % 4 == 0){
			
			
			setNumber()
			sound.play("robotWhoosh")
			
		}else if(pointsBar.number % 5 == 0){
			
			upBar()
		}
        
    }
	
	function upBar(){
		
		sound.play("robotWhoosh")
		game.add.tween(baseGroup).to({y:baseGroup.y - 100},500,"Linear",true)
		
		game.time.events.add(6000,function(){
			
			sound.play("robotWhoosh")
			game.add.tween(baseGroup).to({y:baseGroup.y + 100},500,"Linear",true)
		})
	}
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.invader','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.invader','life_box')

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
		
		characterGroup.anim.setAnimationByName(0,"LOSESTILL",true)
		
        gameActive = false
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function tweenTint(obj, startColor, endColor, time) {     
		
		var colorBlend = {step: 0};      
		var colorTween = game.add.tween(colorBlend).to({step: 100}, time); 
		
		colorTween.onUpdateCallback(function() {      
			obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);       
		});         
		
		obj.tint = startColor;           
		colorTween.start();
	}
	
	function changeBack(){
		
		var timeUsed = 2500
		var colorToUse = Phaser.Color.getRandomColor(0,255,255)
		
		tweenTint(background,background.tint,colorToUse,timeUsed)
		
		game.time.events.add(timeUsed, changeBack)
	}
	
    function preload(){
        
        game.stage.disableVisibilityChange = false;

        
        game.load.spine('yogotar', "images/spines/eagle.json")  
        game.load.audio('spaceSong', soundsPath + 'songs/game_on.mp3');
        
		game.load.spritesheet('clock', 'images/invader/clock.png', 83, 95, 23);
		/*game.load.image('howTo',"images/invader/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/invader/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/invader/introscreen.png")*/
		
		game.load.image('tutorial_image',"images/invader/tutorial_image.png")
		//loadType(gameIndex)

        
    }
    
	function setNumber(){
		
		shipGroup.number = game.rnd.integerInRange(2,9)
		shipGroup.text.setText(shipGroup.number)
		
		popObject(shipGroup,0)
	}
	
    function createOverlay(){
        
        overlayGroup = game.add.group()
        sceneGroup.add(overlayGroup)

        createTutorialGif(overlayGroup,onClickPlay)
        
        
    }

    function onClickPlay(){
    	overlayGroup.y = -game.world.height
		gameActive = true
		setNumber()
		addObjects()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.invader','fondo')
		sceneGroup.add(background)
		
		stars = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.invader','swatch')
		stars.tileScale.setTo(0.7,0.7)
		sceneGroup.add(stars)
		
		changeBack()
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

				particle.makeParticles('atlas.invader',tag);
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
		
		createParticles('star',2)
		//createParticles('wrong',1)
		createParticles('text',5)
		createParticles('smoke',2)

	}
	
	function moveChRight(){
		
        characterGroup.x+=SPEED;
		
        if (characterGroup.x >= game.world.width * 0.5  - 50){
            inputButton(sceneGroup.button)
			
        }
    }
    
    function moveChLeft(){
		
        characterGroup.x-=SPEED;
		
        if (characterGroup.x<= -game.world.width * 0.5 + 50){
           	inputButton(sceneGroup.button)
        }
    }
	
	function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	function grabClock(){
		
		var lastSpeed = gameSpeed
		
		sound.play("powerup")
		gameSpeed*=0.5
		
		game.time.events.add(8000,function(){
			gameSpeed = lastSpeed
			canClock = false
		})
	}
	
	function checkObjects(){
		
		for(var i = 0; i < usedObjects.length;i++){
			
			var obj = usedObjects.children[i]
			
			if(obj.active){
				
				if(!obj.item){
					
					obj.y+=gameSpeed
					if(obj.image.world.y > baseGroup.y - 55 && !obj.item){
						createPart('smoke',obj.image)
						sound.play("bomb")
						deactivateObj(obj)
					}
				}
				
				var animName = "WIN"
				var animName2 = "RUN"
				if(checkOverlap(obj.image,characterGroup)){
					
					if(obj.tag == 'clock'){
						
						grabClock()
						deactivateObj(obj)
						
						createPart('star',obj)
					}else{
						
						if(obj.number % shipGroup.number == 0){
							addPoint(1)
							createPart('star',obj.image)

							deactivateObj(obj)

						}else{

							missPoint()
							//createPart('wrong',obj.image)
							deactivateObj(obj)

							animName = "HIT"
							animName2 = "IDLE"
						}
					}
					
					characterGroup.anim.setAnimationByName(0,animName,false)
					characterGroup.anim.addAnimationByName(0,animName2,true)
					
				}
			
			}
			
		}
	}
	
	function activateObject(child,posX,posY){
        
		objectsGroup.remove(child)
		usedObjects.add(child)

		child.active = true
		child.alpha = 1
		child.y = posY
		child.x = posX
		child.scale.setTo(1,1)

		child.tween = game.add.tween(child.scale).to({x:0.85,y:0.85},250,"Linear",true,0,-1)
		child.tween.yoyo(true,0)

		child.number = shipGroup.number * game.rnd.integerInRange(1,9)

		if(Math.random() * 2 < 1){
		 child.number = game.rnd.integerInRange(1,9) * game.rnd.integerInRange(1,9)
		}

		if(child.tag == 'asteroid'){
			child.text.setText(child.number)
		}
		
         
    }
    
	function deactivateObj(obj){
        
        obj.active = false
        obj.alpha = 0
		obj.y = -200
		if(obj.tween){
			obj.tween.stop()
			obj.tween = null
		}
        
        usedObjects.remove(obj)
        objectsGroup.add(obj)
        
    }
	
	function update(){
		
		background.tilePosition.y+=4
		stars.tilePosition.x-= 2
		stars.tilePosition.y-=2	
		
		if(!gameActive){
			return
		}
		
		checkObjects()
		
		if(moveRight == true){
            moveChRight()
            
        }else if(moveLeft == true){
            moveChLeft()
        }
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
		
        var exp = sceneGroup.create(0,0,'atlas.invader','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.invader','smoke');
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
	
	function getObject(tag){
		
		for(var i = 0; i < objectsGroup.length;i++){
			var object = objectsGroup.children[i]
			
			if(object.tag == tag && !object.active){
				return object
			}
		}
	}
	
	function addObjects(){
		
		if(!gameActive){
			return
		}
		
		var tagToUse = 'asteroid'
		
		if(pointsBar.number > 6 && Math.random()*2>1 && !canClock){
			tagToUse = 'clock'
			canClock = true
		}
		
		console.log(tagToUse + ' tag')
		
		var obj = getObject(tagToUse)
		
		if(obj){
			activateObject(obj,game.rnd.integerInRange(obj.width,game.world.width - obj.width),-200)
		}
		
		sound.play("shootBall")
		
		game.time.events.add(timeToSpawn,addObjects)
		
	}
	
	function createAssets(tag,scale,number){
		
		for( var i = 0; i < number;i++){
			
			var group
			
			if(tag == 'asteroid'){
			
				group = game.add.group()

				var img = group.create(0,0,'atlas.invader',tag)
				img.anchor.setTo(0.5,0.5)

				group.image = img

				var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
				var pointsText = new Phaser.Text(sceneGroup.game, 0, 3, "0", fontStyle)
				pointsText.anchor.setTo(0.5,0.5)
				group.add(pointsText)

				group.text = pointsText
				group.number = 0
				
			}else if(tag == 'clock'){
				
				group = game.add.sprite(0, 0, 'clock');
				group.animations.add('walk');
				group.anchor.setTo(0.5,0.5)
				group.animations.play('walk',24,true)
				
				group.image = group
				
			}
			
			group.alpha = 0
			group.active = false
			group.scale.setTo(scale,scale)
			group.tag = tag
			objectsGroup.add(group)
			
		}
	}
	
	function createObjects(){
		
		objectsGroup = game.add.group()
		sceneGroup.add(objectsGroup)
		
		usedObjects = game.add.group()
		sceneGroup.add(usedObjects)
		
		createAssets('asteroid',1,10)
		createAssets('clock',1,10)
		
	}
	
	function inputButton(obj){
        
        if(gameActive && rotatePlayer){
			
			sound.play("cut")
			obj.moveLeft = !obj.moveLeft
			
            if(obj.moveLeft){
				
                moveLeft = true
                moveRight = false
                characterGroup.scale.x = -1
            }else{
				
                moveLeft = false
                moveRight = true
                characterGroup.scale.x = 1
            }
			
			characterGroup.anim.setAnimationByName(0, "RUN",true);
			
			rotatePlayer = false
			game.time.events.add(200,function(){
				rotatePlayer = true
			})
			
        }
        
    }
    
    function releaseButton(obj){
        
        
    }
    
    function createControls(){
        
        var groupButton = game.add.group()
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var button = new Phaser.Graphics(game)
        button.beginFill(0x000000)
        button.drawRect(0,0,game.world.width, game.world.height)
        button.alpha = 0
        button.endFill()
        button.inputEnabled = true
        button.moveLeft = false
        button.events.onInputDown.add(inputButton)
        button.events.onInputUp.add(releaseButton)
		groupButton.add(button)
		
		sceneGroup.button = button
        
    }
	
	function createBase(){
		
		baseGroup = game.add.group()
		baseGroup.x = game.world.centerX
		baseGroup.y = game.world.height - 175
		sceneGroup.add(baseGroup)
		
		var imageBase = baseGroup.create(0,0,'atlas.invader','base')
		imageBase.width = game.world.width
		imageBase.anchor.setTo(0.5,0.5)
		
		var faceBase = baseGroup.create(0,25,'atlas.invader','caraBase')
		faceBase.anchor.setTo(0.5,0.5)
		
		var turbine = baseGroup.create(0,95,'atlas.invader','propulsor')
		turbine.anchor.setTo(0.5,0.5)
		
		var fire = baseGroup.create(0,turbine.y + 10,'atlas.invader','fire')
		fire.anchor.setTo(0.5,0)
		
		var tween = game.add.tween(fire.scale).to({y:1.4},300,"Linear",true,0,-1)
		tween.yoyo(true,0)
		
		characterGroup = game.add.group()
		characterGroup.y = -85
		baseGroup.add(characterGroup)			

		var yogotar = characterGroup.create(0,0,'atlas.invader','dinamita')
		yogotar.anchor.setTo(0.5,0.5)
		yogotar.alpha = 0
		characterGroup.yogotar = yogotar

		var anim = game.add.spine(0,40,'yogotar')
		anim.setSkinByName('normal')
		anim.setAnimationByName(0,"IDLE",true)
		characterGroup.add(anim)
		characterGroup.anim = anim
		
	}
	
	function createShip(){
		
		shipGroup = game.add.group()
		shipGroup.x = game.world.centerX
		shipGroup.y = 150
		shipGroup.alpha = 0
		sceneGroup.add(shipGroup)
		
		var shipImage = shipGroup.create(0,0,'atlas.invader','ship')
		shipImage.anchor.setTo(0.5,0.5)
		
		var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, -20, "0", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
        shipGroup.add(pointsText)
		
		shipGroup.text = pointsText
		shipGroup.number = 0
		
		var tween = game.add.tween(shipGroup).to({y:shipGroup.y - 35},500,"Linear",true,0,-1)
		tween.yoyo(true,0)
	}
	
	return {
		
		assets: assets,
		name: "invader",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			cursors = game.input.keyboard.createCursorKeys()
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createBase()
			createShip()
			createObjects()
			
			createControls()
			addParticles()
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