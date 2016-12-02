var amazing = {}

amazing.saveScore = function(score){
	console.log("Saving Score...")
	var params = {
		type: "score",
		data: {
			score: score,
		}
	}
	parent.postMessage(JSON.stringify(params), "*")
}

amazing.savePlaycount = function(){
	var params = {
		type: "playcount"
	}
	parent.postMessage(JSON.stringify(params), "*")
}