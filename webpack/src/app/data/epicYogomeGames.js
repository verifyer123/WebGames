export var epicYogomeGames = {}

epicYogomeGames.getGames = function(){
	var games = [
		
		{name:'numberIceCream',url:'http://yogome.com/epic/minigames/numberIce/',sceneName:'ice',subject:'math',review:true},
		{name:'squatCount',url:'http://yogome.com/epic/minigames/squatCount/',sceneName:'squat',subject:'math', review:true},//57
		{name:'snoozeCrater',url:'http://yogome.com/epic/minigames/snoozeCrater/',sceneName:'snooze',subject:'sustainability',review:true},//29
		{name:'uniDream',url:'http://yogome.com/epic/minigames/uniDream/',sceneName:'uni',subject:'math', review:true},//53
		{name:'wildSnaps',url:'http://yogome.com/epic/minigames/wildSnaps/',sceneName:'wild',subject:'creativity',review:true},
		{name:'Space Count',url:'http://yogome.com/epic/minigames/spaceCount/',sceneName:'spaceCount',subject:'math', review:true},//78
		{name:'toyfigure',url:'http://yogome.com/epic/minigames/toyfigure/',sceneName:'toyfigure',subject:'math', review:true},//55
		{name:'mathBomb',url:'http://yogome.com/epic/minigames/mathBomb/',sceneName:'bomb',subject:'math', review:true},//52
		{name:'Float and Count',url:'http://yogome.com/epic/minigames/floatAndCount/',sceneName:'float',subject:'math', review:true},//77
		{name:'duckCount',url:'http://yogome.com/epic/minigames/duckCount/',sceneName:'duck',subject:'math', review:true},//66
		{name:'countipede',url:'http://yogome.com/epic/minigames/countipede/',sceneName:'countip',subject:'math', review:true},//54
		{name:'acornNumbers',url:'http://yogome.com/epic/minigames/acornNumbers/',sceneName:'acorn',subject:'math',review:true},//34
		{name:'River Rescue',url:'http://yogome.com/epic/minigames/RiverRescue/',sceneName:'riverRescue',subject:'sustainability', review:false},//99
		{name:'saladCards',url:'http://yogome.com/epic/minigames/tapcards/',sceneName:'tapcards',subject:'language',review:false},
		{name:'drZombie',url:'http://yogome.com/epic/minigames/drZombie/',sceneName:'drzombie',subject:'health', review:true},//94
		{name:'magicGate',url:'http://yogome.com/epic/minigames/magicGate/',sceneName:'magic',subject:'math', review:true},//49	
		{name:'Galactic Pool',url:'http://yogome.com/epic/minigames/galacticPool/',sceneName:'galactic',subject:'geography', review:false},//97
		{name:'wildDentist',url:'http://yogome.com/epic/minigames/wildDentist/',sceneName:'wildDentist',subject:'health', review:false},//95
		{name:'swampShapes',url:'http://yogome.com/epic/minigames/swampShape/',sceneName:'swampShape',subject:'math', review:true},//65
		{name:'CroakSong',url:'http://yogome.com/epic/minigames/CroakSong/',sceneName:'CroakSong',subject:'creativity',review:true},
		{name:'healthyCollector',url:'http://yogome.com/epic/minigames/healthyCollector/',sceneName:'healthyCollector',subject:'health',review:true},
		{name:'Geo Tunnel',url:'http://yogome.com/epic/minigames/geoTunnel/',sceneName:'geotunnel',subject:'math', review:true},//85
		{name:'clashCritters',url:'http://yogome.com/epic/minigames/clashCritters/',sceneName:'clash',subject:'math',review:true},//40
		{name:'minmaxduel',url:'http://yogome.com/epic/minigames/minmaxduel/',sceneName:'minmaxduel',subject:'math', review:true},//46	
		{name:'puzzleRoad',url:'http://yogome.com/epic/minigames/puzzleRoad/',sceneName:'puzzle',subject:'creativity',review:true},
		{name:'nachoSmacho',url:'http://yogome.com/epic/minigames/nachoSmacho/',sceneName:'nacho',subject:'math', review:true},//68
		{name:'lizart',url:'http://yogome.com/epic/minigames/lizart/',sceneName:'lizart',subject:'language',review:true},
		{name:'astronoMetric',url:'http://yogome.com/epic/minigames/astronoMetric/',sceneName:'astrono',subject:'math', review:true},//63
		{name:'skyLanguage',url:'http://yogome.com/epic/minigames/skyLanguage/',sceneName:'sky',subject:'language',review:true},
		{name:'flightoclock',url:'http://yogome.com/epic/minigames/flightoclock/',sceneName:'flightoclock',subject:'math',review:true},//39
		{name:'beachNinja',url:'http://yogome.com/epic/minigames/beachNinja/',sceneName:'beach',subject:'math',review:true},
		{name:'colorAttack',url:'http://yogome.com/epic/minigames/colorAttack/',sceneName:'color',subject:'creativity',review:true},
		{name:'geMath',url:'http://yogome.com/epic/minigames/geMath/',sceneName:'gem',subject:'math',review:true},
		{name:'candyShapes',url:'http://yogome.com/epic/minigames/candyShapes/',sceneName:'candy',subject:'math',review:true},//36
		{name:'tiltSprout',url:'http://yogome.com/epic/minigames/tiltSprout/',sceneName:'tilt',subject:'science',review:true},
		{name:'galaxyHeroes',url:'http://yogome.com/epic/minigames/galaxyHeroes/',sceneName:'galaxy',subject:'geography',review:true},//31
		{name:'spaceWords',url:'http://yogome.com/epic/minigames/spaceWords/',sceneName:'space',subject:'language',review:true},
		{name:'evening',url:'http://yogome.com/epic/minigames/evening/',sceneName:'evening',subject:'math', review:true},//45
		{name:'Cog Count',url:'http://yogome.com/epic/minigames/cogCount/',sceneName:'cog',subject:'math', review:true},//96
		{name:'waterMorphosis',url:'http://yogome.com/epic/minigames/waterMorph/',sceneName:'water',subject:'science',review:true},
		{name:'dizzyBoat',url:'http://yogome.com/epic/minigames/dizzyBoat/',sceneName:'dizzy',subject:'geography',review:true},
		{name:'msNomNom',url:'http://yogome.com/epic/minigames/msNomNom/',sceneName:'ms',subject:'math', review:true},//92
		{name:'aracnumber',url:'http://yogome.com/epic/minigames/aracnumbers/',sceneName:'aracnumber',subject:'math', review:true},//72
		{name:'clockfix',url:'http://yogome.com/epic/minigames/clockfix/',sceneName:'clockfix',subject:'math', review:true},//61
		{name:'flagRunner',url:'http://yogome.com/epic/minigames/flagRunner/',sceneName:'flag',subject:'geography',review:true},
		{name:'additionDojo',url:'http://yogome.com/epic/minigames/additiondojo/',sceneName:'dojo',subject:'math',review:true},
		{name:'River Cleaner',url:'http://yogome.com/epic/minigames/riverCleaner/',sceneName:'riverCleaner',subject:'sustainability', review:false},//100
		{name:'yogomeRunner',url:'http://yogome.com/epic/minigames/runneryogome/',sceneName:'runneryogome',subject:'math',review:true},
		{name:'geoJourney',url:'http://yogome.com/epic/minigames/geoJourney/',sceneName:'geoJourney',subject:'geography',review:true},
        {name:'mediCatcher',url:'http://yogome.com/epic/minigames/mediCatcher/',sceneName:'medi',subject:'health',review:true},
		{name:'Oona Says Cook',url:'http://yogome.com/epic/minigames/oonaSaysCook/',sceneName:'oona',subject:'coding', review:false},//98
		{name:'featherShelter',url:'http://yogome.com/epic/minigames/featherShelter/',sceneName:'feather',subject:'math',review:true},//37
        {name:'mathFeed',url:'http://yogome.com/epic/minigames/mathFeed/',sceneName:'feed',subject:'math',review:true},//30
		{name:'magnetRide',url:'http://yogome.com/epic/minigames/magnetRide/',sceneName:'magnet',subject:'science',review:true},
		{name:'cultureIcons',url:'http://yogome.com/epic/minigames/cultureIcons/',sceneName:'culture',subject:'geography',review:true},
		{name:'mathInvader',url:'http://yogome.com/epic/minigames/mathInvader/',sceneName:'invader',subject:'math', review:true},//47
		{name:'nutriCanon',url:'http://yogome.com/epic/minigames/nutriCanon/',sceneName:'nutri',subject:'health',review:true},
		{name:'hackaMole',url:'http://yogome.com/epic/minigames/hackaMole/',sceneName:'hack',subject:'coding',review:true},	
		{name:'Pirate Pieces',url:'http://yogome.com/epic/minigames/piratePieces/',sceneName:'piratePieces',subject:'math', review:true},// 89
		{name:'popFish',url:'http://yogome.com/epic/minigames/popFish/',sceneName:'fish',subject:'math',review:true},//32
		{name:'pizzafraction',url:'http://yogome.com/epic/minigames/pizzafraction/',sceneName:'pizzafraction',subject:'math',review:true},//42
		{name:'robovet',url:'http://yogome.com/epic/minigames/robovet/',sceneName:'robo',subject:'math', review:true},//51
		{name:'flagCollector',url:'http://yogome.com/epic/minigames/flagCollector/',sceneName:'flagCollector',subject:'geography',review:true},
		{name:'flyingFractions',url:'http://yogome.com/epic/minigames/flyingFractions/',sceneName:'flyingFractions',subject:'math',review:true},
		{name:'Fractiorama',url:'http://yogome.com/epic/minigames/fractiorama/',sceneName:'frac',subject:'math', review:true},//83
		{name:'mathCircus',url:'http://yogome.com/epic/minigames/mathCircus/',sceneName:'circus',subject:'math',review:true},//38
		{name:'mathEngine',url:'http://yogome.com/epic/minigames/mathEngine/',sceneName:'engine',subject:'math', review:true},//62
		{name:'mathPort',url:'http://yogome.com/epic/minigames/mathPort/',sceneName:'port',subject:'math',review:true},//41
		{name:'riftLand',url:'http://yogome.com/epic/minigames/riftLand/',sceneName:'rift',subject:'coding',review:true},
		{name:'microdefender',url:'http://yogome.com/epic/minigames/microdefender/',sceneName:'microdefender',subject:'health',review:true},
		{name:'hungryToads',url:'http://yogome.com/epic/minigames/hungryToads/',sceneName:'hungry',subject:'math',review:true},//43
		{name:'locksmath',url:'http://yogome.com/epic/minigames/locksmath/',sceneName:'lock',subject:'math', review:true},//48
		{name:'monsterDungeon',url:'http://yogome.com/epic/minigames/monsterDungeon/',sceneName:'monsterDungeon',subject:'math', review:true},//67
		{name:'luckynumber',url:'http://yogome.com/epic/minigames/luckyNumbers/',sceneName:'luckynumber',subject:'math', review:true},//50
		{name:'seaquence',url:'http://yogome.com/epic/minigames/seaquence/',sceneName:'seaquence',subject:'math', review:true},//60
		{name:'sushiTowers',url:'http://yogome.com/epic/minigames/sushiTowers/',sceneName:'sushi',subject:'math', review:true},//76
		{name:'baxtion',url:'http://yogome.com/epic/minigames/baxtion/',sceneName:'bax',subject:'math', review:true},//58
		{name:'popSteroids',url:'http://yogome.com/epic/minigames/popSteroids/',sceneName:'popScene',subject:'math',review:true},//35
		{name:'skyTap',url:'http://yogome.com/epic/minigames/skyTap/',sceneName:'sky',subject:'math' ,review:true},//44
		{name:'Garbage Diving',url:'http://yogome.com/epic/minigames/garbageDiving/',sceneName:'garbageDiving',subject:'sustainability', review:false},//101
		{name:'jumptiply',url:'http://yogome.com/epic/minigames/jumptiply/',sceneName:'jump',subject:'math', review:true},//64
		{name:'mathrioska',url:'http://yogome.com/epic/minigames/mathrioska/',sceneName:'mathrioska',subject:'math', review:true},//71
		{name:'stackathon',url:'http://yogome.com/epic/minigames/stackathon/',sceneName:'stack',subject:'math', review:true},//69
		{name:'Paper Ships',url:'http://yogome.com/epic/minigames/paperShips/',sceneName:'paper',subject:'math', review:true},//81
		{name:'duskdefense',url:'http://yogome.com/epic/minigames/duskDefense/',sceneName:'dusk',subject:'math', review:true},//73
		{name:'geometryWarp',url:'http://yogome.com/epic/minigames/geometryWarp/',sceneName:'geometry',subject:'math', review:true},//70
		{name:'Divisubmarine',url:'http://yogome.com/epic/minigames/diviSubmarine/',sceneName:'divisubmarine',subject:'math', review:true},//75
		{name:'mathgicHat',url:'http://yogome.com/epic/minigames/mathgicHat/',sceneName:'magic',subject:'math', review:true},//59
		{name:'memoNumbers',url:'http://yogome.com/epic/minigames/memoNumbers/',sceneName:'memo',subject:'math',review:true},
		{name:'jellyJump',url:'http://yogome.com/epic/minigames/jellyJump/',sceneName:'jelly',subject:'math', review:false}//56

		//{name:'Triangrid',url:'http://yogome.com/epic/minigames/triangridSite/',sceneName:'triangrid',subject:'math', review:false},// 90

        ]
    return games
        
}

epicYogomeGames.mixpanelCall = function(callName,gameIndex){
	
	var gamesList = epicYogomeGames.getGames()
		
	console.log('gameIndex sent ' + gameIndex )

	mixpanel.track(
		callName,
		{"gameName": gamesList[gameIndex].name}
	);
	
		
}