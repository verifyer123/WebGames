
var soundsPath = "../../shared/minigames/sounds/"
var map = function(){
    
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
                name: "atlas.map",
                json: "images/map/atlas.json",
                image: "images/map/atlas.png",
            },
			
			{   
                name: "atlas.icons",
                json: "images/map/icons/atlas.json",
                image: "images/map/icons/atlas.png",
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
			{	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
			{	name: "laserPull",
				file: soundsPath + "laserPull.mp3"},
			{	name: "bomb",
				file: soundsPath + "bomb.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 7
	var indexGame
    var overlayGroup
    var spaceSong
	var scroller
	var tileColors = [ 0xff92ad]
	var horizontalScroll, verticalScroll,kineticMovement
	var ballsPosition
	var mouseActive
	var start
	var yogotarGroup
	var buttonsActive
	var pointer
	var ship
	var whiteFade
	var shine
	
	var iconsPositions = [
		
		{x:  38,y:7466.3090909090915},
		{x:  -115,y:7447.523554581991},
		{x:  -94,y:7224.231409716987},
		{x:  127,y:7207.08732866864},
		{x:  121,y:7014.4967477663595},
		{x:  32,y:7100.369475039087},
		{x:  -113,y:7088.7092339989795},
		{x:  -97,y:6846.999617944877},
		{x:  135,y:6823.529843451141},
		{x:  113,y:6636.157133637524},
		{x:  32,y:6724.418032035787},
		{x:  -121,y:6705.463449446595},
		{x:  -95,y:6471.29981308296},
		{x:  134,y:6451.654220860643},
		{x:  109,y:6263.366602182181},
		{x:  33,y:6354.5215037301605},
		{x:  -113,y:6336.812412821069},
		{x:  -92,y:6097.522175274089},
		{x:  137,y:6072.794902546816},
		{x:  109,y:5881.53345154249},
		{x:  34,y:5973.102574679746},
		{x:  -104,y:5967.986074893585},
		{x:  -92,y:5720.751421602689},
		{x:  130,y:5699.792429128066},
		{x:  105,y:5508.868594874287},
		{x:  33,y:5600.913558141134},
		{x:  -109,y:5587.140868284927},
		{x:  -94,y:5344.233294444293},
		{x:  139,y:5322.21672804405},
		{x:  119,y:5134.961340598599},
		{x:  32,y:5224.140341995779},
		{x:  -109,y:5212.500618944498},
		{x:  -97,y:4973.027891671771},
		{x:  135,y:4944.224619607021},
		{x:  111,y:4759.625734341299},
		{x:  35,y:4850.776769630385},
		{x:  -109,y:4840.055797831114},
		{x:  -96,y:4598.611335442015},
		{x:  134,y:4572.32142267851},
		{x:  110,y:4386.32142267851},
		{x:  35,y:4472.2123317694195},
		{x:  -110,y:4454.355402349839},
		{x:  -89,y:4220.100856895293},
		{x:  135,y:4196.069788168984},
		{x:  108,y:4013.3226685388277},
		{x:  30,y:4100.101245102956},
		{x:  -114,y:4081.3841742767454},
		
	]

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		mouseActive = false
		buttonsActive = false
		buttonPressed = null
        
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
        game.add.tween(sceneGroup).to({alpha:1},400,"Linear",true)
		
		game.time.events.add(1200,function(){
			
			ship.alpha = 1
			sound.play("laserPull")
			
			var startBall = ballsPosition.children[0]
			game.add.tween(ship).to({y:startBall.y - 50},2500,"Linear",true).onComplete.add(function(){
				
				createPart('smoke',ship,0,50)
				sound.play("bomb")
				
				game.time.events.add(500,function(){
					
					sound.play("whoosh")
					
					yogotarGroup.anim.setAnimationByName(0,"JUMP",true)
					yogotarGroup.alpha = 1
					game.add.tween(yogotarGroup).to({x:startBall.x},1000,"Linear",true)

					game.add.tween(yogotarGroup).to({y:startBall.y - 150},500,Phaser.Easing.Quadratic.In,true)
					game.time.events.add(500,function(){
						
						yogotarGroup.anim.setAnimationByName(0,"LAND",false)
						yogotarGroup.anim.addAnimationByName(0,"IDLE",true)
						
						game.add.tween(yogotarGroup).to({y:startBall.y},500,Phaser.Easing.Quadratic.Out,true).onComplete.add(function(){
							
							buttonsActive = true
							scroller.start()
						})
					})
				})
				
								
			})
			
			var scaleTween = game.add.tween(ship.scale).to({x:0.9,y:0.9},200,"Linear",true,0,5)
			scaleTween.yoyo(true,0)
		})

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
        
		buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('spaceSong', soundsPath + 'songs/childrenbit.mp3');
		game.load.spine('eagle',"images/spines/yogotar.json")
		
		console.log(localization.getLanguage() + ' language')
        
    }
	
	function createShine(){
		
		shine = scroller.create(0,0,'atlas.map','shine')
		shine.anchor.setTo(0.5,0.5)
		shine.alpha = 0
		
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
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.map','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.map',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.map','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }
	
	function createBallsPos(){
		
		ballsPosition = game.add.group()
		scroller.add(ballsPosition)
		
		var games = epicYogomeGames.getGames()
		Phaser.ArrayUtils.shuffle(games)
		
		for(var i = 0; i < iconsPositions.length;i++){
			
			var ball = ballsPosition.create(game.world.centerX - iconsPositions[i].x,iconsPositions[i].y - start.y,'atlas.map','number_container')
			ball.anchor.setTo(0.5,0.5)
			ball.order = i
			ball.inputEnabled = true
			ball.icon = null
			ball.events.onInputDown.add(inputBall)			
							
			if(i==0 || i % 5 == 0){
				ball.alpha = 0
			}else if(i % 5 != 0){
				var gameImage = scroller.create(ball.x, ball.y,'atlas.icons',games[i].sceneName)
				gameImage.scale.setTo(0.4,0.4)
				gameImage.anchor.setTo(0.5,0.5)
				
				ball.icon = gameImage
				ball.url = games[i].url
				
			}
		}
	}
	
	function inputBall(obj){
		
		//console.log('pressed ' + obj.order)
		if(!buttonsActive || !obj.icon){
			return
		}
		
		
		sound.play("pop")
		
		buttonPressed = obj
		buttonsActive = false
		
		sendYogotar()
	}
	
	function sendYogotar(){
		
		if(yogotarGroup.index != buttonPressed.order){
			
			var ballBack = ballsPosition.children[yogotarGroup.index]
			var ballTo 
			if(yogotarGroup.index < buttonPressed.order){
				
				yogotarGroup.index++
		
			}else{
				
				yogotarGroup.index--
			}
			
			ballTo = ballsPosition.children[yogotarGroup.index]

			if(ballBack.x > ballTo.x){
				yogotarGroup.scale.setTo(-1,1)
			}else{
				yogotarGroup.scale.setTo(1,1)
			}

			yogotarGroup.anim.setAnimationByName(0,"RUN",true)
			game.add.tween(yogotarGroup).to({x:ballTo.x,y:ballTo.y},1000,"Linear",true).onComplete.add(function(){

				yogotarGroup.anim.setAnimationByName(0,"IDLE",true)

				//console.log(buttonPressed.order + ' order ' +  yogotarGroup.index + ' yogoIndex')
				if(yogotarGroup.index == buttonPressed.order){
					
					sendGame()
				}else{
					sendYogotar()
				}

			})
			
		}else{
			buttonsActive = true
		}
		
		
	}
	
	function sendGame(){
		
		yogotarGroup.anim.setAnimationByName(0,"WIN2",true)
		
		createPart('star',buttonPressed)
		sound.play("magic")
		
		game.time.events.add(750,function(){
			
			var icon = buttonPressed.icon
		
			scroller.remove(icon)
			scroller.add(icon)

			game.add.tween(icon.scale).to({x:1,y:1},500,"Linear",true)
			game.add.tween(icon).to({x:game.world.centerX, angle:icon.angle + 360},500,"Linear",true)

			shine.x = icon.x
			shine.y = icon.y
			shine.alpha = 1

			game.add.tween(shine.scale).to({x:5,y:5},500,"Linear",true)
			game.add.tween(shine).to({x:game.world.centerX},500,"Linear",true)

			//if(scroller < start.y * -0.74){
				scroller.scrollTo(0,-yogotarGroup.y * 0.85,200)
			//}
			
			console.log(scroller.y + ' posY')
			game.time.events.add(200,function(){

				scroller.stop()
			})

			game.add.tween(sceneGroup).to({alpha:0},1000,"Linear",true,1500).onComplete.add(function(){
				window.open(buttonPressed.url,'_self')
			})
		})
		
		
		
	}
	
	function addPosition(obj){
		
		
	}
	
	function createBackground(){
		
		scroller = game.add.existing(new ScrollableArea(0, 0, game.width, game.height));
		scroller.start();
		sceneGroup.add(scroller)

		horizontalScroll = false;
		verticalScroll = true;
		kineticMovement = true;
		
		configureScroll()
		
		background = game.add.tileSprite(0,0,game.world.width,game.world.height * 4,'atlas.map','texture')
		background.anchor.setTo(0,0)
		background.tint = tileColors[0]
		background.inputEnabled = true
		background.events.onInputDown.add(addPosition)
		scroller.add(background)
		
		start = scroller.create(game.world.centerX + 150,background.height - 75,'atlas.map','roadbegin')
		start.anchor.setTo(1,1)
		
		var road = game.add.tileSprite(start.x, start.y - start.height,328,374 * 9,'atlas.map','road')
		road.anchor.setTo(1,1)
		scroller.add(road)
		
		createBallsPos()
		
		scroller.stop()
		scroller.scrollTo(0,-start.y * 0.76)
		
		pointer = sceneGroup.create(-100,0,'atlas.map','star')
		pointer.anchor.setTo(0.5,0.5)
		
	}
	
	function configureScroll() {
		
		scroller.configure({
			horizontalScroll:horizontalScroll,
			verticalScroll:verticalScroll,
			kineticMovement:kineticMovement
		});
	}
	
	function update(){
		
		//console.log(scroller.x + ' posX,' + scroller.y + ' posY')
		
		shine.angle++
		touchPosition()
	}
	
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	function touchPosition(){
		
		
		if(game.input.activePointer.isDown && buttonsActive){
			
			pointer.x = game.input.x
			pointer.y = game.input.y
			
			for(var i = 0; i < ballsPosition.length; i++){
				
				var ball = ballsPosition.children[i]
				if(checkOverlap(ball,pointer)){
					inputBall(ball)
				}
			}
		}else{
			
			pointer.x = -100
		}
		
		/*if(!mouseActive && game.input.activePointer.middleButton.isDown){
			
			mouseActive = true
			
			var circle = ballsPosition.create(game.input.x,game.input.y - scroller.y,'atlas.map','number_container')
			circle.anchor.setTo(0.5,0.5)
			sound.play("pop")
		}
		
		if(game.input.activePointer.middleButton.isUp){
			mouseActive = false
		}
		
		if(game.input.activePointer.rightButton.isDown && !gameActive){
			
			printCirclePositions()
			gameActive = true
		}*/
	}
	
	function printCirclePositions(){
		
		
		var stringToUse = ''
		
		for(var i = 0; i < ballsPosition.length;i++){
			
			var circle = ballsPosition.children[i]
			
			stringToUse+= '{x:' + (game.world.centerX -  circle.x) +',y:' + (circle.y + start.y) + '},\n'
		}
		
		console.log(stringToUse)
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
    
    function createPart(key,obj,offsetX, offsetY){
        
        var offX = offsetX || 0
		var offY = offsetY || 0
        var particle = lookParticle(key)
		
        if(particle){
            
            particle.x = obj.world.x + offX
            particle.y = obj.world.y + offY
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

				particle.makeParticles('atlas.map',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.map','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.map','smoke');
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
	
	function createYogotar(){
		
		var startBall = ballsPosition.children[0]
		
		ship = scroller.create(startBall.x - 125,startBall.y - game.world.height,'atlas.map','ship')
		ship.alpha = 0
		ship.scale.setTo(1.1,1.1)
		ship.anchor.setTo(0.5,0.5)
		
		yogotarGroup = game.add.group()
		yogotarGroup.alpha = 0
		yogotarGroup.x =ship.x
		yogotarGroup.y = startBall.y
		scroller.add(yogotarGroup)
		
		var anim = game.add.spine(0,15,"eagle")
		anim.setAnimationByName(0,"IDLE",true)
		anim.setSkinByName("Eagle")
		anim.scale.setTo(0.4,0.4)
		yogotarGroup.add(anim)
		
		yogotarGroup.anim = anim
		yogotarGroup.index = 0
	}
	
	return {
		
		assets: assets,
		name: "map",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			createYogotar()
			addParticles()
                        			
            spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                //spaceSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			//createPointsBar()
			//createHearts()
			
			buttons.getButton(spaceSong,sceneGroup)
			createShine()
            //createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()