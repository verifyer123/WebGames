
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
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
            },

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
            {	name: "whoosh",
                file: soundsPath + "whoosh.mp3"},
            {	name: "cut",
                file: soundsPath + "cut.mp3"},
            {	name: "punch",
                file: soundsPath + "punch1.mp3"},
            {	name: "stop",
                file: soundsPath + "stop.mp3"},
            {	name: "swipe",
                file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
                file: soundsPath + "wrong.mp3"},
            {	name: "right",
                file: soundsPath + "rightChoice.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "owl",
                file: soundsPath + "owl.mp3"}
        ]
    }

    var NUM_LIFES = 3
    var MAX_BALOONS = 4

    var ROUNDS = [
        {quotientMax: 5, divisorMax: 3},
        {quotientMax: 6, divisorMax: 4},
        {quotientMax: 6, divisorMax: 4},
        {quotientMax: 7, divisorMax: 5},
        {quotientMax: 7, divisorMax: 5},
        {quotientMax: 8, divisorMax: 5},
        {quotientMax: 8, divisorMax: 5},
        {quotientMax: 9, divisorMax: 5},
        {quotientMax: 9, divisorMax: 5},
        {quotientMax: 10, divisorMax: 5, hasResult:true}
        ]

    var DIVISION_PARTS = ["dividend", "divisor", "quotient"]

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
    var gameGroup
    var baloonsInGame
    var boardGroup
    var currentPart
    var selectedPart
    var totalBaloons
    var baloonsPicked
    var speed
    var delay
    var owl
    var missBaloon

    function loadSounds(){
        sound.decode(assets.sounds)
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

    function initialize(){

        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        lives = NUM_LIFES
        timeValue = 7
        quantNumber = 2
        roundCounter = 0
        baloonList = []
        baloonsInGame = []
        baloonsPicked = []
        currentPart = 0
        speed = 1
        delay = 2500

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        inputsEnabled = false

        loadSounds()

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
                obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step, 1)
            })
            // set object to the starting colour
            obj.tint = startColor;
            // if you passed a callback, add it to the tween on complete
            if (callback) {
                colorTween.onComplete.add(callback, this);
            }
            // finally, start the tween
            colorTween.start();
            obj.colorTween = colorTween
        }
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
        speed += 0.1
        roundCounter = roundCounter + 1 < ROUNDS.length ? roundCounter + 1 : ROUNDS.length - 1

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
    
    function newRound() {
        if(lives > 0){
            game.add.tween(boardGroup.equation.scale).to({x:0.3, y:0.3}, 400, Phaser.Easing.Cubic.Out, true)
            var dissapearTween = game.add.tween(boardGroup.equation).to({alpha:0}, 400, Phaser.Easing.Cubic.Out, true)
            dissapearTween.onComplete.add(startRound)
        } else
            stopGame()
    }
    
    function checkAnswer() {

        var answer = baloonsPicked[0] / baloonsPicked[1]
        var boardAnswer = parseInt(boardGroup.quotientText.text)
        if (answer === boardAnswer){
            boardGroup.correctParticle.start(true, 1000, null, 5)
            addPoint(baloonsPicked.length)
        }else {
            boardGroup.wrongParticle.x = boardGroup.x + 5
            boardGroup.wrongParticle.y = boardGroup.y
            boardGroup.wrongParticle.start(true, 1000, null, 5)
            missPoint()
        }

        var bigTween = game.add.tween(boardGroup.equation.scale).to({x:1.2, y:1.2}, 400, Phaser.Easing.Cubic.Out, true)
        bigTween.onComplete.add(function () {
            var endTween = game.add.tween(boardGroup.equation.scale).to({x:1, y:1}, 400, Phaser.Easing.Cubic.Out, true)
            endTween.onComplete.add(newRound)
        })
    }
    
    function changeDivisionPart() {
        currentPart++
        if(currentPart < totalBaloons) {
            var divisionPart = DIVISION_PARTS[currentPart]
            setCurrentDivision(divisionPart)
        }else {
            removeBaloons()
        }
    }
    
    function changeTextPart(baloon){
        sound.play("stop")

        game.add.tween(baloon).to({alpha:0}, 800, Phaser.Easing.Cubic.Out, true)
        baloon.toText.colorTween.stop()
        baloon.toText.stopColorTween = true
        baloon.toText.tint = "0x000000"
        baloon.toText.text = baloon.number
        var bigTween = game.add.tween(baloon.toText.scale).to({x:1.2, y:1.2}, 400, Phaser.Easing.Cubic.Out, true)
        bigTween.onComplete.add(function () {
            var endTween = game.add.tween(baloon.toText.scale).to({x:1, y:1}, 400, Phaser.Easing.Cubic.Out, true)
            endTween.onComplete.add(function () {
                baloonsPicked.push(baloon.number)
                if((totalBaloons === baloonsPicked.length)&&(!missBaloon))
                    checkAnswer()
            })
        })
    }
    
    function moveToPart(baloonBg) {
        sound.play("cut")

        var baloon = baloonBg.parent
        sceneGroup.add(baloon)
        baloon.x = baloonBg.world.x
        baloon.y = baloonBg.world.y
        var toX = baloon.toText.world.x
        var toY = baloon.toText.world.y

        var moveTween = game.add.tween(baloon).to({x:toX, y:toY}, 800, Phaser.Easing.Cubic.Out, true)
        moveTween.onComplete.add(changeTextPart)
    }
    
    function explodeBaloon(baloonBg) {
        if (inputsEnabled) {
            sound.play("punch")
            baloonBg.inputEnabled = false
            var baloon = baloonBg.parent
            baloon.isUpdate = false
            baloon.toText = selectedPart
            changeDivisionPart()

            game.add.tween(baloonBg.scale).to({x: 1.2, y: 1}, 400, Phaser.Easing.Cubic.Out, true)
            var dissapearTween = game.add.tween(baloonBg).to({alpha: 0}, 400, Phaser.Easing.Cubic.Out, true)
            game.add.tween(baloon.flying).to({alpha: 0}, 400, Phaser.Easing.Cubic.Out, true)
            dissapearTween.onComplete.add(moveToPart)
        }

    }
    
    function removeBaloons() {
        inputsEnabled = false
        selectedPart.stopColorTween = true
        selectedPart.colorTween.stop()
        for(var baloonIndex = baloonsInGame.length - 1; baloonIndex >=0; baloonIndex--){
            var baloon = baloonsInGame[baloonIndex]
            if (baloon.isUpdate){
                game.add.tween(baloon).to({alpha:0}, 1200, Phaser.Easing.Cubic.Out, true)
                game.add.tween(baloon.scale).to({x:0.4, y:0.4}, 1200, Phaser.Easing.Cubic.Out, true)
            }
            baloon.isUpdate = false
            baloonsInGame.pop()
        }
    }
    
    function baloonUpdate() {
        if(this.isUpdate){
            this.sumX += 0.04
            this.sumY += 0.1
            this.x = this.x + Math.cos(this.sumX)
            this.scale.y -= Math.sin(this.sumY) * 0.008

            this.y -= speed

            if (this.y < -this.width * 0.5){
                boardGroup.wrongParticle.x = this.x
                boardGroup.wrongParticle.y = 20
                boardGroup.wrongParticle.start(true, 1000, null, 5)
                // this.isUpdate = false
                missBaloon = true
                removeBaloons()
                missPoint()
                game.time.events.add(2500, newRound)

            }
        }

    }

    function createGameObjects(){
        pullGroup = game.add.group()
        pullGroup.x = -game.world.centerX * 2
        pullGroup.y = -game.world.centerY * 2
        sceneGroup.add(pullGroup)
        pullGroup.alpha = 0

        gameGroup = game.add.group()
        gameGroup.x = 0
        gameGroup.y = 0
        sceneGroup.add(gameGroup)

        for(var baloonIndex = 0; baloonIndex < MAX_BALOONS; baloonIndex++){
            var baloon = game.add.group()
            pullGroup.add(baloon)

            var flyingSprite = game.add.sprite(0, 70 * 0.8, 'b_flying')
            flyingSprite.anchor.setTo(0.5, 0)
            flyingSprite.animations.add('flying')
            baloon.flying = flyingSprite
            baloon.add(flyingSprite)

            var baloonBg = baloon.create(0, 0, "atlas.sky", "baloon")
            baloonBg.anchor.setTo(0.5, 0.5)
            baloon.bg = baloonBg

            flyingSprite.animations.play('flying', 24, true)

            var fontStyle = {font: "52px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
            var numberText = new Phaser.Text(game, 0, 0, "0", fontStyle)
            numberText.anchor.setTo(0.5,0.5)
            numberText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
            baloon.add(numberText)
            baloon.numberText = numberText
            baloon.number = 0

            baloonBg.events.onInputDown.add(explodeBaloon)
            baloon.baloonUpdate = baloonUpdate

            baloonList.push(baloon)
        }

    }

    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.sky',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.4;
        particle.maxParticleScale = 0.7;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle

    }
    
    function addSingleBaloon(baloon, x, value, baloonIndex) {

        pullGroup.remove(baloon)
        gameGroup.add(baloon)
        baloon.x = x
        baloon.y = game.world.height + 70
        baloon.bg.tint = COLORS[baloonIndex]
        baloon.bg.alpha = 1
        baloon.bg.scale.setTo(0.8,0.8)
        baloon.flying.alpha = 1
        baloon.scale.x = 1
        baloon.scale.y = 1

        baloon.numberText.setText(value)
        baloon.number = value

        baloon.bg.inputEnabled = true
        baloonsInGame.push(baloon)
        baloon.sumX = 0
        baloon.sumY = 0
        baloon.alpha = 1

        baloon.isUpdate = true

    }
    
    function generateEquation(round) {

        // var numOptions = []
        // for(var numIndex = 1; numIndex <= round.quotientMax; numIndex++){
        //     numOptions.push(numIndex)
        // }
        // numOptions = Phaser.ArrayUtils.shuffle(numOptions)

        var divisor = game.rnd.integerInRange(1, round.divisorMax)
        var quotient = game.rnd.integerInRange(1, round.quotientMax)
        var dividend = divisor * quotient

        var baloonNumbers = [dividend, divisor]
        if(round.hasResult)
            baloonNumbers.push(quotient)
        var fakeAnswer = game.rnd.integerInRange(1, round.quotientMax)
        baloonNumbers.push(fakeAnswer)
        baloonNumbers = Phaser.ArrayUtils.shuffle(baloonNumbers)

        if(round.hasResult)
            boardGroup.quotientText.setText("?")
        else
            boardGroup.quotientText.setText(quotient)

        boardGroup.divisorText.setText("?")
        boardGroup.dividentText.setText("?")
        boardGroup.answer = quotient
        return baloonNumbers
    }

    function addBaloons(baloons){
        var spaceWidth = Math.floor((game.world.width - 50) / 115)
        var avaiblesSpaces = []
        for(var spaceIndex = 0; spaceIndex < spaceWidth; spaceIndex++){
            var x = (spaceIndex * 115) + 100
            avaiblesSpaces.push(x)
            console.log(x)
        }

        COLORS = Phaser.ArrayUtils.shuffle(COLORS)
        avaiblesSpaces = Phaser.ArrayUtils.shuffle(avaiblesSpaces)

        for(var baloonIndex = 0; baloonIndex < baloons.length; baloonIndex++){
            delay = 500 * (baloonIndex)
            var baloon = baloonList[baloonIndex]
            var value = baloons[baloonIndex]
            var x = avaiblesSpaces[baloonIndex]
            game.time.events.add(delay, addSingleBaloon, this, baloon, x, value, baloonIndex)
        }
    }

    function stopGame(win){

        //objectsGroup.timer.pause()
        //timer.pause()
        skySong.stop()
        // clock.tween.stop()
        inputsEnabled = false
        owl.setAnimation(["WAKEUP","WAKEUP_STILL"])
        sound.play("owl")

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
        game.load.audio('skySong', soundsPath + 'songs/upbeat_casual_8.mp3');

        /*game.load.image('introscreen',"images/sky/introscreen.png")
        game.load.image('howTo',"images/sky/how" + localization.getLanguage() + ".png")
        game.load.image('buttonText',"images/sky/play" + localization.getLanguage() + ".png")*/

        game.load.image('clouds',"images/sky/cloud.png")
        game.load.spritesheet('b_flying', 'images/sky/idle.png', 26, 125, 20)
        game.load.spine('owl', "images/spine/owl.json")

        

        game.load.image('tutorial_image',"images/sky/tutorial_image.png")
        //loadType(gameIndex)


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

    function repiteColorTween(){
        if (!selectedPart.stopColorTween) {
            tweenTint(selectedPart, "0x000000", "0xff0000", 800, null, function () {
                tweenTint(selectedPart, "0xff0000", "0x000000", 800, null, repiteColorTween)
            })
        }
    }
    
    function setCurrentDivision(part) {
        if(part === "dividend"){
            selectedPart = boardGroup.dividentText
        }else if(part === "divisor"){
            selectedPart = boardGroup.divisorText
        }else if(part === "quotient"){
            selectedPart = boardGroup.quotientText
        }
        selectedPart.stopColorTween = false
        repiteColorTween()
    }
    
    function startRound(notStarted) {
        var round = ROUNDS[roundCounter]
        var bNumbers = generateEquation(round)
        currentPart = 0
        totalBaloons = bNumbers.length - 1
        var divisionPart = DIVISION_PARTS[currentPart]
        baloonsPicked = []
        baloonsInGame = []
        setCurrentDivision(divisionPart)
        missBaloon = false

        sound.play("whoosh")
        game.add.tween(boardGroup.equation.scale).to({x:1, y:1}, 800, Phaser.Easing.Bounce.Out, true)
        game.add.tween(boardGroup.equation).to({alpha:1}, 800, Phaser.Easing.Cubic.Out, true)
        inputsEnabled = true
        addBaloons(bNumbers)
    }

    function missPoint(){

        sound.play("wrong")
        inputsEnabled = false
        owl.setAnimation(["WAKEUP","SLEEP_STILL"])

        heartsGroup.removeHealth()

        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

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
       
        tutoGroup.y = -game.world.height
        startRound()
        
    }

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
        playText.anchor.setTo(0.5,0.5)*/
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

        boardGroup = game.add.group()
        boardGroup.x = game.world.centerX
        boardGroup.y = game.world.height - board.height * 0.6
        sceneGroup.add(boardGroup)

        var equationGroup = game.add.group()
        equationGroup.alpha = 0
        equationGroup.scale.x = 0.4
        equationGroup.scale.y = 0.4
        boardGroup.add(equationGroup)
        boardGroup.equation = equationGroup

        var sign = equationGroup.create(0, 0, "atlas.sky", "sign")
        sign.anchor.setTo(0.5, 0.5)

        var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var dividend = new Phaser.Text(game, 10, 14, "?", fontStyle)
        dividend.anchor.setTo(0.5,0.5)
        equationGroup.add(dividend)
        boardGroup.dividentText = dividend
        dividend.tint ="0x000000"

        var divisor = new Phaser.Text(game, -55, 2, "?", fontStyle)
        divisor.anchor.setTo(0.5,0.5)
        equationGroup.add(divisor)
        boardGroup.divisorText = divisor
        divisor.tint = "0x000000"

        var quotient = new Phaser.Text(game, 5, -50, "?", fontStyle)
        quotient.anchor.setTo(0.5,0.5)
        equationGroup.add(quotient)
        boardGroup.quotientText = quotient
        quotient.tint = "0x000000"

        owl = createSpine("owl", "normal")
        owl.x = -70
        owl.y = -120
        owl.setAnimation(["SLEEP_STILL"])
        boardGroup.add(owl)

    }
    
    function update() {
        clouds.tilePosition.x -= 0.5

        for(var baloonIndex = 0; baloonIndex < baloonsInGame.length; baloonIndex++){
            var baloon = baloonsInGame[baloonIndex]
            baloon.baloonUpdate()
        }
    }

    return {
        assets: assets,
        name: "sky",
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
        update:update,
        create: function(event){

            sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

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
            createGameObjects()

            var barHud = game.add.graphics()
            barHud.beginFill(0x3C2789)
            barHud.drawRect(0,0,game.world.width + 2, 76)
            barHud.endFill()
            sceneGroup.add(barHud)

            var correctParticle = createPart("star")
            correctParticle.x = boardGroup.x + 5
            correctParticle.y = boardGroup.y
            sceneGroup.add(correctParticle)
            boardGroup.correctParticle = correctParticle

            var wrongParticle = createPart("wrong")
            wrongParticle.x = boardGroup.x + 5
            wrongParticle.y = boardGroup.y
            sceneGroup.add(wrongParticle)
            boardGroup.wrongParticle = wrongParticle

            createHearts()
            createPointsBar()
            createTutorial()

            buttons.getButton(skySong,sceneGroup)
        }
    }
}()