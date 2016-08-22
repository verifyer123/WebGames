var yogomeIntro = function(){

	var assets = {
		atlases: [
			{
				name: "logoAtlas",
				json: "images/intro/atlas.json",
				image: "images/intro/atlas.png"}
		],
		images: [],
		sounds: [

		],
	}

	var loadingBar = null

	function initialize(){
		loadingBar.topBar.width = 0
	}

	return {
		assets: assets,
		name: "yogomeIntro",
		updateLoadingBar: function(loadedFiles, totalFiles){
			var loadingStep = loadingBar.width / totalFiles
			loadingBar.topBar.width = loadingStep * loadedFiles
		},
		create: function(event){
			var game = event.game
			var sceneGroup = event.group
			var logo = sceneGroup.create(game.world.centerX, game.world.centerY, 'logoAtlas', 'logo')
			logo.anchor.setTo(0.5, 0.5)

			var loadingGroup = new Phaser.Group(game)
			sceneGroup.add(loadingGroup)

			var loadingBottom = loadingGroup.create(0, 0, 'logoAtlas', 'loading_bottom')
			var loadingTop = loadingGroup.create(0, 0, 'logoAtlas', 'loading_top')

			loadingGroup.bottomBar = loadingBottom
			loadingGroup.topBar = loadingTop

			loadingGroup.x = game.world.centerX - loadingGroup.width * 0.5
			loadingGroup.y = (game.world.centerY + logo.height) - loadingGroup.height * 0.5

			loadingBar = loadingGroup
		},
		show: function(event){
			var game = event.game
			initialize()
			//var teenA = game.add.tween(loadingBar.topBar).to({width: loadingBar.bottomBar.width}, 5000).start()
		},
		hide: function(event){

		}
	}
}()