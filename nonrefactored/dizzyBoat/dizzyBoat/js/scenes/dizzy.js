
var soundsPath = "../../shared/minigames/sounds/"
var dizzy = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
			"north":"North",
			"south":"South",
			"east":"East",
			"west":"West",
			"northeast":"Northeast",
			"northwest":"Northwest",
			"southeast":"Southeast",
			"southwest":"Southwest"

		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
			"north":"Norte",
			"south":"Sur",
			"east":"Este",
			"west":"Oeste",
			"northeast":"Noreste",
			"northwest":"Noroeste",
			"southeast":"Sureste",
			"southwest":"Suroeste"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.dizzy",
                json: "images/dizzy/atlas.json",
                image: "images/dizzy/atlas.png",
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
			{	name: "waterSplash",
				file: soundsPath + "water_splash.mp3"},
			{	name: "waterRow",
				file: soundsPath + "waterRow.mp3"},
			{	name: "explode",
				file: soundsPath + "explode.mp3"},
		],
    }
    
    var WORLD_GRAVITY = 0
	var DEBUG_PHYSICS = false
	
    var lives = null
	var boatRotation 
	var boatSpeed
	var sceneGroup = null
	var background
    var gameActive = true
	var sea
	var textGroup
	var shoot
	var particlesGroup, particlesUsed
	var obstacleList
    var gameIndex = 22
	var canShoot
	var indexGame
    var overlayGroup
    var piratesSong
	var sea, map
	var boat
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		boatSpeed = 100
		boatRotation = 30
		obstacleList = ['rock','rock','rock','rock','rock','rock']
		canShoot = false
        
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
		
		positionPlayer()

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
		sound.play("waterSplash")
		        
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
		
		if(pointsBar.number % 5 == 0){
			obstacleList[obstacleList.length] = 'monster'
		}
		
		if(pointsBar.number % 2 == 0){
			boatRotation += 15
			boatSpeed+=10
			
			obstacleList[obstacleList.length] = 'rock'
		}
		
		if(pointsBar.number % 4 == 0){
			sendCloud()
		}
        
		if(pointsBar.number == 2){
			game.time.events.add(4000,shootCanon)
		}
    }
	
	function shootCanon(){
		
		var initX = -game.world.width * 0.5
		var endX = game.world.width * 1.5
		
		if(Math.random() * 2 > 1){
			initX = game.world.width * 1.5
			endX = -game.world.width * 0.5
		}
		var canon = getObject('canonBall')
		canon.alpha = 1
		canon.x = initX
		canon.y = player.body.y
		activateObject(canon,initX, player.body.y)
		
		sound.play("explode")
		
		game.add.tween(canon).to({x:endX},8000,"Linear",true).onComplete.add(function(){
			deactivateObject(canon)
		})
		
		game.time.events.add(10000,shootCanon)
	}
	
	function sendCloud(){
		
		var cloud = getObject('cloud')
		
		var initX =	game.world.width + cloud.width 
		var endX = -cloud.width * 1.5
		
		if(Math.random()*2 > 1){
			initX = -cloud.width * 1.5
			endX = game.world.width + cloud.width * 1.5
		}
		
		cloud.x = initX
		cloud.y = game.world.centerY + 200 - (game.rnd.integerInRange(1,4) * 100)
		objectsGroup.remove(cloud)
		sceneGroup.add(cloud)
		
		cloud.alpha = 1
		
		game.add.tween(cloud).to({x:endX},30000,"Linear",true).onComplete.add(function(){
			sceneGroup.remove(cloud)
			objectsGroup.add(cloud)
		})
	}
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.dizzy','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.dizzy','life_box')

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
		
		ship.anim.setAnimationByName(0,"LOSE",false)
		
        gameActive = false
        piratesSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2000)
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
        
        game.load.spine('ship', "images/spines/skeleton.json")  
        game.load.audio('piratesSong', soundsPath + 'songs/pirates_song.mp3');
        
		game.load.image('howTo',"images/dizzy/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/dizzy/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/dizzy/introscreen.png")
		
		game.load.spritesheet('monster', 'images/dizzy/sprites/seamounster.png', 92, 98, 11);
		
		console.log(localization.getLanguage() + ' language')
        
    }
	
	function rotateBoat(){
		
		//console.log('rotate')
		player.body.rotateLeft(boatRotation)
	}
	
	function getObject(tag){
		
		for(var i = 0; i < objectsGroup.length;i++){
			var object = objectsGroup.children[i]
			
			if(object.tag == tag && !object.active){
				return object
			}
		}
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
				
		obj.alpha = 0
		obj.active = false
		
		usedObjects.remove(obj)
		objectsGroup.add(obj)
	}
    
	function setScene(){
		
		usedObjects.x = 0
		usedObjects.y = 0
		
		var objectList = []
		
		player.body.x = game.world.centerX
		player.body.y = game.world.centerY - 100
		player.body.rotation = 0
		
		rotateBoat()
		
		var listNumbers = [-1.15,0,0.9]
		Phaser.ArrayUtils.shuffle(listNumbers)
		
		var posX = listNumbers[0]
		var posY = listNumbers[1]
				
		var island = getObject('island')
		activateObject(island,game.world.centerX + (game.world.width * 0.6 * posX), player.body.y + (game.world.height * 0.45 * posY))
		objectList[objectList.length] = island
		
		//console.log(island.x + ' posX,' + island.y + ' posY')
		
		for(var i = 0; i < obstacleList.length;i++){
			
			var obj = getObject(obstacleList[i])
			
			if(!obj){
				break
			}
			
			obj.x = game.rnd.integerInRange(-game.world.width * 0.3,game.world.width * 1.5 - obj.width)
			obj.y = game.rnd.integerInRange(-game.world.height * 0.3,game.world.height * 1.1)
			
			while(checkPosObj(obj)){
				obj.x = game.rnd.integerInRange(-game.world.width * 0.3,game.world.width * 1.5 - obj.width)
				obj.y = game.rnd.integerInRange(-game.world.height * 0.3,game.world.height * 1.1)
			}
			
			activateObject(obj,obj.x, obj.y)
			
			objectList[objectList.length] = obj
			
			//console.log(obj.x + ' posX,' +  obj.y + ' posY')
		}
		
		var delay = 500
		sound.play("waterSplash")
		for(var i = 0; i < objectList.length;i++){
			
			var obj = objectList[i]
			obj.alpha = 0
			
			game.add.tween(obj).to({alpha:1},500,"Linear",true, delay)
			delay+= 150
			
		}
		
		var cross = map.cross
		cross.x = cross.initX + 120 * listNumbers[0]
		cross.y = cross.initY + 100 * listNumbers[1]
		
		map.boat.x = cross.initX
		map.boat.y = cross.initY
		
		ship.alpha = 0
		game.add.tween(ship).to({alpha:1},250,"Linear",true,0,4)
		
		var angle = getAngle(cross)	
		
		map.arrow.angle = angle
		map.arrow.alpha = 1
		
		game.add.tween(map.arrow).to({alpha:0},300,"Linear",true,0,10)
		
		game.time.events.add(1000,function(){
			gameActive = true
		})
		
	}
	
	function getAngle(cross){
		
		var angle = 0
		var textToUse
		
		if(cross.y == cross.initY && cross.x < cross.initX){
			angle = 180
			textToUse = 'west'
		}
		if(cross.y < cross.initY && cross.x < cross.initX){
			angle = 135
			textToUse = 'northwest'
		}
		if(cross.y < cross.initY && cross.x == cross.initX){
			angle = 90
			textToUse = 'north'
		}
		if(cross.x > cross.initX && cross.y < cross.initX){
			angle = 45
			textToUse = 'northeast'
		}
		if(cross.x == cross.initX && cross.y > cross.initY){
			angle = 270
			textToUse = 'south'
		}
		if(cross.x < cross.initX && cross.y > cross.initY){
			angle = 225
			textToUse = 'southwest'
		}
		if(cross.x > cross.initX && cross.y > cross.initY){
			angle = 315
			textToUse = 'southeast'
		}
		
		if(cross.x > cross.initX && cross.y == cross.initY){
			angle = 0
			textToUse = 'east'
		}
		
		textGroup.alpha = 1
		game.add.tween(textGroup).from({alpha:0},500,"Linear",true)
		
		textGroup.text.setText(localization.getString(localizationData,textToUse))
		return -angle
	}
	
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	function checkPosObj(target){
        
		var posX = target.x
		var posY = target.y
		
        var samePos = false
		
		//console.log(usedObjects.length + ' length')
        for(var i = 0;i<usedObjects.length;i++){
            var obj = usedObjects.children[i]
            if(Math.abs(obj.x - posX) < 100 && Math.abs(obj.y - posY) < 100){
                samePos = true
            }
        }
		
		if(Math.abs(player.body.x - posX) < 150 && Math.abs(player.body.y - posY) < 150){
			samePos = true
		}
		
        return samePos
    }
	
    function createOverlay(){
        
		sceneGroup.remove(textGroup)
		sceneGroup.add(textGroup)
		
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
				
				setScene()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.dizzy','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.dizzy',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.dizzy','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
	}

	function createBackground(){
		
		sea = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.dizzy','sea')
		sceneGroup.add(sea)
		
		var fade = sceneGroup.create(0,0,'atlas.dizzy','gradient')
		fade.width = game.world.width
		fade.height = game.world.height - 275
		fade.alpha = 0.5
		
		textGroup = game.add.group()
		textGroup.x = game.world.centerX
		textGroup.y = 75
		textGroup.alpha = 0
		sceneGroup.add(textGroup)
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRoundedRect(0,0,300, 50)
		rect.alpha = 0.5
		rect.x-= rect.width * 0.5
		rect.y-= rect.height * 0.5
        rect.endFill()
		textGroup.add(rect)
		
		var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		
		var pointsText = new Phaser.Text(sceneGroup.game, 0,5, "", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
        textGroup.add(pointsText)
		
		textGroup.text = pointsText
	}
	
	function update(){
		
		sea.tilePosition.x-= 0.3
		map.tile.tilePosition.x+=0.2
		
		if(!gameActive){
			return
		}
		
		checkObjects()
		
		positionPlayer()
	}
	
	function checkObjects(){
		
		for(var i = 0; i < usedObjects.length;i++){
			
			var obj = usedObjects.children[i]
			
			if(checkOverlap(player,obj) && obj.active){
				
				var tag = obj.tag
				
				if(tag == 'island'){
					addPoint(1)
					
					map.boat.x = map.cross.x
					map.boat.y = map.cross.y - 15
					
					game.add.tween(textGroup).to({alpha:0},500,"Linear",true)
					createPart('star',player)
					obj.active = false
					
					gameActive = false
					
					setNext()
				}else if(tag == 'monster' || tag == 'rock' || tag == 'canonBall'){
					
					stopBoat()
					createPart('wrong',player)
					deactivateObject(obj)
					missPoint()
				}
			}
		}
	}
	
	function setNext(){
		
		var delay = 200
		
		stopBoat()
		game.add.tween(ship).to({x:game.world.centerX, y:game.world.centerY - 100, angle:ship.angle + 360 - ship.angle},500,"Linear",true)
		
		for(var i = 0; i < usedObjects.length; i++){
			
			var obj = usedObjects.children[i]
			turnOff(obj,delay)
			delay+=100
		}
		
		game.time.events.add(2000,setScene)
	}
	
	function turnOff(obj,delay){
		
		game.add.tween(obj).to({alpha:0},500,"Linear",true,delay).onComplete.add(function(){
			deactivateObject(obj)
		})
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
    
    function createPart(key,obj,offsetX){
        
        var offX = offsetX || 0
        key+='Part'
        var particle = lookParticle(key)
        if(particle){
            
            particle.x = obj.world.x + offX
            particle.y = obj.world.y
            particle.scale.setTo(1,1)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:4,y:4},300,Phaser.Easing.Cubic.In,true)
            deactivateParticle(particle,300)
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
                particle = particlesGroup.create(-200,0,'atlas.dizzy',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
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
		
        var exp = sceneGroup.create(0,0,'atlas.dizzy','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.dizzy','smoke');
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
		
		sound.play("waterRow")
		createPart('drop',player)
		player.body.rotateLeft(0)
		player.body.moveForward(boatSpeed)
		
		ship.anim.setAnimationByName(0,"SAIL",true)
		
	}
	
	function stopBoat(){
		
		player.body.velocity.x = 0
		player.body.velocity.y = 0
		
		ship.anim.setAnimationByName(0,"IDLE",true)
		
	}
	
	function releaseButton(obj){
        
		if(!gameActive){
			return
		}
		
		stopBoat()
		rotateBoat()
    }
	
	function createShip(){
		
		ship = game.add.group()
		ship.x = game.world.centerX
		ship.y = game.world.centerY - 50
		ship.scale.setTo(0.8,0.8)
		sceneGroup.add(ship)
		
		var shipAnim = game.add.spine(0, 50,'ship')
		shipAnim.setSkinByName('bottom')
		shipAnim.setAnimationByName(0,"IDLE",true)
		ship.add(shipAnim)
		
		ship.anim = shipAnim
	
		player = sceneGroup.create(ship.x, ship.y - 50,'atlas.dizzy','player')
		player.scale.setTo(0.4,0.4)
		player.anchor.setTo(0.5,0.5)
		player.alpha = 0
		game.physics.p2.enable(player,DEBUG_PHYSICS)
		player.body.setCircle(45)
		player.body.mass = 0.1
		player.body.collideWorldBounds = true;
		player.initX = player.x
		player.initY = player.y
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, 600)
		rect.y = game.world.height
        rect.endFill()
		game.physics.p2.enable(rect,DEBUG_PHYSICS)
		rect.body.kinematic = true
		sceneGroup.add(rect)
		
	}
	
	function positionPlayer(){
		
		ship.x = player.x
		ship.y = player.y
		
		ship.angle = player.angle
		
		if(player.body.x != player.initX){
			
			var difference = player.body.x - player.initX
			
			map.boat.x+= difference * 0.3
			
			if(usedObjects.x > game.world.width * 0.75){
				usedObjects.x = game.world.width * 0.75
			}
			
			if(usedObjects.x < -game.world.height * 0.65){
				usedObjects.x = -game.world.height * 0.65
				
			}
			
			var initX = map.cross.initX
			var mapWidth = map.rect.width * 0.4
			
			console.log(initX + ' initX ' + map.boat.x + ' mapX,' + mapWidth + ' width')
			if(map.boat.x < initX - mapWidth){
				map.boat.x = initX - mapWidth
			}else if(map.boat.x > initX + mapWidth){
				map.boat.x = initX + mapWidth
			}
			
			usedObjects.x-=difference
			player.body.x = player.initX
		}
		
		if(player.body.y != player.initY){
			
			//console.log(usedObjects.y + ' posY,' +  (game.world.height) + ' posWorld ' + map.boat.x + ' mapY')
			var diff = player.body.y - player.initY
			
			map.boat.y+= diff * 0.25
			
			if(usedObjects.y > game.world.height * 0.75){
				usedObjects.y = game.world.height * 0.75
			}
			
			if(usedObjects.y < -game.world.height * 0.5){
				usedObjects.y = -game.world.height * 0.5
			}
			
			var initY = map.cross.initY
			var mapHeight = map.rect.height * 0.35
			
			if(map.boat.y < initY - mapHeight){
				map.boat.y = initY - mapHeight
			}else if(map.boat.y > initY + mapHeight){
				map.boat.y = initY + mapHeight
			}
			
			usedObjects.y-=diff
			
			
			player.body.y = player.initY
		}
		
	}
	
	function createButton(){
		
		var button = new Phaser.Graphics(game)
        button.beginFill(0xffffff)
        button.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        button.alpha = 0
        button.endFill()
		button.inputEnabled = true
		button.events.onInputDown.add(inputButton)
		button.events.onInputUp.add(releaseButton)
		sceneGroup.add(button)
		
	}
	
	function createAssets(tag,scale,number){
		
		for(var i = 0; i< number;i++){
			
			var obj
			
			if(tag == 'monster'){
				
				obj = game.add.sprite(-300, 200, 'monster');
                obj.animations.add('walk');
                obj.animations.play('walk',24,true); 
				objectsGroup.add(obj)
				
			}else{
				obj = objectsGroup.create(0,0,'atlas.dizzy',tag)
				
			}
			
			obj.alpha = 0
			obj.tag = tag
			obj.active = false
			obj.anchor.setTo(0.5,0.5)
		}
	}
	
	function createObjects(){	
		
		objectsGroup = game.add.group()
		sceneGroup.add(objectsGroup)
		
		usedObjects = game.add.group()
		sceneGroup.add(usedObjects)
		
		createAssets('island',0.8,1)
		createAssets('rock',1,15)
		createAssets('cloud',1,5)
		createAssets('monster',1,15)
		createAssets('canonBall',1,15)
		
	}
	
	function createMap(){
		
		map = game.add.group()
		map.y = game.world.height
		sceneGroup.add(map)
		
		var tileMap = game.add.tileSprite(0,0,game.world.width,300,'atlas.dizzy','map')
		tileMap.anchor.setTo(0,1)
		map.add(tileMap)
		map.tile = tileMap
		
		var cross = map.create(0,0,'atlas.dizzy','cross')
		cross.anchor.setTo(0,1)
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xff7606)
        rect.drawRect(0,-tileMap.height,game.world.width, 25)
        rect.endFill()
		map.add(rect)
		
		var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
		
		var pointsText = new Phaser.Text(sceneGroup.game, cross.width * 0.32, -cross.height * 0.73, "N", fontStyle)
        map.add(pointsText)
		
		var pointsText = new Phaser.Text(sceneGroup.game, cross.width * 0.32, -cross.height * 0.23, "S", fontStyle)
        map.add(pointsText)
		
		var letter = "W"
		if(localization.getLanguage() == "ES"){letter = "O"}
		var pointsText = new Phaser.Text(sceneGroup.game, cross.width * 0.08, -cross.height * 0.465, letter, fontStyle)
        map.add(pointsText)
		
		var pointsText = new Phaser.Text(sceneGroup.game, cross.width * 0.54, -cross.height * 0.465, "E", fontStyle)
        map.add(pointsText)
		
		var mapBoat = map.create(game.world.width * 0.7, - tileMap.height * 0.43,'atlas.dizzy','boat')
		mapBoat.anchor.setTo(0.5,0.5)
		map.boat = mapBoat
		
		var mapCross = map.create(mapBoat.x, mapBoat.y,'atlas.dizzy','cros')
		mapCross.anchor.setTo(0.5,0.5)
		mapCross.initX = mapCross.x
		mapCross.initY = mapCross.y 
		
		map.cross = mapCross
		
		var tween = game.add.tween(mapCross.scale).to({x:1.2,y:1.2},250,"Linear",true,0,-1)
		tween.yoyo(true,0)
		
		var mapArrow = map.create(mapBoat.x,mapBoat.y,'atlas.dizzy','mapArrow')
		mapArrow.anchor.setTo(0,0.5)
		mapArrow.scale.setTo(0.9,0.9)
		map.arrow = mapArrow
		
		var rectangle = map.create(mapBoat.x, mapBoat.y - 10, 'atlas.dizzy','rectangle')
		rectangle.anchor.setTo(0.5,0.5)
		rectangle.width = 425
		rectangle.height = 300
		map.rect = rectangle
		
	}
	
	return {
		
		assets: assets,
		name: "dizzy",
		update: update,
        preload:preload,
		create: function(event){
            
			game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.gravity.y = WORLD_GRAVITY;
            game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            game.physics.p2.world.setGlobalStiffness(1e5);
			
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex);
			
			createBackground()
			createObjects()
			createShip()
			createButton()
			createMap()
			addParticles()
                        			
            piratesSong = game.add.audio('piratesSong')
            game.sound.setDecodedCallback(piratesSong, function(){
                piratesSong.loopFull(0.6)
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
			
			buttons.getButton(piratesSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
	}
}()