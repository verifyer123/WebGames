var runner = function(){
    
    var localizationData = {
		"EN":{
            "language":"en",
			"assetReady":"readyEn",
			"assetGo":"goEn",
			"assetExcellent":"excEn",
            "assetGiveUp":"giveUpEn"
		},

		"ES":{
            "languague":"es",
			"assetReady":"readyEs",
			"assetGo":"goEs",
			"assetExcellent":"excEs",
            "assetGiveUp":"giveUpEs",
            
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.chilimBalam",
                json: "images/chilimBalam/atlas.json",
                image: "images/chilimBalam/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/chilimBalam/fondo.png"},
            {   name:"suelo",
				file: "images/chilimBalam/suelo.png"},
            {   name:"volador",
				file: "images/chilimBalam/volador.png"},
		],
		sounds: [
            {	name: "pop",
				file: "sounds/magic.mp3"},
            {	name: "splash",
				file: "sounds/splashMud.mp3"},
            {	name: "swipe",
				file: "sounds/swipe.mp3"},
            {	name: "wrong",
				file: "sounds/wrong.mp3"},
            {	name: "ready_es",
				file: "sounds/ready_es.mp3"},
            {	name: "ready_en",
				file: "sounds/ready_en.mp3"},
            {	name: "go_es",
				file: "sounds/go_es.mp3"},
            {	name: "go_en",
				file: "sounds/go_en.mp3"},
			{	name: "explode",
				file: "sounds/explode.mp3"},
            {	name: "shootBall",
				file: "sounds/shootBall.mp3"},
            {	name: "click",
				file: "sounds/pop.mp3"},
		],
	}
    
    var SPEED = 200 
    var TIME_ADD = 1000
    
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
    var gameActive = true
    var jumpTimer = 0
    var characterGroup = null
    var pointsBar = null
    var throwTime = null
    var lives = null
    var heartsGroup = null 
    var particlesGroup, particlesGood, particlesWrong
    

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){
        
        gameSpeed =  SPEED
        game.stage.backgroundColor = "#ffffff"
        jumpTimer = 0
        gameActive = true
        lives = 1
        pivotObjects = 0
        buttonPressed = false
        tooMuch = false
        GRAVITY_OBJECTS = 4
        yAxis = p2.vec2.fromValues(0, 1);
        objectsList = []
        
	}
    

    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)

		var blackScreen = new Phaser.Graphics(game)
		blackScreen.alpha = 0.3
		blackScreen.beginFill(0x0)
		blackScreen.drawRect(0, 0, game.width, game.height)
		blackScreen.endFill()

		startGroup.add(blackScreen)
        
        
		var readySign = startGroup.create(0, 0, "atlas.chilimBalam", 'readyEs')
		readySign.alpha = 0
		readySign.anchor.setTo(0.5, 0.5)
		readySign.x = game.world.centerX
		readySign.y = game.world.centerY - 50
		startGroup.add(readySign)
        
        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        
            
            
        var goSign = startGroup.create(0, 0, "atlas.chilimBalam", 'goEs')
        goSign.alpha = 0
        goSign.anchor.setTo(0.5, 0.5)
        goSign.x = game.world.centerX
        goSign.y = game.world.centerY - 50
        startGroup.add(goSign)

        var tweenSign = game.add.tween(goSign).to({y: game.world.centerY, alpha: 1}, 500, Phaser.Easing.Cubic.Out, true, 750)
        tweenSign.onComplete.add(function(){
            sound.play("go_es")

            var finalTween = game.add.tween(goSign).to({y: game.world.centerY - 100, alpha: 0}, 500, Phaser.Easing.Cubic.Out, true, 500)
            game.add.tween(startGroup).to({ alpha: 0}, 500, Phaser.Easing.Cubic.Out, true, 500)
            finalTween.onComplete.add(function(){
                gameActive = true
                //timer.start()
                //game.time.events.add(throwTime *0.1, dropObjects , this);
                //objectsGroup.timer.start()
                game.time.events.add(TIME_ADD, addObjects , this);
            })
        })
    } 
    
    
    function preload() {
        
        game.plugins.add(Fabrique.Plugins.Spine);
        game.stage.disableVisibilityChange = true;

        game.load.spine('mascot', "images/spines/mascotaAmazing.json");
        
    }
    
    function inputButton(obj){
        
        if(gameActive == true){
            if(obj.tag == 'left'){
                moveLeft = true
                moveRight = false
                characterGroup.scale.x = -1
            }else{
                moveLeft = false
                moveRight = true
                characterGroup.scale.x = 1
            }
            buddy.setAnimationByName(0, "RUN", 0.8);
        }
    }
    
    function releaseButton(obj){
        
        if(gameActive == true){
            if(obj.tag =='left'){
                moveLeft = false
            }else{
                moveRight = false
            }
            buddy.setAnimationByName(0, "IDLE", 0.8);
        }
    }
    
    function createControls(){
        
        var spaceButtons = 220
        
        var bottomRect = new Phaser.Graphics(game)
        bottomRect.beginFill(0xffffff);
        bottomRect.drawRect(0, game.world.height, game.world.width, -game.world.height * 0.175);
        bottomRect.endFill();
        bottomRect.anchor.setTo(0,1)
        sceneGroup.add(bottomRect)
        
        var button1 = sceneGroup.create(game.world.centerX - spaceButtons, game.world.height - 155, 'atlas.chilimBalam','boton')
        button1.inputEnabled = true
        button1.events.onInputDown.add(inputButton)
        button1.tag = 'left'
        button1.events.onInputUp.add(releaseButton)
        
        var button2 = sceneGroup.create(game.world.centerX + spaceButtons, game.world.height - 155, 'atlas.chilimBalam','boton')
        button2.scale.x = -1
        button2.inputEnabled = true
        button2.events.onInputDown.add(inputButton)
        button2.tag = 'right'
        button2.events.onInputUp.add(releaseButton)
        
    }
    
    function stopGame(win){
        
        game.add.tween(objectsGroup).to({alpha:0},250, Phaser.Easing.Cubic.In,true)
        
        //objectsGroup.timer.pause()
        gameActive = false
        buddy.setAnimationByName(0,"SAD",0.6)
        //timer.pause()
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("resultRunner")
			resultScreen.setScore(true, pointsBar.number)

			sceneloader.show("resultRunner")
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
    
    function addPoint(){
        
        sound.play("pop")
        createPart('star', characterGroup.cup)
        createTextPart('+1', characterGroup.cup)
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        GRAVITY_OBJECTS+=0.2
        throwTime-=17
        //throwTimeItems-=10
        
    }
    
    function missPoint(){
        
        sound.play("wrong")
        
        lives--;
        //changeImage(0,heartsGroup.children[lives])
        heartsGroup.text.setText('X ' + lives)
        //buddy.setAnimationByName(0, "RUN_LOSE", 0.8);
        
        if(lives == 0){
            stopGame(false)
        }
        
    }
    
    function deactivateObject(obj){
        obj.alpha = 0
        obj.active = false
        obj.x = -100
        objectsGroup.remove(obj)
    }
    
    function checkPos(obj){
        
        var cup = characterGroup.cup
        //console.log(cup.world.x + ' cupx')
        if(obj.active == true){
            if(Math.abs(cup.world.x - obj.x) < cup.width * 0.5 && Math.abs(cup.world.y - obj.y) < cup.height*0.6){
                deactivateObject(obj)
                if(obj.tag == 'candy'){
                    addPoint()
                }else{
                    createPart('wrong',characterGroup.cup)
                    missPoint()
                }
            }else if(obj.y > game.world.height * 0.825){
                deactivateObject(obj)
                if(obj.tag == 'candy'){
                    //missPoint()
                    createPart('drop',obj)
                    //sound.play("splash")
                }else if(obj.tag == 'obstacle'){
                    createPart('smoke',obj)
                    //sound.play("explode")
                }
            }else if(Math.abs(cup.world.x - obj.x) < cup.width * 0.5 && Math.abs(cup.world.y + 45 - obj.y) < cup.height*0.6 && obj.tag == 'candy'){
                deactivateObject(obj)
                addPoint()
            }
        }
    }
    
    function positionPlayer(){
        player.body.x = 100 
        characterGroup.x = player.x
        characterGroup.y = player.y +50 
        
    }
    
    function checkObjects(){
        
        //console.log( objectsList.length + 'cantidad objetos')
        for(var index = 0;index<objectsList.length;index++){
            var obj = objectsList[index]
            if(obj.body.x < -obj.width && obj.used == true){
                obj.body.velocity.x = 0
                obj.used = false
                obj.body.y = -500
                //console.log('objeto removido')
            }
        }
    }
    
    function update(){
        
        if(gameActive == false){
            return
        }
        
        positionPlayer()
        
        if (jumpButton.isDown && game.time.now > jumpTimer && checkIfCanJump())
        {
            player.body.moveUp(600);
            jumpTimer = game.time.now + 750;
        }
        
        checkObjects()
        
        //console.log(objToCheck.x + ' position x')
        //pivotObjects = objToCheck.body.x + objToCheck.width
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
    
    function createTime(){
        
        timeGroup = game.add.group()
        timeGroup.x = game.world.right
        timeGroup.y = 0
        sceneGroup.add(timeGroup)
        
        var timeImg = timeGroup.create(0,0,'atlas.chilimBalam','time')
        timeImg.width*=1.3
        timeImg.height*=1.3
        timeImg.anchor.setTo(1,0)
        
        var fontStyle = {font: "27px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var timerText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        timerText.x = -timeImg.width * 0.55
        timerText.y = timeImg.height * 0.18
        timeGroup.add(timerText)
        
        timeGroup.textI = timerText
        timeGroup.number = 0
        
        timer = game.time.create(false);
        timer.loop(1, updateSeconds, this);
                
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(0,10,'atlas.chilimBalam','xpcoins')
        pointsImg.x = game.world.width - pointsImg.width * 1.2
        pointsImg.width *=1
        pointsImg.height*=1
    
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

        group.create(0,0,'atlas.chilimBalam','life_box')

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
    
     function updateSeconds(){
        
        timeGroup.number += 1;
        timeGroup.textI.setText(timeGroup.number / 100)
        
    }
    
    function activateObject(objToUse){
                
        var posX = game.rnd.integerInRange(50, game.world.width - 50)
        
        if(objectsGroup.length > 0){
            
            objToUse.x = objectsGroup.children[0].x
            while (checkPosObj(posX)){
                posX = game.rnd.integerInRange(75, game.world.width - 75)
                //if(posX < 75){ posX = 75}
                if(gameActive == false){ break}
            }
            
        }
        
        objToUse.alpha = 1
        objToUse.x = posX
        objToUse.y = -50
        objToUse.active = true
        objectsGroup.add(objToUse)
        
        //console.log(objToUse.x + ' position X')
        
    }
    
    function createPart(key,obj){
        
        var particlesNumber = 2
        
        tooMuch = true
        //console.log('fps ' + game.time.fps)
        if (game.time.fps < 45 && tooMuch == false){
            tooMuch = true
        }
        
        if(game.device.desktop == true && tooMuch == false){ 
            
            particlesNumber = 3
            
            var particlesGood = game.add.emitter(0, 0, 100);

            particlesGood.makeParticles('atlas.chilimBalam',key);
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
            var particle = sceneGroup.create(obj.world.x,obj.world.y - 60,'atlas.chilimBalam',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
        }
        
    }
    
    function collisionEvent(obj1,obj2){
        
        console.log(obj2.sprite.tag)
       //console.log('chocaste con ' + obj1.body.x)
    }
    
    function addObstacle(tag){
        
        pivotObjects = 0
        if(objToCheck != null ){
            pivotObjects = objToCheck.body.x + objToCheck.width
        }
        
        //console.log(objectsList.length + '  numero objetos, ' + pivotObjects + ' pivote' )
        
        for(var i = 0;i< groundGroup.length;i++){
            var child = groundGroup.children[i]
            if(child.tag == tag && child.used == false){
                if (tag == "floor"){
                    child.body.x = pivotObjects
                    child.body.y = game.world.height
                    child.used = true
                    child.body.velocity.x = -gameSpeed 
                    objectsList[objectsList.length] = child
                    objToCheck = child
                }else if(tag =="fly"){
                    child.body.x = pivotObjects
                    child.body.y = game.world.height - 350
                    child.used = true
                    child.body.velocity.x = -gameSpeed 
                    objectsList[objectsList.length] = child
                    objToCheck = child
                }
                break
            }
        }
    }
    
    function createFloor(){
        
        var pivotX = 0
        for(var i = 0;i<8;i++){
            
            var floor = groundGroup.create(-300,game.world.height,'suelo')
            floor.scale.setTo(2.5,2.5 )
            floor.anchor.setTo(0,1)
            floor.tag = "floor"
            game.physics.p2.enable(floor,true)
            floor.body.kinematic = true
            floor.used = false
            
            player.body.createBodyCallback(floor, collisionEvent, this);
        }
    }
    
    function createFlyFloor(){
        
        var pivotX = 0
        for(var i = 0;i<8;i++){
            
            var floor = groundGroup.create(-300,game.world.height - 300,'volador')
            floor.scale.setTo(2.5,2.5)
            floor.anchor.setTo(0,1)
            floor.tag = "fly"
            game.physics.p2.enable(floor,true)
            floor.body.kinematic = true
            floor.used = false
            
            player.body.createBodyCallback(floor, collisionEvent, this);
        }
    }
    
    function createObjects(){
        
        createFloor()
        createFlyFloor()
        
        for(var i = 0; i < 5; i++){
            addObstacle("floor",true)
        }
        
    }
    
    function addObjects(){
        
        var tag = "floor"
        if(Math.random()*2 > 1){
            tag = "fly"
        }
        addObstacle(tag)
        
        game.time.events.add(TIME_ADD, addObjects , this);
        
    }
    
	return {
		assets: assets,
		name: "runner",
		create: function(event){
            
            game.physics.startSystem(Phaser.Physics.P2JS);
            game.physics.stopSystem(Phaser.Physics.P2JS)

            game.physics.p2.gravity.y = 800;
            game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            game.physics.p2.world.setGlobalStiffness(1e5);
            
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            
			sceneGroup = game.add.group()
            
            var background = sceneGroup.create(0,0,'fondo')
            background.width = game.world.width
            background.height = game.world.height * 1.02
            
            groundGroup = game.add.group()
            sceneGroup.add(groundGroup)
            
            loadSounds()
			initialize()            
            
            objectsGroup = game.add.group()
            sceneGroup.add(objectsGroup)
            
            characterGroup = game.add.group()
            characterGroup.x = 100
            characterGroup.y = background.height * 0.72   
            sceneGroup.add(characterGroup)
            
            buddy = game.add.spine(0,0, "mascot");
            buddy.scale.setTo(1,1)
            characterGroup.add(buddy)            
            buddy.setAnimationByName(0, "RUN", true);
            buddy.setSkinByName('normal');
            
            player = sceneGroup.create(characterGroup.x, characterGroup.y,'atlas.chilimBalam','gomita4')
            player.anchor.setTo(0.5,1)
            player.alpha = 0
            game.physics.p2.enable(player,true)
            player.body.fixedRotation = true
            //player.body.kinematic = true
            player.body.mass=1000
            
            positionPlayer()
            
            var topRect = new Phaser.Graphics(game)
            topRect.beginFill(0xffffff);
            topRect.drawRect(0, 0, game.world.width, 60);
            topRect.endFill();
            topRect.anchor.setTo(0,0)
            sceneGroup.add(topRect)
            
            createObjects()
            
            createPointsBar()
            createHearts()
            
            
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