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

function createTutorialGif(group,onClickFunction){

	var rect = new Phaser.Graphics(game)
    rect.beginFill(0x000000)
    rect.drawRect(0,0,game.world.width *2, game.world.height *2)
    rect.alpha = 0.7
    rect.endFill()
    rect.inputEnabled = true
    rect.events.onInputDown.add(function(){
    	rect.inputEnabled = false
    	sound.play("pop")
        game.add.tween(group).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
        	onClickFunction()
        })
        //videoImage.destroy()
        if(game.device.webmVideo){
	        tutorialVideo.stop()
	        inTutorial = false
	    }

	    group.destroy()
        //tutorialVideo.removeVideoElement()
    })
    
    inTutorial = true
    
    group.add(rect)

    //return
    
    var plane = group.create(game.world.centerX, game.world.centerY+60,'atlas.tutorial','background_tutorial')
	plane.scale.setTo(1,1)
    plane.anchor.setTo(0.5,0.5)
	
	var tuto = group.create(game.world.centerX, game.world.centerY - 90,'tutorial_image')
	tuto.anchor.setTo(0.5,0.5)
    
    var howTo = group.create(game.world.centerX,120,'atlas.tutorial','how_'+localization.getLanguage())
	howTo.anchor.setTo(0.5,0.5)
	howTo.scale.setTo(0.8,0.8)
	
	var button = group.create(game.world.centerX+120, game.world.centerY+360,'atlas.tutorial','play_'+localization.getLanguage())
	button.anchor.setTo(0.5,0.5)
	button.scale.setTo(0.85)

	game.add.tween(button.scale).to({x:0.95,y:0.95},300,Phaser.Easing.linear,true).yoyo(true,-1).repeat(-1)



	
	if(game.device.webmVideo){
		/*tutorialVideo = game.add.video('tutorialGif');
		tutorialVideo.play(true)*/
		tutorialVideo = game.add.video('tutorialGif');
		tutorialVideo.play(true)
		videoImage = tutorialVideo.addToWorld(game.world.centerX-120, game.world.centerY+354, 0.5, 0.5);
		group.add(videoImage)

		game.input.touch.addTouchLockCallback(function(){
			tutorialVideo.play(true)
		}, tutorialVideo, true);

		/*game.input.touch.addTouchLockCallback(function(){
			tutorialVideo.play(true)
		}, tutorialVideo, true);*/


	}
	else{
		//videoImage = game.add.sprite(game.world.centerX-120,game.world.centerY+352,'tutorialGif')
		//videoImage.animations.add('loop')
		//videoImage.animations.play('loop',10,true)

		/*var x = document.createElement("IMG");
	    x.setAttribute("src", noWebmTextType);
	    x.setAttribute("width", "304");
	    x.setAttribute("height", "228");
	    x.style.position = "absolute"
	    x.style.top = ((game.world.centerY+352) - (x.height/2))+"px"
	    x.style.left = ((game.world.centerX-120) - (x.width/2))+"px"
	    //x.setAttribute("alt", "The Pulpit Rock");
	    document.body.appendChild(x);*/

		/*videoImage = tutorialVideo.addToWorld(-1000, game.world.centerY+420, 0.5, 0.5);
		bmd = game.add.bitmapData(game.width, game.height);
		var imageBmd = bmd.addToWorld();
		group.add(imageBmd)*/

		var spine = game.add.spine(game.world.centerX-120, game.world.centerY+480,"tutorialGif")
		spine.setSkinByName("normal")
		spine.setAnimationByName(0,"IDLE",true)
		group.add(spine)

	}

	

	//

	//console.log("Video auto play")

	var coinsRect = new Phaser.Graphics(game)
	coinsRect.beginFill(0xff0000)
    coinsRect.drawRect(0,0,364, 30)
    coinsRect.endFill()


    var coinsSprite = game.add.sprite(game.world.centerX-181, game.world.centerY+198);
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
    coinText_1 = new Phaser.Text(game,game.world.centerX-120 , game.world.centerY+215, "1 pts", fontStyle)
    coinText_1.stroke = '#000000';
    coinText_1.strokeThickness = 4;
    coinText_1.anchor.setTo(0.5)
    coinText_1.scale.setTo(0.8)
    group.add(coinText_1)

    coinText_2 = new Phaser.Text(game,game.world.centerX , game.world.centerY+215, Math.floor(goalScore/2)+" pts", fontStyle)
    coinText_2.stroke = '#000000';
    coinText_2.strokeThickness = 4;
    coinText_2.anchor.setTo(0.5)
    coinText_2.scale.setTo(0.8)
    group.add(coinText_2)

    coinText_3 = new Phaser.Text(game,game.world.centerX+120 , game.world.centerY+215, goalScore+" pts", fontStyle)
    coinText_3.stroke = '#000000';
    coinText_3.strokeThickness = 4;
    coinText_3.anchor.setTo(0.5)
    coinText_3.scale.setTo(0.8)
    group.add(coinText_3)

    var typeText = new Phaser.Text(game,game.world.centerX-120 , game.world.centerY+430, tutorialTypeText, fontStyle)
    typeText.stroke = '#000000';
    typeText.strokeThickness = 4;
    typeText.anchor.setTo(0.5)
    group.add(typeText)

    //tutorialVideo.video.setAttribute('webkit-playsinline', 'webkit-playsinline');
	//tutorialVideo.video.setAttribute('playsinline', 'playsinline');

    //setTimeout(function(){tutorialVideo.play(true)},1000)

}

function tutorialUpdate(){
	return
	if(inTutorial){
		if(!game.device.webmVideo && tutorialVideo.playing){
			bmd.cls()
			bmd.draw(videoImage,game.world.centerX-120, game.world.centerY+354)
			bmd.update()
			bmd.processPixelRGB(forEachPixel, this,game.world.centerX-280, game.world.centerY+252,400,400);
		}
	}
}

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


function loadType(gameIndex){

	//return
	var path = tutorialPath+"tutorial_gifs/"
	var videoName

	var list = yogomeGames.getGames()
	goalScore = list[gameIndex].objective
	type = list[gameIndex].type

	switch(type){
		case gameTypeEnum.CHOOSE:
		videoName = "choose"
		tutorialTypeText = "CHOOSE"
		break
		case gameTypeEnum.COUNT:
		videoName = "count"
		tutorialTypeText = "COUNT"
		break
		case gameTypeEnum.GRAB:
		videoName = "grab"
		tutorialTypeText = "GRAB"
		break
		case gameTypeEnum.MATCH:
		videoName = "match"
		tutorialTypeText = "MATCH"
		break
		case gameTypeEnum.SEQUENCE:
		videoName = "sequence"
		tutorialTypeText = "SEQUENCE"
		break
		case gameTypeEnum.TARGET:
		videoName = "target"
		tutorialTypeText = "TARGET"
		break
		case gameTypeEnum.TRACE:
		videoName = "trace"
		tutorialTypeText = "TRACE"
		break
	}

	//console.log(game.device.webmVideo)

	if(game.device.webmVideo){
		game.load.video("tutorialGif",path+videoName+".webm")
		//game.load.video("tutorialGif",path+"sample_iTunes.mov")
	}
	else{

		game.load.spine("tutorialGif",path+videoName+"/"+videoName+".json")
		//noWebmTextType = path+"trace.gif"
		//game.load.image("tutorialGif",path+"test.gif")
	}

	

}
