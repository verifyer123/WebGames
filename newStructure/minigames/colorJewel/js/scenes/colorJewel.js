
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"


var colorJewel = function(){
    
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
                name: "atlas.colorJewel",
                json: "images/colorJewel/atlas.json",
                image: "images/colorJewel/atlas.png"
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        /*images: [
            {   name:"fondo",
				file: "images/sympho/fondo.png"}
		],*/
		sounds: [
            {   name: "magic",
                //file: soundsPath + "gameLose.mp3"},
                file: soundsPath + "magic.mp3"},
            {   name: "gameLose",
                //file: soundsPath + "magic.mp3"}
                file: soundsPath + "gameLose.mp3"},
            {
                name:"pop",
                file: soundsPath + "pop.mp3"
            },
            {   name: "wrong",
                file: soundsPath + "wrong.mp3"
            },
            {   name: "combo",
                file: soundsPath + "combo.mp3"}
            ,
            {   name: "dog",
                file: soundsPath + "dog.mp3"}
            ,
            {   name: "gorilla",
                file: soundsPath + "gorilla.mp3"}
            ,
            {   name: "hipo",
                file: soundsPath + "hipo.mp3"}

		]
    }

    var NUM_LIFES = 3
    var ARRAY_WIDTH = 4
    var ARRAY_HEIGHT = 6
    var DELTA_QUAD = 110
    var INITIAL_POSITION
    var VEL_QUAD = 10
    var Y_OUT_MAP
    var INITIAL_JEWEL = 10
    var DELTA_JEWEL = 1
    
    var COLORS_ARRAY=["WHITE","RED","BLUE","GREEN","BLACK","PURPLE","YELLOW","ORANGE"]
    var TINT_ARRAY = [0xffffff,0xd60000,0x00a9f8,0x00ee27,0x6f6570,0xc18bff,0xdef337,0xFF6F00]
    var MAX_COLORS = COLORS_ARRAY.length

    var lives
	var sceneGroup = null
    var gameIndex = 139
    var tutoGroup
    var backgroundSound
    var timeValue
    var numPoints
    var gameGroup
    var heartsGroup
    var pointsBar

    var currentJewelsLevel 
    var currentJewelsCatch
    var correctParticle

    var quadsGroup

    var arrayValues
    var touch

    var gameActive = false
    var touchIsDown

    var gamePaused

    var mask 

    var animalSpines

    var currentColorValue 

    var currentAnimal

    var arrayColorsInScene

    var currentAnimalId 
    var bmd


	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = NUM_LIFES
        numPoints = 0

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        currentJewelsLevel = 10

        INITIAL_POSITION = {x:game.world.centerX-(DELTA_QUAD*1.5), y:game.world.centerY+420}

        touchIsDown = false

        Y_OUT_MAP = INITIAL_POSITION.y-(DELTA_QUAD*2)

        
        arrayColorsInScene = []
        for(var i = 0; i < MAX_COLORS; i++){
        	arrayColorsInScene.push(0)
        }

        gamePaused = false

        currentAnimalId = -1

        loadSounds()

        initiArray()
	}


    function initiArray(){
        arrayValues = []
        for(var i = 0; i < ARRAY_WIDTH; i ++){
            arrayValues[i] = []
            for(var j = 0; j < ARRAY_HEIGHT; j++){
                arrayValues[i][j] = {value: -1, object:null}
            }
        }

    }


    function preload(){
        game.stage.disableVisibilityChange = false;
        //game.stage.disableVisibilityChange = true;

        game.load.audio('colorJewelSong', soundsPath + 'songs/childrenbit.mp3');

        game.load.spine('hipoSpine', "images/spines/hipo/hipo.json");
        game.load.spine('dogSpine', "images/spines/dog/dog.json");
        game.load.spine('gorillaSpine', "images/spines/gorilla/gorilla.json");

        game.load.image('tutorial_image',"images/colorJewel/tutorial_image.png")
        //game.load.image('introscreen',"images/colorJewel/introscreen.png")
        //game.load.image('howTo',"images/colorJewel/how" + localization.getLanguage() + ".png")
        //game.load.image('buttonText',"images/colorJewel/play" + localization.getLanguage() + ".png")

        game.load.spritesheet("coin", 'images/colorJewel/coin.png', 122, 123, 12)

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

        var heartImg = group.create(0,0,'atlas.colorJewel','hearts')

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

        var pointsImg = pointsBar.create(-10,10,'atlas.colorJewel','xpcoins')
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

    function Coin(objectBorn,objectDestiny,time){
       
       
       //objectBorn= Objeto de donde nacen
       coins.x=objectBorn.x
       coins.y=objectBorn.y
       
       /*var emitter = epicparticles.newEmitter("pickedEnergy")
       emitter.duration=1;
       emitter.x = coins.x
       emitter.y = coins.y*/



        correctParticle.x = objectBorn.x
        correctParticle.y = objectBorn.y
        correctParticle.start(true, 1000, null, 5)

       game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
       game.add.tween(coins).to({y:objectBorn.y-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
           game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
               coins.x=objectBorn.centerX
               coins.y=objectBorn.centerY
               //addPoint(1)
           })
       })
    }

    function stopGame(){
        gameActive = false
        backgroundSound.stop()
        sound.play("gameLose")
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 750)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, numPoints, gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
            
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
        numPoints+=number
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        addNumberPart(pointsBar.text,'+' + number)

    }
    
    function missPoint(){
        
    	//loseRabit()
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
            //nextRound()
        }
        
        // addNumberPart(batteryGroup,'-1')
    }
    


    function onClickPlay(rect) {
        

        tutoGroup.y = -game.world.height
        tutoGroup.destroy()
        inputsEnabled = true
        setRound()

    }
    
    function update() {

    	tutorialUpdate()

        if(!gameActive){
        	return
        }

        updateQuads()

        updateTouch()
    }

    

    function updateTouch(){
        if(game.input.activePointer.isDown){
            if(touch.x == -100 && !touchIsDown){
                touch.x = game.input.activePointer.x
                touch.y = game.input.activePointer.y
                touchIsDown = true
            }
        }
        else{
            touch.x = -100
            touch.y = -100
            touchIsDown= false
        }
        
    }

    function updateQuads(){
        if(touch.x!=-100){
            var quad = checkCollision(touch)

            if(quad!=null){

            	if(quad.colorValue == currentColorValue){
                
	            	Coin(quad,pointsBar,100)
	            	addPoint(quad.type*quad.type)
	            	
	            }
	            else{
	            	missPoint()
	            }

				arrayColorsInScene[arrayValues[quad.indexI][quad.indexJ].value]--
				currentJewelsCatch--

				if(arrayColorsInScene[currentColorValue]<=0){
					SetColor()
				}
				else if(currentJewelsCatch<=0){
					SetColor()
				}


				if(quad.type==1){
					arrayValues[quad.indexI][quad.indexJ].value = -1
					arrayValues[quad.indexI][quad.indexJ].object = null
					evalDownInLine(quad.indexI,quad.indexJ,1)
				}
				if(quad.type == 2){
					if(quad.rotated){
						//moveInLine(quad.indexI)
						arrayValues[quad.indexI][quad.indexJ].value = -1
						arrayValues[quad.indexI][quad.indexJ].object = null
						arrayValues[quad.indexI+1][quad.indexJ].value = -1
						arrayValues[quad.indexI+1][quad.indexJ].object = null
						arrayValues[quad.indexI+2][quad.indexJ].value = -1
						arrayValues[quad.indexI+2][quad.indexJ].object = null

						evalDownInLine(quad.indexI,quad.indexJ,1)
						evalDownInLine(quad.indexI+1,quad.indexJ,1)
						evalDownInLine(quad.indexI+2,quad.indexJ,1)
					}
					else{
						arrayValues[quad.indexI][quad.indexJ].value = -1
						arrayValues[quad.indexI][quad.indexJ].object = null	
						arrayValues[quad.indexI][quad.indexJ+1].value = -1
						arrayValues[quad.indexI][quad.indexJ+1].object = null
						arrayValues[quad.indexI][quad.indexJ+2].value = -1
						arrayValues[quad.indexI][quad.indexJ+2].object = null
						evalDownInLine(quad.indexI,quad.indexJ,3)
					}
				}
				else if(quad.type==3){
					if(quad.rotated){
						for(var i = 0; i < 3; i ++){
							for(var j = 0; j < 2; j ++){
								arrayValues[quad.indexI+i][quad.indexJ+j].value = -1
								arrayValues[quad.indexI+i][quad.indexJ+j].object = null
							}
							evalDownInLine(quad.indexI+i,quad.indexJ,2)
						}

					}
					else{
						for(var i = 0; i < 2; i ++){
							for(var j = 0; j < 3; j ++){
								arrayValues[quad.indexI+i][quad.indexJ+j].value = -1
								arrayValues[quad.indexI+i][quad.indexJ+j].object = null
							}
							evalDownInLine(quad.indexI+i,quad.indexJ,3)
						}
					}
				}



                quad.visible = false
                quad.x = -100
                quad.y = -100

                touch.x = -100
                touch.y = -100


                


            }
            else{

            }
        }

        //return

        for (var i = 0; i < ARRAY_WIDTH; i++) {
    		for (var j = ARRAY_HEIGHT-1; j >=0; j--) {
    			if(arrayValues[i][j].object==null){
    				setQuad(i,j,false)
    			}
    			else{
    				break
    			}
    		}
    	}


        //Move down

        for(var i = 0; i < quadsGroup.length; i++){
            if(quadsGroup.children[i].visible){
                if(quadsGroup.children[i].nextY!=-1){
                    quadsGroup.children[i].y+=VEL_QUAD
                    if(quadsGroup.children[i].y >= quadsGroup.children[i].nextY){
                        quadsGroup.children[i].y = quadsGroup.children[i].nextY
                        quadsGroup.children[i].nextY = -1

                        

                        if(quadsGroup.children[i].type == 1){
                        	//horizontalCheck
                        	var lastColor = -1
                        	var countsSame = 0
                        	var createdComboQuad = false
                        	var indexI = 0
                        	var indexJ = quadsGroup.children[i].indexJ

                        	for(var h = 0; h < ARRAY_WIDTH; h++){

                        		if(arrayValues[h][indexJ].object==null ){
                        			
                        			lastColor = -1
                        			countsSame = 0
                        			indexI = h
                        			continue 
	                        		
                        		}

                        		if(arrayValues[h][indexJ].object.type!=1){
                        			lastColor = -1
                        			countsSame = 0
                        			indexI = h
                        			continue
                        		}

                        		if(lastColor==arrayValues[h][indexJ].object.colorValue){

                        			countsSame++
                        			if(countsSame==2){
                        				createdComboQuad = true
                        				var x = INITIAL_POSITION.x + (DELTA_QUAD * (indexI+1) )
                        				var y = INITIAL_POSITION.y - (DELTA_QUAD * indexJ)
                        				var quad = getQuad(x,y,lastColor,2)

                        				arrayColorsInScene[lastColor]-=3

                        				quad.rotated = true
                        				quad.angle = 90
                        				quad.indexI = indexI
        								quad.indexJ = indexJ
        								//quad.nextY = -1
        								quad.nextY = y
        								quad.scale.setTo(0)
        								game.add.tween(quad.scale).to({x:1,y:1},300,Phaser.Easing.Linear.none,true)

        								for(var k = indexI; k <= indexI+2; k++ ){
        									arrayValues[k][indexJ].object.visible = false
        									arrayValues[k][indexJ].object.x = -100
        									arrayValues[k][indexJ].object.y = -100
        									arrayValues[k][indexJ].value = lastColor
        									arrayValues[k][indexJ].object = quad
        								}

        								createdComboQuad = true
        								break
                        			}
                        		}
                        		else{
                        			lastColor = arrayValues[h][indexJ].object.colorValue
                        			countsSame = 0
                        			indexI = h
                        			
                        		}
                        	}

                        	if(createdComboQuad){
                        		continue
                        	}

                        	lastColor = -1
                        	countsSame = 0
                        	createdComboQuad = false
                        	indexI = quadsGroup.children[i].indexI
                        	indexJ = 0

                        	for(var h = 0; h < ARRAY_HEIGHT; h++){
                        		if(arrayValues[indexI][h].object==null ){
                        			lastColor = -1
                        			countsSame = 0
                        			indexJ = h
                        			continue
                        		}

                        		if(arrayValues[indexI][h].object.type!=1 ){
                        			lastColor = -1
                        			countsSame = 0
                        			indexJ = h
                        			continue
                        		}


                        		if(lastColor==arrayValues[indexI][h].object.colorValue){
                        			countsSame++
                        			if(countsSame==2){
                        				createdComboQuad = true
                        				var x = INITIAL_POSITION.x + (DELTA_QUAD * indexI )
                        				var y = INITIAL_POSITION.y - (DELTA_QUAD * (indexJ+1))
                        				var quad = getQuad(x,y,lastColor,2)

                        				quad.rotated = false
                        				quad.angle = 0
                        				quad.indexI = indexI
        								quad.indexJ = indexJ
        								quad.nextY = y
        								//quad.nextY = -1
        								quad.scale.setTo(0)

        								arrayColorsInScene[lastColor]-=3


        								game.add.tween(quad.scale).to({x:1,y:1},300,Phaser.Easing.Linear.none,true)

        								for(var k = indexJ; k <= indexJ+2; k++ ){
        									arrayValues[indexI][k].object.visible = false
        									arrayValues[indexI][k].object.x = -100
        									arrayValues[indexI][k].object.y = -100
        									arrayValues[indexI][k].value = lastColor
        									arrayValues[indexI][k].object = quad

        								}
        								createdComboQuad = true
        								break
                        			}
                        		}
                        		else{
                        			lastColor = arrayValues[indexI][h].object.colorValue
                        			countsSame = 0
                        			indexJ = h
                        			
                        		}
                        	}
                        }
                        else if(quadsGroup.children[i].type==2){
                        	var indexI = quadsGroup.children[i].indexI
                        	var indexJ = quadsGroup.children[i].indexJ
                        	var created = false
                        	if(quadsGroup.children[i].rotated){
                        		if(indexJ<ARRAY_HEIGHT-1){
                        			if(arrayValues[indexI][indexJ+1].object!=null){
		                        		if(arrayValues[indexI][indexJ+1].object.type == 2 && arrayValues[indexI][indexJ+1].object.rotated){
		                        			if(arrayValues[indexI][indexJ+1].value == arrayValues[indexI][indexJ].object.colorValue){
		                        				var x = INITIAL_POSITION.x + (DELTA_QUAD * (indexI+1))
	                        					var y = INITIAL_POSITION.y - (DELTA_QUAD * (indexJ+0.5))
	                        					var quad = getQuad(x,y,arrayValues[indexI][indexJ].object.colorValue,3)
	                        					quad.rotated = true
	                        					quad.angle = 90
	                        					quad.indexI = indexI
		        								quad.indexJ = indexJ
		        								quad.nextY = -1
		        								quad.scale.setTo(0)

		        								arrayColorsInScene[arrayValues[indexI][indexJ].object.colorValue]-=2

		        								game.add.tween(quad.scale).to({x:1,y:1},300,Phaser.Easing.Linear.none,true)

		        								for(var h = 0; h < 2; h ++){
			        								arrayValues[indexI][indexJ+h].object.visible = false
		        									arrayValues[indexI][indexJ+h].object.x = -100
		        									arrayValues[indexI][indexJ+h].object.y = -100	
		        								}

		        								for(var k = 0; k < 3; k++){
		        									for(var h = 0; h < 2; h ++){
		        										arrayValues[indexI+k][indexJ+h].object = quad
		        									}
		        								}
		        								created = true

		                        			}
		                        		}
		                        	}
	                        	}

	                        	if(created){
	                        		continue
	                        	}

	                        	if(indexJ>0){
	                        		if(arrayValues[indexI][indexJ-1].object!=null){
		                        		if(arrayValues[indexI][indexJ-1].object.type == 2 && arrayValues[indexI][indexJ-1].object.rotated){
		                        			if(arrayValues[indexI][indexJ-1].value == arrayValues[indexI][indexJ].object.colorValue){
		                        				var x = INITIAL_POSITION.x + (DELTA_QUAD * (indexI+1))
	                        					var y = INITIAL_POSITION.y - (DELTA_QUAD * ((indexJ-1)+0.5))
	                        					var quad = getQuad(x,y,arrayValues[indexI][indexJ].object.colorValue,3)
	                        					quad.rotated = true
	                        					quad.angle = 90
	                        					quad.indexI = indexI
		        								quad.indexJ = indexJ-1
		        								quad.nextY = -1
		        								quad.scale.setTo(0)

		        								arrayColorsInScene[arrayValues[indexI][indexJ].object.colorValue]-=2

		        								game.add.tween(quad.scale).to({x:1,y:1},300,Phaser.Easing.Linear.none,true)

		        								for(var h = -1; h < 1; h ++){
			        								arrayValues[indexI][indexJ+h].object.visible = false
		        									arrayValues[indexI][indexJ+h].object.x = -100
		        									arrayValues[indexI][indexJ+h].object.y = -100	
		        								}

		        								for(var k = 0; k < 3; k++){
		        									for(var h = -1; h < 1; h ++){
		        										arrayValues[indexI+k][indexJ+h].object = quad
		        									}
		        								}
		                        			}
		                        		}
		                        	}
	                        	}

                        	}
                        	else{
                        		if(indexI<ARRAY_WIDTH-1){
                        			if(arrayValues[indexI+1][indexJ].object!=null){
		                        		if(arrayValues[indexI+1][indexJ].object.type == 2 && !arrayValues[indexI+1][indexJ].object.rotated){
		                        			if(arrayValues[indexI+1][indexJ].value == arrayValues[indexI][indexJ].object.colorValue){
		                        				var x = INITIAL_POSITION.x + (DELTA_QUAD * (indexI+0.5))
	                        					var y = INITIAL_POSITION.y - (DELTA_QUAD * (indexJ+1))
	                        					var quad = getQuad(x,y,arrayValues[indexI][indexJ].object.colorValue,3)
	                        					quad.rotated = false
	                        					quad.angle = 0
	                        					quad.indexI = indexI
		        								quad.indexJ = indexJ
		        								quad.nextY = -1
		        								quad.scale.setTo(0)

		        								arrayColorsInScene[arrayValues[indexI][indexJ].object.colorValue]-=2

		        								game.add.tween(quad.scale).to({x:1,y:1},300,Phaser.Easing.Linear.none,true)

		        								for(var k = 0; k < 2; k ++){
			        								arrayValues[indexI+k][indexJ].object.visible = false
		        									arrayValues[indexI+k][indexJ].object.x = -100
		        									arrayValues[indexI+k][indexJ].object.y = -100	
		        								}

		        								for(var k = 0; k < 2; k++){
		        									for(var h = 0; h < 3; h ++){
		        										arrayValues[indexI+k][indexJ+h].object = quad
		        									}
		        								}

		        								created = true
		                        			}
		                        		}
		                        	}
	                        	}

	                        	if(created){
	                        		continue
	                        	}

	                        	if(indexI>0){
	                        		if(arrayValues[indexI-1][indexJ].object!=null){
		                        		if(arrayValues[indexI-1][indexJ].object.type == 2 && !arrayValues[indexI-1][indexJ].object.rotated){
		                        			if(arrayValues[indexI-1][indexJ].value == arrayValues[indexI][indexJ].object.colorValue){
		                        				var x = INITIAL_POSITION.x + (DELTA_QUAD * ((indexI-1)+0.5))
	                        					var y = INITIAL_POSITION.y - (DELTA_QUAD * (indexJ+1))
	                        					var quad = getQuad(x,y,arrayValues[indexI][indexJ].object.colorValue,3)
	                        					quad.rotated = false
	                        					quad.angle = 0
	                        					quad.indexI = indexI-1
		        								quad.indexJ = indexJ
		        								quad.nextY = -1
		        								quad.scale.setTo(0)

		        								arrayColorsInScene[arrayValues[indexI][indexJ].object.colorValue]-=2

		        								game.add.tween(quad.scale).to({x:1,y:1},300,Phaser.Easing.Linear.none,true)

		        								for(var k = -1; k < 1; k ++){
			        								arrayValues[indexI+k][indexJ].object.visible = false
		        									arrayValues[indexI+k][indexJ].object.x = -100
		        									arrayValues[indexI+k][indexJ].object.y = -100	
		        								}

		        								for(var k = -1; k < 1; k++){
		        									for(var h = 0; h < 3; h ++){
		        										arrayValues[indexI+k][indexJ+h].object = quad
		        									}
		        								}
		                        			}
		                        		}
		                        	}
	                        	}
                        	}
                        }
                    }
                }
            }
        }

    }

    function evalDownInLine(indexI,indexJ,space){
    	var extraLines = []

    	for(var j = indexJ; j < ARRAY_HEIGHT; j++){
        	if(arrayValues[indexI][j].object==null){

        		continue
        	}

    		if(arrayValues[indexI][j].object.type == 1){
    			var countSpaces = 0
    			for(var h = j-1; h >=0; h--){
    				if(arrayValues[indexI][h].value == -1){
    					countSpaces++
    				}
    				else{
    					break
    				}
    			}

    			if(countSpaces!=0){
	        		arrayValues[indexI][j].object.nextY = INITIAL_POSITION.y - (DELTA_QUAD*(j-countSpaces))
	        		arrayValues[indexI][j-countSpaces].value = arrayValues[indexI][j].value
	        		arrayValues[indexI][j-countSpaces].object = arrayValues[indexI][j].object
	        		arrayValues[indexI][j-countSpaces].object.indexJ = j-countSpaces
	        		arrayValues[indexI][j].value = -1
	        		arrayValues[indexI][j].object = null
	        	}
        	}
        	else{
        		var candown = false
        		if(arrayValues[indexI][j].object.type == 2){
        			if(arrayValues[indexI][j].object.rotated){
        				var indexHelpI = arrayValues[indexI][j].object.indexI

        				var countSpaces = 0

        				for(var h = j-1; h >=0; h--){
        					var downLineEmpty = true
        					for(var k = 0; k < 3; k ++){
			    				if(arrayValues[indexHelpI+k][h].value != -1){
			    					downLineEmpty = false
			    				}
			    			}
			    			if(downLineEmpty){
			    				countSpaces++
			    			}
			    			else{
			    				break
			    			}
		    			}
		    			if(countSpaces!=0){

		    			
							arrayValues[indexHelpI][j].object.nextY = arrayValues[indexI][j].object.y + (DELTA_QUAD*countSpaces)
							//arrayValues[indexHelpI][j].object.nextY += 1
							arrayValues[indexHelpI][j].object.indexJ = j-countSpaces
							var quad = arrayValues[indexHelpI][j].object
							var color = arrayValues[indexHelpI][j].value
							


		    				for(var k = 0; k < 3; k++){
								arrayValues[indexHelpI+k][j].value = -1
								arrayValues[indexHelpI+k][j].object = null
							}

							for(var k = 0; k < 3; k++){
								arrayValues[indexHelpI+k][j-countSpaces].value = color
								arrayValues[indexHelpI+k][j-countSpaces].object = quad
								if(indexHelpI+k != indexI){
		    						extraLines.push({i:indexHelpI+k,j:j-countSpaces})
		    					}
							}
		    				
							
							canDown = true
        				}
        			}
        			else{
        				var indexHelpI = arrayValues[indexI][j].object.indexI

        				var countSpaces = 0
		    			for(var h = j-1; h >=0; h--){
		    				if(arrayValues[indexHelpI][h].value == -1){
		    					countSpaces++
		    				}
		    				else{
		    					break
		    				}
		    			}

        				if(countSpaces!=0){
        					arrayValues[indexHelpI][j].object.nextY = arrayValues[indexI][j].object.y + (DELTA_QUAD*countSpaces)

        					arrayValues[indexI][j].object.indexJ = j-countSpaces
        					var quad = arrayValues[indexHelpI][j].object
        					var color = arrayValues[indexHelpI][j].value

        					for(var a = 0; a < 3; a++){
        						arrayValues[indexHelpI][j+a].value = -1
        						arrayValues[indexHelpI][j+a].object = null
        					}

        					for(var a = 0; a < 3; a++){
        						arrayValues[indexHelpI][j-countSpaces+a].value = color
        						arrayValues[indexHelpI][j-countSpaces+a].object = quad
        					}
        					

        					canDown = true
        				}
        			}
        		}
        		else{
					if(arrayValues[indexI][j].object.rotated){

						var indexHelpI = arrayValues[indexI][j].object.indexI
						var indexHelpJ = arrayValues[indexI][j].object.indexJ

        				var countSpaces = 0

        				for(var h = indexHelpJ-1; h >=0; h--){
        					var downLineEmpty = true
        					for(var k = 0; k < 3; k ++){
			    				if(arrayValues[indexHelpI+k][h].value != -1){
			    					downLineEmpty = false
			    				}
			    			}
			    			if(downLineEmpty){
			    				countSpaces++
			    			}
			    			else{
			    				break
			    			}
		    			}

		    			if(countSpaces!=0){

		    				arrayValues[indexHelpI][indexHelpJ].object.nextY = arrayValues[indexI][indexHelpJ].object.y + (DELTA_QUAD*countSpaces)
							//arrayValues[indexHelpI][j].object.nextY += 1
							arrayValues[indexHelpI][indexHelpJ].object.indexJ = indexHelpJ-countSpaces
							var quad = arrayValues[indexHelpI][indexHelpJ].object
							var color = arrayValues[indexHelpI][indexHelpJ].value

		    				for(var k = 0; k < 3; k++){
		    					for(var h = 0 ; h < 2; h++){
		    						arrayValues[indexHelpI+k][indexHelpJ+h].value = -1
		    						arrayValues[indexHelpI+k][indexHelpJ+h].object = null
		    					}
							}

							for(var k = 0; k < 3; k++){
								for(var h = 0 ; h < 2; h++){
		    						arrayValues[indexHelpI+k][indexHelpJ-countSpaces].value = color
		    						arrayValues[indexHelpI+k][indexHelpJ-countSpaces].object = quad
		    						
			    				}
			    				if(indexHelpI+k != indexI){
		    						extraLines.push({i:indexHelpI+k,j:indexHelpJ-countSpaces})
		    					}
							}
		    				
							
							canDown = true
						}
					}
					else{
						var indexHelpI = arrayValues[indexI][j].object.indexI
						var indexHelpJ = arrayValues[indexI][j].object.indexJ

        				var countSpaces = 0

        				for(var h = indexHelpJ-1; h >=0; h--){
        					var downLineEmpty = true
        					for(var k = 0; k < 2; k ++){
			    				if(arrayValues[indexHelpI+k][h].value != -1){
			    					downLineEmpty = false
			    				}
			    			}
			    			if(downLineEmpty){
			    				countSpaces++
			    			}
			    			else{
			    				break
			    			}
		    			}
		    			if(countSpaces!=0){
	        				arrayValues[indexHelpI][indexHelpJ].object.nextY = arrayValues[indexI][indexHelpJ].object.y + (DELTA_QUAD*countSpaces)
	    					//arrayValues[indexHelpI][j].object.nextY += 1
	    					arrayValues[indexHelpI][indexHelpJ].object.indexJ = indexHelpJ-countSpaces
	    					var quad = arrayValues[indexHelpI][indexHelpJ].object
	    					var color = arrayValues[indexHelpI][indexHelpJ].value

	        				for(var k = 0; k < 2; k++){
	        					for(var h = 0 ; h < 3; h++){
		    						arrayValues[indexHelpI+k][indexHelpJ+h].value = -1
		    						arrayValues[indexHelpI+k][indexHelpJ+h].object = null
		    					}
	    					}

	    					for(var k = 0; k < 2; k++){
	    						for(var h = 0 ; h < 3; h++){
		    						arrayValues[indexHelpI+k][indexHelpJ-countSpaces].value = color
		    						arrayValues[indexHelpI+k][indexHelpJ-countSpaces].object = quad
		    						
			    				}
			    				if(indexHelpI+k != indexI){
		    						extraLines.push({i:indexHelpI+k,j:indexHelpJ-countSpaces})
		    					}
	    					}
	        				
	    					
	    					canDown = true
	    				}
					}
        		}
        	}
    	}

    	if(extraLines.length!=0){
    		for(var k = 0; k < extraLines.length; k ++){
	    		evalDownInLine(extraLines[k].i,extraLines[k].j,1)
	    	}
    	}

    	
    }

    function moveInLine(i,j,spaces){
    	for(var h =j; h < ARRAY_HEIGHT; j++ ){
    		arrayValues[i][h].object.nextY = arrayValues[i][h].object.y +(DELTA_QUAD*spaces)
    		arrayValues[i][h].object.indexJ = arrayValues[i][h].object.indexJ-spaces
    	}
    }


    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

    }

    function checkCollision(obj){
        for(var i = 0; i < quadsGroup.length; i ++){
            if(quadsGroup.children[i].visible){
                var collide = checkOverlap(quadsGroup.children[i],obj)
                if(collide){
                    return quadsGroup.children[i]
                }
            }
        }

        return null
    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }

    function setRound(){

        mask = game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.drawRect(0, game.world.centerY-200, game.world.width,game.world.centerY+190);

        
        
        for (var i = 0; i < ARRAY_WIDTH; i++){
        	for(var j = 0; j < ARRAY_HEIGHT; j++){
        		var quad = setQuad(i,j,true)
        	}
        }
        SetColor()
        gameActive = true

    }

    function SetColor(){
    	if(currentJewelsLevel>2){
	    	currentJewelsLevel--
	    }
    	currentJewelsCatch = game.rnd.integerInRange(currentJewelsLevel-1,currentJewelsLevel+1)
    	var arrayTemp = []

    	for(var i = 0 ; i < MAX_COLORS; i++){
    		if(currentColorValue!=i && arrayColorsInScene[i] >0){
    			arrayTemp.push(i)
    		}
    	}

    	var index = game.rnd.integerInRange(0,arrayTemp.length-1)
    	currentColorValue = arrayTemp[index]


    	if(currentAnimal!=null){
    		currentAnimal.spine.setAnimationByName(0, "IDLE", true);
    		currentAnimal.text.setText("")
    		game.add.tween(currentAnimal.imageText.scale).to({x:0,y:0},1000,Phaser.Easing.Linear.none,true)
    	}
    	var tempArray = []

    	for(var i =0; i < 3; i++){
    		if(currentAnimalId != i){
	    		tempArray.push(i)
	    	}
    	}

    	var index = game.rnd.integerInRange(0,tempArray.length-1)
    	currentAnimalId = tempArray[index]
    	currentAnimal = animalSpines[tempArray[index]]
    	currentAnimal.spine.setAnimationByName(0, "TALK", true);
    	var textColor = ""

    	switch(currentColorValue){
    		case 0:
    		textColor = "#ffffff"
    		break
    		case 1:
    		textColor = "#d60000"
    		break
    		case 2:
    		textColor = "#00a9f8"
    		break
    		case 3:
    		textColor = "#00ee27"
    		break
    		case 4:
    		textColor = "#6f6570"
    		break
    		case 5:
    		textColor = "#c18bff"
    		break
    		case 6:
    		textColor = "#def337"
    		break
    		case 7:
    		textColor = "#FF6F00"
    		break
    	}

    	currentAnimal.text.setStyle({font: "30px VAGRounded", fontWeight: "bold", fill: textColor, align: "center"})
    	currentAnimal.text.setText(COLORS_ARRAY[currentColorValue])	
    	currentAnimal.text.stroke = '#000000';
        currentAnimal.text.strokeThickness = 5;

    	game.add.tween(currentAnimal.imageText.scale).to({x:1,y:1},1000,Phaser.Easing.Linear.none,true)

    	sound.play("pop")

    	switch(currentAnimalId){
    		case 0:
    		sound.play("dog")
    		break
    		case 1:
    		sound.play("hipo")
    		break
    		case 2:
    		sound.play("gorilla")
    		break
    	}



    }

    
    function createNewQuad(){

        if(!gameActive){
            return
        }

        var randomNumber = game.rnd.integerInRange(1,3)

        for(var r = 0 ; r< randomNumber; r++){

            var i = game.rnd.integerInRange(0,ARRAY_WIDTH-1)
            var j =-1

            for(var h = 0; h< ARRAY_HEIGHT; h++){
                if(arrayValues[i][h].value == ""){
                    j = h
                    break
                }
            }

            var quad = setQuad(i,j)
        }


    }

    function setQuad(i,j,initial){

        var x = INITIAL_POSITION.x + (DELTA_QUAD*i)

        var y
        if(initial){
        	y = INITIAL_POSITION.y - (DELTA_QUAD*j)
        }
        else{
        	y = Y_OUT_MAP - (DELTA_QUAD*j)
        }

        var color = game.rnd.integerInRange(0,MAX_COLORS-1)
        //var color = 2
        var quad = getQuad(x,y,color,1)
        quad.indexI = i
        quad.indexJ = j

        quad.nextY = INITIAL_POSITION.y -(DELTA_QUAD*j)

        arrayValues[i][j].value = color
        arrayValues[i][j].object = quad

        if(initial){
        	quad.scale.setTo(0)
        	game.add.tween(quad.scale).to({x:1,y:1},500,Phaser.Easing.Linear.none,true)
        }

        return quad
    }

    function startRound(){
        inEvaluation = false
        gameActive = true
    }


    function getQuad(x,y,color,type){

    	if(type==2 || type ==3){
    		sound.play("combo")
    	}

    	arrayColorsInScene[color]++

        
        var text = COLORS_ARRAY[color]
        var tint = TINT_ARRAY[color]

        for(var i =0; i < quadsGroup.length; i++){
            if(!quadsGroup.children[i].visible && quadsGroup.children[i].type == type){
                quadsGroup.children[i].x = x
                quadsGroup.children[i].y = y
                quadsGroup.children[i].tint = tint
                quadsGroup.children[i].colorValue = color
                quadsGroup.children[i].visible = true

                return quadsGroup.children[i]
            }
        }

        var sprite = quadsGroup.create(x,y,'atlas.colorJewel','jewel_'+type)
        sprite.anchor.setTo(0.5)
        sprite.tint = tint
        sprite.colorValue = color
        quadsGroup.add(sprite)
        sprite.type = type
        sprite.mask = mask
        return sprite

    }

    function createTouch(){
        touch = game.add.sprite(-100,-100,'atlas.colorJewel','star')
        touch.alpha = 0
        touch.anchor.setTo(0.5)
        touch.scale.setTo(0.2)
        game.physics.arcade.enable(touch);
    }

    function CreateSipne(key,y,x,offset){
    	var spineGroup = game.add.group()
        spineGroup.x = game.world.centerX -(x*150)
        spineGroup.y = y

        var spine = game.add.spine(0,25, key+"Spine");
        spine.scale.setTo(0.8,0.8)
        spine.setAnimationByName(0, "IDLE", true);
        spine.setSkinByName(key);

        spineGroup.add(spine)

        var textGroup = game.add.group()
        textGroup.y = offset
        var sprite = textGroup.create(0,-50,'atlas.colorJewel','animals_speech')
        sprite.scale.setTo(0.9,0.7)
        sprite.anchor.setTo(0.5)

        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        var text = new Phaser.Text(sceneGroup.game, 0, -60, "", fontStyle)
        text.stroke = '#000000';
        text.strokeThickness = 20;
        //text.setShadow(10, 10, "#000000", 2, true, false);
        text.anchor.setTo(0.5)
        textGroup.add(text)
        textGroup.scale.setTo(0)
        spineGroup.add(textGroup)

        spineGroup.spine = spine
        spineGroup.imageText = textGroup
        spineGroup.text = text

        sceneGroup.add(spineGroup)

        return spineGroup
    }

    
    function createScene(){
       

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        var background = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.colorJewel','background')
        background.anchor.setTo(0,0)
        backgroundGroup.add(background)

        var animalBox = sceneGroup.create(game.world.centerX,game.world.centerY-300,'atlas.colorJewel','animals_area')
        animalBox.anchor.setTo(0.5)
		animalSpines = []
        animalSpines.push(CreateSipne('dog',animalBox.y,0,0))
        animalSpines.push(CreateSipne('hipo',animalBox.y+20,1,-20))
        animalSpines.push(CreateSipne('gorilla',animalBox.y-15,-1,0))


        var board = sceneGroup.create(game.world.centerX, game.world.centerY+150,'atlas.colorJewel','jewel_area')
        board.anchor.setTo(0.5)
        board.scale.setTo(1.1,1.1)

        gameGroup = game.add.group()
        sceneGroup.add(gameGroup)

        quadsGroup = game.add.group()
        sceneGroup.add(quadsGroup)


        backgroundSound = game.add.audio('colorJewelSong')
        game.sound.setDecodedCallback(backgroundSound, function(){
            backgroundSound.loopFull(0.6)
        }, this);
        
        game.onPause.add(function(){
            //console.log("Game paused")
            game.sound.mute = true
            gamePaused = true
        } , this);

        game.onResume.add(function(){
            //console.log("Game resume")
            game.sound.mute = false
            gamePaused = false
        }, this);


        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0

        
        initialize()

        createTouch()
        createPointsBar()
        createHearts()
        createTutorial()

        correctParticle = createPart('atlas.colorJewel','star')

        console.log("paticle correc ",correctParticle)

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)


    }
    
	return {
		assets: assets,
		name: "colorJewel",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()
