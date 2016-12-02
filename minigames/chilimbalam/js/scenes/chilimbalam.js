var soundsPath = "../../shared/minigames/sounds/"
var chilimbalam = function(){
	assets = {
        atlases: [
            {   
                name: "atlas.chilimbalam",
                json: "images/chilimbalam/atlas.json",
                image: "images/chilimbalam/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/chilimbalam/fondo.png"},
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
		],
	}
    
    var SPEED = 7
    var GRAVITY_OBJECTS = 4
    var GRAVITY_GUMS = 4
    var OBJ_TIME = 1300
    var ITEM_TIME = 800
    
	var sceneGroup = null
    var answersGroup = null
    var pointsGroup = null
    var questionText = null
    var questionGroup = null
    var purpleBack = null
    var gameActive = true
    var valuesList = null
    var moveLeft, moveRight
    var characterGroup = null
    var timer
    var timeGroup = null
    var pointsBar = null
    var throwTime = null
    var lives = null
    var heartsGroup = null
    var leftKey = null
    var rightKey = null
    var particlesGroup, particlesGood, particlesWrong
    var buddy = null
    var buttonPressed = null
    var bombsList, itemList
    var throwTimeItems
    var tooMuch
    

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
        
	}
    

    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)        
        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        gameActive = true
        //timer.start()
        game.time.events.add(throwTime *0.5, dropObjects , this);
        //objectsGroup.timer.start()

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
        game.stage.disableVisibilityChange = true;
        game.load.spine('mascot', "images/spines/mascotaAmazing.json");
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
            buddy.setAnimationByName(0, "IDLE", 0.8);
        }
    }
    
    function createControls(){
        
        var spaceButtons = 220
        
        var bottomRect = new Phaser.Graphics(game)
        bottomRect.beginFill(0xffffff);
        bottomRect.drawRect(0, game.world.height, game.world.width, -game.world.height * 0.175);
        bottomRect.endFill();
        bottomRect.anchor.setTo(0,1)
        sceneGroup.add(bottomRect)
        
        var button1 = sceneGroup.create(game.world.centerX - spaceButtons, game.world.height - 155, 'atlas.chilimbalam','boton')
        button1.inputEnabled = true
        button1.events.onInputDown.add(inputButton)
        button1.tag = 'left'
        button1.events.onInputUp.add(releaseButton)
        
        var button2 = sceneGroup.create(game.world.centerX + spaceButtons, game.world.height - 155, 'atlas.chilimbalam','boton')
        button2.scale.x = -1
        button2.inputEnabled = true
        button2.events.onInputDown.add(inputButton)
        button2.tag = 'right'
        button2.events.onInputUp.add(releaseButton)
        
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
        
        //objectsGroup.timer.pause()
        gameActive = false
        buddy.setAnimationByName(0,"SAD",0.6)
        //timer.pause()
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number)

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
    
    function addPoint(number){
        
        sound.play("pop")
        createPart('star', characterGroup.cup)
        createTextPart('+' + number, characterGroup.cup)
        
        pointsBar.number+= number
        pointsBar.text.setText(pointsBar.number)
        
        GRAVITY_OBJECTS+=0.2
        throwTime-=17
        
        if(pointsBar.number == 10){
            createAssets('takis',1,5)
        }else if(pointsBar.number == 15){
            for(var i = 0;i<5;i++){
                createAssets('gomita' + (i + 1),1,1)
            }
            
        }else if(pointsBar.number == 20){
            createAssets('peanut',1,3)
        }else if(pointsBar.number == 25){
            createAssets('pina',2,2)
            createAssets('skwinkle',1,2)
            createAssets('takis',2,2)
        }
        
        //throwTimeItems-=10
        
    }
    
    function missPoint(){
        
        sound.play("wrong")
        
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
        objectsGroup.remove(obj)
    }
    
    function checkPos(obj){
        
        var cup = characterGroup.cup
        //console.log(cup.world.x + ' cupx')
        if(obj.active == true){
            if(Math.abs(cup.world.x - obj.x) < cup.width * 0.5 && Math.abs(cup.world.y - obj.y) < cup.height*0.6){
                deactivateObject(obj)
                if(obj.tag == 'candy'){
                    addPoint(obj.points)
                }else{
                    createPart('wrong',characterGroup.cup)
                    missPoint()
                }
            }else if(obj.y > game.world.height * 0.825){
                deactivateObject(obj)
                if(obj.tag == 'candy'){
                    //missPoint()
                    createPart('drop',obj)
                    //sound.play("splash")
                }else if(obj.tag == 'obstacle'){
                    createPart('smoke',obj)
                    //sound.play("explode")
                }
            }else if(Math.abs(cup.world.x - obj.x) < cup.width * 0.5 && Math.abs(cup.world.y + 45 - obj.y) < cup.height*0.6 && obj.tag == 'candy'){
                deactivateObject(obj)
                addPoint(obj.points)
            }
        }
    }
    
    function update(){
        
        if(gameActive == false){
            return
        }
        
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
        
        for(var i = 0; i < objectsGroup.length;i++){
            var obj = objectsGroup.children[i]
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
        
        var timeImg = timeGroup.create(0,0,'atlas.chilimbalam','time')
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
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(0,10,'atlas.chilimbalam','xpcoins')
        pointsImg.x = game.world.width - pointsImg.width * 1.2
        pointsImg.width *=1
        pointsImg.height*=1
    
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
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        group.create(0,0,'atlas.chilimbalam','life_box')

        pivotX+= 47
        
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = 2
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
        for(var i = 0;i<objectsGroup.length;i++){
            var obj = objectsGroup.children[i]
            if(Math.abs(obj.x - posX) < 75 && Math.abs(obj.y - -50) < 100){
                samePos = true
            }
        }
        return samePos
        
    }
    
    function activateObject(objToUse){
                
        var posX = game.rnd.integerInRange(50, game.world.width - 50)
        
        if(objectsGroup.length > 0){
            
            objToUse.x = objectsGroup.children[0].x
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
        objectsGroup.add(objToUse)
        
        //console.log(objToUse.x + ' position X')
        
    }
    
    function createBomb(){
        var bomb = sceneGroup.create(-100,0,'atlas.chilimbalam','bomb')
        bomb.anchor.setTo(0.5,0.5)
        bomb.tag = 'obstacle'
        bombsList[bombsList.length] = bomb
        return bomb
    }
    
    function createItem(){
        
        var itemName
        
        var item = sceneGroup.create(-100,0,'atlas.chilimbalam',itemName + game.rnd.integerInRange(1,6))
        item.anchor.setTo(0.5,0.5)
        item.tag = 'candy'
        itemList[itemList.length] = item
        
        return item
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
        for(var i = 0;i<itemList.length;i++){
            var item = itemList[i]
            if(item.x< -50){
                objToUse = item
                break
            }
        }
        if(objToUse == null){
            objToUse = createItem()
        }
        activateObject(objToUse)
        
        if (gameActive == true){
            game.time.events.add(throwTimeItems, addItem , this);
        }
    }
    
    function dropObjects(){
                
        game.time.events.add(throwTimeItems, addItem , this);
        game.time.events.add(throwTime, addBomb , this);        
    }
    
    function createPart(key,obj){
        
        var particlesNumber = 2
        
        tooMuch = true
        //console.log('fps ' + game.time.fps)
        if (game.time.fps < 45 && tooMuch == false){
            tooMuch = true
        }
        
        if(game.device.desktop == true && tooMuch == false){ 
            
            particlesNumber = 3
            
            var particlesGood = game.add.emitter(0, 0, 100);

            particlesGood.makeParticles('atlas.chilimbalam',key);
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
            var particle = sceneGroup.create(obj.world.x,obj.world.y - 60,'atlas.chilimbalam',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
        }
        
    }
    
    function createParticles(){
        
        particlesGroup = game.add.group()
    }
    
    function createAssets(tag,points,number){
        
        for(var i = 0; i < number;i++){
            var item = sceneGroup.create(-100,0,'atlas.chilimbalam',tag)
            item.anchor.setTo(0.5,0.5)
            item.tag = 'candy'
            itemList[itemList.length] = item
            item.points = points
        }
        
    }
    
    function createObjects(){
        
        bombsList = []
        
        for(var i = 0;i<5;i++){
            createBomb()
        }
        
        itemList = []
        
        createAssets('chip',1,5)
        /*var itemName = 'gomita'
        
        for(var i = 0; i < 5;i++){
            var item = sceneGroup.create(-100,0,'atlas.chilimbalam',itemName + (i + 1))
            item.anchor.setTo(0.5,0.5)
            item.tag = 'candy'
            itemList[itemList.length] = item
            item.points = 1
        }
        
        var itemNames = ['chip','peanut','takis','pina']
        var points = [3,1,1,2]
        
        
        for(var i = 0; i < itemNames.length;i++){
            var item = sceneGroup.create(-100,0,'atlas.chilimbalam',itemNames[i])
            item.anchor.setTo(0.5,0.5)
            item.tag = 'candy'
            itemList[itemList.length] = item
            item.points = points[i]
        }*/
        
    }

    function create(){
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        
        sceneGroup = game.add.group()
        
        var background = sceneGroup.create(0,0,'fondo')
        background.width = game.world.width
        background.height = game.world.height * 1.02
        
        loadSounds()
        initialize()            
        
        objectsGroup = game.add.group()
        sceneGroup.add(objectsGroup)
        
        characterGroup = game.add.group()
        characterGroup.x = game.world.centerX
        characterGroup.y = background.height * 0.768
        sceneGroup.add(characterGroup)
        
        buddy = game.add.spine(0,0, "mascot");
        buddy.scale.setTo(1,1)
        characterGroup.add(buddy)
        
        var cup = characterGroup.create(0,-120,'atlas.chilimbalam','vaso')
        cup.alpha = 0
        cup.anchor.setTo(0.5,0.5)
        //cup.scale.setTo(0.7,0.7)
        characterGroup.cup = cup
        
        buddy.setAnimationByName(0, "IDLE", true);
        buddy.setSkinByName('normal');
        
        //createTime()
        
        var topRect = new Phaser.Graphics(game)
        topRect.beginFill(0xffffff);
        topRect.drawRect(0, 0, game.world.width, 60);
        topRect.endFill();
        topRect.anchor.setTo(0,0)
        sceneGroup.add(topRect)
        
        createPointsBar()
        createHearts()
        createControls()
        createParticles()
        createObjects()
        animateScene()
    }
    
	return {
		assets: assets,
		name: "chilimbalam",
		create: create,
        preload: preload,
        update: update,
	}
}()