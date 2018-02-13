
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var smokeBusters = function(){
    
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
                name: "atlas.smoke",
                json: "images/smoke/atlas.json",
                image: "images/smoke/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/smoke/timeAtlas.json",
                image: "images/smoke/timeAtlas.png",
            },
             {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }

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
				file: soundsPath + "inflateballoon.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "absorb",
				file: soundsPath + "gameLose.mp3"},
            
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 112
	var indexGame
    var overlayGroup
    var spaceSong
    
    var clouds=new Array(10)
    var fakeClouds=new Array(10)
    var Luna
    var pollution=new Array(3)
    var pollutionAbsorb=new Array(3)
    var pollutionSkin=new Array(3)
    var pollutionCanKill=new Array(3)
    var way=new Array(3)
    
    var distanciaMin
    var scaleSpine
    var startGame
    var character
    var inGround
	var timing
    var controles
    
    var contHeight
    var limite
    var soundButton
    var block1, block2
    var actualVelocity
    var muerto
    var dificulty
    var rndEnemies
    var moveSound
    var btnOn
    var sndActive
    var speed
    var pollutionActive
    var finishLoad
    var next=1
    var rightBar,leftBar, botonAspirar
    var runningAnim
    var Left, Right
    var backG, change, city
    var startingColor
    var endingColor
    var unlockHit
    var windowSmoke1, windowSmoke2, windowSomke3
    var coins=new Array(2)
    var correctNumber
    var correctNumber2
    var empezoReal
    var counterSmoke
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        startGame=true
        game.stage.backgroundColor = "#E8BE8B"
        lives = 3
        counterSmoke=lives;
        next=1
        contHeight=0
        finishLoad=true 
        empezoReal=false
        runningAnim=false
        correctNumber=-1
        gameActive = true
        correctNumber2=-1
        dificulty=1
        rndEnemies=0
        timing=0
        actualVelocity=1000
        scaleSpine=.5
        inGround=true
        unlockHit=true
        change=false
        startingColor="0xE8BE8B"
        endingColor="0x7FCDEE"
        sndActive=true
        muerto=false
        Left=false
        Right=false
        pollutionActive=false
        loadSounds()
        speed=1
        limite=game.world.height
        
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
    
    function tweenTint(obj, startColor, endColor, time, delay, callback) {
        // check if is valid object
        time = time || 250
        delay = delay || 0

        if (obj) {
            // create a step object
            var colorBlend = { step: 0 };
            // create a tween to increment that step from 0 to 100.
            var colorTween = game.add.tween(colorBlend).to({ step: 100 }, time, Phaser.Easing.Linear.None, delay);
            // add an anonomous function with lexical scope to change the tint, calling Phaser.Colour.interpolateColor
            colorTween.onUpdateCallback(function () {
                obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
            })
            // set object to the starting colour
            obj.tint = startColor;
            // if you passed a callback, add it to the tween on complete
                colorTween.onComplete.add(function(){
                    change=false
                    if(startingColor=="0xE8BE8B"){
                        startingColor="0x7FCDEE"
                        endingColor="0x49364A"
                    }else if(startingColor=="0x7FCDEE"){
                        startingColor="0x49364A"
                        endingColor="0xE8BE8B"
                    }else{
                        startingColor="0xE8BE8B"
                        endingColor="0x7FCDEE"
                    }
                });
            // finally, start the tween
            colorTween.start();
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
        counterSmoke--;
        console.log(counterSmoke)
        if(counterSmoke==2)
        {
            game.add.tween(windowSmoke1).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, true, 1300)
        }
        else if(counterSmoke==1)
        {
            game.add.tween(windowSmoke2).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, true, 1300)
        }
        else if(counterSmoke==0)
        {
            game.add.tween(windowSmoke3).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, true, 1300)
        } 
        
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            character.body.velocity.y = 0;
            character.body.acceleration.set(0);
            inGround=true;
            startGame=false
            muerto=true
            luna.setAnimationByName(0,"LOSE",false);
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.smoke','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.smoke','life_box')

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
        //luna.setAnimationByName(0,"LOSE",false);
        gameActive = false
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
            game.world.setBounds(0,0,game.world.width, game.world.height);
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
        
    
    function preload(){
        
		//buttons.getImages(game)
        
		
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('spaceSong', soundsPath + 'songs/childrenbit.mp3');
        
        game.load.image("back","images/smoke/BG.png")
        
        game.load.spine('luna', "images/Spine/Luna/luna.json");
        game.load.spine('pollutionAnim', "images/Spine/Clouds/clouds.json");
        
		/*game.load.image('howTo',"images/smoke/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/smoke/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/smoke/introscreen.png")*/
        
        
        game.load.spritesheet("pollution1", 'images/smoke/polu1.png', 286, 250, 24)
        game.load.spritesheet("pollution2", 'images/smoke/polu2.png', 384, 256, 24)
        game.load.spritesheet("pollution3", 'images/smoke/polu3.png', 284, 224, 24)
        game.load.spritesheet("coin", 'images/Spine/coin/coin.png', 122, 123, 12)
		
		game.load.image('tutorial_image',"images/smoke/tutorial_image.png")
        //loadType(gameIndex)

        
        
        
        //Creamos las fisicas del proyecto
        
        game.physics.startSystem(Phaser.Physics.ARCADE)
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        createTutorialGif(overlayGroup,onClickPlay)
        
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
                startGame=true
                city.alpha=1
                backG.alpha=1
				overlayGroup.y = -game.world.height
                empezoReal=true
            })
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX,game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.smoke','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'Movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.smoke',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.smoke','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
        startGame=true
        city.alpha=1
        backG.alpha=1
        overlayGroup.y = -game.world.height
        empezoReal=true
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        
		backgroundGroup = game.add.group()
        gameGroup=game.add.group()
        UIGroup=game.add.group()
        sceneGroup.add(backgroundGroup)
        sceneGroup.add(gameGroup)
        sceneGroup.add(UIGroup)
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        
        backGrect = new Phaser.Graphics(game)
        backGrect.beginFill(0xE8BE8B)
        backGrect.drawRect(0,0,game.world.width *2, game.world.height *2)
        backGrect.alpha = 1
        backGrect.endFill()
        backGrect.inputEnabled = true
        backgroundGroup.add(backGrect)
        
        windowSmoke1=game.add.sprite(0,0,"atlas.smoke","smoke1")
        windowSmoke2=game.add.sprite(0,0,"atlas.smoke","smoke2")
        windowSmoke3=game.add.sprite(0,0,"atlas.smoke","smoke3")
        
        windowSmoke1.anchor.setTo(0.5,0.5)
        windowSmoke2.anchor.setTo(0.5,0.5)
        windowSmoke3.anchor.setTo(0.5,0.5)
        

        
        windowSmoke1.position.x=game.world.centerX
        windowSmoke1.position.y=game.world.centerY
        windowSmoke2.position.x=game.world.centerX
        windowSmoke2.position.y=game.world.centerY
        windowSmoke3.position.x=game.world.centerX
        windowSmoke3.position.y=game.world.centerY
        
        windowSmoke1.scale.setTo(game.world.width/500,1)
        windowSmoke2.scale.setTo(game.world.width/500,1)
        windowSmoke3.scale.setTo(game.world.width/500,1)
        
        sceneGroup.add(windowSmoke1)
        sceneGroup.add(windowSmoke2)
        sceneGroup.add(windowSmoke3)
        
        
        windowSmoke1.alpha=0
        windowSmoke2.alpha=0
        windowSmoke3.alpha=0
        
        backG = new Phaser.Graphics(game)
        backG.beginFill(0xffffff)
        backG.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        backG.alpha = 1
        backG.endFill()
        backgroundGroup.add(backG)
        city=game.add.image(game.world.centerX-500,game.world.centerY-200,"atlas.smoke","CITY")
        backgroundGroup.add(city)
        city.alpha=0
        backG.alpha=0
        
        
        leftBar=gameGroup.create(0,0,'atlas.smoke','button')
        leftBar.alpha=0
        leftBar.width=game.world.width/2
        leftBar.height=game.world.height
        leftBar.tag="leftBar"
        leftBar.inputEnabled=true
        
        rightBar=gameGroup.create(game.world.centerX,0,'atlas.smoke','button')
        rightBar.alpha=0
        rightBar.width=game.world.width/2
        rightBar.height=game.world.height-200
        rightBar.tag="rightBar"
        rightBar.inputEnabled=true
        
        leftBar.events.onInputDown.add(onClick,this)
        rightBar.events.onInputDown.add(onClick,this)
        leftBar.events.onInputUp.add(onRelease,this)
        rightBar.events.onInputUp.add(onRelease,this)
       
        
         luna = gameGroup.game.add.spine(0,0, "luna");
         
         luna.scale.setTo(scaleSpine,scaleSpine)
         luna.setSkinByName("normal");
         luna.setAnimationByName(0,"JUMP",false) 
         gameGroup.add(luna)
        for(var b=0; b<4;b++){
            way[b]=false
        }
        
        
        
        character=gameGroup.create(game.world.centerX, game.world.centerY-300,'atlas.smoke','LUNA')
        character.scale.setTo(scaleSpine)
        character.anchor.setTo(.5)
        character.alpha=0
        game.physics.enable(character, Phaser.Physics.ARCADE)
        character.body.onCollide = new Phaser.Signal();    
        character.body.onCollide.add(withClouds, this);
        character.checkWorldBounds = true;
        character.body.checkCollision.top = false;
        character.body.checkCollision.left = false;
        character.body.checkCollision.right = false;
        //game.physics.arcade.gravity.y = 100;
        
        
        //Coins
        for(var putingCoins=0;putingCoins<coins.length;putingCoins++){
            coins[putingCoins]=game.add.sprite(luna.x,luna.y, "coin")
            coins[putingCoins].anchor.setTo(.5)
            coins[putingCoins].scale.setTo(.5)
            coins[putingCoins].animations.add('coin');
            coins[putingCoins].animations.play('coin', 24, true);
            coins[putingCoins].alpha=0
        }
        
        
        pollutionAbsorb[0]= backgroundGroup.game.add.spine(0,0, "pollutionAnim");
        pollutionAbsorb[0].scale.setTo(scaleSpine)
        pollutionAbsorb[0].setSkinByName("normal");
        pollutionAbsorb[0].setAnimationByName(0,"LOSE",true)
        pollutionAbsorb[0].alpha=0
        backgroundGroup.add(pollutionAbsorb[0])
        
        pollutionAbsorb[1]= backgroundGroup.game.add.spine(0,0, "pollutionAnim");
        pollutionAbsorb[1].scale.setTo(scaleSpine)
        pollutionAbsorb[1].setSkinByName("normal2");
        pollutionAbsorb[1].setAnimationByName(0,"LOSE",true)
        pollutionAbsorb[1].alpha=0
        backgroundGroup.add(pollutionAbsorb[1])
        
        pollutionAbsorb[2]= backgroundGroup.game.add.spine(0,0, "pollutionAnim");
        pollutionAbsorb[2].scale.setTo(scaleSpine)
        pollutionAbsorb[2].setSkinByName("normal1");
        pollutionAbsorb[2].setAnimationByName(0,"LOSE",true)
        pollutionAbsorb[2].alpha=0
        backgroundGroup.add(pollutionAbsorb[2])
        
        
        for(var fill=0; fill<10;fill++){
            
            if(fill!=0){
            clouds[fill]=gameGroup.create(game.rnd.integerInRange(100,game.world.width-200), game.world.centerY+contHeight*-300,'atlas.smoke','CLOUD')
            fakeClouds[fill]=false
            
            clouds[fill].tag=fill
            backgroundGroup.add(clouds[fill])
            game.physics.enable(clouds[fill], Phaser.Physics.ARCADE)
            clouds[fill].body.immovable=true
            clouds[fill].body.bounce.set(.1);
            clouds[fill].body.checkCollision.down = false;
            clouds[fill].body.checkCollision.right= false;
            clouds[fill].body.checkCollision.left = false;
            contHeight++
            if(rndEnemies==0 && fill==5){
                pollution[rndEnemies]=game.add.sprite(0,clouds[5].y-200,'atlas.smoke','POLLUTION1')
                pollutionSkin[rndEnemies]=game.add.sprite(pollution[rndEnemies].x,pollution[rndEnemies].y, "pollution1")
                pollutionSkin[rndEnemies].scale.setTo(scaleSpine)
                pollutionSkin[rndEnemies].anchor.setTo(.5)
                pollutionSkin[rndEnemies].animations.add('idle');
                pollutionSkin[rndEnemies].animations.play('idle', 24, true);
                gameGroup.add(pollutionSkin[rndEnemies])
                game.physics.enable(pollution[rndEnemies], Phaser.Physics.ARCADE)
                pollution[rndEnemies].alpha=0
                pollution[rndEnemies].scale.setTo(.5)
                pollution[rndEnemies].anchor.setTo(.5)
                pollution[rndEnemies].tag="pollution"
                pollutionCanKill[rndEnemies]=true
                rndEnemies++
            }
            if(rndEnemies==1 && fill==7){
                pollution[rndEnemies]=game.add.sprite(game.rnd.integerInRange(0,game.world.width),clouds[6].y-200,'atlas.smoke','POLLUTION2')
                pollutionSkin[rndEnemies]=game.add.sprite(pollution[rndEnemies].x,pollution[rndEnemies].y, "pollution2")
                pollutionSkin[rndEnemies].scale.setTo(scaleSpine)
                pollutionSkin[rndEnemies].anchor.setTo(.5)
                pollutionSkin[rndEnemies].animations.add('idle');
                pollutionSkin[rndEnemies].animations.play('idle', 24, true);
                game.physics.enable(pollution[rndEnemies], Phaser.Physics.ARCADE)
                gameGroup.add(pollutionSkin[rndEnemies])
                pollution[rndEnemies].alpha=0
                pollution[rndEnemies].scale.setTo(.5)
                pollution[rndEnemies].anchor.setTo(.5)
                pollution[rndEnemies].tag="pollution"
                pollutionCanKill[rndEnemies]=true
                rndEnemies++
            }
                
            if(rndEnemies==2 && fill==9){
                pollution[rndEnemies]=game.add.sprite(game.rnd.integerInRange(0,game.world.width),clouds[8].y-200,'atlas.smoke','POLLUTION3')
                pollutionSkin[rndEnemies]=game.add.sprite(pollution[rndEnemies].x,pollution[rndEnemies].y, "pollution3")
                pollutionSkin[rndEnemies].scale.setTo(scaleSpine)
                pollutionSkin[rndEnemies].anchor.setTo(.5)
                pollutionSkin[rndEnemies].animations.add('idle');
                pollutionSkin[rndEnemies].animations.play('idle', 24, true);
                game.physics.enable(pollution[rndEnemies], Phaser.Physics.ARCADE)
                gameGroup.add(pollutionSkin[rndEnemies])
                pollution[rndEnemies].alpha=0 
                pollution[rndEnemies].scale.setTo(.5)
                pollution[rndEnemies].anchor.setTo(.5)
                pollution[rndEnemies].tag="pollution"
                pollutionCanKill[rndEnemies]=true
                rndEnemies++
            }
            
            }else{
            clouds[fill]=gameGroup.create(character.x-50, character.y+300,'atlas.smoke','CLOUD')
            game.physics.enable(clouds[fill], Phaser.Physics.ARCADE)
            fakeClouds[fill]=true
            clouds[fill].tag=fill
            clouds[fill].body.immovable=true
            clouds[fill].body.bounce.set(.1);
            clouds[fill].body.checkCollision.down = false;
            clouds[fill].body.checkCollision.right= false;
            clouds[fill].body.checkCollision.left = false;
            contHeight++
            }
	       }
        
        btnOn=sceneGroup.create(0, 0,'atlas.smoke','audio_on')
        btnOn.scale.setTo(.5)
        btnOn.inputEnabled=true
        btnOn.events.onInputDown.add(OnSound,this)
        sceneGroup.add(btnOn)
        
        botonAspirar=sceneGroup.create(game.world.width-100,game.world.height-100,'atlas.smoke','asp_on')
        botonAspirar.inputEnabled=true
        botonAspirar.tag="suck"
        botonAspirar.events.onInputDown.add(onClick,this)
        botonAspirar.events.onInputUp.add(onRelease,this)
        
         //clouds
                
        for(var spongy=0;spongy<clouds.length;spongy++){
            clouds[spongy].anchor.setTo(0.5,0.5)
            game.add.tween(clouds[spongy].scale).to({x:1.2, y:1.2}, (1000), Phaser.Easing.Cubic.Out, true).yoyo(true).loop(true)
        }
        contHeight=9
        finishLoad=true
        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        controles2=game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		controles2.onDown.add(space, this)
    }
    
            function right(){
                
                character.position.x+=8
                luna.scale.setTo(scaleSpine,scaleSpine)
                
            }
    
            function left(){
                character.position.x-=8
                luna.scale.setTo(-scaleSpine,scaleSpine)
            }
    
    
         
    function space(){
    
      sound.play("shoot")
      if(unlockHit){  
        for(var h=0; h<3;h++){
            
            if(character.y-200<pollution[h].y  && (character.x<pollution[h].x+200 && character.x>pollution[h].x-200)){
                var number=h
                unlockHit=false
                pollutionCanKill[number]=false
                luna.setAnimationByName(0,"SUCK",false);
                
                    pollutionAbsorb[number].alpha=1
                    pollutionSkin[number].alpha=0
                    
                    
                    if(pollutionCanKill[number]==false){
                            if(correctNumber==-1){
                            correctNumber=1
                            game.add.tween(coins[correctNumber]).to({alpha:1}, 100, Phaser.Easing.Cubic.In, true,100)
                            game.add.tween(coins[correctNumber]).to({x:character.centerX,y:character.centerY-100},900,Phaser.Easing.inOut,true).onComplete.add(function(){
                            game.add.tween(coins[correctNumber]).to({x:pointsBar.x,y:pointsBar.y-30},200,Phaser.Easing.inOut,true)
                            game.add.tween(coins[correctNumber]).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100).onComplete.add(function(){
                                coins[correctNumber].x=luna.x
                                coins[correctNumber].y=luna.y
                                addPoint(1)
                                correctNumber=-1
                                })
                            })
                            }else if(correctNumber!=-1 && correctNumber2==-1){
                                correctNumber2=1
                                game.add.tween(coins[correctNumber2]).to({alpha:1}, 100, Phaser.Easing.Cubic.In, true,100)
                                game.add.tween(coins[correctNumber2]).to({x:character.centerX,y:character.centerY-100},900,Phaser.Easing.inOut,true).onComplete.add(function(){
                                game.add.tween(coins[correctNumber2]).to({x:pointsBar.centerX,y:pointsBar.centerY},200,Phaser.Easing.inOut,true)
                                game.add.tween(coins[correctNumber2]).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100).onComplete.add(function(){
                                    coins[correctNumber2].x=luna.x
                                    coins[correctNumber2].y=luna.y
                                    addPoint(1)
                                    correctNumber2=-1
                                    })
                                })
                            }
                            correctParticle.position.x=character.position.x+50
                            correctParticle.position.y=character.position.y
                            
                            if(counterSmoke==2 && (pointsBar.number+1)%5==0 &&  pointsBar.number>1)
                            {
                                game.add.tween(windowSmoke1).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
                                counterSmoke++
                            }
                            else if(counterSmoke==1 && (pointsBar.number+1)%5==0 &&  pointsBar.number>1)
                            {
                                game.add.tween(windowSmoke2).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
                                counterSmoke++
                            }
                            else if(counterSmoke==0 && (pointsBar.number+1)%5==0 &&  pointsBar.number>1)
                            {
                                game.add.tween(windowSmoke3).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
                                counterSmoke++
                            } 
                            
                            correctParticle.start(true, 1000, null, 5)
                    }
                //pollution[number].setAnimationByName(0,"DIE",true);
                var timed=game.add.tween(pollution[number]).to({x:character.x,y:character.y}, 50 , Phaser.Easing.Linear.In, true, 100).onComplete.add(function(){
                    pollution[number].kill();
                    unlockHit=true
                    pollutionAbsorb[number].alpha=0
                    pollutionSkin[number].alpha=1
                    
                
                
                         if(next==1){
                            next=9
                        }else if(next==9){
                            next=7
                        }else if(next==7){
                            next=5
                        }else if(next==5){
                            next=3
                        }else if(next==3){
                            next=1
                        }  
                    
                    pollution[number].reset(game.rnd.integerInRange(100,game.world.width-200), clouds[next].y-900)
                    pollutionCanKill[number]=true
                    speed+=0.5
                  })  
            }
            
        }
      }
    }
    
    function reset(){
        
        speed=.5
        
    }
    
    function onClick(obj){
        
        if(obj.tag=="rightBar"){
            Right=true
        } 
        if(obj.tag=="leftBar"){
            Left=true
        }
        if(obj.tag=="suck"){    
            
            obj.loadTexture("atlas.smoke","asp_off")
            sound.play("shoot")
            if(unlockHit){
                for(var h=0; h<3;h++){

                    if(character.y-200<pollution[h].y  && (character.x<pollution[h].x+200 && character.x>pollution[h].x-200)){

                        unlockHit=false
                        luna.setAnimationByName(0,"SUCK",false);
                        var number=h

                        game.add.tween(this).to({x:0}, 200 , Phaser.Easing.Linear.In, true, 100).onComplete.add(function(){
                    })
                            
                            pollutionAbsorb[number].alpha=1
                            pollutionSkin[number].alpha=0
                            pollutionCanKill[number]=false
                            if(pollutionCanKill[number]==false){
                                if(correctNumber==-1){
                                    correctNumber=1
                                    game.add.tween(coins[correctNumber]).to({alpha:1}, 100, Phaser.Easing.Cubic.In, true,100)
                                    game.add.tween(coins[correctNumber]).to({x:character.centerX,y:character.centerY-100},900,Phaser.Easing.inOut,true).onComplete.add(function(){
                                    game.add.tween(coins[correctNumber]).to({x:pointsBar.x,y:pointsBar.y-30},200,Phaser.Easing.inOut,true)
                                    game.add.tween(coins[correctNumber]).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100).onComplete.add(function(){
                                        coins[correctNumber].x=character.centerX
                                        coins[correctNumber].y=character.centerY
                                        addPoint(1)
                                        correctNumber=-1
                                        })
                                    })
                                    }else if(correctNumber!=-1 && correctNumber2==-1){
                                        correctNumber2=1
                                        game.add.tween(coins[correctNumber2]).to({alpha:1}, 100, Phaser.Easing.Cubic.In, true,100)
                                        game.add.tween(coins[correctNumber2]).to({x:character.centerX,y:character.centerY-100},900,Phaser.Easing.inOut,true).onComplete.add(function(){
                                        game.add.tween(coins[correctNumber2]).to({x:pointsBar.centerX,y:pointsBar.centerY},200,Phaser.Easing.inOut,true)
                                        game.add.tween(coins[correctNumber2]).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100).onComplete.add(function(){
                                            coins[correctNumber2].x=character.centerX
                                            coins[correctNumber2].y=character.centerY
                                            addPoint(1)
                                            correctNumber2=-1
                                            })
                                    })
                            }
                                    correctParticle.position.x=character.position.x+50
                                    correctParticle.position.y=character.position.y
                                    correctParticle.start(true, 1000, null, 5)
                            }
                        //pollution[number].setAnimationByName(0,"DIE",true);
                        var timed=game.add.tween(pollution[number]).to({x:character.x,y:character.y}, 50 , Phaser.Easing.Linear.In, true, 100).onComplete.add(function(){
                            pollution[number].kill();
                            unlockHit=true
                            pollutionAbsorb[number].alpha=0
                            pollutionSkin[number].alpha=1



                                 if(next==1){
                                    next=9
                                }else if(next==9){
                                    next=7
                                }else if(next==7){
                                    next=5
                                }else if(next==5){
                                    next=3
                                }else if(next==3){
                                    next=1
                                }  
                            console.log(next)

                            pollution[number].reset(game.rnd.integerInRange(100,game.world.width-200), clouds[next].y-900)
                            pollutionCanKill[number]=true
                            speed+=0.5
                          })  
                    }

                }
              }
            }
        }
    
    function onRelease(obj){
        if(obj.tag=="rightBar"){
            Right=false
        }
        if(obj.tag=="leftBar"){
            Left=false
        }
        if(obj.tag=="suck"){    
            obj.loadTexture("atlas.smoke","asp_on")
        }
        
    }
    
    function OnSound(obj){
        
        if(sndActive){
            sndActive=false
            spaceSong.stop()
            obj.loadTexture("atlas.smoke","audio_off")
        }else{
            sndActive=true
            spaceSong.play()
            obj.loadTexture("atlas.smoke","audio_on")
        }
        
    }
    
    
	function update(){
        //gravity
        if(startGame){
            
            if(empezoReal){
               if(lives<0){
                   lives=0
               }
                
                
               
                
                if(!change){
                        tweenTint(backG,startingColor,endingColor,10000,1000)
                        change=true
                }


                 if(correctNumber==-1){
                    coins[0].position.x=luna.x
                    coins[0].position.y=luna.y-50
                  }

                  if(correctNumber2==-1){
                    coins[1].position.x=luna.x
                    coins[1].position.y=luna.y-50
                  }

                pollutionAbsorb[0].x=pollution[0].x
                pollutionAbsorb[0].y=pollution[0].y

                pollutionAbsorb[1].x=pollution[1].x
                pollutionAbsorb[1].y=pollution[1].y

                pollutionAbsorb[2].x=pollution[2].x
                pollutionAbsorb[2].y=pollution[2].y

                //skin de las nubes

                for(var u=0; u<10;u++){

                    if(fakeClouds[u]){
                        clouds[u].loadTexture("atlas.smoke","FAKE")
                    }else{
                        clouds[u].loadTexture("atlas.smoke","CLOUD")
                    }



                }

                //parents
                game.world.setBounds(0,character.position.y-500,game.world.width, game.world.height);
                game.camera.follow(character)
                heartsGroup.position.x=game.camera.position.x
                heartsGroup.position.y=game.camera.position.y+10
                backG.position.x=game.camera.position.x
                backG.position.y=game.camera.position.y-20

                windowSmoke1.position.x=game.world.centerX
                windowSmoke1.position.y=game.world.centerY
                windowSmoke2.position.x=game.world.centerX
                windowSmoke2.position.y=game.world.centerY
                windowSmoke3.position.x=game.world.centerX
                windowSmoke3.position.y=game.world.centerY

                pointsBar.position.x=game.camera.position.x+game.world.width
                pointsBar.position.y=game.camera.position.y+10
                btnOn.position.x=game.camera.position.x+game.world.width-250
                btnOn.position.y=game.camera.position.y+10
                luna.position.x=character.x
                luna.position.y=character.y+80
                leftBar.position.x=game.camera.position.x
                leftBar.position.y=game.camera.position.y
                rightBar.position.x=game.camera.width/2
                rightBar.position.y=game.camera.position.y
                botonAspirar.position.x=game.camera.width-150
                botonAspirar.position.y=game.camera.y+game.camera.height-150
                pollutionSkin[0].position.x=pollution[0].x
                pollutionSkin[0].position.y=pollution[0].y
                pollutionSkin[1].position.x=pollution[1].x
                pollutionSkin[1].position.y=pollution[1].y
                pollutionSkin[2].position.x=pollution[2].x
                pollutionSkin[2].position.y=pollution[2].y

                if(character.y>limite){

                    inGround=null
                    character.body.velocity.y = 0;
                    character.body.acceleration.set(0);
                    startGame=false
                    character.position.y=character.position.y-300
                    inGround=true;
                    startGame=true
                    missPoint()
                    if(lives>0) reset()

                    //muerto=true
                }


                //Aqui se van las nubes
                for(var t=0; t<10;t++){
                    if(clouds[t].position.y>game.camera.y+1000){
                        clouds[t].kill();
                        clouds[t].reset(game.rnd.integerInRange(100,game.world.width-200), clouds[contHeight].y-300)
                        contHeight++
                        speed+=0.5
                        if(contHeight>9){
                        contHeight=0
                        }
                        limite=character.y+400
                    }
                }
                //Aqui se va la contaminaciòn
                for(var p=0; p<3;p++){


                    if(pollution[p].position.y>game.camera.y+1000){

                        pollution[p].kill();
                        pollution[p].reset(game.rnd.integerInRange(100,game.world.width-200), clouds[next].y-900)
                             if(next==1){
                                next=9
                            }else if(next==9){
                                next=7
                            }else if(next==7){
                                next=5
                            }else if(next==5){
                                next=3
                            }else if(next==3){
                                next=1
                            }
                            pollution[p].alpha=0
                            if(pollution[p].alpha==0){
                                missPoint()
                                console.log(next)
                                if(lives>0) reset()
                            }
                        }

                }

                //Aqui animamos las nubes malas

                    for(var z=0;z<3;z++){
                        if(pollution[z]!=null){
                            if(pollution[z].x>game.world.width-90){
                                way[z]=true
                                if(z!=1){
                                    pollution[z].scale.setTo(scaleSpine,scaleSpine)
                                    pollutionSkin[z].scale.setTo(scaleSpine,scaleSpine)
                                }else{
                                    pollution[z].scale.setTo(-scaleSpine,scaleSpine)
                                    pollutionSkin[z].scale.setTo(-scaleSpine,scaleSpine)
                                }
                            }else if(pollution[z].x<50){
                                way[z]=false
                                if(z!=1){
                                    pollution[z].scale.setTo(-scaleSpine,scaleSpine)
                                    pollutionSkin[z].scale.setTo(-scaleSpine,scaleSpine)
                                }else{
                                    pollution[z].scale.setTo(scaleSpine,scaleSpine)
                                    pollutionSkin[z].scale.setTo(scaleSpine,scaleSpine) 
                                }
                        }

                        if(!way[z]){
                            pollution[z].position.x+=speed
                        }else{
                            pollution[z].position.x-=speed
                        }

                        }
                    }


                if((controles.left.isDown|| Left) && character.position.x>0){
                left()

                }
                if((controles.right.isDown || Right) && character.position.x<game.world.width-100 ){
                right()

                }

                if(!inGround && !muerto){
                        character.body.acceleration.set(0,400);

                }

                if(inGround && !muerto){

                    timing++
                     character.body.acceleration.set(0,-600);


                    if(timing==50){
                        timing=0;
                        inGround=false
                    }
                }

             for(var fill2=0; fill2<10;fill2++){
                // clouds[fill2].position.y+=10
             }

                //Aqui checo las coliciones
                for(var collision=0; collision<10;collision++){
                    game.physics.arcade.collide(character,clouds[collision])
                }
                for(var collision2=0; collision2<3;collision2++){
                    game.physics.arcade.collide(character,pollution[collision2])
                }
            }
        }
	}
        
    function withClouds(obj,obj2){
            
           
            
            if(obj2.tag=="pollution" ){
                
                if(pollution[0]==obj2 && pollutionCanKill[0]){
                   obj2.kill();
                    obj2.reset(game.rnd.integerInRange(0,game.world.width-400),clouds[next].y-400)
                         if(next==1){
                            next=9
                        }else if(next==9){
                            next=7
                        }else if(next==7){
                            next=5
                        }else if(next==5){
                            next=3
                        }else if(next==3){
                            next=1
                        }
                        
                        missPoint() 
                        if(lives>0) reset()
                }
                if(pollution[1]==obj2 && pollutionCanKill[1]){
                   obj2.kill();
                    
                    obj2.reset(game.rnd.integerInRange(0,game.world.width-400),clouds[next].y-400)
                         if(next==1){
                            next=9
                        }else if(next==9){
                            next=7
                        }else if(next==7){
                            next=5
                        }else if(next==5){
                            next=3
                        }else if(next==3){
                            next=1
                        }  
                        
                        missPoint()
                        if(lives>0) reset()
                        
                }
                if(pollution[2]==obj2 && pollutionCanKill[2]){
                   obj2.kill();
                    
                    obj2.reset(game.rnd.integerInRange(0,game.world.width-400),clouds[next].y-400)
                          if(next==1){
                            next=9
                        }else if(next==9){
                            next=7
                        }else if(next==7){
                            next=5
                        }else if(next==5){
                            next=3
                        }else if(next==3){
                            next=1
                        }  
                        
                        missPoint()
                        if(lives>0) reset()
                }
            }
        
        if(character.body.velocity.y==0 && !inGround){
            inGround=true
            
            
//            if(game.stage.backgroundColor==8375790){
//                game.stage.backgroundColor = "#49364A"   
//            }else if(game.stage.backgroundColor==4798030){
//                game.stage.backgroundColor = "#E8BE8B"
//            }else{
//                game.stage.backgroundColor = "#7FCDEE"
//            }
            
            //Conevertidor background
            
//            colorChanger+=10000
//            colorChangerHex= colorChanger.toString(16);
//            console.log(colorChangerHex)
//            game.stage.backgroundColor = colorChangerHex
            
           
           
            luna.setAnimationByName(0,"JUMP",false) 
            
            
            if(fakeClouds[obj2.tag]){
                    
                    game.add.tween(obj2).to({alpha:0},500,Phaser.Easing.linear,true, 250).onComplete.add(function(){
                        obj2.kill(); 
                        obj2.reset(game.rnd.integerInRange(100,game.world.width-200), clouds[contHeight].y-300)
                        obj2.alpha=1
                        fakeClouds[obj2.tag]=game.rnd.integerInRange(0,1)
                        contHeight++
                        speed+=0.5
                        if(contHeight>9){
                        contHeight=0
                        }
                        limite=character.y+400
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
        particle.makeParticles('atlas.smoke',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.5;
        particle.maxParticleScale = 1;
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

				particle.makeParticles('atlas.smoke',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.smoke','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.smoke','smoke');
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
		name: "smokeBusters",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group()
			
            initialize()
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
            
            
            
			            
			createPointsBar()
			createHearts()
			
			
            
            
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()