
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"

var galaxy = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
			"jupiter":"Jupiter",
			"saturn":"Saturn",
			"mercury":"Mercury",
			"uranus":"Uranus",
			"earth":"Earth",
			"mars":"Mars",
			"venus":"Venus",
			"neptune":"Neptune"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
			"jupiter":"Júpiter",
			"saturn":"Saturno",
			"mercury":"Mercurio",
			"uranus":"Urano",
			"earth":"Tierra",
			"mars":"Marte",
			"venus":"Venus",
			"neptune":"Neptuno"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.galaxy",
                json: "images/galaxy/atlas.json",
                image: "images/galaxy/atlas.png",
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
			{	name: "ship",
				file: soundsPath + "robotWhoosh.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"},
			
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 31
	var whiteFade
	var indexGame
    var overlayGroup
	var worldGroup
	var yogotarShip
	var lastTag
    var spaceSong,endSong
	var stars,clouds
	var monsterNumber
	var planetSpeed
	var planetGroup, monstersGroup
	var collider
	var indexPlanet
	var planets = [
		{name:'mercury',color:0xBA7A25},
		{name:'venus',color:0x9BBA25},
		{name:'earth',color:0x25ABBA},
		{name:'mars',color:0xba2e25},
		{name:'jupiter',color:0xba8525},
		{name:'saturn',color:0x97491E},
		{name:'uranus',color:0x257BBA},
		{name:'neptune',color:0x25A0BA},
		
	]
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
		planetSpeed = 0.5
		monsterNumber = 5
		indexPlanet = 0
        
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
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.galaxy','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.galaxy','life_box')

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
    
	function crashShip(){
		
		yogotarShip.setAnimationByName(0,"LOSE",true)
		
		game.add.tween(yogotarShip).to({y:collider.y},400,"Linear",true).onComplete.add(function(){
			
			setExplosion(collider)
			sound.play("explosion")
			
			yogotarShip.setAnimationByName(0,"LOSESTILL",true)
			
			game.add.tween(yogotarShip.scale).to({x:0.5,y:0.5},400,"Linear",true)
			game.add.tween(yogotarShip).to({x: game.world.width + 200, y:game.world.centerY + 200},500,"Linear",true)
			game.add.tween(worldGroup).to({alpha:0},500,"Linear",true)
			
			game.time.events.add(500,function(){
				
				yogotarShip.scale.setTo(0.7,0.7)
				yogotarShip.x = -100
				game.add.tween(yogotarShip).to({x: game.world.width + 100,y:yogotarShip.y + 200},8000,"Linear",true)
			})
			
			changeColors()
			
			spaceSong = game.add.audio('endSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.6)
            }, this);
		})
		
	}
	
	function changeColors(){
		
		sceneGroup.back.alpha = 0
		delay = 500
		
		for(var counter = 0; counter < 50;counter++){
            game.time.events.add(delay, function(){
                
                var color = Phaser.Color.getRandomColor(0,255,255)
                game.stage.backgroundColor = color
                
            } , this);
            delay+=500
        }
	}
	
    function stopGame(win){
        
		game.add.tween(whiteFade).to({alpha:0},200,"Linear",true)
		
		sound.play("wrong")
		sound.play("gameLose")
		
		crashShip()
		
        gameActive = false
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 8000)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 	
			spaceSong.stop()
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;

        
        game.load.spine('ship', "images/spines/skeleton.json")  
        game.load.audio('spaceSong', soundsPath + 'songs/musicVideogame9.mp3');
		
		 game.load.audio('endSong', soundsPath + 'songs/shooting_stars.mp3');
        
		/*game.load.image('howTo',"images/galaxy/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/galaxy/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/galaxy/introscreen.png")*/
		
		game.load.spritesheet('alien1', 'images/galaxy/sprites/alien1.png', 64, 64, 12);
		game.load.spritesheet('alien2', 'images/galaxy/sprites/alien2.png', 128, 128, 12);
		
		game.load.image('tutorial_image',"images/galaxy/tutorial_image.png")
		//loadType(gameIndex)

		
		
        
    }
    
	function getObject(tag,group){
		
		for(var i = 0; i < group.length;i++){
			
			var planet = group.children[i]
			if(tag == planet.tag){
				return planet
				break
			}
		}
	}
	
	function addPlanet(){
		
		worldGroup.alpha = 0
		worldGroup.angle = 0
		
		yogotarShip.monsters = 0
		yogotarShip.badMonsters = 0
		
		
		var tag = planets[indexPlanet].name
		
		lastTag = tag
		var planet = getObject(tag,planetGroup)
		planet.alpha = 1
				
		planetGroup.remove(planet)
		worldGroup.add(planet)
		
		worldGroup.text = planet.text
		
		planet.x = 0
		planet.y = 0
		
		var angleToUse = 232
		for(var i = 0; i < monsterNumber; i++){
			
			var index =  game.rnd.integerInRange(1,2)
			
			if(index == 1 && yogotarShip.badMonsters == 0 && i == monsterNumber - 1){
				index = 2
			}
			
			if(index == 2){
				yogotarShip.badMonsters++
			}
			
			var monster = getObject('alien' + index,monstersGroup)
			monster.alpha = 1
			
			monstersGroup.remove(monster)
			worldGroup.add(monster)
			
			var baseRadius = 85
			var angle = Math.PI / monsterNumber;
			var s = Math.sin(angle);
			var r = baseRadius * s / (1-s);


			var phi = 15 + angle * i * 2;
			var cx = 0+(baseRadius + r) * Math.cos(phi);
			var cy = 0+(baseRadius + r) * Math.sin(phi);

			monster.x = cx
			monster.y = cy
			monster.angle = angleToUse
			
			angleToUse+= 360 / monsterNumber
			
		}
		
		game.time.events.add(500,function(){
			gameActive = true
			
			sound.play("cut")
			worldGroup.alpha = 1
			worldGroup.scale.setTo(1,1)
					
			game.add.tween(worldGroup.scale).from({x:0,y:0},500,"Linear",true)
		})
		
		
	}
	
	function addButton(){
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(inputButton)
		sceneGroup.add(rect)
		
	}
	
    function createOverlay(){
        
		whiteFade = new Phaser.Graphics(game)
        whiteFade.beginFill(0xffffff)
        whiteFade.drawRect(0,0,game.world.width *2, game.world.height *2)
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
                
				addPlanet()
				overlayGroup.y = -game.world.height
				///positionBar()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.galaxy','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.galaxy',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.galaxy','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
    	addPlanet()
		overlayGroup.y = -game.world.height
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0x08011e)
        rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        rect.endFill()
		sceneGroup.add(rect)
		sceneGroup.back = rect
		
		stars = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.galaxy','stars')
		sceneGroup.add(stars)
		
		clouds = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.galaxy','cloud')
		sceneGroup.add(clouds)
	}
	
	
	function update(){
		
		stars.tilePosition.x-=0.8
		clouds.tilePosition.x+= 3
		
		if(!gameActive){
			return
		}
		
		worldGroup.angle-= planetSpeed
		
		if(worldGroup.text){
			worldGroup.text.angle = -worldGroup.angle
			
		}
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
            game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
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
                particle = particlesGroup.create(-200,0,'atlas.galaxy',tag)
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
		
        var exp = sceneGroup.create(0,0,'atlas.galaxy','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.galaxy','smoke');
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = posX;
        particlesGood.y = posY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},500,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
	
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	function checkCollider(){
		
		var objToUse
		
		for(var i = 0; i < worldGroup.length;i++){
			
			var obj = worldGroup.children[i]
			if(obj.monster && checkOverlap(obj,collider)){
				objToUse = obj
			}
		}
		
		if(objToUse && objToUse.tag == 'alien2'){
			
			yogotarShip.setAnimationByName(0,"ABDUCTION",false)
			yogotarShip.addAnimationByName(0,"WIN",false)
			yogotarShip.addAnimationByName(0,"IDLE",true)
		
			worldGroup.remove(objToUse)
			monstersGroup.add(objToUse)
			
			objToUse.x = collider.x
			objToUse.y = collider.y
			
			objToUse.angle = 0
			
			game.add.tween(objToUse).to({y:yogotarShip.y,alpha:0},500,"Linear",true)
			
			addPoint(1)
			createPart('star',objToUse)
			
			yogotarShip.monsters++
			
			if(yogotarShip.monsters == yogotarShip.badMonsters){
				
				sound.play("combo")
				gameActive = false
				game.time.events.add(500,hideObjects)
			}
			
		}else{
			
			missPoint()
            yogotarShip.setAnimationByName(0,"ABDUCTION",true)
            yogotarShip.addAnimationByName(0,"IDLE",true)
		}
	}
	
	function hideObjects(){
		
		sound.play("cut")
		game.add.tween(worldGroup.scale).to({x:0,y:0},500,"Linear",true).onComplete.add(function(){
			
			while(worldGroup.length > 0){
				
				var obj = worldGroup.children[0]
				
				worldGroup.remove(obj)
				
				if(obj.monster){
					monstersGroup.add(obj)
				}else{
					planetGroup.add(obj)
				}
				
				obj.alpha = 0
			}
		})
		
		planetSpeed+= 0.35
			
		if(monsterNumber < 8){
			//monsterNumber++
		}
		
		game.time.events.add(1000,function(){
			indexPlanet++
			
			if(indexPlanet > planets.length - 1){
				indexPlanet = 0
			}
			
			addPlanet()
		})
		
	}
	
	function inputButton(obj){
		
		if(!gameActive || yogotarShip.abducts){
			return
		}
		
		game.add.tween(whiteFade).from({alpha:1},250,"Linear",true)
		
		//yogotarShip.abducts = true
		
		sound.play("ship")
		
		checkCollider()
		
		game.time.events.add(550,function(){
			yogotarShip.abducts = false
		})
	}
	
	function createPlanets(){
		
		planetGroup = game.add.group()
		sceneGroup.add(planetGroup)
		
		for(var i = 0; i < planets.length;i++){
			
			var group = game.add.group()
			group.x = -400
			planetGroup.add(group)
			
			var aura = group.create(0,0,'atlas.galaxy','aura')
			aura.anchor.setTo(0.5,0.5)
			aura.tint = planets[i].color
			group.aura = aura
			
			var planet = group.create(0,0,'atlas.galaxy',planets[i].name)
			planet.anchor.setTo(0.5,0.5)
			
			group.tag = planets[i].name
			
			var groupText = game.add.group()
			group.add(groupText)
			
			var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, 0, -7, localization.getString(localizationData,planets[i].name), fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			
			var rect = groupText.create(0,0,'atlas.galaxy','ribbon')
			rect.anchor.setTo(0.5,0.5)
			rect.tint = planets[i].color
			
			groupText.add(pointsText)
			group.text = groupText
			
		}
		
		monstersGroup = game.add.group()
		sceneGroup.add(monstersGroup)
		
		createMonsters('alien1',10)
		createMonsters('alien2',10)
	}
	
	function createMonsters(tag,number){
		
		for(var i = 0; i < number;i++){
			
			var obj = game.add.sprite(-200, 0, tag);
			obj.animations.add('walk');
			obj.animations.play('walk',12,true);
			obj.anchor.setTo(0.5,0.5)
			obj.tag = tag
			obj.monster = true
			monstersGroup.add(obj)
		}
		
	}
    
    function backAndWihte(){
        
        var wihte = game.add.graphics(0, 0)
        wihte.beginFill(0xFFFFFF)
        wihte.drawRect(0, 0, game.world.width, game.world.height)
    }
	
	return {
		
		assets: assets,
		name: "galaxy",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
            backAndWihte()
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			
			worldGroup = game.add.group()
			worldGroup.x = game.world.centerX
			worldGroup.y = game.world.centerY + 150
			sceneGroup.add(worldGroup)
			
			createPlanets()
			
			yogotarShip = game.add.spine(game.world.centerX, game.world.centerY - 300,"ship")
			yogotarShip.setSkinByName("Luna")
			yogotarShip.scale.setTo(0.3,0.3)
			yogotarShip.setAnimationByName(0,"IDLE",true)
			yogotarShip.abducts = false
			yogotarShip.monsters = 0
			sceneGroup.add(yogotarShip)
			
			collider = sceneGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.galaxy','button')
			collider.scale.setTo(0.1,0.2)
			collider.alpha = 0
			collider.anchor.setTo(0.5,0.5)
			
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
            
			addButton()
            initialize()
			
			buttons.getButton(spaceSong,sceneGroup)
			            
			createPointsBar()
			createHearts()
            createOverlay()
			
			addParticles()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()