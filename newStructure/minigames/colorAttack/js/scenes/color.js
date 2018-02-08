
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var color = function(){
    
    var localizationData = {
		"EN":{
		
		},

		"ES":{

		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.color",
                json: "images/color/atlas.json",
                image: "images/color/atlas.png",
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
			{	name: "whoosh",
				file: soundsPath + "robotWhoosh.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "gear",
				file: soundsPath + "gear.mp3"},
			
		],
    }
    
	var angleToUse = -15
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive
	var particlesGroup, particlesUsed
	var baseCenter, circleCenter
	var offWorld = -15
    var gameIndex = 15
	var moveDir
	var cursors
	var colorsGroup
	var buttonsGroup
	var numberPanel,bar
    var overlayGroup
    var puzzleSong
	var objectsGroup,usedObjects
	var gameSpeed
	var tableNumber, tableUsed, textUse
	
	var COLORS_TO_USE = [0xffff00,0x1cc4ff,0xff0000,0x1ddd38,0xff7f00,0x662d91]
	var COLORS_SEC = [0x1ddd38,0xff7f00,0x662d91]
	
	var colorCombinations = [[0,1],[0,2],[1,2]]
		
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		gameSpeed = 3
		gameActive = false
        moveDir = false
		moveRight = false
		
        loadSounds()
        
	}

    function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
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
	
	function animSides(){
		
		var timeToUse = 500
		var left = background.leftB
		var right = background.rightB
		
		var tween = game.add.tween(left.scale).to({x:left.scale.x * 0.85,y:0.85},timeToUse,"Linear",true,0,-1)
		tween.yoyo(true,0)
		
		var tween = game.add.tween(right.scale).to({x:right.scale.x * 0.85,y:0.85},timeToUse,"Linear",true,300,-1)
		tween.yoyo(true,0)
	}
	
	function showObjects(){
		
		var animList = [background.leftB, background.rightB,background.bot,baseCenter,buttonsGroup.children[0],buttonsGroup.children[1],circleCenter,colorsGroup]
		var delay = 500
		
		for(var i = 0; i < animList.length;i++){
			
			popObject(animList[i],delay)
			delay+=100
		}
		
		game.time.events.add(delay, function(){
			
			animSides()
			gameActive = true
			sendBall()
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
        
		gameActive = false		
		
        sound.play("wrong")
		sound.play("explosion")
		        
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
		
		//createTextPart('+' + number,numberPanel.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)		
		
		gameSpeed+= 0.15
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.color','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.color','life_box')

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
        puzzleSong.stop()
		
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
        
        game.load.spine('figures', "images/spines/skeleton.json")  
        game.load.audio('puzzleSong', soundsPath + 'songs/chemical_electro.mp3');
        
		/*game.load.image('howTo',"images/color/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/color/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/color/introscreen.png")*/
		game.load.image('background',"images/color/background.png")

		game.load.image('tutorial_image',"images/color/tutorial_image.png")
		loadType(gameIndex)

		//console.log(localization.getLanguage() + ' language')
        
    }
	
	function activateObject(obj,posX, posY){
		
		objectsGroup.remove(obj)
		usedObjects.add(obj)
		
		obj.alpha = 1
		obj.active = true
		obj.x = posX
		obj.y = posY
		
	}
	
	function deactivateObject(obj){
		
		//console.log('deactivate')
		
		obj.alpha = 0
		obj.active = false
		obj.x = -200
		
		usedObjects.remove(obj)
		objectsGroup.add(obj)
	}
	
	function getObject(tag){
		
		for(var i = 0; i < objectsGroup.length;i++){
			var object = objectsGroup.children[i]
			
			if(object.tag == tag && !object.active){
				return object
			}
		}
	}
	
	function sendBall(){
		
		if(!gameActive){
			return
		}
		
		console.log('sendBall')
		if(pointsBar.number > 5 && Math.random()*2 > 1.2){
			
			sound.play("cut")
			
			var index = game.rnd.integerInRange(0,2)
			var ballList = []
			var pivotX = game.world.centerX - 150
			
			for(var i = 0; i < colorCombinations[index].length;i++){
				
				var ball = getObject("ball")
				ball.tint = COLORS_TO_USE[colorCombinations[index][i]]
				activateObject(ball,pivotX,-100)
				ballList[i] = ball
				
				pivotX+= 300
				
				game.add.tween(ball).to({x:game.world.centerX,y:ball.y + 200},500,"Linear",true)
				
			}
			
			game.time.events.add(510,function(){
				
				sound.play("whoosh")
								
				var ball = getObject("ball")
				ball.tint = COLORS_SEC[index]
				activateObject(ball,game.world.centerX, ballList[1].y)
				
				createPart('ring',ballList[1])
				
				deactivateObject(ballList[1])
				deactivateObject(ballList[0])
			})
			
		}else{
			
			var ball = getObject('ball')
			activateObject(ball,game.world.centerX,-100)
			ball.tint = COLORS_TO_USE[game.rnd.integerInRange(0,COLORS_TO_USE.length - 1)]

			sound.play("cut")
		}
		
		
	}
	
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        createTutorialGif(overlayGroup,onClickPlay)

        
       /* var rect = new Phaser.Graphics(game)
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
				showObjects()
				
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.color','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		var offX = 0
		
		if(game.device.desktop){
			inputName = 'desktop'
			offX = 13
		}
		
		//console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX + offX,game.world.centerY + 125,'atlas.color',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.color','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
    	overlayGroup.y = -game.world.height
		showObjects()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width,game.world.height,'background')
		sceneGroup.add(background)
		
		var leftBack = sceneGroup.create(-200,game.world.height,'atlas.color','lados')
		leftBack.alpha = 0
		leftBack.anchor.setTo(0,1)
		
		var rightBack = sceneGroup.create(game.world.width + 200,game.world.height,'atlas.color','lados')
		rightBack.alpha = 0
		rightBack.anchor.setTo(0,1)
		rightBack.scale.setTo(-1,1)
		
		background.leftB = leftBack
		background.rightB = rightBack
	}
	
	function createBase(){
		
		var base = sceneGroup.create(game.world.centerX, game.world.height,'atlas.color','bottom')
		base.anchor.setTo(0.5,1)
		base.alpha = 0
		base.width = game.world.width
		background.bot = base
		
		circleCenter = sceneGroup.create(game.world.centerX,game.world.height - 185,'atlas.color','centerCircle')
		circleCenter.anchor.setTo(0.5,0.5)
		circleCenter.alpha = 0
		
		baseCenter = sceneGroup.create(game.world.centerX, game.world.height - 300,'atlas.color','centro')
		baseCenter.anchor.setTo(0.5,0.5)
		baseCenter.alpha = 0
		
		colorsGroup = game.add.group()
		colorsGroup.x = baseCenter.x
		colorsGroup.y = baseCenter.y
		colorsGroup.alpha = 0
		colorsGroup.scale.setTo(1.2,1.2)
		sceneGroup.add(colorsGroup)
		
		var angleUsed = 0
		for(var i = 0;i < 6;i++){
			var triangle = colorsGroup.create(0,0,'atlas.color','triangle')
			triangle.anchor.setTo(0.5,1)
			triangle.angle = angleUsed
			triangle.isCircle = false
			
			triangle.tint = COLORS_TO_USE[i]
			
			
			var ball = colorsGroup.create()
			angleUsed+=60
		}
		
		sceneGroup.remove(baseCenter)
		sceneGroup.add(baseCenter)
		
		var group = calcCircles(6)
		group.x-=50
		group.y-=50
		colorsGroup.add(group)
		
		colorsGroup.circles = group
		
	}
	
	function calcCircles(n) {
        
        group = game.add.group()
        
        var baseRadius = 40
        var angle = Math.PI / n;
        var s = Math.sin(angle);
        var r = baseRadius * s / (1-s);
		
		var orderList = [4,5,0,1,2,3]

        for(var i=0;i<n;++i) {
            var phi = 15 + angle * i * 2;
            var cx = 35+(baseRadius + r) * Math.cos(phi);
            var cy = 35+(baseRadius + r) * Math.sin(phi);
            
            var ball = group.create(cx,cy,'atlas.color','ball')
			ball.isCircle = true
			ball.scale.setTo(0.6,0.6)
			ball.tint = COLORS_TO_USE[orderList[i]]
        }
                
        return group
    }
	
	function inputButton(button){
		
		if(!gameActive || !button.active || moveDir){
			return
		}
		
		moveDir = true
		button.active = false
		
		sound.play('gear')
		var scaleToUse = button.scale.x
		
		var angleToUse = 60
		if(button.isleft){
			angleToUse*=-1
		}
		
		game.add.tween(colorsGroup).to({angle:colorsGroup.angle + angleToUse},100,"Linear",true)
		
		game.add.tween(button.scale).to({x:scaleToUse * 0.7,y:0.7},50,"Linear",true).onComplete.add(function(){
			game.add.tween(button.scale).to({x:scaleToUse,y:1},50,"Linear",true).onComplete.add(function(){
				button.active = true
				moveDir = false
			})
		})
	}
	
	function rotateColors(isLeft){
		
		sound.play('gear')
		
		var angleToUse = 60
		if(isLeft){
			angleToUse*=-1
		}
		
		moveDir = true
		game.add.tween(colorsGroup).to({angle:colorsGroup.angle + angleToUse},100,"Linear",true).onComplete.add(function(){
			moveDir = false
		})

	}
	
	function update(){
		
		background.tilePosition.y--
		
		if(!gameActive){
			return
		}
		
		if(cursors.left.isDown && !moveDir){
			rotateColors(true)
		}
		
		if(cursors.right.isDown && !moveDir){
			rotateColors(false)
		}
		
		checkObjects()
	}
	
	function checkObjects(){
		
		for(var i = 0; i < usedObjects.length;i++){
			
			var obj = usedObjects.children[i]
			
			obj.y+= gameSpeed
			
			for(var u = 0; u < colorsGroup.circles.length;u++){
				
				var triangle = colorsGroup.circles.children[u]
				if(checkOverlap(obj,triangle)){
					
					console.log(triangle.tint + ' color ' + obj.tint + ' ballColor')
					if(obj.tint == triangle.tint){
						console.log('point')
						addPoint(1)
						createPart('ring',obj,-50)
						createTextPart('+1',obj)
						sendBall()
					}else{
						missPoint()
						createPart('wrong',triangle)
						setExplosion(triangle)
					}
					
					deactivateObject(obj)
					break
				}
			}
		}
	}
		
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

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
    
    function createPart(key,obj,offsetY){
        
        var offY = offsetY || 0
        key+='Part'
        var particle = lookParticle(key)
        if(particle){
            
            particle.x = obj.world.x
            particle.y = obj.world.y + offY
            particle.scale.setTo(1,1)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:4,y:4},300,Phaser.Easing.Cubic.In,true)
            deactivateParticle(particle,300)
			
			if(key == 'ringPart'){
				particle.tint = obj.tint
			}
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
                particle = particlesGroup.create(-200,0,'atlas.color',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }

	function setExplosion(obj,tag,offset){
		
		var tagToUse = tag || 'smoke'
        var offY = offset || 0

		var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
		
		if(!tag){
			
			var exp = sceneGroup.create(0,0,'atlas.color','cakeSplat')
			exp.x = posX
			exp.y = posY
			exp.anchor.setTo(0.5,0.5)

			exp.scale.setTo(6,6)
			game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
			var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
			
			var rect = new Phaser.Graphics(game)
			rect.beginFill(0xffffff)
			rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
			rect.alpha = 0
			rect.endFill()
			sceneGroup.add(rect)

			game.add.tween(rect).from({alpha:1},500,"Linear",true)
			
		}
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.color',tagToUse);
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = posX;
        particlesGood.y = posY + offY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
	
	function createAssets(tag,scale,number){
		
		for( var i = 0; i < number;i++){
			
			var obj = objectsGroup.create(0,0,'atlas.color',tag)
			obj.anchor.setTo(0.5,0.5)
			obj.tag = tag
			obj.scale.setTo(scale,scale)
			obj.alpha = 0
			obj.active = false
		}
	}
	
	function addParticles(){
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',5)
		createParticles('wrong',5)
		createParticles('ring',5)
		createParticles('text',5)
	}
	
	function createButtons(){
		
		buttonsGroup = game.add.group()
		sceneGroup.add(buttonsGroup)
		
		var pivotX = game.world.centerX - 200
		
		for(var i = 0; i < 2 ; i++){
			
			var arrow = buttonsGroup.create(pivotX, game.world.height - 80,'atlas.color','flecha')
			arrow.alpha = 0
			arrow.anchor.setTo(0.5,0.5)
			arrow.inputEnabled = true
			arrow.events.onInputDown.add(inputButton)
			arrow.active = true
			arrow.isleft = true
						
			if(i==1){
				
				arrow.scale.x = -1
				arrow.isleft = false
			}
			
			pivotX+=400
			
		}
	}
	
	function createObjects(){
		
		objectsGroup = game.add.group()
		sceneGroup.add(objectsGroup)
		
		usedObjects = game.add.group()
		sceneGroup.add(usedObjects)
		
		createAssets('ball',1,5)
	}
	
	return {
		
		assets: assets,
		name: "color",
		update: update,
        preload:preload,
		create: function(event){
            
			this.swipe = new Swipe(this.game);
			cursors = game.input.keyboard.createCursorKeys()
			
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createBase()
			createObjects()
			createButtons()
                        			
            puzzleSong = game.add.audio('puzzleSong')
            game.sound.setDecodedCallback(puzzleSong, function(){
                puzzleSong.loopFull(0.6)
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
			
			buttons.getButton(puzzleSong,sceneGroup)
            createOverlay()
			
			addParticles()
            
            animateScene()
            
		},
	}
}()