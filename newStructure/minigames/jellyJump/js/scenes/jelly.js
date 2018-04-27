var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"

var jelly = function(){
    
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
                name: "atlas.jelly",
                json: "images/jelly/atlas.json",
                image: "images/jelly/atlas.png",
            },

        ],
        images: [
        	{
        		name:'barra',
        		file:"images/jelly/barra.png"
        	}

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
			{	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
			{	name: "powerup",
				file: soundsPath + "powerup.mp3"},
			
		],
    }
    
	var DEBUG_PHYSICS = false
	var JUMP_FORCE = 500
	var WORLD_GRAVITY = 1400
	var ANGLE_VALUE = 2
	var OFFSET_OBJS = 650
	var INITIAL_LIVES =3
	
	var colorsToUse = [0xFA2038, 0x3B55D3,0x41E07B,0xFFF129]
	var listObstacles = ['bar', 'circle']
	var numbersToUse = ['16','8','4','2']
        
	var pivotObjects
    var lives = null
	var sceneGroup = null
	var background, background2
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 56
	var indexGame
    var overlayGroup
    var spaceSong
	var player, fishGroup
	var objectsGroup, usedObjects
	var jumpButton
	var playersNumber, playerIndex
	var lastObject

	var goalText
	var currentDecimal
	
	var objectsUpdate
	var hasJump
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        playerIndex = 0
		lastObject = null
		currentDecimal = 0
		hasJump = false
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.jelly','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.jelly','life_box')

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
    
	function fallPlayer(){
		
		game.add.tween(characterGroup).to({y:characterGroup.y-100, angle: characterGroup.angle + 360},500,"Linear",true).onComplete.add(function(){
			game.add.tween(characterGroup).to({y:game.world.height * 1.4},400,"Linear",true,500)
		})
		
	}
	
    function stopGame(win){
        
		characterGroup.anim.setAnimationByName(0,"LOSE",true)
		
		fallPlayer()
		sound.play("wrong")
		sound.play("gameLose")
		
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
    
    
    function preload(){
        

		
        game.stage.disableVisibilityChange = false;
        
        game.load.spine('player', "images/spines/jellyfish.json")  
		game.load.spine('fish',"images/spines/fish.json")
        game.load.audio('spaceSong', soundsPath + 'songs/bubble_fishgame.mp3');
        
		/*game.load.image('howTo',"images/jelly/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/jelly/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/jelly/introscreen.png")*/

		game.load.image('tutorial_image',"images/jelly/tutorial_image.png")
		//loadType(gameIndex)

		
		console.log(localization.getLanguage() + ' language')
        
    }
    
	function getObstacle(tag){
		
		for(var i = 0; i < objectsGroup.length;i++){
			
			var obj = objectsGroup.children[i]
			if(obj.type == tag && !obj.used){
				return obj
			}
		}
	}
	
	function addObjects(){
		
		Phaser.ArrayUtils.shuffle(listObstacles)
		var tag = listObstacles[0]
		if(!lastObject){
			tag = 'bar'
		}
		
		var obstacle = getObstacle(tag)
		
		var pivotX = 0
		var offset = 1
		if(tag == 'circle'){
			pivotX = game.world.centerX
			offset = 1.2
		}
		
		if(lastObject){
			pivotObjects = lastObject.y - (OFFSET_OBJS * offset)
		}else{
			pivotObjects = game.world.centerY -200
		}
		
		if(lastObject && lastObject.type == 'circle'){
			pivotObjects*= 1.05
		}
		
		activateObstacle(obstacle,pivotX,pivotObjects)
		
		lastObject = obstacle
		
	}
	
	function activateObstacle(obstacle, posX, posY){
		obstacle.alpha = 1
		obstacle.x = posX
		obstacle.y = posY
		obstacle.used = true
		
		if(obstacle.type == 'circle'){
			for(var i = 0; i < obstacle.fishes.length; i++){
				//objectsUpdate.remove(obstacle.fishes[i])
				obstacle.add(obstacle.fishes[i])
			}
			obstacle.disable = false
		}
		for(var i = 0; i < obstacle.length;i++){
			
			var obj = obstacle.children[i]
			obj.alpha = 1
			if(obstacle.type == 'bar'){
				obj.x = obj.initX
				
				obj.spine.scale.setTo(1,1)
				//obj.x = obstacle.children[i].startPos
				obj.direction = 1
				obj.disable = false
				obj.angle = 0
				obj.scale.setTo(obstacle.children[i].startScale,obstacle.children[i].scale.y)
				
			}
			else if(obstacle.type=='circle'){
				obstacle.angle = 0

				obj.spine.scale.setTo(1,1)
				obj.x = obstacle.children[i].startPos.x
				obj.y = obstacle.children[i].startPos.y
				obj.angle = obstacle.children[i].starterAngle
				obj.scale.setTo(obstacle.children[i].startScale,obstacle.children[i].scale.y)
				obj.direction = 1
				
			}
		}
		
		obstacle.lastObject = obstacle.origLast
		
		objectsGroup.remove(obstacle)
		usedObjects.add(obstacle)
		
	}
	
	function deactivateObstacle(obstacle){
		
		obstacle.alpha = 0
		obstacle.used = false
		
		usedObjects.remove(obstacle)
		objectsGroup.add(obstacle)
		
	}
	
    function createOverlay(){
        
		for(var i = 0; i < 3;i++){
			addObjects()
		}
		
        overlayGroup = game.add.group()
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
        
        
    }

    function onClickPlay(){
    	gameActive = true
		overlayGroup.y = -game.world.height
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0, game.world.width,game.world.height,'atlas.jelly','swatch')
		sceneGroup.add(background)
		
		background2 = game.add.tileSprite(0,0, game.world.width,game.world.height,'atlas.jelly','swatch2')
		sceneGroup.add(background2)
		
		
	}
	
	function update(){
	
		background.tilePosition.x--
		background2.tilePosition.x+= 0.5
		
		if(!gameActive){
			return
		}
		
		positionPlayer()
		checkObjects()
		
	}
	
	function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	function scoreUp(){
		
		addPoint(1)
		createPart('star',player)
	
		/*playerIndex++
		
		if(playerIndex == 4){
			playerIndex = 0
			
			characterGroup.number = numbersToUse[playerIndex]
			characterGroup.numberText.setText(1)
			
			game.time.events.add(750,function(){
				
				sound.play("powerup")
				
				game.add.tween(characterGroup).to({angle:characterGroup.angle + 360},500,"Linear",true)
				characterGroup.numberText.setText(characterGroup.number)
			})
			
		}else{
			characterGroup.number = numbersToUse[playerIndex]
			characterGroup.numberText.setText(characterGroup.number)
		}*/

		if(goalText.value == numbersToUse[currentDecimal]){
			currentDecimal++
			if(currentDecimal>=numbersToUse.length){
				currentDecimal = 0
			}

			characterGroup.number = goalText.value
			characterGroup.numberText.setText(1)

			game.time.events.add(750,function(){
				sound.play("powerup")
				game.add.tween(characterGroup).to({angle:characterGroup.angle + 360},500,"Linear",true)
				characterGroup.number = 1
				characterGroup.numberText.setText(characterGroup.number+'/'+numbersToUse[currentDecimal])
			})

			goalText.value = 1

			changeDecimal()

		}
		else{
			characterGroup.number = goalText.value
			characterGroup.numberText.setText(characterGroup.number+'/'+numbersToUse[currentDecimal])
		}


		goalText.value+=game.rnd.integerInRange(1,4)
		if(goalText.value > numbersToUse[currentDecimal]){
			goalText.value = numbersToUse[currentDecimal]
		}

		goalText.setText(goalText.value+'/'+numbersToUse[currentDecimal])
		
		
	}

	function changeDecimal(){
		for(var i = 0; i < usedObjects.length;i++){
			var object = usedObjects.children[i]
			var tag = object.type
			
			for(var u = 0;u<object.length;u++){
				var obj = object.children[u]
				obj.numberText.setText(obj.number+'/'+numbersToUse[currentDecimal])
			}
			
		}
	}
	
	function checkObjects(){
		
		for(var i = 0; i < usedObjects.length;i++){
			
			var object = usedObjects.children[i]
			var tag = object.type
			if(tag == 'bar'){

				//object.x += (ANGLE_VALUE*obj.direction)
				for(var u = 0;u<object.length;u++){

					var obj = object.children[u]
					obj.x +=( ANGLE_VALUE*obj.direction)
					if(!obj.disable){
						if(obj.numberText.world.x > game.world.width + 100){
							//console.log('last object')
							obj.x = object.lastObject.x - obj.width *1.5
							object.lastObject = obj
						}
					}
					else{
						if(obj.numberText.world.x > game.world.width + 100){
							obj.direction = 0
						}
						else if(obj.numberText.world.x < - 100){
							obj.direction = 0
						}
					}
					
					if(checkOverlap(obj.numberText,player) && obj.alpha == 1){
						if((obj.number+characterGroup.number) == goalText.value){
							scoreUp()
							obj.alpha = 0
						}else{
							obj.alpha = 0
							missPoint()
							createPart('wrong',player)
						}

						moveBar(object)

						//break
					}


				}
				
			}else if(tag == 'circle'){
				if(!object.disable){
					object.angle-= ANGLE_VALUE * 0.7

					for(var u = 0; u < object.length;u++){
						
						var obj = object.children[u]

						if(object.disable){
							obj.x += (ANGLE_VALUE*obj.direction)


							if(obj.numberText.world.x > game.world.width + 100){
								obj.direction = 0
							}
							else if(obj.numberText.world.x < - 100){
								obj.direction = 0
							}

						}

						if(checkOverlap(obj.numberText,player) && obj.alpha == 1){
							if((obj.number+characterGroup.number) == goalText.value){
								scoreUp()
								obj.alpha = 0
							}else{
								characterGroup.anim.setAnimationByName(0,"LOSE",true)
								obj.alpha = 0
								missPoint()
								createPart('wrong',player)
							}

							moveCircle(object)
							//break
						}
					}
				}
			}
			
			if(object.y + usedObjects.y > game.world.height * 1.2){
				addObjects()
				deactivateObstacle(object)
				console.log('deactivate object')
			}
		}



		for(var i = 0; i < objectsUpdate.length; i++){
			objectsUpdate.children[i].x +=(ANGLE_VALUE*objectsUpdate.children[i].direction)
			if(objectsUpdate.children[i].numberText.world.x > game.world.width + 100){
				objectsUpdate.children[i].direction = 0
				//objectsUpdate[i].group.add(objectsUpdate[i])

			}
			else if(objectsUpdate.children[i].numberText.world.x < - 100){
				objectsUpdate.children[i].direction = 0 
				//objectsUpdate[i].group.add(objectsUpdate[i])
			}
		}
		
		var posY = game.world.centerY
        if(player.body.y <= posY){

            var value = (posY) - player.body.y
            
            value*=0.8
            
            usedObjects.y+=value
            player.body.y+=value

            for(var i = 0; i < objectsUpdate.length; i++){
           		objectsUpdate.children[i].y +=value
            }
			
			background.tilePosition.y+= value * 0.5
        }
		
	}
	
	function moveBar(group){
		for(var i = 0; i < group.length; i++){
			var obj = group.children[i]
			//obj.numberText.visible = false
			if(obj.x < player.x){
				//obj.angle = 180
				obj.direction = -1
				obj.scale.setTo(-obj.startScale,obj.scale.y)
				obj.spine.scale.setTo(-1,1)
			}
			else{
				obj.direction = 1
			}

			obj.disable = true
		}

	}

	function moveCircle(group){
		group.disable = true

		for(var i = group.length-1; i >= 0; i--){
			var obj = group.children[i]
			var x = obj.worldPosition.x
			var y = obj.worldPosition.y
			group.remove(obj)
			objectsUpdate.add(obj)
			obj.x = x
			obj.y = y
			//obj.numberText.visible = false
			if(obj.worldPosition.x < player.x){
				obj.angle = 0
				obj.direction = -1
				obj.scale.setTo(-obj.startScale,obj.scale.y)
				obj.spine.scale.setTo(-1,1)
			}
			else{
				obj.angle = 0
				obj.direction = 1
			}

		}
	}

	function positionPlayer(){
		characterGroup.y = player.body.y + 35
		if(hasJump){
			
			if(player.body.y > game.world.height * 0.75 ){
				if(usedObjects.y > 5){
					createPart('wrong',player)
					missPoint()
				}
				hasJump = false
				
			}
		}
		else{
			if(player.body.y < game.world.height * 0.75){
				hasJump = true
			}
		}
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

				particle.makeParticles('atlas.jelly',tag);
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
		
		createParticles('star',4)
		createParticles('wrong',1)
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
		
        var exp = sceneGroup.create(0,0,'atlas.jelly','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.jelly','smoke');
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
	
	function doJump(value){
        
        var jumpValue = value
        
		characterGroup.anim.setAnimationByName(0,"JUMP",false)
		characterGroup.anim.addAnimationByName(0,"IDLE",true)
		
        if(jumpValue == null){ jumpValue = JUMP_FORCE}
        sound.play("whoosh")

        if(game.physics.p2.gravity.y == 0){
            game.physics.p2.gravity.y = WORLD_GRAVITY
            //marioSong.loopFull(0.5)
        }
        
        player.body.moveUp(jumpValue)        
    }
	
	function inputButton(obj){
        
        if(gameActive == false){
            return
        }
        
        //sound.play("click")
        
        jumping = true
        doJump()
        
    }
    
    function releaseButton(obj){
        
        jumping = false
    }
	
	function createPlayer(){
		
		playerIndex = 0
		
		characterGroup = game.add.group()
		characterGroup.x = game.world.centerX
		characterGroup.y = game.world.height * 0.75
		sceneGroup.add(characterGroup)

		var anim = game.add.spine(0,0,"player")
		anim.setSkinByName('normal')
		anim.setAnimationByName(0,"IDLE",true)
		characterGroup.add(anim)
		characterGroup.anim = anim
		
		characterGroup.number = 1
		
		var slot = getSpineSlot(anim,"empty")
		
		var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var numberText = new Phaser.Text(game, 0, 0, characterGroup.number+'/'+numbersToUse[currentDecimal], fontStyle)
		numberText.anchor.setTo(0.5, 0.5)
		characterGroup.numberText = numberText
		slot.add(numberText)
		
		player = sceneGroup.create(characterGroup.x, characterGroup.y,'atlas.jelly','button')
		player.anchor.setTo(0.5,1)
		player.scale.setTo(0.8,0.8)
		player.alpha = 0
		game.physics.p2.enable(player,DEBUG_PHYSICS)
		player.body.fixedRotation = true
		player.body.mass=50
		player.lastpos = player.y

		player.body.collideWorldBounds = true;

		var body = new p2.Body({ mass: 0, position: [ game.physics.p2.pxmi(0), game.physics.p2.pxmi(game.world.height*0.8) ] });
		game.physics.p2.world.addBody(body);
		body.addShape(new p2.Plane());


		
	}
	
	function createButtons(){
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(inputButton)
		rect.events.onInputUp.add(releaseButton)
		sceneGroup.add(rect)
		
	}
	
	function createObjects(){
		
		objectsGroup = game.add.group()
		sceneGroup.add(objectsGroup)
		
		usedObjects = game.add.group()
		sceneGroup.add(usedObjects)
		
		createObstacle('bar',5)
		createObstacle('circle',5)
		
	}
	
	function getSpineSlot(spine, slotName){
		
		var slotIndex
		for(var index = 0, n = spine.skeletonData.slots.length; index < n; index++){
			var slotData = spine.skeletonData.slots[index]
			if(slotData.name === slotName){
				slotIndex = index
			}
		}

		if (slotIndex){
			return spine.slotContainers[slotIndex]
		}
	}
	
	function colorSpine(spine,tint){
		
		spine.globalTint = tint;
		var slots = spine.skeleton.slots;
		for (var i = 0; i < slots.length; i++) {
			var slot = slots[i];
			//slot.currentSprite.tint = tint;
		}
	}
	
	function calcCircles(n) {
        
        group = game.add.group()
        group.disable = false
        
        var baseRadius = 80
        var angle = Math.PI / n;
        var s = Math.sin(angle);
        var r = baseRadius * s / (1-s);

		var index = 0
		var angles = [60,120, 220, 340]

		var values = [1,2,3,4]

		group.fishes = []

        for(var i=0;i<n;++i) {
			
            var phi = 15 + angle * i * 2;
            var cx = baseRadius + (baseRadius) + (baseRadius + r) * Math.cos(phi);
            var cy = baseRadius + (baseRadius) + (baseRadius + r) * Math.sin(phi);
            
            var group1 = game.add.group()
			group1.x = cx
			group1.y = cy
			
			group.fishes.push(group1)
			
			group1.direction = 1

			group.add(group1)
			group1.angle = angles[i]
			group1.starterAngle = angles[i]
			group1.startScale = 1

			var spine = game.add.spine(0,0,"fish")
			spine.setSkinByName("normal")
			spine.setAnimationByName(0,"IDLE",true)
			group1.add(spine)
			//group1.spine = spine
			
			//group1.angle = angle

			spine.autoUpdateTransform()
			spine.setTint(colorsToUse[index])

			var random = game.rnd.integerInRange(0,values.length-1)
			group1.number = values[random]
			values.splice(random,1)
			
			var slot = getSpineSlot(spine,"empty")

			var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
			var numberText = new Phaser.Text(game, 0, 5, group1.number+'/'+numbersToUse[currentDecimal], fontStyle)
			numberText.anchor.setTo(0.5, 0.5)
			group1.numberText = numberText
			var groupText = game.add.group()
			groupText.add(numberText)
			group1.spine = groupText
			slot.add(groupText)
			
			index++
			if(index>3){
				index = 0
			}
        }
                
        return group
    }
	
	function createObstacle(type,number){
		
		var index = 0
		for(var u = 0; u < number; u++){
			
			var group 
			if(type == 'bar'){
								
                group = game.add.group()
				group.y = - 100
				group.alpha = 0
				group.used = false
				group.type = type
				objectsGroup.add(group)

                var pivotX = game.world.width - 60
                var indexColor = 0
                var length = 8

                var values = [1,2,3,4]

                for(var i = 0; i<length;i++){

                    var group1 = game.add.group()
					group1.x = pivotX
					group1.initX = pivotX
					group1.y = 0
					group.add(group1)
					group1.disable = false
					group1.direction = 1
					group1.startPos = pivotX
					group1.startScale = 1
					
					var spine = game.add.spine(0,0,"fish")
					spine.setSkinByName("normal")
					spine.setAnimationByName(0,"IDLE",true)
					group1.add(spine)
					
					
					spine.autoUpdateTransform()
					spine.setTint(colorsToUse[index])
					
					var slot = getSpineSlot(spine,"empty")

					var r = game.rnd.integerInRange(0,values.length-1)
					group1.number = values[r]

					values.splice(r,1)
					if(values.length<=0){
						values = [1,2,3,4]
					}
					
					var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
					var numberText = new Phaser.Text(game, 0, 5, group1.number+'/'+numbersToUse[currentDecimal], fontStyle)
					numberText.anchor.setTo(0.5, 0.5)
					group1.numberText = numberText
					var groupText = game.add.group()
					groupText.add(numberText)
					group1.spine = groupText
					slot.add(groupText)
					
                    if(i == length-1){
                        group.lastObject = group1
						group.origLast = group1
                    }
                    pivotX -= group1.width * 1.5
					
					index++
					if(index>3){
						index = 0
					}
                }
			}else if(type == 'circle'){
				
				group = calcCircles(4)
				group.type = type
				group.y = -200
				group.alpha = 0
				group.used = false

                var value = -173
                var valueY = -173
                
                var index = 0
                for(var i = 0; i<group.length ;i++){
                    var obj = group.children[i]
                    
                    obj.x+=value
                    obj.y+=valueY

                    obj.startPos = {x:obj.x,y:obj.y}
                                  
                }

                group.x = game.world.centerX 
				
				objectsGroup.add(group)
			}	
		}
	}

	function createGoal(){
		var num = game.rnd.integerInRange(2,4)
		var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        goalText = new Phaser.Text(sceneGroup.game, game.world.centerX,game.world.height*0.9, num+"/16", fontStyle)
        goalText.anchor.setTo(0.5)
        goalText.value = num
        

        var goalBack = sceneGroup.create(game.world.centerX,game.world.height*0.9,'barra')
        goalBack.anchor.setTo(0.5)

        sceneGroup.add(goalText)

	}
	
	return {
		
		assets: assets,
		name: "jelly",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.gravity.y = 0;
            game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            game.physics.p2.world.setGlobalStiffness(1e5);
            
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			 initialize()
			createBackground()
			createObjects()
			createPlayer()	
			createButtons()
			addParticles()

			objectsUpdate = game.add.group()
			sceneGroup.add(objectsUpdate)
			createGoal()
                        			
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