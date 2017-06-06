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
		var orientation = "landscape"
		if(degree == 90 || degree == -90){
			hideOverlay()
		}else{
            showOverlay()
			orientation = "portrait"
		}

		return orientation
	}

	function init(onPortraitOrientation){
		screen.orientation = screen.orientation || {}
		var initialDegree = window.orientation || screen.orientation.angle
		var initialOrientation = checkOrientation(initialDegree)
		if(initialOrientation == "landscape"){
			if(onPortraitOrientation && typeof(onPortraitOrientation) == "function"){
				onPortraitOrientation()
			}
		}
		window.addEventListener("orientationchange", function(event){
			var currentDegree = window.orientation || screen.orientation.angle
			var currentOrientation = checkOrientation(currentDegree)
			if(initialOrientation == "portrait" && currentOrientation == "landscape"){
				initialOrientation = "landscape"
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
