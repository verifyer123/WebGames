var soundsPath = "../../shared/minigames/sounds/"


var artTwist = function(){
    

	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/artTwist/atlas.json",
                image: "images/artTwist/atlas.png"
            },
            {
                name: "atlas.time",
                json: "images/artTwist/timeAtlas.json",
                image: "images/artTwist/timeAtlas.png"
            },

        ],
        images: [
            {   name:"tutorial_image",
                file: "images/artTwist/tutorial_image.png"}
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
                name:'sorceress',
                file:'images/spines/sorceress/sorceress.json'
            },
            {
                name:'theffanie',
                file:'images/spines/theffanie/theffanie.json'
            },

		]
    }

    var NUM_LIFES = 3
    var INITIAL_TIME = 12000
    var DELTA_TIME = 500
    var MIN_TIME = 5000
    var LEVLES_TO_TIMER = 3

    var DELTA_BUTTON = 170
    var X_SPACES = 3
    var Y_SPACES = 3
    var IMAGE_SIZE = 512
    var DELTA_QUAD = Math.round(IMAGE_SIZE/X_SPACES)
    
    var IMAGE_NAMES = ["picture_ball","picture_bunny","picture_doll","picture_portrait","picture_shoes","picture_yoyo"]

    var lives
	var sceneGroup = null
    var gameIndex = 173
    var tutoGroup
    var backgroundSound
    var timeValue
    var numPoints
    var gameGroup
    var heartsGroup
    var pointsBar

    var timeOn = false
    var clock, tweenTiempo, timeBar

    var inTutorial
    var hand

    var currentLevel = 0
    var currentTime
    var correctParticle

    var theffanieSpine
    var sorceressSpine

    var imageGroup
    var correctImage 

    var magic 
    var currentImageId
    var currentTutorialObject
    var tutorialTween

    var canTouch

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

        inTutorial = 0
        currentImageId = 0

        canTouch = false

        loadSounds()
        
	}

    function preload(){
        game.stage.disableVisibilityChange = false;

        game.load.spritesheet("coin", 'images/artTwist/coin.png', 122, 123, 12)
        game.load.spritesheet("magic", 'images/spines/magic.png', 700, 513, 12)
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
        if(tweenTiempo!=null){
          tweenTiempo.stop()
      }
      tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, 500, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
      })
      canTouch = false
      

    }

    function startTimer(time){
       tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
       tweenTiempo.onComplete.add(function(){
            missPoint()

            if(lives>0){
                theffanieSpine.setAnimationByName(0,"wrong",false)
                theffanieSpine.addAnimationByName(0,"idle",true)
            }
            else{
                theffanieSpine.setAnimationByName(0,"lose",false)
            }

            stopTimer()

            setTimeout(setRound,1000)
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
        
    }

    

    function createTutorial(){
        
        tutoGroup = game.add.group()

        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

        
    }




    function setRound(){
        game.add.tween(sorceressSpine).to({x:game.world.width+100},1000,Phaser.Easing.linear,true)
        if(currentLevel!=0){
            var id = game.rnd.integerInRange(0,IMAGE_NAMES.length-1)
            if(id == currentImageId){
                console.log("same image")
                id++
                if(id>IMAGE_NAMES.length-1){
                    id==0
                }
            }
            currentImageId = id
            correctImage.loadTexture("atlas.game",IMAGE_NAMES[currentImageId],0,false)
        }
        magic.visible = true
        magic.play("magic",8,false)
        
        

        
    }

    function startRound(){
        sorceressSpine.x = -150
        magic.visible = false
        if(currentLevel!=0){
            for(var i = 0; i < imageGroup.length; i++){
                imageGroup.children[i].loadTexture("atlas.game",IMAGE_NAMES[currentImageId],0,false)
                imageGroup.children[i].angle = 90 * game.rnd.integerInRange(0,3)
            }
        }

        if(inTutorial!=-1){
            updateHandTutorial()

            for(var i = 0; i < imageGroup.length; i++){
                if(imageGroup.children[i].angle!=0){
                    hand.x = imageGroup.children[i].x
                    hand.y = imageGroup.children[i].y 
                    currentTutorialObject = imageGroup.children[i]
                    break
                }
            }
        }

        imageGroup.visible = true

        if(currentLevel>=LEVLES_TO_TIMER){
            if(!timeOn){
                timeOn = true
                positionTimer()
            }
            startTimer(currentTime)

            if(currentTime > MIN_TIME){
                currentTime-=DELTA_TIME
            }
        }

        currentLevel++

        canTouch = true
    }

    function clickImage(button){

        if(!canTouch){
            return
        }
        if(inTutorial!=-1){
            if(currentTutorialObject != button){
                return
            }
        }

        button.angle +=90
        if(button.angle == 360 || button.angle == 0){
            button.angle = 0
            evaluateImage()
        }
    }

    function evaluateImage(){
        var finish = true
        for(var i = 0; i < imageGroup.length; i++){
            if(imageGroup.children[i].angle!=0){
                finish = false
                break
            }
        }

        if(finish){
            Coin(correctImage,pointsBar,100)
            theffanieSpine.setAnimationByName(0,"good",false)
            theffanieSpine.addAnimationByName(0,"idle",true)
            imageGroup.visible = false
            setTimeout(setRound,1000)
            canTouch = false
            if(timeOn){
                stopTimer()
            }

            if(inTutorial!=-1){
                clearTimeout(tutorialTween)
                hand.visible = false
                inTutorial = -1
            }
        }
        else if(inTutorial!=-1){
            for(var i = 0; i < imageGroup.length; i++){
                if(imageGroup.children[i].angle!=0){
                    hand.x = imageGroup.children[i].x
                    hand.y = imageGroup.children[i].y 
                    currentTutorialObject = imageGroup.children[i]
                    break
                }
            }
        }

    }

    function updateHandTutorial(){
        hand.visible = true
        hand.loadTexture("atlas.game","handDown",0,false)
        tutorialTween = setTimeout(function(){
            hand.loadTexture("atlas.game","handUp",0,false)
            tutorialTween = setTimeout(updateHandTutorial,300)
        },300)
    }

    function createBackground(){

        var background = game.add.tileSprite(0,0,game.world.width,game.world.height-200,"atlas.game","wall")
        backgroundGroup.add(background)

        var windows = game.add.tileSprite(0,150,game.world.width,100,"atlas.game","windows")
        backgroundGroup.add(windows)
        var numCandles = 5
        var deltaCandle = 150
        var initX = game.world.centerX - ((numCandles-1)/2)*deltaCandle

        for(var i = 0; i < numCandles; i++){
            var candles = game.add.sprite(initX+(i*deltaCandle),80,"atlas.game","candles")
            candles.anchor.setTo(0.5)
            backgroundGroup.add(candles)
        }

        var floor =  game.add.tileSprite(0,game.world.height,game.world.width,200,"atlas.game","floor")
        floor.anchor.setTo(0,1)
        backgroundGroup.add(floor)

        currentImageId = game.rnd.integerInRange(0,IMAGE_NAMES.length-1)

        correctImage = sceneGroup.create(game.world.centerX,game.world.centerY,"atlas.game",IMAGE_NAMES[currentImageId])
        correctImage.anchor.setTo(0.5)

        imageGroup = game.add.group()
        sceneGroup.add(imageGroup)

        

        var initX = game.world.centerX - (((X_SPACES)/2)*DELTA_QUAD) +(DELTA_QUAD/2)
        var initY = game.world.centerY - (((Y_SPACES)/2)*DELTA_QUAD) +(DELTA_QUAD/2)
        for(var i = 0; i < X_SPACES; i ++ ){
            for(var j = 0; j < Y_SPACES; j++){
                var image  = imageGroup.create(initX+ (DELTA_QUAD*i),initY +(DELTA_QUAD*j),"atlas.game",IMAGE_NAMES[currentImageId])
                image.anchor.setTo(0.5)
                image.crop(new Phaser.Rectangle(DELTA_QUAD*i,DELTA_QUAD*j,DELTA_QUAD,DELTA_QUAD),false)
                image.angle = game.rnd.integerInRange(0,3) * 90
                image.inputEnabled = true
                image.events.onInputDown.add(clickImage,this)
                image.updateCrop()
            }
        }
        imageGroup.visible = false

        theffanieSpine = game.add.spine(150,game.world.height-60, "theffanie")
        sceneGroup.add(theffanieSpine)
        theffanieSpine.scale.setTo(0.5)
        theffanieSpine.setSkinByName("normal")
        theffanieSpine.setAnimationByName(0,"idle",true)

        sorceressSpine = game.add.spine(-150,game.world.centerY-200,"sorceress")
        sceneGroup.add(sorceressSpine)
        //sorceressSpine.scale.setTo(0.5)
        sorceressSpine.setSkinByName("normal")
        sorceressSpine.setAnimationByName(0,"idle",true)

        magic = game.add.sprite(game.world.centerX,game.world.centerY,"magic")
        magic.anchor.setTo(0.5)
        anim = magic.animations.add("magic")
        anim.onComplete.add(startRound,this)
        magic.visible = false

        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0

        hand = sceneGroup.create(0,0,'atlas.game','handUp')
        hand.anchor.setTo(0.5)
        hand.visible = false
    }

    function createScene(){

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)


        backgroundSound = game.add.audio('gameSong')
        game.sound.setDecodedCallback(backgroundSound, function(){
            backgroundSound.loopFull(0.6)
        }, this);
        
        game.onPause.add(function(){
            game.sound.mute = true
        } , this);

        game.onResume.add(function(){
            game.sound.mute = false
        }, this);


        createBackground()

        initialize()

        createPointsBar()
        createHearts()
        
        correctParticle = createPart('atlas.game','star')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)

       

        createTutorial()
    
    }
    
	return {
		assets: assets,
		name: "artTwist",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()
