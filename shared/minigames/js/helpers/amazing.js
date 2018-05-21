var amazing = {}
var couponData
var dataStore
var minigameId
var userMail, gender, birthday, interests, userName
var origin
var gameFromApp

//var domain = "https://3-dot-amazingyogome.appspot.com/"

amazing.saveScore = function(score){
	console.log("Saving Score win...")
	var params = {
		type: "score",
		data: {
			score: score,
		}
    }
    console.log("score to amazing => ", score);
	parent.postMessage(JSON.stringify(params), "*")
}

amazing.winCoupon = function(couponId){

    var params = {
        type: "winCoupon",
        id: couponId,
    }
    parent.postMessage(JSON.stringify(params), "*")
}

amazing.savePlaycount = function(){
	console.log("Playcount...")
	var params = {
		type: "playcount"
	}
    parent.postMessage(JSON.stringify(params), "*")

    gameFromApp = false

    /*window.addEventListener("message", function(event){
    //console.log("profile",event)

        if(event.data && event.data != ""){
            var parsedData = {}
            try {
                var parsedData = JSON.parse(event.data)
                 //origin = event.origin
            }catch(e){
                console.warn("Data is not JSON in message listener")
            }
            switch(parsedData.type){
            case "app":
                gameFromApp = true
                console.log("Game come from app")
            }
        }
    })*/

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

amazing.checkBrowser = function(game){
	//console.log("check browser")
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    if ((ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) && game.device.iPhone){

		game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE
		game.scale.setUserScale(document.body.clientWidth/game.scale.width,document.body.clientHeight/game.scale.height * 0.9)
		//console.log((document.body.clientWidth/game.scale.width) + 'width'(document.body.clientHeight/game.scale.height) + ' height')
	}

}

amazing.getGames = function(){
	var games = [
        {name:'Zombie\n Crush',iconName:'zombie',url:'http://amazingapp.mx/juegos/zombiecrush/',coupon : false,mixName:'zombiecrush',demo:false,id:5769015641243648},
        {name:'Cirquit',iconName:'cirquit',url:'http://amazingapp.mx/juegos/cirquit/',coupon : false,mixName:'cirquit',demo:false,id:5739719937753088},
        //{name:'Clown Rush',iconName:'clown',url:'http://amazingapp.mx/juegos/clownrush/',coupon : false,mixName:'clownrush',demo:false,id:5649050225344512},
        {name:'Gravity\n Switch',iconName:'gravity',url:'http://amazingapp.mx/juegos/graviswitch/',coupon : false,mixName:'graviswitch',demo:false,id:5752754626625536},
        {name:'Hexhop',iconName:'hexhop',url:'http://amazingapp.mx/juegos/hexhop/',coupon : false,mixName:'hexhop',demo:false,id:5153049148391424},
        //{name:'Memorama\n del Sabor',iconName:'memorama',url:'http://amazingapp.mx/juegos/memorama/',coupon : false,mixName:'memorama',demo:false,id:5667908084563968},
        {name:'Jump Ward',iconName:'jump',url:'http://amazingapp.mx/juegos/jumpward/',coupon : false,mixName:'jumpward',demo:false,id:5647648723828736},
        {name:'Jungle Fury',iconName:'jungle',url:'http://amazingapp.mx/juegos/junglefury/',coupon : false,mixName:'junglefury',demo:false,id:5644406560391168},
        {name:'Lluvia de\n Snacks',iconName:'lluvia',url:'http://amazingapp.mx/juegos/chilimbalam/',coupon : false,mixName:'chilimbalam',demo:false,id:5676073085829120},
        //{name:'Store Panic',iconName:'panic',url:'http://amazingapp.mx/juegos/storepanic/',coupon : false,mixName:'storepanic',demo:false,id:5709436928655360},
        {name:'Tapatopo',iconName:'tapa',url:'http://amazingapp.mx/juegos/tapatopo/',coupon : false,mixName:'tapatopo',demo:false,id:5664248772427776},
        {name:'Twin Dots',iconName:'twin',url:'http://amazingapp.mx/juegos/twindots/',coupon : false,mixName:'twindots',demo:false,id:5750790484393984},
        {name:'Neon Edge',iconName:'neon',url:'http://amazingapp.mx/juegos/neonedge/',coupon : false,mixName:'neonedge',demo:false,id:5742796208078848},
        //{name:'Cube Jump',iconName:'cube',url:'http://amazingapp.mx/juegos/cubejump/',coupon : false,mixName:'cubejump',demo:false,id:5674368789118976},
        {name:'Nutribaby',iconName:'nutribaby',url:'http://amazingapp.mx/juegos/nutribaby/',coupon : false,mixName:'nutribaby',demo:false,id:5648334039547904},//15
		{name:'Net Shoes',iconName:'net',url:'http://amazingapp.mx/juegos/netshoes/',coupon : false,mixName:'netshoes',demo:false,id:5634101323235328},//16
        {name:'Coffee Rush',iconName:'coffeerush',url:'http://amazingapp.mx/juegos/coffeerush/',coupon : false,mixName:'coffeerush',demo:false,id:5662438108168192},//17
        {name:'2+2',iconName:'2+2',url:'http://amazingapp.mx/juegos/game2Plus2/',coupon : false,mixName:'2+2',demo:false,id:6293705958883328},//18
        {name:'Rafaga de\n Tamales',iconName:'rafaga_de_tamales',url:'http://amazingapp.mx/juegos/rafaga_de_tamales/',coupon : false,mixName:'rafaga_de_tamales',demo:false,id:5679382827892736},//19
        {name:'Ski Zag',iconName:'skiZag',url:'http://amazingapp.mx/juegos/skiZag/',coupon : false,mixName:'skiZag',demo:false,id:5766289444306944},//20
        {name:'Vips',iconName:'vips',url:'http://amazingapp.mx/juegos/vips/',coupon : false,mixName:'vips',demo:false,id:5303856053354496},//21
        {name:'Chak Block',iconName:'chakBlock',url:'http://amazingapp.mx/juegos/chakBlock/',coupon : false,mixName:'chakBlock',demo:false,id:5642980933238784},//22
        {name:'Choco Pile',iconName:'chocoPile',url:'http://amazingapp.mx/juegos/chocoPile/',coupon : false,mixName:'chocoPile',demo:true,id:5676219550924800},//23
        {name:'Volaris',iconName:'volaris',url:'http://amazingapp.mx/juegos/volaris/',coupon : false,mixName:'volaris',demo:true,id:100001},//24
        {name:'Chedraui',iconName:'chedraui',url:'http://amazingapp.mx/juegos/chedraui/',coupon : false,mixName:'chedraui',demo:true,id:100002},//25
        {name:'Orders Up',iconName:'ordersUp',url:'http://amazingapp.mx/juegos/ordersUp/',coupon : false,mixName:'ordersUp',demo:true,id:100003},//26
        {name:'Zoe Mundial',iconName:'zoeMundial',url:'http://amazingapp.mx/juegos/zoeMundial/',coupon : false,mixName:'zoeMundial',demo:true,id:100004},//27
        //
    ]

    return games
}


amazing.getId = function(id){
    var games = amazing.getGames()
    var gameIndex 
    for(var i = 0; i < games.length; i++ ){
        
        if(id == games[i].id){
            gameIndex = i
            break
        }
    }
    return gameIndex 
}

amazing.getInfo = function(){
    //this.setApp()
    window.addEventListener("message", function(event){

        if(event.data && event.data != ""){
            var parsedData = {}
            try {
                var parsedData = JSON.parse(event.data)

            }catch(e){
                console.warn("Data is not JSON in message listener")
            }
            switch(parsedData.type){
            case "couponMinigame":
                //origin = event.origin
                couponData = parsedData.coupon

            }
            //console.log('entra case')
        }
    })

}

amazing.setProfile = function(){

    window.addEventListener("message", function(event){
        //console.log("profile",event)

        if(event.data && event.data != ""){
            var parsedData = {}
            try {
                var parsedData = JSON.parse(event.data)
                 //origin = event.origin
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
                //origin = event.origin
            }catch(e){
                console.warn("Data is not JSON in message listener")
            }
            switch(parsedData.type){
            case "minigameId":
                minigameId = parsedData.minigameId
                userMail = parsedData.userProfile.email
				gender = parsedData.userProfile.gender
				birthday = parsedData.userProfile.birthday
                interests = parsedData.userProfile.interests
                userName = parsedData.userProfile.name
                //origin = event.origin
                gameFromApp = true
                console.log("Get minigameId")
				if(userMail){

					console.log('email sent')
					mixpanel.identify(userMail)
				}
            }
            //console.log('entra case')
        }
    })

}


amazing.setApp = function(){
    fromApp = false
    window.addEventListener("message", function(event){
        //console.log(event)

        if(event.data && event.data != ""){
            var parsedData = {}
            try {
                var parsedData = JSON.parse(event.data)
                //origin = event.origin
            }catch(e){
                console.warn("Data is not JSON in message listener")
            }
            switch(parsedData.type){
            case "app":
                fromApp = true
            }
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

amazing.getEmail = function(){
	return userMail
}

amazing.getBirthday = function(){
	return birthday
}

amazing.getGender = function(){
	return gender
}

amazing.getFromApp = function(){
    return gameFromApp
}

amazing.setMixPanelTrack= function(minigameName,event){
    mixpanel.track(
        event,
        {"gameName": minigameName,"name":userName,"email":userMail,"gender":gender,"birthday":birthday,"interests":interests}
    );

    console.log("Enter to setMixPanelTrack")

    var params = {
       type: "analyticsMessage",
       data: {
           event: event,
           gameName: minigameName
       }
   }
    parent.postMessage(JSON.stringify(params), "*")
}

//amazing.setApp()