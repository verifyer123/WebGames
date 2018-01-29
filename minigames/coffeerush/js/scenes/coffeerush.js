var soundsPath = "../../shared/minigames/sounds/"
var coffeerush = function(){
	assets = {
        atlases: [
            {   
                name: "atlas.coffeerush",
                json: "images/coffeerush/atlas.json",
                image: "images/coffeerush/atlas.png",
            },
        ],
        /*images: [
            {   name:"fondo",
				file: "images/coffeerush/fondo.png"},
		],*/
		sounds: [
            {	name: "pop",
				file: soundsPath + "magic.mp3"},
            {	name: "splash",
				file: soundsPath + "splashMud.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
			{	name: "explode",
				file: soundsPath + "explode.mp3"},
            {	name: "shootBall",
				file: soundsPath + "shootBall.mp3"},
            {	name: "click",
				file: soundsPath + "pop.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "bomb",
				file: soundsPath + "bomb.mp3"},
		],
	}
    
    var SPEED = 5
    var GRAVITY_OBJECTS = 4
    var GRAVITY_GUMS = 4
    var OBJ_TIME = 1300
    var ITEM_TIME = 800
    var skinTable
    
    var gameIndex = 17
    var marioSong = null
	var sceneGroup = null
    var answersGroup = null
    var pointsGroup = null
    var questionText = null
    var questionGroup = null
    var purpleBack = null
    var gameActive = true
    var valuesList = null
    var objectsGroup
    var characterGroup = null
    var timer
    var timeGroup = null
    var pointsBar = null

    var lives = null
    var particlesGroup
    var particlesUsed
    var heartsGroup = null
    var leftKey = null
    var rightKey = null
    var upKey = null
    var downKey = null
    var buddy = null
    var buddy_result = null

    var arrayObstcales


    var INITIAL_VELOCITY = 2
    //var INITIAL_VELOCITY = 0
    var DELTA_VELOCITY = 0.1
    var TOUCH_MINIMUN_DELTA = 50
    var DELTA_LIMIT_APPEAR_CORRECT = 85
    var DELTA_LIMIT_APPEAR_CORRECT_Y = 100
    var limitHorizontal = null
    var limitlVertical = null
    var playerCollision = null
    var correctObject = null
    var touchPosition = null
    var TOUCH_BY_BUTTONS = true
    var currentSpeed = null
    var NUMBER_OBSTACLES = 6
    var INITIAL_OBSTCALES = 3

    var isRunning
    var isTouchAvailable
    var background

    
    function getSkins(){
        
        var dataStore = amazing.getProfile()

        if(!dataStore){
            skinTable = [1,1,1,1]
        }else{

            skinTable = dataStore
        }

    }
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = true
        lives = 1
        skinTable = []
        itemList = ['chip']
        arrayObstcales = [0,1,2,3,4,5]
        isRunning = false
        isTouchAvailable = false
	}
    

    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)        
        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        gameActive = true

    }
    
    function checkNumbers(){

        var valuesCompare = [1,2,3,4]
        var tableCompare = [0,0,0,0]
        
        for(var i = 0 ; i < valuesCompare.length;i++){
            
            for(var e = 0; e < valuesList.length;e++){
                if(valuesCompare[i] == valuesList[e]){
                    tableCompare[i]++
                }
            }
        }

        var indexToUse = 0
        var findNumber = false
        for(var i = 0;i < tableCompare.length;i++){
            indexToUse = i
            for(var u = 0;u<tableCompare.length;u++){
                if (i != u){
                    if (tableCompare[i] < tableCompare[u]){
                        break
                    }
                }
                if(u == tableCompare.length - 1){
                    findNumber = true
                }
            }
            if (findNumber == true){
                break
            }
        }
        return indexToUse
    }
    
    function changeImage(index,group){
        for (var i = 0; i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    }    
    
    
    function preload() {
        
		game.forceSingleUpdate = true
        game.stage.disableVisibilityChange = false;
        game.load.spine('mascot', "images/spines/skeleton.json");
        game.load.spine('mascot_result', "images/spines/resultSpine/skeleton_result.json");
        game.load.spine('clock_circle', "images/spines/clock_circle/clock_circle.json");
        game.load.spine('clock_cup', "images/spines/clock_cup/clock_cup.json");
        game.load.spine('clock_large', "images/spines/clock_large/clock_large.json");
        game.load.spine('clock_square', "images/spines/clock_square/clock_square.json");
        game.load.spine('clock_teapot', "images/spines/clock_teapot/clock_teapot.json");
        game.load.spine('clock_triangle', "images/spines/clock_triangle/clock_triangle.json");
        		
		if(amazing.getMinigameId()){
			marioSong = sound.setSong(soundsPath + 'songs/classic_arcade.mp3',0.3)
		}else{
			game.load.audio('arcadeSong', soundsPath + 'songs/classic_arcade.mp3');
		}
		
    }
    
   
    
    function createControls(){
        
    	//Create bottom space where UI bottons and touch are
        var spaceButtons = 220
        
        var bottomRect = new Phaser.Graphics(game)
        bottomRect.beginFill(0xd80322);
        bottomRect.drawRect(0, game.world.height, game.world.width, -game.world.height * 0.3);
        bottomRect.endFill();
        bottomRect.anchor.setTo(0,1)
        sceneGroup.add(bottomRect)
        sceneGroup.bottomRect = bottomRect

        var buttonsGroup = game.add.group()
        buttonsGroup.x = game.world.centerX
        buttonsGroup.y = game.world.height - bottomRect.height/2


        var logo = buttonsGroup.create(0, 0, 'atlas.coffeerush', 'delicafe_logo')
        logo.anchor.setTo(0.5,0.5)

        var button = new Phaser.Graphics(game)
        button.beginFill(0x8c0316);
        button.drawRoundedRect(-30, -110, 60, 60, 10)
        button.endFill();
        button.anchor.setTo(0.5,0.5)
        buttonsGroup.add(button)

        var buttonArrow = buttonsGroup.create(0,-80,'atlas.coffeerush', 'flecha')
        buttonArrow.anchor.setTo(0.5,0.5)


        button = new Phaser.Graphics(game)
        button.beginFill(0x8c0316);
        button.drawRoundedRect(-30, 50, 60, 60, 10)
        button.endFill();
        button.anchor.setTo(0.5,0.5)
        buttonsGroup.add(button)
        

       	buttonArrow = buttonsGroup.create(0,80,'atlas.coffeerush', 'flecha')
        buttonArrow.anchor.setTo(0.5,0.5)
        buttonArrow.angle = 180


        button = new Phaser.Graphics(game)
        button.beginFill(0x8c0316);
        button.drawRoundedRect(130, -30, 60, 60, 10)
        button.endFill();
        button.anchor.setTo(0.5,0.5)
        buttonsGroup.add(button)

       	buttonArrow = buttonsGroup.create(160,0,'atlas.coffeerush', 'flecha')
        buttonArrow.anchor.setTo(0.5,0.5)
        buttonArrow.angle = 90


        button = new Phaser.Graphics(game)
        button.beginFill(0x8c0316);
        button.drawRoundedRect(-190, -30, 60, 60, 10)
        button.endFill();
        button.anchor.setTo(0.5,0.5)
        buttonsGroup.add(button)

       	buttonArrow = buttonsGroup.create(-160,0,'atlas.coffeerush', 'flecha')
        buttonArrow.anchor.setTo(0.5,0.5)
        buttonArrow.angle = 270

        sceneGroup.add(buttonsGroup)
        
    }


    function createObstacles(){

    	//Obstacles that are in move init

        var arrayPosition = [{x:game.world.width*0.2, y: game.world.height*0.6},{x:game.world.width*0.7, y: game.world.height*0.6},{x:game.world.width*0.2, y: game.world.height*0.1},{x:game.world.width*0.7, y: game.world.height*0.1}]

        var length = arrayPosition.length
        for(var i = 0; i < INITIAL_OBSTCALES; i++){
            var r = game.rnd.integerInRange(0,arrayPosition.length-1)
            var p = arrayPosition[r]
            arrayPosition.splice(r,1)
           
            var random_clock = game.rnd.integerInRange(0,arrayObstcales.length-1)

            createNewObstacle(arrayObstcales[random_clock],p)

            arrayObstcales.splice(random_clock,1)

        }
    }


    function createCorrect(){
    	//Object that give points init
    	correctObject = game.add.sprite(0,0,'atlas.coffeerush','cafe')
    	correctObject.anchor.setTo(0.5)
        game.physics.arcade.enable(correctObject,true)
        sceneGroup.add(correctObject)
        correctObject.tag="correct"
        changeCorrectPosition()

    }

    function changeCorrectPosition(){
    	// When character collision with the correct object this need to chage position
    	var minX = limitHorizontal.min+50
    	var maxX = limitHorizontal.max-50
    	var minY = limitlVertical.min+50
    	var maxY = limitlVertical.max-50


    	//Code to obtain a position that is not in the seam position of the character
    	var randomCheck = game.rnd.integerInRange(0,1)

    	if(randomCheck==0){
    		if(characterGroup.x < game.world.centerX){
    			minX = game.world.centerX + DELTA_LIMIT_APPEAR_CORRECT
    		}
    		else{
    			maxX = game.world.centerX - DELTA_LIMIT_APPEAR_CORRECT
    		}
    	}
    	else{
    		if(characterGroup.y < game.world.centerY){
    			minY = background.centerY + DELTA_LIMIT_APPEAR_CORRECT_Y
    		}
    		else{
    			maxY = background.centerY - DELTA_LIMIT_APPEAR_CORRECT_Y
    		}
    	}

    	var rX = game.rnd.integerInRange(minX, maxX)
    	var rY = game.rnd.integerInRange(minY, maxY)
        //var rX = game.world.centerX 
        //var rY = background.centerY + DELTA_LIMIT_APPEAR_CORRECT_Y
    	//

    	correctObject.x = rX
    	correctObject.y = rY
    }
    
    function moveRight(){
        characterGroup.x+=currentSpeed;
        if (characterGroup.x>=limitHorizontal.max){
            characterGroup.x = limitHorizontal.max
        }
    }
    
    function moveLeft(){
        characterGroup.x-=currentSpeed;
        if (characterGroup.x<=limitHorizontal.min){
            characterGroup.x = limitHorizontal.min
        }
    }

    function moveUp(){
        characterGroup.y-=currentSpeed;
        if (characterGroup.y<=limitlVertical.min){
            characterGroup.y = limitlVertical.min
        }
    }

    function moveDown(){
        characterGroup.y+=currentSpeed;
        if (characterGroup.y>=limitlVertical.max){
            characterGroup.y = limitlVertical.max
        }
    }


    function moveHorizontal(speed){
    	
    	characterGroup.x+=speed;
        if (characterGroup.x>=limitHorizontal.max){
            characterGroup.x = limitHorizontal.max
            return false
        }
        else if (characterGroup.x<=limitHorizontal.min){
            characterGroup.x = limitHorizontal.min
            return false
        }

        if(speed>0){
			characterGroup.scale.x = 1
    	}
    	else if(speed<0){
    		characterGroup.scale.x = -1
    	}
    	if(speed==0){
    		return false
    	}
    	else{
	        return true
	    }
    }

    function moveVertical(speed){
    	characterGroup.y+=speed;
    	if (characterGroup.y>=limitlVertical.max){
            characterGroup.y = limitlVertical.max
            return false
        }
        else if (characterGroup.y<=limitlVertical.min){
            characterGroup.y = limitlVertical.min
            return false
        }
        

        if(speed==0){
    		return false
    	}
    	else{
	        return true
	    }
    }
    
    function stopGame(win){
        heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        gameActive = false
        
        /*var newSkin = buddy.createCombinedSkin(
            'combined2',     
            'glasses' + skinTable[0] + '_Sad',        
            'hair' +  skinTable[1],
            'skin' + skinTable[2],
            'torso' + skinTable[3],
            'vaso'
        );
        
        buddy.setSkinByName('combined2')
        
        buddy.setToSetupPose()
        
        buddy.setAnimationByName(0,"LOSE",0.6)*/
        
		if(amazing.getMinigameId()){
			marioSong.pause()
		}else{
			marioSong.stop()
		}
                
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)
		
            sceneloader.show("result")
		})
    }
    
    function addPoint(number,obj){
        
        sound.play("pop")
        createPart('star', obj)
        createTextPart('+' + number, obj)
        
        pointsBar.number+= number

        if(pointsBar.number%5==0){
        	if(pointsBar.number < NUMBER_OBSTACLES*5){
        		var p = {x:0, y:0}

        		var r = game.rnd.integerInRange(0,1)
        		if(r == 0){
        			p.x = limitHorizontal.min-300
        		}
        		else{
        			p.x = limitHorizontal.max+300
        		}

        		p.y = game.rnd.integerInRange(limitlVertical.min,limitlVertical.max)

        		var random_clock = game.rnd.integerInRange(0,arrayObstcales.length-1)

            	createNewObstacle(arrayObstcales[random_clock],p)

            	arrayObstcales.splice(random_clock,1)
        	}
        }

        pointsBar.text.setText(pointsBar.number)
   
    }

    function createNewObstacle(id, p){

    	switch(id){
            case 0:
            name = "clock_circle"
            break
            case 1:
            name = "clock_cup"
            break
            case 2:
            name = "clock_large"
            break
            case 3:
            name = "clock_square"
            break
            case 4:
            name = "clock_teapot"
            break
            case 5:
            name = "clock_triangle"
            break
        }

        var group = game.add.group()
        group.x = p.x
        group.y = p.y

        var o = game.add.spine(0,0,name)
        o.setAnimationByName(0,"IDLE",true)
        o.setSkinByName("normal")
        o.scale.setTo(0.7,0.7)
        group.add(o)

        objectsGroup.add(group)


        var velX = game.rnd.realInRange(0.2,0.8)
        velX = velX*INITIAL_VELOCITY
        var velY = INITIAL_VELOCITY - velX
        var r = game.rnd.integerInRange(0,1)

        if(r == 0){
            r = -1
        }

        group.velX = r*velX

        r = game.rnd.integerInRange(0,1)

        if(r == 0){
            r = -1
        }

        group.velY = r*velY

        //collision of obstacle
        var collision = game.add.sprite(0,0,'atlas.coffeerush','reloj_'+id)
        game.physics.arcade.enable(collision)
        collision.anchor.setTo(0.5,0.5)
        collision.scale.setTo(0.7,0.7)
        //collision.visible = false
        collision.alpha = 0
        //collision.body.setCircle(35)
        collision.tag="wrong"

        group.collision = collision
        group.add(collision)

        //o.x = collision.width/2
        o.y = collision.height/2
    }
    
    function collideCorrect(obj){
        // Correct object collision function
        plusVelocity()
        addPoint(1,obj)
        changeCorrectPosition()
        
    }

    function collideWrong(obj){
    	//Obstacle object collision function
        /*buddy.setAnimationByName(0,"LOSE",false)
        var newSkin = buddy.createCombinedSkin(
            'combined2', 
            "LOSE",
            'glasses' + skinTable[0] + '_Sad',        
            'hair' +  skinTable[1], 
            'skin' + skinTable[2], 
            'torso' + skinTable[3]
        );
        buddy.setSkinByName('combined2')
        buddy.setToSetupPose()*/

        buddy.visible = false
        buddy_result.visible = true

    	createPart('wrong', obj)
    	stopGame()

    }

    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        group.create(0,0,'atlas.coffeerush','life_box')

        pivotX+= 47
        
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = 2
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }


    function plusVelocity(){
    	//When player collide whith correct object, a deltaVelocity value is added to currentVelocity of each obstacle
    	for(var i = 0; i < objectsGroup.length;i++){
            var obj = objectsGroup.children[i]
           	var directionX = obj.velX/Math.abs(obj.velX)
           	var directionY = obj.velY/Math.abs(obj.velY)

           	obj.velX+=directionX*DELTA_VELOCITY;
           	obj.velY+=directionY*DELTA_VELOCITY;
        }
    }

    
    function update(){
        
        if(gameActive == false){
            return
        }
        var keyDownHorizontal = false

        if(leftKey.isDown){
        	
            //moveLeft()
            keyDownHorizontal = moveHorizontal(-SPEED)
            //characterGroup.scale.x = -1
        }
        else if(rightKey.isDown){
            //moveRight()
            
            keyDownHorizontal = moveHorizontal(SPEED)
            
        }

        var keyDownVertical = false
        if(upKey.isDown){
        	
        	keyDownVertical = moveVertical(-SPEED)
            //moveUp()
        }
        else if(downKey.isDown){
        	
        	keyDownVertical = moveVertical(SPEED)
            //moveDown()
        }

        


        //Obstacles update Velocity
        for(var i = 0; i < objectsGroup.length;i++){
            var obj = objectsGroup.children[i]
            obj.x += obj.velX
            obj.y += obj.velY

            if(obj.x <= limitHorizontal.min){
                //obj.x = limitHorizontal.min
                if(obj.velX < 0){
	                obj.velX = -obj.velX
	            }
            }
            else if(obj.x>= limitHorizontal.max){
                //obj.x = limitHorizontal.max
                if(obj.velX > 0){
	                obj.velX = -obj.velX
	            }
            }

            if(obj.y <= limitlVertical.min){
                obj.y = limitlVertical.min
                obj.velY = -obj.velY
            }
            else if(obj.y>= limitlVertical.max){
                obj.y = limitlVertical.max
                obj.velY = -obj.velY
            }

            //obj.collision.x = obj.x
            //obj.collision.y = obj.y

            game.physics.arcade.collide(playerCollision, obj.collision, collisionEnter, null, this);
            //game.debug.body(obj.collision)
        }

        //Check if there is a touch on screen

        var canRunTouch2 = false, canRunTouch1 = false
        if(game.input.pointer2.isDown){
        	isTouchAvailable = true
        	canRunTouch2 = buttonsUpdate(game.input.pointer2.x, game.input.pointer2.y)
        }
        else if(game.input.pointer1.isDown){
        	isTouchAvailable = true
	        canRunTouch1 = buttonsUpdate(game.input.pointer1.x, game.input.pointer1.y)
        }


        if(isTouchAvailable){
	        if(canRunTouch2 || canRunTouch1){
	        	if(!isRunning){
		        	buddy.setAnimationByName(0,"RUN",true)
		        	isRunning = true
		        }
	        }
	        else{
	        	if(isRunning){
	        		isRunning = false
		        	buddy.setAnimationByName(0,"IDLE",true)
		        }
	        }
	    }
	    else{
	    	if(keyDownVertical || keyDownHorizontal){
	        	if(!isRunning){
		        	buddy.setAnimationByName(0,"RUN",true)
		        	isRunning = true
		        }
	        }
	        else{
	        	if(isRunning){
	        		isRunning = false
		        	buddy.setAnimationByName(0,"IDLE",true)
		        }
	        }
	    }

        if(game.input.mousePointer.isDown){
        	
	        buttonsUpdate(game.input.mousePointer.x, game.input.mousePointer.y)
	        
        }




        if(!game.input.pointer1.isDown && !game.input.pointer1.isDown && !game.input.mousePointer.isDown){

        	touchPosition.x = -1
        	touchPosition.y = -1
        }


        game.physics.arcade.collide(playerCollision, correctObject, collisionEnter, null, this);

        //console.log(game.input.pointer1)

        
    }

    function touchUpdate(x,y){

    	//evaluate position of touch and decide where player need to move

    	if(y > limitlVertical.max +50){

        	if(touchPosition.x == -1){

        		// touch start
        		touchPosition.x = x
        		touchPosition.y = y

        	}
        	else{

        		if(Math.abs(x-touchPosition.x)>TOUCH_MINIMUN_DELTA){
	        		if(x > touchPosition.x ){
	        			moveRight()
	        		}
	        		else if(x < touchPosition.x){
	        			moveLeft()
	        		}
	        	}

	        	if(Math.abs(y-touchPosition.y)>TOUCH_MINIMUN_DELTA){
	        		if(y > touchPosition.y ){
	        			moveDown()
	        		}
	        		else if(y < touchPosition.y){
	        			moveUp()
	        		}
	        	}

        	}
        }	
    }


    function buttonsUpdate(x,y){
    	// touch update that decide the direction depending where the touch is and its position 
    	// vs the cener of the touchzone
    	// speed horizontal and vertical are calculated separately
    	if(y > limitlVertical.max){
    		var directionHorizontal = 0
    		if(x < game.world.centerX){
    			directionHorizontal = -1
    		}
    		else{
    			directionHorizontal = 1
    		}

    		var deltaX = x - game.world.centerX
    		var xSpeed = 0
			if(Math.abs(deltaX) > 40){
				xSpeed = directionHorizontal*SPEED
			}
			else{
				xSpeed = 0
			}


			

			var directionVertical =0
    		var midiumTouchZone = game.world.height - (limitlVertical.max +50)
    		midiumTouchZone = game.world.height - (midiumTouchZone/2)
    		if(y < midiumTouchZone){
    			directionVertical = -1
    		}
    		else{
    			directionVertical = 1
    		}


			var deltaY = y - midiumTouchZone
			var ySpeed = 0
			if(Math.abs(deltaY) > 40){
				ySpeed = directionVertical*SPEED
			}
			else{
				ySpeed = 0
			}

			if(xSpeed != 0 && ySpeed!= 0){
				if(deltaY < deltaX){
					ySpeed = 0
				}
				else{
					xSpeed = 0
				}
			}

			var canRunHorizontal = moveHorizontal(xSpeed)
			var canRunVertical = moveVertical(ySpeed)

			if(canRunHorizontal || canRunVertical){
				return true
			}
			else{
				return false
			}

    	}
    }
    
    function createTime(){
        
        timeGroup = game.add.group()
        timeGroup.x = game.world.right
        timeGroup.y = 0
        sceneGroup.add(timeGroup)
        
        var timeImg = timeGroup.create(0,0,'atlas.coffeerush','time')
        timeImg.width*=1.3
        timeImg.height*=1.3
        timeImg.anchor.setTo(1,0)
        
        var fontStyle = {font: "27px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var timerText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        timerText.x = -timeImg.width * 0.55
        timerText.y = timeImg.height * 0.18
        timeGroup.add(timerText)
        
        timeGroup.textI = timerText
        timeGroup.number = 0
        
        timer = game.time.create(false);
        timer.loop(1, updateSeconds, this);
                
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(0,10,'atlas.coffeerush','xpcoins')
        pointsImg.x = game.world.width - pointsImg.width * 1.2
        pointsImg.width *=1
        pointsImg.height *=1
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.75
        pointsText.y = pointsImg.height * 0.3
        pointsBar.add(pointsText)
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }
    
    
     function updateSeconds(){
        
        timeGroup.number += 1;
        timeGroup.textI.setText(timeGroup.number / 100)
        
    }
    
    
    function createTextPart(text,obj){
        
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = lookParticle('textPart')
        
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y - 60
            pointsText.setText(text)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
        
    }
    
    function lookParticle(key){
        
        for(var i = 0;i<particlesGroup.length;i++){
            
            var particle = particlesGroup.children[i]
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
    
    function createPart(key,obj){
        
        key+='Part'
        var particle = lookParticle(key)
        if(particle){
            
            particle.x = obj.x
            particle.y = obj.y
            particle.scale.setTo(1,1)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            deactivateParticle(particle,300)
        }
        
        
    }
    
    function createParticles(tag,number){
        
        tag+='Part'
        
        for(var i = 0; i < number;i++){
            
            var particle
            if(tag == 'textPart'){
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                particle = particlesGroup.create(-200,0,'atlas.coffeerush',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
    
    function createObjects(){
        
        particlesGroup = game.add.group()
        sceneGroup.add(particlesGroup)
        
        particlesUsed = game.add.group()
        sceneGroup.add(particlesUsed)
        
        createParticles('star',5)
        createParticles('wrong',1)
        createParticles('text',8)
                
    }

    function collisionEnter(body, bodyB){
    	//character collision function
    	if(gameActive==false){
    		return
    	}

    	if(body==null){
    		return
    	}

    	//console.log(body,bodyB)

    	if(bodyB.tag=="correct"){
    		collideCorrect(bodyB)
    	}
    	else if(bodyB.tag=="wrong"){
    		collideWrong(body.parent)
    	}

    }

    function create(){
        
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        
        sceneGroup = game.add.group()

		touchPosition = {x:-1, y:-1}
		currentSpeed = SPEED
        
        background = game.add.tileSprite(0,0,game.world.width,game.world.height*0.7,'atlas.coffeerush','woodBackground')
        //background.anchor.setTo(0.5,0.5)
        //background.width = game.world.width+2
        //background.height = game.world.height+2
        background.anchor.setTo(0,0)
        sceneGroup.add(background)


        limitHorizontal = {min: 50, max: game.world.width - 50}
        limitlVertical = {min: game.world.height*0.12, max: (game.world.height*0.7) - 50}

        game.physics.startSystem(Phaser.Physics.ARCADE)
        //game.physics.p2.world.defaultContactMaterial.friction = 0;
        //game.physics.p2.gravity.y = 0;
        //game.physics.p2.gravity.x = 0;
        
        loadSounds()
        initialize()  
        
        objectsGroup = game.add.group()
        sceneGroup.add(objectsGroup)
        
        
        characterGroup = game.add.group()
        characterGroup.x = game.world.centerX
        characterGroup.y = background.centerY
        sceneGroup.add(characterGroup)

        
        buddy = game.add.spine(0,50, "mascot");
        buddy.scale.setTo(0.7,0.7 )
        characterGroup.add(buddy)

        buddy_result = game.add.spine(0,50, "mascot_result");
        buddy_result.scale.setTo(0.7,0.7 )
        characterGroup.add(buddy_result)

        playerCollision = game.add.sprite(0,50,'atlas.coffeerush','chilimLogo')
        game.physics.arcade.enable(playerCollision,true);
        playerCollision.anchor.setTo(0.5,0.5)
        //playerCollision.visible = false
        playerCollision.alpha = 0
        playerCollision.body.setSize(80,100,20,-30);
        characterGroup.add(playerCollision)

        buddy.setAnimationByName(0, "IDLE", true);
        buddy.setSkinByName('normal');

        getSkins()
        var newSkin = buddy.createCombinedSkin(
            'combined',     
            'glasses' + skinTable[0],        
            'hair' +  skinTable[1],
            'skin' + skinTable[2],
            'torso' + skinTable[3]
        );

        buddy.setSkinByName('combined')


        buddy_result.setAnimationByName(0, "LOSE", true);
        //buddy_result.setSkinByName('normal');
        buddy_result.visible = false

        
        var newSkin = buddy_result.createCombinedSkin(
            'combinedLose',
            "LOSE",
            'glasses' + skinTable[0] + '_Sad',
            'hair' +  skinTable[1],
            'skin' + skinTable[2],
            'torso' + skinTable[3]
        );

        buddy_result.setSkinByName('combinedLose')
        buddy_result.setToSetupPose()

        
        game.onPause.add(function(){
			
			game.sound.mute = true
			if(amazing.getMinigameId()){
				marioSong.pause()
			}
			
		} , this);

		game.onResume.add(function(){
			game.sound.mute = false
			
			if(amazing.getMinigameId()){
				if(lives>0){
					marioSong.play()
				}
			}
			
		}, this);
        
        
            
		if(!amazing.getMinigameId()){
			
			marioSong = game.add.audio('arcadeSong')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.3)
			}, this);	
		}
        
        /*var topRect = new Phaser.Graphics(game)
        topRect.beginFill(0xffffff);
        topRect.drawRect(0, 0, game.world.width, 60);
        topRect.endFill();
        topRect.anchor.setTo(0,0)
        sceneGroup.add(topRect)*/
        
        createPointsBar()
        createHearts()
        createObstacles()
        createCorrect()
        createControls()
        createObjects()
        animateScene()
        
    }

    function render(){
    	game.debug.body(playerCollision)
    	game.debug.body(correctObject)
    	for(var i = 0; i < objectsGroup.length; i++){
    		game.debug.body(objectsGroup.children[i].collision)
    	}
    }
    
	return {
		assets: assets,
		name: "coffeerush",
		create: create,
        preload: preload,
        update: update,
        render:render,
	}
}()