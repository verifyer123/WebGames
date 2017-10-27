var soundsPath = "../../shared/minigames/sounds/"
var oona = function(){
    
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
                name: "atlas.oona",
                json: "images/oona/atlas.json",
                image: "images/oona/atlas.png",
            },
        ],
        images: [
            {
                name: "bricks",
                file: "images/oona/bricks.png"
            }, 

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "drag",
				file: soundsPath + "drag.mp3"},
            {	name: "error",
				file: soundsPath + "error.mp3"},
            {	name: "right",
				file: soundsPath + "rightChoice.mp3"},
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 7
	var indexGame
    var overlayGroup
    var onnaSong
    var oonaAvatar
    var cap
    var gameTime
    var board
    var recipeGroup
    var toolsGroup
    var cookBtn
	var toolsTkn = ['mixTkn','pourTkn','cutTkn','ovenTkn','roastTkn','friedTkn']
    var orders = ['mix','pour','cut','oven','roast','fried']
    var aux
    var storePos
    var correctAnswer = [0,1,2,3,4,5]
    var inputAnswer = []
    var animations = ['MIX', 'PERCOLATE', 'CUT', 'BAKE', 'STEW', 'FRY', 'LOSE']

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 4
        aux = 0
        storePos = 0
        cap = 3
        gameTime = 10000
        
        inputAnswer = [cap]
        
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
        
        if(pointsBar.number % 5 == 0)
            cap++
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.oona','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.oona','life_box')

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
        onnaSong.stop()
        		
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
        
        game.load.audio('onnaSong', soundsPath + 'songs/wormwood.mp3');
        
		game.load.image('howTo',"images/oona/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/oona/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/oona/introscreen.png")
        game.load.spine("oonaAvatar", "images/spines/oona.json");
		
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
                gameActive = true
                startTime()
            })
            
        })
        
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.oona','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.oona',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.oona','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		var fondo = sceneGroup.create(game.world.centerX, game.world.centerY, 'atlas.oona', "fondo");
        fondo.anchor.setTo(0.5, 0.5)
        fondo.width = game.world.width
        fondo.height = game.world.height	
        
        var bricks = sceneGroup.create(game.world.centerX, game.world.centerY, "bricks");
        bricks.anchor.setTo(0.5, 0.5)
        bricks.width = game.world.width 
        bricks.height = game.world.height * 0.5
        
        board = sceneGroup.create(0,0,'atlas.oona','board')
        board.scale.setTo(0.9, 0.9)
        board.anchor.setTo(0.5, 0.5)
        board.x = game.world.centerX
        board.y = board.height * 0.6
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
    
    function createPart(key,obj,offsetX){
        
        var offX = offsetX || 0
        var particle = lookParticle(key)
		
        if(particle){
            
            particle.x = obj.world.x + offX
            particle.y = obj.world.y
            particle.scale.setTo(1,1)
            //game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            //game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            particle.start(true, 1500, null, 6);
			
			game.add.tween(particle).to({alpha:0},500,"Linear",true,1000).onComplete.add(function(){
				deactivateParticle(particle,0)
			})
			
        }
        
        
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

				particle.makeParticles('atlas.oona',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.oona','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.oona','smoke');
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
	
	function inputButton(obj){

		if(gameActive && obj.pressed == false)
        {
            inputAnswer[aux] = obj.parent.number
            
            //aux++
            
           if(aux == cap)
            {
                gameActive = false
            }

            obj.pressed = true
		}
	}
    
    function fixLocation(item) {
    
        sound.play("drag")
        
        if (item.x >= 90 || item.x <= 90) {
            item.x = 0
        }
        if(item.y <= -40)
        {
            item.y = 0  
        }          
        else if(item.y >= 40)
        {
            item.y = 120
            item.x = item.parent.number * -72 + storePos        
            item.input.draggable = false
            storePos += 72   
            aux++
        }
    }
    
    function drawAxis(){
        
    }    
    
    function createTimeBar(){        
        timeGroup = game.add.group()
        timeGroup.x = game.world.centerX
        timeGroup.y = game.world.height
        sceneGroup.add(timeGroup)
        
        var clock = timeGroup.create(0, 0, 'atlas.oona','clock')
        clock.y = - clock.height * 0.5
        clock.anchor.setTo(0.5,0.5)
        
        var timeBar = timeGroup.create(0, 0, 'atlas.oona','bar')
        timeBar.scale.setTo(11.5, 0.7)
        timeBar.anchor.setTo(0,0.5)
        timeBar.x = clock.x - clock.width * 0.38
        timeBar.y = clock.y + 20
        timeGroup.time = timeBar

    }
    
    function startTime(){
        
        toolsGroup.alpha = 1
        
        var timer = 400;

        //sound.play("cut")
        enterRecipe()
        cookBtn.inputEnabled = false

        for (var i = 0; i < toolsGroup.length; i++)
        {
            popObject(toolsGroup.children[i], timer)
            toolsGroup.children[i].image.pressed = false
            timer += 250
        }
        
        game.time.events.add(timer, function() 
        {
            game.add.tween(recipeGroup).to({alpha: 1}, 200, Phaser.Easing.linear, true)
            gameActive = true;
            cookBtn.inputEnabled = true
            timeGroup.tween = game.add.tween(timeGroup.time.scale).to({x: 0}, gameTime, Phaser.Easing.linear, true)
            
            timeGroup.tween.onComplete.add(function() 
            {
                oonaAvatar.setAnimationByName(0, 'LOSE', false)
                endGame(true)
                gameActive = false;
            });
        }, this)
    }
    
    function endGame(timeEnded){
        
        timeGroup.tween.stop()
        cookBtn.inputEnabled = false
        
        if(timeEnded)
        {
            //oonaAvatar.setAnimationByName(0, "LOSE", false)
            missPoint()
        }
        else
        {
            oonaAvatar.setAnimationByName(0, "WIN", false)
            addPoint(1)
        }
        
        oonaAvatar.addAnimationByName(0, "IDLE", true);
        
        gameActive = false;
                
        game.time.events.add(900, function() 
        {
            reloadElements()
        },this)
    }
    
    function reloadElements(){
        
        for(var r = 0; r < cap; r++)
        {
            inputAnswer[r] = null
        }
        
        aux = 0
        storePos = 0
        
        if(cap >= 6)
            gameTime -= 1000
        
        toolsGroup.destroy()
        tools()
        recipeGroup.destroy()
        recipe()
        
        gameActive = true
        
        game.add.tween(timeGroup.time.scale).to({x: 12}, 300, Phaser.Easing.linear, true)
        startTime()
    }
        
    function createOona(){
        oonaAvatar = game.add.spine(game.world.centerX, game.world.height - 50, "oonaAvatar");
        oonaAvatar.scale.setTo(0.9, 0.9);
        oonaAvatar.setAnimationByName(0, "IDLE", true);
        oonaAvatar.setSkinByName("normal");
        sceneGroup.add(oonaAvatar);
        
        cookBtn = sceneGroup.create(game.world.centerX, game.world.centerY - 56, 'atlas.oona', 'cookBtn')
        cookBtn.anchor.setTo(0.5, 0.5)
        cookBtn.inputEnabled = true
        cookBtn.pressed = false
        cookBtn.events.onInputDown.add(function(){
        
            game.add.tween(cookBtn.scale).to({x:0.5, y:0.5}, 100, Phaser.Easing.linear, true).onComplete.add(function() 
            {
                game.add.tween(cookBtn.scale).to({x: 1, y: 1}, 200, Phaser.Easing.linear, true)
            });
            gameActive = false
            sound.play("pop")
        })
    
        cookBtn.events.onInputUp.add(cook)
    }
    
    function cook(){
        
        timeGroup.tween.stop()
        var timer = 500;
        var fin = true
        cookBtn.pressed = true
        cookBtn.inputEnabled = false
       
        if(aux == cap)
        {
            gameActive = false
            
            for (var i = 0; i < cap; i++)
            {
                if(inputAnswer[i] == correctAnswer[i]){
                    animateOona(animations[inputAnswer[i]], timer)
                    timer += 1000
                    fin = false
                }
                else {
                    animateOona(animations[6], timer)
                    timer += 1000
                    fin = true
                    break;
                }
            }
            animateOona('', timer)
            timer += 500    
        }
        else {
            animateOona(animations[6], timer)
            fin = true
        }
        
         game.time.events.add(timer,function(){
             endGame(fin)
         },this)
    }
    
    function animateOona(action, delay){
        
        game.time.events.add(delay,function(){
            
            switch(action){
                case 'MIX':
                    sound.play("right")
                    oonaAvatar.setAnimationByName(0, action, false)
                    break;
                case 'PERCOLATE':
                    sound.play("right")
                    oonaAvatar.setAnimationByName(0, action, false)
                    break;
                case 'CUT':
                    sound.play("right")
                    oonaAvatar.setAnimationByName(0, action, false)
                    break;
                case 'BAKE':
                    sound.play("right")
                    oonaAvatar.setAnimationByName(0, action, false)
                    break;
                case 'STEW':
                    sound.play("right")
                    oonaAvatar.setAnimationByName(0, action, false)
                    break;
                case 'FRY':
                    sound.play("right")
                    oonaAvatar.setAnimationByName(0, action, false)
                    break;
                case 'LOSE':
                    sound.play("error")
                    oonaAvatar.setAnimationByName(0, action, false)
                    break;
                default:
                    oonaAvatar.setAnimationByName(0, 'IDLE', true)
                    break;
            }
        },this)
    }
    
    function recipe(){
        recipeGroup = game.add.group()
        recipeGroup.x = game.world.centerX - board.width * 0.37
        recipeGroup.y = board.y - board.height * 0.3
        sceneGroup.add(recipeGroup)
    }
    
    function enterRecipe(){
        
        recipeGroup.removeAll()
        Phaser.ArrayUtils.shuffle(correctAnswer);
        recipeGroup.alpha = 0
        
        for(var r = 0; r < cap; r++)
        {
            var steps = game.add.group()
            recipeGroup.add(steps)
                        
            var stepsImg = steps.create(0, 0, 'atlas.oona', orders[correctAnswer[r]])
            stepsImg.scale.setTo(0.9, 0.9)
            stepsImg.anchor.setTo(0.5, 0.5)
            
            steps.x = r * stepsImg.height * 1.3
        }
    }
     
    function tools(){
        
        toolsGroup = game.add.group()
        toolsGroup.x =  game.world.centerX - board.width * 0.37
        toolsGroup.y = board.y - 6
        sceneGroup.add(toolsGroup)
        
         for(var t = 0; t < 6; t++)
        {
            var tool = game.add.group()
            tool.alpha = 0
            toolsGroup.add(tool)
            
            var toolImg = tool.create(0, 0, 'atlas.oona', toolsTkn[t])
            toolImg.anchor.setTo(0.5, 0.5)
            toolImg.scale.setTo(0.9, 0.9)
            toolImg.inputEnabled = true
            toolImg.input.enableDrag()
            toolImg.input.enableSnap(40, 40, false, true);
            toolImg.events.onDragStop.add(fixLocation);
            //toolImg.events.onDragStart.add(onDragStart, this)
            //toolImg.events.onDragUpdate.add(onDragUpdate, this)
            toolImg.pressed = false
            toolImg.events.onInputUp.add(inputButton)
            
            tool.x = t * toolImg.width 
            tool.number = t
            tool.image = toolImg
            tool.originPosX = tool.x
            tool.originPosY = tool.y
        }
    }
    
    function onDragUpdate(obj, pointer, x, y) {
        var option = obj.parent
        obj.x = 0
        obj.y = 0
        option.x = x - option.deltaX
        option.y = y - option.deltaY
    }
    
    function onDragStart(obj, pointer) {
        var option = obj.parent
        option.deltaX = pointer.x - obj.world.x
        option.deltaY = pointer.y - obj.world.y
    }
        
	return {
		
		assets: assets,
		name: "oona",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
             sceneGroup.stage.backgroundColor = "#000000";
            
			createBackground()
            
			addParticles()
                        			
            onnaSong = game.add.audio('onnaSong')
            game.sound.setDecodedCallback(onnaSong, function(){
                onnaSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
            tools()
            recipe()
            createPointsBar()
			createHearts()
			buttons.getButton(onnaSong,sceneGroup)
            createOona()
            createTimeBar()
            createOverlay()
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()