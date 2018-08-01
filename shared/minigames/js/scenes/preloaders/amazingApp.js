var preloaderIntro = function(){

	var assets = {
		atlases: [
			{
				name: "logoAtlas",
				json: "../../shared/minigames/images/preloaders/amazing/atlas.json",
				image: "../../shared/minigames/images/preloaders/amazing/atlas.png"}
		],
		images: [
			/*{
				name:"MeizyGif",
				file:"../../shared/minigames/images/preloaders/amazing/spine.gif"
			}*/
		],
		sounds: [],
	}

	var loadingBar = null

	function preload(){
		game.load.spritesheet('gif', "../../shared/minigames/images/preloaders/amazing/spine.jpg", 180, 162,36);
	}


	return {
		assets: assets,
		name: "preloaderIntro",
		preload:preload,
		updateLoadingBar: function(loadedFiles, totalFiles){
			if(loadingBar){
				var loadingStep = loadingBar.width / totalFiles
				loadingBar.topBar.width = loadingStep * loadedFiles
			}
		},

		create: function(event){
            
            game.stage.backgroundColor = "#2cb9c4"
            
            var image = game.add.image(game.world.centerX,game.world.centerY,"gif")
            image.anchor.setTo(0.5)
            var anim = image.animations.add("walk")
            anim.play(30, true);
			
        	setTimeout(function(){
        		completeAnimation = true
        		if(completeLoading){
        			sceneloader.show(window.game.nextTitleScene)
        		}
        	},3000)
	                       

		},
	}
}()