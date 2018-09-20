var preloaderIntro = function(){

	var assets = {
		atlases: [
			{
				name: "logoAtlas",
				json: "../../shared/minigames/images/preloaders/imagic/atlas.json",
				image: "../../shared/minigames/images/preloaders/imagic/atlas.png"}
		],
		images: [
			{
			name: "tileStars",
			file: "../../shared/minigames/images/preloaders/imagic/stars.png"}
		],
		sounds: [

		],
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

			var sceneGroup = game.add.group()
	
			var background = sceneGroup.create(0,0,'logoAtlas', 'background');
			background.scale.setTo(2,1);
			
			var logo = sceneGroup.create(game.world.centerX, game.world.centerY-100, 'logoAtlas', 'logo')
			logo.scale.setTo(1, 1)
			logo.anchor.setTo(0.5, 0.5)
			
			var tileStars = game.add.tileSprite(0,0,game.world.width,game.world.height,'tileStars');
			tileStars.scale.setTo(1,1);
			sceneGroup.add(tileStars)
			
			var loadingText = sceneGroup.create(logo.x-logo.width/2 * 0.98, logo.y+220, 'logoAtlas', 'cargando')
			loadingText.anchor.y = 0.5

			var loadingGroup = new Phaser.Group(game)
			sceneGroup.add(loadingGroup)

			var loadingBottom = loadingGroup.create(0, 0, 'logoAtlas', 'loading_bottom')
			loadingBottom.anchor.y = 0.5

			var loadingTop = loadingGroup.create(0, 0, 'logoAtlas', 'loading_top')
			loadingTop.anchor.y = 0.5

			loadingGroup.bottomBar = loadingBottom
			loadingGroup.topBar = loadingTop

			loadingGroup.x = game.world.centerX - loadingGroup.width *0.5
			loadingGroup.y = (game.world.centerY + 180) - loadingGroup.height * 2

			loadingBar = loadingGroup
			loadingBar.topBar.width = 0
		},
	}
}()