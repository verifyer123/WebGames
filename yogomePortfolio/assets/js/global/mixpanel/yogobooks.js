$(document).ready(function () {
    /**
     * * Metodo implementado en mixpanel.js
     */
    var credentials = loginModal.getChildData();

    mixpanel.track(
        "PageLoadBooks",
        {
            "user_id": credentials.educationID,
            "app": "web"
        }
    );
});

  $(".btn-mixpanel-payments").click(function(e) {
      var buttonId = $(this).attr("id");
      var gotoPayments = "https://yogomepayments.com/" +"?distinct_id="+ distinct_id + "&ref=yogomePLAY";
      console.log(gotoPayments);
      mixpanel.track("buttonClick", {
        "Url": window.location.href.split("?")[0].split("#")[0].split("&")[0],
        "Button Id" : buttonId,
        "language" : language
     
      });
      window.location.href = gotoPayments;
     
  });