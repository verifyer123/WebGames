var routing = function () {
	var root = null;
	var useHash = true; // Defaults to: false
	var hash = '#/'; // Defaults to: '#'
	var router = new Navigo(root, useHash, hash);

	router
		.on({
			'yogotarselector': function () {
				startCharSelector()
			},
			'minigame/:id': function (params) {
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
				epicSiteMain.checkPlayer()
			},
			'*':function () {
				epicSiteMain.startGame()
			},
		})
		.resolve();

}()