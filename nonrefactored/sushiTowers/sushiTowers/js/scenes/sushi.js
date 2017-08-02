
var soundsPath = "../../shared/minigames/sounds/"
var sushi = function(){
    
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
                name: "atlas.sushi",
                json: "images/sushi/atlas.json",
                image: "images/sushi/atlas.png"
            }
        ],
        images: [
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
                file: soundsPath + "gameLose.mp3"},
            {   name: "combo",
                file: soundsPath + "combo.mp3"},
            {   name: "swallow",
                file: soundsPath + "swallow.mp3"},
            {   name: "bah",
                file: soundsPath + "bah.mp3"},
            {   name: "collapse",
                file: soundsPath + "towerCollapse.mp3"}
		]
    }

    var NUM_LIFES = 3
    var MAX_NUM_BRICKS = 14
    var SUSHIS = [{name:"sushi1", denom:3}]
    var BRICK_HEIGHT = 82

    var ROUNDS = [
        {numbers:[5,3,7,5,2,2], colors:[0,1,0,0,2,1], pointsForNextRound:1},
        {numbers:[2,2,2,3,3,3], pointsForNextRound:5},
        {numbers:[2,3,4,6,8,9,9,7], pointsForNextRound:15},
        {numbers:[12,14,15,16,18,21,21,5], pointsForNextRound:30},
        {numbers:[12,14,15,21,24,28,33,27,26,23,5], pointsForNextRound:40}]
    
    var lives
	var sceneGroup = null
    var gameIndex = 30
    var tutoGroup
    var sushiSong
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
    var brickSelected
    var spineObj1
    var spineObj2
    var roundCounter
    var timeNextBrick
    var timeBetween
    var gameActive
    var swipe
    var pointsNextRound
    var addBrickCounter
    var speed
    var indexCounter

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        gameActive = false
        lives = NUM_LIFES
        numPoints = 0
        roundCounter = 0
        addBrickCounter = 0
        pointsNextRound = 0
        indexCounter = 0
        speed = 5
        timeBetween = 3000
        brickList = []
        bricksInGame = []
        brickSelected = null
        numSpaces = Math.floor(game.world.height / BRICK_HEIGHT)

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        inputsEnabled = false
        maxHeight = game.world.height - 50
        timeNextBrick = 0
        
        loadSounds()
        
	}

    function addPoint(number){

        // sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)

        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        addNumberPart(pointsBar.text,'+' + number)

        // if(pointsBar.number % 2 == 0){
        timeBetween-=timeBetween * 0.02
        // speed += speed * 0.02
        if (pointsBar.number >= pointsNextRound){
            roundCounter = roundCounter + 1 > ROUNDS.length - 1 ? ROUNDS.length - 1 : roundCounter + 1
            if (roundCounter < ROUNDS.length - 1)
                addBrickCounter = 0
        }
        // }

    }
    
    function createBrick(index, sushi) {
        var containerGroup = game.add.group()
        containerGroup.x = 0
        containerGroup.y = 0

        // console.log(brickName)
        var container = containerGroup.create(0, 0, "atlas.sushi", sushi.name)
        container.anchor.setTo(0.5, 0.5)
        var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var numberText = new Phaser.Text(game, 0, 0, "0", fontStyle)
        numberText.anchor.setTo(0.5, 0.5)
        numberText.x = 0
        numberText.y = 2
        containerGroup.add(numberText)
        containerGroup.text = numberText
        containerGroup.container = container
		containerGroup.denom = sushi.denom
        // containerGroup.originalIndex = index
		containerGroup.alpha = 0
		containerGroup.sushi = container
		containerGroup.num = 1
		if(!brickList[sushi.name])
			brickList[sushi.name] = []
        brickList[sushi.name].push(containerGroup)

        // var glow = containerGroup.create(0, 0, "atlas.sushi", "glow")
        // glow.anchor.setTo(0.5, 0.5)
        // glow.alpha = 0
        // containerGroup.glow = glow

        // var particle = createPart("star")
        // containerGroup.particle = particle
        // containerGroup.add(particle)

        pullGroup.add(containerGroup)

        container.events.onInputDown.add(onClickBrick)

    }
    
    function createPointsBar(){

        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)

        var pointsImg = pointsBar.create(-10,10,'atlas.sushi','xpcoins')
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
            createBrick(brickIndex, SUSHIS[0])
        }

    }
    
    function createPart(key){
        var yOffset = yOffset || 0
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.sushi',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

        // particlesGood.x = obj.x;
        // particlesGood.y = yOffset
        // particlesGood.start(false, 1000, null, 3);

        // obj.add(particlesGood)
        // obj.particle = particlesGood
        return particle
        
    }

    function stopGame(win){
                
        //objectsGroup.timer.pause()
        //timer.pause()
        sushiSong.stop()
        inputsEnabled = false
        gameActive = false
        
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
        game.load.audio('dojoSong', soundsPath + 'songs/wormwood.mp3');
        
        game.load.image('introscreen',"images/sushi/introscreen.png")
		game.load.image('howTo',"images/sushi/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/sushi/play" + localization.getLanguage() + ".png")

        game.load.spine('octopus', "images/spine/Octopus/octopus.json")
        game.load.spine('yogotar', "images/spine/Yogotar/yogotar.json")
    }

    function addNumberPart(obj,number,fontStyle,direction,offset){

        var direction = direction || 100
        var fontStyle = fontStyle || {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var offset = offset || {x:0, y:0}

        var pointsText = new Phaser.Text(sceneGroup.game, offset.x, offset.y, number, fontStyle)
        pointsText.anchor.setTo(0.5,0.5)
        if (obj.world) {
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y
            sceneGroup.add(pointsText)
        }else{
            if (obj.scale.x < 0)
                pointsText.scale.x = -1
            obj.add(pointsText)
        }

        game.add.tween(pointsText).to({y:pointsText.y + direction},800,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)

        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

    }

    function trimBrick(brick, easing) {
        if (brickSelected === brick)
            brickSelected = null

        game.add.tween(brick).to({alpha:0}, 800, easing, true).onComplete.add(function () {
            gameGroup.remove(brick)
            pullGroup.add(brick)
        })
        brick.container.inputEnabled = false
        bricksInGame.splice(brick.index, 1)
        brickList.unshift(brick)
    }

    function onClickBrick(obj) {
        if (gameActive) {
            if (brickSelected) {
                // game.add.tween(brickSelected.glow).to({alpha: 0}, 400, Phaser.Easing.Cubic.Out, true)
                brickSelected.container.inputEnabled = true
            }

            var container = obj.parent
            brickSelected = container
            // game.add.tween(container.glow).to({alpha: 1}, 400, Phaser.Easing.Cubic.Out, true)
            obj.inputEnabled = false
        }

        // trimBrick(container)
    }

    function addBrick(name, toY) {
        var round = ROUNDS[roundCounter]
        var roundNumbers = round.numbers
        timeNextBrick = 0
        pointsNextRound = round.pointsForNextRound
        // var roundColors = round.colors

        // var brick = brickList[name][brickList.length - 1]
		var brick = brickList[name].pop()
        pullGroup.remove(brick)
        gameGroup.add(brick)
        bricksInGame.push(brick)
        // brick.color = roundColors ? roundColors[addBrickCounter] : game.rnd.integerInRange(0, CONTAINERS.length - 1)
        indexCounter++
        // brick.color = indexCounter % CONTAINERS.length
        // brick.container.tint = CONTAINERS[brick.color]
        // brick.alpha = 1
		game.add.tween(brick).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true)
        brick.scale.x = 1
        brick.scale.y = 1
        // brick.glow.alpha = 0
        brick.x = -7
        brick.y = toY || 340
        brick.timeElapsed = 0

        if ((addBrickCounter == 0)&&(roundCounter > 0))
            roundNumbers = Phaser.ArrayUtils.shuffle(roundNumbers)
        var number = roundNumbers[addBrickCounter]
        addBrickCounter = addBrickCounter + 1 < roundNumbers.length ? addBrickCounter + 1 : 0
        // console.log(rndNumber)
        brick.text.setText(number)
        brick.number = number

        brick.container.inputEnabled = true

    }
    
    function startRound() {

        for(var brickIndex = 0; brickIndex < 3; brickIndex++){
            var toY = (maxHeight - (brickIndex) * 80)
            addBrick("sushi1", toY)
        }

    }

    function missPoint(){
        
        sound.play("wrong")
        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives === 0){
            stopGame(false)
        }
        // else{
        //     // startRound()
        // }
        
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

        var heartImg = group.create(0,0,'atlas.sushi','life_box')

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
            gameActive = true
        })
    }
    
    function checkAnswer(brickNumber, yogotar) {

        if(brickNumber % yogotar.number === 0){
            sound.play("magic")
            sound.play("swallow")
            yogotar.correctPart.start(true, 1000, null, 3)
            yogotar.setAnimationByName(0, "WIN", false)

            var result = brickNumber / yogotar.number
            addPoint(1)
            var fontStyle = {font: "68px VAGRounded", fontWeight: "bold", fill: "#080788", align: "center"}
            addNumberPart(yogotar, result, fontStyle, -200, {x:0, y:-80})
        }else {
            sound.play("wrong")
            yogotar.wrongPart.start(true, 1000, null, 3)
            yogotar.setAnimationByName(0, "SICK", false)
            sound.play("bah")

            missPoint()
        }
        yogotar.addAnimationByName(0, "IDLE", true)
    }
    
    function brickAnimation(toX) {
        var toX = toX ? toX * -1 : 10
        // var toY = toX * 0.5
        for(var brickIndex = 0; brickIndex<bricksInGame.length; brickIndex++){
            var brick = bricksInGame[brickIndex]
            game.add.tween(brick).to({x:toX}, 150, Phaser.Easing.Cubic.InOut, true)
            // game.add.tween(brick).to({y:brick.y + toY}, 150, null, true)
            // game.add.tween(brick).to({y:brick.y + toY * -1}, 150, null, true, 150)
        }
        game.time.events.add(160, function () {

            returnBrickAnimation(toX)

        }, this)
    }

    function returnBrickAnimation(toX) {
        brickAnimation(toX)
    }
    
    function moveBrick(direction) {
        var toX, yogotar
        if(direction === "right"){
            toX = 180
            yogotar = spineObj2
        }else if(direction === "left"){
            toX = - 180
            yogotar = spineObj1
        }
        yogotar.setAnimationByName(0, "EAT", false)
        sound.play("swipe")
        game.add.tween(brickSelected.scale).to({x:0.4, y:0.4}, 600, Phaser.Easing.Cubic.Out, true)
        game.add.tween(brickSelected).to({x:toX}, 600, Phaser.Easing.Cubic.Out, true).onComplete.add(function(brickTween){
            checkAnswer(brickTween.number, yogotar)
            // timeNextBrick = timeBetween - 500
        })
        game.add.tween(brickSelected).to({y:maxHeight - 70}, 600, Phaser.Easing.Quadratic.InOut, true)
        // game.add.tween(brickSelected.glow).to({alpha:0}, 400, Phaser.Easing.Cubic.Out, true)
        trimBrick(brickSelected, Phaser.Easing.Cubic.In)
        brickSelected = null
    }

    function createSpines() {
		var nao = createSpine("yogotar", "nao")
		nao.x = game.world.centerX + 92
		nao.y = game.world.height - 100
		nao.scale.setTo(-0.5, 0.5)
		sceneGroup.add(nao)

		var tomiko = createSpine("yogotar", "tomiko")
		tomiko.x = game.world.centerX - 98
		tomiko.y = game.world.height - 100
		tomiko.scale.setTo(0.5, 0.5)
		sceneGroup.add(tomiko)
    }
    
    function update() {

        var colorCounter = []
        var colorsCounters = []
        colorsCounters.push(colorCounter)

        for(var brickIndex = 0; brickIndex < bricksInGame.length; brickIndex++){
            var sushi = bricksInGame[brickIndex]
            sushi.index = brickIndex
			var prevSushi = brickIndex > 0 ? bricksInGame[brickIndex - 1] : null
			var spaceBtw
			if((prevSushi)&&(prevSushi.denom === sushi.denom))
				spaceBtw = 50
			else
				spaceBtw = 80

			sushi.toY = (maxHeight - (sushi.index) * spaceBtw)
			console.log(sushi.toY, brickIndex, sushi.denom)

            if (sushi.y < sushi.toY){
                // brick.timeElapsed += game.time.elapsedMS
                // console.log(brick.timeElapsed)
                // var vel = 8 * brick.timeElapsed / 1000
                sushi.y += speed
            }
            else {
                sushi.y = (maxHeight - (sushi.index) * spaceBtw)
                if (sushi.y <= 0) {
                    brickAnimation()
                    sound.play("collapse")
                    stopGame()
                }
                sushi.timeElapsed = 0
                if ((colorCounter.length > 0)&&(colorCounter[colorCounter.length - 1].denom !== sushi.denom)){
                    colorCounter = []
                    colorsCounters.push(colorCounter)
                }
                colorCounter.denom = sushi.denom
                colorCounter.push(sushi)
            }
        }

        // for(var colorsIndex = 0; colorsIndex < colorsCounters.length; colorsIndex++) {
        //     var colorsSelected = colorsCounters[colorsIndex]
        //     if (colorsSelected.length >= colorsSelected.denom) {
        //         for (var colorIndex = colorsSelected.length - 1; colorIndex >= 0; colorIndex--) {
        //             var colorSelected = colorsSelected[colorIndex]
        //             // colorSelected.particle.start(true, 1000, null, 3)
        //             trimBrick(colorSelected, Phaser.Easing.Cubic.Out)
        //         }
        //         sound.play("combo")
        //         addPoint(1)
        //     }
        // }

        // var direction = swipe.check()
		//
        // if (direction!==null && brickSelected) {
        //     // direction= { x: x, y: y, direction: direction }
        //     switch(direction.direction) {
        //         case swipe.DIRECTION_LEFT || swipe.DIRECTION_UP_LEFT || swipe.DIRECTION_DOWN_LEFT:
        //             moveBrick("left")
        //             break;
        //         case swipe.DIRECTION_RIGHT || swipe.DIRECTION_DOWN_RIGHT || swipe.DIRECTION_UP_RIGHT:
        //             moveBrick("right")
        //             break;
        //     }
        // }


        // timeElapsed += game.time.elapsedMS
        timeNextBrick += game.time.elapsedMS

        //TODO: CHANGE pointsBar.number
		if((timeNextBrick >= timeBetween)&&(pointsBar.number > -1)){
            addBrick("sushi1")
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
		
		var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.sushi','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		//console.log(inputName)
		var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.sushi',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.sushi','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
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


		spineGroup.setAnimation = function (animations, onComplete, args) {
			var entry
			for(var index = 0; index < animations.length; index++) {
				var animation = animations[index]
				var loop = index === animations.length - 1
				if (index === 0)
					entry = spineSkeleton.setAnimationByName(0, animation, loop)
				else
					spineSkeleton.addAnimationByName(0, animation, loop)

			}

			if (args)
				entry.args = args

			if(onComplete){
				entry.onComplete = onComplete
			}
		}

		spineGroup.setSkinByName = function (skin) {
			spineSkeleton.setSkinByName(skin)
			spineSkeleton.setToSetupPose()
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
	
	function updateRoll() {
		this.tilePosition.y += 2
	}
    
	return {
		assets: assets,
		name: "sushi",
        preload:preload,
        update:function(event) {
            if(gameActive)
                update()
        },
        create: function(event){

            // swipe = new Swipe(game)
			sceneGroup = game.add.group();
			yogomeGames.mixpanelCall("enterGame",gameIndex);

			var bgRect = game.add.graphics()
			bgRect.beginFill(0x150426)
			bgRect.drawRect(0,0,game.world.width, game.world.height)
			bgRect.endFill()
			sceneGroup.add(bgRect)

			var floor = game.add.tileSprite(0 , 0, game.world.width, game.world.height - 340, "atlas.sushi", "swatch")
            floor.y = game.world.height
			floor.anchor.setTo(0, 1)
            sceneGroup.add(floor)

			var barTop = game.add.graphics()
			barTop.beginFill(0xFF4817)
			barTop.drawRect(0,0,game.world.width, 40)
			barTop.endFill()
			sceneGroup.add(barTop)

			var background = sceneGroup.create(game.world.centerX,game.world.centerY,"atlas.sushi",'fondo')
			background.y = background.height * 0.5 + 50
			background.anchor.setTo(0.5, 0.5)

			var octupus = createSpine("octopus", "normal")
			octupus.x = game.world.centerX
			octupus.y = background.y + 100
			sceneGroup.add(octupus)

			var scenary = sceneGroup.create(game.world.centerX,game.world.centerY,"atlas.sushi",'scenary')
			scenary.y = scenary.height * 0.5 + 38
			scenary.anchor.setTo(0.5, 0.5)

			var lamp = game.add.tileSprite(0 , 0, game.world.width, 63, "atlas.sushi", "lamp")
			lamp.y = 40
			// lamp.anchor.setTo(0, 1)
			sceneGroup.add(lamp)

			var barPositions = [-203, -7, 189]
			var barsGroup = game.add.group()
			barsGroup.x = game.world.centerX
			barsGroup.y = game.world.height
			sceneGroup.add(barsGroup)
			for(var barIndex = 0; barIndex < 3; barIndex++){

				var singleBar = game.add.group()
				singleBar.x = barPositions[barIndex]
				barsGroup.add(singleBar)

				var bar = game.add.graphics()
				bar.beginFill(0xD6C26D)
				bar.drawRect(0,0,107, game.world.height - 330)
				bar.endFill()

				var barSprite = game.add.sprite(0, 0, bar.generateTexture())
				bar.destroy()
				barSprite.anchor.setTo(0.5, 1)
				singleBar.add(barSprite)

				var rollTile = game.add.tileSprite(0, 0, 96, game.world.height - 330, "atlas.sushi", "roll")
				rollTile.anchor.setTo(0.5, 1)
				singleBar.add(rollTile)
				
				rollTile.update = updateRoll

			}

			sushiSong = game.add.audio('dojoSong')
            game.sound.setDecodedCallback(sushiSong, function(){
                sushiSong.loopFull(0.6)
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
            createSpines()
            createGameObjects()
            startRound()

            createTutorial()
            
		}
	}
}()