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
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "wrongItem",
				file: soundsPath + "wrongItem.mp3"},
            {	name: "spaceship",
				file: soundsPath + "spaceship.mp3"},
            {	name: "laserexplode",
				file: soundsPath + "laserexplode.mp3"},
            {	name: "step",
				file: soundsPath + "step.mp3"},
            {	name: "roll",
				file: soundsPath + "robotBeep.mp3"},
            {	name: "splash",
				file: soundsPath + "splash.mp3"},
		],
	}
    
    var SPEED = 225 
    var TIME_ADD = 600
    var JUMP_FORCE = 820
    var DEBUG_PHYSICS = false
    var WORLD_GRAVITY = 2500
    var OFF_BRICK = 200
    var BOT_OFFSET = 200
    
    var indexCoin
    var canMisile = null
    var marioSong = null
    var indexPiece = null
    var enemyNames = null
    var gameStart = false
    var jumping = false
    var yAxis = null
    var objToCheck
    var gameSpeed = null
    var objectsList = null
    var jumpDown
    var rollDown
    var rollButton
    var pivotObjects
    var pivotTop
    var objTop
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
        canMisile = false
        gameSpeed =  SPEED
        indexPiece = 0
        game.stage.backgroundColor = "#ffffff"
        jumpTimer = 0
        gameActive = false
        jumpDown = false
        rollDown = false
        lives = 1
        pivotObjects = 0
        objToCheck = null
        pivotTop = 0
        objTop = null
        buttonPressed = false
        tooMuch = false
        GRAVITY_OBJECTS = 4
        yAxis = p2.vec2.fromValues(0, 1);
        objectsList = []
        
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

    } 
    
    
    function preload() {
        
        game.plugins.add(Fabrique.Plugins.Spine);
        game.stage.disableVisibilityChange = false
        game.load.spine('eagle', "images/spines/Eagle.json");
        
        game.load.spritesheet('bMonster', 'images/graviswitch/bMonster.png', 83, 84, 16);
        game.load.spritesheet('bMonster2', 'images/graviswitch/bMonster2.png', 83, 84, 16);
        game.load.spritesheet('coinS', 'images/graviswitch/coinS.png', 68, 70, 12);
        
        game.load.audio('marioSong', soundsPath + 'songs/funny_invaders.mp3');
        
        
    }
    
    function doRoll(){
        
        player.invincible = true
        player.canRoll = false
        
        buddy.setAnimationByName(0,"JUMP_RUN",false)
        buddy.addAnimationByName(0, "RUN", true);
        
        sound.play("roll")
                
        game.time.events.add(1000,function(){
            player.invincible = false
            game.time.events.add(750,function(){
                player.canRoll = true
            },this)
        },this)
    }
    
    function inputButton(obj){
        
        if(gameActive == false){
            return
        }
        
        if(obj.tag == 'jump' && buddy.isRunning){
            
            doJump()
        }else if(obj.tag == 'roll' && player.canRoll){
            
            doRoll()
        }
        
        //sound.play("click")
        
        //console.log(buddy.isRunning + ' running')
        
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
        groupButton.x = game.world.centerX + 100
        groupButton.y = game.world.height -125
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var button1 = groupButton.create(0,0, 'atlas.amazingbros','arcadebutton2')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.amazingbros','arcadebutton1')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.tag = 'jump'
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)  
        
        groupButton = game.add.group()
        groupButton.x = game.world.centerX - 100
        groupButton.y = game.world.height -125
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var button1 = groupButton.create(0,0, 'atlas.amazingbros','arcadebutton02')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.amazingbros','arcadebutton01')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.events.onInputDown.add(inputButton)
        button2.tag = 'roll'
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
        buddy.setAnimationByName(0,"LOSE",false)
        createPart('wrong',player)
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
        
        if(pointsBar.number == 15){
            canMisile = true
        }else if(pointsBar.number == 5){
            enemyNames[enemyNames.length] = 'enemy_spike'
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
        characterGroup.y = player.y +48 
        
        if(player.body.y > game.world.height - BOT_OFFSET * 1.2 ){
            stopGame()
        }
        
    }
    
    function deactivateObj(obj){
        obj.body.velocity.x = 0
        obj.body.velocity.y = 0
        obj.used = false
        obj.body.y = -500
    }
    
    function checkObjects(){
        
        //console.log( objectsList.length + 'cantidad objetos')
        for(var index = 0;index<objectsList.length;index++){
            var obj = objectsList[index]
            
            if(obj.tag == 'misil'){
                obj.body.rotateLeft(Math.random()*80 + 40)   
            }
            
            if(obj.body.x < -obj.width * 0.45 && obj.used == true){
                
                //console.log(obj.body.y + ' posy')
                deactivateObj(obj)
                addObjects()
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
        
        sound.play("spaceship")
        sound.play("whoosh")
        buddy.isRunning = false
        
        if(!player.invincible){
            buddy.setAnimationByName(0, "JUMP", false);
        }
        
        
        createPart('ring',player)
        //buddy.addAnimationByName(0, "LAND", false);
        
        buddy.scale.y*=-1
        
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
        
        if (jumpButton.isDown && !jumpDown){
            
            if(buddy.isRunning)
            {
                jumpDown = true
                doJump()
            }
        }
        if(jumpButton.isUp){
            jumpDown = false
        }
        
        if(rollButton.isDown && !rollDown){
            if(player.canRoll){
                rollDown = true
                doRoll()
            }
        }
        
        if(rollButton.isUp){
            rollDown = false
        }
        
        checkObjects()
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
    
    function createPart(key,obj,offset){
        
        var offsetY = offset || 0
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
            var particle = sceneGroup.create(obj.world.x,obj.world.y - 20 + offsetY,'atlas.amazingbros',key)
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

            }else if(tag.substring(0,4) == 'plat'){
                
                var difY = Math.abs(obj1.sprite.body.y - obj2.sprite.body.y)  
                var height = obj2.sprite.height * 0.5
                
                if(difY < height){
                    stopGame(false)
                }
                
                if(gameActive == true && !buddy.isRunning){
                    
                    buddy.isRunning = true
                    if(!player.invincible){
                        buddy.setAnimationByName(0, "LAND", false);
                        buddy.addAnimationByName(0,"RUN",true)
                    }
                    
                    if(difY > height){
                        
                        var offsetY = -25
                        if(buddy.scale.y > 0){
                            offsetY = 55
                        }
                        createPart('smoke',player,offsetY)
                        sound.play("step")
                    }
                }
                
                //console.log('dif ' + difY + ' height ' + obj2.sprite.height * 0.5)
                
            }else if(tag == 'misil'){
                missPoint()
                createPart('wrong', obj2.sprite)
                stopGame()
            }else if(tag == "enemy_spike" || tag == 'enemy_spike2'){
                if(player.invincible){
                    sound.play("splash")
                    createPart('star',obj2.sprite)
                    
                    obj2.sprite.body.velocity.x = 800
                    var offsetX = 1
                    if(Math.random()*2> 1){offsetX = -1}
                    obj2.sprite.body.velocity.y = game.rnd.integerInRange(600, 800) * offsetX
                    game.time.events.add(350,function(){
                        deactivateObj(obj2.sprite)
                    })
                    
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

            }else if(child.tag == "enemy_squish"){
                child.body.y+=5
            }else if(child.tag == "misil"){
                child.body.velocity.x-=350
                //child.body.dynamic = true
            }
        }
    
     }
    
    
    function setMisile(obj,isTop,pivotX){
        
        sound.play("laserexplode")
        
        canMisile = false            
        var offsetY = 1

        if(isTop){
            offsetY = -1
        }

        var coin = addComplement('misil')
        if(coin != null){

            activateObject(pivotX,obj.body.y + ((obj.height * 0.5 + (coin.height)) * offsetY),coin)
            //console.log( obj.body.y + ' pos ' + coin.body.y)
            //coin.scale.setTo(3,3)
        }    
        
        game.time.events.add(7500,function(){
            canMisile = true
        },this)
        
    }
    
    function checkAdd(obj, isTop,pivotX){
        
        if(indexPiece < 10){
            return
        }
        
        Phaser.ArrayUtils.shuffle(enemyNames)
        
        if(Math.random()*2 > 1 && gameActive == true){
            
            var nameItem = enemyNames[0]           
            
            var offsetY = 1
            
            if(isTop){
                offsetY = -1
            }
            
            if(offsetY == 1 && nameItem == 'enemy_spike'){
                
                nameItem = 'enemy_spike2'
            }
            
            var offsetHeight = 0.5
            
            if(nameItem == 'coin'){
                offsetHeight = 0.8
            }
            var coin = addComplement(nameItem)
            if(coin != null){
                
                activateObject(pivotX,obj.body.y + ((obj.height * 0.5 + (coin.height * offsetHeight)) * offsetY),coin)
                //console.log( obj.body.y + ' pos ' + coin.body.y)
                //coin.scale.setTo(3,3)
            }
        }
        
        if(canMisile){
            
            setMisile(obj,isTop,pivotX)
            
        }
    }
    
    function addObstacle(tag,isTop){
            
        var top = isTop
        for(var i = 0;i< groundGroup.length;i++){
            var child = groundGroup.children[i]
            if(child.tag == tag && child.used == false){
                var subTag = tag.substring(0,4)
                if (subTag == 'plat'){
                    
                    pivotObjects = -600
                    if(objToCheck != null ){
                        pivotObjects = objToCheck.body.x + objToCheck.width * 0.5 + child.width * 0.5
                    }
                    
                    pivotTop = -600
                    if(objTop != null){
                        pivotTop = objTop.body.x + objTop.width * 0.5 + child.width * 0.5
                    }
                    
                    var pivotToUse = pivotObjects
                    
                    var posY = game.world.height - child.height * 0.2 - BOT_OFFSET
                    if(!top){
                        posY = -25
                        objToCheck = child
                        addObstacle(checkTag('a'),true)
                    }else{
                        pivotToUse = pivotTop
                        objTop = child
                    }
                    
                    //console.log(pivotToUse + ' pivot')
                    activateObject(pivotToUse, posY,child)
                    checkAdd(child,top,pivotToUse)
                    
                    //checkAdd(child,tag)
                    
                    
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
                
            }else if(tag == 'enemy_spike2'){
                
                object = game.add.sprite(-300, 200, 'bMonster2');
                //object.scale.x = -1
                groundGroup.add(object)
                object.animations.add('walk');
                object.animations.play('walk',24,true);
                
            }else if(tag == 'coin'){
                
                object = game.add.sprite(-300, 200, 'coinS');
                object.animations.add('walk');
                object.animations.play('walk',24,true); 
                groundGroup.add(object)
                
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
            
            if(tag != 'coin'){
                object.body.allowSleep = true
                player.body.createBodyCallback(object, collisionEvent, this);
            }
        }
    }
    
    function createObjects(){
        
        var scaleToUse = 1.8
        for(var i = 0; i< 2;i++){
            
            if(i==1){
                scaleToUse = 1.1
            }
            createObjs('plataform' + (i+1) + '_a',scaleToUse,6)
            createObjs('plataform' + (i+1) + '_b',scaleToUse,6)
        }
        
        createObjs('coin',1,10)
        createObjs('misil',1,5)
        createObjs('enemy_spike',1,5)
        createObjs('enemy_spike2',1,5)
                
        for(var i = 0; i < 2; i++){
            addObstacle('plataform2_a',true)
        }
        
    }
    
    function checkTag(letter){
        
        var name = 'plataform'
        
        var number = game.rnd.integerInRange(1, 2)
        var add = letter
        
        if(indexPiece < 20){
            number = 2
        }
        
        indexPiece++
        
        return name + number + '_' + add
    }
    
    function addObjects(){
        
        var tag = checkTag('b')
        
        //console.log('added Object')
        
        addObstacle(tag,false)
        
        //game.time.events.add(TIME_ADD,  , this);
        
    }
    
    function positionFirst(){
        positionPlayer()
        
        if(gameStart == false){
            game.time.events.add(1, positionFirst , this);
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
        
        var planet = sceneGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.amazingbros','planet')
        planet.anchor.setTo(0.5,0.5)
        
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
            rollButton = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL)
            
			sceneGroup = game.add.group()
            
            createBackground()
            
            worldGroup = game.add.group()
            //worldGroup.scale.setTo(0.5,0.5)
            //worldGroup.x = 100
            sceneGroup.add(worldGroup)
            
            groundGroup = game.add.group()
            worldGroup.add(groundGroup)
            
            loadSounds()
			initialize()       
            
            //sound.play("marioSong")
            marioSong = game.add.audio('marioSong')
            game.sound.setDecodedCallback(marioSong, function(){
                marioSong.loopFull(0.4)
            }, this);
            
            objectsGroup = game.add.group()
            worldGroup.add(objectsGroup)
            
            characterGroup = game.add.group()
            characterGroup.x = 100
            characterGroup.y = game.world.height - BOT_OFFSET * 3
            worldGroup.add(characterGroup)
            
            buddy = game.add.spine(0,0, "eagle");
            buddy.isRunning = true
            buddy.scale.setTo(0.6,0.6)
            characterGroup.add(buddy)            
            buddy.setAnimationByName(0, "RUN", true);
            buddy.setSkinByName('Eagle');
            
            player = worldGroup.create(characterGroup.x, characterGroup.y,'atlas.amazingbros','yogotar')
            player.anchor.setTo(0.5,1)
            player.alpha = 0
            game.physics.p2.enable(player,DEBUG_PHYSICS)
            player.body.fixedRotation = true
            player.body.mass=50
            player.canRoll = true
            
            player.body.collideWorldBounds = true;
            
            game.onPause.add(function(){
                game.sound.mute = true
                buddy.setAnimationByName(0,"RUN",false)
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
                buddy.setAnimationByName(0,"RUN",true)
            }, this);
            
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