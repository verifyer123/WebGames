

var soundsPath = "../../shared/minigames/sounds/"

var result = function(){
	var iconsPath = "../../shared/minigames/images/icons/"
	var imagesPath = "../../shared/minigames/images/"
	localizationData = {
		"EN":{
            "youGot":"You earned ",
            "points":"coins",
            "Great":"Great",
            "share":"Share",
            "retry":"Retry",
            "myScore":"My score is: ",
            "previous":"Previous \n record :",
            "record":"New Record!",
            "great":"Great",
            "again":"Try Again",
            "download":"Download"
            
		},

		"ES":{
            "youGot":"Obtuviste ",
            "points":"monedas",
            "Great":"Genial",
            "share":"Compartir",
            "retry":"Reintentar",
            "myScore":"Mi score es: ",
            "previous":"Record \n anterior :",
            "record":"¡Nuevo Récord!",
            "great":"Genial",
            "again":"Reintentar",
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
			{	name: "great",
				file: soundsPath + "winwin.mp3"},
			{	name: "point",
				file: soundsPath + "point.mp3"},
			{	name: "right",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "wrong",
				file: soundsPath + "wrong.mp3"},
			{	name: "cheers",
				file: soundsPath + "cheers.mp3"},
			{	name: "magic",
				file: soundsPath + "magic.mp3"},
			{	name: "boo",
				file: soundsPath + "CrowdBoo.mp3"},
			
        ],
	}

	var sceneGroup

	var totalScore, totalTime
	var shareButton, shareText, tryAgainText
    var win
	var lastRecord
	var whiteFade
    var iconsGroup
    var buttonsActive
	var currentPlayer
    var haveCoupon
    var gamesList
    var goalScore = 50
    var gameNumbers = null
    var scaleToUse
    var gameIndex = 0
	var newRecord
	var whiteFade
	var tile
    var icons
	var starGroup, buttonsGroup
	var particlesGroup, particlesUsed
	var coinsContainer
	var coinsToStarsContainer
	var yogotar
	var iconImage
	var playerData

	var timeGoal = null
	var stars = 0

    
	function setScore(didWin,score,index,scale) {
        
        gamesList = yogomeGames.getGames()
		        
		currentPlayer = null
        gameIndex = index
		totalScore = score
		goalScore = gamesList[gameIndex].objective
		win = totalScore >= goalScore
		console.log(win)
		//console.log(parent.epicModel)
		if(parent.epicModel){
			currentPlayer = parent.epicModel.getPlayer()
			mixpanel.people.set({ "MinigamesPlayed": currentPlayer.minigamesPlayed+1 });
		}

		stars = startsObtained(totalScore)

		playerData = yogomeGames.returnData()
		playerData.hasMap = false
		
		// console.log(playerData.timeReady + ' gameTime')
		if(parent && parent.env){
			playerData.hasMap = parent.env.isMap
			if(currentPlayer)
				currentPlayer.minigamesPlayed++
		}
        
        scaleToUse = scale || 0.9
        setMixpanel("MinigameAnswer")
        console.log('Set score')
	}

	function startsObtained(total){
		
		if(total >= goalScore){
			return 3
		}
		else if(total >= goalScore/2){
			return 2
		}
		else if(total > 0){
			return 1
		}
		else{
			return 0
		}

	}
    
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
			
			if(i == 2){
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

		containerGroup.updateAnswers(0)*/

		return containerGroup
	}
	
	function setMixpanel(callName){
		
		mixpanel.track(
            callName,
            {"minigame": gamesList[gameIndex].name, "correct":win, "score":totalScore,"incorrectAnswers":playerData.lives,
			 "answerTime":playerData.timeReady,"subject":gamesList[gameIndex].subject,"isMap":playerData.hasMap,"app":"epicWeb"}
        );
	}

	function shareEvent(){
        
        setMixpanel("shareFacebook")
        
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
        
        if(obj.active == false || !buttonsActive){
            return
        }
        
        obj.active = false
        
        var parent = obj.parent
		
		if(obj.tag == 'map'){
			parent = obj
		}
        
        //changeImage(0,parent)
        sound.play("click")
        
        var origScale = parent.scale.x
        var scaleTween = game.add.tween(parent.scale).to({x:(origScale - 0.2),y:origScale - 0.2}, 200, Phaser.Easing.Cubic.In, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(parent.scale).to({x:origScale,y:origScale}, 200, Phaser.Easing.Cubic.Out, true)
            
            if(parent.tag == 'share'){
                shareEvent()
            }else if(parent.tag == 'retry'){
				setMixpanel("onRetry")
                var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,200)
                    alphaTween.onComplete.add(function(){
                        sceneloader.show(gamesList[gameIndex].sceneName)
                    })
            }else if(parent.tag == 'map'){
				setMixpanel("onMap")
				var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,200)
                    alphaTween.onComplete.add(function(){
                        window.open("../epicMap/", "_self")
                    })
			}
        })
                                  
    }
    
    function createButtons(pivot){
       
        buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        var buttonNames = ['retry','share']
        
        var buttonTexts = ['retry','share']
        
		var buttonsLength = buttonNames.length
		
        var pivotX = game.world.centerX - 125
        var pivotY = pivot
        for(var i = 0;i<buttonsLength;i++){
        
            var group = game.add.group()
			group.alpha = 0
            group.x = pivotX
            group.y = pivotY
            buttonsGroup.add(group)
            
            group.tag = buttonNames[i]
        
            var button1 = group.create(0,0,'atlas.resultScreen',buttonNames[i] + 'Btn')
            button1.anchor.setTo(0.5,0.5)
			button1.scale.setTo(1.15,1.15)
            
            button1.inputEnabled = true
            button1.events.onInputDown.add(inputButton)
            button1.active = true
              			
			var textToUse = localization.getString(localizationData,buttonNames[i])
			
			var retryText = game.add.bitmapText(-25,-5, 'luckiest', localization.getString(localizationData,buttonNames[i]), 35);
            retryText.anchor.setTo(0.5,0.5)
            group.add(retryText)
			
			if(textToUse.length > 8){
				retryText.scale.setTo(0.65,0.7)
				retryText.y+= 4
			}
            
            pivotX += 250
        }

        console.log(parent.env)
		if(parent.env && parent.env.isMap){
			var homeBtn = buttonsGroup.create(game.world.centerX - 200,game.world.centerY - 350,'atlas.resultScreen','home')
			homeBtn.anchor.setTo(0.5,0.5)
			homeBtn.alpha = 0
			homeBtn.events.onInputDown.add(inputButton)
			homeBtn.inputEnabled = true
			homeBtn.tag = 'map'
		}


		/*var homeGroup = game.add.group()
		homeGroup.x = game.world.centerX
		homeGroup.y = game.world.centerY

		sceneGroup.add(homeGroup)

		//var homeButton = group.create(-320,-750,'atlas.resultScreen','home')
		var homeButton = group.create(-game.world.width*0.55,-game.world.height*0.8,'atlas.resultScreen','home')
        homeButton.anchor.setTo(0.5,0.5)
		homeButton.scale.setTo(1,1)
		homeButton.inputEnabled = true
        homeButton.events.onInputDown.add(inputButton)
        homeButton.active = true*/




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
    
    function createBackground(){
        
		var background = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.resultScreen','gradiente_versus')
		sceneGroup.add(background)
		
		var tween = game.add.tween(background.scale).to({y:1.5},2000,"Linear",true,0,-1)
		tween.yoyo(true,0)
		
        tile = game.add.tileSprite(0,0,game.world.width, game.world.height, 'atlas.resultScreen','retro-pattern');
		sceneGroup.add(tile)
    }
    
	function createScene(){
        
        //console.log(icons[0].name + ' name')
        if(game.device.desktop){
            haveCoupon = false
        }
		

		console.log("Create scene results")
        loadSounds()
        
		sceneGroup = game.add.group()
		sceneGroup.alpha = 0
		
        var background = new Phaser.Graphics(game)
        background.beginFill(0xffffff);
        background.drawRect(0, 0, game.world.width, game.world.height);
        background.endFill();
        background.anchor.setTo(0,0)
        sceneGroup.add(background)
        
        win = totalScore >= goalScore
        
        var scaleSpine = 0.55
        var pivotButtons = game.world.centerY + 450
        
        createBackground()
		
		var background = sceneGroup.create(game.world.centerX, game.world.centerY,'atlas.resultScreen','base')
		background.anchor.setTo(0.5,0.5)
		//background.scale.setTo(1.2,1.2)
        
        var topHeight = game.world.height * 0.8  
		var env = parent ? (parent.env ? parent.env : {}) : {}
		if(currentPlayer){
			currentPlayer.powerCoins += totalScore

			if(env.isMap && win){
				currentPlayer.minigames[gamesList[gameIndex].id].completed = true
			}
			parent.epicModel.savePlayer(currentPlayer)
		}
		
		var yogoBack = sceneGroup.create(game.world.centerX - 100, game.world.centerY - 185,'atlas.resultScreen','yogoBg')
		yogoBack.anchor.setTo(0.5,0.5)
		
        yogotar = game.add.spine(game.world.centerX - 100,topHeight * 0.5, "yogotaResults");
        yogotar.scale.setTo(scaleSpine,scaleSpine)
        yogotar.setAnimationByName(0, "IDLE", true);
        if(currentPlayer && currentPlayer.yogotar){
            var yogotarSkin = currentPlayer.yogotar;
             yogotar.setSkinByName(yogotarSkin);
        }else{
            yogotar.setSkinByName('Eagle');
        }        
        //yogotar.setSkinByName('Eagle');
        sceneGroup.add(yogotar)
                
        var pivotText = game.world.centerX - 170
		
		coinsToStarsContainer = game.add.group()
		coinsToStarsContainer.x = game.world.centerX
		coinsToStarsContainer.y = game.world.centerY + 160
		coinsToStarsContainer.scale.setTo(1,1)
		sceneGroup.add(coinsToStarsContainer)
		
		var imgCont = coinsToStarsContainer.create(0,0,'atlas.resultScreen','coin_stock')
		imgCont.anchor.setTo(0.5,0.5)
		
        var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var retryText = new Phaser.Text(sceneGroup.game, -imgCont.width *0.15,5, '= '+goalScore , fontStyle)
		retryText.anchor.setTo(0,0.5)
        coinsToStarsContainer.add(retryText)
		coinsToStarsContainer.text = retryText

		var coinContainer_coin = coinsToStarsContainer.create(coinsToStarsContainer.width/3.8,0,'atlas.resultScreen','coin')
		coinContainer_coin.anchor.setTo(0.5,0.5)

		coinContainer_star = coinsToStarsContainer.create(-coinsToStarsContainer.width/4-30,0,'atlas.resultScreen','star_on')
		coinContainer_star.anchor.setTo(0.5,0.5)
		coinContainer_star.scale.setTo(0.3,0.3)

		coinContainer_star = coinsToStarsContainer.create(-coinsToStarsContainer.width/4+10,0,'atlas.resultScreen','star_on')
		coinContainer_star.anchor.setTo(0.5,0.5)
		coinContainer_star.scale.setTo(0.3,0.3)

		var coinContainer_star = coinsToStarsContainer.create(-coinsToStarsContainer.width/4-10,0,'atlas.resultScreen','star_on')
		coinContainer_star.anchor.setTo(0.5,0.5)
		coinContainer_star.scale.setTo(0.4,0.4)


		coinsContainer = game.add.group()
		coinsContainer.x = game.world.centerX + 110
		coinsContainer.y = game.world.centerY - 320
		coinsContainer.scale.setTo(1,1)
		sceneGroup.add(coinsContainer)

		var imgCont = coinsContainer.create(0,0,'atlas.resultScreen','coin_container')
		imgCont.anchor.setTo(0.5,0.5)

		var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var coinsText = new Phaser.Text(sceneGroup.game, -imgCont.width *0.01,5, 'x '+0 , fontStyle)
		coinsText.anchor.setTo(0,0.5)
        coinsContainer.add(coinsText)
		coinsContainer.text = coinsText

		tweenScene = game.add.tween(sceneGroup).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, 500, true)
        
		iconImage = sceneGroup.create(game.world.centerX + 110, game.world.centerY - 170,'gameIcon')
		iconImage.scale.setTo(0.7,0.7)
		iconImage.anchor.setTo(0.5,0.5)
		
		starGroup = game.add.group()
		starGroup.x = game.world.centerX
		starGroup.y = game.world.centerY + 15
		starGroup.scale.setTo(0.8,0.8)
		sceneGroup.add(starGroup)

		starGroup.star = []
		
		var starOff = starGroup.create(-150,0,'atlas.resultScreen','first_stars_off')
		starOff.anchor.setTo(0.5,0.5)
		
		var starOn = starGroup.create(-150,-2,'atlas.resultScreen','star_on')
		starOn.anchor.setTo(0.5,0.5)
		starOn.scale.setTo(0.8,0.8)

		starOn.alpha = 0
		starGroup.star.push(starOn)

		starOff = starGroup.create(150,0,'atlas.resultScreen','first_stars_off')
		starOff.anchor.setTo(0.5,0.5)
		
		starOn = starGroup.create(150,-2,'atlas.resultScreen','star_on')
		starOn.anchor.setTo(0.5,0.5)
		starOn.scale.setTo(0.8,0.8)
		
		starOn.alpha = 0
		starGroup.star.push(starOn)

		starOff = starGroup.create(0,0,'atlas.resultScreen','star_off')
		starOff.anchor.setTo(0.5,0.5)
		
		starOn = starGroup.create(0,-2,'atlas.resultScreen','star_on')
		starOn.anchor.setTo(0.5,0.5)
		
		starOn.alpha = 0
		starGroup.star.push(starOn)

		

		/*var glitter = starGroup.create(-200,60,'atlas.resultScreen','glitter')
		glitter.anchor.setTo(0.5,0.5)

		glitter = starGroup.create(130,55,'atlas.resultScreen','glitter')
		glitter.anchor.setTo(0.5,0.5)
		glitter.scale.setTo(0.5,0.5)

		glitter = starGroup.create(140,-70,'atlas.resultScreen','glitter')
		glitter.anchor.setTo(0.5,0.5)
		glitter.scale.setTo(1,1)*/
		
		
		infoGroup = game.add.group()
		sceneGroup.add(infoGroup)
		
		var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			
		/*var line = new Phaser.Text(sceneGroup.game, game.world.centerX, game.world.centerY + 110,'-------------', fontStyle)
		line.anchor.setTo(0.5,0.5)
		infoGroup.add(line)*/

		var line = infoGroup.create(game.world.centerX, game.world.centerY+240,'atlas.resultScreen','divider')
		line.anchor.setTo(0.5,0.5)

		var isNewRecord = true


		if(currentPlayer){
			lastRecord = currentPlayer.minigames[currentPlayer.currentMinigame].record
			if(lastRecord >= totalScore){
				isNewRecord = false
			}
		}

		if(totalScore==0){
			isNewRecord = false
		}
		
		if(isNewRecord){

			/*var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			
			var previousText = new Phaser.Text(sceneGroup.game, game.world.centerX - 85, game.world.centerY + 200,localization.getString(localizationData,'previous'), fontStyle)
			previousText.lineSpacing = -10
			previousText.anchor.setTo(0.5,0.5)
			infoGroup.add(previousText)
			
			var coin = infoGroup.create(game.world.centerX + 50,previousText.y,'atlas.resultScreen','coin')
			coin.anchor.setTo(0.5,0.5)
			
			lastRecord = 0
			
			if(currentPlayer){
				lastRecord = currentPlayer.minigames[currentPlayer.currentMinigame].record
			}
			
			var previousText = new Phaser.Text(sceneGroup.game, coin.x + 75,coin.y + 5,'x ' + lastRecord, fontStyle)
			previousText.anchor.setTo(0.5,0.5)
			infoGroup.add(previousText)
			
			newRecord = game.add.group()
			newRecord.alpha = 0
			newRecord.record = true
			newRecord.x = game.world.centerX
			newRecord.y = game.world.centerY + 200
			infoGroup.add(newRecord)
			
			var recordImage = newRecord.create(0,0,'atlas.resultScreen','ribbon')
			recordImage.scale.setTo(0.9,0.9)
			recordImage.anchor.setTo(0.5,0.5)
			
			var retryText = game.add.bitmapText(0,-15, 'luckiest', localization.getString(localizationData,'record'), 42);
            retryText.anchor.setTo(0.5,0.5)
            newRecord.add(retryText)*/

            /*newRecord = game.add.group()
			newRecord.alpha = 0
			newRecord.record = true
			newRecord.x = game.world.centerX
			newRecord.y = game.world.centerY + 200
			infoGroup.add(newRecord)*/

			newRecord = game.add.group()
			newRecord.alpha = 1
			newRecord.record = true
			newRecord.x = game.world.centerX
			newRecord.y = game.world.centerY + 300
			infoGroup.add(newRecord)

            var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

            var newRecordImage = newRecord.create(0 , 0,'atlas.resultScreen','new_record')
			newRecordImage.anchor.setTo(0.5,0.5)

			var newRecordText = new Phaser.Text(sceneGroup.game, 50 , newRecordImage.y,localization.getString(localizationData,'record'), fontStyle)
			newRecordText.lineSpacing = -10

			newRecordText.anchor.setTo(0.5,0.5)
			newRecord.add(newRecordText)
			
			pivotButtons = game.world.centerY + 400
			
		}else{

			var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
			
			var previousText = new Phaser.Text(sceneGroup.game, game.world.centerX - 85, game.world.centerY + 300,localization.getString(localizationData,'previous'), fontStyle)
			previousText.lineSpacing = -10
			previousText.anchor.setTo(0.5,0.5)
			infoGroup.add(previousText)
			
			var coin = infoGroup.create(game.world.centerX + 50,previousText.y,'atlas.resultScreen','coin')
			coin.anchor.setTo(0.5,0.5)
			
			lastRecord = 0
			
			if(currentPlayer){
				lastRecord = currentPlayer.minigames[currentPlayer.currentMinigame].record
			}
			
			var previousText = new Phaser.Text(sceneGroup.game, coin.x + 75,coin.y + 5,'x ' + lastRecord, fontStyle)
			previousText.anchor.setTo(0.5,0.5)
			infoGroup.add(previousText)
			
			/*newRecord = game.add.group()
			newRecord.alpha = 0
			newRecord.record = false
			newRecord.x = game.world.centerX
			newRecord.y = game.world.centerY + 200
			infoGroup.add(newRecord)
			
			var recordImage = newRecord.create(0,0,'atlas.resultScreen','ribbon')
			recordImage.scale.setTo(0.9,0.9)
			recordImage.anchor.setTo(0.5,0.5)
			
			var retryText = game.add.bitmapText(0,-15, 'luckiest', localization.getString(localizationData,'record'), 42);
            retryText.anchor.setTo(0.5,0.5)
            newRecord.add(retryText)*/

			
			pivotButtons = game.world.centerY + 400
			
			/*var greatGroup = game.add.group()
			greatGroup.x = game.world.centerX
			greatGroup.y = game.world.centerY + 270
			greatGroup.scale.setTo(0.9,0.9)
			infoGroup.add(greatGroup)
			
			var greatText = game.add.bitmapText(0,-5, 'luckiest', localization.getString(localizationData,'again'), 52);
            greatText.anchor.setTo(0.5,0.5)
			greatText.tint = 0xdb195f
            greatGroup.add(greatText)*/
			
			
		}
		
		for(var i = 0; i < infoGroup.length;i++){
			
			var obj = infoGroup.children[i]
			obj.alpha = 0
		}
		
		createButtons(pivotButtons)
		addParticles()
		
		animateScene()
		parent.env = {}
		
	}
	
	function animateScene(){
		
		sceneGroup.alpha = 0
		game.add.tween(sceneGroup).to({alpha:1},500,"Linear",true).onComplete.add(function(){
				
			addCoins()
				
		})
		
	}
	
	function addCoins(){
		
		var numberAdd = 0
		var delay = 0
		var valueChange = 40
		
		for(var i = 0; i < totalScore;i++){
			
			game.time.events.add(delay,function(){
				
				numberAdd++
				coinsContainer.text.setText('x ' + numberAdd)
				coinsContainer.scale.setTo(1,1)
				
				var indexCheck = numberAdd - 1
				if(indexCheck % 5 == 0){
					
					coinsContainer.scale.setTo(0.9,0.9)
					
					sound.play("point")
				}
				
				if(indexCheck % 25 == 0){
					createPart('coin',coinsContainer.text)
				}
				
			})
			delay+= valueChange
			
		}
		
		if(totalScore > 99){
			coinsContainer.text.scale.setTo(0.8,0.8)
		}
		
		game.time.events.add(delay,function(){
			
			var animName = "WIN"
			var iconRight = 'right'
			var soundName = 'cheers'
			var icon;
            
			//if(win){
				
				game.add.tween(whiteFade).from({alpha:1},250,"Linear",true)
				animName = "WIN"
				
				for(var i = 0; i < stars; i++){
					starGroup.star[i].alpha = 1
					game.add.tween(starGroup.star[i].scale).from({x:2,y:2},500,"Linear",true)
					game.add.tween(starGroup.star[i]).to({angle:starGroup.star[i].angle - 360},500,"Linear",true)
					
					//createPart('star',starGroup.star[i])
				}

				//if(stars>0){
					createPart('glitter',starGroup.star[2])
				//}

				sound.play("great")
                


			//}else{
				//animName = "LOSE"
				//iconRight = 'wrong'
				//soundName = 'boo'
			//}
			
                icon = sceneGroup.create(iconImage.x, iconImage.y,'atlas.resultScreen',iconRight)
                icon.scale.setTo(0.9,0.9)
                icon.alpha = 0
                icon.anchor.setTo(0.5,0.5)
	
			
			//game.add.tween(icon).from({x:icon.x + 50,y:icon.y - 50,alpha:1},500,"Linear",true)
			game.add.tween(icon.scale).from({x:2,y:2},500,"Linear",true).onComplete.add(function(){
				
				sound.play(iconRight)
				
				game.time.events.add(500,function(){
					
					var delay = 0
					for(var i = 0; i < infoGroup.length;i++){
						
						var obj = infoGroup.children[i]
						if(!obj.record){
							appearObject(obj,delay)
							delay+= 200
						}
						
					}
					
					for(var i = 0; i < buttonsGroup.length;i++){
						
						var button = buttonsGroup.children[i]
						appearObject(button,delay)
						
						delay+= 200
					}
				})
				
			})
			
			yogotar.setAnimationByName(0,animName,true)

			
			game.time.events.add(750,function(){
				
				buttonsActive = true
				sound.play(soundName)
				
				game.time.events.add(1250,function(){
					if(lastRecord==null){
						lastRecord = 0
					}

					if(totalScore > lastRecord){
						sound.play("magic")
						newRecord.alpha = 1
						game.add.tween(newRecord.scale).from({x:2,y:2},500,"Linear",true)
						game.add.tween(newRecord).from({y:newRecord.y - 100},500,"Linear",true)
						
						createPart('star',newRecord.children[0])
						//console.log(currentPlayer)
						if(currentPlayer!=null){
							//console.log('Add new record '+totalScore)
							currentPlayer.minigames[currentPlayer.currentMinigame].record = totalScore
						}
					}
				})
				
			})
			
		})

		if(parent.epicModel){
			parent.epicModel.savePlayer(currentPlayer)
		}

	}
    
	function popObject(obj,delay,alphaValue){
        
		var alpha = alphaValue || 1
        game.time.events.add(delay,function(){
            
            sound.play("click")
            obj.alpha = alpha
            game.add.tween(obj.scale).from({x:0, y:0, angle:obj.angle + 360},250,Phaser.Easing.linear,true)
        },this)
    }
	
	function appearObject(obj,delay){
        
		var alpha = 1
        game.time.events.add(delay,function(){
            
            obj.alpha = alpha
            game.add.tween(obj).from({alpha:0},250,Phaser.Easing.linear,true)
        },this)
    }

	function initialize(){
        
		buttonsActive = false
		totalScore = totalScore || 0
		totalTime = totalTime || 99.99
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
        game.load.bitmapFont('luckiest', imagesPath + 'bitfont/font.png', imagesPath + 'bitfont/font.fnt');
        

        //game.load.spine('amazing', "images/spines/Amaizing.json");
        //console.log('Start  preload ' +imagesPath)
        game.load.spine('yogotaResults', imagesPath + "spines/yogotar.json?v2");

		if(!gamesList){
			gamesList = yogomeGames.getGames()
		}
		
		var iconName = gamesList[gameIndex].sceneName
		game.load.image('gameIcon', imagesPath + "icons/" + iconName + ".png")
		//console.log('End preload')
    }
    
	function createTextPart(text,obj){
        
        var pointsText = lookParticle('text')
        
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y - 60
            pointsText.setText(text)
            pointsText.scale.setTo(1,1)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
        
    }
    
    function lookParticle(key){
        
        for(var i = 0;i<particlesGroup.length;i++){
            
            var particle = particlesGroup.children[i]
			//console.log(particle.tag + ' tag,' + particle.used)
            if(!particle.used && particle.tag == key){
                
				particle.used = true
                particle.alpha = 1
                
                particlesGroup.remove(particle)
                particlesUsed.add(particle)
				                
                return particle
                break
            }
        }
        
    }
    
    function deactivateParticle(obj,delay){
        
        game.time.events.add(delay,function(){
            
            obj.used = false
            
            particlesUsed.remove(obj)
            particlesGroup.add(obj)
            
        },this)
    }
    
    function createPart(key,obj,offsetX){
        
        var offX = offsetX || 0
        var particle = lookParticle(key)
		
        if(particle){
            
			var number = 6
			if(key == 'coin'){
				number = 4
			}
            particle.x = obj.world.x + offX
            particle.y = obj.world.y
            particle.scale.setTo(1,1)
            //game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            //game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            particle.start(true, 1500, null, number);
			
			game.add.tween(particle).to({alpha:0},500,"Linear",true,1000).onComplete.add(function(){
				deactivateParticle(particle,0)
			})
			
        }
        
        
    }
    
    function createParticles(tag,number){
                
        for(var i = 0; i < number;i++){
            
            var particle
            if(tag == 'text'){
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                var particle = game.add.emitter(0, 0, 100);

				particle.makeParticles('atlas.resultScreen',tag);
				particle.minParticleSpeed.setTo(-300, -100);
				particle.maxParticleSpeed.setTo(400, -200);
				particle.minParticleScale = 0.6;
				particle.maxParticleScale = 1.5;
				particle.gravity = 150;
				particle.angularDrag = 30;
				
				particlesGroup.add(particle)
				
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            //particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
	
	function addParticles(){
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',3)
		createParticles('glitter',5)
		createParticles('coin',3)
		createParticles('text',5)
		
		whiteFade = new Phaser.Graphics(game)
        whiteFade.beginFill(0xffffff);
        whiteFade.drawRect(0, 0, game.world.width, game.world.height);
        whiteFade.endFill();
		whiteFade.alpha = 0
        whiteFade.anchor.setTo(0,0)
        sceneGroup.add(whiteFade)

	}
	
	function update(){
		
		tile.tilePosition.x-= 2
		tile.tilePosition.y-= 2
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