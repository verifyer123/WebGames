var amazing = {}

amazing.saveScore = function(score){
	console.log("Saving Score...")
	var messageData = JSON.stringify({score: score})
	parent.postMessage(messageData, window.location.origin)
}

amazing.savePlaycount = function(){
	console.log("Saving Playcount")
	parent.postMessage("increasePlaycount", window.location.origin)
}