window.minigame = window.minigame || {}
window.minigame.orientation = function(){
	var overlay = document.getElementById("orientation-overlay")

	function showOverlay(){
		if(minigame.game){
			minigame.game.canvas.style.visibility = "hidden"
		}
		overlay.style.visibility = "visible"
	}

	function hideOverlay(){
		overlay.style.visibility = "hidden"
		if(minigame.game){
			minigame.game.canvas.style.visibility = "visible"
		}
		isShown = false
	}

	function checkOrientation(degree){
		var orientation = "portrait"
		if(degree == 90 || degree == -90){
			showOverlay()
			orientation = "landscape"
		}else{
			hideOverlay()
		}

		return orientation
	}

	function init(onPortraitOrientation){
		screen.orientation = screen.orientation || {}
		var initialDegree = window.orientation || screen.orientation.angle
		var initialOrientation = checkOrientation(initialDegree)
		if(initialOrientation == "portrait"){
			if(onPortraitOrientation && typeof(onPortraitOrientation) == "function"){
				onPortraitOrientation()
			}
		}
		window.addEventListener("orientationchange", function(event){
			var currentDegree = window.orientation || screen.orientation.angle
			var currentOrientation = checkOrientation(currentDegree)
			if(initialOrientation == "landscape" && currentOrientation == "portrait"){
				initialOrientation = "portrait"
				if(onPortraitOrientation && typeof(onPortraitOrientation) == "function"){
					onPortraitOrientation()
				}	
			}
		})
	}

	return{
		init: init,
	}
}()
