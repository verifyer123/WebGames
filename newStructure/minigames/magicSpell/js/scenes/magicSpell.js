
var soundsPath = "../../shared/minigames/sounds/"
var particlesPath="../../shared/minigames/images/particles/battle/"
var tutorialPath = "../../shared/minigames/"
var magicSpell = function(){

	var localizationData = {
		"EN":{
			"howTo":"How to Play?",
			"moves":"Moves left",
			"stop":"Stop!",
			"word0":"VERANO",
			"word1":"INVIERNO",
			"word2":"PRIMAVERA",
			"word3":"OTOÑO"
		},

		"ES":{
			"moves":"Movimientos extra",
			"howTo":"¿Cómo jugar?",
			"stop":"¡Detener!",
			"word0":"SUMMER",
			"word1":"WINTER",
			"word2":"SPRING",
			"word3":"FALL"
		}
	}


	assets = {
		atlases: [
			{   
				name: "atlas.magic",
				json: "images/magic/atlas.json",
				image: "images/magic/atlas.png",
			},
			{   
				name: "atlas.time",
				json: "images/magic/timeAtlas.json",
				image: "images/magic/timeAtlas.png",
			},
			{   
				name: "atlas.tutorial",
				json: tutorialPath+"images/tutorial/tutorial_atlas.json",
				image: tutorialPath+"images/tutorial/tutorial_atlas.png"
			}
		],
		images: [

			{
				name:'tutorial_image',
				file:"images/magic/tutorial_image_%input.png"
			},
			{
				name:'summer',
				file:"images/magic/summer.png"
			},
			{
				name:'spring',
				file:"images/magic/spring.png"
			},
			{
				name:'fall',
				file:"images/magic/fall.png"
			},
			{
				name:'winter',
				file:"images/magic/winter.png"
			},
			{
				name:'rocks',
				file:"images/magic/smallRock.png"
			},

		],
		spines: [
			{
				name:"dinamita",
				file:"images/Spine/Dinamita/Dinamita.json"
			},
			{
				name:"skelleton",
				file:"images/Spine/Spelletor/Spelletor.json"
			},
		],
		spritesheets: [
			{
				name:"coin",
				file:"images/Spine/coin/coin.png",
				width:122,
				height:123,
				frames:12
			},
			{
				name:"hand",
				file:"images/Spine/hand/hand.png",
				width:115,
				height:111,
				frames:23
			},
		],
		sounds: [
			{	name: "magic",
			 file: soundsPath + "magic.mp3"},
			{	name: "cut",
			 file: soundsPath + "cut.mp3"},
			{	name: "wrong",
			 file: soundsPath + "wrong.mp3"},
			{	name: "explosion",
			 file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
			 file: soundsPath + "pop.mp3"},
			{	name: "shoot",
			 file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
			 file: soundsPath + "gameLose.mp3"},
			{	name: "ship",
			 file: soundsPath + "robotBeep.mp3"},
			{   name:"acornSong",
			 file: soundsPath + 'songs/childrenbit.mp3'}

		],
		jsons: [
			{
				name: 'pickedEnergy', 
				file:  particlesPath + 'pickedEnergy/specialBar1.json'
			}
		],
	}


	var lives = null
	var sceneGroup = null
	var background
	var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
	var gameIndex = 1
	var summerGroup, springGroup, fallGroup, winterGroup;
	var tutoGroup
	var indexGame
	var overlayGroup
	var magicSong
	var tutorial
	var words=[];
	var runes=[];
	var slots=[];
	var positionX=[];
	var positionY=[];
	var dinamita, skelleton;
	var TOTAL_WORDS=3;
	var limitCharacterPerWord;
	var enemys=[];
	var runeIndex
	var backgroundGroup=null
	
	var boardSlots, boardRunes
	var tweenTiempo
	var clock, timeBar
	var emitter

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		game.stage.backgroundColor = "#000000"
		lives = 3
		tutorial=true;
		emitter=""
		runeIndex=0;
		limitCharacterPerWord=4
		loadSounds()
		for(var insertWords=0; insertWords<=TOTAL_WORDS; insertWords++){
			words[insertWords]=localization.getString(localizationData,"word"+insertWords);
			console.log(words[insertWords])
		}
	}
	
	function onClickPlay(rect) {
		tutoGroup.y = -game.world.height
	}

	function createTutorial(){
		tutoGroup = game.add.group()
		sceneGroup.add(tutoGroup)
		tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
	}
	
	function createSlots(word){
		var countSpaces=word.length*1;
		var pivotX=boardSlots.x-countSpaces-boardSlots.width/3;
		for (var slotsInGame=0; slotsInGame<word.length; slotsInGame++){
			game["slot"+slotsInGame]=game.add.sprite(pivotX,boardSlots.y-10,"atlas.magic","slot");
			game["slot"+slotsInGame].anchor.setTo(0.5,0.5);
			game["slot"+slotsInGame].value=word[slotsInGame];
			game["slot"+slotsInGame].isOccupied=false;
			sceneGroup.add(game["slot"+slotsInGame])
			pivotX+=50
		}
	}
	function createRunes(char){
		game["rune"+runeIndex]=game.add.sprite(positionX[runeIndex],positionY[runeIndex])
		runeIndex++;
	}
	function divideInCharacters(word){
		createSlots(word)
		for (var slice=0; slice<word.length; slice++){
			createRunes(word[slice])
		}
	}
	function attackYogotar(word){
		dinamita.setAnimationByName(0,"spell_"+word.toLowerCase(),false).onComplete=function(){
			skelleton.setAnimationByName(0,"lose",false).onComplete=function(){
				game.add.tween(skelleton).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
					skelleton.x=game.world.width+200;
				});
			};
		};
		Coin(skelleton,pointsBar,100);
		tutorial=false;
		reset(true);
	}
	function attackEnemy(word){
		dinamita.setAnimationByName(0,"spell_fail",false).onComplete=function(){
			skelleton.setAnimationByName(0,"attack",false).onComplete=function(){
				dinamita.setAnimationByName(0,"lose",false);
				if(lives>0){
					dinamita.setAnimationByName(0,"idle",false)
				}else{
					dinamita.setAnimationByName(0,"losestill",false)
				}
				skelleton.setAnimationByName(0,"idle",true)
				missPoint();
				reset(false)
			};
		}
	}
	function shuffleEnemy(word){
		skelleton.setSkinByName("normal"+game.rnd.integerInRange(1,4));
		skelleton.setAnimationByName(0,"idle",true)
		skelleton.alpha=1;
		game.add.tween(skelleton).to({x:game.world.centerX+300},1500,Phaser.Easing.Cubic.In,true).onComplete.add(function(){
			divideInCharacters(word)
		});
	}
	function evaluateWord(wordChoosed){
		var win=true;
		for (var checkCharacters=0; checkCharacters<wordChoosed.length; checkCharacters++){
			if(runes[checkCharacters].value!=slots[checkCharacters].value && runes[checkCharacters].isPlaced){
				win=false;
			}
		}
		if(win){
			attackYogotar(wordChoosed)
		}else{
			attackEnemy(wordChoosed)
		}
	}
	function checkOverlap(spriteA, spriteB) {
		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();
		return Phaser.Rectangle.intersects(boundsA , boundsB);
	}
	function stopDrag(rune,objOverlaping,word){
		var alreadyFinished=true;
		if(objOverlaping.tag=="slot" && !objOverlaping.isOccupied){
			var slotOverlaping=objOverlaping;
			if(tutorial && rune.value===slotOverlaping.value){
				rune.inputEnabled=false;
				rune.x=slotOverlaping.x;
				rune.y=slotOverlaping.y;
				slotOverlaping.isOccupied=true;
			}else if(!tutorial){
				rune.x=slotOverlaping.x;
				rune.y=slotOverlaping.y;
				slotOverlaping.isOccupied=true;
			}
		}else if(objOverlaping.tag=="board"){
			rune.x=positionX[rune.index];
			rune.y=positionY[rune.index];
		}
		for(var checkIfFinished=0; checkIfFinished<word.length; checkIfFinished++){
			if(!slots[checkIfFinished].isOccupied){
			   alreadyFinished=false;
			}
		}
		if(alreadyFinished)evaluateWord(word)
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
		addNumberPart(heartsGroup.text,'-1',true)
	}
	function changeEnviroment(randomNumber,word,lastGroup){
		var nextGroup;
		game.add.tween(lastGroup).to({alpha:0},1500,Phaser.Easing.Cubic.Out,true);
		switch (word){
			case "SUMMER" || "VERANO":
				nextGroup=summerGroup;
			break;
			case "SPRING" || "PRIMAVERA": 	
				nextGroup=springGroup;
			break;
			case "WINTER" || "INVIERNO":
				nextGroup=winterGroup;
			break;
			case "FALL" || "OTOÑO": 
				nextGroup=fallGroup;
			break;
		}
		game.add.tween(nextGroup).to({alpha:1},1500,Phaser.Easing.Cubic.In,true);
	}
	function managerWordEnemyEnviroment(isEnemyAlive){
		var randomNumber=game.rnd.integerInRange(0,TOTAL_WORDS);
		var word=words[randomNumber];
		if(!tutorial && lives>0){
			changeEnviroment(randomNumber, word);
			game.time.events.add(1000,function(){
				if(!isEnemyAlive)shuffleEnemy()
			});
		}else{
			tutorialLevel(word);
		}
	}
	function enteringToGame(word){
		
		game.add.tween(dinamita).to({x:game.world.centerX-200},1500,Phaser.Easing.Cubic.In,true).onComplete.add(function(){
			dinamita.setAnimationByName(0,"idle",true);
			shuffleEnemy(word)
		});
	}
	function tutorialLevel(word){
		if(word=="SUMMER" || word=="VERANO"){
			summerGroup.alpha=1;
		}
		if(word=="SPRING" || word=="PRIMAVERA"){
			springGroup.alpha=1;
		}
		if(word=="FALL" || word=="OTOÑO"){
			fallGroup.alpha=1;
		}
		if(word=="WINTER" || word=="INVIERNO"){
			winterGroup.alpha=1;
		}
		enteringToGame(word);
	}
	function createYogotarAndEnemy(){
		dinamita=game.add.spine(-200,game.world.centerY+100,"dinamita");
		dinamita.setSkinByName("normal");
		dinamita.setAnimationByName(0,"run",true);
		dinamita.scale.setTo(0.5,0.5)
		sceneGroup.add(dinamita);
		
		skelleton=game.add.spine(game.world.width+200,game.world.centerY,"skelleton");
		skelleton.setSkinByName("normal"+game.rnd.integerInRange(1,4));
		skelleton.setAnimationByName(0,"idle",true);
		sceneGroup.add(skelleton);
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
	}

	function changeImage(index,group){
		for (var i = 0;i< group.length; i ++){
			group.children[i].alpha = 0
			if( i == index){
				group.children[i].alpha = 1
			}
		}
	} 

	function addNumberPart(obj,number,isScore){

		var pointsText = lookParticle('text')
		if(pointsText){

			pointsText.x = obj.world.x
			pointsText.y = obj.world.y
			pointsText.anchor.setTo(0.5,0.5)
			pointsText.setText(number)
			pointsText.scale.setTo(1,1)

			var offsetY = -100

			pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

			deactivateParticle(pointsText,800)
			if(isScore){

				pointsText.scale.setTo(0.7,0.7)
				var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
				tweenScale.onComplete.add(function(){
					game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
				})

				offsetY = 100
			}

			game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
			game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
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

		addNumberPart(pointsBar.text,'+' + number,true)		

	}

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.magic','xpcoins')
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

		var heartImg = group.create(0,0,'atlas.magic','life_box')

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

		sound.play("wrong")
		sound.play("gameLose")

		gameActive = false


		tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			magicSong.stop()
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)		
			sceneloader.show("result")
		})
	}


	function preload(){		
		game.stage.disableVisibilityChange = false;
		epicparticles.loadEmitter(game.load, "pickedEnergy") 
	}


	function releaseButton(obj){

		obj.parent.children[1].alpha = 1
	}

	function createBackground(){

		backgroundGroup = game.add.group()
		sceneGroup.add(backgroundGroup)
		
		summerGroup=game.add.group();
		sceneGroup.add(summerGroup)
		
		springGroup=game.add.group();
		sceneGroup.add(springGroup)
		
		winterGroup=game.add.group();
		sceneGroup.add(winterGroup)
		
		fallGroup=game.add.group();
		sceneGroup.add(fallGroup)

		//Aqui inicializo los botones
		controles=game.input.keyboard.createCursorKeys()

		correctParticle = createPart("star")
		sceneGroup.add(correctParticle)
		wrongParticle = createPart("wrong")
		sceneGroup.add(wrongParticle)
		boomParticle = createPart("smoke")
		sceneGroup.add(boomParticle)
		
		
		
		var summerRect = new Phaser.Graphics(game)
		summerRect.beginFill(0xedf7b2)
		summerRect.drawRect(0,0,game.world.width * 2, game.world.height / 2)
		summerRect.alpha = 1
		summerRect.endFill()
		
		var winterRect = new Phaser.Graphics(game)
		winterRect.beginFill(0x99e9ff)
		winterRect.drawRect(0,0,game.world.width * 2, game.world.height / 2)
		winterRect.alpha = 1
		winterRect.endFill()
		
		var fallRect = new Phaser.Graphics(game)
		fallRect.beginFill(0xf9e491)
		fallRect.drawRect(0,0,game.world.width * 2, game.world.height / 2)
		fallRect.alpha = 1
		fallRect.endFill()
		
		var springRect= new Phaser.Graphics(game)
		springRect.beginFill(0x8fffc2)
		springRect.drawRect(0,0,game.world.width * 2, game.world.height / 2)
		springRect.alpha = 1
		springRect.endFill()
		
		summerGroup.add(summerRect)
		winterGroup.add(winterRect)
		fallGroup.add(fallRect)
		springGroup.add(springRect)
		
		var springFloor= new Phaser.Graphics(game)
		springFloor.beginFill(0x66CC66)
		springFloor.drawRect(0,game.world.height / 2,game.world.width * 2, game.world.height)
		springFloor.alpha = 1
		springFloor.endFill()
	
		var summerFloor= new Phaser.Graphics(game)
		summerFloor.beginFill(0x66CC99)
		summerFloor.drawRect(0,game.world.height / 2,game.world.width * 2, game.world.height)
		summerFloor.alpha = 1
		summerFloor.endFill()
		
		var fallFloor= new Phaser.Graphics(game)
		fallFloor.beginFill(0xB0CC58)
		fallFloor.drawRect(0,game.world.height / 2,game.world.width * 2, game.world.height)
		fallFloor.alpha = 1
		fallFloor.endFill()
		
		var winterFloor= new Phaser.Graphics(game)
		winterFloor.beginFill(0xD2FCE8)
		winterFloor.drawRect(0,game.world.height / 2,game.world.width * 2, game.world.height)
		winterFloor.alpha = 1
		winterFloor.endFill()
		
		summerGroup.add(summerFloor)
		winterGroup.add(winterFloor)
		springGroup.add(springFloor)
		fallGroup.add(fallFloor)
		
		summerGroup.create(0,-5,"summer");
		winterGroup.create(0,-5,"winter");
		springGroup.create(0,-5,"spring");
		fallGroup.create(0,-5,"fall");
		
		summerGroup.children[2].width=game.world.width;
		winterGroup.children[2].width=game.world.width;
		springGroup.children[2].width=game.world.width;
		fallGroup.children[2].width=game.world.width;
		
		summerGroup.alpha=0;
		winterGroup.alpha=0;
		springGroup.alpha=0;
		fallGroup.alpha=0;

		var rocks= game.add.tileSprite(0,game.world.centerY+10,game.world.width,100,"rocks");
		sceneGroup.add(rocks)
		
		boardSlots=game.add.sprite(game.world.centerX,game.world.centerY+200,"atlas.magic","spellBoard");
		boardSlots.anchor.setTo(0.5,0.5)
		sceneGroup.add(boardSlots)
		
		boardRunes=game.add.sprite(game.world.centerX,game.world.height-80,"atlas.magic","board");
		boardRunes.anchor.setTo(0.5,0.5)
		boardRunes.scale.setTo(1,1)
		sceneGroup.add(boardRunes)
		
		createYogotarAndEnemy();
		managerWordEnemyEnviroment(false)
		

		
		
	}

	
	function createCoinsAndHand(){
		//Coins
		coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
		coins.anchor.setTo(0.5)
		coins.scale.setTo(0.5)
		coins.animations.add('coin');
		coins.animations.play('coin', 24, true);
		coins.alpha=0
	}


	function Coin(objectBorn,objectDestiny,time){


		//objectBorn= Objeto de donde nacen
		coins.x=objectBorn.centerX
		coins.y=objectBorn.centerY

		emitter = epicparticles.newEmitter("pickedEnergy")
		emitter.duration=0.05;
		emitter.x = coins.x
		emitter.y = coins.y
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


	function update(){
		if(startGame){
			epicparticles.update()
		}
	}

	function reset(win,word){
		for(var clean=0; clean<word.length; clean++){
			game["slot"+clean].destroy();
		}
		if(win){
			managerWordEnemyEnviroment(false);
		}else{
			managerWordEnemyEnviroment(true);
		}
	}

	function createTextPart(text,obj){

		var pointsText = lookParticle('text')

		if(pointsText){
			pointsText.x = obj.world.x
			pointsText.y = obj.world.y - 60
			pointsText.setText(text)
			pointsText.scale.setTo(1,1)

			game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
			game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

			deactivateParticle(pointsText,750)
		}
	}

	function lookParticle(key){

		for(var i = 0;i<particlesGroup.length;i++){

			var particle = particlesGroup.children[i]
			//console.log(particle.tag + ' tag,' + particle.used)
			if(!particle.used && particle.tag == key){

				particle.used = true
				particle.alpha = 1

				particlesGroup.remove(particle)
				particlesUsed.add(particle)

				return particle
				break
			}
		}

	}

	function deactivateParticle(obj,delay){

		game.time.events.add(delay,function(){

			obj.used = false

			particlesUsed.remove(obj)
			particlesGroup.add(obj)

		},this)
	}

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);
		particle.makeParticles('atlas.magic',key);
		particle.minParticleSpeed.setTo(-200, -50);
		particle.maxParticleSpeed.setTo(200, -100);
		particle.minParticleScale = 0.3;
		particle.maxParticleScale = .8;
		particle.gravity = 150;
		particle.angularDrag = 30;
		particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
		return particle
	}

	function createParticles(tag,number){

		for(var i = 0; i < number;i++){

			var particle
			if(tag == 'text'){

				var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

				var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
				particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
				particlesGroup.add(particle)

			}else{
				var particle = game.add.emitter(0, 0, 100);

				particle.makeParticles('atlas.magic',tag);
				particle.minParticleSpeed.setTo(-200, -50);
				particle.maxParticleSpeed.setTo(200, -100);
				particle.minParticleScale = 0.6;
				particle.maxParticleScale = 1.5;
				particle.gravity = 150;
				particle.angularDrag = 30;

				particlesGroup.add(particle)

			}
			particle.alpha = 0
			particle.tag = tag
			particle.used = false
			particle.scale.setTo(1,1)
		}


	}

	function addParticles(){


		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)

		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)

		createParticles('star',3)
		createParticles('wrong',1)
		createParticles('text',5)
		createParticles('smoke',1)

	}

	function setExplosion(obj){

		var posX = obj.x
		var posY = obj.y

		if(obj.world){
			posX = obj.world.x
			posY = obj.world.y
		}
		var rect = new Phaser.Graphics(game)
		rect.beginFill(0xffffff)
		rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
		rect.alpha = 0
		rect.endFill()
		sceneGroup.add(rect)

		game.add.tween(rect).from({alpha:1},500,"Linear",true)

		var exp = sceneGroup.create(0,0,'atlas.magic','cakeSplat')
		exp.x = posX
		exp.y = posY
		exp.anchor.setTo(0.5,0.5)

		exp.scale.setTo(6,6)
		game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
		var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)

		particlesNumber = 8

		var particlesGood = game.add.emitter(0, 0, 100);

		particlesGood.makeParticles('atlas.magic','smoke');
		particlesGood.minParticleSpeed.setTo(-200, -50);
		particlesGood.maxParticleSpeed.setTo(200, -100);
		particlesGood.minParticleScale = 0.6;
		particlesGood.maxParticleScale = 1.5;
		particlesGood.gravity = 150;
		particlesGood.angularDrag = 30;

		particlesGood.x = posX;
		particlesGood.y = posY;
		particlesGood.start(true, 1000, null, particlesNumber);

		game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
		sceneGroup.add(particlesGood)

	}

	function inputButton(obj){

		if(!gameActive){
			return
		}
	}

	return {

		assets: assets,
		name: "magicSpell",
		preload:preload,
		localizationData:localizationData,
		update:update,
		create: function(event){


			sceneGroup = game.add.group()

			
			addParticles()
			magicSong = sound.play("acornSong", {loop:true, volume:0.6})

			magicSong = game.add.audio('acornSong')
			game.sound.setDecodedCallback(magicSong, function(){
				magicSong.loopFull(0.6)
			}, this);

			game.onPause.add(function(){
				game.sound.mute = true
			} , this);

			game.onResume.add(function(){
				game.sound.mute = false
			}, this);

			initialize()
			createBackground()

			createPointsBar()
			createHearts()
			createTutorial()

			buttons.getButton(magicSong,sceneGroup)

			animateScene()

		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()