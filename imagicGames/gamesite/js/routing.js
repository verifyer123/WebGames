window.onunload = function(){};

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
			// 'yogotarselector': function () {
			// 	epicSiteMain.loadCharacterSelector()
			//
			// 	// var credentials = loginModal.getChildData()
			// 	// mixpanel.track(
			// 	// 	"PageLoadYogotarSelector",
			// 	// 	{"user_id": credentials.educationID}
			// 	// );
			// },
			// 'minigames': function () {
			// 	$(".game-canvas p").text(epicLanguages[language]["minigames"])
			// 	$(".bgIcon img").attr("src","assets/img/common/minigames.png");
			// 	epicSiteMain.startGame("../../../letsplay.html?epicsite=true&language=" + language)
			//
			// 	// mixpanel.track(
			// 	// 	"PageLoadGames",
			// 	// 	{"user_id": credentials.educationID,
			// 	// 	"app":"web",
			// 	// 	"from":"home"}
			// 	// );
			// },
			'minigames/:id': function (params) {
				var id = params.id
				var games = yogomeGames.getObjectGames("custom")
				// console.log(id, games.length)
				var game = games[id]
				console.log(language, "language")
				var src = "../minigames/" + game.url + "index.html?language=" + language

				epicSiteMain.startGame(src)
				console.log(src)

				$(".game-canvas p").text("")
				$(".bgIcon img").attr("src","https://play.yogome.com/shared/minigames/images/icons/"+game.sceneName + ".png");

				//TODO: check mixpanel
				// mixpanel.track(
				// 	"minigameLoad",
				// 	{"user_id": credentials.educationID,
				// 	"minigame": id}
				// );
			},
			// 'map': function () {
			// 	// if(game)
			// 	// 	game.destroy()
			// 	epicSiteMain.startGame(null, false, true, true)
			//
			// 	console.log("map")
			// 	$(".game-canvas p").text(epicLanguages[language]["adventureMode"])
			// 	$(".bgIcon img").attr("src","assets/img/common/adventure_mode.png");
			//
			// 	// mixpanel.track(
			// 	// 	"PageLoadAdventureMode",
			// 	// 	{"user_id": credentials.educationID}
			// 	// );
			// },
			// 'books':function () {
			// 	var characterSelector = document.getElementById("characterSelector")
			// 	characterSelector.style.visibility = "hidden"
			// 	$(".game-canvas p").text(epicLanguages[language]["books"])
			// 	$(".bgIcon img").attr("src","assets/img/common/books.png");
			//
			// 	window.history.replaceState( {} , 'SmartKids', '#/map' );
			// },
			// 'videos':function () {
			// 	var characterSelector = document.getElementById("characterSelector")
			// 	characterSelector.style.visibility = "hidden"
			// 	$(".game-canvas p").text(epicLanguages[language]["videos"])
			// 	$(".bgIcon img").attr("src","assets/img/common/videos.png");
			// 	window.history.replaceState( {} , 'SmartKids', '#/map' );
			//
			// },
			// '*': function () {
			// 	// window.location.href = router.root
			// 	router.navigate("#/map")
			// 	// epicSiteMain.startGame(null, false, true, true)
			// },
		})

	// router.hooks({
	// 	before: function(done, params) {
	// 		console.log("checkToken", router)
	//
	// 		var lastRoute = router.lastRouteResolved()
	// 		if((lastRoute.url.includes("minigames"))&&(params)){
	// 			/*Here goes the login validation*/
	// 		}
	//
	// 		var childData = loginModal.getChildData()
	// 		console.log(childData.remoteID)
	// 		if(!childData.remoteID) {
	// 			console.log("load Player call")
	// 			epicModel.loadPlayer(true, done)
	// 		}
	// 		else
	// 			done()
	// 		// epicModel.checkQuery(done)
	// 	},
	// 	after: function(params) {
	// 		console.log("after")
	// 	}
	// });

	router.resolve();

	return router
}()