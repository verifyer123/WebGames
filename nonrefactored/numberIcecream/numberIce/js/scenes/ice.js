
var soundsPath = "../../shared/minigames/sounds/"
var ice = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
			"one":"one",
			"two":"two",
			"three":"three",
			"four":"four",
			"five":"five",
			"six":"six",
			"seven":"seven",
			"eight":"eight",
			"nine":"nine",
			"stop":"Stop!"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
			"one":"uno",
			"two":"dos",
			"three":"tres",
			"four":"cuatro",
			"five":"cinco",
			"six":"seis",
			"seven":"siete",
			"eight":"ocho",
			"nine":"nueve",
			"stop":"¡Detener!"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.ice",
                json: "images/ice/atlas.json",
                image: "images/ice/atlas.png",
            },
        ],
        images: [

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "combo",
				file: soundsPath + "combo.mp3"},
            {	name: "flip",
				file: soundsPath + "flipCard.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "right",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "splash",
				file: soundsPath + "splashMud.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
		],
    }
    
    
    var CARD_TIME = 300
    
    var lives = null
	var sceneGroup = null
    var pointsGroup = null
    var gameActive = true
    var arrayComparison = null
    var gameIndex = 4
	var ballsGroup
    var overlayGroup
	var cone
	var machine
	var ballIndex
	var ballsNumber
	var yogotar
    var dojoSong
    var quantNumber
    var numberIndex = 0
    var numberToCheck
    var addNumber
    var timeValue
	
	var skinValues = ['combined','Oona', 'amarillo','cafe','morado','rosa','verde','cafe2','morado2','rosa2','amarillo2']
	
	var TEXT_VALUES = ['one','two','three','four','five','six','seven','eight','nine']
	
	var colorValues = [0xFFD900,0x8C5C34,0xB400FF,0xff66b3,0xd6ade68,0x8C5C34,0xB400FF,0xFF66B3,0xFFD900]
	
	var ballsOrder = [4,5,1,3,2,5,1,3,4]

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1
        quantNumber = 0
        arrayComparison = []
        numberIndex = 0
        timeValue = 2000
		ballIndex = 0
        
        loadSounds()
        
	}
    
    
    function createPart(key,obj){
        
        var particlesNumber = 2
        
        /*if(game.device.desktop == true){ 
            
            particlesNumber = 4
            
            var particlesGood = game.add.emitter(0, 0, 100);

            particlesGood.makeParticles('atlas.ice',key);
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
            var particle = sceneGroup.create(obj.x,obj.y,'atlas.ice',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
			particle.tint = colorValues[ballIndex]
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
	
	function showGlobe(){
		
		cone.pivotY = -50
		
		ballsNumber = game.rnd.integerInRange(1,9)
		
		globeGroup.text.setText(localization.getString(localizationData,TEXT_VALUES[ballsNumber - 1]))
		
		popObject(globeGroup,0)
		
		game.add.tween(clock.bar.scale).to({x:clock.bar.origScale},1000,"Linear",true)
		game.time.events.add(1000,shootBall,this)
	}
	
	function shootBall(){
		
		if(!gameActive){
			return
		}
		
		if(ballIndex >= 9){
		
			missPoint()
			return
		}
		
		machine.tween = game.add.tween(machine.scale).to({x:1.2,y:1.2},200,"Linear",true,200)
        machine.tween.yoyo(true,1)
		
		sound.play("shoot")
		
		var ball = getBall('ball' + ballsOrder[ballIndex])
		activateBall(ball,machine.x,machine.y - 25)
		
		game.add.tween(ball).to({y:cone.y + cone.pivotY},1000,"Linear",true).onComplete.add(function(){
			
			cone.pivotY-=40
			if(!gameActive){

				deactivateBall(ball)
				return
			}
			
			sound.play("splash")
			deactivateBall(ball)
			createPart('drop',ball)
			
			yogotar.setSkinByName('combined' + (ballIndex))
			yogotar.setToSetupPose();
			
			ballIndex++
			
		})
		
		game.add.tween(clock.bar.scale).to({x:0},200,"Linear",true,200).onComplete.add(function(){
			if(gameActive){
				clock.tween = game.add.tween(clock.bar.scale).to({x:clock.bar.origScale},timeValue - 200,"Linear",true)
			}
			
		},this)
		
		if(gameActive){
			game.time.events.add(timeValue,shootBall)
		}
		
	}
	
	function activateBall(ball,posX,posY){
		
		ball.alpha = 1
		ball.x = posX
		ball.y = posY
		ball.used = true
	}
	
	function createSkins(){
		
		var index = 3
		var indexArray = 0
		
		while(index < 12){
			
			var listO = []
			
			var valueAdd = ballIndex + 2
			
			for(var i = 0; i < index; i++){
				listO[i] = skinValues[i]
			}
			
			listO[0] = 'combined' + indexArray
			var newSkin = yogotar.createCombinedSkin(
               ...listO
            );
			
			index++
			indexArray++
			
		}
		
		
	}
	
	function deactivateBall(ball){
		
		ball.alpha = 0
		ball.used = false
	}
	
	function getBall(tag){
		
		for(var i = 0; i < ballsGroup.length; i++){
			
			var ball = ballsGroup.children[i]
			if(!ball.used && ball.tag == tag){
				
				return ball
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
    
    function addNumberPart(obj,number){
        
        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)
        
        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
    }
    
    function missPoint(){
        
        sound.play("wrong")
		
		createPart('wrong',cone)
        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            stopGame(false)
        }
        
        addNumberPart(heartsGroup.text,'-1')
        
    }
    
    function addPoint(number){
        
        sound.play("pop")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
		
		if(timeValue>500){
			timeValue-=100
		}
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number)
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.ice','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.ice','life_box')

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
        
		game.add.tween(ballsGroup).to({alpha:0},500,"Linear",true)
		sound.play("wrong")
        gameActive = false
        dojoSong.stop()
		
		sound.play("gameLose")
        
		yogotar.setAnimationByName(0,"LOSE",true)
		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2500)
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
        
        game.load.spine('oona', "images/spines/Oona.json")  
        game.load.audio('dojoSong', soundsPath + 'songs/childrenbit.mp3');
        
        game.load.image('introscreen',"images/ice/introscreen.png")
		game.load.image('howTo',"images/ice/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/ice/play" + localization.getLanguage() + ".png")
        
    }
    
    function createOverlay(){
        
		pivotX = 0
		
		while(pivotX < game.world.width * 1.2){
			
			var topRoof = sceneGroup.create(pivotX,0,'atlas.ice','roof')
			pivotX+= topRoof.width
		}
		
		createClock()
		createHearts()
        createPointsBar()
		buttons.getButton(dojoSong,sceneGroup)
		
        overlayGroup = game.add.group()
        sceneGroup.add(overlayGroup)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        rect.alpha = 0.6
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
			sound.play("pop")
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
				
                overlayGroup.y = -game.world.height
                gameActive = true
				game.time.events.add(500, showGlobe , this);
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.ice','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		//console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.ice',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.ice','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
        
    }
    
	function createBackground(){
		
		var pivotX = 0
		
		while(pivotX < game.world.width * 1.2){
			
			var back = sceneGroup.create(pivotX,0,'atlas.ice','fondo1')
			if(back.height < game.world.height){
				back.height = game.world.height
			}
			pivotX+= back.width
		}
		
	}
	
	function createMachine(){
		
		machine = sceneGroup.create(game.world.centerX, 75,'atlas.ice','machine')
		machine.anchor.setTo(0.5,0)
		
	}
	
	function checkNumber(){
		
		if(ballsNumber == ballIndex){
			
			if(clock.tween){
				clock.tween.stop()
				clock.tween = null
			}
			
			sound.play("right")
			addPoint(1)
			yogotar.setAnimationByName(0,"WIN",false)
			yogotar.addAnimationByName(0,"IDLE",true)
			
			gameActive = false
			
			ballIndex = 0
			
			game.add.tween(clock.bar.scale).to({x:0},300,"Linear",true)
			game.add.tween(globeGroup).to({alpha:0},750,"Linear",true,500)
			
			game.time.events.add(250,function(){yogotar.setSkinByName('Oona')})
			game.time.events.add(1500,function(){
				
				gameActive = true
				showGlobe()
								
			})
		
		}else{
			missPoint()
		}
	}
	
	function inputButton(obj){
        
        if(gameActive == false){
            return
        }
        
        obj.parent.children[1].alpha = 0
		
		checkNumber()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }
    
    function createControls(){
        
        var spaceButtons = 220
        
        var bottomRect = sceneGroup.create(0,game.world.height,'atlas.ice','dashboard')
        bottomRect.width = game.world.width
        bottomRect.height *= 1.02
        bottomRect.anchor.setTo(0,1)
        sceneGroup.dashboard = bottomRect
        
        groupButton = game.add.group()
        groupButton.x = game.world.centerX
        groupButton.y = game.world.height -110
        groupButton.isPressed = false
		groupButton.scale.setTo(1.4,1.4)
        sceneGroup.add(groupButton)
        
        var button1 = groupButton.create(0,0, 'atlas.ice','button2')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.ice','button1')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)
		
		var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, groupButton.x, groupButton.y - 15, localization.getString(localizationData,"stop"), fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)
		
		if(localization.getLanguage() == 'ES'){
			pointsText.scale.setTo(0.7,0.7)
		}
        
        pointsText.setShadow(4, 3, 'rgba(0,0,0,0.5)', 0);
        
    }
	
	function createGlobe(){
		
		globeGroup = game.add.group()
		globeGroup.x = game.world.centerX + 200
		globeGroup.alpha = 0
		globeGroup.y = yogotar.y - 400
		sceneGroup.add(globeGroup)
		
		var globeImg = globeGroup.create(0,0,'atlas.ice','globe')
		globeImg.anchor.setTo(0.5,0.5)
		
		var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, -15, 'Five', fontStyle)
        pointsText.anchor.setTo(0.5,0.5)
        globeGroup.add(pointsText)
		
		globeGroup.number = 0
		globeGroup.text = pointsText
		
	}
	
	function createCone(){
		
		cone = sceneGroup.create(game.world.centerX, game.world.height - 300,'atlas.ice','cone')
		cone.alpha = 0
		cone.anchor.setTo(0.5,0.5)
		cone.pivotY = -50
		
	}
	
	function createBalls(){
		
		ballsGroup = game.add.group()
		sceneGroup.add(ballsGroup)
		
		for(var i = 1; i < 6; i++){
			
			for(var u = 0; u < 2;u++){
				
				var ball = ballsGroup.create(0,0,'atlas.ice','ball' + i)
				ball.anchor.setTo(0.5,0.5)
				ball.used = false
				ball.alpha = 0
				ball.tag = 'ball' + i
				
			}
		}
	}
	
	function createClock(){
        
        clock = game.add.group()
        clock.x = game.world.centerX
        clock.y = 75
        sceneGroup.add(clock)
        
        var clockImage = clock.create(0,0,'atlas.ice','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.ice','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
		clockBar.scale.x = 0
        
        clock.bar = clockBar
        
    }
	
	return {
		
		assets: assets,
		name: "ice",
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
            
            createBackground()
            
			yogotar = game.add.spine(game.world.centerX + 100,game.world.height - 225, "oona");
            yogotar.scale.setTo(-0.8,0.8)
            sceneGroup.add(yogotar)   
			
            yogotar.setAnimationByName(0, "IDLE", true);
            yogotar.setSkinByName('Oona');
                        
           	createSkins()
			
            dojoSong = game.add.audio('dojoSong')
            game.sound.setDecodedCallback(dojoSong, function(){
                dojoSong.loopFull(0.45)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			
			createBalls()
			createMachine()
			createCone()
			createGlobe()
			createControls()
            
            createOverlay()
            
            animateScene()
            
		},
	}
}()