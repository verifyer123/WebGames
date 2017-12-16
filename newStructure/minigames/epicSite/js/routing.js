var routing = function () {
	var root = null;
	var useHash = true; // Defaults to: false
	var hash = '#/'; // Defaults to: '#'
	var router = new Navigo(root, useHash, hash);
	var badRouting = false
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
			},
			'minigames': function () {
				// $("#minigames").hide()
				epicSiteMain.showGames()
			},
			'minigames/:id': function (params) {
				$("#minigames").hide()
				var id = params.id
				var games = yogomeGames.getGames()
				console.log(id, games.length)
				var url
				for(var gameIndex = 0; gameIndex < games.length; gameIndex++){
					var game = games[gameIndex]
					var gameId = game.name.replace(/\s/g, "")
					console.log(gameId)
					if(id === gameId){
						url = game.url
						console.log(url, "matched")
						break
					}
				}
				epicSiteMain.loadGame(url + "index.html?language=" + language)
			},
			'map': function () {
				// if(game)
				// 	game.destroy()
				$("#minigames").hide()
				epicSiteMain.checkPlayer()
			},
			'*': function () {
				// window.location.href = router.root
				$("#minigames").hide()
				epicSiteMain.startGame()
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