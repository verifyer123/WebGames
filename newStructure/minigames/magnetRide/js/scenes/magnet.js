
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
			{   name:"tutorial_image",
				file: "images/magnet/tutorial_image.png"},
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
				file: soundsPath + "whoosh.mp3"},
			{	name: "whoosh",
				file: soundsPath + "lock.mp3"},
			{	name: "alienLaugh",
				file: soundsPath + "alienLaugh.mp3"},
			{	name: "powerup",
				file: soundsPath + "powerup.mp3"},
			{	name: "glassBreak",
				file: soundsPath + "glassbreak.mp3"},
			{	name: "laserexplode",
				file: soundsPath + "laserexplode.mp3"},
            {	name: "magnetSong",
				file: soundsPath + "songs/musicVideogame9.mp3"},
		],
        spritesheets: [
            {   name: "coin",
                file: "images/spines/coinS.png",
                width: 122,
                height: 123,
                frames: 12
            },
            {   name: "hand",
                file: "images/spines/hand.png",
                width: 115,
                height: 111,
                frames: 23
            },
            {   name: "verde",
                file: "images/spines/verde.png",
                width: 96,
                height: 108,
                frames: 12
            },
            {   name: "verde",
                file: "images/spines/verde.png",
                width: 96,
                height: 108,
                frames: 12
            },
            {   name: "rojo",
                file: "images/spines/rojo.png",
                width: 97,
                height: 111,
                frames: 12
            },
            {   name: "nave",
                file: "images/spines/nave.png",
                width: 147,
                height: 118,
                frames: 12
            },
            
        ],
        spines:[
			{
				name:"oof",
				file:"images/spines/Oof.json"
			},
            {
				name:"electric",
				file:"images/spines/waves.json"
			}
		]
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
	var glass
	var canBattery
	var direction
	var player
	var jumpButton
	var jumpDown
    var overlayGroup
	var keyPressed
	var keyPressed2
	var tagsToUse
	var canRed
	var yogotar
    var redBar
    var wave1
    var wave2
    var blueBar
    var magnetSong
	var isNoun
    var coinS
    var hand

		
	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
		jumpDown = false
		direction="tutorial"
		gameActive = false
		tagsToUse = ['coin']
		keyPressed=false
		keyPressed2=false
		gameSpeed = 3
        pivotObjects =  game.world.width
		WORLD_GRAVITY = -1700//-1250
		lastObject = null
		canRed = false
		canBattery = false
		
        loadSounds()
        
	}
    
    function createTextPart(text,obj){
        
        var pointsText = lookParticle('text')
        
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y
            pointsText.setText(text)
            pointsText.scale.setTo(0.7,0.7)

            game.add.tween(pointsText).to({y:pointsText.y + 75},750,Phaser.Easing.linear,true)
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
            particle.y = obj.world.y + 520
            particle.scale.setTo(0.5,0.5)
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
		createPart('smoke',player)
		        
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
        pointsText.y = heartImg.height * 0.15
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
			glass.alpha=1;
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
		
		yogotar.setAnimationByName(0,"lose",false)
		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 3000)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;  
    }
	
	function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
    }

    function onClickPlay(rect){

        overlayGroup.y = -game.world.height
        gameActive = true
        game.physics.p2.gravity.y = WORLD_GRAVITY
        initTutorial()
        while(pivotObjects < game.world.width * 2){
            addObject()
        }
        
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
		
		glass=game.add.sprite(game.world.centerX, game.world.centerY,"atlas.magnet", "brokenglass")
		glass.anchor.setTo(0.5,0.5);
		glass.alpha=0;
        
        controles=game.input.keyboard.createCursorKeys()
	}
	
	function positionPlayer(){
        
        player.body.x = 100 
        yogotar.x = player.x
        yogotar.y = player.y +32
		
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
        
		background.tilePosition.x -= 0.5
		background2.tilePosition.x -= 1.5
		
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
						
                        player.invincible = true
                        game.add.tween(yogotar).from({alpha:0},500,"Linear",true,0,5,true).onComplete.add(function(){
                            player.invincible = false
                        })
						missPoint()
					}
					
				}else if(tag == 'coin'){
					
					createPart('star',player)
                    addCoin(player)
					
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
		
		game.time.events.add(10000,function(){
			
			var tween = game.add.tween(bub).to({alpha:0},100,"Linear",true,200,5)
			
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
		if(direction=="tutorial"){
			direction=null;
		}
        sound.play("spaceship")
        sound.play("whoosh")
		
		yogotar.setAnimationByName(0, "change", false);
		if(gameActive){
			yogotar.addAnimationByName(0,"idle",true);
		}
		console.log(value)
		
        
        if(value=="up"){
            player.up = false
            createPart('ring',player)
            player.body.velocity.y*=0.5
            game.physics.p2.gravity.y=WORLD_GRAVITY;
			yogotar.setSkinByName('menos')
				redBar.loadTexture("atlas.magnet","red_off");
				blueBar.loadTexture("atlas.magnet","green_on");
				wave2.setAnimationByName(0, "out", false);
				wave1.setAnimationByName(0, "appear", false).onComplete=function(){
					wave1.setAnimationByName(0, "idle", true)
				};
        }else if(value=="down"){
            player.up = true
            createPart('ring',player)
            player.body.velocity.y*=0.5
            game.physics.p2.gravity.y=-WORLD_GRAVITY;
			yogotar.setSkinByName('mas')
			redBar.loadTexture("atlas.magnet","red_on");
			blueBar.loadTexture("atlas.magnet","green_off");
			wave1.setAnimationByName(0, "out", false);
			wave2.setAnimationByName(0, "appear", false).onComplete=function(){
				wave2.setAnimationByName(0, "idle", true)
				};
        }else{
			
			if(!player.up){
			yogotar.setSkinByName('mas')
			redBar.loadTexture("atlas.magnet","red_on");
			blueBar.loadTexture("atlas.magnet","green_off");
			wave1.setAnimationByName(0, "out", false);
			wave2.setAnimationByName(0, "appear", false).onComplete=function(){
				wave2.setAnimationByName(0, "idle", true)
				};
			}else{
				yogotar.setSkinByName('menos')
				redBar.loadTexture("atlas.magnet","red_off");
				blueBar.loadTexture("atlas.magnet","green_on");
				wave2.setAnimationByName(0, "out", false);
				wave1.setAnimationByName(0, "appear", false).onComplete=function(){
					wave1.setAnimationByName(0, "idle", true)
				};
			}
            player.up = !player.up
            createPart('ring',player)
            player.body.velocity.y*=0.5
            game.physics.p2.gravity.y*=-1;
        }
    
    }
    

    function update(){

        console.log(player.body.debug)
        
        if(gameActive == false){
            
            return
        }
        
        
        if(controles.down.isDown && keyPressed==false && direction!="down" && direction!="tutorial"){
            keyPressed=true
			direction="down"
			doJump(direction)
            
        }else if(controles.up.isDown && keyPressed2==false && direction!="up" && direction!="tutorial"){
            keyPressed2=true
			direction="up"
            doJump(direction)
        }
        if(controles.down.isUp){
            keyPressed=false
        }else if(controles.up.isUp){
            keyPressed2=false
        }
        
        positionPlayer()
        
        /*if (jumpButton.isDown && !jumpDown){
			
			jumpDown = true
			doJump()
        }
		
        if(jumpButton.isUp){
            jumpDown = false
        }*/
        
        checkObjects()
    }
	
	function createBars(){
		
		blueBar = sceneGroup.create(game.world.centerX,70,'atlas.magnet','green_on')
		blueBar.width = game.world.width
		game.physics.p2.enable(blueBar,DEBUG_PHYSICS)
       	blueBar.body.kinematic = true
		
		var fontStyle = {font: "90px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var plusIcon = game.add.sprite(game.world.centerX, blueBar.y, "atlas.magnet","plus_icon");
        plusIcon.anchor.setTo(0.5,0.5)
		plusIcon.scale.setTo(0.8,0.8)
        sceneGroup.add(plusIcon)
		
		redBar = sceneGroup.create(game.world.centerX,game.world.height - 60,'atlas.magnet','red_off')
        redBar.scale.setTo(1,1.2) 
        redBar.width = game.world.width
        game.physics.p2.enable(redBar,DEBUG_PHYSICS)
		redBar.scale.setTo(1,1) 
        redBar.width = game.world.width
       	redBar.body.kinematic = true
		
		var fontStyle = {font: "100px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		
		var minusIcon = game.add.sprite(game.world.centerX, redBar.y, "atlas.magnet", "less_icon");
        minusIcon.anchor.setTo(0.5,0.5)
        minusIcon.scale.setTo(0.8,0.8)
        sceneGroup.add(minusIcon)
		
        
        
        wave1 = game.add.spine(blueBar.x,blueBar.y+20, "electric");
        wave1.scale.setTo(game.world.width,0.7)
        wave1.setAnimationByName(0, "idle", true);
        wave1.setSkinByName('normal');
        
        sceneGroup.add(wave1)
        
        wave2 = game.add.spine(redBar.x,redBar.y-20, "electric");
        wave2.scale.setTo(game.world.width,-0.7)
        wave2.setAnimationByName(0, "out", false);
        wave2.setSkinByName('normal');
        
        sceneGroup.add(wave2)
        
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
            if(tag=='coin'){
                object.scale.setTo(0.7,0.7);
            }
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
//		game.time.events.add(16000,function(){
//			
//			canBattery = true
//		},this)
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
        sceneGroup.rect = rect
        
        rect.inputEnabled = false
	}
    
    function createCoin(){
        
       coinS = game.add.sprite(0, 0, "coin")
       coinS.anchor.setTo(0.5)
       coinS.scale.setTo(0.8)
       coinS.animations.add('coin')
       coinS.animations.play('coin', 24, true)
       coinS.alpha = 0
        
        hand = game.add.sprite(0, 0, "hand")
        hand.animations.add('hand')
        hand.animations.play('hand', 24, true)
        hand.alpha = 0

    }

    function addCoin(obj){
        
        if(coinS.motion)
            coinS.motion.stop()
        
        coinS.x = obj.centerX
        coinS.y = obj.centerY

        game.add.tween(coinS).to({alpha:1}, 100, Phaser.Easing.linear, true)
        
        coinS.motion = game.add.tween(coinS).to({y:coinS.y - 100}, 200, Phaser.Easing.Cubic.InOut,true)
        coinS.motion.onComplete.add(function(){
            coinS.motion = game.add.tween(coinS).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true)
            coinS.motion.onComplete.add(function(){
                coinS.motion = game.add.tween(coinS).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true)
                coinS.motion.onComplete.add(function(){
                   	addPoint(1)
					createTextPart('+1',pointsBar.text)
                })
            })
        })
    }
    
    function initTutorial(){
        
        game.time.events.add(2000, function(){
            gameActive = false
            hand.x = player.x - 10
            hand.y = player.y
            hand.alpha = 1
            hand.inputEnabled = true
            hand.events.onInputDown.add(function(){
                sceneGroup.rect.inputEnabled = true
                gameActive = true
                doJump()
                
                game.add.tween(hand).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                    hand.destroy()
                })
            })
        })
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
			
			sceneGroup = game.add.group(); 
			//yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			/*sceneGroup.x = 200
			sceneGroup.y = 200
			sceneGroup.scale.setTo(0.5,0.5)*/
			
			createBackground()
			createBars()
       
			
			yogotar = game.add.spine(game.world.centerX - 200,game.world.centerY, "oof");
			yogotar.scale.setTo(1.2,1.2)
            sceneGroup.add(yogotar)   
			
			player = sceneGroup.create(100, yogotar.y,'atlas.magnet','yogotar')
			player.scale.setTo(0.8,1.05)
            player.anchor.setTo(0.5,0.5)
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
						
            yogotar.setAnimationByName(0, "idle", true);
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
            createCoin()
            createOverlay()
            
            animateScene()
			firstPosition()
            
		},
	}
}()