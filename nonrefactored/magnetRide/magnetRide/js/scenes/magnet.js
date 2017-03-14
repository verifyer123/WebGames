
var soundsPath = "../../shared/minigames/sounds/"
var magnet = function(){
    
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
                name: "atlas.magnet",
                json: "images/magnet/atlas.json",
                image: "images/magnet/atlas.png",
            },
        ],
        images: [
			{   name:"background",
				file: "images/magnet/background.png"},
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
				file: soundsPath + "splash.mp3"},
		],
    }
    
   	var DEBUG_PHYSICS = true
    var WORLD_GRAVITY = 2500
    
    var lives = null
	var sceneGroup = null
    var pointsGroup = null
    var gameActive = true
    var arrayComparison = null
	var player
	var jumpButton
	var jumpDown
    var gameIndex = 5
    var overlayGroup
	var cone
	var machine
	var ballIndex
	var ballsNumber
	var yogotar
    var dojoSong
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
        arrayComparison = []
        numberIndex = 0
        timeValue = 2000
		ballIndex = 0
		jumpDown = false
        
        loadSounds()
        
	}
    
    
    function createPart(key,obj){
        
        var particlesNumber = 2
        
        /*if(game.device.desktop == true){ 
            
            particlesNumber = 4
            
            var particlesGood = game.add.emitter(0, 0, 100);

            particlesGood.makeParticles('atlas.magnet',key);
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
            var particle = sceneGroup.create(obj.x,obj.y,'atlas.magnet',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.magnet','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.magnet','life_box')

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
        gameActive = false
        dojoSong.stop()
        
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
        
        game.load.spine('oof', "images/spines/Oof.json")  
        game.load.audio('dojoSong', soundsPath + 'songs/asianLoop2.mp3');
        
        game.load.image('introscreen',"images/ice/introscreen.png")
        
    }
    
    function createOverlay(){
        
		createHearts()
           createPointsBar()
		
        overlayGroup = game.add.group()
		overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        rect.alpha = 0.6
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                overlayGroup.y = -game.world.height
                //start()
                gameActive = true
				game.physics.p2.gravity.y = WORLD_GRAVITY;
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX + 75, game.world.centerY,'introscreen')
        plane.scale.setTo(0.6,0.6)
        plane.anchor.setTo(0.5,0.5)
        
        var action = 'tap'
        
        if(game.device == 'desktop'){
            action = 'click'
        }
        
        var fontStyle = {font: "36px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, +100, 10, localization.getString(localizationData, "howTo"), fontStyle)
        pointsText.x = plane.x + 105
        pointsText.y = game.world.centerY - plane.height * 0.35
        pointsText.anchor.setTo(0.5,0.5)
        overlayGroup.add(pointsText)
		
		var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, -100, 150, localization.getString(localizationData, "stop"), fontStyle)
        pointsText.x = plane.x - 25
        pointsText.y = game.world.centerY - plane.height * 0.08
        pointsText.anchor.setTo(0.5,0.5)
        overlayGroup.add(pointsText)
        
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }
	
	function createGlobe(){
		
		globeGroup = game.add.group()
		globeGroup.x = game.world.centerX + 200
		globeGroup.alpha = 0
		globeGroup.y = yogotar.y - 400
		sceneGroup.add(globeGroup)
		
		var globeImg = globeGroup.create(0,0,'atlas.magnet','globe')
		globeImg.anchor.setTo(0.5,0.5)
		
		var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, -15, 'Five', fontStyle)
        pointsText.anchor.setTo(0.5,0.5)
        globeGroup.add(pointsText)
		
		globeGroup.number = 0
		globeGroup.text = pointsText
		
	}
	
	function createClock(){
        
        clock = game.add.group()
        clock.x = game.world.centerX
        clock.y = 75
        sceneGroup.add(clock)
        
        var clockImage = clock.create(0,0,'atlas.magnet','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.magnet','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
		clockBar.scale.x = 0
        
        clock.bar = clockBar
        
    }
	
	function createBackground(){
		
		var background = sceneGroup.create(0,0,'background')
		background.width = game.world.width
		background.height = game.world.height
	}
	
	function positionPlayer(){
        
        player.body.x = 100 
        yogotar.x = player.x
        yogotar.y = player.y +48 
        
    }
    
    function deactivateObj(obj){
		
        obj.body.velocity.x = 0
        obj.body.velocity.y = 0
        obj.used = false
        obj.body.y = -500
    }
    
    function checkObjects(){
        
        //console.log( objectsList.length + 'cantidad objetos')
        for(var index = 0;index<objectsList.length;index++){
            
            var obj = objectsList[index]
            var tag = obj.tag
            if(tag == 'misil'){
                obj.body.rotateLeft(Math.random()*80 + 40)   
            }
            
            if(obj.body.x < -obj.width * 0.45 && obj.used == true){
                
                //console.log(obj.body.y + ' posy')
                deactivateObj(obj)
                addObjects()
                //console.log('objeto removido')
            }else if(tag == 'coin' || tag.substring(0,4) == 'plat' || tag == 'enemy_spike' || tag == 'enemy_spike2'){
                if(Math.abs(obj.body.x - player.body.x) < obj.width * 0.5 && Math.abs(obj.body.y - player.body.y) < obj.height * 0.5){
                    if(tag == 'coin'){
                        addPoint(obj)
                        deactivateObj(obj)
                    }else if(tag.substring(0,4) == 'plat'){
                        
                        missPoint()
                        createPart('wrong', player)
                        stopGame()
                    }else if(tag == "enemy_spike" || tag == 'enemy_spike2'){
                        
                        if(player.invincible){
                            
                            if(obj.body.velocity.y != 0 ){
                                return
                            }
                            
                            sound.play("splash")
                            createPart('drop',obj)

                            obj.body.velocity.x = 800
                            var offsetX = 1
                            if(Math.random()*2> 1){offsetX = -1}
                            obj.body.velocity.y = game.rnd.integerInRange(600, 800) * offsetX
                            game.time.events.add(500,function(){
                                deactivateObj(obj)
                            })

                        }else{

                            missPoint()
                            createPart('wrong', obj)
                            
                            stopGame()
                        }

                    }
                }
                
            }
        }
    }
    
    function doJump(value){
        
        /*sound.play("spaceship")
        sound.play("whoosh")*/
        yogotar.isRunning = false
        
        if(!player.invincible){
            yogotar.setAnimationByName(0, "JUMP", false);
        }
		
		if(!player.up){
			yogotar.setSkinByName('menos')
		}else{
			yogotar.setSkinByName('mas')
		}
		
		player.up = !player.up
        
        
        createPart('ring',player)
        //yogotar.addAnimationByName(0, "LAND", false);
        
        yogotar.scale.y*=-1
        
        if(yogotar.scale.y < 0){
            yogotar.y = -100
        }else{
            yogotar.y = 0
        }
        
		player.body.velocity.y*=0.5
        game.physics.p2.gravity.y*=-1;
        
        /*var jumpValue = value
        
        if(jumpValue == null){ jumpValue = JUMP_FORCE}
        sound.play("whoosh")
        
        yogotar.isRunning = false
        
        player.body.moveUp(jumpValue )
        jumpTimer = game.time.now + 750;
        
        game.time.events.add(750, function(){
            if(gameActive == true){
                //yogotar.setAnimationByName(0, "RUN", true);
            }
        } , this);*/
    
    }
    
    function update(){
        
        if(gameActive == false){
            return
        }
        
        positionPlayer()
        
        if (jumpButton.isDown && !jumpDown){
			
			console.log('entra')
			jumpDown = true
			doJump()
        }
		
        if(jumpButton.isUp){
            jumpDown = false
        }
        
        //checkObjects()
    }
	
	return {
		
		assets: assets,
		name: "magnet",
		update: update,
        preload:preload,
		create: function(event){
            
			game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.gravity.y = 0;
            game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            game.physics.p2.world.setGlobalStiffness(1e5);
			
			jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			
			sceneGroup = game.add.group()
			
			createBackground()
            
			yogotar = game.add.spine(game.world.centerX - 200,game.world.centerY, "oof");
            sceneGroup.add(yogotar)   
			
			player = sceneGroup.create(yogotar.x, yogotar.y,'atlas.magnet','yogotar')
            player.anchor.setTo(0.5,1)
            player.alpha = 0
            game.physics.p2.enable(player,DEBUG_PHYSICS)
            player.body.fixedRotation = true
            player.body.mass=50
			player.up = false
			
            yogotar.setAnimationByName(0, "IDLE", true);
            yogotar.setSkinByName('mas');
                        			
            dojoSong = game.add.audio('dojoSong')
            game.sound.setDecodedCallback(dojoSong, function(){
                //dojoSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()