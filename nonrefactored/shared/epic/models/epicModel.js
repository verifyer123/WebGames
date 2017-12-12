var epicModel = function () {
	var url = "https://13-dot-heroesofknowledge.appspot.com"

	var player = {
		minigames:[],
		battles:[],
		cards:[],
		yogotar:null,
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

	function beginGame(response) {
		var child = response.child
		initializePlayer()
		if(child){
			player = child.gameData
		}
		epicSiteMain.checkPlayer()
	}

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
						callback(data)
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
	}

	function getCredentials() {
		var email = localStorage.getItem("email")
		email = email === "null" ? null : email

		var token = localStorage.getItem("token")
		token = token === "null" ? null : token

		var remoteID = localStorage.getItem("remoteID")
		remoteID = remoteID === "null" ? null : remoteID

		return {email:email, token:token, remoteID:remoteID}
	}
	
	function checkLogin(response){
		var credentials = getCredentials()

		var token = credentials.token
		var email = credentials.email
		var remoteID = credentials.remoteID

		if((token)&&(email)&&(remoteID)){
			localStorage.setItem("token", token)

			var tokenType = token.substr(0, 2)
			console.log(tokenType)
			if (tokenType === "pl"){
				console.log("login player")
				ajaxCall({email:email, token: token, remoteID: remoteID, game:GAME}, getChild, beginGame)
			}else if(tokenType === "pa"){
				console.log("call select player")
				ajaxCall({email:email, token: token, remoteID: remoteID}, accessChild, checkLogin)
			}

		}
		else {
			console.log("callLogin")
			var data = {
				"email": "aaron+20171207_3@yogome.com",
				"password": "explore-endless-adventure"
			}
			localStorage.setItem("email", data.email)
			ajaxCall(data, loginParent, checkLogin)
		}
	}

	function loadPlayer () {
		checkLogin()
	}

	function savePlayer(currentPlayer) {
		player = currentPlayer

		var credentials = getCredentials()
		var token = credentials.token
		var email = credentials.email
		var remoteID = credentials.remoteID

		if((token)&&(email)&&(remoteID)){
			ajaxCall({email:email, token: token, remoteID: remoteID, game:GAME, player:player}, updateChild, function () {
				console.log("playerSaved")
			})
		}else{
			console.log("You need to login to save")
		}
	}

	return{
		loadPlayer:loadPlayer,
		getPlayer:function(){return player},
		savePlayer:savePlayer
	}
}()

/*
parent(email, pwd) return (
 */
