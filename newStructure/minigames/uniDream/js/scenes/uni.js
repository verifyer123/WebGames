
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var uni = function(){

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
				name: "atlas.uni",
				json: "images/uni/atlas.json",
				image: "images/uni/atlas.png"
			},

		],
		images: [
			{   name:"fondo",
				file: "images/uni/fondo.png"
			},
			{
				name:'tutorial_image',
				file:"images/uni/tutorial_image.png",
			}
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
			{	name: "brightTransition",
				file: soundsPath + "brightTransition.mp3"},
			{   name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{   name: "alarmBell",
				file: soundsPath + "alarmBell.mp3"},
			{   name: "horse_gallop",
				file: soundsPath + "horse_gallop.mp3"},
			{   name: "uniSong",
				file: soundsPath + "songs/fantasy_ballad.mp3"},
			{   name: "drag",
                file: soundsPath + "drag.mp3"},
			{   name: "discard",
                file: soundsPath + "squeeze.mp3"},
			{   name: "place",
                file: soundsPath + "magic.mp3"}
		],
		spines: [
			{
				name:"theffanie",
				file:"images/spine/theffanie/theffanie.json"
			},
			{
				name:"unicorn",
				file:"images/spine/unicorn/unicorn.json"
			},
			{
				name:"donkey",
				file:"images/spine/donkey/donkey.json"
			}
		],
		spritesheets: [
			{
                name:"hand",
                file:"images/spine/hand/hand.png",
                width:115,
                height:111,
                frames:5
            },
			{
                name:"coin",
                file:"images/spine/coin/coin.png",
                width:122,
                height:123,
                frames:12
            }
		]
		
	}

	var NUM_LIFES = 3
	var MAX_UNICORNS = 20
	var MAX_DONKEYS = 20

	
	var howManyUnicorns;
	var howManyDonkeys;
	var lives
	var sceneGroup = null
	var bedGroup=null;
	var gameIndex
	var goalUni;
	var dificulty=1;
	var nubesTop
	var manecillas
	var goalDonk;
	var tutorial
	var tutoGroup
	var uniContainer
	var donkContainer
	var bed
	var animalsCreated
	var uniSong
	var gameActive
	var tutorialLevel
	var heartsGroup = null
	var dragableUnicorn
	var dragableDonkey
	var pullGroup = null
	var checking=false
	var clock
	var hand
	var isColliding=false;
	var timer=false;
	var total=20;
	var timeValue
	var coins
	var buro
	var buttonImg
	var rectTrigger
	var quantNumber
	var inputsEnabled
	var background
	var pointsBar
	var counterTable
	var roundCounter
	var uniIco
	var donkIco
	var dragging
	var handAnimation
	var unicornList
	var clockImg
	var donkeyList
	var animationText
	var gameStoped
	var gameGroup
	var positionX
	var positionY
	var objectsInGame
	var clockCounter
	var containers
	var answer
	var dreamGroup
	var maxNumber;
	var theffanie
	var isCorrect
	var nubesAparecer
	var brightRect
	var animalsInStage
	var uniText
	var donkText

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function preload(){

	}
	function initialize(){

		game.stage.backgroundColor = "#ffffff"
		//gameActive = true
		lives = NUM_LIFES
		gameActive=false;
		timeValue = 20
		animalsCreated=0;
		gameStoped=false;
		dragging=false
		tutorialLevel=true;
		timer=false;
		quantNumber = 2
		tutorial=true;
		nubesAparecer=[]
		positionX=[]
		positionY=[]
		maxNumber=20;
		roundCounter = 0
		goalDonk=0;
		dificulty=1;
		goalUni=0;
		unicornList= []
		animalsInStage=[]
		donkeyList = []
		objectsInGame = []
		
		sceneGroup.alpha = 0
		game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
		inputsEnabled = false

		loadSounds()
		
		for(var placeHorses=0; placeHorses<maxNumber; placeHorses++){
			
			if(placeHorses<5){
				positionY[placeHorses]=game.world.centerY-70;
			}else if(placeHorses<10){
				positionY[placeHorses]=game.world.centerY-140;
			}else if(placeHorses<15){
				positionY[placeHorses]=game.world.centerY;
			}else if(placeHorses<20){
				positionY[placeHorses]=game.world.centerY+70;
			}
		}
		
		positionX[0]=game.world.centerX;
		positionX[1]=game.world.centerX-80;
		positionX[2]=game.world.centerX+80;
		positionX[3]=game.world.centerX-180;
		positionX[4]=game.world.centerX+180;
		positionX[5]=game.world.centerX;
		positionX[6]=game.world.centerX-80;
		positionX[7]=game.world.centerX+80;
		positionX[8]=game.world.centerX-180;
		positionX[9]=game.world.centerX+180;
		positionX[10]=game.world.centerX;
		positionX[11]=game.world.centerX-90;
		positionX[12]=game.world.centerX+90;
		positionX[13]=game.world.centerX-180;
		positionX[14]=game.world.centerX+180;
		positionX[15]=game.world.centerX;
		positionX[16]=game.world.centerX-80;
		positionX[17]=game.world.centerX+80;
		positionX[18]=game.world.centerX-180;
		positionX[19]=game.world.centerX+180;
		positionX[20]=game.world.centerX;
		
		
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
		timeValue-=timeValue * 0.10

	}

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.uni','xpcoins')
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
		
		var startX = - 90
		var startY = -190

		for (var uniIndex = 0; uniIndex < MAX_UNICORNS; uniIndex++){
			var xIndex = ((uniIndex + 1) % 5) - 1
			var yIndex = Math.ceil((uniIndex + 1) / 5) - 1
			var x = startX + 90 * xIndex
			var y = startY + 90 * yIndex

			var unicorn = createSpine("unicorn","normal")
			unicorn.originalX = x
			unicorn.originalY = y
			pullGroup.add(unicorn)
			unicornList.push(unicorn)
			unicorn.tag = "unicorn"
		}

		for (var donkeyIndex = 0; donkeyIndex < MAX_DONKEYS; donkeyIndex++){
			var donkey = createSpine("donkey", "normal")
			pullGroup.add(donkey)
			donkeyList.push(donkey)
		}

	}

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);

		particle.makeParticles('atlas.uni',key);
		particle.minParticleSpeed.setTo(-200, -50);
		particle.maxParticleSpeed.setTo(200, -100);
		particle.minParticleScale = 0.5;
		particle.maxParticleScale = 0.8;
		particle.gravity = 150;
		particle.angularDrag = 30;

		return particle

	}

	function stopGame(win){

		sound.play("alarmBell")
		gameActive = false	
		uniSong.stop()
		if(clock.tween)
			clock.tween.stop()

		var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Sinusoidal.In, true, 3000)
		tweenScene.onComplete.add(function(){

			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number, gameIndex)

			//amazing.saveScore(pointsBar.number)
			sceneloader.show("result")
			sound.play("gameLose")
		})
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
		var sum=0;
		goalUni=game.rnd.integerInRange(1,dificulty);
		sum=dificulty-goalUni;
		if(pointsBar.number>=5){
			goalDonk=game.rnd.integerInRange(0,sum);
		}
		uniText.text=goalUni.toString();
		donkText.text=goalDonk.toString();
		if(!tutorial){
			animationText=game.add.tween(uniText.scale).to({x:1.2,y:1.2},400,Phaser.Easing.Linear.Out,true).yoyo(true);
			uniText.tint=0xffffff
			animationText2=game.add.tween(donkText.scale).to({x:1.2,y:1.2},400,Phaser.Easing.Linear.Out,true).yoyo(true);
			donkText.tint=0xffffff
		}
		game.time.events.add(800, function () {
			
			if(dificulty>3  && dificulty<=10){
				startTimer()
				dragableUnicorn.inputEnabled=true;
				dragableUnicorn.input.enableDrag(true);
				dragableDonkey.inputEnabled=true;
				dragableDonkey.input.enableDrag(true);
				dragableUnicorn.input.draggable=true;
				dragableDonkey.input.draggable=true;
				buttonImg.inputEnabled=true;
				donkContainer.tint=0xffffff
				dragableDonkey.tint=0xffffff	
			}else if(dificulty>10){ 
				thirdDificulty()
			}else{
				dragableUnicorn.inputEnabled=true;
				dragableUnicorn.input.enableDrag(true);
				dragableDonkey.inputEnabled=true;
				dragableDonkey.input.enableDrag(true);
				dragableUnicorn.input.draggable=true;
				dragableDonkey.input.draggable=true;
				if(!tutorial){
					buttonImg.inputEnabled=true;
					donkContainer.tint=0xffffff
					dragableDonkey.tint=0xffffff
				}else if(tutorial){
					dragableDonkey.input.draggable=false;
					hand.alpha=1;
					containers.add(hand)
					hand.x=dragableUnicorn.x+100;
					hand.y=dragableUnicorn.y+100;
					handAnimation=game.add.tween(hand).to({x:rectTrigger.x+200,y:rectTrigger.y-100},2000,Phaser.Easing.Linear.In,true).loop(true);
					
					var donkey=createSpine("donkey","normal")
					var tutoFirst=animalsInStage.push(donkey);
					tutoFirst=tutoFirst-1;
					console.log(animalsInStage[tutoFirst])
					animalsInStage[tutoFirst].tag="donkey";
					animalsInStage[tutoFirst].scale.setTo(0.7,0.7);
					this.rect = new Phaser.Graphics(game);
					this.rect.beginFill('#000000', 0);
					this.rect.drawRect(0, 0, 90, 90);
					this.rect.endFill();
					nubesAparecer[tutoFirst]=game.add.sprite(positionX[tutoFirst],positionY[tutoFirst],"atlas.uni","cloud_donk");
					nubesAparecer[tutoFirst].scale.setTo(0,0);
					nubesAparecer[tutoFirst].anchor.setTo(0.5,0.8);
					game.add.tween(nubesAparecer[tutoFirst].scale).to({x: 1,y:1}, 10, Phaser.Easing.Cubic.InOut, true)
					game.add.tween(nubesAparecer[tutoFirst]).to({alpha:0}, 600, Phaser.Easing.Cubic.InOut, true).onComplete.add(function(){
						nubesAparecer[tutoFirst].destroy();
					});
					animalsInStage[tutoFirst].x=positionX[tutoFirst];
					animalsInStage[tutoFirst].y=positionY[tutoFirst];
					animalsInStage[tutoFirst].container= this.game.add.image(animalsInStage[tutoFirst].x-50, animalsInStage[tutoFirst].y-100);
					animalsInStage[tutoFirst].container.addChild(this.rect);
					animalsInStage[tutoFirst].container.index=tutoFirst;
					dreamGroup.add(animalsInStage[tutoFirst]);
				}
				uniText.tint=0xffffff
				donkText.tint=0xffffff
			}
		})
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

		var heartImg = group.create(0,0,'atlas.uni','life_box')

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

	function startTimer() {
		var delay = 500
		// clock.bar.scale.x = clock.bar.origScale
		if (clock.tween)
			clock.tween.stop()

		clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeValue * quantNumber * 1000,Phaser.Easing.linear,true )
		clock.tween.onComplete.add(function(){
			timer=true;
			dragging=false;
			dragableUnicorn.x=uniContainer.x+10;
			dragableUnicorn.y=uniContainer.y;
			dragableDonkey.x=donkContainer.x+25;
			dragableDonkey.y=donkContainer.y;
			checkGoal()
		})
	}
	
	function showDream() {
		sound.play("swipe")
		var showDream = game.add.tween(dreamGroup).to({y: -2},1200,Phaser.Easing.Exponential.Out,true)
		game.add.tween(nubesTop).to({alpha:1}, 800, Phaser.Easing.Linear.In, true,1200)
		game.add.tween(counterTable).to({alpha:1}, 800, Phaser.Easing.Linear.In, true,1200)
		game.add.tween(uniIco).to({alpha:1}, 800, Phaser.Easing.Linear.In, true,1200)
		game.add.tween(donkIco).to({alpha:1}, 800, Phaser.Easing.Linear.In, true,1200)
		game.add.tween(donkText).to({alpha:1}, 800, Phaser.Easing.Linear.In, true,1200)
		game.add.tween(uniText).to({alpha:1}, 800, Phaser.Easing.Linear.In, true,1200)
		showDream.onComplete.add(function () {
			dreamGroup.add(bed)
			dreamGroup.add(buro)
			dreamGroup.add(clockCounter)
			dreamGroup.add(buttonImg)
			dreamGroup.add(theffanie)
			
			sound.play("brightTransition")
			game.add.tween(dreamGroup.bright).to({alpha: 1},1000,Phaser.Easing.Cubic.Out,true).yoyo(true)
			var bgAppear = game.add.tween(dreamGroup.bg).to({alpha:1}, 1000, Phaser.Easing.Cubic.In, true)
			bgAppear.onComplete.add(startRound)
		})
	}

	function onClickPlay(rect) {
	
		tutoGroup.y = -game.world.height
		gameActive = true
		showDream()

	}

	function createTutorial(){

		tutoGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
		sceneGroup.add(tutoGroup)
		tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
		
	}


	function createClock(){

		clock = game.add.group()
		clock.x = game.world.centerX
		clock.y = 80
		clock.alpha=0;
		sceneGroup.add(clock)

		var clockImage = clock.create(0,0,'atlas.uni','clock')
		clockImage.anchor.setTo(0.5,0.5)

		var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.uni','bar')
		clockBar.anchor.setTo(0,0.5)
		clockBar.width = clockImage.width*0.76
		clockBar.height = 22
		clockBar.origScale = clockBar.scale.x

		clock.bar = clockBar;

	}

	function createSpine(skeleton, skin, idleAnimation, x, y) {
		idleAnimation = idleAnimation || "idle"
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
	
	function addCounter(obj, number) {
		sound.play("pop")

		var numberText = clockCounter.numberText
		if(clockCounter.scaleNumber){
			clockCounter.scaleNumber.stop()
			numberText.scale.x = 1, numberText.scale.y = 1
		}
		if(clockCounter.scaleObj){
			clockCounter.scaleObj.stop()
			obj.scale.x = 1, obj.scale.y = 1
		}

		var scaleObj = game.add.tween(obj.scale).to({x:1.2, y:1.2}, 300, Phaser.Easing.Cubic.Out, true).yoyo(true)
		clockCounter.scaleObj = scaleObj

		var scaleNumber = game.add.tween(numberText.scale).to({x:1.2, y:1.2}, 300, Phaser.Easing.Cubic.Out, true).yoyo(true)
		clockCounter.scaleNumber = scaleNumber

		if(clockCounter.number + number > 20)
			clockCounter.number = 0
		else if(clockCounter.number + number < 0)
			clockCounter.number = 20
		else
			clockCounter.number += number

		clockCounter.numberText.text = clockCounter.number
	}
	
	function moveSpine(spine, toX, toY, delay, easing) {
		var moveTween = game.add.tween(spine).to({x:toX, y:toY}, 3000, easing, true, delay)
		moveTween.onStart.add(function () {
			sound.play("horse_gallop")
			spine.setAnimation(["jump"])
		})
		moveTween.onComplete.add(function () {
			spine.setAnimation(["idle"])
		})
		moveTween.onUpdateCallback(function () {
			gameGroup.sort('y', Phaser.Group.SORT_ASCENDING)
		})
	}
	
	function rightReaction() {
		Coin(clockCounter,pointsBar,100);
		if(dificulty<total)dificulty++;
		if(dificulty>3){
			clock.alpha=1
		}
		tutorial=false;
	}
	
	function wrongReaction() {
		theffanie.setAnimation(["wake_up", "wake_upstill"])
		sceneGroup.wrongParticle.x = clockCounter.centerX
		sceneGroup.wrongParticle.y = clockCounter.centerY
		sceneGroup.wrongParticle.start(true, 1000, null, 5)
        
		for(var objIndex = 0; objIndex < objectsInGame.length; objIndex++){
			var spine = objectsInGame[objIndex]
			spine.setAnimation(["lose"])
		}
        if(lives===0){
			buttonImg.alpha=0;
		var shockEffect = game.add.tween(clockCounter).to({x: clockCounter.x + 20}, 200, null, true)
		shockEffect.onComplete.add(function () {
			game.add.tween(clockCounter).to({x: clockCounter.x - 20}, 200, null, true).yoyo(true).loop(true)
		})

		game.add.tween(gameGroup).to({alpha: 0},300,Phaser.Easing.Cubic.Out,true, 600)
		game.add.tween(dreamGroup.bright).to({alpha: 1},300,Phaser.Easing.Cubic.Out,true, 600).yoyo(true)
		var bgDissapear = game.add.tween(dreamGroup).to({alpha:0}, 600, Phaser.Easing.Cubic.In, true, 600)
		bgDissapear.onComplete.add(function () {
			var showDream = game.add.tween(dreamGroup).to({y: game.world.height},800,Phaser.Easing.Cubic.In,true, 400)
			showDream.onStart.add(function () {
				sound.play("swipe")
			})
		})
        }
	}
	
	function checkGoal(){
		var countUni=0;
		var countDonk=0;
		animalsCreated=0;
		var exitSpeed=3000;
		if(clock.tween){
			clock.tween.stop();
			game.add.tween(clock.bar.scale).to({x:clock.bar.origScale},800,Phaser.Easing.linear,true)
		}
		buttonImg.inputEnabled=false;
		dragableUnicorn.input.draggable=false;
		dragableDonkey.input.draggable=false;
		if(tutorial)hand.alpha=0;
		for(var checkGoals=0; checkGoals<animalsInStage.length; checkGoals++){
			
			if(animalsInStage[checkGoals]!=null){
				animalsInStage[checkGoals].container.destroy();
				if(animalsInStage[checkGoals].tag=="uni"){
					countUni++;
				}else if(animalsInStage[checkGoals].tag=="donkey"){
					countDonk++;		
				}
			}
		}
		
		if(goalUni==countUni && goalDonk==countDonk && !timer){
			rightReaction();
		}else if(!gameStoped){
			missPoint();
			if(lives>0){
				theffanie.setAnimation(["nightmare"])
				game.time.events.add(700, function () {
					theffanie.setAnimation(["idle"])
				})
			}
			timer=false;
			sceneGroup.wrongParticle.x = clockCounter.centerX
			sceneGroup.wrongParticle.y = clockCounter.centerY
			sceneGroup.wrongParticle.start(true, 1000, null, 5)
			if(lives===0){
				gameStoped=true;
				wrongReaction();
				sceneGroup.add(bed)
				sceneGroup.add(buro)
				sceneGroup.add(clockCounter)
				sceneGroup.add(buttonImg)
				sceneGroup.add(theffanie)
			}
		}
		if(goalDonk==countDonk){
			donkText.tint=0x00ff00;
		}else{
			donkText.tint=0xff0000;
		}
		if(goalUni==countUni){
			uniText.tint=0x00ff00;
		}else{
			uniText.tint=0xff0000;
		}
		animationText=game.add.tween(uniText.scale).to({x:1.2,y:1.2},1000,Phaser.Easing.Linear.Out,true).yoyo(true);
		animationText2=game.add.tween(donkText.scale).to({x:1.2,y:1.2},1000,Phaser.Easing.Linear.Out,true).yoyo(true);
		
		game.time.events.add(500, function () {
		for(var moveAnimals=0; moveAnimals<animalsInStage.length; moveAnimals++){
				if(animalsInStage[moveAnimals]){
					if(lives>0){
						sound.play("horse_gallop")
						animalsInStage[moveAnimals].setAnimation(["jump"]);
						game.add.tween(animalsInStage[moveAnimals]).to({x: game.world.width+animalsInStage[moveAnimals].x}, exitSpeed, Phaser.Easing.linear, true)
					}else{
						animalsInStage[moveAnimals].setAnimation(["lose"]);
					}
				}
			}
		})
			game.add.tween(brightRect).to({alpha:1},exitSpeed-1000,Phaser.Easing.linear,true).yoyo(true);
		
			game.time.events.add(exitSpeed+200,function(){
				for(var destroyAnimals=0; destroyAnimals<animalsInStage.length; destroyAnimals++){
					if(animalsInStage[destroyAnimals]!=null){
						animalsInStage[destroyAnimals].destroy();
						animalsInStage[destroyAnimals]=null;
					}
				}
				animalsInStage.splice(0);
				startRound();
				
			})
		
	}
	function thirdDificulty(){
		
		var manyAnimals=game.rnd.integerInRange(0,total);
		var animal=game.rnd.integerInRange(0,1);
		animalsCreated=0;
		for(var fill=0; fill<manyAnimals; fill++){
			
			animal=game.rnd.integerInRange(0,1);
			if(animal==0){
				var unicorn=createSpine("unicorn","normal")
				animalsInStage.push(unicorn);
				animalsInStage[fill].tag="uni";
			}else if(animal==1){
				var donkey=createSpine("donkey","normal")
				animalsInStage.push(donkey);
				animalsInStage[fill].tag="donkey";
			}
			animalsInStage[fill].scale.setTo(0.7,0.7);
			this.rect = new Phaser.Graphics(game);
			this.rect.beginFill('#000000', 0);
			this.rect.drawRect(0, 0, 90, 90);
			this.rect.endFill();
			animalsInStage[fill].x=-200;
			animalsInStage[fill].y=positionY[fill];
			
			animalsInStage[fill].container= this.game.add.image(animalsInStage[fill].x-50, animalsInStage[fill].y-100);
			animalsInStage[fill].container.addChild(this.rect);
			animalsInStage[fill].container.index=fill;
			animalsInStage[fill].container.inputEnabled=true;
			animalsInStage[fill].container.events.onInputDown.add(discardAnimal,this);
			animalsInStage[fill].setAnimation(["jump"]);
			
			sound.play("horse_gallop")
			game.add.tween(animalsInStage[fill]).to({x:positionX[fill],y:positionY[fill]}, 1500, Phaser.Easing.Cubic.InOut, true)
			game.add.tween(animalsInStage[fill].container).to({x:positionX[fill]-50,y:positionY[fill]-100}, 1500, Phaser.Easing.Cubic.InOut, true)
			
			
			dreamGroup.add(animalsInStage[fill]);
			dreamGroup.add(animalsInStage[fill].container);
		}
		game.time.events.add(1550, function () {
			buttonImg.inputEnabled=true;
			for(var idle=0; idle<animalsInStage.length; idle++){
				animalsInStage[idle].setAnimation(["idle"]);
			}
			dragableUnicorn.inputEnabled=true;
			dragableUnicorn.input.enableDrag(true);
			dragableDonkey.inputEnabled=true;
			dragableDonkey.input.enableDrag(true);
			dragableUnicorn.input.draggable=true;
			dragableDonkey.input.draggable=true;
			buttonImg.inputEnabled=true;
			donkContainer.tint=0xffffff
			dragableDonkey.tint=0xffffff
			startTimer()
		})
	}
	
	function createUniUI() {
		
		dreamGroup = game.add.group()
		dreamGroup.y = game.world.height
		sceneGroup.add(dreamGroup)

		background = game.add.tileSprite(0,0,game.world.width, 626, "fondo")
		background.x = game.world.centerX
		background.anchor.setTo(0.5, 0)
		dreamGroup.add(background)
		background.alpha = 0
		dreamGroup.bg = background

		brightRect = game.add.graphics()
		brightRect.beginFill(0xffffff)
		brightRect.drawRect(0,0,game.world.width *2, game.world.height *2)
		brightRect.endFill()
		brightRect.alpha = 0
		dreamGroup.add(brightRect)
		dreamGroup.bright = brightRect

		gameGroup = game.add.group()
		gameGroup.x = game.world.centerX
		gameGroup.y = game.world.centerY
		dreamGroup.add(gameGroup)

		var nubes = game.add.tileSprite(0,0,game.world.width, 444, "atlas.uni", "nubes")
		nubes.x = game.world.centerX
		nubes.y = game.world.height + 20
		nubes.tilePosition.y -= 2
		nubes.anchor.setTo(0.5, 1)
		dreamGroup.add(nubes)
		game.add.tween(nubes.scale).to({x:1.02, y:0.97}, 800, Phaser.Easing.Sinusoidal.Out, true).yoyo(true).loop(true)
		
		nubesTop = game.add.tileSprite(0,0,game.world.width, 215, "atlas.uni", "nubes_top")
		nubesTop.x = game.world.centerX
		nubesTop.y = 190
		nubesTop.tilePosition.y -= 2
		nubesTop.alpha=0;
		nubesTop.anchor.setTo(0.5, 1)
		dreamGroup.add(nubesTop)
		game.add.tween(nubesTop.scale).to({x:1.02, y:0.97}, 800, Phaser.Easing.Sinusoidal.Out, true).yoyo(true).loop(true)
		
		counterTable=game.add.sprite(nubesTop.x-130,nubesTop.y-50,"atlas.uni","checkScores");
		counterTable.alpha=0;
		dreamGroup.add(counterTable);
		
	 	rectTrigger= game.add.graphics()
		rectTrigger.beginFill(0x000000,0)
		rectTrigger.drawRect(0,nubesTop.height-100,game.world.width *2, 400)
		rectTrigger.endFill()
		rectTrigger.alpha = 1
		dreamGroup.add(rectTrigger)
		dreamGroup.bright = rectTrigger
		
		
		
		var fontStyle = {font: "68px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
		var fontStyle2 = {font: "100px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		
		
		uniIco=game.add.sprite(nubesTop.x-130,nubesTop.y-50,"atlas.uni","uniIco");
		donkIco=game.add.sprite(nubesTop.x+10,nubesTop.y-50,"atlas.uni","donkIco");
		dreamGroup.add(uniIco)
		dreamGroup.add(donkIco)
		uniIco.alpha=0;
		donkIco.alpha=0;
		
		uniText = new Phaser.Text(game, 0, 10, "0", fontStyle2)
		uniText.anchor.setTo(0.5, 0.5)
		uniText.alpha = 0
		uniText.scale.setTo(0.4, 0.4)
		uniText.x=uniIco.x+77;
		uniText.y=uniIco.y+37;
		
		donkText = new Phaser.Text(game, 0, 10, "0", fontStyle2)
		donkText.anchor.setTo(0.5, 0.5)
		donkText.alpha = 0
		donkText.scale.setTo(0.4, 0.4)
		donkText.x=donkIco.x+77;
		donkText.y=donkIco.y+37;
		
		dreamGroup.add(uniText)
		dreamGroup.add(donkText)
		
		buro = sceneGroup.create(0,0,"atlas.uni", "buro")
		buro.x = game.world.centerX + 170
		buro.y = game.world.height
		buro.anchor.setTo(0.5, 1)

		bed=game.add.sprite(game.world.width * 0.5 - 400,game.world.height - 275,"atlas.uni","bed");
		sceneGroup.add(bed);
		
		
		
		theffanie = createSpine("theffanie","normal")
		theffanie.x = game.world.width * 0.5 - 270
		theffanie.y = game.world.height - 80
		sceneGroup.add(theffanie)

		clockCounter = game.add.group()
		clockCounter.x = buro.x
		clockCounter.y = game.world.height - 250
		sceneGroup.add(clockCounter)
		
		containers = game.add.group()
		containers.x = theffanie.x+100
		containers.y = theffanie.y-300
		sceneGroup.add(containers)
		
		

		clockImg = clockCounter.create(0,0,"atlas.uni","clockImg")
		clockImg.anchor.setTo(0.5, 0.5)
		game.add.tween(clockImg.scale).to({x:1.05, y:0.95}, 300, Phaser.Easing.Sinusoidal.Out, true).yoyo(true).loop(true)
		
		manecillas = clockCounter.create(0,0,"atlas.uni","manecillas")
		manecillas.anchor.setTo(0.5, 0.5)
		
		game.add.tween(manecillas.scale).to({x:1.05, y:0.95}, 300, Phaser.Easing.Sinusoidal.Out, true).yoyo(true).loop(true)
		
		var numberText = new Phaser.Text(game, 0, 10, "0", fontStyle)
		numberText.anchor.setTo(0.5, 0.5)
		clockCounter.add(numberText)
		numberText.alpha = 0
		numberText.scale.setTo(0.4, 0.4)
		clockCounter.numberText = numberText
		clockCounter.number = 0
		clockCounter.alpha=1;
//		var button = game.add.group()
//		button.x = clockCounter.x
//		button.y = clockCounter.y+5
//		sceneGroup.add(button)

		buttonImg = clockCounter.create(0,0,"atlas.uni", "rdyButton")
		buttonImg.inputEnabled=false;
		buttonImg.events.onInputDown.add(checkGoal)
		buttonImg.anchor.setTo(0.5, 0.5)
		buttonImg.alpha = 1	
		buttonImg.scale.setTo(0.4, 0.4)
		clockCounter.add(buttonImg)
		buttonImg.x = clockCounter.x
		buttonImg.y = clockCounter.y+5
		clockCounter.bringToTop(buttonImg)
		
		
		game.add.tween(buttonImg.scale).to({x:0.45, y:0.35}, 300, Phaser.Easing.Sinusoidal.Out, true).yoyo(true).loop(true)

		var fontStyle2 = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		
		dreamGroup.add(containers)
		
		uniContainer=game.add.sprite(0,-20,"atlas.uni","buttonUni");
		dragableUnicorn=game.add.sprite(uniContainer.x+10,uniContainer.y,"atlas.uni","buttonImgU");
		dragableUnicorn.tag="uni";
		
		
		dragableUnicorn.events.onDragStart.add(onDragStart, this);
		dragableUnicorn.events.onDragStop.add(onDragStop, this);
		
		donkContainer=game.add.sprite(150,-20,"atlas.uni","buttonDonk");
		dragableDonkey=game.add.sprite(donkContainer.x+25,donkContainer.y,"atlas.uni","buttonImgD");
		dragableDonkey.tag="donk";
		donkContainer.tint=0x555555
		dragableDonkey.tint=0x555555	
		

		dragableDonkey.events.onDragStart.add(onDragStart, this);
		dragableDonkey.events.onDragStop.add(onDragStop, this);
		
		containers.add(donkContainer);
		containers.add(uniContainer);
		containers.add(dragableUnicorn);
		containers.add(dragableDonkey);
		var correctParticle = createPart("star")
		sceneGroup.correctParticle = correctParticle

		var wrongParticle = createPart("smoke")
		sceneGroup.wrongParticle = wrongParticle
		
		hand=game.add.sprite(0,0, "hand")
        hand.anchor.setTo(0.5,0.5);
        hand.scale.setTo(0.6,0.6);
        hand.animations.add('hand');
        hand.animations.play('hand', 5, false);
        hand.alpha=0;
		hand.x=clockCounter.x;
		hand.y=clockCounter.y-70;
		
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
	
	
	function onDragStart(obj, pointer) {
		if(!dragging){
			dragging=true
			sound.play("drag")
			if(obj.tag=="uni"){
				containers.bringToTop(dragableUnicorn);
			}else{
				containers.bringToTop(dragableDonkey);
			}
			//inputsEnabled=false;
			var option = obj.parent
			option.inBottom = false
			option.deltaX = pointer.x - obj.world.x
			option.deltaY = pointer.y - obj.world.y - obj.originalY

			option.startX = (obj.world.x - gameGroup.x)
			option.startY = (obj.world.y - gameGroup.y - obj.originalY)

			dreamGroup.bringToTop(option)
		}
	}
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );
	}

	function onDragStop(obj,pointer){
		dragging=false
		if(checkOverlap(obj,rectTrigger)){
			isColliding=true;
		}
		
		if(isColliding){
			createAnimal(obj,pointer);
			isColliding=false;
		}
		if(obj.tag=="uni"){
			obj.x=uniContainer.x+10;
			obj.y=uniContainer.y;
		}
		if(obj.tag=="donk"){
			obj.x=donkContainer.x+25;
			obj.y=donkContainer.y;
		}
	}
	
	function discardAnimal(obj){
		animalsInStage[obj.index].destroy();
		animalsInStage[obj.index]=null
		obj.destroy();
		animalsCreated--;
		sound.play("discard")
		buttonImg.inputEnabled=false;
		game.time.events.add(600, function () {
			buttonImg.inputEnabled=true;
		})
		if(tutorial){
			sceneGroup.add(hand)
			animationText.stop()
			uniText.scale.setTo(0.4,0.4);
			uniText.tint=0xffffff
			hand.x=clockCounter.x+40;
			hand.y=clockCounter.y+20;
		}else if(animalsInStage.length!=goalUni && tutorial){
			buttonImg.inputEnabled=false;
		}
	}
	
	function createAnimal(obj,pointer){
		var index=null;
		
		if(animalsCreated<maxNumber){
			sound.play("place")
			if(obj.tag=="uni"){
				for(var check=0; check<=animalsInStage.length; check++){
					if(animalsInStage[check]==null && index==null){
						animalsInStage[check]=createSpine("unicorn","normal")
						animalsInStage[check].scale.setTo(0.7,0.7);
						animalsInStage[check].tag="uni";
						index=check;
						if(check<9 && check>4){
							game.world.sendToBack(animalsInStage[check]);
						}else{
							game.world.bringToTop(animalsInStage[check]);
						}
					}
				}
				
				nubesAparecer[index]=game.add.sprite(positionX[index],positionY[index],"atlas.uni","cloud_small");
			}else if(obj.tag=="donk"){
				for(var check=0; check<=animalsInStage.length; check++){
					if(animalsInStage[check]==null && index==null){
						animalsInStage[check]=createSpine("donkey","normal")
						animalsInStage[check].tag="donkey";
						animalsInStage[check].scale.setTo(0.7,0.7);
						index=check;
					}
				}
				nubesAparecer[index]=game.add.sprite(positionX[index],positionY[index],"atlas.uni","cloud_donk");
			}
			animalsCreated++;
			nubesAparecer[index].scale.setTo(0,0);
			nubesAparecer[index].anchor.setTo(0.5,0.8);
			game.add.tween(nubesAparecer[index].scale).to({x: 1,y:1}, 10, Phaser.Easing.Cubic.InOut, true)
			game.add.tween(nubesAparecer[index]).to({alpha:0}, 600, Phaser.Easing.Cubic.InOut, true).onComplete.add(function(){
				nubesAparecer[index].destroy();
			});
			if(animalsInStage.length==goalUni && tutorial){
				buttonImg.inputEnabled=true;
			}
			else if(animalsInStage.length!=goalUni && tutorial)
			{
				buttonImg.inputEnabled=false;
			}
			if(animalsInStage.length>goalUni && tutorial){
				handAnimation.stop();
				dreamGroup.add(hand)
				dragableUnicorn.input.draggable=false;
				animationText=game.add.tween(uniText.scale).to({x:1.2,y:1.2},1000,Phaser.Easing.Linear.Out,true).yoyo(true).loop(true);
				uniText.tint=0xff5500
				game.time.events.add(1000, function () {
					animalsInStage[0].container.inputEnabled=true;
					animalsInStage[0].container.events.onInputDown.add(discardAnimal,this);
					hand.animations.play('hand', 5, true);
					hand.x=animalsInStage[0].x+20;
					hand.y=animalsInStage[0].y+20;
				})
			}
			animalsInStage[index].x=positionX[index];
			animalsInStage[index].y=positionY[index];
			animalsInStage[index].container= this.game.add.image(animalsInStage[index].x-50, animalsInStage[index].y-100);
			this.rect = new Phaser.Graphics(game);
			this.rect.beginFill('#000000', 0);
			this.rect.drawRect(0, 0, 90, 90);
			this.rect.endFill();
			animalsInStage[index].container.addChild(this.rect);
			animalsInStage[index].container.index=index;
			if(!tutorial){
				animalsInStage[index].container.inputEnabled=true;
				animalsInStage[index].container.events.onInputDown.add(discardAnimal,this);
			}
			dreamGroup.add(animalsInStage[index]);
			dreamGroup.add(nubesAparecer[index]);
		}
	}
	
	

	
	
	function createBackground() {
		var background = game.add.tileSprite(0,0,game.world.width, game.world.height, "atlas.uni", "room")
		sceneGroup.add(background)

		var window = sceneGroup.create(0,0, "atlas.uni", "window")
		window.x = game.world.centerX + 80, window.y = game.world.centerY + 80
		window.anchor.setTo(0.5, 0.5)
		
		//Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin");
        coins.anchor.setTo(0.5);
        coins.scale.setTo(0.5);
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0;
	}

	return {
		assets: assets,
		name: "uni",
		preload:preload,
		create: function(event){

			sceneGroup = game.add.group(); 
			
			//yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
			
			document.addEventListener("contextmenu", function(e){
               e.preventDefault();
			}, false);
			
			createBackground()
			createUniUI()

			uniSong = game.add.audio('uniSong')
			game.sound.setDecodedCallback(uniSong, function(){
				uniSong.loopFull(0.6)
			}, this);

			game.onPause.add(function(){
				game.sound.mute = true
			} , this);

			game.onResume.add(function(){
				game.sound.mute = false
			}, this);
			game.stage.disableVisibilityChange = false;
			initialize()

			// createHearts()
			createPointsBar()
            createHearts()
			createGameObjects()
			createClock()
			createTutorial()

			buttons.getButton(uniSong,sceneGroup)
		}
	}
}()