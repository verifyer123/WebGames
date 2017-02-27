var soundsPath = "../../shared/minigames/sounds/"
var nutribaby = function(){
    

	assets = {
        atlases: [
            {   
                name: "atlas.nutribaby",
                json: "images/nutribaby/atlas.json",
                image: "images/nutribaby/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/nutribaby/background.png"},
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
            {	name: "powerup",
				file: soundsPath + "powerup.mp3"},
            {	name: "balloon",
				file: soundsPath + "inflateballoon.mp3"},
            {	name: "bubble",
				file: soundsPath + "bubble.mp3"},
            {	name: "frozen",
				file: soundsPath + "glassbreak.mp3"},
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
    var WORLD_GRAVITY = 1600
    var OFF_BRICK = 330
    var BOT_OFFSET = 105
    
    var gameIndex = 15
    
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
    var itemChance

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
        
        platNames = ['coin']
        itemNames = ['coin']
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
        sceneGroup.addedTree = false
        itemChance = 1.8
        
	}
    
    function animateScene() {
                        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        
        gameActive = true
        doJump()
        sound.play("whoosh")
        
    } 
    
    function preload() {
        
        game.plugins.add(Fabrique.Plugins.Spine);
        
        game.load.spine('mascot', "images/spines/skeleton.json");
        game.stage.disableVisibilityChange = false;
        
        game.load.spritesheet('coinS', 'images/nutribaby/coinS.png', 110, 110, 12);
        game.load.spritesheet('hand', 'images/nutribaby/hand.png',151,67,5)
        game.load.spritesheet('monster', 'images/nutribaby/monster.png', 292, 237, 17);
        
        game.load.audio('runningSong', soundsPath + 'songs/bubble_fishgame.mp3');
        
    }
    
    function breakIce(){
        
        player.timesToBreak++
        
        sound.play("frozen")
        if(player.timesToBreak >= 4){
            
            player.canMove = true
            moveLeft = false
            moveRight = false
            characterGroup.ice.alpha = 0
            characterGroup.hand.alpha = 0
        }
    }
    
    function inputButton(obj){
        
        if(player.canMove){
           
            if(gameActive == true){
                if(obj.tag == 'left'){
                    
                    if(player.backwards){
                        moveLeft = false
                        moveRight = true
                        characterGroup.scale.x = Math.abs(characterGroup.scale.x)
                    }else{
                        
                        moveLeft = true
                        moveRight = false
                        characterGroup.scale.x = Math.abs(characterGroup.scale.x) * -1
                    }
                }else{
                    
                    if(player.backwards){
                        
                        moveLeft = true
                        moveRight = false
                        characterGroup.scale.x = Math.abs(characterGroup.scale.x) * -1
                    }else{
                        
                        moveLeft = false
                        moveRight = true
                        characterGroup.scale.x = Math.abs(characterGroup.scale.x)
                    }
                    
                }
            }
        }else{
            breakIce()
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
        
        var bottomRect = sceneGroup.create(0,0,'atlas.nutribaby','dashboard')
        bottomRect.width = game.world.width
        bottomRect.height *= 1.02
        bottomRect.x = game.world.centerX
        bottomRect.y = game.world.height - bottomRect.height * 0.5
        bottomRect.anchor.setTo(0,1)
        bottomRect.anchor.setTo(0.5,0.5)
        sceneGroup.dashboard = bottomRect
        
        var bottomRect = sceneGroup.create(0,0,'atlas.nutribaby','dashboard')
        bottomRect.width = game.world.width
        bottomRect.alpha = 0
        bottomRect.height *= 1.02
        bottomRect.tag = 'dashboard'
        bottomRect.x = game.world.centerX
        bottomRect.y = game.world.centerY - bottomRect.height * 0.55
        bottomRect.anchor.setTo(0,1)
        
        //bottomRect.body.collides([playerCollisionGroup])
        
        //player.body.createBodyCallback(bottomRect, collisionEvent, this);
        
        sceneGroup.limit = bottomRect
        
        var logo = sceneGroup.create(game.world.centerX - 10, game.world.height - 250,'atlas.nutribaby','logo_dashboard')
        logo.scale.setTo(0.7,0.7)
        logo.anchor.setTo(0.5,0.5)
        
        var groupButton = game.add.group()
        groupButton.x = game.world.centerX + 135
        groupButton.y = game.world.height -110
        groupButton.scale.setTo(-1.4,1.4)
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var button1 = groupButton.create(0,0, 'atlas.nutribaby','left_press')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.nutribaby','left_idle')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.tag = 'right'
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)
        
        var groupButton = game.add.group()
        groupButton.x = game.world.centerX - 135
        groupButton.y = game.world.height -110
        groupButton.scale.setTo(1.4,1.4)
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var button1 = groupButton.create(0,0, 'atlas.nutribaby','left_press')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.nutribaby','left_idle')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.tag = 'left'
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)
        
    }
    
    function stopWorld(){

        buddy.setAnimationByName(0,"FALLING",false)
        var tweenLose = game.add.tween(buddy).to({y:buddy.y - 150}, 1000, Phaser.Easing.Cubic.Out, true)
        tweenLose.onComplete.add(function(){
            game.add.tween(buddy).to({y:buddy.y + game.world.height + game.world.height * 0.2}, 500, Phaser.Easing.Cubic.In, true)
            game.add.tween(objectsGroup).to({y:objectsGroup.y - game.world.height * 0.4},500,Phaser.Easing.linear,true)
        })
    
    }
    
    function stopGame(win){
        
        game.stage.backgroundColor = "#ffffff"
        
        marioSong.stop()
        
        characterGroup.ice.alpha = 0
        characterGroup.hand.alpha = 0
        characterGroup.reverse.alpha = 0
        
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
        sound.play("bubble")
                
        createPart(partName, obj)
        createTextPart('+1', obj)
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        //console.log(obj.tag + ' tag')
        addNumberPart(pointsBar.text,'+1')
        
        var initialValue = 25
        
        if(pointsBar.number == initialValue + 15){
            
            itemNames = ['lata']
        }else if(pointsBar.number == initialValue + 25){
            
            itemNames[itemNames.length] = 'ice'
        }else if(pointsBar.number == initialValue + 90){
            
            itemNames[itemNames.length] = 'helicopter'
        }else if(pointsBar.number == initialValue + 60){
            
            itemNames[itemNames.length] = 'hypnoicon'
        }else if(pointsBar.number == initialValue + 100){
            
            itemNames[itemNames.length] = 'monster'
            itemChance = 1.9
        }else if(pointsBar.number == initialValue + 140){
            itemNames = ['lata','monster','monster','ice','hypnoicon']
            itemChance = 2.2
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
        
        if(player.body.y > game.world.height - sceneGroup.dashboard.height * 0.9 && player.falling){
            
            stopGame()
        }
        
        player.lastpos = player.body.y

    }
    
    function deactivateObj(obj){
        
        obj.active = false
        obj.alpha = 0
        
        if(obj.tween){
            obj.tween.stop()
            obj.tween = null
        }
        
        objectsGroup.remove(obj)
        piecesGroup.add(obj)
        
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
    
    function sethelicopter(){
        
        game.physics.p2.gravity.y = 0
        player.body.velocity.y = 0
        
        sound.play("pop")
        sound.play("balloon")
        
        player.active = false
        moveUp = true
        buddy.setAnimationByName(0, "JUMP_SUPER", true)
            
        game.time.events.add(3000,function(){
                        
            player.active = true
            moveUp = false
            
            game.physics.p2.gravity.y = WORLD_GRAVITY
            
            buddy.setAnimationByName(0,"JUMP",true)
            
            doJump()
        },this)
    }
    
    function checkObjects(){
        
        var playerActive = !player.big && player.canMove && player.active
        
        for(var i = 0; i<objectsGroup.length;i++){
            
            var object = objectsGroup.children[i]
            
            if(object.active){
                
                var tag = object.tag
                
                if(checkOverlap(characterGroup.player,object)){
                    
                    var checkTop = player.world.y < object.world.y - object.height * 0.5 && player.falling && player.active
                    
                    if(tag == 'coin' && player.canMove){
                        
                        if(!moveUp){

                            doJump()
                        }
                        addPoint(object,'star')
                        deactivateObj(object)
                        
                        if(object.isObstacle){
                            addObjects()
                        }
                        
                        
                    }else if(tag == 'lata' && playerActive){
                        
                        player.big = true
                        sound.play('powerup')
                        
                        doJump()
                        
                        var offset = 1
                        if(characterGroup.scale.x < 0){ offset = -1}
                        characterGroup.alpha = 0
                        game.add.tween(characterGroup).to({alpha:1},200,"Linear",true,0,3)
                        
                        characterGroup.scale.setTo(1.5 * offset,1.5)
                        deactivateObj(object)
                        
                        game.time.events.add(3000,function(){
                            characterGroup.alpha = 0
                            game.add.tween(characterGroup).to({alpha:1},200,"Linear",true,0,3).onComplete.add(function(){
                                
                                if(!gameActive){
                                    return
                                }
                                
                                var offset = 1
                                if(characterGroup.scale.x < 0){ offset = -1}
                                characterGroup.scale.setTo(1 * offset,1)
                                player.big = false
                            })
                        })
                        

                        //game.add.tween(characterGroup).to({angle:characterGroup.angle + (360 * offset)},500,Phaser.Easing.linear,true)
                    }else if(tag == 'helicopter' && playerActive){
                        
                        sethelicopter()
                        deactivateObj(object)
                        createPart('star',object)
                    }else if(tag == 'monster' && player.active){
                        
                        
                        if(Math.abs(player.body.x - object.world.x) < 50 && Math.abs(player.body.y - object.world.y) < 50)
                        stopGame()
                    }else if(tag == 'ice' && playerActive){
                        
                        characterGroup.ice.alpha = 1
                        characterGroup.hand.alpha = 1
                        player.canMove = false
                        player.timesToBreak = 1
                        sound.play('frozen')
                        deactivateObj(object)
                        
                        moveLeft = false
                        moveRight = false
                        
                        game.add.tween(characterGroup).to({angle:characterGroup.angle + 360},500,"Linear",true)
                        
                        doJump()
                    }else if(tag == 'hypnoicon' && player.active && player.canMove && !player.backwards){
                        
                        setHypnosis()
                        deactivateObj(object)
                        createPart('wrong',object)
                        sound.play("wrongItem")
                    }
                    
                }
                
                if(object.world.y > game.world.height - 200){
                    deactivateObj(object)
                    
                    if(tag == 'coin' && object.isObstacle){
                        addObjects()
                        //console.log('add obj')
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
    
    function setHypnosis(){
        
        doJump()
        player.backwards = true
        characterGroup.reverse.alpha = 1
        
        var timeDelay = 200
        var delay = 0
        
        for(var counter = 0; counter < 4;counter++){
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
        
        delay += 1500
        game.time.events.add(delay,function(){
            
            if(!gameActive){
                return
            }
            
            delay = 0
            for(var counter = 0; counter < 5;counter++){
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
                
                player.backwards = false  
                characterGroup.reverse.alpha = 0
            })

        })
        
    }
    
    function doJump(value){
        
        if(!gameActive){
            return
        }
        
        var jumpValue = value
        
        if(jumpValue == null){ jumpValue = JUMP_FORCE}
        //sound.play("whoosh")
        
        //buddy.setAnimationByName(0, "JUMP", false);
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
        
        if(player.canMove){
            if(cursors.left.isDown && !moveLeft){
                
                if(player.backwards){
                    
                    player.body.x+= 10
                    if(characterGroup.scale.x < 0){

                        characterGroup.scale.x = Math.abs(characterGroup.scale.x)
                    }
                }else{
                    
                    player.body.x-= 10

                    if(characterGroup.scale.x > 0){

                        characterGroup.scale.x = Math.abs(characterGroup.scale.x) * -1
                    } 
                }
                

            }

            if(cursors.right.isDown && !moveRight){
                
                if(player.backwards){
                    
                    player.body.x-= 10

                    if(characterGroup.scale.x > 0){

                        characterGroup.scale.x = Math.abs(characterGroup.scale.x) * -1
                    } 
                }else{
                    
                    player.body.x+= 10
                    if(characterGroup.scale.x < 0){

                        characterGroup.scale.x = Math.abs(characterGroup.scale.x)
                    }
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
        }else{
            
            if(cursors.left.isDown && !moveLeft){
                
                moveLeft = true
            }

            if(cursors.right.isDown && !moveRight){
                
                moveRight = true
            }
            
            if(cursors.left.isUp && moveLeft){
                breakIce()
                moveLeft = false
            }
            
            if(cursors.right.isUp && moveRight){
                breakIce()
                moveRight = false
            }
        }
        
        checkObjects()
    }

    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(10,10,'atlas.nutribaby','xpcoins')
    
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

        var heartsImg = group.create(0,0,'atlas.nutribaby','life_box')
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
            if(key == 'ringPart'){
                particle.tint = 0xe41ca3
            }
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
                particle = particlesGroup.create(-200,0,'atlas.nutribaby',tag)
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
         child.tween = null
         
         if(tag == 'lata'){
            child.angle = -45
            child.tween = game.add.tween(child).to({angle:45},500,"Linear",true,0,-1)
            child.tween.yoyo(true,0)
         }
         
    }
    
    function addItem(obj){
                
        Phaser.ArrayUtils.shuffle(itemNames)
        
        var tag = itemNames[0]
        
        //console.log(tag + ' tag')
        
        for(var i = 0; i < piecesGroup.length;i++){
            
            var item = piecesGroup.children[i]
            
            if(!item.active && item.tag == tag){
                
                item.isObstacle = false
                var posX = obj.x
                
                posX = obj.x
                while(Math.abs(obj.x - posX) < 100){
                    posX = game.rnd.integerInRange(100,game.world.width - 100)
                }
                    
                
                activateObject(item,posX,obj.y)
                break
            }
        
        }
    }
    
    function addTree(obj){
        
        for(var i = 0; i < piecesGroup.length; i++){
            
            var piece = piecesGroup.children[i]
            
            if(piece.tag == 'bushes'){
                
                var position = game.world.width
                var anchor = 1
                piece.scale.x = 1
                if(Math.random()*2 > 1){

                    position = 0
                    //anchor = 0
                    piece.scale.x = -1
                }
                
                piece.anchor.setTo(anchor,0.5)
                activateObject(piece,position,obj.y)
                
                objectsGroup.remove(obj)
                objectsGroup.add(obj)
                
                break
            }
            
            
            
            
        }
        
    }
    
    function addObstacle(tag){
        
        for(var i = 0; i < piecesGroup.length;i++){
            
            var object = piecesGroup.children[i]
            if(!object.active && object.tag == tag){
                
                object.isObstacle = true
                var posX = game.rnd.integerInRange(100,game.world.width - 100)
                activateObject(object,posX,pivotObjects)
                
                if(Math.random()*1 > 0.7 && !sceneGroup.addedTree){
                    addTree(object)
                    sceneGroup.addedTree = true
                }else{
                    sceneGroup.addedTree = false
                }
                
                if(Math.random()*itemChance >1.5 && object.tag == 'coin' && lastOne){
                    addItem(object)
                }
                
                if(pointsBar.number < 25){
                    addItem(object)
                }
                                
                lastOne = object
                
                pivotObjects-= 115
                
                break
            }
        }
    }
    
    function createObstacle(type, number){
        
        for(var o = 0; o<number;o++){
            
            if(type == 'coin'){
                
                obj = game.add.sprite(0, 0, 'coinS');
                obj.scale.setTo(0.6,0.6)
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
                
                var obj = piecesGroup.create(0,0,'atlas.nutribaby',type)
            }
            
            if(type == 'lata'){
                
                obj.scale.setTo(0.8,0.8)   
            }
            
            obj.anchor.setTo(0.5,0.5)
            obj.tag = type
            obj.alpha = 0
            obj.active = false
        }
        
    }
    
    function createObjects(){
        
        createObstacle('bushes',10)
        createObstacle('coin',30)
        createObstacle('ice',5)
        createObstacle('lata',2)
        createObstacle('helicopter',2)
        createObstacle('hypnoicon',2)
        createObstacle('monster',3)
        
        createParticles('star',5)
        createParticles('wrong',5)
        createParticles('text',8)
        
        for(var i = 0;i<10;i++){
            addObjects()
        }
        
        //objectsGroup.children[0].x = player.body.x
        
    }
    
    function checkTag(){
        
        Phaser.ArrayUtils.shuffle(platNames)
        
        tag = platNames[0]
        
        //console.log(tag + 'tag')
        return tag
    }
    
    function addObjects(){
        
        var tag = checkTag()
        
        //console.log(piecesGroup.length + ' used')
        //console.log(objectsGroup.length + ' saved')
        
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
		name: "nutribaby",
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
            
            //sound.play("marioSong")
            marioSong = game.add.audio('runningSong')
            game.sound.setDecodedCallback(marioSong, function(){
                marioSong.loopFull(0.6)
            }, this);
            
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
            
            var handAnim = game.add.sprite(-70, -200, 'hand');
            //handAnim.scale.setTo(0.8,0.8)
            handAnim.animations.add('walk');
            handAnim.animations.play('walk',12,true); 
            handAnim.alpha = 0
            characterGroup.add(handAnim)
            
            characterGroup.hand = handAnim
            
            var reverseIcon = characterGroup.create(-70,-180,'atlas.nutribaby','reverse')
            reverseIcon.alpha = 0
            reverseIcon.scale.setTo(0.7,0.7)
            characterGroup.reverse = reverseIcon
            
            buddy = game.add.spine(0,0, "mascot");
            buddy.scale.setTo(0.55,0.55)
            characterGroup.add(buddy)            
            buddy.setAnimationByName(0, "JUMP", true);
            buddy.setSkinByName('normal');
            
            var iceFrozen = characterGroup.create(-90,-155,'atlas.nutribaby','frozen')
            iceFrozen.alpha = 0
            iceFrozen.scale.setTo(1.2,1.2)
            characterGroup.ice = iceFrozen
            
            var overPlayer = characterGroup.create(-65,-140,'atlas.nutribaby','meizy')
            overPlayer.alpha = 0
            characterGroup.player = overPlayer
            
            player = worldGroup.create(characterGroup.x, characterGroup.y,'atlas.nutribaby','meizy')
            player.active = true
            player.anchor.setTo(0.5,1)
            player.alpha = 0
            game.physics.p2.enable(player,DEBUG_PHYSICS)
            player.body.fixedRotation = true
            player.body.mass=50
            player.lastpos = player.y
            player.canMove = true
            player.big = false
            player.timesToBreak = 0
            player.backwards = false
            player.body.setCollisionGroup(playerCollisionGroup)
            
            player.body.collides([gameCollisionGroup])
            
            player.body.collideWorldBounds = false;
            
            //createBase()
                        
            createPointsBar()
            createHearts()
            createControls()  
            
            createObjects() 
            
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