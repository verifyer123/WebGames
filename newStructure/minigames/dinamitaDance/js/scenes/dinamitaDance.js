
var soundsPath = "../../shared/minigames/sounds/"
var dinamitaDance = function(){
    
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
                name: "atlas.dinamitaDance",
                json: "images/dinamitaDance/atlas.json",
                image: "images/dinamitaDance/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/dinamitaDance/timeAtlas.json",
                image: "images/dinamitaDance/timeAtlas.png",
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
    var gameIndex = 119
    var overlayGroup
    var danceSong
    var body
    var fontStyle
    var allButtonsGroup
    var glitGroup
    var win
    var pivot
    var glitter = ['glitter1', 'glitter2', 'glitter3', 'glitter4']
    var dinamita
    var bodyPart
    var tutoPivot
    var time

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        pivot = 0
        win = true
        bodyPart = -1
        tutoPivot = 0
        time = 6000
        
        if(localization.getLanguage() === 'EN'){
            body = ['Head', 'Arms', 'Hands', 'Feets'] 
            fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        }
        else{
            body = ['Cabeza', 'Brazos', 'Manos', 'Pies'] 
            fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.dinamitaDance','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.dinamitaDance','life_box')

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
        danceSong.stop()
        		
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
        
        game.load.audio('danceSong', soundsPath + 'songs/shooting_stars.mp3');
        
		game.load.image('howTo',"images/dinamitaDance/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/dinamitaDance/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/dinamitaDance/introscreen.png")
        
		game.load.image('background',"images/dinamitaDance/background.png")
		game.load.image('danceFloor',"images/dinamitaDance/danceFloor.png")
		
        game.load.spine("dinamita", "images/spines/Dinamita/dinamita.json")
        game.load.spine("boton", "images/spines/Boton/boton.json")
        
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
                initTuto()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.dinamitaDance','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.dinamitaDance',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.dinamitaDance','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        var background  = sceneGroup.create(0, 0, "background") 
        background.width = game.world.width
        background.height = game.world.height
        
        var bottom  = game.add.image(0, game.world.height, "atlas.dinamitaDance", "bottom") 
        bottom.anchor.setTo(0, 1)  
        bottom.width = game.world.width
        bottom.height = game.world.height * 0.3
        
        var danceFloor  = sceneGroup.create(0, bottom.y - bottom.height + 25, "danceFloor") 
        danceFloor.anchor.setTo(0, 1)     
        danceFloor.width = game.world.width
        danceFloor.height = game.world.height * 0.3
        sceneGroup.add(bottom)
        
        buttonsBase  = sceneGroup.create(bottom.centerX, bottom.centerY + 15, "atlas.dinamitaDance", "buttonsBase") 
        buttonsBase.anchor.setTo(0.5)  
        buttonsBase.width = game.world.width * 0.9
        buttonsBase.height = bottom.height * 0.75
        
        var light0  = sceneGroup.create(10, 20, "atlas.dinamitaDance", "light0") 
        light0.scale.setTo(1.2)
        
        var light1  = sceneGroup.create(game.world.width - 10, 40, "atlas.dinamitaDance", "light1") 
        light1.scale.setTo(1.2)
        light1.anchor.setTo(1, 0)
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
        particle.makeParticles('atlas.dinamitaDance',key);
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

				particle.makeParticles('atlas.dinamitaDance',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.dinamitaDance','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.dinamitaDance','smoke');
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
        timerGroup.y = clock.height * 0.4
   }
    
    function stopTimer(){
        
        tweenTiempo.stop()
        tweenTiempo = game.add.tween(timeBar.scale).to({x:8}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        tweenTiempo = game.add.tween(timeBar.scale).to({x:0}, time, Phaser.Easing.Linear.Out, true, 100)
        tweenTiempo.onComplete.add(function(){
            danceTest(-1)
        })
    }
    
    function lightsOn(){
           
        glitGroup = game.add.group()
        sceneGroup.add(glitGroup)
        
        for(var l = 0; l < 25; l ++){
            var glit = game.add.sprite(0, 0, "atlas.dinamitaDance", glitter[game.rnd.integerInRange(0, 3)])
            glit.alpha = 0
            glitGroup.add(glit)
        }
        
        theShining()
    }
    
    function theShining(){
        
        glitGroup.children[pivot].alpha = 1
        glitGroup.children[pivot].x = game.world.randomX
        glitGroup.children[pivot].y = game.world.randomX
    
        game.time.events.add(150,function(){
            game.add.tween(glitGroup.children[pivot]).to({ alpha: 0 }, 1000, Phaser.Easing.linear, true)
            
            if(pivot < 19){
                pivot++
            }
            else{
                pivot = 0
            }
               
            if(win){
                theShining()
            }
        }, this)
    } 
    
    function tnt(){
        
        dinamita = game.add.spine(game.world.centerX, game.world.centerY, "dinamita")
        dinamita.setAnimationByName(0, "IDLE", true)
        dinamita.setSkinByName("normal")
        sceneGroup.add(dinamita)
    }
    
    function saturdayFeverNight(dance){
        
        switch(dance){
            case 0:
                dinamita.setAnimationByName(0, "IDLE_HEAD", true)
            break
            case 1:
                dinamita.setAnimationByName(0, "IDLE_ARM", true)
            break
            case 2:
                dinamita.setAnimationByName(0, "IDLE_HANDS", true)
            break
            case 3:
                dinamita.setAnimationByName(0, "IDLE_LEGS", true)
            break
            case 4:
                dinamita.setAnimationByName(0, "IDLE", true)
            break
            case 5:
                dinamita.setAnimationByName(0, "IDLE_FOOT", true)
            break
            case 6:
                dinamita.setAnimationByName(0, "LOSE", true)
            break
        }
    }
	
	function initButtons(){
        
        var aux = 0
        
        allButtonsGroup = game.add.group()
        allButtonsGroup.x = buttonsBase.centerX - 100
        allButtonsGroup.y = buttonsBase.centerY - 50 
        sceneGroup.add(allButtonsGroup)
        
        for(var b = 0; b < body.length - 2; b++){
            for(var y = 0; y < body.length - 2; y++){

                var buttonsGroup = game.add.group()
                buttonsGroup.x += (b * 200)
                buttonsGroup.y += (y * 100)
                buttonsGroup.scale.setTo(1.15)
                allButtonsGroup.add(buttonsGroup)

                var btnOff = buttonsGroup.create(0, 0, "atlas.dinamitaDance", "buttonOFF") // 0
                btnOff.anchor.setTo(0.5) 
                btnOff.inputEnabled = true
                btnOff.bodyPart = aux
                btnOff.events.onInputDown.add(btnPressed, this)   
                btnOff.events.onInputUp.add(btnRelased, this) 

                var btnOn = buttonsGroup.create(0, 0, "atlas.dinamitaDance", "buttonON") // 1
                btnOn.anchor.setTo(0.5) 
                btnOn.alpha = 0
                
                var shineButton = game.add.spine(0, 0, "boton") // 2
                shineButton.setAnimationByName(0, "SHINE", true)
                shineButton.setSkinByName("normal")
                shineButton.alpha = 0
                buttonsGroup.add(shineButton)

                var btnTxt = new Phaser.Text(sceneGroup.game, 0, 2, '', fontStyle) // 3
                btnTxt.anchor.setTo(0.5)
                btnTxt.setText(body[aux])
                buttonsGroup.add(btnTxt)

                buttonsGroup.setAll('tint', 0x909090)
                aux++
            }
        }
    }
    
    function btnPressed(btn){
        
        if(gameActive){
            sound.play('pop')
            btn.parent.children[0].alpha = 0
            btn.parent.children[1].alpha = 1
            btn.parent.children[3].scale.setTo(0.9)
            
            if(tutoPivot === 4){
                danceTest(btn.bodyPart)
            }
            else{
                danceTestTuto(btn.bodyPart)
            }
        }
    }
    
    function btnRelased(btn){
        
        btn.parent.children[0].alpha = 1
        btn.parent.children[1].alpha = 0
        btn.parent.children[3].scale.setTo(1)
    }
    
    function danceTest(choise){
        
        if(gameActive){

            gameActive = false
            stopTimer()
            
            for(var b = 0; b < body.length; b++){
                allButtonsGroup.children[b].setAll('tint', 0x909090)
            }
            allButtonsGroup.children[bodyPart].setAll('tint', 0xffffff)
            allButtonsGroup.children[bodyPart].children[2].alpha = 1

            if(choise === bodyPart){
                addPoint(1)
                saturdayFeverNight(5)
                if(time > 500)
                    time -= 200
            }
            else{
                saturdayFeverNight(6)
                win = false
                missPoint()
            }

            game.time.events.add(3000,function(){
                
                if(lives !== 0){
                    saturdayFeverNight(4)
                    initGame()
                }
            })
        }
    }
    
    function initGame(){
        
        bodyPart = getRand()
        
        for(var b = 0; b < body.length; b++){
            allButtonsGroup.children[b].setAll('tint', 0xffffff)
            allButtonsGroup.children[b].children[2].alpha = 0
        }
        
        game.time.events.add(500,function(){
            gameActive = true
            saturdayFeverNight(bodyPart)
            startTimer(time)
            if(!win){
                win = true
                theShining()
            }
        },this)
        
    }

    function getRand(){
        var x = game.rnd.integerInRange(0, 3)
        if(x === bodyPart)
            return getRand()
        else
            return x     
    }
    
    function initTuto(){
        
        for(var b = 0; b < body.length; b++){
            allButtonsGroup.children[b].setAll('tint', 0xffffff)
            allButtonsGroup.children[b].children[2].alpha = 0
        }
        
        allButtonsGroup.children[tutoPivot].setAll('tint', 0xffffff)
        allButtonsGroup.children[tutoPivot].children[2].alpha = 1
        
        game.time.events.add(500,function(){
            gameActive = true
            saturdayFeverNight(tutoPivot)
            if(!win){
                win = true
                theShining()
            }
        },this)
    }
    
    function danceTestTuto(choise){
        
        if(gameActive){
            
            if(choise === tutoPivot){
                gameActive = false
                saturdayFeverNight(5)
                sound.play('magic')
                tutoPivot++
                
                game.time.events.add(3000,function(){
                    if(tutoPivot < 4){
                        initTuto()
                    }
                    else{
                        timerGroup.alpha = 1
                        initGame()
                    }
                })
            }
        }
    }
	
	return {
		
		assets: assets,
		name: "dinamitaDance",
		//update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            danceSong = game.add.audio('danceSong')
            game.sound.setDecodedCallback(danceSong, function(){
                danceSong.loopFull(0.6)
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
            initButtons()
            positionTimer()
            tnt()
            lightsOn()
            createParticles()
			
			buttons.getButton(danceSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()