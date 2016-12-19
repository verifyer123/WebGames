var soundsPath = "../../shared/minigames/sounds/"
var graviswitch = function(){    

	assets = {
        atlases: [
            {   
                name: "atlas.amazingbros",
                json: "images/graviswitch/atlas.json",
                image: "images/graviswitch/atlas.png",
            },
        ],
        images: [
            
		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "magic.mp3"},
            {	name: "splash",
				file: soundsPath + "splash.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "wrongItem",
				file: soundsPath + "wrongItem.mp3"},
		],
	}
    
    var SPEED = 225 
    var TIME_ADD = 600
    var JUMP_FORCE = 820
    var DEBUG_PHYSICS = true
    var WORLD_GRAVITY = 1600
    var OFF_BRICK = 200
    var BOT_OFFSET = 250
    
    var indexCoin
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
        
        enemyNames = ['coin']
        indexCoin = 0
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
        game.time.events.add(TIME_ADD, addObjects , this);
        checkOnAir()
        gameStart = true

    } 
    
    
    function preload() {
        
        game.plugins.add(Fabrique.Plugins.Spine);
        game.stage.disableVisibilityChange = false
        game.load.spine('mascot', "images/spines/mascotaAmazing.json");
        
        game.load.audio('marioSong', soundsPath + 'songs/marioSong.mp3');
        
        
    }
    
    function inputButton(obj){
        
        if(gameActive == false){
            return
        }
        
        //sound.play("click")
        
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
        
        var bottomRect = sceneGroup.create(0,game.world.height,'atlas.amazingbros','dashboard')
        bottomRect.width = game.world.width
        bottomRect.height *= 1.02
        bottomRect.anchor.setTo(0,1)
        
        groupButton = game.add.group()
        groupButton.x = game.world.centerX
        groupButton.y = game.world.height -125
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var button1 = groupButton.create(0,0, 'atlas.amazingbros','arcadebutton2')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.amazingbros','arcadebutton1')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)        
        
    }
    
    function stopWorld(){
        
        for(var i = 0;i<groundGroup.length;i++){
            var child = groundGroup.children[i]
            child.body.velocity.x = 0
        }
        
        buddy.setAnimationByName(0,"LOSE",false)
        var tweenLose = game.add.tween(buddy).to({y:buddy.y - 150}, 1000, Phaser.Easing.Cubic.Out, true)
        tweenLose.onComplete.add(function(){
            game.add.tween(buddy).to({y:buddy.y + game.world.height + game.world.height * 0.2}, 500, Phaser.Easing.Cubic.In, true)
        })
    }
    function stopGame(win){
        
        marioSong.stop()
        
        missPoint()
        sound.play("gameLose")
        stopWorld()
        game.add.tween(objectsGroup).to({alpha:0},250, Phaser.Easing.Cubic.In,true)
        
        //objectsGroup.timer.pause()
        gameActive = false
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number)

			amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function createTextPart(text,obj){
        
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, text, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y - 60
        sceneGroup.add(pointsText)
                
        pointsText.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
        
        game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)
        
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
        
        addNumberPart(pointsBar.text,'+1')
        
    }
    
    function addNumberPart(obj,number){
        
        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)
        
        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
        tweenScale.onComplete.add(function(){
            game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
        })
    }
    
    function missPoint(){
        
        sound.play("wrong")
        if (lives >0){
            lives--;
        }
        //changeImage(0,heartsGroup.children[lives])
        heartsGroup.text.setText('X ' + lives)
        //buddy.setAnimationByName(0, "RUN_LOSE", 0.8);
        
        addNumberPart(heartsGroup.text,'-1')
        
    }
    
    function positionPlayer(){
        
        player.body.x = 100 
        characterGroup.x = player.x
        characterGroup.y = player.y +44 
        
        if(player.body.y > game.world.height - BOT_OFFSET * 1.2 ){
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
            
            if(obj.tag == 'coin'){
                obj.body.rotateLeft(Math.random()*80 + 40)
            }
            
            if(obj.body.x < -obj.width * 0.45 && obj.used == true){
                deactivateObj(obj)
                if(obj.tag == 'floor' || obj.tag == 'brick'){
                    addObjects()
                }
                //console.log('objeto removido')
            }else if(obj.tag == 'coin' || obj.tag == 'skull'){
                if(Math.abs(obj.body.x - player.body.x) < 50 && Math.abs(obj.body.y - player.body.y) < 50){
                    if(obj.tag == 'coin'){
                        addPoint(obj)
                    }else if(obj.tag == 'skull'){
                        sound.play("wrongItem")
                        createPart('wrong',obj)
                        addWrongTween()
                    }
                    deactivateObj(obj)
                }
                
            }
        }
    }
    
    function doJump(value){
        
        
        buddy.setAnimationByName(0, "JUMP", false);
        buddy.addAnimationByName(0, "LAND", false);
        
        buddy.scale.y*=-1
        
        console.log(buddy.scale.y + ' scale')
        if(buddy.scale.y < 0){
            buddy.y = -100
        }else{
            buddy.y = 0
        }
        
        game.physics.p2.gravity.y*=-1;
        
        /*var jumpValue = value
        
        if(jumpValue == null){ jumpValue = JUMP_FORCE}
        sound.play("whoosh")
        
        buddy.isRunning = false
        
        player.body.moveUp(jumpValue )
        jumpTimer = game.time.now + 750;
        
        game.time.events.add(750, function(){
            if(gameActive == true){
                //buddy.setAnimationByName(0, "RUN", true);
            }
        } , this);*/
    
    }
    
    function update(){
        
        if(gameActive == false){
            return
        }
        
        positionPlayer()
        
        if (jumpButton.isDown){
            
            if( checkIfCanJump() && jumping == false)
            {
                jumping = true
                doJump()
            }
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
        
        var pointsImg = pointsBar.create(10,10,'atlas.amazingbros','xpcoins')
    
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

        var heartsImg = group.create(0,0,'atlas.amazingbros','life_box')
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
    
    function createPart(key,obj){
        
        var particlesNumber = 2
        
        tooMuch = true
        
        if(game.device.desktop == true && tooMuch == false){ 
            
            particlesNumber = 3
            
            var particlesGood = game.add.emitter(0, 0, 100);

            particlesGood.makeParticles('atlas.amazingbros',key);
            particlesGood.minParticleSpeed.setTo(-200, -50);
            particlesGood.maxParticleSpeed.setTo(200, -100);
            particlesGood.minParticleScale = 0.2;
            particlesGood.maxParticleScale = 1;
            particlesGood.gravity = 150;
            particlesGood.angularDrag = 30;

            particlesGood.x = obj.world.x;
            particlesGood.y = obj.world.y - 50;
            particlesGood.start(true, 1000, null, particlesNumber);

            game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
            sceneGroup.add(particlesGood)

            return particlesGood
        }else{
            key+='Part'
            var particle = sceneGroup.create(obj.world.x,obj.world.y - 20,'atlas.amazingbros',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
        }
        
    }
    
    function addWrongTween(){
        
        var number = 3
        if(pointsBar.number >= number){
            pointsBar.number-=number
            addNumberPart(pointsBar.text,'-' + number)
            pointsBar.text.setText( pointsBar.number)
        }
        
        var timeDelay = 2000
        var delay = 0
        
        //game.add.tween(sceneGroup.scale).to( { x:1.1 }, timeDelay, Phaser.Easing.Linear.None, true);
        
        if(sceneGroup.scale.y != 1){
            return
        }
        
        worldGroup.scale.y= - 1
        worldGroup.y+=game.world.height * 0.8
        
        for(var counter = 0; counter < 1;counter++){
            game.time.events.add(delay, function(){
                
                var color = Phaser.Color.getRandomColor(0,255,255)
                game.stage.backgroundColor = color
                
                var tweenAlpha = game.add.tween(sceneGroup).to({alpha : 0},timeDelay*0.1,Phaser.Easing.linear,true)
                tweenAlpha.onComplete.add(function(){
                    game.add.tween(sceneGroup).to({alpha : 1},timeDelay*0.1,Phaser.Easing.linear,true)
                })
                
            } , this);
            delay+=timeDelay
        }
        
        game.time.events.add(delay,function(){
            
            var tweenAlpha = game.add.tween(sceneGroup).to({alpha : 0},timeDelay*0.1,Phaser.Easing.linear,true)
            tweenAlpha.onComplete.add(function(){
                game.add.tween(sceneGroup).to({alpha : 1},timeDelay*0.1,Phaser.Easing.linear,true)
            })
                
            game.stage.backgroundColor = '#ffffff'
            worldGroup.scale.y = 1
            worldGroup.y-=game.world.height * 0.8
            //game.add.tween(sceneGroup.scale).to( { x:1 }, timeDelay, Phaser.Easing.Linear.None, true);
        })
    }
    
    function collisionEvent(obj1,obj2){
        
        //console.log(obj2.sprite.tag)
        var tag = obj2.sprite.tag
        
        if(obj2.sprite.used == true && gameActive == true){
            if(tag == 'coin'){
                deactivateObj(obj2.sprite)
                addPoint(obj2.sprite)

            }else if(tag == "floor" || tag == "brick"){
                if(gameActive == true && buddy.isRunning == false){
                    buddy.isRunning = true
                    if(player.body.y < obj2.sprite.body.y){
                        //buddy.setAnimationByName(0, "LAND", false);
                        buddy.addAnimationByName(0,"RUN",true)
                    }
                }
            }else if(tag == 'enemy_spike'){
                missPoint()
                createPart('wrong', obj2.sprite)
                stopGame()
            }else if(tag == "enemy_squish"){
                if(player.body.y < obj2.sprite.y - 8){
                    doJump(JUMP_FORCE * 1.5)
                    addPoint(obj2.sprite,'drop')
                    sound.play("splash")
                    deactivateObj(obj2.sprite)
                    
                }else{
                    missPoint()
                    createPart('wrong', obj2.sprite)
                    stopGame()
                }
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
            
            if(child.tag == 'coin'){
                child.body.y-=25
                if(Math.random()*2 > 1){
                    child.body.y-=80
                }
            }else if(child.tag == "enemy_squish"){
                child.body.y+=5
            }else if(child.tag == "skull"){
                child.body.velocity.x-=5
                //child.body.dynamic = true
            }
        }
    
     }
    
    function checkAdd(obj, tag){
        
        Phaser.ArrayUtils.shuffle(enemyNames)
        
        if(Math.random()*2 > 1 && gameActive == true){
            
            var nameItem = enemyNames[0]
            if(objToCheck.tag == 'floor' && tag == 'brick'){
                nameItem = 'coin'
            }
            
            if(objToCheck.spike == true){
                nameItem = 'coin'
            }
            
            if((objToCheck.body.y > obj.body.y) && (nameItem == 'enemy_spike' || nameItem == 'enemy_squish')){
                nameItem = 'coin'
            }
            

            var coin = addComplement(nameItem)
            if(coin != null){
                activateObject(pivotObjects,obj.body.y - obj.height * 0.5 - coin.height * 0.5,coin)
            }
            
            obj.spike = false
            if(nameItem == 'enemy_spike'){
                obj.spike = true
            }
        }
    }
    
    function addObstacle(tag){
        
        pivotObjects = 0
        if(objToCheck != null ){
            pivotObjects = objToCheck.body.x + objToCheck.width
        }
            
        
        for(var i = 0;i< groundGroup.length;i++){
            var child = groundGroup.children[i]
            if(child.tag == tag && child.used == false){
                if (tag == "floor"){
                    
                    activateObject(pivotObjects,game.world.height - child.height * 0.5 - BOT_OFFSET,child)
                    
                    checkAdd(child,tag)
                    objToCheck = child
                    
                }else if(tag =="brick"){
                    
                    activateObject(pivotObjects,game.world.height - OFF_BRICK - BOT_OFFSET,child)
                    
                    if(objToCheck.tag == "brick" && Math.random() * 2 > 1 && pointsBar.number > 10){
                        child.body.y-= OFF_BRICK * 0.8
                        child.top = true
                    }
                    
                    checkAdd(child,tag)
                    
                    objToCheck = child
                    
                }
                if(skullTrue == true && Math.random()*8<1){
                    var skull = addComplement('skull')
                    if(skull != null){
                        activateObject(pivotObjects,child.body.y - child.height * 0.5 - skull.height * 0.5,skull)
                    }
                    
                    skullTrue = false
                    game.time.events.add(2000, function(){
                        skullTrue = true
                    },this)
                }
                break
            }
        }
    }
    
    function randomize(index){
        var isTrue = false
        
        if(Math.random()*index < 1){
            isTrue = true
        }
                
        return isTrue
    }
    
    function createObjs(tag,scale,times){
        
        var pivotX = 0
        for(var i = 0;i<times;i++){
            var object
            if(tag == 'enemy_spike'){
                
                object = game.add.sprite(-300, 200, 'bMonster');
                //object.scale.x = -1
                groundGroup.add(object)
                object.animations.add('walk');
                object.animations.play('walk',24,true);
                
            }else if(tag == 'enemy_squish'){
                
                object = game.add.sprite(-300, 200, 'pMonster');
                groundGroup.add(object)
                object.animations.add('walk');
                object.animations.play('walk',20,true);
                
            }else if(tag == 'coin'){
                
                /*if(randomize(10)){
                    object = game.add.sprite(-300, 200, 'coinS');
                    object.animations.add('walk');
                    object.animations.play('walk',24,true); 
                    groundGroup.add(object)
                }else{*/
                    
                    var objectsList = ['carne1','carne2','fruta1','fruta2','plastico1','plastico2','enlatado1','enlatado2','verdura1','verdura2']
                    object = groundGroup.create(-300,200,'atlas.amazingbros',objectsList[indexCoin])
                    
                    indexCoin++
                //}
                  
                
                
            }else{
                object = groundGroup.create(-300,game.world.height - 350,'atlas.amazingbros',tag)
            }
            
            object.scale.setTo(scale,scale)
            object.anchor.setTo(0,1)
            object.tag = tag
            game.physics.p2.enable(object,DEBUG_PHYSICS)
            object.body.kinematic = true
            object.used = false
            
            if(tag == 'coin' || tag == 'skull'){
                object.body.data.shapes[0].sensor = true
            }
            
            if(tag == 'enemy_spike'){
                object.body.setRectangle(object.width * 0.68, object.height * 0.3);
            }else if(tag == 'enemy_squish'){
                object.body.setRectangle(object.width * 0.4, object.height * 0.8);
            }
            
            if(tag != 'coin' && tag != 'skull'){
                object.body.allowSleep = true
                player.body.createBodyCallback(object, collisionEvent, this);
            }
        }
    }
    
    function createObjects(){
        
        createObjs('plataform4_a',1.4,6)
        
        for(var i = 0; i < 6; i++){
            addObstacle('plataform4_a')
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
        
        var tag = 'plataform4_b'
        
        addObstacle(tag)
        
        //game.time.events.add(TIME_ADD, addObjects , this);
        
    }
    
    function positionFirst(){
        positionPlayer()
        
        if(gameStart == false){
            game.time.events.add(1, positionFirst , this);
        }
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
    
    function createBackground(){
        
        var pivotX = 0
        var pivotY = 0
        
        for(var i = 0; i< 5;i++){
            
            for( var u = 0; u <5;u++){
                var space = sceneGroup.create(pivotX, pivotY,'atlas.amazingbros','space')
                pivotX+= space.width
            }
            
            pivotX = 0
            pivotY+= 256
            
        }
        
    }
    
	return {
		assets: assets,
		name: "graviswitch",
		create: function(event){
            
            game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.gravity.y = WORLD_GRAVITY;
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
            
            //sound.play("marioSong")
            marioSong = game.add.audio('marioSong')
            game.sound.setDecodedCallback(marioSong, function(){
                marioSong.loopFull(0.4)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            objectsGroup = game.add.group()
            worldGroup.add(objectsGroup)
            
            characterGroup = game.add.group()
            characterGroup.x = 100
            characterGroup.y = game.world.height - BOT_OFFSET * 3
            worldGroup.add(characterGroup)
            
            buddy = game.add.spine(0,0, "mascot");
            buddy.isRunning = true
            buddy.scale.setTo(0.8,0.8)
            characterGroup.add(buddy)            
            buddy.setAnimationByName(0, "RUN", true);
            buddy.setSkinByName('normal');
            
            player = worldGroup.create(characterGroup.x, characterGroup.y,'atlas.amazingbros','yogotar')
            player.anchor.setTo(0.5,1)
            player.alpha = 0
            game.physics.p2.enable(player,DEBUG_PHYSICS)
            player.body.fixedRotation = true
            player.body.mass=50
            
            player.body.collideWorldBounds = true;
            
            positionFirst()
            
            createObjects()
            
            createPointsBar()
            createHearts()
            createControls()            
            
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