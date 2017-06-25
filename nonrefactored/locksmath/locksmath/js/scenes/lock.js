
var soundsPath = "../../shared/minigames/sounds/"
var lock = function(){

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
                name: "atlas.lock",
                json: "images/lock/atlas.json",
                image: "images/lock/atlas.png"
            }
        ],
        images: [
            {   name:"fondo",
                file: "images/lock/fondo.png"}
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
    var SLOTS = [{name:"MISSING1", scale:0.5}, {name:"MISSING2", scale:0.75}, {name:"MISSING3", scale:1}]

    // var ROUNDS = [
    //     {continent: "america", flags: ["mexico", "usa"]},
    //     {continent: "america", numFlags: 4},
    //     {continent: "random", numFlags: 4}]

    var lives
    var sceneGroup = null
    var gameIndex = 46
    var tutoGroup
    var lockSong
    var heartsGroup = null
    var pullGroup = null
    var clock
    var timeValue
    var quantNumber
    var inputsEnabled
    var pointsBar
    var roundCounter
    var blockList
    var barGroup
    var lock

    function loadSounds(){
        sound.decode(assets.sounds)
    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

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
        blockList = []

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

        var pointsImg = pointsBar.create(-10,10,'atlas.lock','xpcoins')
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
    
    function addBlocks() {
        var startX = -barGroup.width * 0.5 + 90
        var spaceWidth = barGroup.width / (NUM_OPTIONS + 1) + 30

        for(var blockIndex = 0; blockIndex < NUM_OPTIONS; blockIndex++){
            var block = blockList[blockIndex]
            pullGroup.remove(block)
            barGroup.add(block)
            block.x = startX + (spaceWidth * blockIndex)
            block.y = -5

            block.originalX = block.x
            block.originalY = block.y
        }
    }
    
    function onDragStart(obj, pointer) {

        // lock.spine.slotContainers[6].add(blockList[0])
        var block = obj.parent
        block.deltaX = pointer.x - obj.world.x
        block.deltaY = pointer.y - obj.world.y

        block.x, block.startX = (obj.world.x - barGroup.x) * lock.scale.x
        block.y, block.startY = (obj.world.y - barGroup.y) * lock.scale.y

        if(block.slot) {
            block.slot.block = null
            block.slot = null
        }

        barGroup.add(block)
        console.log(block.startX, block.startY)

        if(block.tween)
            block.tween.stop()

        block.tween = game.add.tween(block.scale).to({x: 1, y: 1}, 200, Phaser.Easing.Cubic.Out, true)

    }

    function onDragUpdate(obj, pointer, x, y) {
        var block = obj.parent
        obj.x = 0
        obj.y = 0
        block.x = block.startX + x - block.deltaX
        block.y = block.startY + y - block.deltaY

    }

    function onDragStop(obj) {
        var block = obj.parent
        obj.x = 0
        obj.y = 0
        obj.inputEnabled = false

        if(block.tween)
            block.tween.stop()

        var slot = checkCollision(block)
        if (slot){

            block.x = (block.centerX - slot.centerX) * (1 - lock.scale.x + 1)//scale dif
            block.y = (block.centerY - slot.centerY) * (1 - lock.scale.x + 1)//scale dif
            slot.add(block)
            block.scale.x = (1 - lock.scale.x + 1)
            block.scale.y = (1 - lock.scale.x + 1)

            block.tween = game.add.tween(block).to({x: 0, y: 0}, 400, Phaser.Easing.Cubic.Out, true)
            game.add.tween(block.scale).to({x: slot.toScale, y: slot.toScale}, 400, Phaser.Easing.Cubic.Out, true)
            block.tween.onComplete.add(function () {
                obj.inputEnabled = true
            })
            slot.block = block
            block.slot = slot

        }else{
            block.tween = game.add.tween(block).to({x: block.originalX, y: block.originalY}, 600, Phaser.Easing.Cubic.Out, true)
            block.tween.onComplete.add(function () {
                obj.inputEnabled = true
            })
        }


    }
    
    function checkCollision(block) {
        var slot

        for(var slotIndex = 0, n = lock.slotContainers.length; slotIndex<n; slotIndex++){
            var slotToCheck = lock.slotContainers[slotIndex]
            var collide = checkOverlap(slotToCheck, block.hitBox)
            if((collide)&&(!slotToCheck.block))
                slot = slotToCheck
        }

        return slot
    }

    function createGameObjects(){
        pullGroup = game.add.group()
        pullGroup.x = -game.world.centerX * 2
        pullGroup.y = -game.world.centerY * 2
        sceneGroup.add(pullGroup)
        pullGroup.alpha = 0

        for(var blockIndex = 0; blockIndex < NUM_OPTIONS; blockIndex++){
            var block = game.add.group()
            pullGroup.add(block)

            var blockBg = block.create(0, 0, "atlas.lock", "block")
            blockBg.anchor.setTo(0.5, 0.5)

            var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
            // var numerador = new Phaser.Text(sceneGroup.game, 0, -20, "1", fontStyle)
            // numerador.anchor.setTo(0.5, 0.5)
            // block.add(numerador)
            //
            // var line = game.add.graphics()
            // line.beginFill(0xffffff)
            // line.drawRoundedRect(0, 0, 30, 5, 2)
            // line.x = -15
            // line.y = -7
            // line.endFill()
            // block.add(line)
            //
            // var denominador = new Phaser.Text(sceneGroup.game, 0, 20, "1", fontStyle)
            // denominador.anchor.setTo(0.5, 0.5)
            // block.add(denominador)
            var numberText = new Phaser.Text(game, 0, 0, "1/2", fontStyle)
            numberText.anchor.setTo(0.5, 0.5)
            block.numberText = numberText
            block.add(numberText)

            var hitBox = new Phaser.Graphics(game)
            hitBox.beginFill(0xFFFFFF)
            hitBox.drawRect(0,0,50, 50)
            hitBox.alpha = 0.5
            hitBox.endFill()
            hitBox.x = -hitBox.width * 0.5
            hitBox.y = -hitBox.height * 0.5
            block.add(hitBox)
            block.hitBox = hitBox

            blockBg.inputEnabled = true
            blockBg.input.enableDrag(true)
            blockBg.events.onDragStart.add(onDragStart, this)
            blockBg.events.onDragUpdate.add(onDragUpdate, this)
            blockBg.events.onDragStop.add(onDragStop, this)

            blockList.push(block)
        }

    }

    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.lock',key);
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
        lockSong.stop()
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
        game.load.audio('lockSong', soundsPath + 'songs/wormwood.mp3');

        game.load.image('introscreen',"images/lock/introscreen.png")
        game.load.image('howTo',"images/lock/how" + localization.getLanguage() + ".png")
        game.load.image('buttonText',"images/lock/play" + localization.getLanguage() + ".png")

        game.load.image('door',"images/lock/door.png")
        game.load.spine('lock', "images/spine/lock.json")

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
        addBlocks()
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

    // function createHearts(){
    //
    //     heartsGroup = game.add.group()
    //     heartsGroup.y = 10
    //     sceneGroup.add(heartsGroup)
    //
    //     var pivotX = 10
    //     var group = game.add.group()
    //     group.x = pivotX
    //     heartsGroup.add(group)
    //
    //     var heartImg = group.create(0,0,'atlas.lock','life_box')
    //
    //     pivotX+= heartImg.width * 0.45
    //
    //     var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
    //     var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
    //     pointsText.x = pivotX
    //     pointsText.y = heartImg.height * 0.15
    //     pointsText.setText('X ' + lives)
    //     heartsGroup.add(pointsText)
    //
    //     pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
    //
    //     heartsGroup.text = pointsText
    //
    // }

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

        var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.lock','gametuto')
        tuto.anchor.setTo(0.5,0.5)

        var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
        howTo.anchor.setTo(0.5,0.5)
        howTo.scale.setTo(0.8,0.8)

        var inputName = 'movil'

        if(game.device.desktop){
            inputName = 'desktop'
        }

        //console.log(inputName)
        var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.lock',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
        inputLogo.scale.setTo(0.7,0.7)

        var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.lock','button')
        button.anchor.setTo(0.5,0.5)

        var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
        playText.anchor.setTo(0.5,0.5)
    }

    function createClock(){

        clock = game.add.group()
        clock.x = game.world.centerX
        clock.y = 100
        sceneGroup.add(clock)

        var clockImage = clock.create(0,0,'atlas.lock','clock')
        clockImage.anchor.setTo(0.5,0.5)

        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.lock','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x

        clock.bar = clockBar

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
        spineSkeleton.autoUpdateTransform ()
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
        
        spineGroup.getSlotContainer = function (slotName) {
            var slotIndex
            for(var index = 0, n = spineSkeleton.skeletonData.slots.length; index < n; index++){
                var slotData = spineSkeleton.skeletonData.slots[index]
                if(slotData.name === slotName){
                    slotIndex = index
                }
            }

            if (slotIndex){
                return spineSkeleton.slotContainers[slotIndex]
            }
        }

        spineGroup.spine = spineSkeleton

        return spineGroup
    }
    
    function createDoors() {
        var doorLeft = game.add.group()
        sceneGroup.add(doorLeft)

        var doorLeftTile = game.add.tileSprite(0 , 0, game.world.width * 0.5, game.world.height, "door")
        doorLeft.add(doorLeftTile)

        var barLeft = game.add.graphics()
        barLeft.beginFill(0x3E5F85)
        barLeft.drawRect(0,0,20, game.world.height + 2)
        barLeft.x = game.world.width * 0.5 - 20
        barLeft.endFill()
        doorLeft.add(barLeft)

        var doorRight = game.add.group()
        doorRight.x = game.world.width
        sceneGroup.add(doorRight)

        var doorRightTile = game.add.tileSprite(0 , 0, game.world.width * 0.5, game.world.height, "door")
        doorRightTile.scale.x *= -1
        doorRight.add(doorRightTile)

        var barRight = game.add.graphics()
        barRight.beginFill(0x3E5F85)
        barRight.drawRect(0,0,20, game.world.height + 2)
        barRight.x = -game.world.width * 0.5
        barRight.endFill()
        doorRight.add(barRight)

        var swatch = game.add.tileSprite(0 , 0, game.world.width, 196, "atlas.lock", "swatch")
        sceneGroup.add(swatch)

        lock = createSpine("lock", "normal")
        // var lockData = lock.slotContainers
        lock.x = game.world.centerX
        lock.y = game.world.centerY + 20
        lock.setAnimation(["IDLE"])
        lock.slotContainers = []
        sceneGroup.add(lock)

        for(var slotIndex = 0, n = SLOTS.length; slotIndex < n; slotIndex++){
            var slotName = SLOTS[slotIndex].name
            var slot = lock.getSlotContainer(slotName)
            slot.toScale = SLOTS[slotIndex].scale
            lock.slotContainers.push(slot)
        }
    }
    
    function createBarBlocks() {
        barGroup = game.add.group()
        barGroup.x = game.world.centerX
        barGroup.y = game.world.height - 100
        sceneGroup.add(barGroup)

        var bar = barGroup.create(0,0,"atlas.lock", "base")
        bar.anchor.setTo(0.5, 0.5)
    }

    return {
        assets: assets,
        name: "lock",
        preload:preload,
        create: function(event){

            sceneGroup = game.add.group()

            var background = sceneGroup.create(-2,-2,'fondo')
            background.width = game.world.width+2
            background.height = game.world.height+2

            lockSong = game.add.audio('lockSong')
            game.sound.setDecodedCallback(lockSong, function(){
                lockSong.loopFull(0.6)
            }, this);

            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);

            initialize()
            createGameObjects()
            createDoors()
            createBarBlocks()

            // createHearts()
            createPointsBar()
            createClock()
            startRound(true)
            createTutorial()

            buttons.getButton(lockSong,sceneGroup)
        }
    }
}()