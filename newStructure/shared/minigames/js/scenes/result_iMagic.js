var soundsPath = "../../shared/minigames/sounds/"

var result = function(){
	var iconsPath = "../../shared/minigames/images/icons/"
	var imagesPath = "../../shared/minigames/images/"
	localizationData = {
		"EN":{
			"youGot":"You earned ",
			"points":"coins",
			"Great":"Great",
			"share":"Share",
			"retry":"Retry",
			"home":"Home",
			"myScore":"My score is: ",
			"previous":"Previous \n record :",
			"record":"New Record!",
			"great":"Great",
			"again":"Try Again",
			"download":"Download"
		},

		"ES":{
			"youGot":"Obtuviste ",
			"points":"monedas",
			"Great":"Genial",
			"share":"Compartir",
			"retry":"Reintentar",
			"home":"Inicio",
			"myScore":"Mi score es: ",
			"previous":"Record \n anterior :",
			"record":"¡Nuevo Récord!",
			"great":"Genial",
			"again":"Reintentar",
			"download":"Descargar"

		}
	}

	var assets = {
		atlases: [
			{
				name: 'atlas.resultScreen',
				json: imagesPath + "result/atlas.json",
				image: imagesPath + "result/atlas.png"
			},
			{
				name: 'atlas.resultScreenImagic',
				json: imagesPath + "result/result_IMagic/atlasImagic.json",
				image: imagesPath + "result/result_IMagic/atlasImagic.png"
			},
		],
		images: [

		],
		sounds: [
			{	name: "click",
			 file: soundsPath + "pop.mp3"},
			{	name: "great",
			 file: soundsPath + "winwin.mp3"},
			{	name: "point",
			 file: soundsPath + "point.mp3"},
			{	name: "right",
			 file: soundsPath + "rightChoice.mp3"},
			{	name: "wrong",
			 file: soundsPath + "wrong.mp3"},
			{	name: "cheers",
			 file: soundsPath + "cheers.mp3"},
			{	name: "magic",
			 file: soundsPath + "magic.mp3"},
			{	name: "boo",
			 file: soundsPath + "CrowdBoo.mp3"},

		],
	}

	var sceneGroup

	var totalScore, totalTime
	var shareButton, shareText, tryAgainText
	var win
	var lastRecord
	var whiteFade
	var iconsGroup
	var buttonsActive
	var isImagicCharacter
	var currentPlayer
	//var haveCoupon
	var gameData
	var goalScore = 50
	var gameNumbers = null
	var scaleToUse
	var gameIndex = 0
	var newRecord
	var whiteFade
	var tile
	var icons
	var starGroup, buttonsGroup
	var particlesGroup, particlesUsed
	var coinsContainer
	var coinsToStarsContainer
	var playerTotalScoreContainer
	var yogotar
	var iconImage
	var playerData
	var timeGoal = null
	var stars = 0
	var player = new Object()
	var IMAGIC_CHARACTERS=[
		"dax"
	]


	function setScore(didWin,score,index,scale) {
        
        
        var playerData=comunicationScript.sendData();
		if(parent.gameData){
            gameData = parent.gameData;
			player.name="Masciosare Ex...";
			player.totalScore=500;
        }else{
            gameData = window.gameData;
			player.name=playerData.player;
			player.totalScore=playerData.coins;
			playerData.coins=score;
			comunicationScript.finalMessage(playerData)
        }

        
        
		currentPlayer = null
		gameIndex = index
		totalScore = score
		
		win = totalScore >= goalScore
		if(parent.epicModel){
			currentPlayer = parent.epicModel.getPlayer()
			mixpanel.people.set({ "MinigamesPlayed": currentPlayer.minigamesPlayed+1 });
		}

		playerData = yogomeGames.returnData()
		playerData.hasMap = false

		if(parent && parent.env){
			playerData.hasMap = parent.env.isMap
			if(currentPlayer)
				currentPlayer.minigamesPlayed++
		}

		scaleToUse = scale || 0.9
//		setMixpanel("MinigameAnswer")
	}

	function startsObtained(total){

		if(total >= goalScore){
			return 3
		}
		else if(total >= goalScore/2){
			return 2
		}
		else if(total >= 1){
			return 1
		}
		else{
			return 0
		}
	}
	function changeImage(index,group){
		for (var i = 0;i< group.length; i ++){
			group.children[i].alpha = 0
			if( i == index){
				group.children[i].alpha = 1
			}

			if(i == 2){
				group.children[i].alpha = 1
			}
		}
	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function setMixpanel(callName){

		mixpanel.track(
			callName,
			{"minigame": gameData.name, "correct":win, "score":totalScore,"incorrectAnswers":playerData.lives,
			 "answerTime":playerData.timeReady,"subject":gameData.subject,"isMap":playerData.hasMap,"app":"epicWeb"}
		);
	}

	function shareEvent(){

//		setMixpanel("shareFacebook")

		FB.ui({
			method: 'share',
			href: gameData.url,
			mobile_iframe: true,
			title: localization.getString(localizationData,"myScore") + totalScore
		}, function(response){
			//console.log(button)
		});
	}

	function inputButton(obj){

		if(obj.active == false || !buttonsActive){
			return
		}
		obj.active = false

		var parent = obj.parent

		if(obj.tag == 'map'){
			parent = obj
		}

		//changeImage(0,parent)
		sound.play("click")

		var origScale = parent.scale.x
		var scaleTween = game.add.tween(parent.scale).to({x:(origScale - 0.2),y:origScale - 0.2}, 200, Phaser.Easing.Cubic.In, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(parent.scale).to({x:origScale,y:origScale}, 200, Phaser.Easing.Cubic.Out, true)

			if(parent.tag == 'share'){
				shareEvent()
			}else if(parent.tag == 'retry'){
//				setMixpanel("onRetry")
				var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,200)
				alphaTween.onComplete.add(function(){
					sceneloader.show(gameData.sceneName)

				})
			}else if(parent.tag == 'map'){
//				setMixpanel("onMap")
				var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,200)
				alphaTween.onComplete.add(function(){
					window.open("../epicMap/", "_self")
				})
			}else if(parent.tag == 'home'){
				game.destroy();
				if(window.gameData)comunicationScript.closeGame();
			}
		})

	}

	function createButtons(pivot){

		buttonsGroup = game.add.group()
		sceneGroup.add(buttonsGroup)

		var buttonNames = ['retry','home']

		var buttonTexts = ['retry','home']

		var buttonsLength = buttonNames.length

		var pivotX = game.world.centerX - 50
		//125 if 3
		var pivotY = pivot

		for(var i = 0;i<buttonsLength;i++){

			var textToUse = localization.getString(localizationData,buttonNames[i])

			var group = game.add.group()
			var fontStyle = {font: "30px Aldrich-Regular",fontWeight: "bold", fill: "#ffffff", align: "center"}
			group.alpha = 0
			group.x = pivotX
			group.y = pivotY-100
			

			var button1 = group.create(0,0,'atlas.resultScreenImagic',buttonNames[i] + 'Btn_Imagic')
			button1.x-=27;
			button1.y-=50;
			button1.anchor.setTo(0.5,0.5)
			button1.scale.setTo(0.8,0.8)

			var retryText = new Phaser.Text(sceneGroup.game,group.x-27,group.y+20, localization.getString(localizationData,buttonNames[i]).toUpperCase() , fontStyle).setShadow(0, 0, 'rgba(255,255,255,1)', 4);
			retryText.anchor.setTo(0.5,0.5)
			sceneGroup.add(retryText)

			buttonsGroup.add(group)
			group.tag = buttonNames[i]



			button1.inputEnabled = true
			button1.hitArea=new Phaser.Circle(0,0,button1.width*1.2)
			button1.events.onInputDown.add(inputButton)
			button1.active = true


			if(textToUse.length > 3){
				retryText.scale.setTo(0.65,0.7)
				retryText.y+= 4
			}

			pivotX +=150
		}
		if(parent.env && parent.env.isMap){
			var homeBtn = buttonsGroup.create(game.world.centerX - 200,game.world.centerY - 350,'atlas.resultScreen','home')
			homeBtn.anchor.setTo(0.5,0.5)
			homeBtn.alpha = 0
			homeBtn.events.onInputDown.add(inputButton)
			homeBtn.inputEnabled = true
			homeBtn.tag = 'map'
		}





	}

	function checkPosObj(obj){

		var posX = obj.x
		var posY = obj.y

		var samePos = false
		for(var i = 0;i<gameIconsGroup.length;i++){
			var obj = gameIconsGroup.children[i]
			if(Math.abs(obj.x - posX) < 150 && Math.abs(obj.y - posY) < 150){
				samePos = true
			}
		}
		return samePos

	}

	function createBackground(){

		var background = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.resultScreenImagic','back_Imagic')
		sceneGroup.add(background)





	}

	function createScene(){

		//console.log(icons[0].name + ' name')

//		if(game.device.desktop){
//			haveCoupon = false
//		}
		loadSounds()

		sceneGroup = game.add.group()
		sceneGroup.alpha = 0

		var background = new Phaser.Graphics(game)
		background.beginFill(0xffffff);
		background.drawRect(0, 0, game.world.width, game.world.height);
		background.endFill();
		background.anchor.setTo(0,0)
		sceneGroup.add(background)

		win = totalScore >= goalScore

		var scaleSpine = 0.55
		var pivotButtons = game.world.centerY + 450

		createBackground()

		var background = sceneGroup.create(game.world.centerX, game.world.centerY,'atlas.resultScreenImagic','base_Imagic')
		background.anchor.setTo(0.5,0.5)

		//background.scale.setTo(1.2,1.2)

		var topHeight = game.world.height * 0.8  
		var env = parent ? (parent.env ? parent.env : {}) : {}
		if(currentPlayer){
			currentPlayer.powerCoins += totalScore

			if(env.isMap && win){
				currentPlayer.minigames[gameData.id].completed = true
			}
			parent.epicModel.savePlayer(currentPlayer)
		}
		yogotar = game.add.spine(game.world.centerX - 100,topHeight * 0.5, "yogotaResults");
		for(var check=0; check<IMAGIC_CHARACTERS.length; check++){
			if(gameData.yogotar==IMAGIC_CHARACTERS[check]){
				isImagicCharacter=true;
				yogotar = game.add.spine(game.world.centerX - 100,topHeight * 0.5, "imagicResults");
			}
		}
		yogotar.scale.setTo(scaleSpine,scaleSpine)
		yogotar.setAnimationByName(0, "idle", true);
		if(!isImagicCharacter && gameData.yogotar!=null){
			var yogotarSkin = gameData.yogotar;
			yogotar.setSkinByName(yogotarSkin.toLowerCase());
		}else if(isImagicCharacter){
			yogotar.setSkinByName("normal");
		}else if(gameData.yogotar==null){
			var anyYogotar=game.rnd.integerInRange(1,yogotar.skeleton.data.skins.length-1)
			var nameOfChoosenYogotar=yogotar.skeleton.data.skins[anyYogotar].name;
			console.log(anyYogotar, nameOfChoosenYogotar)
			yogotar.setSkinByName(nameOfChoosenYogotar);
		}

		yogotar.y=yogotar.y-30;

		//yogotar.setSkinByName('Eagle');
		sceneGroup.add(yogotar)

		var pivotText = game.world.centerX - 170

		var numberAdd = 0
		var delay = 1000
		playerTotalScoreContainer = game.add.group()
		sceneGroup.add(playerTotalScoreContainer)
		var valueChange = 40


		coinsToStarsContainer = game.add.group()
		coinsToStarsContainer.x = game.world.centerX
		coinsToStarsContainer.y = game.world.centerY - 20
		coinsToStarsContainer.scale.setTo(1,1)
		sceneGroup.add(coinsToStarsContainer)

		var imgCont = coinsToStarsContainer.create(0,0,'atlas.resultScreen','coin_stock')
		imgCont.alpha=0;
		imgCont.anchor.setTo(0.5,0.5)

		var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var fontStyleImagic = {font: "48px Monoton-Regular",fontWeight: "lighter", fill: "#ffffff", align: "center",  wordWrap: true, wordWrapWidth: 200}
		var retryText = new Phaser.Text(sceneGroup.game, -imgCont.width *0.10,5, '= 0' , fontStyle)
		var totalScoreImage=game.add.sprite(game.world.centerX,coinsToStarsContainer.y+100,"atlas.resultScreenImagic","total")
		var lengthOfTotal=player.totalScore.toString();
		var playerAllScoreText = new Phaser.Text(sceneGroup.game, totalScoreImage.x-(lengthOfTotal.length/2),totalScoreImage.y+70, player.totalScore , fontStyle)
		retryText.anchor.setTo(0,0.5)
		totalScoreImage.anchor.setTo(0.5,0.5)
		playerAllScoreText.anchor.setTo(0.5,0.5)
		coinsToStarsContainer.add(retryText)
		coinsToStarsContainer.text = retryText
		playerTotalScoreContainer.add(totalScoreImage)
		playerTotalScoreContainer.add(playerAllScoreText)
		playerTotalScoreContainer.text = playerAllScoreText

		var coinContainer_coin = coinsToStarsContainer.create(coinsToStarsContainer.width/2.5,0,'atlas.resultScreenImagic','coinImagic')
		coinContainer_coin.anchor.setTo(0.5,0.5)

		coinContainer_star = coinsToStarsContainer.create(-coinsToStarsContainer.width/4-30,0,'atlas.resultScreenImagic','coinImagic')
		coinContainer_star.anchor.setTo(0.5,0.5)
		coinContainer_star.scale.setTo(0.8,0.8)

		coinContainer_star = coinsToStarsContainer.create(-coinsToStarsContainer.width/4+10,0,'atlas.resultScreenImagic','coinImagic')
		coinContainer_star.anchor.setTo(0.5,0.5)
		coinContainer_star.scale.setTo(0.8,0.8)

		var coinContainer_star = coinsToStarsContainer.create(-coinsToStarsContainer.width/4-10,0,'atlas.resultScreenImagic','coinImagic')
		coinContainer_star.anchor.setTo(0.5,0.5)
		coinContainer_star.scale.setTo(0.9,0.9)


		for(var i = 0; i < totalScore;i++){

			game.time.events.add(delay,function(){

				numberAdd++
				coinsToStarsContainer.text.setText(' = ' + numberAdd)
				coinsToStarsContainer.scale.setTo(1,1)
				lengthOfTotal=numberAdd+player.totalScore.toString();
				playerTotalScoreContainer.text.setText(numberAdd+player.totalScore);
				playerTotalScoreContainer.scale.setTo(1,1)
				var indexCheck = numberAdd - 1
				playerTotalScoreContainer.text.x=totalScoreImage.x-(lengthOfTotal.length/2);
				sound.play("point")
				if(indexCheck % 25 == 0){
					createPart('coinImagic',coinsToStarsContainer.text)
				}
			})
			delay+= valueChange
		}
		if(totalScore > 99){
			coinsToStarsContainer.text.scale.setTo(0.8,0.8)
		}
        
		iconImage = sceneGroup.create(game.world.centerX + 103, game.world.centerY - 212,'gameIcon')
		iconImage.scale.setTo(0.7,0.7)
		iconImage.anchor.setTo(0.5,0.5)
		
		tweenScene = game.add.tween(sceneGroup).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, 500, true)

		starGroup = game.add.group()
		starGroup.x = game.world.centerX
		starGroup.y = game.world.centerY + 15
		starGroup.scale.setTo(0.8,0.8)
		sceneGroup.add(starGroup)

		starGroup.star = []

		infoGroup = game.add.group()
		sceneGroup.add(infoGroup)

		var playerNameText = new Phaser.Text(sceneGroup.game, 0, 0,player.name.toString() , fontStyleImagic).setShadow(0, 0, 'rgba(0,255,255,1)', 20);
		playerNameText.anchor.setTo(0.5, 0.5)

		playerNameText.x = background.centerX
		playerNameText.y = background.y-background.height/2+70
		if(player.name.length>10){
			playerNameText.scale.setTo(0.6,0.6)
			playerNameText.y = background.y-background.height/2+90
		}
		sceneGroup.add(playerNameText)

		for(var i = 0; i < infoGroup.length;i++){
			var obj = infoGroup.children[i]
			obj.alpha = 0
		}

		createButtons(pivotButtons)
		addParticles()

		animateScene()
		parent.env = {}

	}

	function animateScene(){

		sceneGroup.alpha = 0
		game.add.tween(sceneGroup).to({alpha:1},500,"Linear",true).onComplete.add(function(){
			addCoins()
		})
	}
	function addCoins(){
		var soundName = 'cheers'
		var animName =  isImagicCharacter ? "salute" : "win";
		yogotar.setAnimationByName(0,animName,true)
		game.time.events.add(500,function(){
			var delay = 0
			for(var i = 0; i < infoGroup.length;i++){
				var obj = infoGroup.children[i]
				if(!obj.record){
					appearObject(obj,delay)
					delay+= 200
				}
			}
			for(var i = 0; i < buttonsGroup.length;i++){
				var button = buttonsGroup.children[i]
				appearObject(button,delay)
				delay+= 200
			}
			sound.play("great")
		});
		game.time.events.add(750,function(){			
			buttonsActive = true
			sound.play(soundName)
		})
	}

	function popObject(obj,delay,alphaValue){

		var alpha = alphaValue || 1
		game.time.events.add(delay,function(){

			sound.play("click")
			obj.alpha = alpha
			game.add.tween(obj.scale).from({x:0, y:0, angle:obj.angle + 360},250,Phaser.Easing.linear,true)
		},this)
	}

	function appearObject(obj,delay){

		var alpha = 1
		game.time.events.add(delay,function(){

			obj.alpha = alpha
			game.add.tween(obj).from({alpha:0},250,Phaser.Easing.linear,true)
		},this)
	}

	function initialize(){

		buttonsActive = false
		totalScore = totalScore || 0
		totalTime = totalTime || 99.99
		//haveCoupon = false
		isImagicCharacter=false;
		game.stage.backgroundColor = "#ffffff"
	}

	function checkNumbers(number){

		var equal = false
		for(var i = 0; i < gameNumbers.length; i++){
			if(number == gameNumbers[i]){
				equal = true
			}
		}
		if(number == gameIndex){
			equal = true
		}

		return equal
	}

	function getNumbers(){

		icons = amazing.getGames()
		gameNumbers = []

		for(var o = 0; o < 3;o++){

			var number = gameIndex
			gameNumbers[o] = number

			while(checkNumbers(number)){
				number = game.rnd.integerInRange(0, icons.length - 1)
			}

			gameNumbers[o] = number

		}

		//console.log(gameNumbers + ' numbers')

		Phaser.ArrayUtils.shuffle(gameNumbers)
	}

	function preload(){

		game.load.bitmapFont('gotham', imagesPath + 'bitfont/gotham.png', imagesPath + 'bitfont/gotham.fnt');
		game.load.bitmapFont('luckiest', imagesPath + 'bitfont/font.png', imagesPath + 'bitfont/font.fnt');

		game.load.spine('yogotaResults', imagesPath + "spines/yogotar.json?v2");
		game.load.spine('imagicResults', imagesPath + "spines/Imagic/dax.json?v2");

		var iconName = gameData.sceneName
		game.load.image('gameIcon', imagesPath + "icons/" + iconName + ".png")
		//console.log('End preload')
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

			var number = 6
			if(key == 'coin'){
				number = 4
			}
			particle.x = obj.world.x + offX
			particle.y = obj.world.y
			particle.scale.setTo(1,1)
			particle.start(true, 1500, null, number);

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
				particle.makeParticles('atlas.resultScreenImagic',tag);
				particle.minParticleSpeed.setTo(-300, -100);
				particle.maxParticleSpeed.setTo(400, -200);
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
		
		createParticles('coinImagic',3)

		createParticles('text',5)

		whiteFade = new Phaser.Graphics(game)
		whiteFade.beginFill(0xffffff);
		whiteFade.drawRect(0, 0, game.world.width, game.world.height);
		whiteFade.endFill();
		whiteFade.alpha = 0
		whiteFade.anchor.setTo(0,0)
		sceneGroup.add(whiteFade)

	}

	function update(){

	}

	return {
		assets: assets,
		name: "result",
		create: function(){

			var wfconfig = {
				active: function() {
					createScene()
				},
				custom: {
					families: [ "Monoton-Regular" ],
					urls:["../../shared/minigames/css/custom_fonts.css"]
				},
			};
			WebFont.load(wfconfig);
		},
		preload: preload,
		setScore: setScore,
		init: initialize,
		update:update,
	}
}()