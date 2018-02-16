
var soundsPath = "../../shared/minigames/sounds/"

var beeTravel = function(){
    
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
                name: "atlas.beeTravel",
                json: "images/beeTravel/atlas.json",
                image: "images/beeTravel/atlas.png"
            },
            {   
                name: "atlas.time",
                json: "images/beeTravel/timeAtlas.json",
                image: "images/beeTravel/timeAtlas.png"
            },

        ],
        images: [
            {   name:"tutorial_image",
				file: "images/beeTravel/tutorial_image.png"}
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
                file: soundsPath + 'songs/childrenbit.mp3'
                }
		],
        spines:[
            {
                name:'beeSpine',
                file:'images/spines/bee/bee.json'
            },
            {
                name:'flowerSpine',
                file:'images/spines/flowers/flowers.json'
            },
        ]
    }

    var NUM_LIFES = 3
    var INIT_WALK_SPACES = 4
    var DELTA_WALK_SPACES = 1
    var MAX_WALK_SPACES = 15
    var MIN_SPACES_WALK_IN_LINE = 2
    var X_SPACES = 4
    var DELTA_SPACE_X = 110
    var DELTA_SPACE_Y = 140
    var Y_SPACES = 6
    var INITIAL_TIME = 8000
    var DELTA_TIME = 200
    var MIN_TIME = 2000
    var LEVLES_TO_TIMER = 3

    var FLOWERS_NUMBER = 7

    
    var lives
	var sceneGroup = null
    var gameIndex = 145
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
    var spacesThrowFlower
    var currentSpacesThrow

    var space_0

    var bee

    var flowerGroup

    var line1Group
    var line2Group
    var line3Group
    var line4Group

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

    var lastFlower

    var flowersInUse



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

        space_0 = {x:game.world.centerX - (((X_SPACES-1)/2)*DELTA_SPACE_X), y: game.world.centerY +(((Y_SPACES-1)/2)*DELTA_SPACE_Y)}
        currentRuteId = 0
        ruteArray = []
        gridArray = []

        currentLevel = 0
        timeOn = false

        flowersInUse = []

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
        game.load.spritesheet("coin", 'images/beeTravel/coin.png', 122, 123, 12)
    }

    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.beeTravel','hearts')

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

        var pointsImg = pointsBar.create(-10,10,'atlas.beeTravel','xpcoins')
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
        
    	loseSpine()
        sound.play("wrong")
        
        lives--;
        heartsGroup.text.setText('X ' + lives)

        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        addNumberPart(heartsGroup.text,'-1')
        
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
                var pos = evaluateTouchPosition()
               // console.log(pos)
                if(touchStarted){
                    if(pos.x != decidedRute[decidedRute.length-1].x || pos.y != decidedRute[decidedRute.length-1].y){

                        var dX = Math.abs(pos.x - decidedRute[decidedRute.length-1].x)
                        var dY = Math.abs(pos.y - decidedRute[decidedRute.length-1].y)

                        if(dX + dY == 1){

                            setLineDirection(pos,decidedRute[decidedRute.length-1])
                            decidedRute.push({x:pos.x, y:pos.y})
                            
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
                        
                        

                        
                    }
                }
            }
            else{
                if(touchStarted){
                    canTouch = false
                    //console.log(decidedRute, ruteArray)

                    if(timeOn){
                        stopTimer()
                    }
                    //jumpRabit()

                    goToNextPoint()
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

        }
        else if(d == 1){
            //izquierda
            line = getHorizontalLine()
            line.anchor.setTo(1,0.5)

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

        }

        line.x = space_0.x + (lastPos.x*DELTA_SPACE_X)
        line.y = space_0.y - (lastPos.y*DELTA_SPACE_Y)
    
        return line

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
        var x = (game.input.activePointer.x - space_0.x)/DELTA_SPACE_X 
        var y = (space_0.y - game.input.activePointer.y)/DELTA_SPACE_Y 
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
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
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
        bee.alpha = 0

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
            }
            else{
                //console.log("CouldntWalk")
                currentDirection = changeDirection(currentDirection,currentX,currentY)
            }

        }

        /*madriguera.x = space_0.x + (ruteArray[ruteArray.length-1].x*DELTA_SPACE_X)
        madriguera.y = space_0.y - (ruteArray[ruteArray.length-1].y*DELTA_SPACE_Y)

        if(finishRight){
            madriguera.scale.setTo(1,1)
        }
        else{
            madriguera.scale.setTo(-1,1)
        }*/
        //madriguera.alpha = 1

        //bee.x = space_0.x + (ruteArray[0].x*DELTA_SPACE_X)
        //bee.y = space_0.y - (ruteArray[0].y*DELTA_SPACE_Y)

        setDirection(ruteArray[1],ruteArray[0])

        idleSpine()

        currentRuteId = 0
        //console.log(ruteArray)
        spacesThrowFlower = game.rnd.integerInRange(2,4)
        currentSpacesThrow = 0
        //goToNextPoint()
        decidedRute = []
        //game.add.tween(madriguera).from({alpha:0}).to({alpha:1},500,Phaser.Easing.Linear.none,true)
        //game.add.tween(bee).from({alpha:0}).to({alpha:1},500,Phaser.Easing.Linear.none,true).onComplete.add(startJump)

        var initialFlower = getFlower()
        //initialFlower.spine.setAnimationByName(0,'IDLE_FLOWER',true)

        initialFlower.animation = 'IDLE_FLOWER'
        initialFlower.x = space_0.x + (ruteArray[0].x*DELTA_SPACE_X)
        initialFlower.y = space_0.y - (ruteArray[0].y*DELTA_SPACE_Y)
        initialFlower.flowerDead.alpha = 0
        initialFlower.flowerAlive.alpha = 1
        game.add.tween(initialFlower).to({alpha:1},1000,Phaser.Easing.linear,true)
        setFlowerLevel(initialFlower,ruteArray[0].y)
        console.log(initialFlower)
        for(var i = 1; i < ruteArray.length; i++){
            var line = setLineDirection(ruteArray[i-1],ruteArray[i])
            line.alpha = 0.01
            game.add.tween(line).to({alpha:1},1000,Phaser.Easing.linear,true)
            currentSpacesThrow++
            if(currentSpacesThrow>spacesThrowFlower){
                var flower = getFlower()
                flower.x = space_0.x + (ruteArray[i].x*DELTA_SPACE_X)
                flower.y = space_0.y - (ruteArray[i].y*DELTA_SPACE_Y)
                currentSpacesThrow = 0
                spacesThrowFlower = game.rnd.integerInRange(2,4)
                game.add.tween(flower).to({alpha:1},1000,Phaser.Easing.linear,true)
                setFlowerLevel(flower,ruteArray[i].y)
                console.log(flower)
            }
        }

        lastFlower = getFlower()
        lastFlower.x = space_0.x + (ruteArray[ruteArray.length-1].x*DELTA_SPACE_X)
        lastFlower.y = space_0.y - (ruteArray[ruteArray.length-1].y*DELTA_SPACE_Y)
        game.add.tween(lastFlower).to({alpha:1},1000,Phaser.Easing.linear,true).onComplete.add(function(){setTimeout(startBee,1000)})
        setFlowerLevel(lastFlower,ruteArray[ruteArray.length-1].y)
        console.log(lastFlower)

    }


    function setFlowerLevel(flower,line){
        flowersInUse.push(flower)
        //flowerGroup.remove(flower)
        switch(line){
            case 0:
            line1Group.add(flower)
            break
            case 1:
            line2Group.add(flower)
            break
            case 2:
            line3Group.add(flower)
            break
            case 3:
            line4Group.add(flower)
            break
        }
    }

    function returnFlowers(group){
        for(var i =0 ; i < group.length; i++){
            var obj = group.children[i]
            //group.remove(obj)
            flowerGroup.add(obj)
        }
    }

    function idleSpine(){
    	bee.spine.setAnimationByName(0,"IDLE",true)
    }

    function loseSpine(){
    	bee.spine.setAnimationByName(0,"LOSE",false)
    }

    function setDirection(newPos, lastPos){
    	var d = getDirection(newPos,lastPos)

        switch(d){
        	case 0:
        	//right
        	bee.scale.setTo(-1,1)
        	break
        	case 1:
        	//left
        	bee.scale.setTo(1,1)
        	break
        	case 2:
        	//up
        	break
        	case 3:
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
    	goToNextPoint()
    }

    function goToNextPoint(){
        currentRuteId++
        if(currentRuteId < decidedRute.length){
            //evaluate carrot
            for(var i = 0; i < flowersInUse.length; i++){
                if(flowersInUse[i].alpha ==1 && flowersInUse[i].animation=='IDLE_BASE'){
                    var dX = Math.abs(bee.x - flowersInUse[i].x)
                    var dY = Math.abs(bee.y - flowersInUse[i].y)

                    if(dX < DELTA_SPACE_X/2 && dY < DELTA_SPACE_Y/2  ){
                        //flowersInUse[i].spine.setAnimationByName(0,'IDLE_FLOWER',true)
                        flowersInUse[i].animation = 'IDLE_FLOWER'
                        game.add.tween(flowersInUse[i].flowerAlive).to({alpha:1},300,Phaser.Easing.linear,true)
                        break
                    }
                }
            }

            setDirection(decidedRute[currentRuteId],decidedRute[currentRuteId-1])

            //evaluate Madriguera

            var dX = Math.abs(bee.x - lastFlower.x)
            var dY = Math.abs(bee.y - lastFlower.y)

            if(dX < DELTA_SPACE_X/2 && dY < DELTA_SPACE_Y/2){
                //console.log("END round")
                //rabit.alpha = 0
                Coin(lastFlower,pointsBar,1)
                //lastFlower.spine.setAnimationByName(0,'IDLE_FLOWER',true)
                lastFlower.animation = 'IDLE_FLOWER'
                game.add.tween(lastFlower.flowerAlive).to({alpha:1},300,Phaser.Easing.linear,true)
                //setTimeout(nextRound,500)
                nextRound()
            }
            else{
                //NextPoint
                if(decidedRute[currentRuteId]!=null && decidedRute[currentRuteId].x == ruteArray[currentRuteId].x && decidedRute[currentRuteId].x == ruteArray[currentRuteId].x){

                    var x = space_0.x + (decidedRute[currentRuteId].x*DELTA_SPACE_X)
                    var y = space_0.y - (decidedRute[currentRuteId].y*DELTA_SPACE_Y)
                    game.add.tween(bee).to({x:x,y:y},1000,Phaser.Easing.Linear.none,true).onComplete.add(goToNextPoint)
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
                Coin(lastFlower,pointsBar,1)
                //lastFlower.spine.setAnimationByName(0,'IDLE_FLOWER',true)
                lastFlower.animation = 'IDLE_FLOWER'

                game.add.tween(lastFlower.flowerAlive).to({alpha:1},300,Phaser.Easing.linear,true)
                //setTimeout(nextRound,500)
                nextRound()
            }
            else{
                missPoint()
            }
        }
    }



    function releaseLines(time){
    	for(var i = 0; i < horizontalGroup.length; i++){
    		if(horizontalGroup.children[i].alpha == 1){
    			game.add.tween(horizontalGroup.children[i]).from({alpha:1}).to({alpha:0},time,Phaser.Easing.Linear.none,true)
    		}
    	}

    	for(var i = 0; i < verticalGroup.length; i++){
    		if(verticalGroup.children[i].alpha == 1){
    			game.add.tween(verticalGroup.children[i]).from({alpha:1}).to({alpha:0},time,Phaser.Easing.Linear.none,true)
    		}
    	}
    }

    function startBee(){

        releaseLines(1000)

    	//console.log("rabitEnd rute")
        bee.x = space_0.x + (ruteArray[0].x*DELTA_SPACE_X)
        bee.y = space_0.y - (ruteArray[0].y*DELTA_SPACE_Y)

        currentRuteId = 0
        decidedRute.push({x:ruteArray[0].x, y:ruteArray[0].y})
       	setDirection(ruteArray[1],ruteArray[0])
       	idleSpine()
        game.add.tween(bee).from({alpha:0}).to({alpha:1},1000,Phaser.Easing.Linear.none,true).onComplete.add(startTouch)

    }

    function startTouch(){
    	touchStarted = false
    	canTouch = true
    	if(timeOn){
            startTimer(currentTime)
            if(currentTime > MIN_TIME){
                currentTime -= DELTA_TIME
            }
        }
    }



    function setRound(){
        ruteArray = []
        restartArraySpaces()
        returnFlowers(line1Group)
        returnFlowers(line2Group)
        returnFlowers(line3Group)
        returnFlowers(line4Group)

        line1Group.removeAll()
        line2Group.removeAll()
        line3Group.removeAll()
        line4Group.removeAll()

        console.log(flowerGroup.length)

        for(var i = 0; i < flowerGroup.length; i++){
            flowerGroup.children[i].visible = false
        }
        createRute()

    }


    function nextRound(){
    	releaseLines(1000)
        /*for(var i = 0; i < horizontalGroup.length; i++){
            horizontalGroup.children[i].alpha = 0
        }

        for(var i = 0; i < verticalGroup.length; i++){
            verticalGroup.children[i].alpha = 0
        }*/

        flowersInUse = []

        console.log(line1Group.length)
        console.log(line2Group.length)
        console.log(line3Group.length)
        console.log(line4Group.length)

        for(var i = 0; i < line1Group.length; i++){
        	if(line1Group.children[i].alpha == 1){
	            game.add.tween(line1Group.children[i]).from({alpha:1}).to({alpha:0},1000,Phaser.Easing.Linear.none,true)
	        }
        }
        for(var i = 0; i < line2Group.length; i++){
            if(line2Group.children[i].alpha == 1){
                game.add.tween(line2Group.children[i]).from({alpha:1}).to({alpha:0},1000,Phaser.Easing.Linear.none,true)
            }
        }
        for(var i = 0; i < line3Group.length; i++){
            if(line3Group.children[i].alpha == 1){
                game.add.tween(line3Group.children[i]).from({alpha:1}).to({alpha:0},1000,Phaser.Easing.Linear.none,true)
            }
        }
        for(var i = 0; i < line4Group.length; i++){
            if(line4Group.children[i].alpha == 1){
                game.add.tween(line4Group.children[i]).from({alpha:1}).to({alpha:0},1000,Phaser.Easing.Linear.none,true)
            }
        }

        for(var i = 0; i < flowerGroup.length; i++){
            if(flowerGroup.children[i].alpha == 1){
                game.add.tween(flowerGroup.children[i]).from({alpha:1}).to({alpha:0},1000,Phaser.Easing.Linear.none,true)
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
        //game.add.tween(madriguera).from({alpha:1}).to({alpha:0},500,Phaser.Easing.Linear.none,true)
        game.add.tween(bee).from({alpha:1}).to({alpha:0},1000,Phaser.Easing.Linear.none,true).onComplete.add(setRound)
        //setRound()
    }

    function createBee(){
        bee = game.add.group()
        var spine =  game.add.spine(0,0,'beeSpine')
        spine.setAnimationByName(0,"IDLE",true)
        spine.setSkinByName("normal")
        spine.scale.setTo(1,1)
        bee.add(spine)
        bee.spine = spine

        sceneGroup.add(bee)

        bee.alpha = 0
    }

    function createFlowers(){
        flowerGroup = game.add.group()
        sceneGroup.add(flowerGroup)

        line4Group = game.add.group()
        sceneGroup.add(line4Group)

        line3Group = game.add.group()
        sceneGroup.add(line3Group)

        line2Group = game.add.group()
        sceneGroup.add(line2Group)

        line1Group = game.add.group()
        sceneGroup.add(line1Group)

        for(var i = 0; i < 10; i++){
           createSingleFlower()
        }
    }

    function getFlower(){
        var r = game.rnd.integerInRange(1,FLOWERS_NUMBER)
        if(r == FLOWERS_NUMBER){
            r = 'normal'
        }
        else{
            r = 'normal'+r
        }
        

        for(var i = 0; i < flowerGroup.length; i++){
            if(!flowerGroup.children[i].visible){
                flowerGroup.children[i].visible = true
                flowerGroup.children[i].spine.setSkinByName(r)
                flowerGroup.children[i].spine.setAnimationByName(0,'IDLE_BASE',true)
                flowerGroup.children[i].spineAlive.setSkinByName(r)
                flowerGroup.children[i].spineAlive.setAnimationByName(0,'IDLE_FLOWER',true)
                flowerGroup.children[i].flowerAlive.alpha = 0
                flowerGroup.children[i].flowerDead.alpha = 1
                flowerGroup.children[i].animation = 'IDLE_BASE'
                return flowerGroup.children[i]
            }
        }

        var flower = createSingleFlower()
        flower.visible = true
        flower.spine.setSkinByName(r)
        flower.spine.setAnimationByName(0,'IDLE_BASE',true)
        flower.spineAlive.setSkinByName(r)
        flower.spineAlive.setAnimationByName(0,'IDLE_FLOWER',true)
        flower.flowerAlive.alpha = 0
        flower.flowerDead.alpha = 1
        return flower
    }

    function createSingleFlower(){
        var group = game.add.group()
        var groupDead = game.add.group()
        var flower = game.add.spine(0,50,'flowerSpine')
        group.alpha = 0
        groupDead.add(flower)
        group.add(groupDead)
        group.flowerDead = groupDead
        group.spine = flower
        flowerGroup.add(group)
        group.animation = 'IDLE_BASE'
        var groupAlive = game.add.group()
        var flowerAlive = game.add.spine(0,50,'flowerSpine')
        groupAlive.add(flowerAlive)
        group.add(groupAlive)
        group.spineAlive = flowerAlive
        group.flowerAlive = groupAlive
        group.visible = false
        return group
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

        var backgroundTile = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.beeTravel','background')
        backgroundGroup.add(backgroundTile)

        var background = game.add.sprite(game.world.centerX,game.world.centerY,'atlas.beeTravel','chess')
        background.anchor.setTo(0.5)
        backgroundGroup.add(background)

        //background = backgroundGroup.create(game.world.centerX,game.world.centerY,'atlas.beeTravel','grid')
        //background.anchor.setTo(0.5,0.5)
        
        gameGroup = game.add.group()
        gameGroup.x = game.world.centerX
        gameGroup.y = game.world.centerY
        sceneGroup.add(gameGroup)


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

        var deltaLine = DELTA_SPACE_X
        horizontalbtm = game.add.bitmapData(deltaLine,14);
        horizontalbtm.ctx.beginPath();
        horizontalbtm.ctx.lineWidth = "15";        
        horizontalbtm.ctx.strokeStyle = 'yellow';   
        //horizontalbtm.ctx.lineDashOffset = DELTA_SPACE/8;      
        horizontalbtm.ctx.setLineDash([deltaLine/8,deltaLine/4,deltaLine/4,deltaLine/4,deltaLine/8]);        
        horizontalbtm.ctx.moveTo(0, 0);        
        horizontalbtm.ctx.lineTo(deltaLine , 0);        
        horizontalbtm.ctx.stroke();       
        horizontalbtm.ctx.closePath();        
        //horizontalLine = game.add.sprite(game.world.centerX, game.world.centerY, horizontalbtm);
        //horizontalLine = game.add.sprite(game.world.centerX+DELTA_SPACE, game.world.centerY, horizontalbtm);
        //horizontalLine.alpha = 0

        deltaLine = DELTA_SPACE_Y
        verticalbtm = game.add.bitmapData(14,deltaLine);
        verticalbtm.ctx.beginPath();
        verticalbtm.ctx.lineWidth = "15";        
        verticalbtm.ctx.strokeStyle = 'yellow'; 
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

        
        createTutorial()

        
        createFlowers()

        createBee()

        createPointsBar()
        createHearts()


        correctParticle = createPart('atlas.beeTravel','star')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)

        //var star = game.add.sprite(space_0.x,space_0.y,'atlas.beeTravel','star')
        //star.anchor.setTo(0.5)

       // var spine = game.add.spine(game.world.centerX,game.world.centerY,'flowerSpine')
        
    
    }
    
	return {
		assets: assets,
		name: "beeTravel",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()



function lerp(a,b,t){
    return a + (b - a) * t;
}