
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
    meta[7].content = "Get the correct coins!";
}


window.amazing = {
    
    config: {
        name: "Rift Land",
        language: "es",
        minigameUrl: "../riftLand/index.html?language=" + language,
        desktopUrl: "./desktop.html",
    }
}