export var login = function () {
	var url = "https://14-dot-heroesofknowledge.appspot.com"

	var GAME = "play.yogome"

	var LOGIN_PARENT = "/login/parent"
	var CHANGE_CHILD = "/login/change_childs"
	var UPDATE_CHILD = "/login/child/update"
	var GET_CHILD = "/login/child/get"
	var USER_RECOVERY = "/users/parent/recover"
	var CHECK_EMAIL = "/login/check"
	var REGISTER_CHILD = "/login/child"
	var LOGIN_CHILD = "/login/pin"
	var LOGIN_UPDATE = "/login/child_update"

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
			if((response)&&((response.status === "success")||(response.status === "registered"))){
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
		if(!response)
			return

		if((response.email)&&(typeof response.email !== "undefined")){
			localStorage.setItem("email", response.email)
		}

		if((response.token)&&(typeof response.token !== "undefined")){
			localStorage.setItem("token", response.token)
		}

		if((response.remoteID)&&(typeof response.remoteID !== "undefined")){
			localStorage.setItem("remoteID", response.remoteID)
		}

		let child = response.child
		if(!child)
			return

		if ((child.parentMail)&&(typeof child.parentMail !== "undefined"))
			localStorage.setItem("email", child.parentMail)

		if ((child.remoteID)&&(typeof child.remoteID !== "undefined"))
			localStorage.setItem("remoteID", child.remoteID)

	}

	function getCredentials() {

		return {
			email: localStorage.getItem("email"),
			token: localStorage.getItem("token"),
			remoteID: localStorage.getItem("remoteID"),
			educationID: localStorage.getItem("educationID")
		}
	}

	function registerPin(data, onSuccess, onError, registerType) {
		console.log(data)
		if(registerType === "newAccount"){
			ajaxCall(data, LOGIN_PARENT, onSuccess, onError, "PUT")
		}else if(registerType === "firstLogin") {
			// data.game = GAME
			ajaxCall(data, LOGIN_UPDATE, onSuccess, onError, "PUT")
		}else{
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

	function checkLogin(onSuccess, onError){
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
				ajaxCall({email:email, token: token, remoteID: remoteID, game:GAME}, GET_CHILD, onSuccess, onError)

			}else{
				onError()
			}

		}else
			onError()
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

	function saveChild(player, onSuccess) {

		var credentials = getCredentials()
		var token = credentials.token
		var email = credentials.email
		var remoteID = credentials.remoteID

		if((token)&&(email)&&(remoteID)){
			ajaxCall({email:email, token: token, remoteID: remoteID, game:GAME, player:player}, UPDATE_CHILD, onSuccess)
		}
	}

	return{
		getCredentials:getCredentials,
		checkLogin:checkLogin,
		loginParent:loginParent,
		recoverPass:recoverPass,
		checkQuery:checkQuery,
		checkExists:checkExists,
		registerPin:registerPin,
		loginChild:loginChild,
		saveChild:saveChild
	}
}()

/*
parent(email, pwd) return (
 */
