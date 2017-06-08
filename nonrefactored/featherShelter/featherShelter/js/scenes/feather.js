
var soundsPath = "../../shared/minigames/sounds/"
var feather = function(){
    
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
                name: "atlas.feather",
                json: "images/feather/atlas.json",
                image: "images/feather/atlas.png",
            },
        ],
        images: [
			{   name:"background",
				file: "images/feather/fondo.png"},
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
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "chicken",
				file: soundsPath + "chicken.mp3"},
			{	name: "wolf",
				file: soundsPath + "wolf.mp3"},
			{	name: "wolfSound",
				file: soundsPath + "wolfSound.mp3"},
			{	name: "inflateballoon",
				file: soundsPath + "inflateballoon.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 37
	var indexGame
	var clouds, house
    var overlayGroup
    var spaceSong
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1

        
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
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.feather','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.feather','life_box')

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
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 3750)
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
        
        game.load.spine('chick', "images/spines/Chick.json")  
		game.load.spine('wolf', "images/spines/wolf.json")
        game.load.audio('spaceSong', soundsPath + 'songs/farming_time.mp3');
        
		game.load.image('howTo',"images/feather/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/feather/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/feather/introscreen.png")
		
		console.log(localization.getLanguage() + ' language')
        
    }
    
	function getChick(){
		
		for(var i = 0; i < chicksGroup.length;i++){
			
			var chick = chicksGroup.children[i]
			if(!chick.used){
				chick.used = true
				return chick
			}
		}
	}
	
	function sendChicks(number, isAdding){
		
		var delay = 0
		for(var i = 0; i < number; i++){
			
			var chick = getChick()
			chick.setAnimationByName(0,"RUN",true)
			
			goChick(chick,isAdding,delay)
			
			delay+= 500
		}
		
		delay+= 1500
		game.time.events.add(delay,function(){
			
			wolf.x = -200
			wolf.alpha = 1
			wolf.scale.x = 1
			
			wolf.setAnimationByName(0,"WALK",true)
			sound.play("wolf")
			game.add.tween(wolf).to({x:game.world.centerX - 150},1500,"Linear",true).onComplete.add(function(){
				wolf.setAnimationByName(0,"SIT",false)
				showButtons(true)
				gameActive = true
			})
			
		})
	}
	
	function showButtons(appear){
		
		var delay = 0
		for(var i = 0; i < buttonsGroup.length;i++){
			
			var button = buttonsGroup.children[i]
			popObject(button,delay,appear)
			delay+= 100
			
		}
	}
	
	function goChick(chick, isAdding, delay){
		
		var initialPosX = -100
		var posY = house.y + 35
		var toPosX = house.x 
		var numToUse = '+1'
		chick.scale.x = 1
		
		if(!isAdding){
			initialPosX = toPosX
			toPosX = -100
			numToUse = '-1'
			chick.scale.x = -1
		}
		
		game.time.events.add(delay, function(){
			
			sound.play("cut")
			
			chick.x = initialPosX
			chick.y = posY
		
			chick.alpha = 1
			
			if(!isAdding){
				throwChicken(numToUse)
			}
			
			game.add.tween(chick).to({alpha:1},250,"Linear",true)
			game.add.tween(chick).to({x:toPosX},2000,"Linear",true).onComplete.add(function(){
				game.add.tween(chick).to({alpha:0,y:chick.y - 50},250,"Linear",true)
					
				chick.used = false
				
				
				if(isAdding){
					throwChicken(numToUse)
				}
			})
		})
		
	}
	
	function throwChicken(numToUse){
		
		createTextPart(numToUse,house)
		sound.play("chicken")

		var houseTween = game.add.tween(house.scale).to({x:1.25,y:1.25},100,"Linear",true,0,0)
		houseTween.yoyo(true,0)
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
				
				numberChicks = game.rnd.integerInRange(2,5)
				sendChicks(numberChicks,true)
				
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.feather','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.feather',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.feather','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = sceneGroup.create(0,0,'background')
		background.width = game.world.width
		background.height = game.world.height
		
		var base = sceneGroup.create(0,game.world.height,'atlas.feather','base')
		base.anchor.setTo(0,1)
		base.width = game.world.width
		
		clouds = game.add.tileSprite(0,100,game.world.width,191,'atlas.feather','clouds')
		sceneGroup.add(clouds)
		
		house = sceneGroup.create(game.world.centerX + 125, game.world.height - base.height * 0.75,'atlas.feather','grange')
		house.anchor.setTo(0.5,1)
		
	}
	
	function update(){
		
		clouds.tilePosition.x+= 0.4
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
                particle = particlesGroup.create(-200,0,'atlas.feather',tag)
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
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.feather','smoke');
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
		
		sound.play("pop")
		var parent = obj.parent
		
		var tween = game.add.tween(parent.scale).to({x:0.7,y:0.7},200,"Linear",true,0,0)
		tween.yoyo(true,0)
		
		gameActive = false
		
		if(obj.number == numberChicks){
		   
			addPoint(1)
		   	createPart('star',obj)
			
			wolf.setAnimationByName(0,"LOSE",false)
			sound.play("wolfSound")
			
			game.time.events.add(2000,hideObjects)
		   
		}else{
		   missPoint()
		   createPart('wrong',obj)
		   
		   game.time.events.add(1000,blowHouse)
		}
		
		changeButtons(0.6)
	}
	
	function changeButtons(alphaValue){
		
		for(var i = 0; i < buttonsGroup.length;i++){
			
			var button = buttonsGroup.children[i]
			button.alpha = alphaValue
		}
	}
	
	function hideObjects(){
		
		wolf.scale.x = -1
		wolf.setAnimationByName(0,"WALK",true)
		
		game.add.tween(wolf).to({x:-125},1000,"Linear",true).onComplete.add(function(){
			
			showButtons(false)
			var number = numberChicks
			
			game.time.events.add(1000,function(){
				if((Math.random()*2 > 1 && (numberChicks > 2)) || numberChicks == 9){

					numberChicks = numberChicks - game.rnd.integerInRange(1,numberChicks - 1)
					sendChicks(number - numberChicks,false)
				}else{
					
					numberChicks = numberChicks + game.rnd.integerInRange(1,9-numberChicks)
					sendChicks(numberChicks - number,true)
				}
				
				console.log(numberChicks + ' number ' + number)
			})
						
		})
		
		
	}
	
	function blowHouse(){
		
		wolf.setAnimationByName(0,"BLOW",false)
		sound.play("inflateballoon")
		
		game.time.events.add(500,function(){
			
			var wind = sceneGroup.create(wolf.x + 100,wolf.y - 50,'atlas.feather','wind')
			wind.anchor.setTo(0,0.5)

			game.add.tween(wind.scale).to({x:1.5,y:1.5},1000,"Linear",true)
			game.add.tween(wind).to({alpha:0},500,"Linear",true,500)
		
			game.add.tween(house).to({x:game.world.width + 200,y:house.y - 400,angle : 450},1500,"Linear",true)
			
			createPart('smoke',house)
		
			sound.play("chicken")
			
			for(var i = 0; i < numberChicks;i++){
				var chick = getChick()
				
				chick.x = house.x + 200 - (game.rnd.integerInRange(0,400))
				chick.y = house.y - 50 - game.rnd.integerInRange(0,-200)
				chick.alpha = 1
				
				game.add.tween(chick).to({x: game.world.width + 200, y: chick.y - game.rnd.integerInRange(0,400), angle: 360},1000,"Linear",true)
			}
		})
		
		
	}
	
	function createButtons(){
		
		buttonsGroup = game.add.group()
		sceneGroup.add(buttonsGroup)
		
		var pivotX = game.world.centerX - 220
		var pivotY = game.world.height - 155
		for(var i = 0; i < 10;i++){
			
			var group = game.add.group()
			group.x = pivotX
			group.y = pivotY
			group.alpha = 0
			buttonsGroup.add(group)
			
			var image = group.create(0,0,'atlas.feather','numberbutton')
			image.anchor.setTo(0.5,0.5)
			image.inputEnabled = true
			image.events.onInputDown.add(inputButton)
			image.number = (i+1)
			
			var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, i+1, fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			group.add(pointsText)
			
			if(i == 9){
				pointsText.setText(0)
			}
			
			pivotX+= group.width * 1.2
			
			if((i+1) % 5 == 0){
				pivotY+= group.height * 1.1
				pivotX = game.world.centerX - 227
			}
			
		}
	}
	
	function createObjs(tag){
		
		var anim = game.add.spine(0,0,tag)
		anim.setSkinByName("normal")
		anim.setAnimationByName(0,"IDLE",true)
		return anim
	}
	
	function createChicks(){
		
		chicksGroup = game.add.group()
		sceneGroup.add(chicksGroup)
		
		for(var i = 0; i < 10; i++){
			var chick = createObjs("chick")
			chick.alpha = 0
			chick.used = false
			chicksGroup.add(chick)
		}
		
		wolf = createObjs("wolf")
		wolf.x = game.world.centerX - 200
		wolf.y = game.world.height - 250
		wolf.alpha = 0
		sceneGroup.add(wolf)
		
	}
	
	return {
		
		assets: assets,
		name: "feather",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			createButtons()
			createChicks()
			addParticles()
                        			
            spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.7)
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