var mainGame = function(){
    
    var localizationData = {
		"EN":{
            "language":"en",
			"assetReady":"readyEn",
			"assetGo":"goEn",
			"assetExcellent":"excEn",
            "assetGiveUp":"giveUpEn"
		},

		"ES":{
            "languague":"es",
			"assetReady":"readyEs",
			"assetGo":"goEs",
			"assetExcellent":"excEs",
            "assetGiveUp":"giveUpEs",
            
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.zombie",
                json: "images/zombie/atlas.json",
                image: "images/zombie/atlas.png",
            },
        ],
        images: [
            {   name:"dashboard",
				file: "images/zombie/dashboard.png"},
		],
		sounds: [
            {	name: "pop",
				file: "sounds/magic.mp3"},
            {	name: "splash",
				file: "sounds/splashMud.mp3"},
            {	name: "swipe",
				file: "sounds/swipe.mp3"},
            {	name: "wrong",
				file: "sounds/wrong.mp3"},
			{	name: "explode",
				file: "sounds/explode.mp3"},
            {	name: "shoot",
				file: "sounds/shoot.mp3"},
            {	name: "explosion",
				file: "sounds/explosion.mp3"},
            {	name: "grunt",
				file: "sounds/grunt.mp3"},
            {	name: "flesh",
				file: "sounds/flesh.mp3"},
            {	name: "zombieUp",
				file: "sounds/zombieUp.mp3"},
            {	name: "gameLose",
				file: "sounds/gameLose.mp3"},
            {	name: "powerUp",
				file: "sounds/powerup.mp3"},
		],
	}
    
    var SPEED = 5
    var G_SPEED = 3
    var GRAVITY_OBJECTS = 4
    var GRAVITY_GUMS = 4
    var OBJ_TIME = 1300
    var ITEM_TIME = 800
    var objectsList
    
    var zombieSong
    var itemsList
    var bulletSpeed
    var explosionGroup
    var objectsGroup
    var bulletsGroup
    var usedObjects
    var gameSpeed
    var pivotTiles
    var addPowerUp
	var sceneGroup = null
    var gameActive = true
    var moveLeft, moveRight
    var characterGroup = null
    var pointsBar = null
    var throwTime = null
    var lives = null
    var heartsGroup = null
    var leftKey = null
    var rightKey = null
    var buddy = null
    var buttonPressed = null
    var tooMuch
    var zombieSoldier
    

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){
        
        itemsList = ['escombros','trash']
        pivotTiles = game.world.height - sceneGroup.botBar.height
        objectsList = []
        game.stage.backgroundColor = "#ffffff"
        gameActive = true
        moveLeft = false
        moveRight = false
        addPowerUp = true
        lives = 1
        buttonPressed = false
        tooMuch = false
        GRAVITY_OBJECTS = 4
        gameSpeed = G_SPEED
        throwTime = 500
        bulletSpeed = 750
        
	}
    

    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)        
        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        gameActive = true
        //timer.start()
        //game.time.events.add(throwTime *0.5, dropObjects , this);
        //objectsGroup.timer.start()

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
        
        game.plugins.add(Fabrique.Plugins.Spine);
        game.stage.disableVisibilityChange = true;

        game.load.spine('punisher', "images/spines/punisher/skeleton.json");
        game.load.spritesheet('zombie', 'images/zombie/zombie.png', 98, 110, 13);
        game.load.spritesheet('zombieS', 'images/zombie/zombiesoldier.png', 66, 118, 17);
        
        game.load.audio('song', 'sounds/weLoveElectricCars.mp3');
        
    }
    
    function inputButton(obj){
        
        if(gameActive == true){
            if(obj.tag == 'left'){
                moveLeft = true
                moveRight = false
                //characterGroup.scale.x = -1
            }else{
                moveLeft = false
                moveRight = true
                characterGroup.scale.x = 1
            }
            buddy.setAnimationByName(0, "ACTION", 0.8);
        }
    }
    
    function releaseButton(obj){
        
        if(gameActive == true){
            if(obj.tag =='left'){
                moveLeft = false
            }else{
                moveRight = false
            }
            buddy.setAnimationByName(0, "ACTION", 0.8);
        }
    }
    
    function createControls(){
        
        var spaceButtons = 220
        
        var bottomRect = sceneGroup.create(0,game.world.height,'dashboard')
        bottomRect.anchor.setTo(0,1)
        bottomRect.width = game.world.width
        sceneGroup.add(bottomRect)
        sceneGroup.botBar = bottomRect
        
        var button1 = sceneGroup.create(game.world.centerX - spaceButtons, game.world.height - 175, 'atlas.zombie','boton')
        button1.inputEnabled = true
        button1.events.onInputDown.add(inputButton)
        button1.tag = 'left'
        button1.events.onInputUp.add(releaseButton)
        
        var button2 = sceneGroup.create(game.world.centerX + spaceButtons, button1.y, 'atlas.zombie','boton')
        button2.scale.x = -1
        button2.inputEnabled = true
        button2.events.onInputDown.add(inputButton)
        button2.tag = 'right'
        button2.events.onInputUp.add(releaseButton)
        
    }
    
    function moveChRight(){
        characterGroup.x+=SPEED;
        if (characterGroup.x>=game.world.width - 100){
            characterGroup.x = game.world.width - 100
        }
    }
    
    function moveChLeft(){
        characterGroup.x-=SPEED;
        if (characterGroup.x<=100){
            characterGroup.x = 100
        }
    }
    
    function stopGame(win){
        
        game.add.tween(bulletsGroup).to({alpha:0},250, Phaser.Easing.Cubic.In,true)
        
        gameActive = false
        
        zombieSong.stop()
        
        sound.play("gameLose")
        createPart('drop',characterGroup)
        
        sound.play("grunt")
        buddy.setAnimationByName(0,"DEAD",false)
        //timer.pause()
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number)

			sceneloader.show("result")
		})
    }
    
    function createTextPart(text,obj){
        
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, text, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y - 60
        sceneGroup.add(pointsText)
                
        pointsText.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
        
        game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)
        
    }
    
    function addPoint(){
        
        //gameSpeed+=0.2
        sound.play("pop")
        //createPart('star', characterGroup.cup)
        //createTextPart('+1', characterGroup.cup)
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        GRAVITY_OBJECTS+=0.2
        //throwTime-=17
        //throwTimeItems-=10
        
        if(pointsBar.number == 7){
            itemsList[itemsList.length] = 'hole1'
            itemsList[itemsList.length] = 'hole2'
        }else if(pointsBar.number == 12){
            itemsList[itemsList.length] = 'zombie'
        }else if(pointsBar.number == 25){
            itemsList[itemsList.length] = 'zombieS'
        }
        
        if(pointsBar.number > 25){
            //gameSpeed+=0.1
        }
        
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
        obj.x = -200
        obj.alpha = 1
        usedObjects.remove(obj)
        obj.used = false
        objectsGroup.add(obj)
    }
    
    
    function checkPosPlayer(obj1,obj2){
        
        if(Math.abs(obj1.x - obj2.world.x) < obj2.width * 0.5 && Math.abs(obj1.y - obj2.world.y)< obj2.height * 0.5){
            return true
        }else{
            return false
        }
    }
    
    function powerUp(){
        
        sound.play("powerUp")
        
        bulletSpeed = 250
        game.time.events.add(4000,function(){
            bulletSpeed = 750
        },this)
    }
    
    function checkObjs(){
        
        for(var i = 0; i< usedObjects.length; i ++){
            
            var obj = usedObjects.children[i]
            
            if(obj.isBullet){
                obj.y+= 5
            }
            
            if(obj.enemy == true){
                if(checkPosPlayer(characterGroup,obj)){
                    missPoint()
                    if(obj.tag == 'shoot2'){
                        deactivateObject(obj)
                    }
                    
                }
            }else if(obj.power == true){
                if(checkPosPlayer(characterGroup,obj)){
                    powerUp()
                    createPart('star',obj)
                    deactivateObject(obj)
                }
            }
            
            if(obj.world.y > game.world.height * 1.2){
                deactivateObject(obj)
                //console.log('removed object')
            }
        }
        
    }
    
    function deactivateBullet(bullet){
        
        bullet.used = false
        bullet.x = -200
    }
    
    function setExplosion(obj,offsetY){
        
        var offY = offsetY || 0
        console.log(explosionGroup.length + ' length')
        for(var i = 0;i<explosionGroup.length;i++){
            var exp = explosionGroup.children[i]
            
            if(exp.used == false){
                
                exp.used = true
                exp.x = obj.world.x
                exp.y = obj.world.y + offY
                
                exp.scale.setTo(1.2,1.2)
                game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
                game.add.tween(exp).to({y:exp.y + 130},800,Phaser.Easing.linear,true)
                var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
                
                tweenAlpha.onComplete.add(function(){
                    exp.used = false
                    exp.x = -200
                    exp.alpha = 1
                })
                break
            }
        }
    }
    
    function zombieLoseLife(obj){
         obj.alpha = 0.5
         game.time.events.add(200,function(){
             obj.alpha = 1
         },this)

    }
    
    function collideBullet(bullet){
        for(var counter = 0;counter< usedObjects.length;counter ++){
            var obj = usedObjects.children[counter]

            if (obj.used == true){
                if(checkPosPlayer(bullet,obj)){
                    if(obj.tag == 'zombie' || obj.tag == 'escombros' || obj.tag == 'trash' || obj.tag == 'zombieS'){
                        deactivateBullet(bullet)
                        obj.lives--
                        
                        if(obj.tag == 'zombie' || obj.tag == 'zombieS'){
                            createPart('drop',obj)  
                            sound.play("flesh")
                            sound.play("zombieUp")
                        }else{
                            sound.play("explosion")
                        }
                        
                        if(obj.lives<= 0){
                            createPart('smoke',obj)
                            deactivateObject(obj)
                            addPoint()
                            createTextPart('+1',obj)
                            setExplosion(obj)
                        }else{
                            zombieLoseLife(obj)
                            //game.add.tween(obj).to({alpha: 1}, 100, Phaser.Easing.Cubic.In, true,100)
                        }
                        
                    }
                }

            }
        }
    }
    
    function checkBullets(){
        
        for(var i = 0; i< bulletsGroup.length; i ++){
            
            var bullet = bulletsGroup.children[i]
            
            if(bullet.used){
                bullet.y -= 5    
                
                if(bullet.y < bullet.height){
                    deactivateBullet(bullet)
                }
                
                collideBullet(bullet)
            }
            
        }
        
    }
    
    function update(){
        
        if(gameActive == false){
            return
        }
        
        usedObjects.y+=gameSpeed
        
        if(moveRight == true){
            moveChRight()
            
        }else if(moveLeft == true){
            moveChLeft()
        }else if (leftKey.isDown){
            if(buttonPressed == false){
                buddy.setAnimationByName(0, "ACTION", 0.8);
            }
            buttonPressed = true 
            moveChLeft()
            //characterGroup.scale.x = -1
        }else if(rightKey.isDown){
            if(buttonPressed == false){
                buddy.setAnimationByName(0, "ACTION", 0.8);
            }
            buttonPressed = true
            moveChRight()
            characterGroup.scale.x = 1
        } else if(leftKey.isUp && rightKey.isUp){
            if(buttonPressed == true){
                buddy.setAnimationByName(0, "ACTION", 0.8);
            }
            buttonPressed = false
        }
        
        checkObjs()
        checkBullets()
    }
    
    function createTime(){
        
        timeGroup = game.add.group()
        timeGroup.x = game.world.right
        timeGroup.y = 0
        sceneGroup.add(timeGroup)
        
        var timeImg = timeGroup.create(0,0,'atlas.zombie','time')
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
        
        var pointsImg = pointsBar.create(0,10,'atlas.zombie','xpcoins')
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

        group.create(0,0,'atlas.zombie','life_box')

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
    
    function createPart(key,obj){
        
        var particlesNumber = 2
        
        tooMuch = true
        //console.log('fps ' + game.time.fps)
        if (game.time.fps < 45 && tooMuch == false){
            tooMuch = true
        }
        
        var posX = obj.x
        var posY = obj.y - 35

        if(obj.world != null){
            posX = obj.world.x
            posY = obj.world.y
        }
        
        if(game.device.desktop == true && tooMuch == false){ 
            
            particlesNumber = 4
            
            var particlesGood = game.add.emitter(0, 0, 100);

            particlesGood.makeParticles('atlas.zombie',key);
            particlesGood.minParticleSpeed.setTo(-400, -50);
            particlesGood.maxParticleSpeed.setTo(400, -100);
            particlesGood.minParticleScale = 0.2;
            particlesGood.maxParticleScale = 0.4;
            particlesGood.gravity = 300;
            particlesGood.angularDrag = 30;
            
            particlesGood.x = posX;
            particlesGood.y = posY;
            particlesGood.start(true, 1000, null, particlesNumber);

            game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
            sceneGroup.add(particlesGood)

            return particlesGood
        }else{
            key+='Part'
            var particle = sceneGroup.create(posX,posY,'atlas.zombie',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle).to({y:particle.y + 50},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
        }
        
    }
    
    function createParticles(){
        
        particlesGroup = game.add.group()
    }
    
    function createAsset(tag,scale,number){
        
        for (var i = 0;i<number;i++){
            
            var asset
            
            if(tag == 'zombie'){
                
                asset = game.add.sprite(-100, -200, 'zombie');
                objectsGroup.add(asset)
                asset.animations.add('walk');
                asset.animations.play('walk',12,true);
                asset.lives = 2
                
            }else if (tag == 'zombieS'){
                asset = game.add.sprite(-100, -200, 'zombieS');
                objectsGroup.add(asset)
                asset.animations.add('walk');
                asset.animations.play('walk',24,true);
                asset.lives = 3
            }else{
                asset = objectsGroup.create(-100,-300,'atlas.zombie',tag)
                asset.lives = 1
                
            }
            
            asset.anchor.setTo(0.5,0.5)
            asset.used = false
            asset.tag = tag

            if(tag == 'tile'){
                asset.width = game.world.width
                asset.anchor.setTo(0,1)
            }
        }
        
    }
    
    function checkPosObj(posX,posY){
        
        var samePos = false
        for(var i = 0;i<usedObjects.length;i++){
            var obj = usedObjects.children[i]
            if(Math.abs(obj.x - posX) < 75 && Math.abs(obj.y - posY) < 50){
                samePos = true
            }
        }
        return samePos
        
    }
    
    function getPos(posY){
        
        var posX = game.rnd.integerInRange(150, game.world.width - 150)
        
        var checkPosition = true
        while (checkPosObj(posX,posY)){
            posX = game.rnd.integerInRange(100, game.world.width - 100)
            //if(posX < 75){ posX = 75}
            if(gameActive == false){ break}
        }
        return posX
    }
    
    function checkPower(asset){
        
        var tag = 'shoot1_item'
                
        var posX = getPos(asset.y)
        
        
        for(var i = 0; i<objectsGroup.length;i++){
            var item = objectsGroup.children[i]
            
            if(!item.used && item.tag == tag){
                
                usedObjects.add(item)
                
                item.x = posX
                item.y = asset.y
                item.used = true
                item.power = true
                
                break
            }
        }
        
    }
    
    function zombieShoot(zombie){
        
        if(zombie.used == false || !gameActive){
            return
        }
        
        sound.play("shoot")
        
        for(var i = 0; i<objectsGroup.length;i++){
            var item = objectsGroup.children[i]
            
            if(!item.used && item.tag == 'shoot2'){
                
                usedObjects.add(item)
                
                item.x = zombie.x
                item.y = zombie.y + 25
                item.scale.setTo(2,2)
                item.used = true
                item.enemy = true
                
                item.isBullet = true
                
                //console.log('disparo zombie ' + item.x + ' posX ' + item.y + ' posY')
                
                break
            }
        }
        
        setExplosion(zombie,35)
        
        game.time.events.add(1000,function(){
            zombieShoot(zombie)
        },this)
        
        
    }
    
    function checkAdd(asset){
        
        //var itemsList = ['escombros','hole1','hole2','zombie','trash']
        Phaser.ArrayUtils.shuffle(itemsList)
        
        var offsetX = 150
        
        var posX = getPos(asset.y)
        
        
        for(var i = 0; i<objectsGroup.length;i++){
            var item = objectsGroup.children[i]
            
            if(!item.used && item.tag == itemsList[0]){
                
                usedObjects.add(item)
                
                item.x = posX
                item.y = asset.y
                item.used = true
                item.enemy = true
                
                if(item.tag == 'zombie'){
                    item.lives = 2
                }else if(item.tag == 'zombieS'){
                    item.lives = 3
                    game.time.events.add(1000,function(){
                        zombieShoot(item)
                    },this)
                }
                
                break
            }
        }
        
    }
    
    function addAsset(tag,add){
        
        var addItem = add || false
        //console.log(objectsGroup.length + ' objects number')
        for(var i = 0;i<objectsGroup.length;i++){
            var asset = objectsGroup.children[i]
            //console.log(asset.tag + ' tag, ' + tag + ' tag')
            if(asset.used == false && asset.tag == tag){
                asset.used = true
                
                objectsGroup.remove(asset)
                usedObjects.add(asset)
                
                asset.x = 0
                asset.y = pivotTiles
                
                //console.log(pointsBar.number + ' number points')
                
                if(addItem == false){
                    checkAdd(asset)
                    if(pointsBar.number >=5){
                        checkAdd(asset)
                    }
                    if(pointsBar.number >= 25){
                        checkAdd(asset)
                    }
                    if(pointsBar.number >= 35){
                        checkAdd(asset)
                    }
                }
                
                if(addPowerUp){
                    checkPower(asset)
                    addPowerUp = false
                    game.time.events.add(20000,function(){
                        addPowerUp = true
                    },this)
                }
                
                //console.log(pivotTiles + ' pivotObject,' +  asset.y + ' yPos')
                
                pivotTiles -= asset.height
                
                break
            }
            
            /*if(i == objectsGroup.length - 1 ){
                console.log('no objects')
            }*/
        }
        
        
    }
    
    function addObstacle(){
        
        addAsset('tile')
        
        //console.log('added ')
        
        game.time.events.add(throwTime,addObstacle,this)
        
    }
    
    function createBullets(number){
        
        for(var i = 0; i< number;i++){
            
            var bullet = bulletsGroup.create(-100,0,'atlas.zombie','shoot1')
            bullet.used = false
            bullet.tag ='1'
            bullet.anchor.setTo(0.5,0.5)
        }
        
    }
    
    function shootBullets(){
        
        if(gameActive == false){
            return
        }
        
        characterGroup.fire.alpha = 1
        
        game.add.tween(characterGroup.fire).to({alpha:0},100, Phaser.Easing.Cubic.Out,true,100)
        game.add.tween(characterGroup.fire.scale).from({x:0.1, y:0.1},200, Phaser.Easing.Cubic.Out,true)
        
        for(var i = 0;i<bulletsGroup.length;i++){
            var bullet = bulletsGroup.children[i]
            if(bullet.used == false ){
                
                bullet.used = true
                bullet.x = characterGroup.x + 16
                bullet.y = characterGroup.y - 60
                
                break
            }
        }
        
        sound.play("shoot")
        
        game.time.events.add(bulletSpeed, shootBullets,this)
        
    }
    
    function createExplosions(number){
        
        explosionGroup = game.add.group()
        sceneGroup.add(explosionGroup)
        
        for(var i = 0; i< number;i++){
            var explosion = explosionGroup.create(-100,-100,'atlas.zombie','explosion')
            explosion.anchor.setTo(0.5,0.5)
            explosion.used = false
            
        }
    }
    
    function createObjects(){
        
        createAsset('tile',1,8)
        createAsset('escombros',1,6)
        createAsset('shoot2',1,12)
        createAsset('hole1',1,4)
        createAsset('zombie',1,4)
        createAsset('zombieS',1,4)
        createAsset('hole2',1,6)
        createAsset('trash',1,6)
        createAsset('shoot1_item',1,2)
                
        createBullets(20)
        
        for(var i = 0;i<8;i++){
            addAsset('tile',true)
        }
        
        addObstacle()
        shootBullets()
        
    }
    
	return {
		assets: assets,
		name: "mainGame",
		create: function(event){
            
            leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            
			sceneGroup = game.add.group()
            
            loadSounds()           
            
            objectsGroup = game.add.group()
            sceneGroup.add(objectsGroup)
            
            usedObjects = game.add.group()
            usedObjects.y = game.world.height * 0.5
            sceneGroup.add(usedObjects)
            
            createExplosions(20)
            
            bulletsGroup = game.add.group()
            sceneGroup.add(bulletsGroup)
            
            characterGroup = game.add.group()
            characterGroup.x = game.world.centerX
            characterGroup.y = game.world.height * 0.768
            sceneGroup.add(characterGroup)
            
            var fire = characterGroup.create(13,-110,'atlas.zombie','fire')
            fire.anchor.setTo(0.5,0.5)
            fire.alpha = 0
            characterGroup.fire = fire
            
            
            buddy = game.add.spine(0,0, "punisher");
            characterGroup.add(buddy)
            
            buddy.setAnimationByName(0, "ACTION", true);
            buddy.setSkinByName('normal');
            
            createControls()
            initialize() 
            
            createPointsBar()
            createHearts()
            createObjects()
            
            //createParticles()
            
            zombieSong = game.add.audio('song')
            game.sound.setDecodedCallback(zombieSong, function(){
                zombieSong.loopFull(0.6)
            }, this);
            
            animateScene()
            
		},
        preload:preload,
        update,update,
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()