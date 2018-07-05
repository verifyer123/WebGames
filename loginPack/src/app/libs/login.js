import {_J} from "./joshe"

export var login = function () {
	var url = "https://login-refactorization-dot-heroesofknowledgedev.appspot.com"

	var GAME = "play.yogome"

	var REGISTER_PARENT_CHILD = "/play/parent/v1/registerParentAndChild"
	var LOGIN_PARENT = "/play/parent/v1/login"
	var CHANGE_CHILD = "/play/player/v1/getChilds"
	var EDIT_CHILD = "/play/player/v1/editChild"
	var GET_CHILD = "/play/player/v1/player"
	var USER_RECOVERY = "/users/parent/recover"
	var CHECK_EMAIL_NICKNAME = "/play/parent/v1/checkEmailOrNickname"
	var REGISTER_CHILD = "/play/parent/v1/registerChild"
	var LOGIN_CHILD = "/play/player/v1/login"
	var EDIT_LOGIN_CHILD = "/play/parent/v1/editLoginChild"

	function ajaxCall(data, endPoint, onSuccess, onError, type) {
		type = type || "POST"

		$.ajax({
			contentType: 'application/json',
			data: JSON.stringify(data),
			dataType: 'json',
			type: type,
			url: url + endPoint,
			async: true,
			joshe:true,
			processData: false,
			success: function (response) {
				setCredentials(response)
				if (onSuccess)
					onSuccess(response)

			},
			error: function (response) {
				// console.log("error", response);
				localStorage.clear()
				if (onError) onError(response)
				// if(!signInCallback) modal.showLogin()
				// modal.showLogin()
			},
		})
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
		// console.log(data)
		if(registerType === "newAccount"){
			ajaxCall(data, REGISTER_PARENT_CHILD, onSuccess, onError, "PUT")
		}else if(registerType === "firstLogin") {
			// data.game = GAME
			ajaxCall(data, EDIT_LOGIN_CHILD, onSuccess, onError, "PUT")
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
		var isChecking = checkQuery(onSuccess, onError)
		if(isChecking)
			return

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
				ajaxCall({parentMail:email, token: token, remoteID: remoteID, game:GAME}, GET_CHILD, onSuccess, onError)

			}else{
				onError()
			}

		}else
			onError()
	}

	function recoverPass(email, onSuccess, onError) {
		ajaxCall({email:email}, USER_RECOVERY, onSuccess, onError)
	}

	function checkQuery(callBack, onError){

		var token = getParameterByName("token")
		var email = getParameterByName("email")
		token = token ? decodeURIComponent(token) : null
		email = email ? decodeURIComponent(email) : null

		// var token = "pa_[B@7d5e6202"//"pa_[B@15f1b80"
		// var email = "erick@yogome.com"

		if((token)&&(email)) {

			localStorage.setItem("email", email)
			// console.log(token)
			loginParent({token: token, email:email}, callBack, onError)
			return true
		}
	}

	function checkExists(data, onSuccess, onError) {
		ajaxCall(data, CHECK_EMAIL_NICKNAME, onSuccess, onError)
	}

	function saveChild(player, onSuccess) {

		var credentials = getCredentials()
		var token = credentials.token
		var email = credentials.email
		var remoteID = credentials.remoteID

		if((token)&&(email)&&(remoteID)){
			ajaxCall({email:email, token: token, remoteID: remoteID, game:GAME, player:player}, EDIT_CHILD, onSuccess)
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

var joshe = new _J.Joshe();

/*
parent(email, pwd) return (
 */
