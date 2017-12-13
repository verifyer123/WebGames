var routing = function () {
	var root = null;
	var useHash = true; // Defaults to: false
	var hash = '#/'; // Defaults to: '#'
	var router = new Navigo(root, useHash, hash);
	$("#minigames").show()

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
				var games = epicYogomeGames.getGames()
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
				$("#minigames").hide()
				epicSiteMain.startGame()
			}
			// 'books': function () {
			// 	$("#minigames").hide()
			// 	window.location.href = "http://play.yogome.com/yogobooks.html"
			// 	// window.location.reload(true)
			// 	// router.navigate("http://play.yogome.com/yogobooks.html", true)
			// },
		})

		router.resolve();

	return router
}()