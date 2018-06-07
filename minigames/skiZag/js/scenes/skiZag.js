var soundsPath = "../../shared/minigames/sounds/"
var spinePath = "../../shared/minigames/images/spines/"
var skiZag = function(){
    assets = {
        atlases: [
            {   
                name: "atlas.skiZag",
                json: "images/skiZag/atlas.json",
                image: "images/skiZag/atlas.png",
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
    var VEL = 280
    var VEL_X 
    var VEL_Y
    var INITIAL_POS_Y
    var ANGLE_LINE = 30
    var COS_ANG
    var SIN_ANG
    var TILE_HEIGTH = 40
    var CORRECT_OFFSET = 80
    var MAX_TILE_Y
    var MIN_RAIL_ENEMIES = 15
    var DISTANCE_RAIL_ENEMIES = 1300
    var MAX_COINS_IN_LINE = 2
    var COIN_PROBABILITY = 0.4
    var WAIT_FRAMES = 9
    var WAIT_SNOW = 7000
    var DELTA_WAIT_SNOW = 600
    var LINE_VELOCITY = 2.1
    var WIDTH_PER_TILE = 100

    var skinTable
    
    var gameIndex = 20
    var gameId = 5766289444306944
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

    var player
    var playerSprite 
    var spinePlayer
    var SPINE_SCALE = 0.4
    var tapDown

    var obstaclesGroup
    var coinsGroup
    var currentAngle
    var currentY
    var currentX

    var lastTile
    var currentRails

    var initialTap
    var bitmap
    var trailImage
    var currentWaitFrames


    var trailsLinearGroup
    var trailsCurveGroup
    var trailsSnowGroup

    var yetisGroup
    var snowBallGroup
    var init
    var name
    var treesBackground
    var snowBackground

    var inYetiZone
    var inSnowZone

    var lastEnemy

    var bitmapsLeft
    var bitmapsRigth

    var leftSprite
    var rigthSprite


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
        tapDown = false
        INITIAL_POS_Y = game.world.centerY+200

        COS_ANG = Math.cos(ANGLE_LINE*(Math.PI/180))
        SIN_ANG = Math.sin(ANGLE_LINE*(Math.PI/180))
        VEL_X = (COS_ANG*VEL)
        VEL_Y = (SIN_ANG*VEL)
        VEL_Y -= VEL_Y*0.082
        MAX_TILE_Y = game.world.height
        currentRails=0
        initialTap = true
        currentWaitFrames = 0

        lastEnemy = null
        inYetiZone = false
        inSnowZone = false

        bitmapsLeft = []
        bitmapsRigth = []
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
        game.load.spine('mascot', "images/spines/amazing/amazing.json");
        game.load.spine('yetiSpine', "images/spines/Yeti/yeti.json");
                
        if(amazing.getMinigameId()){
            marioSong = sound.setSong(soundsPath + 'songs/retrowave.mp3',0.3)
        }else{
            game.load.audio('arcadeSong', soundsPath + 'songs/retrowave.mp3');
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
        
        sound.play("pop")
        createPart('star', obj)
        createTextPart('+' + number, obj)
        
        pointsBar.number+= number

        pointsBar.text.setText(pointsBar.number)
   
    }


    
    function update(){
        
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

        if(lastTile!=null){
            var maxY = lastTile.body.y + ((lastTile.width/2)*SIN_ANG)
            //var maxY = lastTile.y + ((lastTile.width/2)*SIN_ANG)
            //var maxY = lastTile.y
            //console.log(maxY)
            if(maxY<MAX_TILE_Y){
                var isEnemies = false
                if(currentRails > MIN_RAIL_ENEMIES){
                    var r = game.rnd.frac()
                    if(r > 0.5){
                        isEnemies = true
                    }

                }

                currentY = maxY

                if(!isEnemies){
                    
                    setPoint()
                    currentRails++
                }
                else{
                    currentRails = 0
                    createEnemiesZone()
                }
            }

        }
        var snowCanTrail = false

        if(player!=null){
            spinePlayer.x = player.body.x
           /* if(player.scale.x<0 ){
                if(spinePlayer.scale.x!=-SPINE_SCALE){
                    
                }
            }
            else{
                if(spinePlayer.scale.x!=SPINE_SCALE){
                    spinePlayer.scale.setTo(SPINE_SCALE,SPINE_SCALE)
                }
            }*/
        }


        if(!initialTap){

            //bitmap.clear(0, game.height, game.width, game.height+20) 
            //bitmap.moveV(-2 * 0.6)
            currentWaitFrames ++
            if(currentWaitFrames > WAIT_FRAMES){
                currentWaitFrames = 0
                //bitmap.draw(trailImage,player.body.x,player.body.y)
                SetObject(trailsLinearGroup,'Camino_Meizy',player.body.x,player.body.y,player.scale.x)
                snowCanTrail = true
            }
            if(init.y > -200){
	            init.y+=-LINE_VELOCITY
	            name.y+=-LINE_VELOCITY
	        }
            moveGroupY(trailsLinearGroup,-LINE_VELOCITY,-100)
            //moveGroupY(trailsCurveGroup,-LINE_VELOCITY,-100)
            //

            for(var i = 0; i < treesBackground.length; i++){
                if(treesBackground.children[i].visible){
                    if(treesBackground.children[i].y < -50){
                        treesBackground.children[i].visible = false
                    }
                    else{
                        treesBackground.children[i].y +=-LINE_VELOCITY
                    }
                }
            }

            for(var i = 0; i < snowBackground.length; i++){
                if(snowBackground.children[i].visible){
                    if(snowBackground.children[i].y < -50){
                        snowBackground.children[i].visible = false
                    }
                    else{
                        snowBackground.children[i].y +=-LINE_VELOCITY
                    }
                }
            }

            if(obstaclesGroup!=null){
                for(var i = 0; i < obstaclesGroup.length; i++){
                    var obstcaleY = obstaclesGroup.children[i].body.y + ((obstaclesGroup.children[i].width/2)*SIN_ANG)
                    //obstaclesGroup.children[i].y +=-LINE_VELOCITY
                    //var obstcaleY = obstaclesGroup.children[i].y + ((obstaclesGroup.children[i].width/2)*SIN_ANG)
                    if(obstcaleY < 0){
                        obstaclesGroup.children[i].visible = false
                        obstaclesGroup.children[i].body.setZeroVelocity()
                    }
                }
            }


        //return

        if(yetisGroup!=null){
            if(inYetiZone){
                
                if(!lastEnemy.visible){
                    inYetiZone = false
                }

                for(var i = 0; i < yetisGroup.length; i++){
                    if(yetisGroup.children[i].visible){
                        yetisGroup.children[i].spine.visible = true
                        if(yetisGroup.children[i].y < 0){
                            yetisGroup.children[i].visible = false
                            yetisGroup.children[i].spine.visible = false
                            yetisGroup.children[i].body.setZeroVelocity()
                        }

                        if(yetisGroup.children[i].direction == 1){
                            if(yetisGroup.children[i].body.x > yetisGroup.children[i].nextX){
                                yetisGroup.children[i].body.setZeroVelocity()
                                yetisGroup.children[i].body.velocity.x = -VEL_X
                                yetisGroup.children[i].body.velocity.y = -VEL_Y
                                yetisGroup.children[i].direction = -1
                                yetisGroup.children[i].nextX = game.rnd.integerInRange(100,yetisGroup.children[i].body.x-100)
                            }
                        }
                        else{
                            if(yetisGroup.children[i].body.x < yetisGroup.children[i].nextX){
                                yetisGroup.children[i].body.setZeroVelocity()
                                yetisGroup.children[i].body.velocity.x = VEL_X
                                yetisGroup.children[i].body.velocity.y = -VEL_Y
                                yetisGroup.children[i].direction = 1
                                yetisGroup.children[i].nextX = game.rnd.integerInRange(yetisGroup.children[i].body.x+100, game.world.width-100)
                            }
                        }

                        yetisGroup.children[i].spine.x = yetisGroup.children[i].body.x
                        yetisGroup.children[i].spine.y = yetisGroup.children[i].body.y +70
                    }
                }
            }
        }

        if(snowBallGroup!=null){

            if(inSnowZone){

                if(!lastEnemy.visible){
                    inSnowZone = false
                }

                for(var i = 0; i < snowBallGroup.length; i++){
                    if(snowBallGroup.children[i].visible){

                        if(snowBallGroup.children[i].y < 0){
                            //console.log(snowBallGroup.children[i].y,snowBallGroup.children[i].deltaWait,game.time.now, snowBallGroup.children[i].body.velocity.y)
                            snowBallGroup.children[i].visible = false
                            snowBallGroup.children[i].body.setZeroVelocity()
                        }

                        if(snowBallGroup.children[i].deltaWait==-1){
                            snowBallGroup.children[i].angle+=Math.PI/40
                            if(snowCanTrail){
                                SetObject(trailsSnowGroup,'camino_nieve',snowBallGroup.children[i].body.x,snowBallGroup.children[i].body.y,1)
                            }
                        }
                        else{
                            
                            if(snowBallGroup.children[i].deltaWait < game.time.now){
                               
                                //snowBallGroup.children[i].body.x = game.world.centerX
                                if(snowBallGroup.children[i].body.x <0){
                                    snowBallGroup.children[i].body.velocity.x = VEL_X
                                }
                                else{
                                    snowBallGroup.children[i].body.velocity.x = -VEL_X
                                }
                                snowBallGroup.children[i].deltaWait = -1
                            }
                        }
                    }


                }

                moveGroupY(trailsSnowGroup,-LINE_VELOCITY,-100)
            }
        }
        

    }

    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(0,10,'atlas.skiZag','xpcoins')
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

        group.create(0,0,'atlas.skiZag','life_box')

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

    function setExplosion(obj,offsetY){
        
        var offY = offsetY || 0

        //var exp = sceneGroup.create(0,0,'atlas.skiZag','explosion')
        //exp.x = obj.x
        //exp.y = obj.y + offY
        //exp.anchor.setTo(0.5,0.5)

        //exp.scale.setTo(6,6)
        //game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        //var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        starParticles(obj,'smoke')
        
    }
    
    function starParticles(obj,idString){
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.skiZag',idString);
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
                particle = particlesGroup.create(-200,0,'atlas.skiZag',tag)
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

        if(!initialTap){
            var xScale = -player.scale.x
            var xSpine = - spinePlayer.scale.x
            //player.body.angle = - player.body.angle
            player.scale.setTo(xScale,1)
            spinePlayer.scale.setTo(xSpine,SPINE_SCALE)
            //SetObject(trailsCurveGroup,'coin',player.body.x,player.body.y, player.body.angle)
        }
        else{
            for(var i = 0; i < obstaclesGroup.length; i++){
                if(obstaclesGroup.children[i].visible){
                    obstaclesGroup.children[i].body.velocity.y = -VEL_Y
                }
            }

            for(var i = 0; i < coinsGroup.length; i++){
                if(coinsGroup.children[i].visible){
                    coinsGroup.children[i].body.velocity.y = -VEL_Y
                }
            }

            spinePlayer.setAnimationByName(0, "IDLE", true);
            initialTap = false
        }

        player.body.setZeroVelocity()
        if(player.scale.x>0){
            player.body.velocity.x = -VEL_X
        }
        else{
            player.body.velocity.x = VEL_X
        }
        
    }


    function createObstacles(){
        obstaclesGroup = game.add.group()
        sceneGroup.add(obstaclesGroup)
    }

    function createSingleObstacle(type,width){



        var line
        
        /*if(type == -1){
           line = game.add.tileSprite(0,0,100,TILE_HEIGTH,'atlas.skiZag','barra_h1')
        }
        else{
            line = game.add.tileSprite(0,0,100,TILE_HEIGTH,'atlas.skiZag','barra_h1_flip')
        }*/
        var index = (width/WIDTH_PER_TILE)-1
        if(index>=bitmapsLeft.length){
            console.log("Error "+index)
        }

        if(type == -1){
           line = game.add.sprite(0,0,bitmapsLeft[index])
        }
        else{
            line = game.add.sprite(0,0,bitmapsRigth[index])
        }

        //line.scale.setTo(100/line.width,TILE_HEIGTH/line.height)

        line.anchor.setTo(0)
        line.type = type
        obstaclesGroup.add(line)
        line.visible = false

        game.physics.p2.enable(line, false);
        line.body.angle = 90
        line.body.x = game.world.width
        line.body.velocity.y = 0
        line.body.static = true
        line.body.name = "obstacle"

        //line.x = game.world.width


        return line

    }

    function getObstacle(ang,width){
        for(var i = 0; i < obstaclesGroup.length; i++){
            if(!obstaclesGroup.children[i].visible){
                if(obstaclesGroup.children[i].type == ang){
                    obstaclesGroup.children[i].visible = true
                    var index = (width/WIDTH_PER_TILE)-1
                    //console.log("Change texture",index)
                    if(ang==-1){
                        obstaclesGroup.children[i].loadTexture(bitmapsLeft[index])
                    }
                    else{
                        obstaclesGroup.children[i].loadTexture(bitmapsRigth[index])
                    }
                    obstaclesGroup.children[i].body.setZeroVelocity()
                    if(!initialTap){
                        obstaclesGroup.children[i].body.velocity.y = -VEL_Y
                    }
                    return obstaclesGroup.children[i]
                }
            }
        }

        var line = createSingleObstacle(ang,width)
        line.visible = true
        line.body.setZeroVelocity()
        if(!initialTap){
            line.body.velocity.y = -VEL_Y
        }
        return line
    }


    function setPoint(){
        currentAngle*=-1
        var limitX 

        if(currentAngle > 0){
            limitX = game.world.width - CORRECT_OFFSET*2
        }
        else{
            limitX = CORRECT_OFFSET * 2
        }

        var deltaX = Math.abs(currentX - limitX)

        var r = deltaX/COS_ANG
        var limitY = r*SIN_ANG

        var randomY = game.rnd.integerInRange(50,limitY)
        var newR = randomY/SIN_ANG
        newR = Math.floor(newR)
        var module = newR%WIDTH_PER_TILE
        //console.log("First R", newR)
        if(module!=0){
        	//console.log(module)
        	if(module>(WIDTH_PER_TILE/2)){
        		//redondear hacia arriba
        		newR+=(WIDTH_PER_TILE - module)
        	}
        	else{
        		//redondear hacia abajo
        		newR-=module
        	}
        }
        console.log("Second R",newR)

        var nextX = currentX + (newR*COS_ANG*currentAngle)

        var leftLine = SetLine(currentAngle,newR,currentX,currentY,-1,false)
        var rightLine = SetLine(currentAngle,newR,currentX,currentY,1,false)
        lastTile = rightLine

        SetCoin(currentX, currentY, newR, currentAngle)
        SetBackground(currentX, currentY, newR, currentAngle)

        currentX = nextX
       
    }

    function setInitial(){
        var randomX = game.rnd.integerInRange(game.world.centerX - 100, game.world.centerX + 100)


        //var leftLine = SetLine(1,1010,randomX,INITIAL_POS_Y,-1,true)
        //var rightLine = SetLine(-1,1000,randomX,INITIAL_POS_Y,1,true)

        var leftLine = SetLine(1,WIDTH_PER_TILE*4,randomX,INITIAL_POS_Y,-1,true)
        var rightLine = SetLine(-1,WIDTH_PER_TILE*4,randomX,INITIAL_POS_Y,1,true)

        currentY = INITIAL_POS_Y
        currentX = randomX

        setPoint()

        gameActive = true
    }


    function SetLine(ang, width, x, y, side, exception){
        //console.log(obstac)
        var line = getObstacle(ang,width)
        line.body.clearShapes()
        line.body.setRectangle(width,TILE_HEIGTH/4,0,TILE_HEIGTH*0.2)
        line.body.angle = ang * ANGLE_LINE
        line.body.data.shapes[0].sensor=false;
        //line.width = width

        var direction = -1

        if(exception){
            direction = 1
        }

        line.body.x = (x - (direction*ang*width/2)*COS_ANG) + (CORRECT_OFFSET*side)
        line.body.y = y + (-direction*width/2)*SIN_ANG
        /*line.angle = ang* ANGLE_LINE
        line.x = (x - (direction*ang*width/2)*COS_ANG) + (CORRECT_OFFSET*side)
        line.y = y + (-direction*width/2)*SIN_ANG*/

        return line
    }



    function createPlayer(){

        currentAngle = game.rnd.integerInRange(0,1)
        if(currentAngle == 0){
            currentAngle = -1
        }

        init = sceneGroup.create(game.world.centerX,250,'atlas.skiZag','Salida')
        init.anchor.setTo(0.5)
    
        init.scale.setTo(-currentAngle,1)

        name = sceneGroup.create(game.world.centerX,205,'atlas.skiZag','name')
        name.anchor.setTo(0.5)

        name.angle = -currentAngle*30

        //init.addChild(name)

        characterGroup = game.add.group()
        characterGroup.x = 0
        characterGroup.y = 0
        //characterGroup.visible = false
        //sceneGroup.add(characterGroup)

        

        player = characterGroup.create(game.world.centerX,250,'atlas.skiZag','Meizy')
        player.anchor.setTo(0.5,0.5)
        //player.scale.setTo(0.15,0.3)
        player.alpha = 0
        game.physics.p2.enable(player, false);
        player.body.clearShapes()
        player.body.setRectangle(45,5,0,30)
        //player.body.angle = ANGLE_LINE * currentAngle
        player.scale.setTo(-currentAngle*1,1)

        //player.body.velocity.x = VEL_X * currentAngle
        player.body.onBeginContact.add(collisionPlayer,this)
        //game.camera.follow(player);

        spinePlayer = game.add.spine(game.world.centerX,280, "mascot");
        spinePlayer.scale.setTo(SPINE_SCALE,SPINE_SCALE)

        spinePlayer.scale.setTo(-currentAngle*SPINE_SCALE,SPINE_SCALE)
        //characterGroup.add(spinePlayer)
        //spinePlayer.scale.setTo(0.1,0.1)
       //characterGroup.scale.setTo()
        //spinePlayer.setAnimationByName(0, "IDLE", true);
        spinePlayer.setSkinByName('normal');
        var groupSpine = game.add.group()
        //groupSpine.x = 50
        //groupSpine.y = 50
        //groupSpine.scale.setTo(0.8)
        groupSpine.add(spinePlayer)
        characterGroup.add(groupSpine)

        
    }

    function collisionPlayer(body, bodyB, shapeA, shapeB, equation){
        if(!gameActive){
            return
        }

        if(body==null){
            die()
            return
        }

        if(body.name == "obstacle"){
            die()
        }
        else{
            addPoint(1,{x:body.x,y:body.y})
            body.sprite.visible = false
            body.x = 0
            body.y = 0
            
        }
    }

    function die(){
        characterGroup.visible = false
        setExplosion(player,0)
        for(var i = 0; i < obstaclesGroup.length; i++){
            obstaclesGroup.children[i].body.velocity.y = 0
        }

        for(var i = 0; i < coinsGroup.length; i++){
            coinsGroup.children[i].body.velocity.y = 0
        }

        for(var i = 0; i < yetisGroup.length; i++){
            yetisGroup.children[i].body.velocity.y = 0
        }

        for(var i = 0; i < snowBallGroup.length; i++){
            snowBallGroup.children[i].body.setZeroVelocity()
        }

        player.visible = false
        stopGame()
    }

    function createEnemiesZone(){
        // limitLines
        //var x = game.world.centerX

        var leftLine = SetLine(-1,WIDTH_PER_TILE*5,currentX,currentY,-1,false)
        var rightLine = SetLine(1,WIDTH_PER_TILE*5,currentX,currentY,1,false)


        var randomEnemy = game.rnd.integerInRange(0,1)
        //randomEnemy = 1
        if(randomEnemy==0){
            setEnemiesYetis(currentY + 300, DISTANCE_RAIL_ENEMIES-600)
        }
        else{
            setEnemiesSnow(currentY + 300, DISTANCE_RAIL_ENEMIES-600)
        }

        currentY +=  DISTANCE_RAIL_ENEMIES

        var randomX = game.rnd.integerInRange(game.world.centerX - 100, game.world.centerX + 100)

        var leftLine = SetLine(1,WIDTH_PER_TILE*5,randomX,currentY,-1,true)
        var rightLine = SetLine(-1,WIDTH_PER_TILE*5,randomX,currentY,1,true)

        lastTile = rightLine

        currentX = randomX

    }

    function createCoins(){
        coinsGroup = game.add.group()
        sceneGroup.add(coinsGroup)
        for(var i = 0; i < 20; i++){
            createSingleCoin()
        }
    }

    function createSingleCoin(){
        var coin = coinsGroup.create(0,0,'atlas.skiZag','coin')
        coin.anchor.setTo(0.5)
        coin.scale.setTo(0.6)
        coin.visible = false
        
        game.physics.p2.enable(coin, false);
        coin.body.clearShapes()
        coin.body.setCircle(10,0,0)
        coin.body.static = true
        coin.body.name = "coin"
        coin.body.data.shapes[0].sensor = true;
        return coin
    }

    function getCoin(){
        for(var i = 0; i < coinsGroup.length; i++){
            if(!coinsGroup.children[i].visible){
                coinsGroup.children[i].visible = true
                coinsGroup.children[i].body.setZeroVelocity()
                if(!initialTap){
                    coinsGroup.children[i].body.velocity.y = -VEL_Y
                }
                return coinsGroup.children[i]
            }
        }

        var coin = createSingleObstacle()
        coin.visible = true
        coin.body.setZeroVelocity()
        if(!initialTap){
            coin.body.velocity.y = -VEL_Y
        }
        return coin
    }

    function SetCoin(x, y, width, angle){

        //random # coins
        var r = game.rnd.frac()
        if(r < COIN_PROBABILITY){
            //var randomCoins = game.rnd.integerInRange(1,MAX_COINS_IN_LINE)
            var randomCoins = 1
            for(var i = 0; i < randomCoins; i++){
                var coin = getCoin()
                var newY = width*SIN_ANG
                var randomY = game.rnd.realInRange(20,newY-20)
                var newR = randomY/SIN_ANG
                var plusX = newR*COS_ANG
                coin.body.x = x + (angle*plusX)
                coin.body.y = y +randomY
            }
        }
    }

    function SetBackground(x, y, width, angle){

        var max = (width*2)/250
        var r = game.rnd.integerInRange(max-2,max+2)
        var newY = width*SIN_ANG
        for(var i = 0; i < r; i++){
            var object = getBackSprite()
            var randomY = game.rnd.realInRange(0,newY)
            var newR = randomY/SIN_ANG
            var plusX = newR*COS_ANG


            var lineX = x + (angle*plusX)
            var lineY = y +randomY

            var randomSection = game.rnd.frac()
            if(randomSection<0.5){
                lineX = lineX - CORRECT_OFFSET -90
                lineX = game.rnd.integerInRange(50,lineX)
            }
            else{
                lineX = lineX + CORRECT_OFFSET+90
                lineX = game.rnd.integerInRange(lineX, game.world.width-90)
            }

            object.x = lineX
            object.y = lineY
        }
        
    }

    function getBackSprite(){
        var randomType = game.rnd.integerInRange(0,10)

        if(randomType > 6){
            randomType=6
        }

        var key 
        var object
        if(randomType==6){
            key='Pino'
            for(var i = 0; i < treesBackground.length; i++){
                if(treesBackground.children[i].type == randomType && !treesBackground.children[i].visible){
                    return treesBackground.children[i]
                }
            }
            object = treesBackground.create(0,0,'atlas.skiZag',key)
            object.anchor.setTo(0.5)
        }
        else{
            key = 'Nieve'+(randomType+1)
            for(var i = 0; i < snowBackground.length; i++){
                if(snowBackground.children[i].type == randomType && !snowBackground.children[i].visible){
                    return snowBackground.children[i]
                }
            }
            object = snowBackground.create(0,0,'atlas.skiZag',key)
            object.anchor.setTo(0.5)
        }

        
        return object
    }

    function createTrails(){
        trailsLinearGroup = game.add.group()
        sceneGroup.add(trailsLinearGroup)
        createPool(trailsLinearGroup,'Camino_Meizy',20)
        trailsCurveGroup = game.add.group()
        sceneGroup.add(trailsCurveGroup)
        createPool(trailsCurveGroup,'Camino_Meizy',5)

        trailsSnowGroup = game.add.group()
        sceneGroup.add(trailsSnowGroup)
        createPool(trailsSnowGroup,'camino_nieve',50)
    }



    function createPool(group, key, number){
        group = game.add.group()
        sceneGroup.add(group)
        for(var i = 0; i < number; i++){
            createSingle(group,key)
        }
    }

    function createSingle(group,key){
        //console.log("Enter")
        var object = group.create(0,0,'atlas.skiZag',key)
        object.anchor.setTo(0.5)
        //object.scale.setTo(0.3)
        object.visible = false
        return object
    }

    function getFromPool(group,key){
        for(var i = 0; i < group.length; i++){
            if(!group.children[i].visible){
                group.children[i].visible = true
                return group.children[i]
            }
        }

        var object = createSingle(group,key)
        object.visible = true
        return object
    }

    function SetObject(group,key,x, y, scale){
        //random # coins
        var object = getFromPool(group,key)
        object.x = x
        object.y = y + 20
        object.alpha = 1

        object.scale.setTo(scale,1)
        //console.log("Set object ",object.x,object.y,object.visible)
     }

     function moveGroupY(group,vel,limit){
        for(var i = 0; i < group.length; i++){
            if(group.children[i].visible){
                group.children[i].y += vel
                group.children[i].alpha -= 0.02

                if(group.children[i].alpha<=0){
                	group.children[i].visible = false
                }

                if(group.children[i].y <= limit){
                    group.children[i].visible = false
                }
            }
        }
     }

     function createEnemies(){
        yetisGroup = game.add.group()
        sceneGroup.add(yetisGroup)

        for(var i = 0; i < 5; i++){
            createYeti()
        }

        snowBallGroup = game.add.group()
        sceneGroup.add(snowBallGroup)

        for(var i = 0; i < 10; i++){
            createSnowBall()
        }
     }

    function createYeti(){
        var enemy = yetisGroup.create(0,0,'atlas.skiZag','Yeti')
        enemy.alpha = 0
        enemy.anchor.setTo(0.5)
        enemy.scale.setTo(0.8)
        enemy.visible = false
        
        game.physics.p2.enable(enemy, false);
        enemy.body.clearShapes()
        enemy.body.setRectangle(60,110,0,20)
        enemy.body.static = true
        enemy.body.name = "obstacle"

        var spine = game.add.spine(0,0, "yetiSpine");
        spine.scale.setTo(0.35,0.35)
        spine.setAnimationByName(0, "IDLE", true);
        spine.setSkinByName('normal');
        spine.visible = false

        enemy.spine = spine

        return enemy
    }

    function createSnowBall(){
        var enemy = snowBallGroup.create(0,0,'atlas.skiZag','Bola_nieve')
        enemy.anchor.setTo(0.5)
        enemy.scale.setTo(1)
        enemy.visible = false
        
        game.physics.p2.enable(enemy, false);
        enemy.body.clearShapes()
        enemy.body.setCircle(30,0,0)
        enemy.body.static = true
        enemy.body.name = "obstacle"
        return enemy
    }

    function getEnemy(type){

        var group

        if(type==0){
            group = yetisGroup
        }
        else{
            group = snowBallGroup
        }
        //console.log(group.length)
        for(var i = 0; i < group.length; i++){
            if(!group.children[i].visible){
                group.children[i].visible = true
                group.children[i].body.setZeroVelocity()
                
                return group.children[i]
            }
        }
      
    }

    function setEnemiesYetis(initialY, height){
        inYetiZone = true
        var y = initialY
        var delta = height/4
        for(var i = 0; i < 5; i++){
            var enemy = getEnemy(0)
            enemy.visible = true
            enemy.body.x = game.rnd.integerInRange(100,game.world.width-100)
            enemy.body.y = y
            y+=delta
            enemy.body.velocity.y = -VEL_Y
            enemy.nextX = game.rnd.integerInRange(100,game.world.width-100)
            if(enemy.nextX <= enemy.body.x){
                enemy.direction = -1
            }
            else{
                enemy.direction = 1
            }

            enemy.body.velocity.x = enemy.direction*VEL_X

            if(i ==4){
                lastEnemy = enemy
            }
        }
    }

    function setEnemiesSnow(initialY, height){
        inSnowZone = true
    	console.log(snowBallGroup.length)
        for(var i = 0; i < snowBallGroup.length; i++){
            snowBallGroup.children[i].body.setZeroVelocity()
            snowBallGroup.children[i].body.y = game.world.height
            snowBallGroup.children[i].body.x = 0
            snowBallGroup.children[i].deltaWait = 0

        }
        
        var y = initialY
        var delta = height/7
        var deltawait = game.time.now + WAIT_SNOW
        var randomX = game.rnd.integerInRange(0,1)
        console.log("SetEnemy snow ",deltawait)

        if(randomX == 0){
            randomX = -1
        }

        for(var i = 0; i < 8; i++){
            var enemy = getEnemy(1)
            
            var posX = 0
            if(randomX==-1){
                posX = game.rnd.integerInRange(-200,-100)
            }
            else{
                posX = game.rnd.integerInRange(game.world.width+100, game.world.width+200)
            }
            randomX = -randomX


            enemy.body.setZeroVelocity()

            enemy.body.x = posX
            //enemy.body.x = game.world.centerX
           

            enemy.body.y = y
            y+=delta
            
            enemy.body.velocity.y = -VEL_Y
            enemy.deltaWait = deltawait
            deltawait += DELTA_WAIT_SNOW
            DELTA_WAIT_SNOW = game.rnd.integerInRange(700,900)

            enemy.visible = true


            if(i ==7){
                lastEnemy = enemy
            }
            //console.log(enemy.body.y,enemy.body.x,enemy.deltaWait)
        }
    }

    function createSprites(side,number){
        var bmd = game.add.bitmapData(number*WIDTH_PER_TILE,TILE_HEIGTH)
        for(var i = 0; i < number; i++){
            if(side==1){
                bmd.draw(leftSprite, i*WIDTH_PER_TILE, 0);
            }
            else{
                bmd.draw(rigthSprite, i*WIDTH_PER_TILE, 0);
            }
        }
        //bmd.addToWorld()

        return bmd
    }
    

    function create(){

        
        sceneGroup = game.add.group()

        //game.stage.backgroundColor = "#ffffff";

        //var background = gam.add.sprite(0,0)

        var bmd = game.add.bitmapData(game.world.width, game.world.height)

        //bmd.addToWorld()
        //sceneGroup.add(bmd)

        var y = 0;

        for (var i = 0; i < game.world.height/2; i++)
        {
            var c = Phaser.Color.interpolateColor(0xffffff, 0xbbcffa, game.world.height, i);

            // console.log(Phaser.Color.getWebRGB(c));

            bmd.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c));

            //out.push(Phaser.Color.getWebRGB(c));

            y += 2;
        }

        var background = game.add.sprite(0, 0, bmd);
        sceneGroup.add(background)

        game.physics.setBoundsToWorld(true,true,false,false,false)

        game.physics.startSystem(Phaser.Physics.P2JS)
        
        loadSounds()
        initialize()  
        
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

        
        snowBackground = game.add.group()
        sceneGroup.add(snowBackground)
        treesBackground = game.add.group()
        sceneGroup.add(treesBackground)

        leftSprite = game.make.sprite(0,0,'atlas.skiZag','barra_h1')
        rigthSprite = game.make.sprite(0,0,'atlas.skiZag','barra_h1_flip')
        

        bitmapsLeft.push(createSprites(1,1))
        bitmapsLeft.push(createSprites(1,2))
        bitmapsLeft.push(createSprites(1,3))
        bitmapsLeft.push(createSprites(1,4))
        bitmapsLeft.push(createSprites(1,5))

        bitmapsRigth.push(createSprites(2,1))
        bitmapsRigth.push(createSprites(2,2))
        bitmapsRigth.push(createSprites(2,3))
        bitmapsRigth.push(createSprites(2,4))
        bitmapsRigth.push(createSprites(2,5))

         createTrails()

        createObstacles()
        
        createObjects()
        createCoins()
        createEnemies()

        createPointsBar()
        createHearts()

       

        createPlayer()

        setInitial()

        animateScene()

    }

    
    return {
        assets: assets,
        name: "skiZag",
        create: create,
        preload: preload,
        update: update,
    }
}()