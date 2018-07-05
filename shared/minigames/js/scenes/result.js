var soundsPath = "../../shared/minigames/sounds/"
var iconsPath = "../../shared/minigames/images/gameIcons/"
var imagesUrl = "../../shared/minigames/images/"
var jsonData = "../../shared/minigames/amazing.json"

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

    var DELTA_ASWERS = 50
    var DELTA_QUESTION = 400
    var DELTA_DOTS = 30
    var INITIAL_HEIGTH = 700

    var DELTA_SPECIAL_CUPON_SLIDER = 420

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
	var pollOverlay
    var currentCouponId

	var timeGoal = null
    var webCoupon

    var pollOptions = []
    var currentQuestion
    var questionsGroup
    var dotsGroup
    var inSlide, firstTouchX
    var inPoll
    var currentOpenQuestion

    var topStandarheigth, buttonSendHeigth
    var inSlideMovement

    var specialCupon
    var slideNumber
    var cuponSliderGroup

	function setScore(didWin,score,index) {

        gameIndex = index
        getNumbers()
        gameName = icons[gameIndex].mixName

		totalScore = score
		totalGoal = 1
		totalTime = 0
        win = didWin
        //if(icons[gameIndex].demo==null){
            /*mixpanel.track(
                "finishGame",
                {"gameName": gameName, "win":didWin, "numberOfObjects":score, "email":amazing.getEmail(),"gender":amazing.getGender(),"birthday":amazing.getBirthday()}
            );*/

        amazing.setMixPanelTrack(gameName,"finishGame",didWin,score)
        //}

        var fontStyle = {font: "23px Gotham bold", fill: "#808080"}
        var text = new Phaser.Text(game, -100, -100,"test", fontStyle)
        fontStyle = {font: "23px Gotham", fill: "#808080"}
        text = new Phaser.Text(game, -100, -100,"test", fontStyle)
        fontStyle = {font: "23px Gotham light", fill: "#808080"}
        text = new Phaser.Text(game, -100, -100,"test", fontStyle)
        fontStyle = {font: "23px Gotham Book", fill: "#808080"}
        text = new Phaser.Text(game, -100, -100,"test", fontStyle)

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

		return containerGroup
	}


	function shareEvent(){
        //if(icons[gameIndex].demo==null){
            /*mixpanel.track(
                "pressFacebook",
                {"gameName": gameName,"email":amazing.getEmail(),"gender":amazing.getGender(),"birthday":amazing.getBirthday()}
            );*/
            amazing.setMixPanelTrack(gameName,"pressFacebook")
        //}

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

		//console.log('pressed')

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
                //if(icons[gameIndex].demo==null){
    				/*mixpanel.track(
    					"retryGame",
    					{"gameName": gameName,"email":amazing.getEmail(),"gender":amazing.getGender(),"birthday":amazing.getBirthday()}
    				);*/
                    amazing.setMixPanelTrack(gameName,"retryGame")

    				/*mixpanel.track(
    					"enterGame",
    					{"gameName": gameName,"email":amazing.getEmail(),"gender":amazing.getGender(),"birthday":amazing.getBirthday()}
    				);*/

                    amazing.setMixPanelTrack(gameName,"enterGame")
                //}

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

        var pivotX = game.world.centerX - 120
        var pivotY = pivot-10
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

            /*var retryText = game.add.bitmapText(pivotX -25, pivotY, 'Gotham Book', buttonTexts[i], 22);
            retryText.anchor.setTo(0.5,0.5)
            sceneGroup.add(retryText)*/

            var fontStyle = {font: "22px Gotham Book", fill: "#ffffff",align:"center"}
            var retryText = new Phaser.Text(sceneGroup.game, pivotX -25, pivotY,buttonTexts[i], fontStyle)
            retryText.anchor.setTo(0.5)
            sceneGroup.add(retryText)
            pivotX += 240
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

        var pivotX = game.world.centerX - 155
        var pivotY = game.world.height - 175

        for(var i = 0;i<3;i++){

            var group = game.add.group()
            group.x = pivotX
            group.y = pivotY
            iconsGroup.add(group)



            var img = group.create(0,0,icons[gameNumbers[i]].iconName)
            img.anchor.setTo(0.5,0.5)
            img.scale.setTo(0.55)
            img.inputEnabled = true
            img.events.onInputDown.add(inputGame)
            img.index = i

            var graphics = game.add.graphics()
            graphics.beginFill(0xff0000)
            graphics.drawRoundedRect(-img.width/2,-img.height/2,img.width,img.height,20)
            graphics.endFill()
            group.add(graphics)

            img.mask = graphics

            /*var nameText = game.add.bitmapText(0, 100, 'Gotham bold', icons[gameNumbers[i]].name, 23);
            nameText.tint = 0x808080
            nameText.anchor.setTo(0.5,0.5)
            nameText.lineSpacing = -10;
            group.add(nameText)*/

            var fontStyle = {font: "18px Gotham bold", fill: "#808080"}
            var nameText = new Phaser.Text(sceneGroup.game, 0, 100,icons[gameNumbers[i]].name, fontStyle)
            nameText.anchor.setTo(0.5)
            nameText.lineSpacing = -10
            group.add(nameText)

            pivotX+=155

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
        minigameId = amazing.getMinigameIdentifier()
        fromApp = false
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
                        break
                    }
                }
            })
        }


    }

    function addRank(){

        //rankMinigame = 50

        var group = game.add.group()
        group.x = game.world.centerX
        group.y = pivotRank-10
        rankGroup.add(group)


        var fontStyle = {font: "30px Gotham Book", fill: "#808080",align:"center"}
        var text = new Phaser.Text(sceneGroup.game, 0, 0,"Tu Puntuación", fontStyle)
        text.anchor.setTo(0.5)
        group.add(text)
        var topValue = 1

        var numberTrophy = 0
        if(!rankMinigame){
            rankMinigame = '--'
        }
        if(rankMinigame > 1){
        	topValue = 5
            numberTrophy = 1
        }

        if(rankMinigame > 5){
        	topValue = 10
            numberTrophy = 2
        }

        if(rankMinigame > 10){
        	topValue = 0
            numberTrophy = 3
        }



        var pivotY = 80
        //
        if(totalScore >= goalScore && amazing.getFromApp()){
            var offsetRank = 0
            if(rankMinigame>=1000){
                offsetRank = 70
            }
            else if(rankMinigame >= 100){
                offsetRank = 30
            }
        	var pivotX = -187-offsetRank/2
	        var trophy = group.create(pivotX,pivotY,'atlas.resultScreen','r' + numberTrophy)
	        trophy.scale.setTo(0.8,0.8)
	        trophy.anchor.setTo(0.5,0.5)

	        pivotX += 90 + offsetRank/2
	        var offset = 0
	        if(topValue!=0){
		        fontStyle = {font: "21px Gotham bold", fill: "#808080",align:"center"}
		        var text = new Phaser.Text(sceneGroup.game, pivotX  ,pivotY-10, "Top " + topValue, fontStyle);
		        text.anchor.setTo(0.5,0.5)
		        group.add(text)
		        
		    }
            else{
                offset = -20
            }

	        fontStyle = {font: "38px Gotham bold", fill: "#808080",align:"center"}
	        var text = new Phaser.Text(sceneGroup.game, pivotX  ,pivotY+20+ offset, '#' + rankMinigame, fontStyle);
	        text.anchor.setTo(0.5,0.5)
	        group.add(text)

	         

	        pivotX+= 90+ offsetRank/2
	        var coin = group.create(pivotX,pivotY,'atlas.resultScreen','coin')
	        coin.anchor.setTo(0.5,0.5)
	        coin.scale.setTo(0.8)

	        var textAdd = totalScore

	        if(totalScore == 0){
	            textAdd = '' + totalScore
	        }

	        fontStyle = {font: "35px Gotham light", fill: "#ff008c",align:"center"}
	        text = new Phaser.Text(sceneGroup.game, coin.x + coin.width * 0.75,pivotY,textAdd, fontStyle)
	        text.anchor.setTo(0,0.5)
	        group.add(text)

            pivotX+=170
            var gameImage = group.create(pivotX, pivotY,gameIcon)
            gameImage.scale.setTo(0.4,0.4)
            gameImage.anchor.setTo(0.5,0.5)

            var graphics = game.add.graphics(pivotX,pivotY)
            graphics.beginFill(0xff0000)
            graphics.drawRoundedRect(-gameImage.width/2,-gameImage.height/2,gameImage.width,gameImage.height,20)
            graphics.endFill()
            group.add(graphics)

            gameImage.mask = graphics

	        
    	}
    	else if(amazing.getFromApp()){

            var offsetRank = 0
            if(rankMinigame>=1000){
                offsetRank = 70
            }
            else if(rankMinigame >= 100){
                offsetRank = 30
            }

            var pivotX = -187-offsetRank/2
            var trophy = group.create(pivotX,pivotY,'atlas.resultScreen','r' + numberTrophy)
            trophy.scale.setTo(0.8,0.8)
            trophy.anchor.setTo(0.5,0.5)

            pivotX += 97 + offsetRank/2
            var offset = 0
            if(topValue!=0){
                fontStyle = {font: "21px Gotham bold", fill: "#808080",align:"center"}
                var text = new Phaser.Text(sceneGroup.game, pivotX  ,pivotY-10, "Top " + topValue, fontStyle);
                text.anchor.setTo(0.5,0.5)
                group.add(text)
                
            }
            else{
                offset = -20
            }

            fontStyle = {font: "38px Gotham bold", fill: "#808080",align:"center"}
            var text = new Phaser.Text(sceneGroup.game, pivotX  ,pivotY+20+ offset, '#' + rankMinigame, fontStyle);
            text.anchor.setTo(0.5,0.5)
            group.add(text)

            pivotX += 90 + offsetRank/2
    		var coin = group.create(pivotX,pivotY,'atlas.resultScreen','coin')
	        coin.anchor.setTo(0.5,0.5)
	        coin.scale.setTo(0.8)

	        var textAdd = totalScore

	        if(totalScore == 0){
	            textAdd = '' + totalScore
	        }

	        fontStyle = {font: "35px Gotham light", fill: "#ff008c",align:"center"}
	        text = new Phaser.Text(sceneGroup.game, coin.x + coin.width * 0.75,pivotY,textAdd, fontStyle)
	        text.anchor.setTo(0,0.5)
	        group.add(text)

	        pivotX+=170
	        var gameImage = group.create(pivotX, pivotY,gameIcon)
	        gameImage.scale.setTo(0.4,0.4)
	        gameImage.anchor.setTo(0.5,0.5)

	        var graphics = game.add.graphics(pivotX,pivotY)
	        graphics.beginFill(0xff0000)
	        graphics.drawRoundedRect(-gameImage.width/2,-gameImage.height/2,gameImage.width,gameImage.height,20)
	        graphics.endFill()
	        group.add(graphics)

	       	gameImage.mask = graphics

	        
	    }
        else{

            var pivotX = -110
            var coin = group.create(pivotX,pivotY,'atlas.resultScreen','coin')
            coin.anchor.setTo(0.5,0.5)
            coin.scale.setTo(0.8)

            var textAdd = totalScore

            if(totalScore == 0){
                textAdd = '' + totalScore
            }

            fontStyle = {font: "35px Gotham light", fill: "#ff008c",align:"center"}
            text = new Phaser.Text(sceneGroup.game, coin.x + coin.width * 0.75,pivotY,textAdd, fontStyle)
            text.anchor.setTo(0,0.5)
            group.add(text)

            pivotX+=195
            var gameImage = group.create(pivotX, pivotY,gameIcon)
            gameImage.scale.setTo(0.4,0.4)
            gameImage.anchor.setTo(0.5,0.5)

            var graphics = game.add.graphics(pivotX,pivotY)
            graphics.beginFill(0xff0000)
            graphics.drawRoundedRect(-gameImage.width/2,-gameImage.height/2,gameImage.width,gameImage.height,20)
            graphics.endFill()
            group.add(graphics)

            gameImage.mask = graphics

        }
	    game.add.tween(group).from({alpha:0},500,Phaser.Easing.linear,true)
	    

    }

    function getSkins(){

        var dataStore = amazing.getProfile()

        if(!dataStore){
            skinTable = [1,1,1,1,1]
        }else{

            skinTable = dataStore
        }
        //skinTable = [2,2,2,2,2]

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


        setRank()
        //rankMinigame = 10
        

        var win = totalScore >= goalScore

        var textToUse = '¡Sigue intentando!'
        var animationToUse = "LOSE"
        var colorTint = 0x166bc1
        var topHeight = 1.05
        var scaleSpine = 1.05
        var pivotButtons = game.world.height * 0.7
        //haveCoupon = true
        //win = false
        if(win){

            textToUse = '¡Lo lograste!'
            animationToUse = "WIN"
            colorTint = 0xc41e79
            //scaleSpine = 1.05
            topHeight = 1.2

        }

        if(!haveCoupon){

            textToUse = "¡Genial!"
            colorTint = 0xc41e79
            animationToUse = "WIN"
            topHeight = 1.05
            //scaleSpine = 1.3
            pivotButtons = game.world.height * 0.68

            if(minigameId){
                topHeight = 1.05
                pivotButtons+=25
            }

        }


        var topRect = sceneGroup.create(0,0,'atlas.resultScreen','fondo_result')
        topRect.width = game.world.width
        topRect.height*= topHeight
        topRect.tint = colorTint
        sceneGroup.topRect = topRect

        if(win && haveCoupon){
            topRect.height *= 0.8
        }
        
        placeIcons()

        /*var text = game.add.bitmapText(game.world.centerX, topRect.height * 0.1, 'Gotham', textToUse, 30);
        text.anchor.setTo(0.5,0.5)
        sceneGroup.add(text)*/

        var fontStyle = {font: "30px Gotham", fill: "#ffffff",align:"center"}
        var text = new Phaser.Text(sceneGroup.game, game.world.centerX, topRect.height * 0.145,textToUse, fontStyle)
        text.anchor.setTo(0.5)
        sceneGroup.add(text)

        var buddy = game.add.spine(game.world.centerX,topRect.height * 0.68, "amazing");
        buddy.scale.setTo(scaleSpine,scaleSpine)
        buddy.setAnimationByName(0, animationToUse, true);
        sceneGroup.add(buddy)

		var image = sceneGroup.create(buddy.x + 155,buddy.y - 20,'atlas.resultScreen','amazing')
		image.anchor.setTo(0.5,0.5)
		image.scale.setTo(1.3,1.3)

        getSkins()

        var addText = '_Happy'
        //skinTable = [6,1,1,1,1]
        if(animationToUse == "LOSE"){
            addText = '_Sad'
            if(skinTable[0]>=5){
                skinTable = [1,1,1,1,1]
            }
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
		buddy.setToSetupPose()

        var pivotText = game.world.centerX - 200

        if(!minigameId && !haveCoupon){

            /*var text = game.add.bitmapText(pivotText, topRect.height * 0.87, 'Gotham', 'Obtuviste', 40);
            text.anchor.setTo(0,1)
            sceneGroup.add(text)*/

            fontStyle = {font: "30px Gotham Book", fill: "#ffffff",align:"center"}
            text = new Phaser.Text(sceneGroup.game, pivotText+50, topRect.height * 0.87,'Obtuviste', fontStyle)
            text.anchor.setTo(0,1)
            sceneGroup.add(text)

            var addText = ''
            if(totalScore != 1){ addText = 's'}

            /*var retryText = game.add.bitmapText(text.x + text.width * 1.15, text.y, 'Gotham', totalScore + " punto" + addText, 50);
            retryText.anchor.setTo(0,1)
            sceneGroup.add(retryText)*/

            fontStyle = {font: "30px Gotham bold", fill: "#ffffff",align:"center"}
            var retryText = new Phaser.Text(sceneGroup.game, text.x + text.width * 1.15, text.y,totalScore + " punto" + addText, fontStyle)
            retryText.anchor.setTo(0,1)
            sceneGroup.add(retryText)

        }else{

            buddy.y+= 75
        }

        if(haveCoupon){


             buddy.y -= 75
            if(!win){

               specialCoupon = false
                /*var text = game.add.bitmapText(pivotText, topRect.height * 0.79, 'Gotham light', 'Necesitas', 24);
                text.anchor.setTo(0,1)
                sceneGroup.add(text)*/

                fontStyle = {font: "24px Gotham light", fill: "#ffffff",align:"center"}
                var text = new Phaser.Text(sceneGroup.game, game.world.centerX-5, topRect.height * 0.79,'Necesitas', fontStyle)
                text.anchor.setTo(1,1)
                sceneGroup.add(text)

                /*var retryText = game.add.bitmapText(text.x + text.width * 1.15, text.y, 'Gotham', goalScore + " puntos", 24);
                retryText.anchor.setTo(0,1)
                sceneGroup.add(retryText)*/

                fontStyle = {font: "24px Gotham", fill: "#ffffff",align:"center"}
                var retryText = new Phaser.Text(sceneGroup.game, text.x + 8, text.y, goalScore + " puntos", fontStyle)
                retryText.anchor.setTo(0,1)
                sceneGroup.add(retryText)

                /*var text = game.add.bitmapText(pivotText - 15, topRect.height * 0.89, 'Gotham light', 'para obtener este cupón', 24);
                text.anchor.setTo(0,1)
                sceneGroup.add(text)*/


                var fontStyle2 = {font: "24px Gotham light", fill: "#ffffff",align:"center"}
                var text2 = new Phaser.Text(sceneGroup.game, game.world.centerX, topRect.height * 0.89, 'para obtener este cupón', fontStyle2)
                text2.anchor.setTo(0.5,1)
                sceneGroup.add(text2)
                buddy.scale.setTo(0.9)


            }else{

                showIcons = false
                pivotRank+=200

                pivotButtons = game.world.height* 0.92
               	
               	if(couponData.poll==null){
                	amazing.winCoupon(currentCouponId)
               	}
                //
                //if(!specialCoupon){

	                if(couponData.imgPreview){

	                    var coupon = sceneGroup.create(game.world.centerX, game.world.centerY +10,'coupon')
	                    coupon.anchor.setTo(0.5,0.5)
	                    coupon.scale.setTo(0.9)

	                }
	                else{

	                    var discount
	                    if(couponData.discount){

	                        discount = couponData.discount * 100
	                    }

	                    var colorToUse = couponData.color

	                    var coupon = sceneGroup.create(game.world.centerX, game.world.centerY + 40,'coupon')
	                    coupon.anchor.setTo(0.5,0.5)

	                    //var fontStyle = {font: "35px Gotham", fontWeight: "bold", fill: colorToUse, align: "center"}



	                    var fontStyle = {font: "22px Gotham", fontWeight: "bold", fill: colorToUse, align: "center"}

	                    var storeText = new Phaser.Text(sceneGroup.game, coupon.x - 10, coupon.y - coupon.height * 0.18 + 15, couponData.title, fontStyle)
	                    storeText.anchor.setTo(0,0)
	                    sceneGroup.add(storeText)

	                    var fontStyle = {font: "15px Gotham", fontWeight: "bold", fill: colorToUse, align: "left", wordWrap: true, wordWrapWidth: 220}

	                    var storeText = new Phaser.Text(sceneGroup.game, coupon.x - 10, coupon.y - coupon.height * 0.18 + 60, couponData.copy, fontStyle)
	                    storeText.anchor.setTo(0,0)
	                    sceneGroup.add(storeText)

	                }
	            //}

            }

        }
        
        /*haveCoupon = false
        rankMinigame = 99999
        addRank()*/

		tweenScene = game.add.tween(sceneGroup).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, 500, true)

        createButtons(pivotButtons)
        createIcons(showIcons)

        sceneGroup.add(rankGroup)

        if(!amazing.getFromApp()){
            addRank()
            if(webCoupon==""){
    		  createOverlay()
            }
            else{
                createOverlayCoupon()
            }
        }
        else{
           	if(haveCoupon && win){
	            if(specialCoupon ){
	            	makeSpecialCoupon()
	            }

	            poll = couponData.poll
	            if(poll !=null){
	                createPoll(poll.questions)
	            }
	        }
        }
	}

	function makeSpecialCoupon(){
		currentQuestion = 0
		overlayGroup = game.add.group()
        overlayGroup.alpha = 0
        //overlayGroup.scale.setTo(1.5)
        //overlayGroup.x -= game.world.width/4
        //overlayGroup.y += game.world.height/4
        overlayGroup.y-= game.world.height
        sceneGroup.add(overlayGroup)

        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width, game.world.height)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        overlayGroup.add(rect)

       	var mask = new Phaser.Graphics(game)
        mask.beginFill(0xffffff)
        mask.drawRoundedRect(game.world.centerX - 225,game.world.centerY-330,450,680,30)
        mask.endFill()
        overlayGroup.add(mask)

        var back = overlayGroup.create(game.world.centerX,game.world.centerY - 200, "couponBack")
        back.anchor.setTo(0.5,0.5)
        back.mask = mask

        var tarjet = overlayGroup.create(game.world.centerX,game.world.centerY - 200, "couponTarjet")
        tarjet.anchor.setTo(0.5)
        tarjet.scale.setTo(0.3)

        cuponSliderGroup = game.add.group()
        cuponSliderGroup.currentX = 0
        overlayGroup.add(cuponSliderGroup)
        cuponSliderGroup.mask = mask

        dotsGroup = game.add.group()
        dotsGroup.y = game.world.centerY + 310
        dotsGroup.x = game.world.centerX
        overlayGroup.add(dotsGroup)
		var initX = -((slideNumber-1)/2)*DELTA_DOTS

        for(var i =1; i <= slideNumber; i++){
        	var slideImage = cuponSliderGroup.create(game.world.centerX + (i-1)*DELTA_SPECIAL_CUPON_SLIDER,game.world.centerY+145,"couponSlide"+i)
        	slideImage.anchor.setTo(0.5)

        	var dot =  dotsGroup.create(initX + ((i-1)*DELTA_DOTS), 0, "atlas.resultScreen","slide_white_off")
            dot.anchor.setTo(0.5)

            if(i == 1){
                dot.loadTexture("atlas.resultScreen","slide_white_on")
            }

        }

        var canjeButton = cuponSliderGroup.create(game.world.centerX +(slideNumber-1)*DELTA_SPECIAL_CUPON_SLIDER,game.world.centerY + 310,"couponButton")
        canjeButton.anchor.setTo(0.5)
        canjeButton.inputEnabled = true
        canjeButton.events.onInputDown.add(function(){
            amazing.goTickets()
        })


        var minigameDataId = amazing.getMinigameIdentifier()
        if(minigameDataId == 31){
        	var extra = overlayGroup.create(game.world.centerX,game.world.centerY + 250, "couponExtra")
        	extra.anchor.setTo(0.5,0.5)
        }

        overlayGroup.y+= game.world.height

        

        overlayGroup.alpha = 1
        overlayGroup.tween = game.add.tween(overlayGroup).from({alpha:0,y:overlayGroup.y - game.world.height},500,"Linear",true)
    
	}

    function update(){
        if(inPoll){
            if(game.input.activePointer.isDown){
                if(firstTouchX==null){
                    firstTouchX = game.input.activePointer.x
                }
                else{
                    var delta = firstTouchX - game.input.activePointer.x
                    if((delta > 0  && currentQuestion >= currentOpenQuestion) || (delta < 0  && currentQuestion <= 0)){
                        delta = 0
                    }

                    if(Math.abs(delta) > 100){
                        if(delta > 0){
                            inSlide = 1
                        }
                        else{
                            inSlide = -1
                        }
                    }
                    else{
                        inSlide = 0
                    }

                    questionsGroup.x = questionsGroup.currentX - delta
                }
            }
            else{
                if(firstTouchX!=null && !inSlideMovement){
                    if(inSlide!=0){
                        dotsGroup.children[currentQuestion].loadTexture("atlas.resultScreen","slide_off")
                        currentQuestion += inSlide
                        dotsGroup.children[currentQuestion].loadTexture("atlas.resultScreen","slide_on")
                        reloadQuestion(currentQuestion)
                        inSlideMovement = true

                        game.add.tween(questionsGroup).to({x:questionsGroup.currentX - (DELTA_QUESTION*inSlide)},200,Phaser.Easing.linear,true).onComplete.add(function(){
                            questionsGroup.currentX = questionsGroup.x
                            //console.log(questionsGroup.x,questionsGroup.currentX)
                            inSlideMovement = false
                        })
                    }
                    else{
                        inSlideMovement = true
                        game.add.tween(questionsGroup).to({x:questionsGroup.currentX},100,Phaser.Easing.linear,true).onComplete.add(function(){
                            inSlideMovement = false
                        })
                    }

                    inSlide = 0
                    firstTouchX = null
                }
            }
        }


        if(specialCoupon){
        	if(game.input.activePointer.isDown){
                if(firstTouchX==null){
                    firstTouchX = game.input.activePointer.x
                }
                else{
                    var delta = firstTouchX - game.input.activePointer.x
                    if((delta > 0  && currentQuestion >= slideNumber-1) || (delta < 0  && currentQuestion <= 0)){
                        delta = 0
                    }

                    if(Math.abs(delta) > 100){
                        if(delta > 0){
                            inSlide = 1
                        }
                        else{
                            inSlide = -1
                        }
                    }
                    else{
                        inSlide = 0
                    }

                    cuponSliderGroup.x = cuponSliderGroup.currentX - delta
                }
            }
            else{
                if(firstTouchX!=null && !inSlideMovement){
                    if(inSlide!=0){
                        dotsGroup.children[currentQuestion].loadTexture("atlas.resultScreen","slide_white_off")

                        if(currentQuestion == slideNumber-1){
                        	game.add.tween(dotsGroup).to({alpha:1},200,Phaser.Easing.linear,true)
                        }

                        currentQuestion += inSlide
                        dotsGroup.children[currentQuestion].loadTexture("atlas.resultScreen","slide_white_on")
                        //reloadQuestion(currentQuestion)
                        inSlideMovement = true

                        if(currentQuestion == slideNumber-1){
                        	game.add.tween(dotsGroup).to({alpha:0},200,Phaser.Easing.linear,true)
                        }

                        game.add.tween(cuponSliderGroup).to({x:cuponSliderGroup.currentX - (DELTA_SPECIAL_CUPON_SLIDER*inSlide)},200,Phaser.Easing.linear,true).onComplete.add(function(){
                            cuponSliderGroup.currentX = cuponSliderGroup.x

                            //console.log(questionsGroup.x,questionsGroup.currentX)
                            inSlideMovement = false
                        })
                    }
                    else{
                        inSlideMovement = true
                        game.add.tween(cuponSliderGroup).to({x:cuponSliderGroup.currentX},100,Phaser.Easing.linear,true).onComplete.add(function(){
                            inSlideMovement = false
                        })
                    }

                    inSlide = 0
                    firstTouchX = null
                }
            }
        }
    }

    function createPoll(poll){

        currentQuestion = 0
        inPoll = true

        pollOverlay = game.add.group()
        pollOverlay.alpha = 0
        pollOverlay.y-= game.world.height
        sceneGroup.add(overlayGroup)

        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width, game.world.height)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        //rect.events.onInputDown.add(inputOverlay)
        //rect.tag = 'quitOverlay'
        pollOverlay.add(rect)

        var back = new Phaser.Graphics(game)
        back.y = game.world.centerY-INITIAL_HEIGTH/2
        back.beginFill(0xffffff)
        back.drawRoundedRect(game.world.centerX - 200,0,398,INITIAL_HEIGTH,30)
        back.endFill()
        pollOverlay.add(back)
        pollOverlay.backImage = back

        var mask = new Phaser.Graphics(game)
        mask.beginFill(0xffffff)
        mask.drawRoundedRect(game.world.centerX - 200,game.world.centerY-400,398,800,30)
        mask.endFill()
        pollOverlay.add(mask)

        var top = pollOverlay.create(game.world.centerX,game.world.centerY-INITIAL_HEIGTH/2,"atlas.resultScreen","pop_encuesta")
        top.anchor.setTo(0.5,0)
        pollOverlay.topImage = top

        var mezy = pollOverlay.create(game.world.centerX,top.y + 150,"atlas.resultScreen","meizy_pop")
        mezy.anchor.setTo(0.5)
        pollOverlay.mezy = mezy

        questionsGroup = game.add.group()
        pollOverlay.add(questionsGroup)
        questionsGroup.currentX = 0

        dotsGroup = game.add.group()
        dotsGroup.y = game.world.centerY + 200
        pollOverlay.add(dotsGroup)

        var initX = game.world.centerX + 5 - ((poll.length-1)/2)*DELTA_DOTS
        topStandarheigth = 350 - 100
        buttonSendHeigth = 110

        for(var i = 0; i < poll.length; i++){
            var group = game.add.group()
            group.mask = mask
            group.x = DELTA_QUESTION*i
            questionsGroup.add(group)
            pollOptions[i] = {button: null, opcion: -1}

            var fontStyle = {font:"24px Gotham", fill: "#757575",align:"center", wordWrap:true, wordWrapWidth: 350}
            var text = new Phaser.Text(sceneGroup.game,game.world.centerX,game.world.centerY-100,poll[i].question, fontStyle)
            text.anchor.setTo(0.5,0)
            group.add(text)
            group.question = text

            var nextButton = group.create(game.world.centerX, game.world.centerY + 250,"atlas.resultScreen","boton_siguiente")
            nextButton.anchor.setTo(0.5)
            nextButton.inputEnabled = true
            nextButton.id = i
            nextButton.visible = false
            if(i == poll.length-1){
                nextButton.loadTexture("atlas.resultScreen","enviar")
                nextButton.events.onInputDown.add(sendPoll)

            }
            else{
                nextButton.events.onInputDown.add(function(target){
                    if(currentQuestion == target.id){
                        dotsGroup.children[currentQuestion].loadTexture("atlas.resultScreen","slide_off")
                        currentQuestion ++
                        dotsGroup.children[currentQuestion].loadTexture("atlas.resultScreen","slide_on")
                        reloadQuestion(currentQuestion)
                        if(currentQuestion > currentOpenQuestion){
                            currentOpenQuestion = currentQuestion
                        }  
                        inSlideMovement = true
                        questionsGroup.currentX = questionsGroup.x - DELTA_QUESTION
                        game.add.tween(questionsGroup).to({x:questionsGroup.x - DELTA_QUESTION},200,Phaser.Easing.linear,true).onComplete.add(function(){
                            inSlideMovement = false
                        })

                    }
                })
            }
            group.nextButton = nextButton

            var initY = - ((poll[i].answers.length-1)/2)*DELTA_ASWERS
            group.answersHeight = poll[i].answers.length*DELTA_ASWERS
            var answersGroup = game.add.group()
            group.add(answersGroup)
            group.answersGroup = answersGroup
            answersGroup.y = (game.world.centerY +50)
            for(var j = 0; j < poll[i].answers.length; j++){
                var y = initY +(DELTA_ASWERS*j)
                
                //button.inputEnabled = true
                
                var button = answersGroup.create(game.world.centerX-150,y,"atlas.resultScreen","opcion")
                button.anchor.setTo(0.5)

                var inputScape = game.add.graphics()
                inputScape.y = y
                inputScape.x = game.world.centerX - 200
                inputScape.beginFill(0xff0000)
                inputScape.drawRect(0,-20,400,40)
                inputScape.endFill()
                inputScape.inputEnabled = true
                inputScape.button = button
                inputScape.index = i
                inputScape.opcionId = j
                inputScape.selected = false
                inputScape.nextButton = nextButton
                answersGroup.add(inputScape)
                inputScape.alpha = 0

                inputScape.events.onInputUp.add(function(target){

                    if(inSlide!=0){
                        return
                    }

                    if(!target.nextButton.visible){
                        target.nextButton.visible = true
                    }

                    if(!target.selected){

                        if(pollOptions[target.index].button!=null){
                            pollOptions[target.index].button.button.loadTexture("atlas.resultScreen","opcion")
                            pollOptions[target.index].button.selected = false
                        }

                        pollOptions[target.index].opcion = target.opcionId
                        pollOptions[target.index].button = target
                        target.selected = true
                        target.button.loadTexture("atlas.resultScreen","seleccion_rosa")

                    }
                })



                var fontStyle = {font:"21px Gotham", fill: "#757575"}
                var answer = new Phaser.Text(sceneGroup.game,game.world.centerX-120,y,poll[i].answers[j], fontStyle)
                answer.anchor.setTo(0,0.5)
                answersGroup.add(answer)
            }


            var dot =  dotsGroup.create(initX + (i*DELTA_DOTS), 0, "atlas.resultScreen","slide_off")
            dot.anchor.setTo(0.5)


            if(i == 0){
                dot.loadTexture("atlas.resultScreen","slide_on")
            }

        }

        reloadQuestion(0)

        pollOverlay.y+= game.world.height
        pollOverlay.alpha = 1
        pollOverlay.tween = game.add.tween(pollOverlay).from({alpha:0,y:pollOverlay.y - game.world.height},500,"Linear",true)
    }

    function reloadQuestion(index){
        var heigth = topStandarheigth + questionsGroup.children[index].question.height +20 + questionsGroup.children[index].answersHeight+30 + buttonSendHeigth

        var newCenter = heigth/2

        //overlayGroup.topImage.y = game.world.centerY - newCenter
        game.add.tween(pollOverlay.topImage).to({y:game.world.centerY - newCenter},200,Phaser.Easing.linear,true)

        //overlayGroup.mezy.y = overlayGroup.topImage.y +150
        game.add.tween(pollOverlay.mezy).to({y:game.world.centerY - newCenter + 150},200,Phaser.Easing.linear,true)

        //questionsGroup.children[index].question.y = overlayGroup.topImage.y+topStandarheigth
        game.add.tween(questionsGroup.children[index].question).to({y:game.world.centerY - newCenter + topStandarheigth},200,Phaser.Easing.linear,true)

        //questionsGroup.children[index].answersGroup.y = questionsGroup.children[index].question.y + questionsGroup.children[index].question.height + 80 + questionsGroup.children[index].answersHeight/2
        game.add.tween(questionsGroup.children[index].answersGroup).to({y:game.world.centerY - newCenter + topStandarheigth + questionsGroup.children[index].question.height + questionsGroup.children[index].answersHeight/2 + 20},200,Phaser.Easing.linear,true)

        //dotsGroup.y = questionsGroup.children[index].answersGroup.y + questionsGroup.children[index].answersHeight/2 + 80
        game.add.tween(dotsGroup).to({y:game.world.centerY - newCenter + topStandarheigth + questionsGroup.children[index].question.height + questionsGroup.children[index].answersHeight + 50},200,Phaser.Easing.linear,true)

        //questionsGroup.children[index].nextButton.y = dotsGroup.y + 50
        game.add.tween(questionsGroup.children[index].nextButton).to({y:game.world.centerY - newCenter + topStandarheigth + questionsGroup.children[index].question.height + 100 + questionsGroup.children[index].answersHeight},200,Phaser.Easing.linear,true)

        //var newScale = heigth/INITIAL_HEIGTH
        //overlayGroup.backImage.y = game.world.centerY - (heigth/2) + 1
        game.add.tween(pollOverlay.backImage).to({y:game.world.centerY - (heigth/2) + 1},200,Phaser.Easing.linear,true)


        //overlayGroup.backImage.scale.setTo(1,heigth/INITIAL_HEIGTH)
        game.add.tween(pollOverlay.backImage.scale).to({y:heigth/INITIAL_HEIGTH},200,Phaser.Easing.linear,true)
    }

    function sendPoll(){
        game.add.tween(pollOverlay).to({alpha : 0, y: pollOverlay.y - game.world.height},500,"Linear",true)
        amazing.winCoupon(currentCouponId)
        console.log(pollOptions)
    }

    function createOverlayCoupon(){
        overlayGroup = game.add.group()
        overlayGroup.alpha = 0
        //overlayGroup.scale.setTo(1.2)
        //overlayGroup.y -= game.world.height*0.05
        //overlayGroup.x -= game.world.width*0.1
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

        var back = new Phaser.Graphics(game)
        back.beginFill(0xffffff)
        back.drawRoundedRect(game.world.centerX - 235,game.world.centerY-350,470,700,30)
        back.endFill()
        overlayGroup.add(back)

        var mask = new Phaser.Graphics(game)
        mask.beginFill(0xffffff)
        mask.drawRoundedRect(game.world.centerX - 235,game.world.centerY-350,470,700,30)
        mask.endFill()
        overlayGroup.add(mask)

        var top = overlayGroup.create(game.world.centerX,game.world.centerY-350,"atlas.resultScreen","pop_cupon")
        top.anchor.setTo(0.5,0)
        top.scale.setTo(0.8)

        var texture = game.add.tileSprite(game.world.centerX-250,game.world.centerY-350,800,800,"atlas.resultScreen","textura")
        //texture.anchor.setTo(0.5)
        overlayGroup.add(texture)
        texture.mask = mask

        var closeBtn = overlayGroup.create(game.world.centerX+175,game.world.centerY-280,'atlas.resultScreen','cerrar')
        closeBtn.anchor.setTo(0.5,0.5)
        closeBtn.scale.setTo(0.8)
        closeBtn.inputEnabled = true
        closeBtn.events.onInputDown.add(inputOverlay)
        closeBtn.tag = 'quitOverlay'

        var cupon = overlayGroup.create(game.world.centerX,game.world.centerY+80,"webCoupon")
        cupon.anchor.setTo(0.5)
        cupon.scale.setTo(0.7)

        var mezy = overlayGroup.create(game.world.centerX,game.world.centerY-190,"atlas.resultScreen","meizy_pop")
        mezy.anchor.setTo(0.5)
        mezy.scale.setTo(0.8)

        var fontStyle = {font: "23px Gotham", fill: "#757575",align:"center"}
        var text = new Phaser.Text(sceneGroup.game,game.world.centerX,game.world.centerY-60,"¡Gana esta recompensa\n jugando en nuestra app!", fontStyle)
        text.anchor.setTo(0.5,0.5)
        overlayGroup.add(text)

        var downloadButton = game.add.group()
        downloadButton.x = game.world.centerX
        downloadButton.y = game.world.centerY + 250
        overlayGroup.add(downloadButton)


         var imgBtn = downloadButton.create(-5,0,'atlas.resultScreen','descargar')
        imgBtn.inputEnabled = true
        imgBtn.events.onInputDown.add(inputOverlay)
        imgBtn.tag = 'download'
        imgBtn.scale.setTo(0.8)
        imgBtn.anchor.setTo(0.5,0.5)



        overlayGroup.y+= game.world.height
        overlayGroup.alpha = 1
        overlayGroup.tween = game.add.tween(overlayGroup).from({alpha:0,y:overlayGroup.y - game.world.height},500,"Linear",true)
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

		var nameText = game.add.bitmapText(back.x, back.y + 50, 'gothamMedium', 'Juega en la app!', 40);
		nameText.tint = 0xffffff
		nameText.anchor.setTo(0.5,0.5)
		overlayGroup.add(nameText)

		var nameText = game.add.bitmapText(back.x -170, back.y + 50, 'gothamMedium', '!', 40);
		nameText.tint = 0xffffff
		nameText.anchor.setTo(0.5,0.5)
		nameText.angle = 180
		overlayGroup.add(nameText)

		var nameText = game.add.bitmapText(back.x, back.y + 110, 'gotham', 'Y obtén grandes recompensas', 28);
		nameText.anchor.setTo(0.5,0.5)
		overlayGroup.add(nameText)

		//if(!couponData && !game.device.desktop && !amazing.getMinigameId()){
			overlayGroup.y+= game.world.height
			overlayGroup.alpha = 1
			overlayGroup.tween = game.add.tween(overlayGroup).from({alpha:0,y:overlayGroup.y - game.world.height},500,"Linear",true)

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
		totalGoal = 1

        game.stage.backgroundColor = "#ffffff"
        currentQuestion = -1
        inSlide = 0
        inPoll = false
        firstTouchX = null
        currentOpenQuestion = 0
        inSlideMovement = false
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

        if(icons[number].demo){
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
        //console.log(couponData)

        sceneGroup = game.add.group()
		sceneGroup.alpha = 0

        rankGroup = game.add.group()
        game.load.bitmapFont('gotham', imagesUrl + 'bitfont/gotham.png', imagesUrl + 'bitfont/gotham.fnt');
        game.load.bitmapFont('gothamMedium', imagesUrl + 'bitfont/gothamMedium.png', imagesUrl + 'bitfont/gothamMedium.fnt');

        //couponData = {scoreGoal:1}
        specialCoupon = false
        if(!couponData || couponData == null){
            haveCoupon = false

        }else{

            haveCoupon = true
            var minigameDataId = amazing.getMinigameIdentifier()
            console.log(minigameDataId)
            if(minigameDataId == 31){
            	//console.log("dataCupon Special")
            	specialCoupon = true
            	slideNumber = 3
            	game.load.image('couponBack',imagesUrl + 'coupons/wow.png')
            	game.load.image('couponTarjet',imagesUrl + 'coupons/wow_tarjet.png')
            	game.load.image('couponSlide1',imagesUrl + 'coupons/wow_pop_1.png')
            	game.load.image('couponSlide2',imagesUrl + 'coupons/wow_pop_2.png')
            	game.load.image('couponSlide3',imagesUrl + 'coupons/wow_pop_3.png')
            	game.load.image("couponExtra",imagesUrl + 'coupons/wow_extra.png')
                game.load.image("couponButton",imagesUrl + 'coupons/wow_button.png')
            	currentCouponId = couponData.id
            }
            else if(minigameDataId == 5766289444306944){
            	specialCoupon = true
            	slideNumber = 2
            	game.load.image('couponBack',imagesUrl + 'coupons/starbucks.png')
            	game.load.image('couponTarjet',imagesUrl + 'coupons/starbucks_tarjet.png')
            	game.load.image('couponSlide1',imagesUrl + 'coupons/starbucks_pop_1.png')
            	game.load.image('couponSlide2',imagesUrl + 'coupons/starbucks_pop_2.png')
                game.load.image("couponButton",imagesUrl + 'coupons/starbucks_button.png')
            	currentCouponId = couponData.id
            }
            //else{
	            if(couponData.imgPreview){
	                //var imageName = couponData.imgPreview.split('/')
	                game.load.image('coupon',amazing.getServerUrl() + couponData.imgPreview)
	                currentCouponId = couponData.id
	            }
	            else{
	                game.load.image('coupon',imagesUrl + 'coupons/' + gameName + '.png')
	            }
	            //game.load.image('coupon',sessionStorage.getItem("game_icon0"));
	        //}
            goalScore = couponData.scoreGoal
        }

        webCoupon = amazing.haveWebCoupon()

        if(webCoupon!=""){
            //var imageName = webCoupon.split('/')
            game.load.image('webCoupon',amazing.getServerUrl()+webCoupon)
        }

        game.load.bitmapFont('gotham', imagesUrl + 'bitfont/gotham.png', imagesUrl + 'bitfont/gotham.fnt');
        game.load.bitmapFont('gothamMedium', imagesUrl + 'bitfont/gothamMedium.png', imagesUrl + 'bitfont/gothamMedium.fnt');

        game.load.spine('amazing', imagesUrl + "spines/skeleton.json");

        for(var i = 0; i<3;i++){

            var iconName = icons[gameNumbers[i]].iconName
            game.load.image(iconName, iconsPath + iconName+ '.png');
        }

        gameIcon = icons[gameIndex].iconName
        //console.log(gameIcon + ' name')
        game.load.image(gameIcon, iconsPath + gameIcon + '.png')

       // game.load.onComplete.add()

        game.load.start()

    }

	return {
		assets: assets,
		name: "result",
		create: createScene,
        preload: preload,
		setScore: setScore,
		init: initialize,
        update:update,
	}
}()



function detectmob() {
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
     //document.body.style.zoom = "100%"
    return true;
  }
 else {
     //document.body.style.zoom = "100%"
    return false;
  }
}

var isMobile = detectmob();
