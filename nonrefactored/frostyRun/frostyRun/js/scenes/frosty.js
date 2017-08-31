var soundsPath = '../../shared/minigames/sounds/'
var frosty = function(){
    
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
                name: "atlas.frosty",
                json: "images/frosty/atlas.json",
                image: "images/frosty/atlas.png",
            },
        ],
        images: [
			{   name:"fondo",
			file: "images/frosty/background.png"},
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
		],
	}
    
    var SPEED = 225 
    var TIME_ADD = 600
    var JUMP_FORCE = 950
    var DEBUG_PHYSICS = false
    var WORLD_GRAVITY = 1600
    var OFF_BRICK = 350
    var BOT_OFFSET = 0
    
    var board
	var particlesGroup,particlesUsed
    var overlayGroup
    var gameIndex = 84
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
    var answersGroup = null
    var pointsGroup = null
    var gameActive = null
    var jumpTimer = 0
    var characterGroup = null
    var pointsBar = null
    var lives = null
    var heartsGroup = null 
    var groupButton = null
	var mountains, cloud, stars
    

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
        lives = 1	
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
        //getOperation()
        //gameStart = true

    } 
    
    
    function preload() {
        game.stage.disableVisibilityChange = false;  
		buttons.getImages(game)
        
        var addText = ""
        if(game.world.width > game.world.height){
            addText = "Land"
        }
        
        game.load.spine('tigre', "images/spines/Tono.json");
        game.load.image('fondo',"images/frosty/background" + addText + ".png")
        game.load.image('introscreen',"images/frosty/introscreen.png")
		game.load.image('howTo',"images/frosty/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/frosty/play" + localization.getLanguage() + ".png")
        
        game.load.spritesheet('bMonster', 'images/frosty/bMonster.png', 112, 113, 23);
        game.load.spritesheet('pMonster', 'images/frosty/pMonster.png', 112, 105, 23);
        //game.load.spritesheet('coinS', 'images/frosty/coinS.png', 68, 70, 12);
        game.load.audio('marioSong', soundsPath + 'songs/marioSong.mp3');
        
    }
    
    function inputButton(obj){
        
        if(gameActive == false){
            return
        }
        
        
        //sound.play("click")ad
        
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
        }
        
        //changeImage(0,heartsGroup.children[lives])
        heartsGroup.text.setText('X ' + lives)
        //buddy.setAnimationByName(0, "RUN_LOSE", 0.8);
        
        addNumberPart(heartsGroup.text,'-1')
        
    }
    
    function positionPlayer(){
        
        player.body.x = 100 
        characterGroup.x = player.x
        characterGroup.y = player.y +44 
        
        if(player.body.y > game.world.height - 50){
			createPart('wrong',player)
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
                createPart(textPart,obj)
            }
        }
        
    }
    
    function checkObjects(){
        
        //console.log( objectsList.length + 'cantidad objetos')
        for(var index = 0;index<objectsGroup.length;index++){
			
            var obj = objectsGroup.children[index]
			
			if(obj.tag == 'coin'){
                obj.body.rotateLeft(Math.random()*20 + 20)
            }
            
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
                            
							addPoint(obj)
                        
                        	deactivateObj(obj)

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
        buddy.addAnimationByName(0, "JUMPSTILL", false);
        
        player.body.moveUp(jumpValue )
        jumpTimer = game.time.now + 750;
        
        game.time.events.add(750, function(){
            if(gameActive == true){
                //buddy.setAnimationByName(0, "RUN", true);
            }
        } , this);
    
    }
    
    function update(){
        
		cloud.tilePosition.x-=0.2
		stars.tilePosition.y+= 1
		stars.tilePosition.x-= 1
		
        if(!gameActive){
            return
        }
		
		mountains.tilePosition.x-= 3
        
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
        
        var pointsImg = pointsBar.create(10,10,'atlas.frosty','xpcoins')
    
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

        var heartsImg = group.create(0,0,'atlas.frosty','life_box')
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
    
    function createPart(key,obj,offsetX){
        
        var offX = offsetX || 0
        var particle = lookParticle(key)
		
        if(particle){
            
            particle.x = obj.world.x + offX
            particle.y = obj.world.y
            particle.scale.setTo(1,1)
            //game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            //game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            particle.start(true, 1500, null, 6);
			
			game.add.tween(particle).to({alpha:0},500,"Linear",true,1000).onComplete.add(function(){
				deactivateParticle(particle,0)
			})
			
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

				particle.makeParticles('atlas.frosty',tag);
				particle.minParticleSpeed.setTo(-200, -50);
				particle.maxParticleSpeed.setTo(200, -100);
				particle.minParticleScale = 0.6;
				particle.maxParticleScale = 1.5;
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
		
		createParticles('star',5)
		createParticles('drop',5)
		createParticles('wrong',5)
		createParticles('text',5)
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
                missPoint(5)
                createPart('wrong', obj2.sprite)
            }else if(tag == "enemy_squish"){
                if(player.body.y < obj2.sprite.y - 8){
                    doJump(JUMP_FORCE * 1.5)
                    addPoint(obj2.sprite,'drop')
                    sound.play("splash")
                    deactivateObj(obj2.sprite)
                    
                }else{
                    missPoint(5)
                    createPart('wrong', obj2.sprite)
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
				coin.body.y+= 10
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
                
                object = groundGroup.create(-300,-200,'atlas.frosty','bowl')
                
            }else{
                object = groundGroup.create(-300,game.world.height - 350,'atlas.frosty',tag)
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
                object.body.setRectangle(object.width * 0.68, object.height * 0.9);
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
        
        createObjs('floor',1.1,number)
        createObjs('brick',1.1,number)
        createObjs('coin',1,number)
        createObjs('enemy_squish',0.8,number * 0.6)
        createObjs('enemy_spike',0.8,number * 0.6)
        createObjs('skull',1,number * 0.3)
        
        while(pivotObjects < game.world.width * 1.5){
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
            
            var image = group.create(0,0,'atlas.frosty','coin')
            image.anchor.setTo(0.5,0.5)
            
            var image2 = group.create(0,0,'atlas.frosty','coinmissing')
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
			sound.play("pop")
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
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.frosty','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		//console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.frosty',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.frosty','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
	function createBackground(){
		
		var background = sceneGroup.create(-2,-2,'fondo')
		background.width = game.world.width +2
		background.height = game.world.height +2
		
		mountains = game.add.tileSprite(0,game.world.height,game.world.width,651,'atlas.frosty','mountain')
		mountains.anchor.setTo(0,1)
		
		cloud = game.add.tileSprite(0, 100,game.world.width, 266,'atlas.frosty','nube')
		cloud.alpha = 0.5
		sceneGroup.add(cloud)
		
		sceneGroup.add(mountains)
		
	}
	
	return {
		assets: assets,
		name: "frosty",
		create: function(event){
            
            game.physics.startSystem(Phaser.Physics.P2JS);

            game.physics.p2.gravity.y = WORLD_GRAVITY;
            game.physics.p2.world.defaultContactMaterial.friction = 0.3;
            game.physics.p2.world.setGlobalStiffness(1e5);
            
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            
			sceneGroup = game.add.group(); 
			yogomeGames.mixpanelCall("enterGame",gameIndex);
            
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
            
            buddy = game.add.spine(0,0, "tigre");
            buddy.isRunning = true
            buddy.scale.setTo(0.7,0.7)
            characterGroup.add(buddy)            
            buddy.setAnimationByName(0, "RUN", true);
            buddy.setSkinByName('normal');
            
            player = worldGroup.create(characterGroup.x, characterGroup.y,'atlas.frosty','enemy_spike')
            player.anchor.setTo(0.5,1)
            player.alpha = 0
            game.physics.p2.enable(player,DEBUG_PHYSICS)
            player.body.fixedRotation = true
            player.body.mass=50
            
            player.body.collideWorldBounds = true;
            
            positionFirst()
            
            createObjects()
			addParticles()
            
            createPointsBar()
            createHearts()
            createControls()    
            
            //createBoard()
            
            //createControls()
            
            game.physics.p2.setImpactEvents(true);
            
			stars = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.frosty','stars')
			sceneGroup.add(stars)
		
			buttons.getButton(marioSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
            
		},
        preload:preload,
        update:update,
	}

}()