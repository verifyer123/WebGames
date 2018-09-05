
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var elemental = function(){

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
				name: "atlas.elemental",
				json: "images/elemental/atlas.json",
				image: "images/elemental/atlas.png",
			},

		],
		images: [
			{
				name: "dock",
				file: "images/elemental/dock.png",
			},
			{
				name:'tutorial_image',
				file:"images/elemental/tutorial_image.png"
			}
		],
		sounds: [
			{	name: "magic",
			 file: soundsPath + "magic.mp3"},
			{	name: "wrong",
			 file: soundsPath + "wrongAnswer.mp3"},
			{	name: "right",
			 file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
			 file: soundsPath + "pop.mp3"},
			{	name: "glassbreak",
			 file: soundsPath + "glassbreak.mp3"},
			{	name: "robotBeep",
			 file: soundsPath + "robotBeep.mp3"},
			{	name: "gameLose",
			 file: soundsPath + "gameLose.mp3"},
			{	name: "battleSong",
			 file: soundsPath + "songs/battleSong.mp3"},
			{	name: "laugh",
			 file: soundsPath + "alienLaugh.mp3"}
		],
		spritesheets: [
			{   name: "coin",
			 file: "images/spines/coin.png",
			 width: 122,
			 height: 123,
			 frames: 12
			},
			{   name: "hand",
			 file: "images/spines/hand.png",
			 width: 115,
			 height: 111,
			 frames: 23
			},
			{   name: "IDLE",
			 file: "images/spines/witch/IDLE.png",
			 width: 240,
			 height: 287,
			 frames: 48
			},
			{   name: "ATTACK",
			 file: "images/spines/witch/ATTACK.png",
			 width: 329,
			 height: 300,
			 frames: 22
			},
			{   name: "LOSE",
			 file: "images/spines/witch/LOSE.png",
			 width: 262,
			 height: 365,
			 frames: 9
			},
			{   name: "HIT",
			 file: "images/spines/witch/HIT.png",
			 width: 260,
			 height: 294,
			 frames: 24
			},
			{   name: "LOSESTILL",
			 file: "images/spines/witch/LOSESTILL.png",
			 width: 260,
			 height: 273,
			 frames: 20
			},
		],
		spines:[
			{
				name:"fire",
				file:"images/spines/MaskFire/mask_fire.json"
			},
			{
				name:"aqua",
				file:"images/spines/MaskWater/mask_water.json"
			},
			{
				name:"ice",
				file:"images/spines/MaskIce/mask_ice.json"
			},
			{
				name:"wind",
				file:"images/spines/MaskWind/mask_air.json"
			},
		]
	}

	var lives = null
	var sceneGroup = null
	var gameActive
	var gameIndex = 104
	var overlayGroup
	var pointsBar
	var index
	var coinsGroup
	var heartsGroup
	var maskSelected;
	var idleAnimation;
	var battleSong
	var positionList=[];
	var coin
	var enemysInLine
	var hand
	var witch
	var goalMask
	var gemsGroup
	var enemiesGroup
	var level
	var speed0
	var offsetX
	var weves

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		game.stage.backgroundColor = "#ffffff"
		lives = 3
		level = 1
		index = 0;
		maskSelected=game.rnd.integerInRange(0,3);
		enemysInLine=1
		goalMask=0;
		speed = 100
		offsetX=-160;
		loadSounds()
		for(var pos=0; pos<4; pos++){
			positionList[pos]=game.world.centerX+offsetX;
			offsetX+=110;
		}
	}

	function missPoint(obj){

		sound.play("wrong")

		particleWrong.x = obj.centerX 
		particleWrong.y = obj.centerY
		particleWrong.start(true, 1200, null, 10)

		lives--;
		heartsGroup.text.setText('X ' + lives)

		var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		})

		if(lives == 0){
			stopGame()
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
	}

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.elemental','xpcoins')
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

		var heartImg = group.create(0,0,'atlas.elemental','life_box')

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
		battleSong.stop()
		game.time.events.add(100, witchAnim, this, "LOSESTILL");
		tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 1000, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){

			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
			sceneloader.show("result")
		})
	}    

	function preload(){

		game.stage.disableVisibilityChange = false
	}

	function createOverlay(){

		overlayGroup = game.add.group()
		sceneGroup.add(overlayGroup)

		tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
	}

	function onClickPlay(){
		coinsGroup= new Phaser.Group(game)
		sceneGroup.add(coinsGroup)
		coinsGroup.add(coin)
		overlayGroup.y = -game.world.height
		initTutorial()
	}

	function releaseButton(obj){
		obj.parent.children[1].alpha = 1
	}

	function createBackground(){

		var back = sceneGroup.create(0, 0, "atlas.elemental", "background");
		back.width = game.world.width
		back.height = game.world.height

		weves = game.add.tileSprite(0, 0, game.world.width * 2, game.world.height, "atlas.elemental", 'wave')
		weves.anchor.setTo(0, 0)
		weves.aux = 0
		sceneGroup.add(weves)

		var dock = game.add.sprite(game.world.centerX, game.world.centerY, "dock")
		dock.anchor.setTo(0.5)

		var tree1 = sceneGroup.create(game.world.centerX - dock.width * 0.58, 2, "atlas.elemental",  "tree1")
		var tree2 = sceneGroup.create(game.world.centerX + dock.width * 0.35, 2, "atlas.elemental",  "tree2")
		var tree3 = sceneGroup.create(game.world.centerX + dock.width * 0.36, dock.y - 150, "atlas.elemental",  "tree3")

		sceneGroup.add(dock)
	}

	function update(){

		if(gameActive){

			game.physics.arcade.overlap(witch.box, enemiesGroup, getDamage, null, this)
			game.physics.arcade.overlap(gemsGroup, enemiesGroup, hitEnemy, null, this)
		}

		weves.aux += 0.005
		weves.tileScale.x = 2 + Math.sin(weves.aux)
		weves.tileScale.y = 2 + Math.cos(weves.aux)
	}

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);

		particle.makeParticles('atlas.elemental', key);
		particle.minParticleSpeed.setTo(-200, -50);
		particle.maxParticleSpeed.setTo(200, -100);
		particle.minParticleScale = 0.6;
		particle.maxParticleScale = 1;
		particle.gravity = 150;
		particle.angularDrag = 30;

		return particle
	}

	function createParticles(){
		particleCorrect = createPart('star')
		sceneGroup.add(particleCorrect)

		particleWrong = createPart('smoke')
		sceneGroup.add(particleWrong)

		particleHit = createPart('spark')
		sceneGroup.add(particleHit)
	}

	function createCoin(){

		coin = game.add.sprite(0, 0, "coin")
		coin.anchor.setTo(0.5)
		coin.scale.setTo(0.8)
		coin.animations.add('coin');
		coin.animations.play('coin', 24, true);
		coin.alpha = 0

		hand = game.add.sprite(0, 0, "hand")
		hand.animations.add('hand')
		hand.animations.play('hand', 24, true)
		hand.alpha = 0

	}

	function getCoins(player){
		var coin=coinsGroup.getFirstDead();

		if(coin==undefined){
			game["coin"+index] = game.add.sprite(player.x, player.y, "coin")
			game["coin"+index].anchor.setTo(0.5,0.5)
			game["coin"+index].scale.setTo(0.8,0.8)
			game["coin"+index].animations.add('coin')
			game["coin"+index].animations.play('coin', 24, true)
			game["coin"+index].alpha = 0
			coinsGroup.add(game["coin"+index])
			coin=game["coin"+index];
			index++;
			addCoin(coin,player)
		}else{
			addCoin(coin,player)
		}
	}

	function addCoin(coin,obj){

		if(coin.motion)
			coin.motion.stop()

		var time=300;

		particleCorrect.x = obj.centerX 
		particleCorrect.y = obj.centerY
		particleCorrect.start(true, 1200, null, 10)

		coin.reset(obj.centerX,obj.centerY);

		game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)

		coin.motion = game.add.tween(coin).to({y:coin.y - 100}, time+200, Phaser.Easing.Cubic.InOut,true)
		coin.motion.onComplete.add(function(){
			coin.motion = game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true)
			coin.motion.onComplete.add(function(){
				coin.motion = game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true)
				coin.motion.onComplete.add(function(){
					addPoint(1);
					if(pointsBar.number > 0 && pointsBar.number % 5 == 0){
						level < 3 ? level++ : level = 3
					}
					if(pointsBar.number > 0 && pointsBar.number % 2 == 0){
						speed < 600 ? speed += 10 : speed = 600
					}
					coin.kill();
				})
			})
		})
	}

	function createWitch(){

		witch = game.add.sprite(game.world.centerX, 150, 'IDLE')
		witch.anchor.setTo(0.5)
		witch.animations.add('IDLE', null, 24, true)
		witch.animations.add('ATTACK', null, 24)
		witch.animations.add('LOSESTILL', null, 24,true)
		witch.animations.add('HIT', null, 24)
		witch.animations.add('LOSE', null, 24)
		witch.canAttack = false
		sceneGroup.add(witch)

		witch.play('IDLE')

		var box = sceneGroup.create(game.world.centerX, 150, 'atlas.elemental', "background");
		box.anchor.setTo(0.5, 0.5)
		box.scale.setTo(2.5, 0.2)
		box.alpha = 0
		game.physics.arcade.enable(box)
		box.body.immovable = true
		witch.box = box
	}

	function witchAnim(anim){

		switch(anim){

			case 'IDLE':
				witch.loadTexture('IDLE', 0, true)
				witch.play('IDLE')
				break

				case 'ATTACK':
				witch.loadTexture('ATTACK', 0, true)
				witch.play('ATTACK')
				break

				case 'LOSESTILL':
				witch.loadTexture('LOSESTILL', 0, true)
				witch.play('LOSESTILL')
				break

				case 'HIT':
				witch.loadTexture('HIT', 0, true)
				witch.play('HIT')
				break

				case 'LOSE':
				witch.loadTexture('LOSE', 0, true)
				witch.play('LOSE')
				break
		}
	}

	function createGems(){

		gemsGroup = game.add.group()
		gemsGroup.enableBody = true
		gemsGroup.physicsBodyType = Phaser.Physics.ARCADE
		sceneGroup.add(gemsGroup)  

		var pivotX = 0.54
		var pivotY = 0

		for(var i = 0; i < 4; i ++){

			var gem = gemsGroup.create(game.world.centerX * pivotX, witch.y + pivotY, "atlas.elemental", "gem" + i)
			gem.anchor.setTo(0.5)
			gem.scale.setTo(0)
			gem.element = i
			gem.inputEnabled = true
			gem.isShot = false
			gem.events.onInputDown.add(shotTuto, this)

			gem.floating = game.add.tween(gem).to({y:gem.y + 20}, 2000, Phaser.Easing.Cubic.InOut, false, 0, -1, true)

			if(i == 0 || i == 1)
				pivotY = 150
			else
				pivotY = 0

			if(i == 0 || i == 2)
				pivotX += 0.25
			else
				pivotX += 0.45
		}

		gemsGroup.setAll("inputEnabled", false)
	}

	function createEnemies(){

		enemiesGroup = game.add.group()
		enemiesGroup.enableBody = true
		enemiesGroup.physicsBodyType = Phaser.Physics.ARCADE
		sceneGroup.add(enemiesGroup)  

		for(var i = 0; i < 4; i++){

			var box = enemiesGroup.create(0, 0, "atlas.elemental", "body")
			box.anchor.setTo(0.5)
			box.healtPoints = 0
			box.element = i
			box.touch = false
			box.exists = false
			box.visible = false
			enemiesGroup.add(box)

			var anim = game.add.spine(0, 180, assets.spines[i].name)
			anim.setAnimationByName(0, "idle", true)
			anim.setSkinByName("normal")
			box.addChild(anim)
			box.anim = anim

			var shield = game.add.sprite(0, -120, "atlas.elemental", "broken" + i)
			shield.anchor.setTo(0.5)
			shield.alpha = 0
			anim.addChild(shield)
			box.shield = shield
		}

		enemiesGroup.children[1].shield.y -= 20
	}

	function shotGem(gem){

		if(gameActive && witch.canAttack){

			gem.isShot = true
			witch.canAttack = false
			witchAnim('ATTACK')
			idleAnimation=game.time.events.add(700,function(){
				if(lives>0)witchAnim("IDLE")
			})
			for(var checkMask=0; checkMask<enemiesGroup.length; checkMask++){
				if(enemiesGroup.children[checkMask].exists && enemiesGroup.children[checkMask].element==gem.element && !enemiesGroup.children[checkMask].touch){
					var mask=enemiesGroup.children[checkMask];
				}
			}
			if(mask){
				particleHit.x = witch.centerX+50 
				particleHit.y = witch.centerY+150
				particleHit.start(true, 1200, null, 10)
				gem.floating.pause()
				sound.play("robotBeep")
				game.add.tween(gem).to({x:mask.x, y:mask.y}, 300, Phaser.Easing.Cubic.InOut, true, 0, 0, true).onComplete.add(function(){
					gem.floating.resume()
					gem.isShot = false
					if(mask.healtPoints > 0){
						mask.touch = false
					}
				})
			}else{
				sound.play("laugh")
				particleWrong.x = witch.centerX+50 
				particleWrong.y = witch.centerY+150
				particleWrong.start(true, 1200, null, 2)
				for(var checkMask=0; checkMask<enemiesGroup.length; checkMask++){
					if(enemiesGroup.children[checkMask].exists && enemiesGroup.children[checkMask].healtPoints > 0){
						enemiesGroup.children[checkMask].anim.setAnimationByName(0, "win", false).onComplete=function(){
							for(var idleMask=0; idleMask<enemiesGroup.length; idleMask++){
								if(enemiesGroup.children[idleMask].exists && enemiesGroup.children[idleMask].healtPoints > 0){
									enemiesGroup.children[idleMask].anim.setAnimationByName(0, "idle", true)
								}
							}
						}
					}
				}
				witch.canAttack = true;
			}
		}
	}


	function hitEnemy(gem, mask){

		if(!mask.touch && gameActive && gem.isShot){
			if(gem.element === mask.element && mask.healtPoints>0){
				mask.touch = true
				gem.isShot=false;
				mask.body.velocity.y = 0
				mask.healtPoints--
				setDamage(mask)
			}
		}
	}

	function setDamage(mask){


		switch(mask.healtPoints){

			case 0:
				sound.play("right")
				console.log(goalMask)
				if(goalMask==0){
					witch.canAttack = false	
				}else{
					witch.canAttack = true
				}
				getCoins(mask)
				goalMask--
				mask.anim.setAnimationByName(0, "lose", false).onComplete = function(){
					mask.kill()

					if(goalMask<=0 && lives>0)game.time.events.add(500, initGame)
				}
				break
				case 1:
				sound.play("glassbreak")
				mask.shield.alpha = 0
				game.add.tween(mask).to({y: mask.y + 100}, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
					mask.body.velocity.y = -speed
					mask.touch = false
					witch.canAttack = true;
				})
				break

				case 2:
				sound.play("glassbreak")
				mask.shield.loadTexture("atlas.elemental", "broken" + mask.element)
				game.add.tween(mask).to({y: mask.y + 100}, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
					mask.body.velocity.y = -speed
					mask.touch = false
					witch.canAttack = true;
				})
				break
		}
	}

	function getDamage(witch, mask){

		if(!mask.touch && gameActive){

			gemsGroup.setAll("inputEnabled", false)
			mask.touch = true
			mask.body.velocity.y = 0
			witch.canAttack = false
			game.add.tween(mask).to({x:game.world.centerX, y: -200}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
				mask.kill()
				witch.canAttack = true
			})
			if(lives > 1){
				witchAnim("HIT")
				missPoint(witch)
				goalMask--;
				game.time.events.add(600, witchAnim, this, "IDLE")
				if(goalMask==0)game.time.events.add(1000, initGame)
			}
			else if(lives == 1){

				gemsGroup.setAll("inputEnabled", false)
				if(idleAnimation)idleAnimation.clearEvents=true;
				game.time.events.add(100, witchAnim, this, "LOSESTILL");
				missPoint(witch)
			}
		}
	}

	function initGame(){

		gemsGroup.setAll("inputEnabled", true)
		gameActive = true
		throwMask()
	}
	function randomPlacesinX(position){
		var positionX=positionList[position];
		return positionX
	}
	function throwMask(){

		var mask = enemiesGroup.getRandom()
		Phaser.ArrayUtils.shuffle(enemiesGroup.children)
		Phaser.ArrayUtils.shuffle(positionList)
		console.log(positionList)
		if(pointsBar.number%5==0 && pointsBar.number!=0 && pointsBar.number!=1 && enemysInLine<3){
			enemysInLine++;
		}
		goalMask=enemysInLine;
		for(var enemysToRelease=0; enemysToRelease<enemysInLine; enemysToRelease++){
			mask=enemiesGroup.children[enemysToRelease].reset();
			if(enemysInLine==2){
				mask.scale.setTo(0.9,0.9)
			}else if(enemysInLine>=2){
				mask.scale.setTo(0.7,0.7)
			}
			if(mask){
				if(level === 2){
					mask.shield.loadTexture("atlas.elemental", "broken" + mask.element)
					mask.shield.alpha = 1
				}
				else if(level === 3){
					mask.shield.loadTexture("atlas.elemental", "shield" + mask.element)
					mask.shield.alpha = 1
				}
				var rand = game.rnd.realInRange(0.45, 1.3)
				mask.anim.setAnimationByName(0, "idle", true)
				mask.healtPoints = level
				mask.touch = false
				mask.reset(randomPlacesinX(enemysToRelease), game.world.height + 150)
				mask.body.velocity.y = -speed
				witch.canAttack = true
			}
		}
	}
	function initTutorial(){

		var pivotX = 0.45
		var show

		for(var i = 0; i < 1; i++){
			var mask = enemiesGroup.children[maskSelected]

			if(mask){

				mask.anim.setAnimationByName(0, "idle", true)
				mask.healtPoints = level
				mask.touch = false
				mask.reset(game.world.centerX, game.world.height + 150)
				show = game.add.tween(mask).to({y: game.world.height - 250}, game.rnd.integerInRange(800, 1300), Phaser.Easing.linear, true)

				pivotX += 0.35
			}
		}

		var delay = 200

		show.onComplete.add(function(){

			for(var i = 0; i < 4; i++){

				popObject(gemsGroup.children[i], delay)
				delay += 200
			}

			game.time.events.add(delay, posHand, this, 0)
		})
	}

	function popObject(obj,delay){

		game.add.tween(obj.scale).to({x:1.2, y:1.2}, 200, Phaser.Easing.linear, true, delay).onComplete.add(function(){
			sound.play("pop")
			obj.floating.start()
		})
	}

	function posHand(pos){

		gemsGroup.setAll("inputEnabled", false)
		witch.canAttack = true

		if(pos < 1){
			hand.x = gemsGroup.children[maskSelected].x
			hand.y = gemsGroup.children[maskSelected].y
			game.add.tween(hand).to({alpha: 1}, 200, Phaser.Easing.linear, true)
			gemsGroup.children[maskSelected].inputEnabled = true
		}
		else{
			witch.canAttack = false
			hand.destroy()
			gemsGroup.forEach(function(gem){
				gem.inputEnabled = true
				gem.events.onInputDown.add(shotGem, this)
			}, this)
			initGame()
		}
	}

	function shotTuto(gem){

		if(gameActive)
			return

			gem.inputEnabled = false
		hand.alpha = 0
		witchAnim('ATTACK')
		game.time.events.add(700, witchAnim, this, "IDLE")

		var taget = enemiesGroup.getFirstExists()

		if(taget){
			particleHit.x = witch.centerX+50 
			particleHit.y = witch.centerY+150
			particleHit.start(true, 1200, null, 10)
			gem.floating.pause()
			sound.play("robotBeep")
			game.add.tween(gem).to({x:taget.x, y:taget.y}, 300, Phaser.Easing.Cubic.InOut, true, 0, 0, true).onComplete.add(function(){
				gem.floating.resume()

				sound.play("right")
				particleCorrect.x = taget.centerX 
				particleCorrect.y = taget.centerY
				particleCorrect.start(true, 1200, null, 10)
				taget.anim.setAnimationByName(0, "lose", false).onComplete = function(){
					taget.kill()
					posHand(gem.element + 1)
				}
			})
		}
	}

	return {

		assets: assets,
		name: "elemental",
		update: update,
		preload: preload,
		getGameData:function () { 
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){

			sceneGroup = game.add.group()

			createBackground()
			initialize()

			battleSong = sound.play("battleSong", {loop:true, volume:0.6})

			game.onPause.add(function(){
				game.sound.mute = true
			} , this)

			game.onResume.add(function(){
				game.sound.mute = false
			}, this)

			createPointsBar()
			createHearts()
			createWitch()
			createGems()
			createEnemies()
			createCoin()
			createParticles()

			buttons.getButton(battleSong,sceneGroup)
			createOverlay()

		}
	}
}()