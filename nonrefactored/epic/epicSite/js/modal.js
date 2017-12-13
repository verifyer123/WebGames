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
		}
    }

}()