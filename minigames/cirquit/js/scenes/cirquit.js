var soundsPath = "../../shared/minigames/sounds/"
var cirquit = function(){
    
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
    
    var COLORS = [0x22bbff,0x13ff84,0xffcf1f,0xe84612]
    
    var SPEED = 225 
    var TIME_ADD = 600
    var JUMP_FORCE = 500
    var DEBUG_PHYSICS = false
    var ANGLE_VALUE = 3
    var WORLD_GRAVITY = 1600
    var OFF_BRICK = 330
    var BOT_OFFSET = 105
    
    var gameIndex = 2
    var gameId = 5739719937753088
    var colorIndex
    var objectToActivate = null
    var skullTrue = false
    var marioSong = null
    var enemyNames = null
    var consecFloor, consecBricks
    var objectsGroup
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
        game.stage.backgroundColor = "#ffffff"
        gameActive = false
        objectsGroup = null
        lives = 1
        pivotObjects = game.world.centerY - 100
        tooMuch = false
        colorIndex = game.rnd.integerInRange(1,4) - 1
        
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
    
    function setExplosion(obj){
        
        
        var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
        
        /*var exp = sceneGroup.create(0,0,'atlas.neon','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(4,4)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)*/
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.neon','smoke');
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1;
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
        
        var bottomRect = sceneGroup.create(0,0,'atlas.neon','dashboard')
        bottomRect.width = game.world.width
        bottomRect.height *= 1.02
        bottomRect.x = game.world.centerX
        bottomRect.y = game.world.height - bottomRect.height * 0.5
        bottomRect.anchor.setTo(0,1)
        
        game.physics.p2.enable(bottomRect,DEBUG_PHYSICS)
        bottomRect.body.kinematic = true
        
        var bottomRect = sceneGroup.create(0,0,'atlas.neon','dashboard')
        bottomRect.width = game.world.width
        bottomRect.alpha = 0
        bottomRect.height *= 1.02
        bottomRect.tag = 'dashboard'
        bottomRect.x = game.world.centerX
        bottomRect.y = game.world.centerY - bottomRect.height
        bottomRect.anchor.setTo(0,1)
        
        game.physics.p2.enable(bottomRect,DEBUG_PHYSICS)
        bottomRect.body.kinematic = true
        
        //player.body.createBodyCallback(bottomRect, collisionEvent, this);
        
        sceneGroup.limit = bottomRect
        
        groupButton = game.add.group()
        groupButton.x = game.world.centerX
        groupButton.y = game.world.height -125
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
                
        //buddy.setAnimationByName(0,"LOSE",false)
        buddy.alpha = 0
        
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
    
    function changeColor(){
        
        var lastColor = colorIndex
        
        while(lastColor ==  colorIndex){
            colorIndex = game.rnd.integerInRange(1,4) - 1
        }
        
        //console.log(COLORS[colorIndex] + ' color')
        buddy.tint = COLORS[colorIndex]
    }
    
    function addPoint(obj,part){
        
        var partName = part || 'ring'
        sound.play("pop")
        
        //gameSpeed +=10
        
        changeColor()
        createPart(partName, obj)
        createTextPart('+1', obj)
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
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
        
        sound.play("explode")
        if (lives >0){
            lives--;
        }
        //changeImage(0,heartsGroup.children[lives])
        heartsGroup.text.setText('X ' + lives)
        //buddy.setAnimationByName(0, "RUN_LOSE", 0.8);
        
        addNumberPart(heartsGroup.text,'-1')
        
    }
    
    function positionPlayer(){
        
        /*if(game.physics.p2.gravity.y !=0){
            
            if(player.lastpos < player.y){
            
            if(buddy.angle<90){
                buddy.angle+=2
            }
            }else{
                if(buddy.angle > -90){
                    buddy.angle-=2.5
                }
            }
            
        }*/
        
        if(player.body.y < game.world.height * 0.5){
            
            var value =  Math.abs(player.body.y - game.world.height * 0.5)
            
            //console.log('value ' + value)
        }

        player.body.x = game.world.centerX 
        characterGroup.x = player.x
        characterGroup.y = player.y +44 
        
        player.lastpos = player.body.y

    }
    
    function deactivateObj(obj){
        
        obj.active = false
        obj.alpha = 0
        
        //console.log('deactivate')
        
    }
    
    function checkPos(object,dist){
        
        var distance = dist || 0.5
        if(Math.abs(player.x - object.world.x) < object.width * dist && Math.abs(player.y - object.world.y) < object.height * dist){
            return true
        }else{
            return false
        }
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
    
    function checkObjects(){
        
        for(var i = 0; i<objectsGroup.length;i++){
            
            var object = objectsGroup.children[i]
            
            if(object.active){
                
                var tag = object.tag
                if(tag == 'cirquit'){
                    if(checkOverlap(buddy,object)){
                        deactivateObj(object)
                        addPoint(player)
                        addObjects()
                    }
                }else{
                    var child = object.children[0]
                    
                    if(child.world.y > game.world.height - 25){
                        deactivateObj(object)
                        //console.log('deactivate obj')
                    }
                    
                    for(var u = 0; u<object.length;u++){
                        
                        var child = object.children[u]
                        var value = 0.5
                        
                        if(checkOverlap(child,buddy)){
                            if(child.tint != buddy.tint){
                                stopGame(false)
                            }
                        }

                    }
                }
                
                if(tag == 'cross' || tag == 'circle'){
                    
                    if(object.isLeft){
                        object.angle-= ANGLE_VALUE * 0.5
                    }else{
                        object.angle+= ANGLE_VALUE * 0.5
                    }
                    
                }
            }
            
            var tag = object.tag
            if(tag == 'bar'){
                    
                object.x += ANGLE_VALUE
                for(var u = 0;u<object.length;u++){

                        var obj = object.children[u]

                        if(obj.world.x > game.world.width + 100){
                            //console.log('last object')
                            obj.x = object.lastObject.x - obj.width *1.5
                            object.lastObject = obj
                        }


                }
            }else if(tag == 'barL'){

                object.x -= ANGLE_VALUE
                for(var u = 0;u<object.length;u++){

                        var obj = object.children[u]

                        if(obj.world.x < -100){
                            //console.log('last object')
                            obj.x = object.lastObject.x + obj.width *1.5
                            object.lastObject = obj
                        }

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

        if(game.physics.p2.gravity.y == 0){
            game.physics.p2.gravity.y = WORLD_GRAVITY
            //marioSong.loopFull(0.5)
        }
        
        var bar = sceneGroup.limit
        if(player.body.y <= bar.body.y + bar.height * 0.87){
            //console.log('move')
            game.add.tween(objectsGroup).to({y:objectsGroup.y + 75},200,Phaser.Easing.linear,true)
        }
        
        player.body.moveUp(jumpValue)        
    
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
        
        //console.log(player.body.y + ' posY')
        if(jumping == true){
            
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
    
    function createPart(key,obj){
        
        var particlesNumber = 2
        
        tooMuch = true
        
        if(game.device.desktop == true && tooMuch == false){ 
            
            particlesNumber = 3
            
            var particlesGood = game.add.emitter(0, 0, 100);

            particlesGood.makeParticles('atlas.neon',key);
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
            var particle = sceneGroup.create(obj.world.x,obj.world.y,'atlas.neon',key)
            particle.tint = COLORS[colorIndex]
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
        }
        
    }
    
    function setPositions(obj){
        
        for(var i = 0;i<obj.length;i++){
            
            var piece = obj.children[i]
            piece.x = piece.origPos
            
            //console.log(piece.origPos + ' pos')
            
        }
        
        obj.lastObject = obj.children[obj.length -1]
                                     
    }
    
    function activateObject(child){
                
         var tag = child.tag
                  
         if(tag == 'bar'){
            //console.log('set orig pos ' + tag)
            //setPositions(child)
            
            //console.log('set orig pos ' + tag)
            //setPositions(child.barL)
            
         }
        
         child.active = true
         child.alpha = 1
         child.y = pivotObjects
         
         if(tag == 'barL'){
            objectToActivate.active = true
         }

         pivotObjects-= 200
         if(tag == 'circle'){
             child.y -= 150
             pivotObjects-= 250
         }

         //console.log( pivotObjects + ' posY object, ' + tag + ' activated')
         
         if(tag == 'circle' || tag == 'cirquit'){
            
             child.x = game.world.centerX
             
         }else if(tag == 'cross'){
             
             var offsetX = 100
             
             child.isLeft = false
             if(Math.random()*2>1){
                 child.isLeft = true
                 offsetX*=-1
             }
             child.x = game.world.centerX + offsetX
             
         }
         
        if(tag == 'bar'){
            
            pivotObjects+=140
            child.active = false
            objectToActivate = child
            activateObject(child.barL)
            
        }else{
            
            if(tag != 'cirquit'){
                addObstacle('cirquit')
             }
            
        }      
         
    
     }
    
    function addObstacle(tag){
        
        for(var i = 0; i < objectsGroup.length;i++){
            
            var object = objectsGroup.children[i]
            if(!object.active && object.tag == tag){
                
                activateObject(object)
                
                break
            }
        }
    }
    
    function calcCircles(n) {
        
        group = game.add.group()
        
        var baseRadius = 125
        var angle = Math.PI / n;
        var s = Math.sin(angle);
        var r = baseRadius * s / (1-s);


        for(var i=0;i<n;++i) {
            var phi = 15 + angle * i * 2;
            var cx = 150+(baseRadius + r) * Math.cos(phi);
            var cy = 150+(baseRadius + r) * Math.sin(phi);
            
            group.create(cx,cy,'atlas.neon','circle').scale.setTo(0.8,0.8)
        }
        
        //group.create(0,0,'atlas.neon','circle').anchor.setTo(0.5,0.5)
        
        return group
    }
    
    function createObstacle(type, number){
        
        for(var o = 0; o<number;o++){
            
            var group 
            if(type == 'cross'){

                group = game.add.group()
                group.x = game.world.centerX
                group.y = game.world.centerY

                for(var i = 0; i<4;i++){

                    var part = group.create(0,0,'atlas.neon','crossPart')
                    part.anchor.setTo(1,0.5)
                    part.tint = COLORS[i]
                    part.angle = i*90
                }

            }else if(type == 'circle'){

                group = calcCircles(16)

                var value = -173
                var valueY = -173
                
                var index = 0
                for(var i = 0; i<group.length ;i++){
                    var obj = group.children[i]
                    
                    obj.x+=value
                    obj.y+=valueY
                    
                    obj.tint = COLORS[index]
                    
                    if((i+1) % 4 == 0){
                        index++
                    }
                                        
                }

                group.x = game.world.centerX 

            }else if(type == 'bar'){

                group = game.add.group()

                var pivotX = game.world.width - 60
                var indexColor = 0
                var length = 24
                for(var i = 0; i<length;i++){

                    var part = group.create(pivotX,0,'atlas.neon','circle')
                    part.scale.setTo(0.8,0.8)
                    part.anchor.setTo(0.5,0.5)
                    part.tint = COLORS[indexColor]
                    part.origPos = part.x

                    if((i+1) % 3 == 0){
                        indexColor++
                        if(indexColor>3){
                            indexColor = 0
                        }
                    }

                    if(i == length-1){
                        group.lastObject = part
                    }
                    pivotX -= part.width * 1.5
                }
                
                var group2 = game.add.group()

                var pivotX = 60
                var indexColor = 0
                var length = 24
                for(var i = 0; i<length;i++){

                    var part = group2.create(pivotX,0,'atlas.neon','circle')
                    part.scale.setTo(0.8,0.8)
                    part.anchor.setTo(0.5,0.5)
                    part.tint = COLORS[indexColor]
                    part.origPos = part.x

                    if((i+1) % 3 == 0){
                        indexColor++
                        if(indexColor>3){
                            indexColor = 0
                        }
                    }

                    if(i == length-1){
                        group2.lastObject = part
                    }
                    pivotX += part.width * 1.5
                }
                
                group.barL = group2
                group2.tag = 'barL'
                group2.alpha = 0
                group2.active = false
                objectsGroup.add(group2)

            }else if(type == 'barL'){

                
                
            }else if(type == 'cirquit'){

                group = objectsGroup.create(0,0,'atlas.neon','cirquit')
                group.anchor.setTo(0.5,0.5)

            }

            group.tag = type
            group.alpha = 0
            group.active = false
            objectsGroup.add(group)
        }
        
    }
    
    function createObjects(){
        
        createObstacle('bar',3)
        //createObstacle('barL',3)
        createObstacle('cross',3)
        createObstacle('circle',3)
        createObstacle('cirquit',4)
        var r = game.rnd.integerInRange(0,2)
        if(r == 0){
            addObstacle('bar')
        }
        else if(r == 1){
            addObstacle('cross')
        }
        else{
            addObstacle('circle')
        }
        for(var i = 0;i<2;i++){
            addObjects()
        }
        
    }
    
    function checkTag(){
        
        var tags = ['circle','cross','bar']
        //tags = ['bar']
        //Phaser.ArrayUtils.shuffle(tags)
        var r = game.rnd.integerInRange(0,tags.length-1)
        
        tag = tags[r]
        
        return tag
    }
    
    function addObjects(){
        
        var tag = checkTag()
        
        addObstacle(tag)
                
    }
    
	return {
        
		assets: assets,
		name: "cirquit",
		create: function(event){
            
            game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.gravity.y = 0;
            game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            game.physics.p2.world.setGlobalStiffness(1e5);
            
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            
			sceneGroup = game.add.group()
            
            var background = new Phaser.Graphics(game)
            background.beginFill(0x2b0f68);
            background.drawRect(0, 0, game.world.width, game.world.height);
            background.endFill();
            background.anchor.setTo(0,0)
            sceneGroup.add(background)
            
            worldGroup = game.add.group()
            //worldGroup.scale.setTo(0.5,0.5)
            //worldGroup.x = 100
            sceneGroup.add(worldGroup)
            
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
            
            particlesGroup = game.add.group()
            worldGroup.add(particlesGroup)
            
            characterGroup = game.add.group()
            characterGroup.x = game.world.centerX
            characterGroup.y = game.world.height - BOT_OFFSET * 3
            worldGroup.add(characterGroup)
            
            buddy = characterGroup.create(0,-45,'atlas.neon','circle')
            buddy.scale.setTo(0.7,0.7)
            buddy.anchor.setTo(0.5,0.5)
            buddy.tint = COLORS[colorIndex]
            
            //createTrail()
            
            player = worldGroup.create(characterGroup.x, characterGroup.y,'atlas.neon','coin')
            player.anchor.setTo(0.5,1)
            player.scale.setTo(0.4,0.4)
            player.alpha = 0
            game.physics.p2.enable(player,DEBUG_PHYSICS)
            player.body.fixedRotation = true
            player.body.mass=50
            player.lastpos = player.y
            
            player.body.collideWorldBounds = true;
            
            //createBase()
                        
            createObjects()
            
            createPointsBar()
            createHearts()
            createControls()   
            
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