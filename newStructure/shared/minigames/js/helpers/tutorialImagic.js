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
	var howkeyImagic = "how_to_play_Imagic"
	var playKeyImagic = "button_play"
	var backKeyImagic = "background_tutorial_Imagic"
	var backKeyStars = "back_stars"
	var langPlayText;

	var spine
	var spineTimeOut
	var configuration;
	var createTutorialGif;
	var tutoPath;

	function createTutorialGif(group,onClickFunction){

		inTutorial = true
		var rect = new Phaser.Graphics(game)
		rect.beginFill(0x0d1623)
		rect.drawRect(0,0,game.world.width *2, game.world.height *2)
		rect.alpha = 0.7
		rect.endFill()
		group.add(rect)

		var plane = group.create(game.world.centerX, game.world.centerY+30,backKeyImagic)
		plane.scale.setTo(1,1)
		plane.anchor.setTo(0.5,0.5)
		var howTo = group.create(game.world.centerX+10,90, howkeyImagic)
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(1,1)
		var button = group.create(game.world.centerX+120, game.world.centerY+270, playKeyImagic)
		button.anchor.setTo(0.5,0.5)
		button.scale.setTo(0.85)
		var tuto = group.create(game.world.centerX, game.world.centerY - 50,'tutorial_image')
		tuto.anchor.setTo(0.5,0.5)

		button.inputEnabled=true;
		button.hitArea=new Phaser.Circle(0,0,button.width);
		button.events.onInputDown.add(function(){
			button.inputEnabled = false
			clickPlay(group,onClickFunction)
		})	
		game.add.tween(button.scale).to({x:0.95,y:0.95},300,Phaser.Easing.linear,true).yoyo(true,-1).repeat(-1)

		spine = game.add.spine(game.world.centerX-120, game.world.centerY+450,"tutorialGif")
		spine.setSkinByName("normal")
		var anim = spine.setAnimationByName(0,"idle",false)
		anim.onComplete = repeatSpine
		group.add(spine)

		var fontStyle = {font: "25px Aldrich-Regular", fill: "#ffffff", align: "center"}
		var typeText = new Phaser.Text(game,game.world.centerX-120 , game.world.centerY+400, tutorialTypeText, fontStyle).setShadow(0, 0, 'rgba(255,255,255,1)', 5);
		spine.x+=10;
		spine.y-=30;
		typeText.x+=15
		typeText.y-=15
		typeText.anchor.setTo(0.5)
		group.add(typeText)

		var playText = new Phaser.Text(game,game.world.centerX+107, game.world.centerY+400, langPlayText, fontStyle).setShadow(0, 0, 'rgba(255,255,255,1)', 5);
		playText.x+=15
		playText.y-=15
		playText.anchor.setTo(0.5)
		group.add(playText)

		var coinsRect = new Phaser.Graphics(game)
		coinsRect.beginFill(0xff0000)
		coinsRect.drawRect(0,-12,364, 30)
		coinsRect.endFill()


		var coinsSprite = game.add.sprite(game.world.centerX-181, game.world.centerY+180);
		coinsSprite.addChild(coinsRect)
		coinsSprite.anchor.setTo(0,0.5)
		group.add(coinsSprite)

		coinsSprite.scale.setTo(0,1)

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

		switch(type){
			case gameTypeEnum.CHOOSE:
				videoName = "choose"
				tutorialTypeText = "ESCOGER"
				break
				case gameTypeEnum.COUNT:
				videoName = "count"
				tutorialTypeText = "CONTAR"
				break
				case gameTypeEnum.GRAB:
				videoName = "grab"
				tutorialTypeText = "RECOLECTAR"
				break
				case gameTypeEnum.MATCH:
				videoName = "match"
				tutorialTypeText = "ARMAR"
				break
				case gameTypeEnum.SEQUENCE:
				videoName = "sequence"
				tutorialTypeText = "SECUENCIA"
				break
				case gameTypeEnum.TARGET:
				videoName = "target" 
				tutorialTypeText = "DIRECCIONAR"
				break
				case gameTypeEnum.TRACE:
				videoName = "trace"
				tutorialTypeText = "TRAZAR"
				break
				case gameTypeEnum.TAP:
				videoName = "tap"
				tutorialTypeText = "TAP"
				break
				case gameTypeEnum.DRAG:
				videoName = "drag and drop"
				tutorialTypeText = "DRAG AND DROP"
				break
		}

		var obj = {
			name:"tutorialGif",
			file:path+videoName+"/"+videoName+".json"
		}

		currentLoader.spine(obj.name, obj.file)
		currentLoader.image(backKeyImagic,sharePath+"images/tutorial/background_tutorial_Imagic.png");
		currentLoader.image(backKeyStars,sharePath+"images/tutorial/back_stars.png");
		currentLoader.image(howkeyImagic,sharePath+'images/tutorial/how_ES_Imagic.png')
		currentLoader.image(playKeyImagic,sharePath+'images/tutorial/play_Imagic.png')


		langPlayText="JUGAR";

	}

	return{
		createTutorialGif:createTutorialGif,
		loadType:loadType,
		configuration:configuration
	}
}()
