
var soundsPath = "../../shared/minigames/sounds/"

var bondroid = function(){

    var COLOR_ENUM = {
        PURPLE:0x8800ff,
        RED:0xc1272d,
        YELLOW:0xfce303,
        MEXICAN_PINK:0xff00ff,
        PINK:0xfc839d,
        BLUE:0x005af9,
        GREEN:0x0fce00,
    }
    
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
                json: "images/bondroid/atlas.json",
                image: "images/bondroid/atlas.png"
            },
            {   
                name: "atlas.time",
                json: "images/bondroid/timeAtlas.json",
                image: "images/bondroid/timeAtlas.png"
            },

        ],
        images: [
            {   name:"tutorial_image",
				file: "images/bondroid/tutorial_image.png"}
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
                name:'robot1',
                file:'images/spines/robot1/robot1.json'
            },
            {
                name:'robot2',
                file:'images/spines/robot2/robot2.json'
            },
            {
                name:'robot3',
                file:'images/spines/robot3/robot3.json'
            },
            {
                name:'robot4',
                file:'images/spines/robot4/robot4.json'
            },
        ]
    }

    var NUM_LIFES = 3
    var INIT_WALK_SPACES = 4
    var DELTA_WALK_SPACES = 1
    var MAX_WALK_SPACES = 15
    var MIN_SPACES_WALK_IN_LINE = 2
    var X_SPACES = 5
    var DELTA_SPACE_X = 100
    var DELTA_SPACE_Y = 100
    var Y_SPACES = 6
    var INITIAL_TIME = 16000
    var DELTA_TIME = 250
    var MIN_TIME = 10000
    var LEVLES_TO_TIMER = 1

    
    var lives
	var sceneGroup = null
    var gameIndex = 153
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

    var gridArray
    var spacesInLine
    var currentDirection

    var space_0

    var lineGroup

    var canTouch = false
    var touchStarted = false

    var horizontalLine 
    var verticalLine

    var horizontalbtm
    var verticalbtm

    var horizontalGroup
    var verticalGroup
    
    var currentTime
    var correctParticle

    var levelArrays
    var currentPosibleLevels

    var lastLevel
    var buttonsGroup

    var currentInitialButton
    var currentline
    var endLine
    var levelPairs
    var currentPairs

    var currentRobotSpine
    var robotsSpine
    var door_1
    var door_2

    var inTutorial
    var hand
    var tutorialTween

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

        space_0 = {x:game.world.centerX - (((X_SPACES-1)/2)*DELTA_SPACE_X), y: game.world.centerY -(((Y_SPACES-1)/2)*DELTA_SPACE_Y)}

        gridArray = []

        currentLevel = 0
        timeOn = false

        flowersInUse = []
        currentPosibleLevels = [0]
        currentline = []

        endLine = false
        levelPairs = 0
        currentPairs = 0

        robotsSpine = []

        inTutorial = 0

        restartArraySpaces()
        initArrayLevels()

        loadSounds()
        
	}

    function initArrayLevels(){
        levelArrays = []

        var levelTutorial = [[{x1:1,y1:3,color:COLOR_ENUM.MEXICAN_PINK,x2:4,y2:3},{x1:2,y1:1,color:COLOR_ENUM.BLUE,x2:2,y2:4}]]
        
        var levels1 = [
                        [{x1:0,y1:0,color:COLOR_ENUM.BLUE,x2:2,y2:1},{x1:1,y1:4,color:COLOR_ENUM.MEXICAN_PINK,x2:4,y2:3},{x1:2,y1:4,color:COLOR_ENUM.GREEN,x2:4,y2:0}], 
                        [{x1:2,y1:2,color:COLOR_ENUM.GREEN,x2:1,y2:5},{x1:1,y1:3,color:COLOR_ENUM.MEXICAN_PINK,x2:2,y2:1},{x1:1,y1:1,color:COLOR_ENUM.BLUE,x2:4,y2:4}]
                    ]

        var levels2 = [
                        [{x1:0,y1:0,color:COLOR_ENUM.RED,x2:2,y2:3},{x1:1,y1:4,color:COLOR_ENUM.GREEN,x2:4,y2:4},{x1:1,y1:2,color:COLOR_ENUM.BLUE,x2:4,y2:3},{x1:2,y1:0,color:COLOR_ENUM.YELLOW,x2:4,y2:2}], 
                        [{x1:0,y1:0,color:COLOR_ENUM.YELLOW,x2:4,y2:0},{x1:0,y1:1,color:COLOR_ENUM.PINK,x2:0,y2:3},{x1:0,y1:1,color:COLOR_ENUM.RED,x2:3,y2:3},{x1:0,y1:4,color:COLOR_ENUM.GREEN,x2:4,y2:5}],
                        [{x1:0,y1:2,color:COLOR_ENUM.GREEN,x2:3,y2:1},{x1:1,y1:2,color:COLOR_ENUM.PINK,x2:4,y2:2},{x1:4,y1:3,color:COLOR_ENUM.PURPLE,x2:2,y2:5},{x1:1,y1:4,color:COLOR_ENUM.YELLOW,x2:4,y2:4}],
                        [{x1:0,y1:3,color:COLOR_ENUM.BLUE,x2:2,y2:1},{x1:0,y1:2,color:COLOR_ENUM.PINK,x2:3,y2:2},{x1:0,y1:4,color:COLOR_ENUM.RED,x2:3,y2:4},{x1:1,y1:5,color:COLOR_ENUM.GREEN,x2:4,y2:4}],
                    ]

        var levels3 = [
                        [{x1:0,y1:0,color:COLOR_ENUM.RED,x2:0,y2:2},{x1:0,y1:1,color:COLOR_ENUM.GREEN,x2:2,y2:1},{x1:4,y1:0,color:COLOR_ENUM.BLUE,x2:2,y2:3},{x1:1,y1:4,color:COLOR_ENUM.PURPLE,x2:3,y2:3}], 
                        [{x1:0,y1:0,color:COLOR_ENUM.PURPLE,x2:3,y2:1},{x1:2,y1:0,color:COLOR_ENUM.BLUE,x2:0,y2:2},{x1:0,y1:5,color:COLOR_ENUM.RED,x2:2,y2:3},{x1:1,y1:4,color:COLOR_ENUM.GREEN,x2:4,y2:3},{x1:1,y1:5,color:COLOR_ENUM.MEXICAN_PINK,x2:4,y2:5}],
                    ]

        var levels4 = [
                        [{x1:1,y1:0,color:COLOR_ENUM.GREEN,x2:0,y2:3},{x1:1,y1:1,color:COLOR_ENUM.PURPLE,x2:3,y2:1},{x1:2,y1:0,color:COLOR_ENUM.MEXICAN_PINK,x2:4,y2:4},{x1:1,y1:3,color:COLOR_ENUM.RED,x2:3,y2:3},{x1:0,y1:4,color:COLOR_ENUM.BLUE,x2:2,y2:3},{x1:1,y1:5,color:COLOR_ENUM.YELLOW,x2:3,y2:4}], 
                        [{x1:0,y1:0,color:COLOR_ENUM.PINK,x2:2,y2:2},{x1:0,y1:1,color:COLOR_ENUM.YELLOW,x2:3,y2:1},{x1:0,y1:3,color:COLOR_ENUM.BLUE,x2:1,y2:2},{x1:1,y1:3,color:COLOR_ENUM.RED,x2:4,y2:4},{x1:1,y1:4,color:COLOR_ENUM.PURPLE,x2:3,y2:4},{x1:0,y1:4,color:COLOR_ENUM.GREEN,x2:4,y2:5}],
                    ]

        var levels5 = [
                        [{x1:1,y1:0,color:COLOR_ENUM.YELLOW,x2:0,y2:1},{x1:1,y1:1,color:COLOR_ENUM.PINK,x2:3,y2:0},{x1:0,y1:2,color:COLOR_ENUM.RED,x2:4,y2:1},{x1:1,y1:2,color:COLOR_ENUM.BLUE,x2:3,y2:1},{x1:4,y1:0,color:COLOR_ENUM.PURPLE,x2:3,y2:3},{x1:1,y1:3,color:COLOR_ENUM.MEXICAN_PINK,x2:3,y2:5},{x1:3,y1:4,color:COLOR_ENUM.GREEN,x2:4,y2:5}], 
                        [{x1:0,y1:0,color:COLOR_ENUM.GREEN,x2:4,y2:0},{x1:0,y1:1,color:COLOR_ENUM.PURPLE,x2:4,y2:2},{x1:0,y1:3,color:COLOR_ENUM.YELLOW,x2:1,y2:2},{x1:1,y1:3,color:COLOR_ENUM.PINK,x2:3,y2:2},{x1:1,y1:4,color:COLOR_ENUM.BLUE,x2:3,y2:3},{x1:0,y1:4,color:COLOR_ENUM.RED,x2:2,y2:5},{x1:3,y1:5,color:COLOR_ENUM.MEXICAN_PINK,x2:4,y2:3}]
                    ]

        levelArrays.push(levelTutorial)
        levelArrays.push(levels1)
        levelArrays.push(levels2)
        levelArrays.push(levels3)
        levelArrays.push(levels4)
        levelArrays.push(levels5)
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
        game.load.spritesheet("coin", 'images/bondroid/coin.png', 122, 123, 12)
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
           passLevel(false)
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
        
        if(lives === 0){
            stopGame(false)
        }
        /*else{
            nextRound()
        }*/
        
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
            	if(endLine){
            		return
            	}
                var pos = evaluateTouchPosition()
                if(touchStarted){
                    if((pos.x != currentline[currentline.length-1].x || pos.y != currentline[currentline.length-1].y) && !(pos.x ==currentline[currentline.length-2].x && pos.y ==currentline[currentline.length-2].y)){

                        var dX = Math.abs(pos.x - currentline[currentline.length-1].x)
                        var dY = Math.abs(pos.y - currentline[currentline.length-1].y)

                        if(dX + dY == 1){

                            if(!evaluateOcupation(pos)){
                                var line = setLineDirection(pos,currentline[currentline.length-1], currentInitialButton.sprite.tint)
                                currentline.push({x:pos.x, y:pos.y, line:line})
                                
                            }
                            else{
                            	if(pos.x == currentInitialButton.pair.gridX && pos.y == currentInitialButton.pair.gridY){
				                    //endLineOnPoint
				                    var line = setLineDirection(pos,currentline[currentline.length-1], currentInitialButton.sprite.tint)
				                    currentline.push({x:pos.x, y:pos.y, line:line})
				                    for(var i = 0; i < currentline.length; i ++){
				                    	gridArray[currentline[i].x][currentline[i].y] = currentInitialButton.sprite.tint
				                    }
				                    endLine = true
				                    currentPairs ++
				                    currentline = []
				                    console.log(gridArray)
				                    if(inTutorial!=-1){
				                    	inTutorial++
				                    	evalTutorial()
				                    	
				                    }
				                    if(currentPairs == levelPairs){
				                    	hand.visible = false
				                    	passLevel(true)
				                    }
				                    return
				                }
				                else if(gridArray[pos.x][pos.y] != currentInitialButton.sprite.tint){
				                	restartAllLines()


				                }
				                endLine = true
                            	removeCurrentLine()

                            }
                            
                        }
                    }
                }
                else{

                	if(currentInitialButton!=null){

	                    var dX = Math.abs(pos.x - currentInitialButton.gridX)
	                    var dY = Math.abs(pos.y - currentInitialButton.gridY)

	                    if(dX + dY == 1){

	                    	if(!evaluateOcupation(pos)){

		                        touchStarted = true

		                        var line = setLineDirection(pos,{x:currentInitialButton.gridX,y:currentInitialButton.gridY},currentInitialButton.sprite.tint)
		                        currentline.push({x:currentInitialButton.gridX, y:currentInitialButton.gridY, line:line})
		                        currentline.push({x:pos.x, y:pos.y, line:line})
		                    }
		                    else{
		                    	restartAllLines()
		                    	endLine = true
		                    	touchStarted = true
		                    }

	                    }
	                }
                }

                
            }
            else{
                if(touchStarted){
                    if(endLine){
                    	//endTouch correct

                    }
                    else{
                    	//no endTouch correct
                    	removeCurrentLine()
                    }

                    endLine = false
                    touchStarted = false

                }

                currentInitialButton = null
            }
        }
    }

    function restartAllLines(){
    	missPoint()
    	restartArraySpaces()
    	for(var i = 0; i < buttonsGroup.length; i++){
    		console.log(buttonsGroup.children[i].sprite.tint,buttonsGroup.children[i].gridX,buttonsGroup.children[i].gridY)
    		if(buttonsGroup.children[i].visible){
        		gridArray[buttonsGroup.children[i].gridX][buttonsGroup.children[i].gridY] = buttonsGroup.children[i].sprite.tint
        	}
    	}
    	console.log(gridArray)

    	for(var i = 0; i < horizontalGroup.length; i ++){
    		if(horizontalGroup.children[i].visible){
    			horizontalGroup.children[i].visible=false
    		}
    	}

    	for(var i = 0; i < verticalGroup.length; i ++){
    		if(verticalGroup.children[i].visible){
    			verticalGroup.children[i].visible=false
    		}
    	}

    	currentPairs = 0
    }

    function passLevel(win){
    	if(win){
	    	game.add.tween(currentRobotSpine).to({y:game.world.centerY},500,Phaser.Easing.linear,true)
	    }
	    else{
	    	game.add.tween(currentRobotSpine).to({y:game.world.height+700},500,Phaser.Easing.linear,true)
	    }

        game.add.tween(door_1).to({x:game.world.centerX-135},500,Phaser.Easing.linear,true)
        game.add.tween(door_2).to({x:game.world.centerX+135},500,Phaser.Easing.linear,true).onComplete.add(function(){
        	if(win){
	        	Coin({x:game.world.centerX,y:game.world.centerY},pointsBar,100)
	        }
        	setTimeout(function(){nextRound(win)},1000)
        })

    	//Coin({x:game.world.centerX,y:game.world.centerY},pointsBar,100)
    	//addPoint(1)
    	//nextRound()
    }

    function removeCurrentLine(){
    	for(var i = 1; i < currentline.length; i ++){
    		currentline[i].line.visible = false
    		gridArray[currentline[i].x][currentline[i].y] = 0
    	}
    }

    function evaluateOcupation(pos){
        if(gridArray[pos.x][pos.y]==0){
        	console.log("slot empty ",gridArray[pos.x][pos.y],pos,currentInitialButton.sprite.tint)
        	gridArray[pos.x][pos.y] = currentInitialButton.sprite.tint
            return false
            
        }
        else{
            return true
        }
    }

    function setLineDirection(newPos, lastPos, color){
        var d = getDirection(newPos,lastPos)
        var line
        if(d == 0){
            //derecha
            line = getHorizontalLine()
            line.anchor.setTo(0,0.3)

        }
        else if(d == 1){
            //izquierda
            line = getHorizontalLine()
            line.anchor.setTo(1,0.3)

        }
        else if(d == 2){
            //arriba
            line = getVerticalLine()
            line.anchor.setTo(0.3,0)
            
            
        }
        else if(d == 3){
            //Abajo
            line = getVerticalLine()
            line.anchor.setTo(0.3,1)

        }

        line.x = space_0.x + (lastPos.x*DELTA_SPACE_X)
        line.y = space_0.y + (lastPos.y*DELTA_SPACE_Y)
        //console.log(color)
    	line.tint = color
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
        var y = (game.input.activePointer.y - space_0.y)/DELTA_SPACE_Y 
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

    function createButton(button){

        for(var i = 0; i < buttonsGroup.length; i++){
            if(!buttonsGroup.children[i].visible){
                buttonsGroup.children[i].visible = true
                buttonsGroup.children[i].sprite.tint = button.color
                buttonsGroup.children[i].x = space_0.x + (DELTA_SPACE_X*button.x)
                buttonsGroup.children[i].y = space_0.y + (DELTA_SPACE_Y*button.y)
                buttonsGroup.children[i].gridX = button.x
                buttonsGroup.children[i].gridY = button.y
                gridArray[button.x][button.y] = button.color
                return buttonsGroup.children[i]
            }
        }
        var b = game.add.group()
        b.x = space_0.x + (DELTA_SPACE_X*button.x)
        b.y = space_0.y + (DELTA_SPACE_Y*button.y)

        b.gridX = button.x
        b.gridY = button.y


        var stroke = b.create(0,0,'atlas.game','node_stroke')
        stroke.anchor.setTo(0.5)
        b.add(stroke)

        var buttonSprite = b.create(0,0,'atlas.game','node')
        buttonSprite.anchor.setTo(0.5)
        buttonSprite.tint = button.color
        b.add(buttonSprite)
        b.sprite = buttonSprite
        buttonsGroup.add(b)
        buttonSprite.inputEnabled = true
        buttonSprite.events.onInputDown.add(clickButton,this)

        gridArray[button.x][button.y] = button.color

        return b
    }

    function clickButton(button,pointer){

    	if(inTutorial!=-1){
    		if((inTutorial==0 && button.tint!=COLOR_ENUM.MEXICAN_PINK)||(inTutorial==1 && button.tint!=COLOR_ENUM.BLUE)){
    			return
    		}
    	}
    	console.log("click button ", button.parent)
        canTouch = true
        currentInitialButton = button.parent
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
        
        if(currentLevel==1){
            currentPosibleLevels = [1]
        }
        else if(currentLevel==3){
            currentPosibleLevels = [2]
        }
        else if(currentLevel==5){
            currentPosibleLevels = [3]
        }
        else if(currentLevel==6){
            currentPosibleLevels= [2,3]
        }
        else if(currentLevel==8){
            currentPosibleLevels =[4]
        }
        else if(currentLevel==9){
            currentPosibleLevels =[5]
        }
        else if(currentLevel==10){
            currentPosibleLevels =[3,4,5]
        }

        if(timeOn){
            startTimer(currentTime)
            if(currentTime > MIN_TIME){
                currentTime -= DELTA_TIME
            }
        }

        levelPairs = 0
        currentPairs = 0 
        canTouch = true

        currentline = []


        restartArraySpaces()

        var difficult = game.rnd.integerInRange(0,currentPosibleLevels.length-1)
        difficult = currentPosibleLevels[difficult]
        console.log(difficult)
        var level = game.rnd.integerInRange(0,levelArrays[difficult].length-1)

        if(lastLevel!=null){
            if(lastLevel.difficult == difficult && lastLevel.level == level){
                level++
                if(level>=levelArrays[difficult].length){
                    level = 0
                }
            }
        }

        lastLevel = {difficult: difficult,level:level}

        level = levelArrays[difficult][level]

        levelPairs = level.length
        for(var i = 0; i < level.length; i++){
            var b1 = createButton({x:level[i].x1,y:level[i].y1,color:level[i].color})
            var b2 = createButton({x:level[i].x2,y:level[i].y2,color:level[i].color})
            b1.pair = b2
            b2.pair = b1
        }

        game.add.tween(buttonsGroup).to({alpha:1},1000,Phaser.Easing.linear,true)
        game.add.tween(verticalGroup).to({alpha:1},1000,Phaser.Easing.linear,true)
        game.add.tween(horizontalGroup).to({alpha:1},1000,Phaser.Easing.linear,true)

        currentRobotSpine = robotsSpine[game.rnd.integerInRange(0,robotsSpine.length-1)]
        currentRobotSpine.x = game.world.centerX
        currentRobotSpine.y = game.world.height+400

        game.add.tween(currentRobotSpine).to({y:game.world.centerY+600},500,Phaser.Easing.linear,true)

        game.add.tween(door_1).to({x:game.world.centerX-400},500,Phaser.Easing.linear,true)
        game.add.tween(door_2).to({x:game.world.centerX+400},500,Phaser.Easing.linear,true)


        if(inTutorial!=-1){
        	setTimeout(evalTutorial,500)
            
        }

    }


    function nextRound(win){

    	//Coin({x:game.world.centerX,y:game.world.centerY},pointsBar,100)

    	canTouch = false

        currentLevel ++

        if(currentLevel > LEVLES_TO_TIMER){
            if(!timeOn){
               timeOn = true
               positionTimer()
            }
        }
        if(win){
	        game.add.tween(currentRobotSpine).to({y:-300},1000,Phaser.Easing.linear,true)
	    }


        //game.add.tween(door_1).to({x:game.world.centerX-400},500,Phaser.Easing.linear,true)
        //game.add.tween(door_2).to({x:game.world.centerX+400},500,Phaser.Easing.linear,true)

        game.add.tween(buttonsGroup).to({alpha:0},1000,Phaser.Easing.linear,true).onComplete.add(function(){
        	for(var i = 0; i < buttonsGroup.length; i ++){
        		if(buttonsGroup.children[i].visible){
        			buttonsGroup.children[i].visible=false
        		}
        	}
        })

        game.add.tween(horizontalGroup).to({alpha:0},1000,Phaser.Easing.linear,true).onComplete.add(function(){
        	for(var i = 0; i < horizontalGroup.length; i ++){
        		if(horizontalGroup.children[i].visible){
        			horizontalGroup.children[i].visible=false
        		}
        	}
        })

        game.add.tween(verticalGroup).to({alpha:0},1000,Phaser.Easing.linear,true).onComplete.add(function(){
        	for(var i = 0; i < verticalGroup.length; i ++){
        		if(verticalGroup.children[i].visible){
        			verticalGroup.children[i].visible=false
        		}
        	}

        	setRound()
        })




    }

    function evalTutorial(){
    	if(tutorialTween !=null){
    		return
    	}

    	hand.visible = true
    	switch(inTutorial){
    		case 0:
    		hand.loadTexture('atlas.game','handDown')
    		hand.x = buttonsGroup.children[0].x+50
    		hand.y = buttonsGroup.children[0].y+50
    		tutorialTween = game.add.tween(hand).to({x:buttonsGroup.children[1].x,y:buttonsGroup.children[1].y+50},1000,Phaser.Easing.linear,true)
    		tutorialTween.onComplete.add(function(){
    			tutorialTween = null
    			hand.loadTexture('atlas.game','handUp')
    			setTimeout(evalTutorial,500)
    		})
    		break

    		case 1:
    		hand.loadTexture('atlas.game','handDown')
    		hand.x = buttonsGroup.children[2].x+50
    		hand.y = buttonsGroup.children[2].y+50
    		tutorialTween = game.add.tween(hand).to({x:space_0.x+(DELTA_SPACE_X*0.5),y:space_0.y+(DELTA_SPACE_Y*1.5)},1000,Phaser.Easing.linear,true)
    		tutorialTween.onComplete.add(function(){
    			tutorialTween = game.add.tween(hand).to({x:space_0.x+(DELTA_SPACE_X*0.5),y:space_0.y+(DELTA_SPACE_Y*4.5)},1000,Phaser.Easing.linear,true)
    			tutorialTween.onComplete.add(function(){
    				tutorialTween = game.add.tween(hand).to({x:space_0.x+(DELTA_SPACE_X*2.5),y:space_0.y+(DELTA_SPACE_Y*4.5)},1000,Phaser.Easing.linear,true)
    				tutorialTween.onComplete.add(function(){
    					tutorialTween = null
    					hand.loadTexture('atlas.game','handUp')
    					setTimeout(evalTutorial,500)
    				})
    			})
    		})
    		break
    		default:
    		inTutorial = -1
    		hand.visible = false
    		break
    	}
    }


    function getHorizontalLine(){
        //console.log("generete horizontal line")
        for(var i = 0; i < horizontalGroup.length; i++){
            if(!horizontalGroup.children[i].visible){
                horizontalGroup.children[i].visible = true
                return horizontalGroup.children[i]
            }
        }

        var h = horizontalGroup.create(0,0,horizontalbtm)
        return h
    }

    function getVerticalLine(){
        for(var i = 0; i < verticalGroup.length; i++){
            if(!verticalGroup.children[i].visible){
                verticalGroup.children[i].visible = true
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

        var background = game.add.graphics(0,0)
        background.beginFill(0xfcd200)
        background.drawRect(0,0,game.world.width,game.world.height)
        background.endFill()
        backgroundGroup.add(background)

        var background_extra = backgroundGroup.create(game.world.centerX,game.world.centerY-350,'atlas.game','background_rig')
        background_extra.anchor.setTo(0.5)

        background_extra = backgroundGroup.create(game.world.centerX,game.world.centerY+350,'atlas.game','background_rig')
        background_extra.anchor.setTo(0.5)
        background_extra.angle = 180

        var backgroundTile = game.add.tileSprite(game.world.centerX - ((X_SPACES/2)*DELTA_SPACE_X),game.world.centerY - ((Y_SPACES/2)*DELTA_SPACE_Y),DELTA_SPACE_X*X_SPACES,DELTA_SPACE_Y*Y_SPACES,'atlas.game','board')
        backgroundGroup.add(backgroundTile)

        var topLefCorner = {x:game.world.centerX - ((X_SPACES/2)*DELTA_SPACE_X),y:game.world.centerY - ((Y_SPACES/2)*DELTA_SPACE_Y)}
        var lineBackground = game.add.graphics(0,0)

        for(var i = 0; i <= X_SPACES; i++){
            lineBackground.lineStyle(2, 0xffffff);
            lineBackground.moveTo(topLefCorner.x +(DELTA_SPACE_X*i),topLefCorner.y);
            lineBackground.lineTo(topLefCorner.x +(DELTA_SPACE_X*i), topLefCorner.y + backgroundTile.height );
        }

        for(var i = 0; i <= Y_SPACES; i++){
            lineBackground.lineStyle(2, 0xffffff);
            lineBackground.moveTo(topLefCorner.x ,topLefCorner.y+(DELTA_SPACE_Y*i));
            lineBackground.lineTo(topLefCorner.x+ backgroundTile.width, topLefCorner.y +(DELTA_SPACE_X*i) );
        }
        backgroundGroup.add(lineBackground)

        //background = backgroundGroup.create(game.world.centerX,game.world.centerY,'atlas.bondroid','grid')
        //background.anchor.setTo(0.5,0.5)

        initialize()
        
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

        var deltaLine = DELTA_SPACE_X+10
        horizontalbtm = game.add.bitmapData(deltaLine,40);
        horizontalbtm.ctx.beginPath();
        horizontalbtm.ctx.lineWidth = "40";        
        horizontalbtm.ctx.strokeStyle = 'white';   
        //horizontalbtm.ctx.lineDashOffset = DELTA_SPACE/8;      
        //horizontalbtm.ctx.setLineDash([deltaLine/8,deltaLine/4,deltaLine/4,deltaLine/4,deltaLine/8]);        
        horizontalbtm.ctx.moveTo(0, 0);        
        horizontalbtm.ctx.lineTo(deltaLine , 0);        
        horizontalbtm.ctx.stroke();       
        horizontalbtm.ctx.closePath();        
        //horizontalLine = game.add.sprite(game.world.centerX, game.world.centerY, horizontalbtm);
        //horizontalLine = game.add.sprite(game.world.centerX+DELTA_SPACE, game.world.centerY, horizontalbtm);
        //horizontalLine.alpha = 0

        deltaLine = DELTA_SPACE_Y+10
        verticalbtm = game.add.bitmapData(40,deltaLine);
        verticalbtm.ctx.beginPath();
        verticalbtm.ctx.lineWidth = "40";        
        verticalbtm.ctx.strokeStyle = 'white'; 
        //verticalbtm.ctx.lineDashOffset = DELTA_SPACE/8;        
        //verticalbtm.ctx.setLineDash([deltaLine/8,deltaLine/4,deltaLine/4,deltaLine/4,deltaLine/8]);         
        verticalbtm.ctx.moveTo(0, 0);        
        verticalbtm.ctx.lineTo(0,deltaLine);        
        verticalbtm.ctx.stroke();        
        verticalbtm.ctx.closePath();        
        //verticalLine = game.add.sprite(game.world.centerX, game.world.centerY, verticalbtm);
        //verticalLine = game.add.sprite(game.world.centerX+DELTA_SPACE, game.world.centerY, verticalbtm);
        //verticalLine.anchor.setTo(0,1)
        //verticalLine.alpha = 0

        
        
        

        horizontalGroup = game.add.group()
        sceneGroup.add(horizontalGroup)
        horizontalGroup.alpha =0
        verticalGroup = game.add.group()
        sceneGroup.add(verticalGroup)
        verticalGroup.alpha = 0

        buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        buttonsGroup.alpha = 0

        door_1 = sceneGroup.create(game.world.centerX-134,game.world.centerY,'atlas.game','door')
        door_1.anchor.setTo(0.5)

        door_2 = sceneGroup.create(game.world.centerX+134,game.world.centerY,'atlas.game','door')
        door_2.scale.setTo(-1,1)
        door_2.anchor.setTo(0.5)
        


        for(var i = 1; i < 5; i++){
        	var spine = game.add.spine(-500,-500,'robot'+i)
        	spine.setSkinByName('normal')
        	spine.setAnimationByName(0,'idle',true)
        	sceneGroup.add(spine)
        	robotsSpine.push(spine)
        }

        hand = sceneGroup.create(0,0,'atlas.game','handUp')
        hand.anchor.setTo(0.5)
        hand.visible = false
        
        createTutorial()


        createPointsBar()
        createHearts()


        correctParticle = createPart('atlas.game','star')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)

        //var star = game.add.sprite(space_0.x,space_0.y,'atlas.bondroid','star')
        //star.anchor.setTo(0.5)

       // var spine = game.add.spine(game.world.centerX,game.world.centerY,'flowerSpine')
        
    
    }
    
	return {
		assets: assets,
		name: "bondroid",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()



function lerp(a,b,t){
    return a + (b - a) * t;
}