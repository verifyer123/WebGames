var comunicationScript=function(){
var playerData;
	window.parent.postMessage('loaded','*');
	window.addEventListener('message', function(event) {
		if ((event.origin=="http://192.168.1.151:4200" || event.origin=="https://imag.mogoymoma.com" || event.origin=="https://imag.mogoymoma2.com/" || event.origin=="https://imagicplay.com/") && event.data.player && event.data.timestamp) {
            playerData={
                player:event.data.player,
                coins:event.data.coins,
                timestamp:event.data.timestamp
            }
		} else {
			if(parent.gameData===undefined && event.origin!="https://staticxx.facebook.com"){
				window.parent.postMessage('close','*');
			}
			return;
		}
	});
    function sendData(){
        return playerData
    }
    function finalMessage(data){
        window.parent.postMessage(data,'*');
    }
	function closeGame(){
		window.parent.postMessage('close','*');
	}
    return{
        finalMessage:finalMessage,
        sendData:sendData,
		closeGame:closeGame
    }
}()