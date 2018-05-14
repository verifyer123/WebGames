var slideComponent = function(){
	var lastPosition = {x:-1,y:-1}
	var directionEnable = {horizontal:false, vertical:false}
	var FRICTION = 0.9
	var objectFriction = {x:0,y:0}
	var scrollObject
	var horizontalLimits = {inferior:0,superior:0}
	var verticalLimits = {inferior:0,superior:0}

	function updateSlide(x,y){
		var deltaScroll = {x:0,y:0}

		if(lastPosition.x ==-1){
			lastPosition.x = x
			lastPosition.y = y
			objectFriction.x = 0
			objectFriction.y = 0
			return
		}
		else{
			if(directionEnable.horizontal){
				var deltaX = x - lastPosition.x
				deltaX = -deltaX
			    deltaScroll.x = deltaX
		    	lastPosition.x = x
		    	objectFriction.x = deltaX
			}

			if(directionEnable.vertical){
			    var deltaY = y - lastPosition.y
			    deltaY = -deltaY
			    deltaScroll.y = deltaY
		    	lastPosition.y = y
		    	objectFriction.y = deltaY
		    }
		}

		makeScroll(deltaScroll)
		
	}

	function endScroll(){
		lastPosition.x = -1
		lastPosition.y = -1
	}

	function enableDirection(object,horizontal,vertical){
		scrollObject = object
		directionEnable.horizontal = horizontal
		directionEnable.vertical = vertical
	}

	function setHorizontalLimits(inferior,superior){
		horizontalLimits.inferior = inferior
		horizontalLimits.superior = superior
	}

	function setVerticalLimits(inferior,superior){
		verticalLimits.inferior = inferior
		verticalLimits.superior = superior
	}


	function updateFriction(){

		if(objectFriction.x <1 && objectFriction.y <1){
			objectFriction.x = 0
			objectFriction.y = 0
			return
		}

		if(directionEnable.horizontal){

	    	objectFriction.x *= FRICTION
		}

		if(directionEnable.vertical){

		    objectFriction.y *= FRICTION
	    }

        makeScroll(objectFriction)
	}

	
	function makeScroll(delta){
		if(directionEnable.horizontal){
			if(delta.x < 0 && scrollObject.x > horizontalLimits.inferior){
	    		scrollObject.x += delta.x
	    		if(scrollObject.x < horizontalLimits.inferior){
	    			scrollObject.x = horizontalLimits.inferior
	    		}
	    	}
	    	else if(delta.x>0 && scrollObject.x < horizontalLimits.superior){
	    		scrollObject.x += delta.x
	    		if(scrollObject.x > horizontalLimits.superior){
	    			scrollObject.x = horizontalLimits.superior
	    		}
	    	}
	    }

	    if(directionEnable.vertical){
	    	if(delta.y < 0 && scrollObject.y > verticalLimits.inferior){
	    		scrollObject.y += delta.y
	    		if(scrollObject.y < verticalLimits.inferior){
	    			scrollObject.y = verticalLimits.inferior
	    		}
	    	}
	    	else if(delta.y>0 && scrollObject.y < verticalLimits.superior){
	    		scrollObject.y += delta.y
	    		if(scrollObject.y > verticalLimits.superior){
	    			scrollObject.y = verticalLimits.superior
	    		}
	    	}
	    }

	}


	return{
		enableDirection:enableDirection,
		endScroll:endScroll,
		setHorizontalLimits:setHorizontalLimits,
		setVerticalLimits:setVerticalLimits,
		updateSlide:updateSlide,
		updateFriction:updateFriction 
	}
}()