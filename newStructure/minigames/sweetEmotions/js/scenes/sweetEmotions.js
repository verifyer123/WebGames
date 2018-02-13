
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var sweetEmotions = function(){
    
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
                name: "atlas.sweetEmotions",
                json: "images/sweetEmotions/atlas.json",
                image: "images/sweetEmotions/atlas.png",
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
            {	name: "throw",
				file: soundsPath + "throw.mp3"},
            {	name: "energy",
				file: soundsPath + "energyCharge2.mp3"},
            {	name: "towercollapse",
				file: soundsPath + "towercollapse.mp3"},
            {	name: "falling",
				file: soundsPath + "falling.mp3"},
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 141
    var overlayGroup
    var loveSong
    var coin
    var oof
    var heart
    var dinamita
    var luna
    var linesGroup
    var chocoLeftGroup, chocoRightGroup
    var shineGroup
    var emotions = ['ANGRY', 'BORED', 'CRY', 'RAGE', 'SAD', 'SCARED']
    var click
    var pointer
    var pivotLeft
    var pivotRight
    var shinePivot
    var wordListLeft
    var wordListRight
    var ans
    var wer
    var clickLeft
    var clickRight
    var dinaHappy
    var lunaHappy
    var offAim
    var hearGroup
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        click = false
        pivotLeft = 0
        pivotRight = 0
        shinePivot = 0
        wordListLeft = []
        wordListRight = []
        clickLeft = true
        clickRight = true
        dinaHappy = false
        lunaHappy = false
        offAim = false
        rnd = -1
        ans = ''
        wer = ''
        
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
        
        /*if(lives == 0){
            stopGame(false)
        }*/
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.sweetEmotions','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.sweetEmotions','life_box')

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
        loveSong.stop()
        		
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
        
        game.load.audio('loveSong', soundsPath + 'songs/happy_game_memories.mp3');
        
        game.load.image('tutorial_image',"images/sweetEmotions/gametuto.png")
        game.load.image('background',"images/sweetEmotions/background.png")
        game.load.image('floor',"images/sweetEmotions/floor.png")
        game.load.spritesheet("coin", 'images/spines/coin.png', 122, 123, 12)
        
        game.load.spine("oof", "images/spines/oof/oof.json")
        game.load.spine("heart", "images/spines/heart/heart.json")
        game.load.spine("yogotars", "images/spines/yogotar/yogotar.json")
		
		console.log(localization.getLanguage() + ' language')
        
        loadType(gameIndex)
    }
    
    function createTutorial(){
        
        overlayGroup = game.add.group()
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
    }
    
    function onClickPlay() {
        
        overlayGroup.y = -game.world.height
        initGame()
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
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.sweetEmotions','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.sweetEmotions',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.sweetEmotions','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }

	function createBackground(){
        
        var back = sceneGroup.create(0, 0, 'background')
        back.width = game.world.width
        
        var floor = sceneGroup.create(0, game.world.height, 'floor')
        floor.anchor.setTo(0, 1)
        floor.width = game.world.width
    }

	function update(){
        
		if(click && gameActive){
            
            pointer.x = game.input.x
			pointer.y = game.input.y
            
            if(pointer.x < game.world.centerX){
                checkLeft()
            }
            else{
                checkRight()
            }
		}
    }
    
    function checkLeft(){
        
        if(pointer.x > game.world.centerX)
            return
        
        for(var i = 0; i < chocoLeftGroup.length; i++){
            if(checkOverlap(pointer, chocoLeftGroup.children[i].image)){
                if(Math.abs(pointer.x - chocoLeftGroup.children[i].image.world.x) < 30 && 
                   Math.abs(pointer.y - chocoLeftGroup.children[i].image.world.y) < 30){
                    traceWordLeft(chocoLeftGroup.children[i].image)
                }
            }
        }
    }
    
    function checkRight(){
        for(var i = 0; i < chocoRightGroup.length; i++){
            if(checkOverlap(pointer,chocoRightGroup.children[i].image)){
                if(Math.abs(pointer.x - chocoRightGroup.children[i].image.world.x) < 30 && 
                   Math.abs(pointer.y - chocoRightGroup.children[i].image.world.y) < 30){
                    traceWordRight(chocoRightGroup.children[i].image)
                }
            }
        }
    }
    
    function traceWordLeft(obj){
        
        if(!gameActive || !obj.parent.active){
			return
		}
        
        var chocoWord = obj.parent
        chocoWord.active = false
        
        wordListLeft[wordListLeft.length] = chocoWord
        
        if(wordListLeft.length > 1){
			
			var lastObj = wordListLeft[pivotLeft - 1]
        
            var line = linesGroup.children[0]
            line.moveTo(lastObj.x,lastObj.y)
            line.lineTo(chocoWord.x,chocoWord.y)
            line.alpha = 1
            sound.play('pop')
        }
        
        var chocoTween = game.add.tween(chocoWord.scale).to({x:0.6,y:0.6},100,"Linear",true,0,0)
		chocoTween.yoyo(true,0)
        
        pivotLeft++
    }
    
    function traceWordRight(obj){
        
        if(!gameActive || !obj.parent.active){
			return
		}
        
        var chocoWord = obj.parent
        chocoWord.active = false
        
        wordListRight[wordListRight.length] = chocoWord
        
        if(wordListRight.length > 1){
			
			var lastObj = wordListRight[pivotRight - 1]
        
            var line = linesGroup.children[0]
            line.moveTo(lastObj.x,lastObj.y)
            line.lineTo(chocoWord.x,chocoWord.y)
            line.alpha = 1
            sound.play('pop')
        }
        
        var chocoTween = game.add.tween(chocoWord.scale).to({x:0.6,y:0.6},100,"Linear",true,0,0)
		chocoTween.yoyo(true,0)
        
        pivotRight++
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

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
        particle.makeParticles('atlas.sweetEmotions',key);
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

				particle.makeParticles('atlas.sweetEmotions',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.sweetEmotions','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.sweetEmotions','smoke');
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
    
	function initCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.5)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0

    }

    function addCoin(){
        
        coin.x = game.world.centerX
        coin.y = game.world.centerY
        time = 300

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function cupido(){
        
        dinamita = game.add.spine(game.world.centerX - 160, game.world.height - 50, "yogotars")
        dinamita.scale.setTo(0.6)
        dinamita.setAnimationByName(0, "IDLE", true)
        dinamita.setSkinByName("dinamita")
        sceneGroup.add(dinamita)
        
        luna = game.add.spine(game.world.centerX + 160, game.world.height - 50, "yogotars")
        luna.scale.setTo(-0.6, 0.6)
        luna.setAnimationByName(0, "IDLE", true)
        luna.setSkinByName("luna")
        sceneGroup.add(luna)
        
        oof = game.add.spine(game.world.centerX, 300, "oof")
        oof.scale.setTo(0.6)
        oof.setAnimationByName(0, "IDLE", true)
        oof.setSkinByName("normal")
        sceneGroup.add(oof)
    }
    
    function chocolateFactory(){
        
        var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        chocoLeftGroup = game.add.group()
        sceneGroup.add(chocoLeftGroup)
        
        chocoRightGroup = game.add.group()
        sceneGroup.add(chocoRightGroup)
        
        for( var i = 0; i < 5; i++){
            for( var j = 0; j < 2; j++){
			
                var choco = game.add.group()
                choco.active = true
                choco.empty = true
                choco.x = game.world.centerX - 230 + (90 * j)
                choco.y = game.world.centerY - 200 + (90 * i)
                choco.posX = choco.x
                choco.posY = choco.y
                choco.scale.setTo(1.3)
                choco.alpha = 0
                chocoLeftGroup.add(choco)

                var image = choco.create(0, 0, 'atlas.sweetEmotions', 'choco')
                image.anchor.setTo(0.5)
                choco.image = image

                var text = new Phaser.Text(sceneGroup.game, 0, 3, "", fontStyle)
                text.anchor.setTo(0.5)
                choco.add(text)
                choco.text = text
                
                //_______________________//
                
                var choco = game.add.group()
                choco.active = true
                choco.x = game.world.centerX + 150 + (90 * j)
                choco.y = game.world.centerY - 200 + (90 * i)
                choco.posX = choco.x
                choco.posY = choco.y
                choco.scale.setTo(1.3)
                choco.alpha = 0
                chocoRightGroup.add(choco)

                var image = choco.create(0, 0, 'atlas.sweetEmotions', 'choco')
                image.anchor.setTo(0.5)
                choco.image = image

                var text = new Phaser.Text(sceneGroup.game, 0, 3, "", fontStyle)
                text.anchor.setTo(0.5)
                choco.add(text)
                choco.text = text
            }
		}
    }
    
    function theLine(){
        
        linesGroup = game.add.group()
		sceneGroup.add(linesGroup)
		
		for(var i = 0; i < 6;i++){
			
			var line = game.add.graphics(0,0)
			line.lineStyle(10, 0xFF0077, 1)
			line.beginFill()
			line.moveTo(0,0)
			line.lineTo(-100,-100)
			line.endFill()
			line.alpha = 0
			linesGroup.add(line)
			
		}
        
        pointer = sceneGroup.create(0,0,'atlas.sweetEmotions','star')
		pointer.scale.setTo(0.4)
		pointer.anchor.setTo(0.5)
        
        game.input.onDown.add(clickDown,this)
		game.input.onUp.add(clickUp,this)
    }
    
    function chocoHeart(){
        
        hearGroup = game.add.group()
        hearGroup.x = game.world.centerX
        hearGroup.y = game.world.centerY
        hearGroup.scale.setTo(0.8)
        sceneGroup.add(hearGroup)
        
        
        var heartL = hearGroup.create(-210, 0, 'atlas.sweetEmotions', 'leftHeart')
        heartL.alpha = 0
        heartL.anchor.setTo(0.5)
        
        var heartR = hearGroup.create(210, 0, 'atlas.sweetEmotions', 'rightHeart')
        heartR.alpha = 0
        heartR.anchor.setTo(0.5)
        
        heart = game.add.spine(game.world.centerX, game.world.centerY, "heart")
        heart.scale.setTo(0.8)
        heart.setAnimationByName(0, "START", true)
        heart.setSkinByName("normal")
        heart.alpha = 0
        sceneGroup.add(heart)
    }
    
    function blingBling(){
        
        shineGroup = game.add.group()
        sceneGroup.add(shineGroup)
        
        for(var i = 0; i < 12; i++){
			var glow = shineGroup.create(0, 0, 'atlas.sweetEmotions', 'glow')
            glow.scale.setTo(1.3)
			glow.anchor.setTo(0.5)
			glow.alpha = 0
            glow.active = false
            glow.side = null
		}
    }
    
    function clickDown(){
        
        if(gameActive){
            sound.play('pop')
            click = true
        }
    }
    
    function clickUp(){
        
        click = false
        gameActive = false
        pointer.y = -100
        var feeling
        
        if(wordListLeft && wordListLeft.length > 1 && clickLeft){
            
            clickLeft = false
            feeling = ''
            for(var i = 0; i < wordListLeft.length; i++){
                feeling += wordListLeft[i].text.text
            }
            
            if(feeling == ans){
                dinaHappy = true
                dinamita.setAnimationByName(0, "HAPPY", true)
                oof.setAnimationByName(0, "SHOOT", true)
                game.time.events.add(800,function(){
                    sound.play('throw')
                    sound.play('towercollapse')
                    addCoin()
                },this)
                if(!offAim){
                    offAim = true
                    oof.scale.setTo(-0.6, 0.6)
                }
                oof.addAnimationByName(0, "IDLE", true)
                game.time.events.add(1000,function(){
                    hideAnswer(false)
                    destroyChocolate(chocoLeftGroup, 0)
                },this)
			}else{
				missPoint()
                blackOrWithe(0xaaaaaa, chocoLeftGroup)
                oof.setAnimationByName(0, "WRONG", true)
                oof.addAnimationByName(0, "IDLE", true)
			}
            
            showAnswer(false)
            descativeDevice(chocoLeftGroup)
        }
        else if(wordListRight && wordListRight.length > 1 && clickRight){
                
            clickRight = false
            feeling = ''
            for(var i = 0; i < wordListRight.length; i++){
                feeling += wordListRight[i].text.text
            }
            
            if(feeling == wer){
                lunaHappy = true
                luna.setAnimationByName(0, "HAPPY", true)
                oof.setAnimationByName(0, "SHOOT", true)
                game.time.events.add(800,function(){
                    sound.play('throw')
                    sound.play('towercollapse')
                    addCoin()
                },this)
                if(offAim){
                    offAim = false
                    oof.scale.setTo(0.6, 0.6)
                }
                oof.addAnimationByName(0, "IDLE", true)
                game.time.events.add(1000,function(){
                    hideAnswer(true)
                    destroyChocolate(chocoRightGroup, 1)
                },this)
			}else{
				missPoint()
                blackOrWithe(0xaaaaaa, chocoRightGroup)
                oof.setAnimationByName(0, "WRONG", true)
                oof.addAnimationByName(0, "IDLE", true)
			}
            
            showAnswer(true)
            descativeDevice(chocoRightGroup)
        }
        
        feeling = missClick()
        
        game.time.events.add(1000,function(){
            if(lives !== 0){
                loveIsInTheAir()
            }
            else{
                offDestruction()
            }
        },this)
    }
    
    function missClick(){
        
        if(wordListLeft.length <= 1){
            clickLeft = true
            pivotLeft = 0
            
            for(var i = 0; i < wordListLeft.length; i++){
                wordListLeft[i].active = true
            }
            
            wordListLeft = []
        }
        
        if(wordListRight.length <= 1){
            clickRight = true
            pivotRight = 0
            
            for(var i = 0; i < wordListRight.length; i++){
                wordListRight[i].active = true
            }
            
            wordListRight = []
        }
        
        return ''
    }
    
    function destroyChocolate(block, x){
        
        for(var b = 0; b < block.length; b++){
            
            game.add.tween(block.children[b]).to({alpha:0},700,Phaser.Easing.linear,true)
            game.add.tween(block.children[b]).to({x: game.world.randomX, y: game.world.randomX}, game.rnd.integerInRange(700, 1000), Phaser.Easing.linear,true)
        }
        
        hearGroup.children[x].alpha = 1
        game.add.tween(hearGroup.children[x].scale).to({x:1.2,y:1.2},300,"Linear",true,0,0).yoyo(true,0)
        
        for(var i = 0; i < linesGroup.length; i++){

			var line = linesGroup.children[i]
			line.clear()
			line.lineStyle(10, 0xFF0077, 1)
			line.moveTo(0,0)
			line.lineTo(0,0)
			line.alpha = 0
		}
    }
    
    function offDestruction(){
        
        console.log('lose')
        gameActive = false
        oof.setAnimationByName(0, "LOSE_FALLIN", true)
        luna.setAnimationByName(0, "CRY", true)
        dinamita.setAnimationByName(0, "CRY", true)
        sound.play('falling')
        game.add.tween(oof).to({y: game.world.height - 50},1000,Phaser.Easing.linear,true).onComplete.add(function(){
            oof.setAnimationByName(0, "LOSE_LAND", true)
            oof.addAnimationByName(0, "LOSESTILL", true)
            sound.stop('falling')
            sound.play('towercollapse')
            game.time.events.add(1000,function(){
                stopGame(false)
            },this)
        })
    }
    
    function loveIsInTheAir(){
        
        var win = false
        var delay
        
        if(dinaHappy && lunaHappy){
            luna.setAnimationByName(0, "LOVE", true)
            dinamita.setAnimationByName(0, "LOVE", true)
            
            hearGroup.children[0].alpha = 0
            hearGroup.children[1].alpha = 0
           
            heart.alpha = 1
            heart.setAnimationByName(0, "START", true)
            heart.addAnimationByName(0, "FINISH", true)
            sound.play('energy')
            
            win = true
        }
        
        if(!clickRight && !clickLeft){
            gameActive = false
            
            if(win){
                delay = 3100
                game.time.events.add(2000,function(){
                    game.add.tween(heart.scale).to({x: 3, y: 3},500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
                        game.add.tween(heart).to({alpha: 0},500,Phaser.Easing.Cubic.InOut,true)
                    })
                },this)
            }
            else{
                delay = 1100
                game.time.events.add(500,function(){
                    
                    for(var i = 0; i < linesGroup.length; i++){

                        var line = linesGroup.children[i]
                        line.clear()
                        line.lineStyle(10, 0xFF0077, 1)
                        line.moveTo(0,0)
                        line.lineTo(0,0)
                        line.alpha = 0
                    }
                    
                    for(var t = 0; t < chocoLeftGroup.length; t++){
                        if(!dinaHappy){
                            hideAnswer(false)
                            game.add.tween(chocoLeftGroup.children[t]).to({x:-100},game.rnd.integerInRange(300, 500),Phaser.Easing.Cubic.InOut,true)
                        }
                        if(!lunaHappy){
                            hideAnswer(true)
                            game.add.tween(chocoRightGroup.children[t]).to({x:game.world.width + 100},game.rnd.integerInRange(300, 500),Phaser.Easing.Cubic.InOut,true)
                        }
                    }
                },this)
            }
            
            game.time.events.add(delay,function(){
                if(lives !== 0 && pointsBar.number < 2){
                    restarElements()
                    initGame()
                    dinamita.setAnimationByName(0, "IDLE", true)
                    luna.setAnimationByName(0, "IDLE", true)
                    oof.setAnimationByName(0, "IDLE", true)
                }
                else{
                    gameActive = false
                    dinamita.setAnimationByName(0, "LOVE", true)
                    luna.setAnimationByName(0, "LOVE", true)
                    heart.addAnimationByName(0, "FINISH", true)
                    heart.scale.setTo(2)
                    game.add.tween(heart).to({alpha: 1},500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
                        game.time.events.add(1000,function(){
                            stopGame(false)
                        },this)
                    })
                }
            },this)
        }
        else{
            gameActive = true
        }
    }
    
    function descativeDevice(group){
        
        for(var d = 0; d < group.length; d++){
            group.children[d].active = false
        }
    }
    
    function initGame(){
        
        gameActive = false
        pivotLeft = 0
        pivotRight = 0
        shinePivot = 0
        wordListLeft = []
        wordListRight = []
        clickLeft = true
        clickRight = true
        dinaHappy = false
        lunaHappy = false
        
        restarElements()
        chocolateRain()
        
        game.time.events.add(2000,function(){
            heart.alpha = 0
            dinamita.setAnimationByName(0, ans, true)
            luna.setAnimationByName(0, wer, true)
            blackOrWithe(0xffffff, chocoLeftGroup)
            blackOrWithe(0xffffff, chocoRightGroup)
            gameActive = true
        },this)
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, emotions.length - 1)
        if(x === rnd)
            return getRand()
        else
            return x     
    }
    
    function restarElements(){
        
        for(var i = 0; i < linesGroup.length; i++){

			var line = linesGroup.children[i]
			line.clear()
			line.lineStyle(10, 0xFF0077, 1)
			line.moveTo(0,0)
			line.lineTo(0,0)
			line.alpha = 0
		}
        
        for(var i = 0; i < chocoLeftGroup.length; i++){
            
            chocoLeftGroup.children[i].active = true
            chocoLeftGroup.children[i].empty = true
            chocoLeftGroup.children[i].alpha = 1
            chocoLeftGroup.children[i].x = chocoLeftGroup.children[i].posX
            chocoLeftGroup.children[i].y = chocoLeftGroup.children[i].posY
            
            chocoRightGroup.children[i].active = true
            chocoRightGroup.children[i].empty = true
            chocoRightGroup.children[i].alpha = 1
            chocoRightGroup.children[i].x = chocoRightGroup.children[i].posX
            chocoRightGroup.children[i].y = chocoRightGroup.children[i].posY
            
        }
        
        hearGroup.setAll('alpha', 0)
        heart.scale.setTo(0.8)
        shineGroup.setAll('alpha', 0)
        shineGroup.setAll('active', false)
        shineGroup.setAll('side', null)
    }
    
    function chocolateRain(){
        
        rnd = getRand()
        ans = emotions[rnd]
        
        var pos
        var aux = 0
                
        if(ans.length < 6){
            for(var w = 0; w < ans.length; w++){
                pos = game.rnd.integerInRange(0, 1)
                chocoLeftGroup.children[aux + pos].empty = false
                chocoLeftGroup.children[aux + pos].text.setText(ans.charAt(w))
                aux += 2
            }
        }
        else{
            for(var w = 0; w < ans.length - 1; w++){
                pos = game.rnd.integerInRange(0, 1)
                chocoLeftGroup.children[aux + pos].empty = false
                chocoLeftGroup.children[aux + pos].text.setText(ans.charAt(w))
                aux += 2
            }
            if(pos === 0){
                chocoLeftGroup.children[9].empty = false
                chocoLeftGroup.children[9].text.setText(ans.charAt(ans.length - 1))
            }
            else{
                chocoLeftGroup.children[8].empty = false
                chocoLeftGroup.children[8].text.setText(ans.charAt(ans.length - 1))
            }
        }
        
        theShining(chocoLeftGroup, false)
        
        //_____________________//
        
        rnd = getRand()
        wer = emotions[rnd]
        aux = 0
                
        if(wer.length < 6){
            for(var w = 0; w < wer.length; w++){
                pos = game.rnd.integerInRange(0, 1)
                chocoRightGroup.children[aux + pos].empty = false
                chocoRightGroup.children[aux + pos].text.setText(wer.charAt(w))
                aux += 2
            }
        }
        else{
            for(var w = 0; w < wer.length - 1; w++){
                pos = game.rnd.integerInRange(0, 1)
                chocoRightGroup.children[aux + pos].empty = false
                chocoRightGroup.children[aux + pos].text.setText(wer.charAt(w))
                aux += 2
            }
            if(pos === 0){
                chocoRightGroup.children[9].empty = false
                chocoRightGroup.children[9].text.setText(wer.charAt(wer.length - 1))
            }
            else{
                chocoRightGroup.children[8].empty = false
                chocoRightGroup.children[8].text.setText(wer.charAt(wer.length - 1))
            }
        }
        
        theShining(chocoRightGroup, true)
        
        for(var i = 0; i < chocoLeftGroup.length; i++){
            
            if(chocoLeftGroup.children[i].empty){
                chocoLeftGroup.children[i].empty = false
                chocoLeftGroup.children[i].text.setText(String.fromCharCode(game.rnd.integerInRange(65, 90)))
            }
            
            if(chocoRightGroup.children[i].empty){
                chocoRightGroup.children[i].empty = false
                chocoRightGroup.children[i].text.setText(String.fromCharCode(game.rnd.integerInRange(65, 90)))
            }
            
            game.add.tween(chocoLeftGroup.children[i]).from({y: - 50}, game.rnd.integerInRange(1000, 1500), Phaser.Easing.Cubic.InOut,true)
            game.add.tween(chocoRightGroup.children[i]).from({y: - 50}, game.rnd.integerInRange(1000, 1500), Phaser.Easing.Cubic.InOut,true)
        }
        
        blackOrWithe(0xaaaaaa, chocoLeftGroup)
        blackOrWithe(0xaaaaaa, chocoRightGroup)
    }
    
    function blackOrWithe(color, side){
        
        for(var i = 0; i < chocoLeftGroup.length; i++){
            
            side.children[i].setAll('tint', color)
        }
    }
    
    function theShining(chocoGroup, side){
        
        for(var w = 0; w < chocoGroup.length; w++){
            if(!chocoGroup.children[w].empty){
                //shineGroup.children[shinePivot].alpha = 1
                shineGroup.children[shinePivot].x = chocoGroup.children[w].centerX
                shineGroup.children[shinePivot].y = chocoGroup.children[w].centerY
                shineGroup.children[shinePivot].active = true
                shineGroup.children[shinePivot].side = side
                shinePivot++
            }
        }
    }
    
    function showAnswer(side){
        
        for(var w = 0; w < shineGroup.length; w++){
            if(shineGroup.children[w].active && shineGroup.children[w].side === side){
                shineGroup.children[w].alpha = 1
            }
        }
    }
    
    function hideAnswer(side){
        for(var w = 0; w < shineGroup.length; w++){
            if(shineGroup.children[w].active && shineGroup.children[w].side === side){
                shineGroup.children[w].alpha = 0
            }
        }
    }
	
	return {
		
		assets: assets,
		name: "sweetEmotions",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            loveSong = game.add.audio('loveSong')
            game.sound.setDecodedCallback(loveSong, function(){
                loveSong.loopFull(0.6)
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
            initCoin()
            cupido()
            chocolateFactory()
            blingBling()
            theLine()
            chocoHeart()
            createParticles()
			
			buttons.getButton(loveSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()