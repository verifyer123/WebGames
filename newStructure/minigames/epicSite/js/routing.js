var routing = function () {
	var root = null;
	var useHash = true; // Defaults to: false
	var hash = '#/'; // Defaults to: '#'
	var router = new Navigo(root, useHash, hash);
	var badRouting = false
	$("#minigames").show()

	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

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
				startCharSelector()
			},
			'minigames': function () {
				$("#minigames").hide()
				epicSiteMain.showGames()
			},
			'minigames/:id': function (params) {
				$("#minigames").show()
				var id = params.id
				var games = yogomeGames.getGames()
				console.log(id, games.length)
				var url
				for(var gameIndex = 0; gameIndex < games.length; gameIndex++){
					var game = games[gameIndex]
					var gameId = game.name.trim()
					console.log(gameId)
					if(id === gameId){
						url = game.url
						console.log(url)
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

			function onSuccess() {
				console.log("call welcome modal")
				done()
			}
			var token = getParameterByName("token")
			//pa_[B@6d33b036
			if(token) {
				console.log(token)
				epicModel.loginParent({token: token}, onSuccess)
			}
			else
				done()
		},
		after: function(params) {
			console.log("after")
		}
	});

	router.resolve();

	return router
}()