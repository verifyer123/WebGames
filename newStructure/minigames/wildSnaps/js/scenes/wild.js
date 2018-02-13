
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
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
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }

        ],
        images: [
            {   name:"fondo",
				file: "images/wild/fondo.png"}
		],
		sounds: [
            {	name: "pop",
                file: soundsPath + "pop.mp3"},
		    {	name: "snapshot",
				file: soundsPath + "snapshot.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "right",
				file: soundsPath + "rightChoice.mp3"},
            {   name: "magic",
                //file: soundsPath + "gameLose.mp3"},
                file: soundsPath + "magic.mp3"},
            {   name: "gameLose",
                //file: soundsPath + "magic.mp3"}
                file: soundsPath + "gameLose.mp3"}
		]
    }

    var SKELETONS = ["cervidos", "birds"]

    var ANIMALS = {
        cervidos: {skins: ["alce", "ciervo", "corzuela", "venado"], animations: ["WALK", "RUN"], height: 200},
        birds: {skins: ["aguila", "alcon", "buho", "carpintero"], animations: ["FLY", "FLYFAST"], height: 100}
    }

    var DATA_DIRECTIONS = [
        {fromX: 500, toX: -500, fromY: 0, toY: 0}
    ]


    var ROUNDS = [
        {animal: "cervidos", skin:"alce", animation:"WALK", stop:true, duration: 10000},
        {animal: "cervidos", skin:"ciervo", animation:"RUN", duration: 5000},
        {animal: "cervidos", skin:"corzuela", animation:"RUN", duration: "timeValue", delay: 1000},
        {animal: "cervidos", skin:"venado", animation:"RUN", duration: "timeValue", delay: "random", directions:"random"},
        {animal: "birds", skin:"aguila", animation:"FLYFAST", duration: 2000, delay: 500},
        {animal: "birds", skin:"random", animation:"FLYFAST", duration: "timeValue", delay: "random", directions: "random"},
        {animal: "random", skin:"random", animation:"fast", duration: "timeValue", delay: "random", directions: "random"}
    ]

    var NUM_LIFES = 3
    
    var lives
	var sceneGroup = null
    var gameIndex = 25
    var tutoGroup
    var wildSong
    var batteryGroup = null
    var timeValue
    var quantNumber
    var numPoints
    var inputsEnabled
    var gameGroup
    var spineObj
    var roundCounter
    var camara

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        lives = NUM_LIFES
        timeValue = 4000
        quantNumber = 2
        numPoints = 0
        roundCounter = 0

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        inputsEnabled = false
        spineObj = null
        
        loadSounds()
        
	}

    function angle(directions) {
        var dy = directions.toY
        var dx = directions.toX
        var theta = Math.atan2(dy, dx) // range (-PI, PI]
        theta *= 180 / Math.PI // rads to degs, range (-180, 180]
        //if (theta < 0) theta = 360 + theta; // range [0, 360)
        return theta
    }
	
    function createSpine(params){
        var name = params.name
        var skin = params.skin
        var animation = params.animation
        var delay = params.delay || 500
        var duration = params.duration || 3000

        var directions = params.directions || {fromX: -400, fromY: 0, toX: 400, toY: 0}

        spineObj = game.add.spine(0,0, name);
        spineObj.scale.setTo(0.6,0.6)
        spineObj.rHeight = params.height
        spineObj.setAnimationByName(0, animation, true);
        spineObj.setSkinByName(skin);
        spineObj.x = directions.fromX
        spineObj.y = directions.fromY + spineObj.rHeight * 0.5
        spineObj.angle = angle(directions)
        gameGroup.add(spineObj)
        if (directions.fromX > directions.toX) {
            spineObj.scale.x = spineObj.scale.x * -1
            spineObj.angle = spineObj.angle - 180
        }

        var tween = game.add.tween(spineObj).to({x: directions.toX, y: directions.toY + spineObj.rHeight * 0.5}, duration, Phaser.Easing.Linear.none, false, delay)
        tween.onComplete.add(function () {
            missPoint()
            spineObj.alpha = 0
        })
        spineObj.tween = tween
    }
    
    function createSnapsUI() {

        camara = sceneGroup.create(game.world.centerX,game.world.centerY,'atlas.wild','camaraBox')
        camara.anchor.setTo(0.5, 0.5)
        
    }
    
    function checkCorrect() {

        var rectangle = camara.getBounds()
        rectangle.inflate(20, 20)
        var rectangle2 = spineObj.getBounds()
        var contains = rectangle.containsRect(rectangle2)

        if(contains){
            sound.play("right")
            createPart("star", spineObj)
            numPoints++
            addPoint(1)
            var tweenSpine = game.add.tween(spineObj).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 400)
            tweenSpine.onComplete.add(function () {
                startRound()
            })
            timeValue-=timeValue * 0.08
            roundCounter++
            // addPoint(1)
        } else {
            createPart("wrong", spineObj)
            missPoint()
        }

    }
    
    function snap(inputRect) {
        inputsEnabled = false
        spineObj.tween.stop()
        // spineObj.endTime = 0
        spineObj.autoUpdate = false
        sound.play("snapshot")
        var snap = game.add.tween(inputRect).to({alpha: 1}, 200, Phaser.Easing.Cubic.Out, true)
        snap.onComplete.add(function () {
            var fadeIn = game.add.tween(inputRect).to({alpha: 0}, 1000, Phaser.Easing.Cubic.In, true)
            fadeIn.onComplete.add(function () {
                checkCorrect()
            })
        })
    }
    
    // function createGameObjects(){
    //     pullGroup = game.add.group()
    //     pullGroup.x = -game.world.centerX * 2
    //     pullGroup.y = -game.world.centerY * 2
    //     sceneGroup.add(pullGroup)
    //     pullGroup.alpha = 0
    //
    // }
    
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
        particlesGood.y = -obj.height * 2;
        particlesGood.start(true, 1000, null, 4);

        obj.add(particlesGood)
        obj.particle = particlesGood
        
    }

    function stopGame(){

        wildSong.stop()
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
        game.load.spine('birds', "images/spines/aves/aves.json")
        game.stage.disableVisibilityChange = false;
        game.load.audio('wildSong', soundsPath + 'songs/forestAmbience.mp3');
        
        /*game.load.image('introscreen',"images/wild/introscreen.png")
		game.load.image('howTo',"images/wild/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/wild/play" + localization.getLanguage() + ".png")*/

        buttons.getImages(game)


        game.load.spine('cervidos', "images/spines/cervidos/cervidos.json")

        game.load.image('tutorial_image',"images/wild/tutorial_image.png")
        //loadType(gameIndex)

    }

    function addNumberPart(obj,number){

        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)

        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.Linear.none,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.Linear.none,true,500)

        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

    }
    
    function getRandomDirections(skeleton) {
        var direction = game.rnd.integerInRange(0, 1) * 2 - 1
        var fromY = 0
        if (skeleton === "birds")
            fromY = game.rnd.integerInRange(-800, 800)

        var directions = {
            fromX : 400 * direction,
            toX : 400 * direction * -1,
            fromY : fromY,
            toY : fromY * -1
        }

        return directions
    }
    
    function startRound() {
        roundCounter = roundCounter < ROUNDS.length ? roundCounter : ROUNDS.length - 1

        var round = ROUNDS[roundCounter]
        var skeleton = round.animal
        var animal = ANIMALS[skeleton]
        if(skeleton === "random") {
            var rndNum = game.rnd.integerInRange(0, SKELETONS.length + 1) //probabilty is higher for birds
            rndNum = rndNum > SKELETONS.length - 1 ? SKELETONS.length - 1 : rndNum //truncate to birds if rndNum is higher
            skeleton = SKELETONS[rndNum]
            animal = ANIMALS[skeleton]
        }

        var directions = round.directions
        var delay = round.delay
        var duration = round.duration
        var skin = round.skin
        var animation = round.animation

        if (duration === "timeValue")
            duration = timeValue
        if (delay === "random")
            delay = game.rnd.integerInRange(0, 2000)
        if (skin === "random"){
            skin = animal.skins[game.rnd.integerInRange(0, animal.skins.length - 1)]
        }
        if (directions === "random")
            directions = getRandomDirections(skeleton)
        if (animation === "fast")
            animation = animal.animations[animal.animations.length - 1]

        var params = {
            name: skeleton, skin: skin,
            animation: animation,
            directions: directions, delay: delay, duration: duration,
            height: animal.height
        }
        createSpine(params)
        inputsEnabled = true

        spineObj.tween.start()
    }

    function missPoint(){
        
        sound.play("wrong")
        inputsEnabled = false
        
        var currentBatteryBar = batteryGroup.lifes.length - lives
        var batteryBar = batteryGroup.lifes[currentBatteryBar]
        lives--;

        var scaleTween = game.add.tween(batteryGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.Cubic.In, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(batteryGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function () {
                game.add.tween(batteryBar).to({alpha: 0}, 400, Phaser.Easing.Cubic.In, true)
            })
        })
        
        if(lives === 0){
            stopGame(false)
        }
        else{
            var tweenSpine = game.add.tween(spineObj).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true)
            tweenSpine.onComplete.add(function () {
                startRound()
            })
        }
        
        // addNumberPart(batteryGroup,'-1')
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
        pointsBar.x = 200
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

    function createBattery(localX){
        
        batteryGroup = game.add.group()
        batteryGroup.x = localX
        batteryGroup.y = 10
        sceneGroup.add(batteryGroup)

        var heartImg = batteryGroup.create(0,0,'atlas.wild','battery')
        heartImg.anchor.setTo(1,0)
        heartImg.scale.setTo(0.72, 0.72)
        // heartsGroup.x = heartsGroup.x - heartImg.width

        var pivotX = -heartImg.width + 62
        batteryGroup.lifes = []

        for (var lifeIndex = 0; lifeIndex < NUM_LIFES; lifeIndex++){
            var bar = new Phaser.Graphics(game)
            bar.beginFill(0x00ff00)
            bar.drawRect(0,0,22,43)
            bar.endFill()
            bar.x = pivotX - (lifeIndex * 24)
            bar.y = 13
            batteryGroup.add(bar)
            batteryGroup.lifes.push(bar)
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
        
        tutoGroup.y = -game.world.height
        inputsEnabled = true
        startRound()

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

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
        
        /*var rect = new Phaser.Graphics(game)
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
		playText.anchor.setTo(0.5,0.5)*/
    }
    
	return {
		assets: assets,
		name: "wild",
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){

			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

            var background = sceneGroup.create(game.world.centerX,game.world.centerY,'fondo')
            background.anchor.setTo(0.5,0.5)

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

            var inputRect = new Phaser.Graphics(game)
            inputRect.beginFill(0xffffff)
            inputRect.drawRect(0,0,game.world.width * 2,game.world.height * 2)
            inputRect.endFill()
            inputRect.alpha = 0
            sceneGroup.add(inputRect)
            inputRect.inputEnabled = true
            inputRect.events.onInputDown.add(function(){
                if(inputsEnabled) {
                    snap(inputRect)
                }
            })

            var tileWidth = game.world.width - game.world.centerX - background.width * 0.5 + 1
            var tileLeftBg = game.add.tileSprite(0 , 0, tileWidth, background.height, "atlas.wild", "bush")
            sceneGroup.add(tileLeftBg)
            tileLeftBg.tilePosition.x = tileWidth % 256

            var tileRightBg = game.add.tileSprite(background.x + background.width * 0.5 , 0, tileWidth, background.height, "atlas.wild", "bush")
            sceneGroup.add(tileRightBg)
            var offset = 256 - tileWidth % 256
            tileRightBg.tilePosition.x = tileWidth % 256 + offset

            // var blackLeft = new Phaser.Graphics(game)
            // blackLeft.beginFill(0x000000)
            // blackLeft.drawRect(0,0,game.world.width *0.5 - background.width * 0.5, game.world.height *2)
            // blackLeft.endFill()
            // sceneGroup.add(blackLeft)
            //
            // var blackRight = new Phaser.Graphics(game)
            // blackRight.beginFill(0x000000)
            // blackRight.drawRect(game.world.width *0.5 + background.width * 0.5,0,game.world.width *0.5 - background.width * 0.5, game.world.height *2)
            // blackRight.endFill()
            // sceneGroup.add(blackRight)
            
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
            createBattery(game.world.centerX + background.width * 0.5)
            createPointsBar()
            // createGameObjects()
            createTutorial()

            buttons.getButton(wildSong,sceneGroup, game.world.centerX * 0.5 + 70 , 30)
		}
	}
}()