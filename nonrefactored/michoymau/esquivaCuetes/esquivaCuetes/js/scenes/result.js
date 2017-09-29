var soundsPath = "../../shared/minigames/sounds/"
var imagesPath = "images/"
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
				json: imagesPath + "result/atlas.json",
				image: imagesPath + "result/atlas.png"},
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
    var gamesList
    var goalScore = 50
    var gameNumbers = null
    var scaleToUse
    var gameIndex = 0
    var icons

	var timeGoal = null

	function setScore(didWin,score,index,scale) {
        
        gamesList = yogomeGames.getGames()
        
        gameIndex = index
		totalScore = score
		totalGoal = 50
		totalTime = 0
        win = didWin
        
        scaleToUse = scale || 0.9
        mixpanel.track(
            "finishGame",
            {"gameName": gamesList[gameIndex].name, "win":didWin, "numberOfObjects":score}
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

		var background = containerGroup.create(0, 0,'cuidado')
		
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
		return containerGroup
	}


	function shareEvent(){
        mixpanel.track(
            "pressFacebook",
            {"gameName": gamesList[gameIndex].name}
        );
		FB.ui({
		    method: 'share',
		    href: gamesList[gameIndex].url,
		    mobile_iframe: true,
		    title: localization.getString(localizationData,"myScore") + totalScore
		}, function(response){
			//console.log(button)
		});
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
                        sceneloader.show(gamesList[gameIndex].sceneName)
                    })
            }
        })
                                  
    }
    
    function createButtons(pivot){
        
        var buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        var buttonNames = ['share','retry']
        
        var buttonTexts = ['shareES','retryES']
        
        var pivotX = game.world.centerX - 125
        var pivotY = pivot
        for(var i = 0;i<buttonNames.length;i++){
        
            var group = game.add.group()
            group.x = pivotX
            group.y = pivotY
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
  			
			var buttonText = sceneGroup.create(pivotX - 25, pivotY ,"atlas.resultScreen", buttonTexts[i])
			buttonText.anchor.setTo(0.5,0.5)
            
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
        
        var scaleSpine = 1
        var pivotButtons = game.world.centerY + 250;
        
        var tile = game.add.tileSprite(0,0,game.world.width, game.world.height, 'bgResult');
		sceneGroup.add(tile)
		
		var base = sceneGroup.create(game.world.centerX, game.world.centerY,"cuidado")
		base.anchor.setTo(0.5,0.5)
        
        var topHeight = game.world.height * 0.8  
		
        var yogotar = game.add.spine(game.world.centerX - 150,topHeight * 0.74, "yogotar");
        yogotar.scale.setTo(scaleSpine,scaleSpine)
        yogotar.setAnimationByName(0, "IDLE", true);
        yogotar.setSkinByName('dinamita');
        sceneGroup.add(yogotar);        
            
        var globo = sceneGroup.create(0,0,"globo");
        globo.anchor.setTo(0.5,0.5);
        globo.x = game.world.centerX;
        globo.y = topHeight * 0.32;        
        
        var buddy = game.add.spine(game.world.centerX + 150,topHeight * 0.75, "chispa");
        buddy.scale.setTo(scaleSpine,scaleSpine)
        buddy.setAnimationByName(0, "IDLE", true);
        buddy.setSkinByName('normal');
        sceneGroup.add(buddy);
                
        var pivotText = game.world.centerX - 120
        
        var bannerCoin = sceneGroup.create(0,0,"monedas");
        bannerCoin.anchor.setTo(0.5,0.5);
        bannerCoin.x = game.world.centerX;
        bannerCoin.y = game.world.centerY + 150;        
        var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var retryText = new Phaser.Text(sceneGroup.game, pivotText, game.world.centerY + 120, localization.getString(localizationData, "youGot") + ': ' + totalScore + ' ' + localization.getString(localizationData, "points"), fontStyle);
        sceneGroup.add(retryText);

        var bannerCoin = sceneGroup.create(0,0,"emergencias");
        bannerCoin.anchor.setTo(0.5,0.5);
        bannerCoin.x = game.world.centerX;
        bannerCoin.y = game.world.centerY + 350;          

                

		tweenScene = game.add.tween(sceneGroup).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, 500, true)
        
        createButtons(pivotButtons)
		
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
        
        game.load.bitmapFont('gotham', imagesPath + 'bitfont/gotham.png', imagesPath + 'bitfont/gotham.fnt');
        
        game.load.spine('chispa', "images/result/chispa/chispa.json");
        game.load.spine('yogotar', "images/result/yogotars/yogotar.json");
		game.load.image('great', imagesPath + 'result/great' + localization.getLanguage() + '.png');       
		game.load.image('shareText', imagesPath + 'result/share' + localization.getLanguage() + '.png'); 
		game.load.image('retryText', imagesPath + 'result/retry' + localization.getLanguage() + '.png');
        game.load.image("bgResult", "images/result/retro-pattern.png");
        game.load.image("cuidado", "images/result/cuidado.png");
        game.load.image("monedas", "images/result/monedas.png");
        game.load.image("emergencias", "images/result/emergencias.png");
        game.load.image("dinamita", "images/result/dinamita.png");
        game.load.image("globo", "images/result/globo.png");
    }
    
	return {
		assets: assets,
		name: "result",
        preload: preload,
		create: createScene,
		setScore: setScore,
		init: initialize,
	}
}()