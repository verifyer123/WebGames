
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


window.amazing = {
    
    config: {
        name: "Epic Map",
        language: "es",
        minigameUrl: "../epicMap/index.html?language=" + language,
        desktopUrl: "./desktop.html",
    }
}