var clownrush = function(){
    
    var localizationData = {
		"EN":{

		},

		"ES":{

            
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.clown",
                json: "images/clown/atlas.json",
                image: "images/clown/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/clown/fondo.png"},
		],
		sounds: [
            {	name: "punch1",
				file: "sounds/punch1.mp3"},
            {	name: "punch2",
				file: "sounds/punch2.mp3"},
            {	name: "punch3",
				file: "sounds/punch3.mp3"},
            {	name: "explode",
				file: "sounds/explode.mp3"},
            {	name: "cut",
				file: "sounds/cut.mp3"},
            {	name: "magic",
				file: "sounds/magic.mp3"},
		],
	}
        
    var SPEED = 7
    var OFFSET_PZ = 72 * 1.5
    var OBJ_TIME = 1300
    var ITEM_TIME = 800
    
    var canAnvil = null
    var gameSong = null
    var levelNumber = 0
    var gameSpeed = null
    var timeBar = null
    var buttonPressed
    var spikesGroup
    var lastObj
    var pressed
	var sceneGroup = null
    var answersGroup = null
    var gameActive = true
    var pointsBar = null
    var throwTime = null
    var lives = null
    var heartsGroup = null
    var obstaclesGroup = null
    var buddy = null    

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = true
        canAnvil = false
        lives = 1
        buttonPressed = false
        lastObj = null
        pressed =[]
        pressed.right = 0
        pressed.left = 0
        pressed.middle = 0
        gameSpeed = 5
        loadSounds()
        levelNumber = 1
        
	}
    

    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)

		
        gameActive = true
        
        sceneGroup.alpha = 0
        
        var sceneTween = game.add.tween(sceneGroup).to({alpha:1},500,Phaser.Easing.linear,true)
        
        sceneTween.onComplete.add(function(){
            setLevel(levelNumber)
        })
        
        
        
        //timer.start()
        //game.time.events.add(throwTime *0.1, dropObjects , this);
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
    
    function createPart(key,obj,offX, offY,much){
        
        var offsetX = offX || 0
        var offsetY = offY || 0
        
        var particlesNumber = 2
        
        tooMuch = much || true
        //console.log('fps ' + game.time.fps)
        
        var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            
            posX = obj.world.x
            posY = obj.world.y
        }
        
        if( tooMuch == false){ 
            
        
        }else{
            key+='Part'
            var particle = sceneGroup.create(posX,posY - offsetY,'atlas.clown',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
        }
        
    }
    
    function setExplosion(obj,offsetY){
        
        var offY = offsetY || 0

        var exp = sceneGroup.create(0,0,'atlas.clown','explosion')
        exp.x = obj.x
        exp.y = obj.y + offY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(4,4)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.clown','smoke');
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = obj.x;
        particlesGood.y = obj.y + offsetY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
    
    function stopGame(){
        
        gameSong.stop()
        //objectsGroup.timer.pause()
        gameActive = false
        //buddy.setAnimationByName(0,"HIT_COCONUT",false)
        
        lives--
        heartsGroup.text.setText(lives)
        
        setExplosion(characterGroup,-100)
        
        sound.play("explode")
        
        
        var scale = 1
        if(characterGroup.isLeft){scale = -1}
        
        
        game.add.tween(characterGroup).to({x:game.world.centerX},300,Phaser.Easing.linear,true)
        game.add.tween(characterGroup.scale).to({x:3 * scale,y:3},300,Phaser.Easing.linear,true)
        
        game.add.tween(characterGroup).to({y:characterGroup.y + 200},1000,Phaser.Easing.linear,true,500)
        //timer.pause()
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true,pointsBar.number)

			sceneloader.show("result")
		})
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(10,10,'atlas.clown','xpcoins')
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.9
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

        var heartsImg = group.create(0,0,'atlas.clown','life_box')
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
    
    function addNumberPart(obj,number,isScore){
        
        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)
        
        var offsetY = -100
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        if(isScore){
            
            var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
            tweenScale.onComplete.add(function(){
                game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
            })
            
            offsetY = 100
        }
        
        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        
    }
    
    function addLevel(){
        
        levelNumber++
        setLevel(levelNumber)
        gameSpeed+=1.25
        
    }
    
    function addPoint(){
        
        sound.play("magic")
        
        addNumberPart(pointsBar.text,'+1',true)
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        if(pointsBar.number % 10 == 0){
            addLevel()
        }
        
        if(pointsBar.number == 10){
            canAnvil = true
        }
        
    }
    
    function moveKong(tag){
        
        if(!gameActive){
            return
        }
        
        sound.play("cut")
        //buddy.setAnimationByName(0,"FIST")
        //buddy.addAnimationByName(0,"IDLE",true)
        
        if(characterGroup.isLeft){
            characterGroup.isLeft = false
            characterGroup.scale.x = 1
            if(characterGroup.x<game.world.centerX){
                game.add.tween(characterGroup).to({x:game.world.centerX + 110},100,Phaser.Easing.linear,true)
            }
        }else{
            characterGroup.isLeft = true
            characterGroup.scale.x = -1
            if(characterGroup.x>game.world.centerX){
                game.add.tween(characterGroup).to({x:game.world.centerX - 110},100,Phaser.Easing.linear,true)
            }
        }
        
    }
    
    function inputButton(obj){
        
        moveKong(obj.tag)
        
        changeImage(1,obj.parent)
    }
    
    function releaseButton(obj){
        changeImage(0,obj.parent)
    }
    
    function createControls(){
            
        var bottomRect = sceneGroup.create(0,game.world.height,'atlas.clown','dashboard')
        bottomRect.anchor.setTo(0,1)
        bottomRect.width = game.world.width
        sceneGroup.add(bottomRect)
        sceneGroup.botBar = bottomRect
        
        var buttons1 = game.add.group()
        buttons1.x = game.world.centerX 
        buttons1.y = game.world.height - 85
        buttons1.scale.setTo(0.85,0.85)
        sceneGroup.add(buttons1)
        
        var button1 = buttons1.create(0,0, 'atlas.clown','buttonOff')
        button1.anchor.setTo(0.5,0.5)
        button1.inputEnabled = true
        button1.events.onInputDown.add(inputButton)
        button1.events.onInputUp.add(releaseButton)
        
        var button1 = buttons1.create(0,0, 'atlas.clown','buttonPush')
        button1.anchor.setTo(0.5,0.5)
        
        changeImage(0,buttons1)
        
    }
    
    function getTag(list){
        
        Phaser.ArrayUtils.shuffle(list)
        return list[0]
    }
    
    function randomize(index){
        var isTrue = false
        
        if(Math.random()*index < 1){
            isTrue = true
        }
                
        return isTrue
    }
    
    function addItem(piece,tagToUse){
        
        var tag = tagToUse || getTag(['obstacle','choco','muffin','obstacle','obstacle'])
        
        if(lastObj.spike == true){
            tag = getTag(['choco','muffin'])
        }
        
        for(var i = 0; i< piecesGroup.length; i ++){
            
            var item = piecesGroup.children[i]
            
            if(item != null ){
                if(tag == item.tag && !item.used){
                    
                    item.used = true
                    
                    piecesGroup.remove(item)
                    obstaclesGroup.add(item)
                    
                    item.x = 0
                    item.y = obstaclesGroup.pivotY
                    
                    //console.log(item.y + ' posy')
                    item.alpha = 1

                    var angle = 90
                    var offsetX = item.height * 0.5 + piece.width * 0.5

                    if(randomize(2)){
                        offsetX*=-1
                        angle*=-1
                    }

                    item.x+= offsetX
                    item.angle = angle
                    
                    if(item.tag == 'obstacle'){
                        piece.spike = true
                    }
                    
                    if(item.tag == 'anvil'){
                        item.anvil = true
                        item.angle = 0
                    }else{
                        item.anvil = false
                    }

                    break
                }
            }
        }
        
        checkAnvil(piece)
    }
    
    
    function checkAnvil(piece){
        
        if(canAnvil){
            
            canAnvil = false
            game.time.events.add(7000, function(){
                canAnvil = true
            } , this);
            
        }
        
    }
    
    function addObstacle(tag,checkObs){
        
        tag = 'bar'               
        
        //console.log(piecesGroup.length + ' numObjects')
        for(var i = 0;i<piecesGroup.length;i++){
            var piece = piecesGroup.children[i]
            
            if(!piece.used && piece.tag ==  tag){
                
                piece.used = true
                
                piecesGroup.remove(piece)
                obstaclesGroup.add(piece)
                
                piece.x = 0
                piece.y = obstaclesGroup.pivotY
                piece.alpha = 1
                
                if(lastObj){
                    obstaclesGroup.pivotY-= piece.height
                
                }
                
                //console.log('posY ' + obstaclesGroup.pivotY)
                
                
                
                if(randomize(1.2) && checkObs){
                    addItem(piece)
                }
                
                lastObj = piece
                break
                
            }
        }
        
        if(checkObs){
            /*game.time.events.add(500, function(){
                addObstacle('bar',true)
            } , this);*/
        }
        
        
    }
    
    function createPiece(tag,number,left){
        
        var isLeft = left || true
        
        for(var i = 0; i < number; i++){
            
            var asset
            if(tag == 'bar'){
                asset = piecesGroup.create(0,0,'atlas.clown',tag)
                asset.anchor.setTo(0.5,0.5)
            }else{
                
                asset = piecesGroup.create(0,0,'atlas.clown',tag)
                asset.anchor.setTo(0.5,0.5)
                
            }
            
            asset.x =-100
            asset.y = -200
            asset.alpha = 0
            asset.tag = tag
            asset.scale.setTo(1.2,1.2)
            asset.used = false
            
        }

    }
    
    function createAssets(){
        
        createPiece('bar',20)
        createPiece('obstacle',10)
        createPiece('choco',10)
        createPiece('muffin',10)
        createPiece('anvil',4)
        //createPiece('obstacleHit',10,true)
        //createPiece('obstacle',10)
        
        for(var i = 0;i<8;i++){
            addObstacle('bar',false)
        }
        
    }
    
    function deactivateObject(obs){
        
        obstaclesGroup.remove(obs)
        piecesGroup.add(obs)

        obs.alpha = 0
        obs.y = -100
        obs.used = false
        obs.spike = false
                    
    }
    
    
    function checkPosPlayer(obj1,obj2, distValue){
        
        var distance = distValue || 0.5
        
        if(Math.abs(obj1.world.x - obj2.world.x) < obj2.width * 1 && Math.abs(obj1.world.y - obj2.world.y)< obj2.height * 0.5){
            return true
        }else{
            return false
        }
    }
    
    function checkObstacles(){
        
        for(var i = 0;i<obstaclesGroup.length;i++){
            
            var obs = obstaclesGroup.children[i]
            
            if(obs.anvil && obs.used){
                obs.y+=5
            }
            
            if(obs){
                if(obs.world.y > game.world.height){
                    
                    deactivateObject(obs)
                    //addObstacle()
                    
                    if(obs.tag == 'bar'){
                        addObstacle('bar',true)
                    }

                }else if(checkPosPlayer(characterGroup.clown,obs)){
                    
                    if(obs.tag == 'obstacle'){
                        stopGame()
                    }else if(obs.tag == 'choco' || obs.tag == 'muffin'){
                        addPoint()
                        createPart('star',obs)
                        deactivateObject(obs)
                        addNumberPart(obs,'+1',false)
                    }
                    
                    
                    
                }
            }
            
            
            
        }
    }
    
    function update(){
        
        if(!gameActive){
            return
        }
        
        obstaclesGroup.y += gameSpeed
        
        checkObstacles()
        
        
    }
    
    function preload(){
        
        game.plugins.add(Fabrique.Plugins.Spine);
        game.stage.disableVisibilityChange = true;

        game.load.spine('clown', "images/spines/Clown Rush.json");
        
        game.load.audio('timberMan', 'sounds/timberMan.mp3');
        
        
    }
    
    function setLevel(number){
    
        var text = sceneGroup.levelText
        
        text.y = game.world.centerY - 200
        
        text.setText('Nivel ' + number)
        
        var addTween = game.add.tween(text).to({y:game.world.centerY - 150,alpha:1},500,Phaser.Easing.linear,true)
        addTween.onComplete.add(function(){
            game.add.tween(text).to({y:game.world.centerY - 200,alpha:0},250,Phaser.Easing.linear,true,500)
        })
    }
    
    function createLevelText(){
        
        var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var levelText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        levelText.x = game.world.centerX
        levelText.y = game.world.centerY - 150
        levelText.anchor.setTo(0.5,0.5)
        sceneGroup.add(levelText)
        
        levelText.alpha = 0
        
        sceneGroup.levelText = levelText
        
        levelText.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
        
    }
    
	return {
		assets: assets,
        preload: preload,
        update:update,
		name: "clownrush",
		create: function(event){

            
			sceneGroup = game.add.group()
            
            var background = sceneGroup.create(0,0,'fondo')
            background.width = game.world.width
            background.height = game.world.height
            
            piecesGroup = game.add.group()
            sceneGroup.add(piecesGroup)
            
            obstaclesGroup = game.add.group()
            obstaclesGroup.x = game.world.centerX
            obstaclesGroup.y = game.world.height
            obstaclesGroup.startY = obstaclesGroup.y
            obstaclesGroup.pivotY = 0
            sceneGroup.add(obstaclesGroup)
            
            characterGroup = game.add.group()
            characterGroup.x = game.world.centerX + 110
            characterGroup.y = background.height - 330
            sceneGroup.add(characterGroup)
            
            buddy = game.add.spine(0,0, "clown");
            buddy.scale.setTo(1,1)
            buddy.setAnimationByName(0, "RUN", true);
            buddy.angle = -90
            buddy.x-=65
            buddy.scale.y = -1
            buddy.setSkinByName('normal');
            characterGroup.anim = buddy
            characterGroup.add(buddy)
            
            var clown = characterGroup.create(0,0,'atlas.clown','clown')
            clown.anchor.setTo(0.5,0.5)
            clown.alpha = 0
            clown.scale.y = -1
            clown.angle = -90
            characterGroup.clown = clown
            
            initialize()
            animateScene()
            
            gameSong = game.add.audio('timberMan')
            game.sound.setDecodedCallback(gameSong, function(){
                //gameSong.loopFull(0.5)
            }, this);
            
            createHearts()
            createPointsBar()
            createControls()
                        
            createAssets()
            
            createLevelText()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()