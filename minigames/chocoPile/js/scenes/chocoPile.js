var soundsPath = "../../shared/minigames/sounds/"
var spinePath = "../../shared/minigames/images/spines/"
var chocoPile = function(){
    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/chocoPile/atlas.json",
                image: "images/chocoPile/atlas.png",
            },
        ],
        /*images: [
            {   name:"player",
                file: "images/skiZag/reloj.png"},
        ],*/
        sounds: [
            {   name: "magic",
                file: soundsPath + "magic.mp3"},
            {   name: "swipe",
                file: soundsPath + "swipe.mp3"},
            {   name: "wrong",
                file: soundsPath + "wrong.mp3"},
            {   name: "pop",
                file: soundsPath + "pop.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "explode",
                file: soundsPath + "explode.mp3"},
            
        ],
    }
    
    var INITIAL_LIVES = 1
    var INITIAL_VEL = 8
    var VEL = 4
    var VEL_X = 1.5
    var VEL_Y = 1
    var DELTA_VEL = 0

    var INITIAL_WIDTH = 207
    var INITIAL_HEIGHT = 359


    var DELTA_LEVEL = 25

    var TOLERANCE = 10

    var VEL_DOWN = 3

    var MAX_COMBO = 5
    var PLUS_BY_COMBO = 5
    
    var IMAGE_ANGLE = 30
    var COS_ANG = Math.cos(IMAGE_ANGLE*Math.PI/180)
    var SIN_ANG = Math.sin(IMAGE_ANGLE*Math.PI/180)
    var TAN_ANG = Math.tan(IMAGE_ANGLE*Math.PI/180)

    //var BACKGROUND_COLORS = [0x515b75,0xe8c28b,0xc56d2a,0xb76022,0x283b56,]
    var BACKGROUND_COLORS = [0x1d2f49,0x283b56,0xb76022,0xc56d2a,0xe8c28b,0x515b75,0x1d2f49]

    var LIMIT_Y 

    var gameIndex = 23
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = true
    var valuesList = null
    var objectsGroup
    var pointsBar = null

    var lives = null
    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var initialTap

    var currentChocolate
    var chocolatesGroup
    var downChocolatesFront
    var downChocolatesBack

    var currentPosition
    var currentOffset
    var currentSize

    var tapDown

    var rigthSide 

    var bmd
    var mask
    var bmdDown
    var chocolateSprite
    var currentvel

    var maskData

    var rightX
    var leftX
    var pointPlus
    var currentCombo 

    var backgroundImage

    var cityImage
    var neblina

	var clouds =[]

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
    	console.log(COS_ANG,SIN_ANG)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        initialTap = true

        currentPosition = {x: 0, y: 0}
        currentOffset = {x:0, y:0}
        currentSize = {width:INITIAL_WIDTH, height:INITIAL_HEIGHT}

        tapDown = false
        rigthSide = true

        currentvel = {x:0,y:0}
        pointPlus = {x:game.world.centerX,y:game.world.centerY+100}
        currentCombo = 0
        VEL = INITIAL_VEL
        LIMIT_Y = game.world.height + 100
        
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
            marioSong = sound.setSong(soundsPath + 'songs/funky_monkey.mp3',0.3)
        }else{
            game.load.audio('arcadeSong', soundsPath + 'songs/funky_monkey.mp3');
        }

        /*game.load.image('chocolate','images/chocoPile/barra_chocolate.png')

        game.load.image('city','images/chocoPile/ciudad.png')

        game.load.image('neblina','images/chocoPile/neblina.png')

        game.load.image('cloud1','images/chocoPile/neblina.png')
        game.load.image('cloud2','images/chocoPile/neblina.png')*/

        /*var fontStyle = {font: "30px AvenirHeavy", fontWeight: "bold", fill: "#000000", align: "center"}
        var text = new Phaser.Text(game, 0, 10, "2", fontStyle)
        text.visible = false*/

        maskData = []

    }

    
    function stopGame(win){
        heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        createPart('wrong', pointPlus)

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
        
        sound.play("pop")
        createPart('star', obj)
        createTextPart('+' + number, obj)
        
        pointsBar.number+= number

        pointsBar.text.setText(pointsBar.number)
   
    }

    
    function update(){

        //moveBackground(50)

        for(var i = 0 ; i < clouds.length; i++){
        	if(clouds[i].y >-100){
	        	clouds[i].x += clouds[i].vel

	        	if(clouds[i].vel<0 && clouds[i].x<-100){
	        		clouds[i].x=game.world.width+100
	        	}
	        	else if(clouds[i].vel>0 && clouds[i].x>game.world.width+100){
	        		clouds[i].x=-100
	        	}
	        }
        }
        
        for(var i = 0; i < downChocolatesFront.length; i++){
            if(downChocolatesFront.children[i].visible){
                downChocolatesFront.children[i].y +=VEL_DOWN
                //downChocolates.children[i].alpha -= 0.01


                /*if(downChocolatesFront.children[i].alpha <=0){
                    downChocolatesFront.children[i].visible = false
                    downChocolates.destroy()
                }*/

                if(downChocolatesFront.children[i].y>=game.world.height){
                    var chocolateRemove = downChocolatesFront.children[i]
                    chocolateRemove.visible = false

                    downChocolatesFront.remove(chocolateRemove)
                    chocolateRemove.destroy()
                }
            }
        }

        for(var i = 0; i < downChocolatesBack.length; i++){
            if(downChocolatesBack.children[i].visible){
                downChocolatesBack.children[i].y +=VEL_DOWN
                //downChocolates.children[i].alpha -= 0.01


                /*if(downChocolatesFront.children[i].alpha <=0){
                    downChocolatesFront.children[i].visible = false
                    downChocolates.destroy()
                }*/

                if(downChocolatesBack.children[i].y>=game.world.height){
                    var chocolateRemove = downChocolatesBack.children[i]
                    chocolateRemove.visible = false

                    downChocolatesBack.remove(chocolateRemove)
                    chocolateRemove.destroy()
                }
            }
        }
        
        if(gameActive == false){
            return
        }

        if(game.input.activePointer.isDown){
            if(!tapDown){
                tapDown = true
                Tap()
            }
        }
        else{
            tapDown = false
        }

        if(currentChocolate!=null){
            //console.log("Updqate chocolate")
            currentChocolate.y += currentvel.y
            currentChocolate.x += currentvel.x

            if(currentChocolate.x<=-200 && currentvel.x<0){
                currentvel.x = -currentvel.x
                currentvel.y = -currentvel.y
            }
            else if(currentChocolate.x >=game.world.width-200 && currentvel.x>0){
                currentvel.x = -currentvel.x
                currentvel.y = -currentvel.y
            }
        }

        

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
    
    function createObjects(){
        
        particlesGroup = game.add.group()
        sceneGroup.add(particlesGroup)
        
        particlesUsed = game.add.group()
        sceneGroup.add(particlesUsed)
        
        createParticles('star',5)
        createParticles('wrong',1)
        createParticles('text',8)
                
    }

    function Tap(){

        VEL+=DELTA_VEL
        VEL_X = VEL*COS_ANG
        VEL_Y = VEL*SIN_ANG


        if(currentChocolate.x <= currentPosition.x + TOLERANCE && currentChocolate.x >= currentPosition.x - TOLERANCE){
            if(currentChocolate.y <= currentPosition.y -DELTA_LEVEL + TOLERANCE && currentChocolate.y >= currentPosition.y -DELTA_LEVEL - TOLERANCE){
                //Perfect Tap
                currentChocolate.x = currentPosition.x
                currentChocolate.y = currentPosition.y- DELTA_LEVEL
                
                if(currentCombo<MAX_COMBO){
                    currentCombo++
                
                }
                else{

                    currentChocolate.destroy()
                    for(var i = 0; i < maskData.length; i++){
                        if(maskData[i]>PLUS_BY_COMBO){
                            maskData[i] -= PLUS_BY_COMBO
                        }
                    }

                    currentChocolate = createChocolate(currentChocolate.x,currentChocolate.y,currentSize.width,currentSize.height,maskData[0],maskData[1],maskData[2],maskData[3])
                }

                addPoint(currentCombo,pointPlus)
                nextChocolate()
                
                return
            }
        }

        currentCombo = 0

        if(currentChocolate.x < currentPosition.x - (currentSize.height*SIN_ANG) || currentChocolate.x > currentPosition.x + (currentSize.height*SIN_ANG)){
           
            
            if(currentChocolate.x > currentPosition.x){
                if(currentChocolate.y < currentPosition.y - DELTA_LEVEL){
                     downChocolatesBack.add(currentChocolate)
                }
                else{
                     downChocolatesFront.add(currentChocolate)
                }
            }
            else{
                if(currentChocolate.y < currentPosition.y - DELTA_LEVEL){
                     downChocolatesFront.add(currentChocolate)
                }
                else{
                     downChocolatesBack.add(currentChocolate)
                }
            }
            currentChocolate = null
            stopGame()
            return
        }

        if(currentChocolate.x > currentPosition.x){
            if(currentChocolate.y < currentPosition.y - DELTA_LEVEL){
                //x- y-

                currentChocolate.destroy()

                var width = (currentChocolate.x - currentPosition.x)
                //currentPosition.x = currentChocolate.x
                //currentPosition.y = currentPosition.y

                currentSize.width -= width

                if(currentSize.width<TOLERANCE){
                    downChocolatesBack.add(currentChocolate)
                    currentChocolate = null
                    stopGame()
                    return
                }
                
                //currentChocolate.destroy()

                var lastChocolate = currentChocolate

                //console.log(width)

                //changeBitmap(1,width)
                currentChocolate = createChocolate(currentChocolate.x,currentChocolate.y,currentSize.width,currentSize.height,maskData[0],maskData[1]+width,maskData[2],maskData[3])
                if(currentChocolate==null){
                    downChocolatesBack.add(lastChocolate)
                    stopGame()
                    return
                }
                else{
                    lastChocolate.destroy()
                }
                var downC = createChocolate(currentChocolate.x,currentChocolate.y,currentSize.width,currentSize.height,maskData[0]+currentSize.width,maskData[1],maskData[2],maskData[3])
                if(downC!=null){
                    downChocolatesBack.add(downC)
                }
                maskData[0] += width
                addPoint(1,pointPlus)
                nextChocolate()
                
            }
            else{

                //x- y+

                //currentChocolate.destroy()

                var height = (currentChocolate.y - (currentPosition.y-DELTA_LEVEL))/SIN_ANG
                //currentPosition.x = currentChocolate.x
                //currentPosition.y = currentPosition.y

                currentSize.height -= height

                if(currentSize.height*SIN_ANG<TOLERANCE){
                    downChocolatesFront.add(currentChocolate)
                    currentChocolate = null
                    stopGame()
                    return
                }

                

                 //currentChocolate.destroy()
                 var lastChocolate = currentChocolate
                //console.log(height)

                //changeBitmap(1,width)
                currentChocolate = createChocolate(currentChocolate.x,currentChocolate.y,currentSize.width,currentSize.height,maskData[0],maskData[1],maskData[2],maskData[3]+height)
                if(currentChocolate==null){
                    downChocolatesFront.add(lastChocolate)
                    stopGame()
                    return
                }
                else{
                    lastChocolate.destroy()
                }
                var downC = createChocolate(currentChocolate.x,currentChocolate.y,currentSize.width,currentSize.height,maskData[0],maskData[1],maskData[2]+currentSize.height*SIN_ANG,maskData[3])
                if(downC!=null){
                    downChocolatesFront.add(downC)
                }
                maskData[2] += height
                addPoint(1,pointPlus)
                nextChocolate()

            }
        }
        else{
            if(currentChocolate.y < currentPosition.y - DELTA_LEVEL){
                //x+ y-

                

                var height = ((currentPosition.y-DELTA_LEVEL) - currentChocolate.y)/SIN_ANG
                //currentPosition.x = currentChocolate.x
                //currentPosition.y = currentPosition.y

                currentSize.height -= height

                if(currentSize.height*SIN_ANG<TOLERANCE){
                    downChocolatesBack.add(currentChocolate)
                    currentChocolate = null
                    stopGame()
                    return
                }
                
                //currentChocolate.destroy()
                var lastChocolate = currentChocolate
                //console.log(height)

                //changeBitmap(1,width)
                currentChocolate = createChocolate(currentChocolate.x,currentChocolate.y,currentSize.width,currentSize.height,maskData[0],maskData[1],maskData[2]+height,maskData[3])
                if(currentChocolate==null){
                    downChocolatesBack.add(lastChocolate)
                    stopGame()
                    return
                }
                else{
                    lastChocolate.destroy()
                }
                var downC = createChocolate(currentChocolate.x,currentChocolate.y,currentSize.width,currentSize.height,maskData[0],maskData[1],maskData[2],maskData[3]+currentSize.height*SIN_ANG)
                if(downC!=null){
                    downChocolatesBack.add(downC)
                }
                maskData[3] += height
                addPoint(1,pointPlus)
                nextChocolate()
            }
            else{
                //x+ y+

               

                var width = (currentPosition.x - currentChocolate.x)
                //currentPosition.x = currentChocolate.x
                //currentPosition.y = currentPosition.y

                currentSize.width -= width

                if(currentSize.width<TOLERANCE){
                    downChocolatesFront.add(currentChocolate)
                    currentChocolate = null
                    stopGame()
                    return
                }
                
                 //currentChocolate.destroy()
                //console.log(width)

                var lastChocolate = currentChocolate
                //changeBitmap(1,width)
                currentChocolate = createChocolate(currentChocolate.x,currentChocolate.y,currentSize.width,currentSize.height,maskData[0]+width,maskData[1],maskData[2],maskData[3])
                if(currentChocolate==null){
                    downChocolatesFront.add(lastChocolate)
                    stopGame()
                    return
                }
                else{
                    lastChocolate.destroy()
                }
                var downC = createChocolate(currentChocolate.x,currentChocolate.y,currentSize.width,currentSize.height,maskData[0],maskData[1]+currentSize.width,maskData[2],maskData[3])
                if(downC!=null){
                    downChocolatesFront.add(downC)
                }
                maskData[1] += width
                addPoint(1,pointPlus)
                nextChocolate()
            }


        }

        console.log(maskData,currentSize)


    }

    function nextChocolate(){
        chocolatesGroup.add(currentChocolate)
        rigthSide = !rigthSide
        var x = leftX
        if(rigthSide){
            currentvel.x = -VEL_X
            currentvel.y = VEL_Y
            x = rightX
        }
        else{
            currentvel.x = VEL_X
            currentvel.y = VEL_Y
            //x = 
        }


        currentChocolate = createChocolate(x,game.world.centerY-100,currentSize.width,currentSize.height,maskData[0],maskData[1],maskData[2],maskData[3])
        //moveGroupY(chocolatesGroup,DELTA_LEVEL,game.world.height)
        moveTweenGroup(chocolatesGroup,DELTA_LEVEL,500,LIMIT_Y)
        moveBackground(30)
    }



    function moveGroupY(group,vel,limit){
        for(var i = 0; i < group.length; i++){
            if(group.children[i].visible){
                group.children[i].y += vel

                

                if(group.children[i].y >= limit){
                    var obj = group.children[i]
                    obj.visible = false
                    group.remove(obj)
                    obj.destroy()
                }
            }
        }
     }

    function moveTweenGroup(group,vel,time,limit){
        for(var i = 0; i < group.length; i++){
            if(group.children[i].visible){
                
                if(group.children[i].y + vel >= limit){
                    var obj = group.children[i]
                    obj.visible = false
                    group.remove(obj)
                    obj.destroy()
                }
                else{
                    game.add.tween(group.children[i]).to({y:group.children[i].y+vel},time,Phaser.Easing.linear,true)
                }
            }
        }
    }

     

     function createChocolate(x,y,width,height,leftMask,rightMask,upMask,downMask){

        //upMask = 0

        //downMask = 0
        
        var deltaR = rightMask
        //leftMask = INITIAL_WIDTH - leftMask
        rightMask = INITIAL_WIDTH - rightMask
        //upMask = INITIAL_HEIGHT - upMask
        downMask = INITIAL_HEIGHT - downMask



        var w = rightMask - leftMask
        var h = downMask - upMask

        if(w<TOLERANCE){
            console.log("Error null w ")
            return null
        }

        if(h*SIN_ANG < TOLERANCE){
             console.log("Error null h")
             return null
        }

        var initialY = leftMask*TAN_ANG
        var initialYDown = deltaR*TAN_ANG

        if(upMask+initialY > downMask-(w*TAN_ANG)-initialYDown){
            console.log("Faltal error")
            return null
        }

        var chocolateGroup = game.add.group()
        chocolateGroup.angle = -60
        chocolateGroup.x = x
        chocolateGroup.y = y
        var chocolate = game.add.sprite(0,0,'atlas.game','barra_chocolate')

        //if(h<0 || w<0 || rightMask <= 0 || leftMask>=INITIAL_WIDTH || downMask<=0 || upMask>=INITIAL_HEIGHT){
            //console.log("error ",w,h)
        //}


        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF0000);
        graphics.moveTo(leftMask,upMask+initialY);
        graphics.lineTo(leftMask,downMask-(w*TAN_ANG)-initialYDown)
        graphics.lineTo(rightMask,downMask-initialYDown)
        graphics.lineTo(rightMask,upMask+(w*TAN_ANG)+ initialY)
        graphics.lineTo(leftMask,upMask+initialY)
        graphics.endFill();

        chocolate.mask = graphics
        chocolate.addChild(graphics)
        chocolateGroup.add(chocolate)

        var tile_1 = game.add.graphics();
        tile_1.beginFill(0x7a473d);
        tile_1.moveTo(leftMask+1,upMask+initialY)
        tile_1.lineTo(leftMask-20,upMask+initialY+10)
        tile_1.lineTo(leftMask-20,downMask-(w*TAN_ANG)-initialYDown+10)
        tile_1.lineTo(leftMask+1,downMask-(w*TAN_ANG)-initialYDown)
        tile_1.lineTo(leftMask+1,upMask+initialY)
        tile_1.endFill();
        //tile_1.angle = 90

        var tile_2 = game.add.graphics();
        tile_2.beginFill(0x966357);
        tile_2.moveTo(leftMask,downMask-(w*TAN_ANG)-initialYDown-1)
        tile_2.lineTo(leftMask-19,downMask-(w*TAN_ANG)-initialYDown+10)
        tile_2.lineTo(rightMask-19,downMask-initialYDown+10)
        tile_2.lineTo(rightMask,downMask-initialYDown-1)
        tile_2.lineTo(leftMask,downMask-(w*TAN_ANG)-initialYDown-1)
        tile_2.endFill();
        //tile_2.y = width+18


        //chocolate.addChild(tile_1)
        //chocolate.addChild(tile_2)
        chocolateGroup.add(tile_1)
        chocolateGroup.add(tile_2)

        return chocolateGroup
     }

     function initialChocolate(){
        downChocolatesBack = game.add.group()
        sceneGroup.add(downChocolatesBack)

        chocolatesGroup = game.add.group()
        sceneGroup.add(chocolatesGroup)

        downChocolatesFront = game.add.group()
        sceneGroup.add(downChocolatesFront)
        
        var frames = (game.world.centerX+200)/VEL_X

        rightX = (game.world.centerX-200)+(VEL_X*frames)
        leftX = (game.world.centerX-200)-(VEL_X*frames)

        for(var i = 0; i <30; i ++){
            moveGroupY(chocolatesGroup,DELTA_LEVEL,LIMIT_Y)
            var c = createChocolate(game.world.width +currentvel.x*frames,game.world.centerY-100+(currentvel.y*frames)+DELTA_LEVEL,INITIAL_WIDTH,INITIAL_HEIGHT,0,0,0,0)
            chocolatesGroup.add(c)

        }
        

        currentPosition.x = c.x
        currentPosition.y = c.y
     }

     function moveBackground(vel){
        for(var i = 0; i < backgroundImage.length; i++){
        	//backgroundImage[i].y+=vel
            game.add.tween(backgroundImage).to({y:backgroundImage[i].y+vel},500,Phaser.Easing.linear,true)
            if(backgroundImage[i].y > game.world.height){
            	backgroundImage[i].y -= backgroundImage[i].height*backgroundImage.length

            }

        }
        if(cityImage.visible){
        	//cityImage.y+=vel
        	game.add.tween(cityImage).to({y:cityImage.y+vel},500,Phaser.Easing.linear,true)
        	if(cityImage.y > game.world.height*2){
        		cityImage.visible = false
        	}
    	}

    	for(var i = 0; i < clouds.length; i++){
    		//clouds[i].y+=vel

    		game.add.tween(clouds).to({y:clouds.y+vel},500,Phaser.Easing.linear,true)
    		if(clouds[i].y > game.world.height+100){
        		clouds[i].y -= backgroundImage[0].height*backgroundImage.length
        	}
    	}






     }

    function create(){

        
        sceneGroup = game.add.group()



        //var bmd = game.add.bitmapData(2, game.world.height*(BACKGROUND_COLORS.length+4))
        var bmd = game.add.bitmapData(2, (game.world.height/4)*(BACKGROUND_COLORS.length-1))

        //bmd.addToWorld()
        //sceneGroup.add(bmd)
        backgroundImage = []
        //sceneGroup.add(backgroundImage)
        //var i = 1
        var y = 0;
        var imageY = 0

        for(var i = 1; i < BACKGROUND_COLORS.length; i++){

            for (var j = 0; j <= game.world.height/8; j++)
            {
                var c = Phaser.Color.interpolateColor(BACKGROUND_COLORS[i-1], BACKGROUND_COLORS[i], game.world.height/8, j);

                // console.log(Phaser.Color.getWebRGB(c));

                bmd.rect(0, y+imageY, 2, imageY+y+1, Phaser.Color.getWebRGB(c));

                //out.push(Phaser.Color.getWebRGB(c));

                y += 1;
            }
            imageY+=game.world.height/8
            
        }

        /*var backSprite = sceneGroup.create(0,-game.world.height*(BACKGROUND_COLORS.length+3),bmd)
        backSprite.scale.setTo(game.world.width/2,1)
        //imageY+=game.world.height
        //backgroundImage.add(backSprite)
        backgroundImage.push(backSprite)

        var backSprite2 = sceneGroup.create(0,-(game.world.height*(BACKGROUND_COLORS.length+3))-(game.world.height*(BACKGROUND_COLORS.length+4)),bmd)
        //backgroundImage.add(backSprite)
        backSprite2.scale.setTo(game.world.width/2,1)
        backgroundImage.push(backSprite2)*/

        var backSprite = sceneGroup.create(0,-(game.world.height)*(BACKGROUND_COLORS.length-2)+((game.world.height)*(BACKGROUND_COLORS.length-1)/4),bmd)
        backSprite.scale.setTo(game.world.width/2,3)

        //imageY+=game.world.height
        //backgroundImage.add(backSprite)
        backgroundImage.push(backSprite)

        var backSprite2 = sceneGroup.create(0,backSprite.y-backSprite.height,bmd)
        //backgroundImage.add(backSprite)
        backSprite2.scale.setTo(game.world.width/2,3)
        backgroundImage.push(backSprite2)

        cityImage = sceneGroup.create(game.world.centerX,game.world.height,'atlas.game','ciudad')
        cityImage.anchor.setTo(0.5,1)
        cityImage.scale.setTo(1.2,1.2)

        loadSounds()
        initialize()  

        //backSprite.y = 0
        //backSprite.scale.setTo(0.05)


        objectsGroup = game.add.group()
        sceneGroup.add(objectsGroup)

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

        

        createPointsBar()
        createHearts()

        

        VEL_X = VEL*COS_ANG
        VEL_Y = VEL*SIN_ANG

        currentvel.x = -VEL_X
        currentvel.y = VEL_Y

        maskData.push(0)
        maskData.push(0)
        maskData.push(0)
        maskData.push(0)

        var cloud = sceneGroup.create(game.world.centerX,-game.world.height*2,'atlas.game','nube1')
        cloud.anchor.setTo(0.5,0.5)
        cloud.vel = -5
        clouds.push(cloud)

        cloud = sceneGroup.create(game.world.centerX,-game.world.height*2+100,'atlas.game','nube1')
        cloud.anchor.setTo(0.5,0.5)
        cloud.vel = 10
        clouds.push(cloud)

        cloud = sceneGroup.create(game.world.centerX,-game.world.height*2+150,'atlas.game','nube1')
        cloud.anchor.setTo(0.5,0.5)
        cloud.vel = 3
        clouds.push(cloud)



        initialChocolate()




      	var neblina_1=sceneGroup.create(game.world.centerX+100,game.world.height+100,'atlas.game','neblina')
      	neblina_1.anchor.setTo(0.5,1)


      	var neblina_2=sceneGroup.create(game.world.centerX-100,game.world.height+100,'atlas.game','neblina')
      	neblina_2.anchor.setTo(0.5,1)
      	neblina_2.scale.setTo(-1,1)




       	currentChocolate = createChocolate(rightX,game.world.centerY-100,INITIAL_WIDTH,INITIAL_HEIGHT,0,0,0,0)
        createObjects()
        animateScene()

    }

    
    return {
        assets: assets,
        name: "chocoPile",
        create: create,
        preload: preload,
        update: update,
    }
}()