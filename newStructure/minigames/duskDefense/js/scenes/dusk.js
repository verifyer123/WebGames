
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"

var dusk = function(){
    
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
                name: "atlas.dusk",
                json: "images/dusk/atlas.json",
                image: "images/dusk/atlas.png",
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
			{	name: "brightTransition",
				file: soundsPath + "brightTransition.mp3"},
			{	name: "zombieUp",
				file: soundsPath + "zombieUp.mp3"},
			{	name: "throw",
				file: soundsPath + "throw.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			
		],
    }
        
    var lives = null
	var sceneGroup = null
	var background,fence
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 73
	var indexGame
    var overlayGroup
    var spaceSong
	var yogotar
	var sunSky, moonSky
	var container, boardGroup, potionGroup
	var zombieGroup, zombieNumber
	var redFrame, tapPotion
	var coordIndicator
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
		zombieNumber = 1
		tapPotion = 0
        
        loadSounds()
        
	}

    function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x:0, y:0.01},250,Phaser.Easing.linear,true)
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
			pointsText.alpha = 1

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
            
            game.add.tween(pointsText).to({y:pointsText.y + offsetY},800,Phaser.Easing.linear,true)
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.dusk','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.dusk','life_box')

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
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 3000)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

            sceneloader.show("result")
			
		})
    }
    
    
    function preload(){
        

		
        game.stage.disableVisibilityChange = false;
        
        game.load.spine('yogotar', "images/spines/paz.json")  
		game.load.spine('zombie', "images/spines/zombie.json")  
        game.load.audio('spaceSong', soundsPath + 'songs/mysterious_garden.mp3');
        
		/*game.load.image('howTo',"images/dusk/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/dusk/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/dusk/introscreen.png")*/
		
		game.load.image('tutorial_image',"images/dusk/tutorial_image.png")
		//loadType(gameIndex)

        
    }
    
	function setZombie(zombie, posY, time){
		
		game.add.tween(zombie).to({y:zombie.y + posY},time,"Linear",true).onComplete.add(function(){
			
			for(var i = 0; i < boardGroup.length; i++){
				
				var frame = boardGroup.children[i].children[1]
				if(checkOverlap(frame,zombie.pos)){
					
					zombie.frame = frame
					frame.correct = true
					frame.zombie = zombie
				}
			}
		})
	}
	
	function sendZombies(){
		
		var listIndex = []
		for(var i = 0; i < 6;i++){
			listIndex[i] = i
		}
		
		Phaser.ArrayUtils.shuffle(listIndex)
		
		var delay = 0
		for(var i = 0; i < zombieNumber; i++){
			
			var zombie = zombieGroup.children[i]
			zombie.used = false
			zombie.scale.setTo(1,1)
			zombie.alpha = 1
			zombie.anim.alpha = 1
			zombie.anim.setAnimationByName(0,"IDLE",true)
			
			var frame = boardGroup.children[listIndex[i] * 7].children[0]
			zombie.x = frame.world.x
			zombie.y = frame.world.y - 59
			
			game.add.tween(zombie).to({alpha:1},500,"Linear",true)
			
			var posIndex = game.rnd.integerInRange(1,7)
			var pos = 59 * posIndex
			var time = 750 * posIndex
			
			if(delay < time){
				delay = time
			}
			
			setZombie(zombie,pos,time)
			
		}
		
		sound.play("zombieUp")
		
		delay += 1000
		
		game.time.events.add(delay, function(){
			
			setNight(true)
		})
	}
	
	function setNight(isNight){
		
		if(isNight){
			
			game.add.tween(nightSky).to({alpha:1},1000,"Linear",true)
			
			game.add.tween(container).to({alpha:1},500,"Linear",true,500)
			
			for(var i = 0; i < zombieGroup.length;i++){
				
				var zombie = zombieGroup.children[i]
				game.add.tween(zombie.scale).to({x:0,y:0},500,"Linear",true)
				
			}
			
			var delay = 1000
			for(var i = 0; i < zombieNumber;i++){
				
				var potion = potionGroup.children[i]
				popObject(potion,delay)
				
				delay += 200
			}
						
			for(var i = 0; i < boardGroup.length;i++){
				 
				var frame = boardGroup.children[i]
				changeImage(0,frame)
			}
			
			yogotar.setAnimationByName(0,"IDLE",true)
			
			game.time.events.add(1500,function(){
				gameActive = true
			})
			
		}else{
			
			
			
			game.add.tween(nightSky).to({alpha:0},1500,"Linear",true).onComplete.add(function(){
				yogotar.setAnimationByName(0,"IDLE_WITHOUT",true)
			})
			
			game.add.tween(container).to({alpha:0},500,"Linear",true,500)
			
			for(var i = 0; i < zombieGroup.length;i++){
				
				var zombie = zombieGroup.children[i]
				game.add.tween(zombie).to({alpha: 0},500,"Linear",true)
				zombie.x = -100
				
			}
			
			var delay = 1000
			for(var i = 0; i < zombieNumber;i++){
				
				var potion = potionGroup.children[i]
				game.add.tween(potion).to({alpha:0},500,"Linear",true,delay)
				
				delay += 200
			}
						
			for(var i = 0; i < boardGroup.length;i++){
				 
				var frame = boardGroup.children[i]
				changeImage(1,frame)
				frame.button.correct = false
			}
			
			yogotar.setAnimationByName(0,"IDLE",true)
			
		}
	}
	
    function createOverlay(){
        
		coordIndicator = game.add.group()
		coordIndicator.x = game.world.centerX
		coordIndicator.y = 100
		coordIndicator.alpha = 0
		sceneGroup.add(coordIndicator)



		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRoundedRect(0,0,300, 100,12)
		rect.x-= rect.width * 0.5
		rect.y-= rect.height * 0.5
		rect.alpha = 0.8
        rect.endFill()
		coordIndicator.add(rect)
		
		var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, 'coord', fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		coordIndicator.add(pointsText)
		
		coordIndicator.text = pointsText
		
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
				game.time.events.add(1000,sendZombies)
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.dusk','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.dusk',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.dusk','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
    	overlayGroup.y = -game.world.height
		game.time.events.add(1000,sendZombies)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		sunSky = game.add.group()
		sceneGroup.add(sunSky)
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xffde73)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.endFill()
		sunSky.add(rect)
		
		var sun = sunSky.create(game.world.centerX, 200,'atlas.dusk','sun')
		sun.anchor.setTo(0.5,1)
		
		var tween = game.add.tween(sun.scale).to({x:1.2,y:1.2},1500,"Linear",true,0,-1)
		tween.yoyo(true,0)
		
		nightSky = game.add.group()
		nightSky.alpha = 0
		sceneGroup.add(nightSky)
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0x031489)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.endFill()
		nightSky.add(rect)
		
		var moon = nightSky.create(game.world.centerX, 200,'atlas.dusk','moon')
		moon.anchor.setTo(0.5,1)
		
		background = sceneGroup.create(0,game.world.height,'atlas.dusk','floorgradient')
		background.anchor.setTo(0,1)
		background.width = game.world.width
		
		var sideLeaves = sceneGroup.create(game.world.width + 15,0,'atlas.dusk','side_leaves')
		sideLeaves.anchor.setTo(1,0)
		sideLeaves.height = game.world.height
		
		var sideLeaves = sceneGroup.create(-15,0,'atlas.dusk','side_leaves')
		sideLeaves.height = game.world.height
		sideLeaves.scale.x*= -1
		sideLeaves.anchor.setTo(1,0)
		
		fence = game.add.tileSprite(0,game.world.height - 50,game.world.width, 154,'atlas.dusk','fence')
		fence.anchor.setTo(0,1)
		sceneGroup.add(fence)
		
		yogotar = game.add.spine(game.world.centerX - 200,game.world.height - 70,'yogotar')
		yogotar.setSkinByName("normal")
		yogotar.setAnimationByName(0,"IDLE_WITHOUT",true)
		yogotar.scale.setTo(1.2,1.2)
		sceneGroup.add(yogotar)
		
		var botLeaves = sceneGroup.create(0,game.world.height,'atlas.dusk','bushes_front')
		botLeaves.anchor.setTo(0,1)
		botLeaves.width = game.world.width
		
	}
	
	function update(){
		
		fence.tilePosition.x+=0.3
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
            if(particle.tag == key){
                
				particle.used = true
                particle.alpha = 1
                
				if(key == 'text'){
					particlesGroup.remove(particle)
                	particlesUsed.add(particle)
				}
                
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
            particle.start(true, 1500, null, 6);+
			particle.setAlpha(1,0,2000,Phaser.Easing.Cubic.In)
			
			/*game.add.tween(particle).to({alpha:0},500,"Linear",true,1000).onComplete.add(function(){
				deactivateParticle(particle,0)
			})*/
			
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

				particle.makeParticles('atlas.dusk',tag);
				particle.minParticleSpeed.setTo(-400, -100);
				particle.maxParticleSpeed.setTo(400, -200);
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
		
		createParticles('star',1)
		createParticles('wrong',1)
		createParticles('text',5)
		createParticles('smoke',1)

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
		
        var exp = sceneGroup.create(0,0,'atlas.dusk','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.dusk','smoke');
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
		
		var parent = obj.parent
		
		gameActive = false
		changeImage(2,parent)
		
		coordIndicator.text.setText('(' + obj.rowX + ' , ' + obj.rowY + ')')
		popObject(coordIndicator,0)
		
		sound.play("throw")
		game.add.tween(coordIndicator).to({alpha:0},500,"Linear",true,1500)
		if(obj.correct){
			
			createPart('star',obj)
			addPoint(1)
			
			obj.zombie.scale.setTo(1,1)
			popObject(obj.zombie,0)
			
			
			var potion = potionGroup.children[tapPotion]
			game.add.tween(potion).to({x:obj.world.x,y:obj.world.y},500,"Linear",true).onComplete.add(function(){
				
				
				potion.alpha = 0
				potion.x = potion.initX
				potion.y = potion.initY
				obj.zombie.anim.setAnimationByName(0,"WIN",false)
				obj.zombie.used = true
				
				sound.play("brightTransition")
				
			})
			
			tapPotion++
			
			game.time.events.add(2500, function(){
				
				if(tapPotion == zombieNumber){
				
					zombieNumber++
					if(zombieNumber >= 6){
						zombieNumber = 1
					}
					
					tapPotion = 0
					
					setNight(false)
					
					game.time.events.add(2500,sendZombies)
				}else{
					
					gameActive = true
				}	
			})
			
		}else{
			
			createPart('wrong',obj)
			
			sound.play("shoot")
			
			missPoint()
			if(lives > 0){
				game.time.events.add(1500,function(){
					gameActive = true
				})
			}else{
				
				yogotar.setAnimationByName(0,"LOSE",false)
				yogotar.addAnimationByName(0,"LOSESTILL",true)

				for(var i = 0; i < zombieGroup.length ; i++){

					var zombie = zombieGroup.children[i]
					if(!zombie.used){

						zombie.scale.setTo(1,1)
						zombie.anim.setAnimationByName(0,"IDLE",true)
						popObject(zombie,0)
					}

				}
			}
			
			
			var potion = potionGroup.children[tapPotion]
			game.add.tween(potion).to({x:obj.world.x,y:obj.world.y},500,"Linear",true).onComplete.add(function(){
				
				potion.alpha = 0
				
				createPart('smoke',potion)
				
				if(lives > 0){
					potion.x = potion.initX
					potion.y = potion.initY
					potion.alpha = 1
				}
				
				
			})
		}
		
	}
	
	function createBoard(){
		
		var pivotX = game.world.centerX - 175
		var pivotY = game.world.centerY - 235
		
		boardGroup = game.add.group()
		sceneGroup.add(boardGroup)
		
		var isPurple = true
		
		for(var i = 0; i < 6; i++){
			
			for(var u = 0; u < 7; u++){
				
				var group = game.add.group()
				group.x = pivotX
				group.y = pivotY
				boardGroup.add(group)
				
				group.pivotX = pivotX
				
				var imgBoard = group.create(0,0,'atlas.dusk','pinksquare')
				imgBoard.anchor.setTo(0.5,0.5)
				
				var imgB 
				if(isPurple){
					imgB = group.create(0,0,'atlas.dusk','purplesquare')
				}else{
					imgB = group.create(0,0,'atlas.dusk','gaysquare')
				}
				
				imgB.inputEnabled = true
				imgB.events.onInputDown.add(inputButton)
				imgB.rowX = i + 1
				imgB.rowY = 7 - u
				imgB.used = false
				imgB.correct = false
				
				group.button = imgB
				
				isPurple = !isPurple
				
				imgB.anchor.setTo(0.5,0.5)
				
				pivotY += 59
				
				var redImg = group.create(0,0,'atlas.dusk','redsquare')
				redImg.alpha = 0
				redImg.anchor.setTo(0.5,0.5)
				redImg.scale.setTo(0.9,0.9)
				
			}
			pivotX+= 70
			pivotY = game.world.centerY - 235
		}
		
		nightNumbers = game.add.group()
		sceneGroup.add(nightNumbers)
		
		pivotX= game.world.centerX - 250
		
		for(var i = 0; i < 7; i++){
			
			var frame = boardGroup.children[i]
			
			var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, pivotX, frame.y, 7 - i, fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			nightNumbers.add(pointsText)
		}
		
		pivotX = game.world.centerX - 175
		
		for(var i = 0; i < 6;i++){
			
			var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, pivotX, boardGroup.children[6].y + 70, i + 1, fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			nightNumbers.add(pointsText)
			
			pivotX += 70
		}
		
	}
	
	function createContainer(){
		
		container = sceneGroup.create(game.world.centerX + 80, game.world.height - 175,'atlas.dusk','container_potion')
		container.alpha = 0
		container.anchor.setTo(0.5,0.5)
		container.scale.x*= 1.3

		potionGroup = game.add.group()
		sceneGroup.add(potionGroup)
		
		var pivotX = container.x - container.width * 0.34
		for(var i = 0; i < 6;i++){
			
			var potion = potionGroup.create(pivotX, container.y,'atlas.dusk','potion')
			potion.alpha = 0
			potion.anchor.setTo(0.5,0.5)
			potion.initX = potion.x
			potion.initY = potion.y

			pivotX += potion.width * 1.2
		}

		
	}
	
	function createZombies(){
		
		zombieGroup = game.add.group()
		sceneGroup.add(zombieGroup)
		
		for(var i = 0; i < 6; i++){
			
			var group = game.add.group()
			group.x = -100
			group.y = game.world.centerY
			group.alpha = 0
			zombieGroup.add(group)
			
			var zombie = game.add.spine(0,30,'zombie')
			zombie.setSkinByName("normal")
			zombie.setAnimationByName(0,"IDLE",true)
			group.add(zombie)
			
			group.anim = zombie
			
			var pos = group.create(0,0,'atlas.dusk','button')
			pos.alpha = 0
			pos.scale.setTo(0.4,0.4)
			pos.anchor.setTo(0.5,0.5)
			
			group.pos = pos
			
			
		}
		
	}
		
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	return {
		
		assets: assets,
		name: "dusk",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createContainer()
			createBoard()
			createZombies()
			addParticles()
                        			
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