
var language = "EN"
function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

language = getParameterByName("language")
// console.log(language, "language")
language = language || "en"
language = language.toUpperCase()


window.amazing = {
    
    config: {
        name: "Epic Map",
        language: "es",
        minigameUrl: "../epicMap/index.html?language=" + language,
        desktopUrl: "./desktop.html",
    }
}