var soundsPath = '/../minigames/gamesounds/'
var result = function(){

	localizationData = {
		"EN":{

		},

		"ES":{

		}
	}

	var assets = {
		atlases: [
			{
				name: 'atlas.resultScreen',
				json: "images/result/atlas.json",
				image: "images/result/atlas.png"},
		],
		images: [
			
		],
		sounds: [
            {	name: "click",
				file: soundsPath + "pop.mp3"},
        ],
	}

	var sceneGroup

	var totalScore, totalTime, totalGoal
	var shareButton, shareText, tryAgainText
    var win
    var iconsGroup
    var buttonsActive
    var goalScore = 50

	var timeGoal = null

	function setScore(didWin, score){
		totalScore = score
		totalGoal = 50
		totalTime = 0
        win = didWin
        mixpanel.track(
            "finishGame",
            {"gameName": "chilimBalam", "win":didWin, "numberOfObjects":score}
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
            {"gameName": "chilimBalam"}
        );
        
		FB.ui({
		    method: 'share',
		    href: 'http://amazingapp.co/juegos/runner/',
		    mobile_iframe: true,
		    title: "Mi score es: " + totalScore
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
            {"gameName": "chilimBalam"}
        );
	}
    
    function inputButton(obj){
        
        if(obj.active == false){
            return
        }
        
        obj.active = false
        
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
                        sceneloader.show("lacomer")
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
            
            var fontStyle = {font: "25px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
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
        
            var button1 = group.create(0,0,'atlas.resultScreen',buttonNames[i] + '_on')
            button1.anchor.setTo(0.5,0.5)
            
            var button2 = group.create(0,0,'atlas.resultScreen',buttonNames[i] + '_off')
            button2.anchor.setTo(0.5,0.5)
            
            button1.inputEnabled = true
            button1.events.onInputDown.add(inputButton)
            button1.active = true
            
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
            if(obj.tag == 'bros'){
                window.open('http://amazingapp.co/juegos/runner/','_self')
            }else if(obj.tag == 'costena'){
                window.open('http://amazingapp.co/juegos/costena/','_self')
            }else if(obj.tag == 'lluvia'){
                window.open('http://amazingapp.co/juegos/chilimBalam/','_self')
            }  
        } , this);
    
    }
    
    function createIcons(){
        
        iconsGroup = game.add.group()
        sceneGroup.add(iconsGroup)
        
        var pivotX = game.world.centerX - 174
        var pivotY = game.world.centerY +70
        
        var iconNames = ['bros','costena','lluvia']
        var gameNames = ['Amazing Bros', 'Memorama \ndel Sabor', 'Lluvia de \nGomitas']
        for(var i = 0;i<iconNames.length;i++){
            
            var group = game.add.group()
            group.x = pivotX
            group.y = pivotY
            iconsGroup.add(group)
            
            var img = group.create(0,0,'atlas.resultScreen',iconNames[i])
            img.anchor.setTo(0.5,0.5)
            img.inputEnabled = true
            img.events.onInputDown.add(inputGame)
            img.tag = iconNames[i]
            
            var fontStyle = {font: "22px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
            var nameText = new Phaser.Text(sceneGroup.game, 0, 110, gameNames[i], fontStyle)
            nameText.lineSpacing = -10;
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
        background.beginFill(0x951384);
        background.drawRect(0, 0, game.world.width, game.world.height);
        background.endFill();
        background.anchor.setTo(0,0)
        sceneGroup.add(background)
        
        var topRect = new Phaser.Graphics(game)
        topRect.beginFill(0x2e77ce);
        topRect.drawRect(0, 0, game.world.width, 100);
        topRect.endFill();
        topRect.anchor.setTo(0,0)
        sceneGroup.add(topRect)
        
        var text = game.add.bitmapText(game.world.centerX, 60, 'gotham', '¡Sigue intentando!', 35);
        text.anchor.setTo(0.5,0.5)
        sceneGroup.add(text)
        
        var retryCharacter = sceneGroup.create(game.world.centerX - 220, game.world.centerY - 200,'atlas.resultScreen','retro-personaje')
        retryCharacter.anchor.setTo(0.5,0.5)
        
        var pivotText = retryCharacter.x + retryCharacter.width * 0.6
        
        var text = game.add.bitmapText(pivotText, game.world.centerY - 270, 'gotham', 'Tuviste', 35);
        sceneGroup.add(text)
        
        var fontStyle = {font: "43px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var retryText = new Phaser.Text(sceneGroup.game, text.x + text.width * 1.15, -10, totalScore + " puntos", fontStyle)
        //retryText.x = pivotText
        retryText.y = game.world.centerY - 282
        sceneGroup.add(retryText)
        
        sceneGroup.add(retryText)
        
        var text = game.add.bitmapText(pivotText, game.world.centerY - 210, 'gotham', 'Obtén un nuevo', 35);
        sceneGroup.add(text)
        
        var scoreText = game.add.bitmapText(pivotText, game.world.centerY - 150, 'gotham', 'cupón por', 35);
        sceneGroup.add(scoreText)
        
        var fontStyle = {font: "43px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var retryText = new Phaser.Text(sceneGroup.game, scoreText.x + scoreText.width * 1.1, -10, goalScore + " puntos", fontStyle)
        //retryText.x = pivotText
        retryText.y = game.world.centerY - 162
        sceneGroup.add(retryText)
        
        var bottomBar = new Phaser.Graphics(game)
        background.beginFill(0x770b6d);
        background.drawRect(0, game.world.height, game.world.width, game.world.height * -0.55);
        background.endFill();
        background.anchor.setTo(0,1)
        sceneGroup.add(background)
        
        var bottomBar = new Phaser.Graphics(game)
        background.beginFill(0x383838);
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
        game.stage.backgroundColor = "#ffffff"
	}
    
    function preload(){
        game.load.bitmapFont('gotham', 'images/bitFont/Gotham.png', 'images/bitFont/Gotham.fnt');
    }
    
	return {
		assets: assets,
		name: "result",
		create: createScene,
        preload: preload,
		setScore: setScore,
		init: initialize,
	}
}()