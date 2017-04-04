var amazing = {}
var couponData
var dataStore
var minigameId

amazing.saveScore = function(score){
	console.log("Saving Score...")
	var params = {
		type: "score",
		data: {
			score: score,
		}
	}
	parent.postMessage(JSON.stringify(params), "*")
}

amazing.savePlaycount = function(){
	console.log("Saving Score...")
	var params = {
		type: "playcount"
	}
	parent.postMessage(JSON.stringify(params), "*")
}

amazing.share = function(score, game){
	console.log("Sharing...")
	var params = {
		type: "share",
		score: score,
		game: game,
	}
	parent.postMessage(JSON.stringify(params), "*")
}

amazing.getGames = function(){
	var games = [
        
        {name:'Amazing Bros',iconName:'bros',url:'http://amazingapp.co/juegos/amazingbros/',coupon: true,mixName:'amazingbros', id:5654313976201216},
        {name:'Zombie\n Crush',iconName:'zombie',url:'http://amazingapp.co/juegos/zombiecrush/',coupon : false,mixName:'zombiecrush',id:5769015641243648},
        {name:'Cirquit',iconName:'cirquit',url:'http://amazingapp.co/juegos/cirquit/',coupon : false,mixName:'cirquit',id:5739719937753088},
        {name:'Clown Rush',iconName:'clown',url:'http://amazingapp.co/juegos/clownrush/',coupon : false,mixName:'clownrush',id:5649050225344512},
        {name:'Gravity\n Switch',iconName:'gravity',url:'http://amazingapp.co/juegos/graviswitch/',coupon : false,mixName:'graviswitch',id:5752754626625536},
        {name:'Hexhop',iconName:'hexhop',url:'http://amazingapp.co/juegos/hexhop/',coupon : false,mixName:'hexhop',id:5153049148391424},
        {name:'Memorama\n del Sabor',iconName:'memorama',url:'http://amazingapp.co/juegos/memorama/',coupon : false,mixName:'memorama',id:5667908084563968},
        {name:'Jump Ward',iconName:'jump',url:'http://amazingapp.co/juegos/jumpward/',coupon : false,mixName:'jumpward',id:5647648723828736},
        {name:'Jungle Fury',iconName:'jungle',url:'http://amazingapp.co/juegos/junglefury/',coupon : false,mixName:'junglefury',id:5644406560391168},
        {name:'Lluvia de\n Snacks',iconName:'lluvia',url:'http://amazingapp.co/juegos/chilimbalam/',coupon : false,mixName:'chilimbalam',id:5676073085829120},
        {name:'Store Panic',iconName:'panic',url:'http://amazingapp.co/juegos/storepanic/',coupon : false,mixName:'storepanic',id:5709436928655360},
        {name:'Tapatopo',iconName:'tapa',url:'http://amazingapp.co/juegos/tapatopo/',coupon : false,mixName:'tapatopo',id:5664248772427776},
        {name:'Twin Dots',iconName:'twin',url:'http://amazingapp.co/juegos/twindots/',coupon : false,mixName:'twindots',id:5750790484393984},
        {name:'Neon Edge',iconName:'neon',url:'http://amazingapp.co/juegos/neonedge/',coupon : false,mixName:'neonedge',id:5742796208078848},
        {name:'Cube Jump',iconName:'cube',url:'http://amazingapp.co/juegos/cubejump/',coupon : false,mixName:'cubejump',id:5674368789118976},
        //{name:'Nutribaby',iconName:'nutribaby',url:'http://amazingapp.co/juegos/nutribaby/',coupon : false,mixName:'nutribaby',id:5674368789118976},
        
    ]
    
    return games
}

amazing.getInfo = function(){
    
    window.addEventListener("message", function(event){
        //console.log(event)
        
        if(event.data && event.data != ""){
            var parsedData = {}
            try {
                var parsedData = JSON.parse(event.data)
            }catch(e){
                console.warn("Data is not JSON in message listener")
            }
            switch(parsedData.type){
            case "couponMinigame":
                couponData = parsedData.coupon
                
            }
            //console.log('entra case')
        }
    })
        
}

amazing.setProfile = function(){
    
    window.addEventListener("message", function(event){
        //console.log(event)
        
        if(event.data && event.data != ""){
            var parsedData = {}
            try {
                var parsedData = JSON.parse(event.data)
            }catch(e){
                console.warn("Data is not JSON in message listener")
            }
            switch(parsedData.type){
            case "dataStore":
                dataStore = parsedData.dataStore
                
            }
            //console.log('entra case')
        }
    })
        
}

amazing.setMinigameId = function(){
    
    window.addEventListener("message", function(event){
        //console.log(event)
        
        if(event.data && event.data != ""){
            var parsedData = {}
            try {
                var parsedData = JSON.parse(event.data)
            }catch(e){
                console.warn("Data is not JSON in message listener")
            }
            switch(parsedData.type){
            case "minigameId":
                minigameId = parsedData.minigameId
                
            }
            //console.log('entra case')
        }
    })
        
}

amazing.sendGameId = function(gameId){
   console.log("Sending GameId...")
   var params = {
       type: "gameId",
       data: {
           gameId: gameId,
       }
   }
   parent.postMessage(JSON.stringify(params), "*")
}

amazing.getScores = function(dataId, onSuccess, onError ){
    
    var hasData = (data.score >= 0) && (data.minigameId) && (data.authentication) && (data.email)
    if(hasData){
        $.post({
            url: amazing.DOMAIN+"/users/score", 
            crossDomain: true,
            data: JSON.stringify(data),
            success: function(data) {
                console.log(data)
                if(onSuccess && typeof(onSuccess) == "function"){
                    onSuccess(data)
                }
            },
            error: function(e) {
                console.log(e)
                if(onSuccess && typeof(onSuccess) == "function"){
                    onSuccess(data)
                }
            }
        });
    }
}

amazing.getProfile = function(){
    return dataStore
}

amazing.getCoupon = function(){
    return couponData
}

amazing.getMinigameId = function(){
    return minigameId
}
