var localization = function(){

	var DEFAULT_LANG = "EN"
	var language

	function getLanguage(){
		return language
	}

	function setLanguage(languageCode){
		if(languageCode){
			language = languageCode	
		}
	}

	function getString(localizationObject, key){
		if(localizationObject[language]){
			if(localizationObject[language][key]){
				return localizationObject[language][key]
			}
		}else if(localizationObject[DEFAULT_LANG]){
			if(localizationObject[DEFAULT_LANG][key]){
				return localizationObject[DEFAULT_LANG][key]
			}
		}
		return "N/A"
	}

	return {

		getLanguage: getLanguage,
		setLanguage: setLanguage,
		getString: getString
		
	}

}()