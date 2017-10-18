var soundsPath = "../../shared/minigames/sounds/"
var iconsPath = "../../shared/minigames/images/icons/"
var imagesUrl = "../../shared/minigames/images/"
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
				json: imagesUrl + "result/atlas.json",
				image: imagesUrl + "result/atlas.png"},
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
    var win
    var pivotRank
    var iconsGroup
    var buttonsActive
    var haveCoupon
    var goalScore
    var gameNumbers = null
    var icons
    var gameIndex
    var gameName
    var gameIcon
    var couponData
    var rankMinigame
    var minigameId
    var skinTable
	var overlayGroup

	var timeGoal = null

	function setScore(didWin,score,index) {
        
        gameIndex = index
        getNumbers()
        gameName = icons[gameIndex].mixName
                
		totalScore = score
		totalGoal = 50
		totalTime = 0
        win = didWin
        
        mixpanel.track(
            "finishGame",
            {"gameName": gameName, "win":didWin, "numberOfObjects":score, "email":amazing.getEmail(),"gender":amazing.getGender(),"birthday":amazing.getBirthday()}
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
            {"gameName": gameName,"email":amazing.getEmail(),"gender":amazing.getGender(),"birthday":amazing.getBirthday()}
        );
        
        if(!minigameId){
            FB.ui({
		    method: 'share',
		    href: icons[gameIndex].url,
		    mobile_iframe: true,
		    title: "Mi score es: " + totalScore
            }, function(response){
                //console.log(button)
            });
        }else{
            amazing.share(totalScore,gameName)
        }
		        
	}
    
    function inputButton(obj){
        
		console.log('pressed')
		
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
                game.time.events.add(2000,function(){
                    
                    obj.active = true    
                },this)
                
            }else if(parent.tag == 'reintentar'){
				
				mixpanel.track(
					"retryGame",
					{"gameName": gameName,"email":amazing.getEmail(),"gender":amazing.getGender(),"birthday":amazing.getBirthday()}
				);
				
				mixpanel.track(
					"enterGame",
					{"gameName": gameName,"email":amazing.getEmail(),"gender":amazing.getGender(),"birthday":amazing.getBirthday()}
				);
				
                var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,200)
                    alphaTween.onComplete.add(function(){
                        sceneloader.show(gameName)
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
            
            var retryText = game.add.bitmapText(pivotX -25, pivotY, 'gothamMedium', buttonTexts[i], 27);
            retryText.anchor.setTo(0.5,0.5)
            sceneGroup.add(retryText)
            
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
            amazing.sendGameId(icons[gameNumbers[obj.index]].id)
            window.open(icons[gameNumbers[obj.index]].url,'_self')  
        } , this);
    
    }
    
    function createIcons(create){
        
        if(!create){
            return
        }
        
        iconsGroup = game.add.group()
        sceneGroup.add(iconsGroup)
        
        var pivotX = game.world.centerX - 174
        var pivotY = game.world.height - 150
        
        for(var i = 0;i<3;i++){
            
            var group = game.add.group()
            group.x = pivotX
            group.y = pivotY
            iconsGroup.add(group)
            
            var img = group.create(0,0,icons[gameNumbers[i]].iconName)
            img.anchor.setTo(0.5,0.5)
            img.inputEnabled = true
            img.events.onInputDown.add(inputGame)
            img.index = i
            
            var nameText = game.add.bitmapText(0, 100, 'gothamMedium', icons[gameNumbers[i]].name, 23);
            nameText.tint = 0x000000    
            nameText.anchor.setTo(0.5,0.5)
            nameText.lineSpacing = -10;
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
    
    function setRank(){
        
        amazing.saveScore(totalScore)
        
        minigameId = null
        minigameId = amazing.getMinigameId()
        
        if(minigameId){
            
            window.addEventListener("message", function(event){        
                if(event.data && event.data != ""){
                    var parsedData = {}
                    try {
                       var parsedData = JSON.parse(event.data)
                    }catch(e){
                       console.warn("Data is not JSON in message listener")
                    }
                    switch(parsedData.type){
                    case "rankMinigame":
                       
                        rankMinigame = parsedData.rankMinigame
                       
                        addRank()
                    }
                }
            })
        }        
    }
    
    function addRank(){
        
        //rankMinigame = 50
                
        var group = game.add.group()
        group.x = game.world.centerX
        group.y = pivotRank
        rankGroup.add(group)
        
        var text = game.add.bitmapText(0,0, 'gotham', 'Tu Puntuación', 40);
        text.tint = 0x000000
        text.anchor.setTo(0.5,0.5)
        group.add(text)
        
        var numberTrophy = 0
        
        if(rankMinigame > 1){
            numberTrophy = 1
        }
        
        if(rankMinigame > 5){
            numberTrophy = 2
        }
        
        if(rankMinigame > 10){
            numberTrophy = 3
        }
        
        if(!rankMinigame){
            rankMinigame = '--'
        }
        
        var pivotY = 90
        var pivotX = -200
        
        var trophy = group.create(pivotX,pivotY,'atlas.resultScreen','r' + numberTrophy)
        trophy.scale.setTo(0.9,0.9)
        trophy.anchor.setTo(0.5,0.5)
        
        pivotX += 80
        
        var text = game.add.bitmapText(pivotX  ,pivotY, 'gothamMedium', '#' + rankMinigame, 35);
        text.tint = 0x000000
        text.anchor.setTo(0.5,0.5)
        group.add(text)
        
        pivotX+= 110
        var coin = group.create(pivotX,pivotY,'atlas.resultScreen','coin')
        coin.anchor.setTo(0.5,0.5)
        
        var textAdd = totalScore
        
        if(totalScore == 0){
            textAdd = '' + totalScore
        }
        var text = game.add.bitmapText(coin.x + coin.width * 0.75,pivotY, 'gothamMedium', textAdd, 30);
        text.tint = 0xf82a8d
        text.anchor.setTo(0,0.5)
        group.add(text)
        
        sceneGroup.add(rankGroup)
        
        pivotX+=170
        var gameImage = group.create(pivotX, pivotY,gameIcon)
        gameImage.scale.setTo(0.75,0.75)
        gameImage.anchor.setTo(0.5,0.5)
        
        game.add.tween(group).from({alpha:0},500,Phaser.Easing.linear,true)
        
    }
    
    function getSkins(){
        
        var dataStore = amazing.getProfile()
        
        if(!dataStore){
            skinTable = [1,1,1,1]
        }else{
         
            skinTable = dataStore
        }
        
    }
    
	function createScene(){
        
        loadSounds()
        
        var showIcons = true
        
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
        var scaleSpine = 0.9
        var pivotButtons = game.world.height * 0.7
        
        if(win){
            
            textToUse = '¡Lo lograste!'
            animationToUse = "WIN"
            colorTint = 0xff269d
            scaleSpine = 1.1
            
        }
        
        if(!haveCoupon){
            
            textToUse = "¡Amazing!"
            colorTint = 0xc216ac
            animationToUse = "WIN"
            topHeight = 1.5
            scaleSpine = 1.3
            pivotButtons = game.world.height * 0.68
            
            if(minigameId){
                topHeight = 1.1
                pivotButtons+=25
            }
            
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
        sceneGroup.add(buddy)
                    
        getSkins()
        
        var addText = '_Happy'
        
        if(animationToUse == "LOSE"){
            addText = '_Sad'
        }

        var newSkin = buddy.createCombinedSkin(
            'combined', 
            animationToUse,
            'glasses' + skinTable[0] + addText,        
            'hair' +  skinTable[1], 
            'skin' + skinTable[2], 
            'torso' + skinTable[3]
        );

        buddy.setSkinByName('combined')
        
        var pivotText = game.world.centerX - 200
        
        if(!minigameId && !haveCoupon){
            
            var text = game.add.bitmapText(pivotText, topRect.height * 0.87, 'gotham', 'Obtuviste', 40);
            text.anchor.setTo(0,1)
            sceneGroup.add(text)

            var addText = ''
            if(totalScore != 1){ addText = 's'}

            var retryText = game.add.bitmapText(text.x + text.width * 1.15, text.y, 'gothamMedium', totalScore + " punto" + addText, 50);
            retryText.anchor.setTo(0,1)
            sceneGroup.add(retryText)
            
        }else{
            
            buddy.y+= 75
        }
                
        if(haveCoupon){
            
            if(!win){
                
                buddy.y -= 75
                var text = game.add.bitmapText(pivotText, topRect.height * 0.79, 'gotham', 'Necesitas', 35);
                text.anchor.setTo(0,1)
                sceneGroup.add(text)

                var retryText = game.add.bitmapText(text.x + text.width * 1.15, text.y, 'gothamMedium', goalScore + " puntos", 40);
                retryText.anchor.setTo(0,1)
                sceneGroup.add(retryText)
                
                var text = game.add.bitmapText(pivotText - 15, topRect.height * 0.89, 'gotham', 'para obtener este cupón', 35);
                text.anchor.setTo(0,1)
                sceneGroup.add(text)
                
            }else{
                
                showIcons = false
                pivotRank+=200
                                
                pivotButtons = game.world.height* 0.92
                
                var discount 
                if(couponData.discount){
                    
                    discount = couponData.discount * 100
                }
                    
                var colorToUse = couponData.color
                
                var coupon = sceneGroup.create(game.world.centerX, game.world.centerY + 40,'coupon')
                coupon.anchor.setTo(0.5,0.5)
                
                var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: colorToUse, align: "center"}
                
                if(discount){
                    
                    /*var pointsText = new Phaser.Text(sceneGroup.game, coupon.x - 10,coupon.y - coupon.height * 0.18, discount + '%', fontStyle)
                    pointsText.anchor.setTo(0,0)
                    pointsText.lineSpacing = -15
                    sceneGroup.add(pointsText)*/
                }
                
                var fontStyle = {font: "28px VAGRounded", fontWeight: "bold", fill: colorToUse, align: "center"}

                var storeText = new Phaser.Text(sceneGroup.game, coupon.x - 10, coupon.y - coupon.height * 0.18 + 15, couponData.title, fontStyle)
                storeText.anchor.setTo(0,0)
                sceneGroup.add(storeText)
                
                var fontStyle = {font: "15px VAGRounded", fontWeight: "bold", fill: colorToUse, align: "left", wordWrap: true, wordWrapWidth: 220}

                var storeText = new Phaser.Text(sceneGroup.game, coupon.x - 10, coupon.y - coupon.height * 0.18 + 60, couponData.copy, fontStyle)
                storeText.anchor.setTo(0,0)
                sceneGroup.add(storeText)

                /*var fontStyle = {font: "26px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

                var pText = new Phaser.Text(sceneGroup.game, coupon.x + coupon.width * 0.42, coupon.y + coupon.height * 0.34, discount + '%', fontStyle)
                pText.anchor.setTo(0.5,0.5)
                pText.angle = -15
                sceneGroup.add(pText)*/
                                         
            }
            
        }

		tweenScene = game.add.tween(sceneGroup).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, 500, true)
        
        createButtons(pivotButtons)
        createIcons(showIcons)
		createOverlay()
        
        //addRank()
	}
	
	function createOverlay(){
		
		overlayGroup = game.add.group()
		overlayGroup.alpha = 0
		overlayGroup.y-= game.world.height
		sceneGroup.add(overlayGroup)
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width, game.world.height)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
		rect.events.onInputDown.add(inputOverlay)
		rect.tag = 'quitOverlay'
		overlayGroup.add(rect)
		
		var back = overlayGroup.create(game.world.centerX,game.world.centerY,'atlas.resultScreen','fondo')
		back.anchor.setTo(0.5,0.5)
		back.inputEnabled = true
		
		var icon = overlayGroup.create(back.x,back.y - 100,'atlas.resultScreen','iphoneIcon')
		icon.anchor.setTo(0.5,0.5)
		
		var closeBtn = overlayGroup.create(back.x + back.width * 0.35,back.y - back.height * 0.4,'atlas.resultScreen','cerrar')
		closeBtn.anchor.setTo(0.5,0.5)
		closeBtn.inputEnabled = true
		closeBtn.events.onInputDown.add(inputOverlay)
		closeBtn.tag = 'quitOverlay'
		
		var downloadButton = game.add.group()
		downloadButton.x = back.x
		downloadButton.y = back.y + back.height * 0.37
		overlayGroup.add(downloadButton)
			
		var imgBtn = downloadButton.create(-5,0,'atlas.resultScreen','boton')
		imgBtn.inputEnabled = true
		imgBtn.events.onInputDown.add(inputOverlay)
		imgBtn.tag = 'download'
		imgBtn.anchor.setTo(0.5,0.5)
		
		var nameText = game.add.bitmapText(0, 4, 'gothamMedium', 'Descargar', 25);
		nameText.tint = 0xffffff   
		nameText.anchor.setTo(0.5,0.5)
		downloadButton.add(nameText)
		
		var nameText = game.add.bitmapText(back.x, back.y + 50, 'gothamMedium', '¿ Te gusta ?', 40);
		nameText.tint = 0xffffff   
		nameText.anchor.setTo(0.5,0.5)
		overlayGroup.add(nameText)
		
		var nameText = game.add.bitmapText(back.x - 112, back.y + 50, 'gothamMedium', '?', 40);
		nameText.tint = 0xffffff   
		nameText.anchor.setTo(0.5,0.5)
		nameText.angle = 180
		overlayGroup.add(nameText)
		
		var nameText = game.add.bitmapText(back.x, back.y + 110, 'gotham', '¡Descarga nuestra app!', 28);
		nameText.anchor.setTo(0.5,0.5)
		overlayGroup.add(nameText)
		
		
		if(!couponData && !game.device.desktop && !amazing.getMinigameId()){
			
			overlayGroup.y+= game.world.height
			overlayGroup.alpha = 1
			game.add.tween(overlayGroup).from({alpha:0,y:overlayGroup.y - game.world.height},500,"Linear",true)
		}
	}
	
	function inputOverlay(obj){
		
		var tag = obj.tag
		
		if(tag == 'quitOverlay'){
			
			obj.inputEnabled = false
			game.add.tween(overlayGroup).to({alpha : 0, y: overlayGroup.y - game.world.height},500,"Linear",true)
			
		}else if(tag == 'download'){
			
			sound.play("click")
			var parent = obj.parent
			
			obj.inputEnabled = false
			var tween = game.add.tween(parent.scale).to({x:0.8,y:0.8},100,"Linear",true,0,0)
			tween.yoyo(true,0)
			
			var url = "https://play.google.com/store/apps/details?id=com.getin.amazing&hl=es"
			
			if(!game.device.android){
				url = "https://itunes.apple.com/mx/app/amazing-by-getin/id1176752172?l=en&amp;mt=8"
			}
			
			tween.onComplete.add(function(){
				
				if(!game.device.mobileSafari){
					window.open(url,'_blank')  
				}else{
					
					window.location = 'itms-apps://itunes.apple.com/mx/app/amazing-by-getin/id1176752172?l=en&amp;mt=8';
					//window.location.replace("https://itunes.apple.com/mx/app/amazing-by-getin/id1176752172?l=en&amp;mt=8");
				}
				
				obj.inputEnabled = true
			})
			
		}
		
	}
	
	function initialize(){
        
		totalScore = totalScore || 0
		totalTime = totalTime || 99.99
		totalGoal = 50
        
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
        
        pivotRank = game.world.centerY - 10
        
        couponData = amazing.getCoupon()
        
        sceneGroup = game.add.group()
		sceneGroup.alpha = 0
        
        rankGroup = game.add.group()
        
        setRank()
                
        if(!couponData){
            haveCoupon = false
        }else{
            haveCoupon = true
            //game.load.image('coupon','http://amazingyogome.appspot.com' + couponData.couponImage)
            game.load.image('coupon',imagesUrl + 'coupons/' + gameName + '.png')
            goalScore = couponData.scoreGoal
        }
                        
        /*var file = {            
            type: 'image',            
            key: 'coupon',            
            url: 'http://amazingyogome.appspot.com/img/coupons/bg_chilimbalam.png',            
            data: null,            
            error: false,            
            loaded: false        
        };     
        
        file.data = new Image();        
        file.data.name = file.key;        
        file.data.onload = function () {            
            file.loaded = true;            
            game.cache.addImage(file.key, file.url, file.data);        
        };  
        
        file.data.onerror = function () {            
            file.error = true;        
        };        
        
        file.data.crossOrigin = '*';        
        file.data.src = file.url;*/
                        
        game.load.bitmapFont('gotham', imagesUrl + 'bitfont/gotham.png', imagesUrl + 'bitfont/gotham.fnt');
        game.load.bitmapFont('gothamMedium', imagesUrl + 'bitfont/gothamMedium.png', imagesUrl + 'bitfont/gothamMedium.fnt');
        
        game.load.spine('amazing', imagesUrl + "spines/skeleton.json");
        
        for(var i = 0; i<3;i++){
            
            var iconName = icons[gameNumbers[i]].iconName
            game.load.image(iconName, iconsPath + iconName+ '.png');
        }
        
        gameIcon = icons[gameIndex].iconName
        console.log(gameIcon + ' name')
        game.load.image(gameIcon, iconsPath + gameIcon + '.png')
        
        
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