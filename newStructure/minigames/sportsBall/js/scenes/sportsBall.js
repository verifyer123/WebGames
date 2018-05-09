
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var sportsBall = function(){
    
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
                name: "atlas.sportsBall",
                json: "images/sportsBall/atlas.json",
                image: "images/sportsBall/atlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/sportsBall/gametuto.png"
			}

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
            {	name: "explode",
				file: soundsPath + "explode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/the_buildup.mp3'
            }
		],
        spritesheets: [
            {   name: "coin",
                file: "images/spines/coin.png",
                width: 122,
                height: 123,
                frames: 12
            },
            {   name: "hand",
                file: "images/spines/hand.png",
                width: 115,
                height: 111,
                frames: 23
            }
        ],
        spines:[
			{
				name:"justice",
				file:"images/spines/justice.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 202
    var tutoGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var barsGroup
    var targetsGroup
    var cannonBall
    var level
    var cannon
    var swinSpeed
    var targetArray = []
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        level = 10
        originalSpeed = 4000
        swinSpeed = originalSpeed
        
        loadSounds()
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
    
    function missPoint(obj){
        
        sound.play("wrong")
        
        particleWrong.x = obj.centerX 
        particleWrong.y = obj.centerY
        particleWrong.start(true, 1200, null, 10)
		        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.sportsBall','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.sportsBall','life_box')

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
        gameSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function preload(){
        
		//buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false
        
        //loadType(gameIndex)
    }
    
    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }
    
    function onClickPlay() {
        tutoGroup.y = -game.world.height
        initGame()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
            
        var background = sceneGroup.create(0, 0 , "atlas.sportsBall", "background")
        background.width = game.world.width
        background.heigth = game.world.heigth
        
        barsGroup = game.add.group()
        barsGroup.enableBody = true
        barsGroup.physicsBodyType = Phaser.Physics.ARCADE
        sceneGroup.add(barsGroup)
        
        var bar = barsGroup.create(30, 70, "atlas.sportsBall", "bar")
        bar.body.immovable = true
        
        bar = barsGroup.create(game.world.width - 60, 70, "atlas.sportsBall", "bar")
        bar.body.immovable = true
        
        var topBar = barsGroup.create(game.world.centerX, 90, "atlas.sportsBall", "topBar")
        topBar.anchor.setTo(0.5)
        topBar.width = game.world.width * 0.75
        topBar.body.immovable = true
    }

	function update(){
        
        game.physics.arcade.collide(cannonBall, barsGroup)
        
        if(gameActive && !cannon.canShoot){
            
            for(var i = 0; i < targetsGroup.length; i++){
            
                if(checkOverlap(targetsGroup.children[i], cannonBall.circle) && targetsGroup.children[i].active){
                    cannon.canShoot = true      
                    cannonBall.x = -100
                    addNewTarget()
                    break
                }
            }      
            
            if(checkOverlap(barsGroup.children[2], cannonBall)){
                cannon.canShoot = true      
                cannonBall.x = -100
                addNewTarget()
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
        particle.makeParticles('atlas.sportsBall',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
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

				particle.makeParticles('atlas.sportsBall',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.sportsBall','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.sportsBall','smoke');
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
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('smoke')
        sceneGroup.add(particleWrong)
    }
	
	function initCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.8)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0
        
        hand = game.add.sprite(0, 0, "hand")
        hand.animations.add('hand')
        hand.animations.play('hand', 24, true)
        hand.alpha = 0

    }

    function addCoin(){
        
        coin.x = game.world.centerX
        coin.y = game.world.centerY
        var time = 300
        
        sound.play("rightChoice")
        particleCorrect.x = game.world.centerX
        particleCorrect.y = game.world.centerY
        particleCorrect.start(true, 1200, null, 10)

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
                   if(pointsBar.number % 5 == 0){
                       cannon.swing.stop()
                       swinSpeed > 800 ? swinSpeed -= 200 : swinSpeed = 800
                       if(gameActive){
                           game.add.tween(cannon).to({angle: -45},swinSpeed * 0.5,Phaser.Easing.linear,true).onComplete.add(function(){
                                cannon.swing = game.add.tween(cannon).to({angle: 45}, swinSpeed, Phaser.Easing.linear, true, 0, -1, true)
                           })
                       }
                   }
               })
           })
        })
    }
    
    function createTargets(){
        
        targetsGroup = game.add.group()
        sceneGroup.add(targetsGroup)
        
        var pivotX = game.world.centerX - 190
		var pivotY = 150
        
        targetsGroup.coordinates = new Array(7)
        for (var i = 0; i < 7; i++) {
            targetsGroup.coordinates[i] = new Array(6)
        }
		
		for(var i = 0; i < 7; i++){
			
			for(var j = 0; j < 6; j++){
				
				var target = targetsGroup.create(pivotX, pivotY, "atlas.sportsBall", "target0")
				target.anchor.setTo(0.5)
				target.scale.setTo(0.8)
				target.alpha = 0
				target.active = false
				target.check = false
                target.tag = -1
                
				pivotX += target.width
                
                targetsGroup.coordinates[i][j] = target
			}
			
			if((i + 1) % 2 == 0)
            {
				pivotX = game.world.centerX - 190
			}
            else{
				pivotX = game.world.centerX - 167
			}
			
			pivotY += 70	
		}
    }
    
    function createCannonBall(){
            
        cannonBall = sceneGroup.create(0, 0, "atlas.sportsBall", "ball1")
        cannonBall.enableBody = true
        game.physics.enable(cannonBall, Phaser.Physics.ARCADE)
        cannonBall.body.bounce.set(1)
        cannonBall.anchor.setTo(0.5)
        cannonBall.scale.setTo(0.6)
        cannonBall.exists = false
        cannonBall.visible = false
        cannonBall.tag = -1
        cannonBall.checkWorldBounds = true
        cannonBall.events.onOutOfBounds.add(killObj, this)
        
        var circle = game.add.graphics(0, 0)
        circle.beginFill(0xFF0000, 0)
        circle.drawCircle(0, 0, 30)
        cannonBall.addChild(circle)
        cannonBall.circle = circle
    }
    
    function killObj(obj){
        obj.kill()
        cannon.canShoot = true
    }
    
    function createCannon(){
        
        var base = sceneGroup.create(game.world.centerX, game.world.height - 80, "atlas.sportsBall", "base")
        base.anchor.setTo(0.5)
        
        cannon = sceneGroup.create(base.x, base.y, "atlas.sportsBall", "cannon")
        cannon.anchor.setTo(0.5, 1)
        cannon.inputEnabled = true
        cannon.canShoot = true
        cannon.tag = game.rnd.integerInRange(0, 2)
        cannon.events.onInputDown.add(shootBall, this)
        
        var ball = sceneGroup.create(0, -130, "atlas.sportsBall", "ball" + cannon.tag)
        ball.anchor.setTo(0.5, 1)
        ball.scale.setTo(0.6)
        cannon.addChild(ball)
        cannon.ballToShoot = ball
        
        var fire = game.add.sprite(0, -130, "atlas.sportsBall", "fire")
        fire.anchor.setTo(0.5, 1)
        fire.alpha = 0
        cannon.addChild(fire)
        cannon.fire = fire
        
        var target = sceneGroup.create(0, - 500, "atlas.sportsBall", "star")
        target.anchor.setTo(0.5)
        target.alpha = 0
        cannon.addChild(target)
        cannon.target = target
    }
    
    function shootBall(){
        
        if(gameActive && cannon.canShoot){
            
            cannon.canShoot = false
            cannon.ballToShoot.alpha = 0
            cannon.fire.alpha = 1
            game.add.tween(cannon.fire).to({alpha: 0},400,Phaser.Easing.linear,true)
      
            //sound.play("shoot")
            cannonBall.reset(cannon.ballToShoot.world.x, cannon.ballToShoot.world.y - 40)
            cannonBall.loadTexture('atlas.sportsBall', "ball" + cannon.tag)
            cannonBall.tag = cannon.tag
            game.physics.arcade.moveToXY(cannonBall, cannon.target.world.x, cannon.target.world.y, 800)
            sound.play("explode")
            
            particleWrong.x = cannon.ballToShoot.world.x
            particleWrong.y = cannon.ballToShoot.world.y
            particleWrong.start(true, 1200, null, 7)
            
            cannon.tag = game.rnd.integerInRange(0, 2)
            cannon.ballToShoot.loadTexture('atlas.sportsBall', "ball" + cannon.tag)
            cannon.ballToShoot.alpha = 1
            game.add.tween(cannon.ballToShoot.scale).from({x:0, y:0},300,Phaser.Easing.linear,true)
        }
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds()
        var boundsB = spriteB.getBounds()

        return Phaser.Rectangle.intersects(boundsA , boundsB )
    }
    
    function addNewTarget(){
            
        var tars = []
        
        for(var i = 0; i < targetsGroup.length; i++){
            
            if(checkOverlap(targetsGroup.children[i], cannonBall) && !targetsGroup.children[i].active){
                tars[tars.length] = targetsGroup.children[i]
            }
        }      

        var aux = tars[0]
        
        if(tars.length > 1){
            
            for(var i = 1; i < tars.length; i++){
            
                if(getIntersections(aux).volume < getIntersections(tars[i]).volume){
                    aux = tars[i]
                }
            }     
        } 
        if(aux){
            sound.play("pop")
            aux.alpha = 1
            aux.active = true
            aux.loadTexture("atlas.sportsBall", "target" + cannonBall.tag)
            aux.tag = cannonBall.tag
            game.add.tween(aux.scale).from({x:0, y:0},200,Phaser.Easing.linear,true).onComplete.add(function(){

                targetArray = []
                targetsGroup.setAll("check", false)
                checkToDestroy(aux)
                destroyTargets()
                //checkEmpty()
                game.time.events.add(500, checkEmpty)            
            })
        }
        else{
            gameActive = false
            cannon.canShoot = true
            cannon.inputEnabled = false
            cannon.swing.stop()
            missPoint(game.world)
            if(lives !== 0){
                game.add.tween(cannon).to({angle: 0},300,Phaser.Easing.linear,true).onComplete.add(function(){
                    game.time.events.add(1000, restartAssets)           
                })
            }        
        }
    }
    
    function getIntersections(obj){
        
        var boundA = cannonBall.getBounds()
        var boundB = obj.getBounds()
        
        return Phaser.Rectangle.intersection(boundA , boundB )
    }
    
    function checkToDestroy(obj){
        
        obj.check = true
        
		targetArray[targetArray.length] = obj
        
        for(var i = 0; i < targetsGroup.length;i++){
            
            var bubble = targetsGroup.children[i]
            
            if(!bubble.check && obj.tag === bubble.tag){
                 
                if(Math.abs(obj.x - bubble.x) < obj.width * 1.2){
                    
                    if(Math.abs(obj.y - bubble.y) < obj.height * 1.2){
                        checkToDestroy(bubble)
                    }
                }else if(Math.abs(obj.y - bubble.y) < obj.height * 1.2){
                    
                    if(Math.abs(obj.x - bubble.x) < obj.width * 1.2){
                        checkToDestroy(bubble)
                    }
                }
            }
        }
    }
    
    function destroyTargets(){
        
        if(targetArray.length > 2){
            for(var i = 0; i < targetArray.length;i++){
                targetArray[i].active = false
                targetArray[i].tag = -1  
                //targetArray[i].alpha = 0
                fadeOut(targetArray[i])
            }
            addCoin()
        }
    }
    
    function fadeOut(obj){
        
        game.add.tween(obj).to({alpha:0},200,Phaser.Easing.linear,true)
    }
    
    function checkEmpty(){
        
        for(var i = 1; i < 7; i++){
            
            for(var j = 0; j < 6; j++){
                
                if(targetsGroup.coordinates[i][j].active)
                    checkAllTargets(targetsGroup.coordinates[i][j], i, j)
            }
        }
        
        game.time.events.add(700, checkFinished)
    }
    
    function checkAllTargets(core, y, x){
        var end = false
        
        if(x === 0){
            if(y % 2 !== 0){
                for(var i = y - 1; i <= y; i++){
                    for(var j = x; j <= x + 1; j++){
                        if(!(i === y && j === x)){
                            if(targetsGroup.coordinates[i][j].active){
                                end = true
                                break
                            }
                        }
                    }
                }
                
                if(!end){
                    core.active = false
                    core.tag = -1
                    fadeOut(core)
                }
            }
            else{
                if(!targetsGroup.coordinates[y - 1][x].active && !targetsGroup.coordinates[y][x + 1].active){
                    core.active = false
                    core.tag = -1
                    fadeOut(core)
                }
            }
        }
        else if(x === 5){
            if(y % 2 !== 0){
                if(!targetsGroup.coordinates[y - 1][x].active && !targetsGroup.coordinates[y][x - 1].active){
                    core.active = false
                    core.tag = -1
                    fadeOut(core)
                }
            }
            else{
                for(var i = y - 1; i <= y; i++){
                    for(var j = x - 1; j <= x; j++){
                        if(!(i === y && j === x)){
                            if(targetsGroup.coordinates[i][j].active){
                                end = true
                                break
                            }
                        }
                    }
                }
                
                if(!end){
                    core.active = false
                    core.tag = -1
                    fadeOut(core)
                }
            }
        }
        else{
            if(y % 2 !== 0){
                for(var i = y - 1; i <= y; i++){
                    var start
                    i === y ? start = x - 1 : start = x
                    for(var j = start; j <= x + 1; j++){
                        if(!(i === y && j === x)){
                            if(targetsGroup.coordinates[i][j].active){
                                end = true
                                break
                            }
                        }
                    }
                }
                
                if(!end){
                    core.active = false
                    core.tag = -1
                    fadeOut(core)
                }
            }
            else{
                for(var i = y - 1; i <= y; i++){
                    var limit
                    i === y ? limit = x + 1 : limit = x
                    for(var j = x - 1; j <= limit; j++){
                        if(!(i === y && j === x)){
                            if(targetsGroup.coordinates[i][j].active){
                                end = true
                                break
                            }
                        }
                    }
                }
                
                if(!end){
                    core.active = false
                    core.tag = -1
                    fadeOut(core)
                }
            }
        }
    }
    
    function checkFinished(){
        
        var finished = true
        for(var i = 0; i < targetsGroup.length; i++){
            if(targetsGroup.children[i].active){
                finished = false
                break
            }
        }
        
        if(finished){
            gameActive = false
            cannon.canShoot = true
            cannon.inputEnabled = false
            cannon.swing.stop()
            game.add.tween(cannon).to({angle: 0},300,Phaser.Easing.linear,true)
            addCoin()
            restartAssets()
        }
    }
    
    function restartAssets(){
        
        for(var i = 0; i < targetsGroup.length;i++){
            targetsGroup.children[i].active = false
            targetsGroup.children[i].tag = -1  
            game.add.tween(targetsGroup.children[i]).to({alpha:0},200,Phaser.Easing.linear,true)
        }
        targetArray = []
        originalSpeed > 1000 ? originalSpeed -= 500 : originalSpeed = 1000
        swinSpeed = originalSpeed
        level < 32 ? level += 8 : level = 32
        
        game.time.events.add(300, initGame)
    }

    function initGame(){

        var delay = setTargets()
        
        game.time.events.add(delay,function(){
            game.add.tween(cannon).to({angle: -45},swinSpeed * 0.5,Phaser.Easing.linear,true).onComplete.add(function(){
                cannon.swing = game.add.tween(cannon).to({angle: 45}, swinSpeed, Phaser.Easing.linear, true, 0, -1, true)
            })
            gameActive = true
            cannon.inputEnabled = true
        })
    }
    
    function setTargets(){
        
        var delay = 200
        for(var i = 0; i < level; i++){
            
            var tag = game.rnd.integerInRange(0, 2)
            targetsGroup.children[i].active = true
            targetsGroup.children[i].loadTexture("atlas.sportsBall", "target" + tag)
            targetsGroup.children[i].tag = tag
            popObject(targetsGroup.children[i], delay)
            delay += 200
        }
        
        return delay
    }
    
    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj).from({y:-100},250,Phaser.Easing.linear,true)
        },this)
    }
    
	return {
		
		assets: assets,
		name: "sportsBall",
		update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            /*gameSong = game.add.audio('gameSong')
            game.sound.setDecodedCallback(gameSong, function(){
                gameSong.loopFull(0.6)
            }, this);*/
            
            initialize()
            gameSong = sound.play("gameSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            //initialize()
			            
			createPointsBar()
			createHearts()
            initCoin()
            createTargets()
            createCannon()
            createCannonBall()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()