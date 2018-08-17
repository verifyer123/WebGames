

var soundsPath = "../../shared/minigames/sounds/"
var iconsPath = "../../shared/minigames/images/icons/"
var imagesPath = "../../shared/minigames/images/"

var result_iMagic = function(){
	
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
			"home":"Casa",
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
				name: 'atlas.result',
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

	var totalScore
	var win
	var buttonsActive
	var currentPlayer
	var gamesList
	var goalScore
	var starGroup, buttonsGroup
	var particlesGroup, particlesUsed
	var coinsToStarsContainer
	var playerTotalScoreContainer
	var yogotar
	var iconImage
	var playerData
	var player = new Object()

	function setScore(didWin,score,index,scale) {

		gamesList = parent.gameData

		player.name="Heber";
		player.totalScore=10;
		console.log(gamesList)
		currentPlayer = null
		totalScore = score
		goalScore = gamesList.objective
		win = totalScore >= goalScore
		console.log(win)
		//console.log(parent.epicModel)
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

		setMixpanel("MinigameAnswer")
		console.log('Set score')
	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function setMixpanel(callName){

		mixpanel.track(
			callName,
			{"minigame": gamesList.name, "correct":win, "score":totalScore,"incorrectAnswers":playerData.lives,
			 "answerTime":playerData.timeReady,"subject":gamesList.subject,"isMap":playerData.hasMap,"app":"epicWeb"}
		);
	}

	function shareEvent(){

		setMixpanel("shareFacebook")

		FB.ui({
			method: 'share',
			href: gamesList.url,
			mobile_iframe: true,
			title: localization.getString(localizationData,"myScore") + totalScore
		}, function(response){
			//console.log(button)
		});
	}
    
    function createBackground(){
        
        var background = sceneGroup.create(0,0,'atlas.result','back_Imagic')
        background.width = game.world.width
        background.height = game.world.height
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

		sound.play("click")

		var origScale = parent.scale.x
		var scaleTween = game.add.tween(parent.scale).to({x:(origScale - 0.2),y:origScale - 0.2}, 200, Phaser.Easing.Cubic.In, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(parent.scale).to({x:origScale,y:origScale}, 200, Phaser.Easing.Cubic.Out, true)

			if(parent.tag == 'share'){
				shareEvent()
			}else if(parent.tag == 'retry'){
				setMixpanel("onRetry")
				var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,200)
				alphaTween.onComplete.add(function(){
					sceneloader.show(gamesList.sceneName)
				})
			}else if(parent.tag == 'map'){
				setMixpanel("onMap")
				var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,200)
				alphaTween.onComplete.add(function(){
					window.open("../epicMap/", "_self")
				})
			}else if(parent.tag == 'home'){
				game.destroy();
			}
		})
	}

	function createButtons(){

		buttonsGroup = game.add.group()
		sceneGroup.add(buttonsGroup)
        
        var buttonNames = ['retry','home','share']

        var buttonTexts = ['retry','home','share']

        var buttonsLength = buttonNames.length

        var pivotX = game.world.centerX - 125
        var pivotY = game.world.centerY + 450

        for(var i = 0;i<buttonsLength;i++){

            var textToUse = localization.getString(localizationData,buttonNames[i])

            var group = game.add.group()
            var fontStyle = {font: "30px Aldrich-Regular",fontWeight: "bold", fill: "#ffffff", align: "center"}
            group.alpha = 0
            group.x = pivotX
            group.y = pivotY-100


            var button1 = group.create(0,0,'atlas.result',buttonNames[i] + 'Btn_Imagic')
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
            button1.events.onInputDown.add(inputButton)
            button1.active = true


            if(textToUse.length > 8){
                retryText.scale.setTo(0.65,0.7)
                retryText.y+= 4
            }

            pivotX +=150
        }
		
		console.log(parent.env)
		if(parent.env && parent.env.isMap){
			var homeBtn = buttonsGroup.create(game.world.centerX - 200,game.world.centerY - 350,'atlas.resultScreen','home')
			homeBtn.anchor.setTo(0.5,0.5)
			homeBtn.alpha = 0
			homeBtn.events.onInputDown.add(inputButton)
			homeBtn.inputEnabled = true
			homeBtn.tag = 'map'
		}
	}

	function createScene(){
        
		loadSounds()

		sceneGroup = game.add.group()

		var background = new Phaser.Graphics(game)
		background.beginFill(0xffffff)
		background.drawRect(0, 0, game.world.width, game.world.height)
		background.endFill()
		sceneGroup.add(background)

		win = totalScore >= goalScore

		createBackground()

		var env = parent ? (parent.env ? parent.env : {}) : {}
		if(currentPlayer){
			currentPlayer.powerCoins += totalScore

			if(env.isMap && win){
				currentPlayer.minigames[gamesList.id].completed = true
			}
			parent.epicModel.savePlayer(currentPlayer)
		}

        var base = sceneGroup.create(game.world.centerX, game.world.centerY,'atlas.result','base_Imagic')
        base.anchor.setTo(0.5)
        
		yogotar = game.add.spine(base.x - 100, base.y - 130, "yogotaResults")
		yogotar.scale.setTo(0.55)
		yogotar.setAnimationByName(0, "idle", true)
		if(currentPlayer && currentPlayer.yogotar){
			var yogotarSkin = currentPlayer.yogotar
			yogotar.setSkinByName(yogotarSkin.toLowerCase())
		}else{
			yogotar.setSkinByName('eagle');
		}
		sceneGroup.add(yogotar)

		

			var numberAdd = 0
			var delay = 1000
			playerTotalScoreContainer = game.add.group()
			sceneGroup.add(playerTotalScoreContainer)
			var valueChange = 40

			coinsToStarsContainer = game.add.group()
			coinsToStarsContainer.x = game.world.centerX
			coinsToStarsContainer.y = game.world.centerY - 20
			sceneGroup.add(coinsToStarsContainer)

			var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var fontStyleImagic = {font: "48px Monoton-Regular",fontWeight: "lighter", fill: "#ffffff", align: "center",  wordWrap: true, wordWrapWidth: 200}
            
			var retryText = new Phaser.Text(sceneGroup.game, 100,5, '= 0' , fontStyle)
            
			var totalCoin = game.add.sprite(base.x, base.y + 100, "atlas.result", "total")
            totalCoin.anchor.setTo(0.5)
            
			var playerAllScoreText = new Phaser.Text(sceneGroup.game, totalCoin.centerX-30,totalCoin.y+70, player.totalScore , fontStyle)

			retryText.anchor.setTo(0,0.5)
			
			playerAllScoreText.anchor.setTo(0,0.5)
			coinsToStarsContainer.add(retryText)
			coinsToStarsContainer.text = retryText
			playerTotalScoreContainer.add(totalCoin)
			playerTotalScoreContainer.add(playerAllScoreText)
			playerTotalScoreContainer.text = playerAllScoreText

			var coinContainer_coin = coinsToStarsContainer.create(coinsToStarsContainer.width/5.8,0,'atlas.result','coinImagic')
			coinContainer_coin.anchor.setTo(0.5,0.5)

			coinContainer_star = coinsToStarsContainer.create(-coinsToStarsContainer.width/4-30,0,'atlas.result','coinImagic')
			coinContainer_star.anchor.setTo(0.5,0.5)
			coinContainer_star.scale.setTo(0.8,0.8)

			coinContainer_star = coinsToStarsContainer.create(-coinsToStarsContainer.width/4+10,0,'atlas.result','coinImagic')
			coinContainer_star.anchor.setTo(0.5,0.5)
			coinContainer_star.scale.setTo(0.8,0.8)

			var coinContainer_star = coinsToStarsContainer.create(-coinsToStarsContainer.width/4-10,0,'atlas.result','coinImagic')
			coinContainer_star.anchor.setTo(0.5,0.5)
			coinContainer_star.scale.setTo(0.9,0.9)


			for(var i = 0; i < totalScore;i++){

				game.time.events.add(delay,function(){

					numberAdd++
					coinsToStarsContainer.text.setText(' = ' + numberAdd)
					coinsToStarsContainer.scale.setTo(1,1)

					playerTotalScoreContainer.text.setText(numberAdd+player.totalScore);
					playerTotalScoreContainer.scale.setTo(1,1)
					var indexCheck = numberAdd - 1
					if(indexCheck % 100 == 0){
						coinContainer_coin.x+=8;
						playerTotalScoreContainer.text.x-=3;
						sound.play("point")
					}
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
		


		game.add.tween(sceneGroup).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, 500, true)

		starGroup = game.add.group()
		starGroup.x = game.world.centerX
		starGroup.y = game.world.centerY + 15
		starGroup.scale.setTo(0.8,0.8)
		sceneGroup.add(starGroup)

		starGroup.star = []

		

       

			var playerNameText = new Phaser.Text(sceneGroup.game, 0, 0, player.name.toString(), fontStyleImagic)
			playerNameText.anchor.setTo(0.5)
            playerNameText.setShadow(0, 0, 'rgba(0,255,255,1)', 20)
			playerNameText.x = base.centerX
			playerNameText.y = base.y - base.height/2 + 70
			if(player.name.length>10){
				playerNameText.scale.setTo(0.6,0.6)
				playerNameText.y = base.y - base.height/2 + 90
			}
			sceneGroup.add(playerNameText)
		
		createButtons()
		addParticles()

		animateScene()
		parent.env = {}

	}
    
    function createBase(){
        
    }

	function animateScene(){

		sceneGroup.alpha = 0
		game.add.tween(sceneGroup).to({alpha:1},500,"Linear",true).onComplete.add(function(){
			addCoins()
		})
	}

	function addCoins(){

        var soundName = 'cheers'
        var animName = "win"

        yogotar.setAnimationByName(0,animName,true)
        game.time.events.add(500,function(){
            var delay = 0

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
		game.stage.backgroundColor = "#ffffff"
	}

	function preload(){

		game.load.bitmapFont('gotham', imagesPath + 'bitfont/gotham.png', imagesPath + 'bitfont/gotham.fnt');
		game.load.bitmapFont('luckiest', imagesPath + 'bitfont/font.png', imagesPath + 'bitfont/font.fnt');
		game.load.spine('yogotaResults', imagesPath + "spines/yogotar.json?v2");
		game.load.image('gameIcon', imagesPath + "icons/" + gamesList.sceneName + ".png")
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
			//game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
			//game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
			particle.start(true, 1500, null, number);

			game.add.tween(particle).to({alpha:0},500,"Linear",true,1000).onComplete.add(function(){
				deactivateParticle(particle,0)
			})

		}
	}

	function createParticles(tag,number){

		for(var i = 0; i < number;i++){

            var particle = game.add.emitter(0, 0, 100);
            particle.makeParticles('atlas.result',tag);
            particle.minParticleSpeed.setTo(-300, -100);
            particle.maxParticleSpeed.setTo(400, -200);
            particle.minParticleScale = 0.6;
            particle.maxParticleScale = 1.5;
            particle.gravity = 150;
            particle.angularDrag = 30;
            particlesGroup.add(particle)
			particle.alpha = 0
			particle.tag = tag
			particle.used = false
		}
	}

	function addParticles(){

		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)

		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)

        createParticles('coinImagic',3)
	}

	function update(){

	}

	return {
		assets: assets,
		name: "result_iMagic",
		create: function(){
			
			var wfconfig = {
				active: function() {
					console.log("font loaded")
					createScene()
				},
				custom: {
					families: [ "Monoton-Regular" ],
					urls:["../../shared/minigames/css/custom_fonts.css"]
				},
			}
			
            WebFont.load(wfconfig)
		},
		preload: preload,
		setScore: setScore,
		init: initialize,
		//update:update,
	}
}()