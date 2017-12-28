var epicSiteMain =  function(){
	var gameFrame
	var gameContainer

	var DEFAULT_SRC = "../epicMap/index.html?language=" + language

	var buttonMinigames = $("#btn3")
	var buttonAdventure = $("#btn1")
	var buttonBooks = $("#btn2")
	var buttonVideos = $("#btn4")
	var home = document.getElementById("home")

	buttonMinigames.click(function () {
		routing.navigate('#/minigames');
	})

	buttonAdventure.click(function () {
		routing.navigate('#/map');
	})

	buttonBooks.click(function () {
		window.location.href = "http://play.yogome.com/yogobooks.html"
	})

	buttonVideos.click(function () {
		window.location.href = "http://play.yogome.com/webisodes.html"
	})
	
	function updatePlayerInfo() {
		var credentials = epicModel.getCredentials()
		var player = epicModel.getPlayer()

		var currentCoins = $(".player-coins").html()
		currentCoins = parseInt(currentCoins)
		var newCoins = player.powerCoins
		var coinsDisplay = $(".player-coins")
		var coinsObj = {coins:currentCoins}

		var name = credentials.name || (player.yogotar ? player.yogotar : "Eagle")
		$(".player-name").html(name)
		$(".player-number").html(player.level)
		var coinImg = $("#player-info img")

		if(newCoins > currentCoins){
			function updateHandler() {
				coinsDisplay.html(coinsObj.coins)
			}
			
			function nextTween() {
				TweenLite.to(coinImg, 0.5, {css:{scale:1}, ease:Quad.easeOut, onComplete:nextTween})
			}
			
			TweenMax.to(coinsObj, 1, {coins:newCoins, roundProps:"coins", onUpdate:updateHandler});
			TweenLite.to(coinImg, 0.5, {css:{scale:1.05}, ease:Quad.easeIn, onComplete:nextTween})
		}else
			$(".player-coins").html(player.powerCoins)
	}

	function loadGame(src){
		home.style.visibility = "visible"
		home.style.opacity = 0

		TweenMax.to(home,1,{opacity:1,onComplete:NextFunction});
		function NextFunction(){
			var characterSelector = document.getElementById("characterSelector")
			characterSelector.style.visibility = "hidden"
			//';ljxz  window.open(url, "_self")
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

	function checkPlayer(src, needYogotar){
		// src = src || "#/map"
		// console.log(src)
		var currentPlayer = epicModel.getPlayer()
		if((!currentPlayer.yogotar)&&(needYogotar)){
			// routing.navigate("#/yogotarselector")
			window.location.href = "#/yogotarselector"
		}else {
			if(currentPlayer.yogotar){
				var yogotarImgPath = "assets/img/common/yogotars/" + currentPlayer.yogotar.toLowerCase() + ".png"
				$( '.yogotar img' ).attr("src",yogotarImgPath);
			}
			loadGame(src)
		}

	}

	function start(src, forceLogin, needYogotar, checkAge){

		var callback = function () {
			checkPlayer(src, needYogotar)
		}

		epicModel.loadPlayer(forceLogin, callback, checkAge)
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

		// var yogotarImgPath = "assets/img/common/yogotars/" + yogotar.toLowerCase() + ".png"
		// $( '.yogotar img' ).attr("src",yogotarImgPath);

		var credentials = epicModel.getCredentials()
		mixpanel.track(
			"yogotarSelected",
			{"user_id": credentials.educationID,
			"yogotar":yogotar}
		);

	}


	function showGames(){
		var characterSelector = document.getElementById("characterSelector")
		characterSelector.style.visibility = "hidden"
		$("#minigames").show()
		home.style.visibility = "hidden"
		var pathGames = "games/nonrefactored/"
		var games = yogomeGames.getGames();

		var currentPlayer = epicModel.getPlayer()
		if(currentPlayer.yogotar){
			var yogotarImgPath = "assets/img/common/yogotars/" + currentPlayer.yogotar.toLowerCase() + ".png"
			$( '.yogotar img' ).attr("src",yogotarImgPath);
		}

		for(var i = 0 ; i<= games.length-1 ;i++){
			var num = i;
			if(games[i].review){
				$("#content-minigames").append("<div class='col-xs-6 col-sm-4 container'><a href='"+games[i].mapUrl+"' rev='"+games[i].name+"' target='_self' class='gameCatalog' id='gameimg" + num+"' ><img class='growMouse img-responsive bannerMinigame' src='" +games[num].url +"images/fbpost.png" + "'/></a> </div>");
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
		startGame:start,
		// loadGame:loadGame,
		// checkPlayer:checkPlayer,
		showGames:showGames,
		updatePlayerInfo:updatePlayerInfo,
	}
}()

// window.addEventListener("resize", loadGame);