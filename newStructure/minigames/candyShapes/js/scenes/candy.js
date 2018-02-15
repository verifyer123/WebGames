
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var candy = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
			"cube":"Square",
			"rectangle":"Rectangle",
			"circle":"Circle",
			"triangle":"Triangle"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
			"cube":"Cuadrado",
			"rectangle":"Rectángulo",
			"circle":"Círculo",
			"triangle":"Triángulo"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.candy",
                json: "images/candy/atlas.json",
                image: "images/candy/atlas.png",
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
			{	name: "flipCard",
				file: soundsPath + "flipCard.mp3"},
			{	name: "powerup",
				file: soundsPath + "powerup.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
	var figuresGroup, usedFigures
	var figuresMap, figToUse, clock
    var gameIndex = 36
	var indexGame, timeToUse
    var overlayGroup
	var tapTimes
    var spaceSong
	
	var figureNames = ['cube','rectangle','circle','triangle']
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
		timeToUse = 20000

        
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
        
        sound.play("pop")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)		
		
		tapTimes++
		
		if(tapTimes >= 5){
			
			if(timeToUse >= 3000){
				timeToUse-=1000
			}
			
			gameActive = false
			game.time.events.add(750,hideObjects)
			
			if(clock.tween){
				clock.tween.stop()
				game.add.tween(clock.bar.scale).to({x:clock.bar.origScale},250,"Linear",true)
				sound.play("powerup")
			}
		}
        
    }
	
	function hideAlpha(obj,delay){
		
		game.time.events.add(delay,function(){
			
			sound.play('flipCard')
			
			game.add.tween(obj.scale).to({x:0,y:0},250,"Linear",true).onComplete.add(function(){
				obj.scale.setTo(1,1)
				obj.alpha = 0
			})
		})
		
		
	}
	
	function hideObjects(){
		
		var delay = 0
		while(usedFigures.length > 0){
			
			var figure = usedFigures.children[0]
			
			usedFigures.remove(figure)
			figuresGroup.add(figure)
			
			figure.figure.pressed = false
			
			if(figure.alpha == 1){
				hideAlpha(figure,delay)
				delay+=50
			}
			
		}
		
		for(var i = 0; i < figuresMap.length;i++){
			
			figuresMap.children[i].alpha = 0
		}
		
		game.time.events.add(1000,function(){
			positionFigures()
			showFigures()
		})
	}
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.candy','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.candy','life_box')

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

        
        game.load.spine('figures', "images/spines/skeleton.json")  
        game.load.audio('spaceSong', soundsPath + 'songs/upbeat_casual_8.mp3');
        
		/*game.load.image('howTo',"images/candy/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/candy/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/candy/introscreen.png")*/
		
		game.load.image('tutorial_image',"images/candy/tutorial_image.png")
        //loadType(gameIndex)
        
    }
	
	function showFigures(){
		
		var delay = 0
		for(var i = 0; i < usedFigures.length;i++){
			
			var figure = usedFigures.children[i]
			popObject(figure,delay)
			
			delay+=75
		}
		
		game.time.events.add(delay,function(){
			
			figToUse = figureNames[game.rnd.integerInRange(0,figureNames.length - 1)]
			
			var figMap = getFigure(figToUse,figuresMap)
			popObject(figMap,0)
			
			console.log(figMap.tag + ' tag')
			figMap.text.setText(localization.getString(localizationData,figMap.tag))
			
			tapTimes = 0
			
			gameActive = true
			
			var bar = clock.bar
			bar.scale.x = bar.origScale
			
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
                
				overlayGroup.y = -game.world.height
				showFigures()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.candy','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.candy',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.candy','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
		
    }

    function onClickPlay(){
        overlayGroup.y = -game.world.height
        showFigures()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.candy','fondo')
		sceneGroup.add(background)
		
		var panel = sceneGroup.create(game.world.centerX, -65,'atlas.candy','panel')
		panel.anchor.setTo(0.5,0)
		
		var board = sceneGroup.create(game.world.centerX, panel.y + panel.height * 0.65,'atlas.candy','tablero')
		board.anchor.setTo(0.5,0.5)
		
	}
	
	
	function update(){
		
		background.tilePosition.x++
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
                particle = particlesGroup.create(-200,0,'atlas.candy',tag)
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
		
        var exp = sceneGroup.create(0,0,'atlas.candy','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.candy','smoke');
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
		
		if(!gameActive || obj.pressed){
			return
		}
		
		obj.pressed = true
		
		sound.play("pop")
		
		var tween = game.add.tween(obj.parent.scale).to({x:0.6,y:0.6},200,"Linear",true,0,0)
		tween.yoyo(true,0)
		
		if(obj.parent.tag == figToUse){
			addPoint(1)
			sound.play("magic")
			createPart('star',obj)
			game.add.tween(obj.parent).to({alpha:0,angle:obj.parent.angle + 360},500,"Linear",true)
		}else{
			
			clock.tween.stop()
			
			missPoint()
			createPart('wrong',obj)
		}
	}
	
	function createFigure(tag,scale,number){
		
		for(var i = 0; i < number; i++){
			
			var group = game.add.group()
			group.alpha = 0
			group.tag = tag
			group.used = false
			figuresGroup.add(group)
			
			var figure = group.create(0,0,'atlas.candy',tag)
			figure.alpha = 0
			figure.anchor.setTo(0.5,0.5)
			figure.inputEnabled = true
			figure.pressed = false
			figure.events.onInputDown.add(inputButton)
			group.figure = figure
			
			var anim = game.add.spine(0,45,"figures")
			anim.setSkinByName(tag)
			delayAnim(anim,game.rnd.integerInRange(0,1000))
			group.add(anim)
			
		}	
	}
	
	function delayAnim(anim,delay){
		
		game.time.events.add(delay,function(){
			anim.setAnimationByName(0,"IDLE",true)
		})
		
	}
	
	function createObjects(){
		
		figuresGroup = game.add.group()
		sceneGroup.add(figuresGroup)
		
		usedFigures = game.add.group()
		sceneGroup.add(usedFigures)
		
		createFigure("cube",1,5)
		createFigure("circle",1,5)
		createFigure("triangle",1,5)
		createFigure("rectangle",1,5)
		
		positionFigures()
		
		figuresMap = game.add.group()
		figuresMap.x = game.world.centerX + 127
		figuresMap.y = 150
		sceneGroup.add(figuresMap)
		
		var tween = game.add.tween(figuresMap.scale).to({x:0.8,y:0.8},500,"Linear",true,0,-1)
		tween.yoyo(true,0)
		
		for(var i = 0; i < figureNames.length;i++){
			
			var group = game.add.group()
			group.tag = figureNames[i]
			group.alpha = 0
			figuresMap.add(group)
			
			var figure = group.create(0,-25,'atlas.candy','shape_' + figureNames[i])
			figure.anchor.setTo(0.5,0.5)
			
			var rect = new Phaser.Graphics(game)
			rect.beginFill(0x000000)
			rect.drawRoundedRect(0,65,200, 50,16)
			rect.alpha = 0.7
			rect.x-= rect.width * 0.5
			rect.y-= rect.height * 0.5
			rect.endFill()
			group.add(rect)
			
			var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, 0, 65, "0", fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			group.add(pointsText)
			
			group.text = pointsText
			
		}
		
	}
	
	
	function getFigure(tag,group){
		
		for(var i = 0; i < group.length;i++){
			
			var figure = group.children[i]
			if(figure.tag == tag && !figure.used){
				return figure
			}
		}
	}
	
	
	function activateObject(obj,posX, posY){
		
		figuresGroup.remove(obj)
		usedFigures.add(obj)
		
		obj.alpha = 1
		obj.x = posX
		obj.y = posY
	}
	
	function positionFigures(){
		
		var finalList = []
		
		for(var i = 0; i < 5;i++){
			finalList.push.apply(finalList,figureNames)
		}
		
		Phaser.ArrayUtils.shuffle(finalList)
		
		var pivotX = game.world.centerX - 160
		var pivotY = 345
		for(var i = 0; i < finalList.length;i++){
			
			//console.log('figure')
			var figure = getFigure(finalList[i], figuresGroup)
			activateObject(figure, pivotX, pivotY)
			figure.alpha = 0
			
			pivotY+= 107
			
			if((i+1) % 5 == 0){
				pivotX+= 107
				pivotY = 345
			}
		}
		
	}
	
	function createClock(){
        
        clock = game.add.group()
        clock.x = game.world.centerX
        clock.y = game.world.height - 60
        sceneGroup.add(clock)
        
        var clockImage = clock.create(0,0,'atlas.candy','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.candy','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
        
        clock.bar = clockBar
        
    }
	
	return {
		
		assets: assets,
		name: "candy",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createObjects()
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