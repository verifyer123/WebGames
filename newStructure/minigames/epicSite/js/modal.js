var modal = function () {
    var credentials = epicModel.getCredentials()

	return {
        showLogin:function () {
			mixpanel.track(
				"showLogin",
				{"user_id": credentials.educationID}
			);

			$("#myModal").load( "login.html", function () {
				$("#myModal").find("#signIn").modal('toggle');
			} );
		},
		showPlayers:function (children) {
			mixpanel.track(
				"showPlayers",
				{"user_id": credentials.educationID}
			);

        	$("#myModal").load( "players.html", function () {
        		console.log(children)
        		childrenModal.setChildren(children)
				$("#myModal").find("#players").modal('toggle');
			} );
		},
		showSave:function (tag) {
			mixpanel.track(
				"showYouNeedLoginToSave",
				{"user_id": credentials.educationID}
			);

        	$("#myModal").load( "save.html", function () {
				saveModal.setHeader(tag)
				$("#myModal").find("#save").modal('toggle');
			})
		},
		showRecover:function () {
			mixpanel.track(
				"showPasswordRecovery",
				{"user_id": credentials.educationID}
			);

        	$("#myModal").load( "passRecover.html", function () {
				$("#myModal").find("#recover").modal('toggle');
			})
		},
		showWelcome:function () {
			mixpanel.track(
				"showWelcome",
				{"user_id": credentials.educationID}
			);

        	$("#myModal").load( "welcome.html", function () {
				$("#myModal").find("#welcome").modal('toggle');
			})
		},
		showYouKnow:function() {
			mixpanel.track(
				"showYouKnowScreen",
				{"user_id": credentials.educationID}
			);

        	$("#myModal").load( "didYouKnow.html", function () {
				$("#myModal").find("#know").modal('toggle');
			})
		}
    }

}()