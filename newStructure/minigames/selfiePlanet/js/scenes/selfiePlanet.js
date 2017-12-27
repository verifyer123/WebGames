
var soundsPath = "../../shared/minigames/sounds/"
var selfiePlanet = function(){
    
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
                name: "atlas.selfiePlanet",
                json: "images/selfiePlanet/atlas.json",
                image: "images/selfiePlanet/atlas.png",
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
            {	name: "right",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "snapshot",
				file: soundsPath + "snapshot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
		]
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
    var gameStarted=false
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 111
	var indexGame
    var overlayGroup
    var dancing_baby
    //var stars
    var planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']
    var speed
    var planetsGroup
    var target
    var pivot
    var eagle, eagleSad, eagleHappy
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        pivot = 0
        speed = 3000
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
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.selfiePlanet','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.selfiePlanet','life_box')

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
        dancing_baby.stop()
        		
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
        
        game.load.audio('dancing_baby', soundsPath + 'songs/dancing_baby.mp3');
        
		game.load.image('howTo',"images/selfiePlanet/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/selfiePlanet/play" + localization.getLanguage() + ".png")
        game.load.image('introscreen',"images/selfiePlanet/introscreen.png")
        
        game.load.image('mercury',"images/selfiePlanet/mercury.png")
        game.load.image('venus',"images/selfiePlanet/venus.png")
        game.load.image('earth',"images/selfiePlanet/earth.png")
        game.load.image('mars',"images/selfiePlanet/mars.png")
        game.load.image('jupiter',"images/selfiePlanet/jupiter.png")
        game.load.image('saturn',"images/selfiePlanet/saturn.png")
        game.load.image('uranus',"images/selfiePlanet/uranus.png")
        game.load.image('neptune',"images/selfiePlanet/neptune.png")
        
        game.load.spine("eagle", "images/spines/Normal.json");
        game.load.image('eagleSad',"images/selfiePlanet/eagleSad.png")
        game.load.image('eagleHappy',"images/selfiePlanet/eagleHappy.png")
		
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
            
            //Aqui va la primera funciòn que realizara el juego
            gameStarted=true
            
            startGame=true
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
                initGame()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.selfiePlanet','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.selfiePlanet',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.selfiePlanet','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        background = sceneGroup.create(game.world.centerX, game.world.centerY, "atlas.selfiePlanet", "background");
        background.anchor.setTo(0.5, 0.5)
        background.width = game.world.width
        background.height = game.world.height
        
        stars = game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.selfiePlanet", 'stars')
        sceneGroup.add(stars)
    }

	function update(){
        
        //stars.tilePosition.x += 0.5
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
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.selfiePlanet',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
        return particle
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

				particle.makeParticles('atlas.selfiePlanet',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.selfiePlanet','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.selfiePlanet','smoke');
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
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('wrong')
        sceneGroup.add(particleWrong)
    }
    
    function initPlanetsGroup(){
        
        planetsGroup = game.add.group()
        planetsGroup.x = -200
        planetsGroup.y = game.world.centerY - 100
        planetsGroup.scale.setTo(0.9)
        sceneGroup.add(planetsGroup)
        
        for(var p = 0; p < planets.length; p++){
            var planet = planetsGroup.create(0, 0, planets[p])
            planet.anchor.setTo(0.5)
            planet.alpha = 0
        }
    }
    
    function initEagle(){
        
        eagle = game.add.spine(game.world.centerX + 145, game.world.height , "eagle")
        //eagle.scale.setTo(0.7)
        eagle.setAnimationByName(0, "IDLE", true)
        eagle.setSkinByName("normal")
        sceneGroup.add(eagle)
        
        eagleSad = sceneGroup.create(game.world.centerX - 5, game.world.centerY, "eagleSad")    
        eagleSad.alpha = 0
        eagleHappy = sceneGroup.create(game.world.centerX - 5, game.world.centerY, "eagleHappy")  
        eagleHappy.alpha = 0
    }
    
    function initCam(){
        
        selfie = sceneGroup.create(game.world.centerX, game.world.centerY, "atlas.selfiePlanet", "selfie");
        selfie.anchor.setTo(0.5, 0.5)
        selfie.width = game.world.width
        
        target = sceneGroup.create(game.world.centerX, game.world.centerY, "atlas.selfiePlanet", "target");
        target.anchor.setTo(0.5, 0.5)
        
        var snapBtn = sceneGroup.create(game.world.centerX, game.world.height - 70, 'atlas.selfiePlanet', 'camBtn')
        snapBtn.anchor.setTo(0.5)
        //snapBtn.scale.setTo(1, 1.5)
        snapBtn.inputEnabled = true
        snapBtn.events.onInputDown.add(inputButton)
    }
	
	function inputButton(btn){
		
		if(gameActive){
            game.add.tween(btn.scale).to({x:0.5, y:0.5}, 100, Phaser.Easing.linear, true).onComplete.add(function() 
            {
                sound.play('snapshot')
                animateScene()
                planetsGroup.translate.stop()
                checkCorrect()
                game.add.tween(btn.scale).to({x: 1, y: 1}, 100, Phaser.Easing.linear, true)
            })
		}
	}
    
    function checkCorrect() {

        gameActive = false
        eagle.alpha = 0
        var pic = target.getBounds()
        var obj = planetsGroup.children[pivot].getBounds()
         
        var x = (obj.width - pic.width) //* 0.5
        var y = (obj.height - pic.height) //* 0.5
        
        var xx = -(obj.width)/2
        var yy = -(obj.height)
        
        pic.inflate(x * 0.5, y * 0.5)
        obj.inflate(-x * 0.2, -y * 0.2)
        
        pic.y -= 100
        
        /*var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF3300);
        graphics.lineStyle(2, 0x0000FF, 1);
        graphics.alpha = 0.5
        graphics.drawRect(pic.x, pic.y, pic.width, pic.height);
        
        var graphics2 = game.add.graphics(0, 0);
        graphics2.beginFill(0x3333ff);
        graphics2.lineStyle(2, 0x0000FF, 1);
        graphics2.alpha = 0.5
        graphics2.drawRect(obj.x, obj.y, obj.width, obj.height);*/
        
        var focus = pic.containsRect(obj)

        if(focus){
            sound.play("right")
            particleCorrect.x = target.x 
            particleCorrect.y = target.y
            particleCorrect.start(true, 1200, null, 6)
            eagleHappy.alpha = 1
            addPoint(1)
        } 
        else{
            particleWrong.x = target.x - 20
            particleWrong.y = target.y
            particleWrong.start(true, 1200, null, 6)
            eagleSad.alpha = 1
            missPoint()
        }
        restartGame()
    }
    
    function initGame(){
        
        gameActive = true
        planetsGroup.x = -200
        changeImage(pivot, planetsGroup)
        
        planetsGroup.translate = game.add.tween(planetsGroup).to({x: game.world.width + 200}, speed, Phaser.Easing.linear, true)
        
        planetsGroup.translate.onComplete.add(function(){
            missPoint()
            planetsGroup.children[pivot].alpha = 0
            restartGame()
        })
    }
    
    function restartGame(){
        
        if(pivot < planets.length-1)
            pivot++
        else{
            pivot = 0
            if(speed > 500)
                speed -= 500
            else speed = 500
        }
        
        if(lives !== 0){
            game.add.tween(planetsGroup.children[pivot]).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 400).onComplete.add(function () {
                animateScene()
                eagleHappy.alpha = 0
                eagleSad.alpha = 0
                eagle.alpha = 1
                initGame()
            })
        }
    }
	
	return {
		
		assets: assets,
		name: "selfiePlanet",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            dancing_baby = game.add.audio('dancing_baby')
            game.sound.setDecodedCallback(dancing_baby, function(){
                dancing_baby.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			         
            initPlanetsGroup()
            initEagle()
            initCam()
            createPointsBar()
			createHearts()
            createParticles()
			
			buttons.getButton(dancing_baby,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()