var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"


var rabitTrace = function(){
    
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
                name: "atlas.rabitTrace",
                json: "images/rabitTrace/atlas.json",
                image: "images/rabitTrace/atlas.png"
            },
            {
                name: "atlas.time",
                json: "images/rabitTrace/timeAtlas.json",
                image: "images/rabitTrace/timeAtlas.png"
            },

        ],
        /*images: [
            {   name:"fondo",
				file: "images/sympho/fondo.png"}
		],*/
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
                file: soundsPath + "gameLose.mp3"}
		]
    }

    var NUM_LIFES = 3
    var INIT_WALK_SPACES = 6
    var DELTA_WALK_SPACES = 1
    var MAX_WALK_SPACES = 30
    var MIN_SPACES_WALK_IN_LINE = 2
    var X_SPACES = 7
    var DELTA_SPACE = 73
    var Y_SPACES = 10
    var INITIAL_TIME = 8000
    var DELTA_TIME = 200
    var MIN_TIME = 2000
    var LEVLES_TO_TIMER = 3
    var MAX_LEVEL_LINES = 7

    
    var lives
	var sceneGroup = null
    var gameIndex = 120
    var tutoGroup
    var backgroundSound
    var timeValue
    var numPoints
    var gameGroup
    var heartsGroup
    var pointsBar

    var timeOn = false
    var clock, tweenTiempo, timeBar

    var ruteArray
    var decidedRute
    var currentRuteId
    var gridArray
    var currentWalkSpaces
    var spacesInLine
    var currentDirection
    var spacesThrowCarrot
    var currentSpacesThrow

    var space_0

    var rabit

    var madriguera

    var carrotGroup

    var canTouch = false
    var touchStarted = false

    var horizontalLine 
    var verticalLine

    var horizontalbtm
    var verticalbtm

    var horizontalGroup
    var verticalGroup

    var currentLevel = 0
    var currentTime
    var correctParticle

    var foundFinish
    var stopTouch

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
        
        spacesInLine = 0
        currentWalkSpaces = INIT_WALK_SPACES

        space_0 = {x:game.world.centerX - (((X_SPACES-1)/2)*DELTA_SPACE), y: game.world.centerY +(((Y_SPACES-1)/2)*DELTA_SPACE)}
        currentRuteId = 0
        ruteArray = []
        gridArray = []

        currentLevel = 0
        timeOn = false

        foundFinish = false
        
        stopTouch = false

        restartArraySpaces()

        loadSounds()
        
	}

    function restartArraySpaces(){
        for(var i = 0; i < X_SPACES; i++){
            gridArray[i] = []
            for(var j = 0; j < Y_SPACES; j++){
                gridArray [i][j] = 0
            }
        }
    }

    function preload(){
        game.stage.disableVisibilityChange = false;

        game.load.spine('rabitSpineSide', "images/spines/rabit/bunny_side/bunny_side.json")
        game.load.spine('rabitSpineFront', "images/spines/rabit/bunny_front/bunny_front.json")
        game.load.spine('rabitSpineBack', "images/spines/rabit/bunny_back/bunny_back.json")
        game.load.audio('rabitSong', soundsPath + 'songs/childrenbit.mp3');
        
        /*game.load.image('introscreen',"images/rabitTrace/introscreen.png")
        game.load.image('howTo',"images/rabitTrace/how" + localization.getLanguage() + ".png")
        game.load.image('buttonText',"images/rabitTrace/play" + localization.getLanguage() + ".png")*/

        game.load.spritesheet("coin", 'images/rabitTrace/coin.png', 122, 123, 12)

        
        game.load.image('tutorial_image',"images/rabitTrace/tutorial_image.png")
        //loadType(gameIndex)


    }

    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.rabitTrace','hearts')

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

        var pointsImg = pointsBar.create(-10,10,'atlas.rabitTrace','xpcoins')
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
      clock=game.add.image(game.world.centerX-150,20,"atlas.time","clock")
      clock.scale.setTo(.7)
      timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
      timeBar.scale.setTo(8,.45)
      backgroundGroup.add(clock)
      backgroundGroup.add(timeBar)
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
           canPlant=false
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

       correctParticle.x = madriguera.x
        correctParticle.y = madriguera.y
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
        
    	loseRabit()
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
            nextRound()
        }
        
        // addNumberPart(batteryGroup,'-1')
    }
    


    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height
        inputsEnabled = true
        setRound()

    }
    
    function update() {
        if(canTouch){
            if(game.input.activePointer.isDown){
                if(stopTouch){
                    return
                }
                if(foundFinish){
                    return
                }
                var pos = evaluateTouchPosition()
               // console.log(pos)
                if(touchStarted){
                    if((pos.x != decidedRute[decidedRute.length-1].x || pos.y != decidedRute[decidedRute.length-1].y) && !(pos.x ==decidedRute[decidedRute.length-2].x && pos.y ==decidedRute[decidedRute.length-2].y)){

                        var dX = Math.abs(pos.x - decidedRute[decidedRute.length-1].x)
                        var dY = Math.abs(pos.y - decidedRute[decidedRute.length-1].y)

                        if(dX + dY == 1){

                            setLineDirection(pos,decidedRute[decidedRute.length-1])
                            decidedRute.push({x:pos.x, y:pos.y})

                            if(pos.x == ruteArray[ruteArray.length-1].x && pos.y == ruteArray[ruteArray.length-1].y){
                                foundFinish = true
                            }
                            //console.log(decidedRute)
                            //var helpImage = sceneGroup.create(space_0.x + (pos.x*DELTA_SPACE), space_0.y - (pos.y*DELTA_SPACE),'atlas.rabitTrace','star')
                            //helpImage.anchor.setTo(0.5,0.5)
                        }
                    }
                }
                else{
                    var dX = Math.abs(pos.x - ruteArray[0].x)
                    var dY = Math.abs(pos.y - ruteArray[0].y)

                    if(dX + dY == 1){

                        touchStarted = true

                        setLineDirection(pos,decidedRute[decidedRute.length-1])
                        decidedRute.push({x:pos.x, y:pos.y})
                        
                        //console.log(decidedRute)
                        //var helpImage = sceneGroup.create(space_0.x + (pos.x*DELTA_SPACE), space_0.y - (pos.y*DELTA_SPACE),'atlas.rabitTrace','star')
                        //helpImage.anchor.setTo(0.5,0.5)

                        
                    }
                }

                
            }
            else{
                if(stopTouch){
                    stopTouch = false
                    touchStarted = false
                    //canTouch = false
                    return
                }

                if(touchStarted){
                    foundFinish = false
                    canTouch = false
                    //console.log(decidedRute, ruteArray)

                    if(timeOn){
                        stopTimer()
                    }
                    jumpRabit()

                    goToNextPointSon()
                }
            }
        }
    }

    function setLineDirection(newPos, lastPos){
        var d = getDirection(newPos,lastPos)
        var line
        if(d == 0){
            //derecha
            line = getHorizontalLine()
            line.anchor.setTo(0,0.5)
            /*line.x = space_0.x + (lastPos.x*DELTA_SPACE)
            line.y = space_0.y - (lastPos.y*DELTA_SPACE)*/

        }
        else if(d == 1){
            //izquierda
            line = getHorizontalLine()
            line.anchor.setTo(1,0.5)
            /*line.x = space_0.x + (lastPos.x*DELTA_SPACE)
            line.y = space_0.y - (lastPos.y*DELTA_SPACE)*/

        }
        else if(d == 2){
            //arriba
            line = getVerticalLine()
            line.anchor.setTo(0.5,1)
            
            
        }
        else if(d == 3){
            //Abajo
            line = getVerticalLine()
            line.anchor.setTo(0.5,0)
            /*line.x = space_0.x + (lastPos.x*DELTA_SPACE)
            line.y = space_0.y - (lastPos.y*DELTA_SPACE)*/

        }

        line.x = space_0.x + (lastPos.x*DELTA_SPACE)
        line.y = space_0.y - (lastPos.y*DELTA_SPACE)
       

    }

    function getDirection(newPos, lastPos){
    	var dX = lastPos.x - newPos.x
        var dY = lastPos.y - newPos.y

        if(dX < 0){
        	//derecha
            return 0

        }
        else if(dX > 0){
            return 1

        }
        else if(dY > 0 ){
            //Abajo
            return 3

        }
        else if(dY < 0){
            //arriba
            return 2

        }

        return 0

    }

    function evaluateTouchPosition(){
        var position = {x:0,y:0,inGrid: false}
        var x = (game.input.activePointer.x - space_0.x)/DELTA_SPACE 
        var y = (space_0.y - game.input.activePointer.y)/DELTA_SPACE 
        x = Math.round(x)
        y = Math.round(y)

        if(x >= 0 && x <X_SPACES && y >= 0 && y < Y_SPACES){
            position.x = x
            position.y = y
            position.inGrid = true
        }

        return position

    }

    function createTutorial(){
        
        tutoGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

        
        /*var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            onClickPlay(rect)
            
        })
        
        tutoGroup.add(rect)
        
        var plane = tutoGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.rabitTrace','tutorial_image')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}

		var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.rabitTrace',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.rabitTrace','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }





    function checkCollision(obj){
        for(var i = 0; i < currentQuestions; i ++){
            var collide = checkOverlap(spaceGroup.children[i],obj)
            if(collide){
                return spaceGroup.children[i]
            }
        }

        return null
    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }

    function createRute(){

        /*Directions
        0 Right
        1 Left
        2 Up
        3 Down
        */

        var initialPos = {x: game.rnd.integerInRange(0,X_SPACES-1), y:game.rnd.integerInRange(0,Y_SPACES-1)}
        gridArray[initialPos.x][initialPos.y] = 1
        ruteArray[0] = {x:initialPos.x, y:initialPos.y}
        currentDirection = game.rnd.integerInRange(0,3)
        var currentX = initialPos.x
        var currentY = initialPos.y
        var i = 0
        spacesInLine = 0
        var timesInWhile = 0
        rabit.alpha = 0
        madriguera.alpha = 0
        //var helpImage = sceneGroup.create(game.world.centerX, game.world.centerY,'atlas.rabitTrace','star')
        //helpImage.anchor.setTo(0.5,0.5)
        //helpImage = sceneGroup.create(space_0.x, space_0.y,'atlas.rabitTrace','star')
        //helpImage.anchor.setTo(0.5,0.5)
        //var helpImage = sceneGroup.create(space_0.x + (currentX*DELTA_SPACE), space_0.y - (currentY*DELTA_SPACE),'atlas.rabitTrace','star')
        //helpImage.anchor.setTo(0.5,0.5)
        var finishRight = true 
        while(i<currentWalkSpaces){
            timesInWhile++
            //console.log(i,currentWalkSpaces, currentDirection)
            if(timesInWhile>10){
                //console.log("WrongCode ")
                break
            }
            var canWalk = isPosibleNextPoint(currentDirection, currentX, currentY)

            if(canWalk){
                //console.log("CanWalk")

                switch(currentDirection){
                    case 0:
                    finishRight = true
                    currentX++
                    break
                    case 1:
                    finishRight = false
                    currentX--
                    break
                    case 2:
                    currentY++
                    break
                    case 3:
                    currentY--
                    break
                }
                timesInWhile=0
                i++
                ruteArray[i] = {x:currentX, y: currentY}
                gridArray[currentX][currentY] = 1
                spacesInLine++
                if(spacesInLine>MIN_SPACES_WALK_IN_LINE){
                    var r = game.rnd.frac()
                    if(r < 0.5){
                        
                        currentDirection = changeDirection(currentDirection,currentX,currentY)
                    }
                }

                //helpImage = sceneGroup.create(space_0.x + (currentX*DELTA_SPACE), space_0.y - (currentY*DELTA_SPACE),'atlas.rabitTrace','star')
                //helpImage.anchor.setTo(0.5,0.5)
            }
            else{
                //console.log("CouldntWalk")
                currentDirection = changeDirection(currentDirection,currentX,currentY)
            }

        }

        madriguera.x = space_0.x + (ruteArray[ruteArray.length-1].x*DELTA_SPACE)
        madriguera.y = space_0.y - (ruteArray[ruteArray.length-1].y*DELTA_SPACE)

        if(finishRight){
            madriguera.scale.setTo(1,1)
        }
        else{
            madriguera.scale.setTo(-1,1)
        }
        //madriguera.alpha = 1

        rabit.x = space_0.x + (ruteArray[0].x*DELTA_SPACE)
        rabit.y = space_0.y - (ruteArray[0].y*DELTA_SPACE)

        setRabitDirection(ruteArray[1],ruteArray[0])

        idleRabit()

        currentRuteId = 0
        //console.log(ruteArray)
        spacesThrowCarrot = game.rnd.integerInRange(2,4)
        currentSpacesThrow = -1
        //goToNextPoint()
        decidedRute = []
        game.add.tween(madriguera).from({alpha:0}).to({alpha:1},500,Phaser.Easing.Linear.none,true)
        game.add.tween(rabit).from({alpha:0}).to({alpha:1},500,Phaser.Easing.Linear.none,true).onComplete.add(startJump)
    }



    function idleRabit(){
    	rabit.side.children[0].setAnimationByName(0,"IDLE",true)
    	rabit.front.children[0].setAnimationByName(0,"IDLE",true)
    	rabit.back.children[0].setAnimationByName(0,"IDLE",true)
    }

    function jumpRabit(){
    	rabit.side.children[0].setAnimationByName(0,"JUMP",true)
    	rabit.front.children[0].setAnimationByName(0,"JUMP",true)
    	rabit.back.children[0].setAnimationByName(0,"JUMP",true)
    }

    function loseRabit(){
    	rabit.side.alpha = 0
    	rabit.front.alpha = 1
    	rabit.front.children[0].setAnimationByName(0,"LOSE",true)
    	rabit.back.alpha = 0
    }

    function setRabitDirection(newPos, lastPos){
    	var d = getDirection(newPos,lastPos)

        switch(d){
        	case 0:
        	//right
        	rabit.side.alpha = 1
        	rabit.front.alpha = 0
        	rabit.back.alpha = 0
        	rabit.scale.setTo(-1,1)
        	break
        	case 1:
        	//left
        	rabit.side.alpha = 1
        	rabit.front.alpha = 0
        	rabit.back.alpha = 0
        	rabit.scale.setTo(1,1)
        	break
        	case 2:
        	//up
        	rabit.side.alpha = 0
        	rabit.front.alpha = 0
        	rabit.back.alpha = 1
        	rabit.scale.setTo(1,1)
        	break
        	case 3:
        	rabit.side.alpha = 0
        	rabit.front.alpha = 1
        	rabit.back.alpha = 0
        	rabit.scale.setTo(1,1)
        	break
        }

    }

    function changeDirection(direction,x,y){
        spacesInLine = 0
        var arrayPosibleDirection = []
        for(var i =0 ; i < 4; i++){
            //if(i == direction){
                //continue
            //}
            
            var canWalk = isPosibleNextPoint(i,x,y)

            if(canWalk){
                arrayPosibleDirection.push(i)
            }

        }
        if(arrayPosibleDirection.length!=0){
            //console.log(arrayPosibleDirection)
            var r = game.rnd.integerInRange(0,arrayPosibleDirection.length-1)
            //console.log(arrayPosibleDirection[r])
            if(arrayPosibleDirection.length>1){
            	if(arrayPosibleDirection[r] == direction){
            		arrayPosibleDirection.splice(r,1)
            		r = game.rnd.integerInRange(0,arrayPosibleDirection.length-1)
            	}
            	return  arrayPosibleDirection[r]
            }
            else{
	            return arrayPosibleDirection[r]
	        }
        }
        else{
            //console.log("no posible direction, gameWrong")
            //currentWalkSpaces =
        }
    }

    function isPosibleNextPoint(direction ,x, y){
        var nX = x
        var nY = y

        switch(direction){
            case 0:
            nX++
            break
            case 1:
            nX--
            break
            case 2:
            nY++
            break
            case 3:
            nY--
            break
        }

        if(nX < 0 || nX >= X_SPACES){
            return false
        }

        if(nY < 0 || nY >= Y_SPACES){
            return false
        }

        if(gridArray[nX][nY]==1){
            return false
        }

        return true
    }

    function startJump(){
    	jumpRabit()
    	goToNextPoint()
    }

    function goToNextPoint(){
        currentRuteId++
        if(currentRuteId < ruteArray.length){
            currentSpacesThrow++
            if(currentSpacesThrow == spacesThrowCarrot){
                var carrot = getCarrot()
                carrot.x = rabit.x
                carrot.y = rabit.y
                carrot.alpha = 1
                currentSpacesThrow = 0
                spacesThrowCarrot = game.rnd.integerInRange(3,5)
            }
            var x = space_0.x + (ruteArray[currentRuteId].x*DELTA_SPACE)
            var y = space_0.y - (ruteArray[currentRuteId].y*DELTA_SPACE)
            if(currentLevel < MAX_LEVEL_LINES){
	            setLineDirection(ruteArray[currentRuteId],ruteArray[currentRuteId-1])
	        }
            setRabitDirection(ruteArray[currentRuteId],ruteArray[currentRuteId-1])

            game.add.tween(rabit).to({x:x,y:y},1000,Phaser.Easing.Linear.none,true).onComplete.add(goToNextPoint)

            if(currentRuteId == ruteArray.length -1 ){
            	releaseLines()
            	game.add.tween(rabit).from({alpha:1}).to({alpha:0},1000,Phaser.Easing.Linear.none,true).onComplete.add(endRute)
            }
        }
        else{
            //game.add.tween(rabit).from({alpha:1}).to({alpha:0},500,Phaser.Easing.Linear.none,true).onComplete.add(endRute)
        }
    }

    function releaseLines(){
    	for(var i = 0; i < horizontalGroup.length; i++){
    		if(horizontalGroup.children[i].alpha == 1){
    			game.add.tween(horizontalGroup.children[i]).from({alpha:1}).to({alpha:0},1000,Phaser.Easing.Linear.none,true)
    		}
    	}

    	for(var i = 0; i < verticalGroup.length; i++){
    		if(verticalGroup.children[i].alpha == 1){
    			game.add.tween(verticalGroup.children[i]).from({alpha:1}).to({alpha:0},1000,Phaser.Easing.Linear.none,true)
    		}
    	}
    }

    function endRute(){
    	//console.log("rabitEnd rute")
        rabit.x = space_0.x + (ruteArray[0].x*DELTA_SPACE)
        rabit.y = space_0.y - (ruteArray[0].y*DELTA_SPACE)
        currentRuteId = 0
        decidedRute.push({x:ruteArray[0].x, y:ruteArray[0].y})
       	setRabitDirection(ruteArray[1],ruteArray[0])
       	idleRabit()
        game.add.tween(rabit).from({alpha:0}).to({alpha:1},500,Phaser.Easing.Linear.none,true).onComplete.add(startTouch)

    }

    function startTouch(){
    	touchStarted = false
    	canTouch = true
        stopTouch = false
    	if(timeOn){
            startTimer(currentTime)
            if(currentTime > MIN_TIME){
                currentTime -= DELTA_TIME
            }
        }
    }


    function goToNextPointSon(){
        currentRuteId++
        if(currentRuteId < decidedRute.length){
            //evaluate carrot
            for(var i = 0; i < carrotGroup.length; i++){
                if(carrotGroup.alpha ==1){
                    var dX = Math.abs(rabit.x - carrotGroup.children[i].x)
                    var dY = Math.abs(rabit.y - carrotGroup.children[i].y)

                    if(dX < DELTA_SPACE/2 && dY < DELTA_SPACE/2){
                        carrotGroup.children[i].alpha = 0
                        break
                    }
                }
            }

            setRabitDirection(decidedRute[currentRuteId],decidedRute[currentRuteId-1])

            //evaluate Madriguera

            var dX = Math.abs(rabit.x - madriguera.x)
            var dY = Math.abs(rabit.y - madriguera.y)

            if(dX < DELTA_SPACE/2 && dY < DELTA_SPACE/2){
                //console.log("END round")
                //rabit.alpha = 0
                Coin(madriguera,pointsBar,1)

                nextRound()
            }
            else{
                //NextPoint
                if(decidedRute[currentRuteId]!=null && decidedRute[currentRuteId].x == ruteArray[currentRuteId].x && decidedRute[currentRuteId].x == ruteArray[currentRuteId].x){

                    var x = space_0.x + (decidedRute[currentRuteId].x*DELTA_SPACE)
                    var y = space_0.y - (decidedRute[currentRuteId].y*DELTA_SPACE)
                    game.add.tween(rabit).to({x:x,y:y},1000,Phaser.Easing.Linear.none,true).onComplete.add(goToNextPointSon)
                }
                else{
                    missPoint()
                }
            }
        }
        else{
            //console.log(currentRuteId, currentWalkSpaces, ruteArray.length)
            if(currentRuteId == ruteArray.length){
                //console.log("End rute son")
                //rabit.alpha = 0
                Coin(madriguera,pointsBar,1)
                nextRound()
            }
            else{
                missPoint()
            }
        }
    }


    function setRound(){
        touchStarted = false
        canTouch = false
        ruteArray = []
        restartArraySpaces()
        createRute()

    }


    function nextRound(){
    	releaseLines()
        /*for(var i = 0; i < horizontalGroup.length; i++){
            horizontalGroup.children[i].alpha = 0
        }

        for(var i = 0; i < verticalGroup.length; i++){
            verticalGroup.children[i].alpha = 0
        }*/

        for(var i = 0; i < carrotGroup.length; i++){
        	if(carrotGroup.children[i].alpha == 1){
	            game.add.tween(carrotGroup.children[i]).from({alpha:1}).to({alpha:0},1000,Phaser.Easing.Linear.none,true)
	        }
        }

        if(currentWalkSpaces < MAX_WALK_SPACES){
            currentWalkSpaces +=DELTA_WALK_SPACES
        }
        else{
            currentWalkSpaces = MAX_WALK_SPACES
        }

        currentLevel ++

        if(currentLevel > LEVLES_TO_TIMER){
            if(!timeOn){
               timeOn = true
               positionTimer()
            }
        }
        game.add.tween(madriguera).from({alpha:1}).to({alpha:0},500,Phaser.Easing.Linear.none,true)
        game.add.tween(rabit).from({alpha:1}).to({alpha:0},500,Phaser.Easing.Linear.none,true).onComplete.add(setRound)
        //setRound()
    }

    function createRabit(){
        rabit = game.add.group()
        var group = game.add.group()
        var spine =  game.add.spine(0,50,'rabitSpineSide')
        spine.setAnimationByName(0,"IDLE",true)
        spine.setSkinByName("normal")
        spine.scale.setTo(0.3,0.3)
        group.add(spine)
        rabit.add(group)
        group.alpha = 0
        rabit.side = group

        group = game.add.group()
        spine =  game.add.spine(0,50,'rabitSpineFront')
        spine.setAnimationByName(0,"IDLE",true)
        spine.setSkinByName("normal")
        spine.scale.setTo(0.3,0.3)
        group.add(spine)
        rabit.add(group)
        group.alpha = 0
        rabit.front = group

        group = game.add.group()
        spine =  game.add.spine(0,50,'rabitSpineBack')
        spine.setAnimationByName(0,"IDLE",true)
        spine.setSkinByName("normal")
        spine.scale.setTo(0.3,0.3)
        group.add(spine)
        rabit.add(group)
        group.alpha = 0
        rabit.back = group

        sceneGroup.add(rabit)

        rabit.alpha = 0
    }

    function createCarrots(){
        carrotGroup = game.add.group()
        sceneGroup.add(carrotGroup)

        for(var i = 0; i < 10; i++){
            var carrot = carrotGroup.create(0,0,'atlas.rabitTrace','carrot')
            carrot.anchor.setTo(0.5,0.5)
            carrot.alpha = 0
        }
    }

    function getCarrot(){
        for(var i = 0; i < carrotGroup.length; i++){
            if(carrotGroup.children[i].alpha == 0){
                return carrotGroup.children[i]
            }
        }

        var carrot = carrotGroup.create(0,0,'atlas.rabitTrace','carrot')
        carrot.anchor.setTo(0.5,0.5)
        carrot.alpha = 0
        return carrot
    }

    function getHorizontalLine(){
        //console.log("generete horizontal line")
        for(var i = 0; i < horizontalGroup.length; i++){
            if(horizontalGroup.children[i].alpha==0){
                horizontalGroup.children[i].alpha = 1
                return horizontalGroup.children[i]
            }
        }

        var h = horizontalGroup.create(0,0,horizontalbtm)
        h.alpha = 1
        return h
    }

    function getVerticalLine(){
        for(var i = 0; i < verticalGroup.length; i++){
            if(verticalGroup.children[i].alpha==0){
                verticalGroup.children[i].alpha = 1
                return verticalGroup.children[i]
            }
        }

        var h = verticalGroup.create(0,0,verticalbtm)
        h.alpha = 1
        return h
    }

    
    function createScene(){
        //yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        var background = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.rabitTrace','tile')
        background.anchor.setTo(0,0)
        backgroundGroup.add(background)

        background = backgroundGroup.create(game.world.centerX,game.world.centerY,'atlas.rabitTrace','grid')
        background.anchor.setTo(0.5,0.5)
        
        gameGroup = game.add.group()
        gameGroup.x = game.world.centerX
        gameGroup.y = game.world.centerY
        sceneGroup.add(gameGroup)

        madriguera = sceneGroup.create(0,0, 'atlas.rabitTrace', 'madriguera')
        madriguera.anchor.setTo(0.5,0.5)
        madriguera.alpha = 0


        backgroundSound = game.add.audio('rabitSong')
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

        var deltaLine = DELTA_SPACE
        horizontalbtm = game.add.bitmapData(deltaLine,14);
        horizontalbtm.ctx.beginPath();
        horizontalbtm.ctx.lineWidth = "15";        
        horizontalbtm.ctx.strokeStyle = 'white';   
        //horizontalbtm.ctx.lineDashOffset = DELTA_SPACE/8;      
        horizontalbtm.ctx.setLineDash([deltaLine/8,deltaLine/4,deltaLine/4,deltaLine/4,deltaLine/8]);        
        horizontalbtm.ctx.moveTo(0, 0);        
        horizontalbtm.ctx.lineTo(deltaLine , 0);        
        horizontalbtm.ctx.stroke();       
        horizontalbtm.ctx.closePath();        
        //horizontalLine = game.add.sprite(game.world.centerX, game.world.centerY, horizontalbtm);
        //horizontalLine = game.add.sprite(game.world.centerX+DELTA_SPACE, game.world.centerY, horizontalbtm);
        //horizontalLine.alpha = 0


        verticalbtm = game.add.bitmapData(14,deltaLine);
        verticalbtm.ctx.beginPath();
        verticalbtm.ctx.lineWidth = "15";        
        verticalbtm.ctx.strokeStyle = 'white'; 
        //verticalbtm.ctx.lineDashOffset = DELTA_SPACE/8;        
        verticalbtm.ctx.setLineDash([deltaLine/8,deltaLine/4,deltaLine/4,deltaLine/4,deltaLine/8]);         
        verticalbtm.ctx.moveTo(0, 0);        
        verticalbtm.ctx.lineTo(0,deltaLine);        
        verticalbtm.ctx.stroke();        
        verticalbtm.ctx.closePath();        
        //verticalLine = game.add.sprite(game.world.centerX, game.world.centerY, verticalbtm);
        //verticalLine = game.add.sprite(game.world.centerX+DELTA_SPACE, game.world.centerY, verticalbtm);
        //verticalLine.anchor.setTo(0,1)
        //verticalLine.alpha = 0

        
        initialize()

        horizontalGroup = game.add.group()
        sceneGroup.add(horizontalGroup)
        verticalGroup = game.add.group()
        sceneGroup.add(verticalGroup)

        createPointsBar()
        createHearts()
        

        createRabit()
        createCarrots()
        correctParticle = createPart('atlas.rabitTrace','star')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)

        createTutorial()
    
    }
    
	return {
		assets: assets,
		name: "rabitTrace",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()



function lerp(a,b,t){
    return a + (b - a) * t;
}