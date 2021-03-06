var soundsPath = "../../shared/minigames/sounds/"
var clownrush = function(){    

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
            {	name: "explode",
				file: soundsPath + "explode.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "falling",
				file: soundsPath + "falling.mp3"},
            {	name: "powerup",
				file: soundsPath + "powerup.mp3"},
            {	name: "glassbreak",
				file: soundsPath + "glassbreak.mp3"},
            {	name: "scream",
				file: soundsPath + "scream.mp3"},
            {	name: "shoot",
				file: soundsPath + "shoot.mp3"},
            {	name: "evilLaugh",
				file: soundsPath + "evilLaugh.mp3"},
            {	name: "turn",
				file: soundsPath + "moleHit.mp3"},
		],
	}
        
    var SPEED = 7
    var OFFSET_PZ = 72 * 1.5
    var OBJ_TIME = 1300
    var ITEM_TIME = 800
    
    var gameIndex = 3
    var gameId = 5649050225344512

    var canRoll = null
    var canAnvil = null
    var canClown = null
    var gameSong = null
    var cakeReady = null;
    var levelNumber = 0
    var gameSpeed = null
    var timeBar = null
    var spaceKey
    var spaceDown
    var downKey
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
    var particlesGroup, particlesUsed

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        gameActive = true
        canAnvil = false
        canClown = false
        canRoll = true
        lives = 1
        buttonPressed = false
        lastObj = null
        cakeReady = false
        spaceDown = false
        pressed =[]
        pressed.right = 0
        pressed.left = 0
        pressed.middle = 0
        gameSpeed = 6
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
        
        var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
        
        var exp = sceneGroup.create(0,0,'atlas.clown','cakeSplat')
        exp.x = posX
        exp.y = posY + offY
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

        particlesGood.x = posX;
        particlesGood.y = posY + offsetY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
    
    function stopGame(){
        
		if(amazing.getMinigameId()){
			gameSong.pause()
		}else{
			gameSong.stop()
		}
        
        //objectsGroup.timer.pause()
        gameActive = false
        buddy.setAnimationByName(0,"LOSE",false)
        
        lives--
        heartsGroup.text.setText(lives)
        
        sound.play("scream")
        
        setExplosion(characterGroup,-100)
        
        sound.play("explode")
        
        
        var scale = 1
        if(characterGroup.isLeft){scale = -1}
        
        buddy.angle = 0
        buddy.scale.y = 1
        game.add.tween(characterGroup).to({x:game.world.centerX, y:game.world.centerY - 50},300,Phaser.Easing.linear,true)
        var scaleTween = game.add.tween(characterGroup.scale).to({x:3 * scale,y:3},300,Phaser.Easing.linear,true)
        
        scaleTween.onComplete.add(function(){
            
            sound.play("glassbreak")
            
            var offsetX = 150
            if(!characterGroup.isLeft){offsetX*=-1}
            
            game.add.tween(characterGroup).to({y:game.world.centerY + 200},2000,Phaser.Easing.linear,true,200)
            var glass = sceneGroup.create(game.world.centerX + offsetX, game.world.centerY - 150,'atlas.clown','brokenglass')
            glass.scale.setTo(2.5,2.5)
            glass.anchor.setTo(0.5,0.5)
            
            sceneGroup.alpha = 0
            game.add.tween(sceneGroup).to({alpha : 1},250,Phaser.Easing.linear,true,0)
            
        })
        
        //timer.pause()
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2000)
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
        
        var pointsText = lookParticle('textPart')
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y
            pointsText.anchor.setTo(0.5,0.5)
            pointsText.setText(number)
            pointsText.scale.setTo(1,1)

            var offsetY = -100

            pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
            
            deactivateParticle(pointsText,800)
            if(isScore){
                
                pointsText.scale.setTo(0.7,0.7)
                var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
                tweenScale.onComplete.add(function(){
                    game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
                })

                offsetY = 100
            }
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
        
        if(pointsBar.number == 15){
            canClown = true
        }
        
        if(pointsBar.number == 20){
            cakeReady = true
        }
        
    }
    
    function roll(){
        
        if(!canRoll || !gameActive){
            return
        }
        
        sceneGroup.rollBtn.alpha = 0.4
        
        canRoll = false
        sound.play("turn")
        characterGroup.roll = true
        
        var rotationVal = 360
        
        //console.log(rotationVal + ' rotation')
        
        buddy.x+= 75
        var rotationTween = game.add.tween(buddy).to({angle:buddy.angle - (rotationVal * 2)},700,Phaser.Easing.linear,true)
        
        rotationTween.onComplete.add(function(){
            
            characterGroup.roll = false
            buddy.x-=75
        })
        
        game.time.events.add(5000,function(){
            canRoll = true
            sceneGroup.rollBtn.alpha = 1
        },this)
        
    }
    
    function moveKong(tag){
        
        if(!gameActive){
            return
        }
        
        sound.play("cut")
        /*buddy.setAnimationByName(0,"ROLL",false)
        buddy.addAnimationByName(0,"RUN",true)*/
        
        //roll()
        
        if(characterGroup.isLeft){
            characterGroup.isLeft = false
            characterGroup.scale.x = 1
            if(characterGroup.x<game.world.centerX){
                game.add.tween(characterGroup).to({x:game.world.centerX + 110},75,Phaser.Easing.linear,true)
            }
        }else{
            characterGroup.isLeft = true
            characterGroup.scale.x = -1
            if(characterGroup.x>game.world.centerX){
                game.add.tween(characterGroup).to({x:game.world.centerX - 110},75,Phaser.Easing.linear,true)
            }
        }
        
    }
    
    function moveClown(clown){
        
        game.time.events.add((6 * 1000)/gameSpeed,function(){
            
            sound.play("cut")
        
            if(clown.isLeft){
                clown.scale.x = Math.abs(clown.scale.x) * -1
                game.add.tween(clown).to({x:clown.offset},75,Phaser.Easing.linear,true)
                game.add.tween(clown.scale).to({y:-1.2},75,Phaser.Easing.linear,true)
        
            }else{
                clown.scale.x = Math.abs(clown.scale.x)
                game.add.tween(clown).to({x:-clown.offset},75,Phaser.Easing.linear,true)
                game.add.tween(clown.scale).to({y:-1.2},75,Phaser.Easing.linear,true)
            }
        })
       
    }
    
    function inputButton(obj){
        
        var tag = obj.tag
        
        if(tag == 'move'){
            moveKong(obj.tag)
        }else if(tag == 'roll'){
            roll()
        }
        
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
        buttons1.x = game.world.centerX + 90
        buttons1.y = game.world.height - 110
        buttons1.scale.setTo(0.95,0.95)
        sceneGroup.add(buttons1)
        
        var button1 = buttons1.create(0,0, 'atlas.clown','buttonOff')
        button1.anchor.setTo(0.5,0.5)
        button1.inputEnabled = true
        button1.tag = "move"
        button1.events.onInputDown.add(inputButton)
        button1.events.onInputUp.add(releaseButton)
        
        var button1 = buttons1.create(0,0, 'atlas.clown','buttonPush')
        button1.anchor.setTo(0.5,0.5)
        
        changeImage(0,buttons1)
        
        var buttons1 = game.add.group()
        buttons1.x = game.world.centerX -90
        buttons1.y = game.world.height - 110
        //buttons1.scale.setTo(0.6,0.6)
        sceneGroup.add(buttons1)
        
        var button1 = buttons1.create(0,0, 'atlas.clown','giroOff')
        button1.anchor.setTo(0.5,0.5)
        button1.tag = "roll"
        button1.inputEnabled = true
        button1.events.onInputDown.add(inputButton)
        button1.events.onInputUp.add(releaseButton)
        
        sceneGroup.rollBtn = buttons1
        
        var button1 = buttons1.create(0,0, 'atlas.clown','giroOn')
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
        
        var tag = tagToUse || getTag(['obstacle','choco','muffin','obstacle','obstacle','badclown'])
        
        if(lastObj.spike == true){
            tag = getTag(['choco','muffin'])
        }
        
        if(cakeReady){
            tag = 'cake'
            cakeReady = false
            game.time.events.add(12000,function() {
                cakeReady = true
            },this)
        }
        
        //tag = 'badclown'
        if(pointsBar.number < 20 && tag == 'badclown'){
            
            tag = getTag(['choco','muffin'])
            
        }
        
        if(tag == 'badclown'){
            canClown = false
            game.time.events.add(5000,function(){
                canClown = true
            },this)
        }
        
        /*tag = 'badclown'
        gameSpeed = 10*/
        
        for(var i = 0; i< piecesGroup.length; i ++){
            
            var item = piecesGroup.children[i]
            
            if(item != null ){
                if(tag == item.tag && !item.used){
                    
                    var left = randomize(2)
                    //var left = true
                    
                    item.scale.setTo(1.2,1.2)
                    
                    activateObject(item)
                    
                    item.x = 0
                    item.y = obstaclesGroup.pivotY

                    var angle = 90
                    var offsetX = item.height * 0.5 + piece.width * 0.5
                    
                     if(item.tag == 'badclown'){
                        
                        offsetX-=45
                        item.clown = true
                        
                        if(left){
                            item.scale.setTo(-1.2,1.2)
                            item.isLeft = true
                        }else{
                            item.scale.setTo(1.2,1,2)
                            item.isLeft = false
                        }
                        
                        item.offset = offsetX
                        sound.play('evilLaugh')
                         
                        if(randomize(4)){
                            moveClown(item)
                        }
                         
                    }

                    if(left){
                        offsetX*=-1
                        angle*=-1
                    }
                    
                    //console.log(item.width + 'width')
                    
                    item.x+= offsetX
                    item.angle = angle
                    
                    if(item.tag == 'obstacle'){
                        piece.spike = true
                    }

                    break
                }
            }
        }
        
        checkAnvil(piece)
    }
    
    function activateObject(item){
        
        item.used = true
        item.alpha = 1         
        piecesGroup.remove(item)
        obstaclesGroup.add(item)
        
    }
    
    function addAnvil(piece){
        
        var tag = 'anvil'
        
        sound.play("falling")
        //console.log('adde anvil')
        
        for(var i = 0; i < piecesGroup.length;i++){
            var obj = piecesGroup.children[i]
            
            if(obj.tag == tag && obj.used == false){
                
                activateObject(obj)
                
                var offsetX = 150
                if(randomize(2)){offsetX*=-1}
                
                obj.anvil = true
                obj.x = offsetX
                obj.y = obstaclesGroup.pivotY
                
                break
            }
        }
    }
    
    function checkAnvil(piece){
        
        if(canAnvil){
            canAnvil = false
            addAnvil(piece)
            game.time.events.add(8000, function(){
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
                
            }else if (tag == 'badclown'){
                
                asset = game.add.sprite(0,0, 'bMonster');
                piecesGroup.add(asset)
                asset.animations.add('walk');
                asset.animations.play('walk',24,true);   
            
            }else{
                
                asset = piecesGroup.create(0,0,'atlas.clown',tag)
                
            }
            
            asset.anchor.setTo(0.5,0.5)
            asset.x =-100
            asset.y = -200
            asset.alpha = 0
            asset.tag = tag
            asset.scale.setTo(1.2,1.2)
            asset.used = false
            
        }

    }
    
    function createTextPart(text,obj){
        
        var pointsText = lookParticle('textPart')
        
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
            
            var scaleToUse = 2
            if(key == 'smokePart'){scaleToUse = 2.5}
            game.add.tween(particle).to({alpha:0, y:particle.y+50},300,Phaser.Easing.Cubic.In,true)
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
                particle = particlesGroup.create(-200,0,'atlas.clown',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
    
    function createAssets(){
        
        createPiece('bar',20)
        createPiece('obstacle',10)
        createPiece('choco',10)
        createPiece('muffin',10)
        createPiece('anvil',4)
        createPiece('cake',4)
        createPiece('badclown',1)
        //createPiece('obstacleHit',10,true)
        //createPiece('obstacle',10)
        
        particlesGroup = game.add.group()
        sceneGroup.add(particlesGroup)
        
        particlesUsed = game.add.group()
        sceneGroup.add(particlesUsed)
        
        createParticles('star',8)
        createParticles('text',8)
        createParticles('smoke',8)
        
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
        
        //console.log(obj1.world.x + ' posX, ' + obj1.world.y + ' posY,' + obj2.world.x + ' obj2X,' + obj2.world.y + ' obj2Y')
        var distance = distValue || 0.5
        
        if(Math.abs(obj1.world.x - obj2.world.x) < Math.abs(obj2.width) * 1 && Math.abs(obj1.world.y - obj2.world.y)< Math.abs(obj2.height) * 0.5){
            return true
        }else{
            return false
        }
    }
    
    function changeColorBubble(){
        var delay = 0
        var timeDelay = 250
        
        for(var counter = 0; counter < 30;counter++){
            game.time.events.add(delay, function(){
                
                var color = Phaser.Color.getRandomColor(0,255,255)
                characterGroup.bubble.tint = color
                
            } , this);
            delay+=timeDelay
        }    
    }
    
    function activatePowerUp(){
        
        sound.play("powerup")
        
        game.add.tween(characterGroup.bubble).to({alpha:1},250,Phaser.Easing.linear,true)
        characterGroup.invincible = true
        
        changeColorBubble()
        game.time.events.add(4000,function() {
            
            var tweenAdd = game.add.tween(characterGroup.bubble).to({alpha:0},250,Phaser.Easing.linear,true, 0,5)
            tweenAdd.onComplete.add(function() {
                
                characterGroup.invincible = false
            
            })
            
        },this)
        
    }
    
    function checkObstacles(){
        
        for(var i = 0;i<obstaclesGroup.length;i++){
            
            var obs = obstaclesGroup.children[i]
            
            if(obs.anvil && obs.used){
                obs.y+=(gameSpeed + 3)
            }else if(obs.clown && obs.used){
                obs.y+=(gameSpeed)
            }
            
            if(obs){
                if(obs.world.y > game.world.height){
                    
                    deactivateObject(obs)
                    //addObstacle()
                    
                    if(obs.tag == 'bar'){
                        addObstacle('bar',true)
                    }

                }else if(checkPosPlayer(characterGroup.clown,obs)){
                    
                    var tag = obs.tag
                    if(tag == 'obstacle' || tag == 'anvil' || tag == 'badclown'){
                        
                        if(!characterGroup.invincible && !characterGroup.roll){
                            stopGame()
                        }else{
                            
                            if(!characterGroup.roll){
                                createPart('smoke',obs)
                                sound.play("shoot")
                                deactivateObject(obs)
                            }
                            
                        }
                        
                    }else if(tag == 'choco' || tag == 'muffin'){
                        addPoint()
                        createPart('star',obs)
                        deactivateObject(obs)
                        addNumberPart(obs,'+1',false)
                    }else if(tag == 'cake'){
                        addPoint()
                        createPart('star',obs)
                        deactivateObject(obs)
                        activatePowerUp()
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
        
        if(spaceKey.isDown && !spaceDown){
            spaceDown = true
            moveKong()
        }
        
        if(spaceKey.isUp){
            spaceDown = false
        }
        
        if(downKey.isDown && !characterGroup.roll){
            roll()
        }
        
    }
    
    function preload(){
        
        game.plugins.add(Fabrique.Plugins.Spine);
        game.stage.disableVisibilityChange = false;

        game.load.spine('clown', "images/spines/Clown Rush.json");
        
        game.load.spritesheet('bMonster', 'images/clown/badclown.png', 173, 181, 16);
        		
		if(amazing.getMinigameId()){
			gameSong = sound.setSong(soundsPath + 'songs/circus_gentlejammers.mp3',0.3)
		}else{
			game.load.audio('circus', soundsPath + 'songs/circus_gentlejammers.mp3');
		}
		
        
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
            
            var background = sceneGroup.create(-2,-2,'fondo')
            background.width = game.world.width+2
            background.height = game.world.height+2
            
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
            
            var bubble = characterGroup.create(-15,-5,'atlas.clown','bubble')
            bubble.tint = 0xff001e
            bubble.anchor.setTo(0.5,0.5)
            bubble.scale.setTo(1.5,1.5)
            bubble.alpha = 0
            characterGroup.bubble = bubble
            
            characterGroup.roll = false
            
            initialize()
            animateScene()
            
			if(!amazing.getMinigameId()){
				gameSong = game.add.audio('circus')
				game.sound.setDecodedCallback(gameSong, function(){
					gameSong.loopFull(0.3)
				}, this);
			}
            
            game.onPause.add(function(){
				
				if(amazing.getMinigameId()){
					gameSong.pause()
				}
				
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
				
				if(amazing.getMinigameId()){
					if(lives>0){
						gameSong.play()
					}
				}
				
                game.sound.mute = false
            }, this);
            
            createHearts()
            createPointsBar()
            createControls()
                        
            createAssets()
            
            createLevelText()
            
            spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()