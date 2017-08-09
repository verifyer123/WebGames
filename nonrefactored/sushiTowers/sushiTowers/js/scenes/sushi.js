
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
    var MAX_NUM_SUSHIS = 20
    var SUSHIS = ["sushi1", "sushi3"]
	var SUSHI_DATA = {
    	"sushi1":{num:1, denom:3},
    	"sushi3":{num:2, denom:5}
	}
    var BRICK_HEIGHT = 82
	var BAR_POSITIONS = [-203, -7, 189]

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
    var sushiList
    var sushisInGame
    var numSpaces
    var gameGroup
    var maxHeight
    var brickSelected
    var spineObj1
    var spineObj2
    var roundCounter
    var timeNextSushi
    var timeBetween
    var gameActive
    var swipe
    var pointsNextRound
    var addBrickCounter
    var speed
    var indexCounter
	var nao, tomiko
	var correctParticle, wrongParticle
	var cueLine
	var barLanes

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
        sushiList = []
        sushisInGame = [[],[],[]]
		sushisInGame[0].delaySushi = 0
		sushisInGame[1].delaySushi = 0
		sushisInGame[2].delaySushi = 0
		cueLine = [[],[],[]]
        brickSelected = null
        numSpaces = Math.floor(game.world.height / BRICK_HEIGHT)

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        inputsEnabled = false
        maxHeight = game.world.height - 50
        timeNextSushi = 0
        
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
    
    function createSushi(index, sushi) {
        // var containerGroup = game.add.group()
		// containerGroup.x = 0
		// containerGroup.y = 0

        // console.log(brickName)
        var sprite = pullGroup.create(0, 0, "atlas.sushi", sushi)
        sprite.anchor.setTo(0.5, 0.5)
		// sprite.denom = sushi.denom
		// sprite.defNum = sushi.defNum

		if(!sushiList[sushi])
			sushiList[sushi] = []
        sushiList[sushi].push(sprite)

		var sushiBg = pullGroup.create(0, 0, "atlas.sushi", "numberBg")
		sushiBg.anchor.setTo(0.5, 0.5)
		if(!sushiList.bg)
			sushiList.bg = []
		sushiList.bg.push(sushiBg)

        // var glow = containerGroup.create(0, 0, "atlas.sushi", "glow")
        // glow.anchor.setTo(0.5, 0.5)
        // glow.alpha = 0
        // containerGroup.glow = glow

        // var particle = createPart("star")
        // containerGroup.particle = particle
        // containerGroup.add(particle)

        // pullGroup.add(containerGroup)

        // sprite.events.onInputDown.add(onClickBrick)
		sprite.inputEnabled = true
		sprite.input.enableDrag(true)
		sprite.events.onDragStart.add(onDragStart, this)
		sprite.events.onDragUpdate.add(onDragUpdate, this)
		sprite.events.onDragStop.add(onDragStop, this)
		sprite.inputEnabled = false

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

        for(var sushiNameIndex = 0; sushiNameIndex < SUSHIS.length; sushiNameIndex++){
			for(var sushiIndex = 0; sushiIndex < MAX_NUM_SUSHIS; sushiIndex++){
				createSushi(sushiIndex, SUSHIS[sushiNameIndex])
			}
		}

    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.sushi',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;
		particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)

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

    function createTextGroup(num, denom){
		var operationGroup = game.add.group()

		var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var numerador = new Phaser.Text(sceneGroup.game, 0, -12, num, fontStyle)
		numerador.anchor.setTo(0.5, 0.5)
		operationGroup.add(numerador)
		operationGroup.num = numerador

		var line = game.add.graphics()
		line.beginFill(0xffffff)
		line.drawRoundedRect(0, 0, 30, 4, 2)
		line.x = -15
		line.y = -2
		line.endFill()
		operationGroup.add(line)

		var denominador = new Phaser.Text(sceneGroup.game, 0, 22, denom, fontStyle)
		denominador.anchor.setTo(0.5, 0.5)
		operationGroup.add(denominador)
		operationGroup.denom = denominador

		return operationGroup
	}

    function addSushi(name, lane, toY) {
        var round = ROUNDS[roundCounter]
        var roundNumbers = round.numbers
        timeNextSushi = 0
        pointsNextRound = round.pointsForNextRound
		var dataSushi = SUSHI_DATA[name]
        // var roundColors = round.colors

        var sushi = game.add.group()

		sushi.sushiList = []
		for(var containerIndex = 0; containerIndex < dataSushi.num; containerIndex++){
			var sushiSprite = sushiList[name].pop()
			sushiSprite.y = -sushiSprite.height * 0.5 * containerIndex
			sushiSprite.inputEnabled = true
			sushiSprite.originalY = sushiSprite.y
			sushi.sushiList.push(sushiSprite)
			sushi.add(sushiSprite)

			if(!sushi.container)
				sushi.container = sushiSprite
		}

		sushi.denom = dataSushi.denom
		sushi.name = name
		// containerGroup.originalIndex = index
		sushi.alpha = 0
		// containerGroup.sushi = sprite
		sushi.num = dataSushi.num
		sushi.lane = lane

		var bg = sushiList.bg.pop()
		bg.y = 0
		bg.alpha = 1
		sushi.bg = bg

        pullGroup.remove(sushiSprite)
		gameGroup.add(sushi)
        // brick.color = roundColors ? roundColors[addBrickCounter] : game.rnd.integerInRange(0, CONTAINERS.length - 1)
        indexCounter++
        // brick.color = indexCounter % CONTAINERS.length
        // brick.container.tint = CONTAINERS[brick.color]
        // brick.alpha = 1
		sushi.scale.x = 1
		sushi.scale.y = 1
        // brick.glow.alpha = 0
		sushi.x = BAR_POSITIONS[lane]
		sushi.y = toY || 340
		// sushi.timeElapsed = 0

        if ((addBrickCounter == 0)&&(roundCounter > 0))
            roundNumbers = Phaser.ArrayUtils.shuffle(roundNumbers)
        var number = roundNumbers[addBrickCounter]
        addBrickCounter = addBrickCounter + 1 < roundNumbers.length ? addBrickCounter + 1 : 0
        // console.log(rndNumber)
		// sushi.text.setText(number)
		sushi.number = number

		sushi.container.inputEnabled = true

		var operationText = createTextGroup(sushi.num, sushi.denom)
		operationText.y = -sushi.container.height * 0.10 * sushi.num
		operationText.add(bg)
		operationText.sendToBack(bg)
		sushi.add(operationText)
		sushi.operationText = operationText

		sushisInGame[lane].push(sushi)
		game.add.tween(sushi).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true)
		// cueLine[lane].unshift(sushi)
		// bricksInGame.push(sushi)

    }
    
    function startRound() {

        for(var brickIndex = 0; brickIndex < 3; brickIndex++){
            var toY = (maxHeight - (brickIndex) * 80)
            addSushi("sushi1", 1, toY)
			// var sushi = cueLine[1].pop()
			// console.log(sushi)
			// sushi.alpha = 1
			// sushisInGame[1].push(sushi)
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
    
    function sushiAnimation(toX, lane) {
        var toX = 10
        for(var brickIndex = 0; brickIndex<sushisInGame[lane].length; brickIndex++){
            var brick = sushisInGame[brickIndex]
            game.add.tween(brick).to({x:toX}, 150, Phaser.Easing.Cubic.InOut, true).yoyo(true).loop(true)
        }
    }

    function createSpines() {
		nao = createSpine("yogotar", "nao")
		nao.x = game.world.centerX + 92
		nao.y = game.world.height - 100
		nao.scale.setTo(-0.5, 0.5)
		sceneGroup.add(nao)

		tomiko = createSpine("yogotar", "tomiko")
		tomiko.x = game.world.centerX - 98
		tomiko.y = game.world.height - 100
		tomiko.scale.setTo(0.5, 0.5)
		sceneGroup.add(tomiko)
    }
    
    function destroyBg(operationText) {
		var sushi = operationText.parent
		var bg = sushi.bg

		if(sushi.num <= 0){
			pullGroup.add(bg)
			sushiList.bg.push(bg)
			sushi.destroy()
		}
	}

	function removeSushi(sushi) {
		for(var containerIndex = 0, num = sushi.sushiList.length; containerIndex < num; containerIndex++){
			var container = sushi.sushiList[containerIndex]
			sushi.remove(container)
			pullGroup.add(container)
			sushiList[sushi.name].push(container)
		}

		pullGroup.add(sushi.bg)
		sushiList.bg.push(sushi.bg)
		sushi.destroy()
	}
	
	function moveSushi(args) {
		// var args = this.args

    	var toX = args.position.x - gameGroup.x
		var toY = args.position.y - gameGroup.y

    	var tweenMove = game.add.tween(args.sushi).to({x: [toX, toX], y:[toY, toY], alpha:[1,0]}, 600, Phaser.Easing.Cubic.Out, true)
		game.add.tween(args.sushi.scale).to({x:0.5, y:0.5}, 300, Phaser.Easing.Cubic.Out, true)
		tweenMove.onComplete.add(removeSushi)

		sushisInGame[args.sushi.lane].splice(args.sushi.index, 1)
	}
    
	function sushiCompleted(sushi) {
		correctParticle.x = sushi.centerX
		correctParticle.y = sushi.centerY
		correctParticle.start(true, 1000, null, 5)
		sushi.completed = true
		for(var containerIndex = 0; containerIndex < sushi.sushiList.length; containerIndex++){
			var container = sushi.sushiList[containerIndex]
			container.inputEnabled = false
		}

		var args = {sushi:sushi, position:{x:nao.centerX - 50, y:nao.centerY}}

		nao.setAnimation(["WIN", "EAT", "IDLE"])
		game.time.events.add(1350, moveSushi, null, args)
	}

	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

	}

	function onDragStart(obj, pointer) {

		// sound.play("drag")
		var option = obj.parent
		option.deltaX = pointer.x - obj.world.x
		option.deltaY = pointer.y - obj.world.y - obj.originalY

		option.startX = (obj.world.x - gameGroup.x)
		option.startY = (obj.world.y - gameGroup.y - obj.originalY)

		console.log(option.num)

		// if(option.answer) {
		// 	option.answer.option = null
		// 	option.answer = null
		// }

		gameGroup.bringToTop(option)

		if(option.scaleTween)
			option.scaleTween.stop()

		option.scaleTween = game.add.tween(option.scale).to({x: 1.1, y: 1.1}, 200, Phaser.Easing.Cubic.Out, true)
		console.log(option.index)
		if(option.index != null){
			sushisInGame[option.lane].splice(option.index, 1)
			option.index = null
		}

	}

	function onDragUpdate(obj, pointer, x, y) {
		var option = obj.parent
		obj.x = 0
		obj.y = obj.originalY
		option.x = option.startX + x - option.deltaX
		option.y = option.startY + y - option.deltaY - obj.originalY * 2

		gameGroup.bringToTop(option)
	}

	function onDragStop(obj) {
		var option = obj.parent
		obj.x = 0
		obj.y = obj.originalY
		for(var containerIndex = 0; containerIndex < option.sushiList.length; containerIndex++){
			var container = option.sushiList[containerIndex]
			container.inputEnabled = false
		}

		game.add.tween(option.scale).to({x: 1, y: 1}, 200, Phaser.Easing.Cubic.Out, true)

		var lineToCollide = option.lane
		for(var barIndex = 0; barIndex < barLanes.length; barIndex++){
			var bar = barLanes[barIndex]
			var collide = checkOverlap(bar, option)
			if(collide){
				lineToCollide = barIndex
			}
		}
		var toX = BAR_POSITIONS[lineToCollide]

		option.tween = game.add.tween(option).to({x: toX, y: 290}, 600, Phaser.Easing.Cubic.Out, true)
		option.tween.onComplete.add(function (thisOption) {
			for(var containerIndex = 0; containerIndex < thisOption.sushiList.length; containerIndex++){
				var container = thisOption.sushiList[containerIndex]
				container.inputEnabled = true
			}
			// console.log(cueLine[1].length)
			// cueLine[1].push(option)
			// option.index =
			thisOption.lane = lineToCollide
			sushisInGame[lineToCollide].push(thisOption)
			// game.add.tween(sushi).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true)

			// console.log(cueLine[1].length)
			sushisInGame[lineToCollide].delaySushi = 500
			// timeNextSushi = timeBetween
			// bricksInGame.push(option)
		})

	}
	
	function moveGroupText(sushi) {
		var numText = sushi.operationText.num
		numText.text = sushi.num
		sushi.bringToTop(sushi.operationText)
		var toYOperation = -sushi.container.height * 0.15 * sushi.num
		// console.log(prevSushi.height)

		if (numText.tween1)
			numText.tween1.stop()
		if (numText.tween2)
			numText.tween2.stop()

		numText.tween1 = game.add.tween(numText.scale).to({x:1.2, y:1.1}, 200, Phaser.Easing.Cubic.Out, true).yoyo(true)
		numText.tween2 = game.add.tween(sushi.operationText).to({y:toYOperation}, 300, Phaser.Easing.Cubic.Out, true)
	}

	function mergeSushis(sushi, prevSushi){
		sushi.container = null

		var numNeeded = prevSushi.denom - prevSushi.num
		var difNumSushi = sushi.num - numNeeded < 0 ? sushi.num : numNeeded
		// console.log(difNumSushi)
		prevSushi.num += difNumSushi
		sushi.num -= difNumSushi
		var totalSushis = prevSushi.num + sushi.num

		for(var containerIndex = 0, num = sushi.sushiList.length; containerIndex < num; containerIndex++){
			var container = sushi.sushiList.shift()

			if(containerIndex < difNumSushi){
				var toY = -container.height * 0.5 * (totalSushis - 1 - (num - containerIndex - 1)) //sushi.container.y
				var actualY = container.world.y - prevSushi.container.world.y
				container.y = actualY
				game.add.tween(container).to({y:toY}, 300, null, true)

				prevSushi.add(container)
				prevSushi.sushiList.push(container)
			}else{
				// console.log(containerIndex + 1 - difNumSushi)
				var toY = container.height * 0.5 * (difNumSushi - containerIndex) //sushi.container.y
				console.log(difNumSushi, toY)
				game.add.tween(container).to({y:toY}, 300, null, true)
				if(!sushi.container)
					sushi.container = container
				gameGroup.bringToTop(sushi)
				sushi.sushiList.push(container)
			}
			container.originalY = toY
			// container.inputEnabled = false
		}

		moveGroupText(prevSushi)
		// var currentBgTween = game.add.tween(sushi.operationText).to({alpha:0, y:toYOperation * -1}, 300, Phaser.Easing.Cubic.Out, true)
		// currentBgTween.onComplete.add(destroyBg)

		if(sushi.num <= 0) {
			sushisInGame[sushi.lane].splice(sushi.index, 1)
			pullGroup.add(sushi.bg)
			sushiList.bg.push(sushi.bg)
			sushi.destroy()
		}else{
			game.add.tween(sushi).to({y:prevSushi.y - prevSushi.height + prevSushi.container.height * 0.5}, 300, null, true)
			moveGroupText(sushi)
		}

		if(prevSushi.num === prevSushi.denom){
			sushiCompleted(prevSushi)
		}
	}
	
    function update() {

        for(var lineIndex = 0; lineIndex < sushisInGame.length; lineIndex++) {
			var sushiLane = sushisInGame[lineIndex]

        	for (var sushiIndex = 0; sushiIndex < sushiLane.length; sushiIndex++) {
				var sushi = sushiLane[sushiIndex]
				sushi.index = sushiIndex
				var prevSushi = sushiLane.length > 0 ? sushiLane[sushiIndex - 1] : null
				if (prevSushi) {
					sushi.toY = prevSushi.y - prevSushi.height + 15
					// console.log(prevSushi.height, bricksInGame.length)
				}
				else
					sushi.toY = maxHeight

				// sushi.toY = (maxHeight - (sushi.index) * spaceBtw)

				if (sushi.y < sushi.toY) {
					// brick.timeElapsed += game.time.elapsedMS
					// console.log(brick.timeElapsed)
					// var vel = 8 * brick.timeElapsed / 1000
					sushi.y += speed
				}
				else {
					// sushi.y = (maxHeight - (sushi.index) * spaceBtw)
					// console.log(sushi.height)
					if (sushiIndex > 0)
						sushi.toY = prevSushi.y - prevSushi.height + 15
					else
						sushi.toY = maxHeight

					if (sushi.y <= 0) {
						sushiAnimation()
						sound.play("collapse")
						stopGame()
					}
					// sushi.timeElapsed = 0
					var notCompleted = ((prevSushi) && (!prevSushi.completed) && (!sushi.completed))
					if ((prevSushi) && (prevSushi.denom === sushi.denom) && (notCompleted)) {
						mergeSushis(sushi, prevSushi)
					}
				}
			}
			if(sushiLane.delaySushi > 0)
				sushiLane.delaySushi -= speed
		}
        timeNextSushi += game.time.elapsedMS

        //TODO: CHANGE pointsBar.number

		if((timeNextSushi >= timeBetween)&&(pointsBar.number > -1)){

			var arrayLane = new Array(0,1,2)
			arrayLane = Phaser.ArrayUtils.shuffle(arrayLane)

			for(var laneIndex = 0; laneIndex < arrayLane.length; laneIndex++){
				var chosenLane = arrayLane[laneIndex]
				if(sushisInGame[chosenLane].delaySushi <= 0) {
					addSushi("sushi3", chosenLane)
					break
				}
			}

			//TODO: change this
			// var sushiLine = cueLine[laneChosen].pop()
			// sushisInGame[laneChosen].push(sushiLine)
			// game.add.tween(sushiLine).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true)
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
			// yogomeGames.mixpanelCall("enterGame",gameIndex);

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

			var barsGroup = game.add.group()
			barsGroup.x = game.world.centerX
			barsGroup.y = game.world.height
			sceneGroup.add(barsGroup)
			barLanes = []
			for(var barIndex = 0; barIndex < 3; barIndex++){

				var singleBar = game.add.group()
				singleBar.x = BAR_POSITIONS[barIndex]
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
				barLanes.push(singleBar)

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

			correctParticle = createPart("star")
			sceneGroup.add(correctParticle)
			wrongParticle = createPart("wrong")
			sceneGroup.add(wrongParticle)

		}
	}
}()