var mathQuiz = function(){

	var assets = {
		atlases: [
			{
				name: 'atlas.mathQuiz',
				json: "images/mathquiz/atlas.json",
				image: "images/mathquiz/atlas.png"},
		],
		images: [],
		sounds: []
	}

	var positionQuestions = null
	var positionCache = null

 	var sceneGroup = null
 	var bufferQuestions = null
 	var optionsGroup = null
 	var containerMiddle = null
 	var answersContainer = null
 	var timerContainer = null
 	var questionGroup = null
 	var resultMark = null
 	var isGameOver = null

 	var TOTAL_ANSWERS = 3
	var TOTAL_QUESTIONS = 3

	function winGame(){
		isGameOver = true
	}

	function mapToKeyboard(target){
		var targetId = target.keyCode - Phaser.Keyboard.ONE
		var childrenOption = optionsGroup.children[targetId].inputTouch
		onReleasedAnswer(childrenOption)
	}

 	function onReleasedAnswer(target){

 		var isCorrect = target.parent.isCorrect

 		var newQuestion = createQuestionGroup()
 		//newQuestion.scale.setTo(0.5)
 		newQuestion.alpha = 0
 		newQuestion.x = positionQuestions.x

 		questionGroup.add(newQuestion)
 		bufferQuestions.push(newQuestion)

 		var answerArray = generateRandomAnswers(TOTAL_ANSWERS, bufferQuestions[bufferQuestions.length - (TOTAL_QUESTIONS)].question.unknown)
		optionsGroup.updateAnswers(answerArray)

 		for(var indexQuestion = bufferQuestions.length - (TOTAL_QUESTIONS + 1); indexQuestion < bufferQuestions.length; indexQuestion++){
 			var currentQuestion = bufferQuestions[indexQuestion]
 			var localIndex = indexQuestion - (bufferQuestions.length - (TOTAL_QUESTIONS + 1))

 			var offsetQuestion = localIndex - (bufferQuestions.length - TOTAL_QUESTIONS)
 			if(localIndex > 0){
 				var currentCache = positionCache[localIndex - 1]
 				var targetPositionY = currentCache.y
 				var targetScale = currentCache.scale
 				var targetAlpha = currentCache.alpha

 				var tweenA = sceneGroup.game.add.tween(currentQuestion).to({alpha: targetAlpha, centerY: targetPositionY}, 200)
 				tweenA.start()

 				var tweenB = sceneGroup.game.add.tween(currentQuestion.scale).to({x: targetScale, y: targetScale}, 200)
 				tweenB.start()
 			}else{
				var tweenA = sceneGroup.game.add.tween(currentQuestion).to({alpha: 0}, 200)
 				tweenA.start()

 				var tweenParams = {}
 				if(isCorrect){
 					tweenParams.x = sceneGroup.game.world.width
 					answersContainer.updateAnswers(1)
 					resultMark.show("correct")
 				}else{
 					tweenParams.y = sceneGroup.game.world.height
 					answersContainer.updateAnswers(-1)
 					resultMark.show("wrong")
 				}

 				currentQuestion.visible = false
 				var tweenB = sceneGroup.game.add.tween(currentQuestion).to(tweenParams, 200)
 				tweenB.start()
 			} 			
 		}
 	}

 	function generateRandomAnswers(numberAnswers, correctOption){
 		var answerArray = []
 		var positionCorrect = Math.floor(Math.random() * numberAnswers)
 		for(var indexAnswer = 0; indexAnswer < numberAnswers; indexAnswer++){
 			// var randomSign = Math.round((Math.random() * 1))
 			// var sign = 1
 			// if(randomSign == 0){
 			// 	sign = -1
 			// }
 			valueInterval = Math.floor((Math.random() * 5) + 1)
 			
 			var valueAnswer = {}
 			if(indexAnswer == positionCorrect){
 				valueAnswer.value = correctOption
 				valueAnswer.isCorrect = true
 			}else{
 				valueAnswer.value = correctOption + valueInterval + indexAnswer
 			}

 			answerArray[indexAnswer] = valueAnswer
 		}

 		return answerArray
 	}

 	function createAnswerGroup(){
		var answerGroup = new Phaser.Group(sceneGroup.game)

		var game = sceneGroup.game
		var keyIndex = Phaser.Keyboard.ONE
		for(var indexAnswer = 0; indexAnswer < TOTAL_ANSWERS; indexAnswer++){
			var groupContainer = new Phaser.Group(sceneGroup.game)
			answerGroup.add(groupContainer)

			var answerContainer = groupContainer.create(0, 0, 'atlas.mathQuiz', 'numberoption')

			var fontStyle = {font: "90px vag", fontWeight: "bold", fill: "#ffffff", align: "center"}
			var answerLabel = new Phaser.Text(sceneGroup.game, 0, 0, "N/A", fontStyle)
			answerLabel.anchor.setTo(0.5, 0.5)
			answerLabel.x = answerContainer.centerX
			answerLabel.y = answerContainer.centerY
			groupContainer.add(answerLabel)

			answerContainer.inputEnabled = true
			answerContainer.events.onInputUp.add(onReleasedAnswer, this)

			var key = game.input.keyboard.addKey(keyIndex + indexAnswer)
			key.onDown.add(mapToKeyboard, this)

			groupContainer.inputTouch = answerContainer
			groupContainer.x = (answerContainer.width + game.world.width * 0.02) * indexAnswer
			groupContainer.isCorrect = false
			groupContainer.label = answerLabel
		}

		answerGroup.updateAnswers = function(questionArray){
			var totalChildren = answerGroup.children.length
			for(var indexChildren = 0; indexChildren < totalChildren; indexChildren++){
				var currentChildren = answerGroup.children[indexChildren]
				currentChildren.isCorrect = false
				if(questionArray[indexChildren]){
					currentChildren.label.text = questionArray[indexChildren].value
					if(questionArray[indexChildren].isCorrect){
						currentChildren.isCorrect = questionArray[indexChildren].isCorrect
					}
				}
			}
		}

		return answerGroup
	}

	function createMathEquation(numberOperands){
		var operations = {
			addition: {
				operator: "+",
				result: {
					max: 20,
					min: 10
				},
				operand: {
					max: 20,
					min: 0
				}
			},
			substraction: {
				operator: "-",
				result: {
					min: 0
				},
				operand: {
					max: 20,
					min: 0
				}
			},
			multiplication: {
				operator: "x",
				result: {
					max: 20,
					min: 10
				},
				operand: {
					min: 1
				}
			},
			division: {
				operator: "/",
				result: {
					max: 20
				},
				operand: {
					max: 20,
					min: 0
				}
			}
		}

		var availableOperations = [
			"addition",// "substraction", "multiplication"
		]		

		var randomIndex = Math.floor(Math.random() * availableOperations.length)
		var chosenOperation = availableOperations[randomIndex]
		var chosenOperationData = operations[chosenOperation]

		switch(chosenOperation){
			case "addition": 
				var operator = chosenOperationData.operator
				var operandRules = chosenOperationData.operand
				var resultRules = chosenOperationData.result

				if(resultRules){
					if(typeof(resultRules.max) == "number" && typeof(resultRules.min) == "number"){
						var result = (Math.random() * (resultRules.max - resultRules.min))
						result = Math.round(result) + resultRules.min

						var operands = []
						var resultDelta = result
						for(var indexOperand = 0; indexOperand < numberOperands; indexOperand++){
							var operand = null
							if((indexOperand + 1) >= numberOperands){
								operand = resultDelta
							}else{
								operand = Math.round(Math.random() * resultDelta)
								resultDelta -= operand
							}
							operands.push(operand)
						}

						return {
							operation: chosenOperation,
							operator: operator,
							operands: operands,
							result: result,
						}
					}else if(resultRules.max){
						//TODO Max result rules
					}else if(resultRules.min){
						//TODO Min result rules
					}
				}
				//TODO Operand Rules
				break
			case "substraction":
				console.log(chosenOperation)
				break
			case "multiplication":
				console.log(chosenOperation)
				break
			case "division":
				console.log(chosenOperation)
				break
			default:
				console.log("Not available Operation: "+chosenOperation)
		}


	}

	function createQuestion(totalNumbers){
		var questionGroup = new Phaser.Group(sceneGroup.game)

		var textStyleNumber = {font: "150px vag", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var textStyleOperator = {font: "100px vag", fontWeight: "bold", fill: "#38b0f6", align: "center"}

		var equationData = createMathEquation(2)

		var randomUnknown = Math.round(Math.random() * equationData.operands.length)
		var unknown = 0

		var operands = equationData.operands
		var elementOffsetX = 0
		var elementOffsetY = 0
		for(var indexOperand = 0; indexOperand < operands.length; indexOperand++){
			var operandGroup = new Phaser.Group(sceneGroup.game)
			questionGroup.add(operandGroup)
			var operandBackground

			var operandValue
			if(randomUnknown == indexOperand){
				operandBackground = operandGroup.create(0, 0, 'atlas.mathQuiz', 'unknown')
				operandValue = "?"
				unknown = operands[indexOperand]
			}else{
				operandBackground = operandGroup.create(0, 0, 'atlas.mathQuiz', 'numberoption')
				operandValue = operands[indexOperand] 
			}

			var operandElement = new Phaser.Text(sceneGroup.game, 0, 0, operandValue, textStyleNumber)
			operandElement.centerX = operandBackground.centerX
			operandElement.centerY = operandBackground.centerY
			operandGroup.add(operandElement)

			operandGroup.x = elementOffsetX
			elementOffsetX = elementOffsetX + operandGroup.width
			elementOffsetY = operandGroup.centerY

			if(indexOperand < operands.length - 1){
				var operator = new Phaser.Text(sceneGroup.game, 0, 0, equationData.operator, textStyleOperator)
				operator.x = elementOffsetX
				operator.centerY = operandGroup.centerY
				questionGroup.add(operator)

				elementOffsetX = elementOffsetX + operator.width	
			}
		}

		var equalSign = new Phaser.Text(sceneGroup.game, 0, 0, "=", textStyleOperator)
		equalSign.x = elementOffsetX
		equalSign.centerY = elementOffsetY
		questionGroup.add(equalSign)

		var resultGroup = new Phaser.Group(sceneGroup.game)
		questionGroup.add(resultGroup)

		var resultBackground
		var resultValue
		if(randomUnknown == equationData.operands.length){
			resultBackground = resultGroup.create(0, 0, 'atlas.mathQuiz','unknown')
			resultValue = "?"
			unknown = equationData.result
		}else{
			resultBackground = resultGroup.create(0, 0, 'atlas.mathQuiz','numberoption')
			resultValue = equationData.result
		}

		resultBackground.x = equalSign.x + equalSign.width

		var result = new Phaser.Text(sceneGroup.game, 0, 0, resultValue, textStyleNumber)
		result.centerX = resultBackground.centerX
		result.centerY = elementOffsetY
		resultGroup.add(result)

		questionGroup.data = equationData
		questionGroup.unknown = unknown

		return questionGroup
	}

	function createQuestionGroup(){
		var quizGroup = new Phaser.Group(sceneGroup.game)

		var questionBackground = quizGroup.create(0, 0, 'atlas.mathQuiz', 'questionpanel')
		questionBackground.anchor.setTo(0.5, 0.5)
		questionBackground.scale.setTo(0.9, 0.9)
		quizGroup.add(questionBackground)

		var question = createQuestion()
		question.centerX = questionBackground.x
		question.centerY = questionBackground.y
		quizGroup.add(question)

		quizGroup.question = question

		return quizGroup
	}

	function createAnswerCounter(totalQuestions){
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

		var goal = 10
		var answeredQuestions = 0

		containerGroup.updateAnswers = function(incrementNumber){
			answeredQuestions += incrementNumber
			if(answeredQuestions >= 0){
				if (answeredQuestions >= goal){
					answeredQuestions = goal
					winGame()
				}
				trackerText.text = answeredQuestions+"/"+goal
			}else if(answeredQuestions < 0){
				answeredQuestions = 0
			}
			
		}

		containerGroup.updateAnswers(0)

		return containerGroup
	}

	function zerofill(number, zeroes){
		var numberString = number.toString()
		var numberLength = numberString.length
		if(numberLength < zeroes){
			var targetLength = zeroes-numberLength
			var fillLength = 0
			var newString = ""
			while(fillLength < targetLength){
				newString = newString+"0"
				fillLength = newString.length
			}
			return newString+number
		}
		return number
	}

	function createTimer(){
		var timerGroup = new Phaser.Group(sceneGroup.game)

		var timerContainer = timerGroup.create(0, 0, 'atlas.mathQuiz','timer')
		timerContainer.anchor.setTo(0.5, 0.5)

		var textStyle = {font: "50px vag", fontWeight: "bold", fill: "#000000", align: "center"}

		var timerLabel = new Phaser.Text(sceneGroup.game, 0, 0, "0.000", textStyle)
		timerLabel.anchor.setTo(0, 0.5)
		timerLabel.centerX = timerContainer.x + (timerContainer.width) * 0.135
		timerLabel.y = timerContainer.y + (timerContainer.height) * 0.1
		timerGroup.add(timerLabel)

		var timerSeconds = 0
		function timerCallback(){
			timerSeconds++
		}

		function update(){
			if(!isGameOver){
				timerLabel.text = timerSeconds+"."+zerofill(1000 - game.time.events.duration.toFixed(0), 3)	
			}
		}

		var timer = sceneGroup.game.time.events.loop(Phaser.Timer.SECOND, timerCallback, this)

		timerGroup.update = update

		return timerGroup
	}

	function createResultMark(){
		var markGroup = new Phaser.Group(game)

		var correctMark = markGroup.create(0, 0, 'atlas.mathQuiz', 'win')
		correctMark.anchor.setTo(0.5, 0.5)
		correctMark.visible = false
		var wrongMark = markGroup.create(0, 0, 'atlas.mathQuiz', 'lose')
		wrongMark.anchor.setTo(0.5, 0.5)
		wrongMark.centerX = sceneGroup.game.world.centerX
		wrongMark.centerY = sceneGroup.game.world.centerY
		wrongMark.visible = false

		var tweens = []

		function showMark(markType){

			var selectedMark = correctMark
			if(markType == "correct"){
				correctMark.visible = true
				wrongMark.visible = false

				selectedMark = correctMark
			}else{
				correctMark.visible = false
				wrongMark.visible = true

				selectedMark = wrongMark
			}

			selectedMark.x = sceneGroup.game.world.centerX
			selectedMark.y = sceneGroup.game.world.centerY
			selectedMark.alpha = 0
			selectedMark.scale.setTo(1, 1)

			var tweenAlpha = sceneGroup.game.add.tween(selectedMark).to({alpha: 1}, 200)
			var tweenAlphaB = sceneGroup.game.add.tween(selectedMark).to({alpha: 0, y: selectedMark.y - 20}, 200)
			tweenAlpha.chain(tweenAlphaB)
			tweenAlpha.start()

			var tweenScale = sceneGroup.game.add.tween(selectedMark.scale).to({x: sceneGroup.spriteScale, y: sceneGroup.spriteScale}, 200, "Quart.easeOut")
			tweenScale.start()
		}

		markGroup.show = showMark

		return markGroup
	}

	function initialize(){
		bufferQuestions = []
		positionCache = []

		positionQuestions = {
			x: game.world.centerX,
			y: game.world.height * 0.65
		}

		isGameOver = false
	}

	///////////////////////////////////////////////////////////////////
	function create(event){

		sceneGroup = game.add.group()

		var spriteScale = (game.world.height / 1920)
		sceneGroup.spriteScale = spriteScale

		game.stage.backgroundColor = "#38b0f6"

		var containerbottom = new Phaser.Graphics(game, 0, 0)
		containerbottom.beginFill(0xf2f2f2);
		containerbottom.drawRect(0, 0, game.world.width, game.world.height * 0.25);
		containerbottom.endFill();
		//containerbottom.scale.setTo(spriteScale, spriteScale)
		containerbottom.centerX = game.world.centerX
		containerbottom.y = game.world.height - containerbottom.height
		sceneGroup.add(containerbottom)

		var line = new Phaser.Graphics(game, 0, 0)
		line.beginFill(0xe0e0e0);
		line.drawRect(0, 0, game.world.width, containerbottom.height * 0.1);
		line.endFill();
		//line.scale.setTo(spriteScale, spriteScale)
		line.centerX = game.world.centerX
		line.y = containerbottom.y
		sceneGroup.add(line)

		answersContainer = createAnswerCounter(10)
		answersContainer.scale.setTo(spriteScale, spriteScale)
		answersContainer.x = game.world.width * 0.75
		answersContainer.y = game.world.height * 0.08
		sceneGroup.add(answersContainer)

		timerContainer = createTimer()
		timerContainer.scale.setTo(spriteScale, spriteScale)
		//timerContainer.anchor.setTo(0.5, 0.5)
		timerContainer.x = game.world.width * 0.25
		timerContainer.y = game.world.height * 0.08

		optionsGroup = createAnswerGroup()
		var optionsScale = (containerbottom.height * 0.65) / optionsGroup.height
		optionsGroup.scale.setTo(optionsScale, optionsScale)
		optionsGroup.centerX = containerbottom.centerX
		optionsGroup.centerY = containerbottom.centerY
		sceneGroup.add(optionsGroup)

		questionGroup = new Phaser.Group(game)
		sceneGroup.add(questionGroup)

		resultMark = createResultMark()
		sceneGroup.add(resultMark)

		show()
	}

	function show(){

		initialize()
		var offsetScale = sceneGroup.spriteScale
		var offsetAlpha = 1
		var offsetQuestionY = positionQuestions.y
		
		for(var indexQuestion = 0; indexQuestion < TOTAL_QUESTIONS; indexQuestion++){
			var question = createQuestionGroup()
			question.scale.x = offsetScale  
			question.scale.y = offsetScale 

			question.x = positionQuestions.x
			question.y = offsetQuestionY
			question.alpha = offsetAlpha

			questionGroup.add(question)
			bufferQuestions.push(question)

			positionCache[indexQuestion] = {
				x: question.x,
				y: question.y,
				scale: offsetScale,
				alpha: offsetAlpha,
			}

			offsetQuestionY -= (game.world.height * 0.05) + (question.height * (1/offsetScale))
			offsetScale *= 0.8
			offsetAlpha *= 0.6
		}

		var answerArray = generateRandomAnswers(TOTAL_ANSWERS, bufferQuestions[bufferQuestions.length - (TOTAL_QUESTIONS)].question.unknown)
		optionsGroup.updateAnswers(answerArray)
	}

	return {
		name: "mathQuiz",
		assets: assets,
		create: create,
	}
}()
