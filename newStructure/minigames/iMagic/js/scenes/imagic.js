var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var imagic = function(){
    
    var localizationData = {
		"EN":{

		},

		"ES":{

            
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.imagic",
                json: "images/iMagic/atlas.json",
                image: "images/iMagic/atlas.png",
            },
        ],
        images: [

		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "magic.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "explode",
				file: soundsPath + "laserexplode.mp3"},
            {	name: "wrongItem",
				file: soundsPath + "wrongItem.mp3"},
		],
	}
    
    var SPEED = 225 
    var TIME_ADD = 600
    var JUMP_FORCE = 820
    var DEBUG_PHYSICS = false
    var WORLD_GRAVITY = 1600
    var OFF_BRICK = 330
    var BOT_OFFSET = 105
    
    var gameIndex = 91
    var marioSong = null
    var enemyNames = null
    var consecFloor, consecBricks
    var jumping = false
    var lastOne = null
    var yAxis = null
    var objToCheck
    var gameSpeed = null
    var objectsList = null
    var pivotObjects
    var player
    var particlesGroup, particlesUsed
    var particlesFollow
	var sceneGroup = null
    var groundGroup = null
    var answersGroup = null
    var pointsGroup = null
    var gameActive = null
    var jumpTimer = 0
    var characterGroup = null
    var pointsBar = null
    var lives = null
    var heartsGroup = null 
    var groupButton = null
	var overlayGroup
	var screenRect
	var back1,back2
    

	function loadSounds(){
		sound.decode(assets.sounds)
	}

    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    }  
    
	function initialize(){
        
        enemyNames = ['coin']
        gameSpeed =  SPEED
        lastOne = null
        game.stage.backgroundColor = "#ffffff"
        jumpTimer = 0
        gameActive = false
        lives = 1
        pivotObjects = 0
        objToCheck = null
        buttonPressed = false
        tooMuch = false
        GRAVITY_OBJECTS = 4
        yAxis = p2.vec2.fromValues(0, 1);
        objectsList = []
        consecFloor = 0
        consecBricks = 0
        
	}
    
    function animateScene() {
                        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        gameActive = true
        //timer.start()
        //game.time.events.add(throwTime *0.1, dropObjects , this);
        //objectsGroup.timer.start()
        //game.time.events.add(TIME_ADD, addObjects , this);
        //checkOnAir()
        gameStart = true
        
        changeVelocityGame(0)

    } 
    
    function setExplosion(obj){
        
        
        var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
        
        var exp = sceneGroup.create(0,0,'atlas.imagic','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(4,4)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.imagic','smoke');
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = posX;
        particlesGood.y = posY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
    
    function preload() {
        
        game.stage.disableVisibilityChange = false;
        
        game.load.spritesheet('coinS', 'images/iMagic/spritesheets/coinS.png', 68, 70, 12);
		game.load.spritesheet('chip', 'images/iMagic/spritesheets/chip.png', 200, 162, 19);
		game.load.spritesheet('chip2', 'images/iMagic/spritesheets/chip2.png', 217, 317, 12);
		
		game.load.audio('neonSong', soundsPath + 'songs/technology_action.mp3');
		

        
        game.load.image('introscreen',"images/iMagic/tutorial/introscreen.png")
		game.load.image('howTo',"images/iMagic/tutorial/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/iMagic/tutorial/play" + localization.getLanguage() + ".png")
		
        
    }
    
    function inputButton(obj){
        
		console.log('pressed')
        if(gameActive == false){
            return
        }
        
        //sound.play("click")
        
        screenRect.isPressed = true
        jumping = true
        doJump()
        
    }
    
    function releaseButton(obj){
        
        screenRect.isPressed = false
        jumping = false
    }
    
    function createControls(){
        
        screenRect = new Phaser.Graphics(game)
        screenRect.beginFill(0x000000)
        screenRect.drawRect(0,0,game.world.width *2, game.world.height *2)
        screenRect.alpha = 0
        screenRect.endFill()
        screenRect.inputEnabled = true
		screenRect.isPressed = false
        screenRect.events.onInputDown.add(inputButton)
        screenRect.events.onInputUp.add(releaseButton)
		sceneGroup.add(screenRect)
		
    }
    
    function stopWorld(){
        
        changeVelocityGame(0)
        
        //buddy.setAnimationByName(0,"LOSE",false)
        buddy.alpha = 0
		
		anim2.alpha = 1
		anim2.animations.play('walk',24,false);  
        
    }
    
    function changeVelocityGame(velocity){
        
        for(var i = 0;i<groundGroup.length;i++){
            var child = groundGroup.children[i]
            child.body.velocity.x = velocity
        }
    }
    
    function stopGame(win){
        

		marioSong.stop()
        
        missPoint()
        sound.play("gameLose")
        stopWorld()
        setExplosion(player)
        game.add.tween(objectsGroup).to({alpha:0},250, Phaser.Easing.Cubic.In,true)
        
        worldGroup.alpha = 0
        game.add.tween(worldGroup).to({alpha:1},250,Phaser.Easing.linear,true)
        
        //objectsGroup.timer.pause()
        gameActive = false
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)
                        
			sceneloader.show("result")
		})
    }
    
    function addPoint(obj,part){
        
        var partName = part || 'star'
        sound.play("pop")
        createPart(partName, obj)
        createTextPart('+1', obj)
        
        //gameSpeed +=10
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        addNumberPart(pointsBar.text,'+1',true)
        
    }
    
    function addNumberPart(obj,number,isScore){
        
        var pointsText = lookParticle('textPart')
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y
            pointsText.anchor.setTo(0.5,0.5)
            pointsText.setText(number)
            pointsText.scale.setTo(1,1)

            var offsetY = -100

            pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
            
            deactivateParticle(pointsText,800)
            if(isScore){
                
                pointsText.scale.setTo(0.7,0.7)
                var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
                tweenScale.onComplete.add(function(){
                    game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
                })

                offsetY = 100
            }
            
            game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        }
        
    }
    
    function missPoint(){
        
        sound.play("explode")
        if (lives >0){
            lives--;
        }
        //changeImage(0,heartsGroup.children[lives])
        heartsGroup.text.setText('X ' + lives)
        //buddy.setAnimationByName(0, "RUN_LOSE", 0.8);
        
        addNumberPart(heartsGroup.text,'-1',true)
        
    }
    
    function positionPlayer(){
        
        if(game.physics.p2.gravity.y !=0){
            
            if(player.lastpos < player.y){
            
            if(buddy.angle<90){
                buddy.angle+=2
            }
            }else{
                if(buddy.angle > -90){
                    buddy.angle-=2.5
                }
            }
            
        }

        player.body.x = 100 
        characterGroup.x = player.x
        characterGroup.y = player.y +44 
        
        player.lastpos = player.body.y
        
        if(player.body.y > game.world.height - BOT_OFFSET * 1.8 ){
            stopGame()
        }
        
    }
    
    function deactivateObj(obj){
        obj.body.velocity.x = 0
        obj.used = false
        obj.body.y = -500
    }
    
    function checkObjects(){
        
        //console.log( objectsList.length + 'cantidad objetos')
        for(var index = 0;index<objectsList.length;index++){
            var obj = objectsList[index]
            if(obj.body.x < -obj.width * 0.45 && obj.used == true){
                deactivateObj(obj)
                addObstacle('obstacle')
                //console.log('objeto removido')
            }else if(obj.tag == 'coin'){
                if(Math.abs(obj.body.x - player.body.x) < 50 && Math.abs(obj.body.y - player.body.y) < 50){
                    if(obj.tag == 'coin'){
                        addPoint(obj)
                    }
                    deactivateObj(obj)
                }
                
            }
            
            if(obj.body.x < player.body.x && obj.isPoint){
                addPoint(player,'ring')
                obj.isPoint = false
            }
        }
    }
    
    function activatePart(part){
        
        //console.log('addpart')
        part.scale.setTo(part.firstScale,part.firstScale)
        
        part.alpha = 1
        part.x = player.x
        part.y = player.y + 35
        
        part.used = true
        var tweenAlpha = game.add.tween(part).to({x:part.x - 65,alpha:0},150,Phaser.Easing.linear,true)
        
        game.add.tween(part.scale).to({x:0.1,y:0.1},150,Phaser.Easing.linear,true)
        
        tweenAlpha.onComplete.add(function(){
            part.used = false
        },this)
        
    }
    
    function startParticles(){
        
        for(var i = 0; i< particlesFollow.length;i++){
            var part = particlesFollow.children[i]
            
            if(!part.used){
                activatePart(part)
            }
        }
                
        if(gameActive){
            game.time.events.add(100,startParticles,this)
        }
        
        
    }
    
    function doJump(value){
        
        var jumpValue = value
        
        if(jumpValue == null){ jumpValue = JUMP_FORCE}
        sound.play("whoosh")
        
        buddy.isRunning = false
        
        //buddy.setAnimationByName(0, "JUMP", false);
        //buddy.addAnimationByName(0, "LAND", false);
        
        if(game.physics.p2.gravity.y == 0){
			buddy.animations.play('walk')
            game.physics.p2.gravity.y = WORLD_GRAVITY
            changeVelocityGame(-gameSpeed)
            startParticles()
            //marioSong.loopFull(0.5)
        }
        
        player.body.moveUp(jumpValue)
        jumpTimer = game.time.now + 750;
        
    
    }
    
    function update(){
        
        if(gameActive == false){
            return
        }
        
		if(game.physics.p2.gravity.y > 0){
			back1.tilePosition.x-= 1
			back2.tilePosition.x-= 2
		}
		
        positionPlayer()
        
        if (jumpButton.isDown){
            
            if(jumping == false)
            {
                jumping = true
                doJump()
            }
        }
        
        if(jumping == true){
            player.body.velocity.y-=2
            
        }
        
        //console.log(player.body.velocity.y + ' velocity y')
        if((jumpButton.isUp && screenRect.isPressed == false)){
            if(player.body.velocity.y< 0){
                player.body.velocity.y+=20
            }
            jumping = false
            //buddy.setAnimationByName(0,"RUN",true)
        }
        
        checkObjects()
    }
    
    function checkIfCanJump() {

        var result = false;

        for (var i=0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++)
        {
            var c = game.physics.p2.world.narrowphase.contactEquations[i];

            if (c.bodyA === player.body.data || c.bodyB === player.body.data)
            {
                var d = p2.vec2.dot(c.normalA, yAxis);

                if (c.bodyA === player.body.data)
                {
                    d *= -1;
                }

                if (d > 0.5)
                {
                    result = true;
                }
            }
        }

        return result;

}
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.imagic','xpcoins')
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
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.imagic','life_box')

        pivotX+= heartImg.width * 0.45
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = heartImg.height * 0.03
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
    
    function collisionEvent(obj1,obj2){
        
        //console.log(obj2.sprite.tag)
        var tag = obj2.sprite.tag
        
        if(obj2.sprite.used == true && gameActive == true){
            if(tag == 'coin'){
                deactivateObj(obj2.sprite)
                addPoint(obj2.sprite)

            }else if(tag == "obstacle" || tag == "obstacle2"){
                
                stopGame()
                
            }
        }
    }
    
    function addComplement(tag){
        
        var objToUse
        for(var i = 0;i< groundGroup.length;i++){
            var child = groundGroup.children[i]
            if(child.tag == tag && child.used == false){
                objToUse = child
                break
            }
        }
        return objToUse
    }
    
     function activateObject(posX, posY, child){
        //console.log(child.tag + ' tag,')
        if(child != null){
            
            child.body.x = posX
            child.body.y = posY
            child.used = true
            child.body.velocity.x = -gameSpeed 
            objectsList[objectsList.length] = child
            
            if(child.tag == 'obstacle'){
                
                child.isPoint = true
                activateObject(posX, posY - child.height - 185 - (Math.random() * 0.45) * child.height,child.topObject)
                
            }
        }
    
     }
    
    function checkAdd(obj, tag){
        
        //console.log('check')
        Phaser.ArrayUtils.shuffle(enemyNames)
        
        if(Math.random()*2 > 1 && gameActive == true){
            
            var nameItem = 'coin'            

            var coin = addComplement(nameItem)
            if(coin != null){
                //console.log('adde coin')
                activateObject(pivotObjects - obj.width * 2.1,(Math.random() * game.world.height -500) + 200,coin)
            }

        }
    }
    
    function addObstacle(tag){
        
        pivotObjects = 450
        if(objToCheck != null ){
            pivotObjects = objToCheck.body.x + objToCheck.width * 5.5
        }
            
        
        for(var i = 0;i< groundGroup.length;i++){
            var child = groundGroup.children[i]
            if(child.tag == tag && child.used == false){
                if (tag == "obstacle"){
                    
                    activateObject(pivotObjects,game.world.height - (child.height * Math.random() * 0.45),child)
                    
                    checkAdd(child,tag)
                    objToCheck = child
                    
                }
                break
            }
        }
    }
    
    function createObjs(tag,scale,times){
        
        var pivotX = 0
        for(var i = 0;i<times;i++){
            var object, object2
            if(tag == 'coin'){
                
                object = game.add.sprite(-300, 200, 'coinS');
                groundGroup.add(object)
                object.animations.add('walk');
                object.animations.play('walk',24,true);   
            }else if(tag == 'obstacle'){
                
                object = groundGroup.create(-300,game.world.height - 350,'atlas.imagic',tag)
                object.isPoint = true
                
                object2 = groundGroup.create(-300,0,'atlas.imagic',tag + 'up')
                
                object.topObject = object2
                
                object2.scale.setTo(scale,scale)
                object2.anchor.setTo(0,1)
                object2.tag = tag + '2'
                game.physics.p2.enable(object2,DEBUG_PHYSICS)
                object2.body.kinematic = true
                object2.used = false
				object2.body.setRectangle(object2.width * 0.7,object2.height)
                
                player.body.createBodyCallback(object2, collisionEvent, this);

            }
            
            object.scale.setTo(scale,scale)
            object.anchor.setTo(0,1)
            object.tag = tag
            game.physics.p2.enable(object,DEBUG_PHYSICS)
            object.body.kinematic = true
            object.used = false
			object.body.setRectangle(object.width * 0.7,object.height)
            
            if(object.tag != 'coin'){
                object.body.allowSleep = true
                player.body.createBodyCallback(object, collisionEvent, this);
            }else{
                object.body.data.shapes[0].sensor = true
            }
            
        }
    }
    
    function createTextPart(text,obj){
        
        var pointsText = lookParticle('textPart')
        
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y - 60
            pointsText.setText(text)
            pointsText.scale.setTo(1,1)

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
            
            particle.x = obj.world.x
            particle.y = obj.world.y
            particle.scale.setTo(1,1)
            
            var scaleToUse = 2
            if(key == 'smokePart'){scaleToUse = 2.5}
            game.add.tween(particle).to({alpha:0, y:particle.y+50},300,Phaser.Easing.Cubic.In,true)
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
                particle = particlesGroup.create(-200,0,'atlas.imagic',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
    
    function createObjects(){
        
        createObjs('obstacle',1,10)
        createObjs('coin',1,10)
        
        particlesGroup = game.add.group()
        sceneGroup.add(particlesGroup)
        
        particlesUsed = game.add.group()
        sceneGroup.add(particlesUsed)
        
        createParticles('ring',3)
        createParticles('text',6)
        
        for(var i = 0; i < 8; i++){
            addObstacle('obstacle')
        }
        
    }
    
    function checkTag(){
        
        if(consecFloor == 1){
            tag = 'floor'
            consecFloor-=2
        }else if(consecBricks == 1){
            tag = 'brick'
            consecBricks-=2
        }else{
            if(objToCheck.tag == 'floor'){
                objToCheck.lastFloor = true
            }
            var tag = "floor"
            if(Math.random()*2 > 1){
                tag = "brick"
            }

            if(tag == 'brick' && objToCheck.spike == true){
                tag = 'floor'
            }
        }
        
        if(tag == 'floor'){
            consecFloor++
        }else{
            consecBricks++
        }
        
        return tag
    }
    
    function addObjects(){
        
        var tag = checkTag()
        
        addObstacle(tag)
        
        //game.time.events.add(TIME_ADD, addObjects , this);
        
    }
    
    function checkOnAir(){
        
        if( buddy.isRunning == true){
            if(checkIfCanJump() == false){
                buddy.setAnimationByName(0,"JUMP", false)
                buddy.isRunning = false
            }
        }
        if(gameActive == true){
            game.time.events.add(50,checkOnAir,this)
        }
    }
    
    function createTrail(){
        
        for(var i = 0;i<50;i++){
            
            var particle =  particlesFollow.create(0,0,'atlas.imagic','ship')
            particle.anchor.setTo(0.5,1)
            particle.scale.setTo(0.5,0.5)
            particle.firstScale = particle.scale.x
            
            particle.used = false
            particle.alpha = 0
            
        }
        
    }
    
    function createBase(){
        
        var pivotX = 100
        
        for(var i = 0; i <1;i++){
            
            var object2 = groundGroup.create(pivotX,game.world.centerY + 250,'atlas.imagic','obstacleup')
                                
            object2.scale.setTo(1.2,1.2)
            object2.anchor.setTo(0,1)
            game.physics.p2.enable(object2,DEBUG_PHYSICS)
            object2.body.kinematic = true
            
            pivotX += object2.width
            //console.log(object2.x + 'posX')
        }
    }
    
	function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
			sound.play("pop")
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
				
				gameStart = true
				gameActive = true
				
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.imagic','gametuto')
		tuto.anchor.setTo(0.5,0.5)
		tuto.scale.setTo(0.9,0.9)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		//console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.imagic',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.imagic','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
	
	function createBackground(){
		
		var sky = worldGroup.create(0,0,'atlas.imagic','gradient')
		sky.width = game.world.width
		sky.height = game.world.height * 0.6
		
		back1 = game.add.tileSprite(0,game.world.height,game.world.width,619,'atlas.imagic','cloud')
		back1.anchor.setTo(0,1)
		worldGroup.add(back1)
		
		back2 = game.add.tileSprite(0,game.world.height,game.world.width,619,'atlas.imagic','city')
		back2.anchor.setTo(0,1)
		worldGroup.add(back2)
		
	}
	
	return {
		assets: assets,
		name: "imagic",
		create: function(event){
            
            game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.gravity.y = 0;
            game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            game.physics.p2.world.setGlobalStiffness(1e5);
            
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            
			sceneGroup = game.add.group()
            
            worldGroup = game.add.group()
            //worldGroup.scale.setTo(0.5,0.5)
            //worldGroup.x = 100
            sceneGroup.add(worldGroup)
            
            createBackground()
            
            groundGroup = game.add.group()
            worldGroup.add(groundGroup)
            
            loadSounds()
			initialize()       
				
			marioSong = game.add.audio('neonSong')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.6)
			}, this);
            
            objectsGroup = game.add.group()
            worldGroup.add(objectsGroup)
            
            particlesFollow = game.add.group()
            worldGroup.add(particlesFollow)
            
            characterGroup = game.add.group()
            characterGroup.x = 100
            characterGroup.y = game.world.height - BOT_OFFSET * 6
            worldGroup.add(characterGroup)
            
            buddy = game.add.sprite(0, -55, 'chip');
			buddy.scale.setTo(0.6,0.6)
			buddy.anchor.setTo(0.5,0.5)
			buddy.animations.add('walk');
			buddy.animations.play('walk',24,true);  
			buddy.animations.stop()
			characterGroup.add(buddy)
			
			anim2 = game.add.sprite(0, -55, 'chip2');
			anim2.scale.setTo(0.6,0.6)
			anim2.anchor.setTo(0.5,0.5)
			anim2.animations.add('walk');
			anim2.alpha = 0
			characterGroup.add(anim2)
            
            createTrail()
            
            player = worldGroup.create(characterGroup.x, characterGroup.y,'atlas.imagic','ship')
            player.anchor.setTo(0.5,1)
            player.scale.setTo(0.37,0.37)
            player.alpha = 0
            game.physics.p2.enable(player,DEBUG_PHYSICS)
            player.body.fixedRotation = true
            player.body.mass=50
            player.lastpos = player.y
			player.body.setCircle(player.width * 0.6)
            
            player.body.collideWorldBounds = true;
            
            createBase()
            
            createPointsBar()
            createHearts()
            createControls()   
            
            createObjects()
            
            game.onPause.add(function(){
				
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
				
				if(lives>0){
					marioSong.play()
				}
				
                game.sound.mute = false
            }, this);
            
            //createControls()
            
            game.physics.p2.setImpactEvents(true);
            
            animateScene()
			buttons.getButton(marioSong,sceneGroup)
			createOverlay()
            
            
		},
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
        update:update,
	}

}()