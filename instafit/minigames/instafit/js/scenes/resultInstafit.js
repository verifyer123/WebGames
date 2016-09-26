var resultInstafit = function(){

	localizationData = {
		"EN":{
			"goodJob":"Good Job!",
            "dontGiveUp":"Don´t give up!",
			"yourScore":"Your score: ",
			"sluggish":"Sluggish",
			"average":"Average",
			"speedy":"Speedy",
			"yourSpeed":"Your average speed is: \n",
			"secPerAnswer":" secs per answer.",
			"weKnow":"We know you can do better",
			"tryAgain":"to try again",
			"shareNow":"Share now",
			"retry":"retry",
			"answeredTotal":"Answered ",
			"questionsIn":" Questions in ",
			"seconds":" Seconds",
			"assetPromo": "fben",
            "language":"en",
		},

		"ES":{
			"goodJob":"¡Buen trabajo!",
            "dontGiveUp":"¡No te rindas!",
			"yourScore":"Tu puntaje:",
			"sluggish":"Lento",
			"average":"Normal",
			"speedy":"Rápido",
			"yourSpeed":"Tu velocidad promedio es de: \n",
			"secPerAnswer":" segundos por respuesta.",
			"weKnow":"Sabemos que puedes mejorar",
			"tryAgain":"para reintentar",
			"shareNow":"Compartir",
			"retry":"Jugar",
			"answeredTotal":"Conteste",
			"questionsIn":" Preguntas en ",
			"seconds":" Segundos",
			"assetPromo": "fbes",
            "language":"es",

		}
	}

	var assets = {
		atlases: [
			{
				name: 'atlas.resultInstafit',
				json: "images/resultInstafit/atlas.json",
				image: "images/resultInstafit/atlas.png"},

		],
		images: [
			
		],
		sounds: [],
	}
    
    var NAMES = [
        'La novata motivada',
        'La ´a mi dejenme dormir´',
        'La socialité del gym',
        'La Fit star',
        
    ]
    var TIPS = [
        'Voy lento pero seguro. Acabas de empezar a hacer \nejercicio pero estás convencida en que muy pronto verás\n resultados en tu cuerpo. Te encanta probar clases nuevas\n y te motiva saber que estar FIT te hace sentir bien.\n Eres determinada y te gusta sentir que tienes el control.',
        '¿Qué es el ejercicio? Rara vez te paras a hacer ejercicio, \ncrees que es innecesario y prefieres pasar tus mañanas\n entre tus cobijas. Cuando haces ejercicio es porque de\n plano te obligaron. Consideras que ir de shopping es tu \nejercicio de alta intensidad y no necesitas más.',
        'Te inscribes a todas las clases de moda. Haz probado \nSiclo, Bodybarre, InstaFit, pilates, crossfit, trx y demás.\n Te encanta hacer detox y todo el tiempo tus amigas te\n preguntan qué está de moda en el momento. Tienes la\n mejor ropa para hacer ejercicio y te sabes combinar.',
        'Eres la campeona de todos los ejercicios, no hay nadie\n que se te compare. Eres decidida y súper activa. Tus\n horas de entrenamiento son la prioridad en tu día\n y son lo más valioso. Realmente disfrutas despertarte\n temprano para aprovechar el día y cuando no puedes\n hacer ejercicio te sientes mal. ',
    ]
	var sceneGroup

	var totalScore, totalTime, totalGoal
	var shareButton, shareText, tryAgainText
    var win
    var indexUse
    var answersList

	var timeGoal = null

	function setScore(indexToUse, valuesList){
        
       indexUse = indexToUse
       answersList = []
       answersList = valuesList
       //indexUse = 2
	}


	function shareEvent(){
		var button = this
		button.share.visible = false
		button.share.inputEnabled = false

		button.retry.visible = true
		button.retry.inputEnabled = true
        
        var imagesList = ['novata','dormir','socialite','fit']
		button.label.text = localization.getString(localizationData, "retry")
        
        mixpanel.track(
            "pressFacebook",
            {"gameName": "quizInstafit"}
        );
        
		FB.ui({
		    method: 'share',
		    href: 'http://yogome.com/g/instafit/',
            picture: 'http://yogome.com/g/instafit/minigames/instafit/images/imagesTest/' +  imagesList[indexUse] + '.png',
		    mobile_iframe: true,
		    title: "Mi perfil es " + NAMES[indexUse] + ' y ¿tu quién eres?'
		}, function(response){
			//console.log(button)
		});
	}

	function tryAgain(){
		sceneloader.show("instafit")
	}

	function createShareButton(){
		var buttonGroup = new Phaser.Group(game)

		var shareButton = buttonGroup.create(0, 0, 'atlas.resultInstafit', 'share')
		shareButton.anchor.setTo(0.5, 0.5)
		buttonGroup.add(shareButton)

		shareButton.inputEnabled = true
		shareButton.events.onInputUp.add(shareEvent, buttonGroup)

		var tryAgainButton = buttonGroup.create(0, 0, 'atlas.resultInstafit', 'again')
		tryAgainButton.visible = false
		tryAgainButton.anchor.setTo(0.5, 0.5)
		buttonGroup.add(tryAgainButton)

		tryAgainButton.inputEnabled = false
		tryAgainButton.events.onInputUp.add(tryAgain, buttonGroup)

		var textStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#f0f0f0", align: "center"}

		var labelText = new Phaser.Text(game, 0, 0, 'Compartir', textStyle)
		labelText.anchor.setTo(0.5, 0.5)
		labelText.x = shareButton.width * -0.12
        labelText.y = 0
		buttonGroup.add(labelText)

		buttonGroup.share = shareButton
		buttonGroup.retry = tryAgainButton
		buttonGroup.label = labelText
        
        buttonGroup.width*= 0.7
        buttonGroup.height*= 0.7

		return buttonGroup
	}

	function showPromo(){

		var urls = {
			android: "https://play.google.com/store/apps/details?id=com.yogome.EpicKnowledge&hl=en",
			ios: "http://bit.ly/EpicYogome",
		}

		var userAgent = navigator.userAgent || "Mac"
		var agentRegex = /Android/g

		var resultRegex = agentRegex.exec(userAgent)

		if(resultRegex){
			window.open(urls.android)
		}
		else{
			window.open(urls.ios)		
		}
	}

	function createScene(){
        
		sceneGroup = game.add.group()
		sceneGroup.alpha = 0

		game.stage.backgroundColor = "#FFFFFF"

		var topRect = new Phaser.Graphics(game)
		topRect.beginFill(0xededed);
		topRect.drawRect(0, 0, game.world.width, game.world.height * 0.58);
		topRect.endFill();
		sceneGroup.add(topRect)

		shareButton = createShareButton()
		shareButton.x = game.world.centerX
		shareButton.y = game.world.height * 0.65
        shareButton.width*=0.85
        shareButton.height*=0.85
		sceneGroup.add(shareButton)

		tryAgainText = new Phaser.Text(game, 0, 0,'¡Comparte este quiz y averigua qué \nperfil tienen tus amigas!', {font: "25px VAGRounded", fill: "#3949ab", align: "center"})
		tryAgainText.anchor.setTo(0.5, 0.5)
		tryAgainText.x = shareButton.x
		tryAgainText.y = shareButton.y + (shareButton.height * 1.5)
		sceneGroup.add(tryAgainText)

		tweenScene = game.add.tween(sceneGroup).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, 500)
		tweenScene.start()
        
        var logoNames = ['novata','dejenmedormir','Socialite','FitStar']
        
        var logo = sceneGroup.create(game.world.centerX, 245, 'atlas.resultInstafit',logoNames[indexUse])
        logo.anchor.setTo(0.5,0.5)
          
        var tipsText = new Phaser.Text(game, game.world.centerX, game.world.centerY - 45, TIPS[indexUse], {font: "20px Arial", fill: "#000000", align: "center"})
		tipsText.anchor.setTo(0.5, 0.5)
		sceneGroup.add(tipsText)
        
        var topRect = new Phaser.Graphics(game)
		topRect.beginFill(0xffffff);
		topRect.drawRect(0, 0, game.world.width, game.world.height * 0.125);
		topRect.endFill();
		sceneGroup.add(topRect)
        
        var colors = ['cd2f6d','6cc100','e19d22','3a9fea']
        var nameText = new Phaser.Text(game, game.world.centerX, 65, 'Tu perfil es:\n ' + NAMES[indexUse], {font: "35px VAGRounded", fill: "#" + colors[indexUse], align: "center"})
		nameText.anchor.setTo(0.5, 0.5)
		sceneGroup.add(nameText)
        
        var yogomePromo = sceneGroup.create(0, 0, 'atlas.ads', localization.getString(localizationData, "assetPromo"))
		yogomePromo.anchor.setTo(0.5, 1)
		yogomePromo.x = game.world.centerX
		yogomePromo.y = game.world.height
        yogomePromo.width*=0.8
        yogomePromo.height*=0.8

		yogomePromo.inputEnabled = true
		yogomePromo.events.onInputUp.add(showPromo)
        
        var st = "instafitQuiz_"
        mixpanel.track(
            "finishGame",
            {"gameName": "quizInstafit", "result":NAMES[indexUse], "instafitQuiz_question1":answersList[0], "instafitQuiz_question2":answersList[1],
            "instafitQuiz_question3":answersList[2],"instafitQuiz_question4":answersList[3],"instafitQuiz_question5":answersList[4],"instafitQuiz_question6":answersList[5],
             "instafitQuiz_question7":answersList[6]}
        );
		
	}

	function initialize(){
		totalScore = totalScore 
		totalTime = totalTime || 99.99
		totalGoal = totalGoal || "y"
	}

	return {
		assets: assets,
		name: "resultInstafit",
		create: createScene,
		setScore: setScore,
		init: initialize,
	}
}()