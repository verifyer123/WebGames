var soundsPath = "../../shared/minigames/sounds/"

var frootAndFloat = function(){

	var localizationData = {
		"EN":{
			"language":"en",
			"assetReady":"readyEn",
			"assetGo":"goEn",
			"assetExcellent":"excEn",
			"assetGiveUp":"giveUpEn"
		},

		"ES":{
			"languague":"es",
			"assetReady":"readyEs",
			"assetGo":"goEs",
			"assetExcellent":"excEs",
			"assetGiveUp":"giveUpEs",

		}
	}


	assets = {
		atlases: [
			{   
				name: "atlas.float",
				json: "images/float/atlas.json",
				image: "images/float/atlas.png",
			},

		],
		images: [
			{   name:"tutorial_image",
			 file: "images/float/tutorial_image.png"},
		],
		sounds: [
			{	name: "explode",
			 file: soundsPath + "laserexplode.mp3"},
			{	name: "cut",
			 file: soundsPath + "cut.mp3"},
			{	name: "wrong",
			 file: soundsPath + "wrong.mp3"},
			{	name: "magic",
			 file: soundsPath + "magic.mp3"},
			{	name: "pop",
			 file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
			 file: soundsPath + "gameLose.mp3"},
			{	name: "spaceSong",
			 file: soundsPath + "songs/classic_videogame_loop_2.mp3"},
		],
		spines:[
			{
				name: "yogotar",
				file: "images/spines/sam.json"
			}
		],
		spritesheets:[
			{   name: "coin",
			 file: "images/spines/coins.png",
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
		]
	}

	var SPEED = 7

	var colorsToUse = [0x35F935,0xF935BE,0xF9EC35, 0xff5555, 0x7755bb, 0xFF6700]

	var gameIndex = 193
	var gameLevel = null
	var spaceSong = null
	var coinsGroup = null
	var timeAdd = null
	var levelNumber = 0
	var orderList = null
	var moveSpeed
	var hand, coins
	var lastObj
	var tutorial
	var sceneGroup = null
	var answersGroup = null
	var linesGroup = null
	var index
	var jumpDistance
	var gameGroup
	var gameSpeed
	var lives
	var gameActive = true
	var pointsBar = null
	var jumpTimes = 0
	var lives = null
	var heartsGroup = null
	var buddy = null    
	var playerGroup
	var particlesGroup, particlesUsed
	var background, background2
	var counter
	var numIndex, lineIndex

	var directionLeft
	var deltaMoveSpeed
	var maxMoveSpeed

	var canTake

	var porcentage_change = 2.7//2.3

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		game.stage.backgroundColor = "#ffffff"
		gameActive = false
		lives = 3
		jumpTimes = 0
		index=0
		tutorial = true
		jumpDistance = 170
		gameSpeed = 1.5
		moveSpeed = 2.1
		maxMoveSpeed = 3

		deltaMoveSpeed = 0.05
		gameLevel = 1
		loadSounds()
		levelNumber = 1
		numIndex = 1
		lineIndex = numIndex-1

		directionLeft = true
		canTake = true

	}

	function animateScene() {
		sceneGroup.alpha = 0
		game.add.tween(sceneGroup).to({alpha:1},1000, Phaser.Easing.Cubic.Out,true)
	}

	function lookParticle(key){
		for(var i = 0;i<particlesGroup.length;i++){
			var particle = particlesGroup.children[i]
			//console.log(particle.tag + ' tag,' + particle.used)
			if(particle.tag == key){
				particle.used = true
				particle.alpha = 1
				if(key == 'text'){
					particlesGroup.remove(particle)
					particlesUsed.add(particle)
				}
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
			//game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
			//game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
			particle.start(true, 1500, null, 6);+
				particle.setAlpha(1,0,2000,Phaser.Easing.Cubic.In)

			/*game.add.tween(particle).to({alpha:0},500,"Linear",true,1000).onComplete.add(function(){
				deactivateParticle(particle,0)
			})*/

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

				particle.makeParticles('atlas.float',tag);
				particle.minParticleSpeed.setTo(-400, -100);
				particle.maxParticleSpeed.setTo(400, -200);
				particle.minParticleScale = 0.6;
				particle.maxParticleScale = 1;
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

		createParticles('star',1)
		//createParticles('wrong',1)
		createParticles('text',5)
		createParticles('smoke',1)

	}

	function setExplosion(obj,offsetY){

		sound.play("explode")
		var offY = offsetY || 0

		var exp = sceneGroup.create(0,0,'atlas.float','explosion')
		exp.x = obj.world.x
		exp.y = obj.world.y + offY
		exp.anchor.setTo(0.5,0.5)

		exp.scale.setTo(6,6)
		game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
		var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)

		starParticles(obj,'smoke')
	}

	function starParticles(obj,idString){

		particlesNumber = 8

		var particlesGood = game.add.emitter(0, 0, 100);

		particlesGood.makeParticles('atlas.float',idString);
		particlesGood.minParticleSpeed.setTo(-200, -50);
		particlesGood.maxParticleSpeed.setTo(200, -100);
		particlesGood.minParticleScale = 0.6;
		particlesGood.maxParticleScale = 0.8;
		particlesGood.gravity = 150;
		particlesGood.angularDrag = 30;

		particlesGood.x = obj.world.x;
		particlesGood.y = obj.world.y- 25;
		particlesGood.start(true, 1000, null, particlesNumber);

		game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
		sceneGroup.add(particlesGood)

	}

	function missPoint(){

		sound.play("wrong")
		setExplosion(playerGroup.gem)
		starParticles(playerGroup.gem,'smoke')
		playerGroup.anim.setAnimationByName(0,"lose",false)
		playerGroup.anim.addAnimationByName(0,"losestill",true)
		gameActive = false

		if(lives > 0)
			lives--;

		heartsGroup.text.setText('X ' + lives)

		var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		})

		if(lives > 0){
			game.time.events.add(2000, restartGame)
		}
		else{
			stopGame()
		}

		addNumberPart(heartsGroup.text,'-1',true)

	}

	function stopGame(){

		spaceSong.stop()

		gameActive = false
		sound.play("gameLose")

		setExplosion(playerGroup.gem)
		playerGroup.anim.setAnimationByName(0,"lose",false)
		playerGroup.anim.addAnimationByName(0,"losestill",true)

		if(lives > 0)
			lives--
		heartsGroup.text.setText('X ' + lives)

		tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2000)
		tweenScene.onComplete.add(function(){

			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true,pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
			sceneloader.show("result")
		})

	}

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.float','xpcoins')
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

		var heartImg = group.create(0,0,'atlas.float','life_box')

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

	function addLevel(){

		gameLevel++

		setLevel(gameLevel)

		//console.log('add Level' + gameLevel)

		moveSpeed+=0.15
		gameSpeed+= 0.15

	}

	function setLevel(number){

		var text = sceneGroup.levelText

		text.y = game.world.centerY - 200

		text.setText('Nivel ' + number)

		var addTween = game.add.tween(text).to({y:game.world.centerY - 150,alpha:1},500,Phaser.Easing.linear,true)
		addTween.onComplete.add(function(){
			game.add.tween(text).to({y:game.world.centerY - 200,alpha:0},250,Phaser.Easing.linear,true,500)
		})
	}

	function addPoint(number){

		//sound.play("pop")

		addNumberPart(pointsBar.text,'+' + number,true)

		pointsBar.number+=  number
		pointsBar.text.setText(pointsBar.number)

		if(pointsBar.number % 15 == 0){
			addLevel()
		}

	}

	function checkPosPlayer(obj1,obj2, distValue){

		var distance = distValue || 0.8

		if(Math.abs(obj1.world.x - obj2.obs.world.x) < obj2.width * distance && Math.abs(obj1.world.y - obj2.obs.world.y)< obj2.height * distance){
			return true
		}else{
			return false
		}
	}

	function activateLine(line){

		line.alpha = 1
		line.y = linesGroup.pivotY 
		linesGroup.pivotY+= jumpDistance

		var pivotPoint = game.world.width
		var offset = -1
		for(var i = 0;i<line.obstacles.length;i++){

			var obstacle = line.obstacles.children[i]

			if(i == 0 && obstacle.isLeft){
				pivotPoint = 0
				offset = 1
				//obstacle.isLeft = true
			}
			else{
				//obstacle.isLeft = false
			}

			obstacle.isLeft = directionLeft

			obstacle.x = pivotPoint

			obstacle.number = lineIndex + 1
			if(randomize(porcentage_change)){
				obstacle.number = game.rnd.integerInRange(lineIndex,lineIndex + 2)
			}
			obstacle.text.setText(obstacle.number)

			obstacle.active = true
			obstacle.alpha = 1

			pivotPoint+= obstacle.width * 1.5 * offset
			//console.log(obstacle.startPosition + ' start')

		}

		directionLeft= !directionLeft
		lineIndex++
	}

	function activateLineTime(line,delay){

		game.time.events.add(delay, function(){
			activateLine(line)
		})
	}

	function checkLine(line){

		if(line.children[0].world.y < - jumpDistance * 0.5 && line.active){

			activateLine(line)
		}    

	}

	function updateCounter(){

		var tween = game.add.tween(counter.scale).to({x:0.8,y:0.8},200,"Linear",true,0,0)
		tween.yoyo(true,0)
		createPart('star',counter.text)

		counter.text.setText(numIndex)
	}

	function movePoints(){

		for(var i = 0;i<linesGroup.length;i++){
			var group = linesGroup.children[i]

			if(group.active){

				for(var u = 0; u < group.obstacles.length;u++){

					var obstacle = group.obstacles.children[u]

					if(obstacle.isLeft == true){
						obstacle.x-= moveSpeed
						if(obstacle.x < -obstacle.width){
							obstacle.x += (obstacle.width * 1.5)*group.obstacles.length
						}
						//obstacle.angle-=moveSpeed
					}else{
						obstacle.x+= moveSpeed
						if(obstacle.x > game.world.height+obstacle.width){
							obstacle.x -= (obstacle.width * 1.5)*group.obstacles.length
						}
						//obstacle.angle+=moveSpeed
					}

					if(checkPosPlayer(playerGroup.gem,obstacle) && !playerGroup.jumping){
						if(obstacle.tag == 'obstacle' && obstacle.active && playerGroup.active){
							//playerGroup.active = false
							if(canTake){
								if(numIndex  == obstacle.number){
									getCoins(playerGroup)
									createPart('star',obstacle.obs)
									sound.play("magic")
									//addNumberPart(obstacle.obs,'+' + 2,false)
									numIndex++
									updateCounter()
								}else{
									//stopGame()
									missPoint()
								}
								canTake = false
							}

						}
						obstacle.alpha = 0
						obstacle.active = false
					}

				}
			}
			checkLine(group)

		}

		if(!playerGroup.jumping && playerGroup.active){
			if(playerGroup.isLeft){
				playerGroup.x+= moveSpeed
				playerGroup.gem.angle+= moveSpeed
			}else{
				playerGroup.x-= moveSpeed
				playerGroup.gem.angle-= moveSpeed
			}
		}

		var worldX = playerGroup.gem.world.x
		var worldY = playerGroup.gem.world.y
		if(worldX <= -playerGroup.gem.width/3 || worldX > game.world.width+playerGroup.gem.width/3){
			missPoint()
		}
		if(worldY <= -playerGroup.gem.height/3){
			lives = 1
			heartsGroup.text.setText('X ' + lives)
			stopGame()
		}

	}

	function update(){

		if(!gameActive){
			return
		}

		//background.tilePosition.x++
		background.tilePosition.y--

		if(gameGroup.isMoving && playerGroup.active){
			gameGroup.y-=gameSpeed
		}

		if(gameGroup.isMoving){
			movePoints()
		}

		if (jumpButton.isDown && !playerGroup.jumping){

			doJump()
		}

		if(playerGroup.gem.world.y > game.world.height){
			lives = 1
			heartsGroup.text.setText('X ' + lives)
			stopGame()
		}

	}

	function preload(){

		game.stage.disableVisibilityChange = false
	}

	function createLevelText(){

		var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

		var levelText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
		levelText.x = game.world.centerX
		levelText.y = game.world.centerY - 150
		levelText.anchor.setTo(0.5,0.5)
		sceneGroup.add(levelText)

		levelText.alpha = 0

		sceneGroup.levelText = levelText

		levelText.setShadow(3, 3, 'rgba(0,0,0,1)', 0);

	}

	function createHoles(){

		var pivotX = game.world.centerX - 200
		var pivotY = game.world.centerY - 100

		for(var i = 0;i<9;i++){

			var hole = holesGroup.create(pivotX, pivotY,'atlas.float','hole')
			hole.anchor.setTo(0.5,0.5)

			hole.activated = false
			hole.hit = false

			pivotX += 200

			if((i + 1)% 3 == 0){
				pivotX = game.world.centerX - 200
				pivotY+= 200
			}
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
				})
			})
		})
	}
	function getCoins(player){
		var coin=coinsGroup.getFirstDead();

		if(coin==undefined){
			game["coins"+index] = game.add.sprite(0, 0, "coin")
			game["coins"+index].anchor.setTo(0.5)
			game["coins"+index].scale.setTo(0.8)
			game["coins"+index].animations.add('coin')
			game["coins"+index].animations.play('coin', 24, true)
			game["coins"+index].alpha = 0
			coinsGroup.add(game["coins"+index])
			coin=game["coins"+index];
			index++;
			addCoin(coin,player)
		}else{
			addCoin(coin,player)
		}
	}

	function addNumberPart(obj,number,scaleIt){

		var offsetY = -100
		if(scaleIt){
			offsetY = 100
		}
		var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
		pointsText.x = obj.world.x
		pointsText.y = obj.world.y
		pointsText.anchor.setTo(0.5,0.5)
		sceneGroup.add(pointsText)

		game.add.tween(pointsText).to({y:pointsText.y + offsetY},800,Phaser.Easing.linear,true)
		game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)

		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

		if(scaleIt){

			var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
			tweenScale.onComplete.add(function(){
				game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
			})

		}

	}

	function randomize(index){
		var isTrue = false

		if(Math.random()*index < 1){
			isTrue = true
		}

		return isTrue
	}

	function createLinesGroup(number){

		linesGroup.pivotY = playerGroup.y + jumpDistance

		for(var i = 0; i <number;i++){

			var isPair = (i+1)%2==0
			var pivotX = 0
			var group = game.add.group()
			group.y = linesGroup.pivotY 
			linesGroup.add(group)

			for(var a = 0; a<1;a++){

//				var point = group.create(pivotX,0,'atlas.float','left')
//				point.anchor.setTo(0,0.5)
				var createRect=new Phaser.Graphics(game)
				createRect.beginFill(0xffff00)
				createRect.drawRect(0,-50,game.world.width, 100)
				createRect.alpha=0.1;
				createRect.endFill()
				group.add(createRect)

//				pivotX += point.width * 1.5

//				if(isPair){
//					point.scale.x = -1
//				}

			}

			linesGroup.pivotY += jumpDistance

			if(i>=0){

				group.active = true

				var pointsGroup = game.add.group()
				group.add(pointsGroup)
				group.obstacles = pointsGroup

				var pivotPoint = 0
				var isLeft = true
				var offset = 1

				if(!directionLeft){
					pivotPoint = game.world.width
					offset = -1
					isLeft = false
				}

				directionLeft=!directionLeft

				var indexColor = 0
				for(var a = 0; a < 10; a++){

					var obstacle = game.add.group()
					obstacle.x = pivotPoint
					pointsGroup.add(obstacle)

					var obs = obstacle.create(0,0,'atlas.float','obstacle')
					obs.tint = colorsToUse[indexColor]

					indexColor++
					if(indexColor == colorsToUse.length){
						indexColor = 0
					}
					obstacle.tag = 'obstacle'
					obstacle.obs = obs

					var fontStyle = {font: "35px LuckiestGuy", fontWeight: "bold", fill: "#ffffff", align: "center"}

					var pointsText = new Phaser.Text(sceneGroup.game, -3, -5, "0", fontStyle)
					pointsText.anchor.setTo(0.5,0.5)
					obstacle.add(pointsText)

					obstacle.number = lineIndex + 1
					if(randomize(porcentage_change) && i > 0){
						obstacle.number = game.rnd.integerInRange(lineIndex,lineIndex + 2)
						//obstacle.number =0
					}

					pointsText.setText(obstacle.number)
					obstacle.text = pointsText

					obstacle.active = true

					obs.anchor.setTo(0.5,0.5)
					obstacle.scale.setTo(1.2,1.2)

					pivotPoint+= obstacle.width * 1.5 * offset
					obstacle.isLeft = isLeft
					obstacle.startPosition = obstacle.x
				}
			}else{
				group.active = false
			}

			if(i>=0){
				lineIndex++
			}
		}

	}

	function doJump(){
		if(moveSpeed<maxMoveSpeed){
			moveSpeed+=deltaMoveSpeed
		}
		playerGroup.active = true
		//addPoint(1)
		jumpTimes++

		sound.play("cut")
		canTake = true

		if(jumpTimes % 2 == 0){
			playerGroup.isLeft = true
		}else{
			playerGroup.isLeft = false
		}

		if(!gameGroup.isMoving){
			gameGroup.isMoving = true
		}

		playerGroup.jumping = true

		playerGroup.scale.setTo(1,1)
		var jumpTween = game.add.tween(playerGroup).to({y:playerGroup.y + jumpDistance},250,Phaser.Easing.linear,true)
		jumpTween.onComplete.add(function(){
			playerGroup.jumping = false
			var scaleTween = game.add.tween(playerGroup.scale).to({x:0.5,y:1.4  },150,Phaser.Easing.linear,true,0)
			scaleTween.yoyo(true,0)

			var scaleTween = game.add.tween(playerGroup.scale).to({x:0.7 ,y:1.1},100,Phaser.Easing.linear,true,300)
			scaleTween.yoyo(true,0)
		})

	}

	function inputButton(obj){

		//console.log('input button ')
		if(playerGroup.jumping || !gameActive){
			return
		}
		if(tutorial){
			hand.destroy();
			tutorial=false;
		}

		playerGroup.anim.setAnimationByName(0,"win",false)
		playerGroup.anim.addAnimationByName(0,"idle",true)
		doJump()
	}

	function createCoinsAndHand(){
		coins = game.add.sprite(0, 0, "coin")
		coins.anchor.setTo(0.5)
		coins.scale.setTo(0.8)
		coins.animations.add('coin')
		coins.animations.play('coin', 24, true)
		coins.alpha = 0
		coins.kill()

		hand = game.add.sprite(playerGroup.x, playerGroup.y+150, "hand")
		hand.animations.add('hand')
		hand.animations.play('hand', 24, true)
		hand.alpha = 1
		sceneGroup.add(hand)

	}

	function createDashboard(){

		var rect = new Phaser.Graphics(game)
		rect.beginFill(0x000000)
		rect.drawRect(0,0,game.world.width *2, game.world.height *2)
		rect.alpha = 0
		rect.endFill()
		rect.inputEnabled = true
		rect.events.onInputDown.add(inputButton)
		sceneGroup.add(rect)

	}

	function createOverlay(){

		overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
		sceneGroup.add(overlayGroup)

		tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)

	}

	function onClickPlay() {
		coinsGroup= new Phaser.Group(game)
		sceneGroup.add(coinsGroup)
		coinsGroup.add(coins)
		overlayGroup.y = -game.world.height
		gameActive = true
	}

	function createBackground(){

		background = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.float','water_texture')
		sceneGroup.add(background)
	}

	function createCounter(){

		counter = game.add.group()
		counter.x = 100
		counter.y = 150
		sceneGroup.add(counter)

		var image = counter.create(0,0,'atlas.float','counter')
		image.anchor.setTo(0.5,0.5)
		image.scale.setTo(1.1)

		var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}	
		var pointsText = new Phaser.Text(sceneGroup.game, -7, -3, numIndex, fontStyle)
		pointsText.anchor.setTo(0.5,0.5)
		counter.add(pointsText)

		counter.text = pointsText

	}

	function restartGame(){

		if(playerGroup.x <= 0 || playerGroup.x >= game.world.width){
			game.add.tween(playerGroup).to({x: game.world.centerX}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
				gameActive = true
				playerGroup.anim.setAnimationByName(0,"idle",true)
			})
		}
		else{
			numIndex++
			updateCounter()
			gameActive = true
			playerGroup.anim.setAnimationByName(0,"idle",true)
		}
	}

	return {
		assets: assets,
		preload: preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		update:update,
		name: "frootAndFloat",
		create: function(event){

			sceneGroup = game.add.group()

			createBackground()

			gameGroup = game.add.group()
			sceneGroup.add(gameGroup)
			gameGroup.isMoving = true

			linesGroup = game.add.group()
			gameGroup.add(linesGroup)

			playerGroup = game.add.group()
			playerGroup.x = game.world.centerX
			playerGroup.y = 100
			gameGroup.add(playerGroup)
			playerGroup.active = false

			var hex = playerGroup.create(0,0,'atlas.float','player')
			hex.anchor.setTo(0.5,0.5)
			hex.scale.setTo(1.6,1.6)
			hex.alpha = 0
			playerGroup.gem = hex
			playerGroup.add(hex)

			var yogotar = game.add.spine(0,60,'yogotar')
			yogotar.setSkinByName('normal')
			yogotar.setAnimationByName(0,"idle",true)
			playerGroup.add(yogotar)
			playerGroup.anim = yogotar

			initialize()

			createLinesGroup(8)

			createLevelText()

			jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

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

			createHearts()
			createPointsBar()
			createDashboard()
			createCoinsAndHand()
			createCounter()
			addParticles()

			createOverlay()
			animateScene()
			
			buttons.getButton(spaceSong,sceneGroup)
		}
	}
}()