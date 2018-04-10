var soundsPath = "../../shared/minigames/sounds/"


var geondrian = function(){

    var QUAD_TYPE = {
        SINGLE:1,
        HORIZONTAL:2,
        VERTICAL:3,
        BIG:4
    }

	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/geondrian/atlas.json",
                image: "images/geondrian/atlas.png"
            },
            {
                name: "atlas.time",
                json: "images/geondrian/timeAtlas.json",
                image: "images/geondrian/timeAtlas.png"
            },

        ],
        images: [
            {   name:"tutorial_image",
                file: "images/geondrian/tutorial_image.png"}
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
                name:'oona',
                file:'images/spines/oona/oona.json'
            }

		]
    }

    var NUM_LIFES = 3
    var INITIAL_TIME = 20000
    var DELTA_TIME = 500
    var MIN_TIME = 10000
    var LEVELS_TO_TIMER = 2

    var X_SPACES = 5
    var Y_SPACES = 5
    var DELTA_QUAD = 94

    var PROBABILTY_SINGLE = 0.5
    var PROBABILITY_HORIZONTAL = 0.7
    var PROBABILITY_HORIZONTAL = 0.9

    var MAX_TRIES = 3
    var INITIAL_DIFFICULT = 2.8
    var DELTA_DIFFICULT = 0.2
    var MAX_DIFFICULT = 5

    var COLORS = [0x4e76aa,0xd80c23,0xf5e000,0xffffff,0x36339C]
    var COLOR_LINE = 0x201f5e
    var COLOR_BUTTON_LINE = 0xffffff

    var DELTA_BUTTONS = 100
    var DELTA_Y_DROP_BUTTON = 200

    var SCALE_BUTTONS = 0.5
    var MIN_DISTANCE_CORRECT = 70

    var INITIAL_TIME_MEMORIZE = 4000
    var DELTA_TIME_MEMORIZE = 100
    var MIN_TIME_MEMORIZE = 2000

    var lives
	var sceneGroup = null
    var gameIndex = 183
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

    var inTutorial
    var hand
    var canTouch
    var tutorialTween
    var tutorialTimeout

    var curtainLeft, curtainRight

    var oonaSpine 

    var quadsGroup

    var space_0
    var arraySpaces

    var currentDifficult
    var currentButton

    var randomButtonsArray
    var buttonsplace

    var needObjects

    var arrayPositions
    var currentTimeMemorize 

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

        arraySpaces = [
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0]
        ]
        randomButtonsArray = []
        currentDifficult = INITIAL_DIFFICULT
        currentTimeMemorize = INITIAL_TIME_MEMORIZE
        loadSounds()
        
	}

    function preload(){
        game.stage.disableVisibilityChange = false;

        game.load.spritesheet("coin", 'images/geondrian/coin.png', 122, 123, 12)

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
           missPoint()
           stopTimer()
       })
    }

    function Coin(objectBorn,objectDestiny,time){
       
       
       //objectBorn= Objeto de donde nacen
       coins.x=objectBorn.centerX
       coins.y=objectBorn.centerY

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
        var anim = oonaSpine.setAnimationByName(0,"lose",false)
        anim.onComplete = nextRound
        
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
        updateInput()
    }

    function  updateInput() {
        if(game.input.activePointer.isDown){
            if(currentButton!=null){
                currentButton.x = game.input.activePointer.x
                currentButton.y = game.input.activePointer.y
            }
        }
        else{
            if(currentButton !=null){
                leaveButton(currentButton)
                currentButton = null

            }
        }
    }
    

    function createTutorial(){
        
        tutoGroup = game.add.group()

        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

        
    }


    function restartArray(){
        for(var i = 0; i < X_SPACES; i ++){
            for(var j = 0; j < Y_SPACES; j ++){
                arraySpaces[i][j] = 0
            }
        }
    }

    function setRound(){
        oonaSpine.setAnimationByName(0,"idle",true)
        var randomQuads = game.rnd.integerInRange(1,2)
        var colocatedQuads = 0
        var tries = 0
        while(colocatedQuads < randomQuads && tries < MAX_TRIES){
            var rx = game.rnd.integerInRange(0,X_SPACES-2)
            var ry = game.rnd.integerInRange(0,Y_SPACES-2)
            if(arraySpaces[rx][ry]==0 && arraySpaces[rx+1][ry]==0 && arraySpaces[rx][ry+1]==0 && arraySpaces[rx+1][ry+1]==0){
                arraySpaces[rx][ry] = 1
                arraySpaces[rx+1][ry] = 1
                arraySpaces[rx][ry+1] = 1
                arraySpaces[rx+1][ry+1] = 1
                getQuad(QUAD_TYPE.BIG,rx,ry)
                tries = 0
                colocatedQuads++
            }
            else{
                tries ++
            }
        }

        var randomhorizontal = game.rnd.integerInRange(1,2)
        colocatedQuads = 0
        tries = 0
        while(colocatedQuads < randomhorizontal && tries < MAX_TRIES){
            var rx = game.rnd.integerInRange(0,X_SPACES-2)
            var ry = game.rnd.integerInRange(0,Y_SPACES-1)
            if(arraySpaces[rx][ry]==0 && arraySpaces[rx+1][ry]==0){
                arraySpaces[rx][ry] = 1
                arraySpaces[rx+1][ry] = 1
                getQuad(QUAD_TYPE.HORIZONTAL,rx,ry)
                tries = 0
                colocatedQuads++
            }
            else{
                tries ++
            }
        }

        var randomhorizontal = game.rnd.integerInRange(1,2)
        colocatedQuads = 0
        tries = 0
        while(colocatedQuads < randomhorizontal && tries < MAX_TRIES){
            var rx = game.rnd.integerInRange(0,X_SPACES-1)
            var ry = game.rnd.integerInRange(0,Y_SPACES-2)
            if(arraySpaces[rx][ry]==0 && arraySpaces[rx][ry+1]==0){
                arraySpaces[rx][ry] = 1
                arraySpaces[rx][ry+1] = 1
                getQuad(QUAD_TYPE.VERTICAL,rx,ry)
                tries = 0
                colocatedQuads++
            }
            else{
                tries ++
            }
        }


        for(var i = 0; i < X_SPACES; i ++){
            for(var j = 0; j < Y_SPACES; j++){
                if(arraySpaces[i][j] == 0){
                    arraySpaces[i][j] = 1
                    getQuad(QUAD_TYPE.SINGLE,i,j)

                }
            }
        }

        setTimeout(function(){
            openCurtain()
            setTimeout(function(){
                closeCurtain()
                setTimeout(function(){
                    dropButtons()
                },500)
            },currentTimeMemorize)
        },200)

        if(currentTimeMemorize > MIN_TIME_MEMORIZE){
            currentTimeMemorize-=DELTA_TIME_MEMORIZE
        }

        if(currentLevel > LEVELS_TO_TIMER){
            if(!timeOn){
                timeOn = true
                positionTimer()
            }
            

        }

        currentLevel++

        
    }



    function evalTutorial(){
        if(inTutorial>=2){
            hand.visible = false
            inTutorial = -1
            return
        }
        hand.x = randomButtonsArray[inTutorial].buttonPosition.x
        hand.y = randomButtonsArray[inTutorial].buttonPosition.y
        hand.loadTexture("atlas.game","handDown")
        tutorialTween = game.add.tween(hand).to({x:arrayPositions[inTutorial].point.x,y:arrayPositions[inTutorial].point.y},1200,Phaser.Easing.linear,true)
        tutorialTween.onComplete.add(function(){
            hand.loadTexture("atlas.game","handUp")
            tutorialTimeout = setTimeout(function(){
                evalTutorial()
            },600)
        })
    }

    function clickButton(button){
        currentButton = button
        quadsGroup.bringToTop(button)
    }

    function leaveButton(button){
        for(var i = 0; i < arrayPositions.length; i++){
            if(arrayPositions[i].type == button.type && arrayPositions[i].color == button.color){
                var d = Math.sqrt(Math.pow(button.x - arrayPositions[i].point.x,2) + Math.pow(button.y - arrayPositions[i].point.y,2))
                if(d < MIN_DISTANCE_CORRECT){
                    button.x = arrayPositions[i].point.x
                    button.y = arrayPositions[i].point.y
                    button.scale.setTo(1)
                    button.line.clear()
                    button.inputEnabled = false

                    if(inTutorial!=-1){
                        if(tutorialTween!=null){
                            tutorialTween.stop()
                        }
                        if(tutorialTimeout!=null){
                            clearTimeout(tutorialTimeout)
                        }
                        inTutorial++
                        evalTutorial()
                    }
                    switch(button.type){
                        case QUAD_TYPE.SINGLE:
                        button.line.lineStyle(5, COLOR_LINE, 1);
                        button.line.drawRect(-DELTA_QUAD/2,-DELTA_QUAD/2,DELTA_QUAD,DELTA_QUAD)
                        break
                        case QUAD_TYPE.HORIZONTAL:
                        button.line.lineStyle(5, COLOR_LINE, 1);
                        button.line.drawRect(-DELTA_QUAD,- DELTA_QUAD/2,DELTA_QUAD*2,DELTA_QUAD)
                        break
                        case QUAD_TYPE.VERTICAL:
                        button.line.lineStyle(5, COLOR_LINE, 1);
                        button.line.drawRect(-DELTA_QUAD/2,- DELTA_QUAD,DELTA_QUAD,DELTA_QUAD*2)
                        break
                        case QUAD_TYPE.BIG:
                        button.line.lineStyle(5, COLOR_LINE, 1);
                        button.line.drawRect(-DELTA_QUAD,- DELTA_QUAD,DELTA_QUAD*2,DELTA_QUAD*2)
                        break
                    }
                    needObjects -- 
                    if(needObjects <= 0){
                        if(timeOn){
                            stopTimer()
                        }
                        Coin(buttonsplace,pointsBar,100)
                        var anim = oonaSpine.setAnimationByName(0,"good",false)
                        anim.onComplete = nextRound
                    }
                    return
                }
            }
        }

    
        button.x = button.buttonPosition.x
        button.y = button.buttonPosition.y
        
    }

    function nextRound(){
        if(lives >0){
            closeCurtain()
            setTimeout(function(){
                restartArray()
                for(var i = 0; i < quadsGroup.length; i++){
                    quadsGroup.children[i].visible = false
                    quadsGroup.children[i].scale.setTo(1)
                }
                setRound()
            },1000)
        }
    }

    function dropButtons(){
        var difficult = Math.floor(currentDifficult)

        if(currentDifficult < MAX_DIFFICULT){
            currentDifficult+=DELTA_DIFFICULT
        }

        var currentQuads = []

        for(var i = 0; i < quadsGroup.length; i++){
            if(quadsGroup.children[i].visible){
                currentQuads.push(quadsGroup.children[i])
            }
        }

        needObjects = difficult

        randomButtonsArray = []
        for(var i = 0; i < difficult; i ++){
            var randomIndex = game.rnd.integerInRange(0,currentQuads.length-1)
            var quad = currentQuads[randomIndex]
            currentQuads.splice(randomIndex,1)
            setInputAvailable(quad)

        }
        arrayPositions = []
        var initX = buttonsplace.x-((randomButtonsArray.length-1)/2) * DELTA_BUTTONS
        for(var i = 0; i < randomButtonsArray.length; i++){
            randomButtonsArray[i].x = initX + (DELTA_BUTTONS*i)
            randomButtonsArray[i].y = buttonsplace.y - DELTA_Y_DROP_BUTTON

            randomButtonsArray[i].scale.setTo(SCALE_BUTTONS)
            randomButtonsArray[i].buttonPosition = {x:randomButtonsArray[i].x,y:randomButtonsArray[i].y + DELTA_Y_DROP_BUTTON}
            arrayPositions.push({point:randomButtonsArray[i].startPoint,type:randomButtonsArray[i].type, color:randomButtonsArray[i].color})
            game.add.tween(randomButtonsArray[i]).to({y: randomButtonsArray[i].y + DELTA_Y_DROP_BUTTON}, 500, Phaser.Easing.Bounce.Out, true)

        }

        setTimeout(function(){
            openCurtain()
            if(timeOn){
                setTimeout(function(){
                    startTimer(currentTime)

                    if(currentTime > MIN_TIME){
                        currentTime -= DELTA_TIME
                    }
                },400)
            }

            if(inTutorial !=-1){
                hand.visible = true
                evalTutorial()
            }
        },800)
    }

    function setInputAvailable(quad){
        quad.inputEnabled = true
        //quad.input.useHandCursor = true
        quad.line.clear()
        switch(quad.type){
            case QUAD_TYPE.SINGLE:
            quad.line.lineStyle(6, COLOR_BUTTON_LINE, 1);
            quad.line.drawRect(-DELTA_QUAD/2,-DELTA_QUAD/2,DELTA_QUAD,DELTA_QUAD)
            break
            case QUAD_TYPE.HORIZONTAL:
            quad.line.lineStyle(6, COLOR_BUTTON_LINE, 1);
            quad.line.drawRect(-DELTA_QUAD,- DELTA_QUAD/2,DELTA_QUAD*2,DELTA_QUAD)
            break
            case QUAD_TYPE.VERTICAL:
            quad.line.lineStyle(6, COLOR_BUTTON_LINE, 1);
            quad.line.drawRect(-DELTA_QUAD/2,- DELTA_QUAD,DELTA_QUAD,DELTA_QUAD*2)
            break
            case QUAD_TYPE.BIG:
            quad.line.lineStyle(6, COLOR_BUTTON_LINE, 1);
            quad.line.drawRect(-DELTA_QUAD,- DELTA_QUAD,DELTA_QUAD*2,DELTA_QUAD*2)
            break
        }
        randomButtonsArray.push(quad)

    }

    function getQuad(type,x,y){
        switch(type){
            case QUAD_TYPE.SINGLE:

            x = space_0.x + (DELTA_QUAD*x)
            y = space_0.y + (DELTA_QUAD*y)

            break
            case QUAD_TYPE.HORIZONTAL:
            x = space_0.x + (DELTA_QUAD*x) + (DELTA_QUAD/2)
            y = space_0.y + (DELTA_QUAD*y)
            break
            case QUAD_TYPE.VERTICAL:
            x = space_0.x + (DELTA_QUAD*x) 
            y = space_0.y + (DELTA_QUAD*y) + (DELTA_QUAD/2)
            break
            case QUAD_TYPE.BIG:
            x = space_0.x + (DELTA_QUAD*x) + (DELTA_QUAD/2)
            y = space_0.y + (DELTA_QUAD*y) + (DELTA_QUAD/2)
            break
        }

        var quad = null

        for(var i = 0; i < quadsGroup.length; i ++){
            if(!quadsGroup.children[i].visible){
                quadsGroup.children[i].visible = true
                quadsGroup.children[i].x = x
                quadsGroup.children[i].y = y
                quad = quadsGroup.children[i]
                break
            }
        }

        if(quad == null){
            quad = game.add.graphics(x,y)
            quadsGroup.add(quad)
            var line =  game.add.graphics(0,0)
            quad.addChild(line)
            quad.line = line
            quad.events.onInputDown.add(clickButton,this)
        }

        quad.startPoint = {x:quad.x,y:quad.y}

        quad.clear()
        quad.line.clear()

        var color = COLORS[game.rnd.integerInRange(0,COLORS.length-1)]
        quad.color = color
        switch(type){
            case QUAD_TYPE.SINGLE:
            createSingleQuad(quad,color)
            break
            case QUAD_TYPE.HORIZONTAL:
            createHorizontalQuad(quad,color)
            break
            case QUAD_TYPE.VERTICAL:
            createVerticalQuad(quad,color)
            break
            case QUAD_TYPE.BIG:
            createBigQuad(quad,color)
            break
        }

        quad.inputEnabled = false
        
        quad.type = type
    }

    function createSingleQuad(graphic,color){
        graphic.beginFill(color)
        graphic.drawRect(-DELTA_QUAD/2,-DELTA_QUAD/2,DELTA_QUAD,DELTA_QUAD)
        graphic.endFill()

        graphic.line.lineStyle(5, COLOR_LINE, 1);
        graphic.line.drawRect(-DELTA_QUAD/2,-DELTA_QUAD/2,DELTA_QUAD,DELTA_QUAD)

    }

    function createVerticalQuad(graphic,color){
        graphic.beginFill(color)
        graphic.drawRect(-DELTA_QUAD/2,- DELTA_QUAD,DELTA_QUAD,DELTA_QUAD*2)
        graphic.endFill()

        graphic.line.lineStyle(5, COLOR_LINE, 1);
        graphic.line.drawRect(-DELTA_QUAD/2,- DELTA_QUAD,DELTA_QUAD,DELTA_QUAD*2)
    }

    function createHorizontalQuad(graphic,color){
        graphic.beginFill(color)
        graphic.drawRect(-DELTA_QUAD,- DELTA_QUAD/2,DELTA_QUAD*2,DELTA_QUAD)
        graphic.endFill()

        graphic.line.lineStyle(5, COLOR_LINE, 1);
        graphic.line.drawRect(-DELTA_QUAD,- DELTA_QUAD/2,DELTA_QUAD*2,DELTA_QUAD)
    }

    function createBigQuad(graphic,color){
        graphic.beginFill(color)
        graphic.drawRect(-DELTA_QUAD,- DELTA_QUAD,DELTA_QUAD*2,DELTA_QUAD*2)
        graphic.endFill()

        graphic.line.lineStyle(5, COLOR_LINE, 1);
        graphic.line.drawRect(-DELTA_QUAD,- DELTA_QUAD,DELTA_QUAD*2,DELTA_QUAD*2)
    }


    function closeCurtain(){
        game.add.tween(curtainLeft).to({x: game.world.centerX},400,Phaser.Easing.linear,true)
        game.add.tween(curtainRight).to({x: game.world.centerX},400,Phaser.Easing.linear,true)
    }

    function openCurtain(){
        game.add.tween(curtainLeft).to({x: 20},400,Phaser.Easing.linear,true)
        game.add.tween(curtainRight).to({x: game.world.width-20},400,Phaser.Easing.linear,true)
    }

    
    function createBackground(){
        var backgroundTop = game.add.graphics(0,0)
        backgroundTop.beginFill(0xffe3bd)
        backgroundTop.drawRect(0,0,game.world.width,game.world.height)
        backgroundTop.endFill()
        backgroundGroup.add(backgroundTop)

        var topAdorn = backgroundGroup.create(game.world.centerX,0,"atlas.game","adorno_Techo")
        topAdorn.anchor.setTo(0.5,0)


        var floorTile2 = game.add.tileSprite(0,game.world.height - 240, game.world.width,240,"atlas.game","tile")
        floorTile2.anchor.setTo(0,0)
        backgroundGroup.add(floorTile2)

        var floorTile1 = game.add.tileSprite(0,game.world.height - 300, game.world.width,70,"atlas.game","tile_1")
        floorTile1.anchor.setTo(0,0)
        backgroundGroup.add(floorTile1)


        var paintBackground = backgroundGroup.create(game.world.centerX,game.world.centerY-150,"atlas.game","board_Pintura")
        paintBackground.anchor.setTo(0.5)

        space_0 = {x: paintBackground.x -(((X_SPACES-1)/2)*DELTA_QUAD),y: paintBackground.y -(((Y_SPACES-1)/2)*DELTA_QUAD)}


        buttonsplace = backgroundGroup.create(game.world.centerX,game.world.height - 100,"atlas.game","Barra")
        buttonsplace.anchor.setTo(0.5)
        buttonsplace.scale.setTo(1.1,1)

        quadsGroup = game.add.group()
        sceneGroup.add(quadsGroup)


        oonaSpine = game.add.spine(game.world.centerX-150,game.world.centerY+290,"oona")
        oonaSpine.setSkinByName("normal")
        oonaSpine.setAnimationByName(0,"idle",true)
        sceneGroup.add(oonaSpine)


        curtainLeft = game.add.tileSprite(game.world.centerX,-1,game.world.centerX,823,"atlas.game","cortina_Tile")
        curtainLeft.anchor.setTo(1,0)
        sceneGroup.add(curtainLeft)

        curtainRight = game.add.tileSprite(game.world.centerX,-1,game.world.centerX,823,"atlas.game","cortina_Tile")
        curtainRight.anchor.setTo(0,0)
        sceneGroup.add(curtainRight)

    }
    
    function createScene(){

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        createBackground()

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
		name: "geondrian",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()
