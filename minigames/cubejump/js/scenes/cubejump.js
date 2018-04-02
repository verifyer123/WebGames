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
    var ACID_SPEED = 2.5
    var WORLD_GRAVITY = 1600
    var OFF_BRICK = 330
    var BOT_OFFSET = 105
    
    var gameIndex = 14
    var gameId = 5674368789118976
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
    var particlesGroup, particlesUsed
    var gameInit = false
    var firstObstacle = null
    var startedTween = []
    var nextTweens = []
    var nextObjects = []
    var desactivatObjects = []

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
        gameInit = false
        firstObstacle = null
        nextObjects = []
        startedTween = []
        nextTweens = []
        desactivatObjects = []
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
        		
		if(amazing.getMinigameId()){
			marioSong = sound.setSong(soundsPath + 'songs/chemical_electro.mp3',0.6)
		}else{
			game.load.audio('runningSong', soundsPath + 'songs/chemical_electro.mp3');
		}
		
        
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
        
        marioSong.pause()
        
        missPoint()
        sound.play("gameLose")
        stopWorld()
        game.add.tween(characterGroup).to({alpha:0},250, Phaser.Easing.Cubic.In,true)
        
        worldGroup.alpha = 0
        game.add.tween(worldGroup).to({alpha:1},250,Phaser.Easing.linear,true)
        firstObstacle = null
        //objectsGroup.timer.pause()
        gameActive = false
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
            console.log(pointsBar.number)
			resultScreen.setScore(true, pointsBar.number,gameIndex)
            
            //amazing.saveScore(pointsBar.number) 
            
			sceneloader.show("result")
		})
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
        
        var pointsText = lookParticle('textPart')
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y
            pointsText.anchor.setTo(0.5,0.5)
            pointsText.scale.setTo(0.7,0.7)
            pointsText.setText(number)

            game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
            
            deactivateParticle(pointsText,800)
        }
        
        
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
        
        /*if(player.body.y > player.lastpos + 5){
            player.falling = true    
        }else{
            player.falling = false
        }*/
        
        characterGroup.x = player.x
        characterGroup.y = player.y +44 
        
        /*if(player.body.y > game.world.height - sceneGroup.dashboard.height  - player.height * 0.25 && player.falling){
            
            //stopGame()
        }*/
        
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

        if(!player.active){
            return
        }
        
        var firstObjectNeedTween = false

        var checkFalling = player.falling


        for(var i = 0; i<objectsGroup.length;i++){
            
            var object = objectsGroup.children[i]
            
            var col = false

            if(object.active){
                
                var tag = object.tag
                
                if(tag == 'fija' || tag == 'movil'){
                    
                    for(var u = 0; u<object.length;u++){

                        var obj = object.children[u]

                        var checkTop = player.world.y < obj.world.y  && checkFalling && player.active

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

                                    if(firstObstacle == object && !gameInit){

                                        firstObjectNeedTween = true

                                        for(var i = 0 ; i < startedTween.length; i++){
                                            startedTween[i].stop()
                                        }
                                        
                                        //console.log(nextTweens.length)
                                        for(var i = 0 ; i < nextTweens.length; i++){
                                            if(nextTweens[i]!=null){
                                                nextTweens[i].resume()
                                                //console.log('start tween '+i)
                                            }
                                        }
                                        gameInit = true;
                                    }

                                    if(firstObjectNeedTween){
                                        game.add.tween(obj).to({x:0},100,Phaser.Easing.linear,true)
                                    }

                                    //

                                    col = true
                                    player.falling = false  
                                
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
                                    //console.log('Enter bad '+ '  '+player.falling)
                                    buddy.animations.play('air',12,false)
                                    player.body.velocity.y = 0
                                    //player.active = false
                                    sound.play('wrongItem')
                                }
                            }
                        }

                    }
                }

                /*if(player.world.y < object.children[0].world.y ){
                    deactivateObj(object)
                    
                    console.log('deactivateObjects')
                    
                }*/
                
            }

            if(col){
                activateNext()
                acid.acidSpeed+=0.08
                desactivatObjects.push(object)

                if(desactivatObjects.length>3){
                    //console.log("Desactivate object")
                     deactivateObj(desactivatObjects[0])
                     desactivatObjects.splice(0,1)
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

        if(!gameInit){
           // gameInit = true
           delayObjects+=1500
        }

        player.falling = true
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
        if(!gameInit){
            activateNext()
        }
        
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

    function activateNext(){
        var child = nextObjects[0];
        //console.log(nextObjects.length)
        var tag = child.tag

        var timeToClose = game.rnd.integerInRange(75,115) * 10
        if(!gameInit){
            timeToClose = 700
        }

        nextObjects.splice(0,1)

        if(tag == 'movil'){
            timeToClose = game.rnd.integerInRange(80,115) * 10
        }

        for(var i = 0; i< child.length;i++){

             var obj = child.children[i]
            
            if(tag == 'fija'){

                game.add.tween(obj).to({x:0},timeToClose,Phaser.Easing.linear,true,300)
            }
            else{
                game.add.tween(obj).to({angle:0},timeToClose,Phaser.Easing.linear,true,300)
            }
        }
    }
    
    function activateObject(child,posX,posY){
        
        piecesGroup.remove(child)
        objectsGroup.add(child)

        objectsGroup.bringToTop(acid);

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
        

        //console.log(delayObjects)

        nextObjects.push(child)
        for(var i = 0; i< child.length;i++){

            var obj = child.children[i]
            
            if(tag == 'fija'){
                
                obj.x = obj.initPos
                //var t = game.add.tween(obj).to({x:0},timeToClose,Phaser.Easing.linear,true,delayObjects)
                /*if(!gameInit){
                    var t = game.add.tween(obj).to({x:0},timeToClose,Phaser.Easing.linear,true,delayObjects)
                    nextTweens.push(t)
                    t.pause()
                }
                else{
                     game.add.tween(obj).to({x:0},timeToClose,Phaser.Easing.linear,true,delayObjects)
                }*/
            }else if(tag == 'movil'){
                
                obj.angle = obj.initAngle
                //var t = game.add.tween(obj).to({angle:0},timeToClose,Phaser.Easing.linear,true,delayObjects)
                /*if(!gameInit){
                    
                    //t.pause()
                    var t = game.add.tween(obj).to({angle:0},timeToClose,Phaser.Easing.linear,true,delayObjects)
                    t.pause()
                    nextTweens.push(t)
                }
                else{
                    game.add.tween(obj).to({angle:0},timeToClose,Phaser.Easing.linear,true,delayObjects)
                }*/
            }
            
        }

        var timeValue = 1500

        if(acid.acidSpeed != 0 ){
            timeValue = 0 
        }

        //console.log(timeValue + ' timeValue')
        delayObjects+= timeValue
         
    }

    function specialActive(child,posX,posY){
        //console.log("special Active")
        piecesGroup.remove(child)
        objectsGroup.add(child)

        objectsGroup.bringToTop(acid);

        var tag = child.tag
        child.active = true
        child.alpha = 1
        child.y = posY
        child.x = posX

        nextObjects.push(child)
        
        var timeToClose = game.rnd.integerInRange(85,175) * 10

        if(player.jumps == 1){
            delayObjects-=1200
        }
        
        
        for(var i = 0; i< child.length;i++){

            var obj = child.children[i]
            
            if(tag == 'fija'){
                
                obj.x = obj.initPos
                //var t = game.add.tween(obj).to({x:0},timeToClose,Phaser.Easing.linear,true,delayObjects,-1)
                //t.yoyo(true,0)
                //startedTween.push(t)
            }
            
        }

        delayObjects = 0

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
        //console.log("Enter to add objects")
        
        for(var i = 0; i < piecesGroup.length;i++){
            
            var object = piecesGroup.children[i]


            if(!object.active && object.tag == tag){

                //console.log(object.active+"   "+object.tag+"  "+piecesGroup.length )
                
                var posX = game.world.centerX
                if(firstObstacle!=null){
                    activateObject(object,posX,pivotObjects)
                }
                else{
                    firstObstacle = object
                    specialActive(object,posX,pivotObjects)
                }
                
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
    
    function createObjects(){
        
        
        createObstacle('fija',10,1)
        createObstacle('movil',10,1)
        
        particlesGroup = game.add.group()
        sceneGroup.add(particlesGroup)
        
        particlesUsed = game.add.group()
        sceneGroup.add(particlesUsed)

        createAcid()
        
        createParticles('star',3)
        createParticles('ring',3)
        createParticles('drop',5)
        createParticles('drops',3)
        //createParticles('wrong',2)
        createParticles('text',4)
        
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
            			
			if(!amazing.getMinigameId()){
				marioSong = game.add.audio('runningSong')
				game.sound.setDecodedCallback(marioSong, function(){
					marioSong.loopFull(0.6)
				}, this);
			}
            
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