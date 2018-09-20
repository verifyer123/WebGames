var amazing = {}
var couponData
var dataStore
var minigameId
var userMail, gender, birthday, interests, userName
var origin
var gameFromApp
var webCoupon
var poll

var isDebug = false
var playcountToken = null
var urlShare

var url
var currentTime
var inGame = false

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
    /*var hrefData = localStorage.getItem("minigameLink")
    if(hrefData!=null){
        //window.history.replaceState(null, null, hrefData);
        //history.pushState(null, null, hrefData);
        //location.pathname = hrefData
    }*/

    console.log("Playcount...")
    var params = {
        type: "playcount"
    }
    gameFromApp = false

    parent.postMessage(JSON.stringify(params), "*")

    


    webCoupon = ""
    var urlDev = "http://staging.getin.mx:8090/Amazing-backend-2.0.0"
    var urlProd = "http://api.getin.mx:8090/Amazing-backend-2.0.0"

    if(isDebug){
        url = urlDev
    }
    else{
        url = urlProd
    }


}

amazing.share = function(score, game){
    console.log("Sharing...")
    if(gameFromApp){
	    var params = {
	        type: "share",
	        score: score,
	        game: game,
	    }
	    parent.postMessage(JSON.stringify(params), "*")
	}
	else{
		console.log("share, ",urlShare)

		FB.ui({
			method: 'share',
			href: urlShare,
			mobile_iframe:true
		}, function(response){});
	}
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
        {name:'Zombie\n Crush',iconName:'zombie',url:'http://amazingapp.mx/juegos/zombiecrush/',coupon : false,mixName:'zombiecrush',sceneName:'zombiecrush',demo:false,id:5769015641243648},
        {name:'Cirquit',iconName:'cirquit',url:'http://amazingapp.mx/juegos/cirquit/',coupon : false,mixName:'cirquit',sceneName:'cirquit',demo:false,id:5739719937753088},
        //{name:'Clown Rush',iconName:'clown',url:'http://amazingapp.mx/juegos/clownrush/',coupon : false,mixName:'clownrush',demo:false,id:5649050225344512},
        {name:'Gravity\n Switch',iconName:'gravity',url:'http://amazingapp.mx/juegos/graviswitch/',coupon : false,mixName:'graviswitch',sceneName:'graviswitch',demo:false,id:5752754626625536},
        {name:'Hexhop',iconName:'hexhop',url:'http://amazingapp.mx/juegos/hexhop/',coupon : false,mixName:'hexhop',sceneName:'hexhop',demo:false,id:5153049148391424},
        //{name:'Memorama\n del Sabor',iconName:'memorama',url:'http://amazingapp.mx/juegos/memorama/',coupon : false,mixName:'memorama',demo:false,id:5667908084563968},
        {name:'Jump Ward',iconName:'jump',url:'http://amazingapp.mx/juegos/jumpward/',coupon : false,mixName:'jumpward',sceneName:'jumpward',demo:false,id:5647648723828736},
        {name:'Jungle Fury',iconName:'jungle',url:'http://amazingapp.mx/juegos/junglefury/',coupon : false,mixName:'junglefury',sceneName:'junglefury',demo:false,id:5644406560391168},
        {name:'Lluvia de\n Snacks',iconName:'lluvia',url:'http://amazingapp.mx/juegos/chilimbalam/',coupon : false,mixName:'chilimbalam',sceneName:'chilimbalam',demo:false,id:5676073085829120},
        {name:'Store Panic',iconName:'panic',url:'http://amazingapp.mx/juegos/storepanic/',coupon : false,mixName:'storepanic',sceneName:'storepanic',demo:false,id:5709436928655360},
        {name:'Tapatopo',iconName:'tapa',url:'http://amazingapp.mx/juegos/tapatopo/',coupon : false,mixName:'tapatopo',sceneName:'tapatopo',demo:false,id:5664248772427776},
        {name:'Twin Dots',iconName:'twin',url:'http://amazingapp.mx/juegos/twindots/',coupon : false,mixName:'twindots',sceneName:'twindots',demo:false,id:5750790484393984},
        {name:'Neon Edge',iconName:'neon',url:'http://amazingapp.mx/juegos/neonedge/',coupon : false,mixName:'neonedge',sceneName:'neonedge',demo:false,id:5742796208078848},
        //{name:'Cube Jump',iconName:'cube',url:'http://amazingapp.mx/juegos/cubejump/',coupon : false,mixName:'cubejump',demo:false,id:5674368789118976},
        {name:'Nutribaby',iconName:'nutribaby',url:'http://amazingapp.mx/juegos/nutribaby/',coupon : false,mixName:'nutribaby',sceneName:'nutribaby',demo:false,id:5648334039547904},//15
        {name:'Net Shoes',iconName:'net',url:'http://amazingapp.mx/juegos/netshoes/',coupon : false,mixName:'netshoes',sceneName:'netshoes',demo:false,id:5634101323235328},//16
        {name:'Coffee Rush',iconName:'coffeerush',url:'http://amazingapp.mx/juegos/coffeerush/',coupon : false,mixName:'coffeerush',sceneName:'coffeerush',demo:false,id:5662438108168192},//17
        {name:'2+2',iconName:'2+2',url:'http://amazingapp.mx/juegos/game2Plus2/',coupon : false,mixName:'2+2',sceneName:'2+2',demo:false,id:6293705958883328},//18
        {name:'Rafaga de\n Tamales',iconName:'rafaga_de_tamales',url:'http://amazingapp.mx/juegos/rafaga_de_tamales/',coupon : false,mixName:'rafaga_de_tamales',sceneName:'rafaga_de_tamales',demo:true,id:5679382827892736},//19
        {name:'Ski Zag',iconName:'skiZag',url:'http://amazingapp.mx/juegos/skiZag/',coupon : false,mixName:'skiZag',sceneName:'skiZag',demo:false,id:5766289444306944},//20
        {name:'Shakes',iconName:'shakes',url:'http://amazingapp.mx/juegos/shakes/',coupon : false,mixName:'shakes',sceneName:'shakes',demo:true,id:5303856053354496},//21
        {name:'Chak Block',iconName:'chakBlock',url:'http://amazingapp.mx/juegos/chakBlock/',coupon : false,mixName:'chakBlock',sceneName:'chakBlock',demo:false,id:5642980933238784},//22
        {name:'Choco Pile',iconName:'chocoPile',url:'http://amazingapp.mx/juegos/chocoPile/',coupon : false,mixName:'chocoPile',sceneName:'chocoPile',demo:true,id:5676219550924800},//23
        {name:'Volaris',iconName:'volaris',url:'http://amazingapp.mx/juegos/volaris/',coupon : false,mixName:'volaris',sceneName:'volaris',demo:true,id:100001},//24
        {name:'Chedraui',iconName:'chedraui',url:'http://amazingapp.mx/juegos/chedraui/',coupon : false,mixName:'chedraui',sceneName:'chedraui',demo:true,id:100002},//25
        {name:'Orders Up',iconName:'ordersUp',url:'http://amazingapp.mx/juegos/ordersUp/',coupon : false,mixName:'ordersUp',sceneName:'ordersUp',demo:true,id:100003},//26
        {name:'Zoé Water Sport',iconName:'zoeMundial',url:'http://amazingapp.mx/juegos/zoeMundial/',coupon : false,mixName:'zoeMundial',sceneName:'zoeMundial',demo:false,id:21},//27
        {name:'Benedettis',iconName:'benedettis',url:'http://amazingapp.mx/juegos/benedettis/',coupon : false,mixName:'benedettis',sceneName:'benedettis',demo:true,id:100005},//28
        {name:'Pin Dots',iconName:'pinDots',url:'http://amazingapp.mx/juegos/pinDots/',coupon : false,mixName:'pinDots',sceneName:'pinDots',demo:false,id:31},//29
        {name:'Wonder Hood',iconName:'wonderHood',url:'http://amazingapp.mx/juegos/wonderHood/',coupon : false,mixName:'wonderHood',sceneName:'wonderHood',demo:false,id:1},//30
        {name:'Torre Helado\n Obscuro',iconName:'heladoObscuro',url:'http://amazingapp.mx/juegos/heladoObscuro/',coupon : false,mixName:'heladoObscuro',sceneName:'heladoObscuro',demo:false,id:22},//31
        {name:'Zoé Kids',iconName:'zoe',url:'http://amazingapp.mx/juegos/zoe/',coupon : false,mixName:'zoeKids',sceneName:'zoeKids',demo:false,id:51},//32
        {name:'BB Mundo',iconName:'bbMundo',url:'http://amazingapp.mx/juegos/bbMundo/',coupon : false,mixName:'bebeMundo',sceneName:'bbMundo',demo:true,id:100010},//33
        {name:'Amazing Bros',iconName:'amazingbros',url:'http://amazingapp.mx/juegos/amazingbros/',coupon : false,mixName:'amazingbros',sceneName:'amazingbros',demo:true,id:100011},//34
        {name:'Megaconstrux',iconName:'megablockTower',url:'http://amazingapp.mx/juegos/megablockTower/',coupon : false,mixName:'megablockTower',sceneName:'megablockTower',demo:true,id:100012},//35
        {name:'Snake vs Block',iconName:'snakeVsBlock',url:'http://amazingapp.mx/juegos/snakeVsBlock/',coupon : false,mixName:'snakeVsBlock',sceneName:'snakeVsBlock',demo:false,id:61},//36
        {name:'Snoopy En Busca Del Sabor',iconName:'snoopyEnBuscaDelSabor',url:'http://amazingapp.mx/juegos/snoopyEnBuscaDelSabor/',coupon : false,mixName:'snoopyEnBuscaDelSabor',sceneName:'snoopyEnBuscaDelSabor',demo:true,id:100014},//37
        {name:'Burger Crush',iconName:'burguerCrush',url:'http://amazingapp.mx/juegos/burgerCrush/',coupon : false,mixName:'burgercrush',sceneName:'burguerCrush',demo:false,id:71},//38
        {name:'Club Puebla',iconName:'puebla',url:'http://amazingapp.mx/juegos/clubPuebla/',coupon : false,mixName:'clubPuebla',sceneName:'puebla',demo:true,id:100016},//39
        {name:'Cirquit Netshoes',iconName:'cirquitNetshoes',url:'http://amazingapp.mx/juegos/cirquitNetshoes/',coupon : false,mixName:'cirquitNetshoes',sceneName:'cirquit',demo:false,id:1000017},//40
        {name:'Tap Taco',iconName:'tapTaco',url:'http://amazingapp.mx/juegos/tapTaco/',coupon : false,mixName:'tapTaco',sceneName:'tapTaco',demo:false,id:81},//40
        {name:'Speed Up',iconName:'speedUp',url:'http://amazingapp.mx/juegos/speedUp/',coupon : false,mixName:'speedUp',sceneName:'speedUp',demo:true,id:1000019},//41
        {name:'Reinserta',iconName:'reinserta',url:'http://amazingapp.mx/juegos/reinserta/',coupon : false,mixName:'reinserta',sceneName:'reinserta',demo:true,id:1000020},//42
        {name:'Viva la Traja',iconName:'vivaLaTraja',url:'http://amazingapp.mx/juegos/vivaLaTraja/',coupon : false,mixName:'vivalaTraja',sceneName:'vivaLaTraja',demo:false,id:91},//43
        {name:'Dot Blocks',iconName:'dotBlocks',url:'http://amazingapp.mx/juegos/dotBlocks/',coupon : false,mixName:'dotBlocks',sceneName:'dotBlocks',demo:false,id:1000022},//44
        {name:'B-Pong',iconName:'bPong',url:'http://amazingapp.mx/juegos/bPong/',coupon : false,mixName:'bPong',sceneName:'bPong',demo:true,id:1000023},//45
        //
    ]

    return games
}

