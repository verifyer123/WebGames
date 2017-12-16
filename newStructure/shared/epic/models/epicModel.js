var epicModel = function () {
	var url = "https://12-dot-heroesofknowledge.appspot.com"
	// var DEFAULT_CARD = {id:"yogotarEagle", xp:0, data:epicCharacters["yogotarEagle"]}

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
	var unlockAccessCall
	var signInCallback

	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

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
				modal.showLogin()
				// checkLogin()
			}
		}).fail(function(response){
			console.log("error", response);
			localStorage.setItem("token", null)
			if(onError)onError(response)
			modal.showLogin()
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
		if(credentials.subscribed){
			if(unlockAccessCall) {
				unlockAccessCall()
				unlockAccessCall = null
			}
		}
		else if(signInCallback)
			modal.showYouKnow()

		if(currentCallback) {
			currentCallback()
			currentCallback = null
		}

		if(signInCallback){
			signInCallback()
			signInCallback = null
		}

		if((mixpanel)&&(credentials.email)){
			mixpanel.identify(credentials.email);
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

		if((response)&&(response.subscribed)){
			localStorage.setItem("subscribed", true)
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

		var subscribed = localStorage.getItem("subscribed")
		subscribed = subscribed === "null" ? null : JSON.parse(subscribed)

		return {
			email:email,
			token:token,
			remoteID:remoteID,
			gameData:gameData,
			educationID:educationID,
			subscribed:subscribed
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
		signInCallback = onSuccess

		function callback(response){
			checkLogin(response)
		}

		setCredentials(data)
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

	function loadPlayer (forceLogin, callback, unlockCall) {
		// var credentials = getCredentials()
		unlockAccessCall = unlockCall
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

	function checkQuery(callBack){
		function onSuccess() {
			modal.showWelcome()
			if(callBack)callBack()
		}
		var token = getParameterByName("token")
		var email = getParameterByName("email")
		token = token ? decodeURIComponent(token) : null
		email = email ? decodeURIComponent(email) : null
		//pa_%5BB%406d33b036
		//aaron%2B20171207_2%40yogome.com
		// var token = null//"pa_[B@15f1b80"
		// var email = "aaron+20171207_2@yogome.com"

		if((token)&&(email)) {
			localStorage.setItem("email", email)
			console.log(token)
			epicModel.loginParent({token: token, email:email}, onSuccess)
		}
		else
			if(callBack)callBack()
	}

	return{
		loadPlayer:loadPlayer,
		getPlayer:function(){return player},
		savePlayer:savePlayer,
		getCredentials:getCredentials,
		loginPlayer:loginPlayer,
		loginParent:signIn,
		recoverPass:recoverPass,
		checkQuery:checkQuery
	}
}()

/*
parent(email, pwd) return (
 */
