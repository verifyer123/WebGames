
var soundsPath = "../../shared/minigames/sounds/"
var magnet = function(){
    
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
                name: "atlas.magnet",
                json: "images/magnet/atlas.json",
                image: "images/magnet/atlas.png",
            },
        ],
        images: [
			{   name:"background",
				file: "images/magnet/background.png"},
			{   name:"background2",
				file: "images/magnet/background2.png"},
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "spaceship",
				file: soundsPath + "spaceship.mp3"},
			{	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
			{	name: "alienLaugh",
				file: soundsPath + "alienLaugh.mp3"},
			{	name: "powerup",
				file: soundsPath + "powerup.mp3"},
			{	name: "glassBreak",
				file: soundsPath + "glassbreak.mp3"},
			{	name: "laserexplode",
				file: soundsPath + "laserexplode.mp3"},
		],
    }
    
   	var DEBUG_PHYSICS = false
    var WORLD_GRAVITY = -1250
    
	var gameSpeed
	var background,background2
	var pivotObjects
	var groundGroup
	var lastObject
    var lives = null
	var sceneGroup = null
    var pointsGroup = null
    var gameActive = true
	var canBattery
	var player
	var jumpButton
	var jumpDown
    var gameIndex = 5
    var overlayGroup
	var tagsToUse
	var canRed
	var yogotar
    var magnetSong
	var isNoun
		
	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		jumpDown = false
		gameActive = false
		tagsToUse = ['coin']
		gameSpeed = 3
        pivotObjects =  game.world.width
		WORLD_GRAVITY = -1250
		lastObject = null
		canRed = false
		canBattery = false
		
        loadSounds()
        
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

				particle.makeParticles('atlas.magnet',tag);
				particle.minParticleSpeed.setTo(-300, -100);
				particle.maxParticleSpeed.setTo(400, -400);
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

    function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
        },this)
    }
    
    function animateScene() {
                        
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
    
    function missPoint(){
        
        sound.play("wrong")
		createPart('wrong',player)
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            stopGame(false)
        }
        
        createTextPart('-1',heartsGroup.text)
        
    }
    
    function addPoint(number){
        
        sound.play("magic")
		createPart('star',player)
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
		
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        createTextPart('+' +  number, pointsBar.text)
		
		var score = pointsBar.number
		
		if(score == 10){
			
			tagsToUse = ['verde']
		}else if(score == 22){
			canBattery = true
			tagsToUse[tagsToUse.length] = 'verde'
			canRed = true
		}else if(score == 35){
			tagsToUse[tagsToUse.length] = 'nave'
		}
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.magnet','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.magnet','life_box')

        pivotX+= heartImg.width * 0.45
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = 0
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
    
	function stopWorld(){
        
		sceneGroup.remove(yogotar)
		sceneGroup.add(yogotar)
		
		sound.play('laserexplode')
		createPart('smoke',player)
		
		game.add.tween(yogotar).to({angle:yogotar.angle + 360},500,"Linear",true)
		game.add.tween(yogotar.scale).to({x:5,y:5},500,"Linear",true)
        var tweenLose = game.add.tween(yogotar).to({x:game.world.centerX, y:game.world.centerY + 50}, 500, Phaser.Easing.Cubic.Out, true)
        tweenLose.onComplete.add(function(){
			
			sound.play("glassBreak")
            game.add.tween(yogotar).to({y:yogotar.y + 200}, 3000, Phaser.Easing.Cubic.In, true)
        })
		
		var whiteRect = new Phaser.Graphics(game)
        whiteRect.beginFill(0xffffff)
        whiteRect.drawRect(0,0,game.world.width *2, game.world.height *2)
        whiteRect.alpha = 0
        whiteRect.endFill()
		sceneGroup.add(whiteRect)
		
		game.add.tween(whiteRect).from({alpha:1},500,"Linear",true)
    }
	
    function stopGame(win){
        
		sound.play("wrong")
        gameActive = false
		
		sound.play("gameLose")
		stopWorld()
        magnetSong.stop()
        
		yogotar.setSkinByName('mas')
		yogotar.setToSetupPose()
		
		yogotar.setAnimationByName(0,"LOSE",false)
		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 3000)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;  
		buttons.getImages(game)
        
        game.load.spine('oof', "images/spines/Oof.json")  
        game.load.audio('magnetSong', soundsPath + 'songs/retrowave.mp3');
        
        game.load.image('introscreen',"images/magnet/introscreen.png")
		game.load.spritesheet('verde', 'images/magnet/verde.png', 96, 108, 12);
		game.load.spritesheet('rojo', 'images/magnet/rojo.png', 97, 111, 12);
		game.load.spritesheet('nave', 'images/magnet/nave.png', 147, 118, 12);
		game.load.spritesheet('coin', 'images/magnet/coin.png', 68, 70, 12);
		
		game.load.image('howTo',"images/magnet/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/magnet/play" + localization.getLanguage() + ".png")
		
        
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
                overlayGroup.y = -game.world.height
                gameActive = true
				game.physics.p2.gravity.y = WORLD_GRAVITY;
				while(pivotObjects < game.world.width * 2){
					addObject()
				}
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.magnet','gametuto')
		tuto.anchor.setTo(0.5,0.5)
		
        
        var action = 'tap'
        
        if(game.device == 'desktop'){
            action = 'click'
        }
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 225,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.7,0.7)
        
		var deviceName = 'pc'
		var offsetX = 0
        if(!game.device.desktop){
            
            deviceName = 'tablet'
			offsetX = 100
			
			var spaceBar = overlayGroup.create(game.world.centerX - 100,game.world.centerY + 125,'atlas.magnet','spacebar')
			spaceBar.anchor.setTo(0.5,0.5)
			spaceBar.scale.setTo(0.7,0.7)
        }
		
		var inputLogo = overlayGroup.create(game.world.centerX + 35 + offsetX ,game.world.centerY + 125,'atlas.magnet','pc')
        inputLogo.anchor.setTo(0.5,0.5)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height,'atlas.magnet','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }
	
	function createGlobe(){
		
		globeGroup = game.add.group()
		globeGroup.x = game.world.centerX + 200
		globeGroup.alpha = 0
		globeGroup.y = yogotar.y - 400
		sceneGroup.add(globeGroup)
		
		var globeImg = globeGroup.create(0,0,'atlas.magnet','globe')
		globeImg.anchor.setTo(0.5,0.5)
		
		var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, -15, 'Five', fontStyle)
        pointsText.anchor.setTo(0.5,0.5)
        globeGroup.add(pointsText)
		
		globeGroup.number = 0
		globeGroup.text = pointsText
		
	}
	
	function createClock(){
        
        clock = game.add.group()
        clock.x = game.world.centerX
        clock.y = 75
        sceneGroup.add(clock)
        
        var clockImage = clock.create(0,0,'atlas.magnet','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.magnet','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
		clockBar.scale.x = 0
        
        clock.bar = clockBar
        
    }
	
	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width, game.world.height, 'background');
		sceneGroup.add(background)
		
		background2 = game.add.tileSprite(0,game.world.height,game.world.width, game.world.height * 0.7, 'background2');
		background2.anchor.setTo(0,1)
		sceneGroup.add(background2)
	}
	
	function positionPlayer(){
        
        player.body.x = 100 
        yogotar.x = player.x
        yogotar.y = player.y +48 
		
		player.bubble.x = yogotar.x
		player.bubble.y = yogotar.y - 50
		
		if(yogotar.scale.y < 0){
            yogotar.y = player.y -20
        }
      
    }
    
    function deactivateObj(obj){
		
        obj.used = false
		obj.alpha = 0
        obj.y = -500
		
		objectsGroup.remove(obj)
		groundGroup.add(obj)
    }
    
    function checkObjects(){
        
		//background.tilePosition.x -= 1
		background2.tilePosition.x -= 2
		
		//console.log(objectsGroup.length + ' length')
		
		objectsGroup.x-=gameSpeed
		for(var index = 0;index<objectsGroup.length;index++){
            
            var obj = objectsGroup.children[index]
            var tag = obj.tag
			
			if(obj.used){
				
				if(tag == 'rojo'){
					obj.x-=4
				}

				if(tag == 'bullet'){
					obj.x-= 7
				}

				if(tag == 'battery'){
					obj.angle++
				}
			}
            
            if(obj.world.x < -obj.width * 0.45 && obj.used == true){
                
				//console.log('removido ' + obj.tag + ' posX ' + obj.world.x)
                deactivateObj(obj)
								
				if(!obj.item && tag != 'rojo' && tag != 'bullet'){
					addObject()
				}

				break
            }
			
			if(checkOverlap(player,obj)){
				
				var tag = obj.tag
				if(obj.enemy){
					
					if(!player.invincible){
						
						missPoint()
					}
					
				}else if(tag == 'coin'){
					
					addPoint(1)
					createTextPart('+1',player)
					deactivateObj(obj)
					if(!obj.item){
						addObject()
					}
					break
				}else if(tag == 'battery'){
					
					addPoint(0)
					deactivateObj(obj)
					pickBattery()
					break
				}
			}
        }
    }
		
	function pickBattery(){
		
		player.invincible = true
		sound.play("powerup")
		
		var bub = player.bubble
		bub.alpha = 1
		game.add.tween(bub.scale).from({x:0,y:0},500,"Linear",true)
		
		game.time.events.add(5000,function(){
			
			var tween = game.add.tween(bub).to({alpha:0},200,"Linear",true,200,5)
			
			tween.onComplete.add(function(){
				
				player.invincible = false
			})
			
		})
	}
	
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
    
    function doJump(value){
        
		if(!gameActive){
			return
		}
		
        sound.play("spaceship")
        sound.play("whoosh")
		
		yogotar.setAnimationByName(0, "CHANGE", false);
		if(gameActive){
			yogotar.addAnimationByName(0,"IDLE",true)
		}
		
		if(!player.up){
			yogotar.setSkinByName('mas')
		}else{
			yogotar.setSkinByName('menos')
		}
		
		yogotar.setToSetupPose()
		
		player.up = !player.up
        
        
        createPart('ring',player)
        //yogotar.addAnimationByName(0, "LAND", false);
        
        yogotar.scale.y*=-1
  
		player.body.velocity.y*=0.5
        game.physics.p2.gravity.y*=-1;
    
    }
    
    function update(){
        
        if(gameActive == false){
            return
        }
        
        positionPlayer()
        
        if (jumpButton.isDown && !jumpDown){
			
			jumpDown = true
			doJump()
        }
		
        if(jumpButton.isUp){
            jumpDown = false
        }
        
        checkObjects()
    }
	
	function createBars(){
		
		var blueBar = sceneGroup.create(game.world.centerX,100,'atlas.magnet','plusbar')
		blueBar.width = game.world.width
		game.physics.p2.enable(blueBar,DEBUG_PHYSICS)
       	blueBar.body.kinematic = true
		
		var fontStyle = {font: "90px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, game.world.centerX, blueBar.y + 15, "+", fontStyle)
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)
		
		var redBar = sceneGroup.create(game.world.centerX,game.world.height - 100,'atlas.magnet','minusbar')
		redBar.width = game.world.width
		game.physics.p2.enable(redBar,DEBUG_PHYSICS)
       	redBar.body.kinematic = true
		
		var fontStyle = {font: "100px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		
		var pointsText = new Phaser.Text(sceneGroup.game, game.world.centerX, redBar.y - 15, "-", fontStyle)
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)
		
	}
	
	function createObjs(tag,scale,times){
        
        var pivotX = 0
        for(var i = 0;i<times;i++){
			
            var object
            if(tag == 'verde' || tag == 'rojo' || tag == 'coin' || tag == 'nave'){
                
                object = game.add.sprite(-300, 200, tag);
                //object.scale.x = -1
                groundGroup.add(object)
                object.animations.add('walk');
                object.animations.play('walk',24,true);
                
            }else{
                object = groundGroup.create(-300,game.world.height - 350,'atlas.magnet',tag)
            }
            
            object.scale.setTo(scale,scale)
            object.anchor.setTo(0,1)
            object.tag = tag
            object.used = false
			object.anchor.setTo(0.5,0.5)
			object.enemy = true
			
			if(tag == 'coin' || tag == 'battery'){
				object.enemy = false
			}

        }
    }
	
	function firstPosition(){
		
		positionPlayer()
		
		if(!gameActive){
			
			game.time.events.add(500,firstPosition,this)	
		}
	}
	
	function createObjects(){
		
		groundGroup = game.add.group()
		sceneGroup.add(groundGroup)
		
		objectsGroup = game.add.group()
		sceneGroup.add(objectsGroup)
		
		createObjs('verde',1,8)
		createObjs('rojo',1,5)
		createObjs('coin',1,15)
		createObjs('nave',1,5)
		createObjs('bullet',1,12)
		createObjs('battery',1.2,5)
		
	}
	
	function activateObject(posX, posY, child){

		if(child != null){
            
			groundGroup.remove(child)
			objectsGroup.add(child)
			
            child.x = posX
            child.y = posY
			child.alpha = 1
            child.used = true

        }
    
    }
	
	function randomize(index){
        var isTrue = false
        
        if(Math.random()*index < 1){
            isTrue = true
        }
                
        return isTrue
    }
	
	function setBattery(){
		
		canBattery = false
		game.time.events.add(16000,function(){
			
			canBattery = true
		},this)
	}
	
	function addItem(tag,obj){
		
		if(canBattery){
			
			tag = 'battery'
			setBattery()
		}
		
		for(var i = 0; i<groundGroup.length;i++){
			
			var item = groundGroup.children[i]
			
			if(item.tag == tag && !item.used){
				
				item.y = obj.y
				while(Math.abs(obj.y - item.y) < 125){
					item.y = game.rnd.integerInRange(200, game.world.height * 0.75)
				}
				
				item.item = true
				activateObject(pivotObjects,item.y,item)
				
				break
			}
		}
	}
	
	function shootBall(ship){
		
		if(!ship.used || !gameActive){
			return
		}
		
		//console.log(ship.world.x + ' posX')
		for(var i = 0; i<groundGroup.length;i++){
			
			var obj = groundGroup.children[i]

			if(obj.tag == 'bullet' && !obj.used){

				sound.play("shoot")
				createPart('ring',ship,-75)

				obj.item = false
				activateObject(ship.x,ship.y,obj)
				
				break
			}
		}
		
		game.time.events.add(1000,function(){
			
			shootBall(ship)
		},this)
	}
	
	function addObject(tagUsed){
		
		//console.log('added Object')
		
		if(lastObject && lastObject.tag != 'rojo'){
			pivotObjects = lastObject.x + 300
		}
		
		Phaser.ArrayUtils.shuffle(tagsToUse)
		
		var tag = tagUsed || tagsToUse[0]
						
		for(var i = 0; i<groundGroup.length;i++){
			
			var obj = groundGroup.children[i]
			
			if(obj.tag == tag && !obj.used){
				
				lastObject = obj
				obj.item = false
				activateObject(pivotObjects,game.rnd.integerInRange(225, game.world.height * 0.75),obj)
				
				if(obj.tag == 'nave'){
					
					shootBall(obj)
				}
				
				if(obj.tag != 'rojo'){
					
					if(randomize(1.2)){
						addItem('coin',obj)
					}

					if(randomize(3) && canRed && obj.tag!='rojo'){
						addObject('rojo')
					}
				}else{
					sound.play("alienLaugh")
					obj.y = player.y
				}
				
				break
			}
		}
	}
	
	function createButton(){
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        rect.alpha = 0
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            doJump()
            
        })	
		sceneGroup.add(rect)
	}
	
	return {
		
		assets: assets,
		name: "magnet",
		update: update,
        preload:preload,
		create: function(event){
            
			game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.gravity.y = 0;
            game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            game.physics.p2.world.setGlobalStiffness(1e5);
			
			jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex);
			/*sceneGroup.x = 200
			sceneGroup.y = 200
			sceneGroup.scale.setTo(0.5,0.5)*/
			
			createBackground()
			createBars()
       
			
			yogotar = game.add.spine(game.world.centerX - 200,game.world.centerY, "oof");
			yogotar.scale.setTo(1.2,1.2)
            sceneGroup.add(yogotar)   
			
			player = sceneGroup.create(yogotar.x, yogotar.y,'atlas.magnet','yogotar')
			player.scale.setTo(0.8,0.8)
            player.anchor.setTo(0.5,1)
            player.alpha = 0
            game.physics.p2.enable(player,DEBUG_PHYSICS)
            player.body.fixedRotation = true
            player.body.mass=50
			player.up = false
			player.invincible = false
			
			var bubble = sceneGroup.create(player.x, player.y,'atlas.magnet','bubble')
			bubble.alpha = 0
			bubble.anchor.setTo(0.5,0.5)
			player.bubble = bubble
						
            yogotar.setAnimationByName(0, "IDLE", true);
            yogotar.setSkinByName('menos');
			
			createObjects()
			createButton()
                        			
            magnetSong = game.add.audio('magnetSong')
            game.sound.setDecodedCallback(magnetSong, function(){
                magnetSong.loopFull(0.6)
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
			
			buttons.getButton(magnetSong,sceneGroup)
			            
			addParticles()
            createOverlay()
            
            animateScene()
			firstPosition()
            
		},
	}
}()