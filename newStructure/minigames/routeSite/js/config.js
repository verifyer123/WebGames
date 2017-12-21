
var language = "EN"
if(parent.window.location.search){
    var params = parent.window.location.search.trim(1)
    var regex = /language=(..)/i
    var result = regex.exec(params)
    if(result){
        language = result[result.index].toUpperCase()    
    }else{
        language = "EN"
    }

}

var meta=document.getElementsByTagName("meta");
if(language == "EN"){
    meta[7].content = "Get the animals to their correct house!";
}


window.amazing = {
    
    config: {
        name: "animalRoute",
        language: "es",
        minigameUrl: "../animalRoute/index.html?language=" + language,
        desktopUrl: "./desktop.html",
    }
}