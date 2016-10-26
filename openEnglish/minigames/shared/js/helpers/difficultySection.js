var difficultySection = function(){

	var diff = "ea"

	function getDifficulty(){
		return diff
	}

	function setDifficulty(difficutly){
		if(difficutly){
			diff = difficutly	
		}
	}


	return {

		getDifficulty: getDifficulty,
		setDifficulty: setDifficulty,
		
	}

}()