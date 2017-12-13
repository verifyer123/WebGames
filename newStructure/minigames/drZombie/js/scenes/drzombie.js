
var soundsPath = "../../shared/minigames/sounds/"
var drzombie = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
			"cerebro":"Brain",
			"corazon":"Heart",
			"estomago":"Stomach",
			"higado":"liver",
			"intestino_del":"Small \nIntestine",
			"intestino_grueso":"Large \nIntestine",
			"pulmon":"Lungs",
			"rinones":"Kidneys",
			
			
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
			"cerebro":"Cerebro",
			"corazon":"Corazón",
			"estomago":"Estómago",
			"higado":"Hígado",
			"intestino_del":"Intestino \nDelgado",
			"intestino_grueso":"Intestino \nGrueso",
			"pulmon":"Pulmones",
			"rinones":"Riñones",
			
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.zombie",
                json: "images/zombie/atlas.json",
                image: "images/zombie/atlas.png",
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
			{	name: "steam",
				file: soundsPath + "steam.mp3"},
			{	name: "zombieUp",
				file: soundsPath + "zombieUp.mp3"},
			{	name: "drag",
				file: soundsPath + "drag.mp3"},
			{	name: "gear",
				file: soundsPath + "gear.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 94
	var indexGame
    var overlayGroup
    var spaceSong
	var background, floor
	var spriteZombie, zombieSpine
	var organsGroup, organsContainers
	var numberOrgans,numberOk
	var oContainer, xContainer
	var clock
	var nameOrgan
	var timeToUse
	var objToUse
	
	var organsPosition = [
		
		{name: "cerebro" ,x:-5.274336283185846, y:196.86363636363637},
		{name: "pulmon" ,x:-2.774336283185846, y:-10},
		{name: "corazon" ,x:-41.98672566371681, y:12.834224598930462},
		{name: "estomago" ,x:-3.491150442477874, y:-30.802139037433165},
		{name: "intestino_del" ,x:-4.774336283185846, y:-93.18983957219257},
		{name: "intestino_grueso" ,x:-5.274336283185846, y:-97.04010695187162},
		{name: "higado" ,x:17.039823008849567, y:-47.48663101604279},
		{name: "rinones" ,x:-4.774336283185846, y:-35.435828877005406},
		
	]

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		numberOrgans = 2
		timeToUse = 14000
		objToUse = null
        
        loadSounds()
        
	}

    function popObject(obj,delay,alphaValue){
        
		var alpha = alphaValue || 1
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = alpha
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
        
        var pointsText = lookParticle('text')
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.zombie','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.zombie','life_box')

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
    
	function zombieLose(){
		
		game.add.tween(xContainer).to({alpha:0,y:xContainer.y - 200},500,"Linear",true)
		zombieSpine.setAnimationByName(0,"LOSE",false)
		
		game.add.tween(organsContainers).to({alpha:0},500,"Linear",true)
		game.add.tween(organsGroup).to({alpha:0},500,"Linear",true)
		game.add.tween(zombieSpine.anim).to({alpha:0},500,"Linear",true)
		
		sound.play("steam")
		sound.play("zombieUp")
		
	}
	
    function stopGame(win){
        
		zombieLose()
		
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 3500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
		buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false;
        
        game.load.spine('zombie', "images/spines/zombies.json")  
        game.load.audio('spaceSong', soundsPath + 'songs/space_bridge.mp3');
        
		game.load.image('howTo',"images/zombie/tutorial/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/zombie/tutorial/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/zombie/tutorial/introscreen.png")
		
		game.load.spritesheet('zombie', 'images/zombie/spriteSheets/zombie.png', 589, 554, 13);
		
		console.log(localization.getLanguage() + ' language')
        
    }
    
	function setOrgans(){
		
		zombieSpine.alpha = 1
		
		var stringToUse = ['',1,2]
		Phaser.ArrayUtils.shuffle(stringToUse)
		
		zombieSpine.setSkinByName("normal" + stringToUse[0])
		sound.play("zombieUp")
		game.add.tween(zombieSpine).from({x: - 200},3000,"Linear",true).onComplete.add(function(){
			
			zombieSpine.setAnimationByName(0,"IDLE",true)
			xContainer.y = 0
			sound.play("steam")
			
			game.add.tween(xContainer).to({y:game.world.centerY - 10, alpha:1},750,"Linear",true).onComplete.add(function(){
				
				game.add.tween(zombieSpine.anim).to({alpha:1},100,"Linear",true,0,5).onComplete.add(chooseOrgans)
				sound.play("gear")

			})
			
			
		})
		
		zombieSpine.setAnimationByName(0,"WALK",true)
	}
	
	function chooseOrgans(){
		
		var tagsToUse = []
		Phaser.ArrayUtils.shuffle(organsPosition)
		
		for(var i = 0; i < numberOrgans;i++){
			
			var tag = organsPosition[i].name
			tagsToUse[tagsToUse.length] = tag
		}
		
		var delay = 250
		for(var i = 0; i < organsContainers.length;i++){
			
			var organ = organsContainers.children[i]
			for(var  u = 0; u < tagsToUse.length;u++){
				
				var tag = tagsToUse[u]
				if(tag == organ.tag){
					popObject(organ,delay)
					organ.active = true
					delay+= 250
				}
			}
		}
		
		popObject(oContainer,delay,0.6)
		delay+= 200
		
		var pivotX = game.world.centerX - 200
		var pivotY = game.world.height - 165
		var initX = pivotX
		
		var orgNumber = 0
		for(var i = 0; i < organsGroup.length;i++){
			
			var organ = organsGroup.children[i]
			for(var u = 0; u < tagsToUse.length;u++){
				var tag = tagsToUse[u]
				if(tag == organ.tag){
					
					organ.alpha = 0
					organ.x = pivotX
					organ.y = pivotY
					organ.origX = organ.x
					organ.origY = organ.y
					organ.inputEnabled = true
					
					popObject(organ,delay)
					delay+= 250
					
					pivotX+= 125
					
					orgNumber++
					if(orgNumber == 4){
						pivotX = initX
						pivotY+= 100
					}
				}
			}
		}
		
		game.time.events.add(delay,function(){
			
			numberOk = 0
			gameActive = true
			popObject(clock,0)
			
			var bar = clock.bar
			bar.scale.x = bar.origScale
			
			clock.tween = game.add.tween(bar.scale).to({x:0},timeToUse,"Linear",true)
			clock.tween.onComplete.add(function(){
				missPoint()
				
			})
			
		})
	}
	
    function createOverlay(){
        
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
				
				setOrgans()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.zombie','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.zombie',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.zombie','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.zombie','pared')
		sceneGroup.add(background)
		
		floor = game.add.tileSprite(0,game.world.height,game.world.width, 300,'atlas.zombie','piso')
		floor.anchor.setTo(0,1)
		sceneGroup.add(floor)
		
		var eyesSign = sceneGroup.create(game.world.centerX + 200,game.world.centerY - 100,'atlas.zombie','ojos')
		eyesSign.anchor.setTo(0.5,0.5)
		//eyesSign.inputEnabled = true
		//eyesSign.events.onInputDown.add(inputButton)
		
		var weight = sceneGroup.create(game.world.centerX -200,game.world.height - floor.height * 0.9,'atlas.zombie','basculita')
		weight.anchor.setTo(0.5,1)
		
	}
	
	function update(){
		
		if(objToUse){
			nameOrgan.x = objToUse.x
			nameOrgan.y = objToUse.y - 100
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

				particle.makeParticles('atlas.zombie',tag);
				particle.minParticleSpeed.setTo(-300, -100);
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
		
		createParticles('star',3)
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
		
        var exp = sceneGroup.create(0,0,'atlas.zombie','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.zombie','smoke');
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
		
		var positions = ''
		for(var i = 0; i < organsGroup.length;i++){
			
			var organ = organsGroup.children[i]
			positions+= '{name: "' + organ.tag + '" ,x:' + (game.world.centerX - organ.x) + ', y:' + (game.world.centerY - organ.y) + '},\n'
		}
		
		console.log(positions)
	}
	
	function createZombie(){
		
		zombieSpine = game.add.spine(game.world.centerX, game.world.height - 250,'zombie')
		zombieSpine.alpha = 0
		zombieSpine.setSkinByName('normal')
		zombieSpine.setAnimationByName(0,"IDLE",true)
		sceneGroup.add(zombieSpine)
		
		xContainer = sceneGroup.create(game.world.centerX,game.world.centerY,'atlas.zombie','container')
		xContainer.anchor.setTo(0.5,0.5)
		xContainer.scale.x = 1.2
		xContainer.alpha = 0
		
		var xZombie = game.add.sprite(zombieSpine.x,zombieSpine.y + 35, 'zombie');
		sceneGroup.add(xZombie)
		xZombie.animations.add('walk');
		xZombie.animations.play('walk',12,true);
		xZombie.alpha = 0
		xZombie.anchor.setTo(0.5,1)
		
		zombieSpine.anim = xZombie
	}
	
	function createOrgans(){
		
		oContainer = new Phaser.Graphics(game)
		oContainer.alpha = 0
        oContainer.beginFill(0x000000)
        oContainer.drawRoundedRect(game.world.centerX,game.world.height - 125,600, 220,12)
		oContainer.x-= oContainer.width * 0.5
		oContainer.y-= oContainer.height * 0.5
        oContainer.endFill()
		sceneGroup.add(oContainer)
		
		organsContainers = game.add.group()
		sceneGroup.add(organsContainers)
		
		for(var i = 0; i < organsPosition.length;i++){
			
			var orgGroup = game.add.group()
			orgGroup.x = -organsPosition[i].x + game.world.centerX
			orgGroup.y = -organsPosition[i].y + game.world.centerY
			orgGroup.tag = organsPosition[i].name
			orgGroup.alpha = 0
			orgGroup.active = false
			organsContainers.add(orgGroup)
			
			var organ = orgGroup.create(0,0,'atlas.zombie',organsPosition[i].name)
			organ.anchor.setTo(0.5,0.5)
			organ.scale.setTo(1.1,1.1)
			organ.tint = 0xff0000
			
			var organ = orgGroup.create(0,0,'atlas.zombie',organsPosition[i].name)
			organ.anchor.setTo(0.5,0.5)
			orgGroup.organ = organ
			organ.tint = 0x000000
			
						
		}
		
		organsGroup = game.add.group()
		sceneGroup.add(organsGroup)
		
		for(var i = 0; i < organsPosition.length;i++){
			
			var organ = organsGroup.create(-200,-100,'atlas.zombie',organsPosition[i].name)
			organ.inputEnabled = true
			organ.tag = organsPosition[i].name
			organ.input.enableDrag(true)
			organ.anchor.setTo(0.5,0.5)
			organ.events.onDragStart.add(onDragStart, this);
			organ.events.onDragStop.add(onDragStop, this);

		}
		
	}
	
	function onDragStart(obj){
        
        if(!gameActive){
            return
        }
		
		objToUse = obj
		
		if(nameOrgan.tween){
			nameOrgan.tween.stop()
			nameOrgan.alpha = 0
		}
		
		nameOrgan.alpha = 1
		game.add.tween(nameOrgan.scale).from({x:0, y:0},250,Phaser.Easing.linear,true)
		nameOrgan.x = obj.x
		nameOrgan.y = obj.y - 75
		
		nameOrgan.tween = game.add.tween(nameOrgan).to({alpha:0},500,"Linear",true,1000)
		
		nameOrgan.text.setText(localization.getString(localizationData,obj.tag))
        
        sound.play("drag")
        
    }
	
	function onDragStop(obj){
		
		if(nameOrgan.tween){
			nameOrgan.tween.stop()
			nameOrgan.tween = game.add.tween(nameOrgan).to({alpha:0},500,"Linear",true)
		}
		
		objToUse = null
		sound.play("pop")
		obj.inputEnabled = false
		
		for(var i = 0; i < organsContainers.length;i++){
			
			var organ = organsContainers.children[i]
			if(checkOverlap(obj,organ) && obj.tag == organ.tag && gameActive){
				
				game.add.tween(obj).to({x:organ.x, y:organ.y, angle:obj.angle + 360},500,"Linear",true)
				game.add.tween(obj).to({angle:obj.angle+360},500,"Linear",true)
				
				addPoint(1)
				createPart('star',obj)
				
				numberOk++
				if(numberOk == numberOrgans){
					
					clock.tween.stop()
					
					game.add.tween(clock).to({alpha:0},500,"Linear",true)
					
					game.time.events.add(1500,function(){
						
						for(var i = 0; i < organsGroup.length;i++){

							var organ = organsGroup.children[i]
							var organ2 = organsContainers.children[i]

							game.add.tween(organ2).to({alpha:0},500,"Linear",true)
							organ.x = -100
							organ.y = -200
						}
						
						game.add.tween(oContainer).to({alpha:0},500,"Linear",true)
						
						sound.play("steam")
						game.add.tween(zombieSpine.anim).to({alpha:0},100,"Linear",true,0,5)
						game.add.tween(xContainer).to({alpha:0,y:xContainer.y - 200},500,"Linear",true,1000).onComplete.add(function(){
							
							sound.play("zombieUp")
							zombieSpine.setAnimationByName(0,"WALK",true)
							game.add.tween(zombieSpine).to({x:game.world.width + 300},2000,"Linear",true).onComplete.add(function(){
								
								zombieSpine.x = game.world.centerX
								zombieSpine.alpha = 0
								
								if(timeToUse > 3000){
									timeToUse-= 750
								}
								
								if(numberOrgans < 7){
									numberOrgans++								}
								
								game.time.events.add(1000,setOrgans)
							})
						})
					})
					
				}
				
				return
			}
		}
				
				
		game.add.tween(obj).to({x:obj.origX, y:obj.origY},500,"Linear",true).onComplete.add(function(){

			console.log('enable Input')
			obj.inputEnabled = true
		})
	}
		
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	function createClock(){
        
        clock = game.add.group()
        clock.x = game.world.centerX
        clock.y = 100
		clock.alpha = 0
        sceneGroup.add(clock)
        
        var clockImage = clock.create(0,0,'atlas.zombie','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.zombie','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
        
        clock.bar = clockBar
        
    }
	
	function createNameOrgans(){
		
		nameOrgan = game.add.group()
		nameOrgan.x = game.world.centerX
		nameOrgan.y = game.world.centerY
		nameOrgan.alpha = 0
		sceneGroup.add(nameOrgan)
		
		var image = nameOrgan.create(0,0,'atlas.zombie','contenedor_nombres')
		image.anchor.setTo(0.5,0.5)
		
		var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
		
        var pointsText = new Phaser.Text(sceneGroup.game, 0, -15, "0", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		pointsText.lineSpacing = -10;
        nameOrgan.add(pointsText)
		
		nameOrgan.text = pointsText
		
	}
	
	return {
		
		assets: assets,
		name: "drzombie",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			createZombie()
			createOrgans()
			createClock()
			createNameOrgans()
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