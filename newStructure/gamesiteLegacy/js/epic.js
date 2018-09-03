var epicSiteMain =  function(){
	var DEVICE_WIDTH = 540
	var DEVICE_HEIGHT = 960

	var gameFrame
	var gameContainer
	var charactersFrame

	var DEFAULT_SRC = "../minigames/epicMap/index.html?language=" + language
	var INTR0_TIME = 3000
	var BUTTON_DELAY = 1000

	var buttonMinigames = $(".btn3")
	var buttonAdventure = $(".btn1")
	var buttonBooks = $(".btn2")
	var buttonVideos = $(".btn4")
	var home = document.getElementById("home")
	home.style.visibility = "visible"
	var popAudio = new Audio('sounds/pop.mp3');
	var currentTimeout
	var delayTime = 0
	var currentSrc //= DEFAULT_SRC

	$("#homeButton").click(function(){
		hideHome(null, true)

	});

	buttonMinigames.click(function () {

		delayTime = 3000
		tweenButton(this)
		popAudio.play();

		var lastRoute = routing.lastRouteResolved()
		if(lastRoute.url === "minigames"){
			showHome()
			return
		}

		hideHome(function () {
			routing.navigate('#/minigames');
		})
		var lanAbr = language.toLowerCase()

		setTimeout(function () {
			var booksAudio = new Audio('assets/sounds/'+lanAbr+'/minigames.mp3');
			booksAudio.play();
		}, BUTTON_DELAY)
	})

	buttonAdventure.click(function () {

		delayTime = 3000
		tweenButton(this)
		popAudio.play();

		var lastRoute = routing.lastRouteResolved()
		if(lastRoute.url === "map") {
			showHome()
			return
		}

		hideHome(function () {
			routing.navigate('#/map');
		})
		var lanAbr = language.toLowerCase()

		setTimeout(function () {
			var booksAudio = new Audio('assets/sounds/'+lanAbr+'/adventure_mode.mp3');
			booksAudio.play();
		}, BUTTON_DELAY)
	})

	buttonBooks.click(function () {
		delayTime = 3000
		popAudio.play();
		tweenButton(this)

		var lastRoute = routing.lastRouteResolved()
		if(lastRoute.url === "books") {
			showHome()
			return
		}

		hideHome(function () {
			routing.navigate("#/books")
			if (gameFrame) {
				gameContainer.removeChild(gameFrame);
				gameFrame = null
			}
			showHome()
		})


		var lanAbr = language.toLowerCase()

		setTimeout(function () {
			var booksAudio = new Audio('assets/sounds/'+lanAbr+'/books.mp3');
			booksAudio.play();
		}, BUTTON_DELAY)


		if(currentTimeout){
			clearTimeout(currentTimeout)
		}
		currentTimeout = setTimeout(function() {
			window.location.href = "https://play.yogome.com/yogobooks.html?language=" + language
			delayTime = 0
		}, delayTime)
	})

	buttonVideos.click(function () {
		delayTime = 3000
		popAudio.play();
		// $("#sectionInfo").css("visibility", "visible")
		tweenButton(this)

		var lastRoute = routing.lastRouteResolved()
		if(lastRoute.url === "videos") {
			showHome()
			return
		}

		hideHome(function () {
			routing.navigate("#/videos")
			if (gameFrame) {
				gameContainer.removeChild(gameFrame);
				gameFrame = null
			}
			showHome()
		})

		if (gameFrame) {
			gameContainer.removeChild(gameFrame);
			gameFrame = null
		}

		var lanAbr = language.toLowerCase()

		setTimeout(function () {
			var booksAudio = new Audio('assets/sounds/'+lanAbr+'/videos.mp3');
			booksAudio.play();
		}, BUTTON_DELAY)

		if(currentTimeout){
			clearTimeout(currentTimeout)
		}
		currentTimeout = setTimeout(function() {
			delayTime = 0
			window.location.href = "https://play.yogome.com/webisodes.html?language=" + language
		}, delayTime)
	})

	function tweenButton(obj) {
		function nextTween() {
			TweenLite.to(obj, 0.3, {css:{scale:1}, ease:Quad.easeOut, delay:1})
		}
		TweenLite.to(obj, 0.3, {css:{scale:1.2}, ease:Quad.easeOut, onComplete:nextTween})
	}

	function showHome(callback) {
		TweenMax.to(home, 0.5, {y: "0%", ease:Quad.easeInOut, onComplete:function () {
				if(callback) callback()
			}});
		homeButton.style.visibility = "visible";
		home.style.visibility = "visible"
	}

	function hideHome(callback, keepFrame) {
		if(home.style.visibility !== "visible"){
			callback()
			return
		}

		TweenMax.to(home, 0.5,{y: "115%", ease:Quad.easeInOut, onComplete:function () {
				if(callback) callback()
				if (gameFrame&&!keepFrame) {
					gameContainer.removeChild(gameFrame);
					gameFrame = null
					home.style.visibility = "hidden"
				}
			}});
		homeButton.style.visibility = "hidden";
	}

	function updatePlayerInfo() {

		var credentials = loginModal.getChildData()
		var player = epicModel.getPlayer()

		var currentCoins = $(".player-coins").html()
		currentCoins = parseInt(currentCoins)
		var newCoins = player.powerCoins
		var coinsDisplay = $(".player-coins")
		var coinsObj = {coins:currentCoins}

		if(player.yogotar){
			var yogotarImgPath = "assets/img/common/yogotars/" + player.yogotar.toLowerCase() + ".png"
			$( '.yogotar img' ).attr("src",yogotarImgPath);
		}

		var name = credentials.nickname || (player.yogotar ? player.yogotar : "Eagle")
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

		currentSrc = src
		// $(".game-canvas p").style.visibility = "hidden"
		// $("#sectionInfo").css("visibility", "hidden")
		//';ljxz  window.open(url, "_self")
		if (gameFrame) {
			gameContainer.removeChild(gameFrame);
			gameFrame = null
		}

		gameFrame = document.createElement("iframe")
		console.log(src)
		gameFrame.src = src //+ "&rand=" + Math.round(Math.random() * 10000000);
		gameFrame.style.borderStyle = "none"
		gameFrame.style.position = "absolute"
		gameFrame.style.top = "0"
		gameFrame.style.zIndex = "3"
		// gameFrame.scrolling = "yes"
		gameFrame.width = "100%"
		gameFrame.height = "100%"
		gameContainer.appendChild(gameFrame);

	}

	$( window ).on( "orientationchange", function( event ) {
		window.setTimeout(function () {
			initSkin()
			loadGame(currentSrc)
		}, 500)

	});

	function checkPlayer(src, needYogotar){
		// src = src || "#/map"
		// console.log(src)
		var currentPlayer = epicModel.getPlayer()
		if((!currentPlayer.yogotar)&&(needYogotar)){
			// routing.navigate("#/yogotarselector")
			window.location.href = "#/yogotarselector"
		}else {
			loadGame(src)
		}

	}

	function start(src, forceLogin, needYogotar, checkAge){
		checkPlayer(src, needYogotar)
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

		var credentials = loginModal.getChildData()
		mixpanel.track(
			"yogotarSelected",
			{"user_id": credentials.educationID,
				"yogotar":yogotar}
		);

		updatePlayerInfo()
	}

	function setCharacterHome(selectedCharacter){

		var yogotarImgPath = "assets/img/common/yogotars/" + selectedCharacter.toLowerCase() + ".png"
		$( '.yogotar img' ).attr("src",yogotarImgPath);

		var characterSelector = document.getElementById("characterSelector")
		TweenMax.to(characterSelector, 0.5, {opacity: 0, ease:Quad.easeInOut, onComplete:function () {
				characterSelector.style.visibility = "hidden"
			}})
	}

	function loadCharacterSelector(){
		var div = document.getElementById("characterSelector")
		div.style.visibility = "visible"
		div.style.opacity = 1

		var body = document.getElementById("characterSelector");
		if (charactersFrame) {
			body.removeChild(charactersFrame);
			charactersFrame = null
		}

		charactersFrame = document.createElement("iframe")
		charactersFrame.src = "../minigames/characterSelect/index.html?language=" + language + "&rand=" + Math.round(Math.random() * 10000000);
		charactersFrame.style.borderStyle = "none"
		charactersFrame.style.position = "absolute"
		charactersFrame.style.top = "0"
		charactersFrame.style.zIndex = "3"
		// gameFrame.scrolling = "yes"
		charactersFrame.width = "100%"
		charactersFrame.height = "100%"
		body.appendChild(charactersFrame);
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

	function initSkin() {
		var iframeElement = document.getElementById("iframe")

		var width = iframeElement.offsetWidth
		var height = iframeElement.offsetHeight
		var ratio = DEVICE_HEIGHT / DEVICE_WIDTH
		var newHeight = Math.round(width * ratio)
		iframeElement.style.maxHeight = newHeight + "px"

		var iframeInner = document.getElementById("iframe-inner")
		var totalHeight = iframeInner.offsetHeight
		var percentSize = (totalHeight - newHeight) + (totalHeight) * 0.04 //+ 132
		// percentSize = Math.round(percentSize) + Math.round((totalHeight - newHeight) / (132 * 5) * 100)

		iframeInner.style.backgroundSize = percentSize + "px"
	}

	gameContainer = document.getElementById("game-container")
	initSkin()
	// epicModel.loadPlayer(loadGame)

	return{
		charSelected:charSelected,
		startGame:loadGame,
		// loadGame:loadGame,
		// checkPlayer:checkPlayer,
		loadCharacterSelector:loadCharacterSelector,
		showGames:showGames,
		updatePlayerInfo:updatePlayerInfo,
		setCharacterHome:setCharacterHome
	}
}()



// window.addEventListener("resize", loadGame);