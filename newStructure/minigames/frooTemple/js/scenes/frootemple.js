
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var frootemple = function(){
    
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
                name: "atlas.frootemple",
                json: "images/frootemple/atlas.json",
                image: "images/frootemple/atlas.png",
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
			{	name: "laser2",
				file: soundsPath + "laser2.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "gear",
				file: soundsPath + "gear.mp3"},
			{	name: "error",
				file: soundsPath + "error.mp3"},
			{	name: "flipCard",
				file: soundsPath + "flipCard.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background,stars
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 82
	var indexPiece = 0
	var indexGame
    var overlayGroup
    var spaceSong
	var buttonsGroup
	var moveLeft, moveRight	
	var angleSpeed
	var containersGroup, asteroidsGroup, usedAsteroids
	var orbToUse
	var topBar, leftBar, rightBar
	var asteroidList
	var shootNumber
	var leftPresed, rightPressed
	var spineGroup
	var cursors, jumpButton
	var asteroidLimit
	var ruinWall
	
	var colorsToUse = [0x00FD1A,0x0062FF,0xEF00FF,0xFFE600]

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		moveLeft = false
		moveRight = false
		angleSpeed = 0.5
		shootNumber = 0
		leftPresed = false
		rightPressed = false
		asteroidLimit = 3
        
        loadSounds()
		
		orbToUse = null
        
	}

    function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x:0.01, y:0.01},250,Phaser.Easing.linear,true)
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
        
		if((shootNumber + 1) % 3 == 0){
			addAsteroids(game.rnd.integerInRange(1,asteroidLimit))
		}
		
        addNumberPart(pointsBar.text,'+' + number,true)		
        
		if(pointsBar.number % 12 == 0){
			if(asteroidLimit < 12){
				asteroidLimit++
			}
		}
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.frootemple','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.frootemple','life_box')

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
        
		changeSamAnim("LOSE",false, "LOSESTILL")
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2000)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex,KELLOGS_ENUM.SAM)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;
        

        game.load.audio('spaceSong', soundsPath + 'songs/jungle_fun.mp3');
		game.load.spine('sam', "images/spines/sam.json")
        
		game.load.image('howTo',"images/frootemple/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/frootemple/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/frootemple/introscreen.png")
		
		console.log(localization.getLanguage() + ' language')
        
    }
    
    function createOverlay(){
        
		baseGroup.orb.tint = colorsToUse[0]
		
        overlayGroup = game.add.group()
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
                
				addAsteroids(8)
				overlayGroup.y = -game.world.height
				gameActive = true
				
				Phaser.ArrayUtils.shuffle(colorsToUse)
				
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.frootemple','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.frootemple',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, plane.y + plane.height * 0.5,'atlas.frootemple','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        if(obj.tween){
			obj.tween.stop()
		}
		
		obj.tween = game.add.tween(obj.scale).to({x:obj.origScale,y:1},200,"Linear",true)
		
		if(obj.isLeft){
			moveLeft = false
		}else{
			moveRight = false
		}
    }

	function createBackground(){
		
		background = game.add.graphics()
		background.beginFill(0xFFF2A4)
		background.drawRect(-2, -2, game.world.width, game.world.height)
		background.endFill()
		sceneGroup.add(background)

		ruinWall = game.add.tileSprite(0,0,game.world.width, 298,'atlas.frootemple','ruinwall')
		ruinWall.y = game.world.height - 250
		ruinWall.anchor.setTo(0,1)
		sceneGroup.add(ruinWall)

		var bg2 = game.add.tileSprite(0,0,game.world.width, 355,'atlas.frootemple','background_2')
		bg2.y = game.world.height - 60
		bg2.anchor.setTo(0,1)
		sceneGroup.add(bg2)

		var top = game.add.tileSprite(0,0,game.world.width, 381,'atlas.frootemple','Top')
		top.anchor.setTo(0,0)
		sceneGroup.add(top)

		var statue = sceneGroup.create(0,0, "atlas.frootemple", "statue")
		statue.x = game.world.centerX
		statue.y = game.world.height - 150
		statue.anchor.setTo(0.5, 1)
		game.add.tween(statue.scale).to({x:0.96, y:0.98}, 800, Phaser.Easing.Sinusoidal.InOut, true).yoyo(true).loop(true)

		var bg1 = game.add.tileSprite(0,0,game.world.width, 291,'atlas.frootemple','background_1')
		bg1.y = game.world.height - 40
		bg1.anchor.setTo(0,1)
		sceneGroup.add(bg1)
		bg1.update = function () {
			this.tilePosition.x--
		}

		var bgRect = game.add.graphics()
		bgRect.beginFill(0x000000)
		bgRect.drawRoundedRect(0,0, 560, 600, 60)
		bgRect.alpha = 0.3
		bgRect.endFill()
		sceneGroup.add(bgRect)
		bgRect.x = game.world.centerX - bgRect.width * 0.5
		bgRect.y = 60
		
		// stars = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.frootemple','stars')
		// sceneGroup.add(stars)
		
	}
	
	
	function update(){
		ruinWall.tilePosition.x+=0.5
		
		if(gameActive){
			
			baseGroup.orb.angle+=3
			
			if(game.device.desktop){
				
				if(cursors.left.isDown){
					moveLeft = true
					if(!leftPresed)
						moveWheel()
					leftPresed = true
				}else if(cursors.right.isDown){
					moveRight = true
					if(!rightPressed)
						moveWheel()
					rightPressed = true
				}
				
				if(cursors.left.isUp && leftPresed){
					if(moveLeft)
						changeSamAnim("IDLE", true)
					moveLeft = false
					leftPresed = false
				}
				
				if(cursors.right.isUp && rightPressed){
					if(moveRight)
						changeSamAnim("IDLE", true)
					moveRight = false
					rightPressed = false
				}
			} 
			
			if(jumpButton.isDown){
				shootOrb(baseGroup.machine.cont)
			}
			
			if(moveLeft){
				
				if(baseGroup.lineGroup.angle >-40){
					baseGroup.lineGroup.angle-= angleSpeed
					baseGroup.angleNumber+=angleSpeed
					
					// baseGroup.text.setText(Math.round(baseGroup.angleNumber) + '°')
				}
				
			}else if(moveRight){
				if(baseGroup.lineGroup.angle < 40){
					baseGroup.lineGroup.angle+= angleSpeed
					baseGroup.angleNumber-= angleSpeed
					
					// baseGroup.text.setText(Math.round(baseGroup.angleNumber) + '°')
				}
				
			}
			
		}
		
		checkObjects()
	}
	
	function checkCollision(){
		
		if(orbToUse){
						
			if(orbToUse.tween){
				orbToUse.tween.stop()
			}
			
			for(var i = 0; i < containersGroup.length;i++){
				
				var cont = containersGroup.children[i]
				if(checkOverlap(cont,orbToUse) && (Math.abs(cont.x - orbToUse.x) < 45 && Math.abs(cont.y - orbToUse.y) < 45) && !cont.used){
					//console.log('collision cont')
					activateObject(orbToUse,cont.x, cont.y)
					
					sound.play('gear')
					createPart('ring',orbToUse)
					
					cont.used = true
					orbToUse.cont = cont

					asteroidList = []
					
					for(var i = 0; i < usedAsteroids.length;i++){
						usedAsteroids.children[i].check = false
					}
					
					checkAllAsteroids(orbToUse)
					
					checkDestroy()
					
					checkPos(orbToUse)
					
					orbToUse = null
					break
				}
			}
			
			if(orbToUse){
				sound.play("error")
				createPart('wrong',orbToUse)
				deactivateObject(orbToUse)
				orbToUse = null
				restartOrb()
				addAsteroids(1)
			}
		}
		
	}
	
	function checkDestroy(){
		
		//console.log(asteroidList.length + ' length')
		if(asteroidList.length >= 4){
			
			for(var i = 0; i < asteroidList.length;i++){
				
				var asteroid = asteroidList[i]
				
				deactivateObject(asteroid)
				createPart('star',asteroid)
				sound.play('magic')
			}
			
			addPoint(asteroidList.length)
			
			changeSamAnim("WIN",false,"IDLE")
			spineGroup.moving = false
			
			game.time.events.add(250,checkSimple)
		}
	}
	
	function checkSimple(){
		
		asteroidList = []
		
		for(var i = 0; i < usedAsteroids.length;i++){
			
			var asteroid = usedAsteroids.children[i]
			
			for(var u = 0; u < usedAsteroids.length;u++){
				
				var obj = usedAsteroids.children[u]
				
				if(asteroid.index != obj.index){
					if(Math.abs(obj.x - asteroid.x) < obj.width * 1.2){
						if(asteroid.y - obj.y > 0 && asteroid.y - obj.y < 90){
							//console.log('up exists')
							break
						}
						
					}
				}
				
				if(asteroid.y < 120){
							
					break
				}
				
				if(u == usedAsteroids.length - 1){
					
					asteroidList[asteroidList.length] = asteroid
					setBot(asteroid)
				}

			}
		}
		
		for(var i = 0; i < asteroidList.length;i++){
			
			var asteroid = asteroidList[i]
			hideAsteroid(asteroid)
		}
		
		//console.log(asteroidList.length + ' length')
		
	}
	
	function setBot(asteroid){
		
		for(var i = 0; i < usedAsteroids.length;i++){
			
			var obj = usedAsteroids.children[i]
			
			if(asteroid.index != obj.index){
				
				if(Math.abs(obj.x - asteroid.x) < obj.width * 1.5){
					if(asteroid.y - obj.y < 0){
						asteroidList[asteroidList.length] = obj
				
					}

				}
			}
		}
	}
	
	function hideAsteroid(asteroid){
		
		game.add.tween(asteroid).to({alpha:0,y:asteroid.y+100},500,"Linear",true).onComplete.add(function(){
			deactivateObject(asteroid)
		})
	}
	
	function checkAllAsteroids(obj){
        
        obj.check = true
		asteroidList[asteroidList.length] = obj
        
        for(var i = 0; i < usedAsteroids.length;i++){
            
            var asteroid = usedAsteroids.children[i]
            
            if(!asteroid.check && obj.tint == asteroid.tint){
                
                if(Math.abs(obj.x - asteroid.x) < obj.width){
                    if(Math.abs(obj.y - asteroid.y) < obj.width * 1.5){
                        checkAllAsteroids(asteroid)
                    }
                }else if(Math.abs(obj.y - asteroid.y) < obj.height){
                    if(Math.abs(obj.x - asteroid.x) < obj.width * 1.5){
                        checkAllAsteroids(asteroid)
                    }
                }
            }
            
            
            
        }
    }
	
	function checkObjects(){
		
		if(orbToUse){
			
			if(orbToUse && (checkOverlap(orbToUse,leftBar) || checkOverlap(orbToUse,rightBar))){
				
				if(orbToUse.tween){
					orbToUse.tween.stop()
				}
				
				sound.play("error")
				//createPart('ring',orbToUse)
				createPart('wrong',orbToUse)
				
				deactivateObject(orbToUse)
				orbToUse = null
				restartOrb()
				addAsteroids(1)
			}
			
			for(var i = 0; i < usedAsteroids.length;i++){
				
				var asteroid = usedAsteroids.children[i]
				
				if(orbToUse && checkOverlap(orbToUse,asteroid)){
					
					checkCollision()
					break
				}
			}
			
			if(orbToUse && checkOverlap(orbToUse,topBar)){
				console.log("topBarCollision")
				checkCollision()
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
    
    function createPart(key,obj,offsetX){
        
        var offX = offsetX || 0
        key+='Part'
        var particle = lookParticle(key)
		
		if(key == 'ringPart'){
			particle.tint = obj.tint
		}
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
                particle = particlesGroup.create(-200,0,'atlas.frootemple',tag)
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
		createParticles('ring',5)

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
		
        var exp = sceneGroup.create(0,0,'atlas.frootemple','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.frootemple','smoke');
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
				
		if(obj.isLeft){
			moveLeft = true
		}else{
			moveRight = true
		}

		moveWheel()
		
		sound.play("flipCard")
		
		if(obj.tween){
			obj.tween.stop()
		}
		
		obj.tween = game.add.tween(obj.scale).to({x:obj.origScale * 0.7,y:0.7},200,"Linear",true)
		
	}
	
	function changeSamAnim(name,loop,name2){
		
		if(name2){
			loop = false
		}
		
		for(var i = 0; i < spineGroup.length;i++){
			var sam = spineGroup.children[i]
			sam.setAnimationByName(0,name,loop)
			
			if(name2){
				sam.addAnimationByName(0,name2,true)
			}
		}
	}

	function moveWheel(){
		for(var i = 0; i < spineGroup.length;i++){
			var sam = spineGroup.children[i]
			console.log(moveLeft, moveRight)
			// if(!spineGroup.moving){
				if((moveLeft)||(moveRight)){
					spineGroup.moving = true
					var entry = sam.setAnimationByName(0,"MOVE_WEEL",false)
					entry.onComplete = function(){
						spineGroup.moving = false
						moveWheel()
					}
				}else{
					spineGroup.moving = false
					sam.setAnimationByName(0,"IDLE",false)
				}
			// }
		}
	}
	
	function createBase(){
		
		baseGroup = game.add.group()
		baseGroup.x = game.world.centerX
		baseGroup.y = game.world.height
		sceneGroup.add(baseGroup)
		
		// var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#FFB25F", align: "center"}
		// var pointsText = new Phaser.Text(sceneGroup.game, 5, -63, baseGroup.angleNumber + '°', fontStyle)
		// pointsText.anchor.setTo(0.5,0.5)
		// baseGroup.add(pointsText)
		//
		// baseGroup.text = pointsText

		var machine = game.add.group()
		machine.y = -70
		baseGroup.add(machine)

		var cont = machine.create(0,0,'atlas.frootemple','launcher')
		cont.anchor.setTo(0.5,0.7)
		cont.inputEnabled = true
		cont.events.onInputDown.add(shootOrb)
		machine.cont = cont

		var lineGroup = game.add.group()
		machine.add(lineGroup)
		lineGroup.y = -230
		baseGroup.lineGroup = lineGroup

		var arrow = lineGroup.create(0,0,'atlas.frootemple','arrowLine')
		arrow.anchor.setTo(0.5,1)
		baseGroup.upLine = arrow

		baseGroup.machine = machine

		var orb = machine.create(0,-230,'atlas.frootemple','frootpop')
		orb.anchor.setTo(0.5,0.5)
		baseGroup.orb = orb

		var point = lineGroup.create(0,-game.world.height * 0.9,'atlas.frootemple','frootpop')
		point.anchor.setTo(0.5,0.5)
		point.alpha = 0
		baseGroup.point = point
		
		var angleLine = sceneGroup.create(0,0,'atlas.frootemple','arrowLine')
		angleLine.anchor.setTo(0.5,1)
		angleLine.scale.y = 0.7
		angleLine.angle = 90
		angleLine.alpha = 0
		
		baseGroup.angleLine = angleLine
		
		var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var angleText = new Phaser.Text(sceneGroup.game, 0,0,"", fontStyle)
		angleText.anchor.setTo(0.5,0.5)
		angleText.alpha = 0
        sceneGroup.add(angleText)
		
		baseGroup.angleText = angleText

	}
	
	function getAsteroid(){
		
		for(var i = 0; i < asteroidsGroup.length;i++){
			
			var asteroid = asteroidsGroup.children[i]
			if(!asteroid.used){
				
				return asteroid	
			}
		}
	}
	
	function activateObject(obj, posX, posY){
			
		obj.used = true
		obj.alpha = 1
		obj.index = indexPiece
		
		indexPiece++
		
		obj.x = posX
		obj.y = posY
		
		asteroidsGroup.remove(obj)
		usedAsteroids.add(obj)
		
		restartOrb()
		
		
	}
	
	function deactivateObject(obj){
		
		obj.x = game.world.centerX
		obj.y = game.world.centerY
		
		obj.used = false
		obj.alpha = 0
		
		if(obj.cont){
			obj.cont.used = false
			obj.cont = null
		}
		
		usedAsteroids.remove(obj)
		asteroidsGroup.add(obj)
		
		//restartOrb()
		
		//console.log('deactivate')
	}
	
	function restartOrb(){
		
		var orb = baseGroup.orb
		
		Phaser.ArrayUtils.shuffle(colorsToUse)
		orb.tint = colorsToUse[0]
		
		game.add.tween(orb).to({alpha:1},250,"Linear",true).onComplete.add(function(){
			
			if(lives>0){
				gameActive = true
			}
			
		})
	}
	
	function shootOrb(obj){
				
		if(!gameActive){
			return
		}
		
		// var tween = game.add.tween(baseGroup.text.scale).to({x:1.4,y:1.4},200,"Linear",true)
		// tween.yoyo(true,0)
		
		// changeSamAnim("SHOOT",false,"IDLE")
		
		// var angLine = baseGroup.angleLine
		// angLine.x = baseGroup.upLine.world.x
		// angLine.y = baseGroup.upLine.world.y
		//
		// var angText = baseGroup.angleText
		// angText.x = angLine.x + 100
		// angText.y = angLine.y - 45
		// angText.setText(baseGroup.text.text)
		//
		// if(angLine.tween){
		// 	angLine.tween.stop()
		// }
		//
		// if(angText.tween){
		// 	angText.tween.stop()
		// }
		//
		// angLine.alpha = 1
		// angText.alpha = 1
		//
		// angLine.tween = game.add.tween(angLine).to({alpha:0},500,"Linear",true,500)
		// angText.tween = game.add.tween(angText).to({alpha:0},500,"Linear",true,500)
		
		shootNumber++
		orbToUse = null
		gameActive = false
		
		sound.play('shoot')
		sound.play("laser2")
		
		var orb = baseGroup.orb
		
		createPart('ring',orb)
		
		var asteroid = getAsteroid()
		
		if(asteroid.tween){
			asteroid.tween.stop()
		}
		
		asteroid.alpha = 1
		asteroid.tint = orb.tint
		asteroid.x = orb.world.x
		asteroid.y = orb.world.y
		
		var tweenMachine = game.add.tween(obj.scale).to({x:0.7,y:0.7},200,"Linear",true)
		tweenMachine.yoyo(true,0)
		
		game.add.tween(baseGroup.orb).to({alpha:0},250,"Linear",true)
		
		asteroid.tween = game.add.tween(asteroid).to({x:baseGroup.point.world.x,y:baseGroup.point.world.y},700,"Linear",true)
		
		game.time.events.add(50,function(){
			orbToUse = asteroid
		})
		
		
	}
	
	function createContainers(){
		
		topBar = sceneGroup.create(0,0,'atlas.frootemple','minusbar')
		topBar.width = game.world.width
		topBar.height*=0.4
		topBar.alpha = 0

		leftBar = sceneGroup.create(game.world.centerX - 320,50,'atlas.frootemple','plusbar')
		leftBar.anchor.setTo(0,0.5)
		leftBar.angle = 90
		leftBar.height*= 0.4
		leftBar.width = game.world.height * 0.7
		leftBar.alpha = 0

		rightBar = sceneGroup.create(game.world.centerX + 320,50,'atlas.frootemple','plusbar')
		rightBar.anchor.setTo(0,0.5)
		rightBar.angle = 90
		rightBar.height*= -0.4
		rightBar.width = game.world.height * 0.7
		rightBar.alpha = 0
		
		containersGroup = game.add.group()
		sceneGroup.add(containersGroup)
		
		asteroidsGroup = game.add.group()
		sceneGroup.add(asteroidsGroup)
		
		usedAsteroids = game.add.group()
		sceneGroup.add(usedAsteroids)
		
		var pivotX = game.world.centerX - 225
		var pivotY = 100
		
		for(var i = 0; i < 9; i++){
			
			for(var u = 0; u < 6;u++){
				
				var container = containersGroup.create(pivotX, pivotY,'atlas.frootemple','frootpop')
				container.anchor.setTo(0.5,0.5)
				container.scale.setTo(0.95,0.95)
				container.alpha = 0
				container.used = false
				pivotX+=container.width * 1.2
				
				var asteroid = asteroidsGroup.create(-200,0,'atlas.frootemple','frootpop')
				asteroid.anchor.setTo(0.5,0.5)
				asteroid.alpha = 0
				asteroid.used = false
			}
			
			if((i+1) % 2 == 0){
				pivotX = game.world.centerX - 225
			}else{
				pivotX = game.world.centerX - 187
			}
			
			pivotY+= 65
						
		}
		
	}
	
	function checkPos(asteroid){

		if(checkOverlap(asteroid,baseGroup.orb)){
			createPart('wrong',baseGroup.orb)
			missPoint()
		}
	}
	
	function addAsteroids(number){
		
		var index = 0
		var delay = 0
		
		//console.log(number + ' number')
		for(var i = 0; i < number;i++){
			
			var asteroid = getAsteroid()
			
			while(containersGroup.children[index].used){
				index++
			}
			
			
			Phaser.ArrayUtils.shuffle(colorsToUse)
			
			var cont = containersGroup.children[index]
			asteroid.cont = cont
			asteroid.cont.used = true
			asteroid.tint = colorsToUse[0]
			activateObject(asteroid,cont.x, cont.y)
			asteroid.alpha = 0
			
			popObject(asteroid,delay)
			
			delay+= 100
			
			checkPos(asteroid)
		}
	}
	
	return {
		
		assets: assets,
		name: "frootemple",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			cursors = game.input.keyboard.createCursorKeys()
			jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			sceneGroup = game.add.group();
			// yogomeGames.mixpanelCall("enterGame",gameIndex);


			createBackground()
			createContainers()
			createBase()
			spineGroup = game.add.group()
			spineGroup.x = game.world.centerX
			spineGroup.y = game.world.height - 20
			sceneGroup.add(spineGroup)

			var sam = game.add.spine(-135, 0,"sam")
			// sam.scale.setTo(0.5,0.5)
			spineGroup.add(sam)
			sam.setSkinByName("normal")

			changeSamAnim("IDLE",true)

			var container = game.add.tileSprite(0,game.world.height,game.world.width, 136,'atlas.frootemple','front_2')
			container.anchor.setTo(0,1)
			sceneGroup.add(container)
			container.tilePosition.x = game.world.width * 0.5 - 509 * 0.5

			var frontStoneLeft = sceneGroup.create(0,game.world.height, 'atlas.frootemple','front_1')
			frontStoneLeft.x = -50
			frontStoneLeft.anchor.setTo(0,1)

			var frontStoneRight = sceneGroup.create(game.world.width,game.world.height, 'atlas.frootemple','front_1')
			frontStoneRight.x += 50
			frontStoneRight.anchor.setTo(1,1)

			buttonsGroup = game.add.group()
			buttonsGroup.x = game.world.centerX
			buttonsGroup.y = game.world.height
			sceneGroup.add(buttonsGroup)

			var pivotX = -150
			for(var i = 0; i < 2; i++){

				var button = buttonsGroup.create(pivotX,-70,'atlas.frootemple','arrow')
				button.anchor.setTo(0.5,0.5)
				button.inputEnabled = true
				button.events.onInputDown.add(inputButton)
				button.events.onInputUp.add(releaseButton)
				button.tween = null
				button.isLeft = true

				pivotX+= 300

				if(i > 0){
					button.isLeft = false
				}else {
					button.scale.x*=-1
				}

				button.origScale = button.scale.x
			}

			baseGroup.angleNumber = 90
			addParticles()
                        			
            spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.5)
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