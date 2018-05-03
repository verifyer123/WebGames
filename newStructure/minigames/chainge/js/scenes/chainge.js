
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var chainge = function(){
    
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
                name: "atlas.chainge",
                json: "images/chainge/atlas.json",
                image: "images/chainge/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/chainge/timeAtlas.json",
                image: "images/chainge/timeAtlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        images: [
            {
				name:'changeBox',
				file:"images/chainge/changeBox.png"
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
            {	name: "coinsFalling",
				file: soundsPath + "coinsFalling.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/kids_and_videogame.mp3'
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
				name:"american",
				file:"images/spines/american/american.json"
			},
            {
				name:"mexican",
				file:"images/spines/mexican/mexican.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 199
    var tutoGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var coinsGroup
    var linesGroup
    var paperMoney
    var currency
    var moneyExchange
    var click
    var pointer
    var pivot
    var coinsArray
    var rand
    var timeAttack
    var gameTime
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        click = false
        pivot = 0
        coinsArray = []
        rand = -1
        timeAttack = false
        gameTime = 15000
        
        if(localization.getLanguage() === 'ES'){
            currency = {paper: "peso", metal: "moneda"}
            moneyExchange = {paper: [20, 50, 100], metal: [0.5, 1, 2, 5, 10]}
        }
        else{
            currency = {paper: "dollar", metal: "coin"}
            moneyExchange = {paper: [1, 5, 10], metal: [0.05, 0.1, 0.25, 0.5, 1]}
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.chainge','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.chainge','life_box')

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
        game.load.image('tutorial_image', "images/chainge/gametuto" + localization.getLanguage() + ".png")
        
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
            
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.chainge", "tile"))
    }

	function update(){
        
        if(click && gameActive && !clickOnsound()){
            
            pointer.x = game.input.x
			pointer.y = game.input.y
            startChain()
		}
    }
    
    function startChain(){
    
        for(var i = 0; i < coinsGroup.length; i++){
            if(checkOverlap(pointer, coinsGroup.children[i])){
                if(Math.abs(pointer.x - coinsGroup.children[i].world.x) < 30 && 
                   Math.abs(pointer.y - coinsGroup.children[i].world.y) < 30){
                    traceChain(coinsGroup.children[i])
                }
            }
        }
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
    
    function clickOnsound(){
        
        if(game.input.x > 515 && game.input.y < 60){
            return true
        }
        else{
            return false
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
        particle.makeParticles('atlas.chainge',key);
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

				particle.makeParticles('atlas.chainge',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.chainge','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.chainge','smoke');
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
        timerGroup.add(clock)
        
        var timeBar = game.add.image(clock.position.x + 40, clock.position.y + 40, "atlas.time", "bar")
        timeBar.scale.setTo(8, 0.45)
        timerGroup.add(timeBar)
        timerGroup.timeBar = timeBar
        
        timerGroup.x = game.world.centerX - clock.width * 0.75
        timerGroup.y = clock.height * 0.3
   }
    
    function stopTimer(){
        
        timerGroup.tweenTiempo.stop()
        game.add.tween(timerGroup.timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        timerGroup.tweenTiempo = game.add.tween(timerGroup.timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        timerGroup.tweenTiempo.onComplete.add(function(){
            win(0)
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
    
    function createPaperMoney(){
        
        var board = sceneGroup.create(game.world.centerX, 240, "atlas.chainge", "board")
        board.anchor.setTo(0.5)
        
        paperMoney = sceneGroup.create(board.centerX, board.centerY, "atlas.chainge", currency.paper + 2)
        paperMoney.anchor.setTo(0.5)
        paperMoney.alpha = 0
        
        if(localization.getLanguage() === 'ES'){
            var spine = game.add.spine(50, 132, "mexican")
        }
        else{
            var spine = game.add.spine(0, 125, "american")
        }
        
        spine.setAnimationByName(0, "idle", true)
        spine.setSkinByName("")
        paperMoney.addChild(spine)
        paperMoney.spine = spine
        
    }
    
    function createCoins(){
        
        var changeBox = sceneGroup.create(game.world.centerX, game.world.height - 10, "changeBox")
        changeBox.anchor.setTo(0.5, 1)
        changeBox.scale.setTo(0.88)
        
        coinsGroup = game.add.group()
        sceneGroup.add(coinsGroup)
        
        var pivotY = 0.67
    
        for(var j = 0; j < 6; j++){
            
            var pivotX = 0.58
            for(var i = 0; i < 5; i++){
                
                var coin = coinsGroup.create(changeBox.centerX * pivotX, changeBox.centerY * pivotY, "atlas.chainge", currency.metal + 3)
                coin.anchor.setTo(0.5)
                coin.scale.setTo(0.85)
                coin.value = -1
                coin.active = true
                coin.alpha = 0

                pivotX += 0.21
            }
            pivotY += 0.13
        }
    }
    
    function createLineAndPointer(){
        
        linesGroup = game.add.group()
		sceneGroup.add(linesGroup)
		
		for(var i = 0; i < 6;i++){
			
			var line = game.add.graphics(0,0)
			line.lineStyle(10, 0x87ff2b, 1)
			line.beginFill()
			line.moveTo(0,0)
			line.lineTo(-100,-100)
			line.endFill()
			line.alpha = 0
			linesGroup.add(line)
		}
        
        pointer = sceneGroup.create(-10,-10,'atlas.chainge','star')
		pointer.scale.setTo(0.5)
		pointer.anchor.setTo(0.5)
        
        game.input.onDown.add(clickDown,this)
		game.input.onUp.add(clickUp,this)
    }
    
    function clickDown(){
        
        if(gameActive){
            sound.play('pop')
            click = true
        }
    }
    
    function clickUp(){
        
        click = false
        pointer.y = -100
        
        if(gameActive){
            
            var change = 0

            if(coinsArray && coinsArray.length > 1){

                for(var i = 0; i < coinsArray.length; i++){
                    change += coinsArray[i].value
                }
                win(change)
            }
            else{
                pivot = 0
                coinsGroup.setAll("active", true)
                coinsArray = []
                change = 0
            }
        }
    }
    
    function win(ans){
        
        gameActive = false
        
        if(timeAttack){
            stopTimer()
        }
        
        if(moneyExchange.paper[rand] == ans){
            addCoin(paperMoney) 
            paperMoney.spine.setAnimationByName(0, "win", true)
            
            if(pointsBar.number > 15){
                gameTime > 1000 ? gameTime -= 1000 : gameTime = 1000
            }
        }else{
            missPoint(paperMoney)
            paperMoney.spine.setAnimationByName(0, "lose", true)
        }
        
        if(pointsBar.number === 10){
            timeAttack = true
            game.add.tween(timerGroup).to({alpha: 1}, 300, Phaser.Easing.linear, true)
        }
        
        game.time.events.add(1500,function(){
            if(lives !== 0){

                sound.play("cut")
                game.add.tween(paperMoney.scale).to({x:0, y:0},200,Phaser.Easing.linear,true).onComplete.add(function(){
                    paperMoney.alpha = 0
                    paperMoney.scale.setTo(1)
                })

                pivot = 0
                coinsArray = []
                
                coinsGroup.setAll("active", true)
                coinsGroup.setAll("value", -1)
                for(var i = 0; i < coinsGroup.length; i++){
                    game.add.tween(coinsGroup.children[i]).to({alpha:0}, 300, Phaser.Easing.linear,true)
                }

                for(var i = 0; i < linesGroup.length; i++){
                    var line = linesGroup.children[i]
                    line.clear()
                    line.lineStyle(10, 0x87ff2b, 1)
                    line.moveTo(0, 0)
                    line.lineTo(-100, -100)
                    line.alpha = 0
                }

                game.time.events.add(1000,function(){
                    initGame()
                })
            }
        })
    }
    
    function traceChain(coin){
        
        if(!gameActive || !coin.active){
			return
		}
        
        coin.active = false
        
        coinsArray[coinsArray.length] = coin
        
        if(coinsArray.length > 1){
			
			var lastObj = coinsArray[pivot - 1]
        
            var line = linesGroup.children[0]
            line.moveTo(lastObj.x,lastObj.y)
            line.lineTo(coin.x,coin.y)
            line.alpha = 1
            sound.play('pop')
        }
        
        var scaleTween = game.add.tween(coin.scale).to({x:0.5,y:0.5}, 100, Phaser.Easing.linear, true, 0, 0)
		scaleTween.yoyo(true,0).onComplete.add(function(){
            coin.scale.setTo(0.85)
        })
        
        pivot++
    }
    
    function initGame(){
        
        rand = getRand()
        paperMoney.loadTexture("atlas.chainge", currency.paper + rand)
        paperMoney.spine.setAnimationByName(0, "idle", true)
        paperMoney.spine.setSkinByName(moneyExchange.paper[rand] + currency.paper + "s")
        popObject(paperMoney, 300)
        fillCoins()
        game.time.events.add(1500,function(){
            gameActive = true
            if(timeAttack)
                startTimer(gameTime)
        })
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 2)
        if(x === rand)
            return getRand()
        else
            return x     
    }
    
    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x:0, y:0},200,Phaser.Easing.linear,true)
        })
    }
    
    function fillCoins(){

        var pos = []
        for(var i = 0; i < coinsGroup.length; i++)
            pos[i] = i
        
        Phaser.ArrayUtils.shuffle(pos)
       
        for(var i = 0; i < coinsGroup.length * 0.5; i++){
            var val = game.rnd.integerInRange(rand, 4)
            coinsGroup.children[pos[i]].value = moneyExchange.metal[val]
            coinsGroup.children[pos[i]].loadTexture("atlas.chainge", currency.metal + val)
        }
        
        for(var i = coinsGroup.length * 0.5; i < coinsGroup.length; i++){
            var val = game.rnd.integerInRange(0, 4)
            coinsGroup.children[pos[i]].value = moneyExchange.metal[val]
            coinsGroup.children[pos[i]].loadTexture("atlas.chainge", currency.metal + val)
        }
        
        game.time.events.add(800,function(){
            sound.play("coinsFalling")
            for(var i = 0; i < coinsGroup.length; i++){
                coinsGroup.children[i].alpha = 1
                game.add.tween(coinsGroup.children[i]).from({y:-50}, game.rnd.integerInRange(500, 800),Phaser.Easing.linear,true)
            }
        })
    }
	
	return {
		
		assets: assets,
		name: "chainge",
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
            createPaperMoney()
            createCoins()
            createLineAndPointer()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()