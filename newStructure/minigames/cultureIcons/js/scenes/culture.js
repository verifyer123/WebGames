
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var culture = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
			"australia":"Sydney Opera House",
			"brasil":"Christ the Redeemer",
			"chile":"Moai",
			"china":"Great Wall of China",
			"eeuu":"Statue of Liberty",
			"france":"Eiffel Tower",
			"italy":"The Roman Colosseum",
			"mexico":"Chichen Itza",
			"peru":"Machu Picchu",
			"india":"Taj Mahal",
			"uk":"Stonehenge",
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
			"australia":"Ópera de Sídney",
			"brasil":"Cristo Redentor",
			"chile":"Moai",
			"china":"Gran Muralla China",
			"eeuu":"Estatua de la Libertad",
			"france":"Torre Eiffel",
			"italy":"Coliseo Romano",
			"mexico":"Chichén Itzá",
			"peru":"Machu Picchu",
			"india":"Taj Mahal",
			"uk":"Stonehenge",
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.culture",
                json: "images/culture/atlas.json",
                image: "images/culture/atlas.png",
            },

        ],
        images: [
			{   name:"background",
				file: "images/culture/fondo.png"},
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
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
	var textContainer
    var gameActive = true
	var indexToUse
	var backBubbles, botBar
	var particlesGroup, particlesUsed
    var gameIndex = 21
	var iconBase, container
	var containersGroup, flagsGroup, iconsGroup
	var iconToUse, flagList
	var indexGame
    var overlayGroup
    var spaceSong
	
	var countryList = ['australia','brasil','chile','china','eeuu','france','italy','mexico','peru','india','uk']
	
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3

        
        loadSounds()
		
		setOrderList()
        
	}
	
	function setOrderList(){
		
		Phaser.ArrayUtils.shuffle(countryList)
		indexToUse = 0
		
		//console.log(countryList)
	}

    function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
			var scaleX = 0.01
			var scaleY = 0.01
			
			if(Math.random()*2 > 1){
				scaleX = 1
			}else{
				scaleY = 1
			}
			
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x:scaleX, y:scaleY},250,Phaser.Easing.linear,true)
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
		
		createTextPart('+' + number,container)
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.culture','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.culture','life_box')

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

            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;  

        
        game.load.audio('spaceSong', soundsPath + 'songs/childrenbit.mp3');
        
		/*game.load.image('howTo',"images/culture/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/culture/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/culture/introscreen.png")*/

		game.load.image('tutorial_image',"images/culture/tutorial_image.png")
		//loadType(gameIndex)

		
		//console.log(localization.getLanguage() + ' language')
        
    }
    
	function showObjects(show){
		
		var animList = [iconBase,iconToUse,container,botBar,textContainer,containersGroup.children[0],containersGroup.children[1],flagList[0],flagList[1]]
		
		if(!tutorialHand.active){
			animList = [iconToUse,container,textContainer,containersGroup.children[0],containersGroup.children[1],flagList[0],flagList[1]]
		}
		
		if(!show){
			Phaser.ArrayUtils.shuffle(animList)
		}
		
		var delay = 500
		
		for(var i = 0; i < animList.length;i++){
			
			if(show){
				popObject(animList[i],delay)
			}else{
				game.add.tween(animList[i]).to({alpha:0},200,"Linear",true,delay)
				delay-=50
			}
			
			delay+= 100
		}
		
		if(show){
			game.time.events.add(delay,function(){
				gameActive = true
			})
		}
	}
	
	function setFlag(){
		
		iconToUse = getObject(countryList[indexToUse],iconsGroup)
		iconToUse.x = iconBase.x
		iconToUse.y = iconBase.y
	
		textContainer.text.setText(localization.getString(localizationData,countryList[indexToUse]))
		textContainer.rect.width = textContainer.text.width * 1.2
		textContainer.rect.x = textContainer.text.x - textContainer.rect.width * 0.5
		
		flagList = []
		
		var wrongIndex = indexToUse
		
		while(wrongIndex == indexToUse){
			wrongIndex = game.rnd.integerInRange(0,countryList.length - 1)
		}
		
		var numbersList = [indexToUse,wrongIndex]
		Phaser.ArrayUtils.shuffle(numbersList)
		
		for(var i = 0; i < numbersList.length;i++){
			
			var obj = getObject(countryList[numbersList[i]],flagsGroup)
			flagList[i] = obj
			
			obj.x = containersGroup.children[i].x
			obj.y = containersGroup.children[i].y
			
			obj.inputEnabled = true
			
			obj.initX = obj.x
			obj.initY = obj.y
			
		}
		
	}
	
	function getObject(tag,group){
		
		for(var i = 0; i < iconsGroup.length;i++){
			
			var obj = group.children[i]
			if(obj.tag == tag){
				return obj
			}
		}
	}
	
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
        
        
    }

    function onClickPlay(){
    	overlayGroup.y = -game.world.height
		setFlag()
		showObjects(true)
		game.time.events.add(1500,startTutorial)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = sceneGroup.create(0,0,'background')
		background.width = game.world.width
		background.height = game.world.height
		
		backBubbles = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.culture','bubbles')
		sceneGroup.add(backBubbles)
		
		botBar = game.add.tileSprite(game.world.centerX,game.world.height,game.world.width,238,'atlas.culture','base')
		botBar.anchor.setTo(0.5,1)
		botBar.alpha = 0
		sceneGroup.add(botBar)
		
		iconBase = sceneGroup.create(game.world.centerX, game.world.centerY - 200,'atlas.culture','baseIcono')
		iconBase.alpha = 0
		iconBase.anchor.setTo(0.5,0.5)
		
		container = sceneGroup.create(game.world.centerX,game.world.centerY + 150,'atlas.culture','respuesta')
		container.alpha = 0
		container.anchor.setTo(0.5,0.5)
		
		containersGroup = game.add.group()
		sceneGroup.add(containersGroup)
		
		var pivotX = game.world.centerX - 150
		for(var i = 0; i < 2;i++){
			
			var cont = containersGroup.create(pivotX,game.world.height - 115,'atlas.culture','baseBanderas')
			cont.anchor.setTo(0.5,0.5)
			cont.alpha = 0
			
			pivotX+= 300
			
		}
		
		textContainer = game.add.group()
		textContainer.x = game.world.centerX
		textContainer.y = game.world.centerY + 25
		textContainer.alpha = 0
		sceneGroup.add(textContainer)
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xffffff)
        rect.drawRoundedRect(0,0,300, 75)
		rect.x-= rect.width * 0.5
		rect.y-= rect.height * 0.5
        rect.endFill()
		textContainer.add(rect)
		textContainer.rect = rect
		
		var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#0077ed ", align: "center"}
		
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 3, "0", fontStyle)
        pointsText.anchor.setTo(0.5,0.5)
        textContainer.add(pointsText)
		
		textContainer.text = pointsText
		
	}
	
	
	function update(){
		
		backBubbles.tilePosition.y--
		botBar.tilePosition.x++
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
            game.add.tween(particle.scale).to({x:4,y:4},300,Phaser.Easing.Cubic.In,true)
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
                particle = particlesGroup.create(-200,0,'atlas.culture',tag)
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
		createParticles('ring',5)
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
		
        var exp = sceneGroup.create(0,0,'atlas.culture','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.culture','smoke');
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
	
	function onDragStart(obj){
		
		if(!gameActive || !obj.active){
			return
		}
		
		if(tutorialHand.active){
			stopTutorial()
		}
		
		obj.active = false
		
		sound.play('flipCard')
		//console.log(obj.active + ' active')
	}
	
	function activateButtons(activate){
		
		for(var i = 0; i < flagsGroup.length;i++){
			
			var flag = flagsGroup.children[i]
			flag.inputEnabled = activate
		}
	}
	
	function onDragStop(obj){
		
		obj.inputEnabled = false
		
		if(checkOverlap(obj,container)){
			
			activateButtons(false)
			game.add.tween(obj).to({x:container.x,y:container.y,angle:obj.angle+360},250,"Linear",true).onComplete.add(function(){
				if(obj.tag == iconToUse.tag){
					addPoint(1)
					createPart('star',obj)
					
					var tween = game.add.tween(obj.scale).to({x:1.2,y:1.2},200,"Linear",true,0,0)
					tween.yoyo(true,0)
					
					game.time.events.add(1000,showObjects)
					game.time.events.add(2200,function(){
						
						indexToUse++
						if(indexToUse == countryList.length){
							setOrderList()
						}
						setFlag()
						showObjects(true)
					})
				}else{
					missPoint()
					createPart('wrong',obj)
					setExplosion(obj)
                    game.time.events.add(1000,showObjects)
					game.time.events.add(2200,function(){
						
						indexToUse++
						if(indexToUse == countryList.length){
							setOrderList()
						}
						setFlag()
						showObjects(true)
					})
				}
			})
		}else{
			
			game.add.tween(obj).to({x:obj.initX,y:obj.initY},500,"Linear",true).onComplete.add(function(){
				obj.active = true
				obj.inputEnabled = true
			})
		}
		
	}
	
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	function createFlags(){
		
		iconsGroup = game.add.group()
		sceneGroup.add(iconsGroup)
		
		flagsGroup = game.add.group()
		sceneGroup.add(flagsGroup)
		
		for(var i = 0; i < countryList.length; i++){
			
			var flag = flagsGroup.create(0,0,'atlas.culture',countryList[i])
			flag.anchor.setTo(0.5,0.5)
			flag.alpha = 0
			flag.tag = countryList[i]
			flag.active = true
			flag.inputEnabled = true
			flag.input.enableDrag(true)
			flag.events.onDragStart.add(onDragStart, this);
			flag.events.onDragStop.add(onDragStop, this);
			flag.inputEnabled = false
			
			var icon = iconsGroup.create(0,0,'atlas.culture',countryList[i] + '_icon')
			icon.anchor.setTo(0.5,0.5)
			icon.alpha = 0
			icon.tag = countryList[i]
			
		}
		
	}
	
	function startTutorial(){
		
		if(!tutorialHand.active){
			return
		}
		
		var correctFlag = flagList[0]
		
		if(correctFlag.tag != iconToUse.tag){
			correctFlag = flagList[1]
		}
		
		tutorialHand.alpha = 1
		tutorialHand.x = correctFlag.x
		tutorialHand.y = correctFlag.y
		
		game.add.tween(tutorialHand).to({x:container.x,y:container.y},1000,"Linear",true).onComplete.add(function(){
			game.add.tween(tutorialHand).to({alpha:0},250,"Linear",true,250).onComplete.add(startTutorial)
		})
	}
	
	function stopTutorial(){
		
		tutorialHand.active = false
		gameSpeed = 0.25
	}
	
	function createTutorial(){
		
		tutorialHand = sceneGroup.create(game.world.centerX,game.world.centerY,'atlas.culture','tutorialHand')
		tutorialHand.scale.setTo(0.7,0.7)
		tutorialHand.anchor.setTo(0.5,0.5)
		tutorialHand.alpha = 0
		tutorialHand.active = true
	}
	
	return {
		
		assets: assets,
		name: "culture",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			createBackground()
			createFlags()
			createTutorial()
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
	}
}()