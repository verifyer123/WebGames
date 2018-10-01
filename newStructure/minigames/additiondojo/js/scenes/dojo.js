
var soundsPath = "../../shared/minigames/sounds/"
var dojo = function(){

	var localizationData = {
		"EN":{
			"howTo":"How to Play?",
			"moves":"Moves left",
		},

		"ES":{
			"moves":"Movimientos extra",
			"howTo":"¿Cómo jugar?",

		}
	}


	assets = {
		atlases: [
			{   
				name: "atlas.dojo",
				json: "images/dojo/atlas.json",
				image: "images/dojo/atlas.png",
			},
		],
		images: [
			{   name:"fondo",
			 file: "images/dojo/fondo.png"},
			{   name:"tutorial_image",
			 file: "images/dojo/tutorial_image.png"},
			{   name:"introscreen",
			 file: "images/dojo/introscreen.png"}

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
			{
				name: "dojoSong",
				file: soundsPath + "songs/asianLoop2.mp3"}
		],
		spritesheets:[
			{
				name:"coin",
				file:"images/spines/coin/coin.png",
				width:122,
				height:123,
				frames:12
			},
			{
				name:"hand",
				file:"images/spines/hand/hand.png",
				width:115,
				height:111,
				frames:23
			}
		],
		spines:[

			{
				name:"master",
				file:"images/spines/skeleton.json"

			}

		]
	}


	var CARD_TIME = 300

	var lives = null
	var sceneGroup = null
	var pointsGroup = null
	var gameActive = true
	var arrayComparison = null
	var gameIndex = 0
	var tutoIndex
	var overlayGroup
	var dojoSong
	var master
	var cardsTuto = [];
	var quantNumber
	var numberIndex = 0
	var numberToCheck
	var addNumber
	var coins, hand
	var lastObj
	var cardsGroup, boardGroup
	var timer
	var cardsNumber
	var numbersChanged
	var numberToChange
	var tutorial
	var maxNumber
	var selectGroup
	var comboCount
	var clock
	var timeValue

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

		game.stage.backgroundColor = "#ffffff"
		//gameActive = true
		cardsNumber = 4
		maxNumber = 3
		tutorial = true
		tutoIndex = 0
		lives = 3
		quantNumber = 0
		numbersChanged=-1
		numberToChange = []
		arrayComparison = []
		comboCount = 0
		numberIndex = 0
		timeValue = 7

		loadSounds()

	}


	function createPart(key,obj){

		var particlesNumber = 2

		if(game.device.desktop == true){ 

			particlesNumber = 4

			var particlesGood = game.add.emitter(0, 0, 100);

			particlesGood.makeParticles('atlas.dojo',key);
			particlesGood.minParticleSpeed.setTo(-200, -50);
			particlesGood.maxParticleSpeed.setTo(200, -100);
			particlesGood.minParticleScale = 0.2;
			particlesGood.maxParticleScale = 1;
			particlesGood.gravity = 150;
			particlesGood.angularDrag = 30;

			particlesGood.x = obj.x;0
			particlesGood.y = obj.y;
			particlesGood.start(true, 1000, null, particlesNumber);

			game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true);
			sceneGroup.add(particlesGood)

		}else{
			key+='Part'
			var particle = sceneGroup.create(obj.x,obj.y,'atlas.dojo',key)
			particle.anchor.setTo(0.5,0.5)
			particle.scale.setTo(1.2,1.2)
			game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
			game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
		}

	}

	function setNumbers(){

		numberIndex = 0
		addNumber = 0

		for(var i = 0; i < boardGroup.numbersGroup.length; i++){

			var group = boardGroup.numbersGroup[i]
			group.alpha = 0

			for(var u = 0; u<group.numbers.length;u++){
				var number = group.numbers[u]
				number.setText('')
			}
		}

		quantNumber = game.rnd.integerInRange(2,3)

		if(quantNumber == 2){
			boardGroup.numbersGroup[0].alpha = 1
			boardGroup.number.x = boardGroup.number.initialX
		}else{
			boardGroup.numbersGroup[1].alpha = 1
			boardGroup.number.x = boardGroup.number.initialX + 10
		}

		var numbers = []
		numberToCheck = 0

		var numbersToAdd = []

		for(var i = 0; i < quantNumber;i++){

			numbers[i] = game.rnd.integerInRange(1,maxNumber)
			numberToCheck+= numbers[i]
			numbersToAdd[numbersToAdd.length] = numbers[i]
			cardsTuto[i]=numbers[i];
		}

		for(var i = 0; i < (9 - quantNumber); i++){

			numbersToAdd[numbersToAdd.length] = game.rnd.integerInRange(1,9)
		}
		
		Phaser.ArrayUtils.shuffle(numbersToAdd)

		var tutoCounter=0;
		for(var i = 0; i<cardsGroup.length;i++){
			var number = cardsGroup.children[i]
			if(!tutorial)number.children[0].inputEnabled=true
			number.number = numbersToAdd[i]
			number.text.setText(number.number)
		}
		
		var bloquedSlots=[]
		for(var i = 0; i<quantNumber;i++){
			for(var j = 0; j<cardsGroup.length;j++){
				var number = cardsGroup.children[j];
				if(cardsTuto[i]==numbersToAdd[j] && tutoCounter<quantNumber && bloquedSlots[0]!=j && bloquedSlots[1]!=j && bloquedSlots[2]!=j){
					bloquedSlots[tutoCounter]=j
					cardsTuto[tutoCounter]=number;
					tutoCounter++;
				}
			}
		}
		boardGroup.number.setText(numberToCheck)

	}

	function hideO(){

		selectGroup.alpha = 1
		cardsGroup.alpha = 1
		boardGroup.alpha = 0

		for(var i = 0; i < selectGroup.length;i++){

			selectGroup.children[i].alpha = 0
		}

		for(var i = 0; i < cardsGroup.length;i++){

			var card = cardsGroup.children[i]
			card.alpha = 0
			card.image.pressed = false
		}
		
		if(!tutorial){
			if(pointsBar.number==1)createClock()
			game.add.tween(clock.bar.scale).to({x:clock.bar.origScale},500,Phaser.Easing.linear,true)
		}

	}
	function animateNumbers(){

		hideO()

		var delay = 500

		game.time.events.add(delay,function(){

			boardGroup.alpha = 1
			game.add.tween(boardGroup.scale).from({x:0.01},250, Phaser.Easing.linear,true)
			sound.play("cut")

		},this)

		delay+= 300

		for(var i = 0; i<cardsGroup.length;i++){

			var card = cardsGroup.children[i]
			popObject(card,delay)
			delay +=200
		}

		game.time.events.add(delay,function(){
			if(!tutorial){
				clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeValue * quantNumber * 1000,Phaser.Easing.linear,true )
				clock.tween.onComplete.add(function(){
					gameActive = false
					checkNumber()
					
				})
			}else{
				handTuto()
			}
			gameActive = true

		},this)
	}
	function handTuto(){

		if(cardsTuto[tutoIndex]){
			if(tutoIndex==0){
				game.add.tween(hand).to({alpha:0},300,Phaser.Easing.Cubic.In,true);
				cardsTuto[tutoIndex].children[0].inputEnabled=true;
				hand.x=cardsTuto[tutoIndex].centerX;
				hand.y=cardsTuto[tutoIndex].centerY;
				game.add.tween(hand).to({alpha:1},300,Phaser.Easing.Cubic.In,true);
			}else{
				game.add.tween(hand).to({x:cardsTuto[tutoIndex].centerX,y:cardsTuto[tutoIndex].centerY},300,Phaser.Easing.linear,true).onComplete.add(function(){
					cardsTuto[tutoIndex].children[0].inputEnabled=true;
				})
			}
		}
	}

	function popObject(obj,delay){

		game.time.events.add(delay,function(){

			sound.play("cut")
			obj.alpha = 1
			game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
		},this)
	}

	function animateScene() {

		gameActive = false

		var startGroup = new Phaser.Group(game)
		sceneGroup.add(startGroup)

		sceneGroup.alpha = 0
		game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

		setNumbers()
		hideO()
		//game.time.events.add(500, showCards , this);

	}

	function changeImage(index,group){
		for (var i = 0;i< group.length; i ++){
			group.children[i].alpha = 0
			if( i == index){
				group.children[i].alpha = 1
			}
		}
	} 

	function addLive(){

		sound.play("right")

		lives++;
		heartsGroup.text.setText('X ' + lives)

		var scaleTween = game.add.tween(heartsGroup.scale).to({x: 1.2,y:1.2}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		})

		addNumberPart(heartsGroup.text,'+1')

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

	function missPoint(){

		sound.play("wrong")

		lives--;
		heartsGroup.text.setText('X ' + lives)

		var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		})

		if(lives == 0){
			stopGame(false)
		}
		addNumberPart(heartsGroup.text,'-1')

	}
	function Coin(objectBorn,objectDestiny,time){
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

	function addPoint(number){

		sound.play("magic")
		pointsBar.number+=number;
		pointsBar.text.setText(pointsBar.number)

		var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		})

		addNumberPart(pointsBar.text,'+' + number)

		if(pointsBar.number % 2 == 0){
			timeValue-=0.3
		}

		if(pointsBar.number % 3 == 0){

			if(maxNumber < 9){
				maxNumber++
			}

		}

	}

	function checkNumber(){
		if(!tutorial){
			if(clock.tween){
				clock.tween.stop()
			}
		}

		if(addNumber == numberToCheck){
			Coin(master,pointsBar,100);
			if(tutorial){
				tutorial=false;
				hand.destroy()
			}
			master.setAnimationByName(0,"WIN",false)
		}else{
			missPoint()
			master.setAnimationByName(0,"LOSE",false)
		}

		master.addAnimationByName(0, "IDLE", true);

		hideObjects()

	}

	function hideObjects(){

		var objectsToHide = [selectGroup,cardsGroup,boardGroup]

		var delay = 500

		for(var i = 0; i < objectsToHide.length;i++){

			game.add.tween(objectsToHide[i]).to({alpha:0},300,Phaser.Easing.linear,true,delay)
			delay +=200
		}

		delay+=300
		if(lives == 0){

			game.time.events.add(1000,stopGame,this)
		}else{

			game.time.events.add(delay,function(){
				setNumbers()
				animateNumbers()
			},this)
		}
	}
	function releaseCard(obj){
		obj.pressed=false;
		addNumber-=obj.parent.number
		var number = boardGroup.numbersGroup[quantNumber-2].numbers[obj.index]
		game.add.tween(number.scale).from({x:0,y:0},200,Phaser.Easing.linear,true).onComplete.add(function(){
			obj.inputEnabled=true;
		})
		number.setText("")
		sound.play("flip")
		numbersChanged++;

		numberToChange[numbersChanged]=obj.index;

		var selectObj = selectGroup.children[obj.index]
		selectObj.x = obj.world.x
		selectObj.y = obj.world.y
		numberIndex--;
		game.add.tween(selectObj).to({alpha:0},500,Phaser.Easing.linear,true)

		var parent = obj.parent
		game.add.tween(parent.scale).to({x:0.6,y:0.6},200,Phaser.Easing.linear,true).onComplete.add(function(){
			game.add.tween(parent.scale).to({x:1,y:1},100,Phaser.Easing.linear,true)
		})
	}
	function inputCard(obj){
		if(gameActive == false){ 
			return
		}
		obj.inputEnabled=false;
		if(obj.pressed == true){
			releaseCard(obj)
			return
		}else{
			if(numbersChanged!=-1){
				numberToChange.sort()
				numberToChange.reverse()
				var selectObj = selectGroup.children[numberToChange[numbersChanged]]
				selectObj.x = obj.world.x
				selectObj.y = obj.world.y
				var number = boardGroup.numbersGroup[quantNumber-2].numbers[numberToChange[numbersChanged]]
				obj.index=numberToChange.splice(numbersChanged,1)
				numbersChanged--;
				numberIndex++;
				number.setText(obj.parent.number)
			}else{
				var selectObj = selectGroup.children[numberIndex]
				selectObj.x = obj.world.x
				selectObj.y = obj.world.y
				var number = boardGroup.numbersGroup[quantNumber-2].numbers[numberIndex]
				number.setText(obj.parent.number)
				obj.index=numberIndex;
				numberIndex++
			}
			game.add.tween(selectObj).to({alpha:1},500,Phaser.Easing.linear,true)

			game.add.tween(number.scale).from({x:0.01,y:0.01},200,Phaser.Easing.linear,true).onComplete.add(function(){
				if(!tutorial){
					obj.inputEnabled=true;
				}else{
					tutoIndex++;
					if(tutoIndex<quantNumber){
						handTuto()
					}
				}
			})

			addNumber+=obj.parent.number

			if(numberIndex == quantNumber){

				gameActive = false
				checkNumber()
			}

			sound.play("flip")

			var parent = obj.parent
			game.add.tween(parent.scale).to({x:0.6,y:0.6},200,Phaser.Easing.linear,true).onComplete.add(function(){
				game.add.tween(parent.scale).to({x:1,y:1},100,Phaser.Easing.linear,true)
			})

			//gameActive = false
			obj.pressed = true

		}

	}
	function createCoinsAndHand(){
		//Coins
		coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin");
		coins.anchor.setTo(0.5);
		coins.scale.setTo(0.5);
		coins.animations.add('coin');
		coins.animations.play('coin', 24, true);
		coins.alpha=0;
		sceneGroup.add(coins)

		hand=game.add.sprite(100,100, "hand")
		hand.anchor.setTo(0,0);
		hand.scale.setTo(0.7,0.7);
		hand.animations.add('hand');
		hand.animations.play('hand',24, true);
		hand.alpha=0;
		sceneGroup.add(hand)

	}

	function createCards(){

		var background = new Phaser.Graphics(game)
		background.beginFill(0x000000);
		background.drawRoundedRect(game.world.centerX - 250, game.world.centerY - 35 , 500, 500);
		background.endFill();
		background.alpha = 0.6
		sceneGroup.add(background)

		cardsGroup = game.add.group()
		cardsGroup.scale.setTo(0.8,0.8)
		cardsGroup.x = game.world.centerX
		cardsGroup.y = background.y + 210   
		sceneGroup.add(cardsGroup)

		var initX = -190
		var pivotX = initX
		var pivotY = background.y + 160 + background.width * 0.5
		for(var i = 0; i<9;i++){

			var group = game.add.group()
			group.x = pivotX
			group.y = pivotY
			cardsGroup.add(group)

			var textColor = "#420000"
			var textAdd = 'Clear'

			var multiple = i+1

			if(multiple % 2 == 0){
				textAdd = 'Dark'
				textColor = "#ffffff"
			}

			var image = group.create(0,0,'atlas.dojo','panel' + textAdd)
			image.inputEnabled = false
			image.index=-1;
			image.events.onInputDown.add(inputCard)
			image.pressed = false

			image.anchor.setTo(0.5,0.5)

			var fontStyle = {font: "100px VAGRounded", fontWeight: "bold", fill: textColor, align: "center"}

			var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			group.add(pointsText)

			group.text = pointsText
			group.image = image
			group.number = 0

			pivotX+= image.width * 1.2

			if(multiple % 3 == 0){
				pivotX = initX
				pivotY+= image.height * 1.2
			}

		}

		selectGroup = game.add.group()
		sceneGroup.add(selectGroup)

		for(var i = 0; i < 3; i++){

			var image = selectGroup.create(0,0,'atlas.dojo','marco')
			image.alpha = 0
			image.scale.setTo(0.75,0.75)
			image.anchor.setTo(0.5,0.5)

		}

	}

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.dojo','xpcoins')
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

	function createHearts(){

		heartsGroup = game.add.group()
		heartsGroup.y = 10
		sceneGroup.add(heartsGroup)


		var pivotX = 10
		var group = game.add.group()
		group.x = pivotX
		heartsGroup.add(group)

		var heartImg = group.create(0,0,'atlas.dojo','life_box')

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

	function stopGame(win){

		//objectsGroup.timer.pause()
		gameActive = false
		//timer.pause()
		dojoSong.stop()

		tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 750)
		tweenScene.onComplete.add(function(){

			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
			sceneloader.show("result")
		})
	}

	function createBoard(){

		master = game.add.spine(game.world.centerX - 100,250, "master");
		master.scale.setTo(0.6,0.6)
		master.setAnimationByName(0, "IDLE", true);
		master.setSkinByName('normal');
		sceneGroup.add(master)

		boardGroup = game.add.group()
		boardGroup.x = game.world.centerX
		boardGroup.y = game.world.centerY - 200
		sceneGroup.add(boardGroup)

		var boardImage = boardGroup.create(0,0,'atlas.dojo','pergamino')
		boardImage.width*=1.1
		boardImage.anchor.setTo(0.5,0.5)

		var fontStyle = {font: "100px VAGRounded", fontWeight: "bold", fill: "#420000", align: "center"}

		var pointsText = new Phaser.Text(sceneGroup.game, boardImage.width * 0.27, 20, 0, fontStyle)
		pointsText.initialX = pointsText.x
		pointsText.anchor.setTo(0.5,0.5)
		boardGroup.add(pointsText)

		boardGroup.number = pointsText

		boardGroup.numbersGroup = []

		for(var u = 0; u < 2; u++){

			var firstGroup = game.add.group()
			firstGroup.x-=25
			firstGroup.y = 15
			firstGroup.alpha = 0
			boardGroup.add(firstGroup)

			firstGroup.numbers = []
			boardGroup.numbersGroup[boardGroup.numbersGroup.length] = firstGroup

			var pivotX = -100
			var itemText = ['','+','','=']
			var offset = 70

			if(u==1){
				itemText = ['','+','','+','','=']
				firstGroup.scale.setTo(0.8,0.8)
				firstGroup.x-=50
				offset = 67
			}

			//console.log(itemText + ' items')

			for(var i = 0; i < itemText.length;i++){

				if((i+1) % 2 == 0){

					var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#420000", align: "center"}

					var pointsText = new Phaser.Text(sceneGroup.game, pivotX, 0 , itemText[i], fontStyle)
					pointsText.anchor.setTo(0.5,0.5)
					firstGroup.add(pointsText)

				}else{

					var group = game.add.group()
					group.x = pivotX
					firstGroup.add(group)

					var image = group.create(0,0,'atlas.dojo','numFaltante')
					image.anchor.setTo(0.5,0.5)

					var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

					var pointsText = new Phaser.Text(sceneGroup.game, pivotX, 3 , itemText[i], fontStyle)
					pointsText.anchor.setTo(0.5,0.5)
					firstGroup.add(pointsText)

					firstGroup.numbers[firstGroup.numbers.length] = pointsText

				}

				pivotX += offset

			}

		}

	}

	function preload(){
		game.stage.disableVisibilityChange = false;  
	}

	function createOverlay(){

		overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
		sceneGroup.add(overlayGroup)

		tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)

	}

	function onClickPlay(){
		overlayGroup.y = -game.world.height

		gameStart = true
		animateNumbers()
	}

	function createClock(){

		clock = game.add.group()
		clock.x = game.world.centerX
		clock.y = cardsGroup.y + 190
		sceneGroup.add(clock)

		var clockImage = clock.create(0,0,'atlas.dojo','clock')
		clockImage.anchor.setTo(0.5,0.5)

		var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.dojo','bar')
		clockBar.anchor.setTo(0,0.5)
		clockBar.width = clockImage.width*0.76
		clockBar.height = 22
		clockBar.origScale = clockBar.scale.x

		clock.bar = clockBar

	}

	return {
		assets: assets,
		name: "dojo",
		preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){

			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel)

			var background = sceneGroup.create(-2,-2,'fondo')
			background.width = game.world.width+2
			background.height = game.world.height+2

			dojoSong = game.add.audio('dojoSong')
			game.sound.setDecodedCallback(dojoSong, function(){
				dojoSong.loopFull(0.6)
			}, this);

			game.onPause.add(function(){
				game.sound.mute = true
			} , this);

			game.onResume.add(function(){
				game.sound.mute = false
			}, this);

			initialize()

			createBoard()
			createCards()
			

			createHearts()
			createPointsBar()
			createCoinsAndHand()
			buttons.getButton(dojoSong,sceneGroup)

			createOverlay()

			animateScene()

		},
	}
}()