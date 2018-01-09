var soundsPath = "../../shared/minigames/sounds/"
var float = function(){
    
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
                name: "atlas.float",
                json: "images/float/atlas.json",
                image: "images/float/atlas.png",
            },
        ],
        images: [
            {   name:"fondo",
				file: "images/float/fondo.png"},
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
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
		],
	}
        
    var SPEED = 7
	
	var colorsToUse = [0x35F935,0xF935BE,0xF9EC35]
    
    var gameIndex = 77
    var gameLevel = null
    var spaceSong = null
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
	var particlesGroup, particlesUsed
	var background, background2
	var counter
	var numIndex, lineIndex

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = false
        lives = 1
        jumpTimes = 0
        jumpDistance = 170
        gameSpeed = 1.3
        moveSpeed = 2.5
        gameLevel = 1
        loadSounds()
        levelNumber = 1
		numIndex = 0
		lineIndex = numIndex
        
	}

    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)

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

				particle.makeParticles('atlas.float',tag);
				particle.minParticleSpeed.setTo(-400, -100);
				particle.maxParticleSpeed.setTo(400, -200);
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
		
		createParticles('star',1)
		createParticles('wrong',1)
		createParticles('text',5)
		createParticles('smoke',1)

	}
    
    function setExplosion(obj,offsetY){
        
        sound.play("explode")
        var offY = offsetY || 0

        var exp = sceneGroup.create(0,0,'atlas.float','explosion')
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

        particlesGood.makeParticles('atlas.float',idString);
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

		spaceSong.stop()
        
        gameActive = false
		sound.play("gameLose")
        
        setExplosion(playerGroup.gem)
        playerGroup.anim.setAnimationByName(0,"LOSE",false)
		playerGroup.anim.addAnimationByName(0,"LOSESTILL",true)
        
        lives--
        heartsGroup.text.setText(lives)
        
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
        
        var pointsImg = pointsBar.create(10,10,'atlas.float','xpcoins')
    
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

        var heartsImg = group.create(0,0,'atlas.float','life_box')
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
        
        if(Math.abs(obj1.world.x - obj2.obs.world.x) < obj2.width * distance && Math.abs(obj1.world.y - obj2.obs.world.y)< obj2.height * distance){
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
			
			obstacle.number = lineIndex + 1
			if(randomize(1.7)){
				obstacle.number = game.rnd.integerInRange(lineIndex,lineIndex + 2)
			}
			obstacle.text.setText(obstacle.number)
			
            obstacle.active = true
            obstacle.alpha = 1

            pivotPoint+= obstacle.width * 1.5 * offset
            //console.log(obstacle.startPosition + ' start')

        }
		lineIndex++
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
    
	function updateCounter(){
		
		var tween = game.add.tween(counter.scale).to({x:0.8,y:0.8},500,"Linear",true,0,0)
		tween.yoyo(true,0)
		
		counter.text.setText(numIndex)
	}
	
    function movePoints(){
        
        for(var i = 0;i<linesGroup.length;i++){
            var group = linesGroup.children[i]
            
            if(group.active){
                
                for(var u = 0; u < group.obstacles.length;u++){

                    var obstacle = group.obstacles.children[u]

                    if(obstacle.isLeft == true){
                        obstacle.x-= moveSpeed
                        //obstacle.angle-=moveSpeed
                    }else{
                        obstacle.x+= moveSpeed
                        //obstacle.angle+=moveSpeed
                    }

                    if(checkPosPlayer(playerGroup.gem,obstacle) && !playerGroup.jumping){
                        if(obstacle.tag == 'obstacle' && obstacle.active && playerGroup.active){
                            playerGroup.active = false
							if(numIndex  == obstacle.number - 1 ){
								addPoint(2)
                                createPart('star',obstacle.obs)
                                sound.play("magic")
                                addNumberPart(obstacle.obs,'+' + 2,false)
								
								numIndex++
								updateCounter()
							}else{
								stopGame()
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
		
		background.tilePosition.x++
		background.tilePosition.y--
        
        if(gameGroup.isMoving){
            gameGroup.y-=gameSpeed
        }
        
        if(gameGroup.isMoving){
            movePoints()
        }
        
        if (jumpButton.isDown && !playerGroup.jumping){
            
            doJump()
        }
        
        if(playerGroup.gem.world.y > game.world.height){
            stopGame()
        }
        
    }
    
    function preload(){
            
		game.stage.disableVisibilityChange = false;
        game.load.audio('spaceSong', soundsPath + 'songs/classic_videogame_loop_2.mp3');
		game.load.spine('yogotar', "images/spines/oof.json") 
		
		buttons.getImages(game)
        
		game.load.image('howTo',"images/float/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/float/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/float/introscreen.png")
        
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
            
            var hole = holesGroup.create(pivotX, pivotY,'atlas.float','hole')
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
        
                var point = group.create(pivotX,0,'atlas.float','left')
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
				
				var indexColor = 0
                for(var a = 0; a < 20;a++){
                    
                    var obstacle = game.add.group()
					obstacle.x = pivotPoint
					pointsGroup.add(obstacle)

					var obs = obstacle.create(0,0,'atlas.float','obstacle')
					obs.tint = colorsToUse[indexColor]
					
					indexColor++
					if(indexColor == colorsToUse.length){
						indexColor = 0
					}
					obstacle.tag = 'obstacle'
					obstacle.obs = obs
                    
					var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
					
					var pointsText = new Phaser.Text(sceneGroup.game, -3, -5, "0", fontStyle)
					pointsText.anchor.setTo(0.5,0.5)
					obstacle.add(pointsText)
			
					obstacle.number = lineIndex + 1
					if(randomize(1.7)){
						obstacle.number = game.rnd.integerInRange(lineIndex,lineIndex + 2)
					}
					
					pointsText.setText(obstacle.number)
					obstacle.text = pointsText
					
                    obstacle.active = true
                    
                    obs.anchor.setTo(0.5,0.5)
                    obstacle.scale.setTo(1.2,1.2)

                    pivotPoint+= obstacle.width * 1.5 * offset
                    obstacle.isLeft = isLeft
                    obstacle.startPosition = obstacle.x
                }
            }else{
                group.active = false
            }
			
			if(i>0){
				lineIndex++
			}
        }
        
    }
    
    function doJump(){
        playerGroup.active = true
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
        
		//console.log('input button ')
        if(playerGroup.jumping || !gameActive){
            return
        }
        
		playerGroup.anim.setAnimationByName(0,"WIN",false)
		playerGroup.anim.addAnimationByName(0,"IDLE",true)
        doJump()
    }
    
    function createDashboard(){
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(inputButton)
		sceneGroup.add(rect)
        
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
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.float','gametuto')
		tuto.scale.setTo(0.75,0.75)
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.float',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.float','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
	
	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.float','fondo')
		sceneGroup.add(background)
		
		background2 = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.float','water_texture')
		background2.alpha = 0.5
		sceneGroup.add(background2)
	}
	
	function createCounter(){
		
		counter = game.add.group()
		counter.x = 100
		counter.y = 150
		sceneGroup.add(counter)
		
		var image = counter.create(0,0,'atlas.float','counter')
		image.anchor.setTo(0.5,0.5)
		
		var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}	
		var pointsText = new Phaser.Text(sceneGroup.game, -7, -3, numIndex, fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		counter.add(pointsText)
		
		counter.text = pointsText
		
	}
	
	return {
		assets: assets,
        preload: preload,
        update:update,
		name: "float",
		create: function(event){

			sceneGroup = game.add.group()
                        
            createBackground()
			
            gameGroup = game.add.group()
            sceneGroup.add(gameGroup)
            gameGroup.isMoving = false
            
            linesGroup = game.add.group()
            gameGroup.add(linesGroup)
            
            playerGroup = game.add.group()
            playerGroup.x = game.world.centerX
            playerGroup.y = 100
            gameGroup.add(playerGroup)
            playerGroup.active = false
            
            var hex = playerGroup.create(0,0,'atlas.float','player')
            hex.anchor.setTo(0.5,0.5)
            hex.scale.setTo(1.6,1.6)
			hex.alpha = 0
            playerGroup.gem = hex
            playerGroup.add(hex)
			
			var yogotar = game.add.spine(0,60,'yogotar')
			yogotar.setSkinByName('normal')
			yogotar.setAnimationByName(0,"IDLE",true)
			playerGroup.add(yogotar)
			playerGroup.anim = yogotar
	            
            initialize()
            animateScene()
            
            createLinesGroup(5)
            
            createLevelText()
            
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            
			spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            createHearts()
            createPointsBar()
            createDashboard()
			createCounter()
			addParticles()
			
			createOverlay()
                        
		}
	}
}()