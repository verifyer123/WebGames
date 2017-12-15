var epicSiteMain =  function(){
	var gameFrame
	var gameContainer

	var DEFAULT_SRC = "../epicMap/index.html?language=" + language

	function loadGame(src){
		home.style.visibility = "visible"
		home.style.opacity = 0

		TweenMax.to(home,1,{opacity:1,onComplete:NextFunction});
		function NextFunction(){
			var characterSelector = document.getElementById("characterSelector")
			characterSelector.style.visibility = "hidden"
			// window.open(url, "_self")
			if(gameFrame)
				gameContainer.removeChild(gameFrame);
			else
				gameFrame = document.createElement("iframe")
			gameFrame.src= src || DEFAULT_SRC
			gameFrame.style.borderStyle = "none"
			gameFrame.scrolling = "no"
			gameFrame.width = "100%"
			gameFrame.height = "100%"
			gameContainer.appendChild(gameFrame);
		}
	}

	function checkPlayer(src){
		// src = src || "#/map"
		// console.log(src)
		var currentPlayer = epicModel.getPlayer()
		if(!currentPlayer.yogotar){
			// routing.navigate("#/yogotarselector")
			window.location.href = "#/yogotarselector"
		}else loadGame(src)

	}

	function main(){
		epicModel.loadPlayer(false, checkPlayer)
	}

	function charSelected(yogotar, url){
		url = "#/map"
		var currentPlayer = epicModel.getPlayer()
		currentPlayer.yogotar = yogotar
		var data = epicCharacters["yogotar" + currentPlayer.yogotar]
		var card = {id: "yogotar" + currentPlayer.yogotar, xp:0, data:data}
		currentPlayer.cards.push(card)
		epicModel.savePlayer(currentPlayer)
		routing.navigate(url)

	}


	function showGames(){
		var characterSelector = document.getElementById("characterSelector")
		characterSelector.style.visibility = "hidden"
		$("#minigames").show()
		home.style.visibility = "hidden"
		var pathGames = "games/nonrefactored/"
		var games = yogomeGames.getGames();
		for(var i = 0 ; i<= games.length-1 ;i++){

			var num = i;
			if(games[i].review){
				$("#content-minigames").append("<div class='col-xs-6 col-sm-4 container'><a href='"+games[i].mapUrl+"' rev='"+games[i].name+"' target='_self' class='gameCatalog' id='gameimg" + num+"' ><img class='growMouse img-responsive bannerMinigame' src='" +games[num].url +"/images/fbpost.png" + "'/></a> </div>");
				$("#gameimg" + num).attr("value",i);
			}
		}
	}

	// function loadCharSelector() {
	// 	// var home = document.getElementById("home")
	// 	// home.style.visibility = "hidden"
	// 	startCharSelector()
	// }

	gameContainer = document.getElementById("game-container")
	// epicModel.loadPlayer(loadGame)

	return{
		charSelected:charSelected,
		startGame:main,
		loadGame:loadGame,
		checkPlayer:checkPlayer,
		showGames:showGames
	}
}()

// window.addEventListener("resize", loadGame);