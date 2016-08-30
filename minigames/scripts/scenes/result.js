var resultScreen = function(){

	var assets = {
		atlases: [
			{
				name: 'atlas.resultScreen',
				json: "images/result/atlas.json",
				image: "images/result/atlas.png"},
			{
				name: 'atlas.mathQuiz',
				json: "images/mathquiz/atlas.json",
				image: "images/mathquiz/atlas.png"}
		],
		images: [],
		sounds: [],
	}

	var sceneGroup

	var totalScore, totalTime, totalGoal
	var shareButton, shareText, tryAgainText

	var TIME_GOAL = 7

	function setScore(score, scoreGoal, timeScore){
		totalScore = score
		totalGoal = scoreGoal
		totalTime = timeScore
	}

	function createTimer(timeScore){
		var timerGroup = new Phaser.Group(sceneGroup.game)

		var timerContainer = timerGroup.create(0, 0, 'atlas.mathQuiz','timer')
		timerContainer.anchor.setTo(0.5, 0.5)

		var textStyle = {font: "50px vag", fontWeight: "bold", fill: "#000000", align: "center"}

		var timerLabel = new Phaser.Text(sceneGroup.game, 0, 0, timeScore, textStyle)
		timerLabel.anchor.setTo(0, 0.5)
		timerLabel.centerX = timerContainer.x + (timerContainer.width) * 0.135
		timerLabel.y = timerContainer.y + (timerContainer.height) * 0.1
		timerGroup.add(timerLabel)

		return timerGroup
	}

	function createAnswerCounter(totalAnswered, totalQuestions){
		var containerGroup = new Phaser.Group(sceneGroup.game)

		var background = containerGroup.create(0, 0, 'atlas.mathQuiz', 'questioncounter')
		//background.scale.setTo(sceneGroup.spriteScale, sceneGroup.spriteScale)
		background.anchor.setTo(0.5, 0.5)

		var fontStyle = {font: "70px vag", fontWeight: "bold", fill: "#000000", align: "center"}
		var trackerText = new Phaser.Text(sceneGroup.game, 0, 0, "X/Y", fontStyle)
		trackerText.anchor.setTo(0.5, 0.5)
		trackerText.x = background.width * 0.13
		trackerText.y = background.height * 0.06
		containerGroup.add(trackerText)

		var goal = totalQuestions
		var answeredQuestions = totalAnswered

		containerGroup.updateAnswers = function(incrementNumber){
			answeredQuestions += incrementNumber
			if(answeredQuestions >= 0){
				trackerText.text = answeredQuestions+"/"+goal
			}else if(answeredQuestions < 0){
				answeredQuestions = 0
			}
			
		}

		containerGroup.updateAnswers(0)

		return containerGroup
	}

	function createSpeedometer(){
		var speedometerGroup = new Phaser.Group(game)

		var texts = [
			{
				label: "Turtle",
				color: "#33ace0"},

			{
				label: "Average",
				color: "#f8c93a"},
			{
				label: "Genius",
				color: "#d70e6a"}
		]

		var background = speedometerGroup.create(0, 0, 'atlas.resultScreen', 'speedometer') 
		background.anchor.setTo(0.5, 0.5)
		background.scale.setTo(sceneGroup.spriteScale, sceneGroup.spriteScale)

		var arrow = speedometerGroup.create(0, 0, 'atlas.resultScreen', 'arrow')
		arrow.scale.setTo(sceneGroup.spriteScale, sceneGroup.spriteScale)
		arrow.anchor.setTo(0.5, 0.9)

		arrow.y = background.height * 0.4

		var radius = background.width * 0.7
		var angleStep = (Math.PI) / 3

		var startOffset = angleStep * 0.5
		var startAngle = -Math.PI + startOffset

		var fontStyle = {font: "60px vag", fontWeight: "bold", fill: "#000000", align: "center"}

		for(var indexLabel = 0; indexLabel < texts.length; indexLabel++){
			var currentText = texts[indexLabel]

			var labelPosX = Math.cos(startAngle + (angleStep * indexLabel)) * radius
			var labelPosY = Math.sin(startAngle + (angleStep * indexLabel)) * radius

			fontStyle.fill = currentText.color

			var text = new Phaser.Text(game, 0, 0, currentText.label, fontStyle)
			text.anchor.setTo(0.5, 0.5)
			text.scale.setTo(sceneGroup.spriteScale, sceneGroup.spriteScale)
			text.x = arrow.x + labelPosX
			text.y = arrow.y + labelPosY + (background.height * 0.3)

			speedometerGroup.add(text)
		}

		fontStyle.fill = "#929292"
		var totalSpeed = new Phaser.Text(game, 0, 0, "You average speed is: \n"+(totalTime/totalScore).toFixed(2)+" sec per answer", fontStyle)
		totalSpeed.anchor.setTo(0.5, 0.5)
		totalSpeed.scale.setTo(sceneGroup.spriteScale)
		totalSpeed.x = background.x 
		totalSpeed.y = background.y + (background.height * 0.78)

		speedometerGroup.add(totalSpeed)

		speedometerGroup.setScore = function(scoreRange){
			scoreRange = scoreRange >= 1 ? 1 : scoreRange
			var startAngle = -(Math.PI * 0.5)
			var endAngle = startAngle + (Math.PI * scoreRange)
			arrow.rotation = startAngle

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

		button.label.text = "Retry"
		FB.ui({
		    method: 'share',
		    href: 'http://yogome.com/g/m6',
		    mobile_iframe: true,
		    quote: "I answered "+totalScore+" questions in "+totalTime+" seconds"
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
		shareButton.scale.setTo(sceneGroup.spriteScale, sceneGroup.spriteScale)
		buttonGroup.add(shareButton)

		shareButton.inputEnabled = true
		shareButton.events.onInputUp.add(shareEvent, buttonGroup)

		var tryAgainButton = buttonGroup.create(0, 0, 'atlas.resultScreen', 'again')
		tryAgainButton.visible = false
		tryAgainButton.anchor.setTo(0.5, 0.5)
		tryAgainButton.scale.setTo(sceneGroup.spriteScale, sceneGroup.spriteScale)
		buttonGroup.add(tryAgainButton)

		tryAgainButton.inputEnabled = false
		tryAgainButton.events.onInputUp.add(tryAgain, buttonGroup)

		var textStyle = {font: "55px vag", fontWeight: "bold", fill: "#f0f0f0", align: "center"}

		var labelText = new Phaser.Text(game, 0, 0, "Share Now", textStyle)
		labelText.anchor.setTo(0.5, 0.5)
		labelText.scale.setTo(sceneGroup.spriteScale, sceneGroup.spriteScale)
		labelText.x = shareButton.width * -0.12
		buttonGroup.add(labelText)

		buttonGroup.share = shareButton
		buttonGroup.retry = tryAgainButton
		buttonGroup.label = labelText

		return buttonGroup
	}

	function showPromo(){

		var urls = {
			android: "https://play.google.com/store/apps/details?id=com.yogome.EpicKnowledge&hl=en",
			ios: "https://itunes.apple.com/us/app/epic-heroes-of-knowledge/id904827467?mt=8",
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

		var spriteScale = (game.world.height / 1920)
		sceneGroup.spriteScale = spriteScale

		game.stage.backgroundColor = "#FFFFFF"

		var topRect = new Phaser.Graphics(game)
		topRect.beginFill(0xdfdfdf);
		topRect.drawRect(0, 0, game.world.width, game.world.height * 0.45);
		topRect.endFill();

		sceneGroup.add(topRect)

		var shadowHeader = sceneGroup.create(0, 0, 'atlas.resultScreen', 'shadow')
		shadowHeader.anchor.setTo(0.5, 0.5)
		shadowHeader.width = game.world.width
		shadowHeader.x = game.world.centerX
		shadowHeader.y = game.world.height * 0.1

		topRect.y = shadowHeader.y - (shadowHeader.height * 0.5)

		var headerText = new Phaser.Text(game, 0, 0, "Good Job!", {font: "90px vag", fontWeight: "bold", fill: "#0085c8", align: "center"})
		headerText.scale.setTo(spriteScale, spriteScale)
		headerText.anchor.setTo(0.5, 0.5)
		headerText.x = game.world.centerX
		headerText.y = shadowHeader.y * 0.5
		sceneGroup.add(headerText)

		var timerSprite = createAnswerCounter(totalScore, totalGoal)
		timerSprite.x = game.world.width * 0.5
		timerSprite.y = game.world.height * 0.15
		timerSprite.scale.setTo(spriteScale, spriteScale)

		var scoreSprite = createTimer(totalTime)
		scoreSprite.x = timerSprite.x + (timerSprite.width / spriteScale)
		scoreSprite.y = timerSprite.y 
		scoreSprite.scale.setTo(spriteScale, spriteScale)

		var scoreText = new Phaser.Text(game, 0, 0, "Your Score: ", {font: "55px vag", fontWeight: "bold", fill: "#000000", align: "center"})
		scoreText.scale.setTo(spriteScale, spriteScale)
		scoreText.anchor.setTo(1, 0.5)
		scoreText.x = timerSprite.x - ((timerSprite.width / sceneGroup.spriteScale) * 0.5)
		scoreText.y = timerSprite.y + (timerSprite.height * 0.2)
		sceneGroup.add(scoreText)

		var speedometer = createSpeedometer()
		//speedometer.anchor.setTo(0.5, 0.5)
		speedometer.x = game.world.centerX
		speedometer.y = game.world.height * 0.35
		sceneGroup.add(speedometer)

		shareButton = createShareButton()
		shareButton.x = game.world.centerX
		shareButton.y = game.world.height * 0.635
		sceneGroup.add(shareButton)

		shareText = new Phaser.Text(game, 0, 0, "We know you can do better", {font: "55px vag", fill: "#3949ab", align: "center"})
		shareText.anchor.setTo(0.5, 0.5)
		shareText.scale.setTo(spriteScale, spriteScale)
		shareText.x = shareButton.x
		shareText.y = shareButton.y - (shareButton.height * 0.7)
		sceneGroup.add(shareText)

		tryAgainText = new Phaser.Text(game, 0, 0, "to try again", {font: "55px vag", fill: "#3949ab", align: "center"})
		tryAgainText.anchor.setTo(0.5, 0.5)
		tryAgainText.scale.setTo(spriteScale, spriteScale)
		tryAgainText.x = shareButton.x
		tryAgainText.y = shareButton.y + (shareButton.height * 0.75)
		sceneGroup.add(tryAgainText)

		var yogomePromo = sceneGroup.create(0, 0, 'atlas.resultScreen', 'epicpromo')
		yogomePromo.scale.setTo(spriteScale, spriteScale)
		yogomePromo.anchor.setTo(0.5, 1)
		yogomePromo.x = game.world.centerX
		yogomePromo.y = game.world.height

		yogomePromo.inputEnabled = true
		yogomePromo.events.onInputUp.add(showPromo)

		speedometer.setScore(TIME_GOAL / totalTime)
	}

	function initialize(){
		totalScore = totalScore || "x"
		totalTime = totalTime || 99.99
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