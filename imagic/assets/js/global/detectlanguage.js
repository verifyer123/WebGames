    //AQUI VA PARA SABER EL LENGUAGE
        function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

        var language;
        language = getParameterByName("language");
        if(language == null ){
            var ln = x=window.navigator.language||navigator.browserLanguage;

                if(ln.substring(0,2).toUpperCase() == 'ES'){
                    language= "ES";
                }else{
                    language= "EN";
                }
        }else{
            language.toUpperCase();
        }

