var comunicationScript=function(){

var playerData;
	window.parent.postMessage('loaded','*');
	window.addEventListener('message', function(event) {
		if (event.origin=="http://localhost:4200" && event.data.player) {
			// hacer cosas con los datos 
			alert("Datos recibidos. Timestamp: " + event.data.timestamp);
            playerData={
                playerName:event.data.player,
                playerCoins:event.data.coins,
                gameId:event.data.timestamp
            }
		} else {
			return;
		}
	});
}()