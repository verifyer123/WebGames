var soundsPath = "../../shared/minigames/sounds/"


var spatialOverdrive = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?"
		}
	}
    

	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/spatialOverdrive/atlas.json",
                image: "images/spatialOverdrive/atlas.png"
            },
            {
                name: "atlas.time",
                json: "images/spatialOverdrive/timeAtlas.json",
                image: "images/spatialOverdrive/timeAtlas.png"
            },

        ],
        images: [
            /*{   name:"tutorial_image",
                file: "images/spatialOverdrive/tutorial_image_movil.png"}*/
            {
                name:'tutorial_image',
                file:"images/spatialOverdrive/tutorial_image_%input.png"
            }
		],
		sounds: [
            {	name: "pop",
                file: soundsPath + "pop.mp3"},
		    {	name: "changePlanet",
				file: soundsPath + "inflateballoon.mp3"},
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
                file: soundsPath + 'songs/space_music.mp3'
                }

            
        ],
        spines:[
            {
                name:'board',
                file:'images/spines/board/board.json'
            },
            {
                name:'interface',
                file:'images/spines/interface/interface.json'
            },
            {
                name:'planets',
                file:'images/spines/planets/planets.json'
            }
		]
    }

    var NUM_LIFES = 3
    var INITIAL_TIME = 10000
    var DELTA_TIME = 500
    var MIN_TIME = 2000
    var LEVLES_TO_TIMER = 5
    var TIME_DELAY_SHOW = 2000
    
    var lives
	var sceneGroup = null
    var gameIndex = 166
    var tutoGroup
    var backgroundSound
    var timeValue
    var numPoints
    var gameGroup
    var heartsGroup
    var pointsBar

    var timeOn = false
    var clock, tweenTiempo, timeBar

    var currentLevel = 0
    var currentTime
    var correctParticle

    var planetArray
    var spinePlanetArray = ['mercury','venus','earth','mars','saturn','jupiter','uranus','neptune']

    var currentId

    var planetText 

    var planets
    var helperPlanet
    var correctAnswer
    var leftButton
    var rightButton
    var okButton

    var inShow


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
        canTouch = false

        inTutorial = 0

        inShow = true

        var lang = localization.getLanguage()

        if(lang == "ES"){
            planetArray = ["MERCURY ","VENUS","EARTH","MARS","SATURN","JUPITER","URANUS","NEPTUNE"]
        }
        else{
            planetArray = ["MERCURIO","VENUS","TIERRA","MARTE","SATURNO","JUPITER","URANO","NEPTURNO"]
        }

        currentId = 0

        //numberArray = ["ONE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGTH","NINE"]

        loadSounds()
        
	}

    function preload(){
        game.stage.disableVisibilityChange = false;

        game.load.spritesheet("coin", 'images/spatialOverdrive/coin.png', 122, 123, 12)



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
        setTimeout(evaluateShowPlanet,TIME_DELAY_SHOW)
    }

    function evaluateShowPlanet(){
        //clickButton(1)
        if(currentId==spinePlanetArray.length-1){
            inShow = false
            setRandomPlanet()
            
            return
        }
        sound.play('changePlanet')
        game.add.tween(planets).to({x:-200},600,Phaser.Easing.linear,true)
        game.add.tween(helperPlanet).to({x:game.world.centerX},600,Phaser.Easing.linear,true).onComplete.add(function(){
            var temp = planets
            planets = helperPlanet
            helperPlanet = temp
            helperPlanet.x = game.world.width+200
            if(currentId<spinePlanetArray.length-1){
                clickButton(1)
                helperPlanet.setSkinByName(spinePlanetArray[currentId+1])
                helperPlanet.setToSetupPose();
            }
            setTimeout(evaluateShowPlanet,TIME_DELAY_SHOW)
        })
    }


    function setRandomPlanet(){
        if(inTutorial!=-1){
            hand.visible = true
            hand.x = rightButton.x+50
            hand.y = rightButton.y+50
            evalTutorial()
        }
        sound.play('changePlanet')
        okButton.alpha = 1
        leftButton.alpha = 1
        rightButton.alpha = 1

        planetText.setText(planetArray[0])
        currentId = 0
        correctAnswer = game.rnd.integerInRange(0,planetArray.length-1)
        helperPlanet.setSkinByName(spinePlanetArray[correctAnswer])
        helperPlanet.setToSetupPose();
        game.add.tween(planets).to({x:-200},600,Phaser.Easing.linear,true)
        game.add.tween(helperPlanet).to({x:game.world.centerX},600,Phaser.Easing.linear,true).onComplete.add(function(){
            var temp = planets
            planets = helperPlanet
            helperPlanet = temp
            helperPlanet.x = game.world.width+200
        })

        currentLevel++

        if(currentLevel> LEVLES_TO_TIMER){
            if(!timeOn){
                positionTimer()
                timeOn = true
            }
            if(currentTime<MIN_TIME){
                currentTime -=DELTA_TIME
            }

            startTimer(currentTime)
        }
    }


    function evalTutorial(){
        if(inTutorial !=-1){
            hand.loadTexture('atlas.game','handDown',0,false)
            setTimeout(function(){
                hand.loadTexture('atlas.game','handUp',0,false)
                setTimeout(evalTutorial,500)
            },500)
        }
    }

    

    function clickButton(direction){
        if(leftButton.alpha==0.5 && !inShow){
            return
        }
        if(currentId == 0 && direction ==-1){
            currentId = planetArray.length-1
        }
        else if(currentId == planetArray.length-1 && direction == 1){
            currentId = 0
        }
        else{
            currentId += direction
        }

        if(inTutorial!=-1 && !inShow){
            if(currentId < correctAnswer){
                hand.x = rightButton.x+50
                hand.y = rightButton.y+50
            }
            else if(currentId > correctAnswer){
                hand.x = leftButton.x+50
                hand.y = leftButton.y+50
            }
            else{
                hand.x = okButton.x+50
                hand.y = okButton.y+50
            }
        }

        planetText.setText(planetArray[currentId])

    }

    function clickOk(){
        if(okButton.alpha==0.5){
            return
        }

        if(inTutorial!=-1){
            if(currentId != correctAnswer){
                return
            }
        }
        sound.play('pop')
        inTutorial = -1
        hand.visible = false

        okButton.alpha = 0.5
        leftButton.alpha = 0.5
        rightButton.alpha = 0.5

        okButton.loadTexture('atlas.game','Ok_push')


        if(timeOn){
            stopTimer()
        }

        if(currentId == correctAnswer){
            Coin(planets,pointsBar,100)
        }
        else{
            missPoint()
        }

        if(lives>0){
            setTimeout(setRandomPlanet,300)
        }
    }

    
    function createScene(){

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)
        initialize()

        var background = game.add.sprite(game.world.centerX, game.world.centerY, 'atlas.game','fondo')
        background.anchor.setTo(0.5)
        sceneGroup.add(background)

        var w = game.world.width/background.width
        var h = game.world.height/background.height


        planets = game.add.spine(game.world.centerX,game.world.centerY-100,'planets')
        planets.setSkinByName(spinePlanetArray[0])
        planets.setAnimationByName(0,'idle',true)
        sceneGroup.add(planets)

        helperPlanet = game.add.spine(game.world.width+200,game.world.centerY-100,'planets')
        helperPlanet.setSkinByName(spinePlanetArray[1])
        helperPlanet.setAnimationByName(0,'idle',true)
        sceneGroup.add(helperPlanet)

        var board = game.add.spine(game.world.centerX,game.world.centerY,'board')
        board.setSkinByName('normal')
        board.setAnimationByName(0,'idle',true)
        sceneGroup.add(board)

        if(w >1 || h >1){
            if(w>h){
                background.scale.setTo(w,w)
            }else{
                background.scale.setTo(h,h)
            }
        }

        var interface = game.add.spine(game.world.centerX,game.world.centerY-100,'interface')
        interface.setSkinByName('normal')
        interface.setAnimationByName(0,'idle',true)
        sceneGroup.add(interface)



        var base = sceneGroup.create(game.world.centerX,game.world.centerY+400,'atlas.game','base')
        base.anchor.setTo(0.5)

        var monitor = sceneGroup.create(game.world.centerX,game.world.centerY+300,'atlas.game','monitor')
        monitor.anchor.setTo(0.5)

        leftButton = sceneGroup.create(monitor.x - 220, monitor.y+20, 'atlas.game','skip_off')
        leftButton.anchor.setTo(0.5)
        leftButton.inputEnabled = true
        leftButton.events.onInputDown.add(function(){
            if(!inShow){
                if(leftButton.alpha==1){
                    leftButton.loadTexture('atlas.game','skip_push')
                }
                clickButton(-1)
                sound.play('pop')
            }
        },this)
        leftButton.events.onInputUp.add(function(){

            leftButton.loadTexture('atlas.game','skip_off')
        },this)
        leftButton.alpha = 0.5

        rightButton = sceneGroup.create(monitor.x + 220, monitor.y+20, 'atlas.game','skip_off')
        rightButton.anchor.setTo(0.5)
        rightButton.scale.setTo(-1,1)
        rightButton.inputEnabled = true
        rightButton.events.onInputDown.add(function(){
            if(!inShow){
                if(rightButton.alpha==1){
                    rightButton.loadTexture('atlas.game','skip_push')
                }
                clickButton(1)

                sound.play('pop')
            }
        },this)
        rightButton.events.onInputUp.add(function(){
            rightButton.loadTexture('atlas.game','skip_off')
        },this)
        rightButton.alpha = 0.5

        okButton = sceneGroup.create(monitor.x , monitor.y+110, 'atlas.game','Ok_off')
        okButton.anchor.setTo(0.5)
        okButton.inputEnabled = true
        okButton.events.onInputDown.add(clickOk,this)
        okButton.events.onInputUp.add(function(){
            okButton.loadTexture('atlas.game','Ok_off')
        },this)

        okButton.alpha = 0.5

        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        planetText = new Phaser.Text(sceneGroup.game, monitor.x, monitor.y, planetArray[currentId], fontStyle)
        planetText.anchor.setTo(0.5)
    
        sceneGroup.add(planetText)
        
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


        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0

        

        createPointsBar()
        createHearts()
        
        correctParticle = createPart('atlas.game','star')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)

        hand = sceneGroup.create(0,0,'atlas.game','handUp')
        hand.anchor.setTo(0.5)
        hand.visible = false

        createTutorial()
    
    }
    
	return {
		assets: assets,
		name: "spatialOverdrive",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()
