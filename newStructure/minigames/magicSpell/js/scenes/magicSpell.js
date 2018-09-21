
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
			"word3":"OTOÑO",
			"tutorial_image":"images/magic/tutorial_image_ES.png",
		},

		"ES":{
			"moves":"Movimientos extra",
			"howTo":"¿Cómo jugar?",
			"stop":"¡Detener!",
			"word0":"SUMMER",
			"word1":"WINTER",
			"word2":"SPRING",
			"word3":"FALL",
			"tutorial_image":"images/magic/tutorial_image_EN.png",
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
				file:"%lang"
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
				file:"images/Spine/Dinamita/dinamita.json"
			},
			{
				name:"skelleton",
				file:"images/Spine/Spelletor/spelletor.json"
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
				frames:5
			},
			{   name: "coin",
			 file: "images/Spine/coin/coin.png",
			 width: 122,
			 height: 123,
			 frames: 12
			}
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
			{	name: "rune",
			 file: soundsPath + "flesh.mp3"},
			{	name: "cog",
			 file: soundsPath + "cog.mp3"},
			{	name: "evilLaugh",
			 file: soundsPath + "evilLaugh.mp3"},
			{	name: "explode",
			 file: soundsPath + "explosion.mp3"},
			{   name:"technology",
			 file: soundsPath + 'songs/technology_action.mp3'},

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
	var gameGroup = null
	var UIGroup = null
	var handleRune
	var timeBar, clock
	var dificultyTime
	var background
	var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
	var gameIndex = 1
	var baseRect
	var summerGroup, springGroup, fallGroup, winterGroup;
	var tutoGroup
	var indexGame
	var overlayGroup
	var magicSong
	var FIRST_DIFICULTY=4;
	var SECOND_DIFICULTY=7;
	var firstWord
	var tutorial
	var okButton
	var handTween
	var rocks
	var words=[];
	var canPlay
	var runesInSlots
	var positionX=[];
	var positionY=[];
	var movingTile
	var movingHand
	var allRunes=9
	var dinamita, skelleton;
	var TOTAL_WORDS=3;
	var enemys=[];
	var runeIndex
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var backgroundGroup=null

	var boardSlots, boardRunes
	var tweenTiempo
	var clock, timeBar
	var emitter
	var hand

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		game.stage.backgroundColor = "#000000"
		lives = 3
		tutorial=true;
		dificultyTime=15500;
		movingTile=false;
		canPlay=false;
		emitter=""
		handleRune=null
		movingHand=true;
		runesInSlots=0;
		runeIndex=0;
		loadSounds()
		for(var insertWords=0; insertWords<=TOTAL_WORDS; insertWords++){
			words[insertWords]=localization.getString(localizationData,"word"+insertWords);
		}
	}

	function onClickPlay(rect) {
		tutoGroup.y = -game.world.height
		canPlay=true;
	}

	function createTutorial(){
		tutoGroup = game.add.group()
		sceneGroup.add(tutoGroup)
		tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
	}

	function createSlots(word){
		var countSpaces=word.length;
		var pivotX=boardSlots.x-(word.length/2)*53;
		for (var slotsInGame=0; slotsInGame<word.length; slotsInGame++){
			game["slot"+slotsInGame]=game.add.sprite(pivotX,boardSlots.y-10,"atlas.magic","slot");
			game["slot"+slotsInGame].anchor.setTo(0.5,0.5);
			game["slot"+slotsInGame].value=word[slotsInGame];	
			game["slot"+slotsInGame].isOccupied=false;
			game["slot"+slotsInGame].tag="slot";
			game["slot"+slotsInGame].alpha=0;
			game.add.tween(game["slot"+slotsInGame]).to({alpha:1},900,Phaser.Easing.Cubic.In,true);
			game["slot"+slotsInGame].index=slotsInGame;
			gameGroup.add(game["slot"+slotsInGame])
			pivotX+=60
		}
	}
	function createRunes(char,word){
		var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

		game["rune"+runeIndex]=game.add.sprite(positionX[runeIndex],positionY[runeIndex],"atlas.magic","rune")
		game["rune"+runeIndex].anchor.setTo(0.5,0.5)
		game["rune"+runeIndex].scale.setTo(0.8,0.8)
		game["rune"+runeIndex].alpha=0;
		game.add.tween(game["rune"+runeIndex]).to({alpha:1},900,Phaser.Easing.Cubic.In,true);
		if(!tutorial){
			game["rune"+runeIndex].inputEnabled=true;
			game["rune"+runeIndex].input.pixelPerfectOver=true;
			game["rune"+runeIndex].input.enableDrag(true);
		}
		game["rune"+runeIndex].posIndex=runeIndex;
		game["rune"+runeIndex].value=char;
		if(char==null){
			if(pointsBar.number<SECOND_DIFICULTY && pointsBar.number>=FIRST_DIFICULTY){
				game["rune"+runeIndex].value="";
			}else{
				game["rune"+runeIndex].value=possible[game.rnd.integerInRange(0,possible.length-1)];
			}
		}
		game["rune"+runeIndex].inSlot=null;
		game["rune"+runeIndex].events.onDragStart.add(startDrag, this);
		//game["rune"+runeIndex].events.onDragUpdate.add(updateDrag, this);
		game["rune"+runeIndex].events.onDragStop.add(stopDrag.bind(this,word));
		game["rune"+runeIndex].text=new Phaser.Text(sceneGroup.game, 0, 30,game["rune"+runeIndex].value, fontStyle)
		game["rune"+runeIndex].text.x=0;
		game["rune"+runeIndex].text.y=0;
		game["rune"+runeIndex].text.anchor.setTo(0.5,0.5)
		game["rune"+runeIndex].addChild(game["rune"+runeIndex].text)
		gameGroup.add(game["rune"+runeIndex])
		runeIndex++;
	}
	function updateDrag(obj){
		if(!magicParticles){
			game.time.events.add(500,function(){
				magicParticles=false
				emitter = epicparticles.newEmitter("pickedEnergy")
				emitter.duration=0.005;
				emitter.x = obj.x
				emitter.y = obj.y
			})
		}
	}
	function startDrag(obj){
		magicParticles=false;
		obj.scale.setTo(0.5,0.5)
		sound.play("rune")
		handleRune=obj;
		gameGroup.bringToTop(obj)
		if(obj.inSlot!=null){
			game["slot"+obj.inSlot].isOccupied=false;
			obj.inSlot=null;

			runesInSlots--;
		}
	}
	function stopDrag(word,rune){
		rune.scale.setTo(0.8,0.8)
		handleRune=null;
		var objOverlaping=null;
		for(var checkSlots=0; checkSlots<word.length; checkSlots++){
			if(checkOverlap(game["slot"+checkSlots],rune)){
				objOverlaping=game["slot"+checkSlots];
			}
			if(checkOverlap(boardRunes,rune)){
				objOverlaping=boardRunes;
			}
		}
		if(objOverlaping!=null){
			var slotOverlaping=objOverlaping;
			if(objOverlaping.tag=="slot" && !objOverlaping.isOccupied){
				if(tutorial && rune.value===slotOverlaping.value){
					sound.play("cog")
					rune.inputEnabled=false;
					game.add.tween(rune).to({x:slotOverlaping.x,y:slotOverlaping.y},200,Phaser.Easing.Cubic.In,true);
					rune.inSlot=objOverlaping.index;
					rune.scale.setTo(slotOverlaping.scale.x-0.3,slotOverlaping.scale.y-0.3)
					slotOverlaping.isOccupied=true;
					runesInSlots++;
					if(runesInSlots==word.length){
						canPlay=false;
						if(handTween)handTween.stop(false);
						hand.alpha=0;
						hand.x=okButton.x+20;
						hand.y=okButton.y+10;
						game.add.tween(hand).to({alpha:1},900,Phaser.Easing.linear,true)
						game.add.tween(okButton).to({alpha:1},900,Phaser.Easing.linear,true).onComplete.add(function(){
							okButton.inputEnabled=true;
							okButton.input.perfectPixelClick=true;
							hand.animations.play('hand', 25, true);
						})
					}
					return
				}else if(!tutorial){
					sound.play("cog")
					game.add.tween(rune).to({x:slotOverlaping.x,y:slotOverlaping.y},200,Phaser.Easing.Cubic.In,true);
					rune.inSlot=objOverlaping.index;
					rune.scale.setTo(slotOverlaping.scale.x-0.3,slotOverlaping.scale.y-0.3)
					slotOverlaping.isOccupied=true;
					runesInSlots++;
					return
				}
			}
			if((tutorial && rune.value!=slotOverlaping.value) || objOverlaping.isOccupied || objOverlaping.tag=="board"){
				sound.play("cut")
				game.add.tween(rune).to({x:positionX[rune.posIndex],y:positionY[rune.posIndex]},200,Phaser.Easing.Cubic.In,true);
				return
			}
		}else if(objOverlaping==null){
			sound.play("cut")
			game.add.tween(rune).to({x:positionX[rune.posIndex],y:positionY[rune.posIndex]},200,Phaser.Easing.Cubic.In,true);
			return
		}
	}
	function createHandAndCoinsAndUIGroup(){

		UIGroup=game.add.group()
		sceneGroup.add(UIGroup);

		hand=game.add.sprite(0,0, "hand")
		hand.anchor.setTo(0.5,0.5);
		hand.scale.setTo(0.6,0.6);
		hand.animations.add('hand');
		hand.animations.play('hand', 5, false);
		hand.alpha=0;
		sceneGroup.add(hand)

		coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin");
		coins.anchor.setTo(0.5);
		coins.scale.setTo(0.5);
		coins.animations.add('coin');
		coins.animations.play('coin', 24, true);
		coins.alpha=0;
		sceneGroup.add(coins)
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
	function positionTimer(){
		clock=game.add.image(game.world.centerX-150,70,"atlas.time","clock")
		clock.scale.setTo(.7)
		timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
		timeBar.scale.setTo(8,.45)
		backgroundGroup.add(clock)
		backgroundGroup.add(timeBar)
		timeBar.alpha=1
		clock.alpha=1
		UIGroup.add(clock)
		UIGroup.add(timeBar)
	}
	function attackYogotar(word){
		var dinamitaAttack
		if(word=="SUMMER" || word=="VERANO"){
			dinamitaAttack="summer"
		}else if(word=="SPRING" || word=="PRIMAVERA"){
			dinamitaAttack="spring"
		}else if(word=="FALL" || word=="OTOÑO"){
			dinamitaAttack="fall"
		}else if(word=="WINTER" || word=="INVIERNO"){
			dinamitaAttack="winter"
		}
		word=word.toLowerCase()
		tutorial=false;
		if(dificultyTime>500)dificultyTime-=200;
		sound.play("magic")
		dinamita.setAnimationByName(0,"spell_"+dinamitaAttack,false).onComplete=function(){
			Coin(skelleton,pointsBar,100);
			sound.play("explode")
			skelleton.setAnimationByName(0,"lose1",false).onComplete=function(){
				dinamita.setAnimationByName(0,"idle",true)
				game.add.tween(skelleton).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
					if(lives>0)reset(true,word);
				});
			};
		};
	}
	function feedBack(word){

		for(var placeAllLettersInBoard=0; placeAllLettersInBoard<allRunes; placeAllLettersInBoard++){
			game.add.tween(game["rune"+placeAllLettersInBoard]).to({x:positionX[game["rune"+placeAllLettersInBoard].posIndex],y:positionY[game["rune"+placeAllLettersInBoard].posIndex]},100,Phaser.Easing.Cubic.In,true)	
			game["rune"+placeAllLettersInBoard].inSlot=false;
			game["rune"+placeAllLettersInBoard].scale.setTo(0.8,0.8);
		}
		for(var cleanSlots=0; cleanSlots<word.length; cleanSlots++){
			game["slot"+cleanSlots].isOccupied=false;
		}
		game.time.events.add(300,function(){
			for(var checkWordInSlot=0; checkWordInSlot<word.length; checkWordInSlot++){
				for(var checkWordInRune=0; checkWordInRune<allRunes; checkWordInRune++){
					if(game["rune"+checkWordInRune].value===game["slot"+checkWordInSlot].value && !game["rune"+checkWordInRune].inSlot && !game["slot"+checkWordInSlot].isOccupied){
						game["rune"+checkWordInRune].inSlot=true
						game["slot"+checkWordInSlot].isOccupied=true
						game.add.tween(game["rune"+checkWordInRune]).to({x:game["slot"+checkWordInSlot].x,y:game["slot"+checkWordInSlot].y},300,Phaser.Easing.Cubic.In,true)
					}
				}
			}
		});
	}
	function attackEnemy(word){
		dinamita.setAnimationByName(0,"spell_fail",false).onComplete=function(){
			feedBack(word)
			dinamita.setAnimationByName(0,"idle",true)
			skelleton.setAnimationByName(0,"attack",false).onComplete=function(){
				sound.play("evilLaugh")
				boomParticle.x=dinamita.x;
				boomParticle.y=dinamita.y-100;
				boomParticle.start(true, 1200, null, 10)
				if(lives>1){
					dinamita.setAnimationByName(0,"idle",true)
				}else{
					dinamita.setAnimationByName(0,"lose",false).onComplete=function(){
						dinamita.setAnimationByName(0,"losestill",true)
					}
				}
				skelleton.setAnimationByName(0,"idle",true)
				missPoint();
				game.time.events.add(1000,function(){
					if(lives>0)reset(false,word)
				})
			};
			skelleton.setToSetupPose();
		}
		dinamita.setToSetupPose();
	}
	function pressOk(button){
		sound.play("pop")
		button.loadTexture("atlas.magic","okOn")
	}
	function evaluateWord(word,button){
		if(!tutorial)stopTimer();
		if(hand)hand.destroy()
		button.loadTexture("atlas.magic","okOff")
		var win=true;
		button.inputEnabled=false;
		game.add.tween(okButton).to({alpha:0},900,Phaser.Easing.linear,true);
		for (var checkCharacters=0; checkCharacters<allRunes; checkCharacters++){
			game["rune"+checkCharacters].inputEnabled=false;
			if(game["slot"+game["rune"+checkCharacters].inSlot]){
				if(game["rune"+checkCharacters].value!=game["slot"+game["rune"+checkCharacters].inSlot].value){
					win=false;
				}
			}
		}
		if(runesInSlots!=word.length){
			win=false;
		}
		tutorial=false
		if(win){
			attackYogotar(word)
		}else{
			attackEnemy(word)
		}
	}
	function createUI(word){

		if(tutorial){
			okButton.inputEnabled=false;
		}
		okButton.scale.setTo(0.35,0.35)
		okButton.anchor.setTo(0.5,0.5)
		okButton.events.onInputDown.add(pressOk,this);
		okButton.events.onInputUp.add(evaluateWord.bind(this,word));
		gameGroup.add(okButton);
	}
	function randomizeWord(word){
		var pasingWord=[];
		var newWord="";
		for(var size=0; size<word.length; size++){
			pasingWord[size]=word[size];
		}
		Phaser.ArrayUtils.shuffle(pasingWord)
		for(var sameSize=0; sameSize<pasingWord.length; sameSize++){
			newWord=newWord.concat(pasingWord[sameSize]);
		}
		return newWord
	}	
	function randomizeInRunes(){
		var firstChar;
		var passingChar;
		var secondChar;
		var howManyWords=allRunes-1;
		for(var change=0; change<howManyWords; change++){
			firstChar=game.rnd.integerInRange(0,allRunes-1);
			secondChar=game.rnd.integerInRange(0,allRunes-1);
			passingChar=game["rune"+firstChar].value;
			game["rune"+firstChar].value=game["rune"+secondChar].value;
			game["rune"+secondChar].value=passingChar;
			game["rune"+firstChar].text.setText(game["rune"+firstChar].value);
			game["rune"+secondChar].text.setText(game["rune"+secondChar].value);
		}	
	}
	function cluesForWord(word){
		var howMany=game.rnd.integerInRange(1,3);
		var counterWords=0;
		var canClue=0;
		for(var checkWordInSlot=0; checkWordInSlot<word.length; checkWordInSlot++){
			for(var checkWordInRune=0; checkWordInRune<allRunes; checkWordInRune++){
				canClue=game.rnd.integerInRange(0,1)
				if(game["rune"+checkWordInRune].value===game["slot"+checkWordInSlot].value && canClue==1 && counterWords<howMany && game["rune"+checkWordInRune].inSlot==null && !game["slot"+checkWordInSlot].isOccupied){
					game["rune"+checkWordInRune].inSlot=game["slot"+checkWordInSlot].index;
					game["rune"+checkWordInRune].scale.setTo(game["slot"+checkWordInSlot].scale.x-0.3,game["slot"+checkWordInSlot].scale.y-0.3)
					game["slot"+checkWordInSlot].isOccupied=true;
					game["rune"+checkWordInRune].x=game["slot"+checkWordInSlot].x;
					game["rune"+checkWordInRune].y=game["slot"+checkWordInSlot].y;
					counterWords++
					runesInSlots++;
				}
			}
		}
	}
	function divideInCharacters(word){
		createSlots(word)
		createUI(word)
		var wordForTimer=word;
		word=randomizeWord(word)
		allRunes=word.length;
		if(pointsBar.number>=FIRST_DIFICULTY){
			allRunes=9;
		}
		for (var slice=0; slice<allRunes; slice++){
			createRunes(word[slice],word)
		}
		if(pointsBar.number>=FIRST_DIFICULTY){
			randomizeInRunes()
		}else if(pointsBar.number<FIRST_DIFICULTY && !tutorial){
			cluesForWord(wordForTimer)
		}
		game.time.events.add(2000,function(){
			if(tutorial){
				movingHand=false;
			}else{
				startTimer(dificultyTime,wordForTimer)
				okButton.inputEnabled=true;
				okButton.input.pixelPerfectClick=true;
				game.add.tween(okButton).to({alpha:1},900,Phaser.Easing.linear,true);
			}
		});
	}
	function shuffleEnemy(word,alive){
		if(!alive){
			skelleton=null;
			skelleton=game.add.spine(game.world.centerX+200,game.world.centerY,"skelleton");
			skelleton.setSkinByName("normal"+game.rnd.integerInRange(1,4));
			skelleton.setAnimationByName(0,"idle",true)
			if(!tutorial)skelleton.alpha=0;
			gameGroup.add(skelleton)
			game.add.tween(skelleton).to({alpha:1},1500,Phaser.Easing.Cubic.In,true).onComplete.add(function(){
				dinamita.setAnimationByName(0,"idle",true)
				divideInCharacters(word)
			});
		}else{
			divideInCharacters(word)
		}
	}
	function checkOverlap(spriteA, spriteB) {
		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();
		return Phaser.Rectangle.intersects(boundsA , boundsB);
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
	function changeEnviroment(randomNumber,word,lastGroup,enemyIsAlive){
		var nextGroup;
		var lastGroup;
		var lastWorld=lastGroup.toUpperCase();

		if(lastWorld=="SUMMER" || lastWorld=="VERANO"){
			lastGroup=summerGroup;
		}else if(lastWorld=="SPRING" || lastWorld=="PRIMAVERA"){
			lastGroup=springGroup;	
		}else if(lastWorld=="FALL" || lastWorld=="OTOÑO"){
			lastGroup=fallGroup;
		}else if(lastWorld=="WINTER" || lastWorld=="INVIERNO"){
			lastGroup=winterGroup;
		}
		if(word=="SUMMER" || word=="VERANO"){
			nextGroup=summerGroup;
		}else if(word=="SPRING" || word=="PRIMAVERA"){
			nextGroup=springGroup;	
		}else if(word=="FALL" || word=="OTOÑO"){
			nextGroup=fallGroup;
		}else if(word=="WINTER" || word=="INVIERNO"){
			nextGroup=winterGroup;
		}
		if(!enemyIsAlive){
			dinamita.setAnimationByName(0,"run",true)
			movingTile=true;
		}
		game.add.tween(lastGroup).to({alpha:0},900,Phaser.Easing.Cubic.Out,true).onComplete.add(function(){
			dinamita.setAnimationByName(0,"idle",true);
			movingTile=false;
		});
		game.add.tween(nextGroup).to({alpha:1},1500,Phaser.Easing.Cubic.In,true)
	}
	function managerWordEnemyEnviroment(isEnemyAlive,worldChange){
		var randomNumber=game.rnd.integerInRange(0,TOTAL_WORDS);
		var word
		if(isEnemyAlive){
			word=worldChange.toUpperCase()
		}else{
			word=words[randomNumber];
			if(worldChange){
				while(word==worldChange.toUpperCase()){
					randomNumber=game.rnd.integerInRange(0,TOTAL_WORDS);
					word=words[randomNumber];
				}
			}
		}
		
		if(!tutorial && lives>0){
			game.time.events.add(1000,function(){
				if(!timeBar)positionTimer();
				changeEnviroment(randomNumber,word, worldChange, isEnemyAlive);
				shuffleEnemy(word,isEnemyAlive)
			});
		}else{
			word=words[1];
			tutorialLevel(word);
		}
	}
	function enteringToGame(word){
		
		shuffleEnemy(word)
		game.add.tween(dinamita).to({x:game.world.centerX-200},1500,Phaser.Easing.Cubic.In,true).onComplete.add(function(){
			dinamita.setAnimationByName(0,"idle",true);
			
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
		firstWord=word
	}
	function handToSlot(){
		movingHand=true;
		if(hand && runesInSlots<firstWord.length){
			hand.alpha=1;
			var runePos=game["rune"+searchInRunes];
			for(var searchInRunes=0; searchInRunes<allRunes; searchInRunes++){
				if(game["rune"+searchInRunes].value==game["slot"+runesInSlots].value && game["rune"+searchInRunes].inSlot==null && !game["slot"+runesInSlots].isOccupied ){
					runePos=game["rune"+searchInRunes];
				}
			}
			runePos.inputEnabled=true;
			runePos.input.enableDrag(true);
			runePos.input.pixelPerfectOver=true;
			hand.x=runePos.x+20;
			hand.y=runePos.y+30;
			handTween=game.add.tween(hand).to({x:game["slot"+runesInSlots].x+20,y:game["slot"+runesInSlots].y+30},1200,Phaser.Easing.linear,true)
			handTween.onComplete.add(function(){
				movingHand=false;
			})
		}
	}
	function createYogotarAndEnemy(){
		dinamita=game.add.spine(-200,game.world.centerY+60,"dinamita");
		dinamita.setSkinByName("normal");
		dinamita.setAnimationByName(0,"run",true);
		dinamita.scale.setTo(0.5,0.5)
		gameGroup.add(dinamita);

		skelleton=game.add.spine(game.world.width+300,game.world.centerY,"skelleton");
		skelleton.setSkinByName("normal"+game.rnd.integerInRange(1,4));
		skelleton.setAnimationByName(0,"idle",true);
		gameGroup.add(skelleton);
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
		baseRect.alpha = 0
		gameActive = false
		game.time.events.add(1500,function(){
			tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1200)
			tweenScene.onComplete.add(function(){
				magicSong.stop()
				var resultScreen = sceneloader.getScene("result")
				resultScreen.setScore(true, pointsBar.number,gameIndex)		
				sceneloader.show("result")
			})
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

		baseRect= new Phaser.Graphics(game)
		baseRect.beginFill(0xffffff)
		baseRect.drawRect(0,0,game.world.width, game.world.height)
		baseRect.alpha = 1
		baseRect.endFill()
		sceneGroup.add(baseRect)

		summerGroup=game.add.group();
		sceneGroup.add(summerGroup)

		springGroup=game.add.group();
		sceneGroup.add(springGroup)

		winterGroup=game.add.group();
		sceneGroup.add(winterGroup)

		fallGroup=game.add.group();
		sceneGroup.add(fallGroup)

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

		rocks= game.add.tileSprite(0,game.world.centerY+10,game.world.width,100,"rocks");
		sceneGroup.add(rocks)

		boardSlots=game.add.sprite(game.world.centerX,game.world.centerY+200,"atlas.magic","spellBoard");
		boardSlots.anchor.setTo(0.5,0.5)
		boardSlots.scale.setTo(1.2,1)
		sceneGroup.add(boardSlots)

		boardRunes=game.add.sprite(game.world.centerX,game.world.height-80,"atlas.magic","board");
		boardRunes.anchor.setTo(0.5,0.5)
		boardRunes.scale.setTo(1,1)
		boardRunes.tag="board";
		sceneGroup.add(boardRunes)

		okButton=game.add.sprite(boardRunes.x+170,game.world.height-45,"atlas.magic","okOff");
		okButton.alpha=0;
		fillPositions();

		gameGroup = game.add.group()
		sceneGroup.add(gameGroup);

		createYogotarAndEnemy();
		managerWordEnemyEnviroment(false,null)

		correctParticle = createPart("star")
		sceneGroup.add(correctParticle)
		wrongParticle = createPart("wrong")
		sceneGroup.add(wrongParticle)
		boomParticle = createPart("smoke")
		sceneGroup.add(boomParticle)
	}
	function fillPositions(){
		var pivotX=boardRunes.x-boardRunes.width/2+100;
		var pivotY=boardRunes.y-boardRunes.height+130;
		for(var fill=0; fill<allRunes; fill++){
			if(fill%5!=0 || fill==0 || fill==1){
				positionX[fill]=pivotX;
				positionY[fill]=pivotY;
				pivotX+=80;
			}else{
				pivotX=boardRunes.x-boardRunes.width/2+80;
				pivotY+=80
				positionX[fill]=pivotX;
				positionY[fill]=pivotY;
				pivotX+=80;
			}
		}
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
			if(tutorial && !movingHand && canPlay){
				handToSlot()
			}
			if(movingTile){
				rocks.tilePosition.x-=10;
			}
		}
	}
	function stopTimer(){
		tweenTiempo.stop()
		tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, 500, Phaser.Easing.Linear.Out, true, 100)
	}
	function startTimer(time,word){
		var world=word;
		tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
		tweenTiempo.onComplete.add(function(){
			game.add.tween(okButton).to({alpha:0},900,Phaser.Easing.linear,true);
			okButton.inputEnabled=false;
			for(var stopMoving=0; stopMoving<allRunes; stopMoving++){
				game["rune"+stopMoving].inputEnabled=false;
			}
			if(handleRune){			
				handleRune.scale.setTo(0.8,0.8)
				game.add.tween(handleRune).to({x:positionX[handleRune.posIndex],y:positionY[handleRune.posIndex]},100,Phaser.Easing.Cubic.In,true)	
			}
			stopTimer();
			attackEnemy(world);
		})
	}
	function reset(win,word){
		for(var cleanSlots=0; cleanSlots<word.length; cleanSlots++){
			game.add.tween(game["slot"+cleanSlots]).to({alpha:0},900,Phaser.Easing.Cubic.Out,true,100*cleanSlots)
		}
		for(var cleanRunes=0; cleanRunes<allRunes; cleanRunes++){
			game["rune"+cleanRunes].inputEnabled=false;
			game.add.tween(game["rune"+cleanRunes]).to({alpha:0},900,Phaser.Easing.Cubic.Out,true,100*cleanRunes);
			runeIndex--;
		}
		okButton.loadTexture("atlas.magic","okOff")
		runesInSlots=0;
		game.time.events.add(1800,function(){
			for(var destroyRunes=0; destroyRunes<allRunes; destroyRunes++){
				game["rune"+destroyRunes].destroy();
			}
			for(var destroySlots=0; destroySlots<word.length; destroySlots++){
				game["slot"+destroySlots].destroy();
			}
			if(win){
				managerWordEnemyEnviroment(false,word);
			}else{
				managerWordEnemyEnviroment(true,word);
			}
		});
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

			magicSong = game.add.audio('technology')
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
			createHandAndCoinsAndUIGroup()
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