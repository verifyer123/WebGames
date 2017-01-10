var amazing = {}

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
        
        {name:'Amazing Bros',iconName:'bros',url:'http://amazingapp.co/juegos/amazingbros/',coupon: true},
        {name:'Zombie\n Crush',iconName:'zombie',url:'http://amazingapp.co/juegos/zombiecrush/',coupon : false},
        {name:'Cirquit',iconName:'cirquit',url:'http://amazingapp.co/juegos/cirquit/',coupon : false},
        {name:'Clown Rush',iconName:'clown',url:'http://amazingapp.co/juegos/clownrush/',coupon : false},
        {name:'Gravity\n Switch',iconName:'gravity',url:'http://amazingapp.co/juegos/graviswitch/',coupon : false},
        {name:'Hexhop',iconName:'hexhop',url:'http://amazingapp.co/juegos/hexhop/',coupon : false},
        {name:'Memorama\n del Sabor',iconName:'memorama',url:'http://amazingapp.co/juegos/memorama/',coupon : false},
        {name:'Jump Ward',iconName:'jump',url:'http://amazingapp.co/juegos/jumpward/',coupon : false},
        {name:'Jungle Fury',iconName:'jungle',url:'http://amazingapp.co/juegos/junglefury/',coupon : false},
        {name:'Lluvia de\n Gomitas',iconName:'lluvia',url:'http://amazingapp.co/juegos/chilimbalam/',coupon : false},
        {name:'Store Panic',iconName:'panic',url:'http://amazingapp.co/juegos/storepanic/',coupon : false},
        {name:'Tapatopo',iconName:'tapa',url:'http://amazingapp.co/juegos/tapatopo/',coupon : false},
        {name:'Twin Dots',iconName:'twin',url:'http://amazingapp.co/juegos/twindots/',coupon : false},
        {name:'Neon Edge',iconName:'neon',url:'http://amazingapp.co/juegos/neonedge/',coupon : false},
        
    ]
    
    return games
}