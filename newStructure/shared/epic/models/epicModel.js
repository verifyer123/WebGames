var epicModel = function () {
	var url = "https://12-dot-heroesofknowledge.appspot.com"
	// var DEFAULT_CARD = {id:"yogotarEagle", xp:0, data:epicCharacters["yogotarEagle"]}

	var player = {
		minigames:{},
		battles:[],
		cards:[],
		yogotar:null,
		minigamesPlayed:0,
		currentPosition:0,
		currentMinigame:0,
		paidUser:false,
		powerCoins:0,
		level:1,
		version: 0.2
	}

	var GAME = "play.yogome"

	var LOGIN_PARENT = "/login/parent"
	var ACCESS_CHILD = "/login/access_childs"
	var CHANGE_CHILD = "/login/change_childs"
	var UPDATE_CHILD = "/login/child/update"
	var GET_CHILD = "/login/child/get"
	var USER_RECOVERY = "/users/parent/recover"

	var currentCallback
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
			// console.log("success", response);
			if((response)&&(response.status === "success")){
				setCredentials(response)
				if(onSuccess)
					onSuccess(response)
			}else {
				localStorage.setItem("token", null)
				if(onError)onError(response)
				if(!signInCallback) modal.showLogin()
				// checkLogin()
			}
		}).fail(function(response){
			// console.log("error", response);
			localStorage.setItem("token", null)
			if(onError)onError(response)
			if(!signInCallback) modal.showLogin()
			// modal.showLogin()
		});
	}

	function initializePlayer() {
		var minigames = yogomeGames.getObjectGames()

		for(var key in minigames){
			if(!player.minigames[key]){
				player.minigames[key] = minigames[key]
				player.minigames[key].completed = false
				player.minigames[key].record = 0
			}
		}

	}

	function callMixpanelLogin(subscribed){
		var credentials = epicModel.getCredentials()
		mixpanel.track(
			"onLoginSuccess",
			{"user_id": credentials.educationID,
				"subscribed":subscribed}
		);
		mixpanel.people.increment("loginCount");
		// console.log("loginMixpanel", subscribed)
	}
	
	function updateData() {
		var credentials = getCredentials()
		player = credentials.gameData || player
		initializePlayer()
		if(currentCallback) {
			currentCallback(credentials.subscribed)
			currentCallback = null
		}
		if(signInCallback){
			signInCallback = false
			callMixpanelLogin(credentials.subscribed)
			if(!credentials.subscribed)
				modal.showYouKnow()
		}

		if((mixpanel)&&(credentials.email)){
			mixpanel.identify(credentials.email);
		}

		if((typeof epicSiteMain !== "undefined") && (typeof epicSiteMain.updatePlayerInfo === "function")){
			epicSiteMain.updatePlayerInfo()
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
			localStorage.setItem("name", children.name)
		}

		if ((response)&&(response.child)) {
			var child = response.child
			localStorage.setItem("remoteID", child.remoteID)
			localStorage.setItem("educationID", child.educationID)
			localStorage.setItem("name", child.name)
			if(child.gameData) {
				var gameData = child.gameData
				gameData = JSON.stringify(child.gameData)
				if(gameData.version === player.version)
					localStorage.setItem("gameData", gameData)
				else{
					gameData.minigames = {}
					localStorage.setItem("gameData", gameData)
				}
			}
		}

		if((response)&&(response.subscribed)){
			localStorage.setItem("subscribed", true)
		}
	}

	function getJson(stringData) {
		var jsonData
		try{
			jsonData = JSON.parse(stringData)
		}catch (e){
			jsonData = null
		}

		return jsonData
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
		gameData = gameData === "null" ? null : getJson(gameData)
		if((gameData) && (gameData.version !== player.version)){
			gameData.minigames = {}
		}

		var subscribed = localStorage.getItem("subscribed")
		// subscribed = typeof subscribed === "boolean" ? subscribed : false
		// console.log(subscribed)

		var name = localStorage.getItem("name")
		name = (name === "null" || !name) ? null : name

		return {
			email:email,
			token:token,
			remoteID:remoteID,
			gameData:gameData,
			educationID:educationID,
			subscribed:subscribed,
			name:name
		}
	}
	
	function checkPlayers(response) {
		// console.log(response)
		modal.showPlayers(response.children)
	}

	function loginPlayer(remoteID, callback) {
		var credentials = getCredentials()
		ajaxCall({email:credentials.email, token: credentials.token, remoteID: remoteID}, ACCESS_CHILD, checkLogin)
	}

	function signIn(data, onSuccess, onError) {
		// console.log(data)
		signInCallback = true

		function callback(response){
			onSuccess()
			checkLogin(response)
		}

		setCredentials(data)
		if(data.token)
			ajaxCall({email: data.email, token: data.token}, LOGIN_PARENT, callback, onError)
		else
			ajaxCall({email:data.email, password: data.password}, LOGIN_PARENT, callback, onError)
	}
	
	function checkLogin(response){
		var credentials = getCredentials()

		var token = credentials.token
		var email = credentials.email
		var remoteID = credentials.remoteID

		// console.log(token, email, remoteID, "credentials")
		if((token)&&(email)){

			var tokenType = token.substr(0, 2)
			// console.log(tokenType)
			if ((tokenType === "pl")&&(remoteID)){
				// console.log("login player")
				ajaxCall({email:email, token: token, remoteID: remoteID, game:GAME}, GET_CHILD, updateData)

			}else if(tokenType === "pa"){
				// console.log("call select player")
				if(response)
					checkPlayers(response)
				else {
					localStorage.setItem("token", null)
					checkLogin()
				}
			}else{
				modal.showLogin()
			}

		}
		else {
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
			ajaxCall({email:email, token: token, remoteID: remoteID, game:GAME, player:player}, UPDATE_CHILD, function () {
				console.log("playerSaved")
			})
		}else if(forceLogin){
			// console.log("You need to login to save")
			modal.showSave(loginTag)
		}

		if((typeof epicSiteMain !== "undefined") && (typeof epicSiteMain.updatePlayerInfo === "function")){
			epicSiteMain.updatePlayerInfo()
		}
	}
	
	function recoverPass(email, onSuccess, onError) {
		ajaxCall({email:email}, USER_RECOVERY, onSuccess, onError)
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
			// console.log(token)
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
