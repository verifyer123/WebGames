
var soundsPath = "../../shared/minigames/sounds/"
var fish = function(){
    
    var localizationData = {
		"EN":{
		
		},

		"ES":{

		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.pop",
                json: "images/pop/atlas.json",
                image: "images/pop/atlas.png",
            },
        ],
        images: [
			{   name:"fondo",
				file: "images/pop/background.png"},
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "whoosh",
				file: soundsPath + "robotWhoosh.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "shoot",
				file: soundsPath + "explode.mp3"},
			{	name: "flesh",
				file: soundsPath + "flesh.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"},
			{	name: "spiderSound",
				file: soundsPath + "spiderSound.mp3"},
			
			
		],
    }
    
	var OFF_OBJECTS = 400
	var WORLD_GRAVITY = 800
	var DEBUG_PHYSICS = false
	
	var colorsToUse = [0xE200D5,0x27E200]
    var lives = null
	var rotateAngle, rotateLeft, rotateRight
	var sceneGroup = null
	var bubblesDelay = 1000
	var background,background2
    var gameActive
	var particlesGroup, particlesUsed
	var whiteFade
    var gameIndex = 32
	var numberPanel,bar
	var player, rotationBar
	var redSpider
	var fishAnim
	var buttonActive
    var overlayGroup
	var pivotObjects
    var gardenSong
	var objectsGroup,usedObjects
	var gameSpeed
	var isTop,isMoving
			
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
		gameSpeed = 0.75
		gameActive = false
		rotateAngle = 25
		isTop = true
		isMoving = false
		
        loadSounds()
        
	}

    function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x:0, y:0},250,Phaser.Easing.linear,true)
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
        
		if(!gameActive){
			return
		}
		
        sound.play("wrong")
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            stopGame(false)
        }else{
			player.active = false
			fishAnim.alpha = 0
			game.add.tween(fishAnim).to({alpha:1},200,"Linear",true,0,8).onComplete.add(function(){
				player.active = true
			})
		}
        
        addNumberPart(heartsGroup.text,'-1',true)
        
    }
    
    function addPoint(number){
        
        sound.play("magic")
		
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
		
		createTextPart('+' + number,player)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)	
		
		gameSpeed+=0.15

    }
	
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.pop','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.pop','life_box')

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
		
		fishAnim.anim.setAnimationByName(0,"LOSE",false)
		fishAnim.anim.addAnimationByName(0,"LOSESTILL",true)
		fishAnim.text.alpha = 0
		game.add.tween(fishAnim).to({angle:0},500,"Linear",true)
		
		player.alpha = 0
        gameActive = false
		rotationBar.body.rotateLeft(0)
		
        gardenSong.stop()
		game.physics.p2.gravity.y = 0
		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
            
			console.log(gameIndex + ' index')
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;  
		buttons.getImages(game)
        
        game.load.spine('fish', "images/spines/skeleton.json")  
        game.load.audio('gardenSong', soundsPath + 'songs/adventure.mp3');
        
		game.load.image('howTo',"images/pop/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/pop/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/pop/introscreen.png")
		game.load.image('background',"images/pop/background.png")
		        
    }
	
	function activateObject(obj,posX, posY){
		
		objectsGroup.remove(obj)
		usedObjects.add(obj)
		
		if(obj.tag == 'bubble'){
			obj.number = game.rnd.integerInRange(1,9)
			obj.text.setText(obj.number)
		}
		
		obj.alpha = 1
		obj.active = true
		obj.x = posX
		obj.y = posY
		
	}
	
	function deactivateObject(obj){
		
		//('deactivate ' + obj.tag + ' tag')
		
		obj.alpha = 0
		obj.active = false
		
		usedObjects.remove(obj)
		objectsGroup.add(obj)
	}
	
	function getObject(tag){
		
		for(var i = 0; i < objectsGroup.length;i++){
			var object = objectsGroup.children[i]
			
			if(object.tag == tag && !object.active){
				return object
			}
		}
	}
	
    function createOverlay(){
		
		whiteFade = new Phaser.Graphics(game)
		whiteFade.beginFill(0xffffff)
		whiteFade.drawRect(0,0,game.world.width * 2, game.world.height * 2)
		whiteFade.alpha = 0
		whiteFade.endFill()
		sceneGroup.add(whiteFade)
			
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
				buttonActive = true
				
				player.number = game.rnd.integerInRange(2,3)
				fishAnim.text.setText(player.number)
					
				game.time.events.add(250,function(){
					
					pivotObjects = -200 -usedObjects.y
					for(var i = 0; i < 5;i++){

						addObjects()
					}
					
				})
				
				
				//showObjects()
				
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.pop','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		var offX = 0
		
		if(game.device.desktop){
			inputName = 'desktop'
			offX = 13
		}
		
		//console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX + offX,game.world.centerY + 125,'atlas.pop',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.pop','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
		
	}

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width,game.world.height,'background')
		sceneGroup.add(background)
		
		background2 = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.pop','wood')
		background2.tint = 0x6a6a6a
		sceneGroup.add(background2)
		
		var light = sceneGroup.create(game.world.centerX, 0,'atlas.pop','light')
		light.height = game.world.height * 0.7
		light.anchor.setTo(0.5,0)
		
		var tween = game.add.tween(light.scale).to({x:1.2},1000,"Linear",true,0,-1)
		tween.yoyo(true,0)
		background.light = light
	}
	
	function positionPlayer(){
		
		fishAnim.x = player.x
		fishAnim.y = player.y
		
		fishAnim.angle = player.angle
		
		if(!gameActive){
			game.time.events.add(100,positionPlayer)
		}
	}
	
	function update(){
		
		background.tilePosition.x+=0.25
		
		if(!gameActive){
			return
		}
		
		positionPlayer()
		
		background2.tilePosition.y+= gameSpeed
		
		if(rotateLeft){
			if(rotationBar.angle > -22){
				rotationBar.body.rotateLeft(rotateAngle)
			}else{
				rotationBar.body.rotateLeft(0)
			}
			
		}else if(rotateRight){
			
			if(rotationBar.angle < 22){
				rotationBar.body.rotateRight(rotateAngle)
			}else{
				rotationBar.body.rotateLeft(0)
			}
		}
		
		if(game.device.desktop){
			
			if(cursors.left.isDown){
				rotateLeft = true
			}else{
				rotateLeft = false
			}

			if(cursors.right.isDown){
				rotateRight = true
			}else{
				rotateRight = false
			}
		}
		
		if(!rotateLeft && !rotateRight){
			rotationBar.body.rotateLeft(0)
		}
		
		
		checkObjects()
	}	
	
	function checkObjects(){
		
		usedObjects.y+= gameSpeed
		
		for(var i = 0; i < usedObjects.length;i++){
			
			var obj = usedObjects.children[i]
			var tag = obj.tag
			
			if(checkOverlap(player,obj) && player.active){
								
				if(tag == 'bubble'){
					
					if(obj.number % player.number == 0){
						
						createPart('star',obj.circle)
						addPoint(1)
						deactivateObject(obj)
						addObjects()
						
						fishAnim.anim.setAnimationByName()
						
					}else{
						createPart('wrong',obj.circle)
						missPoint()
						deactivateObject(obj)
					}
				}
			}
			
			if(obj.circle.world.y >= game.world.height + obj.height){
				deactivateObject(obj)
				if(tag == 'bubble'){
					addObjects()
				}
			}
			
		}

	}
		
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	function createTextPart(text,obj){
        
        var pointsText = lookParticle('textPart')
        
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
    
    function createPart(key,obj,offsetY){
        
        var offY = offsetY || 0
        key+='Part'
        var particle = lookParticle(key)
        if(particle){
            
            particle.x = obj.world.x
            particle.y = obj.world.y + offY
            particle.scale.setTo(1,1)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:4,y:4},300,Phaser.Easing.Cubic.In,true)
            deactivateParticle(particle,300)
			
			if(key == 'ringPart'){
				particle.tint = obj.tint
			}
        }
        
        
    }
    
    function createParticles(tag,number){
        
        tag+='Part'
        
        for(var i = 0; i < number;i++){
            
            var particle
            if(tag == 'textPart'){
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                particle = particlesGroup.create(-200,0,'atlas.pop',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }

	function setExplosion(obj,tag,offset){
		
		var tagToUse = tag || 'smoke'
        var offY = offset || 0

		var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
		
		if(!tag){
			
			var exp = sceneGroup.create(0,0,'atlas.pop','cakeSplat')
			exp.x = posX
			exp.y = posY
			exp.anchor.setTo(0.5,0.5)

			exp.scale.setTo(6,6)
			game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
			var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
			
			var rect = new Phaser.Graphics(game)
			rect.beginFill(0xffffff)
			rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
			rect.alpha = 0
			rect.endFill()
			sceneGroup.add(rect)

			game.add.tween(rect).from({alpha:1},500,"Linear",true)
			
		}
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.pop',tagToUse);
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = posX;
        particlesGood.y = posY + offY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
	
	function createAssets(tag,scale,number){
		
		for( var i = 0; i < number;i++){
			
			var group = game.add.group()
			group.x = -200
			objectsGroup.add(group)
			group.tag = tag
			group.scale.setTo(scale,scale)
			
			Phaser.ArrayUtils.shuffle(colorsToUse)
			
			var imageCircle = group.create(0,0,'atlas.pop',tag)
			imageCircle.anchor.setTo(0.5,0.5)
			imageCircle.tint = colorsToUse[0]
			imageCircle.anchor.setTo(0.5,0.5)
			
			group.circle = imageCircle
			
			var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, 0, 3, "0", fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			group.add(pointsText)
			
			pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
			
			group.number = 0
			group.text = pointsText
		}
	}
	
	function addParticles(){
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',5)
		createParticles('wrong',5)
		createParticles('text',5)
		createParticles('drop',5)
		createParticles('ring',5)
	}
	
	function createObjects(){
			
		pivotObjects = -200
		
		objectsGroup = game.add.group()
		sceneGroup.add(objectsGroup)
		
		usedObjects = game.add.group()
		sceneGroup.add(usedObjects)
		
		createAssets('bubble',1,5)
		
	}
	
	function addObjects(){
		
		var obj = getObject('bubble')
		
		var posX = game.rnd.integerInRange(obj.width * 2,game.world.width - obj.width * 2)
		
		activateObject(obj,posX, pivotObjects)
		pivotObjects-=250
		
		//console.log(obj.x + ' posX,' +  obj.y + ' posY,' +  posX + ' ' + pivotObjects)
		
	}
	
	function inputButton(obj){
		
		if(obj.isLeft){
			rotateLeft = true
			rotateRight = false
		}else{
			rotateRight = true
			rotateLeft = false
		}
	}
	
	function releaseButton(obj){
        
        if(obj.isLeft){
			rotateLeft = false
		}else{
			rotateRight = false
		}
    }
	
	function createButton(){
		
		var isLeft = false
		var pivotX = 0
		for(var i = 0; i < 2; i++){
			
			var rect = new Phaser.Graphics(game)
			rect.beginFill(0x000000)
			rect.drawRect(pivotX,0,game.world.width * 0.5, game.world.height)
			pivotX+= game.world.width * 0.5
			rect.alpha = 0
			rect.endFill()
			rect.inputEnabled = true
			rect.events.onInputDown.add(inputButton)
			rect.events.onInputUp.add(releaseButton)
			
			isLeft = !isLeft
			rect.isLeft = isLeft
			sceneGroup.add(rect)
		}
		
	}
	
	function createSeed(){
		
		player = sceneGroup.create(game.world.centerX, game.world.centerY,'atlas.pop','seed')
		player.active = true
		player.scale.setTo(1.2,1.2)
		game.physics.p2.enable(player,DEBUG_PHYSICS)
		player.body.mass=5
		player.alpha = 0
		player.body.setCircle(player.width * 0.5)

		player.body.collideWorldBounds = true;
		
		fishAnim = game.add.group()
		fishAnim.x = game.world.centerX
		fishAnim.y = game.world.centerY 
		fishAnim.scale.setTo(1.2,1.2)
		sceneGroup.add(fishAnim)
		
		var anim = game.add.spine(0,38,"fish")
		anim.setAnimationByName(0,"IDLE",true)
		anim.setSkinByName('normal')
		anim.scale.setTo(0.7,0.7)
		fishAnim.add(anim)
		fishAnim.anim = anim
		
		var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 7, "0", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
        fishAnim.add(pointsText)
		
		fishAnim.text = pointsText
		
		var origWidth
		rotationBar = sceneGroup.create(game.world.centerX, game.world.height - 225,'atlas.pop','bar')
		origWidth = rotationBar.width
		rotationBar.width = game.world.width * 1.1
		rotationBar.height = (rotationBar.height * rotationBar.width) / origWidth
		game.physics.p2.enable(rotationBar,DEBUG_PHYSICS)
		rotationBar.body.kinematic = true
		rotationBar.body.setRectangle(rotationBar.width, rotationBar.height * 0.9);
		
		positionPlayer()
	}
	
	return {
		
		assets: assets,
		name: "fish",
		update: update,
        preload:preload,
		create: function(event){
            
			cursors = game.input.keyboard.createCursorKeys()
			
			game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.gravity.y = WORLD_GRAVITY;
            game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            game.physics.p2.world.setGlobalStiffness(1e5);
			
			sceneGroup = game.add.group()
			
			createBackground()
			createSeed()
			createObjects()
			createButton()
                        			
            gardenSong = game.add.audio('gardenSong')
            game.sound.setDecodedCallback(gardenSong, function(){
                gardenSong.loopFull(0.8)
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
			
			buttons.getButton(gardenSong,sceneGroup)
            createOverlay()
			
			addParticles()
            
            animateScene()
            
		},
	}
}()