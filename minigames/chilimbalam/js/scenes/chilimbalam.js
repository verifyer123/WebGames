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
    
    var gameIndex = 9
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
    
    function getSkins(){
        
        /*var dataStore = [
            
            [
                {"tableID":"idGlasses"},
                {"id":"style1","name":"style 80´s","img":"lentes_defautl.png","price":"0","choice":false,"buy":true},
                {"id":"style2","name":"style 90´s","img":"lentes_80s.png","price":"10","choice":true,"buy":false},{"id":"style3","name":"Sunglass","img":"black_glass.png","price":"10","choice":false,"buy":false},
                {"id":"style4","name":"3D Glass","img":"lentes_3d.png","price":0,"choice":true,"buy":false}
            ],
            
            [
                {"tableID":"idHair"},
                {"id":"hairStyle1","name":"Estilo Elvis","img":"hair_style1.png","price":"10","choice":true,"buy":false},
                {"id":"hairStyle2","name":"Estilo punk","img":"hair_style2.png","price":0,"choice":false,"buy":true},
                {"id":"hairStyle3","name":"Estilo emo","img":"hair_style3.png","price":"10","choice":false,"buy":false},
                {"id":"hairStyle4","name":"Estilo smith","img":"hair_style4.png","price":"10","choice":false,"buy":false}
            ],
            
            [
                {"tableID":"idColorBody"},
                {"name":"Morado","color":"0deg","img":"crayon_morado.png","price":"0","choice":true,"buy":false},
                {"name":"Rojo","color":"75deg","img":"crayon_rojo.png","price":"10","choice":false,"buy":false},
                {"name":"Azul","color":"300deg","img":"crayon_azul.png","price":0,"choice":false,"buy":true},
                {"name":"Verde","color":"200deg","img":"crayon_verde.png","price":"10","choice":false,"buy":false}
            ]
            
        ]*/
        
        var dataStore = amazing.getProfile()
        
        if(!dataStore){
            skinTable = [1,1,1,1]
        }else{
         
            skinTable = dataStore
        }
        
        //console.log(skinTable + ' skins')
        
    }
    
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
        
        game.stage.disableVisibilityChange = false;
        game.load.spine('mascot', "images/spines/skeleton.json");
        
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
        
        var spaceButtons = 220
        
        var bottomRect = new Phaser.Graphics(game)
        bottomRect.beginFill(0xffffff);
        bottomRect.drawRect(0, game.world.height, game.world.width, -game.world.height * 0.175);
        bottomRect.endFill();
        bottomRect.anchor.setTo(0,1)
        sceneGroup.add(bottomRect)
        sceneGroup.bottomRect = bottomRect
        
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
        
        buddy.setAnimationByName(0,"LOSE",0.6)
        
        marioSong.stop()
        //timer.pause()
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
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
                createAssets('gomita' + (i + 1),1,3)
            }
            
        }else if(pointsBar.number == 20){
            createAssets('peanut',1,5)
        }else if(pointsBar.number == 25){
            createAssets('pina',2,5)
            createAssets('skwinkle',1,3)
            createAssets('mango',2,5)
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
                    addPoint(obj.points)
                }else{
                    createPart('wrong',characterGroup.cup)
                    missPoint()
                }
            }else if(obj.y > game.world.height - sceneGroup.bottomRect.height * 1.2){
                deactivateObject(obj)
                if(obj.tag == 'candy'){
                    //missPoint()
                    createPart('drop',obj)
                    //sound.play("splash")
                }else if(obj.tag == 'obstacle'){
                    createPart('smoke',obj)
                    sound.play("bomb")
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
        var bomb = sceneGroup.create(-100,0,'atlas.chilimbalam','bomb')
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
            var item = objectsGroup.create(-100,0,'atlas.chilimbalam',tag)
            item.anchor.setTo(0.5,0.5)
            item.tag = 'candy'
            item.points = points
            item.id = tag
        }
        
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
                particle = particlesGroup.create(-200,0,'atlas.chilimbalam',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
    
    function createObjects(){
        
        bombsList = []
        
        for(var i = 0;i<7;i++){
            createBomb()
        }
        
        createAssets('chip',1,7)
        
        particlesGroup = game.add.group()
        sceneGroup.add(particlesGroup)
        
        particlesUsed = game.add.group()
        sceneGroup.add(particlesUsed)
        
        createParticles('star',5)
        createParticles('drop',5)
        createParticles('smoke',8)
        createParticles('wrong',1)
        createParticles('text',8)
                
    }

    function create(){
        
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        
        sceneGroup = game.add.group()
        
        var background = sceneGroup.create(-2,-2,'fondo')
        background.width = game.world.width+2
        background.height = game.world.height+2
        
        loadSounds()
        initialize()  
        
        objectsGroup = game.add.group()
        sceneGroup.add(objectsGroup)
        
        usedObjects = game.add.group()
        sceneGroup.add(usedObjects)
        
        characterGroup = game.add.group()
        characterGroup.x = game.world.centerX
        characterGroup.y = background.height * 0.768
        sceneGroup.add(characterGroup)
        
        buddy = game.add.spine(0,0, "mascot");
        buddy.scale.setTo(0.6,0.6)
        characterGroup.add(buddy)
        
        var cup = characterGroup.create(0,-120,'atlas.chilimbalam','vaso')
        cup.alpha = 0
        cup.anchor.setTo(0.5,0.5)
        //cup.scale.setTo(0.7,0.7)
        characterGroup.cup = cup
        
        buddy.setAnimationByName(0, "IDLE", true);
        buddy.setSkinByName('skin1');
        //buddy.setSkin(newSkin)
        
        buddy.setToSetupPose()
        
        /*var skin = buddy.skeleton.data.findSkin('normal')
        
        for (var key in skin.attachments) {
            
            var slotKeyPair = key.split(':');
            var slotIndex = slotKeyPair[0];
            var attachmentName = slotKeyPair[1];
            var attachment = skin.attachments[key];

            /*if (undefined === slotIndex || undefined === attachmentName) {
                console.warn('something went wrong with reading the attachments index and/or name');
                return;
            }
            if (newSkin.getAttachment(slotIndex, attachmentName) !== undefined) {
                console.warn('Found double attachment for: ' + skinName + '. Skipping');
                //continue;
            }
            newSkin.addAttachment(slotIndex, attachmentName, attachment);
            //buddy.skeleton.setAttachment("cabeza","vaso")
        }
        
        //buddy.skeleton.setAttachment("cabeza")
        
        var mySlot = buddy.skeleton.findSlot("cabeza")
        
        mySlot.setAttachment("vaso")
        
        buddy.setToSetupPose()*/
        
        getSkins()
        var newSkin = buddy.createCombinedSkin(
            'combined',     
            'glasses' + skinTable[0],        
            'hair' +  skinTable[1],
            'skin' + skinTable[2],
            'torso' + skinTable[3],
            'vaso'
        );
        
        
        
        buddy.setSkinByName('combined')
                
        marioSong = game.add.audio('arcadeSong')
        game.sound.setDecodedCallback(marioSong, function(){
            marioSong.loopFull(0.3)
        }, this);
        
        var topRect = new Phaser.Graphics(game)
        topRect.beginFill(0xffffff);
        topRect.drawRect(0, 0, game.world.width, 60);
        topRect.endFill();
        topRect.anchor.setTo(0,0)
        sceneGroup.add(topRect)
        
        createPointsBar()
        createHearts()
        createControls()
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