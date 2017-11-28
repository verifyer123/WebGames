var particles = {}
var imagesPath = "../../shared/minigames/images/"
var game
var gameSong

particles.getAtlas = function(game){
	
	game = game
		
	game.load.atlas('atlas.particles', 'assets/sprites/atlas_hash_trim.png', 'assets/sprites/atlas_json_array_trim.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
	
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