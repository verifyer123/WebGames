var soundsPath = "../../shared/minigames/sounds/"
var hexhop = function(){
    
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
                name: "atlas.hexhop",
                json: "images/hexhop/atlas.json",
                image: "images/hexhop/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/hexhop/fondo.png"},
		],
		sounds: [
            {	name: "explode",
				file: soundsPath + "laserexplode.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
		],
	}
        
    var SPEED = 7
    
    var gameIndex = 5
    var gameLevel = null
    var gameSong = null
    var timeAdd = null
    var levelNumber = 0
    var orderList = null
    var moveSpeed
    var lastObj
	var sceneGroup = null
    var answersGroup = null
    var linesGroup = null
    var jumpDistance
    var gameGroup
    var gameSpeed
    var lives
    var gameActive = true
    var pointsBar = null
    var jumpTimes = 0
    var lives = null
    var heartsGroup = null
    var buddy = null    
    var playerGroup

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = true
        lives = 1
        jumpTimes = 0
        jumpDistance = 170
        gameSpeed = 2
        moveSpeed = 2.5
        gameLevel = 1
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
            setLevel(gameLevel)
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
            var particle = sceneGroup.create(posX,posY - offsetY,'atlas.hexhop',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
        }
        
    }
    
    function setExplosion(obj,offsetY){
        
        sound.play("explode")
        var offY = offsetY || 0

        var exp = sceneGroup.create(0,0,'atlas.hexhop','explosion')
        exp.x = obj.world.x
        exp.y = obj.world.y + offY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        starParticles(obj,'smoke')
        
    }
    
    function starParticles(obj,idString){
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.hexhop',idString);
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = obj.world.x;
        particlesGood.y = obj.world.y- 25;
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
        
        gameActive = false
        
        setExplosion(playerGroup.gem)
        playerGroup.alpha = 0
        
        lives--
        heartsGroup.text.setText(lives)
        
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
        
        var pointsImg = pointsBar.create(10,10,'atlas.hexhop','xpcoins')
    
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

        var heartsImg = group.create(0,0,'atlas.hexhop','life_box')
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
    
    function addLevel(){
                
        gameLevel++
        
        setLevel(gameLevel)
        
        //console.log('add Level' + gameLevel)
        
        moveSpeed+=0.15
        gameSpeed+= 0.15
        
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
    
    function addPoint(number){
        
        //sound.play("pop")
        
        addNumberPart(pointsBar.text,'+' + number,true)
        
        pointsBar.number+=  number
        pointsBar.text.setText(pointsBar.number)
        
        if(pointsBar.number % 15 == 0){
            addLevel()
        }
        
    }
    
    function checkPosPlayer(obj1,obj2, distValue){
        
        var distance = distValue || 0.8
        
        if(Math.abs(obj1.world.x - obj2.world.x) < obj2.width * distance && Math.abs(obj1.world.y - obj2.world.y)< obj2.height * distance){
            return true
        }else{
            return false
        }
    }
    
    function activateLine(line){
        
        line.alpha = 1
        line.y = linesGroup.pivotY 
        linesGroup.pivotY+= jumpDistance

        var pivotPoint = game.world.width
        var offset = -1
        for(var i = 0;i<line.obstacles.length;i++){

            var obstacle = line.obstacles.children[i]

            if(i == 0 && obstacle.isLeft){
                pivotPoint = 0
                offset = 1
            }

            obstacle.x = pivotPoint
            obstacle.active = true
            obstacle.alpha = 1

            pivotPoint+= obstacle.width * (Math.random()*2.5 + 1) * offset
            //console.log(obstacle.startPosition + ' start')

        }
    }
    
    function activateLineTime(line,delay){
        
        game.time.events.add(delay, function(){
            activateLine(line)
        })
    }
    
    function checkLine(line){
        
        if(line.children[0].world.y < playerGroup.gem.world.y - jumpDistance * 0.5 && line.active){
            
            activateLine(line)
        }    
        
    }
    
    function movePoints(){
        
        for(var i = 0;i<linesGroup.length;i++){
            var group = linesGroup.children[i]
            
            if(group.active){
                
                for(var u = 0; u < group.obstacles.length;u++){

                    var obstacle = group.obstacles.children[u]

                    if(obstacle.isLeft == true){
                        obstacle.x-= moveSpeed
                        obstacle.angle-=moveSpeed
                    }else{
                        obstacle.x+= moveSpeed
                        obstacle.angle+=moveSpeed
                    }

                    if(checkPosPlayer(playerGroup.gem,obstacle) && !playerGroup.jumping){
                        if(obstacle.tag == 'obstacle'){
                            stopGame()
                        }else{
                            if(obstacle.active){
                                
                                addPoint(2)
                                createPart('star',obstacle)
                                sound.play("magic")
                                addNumberPart(obstacle,'+' + 2,false)
                            }
                            
                        }
                        obstacle.alpha = 0
                        obstacle.active = false
                    }

                }
            }
            checkLine(group)

        }
        
        if(!playerGroup.jumping){
            if(playerGroup.isLeft){
                playerGroup.x+= moveSpeed
                playerGroup.gem.angle+= moveSpeed
            }else{
                playerGroup.x-= moveSpeed
                playerGroup.gem.angle-= moveSpeed
            }
        }
        
        var worldX = playerGroup.gem.world.x
        var worldY = playerGroup.gem.world.y
        if(worldX <= 0 || worldX > game.world.width || worldY <= 0){
            stopGame()
        }
    
    }
    
    function update(){
        
        if(!gameActive){
            return
        }
        
        if(gameGroup.isMoving){
            gameGroup.y-=gameSpeed
        }
        
        if(gameGroup.isMoving){
            movePoints()
        }
        
        if (jumpButton.isDown && !playerGroup.jumping){
            
            doJump()
        }
        
        if(playerGroup.gem.world.y > game.world.height - 200){
            stopGame()
        }
        
    }
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;
        
        game.load.spritesheet('rosa', 'images/hexhop/rosa.png', 50, 50, 73);
		
		if(amazing.getMinigameId()){
			gameSong = sound.setSong(soundsPath + 'songs/electro_trance_minus.mp3',0.8)
		}else{
			game.load.audio('hexSong', soundsPath + 'songs/electro_trance_minus.mp3');
		}
		
        
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
    
    function createHoles(){
        
        var pivotX = game.world.centerX - 200
        var pivotY = game.world.centerY - 100
        
        for(var i = 0;i<9;i++){
            
            var hole = holesGroup.create(pivotX, pivotY,'atlas.hexhop','hole')
            hole.anchor.setTo(0.5,0.5)
            
            hole.activated = false
            hole.hit = false
            
            pivotX += 200
            
            if((i + 1)% 3 == 0){
                pivotX = game.world.centerX - 200
                pivotY+= 200
            }
            
            
        }
    }
    
    function addNumberPart(obj,number,scaleIt){
        
        var offsetY = -100
        if(scaleIt){
            offsetY = 100
        }
        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)
        
        game.add.tween(pointsText).to({y:pointsText.y + offsetY},800,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        if(scaleIt){
            
            var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
            tweenScale.onComplete.add(function(){
                game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
            })
            
        }
        
    }
               
    function randomize(index){
        var isTrue = false
        
        if(Math.random()*index < 1){
            isTrue = true
        }
                
        return isTrue
    }
    
    function createLinesGroup(number){
        
        linesGroup.pivotY = playerGroup.y + jumpDistance
        
        for(var i = 0; i <number;i++){
            
            var isPair = (i+1)%2==0
            var pivotX = 0
            var group = game.add.group()
            group.y = linesGroup.pivotY 
            linesGroup.add(group)
            
            for(var a = 0; a<60;a++){
        
                var point = group.create(pivotX,0,'atlas.hexhop','left')
                point.anchor.setTo(0,0.5)
                
                pivotX += point.width * 1.5
                
                if(isPair){
                    point.scale.x = -1
                }
                
            }
            
            linesGroup.pivotY += jumpDistance
            
            if(i>0){
                
                group.active = true
                
                var pointsGroup = game.add.group()
                group.add(pointsGroup)
                group.obstacles = pointsGroup

                var pivotPoint = 0
                var isLeft = true
                var offset = 1

                if(isPair){
                    pivotPoint = game.world.width
                    offset = -1
                    isLeft = false
                }

                for(var a = 0; a < 20;a++){
                    
                    var obstacle
                    if(randomize(1.1)){
                        obstacle = pointsGroup.create(pivotPoint,0,'atlas.hexhop','obstacle')
                        obstacle.tag = 'obstacle'
                    }else{
                        obstacle = pointsGroup.create(pivotPoint,0,'atlas.hexhop','coin')
                        obstacle.tag = 'coin'
                    }
                    
                    obstacle.active = true
                    
                    obstacle.anchor.setTo(0.5,0.5)
                    obstacle.scale.setTo(0.8,0.8)

                    pivotPoint+= obstacle.width * (Math.random()*2.5 + 1) * offset
                    obstacle.isLeft = isLeft
                    obstacle.startPosition = obstacle.x
                }
            }else{
                group.active = false
            }
            
        }
        
    }
    
    function doJump(){
        
        addPoint(1)
        jumpTimes++
        
        sound.play("cut")
        
        if(jumpTimes % 2 == 0){
            playerGroup.isLeft = true
        }else{
            playerGroup.isLeft = false
        }
        
        if(!gameGroup.isMoving){
            gameGroup.isMoving = true
        }
        
        playerGroup.jumping = true
        
        playerGroup.scale.setTo(1,1)
        var jumpTween = game.add.tween(playerGroup).to({y:playerGroup.y + jumpDistance},250,Phaser.Easing.linear,true)
        jumpTween.onComplete.add(function(){
            playerGroup.jumping = false
            var scaleTween = game.add.tween(playerGroup.scale).to({x:0.5,y:1.4  },150,Phaser.Easing.linear,true,0)
            scaleTween.yoyo(true,0)
            
            var scaleTween = game.add.tween(playerGroup.scale).to({x:0.7 ,y:1.1},100,Phaser.Easing.linear,true,300)
            scaleTween.yoyo(true,0)
        })
        
    }
    
    function inputButton(obj){
        
        if(playerGroup.jumping || !gameActive){
            return
        }
        
        doJump()
    }
    
    function createDashboard(){
        
        var dashboard = sceneGroup.create(0,game.world.height,'atlas.hexhop','dashboard')
        dashboard.width = game.world.width
        dashboard.height *= 0.9
        dashboard.anchor.setTo(0,1)
        
        var button = sceneGroup.create(game.world.centerX,dashboard.y - 110,'atlas.hexhop','button')
        button.anchor.setTo(0.5,0.5)
        button.scale.setTo(1.3,1.3)
        button.inputEnabled = true
        button.events.onInputDown.add(inputButton)
        
    }
    
	return {
		assets: assets,
        preload: preload,
        update:update,
		name: "hexhop",
		create: function(event){

			sceneGroup = game.add.group()
            
            var background = sceneGroup.create(-2,-2,'fondo')
            background.width = game.world.width+2
            background.height = game.world.height+2
            
            
            gameGroup = game.add.group()
            sceneGroup.add(gameGroup)
            gameGroup.isMoving = false
            
            linesGroup = game.add.group()
            gameGroup.add(linesGroup)
            
            playerGroup = game.add.group()
            playerGroup.x = game.world.centerX
            playerGroup.y = 100
            gameGroup.add(playerGroup)
            
            var hex = game.add.sprite(0,0,'rosa')
            hex.anchor.setTo(0.5,0.5)
            hex.scale.setTo(1.6,1.6)
            hex.animations.add('walk');
            hex.animations.play('walk',24,true);
            playerGroup.gem = hex
            playerGroup.add(hex)
            
            initialize()
            animateScene()
            
            createLinesGroup(5)
            
            createLevelText()
            
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            
			if(!amazing.getMinigameId()){
				gameSong = game.add.audio('hexSong')
				game.sound.setDecodedCallback(gameSong, function(){
					gameSong.loopFull(0.8)
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
            createDashboard()
                        
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()