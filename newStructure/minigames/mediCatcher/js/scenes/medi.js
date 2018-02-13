
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var medi = function(){
    
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
                name: "atlas.medi",
                json: "images/medi/atlas.json",
                image: "images/medi/atlas.png",
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
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "splash",
				file: soundsPath + "splash.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"},
			
		],
    }
    
	var SPEED = 7
        
    var lives = null
	var timeToSpawn
	var sceneGroup = null
	var background
    var gameActive = true
	var gameSpeed
	var particlesGroup, particlesUsed
    var gameIndex = 24
	var indexGame
    var overlayGroup
    var spaceSong
	var cursors,buttonPressed
	var objectsGroup, usedObjects
	var moveRight, moveLeft
	var characterGroup
	
	var fruitList = ['apple','lettuce']
	var skins = ['sick','tired','good']

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
		buttonPressed = false
		gameSpeed = 2
		timeToSpawn = 2500
        
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
		
		gameSpeed+=0.35
		
		if(timeToSpawn > 500){
			timeToSpawn-=70
		}
        
        addNumberPart(pointsBar.text,'+' + number,true)		
		createTextPart('+' + number,characterGroup.yogotar)
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.medi','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.medi','life_box')

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
		
		characterGroup.anim.setAnimationByName(0,"LOSE",true)
        		
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
		buttons.getImages(game)
        
		game.load.spine('yogotar', "images/spines/skeleton.json") 
        game.load.audio('spaceSong', soundsPath + 'songs/classic_arcade.mp3');
        
		/*game.load.image('howTo',"images/medi/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/medi/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/medi/introscreen.png")*/
		
		var inputName = 'movil'
        
		if(game.device.desktop){
			inputName = 'desktop'
		}


		game.load.image('tutorial_image',"images/medi/tutorial_image_"+inputName+".png")
		//loadType(gameIndex)

        
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
		
		var tagToUse = 'malo' + game.rnd.integerInRange(1,3)
		
		var obj = getObject(tagToUse)
		obj.item = false
		if(obj){
			activateObject(obj,game.rnd.integerInRange(obj.width,game.world.width - obj.width),-200)
		}
		
		sound.play("cut")
		
		game.time.events.add(timeToSpawn,addObjects)
		
	}
	
	function addItems(){
		
		var tagToUse = 'medicina' + game.rnd.integerInRange(1,2)
		
		if(lives == 3){
			
			Phaser.ArrayUtils.shuffle(fruitList)
			tagToUse = fruitList[0]
		}
		
		//console.log(tagToUse + ' tag')
		
		var item = getObject(tagToUse)
		item.item = true
		activateObject(item,game.rnd.integerInRange(item.width,game.world.width - item.width),game.world.height - 253)
		
		item.x = characterGroup.x 
		while(Math.abs(item.x - characterGroup.x) < 200){
			
			item.x = game.rnd.integerInRange(item.width,game.world.width - item.width)
		}
		
		item.active = false
		
		sound.play("pop")
		game.add.tween(item).to({angle:item.angle + 360},500,"Linear",true)
		game.add.tween(item.scale).from({x:0,y:0},500,"Linear",true).onComplete.add(function(){
			item.active = true
		})
		
	}
	
    function createOverlay(){
        
        overlayGroup = game.add.group()
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
				gameActive = true

				addObjects()
				addItems()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.medi','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.medi',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.medi','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
		
    }

    function onClickPlay(){
    	overlayGroup.y = -game.world.height
		gameActive = true

		addObjects()
		addItems()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width,961,'atlas.medi','fondo2')
		sceneGroup.add(background)
		
		var hospital = sceneGroup.create(game.world.centerX, game.world.height - 140,'atlas.medi','fondo1')
		hospital.anchor.setTo(0.5,1)
		
		var tween = game.add.tween(hospital.scale).to({x:1.1,y:1.1},500,"Linear",true,0,-1)
		tween.yoyo(true,0)
		
		var botBack = game.add.tileSprite(0,game.world.height,game.world.width,253,'atlas.medi','base')
		botBack.anchor.setTo(0,1)
		sceneGroup.add(botBack)
		
	}
	
	function moveChRight(){
        characterGroup.x+=SPEED;
        if (characterGroup.x>=game.world.width - 50){
            characterGroup.x = game.world.width - 50
        }
    }
    
    function moveChLeft(){
        characterGroup.x-=SPEED;
        if (characterGroup.x<=50){
            characterGroup.x = 50
        }
    }
	
	function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	function checkObjects(){
		
		for(var i = 0; i < usedObjects.length;i++){
			
			var obj = usedObjects.children[i]
			
			if(obj.active){
				
				if(!obj.item){
					
					obj.y+=gameSpeed
					if(obj.world.y > game.world.height - 253 && !obj.item){
						createPart('drop',obj)
						sound.play("splash")
						deactivateObj(obj)
					}
				}
				
				if(checkOverlap(obj,characterGroup)){
					
					if(obj.item){
						addPoint(1)
						createPart('star',obj)
						
						if((obj.tag == 'medicina1' || obj.tag == 'medicina2') && lives < 3){
							lives++
							heartsGroup.text.setText('X ' + lives)
							addNumberPart(heartsGroup.text,'+1',true)
							
							createPart('ring',obj)
							sound.play("combo")
						}
						
						deactivateObj(obj)
						addItems()
						
					}else{
						
						characterGroup.anim.setAnimationByName(0,"HIT",false)
						
						var animName = "RUN"
						
						if(!moveLeft && !moveRight && !buttonPressed){
							animName = "IDLE"
						}
						
						characterGroup.anim.addAnimationByName(0,animName,true)
						missPoint()
						createPart('wrong',obj)
						deactivateObj(obj)
					}
					
					if(lives >0){
						characterGroup.anim.setSkinByName(skins[lives - 1])
						characterGroup.anim.setToSetupPose()
					}
					
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
		
		background.tilePosition.x++
		
		if(!gameActive){
			return
		}
		
		checkObjects()
		
		if(moveRight == true){
            moveChRight()
            
        }else if(moveLeft == true){
            moveChLeft()
        }else if (cursors.left.isDown){
            if(buttonPressed == false){
                characterGroup.anim.setAnimationByName(0, "RUN", 0.8);
            }
            buttonPressed = true 
            moveChLeft()
            characterGroup.scale.x = -1
        }else if(cursors.right.isDown){
            if(buttonPressed == false){
                characterGroup.anim.setAnimationByName(0, "RUN", 0.8);
            }
            buttonPressed = true
            moveChRight()
            characterGroup.scale.x = 1
        } else if(cursors.left.isUp && cursors.right.isUp){
            if(buttonPressed == true){
                characterGroup.anim.setAnimationByName(0, "IDLE", 0.8);
            }
            buttonPressed = false
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
                particle = particlesGroup.create(-200,0,'atlas.medi',tag)
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
		createParticles('ring',5)
		createParticles('smoke',5)
		
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
		
        var exp = sceneGroup.create(0,0,'atlas.medi','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.medi','smoke');
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
		
	}
	
	function createAssets(tag,scale,number){
		
		for( var i = 0; i < number;i++){
			
			var obj = objectsGroup.create(0,0,'atlas.medi',tag)
			obj.anchor.setTo(0.5,0.5)
			obj.tag = tag
			obj.scale.setTo(scale,scale)
			obj.alpha = 0
			obj.active = false
			
		}
	}
	
	function createObjects(){
		
		objectsGroup = game.add.group()
		sceneGroup.add(objectsGroup)
		
		usedObjects = game.add.group()
		sceneGroup.add(usedObjects)
		
		for(var i = 0; i < 3;i++){
			
			createAssets('malo' + (i+1),1,7)
			
			if(i>0)
			createAssets('medicina' + i,1,5)
		}
		
		createAssets('apple',1,5)
		createAssets('lettuce',1,5)
		
	}
	
	function inputButton(obj){
                
        if(gameActive == true){
            if(obj.tag == 'left'){
                moveLeft = true
                moveRight = false
                characterGroup.scale.x = -1
            }else{
                moveLeft = false
                moveRight = true
                characterGroup.scale.x = 1
            }
        }
		
		characterGroup.anim.setAnimationByName(0, "RUN", 0.8);
        
    }
    
    function releaseButton(obj){
        
        if(gameActive == true){
            if(obj.tag =='left'){
                moveLeft = false
            }else{
                moveRight = false
            }
        }
		
		if(!moveLeft && !moveRight){
			characterGroup.anim.setAnimationByName(0, "IDLE", 0.8);
		}
        
    }
    
    function createControls(){
        
        var groupButton = game.add.group()
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var rButton = new Phaser.Graphics(game)
        rButton.beginFill(0x000000)
        rButton.drawRect(game.world.width,0,game.world.width * 0.5, game.world.height)
		rButton.x-= rButton.width
        rButton.alpha = 0
        rButton.endFill()
        rButton.inputEnabled = true
        rButton.tag = 'right'
        rButton.events.onInputDown.add(inputButton)
        rButton.events.onInputUp.add(releaseButton)
		groupButton.add(rButton)
        
        var groupButton = game.add.group()
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var lButton = new Phaser.Graphics(game)
        lButton.beginFill(0x000000)
        lButton.drawRect(0,0,game.world.width * 0.5, game.world.height)
        lButton.alpha = 0
        lButton.endFill()
        lButton.inputEnabled = true
        lButton.tag = 'left'
        lButton.events.onInputDown.add(inputButton)
        lButton.events.onInputUp.add(releaseButton)
		groupButton.add(lButton)
        
    }
	
	return {
		
		assets: assets,
		name: "medi",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			cursors = game.input.keyboard.createCursorKeys()
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createObjects()
			createControls()
			
			characterGroup = game.add.group()
			characterGroup.x = game.world.centerX
			characterGroup.y = game.world.height - 258
			sceneGroup.add(characterGroup)			
            
			var yogotar = characterGroup.create(0,0,'atlas.medi','dinamita')
			yogotar.anchor.setTo(0.5,0.5)
			yogotar.alpha = 0
			characterGroup.yogotar = yogotar
			
			var anim = game.add.spine(0,40,'yogotar')
			anim.setSkinByName('good')
			anim.setAnimationByName(0,"IDLE",true)
			characterGroup.add(anim)
			characterGroup.anim = anim
			
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
			addParticles()
			
			buttons.getButton(spaceSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		}
	}
}()