
var soundsPath = "../../shared/minigames/sounds/"

var magicSpell = function(){

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
				name: "atlas.magicSpell",
				json: "images/magicSpell/atlas.json",
				image: "images/magicSpell/atlas.png",
			},
			{   
				name: "atlas.time",
				json: "images/magicSpell/timeAtlas.json",
				image: "images/magicSpell/timeAtlas.png",
			}
		],
		images: [
			{
				name:'tutorial_image',
				file:"images/magicSpell/gametuto.png"
			},
			{
				name:'rocks',
				file:"images/magicSpell/rocks.png"
			},
			{
				name: "season0",
				file: "images/magicSpell/spring.png"
			},
			{
				name: "season1",
				file: "images/magicSpell/summer.png"
			},
			{
				name: "season2",
				file: "images/magicSpell/fall.png"
			},
			{
				name: "season3",
				file: "images/magicSpell/winter.png"
			}
		],
		sounds: [
			{	name: "magic",
			 file: soundsPath + "magic.mp3"},
			{	name: "cut",
			 file: soundsPath + "cut.mp3"},
			{	name: "wrong",
			 file: soundsPath + "wrongAnswer.mp3"},
			{	name: "rightChoice",
			 file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
			 file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
			 file: soundsPath + "gameLose.mp3"},
			{   name: 'gameSong',
			 file: soundsPath + 'songs/childrenbit.mp3'
			}
		],
		spritesheets: [
			{   name: "coin",
			 file: "images/spines/coin.png",
			 width: 122,
			 height: 123,
			 frames: 12
			}
		],
		spines:[
			{
				name:"dinamita",
				file:"images/spines/Dinamita/dinamita.json"
			},
			{
				name:"enemy",
				file:"images/spines/Spelletor/spelletor.json"
			},
		]
	}

	var SPELL_WORDS

	var lives
	var sceneGroup
	var gameIndex = 190
	var gameActive
	var particleCorrect, particleWrong
	var tutoGroup
	var pointsBar
	var heartsGroup
	var timerGroup
	var gameSong
	var colors,floors;
	var coin
	var hand
	var seasonsGroup
	var slotsGroup
	var runesGroup
	var dificultyTime
	var ok
	var timeAttack
	var gameTime
	var season
	var level
	var tutorial
	var dinamita
	var enemy
	var timeBar

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		game.stage.backgroundColor = "#ffffff"
		lives = 3
		gameActive = false
		tutorial=true
		timeAttack = false
		gameTime = 10000
		level = 1
		dificultyTime=5000;
		
		if(localization.getLanguage() === 'EN'){
			SPELL_WORDS = ["PRIMAVERA", "VERANO", "OTOÑO", "INVIERNO"]
		}
		else{
			SPELL_WORDS = ["SPRING", "SUMMER", "AUTUMN", "WINTER"]
		}

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

		sceneGroup.alpha = 0
		game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

	}

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.magicSpell','xpcoins')
		pointsImg.anchor.setTo(1,0)

		var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

		var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
		pointsText.x = -pointsImg.width * 0.45
		pointsText.y = pointsImg.height * 0.25
		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
		pointsBar.add(pointsText)
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

		var heartImg = group.create(0,0,'atlas.magicSpell','life_box')

		pivotX += heartImg.width * 0.45

		var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
		pointsText.x = pivotX
		pointsText.y = heartImg.height * 0.15
		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
		pointsText.setText('X ' + lives)
		heartsGroup.add(pointsText)
		heartsGroup.text = pointsText
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

	function missPoint(obj){

		sound.play("wrong")

		particleWrong.x = obj.x 
		particleWrong.y = obj.y - 130
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

	function stopGame(){

		sound.play("wrong")
		sound.play("gameLose")

		gameActive = false

		dinamita.setAnimationByName(0, "lose", false)
		dinamita.addAnimationByName(0, "losestill", true)
		restoreAssets()

		var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 3000)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)
			gameSong.stop()	
			sceneloader.show("result")
		})
	}

	function preload(){

		game.stage.disableVisibilityChange = false
	}

	function createTutorial(){

		tutoGroup = game.add.group()
		sceneGroup.add(tutoGroup)

		tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
	}

	function onClickPlay() {
		tutoGroup.y = -game.world.height
		game.add.tween(dinamita).to({x:180}, 1500, Phaser.Easing.linear, true).onComplete.add(function(){
			dinamita.setAnimationByName(0, "idle", true)
			initTuto()
		})
	}

	function createBackground(){

		seasonsGroup = game.add.group()
		sceneGroup.add(seasonsGroup)

		colors = [0xf5e59c, 0xacfcc7, 0xeff6b9, 0xd3f1fb]
		floors = [0x66cc66, 0x66cc99, 0xb0cc58, 0xd2fce8]

		for(var i = 0; i < colors.length; i++){

			var  subGroup = game.add.group()
			subGroup.active = false
			subGroup.alpha = 0
			seasonsGroup.add(subGroup)

			var back = game.add.graphics(0, 0)
			back.beginFill(colors[i])
			back.drawRect(0, 0, game.world.width, game.world.height)
			subGroup.add(back)

			var seasonLand = subGroup.create(0, -10, "season" + i)
			seasonLand.width = game.world.width

			var floor = game.add.graphics(0, back.height-game.world.centerY+70)
			floor.beginFill(floors[i])
			floor.drawRect(0, 0, game.world.width, game.world.centerY)
			subGroup.add(floor)
		}

		var rocks = game.add.tileSprite(0, game.world.centerY + 80, game.world.width, 180, "rocks")
		rocks.anchor.setTo(0, 0.5)
		sceneGroup.add(rocks)

		season = game.rnd.integerInRange(0, seasonsGroup.length - 1)
		seasonsGroup.children[season].alpha = 1
		seasonsGroup.last = seasonsGroup.children[season]
		
	}

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);
		particle.makeParticles('atlas.magicSpell',key);
		particle.minParticleSpeed.setTo(-200, -50);
		particle.maxParticleSpeed.setTo(200, -100);
		particle.minParticleScale = 0.3;
		particle.maxParticleScale = .8;
		particle.gravity = 150;
		particle.angularDrag = 30;
		particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
		return particle
	}

	function createParticles(){
		particleCorrect = createPart('star')
		sceneGroup.add(particleCorrect)

		particleWrong = createPart('smoke')
		sceneGroup.add(particleWrong)
	}

	function createTimer(){

		timerGroup = game.add.group()
		timerGroup.alpha = 0
		sceneGroup.add(timerGroup)

		var clock = timerGroup.create(game.world.centerX, 75, "atlas.time", "clock")
		clock.anchor.setTo(0.5)

		timeBar = timerGroup.create(clock.centerX - 175, clock.centerY + 19, "atlas.time", "bar")
		timeBar.anchor.setTo(0, 0.5)
		timeBar.scale.setTo(11.5, 0.65)
		timeBar.full = 11.5
		timerGroup.timeBar = timeBar
	}

	function stopTimer(){

		timerGroup.tweenTiempo.stop()
		game.add.tween(timerGroup.timeBar.scale).to({x:timeBar.full}, 100, Phaser.Easing.Linear.Out, true, 100)
	}

	function startTimer(time){

		timerGroup.tweenTiempo = game.add.tween(timerGroup.timeBar.scale).to({x:0}, time, Phaser.Easing.Linear.Out, true)
		timerGroup.tweenTiempo.onComplete.add(checkAnswer)
	}

	function createCoin(){

		coin = game.add.sprite(0, 0, "coin")
		coin.anchor.setTo(0.5)
		coin.scale.setTo(0.8)
		coin.animations.add('coin');
		coin.animations.play('coin', 24, true);
		coin.alpha = 0
	}

	function addCoin(obj){

		coin.x = obj.centerX
		coin.y = obj.centerY
		var time = 300

		particleCorrect.x = obj.centerX 
		particleCorrect.y = obj.centerY
		particleCorrect.start(true, 1200, null, 10)

		game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)

		game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
			game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
				game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
					addPoint(1)
					if(pointsBar.number === 5){
						game.add.tween(timerGroup).to({alpha: 1}, 500, Phaser.Easing.linear, true)
						timeAttack = true
					}
					if(pointsBar.number > 5 && pointsBar.number % 5 == 0){
						level < 3 ? level++ : level = 3
					}
					if(level == 3 && pointsBar.number % 5 == 0){
						gameTime > 3000 ? gameTime -= 1000 : gameTime = 3000
					}
				})
			})
		})
	}

	function createAnims(){

		enemy = game.add.spine(game.world.width + 250, game.world.centerY, "enemy")
		enemy.setAnimationByName(0, "idle", true)
		enemy.setSkinByName("normal1")
		enemy.skin = game.rnd.integerInRange(1, 4)
		enemy.hide = game.world.width + 250
		enemy.spot = game.world.width - 150
		sceneGroup.add(enemy)

		dinamita = game.add.spine(-150, game.world.centerY + 110, "dinamita")
		dinamita.setAnimationByName(0, "run", true)
		dinamita.setSkinByName("normal")
		dinamita.scale.setTo(0.6)
		dinamita.spells = ["spell_spring", "spell_summer", "spell_fall", "spell_winter"]
		sceneGroup.add(dinamita)
	}

	function createSlots(){

		var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

		var spellBoard = sceneGroup.create(game.world.centerX, game.world.centerY + 200, "atlas.magicSpell", "spellBoard")
		spellBoard.anchor.setTo(0.5)
		spellBoard.scale.setTo(1.35)

		slotsGroup = game.add.group()
		sceneGroup.add(slotsGroup)
		slotsGroup.board = spellBoard

		for(var i = 0; i < 9; i++){

			var subGroup = game.add.group()
			subGroup.x = -50
			subGroup.alpha = 0
			subGroup.groupPos = i
			subGroup.empty = true
			slotsGroup.add(subGroup)

			var slot = subGroup.create(game.world.centerX-340,0, "atlas.magicSpell", "slot")
			slot.anchor.setTo(0.5)
			slot.scale.setTo(1.2, 1.35)
			subGroup.hole = slot

			var rune = subGroup.create(game.world.centerX-340, 0, "atlas.magicSpell", "rune")
			rune.anchor.setTo(0.5)
			rune.scale.setTo(0.9)
			rune.alpha = 0
			rune.spawnX = rune.x
			rune.spawnY = rune.y
			rune.inputEnabled = true
			rune.input.enableDrag()
			rune.events.onDragStart.add(function(obj){
				obj.parent.hole.alpha = 1
				slotsGroup.remove(obj.parent)
				sceneGroup.add(obj.parent)
			})
			rune.events.onDragStop.add(changeRune, this)
			subGroup.rune = rune
			rune.inputEnabled = false
			var text = new Phaser.Text(subGroup.game, 1, 5, "", fontStyle)
			text.anchor.setTo(0.5)
			rune.addChild(text)
			rune.text = text
		}      
	}

	function createRunes(){

		var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

		var boardGroup = game.add.group()
		sceneGroup.add(boardGroup)

		var board = boardGroup.create(game.world.centerX, game.world.height, "atlas.magicSpell", "board")
		board.anchor.setTo(0.5, 1)
		board.scale.setTo(1.25)

		var space = game.add.graphics(0, 0)
		space.beginFill(0xffffff, 0)
		space.drawRect(board.x - board.width * 0.4, board.y - board.height * 0.8, board.width * 0.8, board.height * 0.7)
		boardGroup.add(space)

		runesGroup = game.add.group()
		boardGroup.add(runesGroup)

		var pivot = 0.45
		var aux = 0
		var nextRow = 0

		for(var i = 0; i < 10; i++){

			var runes = runesGroup.create(0, 0, "atlas.magicSpell", "rune")
			runes.x = (board.centerX * pivot) + (10 * aux) - 20
			runes.y = board.centerY - 50  + (90 * nextRow)
			runes.anchor.setTo(0.5)
			runes.alpha = 0
			runes.groupPos = i
			runes.active = false
			runes.spawnX = runes.x
			runes.spawnY = runes.y
			runes.inputEnabled = true
			runes.input.enableDrag()
			runes.events.onDragStart.add(function(obj){
				runesGroup.bringToTop(obj)
			})
			runes.events.onDragStop.add(setRune, this)

			var text = new Phaser.Text(sceneGroup.game, 2, 0, "", fontStyle)
			text.anchor.setTo(0.5)
			runes.addChild(text)
			runes.text = text

			pivot += 0.23
			aux++
			if(i === 4){
				pivot = 0.35
				aux = 0
				nextRow = 1
			}
		}        
		runesGroup.setAll("inputEnabled", false)

		var pos = []
		for(var i = 0; i < runesGroup.length; i++)
			pos[i] = i

		runesGroup.pos = pos
		runesGroup.space = space
	}

	function createOkBtn(bar){

		ok = game.add.group()
		sceneGroup.add(ok)

		var okOn = ok.create(game.world.width - 100, game.world.height - 70, "atlas.magicSpell", "okOn")
		okOn.anchor.setTo(0.5)
		okOn.scale.setTo(0.45)

		var okOff = ok.create(okOn.x, okOn.y, "atlas.magicSpell", "okOff")
		okOff.anchor.setTo(0.5)
		okOff.scale.setTo(0.45)
		okOff.tint = 0x707070
		okOff.inputEnabled = true
		okOff.hitArea = new Phaser.Circle(0,0, okOff.width * 2)
		okOff.events.onInputDown.add(function(btn){
			if(gameActive){
				sound.play("pop")
				btn.alpha = 0
				if(!tutorial)btn.tint = 0x707070
			}
		},this)
		okOff.events.onInputUp.add(function(btn){
			btn.alpha = 1
			if(!tutorial)btn.inputEnabled = false
			checkAnswer()
		})
		okOff.inputEnabled = false
		ok.btn = okOff
	}

	function changeRune(obj){
		
		if(gameActive){
			
			var slot = getSlot(obj)

			if(slot){
				//sound.play("drag")
				obj.alpha = 0
				obj.inputEnabled = false
				// obj.x = obj.spawnX
				// obj.y = obj.spawnY
				obj.parent.empty = true
				slot.hole.alpha = 0
				slot.rune.alpha = 1
				if(tutorial)slot.rune.inputEnabled = true
				slot.rune.inputEnabled = false
				slot.rune.text.setText(obj.text.text)
				slot.empty = false
			}
			else if(checkOverlap(obj, runesGroup.space)){
				obj.alpha = 0
				obj.inputEnabled = false
				// obj.x = obj.spawnX
				// obj.y = obj.spawnY
				obj.parent.empty = true
				restoreRune(obj.text.text)
			}
		}   
		game.add.tween(obj).to({x:obj.spawnX, y:obj.spawnY}, 200, Phaser.Easing.Cubic.InOut, true).onComplete.add(function(){
			sceneGroup.remove(obj.parent)
			slotsGroup.addChildAt(obj.parent, obj.parent.groupPos)
		})
	}

	function setRune(obj){

		if(gameActive){

			var slot = getSlot(obj)

			if(slot){
				//sound.play("drag")
				obj.alpha = 0
				obj.inputEnabled = false
				obj.active = false
				slot.hole.alpha = 0
				slot.rune.alpha = 1
				slot.rune.inputEnabled = true
				slot.rune.text.setText(obj.text.text)
				slot.empty = false
				if(!hand.active){
					ok.btn.tint = 0xffffff
					ok.btn.inputEnabled = true
				}
			}
		}
		game.add.tween(obj).to({x:obj.spawnX, y:obj.spawnY}, 200, Phaser.Easing.Cubic.InOut, true).onComplete.add(function(){
			runesGroup.setChildIndex(obj, obj.groupPos)
		})
		if(hand){
			hand.alpha = 0
		} 
	}

	function restoreRune(letter){

		for(var i = 0; i < runesGroup.length; i++){

			var rune = runesGroup.children[i]
			if(rune.text.text == letter && !rune.active){
				break
			}        
		}
		rune.alpha = 1
		rune.inputEnabled = true
		rune.active = true
	}

	function getSlot(obj){

		var list = []
		for(var i = 0; i < slotsGroup.length; i++){

			var slot = slotsGroup.children[i]
			if(checkOverlap(obj, slot) && slot.empty){
				list.push(slot)
			}        
		}

		if(list.length == 1){
			return list[0]
		}
		else if(list.length > 1){
			var aux = list[0]

			for(var i = 1; i < list.length; i++){

				if(getIntersections(aux, obj).volume < getIntersections(list[i], obj).volume){
					aux = list[i]
				}
			}
			return aux
		}
	}

	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds()
		var boundsB = spriteB.getBounds()

		return Phaser.Rectangle.intersects(boundsA , boundsB)

	}

	function getIntersections(objA, objB){

		var boundA = objA.getBounds()
		var boundB = objB.getBounds()

		return Phaser.Rectangle.intersection(boundA , boundB)
	}

	function checkAnswer(){

		if(gameActive){
			
			
			if(timeAttack) stopTimer()
			var ans = SPELL_WORDS[season]
			var word = ""

			for(var i = 0; i < ans.length; i++){
				word += slotsGroup.children[i].rune.text.text
			}
			if(!tutorial){
				runesGroup.setAll("inputEnabled", false)
				slotsGroup.setAll("rune.inputEnabled", false)
			}
			if(word === ans){
				if(hand){
					hand.active = false
					hand.destroy()
				}
				tutorial=false;
				gameActive = false
				if(tutorial)ok.btn.inputEnabled = false
				dinamita.setAnimationByName(0, dinamita.spells[season], false).onComplete = function(){
					var anim = "lose2"
					if(enemy.skin == 1 || enemy.skin == 4)
						anim = "lose1"
					enemy.setAnimationByName(0, anim, false)
					addCoin(enemy)
					if(timeAttack && dificultyTime>500)dificultyTime-=500;
					game.time.events.add(3000, changeEnemy)
				}
				dinamita.addAnimationByName(0, "idle", true)
			}
			else if(!tutorial && word != ans){
				gameActive = false
				dinamita.setAnimationByName(0, "spell_fail", false).onComplete = function(){
					missPoint(dinamita)
					enemy.setAnimationByName(0, "attack", false)
					enemy.addAnimationByName(0, "idle", true)
					if(lives > 0) showAnswer()
				}
				dinamita.addAnimationByName(0, "idle", true)
			}
		}
	}

	function showAnswer(){

		var ans = SPELL_WORDS[season]

		for(var i = 0; i < ans.length; i++){
			var slot = slotsGroup.children[i]
			if(slot.empty && slot.alpha != 0){
				slot.rune.text.setText(ans.charAt(i))
				game.add.tween(slot.rune).to({alpha:1}, 250, Phaser.Easing.Cubic.InOut, true)
			}
		}

		game.time.events.add(1800, changeSeason)
	}

	function restoreAssets(){

		for(var i = 0; i < runesGroup.length; i++){
			var delay = game.rnd.integerInRange(30, 60) * 10
			var rune = runesGroup.children[i]
			rune.active = false
			game.add.tween(runesGroup.children[i]).to({alpha:0}, 400, Phaser.Easing.Cubic.InOut,true, delay).onComplete.add(function(){
				rune.text.setText("")
			})
		}     

		for(var i = 0; i < slotsGroup.length; i++){
			var delay = game.rnd.integerInRange(30, 60) * 10
			var slot = slotsGroup.children[i]
			slot.empty = true
			game.add.tween(slot).to({alpha:0}, 400, Phaser.Easing.Cubic.InOut,true, delay).onComplete.add(function(){
				slot.hole.alpha = 1
				slot.rune.alpha = 0
				slot.rune.text.setText("")
				slot.rune.inputEnabled = false
				slot.x = -50
			})
		}     
	}

	function changeEnemy(){

		enemy.x = enemy.hide
		enemy.setAnimationByName(0, "idle", true)
		enemy.setSkinByName("normal" + enemy.skin)
		enemy.setToSetupPose()
		enemy.skin = getRand(enemy.skin, 4, 1)

		var callBack = function(){
			game.add.tween(enemy).to({x:enemy.spot}, 700, Phaser.Easing.Cubic.Out,true).onComplete.add(initGame)
		}

		changeSeason(callBack)
	}

	function changeSeason(callBack){

		restoreAssets()

		var nextFunction = callBack || initGame
		season = getRand(season, SPELL_WORDS.length - 1)

		var background = seasonsGroup.children[season]
		game.add.tween(seasonsGroup.last).to({alpha:0}, 1500, Phaser.Easing.Cubic.InOut,true)
		game.add.tween(background).to({alpha:1}, 1500, Phaser.Easing.Cubic.InOut,true).onComplete.add(nextFunction)
		seasonsGroup.last = background
	}

	function initGame(){

		prepareSpell()
	}

	function prepareSpell(){

		var ans = SPELL_WORDS[season]
		var space = slotsGroup.board.width / (ans.length + 1)
		var delay = 0

		for(var i = 0; i < ans.length; i++){

			delay = game.rnd.integerInRange(30, 60) * 10
			var slot = slotsGroup.children[i]
			slot.x = space * (i + 1.2)
			slot.y = slotsGroup.board.centerY - 15
			slot.alpha = 1
			slot.hole.alpha = 1
			slot.rune.alpha = 0
			game.add.tween(slot.scale).from({x:0, y:0}, 400, Phaser.Easing.Cubic.InOut,true,delay)
		}     

		if(level == 1){
			showClues(ans)
		}

		prepareRunes(ans)
	}

	function prepareRunes(ans){

		Phaser.ArrayUtils.shuffle(runesGroup.pos)

		switch(level){
			case 1:
			case 2:
				for(var i = 0; i < ans.length; i++){
					var slot = slotsGroup.children[i]
					var rune = runesGroup.children[runesGroup.pos[i]]
					rune.text.setText(ans.charAt(i))
					if(slot.empty){
						rune.active = true
					}
				}
				break

				case 3:
				for(var i = 0; i < ans.length; i++){
					var rune = runesGroup.children[runesGroup.pos[i]]
					rune.text.setText(ans.charAt(i))
					rune.active = true
				}

				for(var i = 0; i < runesGroup.length; i++){
					var rune = runesGroup.children[i]
					if(!rune.active){
						var char = String.fromCharCode(game.rnd.integerInRange(65, 90))
						rune.text.setText(char)
						rune.active = true
					}
				}
				break
		}

		runesGroup.forEach(function(rune){
			if(rune.active){
				var delay = game.rnd.integerInRange(30, 60) * 10
				rune.alpha = 1
				game.add.tween(rune.scale).from({x:0, y:0}, 400, Phaser.Easing.Cubic.InOut, true, delay)
				rune.inputEnabled = true
			}
		})
		game.time.events.add(1000,function(){
			gameActive = true
			if(timeAttack) startTimer(dificultyTime)
		})
	}

	function showClues(ans){

		var min = Math.round(ans.length / 4)
		var max = Math.round(ans.length / 2)
		var clues = game.rnd.integerInRange(min, max)

		for(var i = 0; i < clues; i++){

			do{
				var rand = game.rnd.integerInRange(0, ans.length - 1)
				}while(!slotsGroup.children[rand].empty)

					var slot = slotsGroup.children[rand]
					slot.empty = false
			slot.hole.alpha = 0
			slot.rune.alpha = 1
			slot.rune.inputEnabled = true
			slot.rune.text.setText(ans.charAt(rand))
		}
	} 

	function getRand(actual, limit, base){
		var min = base || 0
		var x = game.rnd.integerInRange(min, limit)
		if(x === actual)
			return getRand(actual, limit, min)
		else
			return x     
	}

	/*---------- tutorial ----------*/

	function createHand(){

		hand = sceneGroup.create(0, 0, "atlas.magicSpell", "hand")
		hand.scale.setTo(0.5)
		hand.alpha = 0
		hand.getEmptySlot = getEmptySlot.bind(hand)
		hand.setPos = setPos.bind(hand)
		hand.active = true
	}

	function initTuto(){

		enemy.x = enemy.hide
		enemy.setAnimationByName(0, "idle", true)
		enemy.setSkinByName("normal" + enemy.skin)
		enemy.setToSetupPose()
		enemy.skin = getRand(enemy.skin, 4, 1)
		game.add.tween(enemy).to({x:enemy.spot}, 700, Phaser.Easing.Cubic.Out, true, 500).onComplete.add(prepareSpellTuto)
	}

	function prepareSpellTuto(){

		prepareSpell()
		runesGroup.setAll("inputEnabled", false)
		slotsGroup.setAll("rune.inputEnabled", false)
		game.time.events.add(1000, hand.setPos)    
	}

	function getEmptySlot(){

		for(var i = 0; i < slotsGroup.length; i++){
			var slot = slotsGroup.children[i]
			if(slot.empty && slot.alpha != 0){
				return slot
			}
		}
		return -1
	}

	function setPos(){

		var hand = this
		var ans = SPELL_WORDS[season]
		var slot = hand.getEmptySlot()

		if(slot != -1){
			for(var i = 0; i < runesGroup.length; i++){

				var rune = runesGroup.children[i]
				if(rune.text.text == ans.charAt(slot.groupPos) && rune.active){
					break
				}        
			}

			rune.inputEnabled = true
			hand.x = rune.centerX
			hand.y = rune.centerY
			hand.swipe = game.add.tween(hand).to({x:slot.x+10, y:slot.y}, 1000, Phaser.Easing.Cubic.InOut, false)
			hand.fadeOut = game.add.tween(hand).to({alpha:0}, 250, Phaser.Easing.Cubic.InOut, false)
			hand.fadeOut.onComplete.add(hand.setPos)
			game.add.tween(hand).to({alpha:1}, 250, Phaser.Easing.Cubic.InOut, true).chain(hand.swipe)
			hand.swipe.chain(hand.fadeOut)
		}
		else{
			hand.x = ok.btn.centerX
			hand.y = ok.btn.centerY - 20
			hand.alpha = 1
			ok.btn.tint = 0xffffff
			ok.btn.inputEnabled = true
		}
	}

	return {

		assets: assets,
		name: "magicSpell",
		preload:preload,
		getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){

			sceneGroup = game.add.group()

			createBackground()

			/*gameSong = game.add.audio('gameSong')
            game.sound.setDecodedCallback(gameSong, function(){
                gameSong.loopFull(0.6)
            }, this);*/

			initialize()
			gameSong = sound.play("gameSong", {loop:true, volume:0.6})

			game.onPause.add(function(){
				game.sound.mute = true
			} , this)

			game.onResume.add(function(){
				game.sound.mute = false
			}, this)

			createAnims()
			createSlots()
			createRunes()
			createOkBtn()
			createHand()
			createPointsBar()
			createHearts()
			createTimer()
			createCoin()
			createParticles()

			buttons.getButton(gameSong,sceneGroup)
			createTutorial()

			animateScene()
		}
	}
}()