amazing.startTimer = function(_time){
    inGame = true
    currentTime = _time

    var params = {
        type: "startTimer"
    }
    
    parent.postMessage(JSON.stringify(params), "*")

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
            case "backEvent":
                var games = amazing.getGames()
                var name
                for(var i = 0; i < games.length; i++ ){
                    
                    if(minigameId == games[i].id){
                        name = games[i].mixName
                        break
                    }
                }
                amazing.endTimer(game.time.now,name)
            }
        }
    })
}

amazing.endTimer = function(_time,minigameName){
	console.log("endTimer")
    if(!inGame){
        return
    }
    inGame = false
    currentTime = (_time - currentTime)/1000

    mixpanel.track(
        "gameTime",
        {"gameName": minigameName,"gameTime":currentTime,"name":userName,"email":userMail,"gender":gender,"birthday":birthday,"interests":interests}
    );
}

amazing.getId = function(id){

    var games = amazing.getGames()
    var gameIndex 
    for(var i = 0; i < games.length; i++ ){
        
        if(id == games[i].id){
            gameIndex = i
            urlShare = games[i].url
            break
        }
    }
    minigameId = id
    playcountToken = localStorage.getItem("playcountToken")

    if(!gameFromApp){

    	window.fbAsyncInit = function() {
		  	console.log("init facebbook")
		    FB.init({
		      appId            : '933967913375897',
		      autoLogAppEvents : true,
		      xfbml            : true,
		      version          : 'v3.0'
		    });
		  };

        var data = {
            minigameId:id
        }
        $.ajax({
            type: "POST",
            url: url+"/services/minigame/hascoupons",
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: "json",

            success: function (response) {
                console.log(response)
                if(response.imgPreview!=null && response.imgPreview!=""){
                    webCoupon = response.imgPreview
                }
                else{
                    webCoupon = ""
                }

            },
            error: function(response){
            	console.log(response)
            }

        });
    }

    amazing.startTimer(game.time.now)
    return gameIndex 
}

