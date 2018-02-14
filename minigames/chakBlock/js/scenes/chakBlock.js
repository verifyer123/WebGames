var soundsPath = "../../shared/minigames/sounds/"
var spinePath = "../../shared/minigames/images/spines/"
var chakBlock = function(){

	var ColorsEnum = {
		BLUE:0,
		PURPLE:1,
		RED:2,
		GREEN:3,
		YELLOW:4,
	}


	assets = {
        atlases: [
            {   
                name: "atlas.chakBlock",
                json: "images/chakBlock/atlas.json",
                image: "images/chakBlock/atlas.png",
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
    var DELTA_TIME = 50
    var ARRAY_WIDTH = 10
    var ARRAY_HEIGTH = 10
    var INITIAL_POSITION 
    var DELTA_QUAD = 42
    var MAX_COLOR = 5
    
    var gameIndex = 22
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


    var quadsGroup
    var quadsInUse

    var arrayValues 
    var downCollision

    var spriteMaterial
    var worldMaterial
    var currentLevel
    var currentColors

    var touch
    var inEvaluation
    var quadsAnalize
    var quadsDestroy
    var emptyLines 

    var arrayColors


	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#33302d"
        lives = INITIAL_LIVES
        	
        INITIAL_POSITION = {x:game.world.centerX - (DELTA_QUAD*4.5)+6, y: game.world.centerY +240}
        currentColors = 3
        inEvaluation = false
        initiArray()
	}
    

    function initiArray(){
    	arrayValues = []
    	for(var i = 0; i < ARRAY_WIDTH; i ++){
    		arrayValues[i] = []
    		for(var j = 0; j < ARRAY_HEIGTH; j++){
    			arrayValues[i][j] = {value: -1, object:null}
    		}
    	}

        arrayColors = []

        for(var i = 0 ; i < MAX_COLOR; i++){
            arrayColors.push(i)
        }

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
       
        		
		if(amazing.getMinigameId()){
			marioSong = sound.setSong(soundsPath + 'songs/jungle_fun.mp3',0.3)
		}else{
			game.load.audio('arcadeSong', soundsPath + 'songs/jungle_fun.mp3');
		}
		var fontStyle = {font: "30px AvenirHeavy", fontWeight: "bold", fill: "#000000", align: "center"}
		var text = new Phaser.Text(game, 0, 10, "2", fontStyle)
		text.visible = false
    }

    
    function stopGame(win){
        heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        gameActive = false
        
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
        
        updateQuads()

        updateTouch()
    }

    function updateQuads(){
    	game.physics.arcade.overlap(touch, quadsGroup, overlapFunction, null, this);
    }

    function overlapFunction(touchCol,quad){

    	if(inEvaluation){
    		return
    	}

    	inEvaluation = true

    	quadsDestroy = []
    	quadsAnalize = []
    	quadsDestroy.push(quad)
    	quadsAnalize.push(quad)
    	var needUpdateArray = true

    	while(quadsAnalize.length!=0){

    		var object = quadsAnalize[0]
    		quadsAnalize.splice(0,1)

    		

    		if(object.i+1<ARRAY_WIDTH){
	    		var response = evalQuad(object, arrayValues[object.i+1][object.j].object)
	    		if(response){
	    			if(needUpdateArray){
	    				arrayValues[quad.i][quad.j].object = null
	    				arrayValues[quad.i][quad.j].value = -1
	    				needUpdateArray = false
	    			}
	    		}
	    	}
	    	if(object.i-1>=0){
	    		var response = evalQuad(object, arrayValues[object.i-1][object.j].object)
	    		if(response){
	    			if(needUpdateArray){
	    				arrayValues[quad.i][quad.j].object = null
	    				arrayValues[quad.i][quad.j].value = -1
	    				needUpdateArray = false
	    			}
	    		}
	    	}

	    	if(object.j+1< ARRAY_HEIGTH){
	    		var response = evalQuad(object, arrayValues[object.i][object.j+1].object)
	    		if(response){
	    			if(needUpdateArray){
	    				arrayValues[quad.i][quad.j].object = null
	    				arrayValues[quad.i][quad.j].value = -1
	    				needUpdateArray = false
	    			}
	    		}
	    	}

	    	if(object.j-1>=0){
	    		var response = evalQuad(object, arrayValues[object.i][object.j-1].object)
	    		if(response){
	    			
	    			if(needUpdateArray){
	    				arrayValues[quad.i][quad.j].object = null
	    				arrayValues[quad.i][quad.j].value = -1
	    				needUpdateArray = false
	    			}
	    		}
	    	}


    	}

    	if(quadsDestroy.length>1){
    		var num = quadsDestroy.length-2
    		var divisor = Math.round(num/6)
    		var val = num*divisor
    		if(val < 1){
    			val = 1
    		}
    		addPoint(val,quad)
    		for(var i = 0; i < quadsDestroy.length; i++){
    			//quadsDestroy[i].x = 0
    			//quadsDestroy[i].y = 0
    			var tween = game.add.tween(quadsDestroy[i].scale).to({x:0,y:0},300,Phaser.Easing.linear,true)
    			if(i == quadsDestroy.length-1){
    				tween.onComplete.add(function(currentTarget){
    					startMoveDown()
    				})
    			}
    		}
    	}
    	else{
    		endEvaluation()
    	}   	

    }

    function startMoveDown(){

    	for(var i = 0; i< quadsDestroy.length; i++){
    		quadsDestroy[i].x = 0
    		quadsDestroy[i].y = 0

    		//quadsDestroy[i].scale.setTo(1)
    	}
    	emptyLines = [] 
    	var downQuads = []
    	for(var i = 0; i < ARRAY_WIDTH; i++){
    		var firstEmptyId = -1
    		var lineEmpty = true
    		for(var j = 0; j<ARRAY_HEIGTH; j++){
    			if(arrayValues[i][j].value == -1){
    				if(firstEmptyId == -1){
    					firstEmptyId = j
    				}
    			}
    			else{
    				lineEmpty = false
    				if(firstEmptyId!=-1){
	    				//arrayValues[i][j].object.y = INITIAL_POSITION.y - (DELTA_QUAD*firstEmptyId)
	    				downQuads.push({object:arrayValues[i][j].object,y:INITIAL_POSITION.y - (DELTA_QUAD*firstEmptyId)})
	    				arrayValues[i][firstEmptyId].object = arrayValues[i][j].object
	    				arrayValues[i][firstEmptyId].value = arrayValues[i][j].value

	    				arrayValues[i][firstEmptyId].object.j = firstEmptyId
	    				

	    				arrayValues[i][j].object = null
	    				arrayValues[i][j].value = -1
	    				firstEmptyId = -1
	    				j = firstEmptyId+1
	    			}
    			}
    		}

    		if(lineEmpty){
    			emptyLines.push(i)
    		}
    	}


    	if(downQuads.length>0){

	    	for(var i = 0; i < downQuads.length;i++){
	    		var tween = game.add.tween(downQuads[i].object).to({y:downQuads[i].y},100*((downQuads[i].y - downQuads[i].object.y)/DELTA_QUAD),Phaser.Easing.linear,true)
	    		if(i == downQuads.length-1){

					tween.onComplete.add(function(){
						moveLines()
					})
	    		}
	    	}
	    }else{
	    	moveLines()
	    }

    }

    function moveLines(){
    	var moveLinesArray = []
    	if(emptyLines.length==0){
			endEvaluation()
		}
		else{
			for(var a = emptyLines.length-1; a >=0; a-- ){
			//var a = emptyLines[emptyLines.length-1]
			//emptyLines.splice(emptyLines.length-1,1)
				for(var i = emptyLines[a]+1; i< ARRAY_WIDTH; i++){
					for(var j = 0; j<ARRAY_HEIGTH;j++){
						if(arrayValues[i][j].value !=-1){
							//arrayValues[i][j].object.x -= DELTA_QUAD
							var index = moveLinesArray.indexOf(arrayValues[i][j].object)
							if(index==-1){
								arrayValues[i][j].object.toX = INITIAL_POSITION.x + (DELTA_QUAD*(i-1))
								moveLinesArray.push(arrayValues[i][j].object)
							}
							else{
								moveLinesArray[index].toX = INITIAL_POSITION.x + (DELTA_QUAD*(i-1))
							}

							arrayValues[i-1][j].object = arrayValues[i][j].object
							arrayValues[i-1][j].value = arrayValues[i][j].value

							arrayValues[i-1][j].object.i = i-1

							arrayValues[i][j].object = null
		    				arrayValues[i][j].value = -1
		    			}
					}
				}
			}

			if(moveLinesArray.length!=0){
				for(var i = 0; i < moveLinesArray.length; i++){
					var tween = game.add.tween(moveLinesArray[i]).to({x:moveLinesArray[i].toX},100*((moveLinesArray[i].x - moveLinesArray[i].toX)/DELTA_QUAD),Phaser.Easing.linear,true)
					if(i == moveLinesArray.length-1){
						tween.onComplete.add(function(){
							endEvaluation()
						})
					}
				}
			}
			else{
				endEvaluation()
			}

		}
    }

    function endEvaluation(){
    	inEvaluation = false

    	if(arrayValues[0][0].value==-1){

    		if(currentColors<MAX_COLOR){
    			currentColors++
    		}

    		setRound()
    	}
    	else{
    		var canPlay = false
    		for(var i = 0; i < ARRAY_WIDTH; i++){

    			if(arrayValues[i][0].value==-1){
    				break
    			}

    			for(var j = 0; j<ARRAY_HEIGTH; j++){
    				if(arrayValues[i][j].value == -1){
    					continue
    				}

    				if(i+1<ARRAY_WIDTH){
    					if(arrayValues[i][j].value == arrayValues[i+1][j].value){
    						canPlay=true
    						break
    					}
    				}
    				if(i-1>=0){
    					if(arrayValues[i][j].value == arrayValues[i-1][j].value){
    						canPlay=true
    						break
    					}
    				}
    				if(j+1<ARRAY_HEIGTH){
    					if(arrayValues[i][j].value == arrayValues[i][j+1].value){
    						canPlay=true
    						break
    					}
    				}
    				if(j-1>=0){
    					if(arrayValues[i][j].value == arrayValues[i][j-1].value){
    						canPlay=true
    						break
    					}
    				}
    			}

    			if(canPlay){
    				break
    			}
    		}

    		if(!canPlay){
    			stopGame()
    		}
    	}
    }

    function evalQuad(quadEval,quadNear){
    	if(quadNear!=null){
	    	if(quadNear.type == quadEval.type){
				quadsDestroy.push(quadNear)
		    	quadsAnalize.push(quadNear)
				arrayValues[quadNear.i][quadNear.j].value = -1
				arrayValues[quadNear.i][quadNear.j].object = null
				return true
			}
		}
		return false
    }


    function updateTouch(){
        if(game.input.activePointer.isDown){
            touch.x = game.input.activePointer.x
            touch.y = game.input.activePointer.y
        }
        else{
        	touch.x = -100
            touch.y = -100
        }
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(0,10,'atlas.chakBlock','xpcoins')
        pointsImg.x = game.world.width - pointsImg.width * 1.2
        pointsImg.width *=1
        pointsImg.height *=1
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.6
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

        group.create(0,0,'atlas.chakBlock','life_box')

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
                particle = particlesGroup.create(-200,0,'atlas.chakBlock',tag)
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

    function createSingleQuad(){
    	
    	var object = quadsGroup.create(game.world.centerX,game.world.centerY,'atlas.chakBlock',"amarillo")
    	object.anchor.setTo(0.5)
    	object.type = ColorsEnum.YELLOW


    	return object
    }

    function getQuad(r,x,y,index){
    	var o 
	    o = quadsGroup.children[index]
        o.scale.setTo(1)

    	switch(r){
    		case ColorsEnum.RED:
    		o.loadTexture('atlas.chakBlock','rojo')
    		break
    		case ColorsEnum.BLUE:
    		o.loadTexture('atlas.chakBlock','azul')
    		break
    		case ColorsEnum.PURPLE:
    		o.loadTexture('atlas.chakBlock','morado')
    		break
    		case ColorsEnum.GREEN:
    		o.loadTexture('atlas.chakBlock','verde')
    		break
    		case ColorsEnum.YELLOW:
    		o.loadTexture('atlas.chakBlock','amarillo')
    		break
    	}

    	o.type = r
    	o.x = x
    	o.y = y


    	o.visible= true
    	return o
    }

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    function setRound(){
    	var currentIndex = 0
    	var yOutMap = INITIAL_POSITION.y-(DELTA_QUAD*ARRAY_HEIGTH)
    	inEvaluation = true

        arrayColors = shuffle(arrayColors)

    	for(var i = 0; i < ARRAY_WIDTH; i++){
    		for(var j = 0; j<ARRAY_HEIGTH; j++){
    			var r = game.rnd.integerInRange(0,currentColors-1)
                r = arrayColors[r]
    			var x = INITIAL_POSITION.x + (DELTA_QUAD*i)
    			var nextY = INITIAL_POSITION.y -(DELTA_QUAD*j)
    			var y = yOutMap-(DELTA_QUAD*j)
    			var o = getQuad(r,x,y,currentIndex)
    			currentIndex++

    			arrayValues[i][j].value = o.type
    			arrayValues[i][j].object = o
    			o.i = i
    			o.j = j

    			var tween = game.add.tween(o).to({y:nextY},100*((nextY - o.y)/DELTA_QUAD),Phaser.Easing.linear,true)

    			if(i == ARRAY_WIDTH-1 && j==ARRAY_HEIGTH-1){
    				tween.onComplete.add(startRound)
    			}
    		}
    	}

        for(var i = 0; i < ARRAY_WIDTH; i++){
            for(var j = 0; j<ARRAY_HEIGTH; j++){
                var value = arrayValues[i][j].value
                var alone = true
                var nearColors = []
                if(i < ARRAY_WIDTH-1){
                    if(arrayValues[i+1][j].value == value){
                        alone = false
                    }
                    else{
                        nearColors.push(arrayValues[i+1][j].value)
                    }
                }
                if(i > 0){
                    if(arrayValues[i-1][j].value == value){
                        alone = false
                    }
                    else{
                        nearColors.push(arrayValues[i-1][j].value)
                    }
                }

                if(j < ARRAY_HEIGTH-1){
                    if(arrayValues[i][j+1].value == value){
                        alone = false
                    }
                    else{
                        nearColors.push(arrayValues[i][j+1].value)
                    }
                }
                if(j > 0){
                    if(arrayValues[i][j-1].value == value){
                        alone = false
                    }
                    else{
                        nearColors.push(arrayValues[i][j-1].value)
                    }
                }

                if(alone){
                    
                    var r = game.rnd.frac()
                    if(r>0.4){
                        r = game.rnd.integerInRange(0,nearColors.length-1)
                        r = nearColors[r]

                        arrayValues[i][j].value = r
                        arrayValues[i][j].object.type = r

                        switch(r){
                            case ColorsEnum.RED:
                            arrayValues[i][j].object.loadTexture('atlas.chakBlock','rojo')
                            break
                            case ColorsEnum.BLUE:
                            arrayValues[i][j].object.loadTexture('atlas.chakBlock','azul')
                            break
                            case ColorsEnum.PURPLE:
                            arrayValues[i][j].object.loadTexture('atlas.chakBlock','morado')
                            break
                            case ColorsEnum.GREEN:
                            arrayValues[i][j].object.loadTexture('atlas.chakBlock','verde')
                            break
                            case ColorsEnum.YELLOW:
                            arrayValues[i][j].object.loadTexture('atlas.chakBlock','amarillo')
                            break
                        }
                    }

                }

            }
        }

    	//game.physics.arcade.gravity.y = 10;
    }

    function startRound(){
    	inEvaluation = false
    }


    function createTouch(){
        touch = game.add.sprite(0,0,'atlas.chakBlock','star')
        touch.anchor.setTo(0.5)
        touch.scale.setTo(0.2)
        game.physics.arcade.enable(touch);
        //touch.alpha = 0
        bodyTouch = touch.body
        //touch.body.gravity = 0;
    }

    

    function create(){
        
        sceneGroup = game.add.group()

        

        game.physics.startSystem(Phaser.Physics.ARCADE)
        game.physics.arcade.gravity.y = 0;
        game.physics.arcade.setBoundsToWorld(false,false,false,false,false)


    	createTouch()

        
        loadSounds()
        initialize()  
        
        objectsGroup = game.add.group()
        sceneGroup.add(objectsGroup)

        quadsGroup = game.add.physicsGroup(Phaser.Physics.ARCADE)
    	sceneGroup.add(quadsGroup)


    	for(var i = 0; i < ARRAY_HEIGTH*ARRAY_WIDTH; i++){
    		createSingleQuad()
    	}

    	//quadsGroup.setAll("body.")
        
        
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
        
        var background = game.add.sprite(game.world.centerX,game.world.centerY,'atlas.chakBlock','fondo')
        background.anchor.setTo(0.5)

        var scaleX = game.world.width/background.width
		var scaleY = game.world.height/background.height
        background.scale.setTo(1.1)

        //game.camera.focusOnXY(game.world.centerX, game.world.centerY);

		/*if(scaleX > scaleY){
			if(scaleX > 1){
				game.camera.scale.x = scaleX;
                game.camera.scale.y = scaleX;
			}
		}
		else{
			if(scaleY > 1){
				game.camera.scale.x = scaleY;
                game.camera.scale.y = scaleY;
			}
		}

        game.camera.bounds.x = (game.world.centerX*game.camera.scale.x) - game.world.centerX;
        game.camera.bounds.y = (game.world.centerY*game.camera.scale.y) - game.world.centerY;
        game.camera.bounds.width = 540 * game.camera.scale.x;
        game.camera.bounds.height = 960 * game.camera.scale.y;*/


        sceneGroup.add(background)

        createPointsBar()
        createHearts()
        animateScene()
        

        setRound()
        createObjects()





    }

    function render(){
    	//game.debug.body(downCollision)
    	for(var i = 0; i < ARRAY_WIDTH; i++){
    		game.debug.body(quadsGroup.children[i])
    	}
    }

    
	return {
		assets: assets,
		name: "chakBlock",
		create: create,
        preload: preload,
        update: update,
        //render:render
	}
}()