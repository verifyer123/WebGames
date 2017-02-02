var soundsPath = "../../shared/minigames/sounds/"
var junglefury = function(){
    
    var localizationData = {
		"EN":{

		},

		"ES":{

            
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.jungle",
                json: "images/jungle/atlas.json",
                image: "images/jungle/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/jungle/fondo.png"},
		],
		sounds: [
            {	name: "punch1",
				file: soundsPath + "punch1.mp3"},
            {	name: "punch2",
				file: soundsPath + "punch2.mp3"},
            {	name: "punch3",
				file: soundsPath + "punch3.mp3"},
            {	name: "explode",
				file: soundsPath + "explode.mp3"},
		],
	}
        
    var SPEED = 7
    var GRAVITY_OBJECTS = 4
    var GRAVITY_GUMS = 4
    var OFFSET_PZ = 72 * 1.5
    var OBJ_TIME = 1300
    var ITEM_TIME = 800
    
    var gameIndex = 8
    var gameSong = null
    var levelNumber = 0
    var scaleSpeed = null
    var timeBar = null
    var buttonPressed
    var lastObj
    var pressed
	var sceneGroup = null
    var answersGroup = null
    var gameActive = true
    var pointsBar = null
    var throwTime = null
    var lives = null
    var heartsGroup = null
    var treeGroup = null
    var leftKey = null
    var rightKey = null
    var buddy = null    

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = true
        lives = 1
        buttonPressed = false
        lastObj = null
        pressed =[]
        pressed.right = 0
        pressed.left = 0
        pressed.middle = 0
        scaleSpeed = 0.0023
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
            var particle = sceneGroup.create(posX,posY - offsetY,'atlas.jungle',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
        }
        
    }
    
    function setExplosion(obj,offsetY){
        
        var offY = offsetY || 0

        var exp = sceneGroup.create(0,0,'atlas.jungle','explosion')
        exp.x = obj.x
        exp.y = obj.y + offY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(4,4)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.jungle','smoke');
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
        buddy.setAnimationByName(0,"HIT_COCONUT",false)
        
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
			resultScreen.setScore(true,pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(10,10,'atlas.jungle','xpcoins')
    
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

        var heartsImg = group.create(0,0,'atlas.jungle','life_box')
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
    
    function checkPieces(piece,isLeft){
        if(!isLeft && piece.tag == 'obstacle'){
            stopGame()
        }else if(isLeft && piece.tag == 'obstacleLeft'){
            stopGame()
        }
    }
    
    function checkTree(){
        
        var isLeft = characterGroup.isLeft
        var piece = treeGroup.children[0]
        var pieceTo = treeGroup.children[1]
        
        //console.log(piece.tag + ' tag,' +  isLeft + ' is Left')
        
        checkPieces(piece,isLeft)
        checkPieces(pieceTo,isLeft)
    }
    
    function punchTree(){
        
        checkTree()
        
        if(timeBar.scaleBar.scale.x<1){
            timeBar.scaleBar.scale.x+=0.033
        }
        
        //scaleSpeed += 0.000009
        
        sound.play("punch" + game.rnd.integerInRange(1, 3))
        var isLeft = characterGroup.scale.x == -1
        var piece = treeGroup.children[0]
        
        treeGroup.remove(piece)
        piecesGroup.add(piece)
        piece.used = false
        
        createPart('star',characterGroup.impact)
        
        addPoint()
        
        var lastPosY = 610
        
        piece.x = treeGroup.x
        piece.y = lastPosY
        
        //console.log(lastPosY + ' posy')
        
        if(isLeft){
            piece.tween = game.add.tween(piece).to({x : game.world.width + 200, alpha: 0, angle:180 * characterGroup.scale.x},400,Phaser.Easing.linear,true)
            
        }else{
            piece.tween = game.add.tween(piece).to({x : -200, alpha:0,angle:180 * characterGroup.scale.x},400,Phaser.Easing.linear,true)
        }
        
        game.add.tween(treeGroup).to({y:treeGroup.startY + OFFSET_PZ * pointsBar.number},100,Phaser.Easing.linear,true)
        //treeGroup.y+=OFFSET_PZ
        
        characterGroup.impact.scale.setTo(1,1)
        characterGroup.impact.alpha = 0
        game.add.tween(characterGroup.impact).from({alpha : 1},200,Phaser.Easing.linear,true)
        game.add.tween(characterGroup.impact.scale).from({x:1.5,y:1.5},200,Phaser.Easing.linear,true)
        
        changeImage(1,timeBar.scaleBar)
        game.time.events.add(50,function(){
            changeImage(0,timeBar.scaleBar)
        },this)
        
    }
    
    function addLevel(){
        
        levelNumber++
        setLevel(levelNumber)
        scaleSpeed+=0.00005
    }
    
    function addPoint(){
        
        //sound.play("pop")
        
        addNumberPart(pointsBar.text,'+1')
        
        pointsBar.number++
        pointsBar.text.setText(pointsBar.number)
        
        if(pointsBar.number % 15 == 0){
            addLevel()
        }
        
    }
    
    function moveKong(tag){
        
        if(!gameActive){
            return
        }
        
        buddy.setAnimationByName(0,"FIST")
        buddy.addAnimationByName(0,"IDLE",true)
        
        if(tag == 'right'){
            characterGroup.isLeft = false
            characterGroup.scale.x = 1
            if(characterGroup.x<game.world.centerX){
                game.add.tween(characterGroup).to({x:game.world.centerX + 170},100,Phaser.Easing.linear,true)
            }
        }else if(tag == 'left'){
            characterGroup.isLeft = true
            characterGroup.scale.x = -1
            if(characterGroup.x>game.world.centerX){
                game.add.tween(characterGroup).to({x:game.world.centerX - 170},100,Phaser.Easing.linear,true)
            }
        }
        
        addObstacle()
        punchTree()
    }
    
    function inputButton(obj){
        
        moveKong(obj.tag)
        
        changeImage(1,obj.parent)
    }
    
    function releaseButton(obj){
        changeImage(0,obj.parent)
    }
    
    function createControls(){
    
        var spaceButtons = 200
        
        var bottomRect = sceneGroup.create(0,game.world.height,'atlas.jungle','dashboard')
        bottomRect.anchor.setTo(0,1)
        bottomRect.width = game.world.width
        sceneGroup.add(bottomRect)
        sceneGroup.botBar = bottomRect
        
        var buttons1 = game.add.group()
        buttons1.x = game.world.centerX - spaceButtons
        buttons1.y = game.world.height - 175
        sceneGroup.add(buttons1)
        
        var button1 = buttons1.create(0,0, 'atlas.jungle','boton1')
        button1.inputEnabled = true
        button1.events.onInputDown.add(inputButton)
        button1.tag = 'left'
        button1.events.onInputUp.add(releaseButton)
        
        var button1 = buttons1.create(0,0, 'atlas.jungle','boton2')
        
        var buttons2 = game.add.group()
        buttons2.x = game.world.centerX + spaceButtons
        buttons2.y = buttons1.y
        buttons2.scale.x = -1
        sceneGroup.add(buttons2)
        
        var button2 = buttons2.create(0,0, 'atlas.jungle','boton1')
        button2.inputEnabled = true
        button2.events.onInputDown.add(inputButton)
        button2.tag = 'right'
        button2.events.onInputUp.add(releaseButton)
        
        var button1 = buttons2.create(0,0, 'atlas.jungle','boton2')
        
        changeImage(0,buttons1)
        changeImage(0,buttons2)
        
    }
    
    function getTag(list){
        
        Phaser.ArrayUtils.shuffle(list)
        return list[0]
    }
    
    function addObstacle(tag){
                
        var piecesNames = ['log','obstacle','obstacleLeft']
        if(!tag){
            tag = getTag(['log','obstacle','obstacleLeft'])
        }        
        
        if(tag == 'log'){
            pressed.middle++
        }else if(tag == 'obstacle'){
            pressed.right++            
        }else if(tag == 'obstacleLeft'){
            pressed.left++
        }
        
        if(pressed.right >= 3){
            tag = 'log'
            pressed.right = 0
        }else if(pressed.left >= 3){
            tag = 'log'
            pressed.left = 0
        }else if(pressed.middle >=4){
            tag = getTag(['obstacle','obstacleLeft'])
            pressed.middle = 0
        }
        
        if(lastObj != null){
            if(lastObj.tag == 'obstacle' && tag == 'obstacleLeft'){
                tag = getTag(['log'])
            }else if(lastObj.tag == 'obstacleLeft' && tag == 'obstacle'){
                tag = getTag(['log'])
            }
        }
        
        //console.log(pressed.right + ' right,' + pressed.left + ' left,' + pressed.middle + ' middle, ' + tag)
        
        
        for(var i = 0;i<piecesGroup.length;i++){
            var piece = piecesGroup.children[i]
            
            if(!piece.used && piece.tag ==  tag){
                
                if(piece.tween){
                    piece.tween.stop()
                    piece.tween = null
                }
                
                piece.angle = 0
                piece.x = 0
                piece.y = treeGroup.pivotY
                piece.alpha = 1
                treeGroup.pivotY-= OFFSET_PZ
                piece.used = true
                
                /*var addOffset = 0.287
                var offY = -29
                
                if(piece.tag == 'obstacle'){
                    piece.x+= piece.width * addOffset
                    piece.y+=offY
                }else if(piece.tag == 'obstacleLeft'){
                    piece.x-= piece.width * addOffset
                    piece.y+=offY
                }*/
                
                piecesGroup.remove(piece)
                treeGroup.add(piece)
                
                lastObj = piece
                
                break
                
            }
        }
    }
    
    function createPiece(tag,number,left){
        
        var isLeft = left || false
        
        for(var i = 0; i < number; i++){
            
            var asset
            if(tag == 'log'){
                asset = piecesGroup.create(0,0,'atlas.jungle',tag)
                asset.anchor.setTo(0.5,0.5)
            }else{
                asset = game.add.group()
                piecesGroup.add(asset)
                
                var branch = asset.create(125,0,'atlas.jungle','branch')
                branch.anchor.setTo(0.5,0.5)
                
                var log = asset.create(0,0,'atlas.jungle','log')
                log.anchor.setTo(0.5,0.5)
 
                if(tag == 'obstacleLeft'){
                    branch.scale.x = -1
                    branch.x-=250
                }
            }
            
            asset.x =-100
            asset.y = -200
            asset.alpha = 0
            asset.tag = tag
            asset.scale.setTo(1.5,1.5)
            asset.used = false
            
        }

    }
    
    function createAssets(){
        
        createPiece('log',10)
        createPiece('obstacleLeft',10,true)
        createPiece('obstacle',10)
        
        for(var i = 0;i<7;i++){
            addObstacle('log')
        }
        
    }
    
    function update(){
        
        if(!gameActive){
            return
        }
        
        if(!buttonPressed){
            if(leftKey.isDown){
                buttonPressed = true
                moveKong('left')
            }else if(rightKey.isDown){
                moveKong('right')
                buttonPressed = true
            }
        }else{
            if(leftKey.isUp && rightKey.isUp){
                buttonPressed = false
            }
        }
        
        if(timeBar.scaleBar.scale.x > 0){
            timeBar.scaleBar.scale.x-= scaleSpeed
        }else{
            stopGame()
        }
        
        
    }
    
    function preload(){
        
        game.plugins.add(Fabrique.Plugins.Spine);
        game.stage.disableVisibilityChange = false;

        game.load.spine('kong', "images/spines/skeleton.json");
        
        game.load.audio('timberman', soundsPath + 'songs/timberman.mp3');
        
        
    }
    
    function createTimeBar(){
        
        timeBar = game.add.group()
        timeBar.x = game.world.centerX
        timeBar.y = 100
        sceneGroup.add(timeBar)
        
        
        var container = timeBar.create(0,0,'atlas.jungle','timebar')
        container.anchor.setTo(0.5,0.5)
        
        var fillGroup = game.add.group()
        fillGroup.x = -container.width * 0.485
        timeBar.add(fillGroup)
        
        var fillImg1 = fillGroup.create(0,0,'atlas.jungle','timebarFill')
        fillImg1.anchor.setTo(0,0.5)
        
        fillGroup.scale.x = 0.6
        timeBar.scaleBar = fillGroup
        
        var fillImg2 = fillGroup.create(0,0,'atlas.jungle','whiteFill')
        fillImg2.anchor.setTo(0,0.5)
        
        changeImage(0,timeBar.scaleBar)
        
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
		name: "junglefury",
		create: function(event){

            
			sceneGroup = game.add.group()
            
            var background = sceneGroup.create(-2,-2,'fondo')
            background.width = game.world.width+2
            background.height = game.world.height+2
            
            var ground = sceneGroup.create(0,game.world.height - 335,'atlas.jungle','floor')
            ground.width = game.world.width
            
            piecesGroup = game.add.group()
            sceneGroup.add(piecesGroup)
            
            treeGroup = game.add.group()
            treeGroup.x = game.world.centerX
            //treeGroup.scale.setTo(1.3,1.3)
            treeGroup.y = ground.y - 15
            treeGroup.startY = treeGroup.y
            treeGroup.pivotY = 0
            sceneGroup.add(treeGroup)
            
            characterGroup = game.add.group()
            characterGroup.x = game.world.centerX + 200
            characterGroup.y = background.height - 270
            sceneGroup.add(characterGroup)
            
            buddy = game.add.spine(0,0, "kong");
            buddy.scale.setTo(1,1)
            buddy.setAnimationByName(0, "IDLE", true);
            buddy.setSkinByName('normal');
            characterGroup.add(buddy)
            
            var impact = characterGroup.create(-125,-110,'atlas.jungle','impact')
            impact.anchor.setTo(0.5,0.5)
            characterGroup.impact = impact
            impact.alpha = 0
            
            initialize()
            animateScene()
            
            gameSong = game.add.audio('timberman')
            game.sound.setDecodedCallback(gameSong, function(){
                gameSong.loopFull(0.5)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            createHearts()
            createPointsBar()
            createControls()
            
            createTimeBar()
            
            createAssets()
            
            createLevelText()
            
            leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()