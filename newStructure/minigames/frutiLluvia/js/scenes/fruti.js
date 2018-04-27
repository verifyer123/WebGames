var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var fruti = function(){
	assets = {
        atlases: [
            {   
                name: "atlas.fruti",
                json: "images/fruti/atlas.json",
                image: "images/fruti/atlas.png",
            },
        ],
        images: [

		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "magic.mp3"},
            {	name: "splash",
				file: soundsPath + "splashMud.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
			{	name: "explode",
				file: soundsPath + "explode.mp3"},
            {	name: "shootBall",
				file: soundsPath + "shootBall.mp3"},
            {	name: "click",
				file: soundsPath + "pop.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "bomb",
				file: soundsPath + "bomb.mp3"},
		],
	}
    
    var SPEED = 7
    var GRAVITY_OBJECTS = 4
    var GRAVITY_GUMS = 4
    var OBJ_TIME = 1300
    var ITEM_TIME = 800
    var skinTable
    
    var gameIndex = 93
    var marioSong = null
	var sceneGroup = null
    var answersGroup = null
    var pointsGroup = null
    var questionText = null
    var questionGroup = null
    var purpleBack = null
    var gameActive = true
    var valuesList = null
    var moveLeft, moveRight
    var objectsGroup, usedObjects
    var characterGroup = null
    var timer
    var timeGroup = null
    var pointsBar = null
    var throwTime = null
    var lives = null
    var particlesGroup
    var particlesUsed
    var heartsGroup = null
    var leftKey = null
    var rightKey = null
    var buddy = null
    var buttonPressed = null
    var bombsList, itemList
    var throwTimeItems
    var tooMuch
	var overlayGroup
	var background
	var particlesGroup, particlesUsed
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = true
        moveLeft = false
        moveRight = false
        throwTime = OBJ_TIME
        throwTimeItems = ITEM_TIME
        lives = 1
        buttonPressed = false
        tooMuch = false
        GRAVITY_OBJECTS = 4
        skinTable = []
        itemList = ['chip']
        
	}
        
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)        
        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        

    }
    
    function checkNumbers(){
        
        //console.log(valuesList.length)
        var valuesCompare = [1,2,3,4]
        var tableCompare = [0,0,0,0]
        
        for(var i = 0 ; i < valuesCompare.length;i++){
            
            for(var e = 0; e < valuesList.length;e++){
                //console.log(valuesCompare[i] + ' i ' + valuesList[e] + ' u ')
                if(valuesCompare[i] == valuesList[e]){
                    tableCompare[i]++
                }
            }
        }
        
        //console.log(tableCompare)
        var indexToUse = 0
        var findNumber = false
        for(var i = 0;i < tableCompare.length;i++){
            indexToUse = i
            for(var u = 0;u<tableCompare.length;u++){
                if (i != u){
                    if (tableCompare[i] < tableCompare[u]){
                        break
                    }
                }
                if(u == tableCompare.length - 1){
                    findNumber = true
                }
            }
            if (findNumber == true){
                break
            }
        }
        //console.log(indexToUse + ' number To use')
        return indexToUse
    }
    
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    }    
    
    
    function preload() {
        

				
		game.forceSingleUpdate = true
        game.stage.disableVisibilityChange = false;
        game.load.spine('mascot', "images/spines/claritavaquita.json");
		
		game.load.image('howTo',"images/fruti/tutorial/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/fruti/tutorial/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/fruti/tutorial/introscreen.png")
        		
		game.load.audio('arcadeSong', soundsPath + 'songs/classic_arcade.mp3');
		
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
            buddy.setAnimationByName(0, "RUN", 0.8);
        }
    }
    
    function releaseButton(obj){
        
        if(gameActive == true){
            if(obj.tag =='left'){
                moveLeft = false
            }else{
                moveRight = false
            }
            
            if(!moveLeft && !moveRight){
                buddy.setAnimationByName(0, "IDLE", 0.8);
            }
            
        }
    }
    
    function createControls(){
		
		var leftRect = new Phaser.Graphics(game)
        leftRect.beginFill(0xffffff);
        leftRect.drawRect(0, 0, game.world.width * 0.5, game.world.height);
        leftRect.endFill();
		leftRect.alpha = 0
		leftRect.events.onInputDown.add(inputButton)
        leftRect.tag = 'left'
        leftRect.events.onInputUp.add(releaseButton)
		leftRect.inputEnabled = true
		sceneGroup.add(leftRect)
				
        var rightRect = new Phaser.Graphics(game)
        rightRect.beginFill(0xffffff);
        rightRect.drawRect(game.world.width * 0.5, 0, game.world.width * 0.5, game.world.height);
        rightRect.endFill();
		rightRect.alpha = 0
		rightRect.events.onInputDown.add(inputButton)
        rightRect.tag = 'right'
        rightRect.events.onInputUp.add(releaseButton)
		rightRect.inputEnabled = true
		sceneGroup.add(rightRect)
        
    }
    
    function moveChRight(){
        characterGroup.x+=SPEED;
        if (characterGroup.x>=game.world.width - 50){
            characterGroup.x = game.world.width - 50
        }
    }
    
    function moveChLeft(){
        characterGroup.x-=SPEED;
        if (characterGroup.x<=50){
            characterGroup.x = 50
        }
    }
    
    function stopGame(win){
        
        game.add.tween(objectsGroup).to({alpha:0},250, Phaser.Easing.Cubic.In,true)
        sound.play("gameLose")
        
        //objectsGroup.timer.pause()
        gameActive = false
        
        var newSkin = buddy.createCombinedSkin(
            'combined2',     
            'glasses' + skinTable[0] + '_Sad',        
            'hair' +  skinTable[1],
            'skin' + skinTable[2],
            'torso' + skinTable[3],
            'vaso'
        );
        
        buddy.setSkinByName('combined2')
        
        buddy.setToSetupPose()
        
        buddy.setAnimationByName(0,"LOSE",false)
		buddy.addAnimationByName(0,"LOSESTILL",true)

		marioSong.stop()
                
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

            sceneloader.show("result")
		})
    }
    
    function addPoint(number,fruit){
        
		if(fruit){
			buddy.setSkinByName(fruit)
			buddy.setToSetupPose()
		}
        sound.play("pop")
        createPart('star', characterGroup.cup)
        createTextPart('+' + number, characterGroup.cup)
        
        pointsBar.number+= number
        pointsBar.text.setText(pointsBar.number)
        
        GRAVITY_OBJECTS+=0.2
        throwTime-=17
        
        if(pointsBar.number == 10){
			createAssets('fresa',1,3)
			createAssets('guayaba',1,3)
        }else if(pointsBar.number == 15){
			createAssets('limon',1,5)
            createAssets('mango',1,5)
        }else if(pointsBar.number == 20){
            createAssets('durazno',2,5)
            createAssets('zarzamora',2,5)
        }
        
        //throwTimeItems-=10
        
    }
    
    function missPoint(){
        
        sound.play("explode")
        
        lives--;
        //changeImage(0,heartsGroup.children[lives])
        heartsGroup.text.setText('X ' + lives)
        //buddy.setAnimationByName(0, "RUN_LOSE", 0.8);
        
        if(lives == 0){
            stopGame(false)
        }
        
    }
    
    function deactivateObject(obj){
        
        obj.alpha = 0
        obj.active = false
        obj.x = -100
        
        if(obj.tag != 'obstacle'){
            usedObjects.remove(obj)
            objectsGroup.add(obj)
        }
        
    }
    
    function checkPos(obj){
        
        var cup = characterGroup.cup
        //console.log(cup.world.x + ' cupx')
        if(obj.active == true){
            if(Math.abs(cup.world.x - obj.x) < cup.width * 0.5 && Math.abs(cup.world.y - obj.y) < cup.height*0.6){
                deactivateObject(obj)
                if(obj.tag == 'candy'){
                    addPoint(obj.points,obj.fruit)
                }else{
                    createPart('wrong',characterGroup.cup)
                    missPoint()
                }
            }else if(obj.y > game.world.height - background.bot.height){
                deactivateObject(obj)
                if(obj.tag == 'candy'){
                    //missPoint()
                    createPart('drop',obj)
                    sound.play("splash")
                }else if(obj.tag == 'obstacle'){
                    createPart('smoke',obj)
                    sound.play("bomb")
                }
            }else if(Math.abs(cup.world.x - obj.x) < cup.width * 0.5 && Math.abs(cup.world.y + 45 - obj.y) < cup.height*0.6 && obj.tag == 'candy'){
                deactivateObject(obj)
                addPoint(obj.points,obj.fruit)
            }
        }
    }
    
    function update(){
        
        if(gameActive == false){
            return
        }
		
		background.tilePosition.x++
        
        if(moveRight == true){
            moveChRight()
            
        }else if(moveLeft == true){
            moveChLeft()
        }else if (leftKey.isDown){
            if(buttonPressed == false){
                buddy.setAnimationByName(0, "RUN", 0.8);
            }
            buttonPressed = true 
            moveChLeft()
            characterGroup.scale.x = -1
        }else if(rightKey.isDown){
            if(buttonPressed == false){
                buddy.setAnimationByName(0, "RUN", 0.8);
            }
            buttonPressed = true
            moveChRight()
            characterGroup.scale.x = 1
        } else if(leftKey.isUp && rightKey.isUp){
            if(buttonPressed == true){
                buddy.setAnimationByName(0, "IDLE", 0.8);
            }
            buttonPressed = false
        }
        
        for(var i = 0; i < usedObjects.length;i++){
            var obj = usedObjects.children[i]
            if(obj.tag == 'candy'){
                obj.y+= GRAVITY_GUMS
            }else if(obj.tag == 'obstacle'){
                obj.y+= GRAVITY_OBJECTS
            }
            obj.rotation+=0.1
            
            checkPos(obj)
        }
        
    }
    
    function createTime(){
        
        timeGroup = game.add.group()
        timeGroup.x = game.world.right
        timeGroup.y = 0
        sceneGroup.add(timeGroup)
        
        var timeImg = timeGroup.create(0,0,'atlas.fruti','time')
        timeImg.width*=1.3
        timeImg.height*=1.3
        timeImg.anchor.setTo(1,0)
        
        var fontStyle = {font: "27px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var timerText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        timerText.x = -timeImg.width * 0.55
        timerText.y = timeImg.height * 0.18
        timeGroup.add(timerText)
        
        timeGroup.textI = timerText
        timeGroup.number = 0
        
        timer = game.time.create(false);
        timer.loop(1, updateSeconds, this);
                
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.fruti','xpcoins')
        pointsImg.anchor.setTo(1,0)
    
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.45
        pointsText.y = pointsImg.height * 0.25
        pointsBar.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
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

        var heartImg = group.create(0,0,'atlas.fruti','life_box')

        pivotX+= heartImg.width * 0.45
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = heartImg.height * 0.15
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
    
     function updateSeconds(){
        
        timeGroup.number += 1;
        timeGroup.textI.setText(timeGroup.number / 100)
        
    }
    
    function checkPosObj(posX){
        
        var samePos = false
        for(var i = 0;i<usedObjects.length;i++){
            var obj = usedObjects.children[i]
            if(Math.abs(obj.x - posX) < 75 && Math.abs(obj.y - -50) < 100){
                samePos = true
            }
        }
        return samePos
        
    }
    
    function activateObject(objToUse){
                
        var posX = game.rnd.integerInRange(50, game.world.width - 50)
        
        if(usedObjects.length > 0){
            
            //objToUse.x = usedObjects.children[0].x
            while (checkPosObj(posX)){
                posX = game.rnd.integerInRange(75, game.world.width - 75)
                //if(posX < 75){ posX = 75}
                if(gameActive == false){ break}
            }
            
        }
        
        objToUse.alpha = 1
        objToUse.x = posX
        objToUse.y = -50
        objToUse.active = true
        
        objectsGroup.remove(objToUse)
        usedObjects.add(objToUse)
        
        
        
        //console.log(objToUse.x + ' position X')
        
    }
    
    function createBomb(){
        var bomb = sceneGroup.create(-100,0,'atlas.fruti','bomb')
        bomb.anchor.setTo(0.5,0.5)
        bomb.tag = 'obstacle'
        bombsList[bombsList.length] = bomb
        return bomb
    }
    
    function addBomb(){
        
        if(gameActive == false){
            return
        }
        
        sound.play("shootBall")
        
        var objToUse = null
        for(var i = 0;i<bombsList.length;i++){
            var bomb = bombsList[i]
            if(bomb.x< -50){
                objToUse = bomb
                break
            }
        }
        if(objToUse == null){
            objToUse = createBomb()
        }
        objToUse.tag = 'obstacle'
        activateObject(objToUse)
        
        if (gameActive == true){
            game.time.events.add(throwTime, addBomb , this);
        }
        
    }
    
    function addItem(){
        
        if(gameActive == false){
            return
        }
        
        sound.play("shootBall")
        
        var objToUse = null
        
        Phaser.ArrayUtils.shuffle(itemList)
        var tag = itemList[0]
        
        for(var i = 0;i<objectsGroup.length;i++){
            var item = objectsGroup.children[i]
            if(item.x< -50 && tag == item.id){
                objToUse = item
                break
            }
        }
        if(objToUse){
            //objToUse = createItem()
            activateObject(objToUse)
        }
        
        
        if (gameActive == true){
            game.time.events.add(throwTimeItems, addItem , this);
        }
    }
    
    function dropObjects(){
                
        game.time.events.add(throwTimeItems, addItem , this);
        game.time.events.add(throwTime, addBomb , this);        
    }
    
    function createAssets(tag,points,number){
        
        itemList[itemList.length] = tag
        for(var i = 0; i < number;i++){
            var item = objectsGroup.create(-100,0,'atlas.fruti',tag)
            item.anchor.setTo(0.5,0.5)
            item.tag = 'candy'
			item.fruit = tag
            item.points = points
            item.id = tag
        }
        
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
                
                //console.log(particle)
                
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

				particle.makeParticles('atlas.fruti',tag);
				particle.minParticleSpeed.setTo(-300, -200);
				particle.maxParticleSpeed.setTo(300, -100);
				particle.minParticleScale = 0.3;
				particle.maxParticleScale = 1;
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
		createParticles('drop',1)
		createParticles('smoke',1)

	}
    
    function createObjects(){
        
        bombsList = []
        
        for(var i = 0;i<7;i++){
            createBomb()
        }
        
        createAssets('manzana',1,5)
		createAssets('blueberry',1,5)
        
        addParticles()
                
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
                
				gameActive = true
        		game.time.events.add(throwTime *0.5, dropObjects , this);
				
				overlayGroup.y = -game.world.height
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.fruti','gametuto')
		tuto.anchor.setTo(0.5,0.5)
		tuto.scale.setTo(0.9,0.9)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 260,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.fruti',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.fruti','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
	
	function createBackground(){
		
		var botBack = game.add.tileSprite(0,game.world.height,game.world.width,286 * 0.7,'atlas.fruti','ground')
		botBack.anchor.setTo(0,1)
		botBack.tileScale.y = 0.7
		botBack.tileScale.x = 0.7
		sceneGroup.add(botBack)
		
		background = game.add.tileSprite(0,game.world.height - botBack.height,game.world.width,game.world.height - botBack.height,'atlas.fruti','sky')
		background.anchor.setTo(0,1)
		sceneGroup.add(background)
		
		background.bot = botBack
		
	}
	
    function create(){
        
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        
        sceneGroup = game.add.group()
        
       	createBackground()
        
        loadSounds()
        initialize()  
        
        objectsGroup = game.add.group()
        sceneGroup.add(objectsGroup)
        
        usedObjects = game.add.group()
        sceneGroup.add(usedObjects)
        
        characterGroup = game.add.group()
        characterGroup.x = game.world.centerX
        characterGroup.y = game.world.height - background.bot.height
        sceneGroup.add(characterGroup)
        
        buddy = game.add.spine(0,0, "mascot");
        buddy.scale.setTo(0.6,0.6)
        characterGroup.add(buddy)
        
        var cup = characterGroup.create(0,-110,'atlas.fruti','vaso')
        cup.alpha = 0
        cup.anchor.setTo(0.5,0.5)
        cup.scale.setTo(0.85,0.85)
        characterGroup.cup = cup
        
        buddy.setAnimationByName(0, "IDLE", true);
        buddy.setSkinByName('skin1');
        //buddy.setSkin(newSkin)
        
        buddy.setToSetupPose()
        
        game.onPause.add(function(){
			game.sound.mute = true
			
		} , this);

		game.onResume.add(function(){
			game.sound.mute = false
			
		}, this);
        
        buddy.setSkinByName('blueberry')

		marioSong = game.add.audio('arcadeSong')
		game.sound.setDecodedCallback(marioSong, function(){
			marioSong.loopFull(0.3)
		}, this);	
        
        createPointsBar()
        createHearts()
        createControls()
        createObjects()
		
		buttons.getButton(marioSong,sceneGroup)
		createOverlay()
        animateScene()
        
    }
    
	return {
		assets: assets,
		name: "fruti",
		create: create,
        preload: preload,
        update: update,
	}
}()