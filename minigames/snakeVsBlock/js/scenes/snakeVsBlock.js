var soundsPath = "../../shared/minigames/sounds/"
var snakeVsBlock = function(){

    var STATES = {
        MOVE:1,
        COLLISION:2
    }

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/snakeVsBlock/atlas.json",
                image: "images/snakeVsBlock/atlas.png",
            },
        ],
        images: [



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
        ],
        
    }
    
    var INITIAL_LIVES = 1 
    var UPDATE_DOTS = 30
    var BLOCKS_IN_LINE = 5
    var WIDT_BLOCK = 100
    var DIAMETER_DOT = 30
    var WIDTH_LINE = 5
    var INITIAL_DOTS = 4
    var MAX_DELTA = 50
    
    var PROBABILITY_DOWN_VALUES = 0.3
    var MAX_VALUE_DOTS = 5
    var MAX_VALUE_BLOCK = 50

    var MIN_LINES_TO_COMPLETE_LINE = 5
    var MAX_LINES_TO_COMPLETE_LINE = 8

    var PROBABILITY_DOT = 0.1
    var PROBABILITY_BLOCK = 0.4
    var PROBABILITY_LINE = 0.15
    var FRAMES_DELAY = 3

    var SPEED = 4
    var SPECIAL_SPEED = 7

    var BLOCKS_TO_SPECIAL = 35
    var TIME_SPECIAL = 10000
    var OFFSET_SHADOW = 10

    var DELTA_SPECIAL_VALUE = 5

    var skinTable
    
    var gameIndex = 29
    var gameId = 61
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null


    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var player 
    var dotsGroup, blockGroup, lineGroup
    var dotPositions, currentDots

    var initX
    var nextCompleteLine, currentLine
    var valueYLastLine, limitY
    var firstTap, positionInitaialTap
    var putBlock
    var currentFrames
    var state
    var moveDelta

    var currentQuadsDestroyed
    var lastSpecialDot
    var canCollide
    var emitterHit
    var walls

    var shadowGroup
    var currentBlocks
    var currentSpecialValue

    var collisionParticle, collisionParticle2
    var frameSpecial

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        dotPositions = []
        currentDots = []
        initX = game.world.centerX - ((BLOCKS_IN_LINE-1)/2) * WIDT_BLOCK
        currentLine = 1
        nextCompleteLine = game.rnd.integerInRange(MIN_LINES_TO_COMPLETE_LINE, MAX_LINES_TO_COMPLETE_LINE)
        firstTap = false
        positionInitaialTap = null
        limitY = -WIDT_BLOCK
        putBlock = false
        currentFrames = 0
        moveDelta = []
        currentQuadsDestroyed = 0
        canCollide = true
        walls = []
        currentBlocks = 0
        currentSpecialValue = DELTA_SPECIAL_VALUE
        frameSpecial = 0
        
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
            marioSong = sound.setSong(soundsPath + 'songs/retrowave.mp3',0.3)
        }else{
            game.load.audio('arcadeSong', soundsPath + 'songs/retrowave.mp3');
        }
        var fontStyle = {font: "60px SulphurPoint-Regular", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var text = new Phaser.Text(game, 0, 0, 0, fontStyle)

    }

    
    function stopGame(win){

        //heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        gameActive = false

        
        if(amazing.getMinigameId() ){
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
        
        var pointsImg = pointsBar.create(0,10,'atlas.game','pointsBar')
        pointsImg.x = game.world.width - pointsImg.width * 1.2
        pointsImg.width *=1
        pointsImg.height *=1
    
        var fontStyle = {font: "36px SulphurPoint-Regular", fontWeight: "bold", fill: "#030630", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.5
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

        /**/
        var delta = 0
        var lastP
        if(game.input.activePointer.isDown){
            //player.x = game.input.activePointer.x
            if(!firstTap){
                firstTap = true
                positionInitaialTap = game.input.activePointer.x
            }
            else{
                delta = positionInitaialTap - game.input.activePointer.x
                
                positionInitaialTap = game.input.activePointer.x
            }
        }
        else{
            firstTap = false
        }


        if(delta != 0 || moveDelta.length>0){
        	lastP = player.x
        	if(moveDelta.length>0){
        		if((moveDelta[moveDelta.length-1] < 0 && delta< 0)||(moveDelta[moveDelta.length-1] > 0 && delta> 0)){
        			moveDelta[moveDelta.length-1] += delta
        		}
        		else{
        			moveDelta.push(delta)
        		}

        		if(Math.abs(moveDelta[0])>DIAMETER_DOT){
        			if(moveDelta[0]<0){
        				moveDelta[0]+=DIAMETER_DOT
        				player.x+=DIAMETER_DOT
        				delta = - DIAMETER_DOT
        			}
        			else{
        				moveDelta[0]-=DIAMETER_DOT
        				player.x-=DIAMETER_DOT
        				delta = DIAMETER_DOT
        			}
        		}
        		else{
        			player.x-=moveDelta[0]
        			delta = moveDelta[0]
        			moveDelta.splice(0,1)
        		}
        	}
        	else{
        		if(Math.abs(delta)<=DIAMETER_DOT){
	        		player.x-=delta
	        	}
	        	else{ 
	        		if(moveDelta.length==0){
		        		moveDelta.push(delta)
		        	}
		        	else{
		        		if((moveDelta[moveDelta.length-1] < 0 && delta< 0)||(moveDelta[moveDelta.length-1] > 0 && delta> 0)){
		        			moveDelta[moveDelta.length-1] += delta
		        		}
		        		else{
		        			moveDelta.push(delta)
		        		}
		        	}

	        		if(Math.abs(moveDelta[0])>DIAMETER_DOT){
	        			if(moveDelta[0]<0){
	        				moveDelta[0]+=DIAMETER_DOT
	        				player.x+=DIAMETER_DOT
	        				delta = - DIAMETER_DOT
	        			}
	        			else{
	        				moveDelta[0]-=DIAMETER_DOT
	        				player.x-=DIAMETER_DOT
	        				delta = DIAMETER_DOT
	        			}
	        		}
	        		else{
	        			player.x-=moveDelta[0]
	        			delta = moveDelta[0]
	        			moveDelta.splice(0,1)
	        		}
	        	}
	        	
        	}

            for(var i =0; i < lineGroup.length; i++){
                if(lineGroup.children[i].visible){
                    var line = lineGroup.children[i]
                    
                    if(checkOverlap(line,player)){
                         if(lastP < line.x && delta<0 ){
                            player.x = line.x - (WIDTH_LINE/2 + DIAMETER_DOT/2)
                         }
                         else if(lastP > line.x && delta >0){
                            player.x = line.x + (WIDTH_LINE/2 + DIAMETER_DOT/2)
                         }
                         moveDelta.splice(0,moveDelta.length)
                    }
                    else{
                    	if(player.y < line.y+WIDT_BLOCK/2 && player.y > line.y-WIDT_BLOCK/2){
	                    	if(lastP < line.x && player.x > line.x){
	                    		player.x = line.x - (WIDTH_LINE/2 + DIAMETER_DOT/2)
	                    	}
	                    	else if(lastP > line.x && player.x < line.x){
	                    		player.x = line.x + (WIDTH_LINE/2 + DIAMETER_DOT/2)
	                    	}
	                    	moveDelta.splice(0,moveDelta.length)
	                    }
                    }

                }
            }

            for(var i =0; i < walls.length; i++){
                if(checkOverlap(walls[i],player)){
                    if(walls[i].x < game.world.centerX && delta >0){
                        player.x = walls[i].x + (DIAMETER_DOT/2) 
                    }
                    else if(walls[i].x > game.world.centerX && delta <0){
                        player.x = walls[i].x - (DIAMETER_DOT/2)
                    }
                    moveDelta.splice(0,moveDelta.length)
                }
            }

	        for(var i =0; i < blockGroup.length; i++){
	            if(blockGroup.children[i].visible){

	                var block = blockGroup.children[i]
	                

	                if(checkOverlap(block,player) && block.y >0){
	                    if(player.y < block.y+WIDT_BLOCK/2){

		                	if(lastP < block.x && delta<0 ){
                                player.x = block.x - (WIDT_BLOCK/2 + DIAMETER_DOT/2)
                             }
                             else if(lastP > block.x && delta >0){
                                player.x = block.x + (WIDT_BLOCK/2 + DIAMETER_DOT/2)
                             }
		                }
		                moveDelta.splice(0,moveDelta.length)
	                }
	                else{
	                	if(player.y < block.y+WIDT_BLOCK/2 && player.y > block.y-WIDT_BLOCK/2){
	                    	if(lastP < block.x && player.x > block.x){
	                    		player.x = block.x - (WIDT_BLOCK/2 + DIAMETER_DOT/2)
	                    	}
	                    	else if(lastP > block.x && player.x < block.x){
	                    		player.x = block.x + (WIDT_BLOCK/2 + DIAMETER_DOT/2)
	                    	}
	                    	moveDelta.splice(0,moveDelta.length)
	                    }

                    }
	            }
	        }

            dotPositions.splice(0,0,player.x)
            dotPositions.splice(dotPositions.length-1,1)
	            
        }


        if(state == STATES.MOVE){
            for(var i =0; i < dotsGroup.length; i++){
                if(dotsGroup.children[i].visible){
                    var dot = dotsGroup.children[i]
                    if(!dot.inPlayer){
                        if(player.special){
                            dot.y += SPECIAL_SPEED
                        }
                        else{
                            dot.y += SPEED
                        }
                        if(dot.y > game.world.height + 100){
                            dot.visible == false
                        }

                        if(checkOverlap(dot,player)){

                                dot.inPlayer = true
                                dot.text.visible = false
                                currentDots.push(dot)
                                dot.y = currentDots[currentDots.length-1].y+DIAMETER_DOT
                                dot.x = currentDots[currentDots.length-1].x
                                //dot.x = 0
                                updateDot(currentDots.length-1)

                                for(var i =0; i < dot.value-1; i++){
                                    var d = getDot()
                                    d.inPlayer = true
                                    currentDots.push(d)

                                    if(player.special){
                                        d.loadTexture("atlas.game","ballStar")
                                    }

                                    dot.y = currentDots[currentDots.length-1].y+DIAMETER_DOT

    	                            dot.x = currentDots[currentDots.length-1].x
    	                            

                                }

                                player.text.setText(currentDots.length+1)
                        }
                    }
                }
            }

            for(var i =0; i < lineGroup.length; i++){
                if(lineGroup.children[i].visible){
                    var line = lineGroup.children[i]
                     if(player.special){
                        line.y += SPECIAL_SPEED
                    }
                    else{
                        line.y += SPEED
                    }
                    
                }
            }

            if(player.special){
                valueYLastLine += SPECIAL_SPEED
            }
            else{
                valueYLastLine += SPEED
            }

            if(valueYLastLine > limitY){
                decideLine()
            }

            
        }

        //var collide = false
        //var canCollide = true

        if(currentFrames<FRAMES_DELAY){
        	currentFrames++
        	//canCollide = false
        	//return
        }
        else{
        	currentFrames=0
        }

        for(var i =0; i < blockGroup.length; i++){
            if(blockGroup.children[i].visible){

                var block = blockGroup.children[i]
                if(state == STATES.MOVE){
                    if(player.special){
                        block.y += SPECIAL_SPEED
                    }
                    else{
                        block.y += SPEED
                    }
                    block.shadow.y = block.y + OFFSET_SHADOW
                }
                if(player.y > block.y+WIDT_BLOCK/2 ){
	                if(checkOverlap(block,player) && block.y >0){

	                    //console.log(player.y,block.y,block)
	                    collide = true
	                    if(canCollide){
                            addPoint(1,{x:game.world.width-80,y:80})
                            collisionParticle.visible = true
                            collisionParticle.x = player.x
                            collisionParticle.y  = player.y-10
                            collisionParticle.scale.setTo(0.7)
                            game.add.tween(collisionParticle.scale).to({x:1,y:1},200,Phaser.Easing.linear,true).onComplete.add(function(){
                                collisionParticle.scale.setTo(0.7)
                                collisionParticle.visible = false
                            })

                            emitterHit.x = player.x;
                            emitterHit.y = player.y;
                            emitterHit.start(true,500,null,10)

                            if(player.special){
                                block.value = 0
                               //addPoint(1,{x:game.world.width-80,y:80})
                            }
                            else{
    		                    block.value --
                                if(block.tween !=null){
                                    block.tween.stop()
                                }
                                block.tween = game.add.tween(block.scale).to({x:0.8,y:0.8},50,Phaser.Easing.linear,true)

                                block.tween.yoyo(true)
                                canCollide = false
                                block.tween.onComplete.add(function(){
                                    canCollide = true
                                })

                            }

                            block.text.setText(block.value)

		                    if(block.value == 0 && Math.abs(player.y - block.y)<WIDT_BLOCK){
		                        block.visible = false
                                block.shadow.visible = false
                                canCollide = true
                                addPoint(1,{x:game.world.width-80,y:80})
                                collisionParticle2.y = block.y +10
                                collisionParticle2.visible = true
                                collisionParticle2.x = block.x
                                collisionParticle2.y  = block.y-10
                                collisionParticle.scale.setTo(0.7)
                                game.add.tween(collisionParticle2.scale).to({x:1,y:1},200,Phaser.Easing.linear,true).onComplete.add(function(){
                                    collisionParticle2.scale.setTo(0.7)
                                    collisionParticle2.visible = false
                                })

                                if(block.special){
                                    //player.text.addColor('#00ff00', 0);
                                    player.special = true
                                    currentSpecialValue += DELTA_SPECIAL_VALUE
                                    

                                    frameSpecial = 0
                                    
                                    setTimeout(function(){
                                        player.special = false
                                        currentBlocks = 0
                                        //player.text.addColor('#ffffff', 0);

                                    },TIME_SPECIAL)
                                }
		                    }

                            if(!player.special){
    		                    if(currentDots.length > 0){
    		                        currentDots[currentDots.length-1].inPlayer = false
    		                        currentDots[currentDots.length-1].visible = false
    		                        
    		                        currentDots.splice(currentDots.length-1,1)
    		                        player.text.setText(currentDots.length+1)
    		                    }
    		                    else{
    		                        player.visible = false

    		                        stopGame()
    		                    }
                            }
		                }
	                }
	            }
            }
        }

        if(!canCollide){
            state = STATES.COLLISION
        }
        else{
            state = STATES.MOVE
        }

        if(player.special){
            if(frameSpecial == 0){
                frameSpecial = 1
                player.loadTexture("atlas.game","ballStar")
                for(var i =0; i < dotsGroup.length; i++){
                    if(dotsGroup.children[i].visible){
                        if(dotsGroup.children[i].inPlayer){
                            dotsGroup.children[i].loadTexture("atlas.game","ballStar")
                        }
                    }
                }
            }
            else if(frameSpecial <5){
                frameSpecial ++
            }
            else if(frameSpecial == 5){
                frameSpecial ++
                player.loadTexture("atlas.game","ball")
                for(var i =0; i < dotsGroup.length; i++){
                    if(dotsGroup.children[i].visible){
                        if(dotsGroup.children[i].inPlayer){
                            dotsGroup.children[i].loadTexture("atlas.game","ball")
                        }
                    }
                }
            }
            else if(frameSpecial < 10){
                frameSpecial ++
            }
            else{
                frameSpecial = 0
            }
        }
        else{
            if(frameSpecial != 0){
                frameSpecial = 0
                player.loadTexture("atlas.game","ball")
                for(var i =0; i < dotsGroup.length; i++){
                    if(dotsGroup.children[i].visible){
                        if(dotsGroup.children[i].inPlayer){
                            dotsGroup.children[i].loadTexture("atlas.game","ball")
                        }
                    }
                }
            }
        }

        var number = currentDots.length
        /*if(number > UPDATE_DOTS){
            number = UPDATE_DOTS
        }*/

        for(var i=0; i < number; i++){

        	updateDot(i)

        }
        
    }

    function updateDot(i){

    	if(i ==0){
    		last = player
            if(player.special){
    		  last.imaginaryY = player.y - SPECIAL_SPEED
            }
            else{
                last.imaginaryY = player.y - SPEED
            }
    	}
        else{
	    	last=currentDots[i-1]

            if(player.special){
              last.imaginaryY = last.y- SPECIAL_SPEED
            }
            else{
                last.imaginaryY = last.y-SPEED
            }

	        
	    }



    	var x = last.x - currentDots[i].x
    	var h = Math.sqrt(Math.pow(last.x - currentDots[i].x,2) + Math.pow(last.imaginaryY - currentDots[i].y,2))
    	var ang = Math.acos(x/h)
    	//console.log((ang*(180/Math.PI)))

    	var newX = -DIAMETER_DOT*Math.cos(ang)
    	var newY = DIAMETER_DOT*Math.sin(ang)
    	//console.log(newX,newY)
    	//gameActive = false

    	currentDots[i].x = last.x + newX
    	currentDots[i].y = last.y + newY

        if(currentDots[i].y <player.y){
            console.log("wrong dot")
            currentDots[i].visible = false
        }
    }

    
    function addLine(y,first){
        
        var x
        var value 
        var indexLess = game.rnd.integerInRange(0,BLOCKS_IN_LINE-1)
        for(var i =0; i < BLOCKS_IN_LINE; i++){
            x = initX + (i*WIDT_BLOCK)
            if(first){
                value = game.rnd.integerInRange(1,3)
            }
            else{

                if(indexLess == i){
                    if(currentDots.length < 5){
                        value = Math.round(currentDots.length/2)
                    }
                    else{
                        value = currentDots.length - game.rnd.integerInRange(currentDots.length/2,currentDots.length/3)
                    }
                }
                else{
                    /*if(currentDots.length < 5){
                        value = Math.round(game.rnd)
                    }
                    else{*/
                        var v = (currentDots.length/3)
                        if(v < 5){
                            v = 5
                        }
                        
                        value = game.rnd.integerInRange(v,currentDots.length+10)
                        if(value > MAX_VALUE_BLOCK){
                            value = MAX_VALUE_BLOCK
                        }
                    //}
                }
            }

            getBlock(value,x,y)
        }
    }

    function decideLine(){
        valueYLastLine-= WIDT_BLOCK
        if(currentLine >= nextCompleteLine && putBlock){
            currentLine = 0
            addLine(valueYLastLine,false)
        }
        else{
            currentLine ++
            var lines = [false,false,false,false,false,false]
            var lineInit = game.world.centerX - ((BLOCKS_IN_LINE-2)/2)*WIDT_BLOCK
            for(var i =0; i< BLOCKS_IN_LINE-1; i++){
                var r = game.rnd.frac()
                if(r < PROBABILITY_LINE){
                	lines[i+1] = true
                    getVerticalLine(lineInit + (WIDT_BLOCK*i),valueYLastLine)
                }
            }

            for(var i =0; i< BLOCKS_IN_LINE; i++){
                var r = game.rnd.frac()
                if(r < PROBABILITY_DOT){
                    var dot = getDot()
                    dot.y = valueYLastLine
                    dot.x = initX + (i*WIDT_BLOCK)
                    dot.value = game.rnd.integerInRange(1,MAX_VALUE_DOTS)
                    dot.text.setText(dot.value)
                    dot.text.visible = true
                }
                else if(r < PROBABILITY_BLOCK && putBlock){
                	if(!lines[i] && !lines[i+1]){
                    	getBlock(game.rnd.integerInRange(1,MAX_VALUE_BLOCK),initX + (i*WIDT_BLOCK),valueYLastLine)
                    }
                }
            }
            

        }

        putBlock = !putBlock
    }


    function setRound(){
        var dot = getDot()
        for(var i =0; i < 3; i++){
            dot.x = initX + game.rnd.integerInRange(0,BLOCKS_IN_LINE-1)
            dot.y = player.y - WIDT_BLOCK*i
            dot.value = game.rnd.integerInRange(1,MAX_VALUE_DOTS)
            dot.text.setText(dot.value)
            dot.text.visible = true
        }

        addLine(player.y - WIDT_BLOCK*4,true)
        valueYLastLine = player.y - WIDT_BLOCK*4
        while(valueYLastLine >= limitY){
            
            decideLine()
        }

    }

    function endRound(){
        
    }

    function createBackground(){

        var bmd = game.add.bitmapData(game.world.width, game.world.height)

        //bmd.addToWorld()
        //sceneGroup.add(bmd)

        /*var y = 0;

        for (var i = 0; i < game.world.centerY/4; i++)
        {
            var c = Phaser.Color.interpolateColor(0x8ae5f8, 0x030630, game.world.centerY, i);

            // console.log(Phaser.Color.getWebRGB(c));

            bmd.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c));

            //out.push(Phaser.Color.getWebRGB(c));

            y += 2;
        }*/

        var background = game.add.sprite(0, 0, "atlas.game","background");
        background.scale.setTo(game.world.width/2,game.world.height/background.height)
        sceneGroup.add(background)

        var wall = game.add.graphics()
        wall.x = game.world.centerX + (WIDT_BLOCK*2.5)
        //wall.beginFill(0x0000ff)
        wall.drawRect(0,0,game.world.width - wall.x, game.world.height)
        //wall.endFill()
        sceneGroup.add(wall)
        walls.push(wall)

        var line = game.add.sprite(0, 0, "atlas.game","wallLine");
        line.scale.setTo(WIDTH_LINE,game.world.height/line.height)
        wall.addChild(line)


        wall = game.add.graphics()
        wall.x = game.world.centerX - (WIDT_BLOCK*2.5)
        wall.drawRect(-wall.x,0,wall.x, game.world.height)
        sceneGroup.add(wall)
        walls.push(wall)

        line = game.add.sprite(0, 0, "atlas.game","wallLine");
        line.anchor.setTo(1,0)
        line.scale.setTo(WIDTH_LINE,game.world.height/line.height)
        wall.addChild(line)


        emitterHit = game.add.emitter(0, 0, 100);
        emitterHit.makeParticles("atlas.game","chispaParticle");
        emitterHit.gravity = 300;

        collisionParticle = sceneGroup.create(0,0,"atlas.game","chispas")
        collisionParticle.anchor.setTo(0.5)
        collisionParticle.scale.setTo(0.7)
        collisionParticle.visible = false

        collisionParticle2 = sceneGroup.create(0,0,"atlas.game","chispas")
        collisionParticle2.anchor.setTo(0.5)
        collisionParticle2.scale.setTo(0.7)
        collisionParticle2.visible = false
        collisionParticle2.angle = 180

    }

    function createPlayer(){

        shadowGroup = game.add.group()
        sceneGroup.add(shadowGroup)


        player = sceneGroup.create(game.world.centerX,game.world.height - WIDT_BLOCK*4,"atlas.game","ball")
        player.anchor.setTo(0.5)
        state = STATES.MOVE
        player.special = false
        lastSpecialDot = game.add.graphics()
        lastSpecialDot.visible = true

        setTimeout(function () {
            lastSpecialDot.visible = false
        },5000)

        var fontStyle = {font: "21px SulphurPoint-Regular", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var numberDot = new Phaser.Text(sceneGroup.game, 0, -20, "", fontStyle)
        numberDot.anchor.setTo(0.5)
        player.addChild(numberDot)
        player.text = numberDot

        dotsGroup = game.add.group()
        sceneGroup.add(dotsGroup)

        blockGroup = game.add.group()
        sceneGroup.add(blockGroup)

        lineGroup = game.add.group()
        sceneGroup.add(lineGroup)

        for(var i =0; i <INITIAL_DOTS-1; i++) {
            var d = getDot()
            d.inPlayer = true
            d.x = player.x
            currentDots.push(d)
            d.y = player.y + DIAMETER_DOT*currentDots.length

        }

        player.text.setText(currentDots.length+1)

        for(i=0; i < UPDATE_DOTS; i++){
            dotPositions.push({x:0,y:DIAMETER_DOT})
        }

        
    }

    function getDot(){

        for(var i =0; i < dotsGroup.length; i++){
            if(!dotsGroup.children[i].visible){
                dotsGroup.children[i].visible = true
                dotsGroup.children[i].text.visible = false
                dotsGroup.children[i].value = 0
                dotsGroup.children[i].inPlayer = false

                /*if(player.special){
                    dotsGroup.children[i].loadTexture("atlas.game","ballStar")
                }else{
                    dotsGroup.children[i].loadTexture("atlas.game","ball")
                }*/

                dotsGroup.children[i].loadTexture("atlas.game","ball")

                return dotsGroup.children[i]
            }
        }

        var dot = dotsGroup.create(0,0,"atlas.game","ball")
        dot.anchor.setTo(0.5)

        /*if(player.special){
            dot.loadTexture("atlas.game","ballStar")
        }*/
        

        var fontStyle = {font: "21px SulphurPoint-Regular", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var numberDot = new Phaser.Text(sceneGroup.game, 0, -20, "", fontStyle)
        numberDot.anchor.setTo(0.5)
        dot.addChild(numberDot)
        numberDot.visible = false
        dot.value = 0
        dot.text = numberDot
        dot.inPlayer = false
        //dot.special = special
        return dot 
    }

    function getBlock(value,x,y){

        if(value == 0){
            value = 1
        }

        var special = false
        if(currentBlocks<BLOCKS_TO_SPECIAL){
            currentBlocks++
        }
        else{
            if(value > currentDots.length && !player.special){
                currentBlocks = 0
                special = true
                value = currentSpecialValue
            }
        }


        for(var i =0; i < blockGroup.length; i++){
            if(!blockGroup.children[i].visible){
                var block = blockGroup.children[i]
                block.visible = true
                block.shadow.visible = true
                block.x = x
                block.y = y
                block.shadow.x = x
                block.shadow.y = y+OFFSET_SHADOW
                block.text.setText(value)
                block.value = value
                 block.clear()
                
                   
                if(special){ 
                    block.beginFill(0xe80169)
                }
                else{
                    if(value >=1 && value <=3){
                        block.beginFill(0x8ae5f8)
                    }
                    else if(value >=4 && value <=10){
                        block.beginFill(0x35ffb1)
                    }
                    else if(value >=11 && value <=20){
                        block.beginFill(0x87eb4d)
                    }
                    else if(value >=21 && value <=25){
                        block.beginFill(0xffc973)
                    }
                    else if(value >=26 && value <=33){
                        block.beginFill(0xff6666)
                    }
                    else if(value >=34 && value <=39){
                        block.beginFill(0xe80169)
                    }
                    else if(value >=40 && value <=50){
                        block.beginFill(0x880e59)
                    }
                }
                   
                block.special = special

                
                block.drawRoundedRect(-WIDT_BLOCK/2,-WIDT_BLOCK/2,WIDT_BLOCK,WIDT_BLOCK,20)
                block.endFill()

                if(special){
                    block.star.visible = true
                    block.text.y = -15
                }
                else{
                    block.star.visible = false
                    block.text.y = 0
                }

                return block
            }
        }

        var block = game.add.graphics()
        block.x = x
        block.y = y
        block.special = special

        if(special){
            block.beginFill(0xe80169)
        }
        else{
            if(value >=1 && value <=3){
                block.beginFill(0x8ae5f8)
            }
            else if(value >=4 && value <=10){
                block.beginFill(0x35ffb1)
            }
            else if(value >=11 && value <=20){
                block.beginFill(0x87eb4d)
            }
            else if(value >=21 && value <=25){
                block.beginFill(0xffc973)
            }
            else if(value >=26 && value <=33){
                block.beginFill(0xff6666)
            }
            else if(value >=34 && value <=39){
                block.beginFill(0xe80169)
            }
            else if(value >=40 && value <=50){
                block.beginFill(0x880e59)
            }
        }

        block.drawRoundedRect(-WIDT_BLOCK/2,-WIDT_BLOCK/2,WIDT_BLOCK,WIDT_BLOCK,20)
        block.endFill()
        blockGroup.add(block)
        block.value = value

        var star = game.add.sprite(0,20,"atlas.game","star")
        star.scale.setTo(0.6)
        star.anchor.setTo(0.5)
        star.visible = false
        block.star = star
        block.addChild(star)

        var fontStyle = {font: "45px SulphurPoint-Regular", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var numberText = new Phaser.Text(sceneGroup.game, 0, 0, value, fontStyle)
        numberText.anchor.setTo(0.5)

        block.addChild(numberText)
        block.text = numberText


        block.shadow = getShadow()
        block.shadow.x = x
        block.shadow.y = y + OFFSET_SHADOW

        if(special){
            star.visible = true
            numberText.y -=10
        }


        return block
    }

    function getShadow(){
        /*for(var i =0; i < shadowGroup.length; i++){
            if(!shadowGroup.children[i].visible){

            }
        }*/

        var shadow = game.add.graphics()
        shadow.beginFill(0x030630)
        shadow.drawRoundedRect(-WIDT_BLOCK/2,-WIDT_BLOCK/2,WIDT_BLOCK,WIDT_BLOCK,20)
        shadow.endFill()
        shadow.alpha = 0.65
        shadowGroup.add(shadow)
        return shadow
    }



    function getVerticalLine(x,y){
        for(var i = 0; i < lineGroup.length; i ++){
            if(!lineGroup.children[i].visible){
                var line = lineGroup.children[i]
                line.x = x
                line.y = y
                line.visible = true
                var r = game.rnd.integerInRange(0,1)
                line.clear()
                line.beginFill(0xffffff)
                if(r == 2){
                    
                    line.drawRoundedRect(-WIDTH_LINE/2,-WIDT_BLOCK,WIDTH_LINE,WIDT_BLOCK*2,20)
                    line.y -= WIDT_BLOCK/2
                }
                else{

                    line.drawRoundedRect(-WIDTH_LINE/2,-WIDT_BLOCK/2,WIDTH_LINE,WIDT_BLOCK,20)
                    
                }

                line.endFill()
                return
            }
        }

        var line = game.add.graphics()
        line.x = x
        line.y = y

        var r = game.rnd.integerInRange(0,1)
        line.beginFill(0xffffff)
        if(r == 2){      
            line.drawRoundedRect(-WIDTH_LINE/2,-WIDT_BLOCK,WIDTH_LINE,WIDT_BLOCK*2,20)
            line.y -= WIDT_BLOCK/2
        }
        else{
            line.drawRoundedRect(-WIDTH_LINE/2,-WIDT_BLOCK/2,WIDTH_LINE,WIDT_BLOCK,20)
        }

        line.endFill()
        lineGroup.add(line)

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
        createPlayer()

        //console.log(amazing.getMinigameId())
        if(!amazing.getMinigameId()){
			marioSong = game.add.audio('arcadeSong')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.6)
			}, this);	
		}

        game.onPause.add(function(){
			if(lives>0){
    			if(amazing.getMinigameId()){
    				marioSong.pause()
    			}
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

        spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        createPointsBar()
        //createHearts()

        animateScene()

        loadSounds()

        createObjects()
        setRound()

    }

    
    return {
        assets: assets,
        name: "snakeVsBlock",
        create: create,
        preload: preload,
        update: update
    }
}()

function lerp(a,b,t){
   return a + t * (b - a);
}