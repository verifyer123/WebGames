
var soundsPath = "../../shared/minigames/sounds/"

var space = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.space",
                json: "images/space/atlas.json",
                image: "images/space/atlas.png",
            },

        ],
        images: [
            {   name:"fondo",
				file: "images/space/fondo.png"},
            {   name:"tutorial_image",
				file: "images/space/tutorial_image.png"},
		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "magic.mp3"},
            {	name: "powerup",
				file: soundsPath + "powerup.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "fall",
				file: soundsPath + "falling.mp3"},
            {	name: "splash",
				file: soundsPath + "splash.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "shootBall",
				file: soundsPath + "shootBall.mp3"},
            {	name: "spaceSong",
				file: soundsPath + "songs/space_music.mp3"},
		],
        spritesheets: [
            {   name: "coin",
                file: "images/spines/coin.png",
                width: 122,
                height: 123,
                frames: 12
            },
            {   name: "splash",
                file: "images/spines/splash.png",
                width: 240,
                height: 190,
                frames: 13
            }
        ],
        spines:[
			{
				name:"master",
				file:"images/spines/skeleton1.json"
			}
		]
    }
    
    var CARD_TIME = 300
    
    var WORDS = [
        ['alberca',['pool','watermelon']],
        ['detenerse',['stop','detention']],
        ['noticias',['news','notice']],
        ['gato',['cat','kit']],
        ['dinero',['money','diner']],   
        ['ratón',['mouse','ratchet']],
        ['horno',['oven','horn']],
        ['árbol',['tree','three']],
        ['casa',['house','case']],
        ['pelota',['ball','bowl']],
        ['camioneta',['truck','track']],
        ['brazo',['arm','armory']],
        ['cena',['dinner','diner']],
        ['cuerno',['horn','corn']],
        ['fecha',['date','fetch']],   
        ['arma',['gun','arm']],
        ['cartón',['cardboard','cartoon']],
        ['respuesta',['answer','contest']],
        ['pan',['bread','pan']],
        ['once',['eleven','once']],
        ['advertir',['to warn','advertise']],
        ['leche',['milk','leech']],
        ['uvas',['grapes','grapefruits']],
        ['cuchara',['spoon','spun']],
        ['choque',['crash','shock']],
        ['casa árbol',['treehouse','threehouse']],
        ['ganso',['goose','gang']],
        ['borrego',['sheep','ship']],
        ['lluvia',['rain','rein']],
        ['leche',['milk','leech']],
        ['sandía',['watermelon','sandy']],
    ]
    
    var lives = null
	var sceneGroup = null
    var pointsGroup = null
    var gameActive
    var arrayComparison = null
    var overlayGroup
    var dojoSong
    var master
    var quantNumber
    var numberIndex = 0
    var numberToCheck
    var addNumber
    var barTime
    var lastObj
    var cardsGroup, barGroup, waterGroup
    var timer
    var cardsNumber
    var maxNumber
    var answerIndex
    var selectGroup
    var comboCount
    var wordGroup
    var gameIndex = 1
    var clock
    var timeValue
    var particleCorrect, particleWrong
    var coin

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        cardsNumber = 4
        maxNumber = 3
        lives = 3
        quantNumber = 0
        arrayComparison = []
        comboCount = 0
        numberIndex = 0
        timeValue = 7
        barTime = 15000
        answerIndex = 0
        
    
        shuffleList()    
        loadSounds()
        
	}
    
    function shuffleList(){
        
        Phaser.ArrayUtils.shuffle(WORDS)
    }
    
    function setWords(){
        
        var gameIndex = answerIndex
        
        //console.log(gameIndex + ' index')
        wordGroup.text.setText(WORDS[gameIndex][0])
        
        var list = []
        
        for(var i = 0; i < WORDS[gameIndex][1].length;i++){
            list[i] = i
        }
        
        Phaser.ArrayUtils.shuffle(list)
        
        for( var i = 0; i<cardsGroup.length;i++){
            
            var card = cardsGroup.children[i]
            
            card.correct = false
            if(list[i] == 0){
                card.correct = true
            }
            card.text.setText(WORDS[gameIndex][1][list[i]])
        }

    }

    function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
        },this)
    }
    
    function animateShip(){
        
        var timeToUse = 200
        var soundToPlay = 'shootBall'
        if(barGroup.bar.scale.y < 0.83){
            soundToPlay = 'powerup'
            timeToUse = 700
        }
        
        sound.play(soundToPlay)
        game.add.tween(barGroup.bar.scale).to({y:1},timeToUse,"Linear",true)
        
        game.add.tween(master).to({y:game.world.centerY - 225},timeToUse,"Linear",true).onComplete.add(function(){
            
            gameActive = true
            barGroup.tween = game.add.tween(barGroup.bar.scale).to({y:0},barTime,Phaser.Easing.linear,true)
            barGroup.tween.onComplete.add(function(){

                missPoint()
                particleWrong.x = master.centerX 
                particleWrong.y = master.centerY
                particleWrong.start(true, 1200, null, 8)
                master.tween.stop()
                showAssets(false)
                game.time.events.add(1000,function(){
                    if(lives !== 0){
                        showAssets(true)
                    }
                    else
                        fallWater()
                })

            })
                
            master.tween = game.add.tween(master).to({y:game.world.height - 200},barTime,Phaser.Easing.linear,true)
        })
        
        
    }
    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

    }
    
    function showAssets(show){
        
        if(show){
            
            setWords()
            //barGroup.bar.scale.y = 1
        }
                
        var delay = 400
        
        if(!show){
            delay = 1000
        }
        
        var items = [cardsGroup,wordGroup]
        
        if(answerIndex == 0){ items[items.length] = barGroup}
        
        for( var i = 0; i < items.length; i ++){
            
            var item = items[i]
            
            if(i == 0){
                for(var u = 0; u < item.length;u++){
                    if(show){
                        popObject(item.children[u],delay)
                    }else{
                        game.add.tween(item.children[u]).to({alpha:0},250,Phaser.Easing.linear,true,delay * 0.5)
                    }
                    delay+=200
                }
            }else{
                if(show){
                    popObject(item,delay)
                }else{
                    game.add.tween(item).to({alpha:0},250,Phaser.Easing.linear,true,delay * 0.5)
                }
                delay+=200
            }
                
        }
        
        game.time.events.add(delay - 100, function(){
            
            if(show){
                
                animateShip()
            }
        })
        
    }
    
    function fallWater(){
        
        sound.play('fall')
                
        //missPoint()
        
        master.tween.stop()

        var FALL_TIME = 700
        
        game.add.tween(barGroup.bar.scale).to({y:0},FALL_TIME,"Linear",true)
        game.add.tween(master).to({y:master.y-50, angle:master.angle},300,Phaser.Easing.linear,true).onComplete.add(function(){
	        game.add.tween(master).to({y:game.world.height - 100, angle:master.angle + 15},FALL_TIME-300,Phaser.Easing.linear,true).onComplete.add(function(){
	            
	            sound.stop('fall')
	            sound.play("splash")
	            
	            createSplash(master)
	            master.setAnimationByName(0,"LOSE",true)
	            
	            game.add.tween(master).to({y:master.y +35},2000,Phaser.Easing.linear,true)
	            
	            showAssets(false)

	            game.time.events.add(1000,function(){
	                if(gameActive){
	                    showAssets(true)
	                }
	            })
	        },this)
	    },this)
    }
    
    function createSplash(obj){
        
        var object = game.add.sprite(obj.x, obj.y - 50, 'splash');
        object.anchor.setTo(0.5,0.5)
        sceneGroup.add(object)
        object.animations.add('walk');
        object.animations.play('walk',24,false);
        
        game.add.tween(object.scale).from({x:0.01,y:0.01},500,Phaser.Easing.linear,true)
        game.add.tween(object).to({alpha:0},200,Phaser.Easing.linear,true,300)
        
    }
    
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    } 
    
    function addLive(){
        
        sound.play("pop")
        
        lives++;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 1.2,y:1.2}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(heartsGroup.text,'+1')
        
    }
    
    function addNumberPart(obj,number){
        
        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)
        
        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
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
            stopGame()
        }
        
        addNumberPart(heartsGroup.text,'-1')
        
    }
    
    function addPoint(number){
        
        sound.play("pop")
        
        master.tween.stop()
        master.tween = null
        
        answerIndex++
        
        if(answerIndex >= WORDS.length){
            answerIndex = 0
            shuffleList()
        }
        
        master.setAnimationByName(0, "WINSTILL", true);
        master.addAnimationByName(0,"IDLE",true)
        
        var tween = game.add.tween(master).to({y:master.y-100},500,Phaser.Easing.linear,true,0,3)
        tween.yoyo(true, 0);
        
        game.time.events.add(1200,function(){
            
            tween.stop()
        },this)
        
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number)
        
        if(pointsBar.number % 2 == 0){
            
            if(barTime > 1000){
                barTime-= 500
            }
            
        }
        
    }
    
    function inputCard(obj){

        if(!gameActive){ 
            return
        }
        
        if( obj.pressed == true){
            return
        }
        
        //obj.pressed = false
        
        if(barGroup.tween){
            barGroup.tween.stop()
        }
        
        gameActive = false
        
        var parent = obj.parent.parent
        
        var tween = game.add.tween(parent.scale).to( { x:0.8, y:0.8}, 200, Phaser.Easing.linear, true);
        tween.yoyo(true, 0);
        
        if(parent.correct){
            
            addCoin(parent)
            particleCorrect.x = parent.centerX 
            particleCorrect.y = parent.centerY
            particleCorrect.start(true, 1200, null, 8)
            
            showAssets(false)
            game.time.events.add(1000,function(){
                showAssets(true)
            })
        }else{
            master.angle = -45
            game.add.tween(master).to({angle: 45},250,Phaser.Easing.linear,true,0,2,true).onComplete.add(function(){
                master.angle = 0
            })
            
            missPoint()
            particleWrong.x = parent.centerX 
            particleWrong.y = parent.centerY
            particleWrong.start(true, 1200, null, 8)
            master.tween.stop()
            showAssets(false)
            game.time.events.add(1000,function(){
                if(lives !== 0){
                    showAssets(true)
                }
                else
                    fallWater()
            })
        }
        
    }
    
    function createCards(){
        
        cardsGroup = game.add.group()
        sceneGroup.add(cardsGroup)
        
        var pivotX = game.world.centerX - 50 
        var pivotY = game.world.centerY - 50
        for(var i = 0; i< 2; i++){
            
            var group = game.add.group()
            group.x = pivotX
            group.y = pivotY
            group.alpha = 0
            cardsGroup.add(group)
            
            pivotY+= 150
            
            var groupImages = game.add.group()
            group.add(groupImages)
            
            for(var u = 0; u < 3; u++){
                
                var card = groupImages.create(0,0,'atlas.space','card' + u)
                card.anchor.setTo(0.5,0.5)
                
                if(u == 0){
                    card.pressed = false
                    card.inputEnabled = true
                    card.events.onInputDown.add(inputCard)
                }
            }
            
            group.images = groupImages
            
            changeImage(0,groupImages)
            
            var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
            var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "word", fontStyle)
            pointsText.anchor.setTo(0.5,0.5)
            group.add(pointsText)
                        
            group.text = pointsText
        }
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.space','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.space','life_box')

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
                
        //objectsGroup.timer.pause()
        gameActive = false
        //timer.pause()
        dojoSong.stop()
        sound.play("gameLose")
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2000)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function createBoard(){
        
        barGroup = game.add.group()
        barGroup.x = game.world.centerX - 250
        barGroup.y = game.world.centerY
        barGroup.alpha = 0
        barGroup.tween = null
        sceneGroup.add(barGroup)
        
        var barContainer = barGroup.create(0,0,'atlas.space','time')
        barContainer.anchor.setTo(0.5,0.5)
        
        var barImage = barGroup.create(0,barContainer.height * 0.45,'atlas.space','timebar')
        barImage.anchor.setTo(0.5,1)
        barImage.scale.y = 0.5
        barGroup.bar = barImage
        
        wordGroup = game.add.group()
        wordGroup.alpha = 0
        wordGroup.x = game.world.centerX -50
        wordGroup.y = game.world.centerY - 250
        sceneGroup.add(wordGroup)
        
        var wordImage = wordGroup.create(0,0,'atlas.space','display')
        wordImage.anchor.setTo(0.5,0.5)
        
        var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 15, "palabra", fontStyle)
        pointsText.anchor.setTo(0.5,0.5)
        wordGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        wordGroup.text = pointsText
                
    }
    
    function preload(){
        
        game.stage.disableVisibilityChange = false
    }
	
	function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
    }

    function onClickPlay(){
        overlayGroup.y = -game.world.height
        showAssets(true)
    }
    
    function createWater(){
        
        waterGroup = game.add.group()
        waterGroup.y = game.world.height
        sceneGroup.add(waterGroup)
        
        var pivotX = 0
        
        while(pivotX < game.world.width){
            
            var water = waterGroup.create(pivotX,0,'atlas.space','tile')
            water.anchor.setTo(0,1)
            pivotX+=water.width
        }
                
        var tween = game.add.tween(waterGroup.scale).to( { y:1.2 }, 800, Phaser.Easing.linear, true, 0,-1);

        tween.yoyo(true, 0);
        
    }
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('smoke')
        sceneGroup.add(particleWrong)
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.space',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
        return particle
    }
    
    function createCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.8)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0
    }

    function addCoin(obj){
        
        coin.x = obj.centerX
        coin.y = obj.centerY
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
    
	return {
		assets: assets,
		name: "space",
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
            
            var background = sceneGroup.create(-2,-2,'fondo')
            background.width = game.world.width+2
            background.height = game.world.height+2
            
            dojoSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(dojoSong, function(){
                dojoSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
        
            createBoard()
            createCards()
            createWater()
            
            master = game.add.spine(game.world.centerX + 250,game.world.centerY + 50, "master");
            master.initY = master.y
            master.scale.setTo(2.5,2.5)
            master.setAnimationByName(0, "IDLE", true);
            master.setSkinByName('normal');
            sceneGroup.add(master)
            
            createHearts()
            createPointsBar()
            createParticles()
            createCoin()
            
			buttons.getButton(dojoSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
	}
}()