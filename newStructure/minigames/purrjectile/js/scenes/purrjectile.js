
var soundsPath = "../../shared/minigames/sounds/"

var purrjectile = function(){
    
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
                name: "atlas.purrjectile",
                json: "images/purrjectile/atlas.json",
                image: "images/purrjectile/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/purrjectile/timeAtlas.json",
                image: "images/purrjectile/timeAtlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/purrjectile/gametuto.png"
			}
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "throw",
				file: soundsPath + "throw.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "cat",
				file: soundsPath + "cat.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/childrenbit.mp3'
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
				name:"oof",
				file:"images/spines/oof/oof.json"
			},
            {
				name:"cat",
				file:"images/spines/cat/cat.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var heartsGroup
    var gameIndex = 209
    var tutoGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var linesArray = []
    var pillowGroup
    var bullet
    var catsGroup
    var oof
    var catCounter
    var level
    var speed
    var spawnTime
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        click = false
        catCounter = 3
        level = 3
        speed = 8000
        spawnTime = 2600
        
        loadSounds()
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.purrjectile','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.purrjectile','life_box')

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
        pillowGroup.pillow.inputEnabled = false
        oof.setAnimationByName(0, "lose", false)
        oof.addAnimationByName(0, "losestill", true)
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
            
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.purrjectile", "background"))
        
        var city = sceneGroup.create(game.world.centerX, game.world.height, "atlas.purrjectile", "city")
        city.anchor.setTo(0.5, 1)
    }

	function update(){

        if(gameActive && !pillowGroup.canShot){
            
            for(var i = 0; i < catsGroup.length; i++){
                
                if(checkOverlap(catsGroup.children[i].box, bullet.box) && !catsGroup.children[i].sleep && catsGroup.children[i].inPlay){
                    pillowGroup.canShoot = true    
                    killCat(catsGroup.children[i])
                    break
                }
            }         
        }
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds()
        var boundsB = spriteB.getBounds()

        return Phaser.Rectangle.intersects(boundsA , boundsB)
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
        particle.makeParticles('atlas.purrjectile',key);
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

				particle.makeParticles('atlas.purrjectile',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.purrjectile','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.purrjectile','smoke');
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

    function addCoin(obj){
        
        coin.x = obj.centerX
        coin.y = obj.centerY
        var time = 300
        
        particleCorrect.x = obj.centerX 
        particleCorrect.y = obj.centerY
        particleCorrect.start(true, 1200, null, 10)

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function createBullet(){
        
        bullet = sceneGroup.create(0, 0, "atlas.purrjectile", "flyingPillow")
        bullet.enableBody = true
        game.physics.enable(bullet, Phaser.Physics.ARCADE)
        bullet.anchor.setTo(0.5)
        bullet.exists = false
        bullet.visible = false
        bullet.checkWorldBounds = true
        bullet.events.onOutOfBounds.add(killObj, this)
        
        var box = game.add.graphics(0, 0)
        box.beginFill(0x00ffaa)
        box.drawRect(-18, -90, 40, 50)
        box.alpha = 0
        bullet.addChild(box)
        bullet.box = box
    }
    
    function killObj(obj){
        
        obj.y = -200
        if(lives !== 0){
            pillowGroup.canShot = true
            pillowGroup.pillow.x = pillowGroup.pillow.startPosX
            pillowGroup.pillow.y = pillowGroup.pillow.startPosY
            pillowGroup.pillow.aim.angle = -90
            pillowGroup.setAll("alpha", 1)
            pillowGroup.band.alpha = 0
            missPoint(pillowGroup.pillow)

            for(var i = 0; i < linesArray.length; i++){

                linesArray[i].clear()
                linesArray[i].lineStyle(10, 0x691861, 1)
                linesArray[i].alpha = 1
                linesArray[i].moveTo(linesArray[i].posX, linesArray[i].posY)
                linesArray[i].lineTo(pillowGroup.pillow.x, pillowGroup.pillow.y)
            }
        }
    }
    
    function createCats(){
        
        catsGroup = game.add.group()
        sceneGroup.add(catsGroup)
        
        for(var i = 0; i < 10; i++){
            
            var cat = game.add.spine(-200, -200, "cat")
            cat.setAnimationByName(0, "idle", true)
            cat.setSkinByName("normal0")
            cat.scale.setTo(0.7)
            cat.sleep = false
            cat.inPlay = false
            catsGroup.add(cat)
            
            var box = game.add.graphics(0, 0)
            box.beginFill(0x00aaff)
            box.drawRect(-70, -220, 150, 200)
            box.alpha = 0
            cat.addChild(box)
            cat.box = box
        }
    }
    
    function createSlingshot(){
        
        var roof = sceneGroup.create(game.world.centerX, game.world.height, "atlas.purrjectile", "roof")
        roof.anchor.setTo(0.5, 1)
        
        var sling = sceneGroup.create(roof.centerX, roof.centerY, "atlas.purrjectile", "slingshot")
        sling.anchor.setTo(0.5, 1)
        
        var bounds = new Phaser.Rectangle(sling.centerX - 300, sling.centerY - 150, 600, 300)
        var graphics = game.add.graphics(bounds.x, bounds.y)
        graphics.beginFill(0x000077)
        graphics.drawRect(0, 0, bounds.width, bounds.height)
        graphics.alpha = 0
        
        var pillow = game.add.sprite(sling.centerX, sling.centerY + 100, "atlas.purrjectile", "pillow")
        pillow.anchor.setTo(0.5)
        pillow.inputEnabled = true
        pillow.startPosX = pillow.x
        pillow.startPosY = pillow.y
        pillow.input.enableDrag()
        pillow.input.boundsRect = bounds
        pillow.events.onDragUpdate.add(dragUpdate, this)
        pillow.events.onDragStop.add(dragStop, this)
        
        var aim = game.add.sprite(0, 0, "atlas.purrjectile", "aim")
        aim.anchor.setTo(0, 0.5)
        aim.angle = -90
        pillow.addChild(aim)
        pillow.aim = aim	
        
        var target = sceneGroup.create(sling.centerX, sling.centerY - 100, "atlas.purrjectile", "star")
        target.anchor.setTo(0.5)
        target.alpha = 0
        pillow.target = target
        
        createOof()
        
        createLines(sling, pillow)
    }
    
    function createOof(){
        
        oof = game.add.spine(200, game.world.height -80, "oof")
        oof.setAnimationByName(0, "idle", true)
        oof.setSkinByName("normal")
        oof.scale.setTo(0.4)
        sceneGroup.add(oof)
        
        var catHead = game.add.sprite(650, 0, "atlas.purrjectile", "catHead")
        catHead.anchor.setTo(0.5)
        catHead.scale.setTo(1.5)
        oof.addChild(catHead)
        oof.cat = catHead
        
        var fontStyle = {font: "90px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var catText = new Phaser.Text(sceneGroup.game, 130, 0, "", fontStyle)
        catText.anchor.setTo(0.5)
        catText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
        catText.setText('X ' + catCounter)
        catHead.addChild(catText)
    
        oof.catText = catText
    }
    
    function createLines(sling, pillow){
        
        var aux = -60
        for(var i = 0; i < 2; i++){
            
            var line = game.add.graphics(0,0)
            line.posX = sling.centerX + aux
            line.posY = sling.centerY - 60
            line.lineStyle(10, 0x691861, 1)
            line.beginFill()
            line.moveTo(line.posX, line.posY)
            line.lineTo(pillow.x, pillow.y)
            line.endFill()
            linesArray[i] = line
            aux = 60
        }
            
        pillowGroup = game.add.group()
        pillowGroup.canShot = true
        sceneGroup.add(pillowGroup)
        
        pillowGroup.add(linesArray[0])
        pillowGroup.add(pillow)
        pillowGroup.pillow = pillow
        pillowGroup.add(linesArray[1])
        
        var band = pillowGroup.create(sling.centerX - 35, sling.centerY - 70, "atlas.purrjectile", "band")
        band.anchor.setTo(0.5, 0)
        band.alpha = 0
        pillowGroup.band = band
        
        pillow.inputEnabled = false
    }
    
    function dragUpdate(pillow){
        
        if(gameActive){
            
            for(var i = 0; i < linesArray.length; i++){
                
                linesArray[i]
                linesArray[i].clear()
                linesArray[i].lineStyle(10, 0x691861, 1)
                linesArray[i].alpha = 1
                linesArray[i].moveTo(linesArray[i].posX, linesArray[i].posY)
                linesArray[i].lineTo(pillow.x,pillow.y)
            }
            
            pillow.aim.rotation = game.physics.arcade.angleBetween(pillow, pillow.target)
        }
    }
    
    function dragStop(pillow){
        
        if(gameActive && pillowGroup.canShot){
            pillowGroup.canShot = false
            pillowGroup.setAll("alpha", 0)
            pillowGroup.band.alpha = 1
            game.add.tween(pillowGroup.band.scale).from({y:0},200,Phaser.Easing.linear,true)
            shotPillow()
        }
    }
    
    function shotPillow(){
        sound.play("throw")
        bullet.reset(pillowGroup.pillow.x, pillowGroup.pillow.y)
        bullet.angle = ((pillowGroup.pillow.aim.rotation * 180)/Math.PI ) + 90
        game.physics.arcade.moveToXY(bullet, pillowGroup.pillow.target.world.x, pillowGroup.pillow.target.world.y, 1000)
        bullet.checkWorldBounds = true
    }
    
    function killCat(cat){
        
        cat.setAnimationByName(0, "sleep", true)
        cat.sleep = true
        sound.play("rightChoice")
        sound.stop("throw")
        
        bullet.checkWorldBounds = false
        bullet.y = -200
        pillowGroup.canShot = true
        pillowGroup.pillow.x = pillowGroup.pillow.startPosX
        pillowGroup.pillow.y = pillowGroup.pillow.startPosY
        pillowGroup.pillow.aim.angle = -90
        pillowGroup.setAll("alpha", 1)
        pillowGroup.band.alpha = 0
        
        for(var i = 0; i < linesArray.length; i++){
                
            linesArray[i].clear()
            linesArray[i].lineStyle(10, 0x691861, 1)
            linesArray[i].alpha = 1
            linesArray[i].moveTo(linesArray[i].posX, linesArray[i].posY)
            linesArray[i].lineTo(pillowGroup.pillow.x, pillowGroup.pillow.y)
        }
        
        catCounter--
        game.add.tween(oof.catText.scale).to({x: 1.5,y:1.5}, 200, Phaser.Easing.linear, true, 0, 0, true)
        oof.catText.setText('X ' + catCounter)
        if(catCounter === 0){
            gameActive = false
            sound.stop("cat")
            pillowGroup.pillow.inputEnabled = false
            pillowGroup.setAll("alpha", 0)
            pillowGroup.band.alpha = 1
            addCoin(pillowGroup.pillow)
            restoreAssets()
        }
    }
    
    function restoreAssets(){
        
        for(var i = 0; i < catsGroup.length; i++){
            var cat = catsGroup.children[i]
            if(cat.flying){
                cat.flying.stop(true)
                game.add.tween(cat).to({alpha: 0},300,Phaser.Easing.linear,true).onComplete.add(function(){
                    cat.x = cat.destiny  
                })
            }
        }
        if(pointsBar.number % 2 === 0){
            level++
        }
        catCounter = level
        speed > 1500 ? speed -= 1000 : speed = 1500
        spawnTime > 1000 ? spawnTime -= 200 : spawnTime = 1000
        game.time.events.add(2000, initGame)
    }
    
    function initGame(){
        
        oof.catText.setText('X ' + catCounter)
        game.add.tween(oof.catText.scale).from({y:0}, 200, Phaser.Easing.linear, true)
        pillowGroup.setAll("alpha", 1)
        pillowGroup.band.alpha = 0
        pillowGroup.pillow.inputEnabled = true
        gameActive = true
        sound.play("cat", {loop:true, volume:1})
        pullCat()
    }
    
    function pullCat(){
        
        if(gameActive){

            var cat = getCat()
            
            if(cat){
                cat.alpha = 1
                cat.setAnimationByName(0, "idle", true)
                cat.setSkinByName("normal" + game.rnd.integerInRange(0, 1))
                cat.inPlay = true
                if(game.rnd.integerInRange(0, 1) === 1){
                    cat.x = -200
                    cat.scale.setTo(-0.7, 0.7)
                    cat.destiny = game.world.width + 200
                }
                else{
                    cat.x = game.world.width + 200
                    cat.scale.setTo(0.7)
                    cat.destiny = -200
                }
                cat.y = game.rnd.integerInRange(300, game.world.centerY + 100)
                cat.flying = game.add.tween(cat).to({x: cat.destiny},speed,Phaser.Easing.linear,true)
                cat.flying.onComplete.add(function(){
                    cat.inPlay = false
                    cat.sleep = false
                })
            }
            game.time.events.add(spawnTime, pullCat)
        }
    }
    
    function getCat(){
        
        for(var i = 0; i < catsGroup.length; i++){
            if(!catsGroup.children[i].inPlay){
                return catsGroup.children[i]
            }
        }
    }
	
	return {
		
		assets: assets,
		name: "purrjectile",
		update: update,
        preload: preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
            game.physics.startSystem(Phaser.Physics.ARCADE)
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
            
            initialize()
			            
			createPointsBar()
			createHearts()
            createCats()
            createSlingshot()
            createBullet()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()