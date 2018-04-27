
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var particlesPath="https://play.yogome.com/shared/minigames/images/particles/battle/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"
var solarShieldSquad = function(){
    
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
                name: "atlas.solarS",
                json: "images/solarS/atlas.json",
                image: "images/solarS/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/solarS/timeAtlas.json",
                image: "images/solarS/timeAtlas.png",
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
			},
            {
				name: 'meteor', 
				file:  particlesPath + 'meteors/meteorParticle.json'
			}
		],
    }
    
    var INITIAL_TIME_CHARGE = 500
    var DELTA_TIME_CHARGE = 10
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 133
	var indexGame
    var overlayGroup
    var spaceSong
    
    var backgroundGroup=null
    
    
    var tweenTiempo
    var clock, timeBar
    var emitter
    var emitter2
    var rotating
    
    var lifes1=new Array(4)
    var lifes2=new Array(4)
    var lifes3=new Array(4)
    
    var meteors=new Array(10)
    var meteorsProxy=new Array(10)
    var meteorsActive=new Array(10)
    var meteorsTween=new Array(10)
    
    var numLifes1=4
    var numLifes2=4
    var numLifes3=4
    
    var dificulty, speedCreate
    
    var activateEarth
    var charged1, charged2, charged3
    var howMany

    var currentDirection
    var currentTimeCharge
    
    var solarShine

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#000000"
        lives = 3
        charged1=false
        charged2=false
        speedCreate=10000;
        dificulty=3000
        charged3=false
        activateEarth=true
        howMany=0
        rotating=false
        for(var fulfill=0; fulfill<meteors.length;fulfill++){
            meteorsActive[fulfill]=false
        }

        currentDirection = 1
        emitter=""
        emitter2=""
        currentTimeCharge = INITIAL_TIME_CHARGE
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.solarS','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.solarS','life_box')

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
        epicparticles.loadEmitter(game.load, "meteor")
        
        game.load.audio('spaceSong', soundsPath + 'songs/chemical_electro.mp3');
        
        game.load.spritesheet("coin", 'images/Spine/coin/coin.png', 122, 123, 12)
        game.load.spritesheet("explo", 'images/Spine/explo.png', 140, 168, 5)
        
		/*game.load.image('howTo',"images/solarS/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/solarS/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/solarS/introscreen.png")*/
        
        
        game.load.spine("sunS","images/Spine/Sun/sun.json")
        game.load.spine("shieldS","images/Spine/Shield/shield.json")    
        game.load.spine("meteors","images/Spine/Meteor/meteor.json")
		
		game.load.image('tutorial_image',"images/solarS/tutorial_image.png")
        //loadType(gameIndex)

        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)

    }

    function onClickPlay(){
        //Aqui va la primera funciòn que realizara el juego
        returnGenerate()
        startGame=true
        overlayGroup.y = -game.world.height
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
	   
        backgroundGroup = game.add.group()
        
        FXGroup=game.add.group()
        earthGroup=game.add.group()
        
        sceneGroup.add(backgroundGroup)
        
        sceneGroup.add(FXGroup)
        sceneGroup.add(earthGroup)
        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0
        
        
        earthGroup.x=game.world.centerX
        earthGroup.y=game.world.centerY
        
        
        out = [];

        bmd = game.add.bitmapData(game.world.width, game.world.height);
        gradient=bmd.addToWorld();
        
        y = 0;
        y2=game.world.centerY+100

        for (var i = 0; i < 200; i++)
        {
            
            var c = Phaser.Color.interpolateColor("0x110C3D", "0x69C70", 600, i);

            // console.log(Phaser.Color.getWebRGB(c));

            bmd.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c));

            out.push(Phaser.Color.getWebRGB(c));

            y += 2;
        }
        
        for (var i = 170; i < 200; i++)
        {
            var c2 = Phaser.Color.interpolateColor("0x69C70", "0x110C3D", 260, i);

            // console.log(Phaser.Color.getWebRGB(c));

            bmd.rect(0, y2, game.world.width, y2+5, Phaser.Color.getWebRGB(c2));

            out.push(Phaser.Color.getWebRGB(c2));

            y2 += 5;
        }
        backgroundGroup.add(gradient)
        
        
        
        hexTile=game.add.tileSprite(0,0,game.world.width,game.world.height,"atlas.solarS","hex")
        stars=game.add.tileSprite(0,0,game.world.width,game.world.height,"atlas.solarS","stars")
        backgroundGroup.add(hexTile)
        backgroundGroup.add(stars)
        
        hexTile.alpha=0.1
        stars.alpha=0.1
        
        
    
        
        //Playable
        
        
        
        earth2=game.add.sprite(game.world.centerX,game.world.centerY,"atlas.solarS","earth")
        earth2.anchor.setTo(0.5)
        earth2.scale.setTo(0.8)
        FXGroup.add(earth2)
        
        earth=game.add.sprite(0,0,"atlas.solarS","earth")
        earth.anchor.setTo(0.5)
        earth.scale.setTo(0.8)
        earth.alpha=0
        earthGroup.add(earth)
        
        shadow=game.add.sprite(game.world.centerX,game.world.centerY,"atlas.solarS","shadow")
        shadow.anchor.setTo(0.5)
        shadow.scale.setTo(0.8)
        FXGroup.add(shadow)

        solarShine = FXGroup.create(game.world.centerX+10,game.world.height, "atlas.solarS","sun_shine")
        solarShine.anchor.setTo(0.5)
        solarShine.scale.setTo(1.2)

        var solarTween = game.add.tween(solarShine.scale).to({x:1.5,y:1.5},800,Phaser.Easing.linear,true)
        solarTween.yoyo(true)
        solarTween.loop(true)
        

        sun=game.add.spine(game.world.centerX+10,game.world.height+150,"sunS")
        sun.setSkinByName("normal");
        sun.setAnimationByName(0,"IDLE",true)
        sun.speed =0.1
        FXGroup.add(sun)
        
        
        //Shields

        shield1Proxy=game.add.sprite(100, -200,"atlas.solarS","shield")
        shield2Proxy=game.add.sprite(-110, -200,"atlas.solarS","shield")
        shield3Proxy=game.add.sprite(0, 220,"atlas.solarS","shield")
        
        life1=game.add.sprite(earth.centerX+130, earth.centerY-260,"atlas.solarS","lifebar")
        life2=game.add.sprite(earth.centerX-140, earth.centerY-260,"atlas.solarS","lifebar")
        life3=game.add.sprite(earth.centerX, earth.centerY+290,"atlas.solarS","lifebar")
        
        shield1Proxy.anchor.setTo(0.5)
        shield2Proxy.anchor.setTo(0.5)
        shield3Proxy.anchor.setTo(0.5)
        
        life1.anchor.setTo(0.5)
        life2.anchor.setTo(0.5)
        life3.anchor.setTo(0.5)
        
        shield1Proxy.alpha=0
        shield2Proxy.alpha=0
        shield3Proxy.alpha=0
        
        chargingIcon1=game.add.sprite(life1.x+20,life1.y-35,"atlas.solarS","electricity");
        chargingIcon1.anchor.setTo(0.5)
        
        chargingIcon2=game.add.sprite(life2.x-15,life2.y-35,"atlas.solarS","electricity");
        chargingIcon2.anchor.setTo(0.5)
        
        chargingIcon3=game.add.sprite(life3.x-10,life3.y+35,"atlas.solarS","electricity");
        chargingIcon3.anchor.setTo(0.5)
        
        earthGroup.add(chargingIcon1)
        earthGroup.add(chargingIcon2)
        earthGroup.add(chargingIcon3)
        
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
        
        
       
        
        earthGroup.add(life1)
        earthGroup.add(life2)
        earthGroup.add(life3)
        
        
        for(var fillLifes=0;fillLifes<lifes1.length;fillLifes++){
            lifes1[fillLifes]=game.add.graphics(-36 + 24*fillLifes, 0);
            lifes1[fillLifes].beginFill("0x00ff00");
            lifes1[fillLifes].drawCircle(0, 0, 17);
            //earthGroup.add(lifes1[fillLifes])
            life1.addChild(lifes1[fillLifes])
            
            lifes2[fillLifes]=game.add.graphics(-36 + 24*fillLifes,0);
            lifes2[fillLifes].beginFill("0x00ff00");
            lifes2[fillLifes].drawCircle(0, 0, 17);
            //earthGroup.add(lifes2[fillLifes])
            life2.addChild(lifes2[fillLifes])
            
            lifes3[fillLifes]=game.add.graphics(-36 + 24*fillLifes,0);
            lifes3[fillLifes].beginFill("0x00ff00");
            lifes3[fillLifes].drawCircle(0, 0, 17);
            life3.addChild(lifes3[fillLifes])
            //earthGroup.add(lifes3[fillLifes])
        }
            
        life1.rotation=0.5
        life2.rotation=-0.5
        life3.rotation=91.10
        
        earthGroup.add(shield1Proxy)
        earthGroup.add(shield2Proxy)
        earthGroup.add(shield3Proxy)
        
        earthGroup.scale.setTo(0.8)
        
        shield1=game.add.spine(earth.centerX+80, earth.centerY-160,"shieldS")
        shield1.setSkinByName("normal");
        shield1.rotation=0.5
        shield1.setAnimationByName(0,"IDLE",true)
        
        shield2=game.add.spine(earth.centerX-90, earth.centerY-160,"shieldS")
        shield2.setSkinByName("normal");
        shield2.rotation=-0.5
        shield2.setAnimationByName(0,"IDLE",true)
        
        shield3=game.add.spine(earth.centerX, earth.centerY+180,"shieldS")
        shield3.setSkinByName("normal");
        shield3.rotation=91.10
        shield3.setAnimationByName(0,"IDLE",true)
        
        earthGroup.add(shield1)
        earthGroup.add(shield2)
        earthGroup.add(shield3)
        
        explo1=game.add.sprite(-100,-100,"explo")
        explo1.anchor.setTo(0.5,0.5);
        explo1.animations.add('explo');
        
        
        
        //Meteor proxy
        for(var filling=0; filling<meteorsProxy.length;filling++){
            meteorsProxy[filling]=game.add.sprite(0,0,"atlas.solarS","shield")
            meteorsProxy[filling].anchor.setTo(0.5)
            meteorsProxy[filling].scale.setTo(0.5)
            meteorsProxy[filling].alpha=0
            meteors[filling]=game.add.spine(0,0,"meteors")
            meteors[filling].setSkinByName("normal");
            meteors[filling].scale.setTo(1)
            meteors[filling].alpha=0
            meteors[filling].setAnimationByName(0,"IDLE",true)
        
        }
        
        var rect2 = new Phaser.Graphics(game)
        rect2.beginFill(0x000000)
        rect2.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect2.alpha = 0
        rect2.endFill()
        rect2.inputEnabled = true
        rect2.events.onInputDown.add(stopEarth, this);
        backgroundGroup.add(rect2)
        
    }
    
    
    function stopEarth(obj){
        /*if(activateEarth){
            activateEarth=false
        }else if(!activateEarth){
            activateEarth=true
        }*/
        currentDirection *=-1
    }
    
    function enemyGenerator(enemys,enemysActive,enemyTween, howMuch, speed, params){
        params = params || {}
        var destinyX=params.destinyX || game.world.centerX
        var destinyY=params.destinyY || game.world.centerY
        var where=0;
        var generate=game.rnd.integerInRange(0,9);
        if(howMany<howMuch){
            if(where==0){
                

                while(enemysActive[generate]==true){
                    generate=game.rnd.integerInRange(0,9);
                }
                
                if(enemysActive[generate]==false){
                    meteors[generate].alpha=1
                    sound.play("falling")
                    meteors[generate].setAnimationByName(0,"IDLE",true)
                    enemys[generate].position.x=game.rnd.integerInRange(100,game.world.width-100);
                    enemys[generate].position.y=-200;
                    meteors[generate].angle= (Math.atan2(destinyY - enemys[generate].y, destinyX - enemys[generate].x) * 180 / Math.PI)-90;
                    
                    enemyTween[generate]=game.add.tween(enemys[generate]).to({x:destinyX,y:destinyY},speed,Phaser.Easing.In,true);
                    enemysActive[generate]=true;
                    howMany++;
                }
            }
        }
    }
    

	//Monedas que van a algun lado

    function Coin(objectBorn,objectDestiny,time){
        
        
        //objectBorn= Objeto de donde nacen
        coins.x=objectBorn.centerX
        coins.y=objectBorn.centerY
        sound.play("explode")
        emitter = epicparticles.newEmitter("meteor")
        emitter.duration=0.05;
        emitter.x = coins.x
        emitter.y = coins.y
        explo1.position.x=emitter.x
        explo1.position.y=emitter.y
        explo1.animations.play('explo', 24, false);
        game.time.events.add(200,function(){
            explo1.y=-100
        })
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
            recoveryEnergy()
            for(var followMeteors=0; followMeteors<meteors.length;followMeteors++){
                
                meteors[followMeteors].position.x=meteorsProxy[followMeteors].x
                meteors[followMeteors].position.y=meteorsProxy[followMeteors].y+100
                
                
            }
            
            //if(activateEarth){
                
                earthGroup.rotation+=(0.03*currentDirection)
                if(earthGroup.angle>=359) earthGroup.angle=0
                if(earthGroup.angle<0){
                    earthGroup.angle+=360
                }
            //}
            
            earth2.angle +=0.5
        }
        
        
        for(var checkCols=0; checkCols<meteors.length; checkCols++){
            
            if (checkOverlap(shield1,meteorsProxy[checkCols]) && numLifes1>0){
                if(meteorsActive[checkCols]){

                    currentTimeCharge+=DELTA_TIME_CHARGE
                     howMany--
                     var temp=checkCols
                    Coin(shield1,pointsBar,100)
                    dificulty-=50;
                    meteorsActive[checkCols]=false
                    numLifes1--
                    meteors[temp].alpha=1
                    meteorsProxy[temp].position.y=-200
                    meteorsTween[checkCols].stop()
                     game.time.events.add(400,function(){
                         
                         temp=-10
                     })
                    if(numLifes1==3){
                        shield1.setAnimationByName(0,"HIT1",true)
                        lifes1[0].alpha=0
                    }
                    if(numLifes1==2){
                        shield1.setAnimationByName(0,"HIT2",true)
                        lifes1[1].alpha=0
                    }
                    if(numLifes1==1){
                        shield1.setAnimationByName(0,"HIT3",true)
                        lifes1[2].alpha=0
                    }
                    if(numLifes1==0){
                        lifes1[3].alpha=0
                        shield1.setAnimationByName(0,"LOSE",false)
                        game.time.events.add(600,function(){ 
                           shield1.setAnimationByName(0,"LOSESTILL",true) 
                        })
                    }
                }
            }
            if (checkOverlap(shield2,meteorsProxy[checkCols]) && numLifes2>0){
                
                 if(meteorsActive[checkCols]){
                    currentTimeCharge+=DELTA_TIME_CHARGE
                     howMany--
                    var temp=checkCols
                    numLifes2--
                    Coin(shield2,pointsBar,100)
                    dificulty-=50;
                    meteorsActive[checkCols]=false
                    meteorsTween[checkCols].stop()
                    meteors[temp].alpha=1
                    meteorsProxy[temp].position.y=-200
                    game.time.events.add(400,function(){ 
                         
                         temp=-10
                     })
                    if(numLifes2==3){
                        shield2.setAnimationByName(0,"HIT1",true)
                        lifes2[0].alpha=0
                    }
                    if(numLifes2==2){
                        shield2.setAnimationByName(0,"HIT2",true)
                        lifes2[1].alpha=0
                    }
                    if(numLifes2==1){
                        shield2.setAnimationByName(0,"HIT3",true)
                        lifes2[2].alpha=0
                    }
                    if(numLifes2==0){
                        lifes2[3].alpha=0
                        shield2.setAnimationByName(0,"LOSE",false)
                        game.time.events.add(600,function(){ 
                           shield2.setAnimationByName(0,"LOSESTILL",true) 
                        })
                    }
                }
                
            }
            if (checkOverlap(shield3,meteorsProxy[checkCols]) && numLifes3>0){
                
                if(meteorsActive[checkCols]){
                    currentTimeCharge+=DELTA_TIME_CHARGE
                    howMany--
                    var temp=checkCols
                    numLifes3--
                    Coin(shield3,pointsBar,100)
                    dificulty-=50;
                    meteorsActive[checkCols]=false
                    meteors[temp].alpha=1
                    meteorsProxy[temp].position.y=-200
                    meteorsTween[checkCols].stop()
                     game.time.events.add(400,function(){
                         temp=-10
                     })
                    if(numLifes3==3){
                        shield3.setAnimationByName(0,"HIT1",true)
                        lifes3[0].alpha=0
                    }
                    if(numLifes3==2){
                        shield3.setAnimationByName(0,"HIT2",true)
                        lifes3[1].alpha=0
                    }
                    if(numLifes3==1){
                        shield3.setAnimationByName(0,"HIT3",true)
                        lifes3[2].alpha=0
                    }
                    if(numLifes3==0){
                        lifes3[3].alpha=0
                        shield3.setAnimationByName(0,"LOSE",false)
                        game.time.events.add(600,function(){
                           shield3.setAnimationByName(0,"LOSESTILL",true)
                        })
                    }
                }
                
            }
            if (checkOverlap(earth,meteorsProxy[checkCols]) && meteorsActive[checkCols]){
                
                missPoint()
                
                howMany--
                var temp=checkCols
                meteorsActive[checkCols]=false
                meteorsTween[checkCols].stop()
                sound.play("explode")
                meteors[temp].alpha=0
                meteorsProxy[temp].position.y=-200
                earth2.tint="0xff0000"
                emitter2 = epicparticles.newEmitter("meteor")
                emitter2.duration=0.08;
                emitter2.x = meteors[temp].x
                emitter2.y = meteors[temp].y
                explo1.position.x=emitter2.x
                explo1.position.y=emitter2.y
                explo1.animations.play('explo', 24, false);
                game.time.events.add(200,function(){
                    explo1.y=-100
                })
                game.time.events.add(400,function(){ 
                    temp=-10
                })
                game.time.events.add(50,function(){ 
                    earth2.tint="0xaaaaaa"
                    game.time.events.add(200,function(){ 
                        earth2.tint="0xffffff"
                    })
                })
            }
            
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
        if(earthGroup.angle>=69 && earthGroup.angle<=223 && numLifes1>=0 && numLifes1<4){
             if(!charged1){
                chargingIcon1.time = game.time.now + currentTimeCharge
                chargingIcon1.alpha=1;
                charged1 = true
            }
            else if(game.time.now > chargingIcon1.time){
                numLifes1++
                sound.play("energy")
                //chargingIcon1.alpha=1;
                chargingTween1.isPaused=false;
                
                if(numLifes1==1){
                    lifes1[3].alpha=1
                    shield1.setAnimationByName(0,"HIT3",true)
                    //charged1=true
                }else if(numLifes1==2){
                    lifes1[2].alpha=1
                    shield1.setAnimationByName(0,"HIT2",true)
                    //charged1=true
                }else if(numLifes1==3){
                    shield1.setAnimationByName(0,"HIT1",true)
                    lifes1[1].alpha=1
                    //charged1=true
                }
                if(numLifes1==4){
                    shield1.setAnimationByName(0,"IDLE",true)
                    lifes1[0].alpha=1
                    //charged1=true
                }

                charged1 = false
            }
        }else if(earthGroup.angle>223){
            charged1=false
            chargingTween1.isPaused=true;
            chargingIcon1.alpha=0
        }

        if(earthGroup.angle>=135 && earthGroup.angle<=269 && numLifes2>=0 && numLifes2<4){
            if(!charged2){
                chargingIcon2.time = game.time.now + currentTimeCharge
                chargingIcon2.alpha=1;
                charged2 = true
            }
            else if(game.time.now > chargingIcon2.time){
                numLifes2++
                sound.play("energy")
                //chargingIcon2.alpha=1;
                chargingTween2.isPaused=false;
                if(numLifes2==1){
                    lifes2[3].alpha=1
                    shield2.setAnimationByName(0,"HIT3",true)
                    //charged2=true
                }else if(numLifes2==2){
                    lifes2[2].alpha=1
                    shield2.setAnimationByName(0,"HIT2",true)
                    //charged2=true
                }else if(numLifes2==3){
                    shield2.setAnimationByName(0,"HIT1",true)
                    lifes2[1].alpha=1
                   // charged2=true
                }
                if(numLifes2==4){
                    shield2.setAnimationByName(0,"IDLE",true)
                    lifes2[0].alpha=1
                    //charged2=true
                }
                charged2 = false
            }
        }else if(earthGroup.angle<135 || earthGroup.angle>269){
            charged2=false
            chargingTween2.isPaused=true;
            chargingIcon2.alpha=0
        }


        if((earthGroup.angle<=68 || earthGroup.angle>=297) && numLifes3>=0 && numLifes3<4){
            if(!charged3){
                chargingIcon3.time = game.time.now + currentTimeCharge
                chargingIcon3.alpha=1;
                charged3 = true
            }
            else if(game.time.now > chargingIcon3.time){
                numLifes3++
                sound.play("energy")
                chargingTween3.isPaused=false;
                if(numLifes3==1){
                    lifes3[3].alpha=1
                    shield3.setAnimationByName(0,"HIT3",true)
                   
                }else if(numLifes3==2){
                    lifes3[2].alpha=1
                    shield3.setAnimationByName(0,"HIT2",true)
                    
                }else if(numLifes3==3){
                    shield3.setAnimationByName(0,"HIT1",true)
                    lifes3[1].alpha=1
                    
                }
                if(numLifes3==4){
                    shield3.setAnimationByName(0,"IDLE",true)
                    lifes3[0].alpha=1
                    
                }
                charged3 = false
            }
        }else if(earthGroup.angle>68 && earthGroup.angle<297){
            charged3=false
            chargingTween3.isPaused=true;
            chargingIcon3.alpha=0
        }
        
        
    }
    
    function reset(){
            
            
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
        particle.makeParticles('atlas.solarS',key);
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

				particle.makeParticles('atlas.solarS',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.solarS','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.solarS','smoke');
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
		name: "solarShieldSquad",
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