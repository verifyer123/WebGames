var preloaderIntro = function(){

	var assets = {
		atlases: [
			{
				name: "logoAtlas",
				json: "../../shared/minigames/images/preloaders/amazing/atlas.json",
				image: "../../shared/minigames/images/preloaders/amazing/atlas.png"}
		],
		images: [],
		sounds: [],
	}

	var loadingBar = null

	return {
		assets: assets,
		name: "preloaderIntro",
		updateLoadingBar: function(loadedFiles, totalFiles){
			if(loadingBar){
				var loadingStep = loadingBar.width / totalFiles
				loadingBar.topBar.width = loadingStep * loadedFiles
			}
		},

		create: function(event){
            
            game.stage.backgroundColor = "#ffffff"
            
			var sceneGroup = game.add.group()

			var logo = sceneGroup.create(game.world.centerX, game.world.centerY - 100, 'logoAtlas', 'logo')
			logo.anchor.setTo(0.5, 0.5)

			var loadingGroup = new Phaser.Group(game)
			sceneGroup.add(loadingGroup)

			var loadingBottom = loadingGroup.create(0, 0, 'logoAtlas', 'loading_bottom')
			loadingBottom.anchor.y = 0.5

			var loadingTop = loadingGroup.create(0, 0, 'logoAtlas', 'loading_top')
			loadingTop.anchor.y = 0.5

			loadingGroup.bottomBar = loadingBottom
			loadingGroup.topBar = loadingTop
            loadingGroup.scale.setTo(1,1.2)

			loadingGroup.x = game.world.centerX - loadingGroup.width * 0.5
			loadingGroup.y = game.world.centerY + 75

			loadingBar = loadingGroup
			loadingBar.topBar.width = 0
		},
	}
}()