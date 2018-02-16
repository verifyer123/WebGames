
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var triangrid = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
			"ready":"Ready"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
			"ready":"Listo"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.triangrid",
                json: "images/triangrid/atlas.json",
                image: "images/triangrid/atlas.png",
            },
            {   

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
    
	var staticLine
	var limitDrag
	var lastIndex
    var lives = null
	var indexToUse
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 90
	var indexGame
    var overlayGroup
	var container
	var figuresGroup
	var timeToUse
	var figureToUse
    var spaceSong
	var pointsGroup, dragPoints, linesGroup
	var readyBtn
	
	var figureNames = ['6_60','12_90','14_45','18_30','18_60','36_45']
	var anglesUsed = [[60,60],[60,30],[45,45],[30,30],[60,60],[30,60]]
	var angleLeft = [60,40,90,60,60,90]

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		limitDrag = game.world.height - 150
		indexToUse = null
		figureToUse = null
		timeToUse = 15000
		lastIndex = 0
        
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
		
		if(pointsBar.number > 3000){
			timeToUse-= 1000
		}
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.triangrid','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.triangrid','life_box')

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
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2000)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
		
		
        game.stage.disableVisibilityChange = false;
        
        //game.load.spine('ship', "images/spines/skeleton1.json")  
        game.load.audio('spaceSong', soundsPath + 'songs/space_bridge.mp3');
        
		game.load.image('howTo',"images/triangrid/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/triangrid/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/triangrid/introscreen.png")
		
		game.load.image('tutorial_image',"images/triangrid/tutorial_image.png")
		//loadType(gameIndex)

        
    }
    
	function setFigure(){
		
		indexToUse = game.rnd.integerInRange(0,figureNames.length - 1)
		
		while(lastIndex == indexToUse){
			indexToUse = game.rnd.integerInRange(0,figureNames.length - 1)
		}
		var tag = figureNames[indexToUse]
		
		lastIndex = indexToUse

		game.add.tween(staticLine).to({angle:-anglesUsed[indexToUse][0]},200,"Linear",true)
		staticLine.text.setText(Math.abs(anglesUsed[indexToUse][0]) + '°')
		
		popObject(staticLine.text,0)
		
		for(var i = 0; i < figuresGroup.length;i++){
		
			var figure = figuresGroup.children[i]
			if(figure.tag == tag){
				figureToUse = figure
			}
		}
		
		figureToUse.hint.alpha = 1
		figureToUse.image.alpha = 0
		
		game.time.events.add(500,function(){
			
			dragPoints.drag.inputEnabled = true
			clock.bar.scale.x = clock.bar.origScale
			popObject(clock,0)
			
			gameActive = true
			readyBtn.btn.inputEnabled = true
			readyBtn.btn.alpha = 1
			popObject(figureToUse,0)
			
			clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeToUse,"Linear",true)
			clock.tween.onComplete.add(function(){
				missPoint()
			})
			
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
                
				setFigure()
				overlayGroup.y = -game.world.height
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.triangrid','gametuto')
		tuto.anchor.setTo(0.5,0.5)
		tuto.scale.setTo(0.9,0.9)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 260,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.triangrid',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.triangrid','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/

    }
    
    function onClickPlay(){
    	setFigure()
		overlayGroup.y = -game.world.height
    }

    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xFFDF8F)
        rect.drawRect(0,0,game.world.width, game.world.height * 0.6)
        rect.endFill()
		sceneGroup.add(rect)
		
		background = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.triangrid','brickss')
		sceneGroup.add(background)
		
		var rect2 = new Phaser.Graphics(game)
        rect2.beginFill(0x25084F)
        rect2.drawRect(0,rect.height,game.world.width, game.world.height * 0.6)
        rect2.endFill()
		sceneGroup.add(rect2)
		
		var line = game.add.tileSprite(0,rect.height,game.world.width,25,'atlas.triangrid','yellow_bar')
		sceneGroup.add(line)
		
		var pivotX = 100
		for(var i = 0; i < 2; i++){
			
			var plant = sceneGroup.create(pivotX,rect.height,'atlas.triangrid','plant')
			plant.anchor.setTo(0.5,1)
			
			var tween = game.add.tween(plant.scale).to({y:0.7},game.rnd.integerInRange(5,15) * 100,"Linear",true,0,-1)
			tween.yoyo(true,0)
			
			pivotX = game.world.width - 100
			
		}
		
	}
	
	function update(){
		
		background.tilePosition.x+= 0.5
		if(!gameActive){
			return
		}
		
		for(var i = 0; i < dragPoints.length;i++){
			
			var drag = dragPoints.children[i]
			if(drag.y > limitDrag ){
				drag.y = limitDrag
			}
			
			if(drag.dragging){
								
				var line = drag.line
				line.clear()
				line.lineStyle(10,0xffffff,1);
				line.moveTo(line.point.x,line.point.y)
				line.lineTo(drag.x, drag.y)
				
				if(drag.id == 1){
					
					drag.angleUsed = Math.abs(Math.round(Math.atan2(drag.y - line.point.y, drag.x - line.point.x) * 180 / Math.PI));
				}else{
					
					drag.angleUsed = Math.abs(Math.round(Math.atan2(drag.y - line.point.y, line.point.x - drag.x) * 180 / Math.PI));
				}
				
				var angleDigit = Math.abs(180 - (anglesUsed[indexToUse][0] + drag.angleUsed)) + '°'
				drag.text2.setText(angleDigit)
				drag.text.setText(drag.angleUsed + '°')
				//console.log(angleDeg + ' angle')
			}
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
				
				//console.log(particle)
                
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

				particle.makeParticles('atlas.triangrid',tag);
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
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
		dragPoints.drag.inputEnabled = false
		
		if(clock.tween){
			clock.tween.stop()
		}
		
		game.add.tween(clock).to({alpha:0},500,"Linear",true)
		
		obj.alpha = 0.7
		//gameActive = false
		obj.inputEnabled = false
		sound.play("pop")
		
		var drag1 = dragPoints.children[0]
		
		if(drag1.angleUsed == anglesUsed[indexToUse][1]){
			
			addPoint(1)
			
			game.add.tween(figureToUse.hint).to({alpha:0},250,"Linear",true)
			game.add.tween(figureToUse.image).to({alpha:1},250,"Linear",true)
			
			game.time.events.add(1500,hideFigures)
			createPart('star',figureToUse.hint)

		}else{
			createPart('wrong',figureToUse.hint)
			missPoint()
		}
		
		var tween = game.add.tween(obj.parent.scale).to({x:0.7,y:0.7},200,"Linear",true,0,0)
		tween.yoyo(true,0)
		
	}
	
	function hideFigures(){
		
		figureToUse.hint.alpha = 0
		
		game.add.tween(figureToUse).to({alpha:0},500,"Linear",true)
		
		game.time.events.add(1000,function(){
			
			setFigure()
		})
	}
	
	function createContainer(){
		
		container = sceneGroup.create(game.world.centerX, game.world.height * 0.33,'atlas.triangrid','window_empty')
		container.anchor.setTo(0.5,0.5)
		
		figuresGroup = game.add.group()
		sceneGroup.add(figuresGroup)
		
		for(var i = 0; i < figureNames.length;i++){
			
			var figGroup = game.add.group()
			figGroup.alpha = 0
			figGroup.x = container.x
			figGroup.y = container.y - 6
			figGroup.tag = figureNames[i]
			figuresGroup.add(figGroup)
			
			var figImage = figGroup.create(0,0,'atlas.triangrid',figureNames[i])
			figImage.anchor.setTo(0.5,0.5)
			figImage.alpha = 0
			figGroup.image = figImage
			
			var figHint = figGroup.create(0,0,'atlas.triangrid',figureNames[i] + '_hint')
			figHint.anchor.setTo(0.5,0.5)
			figGroup.hint = figHint
			
		}
		
	}
	
	function createLines(){
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xfff200)
        rect.drawRoundedRect(game.world.centerX,limitDrag - 4,400,10,5)
		rect.x-= rect.width * 0.5
        rect.endFill()
		sceneGroup.add(rect)
		
		linesGroup = game.add.group()
		sceneGroup.add(linesGroup)
		
		pointsGroup = game.add.group()
		sceneGroup.add(pointsGroup)
		
		dragPoints = game.add.group()
		sceneGroup.add(dragPoints)
		
		staticLine = sceneGroup.create(game.world.centerX - 125,limitDrag,'atlas.triangrid','line_pink')
		staticLine.anchor.setTo(0.07,0.5)
		
		var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, staticLine.x, staticLine.y + 50, "45°", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		sceneGroup.add(pointsText)
		staticLine.text = pointsText
		
		var textsUsed = []
		
		var pivotX = game.world.centerX + 165
		var pivotText =  pivotX
			
		var point = pointsGroup.create(pivotX, limitDrag + 5,'atlas.triangrid','screw')
		point.anchor.setTo(0.5,0.5)

		var dragPoint = dragPoints.create(staticLine.x, point.y - 150, 'atlas.triangrid','handle')
		dragPoint.inputEnabled = true
		dragPoint.input.enableDrag(true)
		dragPoint.dragging = true
		dragPoint.events.onDragStart.add(onDragStart, this);
		dragPoint.events.onDragStop.add(onDragStop, this);
		dragPoint.anchor.setTo(0.5,0.5)
		dragPoint.id = i
		dragPoint.angleUsed = 30
		dragPoints.drag = dragPoint

		var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, pivotText, point.y + 50, "30°", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		sceneGroup.add(pointsText)

		textsUsed[textsUsed.length] = pointsText
		dragPoints.children[0].text = textsUsed[0]
		
		var pointsText = new Phaser.Text(sceneGroup.game, pivotText + 25, point.y - 75, "90°", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		sceneGroup.add(pointsText)
		
		dragPoint.text2 = pointsText
		
		for(var i = 0; i < 1;i++){
			
			var point = pointsGroup.children[i]
			var dragP = dragPoints.children[dragPoints.length - i - 1]
			
			var g = game.add.graphics(0,0);
			g.lineStyle(10,0Xffffff,1);
			g.beginFill();
			g.moveTo(point.x,point.y);
			g.lineTo(dragP.x,dragP.y);
			
			g.point = point
			g.drag = dragP
			
			dragP.line = g
			
			g.endFill();
			linesGroup.add(g)
			
		}
	}
	
	function onDragStart(obj){
		
		sound.play("drag")
		obj.dragging = true
	}
	
	function onDragStop(obj){
		
		sound.play("pop")
		obj.dragging = true
	}
	
	function createReadyBtn(){
		
		readyBtn = game.add.group()
		readyBtn.x = game.world.centerX
		readyBtn.y = game.world.height - 70
		sceneGroup.add(readyBtn)
		
		var buttonImage = readyBtn.create(0,0,'atlas.triangrid','button')
		buttonImage.anchor.setTo(0.5,0.5)
		buttonImage.inputEnabled = false
		buttonImage.events.onInputDown.add(inputButton)
		
		var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, localization.getString(localizationData,"ready"), fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		readyBtn.add(pointsText)
		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
		
		readyBtn.btn = buttonImage
		
	}
	
	function createClock(){
        
        clock = game.add.group()
        clock.x = game.world.centerX
        clock.y = 75
		clock.alpha = 0
        sceneGroup.add(clock)
        
        var clockImage = clock.create(0,0,'atlas.triangrid','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.triangrid','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
        
        clock.bar = clockBar
        
    }
	
	return {
		
		assets: assets,
		name: "triangrid",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			initialize()
			
			createBackground()
			createContainer()
			createLines()
			createReadyBtn()
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
            			            
			createPointsBar()
			createHearts()
			
			buttons.getButton(spaceSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
	}
}()