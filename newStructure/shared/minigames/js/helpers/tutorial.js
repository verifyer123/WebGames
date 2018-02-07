
var tutorialVideo
var videoImage
var tutorialTypeText

function createTutorialGif(group,goalScore,onClickFunction){

	var rect = new Phaser.Graphics(game)
    rect.beginFill(0x000000)
    rect.drawRect(0,0,game.world.width *2, game.world.height *2)
    rect.alpha = 0.7
    rect.endFill()
    rect.inputEnabled = true
    rect.events.onInputDown.add(function(){
        onClickFunction(rect)
        //videoImage.destroy()
        tutorialVideo.stop()
        //tutorialVideo.removeVideoElement()
    })
    
    group.add(rect)
    
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

	tutorialVideo = game.add.video('tutorialGif');
	tutorialVideo.play(true)
	videoImage = tutorialVideo.addToWorld(game.world.centerX-120, game.world.centerY+352, 0.5, 0.5);
	group.add(videoImage)


	var coinsRect = new Phaser.Graphics(game)
	coinsRect.beginFill(0xff0000)
    coinsRect.drawRect(0,0,364, 30)
    coinsRect.endFill()


    var coinsSprite = game.add.sprite(game.world.centerX-181, game.world.centerY+198);
    coinsSprite.addChild(coinsRect)
    coinsSprite.anchor.setTo(0,0.5)
    group.add(coinsSprite)

    coinsSprite.scale.setTo(0,1)

    game.add.tween(coinsSprite.scale).to({x:1},2000,Phaser.Easing.Linear.none,true)


    var fontStyle = {font: "25px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
    var coinText_1 = new Phaser.Text(game,game.world.centerX-120 , game.world.centerY+215, "1 pts", fontStyle)
    coinText_1.stroke = '#000000';
    coinText_1.strokeThickness = 4;
    coinText_1.anchor.setTo(0.5)
    group.add(coinText_1)

    var coinText_2 = new Phaser.Text(game,game.world.centerX , game.world.centerY+215, Math.floor(goalScore/2)+" pts", fontStyle)
    coinText_2.stroke = '#000000';
    coinText_2.strokeThickness = 4;
    coinText_2.anchor.setTo(0.5)
    group.add(coinText_2)

    var coinText_3 = new Phaser.Text(game,game.world.centerX+120 , game.world.centerY+215, goalScore+" pts", fontStyle)
    coinText_3.stroke = '#000000';
    coinText_3.strokeThickness = 4;
    coinText_3.anchor.setTo(0.5)
    group.add(coinText_3)

    var typeText = new Phaser.Text(game,game.world.centerX-120 , game.world.centerY+430, tutorialTypeText, fontStyle)
    typeText.stroke = '#000000';
    typeText.strokeThickness = 4;
    typeText.anchor.setTo(0.5)
    group.add(typeText)

}

function loadType(type){
	var path = tutorialPath+"tutorial_gifs/"
	var videoName

	switch(type){
		case 0:
		videoName = "choose"
		tutorialTypeText = "CHOOSE"
		break
		case 1:
		videoName = "count"
		tutorialTypeText = "COUNT"
		break
		case 2:
		videoName = "grab"
		tutorialTypeText = "GRAB"
		break
		case 3:
		videoName = "match"
		tutorialTypeText = "MATCH"
		break
		case 4:
		videoName = "sequence"
		tutorialTypeText = "SEQUENCE"
		break
		case 5:
		videoName = "target"
		tutorialTypeText = "TARGET"
		break
		case 6:
		videoName = "trace"
		tutorialTypeText = "TRACE"
		break
	}

	//console.log(game.device.webmVideo)

	//if(game.device.webmVideo){
		game.load.video("tutorialGif",path+videoName+".webm")
	/*}
	else{
		game.load.video("tutorialGif",path+videoName+".mp4")
	}*/
}