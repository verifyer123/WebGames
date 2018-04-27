
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"
var stack = function(){
    
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
                name: "atlas.stack",
                json: "images/stack/atlas.json",
                image: "images/stack/atlas.png",
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
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 69
	var indexGame
    var overlayGroup
	var buttonsGroup, barsGroup
    var spaceSong
	var indexBar,indexButton
	
	var colorsToUse = [0xFF4242,0x437DFF,0x1FFF34,0xfffd3d,0xff983d]
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
		indexBar = 0
		indexButton = 0
		timeToUse = 10000

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
		
		if(timeToUse > 1000){
			timeToUse-= 500
		}
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.stack','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.stack','life_box')

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
		figuresLose()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 3000)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function moveObject(group,timeX,times){
		
		var tween = game.add.tween(group).to({x:group.x + 5},timeX,"Linear",true,0,times)
		tween.yoyo(true,0)
		
	}
	
	function figuresLose(){
				
		moveObject(buttonsGroup,100,11)
		moveObject(barsGroup,100,11)
		
		game.time.events.add(1200,function(){
			
			for(var i = 0; i < barsGroup.length;i++){
			
				var posX = game.world.width * 1.5
				var off = 1

				if(Math.random() * 2 < 1){
					posX = -game.world.width * 0.5
					off = -1
				}
				var posY = game.world.centerY + (game.rnd.integerInRange(0,300) * off)

				var fig = barsGroup.children[i]


				game.add.tween(fig).to({angle:fig.angle + 360, x: posX},400,"Linear",true)

			}


			sound.play("explosion")
			explosion.alpha = 1

			explosion.setAnimationByName(0,"EXPLOTION",false)

			game.add.tween(explosion).to({alpha:0},500,"Linear",true,500)
			})
		
	}
	
    function preload(){
        
		
		
        game.stage.disableVisibilityChange = false;
        
        game.load.spine('explosion', "images/spines/explotion.json")  
        game.load.audio('spaceSong', soundsPath + 'songs/game_on.mp3');
        
		/*game.load.image('howTo',"images/stack/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/stack/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/stack/introscreen.png")*/
		
		game.load.image('tutorial_image',"images/stack/tutorial_image.png")
		//loadType(gameIndex)

        
    }
    
	function setNumber(bar){
		
		bar.alpha = 1
		bar.scale.setTo(1,1)
		
		var signToUse = 'x'
		if(game.rnd.integerInRange(0,3) > 1){
			signToUse = '÷'
		}
		
		game.add.tween(bar.question).to({alpha:1},500,"Linear",true)
		
		var number1, number2, result
		 
		if(signToUse == 'x'){
			
			number1 = game.rnd.integerInRange(2,9)
			number2 = game.rnd.integerInRange(2,9)
			
			result = number1 * number2
		}else{
			
			number1 = game.rnd.integerInRange(2,9)
			number2 = game.rnd.integerInRange(2,9)
			
			number1*= number2
			
			result = number1 / number2
			
		}
		
		bar.text.setText(number1 + ' ' +  signToUse + '  ' + number2 + ' = ' + result)
		bar.sign = signToUse
		
		var question = bar.question
		question.x = question.posX
		
		if(number1 > 9){
			question.x += 30
		}
		
		bar.indexBar = indexBar
		indexBar++
		
	}
	
	function sendBar(bar, posY,delay,time){
		
		barsGroup.pivotY-= bar.height * 0.8
		setNumber(bar)
		game.time.events.add(delay, function(){
			
			sound.play("cut")
			
			bar.scale.setTo(1,1)
			game.add.tween(bar).to({y:posY},time,"Linear",true).onComplete.add(function(){
				bar.scale.setTo(1,1)
			})
		})
	}
	
	function showButtons(){
		
		var delay = 0
		
		for(var i = 0; i < barsGroup.length; i++){
			
			var bar = barsGroup.children[i]
			sendBar(bar,barsGroup.pivotY,delay,500)
			
			delay += 100
		}
		
		for(var i = 0; i < buttonsGroup.length;i++){
			
			var button = buttonsGroup.children[i]
			popObject(button,delay)
			
			delay+= 200
		}	
		
		game.time.events.add(delay,function(){
			
			popObject(clock,0)
			setClock()
			
			gameActive = true
		})
		
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
                
				showButtons()
				overlayGroup.y = -game.world.height
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.stack','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.stack',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.stack','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
    	showButtons()
		overlayGroup.y = -game.world.height
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		var sky = sceneGroup.create(0,-5,'atlas.stack','skytransition')
		sky.width = game.world.width * 1.1
		sky.height = game.world.height -510
		
		background = game.add.tileSprite(0,game.world.height + 5,game.world.width, 524, 'atlas.stack','floor')
		background.anchor.setTo(0,1)
		sceneGroup.add(background)
		
	}
	
	function update(){
		
		background.tilePosition.x++
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

				particle.makeParticles('atlas.stack',tag);
				particle.minParticleSpeed.setTo(-400, -50);
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
		
		explosion = game.add.spine(game.world.centerX, game.world.centerY,'explosion')
		explosion.setSkinByName("normal")
		explosion.alpha = 0

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
		
        var exp = sceneGroup.create(0,0,'atlas.stack','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.stack','smoke');
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
	
	function moveBars(){
		
		var delay = 0
		for(var i = 0; i < barsGroup.length;i++){
			
			var bar = barsGroup.children[i]
			game.add.tween(bar).to({y:bar.y + bar.height * 0.8},100,"Linear",true,delay)
			delay+= 50
		}
		
		game.time.events.add(delay,function(){
			gameActive = true
			
			setClock()
		})
	}
	
	function setClock(){
		
		clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeToUse,"Linear",true)
		clock.tween.onComplete.add(function(){
			missPoint()
            var bar = getBar(indexButton)
            var question = bar.question
            game.add.tween(question).to({alpha:0},500,"Linear",true)
            
            if(lives !== 0){
                indexButton++
                game.add.tween(clock.bar.scale).to({x:clock.bar.origScale},500,"Linear",true)
                game.time.events.add(750,function(){

                    sound.play("cut")
                    bar.tween = game.add.tween(bar.scale).to({x:0,y:0},200,"Linear",true)

                    barsGroup.remove(bar)
                    barsGroup.add(bar)

                    barsGroup.pivotY+= bar.height * 0.8
                    sendBar(bar,barsGroup.pivotY,0,0)
                    moveBars()

                })
            }
		})
		
	}
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
		gameActive = false
		
		sound.play("pop")
		var parent = obj.parent
		
		var tween = game.add.tween(obj.scale).to({x:0.7,y:0.7},200,"Linear",true)
		tween.yoyo(true,0)
		
		var bar = getBar(indexButton)
		var question = bar.question
		game.add.tween(question).to({alpha:0},500,"Linear",true)
		
		if(clock.tween){
			clock.tween.stop()
		}
		
		indexButton++
		if(parent.sign == bar.sign){
			
			game.add.tween(clock.bar.scale).to({x:clock.bar.origScale},500,"Linear",true)
			
			addPoint(1)
			createPart('star',question)
			
		}else{
			
			missPoint()
			createPart('wrong',question)
            
		}
		
        if(lives !== 0){
            game.time.events.add(750,function(){

                sound.play("cut")
                bar.tween = game.add.tween(bar.scale).to({x:0,y:0},200,"Linear",true)

                barsGroup.remove(bar)
                barsGroup.add(bar)

                barsGroup.pivotY+= bar.height * 0.8
                sendBar(bar,barsGroup.pivotY,0,0)
                moveBars()

            })
        }
	}
	
	function getBar(index){
		
		for(var i = 0; i < barsGroup.length;i++){
			
			var bar = barsGroup.children[i]
			if(bar.indexBar == index){
				return bar
			}
		}
	}
	
	function createButtons(){
		
		buttonsGroup = game.add.group()
		sceneGroup.add(buttonsGroup)
		
		var buttonNames = ['multi','division']
		var buttonSigns = ['x','÷']
		var pivotX = game.world.centerX - 150
		
		for(var i = 0; i < buttonNames.length;i++){
			
			var button = game.add.group()
			button.alpha = 0
			button.x = pivotX
			button.y = game.world.height - 100
			buttonsGroup.add(button)
				
			var buttonImg = button.create(0,0,'atlas.stack',buttonNames[i] + '_container')
			buttonImg.anchor.setTo(0.5,0.5)
			buttonImg.inputEnabled = true
			buttonImg.events.onInputDown.add(inputButton)
			
			var fontStyle = {font: "85px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, 0, -5, buttonSigns[i], fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			button.add(pointsText)
			
			button.sign = buttonSigns[i]
			
			pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
			
			pivotX+=300
		}
	}
	
	function createBars(){
	
		barsGroup = game.add.group()
		barsGroup.pivotY = game.world.height - 275
		sceneGroup.add(barsGroup)
		
		var indexColor = 0
		
		for(var i = 0; i < 10; i++){
			
			var bar = game.add.group()
			bar.x = game.world.centerX
			bar.y = -100
			barsGroup.add(bar)
			
			var barImg = bar.create(0,0,'atlas.stack','block_gray')
			barImg.tint = colorsToUse[indexColor]
			barImg.anchor.setTo(0.5,0.5)
			
			indexColor++
			if(indexColor >= colorsToUse.length){
				indexColor = 0
			}
			
			var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, -barImg.width * 0.3, 20, "3 X 6 = 2", fontStyle)
			pointsText.anchor.setTo(0,0.5)
			bar.add(pointsText)
			
			pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
			
			var question = bar.create(-45,pointsText.y - 5,'atlas.stack','question')
			question.posX = question.x
			question.posY = question.y 
			question.anchor.setTo(0.5,0.5)
			
			bar.question = question
			
			bar.text = pointsText
			
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
        
        var clockImage = clock.create(0,0,'atlas.stack','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.stack','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
        
        clock.bar = clockBar
        
    }
	
	return {
		
		assets: assets,
		name: "stack",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			createButtons()
			createBars()
			createClock()
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