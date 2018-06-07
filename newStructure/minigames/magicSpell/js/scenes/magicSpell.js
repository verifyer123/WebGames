
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var magicSpell = function(){
    
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
                name: "atlas.magicSpell",
                json: "images/magicSpell/atlas.json",
                image: "images/magicSpell/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/magicSpell/timeAtlas.json",
                image: "images/magicSpell/timeAtlas.png",
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
				file:"images/magicSpell/gametuto.png"
			},
            {
                name: "background",
                file: "images/magicSpell/background.png"
            },
            {
                name: "bigRock",
                file: "images/magicSpell/bigRock.png"
            }

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "drag",
				file: soundsPath + "drag.mp3"},
            {	name: "punch2",
				file: soundsPath + "punch2.mp3"},
            {	name: "towercollapse",
				file: soundsPath + "towercollapse.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/battleLoop.mp3'
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
				name:"dinamita",
				file:"images/spines/Dinamita/dinamita.json"
			},
            {
				name:"spelletor",
				file:"images/spines/Spelletor/spelletor.json"
			},
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 190
    var tutoGroup
    var gameSong
    var coin
    var hand
    var timerGroup
    var tiles = []
    var spellWords
    var runesGroup
    var slotsGroup
    var spellBoard
    var dinamita
    var spelletor
    var rand
    var ans
    var ok
    var canClick
    var timeAttack
    var gameTime
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        canClick = false
        timeAttack = false
        gameTime = 10000
        
        if(localization.getLanguage() === 'ES'){
            spellWords = ["SPRING", "SUMMER", "AUTUMN", "WINTER"]
        }
        else{
            spellWords = ["PRIMAVERA", "VERANO", "OTOÑO", "INVIERNO"]
        }
        rand = -1
        ans = ""
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.magicSpell','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.magicSpell','life_box')

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
        game.add.tween(dinamita).to({x:200}, 1500, Phaser.Easing.linear,true).onComplete.add(function(){
            walkForward()
        })
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
            
        var back = game.add.graphics(0, 0)
        back.beginFill(0x48B78B)
        back.drawRect(0, 0, game.world.width, game.world.height)
        sceneGroup.add(back)
        
        var background = game.add.tileSprite(0, -20, game.world.width, game.world.centerY + 88, "background")
        sceneGroup.add(background)
        
        var smallTile = game.add.tileSprite(0, game.world.centerY - 120, game.world.width, 100, "atlas.magicSpell", "smallRock")
        sceneGroup.add(smallTile)
        
        var bigTile = game.add.tileSprite(0, game.world.centerY - 20, game.world.width, 230, "bigRock")
        sceneGroup.add(bigTile)
       
        tiles = [background, smallTile, bigTile]
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
        particle.makeParticles('atlas.magicSpell',key);
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

				particle.makeParticles('atlas.magicSpell',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.magicSpell','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.magicSpell','smoke');
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
    
    function positionTimer(){
        
        timerGroup = game.add.group()
        timerGroup.scale.setTo(1.5)
        timerGroup.alpha = 0
        sceneGroup.add(timerGroup)
        
        var clock = game.add.image(0, 0, "atlas.time", "clock")
        clock.scale.setTo(0.7)
        timerGroup.add(clock)
        
        var timeBar = game.add.image(clock.position.x + 40, clock.position.y + 40, "atlas.time", "bar")
        timeBar.scale.setTo(8, 0.45)
        timerGroup.add(timeBar)
        timerGroup.timeBar = timeBar
        
        timerGroup.x = game.world.centerX - clock.width * 0.75
        timerGroup.y = clock.height * 0.3
   }
    
    function stopTimer(){
        
        timerGroup.tweenTiempo.stop()
        game.add.tween(timerGroup.timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        timerGroup.tweenTiempo = game.add.tween(timerGroup.timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        timerGroup.tweenTiempo.onComplete.add(function(){
            checkAnswer()
        })
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

        //sound.play("rightChoice")
        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function createPlayers(){
        
        spelletor = game.add.spine(game.world.width + 210, game.world.centerY - 70, "spelletor")
        spelletor.setAnimationByName(0, "idle", true)
        spelletor.setSkinByName("spelletor")
        sceneGroup.add(spelletor)
        
        dinamita = game.add.spine(-120, game.world.centerY + 110, "dinamita")
        dinamita.setAnimationByName(0, "run", true)
        dinamita.setSkinByName("normal")
        dinamita.scale.setTo(0.6)
        dinamita.spells = ["spring", "summer", "fall", "winter"]
        sceneGroup.add(dinamita)
    }
    
    function createButtons(){
        
        var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var board = game.add.sprite(game.world.centerX, game.world.height, "atlas.magicSpell", "board")
        board.anchor.setTo(0.5, 1)
        board.scale.setTo(1.2)
        board.width = game.world.width
        
        spellBoard = sceneGroup.create(game.world.centerX, game.world.height - board.height + 10, "atlas.magicSpell", "spellBoard")
        spellBoard.anchor.setTo(0.5, 1)
        spellBoard.scale.setTo(1.45)
        
        sceneGroup.add(board)
        
        slotsGroup = game.add.group()
        sceneGroup.add(slotsGroup)

        for(var i = 0; i < 9; i++){
            
            var slot = slotsGroup.create(-50, 0, "atlas.magicSpell", "slot")
            slot.anchor.setTo(0.5)
            slot.scale.setTo(1.2, 1.35)
            slot.alpha = 0
            
            var text = new Phaser.Text(sceneGroup.game, 0, 7, "", fontStyle)
            text.anchor.setTo(0.5)
            slot.addChild(text)
            slot.text = text
        }        
        
        runesGroup = game.add.group()
        sceneGroup.add(runesGroup)
        
        var pivot = 0.5
        var aux = 0
        var nextRow = 0
        
        for(var i = 0; i < 10; i++){
            
            var runes = runesGroup.create((board.centerX * pivot) + (10 * aux) - 20, board.centerY - 50  + (90 * nextRow), "atlas.magicSpell", "rune")
            runes.anchor.setTo(0.5)
            runes.scale.setTo(0.9)
            runes.alpha = 0
            runes.spawnX = runes.x
            runes.spawnY = runes.y
            runes.empty = true
            runes.inputEnabled = true
            runes.input.enableDrag()
            runes.events.onDragStop.add(setRune, this)
            
            var text = new Phaser.Text(sceneGroup.game, 0, 0, "", fontStyle)
            text.anchor.setTo(0.5)
            runes.addChild(text)
            runes.text = text
            
            pivot += 0.2
            aux++
            if(i === 4){
                pivot = 0.4
                aux = 0
                nextRow = 1
            }
        }        
        
        createOkBtn(board)
    }
    
    function setRune(obj){
    
        if(gameActive){
            
            for(var i = 0; i < ans.length; i++){
            
                if(checkOverlap(slotsGroup.children[i], obj) && obj.text.text !== ""){
                    sound.play("drag")
                    canClick = true
                    ok.children[1].tint = 0xffffff
                    slotsGroup.children[i].text.setText(obj.text.text)
                    break
                }
            }      
        }
        
        obj.x = obj.spawnX
        obj.y = obj.spawnY        
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
    
    function createOkBtn(bar){
        
        ok = game.add.group()
        sceneGroup.add(ok)
        
        var okOn = ok.create(bar.centerX * 1.65, bar.centerY + 40, "atlas.magicSpell", "okOn")
        okOn.anchor.setTo(0.5)
        okOn.alpha = 0
        
        var okOff = ok.create(bar.centerX * 1.65, bar.centerY + 40, "atlas.magicSpell", "okOff")
        okOff.anchor.setTo(0.5)
        okOff.inputEnabled = true
        okOff.tint = 0x707070
        okOff.events.onInputDown.add(function(){
            if(canClick){
                sound.play("pop")
                changeImage(0, ok)
                checkAnswer()
                okOff.tint = 0x707070
            }
        })
        okOff.events.onInputUp.add(function(){
            changeImage(1, ok)
        })
    }
    
    function checkAnswer(){
        
        if(gameActive){
            
            gameActive = false            
            canClick = false
            
            if(timeAttack)
                stopTimer()
            
            var feeling = ""

            for(var i = 0; i < ans.length; i++){
                feeling += slotsGroup.children[i].text.text
            }

            if(feeling === ans){
                sound.play("rightChoice")
                dinamita.setAnimationByName(0, "spell_" + dinamita.spells[rand], true)
                game.time.events.add(1000,function(){
                    sound.play("towercollapse")
                    spelletor.setAnimationByName(0, "lose", false)
                    particleCorrect.x = spelletor.x 
                    particleCorrect.y = spelletor.y - 100
                    particleCorrect.start(true, 1200, null, 15)
                    addCoin(spelletor)
                })
                if(timeAttack){
                    gameTime -= 1000
                }
            }
            else{
                game.time.events.add(1000,function(){
                    sound.play("punch2")
                    dinamita.setAnimationByName(0, "hit", false)
                    dinamita.addAnimationByName(0, "idle", true)
                    spelletor.setAnimationByName(0, "attack", false)
                    spelletor.addAnimationByName(0, "idle", true)
                    particleWrong.x = dinamita.x 
                    particleWrong.y = dinamita.y - 170
                    particleWrong.start(true, 1200, null, 7)
                    missPoint()
                })
            }
            
            if(pointsBar.number === 9){
                game.add.tween(timerGroup).to({alpha: 1}, 500, Phaser.Easing.linear, true)
                timeAttack = true
            }
            
            game.time.events.add(1000,function(){
                if(lives !== 0){
                    restoreSpell()
                    game.time.events.add(2000,function(){
                        if(feeling == ans){
                            dinamita.setAnimationByName(0, "run", true)
                            spelletor.x = game.world.width + 210
                            spelletor.alpha = 1
                            spelletor.setAnimationByName(0, "idle", true)
                            walkForward()
                        }
                        else{
                            initGame()
                        }
                    })
                }
                else{
                    dinamita.setAnimationByName(0, "lose", false)
                    dinamita.addAnimationByName(0, "losestille", true)
                }
            })
        }
    }
    
    function restoreSpell(){
        
        for(var i = 0; i < runesGroup.length; i++){
            runesGroup.children[i].text.setText("")
            runesGroup.children[i].empty = true
            game.add.tween(runesGroup.children[i]).to({alpha:0}, game.rnd.integerInRange(1000, 1500), Phaser.Easing.Cubic.InOut,true)
        }     
        
        for(var i = 0; i < slotsGroup.length; i++){
            var slot = slotsGroup.children[i]
            slot.text.setText("")
            game.add.tween(slot).to({alpha:0}, game.rnd.integerInRange(1000, 1500), Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
                slot.x = -50
            })
        }     
    }

    function initGame(){
        
        prepareRunes()
        prepareSpell()
       
        game.time.events.add(1000,function(){
            gameActive = true
            if(timeAttack)
                startTimer(gameTime)
        },this)
    }
    
    function prepareRunes(){
        
        rand = getRand()
        ans = spellWords[rand]
        
        var pos = []
        for(var i = 0; i < runesGroup.length; i++)
            pos[i] = i
        
        Phaser.ArrayUtils.shuffle(pos)
        
        for(var i = 0; i < ans.length; i++){
            runesGroup.children[pos[i]].empty = false
            runesGroup.children[pos[i]].text.setText(ans.charAt(i))
        }
        
        for(var i = 0; i < runesGroup.length; i++){
            if(runesGroup.children[i].empty && pointsBar.number > 4){
                runesGroup.children[i].empty = false
                runesGroup.children[i].text.setText(String.fromCharCode(game.rnd.integerInRange(65, 90)))
            }
            runesGroup.children[i].alpha = 1
            game.add.tween(runesGroup.children[i].scale).from({x:0, y:0}, game.rnd.integerInRange(1000, 1500), Phaser.Easing.Cubic.InOut,true)
        }
    }
    
    function prepareSpell(){
        
        if(localization.getLanguage() === 'ES'){
            var delta = 0.27
            var pivot = 0.3
        }
        else{
            var separation = [0.18, 0.27, 0.34, 0.19]
            var delta = separation[rand]
            var pivot
            rand === 0 ? pivot = 0.28 : pivot = 0.3
        }

        for(var i = 0; i < ans.length; i++){
            
            slotsGroup.children[i].x = spellBoard.centerX * pivot
            slotsGroup.children[i].y = spellBoard.centerY - 15
            pivot += delta
            
            slotsGroup.children[i].alpha = 1
            game.add.tween(slotsGroup.children[i].scale).from({x:0, y:0}, game.rnd.integerInRange(1000, 1500), Phaser.Easing.Cubic.InOut,true)
        }        
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, spellWords.length - 1)
        if(x === rand)
            return getRand()
        else
            return x     
    }
    
    function walkForward(){
        
        for(var i = 1; i <= tiles.length; i++){
            
            game.add.tween(tiles[i-1].tilePosition).to({x: tiles[i-1].tilePosition.x - (200 * i)}, 2000, Phaser.Easing.linear,true)
        }
        game.add.tween(spelletor).to({x:game.world.width - 180}, 2000, Phaser.Easing.linear,true).onComplete.add(function(){
            dinamita.setAnimationByName(0, "idle", true)
            initGame()
        })
    }
	
	return {
		
		assets: assets,
		name: "magicSpell",
		//update: update,
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
            positionTimer()
            createPlayers()
            createButtons()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()