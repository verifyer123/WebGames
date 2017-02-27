var soundsPath = "../../shared/minigames/sounds/"
var iconsPath = "../../shared/minigames/images/icons/"
var result = function(){

	localizationData = {
		"EN":{
            "youGot":"You got ",
            "points":"coins",
            "Great":"Great",
            "share":"Share",
            "retry":"Retry",
            "myScore":"My score is: ",
            "download":"Download"
            
		},

		"ES":{
            "youGot":"Obtuviste ",
            "points":"monedas",
            "Great":"Genial",
            "share":"Compartir",
            "retry":"Reintentar",
            "myScore":"Mi score es: ",
            "download":"Descargar"
            
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
    var haveCoupon
    var goalScore = 50
    var gameNumbers = null
    var gameIndex = 0
    var icons

	var timeGoal = null

	function setScore(didWin,score) {
		totalScore = score
		totalGoal = 50
		totalTime = 0
        win = didWin
        mixpanel.track(
            "finishGame",
            {"gameName": "additionDojo", "win":didWin, "numberOfObjects":score}
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
            {"gameName": "additionDojo"}
        );
        
		FB.ui({
		    method: 'share',
		    href: 'http://yogome.com/epic/minigames/yogomeRunner/yogome.html',
		    mobile_iframe: true,
		    title: localization.getString(localizationData,"myScore") + totalScore
		}, function(response){
			//console.log(button)
		});
	}

	function tryAgain(){
		sceneloader.show("creatPianoTiles")
	}
    
    function inputButton(obj){
        
        if(obj.active == false){
            return
        }
        
        obj.active = false
        
        var parent = obj.parent
        
        changeImage(0,parent)
        sound.play("click")
        
        var origScale = parent.scale.x
        var scaleTween = game.add.tween(parent.scale).to({x:(origScale - 0.2),y:origScale - 0.2}, 200, Phaser.Easing.Cubic.In, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(parent.scale).to({x:origScale,y:origScale}, 200, Phaser.Easing.Cubic.Out, true)
            changeImage(1,parent)
            
            if(parent.tag == 'share'){
                shareEvent()
            }else if(parent.tag == 'retry'){
                var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,200)
                    alphaTween.onComplete.add(function(){
                        sceneloader.show("dojo")
                    })
            }
        })
                                  
    }
    
    function createButtons(pivot){
        
        var buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        var buttonNames = ['share','retry']
        
        var buttonTexts = ['share','retry']
        
        var pivotX = game.world.centerX - 125
        var pivotY = pivot
        for(var i = 0;i<buttonNames.length;i++){
        
            var group = game.add.group()
            group.x = pivotX
            group.y = pivotY
            group.scale.setTo(0.8,0.8)
            buttonsGroup.add(group)
            
            group.tag = buttonNames[i]
        
            var button1 = group.create(0,0,'atlas.resultScreen',buttonNames[i] + 'off')
            button1.anchor.setTo(0.5,0.5)
            
            var button2 = group.create(0,0,'atlas.resultScreen',buttonNames[i] + 'on')
            button2.anchor.setTo(0.5,0.5)
            
            button1.inputEnabled = true
            button1.events.onInputDown.add(inputButton)
            button1.active = true
            
            changeImage(1,group)
            
            var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
            var retryText = new Phaser.Text(sceneGroup.game, -button1.width * 0.15, 5, localization.getString(localizationData,buttonTexts[i]), fontStyle)
            retryText.anchor.setTo(0.5,0.5)
            retryText.x = pivotX - 15
            retryText.y = pivotY + 5
            buttonsGroup.add(retryText)
            
            pivotX += 250
        }

    }
    
    function checkPosObj(obj){
        
        var posX = obj.x
        var posY = obj.y
        
        var samePos = false
        for(var i = 0;i<gameIconsGroup.length;i++){
            var obj = gameIconsGroup.children[i]
            if(Math.abs(obj.x - posX) < 150 && Math.abs(obj.y - posY) < 150){
                samePos = true
            }
        }
        return samePos
        
    }
    
    
    function placeIcons(){
        
        gameIconsGroup = game.add.group()
        sceneGroup.add(gameIconsGroup)
        
        for(var i = 0;i<4;i++){
            
            var offset = 1
            if(i>1){offset = -1}
            
            var iconName = i+1

            if(i>5){
                iconName = 4
            }
            if(i > 6){
                iconName = 1
            }
            
            var icon = sceneGroup.create(game.world.centerX + game.rnd.integerInRange(100, game.world.width * 0.35) * offset, game.rnd.integerInRange(135, game.world.height * 0.5),'atlas.resultScreen','coin')
            icon.anchor.setTo(0.5,0.5)
            
            //console.log(iconName + ' index')
            
            while (checkPosObj(icon)){
                icon.x = game.world.centerX + game.rnd.integerInRange(75, game.world.width * 0.4) * offset
                icon.y = game.rnd.integerInRange(100, sceneGroup.topHeight * 0.75)
            }
            
            sceneGroup.remove(icon)
            gameIconsGroup.add(icon)
            
            game.add.tween(icon).to( { x:icon.x + game.rnd.integerInRange(10,50),y:icon.y + game.rnd.integerInRange(10,50) }, 500, "Linear", true, 0, -1).yoyo(true, 0);
        }
        
    }
    
    function createBackground(){
        
        var pivotX = 0
        var pivotY = 0
        var image
        
        while(pivotX < game.world.width){
            
            pivotY = 0
            while(pivotY < game.world.height){
                
                image = sceneGroup.create(pivotX, pivotY,'atlas.resultScreen','retro-pattern')
                pivotY+=image.height * 0.99

            }
            pivotX+= image.width * 0.99
            
        }
    }
    
    function addCoins(){
        
        
        
    }
    
	function createScene(){
        
        //console.log(icons[0].name + ' name')
        if(game.device.desktop){
            haveCoupon = false
        }
        
        loadSounds()
        
		sceneGroup = game.add.group()
		sceneGroup.alpha = 0
        
        var background = new Phaser.Graphics(game)
        background.beginFill(0xffffff);
        background.drawRect(0, 0, game.world.width, game.world.height);
        background.endFill();
        background.anchor.setTo(0,0)
        sceneGroup.add(background)
        
        var win = totalScore >= goalScore
        
        var scaleSpine = 0.9
        var pivotButtons = game.world.height * 0.725
        
        
        createBackground()
        
        var topHeight = game.world.height * 0.8
        
        placeIcons()
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

        var pointsText = new Phaser.Text(sceneGroup.game, game.world.centerX, topHeight * 0.1, localization.getString(localizationData, "Great"), fontStyle)
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)     
        
        var fontStyle = {font: "75px VAGRounded", fontWeight: "bold", fill: "#ffff00", align: "center"}
        
        var pointsText2 = new Phaser.Text(sceneGroup.game, game.world.centerX + pointsText.width * 0.7, topHeight * 0.1, "!", fontStyle)
        pointsText2.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText2)  
        
        if(localization.getLanguage() == "ES"){
            var pointsText2 = new Phaser.Text(sceneGroup.game, game.world.centerX - pointsText.width * 0.7, topHeight * 0.1, "¡", fontStyle)
            pointsText2.anchor.setTo(0.5,0.5)
            sceneGroup.add(pointsText2) 
        }
        
        var buddy = game.add.spine(game.world.centerX,topHeight * 0.68, "master");
        buddy.scale.setTo(scaleSpine,scaleSpine)
        buddy.setAnimationByName(0, "WIN", true);
        buddy.setSkinByName('normal');
        sceneGroup.add(buddy)
                
        var pivotText = game.world.centerX - 200
        
        var text = game.add.bitmapText(pivotText, topHeight * 0.77, 'gotham', localization.getString(localizationData, "youGot") + ':', 40);
        sceneGroup.add(text)
        
        var addText = ''
        if(totalScore != 1){ addText = 's'}
        
        var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var retryText = new Phaser.Text(sceneGroup.game, text.x + text.width * 1.15, text.y - 15, totalScore + ' ' + localization.getString(localizationData, "points"), fontStyle)
        sceneGroup.add(retryText)
                
        if(haveCoupon){
            
            if(!win){
                var needText = game.add.bitmapText(game.world.centerX - 190, game.world.centerY , 'gotham', 'Necesitas', 40);
                needText.anchor.setTo(0,0.5)
                needText.tint = 0x9d1760
                sceneGroup.add(needText)

                var fontStyle = {font: "43px VAGRounded", fontWeight: "bold", fill: "#9d1760", align: "center"}

                var pointsText = new Phaser.Text(sceneGroup.game, needText.x + needText.width * 1.1, needText.y,   goalScore + ' puntos', fontStyle)
                pointsText.anchor.setTo(0,0.5)
                sceneGroup.add(pointsText)

                var text = game.add.bitmapText(needText.x - 50, needText.y + 60, 'gotham', 'para obtener este cupón', 40);
                text.anchor.setTo(0,0.5)
                text.tint = 0x9d1760
                sceneGroup.add(text)
            }else{
                
                var imageExist = game.cache.getFrameByName('atlas.resultScreen','coupon')
                
                if(imageExist){
                    
                    var coupon = sceneGroup.create(game.world.centerX, game.world.centerY + 50,'atlas.resultScreen','coupon')
                    coupon.anchor.setTo(0.5,0.5)
                    
                }
            }
            
            
        }

		tweenScene = game.add.tween(sceneGroup).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, 500, true)
        
        createButtons(pivotButtons)
        createBanner()
		
	}
    
    function inputBanner(obj){
        
        if(!obj.active){
            return
        }
        
        obj.active = false
        
        game.time.events.add(1000,function(){
            obj.active = true
        },this)
        
        var url = "https://play.google.com/store/apps/details?id=com.yogome.EpicKnowledge"
        
        if(!game.device.android){
            url = "https://itunes.apple.com/mx/app/epic-heroes-of-knowledge/id904827467?mt=8"
        }
        
        window.open(url,'_blank')  
        
    }
    
    function createBanner(){
        
        var banner = game.add.group()
        banner.x = game.world.centerX
        banner.y = game.world.height
        sceneGroup.add(banner)
        
        var bannerImage = banner.create(0,0,'atlas.resultScreen','banner')
        bannerImage.anchor.setTo(0.5,1)
        bannerImage.inputEnabled = true
        bannerImage.active = true
        bannerImage.events.onInputDown.add(inputBanner)
        
        var fontStyle = {font: "26px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
		var trackerText = new Phaser.Text(sceneGroup.game, -100,-40, localization.getString(localizationData,"download"), fontStyle)
		trackerText.anchor.setTo(0.5, 0.5)
        banner.add(trackerText)
        
    }

	function initialize(){
        
		totalScore = totalScore || 0
		totalTime = totalTime || 99.99
		totalGoal = 50
        haveCoupon = false
        game.stage.backgroundColor = "#ffffff"
	}
    
    function checkNumbers(number){
        
        var equal = false
        for(var i = 0; i < gameNumbers.length; i++){
            
            //console.log(number + ' number, ' + gameIndex + ' index, ' + gameNumbers[i] + ' gameNumbers' )
            if(number == gameNumbers[i]){
                equal = true
            }
        }
        
        if(number == gameIndex){
            equal = true
        }
        
        return equal
    }
    
    function getNumbers(){
        
        icons = amazing.getGames()
        gameNumbers = []
        
        for(var o = 0; o < 3;o++){
            
            var number = gameIndex
            gameNumbers[o] = number

            while(checkNumbers(number)){
                number = game.rnd.integerInRange(0, icons.length - 1)
            }
            
            gameNumbers[o] = number
            
        }
        
        //console.log(gameNumbers + ' numbers')
        
        Phaser.ArrayUtils.shuffle(gameNumbers)
    }
    
    function preload(){
        
        game.load.bitmapFont('gotham', 'images/bitfont/gotham.png', 'images/bitfont/gotham.fnt');
        
        //game.load.spine('amazing', "images/spines/Amaizing.json");
        game.load.spine('master', "images/spines/skeleton.json");
        
        //getNumbers()
        
        /*for(var i = 0; i<3;i++){
            var iconName = icons[gameNumbers[i]].iconName
            game.load.image(iconName, iconsPath + iconName+ '.png');
        }*/
        
        
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