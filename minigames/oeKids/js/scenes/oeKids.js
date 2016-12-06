var soundsPath = "../../shared/minigames/sounds/"
var oeKids = function(){
    

	assets = {
        atlases: [
            {   
                name: "atlas.openEnglish",
                json: "images/openEnglish/atlas.json",
                image: "images/openEnglish/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/openEnglish/bgd.png"},
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
            {	name: "wrongItem",
				file: soundsPath + "wrongItem.mp3"},
            {   name: "green"
                file: "sounds/green"},
            {   name: "blue"
                file: "sounds/blue"},
            {   name: "red"
                file: "sounds/red"},
            {   name: "yellow"
                file: "sounds/yellow"},
            {   name: "instructions"
                file: "sounds/instructions"},
		],
	}
    
    var SPEED = 225 
    var TIME_ADD = 600
    var JUMP_FORCE = 100
    var DEBUG_PHYSICS = false
    var WORLD_GRAVITY = 100
    var OFF_BRICK = 330
    var BOT_OFFSET = 105
    var NUMBER_OF_CANDIES = 40
    
    var candyIndex = 0
    var marioSong = null
    var enemyNames = null
    var consecFloor, consecBricks
    var gameStart = false
    var jumping = false
    var yAxis = null
    var objToCheck
    var gameSpeed = null
    var objectsList = null
    var orderList
    var pivotObjects
    var player
	var sceneGroup = null
    var groundGroup = null
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
        
        game.stage.backgroundColor = "#ffffff"
        
        enemyNames = ['coin']
        gameStart = false
        gameSpeed =  SPEED
        
        candyIndex = game.rnd.integerInRange(1, 4)
        jumpTimer = 0
        gameActive = false
        lives = 1
        pivotObjects = 0
        objToCheck = null
        buttonPressed = false
        tooMuch = false
        orderList = []
        
        objectsList = []
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
        game.stage.disableVisibilityChange = true;
        
        game.load.spine('delta', "images/spines/skeleton.json");
        
        
        game.load.spritesheet('coinS', 'images/neon/coinS.png', 68, 70, 12);
        game.load.audio('neonSong', soundsPath + 'songs/melodic_basss.mp3');
        
        
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
        
        groupButton = game.add.group()
        groupButton.x = game.world.centerX
        groupButton.y = game.world.height -75
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var button1 = groupButton.create(0,0, 'atlas.openEnglish','button_off')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.openEnglish','button_on')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)
        
        var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, 'Volar', fontStyle)
        pointsText.x = groupButton.x
        pointsText.y = groupButton.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)
        
        
        
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
        
        marioSong.stop()
        
        sound.play("gameLose")
        stopWorld()
        
        game.add.tween(objectsGroup).to({alpha:0},250, Phaser.Easing.Cubic.In,true)
        
        gameActive = false
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(pointsBar.number,win)

			//amazing.saveScore(pointsBar.number) 			
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
    
    function addPoint(obj){
        
        sound.play("pop")
        
        createPart('star', obj)
        createTextPart('+1', obj)
                
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        var bar = sceneGroup.bar
        
        if(bar.scale.x < 1){
            bar.scale.x+=0.1
        }
        
        addNumberPart(pointsBar.text,'+1')
        
    }
    
    function removePoint(obj){
        
        sound.play("wrong")
        
        createPart('wrong', obj)
        createTextPart('-1', obj)
                
        pointsBar.number--
        pointsBar.text.setText(pointsBar.number)
        
        var bar = sceneGroup.bar
        
        if(bar.scale.x > 0.1){
            bar.scale.x-=0.1
        }
        
        addNumberPart(pointsBar.text,'-1')
        
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
    
    function positionPlayer(){
        
        if(game.physics.p2.gravity.y !=0){
            
            if(player.lastpos < player.y){
            
            if(buddy.angle<45){
                buddy.angle+=0.5
            }
            }else{
                if(buddy.angle > -45){
                    buddy.angle-=0.75
                }
            }
            
        }

        player.body.x = 150 
        characterGroup.x = player.x
        characterGroup.y = player.y +44 
        
        player.lastpos = player.body.y
        
        if(player.body.y > game.world.height - 50 ){
            stopGame(false)
        }
        
    }
    
    function deactivateObj(obj){
        
        obj.body.velocity.x = 0
        obj.used = false
        obj.body.y = -500
        
        if(obj.isPoint){
            addObstacle('candy0' + orderList[sceneGroup.order])   
        }
        
    }
    
    function checkObjects(){
        
        //console.log( objectsList.length + 'cantidad objetos')
        for(var index = 0;index<objectsList.length;index++){
            var obj = objectsList[index]
            if(obj.body.x < -obj.width * 0.45 && obj.used == true){
                deactivateObj(obj)
                
                //console.log('objeto removido')
            }else if(obj.isPoint){
                if(Math.abs(obj.body.x - player.body.x) < 100 && Math.abs(obj.body.y - player.body.y) < 100){
                    
                    if(obj.index == candyIndex){
                        addPoint(obj)
                    }else{
                        removePoint(obj)
                    }
                    
                    deactivateObj(obj)
                }
                
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
        
        for(var i = 0; i< particlesGroup.length;i++){
            var part = particlesGroup.children[i]
            
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
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = game.world.height
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,-10,'atlas.openEnglish','counter')
        pointsImg.anchor.setTo(1,1)
    
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#0e5256", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, -50, -pointsImg.height * 0.6, " X 0", fontStyle)
        pointsText.anchor.setTo(1,0.5)
        pointsBar.add(pointsText)
        
        var obj = pointsBar.create(-pointsImg.width * 0.7,-pointsImg.height * 0.6, 'atlas.openEnglish','candy0' + candyIndex)
        obj.scale.setTo(0.6,0.6)
        obj.anchor.setTo(0.6,0.6)
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }
    
    function createPart(key,obj){
        
        var particlesNumber = 2
        
        tooMuch = true
        
        if(game.device.desktop == true && tooMuch == false){ 
            
            particlesNumber = 3
            
            var particlesGood = game.add.emitter(0, 0, 100);

            particlesGood.makeParticles('atlas.openEnglish',key);
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
            var particle = sceneGroup.create(obj.world.x,obj.world.y,'atlas.openEnglish',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
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

            }else if(tag == "obstacle" || tag == "obstacle2"){
                
                //stopGame()
                
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
            pivotObjects = objToCheck.body.x + objToCheck.width * 2
        }
            
        
        for(var i = 0;i< groundGroup.length;i++){
            var child = groundGroup.children[i]
            if(child.tag == tag && child.used == false){
                if (child.isPoint){
                    
                    activateObject(pivotObjects,game.world.height - (Math.random() * game.world.height * 0.3) - 300,child)
                    
                    objToCheck = child
                    
                    sceneGroup.order++
                    
                }
                break
            }
        }
    }
    
    function createObjs(tag,scale,times,number){
        
        var pivotX = 0
        for(var i = 0;i<times;i++){
            var object, object2
 
            if(tag != 'monster'){
                
                object = groundGroup.create(-300,game.world.height - 350,'atlas.openEnglish',tag)
                object.isPoint = true
                object.index = number

            }
            
            object.scale.setTo(scale,scale)
            object.anchor.setTo(0,1)
            object.tag = tag
            game.physics.p2.enable(object,DEBUG_PHYSICS)
            object.body.kinematic = true
            object.used = false
            
            if(!object.isPoint){
                object.body.allowSleep = true
                player.body.createBodyCallback(object, collisionEvent, this);
            }else{
                object.body.data.shapes[0].sensor = true
            }
            
        }
    }
    
    
    function positionFlag(){
        
    }
    
    function createObjects(){
        
        for(var i = 1;i<5;i++){
            createObjs('candy0' + i,1,10,i)
        }
        
        for(var i = 0; i<NUMBER_OF_CANDIES;i++){
            
            if(game.rnd.integerInRange(1, 4) <2){
                orderList[orderList.length] = game.rnd.integerInRange(1, 4)
            }else{
                orderList[orderList.length] = candyIndex
                //addObstacle('candy0' + candyIndex)
            }
            
        }
        
        sceneGroup.order = 0
        
        for(var i = 0;i<5;i++){
            addObstacle('candy0' + orderList[sceneGroup.order])
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
    
    
    function createTrail(){
        
        for(var i = 0;i<50;i++){
            
            var particle =  particlesGroup.create(0,0,'atlas.neon','ship')
            particle.anchor.setTo(0.5,1)
            particle.scale.setTo(0.5,0.5)
            particle.firstScale = particle.scale.x
            
            particle.used = false
            particle.alpha = 0
            
        }
        
    }
    
    function createCandyBar(){
        
        var candyColors = [0xffce00,0xf83a4b,0x101fc7,0x159b3a]
        
        var mask = sceneGroup.create(20, game.world.height - 20,'atlas.openEnglish','power01')
        mask.anchor.setTo(0,1)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x058fff)
        rect.drawRect(mask.x,mask.y - 80, mask.width, mask.height)
        rect.anchor.setTo(0,1)
        rect.endFill()
        sceneGroup.add(rect)
        
        mask.mask = rect
        mask.tint = candyColors[candyIndex - 1]
        rect.scale.x = 0.1
        
        sceneGroup.bar = rect
        
        var meter = sceneGroup.create(mask.x,mask.y,'atlas.openEnglish','power02')
        meter.anchor.setTo(0,1)
        
    }
    
	return {
		assets: assets,
		name: "oeKids",
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
            
            var background = worldGroup.create(-2,-2,'fondo')
            background.width = game.world.width +2
            background.height = game.world.height +2.
            
            groundGroup = game.add.group()
            worldGroup.add(groundGroup)
            
            loadSounds()
			initialize()       
            
            //sound.play("marioSong")
            marioSong = game.add.audio('neonSong')
            game.sound.setDecodedCallback(marioSong, function(){
                //marioSong.loopFull(0.6)
                //marioSong.stop()
            }, this);
            
            objectsGroup = game.add.group()
            worldGroup.add(objectsGroup)
            
            particlesGroup = game.add.group()
            worldGroup.add(particlesGroup)
            
            characterGroup = game.add.group()
            characterGroup.x = 400
            characterGroup.y = game.world.height - BOT_OFFSET * 4
            worldGroup.add(characterGroup)
            
            /*buddy = characterGroup.create(0,-45,'atlas.openEnglish','yogotar')
            buddy.anchor.setTo(0.5,0.5)
            
            createTrail()
            */
            buddy = game.add.spine(0,0, 'delta');
            buddy.scale.setTo(1,1)
            buddy.setAnimationByName(0, "FLY", true);
            buddy.setSkinByName('normal');
            characterGroup.add(buddy)
            
            player = worldGroup.create(characterGroup.x + 75, characterGroup.y,'atlas.openEnglish','yogotar')
            player.anchor.setTo(0.5,1)
            player.scale.setTo(0.37,0.37)
            player.alpha = 0
            game.physics.p2.enable(player,DEBUG_PHYSICS)
            player.body.fixedRotation = true
            player.body.mass=50
            player.lastpos = player.y
            
            player.body.collideWorldBounds = true;
                                    
            createObjects()
            
            createPointsBar()
            createCandyBar()
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