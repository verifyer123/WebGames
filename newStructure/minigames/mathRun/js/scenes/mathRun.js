var soundsPath = '../../shared/minigames/sounds/'
var mathRun = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
			"or":"or",
		},

		"ES":{
            "howTo":"¿Cómo Jugar?",
			"or":"ó",
            
		}
	}
    
    assets = {
        atlases: [
            {   
                name: "atlas.runner",
                json: "images/runner/atlas.json",
                image: "images/runner/atlas.png",
            },
        ],
        images: [
            {   name:"tutorial_image",
                file: "images/runner/tutorial_image.png"
            },
            {   name:"sky",
                file: "images/runner/sky.png"
            },
            {   name:"mountains",
                file: "images/runner/mountains.png"
            },
            {   name:"hills",
                file: "images/runner/hills.png"
            },
		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "magic",
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
            {	name: "popObject",
				file: soundsPath + "pop.mp3"},
            {   name: 'marioSong',
                file: soundsPath + 'songs/marioSong.mp3'
            }
		],
        spritesheets: [
            {   name: "coinS",
                file: "images/spines/coinS.png",
                width: 68,
                height: 70,
                frames: 12
            },
            {   name: "bMonster",
                file: "images/spines/bMonster.png",
                width: 83,
                height: 84,
                frames: 16
            },
            {   name: "pMonster",
                file: "images/spines/pMonster.png",
                width: 88,
                height: 78,
                frames: 17
            },
            /*{   name: "hand",
                file: "images/spines/hand.png",
                width: 115,
                height: 111,
                frames: 23
            }*/
        ],
        spines:[
			{
				name:"arthurius",
				file:"images/spines/skeleton.json"
			}
		]
	}
    
    var SPEED = 225 
    var TIME_ADD = 600
    var JUMP_FORCE = 950
    var DEBUG_PHYSICS = false
    var WORLD_GRAVITY = 1600
    var OFF_BRICK = 350
    var BOT_OFFSET = -50
    
    var board
    var overlayGroup
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
    var pivotObjects
    var player
	var sceneGroup = null
    var groundGroup = null
    var tileGroup
    var answersGroup = null
    var pointsGroup = null
    var gameActive = null
    var jumpTimer = 0
    var characterGroup = null
    var pointsBar = null
    var lives = null
    var heartsGroup = null 
    var groupButton = null
	var playerCollision, enemiesCollision, assetsCollision
    

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
        skullTrue = false
        gameSpeed =  SPEED
        lastOne = null
        game.stage.backgroundColor = "#ffffff"
        jumpTimer = 0
        gameActive = false
        lives = 3
        pivotObjects = 0
        objToCheck = null
        buttonPressed = false
        tooMuch = false
        GRAVITY_OBJECTS = 4
        yAxis = p2.vec2.fromValues(0, 1);
        consecFloor = 0
        consecBricks = 0
        
	}
    
    function animateCoin(coin,delay,number){
        
        game.time.events.add(delay,function(){
            coin.alpha = 1
            number.alpha = 1
            game.add.tween(coin.scale).from({x:0.01,y:0.01},300,Phaser.Easing.linear,true)
            sound.play("popObject")
        },this)
    }
    
    function getOperation(){
        
        var index = game.rnd.integerInRange(1,2)
        
        //console.log(index + ' indexNumber')
        
        if(index == 1){
            
            player.number1 = game.rnd.integerInRange(1,8)
            player.number2 = game.rnd.integerInRange(1, 9 - player.number1)

            player.result = player.number1 + player.number2
            board.signText.setText('+')
            
        }else if(index == 2){
            
            player.number1 = game.rnd.integerInRange(2,9)
            player.number2 = game.rnd.integerInRange(1,player.number1 - 1)
            
            player.result = player.number1 - player.number2
            board.signText.setText('-')
        }
        
        board.numbers[0].setText(player.number1)
        board.numbers[1].setText(player.number2)
        
        
        var delay = 500
        
        for(var i = 0; i<board.coins.length;i++){
            
            var coin = board.coins[i]
            board.numbers[i].alpha = 0
            coin.alpha = 0
            animateCoin(coin,delay,board.numbers[i])
            delay+=200
            
        }
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
        getOperation()
        //gameStart = true

    } 
       
    function preload() {
        game.stage.disableVisibilityChange = false;  
       
    }
    
    function inputButton(obj){
        
        if(gameActive == false){
            return
        }
        
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
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var button2 = new Phaser.Graphics(game)
        button2.beginFill(0xffffff);
        button2.drawRect(0, 0, game.world.width, game.world.height);
        button2.endFill();
        button2.alpha = 0
        button2.anchor.setTo(0,0)
        button2.inputEnabled = true
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)
        groupButton.add(button2)
        
    }
    
    function stopWorld(){
        
        for(var i = 0;i<objectsGroup.length;i++){
            var child = objectsGroup.children[i]
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
        
        //missPoint(5)
        sound.play("gameLose")
        stopWorld()
        //game.add.tween(objectsGroup).to({alpha:0},250, Phaser.Easing.Cubic.In,true)
        
        //objectsGroup.timer.pause()
        gameActive = false
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex,1.4)
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
    
    function addPoint(obj,part){
        
        var partName = part || 'star'
        sound.play("magic")
        createPart(partName, obj)
        createTextPart('+1', obj)
        
        //gameSpeed +=10
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        if(pointsBar.number == 5){
            enemyNames[enemyNames.length] = 'enemy_squish'
        }else if(pointsBar.number == 10){
            enemyNames[enemyNames.length] = 'enemy_spike'
        }else if(pointsBar.number == 25){
            consecBricks = -100
            consecFloor = -100
        }else if(pointsBar.number == 30){
            skullTrue = true
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
    
    function missPoint(points){
        
        sound.play("wrong")
        
        lives-=points
        if(lives<=0){
            lives = 0
            stopGame()
        }else{

			buddy.alpha = 0
			player.invincible = true
			game.add.tween(buddy).to({alpha:1},100,"Linear",true,0,10).onComplete.add(function(){
				player.invincible = false
			})
		}

        heartsGroup.text.setText('X ' + lives)
        
        
        
    }
    
    function positionPlayer(){
        
        player.body.x = 100 
        characterGroup.x = player.x
        characterGroup.y = player.y +44 
        
        if(player.body.y > game.world.height - 50){
			createPart('wrong',player)
			addNumberPart(heartsGroup.text,'-'+lives)
            missPoint(5)
			
            //stopGame()
        }
        
    }
    
    function deactivateObj(obj){
        
        obj.body.velocity.x = 0
        obj.used = false
        obj.body.y = -500
        
        objectsGroup.remove(obj)
        groundGroup.add(obj)
    }
    
    function deactivateCoins(textPart){
    
        for(var i = 0;i<objectsGroup.length;i++){
            
            var obj = objectsGroup.children[i]
            if(obj.tag == 'coin' && obj.used){
                deactivateObj(obj)
                deactivateObj(obj.text)
                createPart(textPart,obj)
            }
        }
        
    }
    
    function checkObjects(){
        
        //console.log( objectsList.length + 'cantidad objetos')
        for(var index = 0;index<objectsGroup.length;index++){
            
            var obj = objectsGroup.children[index]
            
            if(obj.used){
                if(obj.body.x < -obj.width * 0.45){
                    deactivateObj(obj)
                    if(obj.tag == 'floor' || obj.tag == 'brick'){
                        addObjects()
                    }
                    //console.log('objeto removido')
                }else if(obj.tag == 'coin' || obj.tag == 'skull'){
                    
                    if(Math.abs(obj.body.x - player.body.x) < 50 && Math.abs(obj.body.y - player.body.y) < 50){
                        if(obj.tag == 'coin'){
                            
                            if(player.result == obj.text.number){
                                addPoint(obj)
                                deactivateCoins('star')
                            }else{
                                sound.play("wrong")
                                createPart('wrong',obj)
                                deactivateCoins("wrong")
                                missPoint(1)
								addNumberPart(heartsGroup.text,'-1')
                            }
                            
                            getOperation()
                        }else if(obj.tag == 'skull'){
                            sound.play("wrongItem")
                            createPart('wrong',obj)
                            addWrongTween()
                        }
                        
                        deactivateObj(obj)
                        if(obj.text){
                            deactivateObj(obj.text)
                        }
                    }

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
        
        tileGroup.mountains.tilePosition.x -= 0.2
        tileGroup.hills.tilePosition.x -= 1
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
        pointsBar.x = game.world.width
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.runner','xpcoins')
        pointsImg.anchor.setTo(1,0)
    
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.45
        pointsText.y = pointsImg.height * 0.25
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
        pointsBar.add(pointsText)
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }
    
    function createHearts(){
    
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        var pivotX = 10
        
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.runner','life_box')

        pivotX += heartImg.width * 0.45
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = heartImg.height * 0.15
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        heartsGroup.text = pointsText
                
    }
    
    function createPart(key,obj){
        
        var particlesNumber = 2
        
        tooMuch = true
        
        if(game.device.desktop == true && tooMuch == false){ 
            
            particlesNumber = 3
            
            var particlesGood = game.add.emitter(0, 0, 100);

            particlesGood.makeParticles('atlas.runner',key);
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
            var particle = sceneGroup.create(obj.world.x,obj.world.y - 20,'atlas.runner',key)
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

            }else if(tag == "floor" || tag == "brick"){
                if(gameActive == true && buddy.isRunning == false){
                    buddy.isRunning = true
                    if(player.body.y < obj2.sprite.body.y){
                        buddy.setAnimationByName(0, "LAND", false);
                        buddy.addAnimationByName(0,"RUN",true)
                    }
                }
            }else if(tag == 'enemy_spike'){
				
				if(!player.invincible){
					missPoint(1)
                	createPart('wrong', obj2.sprite)
					doJump(JUMP_FORCE * 1.3)
				}
                
            }else if(tag == "enemy_squish"){
                if(player.body.y < obj2.sprite.y - 8){
                    doJump(JUMP_FORCE * 1.3)
                    addPoint(obj2.sprite,'drop')
                    sound.play("splash")
                    deactivateObj(obj2.sprite)
                    
                }else{
					if(!player.invincible){
						missPoint(1)
                    	createPart('wrong', obj2.sprite)
						doJump(JUMP_FORCE * 1.3)
					}
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
    
    function setCoinNumber(coinText){
        
        var number
        
        number = player.result
        if(Math.random() * 3 > 1){
            
            while(number == player.result){
                
                number = game.rnd.integerInRange(1,9)
            }
        }
        
        coinText.setText(number)
        coinText.number = number
    }
    
    function activateObject(posX, posY, child){
        //console.log(child.tag + ' tag,')
        if(child != null){

            child.body.x = posX
            child.body.y = posY
            child.used = true
            child.body.velocity.x = -gameSpeed 
            //objectsList[objectsList.length] = child

            groundGroup.remove(child)
            objectsGroup.add(child)

            if(child.tag == 'coin'){
                child.body.y-=25
                if(Math.random()*2 > 1){
                    child.body.y-=80
                }
                
                setCoinNumber(child.text)
                activateObject(child.body.x -1, child.body.y +3,child.text)

            }else if(child.tag == "enemy_squish"){
                child.body.y+=5
            }else if(child.tag == "skull"){
                child.body.velocity.x-=5
                //child.body.dynamic = true
            }
        }

    }
    
    function checkAdd(obj, tag){
        
        Phaser.ArrayUtils.shuffle(enemyNames)
        
        if(objToCheck && objToCheck.tag == 'floor' && obj.tag == 'brick' && objToCheck.coinUsed){
            deactivateObj(objToCheck.coinUsed)
            deactivateObj(objToCheck.coinUsed.text)
        }
        
        if(objToCheck && objToCheck.coin){
            return
        }
        
        if(gameActive == true && gameStart){
            
            var nameItem = enemyNames[0]
            if(objToCheck.tag == 'floor' && tag == 'brick'){
                return
            }
            
            if(objToCheck.spike == true){
                nameItem = 'coin'
            }
            
            if((objToCheck.body.y > obj.body.y) && (nameItem == 'enemy_spike' || nameItem == 'enemy_squish')){
                nameItem = 'coin'
            }
            

            var coin = addComplement(nameItem)
            if(coin != null){
                activateObject(pivotObjects,obj.body.y - obj.height * 0.5 - coin.height * 0.5,coin)
            }
            
            obj.spike = false
            obj.coin = false
            obj.coinUsed = null
            if(nameItem == 'enemy_spike'){
                obj.spike = true
            }else if(nameItem == 'coin'){
                obj.coin = true
                obj.coinUsed = coin
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
                        child.body.y-= OFF_BRICK * 0.5
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
                
            }else if(tag == 'enemy_squish'){
                
                object = game.add.sprite(-300, 200, 'pMonster');
                groundGroup.add(object)
                object.animations.add('walk');
                object.animations.play('walk',20,true);
                
            }else if(tag == 'coin'){
                
                object = groundGroup.create(-300,200,'atlas.runner','coin')
                
                var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
            
                var pointsText = new Phaser.Text(sceneGroup.game, -300,200, '2', fontStyle)
                pointsText.anchor.setTo(0.5,0.5)
                groundGroup.add(pointsText)
                
                pointsText.anchor.setTo(0.5,0.5)
                pointsText.tag = 'number'
                pointsText.used = false
                game.physics.p2.enable(pointsText,DEBUG_PHYSICS)
                pointsText.body.kinematic = true
                pointsText.used = false
                pointsText.body.data.shapes[0].sensor = true
                
                object.text = pointsText
                
            }else{
                object = groundGroup.create(-300,game.world.height - 350,'atlas.runner',tag)
            }
            
            object.scale.setTo(scale,scale)
            object.anchor.setTo(0,1)
            object.tag = tag
            game.physics.p2.enable(object,DEBUG_PHYSICS)
            object.body.kinematic = true
            object.used = false
            
			if(tag == 'floor' || tag == 'brick'){
				object.body.setCollisionGroup(assetsCollision)	
				object.body.collides([playerCollision,enemiesCollision])
			}else if(tag == 'enemy_squish' || tag == 'enemy_spike'){
				object.body.setCollisionGroup(enemiesCollision)
				object.body.collides([playerCollision])
			}
			
			object.body.collides([playerCollision,enemiesCollision])
			
            if(tag == 'coin' || tag == 'skull'){
                object.body.data.shapes[0].sensor = true
            }
            
            
            if(tag != 'coin' && tag != 'skull'){
                object.body.allowSleep = true
                player.body.createBodyCallback(object, collisionEvent, this);
            }
        }
    }
    
    function createObjects(){
        
        var width = game.cache.getImage("floor").width
        
        var number = (game.world.width / width) + 5
        
        createObjs('floor',1.4,number)
        createObjs('brick',1.1,number)
        createObjs('coin',0.5,number)
        createObjs('enemy_squish',1,number * 0.6)
        createObjs('enemy_spike',1,number * 0.6)
        createObjs('skull',1,number * 0.3)
        
        while(pivotObjects < game.world.width * 1.2){
            addObstacle('floor')
            //console.log(pivotObjects + ' pivot, ' + game.world.width + ' width')
        }
        
    }
    
    function checkTag(){
        
        if(gameStart){
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
        }else{
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
            game.time.events.add(100,checkOnAir,this)
        }
    }
    
    function createBoard(){
        
        board = game.add.group()
        board.x = game.world.centerX
        board.y = 150
        sceneGroup.add(board)
        
        var boardImg = new Phaser.Graphics(game)
        boardImg.beginFill(0x000000);
        boardImg.drawRoundedRect(0, 0, 450,100,30);
        boardImg.x-= boardImg.width * 0.5
        boardImg.y-= boardImg.height * 0.5
        boardImg.endFill();
        boardImg.alpha = 0.6
        board.add(boardImg)
        
        board.numbers = []
        board.coins = []
        
        var pivotX = -150
        for(var i = 0; i< 3;i++){
            
            var group = game.add.group()
            group.x = pivotX
            group.y = 0
            group.scale.setTo(0.6,0.6)
            board.coins[board.coins.length] = group
            board.add(group)
            
            var image = group.create(0,0,'atlas.runner','coin')
            image.anchor.setTo(0.5,0.5)
            
            var image2 = group.create(0,0,'atlas.runner','coinmissing')
            image2.alpha = 0
            image2.anchor.setTo(0.5,0.5)
            
            var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
            
            var pointsText = new Phaser.Text(sceneGroup.game, pivotX,group.y + 5, '2', fontStyle)
            pointsText.anchor.setTo(0.5,0.5)
            board.add(pointsText)
            
            board.numbers[board.numbers.length] = pointsText
            
            pivotX+= 150
            
        }
        
        changeImage(1,board.coins[2])
        board.numbers[2].setText('')
        
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var signText = new Phaser.Text(sceneGroup.game,-75,0,'+',fontStyle)
        signText.anchor.setTo(0.5,0.5)
        board.add(signText)
        board.signText = signText
        
        var signText = new Phaser.Text(sceneGroup.game,75,0,'=',fontStyle)
        signText.anchor.setTo(0.5,0.5)
        board.add(signText)
        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		
        sceneGroup.add(overlayGroup)
        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
     
    }

    function onClickPlay(){
        overlayGroup.y = -game.world.height
        
        gameActive = true
        gameStart = true
    }
    
    function createBackground(){
        
        var sky = sceneGroup.create(0,0,'sky')
        sky.width = game.world.width
        sky.height = game.world.height - 200
        
        tileGroup = game.add.group()
        sceneGroup.add(tileGroup)
        
        var mountains = game.add.tileSprite(0, game.world.height - 100, game.world.width, game.world.height - 200, 'mountains')
        mountains.anchor.setTo(0,1)
        tileGroup.add(mountains)
        tileGroup.mountains = mountains
        
        var castle = tileGroup.create(game.world.centerX, game.world.centerY + 160, "atlas.runner", "castle0")
        castle.anchor.setTo(0, 1)
        game.physics.arcade.enable(castle)
        castle.checkWorldBounds = true
        castle.events.onOutOfBounds.add(resetObj, this)
        castle.body.velocity.x = -SPEED * 0.1
        
        var hills = game.add.tileSprite(0, game.world.height + 50, game.world.width, game.world.height - 240, 'hills')
        hills.anchor.setTo(0,1)
        tileGroup.add(hills)
        tileGroup.hills = hills
    }
    
    function resetObj(cast){
        cast.reset(game.world.width, game.world.centerY + 160)
        cast.loadTexture('atlas.runner', "castle" + game.rnd.integerInRange(0, 2))
        cast.body.velocity.x = -SPEED * 0.1
    }
    
	return {
		assets: assets,
		name: "mathRun",
		create: function(event){
            
            game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.gravity.y = WORLD_GRAVITY;
            game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            game.physics.p2.world.setGlobalStiffness(1e5);
			
            playerCollision = game.physics.p2.createCollisionGroup()
            enemiesCollision = game.physics.p2.createCollisionGroup()
            assetsCollision = game.physics.p2.createCollisionGroup()
			
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
            
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
            characterGroup.y = game.world.height - 200
            worldGroup.add(characterGroup)
            
            buddy = game.add.spine(0,0, "arthurius");
            buddy.isRunning = true
            buddy.scale.setTo(0.7,0.7)
            characterGroup.add(buddy)            
            buddy.setAnimationByName(0, "RUN", true);
            buddy.setSkinByName('normal');
            
            player = worldGroup.create(characterGroup.x, characterGroup.y,'atlas.runner','enemy_spike')
            player.anchor.setTo(0.5,1)
            player.alpha = 0
            game.physics.p2.enable(player,DEBUG_PHYSICS)
            player.body.fixedRotation = true
            player.body.mass=50
			player.invincible = false
            
            player.body.collideWorldBounds = false;
			
			player.body.setCollisionGroup(playerCollision)
			player.body.collides([enemiesCollision,assetsCollision])
            
            positionFirst()
            
            createObjects()
            
            createPointsBar()
            createHearts()
            createControls()    
            
            createBoard()
            
            //createControls()
            
            game.physics.p2.setImpactEvents(true);
            
			buttons.getButton(marioSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
            
		},
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
        update:update,
	}

}()