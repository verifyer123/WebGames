var zombiecrush = function(){
    
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
			{	name: "explode",
				file: "sounds/explode.mp3"},
            {	name: "shoot",
				file: "sounds/shoot.mp3"},
            {	name: "laser",
				file: "sounds/laser2.mp3"},
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
            {	name: "evilLaugh",
				file: "sounds/evilLaugh.mp3"},
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
    var addSkull
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
        
        addSkull = true
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
        bulletSpeed = 700
        
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
        game.load.spritesheet('fireSkull', 'images/zombie/skullFire.png', 179 / 2, 235/2, 9);
        
        game.load.audio('song', 'sounds/weLoveElectricCars.mp3');
        
    }
    
    function inputButton(obj){
        
        var parent = obj.parent
        
        changeImage(1,parent)
        
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
        
        var parent = obj.parent
        
        changeImage(0,parent)
        
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
        
        var buttons1 = game.add.group()
        buttons1.x = game.world.centerX - spaceButtons
        buttons1.y = game.world.height - 175
        sceneGroup.add(buttons1)
        
        var button1 = buttons1.create(0,0, 'atlas.zombie','boton1')
        button1.inputEnabled = true
        button1.events.onInputDown.add(inputButton)
        button1.tag = 'left'
        button1.events.onInputUp.add(releaseButton)
        
        var button1 = buttons1.create(0,0, 'atlas.zombie','boton2')
        
        var buttons2 = game.add.group()
        buttons2.x = game.world.centerX + spaceButtons
        buttons2.y = buttons1.y
        buttons2.scale.x = -1
        sceneGroup.add(buttons2)
        
        var button2 = buttons2.create(0,0, 'atlas.zombie','boton1')
        button2.inputEnabled = true
        button2.events.onInputDown.add(inputButton)
        button2.tag = 'right'
        button2.events.onInputUp.add(releaseButton)
        
        var button1 = buttons2.create(0,0, 'atlas.zombie','boton2')
        
        changeImage(0,buttons1)
        changeImage(0,buttons2)
        
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
        
        sound.play("pop")
        
        addNumberPart(pointsBar.text,'+1')
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        if(pointsBar.number == 7){
            itemsList[itemsList.length] = 'hole1'
            itemsList[itemsList.length] = 'hole2'
        }else if(pointsBar.number == 12){
            itemsList[itemsList.length] = 'zombie'
        }else if(pointsBar.number == 20){
            itemsList[itemsList.length] = 'zombieS'
        }
        
    }
    
    function missPoint(){
        
        sound.play("flesh")
        
        if(lives>0){
            lives--;
        }
        
        heartsGroup.text.setText('X ' + lives)
        
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
    
    
    function checkPosPlayer(obj1,obj2, distValue){
        
        var distance = distValue || 0.5
        
        if(Math.abs(obj1.x - obj2.world.x) < obj2.width * distance && Math.abs(obj1.y - obj2.world.y)< obj2.height * distance){
            return true
        }else{
            return false
        }
    }
    
    function setPowerTimer(timer){
        
        if(sceneGroup.timer.alpha ==0){
            sceneGroup.timer.alpha = 1
        } 
        
        sceneGroup.timer.setText(timer)
        
        if(timer<=0){
            game.add.tween(sceneGroup.timer).to({alpha:0},400,Phaser.Easing.linear,true)
            return
        }
        
        timer--
        
        game.time.events.add(1000,function(){
            setPowerTimer(timer)
        },this)
    }
    
    function activatePowerUp(obj){
        
        sound.play("powerUp")
        
        var tag = obj.tag
        var timeAdd = 5000
        if(obj.tag == 'shoot2_item'){
            timeAdd = 6000
        }
        
        setPowerTimer(timeAdd/1000)
        
        if(tag == 'shoot1_item'){
            
            changeImage(0,sceneGroup.icons)
            
            bulletSpeed = 250
            game.time.events.add(timeAdd,function(){
                bulletSpeed = 750
                changeImage(-1,sceneGroup.icons)
            },this)
            
        }else if(tag == 'shoot2_item'){
            
            changeImage(1,sceneGroup.icons)
            
            game.add.tween(characterGroup.bubble).to({alpha:1},200,Phaser.Easing.linear,true,0,5)
            characterGroup.invincible = true
            game.time.events.add(timeAdd - 1000,function(){
                var tweenAlpha = game.add.tween(characterGroup.bubble).to({alpha:0},200,Phaser.Easing.linear,true,0,5)
                tweenAlpha.onComplete.add(function(){
                    characterGroup.invincible = false
                    characterGroup.bubble.alpha = 0
                    changeImage(-1,sceneGroup.icons)
                })
            },this)
            
        }
    }
    
    function checkObjs(){
        
        for(var i = 0; i< usedObjects.length; i ++){
            
            var obj = usedObjects.children[i]
            
            if(obj.isBullet){
                obj.y+= 5
            }
            
            if(obj.enemy == true){
                if(checkPosPlayer(characterGroup,obj)){
                    if(characterGroup.invincible == true){
                        destroyAsset(obj,true)
                    }else if (characterGroup.y > (obj.world.y + 15)){
                        //console.log(characterGroup.y + ' pos Player, ' + (obj.world.y + 20) + ' pos obj')
                        missPoint()
                        if(obj.tag == 'shoot2'){
                            deactivateObject(obj)
                        }
                    }
                    
                }
            }else if(obj.power == true){
                if(checkPosPlayer(characterGroup,obj,0.7)){
                    activatePowerUp(obj)
                    createPart('star',obj,-50)
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
    
    function destroyAsset(obj,add){
        
        var ignore = add || false
        createPart('smoke',obj)
        deactivateObject(obj)
        
        if(ignore == false){
            addPoint()
            createTextPart('+1',obj)
        }
        
        setExplosion(obj)
        
        if(obj.tag != 'zombie' && obj.tag != 'zombieS'){
            sound.play("explosion")
        }else{
            sound.play("zombieUp")
        }
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
                        }
                        
                        if(obj.lives<= 0){
                            destroyAsset(obj)
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
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(10,10,'atlas.zombie','xpcoins')
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.87
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

        var heartsImg = group.create(0,0,'atlas.zombie','life_box')
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
    
     function updateSeconds(){
        
        timeGroup.number += 1;
        timeGroup.textI.setText(timeGroup.number / 100)
        
    }
    
    function createPart(key,obj,offY){
        
        var particlesNumber = 2
        
        tooMuch = true
        //console.log('fps ' + game.time.fps)
        if (game.time.fps < 45 && tooMuch == false){
            tooMuch = true
        }
        
        var offsetY = offY || 50
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
            game.add.tween(particle).to({y:particle.y + offsetY},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
        }
        
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
            }else if(tag == 'fireSkull'){
                asset = game.add.sprite(-100, -200, 'fireSkull');
                objectsGroup.add(asset)
                asset.animations.add('walk');
                asset.animations.play('walk',12,true);
                asset.scale.setTo(2,2)
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
        
        var tags = ['shoot1_item','shoot2_item']
        Phaser.ArrayUtils.shuffle(tags)
                
        var posX = getPos(asset.y)
        
        
        for(var i = 0; i<objectsGroup.length;i++){
            var item = objectsGroup.children[i]
            
            if(!item.used && item.tag == tags[0]){
                
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
        
        sound.play("laser")
        
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
    
    function addFireSkull(asset){
        
        sound.play("evilLaugh")
        for(var i = 0;i<objectsGroup.length;i++){
            var item = objectsGroup.children[i]
            if(item.used == false && item.tag == 'fireSkull'){
                
                item.used = true
                
                objectsGroup.remove(item)
                usedObjects.add(item)
                
                item.x = characterGroup.x
                item.y = asset.y
                item.used = true
                item.enemy = true
                
                item.isBullet = true
                
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
                        
                        if(addSkull == true){
                            
                            addFireSkull(asset)
                            addSkull = false
                            
                            game.time.events.add(10000,function(){
                                addSkull = true
                            },this)
                        }
                        
                    }
                    if(pointsBar.number >= 25){
                        checkAdd(asset)
                    }
                    if(pointsBar.number >= 35){
                        checkAdd(asset)
                    }
                    
                    if(addPowerUp && pointsBar.number>=10){
                        checkPower(asset)
                        addPowerUp = false
                        game.time.events.add(15000,function(){
                            addPowerUp = true
                        },this)
                    }
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
        createAsset('shoot2_item',1,2)
        createAsset('fireSkull',1,2)
                
        createBullets(20)
        
        for(var i = 0;i<8;i++){
            addAsset('tile',true)
        }
        
        addObstacle()
        shootBullets()
        
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
    
    function createIcons(){
        
        var iconNames = ['fastIcon','protectionIcon']
        
        var iconsGroup = game.add.group()
        iconsGroup.x = 170
        iconsGroup.y = 28
        sceneGroup.add(iconsGroup)
        
        sceneGroup.icons = iconsGroup
        
        for(var i = 0; i<2;i++){
            var icon = iconsGroup.create(0,0,'atlas.zombie',iconNames[i])
            icon.anchor.setTo(0.5,0.5)
            icon.alpha = 0
        }
        
        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, 0, fontStyle)
        pointsText.y = -100
        pointsText.anchor.setTo(0.5,0.5)
        characterGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
        pointsText.alpha = 0
        sceneGroup.timer = pointsText
    }
    
	return {
		assets: assets,
		name: "zombiecrush",
		create: function(event){
            
            leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            
			sceneGroup = game.add.group()
            
            loadSounds()           
            
            objectsGroup = game.add.group()
            sceneGroup.add(objectsGroup)
            
            usedObjects = game.add.group()
            usedObjects.y = game.world.height * 0.2
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
            
            var bubble = characterGroup.create(0,-46,'atlas.zombie','bubble')
            bubble.anchor.setTo(0.5,0.5)
            bubble.alpha = 0
            characterGroup.bubble = bubble
            
            buddy.setAnimationByName(0, "ACTION", true);
            buddy.setSkinByName('normal');
            
            createControls()
            initialize() 
            
            createPointsBar()
            createHearts()
            createObjects()
            
            createIcons()
            
            
            

            
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