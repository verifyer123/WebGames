
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var symfunny = function(){

	var localizationData = {
		"EN":{
			"howTo":"How to Play?",
			"moves":"Moves left",
			"stop":"Stop!"
		},

		"ES":{
			"moves":"Movimientos extra",
			"howTo":"¿Cómo jugar?",
			"stop":"¡Detener!"
		}
	}


	assets = {
		atlases: [
			{   
				name: "atlas.symfunny",
				json: "images/symfunny/atlas.json",
				image: "images/symfunny/atlas.png",
			},

		],
		images: [
			{   name:"tutorial_image",
			 file: "images/symfunny/tutorial_image.png"}
		],
		sounds: [
			{	name: "magic",
			 file: soundsPath + "magic.mp3"},
			{	name: "wrong",
			 file: soundsPath + "wrong.mp3"},
			{	name: "pop",
			 file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
			 file: soundsPath + "gameLose.mp3"},
			{	name: "right",
			 file: soundsPath + "rightChoice.mp3"},
			{	name: "error",
			 file: soundsPath + "error.mp3"},
			{	name: "harp",
			 file: "sounds/" + "harp.mp3"},
			{	name: "piano",
			 file: "sounds/" + "piano.mp3"},
			{	name: "tuba",
			 file: "sounds/" + "tuba.mp3"},
			{	name: "violin",
			 file: "sounds/" + "violin.mp3"},
			{	name: "flute",
			 file: "sounds/" + "flute.mp3"},
			{	name: "song",
			 file: "sounds/" + "song.mp3"},
			{	name: "bad_note0",
			 file: soundsPath + "detunedInstruments/harpDetuned.mp3"},
			{	name: "bad_note1",
			 file: soundsPath + "detunedInstruments/pianoDetuned.mp3"},
			{	name: "bad_note2",
			 file: soundsPath + "detunedInstruments/tubaDetuned.mp3"},
			{	name: "bad_note3",
			 file: soundsPath + "detunedInstruments/violinDetuned.mp3"},
			{	name: "bad_note4",
			 file: soundsPath + "detunedInstruments/fluteDetuned.mp3"},
			{	name: "spaceSong",
			 file: soundsPath + "songs/childrenbit.mp3"},
		],
		spines:[
			{
				name:'normal',
				file:'images/spines/normal/normal.json'
			},
			{
				name:'normal1',
				file:'images/spines/normal1/normal1.json'
			},
			{
				name:'normal2',
				file:'images/spines/normal2/normal2.json'
			},
			{
				name:'normal3',
				file:'images/spines/normal3/normal3.json'
			},
			{
				name:'normal4',
				file:'images/spines/normal4/normal4.json'
			},
			{
				name:'oof',
				file:'images/spines/oof/oof.json'
			},
		],
		spritesheets: [
			{   
				name: "coin",
				file: "images/spines/coinS.png",
				width: 122,
				height: 123,
				frames: 12
			},
			{
				name:"hand",
				file:"images/spines/hand.png",
				width:115,
				height:111,
				frames:23
			},
		]
	}


	var lives = null
	var sceneGroup = null
	var background
	var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
	var hand
	var gameIndex = 107
	var indexGame
	var particleWrong, particleCorrect
	var overlayGroup
	var coinsGroup, coin
	var id
	var spaceSong
	var finalLight=[]
	var tutorial
	var tutorialNext
	var orchestaGroup, tutorialGroup
	var buttonsGroup
	var orchesta = 
		[
			{name:'harp', value:0}, 
			{name:'piano', value:1}, 
			{name:'tuba', value:2}, 
			{name:'violin', value:3}, 
			{name:'flute', value:4}
		]
	var correctAnswer = []
	var cap, pivot, lvl

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		game.stage.backgroundColor = "#ffffff"
		lives = 3
		cap = 3
		pivot = 0
		id=0
		lvl = 0
		tutorialNext=0;
		tutorial=true;

		correctAnswer = [cap]

		loadSounds()

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
	function tutorialLevel(instrument){
		if(correctAnswer[pivot] === instrument.value){
			oof.setAnimationByName(0,"good",false).onComplete=function(){
				oof.setAnimationByName(0,"idle",true)
			}
			game.add.tween(light).to({x:instrument.x,y:instrument.y-30},400,Phaser.Easing.linear,true);
			if(light.alpha==0){
				game.add.tween(light).to({alpha:0.5},400,Phaser.Easing.linear,true)
			}
			particleCorrect.x = instrument.x+game.world.centerX
			particleCorrect.y = instrument.y+game.world.centerY
			particleCorrect.start(true, 1000, null, 5)
			orchestaGroup.children[instrument.value].setAnimationByName(0, "win", false)
			pivot++
			sound.play(orchesta[instrument.value].name)
			if(pivot === cap){
				crescendo(true)
			}
			tutorialNext++;
			if(tutorialNext<cap){
			game.add.tween(hand).to({x:orchestaGroup.children[correctAnswer[tutorialNext]].x+30,y:orchestaGroup.children[correctAnswer[tutorialNext]].y-100},300,Phaser.Easing.Cubic.Out,true);
			}else{
				hand.alpha=0;
				tutorial=false;
			}
		}
	}

	function missPoint(){

		//sound.play("wrong")

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

		var pointsImg = pointsBar.create(-10,10,'atlas.symfunny','xpcoins')
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

		var heartImg = group.create(0,0,'atlas.symfunny','life_box')

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
		
		//spaceSong.stop()

		tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){

			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
			sceneloader.show("result")
		})
	}


	function createOverlay(){

		overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
		sceneGroup.add(overlayGroup)

		tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
	}

	function onClickPlay(){
		overlayGroup.y = -game.world.height
		initGame()
	}

	function initHand(){
		hand=game.add.sprite(0,0, "hand")
		hand.anchor.setTo(0.5,0.5);
		hand.scale.setTo(0.6,0.6);
		hand.animations.add('hand');
		hand.animations.play('hand', 24, true);
		hand.alpha=0;
		tutorialGroup.add(hand)
	}
	function initCoin(){
		
		coin = game.add.sprite(0, 0, "coin")
		coinsGroup.add(coin)
		coin.anchor.setTo(0.6,0.6)
		coin.scale.setTo(0.5,0.5)
		coin.animations.add('coin')
		coin.animations.play('coin', 24, true)
		coin.alpha = 0
		coin.kill()
	}
	function getCoins(player){
		var coin=coinsGroup.getFirstDead();
		if(coin==undefined){
			game["coinS"+id] = game.add.sprite(0, 0, "coin")
			game["coinS"+id].anchor.setTo(0.5,0.5)
			game["coinS"+id].scale.setTo(0.6,0.6)
			game["coinS"+id].animations.add('coin')
			game["coinS"+id].animations.play('coin', 24, true)
			game["coinS"+id].alpha = 0
			coinsGroup.add(game["coinS"+id])
			coin=game["coinS"+id];
			id++;
			addCoin(coin,player)
		}else{
			addCoin(coin,player)
		}
	}
	function addCoin(coin,obj){

		if(coin.motion)
			coin.motion.stop()

		coin.reset(obj.centerX,obj.centerY);

		game.add.tween(coin).to({alpha:1}, 100, Phaser.Easing.linear, true)

		coin.motion = game.add.tween(coin).to({y:coin.y - 100}, 200, Phaser.Easing.Cubic.InOut,true)
		coin.motion.onComplete.add(function(){
			coin.motion = game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true)
			coin.motion.onComplete.add(function(){
				coin.motion = game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true)
				coin.motion.onComplete.add(function(){
					addPoint(1);
					coin.kill();
					createTextPart('+1',pointsBar.text)
				})
			})
		})
	}

	function releaseButton(obj){

		obj.parent.children[1].alpha = 1
	}

	function createBackground(){

		tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.symfunny', "floor")
		sceneGroup.add(tile)

		tileTexture = sceneGroup.create(game.world.centerX, game.world.centerY, 'atlas.symfunny', "tile_texture")
		tileTexture.anchor.setTo(0.5)
		tileTexture.scale.setTo(2, 3)
		tileTexture.alpha = 0.35

		curtain = sceneGroup.create(game.world.centerX, 0, 'atlas.symfunny', "tile")
		curtain.anchor.setTo(0.5, 0)
		curtain.width = game.world.width
		curtain.height = game.world.height * 0.45
		
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

		particle.makeParticles('atlas.symfunny',key);
		particle.minParticleSpeed.setTo(-200, -50);
		particle.maxParticleSpeed.setTo(200, -100);
		particle.minParticleScale = 0.6;
		particle.maxParticleScale = 1;
		particle.gravity = 150;
		particle.angularDrag = 30;

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

				particle.makeParticles('atlas.symfunny',tag);
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

		var exp = sceneGroup.create(0,0,'atlas.symfunny','cakeSplat')
		exp.x = posX
		exp.y = posY
		exp.anchor.setTo(0.5,0.5)

		exp.scale.setTo(6,6)
		game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
		var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)

		particlesNumber = 8

		var particlesGood = game.add.emitter(0, 0, 100);

		particlesGood.makeParticles('atlas.symfunny','smoke');
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

	function initOrchesta(){
		
		orchestaGroup = game.add.group()
		orchestaGroup.x =  game.world.centerX
		orchestaGroup.y = game.world.centerY
		//orchestaGroup.scale.setTo(0.5)
		sceneGroup.add(orchestaGroup)
		
				
		lightGroup=game.add.group()
		lightGroup.x =  game.world.centerX
		lightGroup.y = game.world.centerY
		sceneGroup.add(lightGroup)
		
		courtainGroup = game.add.group()
		sceneGroup.add(courtainGroup)
		

		oof=game.add.spine(game.world.centerX,game.world.height+10,"oof");
		oof.setSkinByName("normal");
		oof.setAnimationByName(0,"idle",true);
		courtainGroup.add(oof)

		harp = game.add.spine(- 100, 0, "normal3")
		harp.scale.setTo(0.7,0.7)
		//harp.scale.setTo(0.7)
		harp.setAnimationByName(0, "idle", true)
		harp.setSkinByName("normal")
		orchestaGroup.add(harp)

		piano = game.add.spine(0, 200, "normal4")
		piano.scale.setTo(0.7,0.7)
		//piano.scale.setTo(0.7)
		piano.setAnimationByName(0, "idle", true)
		piano.setSkinByName("normal")
		orchestaGroup.add(piano)

		tuba = game.add.spine(100, 0, "normal")
		tuba.scale.setTo(0.7,0.7)
		//tuba.scale.setTo(0.7)
		tuba.setAnimationByName(0, "idle", true)
		tuba.setSkinByName("normal")
		orchestaGroup.add(tuba)

		violin = game.add.spine(- 150, 400, "normal2")
		violin.scale.setTo(0.7,0.7)
		//violin.scale.setTo(0.7)
		violin.setAnimationByName(0, "idle", true)
		violin.setSkinByName("normal")
		orchestaGroup.add(violin)

		flute = game.add.spine(150, 400, "normal1")
		flute.scale.setTo(0.7,0.7)
		//flute.scale.setTo(0.7)
		flute.setAnimationByName(0, "idle", true)
		flute.setSkinByName("normal")
		orchestaGroup.add(flute)
		
		
		lighting()
		
		
		courtain1 =  courtainGroup.create(-200,0,"atlas.symfunny","courtain");
		courtain1.anchor.setTo(0.5,0);
		
		courtain2 = courtainGroup.create(game.world.width+200,0,"atlas.symfunny","courtain");
		courtain2.anchor.setTo(0.5,0);
		
		
	}
	
	function lighting(){
		
		
		lightsOff = new Phaser.Graphics(game)
		lightsOff.beginFill(0x000000)
		lightsOff.drawRect(-game.world.centerX,-game.world.centerY,game.world.width * 2, game.world.height * 2)
		lightsOff.alpha =0
		lightsOff.endFill()
		lightGroup.add(lightsOff)
		
		light=game.add.sprite(0,0,"atlas.symfunny","limelight");
		light.scale.setTo(1,1)
		light.anchor.setTo(0.5,0.93);
		light.alpha=0;
		
		for(var fillFinalLights=0; fillFinalLights<orchestaGroup.length; fillFinalLights++){
		
		if(fillFinalLights==0 || fillFinalLights==2){
			finalLight[fillFinalLights]=game.add.sprite(0,0,"atlas.symfunny","light_middle");
		}
		if(fillFinalLights==1)finalLight[fillFinalLights]=game.add.sprite(0,0,"atlas.symfunny","light_middle");
		if(fillFinalLights==3 || fillFinalLights==4)finalLight[fillFinalLights]=game.add.sprite(0,0,"atlas.symfunny","light_side");
			finalLight[fillFinalLights].scale.setTo(1,2.2)
			finalLight[fillFinalLights].anchor.setTo(0.5,0.95);
			if(fillFinalLights==4)finalLight[fillFinalLights].scale.setTo(-1,2.2)
			finalLight[fillFinalLights].alpha=0;
			lightGroup.add(finalLight[fillFinalLights])
			finalLight[fillFinalLights].x=orchestaGroup.children[fillFinalLights].x
			finalLight[fillFinalLights].y=orchestaGroup.children[fillFinalLights].y
		}
		
		
		lightGroup.add(light)
		
		light.blendMode=PIXI.blendModes.LUMINOSITY;
	}
	

	function initBtn(){

		buttonsGroup = game.add.group()
		buttonsGroup.x = game.world.centerX
		buttonsGroup.y = game.world.centerY
		sceneGroup.add(buttonsGroup)  

		for(var t = 0; t < 5; t++)
		{
			var instument = buttonsGroup.create(0, 0, 'atlas.symfunny', 'floor')
			instument.anchor.setTo(0.5, 0)
			instument.scale.setTo(0.7, 1.7)
			instument.alpha = 0
			instument.inputEnabled = true
			instument.events.onInputDown.add(inputButton)
			instument.instument = orchesta[t].name
			instument.value = orchesta[t].value
		}

		//harp
		buttonsGroup.children[0].x = -100
		buttonsGroup.children[0].y = -200

		//piano
		buttonsGroup.children[1].x = 0
		buttonsGroup.children[1].y = 0

		//tuba
		buttonsGroup.children[2].x = 100
		buttonsGroup.children[2].y = -170

		//violin
		buttonsGroup.children[3].x = -150
		buttonsGroup.children[3].y = 200

		//flute
		buttonsGroup.children[4].x = 150
		buttonsGroup.children[4].y = 200
		
	}

	function inputButton(instument){
		

		if(pivot < cap && gameActive && !tutorial){
			game.add.tween(light).to({x:instument.x,y:instument.y-30},400,Phaser.Easing.linear,true);
			if(light.alpha==0){
				game.add.tween(light).to({alpha:0.5},400,Phaser.Easing.linear,true)
			}
			if(correctAnswer[pivot] === instument.value){
				oof.setAnimationByName(0,"good",false).onComplete=function(){
					oof.setAnimationByName(0,"idle",true)
				}
				orchestaGroup.children[instument.value].setAnimationByName(0, "win", false)
				particleCorrect.x = instument.x+game.world.centerX
				particleCorrect.y = instument.y+game.world.centerY
				particleCorrect.start(true, 1000, null, 5)
				pivot++
				sound.play(orchesta[instument.value].name)
				if(pivot === cap)
					crescendo(true)
			}
			else{
//				sound.play('error')
				oof.setAnimationByName(0,"lose",false).onComplete=function(){
					oof.setAnimationByName(0,"idle",true)
				}
				particleWrong.x = instument.x+game.world.centerX
				particleWrong.y = instument.y+game.world.centerY
				particleWrong.start(true, 1000, null, 5)
				orchestaGroup.children[instument.value].setAnimationByName(0, "lose", false)
				sound.play("bad_note"+instument.value)
				crescendo(false)
			}
		}else if(pivot < cap && gameActive && tutorial){
			tutorialLevel(instument);
		
		}
		

		orchestaGroup.children[instument.value].addAnimationByName(0, "idle", true)
	}

	function crescendo(good){

		gameActive = false

		if(good){

			lvl++
			if(lvl % 2 === 0)
				cap++

			game.time.events.add(1000,function(){
				sound.play('song')
				for(var a = 0; a < orchestaGroup.length; a++){
					orchestaGroup.children[a].setAnimationByName(0, "win", false)
					orchestaGroup.children[a].addAnimationByName(0, "idle", true)
				}
				getCoins(oof)
				game.add.tween(light).to({alpha:0},380,Phaser.Easing.linear,true);
				oof.setAnimationByName(0,"win",false).onComplete=function(){
					oof.setAnimationByName(0,"idle",true)
				}
			},this)
			
			for(var illuminateAll=0; illuminateAll<orchestaGroup.length; illuminateAll++){
				game.add.tween(finalLight[illuminateAll]).to({alpha:1},600,Phaser.Easing.Cubic.Out,true);
			}
			game.time.events.add(2500,function(){
				
				game.add.tween(courtain1.scale).to({x:2.5},600,Phaser.Easing.Cubic.Out,true);
				game.add.tween(courtain2.scale).to({x:2.5},600,Phaser.Easing.Cubic.Out,true).onComplete.add(function(){
					for(var offAll=0; offAll<orchestaGroup.length; offAll++){
						finalLight[offAll].alpha=0;
					}
					game.add.tween(courtain1.scale).to({x:1},600,Phaser.Easing.Cubic.Out,true,600);
					game.add.tween(courtain2.scale).to({x:1},600,Phaser.Easing.Cubic.Out,true,600).onComplete.add(function(){
						initGame();
					})
				});
			},this)
		}
		else{
			
			game.time.events.add(1000,function(){
				sound.play('error')
				for(var a = 0; a < orchestaGroup.length; a++){
					orchestaGroup.children[a].setAnimationByName(0, "lose", false)
					orchestaGroup.children[a].addAnimationByName(0, "idle", true)
				}
				
			},this)

			game.time.events.add(2500,function(){
				missPoint()
				game.add.tween(light).to({alpha:0},380,Phaser.Easing.linear,true);
				game.add.tween(courtain1.scale).to({x:2.5},600,Phaser.Easing.Cubic.Out,true);
				game.add.tween(courtain2.scale).to({x:2.5},600,Phaser.Easing.Cubic.Out,true).onComplete.add(function(){
					if(lives>0){
						game.add.tween(courtain1.scale).to({x:1},600,Phaser.Easing.Cubic.Out,true,600);
						game.add.tween(courtain2.scale).to({x:1},600,Phaser.Easing.Cubic.Out,true,600).onComplete.add(function(){
						initGame()
						})
					}
				})
			},this)
		}
	}

	function initGame(){

		pivot = 0
		gameActive = false

		for(var i = 0; i < cap; i++){
			correctAnswer[i] = game.rnd.integerInRange(0, 4)
		}
		if(tutorial){
			correctAnswer[0] = 3
			correctAnswer[1] = 1
			correctAnswer[2] = 4
			hand.x=orchestaGroup.children[correctAnswer[0]].x+30;
			hand.y=orchestaGroup.children[correctAnswer[0]].y-100;
		}
		if(lives !== 0){
			game.time.events.add(500,function(){
				var time = playDemo()

				game.time.events.add(time,function(){
					gameActive = true
					game.add.tween(lightsOff).to({alpha:0},400,Phaser.Easing.linear,true);
					game.add.tween(light).to({alpha:0},400,Phaser.Easing.linear,true);
					if(tutorial)hand.alpha=1;
				},this)
			},this)
		}
	}

	function getRand(){
		var x = game.rnd.integerInRange(0, 4)
		if(x === numberSelect)
			return getRand()
		else
			return x     
	}

	function playDemo(){

		gameActive = false
		var delay = 500

		for(var i = 0; i < cap; i++){

			var r = correctAnswer[i]
			play(delay, r)
			delay += 1500
		}
		return delay
	}

	function play(delay, r){
		
		game.time.events.add(delay,function(){

			game.add.tween(orchestaGroup.children[r].scale).to({x:1, y:1},300,Phaser.Easing.linear,true).onComplete.add(function(){
				sound.play(orchesta[r].name)
				game.add.tween(orchestaGroup.children[r].scale).to({x:0.7, y:0.7},150,Phaser.Easing.linear,true)
			})
			game.add.tween(lightsOff).to({alpha:0.3},400,Phaser.Easing.linear,true);
			game.add.tween(light).to({x:orchestaGroup.children[r].x,y:orchestaGroup.children[r].y-30},400,Phaser.Easing.linear,true);
			game.add.tween(light).to({alpha:0.5},400,Phaser.Easing.linear,true);
			orchestaGroup.children[r].setAnimationByName(0, "win", false)
			orchestaGroup.children[r].addAnimationByName(0, "idle", true)
		},this)
	}

	function createParticles(){
		particleCorrect = createPart('star')
		sceneGroup.add(particleCorrect)

		particleWrong = createPart('smoke')
		sceneGroup.add(particleWrong)
	}

	return {

		assets: assets,
		name: "symfunny",
		getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){

			sceneGroup = game.add.group()

			createBackground()
			addParticles()
			

			/*spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.6)
            }, this);*/

			game.onPause.add(function(){
				game.sound.mute = true
			} , this);

			game.onResume.add(function(){
				game.sound.mute = false
			}, this);

			initialize()
			
			initOrchesta()
			createPointsBar()
			createHearts()
			
			initBtn()
			createParticles()
			
			
			tutorialGroup = game.add.group()
			tutorialGroup.x=game.world.centerX;
			tutorialGroup.y=game.world.centerY;
			sceneGroup.add(tutorialGroup)
			
			coinsGroup = game.add.group()
			coinsGroup.x=0;
			coinsGroup.y=0;
			sceneGroup.add(coinsGroup)
			
			initHand()
			initCoin()
			
			
			createOverlay()

			animateScene()

		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()