var modal = function () {
    return {
        showLogin:function () {
			console.log("showLogin")
			$("#myModal").load( "login.html", function () {
				$("#myModal").find("#signIn").modal('toggle');
			} );
		},
		showPlayers:function (children) {
        	// console.log(children)
        	$("#myModal").load( "players.html", function () {
        		console.log(children)
        		childrenModal.setChildren(children)
				$("#myModal").find("#players").modal('toggle');
			} );
		},
		showSave:function (tag) {
			$("#myModal").load( "save.html", function () {
				saveModal.setHeader(tag)
				$("#myModal").find("#save").modal('toggle');
			})
		},
		showRecover:function () {
			$("#myModal").load( "passRecover.html", function () {
				$("#myModal").find("#recover").modal('toggle');
			})
		},
		showWelcome:function () {
			$("#myModal").load( "welcome.html", function () {
				$("#myModal").find("#welcome").modal('toggle');
			})
		},
		showYouKnow:function() {
			$("#myModal").load( "didYouKnow.html", function () {
				$("#myModal").find("#know").modal('toggle');
			})
		}
    }

}()