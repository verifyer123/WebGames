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
	console.log("Saving Score...")
	var params = {
		type: "playcount"
	}
	parent.postMessage(JSON.stringify(params), "*")
}

amazing.share = function(score, game){
	console.log("Sharing...")
	var params = {
		type: "share",
		score: score,
		game: game,
	}
	parent.postMessage(JSON.stringify(params), "*")
}