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
	var howkey = "how_to_play"
	var playKey = "button_play"
	var backKey = "background_tutorial"

	var spine
	var spineTimeOut

	function createTutorialGif(group,onClickFunction){

		/*var rect = new Phaser.Graphics(game)
		rect.beginFill(0x000000)
		rect.drawRect(0,0,game.world.width *2, game.world.height *2)
		rect.alpha = 0.7
		rect.endFill()
		rect.inputEnabled = true
		rect.events.onInputDown.add(function(){
			rect.inputEnabled = false
			
		})*/

		inTutorial = true

		var rect = new Phaser.Graphics(game)
		rect.beginFill(0x000000)
		rect.drawRect(0,0,game.world.width *2, game.world.height *2)
		rect.alpha = 0.7
		rect.endFill()
		group.add(rect)

		//return

		var plane = group.create(game.world.centerX, game.world.centerY+30,backKey)
		plane.scale.setTo(1,1)
		plane.anchor.setTo(0.5,0.5)

		var tuto = group.create(game.world.centerX, game.world.centerY - 120,'tutorial_image')
		tuto.anchor.setTo(0.5,0.5)

		var howTo = group.create(game.world.centerX,90, howkey)
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)

		var button = group.create(game.world.centerX+120, game.world.centerY+330, playKey)//'atlas.tutorial','play_'+localization.getLanguage())
		button.anchor.setTo(0.5,0.5)
		button.scale.setTo(0.85)

		

		rect = new Phaser.Graphics(game)
		rect.beginFill(0x000000)
		rect.drawRect(button.x-120,button.y-80,240, 160)
		rect.alpha = 0
		rect.endFill()
		rect.inputEnabled = true
		rect.events.onInputDown.add(function(){
			rect.inputEnabled = false
			clickPlay(group,onClickFunction)
		})
		group.add(rect)


		game.add.tween(button.scale).to({x:0.95,y:0.95},300,Phaser.Easing.linear,true).yoyo(true,-1).repeat(-1)

		// if(game.device.webmVideo){
		// 	/*tutorialVideo = game.add.video('tutorialGif');
		// 	tutorialVideo.play(true)*/
		// 	tutorialVideo = game.add.video('tutorialGif');
		// 	tutorialVideo.play(true)
		// 	videoImage = tutorialVideo.addToWorld(game.world.centerX-120, game.world.centerY+354, 0.5, 0.5);
		// 	group.add(videoImage)
		//
		// 	game.input.touch.addTouchLockCallback(function(){
		// 		tutorialVideo.play(true)
		// 	}, tutorialVideo, true);
		//
		// 	/*game.input.touch.addTouchLockCallback(function(){
		// 		tutorialVideo.play(true)
		// 	}, tutorialVideo, true);*/
		//
		//
		// }
		// else{

		spine = game.add.spine(game.world.centerX-120, game.world.centerY+450,"tutorialGif")
		spine.setSkinByName("normal")
		var anim = spine.setAnimationByName(0,"idle",false)
		anim.onComplete = repeatSpine
		group.add(spine)

		// }



		//

		//console.log("Video auto play")

		var coinsRect = new Phaser.Graphics(game)
		coinsRect.beginFill(0xff0000)
		coinsRect.drawRect(0,0,364, 30)
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


		var fontStyle = {font: "25px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
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

		var typeText = new Phaser.Text(game,game.world.centerX-120 , game.world.centerY+400, tutorialTypeText, fontStyle)
		typeText.stroke = '#000000';
		typeText.strokeThickness = 6;
		typeText.anchor.setTo(0.5)
		group.add(typeText)

		//tutorialVideo.video.setAttribute('webkit-playsinline', 'webkit-playsinline');
		//tutorialVideo.video.setAttribute('playsinline', 'playsinline');

		//setTimeout(function(){tutorialVideo.play(true)},1000)

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
		})
		clearTimeout(spineTimeOut)
		group.destroy()

	}

// function tutorialUpdate(){
// 	return
// 	if(inTutorial){
// 		if(!game.device.webmVideo && tutorialVideo.playing){
// 			bmd.cls()
// 			bmd.draw(videoImage,game.world.centerX-120, game.world.centerY+354)
// 			bmd.update()
// 			bmd.processPixelRGB(forEachPixel, this,game.world.centerX-280, game.world.centerY+252,400,400);
// 		}
// 	}
// }

	function onTweenText(text){
		game.add.tween(text.scale).to({x:1,y:1},100,Phaser.Easing.Linear.none,true)
	}

	function forEachPixel(pixel){
		//console.log(pixel)


		if(pixel.r <10 && pixel.g<10 && pixel.b<10){
			pixel.r = 1
			pixel.g = 1
			pixel.b =1
			pixel.a = 1
			//console.log("alpha pixel")
		}
		else{
			//console.log(pixel)
		}
		//else{
		return pixel
		//}

	}


	function loadType(gameData, currentLoader){

		//return
		console.log(gameData)
		
		var path = sharePath+"tutorial_gifs/"
		var videoName

		goalScore = gameData.objective
		var type = gameData.type
		var language = localization.getLanguage()

		switch(type){
			case gameTypeEnum.CHOOSE:
				videoName = "choose"
				if(language=="ES"){
                    tutorialTypeText = "CHOOSE"
				}
				else{
					tutorialTypeText = "ESCOGER"
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
		}

		var obj = {
			name:"tutorialGif",
			file:path+videoName+"/"+videoName+".json"
		}


		currentLoader.spine(obj.name, obj.file)
		
		currentLoader.image(backKey,sharePath+'images/tutorial/background_tutorial.png')
        
        if(language == "ES"){
            currentLoader.image(howkey,sharePath+'images/tutorial/how_ES.png')
            currentLoader.image(playKey,sharePath+'images/tutorial/play_ES.png')
        }
        else{
            currentLoader.image(howkey,sharePath+'images/tutorial/how_EN.png')
            currentLoader.image(playKey,sharePath+'images/tutorial/play_EN.png')
        }
	}

	return{
		createTutorialGif:createTutorialGif,
		loadType:loadType
	}
}()
