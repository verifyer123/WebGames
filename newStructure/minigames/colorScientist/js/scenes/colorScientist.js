
var soundsPath = "../../shared/minigames/sounds/"
var colorScientist = function(){
    
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
                name: "atlas.colorScientist",
                json: "images/colorScientist/atlas.json",
                image: "images/colorScientist/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/colorScientist/timeAtlas.json",
                image: "images/colorScientist/timeAtlas.png",
            }
        ],
        images: [

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "robotWhoosh",
				file: soundsPath + "robotWhoosh.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
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
    var gameIndex = 114
    var overlayGroup
    var colorSong
    var colors =  ['blue', 'red', 'yellow'] 
    var colorGroup1
    var colorGroup2
    var computer
    var bottlesGroup
    var okGroup
    var pivot
    var GOP
    var time
    var usedColor
    var roundCount
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        pivot = 1
        GOP = 1
        time = 6000
        usedColor = 0
        roundCount = 0
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.colorScientist','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.colorScientist','life_box')

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
        
		buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('colorSong', soundsPath + 'songs/classic_videogame_loop_2.mp3');
        
		game.load.image('howTo',"images/colorScientist/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/colorScientist/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/colorScientist/introscreen.png")
		
        game.load.image('background',"images/colorScientist/background.png")
        
        game.load.spine("computer", "images/spines/computer/computer.json")
        game.load.spine("bottle", "images/spines/bottle/bottle.json")
		
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
                //initGame()
                tutorial()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.colorScientist','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.colorScientist',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.colorScientist','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        back = sceneGroup.create(game.world.centerX, game.world.centerY, "background")
        back.anchor.setTo(0.5)
        back.width = game.world.width
        back.height = game.world.height
        
        base = sceneGroup.create(game.world.centerX, game.world.height, "atlas.colorScientist", "base")
        base.anchor.setTo(0.5, 1)
        base.width = game.world.width
        
        connect = game.add.tileSprite(0, game.world.centerY - 50, game.world.width, 65, "atlas.colorScientist", "connect")
        connect.scale.setTo(1.3, 1)
        sceneGroup.add(connect)  
        
        screen = sceneGroup.create(game.world.centerX, game.world.centerY, "atlas.colorScientist", "screen")
        screen.anchor.setTo(0.5)
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
        particle.makeParticles('atlas.colorScientist',key);
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

				particle.makeParticles('atlas.colorScientist',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.colorScientist','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.colorScientist','smoke');
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
        
        particleWrong = createPart('wrong')
        sceneGroup.add(particleWrong)
        
        particleSmoke = createPart('smoke')
        sceneGroup.add(particleSmoke)
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
        timerGroup.y = clock.height * 0.5
   }
    
    function stopTimer(){
        
        tweenTiempo.stop()
        tweenTiempo = game.add.tween(timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        tweenTiempo = game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        tweenTiempo.onComplete.add(function(){
            
            checkColors()
        })
    }
    
    function MrRobot(color){
        
        computer = game.add.spine(game.world.centerX, game.world.centerY - 18, "computer")
        computer.setAnimationByName(0, "IDLE", true)
        computer.setSkinByName("face_black")
        sceneGroup.add(computer)
        
        for(var c = 0; c < colors.length; c++){
            glass = game.add.spine(game.world.centerX - 150, game.world.height - 50, "bottle")
            glass.x += 150 * c
            glass.setAnimationByName(0, "IDLE", true)
            glass.setSkinByName(colors[c])
            sceneGroup.add(glass)
        }
    }
    
    function trueColors(){
        
        target1 = sceneGroup.create(game.world.centerX - 80, game.world.centerY - 270, "atlas.colorScientist", "target")
        target1.anchor.setTo(0.5) 
        target1.scale.setTo(1.1) 
        
        target2 = sceneGroup.create(game.world.centerX + 80, game.world.centerY - 270, "atlas.colorScientist", "target")
        target2.anchor.setTo(0.5) 
        target2.scale.setTo(1.1) 
        
        colorGroup1 = game.add.group()
        colorGroup1.x = target1.x
        colorGroup1.y = target1.y
        sceneGroup.add(colorGroup1)
        
        colorGroup2 = game.add.group()
        colorGroup2.x = target2.x
        colorGroup2.y = target2.y
        sceneGroup.add(colorGroup2)
        
        for(var c = 0; c < colors.length; c++){
            colorGroup1.create(0, 0, 'atlas.colorScientist', colors[c]).anchor.setTo(0.5)
            colorGroup2.create(0, 0, 'atlas.colorScientist', colors[c]).anchor.setTo(0.5)
        }
        colorGroup1.create(0, 0, 'atlas.colorScientist', 'riddle').anchor.setTo(0.5)
        colorGroup2.create(0, 0, 'atlas.colorScientist', 'riddle').anchor.setTo(0.5)
        
        colorGroup1.setAll('alpha', 0)
        colorGroup2.setAll('alpha', 0)
    }
	
    function ok(){
        
        okGroup = game.add.group()
        okGroup.x = game.world.centerX + 250
        okGroup.y = game.world.centerY + 230
        okGroup.scale.setTo(1.3)
        sceneGroup.add(okGroup)
        
        okBtn = okGroup.create(0, 0, "atlas.colorScientist", "okOff")
        okBtn.anchor.setTo(0.5) 
        okBtn.alpha = 0
        okBtn.inputEnabled = false
        okBtn.events.onInputDown.add(okPressed,this)   
        okBtn.events.onInputUp.add(okRelased,this) 
        
        var okBtnOff = okGroup.create(0, 0, "atlas.colorScientist", "okOff")
        okBtnOff.anchor.setTo(0.5) 
 
        var okBtnOn = okGroup.create(0, 0, "atlas.colorScientist", "okOn")
        okBtnOn.anchor.setTo(0.5) 
        okBtnOn.alpha = 0
        
        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var okTxt = new Phaser.Text(sceneGroup.game, 0, 2, 'OK', fontStyle)
        okTxt.anchor.setTo(0.5)
        okGroup.add(okTxt)
        
        okGroup.setAll('tint', 0x909090)
    }
    
    function okPressed(ok){
        
        if(gameActive){
            sound.play('pop')
            ok.parent.children[1].alpha = 0
            ok.parent.children[2].alpha = 1
            ok.parent.children[3].scale.setTo(0.8)
        }
    }
    
    function okRelased(ok){
        
        if(gameActive){
            ok.parent.children[1].alpha = 1
            ok.parent.children[2].alpha = 0
            ok.parent.children[3].scale.setTo(1)
            ok.inputEnabled = false
            
            if(roundCount === 3){
                checkColors()
            }
            else{
                checkTutorial()
            }
        }
    }
    
    function mesageInABottle(){
        
        bottlesGroup = game.add.group()
        sceneGroup.add(bottlesGroup)
        
        for(var c = 0; c < colors.length; c++){
            bottle = bottlesGroup.create(game.world.centerX - 150, game.world.height - 140, 'atlas.colorScientist', colors[c]+'Bottle')
            bottle.x += 150 * c
            bottle.anchor.setTo(0.5)
            bottle.color = c
            bottle.alpha = 0
            bottle.inputEnabled = true
            bottle.events.onInputDown.add(paintItBlack,this)
        }
    } 
    
    function paintItBlack(bottle){
    
        if(gameActive){
            sound.play('robotWhoosh')
            
            if(pivot === 1){
                changeImage(bottle.color, colorGroup1)
                usedColor += bottle.color 
            }
            else if(pivot === 2){
                changeImage(bottle.color, colorGroup2)
                if(GOP === 2 && usedColor === 1){
                }else{
                    usedColor += bottle.color
                }
                okBtn.inputEnabled = true
                okGroup.setAll('tint', 0xffffff)
            }
             pivot++
        }
    }
    
    function checkColors(){
        
        if(gameActive){
            
            gameActive = false
            stopTimer()
            okGroup.setAll('tint', 0x909090)

            if(usedColor === GOP){
                addPoint(1)
                computer.setAnimationByName(0, "WIN", true)
                if(time > 500)
                    time -= 200
            }
            else{
                computer.setAnimationByName(0, "LOSE", true)
                missPoint()
            }

            pivot = 1

            game.time.events.add(1800,function(){
                paintFace(4)
                initGame()
            })
        }
    }
    
    function initGame(){
        
        GOP = getRand()
        usedColor = 0
        changeImage(3, colorGroup1)
        changeImage(3, colorGroup2)
        
        //paintFace(4)
                                   
        game.time.events.add(1200,function(){
            gameActive = true
            paintFace(GOP)
            startTimer(time)
        })
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(1, 3)
        if(x === GOP)
            return getRand()
        else
            return x     
    }
    
    function paintFace(color){
        
        computer.setAnimationByName(0, "IDLE", true)
        sound.play('cut')
        
        switch(color){
            case 1:
                computer.setSkinByName("face_purple")
            break
            case 2:
                computer.setSkinByName("face_green")
            break
            case 3:
                computer.setSkinByName("face_orange")
            break
            case 4:
                computer.setSkinByName("face_black")
            break
        }
    }
    
    function tutorial(){
        
        usedColor = 0
        changeImage(3, colorGroup1)
        changeImage(3, colorGroup2)
        
        game.time.events.add(1200,function(){
            gameActive = true
            paintFace(GOP)
        })
    }
    
    function checkTutorial(){
        
        if(gameActive){
            
            gameActive = false
            okGroup.setAll('tint', 0x909090)

            if(usedColor === GOP){
                addPoint(1)
                roundCount++
                GOP++
                computer.setAnimationByName(0, "WIN", true)
            }
            else{
                computer.setAnimationByName(0, "LOSE", true)
                missPoint()
            }

            pivot = 1
            
            game.time.events.add(1800,function(){
                paintFace(4)
                if(roundCount === 3){
                    timerGroup.alpha = 1
                    initGame()
                }
                else{
                    tutorial()
                }
            })
        }
    }
    
	return {
		
		assets: assets,
		name: "colorScientist",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            colorSong = game.add.audio('colorSong')
            game.sound.setDecodedCallback(colorSong, function(){
                colorSong.loopFull(0.6)
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
            MrRobot()
            trueColors()
            ok()
            mesageInABottle()
            createParticles()
			
			buttons.getButton(colorSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()