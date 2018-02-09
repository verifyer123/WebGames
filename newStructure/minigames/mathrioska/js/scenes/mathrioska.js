
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var mathrioska = function(){
    
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
                name: "atlas.mathrioska",
                json: "images/mathrioska/atlas.json",
                image: "images/mathrioska/atlas.png",
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
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "drag",
				file: soundsPath + "drag.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 71
	var indexGame
    var overlayGroup
    var spaceSong
	var numbersGroup, dragButton
	var dollsGroup
	var resultToUse
	var dollToUse, lastDoll
	var indexDoll
	var lastIndex
	var timeToUse
	
	var indexList = [2,1,2,0,1,2]
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
		dollToUse = null
		indexDoll = 0
		timeToUse = 20000
		lastDoll = null
        
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
        
		if(timeToUse > 2000){
			timeToUse-=750
		}
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.mathrioska','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.mathrioska','life_box')

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
        
		dragButton.inputEnabled = false
		
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
        
		buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false;
        
        game.load.spine('doll', "images/spines/matrioska.json")  
        game.load.audio('spaceSong', soundsPath + 'songs/classic_videogame_loop_2.mp3');
        
		/*game.load.image('howTo',"images/mathrioska/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/mathrioska/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/mathrioska/introscreen.png")*/
		
		game.load.image('tutorial_image',"images/mathrioska/tutorial_image.png")
		loadType(gameIndex)

        
    }
	
	function showScene(){
		
		dollToUse = dollsGroup.children[indexList[indexDoll]]
		activateDoll(dollToUse)
				
		game.time.events.add(250,function(){
			
			gameActive = true
			dragButton.inputEnabled = true
			popObject(dragButton,0)
			dragButton.x = game.world.centerX
			
			popObject(clock,0)
			
			clock.bar.scale.x = clock.bar.origScale
			
			clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeToUse,"Linear",true)
			clock.tween.onComplete.add(function(){
				missPoint()
				createPart('wrong',dragButton)
                if(lives !== 0)
                    showScene()
			})
			
		})
	}
	
	function activateDoll(doll){
		
		var isAddition = game.rnd.integerInRange(0,3) > 1
		
		if(resultToUse && resultToUse > 5){
			isAddition = false
		}
		
		doll.scale.setTo(1,1)
		doll.alpha = 0
		var number1, number2
		var signToUse = ' + '
		if(isAddition){
					
			number1 = resultToUse || game.rnd.integerInRange(2,10 - 1)
			number2 = game.rnd.integerInRange(1,number1 - 1)
			
			resultToUse = number1 + number2			
			
		}else{
			
			number1 = resultToUse || game.rnd.integerInRange(4,8)
			number2 = game.rnd.integerInRange(1,number1 - 1)
			
			resultToUse = number1 - number2
			
			signToUse = ' - '
		}
		
		doll.text.setText(doll.sign1 + number1 + signToUse + number2 + doll.sign2)
		
		if(doll.sign1 == '[' || doll.sign1 == '{'){
			
			var number3 = game.rnd.integerInRange(1,9)
			resultToUse+= number3
			
			doll.text.setText(doll.sign1 + number1 + signToUse + number2 + ' + ' + number3 + doll.sign2)
			
			if(doll.sign1 == '['){
				
				var number4 = game.rnd.integerInRange(1,9)
				resultToUse+= number4
				
				doll.text.setText(doll.sign1 + number1 + signToUse + number2 + ' + ' + number3 + ' + ' + number4 + doll.sign2)
			}
		}
		
		doll.result = resultToUse
		
		popObject(doll,0)
		
		changeNumbers()
		
	}
	
	function changeNumbers(){
		
		var numStart = 2
		if(resultToUse >= 8){
			numStart = resultToUse - game.rnd.integerInRange(1,5)	
		}else if(resultToUse <=2){
			numStart = 0
		}
		
		var delay = 0
		for(var i = 0; i < numbersGroup.length;i++){
			
			var number = numbersGroup.children[i]
			number.number = numStart
			number.setText(numStart)
			
			numStart++
			popObject(number,delay)
			
			delay+= 50
		}
		
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
				showScene()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.mathrioska','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		//console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.mathrioska',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.mathrioska','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
    	overlayGroup.y = -game.world.height
		showScene()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.mathrioska','pattern')
		sceneGroup.add(background)
	}
	
	function update(){
		
		background.tilePosition.x++
		dragButton.y = dragButton.initY
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
			////console.log(particle.tag + ' tag,' + particle.used)
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

				particle.makeParticles('atlas.mathrioska',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.mathrioska','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.mathrioska','smoke');
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
	
	function createContainer(){
		
		var bar = sceneGroup.create(game.world.centerX, game.world.height - 100,'atlas.mathrioska','numberbar')
		bar.width = game.world.width
		bar.anchor.setTo(0.5,0.5)
		
		numbersGroup = game.add.group()
		sceneGroup.add(numbersGroup)
		
		var pivotX = game.world.centerX - 250
		for(var i = 0; i < 6;i++){
			
			var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, pivotX, bar.y, i + 2, fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			pointsText.number = i + 2
			numbersGroup.add(pointsText)
			
			pointsText.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
			
			pivotX+= 100
			
		}
		
		dragButton = sceneGroup.create(game.world.centerX - 50, game.world.height - 120,'atlas.mathrioska','selector')
		dragButton.anchor.setTo(0.5,0.5)
		dragButton.scale.setTo(1.1,1.1)
		dragButton.inputEnabled = true
		dragButton.alpha = 0
		dragButton.initY = dragButton.y
		dragButton.input.enableDrag(true)
		dragButton.events.onDragStart.add(onDragStart, this);
		dragButton.events.onDragStop.add(onDragStop, this);
		
	}
	
	function onDragStart(obj){
		
		if(!gameActive){
			return
		}
		
		obj.dragEnabled = false
		sound.play("drag")
		
	}
	
	function onDragStop(obj){
		
		if(!gameActive){
			return
		}
		
		sound.play("cut")
		
		for(var i = 0; i < numbersGroup.length;i++){
			
			var number = numbersGroup.children[i]
			if(checkOverlap(obj,number) && Math.abs(obj.x - number.x) < 50){
				
				if(clock.tween){
					clock.tween.stop()
				}
				
				obj.inputEnabled = false 
				game.add.tween(obj).to({x:number.x},250,"Linear",true).onComplete.add(function(){
					//obj.inputEnabled = true
				})
				
				if(dollToUse.result == number.number){
					
					addPoint(1)
					createPart('star',number)
					
					game.time.events.add(500,function(){
						
						sound.play("cut")
						
						var scaleToUse = 0
						var alphaUsed = 0
						
						if(lastDoll){
							//console.log(lastDoll.sign1 + ' doll1 ' + dollToUse.sign1 + ' sign')
						}
						
						if(lastDoll && ((lastDoll.sign1 == '(' && dollToUse.sign1 == '{') || (lastDoll.sign1 == '(' && dollToUse.sign1 == '[') || (lastDoll.sign1 == '[' && dollToUse.sign1 == '{'))){
							
							scaleToUse = 1
							alphaUsed = 1
							
							dollToUse.text.setText('')
							dollToUse.anim.setAnimationByName(0,"OPEN&CLOSE",false)
							dollToUse.anim.addAnimationByName(0,"IDLE",true)
							//console.log('plus')
							
						}else{
							for(var i = 0; i < dollsGroup.length;i++){
								
								var doll = dollsGroup.children[i]
								game.add.tween(doll.scale).to({x:0,y:0},200,"Linear",true)
								
							}
						}
						
						game.add.tween(dollToUse.scale).to({x:scaleToUse,y:scaleToUse},200,"Linear",true).onComplete.add(function(){
							
							dollToUse.alpha = alphaUsed
							lastDoll = dollToUse
														
							indexDoll++
							if(indexDoll == indexList.length ){
								indexDoll = 0
							}
							
							showScene()
							
						})
						
					})
					
				}else{
					
					//console.log(dollToUse.result + ' result ' + number.number + ' number')
					missPoint()
					createPart('wrong',number)
                    if(lives !== 0){
                        showScene()
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
	
	function createDolls(){
		
		dollsGroup = game.add.group()
		sceneGroup.add(dollsGroup)
		
		var signToUse = ['[','{','(']
		var signToUse2 = [']','}',')']
		
		var pivotY = 175
		for(var i = 0; i < 3; i ++){
			
			var doll = game.add.group()
			doll.alpha = 0
			doll.x = game.world.centerX
			doll.y = game.world.height - 300 - pivotY
			dollsGroup.add(doll)
			doll.sign1 = signToUse[i]
			doll.sign2 = signToUse2[i]
			
			var anim = game.add.spine(0,0,'doll')
			anim.setSkinByName("matrioska" + (i+1))
			anim.setAnimationByName(0,"IDLE",true)
			doll.add(anim)
		
			doll.anim = anim
			
			var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, 0, pivotY - 5, i + 2, fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			doll.add(pointsText)
			
			if(signToUse[i] == '('){
				pointsText.scale.setTo(0.9,0.9)
			}
			
			pivotY -= 70
			doll.text = pointsText
		}
		
	}
	
	function createClock(){
		
        clock = game.add.group()
		clock.alpha = 0
        clock.x = game.world.centerX
		clock.scale.setTo(0.85,0.85)
        clock.y = 65
        sceneGroup.add(clock)
        
        var clockImage = clock.create(0,0,'atlas.mathrioska','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.mathrioska','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
        
        clock.bar = clockBar
        
    }
	
	return {
		
		assets: assets,
		name: "mathrioska",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			createDolls()
			createContainer()
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