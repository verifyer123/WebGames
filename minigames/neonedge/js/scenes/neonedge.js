var soundsPath = "../../shared/minigames/sounds/"
var neonedge = function(){
    
    var localizationData = {
		"EN":{

		},

		"ES":{

            
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.neon",
                json: "images/neon/atlas.json",
                image: "images/neon/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/neon/background.png"},
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
    
    var gameIndex = 13
    var gameId = 5742796208078848

    var skullTrue = false
    var marioSong = null
    var enemyNames = null
    var consecFloor, consecBricks
    var gameStart = false
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
        gameIndex = amazing.getId(gameId)
        enemyNames = ['coin']
        gameStart = false
        skullTrue = false
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
        
        var exp = sceneGroup.create(0,0,'atlas.neon','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(4,4)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.neon','smoke');
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
        
        game.plugins.add(Fabrique.Plugins.Spine);
        game.stage.disableVisibilityChange = false;
        
        game.load.spritesheet('coinS', 'images/neon/coinS.png', 68, 70, 12);
        
		if(amazing.getMinigameId()){
			marioSong = sound.setSong(soundsPath + 'songs/melodic_basss.mp3',0.5)
		}else{
			game.load.audio('neonSong', soundsPath + 'songs/melodic_basss.mp3');
		}
		
        
    }
    
    function inputButton(obj){
        
        if(gameActive == false){
            return
        }
        
        //sound.play("click")
        
        groupButton.isPressed = true
        jumping = true
        doJump()
        
        obj.parent.children[1].alpha = 0
    }
    
    function releaseButton(obj){
        
        groupButton.isPressed = false
        jumping = false
        obj.parent.children[1].alpha = 1
    }
    
    function createControls(){
        
        var spaceButtons = 220
        
        var bottomRect = sceneGroup.create(0,game.world.height,'atlas.neon','dashboard')
        bottomRect.width = game.world.width
        bottomRect.height *= 1.02
        bottomRect.anchor.setTo(0,1)
        
        groupButton = game.add.group()
        groupButton.x = game.world.centerX
        groupButton.y = game.world.height -155
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var button1 = groupButton.create(0,0, 'atlas.neon','arcadebutton2')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.neon','arcadebutton1')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)
        
    }
    
    function stopWorld(){
        
        changeVelocityGame(0)
        
        //buddy.setAnimationByName(0,"LOSE",false)
        buddy.alpha = 0
        
    }
    
    function changeVelocityGame(velocity){
        
        for(var i = 0;i<groundGroup.length;i++){
            var child = groundGroup.children[i]
            child.body.velocity.x = velocity
        }
    }
    
    function stopGame(win){
        
		if(amazing.getMinigameId()){
			marioSong.pause()
		}else{
			marioSong.stop()
		}
        
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
            
            //amazing.saveScore(pointsBar.number,gameIndex) 
            
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
        
        if(pointsBar.number == 10){
            enemyNames[enemyNames.length] = 'enemy_squish'
        }else if(pointsBar.number == 16){
            enemyNames[enemyNames.length] = 'enemy_spike'
        }else if(pointsBar.number == 25){
            consecBricks = -100
            consecFloor = -100
        }else if(pointsBar.number == 30){
            skullTrue = true
        }
        
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
        if((jumpButton.isUp && groupButton.isPressed == false)){
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
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(10,10,'atlas.neon','xpcoins')
    
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
        heartsGroup.x = game.world.width - 20
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartsImg = group.create(0,0,'atlas.neon','life_box')
        heartsImg.anchor.setTo(1,0)
        
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, "0", fontStyle)
        pointsText.x = -heartsImg.width * 0.38
        pointsText.y = 2
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
                activateObject(posX, posY - child.height - 185 - (Math.random() * 0.3) * child.height,child.topObject)
                
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
            pivotObjects = objToCheck.body.x + objToCheck.width * 4
        }
            
        
        for(var i = 0;i< groundGroup.length;i++){
            var child = groundGroup.children[i]
            if(child.tag == tag && child.used == false){
                if (tag == "obstacle"){
                    
                    activateObject(pivotObjects,game.world.height - (child.height * Math.random() * 0.9) - 145,child)
                    
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
                
                object = groundGroup.create(-300,game.world.height - 350,'atlas.neon',tag)
                object.isPoint = true
                
                object2 = groundGroup.create(-300,0,'atlas.neon',tag + 'up')
                
                object.topObject = object2
                
                object2.scale.setTo(scale,scale)
                object2.anchor.setTo(0,1)
                object2.tag = tag + '2'
                game.physics.p2.enable(object2,DEBUG_PHYSICS)
                object2.body.kinematic = true
                object2.used = false
                
                player.body.createBodyCallback(object2, collisionEvent, this);

            }
            
            object.scale.setTo(scale,scale)
            object.anchor.setTo(0,1)
            object.tag = tag
            game.physics.p2.enable(object,DEBUG_PHYSICS)
            object.body.kinematic = true
            object.used = false
            
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
                particle = particlesGroup.create(-200,0,'atlas.neon',tag)
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
            
            var particle =  particlesFollow.create(0,0,'atlas.neon','ship')
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
            
            var object2 = groundGroup.create(pivotX,game.world.centerY + 115,'atlas.neon','obstacleup')
                                
            object2.scale.setTo(1.2,1.2)
            object2.anchor.setTo(0,1)
            game.physics.p2.enable(object2,DEBUG_PHYSICS)
            object2.body.kinematic = true
            
            pivotX += object2.width
            //console.log(object2.x + 'posX')
        }
    }
    
	return {
		assets: assets,
		name: "neonedge",
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
            
            var background = worldGroup.create(0,0,'fondo')
            background.width = game.world.width
            background.height = game.world.height * 1.02
            
            groundGroup = game.add.group()
            worldGroup.add(groundGroup)
            
            loadSounds()
			initialize()       
            
			if(!amazing.getMinigameId()){
				
				marioSong = game.add.audio('neonSong')
				game.sound.setDecodedCallback(marioSong, function(){
					marioSong.loopFull(0.6)
				}, this);
			}
            
            objectsGroup = game.add.group()
            worldGroup.add(objectsGroup)
            
            particlesFollow = game.add.group()
            worldGroup.add(particlesFollow)
            
            characterGroup = game.add.group()
            characterGroup.x = 100
            characterGroup.y = game.world.height - BOT_OFFSET * 6
            worldGroup.add(characterGroup)
            
            buddy = characterGroup.create(0,-45,'atlas.neon','ship')
            buddy.anchor.setTo(0.5,0.5)
            
            createTrail()
            
            player = worldGroup.create(characterGroup.x, characterGroup.y,'atlas.neon','ship')
            player.anchor.setTo(0.5,1)
            player.scale.setTo(0.37,0.37)
            player.alpha = 0
            game.physics.p2.enable(player,DEBUG_PHYSICS)
            player.body.fixedRotation = true
            player.body.mass=50
            player.lastpos = player.y
            
            player.body.collideWorldBounds = true;
            
            createBase()
            
            createPointsBar()
            createHearts()
            createControls()   
            
            createObjects()
            
            game.onPause.add(function(){
				
				if(amazing.getMinigameId()){
					marioSong.pause()
				}
				
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
				
				if(amazing.getMinigameId()){
					if(lives>0){
						marioSong.play()
					}
				}
				
                game.sound.mute = false
            }, this);
            
            //createControls()
            
            game.physics.p2.setImpactEvents(true);
            
            animateScene()
            
            
		},
        preload:preload,
        update:update,
		show: function(event){
			loadSounds()
			initialize()
		}
	}

}()