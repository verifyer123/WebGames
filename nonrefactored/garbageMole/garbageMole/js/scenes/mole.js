
var soundsPath = "../../shared/minigames/sounds/"
var mole = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.mole",
                json: "images/mole/atlas.json",
                image: "images/mole/atlas.png",
            },
        ],
        images: [
            {
                name: "board",
                file: "images/mole/board.png"
            }, 
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			
		],
    }
    
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 7
	var indexGame
    var overlayGroup
    var spaceSong
    var moleSpine
    var head
    var tail
    var cursors
    var trash
    var moleDirection
    var board
    var topLimit, leftLimit, rightLimit, downLimit, middleVert, middleHor
    var step
    var x
    var y
    var stepsTimer
    var speed
    var mole
    var trashGroup
    var score 
    var particleCorrect
    var viewRight
    var bagsGroup
   
    var directions = {up: 0, down: 1, right: 2, left: 3}
    var organic = ['apple','apple2','bone','fish','lobester']
    var inorganic = ['book','bottle','can','can2','can3','cardboard','cardboard2','glass','milk','paper','plastic','soda']
    var rubbish =['apple','apple2','bone','book','bottle','can','can2','can3','cardboard','cardboard2','fish','glass','lobester','milk','paper','plastic','soda']

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        loadSounds()
        
        x = game.world.centerX
        y = game.world.centerY
        step = 45
        stepsTimer = 0
        speed = 20
        score = 0
        
        leftLimit = board.x - (board.width * 0.42)
        rightLimit = (board.width * 0.42) + board.x
        topLimit = board.y - (board.height * 0.5) + step
        downLimit = board.height - step * 2 
        axisX = game.world.centerX//(downLimit - topLimit)/2
        axisY = game.world.centerY//(rightLimit - leftLimit)/2
        
        viewRight = false
        viewLefth = false
        
	}

    function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
        },this)
    }
    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

    }
	
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    } 
    
    function addNumberPart(obj,number,isScore){
        
        var pointsText = lookParticle('text')
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
            
            game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        }
        
    }
    
    function missPoint(){
        
        sound.play("wrong")
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            stopGame(false)
        }
        
        addNumberPart(heartsGroup.text,'-1',true)
        
    }
    
    function addPoint(number){
        
        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)		
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.mole','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.mole','life_box')

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
    
    function stopGame(win){
        
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function preload(){
        
		buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('spaceSong', soundsPath + 'songs/childrenbit.mp3');
        
		game.load.image('howTo',"images/mole/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/mole/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/mole/introscreen.png")
        game.load.spine("mole", "images/spines/mole.json")
		
		console.log(localization.getLanguage() + ' language')
        
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
                initGame()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.mole','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.mole',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.8,0.8)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.mole','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.mole', "tile")
        sceneGroup.add(tile)
        
        board = sceneGroup.create(game.world.centerX, 0, "board");
        board.anchor.setTo(0.5, 0.5)
        board.scale.setTo(1, 0.8)
        board.y = board.height * 0.5 + 20
	}
	
	function update(){
            
        moleSpine.x = x + 25
        moleSpine.y = y + 50
        mole.x = x
        mole.y = y
          
        updateDirection()
            
        stepsTimer++
        
         if (stepsTimer == speed) {
            movePlayer()
            moleView()
             
            if (moleVSmole()) {
                endGame()
            }
            if (game.physics.arcade.collide(mole, trashGroup, trashVSmole, null, this)) {
               sound.play("pop")
            } else if (moleDirection != undefined) {
                deleteLast()
            }
             
            if (moleDirection != undefined) 
                newHead(x, y)
             
            stepsTimer = 0
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
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.mole',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle

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

				particle.makeParticles('atlas.mole',tag);
				particle.minParticleSpeed.setTo(-200, -50);
				particle.maxParticleSpeed.setTo(200, -100);
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
		
		createParticles('star',3)
		createParticles('wrong',1)
		createParticles('text',5)
		createParticles('smoke',1)

	}

	function setExplosion(obj){
        
        var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
        
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xffffff)
        rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        rect.alpha = 0
        rect.endFill()
		sceneGroup.add(rect)
		
		game.add.tween(rect).from({alpha:1},500,"Linear",true)
		
        var exp = sceneGroup.create(0,0,'atlas.mole','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.mole','smoke');
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = posX;
        particlesGood.y = posY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
	}
	
    function createMole(){
        
        moleSpine = game.add.spine(x, y, "mole")
        moleSpine.scale.setTo(0.8, 0.8)
        moleSpine.setAnimationByName(0, "IDLE_FRONT", true)
        moleSpine.setSkinByName("normal")
        sceneGroup.add(moleSpine)
      
        mole = game.add.sprite(x, y, 'atlas.mole', 'star')
        mole.alpha = 0 
        game.physics.arcade.enable(mole)
        mole.body.immovable = true
    }
    
    function moleView(){
        
        switch(moleDirection){
            case directions.up:
                moleSpine.setAnimationByName(0, "IDLE_BACK", true)
                if(viewRight){
                    moleSpine.scale.x *= -1
                    viewRight = false
                }
                break
                case directions.down:
                moleSpine.setAnimationByName(0, "IDLE_FRONT", true)
                if(viewRight){
                    moleSpine.scale.x *= -1
                    viewRight = false
                }
                break
                case directions.left:
                
                    moleSpine.setAnimationByName(0, "IDLE_L&R", true)
     
                break
                case directions.right:
                if(!viewRight){
                    moleSpine.setAnimationByName(0, "IDLE_L&R", true)
                    moleSpine.scale.x *= -1
                    viewRight = true
                }
                break
                
        }
    }
    
    function initLine() {
        
        head = new Object()
        newHead(x, y - step)
        tail = head
        newHead(x, y)
    }

    function createTrash(){
        
        trashGroup = game.add.physicsGroup()
        trashGroup.enableBody = true
        trashGroup.physicsBodyType = Phaser.Physics.ARCADE
        sceneGroup.add(trashGroup)  
    }
        
    function trowTrash(spawnX, spawnY){
    
        var trash = game.add.sprite(spawnX, spawnY, 'atlas.mole', rubbish[game.rnd.integerInRange(0, rubbish.length)])
        trash.anchor.setTo(0.5, 0.5)
        trashGroup.add(trash)  
    }
    
    function initGame(){
        
        var spawnX =  game.rnd.integerInRange(leftLimit, game.world.centerX)
        var spawnY =  game.rnd.integerInRange(topLimit, game.world.centerY)
        trowTrash(spawnX, spawnY)
        
        var spawnX =  game.rnd.integerInRange(game.world.centerX, rightLimit)
        var spawnY =  game.rnd.integerInRange(topLimit, game.world.centerY)
        trowTrash(spawnX, spawnY)
        
        var spawnX =  game.rnd.integerInRange(leftLimit, game.world.centerX)
        var spawnY =  game.rnd.integerInRange(game.world.centerY, downLimit)
        trowTrash(spawnX, spawnY)
        
        var spawnX =  game.rnd.integerInRange(game.world.centerX, rightLimit)
        var spawnY =  game.rnd.integerInRange(game.world.centerY, downLimit)
        trowTrash(spawnX, spawnY)
    }

    function newHead(x, y) {
        
        var newHead = new Object()
        newHead.image = game.add.image(x, y, 'atlas.mole', 'trashBag')
        newHead.image.scale.setTo(0.8, 0.8)
        newHead.next = null
        head.next = newHead
        head = newHead
        bagsGroup.add(newHead.image)
    }
    
    function createBags(){
        
        bagsGroup = game.add.group()
        sceneGroup.add(bagsGroup)
    }

    function deleteLast() {
        
        tail.image.destroy()
        tail = tail.next
    }
        
    function endGame(){
        
        missPoint()
        bagsGroup.removeAll(true)
        trashGroup.removeAll(true)
        speed = 20
        score = 0
        moleSpine.setAnimationByName(0, "IDLE_FRONT", true)
        moleDirection = undefined
        x = game.world.centerX
        y = game.world.centerY
        
        initLine()
        initGame()
    }
    
    function trashVSmole(mole, trash){
        
        trashGroup.removeAll(true)
        speed--
        score++
        if(score % 4 == 0)
            addPoint(1)
        if (speed <= 5) speed = 5
        
        particleCorrect.x = trash.x
        particleCorrect.y = trash.y
        particleCorrect.start(true, 1000, null, 4)
        
        initGame()
         
        return true
    }
    
    function moleVSmole() {
        
        var pivot = tail
        while (pivot.next != head) {
            if (pivot.image.position.x == head.image.position.x &&
                pivot.image.position.y == head.image.position.y) {
                return true
            }
            pivot = pivot.next
        }
    }

    function updateDirection() {
        if (cursors.right.isDown && moleDirection != directions.left) {
            moleDirection = directions.right
        }
        if (cursors.left.isDown && moleDirection != directions.right) {
            moleDirection = directions.left
        }
        if (cursors.up.isDown && moleDirection != directions.down) {
            moleDirection = directions.up
        }
        if (cursors.down.isDown && moleDirection != directions.up) {
            moleDirection = directions.down
        }
    }

    function movePlayer() {
        if (moleDirection == directions.right) {
            x += step;
        } else if (moleDirection == directions.left) {
            x -= step;
        } else if (moleDirection == directions.up) {
            y -= step;
        } else if (moleDirection == directions.down) {
            y += step;
        }
        
        if (x < leftLimit) {
            x = rightLimit - step
        } else if (x > rightLimit - step) {
            x = leftLimit
        } else if (y < topLimit) {
            y = downLimit - step
        } else if (y >= downLimit) {
            y = topLimit 
        }
    }
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
    }

    function createBoard(){
         
        trashBoard = sceneGroup.create(game.world.centerX, board.height, 'atlas.mole', "trashBoard");
        trashBoard.anchor.setTo(0.5, 0.5)
        //trashBoard.scale.setTo(1, 0.8)
        //trashBoard.y = trashBoard.height 
    }
    
	return {
		
		assets: assets,
		name: "mole",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
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
            
            cursors = game.input.keyboard.createCursorKeys()
            game.physics.startSystem(Phaser.Physics.ARCADE)
            
            
            initialize()

			createPointsBar()
			createHearts()
            createParticles()
            createBags()
            initLine()
            createTrash()
            createMole()
            createBoard()

			buttons.getButton(spaceSong,sceneGroup)
            createOverlay()
            animateScene()
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()