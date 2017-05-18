
var soundsPath = "../../shared/minigames/sounds/"
var snooze = function(){
    
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
                name: "atlas.snooze",
                json: "images/snooze/atlas.json",
                image: "images/snooze/atlas.png"
            }
        ],
        images: [
            {   name:"fondo",
				file: "images/snooze/fondo.png"}
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
    var MAX_OBJS = 20
    var OBJECTS = ["watch", "bell"]

    var ROUNDS = [
        {continent: "america", flags: ["mexico", "usa"]},
        {continent: "america", numFlags: 4},
        {continent: "random", numFlags: 4}]
    
    var lives
	var sceneGroup = null
    var gameIndex = 29
    var tutoGroup
    var snoozeSong
    var heartsGroup = null
    var pullGroup = null
    var timeValue
    var quantNumber
    var numPoints
    var inputsEnabled
    var pointsBar
    var roundCounter
    var objectList
    var gameGroup
    var airplane
    var gameUpdate
    var eruptionSheet
    var spineGroup
    var timeElapsed
    var currentTime

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameUpdate = false
        lives = NUM_LIFES
        timeValue = 7
        quantNumber = 2
        numPoints = 0
        roundCounter = 0
        objectList = []

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        inputsEnabled = false
        timeElapsed = 0
        currentTime = 0
        
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

        var pointsImg = pointsBar.create(-10,10,'atlas.snooze','xpcoins')
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

    function erupte(){
        var eruption = spineGroup.spine.addAnimationByName(0, "ERUPTION", false)
        spineGroup.spine.addAnimationByName(0, "ERUPTIONSTILL", true)
        game.add.tween(spineGroup.smoke).to({alpha: 0}, 500, Phaser.Easing.Quadratic.Out, true)

        eruption.onComplete = function () {
            if (!spineGroup.isErupted) {
                spineGroup.isErupted = true
                console.log("complete")
                eruptionSheet.animations.play('explode', 20, true)
                spineGroup.add(eruptionSheet)
                eruptionSheet.x = 0
                eruptionSheet.y = -spineGroup.spine.height - 50
            }
        }
    }

    function createSpine() {
        spineGroup = game.add.group()
        spineGroup.x = game.world.centerX
        spineGroup.y = game.world.bounds.bottom - 120
        sceneGroup.add(spineGroup)

        var spineObj = game.add.spine(0, 0, "volcan")
        spineObj.scale.setTo(0.8,0.8)
        spineObj.setSkinByName("crater")
        spineObj.setAnimationByName(0, "IDLE", true)
        spineGroup.add(spineObj)

        spineObj.erupte = erupte

        var smokeSheet = game.add.sprite(512, 512, 'smoke')
        smokeSheet.animations.add('idle')
        smokeSheet.x = 0
        smokeSheet.y = -spineObj.height - 50
        smokeSheet.anchor.setTo(0.5, 0.5)
        smokeSheet.animations.play('idle', 10, true)
        spineGroup.add(smokeSheet)
        spineGroup.smoke = smokeSheet

        spineGroup.spine = spineObj

    }
    
    function createGameObjects(){
        pullGroup = game.add.group()
        pullGroup.x = -game.world.centerX * 2
        pullGroup.y = -game.world.centerY * 2
        sceneGroup.add(pullGroup)
        pullGroup.alpha = 0

        gameGroup = game.add.group()
        gameGroup.x = game.world.centerX
        gameGroup.y = game.world.centerY
        sceneGroup.add(gameGroup)

        for (var objIndex = 0; objIndex < MAX_OBJS; objIndex++){
            var numObjIndex = objIndex % OBJECTS.length
            var objImg = OBJECTS[numObjIndex]
            var obj = pullGroup.create(0,0,'atlas.snooze', objImg)
            obj.anchor.setTo(0.5, 0.5)
            objectList.push(obj)
        }

        airplane = sceneGroup.create(-400, 100, "atlas.snooze", "plane")
        airplane.scale.setTo(0.8, 0.8)
        airplane.anchor.setTo(0.5, 0)
        airplane.direction = 1

        eruptionSheet = game.add.sprite(1024, 1024, 'eruption')
        eruptionSheet.animations.add('explode')
        eruptionSheet.anchor.setTo(0.5, 0.5)
        pullGroup.add(eruptionSheet)

    }
    
    function createPart(key,obj){

        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.snooze',key);
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
        snoozeSong.stop()
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
        game.load.audio('dojoSong', soundsPath + 'songs/wormwood.mp3');
        
        game.load.image('introscreen',"images/snooze/introscreen.png")
		game.load.image('howTo',"images/snooze/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/snooze/play" + localization.getLanguage() + ".png")

        game.load.spine('volcan', "images/spines/volcan/skeleton.json")
        game.load.spritesheet('eruption', 'images/snooze/volcanoExplosion.png', 256, 256, 14)
        game.load.spritesheet('smoke', 'images/snooze/volcanoBubbles.png', 128, 128, 15)
        
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

        // var currentRound = ROUNDS[roundCounter]
        // roundCounter = roundCounter < ROUNDS.length - 1 ? roundCounter + 1 : ROUNDS.length - 1
        var toX = game.world.centerX - 100 * airplane.direction
        var duration = Math.abs(toX - game.world.width)

        airplane.tween = game.add.tween(airplane).to({x: toX}, duration, Phaser.Easing.Sinusoidal.InOut, true, 600)
        airplane.tween.onComplete.add(function () {
            gameUpdate = true
            timeElapsed = 0
            spineGroup.spine.addAnimationByName(0, "NERVOUS", true, 0.5)
        })
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
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.snooze','life_box')

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

    function onClickPlay(rect) {
        rect.inputEnabled = false
        sound.play("pop")
        game.add.tween(tutoGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){

            tutoGroup.y = -game.world.height
            startRound()
        })
    }
    
    function update() {
        if (gameUpdate){
            var airplaneWidth = Math.abs(airplane.width * 0.5)
            if ((airplane.x > game.world.width - airplaneWidth)||(airplane.x < airplaneWidth)){
                // airplane.x = game.world.width - airplane.width * 0.5
                airplane.direction = airplane.direction * -1
                airplane.scale.x *= -1
            }
            airplane.x += 5 * airplane.direction

            timeElapsed += game.time.elapsedMS
            console.log(timeElapsed)
            if (timeElapsed >= 12000){
                gameUpdate = false
                var toX = airplane.direction > 0 ? game.world.width + 400 : -400
                var duration = Math.abs(airplane.x - toX)
                var tween = game.add.tween(airplane).to({x: toX}, duration, Phaser.Easing.Quadratic.In, true)
                tween.onComplete.add(function () {
                    spineGroup.spine.addAnimationByName(0, "IDLE", true)
                    airplane.direction = airplane.direction * -1
                    airplane.scale.x = airplane.scale.x * -1
                    startRound()
                })
            }
        }
    }

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
		
		var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.snooze','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		//console.log(inputName)
		var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.snooze',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.snooze','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
	return {
		assets: assets,
		name: "snooze",
        preload:preload,
        update:update,
		create: function(event){
            
			sceneGroup = game.add.group()
            
            var background = game.add.tileSprite(0 , 0, game.world.width, game.world.height, "fondo")
            background.width = game.world.width+2
            background.height = game.world.height+2
            sceneGroup.add(background)

            var ocean = game.add.tileSprite(game.world.centerX, game.world.bounds.bottom, game.world.width, 509, 'atlas.snooze', 'mar')
            ocean.anchor.setTo(0.5, 1)
            sceneGroup.add(ocean)
            
            snoozeSong = game.add.audio('dojoSong')
            game.sound.setDecodedCallback(snoozeSong, function(){
                snoozeSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()

            createSpine()
            createHearts()
            createPointsBar()
            createGameObjects()
            createTutorial()
            
		}
	}
}()