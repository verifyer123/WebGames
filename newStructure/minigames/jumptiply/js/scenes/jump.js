
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var jump = function(){
    
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
                name: "atlas.jump",
                json: "images/jump/atlas.json",
                image: "images/jump/atlas.png",
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
			{	name: "powerup",
				file: soundsPath + "powerup.mp3"},
			{	name: "throw",
				file: soundsPath + "throw.mp3"},
			{	name: "glassbreak",
				file: soundsPath + "glassbreak.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 64
	var indexGame
    var overlayGroup
    var spaceSong
	var floorGroup, yogotar
	var board
	var timeToUse,result
    var firstToing
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
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
        
		if(timeToUse > 1000){
			timeToUse-=1000
		}
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.jump','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.jump','life_box')

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
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 5000)
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
        
        game.load.spine('yogotar', "images/spines/Nao/nao.json")  
        game.load.spine('jumper', "images/spines/Jumper/jumper.json")  
        
        game.load.audio('spaceSong', soundsPath + 'songs/space_bridge.mp3');
        
		/*game.load.image('howTo',"images/jump/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/jump/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/jump/introscreen.png")*/
		
		game.load.image('tutorial_image',"images/jump/tutorial_image.png")
        loadType(gameIndex)

        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
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
				showScene(true)
				
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.jump','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.jump',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.jump','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
        overlayGroup.y = -game.world.height
        showScene(true)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.jump','edificio')
		sceneGroup.add(background)
		
		background.fall = false
	}
	
	function update(){
		
		background.tilePosition.x++
		if(background.fall){
			background.tilePosition.y+= 4
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

				particle.makeParticles('atlas.jump',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.jump','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.jump','smoke');
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
		
		if(clock.tween){
			clock.tween.stop()
		}
		
		var parent = obj.parent.parent
		
		var tween = game.add.tween(obj.parent.scale).to({x:0.7,y:0.7},200,"Linear",true)
		tween.yoyo(true,0)
		
		if(parent.number1 == result[0] && parent.number2 == result[1]){
			
			addPoint(1)
			createPart('star',obj)
			
			game.time.events.add(500,function(){
				showScene(false)
				
				sound.play("cut")
				
				yogotar.setAnimationByName(0,"JUMP",true)
				
				game.add.tween(yogotar).to({x:obj.world.x},1000,"Linear",true)
				game.add.tween(yogotar).to({y:obj.world.y - 50},500,Phaser.Easing.Cubic.In,true).onComplete.add(function(){
					game.add.tween(yogotar).to({y:obj.world.y + 130},500,Phaser.Easing.Cubic.Out,true,500).onComplete.add(function(){
					
						yogotar.setAnimationByName(0,"JUMP",true)
						
						sound.play("throw")
						var tween = game.add.tween(parent.toing.scale).to({y:0.6},200,"Linear",true)
						tween.yoyo(true,0)
						
						var tween = game.add.tween(yogotar).to({y:yogotar.y + 25},200,"Linear",true)
						tween.yoyo(true,0)
						
						tween.onComplete.add(function(){
							
							background.fall = true
							sound.play("powerup")
							
							game.add.tween(yogotar).to({x:game.world.centerX - 200,angle:yogotar.angle - 360},1200,"Linear",true)
							var tween = game.add.tween(yogotar).to({y:yogotar.y - 200},900,"Linear",true)
							tween.yoyo(true,0)
							tween.onComplete.add(function(){
								yogotar.setAnimationByName(0,"IDLE",true)
								
								showScene(true)
							})
							
							game.add.tween(floorGroup).to({y:game.world.height + 300},500,"Linear",true).onComplete.add(function(){
								floorGroup.y = -300
								game.add.tween(floorGroup).to({y:game.world.height - 100},700,"Linear",true).onComplete.add(function(){
									background.fall = false
								})
							})
						})
					})
				})
				
			})
			
			
		}else{
			
			missPoint()
			createPart('wrong',obj)
							
			game.time.events.add(500,function(){
				showScene(false)
				
				sound.play("cut")
				
				yogotar.setAnimationByName(0,"JUMP",true)
				
				game.add.tween(yogotar).to({x:obj.world.x},1000,"Linear",true)
				game.add.tween(yogotar).to({y:obj.world.y - 50},500,Phaser.Easing.Cubic.In,true).onComplete.add(function(){
					game.add.tween(yogotar).to({y:obj.world.y + 130},500,Phaser.Easing.Cubic.Out,true,500).onComplete.add(function(){
						
						sound.play("throw")
						var tween = game.add.tween(parent.toing.scale).to({y:0.6},200,"Linear",true)
						tween.yoyo(true,0)
						
						var tween = game.add.tween(yogotar).to({y:yogotar.y + 25},200,"Linear",true)
						tween.yoyo(true,0)
						
						tween.onComplete.add(function(){
							
                            if(lives !== 0){
                                yogotar.setAnimationByName(0,"LOSE",false)
                                background.fall = true
                                sound.play("powerup")

                                game.add.tween(yogotar).to({x:game.world.centerX - 200,angle:yogotar.angle - 360},1200,"Linear",true)
                                var tween = game.add.tween(yogotar).to({y:yogotar.y - 200},900,"Linear",true)
                                tween.yoyo(true,0)
                                tween.onComplete.add(function(){
                                    yogotar.setAnimationByName(0,"IDLE",true)

                                    showScene(true)
                                })

                                game.add.tween(floorGroup).to({y:game.world.height + 300},500,"Linear",true).onComplete.add(function(){
                                    floorGroup.y = -300
                                    game.add.tween(floorGroup).to({y:game.world.height - 100},700,"Linear",true).onComplete.add(function(){
                                        background.fall = false
                                    })
                                })
                            }
                            else{
                                game.add.tween(yogotar).to({x:game.world.centerX, y: game.world.centerY,angle:yogotar.angle + 360},500,"Linear",true)
                                game.add.tween(yogotar.scale).to({x:3,y:3},500,"Linear",true).onComplete.add(function(){

                                    var rect = new Phaser.Graphics(game)
                                    rect.beginFill(0xffffff)
                                    rect.drawRect(0,0,game.world.width *2, game.world.height *2)
                                    rect.alpha = 0
                                    rect.endFill()
                                    sceneGroup.add(rect)

                                    game.add.tween(rect).from({alpha:1},500,"Linear",true)

                                    game.add.tween(yogotar).to({y:yogotar.y + 200},2000,"Linear",true)

                                    sound.play("glassbreak")

                                    var glass = sceneGroup.create(yogotar.x, yogotar.y - 150,'atlas.jump','brokenglass')
                                    glass.anchor.setTo(0.5,0.5)
                                    glass.scale.setTo(3,3)

                                })
                            }
                            
							yogotar.setAnimationByName(0,"LOSE",false)
							
							//yogotar.addAnimationByName(0,"LOSESTILL",false)

						})
					})
				})
				
			})
		}
	}
	
	function createFloor(){
		
		floorGroup = game.add.group()
		floorGroup.y = game.world.height - 100
		sceneGroup.add(floorGroup)
		
		var floor = game.add.tileSprite(0,0,game.world.width,90,'atlas.jump','tileStone')
		floorGroup.add(floor)
		
		var pivotX = game.world.centerX - 200
		
		for(var i = 0; i < 4; i++){
			
			var trampGroup = game.add.group()
			trampGroup.x = pivotX
			trampGroup.y = 0
			floorGroup.add(trampGroup)
			
			var toing = trampGroup.create(0,0,'atlas.jump','toing')
			toing.anchor.setTo(0.5,1)
			
			trampGroup.toing = toing
			
			if(i>0){
				
				var numberGroup = game.add.group()
				numberGroup.y = -200
				numberGroup.alpha = 0
				trampGroup.add(numberGroup)
				
				var cont = numberGroup.create(0,0,'atlas.jump','btn')
				cont.inputEnabled = true
				cont.events.onInputDown.add(inputButton)
				cont.anchor.setTo(0.5,0.5)
				
				var tween = game.add.tween(cont.scale).to({x:0.9,y:0.9},game.rnd.integerInRange(4,7) * 100,"Linear",true,0,-1)
				tween.yoyo(true,0)
				
				var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var textUse = new Phaser.Text(sceneGroup.game, 0, 3, '0', fontStyle)
                textUse.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
				textUse.anchor.setTo(0.5,0.5)
				numberGroup.add(textUse)
								
				trampGroup.number = numberGroup
				trampGroup.text = textUse
				
			}
			
			pivotX+= 150
		}
		
        firstToing = floorGroup.children[1].toing
        
		yogotar = game.add.spine(game.world.centerX - 200,game.world.height - 175,'yogotar')
		yogotar.setSkinByName('nao')
		yogotar.setAnimationByName(0,"IDLE",true)
		sceneGroup.add(yogotar)
		
	}
	
	function createBoard(){
		
		board = game.add.group()
		board.x = game.world.centerX
		board.y = game.world.centerY - 200
		board.alpha = 0
		sceneGroup.add(board)
		
		var boardImage = board.create(0,0,'atlas.jump','boardNumber')
		boardImage.anchor.setTo(0.5,0.5)
		
		var tween = game.add.tween(boardImage.scale).to({x:1.1,y:1.1},500,"Linear",true,0,-1)
		tween.yoyo(true,0)
		
		var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
		var textUse = new Phaser.Text(sceneGroup.game, 0, 3, '0', fontStyle)
		textUse.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
		textUse.anchor.setTo(0.5,0.5)
		board.add(textUse)
		textUse.lineSpacing = -35
		
		board.text2 = textUse
		textUse.scale.setTo(1.2,1.2)
		
		var textUse = new Phaser.Text(sceneGroup.game, -85, 3, '0', fontStyle)
		textUse.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
		textUse.anchor.setTo(0.5,0.5)
		board.add(textUse)
		textUse.lineSpacing = -35
		
		board.text1 = textUse
		
		var textUse = new Phaser.Text(sceneGroup.game, 85, 3, '0', fontStyle)
		textUse.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
		textUse.anchor.setTo(0.5,0.5)
		board.add(textUse)
		textUse.lineSpacing = -35
		
		board.text3 = textUse
	}
	
	function setNumbers(){
		
		var numbers = []
		
		for(var i = 0; i < 4; i++){
			numbers[i] = game.rnd.integerInRange(1,9)
		}
		
		result = []
		
		result[0] = numbers[0] * numbers[1]
		result[1] = numbers[2] * numbers[3]
		
		board.text2.setText(' X ')
		
		board.text1.setText(numbers[0] + '\n---\n' + numbers[2])
		board.text3.setText(numbers[1] + '\n---\n' + numbers[3])
		
		var index = game.rnd.integerInRange(2,4)
		for(var i = 2; i < floorGroup.length;i++){
			
			var group = floorGroup.children[i]
			group.number1 = result[0] - game.rnd.integerInRange(2,result[0] - 1)
			group.number2 = result[1] - game.rnd.integerInRange(2,result[1] - 1)
			
			if(index == i){
				
				group.number1 = result[0]
				group.number2 = result[1]
			}
			
			group.text.setText(group.number1 + '\n---\n' + group.number2)
			group.text.lineSpacing = -23
		}
	}
	
	function showScene(doShow){
		
		var delay = 0
		
		for(var i = 2; i < floorGroup.length;i++){
				
			var group = floorGroup.children[i]
			popObject(group.number, delay,doShow)
			delay+= 200

		}
		
	
		if(doShow){
			
			setNumbers()
			
			popObject(board,delay,true)
			
			delay+= 200
			popObject(clock,delay,true)
			
			game.time.events.add(delay,function(){
				
				gameActive = true
				
				clock.bar.scale.x = clock.bar.origScale
				clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeToUse,"Linear",true)
				clock.tween.onComplete.add(function(){
					timeUp()
				})
			})
			
		}else{
			
			popObject(board,delay,false)
			
			delay+= 200
			popObject(clock,delay,false)
			
		}
	}
    
    function timeUp(){
        
        missPoint()
        
        var particle = lookParticle('wrong')
		
        if(particle){
            
            particle.x = yogotar.x 
            particle.y = yogotar.y
            particle.scale.setTo(1,1)
            particle.start(true, 1500, null, 6);
			
			game.add.tween(particle).to({alpha:0},500,"Linear",true,1000).onComplete.add(function(){
				deactivateParticle(particle,0)
			})
			
        }

        game.time.events.add(500,function(){
            showScene(false)

            sound.play("cut")

            yogotar.setAnimationByName(0,"JUMP",true)

            game.add.tween(yogotar).to({y:yogotar.y - 50},500,Phaser.Easing.Cubic.In,true).onComplete.add(function(){
                game.add.tween(yogotar).to({y:yogotar.y + 50},500,Phaser.Easing.Cubic.Out,true,500).onComplete.add(function(){

                    sound.play("throw")
                    var tween = game.add.tween(firstToing.scale).to({y:0.6},200,"Linear",true)
				    tween.yoyo(true,0)

                    var tween = game.add.tween(yogotar).to({y:yogotar.y + 25},200,"Linear",true)
                    tween.yoyo(true,0)

                    tween.onComplete.add(function(){

                        if(lives !== 0){
                            yogotar.setAnimationByName(0,"LOSE",false)
                            background.fall = true
                            sound.play("powerup")

                            game.add.tween(yogotar).to({x:game.world.centerX - 200,angle:yogotar.angle - 360},1200,"Linear",true)
                            var tween = game.add.tween(yogotar).to({y:yogotar.y - 200},900,"Linear",true)
                            tween.yoyo(true,0)
                            tween.onComplete.add(function(){
                                yogotar.setAnimationByName(0,"IDLE",true)

                                showScene(true)
                            })

                            game.add.tween(floorGroup).to({y:game.world.height + 300},500,"Linear",true).onComplete.add(function(){
                                floorGroup.y = -300
                                game.add.tween(floorGroup).to({y:game.world.height - 100},700,"Linear",true).onComplete.add(function(){
                                    background.fall = false
                                })
                            })
                        }
                        else{
                            game.add.tween(yogotar).to({x:game.world.centerX, y: game.world.centerY,angle:yogotar.angle + 360},500,"Linear",true)
                            game.add.tween(yogotar.scale).to({x:3,y:3},500,"Linear",true).onComplete.add(function(){

                                var rect = new Phaser.Graphics(game)
                                rect.beginFill(0xffffff)
                                rect.drawRect(0,0,game.world.width *2, game.world.height *2)
                                rect.alpha = 0
                                rect.endFill()
                                sceneGroup.add(rect)

                                game.add.tween(rect).from({alpha:1},500,"Linear",true)

                                game.add.tween(yogotar).to({y:yogotar.y + 200},2000,"Linear",true)

                                sound.play("glassbreak")

                                var glass = sceneGroup.create(yogotar.x, yogotar.y - 150,'atlas.jump','brokenglass')
                                glass.anchor.setTo(0.5,0.5)
                                glass.scale.setTo(3,3)

                            })
                        }

                        yogotar.setAnimationByName(0,"LOSE",false)

                        //yogotar.addAnimationByName(0,"LOSESTILL",false)

                    })
                })
            })
        })
    }
	
	function createClock(){
		
        clock = game.add.group()
		clock.alpha = 0
        clock.x = game.world.centerX
		clock.scale.setTo(0.85,0.85)
        clock.y = 65
		clock.alpha = 0
        sceneGroup.add(clock)
        
        var clockImage = clock.create(0,0,'atlas.jump','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.jump','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
        
        clock.bar = clockBar
        
    }
	
	return {
		
		assets: assets,
		name: "jump",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createBoard()
			createFloor()
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