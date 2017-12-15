var epicModel = function () {
	var url = "https://13-dot-heroesofknowledge.appspot.com"
	var DEFAULT_CARD = {id:"yogotarEagle", xp:0, data:epicCharacters["yogotarEagle"]}

	var player = {
		minigames:[],
		battles:[],
		cards:[],
		yogotar:null,
		minigamesPlayed:0,
		currentPosition:0,
		currentMinigame:0,
		paidUser:false,
		powerCoins:0,
		version: 0.1
	}

	var GAME = "play.yogome"

	var loginParent = "/login/parent"
	var accessChild = "/login/access_childs"
	var changeChild = "/login/change_childs"
	var updateChild = "/login/child/update"
	var getChild = "/login/child/get"
	var userRecover = "/users/parent/recover"

	var currentCallback

	function ajaxCall(data, endPoint, onSuccess, onError) {

		$.ajax({
			contentType: 'application/json',
			data: JSON.stringify(data),
			dataType: 'json',
			type: 'POST',
			url: url + endPoint,
			async:true,
			processData:false
		}).done(function(response){
			console.log("success", response);
			if((response)&&(response.status === "success")){
				setCredentials(response)
				if(onSuccess)
					onSuccess(response)
			}else {
				localStorage.setItem("token", null)
				if(onError)onError(response)
				// checkLogin()
			}
		}).fail(function(response){
			console.log("error", response);
			localStorage.setItem("token", null)
			if(onError)onError(response)
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
			localStorage.setItem("educationID", children.educationID)
		}

		if ((response)&&(response.child)) {
			var child = response.child
			localStorage.setItem("remoteID", child.remoteID)
			localStorage.setItem("educationID", child.educationID)
			if(child.gameData) {
				var gameData = child.gameData
				localStorage.setItem("gameData", JSON.stringify(child.gameData))
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

		var educationID = localStorage.getItem("educationID")
		educationID = educationID === "null" ? "none" : educationID

		var gameData = localStorage.getItem("gameData")
		gameData = gameData === "null" ? null : JSON.parse(gameData)

		return {
			email:email,
			token:token,
			remoteID:remoteID,
			gameData:gameData,
			educationID:educationID
		}
	}
	
	function checkPlayers(response) {
		console.log(response)
		modal.showPlayers(response.children)
	}

	function loginPlayer(remoteID, callback) {
		var credentials = getCredentials()
		ajaxCall({email:credentials.email, token: credentials.token, remoteID: remoteID}, accessChild, checkLogin)
	}

	function signIn(data, onSuccess, onError) {
		console.log(data)
		currentCallback = onSuccess
		function callback(response){
			checkLogin(response)
		}
		if(data.token)
			ajaxCall({email: data.email, token: data.token}, loginParent, callback, onError)
		else
			ajaxCall({email:data.email, password: data.password}, loginParent, callback, onError)
	}
	
	function checkLogin(response){
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
				if(response)
					checkPlayers(response)
				else {
					localStorage.setItem("token", null)
					checkLogin()
				}
			}

		}
		else {
			console.log("callLogin")
			// modal.showLogin()
			// var data = {
			// 	"email": "aaron+20171207_2@yogome.com",
			// 	"password" : "yogome-children-fun"
			// }
			// localStorage.setItem("email", data.email)
			// ajaxCall(data, loginParent, checkLogin)
			modal.showLogin()
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

	function savePlayer(currentPlayer, forceLogin, loginTag) {
		player = currentPlayer
		localStorage.setItem("gameData", JSON.stringify(player))

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
			modal.showSave(loginTag)
		}
	}
	
	function recoverPass(email, onSuccess, onError) {
		ajaxCall({email:email}, userRecover, onSuccess, onError)
	}

	return{
		loadPlayer:loadPlayer,
		getPlayer:function(){return player},
		savePlayer:savePlayer,
		getCredentials:getCredentials,
		loginPlayer:loginPlayer,
		loginParent:signIn,
		recoverPass:recoverPass
	}
}()

/*
parent(email, pwd) return (
 */
