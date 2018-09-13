var soundsPath = "../../shared/minigames/sounds/"
var reinserta = function(){

    var LINE_TYPE = {
        NORMAL:0,
        CAR:1,
        SUBWAY:2,
        WATER:3,
    }

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/reinserta/atlas.json",
                image: "images/reinserta/atlas.png",
            },
        ],
        images: [
            {   name: "subwayTack",
                file: "images/reinserta/track.png"},
            {   name: "water",
                file: "images/reinserta/water.png"},

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
            {   name: "falling",
                file: soundsPath + "falling.mp3"},  
        ],
    }
    
    var INITIAL_LIVES = 1

    var ANGLE_LINE = 15
    var LINE_HEIGTH = 80
    var LINE_HEIGTH_ANGLE,LINE_WIDTH_ANGLE
    var X_MOVE, Y_MOVE
    var SPEED = 3
    var SPEED_LERP = 0.05
    var SPEED_LERP_HORIZONTAL = 0.15
    var DELTA_SWIPE = 50

    var TOTAL_MONSTERS = 5
    var MIN_TIME_CAR = 2000
    var MAX_TIME_CAR = 7000

    var MIN_TIME_WOOD = 2000
    var MAX_TIME_WOOD = 3000
    var SPEED_WOOD= 2, X_WOOD, Y_WOOD
    var SPEED_CAR = 4, X_CAR, Y_CAR
    var INIT_CAR_X = -100, INIT_CAR_Y
    var FINISH_CAR_X, FINISH_CAR_Y
    var CAR_DISTANCE = 80
    var TRAILER_DISTANCE = 100
    var WOOD_DISTANCE = 140
    var WOOD_DISTANCE_IN_IT = 100
    var COIN_PROBABILITY = 0.05

    var DISTANCE_MOVE_Y, DISTANCE_MOVE_X

    var SUBWAY_SPEED = 15, X_SUB, Y_SUB
    var MIN_TIME_SUBWAY = 5000
    var MAX_TIME_SUBWAY = 8000
    var SUBWAY_DISTANCE = 295

    var HORIZONTAL_MOVE = 50, HORIZONTAL_MOVE_X = HORIZONTAL_MOVE*Math.cos(ANGLE_LINE*(Math.PI/180)), HORIZONTAL_MOVE_Y = HORIZONTAL_MOVE*Math.sin(ANGLE_LINE*(Math.PI/180))

    var TREE_DISTANCE = 145
    var COIN_DISTANCE = 120
    var PROBABILITY_TREE = 0.06

    var MAX_NUM_LINES = 4
    var TRAFFIC_TIME_ANIMATION = 200
    var MIN_X, MAX_X
    var INIT_Y, INIT_X
    var FACTOR_X_Y
    var Y_LIMIT
    var Y_JUMP_DISTANCE = 40

    var NUM_JUMPS_CHANGE_MONSTER = 10

    var gameIndex = 31
    var gameId = 1000020 
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null


    var particlesGroup
    var particlesUsed
    var heartsGroup = null
    var spaceBar

    var treeArray, carArray, lineArray, whiteLineArray, subwayArray, subwayTrackArray, trafficLigthArray, waterArray, woodArray, plantArray, coinArray, monsterArray
    var lineBtm
    var currentY

    var monster
    var inJump, jumpDistance, jumpReverse
    var canTap 
    var lastLine, lastLineObject
    var currentDirection
    var currentLine

    var lineGroup, extraLineGroup
    var jumpLerp
    var lastX,lastY
    var lastLineType
    var deltaSwipe, lastSwipe

    var inMoveHorizontal
    var canCotinuesTouching
    var gameObjectsGroup
    var woodObject
    var waterLines
    var dieInWater
    var lastYJump

    var lineHelperArrays
    var currentJumps, nextJumpId

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        LINE_HEIGTH_ANGLE = LINE_HEIGTH/Math.cos(ANGLE_LINE*(Math.PI/180))
        LINE_WIDTH_ANGLE = LINE_HEIGTH*Math.cos((180-105)*(Math.PI/180))
        DISTANCE_MOVE_Y = (LINE_HEIGTH_ANGLE)*0.925
        DISTANCE_MOVE_X = (LINE_WIDTH_ANGLE)*0.925
        FACTOR_X_Y = DISTANCE_MOVE_X/DISTANCE_MOVE_Y
        Y_MOVE = SPEED*Math.cos(ANGLE_LINE*(Math.PI/180))
        X_MOVE = SPEED*Math.sin(ANGLE_LINE*(Math.PI/180))
        Y_CAR = SPEED_CAR*Math.sin(ANGLE_LINE*(Math.PI/180))
        X_CAR = SPEED_CAR*Math.cos(ANGLE_LINE*(Math.PI/180))
        Y_WOOD = SPEED_WOOD*Math.sin(ANGLE_LINE*(Math.PI/180))
        X_WOOD = SPEED_WOOD*Math.cos(ANGLE_LINE*(Math.PI/180))
        Y_SUB = SUBWAY_SPEED*Math.sin(ANGLE_LINE*(Math.PI/180))
        X_SUB = SUBWAY_SPEED*Math.cos(ANGLE_LINE*(Math.PI/180))

        MIN_X = X_MOVE*2
        MAX_X = game.world.width - (X_MOVE*2)

        var r = INIT_CAR_X/Math.cos(ANGLE_LINE*(Math.PI/180))
        INIT_CAR_Y = r*Math.sin(ANGLE_LINE*(Math.PI/180))
        FINISH_CAR_X = game.world.width+100
        r = FINISH_CAR_X/Math.cos(ANGLE_LINE*(Math.PI/180))
        FINISH_CAR_Y = r*Math.sin(ANGLE_LINE*(Math.PI/180))

        Y_LIMIT = game.world.height-20

        jumpLerp = 0

        inJump = false
        jumpDistance = 0
        currentDirection = 1
        currentLine = 0
        lastLineObject = null
        lastLineType = LINE_TYPE.NORMAL

        lastX = 0
        lastY = 0
        lastSwipe = {x:-1,y:-1}
        deltaSwipe = {x:-1,y:-1}
 		canCotinuesTouching = true
 		canTap = true
        inMoveHorizontal = 0
        jumpReverse = false

        woodObject = null
        waterLines = []
        dieInWater = false
        lineHelperArrays = []
        lastYJump = 0
        currentJumps = 0
        nextJumpId = NUM_JUMPS_CHANGE_MONSTER
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
            marioSong = sound.setSong(soundsPath + 'songs/timberman.mp3',0.3)
        }else{
            game.load.audio('arcadeSong', soundsPath + 'songs/timberman.mp3');
        }

    }

    
    function stopGame(win){

        heartsGroup.text.setText('X ' + 0)
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
        pointsText.x = pointsImg.x + pointsImg.width * 0.6
        pointsText.y = pointsImg.height * 0.3
        pointsText.anchor.setTo(0.5,0)
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
        heartsGroup.text.setText('X ' + lives)

        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        stopTouch = true
        
        if(lives === 0){
            stopGame()
        }
    
    }

    function update(){

    	if(!gameActive){
    		return
    	}
    	//console.log(monster.lineId)
        if(inJump){
            if(jumpLerp < 1){

                var x,y

                jumpLerp+=SPEED_LERP

                if(jumpLerp>1){
                	jumpLerp =1
                }

                x = lerp(0,DISTANCE_MOVE_X,jumpLerp)
                y = lerp(0,DISTANCE_MOVE_Y,jumpLerp)

                var tempX = x
                var tempY = y
                
	                x = x - lastX
	                y = y - lastY


	            if(jumpReverse){
	            	x = -x;
	            	y = -y;

	            	monster.x += x
                	monster.y -= y
	            }
	            

                lastX = tempX
                lastY = tempY

                
                if(jumpLerp<=0.5){
                	var extraY = lerp(0,Y_JUMP_DISTANCE,jumpLerp*2)
                	
                }
                else{
                	var extraY = lerp(Y_JUMP_DISTANCE,0,(jumpLerp-0.5)*2)
                	
                }

                var temp = extraY
                extraY = extraY- lastYJump
                lastYJump = temp
                monster.y-=extraY

                if(monster.y > INIT_Y && !jumpReverse){
                	monster.x += x
                	monster.y -= y

                	/*if(monster.y<INIT_Y){
                		//x = monster.x - INIT_X

                		y = monster.y - INIT_Y
                		x = y*FACTOR_X_Y
                	}
                	else{*/
                		x=0
                		y=0
                	//}
                }
                if(!jumpReverse){
                	updateObjectsMove(x,y) 
                }

            }
            else{
                inJump = false
                jumpLerp = 0

                if(dieInWater){
                	game.add.tween(monster.scale).to({x:0,y:0},500,Phaser.Easing.linear,true)
                	game.add.tween(monster).to({alpha:0},500,Phaser.Easing.linear,true)
	        		missPoint()
	        	} 
	        	else{
	        		
	        		if(monster.monsterHelper != null){
	        			monster.monsterHelper.visible = null
	        			monster.id = monster.nextId
	        			monster.loadTexture("atlas.game","monster_"+monster.id+"_back")
	        		}

	        		/*if(nextJumpId == currentJumps){
	        			nextJumpId+=NUM_JUMPS_CHANGE_MONSTER
	        			
	        			monster.id = rnd
	        			monster.loadTexture("atlas.game","monster_"+rnd+"_back")
	        		}*/
	        	}

            }
        }
        else{

        	if(lastLineObject!=null){
	        	if(lastLineObject.y > -game.world.height){
	            	createLine()
	            }
	        }

	        var x = DISTANCE_MOVE_X*0.002
	        var y = DISTANCE_MOVE_Y*0.002

	        updateObjectsMove(x,y)

	        monster.x-=x
	        monster.y+=y

        }

        if(monster.y > Y_LIMIT){
        	missPoint()
        }



        if(inMoveHorizontal!=0){
        	if(jumpLerp<1){
        		jumpLerp+=SPEED_LERP_HORIZONTAL
        		if(jumpLerp>1){
        			jumpLerp = 1
        		}
	        	var x = lerp(0,HORIZONTAL_MOVE_X,jumpLerp)
	            var y = lerp(0,HORIZONTAL_MOVE_Y,jumpLerp)

	            var tempX = x
	            var tempY = y
	            x = x - lastX
	            y = y - lastY

	            lastX = tempX
	            lastY = tempY

	            x*=inMoveHorizontal
	            y*=inMoveHorizontal

	            monster.x+=x
	            monster.y+=y

	            if(jumpLerp<=0.5){
                	var extraY = lerp(0,Y_JUMP_DISTANCE,jumpLerp*2)
                	
                }
                else{
                	var extraY = lerp(Y_JUMP_DISTANCE,0,(jumpLerp-0.5)*2)
                	
                }

                var temp = extraY
                extraY = extraY- lastYJump
                lastYJump = temp
                monster.y-=extraY

	        }
	        else{
	        	inMoveHorizontal = 0
	        	jumpLerp = 0
	        	if(dieInWater){
	        		game.add.tween(monster.scale).to({x:0,y:0},500,Phaser.Easing.linear,true)
                	game.add.tween(monster).to({alpha:0},500,Phaser.Easing.linear,true)
	        		missPoint()
	        	}


	        }


        }


        if(woodObject!=null){
        	//if(woodObject.direction==1){
        		monster.x+=(X_WOOD*woodObject.direction)
        		monster.y+=(Y_WOOD*woodObject.direction)
        	//}

        	if(monster.x < MIN_X){
        		missPoint()
        	}
        	else if(monster.x> MAX_X){
        		missPoint()
        	}

        }

        //updateCarLines
        for(var i=0; i < lineArray.length; i++){
            if(lineArray[i].visible){
                var line = lineArray[i]
                if(line.lineType == LINE_TYPE.CAR){
                    for(var j=0; j < line.carLines.length; j++){
                        if(game.time.now > line.carLines[j].time){
                            
                            var car = getCar(line.x,line.y+line.carLines[j].y,line.carLines[j].direction,line.carLines[j].lineId)
                            
                            line.groups[MAX_NUM_LINES-1-j].add(car)
                            //line.groups[MAX_NUM_LINES-1-j].sendToBack(car)
                            line.carLines[j].time = game.time.now+game.rnd.integerInRange(MIN_TIME_CAR,MAX_TIME_CAR)
                        }
                    }

                }

                if(line.lineType == LINE_TYPE.SUBWAY){
                	for(var j=0; j < line.subwayLines.length; j++){

                		if(game.time.now > line.subwayLines[j].time){
                			var subway = getSubway(line.x,line.y+line.subwayLines[j].y,line.subwayLines[j].direction,line.subwayLines[j].lineId)
                			
                			line.groups[MAX_NUM_LINES-1-j].add(subway)
                			line.groups[MAX_NUM_LINES-1-j].sendToBack(subway)
                			line.subwayLines[j].traffic.on = false
                			line.subwayLines[j].traffic.id = 1
                			line.subwayLines[j].traffic.loadTexture("atlas.game","traffic_"+1)
                            //line.groups[MAX_NUM_LINES-1-j].sendToBack(subway)
                            line.subwayLines[j].time = game.time.now+game.rnd.integerInRange(MIN_TIME_SUBWAY,MAX_TIME_SUBWAY)
                		}
                		else{
                			if(!line.subwayLines[j].traffic.on && game.time.now > line.subwayLines[j].time-1000){
                				line.subwayLines[j].traffic.on = true
                				line.subwayLines[j].traffic.timeAnimation = game.time.now + TRAFFIC_TIME_ANIMATION
                				line.subwayLines[j].traffic.id++
                				line.subwayLines[j].traffic.loadTexture("atlas.game","traffic_"+line.subwayLines[j].traffic.id)
                			}
                		}

                		if(line.subwayLines[j].traffic.on){
                			if(line.subwayLines[j].traffic.timeAnimation<game.time.now){
                				line.subwayLines[j].traffic.id++
                				if(line.subwayLines[j].traffic.id==4){
                					line.subwayLines[j].traffic.id = 2
                				}
                				line.subwayLines[j].traffic.timeAnimation = game.time.now + TRAFFIC_TIME_ANIMATION
                				line.subwayLines[j].traffic.loadTexture("atlas.game","traffic_"+line.subwayLines[j].traffic.id)
                			}
                		}


                	}
                }
            }
        }

        for(var i=0; i < waterArray.length; i++){
			if(waterArray[i].visible){
				var water = waterArray[i]
				for(var j=0; j < water.woodLines.length; j++){
                    if(game.time.now > water.woodLines[j].time){
                        
                        var wood = getWood(water.x,water.y+water.woodLines[j].y,water.woodLines[j].direction,water.woodLines[j].lineId)
                        water.groups[MAX_NUM_LINES-1-j].add(wood)
                		water.groups[MAX_NUM_LINES-1-j].sendToBack(wood)
                        water.woodLines[j].time = game.time.now+game.rnd.integerInRange(MIN_TIME_WOOD,MAX_TIME_WOOD)
                    }
                }
			}
        }

        for(var i=0; i < carArray.length; i++){
            if(carArray[i].visible){
                var car = carArray[i]
                
                car.x += (X_CAR*car.direction)
                car.y += (Y_CAR*car.direction)
                
                if(car.direction ==1){
                    if(car.x > FINISH_CAR_X){
                        car.visible = true
                    }
                }else{
                    if(car.x < INIT_CAR_X){
                        car.visible = true
                    }
                }

                
                if(monster.lineId == car.lineId){
                	var d = Math.sqrt(Math.pow(car.x-monster.x,2)+Math.pow(car.y-monster.y,2))
	                if(d < car.distance){
	                	//console.log("Car line",car.lineId)
	                	missPoint()
	                }
	            }
            }
        }

        for(var i=0; i < woodArray.length; i++){
            if(woodArray[i].visible){
                var wood = woodArray[i]
                
                wood.x += (X_WOOD*wood.direction)
                wood.y += (Y_WOOD*wood.direction)
                
                if(wood.direction ==1){
                    if(wood.x > FINISH_CAR_X){
                        wood.visible = true
                    }
                }else{
                    if(wood.x < INIT_CAR_X){
                        wood.visible = true
                    }
                }
            }
        }

        for(var i=0; i < subwayArray.length; i++){
            if(subwayArray[i].visible){
                var subway = subwayArray[i]
                
                subway.x += (X_SUB*subway.direction)
                subway.y += (Y_SUB*subway.direction)
                
                if(subway.direction ==1){
                    if(subway.x > game.world.width+500){
                        subway.visible = true
                    }
                }else{
                    if(subway.x < -400){
                        subway.visible = true
                    }
                }

                
                if(monster.lineId == subway.lineId){
                	var d = Math.sqrt(Math.pow(subway.x-monster.x,2)+Math.pow(subway.y-monster.y,2))
	                if(d < subway.distance){
	                	//console.log("subway line",subway.lineId)
	                	missPoint()
	                }
	            }
            }
        }


        updateTouch()
        
    }

    function updateObjectsMove(x,y){
    	for(var i =0; i < lineArray.length; i++){
            if(lineArray[i].visible){
                lineArray[i].x -= x
                lineArray[i].y += y
                if(lineArray[i].y > game.world.height+100){
                    lineArray[i].visible = false
                }
            }
        }

        for(var i =0; i < waterArray.length; i++){
            if(waterArray[i].visible){
                waterArray[i].x -= x
                waterArray[i].y += y
                if(waterArray[i].y > game.world.height+100){
                    waterArray[i].visible = false
                }
            }
        }

        for(var i =0; i < monsterArray.length; i++){
            if(monsterArray[i].visible){
                monsterArray[i].x -= x
                monsterArray[i].y += y
                if(monsterArray[i].y > game.world.height+100){
                    monsterArray[i].visible = false
                }
            }
        }

        for(var i =0; i < whiteLineArray.length; i++){
            if(whiteLineArray[i].visible){
                whiteLineArray[i].x -= x
                whiteLineArray[i].y += y
                if(whiteLineArray[i].y > game.world.height+100){
                    whiteLineArray[i].visible = false
                }
            }
        }

        for(var i =0; i < subwayTrackArray.length; i++){
            if(subwayTrackArray[i].visible){
                subwayTrackArray[i].x -= x
                subwayTrackArray[i].y += y
                if(subwayTrackArray[i].y > game.world.height+100){
                    subwayTrackArray[i].visible = false
                }
            }
        }

        for(var i =0; i < treeArray.length; i++){
            if(treeArray[i].visible){
                treeArray[i].x -= x
                treeArray[i].y += y
                if(treeArray[i].y > game.world.height+100){
                    treeArray[i].visible = false
                }
            }
        }

        for(var i =0; i < coinArray.length; i++){
            if(coinArray[i].visible){
                coinArray[i].x -= x
                coinArray[i].y += y
                if(coinArray[i].y > game.world.height+100){
                    coinArray[i].visible = false
                }
            }
        }

        for(var i =0; i < trafficLigthArray.length; i++){
            if(trafficLigthArray[i].visible){
                trafficLigthArray[i].x -= x
                trafficLigthArray[i].y += y
                if(trafficLigthArray[i].y > game.world.height+100){
                    trafficLigthArray[i].visible = false
                }
            }
        }

        for(var i=0; i < carArray.length; i++){
            if(carArray[i].visible){
                carArray[i].x -=x
                carArray[i].y +=y
                if(carArray[i].direction ==1){
                    if(carArray[i].x > FINISH_CAR_X){
                        carArray[i].visible = true
                    }
                }else{
                    if(carArray[i].x < INIT_CAR_X){
                        carArray[i].visible = true
                    }
                }
            }
        }

        for(var i=0; i < woodArray.length; i++){
            if(woodArray[i].visible){
                woodArray[i].x -=x
                woodArray[i].y +=y
                if(woodArray[i].direction ==1){
                    if(woodArray[i].x > FINISH_CAR_X){
                        woodArray[i].visible = true
                    }
                }else{
                    if(woodArray[i].x < INIT_CAR_X){
                        woodArray[i].visible = true
                    }
                }
            }
        }

        for(var i=0; i < subwayArray.length; i++){
            if(subwayArray[i].visible){
                subwayArray[i].x -=x
                subwayArray[i].y +=y
                if(subwayArray[i].direction ==1){
                    if(subwayArray[i].x > game.world.width+500){
                        subwayArray[i].visible = true

                    }
                }else{
                    if(subwayArray[i].x < -400){
                        subwayArray[i].visible = true
                    }
                }
            }
        }
    }

    function updateTouch(){

    	if(inJump){
    		return
    	}

        if(game.input.activePointer.isDown){
        	if(!canCotinuesTouching){
        		return
        	}

            if(canTap){
                canTap = false
            }


            if(lastSwipe.x == -1){
            	lastSwipe.x = game.input.activePointer.x
            	lastSwipe.y = game.input.activePointer.y
            	deltaSwipe.x = 0
            	deltaSwipe.y = 0
            }
            else{
            	deltaSwipe.x = game.input.activePointer.x - lastSwipe.x
            	deltaSwipe.y = game.input.activePointer.y - lastSwipe.y


            	if(Math.abs(deltaSwipe.x) > DELTA_SWIPE){
            		if(deltaSwipe.x > 0){

            			inMoveHorizontal = 1

            		}
            		else{
            			inMoveHorizontal = -1
            		}
            		if((inMoveHorizontal == 1 && monster.x < MAX_X) || (inMoveHorizontal == -1 && monster.x > MIN_X)){
            			moveHorizontal()
            		}
            		else{
            			inMoveHorizontal = 0
            		}
            	}

            	else if(deltaSwipe.y > DELTA_SWIPE){
            		moveDown()
            	}
            }
        }
        else{
        	if(!canTap){
        		tap()
        	}
            canTap = true
            lastSwipe.x = -1
            lastSwipe.y = -1
            canCotinuesTouching = true
        }
    }

    function moveHorizontal(){
    	canCotinuesTouching = false
		canTap = true
		jumpLerp = 0
		lastX = 0
		lastY = 0
		lastYJump = 0
		if(woodObject==null){
			for(var i=0; i < treeArray.length; i++){
				if(treeArray[i].visible){
					var tree = treeArray[i]
					if(tree.lineId == monster.lineId){
						var d = Math.sqrt(Math.pow(tree.x-monster.x,2)+Math.pow(tree.y-monster.y,2))
		                if(d < tree.distance*0.8){
		                	if(inMoveHorizontal<0 && tree.x - monster.x < 0){
		                		inMoveHorizontal = 0
		                	}
		                	else if(inMoveHorizontal>0 && tree.x - monster.x > 0){
		                		inMoveHorizontal = 0
		                	}
		                }

					}
				}
			}
		}
		else{
			var tempX = monster.x + (HORIZONTAL_MOVE_X*inMoveHorizontal)
			var tempY = monster.y + (HORIZONTAL_MOVE_Y*inMoveHorizontal)
			var d = Math.sqrt(Math.pow(woodObject.x-tempX,2)+Math.pow(woodObject.y-tempY,2))
			if(d > WOOD_DISTANCE_IN_IT){
				dieInWater = true
			}
		}

		for(var i=0; i < coinArray.length; i++){
			if(coinArray[i].visible){
				var coin = coinArray[i]
				if(coin.lineId == monster.lineId){
					var d = Math.sqrt(Math.pow(coin.x-monster.x,2)+Math.pow(coin.y-monster.y,2))
	                if(d < coin.distance*0.8){
	                	coin.visible = false
	                	addPoint(1,{x:game.world.width-80,y:80})
	                }

				}
			}
		}

    }

    function moveDown(){
    	canCotinuesTouching = false
		canTap = true
		jumpLerp = 0
		
		if(!inJump){
			
			/*if(monster.lineId <=0){
				return
			}*/

	    	monster.lineId--
	    	var obstacleInFront = false

	    	for(var i=0; i < treeArray.length; i++){
    			if(treeArray[i].visible){
    				var tree = treeArray[i]
    				if(tree.lineId == monster.lineId){
    					var d = Math.sqrt(Math.pow(tree.x-monster.x,2)+Math.pow(tree.y-monster.y,2))
		                if(d < tree.distance){
		                	obstacleInFront = true
		                }
		                
		               
    				}
    			}
    		}

    		for(var i=0; i < coinArray.length; i++){
    			if(coinArray[i].visible){
    				var coin = coinArray[i]
    				if(coin.lineId == monster.lineId){
    					var d = Math.sqrt(Math.pow(coin.x-monster.x,2)+Math.pow(coin.y-monster.y,2))
		                if(d < coin.distance){
		                	coin.visible = true
		                	addPoint(1,{x:game.world.width-80,y:80})
		                }
		                
		               
    				}
    			}
    		}

    		var inWater
    		woodObject = null

    		for(var i=0; i < waterLines.length; i++){
    			if(monster.lineId == waterLines[i]){
    				inWater = true
    				//waterLines.splice(i,1)
    			}
    		}
    		if(inWater){
	    		for(var i=0; i < woodArray.length; i++){
	    			if(woodArray[i].visible){
	    				var wood = woodArray[i]
	    				if(wood.lineId == monster.lineId){
	    					var d = Math.sqrt(Math.pow(wood.x-monster.x,2)+Math.pow(wood.y-monster.y,2))
		                	if(d < wood.distance){
		                		woodObject = wood
		                	}
	    				}
	    			}
	    		}
	    		if(woodObject==null){
	    			dieInWater = true
	    		}
	    	}

    		if(!obstacleInFront){
	        	monster.loadTexture("atlas.game","monster_"+monster.id+"_front")	
	        	jumpReverse = true
		        inJump = true
		        lastX = 0
		        lastY = 0
		        lastYJump = 0
		        jumpLerp = 0
		        currentJumps--
		    }
		    else{
		    	monster.lineId++
		    }
	    }
    }

    function tap(){

    	if(!inJump){
	    	monster.lineId++
	    	var obstacleInFront = false

	    	for(var i=0; i < treeArray.length; i++){
    			if(treeArray[i].visible){
    				var tree = treeArray[i]
    				if(tree.lineId == monster.lineId){
    					var d = Math.sqrt(Math.pow(tree.x-monster.x,2)+Math.pow(tree.y-monster.y,2))
		                if(d < tree.distance){
		                	obstacleInFront = true
		                }
    				}
    			}
    		}

    		for(var i=0; i < coinArray.length; i++){
    			if(coinArray[i].visible){
    				var coin = coinArray[i]
    				if(coin.lineId == monster.lineId){
    					var d = Math.sqrt(Math.pow(coin.x-monster.x,2)+Math.pow(coin.y-monster.y,2))
		                if(d < coin.distance){
		                	coin.visible = false
		                	addPoint(1,{x:game.world.width-80,y:80})
		                }
    				}
    			}
    		}



    		var inWater
    		var findObject = false

    		for(var i=0; i < waterLines.length; i++){
    			if(monster.lineId == waterLines[i]){
    				inWater = true
    				//waterLines.splice(i,1)
    			}
    		}

    		if(inWater){
	    		for(var i=0; i < woodArray.length; i++){
	    			if(woodArray[i].visible){
	    				var wood = woodArray[i]
	    				if(wood.lineId == monster.lineId){
	    					var d = Math.sqrt(Math.pow(wood.x-monster.x,2)+Math.pow(wood.y-monster.y,2))
		                	if(d < wood.distance){
		                		woodObject = wood
		                		findObject = true
		                	}
	    				}
	    			}
	    		}
	    		if(!findObject){
	    			dieInWater = true
	    		}
	    	}

    		

    		if(!obstacleInFront){

    			for(var i =0; i < monsterArray.length; i++){
	    			if(monsterArray[i].visible){
	    				var monsterHelper = monsterArray[i]
	    				if(monsterHelper.lineId == monster.lineId){
	    					monster.nextId = monsterHelper.id
	    					monster.monsterHelper = monsterHelper
	    					//monsterHelper.visible = false
	    					//monster.loadTexture("atlas.game","monster_"++"_front")
	    				}
	    			}
	    		}

	        	monster.loadTexture("atlas.game","monster_"+monster.id+"_back")	
		        inJump = true
		        lastX = 0
		        lastYJump = 0
		        lastY = 0
		        jumpLerp = 0
		        jumpReverse = false
		        currentJumps++
		        if(!inWater){
		        	woodObject = null 
		        }
		       
		    }
		    else{
		    	monster.lineId--
		    }
	    }
    }

    function createLine(){
        var rnd = game.rnd.integerInRange(0,3)
        if(lastLine == rnd){
            rnd++
            if(rnd > 1){
                rnd = 0
            }
        }
        lastLine = rnd
        var numLines = game.rnd.integerInRange(1,4)
        currentLine+=numLines
        var deltaX = 0
        if(lastLineObject!=null){
        	currentY = lastLineObject.y
        	deltaX = lastLineObject.x
        	var r = deltaX/Math.cos(ANGLE_LINE*(Math.PI/180))
	        var y = r*Math.sin(ANGLE_LINE*(Math.PI/180))
	        //console.log("Diference y ",y)
	        currentY-=y

        }
        else{
        	rnd = game.rnd.integerInRange(0,2)
        }
        //console.log(currentY)
        currentY-=numLines*(LINE_HEIGTH_ANGLE-1)

        //console.log(currentY,(LINE_HEIGTH_ANGLE-1))
        switch(rnd){
            case 0: //normalLine
            var diferentRoad = 0
            if(lastLineType == LINE_TYPE.CAR || lastLineType == LINE_TYPE.SUBWAY){
            	diferentRoad= 1
            }
            else if(lastLineType == LINE_TYPE.WATER){
            	diferentRoad = 2
            }
            lastLineObject = getNormalLine(numLines,diferentRoad)
            lastLineType = LINE_TYPE.NORMAL
            break
            case 1: //carLine
            lastLineObject = getCarLine(numLines)
            lastLineType = LINE_TYPE.CAR
            break
            case 2: //subway line
            lastLineObject = getSubwayLine(numLines)
            lastLineType = LINE_TYPE.SUBWAY
            break
            case 3: //water line
            lastLineObject = getWaterLine(numLines)
            lastLineType = LINE_TYPE.WATER
            break
        }
        lineHelperArrays.push(lastLineObject)
    }

    function getTree(x,y,lineId){
    	for(var i=0; i < treeArray.length; i++){
    		if(!treeArray[i].visible){
    			var tree = treeArray[i]
    			tree.visible = true
    			tree.x = x
    			tree.y = y
    			tree.lineId = lineId

    			var r = game.rnd.integerInRange(1,5)
    			if(r ==3){
		    		tree.loadTexture("atlas.game","rock")
		    	}
		    	else if(r ==2 || r==1){
		    		tree.loadTexture("atlas.game","tree_"+r)
		    	}
		    	else{
		    		tree.loadTexture("atlas.game","spectacular_"+(r-3))
		    	}

    			return tree
    		}
    	}

    	var r = game.rnd.integerInRange(1,5)

    	var tree
    	if(r ==3){
    		tree = gameObjectsGroup.create(x,y,"atlas.game","rock")
    	}
    	else if(r ==2 || r==1){
    		tree = gameObjectsGroup.create(x,y,"atlas.game","tree_"+r)
    	}
    	else{
    		tree = gameObjectsGroup.create(x,y,"atlas.game","spectacular_"+(r-3))
    	}

    	tree.anchor.setTo(0.45)
    	tree.distance = TREE_DISTANCE
    	treeArray.push(tree)
    	tree.lineId = lineId
    	return tree
    }

    function getNormalLine(numLines,diferentRoad){
         for(var i =0; i < lineArray.length; i++){
            if(!lineArray[i].visible){
                var line = lineArray[i]
                line.y = currentY
                line.x = 0
                line.clear()
                line.beginFill(0xb2d45d)
                line.drawRect(0,0,game.world.width*3,LINE_HEIGTH*numLines)
                line.endFill()
                line.visible = true
                line.lineType = LINE_TYPE.NORMAL
                if(diferentRoad!= 0){
                	if(line.helper==null){
                		var helper = game.add.graphics()
                		line.addChild(helper)
        				line.helper = helper
                	}

                	line.helper.visible = true
                	
		        	if(diferentRoad == 1){
		        		line.helper.y = (LINE_HEIGTH*numLines) - 10
		        		line.helper.clear()
		        		line.helper.beginFill(0x8db821)
		        		line.helper.drawRect(0,0,game.world.width*3,10)
		        		line.helper.endFill()
		        	}
		        	else{
		        		line.helper.clear()
		        		line.helper.beginFill(0x8db821)
		        		line.helper.drawRect(0,0,game.world.width*3,20)
		        		line.helper.endFill()
		        	}
		        }

		        var trees_array = []
		        var coin_array = []
		        var setMonster = false
		        for(var j =0; j < numLines; j++){
		        	var  x = HORIZONTAL_MOVE
		        	var spacesWithouTree = 3
		        	
		        	while(x<game.world.width*3){
		        		var r = game.rnd.frac()
		        		var aX = x*Math.cos(ANGLE_LINE*(Math.PI/180))
		        		/*if(x == HORIZONTAL_MOVE){

			        		var aY = x*Math.sin(ANGLE_LINE*(Math.PI/180))
			        		var tree = getTree(line.x+aX,line.y+aY+(j*(LINE_HEIGTH_ANGLE-1)),currentLine-j)
			        		trees_array.push(tree)
		        		}
		        		else if(aX >= game.world.width-HORIZONTAL_MOVE){
		        			var aY = x*Math.sin(ANGLE_LINE*(Math.PI/180))
			        		var tree = getTree(line.x+aX,line.y+aY+(j*(LINE_HEIGTH_ANGLE-1)),currentLine-j)
			        		trees_array.push(tree)
		        		}
        				else*/ 
        				if(r < PROBABILITY_TREE  && spacesWithouTree>=3){
        					spacesWithouTree=0
			        		var aY = x*Math.sin(ANGLE_LINE*(Math.PI/180))
			        		var tree = getTree(line.x+aX,line.y+aY+(j*(LINE_HEIGTH_ANGLE-1)),currentLine-j)
			        		trees_array.push(tree)
			        	}
			        	else if(currentLine-j >= nextJumpId && !setMonster){
			        		if(x >= HORIZONTAL_MOVE*20){
			        			setMonster = true
			        			var aY = x*Math.sin(ANGLE_LINE*(Math.PI/180))
			        			var monsterHelper = getMonster(line.x+aX,line.y+aY+(j*(LINE_HEIGTH_ANGLE-1)),currentLine-j)
			        			trees_array.push(monsterHelper)
			        			nextJumpId=currentLine-j+NUM_JUMPS_CHANGE_MONSTER
			        		}
			        	}
			        	else{
			        		spacesWithouTree ++
			        		r = game.rnd.frac()
			        		if(r < COIN_PROBABILITY){
				        		var aY = x*Math.sin(ANGLE_LINE*(Math.PI/180))
				        		var coin = getCoin(line.x+aX,line.y+aY+(j*(LINE_HEIGTH_ANGLE-1)),currentLine-j)
				        		trees_array.push(coin)
			        		}
			        	}
		        		x+=HORIZONTAL_MOVE
		        	}

		        }

		        for(var i =trees_array.length-1; i >=0; i--){
		        	gameObjectsGroup.sendToBack(trees_array[i])
		        }
                return line
            }
        }

        var line = game.add.graphics()
        line.y = currentY
        line.beginFill(0xb2d45d)
        line.drawRect(0,0,game.world.width*3,LINE_HEIGTH*numLines)
        line.endFill()
        line.angle = ANGLE_LINE
        lineGroup.add(line)
        line.lineType = LINE_TYPE.NORMAL
        lineArray.push(line)
        line.groups = []
        for(var  i=0; i < MAX_NUM_LINES; i++){
        	var g = game.add.group()
        	gameObjectsGroup.add(g)
        	gameObjectsGroup.sendToBack(g)
        	line.groups.push(g)
        }
        if(diferentRoad!= 0){
        	if(diferentRoad == 1){
        		var helper = game.add.graphics()
        		helper.y = (LINE_HEIGTH*numLines) - 10
        		helper.beginFill(0x8db821)
        		helper.drawRect(0,0,game.world.width*3,10)
        		helper.endFill()
        		line.addChild(helper)
        		line.helper = helper
        	}
        	else{
        		var helper = game.add.graphics()
        		helper.y = (LINE_HEIGTH*numLines) - 20
        		helper.beginFill(0x8db821)
        		helper.drawRect(0,0,game.world.width*3,20)
        		helper.endFill()
        		line.addChild(helper)
        		line.helper = helper
        	}
        }

        var trees_array = []
        var coin_array = []

        /*var deltaX = HORIZONTAL_MOVE
    	var deltaY = game.world.height - 300 - line.y
        deltaY = parseInt(deltaY/Y_MOVE)

        deltaX+=X_MOVE*deltaY

    	var r = deltaX/Math.cos(ANGLE_LINE*(Math.PI/180))
        deltaY = r*Math.sin(ANGLE_LINE*(Math.PI/180))*/
        var setMonster = false
        for(var j =0; j < numLines; j++){
        	var  x = HORIZONTAL_MOVE
        	spacesWithouTree = 3
        	
        	while( x<game.world.width*3){
        		var r = game.rnd.frac()
        		var aX = x*Math.cos(ANGLE_LINE*(Math.PI/180))
        		/*if(aX == deltaX){

	        		var aY = x*Math.sin(ANGLE_LINE*(Math.PI/180))
	        		var tree = getTree(line.x+aX,line.y+aY+(j*(LINE_HEIGTH_ANGLE-1)),currentLine-j)
	        		trees_array.push(tree)
        		}
        		else if(aX >= game.world.width+deltaX){
        			var aY = x*Math.sin(ANGLE_LINE*(Math.PI/180))
	        		var tree = getTree(line.x+aX,line.y+aY+(j*(LINE_HEIGTH_ANGLE-1)),currentLine-j)
	        		trees_array.push(tree)
        		}
				else*/ 

				if(r < PROBABILITY_TREE && spacesWithouTree>=3){
					spacesWithouTree=0
	        		var aY = x*Math.sin(ANGLE_LINE*(Math.PI/180))
	        		var tree = getTree(line.x+aX,line.y+aY+(j*(LINE_HEIGTH_ANGLE-1)),currentLine-j)
	        		trees_array.push(tree)
	        	}
	        	else if(currentLine-j >= nextJumpId && !setMonster){
	        		if(x >= HORIZONTAL_MOVE*7){
	        			setMonster = true
	        			var aY = x*Math.sin(ANGLE_LINE*(Math.PI/180))
	        			var monsterHelper = getMonster(line.x+aX,line.y+aY+(j*(LINE_HEIGTH_ANGLE-1)),currentLine-j)
	        			trees_array.push(monsterHelper)
	        			nextJumpId=currentLine-j+NUM_JUMPS_CHANGE_MONSTER
	        		}
	        	}
	        	else{
	        		spacesWithouTree ++
	        		r = game.rnd.frac()
	        		if(r < COIN_PROBABILITY){
		        		var aY = x*Math.sin(ANGLE_LINE*(Math.PI/180))
		        		var coin = getCoin(line.x+aX,line.y+aY+(j*(LINE_HEIGTH_ANGLE-1)),currentLine-j)
		        		trees_array.push(coin)
	        		}
	        	}
        		x+=HORIZONTAL_MOVE
        	}
        }

        for(var i =trees_array.length-1; i >=0; i--){
        	gameObjectsGroup.sendToBack(trees_array[i])
        }

        return line
    }

    function getCar(lineX,_y,direction,_lineId){
        var x, y

        var deltaX

        if(direction == 1){
        	deltaX = lineX -100
        }
        else{
        	deltaX = game.world.width+100-lineX
        }

        var r = deltaX/Math.cos(ANGLE_LINE*(Math.PI/180))
        x = deltaX
        y = r*Math.sin(ANGLE_LINE*(Math.PI/180))



        var rC = game.rnd.integerInRange(0,1)

        for(var i =0; i < carArray.length; i++){
            if(!carArray[i].visible){
                var car = carArray[i]
                car.x = lineX+x
                car.y = _y+y
                car.visible = true
                car.direction = direction
                car.lineId = _lineId
                if(rC == 0){
                    car.loadTexture("atlas.game","car_"+game.rnd.integerInRange(1,3))
                    car.distance = CAR_DISTANCE
                    car.anchor.setTo(0.5)
                }
                else{
                    if(direction==1){
                        car.loadTexture("atlas.game","trailer_"+game.rnd.integerInRange(1,4)+"_right")
                    }else{
                        car.loadTexture("atlas.game","trailer_"+game.rnd.integerInRange(1,4)+"_left")
                    }
                    car.distance = TRAILER_DISTANCE
                    car.anchor.setTo(0.7)
                }
                return car
            }
        }
       

        var car 
        if(rC == 0){
            car = gameObjectsGroup.create(lineX+x,_y+y,"atlas.game","car_"+game.rnd.integerInRange(1,3))
            car.distance = CAR_DISTANCE
            car.anchor.setTo(0.5)
        }
        else{
            if(direction==1){
                car = gameObjectsGroup.create(lineX+x,_y+y,"atlas.game","trailer_"+game.rnd.integerInRange(1,4)+"_right")
            }else{
                car = gameObjectsGroup.create(lineX+x,_y+y,"atlas.game","trailer_"+game.rnd.integerInRange(1,4)+"_left")
            }
            car.distance = TRAILER_DISTANCE
            car.anchor.setTo(0.7)
        }
        car.lineId = _lineId
        car.direction = direction
        
        //sceneGroup.add(car)
        carArray.push(car)
        return car
    }

    function getCarLine(numLines){
        for(var i =0; i < lineArray.length; i++){
            if(!lineArray[i].visible){
                var line = lineArray[i]
                line.y = currentY
                line.x = 0
                line.clear()
                line.beginFill(0x565b5e)
                line.drawRect(0,0,game.world.width*3,LINE_HEIGTH*numLines)
                line.endFill()
                line.visible = true
                line.lineType = LINE_TYPE.CAR
                line.carLines = []
                if(line.groups!=null){
                	for(var  i=0; i < MAX_NUM_LINES; i++){
                		gameObjectsGroup.sendToBack(line.groups[i])
                	}
                }
                if(line.helper!=null){
                	line.helper.visible = false
                }
                for(var j =0; j < numLines; j++){
                    line.carLines.push({y:(j*(LINE_HEIGTH_ANGLE-1))+LINE_HEIGTH/2,direction:currentDirection,time:game.time.now+game.rnd.integerInRange(MIN_TIME_CAR,MAX_TIME_CAR),lineId:currentLine-j})
                    if(currentDirection ==1){
                        currentDirection = -1
                    }
                    else{
                        currentDirection = 1
                    }
                }
                for(var j = 0; j < numLines-1; j++){
                    getWhiteLine(currentY+((LINE_HEIGTH_ANGLE-1)*(j+1)))
                }
                var coin_array = []
		        for(var j =0; j < numLines; j++){
		        	var  x = HORIZONTAL_MOVE
		        	while( x<game.world.width*3){
		        		var r = game.rnd.frac()
		        		
		        		r = game.rnd.frac()
		        		if(r < COIN_PROBABILITY){
		        			var aX = x*Math.cos(ANGLE_LINE*(Math.PI/180))
			        		var aY = x*Math.sin(ANGLE_LINE*(Math.PI/180))
			        		var coin = getCoin(line.x+aX,line.y+aY+(j*(LINE_HEIGTH_ANGLE-1)),currentLine-j)
			        		coin_array.push(coin)
		        		}
			        	
		        		x+=HORIZONTAL_MOVE
		        	}
		        }

        for(var i =coin_array.length-1; i >=0; i--){
        	gameObjectsGroup.sendToBack(coin_array[i])
        }
                return line
            }
        }

        var line = game.add.graphics()
        line.y = currentY
        line.beginFill(0x565b5e)
        line.drawRect(0,0,game.world.width*3,LINE_HEIGTH*numLines)
        line.endFill()
        line.angle = ANGLE_LINE
        lineGroup.add(line)
        lineArray.push(line)
        line.lineType = LINE_TYPE.CAR
        line.carLines = []
        line.groups = []
        for(var  i=0; i < MAX_NUM_LINES; i++){
        	var g = game.add.group()
        	gameObjectsGroup.add(g)
        	gameObjectsGroup.sendToBack(g)
        	line.groups.push(g)
        }

        for(var j =0; j < numLines; j++){
            line.carLines.push({y:(j*(LINE_HEIGTH_ANGLE-1))+LINE_HEIGTH/2,direction:currentDirection,time:game.time.now+game.rnd.integerInRange(MIN_TIME_CAR,MAX_TIME_CAR),lineId:currentLine-j})
            if(currentDirection ==1){
                currentDirection = -1
            }
            else{
                currentDirection = 1
            }
        }
        for(var j = 0; j < numLines-1; j++){
            getWhiteLine(currentY+((LINE_HEIGTH_ANGLE-1)*(j+1)))
        }

        var coin_array = []
        for(var j =0; j < numLines; j++){
        	var  x = HORIZONTAL_MOVE
        	while( x<game.world.width*3){
        		var r = game.rnd.frac()
        		
        		r = game.rnd.frac()
        		if(r < COIN_PROBABILITY){
        			var aX = x*Math.cos(ANGLE_LINE*(Math.PI/180))
	        		var aY = x*Math.sin(ANGLE_LINE*(Math.PI/180))
	        		var coin = getCoin(line.x+aX,line.y+aY+(j*(LINE_HEIGTH_ANGLE-1)),currentLine-j)
	        		coin_array.push(coin)
        		}
	        	
        		x+=HORIZONTAL_MOVE
        	}
        }

        for(var i =coin_array.length-1; i >=0; i--){
        	gameObjectsGroup.sendToBack(coin_array[i])
        }

        return line
    }

    function getWhiteLine(y){
        for(var i =0; i < whiteLineArray.length; i++){
            if(!whiteLineArray[i].visible){
                var line = whiteLineArray[i]
                line.x = 0
                line.y = y
                line.visible = true
                return line
            }
        }

        var line = extraLineGroup.create(0,y,lineBtm)
        line.anchor.setTo(0,0.5)
        line.angle = ANGLE_LINE
        whiteLineArray.push(line)
        return line
    }

    function getSubway(lineX,_y,direction,_lineId){
    	_y-=25
    	var x, y

        var deltaX

        if(direction == 1){
        	deltaX = lineX -400
        }
        else{
        	deltaX = game.world.width+500-lineX
        }

        var r = deltaX/Math.cos(ANGLE_LINE*(Math.PI/180))
        x = deltaX
        y = r*Math.sin(ANGLE_LINE*(Math.PI/180))


        for(var i =0; i < subwayArray.length; i++){
            if(!subwayArray[i].visible){
                var subway = subwayArray[i]
                subway.x = lineX+x
                subway.y = _y+y
                subway.visible = true
                subway.direction = direction
                subway.lineId = _lineId

                if(direction==1){
                    subway.loadTexture("atlas.game","subway_right")
                }else{
                    subway.loadTexture("atlas.game","subway_left")
                }
                subway.distance = SUBWAY_DISTANCE
                subway.anchor.setTo(0.7)
                
                return subway
            }
        }
       

        var subway 

        if(direction==1){
            subway = gameObjectsGroup.create(lineX+x,_y+y,"atlas.game","subway_right")
        }else{
            subway = gameObjectsGroup.create(lineX+x,_y+y,"atlas.game","subway_left")
        }
        subway.distance = SUBWAY_DISTANCE
        subway.anchor.setTo(0.5)
        
        subway.lineId = _lineId
        subway.direction = direction
        
        //sceneGroup.add(subway)
        subwayArray.push(subway)
        return subway
    }


    function getTrafficLigth(_y){

    	x = game.world.centerX
    	var deltaY = game.world.height - 300 - _y
        deltaY = parseInt(deltaY/Y_MOVE)

        x+=X_MOVE*deltaY

    	var r = x/Math.cos(ANGLE_LINE*(Math.PI/180))
        y = r*Math.sin(ANGLE_LINE*(Math.PI/180))

        
        //y+=Y_MOVE*deltaY

    	for(var i =0; i < trafficLigthArray.length; i++){
    		if(!trafficLigthArray[i].visible){
    			var traffic = trafficLigthArray[i]
    			traffic.visible = true
    			traffic.x = x
    			traffic.y = _y+y
    			traffic.on = false
    			traffic.timeAnimation = game.time.now + TRAFFIC_TIME_ANIMATION
    			traffic.loadTexture("atlas.game","traffic_1")
    			traffic.id = 1
    			return traffic
    		}
    	}

    	var traffic = sceneGroup.create(x,_y+y,"atlas.game","traffic_1")
    	traffic.anchor.setTo(0.5)
    	trafficLigthArray.push(traffic)
    	traffic.on = false
    	traffic.timeAnimation = game.time.now + TRAFFIC_TIME_ANIMATION
    	traffic.id = 1
    	return traffic

    }


    function getSubwayLine(numLines){
    	for(var i =0; i < lineArray.length; i++){
            if(!lineArray[i].visible){
                var line = lineArray[i]
                line.y = currentY
                line.x = 0
                line.clear()
                line.beginFill(0x565b5e)
                line.drawRect(0,0,game.world.width*3,LINE_HEIGTH*numLines)
                line.endFill()
                line.visible = true
                line.lineType = LINE_TYPE.SUBWAY
                line.subwayLines = []
                if(line.helper!=null){
                	line.helper.visible = false
                }
                if(line.groups!=null){
                	for(var  i=0; i < MAX_NUM_LINES; i++){
                		gameObjectsGroup.sendToBack(line.groups[i])
                	}
                }

                for(var j =0; j < numLines; j++){
                	var traffic = getTrafficLigth(line.y+(j*(LINE_HEIGTH_ANGLE-1))+LINE_HEIGTH/2)
            		line.groups[MAX_NUM_LINES-1-j].add(traffic)
		            line.subwayLines.push({y:(j*(LINE_HEIGTH_ANGLE-1))+LINE_HEIGTH/2,direction:currentDirection,time:game.time.now+game.rnd.integerInRange(MIN_TIME_SUBWAY,MAX_TIME_SUBWAY),lineId:currentLine-j,traffic:traffic})
		            if(currentDirection ==1){
		                currentDirection = -1
		            }
		            else{
		                currentDirection = 1
		            }
		        }
		        for(var j = 0; j < numLines; j++){
		            getSubwayTrack(currentY+((LINE_HEIGTH_ANGLE-1)*(j)))
		        }
		        var coin_array = []
		        for(var j =0; j < numLines; j++){
		        	var  x = HORIZONTAL_MOVE
		        	while( x<game.world.width*3){
		        		var r = game.rnd.frac()
		        		
		        		r = game.rnd.frac()
		        		if(r < COIN_PROBABILITY){
		        			var aX = x*Math.cos(ANGLE_LINE*(Math.PI/180))
			        		var aY = x*Math.sin(ANGLE_LINE*(Math.PI/180))
			        		var coin = getCoin(line.x+aX,line.y+aY+(j*(LINE_HEIGTH_ANGLE-1)),currentLine-j)
			        		coin_array.push(coin)
		        		}
			        	
		        		x+=HORIZONTAL_MOVE
		        	}
		        }

		        for(var i =coin_array.length-1; i >=0; i--){
		        	gameObjectsGroup.sendToBack(coin_array[i])
		        }
                return line
            }
        }

    	var line = game.add.graphics()
        line.y = currentY
        line.beginFill(0x565b5e)
        line.drawRect(0,0,game.world.width*3,LINE_HEIGTH*numLines)
        line.endFill()
        line.angle = ANGLE_LINE
        lineGroup.add(line)
        lineArray.push(line)
        line.lineType = LINE_TYPE.SUBWAY
        line.subwayLines = []
        line.groups = []

        for(var  i=0; i < MAX_NUM_LINES; i++){
        	var g = game.add.group()
        	gameObjectsGroup.add(g)
        	gameObjectsGroup.sendToBack(g)
        	line.groups.push(g)
        }

        for(var j =0; j < numLines; j++){
        	var traffic = getTrafficLigth(line.y+(j*(LINE_HEIGTH_ANGLE-1))+LINE_HEIGTH/2)
            line.groups[MAX_NUM_LINES-1-j].add(traffic)
            
            line.subwayLines.push({y:(j*(LINE_HEIGTH_ANGLE-1))+LINE_HEIGTH/2,direction:currentDirection,time:game.time.now+game.rnd.integerInRange(MIN_TIME_SUBWAY,MAX_TIME_SUBWAY),lineId:currentLine-j,traffic:traffic})
            
            if(currentDirection ==1){
                currentDirection = -1
            }
            else{
                currentDirection = 1
            }
        }

        for(var j = 0; j < numLines; j++){
            getSubwayTrack(currentY+((LINE_HEIGTH_ANGLE-1)*(j)))
        }

        var coin_array = []
        for(var j =0; j < numLines; j++){
        	var  x = HORIZONTAL_MOVE
        	while( x<game.world.width*3){
        		var r = game.rnd.frac()
        		
        		r = game.rnd.frac()
        		if(r < COIN_PROBABILITY){
        			var aX = x*Math.cos(ANGLE_LINE*(Math.PI/180))
	        		var aY = x*Math.sin(ANGLE_LINE*(Math.PI/180))
	        		var coin = getCoin(line.x+aX,line.y+aY+(j*(LINE_HEIGTH_ANGLE-1)),currentLine-j)
	        		coin_array.push(coin)
        		}
	        	
        		x+=HORIZONTAL_MOVE
        	}
        }

        for(var i =coin_array.length-1; i >=0; i--){
        	gameObjectsGroup.sendToBack(coin_array[i])
        }

        return line

    }

    function getSubwayTrack(y){
    	for(var i=0; i < subwayTrackArray.length;i++){
    		if(!subwayTrackArray[i].visible){
    			var subwayTrack = subwayTrackArray[i]
    			subwayTrack.visible = true
    			subwayTrack.x =0
    			subwayTrack.y = y
    			return subwayTrack
    		}
    	}

    	var subwayTrack = game.add.tileSprite(0,y,game.world.width*3,64,"subwayTack")
    	subwayTrack.angle = ANGLE_LINE
    	extraLineGroup.add(subwayTrack)
    	subwayTrackArray.push(subwayTrack)
    	return subwayTrack
    }

    function getWaterLine(numLines){

    	/*x = 300
    	var deltaY = game.world.height - 400 - currentY
        deltaY = parseInt(deltaY/Y_MOVE)

        x+=X_MOVE*deltaY

    	var r = x/Math.cos(ANGLE_LINE*(Math.PI/180))
        y = r*Math.sin(ANGLE_LINE*(Math.PI/180))*/

        var r = 300

    	for(var i =0; i < waterArray.length; i++){
    		if(!waterArray[i].visible){
    			var water = waterArray[i]
    			water.visible = true
    			water.y = currentY
    			water.x = 0
    			water.clear()
    			water.beginFill(0x5ac0e0)
		        water.drawRect(0,0,r,LINE_HEIGTH*numLines)
		        water.endFill()
		        var r2 = game.world.width*3 - r
		        water.beginFill(0x89e2e8)
		        water.drawRect(0,r,r2,LINE_HEIGTH*numLines)
		        water.endFill()
		        water.mark.x = r-60
		        water.woodLines = []
            	for(var  i=0; i < MAX_NUM_LINES; i++){
            		gameObjectsGroup.sendToBack(water.groups[i])
            	}
                
		        for(var j =0; j < numLines; j++){
		            water.woodLines.push({y:(j*(LINE_HEIGTH_ANGLE-1))+LINE_HEIGTH/2,direction:currentDirection,time:game.time.now+game.rnd.integerInRange(MIN_TIME_WOOD,MAX_TIME_WOOD),lineId:currentLine-j})
		            if(currentDirection ==1){
		                currentDirection = -1
		            }
		            else{
		                currentDirection = 1
		            }
		        }
    			return water
    		}
    	}

    	var water = game.add.graphics()
    	water.y = currentY
        water.beginFill(0x5ac0e0)
        water.drawRect(0,0,r,LINE_HEIGTH*numLines)
        water.endFill()
        var r2 = game.world.width*3 - r
        water.beginFill(0x89e2e8)
        water.drawRect(r,0,r2,LINE_HEIGTH*numLines)
        water.endFill()
        water.angle = ANGLE_LINE
        lineGroup.add(water)
        waterArray.push(water)
        water.mark = game.add.tileSprite(r-60,0,128,LINE_HEIGTH*numLines,"water")
        water.addChild(water.mark)
        water.lineType = LINE_TYPE.WATER
        water.woodLines = []
        water.groups = []
        for(var  i=0; i < MAX_NUM_LINES; i++){
        	var g = game.add.group()
        	gameObjectsGroup.add(g)
        	gameObjectsGroup.sendToBack(g)
        	water.groups.push(g)
        }
        for(var j =0; j < numLines; j++){
        	waterLines.push(currentLine-j)
            water.woodLines.push({y:(j*(LINE_HEIGTH_ANGLE-1))+LINE_HEIGTH/2,direction:currentDirection,time:game.time.now+game.rnd.integerInRange(MIN_TIME_WOOD,MAX_TIME_WOOD),lineId:currentLine-j})
            if(currentDirection ==1){
                currentDirection = -1
            }
            else{
                currentDirection = 1
            }
        }

        return water

    }

    function getWood(lineX,_y,direction,_lineId){
    	var x, y

        var deltaX

        if(direction == 1){
        	deltaX = lineX -100
        }
        else{
        	deltaX = game.world.width+100-lineX
        }

        var r = deltaX/Math.cos(ANGLE_LINE*(Math.PI/180))
        x = deltaX
        y = r*Math.sin(ANGLE_LINE*(Math.PI/180))


        for(var i =0; i < woodArray.length; i++){
            if(!woodArray[i].visible){
                var wood = woodArray[i]
                wood.x = lineX+x
                wood.y = _y+y
                wood.visible = true
                wood.direction = direction
                wood.lineId = _lineId

               
                return wood
            }
        }

        var wood = gameObjectsGroup.create(lineX+x,_y+y,"atlas.game","trunk")
        wood.distance = WOOD_DISTANCE
        wood.anchor.setTo(0.5)
        
        wood.lineId = _lineId
        wood.direction = direction

        woodArray.push(wood)
        return wood
    }

    function getCoin(x,y,lineId){
    	y+=20
    	for(var i=0; i < coinArray.length; i++){
    		if(!coinArray[i].visible){
    			var coin = coinArray[i]
    			coin.visible = true
    			coin.x = x
    			coin.y = y
    			coin.lineId = lineId
    			return coin
    		}
    	}


    	var coin = gameObjectsGroup.create(x,y,"atlas.game","coin_xp")
    	coin.anchor.setTo(0.5)
    	coin.distance = COIN_DISTANCE
    	coinArray.push(coin)
    	coin.lineId = lineId
    	return coin
    }

    function getMonster(x,y,lineId){
    	y+=20
    	for(var i=0; i < monsterArray.length; i++){
    		if(!monsterArray[i].visible){
    			var monsterExtra = monsterArray[i]
    			monsterExtra.visible = true
    			monsterExtra.x = x
    			monsterExtra.y = y
    			monsterExtra.lineId = lineId
    			var rnd = game.rnd.integerInRange(1,5)

				if(rnd == monster.id){
					rnd++
					if(rnd>5){
						rnd = 1
					}
				}
				console.log(rnd,monster.id)
				monsterExtra.id = rnd
				monsterExtra.loadTexture("atlas.game","monster_"+rnd+"_front")
    			return monsterExtra
    		}
    	}

    	var rnd = game.rnd.integerInRange(1,5)
    	
		if(rnd == monster.id){
			rnd++
			if(rnd>5){
				rnd = 1
			}
		}
		console.log(rnd,monster.id)
    	var monsterExtra = gameObjectsGroup.create(x,y,"atlas.game","monster_"+rnd+"_front")
    	monsterExtra.anchor.setTo(0.5)
    	monsterArray.push(monsterExtra)
    	monsterExtra.lineId = lineId
    	monsterExtra.id = rnd
    	return monsterExtra
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

    function createBackground(){

        /*var bmd = game.add.bitmapData(game.world.width, game.world.height)

        var y = 0;

        for (var i = 0; i < game.world.height/2; i++)
        {
            var c = Phaser.Color.interpolateColor(0xe3834e, 0xfbd385, game.world.height, i);

            bmd.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c));
            y += 2;
        }

        var background = game.add.sprite(0, 0, bmd);
        sceneGroup.add(background)*/

        var deltaLine = game.world.width*1.5
        lineBtm = game.add.bitmapData(deltaLine,10);
        lineBtm.ctx.beginPath();
        lineBtm.ctx.lineWidth = "11";
        lineBtm.ctx.strokeStyle = 'white';    
        lineBtm.ctx.setLineDash([deltaLine/12,deltaLine/16,deltaLine/12,deltaLine/16,deltaLine/12,deltaLine/16,deltaLine/12,deltaLine/16]);        
        lineBtm.ctx.moveTo(0, 0);    
        lineBtm.ctx.lineTo(deltaLine , 0);
        lineBtm.ctx.stroke();
        lineBtm.ctx.closePath();



        treeArray = []
        carArray = []
        lineArray = []
        whiteLineArray = []
        subwayArray = []
        subwayTrackArray = []
        trafficLigthArray = []
        waterArray = []
        woodArray = []
        plantArray = []
        coinArray = []
        monsterArray = []

        lineGroup = game.add.group()
        sceneGroup.add(lineGroup)

        extraLineGroup = game.add.group()
        sceneGroup.add(extraLineGroup)

        gameObjectsGroup = game.add.group()
        sceneGroup.add(gameObjectsGroup)

        var monsterId = game.rnd.integerInRange(1,TOTAL_MONSTERS)
        monster = sceneGroup.create(0,0,"atlas.game","monster_"+monsterId+"_front")
        monster.anchor.setTo(0.5,1)
        monster.id = monsterId
        monster.lineId = 0

        getInitialLines()

        currentY+=LINE_HEIGTH_ANGLE
        var cy = currentY

        lastLine =-1

        while(currentY>-500){
            createLine()
        }

        
        var r = game.world.centerX/Math.cos(ANGLE_LINE*(Math.PI/180))
        INIT_Y = cy+50+((r+10)*Math.sin(ANGLE_LINE*(Math.PI/180)))
        INIT_X = game.world.centerX
        monster.x = INIT_X
        monster.y = INIT_Y

    }

    function getInitialLines(){
        currentY = game.world.height - (LINE_HEIGTH_ANGLE-1)
        for(var i =0; i < 5; i++){
            var line = game.add.graphics()
            line.y = currentY
            if(i%2 == 0){
                line.beginFill(0x8bd821)
            }
            else{
                line.beginFill(0xb2d45d)
            }
            line.drawRect(0,0,game.world.width*3,LINE_HEIGTH)
            line.endFill()
            line.angle = ANGLE_LINE
            lineArray.push(line)
            lineGroup.add(line)
            currentY-=(LINE_HEIGTH_ANGLE-1)

            line.groups = []
	        for(var  j=0; j < MAX_NUM_LINES; j++){
	        	var g = game.add.group()
	        	gameObjectsGroup.add(g)
	        	gameObjectsGroup.sendToBack(g)
	        	line.groups.push(g)
	        }
        }
    }


    function create(){
    	
        sceneGroup = game.add.group()

        game.camera.focusOnXY(game.world.centerX, game.world.centerY);

        initialize()

        createBackground()

        if(!amazing.getMinigameId()){
			marioSong = game.add.audio('timberman')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.6)
			}, this);	
		}

        game.onPause.add(function(){
			
			if(amazing.getMinigameId()){
				marioSong.pause()
			}

           
			
	        game.sound.mute = true
	    } , this);

	    game.onResume.add(function(){
			
			if(amazing.getMinigameId()){
				if(lives > 0){
					marioSong.play()
				}
			}
			
	        game.sound.mute = false
	    }, this);


        animateScene()

        loadSounds()

        createObjects()


        createPointsBar()
        createHearts()

        spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    }

    function render(){
    	game.debug.text(game.time.fps || '--', 2, 14, "#00ff00"); 
    }

    
    return {
        assets: assets,
        name: "reinserta",
        create: create,
        preload: preload,
        update: update,
        render:render
    }

}()

function lerp(a,b,t){
   return a + t * (b - a);
}
