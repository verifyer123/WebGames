var localization = function(){

	var language = "EN"

	function getLanguage(){
		return language
	}

	function setLanguage(languageCode){
		if(languageCode){
			language = languageCode	
		}
	}

	function getString(localizationObject, key){
		if(localizationObject[language][key]){
			return localizationObject[language][key]
		}
		return "N/A"
	}

	return {

		getLanguage: getLanguage,
		setLanguage: setLanguage,
		getString: getString
		
	}

}()