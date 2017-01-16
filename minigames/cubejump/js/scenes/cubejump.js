var soundsPath = "../../shared/minigames/sounds/"
var cubejump = function(){
    

	assets = {
        atlases: [
            {   
                name: "atlas.jump",
                json: "images/cubejump/atlas.json",
                image: "images/cubejump/atlas.png",
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
				file: soundsPath + "cut.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "wrongItem",
				file: soundsPath + "wrongItem.mp3"},
            {	name: "break",
				file: soundsPath + "glassbreak.mp3"},
            {	name: "powerup",
				file: soundsPath + "powerup.mp3"},
            {	name: "splash",
				file: soundsPath + "splashMud.mp3"},
            {	name: "wrongItem",
				file: soundsPath + "wrongItem.mp3"},
		],
	}
    
    var COLORS = [0x22bbff,0x13ff84,0xffcf1f,0xe84612]
    
    var SPEED = 225 
    var TIME_ADD = 600
    var JUMP_FORCE = 1050
    var DEBUG_PHYSICS = false
    var ANGLE_VALUE = 3
    var ACID_SPEED = 3
    var WORLD_GRAVITY = 1600
    var OFF_BRICK = 330
    var BOT_OFFSET = 105
    
    var acid
    var canPoint
    var gameCollisionGroup, playerCollisionGroup
    var cursors
    var moveLeft, moveRight, moveUp
    var marioSong = null
    var platNames,itemNames
    var objectsGroup
    var piecesGroup
    var lastOne = null
    var pivotObjects
    var player
	var sceneGroup = null
    var pointsGroup = null
    var gameActive = null
    var characterGroup = null
    var pointsBar = null
    var lives = null
    var heartsGroup = null 
    var delayObjects

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
        
        platNames = ['fija','movil']
        itemNames = ['coin','spring','coin','coin','coin']
        game.stage.backgroundColor = "#ffffff"
        gameActive = false
        moveUp = false
        objectsGroup = null
        lives = 1
        pivotObjects = game.world.centerY - 175
        delayObjects = 500
        tooMuch = false
        lastOne = null
        moveLeft = false
        moveRight = false
        canPoint = true
        
	}
    
    function animateScene() {
                        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        gameActive = true
        //game.time.events.add(500,doJump,this)
        
    } 
    
    function preload() {
        
        game.plugins.add(Fabrique.Plugins.Spine);
        
        game.stage.disableVisibilityChange = false;
        
        game.load.spritesheet('acid', 'images/cubejump/acid.png', 734, 324, 12);
        game.load.spritesheet('cube', 'images/cubejump/cube.png', 136, 98, 26);
        //game.load.spritesheet('monster', 'images/jumpward/monster.png', 292, 237, 17);
        
        game.load.audio('runningSong', soundsPath + 'songs/chemical_electro.mp3');
        
    }
    
    function inputButton(obj){
                
        if(gameActive == true){
            doJump()
        }
        
        obj.parent.children[1].alpha = 0
    }
    
    function releaseButton(obj){
        
        if(gameActive == true){
            if(obj.tag =='left'){
                moveLeft = false
            }else{
                moveRight = false
            }
        }
        
        obj.parent.children[1].alpha = 1
    }
    
    function createControls(){
        
        var spaceButtons = 220
        
        var bottomRect = sceneGroup.create(0,0,'atlas.jump','dashboard')
        bottomRect.width = game.world.width
        bottomRect.height *= 1.02
        bottomRect.x = game.world.centerX
        bottomRect.y = game.world.height - bottomRect.height * 0.5
        bottomRect.anchor.setTo(0,1)
        bottomRect.anchor.setTo(0.5,0.5)
        sceneGroup.dashboard = bottomRect
        
        var bottomRect = sceneGroup.create(0,0,'atlas.jump','dashboard')
        bottomRect.width = game.world.width
        bottomRect.alpha = 0
        bottomRect.height *= 1.02
        bottomRect.tag = 'dashboard'
        bottomRect.x = game.world.centerX
        bottomRect.y = game.world.centerY - bottomRect.height
        bottomRect.anchor.setTo(0,1)
        
        //bottomRect.body.collides([playerCollisionGroup])
        
        //player.body.createBodyCallback(bottomRect, collisionEvent, this);
        
        sceneGroup.limit = bottomRect
        
        var groupButton = game.add.group()
        groupButton.x = game.world.centerX
        groupButton.y = game.world.height -125
        groupButton.scale.setTo(1.4,1.4)
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var button1 = groupButton.create(0,0, 'atlas.jump','botonOn')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.jump','botonOff')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.tag = 'right'
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)
        
    }
    
    function stopWorld(){

        game.add.tween(objectsGroup).to({y:objectsGroup.y - game.world.height * 0.3},500,Phaser.Easing.linear,true)
    
    }
    
    function stopGame(win){
        
        marioSong.stop()
        
        missPoint()
        sound.play("gameLose")
        stopWorld()
        game.add.tween(characterGroup).to({alpha:0},250, Phaser.Easing.Cubic.In,true)
        
        worldGroup.alpha = 0
        game.add.tween(worldGroup).to({alpha:1},250,Phaser.Easing.linear,true)
        
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
        
        if(!canPoint){
            return
        }
        
        canPoint = false
        game.time.events.add(300,function(){
            canPoint = true
        },this)
        var partName = part || 'ring'
        sound.play("pop")
                
        createPart(partName, obj)
        createTextPart('+1', obj)
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        //console.log(obj.tag + ' tag')
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
        
        if (lives >0){
            lives--;
        }
        
        sound.play('wrong')
        createPart('drop',player)
        //changeImage(0,heartsGroup.children[lives])
        heartsGroup.text.setText('X ' + lives)
        
        addNumberPart(heartsGroup.text,'-1')
        
    }
    
    function positionPlayer(){
        
        if(player.body.x > game.world.height * 0.95){
            player.body.x = 5
        }else if(player.body.x < 10){
            player.body.x = game.world.height * 0.9
        }
        
        if(player.body.y > player.lastpos + 5){
            player.falling = true    
        }else{
            player.falling = false
        }
        
        characterGroup.x = player.x
        characterGroup.y = player.y +44 
        
        if(player.body.y > game.world.height - sceneGroup.dashboard.height  - player.height * 0.25 && player.falling){
            
            //stopGame()
        }
        
        player.lastpos = player.body.y

    }
    
    function deactivateObj(obj){
        
        obj.active = false
        obj.alpha = 0
        
        objectsGroup.remove(obj)
        piecesGroup.add(obj)
        
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
    
    function fadePlat(object){
        
        object.tween = game.add.tween(object).to({alpha:0},300,Phaser.Easing.liner,true).onComplete.add(function(){
            deactivateObj(object)
            addObjects()
        },this)
    }

    function checkObjects(){
        
        for(var i = 0; i<objectsGroup.length;i++){
            
            var object = objectsGroup.children[i]
            
            if(object.active){
                
                var tag = object.tag
                
                if(tag == 'fija' || tag == 'movil'){
                    
                    for(var u = 0; u<object.length;u++){

                        var obj = object.children[u]

                        var checkTop = player.world.y < obj.world.y - obj.height * 0.5 && player.falling && player.active

                        if(checkOverlap(player,obj)){
                            
                            if(!player.canJump && player.body.velocity.y != 0){
                                if(player.canDrop){
                                    
                                    createPart('drops',player)
                                    player.canDrop = false
                                    game.time.events.add(500,function(){
                                        player.canDrop = true
                                    },this)
                                }
                                
                            }
                            
                            if(Math.abs(obj.angle)< 15){
                                if(checkTop){
                                    game.physics.p2.gravity.y = 0
                                    player.canJump = true
                                    player.body.velocity.y = 0
                                    obj.parent.active = false

                                    buddy.animations.play('land',12,false)
                                    addPoint(player)
                                    sound.play('splash')

                                    game.time.events.add(300,function(){
                                        buddy.animations.play('idle',12,true)
                                    },this)
                                }else{
                                    buddy.animations.play('air',12,false)
                                    player.body.velocity.y = 0
                                    sound.play('wrongItem')
                                }
                            }
                        }

                    }
                }
                
                if(object.y > game.world.height - 200){
                    deactivateObj(object)
                    
                    console.log('deactivateObjects')
                    
                }
                
            }
            
            if(object.tag == 'acid'){
                
                object.y-= acid.acidSpeed
                if(checkOverlap(object,player)){
                    stopGame()
                }
            }
            
        }
        
        var bar = sceneGroup.limit
        if(player.body.y <= bar.y + bar.height * 0.5){

            var value = (bar.y + bar.height * 0.5) - player.body.y
            
            value*=0.8
            
            objectsGroup.y+=value
            player.body.y+=value
        }
        
    }
    
    function doJump(value){
        
        if(!gameActive || !player.canJump){
            return
        }
        
        player.canJump = false
        buddy.animations.play('jump',12,false)
        
        var jumpValue = value || JUMP_FORCE
                
        sound.play("whoosh")
        
        if (acid.acidSpeed == 0){
            acid.acidSpeed = ACID_SPEED
        }
        
        if(game.physics.p2.gravity.y == 0){
            game.physics.p2.gravity.y = WORLD_GRAVITY
        }
        player.jumps++
        
        addObjects()
        
        player.body.moveUp(jumpValue)        
    
    }
    
    function update(){
        
        if(gameActive == false){
            return
        }
        
        positionPlayer()        
        
        if(cursors.left.isDown && !moveLeft){
            player.body.x-= 10
            
            if(characterGroup.scale.x != -1){
                
                characterGroup.scale.x = -1
            }
            
        }
        
        if(cursors.right.isDown && !moveRight){
            player.body.x+= 10
            if(characterGroup.scale.x != 1){
                
                characterGroup.scale.x = 1
            }
        }
        
        if(jumpButton.isDown){
            doJump()
        }
        checkObjects()
    }

    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(10,10,'atlas.jump','xpcoins')
    
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

        var heartsImg = group.create(0,0,'atlas.jump','life_box')
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

            particlesGood.makeParticles('atlas.jump',key);
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
            var particle = sceneGroup.create(obj.world.x,obj.world.y,'atlas.jump',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
        }
        
    }
    
    function activateObject(child,posX,posY){
        
        piecesGroup.remove(child)
        objectsGroup.add(child)

        var tag = child.tag
        child.active = true
        child.alpha = 1
        child.y = posY
        child.x = posX
        
        var timeToClose = game.rnd.integerInRange(85,175) * 10

        if(player.jumps == 1){
         delayObjects-=1200
        }
        
        if(tag == 'movil'){
            timeToClose = game.rnd.integerInRange(90,125) * 10
        }
        
        if(objectsGroup.first){
            timeToClose = 1200
            objectsGroup.first = false
        }
        
        for(var i = 0; i< child.length;i++){

            var obj = child.children[i]
            
            if(tag == 'fija'){
                
                obj.x = obj.initPos
                game.add.tween(obj).to({x:0},timeToClose,Phaser.Easing.linear,true,delayObjects)
            }else if(tag == 'movil'){
                
                obj.angle = obj.initAngle
                game.add.tween(obj).to({angle:0},timeToClose,Phaser.Easing.linear,true,delayObjects)
            }
            
        }

        var timeValue = 1500

        if(acid.acidSpeed != 0 ){
        timeValue = 0  
        }

        console.log(timeValue + ' timeValue')
        delayObjects+= timeValue
         
    }
    
    function addItem(obj){
                
        Phaser.ArrayUtils.shuffle(itemNames)
        
        var tag = itemNames[0]
        
        //console.log(tag + ' tag')
        
        for(var i = 0; i < piecesGroup.length;i++){
            
            var item = piecesGroup.children[i]
            
            if(!item.active && item.tag == tag){
                
                var posX = obj.x
                
                if(item.tag == 'monster'){
                    posX = obj.x
                    while(Math.abs(obj.x - posX) < 150){
                        game.rnd.integerInRange(100,game.world.width - 100)
                    }
                    
                }
                
                activateObject(item,posX,obj.y - obj.height * 0.5 - item.height * 0.6)
                break
            }
        
        }
    }
    
    function addObstacle(tag){
        
        for(var i = 0; i < piecesGroup.length;i++){
            
            var object = piecesGroup.children[i]
            if(!object.active && object.tag == tag){
                
                var posX = game.world.centerX
                activateObject(object,posX,pivotObjects)
                
                /*if(Math.random()*3 >1.5 && object.tag == 'blue_plat' && lastOne){
                    addItem(object)
                }*/
                
                //console.log('added ' + tag)
                
                lastOne = object
                
                pivotObjects-= 275
                
                break
            }
        }
    }
    
    function createObstacle(type, number,scale){
        
        for(var o = 0; o<number;o++){
            
            if(type == 'fija'){
                
                var group = game.add.group()
                group.tag =  type
                group.alpha = 0
                group.used = false
                piecesGroup.add(group)
                
                var pivotX = -150
                for(var i = 0;i<2;i++){
                    
                    var obj = group.create(pivotX, 0, 'atlas.jump','fija')
                    obj.anchor.setTo(0,0.5)
                    obj.tag = type
                    obj.initPos = obj.x
                    
                    pivotX += 300
                    
                }
                
                group.children[0].anchor.setTo(1,0.5)
                
            }else if(type == 'movil'){
                
                var group = game.add.group()
                group.tag = type
                group.alpha = 0
                group.used = false
                piecesGroup.add(group)
                
                var pivotX = game.world.width * 0.25
                var angle = -60
                for(var i = 0; i < 2; i++){
                    
                    var obj = group.create(pivotX,0,'atlas.jump','fija')
                    obj.width = game.world.width * 0.25
                    obj.anchor.setTo(1,0.5)
                    obj.initPos = obj.x
                    obj.angle = angle
                    obj.initAngle = obj.angle
                    
                    angle*=-1
                    
                    pivotX -= game.world.width * 0.5
                    
                }
                
                pivotX = game.world.width * -0.5
                for(var i = 0; i<2;i++){
                    var obj = group.create(pivotX,0,'atlas.jump','fija')
                    obj.width = game.world.width * 0.25
                    obj.anchor.setTo(0,0.5)
                    obj.initAngle = 0
                    
                    pivotX+= game.world.width * 0.75
                }
                
                group.children[1].width*=-1
            }
            
        }
        
    }
    
    function createAcid(){
        
        acid = game.add.group()
        acid.tag = 'acid'
        acid.x = game.world.centerX
        acid.y = game.world.height - 175
        acid.acidSpeed = 0
        objectsGroup.add(acid)
        
        var acidSprite = game.add.sprite(0,0, 'acid');
        acidSprite.animations.add('walk');
        acidSprite.anchor.setTo(0.5,0.5)
        acidSprite.animations.play('walk',12,true); 
        acidSprite.width = game.world.width
        acid.add(acidSprite)
        
        var background = new Phaser.Graphics(game)
        background.beginFill(0x00ff00)
        background.drawRect(-game.world.width * 0.5, 100, game.world.width, game.world.height * 0.4)
        background.endFill()
        acid.add(background)
        
    }
    
    function createObjects(){
        
        createAcid()
        createObstacle('fija',10,1)
        createObstacle('movil',10,1)
        
        for(var i = 0; i < 3; i ++){
            addObjects()
        }
        
    }
    
    function checkTag(){
        
        Phaser.ArrayUtils.shuffle(platNames)
        
        tag = platNames[0]
        //tag = 'movil'
        
        if(lastOne && lastOne.tag == 'yellow_plat'){
            tag = 'blue_plat'
        }
        
        return tag
    }
    
    function addObjects(){
        
        var tag = checkTag()
        
        if(objectsGroup.first){
            tag = 'fija'
        }
        
        //console.log(piecesGroup.length + ' available')
        addObstacle(tag)
                
    }
    
    function createBase(){
        
        var base = objectsGroup.create(game.world.centerX, game.world.height - 400,'atlas.jump','fija')
        base.anchor.setTo(0.5,0.5)
        base.width = game.world.width
        
    }
    
    function createBackground(){
        
        var pivotY = 0
        
        while(pivotY < game.world.height){
            
            var background = sceneGroup.create(0,pivotY,'atlas.jump','background')
            background.width = game.world.width
            sceneGroup.add(background)
            
            pivotY+= background.height
        }
    }
    
    function createCube(){
        
        var cube = game.add.sprite(0,-50, 'cube');
        cube.animations.add('idle',[1,2,3,4,5,6,7,8],12,true)
        cube.animations.add('jump',[9,10,11,12,13],12,true)
        cube.animations.add('land',[21,22,23,24,25,26],12,true)
        cube.animations.add('air',[14,15,16,17,18,19,20],12,true)
        cube.anchor.setTo(0.5,0.5)
        cube.animations.play('idle',12,true); 
        cube.width = game.world.width
        characterGroup.add(cube) 
        
        return cube
    }
    
	return {
        
		assets: assets,
		name: "cubejump",
		create: function(event){
            
            cursors = game.input.keyboard.createCursorKeys()
            
            game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.gravity.y = 0;
            game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            game.physics.p2.world.setGlobalStiffness(1e5);
            
            game.physics.p2.setBoundsToWorld(true, true, true, true, true)
            
            playerCollisionGroup = game.physics.p2.createCollisionGroup()
            gameCollisionGroup = game.physics.p2.createCollisionGroup()
            
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            
			sceneGroup = game.add.group()
            
            createBackground()
            
            worldGroup = game.add.group()
            //worldGroup.scale.setTo(0.5,0.5)
            //worldGroup.x = 100
            sceneGroup.add(worldGroup)
            
            loadSounds()
			initialize()       
            
            //sound.play("marioSong")
            marioSong = game.add.audio('runningSong')
            game.sound.setDecodedCallback(marioSong, function(){
                marioSong.loopFull(0.6)
            }, this);
            
            piecesGroup = game.add.group()
            worldGroup.add(piecesGroup)
            
            objectsGroup = game.add.group()
            worldGroup.add(objectsGroup)
            objectsGroup.first = true
            
            particlesGroup = game.add.group()
            worldGroup.add(particlesGroup)
            
            createBase()
            
            characterGroup = game.add.group()
            characterGroup.x = game.world.centerX
            characterGroup.y = game.world.height - BOT_OFFSET * 4.3
            worldGroup.add(characterGroup)
            
            buddy = createCube()
            buddy.scale.setTo(0.8,0.8)
            buddy.anchor.setTo(0.5,0.5)
            
            //createTrail()
            
            player = worldGroup.create(characterGroup.x, characterGroup.y,'atlas.jump','cubo')
            player.canDrop = true
            player.scale.setTo(0.8,0.8)
            player.active = true
            player.anchor.setTo(0.5,1)
            player.alpha = 0
            game.physics.p2.enable(player,DEBUG_PHYSICS)
            player.body.fixedRotation = true
            player.body.mass=50
            player.lastpos = player.y
            player.canJump = true
            player.jumps = 0
            player.body.setCollisionGroup(playerCollisionGroup)
            
            player.body.collides([gameCollisionGroup])
            
            player.body.collideWorldBounds = true;
            
            //createBase()
                        
            createObjects()
            
            createPointsBar()
            createHearts()
            createControls()   
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
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