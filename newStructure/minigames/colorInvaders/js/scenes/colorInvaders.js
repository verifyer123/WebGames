
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var colorInvaders = function(){
    
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
                name: "atlas.colorInvaders",
                json: "images/colorInvaders/atlas.json",
                image: "images/colorInvaders/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/colorInvaders/timeAtlas.json",
                image: "images/colorInvaders/timeAtlas.png",
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
				file:"images/colorInvaders/gametuto.png"
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
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "throw",
				file: soundsPath + "throw.mp3"},
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
            {   name: 'colorSong',
                file: soundsPath + 'songs/shooting_stars.mp3'
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
				name:"aliens",
				file:"images/spines/aliens.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 177
    var timerGroup
    var tutoGroup
    var colorSong
    var coin
    var hand
    var tile
    var colorsGroup
    var buttonsGroup
    var aliensGroup
    var colorsText = []
    var rand
    var theOne
    var timeAttack
    var timer
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        rand = -1
        theOne = -1
        timeAttack = false
        timer = 5000
        
        if(localization.getLanguage() === 'EN'){
            colorsText = ['Blue', 'Green', 'Orange', 'Pink', 'Purple', 'Red', 'Yellow']
        }
        else{
            colorsText = ['Azul', 'Verde', 'Naranja', 'Rosa', 'Purpura', 'Rojo', 'Amarillo']
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.colorInvaders','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.colorInvaders','life_box')

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
        colorSong.stop()
        		
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
            
        tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.colorInvaders", "tile")
        sceneGroup.add(tile)
    }

	function update(){
        
        tile.tilePosition.x += 2
        tile.tilePosition.y += 2
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
        particle.makeParticles('atlas.colorInvaders',key);
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

				particle.makeParticles('atlas.colorInvaders',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.colorInvaders','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.colorInvaders','smoke');
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
        timerGroup.y = clock.height * 0.6
   }
    
    function stopTimer(){
        
        timerGroup.tweenTiempo.stop()
        game.add.tween(timerGroup.timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        timerGroup.tweenTiempo = game.add.tween(timerGroup.timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        timerGroup.tweenTiempo.onComplete.add(function(){
            stopTimer()
            IChoseYou()
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

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function colorsInTheWind(){
        
        var fontStyle = {font: "70px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        colorsGroup = game.add.group()
        sceneGroup.add(colorsGroup)
        
        var container = colorsGroup.create(game.world.centerX, 250, "atlas.colorInvaders", "container")
        container.anchor.setTo(0.5)
        
        var name = new Phaser.Text(sceneGroup.game, container.x, container.y + 5, '', fontStyle)
        name.anchor.setTo(0.5)
        //name.setText('')
        name.stroke = "#FFFFFF"
        name.strokeThickness = 0
        colorsGroup.add(name)
        colorsGroup.text = name
        
        var colorName = [ "#00FFFF", "#00BB33", "#FF6600", "#FF4499", "#880088", "#BB2222", "#CCCC00"]
        colorsGroup.colorName = colorName
    }
    
    function prometeus(){
        
        buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        aliensGroup = game.add.group()
        sceneGroup.add(aliensGroup)
        
        var pivot = -250
        
        for(var t = 0; t < 3; t++)
        {
            var box = game.add.graphics(game.world.centerX + pivot, game.world.centerY - 100)
            box.beginFill(0xFF3300)
            box.drawRect(0, 0, 150, 200)
            box.alpha = 0
            box.inputEnabled = true
            box.correct = false
            box.events.onInputDown.add(IChoseYou, this)
            buttonsGroup.add(box)
            
            var al = game.add.spine(0, 0, "aliens")
            al.setAnimationByName(0, "IDLE", true)
            al.setSkinByName("blue1")
            aliensGroup.add(al)
            
            pivot = 100
        }
        
        box.x = game.world.centerX - 75
        box.y = game.world.centerY + 150
        
        aliensGroup.children[0].originX = -150
        aliensGroup.children[0].originY = 300
        
        aliensGroup.children[1].originX = game.world.width + 150
        aliensGroup.children[1].originY = 300
        
        aliensGroup.children[2].originX = game.world.centerX
        aliensGroup.children[2].originY = game.world.height + 300
        
        for(var i = 0; i < aliensGroup.length; i++){
            
            aliensGroup.children[i].x = aliensGroup.children[i].originX
            aliensGroup.children[i].y = aliensGroup.children[i].originY 
            
            aliensGroup.children[i].boxX = buttonsGroup.children[i].centerX
            aliensGroup.children[i].boxY = buttonsGroup.children[i].centerY + 50
        }
        
        var skins = ['blue', 'green', 'orange', 'pink', 'purple', 'red', 'yellow']
        aliensGroup.skins = skins
    }
    
    function IChoseYou(btn){
        
        if(gameActive){
            
            gameActive = false
            sound.play("pop")
            
            if(timeAttack){
                stopTimer()
                timer -= 200
            }
            
            if(btn === undefined){
                btn = buttonsGroup.children[theOne]
                btn.correct = false
            }
            
            if(btn.correct){
                
                sound.play("rightChoice")
                addCoin(btn)
                particleCorrect.x = btn.centerX
                particleCorrect.y = btn.centerY
                particleCorrect.start(true, 1200, null, 10)
            }
            else{
                missPoint()
                particleWrong.x = btn.centerX
                particleWrong.y = btn.centerY
                particleWrong.start(true, 1200, null, 10)
            }
               
            if(pointsBar.number === 20){
                game.add.tween(timerGroup).to({alpha: 1}, 300, Phaser.Easing.linear, true)
                timeAttack = true
            }

            game.time.events.add(500,function(){
                if(lives !== 0){
                   sound.play("throw")
                    for(var i = 0; i < aliensGroup.length; i++){

                        if(i !== theOne){
                            game.add.tween(aliensGroup.children[i]).to({x: aliensGroup.children[i].originX, y: aliensGroup.children[i].originY}, 1000, Phaser.Easing.linear, true)
                        }
                        else{
                            var aux = i
                        }
                    }

                    game.time.events.add(1000,function(){
                        sound.play("throw")
                        game.add.tween(aliensGroup.children[aux]).to({x: aliensGroup.children[aux].originX, y: aliensGroup.children[aux].originY}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                            colorsGroup.text.setText("")
                            game.time.events.add(500,function(){
                                initGame()
                            },this)
                        })
                    },this)
                }
            },this)
        }
    }
    
    function initGame(){
        
        rand = getRand()
        placeAliens()
        
        game.time.events.add(1600,function(){
            colorsGroup.text.setText(colorsText[rand])
            if(pointsBar.number > 9){
                colorsGroup.text.strokeThickness = 10
                colorsGroup.text.fill = colorsGroup.colorName[game.rnd.integerInRange(0, colorsText.length-1)]
            }
            sound.play("cut")
            game.add.tween(colorsGroup.text.scale).from({ y:0}, 200,Phaser.Easing.linear,true)
            gameActive = true
            if(timeAttack)
                startTimer(timer)
        },this)
        
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, colorsText.length-1)
        if(x === rand)
            return getRand()
        else
            return x     
    }
    
    function placeAliens(){
        
        theOne = game.rnd.integerInRange(0, 2)
        
        buttonsGroup.setAll("correct", false)
        buttonsGroup.children[theOne].correct = true
        
        for(var i = 0; i < aliensGroup.length; i++){
            
            var alienColor = getRandColor(rand)
            if(i !== theOne){
                aliensGroup.children[i].setSkinByName(aliensGroup.skins[alienColor] + game.rnd.integerInRange(1, 2))
            }
            else{
                aliensGroup.children[i].setSkinByName(aliensGroup.skins[rand] + game.rnd.integerInRange(1, 2))
            }
        }
        
        game.time.events.add(500,function(){
            sound.play("whoosh")
            for(var i = 0; i < aliensGroup.length; i++){
                
                game.add.tween(aliensGroup.children[i]).to({x: aliensGroup.children[i].boxX, y: aliensGroup.children[i].boxY}, 1000, Phaser.Easing.linear, true)
            }
        },this)
    }
    
    function getRandColor(color){
        var x = game.rnd.integerInRange(0, aliensGroup.skins.length-1)
        if(x === color)
            return getRandColor(color)
        else
            return x   
    }
	
	return {
		
		assets: assets,
		name: "colorInvaders",
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
                        			
            /*colorSong = game.add.audio('colorSong')
            game.sound.setDecodedCallback(colorSong, function(){
                colorSong.loopFull(0.6)
            }, this);*/
            
            initialize()
            colorSong = sound.play("colorSong", {loop:true, volume:0.6})
            
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
            colorsInTheWind()
            prometeus()
            initCoin()
            createParticles()
			
			buttons.getButton(colorSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()