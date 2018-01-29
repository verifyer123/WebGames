
var soundsPath = "../../shared/minigames/sounds/"
var particlesPath="../../shared/minigames/images/particles/battle/"
var solarWing = function(){
    
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
                name: "atlas.solar",
                json: "images/solar/atlas.json",
                image: "images/solar/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/solar/timeAtlas.json",
                image: "images/solar/timeAtlas.png",
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
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "ship",
				file: soundsPath + "robotBeep.mp3"},
            {	name: "energy",
				file: soundsPath + "energyCharge2.mp3"},
            {	name: "changeOpen",
				file: soundsPath + "robotBeep.mp3"},
            {	name: "changeClose",
				file: soundsPath + "lock.mp3"},
            
			
		],
        jsons: [
			{
				name: 'pickedEnergy', 
				file:  particlesPath + 'pickedEnergy/specialBar1.json'
			}
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 130
	var indexGame
    var overlayGroup
    var spaceSong
    
    var backgroundGroup=null
    
    var eagleActivated
    var speed
    var tweenTiempo
    var clock, timeBar
    var canCollide
    var emitter
    var clouds=new Array(4)
    var cloudState, sunState
    var canCreate
    var oblig

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#000000"
        lives = 3
        oblig=0
        canCollide=true
        canCreate=false
        speed=3.3
        eagleActivated=false
        emitter=""
        cloudState=false
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
        
        if(lives==0){
            
            canCreate=false
        }
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
    
    function changeWings(obj){
        
        if(obj.tag=="open"){
            eagleActivated=false
            eagle.setAnimationByName(0,"FLY",true)
            sound.play("changeOpen")
            buttonOpen.loadTexture("atlas.solar","press_op-8")
        }else if(obj.tag=="closed"){
            eagleActivated=true
            eagle.setAnimationByName(0,"FLY_FASTER",true)
            sound.play("changeClose")
            buttonClose.loadTexture("atlas.solar","press_clos-8")
        }
        
    }
    
    function changeWingsR(obj){
        
         if(obj.tag=="open"){
             buttonOpen.loadTexture("atlas.solar","open-8")
         }else if(obj.tag=="closed"){
             buttonClose.loadTexture("atlas.solar","close-8")
         }
        
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
    
    function createClouds(){
        
        create=game.rnd.integerInRange(0,4)
        canCollide=true
        oblig++
        if(oblig==2){
            create=4
            oblig=0
        }
        if(create==0){
            cloudGroup1.alpha=1
            cloudGroup2.alpha=0
            cloudGroup3.alpha=0
            cloudGroup4.alpha=0
            cloudGroup5.alpha=0
            cloudState=false
            sunState=false
        }
        if(create==1){
            cloudGroup1.alpha=0
            cloudGroup2.alpha=1
            cloudGroup3.alpha=0
            cloudGroup4.alpha=0
            cloudGroup5.alpha=0
            cloudState=false
            sunState=false
        }
        if(create==2){
            cloudGroup1.alpha=0
            cloudGroup2.alpha=0
            cloudGroup3.alpha=1
            cloudGroup4.alpha=0
            cloudGroup5.alpha=0
            cloudState=true
            sunState=false
        }
        if(create==3){
            cloudGroup1.alpha=0
            cloudGroup2.alpha=0
            cloudGroup3.alpha=0
            cloudGroup4.alpha=1
            cloudGroup5.alpha=0
            cloudState=true
            sunState=false
        }
        if(create==4){
            cloudGroup1.alpha=0
            cloudGroup2.alpha=0
            cloudGroup3.alpha=0
            cloudGroup4.alpha=0
            cloudGroup5.alpha=1
            cloudAll.position.y=sun.y-100
            cloudState=false
            sunState=true
        }
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.solar','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.solar','life_box')

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
        
		buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false;
        epicparticles.loadEmitter(game.load, "pickedEnergy")
        
        game.load.spritesheet("coin", 'images/Spine/coin/coin.png', 122, 123, 12)
        
        game.load.spritesheet("cloudy1", 'images/Spine/Clouds/cloudy1.png', 244, 278, 25)
        game.load.spritesheet("cloudy2", 'images/Spine/Clouds/cloudy2.png', 368, 382, 20)
        
        
        game.load.audio('spaceSong', soundsPath + 'songs/technology_action.mp3');
        
		game.load.image('howTo',"images/solar/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/solar/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/solar/introscreen.png")
        
        game.load.spine("eagle","images/Spine/eagle/eagle.json")
        game.load.spine("sun","images/Spine/sun/sun.json")
        
		
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
            canCreate=true
            createClouds()
            //Aqui va la primera funciòn que realizara el juego
            
            startGame=true
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.solar','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'Movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.solar',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.solar','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
	   
        backgroundGroup = game.add.group()
        characterGroup = game.add.group()
        UIGroup = game.add.group()
        
        sceneGroup.add(backgroundGroup)
        
        
        cloudAll=game.add.group()
        sceneGroup.add(cloudAll)
        sceneGroup.add(UIGroup)
        sceneGroup.add(characterGroup)
        
        cloudGroup1=game.add.group()
        cloudGroup2=game.add.group()
        cloudGroup3=game.add.group()
        cloudGroup4=game.add.group()
        cloudGroup5=game.add.group()
        
        cloudAll.add(cloudGroup1)
        cloudAll.add(cloudGroup2)
        cloudAll.add(cloudGroup3)
        cloudAll.add(cloudGroup4)
        cloudAll.add(cloudGroup5)
        
        
        cloudy1=game.add.sprite(game.world.centerX, 0,"cloudy1")
        cloudy1.anchor.setTo(0.5)
        cloudy1.animations.add('IDLE');
        cloudy1.animations.play('IDLE', 24, true);
        cloudy1.scale.setTo(0.7)
        
        cloudGroup1.add(cloudy1)
        cloudGroup1.alpha=0
        
        cloudy2=game.add.sprite(game.world.centerX, 0,"cloudy2")
        cloudy2.anchor.setTo(0.5)
        cloudy2.animations.add('IDLE');
        cloudy2.animations.play('IDLE', 24, true);
        cloudy2.scale.setTo(0.7)
        
        cloudGroup2.add(cloudy2)
        cloudGroup2.alpha=0
        
        cloudy3=game.add.sprite(game.world.centerX+150, 0,"cloudy1")
        cloudy3.anchor.setTo(0.5)
        cloudy3.animations.add('IDLE');
        cloudy3.animations.play('IDLE', 24, true);
        cloudy3.scale.setTo(0.7)
        
        cloudy4=game.add.sprite(game.world.centerX-150, 0,"cloudy1")
        cloudy4.anchor.setTo(0.5)
        cloudy4.animations.add('IDLE');
        cloudy4.animations.play('IDLE', 24, true);
        cloudy4.scale.setTo(-0.7,0.7)
        
        cloudGroup3.add(cloudy3)
        cloudGroup3.add(cloudy4)
        cloudGroup3.alpha=0
        
        cloudy5=game.add.sprite(game.world.centerX+150, 0,"cloudy2")
        cloudy5.anchor.setTo(0.5)
        cloudy5.animations.add('IDLE');
        cloudy5.animations.play('IDLE', 24, true);
        cloudy5.scale.setTo(0.7)
        
        cloudy6=game.add.sprite(game.world.centerX-150, 0,"cloudy2")
        cloudy6.anchor.setTo(0.5)
        cloudy6.animations.add('IDLE');
        cloudy6.animations.play('IDLE', 24, true);
        cloudy6.scale.setTo(-0.7,0.7)
        
        cloudGroup4.add(cloudy5)
        cloudGroup4.add(cloudy6)
        cloudGroup4.alpha=0
        
        
        ray1=game.add.graphics(game.world.centerX+150, 0);
        ray1.beginFill("0xffee00");
        ray1.drawCircle(0, 0, 50);
        ray1.anchor.setTo(0.5)

        
        ray2=game.add.graphics(game.world.centerX-150, 0);
        ray2.beginFill("0xffee00");
        ray2.drawCircle(0, 0, 50);
        ray2.anchor.setTo(0.5)
        
        
        cloudGroup5.add(ray1)
        cloudGroup5.add(ray2)
        cloudGroup5.alpha=0
        
        
        cloudAll.alpha=1
        cloudAll.y=-200
        
        
        
        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        
        //BackGround
        
        backG=game.add.tileSprite(0,0,game.world.width,game.world.height,"atlas.solar","tile-8")
        backgroundGroup.add(backG)
        
        solarBar=game.add.sprite(game.world.centerX,120,"atlas.solar","barra-8")
        solarBar.anchor.setTo(0.5)
        UIGroup.add(solarBar)
        
        bar=game.add.sprite(solarBar.x-155,solarBar.centerY-10,"atlas.time","bar")
        bar.anchor.setTo(0,0.5)
        //bar.scale.setTo(11.7,0.5)
        bar.scale.setTo(0.1,0.5)
        UIGroup.add(bar)
        
        //Sun 
        
        sun=game.add.spine(game.world.centerX, 400,"sun")
        sun.scale.setTo(0.5)
        sun.setSkinByName("normal")
        sun.setAnimationByName(0,"IDLE",true)
        backgroundGroup.add(sun)
        
        //Eagle
        
        eagle=game.add.spine(game.world.centerX,game.world.height-130,"eagle")
        eagle.scale.setTo(0.5)
        eagle.setSkinByName("normal")
        eagle.setAnimationByName(0,"FLY",true)
        characterGroup.add(eagle)
        
        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0
        
        cloudPar1=game.add.sprite(game.rnd.integerInRange(0,game.world.width),game.rnd.integerInRange(0,game.world.height-200),"atlas.solar","tile_1-8")
        cloudPar2=game.add.sprite(game.rnd.integerInRange(0,game.world.width),game.rnd.integerInRange(0,game.world.height-200),"atlas.solar","tile_1-8")
        cloudPar3=game.add.sprite(game.rnd.integerInRange(0,game.world.width),game.rnd.integerInRange(0,game.world.height-200),"atlas.solar","tile_1-8")
        cloudPar4=game.add.sprite(game.rnd.integerInRange(0,game.world.width),game.rnd.integerInRange(0,game.world.height-200),"atlas.solar","tile_1-8")
        
        backgroundGroup.add(cloudPar1)
        backgroundGroup.add(cloudPar2)
        backgroundGroup.add(cloudPar3)
        backgroundGroup.add(cloudPar4)
        
        cloudPar1.anchor.setTo(0.5)
        cloudPar2.anchor.setTo(0.5)
        cloudPar3.anchor.setTo(0.5)
        cloudPar4.anchor.setTo(0.5)
        
        cloudPar1.alpha=0.5
        cloudPar2.alpha=0.5
        cloudPar3.alpha=0.5
        cloudPar4.alpha=0.5
        
        
        buttonOpen=game.add.sprite(game.world.centerX-150,game.world.height-100,"atlas.solar","open-8");
        buttonOpen.inputEnabled=true;
        buttonOpen.anchor.setTo(0.5);
        buttonOpen.tag="open";
        buttonOpen.events.onInputDown.add(changeWings, this);
        buttonOpen.events.onInputUp.add(changeWingsR, this);
        
        buttonClose=game.add.sprite(game.world.centerX+150,game.world.height-100,"atlas.solar","close-8");
        buttonClose.inputEnabled=true;
        buttonClose.tag="closed";
        buttonClose.events.onInputDown.add(changeWings, this);
        buttonClose.events.onInputUp.add(changeWingsR, this);
        buttonClose.anchor.setTo(0.5);
        
        characterGroup.add(buttonOpen)
        characterGroup.add(buttonClose)
        
    }
	
    function playedEagle(obj){
        
        if(!eagleActivated){
            eagleActivated=true
            eagle.setAnimationByName(0,"FLY_FASTER",true)
        }else if(eagleActivated){
            eagleActivated=false
            eagle.setAnimationByName(0,"FLY",true)
        }
        
        
    }

    function Coin(objectBorn,objectDestiny,time){
        
        
        //objectBorn= Objeto de donde nacen
        coins.x=objectBorn.centerX
        coins.y=objectBorn.centerY
        
        emitter = epicparticles.newEmitter("pickedEnergy")
        emitter.duration=0.05;
        emitter.x = coins.x
        emitter.y = coins.y
        game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
        game.add.tween(coins).to({y:objectBorn.centerY-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
            game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
            game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
                coins.x=objectBorn.centerX
                coins.y=objectBorn.centerY
                addPoint(1)
            })
        })
    }
  
    
	function update(){
        
        
        if(startGame){
            epicparticles.update()
            
            if(canCreate){
                if(cloudAll.y>=eagle.y-150 && cloudAll.y<eagle.y-120 && canCollide && eagleActivated==cloudState && !sunState){
                    Coin(eagle,pointsBar,100)
                    canCollide=false
                }else if(cloudAll.y>=eagle.y-150 && cloudAll.y<eagle.y-120 && canCollide && eagleActivated!=cloudState && !sunState){
                    missPoint()
                    canCollide=false
                    if(lives>0){
                        eagle.setAnimationByName(0,"HIT",false)
                    }else{
                        eagle.setAnimationByName(0,"LOOSE",false)
                    }
                    buttonOpen.inputEnabled=false
                    buttonClose.inputEnabled=false
                    
                    game.time.events.add(600,function(){
                         if(lives>0){
                            eagle.setAnimationByName(0,"FLY",true)
                         }
                        buttonOpen.inputEnabled=true
                        buttonClose.inputEnabled=true
                        
                        eagleActivated=false
                    })
                    if(speed>1.01){
                        speed-=3
                    }else{
                        speed-=0.01
                    }
                }else if(cloudAll.y>=eagle.y-150 && cloudAll.y<eagle.y-120 && canCollide && sunState && speed<11.6){
                    speed+=0.8
                    canCollide=false
                    sound.play("energy")
                    emitter2 = epicparticles.newEmitter("pickedEnergy")
                    emitter2.duration=0.5;
                    emitter2.x = eagle.x-150
                    emitter2.y = eagle.y-70
                    
                    emitter3 = epicparticles.newEmitter("pickedEnergy")
                    emitter3.duration=0.5;
                    emitter3.x = eagle.x+150
                    emitter3.y = eagle.y-70
                    cloudAll.alpha=0
                }else if(cloudAll.y>=eagle.y-150 && cloudAll.y<eagle.y-120 && canCollide && sunState){
                    sound.play("energy")
                    emitter2 = epicparticles.newEmitter("pickedEnergy")
                    emitter2.duration=0.5;
                    emitter2.x = eagle.x-150
                    emitter2.y = eagle.y-70
                    
                    emitter3 = epicparticles.newEmitter("pickedEnergy")
                    emitter3.duration=0.5;
                    emitter3.x = eagle.x+150
                    emitter3.y = eagle.y-70
                    cloudAll.alpha=0
                }
                
                
                bar.scale.setTo(speed,0.5)
                cloudAll.y+=speed*1.8

                if(cloudAll.y>game.world.height+200){
                    cloudAll.y=-200
                    cloudAll.alpha=1
                    createClouds()
                }
                if(eagleActivated){
                    if(eagle.y>game.world.centerY)eagle.position.y-=5;
                    cloudPar1.y+=speed*2
                    cloudPar2.y+=speed*2
                    cloudPar3.y+=speed*2
                    cloudPar4.y+=speed*2
                }else if(!eagleActivated){
                    if(eagle.y<game.world.height-130)eagle.position.y+=5;
                    cloudPar1.y+=speed
                    cloudPar2.y+=speed
                    cloudPar3.y+=speed
                    cloudPar4.y+=speed
                }
                
                if(cloudPar1.y>game.world.height+100){
                    cloudPar1.x=game.rnd.integerInRange(0,game.world.width)
                    cloudPar1.y=game.rnd.integerInRange(-200,-100)
                }
                if(cloudPar2.y>game.world.height+100){
                    cloudPar2.x=game.rnd.integerInRange(0,game.world.width)
                    cloudPar2.y=game.rnd.integerInRange(-200,-100)
                }
                if(cloudPar3.y>game.world.height+100){
                    cloudPar3.x=game.rnd.integerInRange(0,game.world.width)
                    cloudPar3.y=game.rnd.integerInRange(-200,-100)
                }
                if(cloudPar4.y>game.world.height+100){
                    cloudPar4.x=game.rnd.integerInRange(0,game.world.width)
                    cloudPar4.y=game.rnd.integerInRange(-200,-100)
                }
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
        particle.makeParticles('atlas.solar',key);
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

				particle.makeParticles('atlas.solar',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.solar','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.solar','smoke');
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
	
	return {
		
		assets: assets,
		name: "solarWing",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
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