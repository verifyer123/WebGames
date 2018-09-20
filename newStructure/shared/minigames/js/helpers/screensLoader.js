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
		var preloader=parent.gameData.config.platform;

	}else{
		var tutorialLoader="tutorialImagic";
		var resultsLoader="result_iMagic";
		var preloader="imagic";
	}

	loadScript("../../shared/minigames/js/scenes/preloaders/"+preloader+".js", function(){
		loadScript("../../shared/minigames/js/helpers/comunicationScript.js", function(){
			loadScript("../../shared/minigames/js/helpers/"+tutorialLoader+".js", function(){
				language="EN";
				loadScript("../../shared/minigames/js/scenes/"+resultsLoader+".js", function(){
					loadScript("../../shared/minigames/js/helpers/sceneloader.js", function(){
						loadScript("js/main.js", function(){
						});
					});
				});
			});
		});
	});
}

loadScripts()



