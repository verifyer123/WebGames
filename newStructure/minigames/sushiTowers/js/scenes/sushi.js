
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
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
            },

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
			{	name: "click",
				file: soundsPath + "click.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
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
                file: soundsPath + "towerCollapse.mp3"},
			{   name: "drag",
                file: soundsPath + "drag.mp3"}
		],
		spritesheets: [
			{
				name:"coin",
                file:"images/spine/coin/coin.png",
				width:122,
                height:123,
                frames:12
            },
			{
                name:"hand",
                file:"images/spine/hand/hand.png",
                width:115,
                height:111,
                frames:5
            }
        ],
    }

    var NUM_LIFES = 3
    var MAX_NUM_SUSHIS = 100
    var SUSHIS = ["sushi1", "sushi2", "sushi3", "sushi4"]
	var SUSHI_DATA = {
    	"sushi1":{num:1, denom:3},
    	"sushi2":{num:1, denom:4},
    	"sushi3":{num:2, denom:5},
    	"sushi4":{num:2, denom:6}
	}
	var BAR_POSITIONS = [-203, -7, 189]
    
    var lives
	var sceneGroup = null
	var handGroup = null
	var heartsGroup = null
    var gameIndex = 76
    var tutoGroup
    var sushiSong
    var pullGroup = null
    var numPoints
    var inputsEnabled
    var pointsBar
    var sushiList
	var firstAnimation, secondAnimation;
	var tutorial
    var sushisInGame
    var gameGroup
    var maxHeight
    var roundCounter
    var timeNextSushi
    var timeBetween
    var gameActive
    var swipe
	var hand
	var coins
    var addBrickCounter
	var diferentSushi=[];
    var speed
	var yogotars
	var xTutorial
	var correctParticle, wrongParticle
	var barLanes
	var octopus
	var gameEnded

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
        speed = 4
        timeBetween = 3000
        sushiList = []
        sushisInGame = [[],[],[]]
		tutorial=true;
		sushisInGame[0].delaySushi = 0
		xTutorial=0;
		sushisInGame[1].delaySushi = 0
		sushisInGame[2].delaySushi = 0
		sushisInGame[0].merging = false
		sushisInGame[1].merging = false
		sushisInGame[2].merging = false
		gameEnded=false;
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        //inputsEnabled = true
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
        speed += speed * 0.02
        // }

    }
    
    function createSushi(sushi) {
		
		
        var sprite = pullGroup.create(0, 0, "atlas.sushi", sushi)
        sprite.anchor.setTo(0.5, 0.5)		
		

		
		if(!sushiList[sushi])
			sushiList[sushi] = []
        sushiList[sushi].push(sprite)

		var sushiBg = pullGroup.create(0, 0, "atlas.sushi", "numberBg")
		sushiBg.anchor.setTo(0.5, 0.5)
		if(!sushiList.bg)
			sushiList.bg = []
		sushiList.bg.push(sushiBg)
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
				createSushi(SUSHIS[sushiNameIndex])
			}
		}

    }
	function Coin(objectBorn,objectDestiny,time){
        //objectBorn= Objeto de donde nacen
        coins.x=objectBorn.centerX
        coins.y=objectBorn.centerY
        game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
        game.add.tween(coins).to({y:objectBorn.centerY-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
            game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
            game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
                coins.x=objectBorn.centerX
                coins.y=objectBorn.centerY
                addPoint(1)
            })
        })
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
        game.input.enabled = false
        gameActive = false
		for(var yogoIndex = 0; yogoIndex < yogotars.length; yogoIndex++){
			var yogotar = yogotars[yogoIndex]
			yogotar.setAnimation(["lose"])
		}
		octopus.setAnimation(["lose"])
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2500)
		tweenScene.onComplete.add(function(){
            
            var resultScreen = sceneloader.getScene("result")
            resultScreen.setScore(true, pointsBar.number, gameIndex)

            //amazing.saveScore(pointsBar.number)
			game.input.enabled = true
            sceneloader.show("result")
            sound.play("gameLose")
		})
    }
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;
        game.load.audio('dojoSong', soundsPath + 'songs/asianLoop2.mp3');
        
        /*game.load.image('introscreen',"images/sushi/introscreen.png")
		game.load.image('howTo',"images/sushi/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/sushi/play" + localization.getLanguage() + ".png")*/

        game.load.spine('octopus', "images/spine/Octopus/octopus.json")
        game.load.spine('yogotar', "images/spine/Yogotar/yogotar.json")

		
		game.load.image('tutorial_image',"images/sushi/tutorial_image.png")
		//loadType(gameIndex)

    }

    function addNumberPart(obj,number,fontStyle,direction,offset){

        direction = direction || 100
        fontStyle = fontStyle || {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        offset = offset || {x:0, y:0}

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

			var fontStyle2 = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle2)
			pointsText.x = pivotX
			pointsText.y = heartImg.height * 0.15
			pointsText.setText('X ' + lives)
			heartsGroup.add(pointsText)

			pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

			heartsGroup.text = pointsText
                
    }
	function missPoint(){
        
        sound.play("wrong")
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
			//baseSong.stop();
            stopGame(false)
        }
        
        addNumberPart(heartsGroup.text,'-1')
        
    }
    function createTextGroup(num, denom){
		var operationGroup = game.add.group()

		var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
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
        timeNextSushi = 0
		
		var dificulty=pointsBar.number;
		var dataSushi = SUSHI_DATA[name]
		
		dataSushi = SUSHI_DATA[name]
		
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
		
		var randomSkin;
		var newSkin="";
		if(pointsBar.number>0){
			randomSkin=game.rnd.integerInRange(0,2);
			newSkin=name+randomSkin;
			if(randomSkin==0){
				newSkin=name;
			}
			sushiSprite.loadTexture("atlas.sushi",newSkin);
		}
		sushi.denom = dataSushi.denom
		sushi.name = name
		sushi.alpha = 0
		sushi.num = dataSushi.num
		sushi.lane = lane

		var bg = sushiList.bg.pop()
		bg.y = 0
		bg.alpha = 1
		sushi.bg = bg

        pullGroup.remove(sushiSprite)
		gameGroup.add(sushi)
		sushi.scale.x = 1
		sushi.scale.y = 1
		sushi.x = BAR_POSITIONS[lane]
		sushi.y = toY || 330
		sushi.container.inputEnabled = true
		var operationText = createTextGroup(sushi.num, sushi.denom)
		operationText.y = -sushi.container.height * 0.10 * sushi.num
		operationText.add(bg)
		operationText.sendToBack(bg)
		sushi.add(operationText)
		sushi.operationText = operationText
		
		sushisInGame[lane].push(sushi)
		game.add.tween(sushi).to({alpha:1}, 300, Phaser.Easing.Cubic.Out, true)
    }
    
    function startRound() {

        for(var brickIndex = 0; brickIndex < 3; brickIndex++){
            var toY = (maxHeight - (brickIndex) * 300)
           	addSushi("sushi1", brickIndex, toY);
		}
		
		hand.x=game.world.centerX-200;
		hand.y=game.world.height-100;
		hand.alpha=1;
		sushisInGame[1][0].container.input.enabled=false;
		firstAnimation=game.add.tween(hand).to({x:hand.x+200,y:hand.y},2000,Phaser.Easing.Cubic.Linear,true).loop(true);
    }

    function onClickPlay(rect) {

        
	    tutoGroup.y = -game.world.height
	    gameActive = true
		startRound()
		
    }

    function sushiAnimation(lane) {
        var toX = 40
        for(var sushiIndex = 0; sushiIndex<sushisInGame[lane].length; sushiIndex++){
			toX = game.rnd.integerInRange(-100,100)
            var sushi = sushisInGame[lane][sushiIndex]
            game.add.tween(sushi).to({x:sushi.x + toX, y: game.world.height+300}, 900, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
				if(lives>0){
					destroySushi(lane);
					octopus.setAnimation(["idle"])
				}
			});
        }
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

		yogotars = [tomiko, nao]
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
		sushisInGame[sushi.lane].merging = false
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
		sound.play("swipe")
		sound.play("swallow")
		
		sushisInGame[args.sushi.lane].splice(args.sushi.index, 1)
	}
    
	function sushiCompleted(sushi) {
		sound.play("combo")

    	correctParticle.x = sushi.centerX
		correctParticle.y = sushi.centerY
		correctParticle.start(true, 1000, null, 5)
		sushi.completed = true
		for(var containerIndex = 0; containerIndex < sushi.sushiList.length; containerIndex++){
			var container = sushi.sushiList[containerIndex]
			container.inputEnabled = false
		}

		var toYogotar
		if(sushi.lane < 1){
			toYogotar = 0
		}else if(sushi.lane > 1){
			toYogotar = 1
		}else{
			toYogotar = game.rnd.integerInRange(0, yogotars.length - 1)
		}

		var yogotar = yogotars[toYogotar]
		var toX = toYogotar > 0 ? yogotar.centerX - 50 : yogotar.centerX + 50
		var args = {sushi:sushi, position:{x:toX, y:yogotar.centerY}}

		yogotar.setAnimation(["win", "eat", "idle"])
		game.time.events.add(1350, moveSushi, null, args)

		Coin(sushi,pointsBar,100);
		if(tutorial){
			hand.alpha=0;
			tutorial=false;
			if(firstAnimation)
				firstAnimation.stop();
			if(secondAnimation)
				secondAnimation.stop();
		}
	}

	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );
	}

	function onDragStart(obj, pointer) {
						
		sound.play("drag")
		//inputsEnabled=false;
		var option = obj.parent
		option.inBottom = false
		option.deltaX = pointer.x - obj.world.x
		option.deltaY = pointer.y - obj.world.y - obj.originalY

		option.startX = (obj.world.x - gameGroup.x)
		option.startY = (obj.world.y - gameGroup.y - obj.originalY)

		//console.log(option.num)

		gameGroup.bringToTop(option)

		if(option.scaleTween)
			option.scaleTween.stop()
		
		option.scaleTween = game.add.tween(option.scale).to({x: 1.1, y: 1.1}, 200, Phaser.Easing.Cubic.Out, true)
		//console.log(option.index)
		if(option.index !== null){
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
		var sushiLane = sushisInGame[lineToCollide]
		var lastSushi = sushiLane[sushiLane.length - 1]
		var toY
		var delay = 0
		var refSushi
		var cont =0 ;
		var prevSushi = null
		
		if (lastSushi){
			var sushiHeight = lastSushi.y - lastSushi.height - 15
			
			toY = option.y 
			if(toY <= 340){
				toY = 330
				delay = 150;
			}
		}else
			toY = option.y
		
		
	
		
		
		

		option.tween = game.add.tween(option).to({x: toX, y: toY}, 150, Phaser.Easing.Cubic.Out, true, delay)
		option.tween.onComplete.add(function (thisOption) {
			
			
			for(var containerIndex = 0; containerIndex < thisOption.sushiList.length; containerIndex++){
				var container = thisOption.sushiList[containerIndex]
				container.inputEnabled = true
			}
			
			for(var checkPositions=0; checkPositions<sushisInGame[lineToCollide].length; checkPositions++){
				if(checkOverlap(option.container,sushisInGame[lineToCollide][checkPositions])){
					option.y-=sushisInGame[lineToCollide][checkPositions].height;
				}
				
				if(option.y<sushisInGame[lineToCollide][checkPositions].y){
					cont++;
				}else{
					break;
				}
				prevSushi = sushisInGame[lineToCollide][checkPositions]
				prevSushi.index = cont
			}
			//if(prevSushi)
				//option.container = prevSushi
			
			thisOption.lane = lineToCollide
			thisOption.tween = null
			thisOption.index = cont
			sushisInGame[lineToCollide].splice(cont,0,option);
			//sushisInGame[lineToCollide].push(thisOption)

			sushisInGame[lineToCollide].delaySushi = 100
			
//			if(tutorial && sushisInGame[2][0]!=null && xTutorial){
//			
//				hand.x=sushisInGame[2][0].worldPosition.x;
//				secondAnimation=game.add.tween(hand).to({x:sushisInGame[1][0].worldPosition.x,y:hand.y},2000,Phaser.Easing.Cubic.Linear,true).loop(true)
//			
//			}else if(tutorial && sushisInGame[0][0]!=null && xTutorial){
//				firstAnimation.stop()
//				hand.x=sushisInGame[0][0].worldPosition.x;
//				secondAnimation=game.add.tween(hand).to({x:sushisInGame[1][0].worldPosition.x,y:hand.y},2000,Phaser.Easing.Cubic.Linear,true).loop(true)
//			}
			if(secondAnimation && tutorial  && xTutorial){
				xTutorial=sushisInGame[lineToCollide][cont];
				hand.x=xTutorial.worldPosition.x;
				secondAnimation.stop()
				secondAnimation=game.add.tween(hand).to({x:sushisInGame[1][0].worldPosition.x,y:hand.y},2000,Phaser.Easing.Cubic.Linear,true).loop(true)
			}else if(firstAnimation && tutorial && xTutorial){
				xTutorial=sushisInGame[0][0];
				hand.x=xTutorial.worldPosition.x;
				secondAnimation.stop()
				secondAnimation=game.add.tween(hand).to({x:sushisInGame[1][0].worldPosition.x,y:hand.y},2000,Phaser.Easing.Cubic.Linear,true).loop(true)
			}
			

			})

		
		
		sound.play("cut")
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
		game.input.enabled = false
		sound.play("flip")
		var numNeeded = prevSushi.denom - prevSushi.num
		var difNumSushi = sushi.num - numNeeded < 0 ? sushi.num : numNeeded
		prevSushi.num += difNumSushi
		sushi.num -= difNumSushi
		var totalSushis = prevSushi.num + sushi.num
		
		for(var containerIndex = 0, num = sushi.sushiList.length; containerIndex < num; containerIndex++){
			var container = sushi.sushiList.shift()
			
			if(containerIndex < difNumSushi){
				var toY = -container.height * 0.5 * (totalSushis - 1 - (num - containerIndex - 1)) //sushi.container.y
				var actualY = container.world.y - prevSushi.container.world.y
				container.y = actualY
				game.add.tween(container).to({y:toY}, 300, null, true).onComplete.add(function(obj){
					game.input.enabled = true
				});
				
				prevSushi.add(container)
				prevSushi.sushiList.push(container)
			}else{
				var toY = container.height * 0.5 * (difNumSushi - containerIndex) //sushi.container.y
				game.add.tween(container).to({y:toY}, 300, null, true).onComplete.add(function(obj){
					game.input.enabled = true
				});
				if(!sushi.container)
					sushi.container = container
				gameGroup.bringToTop(sushi)
				sushi.sushiList.push(container)
			}
			container.originalY = toY
		}
		moveGroupText(prevSushi)

		if(sushi.num <= 0) {
			sushisInGame[sushi.lane].splice(sushi.index, 1)
			pullGroup.add(sushi.bg)
			sushiList.bg.push(sushi.bg)
			sushi.destroy()
		}else{
			game.add.tween(sushi).to({y:prevSushi.y - prevSushi.height + prevSushi.container.height * 0.5}, 300, null, true)
			moveGroupText(sushi)
		}
		
		
		if(tutorial && sushisInGame[1][0].sushiList[1]){
			sushisInGame[1][0].sushiList[0].input.enabled=false;
			sushisInGame[1][0].sushiList[1].input.enabled=false;
		}
		if(tutorial){
			if(sushisInGame[0][0])xTutorial=sushisInGame[0][0];
			if(sushisInGame[2][0])xTutorial=sushisInGame[2][0];
		}
		if(tutorial && firstAnimation && xTutorial){
			firstAnimation.stop()
			hand.x=xTutorial.worldPosition.x;
			secondAnimation=game.add.tween(hand).to({x:sushisInGame[1][0].worldPosition.x,y:hand.y},2000,Phaser.Easing.Cubic.Linear,true).loop(true)
		}
		
		if(prevSushi.num === prevSushi.denom){
			sushisInGame[prevSushi.lane].merging = true
			sushiCompleted(prevSushi)
		}
	}
	
    function update() {

		if(gameEnded)
			return
			
		
			
		for(var lineIndex = 0; lineIndex < sushisInGame.length; lineIndex++) {
			var sushiLane = sushisInGame[lineIndex]
			var allBottom = true
			var lastSushi

        	var totalNum = 0
			for (var sushiIndex = 0; sushiIndex < sushiLane.length; sushiIndex++) {
				var sushi = sushiLane[sushiIndex]
				sushi.inBottom = false
				sushi.index = sushiIndex
				var prevSushi = sushiLane[sushiIndex - 1] !== sushi ? sushiLane[sushiIndex - 1] : null
				if (prevSushi) {
					sushi.toY = prevSushi.y - prevSushi.height + 15
				}
				else
					sushi.toY = maxHeight

				if (sushi.y < sushi.toY) {
					sushi.y += speed
				}
				
				else {
					if (sushiIndex > 0 && prevSushi)
						sushi.toY = prevSushi.y - prevSushi.height + 15
					else
						sushi.toY = maxHeight
					
					
					
					totalNum += sushi.num
					if(sushi.completed)
						totalNum = 0

					var notCompleted = ((prevSushi) && (!prevSushi.completed) && (!sushi.completed))
					if ((prevSushi) && (prevSushi.denom === sushi.denom) && (notCompleted)) {
						mergeSushis(sushi, prevSushi)
					}
					
					if((sushi.y >= maxHeight)||((prevSushi)&&(prevSushi.inBottom))){
						sushi.inBottom = true
						/*if((sushi.y <= 340) && (!sushiLane.merging)){
							sushiAnimation(lineIndex)
							sound.play("wrong")
							wrongParticle.x = sushi.centerX
							wrongParticle.y = sushi.centerY
							wrongParticle.start(true, 1000, null, 5)
							missPoint()
						}*/
					}
					sushi.y=sushi.toY;
					lastSushi = sushi
				}
				
				allBottom = allBottom && sushi.inBottom
					
			}
			if(sushiLane.delaySushi > 0)
				sushiLane.delaySushi -= speed
			
			if((allBottom)&&(lastSushi)&&(lastSushi.inBottom)&&(lastSushi.y <= 330)&&(!sushiLane.merging)){
				sushiAnimation(lineIndex)
				sound.play("wrong")
//				wrongParticle.x = lastSushi.centerX
//				wrongParticle.y = lastSushi.centerY
//				wrongParticle.start(true, 1000, null, 5)
				missPoint()
				octopus.setAnimation(["lose"]);
				gameEnded = true
				return
			}
		}
        timeNextSushi += game.time.elapsedMS

		if((timeNextSushi >= timeBetween)&&(pointsBar.number > 0)){

			var arrayLane = new Array(0,1,2)
			arrayLane = Phaser.ArrayUtils.shuffle(arrayLane)

			for(var laneIndex = 0; laneIndex < arrayLane.length; laneIndex++){
				var chosenLane = arrayLane[laneIndex]
				if(sushisInGame[chosenLane].delaySushi <= 0) {
					var randomNum = game.rnd.integerInRange(0, SUSHIS.length - 1)
					addSushi(SUSHIS[randomNum], chosenLane)
					break
				}
			}
        }

    }
    
	function destroySushi(lane){
		var moveLastSushi=sushisInGame[lane].length;
		
		for(var sushiIndex = 0; sushiIndex<sushisInGame[lane].length; sushiIndex++){
            var sushi = sushisInGame[lane][sushiIndex]
			sushi.destroy();
			sushisInGame[lane][sushiIndex].destroy();
			sushisInGame[lane].splice(0, 1)
        }
		
		gameEnded=false;
	}
	
    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)
        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }
	

	function createSpine(skeleton, skin, idleAnimation, x, y) {
		idleAnimation = idleAnimation || "idle"
		var spineGroup = game.add.group()
		x = x || 0
		y = y || 0

		var spineSkeleton = game.add.spine(0, 0, skeleton)
		spineSkeleton.x = x; spineSkeleton.y = y
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
		this.tilePosition.y += speed * 0.5
	}
    
	return {
		assets: assets,
		name: "sushi",
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
        update:function(event) {
            if(gameActive)
                update()
        },
        create: function(event){

			
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel);
			handGroup = game.add.group();
			

			var bgRect = game.add.graphics()
			bgRect.beginFill(0x150426)
			bgRect.drawRect(0,0,game.world.width, game.world.height)
			bgRect.endFill()
			sceneGroup.add(bgRect)

			var floor = game.add.tileSprite(0 , 0, game.world.width, game.world.height - 240, "atlas.sushi", "swatch")
            floor.y = game.world.height+100
			floor.anchor.setTo(0, 1)
            sceneGroup.add(floor)

			var buildings = game.add.tileSprite(0 , 0, game.world.width, 275, "atlas.sushi", "buildingBg")
			buildings.y = 74
			buildings.anchor.setTo(0, 0)
			sceneGroup.add(buildings)

			var barTop = game.add.graphics()
			barTop.beginFill(0xFF4817)
			barTop.drawRect(0,0,game.world.width, 40)
			barTop.endFill()
			sceneGroup.add(barTop)

			var background = sceneGroup.create(game.world.centerX,game.world.centerY,"atlas.sushi",'fondo')
			background.y = background.height * 0.5 + 50
			background.anchor.setTo(0.5, 0.5)

			octopus = createSpine("octopus", "normal")
			octopus.x = game.world.centerX
			octopus.y = background.y + 100
			sceneGroup.add(octopus)

			var scenary = sceneGroup.create(game.world.centerX,game.world.centerY,"atlas.sushi",'scenary')
			scenary.y = scenary.height * 0.5 + 38
			scenary.anchor.setTo(0.5, 0.5)

			var lamp = game.add.tileSprite(0 , 0, game.world.width, 63, "atlas.sushi", "lamp")
			lamp.y = 40
			sceneGroup.add(lamp)

			//Coins
			coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin");
			coins.anchor.setTo(0.5);
			coins.scale.setTo(0.5);
			coins.animations.add('coin');
			coins.animations.play('coin', 24, true);
			coins.alpha=0;
			for(var fillDiferentSushi=0; fillDiferentSushi<Object.keys(SUSHI_DATA).length; fillDiferentSushi++){
				diferentSushi[fillDiferentSushi]="sushi"+(fillDiferentSushi+1)
			}
			
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
			hand=game.add.sprite(100,100, "hand")
			hand.anchor.setTo(0,0);
			hand.scale.setTo(0.7,0.7);
			hand.animations.add('hand');
			hand.animations.play('hand',2, false);
			hand.alpha=0;
			handGroup.add(hand);
			
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

            createPointsBar()
			createHearts()
            createSpines()
            createGameObjects()
            
            createTutorial()

			correctParticle = createPart("star")
			sceneGroup.add(correctParticle)
			wrongParticle = createPart("wrong")
			sceneGroup.add(wrongParticle)

			buttons.getButton(sushiSong,sceneGroup)
		}
	}
}()