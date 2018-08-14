var soundsPath = "../../shared/minigames/sounds/"
var burguerCrush = function(){

    var OBJECT_TYPE={
        TORTILLA:0,
        INGREDIENTE:1,
        VERDURA:2,
        CONDIMENTO:3
    }

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/burguerCrush/atlas.json",
                image: "images/burguerCrush/atlas.png",
            },
        ],
        images: [
        	{   name:"barra",
                file: "images/burguerCrush/barra.png"},
        ],
        sounds: [
            {   name: "magic",
                file: soundsPath + "magic.mp3"},
            {   name: "wrong",
                file: soundsPath + "wrong.mp3"},
            {   name: "pop",
                file: soundsPath + "pop.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "punch",
                file: soundsPath + "punch1.mp3"}, 
            {   name: "cashRegister",
                file: soundsPath + "cashRegister.mp3"},
            {   name: "rightChoice",
                file: soundsPath + "rightChoice.mp3"},      
        ],
        
    }
    
    var INITIAL_LIVES = 1
    var ARRAY_WIDTH = 5
    var ARRAY_HEIGTH = 7
    var SLOT_SIZE = 76
    var COLORS = ["pan","carne","queso","lechuga","tomate","aros"]
    var TYPES = 6
    var DELTA_SWIPE = 50
    var TIME_MOVE_TWEEN = 100
    var VEL_Y = 5
    var BRILLO_TIME = 800
    var ANGLE_SPEED = 1

    var SIZE_SLOT_TAB = 84

    var POINTS_CREATE_BURGUER = 3

    var PERSON_ANGRY_TIME = 20000
    var DELTA_ANGRY = 500

    var NUM_BURGUERS = 3
    var DELTA_BURGUER = 1.5

    var INITIAL_TIME = 240
    var DELTA_TIME = 20
    var MIN_TIME = 60


    var skinTable

    
    var gameIndex = 29
    var gameId = 100015
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null

    var particlesGroup
    var particlesUsed
    var heartsGroup = null
    var slotsGroup
    
    var space_0
    var gameArray
    var availableSpaces 
    var touch
    var selectedSlot, objectChange
    var inMove 
    var isFallingOjects
    var canMove
    var typeCount

    var tabInit, numberTexts
    var moveFoodGroup
    var buble1, buble2
    var brilloArray
    var bandejaGroup
    var pointsToGive
    var inTransition

    var people1, people2, people3, peopleArray, peopleIndex
    var barY
    var currentTimeAngry
    var specialArray
    var explosionGroup
    var slotMask

    var currentBurguer
    var integertBurguer, initialCurrentBurguer

    var ticketSprite
    var textTickets
    var timeText
    var stopTimer

    var currentTime
    var currentLevel
    var levelDisplay, levelText
    var peopleCurrentIndex

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        gameArray = []
        availableSpaces = []
        for(var i =0; i < ARRAY_HEIGTH; i++){
            gameArray[i] = []
            for(var j =0; j < ARRAY_WIDTH; j++){
                gameArray[i][j] = -1
                availableSpaces[(i*ARRAY_WIDTH)+j] = {x:j,y:i} 
            }
        }
        
        space_0 = {x:game.world.centerX - ((ARRAY_WIDTH-1)/2)*SLOT_SIZE, y:game.world.centerY + ((ARRAY_HEIGTH-1)/2)*SLOT_SIZE}
        selectedSlot = null
        inMove = false
        isFallingOjects = false
        canMove = true
        typeCount = []

        tabInit = {x:game.world.centerX - (2.5*SIZE_SLOT_TAB),y:game.world.height - 56}
        numberTexts = []
        brilloArray = []
        pointsToGive = 0
        inTransition = false

        currentTimeAngry = PERSON_ANGRY_TIME

       specialArray = []

        for(var i=0 ; i < TYPES; i++){
        	typeCount.push(0)
        }

        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var text = new Phaser.Text(game, -100,-100, "0", fontStyle)

        currentBurguer = NUM_BURGUERS
        currentTime = INITIAL_TIME
        integertBurguer = currentBurguer
        initialCurrentBurguer = integertBurguer

        stopTimer = false
        currentLevel = 1
        peopleCurrentIndex = 0
    }
    

    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)        
        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        
        gameActive = true

        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var text = new Phaser.Text(game, -100,-100, "0", fontStyle)

    }
    
    
    function preload() {
        
        game.forceSingleUpdate = true
        game.stage.disableVisibilityChange = false;
                
        if(amazing.getMinigameId()){
            marioSong = sound.setSong(soundsPath + 'songs/cooking_in_loop.mp3',0.3)
        }else{
            game.load.audio('arcadeSong', soundsPath + 'songs/cooking_in_loop.mp3');
        }
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var text = new Phaser.Text(game, -100,-100, "0", fontStyle)

    }

    
    function stopGame(win){

        //heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        gameActive = false

        
        if(amazing.getMinigameId() && marioSong!=null){
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
        
        //sound.play("pop")
        createPart('star', obj)
        createTextPart('+' + number, obj)
        
        pointsBar.number+= number

        pointsBar.text.setText(pointsBar.number)
   
    }

    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(0,10,'atlas.game','xpcoins')
        pointsImg.x = game.world.width - pointsImg.width * 1.2
        pointsImg.width *=1
        pointsImg.height *=1
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.anchor.setTo(0,0)
        pointsText.x = pointsImg.x + pointsImg.width * 0.5
        pointsText.y = pointsImg.height * 0.3
        pointsBar.add(pointsText)
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }

    /*function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        group.create(0,0,'atlas.game','life_box')

        pivotX+= 47
        
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = 2
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }*/
    
    
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
    
    function starParticles(obj,idString){
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.game',idString);
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = obj.x;
        particlesGood.y = obj.y- 25;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
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
                particle = particlesGroup.create(-200,0,'atlas.game',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }

    function missPoint(){

        sound.play("wrong")
        
        lives--;
        //heartsGroup.text.setText('X ' + lives)

        /*var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })*/

        stopTouch = true
        
        if(lives === 0){
            stopGame()
        }
    
    }


    function update(){
        
        if(!gameActive){
            return
        }

        for(var i =0; i < TYPES; i++){
        	if(brilloArray[i].visible){
        		brilloArray[i].angle += ANGLE_SPEED
        		brilloArray[i].second.angle -= ANGLE_SPEED*0.5
        		if(brilloArray[i].timeWait < game.time.now){
        			//brilloArray[i].visible = false
        			
        			//if(brilloArray[i].tween==null){

        				brilloArray[i].timeWait+=TIME_MOVE_TWEEN
			    		brilloArray[i].tween = game.add.tween(brilloArray[i].scale).to({x:0,y:0},200,Phaser.Easing.linear,true)
			    		brilloArray[i].tween.onComplete.add(function(target){
			    			target.visible = false
			    		})
			    	//}
        		}
        	}
        }
        if(!inTransition){
        	updateTouch()
        }
        updateFalling()

        /*for(var i =0; i < peopleArray.length; i++){
        	if(peopleArray.isActive){
	        	if(peopleArray[i].emotion == 0 && peopleArray[i].timeSad< game.time.now){
	        		peopleArray[i].emotion = 1
	        		peopleArray[i].loadTexture("atlas.game","cliente"+peopleArray[i].key+"_triste")
	        	}
	        	else if(peopleArray[i].timeWait< game.time.now){
	        		dissapearPerson(peopleArray[i],false)
	        	}
	        }
        }*/

        for(var i=0; i < specialArray.length; i++){
        	if(!specialArray[i].shine.visible){
        		specialArray[i].shine.visible = true
        	}
        	specialArray[i].shine.angle += ANGLE_SPEED
        }

        if(!stopTimer){
        	updateTimer()
        }
    }

    function updateFalling(){

        if(isFallingOjects){
            var inFalling = false
            for(var j = 0; j < ARRAY_HEIGTH; j++){
                for(var i = 0; i < ARRAY_WIDTH; i++){
                    if(gameArray[j][i].object.nextY!=-1){
                        inFalling = true
                        gameArray[j][i].object.y+=VEL_Y
                        if(gameArray[j][i].object.y >= gameArray[j][i].object.nextY){
                            gameArray[j][i].object.y = gameArray[j][i].object.nextY
                            gameArray[j][i].object.nextY = -1
                        }
                    }
                }
            }

            if(!inFalling){

                if(isFallingOjects){
                	var destroyObjects = []

                    for(var j=0; j < ARRAY_HEIGTH; j++){
                        for(var i =0; i< ARRAY_WIDTH; i++){
                        	if(destroyObjects.indexOf(gameArray[j][i]) !=-1){
                        		continue
                        	}
                            var eval = evaluateObject(i,j)
                            if(eval.horizontal.length >=3){
                                for(var i = 0; i < eval.horizontal.length; i++){
                                	if(eval.horizontal.length>=4){
					            		if(eval.horizontal[i].indexY == j && eval.horizontal[i].indexX ==i){
					            			specialArray.push(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object)
					            			gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object.special = true
					            			gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object.specialFromHorizontal = true
					            			gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object.image.loadTexture("atlas.game",COLORS[gameArray[eval.horizontal[i].y][eval.horizontal[i].x].type]+"_especial")
					            		}
					            		else{
					            			destroyObjects.push(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object)
					            		}
					            	}
					            	else{
                                    	destroyObjects.push(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object)
                                    }
                                }
                            }
                            if(eval.vertical.length >=3){
                                for(var i = 0; i < eval.vertical.length; i++){
                                	if(eval.horizontal.length>=4){
					            		if(eval.vertical[i].indexY == j && eval.vertical[i].indexX ==i){
					            			specialArray.push(gameArray[eval.vertical[i].y][eval.vertical[i].x].object)
					            			gameArray[eval.vertical[i].y][eval.vertical[i].x].object.special = true
					            			gameArray[eval.vertical[i].y][eval.vertical[i].x].object.specialFromHorizontal = true
					            			gameArray[eval.vertical[i].y][eval.vertical[i].x].object.image.loadTexture("atlas.game",COLORS[gameArray[eval.horizontal[i].y][eval.horizontal[i].x].type]+"_especial")
					            		}
					            		else{
					            			destroyObjects.push(gameArray[eval.vertical[i].y][eval.vertical[i].x].object)
					            		}
					            	}
					            	else{
                                    	destroyObjects.push(gameArray[eval.vertical[i].y][eval.vertical[i].x].object)
                                    }
                                }
                            }

                            if(destroyObjects.length != 0){
                            	break
                            }
                        }
                        if(destroyObjects.length != 0){
                        	break
                        }
                    }

                    if(destroyObjects.length == 0){
                    	inMove = false
                        selectedSlot = null
                        isFallingOjects = false

                        deployBurguer()
                        evalMoves()
                    }
                    else{

                    	for(var k =0; k < destroyObjects.length; k++){
                    		var eval = evaluateObject(destroyObjects[k].indexX,destroyObjects[k].indexY)
                            if(eval.horizontal.length >=3){
                                for(var i = 0; i < eval.horizontal.length; i++){
                                	if(eval.horizontal.length>=4){
					            		if(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object == destroyObjects[k]){
					            			specialArray.push(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object)
					            			gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object.special = true
					            			gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object.specialFromHorizontal = true
					            			gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object.image.loadTexture("atlas.game",COLORS[gameArray[eval.horizontal[i].y][eval.horizontal[i].x].type]+"_especial")
					            		}
					            		else{
					            			if(destroyObjects.indexOf(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object)==-1){
		                                    	destroyObjects.push(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object)
		                                    }
					            		}
					            	}
					            	else{
	                                	if(destroyObjects.indexOf(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object)==-1){
	                                    	destroyObjects.push(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object)
	                                    }
	                                }
                                }
                            }

                            if(eval.vertical.length >=3){
                                for(var i = 0; i < eval.vertical.length; i++){
                                	if(eval.horizontal.length>=4){
					            		if(gameArray[eval.vertical[i].y][eval.vertical[i].x].object == destroyObjects[k]){
					            			specialArray.push(gameArray[eval.vertical[i].y][eval.vertical[i].x].object)
					            			gameArray[eval.vertical[i].y][eval.vertical[i].x].object.special = true
					            			gameArray[eval.vertical[i].y][eval.vertical[i].x].object.specialFromHorizontal = false
					            			gameArray[eval.vertical[i].y][eval.vertical[i].x].object.image.loadTexture("atlas.game",COLORS[gameArray[eval.vertical[i].y][eval.vertical[i].x].type]+"_especial")
					            		}
					            		else{
					            			if(destroyObjects.indexOf(gameArray[eval.vertical[i].y][eval.vertical[i].x].object)==-1){
		                                	    destroyObjects.push(gameArray[eval.vertical[i].y][eval.vertical[i].x].object)
		                                	}
					            		}
					            	}
					            	else{
	                                	if(destroyObjects.indexOf(gameArray[eval.vertical[i].y][eval.vertical[i].x].object)==-1){
	                                	    destroyObjects.push(gameArray[eval.vertical[i].y][eval.vertical[i].x].object)
	                                	}
	                                }
                                }
                            }
                    	}

                    	
                        makeDestroy(destroyObjects)
                    }
                }
            }
        }

    }


    function evalMoves(){
    	var found = false
    	for(var j =0; j < ARRAY_HEIGTH-1; j++){
    		for(var i = 0; i < ARRAY_WIDTH-1; i++){
    			//evalHorizontal
    			
    			var g,gh,gv
    			g = gameArray[j][i]
    			gh = gameArray[j][i+1]
    			gv = gameArray[j+1][i]
    			//console.log(i,j,COLORS[g.type])

    			if(g.type == gh.type){
    				if(i-2>=0){
    					if(gameArray[j][i-2].type == g.type){
							found = true
							break
						}
    				}

    				if(i-1 >=0){
    					if(j-1>=0){
    						if(gameArray[j-1][i-1].type == g.type){
    							found = true
    							break
    						}
    					}
    					if(j+1<ARRAY_HEIGTH){
    						if(gameArray[j+1][i-1].type == g.type){
    							found = true
    							break
    						}
    					}

    				}

    				if(i+2<ARRAY_WIDTH){
    					if(j-1>=0){
    						if(gameArray[j-1][i+2].type == g.type){
    							found = true
    							break
    						}
    					}
    					if(j+1<ARRAY_HEIGTH){
    						if(gameArray[j+1][i+2].type == g.type){
    							found = true
    							break
    						}
    					}
    				}

    				if(i+3<ARRAY_WIDTH){
    					if(gameArray[j][i+3].type == g.type){
							found = true
							break
						}
    				}
    			}

    			if(g.type == gv.type){
    				if(j-2>=0){
    					if(gameArray[j-2][i].type == g.type){
							found = true
							break
						}
    				}

    				if(j-1>=0){
    					if(i-1 >=0){
    						if(gameArray[j-1][i-1].type == g.type){
    							found = true
    							break
    						}
    					}

    					if(i+1<ARRAY_WIDTH){
    						if(gameArray[j-1][i+1].type == g.type){
    							found = true
    							break
    						}
    					}
    				}

    				if(j+2<ARRAY_HEIGTH){

    					if(i-1 >=0){
    						if(gameArray[j+2][i-1].type == g.type){
    							found = true
    							break
    						}
    					}

    					if(i+1<ARRAY_WIDTH){
    						if(gameArray[j+2][i+1].type == g.type){
    							found = true
    							break
    						}
    					}
    				}

    				if(j+3<ARRAY_HEIGTH){
    					if(gameArray[j+3][i].type == g.type){
							found = true
							break
						}
    				}
    			}
    		}
    		if(found){
    			break
    		}
    	}

    	if(!found){
    		//console.log("Not find posibility")
    		inTransition = true
    		remakeObjects()
    	}
    	
    }


    function remakeObjects() {


    	for(var j =0; j < ARRAY_HEIGTH; j++){
    		for(var i = 0; i < ARRAY_WIDTH; i++){

    			var t = game.add.tween(gameArray[j][i].object.scale).to({x:0,y:0},300,Phaser.Easing.linear,true)

    			if(i==ARRAY_WIDTH-1 && j==ARRAY_HEIGTH-1){
    				t.onComplete.add(reescaleObjects,this)
    			}
    			
    		}
    	}

    	
    }

    function reescaleObjects(){

    	for(var j = 0; j < ARRAY_HEIGTH; j++){
            for(var i =0; i < ARRAY_WIDTH; i ++){
            	var r = game.rnd.integerInRange(0,TYPES-1)
            	if(!gameArray[j][i].object.special){
	    			gameArray[j][i].object.image.loadTexture("atlas.game",COLORS[r])
	    			gameArray[j][i].object.type = r
	    			gameArray[j][i].type = r
	    		}
	    		game.add.tween(gameArray[j][i].object.scale).to({x:1,y:1},300,Phaser.Easing.linear,true)
            }
        }

        inTransition = false

    	for(var j = 0; j < ARRAY_HEIGTH; j++){
            for(var i =0; i < ARRAY_WIDTH; i ++){
            
                var eval = evaluateObject(i,j)
                //console.log(eval)
                if(eval.horizontal.length >=3 || eval.vertical.length >=3){
                    gameArray[j][i].type ++

                    if(gameArray[j][i].type>TYPES-1){
                        gameArray[j][i].type =0
                    }
                    gameArray[j][i].object.type = gameArray[j][i].type
                    //gameArray[j][i].object.tint = COLORS[gameArray[j][i].type]
                    gameArray[j][i].object.image.loadTexture("atlas.game",COLORS[gameArray[j][i].type])
                    i--
                }
            }
        }
    }

    function updateTouch(){

        if(game.input.activePointer.isDown){

            if(inMove){
            	return
            }

            if(selectedSlot==null){
            	if(touch.x == -1){
	                touch.x = game.input.activePointer.x
	                touch.y = game.input.activePointer.y
            	}
            	else{
	                for(var i=0; i < slotsGroup.length; i++){
	                    if(checkOverlap(touch,slotsGroup.children[i])){
	                        selectedSlot = slotsGroup.children[i]
	                        break
	                    }
	                }
	            }
            }
            else{
                var dX = game.input.activePointer.x - touch.x
                var dY = game.input.activePointer.y - touch.y
                var objectMove
                if(dX > DELTA_SWIPE && selectedSlot.indexX < ARRAY_WIDTH-1){
                    objectMove = gameArray[selectedSlot.indexY][selectedSlot.indexX+1].object
                }
                else if(dX < -DELTA_SWIPE && selectedSlot.indexX > 0){
                    objectMove = gameArray[selectedSlot.indexY][selectedSlot.indexX-1].object
                }
                else if(dY > DELTA_SWIPE && selectedSlot.indexY > 0){
                    objectMove = gameArray[selectedSlot.indexY-1][selectedSlot.indexX].object
                }
                else if(dY < -DELTA_SWIPE && selectedSlot.indexY < ARRAY_HEIGTH-1){
                    objectMove = gameArray[selectedSlot.indexY+1][selectedSlot.indexX].object
                }

                if(objectMove!=null){
                    inMove = true
                    objectChange = objectMove
                    buble1.visible = true
                    buble1.x = objectChange.x
                    buble1.y = objectChange.y
                    buble2.visible = true
                    buble2.x = selectedSlot.x
                    buble2.y = selectedSlot.y
                    game.add.tween(selectedSlot).to({x:objectChange.x,y:objectChange.y},TIME_MOVE_TWEEN,Phaser.Easing.linear,true)
                    var tween = game.add.tween(objectChange).to({x:selectedSlot.x,y:selectedSlot.y},TIME_MOVE_TWEEN,Phaser.Easing.linear,true)
                    tween.onComplete.add(endMove,this)
                }
            }
        }
        else{
        	if(!inMove){
	        	if(selectedSlot==null){
	        		//inMove = false
			        touch.x = -1
			        touch.y = -1
		            selectedSlot = null
		            
		        }
		        else{
		        	selectedSlot = null
		        }
		         //console.log(selectedSlot)
		    }
		    //console.log(inMove)
        }
    }

    function endMove(){
        //console.log(selectedSlot)
        sound.play("pop")
        buble1.visible = false
        buble2.visible = false
        var tempX = selectedSlot.indexX
        var tempY = selectedSlot.indexY
        selectedSlot.indexX = objectChange.indexX
        selectedSlot.indexY = objectChange.indexY
        objectChange.indexX = tempX
        objectChange.indexY = tempY
        gameArray[selectedSlot.indexY][selectedSlot.indexX].object = selectedSlot
        gameArray[objectChange.indexY][objectChange.indexX].object = objectChange
        gameArray[selectedSlot.indexY][selectedSlot.indexX].type = selectedSlot.type
        gameArray[objectChange.indexY][objectChange.indexX].type = objectChange.type
        //inMove = false
        var destroyObjects = []

        var eval = evaluateObject(selectedSlot.indexX,selectedSlot.indexY)
        if(eval.horizontal.length >=3){
            for(var i = 0; i < eval.horizontal.length; i++){
            	if(eval.horizontal.length>=4){
            		if(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object == selectedSlot){
            			specialArray.push(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object)
            			gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object.special = true
            			gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object.specialFromHorizontal = true
            			gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object.image.loadTexture("atlas.game",COLORS[gameArray[eval.horizontal[i].y][eval.horizontal[i].x].type]+"_especial")
            		}
            		else{
            			destroyObjects.push(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object)
            		}
            	}
            	else{
                	destroyObjects.push(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object)
                }
            }
        }

        if(eval.vertical.length >=3){
            for(var i = 0; i < eval.vertical.length; i++){
            	if(eval.vertical.length>=4){
            		if(gameArray[eval.vertical[i].y][eval.vertical[i].x].object == selectedSlot){
            			specialArray.push(gameArray[eval.vertical[i].y][eval.vertical[i].x].object)
            			gameArray[eval.vertical[i].y][eval.vertical[i].x].object.special = true
            			gameArray[eval.vertical[i].y][eval.vertical[i].x].object.specialFromHorizontal = false
            			gameArray[eval.vertical[i].y][eval.vertical[i].x].object.image.loadTexture("atlas.game",COLORS[gameArray[eval.vertical[i].y][eval.vertical[i].x].type]+"_especial")
            		}
            		else{
            			destroyObjects.push(gameArray[eval.vertical[i].y][eval.vertical[i].x].object)
            		}
            	}
            	else{
                	destroyObjects.push(gameArray[eval.vertical[i].y][eval.vertical[i].x].object)
                }
            }
        }

        eval = evaluateObject(objectChange.indexX,objectChange.indexY)
        if(eval.horizontal.length >=3){
            for(var i = 0; i < eval.horizontal.length; i++){
            	if(eval.horizontal.length>=4){
            		if(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object == objectChange){
            			specialArray.push(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object)
            			gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object.special = true
            			gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object.specialFromHorizontal = true
            			gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object.image.loadTexture("atlas.game",COLORS[gameArray[eval.horizontal[i].y][eval.horizontal[i].x].type]+"_especial")
            		}
            		else{
            			destroyObjects.push(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object)
            		}
            	}
            	else{
                	destroyObjects.push(gameArray[eval.horizontal[i].y][eval.horizontal[i].x].object)
                }
            }
        }
        if(eval.vertical.length >=3){
            for(var i = 0; i < eval.vertical.length; i++){
            	if(eval.vertical.length>=4){
            		if(gameArray[eval.vertical[i].y][eval.vertical[i].x].object == objectChange){
            			specialArray.push(gameArray[eval.vertical[i].y][eval.vertical[i].x].object)
            			gameArray[eval.vertical[i].y][eval.vertical[i].x].object.special = true
            			gameArray[eval.vertical[i].y][eval.vertical[i].x].object.specialFromHorizontal = false
            			gameArray[eval.vertical[i].y][eval.vertical[i].x].object.image.loadTexture("atlas.game",COLORS[gameArray[eval.vertical[i].y][eval.vertical[i].x].type]+"_especial")
            		}
            		else{
            			destroyObjects.push(gameArray[eval.vertical[i].y][eval.vertical[i].x].object)
            		}
            	}
            	else{
                	destroyObjects.push(gameArray[eval.vertical[i].y][eval.vertical[i].x].object)
                }
            }
        }



        if(destroyObjects.length == 0){
            
            game.add.tween(selectedSlot).to({x:objectChange.x,y:objectChange.y},TIME_MOVE_TWEEN,Phaser.Easing.linear,true)
            var tween = game.add.tween(objectChange).to({x:selectedSlot.x,y:selectedSlot.y},TIME_MOVE_TWEEN,Phaser.Easing.linear,true)
            tween.onComplete.add(function(){
            	//inMove = false
            	isFallingOjects = false

                var tempX = selectedSlot.indexX
                var tempY = selectedSlot.indexY

                selectedSlot.indexX = objectChange.indexX
                selectedSlot.indexY = objectChange.indexY
                objectChange.indexX = tempX
                objectChange.indexY = tempY
                gameArray[selectedSlot.indexY][selectedSlot.indexX].object = selectedSlot
                gameArray[objectChange.indexY][objectChange.indexX].object = objectChange
                gameArray[selectedSlot.indexY][selectedSlot.indexX].type = selectedSlot.type
                gameArray[objectChange.indexY][objectChange.indexX].type = objectChange.type
                inMove = false
                selectedSlot = null

            },this)
            
        }
        else{
            isFallingOjects = true
            //console.log(gameArray)
            makeDestroy(destroyObjects)
        }
    }

    function makeDestroy(d){

    	var destroyObjects = []
    	var makeDestroyEffect = false
    	for(var k =0; k < d.length; k++){
    		if(destroyObjects.indexOf(d[k])==-1 && d[k]!=null){
    			destroyObjects.push(d[k])
    			
    			if(d[k].special){
    				//console.log(d[k])
    				makeDestroyEffect = true
    				d[k].shine.visible = false
    				d[k].special = false
    				var index = specialArray.indexOf(d[k])
    				specialArray.splice(index,1)
    				var exp = getExplosion()
    				exp.x = d[k].x
    				exp.y = d[k].y
    				var totalScale
    				if(d[k].specialFromHorizontal){
    					exp.angle = 0
    					totalScale = Math.abs(d[k].x-game.world.centerX-54) + game.world.centerX-54
    					//console.log("destroy line vertical ",d[k].indexY)
    					var j = d[k].indexY
    					//console.log("d.length ",d.length)
    					for(var i=0; i < ARRAY_WIDTH; i++){
    						d.push(gameArray[j][i].object)
    					}
    					//console.log("d.length ",d.length)

    				}
    				else{
    					exp.angle = 90
    					totalScale = Math.abs(d[k].y-game.world.height-422) + game.world.height-422
    					//console.log("destroy line vertical ",d[k].indexX)
    					var i = d[k].indexX
    					//console.log("d.length ",d.length)
    					for(var j=0; j < ARRAY_HEIGTH; j++){
    						d.push(gameArray[j][i].object)
    					}
    					//console.log("d.length ",d.length)
    				}
    				var scale = 1
    				console.log(totalScale)
    				if(totalScale > (716)/2){
    					scale = totalScale/(716/2)
    				}
    				console.log(scale)
    				game.add.tween(exp.scale).to({x:scale,y:1},300,Phaser.Easing.linear,true).onComplete.add(function(target){
    					game.add.tween(target).to({x:0,y:0},300,Phaser.Easing.linear,true)
    				})
    			}
    		}
    	}
        

        if(makeDestroyEffect){
        	isFallingOjects = false
        	console.log("Do destroy delay")
        	setTimeout(function() {doDestroy(destroyObjects)},600)
        }
        else{
        	console.log("Do destroy _normal")
        	doDestroy(destroyObjects)
        }

    }

    function getExplosion(){
    	for(var i =0; i < explosionGroup.length; i++){
    		if(!explosionGroup.children[i].visible){
    			var exp = explosionGroup.children[i]
    			exp.scale.setTo(0,0.5)
    			exp.visible = true
    			return exp
    		}
    	}

    	var exp = explosionGroup.create(0,0,"atlas.game","explosion3")
    	exp.anchor.setTo(0.5)
    	exp.scale.setTo(0,0.5)
    	exp.mask = slotMask
    	return exp

    }

    function doDestroy(destroyObjects){

    	for(var i =0; i< explosionGroup.length; i++){
    		if(explosionGroup.children[i].visible){
    			explosionGroup.children[i].visible = false
    		}
    	}
    	isFallingOjects = true
    	addPoint(destroyObjects.length,{x:game.world.width-80,y:80})

    	for(var i =0; i < destroyObjects.length; i++){
        	getMoveFood(destroyObjects[i].x,destroyObjects[i].y,destroyObjects[i].type)
            //destroyObjects[i].clear()
            destroyObjects[i].type = game.rnd.integerInRange(0,TYPES-1)
            //console.log(destroyObjects[i].type)
            //destroyObjects[i].beginFill(0xffffff)
            destroyObjects[i].drawRoundedRect(-SLOT_SIZE/2,-SLOT_SIZE/2,SLOT_SIZE,SLOT_SIZE,20)
            //destroyObjects[i].endFill()
            destroyObjects[i].image.loadTexture("atlas.game",COLORS[destroyObjects[i].type])

            if(destroyObjects[i].special){
            	destroyObjects[i].special = false
            	destroyObjects[i].shine.visible = false
            }
            //destroyObjects[i].y -= SLOT_SIZE*ARRAY_HEIGTH
            gameArray[destroyObjects[i].indexY][destroyObjects[i].indexX].type = -1
            gameArray[destroyObjects[i].indexY][destroyObjects[i].indexX].object = null

        }

        var objectsMoveInLine = []
        var helperPosicionLine = []
        for(var i = 0; i < ARRAY_WIDTH; i++){
            var numberMove = 0
            objectsMoveInLine[i] = 0
            helperPosicionLine[i] = 0
            for(var j= 0; j < ARRAY_HEIGTH; j++){
                if(gameArray[j][i].object==null){
                    numberMove ++
                    objectsMoveInLine[i]++

                }
                else{
                	if(numberMove!=0){
	                    gameArray[j-numberMove][i].object = gameArray[j][i].object
	                    gameArray[j-numberMove][i].type = gameArray[j][i].type
	                    gameArray[j][i].object.indexY = j-numberMove
	                    gameArray[j][i].object.nextY = space_0.y - ((j-numberMove)*SLOT_SIZE)
	                    
	                    gameArray[j][i].object = null
	                    gameArray[j][i].type = -1
	                }

                }
            }
        }

        for(var i =0; i < destroyObjects.length; i++){
           
            destroyObjects[i].y = space_0.y - ((ARRAY_HEIGTH+helperPosicionLine[destroyObjects[i].indexX])*SLOT_SIZE)
            helperPosicionLine[destroyObjects[i].indexX]++
            destroyObjects[i].indexY = ARRAY_HEIGTH - objectsMoveInLine[destroyObjects[i].indexX]
            objectsMoveInLine[destroyObjects[i].indexX]--
            
            destroyObjects[i].nextY = space_0.y - (destroyObjects[i].indexY*SLOT_SIZE)
            gameArray[destroyObjects[i].indexY][destroyObjects[i].indexX].object = destroyObjects[i]
            gameArray[destroyObjects[i].indexY][destroyObjects[i].indexX].type = destroyObjects[i].type
        }
    }

    function deployBurguer(){
    	pointsToGive = 0
    	var min = typeCount[0]
    	for(var i =0; i < TYPES; i++){
    		if(typeCount[i] < POINTS_CREATE_BURGUER){
    			min = 0
    			break
    		}
    		else{
    			if(typeCount[i]<min){
    				min = typeCount[i]
    			}
    		}
    	}

    	if(min !=0){
    		pointsToGive = Math.floor(min/POINTS_CREATE_BURGUER)
    		for(var i =0; i < TYPES; i++){
    			typeCount[i]-=pointsToGive*POINTS_CREATE_BURGUER
    			numberTexts[i].setText(typeCount[i]+"/"+((integertBurguer-1)*POINTS_CREATE_BURGUER))
    		}
    		if(pointsToGive<1){
    			pointsToGive = 1
    		}
    		var bandeja = getBurguer()
    		bandeja.pointsToGive = pointsToGive
	    	bandeja.tweenScale = game.add.tween(bandeja.scale).to({x:1,y:1},100,Phaser.Easing.linear,true)
	    	bandeja.tweenMove = game.add.tween(bandeja).to({y:bandeja.y-550},1300,Phaser.Easing.linear,true)
	    	bandeja.tweenMove.onComplete.add(function(target){
	    		target.tweenScale = game.add.tween(target.scale).to({x:0,y:0},100,Phaser.Easing.linear,true)
	    		//addPoint(target.pointsToGive,{x:game.world.width-80,y:80})
	    		sound.play("cashRegister")
	    		for(var j = 0; j < pointsToGive; j++){
		    		var person
		    		for(var i =0; i < peopleArray.length; i++){
		    			if(person==null){
		    				if(peopleArray[i].isActive){
		    					person = peopleArray[i]
		    				}
		    			}
		    			else{
			    			if(person.timeWait > peopleArray[i].timeWait && peopleArray[i].isActive){
			    				person = peopleArray[i]
			    			}
			    		}
		    		}

		    		integertBurguer--
		    		textTickets.setText((initialCurrentBurguer-integertBurguer)+"/"+initialCurrentBurguer)

		    		if(integertBurguer==0){
		    			setRound()
		    		}

		    		dissapearPerson(person,true)
		    	}

	    		target.tweenScale.onComplete.add(function(target){
	    			target.visible = false
	    		})
	    	})
    	}

    }

    function setRound(){
    	currentBurguer+=DELTA_BURGUER
    	integertBurguer = Math.floor(currentBurguer)
    	initialCurrentBurguer = integertBurguer
    	textTickets.setText("0/"+initialCurrentBurguer)
        for(var i =0; i < TYPES; i++){
            numberTexts[i].setText(typeCount[i]+"/"+(integertBurguer*POINTS_CREATE_BURGUER))
        }
    	if(currentTime>MIN_TIME){
    		currentTime-=DELTA_TIME
    		updateTimer()
    	}


    	currentLevel++
    	peopleCurrentIndex = 0
    	stopTimer = true
    	levelText.setText("Nivel "+currentLevel)
    	levelDisplay.x = -game.world.centerX
    	game.add.tween(levelDisplay).to({x:game.world.centerX},500,Phaser.Easing.linear,true).onComplete.add(function(){
    		sound.play("rightChoice")
        	game.add.tween(levelDisplay).to({x:game.world.width + game.world.centerX},500,Phaser.Easing.linear,true,500).onComplete.add(function(){
        		
        		stopTimer = false
        		for(var i =0; i < peopleArray.length; i++){
		    		appearPerson(peopleArray[i])
		    	}
        	})
        })
    }

    function endRound(){

        
    }

    function createBackground(){

        touch = sceneGroup.create(0,0,"atlas.game","star")
        touch.scale.setTo(0.2)
        touch.anchor.setTo(0.5)
        touch.alpha = 1

        var backgroundTop = game.add.graphics()
        backgroundTop.beginFill(0xffffff)
        backgroundTop.drawRect(0,0,game.world.width,game.world.height*0.2)
        backgroundTop.endFill()
        sceneGroup.add(backgroundTop)

        var pared = game.add.tileSprite(0,0,game.world.width,game.world.height*0.2,"atlas.game","piso_patron")
        sceneGroup.add(pared)

        var pared = game.add.tileSprite(0,0,game.world.width,64,"atlas.game","pared_patron")
        sceneGroup.add(pared)

        var pared1 = sceneGroup.create(0,0,"atlas.game","pared")
       	pared1.scale.setTo(-1,1)
       	pared1.anchor.setTo(1,0)
        var pared2 = sceneGroup.create(game.world.width,0,"atlas.game","pared")
        pared2.anchor.setTo(1,0)

        var door = sceneGroup.create(game.world.centerX,-5,"atlas.game","puerta")
        door.anchor.setTo(0.5,0.5)

        var mesa = sceneGroup.create(game.world.centerX,65,"atlas.game","mesas")
        mesa.anchor.setTo(0.5,0)

        var degragado = sceneGroup.create(0,0,"atlas.game","degradado")
        degragado.anchor.setTo(0,0)

        if(game.world.width>degragado.width){
        	var scale = game.world.width/degragado.width
        	degragado.scale.setTo(scale,1)
        }


        var bmd = game.add.bitmapData(game.world.width, game.world.height*0.7)

        var y = 0;

        for (var i = 0; i < (game.world.height*0.7)/2; i++)
        {
            var c = Phaser.Color.interpolateColor(0x241f1b, 0x393938, game.world.height*0.7, i);

            bmd.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c));

            y += 2;
        }

        peopleArray = []
        var r = game.rnd.integerInRange(1,6)
        people1 = sceneGroup.create(game.world.centerX-160,game.world.centerY,"atlas.game","cliente"+r+"_normal")
        people1.anchor.setTo(0.5,1)
        people1.keyNumber = r
        people1.timeWait = 0
        people1.timeSad = game.time.now + (currentTimeAngry/2)
        people1.isActive = true
        people1.emotion = 0
        peopleArray.push(people1)

        currentTimeAngry += DELTA_ANGRY*3
       	r = game.rnd.integerInRange(1,6)
        people2 = sceneGroup.create(game.world.centerX,game.world.centerY,"atlas.game","cliente"+r+"_normal")
        people2.anchor.setTo(0.5,1)
        people2.keyNumber = r
        people2.timeWait = 1
        people2.timeSad = game.time.now + (currentTimeAngry/2)
        people2.isActive = true
        people2.emotion = 0
        peopleArray.push(people2)

        currentTimeAngry += DELTA_ANGRY*3
        r = game.rnd.integerInRange(1,6)
        people3 = sceneGroup.create(game.world.centerX+160,game.world.centerY,"atlas.game","cliente"+r+"_normal")
        people3.anchor.setTo(0.5,1)
        people3.keyNumber = r
        people3.timeWait = 2
        people3.timeSad = game.time.now + (currentTimeAngry/2)
        people3.isActive = true
        people3.emotion = 0
        peopleArray.push(people3)

        peopleCurrentIndex = 2

        var backgroundMiddle = game.add.sprite(0, backgroundTop.height, bmd);
        sceneGroup.add(backgroundMiddle)

        bmd = game.add.bitmapData(game.world.width, 112)

        var y = 0;

        for (var i = 0; i < 112/2; i++)
        {
            var c = Phaser.Color.interpolateColor(0x221a17, 0x3a3a3a, 112, i);

            bmd.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c));

            y += 2;
        }

        var backgroundBottom = game.add.sprite(0, game.world.height - 112, bmd);
        sceneGroup.add(backgroundBottom)

        var planchaS = sceneGroup.create(game.world.centerX-270,game.world.height-122,"atlas.game","plancha")
        planchaS.anchor.setTo(0,1)

        var bar = game.add.tileSprite(0,planchaS.y-planchaS.height-10-64,game.world.width,64,"atlas.game","barra")
        sceneGroup.add(bar)
        barY = bar.y

        people1.y = barY
        people2.y = barY
        people3.y = barY

        people1.hand = sceneGroup.create(people1.x,bar.y-10,"atlas.game","manos_cliente_"+people1.keyNumber)
        //people1.hand.visible = false
        people1.hand.anchor.setTo(0.5,0)

        people1.burguer = sceneGroup.create(people1.x,bar.y-15,"atlas.game","hamburguesa")
        people1.burguer.visible = false
        people1.burguer.anchor.setTo(0.5,0)

        people2.hand = sceneGroup.create(people2.x,bar.y-10,"atlas.game","manos_cliente_"+people2.keyNumber)
        //people2.hand.visible = false
        people2.hand.anchor.setTo(0.5,0)

        people2.burguer = sceneGroup.create(people2.x,bar.y-15,"atlas.game","hamburguesa")
        people2.burguer.visible = false
        people2.burguer.anchor.setTo(0.5,0)

        people3.hand = sceneGroup.create(people3.x,bar.y-10,"atlas.game","manos_cliente_"+people3.keyNumber)
        //people3.hand.visible = false
        people3.hand.anchor.setTo(0.5,0)

        people3.burguer = sceneGroup.create(people3.x,bar.y-15,"atlas.game","hamburguesa")
        people3.burguer.visible = false
        people3.burguer.anchor.setTo(0.5,0)

        var foodTab = sceneGroup.create(game.world.centerX,game.world.height-10,"atlas.game","tablero_hamburguesa")
        foodTab.anchor.setTo(0.5,1)

        space_0 = {x:planchaS.x + 65, y:planchaS.y - 65}

        slotMask = game.add.graphics()
        slotMask.x = game.world.centerX-270
        slotMask.y = planchaS.y-planchaS.height
        slotMask.beginFill(0xff0000)
        slotMask.drawRect(0,0,planchaS.width,planchaS.height)
        slotMask.endFill()

        explosionGroup = game.add.group()
        sceneGroup.add(explosionGroup)
        explosionGroup.mask = slotMask

        slotsGroup = game.add.group()
        sceneGroup.add(slotsGroup)
        slotsGroup.mask = slotMask

        for(var i =0; i < TYPES; i++){
        	var brillo = sceneGroup.create(tabInit.x + (SIZE_SLOT_TAB*i),tabInit.y,"atlas.game","brillo2")
        	brillo.anchor.setTo(0.5)
        	brillo.visible = false
        	brillo.scale.setTo(0)

        	brillo.second = sceneGroup.create(0,0,"atlas.game","brillo2")
        	brillo.second.anchor.setTo(0.5)
        	brillo.addChild(brillo.second)

        	brillo.timeWait = 0
        	brilloArray.push(brillo)
        }

        var bread = sceneGroup.create(foodTab.x - (SIZE_SLOT_TAB*2.5),foodTab.y-foodTab.height/2,"atlas.game","pan_tablero")
        bread.anchor.setTo(0.5)

        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var text = new Phaser.Text(sceneGroup.game, bread.x+30, bread.y+30, "0/"+(integertBurguer*POINTS_CREATE_BURGUER), fontStyle)
        text.anchor.setTo(0.5)
        sceneGroup.add(text)
        numberTexts.push(text)

        bread = sceneGroup.create(foodTab.x - (SIZE_SLOT_TAB*1.5),foodTab.y-foodTab.height/2,"atlas.game","carne_tablero")
        bread.anchor.setTo(0.5)
        text = new Phaser.Text(sceneGroup.game, bread.x+30, bread.y+30, "0/"+(integertBurguer*POINTS_CREATE_BURGUER), fontStyle)
        text.anchor.setTo(0.5)
        sceneGroup.add(text)
        numberTexts.push(text)

        bread = sceneGroup.create(foodTab.x - (SIZE_SLOT_TAB*0.5),foodTab.y-foodTab.height/2,"atlas.game","queso_tablero")
        bread.anchor.setTo(0.5)
        text = new Phaser.Text(sceneGroup.game, bread.x+30, bread.y+30, "0/"+(integertBurguer*POINTS_CREATE_BURGUER), fontStyle)
        text.anchor.setTo(0.5)
        sceneGroup.add(text)
        numberTexts.push(text)

       	bread = sceneGroup.create(foodTab.x + (SIZE_SLOT_TAB*0.5),foodTab.y-foodTab.height/2,"atlas.game","lechuga_tablero")
        bread.anchor.setTo(0.5)
        text = new Phaser.Text(sceneGroup.game, bread.x+30, bread.y+30, "0/"+(integertBurguer*POINTS_CREATE_BURGUER), fontStyle)
        text.anchor.setTo(0.5)
        sceneGroup.add(text)
        numberTexts.push(text)

        bread = sceneGroup.create(foodTab.x + (SIZE_SLOT_TAB*1.5),foodTab.y-foodTab.height/2,"atlas.game","tomate_tablero")
        bread.anchor.setTo(0.5)
        text = new Phaser.Text(sceneGroup.game, bread.x+30, bread.y+30, "0/"+(integertBurguer*POINTS_CREATE_BURGUER), fontStyle)
        text.anchor.setTo(0.5)
        sceneGroup.add(text)
        numberTexts.push(text)

        bread = sceneGroup.create(foodTab.x + (SIZE_SLOT_TAB*2.5),foodTab.y-foodTab.height/2,"atlas.game","aros_tablero")
        bread.anchor.setTo(0.5)
        text = new Phaser.Text(sceneGroup.game, bread.x+30, bread.y+30, "0/"+(integertBurguer*POINTS_CREATE_BURGUER), fontStyle)
        text.anchor.setTo(0.5)
        sceneGroup.add(text)
        numberTexts.push(text)

        buble1 = sceneGroup.create(0,0,"atlas.game","selector_cambio")
        buble1.anchor.setTo(0.5)
        buble1.visible = false

        buble2 = sceneGroup.create(0,0,"atlas.game","selector_cambio")
        buble2.anchor.setTo(0.5)
        buble2.visible = false

        bandejaGroup = game.add.group()
        sceneGroup.add(bandejaGroup)

        moveFoodGroup = game.add.group()
        sceneGroup.add(moveFoodGroup)

        var ticketback = sceneGroup.create(planchaS.x+planchaS.width+20,game.world.centerY -200,"atlas.game","ticket_contenedor")
        ticketback.anchor.setTo(0,0.5)

        var ticketShadow = sceneGroup.create(ticketback.x,game.world.centerY +100,"atlas.game","sombra")
        ticketShadow.anchor.setTo(0,0.5)

        var scale = game.world.width -ticketback.x
        if(scale > ticketback.width){
            scale = scale/ticketback.width
            ticketback.scale.setTo(scale,1)
            ticketShadow.scale.setTo(scale,1)
        }

        ticketSprite = sceneGroup.create(game.world.centerX+235,ticketback.y,"atlas.game","ticket")
        ticketSprite.anchor.setTo(0.5,0)

        fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        textTickets = new Phaser.Text(sceneGroup.game, ticketSprite.x, ticketSprite.y+60, "0/"+initialCurrentBurguer, fontStyle)
        textTickets.anchor.setTo(0.5)
        sceneGroup.add(textTickets)


        levelDisplay = game.add.graphics()
        levelDisplay.x = -game.world.centerX
        levelDisplay.y = game.world.centerY
        //levelDisplay.beginFill(0x666666)
        levelDisplay.drawRoundedRect(-200,-120,400,240,20)
        //levelDisplay.endFill()
        sceneGroup.add(levelDisplay)

        fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        levelText = new Phaser.Text(sceneGroup.game, 0, 0, "Nivel 1", fontStyle)
        levelText.anchor.setTo(0.5)
        levelDisplay.addChild(levelText)

        game.add.tween(levelDisplay).to({x:game.world.centerX},500,Phaser.Easing.linear,true).onComplete.add(function(){
        	sound.play("rightChoice")
        	game.add.tween(levelDisplay).to({x:game.world.width + game.world.centerX},500,Phaser.Easing.linear,true,500).onComplete.add(function(){
        		stopTimer = false
        	})
        })



    }


    function dissapearPerson(person,happy){
    	person.isActive = false
    	if(happy){
    		person.burguer.visible = true
    		person.loadTexture("atlas.game","cliente"+person.keyNumber+"_feliz")
    	}
    	else{
    		person.loadTexture("atlas.game","cliente"+person.keyNumber+"_enojado")
    		missPoint()
    	}

    	game.add.tween(person.hand).to({alpha:0},100,Phaser.Easing.linear,true,1000)
    	game.add.tween(person.burguer).to({alpha:0},100,Phaser.Easing.linear,true,1000)
    	
    	var t = game.add.tween(person).to({y:person.y+person.height+100},500,Phaser.Easing.linear,true,1000)
    	t.onComplete.add(function(target){
    		target.hand.visible = false
    		target.hand.alpha = 1

    		target.burguer.visible = false
    		target.burguer.alpha = 1

    		target.keyNumber = game.rnd.integerInRange(1,6)
    		target.hand.loadTexture("atlas.game","manos_cliente_"+target.keyNumber)
    		target.loadTexture("atlas.game","cliente"+target.keyNumber+"_normal")
    		if(integertBurguer>2 && !stopTimer){
    			appearPerson(target)
    		}
    	})

    }


    function appearPerson(person){

    	game.add.tween(person).to({y:barY},500,Phaser.Easing.linear,true).onComplete.add(function(target){
    		peopleCurrentIndex ++
    		target.hand.visible = true
    		target.isActive = true
    		currentTimeAngry-=DELTA_ANGRY
    		target.timeWait = peopleCurrentIndex
    		target.timeSad = game.time.now + (currentTimeAngry/2)
    		target.emotion = 0
    	})

    }

    function getBurguer(){
    	for(var i =0; i < bandejaGroup.length; i++){
    		if(!bandejaGroup.children[i].visible){
    			var bandeja = bandejaGroup.children[i]
    			bandeja.visible = true
    			bandeja.y = game.world.height-132
    			bandeja.scale.setTo(0)
    			return bandeja
    		}
    	}


    	var bandeja = bandejaGroup.create(game.world.centerX-270+433+46+10,game.world.height-132-64,"atlas.game","bandeja")
        bandeja.anchor.setTo(0.5)
        bandeja.scale.setTo(0)

        bandeja.burguer = bandejaGroup.create(0,0,"atlas.game","hamburguesa")
        bandeja.burguer.anchor.setTo(0.5)
        bandeja.addChild(bandeja.burguer)

        bandejaGroup.add(bandeja)
        //bandeja.burguer.scale.setTo(0)
        return bandeja
    }

    function getMoveFood(x,y,type){
    	for(var i =0; i < moveFoodGroup.length; i++){
    		if(!moveFoodGroup.children[i].visible){
    			var move = moveFoodGroup.children[i]
    			move.visible = true
    			move.x = x
    			move.y = y
    			move.loadTexture("atlas.game",COLORS[type])
    			move.type = type
    			typeCount[type]+=1
    			var tween = game.add.tween(move).to({x:tabInit.x + (type*SIZE_SLOT_TAB),y:tabInit.y},500,Phaser.Easing.linear,true)
    			tween.onComplete.add(finishTweenMove,this)
    			return
    		}
    	}

    	var move = moveFoodGroup.create(x,y,"atlas.game",COLORS[type])
    	move.anchor.setTo(0.5)
    	move.type = type
        typeCount[type]+=1
    	var tween = game.add.tween(move).to({x:tabInit.x + (type*SIZE_SLOT_TAB),y:tabInit.y},500,Phaser.Easing.linear,true)
    	tween.onComplete.add(finishTweenMove,this)
    	return
    }

    function finishTweenMove(target){
    	target.visible = false
    	//console.log(target.type)
    	numberTexts[target.type].setText(typeCount[target.type]+"/"+(integertBurguer*POINTS_CREATE_BURGUER))
    	brilloArray[target.type].visible = true

    	brilloArray[target.type].timeWait = game.time.now + BRILLO_TIME
    	//if(brilloArray[target.type].tween==null){
    		brilloArray[target.type].tween = game.add.tween(brilloArray[target.type].scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
    		//brilloArray[target.type].tween.onComplete.add()
    	//}
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

    function createSlotImages(){

        
        var slot
        //console.log(availableSpaces)
        for(var i =0; i < ARRAY_HEIGTH*ARRAY_WIDTH; i++){
            slot = game.add.graphics()
            //slot.beginFill(0xffffff)
            slot.drawRoundedRect(-SLOT_SIZE/2,-SLOT_SIZE/2,SLOT_SIZE,SLOT_SIZE,20)
            //slot.endFill()

            slot.type = game.rnd.integerInRange(0,TYPES-1)
            //slot.tint = COLORS[slot.type]

            slot.shine = sceneGroup.create(0,0,"atlas.game","brillo1")
            slot.shine.anchor.setTo(0.5)
            slot.shine.visible = false
            slot.addChild(slot.shine)

            slot.image = sceneGroup.create(0,0,"atlas.game","aros")
            slot.image.anchor.setTo(0.5)
            slot.addChild(slot.image)

            var r = game.rnd.integerInRange(0,availableSpaces.length-1)
            gameArray[availableSpaces[r].y][availableSpaces[r].x] = {type:slot.type,object:slot}
            slot.indexX = availableSpaces[r].x
            slot.indexY = availableSpaces[r].y
            slot.x = space_0.x + availableSpaces[r].x*SLOT_SIZE
            slot.y = space_0.y - availableSpaces[r].y*SLOT_SIZE
            slot.special = false
            slot.nextY = -1
            availableSpaces.splice(r,1)

            

            slotsGroup.add(slot)
        }
        for(var j = 0; j < ARRAY_HEIGTH; j++){
            for(var i =0; i < ARRAY_WIDTH; i ++){
            
                var eval = evaluateObject(i,j)
                //console.log(eval)
                if(eval.horizontal.length >=3 || eval.vertical.length >=3){
                    gameArray[j][i].type ++

                    if(gameArray[j][i].type>TYPES-1){
                        gameArray[j][i].type =0
                    }
                    gameArray[j][i].object.type = gameArray[j][i].type
                    //gameArray[j][i].object.tint = COLORS[gameArray[j][i].type]
                    gameArray[j][i].object.image.loadTexture("atlas.game",COLORS[gameArray[j][i].type])
                    i--
                    //console.log("Change color of object")
                }
                else{
                	//gameArray[j][i].object.tint = COLORS[gameArray[j][i].type]
                	//console.log(gameArray[j][i].object)
                	gameArray[j][i].object.image.loadTexture("atlas.game",COLORS[gameArray[j][i].type])
                }
            }
        }

    }

    function evaluateObject(x,y){
        
        var type = gameArray[y][x].type
        //console.log(type)
        var evaluation = {horizontal:[{x:x,y:y}],vertical:[{x:x,y:y}]}

        var temporalX = x-1
        while(temporalX >= 0 && gameArray[y][temporalX].type == type){
            evaluation.horizontal.push({x:temporalX,y:y})
            temporalX--
        }
        
        temporalX = x+1
        while(temporalX <= ARRAY_WIDTH-1 && gameArray[y][temporalX].type == type){
            evaluation.horizontal.push({x:temporalX,y:y})
            temporalX++
        }


        var temporalY = y-1
        while(temporalY >= 0 && gameArray[temporalY][x].type == type){
            evaluation.vertical.push({x:x,y:temporalY})
            temporalY--
        }
        
        temporalY = y+1
        while(temporalY <= ARRAY_HEIGTH-1 && gameArray[temporalY][x].type == type){
            evaluation.vertical.push({x:x,y:temporalY})
            temporalY++
        }

        return evaluation

    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB);

    }

    
    
    function create(){
    	
        
        sceneGroup = game.add.group()

        game.camera.focusOnXY(game.world.centerX, game.world.centerY);

        initialize()

        createBackground()

        //console.log(amazing.getMinigameId())
        if(!amazing.getMinigameId()){
			marioSong = game.add.audio('arcadeSong')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.6)
			}, this);	
		}

        game.onPause.add(function(){
			
			//if(amazing.getMinigameId()){
				marioSong.pause()
			//}
			
	        game.sound.mute = true
	    } , this);

	    game.onResume.add(function(){
			
			//if(amazing.getMinigameId()){
				if(lives > 0){
					marioSong.play()
				}
			//}
			
	        game.sound.mute = false
	    }, this);

        spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        createPointsBar()
        //createHearts()

        var timeBack = game.add.graphics()
        timeBack.x = 55
        timeBack.y = 40
        timeBack.beginFill(0x666666)
        timeBack.drawRoundedRect(-50,-30,100,50,20)
        timeBack.endFill()
        sceneGroup.add(timeBack)
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        timeText = new Phaser.Text(sceneGroup.game, timeBack.x, timeBack.y, "0", fontStyle)
        timeText.anchor.setTo(0.5)
        sceneGroup.add(timeText)

        animateScene()

        loadSounds()

        createObjects()
        createSlotImages()
        //setRound()

    }

    function updateTimer(){
    	currentTime -= game.time.elapsed/1000
    	//console.log(currentTime)
    	var timer = Math.round(currentTime)
    	var minutes = Math.floor(timer/60)
    	var second = timer - (minutes*60)
    	var help = ""
    	if(second<10){
    		help = "0"
    	}
    	

    	if(minutes <=-1){
    		stopGame()
    	}
    	else{
    		timeText.setText(minutes+":"+help+""+second)
    	}
    }

    
    return {
        assets: assets,
        name: "burguerCrush",
        create: create,
        preload: preload,
        update: update
    }
}()