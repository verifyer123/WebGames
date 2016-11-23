var resultpiano = function(){

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
			"answeredTotal":"I got ",
			"questionsIn":" Powercubes ",
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
			"answeredTotal":"Obtuve ",
			"questionsIn":" Powercubes ",
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
				name: 'atlas.ads',
				json: "../shared/images/ads/atlas.json",
				image: "../shared/images/ads/atlas.png"}
		],
		images: [
			
		],
		sounds: [],
	}

	var sceneGroup

	var totalScore, totalTime, totalGoal
	var shareButton, shareText, tryAgainText
    var win

	var timeGoal = null

	function setScore(score, scoreGoal, timeScore, didWin){
		totalScore = score
		totalGoal = scoreGoal
		totalTime = timeScore
        win = didWin
        timeGoal = scoreGoal * 0.1
        mixpanel.track(
            "finishGame",
            {"gameName": "pianoTiles", "win":didWin, "time":totalTime}
        );
	}

	function createTimer(timeScore){
		var timerGroup = new Phaser.Group(sceneGroup.game)

		var timerContainer = timerGroup.create(0, 0, 'atlas.pianotiles','timer2')
		timerContainer.anchor.setTo(0.5, 0.5)

		var textStyle = {font: "25px VAGRounded", fontWeight: "bold", fill: "#c41d0f", align : "center"}

		var timerLabel = new Phaser.Text(sceneGroup.game, 0, 0, timeScore, textStyle)
		timerLabel.anchor.setTo(0, 0.5)
		timerLabel.centerX = timerContainer.x + (timerContainer.width) * 0.135
		timerLabel.y = timerContainer.y + (timerContainer.height) * 0.1
		timerGroup.add(timerLabel)
        
        if(win == false){
            timerLabel.text = "--"
        }

		return timerGroup
	}

	function createAnswerCounter(totalAnswered, totalQuestions){
		var containerGroup = new Phaser.Group(sceneGroup.game)

		var background = containerGroup.create(0, 0, 'atlas.pianotiles', 'questioncounter')
		
		background.anchor.setTo(0.5, 0.5)

		var fontStyle = {font: "26px VAGRounded", fontWeight: "bold", fill: "#568f00", align: "center"}
		var trackerText = new Phaser.Text(sceneGroup.game, 0, 0, "X/Y", fontStyle)
		trackerText.anchor.setTo(0.5, 0.5)
		trackerText.x = background.width * 0.15
		trackerText.y = background.height * 0.12
		containerGroup.add(trackerText)

		var goal = totalQuestions
		var answeredQuestions = totalAnswered
        
        trackerText.text = totalAnswered+"/"+totalQuestions
		/*containerGroup.updateAnswers = function(incrementNumber){
			answeredQuestions += incrementNumber
			if(answeredQuestions >= 0){
				trackerText.text = answeredQuestions+"/"+goal
			}else if(answeredQuestions < 0){
				answeredQuestions = 0
			}

		}

		containerGroup.updateAnswers(0)*/4

		return containerGroup
	}

	function createSpeedometer(){
		var speedometerGroup = new Phaser.Group(game)

		var texts = [
			{
				label: localization.getString(localizationData, "sluggish"),
				color: "#33ace0"},
			{
				label: localization.getString(localizationData, "average"),
				color: "#e97800"},
			{
				label: localization.getString(localizationData, "speedy"),
				color: "#d70e6a"}
		]

		var background = speedometerGroup.create(0, 0, 'atlas.resultScreen', 'speedometer') 
		background.anchor.setTo(0.5, 0.5)

		var arrow = speedometerGroup.create(0, 0, 'atlas.resultScreen', 'arrow')
		arrow.anchor.setTo(0.5, 0.9)

		arrow.y = background.height * 0.4

		var radius = background.width * 0.7
		var angleStep = (Math.PI) / 3

		var startOffset = angleStep * 0.5
		var startAngle = -Math.PI + startOffset

		var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}

		for(var indexLabel = 0; indexLabel < texts.length; indexLabel++){
			var currentText = texts[indexLabel]

			var labelPosX = Math.cos(startAngle + (angleStep * indexLabel)) * radius
			var labelPosY = Math.sin(startAngle + (angleStep * indexLabel)) * radius

			fontStyle.fill = currentText.color

			var text = new Phaser.Text(game, 0, 0, currentText.label, fontStyle)
			text.anchor.setTo(0.5, 0.5)
			text.x = arrow.x + labelPosX
			text.y = arrow.y + labelPosY + (background.height * 0.3)

			speedometerGroup.add(text)
		}

		fontStyle.fill = "#929292"
		var totalSpeed = new Phaser.Text(game, 0, 0, localization.getString(localizationData, "yourSpeed")+(totalTime/totalScore).toFixed(2)+localization.getString(localizationData, "secPerAnswer"), fontStyle)
		totalSpeed.anchor.setTo(0.5, 0.5)
		totalSpeed.x = background.x 
		totalSpeed.y = background.y + (background.height * 0.78)
        
        if (win == false) {
            totalSpeed.text = ""
        }

		speedometerGroup.add(totalSpeed)

		speedometerGroup.setScore = function(scoreRange){
			scoreRange = scoreRange >= 1 ? 1 : scoreRange
			var startAngle = -(Math.PI * 0.5)
			var endAngle = startAngle + (Math.PI * scoreRange)
			arrow.rotation = startAngle
            
            if(win == false){
                endAngle = startAngle
            }

			var tween = game.add.tween(arrow).to({rotation: endAngle})
			tween.onComplete.addOnce(function(){
				tween = game.add.tween(arrow).to({rotation: arrow.rotation + Math.PI * 0.05}, 100, "Linear", true, 0, -1)
				tween.yoyo(true, 0)	
			}, this)
			tween.start()
		}

		return speedometerGroup
	}

	function shareEvent(){
		var button = this
		button.share.visible = false
		button.share.inputEnabled = false

		button.retry.visible = true
		button.retry.inputEnabled = true
        
        mixpanel.track(
            "pressFacebook",
            {"gameName": "pianoTiles"}
        );
        
		button.label.text = localization.getString(localizationData, "retry")
		FB.ui({
		    method: 'share',
		    href: 'http://yogome.com/epicgames/pianotiles/' + localization.getString(localizationData, "language"),
		    mobile_iframe: true,
		    title: localization.getString(localizationData, "answeredTotal")+
		    		totalScore+
		    		localization.getString(localizationData, "questionsIn")
		}, function(response){
			//console.log(button)
		});
	}

	function tryAgain(){
		sceneloader.show("creatPianoTiles")
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
			ios: "http://yogo.me/epicMxA",
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
		totalScore = totalScore 
		totalTime = totalTime || 99.99
		totalGoal = totalGoal || "y"
	}

	return {
		assets: assets,
		name: "resultpiano",
		create: createScene,
		setScore: setScore,
		init: initialize,
	}
}()