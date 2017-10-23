
var soundsPath = "../../shared/minigames/sounds/"
var gameScene = function(){
    
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
                name: "atlas.game",
                json: "images/game/atlas.json",
                image: "images/game/atlas.png",
            },
        ],
        images: [
            {
                name: "fondo",
                file: "images/game/fondo.png"
            }
		],
		sounds: [
			{	
                name: "pop",
				file: soundsPath + "pop.mp3"
            },
            {
                name: "magic",
                file: soundsPath + "magic.mp3"
            }, 
            {
                name: "cut",
                file: soundsPath + "cut.mp3"
            }, 
            {
                name: "combo",
                file: soundsPath + "combo.mp3"
            }, 
            {
                name: "flip",
                file: soundsPath + "flipCard.mp3"
            }, 
            {
                name: "swipe",
                file: soundsPath + "swipe.mp3"
            }, 
            {
                name: "wrong",
                file: soundsPath + "wrong.mp3"
            }, 
            {
                name: "right",
                file: soundsPath + "rightChoice.mp3"
            }
        ]
    }
    
    var lives = null
    var coins = null
	var sceneGroup = null
	var background
    var gameActive = false
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 7
	var indexGame
    var overlayGroup
    var asianLoop2
    var master
    var frameGroup
    var scrollGroup
    var numFaltante
    var panelsGroup
    var timeGroup
    var correctAnswer
    var inputAnswer
    var inputText
    var randomOptions = []
    var operators = []  
    var answers = []
    var questionType
    var aux
	
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 5
        coins = 0
        correctAnswer = 0
        gameActive = false;
        aux = 0
        operators = [" ", "+", " ", "+", " ", "="];
       // inputText = 1
        questionType = game.rnd.integerInRange(2, 3)
        
        if(questionType == 2)
        {
            operators = [" ", "+", " ", "="];
           // inputText = 2
        }
        answers = [questionType]
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
        generateNumbers()
        
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
        
        var pointsText = lookParticle('textPart')
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
        
        //addNumberPart(heartsGroup.text,'-1',true)    
         heartsGroup.text.setText('X ' + lives)
    }
    
    function addPoint(number){
        
        sound.play("magic")
        coins += number
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        //addNumberPart(pointsBar.text,'+' + number,true)		
        pointsBar.text.setText( + coins)
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.game','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.game','life_box')

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
		//sound.play("gameLose")
		
        timeGroup.tween.stop()
        gameActive = false
        asianLoop2.stop()
        		
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
        
        game.load.audio('asianLoop2', soundsPath + 'songs/asianLoop2.mp3');
		game.load.image('howTo',"images/game/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/game/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/game/introscreen.png")
        game.load.spine("master", "images/spines/skeleton.json");
		
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
        rect.events.onInputDown.add(function()
        {
            rect.inputEnabled = false
			sound.play("pop")
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
				overlayGroup.y = -game.world.height
                gameActive = true
                loadElements()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.game','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.game',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.game','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function createMaster(){
        master = game.add.spine(game.world.centerX - 100, 250, "master");
        master.scale.setTo(.7, .7);
        master.setAnimationByName(0, "IDLE", true);
        master.setSkinByName("normal");
        sceneGroup.add(master);
    }
    
    function createFrame(){
        
        frameGroup = game.add.group();
        sceneGroup.add(frameGroup);
        
        for (i = 0; i < questionType + 1; i++)
        {
            frameImg = frameGroup.create(0, 0, "atlas.game", "marco"),
            frameImg.alpha = 0,
            frameImg.scale.setTo(0.8, 0.8),
            frameImg.anchor.setTo(0.5, 0.5)
        }
    }
    
    function createRoundrect(){
        var roundRect = new Phaser.Graphics(game);
        roundRect.beginFill(0x000000);
        roundRect.drawRoundedRect(0, 0, 500, 500, 20);
        roundRect.x = game.world.centerX - roundRect.width * 0.5
        roundRect.y = game.world.centerY * 0.95
        roundRect.alpha = 0.6;
        roundRect.endFill();
        sceneGroup.add(roundRect);
    }
    
    function createScroll(){
        scrollGroup = game.add.group()
        scrollGroup.x = game.world.centerX
        scrollGroup.y = game.world.centerY * 0.6
        scrollGroup.alpha = 0
        sceneGroup.add(scrollGroup);
        
        var scroll = scrollGroup.create(0, 0, "atlas.game", "pergamino");
        scroll.anchor.setTo(0.5 ,0.5);
        scroll.scale.setTo(1.1, 1)
        
        var numFaltantePos =  -150
        var numFaltanteTextPos = -150
        var separation = 52
        var scale = 0.8
        fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"};
        
        if(questionType == 2)
        {
            numFaltantePos =  -130
            numFaltanteTextPos = -130
            scale = 1;
            separation = 70
            fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"};
        }
        
        for(var x = 0; x < operators.length; x++)
        {
            if(operators[x] == " ")      //((x +1) % 2 != 0)
            {
                var numFaltante = game.add.group()
                scrollGroup.add(numFaltante)
            
                var numFaltanteImg = numFaltante.create(0, 0, 'atlas.game', 'numFaltante');
                numFaltanteImg.anchor.setTo(0.5, 0.5); 
                numFaltanteImg.scale.setTo(scale, scale);
                numFaltante.x = numFaltantePos + x * separation
                numFaltante.y = scroll.y + 10

                numFaltanteText = new Phaser.Text(sceneGroup.game, 0, 0, operators[x], fontStyle);
                numFaltanteText.anchor.setTo(0.5, 0.5);
                numFaltanteText.x = numFaltanteTextPos + x * separation
                numFaltanteText.y = scroll.y + 10
            }
            else{
                var numFaltanteText = new Phaser.Text(sceneGroup.game, 0, 0, operators[x], fontStyle)
                numFaltanteText.anchor.setTo(0.5, 0.5)
                numFaltanteText.x = numFaltanteTextPos + x * separation
                numFaltanteText.y = scroll.y + 10
            }       
            
            scrollGroup.add(numFaltanteText)
            scrollGroup.text = numFaltanteText
        }
        
        var fontStyle = {font: "100px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"};
        totalShow = new Phaser.Text(sceneGroup.game, 120, scroll.y - 50, 0, fontStyle);
        scrollGroup.add(totalShow);
        scrollGroup.number = totalShow;
    }
    
    function createTimeBar(){        
        timeGroup = game.add.group()
        sceneGroup.add(timeGroup)
        
        var clock = timeGroup.create(game.world.centerX, game.world.centerY * 0.85, 'atlas.game','clock')
        clock.anchor.setTo(0.5,0.5)
        
        var timeBar = timeGroup.create(clock.centerX - clock.width * 0.4, clock.centerY * 1.05, 'atlas.game','bar')
        timeBar.scale.setTo(12, 0.6)
        timeBar.anchor.setTo(0,0.5)
        timeGroup.time = timeBar

    }
    
    function createPanels(){
        panelsGroup = game.add.group()
        panelsGroup.x = game.world.centerX
        panelsGroup.y = game.world.centerY
        sceneGroup.add(panelsGroup) 
        
        var color  
        var textColor
        var timer = 300
        
        for(var y = 0; y < 3; y++)
        {
            for(var x = 0; x < 3; x++)
            {
                if((x+y) % 2 == 0)
                {
                    color = "Clear";
                    textColor = "#000000";
                }
                else
                {
                    color = "Dark"
                    textColor = "#ffffff"
                }
                
                var panel = game.add.group()
                panel.alpha = 0
                panelsGroup.add(panel)

                    var panelImg = panel.create(0, 0, 'atlas.game', 'panel' + color)
                    panelImg.scale.setTo(0.8, 0.8)
                    panelImg.anchor.setTo(0.5, 0.5)

                    panelImg.inputEnabled = true
                    panelImg.pressed = false
                    panelImg.events.onInputDown.add(inputButton)

                    fontStyle = {font: "100px VAGRounded", fontWeight: "bold", fill: textColor, align: "center"}
                    panelText = new Phaser.Text(sceneGroup.game, 0, 0, 0, fontStyle)
                    panelText.anchor.setTo(0.5, 0.5)
                    panel.add(panelText)

                panel.text = panelText
                panel.image = panelImg
                panel.number = 0
                
                panel.x = - 150 + x * panelImg.width * 1.2
                panel.y = 70 + y * panelImg.width * 1.2
            }
        }
    }
    
    function generateNumbers(){   
        correctAnswer = 0
        inputAnswer = 0
        aux = 0
        inputText = 2
        questionType = game.rnd.integerInRange(2, 3)
        answers = [questionType]
        
        operators = [" ", "+", " ", "+", " ", "="];
        
        if(questionType == 2)
        {
            operators = [" ", "+", " ", "="];
        }
        createScroll()
        game.world.bringToTop(timeGroup)
        
        for(var z = 0; z < questionType; z++)
        {
            randomOptions[z] = game.rnd.integerInRange(1, 5)
            correctAnswer += randomOptions[z]
            scrollGroup.children[z].text =  " "
        }
        
        for(var x = questionType; x < panelsGroup.length; x++)
        {
            randomOptions[x] = game.rnd.integerInRange(1, 9)
        }
        
        Phaser.ArrayUtils.shuffle(randomOptions);
        
        for(var i = 0; i < panelsGroup.length; i++)
        {
            panelsGroup.children[i].text.setText(randomOptions[i])
            panelsGroup.children[i].number = randomOptions[i]
        }
        
        var p = 2
        while(p < scrollGroup.length)
        {
            if(scrollGroup.children[p].text != "+" && scrollGroup.children[p].text != "=")
                scrollGroup.children[p].text = " "
            p++
        }
        
           
        scrollGroup.number.setText(correctAnswer)
    }
    
    function loadElements(){
        var timer = 400;

        game.time.events.add(timer, function() 
        {
            scrollGroup.alpha = 1
            sound.play("cut")
            game.add.tween(scrollGroup.scale).from({x: .01}, 300, Phaser.Easing.linear, true);
        }, this);

        timer += 300;
        
        for (var i = 0; i < panelsGroup.length; i++)
        {
            popObject(panelsGroup.children[i], timer)
            panelsGroup.children[i].image.pressed = false
            timer += 250
        }
        
        
        game.time.events.add(timer, function() 
        {
            gameActive = true;
            timeGroup.tween = game.add.tween(timeGroup.time.scale).to({x: 0}, 5000, Phaser.Easing.linear, true)
                
            timeGroup.tween.onComplete.add(function() 
            {
                endGame(true)
                gameActive = false;
            });
        }, this)
    }
    
    function endGame(timeEnded){   
        timeGroup.tween.stop()
        
        if(!timeEnded && correctAnswer == inputAnswer)
        {
            master.setAnimationByName(0, "WIN", false)
            addPoint(1)
        }
        else
        {
            master.setAnimationByName(0, "LOSE", false) 
            missPoint()
        }
        
        master.addAnimationByName(0, "IDLE", true);
        
        gameActive = false;
        
        game.time.events.add(600, function() 
        {
            game.add.tween(scrollGroup).to({alpha: 0}, 300, Phaser.Easing.linear, true)
            //game.add.tween(panelsGroup).to({alpha: 0}, 300, Phaser.Easing.linear, true)
            //game.add.tween(timeGroup.time.scale).to({x: 12}, 300, Phaser.Easing.linear, true)
        }, this);
        
        game.time.events.add(900, function() 
        {
        generateNumbers()
        reloadElements()
        }, this);
    }
    
    function reloadElements(){
        frameGroup.alpha = 1
        panelsGroup.alpha = 1
        
        for (var b = 0; b < frameGroup.length; b++)
            frameGroup.children[b].alpha = 0
        
        for (b = 0; b < panelsGroup.length; b++) 
        {
            panelsGroup.children[b].alpha = 0
        }
        
        game.add.tween(timeGroup.time.scale).to({x: 12}, 300, Phaser.Easing.linear, true)
        
        loadElements()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		var fondo = sceneGroup.create(game.world.centerX, game.world.centerY, "fondo");
        fondo.anchor.setTo(0.5, 0.5)
        fondo.width = game.world.width
        fondo.height = game.world.height
	}
	
	function update(){

	}
	
	function createTextPart(text,obj){
        
        var pointsText = lookParticle('textPart')
        
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
	
	function inputButton(obj){

		if(gameActive && obj.pressed == false)
        {
            frameGroup.children[aux].x = obj.world.x
            frameGroup.children[aux].y = obj.world.y
            game.add.tween(frameGroup.children[aux]).to({alpha: 1}, 400, Phaser.Easing.linear, true);

            scrollGroup.children[inputText].text = obj.parent.number
                
            inputText += 3
            aux ++
            inputAnswer += obj.parent.number
            
            if(aux == questionType)
            {
                gameActive = false
                endGame(false)
            }
        
            sound.play("flip");

            game.add.tween(obj.parent.scale).to({x:0.5, y:0.5}, 200, Phaser.Easing.linear, true).onComplete.add(function() 
            {
                game.add.tween(obj.parent.scale).to({x: 1, y: 1}, 200, Phaser.Easing.linear, true)
            });
            obj.pressed = true
		}
	}
	
	return {
		
		assets: assets,
		name: "gameScene",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
                        			
            asianLoop2 = game.add.audio('asianLoop2')
            game.sound.setDecodedCallback(asianLoop2, function(){
                asianLoop2.loopFull(0.6)
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
            createMaster()
            createScroll()
            createTimeBar()
            createRoundrect()
            createFrame()
            createOverlay()
            createPanels()
            animateScene()
            
            randomOptions = [panelsGroup.length]
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()