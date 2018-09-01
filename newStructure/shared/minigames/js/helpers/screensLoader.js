function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}
loadScript("../../shared/minigames/js/helpers/"+parent.gameData.config.tutorial+".js", function(){
	console.log("Tutorial Screen Loaded...");
});

loadScript("../../shared/minigames/js/scenes/"+parent.gameData.config.results+".js", function(){
	console.log("Result Screen Loaded...");
});
loadScript("../../shared/minigames/js/helpers/sceneloader.js", function(){
	console.log("sceneloader Loaded...");
	loadScript("js/main.js", function(){
		console.log("Main Loaded...");
	});
});	
