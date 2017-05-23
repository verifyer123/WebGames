var soundsPath = "../../shared/minigames/sounds/"
var jumpward = function(){
    

	assets = {
        atlases: [
            {   
                name: "atlas.jump",
                json: "images/jumpward/atlas.json",
                image: "images/jumpward/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/jumpward/background.png"},
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
            {	name: "break",
				file: soundsPath + "glassbreak.mp3"},
            {	name: "powerup",
				file: soundsPath + "powerup.mp3"},
            {	name: "balloon",
				file: soundsPath + "inflateballoon.mp3"},
		],
	}
    
    var COLORS = [0x22bbff,0x13ff84,0xffcf1f,0xe84612]
    
    var SPEED = 225 
    var TIME_ADD = 600
    var JUMP_FORCE = 1050
    var DEBUG_PHYSICS = false
    var ANGLE_VALUE = 3
    var WORLD_GRAVITY = 1600
    var OFF_BRICK = 330
    var BOT_OFFSET = 105
    
    var gameIndex = 7
    
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
    var skinTable
	var sceneGroup = null
    var pointsGroup = null
    var gameActive = null
    var characterGroup = null
    var pointsBar = null
    var lives = null
    var heartsGroup = null 

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
        
        platNames = ['blue_plat']
        itemNames = ['coin','spring','coin','coin','coin']
        game.stage.backgroundColor = "#ffffff"
        gameActive = false
        moveUp = false
        objectsGroup = null
        lives = 1
        pivotObjects = game.world.centerY + 100
        tooMuch = false
        lastOne = null
        moveLeft = false
        moveRight = false
        skinTable = []
        
	}
    
    function animateScene() {
                        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        gameActive = true
        game.time.events.add(500,doJump,this)
        
    } 
    
    function preload() {
        
        game.plugins.add(Fabrique.Plugins.Spine);
        
        game.load.spine('mascot', "images/spines/skeleton.json");
        game.stage.disableVisibilityChange = false;
        
        game.load.spritesheet('coinS', 'images/jumpward/coinS.png', 68, 70, 12);
        game.load.spritesheet('monster', 'images/jumpward/monster.png', 292, 237, 17);
        
        //game.load.audio('runningSong', soundsPath + 'songs/running_game.mp3');
		marioSong = sound.setSong(soundsPath + 'songs/running_game.mp3',0.5)
        
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
        groupButton.x = game.world.centerX + 135
        groupButton.y = game.world.height -125
        groupButton.scale.setTo(1.4,1.4)
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var button1 = groupButton.create(0,0, 'atlas.jump','right_press')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.jump','right_idle')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.tag = 'right'
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)
        
        var groupButton = game.add.group()
        groupButton.x = game.world.centerX - 135
        groupButton.y = game.world.height -125
        groupButton.scale.setTo(1.4,1.4)
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var button1 = groupButton.create(0,0, 'atlas.jump','left_press')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.jump','left_idle')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.tag = 'left'
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)
        
    }
    
    function stopWorld(){

        buddy.setAnimationByName(0,"LOSE",false)
        var tweenLose = game.add.tween(buddy).to({y:buddy.y - 150}, 1000, Phaser.Easing.Cubic.Out, true)
        tweenLose.onComplete.add(function(){
            game.add.tween(buddy).to({y:buddy.y + game.world.height + game.world.height * 0.2}, 500, Phaser.Easing.Cubic.In, true)
            game.add.tween(objectsGroup).to({y:objectsGroup.y - game.world.height * 0.4},500,Phaser.Easing.linear,true)
        })
    
    }
    
    function stopGame(win){
        
        marioSong.pause()
        
        missPoint()
        sound.play("gameLose")
        stopWorld()
        //game.add.tween(objectsGroup).to({alpha:0},250, Phaser.Easing.Cubic.In,true)
        
        worldGroup.alpha = 0
        game.add.tween(worldGroup).to({alpha:1},250,Phaser.Easing.linear,true)
        
        //objectsGroup.timer.pause()
        gameActive = false
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)
            
            //amazing.saveScore(pointsBar.number) 
            
			sceneloader.show("result")
		})
    }
    
    function addPoint(obj,part){
        
        var partName = part || 'ring'
        sound.play("pop")
                
        createPart(partName, obj)
        createTextPart('+1', obj)
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        //console.log(obj.tag + ' tag')
        addNumberPart(pointsBar.text,'+1')
        
        if(pointsBar.number == 15){
            
            platNames[platNames.length] = 'yellow_plat'
            platNames[platNames.length] = 'blue_plat'
            
            itemNames[itemNames.length] = 'balloons'
        }
        
        if(pointsBar.number == 25){
            
            platNames[platNames.length] = 'orange_plat'
        }
        
        if(pointsBar.number == 35){
            
            itemNames[platNames.length] = 'monster'
            itemNames[platNames.length] = 'monster'
        }
        
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
        createPart('wrong',player)
        //changeImage(0,heartsGroup.children[lives])
        heartsGroup.text.setText('X ' + lives)
        //buddy.setAnimationByName(0, "RUN_LOSE", 0.8);
        
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
            
            stopGame()
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
    
    function setBalloons(){
        
        game.physics.p2.gravity.y = 0
        player.body.velocity.y = 0
        
        sound.play("pop")
        sound.play("balloon")
        
        player.active = false
        moveUp = true
        buddy.setAnimationByName(0, "JUMP_BALLOONS", true)
        
        var newSkin = buddy.createCombinedSkin(
                'combined2',     
                'glasses' + skinTable[0],        
                'hair' +  skinTable[1],
                'skin' + skinTable[2],
                'torso' + skinTable[3],
                'balloons'
        );

        buddy.setSkinByName('combined2')
        
        buddy.setToSetupPose()
        
        game.time.events.add(3000,function(){
                        
            player.active = true
            moveUp = false
            
            game.physics.p2.gravity.y = WORLD_GRAVITY
            
            buddy.setSkinByName('combined')
            buddy.setToSetupPose()
        },this)
    }
    
    function checkObjects(){
        
        for(var i = 0; i<objectsGroup.length;i++){
            
            var object = objectsGroup.children[i]
            
            if(object.active){
                
                var tag = object.tag
                
                if(checkOverlap(player,object)){
                    
                    var checkTop = player.world.y < object.world.y - object.height * 0.5 && player.falling && player.active
                    
                    if(tag == 'blue_plat' || tag == 'orange_plat'){
                        
                        if(checkTop){
                    
                            doJump()
                        }
                    }else if(tag == 'yellow_plat' && object.alpha == 1){
                        if(checkTop){
                            
                            doJump(100)
                            
                            sound.play("break")
                            fadePlat(object)
                            
                        }
                        
                    }else if(tag == 'coin'){
                        
                        addPoint(object,'star')
                        deactivateObj(object)
                        
                    }else if(tag == 'spring' && checkTop){
                        
                        doJump(JUMP_FORCE * 2)
                        sound.play('powerup')
                        
                        var offset = 1
                        if(characterGroup.scale.x < 0){ offset = -1}
                        game.add.tween(characterGroup).to({angle:characterGroup.angle + (360 * offset)},500,Phaser.Easing.linear,true)
                    }else if(tag == 'balloons' && player.active){
                        
                        setBalloons()
                        deactivateObj(object)
                        createPart('star',object)
                    }else if(tag == 'monster' && player.active){
                        
                        if(Math.abs(player.body.x - object.world.x) < 50 && Math.abs(player.body.y - object.world.y) < 50)
                        stopGame()
                    }
                    
                }
                
                if(object.world.y > game.world.height - 200){
                    deactivateObj(object)
                    
                    if(tag.substring(tag.length - 4,tag.length) == 'plat'){
                        addObjects()
                    }
                    
                }
                
                if(object.tag == 'orange_plat'){
                    
                    if(object.moveRight){
                        
                        object.x+=2
                        if(object.world.x > game.world.width - 100){
                            
                            object.moveRight = false
                        }
                    }else{
                        
                        object.x-=2
                        if(object.world.x < 100){
                            object.moveRight = true
                        }
                    }
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
        
        if(!gameActive){
            return
        }
        
        var jumpValue = value
        
        if(jumpValue == null){ jumpValue = JUMP_FORCE}
        sound.play("whoosh")
        
        buddy.setAnimationByName(0, "JUMP", false);
        //buddy.addAnimationByName(0, "LAND", false);

        if(game.physics.p2.gravity.y == 0){
            game.physics.p2.gravity.y = WORLD_GRAVITY
            //marioSong.loopFull(0.5)
        }
        
        /*var bar = sceneGroup.limit
        if(player.body.y <= bar.body.y + bar.height){
            //console.log('move')
            game.add.tween(objectsGroup).to({y:objectsGroup.y + 150},200,Phaser.Easing.linear,true)
        }*/
        
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
        
        if(moveLeft){
            
            player.body.x-= 10
        }else if(moveRight){
            
            player.body.x+= 10
        }
        
        if(moveUp){
            player.body.y-=15
        }
        
        checkObjects()
    }

    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(10,10,'atlas.jump','xpcoins')
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.85
        pointsText.y = pointsImg.height * 0.3
        pointsText.anchor.setTo(1,0)
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
    
    function createTextPart(text,obj){
        
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = lookParticle('textPart')
        
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y - 60
            pointsText.setText(text)

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
                return particle
                break
            }
        }
        
    }
    
    function deactivateParticle(obj,delay){
        
        game.time.events.add(delay,function(){
            obj.used = false
        },this)
    }
    
    function createPart(key,obj){
        
        key+='Part'
        var particle = lookParticle(key)
        if(particle){
            
            particle.x = obj.world.x
            particle.y = obj.world.y
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
                particle = particlesGroup.create(-200,0,'atlas.jump',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
    
    function activateObject(child,posX,posY){
        
         if(child.tag == 'orange_plat' && child.tween){
             child.tween.stop()
         }
        
         piecesGroup.remove(child)
         objectsGroup.add(child)

         var tag = child.tag
         child.active = true
         child.alpha = 1
         child.y = posY
         child.x = posX

         if(tag == 'orange_plat'){
             child.moveRight = true

             if(Math.random()*2>1){
                 child.moveRight = false
             }
         }
         
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
                    while(Math.abs(obj.x - posX) < 100){
                        posX = game.rnd.integerInRange(100,game.world.width - 100)
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
                
                var posX = game.rnd.integerInRange(100,game.world.width - 100)
                activateObject(object,posX,pivotObjects)
                
                if(Math.random()*3 >1.5 && object.tag == 'blue_plat' && lastOne){
                    addItem(object)
                }
                
                //console.log('added ' + tag)
                
                lastOne = object
                
                pivotObjects-= 120
                
                break
            }
        }
    }
    
    function createObstacle(type, number){
        
        for(var o = 0; o<number;o++){
            
            if(type == 'coin'){
                
                obj = game.add.sprite(0, 0, 'coinS');
                piecesGroup.add(obj)
                obj.animations.add('walk');
                obj.animations.play('walk',24,true); 
                
            }else if(type == 'monster'){
                
                obj = game.add.sprite(0, 0, 'monster');
                obj.scale.setTo(0.5,0.5)
                piecesGroup.add(obj)
                obj.animations.add('walk');
                obj.animations.play('walk',24,true); 
            
            }else{
                
                var obj = piecesGroup.create(0,0,'atlas.jump',type)
            }
            
            if(type == 'orange_plat'){
                
                obj.moveRight = true
            }
            
            obj.anchor.setTo(0.5,0.5)
            obj.tag = type
            obj.alpha = 0
            obj.active = false
        }
        
    }
    
    function createObjects(){
        
        createObstacle('blue_plat',18)
        createObstacle('yellow_plat',18)
        createObstacle('orange_plat',10)
        createObstacle('coin',20)
        createObstacle('spring',10)
        createObstacle('balloons',5)
        createObstacle('monster',5)
        
        createParticles('star',5)
        createParticles('wrong',5)
        createParticles('text',8)
        
        for(var i = 0;i<12;i++){
            addObjects()
        }
        
        objectsGroup.children[0].x = player.body.x
        
    }
    
    function checkTag(){
        
        Phaser.ArrayUtils.shuffle(platNames)
        
        tag = platNames[0]
        
        if(lastOne && lastOne.tag == 'yellow_plat'){
            tag = 'blue_plat'
        }
        
        return tag
    }
    
    function addObjects(){
        
        var tag = checkTag()
        
        //console.log(piecesGroup.length + ' available')
        addObstacle(tag)
                
    }
    
    function getSkins(){
        
        var dataStore = amazing.getProfile()
        
        if(!dataStore){
            skinTable = [1,1,1,1]
        }else{
         
            skinTable = dataStore
        }
                
    }
    
	return {
        
		assets: assets,
		name: "jumpward",
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
            
            var background = sceneGroup.create(0,0,'fondo')
            background.width = game.world.width
            background.height = game.world.height
            sceneGroup.add(background)
            
            worldGroup = game.add.group()
            //worldGroup.scale.setTo(0.5,0.5)
            //worldGroup.x = 100
            sceneGroup.add(worldGroup)
            
            loadSounds()
			initialize()       
            
            /*//sound.play("marioSong")
            marioSong = game.add.audio('runningSong')
            game.sound.setDecodedCallback(marioSong, function(){
                //marioSong.loopFull(0.6)
            }, this);*/
            
            piecesGroup = game.add.group()
            worldGroup.add(piecesGroup)
            
            objectsGroup = game.add.group()
            worldGroup.add(objectsGroup)
            
            particlesGroup = game.add.group()
            worldGroup.add(particlesGroup)
            
            characterGroup = game.add.group()
            characterGroup.x = game.world.centerX
            characterGroup.y = game.world.height - BOT_OFFSET * 3
            worldGroup.add(characterGroup)
            
            buddy = game.add.spine(0,0, "mascot");
            buddy.scale.setTo(0.55,0.55)
            characterGroup.add(buddy)            
            buddy.setAnimationByName(0, "IDLE", true);
            buddy.setSkinByName('normal');
            
            getSkins()
            
            var newSkin = buddy.createCombinedSkin(
                'combined',     
                'glasses' + skinTable[0],        
                'hair' +  skinTable[1],
                'skin' + skinTable[2],
                'torso' + skinTable[3]
            );
            
            buddy.setSkinByName('combined')
            
            //createTrail()
            
            player = worldGroup.create(characterGroup.x, characterGroup.y,'atlas.jump','meizy')
            player.active = true
            player.anchor.setTo(0.5,1)
            player.alpha = 0
            game.physics.p2.enable(player,DEBUG_PHYSICS)
            player.body.fixedRotation = true
            player.body.mass=50
            player.lastpos = player.y
            player.body.setCollisionGroup(playerCollisionGroup)
            
            player.body.collides([gameCollisionGroup])
            
            player.body.collideWorldBounds = false;
            
            //createBase()
                        
            createObjects()
            
            createPointsBar()
            createHearts()
            createControls()   
            
            game.onPause.add(function(){
				marioSong.pause()
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
				if(lives > 0){
					marioSong.play()
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