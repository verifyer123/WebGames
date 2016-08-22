var sceneloader = function(){

	var sceneList = []
	var game = null
	var initialized = false
	var currentLoader = null

	function init(gameScene){
		if(!initialized){
			initialized = true
			game = gameScene
		}
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
				if(assets.images !== "undefined"){
					for(var indexImage = 0; indexImage < assets.images.length; indexImage++){
						var currentImage = assets.images[indexImage]
						currentLoader.image(currentImage.name, currentImage.file)
					}
				}

				if(assets.sounds !== "undefined"){
					for(var indexSound = 0; indexSound < assets.sounds.length; indexSound++){
						var currentSound = assets.sounds[indexSound]
						currentLoader.audio(currentSound.name, currentSound.file)
					}
				}
			}

			else{
				console.warn("Scene with no Assets to preload")
			}

			saveScene(currentScene)
			currentLoader.start()
		}
	}

	function saveScene(scene){
		scene.group = game.add.group()
		scene.name = scene.name || "unamedScene_"+sceneList.length
		scene.create = scene.create || function(){console.warn("["+this.name+"]"+"Scene without create method")}
		scene.show = scene.show || function(){console.warn("["+this.name+"]"+" Scene without show method")}
		scene.hide = scene.hide || function(){console.warn("["+this.name+"]"+"Scene without hide method")}
		sceneList.push(scene)
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

	function hideScenes(){
		for(var indexScene = 0; indexScene < sceneList.length; indexScene++){
			var currentScene = sceneList[indexScene]
			currentScene.group.visible = false
		}
	}

	function getScene(sceneName){
		return searchSceneByName(sceneName)
	}

	function create(scene, eventParams){
		scene.create(eventParams)
	}

	function show(sceneName){
		var sceneToShow = searchSceneByName(sceneName)

		if(sceneToShow != null){
			var eventParams = {
				group: sceneToShow.group,
				game: game
			}

			if(!sceneToShow.created){
				create(sceneToShow, eventParams)
			}

			hideScenes()
			sceneToShow.group.visible = true
			sceneToShow.show(eventParams)
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