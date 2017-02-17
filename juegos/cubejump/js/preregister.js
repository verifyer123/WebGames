$(document).ready(function(){
var expr = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
$("#enviar").click(function (e) {
        e.preventDefault();
        var correo = $("#email").val();
        if (correo == "" || !expr.test(correo)){
            $("#noMail").removeClass("hidden");
            return false;
        }else{
            e.preventDefault();
            var metaTags=document.getElementsByTagName("meta");
            var gamePlayed = "";
            for (var i = 0; i < metaTags.length; i++) {
                if (metaTags[i].getAttribute("property") == "og:title") {
                    gamePlayed = metaTags[i].getAttribute("content");
                    break;
                }
            };
            mixpanel.reset();
            mixpanel.identify($("#email").val());
            mixpanel.alias($("#email").val());
            mixpanel.track('Submitted Form');
            mixpanel.people.set({
                "$name": $("#email").val(),
                "$source": gamePlayed,
                "$email":  $("#email").val()
            });
            $(".form-container").fadeOut(500 ,function(){
              $(".nothanks").fadeOut(500);
              $(".noMail").fadeOut(500);
              $("#gracias").fadeIn(500, function() {
                   $("#gracias").removeClass("hidden");
              });
            });
            return false;
        }
      });
});
