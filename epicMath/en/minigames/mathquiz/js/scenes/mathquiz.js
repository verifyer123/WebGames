var mathQuiz = function(){

	var localizationData = {
		"EN":{
			"assetReady":"readyen",
			"assetGo":"goen",
			"assetExcellent":"excellenten",
            "assetGiveup":"giveen",
            "language":"en"
		},

		"ES":{
			"assetReady":"readyes",
			"assetGo":"goes",
			"assetExcellent":"excellentes",
            "assetGiveup":"givees",
            "language":"es"
		}
	}

	var assets = {
		atlases: [
			{
				name: 'atlas.mathQuiz',
				json: "images/mathquiz/atlas.json",
				image: "images/mathquiz/atlas.png"},
		],
		images: [
            {   name:"background",
				file: "images/mathquiz/fondo.png"},
		],
		sounds: [
            {	name: "correct",
				file: "sounds/rightChoice.mp3"},
            {	name: "lose",
				file: "sounds/wrong.mp3"},
            {	name: "win",
				file: "sounds/winwinwin.mp3"},
            {	name: "ready_es",
				file: "sounds/ready_es.mp3"},
            {	name: "ready_en",
				file: "sounds/ready_en.mp3"},
            {	name: "go_es",
				file: "sounds/go_es.mp3"},
            {	name: "go_en",
				file: "sounds/go_en.mp3"},
        ]
	}

	var positionQuestions = null
	var positionCache = null
    
    var pointsGroup = null
 	var sceneGroup = null
 	var bufferQuestions = null
 	var optionsGroup = null
 	var containerMiddle = null
 	var answersContainer = null
 	var timerContainer = null
 	var questionGroup = null
 	var resultMark = null
    var questionIndex = null

 	var isGameActive = null
    
    var numberOfLifes = null
 	var TOTAL_ANSWERS = 3
	var TOTAL_QUESTIONS = 3
	var GOAL_QUESTIONS = 10

	function winGame(){
		isGameActive = false

		var blocker = createFinishBlocker()
		sceneGroup.add(blocker)

		tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, false, 1000)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("resultScreen")
			resultScreen.setScore(answersContainer.answered, GOAL_QUESTIONS, numberOfLifes * 40)

			sceneloader.show("resultScreen")
		})
		tweenScene.start()

		
	}

	function mapToKeyboard(target){
		var targetId = target.keyCode - Phaser.Keyboard.ONE
		var childrenOption = optionsGroup.children[targetId].inputTouch
		onReleasedAnswer(childrenOption)
	}
    
     function setQuestionIndex(index){
        
        var obj = pointsGroup.children[index]
        changeImage(1,obj)
        
        if(index > 0){
            changeImage(2,pointsGroup.children[index - 1])
        }
        
        var scaleTween = game.add.tween(obj.scale).to({x:1.3,y:1.3}, 200, Phaser.Easing.linear, true)
        
        scaleTween.onComplete.add(function(){
            game.add.tween(obj.scale).to({x:1,y:1}, 200, Phaser.Easing.linear, true)
                        
        })
        
    }
    
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
        group.children[3].alpha = 1
    }
    
    function createPointsBar(){
        
        var pointsBar = sceneGroup.create(game.world.centerX, 60, 'atlas.mathQuiz','lineaGris')
        pointsBar.anchor.setTo(0.5,0.5)
        
        pointsGroup = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pivotX = pointsBar.x - pointsBar.width * 0.45
        for(var i = 0;i<10;i++){
            
            var group = game.add.group()
            group.x = pivotX
            group.y = pointsBar.y
            pointsGroup.add(group)
            
            var circle1 = group.create(0,0,'atlas.mathQuiz','Cgris')
            circle1.anchor.setTo(0.5,0.5)
            
            var circle2 = group.create(0,0,'atlas.mathQuiz','Cazul')
            circle2.anchor.setTo(0.5,0.5)
            
            var circle3 = group.create(0,0,'atlas.mathQuiz','Cverde')
            circle3.anchor.setTo(0.5,0.5)
            
            var fontStyle = {font: "22px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
            
            var trackerText = new Phaser.Text(sceneGroup.game, 0, 3, i + 1, fontStyle)
            trackerText.anchor.setTo(0.5, 0.5)
            group.add(trackerText)
            
            pivotX+= circle1.width * 1.315
            
            changeImage(0,group)
            
        }
        
    }
    
    function addCorrect(correct){
        
        var obj = pointsGroup.children[questionIndex]
        var correct
        if(correct){
            correct = sceneGroup.create(obj.x, obj.y - 35,'atlas.mathQuiz','correcto')
            
        }else{
            correct = sceneGroup.create(obj.x, obj.y - 35,'atlas.mathQuiz','incorrecto')
        }
        correct.anchor.setTo(0.5,0.5)
    }
    
 	function onReleasedAnswer(target){

 		if(isGameActive){

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
                        sound.play("correct")
                        addCorrect(true)
	 				}else{
	 					tweenParams.y = sceneGroup.game.world.height
	 					answersContainer.updateAnswers(-1)
	 					resultMark.show("wrong")
                        sound.play("lose")
                        numberOfLifes--
                        addCorrect(false)
                        //timerContainer.text.setText(numberOfLifes)
                        
                        if(numberOfLifes <= 0){
                            winGame()
                        }
	 				}
                    questionIndex++
                    
                    if(questionIndex >= 10){
                        winGame()
                    }else{
                        setQuestionIndex(questionIndex)
                    }
                    
	 				currentQuestion.destroy(true)	
	 				//var tweenB = sceneGroup.game.add.tween(currentQuestion).to(tweenParams, 200)
	 				//tweenB.onComplete.add(function(){
	 					
	 				//})
	 				//tweenB.start()
	 			} 			
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

			var fontStyle = {font: "90px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
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
			groupContainer.x = (answerContainer.width + game.world.width * 0.07) * indexAnswer
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

		var textStyleNumber = {font: "80px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var textStyleOperator = {font: "100px VAGRounded", fontWeight: "bold", fill: "#38b0f6", align: "center"}

		var equationData = createMathEquation(2)

		var randomUnknown = Math.round(Math.random() * equationData.operands.length)
		var unknown = 0

		var operands = equationData.operands
		var elementOffsetX = -50
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
				operandBackground = operandGroup.create(0, 0, 'atlas.mathQuiz', 'option')
				operandValue = operands[indexOperand] 
			}

			var operandElement = new Phaser.Text(sceneGroup.game, 0, 0, operandValue, textStyleNumber)
			operandElement.centerX = operandBackground.centerX
			operandElement.centerY = operandBackground.centerY + 5
			operandGroup.add(operandElement)

			operandGroup.x = elementOffsetX
			elementOffsetX = elementOffsetX + operandGroup.width * 1.1
			elementOffsetY = operandGroup.centerY

			if(indexOperand < operands.length - 1){
				var operator = new Phaser.Text(sceneGroup.game, 0, 0, equationData.operator, textStyleOperator)
				operator.x = elementOffsetX	
				operator.centerY = operandGroup.centerY
                operator.alpha = 0
				questionGroup.add(operator)

				elementOffsetX = elementOffsetX + operator.width * 1.1
			}
            
            if(indexOperand == 1){
                operandGroup.x+= 26
            }
		}

		var equalSign = new Phaser.Text(sceneGroup.game, 0, 0, "=", textStyleOperator)
		equalSign.x = elementOffsetX
		equalSign.centerY = elementOffsetY
		questionGroup.add(equalSign)
        equalSign.alpha = 0

		var resultGroup = new Phaser.Group(sceneGroup.game)
		questionGroup.add(resultGroup)

		var resultBackground
		var resultValue
		if(randomUnknown == equationData.operands.length){
			resultBackground = resultGroup.create(0, 0, 'atlas.mathQuiz','unknown')
			resultValue = "?"
			unknown = equationData.result
		}else{
			resultBackground = resultGroup.create(0, 0, 'atlas.mathQuiz','option')
			resultValue = equationData.result
		}

		resultBackground.x = equalSign.x + equalSign.width * 2

		var result = new Phaser.Text(sceneGroup.game, 0, 0, resultValue, textStyleNumber)
		result.centerX = resultBackground.centerX
		result.centerY = elementOffsetY + 5
		resultGroup.add(result)

		questionGroup.data = equationData
		questionGroup.unknown = unknown

		return questionGroup
	}

	function createQuestionGroup(){
		var quizGroup = new Phaser.Group(sceneGroup.game)

		var questionBackground = quizGroup.create(0, 0, 'atlas.mathQuiz', 'questionpanel')
		questionBackground.anchor.setTo(0.5, 0.5)
		questionBackground.scale.setTo(1, 1)
		quizGroup.add(questionBackground)

		var question = createQuestion()
		question.centerX = questionBackground.x
		question.centerY = questionBackground.y + 23
		quizGroup.add(question)

		quizGroup.question = question

		return quizGroup
	}

	function createAnswerCounter(totalQuestions){
		var containerGroup = new Phaser.Group(sceneGroup.game)

		var background = containerGroup.create(0, 0, 'atlas.mathQuiz', 'points')
		background.anchor.setTo(0.5, 0.5)

		var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var trackerText = new Phaser.Text(sceneGroup.game, 0, 0, "X/Y", fontStyle)
		trackerText.anchor.setTo(0.5, 0.5)
		trackerText.x = background.width * 0.15
		trackerText.y = background.height * 0.09
		containerGroup.add(trackerText)

		var goal = GOAL_QUESTIONS
		var answeredQuestions = 0

		containerGroup.updateAnswers = function(incrementNumber){
            answeredQuestions += incrementNumber
			containerGroup.answered = answeredQuestions
			if(answeredQuestions >= 0){
				if (answeredQuestions >= goal){
					answeredQuestions = goal
					winGame()
				}
                console.log(answeredQuestions + ' answered')
				trackerText.text = answeredQuestions+"/"+goal
			}
		}

		containerGroup.updateAnswers(0)

		return containerGroup
	}

	/*function zerofill(number, zeroes){
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
	}*/

	function createTimer(){
		var timerGroup = new Phaser.Group(sceneGroup.game)

		var timerContainer = timerGroup.create(0, 0, 'atlas.mathQuiz','lifes')
		timerContainer.anchor.setTo(0.5, 0.5)

		var textStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

		var timerLabel = new Phaser.Text(sceneGroup.game, 0, 0, numberOfLifes, textStyle)
		timerLabel.anchor.setTo(0, 0.5)
		timerLabel.centerX = timerContainer.x + (timerContainer.width) * 0.135
		timerLabel.y = timerContainer.y + (timerContainer.height) * 0.1
		timerGroup.add(timerLabel)

		/*var timerSeconds = 0
		function timerCallback(){
			timerSeconds++
		}

		function update(){
			if(isGameActive){
				timerLabel.text = timerSeconds+"."+zerofill(1000 - game.time.events.duration.toFixed(0), 3)	
			}
		}

		function start(){
			var timer = sceneGroup.game.time.events.loop(Phaser.Timer.SECOND, timerCallback, this)	
		}
		
		timerGroup.start = start
		timerGroup.update = update
		timerGroup.label = timerLabel*/
        
        timerGroup.text = timerLabel

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

			var tweenScale = sceneGroup.game.add.tween(selectedMark.scale).to({x: 1, y: 1}, 200, "Quart.easeOut")
			tweenScale.start()
		}

		markGroup.show = showMark

		return markGroup
	}

	function initialize(){
        questionIndex = 0
		bufferQuestions = []
		positionCache = []

        numberOfLifes = 10
		positionQuestions = {
			x: game.world.centerX,
			y: game.world.height * 0.65
		}

		isGameActive = false
	}

	///////////////////////////////////////////////////////////////////
	function create(event){

		sceneGroup = game.add.group()
		//sceneGroup.alpha = 0	

		//game.stage.backgroundColor = "#38b0f6"
        
        var background = sceneGroup.create(0,0,'background')
        background.width = game.world.width
        background.height = game.world.height
        
        createPointsBar()
        
        var dinamita = sceneGroup.create(0,100,'atlas.mathQuiz','dinamita')
        
        var estrella = sceneGroup.create(game.world.width,100,'atlas.mathQuiz','estrella')
        estrella.anchor.setTo(1,0)
        
        
		var containerHeight = game.world.height * 0.20

		var containerBottom = new Phaser.Graphics(game)
		containerBottom.beginFill(0xf2f2f2);
		containerBottom.drawRect(0, 0, game.world.width, containerHeight);
		containerBottom.endFill();
		containerBottom.x = 0
		containerBottom.y = game.world.height - containerHeight
		sceneGroup.add(containerBottom)

		var line = new Phaser.Graphics(game, 0, 0)
		line.beginFill(0xe0e0e0);
		line.drawRect(0, 0, containerBottom.world.width, containerBottom.height * 0.1);
		line.endFill();
		line.x = 0
		line.y = containerBottom.y
		sceneGroup.add(line)

		answersContainer = createAnswerCounter(10)
        answersContainer.alpha = 0
		answersContainer.x = game.world.width * 0.87
		answersContainer.y = game.world.height * 0.04
		sceneGroup.add(answersContainer)

		/*timerContainer = createTimer()
		timerContainer.x = 89
		timerContainer.y = game.world.height * 0.04
		sceneGroup.add(timerContainer)*/

		optionsGroup = createAnswerGroup()
		var optionsScale = (containerHeight * 0.7) / optionsGroup.height
		optionsGroup.scale.setTo(optionsScale, optionsScale)
		optionsGroup.centerX = game.world.centerX
		optionsGroup.centerY = game.world.height - (containerHeight * 0.5)
		sceneGroup.add(optionsGroup)

		questionGroup = new Phaser.Group(game)
		sceneGroup.add(questionGroup)

		resultMark = createResultMark()
		sceneGroup.add(resultMark)

		show()
	}

	function createCountDown(){
		var countGroup = new Phaser.Group(game)

		var blackScreen = new Phaser.Graphics(game)
		blackScreen.alpha = 0.3
		blackScreen.beginFill(0x0)
		blackScreen.drawRect(0, 0, game.width, game.height)
		blackScreen.endFill()

		countGroup.add(blackScreen)

		var readySign = countGroup.create(0, 0, "atlas.mathQuiz", localization.getString(localizationData, "assetReady"))
		readySign.alpha = 0
		readySign.anchor.setTo(0.5, 0.5)
		readySign.x = game.world.centerX
		readySign.y = game.world.centerY - 20
		countGroup.add(readySign)

		var goSign = countGroup.create(0, 0, "atlas.mathQuiz", localization.getString(localizationData, "assetGo"))
		goSign.alpha = 0
		goSign.anchor.setTo(0.5, 0.5)
		goSign.x = game.world.centerX
		goSign.y = game.world.centerY - 20
		countGroup.add(goSign)
        
        sound.play("ready_" + localization.getString(localizationData,"language"))
        
		function tweenMark(){
            
            sceneGroup.alpha = 0
            
            game.add.tween(sceneGroup).to({ alpha: 1}, 500, Phaser.Easing.Sinusoidal.Out, true)
			var tweenReady = game.add.tween(readySign).to({y: game.world.centerY, alpha: 1}, 500, Phaser.Easing.Sinusoidal.Out, false, 500)
			var tweenGo = game.add.tween(goSign).to({y: game.world.centerY, alpha: 1}, 500, Phaser.Easing.Sinusoidal.Out, false)

			tweenReady.onComplete.add(function(){
				tweenReady = game.add.tween(readySign).to({y: game.world.centerY + 20, alpha: 0}, 300, Phaser.Easing.Sinusoidal.In, false, 300)
				tweenReady.onComplete.add(function(){
					tweenGo.onComplete.add(function(){
                        sound.play("go_" + localization.getString(localizationData,"language"))
						tweenGo = game.add.tween(goSign).to({alpha: 0}, 300, Phaser.Easing.Sinusoidal.In, false, 300)
						tweenGoScale = game.add.tween(goSign.scale).to({y: goSign.scale.y * 1.2, x: goSign.scale.x * 1.2}, 300, Phaser.Easing.Sinusoidal.In, false, 300)
						tweenScreen = game.add.tween(blackScreen).to({alpha: 0}, 300, Phaser.Easing.Sinusoidal.In, false, 300)
						tweenGo.onComplete.add(function(){
                            
							//timerContainer.start()
							isGameActive = true
                            setQuestionIndex(questionIndex)
                            //timerContainer.text.setText(numberOfLifes)
						})
						tweenScreen.start()
						tweenGoScale.start()
						tweenGo.start()
					})
					tweenGo.start()
				})

				tweenReady.start()
			})

			tweenReady.start()
		}

		tweenMark()

		return countGroup
	}

	function createFinishBlocker(){
		var finishGroup = new Phaser.Group(game)

		var blackScreen = new Phaser.Graphics(game)
		blackScreen.alpha = 0.3
		blackScreen.beginFill(0x0)
		blackScreen.drawRect(0, 0, game.width, game.height)
		blackScreen.endFill()

		finishGroup.add(blackScreen)
        
        var nameSound = "win"
        var imgName = "Excellent"
        
        if(numberOfLifes <= 0){
            imgName = "Giveup"
            nameSound = "lose"
        }
        
        sound.play(nameSound)
        
		var excellentSign = finishGroup.create(0, 0, "atlas.mathQuiz", localization.getString(localizationData, "asset" + imgName))
		excellentSign.alpha = 0
		excellentSign.anchor.setTo(0.5, 0.5)
		excellentSign.x = game.world.centerX
		excellentSign.y = game.world.centerY - 50
		finishGroup.add(excellentSign)

		var tweenSign = game.add.tween(excellentSign).to({y: game.world.centerY, alpha: 1}, 500, Phaser.Easing.Cubic.Out)
		tweenSign.start()

		return finishGroup
	}

    function loadSounds(){
		sound.decode(assets.sounds)
	}
    
	function show(){
        
        loadSounds()
		initialize()

		var offsetScale = 0.9
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

			offsetQuestionY -= (game.world.height * 0.015) + (question.height * (1/offsetScale))
			offsetScale *= 0.6
			offsetAlpha *= 0.5
		}

		var answerArray = generateRandomAnswers(TOTAL_ANSWERS, bufferQuestions[bufferQuestions.length - (TOTAL_QUESTIONS)].question.unknown)
		optionsGroup.updateAnswers(answerArray)

		// var alphaTween = game.add.tween(sceneGroup).to({alpha: 1}, 500)
		// alphaTween.start()

		var countGroup = createCountDown()
		sceneGroup.add(countGroup)
	}

	return {
		name: "mathQuiz",
		assets: assets,
		create: create,
	}
}()
