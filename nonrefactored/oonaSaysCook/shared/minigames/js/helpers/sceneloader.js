var sceneloader = function(){

	var sceneList = []
	var game = null
	var initialized = false
	var currentLoader = null

	function init(gameObject){
		game = gameObject
	}

	function createNewLoader(callbacks){
		
		callbacks = callbacks || {}

		var newLoader = new Phaser.Loader(game)

		newLoader.onLoadStart.add(function(){
			//console.log("Preloading scenes")
			if(typeof(callbacks.onStart) === "function"){
				callbacks.onStart()
			}
		})

		newLoader.onFileComplete.add(function(progress, cachekey, success, totalLoaded, totalFiles){
			//console.log("[Resource Loader]:"+cachekey+"("+totalLoaded+"/"+totalFiles+")")
			var eventParams = {
				progress: progress, 
				cachekey: cachekey,
				success: success, 
				totalLoaded: totalLoaded, 
				totalFiles: totalFiles
			}

			if(typeof(callbacks.onLoadFile) === "function"){
				callbacks.onLoadFile(eventParams)
			}
		})

		newLoader.onLoadComplete.add(function(){
			if(typeof(callbacks.onComplete) === "function"){
				callbacks.onComplete()
			}
		})

		return newLoader
	}


	function preload(scenes, callbacks){

		currentLoader = createNewLoader(callbacks)

		for(var indexScene = 0; indexScene < scenes.length; indexScene++){

			var currentScene = scenes[indexScene]
			if(currentScene.assets !== "undefined"){
				var assets = currentScene.assets
				if(typeof assets.images == "object"){
					for(var indexImage = 0; indexImage < assets.images.length; indexImage++){
						var currentImage = assets.images[indexImage]
						currentLoader.image(currentImage.name, currentImage.file)
					}
				}

				if(typeof assets.sounds == "object"){
					for(var indexSound = 0; indexSound < assets.sounds.length; indexSound++){
						var currentSound = assets.sounds[indexSound]
						currentLoader.audio(currentSound.name, currentSound.file)
					}
				}

				if(typeof assets.atlases == "object"){
					for(var indexAtlas = 0; indexAtlas < assets.atlases.length; indexAtlas++){
						var currentAtlas = assets.atlases[indexAtlas]
						currentLoader.atlas(currentAtlas.name, currentAtlas.image, currentAtlas.json, null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY)
					}
				}
			}

			else{
				console.warn("Scene with no Assets to preload")
			}

			saveScene(currentScene)
		}

		currentLoader.start()
	}

	function saveScene(scene){
		scene.name = scene.name || "unamedScene_"+sceneList.length
		var state = game.state.add(scene.name, scene)
		sceneList.push(scene)

		console.log("Preloaded scene: "+scene.name)
	}

	function searchSceneByName(sceneName){
		for(var indexScene = 0; indexScene < sceneList.length; indexScene++){
			var currentScene = sceneList[indexScene]
			if(currentScene.name === sceneName){
				//console.log("Found scene: "+sceneName)
				return currentScene
			}
		}
		console.log("Cannot find scene: "+sceneName)
		return null
	}

	function getScene(sceneName){
		return searchSceneByName(sceneName)
	}

	function show(sceneName){
		var sceneToShow = searchSceneByName(sceneName)

		if(sceneToShow != null){

			//console.log(game.state.states[sceneName])

			game.state.start(sceneToShow.name)

			// var currentState = game.state.getCurrentState()
			// var stage = currentState.stage

			var texture = new Phaser.RenderTexture(game, game.world.width, game.world.height)
			
		}	

		return sceneToShow	
	}

	return {
		preload: preload,
		show: show,
		init: init,
		getScene: getScene,
	}
}()