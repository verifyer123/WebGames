var epicModel = function () {
	var url = "https://13-dot-heroesofknowledge.appspot.com"

	var player = {
		minigames:[],
		battles:[],
		cards:[],
		yogotar:"Eagle",
		currentPosition:0,
		currentMinigame:0,
		paidUser:true,
		version: 0.1
	}

	var GAME = "play.yogome"

	var loginParent = "/login/parent"
	var accessChild = "/login/access_child"
	var changeChild = "/login/change_childs"
	var updateChild = "/login/child/update"
	var getChild = "/login/child/get"

	var currentCallback

	function ajaxCall(data, endPoint, callback) {

		$.ajax({
			contentType: 'application/json',
			data: JSON.stringify(data),
			dataType: 'json',
			success: function(data){
				console.log("success", data);
				if((data)&&(data.status === "success")){
					setCredentials(data)
					if(callback)
						callback()
				}else {
					localStorage.setItem("token", null)
					// checkLogin()
				}
			},
			error: function(){
				console.log("error");
				localStorage.setItem("token", null)
				// checkLogin()
			},
			type: 'POST',
			url: url + endPoint
		});
	}

	function initializePlayer() {
		var minigames = epicYogomeGames.getGames()

		for(var mgIndex = 0; mgIndex < minigames.length; mgIndex++){
			var minigame = minigames[mgIndex]
			minigame.completed = false
			minigame.record = 0
			player.minigames.push(minigame)
		}
	}
	
	function updateData() {
		initializePlayer()
		var credentials = getCredentials()
		player = credentials.gameData || player
		if(currentCallback) {
			currentCallback()
			currentCallback = null
		}
	}

	function setCredentials(response) {

		if((response)&&(response.email)){
			localStorage.setItem("email", response.email)
		}

		if((response)&&(response.token)){
			localStorage.setItem("token", response.token)
		}

		if ((response)&&(response.children) && (response.children.length === 1)) {
			var children = response.children[0]
			localStorage.setItem("remoteID", children.remoteID)
		}

		if ((response)&&(response.child)) {
			var children = response.child
			localStorage.setItem("remoteID", children.remoteID)
			if(children.gameData) {
				var gameData = children.gameData
				localStorage.setItem("gameData", JSON.stringify(children.gameData))
			}
		}
	}

	function getCredentials() {
		var email = localStorage.getItem("email")
		email = email === "null" ? null : email

		var token = localStorage.getItem("token")
		token = token === "null" ? null : token

		var remoteID = localStorage.getItem("remoteID")
		remoteID = remoteID === "null" ? null : remoteID

		var gameData = localStorage.getItem("gameData")
		gameData = gameData === "null" ? null : gameData

		return {email:email, token:token, remoteID:remoteID, gameData:gameData}
	}
	
	function checkLogin(){
		var credentials = getCredentials()

		var token = credentials.token
		var email = credentials.email
		var remoteID = credentials.remoteID

		if((token)&&(email)&&(remoteID)){

			var tokenType = token.substr(0, 2)
			console.log(tokenType)
			if (tokenType === "pl"){
				console.log("login player")
				ajaxCall({email:email, token: token, remoteID: remoteID, game:GAME}, getChild, updateData)
			}else if(tokenType === "pa"){
				console.log("call select player")
				ajaxCall({email:email, token: token, remoteID: remoteID}, accessChild, checkLogin)
			}

		}
		else {
			console.log("callLogin")
			modal.showLogin()
			var data = {
				"email": "aaron+20171207_3@yogome.com",
				"password": "explore-endless-adventure"
			}
			localStorage.setItem("email", data.email)
			ajaxCall(data, loginParent, checkLogin)
		}
	}

	function loadPlayer (forceLogin, callback) {
		// var credentials = getCredentials()
		currentCallback = callback
		if(forceLogin) {
			checkLogin()
		}
		else {
			updateData()
		}
	}

	function savePlayer(currentPlayer, forceLogin) {
		player = currentPlayer
		localStorage.setItem("gameData", player)

		var credentials = getCredentials()
		var token = credentials.token
		var email = credentials.email
		var remoteID = credentials.remoteID

		if((token)&&(email)&&(remoteID)){
			ajaxCall({email:email, token: token, remoteID: remoteID, game:GAME, player:player}, updateChild, function () {
				console.log("playerSaved")
			})
		}else if(forceLogin){
			console.log("You need to login to save")
		}
	}

	return{
		loadPlayer:loadPlayer,
		getPlayer:function(){return player},
		savePlayer:savePlayer,
		getCredentials:getCredentials
	}
}()

/*
parent(email, pwd) return (
 */
