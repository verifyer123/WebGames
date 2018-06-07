
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var calendrigon = function(){
    
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
                name: "atlas.calendrigon",
                json: "images/calendrigon/atlas.json",
                image: "images/calendrigon/atlas.png",
            },

        ],
        images: [

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "error",
				file: soundsPath + "error.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "stoneDoor",
				file: soundsPath + "stoneDoor.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "cut",
				file: soundsPath + "cut.mp3"},
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
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = false
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 7
	var indexGame
    var coin
    var overlayGroup
    var adventureSong
    var bottom, middle, top
    var numbersGroup
    var spinSpeed
    var numberSelect
    var click
    var radius
    var bottomFigures = [0, 7, 6, 3, 7, 4, 8, 5, 6, 8]
    var middleFigures = [0, 5, 7, 0, 4, 6, 8, 0, 0, 3, 6]
    var topFigures = [0, 5, 6, 8, 3, 0, 4, 7]
    var answer = [-1, -1, -1]
    var stopedDiscs
    var screen
    var hand
    var pivot
    var demoGame
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        numberSelect = -1
        click = false
        radius = 0
        stopedDiscs = 0
        pivot = 0
        demoGame = true
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.calendrigon','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.calendrigon','life_box')

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
        adventureSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
      
    function preload(){
        

		
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('adventureSong', soundsPath + 'songs/adventure.mp3');
        
		/*game.load.image('howTo',"images/calendrigon/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/calendrigon/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/calendrigon/introscreen.png")*/
        
        game.load.image('bottomPlatform',"images/calendrigon/bottomPlatform.png")
		game.load.image('bottom',"images/calendrigon/bottom.png")
		game.load.image('middlePlatform',"images/calendrigon/middlePlatform.png")
		game.load.image('middle',"images/calendrigon/middle.png")
		game.load.image('topPlatform',"images/calendrigon/topPlatform.png")
		game.load.image('top',"images/calendrigon/top.png")
        
        game.load.spine("caleidogon", "images/spines/caleidogon.json");
        
		game.load.image('tutorial_image',"images/calendrigon/tutorial_image.png")
        //loadType(gameIndex)

        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)

        
        /*var rect = new Phaser.Graphics(game)
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
                gameActive = true
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.calendrigon','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.calendrigon',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.calendrigon','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
        overlayGroup.y = -game.world.height
        //initGame()
        initTutorial()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        spinSpeed = 10000
        
        back = sceneGroup.create(game.world.centerX, game.world.centerY, "atlas.calendrigon", "gradient");
        back.anchor.setTo(0.5, 0.5)
        back.width = game.world.width
        back.height = game.world.height
        
        var calGroup = game.add.group()
        calGroup.x =  game.world.centerX
        calGroup.y = game.world.centerY
        calGroup.scale.setTo(0.8)
        sceneGroup.add(calGroup)
        
        var bottomPlat = calGroup.create(0, 0, "bottomPlatform")
        bottomPlat.anchor.setTo(0.5, 0.5)
        bottomPlat.scale.setTo(1.5)
        
        var arrow = calGroup.create(0, 450, 'atlas.calendrigon', "arrow")
        arrow.anchor.setTo(0.5, 0.5)
        arrow.scale.setTo(1, 0.65)
        
        bottom = calGroup.create(0, 0, "bottom")
        bottom.anchor.setTo(0.5, 0.5)
        bottom.angle = 0
        bottom.startAngle = bottom.angle
        bottom.spin = 36
        bottom.figures = 10
        bottom.arr = bottomFigures
        bottom.answer = 2
        bottom.stoped = false
        
        
        var middlePlat = calGroup.create(0, 0, "middlePlatform")
        middlePlat.anchor.setTo(0.5, 0.5)
        
        middle = calGroup.create(0, 0, "middle")
        middle.anchor.setTo(0.5, 0.5)
        middle.angle = 65.4
        middle.startAngle = middle.angle
        middle.spin = 32.7
        middle.figures = 11
        middle.arr = middleFigures
        middle.answer = 1
        middle.stoped = false
        
        var topPlat = calGroup.create(0, 0, "topPlatform")
        topPlat.anchor.setTo(0.5, 0.5)
        
        top = calGroup.create(0, 0, "top")
        top.anchor.setTo(0.5, 0.5)
        top.angle = 180
        top.startAngle = top.angle
        top.spin = 45
        top.figures = 8
        top.arr = topFigures
        top.answer = 0
        top.stoped = false
	}
    
    function discsTweens(){
        
         bottom.tween = game.add.tween(bottom).to({angle: 360}, spinSpeed, Phaser.Easing.linear, false)
            bottom.tween.onComplete.add(function(){bottom.tween.start()})
        
         middle.tween = game.add.tween(middle).to({angle: -360}, spinSpeed, Phaser.Easing.linear, false)
            middle.tween.onComplete.add(function(){middle.tween.start()})
        
          top.tween = game.add.tween(top).to({angle: 360}, spinSpeed, Phaser.Easing.linear, false)
            top.tween.onComplete.add(function(){top.tween.start()})
        
    }
	
	function update(){
        
        if(gameActive){
            if(game.input.activePointer.leftButton.isDown && !click){
                getRadius()
                click = true
            }
            if(game.input.activePointer.leftButton.isUp && click){
               click = false
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

        particle.makeParticles('atlas.calendrigon',key);
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

				particle.makeParticles('atlas.calendrigon',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.calendrigon','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.calendrigon','smoke');
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
    
    function initCaleidogon(){
        
        path = sceneGroup.create(game.world.centerX + 5, game.world.centerY + 30, 'atlas.calendrigon', 'light')
        path.anchor.setTo(0.5, 0)
        path.scale.setTo(0.8)
        
        var caleidogon = game.add.spine(game.world.centerX, game.world.centerY, "caleidogon")
        caleidogon.scale.setTo(0.7)
        caleidogon.setAnimationByName(0, "IDLE", true)
        caleidogon.setSkinByName("normal")
        sceneGroup.add(caleidogon)
        
        screen = sceneGroup.create(game.world.centerX , game.world.centerY - 150, 'atlas.calendrigon', 'screen')
        screen.anchor.setTo(0.5, 0.5)
        
        var fontStyle = {font: "85px VAGRounded", fontWeight: "bold", fill: "#900000", align: "center"}
        
        var name = new Phaser.Text(sceneGroup.game, 0, 10, '', fontStyle)
        name.anchor.setTo(0.5)
        //name.stroke = "#191A4F"
        //name.strokeThickness = 10
        screen.addChild(name)
        screen.text = name
    }
    
    function rotateDisc(disc, nextAngle){
        
        game.add.tween(disc).to({ angle: disc.angle + nextAngle}, 1000, Phaser.Easing.linear, true)
    }
    
    function initNumbersGroup(){
        
        numbersGroup = game.add.group()
        numbersGroup.x = game.world.centerX 
        numbersGroup.y = game.world.centerY - 150
        numbersGroup.scale.setTo(0.9)
        sceneGroup.add(numbersGroup)
        
        for(var i = 3; i < 9; i++){
            var number = numbersGroup.create(0, 0, 'atlas.calendrigon', ''+i) 
            number.anchor.setTo(0.5, 0.5)
            number.alpha = 0
        }
    }
    
    function initGame(){
        
        discsTweens()
        screen.growing =  game.add.tween(screen.scale).to({x:1.2, y:1.2},400,Phaser.Easing.linear,true, 0 , -1)
        screen.growing.yoyo(true, 0)
        numberSelect = getRand()
        screen.text.setText(numberSelect)
        sound.play("cut")
        
        /*game.add.tween(screen.scale).to({x:1, y:1},150,Phaser.Easing.linear,true).onComplete.add(function(){
            sound.play("cut")
            game.add.tween(screen.scale).to({x:0.8, y:0.8},150,Phaser.Easing.linear,true)
            
            numberSelect = getRand()
            screen.text.setText(numberSelect)
            //changeImage(numberSelect - 3, numbersGroup)
            discsTweens()
        })*/
        
        for(var i = 0; i < 3; i++){
            answer[i] = -1
        }
        
        game.time.events.add(310,function(){
            bottom.tween.start()
            middle.tween.start()
            top.tween.start()
            sound.play("stoneDoor")
            gameActive = true
        },this)
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(3, 8)
        if(x === numberSelect)
            return getRand()
        else
            return x     
    }
    
    function restartDiscs(){
        
        sound.play("stoneDoor")
        
        game.add.tween(bottom).to({ angle: bottom.startAngle}, 1000, Phaser.Easing.linear, true)
        game.add.tween(middle).to({ angle: middle.startAngle}, 1000, Phaser.Easing.linear, true)
        game.add.tween(top).to({ angle: top.startAngle}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
            stopedDiscs = 0
            bottom.stoped = false
            middle.stoped = false
            top.stoped = false
            initGame()
        })
    }
    
    function getRadius(){
        
        if(gameActive){
            
            var x = ((Math.pow((game.world.centerX - game.input.mousePointer.x), 2)) + (Math.pow((game.world.centerY - game.input.mousePointer.y), 2)))
            radius = Math.sqrt(x)
            if(demoGame)
                checkDemo()
            else
                stopDisc()
            
        }
        
    }
    
    function stopDisc(){
        
        if(gameActive){
            var fig

            sound.play("pop")
            if(radius < top.height * 0.4 && !top.stoped){
                sound.play("stoneDoor")
                top.tween.stop()
                fig = getFigure(top)
                game.add.tween(top).to({angle: fig}, 500, Phaser.Easing.linear, true)
                stopedDiscs += 1
                top.stoped = true
            }
            else if(radius > top.height * 0.4 && radius < middle.width * 0.4 && !middle.stoped){
                sound.play("stoneDoor")
                middle.tween.stop()
                fig = getFigure(middle)
                game.add.tween(middle).to({angle: fig}, 500, Phaser.Easing.linear, true)
                stopedDiscs += 1
                middle.stoped = true
            }
            else if(radius > middle.width * 0.4 && radius < bottom.width * 0.4 && !bottom.stoped){
                sound.play("stoneDoor")
                bottom.tween.stop()
                fig = getFigure(bottom)
                game.add.tween(bottom).to({angle: fig}, 500, Phaser.Easing.linear, true)
                stopedDiscs += 1
                bottom.stoped = true
            }

            if(stopedDiscs === 3){
                gameActive = false
                stopedDiscs += 1
                var correct = false
                var timer = 300
                var space = 140

                for(var i = 0; i < 3; i++){

                    giveOrTake(timer,space,i)
                    timer += 400
                    space += 130
                }

                for(var i = 0; i < 3; i++){
                    if(answer[i] === numberSelect)
                        correct = true
                    else{
                        correct = false
                        break
                    }
                }

                if(lives !== 0){
                    game.time.events.add(1300,function(){
                        if(correct){
                            addCoin()
                            if(pointsBar.number !== 0 && pointsBar.number % 3 === 0 && spinSpeed > 2000)
                                spinSpeed -= 1000
                        }
                        else{
                            missPoint()
                        }
                        restartDiscs()
                        screen.growing.stop()
                        screen.scale.setTo(1)
                        screen.text.setText("")
                    },this)
                }
            }
        }
    }
    
    function getFigure(disc){
        
        var initAng = disc.startAngle
        var spin = disc.spin
        var ang = disc.angle
        var figures = disc.figures
        var arr = disc.arr
        
        for(var s = 0; s < figures; s++){
            
            if(ang < initAng + (spin * 0.5) && ang > initAng - (spin * 0.5)){
                answer[disc.answer] = arr[s]
                return initAng
                break
            }
            else{
                initAng += spin
            }
            
            if(initAng > 180)
                initAng -= 360
        }
    }
    
    function giveOrTake(timer, space,i){
        
        game.time.events.add(timer,function(){
            
            if(answer[i] === numberSelect){
                sound.play("rightChoice")
                particleCorrect.x = game.world.centerX
                particleCorrect.y = game.world.centerY + space
                particleCorrect.start(true, 1200, null, 5)
            }
            else{
                sound.play("error")
                particleWrong.x = game.world.centerX
                particleWrong.y = game.world.centerY + space
                particleWrong.start(true, 1200, null, 5)
            }
        },this)
    }
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('wrong')
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
        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function initTutorial(){
        
        screen.growing =  game.add.tween(screen.scale).to({x:1.2, y:1.2},400,Phaser.Easing.linear,true, 0 , -1)
        screen.growing.yoyo(true, 0)
        numberSelect = 3
        screen.text.setText(numberSelect)
        sound.play("cut")
        
        game.time.events.add(310,function(){
            moveDisc(pivot)
        },this)
    }
    
    function moveDisc(opt){
        
        sound.play("stoneDoor")
        
        switch(opt){
            case 0:
                game.add.tween(top).to({angle: 0}, 2500, Phaser.Easing.linear, true).onComplete.add(function(){
                    hand.alpha = 1
                    hand.x = game.world.centerX
                    hand.y = game.world.centerY + 130
                    gameActive = true
                })
            break
            case 1:
                game.add.tween(middle).to({angle: 360}, 2500, Phaser.Easing.linear, true).onComplete.add(function(){
                    hand.alpha = 1
                    hand.x = game.world.centerX
                    hand.y = game.world.centerY + 240
                    gameActive = true
                })
            break
            case 2:
                 game.add.tween(bottom).to({angle: 108}, 2500, Phaser.Easing.linear, true).onComplete.add(function(){
                    hand.alpha = 1
                    hand.x = game.world.centerX
                    hand.y = game.world.centerY + 350
                    gameActive = true
                })
            break
        }
    }
    
    function checkDemo(){
        
        gameActive = false
        
        if(radius < top.height * 0.4 && pivot === 0){
            sound.play("stoneDoor")
            sound.play("rightChoice")
            pivot++
            game.time.events.add(310,function(){
                hand.alpha = 0
                moveDisc(pivot)
            },this)    
        }
        else if(radius > top.height * 0.4 && radius < middle.width * 0.4 && pivot === 1){
            sound.play("stoneDoor")
            sound.play("rightChoice")
            pivot++
            game.time.events.add(310,function(){
                hand.alpha = 0
                moveDisc(pivot)
            },this)  
            
        }
        else if(radius > middle.width * 0.4 && radius < bottom.width * 0.4 && pivot === 2){
            sound.play("stoneDoor")
            sound.play("rightChoice")
            demoGame = false
            screen.growing.stop()
            screen.scale.setTo(1)
            screen.text.setText("")
            game.time.events.add(800,function(){
                hand.destroy()
                initGame()
            },this)  
            
        }

    }
    
	return {
		
		assets: assets,
		name: "calendrigon",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
            game.input.mouse.capture = true
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            adventureSong = game.add.audio('adventureSong')
            game.sound.setDecodedCallback(adventureSong, function(){
                adventureSong.loopFull(0.6)
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
            initCaleidogon()
            initNumbersGroup()
            initCoin()
            createParticles()
			
			buttons.getButton(adventureSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()