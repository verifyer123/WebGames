var soundsPath = "../../shared/minigames/sounds/"
var result = function(){

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
				file: soundsPath + "pop.mp3"},
        ],
	}
    
    var year =  //(new Date().getFullYear() + 1) 
        2017
    var scoreTexts = [
        ['Aunque tienes algún conocimiento, todavía\n se te hace difícil diferenciar las palabras que\n se usan de manera diferente en inglés. Para ello\n puedes tomar algún curso o practicarlo más.¡Buena suerte!'],
        ['No cabe duda que tienes algún conocimiento\n del inglés, ¡pero siempre es buena idea mejorar! \nPara el ' + year + ' dedicate al estudio y practicar más,\n ya verás como mejoras. ¡Suerte!'],
        ['¡Éxito! Como nivel avanzado, tienes mucho\n conocimiento y agilidad en el lenguaje. Pensamos\n que estudiar inglés con nosotros te puede ayudar a\n cumplir tus metas del ' + year +' más rápido.']
    ]
    
	var sceneGroup

	var totalScore, totalTime, totalGoal
	var shareButton, shareText, tryAgainText
    var win
    var iconsGroup
    var buttonsActive
    var emoName

	var timeGoal = null

	function setScore(score,didWin){
		totalScore = score
		totalGoal = 50
		totalTime = 0
        win = didWin
        mixpanel.track(
            "finishGame",
            {"gameName": "openenglish3", "numberOfObjects":score}
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
            {"gameName": "openenglish3"}
        );
        
		FB.ui({
		    method: 'share',
		    href: 'http://yogome.com/games/web/openEnglish4/',
		    mobile_iframe: true,
            picture:'http://yogome.com/games/web/openenglish/images/profileImages/' + emoName + '.png',		    
            title: "Soy nivel '" + emoName + "' en inglés. Descubre tu nivel con este divertido juego."
		}, function(response){
			//console.log(button)
		});
	}

	function tryAgain(){
		sceneloader.show("openenglish4")
	}

	function createShareButton(){
		var buttonGroup = new Phaser.Group(game)

		var shareButton = buttonGroup.create(0, 0, 'atlas.resultScreen', 'retro-face')
		shareButton.anchor.setTo(0.5, 0.5)
		buttonGroup.add(shareButton)

		shareButton.inputEnabled = true
		shareButton.events.onInputUp.add(shareEvent, buttonGroup)
        
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
                        sceneloader.show("openenglish4")
                    })
            }
        })
                                  
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
    
    function createText(text,size,posX, posY){
        
        var texty = game.add.bitmapText(posX,posY, 'wFont', text, size);
        texty.anchor.setTo(0.5, 0.5)
        sceneGroup.add(texty) 
            
    }
    
    function preload(){
        game.load.bitmapFont('wFont', 'images/font/wFont.png', 'images/font/wFont.fnt');
    }
    
	function createScene(){
                
        loadSounds()
        
		sceneGroup = game.add.group()
		sceneGroup.alpha = 0
        
        var background = sceneGroup.create(0,0,'atlas.resultScreen','retro-fondo')
        background.width = game.world.width
        background.height= game.world.height * 0.38
        
        var shareBtn = createShareButton()
        shareBtn.x = game.world.centerX - 140
        shareBtn.y = game.world.height - 225
        shareBtn.scale.setTo(0.75,0.75)
        
        
        var tryAgainButton = sceneGroup.create(game.world.centerX + 140, shareBtn.y, 'atlas.resultScreen', 'retro-reintentar')
		tryAgainButton.anchor.setTo(0.5, 0.5)
        tryAgainButton.scale.setTo(0.75,0.75)

		tryAgainButton.inputEnabled = true
		tryAgainButton.events.onInputUp.add(tryAgain)
                
        var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

        var nameText = new Phaser.Text(sceneGroup.game, game.world.centerX, 50, 'Tu puntuación es:', fontStyle)
        nameText.anchor.setTo(0.5,0.5)
        sceneGroup.add(nameText)  

        var medal = sceneGroup.create(game.world.centerX, background.height * 0.58,'atlas.resultScreen','retro-medalla')
        medal.anchor.setTo(0.5,0.5)
        medal.scale.setTo(0.85,0.85)

        var fontStyle = {font: "70px VAGRounded", fontWeight: "bold", fill: "#5083f8", align: "center"}

        var nameText = new Phaser.Text(sceneGroup.game, game.world.centerX, medal.y - 45, totalScore, fontStyle)
        nameText.anchor.setTo(0.5,0.5)
        sceneGroup.add(nameText) 

        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#5083f8", align: "center"}

        var nameText = new Phaser.Text(sceneGroup.game, game.world.centerX, medal.y + 10, 'puntos', fontStyle)
        nameText.anchor.setTo(0.5,0.5)
        sceneGroup.add(nameText) 

        var bottomBar = new Phaser.Graphics(game)
        bottomBar.beginFill(0xf5f5f5);
        bottomBar.drawRect(0, game.world.height, game.world.width, -game.world.height + background.height);
        bottomBar.endFill();
        bottomBar.anchor.setTo(0,1)
        sceneGroup.add(bottomBar)

        var iconName = 'principiante'
        var iconIndex = 0

        if(totalScore >= 6){
            iconName = 'intermedio'
            iconIndex = 1
        }

        if(totalScore >= 8){
            iconName = 'avanzado'
            iconIndex = 2
        }

        emoName = iconName

        var globe = sceneGroup.create(game.world.centerX, game.world.height - 520,'atlas.resultScreen','retro-nivel')
        globe.anchor.setTo(0.5,0.5)
        globe.scale.setTo(0.85,0.85)

        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#9f9f9f", align: "center"}

        var nameText = new Phaser.Text(sceneGroup.game, game.world.centerX, globe.y - 30, 'Tu nivel de inglés es:', fontStyle)
        nameText.anchor.setTo(0.5,0.5)
        sceneGroup.add(nameText) 

        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}

        var nameText = new Phaser.Text(sceneGroup.game, game.world.centerX, globe.y +15, iconName, fontStyle)
        nameText.anchor.setTo(0.5,0.5)
        sceneGroup.add(nameText) 

        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#5083f8", align: "center"}

        var scoreText = new Phaser.Text(sceneGroup.game, game.world.centerX, globe.y + globe.height * 0.7, '¡Felicitaciones!', fontStyle)
        scoreText.anchor.setTo(0.5,0.5)
        sceneGroup.add(scoreText) 

        var textSize = 23
        if(iconIndex == 0){textSize = 20}
        var fontStyle = {font: textSize + "px VAGRounded", fontWeight: "bold", fill: "#868585", align: "center"}

        var scoreText = new Phaser.Text(sceneGroup.game, game.world.centerX, globe.y + globe.height * 1.5, scoreTexts[iconIndex], fontStyle)
        scoreText.anchor.setTo(0.5,0.5)
        sceneGroup.add(scoreText) 
        
        sceneGroup.add(shareBtn)
        sceneGroup.remove(tryAgainButton)
        sceneGroup.add(tryAgainButton)
        
		var banner = sceneGroup.create(game.world.centerX, game.world.height,'atlas.resultScreen','baner')
        banner.inputEnabled = true
        banner.events.onInputDown.add(showPromo)
        banner.anchor.setTo(0.5,1)
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, 500, true)

	}

	function initialize(){
		totalScore = totalScore || 0
		totalTime = totalTime || 99.99
		totalGoal = 50
	}

	return {
		assets: assets,
        preload:preload,
		name: "result",
		create: createScene,
		setScore: setScore,
		init: initialize,
	}
}()