
var soundsPath = "../../shared/minigames/sounds/"
var particlesPath="../../shared/minigames/images/particles/battle/"
var tutorialPath = "../../shared/minigames/"
var satellite = function(){
    
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
                name: "atlas.satellite",
                json: "images/satellite/atlas.json",
                image: "images/satellite/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/satellite/timeAtlas.json",
                image: "images/satellite/timeAtlas.png",
            },
        ],
        images: [
		],
        spines: [
            {
                name:"satell",
                file:"images/Spine/Satellite/satellite.json",
            },
            {
                name:"meteors",
                file:"images/Spine/Meteorite/metorite.json",
            }
        ],
        spritesheets: [
            {
                name:"coin",
                file:"images/Spine/coin/coin.png",
                width:122,
                height:123,
                frames:12
            }
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
            {	name: "explode",
				file: soundsPath + "fireExplosion.mp3"},
            {	name: "falling",
				file: soundsPath + "falling.mp3"},
            {	name: "energy",
				file: soundsPath + "energyCharge2.mp3"},
            
			
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
    var gameIndex = 102
	var indexGame
    var overlayGroup
    var spaceSong
    
    var backgroundGroup=null
    
    
    var tweenTiempo
    var clock, timeBar
    var emitter
    var lifes1=new Array(5)
    var lifes2=new Array(5)
    var lifes3=new Array(5)
    
    var lifesProxy=new Array(3)
    
     var numLifes1=5
    var numLifes2=5
    var numLifes3=5
    
    var timerRest
    
    var dificulty, speedCreate
    
    var meteors=new Array(10)
    var meteorsProxy=new Array(10)
    var meteorsActive=new Array(10)
    var meteorsTween=new Array(10)
    var activeShield1,activeShield2,activeShield3
    var temp1,temp2,temp3,temp4
    
     var activateEarth

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#000000"
        lives = 3
        charged1=false
        charged2=false
        timerRest=500
        speedCreate=10000;
        temp4=0
        gameActive=true
        dificulty=2000
        charged3=false
        activateEarth=true
        for(var fulfill=0; fulfill<meteors.length;fulfill++){
            meteorsActive[fulfill]=false
        }
        howMany=0
        activeShield1=true
        activeShield2=true
        activeShield3=true
        rotating=false
        emitter=""
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
    
     function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    }
    
    function generateThem(){
        
       
        enemyGenerator(meteorsProxy,meteorsActive,meteorsTween, 10, 2000);
        returnGenerate()
    }
    
    function returnGenerate(){
        
        game.time.events.add(dificulty,function(){
            generateThem()
            
        })
    }
    
    function recoveryEnergy(){
               
                
        
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.satellite','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.satellite','life_box')

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
        
        
        game.load.audio('spaceSong', soundsPath + 'songs/electro_trance_minus.mp3');
        
		game.load.image('howTo',"images/satellite/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/satellite/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/satellite/introscreen.png")
        
        //game.load.spritesheet("coin", 'Spine/coin/coin.png', 122, 123, 12)
        
        //game.load.spine("ship","images/Spine/ship/ship.json")
		
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
            generateThem()
            gameActive=true
            startGame=true
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.satellite','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.satellite',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.satellite','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
	   backgroundGroup = game.add.group()
       
        satelliteGroup=game.add.group()
        
        sceneGroup.add(backgroundGroup)
        sceneGroup.add(satelliteGroup)
        
        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        
        //Creamos background
        
        backGround=game.add.sprite(game.world.centerX,game.world.centerY,"atlas.satellite","fondo");
        backGround.anchor.setTo(0.5,0.5)
        backGround.scale.setTo(game.world.width/500,1)
        backgroundGroup.add(backGround)
        
        
        earth=game.add.sprite(game.world.centerX,game.world.centerY,"atlas.satellite","earth")
        earth.anchor.setTo(0.5,0.5)
        backgroundGroup.add(earth)
        
        satelliteGroup.x=game.world.centerX
        satelliteGroup.y=game.world.centerY
        
        //Shields

        shield1Proxy=game.add.sprite(100, -200,"atlas.satellite","satelite")
        shield2Proxy=game.add.sprite(-110, -200,"atlas.satellite","satelite")
        shield3Proxy=game.add.sprite(0, 220,"atlas.satellite","satelite")
        
        lifesProxy[0]=game.add.sprite(earth.centerX+90, earth.centerY-180,"atlas.satellite","wifiReceptor")
        lifesProxy[1]=game.add.sprite(earth.centerX-100, earth.centerY-190,"atlas.satellite","wifiReceptor")
        lifesProxy[2]=game.add.sprite(earth.centerX-20, earth.centerY+190,"atlas.satellite","wifiReceptor")
        lifesProxy[0].alpha=0
        lifesProxy[1].alpha=0
        lifesProxy[2].alpha=0
        
        life1=game.add.sprite(earth.centerX+70, earth.centerY-78,"atlas.satellite","wifiReceptor")
        life2=game.add.sprite(earth.centerX-70, earth.centerY-80,"atlas.satellite","wifiReceptor")
        life3=game.add.sprite(earth.centerX, earth.centerY+100,"atlas.satellite","wifiReceptor")
        
        shield1Proxy.anchor.setTo(0.5)
        shield2Proxy.anchor.setTo(0.5)
        shield3Proxy.anchor.setTo(0.5)
        
        life1.anchor.setTo(0.5)
        life2.anchor.setTo(0.5)
        life3.anchor.setTo(0.5)
        
        shield1Proxy.alpha=1
        shield2Proxy.alpha=1
        shield3Proxy.alpha=1
        
        chargingIcon1=game.add.sprite(life1.x+20,life1.y-35,"atlas.satellite","wifi");
        chargingIcon1.anchor.setTo(0.5)
        
        chargingIcon2=game.add.sprite(life2.x-15,life2.y-35,"atlas.satellite","wifi");
        chargingIcon2.anchor.setTo(0.5)
        
        chargingIcon3=game.add.sprite(life3.x,life3.y+35,"atlas.satellite","wifi");
        chargingIcon3.anchor.setTo(0.5)
        
        backgroundGroup.add(chargingIcon1)
        backgroundGroup.add(chargingIcon2)
        backgroundGroup.add(chargingIcon3)
        
        chargingIcon1.rotation=0.5
        chargingIcon2.rotation=-0.5
        chargingIcon3.rotation=91.10
        
        chargingTween1=game.add.tween(chargingIcon1).to({alpha:0},250,Phaser.Easing.Cubic.In,true).yoyo(true).loop(true);
        chargingTween2=game.add.tween(chargingIcon2).to({alpha:0},250,Phaser.Easing.Cubic.In,true).yoyo(true).loop(true);
        chargingTween3=game.add.tween(chargingIcon3).to({alpha:0},250,Phaser.Easing.Cubic.In,true).yoyo(true).loop(true);
        
        chargingIcon1.alpha=0
        chargingIcon2.alpha=0
        chargingIcon3.alpha=0
        
        chargingTween1.isPaused=true;
        chargingTween2.isPaused=true;
        chargingTween3.isPaused=true;
        
        
        shield1Proxy.rotation=0.5
        shield2Proxy.rotation=-0.5
        shield3Proxy.rotation=91.10
        
        
        life1.rotation=0.5
        life2.rotation=-0.5
        life3.rotation=91.10
        
        backgroundGroup.add(life1)
        backgroundGroup.add(life2)
        backgroundGroup.add(life3)
        
        
        for(var fillLifes=0;fillLifes<lifes1.length;fillLifes++){
            lifes1[fillLifes]=game.add.graphics(life1.x-14 +4.9*fillLifes, life1.centerY-1+2.7*fillLifes);
            lifes1[fillLifes].beginFill("0x00eeff");
            lifes1[fillLifes].drawRect(0,0,5,7);
            lifes1[fillLifes].rotation=0.5
            backgroundGroup.add(lifes1[fillLifes])
            
            lifes2[fillLifes]=game.add.graphics(life2.x-9+4.9*fillLifes, life2.centerY+12-3*fillLifes);
            lifes2[fillLifes].beginFill("0x00eeff");
            lifes2[fillLifes].drawRect(0, 0,5,7);
            lifes2[fillLifes].rotation=-0.5
            backgroundGroup.add(lifes2[fillLifes])
            
            lifes3[fillLifes]=game.add.graphics(life3.x-fillLifes*5.5+8, life3.centerY-13);
            lifes3[fillLifes].beginFill("0x00eeff");
            lifes3[fillLifes].drawRect(0, 0,5,7);
            backgroundGroup.add(lifes3[fillLifes])
        }
            
        
        satelliteGroup.add(shield1Proxy)
        satelliteGroup.add(shield2Proxy)
        satelliteGroup.add(shield3Proxy)
        
        satelliteGroup.scale.setTo(0.8)
        
        shield1=game.add.spine(earth.centerX+80, earth.centerY-160,"satell")
        shield1.setSkinByName("normal");
        shield1.rotation=0.5
        shield1.alpha=0
//        shield1.setAnimationByName(0,"FULL",true)
        
        shield2=game.add.spine(earth.centerX-90, earth.centerY-160,"satell")
        shield2.setSkinByName("normal");
        shield2.rotation=-0.5
        shield2.alpha=0
//        shield2.setAnimationByName(0,"FULL",true)
        
        shield3=game.add.spine(earth.centerX, earth.centerY+180,"satell")
        shield3.setSkinByName("normal");
        shield3.rotation=91.10
        shield1.alpha=0
//        shield3.setAnimationByName(0,"FULL",true)
        
        satelliteGroup.add(shield1)
        satelliteGroup.add(shield2)
        satelliteGroup.add(shield3)
        
        
        
        
        //Meteor proxy
        for(var filling=0; filling<meteorsProxy.length;filling++){
            meteors[filling]=game.add.spine(0,0,"meteors")
            meteors[filling].setSkinByName("normal");
            meteors[filling].scale.setTo(1)
            meteors[filling].alpha=1
            meteors[filling].setAnimationByName(0,"IDLE",true)
            meteorsProxy[filling]=game.add.sprite(meteors[filling].x,meteors[filling].y,"atlas.satellite","wifiReceptor")
            meteorsProxy[filling].anchor.setTo(0.5)
            meteorsProxy[filling].scale.setTo(0.5)
            meteorsProxy[filling].alpha=1
        
        }
        
        var rect2 = new Phaser.Graphics(game)
        rect2.beginFill(0x000000)
        rect2.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect2.alpha = 0
        rect2.endFill()
        rect2.inputEnabled = true
        rect2.events.onInputDown.add(stopEarth, this);
        backgroundGroup.add(rect2)
        
        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0
    }
	
     function stopEarth(obj){
        if(activateEarth){
            activateEarth=false
        }else if(!activateEarth){
            activateEarth=true
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
  
        function enemyGenerator(enemys,enemysActive,enemyTween, howMuch, speed, params){
        params = params || {}
        var destinyX=params.destinyX || game.world.centerX
        var destinyY=params.destinyY || game.world.centerY
        var where=game.rnd.integerInRange(0,1);
        var generate=game.rnd.integerInRange(0,9);
        if(howMany<howMuch){
            
            if(where==0){ 
                while(enemysActive[generate]==true){
                    generate=game.rnd.integerInRange(0,9);
                }
                
                if(enemysActive[generate]==false){
                    meteors[generate].alpha=1
                    sound.play("falling")
                    meteors[generate].scale.setTo(1,1)
                    meteors[generate].setAnimationByName(0,"IDLE",true)
                    enemys[generate].position.x=game.rnd.integerInRange(100,game.world.width-100);
                    enemys[generate].position.y=-200;
                    meteors[generate].angle= (Math.atan2(destinyY - enemys[generate].y, destinyX - enemys[generate].x) * 180 / Math.PI)-90;
                    
                    enemyTween[generate]=game.add.tween(enemys[generate]).to({x:destinyX,y:destinyY},speed,Phaser.Easing.In,true);
                    enemysActive[generate]=true;
                    howMany++;
                }
            }
            if(where==1){
                while(enemysActive[generate]==true){
                    generate=game.rnd.integerInRange(0,9);
                }
                
                if(enemysActive[generate]==false){
                    meteors[generate].alpha=1
                    meteors[generate].scale.setTo(1,1)
                    sound.play("falling")
                    meteors[generate].setAnimationByName(0,"IDLE",true)
                    enemys[generate].position.x=game.rnd.integerInRange(100,game.world.width-100);
                    enemys[generate].position.y=game.world.height+200;
                    meteors[generate].angle= (Math.atan2(destinyY - enemys[generate].y, destinyX - enemys[generate].x) * 180 / Math.PI)-90;
                    
                    enemyTween[generate]=game.add.tween(enemys[generate]).to({x:destinyX,y:destinyY},speed,Phaser.Easing.In,true);
                    enemysActive[generate]=true;
                    howMany++;
                }
            }
        }
    }
    
	function update(){
        
        
         if(startGame){
            epicparticles.update()
            recoveryEnergy()
            for(var followMeteors=0; followMeteors<meteors.length;followMeteors++){
                
                meteors[followMeteors].position.x=meteorsProxy[followMeteors].x
                meteors[followMeteors].position.y=meteorsProxy[followMeteors].y
                
                
            }

             
             if(dificulty>1500 && howMany==9){
                 dificulty-=200
             }
             if(howMany==9){
                 howMany=0
             }
             
             if(gameActive)timerRest--;
             if(timerRest<=0){
                 numLifes1--
                 
                    if(numLifes1==4){
                        lifes1[0].alpha=0
                    }
                    if(numLifes1==3){
                        lifes1[1].alpha=0
                    }
                    if(numLifes1==2){
                        lifes1[2].alpha=0
                    }
                    if(numLifes1==1){
                        lifes1[3].alpha=0
                    }
                    if(numLifes1==0){
                        lifes1[4].alpha=0
                    }
                 
                 
                 numLifes2--
                 
                 if(numLifes2==4){
                        lifes2[0].alpha=0
                    }
                    if(numLifes2==3){
                        lifes2[1].alpha=0
                    }
                    if(numLifes2==2){
                        lifes2[2].alpha=0
                    }
                    if(numLifes2==1){
                        lifes2[3].alpha=0
                    }
                    if(numLifes2==0){
                        lifes2[4].alpha=0
                    }
                 numLifes3--
                 
                 if(numLifes3==4){
                        lifes3[0].alpha=0
                    }
                    if(numLifes3==3){
                        lifes3[1].alpha=0
                    }
                    if(numLifes3==2){
                        lifes3[2].alpha=0
                    }
                    if(numLifes3==1){
                        lifes3[3].alpha=0
                    }
                    if(numLifes3==0){
                        lifes3[4].alpha=0
                    }
                 timerRest=500
                 
                 if(numLifes1==0){
                     missPoint()
                 }
                 if(numLifes2==0){
                     missPoint()
                 }
                 if(numLifes3==0){
                     missPoint()
                 }
                 
             }
            
            if(activateEarth){
                
                satelliteGroup.rotation+=0.03
                if( satelliteGroup.angle>=359) satelliteGroup.angle=0
            }
            
        }
        
        
            
            
            if(((checkOverlap(lifesProxy[0],shield2Proxy) && shield2Proxy.alpha==1)  || (checkOverlap(lifesProxy[0],shield1Proxy) && shield1Proxy.alpha==1) || (checkOverlap(lifesProxy[0],shield3Proxy) && shield3Proxy.alpha==1))&& numLifes1<5 && numLifes1>=1 && !charged1){
                 numLifes1++
                sound.play("energy")
                chargingIcon1.alpha=1;
                chargingTween1.isPaused=false;
                if(numLifes1==1){
                    lifes1[4].alpha=1
                    shield1.setAnimationByName(0,"HIT",true)
                    charged1=true 
                    
                }else if(numLifes1==2){
                    lifes1[3].alpha=1
                    shield1.setAnimationByName(0,"HIT",true)
                    charged1=true
                }else if(numLifes1==3){
                    shield1.setAnimationByName(0,"HIT",true)
                    lifes1[2].alpha=1
                    charged1=true
                }
                if(numLifes1==4){
                    shield1.setAnimationByName(0,"HIT",true)
                    lifes1[1].alpha=1
                    charged1=true
                }
                if(numLifes1==5){
                    shield1.setAnimationByName(0,"FULL",true)
                    lifes1[0].alpha=1
                    charged1=true
                }
                
                if(numLifes3==5 && numLifes1==5 && numLifes2==5){
                    Coin(earth,pointsBar,100)
                 }
        }else if(!checkOverlap(lifesProxy[0],shield1Proxy) && !checkOverlap(lifesProxy[0],shield2Proxy) && !checkOverlap(lifesProxy[0],shield3Proxy)){
                charged1=false
                chargingTween1.isPaused=true;
                chargingIcon1.alpha=0
        }
                
                
              
            if(((checkOverlap(lifesProxy[1],shield1Proxy) && shield1Proxy.alpha==1) || (checkOverlap(lifesProxy[1],shield2Proxy) && shield2Proxy.alpha==1) || (checkOverlap(lifesProxy[1],shield3Proxy) && shield3Proxy.alpha==1)) && numLifes2<5 && numLifes2>=1 && !charged2){
                numLifes2++
                sound.play("energy")
                chargingIcon2.alpha=1;
                chargingTween2.isPaused=false;
                if(numLifes2==1){
                    lifes2[4].alpha=1
                    shield2.setAnimationByName(0,"HIT",true)
                    charged2=true
                }else if(numLifes2==2){
                    lifes2[3].alpha=1
                    shield2.setAnimationByName(0,"HIT",true)
                    charged2=true
                }else if(numLifes2==3){
                    shield2.setAnimationByName(0,"HIT",true)
                    lifes2[2].alpha=1
                    charged2=true
                }
                if(numLifes2==4){
                    shield2.setAnimationByName(0,"HIT",true)
                    lifes2[1].alpha=1
                    charged2=true
                }
                if(numLifes2==5){
                    shield2.setAnimationByName(0,"FULL",true)
                    lifes2[0].alpha=1
                    charged2=true
                }
                if(numLifes3==5 && numLifes1==5 && numLifes2==5){
                    Coin(earth,pointsBar,100)
                 }
                }else if(!checkOverlap(lifesProxy[1],shield1Proxy) && !checkOverlap(lifesProxy[1],shield2Proxy) && !checkOverlap(lifesProxy[1],shield3Proxy)){
                        charged2=false
                        chargingTween2.isPaused=true;
                        chargingIcon2.alpha=0
                }
                
                    
            
            if(((checkOverlap(lifesProxy[2],shield1Proxy) && shield1Proxy.alpha==1) || (checkOverlap(lifesProxy[2],shield2Proxy)  && shield2Proxy.alpha==1) || (checkOverlap(lifesProxy[2],shield3Proxy)  && shield3Proxy.alpha==1)) && numLifes3<5 && numLifes3>=1 && !charged3){
                numLifes3++
                sound.play("energy")
                chargingIcon3.alpha=1;
                chargingTween3.isPaused=false;
                if(numLifes3==1){
                    lifes3[4].alpha=1
                    shield3.setAnimationByName(0,"HIT",true)
                    charged3=true
                }else if(numLifes3==2){
                    lifes3[3].alpha=1
                    shield3.setAnimationByName(0,"HIT",true)
                    charged3=true
                }else if(numLifes3==3){
                    shield3.setAnimationByName(0,"HIT",true)
                    lifes3[2].alpha=1
                    charged3=true
                }
                if(numLifes3==4){
                    shield3.setAnimationByName(0,"HIT",true)
                    lifes3[1].alpha=1
                    charged3=true
                }
                if(numLifes3==5){
                    shield3.setAnimationByName(0,"FULL",true)
                    lifes3[0].alpha=1
                    charged3=true
                }
                if(numLifes3==5 && numLifes1==5 && numLifes2==5){
                    Coin(earth,pointsBar,100)
                 }
                }else if(!checkOverlap(lifesProxy[2],shield1Proxy) && !checkOverlap(lifesProxy[2],shield2Proxy) && !checkOverlap(lifesProxy[2],shield3Proxy)){
                        charged3=false
                        chargingTween3.isPaused=true;
                        chargingIcon3.alpha=0
                }
                
        
        //Aqui checo la colision de los meteoritos con la tierra y luego con los satelites
        for(var checkCols=0; checkCols<meteors.length; checkCols++){
            
                if(checkOverlap(meteorsProxy[checkCols], shield1Proxy)&& activeShield1){
                    
                    meteorsTween[checkCols].stop()
                    meteors[checkCols].setAnimationByName(0,"HIT",false)
                    temp1=checkCols
                    game.time.events.add(500,function(){
                        meteorsProxy[temp1].x=200
                        meteorsActive[temp1]=false
                        meteors[temp1].setAnimationByName(0,"IDLE",true)
                        meteors[temp1].alpha=1
                        meteors[temp1].x=meteorsProxy[temp1].x
                        meteors[temp1].y=meteorsProxy[temp1].y
                    })
                    shield1Proxy.x=-200;
                    shield1Proxy.alpha=0
                    missPoint()
                    activeShield1=false
                }
                if(checkOverlap(meteorsProxy[checkCols], shield2Proxy)&& activeShield2){
                    
                    meteorsTween[checkCols].stop()
                    temp2=checkCols
                    
                    meteors[checkCols].setAnimationByName(0,"HIT",false)
                    game.time.events.add(500,function(){
                        meteorsProxy[temp2].y=200
                        meteorsActive[temp2]=false
                        meteors[temp2].setAnimationByName(0,"IDLE",true)
                        meteors[temp2].x=meteorsProxy[temp2].x
                        meteors[temp2].y=meteorsProxy[temp2].y
                    })
                    shield2Proxy.alpha=0
                    shield2Proxy.x=-200;
                    missPoint()
                    activeShield2=false
                }

                if(checkOverlap(meteorsProxy[checkCols], shield3Proxy) && activeShield3){
                    
                    meteorsTween[checkCols].stop()
                    temp3=checkCols
                    meteorsActive[checkCols]=false
                    meteors[checkCols].setAnimationByName(0,"HIT",false)
                    game.time.events.add(500,function(){
                        meteorsProxy[temp3].y=200
                        meteorsActive[temp3]=false
                        meteors[temp3].setAnimationByName(0,"IDLE",true)
                        meteors[temp3].x=meteorsProxy[temp3].x
                        meteors[temp3].y=meteorsProxy[temp3].y
                    })
                    shield3Proxy.alpha=0
                    shield3Proxy.x=-200;
                    missPoint()
                    activeShield3=false
                    
                }
            
            if(checkOverlap(meteorsProxy[checkCols], earth) && temp4==0){
                    
                    temp4=checkCols
                    
                    game.add.tween(meteors[checkCols].scale).to({x:0,y:0}, 500, Phaser.Easing.Cubic.In, true)
                    meteors[checkCols].setAnimationByName(0,"DISINTEGRATE",false)
                    
                    game.time.events.add(500,function(){
                        meteorsProxy[temp4].y=200
                        meteorsActive[temp4]=false
                        meteors[temp4].setAnimationByName(0,"IDLE",true)
                        temp4=0
                    })
                    
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
        particle.makeParticles('atlas.satellite',key);
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

				particle.makeParticles('atlas.satellite',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.satellite','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.satellite','smoke');
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
		name: "satellite",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
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