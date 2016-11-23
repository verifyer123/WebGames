var result = function(){

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
				json: "../../shared/images/ads/atlas.json",
				image: "../../shared/images/ads/atlas.png"}
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
    var emoName

	var timeGoal = null

	function setScore(didWin, score){
		totalScore = score
		totalGoal = 50
		totalTime = 0
        win = didWin
        mixpanel.track(
            "finishGame",
            {"gameName": "openEnglish1", "win":didWin, "numberOfObjects":score}
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
        
        var button = this
		button.share.visible = false
		button.share.inputEnabled = false

		button.retry.visible = true
		button.retry.inputEnabled = true
        
        button.label.setText('Reintentar')
        button.retryText.setText('')
        
        mixpanel.track(
            "pressFacebook",
            {"gameName": "openEnglish1"}
        );
        
		FB.ui({
		    method: 'share',
		    href: 'http://yogo.me/openenglish1',
		    mobile_iframe: true,
            picture:'http://yogome.com/g/openEnglish/images/profileImages/' + emoName + '.png',		    
            title: "Soy nivel '" + emoName + "' en inglés. Descubre tu nivel con este divertido juego."
		}, function(response){
			//console.log(button)
		});
	}

	function tryAgain(){
		sceneloader.show("openenglish")
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

		var textStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#f0f0f0", align: "center"}

		var labelText = new Phaser.Text(game, 0, 0, "Comparte", textStyle)
		labelText.anchor.setTo(0.5, 0.5)
		labelText.x = shareButton.width * -0.12
		buttonGroup.add(labelText)

		buttonGroup.share = shareButton
		buttonGroup.retry = tryAgainButton
		buttonGroup.label = labelText
        
        var textStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#473bb5", align: "center"}

		var labelText = new Phaser.Text(game, 0, 0, "para reintentar", textStyle)
		labelText.anchor.setTo(0.5, 0.5)
		labelText.x = shareButton.width * 0
        labelText.y = 90
		buttonGroup.add(labelText)
        
        buttonGroup.retryText = labelText
        
		return buttonGroup
	}

	function showPromo(){
        
        mixpanel.track(
            "pressOpenEnglishLink",
            {"gameName": "openEnglish1"}
        );
        
        window.open("http://www.openenglish.com/perseverancia/?utm_medium=Post&utm_source=instagram&utm_campaign=MX-20160823-INSTAGRAMSTREAM-24_65-RTG_ALL&utm_content=LATAM-05-01-16-Campaign-May-10072016-7am&utm_id=57f791ceb9449f9f3f8b4572")

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
                        sceneloader.show("openenglish")
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
        background.beginFill(0xa00082);
        background.drawRect(0, 0, game.world.width, game.world.height);
        background.endFill();
        background.anchor.setTo(0,0)
        sceneGroup.add(background)
        
        var topBar = new Phaser.Graphics(game)
        topBar.beginFill(0x146cb2);
        topBar.drawRect(0, 0, game.world.width, 120);
        topBar.endFill();
        topBar.anchor.setTo(0,0)
        sceneGroup.add(topBar)
        
        var pointsText = sceneGroup.create(game.world.centerX,57,'atlas.resultScreen','tupuntuacion')
        pointsText.x-= pointsText.width * 0.65
        pointsText.anchor.setTo(0,0.5)
        
        var fontStyle = {font: "47px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var scoreText = new Phaser.Text(sceneGroup.game, pointsText.x + pointsText.width * 1.05 , pointsText.y +7, totalScore + " pts", fontStyle)
        scoreText.anchor.setTo(0,0.5)
        sceneGroup.add(scoreText)
        
        var levelText = sceneGroup.create(game.world.centerX, game.world.centerY - 300,'atlas.resultScreen','tunivelde')
        levelText.anchor.setTo(0.5,0.5)
        
        var iconName = 'wachu'
        
        if(totalScore >= 25){
            iconName = 'extranjero'
        }else if(totalScore >= 40){
            iconName = 'nativo'
        }
        
        emoName = iconName
        
        var icon = sceneGroup.create(levelText.x, levelText.y + 150,'atlas.resultScreen',iconName)
        icon.anchor.setTo(0.5,0.5)
        
        var oeBanner = sceneGroup.create(levelText.x, icon.y + 220,'atlas.resultScreen','OEbanner')
        oeBanner.anchor.setTo(0.5,0.5)
        oeBanner.inputEnabled = true
        oeBanner.events.onInputUp.add(showPromo)
        

        var bottomBar = new Phaser.Graphics(game)
        background.beginFill(0xffffff);
        background.drawRect(0, game.world.height, game.world.width, game.world.height * -0.27);
        background.endFill();
        background.anchor.setTo(0,1)
        sceneGroup.add(background)
		tweenScene = game.add.tween(sceneGroup).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, 500, true)
        
        var shareBtn = createShareButton()
        shareBtn.x = game.world.centerX
        shareBtn.y = game.world.height - 150
        //createButtons()
        //createIcons()

		
	}

	function initialize(){
		totalScore = totalScore || 0
		totalTime = totalTime || 99.99
		totalGoal = 50
	}

	return {
		assets: assets,
		name: "result",
		create: createScene,
		setScore: setScore,
		init: initialize,
	}
}()