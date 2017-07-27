
var soundsPath = "../../shared/minigames/sounds/"
var magic = function(){
    
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
                name: "atlas.magic",
                json: "images/magic/atlas.json",
                image: "images/magic/atlas.png",
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
			{	name: "secret",
				file: soundsPath + "secret.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background, table, magician
	var cardsGroup
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 59
	var indexGame
    var overlayGroup
    var spaceSong
	var timeToUse
	var rabbit
	var result
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		timeToUse = 15000
        
        loadSounds()
        
	}

    function popObject(obj,delay,appear){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
			if(appear){

				obj.alpha = 1
            	game.add.tween(obj.scale).from({x:0, y:0},250,Phaser.Easing.linear,true)
			}else{
				game.add.tween(obj.scale).to({x:0,y:0},250,"Linear",true).onComplete.add(function(){
					obj.scale.setTo(1,1)
					obj.alpha = 0
				})
			}
            
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
		
		if(timeToUse> 2000){
			timeToUse-= 1000
		}
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.magic','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.magic','life_box')

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
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;
        
        game.load.spine('magician', "images/spines/basi.json")  
		game.load.spine('rabbit', "images/spines/conejo.json")
        game.load.audio('spaceSong', soundsPath + 'songs/mysterious_garden.mp3');
        
		game.load.image('howTo',"images/magic/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/magic/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/magic/introscreen.png")
		
		console.log(localization.getLanguage() + ' language')
        
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
				showButtons(true)				
				
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.magic','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.magic',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.magic','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = sceneGroup.create(0,0,'atlas.magic','fondo')
		background.width = game.world.width
		background.height = game.world.height
		
		var top = game.add.tileSprite(0,-25,game.world.width,150, 'atlas.magic','swatch')
		sceneGroup.add(top)
		
		table = sceneGroup.create(game.world.centerX, game.world.height,'atlas.magic','mesa')
		table.anchor.setTo(0.5,1)
		
	}
	
	function update(){

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
				
				console.log(particle)
                
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

				particle.makeParticles('atlas.magic',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.magic','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.magic','smoke');
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
		
		if(clock.tween){
			clock.tween.stop()
		}
		
		gameActive = false
		
		sound.play("pop")
		
		var parent = obj.parent
		
		var tween = game.add.tween(parent.scale).to({x:0.7,y:0.7},100,"Linear",true,0,0)
		tween.yoyo(true,0)
		
		if(obj.parent.number == result){
			
			magician.setAnimationByName(0,"PUT",false)
			magician.addAnimationByName(0,"TAKE_OUT_WIN",false)
			magician.addAnimationByName(0,"IDLE_WIN",true)
			
			game.time.events.add(1000,function(){
				magician.addAnimationByName(0,"PUT_WIN",false)
				magician.addAnimationByName(0,"TAKE_OUT",false)
				magician.addAnimationByName(0,"IDLE",true)
			})
			
			
			addPoint(1)
			createPart('star',obj)
			sound.play('secret')
			
			magician.text.setText(result)
			
			game.time.events.add(3500,function(){
				showButtons(false)
			})
			
			game.time.events.add(4500,function(){
				showButtons(true)
			})
			
		}else{
			
			magician.setAnimationByName(0,"PUT",false)
			magician.addAnimationByName(0,"TAKE_OUT_LOSE",false)
			magician.addAnimationByName(0,"IDLE_LOSE",true)
			
			missPoint()
			createPart('wrong',obj)
			
		}
	}
	
	function createCards(){
		
		cardsGroup = game.add.group()
		sceneGroup.add(cardsGroup)
		
		var pivotX = game.world.centerX - 150
		for(var i = 0; i < 3; i++){
			
			var cardG = game.add.group()
			cardG.alpha = 0
			cardG.x = pivotX
			cardG.y = game.world.height - 90
			cardsGroup.add(cardG)
			
			var cardImage = cardG.create(0,0,'atlas.magic','carta')
			cardImage.inputEnabled = true
			cardImage.events.onInputDown.add(inputButton)
			
			cardImage.anchor.setTo(0.5,0.5)
			
			var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, 5, 2, "0", fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			cardG.add(pointsText)
			
			cardG.number = 0
			cardG.text = pointsText
			
			pivotX += 150
			
		}
	}
	
	function showButtons(appear){
		
		var delay = 3500
		
		if(!appear){
			delay = 0
			game.add.tween(clock).to({alpha:0},500,"Linear",true)
		}
		
		for(var i = 0; i < cardsGroup.length;i++){
			
			var button = cardsGroup.children[i]
			if(appear){
				popObject(button,delay,appear)
			}else{
				popObject(button,delay,appear)
			}
			
			delay+= 100
			
		}
		
		if(appear){
			
			magician.setAnimationByName(0,"PUT",false)
			magician.addAnimationByName(0,"TAKE_OUT_WIN",false)
			magician.addAnimationByName(0,"IDLE_WIN",false)
			magician.addAnimationByName(0,"PUT_WIN",false)
			magician.addAnimationByName(0,"TAKE_OUT",false)
			magician.addAnimationByName(0,"IDLE",true)
			
			var tween = game.add.tween(rabbit.scale).to({x:0.7,y:0.7},200,"Linear",true,0,0)
			tween.yoyo(true,0)
			
			game.time.events.add(500,function(){
				sound.play("cut")	
			})
				
			setNumbers()
			
			game.time.events.add(delay,function(){
				gameActive = true
				
				popObject(clock,0,true)
				
				clock.bar.scale.x = clock.bar.origScale
				
				clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeToUse,"Linear",true)
				clock.tween.onComplete.add(function(){
					missPoint()
				})
				
			})
		}
	}
	
	function createClock(){
		
        clock = game.add.group()
		clock.alpha = 0
        clock.x = game.world.centerX
		clock.scale.setTo(0.85,0.85)
        clock.y = 65
		clock.alpha = 0
        sceneGroup.add(clock)
        
        var clockImage = clock.create(0,0,'atlas.magic','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.magic','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
        
        clock.bar = clockBar
        
    }
	
	function createMagician(){
		
		magician = game.add.spine(game.world.centerX, game.world.height - table.height * 0.95,'magician')
		magician.setSkinByName("normal")
		magician.setAnimationByName(0,"IDLE",true)
		sceneGroup.add(magician)
		
		var cont = getSpineSlot(magician,"emty")
		game.world.bringToTop(cont)
		
		var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 2, "0", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		cont.add(pointsText)
		
		magician.text = pointsText
		magician.autoUpdateTransform()
		
		rabbit = game.add.spine(game.world.centerX + 100,magician.y + 50,'rabbit')
		rabbit.setSkinByName('normal')
		rabbit.setAnimationByName(0,"IDLE",true)
		sceneGroup.add(rabbit)
		
		var cont = getSpineSlot(rabbit,"empty")
		
		rabbit.autoUpdateTransform()
		
		var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 2, "0", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		pointsText.alpha = 1
		cont.add(pointsText)
		
		rabbit.text = pointsText
	}
	
	function setNumbers(){
		
		var number1 = game.rnd.integerInRange(2,10)
		var number2 = game.rnd.integerInRange(2,10)
		
		magician.text.setText(number1)
		rabbit.text.setText(number2)
		
		magician.number = number1
		rabbit.number = number2
		
		result = number1 * number2
		
		var correctIndex = game.rnd.integerInRange(0,cardsGroup.length - 1)
		
		for(var i = 0; i < cardsGroup.length;i++){
			
			var card = cardsGroup.children[i]
			
			card.number = result
			while(card.number == result){
				card.number = game.rnd.integerInRange(2,result + 5)
			}
			
			if(correctIndex == i){
				card.number = result
			}
			
			card.text.setText(card.number)
			
		}
		
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
	
	return {
		
		assets: assets,
		name: "magic",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex);
			
			createBackground()
			createCards()
			createClock()
			createMagician()
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
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()