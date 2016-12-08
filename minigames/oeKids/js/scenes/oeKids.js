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
            {   name: "green",
                file: "sounds/green.mp3"},
            {   name: "blue",
                file: "sounds/blue.mp3"},
            {   name: "red",
                file: "sounds/red.mp3"},
            {   name: "yellow",
                file: "sounds/yellow.mp3"},
            {   name: "instructions",
                file: "sounds/instructions.mp3"},
            {	name: "click",
				file: soundsPath + "pop.mp3"},
		],
	}
    
    var SPEED = 225 
    var TIME_ADD = 600
    var JUMP_FORCE = 520
    var DEBUG_PHYSICS = false
    var WORLD_GRAVITY = 800
    var BOT_OFFSET = 105
    var NUMBER_OF_CANDIES = 40
    var OFFSET_OBJ = 256
    
    var candyIndex = 0
    var lastPivot
    var marioSong = null
    var enemyNames = null
    var overlayGroup = null
    var colorToUse = null
    var consecFloor, consecBricks
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
    var resultScreen = null
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
        gameSpeed =  SPEED
        
        candyIndex = game.rnd.integerInRange(1, 4)
        jumpTimer = 0
        gameActive = false
        lives = 1
        lastPivot = 0
        pivotObjects = 0
        objToCheck = null
        buttonPressed = false
        tooMuch = false
        orderList = []
        var colors = ['yellow','red','blue','green']
        colorToUse = colors[candyIndex - 1]
        
        
        objectsList = []
        consecBricks = 0
        
	}
    
    function start(){
        
        sound.play("instructions")
        game.time.events.add(1500,function(){
            sound.play(colorToUse)
        },this)
        gameActive = true
        
    }
    
    function animateScene() {
                        
        sceneGroup.alpha = 0
        var tweenAlpha = game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        
        changeVelocityGame(0)

    } 
    
    function preload() {
        
        game.plugins.add(Fabrique.Plugins.Spine);
        game.stage.disableVisibilityChange = true;
        
        game.load.spine('arthurius', "images/spines/Arturius.json");
        game.load.spine('delta', "images/spines/skeleton.json");
        
        
        game.load.spritesheet('monster', 'images/openEnglish/monster.png', 292, 237, 17);
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
        
    }
    
    function changeVelocityGame(velocity){
        
        for(var i = 0;i<groundGroup.length;i++){
            var child = groundGroup.children[i]
            child.body.velocity.x = velocity
        }
    }
    
    function stopGame(win){
        
        marioSong.stop()
        
        if(!win){
            sound.play("gameLose")
            game.add.tween(buddy).to({y:buddy.y + 100,alpha:0},500,Phaser.Easing.linear,true)
        }
        
        stopWorld()
        
        game.add.tween(objectsGroup).to({alpha:0},250, Phaser.Easing.Cubic.In,true)
        
        gameActive = false
        
        
        if(win){
            changeImage(0,resultScreen.text)
        }else{
            changeImage(1,resultScreen.text)
            resultScreen.yogo.setAnimationByName(0,"LOSE",true)
        }
        
        game.add.tween(resultScreen).to({alpha :1},500,Phaser.Easing.linear,true).onComplete.add(function(){
            resultScreen.button.inputEnabled = true
        })
        
        /*tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			/*var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(pointsBar.number,win)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
            
            
		})*/
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
        sound.play(colorToUse)
        
        createPart('star', obj)
        createTextPart('+1', obj)
                
        pointsBar.number++
        pointsBar.text.setText('x ' + pointsBar.number)
        
        var bar = sceneGroup.bar
        
        if(bar.scale.x < 1){
            bar.scale.x+=0.05
        }
        
        addNumberPart(pointsBar.text,'+1')
        
    }
    
    function removePoint(obj){
        
        sound.play("wrong")
        
        createPart('wrong', obj)
        createTextPart('-1', obj)
            
        if(pointsBar.number > 0){
            pointsBar.number--
        }
        
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
            
            if(buddy.angle<30){
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
        characterGroup.y = player.y +20 
        
        player.lastpos = player.body.y
        
        if(player.body.y > game.world.height - 25 ){
            stopGame(false)
        }
        
    }
    
    function deactivateObj(obj){
        
        obj.body.velocity.x = 0
        obj.body.velocity.y = 0
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
                if(Math.abs(obj.body.x - player.body.x) < 75 && Math.abs(obj.body.y - player.body.y) < 75){
                    
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
    
    function doJump(value){
        
        var jumpValue = value
        
        if(jumpValue == null){ jumpValue = JUMP_FORCE}
        sound.play("whoosh")
                
        //buddy.setAnimationByName(0, "JUMP", false);
        //buddy.addAnimationByName(0, "LAND", false);
        
        if(game.physics.p2.gravity.y == 0){
            game.physics.p2.gravity.y = WORLD_GRAVITY
            changeVelocityGame(-gameSpeed)
            //startParticles()
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
    
    function collisionEvent(obj1,obj2){
        
        //console.log(obj2.sprite.tag)
        var tag = obj2.sprite.tag
        
        if(obj2.sprite.used == true && gameActive == true){
            if(tag == 'monster'){
                removePoint(player)
                deactivateObj(obj2.sprite)
            }else if(tag == 'flag'){
                buddy.setAnimationByName(0,"WIN",true)
                sound.play("pop")
                stopGame(true)
            }
        }
    }
    
     function activateObject(posX, posY, child){
        //console.log(child.tag + ' tag,')
        if(child != null){
            
            child.body.x = posX
            child.body.y = posY
            child.used = true
            child.body.velocity.x = -gameSpeed 
            objectsList[objectsList.length] = child
            
        }
    
     }
    
    function setMonsterSpeed(obj){
        
        if(!obj.used){
            return
        }
        
        //console.log('change speed monster')
        obj.speed*=-1
        obj.body.velocity.y = obj.speed
        
        game.time.events.add(2000,function(){
            setMonsterSpeed(obj)
        },this)
        
    }
    
    function addObstacle(tag){
        
        pivotObjects = 450
        if(objToCheck != null){
            pivotObjects = objToCheck.body.x + OFFSET_OBJ
        }
        
        /*if(Math.abs(lastPivot - pivotObjects) < 20){
            pivotObjects+= OFFSET_OBJ
        }*/
        
        //console.log(pivotObjects + ' pivot,' + tag + ' objTag')

        lastPivot = pivotObjects
        
        for(var i = 0;i< groundGroup.length;i++){
            var child = groundGroup.children[i]
            if(child.tag == tag && child.used == false){
                
                objToCheck = child
                if (child.isPoint){
                    
                    activateObject(pivotObjects,game.world.height - (Math.random() * game.world.height * 0.7) - 150,child)

                    if(game.rnd.integerInRange(1, 4) <2){
                        
                        addObstacle('monster')
                    }
                    
                    sceneGroup.order++
                    
                    if(sceneGroup.order >= NUMBER_OF_CANDIES){
                        addObstacle('flag')
                    }
                    
                }else if(tag == 'monster'){
                    
                    activateObject(pivotObjects,game.world.height - (Math.random() * game.world.height * 0.4) - 200,child)
                    child.speed = 100
                    setMonsterSpeed(child)
                }else if(tag == 'flag'){
                    activateObject(pivotObjects,game.world.height - 250,child)
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

            }else if(tag == 'monster'){
                
                object = game.add.sprite(-300, 200, 'monster');
                groundGroup.add(object)
                object.animations.add('walk');
                object.animations.play('walk',24,true);
                
            }
            
            object.scale.setTo(scale,scale)
            object.anchor.setTo(0,1)
            object.tag = tag
            game.physics.p2.enable(object,DEBUG_PHYSICS)
            object.body.kinematic = true
            object.used = false
        
            if(tag == 'flag'){
                object.isPoint = false
            }
            
            if(!object.isPoint){
                
                object.body.allowSleep = true
                player.body.createBodyCallback(object, collisionEvent, this);
                
                if(tag == 'monster'){
                    object.body.setRectangle(object.width * 0.4, object.height * 0.4);
                }else if(tag == 'flag'){
                    object.body.setRectangle(object.width * 1, object.height * 2);
                }
                
            }else{
                object.body.data.shapes[0].sensor = true
            }
            
        }
    }
    
    function createObjects(){
        
        for(var i = 1;i<5;i++){
            createObjs('candy0' + i,0.8,10,i)
        }
        
        createObjs('monster',0.7,5)
        createObjs('flag',1,1)
        
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
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
        worldGroup.add(groundGroup)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width, game.world.height)
        rect.alpha = 0.6
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                gameActive = true
                overlayGroup.y = -game.world.height
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'atlas.openEnglish','introscreen')
        plane.anchor.setTo(0.5,0.5)
        
        var button = overlayGroup.create(plane.x, plane.y + 125,'atlas.openEnglish','button')
        button.anchor.setTo(0.5,0.5)
        
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, '¡Volar!', fontStyle)
        pointsText.x = button.x
        pointsText.y = button.y
        pointsText.anchor.setTo(0.5,0.5)
        overlayGroup.add(pointsText)
        
        var fontStyle = {font: "25px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, 'Haz click en el botón para esquivar\n los obstáculos y agarra los dulces del\n color correcto.', fontStyle)
        pointsText.x = button.x
        pointsText.y = button.y - 225
        pointsText.anchor.setTo(0.5,0.5)
        overlayGroup.add(pointsText)
        
    }
    
    function retryGame(obj){
        
        changeImage(0,obj.parent)
        sound.play("click")
        
    }
    
    function releaseRetry(obj){
        
        changeImage(1,obj.parent)
        obj.inputEnabled = false
        sceneloader.show("oeKids")
        
    }
    
    function createResultScreen(){
        
        resultScreen = game.add.group()
        sceneGroup.add(resultScreen)
        
        var fade = new Phaser.Graphics(game)
        fade.beginFill(0x000000)
        fade.drawRect(0,0,game.world.width, game.world.height)
        fade.alpha = 0.6
        fade.endFill()
        resultScreen.add(fade)        
        
        var yogotar = game.add.spine(game.world.centerX,game.world.centerY + 125, 'arthurius');
        yogotar.scale.setTo(0.7,0.7)
        yogotar.setAnimationByName(0, "WIN", true);
        yogotar.setSkinByName('Arturius');
        resultScreen.add(yogotar)
        
        resultScreen.yogo = yogotar
        
        var groupText = game.add.group()
        groupText.x = game.world.centerX
        groupText.y = game.world.centerY - 250
        resultScreen.add(groupText)
        
        var text1 = groupText.create(0,0,'atlas.openEnglish','buentrabajo')
        text1.anchor.setTo(0.5,0.5)
        
        var text2 = groupText.create(0,0,'atlas.openEnglish','noterindas')
        text2.anchor.setTo(0.5,0.5)
        
        resultScreen.text = groupText
        
        changeImage(0,groupText)
        
        var retryButton = game.add.group()
        retryButton.x = game.world.centerX
        retryButton.y = game.world.centerY + 250
        retryButton.isPressed = false
        resultScreen.add(retryButton)
        
        var button1 = retryButton.create(0,0, 'atlas.openEnglish','retry_off')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = retryButton.create(0,0, 'atlas.openEnglish','retry_on')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = false
        button2.events.onInputDown.add(retryGame)
        button2.events.onInputUp.add(releaseRetry)
        
        resultScreen.button = button2
        resultScreen.alpha = 0
        
        
    }
    
    function positionFirst(){
        
        positionPlayer()
        
        if(gameActive == false){
            game.time.events.add(1, positionFirst , this);
        }
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
            characterGroup.x = 150
            characterGroup.y = game.world.height - BOT_OFFSET * 4 + 20
            worldGroup.add(characterGroup)
            
            buddy = game.add.spine(0,0, 'delta');
            buddy.scale.setTo(1,1)
            buddy.setAnimationByName(0, "FLY", true);
            buddy.setSkinByName('normal');
            characterGroup.add(buddy)
            
            player = worldGroup.create(characterGroup.x + 75, characterGroup.y,'atlas.openEnglish','yogotar')
            player.anchor.setTo(0.5,1)
            player.scale.setTo(0.5,0.5)
            player.alpha = 0
            game.physics.p2.enable(player,DEBUG_PHYSICS)
            player.body.fixedRotation = true
            player.body.mass=50
            player.lastpos = player.y
            
            player.body.collideWorldBounds = true;
            
            positionFirst()
            
            createObjects()
            
            createPointsBar()
            createCandyBar()
            createControls()            
            
            //createControls()
            
            game.physics.p2.setImpactEvents(true);
            
            animateScene()
            
            createOverlay()
            createResultScreen()
            
		},
        preload:preload,
        update:update,
		show: function(event){
			loadSounds()
			initialize()
		}
	}

}()