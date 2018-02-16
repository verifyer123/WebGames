
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var nutri = function(){
    
    var localizationData = {
		"EN":{
		
		},

		"ES":{

		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.nutri",
                json: "images/nutri/atlas.json",
                image: "images/nutri/atlas.png",
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
			{	name: "whoosh",
				file: soundsPath + "robotWhoosh.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "punch",
				file: soundsPath + "punch1.mp3"},
			{	name: "punch2",
				file: soundsPath + "punch2.mp3"},
			{	name: "shoot",
				file: soundsPath + "explode.mp3"},
			
			
		],
		spines:[
		{
			name:"tutorialGif",
			file:tutorialPath+"tutorial_gifs/"+"target"+"/"+"target"+".json"
		}
		]
    }
    
	var OFF_OBJECTS = 400
	
	var fruits = ['apple','orange','lettuce','carrot']
    var lives = null
	var rotateAngle
	var sceneGroup = null
	var background,mountains,water
    var gameActive
	var particlesGroup, particlesUsed
	var pivotObjects
	var whiteFade
    var gameIndex = 16
	var angleLimit,angleStart
	var numberPanel,bar
	var buttonActive
    var overlayGroup
    var canonSong
	var objectsGroup,usedObjects
	var gameSpeed
	var isTop,isMoving
	var jumpButton,jumping
			
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		gameSpeed = 1
		gameActive = false
		rotateAngle = 1.5
		isTop = true
		isMoving = false
		angleLimit = 120
		angleStart = -10
		
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
		
		gameActive = false
		
        sound.play("wrong")
		sound.play("punch")
		sound.play("punch2")
		        
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
		
		createTextPart('+' + number,yogotarGroup.col)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)		
		
		gameSpeed+= 0.15
		
		if(pointsBar.number % 4 == 0 ){
			gameSpeed+=0.5
			
		}else if(pointsBar.number & 6 == 0){
			OFF_OBJECTS+=75
		}
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.nutri','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.nutri','life_box')

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
    
	function flyYogotar(){
		
		yogotarGroup.direction.alpha = 0
		yogotarGroup.angle = 180
		
		var col = yogotarGroup.col
		var posX = 200
		var posY = 600
		
		if(col.world.y < game.world.centerY){
			posY*= -1
		}
		
		if(col.world.x > game.world.centerX){
			posX = -200
		}
		
		game.add.tween(yogotarGroup).to({x:posX,y:yogotarGroup.y + posY},500,"Linear",true)
		
	}
	
    function stopGame(win){
        
		sound.play("wrong")
		sound.play("gameLose")
		
		yogotarGroup.yogotar.setAnimationByName(0,"FALLING",true)
		flyYogotar()
		
        gameActive = false
        canonSong.stop()
		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;  
		
        
        game.load.spine('dinamita', "images/spines/skeleton.json")  
        game.load.audio('canonSong', soundsPath + 'songs/dancing_baby.mp3');
        
		/*game.load.image('howTo',"images/nutri/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/nutri/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/nutri/introscreen.png")*/

		game.load.image('background',"images/nutri/background.png")
		
		game.load.spritesheet('coins', 'images/nutri/sprites/coins.png', 68, 70, 12);

		var device = "movil"

		if(game.device.desktop){
			device = "desktop"
		}

		game.load.image('tutorial_image',"images/nutri/tutorial_image_"+device+".png")
		//loadType(gameIndex)

		        
    }
	
	function activateObject(obj,posX, posY){
		
		objectsGroup.remove(obj)
		usedObjects.add(obj)
		
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
				gameActive = true
				buttonActive = true
				jumping = false
				//showObjects()
				
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.nutri','gametuto')
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
		var inputLogo = overlayGroup.create(game.world.centerX + offX,game.world.centerY + 125,'atlas.nutri',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.nutri','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/

    }

    function onClickPlay(){
	
		overlayGroup.y = -game.world.height
		gameActive = true
		buttonActive = true
		jumping = false
		//showObjects()

    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width,game.world.height,'background')
		sceneGroup.add(background)
		
		mountains = game.add.tileSprite(0,game.world.height,game.world.width,333,'atlas.nutri','mountains')
		mountains.anchor.setTo(0,1)
		sceneGroup.add(mountains)
		
		water = game.add.tileSprite(0,game.world.height,game.world.width,67,'atlas.nutri','water')
		water.anchor.setTo(0,1)
		sceneGroup.add(water)
		
	}
	
	function update(){

		
		background.tilePosition.x-=0.5
		water.tilePosition.x-=1	
		
		if(!gameActive){
			return
		}
		
		if (jumpButton.isDown){
            
            if(!jumping){
				
                jumping = true
                shootYogotar()
            }
        }
		
		if(jumpButton.isUp){
			jumping = false
		}
		
		
		if(isMoving){
			usedObjects.x-= gameSpeed
			mountains.tilePosition.x-= gameSpeed*0.4
			yogotarGroup.x-=gameSpeed
		}
		
		rotateYogotar()
		checkObjects()
	}
	
	function rotateYogotar(){
		
		if(!yogotarGroup.rotate){
			return
		}
		
		yogotarGroup.angle+= rotateAngle
		
		//console.log(yogotarGroup.angle + ' angle')
		if(yogotarGroup.angle <= angleStart || yogotarGroup.angle >= angleLimit){
			
			rotateAngle*=-1
		}
	}
	
	function checkCol(){
		
		//console.log('checkCol ' +  yogotarGroup.checkFruit + ' fruit')
		if(yogotarGroup.checkFruit || !gameActive){
			return
		}
				
		yogotarGroup.col.active = false
		missPoint()
		createPart('wrong',yogotarGroup.col)
		setExplosion(yogotarGroup.col)
		
	}
	
	function checkObjects(){
		
		for(var i = 0; i < usedObjects.length;i++){
			
			var obj = usedObjects.children[i]
			var col = yogotarGroup.col
			
			if(obj.world.x <= -obj.width){
				deactivateObject(obj)
				addObjects()
				break
			}
			
			if(checkOverlap(col,obj) && col.active && obj.active){
				
				var tag = obj.tag
				if(tag == 'bloque'){
					
					if(yogotarGroup.tween){
						yogotarGroup.tween.stop()
					}
					game.time.events.add(25,checkCol,this)
					
				}else if(obj.isFruit){
					
					yogotarGroup.checkFruit = true
					col.active = false
					addPoint(1)
					createPart('star',col)
					if(yogotarGroup.tween){
						yogotarGroup.tween.stop()
					}
					
					checkFruit(obj)
					deactivateObject(obj)
				}
			}
		}
		
		if(yogotarGroup.x <= -100){
			missPoint()
		}
	}
	
	function checkFruit(obj){
		
		obj.block.active = false
		
		yogotarGroup.isTop = !yogotarGroup.isTop
		yogotarGroup.scale.y = Math.abs(yogotarGroup.scale.y)
		yogotarGroup.scale.x = Math.abs(yogotarGroup.scale.x)
		yogotarGroup.angle = 0
		
		angleStart = -10
		angleLimit = 130
		
		if(yogotarGroup.isTop){
			
			yogotarGroup.angle = 50
			angleStart = 40
			angleLimit = 140
			
		}
		
		yogotarGroup.yogotar.setAnimationByName(0,"IDLE",true)
		yogotarGroup.x = obj.world.x
		yogotarGroup.y = obj.world.y
				
		game.time.events.add(50,function(){
			
			yogotarGroup.rotate = true
			yogotarGroup.checkFruit = false
			yogotarGroup.direction.alpha = 1
			
			buttonActive = true
			//jumping = false
		})
		
		
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
                particle = particlesGroup.create(-200,0,'atlas.nutri',tag)
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
			
			var exp = sceneGroup.create(0,0,'atlas.nutri','cakeSplat')
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

        particlesGood.makeParticles('atlas.nutri',tagToUse);
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
			
			var obj = objectsGroup.create(0,0,'atlas.nutri',tag)
			obj.anchor.setTo(0.5,0.5)
			obj.tag = tag
			obj.scale.setTo(scale,scale)
			obj.alpha = 0
			obj.active = false
			obj.isFruit = false
			
			if(tag != 'bloque'){
				obj.isFruit = true
			}
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
		createParticles('smoke',5)
	}
	
	function createObjects(){
		
		pivotObjects = 500
		
		objectsGroup = game.add.group()
		sceneGroup.add(objectsGroup)
		
		usedObjects = game.add.group()
		sceneGroup.add(usedObjects)
		
		createAssets('bloque',1,5)
		createAssets('apple',1,5)
		createAssets('carrot',1,5)
		createAssets('lettuce',1,5)
		createAssets('orange',1,5)
		
		for(var i = 0; i < 3;i++){
			
			addObjects()
		}
		
	}
	
	function addObjects(){
		
		isTop = !isTop
		
		var percent = game.rnd.integerInRange(0,4) * 0.1
		var obj = getObject('bloque')
		
		var posY = obj.height * percent
		obj.scale.y = Math.abs(obj.scale.y) *-1
		
		if(isTop){
			obj.scale.y = Math.abs(obj.scale.y)
			posY = game.world.height - obj.height * percent
		}
		
		activateObject(obj,pivotObjects,posY)
		
		var offY = -1
		if(!isTop){
			offY = -1
		}
		
		Phaser.ArrayUtils.shuffle(fruits)
		var fruit = getObject(fruits[0])
		activateObject(fruit,obj.x,obj.y + obj.height * 0.5 * offY)
		fruit.block = obj
		
		pivotObjects+= OFF_OBJECTS
		
	}
	
	function createBase(){
		
		var pivotBase = 0
		
		yogotarGroup = game.add.group()
		yogotarGroup.x = 100
		yogotarGroup.y = game.world.height - 215
		sceneGroup.add(yogotarGroup)
		
		yogotarGroup.tween = null
		yogotarGroup.checkFruit = false
		yogotarGroup.isTop = true
		
		var yogotar = game.add.spine(0,25,'dinamita')
		yogotar.setSkinByName('normal')
		yogotar.setAnimationByName(0,"IDLE",true)
		yogotarGroup.add(yogotar)
		yogotarGroup.yogotar = yogotar
		
		var base = usedObjects.create(pivotBase,game.world.height,'atlas.nutri','inicio')
		base.anchor.setTo(0,1)
		
		var direction = yogotarGroup.create(0,-120,'atlas.nutri','direccion')
		direction.anchor.setTo(0.5,1)
		yogotarGroup.direction = direction
		
		var target = yogotarGroup.create(0,-800,'atlas.nutri','orange')
		target.alpha = 0
		target.anchor.setTo(0.5,0.5)
		yogotarGroup.target = target
		
		var col = yogotar.create(0,-50,'atlas.nutri','orange')
		col.alpha = 0
		col.anchor.setTo(0.5,0.5)
		yogotarGroup.col = col
		col.active = true
		
		yogotarGroup.rotate = true
	}
	
	function shootYogotar(){
		
		if(!gameActive || !buttonActive){
			return
		}
		
		game.add.tween(whiteFade).from({alpha:1},250,"Linear",true)
		buttonActive = false
		
		sound.play("shoot")
		createPart('smoke',yogotarGroup.col)
		
		yogotarGroup.direction.alpha = 0
		yogotarGroup.col.active = true
		
		if(!isMoving){ 
			isMoving = true
			angleLimit = 120
		}
		
		yogotarGroup.rotate = false
		
		var target = yogotarGroup.target
		
		yogotarGroup.yogotar.setAnimationByName(0,"SHOOTOUT",true)
		yogotarGroup.tween = null
		
		//console.log(usedObjects.x + target.world.x + ' posX')
		yogotarGroup.tween = game.add.tween(yogotarGroup).to({x:target.world.x,y:target.world.y},500,"Linear",true)
		
		yogotarGroup.tween.onComplete.add(function(){
			
			if(yogotarGroup.col.active){
				missPoint()
				createPart('wrong',yogotarGroup.col)
			}	
		})
	}
	
	function createButton(){
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(shootYogotar)
		sceneGroup.add(rect)
	}
	
	return {
		
		assets: assets,
		name: "nutri",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createObjects()
			createBase()
			createButton()
                        			
            canonSong = game.add.audio('canonSong')
            game.sound.setDecodedCallback(canonSong, function(){
                canonSong.loopFull(0.6)
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
			
			buttons.getButton(canonSong,sceneGroup)
			addParticles()
            createOverlay()
			
			
            
            animateScene()
            
		},
	}
}()