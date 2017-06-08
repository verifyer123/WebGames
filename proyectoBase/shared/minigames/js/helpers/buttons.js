var buttons = {}
var imagesPath = "../../shared/minigames/images/"
var game
var gameSong

buttons.getImages = function(game){
	
	game = game
		
	game.load.image('audioOn',imagesPath + "buttons/audio_on.png")
	game.load.image('audioOff',imagesPath + "buttons/audio_off.png")
	
}

buttons.getButton = function(song,group,posX, posY){
	
	gameSong = song
	
	console.log(song + ' song')

	var button = game.add.group()
	button.x = posX || game.world.width - 215
	button.y = posY || 30
	button.scale.setTo(0.45,0.45)
	group.add(button)

	var buttonImage = button.create(0,0,'audioOff')
	buttonImage.anchor.setTo(0.5,0.5)

	var buttonImage = button.create(0,0,'audioOn')
	buttonImage.pressed = false
	buttonImage.inputEnabled = true
	buttonImage.events.onInputDown.add(inputButton)
	buttonImage.anchor.setTo(0.5,0.5)
		
}

function inputButton(btn){
	
	btn.pressed = !btn.pressed
	
	btn.parent.children[0].alpha = btn.pressed
	btn.parent.children[1].alpha = !btn.pressed
	
	if(btn.pressed){
		gameSong.stop()
	}else{
		gameSong.play()
	}
}