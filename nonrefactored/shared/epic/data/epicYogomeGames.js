var epicYogomeGames = function () {

	var urls = {dev:"../..", prod:".."}
	var url = urls.prod

	var games = [

		{name:'numberIceCream',url:url + '/numberIce/',sceneName:'ice',subject:'math',review:true},
		{name:'squatCount',url:url + '/squatCount/',sceneName:'squat',subject:'math', review:true},//57
		{name:'snoozeCrater',url:url + '/snoozeCrater/',sceneName:'snooze',subject:'sustainability',review:true},//29
		{name:'uniDream',url:url + '/uniDream/',sceneName:'uni',subject:'math', review:true},//53
		{name:'wildSnaps',url:url + '/wildSnaps/',sceneName:'wild',subject:'creativity',review:true},
		{name:'Space Count',url:url + '/spaceCount/',sceneName:'spaceCount',subject:'math', review:true},//78
		{name:'toyfigure',url:url + '/toyfigure/',sceneName:'toyfigure',subject:'math', review:true},//55
		{name:'mathBomb',url:url + '/mathBomb/',sceneName:'bomb',subject:'math', review:true},//52
		{name:'Float and Count',url:url + '/floatAndCount/',sceneName:'float',subject:'math', review:true},//77
		{name:'duckCount',url:url + '/duckCount/',sceneName:'duck',subject:'math', review:true},//66
		{name:'countipede',url:url + '/countipede/',sceneName:'countip',subject:'math', review:true},//54
		{name:'acornNumbers',url:url + '/acornNumbers/',sceneName:'acorn',subject:'math',review:true},//34
		{name:'River Rescue',url:url + '/RiverRescue/',sceneName:'riverRescue',subject:'sustainability', review:false},//99
		{name:'saladCards',url:url + '/tapcards/',sceneName:'tapcards',subject:'language',review:false},
		{name:'drZombie',url:url + '/drZombie/',sceneName:'drzombie',subject:'health', review:true},//94
		{name:'magicGate',url:url + '/magicGate/',sceneName:'magic',subject:'math', review:true},//49
		{name:'Galactic Pool',url:url + '/galacticPool/',sceneName:'galactic',subject:'geography', review:false},//97
		{name:'wildDentist',url:url + '/wildDentist/',sceneName:'wildDentist',subject:'health', review:false},//95
		{name:'swampShapes',url:url + '/swampShape/',sceneName:'swampShape',subject:'math', review:true},//65
		{name:'CroakSong',url:url + '/CroakSong/',sceneName:'CroakSong',subject:'creativity',review:true},
		{name:'healthyCollector',url:url + '/healthyCollector/',sceneName:'healthyCollector',subject:'health',review:true},
		{name:'Geo Tunnel',url:url + '/geoTunnel/',sceneName:'geotunnel',subject:'math', review:true},//85
		{name:'clashCritters',url:url + '/clashCritters/',sceneName:'clash',subject:'math',review:true},//40
		{name:'minmaxduel',url:url + '/minmaxduel/',sceneName:'minmaxduel',subject:'math', review:true},//46
		{name:'puzzleRoad',url:url + '/puzzleRoad/',sceneName:'puzzle',subject:'creativity',review:true},
		{name:'nachoSmacho',url:url + '/nachoSmacho/',sceneName:'nacho',subject:'math', review:true},//68
		{name:'lizart',url:url + '/lizart/',sceneName:'lizart',subject:'language',review:true},
		{name:'astronoMetric',url:url + '/astronoMetric/',sceneName:'astrono',subject:'math', review:true},//63
		{name:'skyLanguage',url:url + '/skyLanguage/',sceneName:'sky',subject:'language',review:true},
		{name:'flightoclock',url:url + '/flightoclock/',sceneName:'flightoclock',subject:'math',review:true},//39
		{name:'beachNinja',url:url + '/beachNinja/',sceneName:'beach',subject:'math',review:true},
		{name:'colorAttack',url:url + '/colorAttack/',sceneName:'color',subject:'creativity',review:true},
		{name:'geMath',url:url + '/geMath/',sceneName:'gem',subject:'math',review:true},
		{name:'candyShapes',url:url + '/candyShapes/',sceneName:'candy',subject:'math',review:true},//36
		{name:'tiltSprout',url:url + '/tiltSprout/',sceneName:'tilt',subject:'science',review:true},
		{name:'galaxyHeroes',url:url + '/galaxyHeroes/',sceneName:'galaxy',subject:'geography',review:true},//31
		{name:'spaceWords',url:url + '/spaceWords/',sceneName:'space',subject:'language',review:true},
		{name:'evening',url:url + '/evening/',sceneName:'evening',subject:'math', review:true},//45
		{name:'Cog Count',url:url + '/cogCount/',sceneName:'cog',subject:'math', review:true},//96
		{name:'waterMorphosis',url:url + '/waterMorph/',sceneName:'water',subject:'science',review:true},
		{name:'dizzyBoat',url:url + '/dizzyBoat/',sceneName:'dizzy',subject:'geography',review:true},
		{name:'msNomNom',url:url + '/msNomNom/',sceneName:'ms',subject:'math', review:true},//92
		{name:'aracnumber',url:url + '/aracnumbers/',sceneName:'aracnumber',subject:'math', review:true},//72
		{name:'clockfix',url:url + '/clockfix/',sceneName:'clockfix',subject:'math', review:true},//61
		{name:'flagRunner',url:url + '/flagRunner/',sceneName:'flag',subject:'geography',review:true},
		{name:'additionDojo',url:url + '/additiondojo/',sceneName:'dojo',subject:'math',review:true},
		{name:'River Cleaner',url:url + '/riverCleaner/',sceneName:'riverCleaner',subject:'sustainability', review:false},//100
		{name:'yogomeRunner',url:url + '/runneryogome/',sceneName:'runneryogome',subject:'math',review:true},
		{name:'geoJourney',url:url + '/geoJourney/',sceneName:'geoJourney',subject:'geography',review:true},
		{name:'mediCatcher',url:url + '/mediCatcher/',sceneName:'medi',subject:'health',review:true},
		{name:'Oona Says Cook',url:url + '/oonaSaysCook/',sceneName:'oona',subject:'coding', review:false},//98
		{name:'featherShelter',url:url + '/featherShelter/',sceneName:'feather',subject:'math',review:true},//37
		{name:'mathFeed',url:url + '/mathFeed/',sceneName:'feed',subject:'math',review:true},//30
		{name:'magnetRide',url:url + '/magnetRide/',sceneName:'magnet',subject:'science',review:true},
		{name:'cultureIcons',url:url + '/cultureIcons/',sceneName:'culture',subject:'geography',review:true},
		{name:'mathInvader',url:url + '/mathInvader/',sceneName:'invader',subject:'math', review:true},//47
		{name:'nutriCanon',url:url + '/nutriCanon/',sceneName:'nutri',subject:'health',review:true},
		{name:'hackaMole',url:url + '/hackaMole/',sceneName:'hack',subject:'coding',review:true},
		{name:'Pirate Pieces',url:url + '/piratePieces/',sceneName:'piratePieces',subject:'math', review:true},// 89
		{name:'popFish',url:url + '/popFish/',sceneName:'fish',subject:'math',review:true},//32
		{name:'pizzafraction',url:url + '/pizzafraction/',sceneName:'pizzafraction',subject:'math',review:true},//42
		{name:'robovet',url:url + '/robovet/',sceneName:'robo',subject:'math', review:true},//51
		{name:'flagCollector',url:url + '/flagCollector/',sceneName:'flagCollector',subject:'geography',review:true},
		{name:'flyingFractions',url:url + '/flyingFractions/',sceneName:'flyingFractions',subject:'math',review:true},
		{name:'Fractiorama',url:url + '/fractiorama/',sceneName:'frac',subject:'math', review:true},//83
		{name:'mathCircus',url:url + '/mathCircus/',sceneName:'circus',subject:'math',review:true},//38
		{name:'mathEngine',url:url + '/mathEngine/',sceneName:'engine',subject:'math', review:true},//62
		{name:'mathPort',url:url + '/mathPort/',sceneName:'port',subject:'math',review:true},//41
		{name:'riftLand',url:url + '/riftLand/',sceneName:'rift',subject:'coding',review:true},
		{name:'microdefender',url:url + '/microdefender/',sceneName:'microdefender',subject:'health',review:true},
		{name:'hungryToads',url:url + '/hungryToads/',sceneName:'hungry',subject:'math',review:true},//43
		{name:'locksmath',url:url + '/locksmath/',sceneName:'lock',subject:'math', review:true},//48
		{name:'monsterDungeon',url:url + '/monsterDungeon/',sceneName:'monsterDungeon',subject:'math', review:true},//67
		{name:'luckynumber',url:url + '/luckyNumbers/',sceneName:'luckynumber',subject:'math', review:true},//50
		{name:'seaquence',url:url + '/seaquence/',sceneName:'seaquence',subject:'math', review:true},//60
		{name:'sushiTowers',url:url + '/sushiTowers/',sceneName:'sushi',subject:'math', review:true},//76
		{name:'baxtion',url:url + '/baxtion/',sceneName:'bax',subject:'math', review:true},//58
		{name:'popSteroids',url:url + '/popSteroids/',sceneName:'popScene',subject:'math',review:true},//35
		{name:'skyTap',url:url + '/skyTap/',sceneName:'sky',subject:'math' ,review:true},//44
		{name:'Garbage Diving',url:url + '/garbageDiving/',sceneName:'garbageDiving',subject:'sustainability', review:false},//101
		{name:'jumptiply',url:url + '/jumptiply/',sceneName:'jump',subject:'math', review:true},//64
		{name:'mathrioska',url:url + '/mathrioska/',sceneName:'mathrioska',subject:'math', review:true},//71
		{name:'stackathon',url:url + '/stackathon/',sceneName:'stack',subject:'math', review:true},//69
		{name:'Paper Ships',url:url + '/paperShips/',sceneName:'paper',subject:'math', review:true},//81
		{name:'duskdefense',url:url + '/duskDefense/',sceneName:'dusk',subject:'math', review:true},//73
		{name:'geometryWarp',url:url + '/geometryWarp/',sceneName:'geometry',subject:'math', review:true},//70
		{name:'Divisubmarine',url:url + '/diviSubmarine/',sceneName:'divisubmarine',subject:'math', review:true},//75
		{name:'mathgicHat',url:url + '/mathgicHat/',sceneName:'magic',subject:'math', review:true},//59
		{name:'memoNumbers',url:url + '/memoNumbers/',sceneName:'memo',subject:'math',review:true},
		{name:'jellyJump',url:url + '/jellyJump/',sceneName:'jelly',subject:'math', review:false}//56

		//{name:'Triangrid',url:url + '/triangridSite/',sceneName:'triangrid',subject:'math', review:false},// 90

	]

	var getGames = function(){

		console.log(url)
		return games

	}

	var mixpanelCall = function(callName,gameIndex){

		var gamesList = epicYogomeGames.getGames()

		console.log('gameIndex sent ' + gameIndex )

		mixpanel.track(
			callName,
			{"gameName": gamesList[gameIndex].name}
		);

	}

	return{
		mixpanelCall:mixpanelCall,
		getGames:getGames
	}
}()