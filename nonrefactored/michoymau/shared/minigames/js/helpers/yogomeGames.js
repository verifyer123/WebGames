var yogomeGames = {}

yogomeGames.getGames = function(){
	var games = [
	
		{name:'esquivaCuetes',url:'http://yogome.com',sceneName:'esquivaCuetes',subject:'math',review:true},
		{name:'humoCocina',url:'http://yogome.com',sceneName:'humoCocina',subject:'math',review:true}        
	]
    
    return games
}

yogomeGames.mixpanelCall = function(callName,gameIndex){
	
	var gamesList = yogomeGames.getGames()
		
	console.log('gameIndex sent ' + gameIndex )

	mixpanel.track(
		callName,
		{"gameName": gamesList[gameIndex].name}
	);
	
		
}