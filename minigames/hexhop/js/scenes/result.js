var soundsPath = "../../shared/minigames/sounds/"
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
    var haveCoupon
    var goalScore = 50

	var timeGoal = null

	function setScore(didWin,score){
		totalScore = score
		totalGoal = 50
		totalTime = 0
        win = didWin
        mixpanel.track(
            "finishGame",
            {"gameName": "hexhop", "win":didWin, "numberOfObjects":score}
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
            {"gameName": "hexhop"}
        );
        
		FB.ui({
		    method: 'share',
		    href: 'http://amazingapp.co/juegos/hexhop/',
		    mobile_iframe: true,
		    title: "Mi score es: " + totalScore
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
        
        var scaleTween = game.add.tween(parent.scale).to({x:0.8,y:0.8}, 200, Phaser.Easing.Cubic.In, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(parent.scale).to({x:1,y:1}, 200, Phaser.Easing.Cubic.Out, true)
            changeImage(1,parent)
            
            if(parent.tag == 'compartir'){
                shareEvent()
            }else if(parent.tag == 'reintentar'){
                var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,200)
                    alphaTween.onComplete.add(function(){
                        sceneloader.show("hexhop")
                    })
            }
        })
                                  
    }
    
    function createButtons(pivot){
        
        var buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        var buttonNames = ['compartir','reintentar']
        
        var buttonTexts = ['Compartir','Reintentar']
        
        var pivotX = game.world.centerX - 125
        var pivotY = pivot
        for(var i = 0;i<buttonNames.length;i++){
        
            var group = game.add.group()
            group.x = pivotX
            group.y = pivotY
            buttonsGroup.add(group)
            
            group.tag = buttonNames[i]
        
            var button1 = group.create(0,0,'atlas.resultScreen',buttonNames[i])
            button1.anchor.setTo(0.5,0.5)
            
            var button2 = group.create(0,0,'atlas.resultScreen',buttonNames[i])
            button2.anchor.setTo(0.5,0.5)
            
            button1.inputEnabled = true
            button1.events.onInputDown.add(inputButton)
            button1.active = true
            
            changeImage(1,group)
            
            var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
            var retryText = new Phaser.Text(sceneGroup.game, 0, 5, buttonTexts[i], fontStyle)
            retryText.anchor.setTo(0.5,0.5)
            retryText.x = pivotX -25
            retryText.y = pivotY + 5
            buttonsGroup.add(retryText)
            
            pivotX += 250
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
                window.open('http://amazingapp.co/juegos/amazingbros/','_self')
            }else if(obj.tag == 'costena'){
                window.open('http://amazingapp.co/juegos/costena/','_self')
            }else if(obj.tag == 'lluvia'){
                window.open('http://amazingapp.co/juegos/chilimbalam/','_self')
            }  
        } , this);
    
    }
    
    function createIcons(){
        
        iconsGroup = game.add.group()
        sceneGroup.add(iconsGroup)
        
        var pivotX = game.world.centerX - 174
        var pivotY = game.world.height - 150
        
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
            
            var fontStyle = {font: "22px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        
            var nameText = new Phaser.Text(sceneGroup.game, 0, 110, gameNames[i], fontStyle)
            nameText.lineSpacing = -10;
            nameText.anchor.setTo(0.5,0.5)
            group.add(nameText)  
            
            pivotX+=172
            
            buttonsActive = true
            
        }
    }
    
    function checkPosObj(obj){
        
        var posX = obj.x
        var posY = obj.y
        
        var samePos = false
        for(var i = 0;i<gameIconsGroup.length;i++){
            var obj = gameIconsGroup.children[i]
            if(Math.abs(obj.x - posX) < 70 && Math.abs(obj.y - posY) < 70){
                samePos = true
            }
        }
        return samePos
        
    }
    
    function placeIcons(){
        
        gameIconsGroup = game.add.group()
        sceneGroup.add(gameIconsGroup)
        
        for(var i = 0;i<8;i++){
            
            var offset = 1
            if(i>3){offset = -1}
            
            var iconName = i+1

            if(i>5){
                iconName = 4
            }
            if(i > 6){
                iconName = 1
            }
            
            var icon = sceneGroup.create(game.world.centerX + game.rnd.integerInRange(100, game.world.width * 0.35) * offset, game.rnd.integerInRange(100, sceneGroup.topRect.height * 0.75),'atlas.resultScreen','' + iconName)
            icon.anchor.setTo(0.5,0.5)
            
            //console.log(iconName + ' index')
            
            while (checkPosObj(icon)){
                icon.x = game.world.centerX + game.rnd.integerInRange(75, game.world.width * 0.4) * offset
                icon.y = game.rnd.integerInRange(100, sceneGroup.topRect.height * 0.75)
            }
            
            sceneGroup.remove(icon)
            gameIconsGroup.add(icon)
        }
        
    }
    
	function createScene(){
        
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
        
        var textToUse = '¡Sigue intentando!'
        var animationToUse = "LOSE"
        var colorTint = 0x2d8dff
        var topHeight = 1
        var scaleSpine = 1.3
        var pivotButtons = game.world.height * 0.7
        
        if(win){
            
            textToUse = '¡Lo lograste!'
            animationToUse = "WIN"
            colorTint = 0xff269d
            
        }
        
        if(!haveCoupon){
            
            textToUse = "¡Genial!"
            colorTint = 0xc216ac
            animationToUse = "WIN"
            topHeight = 1.5
            scaleSpine = 1.7
            pivotButtons = game.world.height * 0.68
            
        }
        
        
        var topRect = sceneGroup.create(0,0,'atlas.resultScreen','fondo_result')
        topRect.width = game.world.width
        topRect.height*= topHeight
        topRect.tint = colorTint
        sceneGroup.topRect = topRect
        
        placeIcons()
        
        var text = game.add.bitmapText(game.world.centerX, topRect.height * 0.1, 'gotham', textToUse, 45);
        text.anchor.setTo(0.5,0.5)
        sceneGroup.add(text)
        
        var buddy = game.add.spine(game.world.centerX,topRect.height * 0.68, "amazing");
        buddy.scale.setTo(scaleSpine,scaleSpine)
        buddy.setAnimationByName(0, animationToUse, true);
        buddy.setSkinByName('Amaizing');
        sceneGroup.add(buddy)
        
        var pivotText = game.world.centerX - 200
        
        var text = game.add.bitmapText(pivotText, topRect.height * 0.8, 'gotham', 'Obtuviste', 40);
        sceneGroup.add(text)
        
        var addText = ''
        if(totalScore != 1){ addText = 's'}
        
        var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var retryText = new Phaser.Text(sceneGroup.game, text.x + text.width * 1.15, text.y - 15, totalScore + " punto" + addText, fontStyle)
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
        createIcons()

		
	}

	function initialize(){
		totalScore = totalScore || 0
		totalTime = totalTime || 99.99
		totalGoal = 50
        haveCoupon = false
        game.stage.backgroundColor = "#ffffff"
	}
    
    function preload(){
        game.load.bitmapFont('gotham', 'images/bitFont/Gotham.png', 'images/bitFont/Gotham.fnt');
        
        game.load.spine('amazing', "images/spines/Amaizing.json");
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