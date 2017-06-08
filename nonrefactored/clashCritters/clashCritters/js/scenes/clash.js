
var soundsPath = "../../shared/minigames/sounds/"
var clash = function(){

    var localizationData = {
        "EN":{
            "howTo":"How to Play?",
            "moves":"Moves left"
        },

        "ES":{
            "moves":"Movimientos extra",
            "howTo":"�C�mo jugar?"
        }
    }


    var assets = {
        atlases: [
            {
                name: "atlas.clash",
                json: "images/clash/atlas.json",
                image: "images/clash/atlas.png"
            }
        ],
        images: [
            {   name:"fondo",
                file: "images/clash/fondo.png"}
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
    var NUM_OPTIONS = 3

    // var ROUNDS = [
    //     {continent: "america", flags: ["mexico", "usa"]},
    //     {continent: "america", numFlags: 4},
    //     {continent: "random", numFlags: 4}]

    var lives
    var sceneGroup = null
    var gameIndex = 33
    var tutoGroup
    var clashSong
    var heartsGroup = null
    var pullGroup = null
    var clock
    var timeValue
    var quantNumber
    var inputsEnabled
    var pointsBar
    var roundCounter

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

        var pointsImg = pointsBar.create(-10,10,'atlas.clash','xpcoins')
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

        var grass = sceneGroup.create(0, 0, 'atlas.clash', 'grass')
        grass.anchor.setTo(0.5, 0.5)
        grass.scale.setTo(0.65, 0.65)

        var monster = createSpine("monsters", "BOSS")
        monster.x = game.world.width - 140
        monster.y = monster.height - 30
        monster.scale.setTo(0.8, 0.8)
        sceneGroup.add(monster)
        grass.x = monster.x
        grass.y = monster.y

        var dino = createSpine("dino", "normal")
        dino.x = 130
        dino.y = dino.height + 300
        sceneGroup.add(dino)

        var grass2 = dino.create(0, 0, 'atlas.clash', 'grass')
        grass2.x = -8
        grass2.y = -40
        grass2.anchor.setTo(0.5, 0.5)
        dino.sendToBack(grass2)

    }

    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.clash',key);
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
        clashSong.stop()
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
        game.load.audio('clashSong', soundsPath + 'songs/wormwood.mp3');

        game.load.image('introscreen',"images/clash/introscreen.png")
        game.load.image('howTo',"images/clash/how" + localization.getLanguage() + ".png")
        game.load.image('buttonText',"images/clash/play" + localization.getLanguage() + ".png")

        game.load.spine('monsters', "images/spines/monster/monster.json")
        game.load.spine('dino', "images/spines/dino/dino.json")

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
    
    function createClashUI() {

        var clashGroup = game.add.group()
        clashGroup.x = game.world.centerX
        clashGroup.y = game.height - 200
        sceneGroup.add(clashGroup)

        var colorBox = new Phaser.Graphics(game)
        colorBox.beginFill(0x350A00)
        colorBox.drawRect(0,0,game.width, 400)
        colorBox.endFill()
        colorBox.x = -game.width * 0.5
        colorBox.y = -200
        clashGroup.add(colorBox)

        var dashboad = clashGroup.create(0, 0, 'atlas.clash', 'dashboard')
        dashboad.anchor.setTo(0.5, 0.5)

        var fontStyle = {font: "54px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var options = []

        var spaceWidth = dashboad.width / 3
        var startX = -dashboad.width * 0.5 + 84
        for(var optionIndex = 0; optionIndex < NUM_OPTIONS; optionIndex++){
            var option = clashGroup.create(0, 0, 'atlas.clash', 'option')
            option.anchor.setTo(0.5, 0.5)
            option.x = startX + spaceWidth * optionIndex
            option.y = 84
            options.push(option)

            var numberText = new Phaser.Text(game, 0, 0, "0", fontStyle)
            numberText.x = option.x
            numberText.y = option.y - 3
            numberText.anchor.setTo(0.5,0.5)
            clashGroup.add(numberText)
        }

        var fontStyle = {font: "72px VAGRounded", fontWeight: "bold", fill: "#350A00", align: "center"}

        var questionGroup = game.add.group()
        questionGroup.y = -50
        clashGroup.add(questionGroup)

        var number1 = new Phaser.Text(game, 0, 5, "00", fontStyle)
        number1.x = -40
        number1.y = 0
        number1.anchor.setTo(1,0.5)
        questionGroup.add(number1)

        var operator = new Phaser.Text(game, 0, 5, "+", fontStyle)
        operator.x = 0
        operator.y = -5
        operator.anchor.setTo(0.5,0.5)
        questionGroup.add(operator)

        var number2 = new Phaser.Text(game, 0, 5, "00", fontStyle)
        number2.x = 40
        number2.y = 0
        number2.anchor.setTo(0,0.5)
        questionGroup.add(number2)

    }
    
    function createSpine(skeleton, skin, idleAnimation, x, y) {
        idleAnimation = idleAnimation || "IDLE"
        var spineGroup = game.add.group()
        spineGroup.x = x || 0
        spineGroup.y = y || 0

        var spineSkeleton = game.add.spine(0, 0, skeleton)
        spineSkeleton.x = 0; spineSkeleton.y = 0
        // spineSkeleton.scale.setTo(0.8,0.8)
        spineSkeleton.setSkinByName(skin)
        spineSkeleton.setAnimationByName(0, idleAnimation, true)
        spineGroup.add(spineSkeleton)

        spineGroup.setAnimation = function (animations, loop) {
            spineSkeleton.setAnimationByName(0, animation, loop)
            if(!loop){
                spineSkeleton.addAnimationByName(0, idleAnimation, true)
            }
            for(var index = 0; index < animations.length; index++) {
                var animation = animations[index]
                var loop = index == animations.length - 1
                if (index === 0)
                    spineSkeleton.setAnimationByName(0, animation, loop)
                else
                    spineSkeleton.addAnimationByName(0, animation, loop)
            }
        }

        return spineGroup
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

        var heartImg = group.create(0,0,'atlas.clash','life_box')

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

    function startTimer(onComplete) {
        var delay = 500
        // clock.bar.scale.x = clock.bar.origScale
        if (clock.tween)
            clock.tween.stop()


        clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeValue * quantNumber * 1000,Phaser.Easing.linear,true )
        clock.tween.onComplete.add(function(){
            onComplete()
        })
    }

    function onClickPlay(rect) {
        rect.inputEnabled = false
        sound.play("pop")
        game.add.tween(tutoGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){

            tutoGroup.y = -game.world.height
            // startTimer(missPoint)
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

        var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.clash','gametuto')
        tuto.anchor.setTo(0.5,0.5)

        var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
        howTo.anchor.setTo(0.5,0.5)
        howTo.scale.setTo(0.8,0.8)

        var inputName = 'movil'

        if(game.device.desktop){
            inputName = 'desktop'
        }

        //console.log(inputName)
        var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.clash',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
        inputLogo.scale.setTo(0.7,0.7)

        var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.clash','button')
        button.anchor.setTo(0.5,0.5)

        var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
        playText.anchor.setTo(0.5,0.5)
    }

    function createClock(){

        clock = game.add.group()
        clock.x = game.world.centerX
        clock.y = game.world.centerY + 80
        sceneGroup.add(clock)

        var clockImage = clock.create(0,0,'atlas.clash','clock')
        clockImage.anchor.setTo(0.5,0.5)

        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.clash','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x

        clock.bar = clockBar

    }

    return {
        assets: assets,
        name: "clash",
        preload:preload,
        create: function(event){

            sceneGroup = game.add.group()

            var background = sceneGroup.create(-2,-2,'fondo')
            background.width = game.world.width+2
            background.height = game.world.height+2

            clashSong = game.add.audio('clashSong')
            game.sound.setDecodedCallback(clashSong, function(){
                clashSong.loopFull(0.6)
            }, this);

            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);

            initialize()

            // createHearts()
            // createPointsBar()
            createGameObjects()
            createClashUI()
            // createClock()
            startRound(true)
            createTutorial()

        }
    }
}()