var tutorialHelper = function () {

	var sharePath = "../../shared/minigames/"

	var tutorialVideo
	var videoImage
	var tutorialTypeText
	var goalScore

	var coinText_1
	var coinText_2
	var coinText_3

	var bmd
	var inTutorial

	var noWebmTextType
	var howkeyWeb = "how_to_play_Imagic"
	var howkeyImagic = "how_to_play_Imagic"
	var playKeyWeb = "button_play"
	var playKeyImagic = "button_play"
	var backKeyImagic = "background_tutorial_Imagic"
	var backKeyWeb = "background_tutorial_Web"
	var backKeyStars = "back_stars"
	var langPlayText;

	var spine
	var spineTimeOut
	//Configurations: IMAGIC, WEB_GAMES
	var configuration;
	var createTutorialGif;
	var tutoPath;


	function createTutorialGif(group,onClickFunction){

		inTutorial = true
        
		var rect = new Phaser.Graphics(game)
		rect.beginFill(0x0d0000)
		rect.drawRect(0,0,game.world.width *2, game.world.height *2)
		rect.alpha = 0.7
		rect.endFill()
		group.add(rect)
		var plane = group.create(game.world.centerX, game.world.centerY+30,backKeyWeb)
		plane.scale.setTo(1,1)
		plane.anchor.setTo(0.5,0.5)
		var howTo = group.create(game.world.centerX,90, howkeyWeb)
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		var button = group.create(game.world.centerX+120, game.world.centerY+330, playKeyWeb)//'atlas.tutorial','play_'+localization.getLanguage())
		button.anchor.setTo(0.5,0.5)
		button.scale.setTo(0.85)
		var tuto = group.create(game.world.centerX, game.world.centerY - 120,'tutorial_image')
		tuto.anchor.setTo(0.5,0.5)


		button.inputEnabled=true;
		button.events.onInputDown.add(function(){
			button.inputEnabled = false
			clickPlay(group,onClickFunction)
		});

		game.add.tween(button.scale).to({x:0.95,y:0.95},300,Phaser.Easing.linear,true).yoyo(true,-1).repeat(-1)


		spine = game.add.spine(game.world.centerX-120, game.world.centerY+450,"tutorialGif")
		spine.setSkinByName("normal")
		var anim = spine.setAnimationByName(0,"idle",false)
		anim.onComplete = repeatSpine
		group.add(spine)

		var fontStyle = {font: "25px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var typeText = new Phaser.Text(game,game.world.centerX-120 , game.world.centerY+400, tutorialTypeText, fontStyle)
		typeText.stroke = '#000000';
		typeText.strokeThickness = 6;
		typeText.anchor.setTo(0.5)
		group.add(typeText)


		var coinsRect = new Phaser.Graphics(game)
		coinsRect.beginFill(0xff0000)
		coinsRect.drawRect(0,-12,364, 30)
		coinsRect.endFill()


		var coinsSprite = game.add.sprite(game.world.centerX-181, game.world.centerY+180);
		coinsSprite.addChild(coinsRect)
		coinsSprite.anchor.setTo(0,0.5)
		group.add(coinsSprite)

		coinsSprite.scale.setTo(0,1)

		var tween_1 = game.add.tween(coinsSprite.scale).to({x:1/4},2000/4,Phaser.Easing.Linear.none,false)
		tween_1.onComplete.add(function(){onTweenText(coinText_1)})
		var tween_2 = game.add.tween(coinsSprite.scale).to({x:1/2},2000/4,Phaser.Easing.Linear.none,false)
		tween_2.onComplete.add(function(){onTweenText(coinText_2)})
		var tween_3 = game.add.tween(coinsSprite.scale).to({x:8/9},(2000*(8/9) - (2000/2)),Phaser.Easing.Linear.none,false)
		tween_3.onComplete.add(function(){onTweenText(coinText_3)})
		var tween_4 = game.add.tween(coinsSprite.scale).to({x:1},2000*(1/9),Phaser.Easing.Linear.none,false)

		tween_1.chain(tween_2)
		tween_2.chain(tween_3)
		tween_3.chain(tween_4)

		tween_1.start()

		coinText_1 = new Phaser.Text(game,game.world.centerX-120 , game.world.centerY+198, "1 pts", fontStyle)
		coinText_1.stroke = '#000000';
		coinText_1.strokeThickness = 5;
		coinText_1.anchor.setTo(0.5)
		coinText_1.scale.setTo(0.8)
		group.add(coinText_1)

		coinText_2 = new Phaser.Text(game,game.world.centerX , game.world.centerY+198, Math.floor(goalScore/2)+" pts", fontStyle)
		coinText_2.stroke = '#000000';
		coinText_2.strokeThickness = 5;
		coinText_2.anchor.setTo(0.5)
		coinText_2.scale.setTo(0.8)
		group.add(coinText_2)

		coinText_3 = new Phaser.Text(game,game.world.centerX+120 , game.world.centerY+198, goalScore+" pts", fontStyle)
		coinText_3.stroke = '#000000';
		coinText_3.strokeThickness = 5;
		coinText_3.anchor.setTo(0.5)
		coinText_3.scale.setTo(0.8)
		group.add(coinText_3)


	}

	function repeatSpine(){
		spineTimeOut = setTimeout(function(){
			var anim = spine.setAnimationByName(0,"idle",false)
			anim.onComplete = repeatSpine
		},500)
	}

	function clickPlay(group,onClickFunction){
		sound.play("pop")
		game.add.tween(group).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
			onClickFunction()
			group.destroy()
		})
		clearTimeout(spineTimeOut)
	}


	function onTweenText(text){
		game.add.tween(text.scale).to({x:1,y:1},100,Phaser.Easing.Linear.none,true)
	}


	function loadType(gameData, currentLoader){
        
		//return
		document.addEventListener("contextmenu", function(e){
			e.preventDefault();
		}, false);
		configuration=gameData.config.tutorial;
		var path = sharePath+"tutorial_gifs/"
		var videoName

		goalScore = gameData.objective
		var type = gameData.type
		var language = localization.getLanguage()

		switch(type){
			case gameTypeEnum.CHOOSE:
				videoName = "choose"
				if(language=="ES"){
					tutorialTypeText = "ESCOGER"
				}
				else{
					tutorialTypeText = "CHOOSE"
				}
				break
				case gameTypeEnum.COUNT:
				videoName = "count"
				if(language=="ES"){
					tutorialTypeText = "CONTAR"
				}
				else{
					tutorialTypeText = "COUNT"
				}
				break
				case gameTypeEnum.GRAB:
				videoName = "grab"
				if(language=="ES"){
					tutorialTypeText = "RECOLECTAR"
				}
				else{
					tutorialTypeText = "GRAB"
				}
				break
				case gameTypeEnum.MATCH:
				videoName = "match"
				if(language=="ES"){
					tutorialTypeText = "ARMAR"
				}
				else{
					tutorialTypeText = "MATCH"
				}
				break
				case gameTypeEnum.SEQUENCE:
				videoName = "sequence"
				if(language=="ES"){
					tutorialTypeText = "SECUENCIA"
				}
				else{
					tutorialTypeText = "SEQUENCE"
				}
				break
				case gameTypeEnum.TARGET:
				videoName = "target"
				if(language=="ES"){
					tutorialTypeText = "DIRECCIONAR"
				}
				else{
					tutorialTypeText = "TARGET"
				}
				break
				case gameTypeEnum.TRACE:
				videoName = "trace"
				if(language=="ES"){
					tutorialTypeText = "TRAZAR"
				}
				else{
					tutorialTypeText = "TRACE"
				}
				break
				case gameTypeEnum.TAP:
				videoName = "tap"
				if(language=="ES"){
					tutorialTypeText = "TAP"
				}
				else{
					tutorialTypeText = "TAP"
				}
				break
				case gameTypeEnum.DRAG:
				videoName = "drag and drop"
				if(language=="ES"){
					tutorialTypeText = "DRAG AND DROP"
				}
				else{
					tutorialTypeText = "ARASTRAR"
				}
				break
		}

		var obj = {
			name:"tutorialGif",
			file:path+videoName+"/"+videoName+".json"
		}

		currentLoader.spine(obj.name, obj.file)


		currentLoader.image(backKeyWeb,sharePath+"images/tutorial/background_tutorial_Web.png")
		if(language == "ES"){
			currentLoader.image(howkeyWeb,sharePath+'images/tutorial/how_ES_Web.png')
			currentLoader.image(playKeyWeb,sharePath+'images/tutorial/play_ES.png')
		}
		else{
			currentLoader.image(howkeyImagic,sharePath+'images/tutorial/how_EN_Web.png')
			currentLoader.image(playKeyImagic,sharePath+'images/tutorial/play_EN.png')
		}

		if(language == "ES"){
			langPlayText="JUGAR";
		}else{
			langPlayText="PLAY";
		}

	}

	return{
		createTutorialGif:createTutorialGif,
		loadType:loadType,
		configuration:configuration
	}
}()
