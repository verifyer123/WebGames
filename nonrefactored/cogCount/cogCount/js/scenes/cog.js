
var soundsPath = "../../shared/minigames/sounds/"
var cog = function(){

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
                name: "atlas.cog",
                json: "images/cog/atlas.json",
                image: "images/cog/atlas.png"
            }
        ],
        images: [
            {   name:"fondo",
                file: "images/cog/fondo.png"}
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
    var MAX_OPTIONS = 7

    // var ROUNDS = [
    //     {continent: "america", flags: ["mexico", "usa"]},
    //     {continent: "america", numFlags: 4},
    //     {continent: "random", numFlags: 4}]

    var lives
    var sceneGroup = null
    var gameIndex = 33
    var tutoGroup
    var cogSong
    var heartsGroup = null
    var pullGroup = null
    var inputsEnabled
    var pointsBar
    var roundCounter
    var rotateGroup
    var optionsCreated
    var optionsInGame
    var clockGroup
    var isRotating
    var cloky
    var masterClock
    var speed
    var direction

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){

        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        lives = NUM_LIFES
        roundCounter = 0
        optionsCreated = []
        optionsInGame = []
        speed = 0.5
        direction = 1

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        inputsEnabled = false
        isRotating = false

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

    function createPointsBar(){

        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)

        var pointsImg = pointsBar.create(-10,10,'atlas.cog','xpcoins')
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
        cogSong.stop()
        // clock.tween.stop()
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
        game.load.audio('cogSong', soundsPath + 'songs/wormwood.mp3');

        game.load.image('introscreen',"images/cog/introscreen.png")
        game.load.image('marco',"images/cog/marco.png")
        game.load.image('howTo',"images/cog/how" + localization.getLanguage() + ".png")
        game.load.image('buttonText',"images/cog/play" + localization.getLanguage() + ".png")

        game.load.spine('master', "images/spines/master/master_clock.json")
        game.load.spine('cloky', "images/spines/cloky/cloky.json")

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

    function startRound() {

        addOptions(7)
        game.time.events.add(1000, function () {
            isRotating = true
            rotateGroup.angle = 0
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

        var heartImg = group.create(0,0,'atlas.cog','life_box')

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
            clockGroup.input.inputEnabled = true
            startRound()
            // startTimer(missPoint)
        })
    }
    
    function addOptions(numOptions) {
        var angle = (Math.PI * 2) / (numOptions + 1)
        var radio = 200

        for(var optionIndex = 0; optionIndex < numOptions; optionIndex++){
            var y = Math.cos(Math.PI + angle * (optionIndex + 1)) * radio
            var x = Math.sin(Math.PI + angle * (optionIndex + 1)) * radio
            var option = optionsCreated[optionIndex]
            option.scale.x = 1
            option.scale.y = 1
            option.alpha = 1
            option.collided = false
            pullGroup.remove(option)
            clockGroup.add(option)
            option.x = x
            option.y = y
            option.anchor.setTo(0.5, 0.5)
            optionsInGame.push(option)
        }
    }
    
    function createOptions() {
        pullGroup = game.add.group()
        pullGroup.x = -game.world.centerX * 2
        pullGroup.y = -game.world.centerY * 2
        sceneGroup.add(pullGroup)
        pullGroup.alpha = 0

        for(var optionIndex = 0; optionIndex < MAX_OPTIONS; optionIndex++){
            var option = pullGroup.create(0, 0, "atlas.cog", "option")
            option.anchor.setTo(0.5, 0.5)
            optionsCreated.push(option)
        }
    }
    
    function checkCollision(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );
    }
    
    function createCogUI() {
        var marco = sceneGroup.create(0,0, "marco")
        marco.x = game.world.centerX
        marco.y = game.world.centerY
        marco.anchor.setTo(0.5,0.5)

        rotateGroup = game.add.group()
        rotateGroup.x = game.world.centerX
        rotateGroup.y = game.world.centerY
        sceneGroup.add(rotateGroup)

        var cog = rotateGroup.create(0,0, "atlas.cog", "cog")
        cog.anchor.setTo(0.5,0.5)

        cloky = createSpine("cloky", "normal")
        cloky.y = -150
        rotateGroup.add(cloky)

        var hitBox = new Phaser.Graphics(game)
        hitBox.beginFill(0xFFFFFF)
        hitBox.drawRect(0,0,12, 12)
        hitBox.alpha = 0.4
        hitBox.endFill()
        hitBox.x = -hitBox.width * 0.5
        hitBox.y = -hitBox.height * 4
        cloky.add(hitBox)
        cloky.hitBox = hitBox

        clockGroup = game.add.group()
        clockGroup.x = game.world.centerX
        clockGroup.y = game.world.centerY
        sceneGroup.add(clockGroup)

        masterClock = createSpine("master", "normal")
        clockGroup.add(masterClock)

        var input = new Phaser.Graphics(game)
        input.beginFill(0x000000)
        input.drawRect(0,0,game.world.width *2, game.world.height *2)
        input.alpha = 0
        input.endFill()
        input.events.onInputDown.add(function(){
            direction = direction * -1
            masterClock.setAnimation(["IDLE"])
        })
        sceneGroup.add(input)
        clockGroup.input = input

        createOptions()
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

        spineGroup.setAnimation = function (animations, onComplete) {

            var entry
            for(var index = 0; index < animations.length; index++) {
                var animation = animations[index]
                var loop = index === animations.length - 1
                if (index === 0)
                    entry = spineSkeleton.setAnimationByName(0, animation, loop)
                else
                    spineSkeleton.addAnimationByName(0, animation, loop)

            }
            if(onComplete){
                entry.onComplete = onComplete
            }
        }

        spineGroup.setSkinByName = function (skin) {
            spineSkeleton.setSkinByName(skin)
        }

        spineGroup.setAlive = function (alive) {
            spineSkeleton.autoUpdate = alive
        }

        return spineGroup
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

        var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.cog','gametuto')
        tuto.anchor.setTo(0.5,0.5)

        var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
        howTo.anchor.setTo(0.5,0.5)
        howTo.scale.setTo(0.8,0.8)

        var inputName = 'movil'

        if(game.device.desktop){
            inputName = 'desktop'
        }

        //console.log(inputName)
        var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.cog',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
        inputLogo.scale.setTo(0.7,0.7)

        var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.cog','button')
        button.anchor.setTo(0.5,0.5)

        var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
        playText.anchor.setTo(0.5,0.5)
    }
    
    function update() {
        if(isRotating){
            rotateGroup.angle += speed * direction
            for(var optionIndex = 0; optionIndex < optionsInGame.length; optionIndex++){
                var option = optionsInGame[optionIndex]
                var collide = checkCollision(option, cloky.hitBox)
                if ((collide)&&(!option.collided)){
                    option.collided = true
                    game.add.tween(option).to({alpha:0}, 600, Phaser.Easing.Cubic.Out, true)
                    game.add.tween(option.scale).to({x:0.2, y:0.2}, 600, Phaser.Easing.Cubic.Out, true)
                }
            }
        }
    }

    return {
        assets: assets,
        name: "cog",
        preload:preload,
        update:update,
        create: function(event){

            sceneGroup = game.add.group()

            var background = game.add.tileSprite(0 , 0, game.world.width + 2, game.world.height + 2, "atlas.cog", "fondo")
            sceneGroup.add(background)
            background.tint = "0xA000B9"

            cogSong = game.add.audio('cogSong')
            game.sound.setDecodedCallback(cogSong, function(){
                cogSong.loopFull(0.6)
            }, this);

            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);

            initialize()

            // createHearts()
            createCogUI()
            createPointsBar()
            createTutorial()

            buttons.getButton(cogSong,sceneGroup)
        }
    }
}()