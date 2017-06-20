
var soundsPath = "../../shared/minigames/sounds/"
var sky = function(){

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
                name: "atlas.sky",
                json: "images/sky/atlas.json",
                image: "images/sky/atlas.png"
            }
        ],
        images: [
            {   name:"fondo",
                file: "images/sky/fondo.png"}
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
    var MAX_BALOONS = 3

    // var ROUNDS = [
    //     {continent: "america", flags: ["mexico", "usa"]},
    //     {continent: "america", numFlags: 4},
    //     {continent: "random", numFlags: 4}]

    var COLORS = ["0x06EA06", "0xFF00D2", "0x00AEFF", "0xFFBF00"]

    var lives
    var sceneGroup = null
    var gameIndex = 44
    var tutoGroup
    var skySong
    var heartsGroup = null
    var pullGroup = null
    var clock
    var timeValue
    var quantNumber
    var inputsEnabled
    var pointsBar
    var roundCounter
    var clouds
    var baloonList

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){

        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        lives = NUM_LIFES
        timeValue = 7
        quantNumber = 2
        roundCounter = 0

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        inputsEnabled = false

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

        var pointsImg = pointsBar.create(-10,10,'atlas.sky','xpcoins')
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

        for(var baloonIndex = 0; baloonIndex < MAX_BALOONS; baloonIndex++){
            var baloon = pullGroup.create(0, 0, "baloon")
            baloon.anchor.setTo(0.5, 0.5)
            baloonList.push(baloon)
        }

    }

    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.feed',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle

    }

    function stopGame(win){

        //objectsGroup.timer.pause()
        //timer.pause()
        skySong.stop()
        // clock.tween.stop()
        inputsEnabled = false

        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2000)
        tweenScene.onComplete.add(function(){

            var resultScreen = sceneloader.getScene("result")
            resultScreen.setScore(true, pointsBar.number, gameIndex)

            //amazing.saveScore(pointsBar.number)
            sceneloader.show("result")
            sound.play("gameLose")
        })
    }

    function preload(){

        game.stage.disableVisibilityChange = false;
        game.load.audio('skySong', soundsPath + 'songs/wormwood.mp3');

        game.load.image('introscreen',"images/sky/introscreen.png")
        game.load.image('howTo',"images/sky/how" + localization.getLanguage() + ".png")
        game.load.image('buttonText',"images/sky/play" + localization.getLanguage() + ".png")

        game.load.image('clouds',"images/sky/cloud.png")

        buttons.getImages(game)

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

        heartsGroup.removeHealth()

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

        // addNumberPart(heartsGroup.text,'-1')
    }

    function createHearts(){

        heartsGroup = game.add.group()
        sceneGroup.add(heartsGroup)

        var spaceBetween = 60
        var hearts = []
        for(var heartIndex = 0; heartIndex < NUM_LIFES; heartIndex++){
            var heart = heartsGroup.create(0, 0, "atlas.sky", "health")
            heart.x = spaceBetween * heartIndex + 15
            heart.y = 20
            hearts.push(heart)
        }

        heartsGroup.removeHealth = function () {
            lives--
            var heart = hearts[lives]
            game.add.tween(heart).to({alpha: 0}, 800, Phaser.Easing.Cubic.Out, true, 400)
        }

    }

    function onClickPlay(rect) {
        rect.inputEnabled = false
        sound.play("pop")
        game.add.tween(tutoGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
            tutoGroup.y = -game.world.height
        })
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

        var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.sky','gametuto')
        tuto.anchor.setTo(0.5,0.5)

        var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
        howTo.anchor.setTo(0.5,0.5)
        howTo.scale.setTo(0.8,0.8)

        var inputName = 'movil'

        if(game.device.desktop){
            inputName = 'desktop'
        }

        //console.log(inputName)
        var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.sky',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
        inputLogo.scale.setTo(0.7,0.7)

        var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.sky','button')
        button.anchor.setTo(0.5,0.5)

        var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
        playText.anchor.setTo(0.5,0.5)
    }
    
    function createSkyUI() {

        clouds = game.add.tileSprite(0 , 0, game.world.width + 2, 317, "clouds")
        clouds.x = game.world.centerX
        clouds.y = game.world.height - 200
        clouds.anchor.setTo(0.5, 1)
        sceneGroup.add(clouds)

        var numScenaries = Math.ceil(game.world.width / 300)
        var sobrante = game.world.width % 300
        for(var scenaryIndex = 0; scenaryIndex < numScenaries; scenaryIndex++){
            var x = scenaryIndex * 300 - 20
            var y = game.world.height
            var scenary = sceneGroup.create(x, y, "atlas.sky", "scenary")
            scenary.anchor.setTo(0, 1)
        }

        // var scenary = game.add.tileSprite(0 , 0, game.world.width + 2, 175, "atlas.sky", "scenary")
        // scenary.x = game.world.centerX
        // scenary.y = game.world.height
        // scenary.anchor.setTo(0.5, 1)
        // // scenary.offsetX = 10
        // sceneGroup.add(scenary)

        var board = sceneGroup.create(game.world.centerX, game.world.height, "atlas.sky", "board")
        board.anchor.setTo(0.5, 1)

        var boardGroup = game.add.group()
        boardGroup.x = game.world.centerX
        boardGroup.y = game.world.height - board.height * 0.6
        sceneGroup.add(boardGroup)

        var sign = boardGroup.create(0, 0, "atlas.sky", "sign")
        sign.anchor.setTo(0.5, 0.5)

        var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        var dividend = new Phaser.Text(game, 5, 12, "?", fontStyle)
        dividend.anchor.setTo(0.5,0.5)
        boardGroup.add(dividend)
        boardGroup.dividentText = dividend

        var divisor = new Phaser.Text(game, -50, 5, "?", fontStyle)
        divisor.anchor.setTo(0.5,0.5)
        boardGroup.add(divisor)
        boardGroup.divisorText = divisor

        var quotient = new Phaser.Text(game, 5, -50, "?", fontStyle)
        quotient.anchor.setTo(0.5,0.5)
        boardGroup.add(quotient)
        boardGroup.quotientText = quotient

        var barHud = game.add.graphics()
        barHud.beginFill(0x3C2789)
        barHud.drawRect(0,0,game.world.width + 2, 76)
        barHud.endFill()
        sceneGroup.add(barHud)

    }
    
    function update() {
        clouds.tilePosition.x -= 0.5
    }

    return {
        assets: assets,
        name: "sky",
        preload:preload,
        update:update,
        create: function(event){

            sceneGroup = game.add.group()

            var background = game.add.tileSprite(0 , 0, game.world.width + 2, game.world.height + 2, "fondo")
            sceneGroup.add(background)

            skySong = game.add.audio('skySong')
            game.sound.setDecodedCallback(skySong, function(){
                skySong.loopFull(0.6)
            }, this);

            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);

            initialize()

            createSkyUI()
            createHearts()
            createPointsBar()
            createGameObjects()
            startRound(true)
            createTutorial()

            buttons.getButton(skySong,sceneGroup)
        }
    }
}()