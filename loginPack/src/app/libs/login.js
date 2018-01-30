export var login = function () {
	var url = "https://14-dot-heroesofknowledge.appspot.com"

	var GAME = "play.yogome"

	var LOGIN_PARENT = "/login/parent"
	var ACCESS_CHILD = "/login/access_childs"
	var CHANGE_CHILD = "/login/change_childs"
	var UPDATE_CHILD = "/login/child/update"
	var GET_CHILD = "/login/child/get"
	var USER_RECOVERY = "/users/parent/recover"
	var CHECK_EMAIL = "/login/check"
	var REGISTER_CHILD = "/login/child"
	var LOGIN_CHILD = "/login/pin"

	var currentCallback
	var signInCallback
	var checkAgeFlag

	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	function ajaxCall(data, endPoint, onSuccess, onError, type) {
		type = type || "POST"

		$.ajax({
			contentType: 'application/json',
			data: JSON.stringify(data),
			dataType: 'json',
			type: type,
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
				localStorage.clear()
				if(onError)onError(response)
				console.log("error")
				// if(!signInCallback) modal.showLogin()
				// checkLogin()
			}
		}).fail(function(response){
			// console.log("error", response);
			localStorage.clear()
			if(onError)onError(response)
			console.log(onError)
			// if(!signInCallback) modal.showLogin()
			// modal.showLogin()
		});
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
			localStorage.setItem("age", children.age)
		}

		if ((response)&&(response.child)) {
			var child = response.child
			localStorage.setItem("remoteID", child.remoteID)
			localStorage.setItem("educationID", child.educationID)
			localStorage.setItem("name", child.name)
			localStorage.setItem("age", child.age)
			if(child.gameData) {
				localStorage.setItem("gameData", child.gameData)
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

		var age = localStorage.getItem("age")
		age = age === "null" ? null : age

		return {
			email:email,
			token:token,
			remoteID:remoteID,
			gameData:gameData,
			educationID:educationID,
			subscribed:subscribed,
			name:name,
			age:age
		}
	}

	function loginPlayer(remoteID, callback) {
		var credentials = getCredentials()
		ajaxCall({email:credentials.email, token: credentials.token, remoteID: remoteID}, ACCESS_CHILD, checkLogin)
	}

	function registerPin(data, onSuccess, onError, newAccount) {
		console.log(data)
		if(newAccount){
			ajaxCall(data, LOGIN_PARENT, onSuccess, onError, "PUT")
		}else {
			ajaxCall(data, REGISTER_CHILD, onSuccess, onError, "PUT")
		}
	}

	function loginParent(data, onSuccess, onError) {
		// console.log(data)
		// signInCallback = true

		setCredentials(data)
		if(data.token)
			ajaxCall({email: data.email, token: data.token}, LOGIN_PARENT, onSuccess, onError)
		else
			ajaxCall({email:data.email, password: data.password}, LOGIN_PARENT, onSuccess, onError)
	}

	function loginChild(nickname, pin, onSuccess, onError) {
		ajaxCall({nickname:nickname, pin:pin, game:GAME}, LOGIN_CHILD, onSuccess, onError)
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
					localStorage.removeItem("token")
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

	function updatePlayer(currentPlayer, forceLogin, loginTag, updateCallback) {
		localStorage.setItem("gameData", JSON.stringify(currentPlayer))

		var credentials = getCredentials()
		var token = credentials.token
		var email = credentials.email
		var remoteID = credentials.remoteID

		function onErrorSave() {
			modal.showSave(loginTag)
		}

		if((token)&&(email)&&(remoteID)){
			ajaxCall({email:email, token: token, remoteID: remoteID, game:GAME, player:currentPlayer}, UPDATE_CHILD, function () {
				console.log("playerSaved")
			}, onErrorSave)
		}else if(forceLogin){
			// console.log("You need to login to save")
			modal.showSave(loginTag)
		}

		if(updateCallback)
			updateCallback()
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
			loginParent({token: token, email:email}, onSuccess)
		}
		else
		if(callBack)callBack()
	}

	function checkExists(data, onSuccess, onError) {
		ajaxCall(data, CHECK_EMAIL, onSuccess, onError)
	}

	return{
		updatePlayer:updatePlayer,
		getCredentials:getCredentials,
		loginPlayer:loginPlayer,
		loginParent:loginParent,
		recoverPass:recoverPass,
		checkQuery:checkQuery,
		checkExists:checkExists,
		registerPin:registerPin,
		loginChild:loginChild,
	}
}()

/*
parent(email, pwd) return (
 */
