
var soundsPath = "../../shared/minigames/sounds/"

var milkShake = function(){
    
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
                name: "atlas.milkShake",
                json: "images/milkShake/atlas.json",
                image: "images/milkShake/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/milkShake/timeAtlas.json",
                image: "images/milkShake/timeAtlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/milkShake/tutorial_image_%input.png"
			},
            {
				name:'background',
				file:"images/milkShake/background.png"
			},
            {
				name:'bar',
				file:"images/milkShake/bar.png"
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
            {	name: "blendingSound",
				file: soundsPath + "blendingSound.mp3"}, 
            {	name: "uuh",
				file: soundsPath + "uuh.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/cooking_in_loop.mp3'
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
				name:"blender",
				file:"images/spines/blender/blender.json"
			},
            {
				name:"yogotars",
				file:"images/spines/yogotars/yogos.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 208
    var tutoGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var buttonsGroup
    var okBtn
    var yogotar
    var blender
    var shakeGlass
    var level
    var fruits = []
    var answer = []
    var selection = []
    var pos = []
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
        timeAttack = false
        gameTime = 8000
        pos = [0, 1, 2, 3, 4, 5, 6]
        
        if(localization.getLanguage() === 'EN'){
            fruits = ["Durazno", "Fresa", "Mango", "Naranja", "Piña", "Plátano", "Sandía"]
        }
        else{
            fruits = ["Peach", "Strawberry", "Mango", "Orange", "Pineapple", "Banana", "Watermelon"]
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
    
    function missPoint(obj){
        
        sound.play("wrong")
        
        particleWrong.x = obj.centerX 
        particleWrong.y = obj.centerY
        particleWrong.start(true, 1200, null, 12)
		        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.milkShake','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.milkShake','life_box')

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

	function createBackground(){
        
        var back = sceneGroup.create(0, 0, "background")
        back.width = game.world.width
        back.height = game.world.height
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
        particle.makeParticles('atlas.milkShake',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.8;
        particle.maxParticleScale = 1.5;
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

				particle.makeParticles('atlas.milkShake',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.milkShake','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.milkShake','smoke');
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
    
    function createTimer(){
        
        timerGroup = game.add.group()
        timerGroup.alpha = 0
        sceneGroup.add(timerGroup)
        
        var clock = timerGroup.create(game.world.centerX, 75, "atlas.time", "clock")
        clock.anchor.setTo(0.5)
        
        var timeBar = timerGroup.create(clock.centerX - 175, clock.centerY + 20, "atlas.time", "bar")
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
            pressOk()
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
        particleCorrect.start(true, 1200, null, 12)
        sound.play("rightChoice")

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
                   if(pointsBar.number !== 0 && pointsBar.number % 5 === 0)
                       level < 3 ? level++ : level = 3
                   if(pointsBar.number === 15){
                       timeAttack = true
                       game.add.tween(timerGroup).to({alpha:1},200,Phaser.Easing.linear,true)
                   }
               })
           })
        })
    }
    
    function createYogotars(){
        
        yogotar = game.add.spine(-100, game.world.centerY - 100, "yogotars")
        yogotar.yogoName = ["dinamita", "eagle", "estrella", "luna", "oof", "oona"]
        yogotar.setAnimationByName(0, "IDLE", true)
        yogotar.setSkinByName(yogotar.yogoName[game.rnd.integerInRange(0, 5)])
        sceneGroup.add(yogotar)
        
        var dialog = game.add.sprite(70, -30, "atlas.milkShake","dialog")
        dialog.anchor.setTo(0, 1)
        dialog.scale.setTo(0.32, 0.7)
        dialog.alpha = 0.6
        dialog.tint = 0x4040aa
        yogotar.addChild(dialog)
        yogotar.dialog = dialog
        
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        var name = new Phaser.Text(sceneGroup.game, dialog.centerX, dialog.centerY + 10, "", fontStyle)
        name.anchor.setTo(0.5)
        name.alpha = 0
        yogotar.addChild(name)
        dialog.text = name
        
        dialog.scale.setTo(0)
    }
    
    function createBlender(){
        
        blender = game.add.spine(game.world.centerX + 130, game.world.centerY - 80, "blender")
        blender.setAnimationByName(0, "IDLE", true)
        blender.setSkinByName("normal")
        blender.scale.setTo(0)
        sceneGroup.add(blender)
        
        shakeGlass = sceneGroup.create(game.world.centerX + 130, game.world.centerY - 80, "atlas.milkShake", "glass")
        shakeGlass.anchor.setTo(0.5, 1)
        shakeGlass.scale.setTo(0)
    }
    
    function createButtons(){
        
        var bar = sceneGroup.create(0, game.world.height, "bar")
        bar.anchor.setTo(0, 1)
        bar.width = game.world.width
        
        var pivotY = 0.85
        var pivotX = 0.5
        var aux = 0.5
        
        buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        for(var i = 0; i < 7; i++){
            
            var subGroup = game.add.group()
            buttonsGroup.add(subGroup)
            
            var buttonOff = subGroup.create(bar.centerX * pivotX, bar.centerY * pivotY, "atlas.milkShake", "fruitOff" + i)
            buttonOff.anchor.setTo(0.5)
            buttonOff.tag = i
            buttonOff.inputEnabled = true
            buttonOff.events.onInputDown.add(pressFruit, this)
            buttonOff.events.onInputUp.add(releaseButton, this)
            
            var buttonOn = subGroup.create(bar.centerX * pivotX, bar.centerY * pivotY, "atlas.milkShake", "fruitOn" + i)
            buttonOn.anchor.setTo(0.5)
            buttonOn.alpha = 0
            
            pivotX += aux
            
            if(i === 2){
                aux = 0.4
                pivotX = 0.4
                pivotY = 1.05
            }    
        }
        
        okBtn = game.add.group()
        sceneGroup.add(okBtn)
        
        var buttonOff = okBtn.create(bar.centerX, bar.y - 100, "atlas.milkShake", "okOff")
        buttonOff.anchor.setTo(0.5)
        buttonOff.inputEnabled = true
        buttonOff.events.onInputDown.add(pressOk, this)
        buttonOff.events.onInputUp.add(releaseButton, this)

        var buttonOn = okBtn.create(bar.centerX, bar.y - 100, "atlas.milkShake", "okOn")
        buttonOn.anchor.setTo(0.5)
        buttonOn.alpha = 0
    }
    
    function pressFruit(btn){
        
        if(gameActive){
        
            btn.parent.children[1].alpha = 1
            selection[selection.length] = btn.tag
            btn.tint = 0x00ff55       
            sound.play("pop")
        }
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 0
    }
    
    function pressOk(ok){
        
        if(gameActive){
        
            sound.play("pop")
            gameActive = false
            if(ok)
                ok.parent.children[1].alpha = 1
            if(timeAttack)
                stopTimer()
            
            game.add.tween(yogotar.dialog.scale).to({x:0},300,Phaser.Easing.linear,true)
            game.add.tween(yogotar.dialog.text).to({alpha:0},100,Phaser.Easing.linear,true)
            
            sound.play("blendingSound")
            var shake = game.add.tween(blender.scale).to({x:1, y:1},400,Phaser.Easing.linear,true, 0, 0, true)
            shake.yoyoDelay(1800)
            shake.onComplete.add(function(){
                shakeGlass.loadTexture("atlas.milkShake", (selection[0] === undefined ? "glass" : "glass" + selection[0]))
                game.add.tween(shakeGlass.scale).to({x:1, y:1},400,Phaser.Easing.linear,true).onComplete.add(function(){
                    if(checkResult()){
                        addCoin(shakeGlass)
                    }
                    else{
                        yogotar.setAnimationByName(0, "LOSE", true)
                        sound.play("uuh")
                        missPoint(shakeGlass)
                    }
                    if(lives !== 0)
                        game.time.events.add(500, restarAssets)
                })
            })
        }
    }
    
    function checkResult(){
        
        if(selection.length !== answer.length)
            return false
        else{
            var ans = true
            for(var i = 0; i < answer.length; i++){
                if(!answer.includes(selection[i])){
                    ans = false
                    break
                }
            }
        }
        return ans
    }
    
    function restarAssets(){
        
        game.add.tween(yogotar).to({x:game.world.width + 100},1500,Phaser.Easing.linear,true).onComplete.add(function(){
            selection = []
            answer = []
            yogotar.x = -100
            yogotar.dialog.text.setText("")
            for(var i = 0; i < buttonsGroup.length; i++){
                buttonsGroup.children[i].children[0].tint = 0xffffff
            }
            yogotar.setAnimationByName(0, "IDLE", true)
            yogotar.setSkinByName(yogotar.yogoName[game.rnd.integerInRange(0, 5)])
        })
        game.time.events.add(500, function(){
            game.add.tween(shakeGlass).to({x:game.world.width + 100},1200,Phaser.Easing.linear,true).onComplete.add(function(){
                shakeGlass.scale.setTo(0)
                shakeGlass.x = game.world.centerX + 130
                game.time.events.add(500, initGame)
            })
        })
    }
    
    function initGame(){
        
        game.add.tween(yogotar).to({x:game.world.centerX - 180},800,Phaser.Easing.linear,true).onComplete.add(function(){
            enterOrder()
            game.time.events.add(500, function(){
                gameActive = true
                if(timeAttack)
                    startTimer(gameTime)
            })
        })
    }
    
    function enterOrder(){
        
        if(pointsBar.number < 16)
            var opt = game.rnd.integerInRange(1, level)
        else
            var opt = game.rnd.integerInRange(2, level)
            
        Phaser.ArrayUtils.shuffle(pos)
        
        for(var i = 0; i < opt; i++){
            answer[i] = pos[i]
        }
        
        var ySize 
        
        switch(opt){
            case 1:
                ySize = 0.23
                yogotar.dialog.text.setText("\n" + "\n" + fruits[answer[0]])
            break
            
            case 2:
                ySize = 0.43
                yogotar.dialog.text.setText("\n" + fruits[answer[0]] + "\n" + fruits[answer[1]])
            break
            
            case 3:
                ySize = 0.7
                yogotar.dialog.text.setText(fruits[answer[0]] + "\n" + fruits[answer[1]] + "\n" + fruits[answer[2]])
            break
        }
        sound.play("cut")
        game.add.tween(yogotar.dialog.scale).to({x:0.32, y:ySize},300,Phaser.Easing.linear,true).onComplete.add(function(){
            game.add.tween(yogotar.dialog.text).to({alpha:1},100,Phaser.Easing.linear,true)
        })
    }
	
	return {
		
		assets: assets,
		name: "milkShake",
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
            createYogotars()
            createButtons()
            createBlender()
            createTimer()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()