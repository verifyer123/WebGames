
var soundsPath = "../../shared/minigames/sounds/"
var wild = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?"
		}
	}
    

	var assets = {
        atlases: [
            {   
                name: "atlas.wild",
                json: "images/wild/atlas.json",
                image: "images/wild/atlas.png"
            }
        ],
        images: [
            {   name:"fondo",
				file: "images/wild/fondo.png"}
		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "combo",
				file: soundsPath + "combo.mp3"},
            {	name: "flip",
				file: soundsPath + "flipCard.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "right",
				file: soundsPath + "rightChoice.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"}
		]
    }

    var NUM_LIFES = 3
    
    var lives
	var sceneGroup = null
    var gameIndex = 25
    var tutoGroup
    var wildSong
    var heartsGroup = null
    var pullGroup = null
    var clock
    var timeValue
    var quantNumber
    var numPoints
    var inputsEnabled
    var pointsBar
    var gameGroup
    var spineObj

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        lives = NUM_LIFES
        timeValue = 7
        quantNumber = 2
        numPoints = 0

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        inputsEnabled = false
        spineObj = null
        
        loadSounds()
        
	}

    function addPoint(number){

        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)

        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        addNumberPart(pointsBar.text,'+' + number)

        // if(pointsBar.number % 2 == 0){
        timeValue-=timeValue * 0.10
        // }

    }

    function createPointsBar(){

        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)

        var pointsImg = pointsBar.create(-10,10,'atlas.wild','xpcoins')
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

    function createSpine(){
        spineObj = game.add.spine(0,0, "bird");
        spineObj.scale.setTo(0.6,0.6)
        spineObj.setAnimationByName(0, "FLY", true);
        spineObj.setSkinByName('alcon');
        spineObj.x = -500
        gameGroup.add(spineObj)
    }
    
    function createSnapsUI() {
        gameGroup = game.add.group()
        gameGroup.x = game.world.centerX
        gameGroup.y = game.world.centerY
        sceneGroup.add(gameGroup)

        var rectTop = new Phaser.Graphics(game)
        rectTop.beginFill(0x000000)
        rectTop.drawRect(game.world.centerX - game.world.width * 0.5,game.world.bounds.top, game.world.width, 100)
        // rectTop.anchor.setTo(0.5, 0.5)
        rectTop.endFill()
        sceneGroup.add(rectTop)

        var rectBot = new Phaser.Graphics(game)
        rectBot.beginFill(0x000000)
        rectBot.drawRect(game.world.centerX - game.world.width * 0.5,game.world.bounds.bottom - 100, game.world.width, 100)
        // rectTop.anchor.setTo(0.5, 0.5)
        rectBot.endFill()
        sceneGroup.add(rectBot)

        var camara = gameGroup.create(0,0,'atlas.wild','camaraBox')
        camara.anchor.setTo(0.5, 0.5)
        
    }
    
    function createGameObjects(){
        pullGroup = game.add.group()
        pullGroup.x = -game.world.centerX * 2
        pullGroup.y = -game.world.centerY * 2
        sceneGroup.add(pullGroup)
        pullGroup.alpha = 0

        createSpine()

    }
    
    function createPart(key,obj){

        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.wild',key);
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.2;
        particlesGood.maxParticleScale = 1;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        // particlesGood.x = obj.x;
        // particlesGood.y = obj.y;
        particlesGood.start(true, 1000, null, 2);

        obj.add(particlesGood)
        obj.particle = particlesGood
        
    }

    function stopGame(win){
                
        //objectsGroup.timer.pause()
        //timer.pause()
        wildSong.stop()
        clock.tween.stop()
        inputsEnabled = false
        
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 750)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, numPoints, gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
            sound.play("gameLose")
		})
    }
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;
        game.load.audio('wildSong', soundsPath + 'songs/wormwood.mp3');
        
        game.load.image('introscreen',"images/wild/introscreen.png")
		game.load.image('howTo',"images/wild/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/wild/play" + localization.getLanguage() + ".png")

        game.load.spine('bird', "images/spines/aves/skeleton.json")
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

    function startRound(notStarted) {


    }

    function missPoint(){
        
        sound.play("wrong")
        inputsEnabled = false
        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives === 0){
            stopGame(false)
        }
        else{
            startRound()
        }
        
        addNumberPart(heartsGroup.text,'-1')
    }

    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.x = game.world.width
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)

        var heartImg = heartsGroup.create(0,0,'atlas.wild','battery')
        heartImg.anchor.setTo(1,0)
        heartImg.scale.setTo(0.72, 0.72)

        var pivotX = -heartImg.width + 62

        for (var lifeIndex = 0; lifeIndex < NUM_LIFES; lifeIndex++){
            var bar = new Phaser.Graphics(game)
            bar.beginFill(0x00ff00)
            bar.drawRect(0,0,22,43)
            bar.endFill()
            bar.x = pivotX - (lifeIndex * 24)
            bar.y = 13
            heartsGroup.add(bar)
        }
        
        // var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        // var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        // pointsText.x = pivotX
        // pointsText.y = heartImg.height * 0.15
        // pointsText.setText('X ' + lives)
        // heartsGroup.add(pointsText)
        //
        // pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        // heartsGroup.text = pointsText
                
    }

    function onClickPlay(rect) {
        rect.inputEnabled = false
        sound.play("pop")
        game.add.tween(tutoGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){

            tutoGroup.y = -game.world.height
            inputsEnabled = true
            var move = game.add.tween(spineObj).to({x: 500}, 1500, function(k){spineObj.y = Math.sin(k * 25) * 20; return k}, true)
            // startTimer(missPoint)
        })
    }
    
    // function update() {
    //     if (inputsEnabled){
    //         spineObj.x += 5
    //         spineObj.y += Math.sin(game.time.now) * 25
    //     }
    // }

    function createTutorial(){
        
        tutoGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(tutoGroup)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            onClickPlay(rect)
            
        })
        
        tutoGroup.add(rect)
        
        var plane = tutoGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.wild','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		//console.log(inputName)
		var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.wild',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.wild','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
	return {
		assets: assets,
		name: "wild",
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()

            var blackBg = new Phaser.Graphics(game)
            blackBg.beginFill(0x000000)
            blackBg.drawRect(0,0,game.world.width *2, game.world.height *2)
            blackBg.endFill()
            sceneGroup.add(blackBg)
            var background = sceneGroup.create(game.world.centerX,game.world.centerY,'fondo')
            background.anchor.setTo(0.5,0.5)
            
            wildSong = game.add.audio('wildSong')
            game.sound.setDecodedCallback(wildSong, function(){
                wildSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()

            createSnapsUI()
            createHearts()
            // createPointsBar()
            createGameObjects()
            startRound(true)
            createTutorial()
            
		}
	}
}()