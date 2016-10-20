var resultScreen = function(){

	localizationData = {
		"EN":{
			"goodJob":"Good Job!",
			"yourScore":"Your score: ",
			"sluggish":"Sluggish",
			"average":"Average",
			"speedy":"Great",
			"yourSpeed":"You got \n",
			"secPerAnswer":" incorrect answers.",
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
			"yourScore":"Tu puntaje:",
			"sluggish":"Mejorable",
			"average":"Normal",
			"speedy":"Estupendo",
			"yourSpeed":"Obtuviste \n",
			"secPerAnswer":" respuestas incorrectas.",
			"weKnow":"Sabemos que puedes mejorar",
			"tryAgain":"para reintentar",
			"shareNow":"Compartir",
			"retry":"Jugar",
			"answeredTotal":"Conteste ",
			"questionsIn":" Preguntas en ",
			"seconds":" Segundos",
			"assetPromo": "fbes",
            "language":"es",

		}
	}

	var assets = {
		atlases: [
			{
				name: 'atlas.resultScreen',
				json: "images/result/atlas.json",
				image: "images/result/atlas.png"},
			{
				name: 'atlas.mathQuiz',
				json: "images/mathquiz/altas.json",
				image: "images/mathquiz/altas.png"},
			{
				name: 'atlas.ads',
				json: "../shared/images/ads/atlas.json",
				image: "../shared/images/ads/atlas.png"}
		],
		images: [
			
		],
		sounds: [],
	}

	var sceneGroup

	var totalGoal, totalScore
	var shareButton, shareText, tryAgainText

	var TIME_GOAL = 9

	function setScore(score, scoreGoal, timeScore){
		totalGoal = scoreGoal
		totalScore = timeScore
        
        mixpanel.track(
            "finishGame",
            {"gameName": "mathQuiz", "score":totalScore}
        );
	}

	function shareEvent(){
		var button = this
		button.share.visible = false
		button.share.inputEnabled = false

		button.retry.visible = true
		button.retry.inputEnabled = true
        
        mixpanel.track(
            "pressFacebook",
            {"gameName": "mathQuiz"}
        );
        
		button.label.text = localization.getString(localizationData, "retry")
		FB.ui({
		    method: 'share',
		    href: 'http://yogome.com/epicgames/mathquiz/'+localization.getString(localizationData, "language"),
		    mobile_iframe: true,
		}, function(response){
			//console.log(button)
		});
	}

	function tryAgain(){
		sceneloader.show("instructionsScreen")
	}

	function createShareButton(){
		var buttonGroup = new Phaser.Group(game)

		var shareButton = buttonGroup.create(0, 0, 'atlas.resultScreen', 'share')
		shareButton.anchor.setTo(0.5, 0.5)
		buttonGroup.add(shareButton)

		shareButton.inputEnabled = true
		shareButton.events.onInputUp.add(shareEvent, buttonGroup)

		var tryAgainButton = buttonGroup.create(0, 0, 'atlas.resultScreen', 'again')
		tryAgainButton.visible = false
		tryAgainButton.anchor.setTo(0.5, 0.5)
		buttonGroup.add(tryAgainButton)

		tryAgainButton.inputEnabled = false
		tryAgainButton.events.onInputUp.add(tryAgain, buttonGroup)

		var textStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#f0f0f0", align: "center"}

		var labelText = new Phaser.Text(game, 0, 0, localization.getString(localizationData, "shareNow"), textStyle)
		labelText.anchor.setTo(0.5, 0.5)
		labelText.x = shareButton.width * -0.12
		buttonGroup.add(labelText)

		buttonGroup.share = shareButton
		buttonGroup.retry = tryAgainButton
		buttonGroup.label = labelText

		return buttonGroup
	}

	function showPromo(){

		var urls = {
			android: "http://yogo.me/epicPlay",
			ios: "http://yogo.me/epicUsA",
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
    
    function createPattern(){
        
        var pivotX = 0
        var pivotY = game.world.height * 0.47
        
        for(var i = 1; i < 7; i ++){
            var pattern = sceneGroup.create(pivotX, pivotY,'atlas.resultScreen','retro-pattern') 
            pattern.anchor.setTo(0,1)
            
            pivotX+= pattern.width * 0.99
            
            if(i % 3 == 0){
                pivotX = 0
                pivotY-=pattern.height * 0.99
            }
        }
        
    }
    
	function createScene(){
		sceneGroup = game.add.group()
		sceneGroup.alpha = 0

		game.stage.backgroundColor = "#FFFFFF"

		createPattern()
        
        var language = localization.getString(localizationData,"language")
        
        var youGot = sceneGroup.create(game.world.centerX - 15, 265,'atlas.resultScreen','retro' + language)
        youGot.anchor.setTo(0.5,0.5)
        
        var fontStyle = {font: "60px VAGRounded", fill: "#0f84eb", align: "center"}

		var label = new Phaser.Text(sceneGroup.game, youGot.x + 70, youGot.y+5, totalScore, fontStyle)
		label.anchor.setTo(0.5, 0.5)
		sceneGroup.add(label)
        
        var great = sceneGroup.create(30, 10,'atlas.resultScreen','genial' + language)
        
        var rocket = sceneGroup.create(game.world.width - 15, 35,'atlas.resultScreen','retro-nave')
        rocket.anchor.setTo(1,0)

		shareButton = createShareButton()
		shareButton.x = game.world.centerX
		shareButton.y = game.world.height * 0.62
		sceneGroup.add(shareButton)

		shareText = new Phaser.Text(game, 0, 0, localization.getString(localizationData, "weKnow"), {font: "35px VAGRounded", fill: "#3949ab", align: "center"})
		shareText.anchor.setTo(0.5, 0.5)
		shareText.x = shareButton.x
		shareText.y = shareButton.y - (shareButton.height * 0.7)
		sceneGroup.add(shareText)

		tryAgainText = new Phaser.Text(game, 0, 0, localization.getString(localizationData, "tryAgain"), {font: "35px VAGRounded", fill: "#3949ab", align: "center"})
		tryAgainText.anchor.setTo(0.5, 0.5)
		tryAgainText.x = shareButton.x
		tryAgainText.y = shareButton.y + (shareButton.height * 0.63)
		sceneGroup.add(tryAgainText)

		var yogomePromo = sceneGroup.create(0, 0, 'atlas.ads', localization.getString(localizationData, "assetPromo"))
		yogomePromo.anchor.setTo(0.5, 1)
		yogomePromo.x = game.world.centerX
		yogomePromo.y = game.world.height

		yogomePromo.inputEnabled = true
		yogomePromo.events.onInputUp.add(showPromo)

		tweenScene = game.add.tween(sceneGroup).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, 500)
		tweenScene.start()

		
	}

	function initialize(){
		totalScore = totalScore || 99
		totalGoal = totalGoal || "y"
	}

	return {
		assets: assets,
		name: "resultScreen",
		create: createScene,
		setScore: setScore,
		init: initialize,
	}
}()