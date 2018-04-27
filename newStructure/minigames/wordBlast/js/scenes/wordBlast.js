
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"
var wordBlast = function(){
    
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
                name: "atlas.wordBlast",
                json: "images/wordBlast/atlas.json",
                image: "images/wordBlast/atlas.png",
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
				file:"images/wordBlast/tutorial_image_%input.png"
			},
            {
				name:'background',
				file:"images/wordBlast/background.png"
			}

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "robotWhoosh",
				file: soundsPath + "robotWhoosh.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/marioSong.mp3'
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
				name:"animals",
				file:"images/spines/animals/animals.json"
			},
            {
				name:"fruits",
				file:"images/spines/fruits/fruits.json"
			},
            {
				name:"planets",
				file:"images/spines/planets/planets.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 196
    var tutoGroup
    var gameSong
    var coin
    var hand
    var riddleImage
    var chipsGroup
    var animatedGroup
    var textWritten
    var wordsArray
    var wordsPool
    var chipCounter
    var riddleText
    var letterCounter
    var wordIndex
    var rand
    var option
    var speed
    var tutorial = true
    var okBtn
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        wordsArray = []
        
        if(localization.getLanguage() === 'ES'){
            wordsPool = [["CAT", "DOG", "LION", "MOUSE", "SHEEP", "SQUIRREL"],
                         ["APPLE", "BANANA", "CARROT", "ORANGE", "PEACH"],
                         ["EARTH", "MOON", "SUN", "VENUS"]]
        }
        else{
            wordsPool = [["GATO", "PERRO", "LEÓN",  "RATÓN", "OVEJA", "ARDILLA"],
                         ["MANZANA", "PLATANO", "ZANAHORIA", "NARANJA", "DURAZNO"],
                         ["TIERRA", "LUNA", "SOL", "VENUS"]]
        }
        
        chipCounter = 0
        letterCounter = 0
        wordIndex = 0
        rand = -1
        option = -1
        speed = 1000
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.wordBlast','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.wordBlast','life_box')

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
            
        var background = sceneGroup.create(0, 0, "background")
        background.width = game.world.width
        background.height = game.world.height
        
        var courtain = sceneGroup.create(0, 0, "atlas.wordBlast", "courtain")
        courtain.width = game.world.centerX
        
        courtain = sceneGroup.create(game.world.width, 0, "atlas.wordBlast", "courtain")
        courtain.width = -game.world.centerX
    }

	function update(){
        
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
        particle.makeParticles('atlas.wordBlast',key);
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

				particle.makeParticles('atlas.wordBlast',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.wordBlast','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.wordBlast','smoke');
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
        sound.play("rightChoice")
        
        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function createImages(){
        
        riddleImage = sceneGroup.create(game.world.centerX, 160, "atlas.wordBlast", "base")
        riddleImage.anchor.setTo(0.5)
        
        animatedGroup = game.add.group()
        animatedGroup.pool = [["cat", "dog", "lion", "mouse", "sheep", "squirrel"],
                         ["apple", "banana", "carrot", "orange", "peach"],
                         ["earth", "moon", "sun", "venus"]]
        sceneGroup.add(animatedGroup)
        
        var aux = 5
        
        for(var i = 0; i < 3; i++){
            
            var anim = game.add.spine(riddleImage.centerX, riddleImage.centerY + riddleImage.height * 0.58, assets.spines[i].name)
            anim.setAnimationByName(0, "idle", true)
            anim.setSkinByName("")
            anim.alpha = 0
            anim.limit = aux
            animatedGroup.add(anim)
            
            aux--
        }
    }
    
    function createChips(){
        
        var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        chipsGroup = game.add.group()
        chipsGroup.colors = ["blue", "green", "orange", "red"]
        sceneGroup.add(chipsGroup)
        
        var pivotY = 0.7
        
        for(var i = 0; i < 4; i++){
            
            var pivotX = 0.2
            
            for(var j = 0; j < 5; j++){
                
                var subGroup = game.add.group()
                subGroup.used = false
                subGroup.pressed = false
                subGroup.isActive = false
                subGroup.alpha = 0
                chipsGroup.add(subGroup)
                
                var chipOff = subGroup.create(game.world.centerX * pivotX, game.world.centerY * pivotY, "atlas.wordBlast", "blueOff")
                chipOff.anchor.setTo(0.5)
                chipOff.spawnX = chipOff.x
                chipOff.spawnY = chipOff.y
                chipOff.inputEnabled = true
                chipOff.events.onInputDown.add(pressChip,this)
                subGroup.chipOff = chipOff
                
                var chipOn = subGroup.create(game.world.centerX * pivotX, game.world.centerY * pivotY, "atlas.wordBlast", "blueOn")
                chipOn.alpha = 0
                chipOn.anchor.setTo(0.5)
                subGroup.chipOn = chipOn
                
                var text = new Phaser.Text(sceneGroup.game, game.world.centerX * pivotX, 5 + game.world.centerY * pivotY, "", fontStyle)
                text.anchor.setTo(0.5)
                text.alpha = 0
                subGroup.add(text)
                subGroup.text = text
                
                pivotX += 0.4
            }
            pivotY += 0.22
        }
    }
    
    function createBoard(){
        
        var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var board = sceneGroup.create(0, game.world.height, "atlas.wordBlast", "board")
        board.anchor.setTo(0, 1)
        board.width = game.world.width
        
        var textBar = sceneGroup.create(board.centerX, board.centerY, "atlas.wordBlast", "textBar")
        textBar.anchor.setTo(0.5, 0.9)
        
        textWritten = new Phaser.Text(sceneGroup.game, 0, -30, "", fontStyle)
        textWritten.anchor.setTo(0.5)
        textBar.addChild(textWritten)
        
        okBtn = game.add.group()
        okBtn.alpha = 0
        sceneGroup.add(okBtn)
        
        var okOff = okBtn.create(board.centerX, board.centerY + 60, "atlas.wordBlast", "okOff")
        okOff.anchor.setTo(0.5)
        okOff.inputEnabled = true
        okOff.events.onInputDown.add(okPressed,this)
        okOff.events.onInputUp.add(okRelased,this)
        
        var okOn = okBtn.create(board.centerX, board.centerY + 60, "atlas.wordBlast", "okOn")
        okOn.anchor.setTo(0.5)
        okOn.alpha = 0
        
        okBtn.children[0].inputEnabled = false
    }
    
    function pressChip(obj){
        
        if(gameActive){
            var chip = obj.parent
            if(chip.isActive){
                sound.play("pop")
                chip.chipOff.alpha = 0
                chip.chipOn.alpha = 1
                chip.isActive = false
                chip.pressed = true
                wordsArray[wordsArray.length] = chip.text.text
                setActualWord()
                if(tutorial){
                    hand.alpha = 0
                    if(wordIndex < riddleText.length){
                        dropChipTuto()
                    }
                    else{
                        console.log("done")
                        posHand()
                    }
                    
                }
            }
        }
    }
    
    function setActualWord(){
        
        if(gameActive && wordsArray.length > 0){
           
            var word = ""
            for(var i = 0; i < wordsArray.length; i++){
                word += wordsArray[i]
            }
            textWritten.setText(word)
        }
    }
    
    function okPressed(obj){
        
        if(gameActive && wordsArray.length > 0){
            gameActive = false
            changeImage(1, obj.parent)
            
            var word = ""
            for(var i = 0; i < wordsArray.length; i++){
                word += wordsArray[i]
            }
            
            for(var i = 0; i < chipsGroup.length; i++){
                
                if(chipsGroup.children[i].pressed && !chipsGroup.children[i].isActive && chipsGroup.children[i].used){
                    chipsGroup.children[i].used = false
                    fadeOut(chipsGroup.children[i])
                }
            }
            
            if(tutorial){
                tutorial = false
                hand.destroy()
            }
            
            game.time.events.add(250,function(){
                win(word)
            })
        }
    }
    
    function fadeOut(obj){
        
        game.add.tween(obj).to({alpha:0},200,Phaser.Easing.In,true).onComplete.add(function(){
            obj.used = false
            obj.chipOff.alpha = 1
            obj.chipOn.alpha = 0
            obj.text.setText("")
            obj.text.alpha = 0
        })
    }
    
    function okRelased(obj){
        changeImage(0, obj.parent)
    }
    
    function win(ans){

        wordsArray = []
        textWritten.setText("")
        wordIndex = 0
        letterCounter = 0
        chipCounter = 0
        game.add.tween(animatedGroup.children[rand]).to({alpha:0},250,Phaser.Easing.In,true)
        
        for(var i = 0; i < chipsGroup.length; i++){
            if(chipsGroup.children[i].used){
                chipCounter++
            }
        }
        
        if(chipCounter > 14){
            clearBoard()
        }
        
        if(ans === riddleText){
            addCoin(riddleImage)
            if(pointsBar.number !== 0 && pointsBar.number % 5 === 0){
                clearBoard()
                chipCounter = 0
                speed > 100 ? speed-= 200 : speed = 100
                console.log("speed " + speed)
            }
        }
        else{
            missPoint(riddleImage)
        }
        
        game.time.events.add(1500,function(){
            if(lives !== 0){
                initGame()
            }
        })
    }
    
    function clearBoard(){
        
        for(var i = 0; i < chipsGroup.length; i++){
            fadeOut(chipsGroup.children[i])
            if(chipsGroup.children[i].falling)
                chipsGroup.children[i].falling.stop()
            chipsGroup.children[i].children[0].x = chipsGroup.children[i].children[0].spawnX
            chipsGroup.children[i].children[0].y = chipsGroup.children[i].children[0].spawnY
        }
        chipsGroup.setAll("used", false)
        chipsGroup.setAll("pressed", false)
        chipsGroup.setAll("isActive", false)
    }
    
    function initGame(){
        
        rand = game.rnd.integerInRange(0, animatedGroup.length - 1) 
        option = getRand(option, animatedGroup.children[rand].limit)
        riddleText = wordsPool[rand][option]
        animatedGroup.children[rand].setAnimationByName(0, "idle", true)
        animatedGroup.children[rand].setSkinByName(animatedGroup.pool[rand][option])
        sound.play("cut")
        game.add.tween(animatedGroup.children[rand]).to({alpha:1},250,Phaser.Easing.In,true).onComplete.add(function(){
            game.time.events.add(800,function(){
                gameActive = true
                if(tutorial)
                    dropChipTuto()
                else
                    dropChip()
            })
        })
    }
    
    function dropChip(){
        
        if(gameActive){
            var chip = selectChip()
            var color = game.rnd.integerInRange(0, 3)
            chip.chipOff.loadTexture("atlas.wordBlast", chipsGroup.colors[color] + "Off")
            chip.chipOn.loadTexture("atlas.wordBlast", chipsGroup.colors[color] + "On")
            chip.used = true
            chip.pressed = false
            chip.text.alpha = 0
            chip.alpha = 1
            chip.text.setText(selectLetter())
            chip.falling = game.add.tween(chip.children[0]).from({y:0},speed,Phaser.Easing.linear,true)
            chip.falling.onComplete.add(function(){
                sound.play("robotWhoosh")
                chip.text.alpha = 1
                chip.isActive = true
                game.time.events.add(500,function(){
                    if(gameActive){
                        if(chipCounter < 20){
                            dropChip()
                        }
                        else{
                            gameActive = false
                            clearBoard()
                            chipCounter = 0
                            win("")
                        }
                    }
                })
            })
        }
    }
    
    function selectChip(){
        
        var x = game.rnd.integerInRange(0, chipsGroup.length - 1)
        if(chipsGroup.children[x].used)
            return selectChip()
        else{
            chipCounter++
            return chipsGroup.children[x]
        }
    }
    
    function selectLetter(){
                
        var character
        
        if(chipCounter > 14){
            if(wordIndex < riddleText.length){
                character = riddleText.charAt(wordIndex)
                wordIndex++
            }
            else{
                character = String.fromCharCode(game.rnd.integerInRange(65, 86))
            }
        }
        else{
            if(letterCounter < 3){
                if(game.rnd.integerInRange(0, 2) !== 0){
                    if(wordIndex < riddleText.length){
                        character = riddleText.charAt(wordIndex)
                        wordIndex++
                    }
                    else{
                        character = String.fromCharCode(game.rnd.integerInRange(65, 86))
                        letterCounter++
                    }
                }
                else{
                    character = String.fromCharCode(game.rnd.integerInRange(65, 86))
                    letterCounter++
                }
            }
            else{
                letterCounter = 0
                if(wordIndex < riddleText.length){
                    character = riddleText.charAt(wordIndex)
                    wordIndex++
                }
                else{
                    character = String.fromCharCode(game.rnd.integerInRange(65, 86))
                }
            }
        }
        return character
    }
    
    function getRand(opt, limit){
        var x = game.rnd.integerInRange(0, limit)
        if(x === opt)
            return getRand(opt, limit)
        else
            return x
    }
    
    function dropChipTuto(){
        riddleText.charAt(wordIndex)
        if(gameActive){
            var chip = selectChip()
            var color = game.rnd.integerInRange(0, 3)
            chip.chipOff.loadTexture("atlas.wordBlast", chipsGroup.colors[color] + "Off")
            chip.chipOn.loadTexture("atlas.wordBlast", chipsGroup.colors[color] + "On")
            chip.used = true
            chip.pressed = false
            chip.text.alpha = 0
            chip.alpha = 1
            chip.text.setText(riddleText.charAt(wordIndex))
            wordIndex++
            chip.falling = game.add.tween(chip.children[0]).from({y:0},speed,Phaser.Easing.linear,true)
            chip.falling.onComplete.add(function(){
                sound.play("robotWhoosh")
                chip.text.alpha = 1
                chip.isActive = true
                posHand(chip)
            })
        }
    }
    
    function posHand(obj){
        
        if(obj){
            hand.x = obj.children[0].x
            hand.y = obj.children[0].y
            hand.alpha = 1
        }
        else{
            hand.x = okBtn.children[0].x
            hand.y = okBtn.children[0].y
            hand.alpha = 1
            okBtn.alpha = 1
            okBtn.children[0].inputEnabled = true
        }
    }
	
	return {
		
		assets: assets,
		name: "wordBlast",
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
            
            initialize()
			            
			createPointsBar()
			createHearts()
            createImages()
            createChips()
            createBoard()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()