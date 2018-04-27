
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"

var shotPut = function(){
    
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
                name: "atlas.shotPut",
                json: "images/shotPut/atlas.json",
                image: "images/shotPut/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/shotPut/timeAtlas.json",
                image: "images/shotPut/timeAtlas.png",
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
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "throw",
				file: soundsPath + "throw.mp3"}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = false
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 108
	var indexGame
    var overlayGroup
    var timerGroup
    var timberman
    var oof
    var stamina
    var topStamina
    var target
    var objGroup
    var objIndex
    var tweenTiempo
    var delay
    var force

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#9BC6EF"
        lives = 3
        topStamina = 410
        objIndex = -1
        delay = 5000
        force = 0
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.shotPut','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.shotPut','life_box')

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
        
        timberman.stop()
        		
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
        
        game.load.audio('timberman', soundsPath + 'songs/timberman.mp3')
        
		/*game.load.image('howTo',"images/shotPut/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/shotPut/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/shotPut/introscreen.png")  */
        
        game.load.spine("oof", "images/spines/Oof/Oof.json")
		
		game.load.image('tutorial_image',"images/shotPut/tutorial_image.png")
        //loadType(gameIndex)
  
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
            
            //Aqui va la primera funciòn que realizara el juego
            
            
            startGame=true
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
                gameActive = true
                initGame()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.shotPut','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'Movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.shotPut',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.shotPut','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/


    }

    function onClickPlay(){
        startGame=true
        overlayGroup.y = -game.world.height
        gameActive = true
        initGame()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        var box = game.add.graphics(0, 0)
        box.beginFill(0x9BC6EF)
        box.drawRect(0, 0, game.world.width, 200)
        sceneGroup.add(box)
        
        var lawn =  sceneGroup.create(game.world.centerX, game.world.centerY - 202, "atlas.shotPut", "lawn")
        lawn.anchor.setTo(0.5, 0)
        lawn.scale.setTo(game.world.width, 1)
            
        var colosseum = sceneGroup.create(game.world.centerX, game.world.centerY - 265, "atlas.shotPut", "colosseum")
        colosseum.anchor.setTo(0.5)
        colosseum.scale.setTo(1, 0.8)
        colosseum.width = game.world.width * 1.2
        
        var cloud = sceneGroup.create(game.world.centerX - 250, 35, "atlas.shotPut", "cloud")
        cloud.anchor.setTo(0.5)
        cloud.scale.setTo(0.7, 0.7)
        
        cloud = sceneGroup.create(game.world.centerX + 150, 35, "atlas.shotPut", "cloud")
        cloud.anchor.setTo(0.5)
        cloud.scale.setTo(0.8, 0.8)
        
        var grass = sceneGroup.create(game.world.centerX + 180, game.world.centerY - 175, "atlas.shotPut", "grass1")
        grass.anchor.setTo(0.5)
        grass.scale.setTo(0.6, 0.6)
        
        grass = sceneGroup.create(game.world.centerX - 100, game.world.centerY - 175, "atlas.shotPut", "grass1")
        grass.anchor.setTo(0.5, 0.5)
        grass.scale.setTo(-0.6, 0.6)
        
        grass = sceneGroup.create(game.world.centerX + 100, game.world.centerY - 15, "atlas.shotPut", "grass")
        grass.anchor.setTo(0.5, 0.5)
        grass.scale.setTo(0.8, 0.8)
        
        grass = sceneGroup.create(game.world.centerX - 260, game.world.centerY - 15, "atlas.shotPut", "grass")
        grass.anchor.setTo(0.5, 0.5)
        grass.scale.setTo(0.8, 0.8)
        
        grass = sceneGroup.create(game.world.centerX, game.world.height - 210, "atlas.shotPut", "grass3")
        grass.anchor.setTo(0.5, 0.5)
        //grass.scale.setTo(0.8, 0.8)
        
        var platform = sceneGroup.create(game.world.centerX, game.world.height, "atlas.shotPut", "platform")
        platform.anchor.setTo(0.5, 1)
        platform.scale.setTo(0.9, 0.9)
        
        var target = sceneGroup.create(game.world.centerX + 200, game.world.centerY - 130, "atlas.shotPut", "target")
        target.anchor.setTo(0.5)
        //target.scale.setTo(0.9, 0.9)
        
    }
	
	function update(){

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

        particle.makeParticles('atlas.shotPut',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

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

				particle.makeParticles('atlas.shotPut',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.shotPut','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.shotPut','smoke');
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
    
    function initOof(){
        
        oof = game.add.spine(game.world.centerX - 170, game.world.height, "oof")
        oof.scale.setTo(0.8)
        oof.setAnimationByName(0, "IDLE", true)
        oof.setSkinByName("normal")
        oof.autoUpdateTransform()
        sceneGroup.add(oof)
        
    }
    
    function initStaminaBar(){
        
        barGroup = game.add.group()
        barGroup.x = game.world.centerX - 215
        barGroup.y = game.world.height -5
        sceneGroup.add(barGroup)
        
        barBack = barGroup.create(10, 0, "atlas.shotPut", "barBack")
        barBack.anchor.setTo(0, 1)
        
        stamina = game.add.tileSprite(10, -13, 100, 85, "atlas.shotPut", "stamina")
        stamina.anchor.setTo(0, 1)
        stamina.width = 0
        barGroup.add(stamina)
        
        bar = barGroup.create(0, 0, "atlas.shotPut", "bar")
        bar.anchor.setTo(0, 1)
        //bar.scale.setTo(1, 0.8) 
    }
    
    function initBtn(){
        
        var minus = sceneGroup.create(game.world.centerX - 245, game.world.height - 50, 'atlas.shotPut', 'minus')
        minus.anchor.setTo(0.5, 0.5)
        //minus.scale.setTo(1, 1.5)
        minus.inputEnabled = true
        minus.events.onInputDown.add(inputButton)
        minus.name = 'minus'
        
        var plus = sceneGroup.create(game.world.centerX + 260, game.world.height - 60, 'atlas.shotPut', 'plus')
        plus.anchor.setTo(0.5, 0.5)
        //minus.scale.setTo(1, 1.5)
        plus.inputEnabled = true
        plus.events.onInputDown.add(inputButton)
        plus.name = 'plus'
    }
	
	function inputButton(btn){
		
        var sp = topStamina/5
           
		if(gameActive){
            
            switch(btn.name){
                case 'minus':
                    if(stamina.width > 0){
                        sound.play('cut')
                        force--
                        if(force <= 0)
                            force = 0
                        game.add.tween(stamina).to({width:Phaser.Math.clamp(stamina.width - sp, 0, topStamina)}, 150, Phaser.Easing.linear, true)
                    }
                    else{
                        
                    }
                break
                case 'plus':
                    if(stamina.width < topStamina){
                        sound.play('cut')
                        force++
                        if(force >= 5)
                            force = 5
                        game.add.tween(stamina).to({width:Phaser.Math.clamp(stamina.width + sp, 0, topStamina)}, 150, Phaser.Easing.linear, true)
                    }
                    else{
                        
                    }
                break
            }
            if(force === objIndex + 1)
                stamina.tint = 0x33ff33
            else
                stamina.tint = 0xffffff
		}
	}
    
    function initObjGroup(){
        
        oof.autoUpdateTransform()
        var slot = getSpineSlot(oof, "empty")
        
        objGroup = game.add.group()
        objGroup.x = game.world.centerX - 280
        objGroup.y = game.world.centerY + 220
        objGroup.startPosX = objGroup.x
        objGroup.startPosY = objGroup.y
        objGroup.scale.setTo(0.5)
        //slot.add(objGroup)
        
        for(var i = 1; i <= 5; i++){
            var obj = objGroup.create(0, 0, 'atlas.shotPut', ''+i) 
            obj.anchor.setTo(0.5, 0.5)
            obj.alpha = 0
        }
        //console.log(slot)
    }
    
    function getSpineSlot(spine, slotName){
		
		var slotIndex
		for(var index = 0, n = spine.skeletonData.slots.length; index < n; index++){
			var slotData = spine.skeletonData.slots[index]
			if(slotData.name === slotName){
				slotIndex = index
			}
		}

		if (slotIndex){
			return spine.slotContainers[slotIndex]
		}
	}
    
    function positionTimer(){
        
        timerGroup = game.add.group()
        timerGroup.scale.setTo(1.5)
        timerGroup.alpha = 0
        sceneGroup.add(timerGroup)
        
        var clock = game.add.image(0, 0, "atlas.time", "clock")
        clock.scale.setTo(0.7)
        timerGroup.add(clock)
        
        var timeBar = game.add.image(clock.position.x + 40, clock.position.y + 40, "atlas.time", "bar")
        timeBar.scale.setTo(8, 0.45)
        timerGroup.add(timeBar)
        timerGroup.timeBar = timeBar
        
        timerGroup.x = game.world.centerX - clock.width * 0.75
        timerGroup.y = clock.height * 0.5
   }
    
    function stopTimer(){
        
        timerGroup.tweenTiempo.stop()
        game.add.tween(timerGroup.timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        timerGroup.tweenTiempo = game.add.tween(timerGroup.timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        timerGroup.tweenTiempo.onComplete.add(function(){
            throwObj()
        })
    }
    
    function initGame(){
        
        objIndex = getRand()
        game.add.tween(stamina).to({width:Phaser.Math.clamp(0, 0, topStamina)}, 200, Phaser.Easing.linear, true)
        force = 0
        objGroup.alpha = 1
        changeImage(objIndex, objGroup)
        rotate()
        
        game.time.events.add(380,function(){
            oof.setSkinByName("normal"+(objIndex+1))
        },this)
        
        if(pointsBar.number > 5){
            delay -= 250
            game.time.events.add(3000,function(){
                startTimer(delay)
            },this)
        }
        
        game.time.events.add(1000,function(){
            gameActive = true
        },this)
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 4)
        if(x === objIndex)
            return getRand()
        else
            return x     
    }
    
    function rotate(){
        
        var delay1, delay2, scale
        
        switch(objIndex){
            case 0:
                objGroup.angle = 20
                delay1 = 600
                delay2 = 250
                scale = 0.8
            break
            case 1:
                objGroup.angle = 45
                delay1 = 500
                delay2 = 315
                scale = 0.6
            break
            case 2:
                objGroup.angle = -45
                delay1 = 400
                delay2 = 320
                scale = 0.8
                objGroup.y += 40
            break
            case 3:
                objGroup.angle = -45
                delay1 = 400
                delay2 = 280
                scale = 0.75
                objGroup.y -= 30
                objGroup.X -= 10
            break
            case 4:
                objGroup.angle = 20
                delay1 = 400
                delay2 = 250
                scale = 0.9
                objGroup.y -= 20
            break
        }
        
        game.add.tween(objGroup.scale).to({x:1, y:1},delay1,Phaser.Easing.linear,true).onComplete.add(function(){
            sound.play("pop")
            game.add.tween(objGroup.scale).to({x:scale, y:scale},delay2,Phaser.Easing.linear,true).onComplete.add(function(){
                objGroup.alpha = 0
            })
        })
        if(objIndex === 2)
            objGroup.y -= 40
        else if(objIndex === 3){
            objGroup.y += 30
            objGroup.X += 10 
        }
    }
    
    function throwObj(){
        
        gameActive = false
        objGroup.alpha = 1
        changeImage(objIndex, objGroup)
        oof.setAnimationByName(0, "THROW", false)
        
        if(timerGroup.tweenTiempo){
            stopTimer()
        }
        
        var destinyX, destinyY, aux, scale
        
        if(force === objIndex+1){
            destinyX =  target.x
            destinyY =  target.y
            aux = 100
            scale = 0.15
        }
        else if(force < objIndex+1){
            
            if((objIndex +1 - force) >= 3){
                destinyX =  target.x - 200
                destinyY =  target.y + 200
                aux = 350
                scale = 0.3
            }
            else{
                destinyX =  target.x - 100
                destinyY =  target.y + 100
                aux = 180
                scale = 0.2
            }
        }
        else{
            destinyX =  target.x + 50
            destinyY =  target.y - 250
            aux = target.y - 240
            scale = 0
        }
        
        oof.setSkinByName("normal")
        oof.addAnimationByName(0, "IDLE", true)
        sound.play('throw')
        game.add.tween(objGroup.scale).to({x: scale, y: scale}, 1000, null, true)
        
		game.add.tween(objGroup).to({x: destinyX}, 1000, null, true)
        
        game.add.tween(objGroup).to({y: aux}, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(function () {
            game.add.tween(objGroup).to({y: destinyY}, 500, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                if(force === objIndex+1){
                    particleCorrect.x = destinyX
                    particleCorrect.y = destinyY
                    particleCorrect.start(true, 1200, null, 6)
                    addPoint(1)
                    oof.setAnimationByName(0, "WIN", false)
                }
                else{
                    particleWrong.x = destinyX
                    particleWrong.y = destinyY
                    particleWrong.start(true, 1200, null, 6)
                    missPoint()
                    oof.setAnimationByName(0, "LOSE", false)
                }
                
                if(pointsBar.number === 6){
                    game.add.tween(timerGroup).to({alpha:1}, 800, Phaser.Easing.linear, true)
                }
                
                if(lives !== 0){
                    oof.setSkinByName("normal")
                    oof.addAnimationByName(0, "IDLE", true)
                }
                
                game.add.tween(objGroup).to({alpha:0}, 1200, Phaser.Easing.linear, true).onComplete.add(function(){
                    objGroup.x = objGroup.startPosX
                    objGroup.y = objGroup.startPosY
                    if(lives !== 0)
                        initGame()
                })
            })
        })
    }
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('wrong')
        sceneGroup.add(particleWrong)
    }
    
    function okBtn(){
        
        var okBtn = sceneGroup.create(game.world.width - 150, game.world.height - 250, 'atlas.shotPut', 'ok')
        okBtn.anchor.setTo(0.5) 
        okBtn.inputEnabled = true
        okBtn.events.onInputDown.add(okPressed, this)       
    }
    
    function okPressed(okBtn){
        
        if(gameActive){
            
            sound.play('pop')
            game.add.tween(okBtn.scale).to({x: 0.5, y:0.5}, 150, Phaser.Easing.linear,true,0,0).yoyo(true,0).onComplete.add(function(){
                okBtn.scale.setTo(1)
            })
            throwObj()
        }
    }

	return {
		
		assets: assets,
		name: "shotPut",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            timberman = game.add.audio('timberman')
            game.sound.setDecodedCallback(timberman, function(){
                timberman.loopFull(0.6)
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
            positionTimer()
            initOof()
            initStaminaBar()
            initObjGroup() 
            initBtn()
            okBtn()
            createParticles()
			
			buttons.getButton(timberman,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()
