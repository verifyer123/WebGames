var soundsPath = "../../shared/minigames/sounds/"


var treeNumbers = function(){
    
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
                json: "images/treeNumbers/atlas.json",
                image: "images/treeNumbers/atlas.png"
            },
            {
                name: "atlas.time",
                json: "images/treeNumbers/timeAtlas.json",
                image: "images/treeNumbers/timeAtlas.png"
            },

        ],
        images: [
            {   name:"tutorial_image",
                file: "images/treeNumbers/tutorial_image.png"}
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
                name:'estrella',
                file:'images/spines/estrella/estrella.json'
            }

		]
    }

    var NUM_LIFES = 3
    var INITIAL_TIME = 8000
    var DELTA_TIME = 500
    var MIN_TIME = 1000
    var LEVLES_TO_TIMER = 6

    var DELTA_BUTTON = 170

    
    var lives
	var sceneGroup = null
    var gameIndex = 162
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

    var buttonGroup
    var letreroText

    var apple

    var estrellaSpine

    var numberArray

    var correct

    var win
    var canTouch

    var inTutorial
    var hand

    var appleTween

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

        var lang = localization.getLanguage()

        if(lang == "ES"){
            numberArray = ["ONE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGHT","NINE"]
        }
        else{
            numberArray = ["UNO","DOS","TRES","CUATRO","CINCO","SEIS","SIETE","OCHO","NUEVE"]
        }
        //numberArray = ["ONE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGTH","NINE"]

        loadSounds()
        
	}

    function preload(){
        game.stage.disableVisibilityChange = false;

        game.load.spritesheet("coin", 'images/treeNumbers/coin.png', 122, 123, 12)

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
        correct = game.rnd.integerInRange(0,numberArray.length-1)
        apple.scale.setTo(0)
        apple.y = -100
        apple.angle = 0
        apple.text.setText(correct+1)

        game.add.tween(apple.scale).to({x:1,y:1},500,Phaser.Easing.linear,true).onComplete.add(function(){canTouch=true})

        var indexCorrectButton = game.rnd.integerInRange(0,2)

        var temp = numberArray.slice()
        //console.log(temp[correct])
        buttonGroup.children[indexCorrectButton].text.setText(temp[correct])
        var temptext = temp[correct]
        
        temp.splice(correct,1)
        buttonGroup.children[indexCorrectButton].correct = true
        for(var i =0; i < buttonGroup.length; i++){
            if(indexCorrectButton == i){
                continue
            }
            else{
                var r = game.rnd.integerInRange(0,temp.length-1)
                buttonGroup.children[i].text.setText(temp[r])
                temp.splice(r,1)
                buttonGroup.children[i].correct = false
            }
        }

        currentLevel++

        if(currentLevel>LEVLES_TO_TIMER){
            /*if(!timeOn){
                timeOn = true
                console.log("Position timer")
                positionTimer()
            }*/

            if(currentTime>MIN_TIME){
                currentTime -=DELTA_TIME
            }


            var randomAngle = game.rnd.integerInRange(-80,80)
            appleTween = game.add.tween(apple).to({y:350,angle:randomAngle},currentTime,Phaser.Easing.linear,true)
            appleTween.onComplete.add(endTimeApple)
            appleTween.randomAngle = randomAngle

            //startTimer(currentTime)
            letreroText.setText("")
        }
        else{
            letreroText.setText(temptext)
        }

        if(inTutorial!=-1){
            evalTutorial()
        }
        if(currentLevel<4){
            hand.visible = true
            //console.log('hand')
            hand.x = buttonGroup.children[indexCorrectButton].world.x+50
            hand.y = buttonGroup.children[indexCorrectButton].world.y+50
        }
    }

    function endTimeApple(){
        canTouch = false
        win = false
        evaluateApple()
    }

    function evalTutorial(){
        if(currentLevel>=4){
            return
        }
        hand.loadTexture('atlas.game','handDown',0,false)
        setTimeout(function(){
            hand.loadTexture('atlas.game','handUp',0,false)
            setTimeout(evalTutorial,500)
        },500)
    }

    function clickButton(button,pointer){
        if(!canTouch){
            return
        }

        if(inTutorial!=-1){
            if(!button.correct){
                return
            }
        }
        canTouch = false
        win = button.correct
        if(win){
            letreroText.setText(button.text.text)
        } 
        if(appleTween==null){
            var randomAngle = game.rnd.integerInRange(-80,80)
            var tween = game.add.tween(apple).to({y:350,angle:randomAngle},500,Phaser.Easing.linear,true)
            tween.onComplete.add(evaluateApple)
        }
        else{
            var r = appleTween.randomAngle
            appleTween.stop()
            var tween = game.add.tween(apple).to({y:350,angle:r},250,Phaser.Easing.linear,true)
            tween.onComplete.add(evaluateApple)

        }
        if(timeOn){
            stopTimer()
        }
        inTutorial = -1
        hand.visible = false
    }

    function evaluateApple(){
        if(win){
            estrellaSpine.setAnimationByName(0,'good',false)
            estrellaSpine.addAnimationByName(0,'idle',true)
            Coin(estrellaSpine,pointsBar,100)
        }
        else{
            missPoint()
            if(lives>0){
                estrellaSpine.setAnimationByName(0,'bad',false)
                estrellaSpine.addAnimationByName(0,'idle',true)
            }
            else{
                estrellaSpine.setAnimationByName(0,'lose',false)
                estrellaSpine.addAnimationByName(0,'losestill',true)
            }
        }

        setTimeout(setRound,1000)

        //apple.scale.setTo(0)

    }
    

    
    function createScene(){
        //yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        var bmd = game.add.bitmapData(1, game.world.height)

        var y = 0;

        for (var i = 0; i < game.world.height/2; i++)
        {
            var c = Phaser.Color.interpolateColor(0xffffff, 0x99ffcc, game.world.height, i);

            bmd.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c));

            y += 2;
        }

        var background = game.add.sprite(0, 0, bmd);
        background.scale.setTo(game.world.width,1)
        sceneGroup.add(background)

        var floor = game.add.tileSprite(0,game.world.height,game.world.width,160,'atlas.game','dirtTile')
        floor.anchor.setTo(0,1)
        sceneGroup.add(floor)


        var tree = sceneGroup.create(game.world.centerX, game.world.height-140, 'atlas.game','tree')
        tree.anchor.setTo(0.5,1)

        var grassTile = game.add.tileSprite(0,game.world.height-130,game.world.width,72,'atlas.game','grassTile')
        grassTile.anchor.setTo(0,1)
        sceneGroup.add(grassTile)

        var sheet = sceneGroup.create(game.world.centerX, 0, 'atlas.game','hojas')
        sheet.anchor.setTo(0.5,0)

        var box = game.add.group()
        sceneGroup.add(box)
        box.x = game.world.centerX
        box.y = grassTile.y - 120

        var back = box.create(0,0,'atlas.game','box_2')
        back.anchor.setTo(0.5)
        var base = box.create(0,0,'atlas.game','box_3')
        base.anchor.setTo(0.5)
        var front = box.create(0,0,'atlas.game','box_1')
        front.anchor.setTo(0.5)

        box.visible = false

        buttonGroup = game.add.group()
        buttonGroup.x = game.world.centerX
        buttonGroup.y = floor.y - floor.height/2
        sceneGroup.add(buttonGroup)



        for(var i = -1; i < 2; i++){

            var container = buttonGroup.create(DELTA_BUTTON*i,0,'atlas.game','container')
            container.anchor.setTo(0.5)
            container.inputEnabled = true
            container.events.onInputDown.add(clickButton,this)


            var button = game.add.sprite(0,0,'atlas.game','boton')
            button.anchor.setTo(0.5)
            container.addChild(button)
            var l = localization.getLanguage()

            if(l=="ES"){
                l = "32px"
            }
            else{
                l = "28px"
            }
            var fontStyle = {font: l+" VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
            var text = new Phaser.Text(sceneGroup.game, 0, 0, "", fontStyle)
            text.anchor.setTo(0.5)
            button.addChild(text)
            container.text = text
        }

        var letrero = sceneGroup.create(game.world.centerX,game.world.centerY,'atlas.game','letrerito')
        letrero.anchor.setTo(0.5)

        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        letreroText = new Phaser.Text(sceneGroup.game, 0, 5, "", fontStyle)
        letreroText.anchor.setTo(0.5)
        letrero.addChild(letreroText)

        

        

        estrellaSpine = game.add.spine(game.world.centerX-100, grassTile.y-30, 'estrella')
        estrellaSpine.setSkinByName('normal')
        estrellaSpine.setAnimationByName(0,'idle',true)
        sceneGroup.add(estrellaSpine)

        var empty 
        var slotIndex
        for(var index = 0, n = estrellaSpine.skeletonData.slots.length; index < n; index++){
            var slotData = estrellaSpine.skeletonData.slots[index]
            if(slotData.name === "apple"){
                slotIndex = index
            }
        }

        if (slotIndex){
            empty = estrellaSpine.slotContainers[slotIndex]
        }


        //apple = sceneGroup.create(game.world.centerX,sheet.y+sheet.height/2,'atlas.game','apple')
        apple = game.add.sprite(0,-100,'atlas.game','apple')
        apple.anchor.setTo(0.5)
        apple.scale.setTo(0)
        apple.initY = apple.y
        empty.add(apple)

        var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var text = new Phaser.Text(sceneGroup.game, 0, 25, "1", fontStyle)
        text.anchor.setTo(0.5)
        apple.addChild(text)
        apple.text = text

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

        initialize()

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
		name: "treeNumbers",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()
