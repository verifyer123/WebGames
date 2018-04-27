
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"
var cleanCrossing = function(){
    
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
                name: "atlas.cleanCrossing",
                json: "images/cleanCrossing/atlas.json",
                image: "images/cleanCrossing/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/cleanCrossing/timeAtlas.json",
                image: "images/cleanCrossing/timeAtlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/cleanCrossing/tutorial_image_%input.png"
			},
            {
				name:'background',
				file:"images/cleanCrossing/background.png"
			},
            {
				name:'road',
				file:"images/cleanCrossing/road.png"
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
            {   name: 'cleanSong',
                file: soundsPath + 'songs/classic_arcade.mp3'
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
				name:"paz",
				file:"images/spines/paz/paz.json"
			},
            {
				name:"assets",
				file:"images/spines/assets/assets.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 178
    var tutoGroup
    var cleanSong
    var coin
    var hand
    var tileGroup
    var itemsBaseGroup
    var assetsGroup
    var paz
    var rand 
    var moveIt
    var okBtn
    var timeAttack
    var timer
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        moveIt = false
        rand = -1
        timeAttack = false
        timer = 5000
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.cleanCrossing','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.cleanCrossing','life_box')

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
        cleanSong.stop()
        		
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
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        var background = sceneGroup.create(0, 0, "background")
        background.width = game.world.width
        background.height = game.world.height
        
        var road = sceneGroup.create(0, 0, "road") 
        road.width = game.world.width
        
        tileGroup = game.add.group()
        sceneGroup.add(tileGroup)
        
        var back = game.add.tileSprite(0, 0, game.world.width, 250, "atlas.cleanCrossing", "back")
        tileGroup.add(back)
        
        var top = game.add.tileSprite(0, back.height, game.world.width, 115, "atlas.cleanCrossing", "top")
        top.anchor.setTo(0, 1)
        tileGroup.add(top)
        
        road.y = top.y
        
        itemsBaseGroup = game.add.group()
        itemsBaseGroup.x = game.world.width
        sceneGroup.add(itemsBaseGroup)
        
        for(var i = 0; i < 4; i++){
            var row = sceneGroup.create(0, road.y + 60 + (110 * i), "atlas.cleanCrossing", "row")
            row.alpha = 0.5
            row.width = game.world.width
            
            var base = itemsBaseGroup.create(game.world.centerX + (i * 60), row.centerY, "atlas.cleanCrossing", "itemBase")
            base.anchor.setTo(0.5)
            base.gamePos = base.x
            base.correct = false
            base.inputEnabled = true
            base.events.onInputDown.add(movePaz, this)
            //base.x = game.world.width + 100
        }
        
        var bottom = game.add.tileSprite(0, game.world.height, game.world.width, 240, "atlas.cleanCrossing", "bottom")
        bottom.anchor.setTo(0, 1)
        tileGroup.add(bottom)   
    }

	function update(){
        
        if(moveIt){
            for(var j = 0; j < tileGroup.length; j++){
                tileGroup.children[j].tilePosition.x -= (3 + j)
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
        particle.makeParticles('atlas.cleanCrossing',key);
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

				particle.makeParticles('atlas.cleanCrossing',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.cleanCrossing','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.cleanCrossing','smoke');
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
            gameActive = false
            stopTimer()
            itemsBaseGroup.setAll("correct", false)
            okBtn.setAll("tint", 0x606060)
            gameActive = false
            okBtn.active = false
            win()
        })
    }
	
	function initCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.5)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0
        
        hand = game.add.sprite(0, 0, "hand")
        hand.animations.add('hand')
        hand.animations.play('hand', 24, true)
        hand.alpha = 0

    }

    function addCoin(){
        
        coin.x = paz.centerX
        coin.y = paz.centerY
        var time = 300

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function createAssets(){
        
        assetsGroup = game.add.group()
        assetsGroup.x = game.world.width
        assetsGroup.dirtySkins = ["car", "fire", "gas pipe", "motorcycle", "oil", "reactor", "stove"]
        assetsGroup.cleanSkins = ["bicycle", "electric bus", "electric shower", "electric stove", "electric train", "electric train2", "solar panels"]
        sceneGroup.add(assetsGroup)
        
        for(var i = 0; i < 4; i++){
            var anim = game.add.spine(itemsBaseGroup.children[i].centerX, itemsBaseGroup.children[i].centerY + 20, "assets")
            anim.gamePos = itemsBaseGroup.children[i].gamePos
            anim.setAnimationByName(0, "idle3", true)
            anim.setSkinByName("car")
            assetsGroup.add(anim)  
        }
    }
    
    function createOk(){
        
        okBtn = game.add.group()
        okBtn.active = false
        sceneGroup.add(okBtn)
            
        var okOn = okBtn.create(game.world.centerX, game.world.height - 180, "atlas.cleanCrossing", "Ok_on")
        okOn.alpha = 0
        okOn.anchor.setTo(0.5)
        
        var okOff = okBtn.create(game.world.centerX, game.world.height - 180, "atlas.cleanCrossing", "Ok_off")
        okOff.anchor.setTo(0.5)
        okOff.inputEnabled = true
        okOff.events.onInputDown.add(okPressed, this)
        okOff.events.onInputUp.add(okRelessed, this)
        
        okBtn.setAll("tint", 0x606060)
    }
    
    function okPressed(btn){
        
        if(gameActive && okBtn.active){
            changeImage(0, okBtn)
            okBtn.setAll("tint", 0x606060)
            gameActive = false
            okBtn.active = false
            win()
        }
    }
    
    function okRelessed(btn){
        
        changeImage(1, okBtn)
    }
    
    function peaceMaker(){
        
        paz = game.add.spine(150, game.world.centerY + 50, "paz")
        paz.scale.setTo(0.5)
        paz.setAnimationByName(0, "idle", true)
        paz.setSkinByName("normal")
        sceneGroup.add(paz)            
    }
    
    function movePaz(base){
        
        if(gameActive){
            sound.play("cut")
            itemsBaseGroup.setAll("correct", false)
            base.correct = true
            okBtn.setAll("tint", 0xffffff)
            okBtn.active = true
            game.add.tween(paz).to({y: base.centerY + 20}, 200, Phaser.Easing.linear, true)
        }
    }
    
    function win(){
        
        var ans = checkAnswer()
        
        if(timeAttack){
            stopTimer()
        }
        
        moveIt = true
        paz.setAnimationByName(0, "run", true)
        game.add.tween(itemsBaseGroup).to({x: -game.world.width * 0.4}, 1500, Phaser.Easing.linear, true).onComplete.add(function(){
            game.add.tween(itemsBaseGroup).to({x: -game.world.width}, 1000, Phaser.Easing.linear, true)
        })
        game.add.tween(assetsGroup).to({x: -game.world.width * 0.4}, 1500, Phaser.Easing.linear, true).onComplete.add(function(){
            if(ans === rand){
                sound.play("rightChoice")
                particleCorrect.x = paz.centerX
                particleCorrect.y = paz.centerY
                particleCorrect.start(true, 1200, null, 10)
            }
            else{
                particleWrong.x = paz.centerX
                particleWrong.y = paz.centerY
                particleWrong.start(true, 1200, null, 10)
            }
            game.add.tween(assetsGroup).to({x: -game.world.width}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                moveIt = false
                itemsBaseGroup.x = game.world.width
                assetsGroup.x = game.world.width
                if(ans === rand){
                    addCoin()
                    paz.setAnimationByName(0, "win", true)
                }
                else{
                    missPoint()
                    paz.setAnimationByName(0, "lose", true)
                }
                
                if(pointsBar.number === 10){
                    game.add.tween(timerGroup).to({alpha: 1}, 300, Phaser.Easing.linear, true)
                    timeAttack = true
                }
                
                if(lives !== 0){
                    game.time.events.add(1000,function(){
                        initGame()
                    },this)
                }
            })
        })
    }
    
    function checkAnswer(){
        
        for(var i = 0; i < itemsBaseGroup.length; i++){
            
            var obj = itemsBaseGroup.children[i]
            if(obj.correct){
                break
            }
        }
        return itemsBaseGroup.getIndex(obj)
    }
    
    function initGame(){
        
        riddleMeThis()
        
        game.time.events.add(1500,function(){
            moveIt = true
            paz.setAnimationByName(0, "run", true)
            game.add.tween(paz).to({y: game.world.centerY + 50}, 1500, Phaser.Easing.linear, true)
            game.add.tween(itemsBaseGroup).to({x: 0}, 1500, Phaser.Easing.linear, true)
            game.add.tween(assetsGroup).to({x: 0}, 1500, Phaser.Easing.linear, true).onComplete.add(function(){
                moveIt = false
                paz.setAnimationByName(0, "uncomfotable", true)
                if(timeAttack)
                    startTimer(timer)
                gameActive = true
            })
        },this)
    }
    
    function riddleMeThis(){
        
        rand = getRand()
        
        for(var i = 0; i < assetsGroup.length; i++){
            
            if(i !== rand){
                assetsGroup.children[i].setSkinByName(assetsGroup.dirtySkins[game.rnd.integerInRange(0, assetsGroup.dirtySkins.length-1)])
            }
            else{
                assetsGroup.children[i].setSkinByName(assetsGroup.cleanSkins[game.rnd.integerInRange(0, assetsGroup.cleanSkins.length-1)])
            }
        }
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 3)
        if(x === rand)
            return getRand()
        else
            return x     
    }
	
	return {
		
		assets: assets,
		name: "cleanCrossing",
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
                        			
            /*cleanSong = game.add.audio('cleanSong')
            game.sound.setDecodedCallback(cleanSong, function(){
                cleanSong.loopFull(0.6)
            }, this);*/
            
            initialize()
            cleanSong = sound.play("cleanSong", {loop:true, volume:0.5})
            
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
            positionTimer()
            createAssets()
            createOk()
            peaceMaker()
            createParticles()
			
			buttons.getButton(cleanSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()