var soundsPath = "../../shared/minigames/sounds/"
var spinePath = "../../shared/minigames/images/spines/"
var game2Plus2 = function(){
	assets = {
        atlases: [
            {   
                name: "atlas.game2Plus2",
                json: "images/game2Plus2/atlas.json",
                image: "images/game2Plus2/atlas.png",
            },
        ],
        /*images: [
            {   name:"fondo",
				file: "images/delicafe/fondo.png"},
		],*/
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            
		],
	}
    
    var INITIAL_LIVES = 1
    var ARRAY_WIDTH = 4
    var DELTA_QUAD = 110
    var OFFSET_X = 5
    var OFFSET_Y = 1
    var DELTA_TIME = 50
    var BACKGROUND_VELOCITY = 3
    var DELTA_SWIPE = 100

    var skinTable
    
    var gameIndex = 18
    var gameId = 6293705958883328

    var marioSong = null
	var sceneGroup = null
    var pointsGroup = null
    var gameActive = true
    var valuesList = null
    var objectsGroup
    var timer
    var timeGroup = null
    var pointsBar = null

    var lives = null
    var particlesGroup
    var particlesUsed
    var heartsGroup = null
    var buddy = null
    var buddy_result = null


    var spaceShipGroup
    var quadsArray = []
    var initiPostision
    var quadsGroup
    var canMove = true
    var numberTweens
    var numberTweensCompleted

    var mask

    var background

    var inSwipe
    var canSwipe
    var initialPositionSwipe = {x:0,y:0}

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
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        skinTable = []
		quadsArray = []
        for(var i = 0; i < ARRAY_WIDTH; i++){
        	quadsArray[i]= []
        	for(var j = 0; j < ARRAY_WIDTH; j++){
        		quadsArray[i][j] = {value:0, box:null, plus:false}
        	}
        }

        initiPostision = {x: - DELTA_QUAD*2 + 7, y: - DELTA_QUAD*2 + 110}
        canMove = true
        numberTweens = 0
    	numberTweensCompleted = 0
        inSwipe = false
        canSwipe = true
	}
    

    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)        
        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        gameActive = true

    }
    
    
    function preload() {
        
		game.forceSingleUpdate = true
        game.stage.disableVisibilityChange = false;
        game.load.spine('mascot', "images/spines/skeleton.json");
        game.load.spine('mascot_result', "images/spines/resultSpine/skeleton_result.json");
        game.load.spritesheet('fireSpritesheet', 'images/game2Plus2/fire.png', 320, 440, 23);
        		
		if(amazing.getMinigameId()){
			marioSong = sound.setSong(soundsPath + 'songs/classic_arcade.mp3',0.3)
		}else{
			game.load.audio('arcadeSong', soundsPath + 'songs/classic_arcade.mp3');
		}
		var fontStyle = {font: "30px AvenirHeavy", fontWeight: "bold", fill: "#000000", align: "center"}
		var text = new Phaser.Text(game, 0, 10, "2", fontStyle)
		text.visible = false
    }

    
    function stopGame(win){
        heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        gameActive = false

        buddy.visible = false
       	buddy_result.visible = true
        
		if(amazing.getMinigameId()){
			marioSong.pause()
		}else{
			marioSong.stop()
		}
                
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 5500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)
		
            sceneloader.show("result")
		})
    }
    
    function addPoint(number,obj){
        
        sound.play("magic")
        createPart('star', obj)
        createTextPart('+' + number, obj)
        
        pointsBar.number+= number

        pointsBar.text.setText(pointsBar.number)
   
    }


    
    function update(){
        
        if(gameActive == false){
            return
        }
        else{
        	background.tilePosition.x -= BACKGROUND_VELOCITY
        	background.tilePosition.y += BACKGROUND_VELOCITY
        }
        updateSwipe()
    }

    function updateSwipe(){
        if(game.input.activePointer.isDown){
            //console.log("Is Down")
            if(canSwipe){
                if(inSwipe){
                    var dx = game.input.activePointer.x - initialPositionSwipe.x
                    var dy = game.input.activePointer.y - initialPositionSwipe.y

                    if(dx < -DELTA_SWIPE){
                        //Swipe left
                        inSwipe = false
                        canSwipe = false
                        moveLeft()
                    }
                    else if(dx > DELTA_SWIPE){
                        //Swipe right
                        inSwipe = false
                        canSwipe = false
                        moveRight()
                    }
                    else if(dy < -DELTA_SWIPE){
                        //swipe up
                        inSwipe = false
                        canSwipe = false
                        moveUp()
                    }
                    else if(dy > DELTA_SWIPE){
                        //swipe down
                        inSwipe = false
                        canSwipe = false
                        moveDown()
                    }
                }
                else{
                    initialPositionSwipe.x = game.input.activePointer.x
                    initialPositionSwipe.y = game.input.activePointer.y
                    inSwipe = true
                }
            }
        }
        else{
            canSwipe = true
            inSwipe = false
        }
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(0,10,'atlas.game2Plus2','xpcoins')
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

    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        group.create(0,0,'atlas.game2Plus2','life_box')

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
    
    
    function createTextPart(text,obj){
        
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = lookParticle('textPart')
        
        if(pointsText){
            
            pointsText.x = obj.x
            pointsText.y = obj.y - 60
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
                particle = particlesGroup.create(-200,0,'atlas.game2Plus2',tag)
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

    function createQuad(){
    	var emptySpaces = []
    	var index = 0
    	for(var i = 0; i < ARRAY_WIDTH; i++){
    		for(var j = 0; j < ARRAY_WIDTH; j++){
    			if(quadsArray[i][j].value == 0){
    				emptySpaces[index] = {i:i, j:j}
    				index ++
    			}
    		}
    	}

    	var r = game.rnd.integerInRange(0,emptySpaces.length-1)
    	quadsArray[emptySpaces[r].i][emptySpaces[r].j].value = 2

    	var box = getBox()
    	box.value = 2
    	changeValue(box)
    	box.x = initiPostision.x + (emptySpaces[r].i * DELTA_QUAD) + DELTA_QUAD/2 - OFFSET_X
    	box.y = initiPostision.y + (emptySpaces[r].j * DELTA_QUAD) + DELTA_QUAD/2 - OFFSET_Y
    	box.visible = true
    	if(box.tween){
    		box.tween.stop()
    	}
    	box.tween = game.add.tween(box.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
    	quadsArray[emptySpaces[r].i][emptySpaces[r].j].box = box

    	if(emptySpaces.length==1){
    		
    		analiceOptions()
    	}

    	
	    
    }

    function analiceOptions(){

    	//move Right
    	for(var i = ARRAY_WIDTH-2; i >= 0; i -- ){
    		for(var j = 0; j < ARRAY_WIDTH; j++){
    			if(quadsArray[i][j].value!=0){
    				for(var id = i+1; id < ARRAY_WIDTH; id++){
    					if(quadsArray[id][j].value!=0){
	    					if(canPlus(quadsArray[id][j],quadsArray[i][j])){
	    						//console.log("can right")
	    						return
	    					}
	    					else{
	    						break
	    					}
	    				}
    				}
    			}
    		}
    	}

    	//move Up


    	for(var i = 0; i < ARRAY_WIDTH; i ++ ){
    		for(var j = 1; j < ARRAY_WIDTH; j++){
    			if(quadsArray[i][j].value!=0){
    				for(var id = j-1; id >= 0; id--){
    					if(quadsArray[i][id].value!=0){
	    					if(canPlus(quadsArray[i][id],quadsArray[i][j])){
	    						//console.log("Can up")
	    						return 
	    					}
	    					else{
	    						break
	    					}
	    				}
	    			
    				}
    			}
    		}
    	}


    	stopGame()

    }

    
    function moveRight(){

    	if(!canMove || !gameActive){
    		return
    	}

    	canMove = false
    	numberTweens = 0
    	numberTweensCompleted = 0

        for(var i = ARRAY_WIDTH-2; i >= 0; i -- ){
    		for(var j = 0; j < ARRAY_WIDTH; j++){
    			if(quadsArray[i][j].value!=0){
    				var plus = false
    				var limit = ARRAY_WIDTH - 1
    				var plusBox = null
    				for(var id = i+1; id < ARRAY_WIDTH; id++){
    					if(quadsArray[id][j].value!=0){
	    					if(canPlus(quadsArray[id][j],quadsArray[i][j])){
	    						plus = true

	    						plusBox = quadsArray[id][j]
	    						quadsArray[id][j].plus = true

	    						limit = id
	    						break
	    					}
	    					else{
	    						limit = id-1
	    						break
	    					}
	    				}
	    				else{
	    					//limit = id
	    				}
    				}

    				if(limit!=i){
    					var deltaIds = Math.abs(i - limit)
	    				setQuadMovement(i,j,limit,j,deltaIds,plus)
	    			}
    			}
    		}
    	}

    	if(numberTweens==0){
    		canMove = true
    		//endMovement()
    	}
    }
    
    function moveLeft(){

    	if(!canMove || !gameActive){
    		return
    	}

    	canMove = false
    	numberTweens = 0
    	numberTweensCompleted = 0

       for(var i = 1; i < ARRAY_WIDTH; i ++ ){
    		for(var j = 0; j < ARRAY_WIDTH; j++){
    			if(quadsArray[i][j].value!=0){
    				var plus = false
    				var limit = 0
    				var plusBox = null
    				for(var id = i-1; id >= 0; id--){
    					if(quadsArray[id][j].value!=0){
	    					if(canPlus(quadsArray[id][j],quadsArray[i][j])){
	    						plus = true

	    						plusBox = quadsArray[id][j]
	    						quadsArray[id][j].plus = true

	    						limit = id
	    						break
	    					}
	    					else{
	    						limit = id+1
	    						break
	    					}
	    				}
	    				else{
	    					//limit = id
	    				}
    				}

    				if(limit!=i){

    					var deltaIds = Math.abs(i - limit)
	    				setQuadMovement(i,j,limit,j,deltaIds,plus)
	    			}


    			}
    		}
    	}

    	if(numberTweens==0){
    		canMove = true
    		//endMovement()
    	}

    }

    function moveUp(){

    	if(!canMove || !gameActive){
    		return
    	}

    	canMove = false
    	numberTweens = 0
    	numberTweensCompleted = 0

       for(var i = 0; i < ARRAY_WIDTH; i ++ ){
    		for(var j = 1; j < ARRAY_WIDTH; j++){
    			if(quadsArray[i][j].value!=0){
    				var plus = false
    				var limit = 0
    				var plusBox = null
    				for(var id = j-1; id >= 0; id--){
    					if(quadsArray[i][id].value!=0){
	    					if(canPlus(quadsArray[i][id],quadsArray[i][j])){
	    						plus = true

	    						plusBox = quadsArray[i][id]
	    						quadsArray[i][id].plus = true

	    						limit = id
	    						break
	    					}
	    					else{
	    						limit = id+1
	    						break
	    					}
	    				}
	    				else{
	    					//limit = id
	    				}
    				}

    				if(limit!=j){
    					var deltaIds = Math.abs(j - limit)
	    				setQuadMovement(i,j,i,limit,deltaIds,plus)
	    			}


    			}
    		}
    	}

    	if(numberTweens==0){
    		canMove = true
    		//endMovement()

    	}

    }

    function moveDown(){

    	if(!canMove || !gameActive){
    		return
    	}

    	canMove = false
    	numberTweens = 0
    	numberTweensCompleted = 0

    	for(var i = 0; i < ARRAY_WIDTH; i ++ ){
    		for(var j = ARRAY_WIDTH -2; j >=0; j--){
    			if(quadsArray[i][j].value!=0){
    				var plus = false
    				var limit = ARRAY_WIDTH - 1
    				var plusBox = null
    				for(var id = j+1; id < ARRAY_WIDTH; id++){
    					if(quadsArray[i][id].value!=0){
	    					if(canPlus(quadsArray[i][id],quadsArray[i][j])){
	    						plus = true

	    						plusBox = quadsArray[i][id]
	    						quadsArray[i][id].plus = true

	    						limit = id
	    						break
	    					}
	    					else{
	    						limit = id-1
	    						break
	    					}
	    				}
    				}

    				if(limit!=j){
    					var deltaIds = Math.abs(j - limit)
	    				setQuadMovement(i,j,i,limit,deltaIds,plus)
	    			}


    			}
    		}
    	}

    	if(numberTweens==0){
    		canMove = true
    		//endMovement()
    	}

    }

    function setQuadMovement(i,j,newI,newJ, deltaTime, plus){

    	numberTweens++
    	//console.log("CreateTween "+numberTweens)
		quadsArray[i][j].box.tween = game.add.tween(quadsArray[i][j].box).to({x:initiPostision.x + (newI*DELTA_QUAD) + DELTA_QUAD/2 - OFFSET_X ,y:initiPostision.y + (newJ*DELTA_QUAD) + DELTA_QUAD/2 - OFFSET_Y}, DELTA_TIME*deltaTime,Phaser.Easing.linear,true)
		quadsArray[i][j].box.boxSum = quadsArray[newI][newJ]


		if(plus){
			//console.log(plusBox)

			quadsArray[newI][newJ].value =quadsArray[newI][newJ].value*2
			quadsArray[newI][newJ].box.value = quadsArray[newI][newJ].value
			quadsArray[i][j].box.tween.onComplete.add(function (currentTarget){
				currentTarget.boxSum.box.scale.setTo(0.5)
				currentTarget.boxSum.box.tween = game.add.tween(currentTarget.boxSum.box.scale).to({x:1,y:1},DELTA_TIME,Phaser.Easing.linear,true)
				changeValue(currentTarget.boxSum.box)
				currentTarget.visible = false
				currentTarget.scale.setTo(0)
				currentTarget.tween.stop()
				currentTarget.boxSum.plus = false
				
				numberTweensCompleted++
				//console.log(numberTweens,numberTweensCompleted)
				if(numberTweensCompleted == numberTweens){
					endMovement()
				}

			})
		}
		else{
			quadsArray[i][j].box.tween.onComplete.add(function(){

				numberTweensCompleted++
				//console.log(numberTweens,numberTweensCompleted)
				if(numberTweensCompleted == numberTweens){
					endMovement()
				}
			})
			quadsArray[newI][newJ].value = quadsArray[i][j].value
			quadsArray[newI][newJ].box = quadsArray[i][j].box


		}

		quadsArray[i][j].plus = false
		quadsArray[i][j].box = null
		quadsArray[i][j].value = 0
    }

    function endMovement(){
    	canMove = true
    	createQuad()
    }

    function changeValue(box){
    	
    	var colorText = '#ffffff'
    	var color 
    	var points = 0
    	switch(box.value){
    		case 2:
    		colorText = '#807272'
    		color= 0xebe1b3
    		break
    		case 4:
    		colorText = '#807272'
    		color= 0xbcf3a9
    		break
    		case 8:
    		color= 0x7687ed
    		break
    		case 16:
    		points=1
    		color= 0x578de8
    		break
    		case 32:
    		points=2
    		color= 0x65c3d9
    		break
    		case 64:
    		points=3
    		color= 0x2ba8e0
    		break
    		case 128:
    		points=4
    		color= 0x8765f1
    		break
    		case 256:
    		points=5
    		color= 0x9281ef
    		break
    		case 512:
    		points=6
    		color= 0x7b5df4
    		break
    		case 1024:
    		points=7
    		color= 0x6e51d7
    		break
    		default:
    		points=8
    		color= 0x5227fb
    		break
    		
    	}
        if(box.value!=2){
            sound.play("pop")
        }



    	box.text.setStyle({font: "40px AvenirHeavy", fontWeight: "bold", fill: colorText, align: "center"})
    	box.text.setText(box.value)
    	box.sprite.tint = color
    	if(points!=0){
	    	addPoint(points,{x:quadsGroup.x + box.x, y: quadsGroup.y + box.y})
	    }
    	//change Color here
    }

    function canPlus(boxSum, boxMove){
    	if(!boxSum.plus){
    		if(boxSum.value == boxMove.value){
    			return true
    		}
    	}
    	return false
    }

    function getBox(){
    	for(var i = 0; i < quadsGroup.length; i++){
    		if(!quadsGroup.children[i].visible){
    			//changeValue()
    			return quadsGroup.children[i]
    		}
    	}
    	return null
    }

    function createSpaceShip(){


    	spaceShipGroup = game.add.group()
    	sceneGroup.add(spaceShipGroup)

    	spaceShipGroup.x = game.world.centerX
    	spaceShipGroup.y = game.world.centerY

        var fire = spaceShipGroup.create(0,300,'fireSpritesheet')
        fire.anchor.setTo(0.5,0)
        fire.animations.add('walk');
        fire.animations.play('walk', 50, true);

    	var spaceShip = spaceShipGroup.create(0,0,'atlas.game2Plus2','nave')
    	spaceShip.anchor.setTo(0.5,0.5)

    	for(var i = 0; i < ARRAY_WIDTH; i ++){
    		for(var j = 0; j < ARRAY_WIDTH; j ++){
    			var space = spaceShipGroup.create(initiPostision.x + (j*DELTA_QUAD), initiPostision.y + (i*DELTA_QUAD),'atlas.game2Plus2', 'casilla_vacia')
    		}
    	}

    	quadsGroup = game.add.group()
    	sceneGroup.add(quadsGroup)
    	quadsGroup.x = game.world.centerX
    	quadsGroup.y = game.world.centerY

    	for(var i = 0; i < (ARRAY_WIDTH*ARRAY_WIDTH); i ++){
    		var group = game.add.group()
    		var box = group.create(0,0,'atlas.game2Plus2','casilla_blanca')
    		box.anchor.setTo(0.5)
    		group.sprite = box
    		var fontStyle = {font: "40px AvenirHeavy", fontWeight: "bold", fill: "#000000", align: "center"}
        	group.text = new Phaser.Text(sceneGroup.game, 0, 10, "2", fontStyle)
        	group.text.anchor.setTo(0.5)
        	group.text.x = 0
        	group.text.y = 0
        	group.add(group.text)
        	group.visible = false

        	group.value = 2
        	changeValue(group)

        	quadsGroup.add(group)
        	group.scale.setTo(0)
        	//box.text.x = box.x
        	//box.text.y = box.y


    	}

    }

    function createinput(){
    	var keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    	keyDown.onDown.add(moveDown, this);

    	var keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    	keyUp.onDown.add(moveUp, this);

    	var keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    	keyRight.onDown.add(moveRight, this);

    	var keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    	keyLeft.onDown.add(moveLeft, this);

    }


    function create(){
        
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        
        sceneGroup = game.add.group()

        
        background = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.game2Plus2','background')
        sceneGroup.add(background)

        game.physics.startSystem(Phaser.Physics.ARCADE)
        
        loadSounds()
        initialize()  
        
        objectsGroup = game.add.group()
        sceneGroup.add(objectsGroup)
        
        
        


        
        
        game.onPause.add(function(){
			
			game.sound.mute = true
			if(amazing.getMinigameId()){
				//marioSong.pause()
			}
			
		} , this);

		game.onResume.add(function(){
			game.sound.mute = false
			
			if(amazing.getMinigameId()){
				if(lives>0){
					//marioSong.play()
				}
			}
			
		}, this);
        
        
            
		if(!amazing.getMinigameId()){
			
			marioSong = game.add.audio('arcadeSong')
			/*game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.3)
			}, this);*/	
		}
        
        
        createPointsBar()
        createHearts()
        
        createSpaceShip()
        animateScene()
        createQuad()
        createQuad()
        createinput()


        characterGroup = game.add.group()
        characterGroup.x = game.world.centerX
        characterGroup.y = background.centerY - 190
        //characterGroup.visible = false
        sceneGroup.add(characterGroup)

        
        buddy = game.add.spine(0,50, "mascot");
        buddy.scale.setTo(0.7,0.7 )
        characterGroup.add(buddy)


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



        buddy_result = game.add.spine(0,50, "mascot_result");
        buddy_result.scale.setTo(0.7,0.7 )
        characterGroup.add(buddy_result)


        buddy_result.setAnimationByName(0, "LOSE", true);
        //buddy_result.setSkinByName('normal');
        buddy_result.visible = false

        
        var newSkin = buddy_result.createCombinedSkin(
            'combinedWin',
            "LOSE",
            'glasses' + skinTable[0] + '_Sad',
            'hair' +  skinTable[1],
            'skin' + skinTable[2],
            'torso' + skinTable[3]
        );

        buddy_result.setSkinByName('combinedWin')
        buddy_result.setToSetupPose()

        mask = game.add.graphics(0, 0);

	    mask.beginFill(0xffffff);

	    mask.drawCircle(game.world.centerX, game.world.centerY-215, 115);

	    characterGroup.mask = mask

        var windowImage = sceneGroup.create(game.world.centerX, 265, 'atlas.game2Plus2', 'ventana')
        windowImage.anchor.setTo(0.5)
        windowImage.scale.setTo(1.1,1.1)



        createObjects()



    }

    
	return {
		assets: assets,
		name: "2+2",
		create: create,
        preload: preload,
        update: update,
	}
}()