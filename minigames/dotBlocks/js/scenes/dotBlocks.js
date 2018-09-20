var soundsPath = "../../shared/minigames/sounds/"
var dotBlocks = function(){

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/dotBlocks/atlas.json",
                image: "images/dotBlocks/atlas.png",
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
            {   name: "falling",
                file: soundsPath + "falling.mp3"},  
        ],
        
    }
    
    var INITIAL_LIVES = 1
    var DIAMETER_DOT = 50
    var INITIAL_PROBABILITY_BLOCK = 0.2
    var DELTA_PROBABILITY = 0.03
    var MAX_PROBABILITY = 0.8
    var WIDT_BLOCK = 110
    var INITIAL_MIN = 3
    var INITIAL_MAX = 8
    var DELTA_MIN = 0.2
    var DELTA_MAX = 0.5
    var BLOCK_IN_LINE = 5
    var INITIAL_DOTS = 10
    var TIME_BETWEEN_SHOT = 150
    var DOTS_SPEED = 1000

    var WIDTH_LINE = 5

    var OFFSET_SHADOW = 10

    var PROBABILITY_DOTS = 0.04
    
    var gameIndex = 31
    var gameId = 1000022
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null

    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var startPointX
    var currentDots, currentProbability
    var minRange, maxRange
    var initialBall
    var currentY
    var initX, ballY 
    var touchStarted
    var blockGroup, dotsGroup, shadowGroup
    var walls 
    var currentIndexShoot, timeShoot
    var initialVel
    var miniDots
    var topWall
    var returnedDots, canTouch, blockInMove 
    var dotsInSpace
    var endInitCreation

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        startPointX = game.world.centerX
        currentDots = []
        currentProbability = INITIAL_PROBABILITY_BLOCK
        minRange = INITIAL_MIN
        maxRange = INITIAL_MAX
        currentY = game.world.height - (WIDT_BLOCK*4)
        initX = game.world.centerX - ((4)/2) * WIDT_BLOCK
        touchStarted = false
        ballY = game.world.height - DIAMETER_DOT*2
        walls = []
        currentIndexShoot = 0
        initialVel = {x:0,y:0}
        returnedDots = 0
        canTouch = true
        blockInMove = false
        dotsInSpace = []
        endInitCreation = false


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

        if(game.input.activePointer.isDown){
            if(canTouch && !blockInMove){
                touchStarted = true
                updateLine(game.input.activePointer)
            }
        }
        else{
            if(touchStarted){
                canTouch = false
                touchStarted = false

                shoot()
            }

            if(!canTouch){
                if(currentIndexShoot < currentDots.length){
                    if(game.time.now > timeShoot){
                        currentDots[currentIndexShoot].body.velocity.setTo(initialVel.x,initialVel.y)
                        currentDots[currentIndexShoot].shooted = true
                        currentIndexShoot++
                        timeShoot = game.time.now + TIME_BETWEEN_SHOT
                    }
                }

                game.physics.arcade.collide(dotsGroup,blockGroup,collideBlock);
                for(var i =0; i < walls.length; i++){
                    game.physics.arcade.collide(dotsGroup,walls[i].line);
                }
                game.physics.arcade.collide(dotsGroup,topWall);

                for(var i =0; i < dotsInSpace.length; i++){
                    if(dotsInSpace[i].visible && dotsInSpace[i].body.enable){
                        game.physics.arcade.overlap(dotsInSpace[i],dotsGroup,catchDot);
                    }
                }

                var finishMove = true
                for(var  i =0; i < currentDots.length; i++){
                    var dot = currentDots[i]
                    if(!dot.shooted){
                        finishMove = false
                        continue
                    }
                    if(dot.body.y>ballY){
                        if(dot.body.velocity.y>0){
                            returnedDots++
                            dot.body.y = ballY
                            dot.body.velocity.setTo(0,0)
                            dot.moveX = true
                            if(returnedDots >= dotsGroup.length){
                                //canTouch = true
                            }
                            else if(returnedDots == 1){
                                startPointX = dot.body.x
                                dot.moveX = false
                                //dot.shooted = false
                            }

                        }
                    }
                    else{
                        if(dot.body.velocity.y != 0){
                            //console.log("enter here")
                            finishMove = false
                        }
                    }

                    if(dot.moveX){
                        
                        finishMove = false
                        dot.body.x = lerp(dot.body.x,startPointX,0.6)
                        if(Math.abs(dot.body.x-startPointX)<1){
                            dot.body.x = startPointX
                            dot.moveX = false
                        }

                    }
                }

                if(finishMove){
                    //console.log("enter here")
                    canTouch = true
                    setRound()
                    returnedDots = 0
                    for(var  i =0; i < dotsGroup.length; i++){
                        dotsGroup.children[i].shooted = false
                    }
                    startPointX += 15
                }
            }


        }

    }

    function catchDot(dot,dot2){
        if(!dot.visible){
            return
        }

        dot.visible = false
        dot.body.enable = false
    }


    function collideBlock(dot,block){
        if(!dot.visible || !block.visible){
            return
        }

        block.value --
        if(block.value <= 0){
            //console.log(block)
            block.visible = false
            block.body.enable = false
            //block.shadow.visible = false
            
            addPoint(1,{x:game.world.width-80,y:80})
        }
        else{

            if(block.value >=1 && block.value <=10){
                block.loadTexture("atlas.game","bloque1")
            }
            else if(block.value >=11 && block.value <=20){
                block.loadTexture("atlas.game","bloque2")
            }
            else if(block.value >=21 && block.value <=30){
                block.loadTexture("atlas.game","bloque3")
            }
            else if(block.value >=31 && block.value <=40){
                block.loadTexture("atlas.game","bloque4")
            }
            else if(block.value >=41 && block.value <=50){
                block.loadTexture("atlas.game","bloque5") 
            }


            block.text.setText(block.value)
        }
    }

    function updateLine(pointer){
        var deltaX = startPointX - pointer.x
        var deltaY = ballY - pointer.y
        var d = Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2))
        var ang = Math.acos(deltaX/d)

        var velX = -30 * Math.cos(ang)
        var velY = -30 * Math.sin(ang)
        var evaling = 0
        var display = true
        var _x = 0
        var _y = 0
        for(var i =0; i< miniDots.length; i++){

            if(evaling<2){
                if(startPointX+(_x+velX) > walls[0].x || startPointX+(_x+velX) < walls[1].x){
                    evaling ++
                    velX = - velX
                }
                else{
                    for(var j =0; j < blockGroup.length; j++){
                        if(blockGroup.children[j].visible){
                            var block = blockGroup.children[j]
                            if(startPointX+(_x+velX)+DIAMETER_DOT/2 > block.body.x  && startPointX+(_x+velX)-DIAMETER_DOT/2 < block.body.x + WIDT_BLOCK){
                                if(ballY+(_y+velY)+DIAMETER_DOT/2 > block.body.y && ballY+(_y+velY)-DIAMETER_DOT/2 < block.body.y + WIDT_BLOCK){
                                    evaling ++
                                    var dX = Math.abs((block.body.x+WIDT_BLOCK/2) - (startPointX+(_x+velX)))
                                    var dY = Math.abs((ballY+(_y+velY)) - (block.body.y+WIDT_BLOCK/2))
                                    if(dX > dY){
                                        //velY = - velY
                                        if((ballY+(_y+velY)) > (block.body.y+WIDT_BLOCK-DIAMETER_DOT/2)){
                                            velY = -velY
                                        }
                                        else{
                                            velX = - velX
                                        }
                                    }
                                    else if(dX < dY){
                                        //velX = - velX
                                        velY = - velY
                                    }
                                    else if(dX == dY){
                                        //velX = - velX
                                        velY = - velY
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            if(evaling >=2){
                display = false
            }

            _x += velX
            _y += velY

            if(display){
                miniDots.children[i].x = startPointX + (_x) 
                miniDots.children[i].y = ballY + (_y)
            }
            else{
                miniDots.children[i].x = -100
                miniDots.children[i].y = -100
            }
        }

    }

    function shoot(){
        currentIndexShoot = 0
        for(var i =0; i< miniDots.length; i++){
            miniDots.children[i].x = -100
            miniDots.children[i].y = -100
        }

        timeShoot = game.time.now 
        var deltaX = startPointX - game.input.activePointer.x
        var deltaY = ballY - game.input.activePointer.y
        var d = Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2))
        var ang = Math.acos(deltaX/d)
        initialVel.x = -DOTS_SPEED*Math.cos(ang)
        initialVel.y = -DOTS_SPEED*Math.sin(ang)
    }


    function setRound(){
        blockInMove = true 

        for(var i =dotsInSpace.length-1; i >=0 ; i--){
            if(!dotsInSpace[i].visible){
                var dot = dotsInSpace[i]
                dot.loadTexture("atlas.game","dot")
                currentDots.push(dot)
                dot.body.y = ballY
                dot.body.x = startPointX
                dot.visible = true
                dot.body.enable = true
                dotsInSpace.splice(i,1)
            }
        }
        //console.log(currentDots.length)

        decideLine()
        currentY+=WIDT_BLOCK
        var onStop = false
        for(var i =0; i < blockGroup.length; i++){
            if(blockGroup.children[i].visible){
                var block = blockGroup.children[i]
                if(block.body.y +WIDT_BLOCK*2 > ballY){
                    onStop = true
                }
                game.add.tween(block.body).to({y:block.body.y+WIDT_BLOCK},300,Phaser.Easing.linear,true)
            }
        }

        if(onStop){
            stopGame()
        }

        /*for(var i =0; i < shadowGroup.length; i++){
            if(shadowGroup.children[i].visible){
                var shadow = shadowGroup.children[i]
                game.add.tween(shadow).to({y:shadow.y+WIDT_BLOCK},300,Phaser.Easing.linear,true)
            }
        }*/

        for(var i =0; i < dotsInSpace.length; i++){
            if(dotsInSpace[i].visible){
                var dot = dotsInSpace[i]
                game.add.tween(dot.body).to({y:dot.body.y+WIDT_BLOCK},300,Phaser.Easing.linear,true)
            }
        }
        setTimeout(function(){
            blockInMove = false
        },300)
    }

    function decideLine(){
        var setBlock = false
        var indexDots = []
        for(var i = 0; i < BLOCK_IN_LINE; i ++){
            var random = game.rnd.frac()
            if(random < currentProbability){
                setBlock = true
                var block = getBlock(game.rnd.integerInRange(Math.floor(minRange),Math.floor(maxRange)),initX + (WIDT_BLOCK*i),currentY)
            }
            else if(random <= currentProbability+PROBABILITY_DOTS){
                var dot = getDot(initX + (WIDT_BLOCK*i),currentY)
                dot.loadTexture("atlas.game","dotInGame")
                dotsInSpace.push(dot)
            }
            else{
                indexDots.push(i)
            }
        }

        if(!setBlock){
            var r = game.rnd.integerInRange(0,indexDots.length-1)
            r = indexDots[r]
            var block = getBlock(game.rnd.integerInRange(Math.floor(minRange),Math.floor(maxRange)),initX + (WIDT_BLOCK*r),currentY)
        }

        if(currentProbability < MAX_PROBABILITY){
            currentProbability+= DELTA_PROBABILITY
        }

        minRange += DELTA_MIN
        maxRange += DELTA_MAX

        currentY -=WIDT_BLOCK
    }

    function getDot(x,y){

        for(var i =0; i < dotsGroup.length; i++){
            if(!dotsGroup.children[i].visible){
                dotsGroup.children[i].visible = true
                dotsGroup.children[i].x = x
                dotsGroup.children[i].y = y
                dotsGroup.children[i].moveX = false
                dotsGroup.children[i].shooted = false
                return dotsGroup.children[i]
            }
        }

        var dot = dotsGroup.create(x,y,"atlas.game","dot")
        dot.anchor.setTo(0.5)
        dot.shooted = false
        game.physics.enable(dot, Phaser.Physics.ARCADE);
        dot.body.bounce.setTo(1,1)
        dot.moveX = false
        return dot 
    }

    function getBlock(value,x,y){

        if(value == 0){
            value = 1
        }

        for(var i =0; i < blockGroup.length; i++){
            if(!blockGroup.children[i].visible){
                var block = blockGroup.children[i]
                block.visible = true
                //block.shadow.visible = true
                block.body.x = x - WIDT_BLOCK/2
                block.body.y = y - WIDT_BLOCK/2
                //block.shadow.x = x
                //block.shadow.y = y+OFFSET_SHADOW
                block.body.enable = true
                block.text.setText(value)
                block.value = value
                //block.clear()
                
                if(value >=1 && value <=10){
                    block.loadTexture("atlas.game","bloque1")
                }
                else if(value >=11 && value <=20){
                    block.loadTexture("atlas.game","bloque2")
                }
                else if(value >=21 && value <=30){
                    block.loadTexture("atlas.game","bloque3")
                }
                else if(value >=31 && value <=40){
                    block.loadTexture("atlas.game","bloque4")
                }
                else if(value >=41 && value <=50){
                    block.loadTexture("atlas.game","bloque5") 
                }

                block.text.y = 0
                block.dotsArray.splice(0,block.dotsArray.length)

                return block
            }
        }

        if(endInitCreation){
            y-=WIDT_BLOCK/2
        }

        var block = blockGroup.create(0,0,"atlas.game","bloque1")
        block.x = x
        block.y = y
        block.anchor.setTo(0.5)
        if(value >=1 && value <=10){
            block.loadTexture("atlas.game","bloque1")
        }
        else if(value >=11 && value <=20){
            block.loadTexture("atlas.game","bloque2")
        }
        else if(value >=21 && value <=30){
            block.loadTexture("atlas.game","bloque3")
        }
        else if(value >=31 && value <=40){
            block.loadTexture("atlas.game","bloque4")
        }
        else if(value >=41 && value <=50){
            block.loadTexture("atlas.game","bloque5") 
        }

        blockGroup.add(block)
        block.value = value

        var fontStyle = {font: "48px Baloo", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var numberText = new Phaser.Text(sceneGroup.game, 0, 0, value, fontStyle)
        numberText.anchor.setTo(0.5)

        block.addChild(numberText)
        block.text = numberText

        game.physics.enable(block, Phaser.Physics.ARCADE);
        //block.body.collideWorldBounds = true
        block.body.setSize(WIDT_BLOCK-8,WIDT_BLOCK-8,13,13)
        block.body.bounce.setTo(0,0)
        block.body.immovable = true
        //block.body.offset.x = -WIDT_BLOCK/2
        //block.body.offset.y = -WIDT_BLOCK/2
        block.dotsArray = []

        /*block.shadow = getShadow()
        block.shadow.x = x
        if(endInitCreation){
            y+=WIDT_BLOCK/2
        }
        block.shadow.y = y + OFFSET_SHADOW*/

        return block
    }

    function createBackground(){

        game.physics.startSystem(Phaser.Physics.ARCADE);

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

        var line = game.add.sprite(0, 0, "atlas.game","wall");
        line.scale.setTo(WIDTH_LINE,game.world.height/line.height)
        wall.addChild(line)
        wall.line = line

        game.physics.enable(line, Phaser.Physics.ARCADE);
        line.body.immovable = true

        wall = game.add.graphics()
        wall.x = game.world.centerX - (WIDT_BLOCK*2.5)
        wall.drawRect(-wall.x,0,wall.x, game.world.height)
        sceneGroup.add(wall)
        walls.push(wall)

        line = game.add.sprite(0, 0, "atlas.game","wall");
        line.anchor.setTo(1,0)
        line.scale.setTo(WIDTH_LINE,game.world.height/line.height)
        wall.addChild(line)
        wall.line = line
        game.physics.enable(line, Phaser.Physics.ARCADE);
        line.body.immovable = true


        topWall = game.add.graphics()
        topWall.drawRect(0,0,game.world.width, 10)
        sceneGroup.add(topWall)
        game.physics.enable(topWall, Phaser.Physics.ARCADE);
        topWall.body.immovable = true


        shadowGroup = game.add.group()
        sceneGroup.add(shadowGroup)

        dotsGroup = game.add.group()
        sceneGroup.add(dotsGroup)

        blockGroup = game.add.group()
        sceneGroup.add(blockGroup)

        //initialBall = getBall(game.world.centerX,ballY)
        for(var i = 0; i < INITIAL_DOTS; i++){
            var dot = getDot(game.world.centerX,ballY)
            currentDots.push(dot)
        }

        while(currentY > 0){
            decideLine()
        }

        miniDots = game.add.group()

        for(var i =0; i < 20; i++ ){

            var d = miniDots.create(0,0,"atlas.game","dotLine")
            d.anchor.setTo(0.5)
            d.scale.setTo(0.7)
            miniDots.add(d)

        }

        sceneGroup.add(miniDots)

        endInitCreation = true

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

        //spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        animateScene()

        loadSounds()

        createObjects()
        createPointsBar()
        //createHearts()

        //setRound()

    }


    function render(){
        
        for(var i=0; i < blockGroup.length; i++){
            game.debug.body(blockGroup.children[i])
        }

        for(var i=0; i < dotsGroup.length; i++){
            game.debug.body(dotsGroup.children[i])
        }

        for(var i =0; i< walls.length; i++){
            game.debug.body(walls[i].line)
        }
    }

    
    return {
        assets: assets,
        name: "dotBlocks",
        create: create,
        preload: preload,
        update: update,
        //render:render
    }

}()

function lerp(a,b,t){
   return a + t * (b - a);
}
