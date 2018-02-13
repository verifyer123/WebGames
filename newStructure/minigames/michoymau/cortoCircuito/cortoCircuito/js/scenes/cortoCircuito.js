var soundsPath = '../../shared/minigames/sounds/'
var cortoCircuito = function(){
    assets = {
        atlases: [
            {   
                name: "atlas.corto",
                json: "images/corto/atlas.json",
                image: "images/corto/atlas.png",
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
			{	name: "okTut",
				file: soundsPath + "pop.mp3"},
		],
	}
    
    var SPEED = 225 
    var TIME_ADD = 600
    var JUMP_FORCE = 820
    var DEBUG_PHYSICS = false
    var WORLD_GRAVITY = 1600
    var OFF_BRICK = 330
    var BOT_OFFSET = 0
    
    var gameIndex = 2
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
    var particlesGroup
    var particlesUsed
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
    var skinTable
    var heartsGroup = null 
    var groupButton = null
	var reviewComic = false
	var back1,back2
    
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
        gameStart = false
        jumping = false
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
        skinTable = []
	}
    
    function animateScene() {
                        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        gameActive = true
        //timer.start()
        //game.time.events.add(throwTime *0.1, dropObjects , this);
        //objectsGroup.timer.start()
        //game.time.events.add(TIME_ADD, addObjects , this);
        checkOnAir()
        //gameStart = true

    } 
    
    
    function preload() {
        game.stage.disableVisibilityChange = false;
		buttons.getImages(game)

        game.load.spine('mascot', "images/spines/oon.json");
        
        game.load.spritesheet('bMonster', 'images/corto/sprites/bMonster.png', 193, 213, 23);
        game.load.spritesheet('pMonster', 'images/corto/sprites/pMonster.png', 88, 78, 17);
        game.load.spritesheet('coinS', 'images/corto/sprites/coinS.png', 68, 70, 12);
		
		game.load.image('howTo',"images/corto/tutorial/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/corto/tutorial/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/corto/tutorial/introscreen.png")
		
		game.load.image('comic1',"images/comic/1.png");
        game.load.image('comic2',"images/comic/2.png");
        game.load.image('comic3',"images/comic/3.png");
        game.load.image('comic4',"images/comic/4.png");
	
		game.load.audio('marioSong', soundsPath + 'songs/game_on.mp3');
		
    }
	function createComic(totalPages){
        var comicGroup = game.add.group();
        var comicrect = new Phaser.Graphics(game)
        comicrect.beginFill(0x131033)
        comicrect.drawRect(0,0,game.world.width *2, game.world.height *2);
        comicrect.alpha = 1;
        comicrect.endFill();
        comicrect.inputEnabled = true;
        comicGroup.add(comicrect);
        var arrayComic = new Array;
        
        for(var i= totalPages-1;i>=0;i--){
            arrayComic[i] = comicGroup.create(0,0,"comic" + [i+1]);
            arrayComic[i].x = game.world.centerX;
            arrayComic[i].anchor.setTo(0.5,0);
        }
        var counterPage = 0;
        var button1 = new Phaser.Graphics(game);
        button1.beginFill(0xaaff95);
        button1.alpha = 0;
        button1.drawRect(0,0,100, 70);
        button1.x = game.world.centerX - 50;
        button1.y = game.height - button1.height*1.4;
        button1.endFill();
        button1.inputEnabled = true;
        comicGroup.add(button1); 
        var button2 = new Phaser.Graphics(game);
        button2.beginFill(0xaaff95);
        button2.alpha = 0;
        button2.drawRect(0,0,100, 70);
        button2.x = game.world.centerX - button2.width*1.1;
        button2.y = game.height - button2.height*1.4;
        button2.endFill();
        button2.inputEnabled = true;
        comicGroup.add(button2);
        button2.visible = false;
        button1.events.onInputDown.add(function(){
            sound.play("okTut");
            arrayComic[counterPage].alpha = 0;
            counterPage++;
                if(counterPage == 1){
                    button2.visible = true;
                    button1.x = button1.x + button1.width/1.5;
                }else{
                    if(counterPage == totalPages-1){
                        button2.visible = false;
                        button1.x = game.world.centerX - 50;
                        }else if(counterPage > totalPages-1){
							createOverlay();
                        game.add.tween(comicGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                                comicGroup.y = -game.world.height
                 
                                comicGroup.visible = false;
                                reviewComic = true;
                        });
                        }
                }  
        },this);        
        button2.events.onInputDown.add(function(){
            sound.play("okTut");
            counterPage--;
            arrayComic[counterPage].alpha = 1;
                if(counterPage == 0){
                    button2.visible = false;
                    button1.x = game.world.centerX - 50;
                }
        },this);
        
        sceneGroup.add(comicGroup);
    }
    
    function inputButton(obj){
        
        if(gameActive == false){
            return
        }
        
        //sound.play("click")
        
        if(buddy.isRunning == true){
            if (checkIfCanJump())
            {
                
                groupButton.isPressed = true
                jumping = true
                doJump()
            }
        }
        
    }
    
    function releaseButton(obj){
        
        groupButton.isPressed = false
        jumping = false
    }
    
    function createControls(){
        
		groupButton = game.add.group()
		sceneGroup.add(groupButton)
		
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0
        rect.endFill()
        rect.inputEnabled = true
		rect.events.onInputDown.add(inputButton)
		rect.events.onInputUp.add(releaseButton)
		groupButton.add(rect)
        
    }
	
	function createOverlay(){
        
		whiteFade = new Phaser.Graphics(game)
		whiteFade.beginFill(0xffffff)
		whiteFade.drawRect(0,0,game.world.width * 2, game.world.height * 2)
		whiteFade.alpha = 0
		whiteFade.endFill()
		sceneGroup.add(whiteFade)
			
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
			sound.play("okTut")
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
				
				overlayGroup.y = -game.world.height
				gameActive = true
				gameStart = true
				
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.corto','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		var offX = 0
		
		if(game.device.desktop){
			inputName = 'desktop'
			offX = 13
		}
		
		//console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX + offX,game.world.centerY + 125,'atlas.corto',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.corto','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
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
			resultScreen.setScore(true, pointsBar.number,gameIndex)
            //amazing.saveScore(pointsBar.number)
			sceneloader.show("result")
		})
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
            enemyNames[enemyNames.length] = 'enchufe'
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
    
    function missPoint(){
        
        sound.play("wrong")
        if (lives >0){
            lives--;
        }
        //changeImage(0,heartsGroup.children[lives])
        heartsGroup.text.setText('X ' + lives)
        //buddy.setAnimationByName(0, "RUN_LOSE", 0.8);
        
        createTextPart('-1',heartsGroup.text)
        createPart('wrong',player)
        
    }
    
    function positionPlayer(){
        
        player.body.x = 100 
        characterGroup.x = player.x
        characterGroup.y = player.y +44 
            
		if(player.body.y > game.world.height - 50){

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
        
        var jumpValue = value
        
        if(jumpValue == null){ jumpValue = JUMP_FORCE}
        sound.play("whoosh")
        
        buddy.isRunning = false
        
        buddy.setAnimationByName(0, "JUMP", false);
        //buddy.addAnimationByName(0, "LAND", false);
        
        player.body.moveUp(jumpValue )
        jumpTimer = game.time.now + 750;
        
        game.time.events.add(750, function(){
            if(gameActive == true){
                //buddy.setAnimationByName(0, "RUN", true);
            }
        } , this);
    
    }
    
    function update(){
        
        
        
        if(gameActive == false){
            return
        }
		
		back1.tilePosition.x-= 1
		back2.tilePosition.x-= 2
        
        positionPlayer()
        
        if (jumpButton.isDown){
            
            if( checkIfCanJump() && jumping == false)
            {
                jumping = true
                doJump()
            }
        }
        
        if(jumping == true){
            player.body.velocity.y-=2
            jumping = false
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
        
        var pointsImg = pointsBar.create(10,10,'atlas.corto','xpcoins')
    
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

        var heartsImg = group.create(0,0,'atlas.corto','life_box')
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
    
    function addWrongTween(){
        
        var number = 3
        if(pointsBar.number >= number){
            pointsBar.number-=number
            createTextPart('-' + number,pointsBar.text)
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
                        //console.log('land')
                        buddy.setAnimationByName(0, "LAND", false);
                        buddy.addAnimationByName(0,"RUN",true)
                    }
                }
            }else if(tag == 'enemy_spike' || tag == 'enchufe'){
				if(tag == 'enchufe'){
					createPart('chispa',player)
				}
                stopGame()
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
            }else if(child.tag == "enchufe"){
                child.body.y+=170
			}else if(child.tag == 'enemy_spike'){
				child.body.y+=35
            }else if(child.tag == "skull"){
                child.body.velocity.x-=5
                //child.body.dynamic = true
            }
        }
    
     }
    
    function checkAdd(obj, tag){
        
        Phaser.ArrayUtils.shuffle(enemyNames)
        
        if(Math.random()*2 > 1 && gameActive && gameStart){
            
            var nameItem = enemyNames[0]
            if(objToCheck.tag == 'floor' && tag == 'brick'){
                nameItem = 'coin'
            }
            
            if(objToCheck.spike == true){
                nameItem = 'coin'
            }
            
            if((objToCheck.body.y > obj.body.y) && (nameItem == 'enemy_spike' || nameItem == 'enchufe')){
                nameItem = 'coin'
            }
            

            var coin = addComplement(nameItem)
            if(coin != null){
                activateObject(pivotObjects,obj.body.y - obj.height * 0.5 - coin.height * 0.5,coin)
            }
            
            obj.spike = false
            if(nameItem == 'enemy_spike' || nameItem == 'enchufe'){
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
                        child.body.y-= OFF_BRICK * 0.45
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
                
            }else if(tag == 'coin'){
                
                object = game.add.sprite(-300, 200, 'coinS');
                groundGroup.add(object)
                object.animations.add('walk');
                object.animations.play('walk',24,true);   
            }else{
                object = groundGroup.create(-300,game.world.height - 350,'atlas.corto',tag)
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
                object.body.setRectangle(object.width * 0.5, object.height * 0.7);
            }else if(tag == 'enchufe'){
				object.body.setRectangle(object.width * 0.2,object.height * 0.9)
			}
            
            if(tag != 'coin' && tag != 'skull'){
                object.body.allowSleep = true
                player.body.createBodyCallback(object, collisionEvent, this);
            }
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
	
    function createTextPart(text,obj){
        
        var pointsText = lookParticle('text')
        
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y - 60
            pointsText.setText(text)
            pointsText.scale.setTo(1,1)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
        
    }
    
    function lookParticle(key){
        
        for(var i = 0;i<particlesGroup.length;i++){
            
            var particle = particlesGroup.children[i]
			//console.log(particle.tag + ' tag,' + particle.used)
            if(particle.tag == key){
                
				particle.used = true
                particle.alpha = 1
                
				if(key == 'text'){
					particlesGroup.remove(particle)
                	particlesUsed.add(particle)
				}
                
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
    
    function createPart(key,obj,offsetX){
        
        var offX = offsetX || 0
        var particle = lookParticle(key)
		
        if(particle){
            
            particle.x = obj.world.x + offX
            particle.y = obj.world.y
            particle.scale.setTo(1,1)
            //game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            //game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            particle.start(true, 1500, null, 6);+
			particle.setAlpha(1,0,2000,Phaser.Easing.Cubic.In)
			
			/*game.add.tween(particle).to({alpha:0},500,"Linear",true,1000).onComplete.add(function(){
				deactivateParticle(particle,0)
			})*/
			
        }
        
        
    }
    
    function createParticles(tag,number){
                
        for(var i = 0; i < number;i++){
            
            var particle
            if(tag == 'text'){
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                var particle = game.add.emitter(0, 0, 100);

				particle.makeParticles('atlas.corto',tag);
				particle.minParticleSpeed.setTo(-400, -150);
				particle.maxParticleSpeed.setTo(400, -300);
				particle.minParticleScale = 0.4;
				particle.maxParticleScale = 1.2;
				particle.gravity = 150;
				particle.angularDrag = 30;
				
				particlesGroup.add(particle)
				
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            //particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
	
	function addParticles(){
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',1)
		createParticles('wrong',1)
		createParticles('text',5)
		createParticles('chispa',1)

	}
	
    function createObjects(){
        
        createObjs('floor',1.4,12)
        createObjs('brick',1.1,12)
        createObjs('coin',1,6)
        createObjs('enchufe',0.75,5)
        createObjs('enemy_spike',0.7,5)
        createObjs('skull',1,2)
        
        while(pivotObjects < game.world.width * 1.3){
			//console.log('adding Block ' + pivotObjects + ' gameWidth ' + (game.world.width * 1.2))
            addObstacle('floor')
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
		
		if(!gameStart){
			tag = 'floor'
		}
        
        return tag
    }
    
    function addObjects(){
        
        var tag = checkTag()
        
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
		
		var cloud = worldGroup.create(game.world.centerX - 250,game.world.centerY - 300,'atlas.corto','cloud')
		var cloud = worldGroup.create(game.world.centerX + 100,game.world.centerY - 200,'atlas.corto','cloud')
		cloud.alpha = 0.7
		cloud.scale.setTo(0.8,0.8)
		
		back1 = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.corto','sky')
		worldGroup.add(back1)
		
		back2 = game.add.tileSprite(0,0,game.world.width,189,'atlas.corto','board')
		worldGroup.add(back2)
		
	}
	
	return {
		assets: assets,
		name: "cortoCircuito",
		create: function(event){
            
            game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.gravity.y = WORLD_GRAVITY;
            game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            game.physics.p2.world.setGlobalStiffness(1e5);
            
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

			sceneGroup = game.add.group()
			
            worldGroup = game.add.group()
            sceneGroup.add(worldGroup)
			
			createBackground()
                        
            groundGroup = game.add.group()
            worldGroup.add(groundGroup)
            
            loadSounds()
			initialize()       
            			
			marioSong = game.add.audio('marioSong')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.6)
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
            characterGroup.y = game.world.height - 300
            worldGroup.add(characterGroup)
            
            buddy = game.add.spine(0,0, "mascot");
            buddy.isRunning = true
            buddy.scale.setTo(0.5,0.5)
            characterGroup.add(buddy)            
            buddy.setAnimationByName(0, "RUN", true);
            buddy.setSkinByName('normal1');
            
            player = worldGroup.create(characterGroup.x, characterGroup.y,'atlas.corto','enemy_spike')
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
            
			addParticles()
            //createControls()
            
            game.physics.p2.setImpactEvents(true);
            
			buttons.getButton(marioSong,sceneGroup)
			
			if(!reviewComic){
				createComic(4);
			}else{
			  createOverlay();  
			}
            animateScene()
            
            
		},
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
        update:update
	}

}()