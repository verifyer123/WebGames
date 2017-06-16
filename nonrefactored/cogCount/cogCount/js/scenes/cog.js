
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
            {	name: "gear",
                file: soundsPath + "gear.mp3"},
            {	name: "explosion",
                file: soundsPath + "explosion.mp3"},
            {	name: "cog",
                file: soundsPath + "cog.mp3"},
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

    var ROUNDS = [
        {numOptions: 3, maxValue: 2, numPlays: 2, options:[1,2,1], directions:[1, -1]},
        {numOptions: 3, maxValue: 2, numPlays: 2},
        {numOptions: 3, maxValue: 3, numPlays: 2},
        {numOptions: 3, maxValue: 3, numPlays: 2},
        {numOptions: 3, maxValue: 4, numPlays: 2},
        {numOptions: 3, maxValue: 4, numPlays: 2},
        {numOptions: 3, maxValue: 5, numPlays: 2},
        {numOptions: 4, maxValue: 5, numPlays: 3},
        {numOptions: 4, maxValue: 5, numPlays: 3},
        {numOptions: 4, maxValue: 6, numPlays: 2},
        {numOptions: 5, maxValue: 6, numPlays: 4},
        {numOptions: 5, maxValue: 6, numPlays: 3},
        {numOptions: 6, maxValue: 5, numPlays: 5},
        {numOptions: 6, maxValue: 6, numPlays: 4},
        {numOptions: 7, maxValue: 6, numPlays: 6},
        {numOptions: 7, maxValue: 6, numPlays: 5, sumSpeed: 0.1}
        ]

    var TINTS = ["0x2BE500", "0xE59100", "0x0071E5", "0xA000B9", "0xE5C900"]

    var lives
    var sceneGroup = null
    var gameIndex = 42
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
    var answer
    var background

    function loadSounds(){
        sound.decode(assets.sounds)
    }

    function tweenTint(obj, startColor, endColor, time, delay, callback) {
        // check if is valid object
        time = time || 250
        delay = delay || 0

        if (obj) {
            // create a step object
            var colorBlend = { step: 0 };
            // create a tween to increment that step from 0 to 100.
            var colorTween = game.add.tween(colorBlend).to({ step: 100 }, time, Phaser.Easing.Linear.None, delay);
            // add an anonomous function with lexical scope to change the tint, calling Phaser.Colour.interpolateColor
            colorTween.onUpdateCallback(function () {
                obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step)
            })
            // set object to the starting colour
            obj.tint = startColor;
            // if you passed a callback, add it to the tween on complete
            if (callback) {
                colorTween.onComplete.add(callback, this);
            }
            // finally, start the tween
            colorTween.start();
        }
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
        answer = 0

        loadSounds()

    }

    function addPoint(number){

        masterClock.setAnimation(["WIN", "IDLE"])
        cloky.setAnimation(["WIN", "IDLE"])

        cloky.correctPart.x = cloky.cog.world.x
        cloky.correctPart.y = cloky.cog.world.y
        cloky.correctPart.start(true, 1000, null, 5)

        var scaleTween = game.add.tween(cloky.scale).to({x: 1.2,y:1.2}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(cloky.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

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

        particle.makeParticles('atlas.cog',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.2;
        particle.maxParticleScale = 0.6;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle

    }

    function stopGame(win){

        //objectsGroup.timer.pause()
        //timer.pause()
        sound.play("wrong")
        cogSong.stop()
        // clock.tween.stop()
        isRotating = false
        cloky.setAnimation(["LOSE"])
        masterClock.setAnimation(["LOSE"])
        cloky.wrongPart.x = cloky.cog.world.x
        cloky.wrongPart.y = cloky.cog.world.y
        cloky.wrongPart.start(true, 1000, null, 5)

        var scaleTween = game.add.tween(cloky.scale).to({x: 1.2,y:1.2}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(cloky.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

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
        game.load.audio('cogSong', soundsPath + 'songs/funky_monkey.mp3');

        game.load.image('introscreen',"images/cog/introscreen.png")
        game.load.image('marco',"images/cog/marco.png")
        game.load.image('mask',"images/cog/mask.png")
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
    
    function removeOptions() {
        for(var optionIndex = 0; optionIndex < optionsInGame.length; optionIndex++){
            var option = optionsInGame[optionIndex]
            clockGroup.remove(option)
            pullGroup.add(option)
        }
        optionsInGame = []
    }

    function startRound() {
        var round = ROUNDS[roundCounter]
        if (roundCounter > 0) {
            // var tintCounter = roundCounter - 1 < randTint.length ? roundCounter - 1 : 0
            var randTint = TINTS[game.rnd.integerInRange(0, TINTS.length - 1)]
            console.log(randTint)
            tweenTint(background, background.tint,randTint, 600)
        }
        roundCounter = roundCounter + 1 < ROUNDS.length ? roundCounter + 1 : ROUNDS.length - 1

        rotateGroup.angle = 0
        cloky.angle = 0
        removeOptions()
        cloky.number = 1
        cloky.addNumber(0)
        addOptions(round.numOptions, round.maxValue, round.options)
        generateQuestion(round.numPlays, round.directions)
        clockGroup.openDoors()

        game.time.events.add(1000, function () {
            isRotating = true
        })

        if (round.sumSpeed)
            speed += round.sumSpeed

    }

    function missPoint(){

        sound.play("wrong")
        isRotating = false

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
            game.time.events.add(500, startRound)
            // startTimer(missPoint)
        })
    }
    
    function addOptions(numOptions, maxValue, values) {
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
            optionsInGame.push(option)

            if(values)
                option.value = values[optionIndex]
            else
                option.value = game.rnd.integerInRange(1, maxValue)

            option.numberText.setText(option.value)
        }
    }
    
    function createOptions() {
        pullGroup = game.add.group()
        pullGroup.x = -game.world.centerX * 2
        pullGroup.y = -game.world.centerY * 2
        sceneGroup.add(pullGroup)
        pullGroup.alpha = 0

        for(var optionIndex = 0; optionIndex < MAX_OPTIONS; optionIndex++){
            var option = game.add.group()
            pullGroup.add(option)

            var optionBG = option.create(0, 0, "atlas.cog", "option")
            optionBG.anchor.setTo(0.5, 0.5)

            var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
            var numberText = new Phaser.Text(game, 0, 4, "0", fontStyle)
            numberText.anchor.setTo(0.5,0.5)
            numberText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
            option.numberText = numberText
            option.add(numberText)

            optionsCreated.push(option)
        }
    }

    function generateQuestion(numPlays, directions){
        // var playsDirection = []
        var counterRight = -1
        var counterLeft = -1
        answer = 1

        for(var playIndex = 0; playIndex < numPlays; playIndex++){
            var playDirection = directions ? directions[playIndex] : game.rnd.integerInRange(0, 1) * 2 - 1
            if(playDirection > 0){
                counterRight++
                answer += optionsInGame[counterRight].value

                var numOptions = optionsInGame.length - 1
                var otherValue = optionsInGame[numOptions - counterLeft + 1]
                if((otherValue)&&(otherValue.value === optionsInGame[counterRight].value)){
                    otherValue.value++
                    otherValue.numberText.setText(otherValue.value)
                }
            }else {
                counterLeft++
                var numOptions = optionsInGame.length - 1
                answer += optionsInGame[numOptions - counterLeft].value

                var otherValue = optionsInGame[counterRight + 1]
                if((otherValue)&&(otherValue.value === optionsInGame[numOptions - counterLeft].value)){
                    otherValue.value++
                    otherValue.numberText.setText(otherValue.value)
                }
            }
        }

        clockGroup.answerText.setText(answer)
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

        cloky = createSpine("cloky", "normal", null, 0, 37)
        cloky.y = -155 -cloky.height * 0.5
        cloky.cog = cloky.create(0,0, "atlas.cog", "minicog")
        cloky.cog.anchor.setTo(0.5, 0.5)
        cloky.sendToBack(cloky.cog)
        cloky.number = 1
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        var numberText = new Phaser.Text(game, 0, 14, "1", fontStyle)
        numberText.anchor.setTo(0.5,0.5)
        cloky.add(numberText)
        rotateGroup.add(cloky)

        cloky.addNumber = function (number) {
            cloky.number += number
            var scaleTween = game.add.tween(numberText.scale).to({x: 1.2,y:1.2}, 200, Phaser.Easing.linear, true)
            scaleTween.onComplete.add(function(){
                game.add.tween(numberText.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
            })
            numberText.setText(cloky.number)
        }

        var hitBox = new Phaser.Graphics(game)
        hitBox.beginFill(0xFFFFFF)
        hitBox.drawRect(0,0,12, 12)
        hitBox.alpha = 0
        hitBox.endFill()
        hitBox.x = -hitBox.width * 0.5
        hitBox.y = 0
        cloky.add(hitBox)
        cloky.hitBox = hitBox

        clockGroup = game.add.group()
        clockGroup.x = game.world.centerX
        clockGroup.y = game.world.centerY
        sceneGroup.add(clockGroup)

        fontStyle = {font: "70px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        var answerText = new Phaser.Text(game, 0, -385, "0", fontStyle)
        answerText.anchor.setTo(0.5, 0.5)
        clockGroup.add(answerText)
        clockGroup.answerText = answerText

        masterClock = createSpine("master", "normal")
        clockGroup.add(masterClock)

        var correctPart = createPart("star")
        sceneGroup.add(correctPart)
        cloky.correctPart = correctPart

        var wrongPart = createPart("wrong")
        sceneGroup.add(wrongPart)
        cloky.wrongPart = wrongPart

        var input = new Phaser.Graphics(game)
        input.beginFill(0x000000)
        input.drawRect(0,0,game.world.width *2, game.world.height *2)
        input.alpha = 0
        input.endFill()
        input.events.onInputDown.add(function(){
            direction = direction * -1
            masterClock.setAnimation(["IDLE"])
            sound.play("gear")
        })
        sceneGroup.add(input)
        clockGroup.input = input

        createOptions()

        var puertasGroup = game.add.group()
        puertasGroup.x = game.world.centerX
        puertasGroup.y = game.world.centerY
        sceneGroup.add(puertasGroup)

        var cortinaLeft = puertasGroup.create(0 , 0, "atlas.cog", "cortina")
        cortinaLeft.x = -cortinaLeft.width + 1
        cortinaLeft.anchor.setTo(0, 0.5)
        puertasGroup.add(cortinaLeft)

        var cortinaRight = puertasGroup.create(0 , 0, "atlas.cog", "cortina")
        cortinaRight.anchor.setTo(0, 0.5)
        cortinaRight.scale.x = -1
        cortinaRight.x = cortinaLeft.width - 1
        puertasGroup.add(cortinaRight)

        var mask = game.add.graphics(0,0)
        mask.beginFill(0xFFFFFF)
        mask.drawRoundedRect(0,0, 492, 607, 80)
        mask.endFill()
        mask.x = game.world.centerX - 492 * 0.5
        mask.y = game.world.centerY - 607 * 0.5

        puertasGroup.mask = mask
        // mask.destroy()

        var width = cortinaRight.width - 1
        
        clockGroup.openDoors = function () {
            // game.add.tween(cortinaLeft).to({width: 0}, 2000, Phaser.Easing.Cubic.Out, true)
            // game.add.tween(cortinaLeft.tilePosition).to({x: -292}, 2000, Phaser.Easing.Cubic.Out, true)
            // game.add.tween(cortinaRight).to({width: 0}, 2000, Phaser.Easing.Cubic.Out, true)
            // game.add.tween(cortinaRight.tilePosition).to({x: -292}, 2000, Phaser.Easing.Cubic.Out, true)

            game.add.tween(cortinaLeft).to({x: cortinaRight.width * 2}, 1200, Phaser.Easing.Cubic.Out, true)
            game.add.tween(cortinaRight).to({x: -cortinaRight.width * 2}, 1200, Phaser.Easing.Cubic.Out, true)
            sound.play("swipe")
        }

        clockGroup.closeDoors = function () {
            // game.add.tween(cortinaLeft).to({width: 292}, 800, Phaser.Easing.Cubic.Out, true)
            // game.add.tween(cortinaLeft.tilePosition).to({x: 292}, 800, Phaser.Easing.Cubic.Out, true)
            // game.add.tween(cortinaRight).to({width: 292}, 800, Phaser.Easing.Cubic.Out, true)
            // game.add.tween(cortinaRight.tilePosition).to({x: 292}, 800, Phaser.Easing.Cubic.Out, true)

            game.add.tween(cortinaLeft).to({x: -cortinaLeft.width + 1}, 800, Phaser.Easing.Cubic.Out, true)
            game.add.tween(cortinaRight).to({x: -cortinaRight.width - 1}, 800, Phaser.Easing.Cubic.Out, true)
            sound.play("swipe")
            // doorClose.onComplete.add(startRound)
        }
    }

    function createSpine(skeleton, skin, idleAnimation, x, y) {
        idleAnimation = idleAnimation || "IDLE"
        var spineGroup = game.add.group()
        x = x || 0
        y = y || 0

        var spineSkeleton = game.add.spine(0, 0, skeleton)
        spineSkeleton.x = x; spineSkeleton.y = y
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
        // clockGroup.doorLeft.updateCrop()
        // clockGroup.doorRight.updateCrop()

        if(isRotating){
            rotateGroup.angle += speed * direction
            cloky.cog.angle += speed * direction * 2
            cloky.angle -= speed * direction

            for(var optionIndex = 0; optionIndex < optionsInGame.length; optionIndex++){
                var option = optionsInGame[optionIndex]
                var collide = checkCollision(option, cloky.hitBox)
                if ((collide)&&(!option.collided)){
                    option.collided = true
                    sound.play("cog")
                    game.add.tween(option).to({alpha:0}, 600, Phaser.Easing.Cubic.Out, true)
                    game.add.tween(option.scale).to({x:0.2, y:0.2}, 600, Phaser.Easing.Cubic.Out, true)
                    cloky.addNumber(option.value)
                }
            }

            if (cloky.number == answer) {
                addPoint(5)
                isRotating = false
                game.time.events.add(1000, clockGroup.closeDoors)
                game.time.events.add(2000, startRound)
            }else if(cloky.number > answer){
                // missPoint()
                // sound.play("explosion")
                stopGame()
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

            background = game.add.tileSprite(0 , 0, game.world.width + 2, game.world.height + 2, "atlas.cog", "fondo")
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