var comunicationScript=function(){
var playerData;
	window.parent.postMessage('loaded','*');
	window.addEventListener('message', function(event) {
		if (event.origin=="http://192.168.1.151:4200" && event.data.player && event.data.timestamp) {
            playerData={
                player:event.data.player,
                coins:event.data.coins,
                timestamp:event.data.timestamp
            }
		} else {
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
        sendData:sendData
    }
}()