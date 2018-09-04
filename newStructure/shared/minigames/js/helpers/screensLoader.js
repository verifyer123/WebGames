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


function loadScripts(){
	

	if(parent.gameData){
		var tutorialLoader=parent.gameData.config.tutorial;
		var resultsLoader=parent.gameData.config.results;
	}else{
		var tutorialLoader="tutorialImagic";
		var resultsLoader="result_iMagic";
	}
	
	loadScript("../../shared/minigames/js/helpers/iMagicGames.js", function(){
		console.log("Games Loaded...");
	});
	loadScript("../../shared/minigames/js/helpers/"+tutorialLoader+".js", function(){
		console.log("Tutorial Screen Loaded...");
		language="EN";
	});

	loadScript("../../shared/minigames/js/scenes/"+resultsLoader+".js", function(){
		console.log("Result Screen Loaded...");
	});
	loadScript("../../shared/minigames/js/helpers/sceneloader.js", function(){
		console.log("sceneloader Loaded...");
		loadScript("js/main.js", function(){
			console.log("Main Loaded...");
		});
	});
}
loadScripts()