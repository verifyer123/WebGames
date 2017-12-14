var yogomeGames = {}

yogomeGames.getGames = function(){
	var games = [
	
		{name:'esquivaCuetes',url:'http://yogome.com',sceneName:'esquivaCuetes',subject:'math',review:true,"advice":"Recuerda que los cohetes pueden\n ser muy peligrosos, mejor obsérvalos\n desde lejos.",yogotar:"dinamita"},
		{name:'humoCocina',url:'http://yogome.com',sceneName:'humoCocina',subject:'math',review:true,advice:"Recuerda que la cocina no\n es un lugar para jugar.",yogotar:'nao'},
		{name:'cortoCircuito',url:'http://yogome.com',sceneName:'cortoCircuito',subject:'math',review:true,advice:"Recuerda tener cuidado con los \n cables y enchufes eléctricos, y en caso\n de accidente siempre pedir ayuda\n a un adulto.",yogotar:"oof"},
        {name:'ollasLocas',url:'http://yogome.com',sceneName:'ollasLocas',subject:'math',review:true,advice:"Recuerda que al cocinar, \n las ollas debes tapar.",yogotar:"estrella"},
        {name:'cuentaContactos',url:'http://yogome.com',sceneName:'cuentaContactos',subject:'math',review:true,advice:"Recuerda siempre \n proteger los contactos electricos \n para evitar accidentes.",yogotar:"dinamita"}
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