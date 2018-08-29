window.onunload = function(){};
window.gameData
var routing = function () {
	var root = null;
	var useHash = true; // Defaults to: false
	var hash = '#/'; // Defaults to: '#'
	var router = new Navigo(root, useHash, hash);
	var badRouting = false
	var games = yogomeGames.getObjectGames("custom")

	$("#minigames").show()

	router
		.on({

		'minigames/:id': function (params) {
			var id = params.id
			var game = games[id]
			console.log(id, game.url)
			window.gameData=game;
			console.log(language, "language")
			var src = "../minigames/" + game.url + "index.html?language=" + language

			iMagicMain.startGame(src)

			$(".game-canvas p").text("")

			function imageExists(url, callback) {
				var img = new Image();
				img.onload = function(){ callback(true); }
				img.onerror = function(){ callback(false); }
				img.src = url;
			}

			var imageUrl = "../shared/minigames/images/icons/" + game.sceneName + ".png"

			imageExists(imageUrl, function(exists) {

				if(exists){
					$(".bgIcon img").attr("src","../shared/minigames/images/icons/" + game.sceneName + ".png");
				}
				else{
					$(".bgIcon img").attr("src","../shared/minigames/images/icons/default.png");
				}
			});



		},

	})

	router.resolve();

	return router
}()