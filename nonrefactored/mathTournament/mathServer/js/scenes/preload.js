var preloaderIntro = function(){

	var assets = {
		atlases: [{
				name: "logoAtlas",
				json: "images/preload/atlas.json",
				image: "images/preload/atlas.png"
			}],
		images: [
           { 
                name:'logo',
                file: "images/preload/logo.png"}
            
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

			var logo = sceneGroup.create(game.world.centerX, game.world.centerY, 'logo')
			logo.anchor.setTo(0.5, 0.5)
            logo.scale.setTo(0);
             game.add.tween(logo.scale).to({x:0.5,y:0.5},400, Phaser.Easing.Back.Out,true)

			var loadingGroup = new Phaser.Group(game)
			sceneGroup.add(loadingGroup)

			var loadingBottom = loadingGroup.create(0, 0, 'logoAtlas', 'loading_bottom')
			loadingBottom.anchor.y = 0.5

			var loadingTop = loadingGroup.create(0, 0, 'logoAtlas', 'loading_top')
			loadingTop.anchor.y = 0.5

			loadingGroup.bottomBar = loadingBottom
			loadingGroup.topBar = loadingTop

			loadingGroup.x = game.world.centerX - loadingGroup.width * 0.5
			loadingGroup.y = (game.world.centerY + 100) - loadingGroup.height * 0.5

			loadingBar = loadingGroup
			loadingBar.topBar.width = 0
		},
	}
}()