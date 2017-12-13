var modal = function () {
    return {
        showLogin:function () {
			console.log("showLogin")
			$("#myModal").load( "login.html", function () {
				$("#myModal").find("#signIn").modal('show');
			} );
		}
    }

}()