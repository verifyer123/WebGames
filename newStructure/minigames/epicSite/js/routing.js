var routing = function () {
	var root = null;
	var useHash = true; // Defaults to: false
	var hash = '#/'; // Defaults to: '#'
	var router = new Navigo(root, useHash, hash);
	var badRouting = false
	var credentials = epicModel.getCredentials()

	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	language = getParameterByName("language")
	// console.log(language, "language")
	language = language || "en"
	language = language.toUpperCase()

	$("#minigames").show()

	// router.on(
	// 	function () {
	// 		$("#minigames").hide()
	// 		epicSiteMain.startGame()
	// 	}
	// );

	router
		.on({
			'yogotarselector': function () {
				$("#minigames").hide()
				var characterSelector = document.getElementById("characterSelector")
				characterSelector.style.visibility = "visible"
				startCharSelector()

				mixpanel.track(
					"PageLoadYogotarSelector",
					{"user_id": credentials.educationID}
				);
			},
			'minigames': function () {
				// $("#minigames").hide()
				epicModel.loadPlayer(false, epicSiteMain.showGames)

				mixpanel.track(
					"PageLoadGames",
					{"user_id": credentials.educationID,
					"app":"web",
					"from":"home"}
				);
			},
			'minigames/:id': function (params) {
				$("#minigames").hide()
				var id = params.id
				var games = yogomeGames.getGames()
				// console.log(id, games.length)
				var url
				for(var gameIndex = 0; gameIndex < games.length; gameIndex++){
					var game = games[gameIndex]
					var gameId = game.name.replace(/\s/g, "")
					// console.log(gameId)
					if(id === gameId){
						url = game.url
						console.log(url, "matched")
						break
					}
				}
				console.log(language, "language")
				var src = url + "index.html?language=" + language
				epicSiteMain.startGame(src)

				//TODO: check mixpanel
				// mixpanel.track(
				// 	"minigameLoad",
				// 	{"user_id": credentials.educationID,
				// 	"minigame": id}
				// );
			},
			'map': function () {
				// if(game)
				// 	game.destroy()
				$("#minigames").hide()
				epicSiteMain.startGame(null, false, true, true)

				mixpanel.track(
					"PageLoadAdventureMode",
					{"user_id": credentials.educationID}
				);
			},
			'*': function () {
				// window.location.href = router.root
				$("#minigames").hide()
				epicSiteMain.startGame(null, false, true, true)
			},
		})

	router.hooks({
		before: function(done, params) {
			console.log("checkToken", router)

			var lastRoute = router.lastRouteResolved()
			if((lastRoute.url.includes("minigames"))&&(params)){
				/*Here goes the login validation*/
			}

			epicModel.checkQuery(done)
		},
		after: function(params) {
			console.log("after")
		}
	});

	router.resolve();

	return router
}()