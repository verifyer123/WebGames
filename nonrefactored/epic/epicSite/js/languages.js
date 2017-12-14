var languageArrayIndex = [
                { 
                    id:0,
                    NAME:"mainMenu0",
                    ES:"Episodios",
                    EN:"Webisodes",
                    PT:"Episódios",
                    ZH:"网络视频短片",
                    JA:"ウェブエピソード",
                    KO:"웹피소드"
                },
                
        
        
        
        
        ]
        
        
function changeLanguage(){
    for(i=0;i<=languageArrayIndex.length-1;i++){
        if(language == "ES"){
            $(".text" + i).text(languageArrayIndex[i][language])
        }else if(language == "EN"){
            $(".text" + i).text(languageArrayIndex[i][language])    
        }else if(language == "PT"){
            $(".text" + i).text(languageArrayIndex[i][language])    
        }else if(language == "ZH"){
            $(".text" + i).text(languageArrayIndex[i][language])    
        }else if(language == "JA"){
            $(".text" + i).text(languageArrayIndex[i][language])    
        }else if(language == "KO"){
            $(".text" + i).text(languageArrayIndex[i][language])    
        }else{
            $(".text" + i).text(languageArrayIndex[i].EN)    
        }
    }   
}

changeLanguage()