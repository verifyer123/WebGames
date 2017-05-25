
var soundsPath = "../../shared/minigames/sounds/"
var feed = function(){
    
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
                name: "atlas.feed",
                json: "images/feed/atlas.json",
                image: "images/feed/atlas.png"
            }
        ],
        images: [
            {   name:"fondo",
				file: "images/feed/fondo.png"}
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
    var MAX_NUM_BRICKS = 20
    var CONTAINERS = ["container_a", "container_b"]
    var BRICK_HEIGHT = 82

    var ROUNDS = [
        {continent: "america", flags: ["mexico", "usa"]},
        {continent: "america", numFlags: 4},
        {continent: "random", numFlags: 4}]
    
    var lives
	var sceneGroup = null
    var gameIndex = 30
    var tutoGroup
    var feedSong
    var heartsGroup = null
    var pullGroup = null
    var numPoints
    var inputsEnabled
    var pointsBar
    var brickList
    var bricksInGame
    var numSpaces
    var gameGroup
    var maxHeight

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        lives = NUM_LIFES
        numPoints = 0
        brickList = []
        bricksInGame = []
        numSpaces = Math.floor(game.world.height / BRICK_HEIGHT)

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        inputsEnabled = false
        maxHeight = game.world.height - 178
        
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
        // timeValue-=timeValue * 0.10
        // }

    }
    
    function createBrick(index) {
        var containerGroup = game.add.group()
        containerGroup.x = 0
        containerGroup.y = 0

        var brickName = CONTAINERS[index % 2]
        // console.log(brickName)
        var container = containerGroup.create(0, 0, "atlas.feed", brickName)
        container.anchor.setTo(0.5, 0.5)
        var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var numberText = new Phaser.Text(game, 0, 0, "0", fontStyle)
        numberText.anchor.setTo(0.5, 0.5)
        numberText.x = 0
        numberText.y = 2
        containerGroup.add(numberText)
        containerGroup.text = numberText
        containerGroup.container = container
        containerGroup.color = index % 2
        brickList.push(containerGroup)

        pullGroup.add(containerGroup)

        container.events.onInputDown.add(onClickBrick)

    }
    
    function createPointsBar(){

        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)

        var pointsImg = pointsBar.create(-10,10,'atlas.feed','xpcoins')
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

    function createGameObjects(){
        pullGroup = game.add.group()
        pullGroup.x = -game.world.centerX * 2
        pullGroup.y = -game.world.centerY * 2
        sceneGroup.add(pullGroup)
        pullGroup.alpha = 0

        gameGroup = game.add.group()
        gameGroup.x = game.world.centerX
        gameGroup.y = 0
        sceneGroup.add(gameGroup)

        for(var brickIndex = 0; brickIndex < MAX_NUM_BRICKS; brickIndex++){
            createBrick(brickIndex)
        }

    }
    
    function createPart(key,obj){

        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.feed',key);
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
        feedSong.stop()
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
        
        game.load.image('introscreen',"images/feed/introscreen.png")
		game.load.image('howTo',"images/feed/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/feed/play" + localization.getLanguage() + ".png")
        
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

    function trimBrick(brick) {
        // for(var brickIndex = brick.index + 1; brickIndex < bricksInGame.length; brickIndex++){
        //     var actualBrick = bricksInGame[brickIndex]
        //     actualBrick.index = actualBrick.index - 1
        // }
        game.add.tween(brick).to({alpha:0}, 400, null, true)
        brick.container.inputEnabled = false
        bricksInGame.splice(brick.index, 1)
        brickList.push(brick)
    }

    function onClickBrick(obj) {
        var container = obj.parent

        trimBrick(container)
    }

    function addBrick() {
        var brick = brickList[0]
        brickList.splice(0,1)
        pullGroup.remove(brick)
        gameGroup.add(brick)
        bricksInGame.push(brick)

        brick.container.inputEnabled = true

    }
    
    function startRound() {
        addBrick()

        for(var delayIndex = 0; delayIndex < 9; delayIndex++){
            game.time.events.add(800 * (delayIndex + 1),function(){

                addBrick()

            },this)
        }

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

        var heartImg = group.create(0,0,'atlas.feed','life_box')

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
        var colorCounter = []
        var colorsCounters = []
        for(var brickIndex = 0; brickIndex < bricksInGame.length; brickIndex++){
            var brick = bricksInGame[brickIndex]
            brick.index = brickIndex
            brick.toY = (maxHeight - (brick.index) * 80)
            if (brick.y <= brick.toY)
                brick.y += 5
            else {
                if ((colorCounter.length)&&(colorCounter[colorCounter.length - 1].color !== brick.color)){
                    colorsCounters.push(colorCounter)
                    colorCounter = []
                }
                colorCounter.push(brick)
            }
        }

        for(var colorsIndex = 0; colorsIndex < colorsCounters.length; colorsIndex++)
        {
            var colorsSelected = colorsCounters[colorsIndex]
            console.log(colorsSelected.length)
            if (colorsSelected.length >= 3) {
                for (var colorIndex = colorsSelected.length - 1; colorIndex >= 0; colorIndex--) {
                    var colorSelected = colorsSelected[colorIndex]
                    trimBrick(colorSelected)
                }
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
		
		var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.feed','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		//console.log(inputName)
		var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.feed',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.feed','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
	return {
		assets: assets,
		name: "feed",
        preload:preload,
        update:update,
		create: function(event){
            
			sceneGroup = game.add.group()

            var background = sceneGroup.create(game.world.centerX,game.world.centerY,'fondo')
            background.anchor.setTo(0.5, 0.5)
            // background.width = game.world.width+2
            // background.height = game.world.height+2
            var backgroundLeft = sceneGroup.create(game.world.centerX - background.width,game.world.centerY,'fondo')
            backgroundLeft.anchor.setTo(0.5, 0.5)
            backgroundLeft.scale.x = -1
            var backgroundRight = sceneGroup.create(game.world.centerX + background.width,game.world.centerY,'fondo')
            backgroundRight.anchor.setTo(0.5, 0.5)
            backgroundRight.scale.x = -1
            var floor = game.add.tileSprite(game.world.centerX , game.world.height + 20, game.world.width, 158, "atlas.feed", "floor")
            floor.anchor.setTo(0.5, 1)
            sceneGroup.add(floor)
            
            feedSong = game.add.audio('dojoSong')
            game.sound.setDecodedCallback(feedSong, function(){
                feedSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
            
            createHearts()
            createPointsBar()
            createGameObjects()

            createTutorial()
            
		}
	}
}()