var soundsPath = "../../shared/minigames/sounds/"


var leakTweak = function(){
    

	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/leakTweak/atlas.json",
                image: "images/leakTweak/atlas.png"
            },
            {
                name: "atlas.time",
                json: "images/leakTweak/timeAtlas.json",
                image: "images/leakTweak/timeAtlas.png"
            },

        ],
        images: [
            {   name:"tutorial_image",
                file: "images/leakTweak/tutorial_image.png"}
		],
		sounds: [
            {	name: "pop",
                file: soundsPath + "pop.mp3"},
		    {	name: "snapshot",
				file: soundsPath + "snapshot.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "right",
				file: soundsPath + "rightChoice.mp3"},
            {   name: "magic",
                //file: soundsPath + "gameLose.mp3"},
                file: soundsPath + "magic.mp3"},
            {   name: "gameLose",
                //file: soundsPath + "magic.mp3"}
                file: soundsPath + "gameLose.mp3"},
            {
                name: 'gameSong',
                file: soundsPath + 'songs/upbeat_casual_8.mp3'
                }

            
        ],
        spines:[
            {
                name:'tomiko',
                file:'images/spines/Tomiko/tomiko.json'
            },
            {
                name:'faucet',
                file:'images/spines/Faucet/faucet.json'
            }

		]
    }

    var NUM_LIFES = 3
    var INITIAL_TIME = 2000
    var DELTA_TIME = 50
    var MIN_TIME = 1000
    var LEVLES_TO_TIMER = 6

    var DELTA_BUTTON = 170

    var INIT_FAUCET_TIME = 1600
    var DELTA_FAUCET = 100
    var MIN_FAUCET_TIME = 1000

    var INIT_VEL = 5
    var DELTA_VEl = 0.1
    var MIN_VEL = 2

    var BULLET_VEL = 10
    
    var lives
	var sceneGroup = null
    var gameIndex = 163
    var tutoGroup
    var backgroundSound
    var timeValue
    var numPoints
    var gameGroup
    var heartsGroup
    var pointsBar
    var gameActive

    var timeOn = false
    var clock, tweenTiempo, timeBar

    var inTutorial
    var hand

    var currentLevel = 0
    var currentTime
    var correctParticle

   var tomikoSpine
   var offfaucetGroup
   var onfaucetGroup

    var currentTimeFaucet
    var currentVel

    var bulletsGroup
    var canTouch

    var time
    var fromPause

    var water
    var deltaWater
    var stopByTutorial
    var tutorialCounts

    var handTimeout
    var offFaunces 

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = NUM_LIFES
        numPoints = 0

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
       
        currentTime = INITIAL_TIME

        currentLevel = 0
        timeOn = false
        gameActive = false
        stopByTutorial = false

        inTutorial = 0
        currentTimeFaucet = INIT_FAUCET_TIME

        currentVel = INIT_VEL
        canTouch = false

        fromPause = false

        inTutorial = 0
        tutorialCounts = 0
        offFaunces = 0
        loadSounds()
        
	}

    function preload(){
        game.stage.disableVisibilityChange = false;

        game.load.spritesheet("coin", 'images/leakTweak/coin.png', 122, 123, 12)
        game.load.spritesheet("water", 'images/spines/water.png', 566, 594, 12)

    }

    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.game','hearts')

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

    function createPointsBar(){

        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)

        var pointsImg = pointsBar.create(-10,10,'atlas.game','xpcoins')
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
    
    function createPart(atlas,key){

        var particles = game.add.emitter(0, 0, 100);

        particles.makeParticles(atlas,key);
        particles.minParticleSpeed.setTo(-200, -50);
        particles.maxParticleSpeed.setTo(200, -100);
        particles.minParticleScale = 0.2;
        particles.maxParticleScale = 1;
        particles.gravity = 150;
        particles.angularDrag = 30;

        return particles
    }

    function positionTimer(){
      clock=game.add.image(game.world.centerX-150,40,"atlas.time","clock")
      clock.scale.setTo(.7)
      timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
      timeBar.scale.setTo(8,.45)
      sceneGroup.add(clock)
      sceneGroup.add(timeBar)
      timeBar.alpha=1
      clock.alpha=1
    }

    function stopTimer(){
        if(tweenTiempo){
          tweenTiempo.stop()
      }
      tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, 500, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
      })
    }

    function startTimer(time){
       tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
       tweenTiempo.onComplete.add(function(){
           //missPoint()
           stopTimer()
           //canPlant=false
           win = false
           evaluateApple()
       })
    }

    function Coin(objectBorn,objectDestiny,time){
       
       
       //objectBorn= Objeto de donde nacen
       coins.x=objectBorn.centerX
       coins.y=objectBorn.centerY
       
       /*var emitter = epicparticles.newEmitter("pickedEnergy")
       emitter.duration=1;
       emitter.x = coins.x
       emitter.y = coins.y*/

       correctParticle.x = objectBorn.x
        correctParticle.y = objectBorn.y
        correctParticle.start(true, 1000, null, 5)

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

    function stopGame(){
        gameActive = false
        backgroundSound.stop()
        inputsEnabled = false
        
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 750)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, numPoints, gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
            sound.play("gameLose")
		})
    }

    function addNumberPart(obj,number){

        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)

        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.Linear.none,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.Linear.none,true,500)

        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

    }

    function addPoint(number){

        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        numPoints++
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        addNumberPart(pointsBar.text,'+' + number)

    }
    
    function missPoint(){
        /*if(water.destination < (game.world.height-450)){
            water.destination = (game.world.height - 450)
        }
        else{*/
            water.destination-=deltaWater
        //}
        sound.play("wrong")
        
        lives--;
        heartsGroup.text.setText('X ' + lives)

        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        addNumberPart(heartsGroup.text,'-1')

        stopTouch = true
        
        if(lives === 0){
            tomikoSpine.setAnimationByName(0,'lose',true)

            stopGame(false)
        }
        else{
            //nextRound()
        }
        
        // addNumberPart(batteryGroup,'-1')
    }
    


    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height
        inputsEnabled = true
        setRound()

    }
    
    function update() {

        if(water.destination < water.y){
            water.y -= 10
        }

        if(!gameActive){
            return
        }

        if(!stopByTutorial){
            //console.log(time,game.time.now)
            if(time < game.time.now){
                if(fromPause){
                    //console.log(currentTime)
                    fromPause = false
                    time = game.time.now + currentTimeFaucet
                }
                else{
                    getFaucet()
                }
            }
        }
        else{
            
        }

        
        updateOpenFaucet()
        updateCloseFaucet()
        

        updateTouch()
        updateBullet()
        
    }

    function updateHand(){
        hand.loadTexture('atlas.game','handDown')
        handTimeout = setTimeout(function(){
            hand.loadTexture('atlas.game','handUp')
            handTimeout = setTimeout(updateHand,500)
        },500)
    }


    function updateOpenFaucet(){
        for(var i = 0; i < onfaucetGroup.length; i++){
            if(onfaucetGroup.children[i].visible){
                if(!stopByTutorial){
                    onfaucetGroup.children[i].y += currentVel
                    if(tutorialCounts<3){
                        if(onfaucetGroup.children[i].y>=tomikoSpine.y-20 && !onfaucetGroup.children[i].collision.blocked){
                            stopByTutorial = true
                            hand.visible = true
                            updateHand()
                        }
                    }
                }
                
                checkBulletCollision(onfaucetGroup.children[i].collision)
                if(onfaucetGroup.children[i].y>game.world.height+100){
                    onfaucetGroup.children[i].visible = false
                    if(!onfaucetGroup.children[i].collision.blocked){
                        missPoint()
                    }
                }
            }
        }
    }

    function updateCloseFaucet(){
        for(var i = 0; i < offfaucetGroup.length; i++){
            if(offfaucetGroup.children[i].visible){
                //console.log(offfaucetGroup.children[i].y)
                if(!stopByTutorial){
                    offfaucetGroup.children[i].y += currentVel
                }
                checkBulletCollision(offfaucetGroup.children[i])
                if(offfaucetGroup.children[i].y>game.world.height+100){
                    offfaucetGroup.children[i].visible = false
                }
            }
        }
    }

    function checkBulletCollision(object){
        for(var i = 0; i< bulletsGroup.length; i++){
            if(bulletsGroup.children[i].visible){
                if(bulletsGroup.children[i].y > (object.world.y - (object.height/2)) && bulletsGroup.children[i].y < (object.world.y + (object.height/2))){
                    if(bulletsGroup.children[i].x > (object.world.x - (object.width/2)) && bulletsGroup.children[i].x < (object.world.x + (object.width/2))){
                        bulletsGroup.children[i].visible = false
                        if(object.type){
                            //collision to correct fauce
                            if(!object.blocked){
                                object.spine.setAnimationByName(0,'block',false)
                                object.blocked = true
                                Coin(object.parent,pointsBar,100)
                                tutorialCounts ++
                                if(tutorialCounts<4){
                                    time = game.time.now + currentTimeFaucet
                                    //console.log(time,game.time.now,currentTime)
                                }

                                stopByTutorial = false
                                hand.visible = false
                                clearTimeout(handTimeout)
                            }
                        }
                        else{
                            missPoint()
                            //collision to wrong face
                        } 
                    }
                }
            }
        }
    }



    function updateTouch(){
        if(tutorialCounts<3){
            if(!stopByTutorial){
                return
            }
        }
        if(game.input.activePointer.isDown){
            if(canTouch){
                canTouch = false
                getBullet()
            }
        }
        else{
            canTouch = true
        }
    }

    function updateBullet(){
         for(var i = 0; i< bulletsGroup.length; i++){
            if(bulletsGroup.children[i].visible){
                bulletsGroup.children[i].x -=BULLET_VEL
                 if(bulletsGroup.children[i].x < 0){
                    bulletsGroup.children[i].visible = false
                 }
            }
         }
    }

    function getBullet(){
        tomikoSpine.setAnimationByName(0,'shoot',false)
        tomikoSpine.addAnimationByName(0,'idle',true)
        for(var i = 0; i< bulletsGroup.length; i++){
            if(!bulletsGroup.children[i].visible){
                bulletsGroup.children[i].visible = true
                bulletsGroup.children[i].x = tomikoSpine.x-60
                //bulletsGroup.children[i].y = tomikoSpine.y-40
                return
            }
        }

        var bullet = game.add.graphics(tomikoSpine.x-60,tomikoSpine.y-40)
        bullet.beginFill(0xf761ff)
        bullet.drawCircle(0,0,20)
        bulletsGroup.add(bullet)

        

    }

    function createTutorial(){
        
        tutoGroup = game.add.group()

        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

        
    }


    function setRound(){
        gameActive = true
        time = game.time.now + 200
        canTouch = true
    }

    

    function evalTutorial(){
        
    }

    function getFaucet(){

        if(!gameActive || game.sound.mute){
            return
        }



        var open = game.rnd.integerInRange(0,1)

        if(inTutorial < 5){
            if(inTutorial ==1 || inTutorial==3){
                open = 1
            }
            else{
                if(inTutorial==4){
                    currentTimeFaucet = 2500
                }
                open = 0
            }
            inTutorial ++


        }

        if(offFaunces>2){
            open = 0
        }

        if(open==0){
            offFaunces = 0
            getOpenFaucet()
        }
        else{
            offFaunces++
            getCloseFaucet()
        }   

        if(currentTimeFaucet>MIN_FAUCET_TIME){
            currentTimeFaucet-=DELTA_FAUCET
        }
        //setTimeout(getFaucet,currentTimeFaucet)
        time = game.time.now + currentTimeFaucet
    }

    function getOpenFaucet(){
        for(var i = 0; i < onfaucetGroup.length; i++){
            if(!onfaucetGroup.children[i].visible){
                onfaucetGroup.children[i].visible = true

                onfaucetGroup.children[i].y = -200
                var r = game.rnd.integerInRange(0,2)
                var letter
                if(r == 0){
                    letter = 'a'
                }
                else if(r == 1){
                    letter = 'b'
                }
                else{
                    letter = 'c'
                }
                onfaucetGroup.children[i].setSkinByName('faucet_'+letter)
                onfaucetGroup.children[i].setAnimationByName(0,'idle',true)
                onfaucetGroup.children[i].collision.blocked = false
                onfaucetGroup.children[i].collision.loadTexture('atlas.game','faucet_'+letter+'_shade',0,false)
                return
            }
        }

        var faucet = game.add.spine(40,-200,'faucet')
        onfaucetGroup.add(faucet)
        //faucet.type = true
        
        var r = game.rnd.integerInRange(0,2)
        var letter
        if(r == 0){
            letter = 'a'
        }
        else if(r == 1){
            letter = 'b'
        }
        else{
            letter = 'c'
        }
        faucet.setSkinByName('faucet_'+letter)
        faucet.setAnimationByName(0,'idle',true)
        var collision = game.add.sprite(15,-10,'atlas.game','faucet_'+letter+'_shade')
        collision.anchor.setTo(0.5)
        faucet.addChild(collision)
        faucet.collision = collision
        collision.alpha = 0
        collision.type = true
        collision.blocked = false
        collision.spine = faucet
    }

    function getCloseFaucet(){
        for(var i = 0; i < offfaucetGroup.length; i++){
            if(!offfaucetGroup.children[i].visible){
                offfaucetGroup.children[i].visible = true
                offfaucetGroup.children[i].y = -200
                var r = game.rnd.integerInRange(0,2)
                var letter
                if(r == 0){
                    letter = 'a'
                }
                else if(r == 1){
                    letter = 'b'
                }
                else{
                    letter = 'c'
                }
                offfaucetGroup.children[i].loadTexture('atlas.game','faucet_'+letter+'_shade',0,false)
                return
            }
        }

        var r = game.rnd.integerInRange(0,2)
        var letter
        if(r == 0){
            letter = 'a'
        }
        else if(r == 1){
            letter = 'b'
        }
        else{
            letter = 'c'
        }
        var faucet = offfaucetGroup.create(70,-200,'atlas.game','faucet_'+letter+'_shade')
        faucet.anchor.setTo(0.5)
        faucet.type = false
    }

    function createScene(){
        //yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        var backgroundTop = game.add.graphics(0,0)
        backgroundTop.beginFill(0xfffc6f)
        backgroundTop.drawRect(0,0,game.world.width,game.world.centerY)
        backgroundTop.endFill()
        sceneGroup.add(backgroundTop)

        var backgroundDown = game.add.graphics(0,0)
        backgroundDown.beginFill(0xe3dd00)
        backgroundDown.drawRect(0,game.world.centerY,game.world.width,game.world.centerY)
        backgroundDown.endFill()
        sceneGroup.add(backgroundDown)


        var floor = game.add.tileSprite(0,game.world.height,game.world.width,160,'atlas.game','floor')
        floor.anchor.setTo(0,1)
        sceneGroup.add(floor)


        var brickTile = game.add.tileSprite(0,game.world.height-130,game.world.width,game.world.centerY-200,'atlas.game','bricks')
        brickTile.anchor.setTo(0,1)
        sceneGroup.add(brickTile)


        var tub = sceneGroup.create(game.world.centerX,game.world.height-320,'atlas.game','tub')
        tub.anchor.setTo(0.5)

        var curtain = sceneGroup.create(game.world.centerX-50,game.world.centerY-120,'atlas.game','curtain')
        curtain.anchor.setTo(0.5)
        var curtain_2 = sceneGroup.create(game.world.centerX-250,game.world.centerY-120,'atlas.game','curtain')
        curtain_2.anchor.setTo(0.5)

        var ligthbulb = sceneGroup.create(game.world.centerX+200,game.world.centerY-250,'atlas.game','ligthbulb')
        ligthbulb.anchor.setTo(0.5)

    
        var plattform = sceneGroup.create(game.world.width,game.world.centerY+50,'atlas.game','platform')    
        plattform.anchor.setTo(1,0.5)


        tomikoSpine = game.add.spine(plattform.x-90 , plattform.y - 25, 'tomiko')
        tomikoSpine.setSkinByName('normal')
        tomikoSpine.setAnimationByName(0,'idle',true)
        sceneGroup.add(tomikoSpine)

        onfaucetGroup = game.add.group()
        sceneGroup.add(onfaucetGroup)

        offfaucetGroup = game.add.group()
        sceneGroup.add(offfaucetGroup)

        bulletsGroup = game.add.group()
        sceneGroup.add(bulletsGroup)

        backgroundSound = game.add.audio('gameSong')
        game.sound.setDecodedCallback(backgroundSound, function(){
            backgroundSound.loopFull(0.6)
        }, this);
        
        game.onPause.add(function(){
            gameActive = false
            game.sound.mute = true
        } , this);

        game.onResume.add(function(){
            
            fromPause = true
            game.sound.mute = false
            gameActive = true
        }, this);


        water=game.add.sprite(game.world.centerX,game.world.height, "water")
        water.anchor.setTo(0.5,0)
        water.animations.add('water');
        water.animations.play('water', 24, true);
        water.destination = game.world.height
        sceneGroup.add(water)
        //deltaWater = (water.y - plattform.y)/2
        deltaWater = water.height/3
        if(game.world.width>water.width){
            water.scale.setTo(game.world.width/water.width,1)
        }

        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0

        initialize()

        createPointsBar()
        createHearts()
        
        correctParticle = createPart('atlas.game','star')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)

        hand = sceneGroup.create(game.world.centerX,game.world.centerY,'atlas.game','handUp')
        hand.anchor.setTo(0.5)
        hand.visible = false

        createTutorial()
    
    }
    
	return {
		assets: assets,
		name: "leakTweak",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()
