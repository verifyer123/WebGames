var resultOpenEnglish = function(){

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
			"assetPromo": "fben"
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
			"assetPromo": "fbes"

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
		sounds: [
            {	name: "click",
				file: "sounds/pop.mp3"},
        ],
	}

	var sceneGroup

	var totalScore, totalTime, totalGoal
	var shareButton, shareText, tryAgainText
    var win
    var iconsGroup
    var buttonsActive

	var timeGoal = null

	function setScore(didWin, score){
		totalScore = score
		totalGoal = 50
		totalTime = 0
        win = didWin
        mixpanel.track(
            "finishGame",
            {"gameName": "memoOpen", "win":didWin, "numberOfObjects":score}
        );
	}
    
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    }
    
    function loadSounds(){
		sound.decode(assets.sounds)
	}

	function createAnswerCounter(totalAnswered, totalQuestions){
		var containerGroup = new Phaser.Group(sceneGroup.game)

		var background = containerGroup.create(0, 0, 'atlas.resultScreen', 'questioncounter')
		
		background.anchor.setTo(0.5, 0.5)

		var fontStyle = {font: "26px VAGRounded", fontWeight: "bold", fill: "#568f00", align: "center"}
		var trackerText = new Phaser.Text(sceneGroup.game, 0, 0, "X/Y", fontStyle)
		trackerText.anchor.setTo(0.5, 0.5)
		trackerText.x = background.width * 0.15
		trackerText.y = background.height * 0.12
		containerGroup.add(trackerText)

		var goal = totalQuestions
		var answeredQuestions = totalAnswered
        
        trackerText.text = totalScore
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


	function shareEvent(){
        
        mixpanel.track(
            "pressFacebook",
            {"gameName": "memoOpen"}
        );
        
		FB.ui({
		    method: 'share',
		    href: 'http://yogome.com/g/openEnglish/',
		    mobile_iframe: true,
		    quote: "Mi score es: " + totalScore
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
        
        mixpanel.track(
            "pressEpicPromo",
            {"gameName": "memoOpen"}
        );
	}
    
    function inputButton(obj){
        
        var parent = obj.parent
        
        changeImage(0,parent)
        sound.play("click")
        
        var scaleTween = game.add.tween(parent.scale).to({x:0.8,y:0.8}, 200, Phaser.Easing.Cubic.In, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(parent.scale).to({x:1,y:1}, 200, Phaser.Easing.Cubic.Out, true)
            changeImage(1,parent)
            
            if(parent.tag == 'share'){
                shareEvent()
            }else if(parent.tag == 'reload'){
                var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,200)
                    alphaTween.onComplete.add(function(){
                        sceneloader.show("openEnglish")
                    })
            }
        })
                                  
    }
    
    function createButtons(){
        
        var buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        var buttonNames = ['share','reload','send']
        
        var buttonTexts = ['Compartir','Reintentar','Mandar']
        
        var pivotX = game.world.centerX - 150
        var pivotY = game.world.height * 0.85
        for(var i = 0;i<buttonNames.length;i++){
            
            var fontStyle = {font: "25px VAGRounded", fontWeight: "bold", fill: "#9d9d9c", align: "center"}
        
            var retryText = new Phaser.Text(sceneGroup.game, 0, 5, buttonTexts[i], fontStyle)
            retryText.anchor.setTo(0.5,0.5)
            retryText.x = pivotX
            retryText.y = pivotY + 83   
            buttonsGroup.add(retryText)
        
            var group = game.add.group()
            group.x = pivotX
            group.y = pivotY
            buttonsGroup.add(group)
            
            group.tag = buttonNames[i]
            
            pivotX += 150
        
            var button1 = group.create(0,0,'atlas.resultScreen',buttonNames[i] + '_purp')
            button1.anchor.setTo(0.5,0.5)
            
            var button2 = group.create(0,0,'atlas.resultScreen',buttonNames[i] + '_gray')
            button2.anchor.setTo(0.5,0.5)
            
            button1.inputEnabled = true
            button1.events.onInputDown.add(inputButton)
            
            changeImage(1,group)
        }

    }
    
    function inputGame(obj){
        
        sound.play("click")
        
        if(buttonsActive == false){
            return
        }
        
        buttonsActive = false
        
        game.time.events.add(350, function(){
            if(obj.tag == 'mathquiz'){
                window.open('http://yogome.com/g/m6/es/','_self')
            }else if(obj.tag == 'pianotiles'){
                window.open('http://yogome.com/g/pianotiles/es/','_self')
            }else if(obj.tag == 'instafit'){
                window.open('http://www.yogome.com/g/instafit/','_self')
            }  
        } , this);
    
    }
    
    function createIcons(){
        
        iconsGroup = game.add.group()
        sceneGroup.add(iconsGroup)
        
        var pivotX = game.world.centerX - 174
        var pivotY = game.world.centerY +65
        
        var iconNames = ['mathquiz','pianotiles','instafit']
        var gameNames = ['Math Quiz', 'Piano Tiles', 'Instafit']
        for(var i = 0;i<iconNames.length;i++){
            
            var group = game.add.group()
            group.x = pivotX
            group.y = pivotY
            iconsGroup.add(group)
            
            var img = group.create(0,0,'atlas.resultScreen',iconNames[i] + '_icon')
            img.anchor.setTo(0.5,0.5)
            img.inputEnabled = true
            img.events.onInputDown.add(inputGame)
            img.tag = iconNames[i]
            
            var fontStyle = {font: "22px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
            var nameText = new Phaser.Text(sceneGroup.game, 0, 95, gameNames[i], fontStyle)
            nameText.anchor.setTo(0.5,0.5)
            group.add(nameText)  
            
            pivotX+=172
            
            buttonsActive = true
            
        }
    }
    
	function createScene(){
        
        loadSounds()
        
		sceneGroup = game.add.group()
		sceneGroup.alpha = 0
        
        var background = new Phaser.Graphics(game)
        background.beginFill(0x645f5e);
        background.drawRect(0, 0, game.world.width, game.world.height);
        background.endFill();
        background.anchor.setTo(0,0)
        sceneGroup.add(background)
        
        var fontStyle = {font: "37px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var retryText = new Phaser.Text(sceneGroup.game, 0, 5, "¡Sigue intentando!", fontStyle)
        retryText.anchor.setTo(0.5,0.5)
        retryText.x = game.world.centerX
        retryText.y = game.world.centerY - 300
        sceneGroup.add(retryText)
        
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var retryText = new Phaser.Text(sceneGroup.game, 0, 5, "Tu score es:", fontStyle)
        retryText.anchor.setTo(0.5,0.5)
        retryText.x = game.world.centerX
        retryText.y = game.world.centerY - 200
        sceneGroup.add(retryText)
        
        var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#79b6b9", align: "center"}
        
        var scoreText = new Phaser.Text(sceneGroup.game, 0, 5, totalScore + " pts", fontStyle)
        scoreText.anchor.setTo(0.5,0.5)
        scoreText.x = game.world.centerX
        scoreText.y = game.world.centerY - 100
        sceneGroup.add(scoreText)
        
        var bottomBar = new Phaser.Graphics(game)
        background.beginFill(0xffffff);
        background.drawRect(0, game.world.height, game.world.width, game.world.height * -0.27);
        background.endFill();
        background.anchor.setTo(0,1)
        sceneGroup.add(background)
		tweenScene = game.add.tween(sceneGroup).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, 500, true)
        
        createButtons()
        createIcons()

		
	}

	function initialize(){
		totalScore = totalScore || 0
		totalTime = totalTime || 99.99
		totalGoal = 50
	}

	return {
		assets: assets,
		name: "resultOpenEnglish",
		create: createScene,
		setScore: setScore,
		init: initialize,
	}
}()