
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"
var puzzle = function(){
    
    var localizationData = {
		"EN":{
		
		},

		"ES":{

		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.puzzle",
                json: "images/puzzle/atlas.json",
                image: "images/puzzle/atlas.png",
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
			{	name: "spaceShip",
				file: soundsPath + "spaceShip.mp3"},
			{	name: "fly",
				file: soundsPath + "inflateballoon.mp3"},
			
		],
    }
    var INITIAL_LIVES = 3
    var DELTA_JUMP = 107

	var angleToUse = -15
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive
	var robot
	var particlesGroup, particlesUsed
	var offWorld = -15
    var gameIndex = 10
	var tagsToUse
	var lanesGroup
    var overlayGroup
	var playerGroup
	var topBack, botBack
	var pivotObjects
    var puzzleSong
	var objectsGroup,usedObjects
	var backgroundGroup
	var gameSpeed
		
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
		gameSpeed = 3
		tagsToUse = ['circle','rhombus','square','triangle']
		gameActive = false
		pivotObjects = game.world.width * 1.5
        
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
        
		
		
		setExplosion(playerGroup)
        sound.play("wrong")
		createPart('wrong',playerGroup.figPos)
		sound.play("explosion")
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
        	gameActive = false
            stopGame(false)
        }
        
        addNumberPart(heartsGroup.text,'-1',true)
        
    }

    
    function addPoint(number){
        
        sound.play("magic")
		createPart('star',playerGroup.figPos)
		
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)		
		
		gameSpeed+= 0.2
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.puzzle','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.puzzle','life_box')

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
        puzzleSong.stop()
        		
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
		
        
        game.load.spine('figures', "images/spines/skeleton.json")  
        game.load.audio('puzzleSong', soundsPath + 'songs/upbeat_casual_8.mp3');
        
		/*game.load.image('howTo',"images/puzzle/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/puzzle/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/puzzle/introscreen.png")*/
		
		game.load.image('tutorial_image',"images/puzzle/tutorial_image.png")
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
		
		//console.log('deactivate')
		
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
	
	function changeSkin(tag){
		
		game.time.events.add(500,function(){
			
			playerGroup.anim.setSkinByName(tag)
			createPart('ring',playerGroup.figPos)
			playerGroup.tag = tag

			sound.play('whoosh')
			game.add.tween(playerGroup.scale).from({x:0,y:0},200,"Linear",true)
			
			playerGroup.anim.setToSetupPose()
		})
		
	}
	
	function addObject(){
		
		Phaser.ArrayUtils.shuffle(tagsToUse)
		
		var pivotY = game.world.centerY - 107
		var offX = 0
		var randIndex = game.rnd.integerInRange(0,2)
		
		for(var i = 0; i  < 3;i++){
			
			var obj = getObject(tagsToUse[i])
			activateObject(obj,pivotObjects + offX,pivotY +offWorld)
			//console.log(obj.world.x + ' objx ' + obj.y + ' objy')
			
			pivotY+= 107
			offX+= 90
			
			if(i == randIndex){
				changeSkin(tagsToUse[i])
			}
		}
		
		pivotObjects+=game.world.width * 1.4
	}
	
    function createOverlay(){
        
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
				addObject()
				
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.puzzle','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		//console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.puzzle',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.puzzle','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
    	overlayGroup.y = -game.world.height
		gameActive = true
		addObject()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xff9c39)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.endFill()
		sceneGroup.add(rect)
		
		backgroundGroup = game.add.group()
		backgroundGroup.x = -250
		backgroundGroup.y = 100
		backgroundGroup.angle = angleToUse
		sceneGroup.add(backgroundGroup)
		
		var tilesWidth = game.world.width * 1.5
		
		topBack = game.add.tileSprite(0,0,tilesWidth, 273, 'atlas.puzzle','arriba');
		backgroundGroup.add(topBack)
				
		botBack = game.add.tileSprite(0,game.world.height,tilesWidth, 280, 'atlas.puzzle','abajo');
		botBack.anchor.setTo(0,1)
		backgroundGroup.add(botBack)
				
		var road = game.add.tileSprite(0,game.world.centerY,tilesWidth, 319, 'atlas.puzzle','road');
		road.anchor.setTo(0,0.5)
		backgroundGroup.add(road)
	}
	
	
	function update(){
		
		if(!gameActive){
			return
		}
		
		var direction = this.swipe.check();
		
		if (direction!==null && gameActive) {
		// direction= { x: x, y: y, direction: direction }
			switch(direction.direction) {
				case this.swipe.DIRECTION_UP:
					movePlayer('up')
					break;
       			case this.swipe.DIRECTION_DOWN:
					movePlayer('down')
					break;
				case this.swipe.DIRECTION_LEFT:
					movePlayer('up')
					break;
       			case this.swipe.DIRECTION_RIGHT:
					movePlayer('down')
					break;
			}
		}
		

		checkObjects()
	}
	
	function checkObjects(){
		
		topBack.tilePosition.x-=gameSpeed
		botBack.tilePosition.x-=gameSpeed * 1.1
		
		usedObjects.x-=gameSpeed

		var playerRail = 1

		/*if(playerGroup.figPos.world.y < game.world.centerY -53){
			playerRail = 0
		}
		else if(playerGroup.figPos.world.y > game.world.centerY +53){
			playerRail = 2
		}*/
		//console.log('rail '+playerRail)
		
		for(var i = 0; i < usedObjects.length;i++){
			
			var obj = usedObjects.children[i]
			
			if(obj.world.x < -100){
				deactivateObject(obj)
			}
			//console.log(i+'   '+obj.world.y)
			
			
			if(checkOverlap(obj,playerGroup) && obj.active){
			//if(obj.active && i == playerRail){	

				if(Math.abs(obj.world.x - playerGroup.figPos.world.x) < 55 && Math.abs(obj.world.y - playerGroup.figPos.world.y) < 55){
					
					//console.log(obj.tag + ' objTag ' + playerGroup.tag + ' playerTag')
					if(obj.tag == playerGroup.tag){
						
						addPoint(1)
						obj.active = false
						//deactivateObject(obj)
						game.time.events.add(500,function(){deactivateObject(obj)})
						for(var i = 0; i < usedObjects.length ; i++){
							var obj = usedObjects.children[i]
							obj.active = false
							game.add.tween(obj).to({alpha:0},250,"Linear",true,250)
						}
						game.time.events.add(500,addObject)
					}else{
						
						missPoint()
						if(lives<=0){
							playerGroup.alpha = 0
							deactivateObject(obj)
						}
						else{
							var blink_time = 400
							var tween1 = game.add.tween(playerGroup).to({alpha:0},blink_time,"Linear",false)
							var tween2 = game.add.tween(playerGroup).to({alpha:1},blink_time,"Linear",false)
							var tween3 = game.add.tween(playerGroup).to({alpha:0},blink_time,"Linear",false)
							var tween4 = game.add.tween(playerGroup).to({alpha:1},blink_time,"Linear",false)
							var tween5 = game.add.tween(playerGroup).to({alpha:0},blink_time,"Linear",false)
							var tween6 = game.add.tween(playerGroup).to({alpha:1},blink_time,"Linear",false)

							tween1.chain(tween2)
							tween2.chain(tween3)
							tween3.chain(tween4)
							tween4.chain(tween5)
							tween5.chain(tween6)

							tween1.start()


							obj.active = false
							game.time.events.add(500,function(){deactivateObject(obj)})
							for(var i = 0; i < usedObjects.length ; i++){
								var obj = usedObjects.children[i]
								obj.active = false
								game.add.tween(obj).to({alpha:0},250,"Linear",true,250)
							}
							game.time.events.add(500,addObject)
							}

					}
				}
				
			}
		}
	}
		
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	function movePlayer(direction){
		
		if(!gameActive || !playerGroup.active){
			return
		}
		
		playerGroup.active = false
		var jumpY = 0
		var offset = 1
		
		//console.log(playerGroup.y + ' posy ' + game.world.centerY)
		switch(direction){
			case 'up':
				
				jumpY = -107
				offset = -1
				
			break;
				
			case 'down':
				
				jumpY = 107

			break;
			
		}
		
		if((playerGroup.y > game.world.centerY + 50 && direction == 'down') || (playerGroup.y < game.world.centerY - 50 && direction == 'up')){
			jumpY = 0
			offset = 0
		}
		
		playerGroup.anim.setAnimationByName(0,"MOVE",false)
		game.add.tween(playerGroup).to({y:playerGroup.y + jumpY, angle:playerGroup.angle + (360 * offset)},100,"Linear",true).onComplete.add(function(){
			playerGroup.active = true
			playerGroup.anim.setAnimationByName(0,"IDLE",true)
			
		})
		sound.play("cut")
		
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
                particle = particlesGroup.create(-200,0,'atlas.puzzle',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
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
		
        var exp = sceneGroup.create(0,0,'atlas.puzzle','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.puzzle','smoke');
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
	
	function createAssets(tag,scale,number){
		
		for( var i = 0; i < number;i++){
			
			var obj = objectsGroup.create(0,0,'atlas.puzzle',tag + 'Base')
			obj.anchor.setTo(0.5,0.5)
			obj.tag = tag
			obj.angle= -angleToUse
			obj.scale.setTo(scale,scale)
			obj.alpha = 0
			obj.active = false
		}
	}
	
	function createObjects(){
				
		objectsGroup = game.add.group()
		sceneGroup.add(objectsGroup)
		
		usedObjects = game.add.group()
		backgroundGroup.add(usedObjects)
		
		createAssets('circle',1,5)
		createAssets('rhombus',1,5)
		createAssets('square',1,5)
		createAssets('triangle',1,5)
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',5)
		createParticles('wrong',1)
		createParticles('text',5)
		createParticles('ring',5)
	}
	
	function createPlayer(){
		
		playerGroup = game.add.group()
		playerGroup.x = 250
		playerGroup.y = game.world.centerY + offWorld
		playerGroup.angle = -angleToUse
		playerGroup.active = true
		backgroundGroup.add(playerGroup)
		
		var figure = game.add.spine(0,30,"figures")
		figure.setAnimationByName(0, "IDLE", true);
        figure.setSkinByName('rhombus');
		playerGroup.add(figure)
		
		playerGroup.anim = figure
		
		var figurePos = playerGroup.create(0,0,'atlas.puzzle','rhombus')
		figurePos.alpha = 0
		figurePos.anchor.setTo(0.5,0.5)
		
		playerGroup.figPos = figurePos
	}
	
	return {
		
		assets: assets,
		name: "puzzle",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			this.swipe = new Swipe(this.game);
			
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createObjects()
			createPlayer()
                        			
            puzzleSong = game.add.audio('puzzleSong')
            game.sound.setDecodedCallback(puzzleSong, function(){
                puzzleSong.loopFull(0.6)
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
			
			buttons.getButton(puzzleSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
	}
}()