amazing.haveWebCoupon = function(){
    return webCoupon
}

amazing.getServerUrl = function(){
    return url
}

amazing.goTickets = function(){

    var params = {
        type: "goTickets",
    }
    parent.postMessage(JSON.stringify(params), "*")

    console.log("GoToTickets")
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
            }catch(e){
                console.warn("Data is not JSON in message listener")
            }
            switch(parsedData.type){
            case "dataStore":
                dataStore = parsedData
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
                webCoupon = ""
                //console.log("Get minigameId")
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
    //console.log("0Data ")
    //if(gameFromApp){
        var userData = dataStore

        if(userData!=null){
            //userData = JSON.parse(userData)
            //console.log("2Data ",userData.allProducts)
            if(userData.allProducts){
                var allProducts = JSON.parse(userData.allProducts)
                //console.log("3Data ",allProducts)

                if(allProducts.glasses == null){
                    allProducts = userData.allProducts
                }

                var skinTable = [1,1,1,1,1]

                for(var index1 = 1; index1<allProducts.glasses.length;index1++){
                    if(allProducts.glasses[index1-1].select){
                        skinTable[0] = index1;
                    }
                }
                for(var index2 = 1; index2<=allProducts.hairs.length;index2++){
                    if(allProducts.hairs[index2-1].select){
                        skinTable[1] = index2;
                    }
                }
                for(var index3 = 1; index3<=allProducts.colors.length;index3++){
                    if(allProducts.colors[index3-1].select){
                        skinTable[2] = index3;
                    }
                }
                for(var index4 = 1; index4<=allProducts.shorts.length;index4++){
                    if(allProducts.shorts[index4-1].select){
                        skinTable[3] = index4;
                    }
                }
                for(var index5 = 1; index5<=allProducts.bgs.length;index5++){
                    if(allProducts.bgs[index5-1].select){
                        skinTable[4] = index5;
                    }
                }

                return skinTable
            }
        }
    //}

    var skinTable= [1,1,1,1,1];
    return skinTable
}

amazing.getCoupon = function(){
    return couponData
}

amazing.getMinigameId = function(){
    return true
}

amazing.getMinigameIdentifier = function(){
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

amazing.setMixPanelTrack= function(minigameName,event,didWin,score){
    if(event=="finishGame"){
        mixpanel.track(
            event,
            {"gameName": minigameName,"win":didWin, "numberOfObjects":score,"name":userName,"email":userMail,"gender":gender,"birthday":birthday,"interests":interests}
        );
    }
    else{
        mixpanel.track(
            event,
            {"gameName": minigameName,"name":userName,"email":userMail,"gender":gender,"birthday":birthday,"interests":interests}
        );
    }

    var params = {
       type: "analyticsMessage",
       data: {
           event: event,
           gameName: minigameName
       }
   }
    parent.postMessage(JSON.stringify(params), "*")
    
}

amazing.getPoll = function(){
    return poll
}

function backEvent(){
	console.log("back event")
	var games = amazing.getGames()
	var name
	for(var i = 0; i < games.length; i++ ){
        
        if(minigameId == games[i].id){
            name = games[i].mixName
            break
        }
    }
	amazing.endTimer(game.time.now,name)
}

//amazing.setApp()