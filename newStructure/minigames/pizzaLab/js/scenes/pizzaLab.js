
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var pizzaLab = function(){
    
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
                name: "atlas.pizzaLab",
                json: "images/pizzaLab/atlas.json",
                image: "images/pizzaLab/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/pizzaLab/timeAtlas.json",
                image: "images/pizzaLab/timeAtlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        images: [

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
            {	name: "robotBeep",
				file: soundsPath + "robotBeep.mp3"},
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 140
    var overlayGroup
    var pizzaSong
    var coin
    var ingredients = ['jam', 'mush', 'pepe', 'pepper', 'pineapple']
    var val = [1,2,3,4,5]
    var ingredientGroup
    var pizzaGroup
    var pizzaCooked
    var rnd
    var oof
    var leftDoor, rigthDoor
    var timerGroup, tweenTiempo, time
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        rnd = -1
        time = 7000
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.pizzaLab','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.pizzaLab','life_box')

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
        pizzaSong.stop()
        		
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
        
        game.load.audio('pizzaSong', soundsPath + 'songs/marioSong.mp3');
        
        game.load.image('tutorial_image',"images/pizzaLab/gametuto.png")
		game.load.image('background',"images/pizzaLab/background.png")
		game.load.image('machine',"images/pizzaLab/machine.png")
        game.load.spritesheet("coin", 'images/spines/coin.png', 122, 123, 12)
		
        game.load.spine("oof", "images/spines/oof.json")
        
		console.log(localization.getLanguage() + ' language')
        
        loadType(gameIndex)
        
    }
    
    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        createTutorialGif(tutoGroup,onClickPlay)
    }
    
    function onClickPlay(rect) {
        //rect.inputEnabled = false
        sound.play("pop")

        game.add.tween(tutoGroup).to({alpha:0},500,Phaser.Easing.Linear.none,true).onComplete.add(function(){

            tutoGroup.y = -game.world.height
            initGame()
            })
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
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.pizzaLab','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.pizzaLab',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.pizzaLab','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        var back = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background')
        sceneGroup.add(back)
        
        var floor = game.add.tileSprite(0, game.world.centerY + 50, game.world.width, game.world.height, 'atlas.pizzaLab', 'tile')
        sceneGroup.add(floor)
        
        var bar = sceneGroup.create(0, 71, 'atlas.pizzaLab', 'bar')
        bar.width = game.world.width
        bar.height *= 0.25
        
        var machine = sceneGroup.create(game.world.centerX, 100, 'machine')
        machine.anchor.setTo(0.5, 0)
        machine.scale.setTo(0.83)
        
        leftDoor = sceneGroup.create(game.world.centerX + 5, machine.centerY + 90, 'atlas.pizzaLab', 'doorLeft')
        leftDoor.anchor.setTo(1, 0)
        leftDoor.scale.setTo(0.83)
        
        rigthDoor = sceneGroup.create(game.world.centerX + 7, machine.centerY + 90, 'atlas.pizzaLab', 'doorRight')
        rigthDoor.anchor.setTo(0, 0)
        rigthDoor.scale.setTo(0.83)
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
        particle.makeParticles('atlas.pizzaLab',key);
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

				particle.makeParticles('atlas.pizzaLab',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.pizzaLab','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.pizzaLab','smoke');
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
        clock.alpha = 1
        timerGroup.add(clock)
        
        timeBar = game.add.image(clock.position.x + 40, clock.position.y + 40, "atlas.time", "bar")
        timeBar.scale.setTo(8, 0.45)
        timeBar.alpha = 1
        timerGroup.add(timeBar)
        
        timerGroup.x = game.world.centerX - clock.width * 0.75
        timerGroup.y = clock.height * 0.35
   }
    
    function stopTimer(){
        
        tweenTiempo.stop()
        tweenTiempo = game.add.tween(timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        tweenTiempo = game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        tweenTiempo.onComplete.add(function(){
            stopTimer()
            win(false)
        })
    }
	
	function initCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       //coin.scale.setTo(0.5)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0

    }

    function addCoin(){
        
        coin.x = game.world.centerX
        coin.y = game.world.centerY
        timer = 300

        game.add.tween(coin).to({alpha:1}, timer, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, timer + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function cheffOof(){
        
        oof = game.add.spine(game.world.centerX - 30, game.world.height - 20, "oof")
        oof.setAnimationByName(0, "IDLE", true)
        oof.setSkinByName("normal")
        oof.scale.setTo(0.3)
        sceneGroup.add(oof)
    }
    
    function barBtns(){
        
        var bar = sceneGroup.create(0, game.world.centerY + 150, 'atlas.pizzaLab', 'bar')
        bar.width = game.world.width
        
        ingredientGroup = game.add.group()
        sceneGroup.add(ingredientGroup)
        
        var piv = -2
        
        for(var b = 0; b < ingredients.length; b++){
            
            var ingBtn = game.add.group()
            ingBtn.x = bar.centerX + (piv * 100)
            ingBtn.y = bar.centerY - 10
            ingBtn.turnOn = false
            ingBtn.val = b + 1
            ingredientGroup.add(ingBtn)
            
            var btnOff = ingBtn.create(0, 0, 'atlas.pizzaLab', ingredients[b] + 'Off') //0
            btnOff.anchor.setTo(0.5) 
            btnOff.inputEnabled = true
            btnOff.events.onInputDown.add(btnPressed, this)   
            btnOff.events.onInputUp.add(btnRelased, this) 
            
            var btnOn = ingBtn.create(0, 0, 'atlas.pizzaLab', ingredients[b] + 'On') //1
            btnOn.anchor.setTo(0.5)
            btnOn.alpha = 0
            
            var bulbOff = ingBtn.create(0, -56, 'atlas.pizzaLab', 'bulbOff') //2
            bulbOff.anchor.setTo(0.5, 1)
            
            var bulbOn = ingBtn.create(0, -50, 'atlas.pizzaLab', 'bulbOn') //3
            bulbOn.anchor.setTo(0.5, 1)
            bulbOn.alpha = 0
            
            var numOff = ingBtn.create(0, -110, 'atlas.pizzaLab', 'Off') //4
            numOff.anchor.setTo(0.5, 1)
            
            var numOn = ingBtn.create(0, -110, 'atlas.pizzaLab', 'On') //5
            numOn.anchor.setTo(0.5, 1)
            numOn.alpha = 0
            
            piv++
        }
    }
    
    function btnPressed(btn){
        
        if(gameActive){
            sound.play('pop')
            btn.parent.children[0].alpha = 0
            btn.parent.children[1].alpha = 1
            
            if(btn.parent.turnOn){
                btn.parent.turnOn = false
                btn.parent.children[2].alpha = 1
                btn.parent.children[3].alpha = 0
                btn.parent.children[4].alpha = 1
                btn.parent.children[5].alpha = 0
            }
            else{
                btn.parent.turnOn = true
                btn.parent.children[2].alpha = 0
                btn.parent.children[3].alpha = 1
                btn.parent.children[4].alpha = 0
                btn.parent.children[5].alpha = 1
            }
        }
    }
    
    function btnRelased(btn){
        
        btn.parent.children[0].alpha = 1
        btn.parent.children[1].alpha = 0
    }
    
    function okBtn(){
        
        var ok = game.add.group()
        ok.x = game.world.centerX + 250
        ok.y = game.world.height - 30
        sceneGroup.add(ok)
        
        var okOff = ok.create(0, 0, 'atlas.pizzaLab', 'okOff')
        okOff.anchor.setTo(1) 
        okOff.inputEnabled = true
        okOff.events.onInputDown.add(okPressed, this)   
        okOff.events.onInputUp.add(okRelased, this) 
        
        var okOn = ok.create(0, 0, 'atlas.pizzaLab', 'okOn')
        okOn.anchor.setTo(1) 
        okOn.alpha = 0
    }
    
    function okPressed(btn){
        
        var ans = false
        
        if(gameActive){
            sound.play('pop')
            btn.parent.children[0].alpha = 0
            btn.parent.children[1].alpha = 1
            
            if(tweenTiempo !== undefined)
                stopTimer()
            
            for(var c = 0; c < ingredientGroup.length; c++){
                if(ingredientGroup.children[c].turnOn){
                    if(val.indexOf(ingredientGroup.children[c].val) < rnd){
                        ans = true
                    }
                    else{
                        ans = false
                        break
                    }
                }
            }
            win(ans)
        }
    }
    
    function win(ans){
        
        if(ans){
            sound.play('robotBeep')
            makePizza()
            oof.setAnimationByName(0, "WIN", true)
            particleCorrect.x = game.world.centerX
            particleCorrect.y = game.world.centerY 
            particleCorrect.start(true, 1000, null, 10)   
        }
        else{
            missPoint()
            oof.setAnimationByName(0, "LOSE", false)
            oof.addAnimationByName(0, "LOSESTILL", true)
            particleWrong.x = game.world.centerX
            particleWrong.y = game.world.centerY 
            particleWrong.start(true, 1000, null, 10)
        }
        
        game.add.tween(pizzaGroup).to({alpha: 0}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
            pizzaGroup.setAll('alpha', 0)
        })
        
        if(pointsBar.number === 8)
            game.add.tween(timerGroup).to({alpha: 1}, 500, Phaser.Easing.linear, true)
        
        if(pointsBar.number > 15)
            time -= 200
        
        game.time.events.add(1500,function(){
            if(lives !== 0){
                initGame()
            }
        },this)
    }
    
    function makePizza(){
        
        game.add.tween(leftDoor).to({x: leftDoor.x - 50}, 300, Phaser.Easing.linear, true)
        game.add.tween(rigthDoor).to({x: rigthDoor.x + 50}, 300, Phaser.Easing.linear, true).onComplete.add(function(){
            pizzaCooked.alpha = 1
            game.add.tween(pizzaCooked.scale).from({x: 0, y: 0}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                leftDoor.x = leftDoor.x + 50
                rigthDoor.x = rigthDoor.x - 50
                addCoin()
                game.add.tween(pizzaCooked).to({alpha: 0}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
                    pizzaCooked.setAll('alpha', 0)
                })
            })
        })
    }
    
    function okRelased(btn){
        
        btn.parent.children[0].alpha = 1
        btn.parent.children[1].alpha = 0
    }
    
    function pizzaPlaneta(){
        
        pizzaGroup = game.add.group()
        pizzaGroup.x = game.world.centerX + 5
        pizzaGroup.y = 215
        pizzaGroup.alpha = 0
        sceneGroup.add(pizzaGroup)
        
        var pizzaBase = pizzaGroup.create(0, 0, 'atlas.pizzaLab', 'pizzaBase')
        pizzaBase.anchor.setTo(0.5)
        pizzaBase.scale.setTo(0.9)
        
        for(var p = 0; p < ingredients.length; p++){
            
            var ing = pizzaGroup.create(0, 0, 'atlas.pizzaLab', ingredients[p])
            ing.anchor.setTo(0.5)
            ing.alpha = 0
        }
        
        pizzaCooked = game.add.group()
        pizzaCooked.x = game.world.centerX + 5
        pizzaCooked.y = 465
        pizzaCooked.alpha = 0
        pizzaCooked.scale.setTo(1.5)
        sceneGroup.add(pizzaCooked)
        
        var pizzaBase = pizzaCooked.create(0, 0, 'atlas.pizzaLab', 'pizzaBase')
        pizzaBase.anchor.setTo(0.5)
        
        for(var p = 0; p < ingredients.length; p++){
            
            var ing = pizzaCooked.create(0, 0, 'atlas.pizzaLab', ingredients[p])
            ing.anchor.setTo(0.5)
            ing.alpha = 0
        }
    }
    
    function enterOrder(){
        
        rnd = getRand()
        Phaser.ArrayUtils.shuffle(val)
        pizzaGroup.children[0].alpha = 1
        pizzaCooked.children[0].alpha = 1
                
        for(var p = 0; p < rnd; p++){
            pizzaGroup.children[val[p]].alpha = 1
            pizzaCooked.children[val[p]].alpha = 1
        }
        
        game.add.tween(pizzaGroup).to({alpha: 1}, 300, Phaser.Easing.linear, true)
        sound.play('cut')
    }
    
    function initGame(){
        
        game.time.events.add(1500,function(){
            enterOrder()
            oof.setAnimationByName(0, "IDLE", true)
            gameActive = true
            if(pointsBar.number > 8)
                startTimer(time)
        },this)
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(1, 3)
        if(x === rnd)
            return getRand()
        else
            return x     
    }
	
	return {
		
		assets: assets,
		name: "pizzaLab",
		//update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            pizzaSong = game.add.audio('pizzaSong')
            game.sound.setDecodedCallback(pizzaSong, function(){
                pizzaSong.loopFull(0.6)
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
            positionTimer()
            barBtns()
            okBtn()
            cheffOof()
            pizzaPlaneta()
            initCoin()
            createParticles()
			
			buttons.getButton(pizzaSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()