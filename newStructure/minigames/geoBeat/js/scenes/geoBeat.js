
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var geoBeat = function(){
    
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
                name: "atlas.geoBeat",
                json: "images/geoBeat/atlas.json",
                image: "images/geoBeat/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/geoBeat/timeAtlas.json",
                image: "images/geoBeat/timeAtlas.png",
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
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "robotWhoosh",
				file: soundsPath + "robotWhoosh.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "robotWin",
				file: soundsPath + "robotWin.mp3"},
            {	name: "robotLose",
				file: soundsPath + "robotLose.mp3"},
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 128
    var overlayGroup
    var mapSong
    var coin
    var geoMachine
    var countryName
    var namesGroup
    var countryLights
    var map
    var ledsLights
    var lvl
    var ansArray = [0,1,2,3,4,5]
    var pivot
    var speed
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        lvl = 2
        pivot = 0
        speed = 1500
        
        if(localization.getLanguage() === 'EN'){
            countryName = ['America', 'Europe', 'Africa', 'Asia', 'Antarctica', 'Australia'] 
        }
        else{
            countryName = ['América', 'Europa', 'África', 'Asia', 'Antártida', 'Oceanía'] 
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.geoBeat','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.geoBeat','life_box')

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
        mapSong.stop()
        		
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
        
        game.load.audio('mapSong', soundsPath + 'songs/retrowave.mp3');
        
		/*game.load.image('howTo',"images/geoBeat/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/geoBeat/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/geoBeat/introscreen.png")*/
		game.load.image('map',"images/geoBeat/map.png")
		game.load.image('leds',"images/geoBeat/leds.png")
        game.load.spritesheet("coin", 'images/spines/coin.png', 122, 123, 12)
        
        game.load.spine("geoMachine", "images/spines/geobeat.json")
		
		console.log(localization.getLanguage() + ' language')

        game.load.image('tutorial_image',"images/geoBeat/tutorial_image.png")
        loadType(gameIndex)

        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        createTutorialGif(overlayGroup,onClickPlay)

        
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
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.geoBeat','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.geoBeat',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.geoBeat','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/


    }

    function onClickPlay(rect){

            
        overlayGroup.y = -game.world.height
        initGame()
        
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        var tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.geoBeat", 'tile')
        sceneGroup.add(tile)
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
        particle.makeParticles('atlas.geoBeat',key);
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

				particle.makeParticles('atlas.geoBeat',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.geoBeat','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.geoBeat','smoke');
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
        //timerGroup.alpha = 0
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
        timerGroup.y = clock.height * 0.3
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
    
    function mapaRocola(){
        
        geoMachine = game.add.spine(game.world.centerX, game.world.height, "geoMachine")
        geoMachine.setAnimationByName(0, "IDLE", true)
        geoMachine.setSkinByName("normal")
        sceneGroup.add(geoMachine)
    }
    
    function speedOfLight(){
        
        map = sceneGroup.create(geoMachine.centerX + 5, geoMachine.centerY + 60, 'map')
        map.anchor.setTo(0.5)
        
        countryLights = game.add.group()
        sceneGroup.add(countryLights)
        
        for(var c = 0; c < 6; c++){
            var country = countryLights.create(0, 0, 'atlas.geoBeat', 'country' + c)
            country.anchor.setTo(0.5)
            country.inputEnabled = true
            country.alpha = 0
            country.value = c
            country.events.onInputDown.add(turnItOn,this)   
            //country.events.onInputUp.add(turnItOff,this)   
        }
        
        countryLights.children[0].x = map.x - 140
        countryLights.children[0].y = map.y - 30
        
        countryLights.children[1].x = map.x - 10
        countryLights.children[1].y = map.y - 100
        
        countryLights.children[2].x = map.x - 10
        countryLights.children[2].y = map.y + 30
        
        countryLights.children[3].x = map.x + 120
        countryLights.children[3].y = map.y - 60
        countryLights.children[3].scale.setTo(0.8)
        
        countryLights.children[4].x = map.x
        countryLights.children[4].y = map.y + 120
        
        countryLights.children[5].x = map.x + 150
        countryLights.children[5].y = map.y + 60    
    }
    
    function turnItOn(btn){
        
        if(gameActive){
            btn.alpha = 1
            ledsLights.children[btn.value].alpha = 1
            changeImage(btn.value, namesGroup)

            if(btn.value === ansArray[pivot]){
                pivot++
                win(win)
            }
            else{
                win(false)
            }
        }
    }
    
    function turnItOff(btn){
        
        if(gameActive){
            
            btn.alpha = 0
            ledsLights.children[btn.value].alpha = 0
            
            if(btn.value === ansArray[pivot]){
                pivot++
                win(win)
            }
            else{
                win(false)
            }
        }
    }
    
    function colorLeds(){
        
        var leds = sceneGroup.create(geoMachine.centerX - 200, geoMachine.centerY + 300, 'leds')
        leds.anchor.setTo(0, 0.5)
        
        ledsLights = game.add.group()
        sceneGroup.add(ledsLights)
        
        for(var c = 0; c < 6; c++){
            var led = ledsLights.create(leds.x - 15, leds.y, 'atlas.geoBeat', 'led' + c)
            led.anchor.setTo(0, 0.5)
            led.inputEnabled = true
            led.x += 38 * c
            led.alpha = 0
        }
    }
    
    function sayMyName(){
        
        var fontStyle = {font: "56px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        namesGroup = game.add.group()
        sceneGroup.add(namesGroup)
        
        for(var c = 0; c < 6; c++){
            var name = new Phaser.Text(sceneGroup.game, 0, 0, '0', fontStyle)
            name.anchor.setTo(0.5)
            name.y = geoMachine.y - 65
            name.x = geoMachine.centerX
            name.popUpX = name.x
            name.popUpY = name.y
            name.alpha = 0
            name.setText(countryName[c])
            namesGroup.add(name)
        }
    }
    
    function win(ans){
        
        var lost = true
        
        if(ans){
            geoMachine.setAnimationByName(0, "WIN", false)
            geoMachine.addAnimationByName(0, "IDLE", true)
            sound.play('rightChoice')
        }
        else{
            geoMachine.setAnimationByName(0, "LOSE", false)
            sound.play('robotLose')
            game.time.events.add(500,function(){
                missPoint()
            },this)
            gameActive = false
            
            game.add.tween(map).to({ alpha:0}, 900, Phaser.Easing.linear,true).onComplete.add(function(){
                countryLights.setAll('alpha', 0)
                ledsLights.setAll('alpha', 0)
                game.add.tween(map).to({ alpha:1}, 900, Phaser.Easing.linear,true).onComplete.add(function(){
                    if(lives !== 0){
                        geoMachine.setAnimationByName(0, "IDLE", true)
                        initGame() 
                    }
                })
            })
        }
        
       
        
        if(pivot === lvl){
            sound.play('robotWin')
            geoMachine.setAnimationByName(0, "WIN", true)
            gameActive = false
            addCoin()
            
            if(pointsBar.number !== 0 && pointsBar.number % 3 === 0){
                if(lvl < 5)
                   lvl++
            }
            else if(pointsBar.number > 25){
                speed -= 100
            }
            
            game.add.tween(map).to({ alpha:0}, 900, Phaser.Easing.linear,true).onComplete.add(function(){
                countryLights.setAll('alpha', 0)
                ledsLights.setAll('alpha', 0)
                game.add.tween(map).to({ alpha:1}, 900, Phaser.Easing.linear,true).onComplete.add(function(){
                    if(lives !== 0){
                        geoMachine.setAnimationByName(0, "IDLE", true)
                        initGame() 
                    }
                })
            })
        }
    }
    
    function initGame(){
        
        namesGroup.setAll('alpha', 0)
        var time = strobeLight()
        pivot = 0
        
         game.time.events.add(time,function(){
             gameActive = true
             namesGroup.setAll('alpha', 0)
         },this)
    }
    
    function strobeLight(){
        
        var delay = speed
        Phaser.ArrayUtils.shuffle(ansArray)
        
        for(var s = 0; s < lvl; s++){
            showMeTheMoney(countryLights.children[ansArray[s]], delay)
            showMeTheMoney(ledsLights.children[ansArray[s]], delay)
            namePlate([ansArray[s]], delay)
            delay += speed
        }
        return delay
    }
    
    function namePlate(aux, delay, r){
        
         game.time.events.add(delay,function(){
            changeImage(aux, namesGroup)
            namesGroup.children[aux].x = countryLights.children[aux].x
            namesGroup.children[aux].y = countryLights.children[aux].y
           
            game.add.tween(namesGroup.children[aux].scale).from({x: 0, y: 0}, 800, Phaser.Easing.linear,true).onComplete.add(function(){
                game.add.tween(namesGroup.children[aux]).to({x: namesGroup.children[aux].popUpX , y: namesGroup.children[aux].popUpY}, 500, Phaser.Easing.linear,true).onComplete.add(function(){
                    particleCorrect.x = namesGroup.children[0].x
                    particleCorrect.y = namesGroup.children[0].y - 30
                    particleCorrect.start(true, 1200, null, 5)
                })
            })
        })
    }
    
    function showMeTheMoney(obj, delay){
        
        game.time.events.add(delay,function(){
            
            sound.play('robotWhoosh')
            if(game.rnd.integerInRange(0, 1) === 0)
                geoMachine.setAnimationByName(0, "BIP", true)
            else
                geoMachine.setAnimationByName(0, "BOP", true)

            geoMachine.addAnimationByName(0, "IDLE", true)
            
            game.add.tween(obj).to({ alpha:1}, 500, Phaser.Easing.linear,true).onComplete.add(function(){
                game.add.tween(obj).to({ alpha:0}, 500, Phaser.Easing.linear,true)
            })
        },this)
    }
	
	return {
		
		assets: assets,
		name: "geoBeat",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            mapSong = game.add.audio('mapSong')
            game.sound.setDecodedCallback(mapSong, function(){
                mapSong.loopFull(0.6)
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
            mapaRocola()
            speedOfLight()
            colorLeds()
            sayMyName()
            initCoin()
            createParticles()
			
			buttons.getButton(mapSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()