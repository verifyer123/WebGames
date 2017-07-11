
var soundsPath = "../../shared/minigames/sounds/"
var sky = function(){
    
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
                name: "atlas.skyL",
                json: "images/sky/atlas.json",
                image: "images/sky/atlas.png",
            },
        ],
        images: [
			{   name:"background",
				file: "images/sky/fondo.png"},
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
			

		],
    }
    
        
    var lives = null
	var sceneGroup = null
    var pointsGroup = null
	var background,topBack,botBack
	var shipGroup, barGroup, animalsGroup
    var gameActive = true
	var shoot
    var arrayComparison = null
	var indexCard,wrongIndex
	var particlesGroup, particlesUsed
    var gameIndex = 7
	var indexGame
    var overlayGroup
	var timeValue
    var spaceSong
	
	var animalNames = ['cat','chicken','cow','dog','elephant','giraffe','hamster','horse','lion','parrot','pig','sheep','monkey','turtle','zebra']

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
        arrayComparison = []
        timeValue = 10000
		
		Phaser.ArrayUtils.shuffle(animalNames)
		indexCard = 0
        
        loadSounds()
        
	}
    
    
    function createPart(key,obj){
        
        var particlesNumber = 2
        
        /*if(game.device.desktop == true){ 
            
            particlesNumber = 4
            
            var particlesGood = game.add.emitter(0, 0, 100);

            particlesGood.makeParticles('atlas.skyL',key);
            particlesGood.minParticleSpeed.setTo(-200, -50);
            particlesGood.maxParticleSpeed.setTo(200, -100);
            particlesGood.minParticleScale = 0.2;
            particlesGood.maxParticleScale = 1;
            particlesGood.gravity = 150;
            particlesGood.angularDrag = 30;

            particlesGood.x = obj.x;
            particlesGood.y = obj.y;
            particlesGood.start(true, 1000, null, particlesNumber);

            game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
            sceneGroup.add(particlesGood)

        }else{*/
            key+='Part'
            var particle = sceneGroup.create(obj.x,obj.y,'atlas.skyL',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
        //}
        
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
	
	function setCard(){
		
		wrongIndex = indexCard
		
		while(wrongIndex == indexCard){
			
			wrongIndex = game.rnd.integerInRange(0,animalNames.length - 1)
		}
	}
	
	function resetButtons(){
		
		shoot.alpha = 0
		
		for(var i = 0; i<animalsGroup.length;i++){
			
			var animal = animalsGroup.children[i]
			animal.x = -200
			animal.alpha = 0
		}
	}
	
	function positionBar(){
				
		game.add.tween(shipGroup).to({x:shipGroup.initialX, y:shipGroup.initialY, angle:0},500,"Linear",true)
		
		game.add.tween(shipGroup.text).to({alpha:0},300,"Linear",true).onComplete.add(function(){
			shipGroup.text.setText('')
		})
		
		barGroup.alpha = 1
		barGroup.angle = 0
		barGroup.x = barGroup.initialX
		
		gameActive = true
		gameActive = true
		
		game.add.tween(barGroup).from({x:game.world.width * 1.5},1000,"Linear",true).onComplete.add(function(){
			
			setCard()
			
			var indexs = [indexCard,wrongIndex]
			Phaser.ArrayUtils.shuffle(indexs)
			
			for(var i = 0; i < indexs.length; i++){
				
				var tap = barGroup.taps[i]
				
				console.log(animalNames[indexs[i]])
				
				var card = getCard(animalNames[indexs[i]])
				card.x = barGroup.x
				card.y = tap.world.y
				
				tap.correct = false
				if(indexs[i] == indexCard){
					tap.correct = true
				}
				
				game.add.tween(card.scale).from({x:0,y:0},500,"Linear",true)
			}
			
			shipGroup.text.alpha = 1
			shipGroup.text.setText(animalNames[indexCard])
			
			game.add.tween(shipGroup.text.scale).from({x:0,y:0},500,"Linear",true)
			
			shipGroup.tween = game.add.tween(shipGroup).to({x:barGroup.x},timeValue,"Linear",true,500)
			shipGroup.tween.onComplete.add(function(){
				
				crashShip(1)
				
			},this)
			
			
			sound.play("pop")
			
		},this)
	}
	
	function getCard(tag){
	
		for(var i = 0; i < animalsGroup.length;i++){
			
			var card = animalsGroup.children[i]
			if(card.tag == tag){
				card.alpha = 1
				return card
				break
			}
		}
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
        
        sound.play("pop")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)
		
		if(timeValue>1000){
			timeValue-=400
		}
		
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.skyL','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.skyL','life_box')

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
        
        game.load.spine('ship', "images/spines/skeleton1.json")  
        game.load.audio('spaceSong', soundsPath + 'songs/childrenbit.mp3');
        
		game.load.image('howTo',"images/sky/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/sky/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/sky/introscreen.png")
		
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
				positionBar()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.skyL','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.skyL',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.skyL','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width, game.world.height, 'background');
		sceneGroup.add(background)
		
		createBar()
	
		topBack = game.add.tileSprite(0,0,game.world.width, 141, 'atlas.skyL' ,'up');
		sceneGroup.add(topBack)
		
		botBack = game.add.tileSprite(0,game.world.height,game.world.width,141,'atlas.skyL','up')
		botBack.scale.setTo(1,-1)
		sceneGroup.add(botBack)
		
	}
	
	
	function update(){
		
		background.tilePosition.x-=3
		
		topBack.tilePosition.x-=5
		botBack.tilePosition.x-=5
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
                particle = particlesGroup.create(-200,0,'atlas.skyL',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
	
	function createSpaceship(){
		
		shoot = sceneGroup.create(0,0,'atlas.skyL','shoot')
		shoot.anchor.setTo(0.5,0.5)
		shoot.alpha = 0
		
		shipGroup = game.add.group()
		shipGroup.x = game.world.centerX - 200
		shipGroup.y = game.world.centerY
		shipGroup.initialX = shipGroup.x
		shipGroup.initialY = shipGroup.y
		sceneGroup.add(shipGroup)
		
		var ship = game.add.spine(0,80, "ship");
		ship.setSkinByName("nave")
		ship.setAnimationByName(0,"IDLE",true)
		shipGroup.add(ship)
		shipGroup.ship = ship
		
		var textCont = game.add.group()
		shipGroup.add(textCont)
		
		var cont = textCont.create(0,0,'atlas.skyL','textcont')
		cont.anchor.setTo(0.5,0.5)
		
		var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, -5, 0, '', fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
        textCont.add(pointsText)
		
		shipGroup.text = pointsText
		shipGroup.textCont = textCont
		shipGroup.tween = null
	}
	
	function createBar(){
		
		barGroup = game.add.group()
		barGroup.alpha = 0
		barGroup.x = game.world.centerX + 200
		barGroup.initialX = barGroup.x
		sceneGroup.add(barGroup)
		
		var bar = barGroup.create(0,0,'atlas.skyL','block')
		bar.anchor.setTo(0.5,0)
		
		barGroup.taps = []
		
		var pivotY = 300
		for( var i = 0; i< 2;i++){
			
			var tap1 = barGroup.create(0,pivotY,'atlas.skyL','tap')
			tap1.anchor.setTo(0.5,0.5)
			tap1.inputEnabled = true
			tap1.events.onInputDown.add(inputButton)
			tap1.correct = false
			
			barGroup.taps[i] = tap1
		
			pivotY+=300
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
		
        var exp = sceneGroup.create(0,0,'atlas.skyL','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.skyL','smoke');
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
		
		gameActive = false
		
		if(shipGroup.tween){
			shipGroup.tween.stop()
		}
		
		if(obj.correct){
			
			sound.play("magic")
			createPart('star',obj)
			
			shootShip()
			
		}else{
			
			sound.play('wrong')
			createPart('wrong',obj)
			crashShip(500)
			
		}
		sound.play("pop")
	}
	
	function crashShip(time){
		
		gameActive = false
		
		game.add.tween(shipGroup).to({x:barGroup.x},time,"Linear",true).onComplete.add(function(){
			
			shipGroup.ship.setAnimationByName(0,"LOSE",false)
			shipGroup.textCont.alpha = 0
			
			sound.play("explosion")
			setExplosion(shipGroup)
			
			game.add.tween(shipGroup).to({y:game.world.height*0.9, angle:180,alpha: 0},500,"Linear",true)
			
			missPoint()
		},this)
	}
	
	function shootShip(win){
		
		var angleUsed = -25
		
		var correctButton = null
		
		for(var i = 0; i < barGroup.taps.length; i++){
			
			if(barGroup.taps[i].correct){
				correctButton = barGroup.taps[i]
				break
			}
		}
		
		if(correctButton.world.y > shipGroup.y){
			angleUsed = Math.abs(angleUsed)
		}
		
		game.add.tween(shipGroup).to({angle:angleUsed},500,"Linear",true).onComplete.add(function(){
			
			shoot.x = shipGroup.x
			shoot.y = shipGroup.y
			shoot.angle = angleUsed
			shoot.alpha = 1
			
			shipGroup.ship.setAnimationByName(0,"FIRE",false)
			shipGroup.ship.addAnimationByName(0,"IDLE",true)
			
			sound.play("shoot")
			
			game.add.tween(shoot).to({x:correctButton.world.x,y:correctButton.world.y},500,"Linear",true).onComplete.add(function(){
				
				setExplosion(correctButton)
				
				sound.play("explosion")
				resetButtons()
				
				game.add.tween(barGroup).to({x:game.world.width * 1.5, angle:barGroup.angle - 180,alpha:0},500,"Linear",true)
				
				game.time.events.add(1000,positionBar)
				addPoint(1)
				
				if(indexCard < animalNames.length - 1){
					indexCard++
				}else{
					Phaser.ArrayUtils.shuffle(animalNames)
					indexCard = 0
				}
				
			},this)
				
		},this)
	}
	
	function createAnimals(){
		
		animalsGroup = game.add.group()
		sceneGroup.add(animalsGroup)
		
		for(var i = 0; i < animalNames.length;i++){
			
			var card = animalsGroup.create(-200,0,'atlas.skyL',animalNames[i])
			card.anchor.setTo(0.5,0.5)
			card.alpha = 0
			card.tag = animalNames[i]
			card.used = false
		}
		
	}
	
	function createObjects(){
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',5)
		createParticles('wrong',1)
		createParticles('text',5)
		
	}
	
	return {
		
		assets: assets,
		name: "sky",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			createSpaceship()
			createAnimals()
			createObjects()
                        			
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
	}
}()