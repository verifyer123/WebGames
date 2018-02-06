
var soundsPath = "../../shared/minigames/sounds/"
var fruityChaser = function(){
    
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
                name: "atlas.fruityChaser",
                json: "images/fruityChaser/atlas.json",
                image: "images/fruityChaser/atlas.png",
            },
        ],
        images: [

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 137
    var overlayGroup
    var fruitySong
    var coin
    var trees, grass, fence, track0, track1, track2
    var speed
    var riseSpeed
    var cursors
    var auxRow
    var fruitsGroup
    var fruits = ['BANANA', 'MANGO', 'ORANGE', 'PEACH', 'PINEAPPLE', 'STRAWBERRY', 'WATERMELON']
    var fruitName 
    var rnd
    var pivot
    var randFruit = [0,1,2,3,4,5,6,]
    var rowList
    var trowTimer
    var bannerGroup
    var row
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        speed = 0
        riseSpeed = 7
        auxRow = 1
        rnd = - 1
        pivot = 0
        rowList = [track0.centerY, track1.centerY, track2.centerY]  
        trowTimer = 2000
        row = -1
        
        if(localization.getLanguage() === 'EN'){
            fruitName = ['Banana', 'Mango', 'Orange', 'Peach', 'Pineapple', 'Strawberry', 'Watermelon']
        }
        else{
            fruitName = ['Banana', 'Mango', 'Naranja', 'Durazno', 'Piña', 'Fresa', 'Sandia']
        }
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.fruityChaser','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.fruityChaser','life_box')

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
        fruitySong.stop()
        		
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
        
        game.load.audio('fruitySong', soundsPath + 'songs/funny_invaders.mp3');
        
		game.load.image('howTo',"images/fruityChaser/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/fruityChaser/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/fruityChaser/introscreen.png")
		game.load.image('trees',"images/fruityChaser/trees.png")
		game.load.image('grass',"images/fruityChaser/grass.png")
		game.load.image('track0',"images/fruityChaser/track0.png")
		game.load.image('track1',"images/fruityChaser/track1.png")
		game.load.image('track2',"images/fruityChaser/track2.png")
        game.load.spritesheet("coin", 'images/spines/coin.png', 122, 123, 12)
        
        game.load.spine("nao", "images/spines/Nao/nao.json")
        game.load.spine("fruits", "images/spines/Fruits/fruits.json")
		
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
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.fruityChaser','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.fruityChaser',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.fruityChaser','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }

	function createBackground(){
        
        trees = game.add.tileSprite(0, 0, game.world.width, 320, "trees")
        sceneGroup.add(trees)
        
        grass = game.add.tileSprite(0, trees.height + 80, game.world.width, 150, "grass")
        grass.anchor.setTo(0, 1)
        sceneGroup.add(grass)
        
        fence = game.add.tileSprite(0, trees.height + 80, game.world.width, 150, 'atlas.fruityChaser', "fence")
        fence.anchor.setTo(0, 1)
        sceneGroup.add(fence)
        
        track0 = game.add.tileSprite(0, fence.y - 30, game.world.width, 230, "track0")
        track0.number = 0
        track0.inputEnabled = true
        track0.events.onInputDown.add(changeRow)
        sceneGroup.add(track0)
        
        track1 = game.add.tileSprite(0, track0.y, game.world.width, 230, "track1")
        track1.y += track1.height - 50
        track1.number = 1
        track1.inputEnabled = true
        track1.events.onInputDown.add(changeRow)
        sceneGroup.add(track1)
        
        track2 = game.add.tileSprite(0, game.world.height, game.world.width, 230, "track2")
        track2.anchor.setTo(0, 1)
        track2.number = 2
        track2.inputEnabled = true
        track2.events.onInputDown.add(changeRow)
        sceneGroup.add(track2)
    }

	function update(){
       
        trees.tilePosition.x -= speed * 0.3
        grass.tilePosition.x -= speed * 0.5
        fence.tilePosition.x -= speed *0.5
        track0.tilePosition.x -= speed
        track1.tilePosition.x -= speed
        track2.tilePosition.x -= speed
        
        nao.y = naoCollider.y + 50
      
        /*if (cursors.up.isDown && !isPressedUp)
        {
            if(aux != 0)
                aux--
            changeRow2(aux)
            isPressedUp = true
        }
        else if (cursors.down.isDown && !isPressedDown)
        {
             if(aux != 2)
                aux++
            changeRow2(aux)
            isPressedDown = true
        }
           
        if(cursors.up.isUp && isPressedUp)
            isPressedUp = false
        else if(cursors.down.isUp && isPressedDown)
            isPressedDown = false*/
        
        if(gameActive){
            
            for(var f = 0; f < fruitsGroup.length; f++){
                if (fruitsGroup.children[f].isActive){
                    if(fruitsGroup.children[f].x > - 100){
                        fruitsGroup.children[f].x -= speed * 0.5
                    }
                    else if(fruitsGroup.children[f] !== undefined){
                        fruitsGroup.children[f].isActive = false
                        fruitsGroup.children[f].x = game.world.width + 120
                    }   
                    game.physics.arcade.overlap(naoCollider, fruitsGroup.children[f], naoVSfruits, null, this)
                }
            }
        }
    }
    
    function naoVSfruits(naoC, fruC){
        
        naoCollider.body.enable = false
        fruC.parent.isActive = false
        game.time.events.add(300,function(){
            fruC.parent.x = game.world.width + 120
        },this)
        
        nao.setAnimationByName(0, "HIT", false)
        
        if(rnd === fruC.kind){
            addCoin()
            if(pointsBar.number !== 0 && pointsBar.number % 9 === 0){
                game.time.events.add(300,function(){
                    lvlUp()
                },this)
            }
            else{
                nao.addAnimationByName(0, "RUN", true)
                changeFruitText()
            }
            particleCorrect.x = naoCollider.x + 50
            particleCorrect.y = naoCollider.y 
            particleCorrect.start(true, 1000, null, 4)   
            game.time.events.add(300,function(){
                naoCollider.body.enable = true
            },this)
        }
        else{
            nao.addAnimationByName(0, "LOSE", true)
            speed = 0
            missPoint() 
            gameActive = false
            particleWrong.x = naoCollider.x + 50
            particleWrong.y = naoCollider.y 
            particleWrong.start(true, 1000, null, 4)    
            
            fruitsRunAlone()
            
            game.time.events.add(1800,function(){
                if(lives != 0){
                    gameActive = true
                    speed = riseSpeed
                    nao.setAnimationByName(0, "RUN", true)
                    naoCollider.body.enable = true
                }
            },this)
        }
    }
    
    function fruitsRunAlone(){

        for(var f = 0; f < fruitsGroup.length; f++){
            fruitsGroup.children[f].isActive = false
            game.add.tween(fruitsGroup.children[f]).to({x: game.world.width + 120}, 1000, Phaser.Easing.linear,true)
        }
    }
    
    function lvlUp(){
        speed = 0
        nao.addAnimationByName(0, "WIN", true)
        fruitsRunAlone()
        
        riseSpeed++
        trowTimer -= 200
        
        game.time.events.add(1500,function(){
            naoCollider.body.enable = true
            changeFruitText()
            speed = riseSpeed
            nao.setAnimationByName(0, "RUN", true)
        },this)
    }
    
    function changeRow(row){
        
        if(gameActive){
            auxRow = row.number
            sound.play("cut")
            naoCollider.body.enable = false
            game.add.tween(naoCollider).to({y:row.centerY}, 200, Phaser.Easing.linear, true).onComplete.add(function(){
                naoCollider.body.enable = true
            })
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
        particle.makeParticles('atlas.fruityChaser',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.5;
        particle.maxParticleScale = .9;
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

				particle.makeParticles('atlas.fruityChaser',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.fruityChaser','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.fruityChaser','smoke');
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
       coin.scale.setTo(0.5)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0

    }

    function addCoin(){
        
        coin.x = naoCollider.centerX
        coin.y = naoCollider.centerY
        time = 300

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function NaoIsInTheHouse(){
        
        naoCollider = sceneGroup.create(180, track1.centerY, "atlas.fruityChaser", "star")
        naoCollider.anchor.setTo(0.5)
        naoCollider.scale.setTo(0.5)
        naoCollider.alpha = 0
        game.physics.arcade.enable(naoCollider)
        
        nao = game.add.spine(60, naoCollider.y + 50, "nao")
        nao.scale.setTo(0.5)
        nao.setAnimationByName(0, "IDLE", true)
        nao.setSkinByName("normal")
        sceneGroup.add(nao)
    }
    
    function fruitsOnTheRun(){
        
        fruitsGroup = game.add.group()
        sceneGroup.add(fruitsGroup)   
        
        for(var f = 0; f < fruits.length; f++){
            
            var fruit = game.add.group()
            fruit.x = game.world.width + 120
            fruit.y = track0.centerY
            fruit.scale.setTo(0.8)
            fruit.isActive = false
            fruit.enableBody = true
            fruit.physicsBodyType = Phaser.Physics.ARCADE
            fruitsGroup.add(fruit)
            
            var fru = fruit.create(0, 0, 'atlas.fruityChaser', fruits[f])
            fru.anchor.setTo(0.5)
            fru.alpha = 0
            fru.kind = f
            
            var it = game.add.spine(0, 60, "fruits")
            it.setAnimationByName(0, "IDLE_" + fruits[f], true)
            it.setSkinByName("normal")
            fruit.add(it)
        }
        
        for(var f = 0; f < fruits.length; f++){
            
            var fruit = game.add.group()
            fruit.x = game.world.width + 120
            fruit.y = track0.centerY
            fruit.scale.setTo(0.8)
            fruit.isActive = false
            fruit.enableBody = true
            fruit.physicsBodyType = Phaser.Physics.ARCADE
            fruitsGroup.add(fruit)
            
            var fru = fruit.create(0, 0, 'atlas.fruityChaser', fruits[f])
            fru.anchor.setTo(0.5)
            fru.alpha = 0
            fru.kind = f
            
            var it = game.add.spine(0, 60, "fruits")
            it.setAnimationByName(0, "IDLE_" + fruits[f], true)
            it.setSkinByName("normal")
            fruit.add(it)
        }
    }
    
    function trowFruit(){
        
         game.time.events.add(trowTimer,function(){
            
            if(pivot < 7)
            {
                row = getRandRow()
                fruitsGroup.children[randFruit[pivot]].x = game.world.width + 120
                fruitsGroup.children[randFruit[pivot]].isActive = true
                fruitsGroup.children[randFruit[pivot]].enableBody = true
                fruitsGroup.children[randFruit[pivot]].y = rowList[row]
                pivot++
                if(gameActive)
                    trowFruit()
            }
            else{
                game.time.events.add(trowTimer + 500,function(){
                    trowTree()
                }, this)
            }   
        }, this)
    }
    
    function trowTree(){
        
        row = getRandRow()
        var r = rnd + 7
        for(var t = 0; t < 3; t++){
            fruitsGroup.children[r].x = game.world.width + 120
            fruitsGroup.children[r].isActive = true
            fruitsGroup.children[r].enableBody = true
            fruitsGroup.children[r].y = rowList[row]
            if(r < 13)
                r++
            else 
                r = 7
            if(row < 2)
                row++
            else 
                row = 0
        }
        
        pivot = 0  
        Phaser.ArrayUtils.shuffle(randFruit)
        
        game.time.events.add(trowTimer + 500,function(){
            trowFruit()
        }, this)
    }
    
    function fruitBanner(){
        
        var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#FFFACD", align: "center"}
        
        bannerGroup = game.add.group()
        sceneGroup.add(bannerGroup)
        
        var banner = bannerGroup.create(game.world.centerX, 150, 'atlas.fruityChaser', 'sign')
        banner.anchor.setTo(0.5)
        
        var name = new Phaser.Text(sceneGroup.game, banner.x, banner.y, '0', fontStyle)
        name.anchor.setTo(0.5)
        name.setText('')
        name.stroke = "#8B4513";
        name.strokeThickness = 10;
        //name.setShadow(2, 2, "#333333", 2, true, false);
        bannerGroup.add(name)
        bannerGroup.text = name
    }
    
    function initGame(){
        
        Phaser.ArrayUtils.shuffle(randFruit)
        pivot = 0
        changeFruitText()
        game.time.events.add(400,function(){
            gameActive = true
            speed = riseSpeed
            nao.setAnimationByName(0, "RUN", true)
            naoCollider.body.enable = true
            trowFruit()
        },this)
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 6)
        if(x === rnd)
            return getRand()
        else
            return x     
    }
    
    function getRandRow(){
        var x = game.rnd.integerInRange(0, 2)
        if(x === row)
            return getRandRow()
        else
            return x     
    }
    
    function changeFruitText(){
        rnd = getRand()
        bannerGroup.text.setText(fruitName[rnd])
    }
	
	return {
		
		assets: assets,
		name: "fruityChaser",
		update: update,
        preload:preload,
		create: function(event){
            
            game.physics.startSystem(Phaser.Physics.ARCADE)
            cursors = game.input.keyboard.createCursorKeys()
			sceneGroup = game.add.group()
           
			createBackground()
			addParticles()
                        			
            fruitySong = game.add.audio('fruitySong')
            game.sound.setDecodedCallback(fruitySong, function(){
                fruitySong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            initCoin()
            fruitsOnTheRun()
            NaoIsInTheHouse()
            fruitBanner()
            createParticles()
			
			buttons.getButton(fruitySong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()