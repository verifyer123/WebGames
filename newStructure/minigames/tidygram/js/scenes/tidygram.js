
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var tidygram = function(){
    
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
                name: "atlas.tidygram",
                json: "images/tidygram/atlas.json",
                image: "images/tidygram/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/tidygram/timeAtlas.json",
                image: "images/tidygram/timeAtlas.png",
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
				file:"images/tidygram/gametuto.png"
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
				name:"supplies",
				file:"images/spines/supplies.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 204
    var tutoGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var itemsGroup
    var shapesGroup
    var suppliesName
    var textBoard
    var bag 
    var closedBag
    var level
    var configuration
    var numPieces
    var timeAttack
    var gameTime
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        level = 1
        numPieces = 0
        timeAttack = false
        gameTime = 12000
        
        if(localization.getLanguage() === 'EN'){
            suppliesName = ["Calculadora", "Compás", "Borrador", "Pegamento", "Cuaderno", "Lápiz", "Transportador", "Escuadra", "Tijeras", "Sacapuntas"]
        }
        else{
            suppliesName = ["Calculator", "Compass", "Eraser", "Glue", "Notebook", "Pencil", "Protractor", "Set Square", "Scissors", "Sharpener"]
        }
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.tidygram','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.tidygram','life_box')

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
        
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.tidygram", "tile"))
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
        particle.makeParticles('atlas.tidygram',key);
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

				particle.makeParticles('atlas.tidygram',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.tidygram','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.tidygram','smoke');
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
        timerGroup.alpha = 0
        sceneGroup.add(timerGroup)
        
        var clock = timerGroup.create(game.world.centerX, 80, "atlas.time", "clock")
        clock.anchor.setTo(0.5)
        
        var timeBar = timerGroup.create(clock.centerX - 172, clock.centerY + 19, "atlas.time", "bar")
        timeBar.anchor.setTo(0, 0.5)
        timeBar.scale.setTo(11.5, 0.65)
        timerGroup.timeBar = timeBar
   }
    
    function stopTimer(){
        
        timerGroup.tweenTiempo.stop()
        game.add.tween(timerGroup.timeBar.scale).to({x:11.5}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        timerGroup.tweenTiempo = game.add.tween(timerGroup.timeBar.scale).to({x:0}, time, Phaser.Easing.Linear.Out, true, 100)
        timerGroup.tweenTiempo.onComplete.add(function(){
            win(false)
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
    
    function createBag(){
        
        bag = sceneGroup.create(game.world.centerX, game.world.centerY + 15, "atlas.tidygram", "bagOpen0")
        bag.anchor.setTo(0.5)
        bag.scale.setTo(0.7)
        bag.alpha = 0
        
        shapesGroup = game.add.group()
        shapesGroup.supplies = ["calculator", "compass", "eraser", "glue", "notebook", "pencil", "protractor", "ruler", "scissors", "sharpener"]
        sceneGroup.add(shapesGroup)
        
        for(var i = 0; i < 10; i++){
            
            var shape = shapesGroup.create(-100, 0, "atlas.tidygram", "base" + i)
            shape.anchor.setTo(0.5)
            shape.scale.setTo(0.6)
            shape.empty = true
            shape.tag = i
            shape.alpha = 0
            
            var anim = game.add.spine(0, 135, "supplies")
            anim.alpha = 0
            anim.setAnimationByName(0, shapesGroup.supplies[i], true)
            anim.setSkinByName("normal")
            shape.addChild(anim)
            shape.anim = anim
        }
        
        shapesGroup.children[1].scale.setTo(0.7)
        
        shapesGroup.children[2].anim.x = 50
        shapesGroup.children[2].anim.y = 145
        
        shapesGroup.children[3].scale.setTo(0.35)
        shapesGroup.children[3].anim.y = 250 
        
        shapesGroup.children[4].anim.x = -50
        shapesGroup.children[4].anim.y = 150
        
        shapesGroup.children[5].anim.x = -55
        shapesGroup.children[5].anim.y = 145
        
        shapesGroup.children[6].scale.setTo(0.7)
        shapesGroup.children[6].anim.y = 120
        
        shapesGroup.children[7].anim.x = -50
        shapesGroup.children[7].anim.y = 225
        
        shapesGroup.children[8].scale.setTo(0.7)
        
        shapesGroup.children[8].scale.setTo(0.7)
        
        shapesGroup.children[9].scale.setTo(0.75)
        shapesGroup.children[9].anim.x = -50
        
        closedBag = sceneGroup.create(bag.centerX, bag.centerY, "atlas.tidygram", "bagClosed0")
        closedBag.anchor.setTo(0.5)
        closedBag.scale.setTo(0.7)
        closedBag.alpha = 0
        
        createBagsPositions()
    }
    
    function createBagsPositions(){
        
        var config = []
        
        config[config.length] = [{item: 0, x: bag.centerX + 20, y: bag.centerY + 100, angle: 0, pos: 0.31},
                                 {item: 1, x: -125, y: -10, angle: 180, pos: 100},
                                 {item: 3, x: 20,  y: -150, angle: 0, pos: 180},
                                 {item: 5, x: -90, y: -150, angle: 0, pos: 260},
                                 {item: 7, x: 120, y: -80, angle: 0, pos: 340}]
        
        config[config.length] = [{item: 4, x: bag.centerX + 55, y: bag.centerY - 55, angle: 0, pos: 0.3},
                                 {item: 2, x: -125, y: 155, angle: 0, pos: 90},
                                 {item: 5, x: 50, y: 155, angle: 0, pos: 180},
                                 {item: 8, x: -38, y: 145, angle: 0, pos: 270},
                                 {item: 9, x: -160, y: 10, angle: 180, pos: 345}]
        
        config[config.length] = [{item: 6, x: bag.centerX + 15, y: bag.centerY - 55, angle: 0, pos: 0.35},
                                 {item: 2, x: 90, y: 0, angle: 0, pos: 60},
                                 {item: 3, x: 25, y: 150, angle: 0, pos: 135},
                                 {item: 5, x: -90, y: 0, angle: 0, pos: 210},
                                 {item: 8, x: -75, y: 150, angle: 0, pos: 300},
                                 {item: 9, x: 120, y: 150, angle: 0, pos: 370}]
        
        config[config.length] = [{item: 0, x: bag.centerX, y: bag.centerY - 50, angle: 0,  pos: 0.3},
                                 {item: 1, x: 130, y: 0, angle: 0, pos: 100},
                                 {item: 4, x: -30, y: 150, angle: 180, pos: 200},
                                 {item: 9, x: 130, y: 145, angle: 0, pos: 320}]
        
        //bag 1
        
        config[config.length] = [{item: 2, x: bag.centerX + 90, y: bag.centerY - 60, angle: 0, pos: 0.32},
                                 {item: 5, x: 0, y: 140, angle: 0, pos: 100},
                                 {item: 6, x: -95, y: 0, angle: 0, pos: 180},
                                 {item: 7, x: -215, y: 70, angle: 180, pos: 260},
                                 {item: 8, x: -95, y: 145, angle: 0, pos: 320}]
        
        config[config.length] = [{item: 5, x: bag.centerX - 85, y: bag.centerY - 70, angle: 180, pos: 0.35},
                                 {item: 1, x: 200, y: 160, angle: 60, pos: 80},
                                 {item: 2, x: 0, y: 150, angle: 0, pos: 130},
                                 {item: 3, x: 163, y: 80, angle: 90, pos: 210},
                                 {item: 7, x: 45, y: 75, angle: 180, pos: 280},
                                 {item: 9, x: 200, y: 0, angle: 300, pos: 340}]
        
        config[config.length] = [{item: 0, x: bag.centerX - 10, y: bag.centerY - 70, angle: 0, pos: 0.3},
                                 {item: 7, x: -120, y: 75, angle: 180, pos: 100},
                                 {item: 1, x: 130, y: 0, angle: 0, pos: 170},
                                 {item: 8, x: 0, y: 150, angle: 90, pos: 230},
                                 {item: 9, x: 125, y: 150, angle: 0, pos: 320}]
        
        config[config.length] = [{item: 4, x: bag.centerX - 45, y: bag.centerY + 85, angle: 180, pos: 0.28},
                                 {item: 1, x: 165, y: -150, angle: 0, pos: 110},
                                 {item: 3, x: 30, y: -180, angle: -90, pos: 180},
                                 {item: 7, x: -10, y: -110, angle: -90, pos: 250},
                                 {item: 9, x: 165, y: -5, angle: 0, pos: 320}]
        
        //bag 2
        
        config[config.length] = [{item: 4, x: bag.centerX - 35, y: bag.centerY + 250, angle: 180, pos: 0.33},
                                 {item: 2, x: -50, y: -315, angle: 0, pos: 80},
                                 {item: 3, x: 30, y: -180, angle: -90, pos: 155},
                                 {item: 5, x: 140, y: -315, angle: 0, pos: 245},
                                 {item: 6, x: 45, y: -310, angle: 180, pos: 355},
                                 {item: 7, x: 160, y: -80, angle: 0, pos: 305},
                                 {item: 9, x: 0, y: -120, angle: -90, pos: 210}]
        
        config[config.length] = [{item: 6, x: bag.centerX + 15, y: bag.centerY + 95, angle: 0, pos: 0.39},
                                 {item: 1, x: -125, y: -155, angle: 180, pos: 75},
                                 {item: 2, x: -5, y: -150, angle: 0, pos: 115},
                                 {item: 3, x: 20, y: 150, angle: 0, pos: 190},
                                 {item: 5, x: -95, y: 0, angle: 0, pos: 285},
                                 {item: 7, x: 120, y: 75, angle: 0, pos: 345},
                                 {item: 8, x: -80, y: 150, angle: 0, pos: 395},
                                 {item: 9, x: 115, y: -155, angle: 0, pos: 245}]
        
        config[config.length] = [{item: 6, x: bag.centerX + 10, y: bag.centerY + 95, angle: 0, pos: 0.26},
                                 {item: 0, x: 20, y: -155, angle: 0, pos: 98},
                                 {item: 1, x: -110, y: -155, angle: 180, pos: 180},
                                 {item: 2, x: 90, y: 0, angle: 0, pos: 355},
                                 {item: 4, x: -45, y: 150, angle: 180, pos: 278},
                                 {item: 5, x: -90, y: 0, angle: 0, pos: -55},
                                 {item: 9, x: 120, y: 150, angle: 0, pos: -90}]
        
        config[config.length] = [{item: 0, x: bag.centerX + 15, y: bag.centerY + 95, angle: 0, pos: 0.35},
                                 {item: 4, x: -40, y: 155, angle: 180, pos: 125},
                                 {item: 5, x: 70, y: -150, angle: 0, pos: 270},
                                 {item: 7, x: 120, y: 75, angle: 0, pos: 330},
                                 {item: 8, x: -45, y: -150, angle: 0, pos: 210},
                                 {item: 9, x: -125, y: 10, angle: 180, pos: 375}]
        
        bag.config = new Array(3)
        for(var i = 0; i < 3; i++){
            bag.config[i] = new Array(4)
        }
        
        var aux = 0
        var pivot = 0
        
        for(var i = 0; i < config.length; i++){
            
            bag.config[aux][pivot] = config[i]
            pivot++
            if(i === 3 || i === 7){
                aux++
                pivot = 0
            }
        }
    }
    
    function createBoards(){
        
        var board = sceneGroup.create(game.world.centerX, game.world.height - 15, "atlas.tidygram", "board")
        board.anchor.setTo(0.5, 1)
        
        itemsGroup = game.add.group()
        itemsGroup.board = board
        sceneGroup.add(itemsGroup)
    
        for(var i = 0; i < 10; i++){
            
            var item = itemsGroup.create(-50, board.centerY, "atlas.tidygram", "item" + i)
            item.anchor.setTo(0.5)
            item.originX = item.x
            item.originY = item.y
            item.tag = i
            item.alpha = 0
            item.inputEnabled = true
            item.input.enableDrag()
            item.events.onDragStart.add(changeText, this)
            item.events.onDragStop.add(placeItem, this)
        }
        
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#a972a9", align: "center"}
        
        textBoard = sceneGroup.create(game.world.centerX, 170, "atlas.tidygram", "textBoard")
        textBoard.anchor.setTo(0.5)
        
        var name = new Phaser.Text(sceneGroup.game, 0, 5, "", fontStyle)
        name.anchor.setTo(0.5)
        textBoard.addChild(name)
        textBoard.text = name
    }
    
    function placeItem(obj){
        
        if(gameActive){
            
            var list = []
            var over = false

            for(var i = 0; i < shapesGroup.length; i++){

                if(checkOverlap(obj, shapesGroup.children[i]) && shapesGroup.children[i].empty){
                    list[list.length] = shapesGroup.children[i]
                    over = true
                }        
            }

            if(over){
                var shape

                if(list.length === 1){
                    shape = list[0]
                }
                else{
                    var aux = list[0]

                    for(var i = 1; i < list.length; i++){

                        if(getIntersections(aux, obj).volume < getIntersections(list[i], obj).volume){
                            aux = list[i]
                        }
                    }
                    shape = aux
                }

                if(obj.tag === shape.tag){
                    shape.anim.alpha = 1
                    shape.empty = false
                    obj.alpha = 0
                    numPieces++
                    sound.play("rightChoice")
                }
                else{
                    sound.play("wrong")
                }
            }

            if(numPieces === configuration.length){
                win(true)
            }
        }
            
        obj.x = obj.originX
        obj.y = obj.originY
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds()
        var boundsB = spriteB.getBounds()

        return Phaser.Rectangle.intersects(boundsA , boundsB )
    }
    
    function getIntersections(objA, objB){
        
        var boundA = objA.getBounds()
        var boundB = objB.getBounds()
        
        return Phaser.Rectangle.intersection(boundA , boundB )
    }
    
    function changeText(obj){
        
        if(gameActive && obj.alpha !== 0)
            game.add.tween(textBoard.text).to({alpha: 0}, 100, Phaser.Easing.linear, true).onComplete.add(function(){
                textBoard.text.setText(suppliesName[obj.tag])
                game.add.tween(textBoard.text).to({alpha: 1}, 100, Phaser.Easing.linear, true)
            })
    }
    
    function win(ans){
        
        gameActive = false
        if(timeAttack)
            stopTimer()
        
        if(ans){
            addCoin(game.world)
            fadeInOut(closedBag, 200, 1)
            fadeInOut(bag, 200, 0)
            game.add.tween(closedBag).to({angle: -30}, 300, Phaser.Easing.linear, true).onComplete.add(function(){
                game.add.tween(closedBag).to({angle: 30}, 600, Phaser.Easing.linear, true, 0, 4, true)
                fadeInOut(closedBag, 1500, 0)
            })
            if(timeAttack){
                gameTime -= 500
            }
        }
        else{
            missPoint(game.world)
            for(var i = 0; i < configuration.length; i++){
                fadeInOut(itemsGroup.children[configuration[i].item], 800, 0)
                fadeInOut(shapesGroup.children[configuration[i].item], 800, 0)
            }
            fadeInOut(bag, 800, 0)
        }
        
        if(pointsBar.number === 8){
            level = 2
        }
        
        if(pointsBar.number === 12){
            timeAttack = true
            game.add.tween(timerGroup).to({alpha: 1}, 300, Phaser.Easing.linear, true)
        }
        
        if(lives !== 0){
            game.time.events.add(600,function(){
                restarAssets()
            })
        }
    }
    
    function restarAssets(){
        
        for(var i = 0; i < shapesGroup.length; i++){
              shapesGroup.children[i].x = -100
              shapesGroup.children[i].empty = true
              shapesGroup.children[i].alpha = 0
              shapesGroup.children[i].anim.alpha = 0
         }
        
        for(var i = 0; i < itemsGroup.length; i++){
              itemsGroup.children[i].x = -100
              itemsGroup.children[i].alpha = 0
        }
        
        game.add.tween(textBoard.text).to({alpha: 0}, 100, Phaser.Easing.linear, true)
        numPieces = 0
        
        game.time.events.add(2000,function(){
            initGame()
        })
    }
    
    function initGame(){
        
        var delay = setUpConfig()
        
        game.time.events.add(delay,function(){
            gameActive = true
            if(timeAttack)
                startTimer(gameTime)
        })
    }
    
    function setUpConfig(){
        
        var rand = game.rnd.integerInRange(0, level)
        var opt = game.rnd.integerInRange(0, 3)
        configuration = bag.config[rand][opt]
        
        bag.loadTexture("atlas.tidygram", "bagOpen" + rand)
        closedBag.loadTexture("atlas.tidygram", "bagClosed" + rand)
        
        itemsGroup.children[configuration[0].item].x = itemsGroup.board.x - itemsGroup.board.width * configuration[0].pos
        itemsGroup.children[configuration[0].item].originX = itemsGroup.children[configuration[0].item].x
        
        var itemPivot = itemsGroup.children[configuration[0].item]
        
        for(var i = 1; i < configuration.length; i++){
            itemsGroup.children[configuration[i].item].x = itemPivot.x + configuration[i].pos
            itemsGroup.children[configuration[i].item].originX = itemsGroup.children[configuration[i].item].x
        }
        
        shapesGroup.children[configuration[0].item].x = configuration[0].x
        shapesGroup.children[configuration[0].item].y = configuration[0].y
        shapesGroup.children[configuration[0].item].angle = configuration[0].angle
        
        var pivot = shapesGroup.children[configuration[0].item]
        
        for(var i = 1; i < configuration.length; i++){
            
            shapesGroup.children[configuration[i].item].x = configuration[i].x + pivot.x
            shapesGroup.children[configuration[i].item].y = configuration[i].y + pivot.y
            shapesGroup.children[configuration[i].item].angle = configuration[i].angle
        }
        
        return showAssets()
    }
    
    function showAssets(){
        
        var delay = 200
        
        fadeInOut(bag, delay, 1)
        
        delay += 200
        
        for(var i = 0; i < configuration.length; i++){
            popObject(shapesGroup.children[configuration[i].item], delay)
            delay += 250
        }
        
        delay += 300
        
        for(var i = 0; i < configuration.length; i++){
            fadeInOut(itemsGroup.children[configuration[i].item], delay, 1)
        }
        
        return delay + 200
    }
    
    function fadeInOut(obj, delay, fade){
        
        game.time.events.add(delay,function(){
            game.add.tween(obj).to({alpha: fade}, 300, Phaser.Easing.linear, true)
        })
    }
    
    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x:0, y:0},250,Phaser.Easing.linear,true)
        })
    }
	
	return {
		
		assets: assets,
		name: "tidygram",
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
            positionTimer()
            createBag()
            createBoards()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()