
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"


var magicGate = function(){

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
				name: "atlas.magic",
				json: "images/magic/atlas.json",
				image: "images/magic/atlas.png",
			},
		],
		images: [
			{
				name:'tutorial_image',
				file:"images/magic/tutorial_image.png",
			},
			{
				name:'wall',
				file:"images/magic/wall.png",
			},
			{
				name:'mountain',
				file:"images/magic/mountain.png",
			},
			{
				name:'tower',
				file:"images/magic/tower_2.png",
			},
			{
				name:'arc',
				file:"images/magic/arc.png",
			}
		],
		sounds: [
			{	name: "magic",
			 file: soundsPath + "magic.mp3"},
			{	name: "cut",
			 file: soundsPath + "cut.mp3"},
			{	name: "wrong",
			 file: soundsPath + "wrongAnswer.mp3"},
			{	name: "pop",
			 file: soundsPath + "pop.mp3"},
			{	name: "shoot",
			 file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
			 file: soundsPath + "gameLose.mp3"},
			{	name: "zombieUp",
			 file: soundsPath + "zombieUp.mp3"},
			{	name: "evilLaugh",
			 file: soundsPath + "evilLaugh.mp3"},
			{	name: "explosion",
			 file: soundsPath + "explosion.mp3"},
			{	name: "spaceSong",
			 file: soundsPath + "songs/fantasy_ballad.mp3"},

		],
		spritesheets: [
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
			},
			{
				name:"meteor1",
				file:"images/spines/blueMeteor.png",
				width:63,
				height:77,
				frames:24
			},

			{
				name:"meteor2",
				file:"images/spines/redMeteor.png",
				width:63,
				height:77,
				frames:24
			}
		],
	}

	var lives = null
	var sceneGroup = null
	var UIGroup = null
	var background
	var gameActive = true
	var shoot
	var gameIndex
	var particlesGroup, particlesUsed
	var clouds
	var towersGroup, doorsGroup
	var monster
	var min, plus
	var indexGame
	var sign
	var attack1, attack2
	var tweenTower1, tweenTower2
	var overlayGroup
	var tutorial
	var timeToUse
	var isAddition
	var clock
	var spaceSong
	var buttonsGroup,operationGroup


	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){
		game.stage.backgroundColor = "#ffffff"
		lives = 3
		tutorial=true;
		timeToUse = 15000
		loadSounds()
	}

	function popObject(obj,delay,appear){

		game.time.events.add(delay,function(){
			sound.play("cut")
			if(appear){

				obj.alpha = 1
				game.add.tween(obj.scale).from({x:0, y:0},250,Phaser.Easing.linear,true)
			}else{
				game.add.tween(obj.scale).to({x:0,y:0},250,"Linear",true).onComplete.add(function(){
					obj.scale.setTo(1,1)
					obj.alpha = 0
				})
			}

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

		var pointsText = lookParticle('textPart')
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

	function addPoint(number){

		sound.play("magic")
		pointsBar.number+=number;
		pointsBar.text.setText(pointsBar.number)

		var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		})

		addNumberPart(pointsBar.text,'+' + number,true)		

		if(timeToUse > 1000){
			timeToUse-= 2000
		}

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

		for(var i = 0; i < 2;i++){
			towersGroup.children[i].yogotar.setAnimationByName(0,"losestill",true)
		}

		sound.play("wrong")
		sound.play("gameLose")

		gameActive = false
		spaceSong.stop()

		tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 3000)
		tweenScene.onComplete.add(function(){

			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
			sceneloader.show("result")
		})
	}


	function preload(){
		game.load.spine('yogotar', "images/spines/yogotar.json")  
		game.load.spine('monster',"images/spines/monster.json")
		game.load.spine('sign',"images/spines/power.json")
		game.load.spine('operation',"images/spines/glow.json")
	}

	function createTutorial(){

		overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
		sceneGroup.add(overlayGroup)

		tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)

	}

	function onClickPlay(){
		overlayGroup.y = -game.world.height
		showButtons(true)
	}

	function releaseButton(obj){

		obj.parent.children[1].alpha = 1
	}

	function createBackground(){



		var grass = sceneGroup.create(0,game.world.height,'atlas.magic','grass')
		grass.anchor.setTo(0,1)
		grass.width = game.world.width+200
		grass.scale.setTo(game.world.width+200,1)

		var sky = sceneGroup.create(0,0,'atlas.magic','sky')
		sky.width = game.world.width
		sky.height = game.world.height - grass.height

		sky.scale.setTo(game.world.width*2,1)
		
		
		for(var placeMountains=0; placeMountains<game.world.width;placeMountains+=200){
			var mountains = sceneGroup.create(placeMountains,game.world.centerY-100,'mountain');
			mountains.anchor.setTo(0.5,0.5)
		}
		
		clouds = game.add.tileSprite(0,100,game.world.width,191,'atlas.magic','clouds')
		sceneGroup.add(clouds)

		for(var placeTowers=0; placeTowers<game.world.width;placeTowers+=140){
			var towers = sceneGroup.create(placeTowers+80,game.world.centerY-150,'tower');
			towers.anchor.setTo(0.5,0.5)
		}
		
		for(var placeArcs=0; placeArcs<game.world.width;placeArcs+=133){
			var arcs = sceneGroup.create(placeArcs,game.world.centerY-70,'arc');
			arcs.anchor.setTo(0.5,0.5)
		}

		hand=game.add.sprite(game.world.centerX,game.world.centerY, "hand")
		hand.anchor.setTo(0.5,0.5);
		hand.scale.setTo(1,1);
		hand.animations.add('hand');
		hand.animations.play('hand', 24, true);
		hand.alpha=0;

		//Coins
		coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin");
		coins.anchor.setTo(0.5);
		coins.scale.setTo(0.5);
		coins.animations.add('coin');
		coins.animations.play('coin', 24, true);
		coins.alpha=0;

		minus=game.add.sprite(game.world.centerX,game.world.centerY,'atlas.magic', "minus")
		minus.anchor.setTo(0.5,0.5);
		minus.scale.setTo(0.7,0.7);
		minus.alpha=0;

		plusle=game.add.sprite(game.world.centerX,game.world.centerY,'atlas.magic', "plus")
		plusle.anchor.setTo(0.5,0.5);
		plusle.scale.setTo(0.7,0.7);
		plusle.alpha=0;

		attack1=game.add.sprite(0,0,"meteor1");
		attack1.alpha=0;
		attack1.anchor.setTo(0.5,0.5)
		attack1.scale.setTo(1,1)
		attack1.animations.add('meteor1');

		attack2=game.add.sprite(0,0,"meteor2");
		attack2.alpha=0;
		attack2.anchor.setTo(0.5,0.5)
		attack2.scale.setTo(1,1)
		attack2.animations.add('meteor2');

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

	function update(){

		clouds.tilePosition.x-= 0.4
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

	function createPart(key,obj,offsetX){

		var offX = offsetX || 0
		var particle = lookParticle(key)

		if(particle){

			particle.x = obj.world.x + offX
			particle.y = obj.world.y
			particle.scale.setTo(1,1)
			particle.start(true, 1500, null, 6);

			game.add.tween(particle).to({alpha:0},500,"Linear",true,1000).onComplete.add(function(){
				deactivateParticle(particle,0)
			})
		}
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
			//particle.anchor.setTo(0.5,0.5)
			particle.scale.setTo(1,1)
		}


	}

	function addParticles(){

		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)

		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)

		createParticles('star',3)
		createParticles('text',5)
		createParticles('smoke',1)
		createParticles('brick',3)
		createParticles('brick2',3)

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

		gameActive = false
		sound.play("pop")
		sign.alpha=0;

		if(tutorial){
			tutorial=false;
			createClock()
			hand.alpha=0;
		}
		var tween = game.add.tween(obj.scale).to({x:0.8,y:0.8},100,"Linear",true,0,0)
		if(obj.tag=="minus"){
			game.add.tween(min.scale).to({x:0.8,y:0.8},100,"Linear",true,0,0).yoyo(true,0)
		}
		if(obj.tag=="plus"){
			game.add.tween(plus.scale).to({x:0.8,y:0.8},100,"Linear",true,0,0).yoyo(true,0)
		}

		tween.yoyo(true,0)

		if(clock.tween){

			clock.tween.stop()
		}
		if(isAddition){
			plusle.alpha=1;
			plusle.scale.setTo(0.7,0.7);
		}else{
			minus.alpha=1;
			minus.scale.setTo(0.7,0.7);
		}
		var resultImage = operationGroup.result.children[0]
		if(obj.addition == isAddition){

			Coin(monster,pointsBar,100);
			createPart('star',resultImage);	

			sound.play("zombieUp")


			if(obj.tag=="plus"){
				towersGroup.children[1].yogotar.setAnimationByName(0,"win",false)
				towersGroup.children[1].yogotar.addAnimationByName(0,"idle",true)
				attack2.alpha=1;
				attack2.x=towersGroup.children[1].x-50
				attack2.y=towersGroup.children[1].y-400
				attack2.animations.play('meteor2', 16, true);
				game.add.tween(attack2).to({x:attack2.x-10,y:attack2.y-100},350,Phaser.Easing.Cubic.In,true,0,0).onComplete.add(function(){
					game.add.tween(attack2).to({x:attack2.x-130,y:attack2.y+100},450,Phaser.Easing.Cubic.Out,true,0,0).onComplete.add(function(){
						createPart('smoke',attack2)
						attack2.animations.stop('meteor2');
						attack2.alpha=0;
						attack2.x=towersGroup.children[0].x+50
						attack2.y=towersGroup.children[0].y-400
					})
				})
			}

			if(obj.tag=="minus"){
				towersGroup.children[0].yogotar.setAnimationByName(0,"win",false)
				towersGroup.children[0].yogotar.addAnimationByName(0,"idle",true)
				attack1.alpha=1;
				attack1.x=towersGroup.children[0].x+50
				attack1.y=towersGroup.children[0].y-400
				attack1.animations.play('meteor1', 16, true);
				game.add.tween(attack1).to({x:attack1.x+10,y:attack1.y-100},350,Phaser.Easing.Cubic.In,true,0,0).onComplete.add(function(){

					game.add.tween(attack1).to({x:attack1.x+130,y:attack1.y+100},450,Phaser.Easing.Cubic.Out,true,0,0).onComplete.add(function(){
						createPart('smoke',attack1)
						attack1.animations.stop('meteor1');
						attack1.alpha=0;
						attack1.x=towersGroup.children[0].x+50
						attack1.y=towersGroup.children[0].y-400
					});
				});
			}


			game.time.events.add(1000,function(){
				showButtons(false)
				game.time.events.add(1000,function(){
					showButtons(true)
					game.add.tween(plusle.scale).to({x:0,y:0},100,"Linear",true,0,0)
					game.add.tween(minus.scale).to({x:0,y:0},100,"Linear",true,0,0)
				})
			})

			monster.setAnimationByName(0,"LOSE",false)
			monster.addAnimationByName(0,"IDLE",true)
			if(!tutorial){
				game.add.tween(clock.bar.scale).to({x:clock.bar.origScale},500,"Linear",true)
			}
		}else{

			missPoint()
			createPart('brick', doorsGroup.children[0],-200)
			createPart('brick2', doorsGroup.children[1],250)
			//createPart('smoke',doorsGroup.children[0])
			sound.play("evilLaugh")
			if(!tutorial){
				game.add.tween(clock.bar.scale).to({x:clock.bar.origScale},500,"Linear",true)
			}
			if(lives !== 0){
				var towerText1 = operationGroup.buttons[0];
				var textx1=towerText1.x
				towerText1.x=towerText1.x-50;
				var tweenTowerText1=game.add.tween(towerText1).to({x:towerText1.x+50},100,"Linear",true).yoyo(true).loop(true)
				var towerText2 = operationGroup.buttons[1];
				var textx2=towerText2.x
				towerText2.x=towerText2.x+50;
				var tweenTowerText2=game.add.tween(towerText2).to({x:towerText2.x-50},100,"Linear",true).yoyo(true).loop(true)
				var tower1 = towersGroup.children[0]
				tower1.x=tower1.x-50;
				var tweenTower1=game.add.tween(tower1).to({x:tower1.x+50},100,"Linear",true).yoyo(true).loop(true)
				var tower2 = towersGroup.children[1]
				tower2.x=tower2.x+50;
				var tweenTower2=game.add.tween(tower2).to({x:tower2.x-50},100,"Linear",true).yoyo(true).loop(true)
				for(var i = 0; i < 2;i++){
					towersGroup.children[i].yogotar.setAnimationByName(0,"lose",false)
					towersGroup.children[i].yogotar.addAnimationByName(0,"idle",true)
				}
				game.time.events.add(1000,function(){
					tweenTower1.stop()
					tweenTowerText1.stop()
					tweenTower2.stop()
					tweenTowerText2.stop()
					towerText1.x=textx1;
					towerText2.x=textx2;
					tower1.x=game.world.centerX - 200;
					tower2.x=game.world.centerX + 200;
					showButtons(false)
					game.time.events.add(1000,function(){
						game.add.tween(plusle.scale).to({x:0,y:0},100,"Linear",true,0,0)
						game.add.tween(minus.scale).to({x:0,y:0},100,"Linear",true,0,0)
						showButtons(true)
					})

				})
			}
			else{
				enterMonster()
			}
		}

	}

	function enterMonster(){

		var whiteFade = new Phaser.Graphics(game)
		whiteFade.beginFill(0xffffff)
		whiteFade.drawRect(0,0,game.world.width *2, game.world.height *2)
		whiteFade.alpha = 0
		whiteFade.endFill()
		sceneGroup.add(whiteFade)

		game.add.tween(whiteFade).from({alpha:1},350,"Linear",true)
		game.add.tween(plusle.scale).to({x:0,y:0},100,"Linear",true,0,0)
		game.add.tween(minus.scale).to({x:0,y:0},100,"Linear",true,0,0)
		sound.play("explosion")

		game.add.tween(operationGroup).to({alpha:0},500,"Linear",true)

		//sound.play("evilLaugh")

		game.add.tween(monster).to({y:monster.y + 100},500,"Linear",true)
		monster.setAnimationByName(0,"WIN",false)
		monster.addAnimationByName(0,"WINSTILL",true)

		createPart('smoke',doorsGroup.children[0])
		createPart('smoke',operationGroup.result.text)

		game.add.tween(doorsGroup.children[0]).to({x:game.world.width * 1.5,angle:360,alpha : 0},500,"Linear",true)
		game.add.tween(doorsGroup.children[1]).to({x:-game.world.width * 0.5,angle:-360,alpha :0},500,"Linear",true)

		var tower1 = towersGroup.children[0]
		game.add.tween(tower1).to({angle:-90},500,"Linear",true)

		var tower1 = towersGroup.children[1]
		game.add.tween(tower1).to({angle:90},500,"Linear",true)
	}

	function createCastle(){

		var backTower = game.add.tileSprite(0,game.world.height - 280,game.world.width,162,'wall')
		backTower.anchor.setTo(0,1)
		sceneGroup.add(backTower)

		monster = game.add.spine(game.world.centerX, backTower.y - 25,'monster')
		monster.setSkinByName('normal')
		monster.setAnimationByName(0,"IDLE",true)
		sceneGroup.add(monster)

		towersGroup = game.add.group()
		sceneGroup.add(towersGroup)

		var yogoSkins = ['arthurius','theffanie']
		var pivotX = game.world.centerX - 200
		for(var i = 0; i < 2;i++){

			var tower = game.add.group()
			tower.x = pivotX
			tower.y = game.world.height - 300
			towersGroup.add(tower)

			var yogotar = game.add.spine(0,-290,'yogotar')
			yogotar.setSkinByName(yogoSkins[i])
			yogotar.setAnimationByName(0,"idle",true)
			tower.add(yogotar)
			tower.yogotar = yogotar

			if(i == 1){
				yogotar.scale.x*=-1
			}

			var towerImage = tower.create(0,20,'atlas.magic','tower')
			towerImage.anchor.setTo(0.5,1)

			pivotX+= 400

		}

		doorsGroup = game.add.group()
		doorsGroup.x = game.world.centerX
		doorsGroup.y = backTower.y
		sceneGroup.add(doorsGroup)


		var door = doorsGroup.create(0,0,'atlas.magic','gate')
		door.anchor.setTo(0,1)

		var door = doorsGroup.create(0,0,'atlas.magic','gate')
		door.anchor.setTo(0,1)
		door.scale.x*=-1
	}

	function createButtons(){

		buttonsGroup = game.add.group()
		sceneGroup.add(buttonsGroup)

		var addition = true
		for(var i = 0; i < 2; i++){

			var image = buttonsGroup.create(game.world.centerX-260*i,game.world.height-110,'atlas.magic','button' + (i+1))
			image.alpha = 0
			image.anchor.setTo(0.5,0.5)
			image.inputEnabled = true
			image.tag= i==0 ? image.tag="plus" : image.tag="minus";
			image.events.onInputDown.add(inputButton)
			image.addition = addition
			addition = !addition
		}
		buttonsGroup.x+=130
		min = game.add.spine(game.world.centerX - 257 ,game.world.height - 105,'operation')
		min.alpha = 0
		min.setSkinByName('normal')
		min.setAnimationByName(0,"idle_less",true)
		buttonsGroup.add(min)

		plus = game.add.spine(game.world.centerX -5 ,game.world.height - 105,'operation')
		plus.alpha = 0
		plus.setSkinByName('normal')
		plus.setAnimationByName(0,"idle_more",true)
		buttonsGroup.add(plus)
	}
	function createOperations(){
		operationGroup = game.add.group()
		sceneGroup.add(operationGroup)

		operationGroup.buttons = []
		var pivotX = towersGroup.children[0].x
		for(var i = 0; i < 2; i++){
			var cont = game.add.group()
			cont.x = pivotX
			cont.y = game.world.centerY
			cont.alpha = 0
			operationGroup.add(cont)
			operationGroup.buttons[i] = cont
			var imageCont = cont.create(0,0,'atlas.magic','container')
			imageCont.anchor.setTo(0.5,0.5)
			var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
			var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
			pointsText.anchor.setTo(0.5,0.5)
			cont.add(pointsText)
			cont.text = pointsText
			cont.number = 0
			pivotX+= 400
		}

		sign = game.add.spine(game.world.centerX,game.world.centerY,"sign")
		sign.setSkinByName('normal')
		sign.setAnimationByName(0,"IDLE",true)
		operationGroup.add(sign)
		operationGroup.sign = sign

		sign.alpha = 0

		var resultGroup = game.add.group()
		resultGroup.x = game.world.centerX
		resultGroup.y = game.world.centerY + 150
		operationGroup.add(resultGroup)

		var resultImage = resultGroup.create(0,0,'atlas.magic','result_container')
		resultImage.anchor.setTo(0.5,0.5)

		var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, -23, 0, "=", fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		resultGroup.add(pointsText)
		var fontStyle = {font: "55px VAGRounded", fontWeight: "bold", fill: "#422910", align: "center"}
		var pointsText2 = new Phaser.Text(sceneGroup.game, 23, 0, "0", fontStyle)
		pointsText2.anchor.setTo(0.5,0.5)
		resultGroup.add(pointsText2)

		resultGroup.equal = pointsText
		resultGroup.text = pointsText2
		operationGroup.result = resultGroup

		resultGroup.alpha = 0

	}

	function createClock(){

		clock = game.add.group()
		clock.x = game.world.centerX
		clock.y = 80
		clock.alpha = 0
		sceneGroup.add(clock)

		var clockImage = clock.create(0,0,'atlas.magic','clock')
		clockImage.anchor.setTo(0.5,0.5)

		var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.magic','bar')
		clockBar.anchor.setTo(0,0.5)
		clockBar.width = clockImage.width*0.76
		clockBar.height = 22
		clockBar.origScale = clockBar.scale.x

		clock.bar = clockBar

	}

	function showButtons(appear){

		var delay = 0
		for(var i = 0; i < buttonsGroup.length;i++){

			var button = buttonsGroup.children[i]
			if(appear){
				popObject(button,delay,appear)
			}else{
				popObject(button,delay,appear)
			}

			delay+= 100

		}

		for(var i = 0; i < operationGroup.length;i++){

			var button = operationGroup.children[i]
			if(appear){
				popObject(button,delay,appear)
			}else{
				popObject(button,delay,appear)
			}

			delay+= 100

		}

		if(appear){

			setOperation()

			game.time.events.add(delay,function(){
				gameActive = true

				if(!tutorial)popObject(clock,0,true)
				if(!tutorial){
					var tween = game.add.tween(clock.bar.scale).to({x:0},timeToUse,"Linear",true)

					tween.onComplete.add(function(){
						if(isAddition){
							plusle.alpha=1;
							plusle.scale.setTo(0.7,0.7);
						}else{
							minus.alpha=1;
							minus.scale.setTo(0.7,0.7);
						}
						sign.alpha=0;
						missPoint()
						//createPart('smoke',doorsGroup.children[0])
						sound.play("evilLaugh")
						if(!tutorial){
							game.add.tween(clock.bar.scale).to({x:clock.bar.origScale},500,"Linear",true)
						}
						if(lives!== 0){
							createPart('brick', doorsGroup.children[0],-200)
							createPart('brick2', doorsGroup.children[1],200)
							var towerText1 = operationGroup.buttons[0];
							var textx1=towerText1.x
							towerText1.x=towerText1.x-50;
							var tweenTowerText1=game.add.tween(towerText1).to({x:towerText1.x+50},100,"Linear",true).yoyo(true).loop(true)
							var towerText2 = operationGroup.buttons[1];
							var textx2=towerText2.x
							towerText2.x=towerText2.x+50;
							var tweenTowerText2=game.add.tween(towerText2).to({x:towerText2.x-50},100,"Linear",true).yoyo(true).loop(true)
							var tower1 = towersGroup.children[0]
							tower1.x=tower1.x-50;
							tweenTower1=game.add.tween(tower1).to({x:tower1.x+50},100,"Linear",true).yoyo(true).loop(true)
							var tower2 = towersGroup.children[1]
							tower2.x=tower2.x+50;
							tweenTower2=game.add.tween(tower2).to({x:tower2.x-50},100,"Linear",true).yoyo(true).loop(true)

							for(var i = 0; i < 2;i++){
								towersGroup.children[i].yogotar.setAnimationByName(0,"lose",false)
								towersGroup.children[i].yogotar.addAnimationByName(0,"idle",true)
							}
							game.time.events.add(1000,function(){
								tweenTower1.stop()
								tweenTower2.stop()
								tweenTowerText1.stop()
								tweenTowerText2.stop()
								towerText1.x=textx1;
								towerText2.x=textx2;
								tower1.x=game.world.centerX - 200;
								tower2.x=game.world.centerX + 200;
								game.add.tween(plusle.scale).to({x:0,y:0},100,"Linear",true,0,0)
								game.add.tween(minus.scale).to({x:0,y:0},100,"Linear",true,0,0)
								showButtons(false)
								game.time.events.add(1000,function(){
									showButtons(true)
								})

							})
						}
						else{
							enterMonster()
						}
					})
				}

				if(!tutorial)clock.tween = tween
			})
		}else{

			game.add.tween(clock).to({alpha:0},500,"Linear",true)
		}
	}

	function setOperation(){

		var number1 = game.rnd.integerInRange(2,9)
		var number2 = game.rnd.integerInRange(1,9)
		var result = number1 + number2


		isAddition = true


		if(Math.random()*2 > 1){

			isAddition = false
			number2 = game.rnd.integerInRange(1,number1 - 1)

			result = number1 - number2
		}
		if(tutorial && isAddition){
			hand.alpha=1;
			minus.scale.setTo(0.7,0.7);
			hand.x=plus.x+150;
			hand.y=plus.y;
			buttonsGroup.children[1].inputEnabled=false;
		}else if(tutorial && !isAddition){
			hand.alpha=1;
			plusle.scale.setTo(0.7,0.7);
			hand.x=min.x+150;
			hand.y=min.y;
			buttonsGroup.children[0].inputEnabled=false;
		}else{
			buttonsGroup.children[0].inputEnabled=true;
			buttonsGroup.children[1].inputEnabled=true;
		}
		operationGroup.buttons[0].text.setText(number1)
		operationGroup.buttons[1].text.setText(number2)

		operationGroup.result.equal.setText('=')
		operationGroup.result.text.setText(result)

	}

	return {

		assets: assets,
		name: "magicGate",
		update: update,
		preload:preload,
		create: function(event){

			sceneGroup = game.add.group(); 
			yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

			createBackground()
			createCastle()
			createOperations()
			createButtons()
			addParticles()

			spaceSong = game.add.audio('spaceSong')
			game.sound.setDecodedCallback(spaceSong, function(){
				spaceSong.loopFull(0.6)
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

			buttons.getButton(spaceSong,sceneGroup)
			createTutorial()

			animateScene()

		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()