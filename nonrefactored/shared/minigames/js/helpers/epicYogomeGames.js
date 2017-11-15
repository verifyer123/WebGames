var epicYogomeGames = {}

epicYogomeGames.getGames = function(){
	var games = [
	
		{name:'additionDojo',url:'http://yogome.com/epic/minigames/additiondojo/',sceneName:'dojo',subject:'math',review:true},
        {name:'spaceWords',url:'http://yogome.com/epic/minigames/spaceWords/',sceneName:'space',subject:'language',review:true},
        {name:'yogomeRunner',url:'http://yogome.com/epic/minigames/runneryogome/',sceneName:'runneryogome',subject:'math',review:true},
        {name:'waterMorphosis',url:'http://yogome.com/epic/minigames/waterMorph/',sceneName:'water',subject:'science',review:true},
		{name:'numberIceCream',url:'http://yogome.com/epic/minigames/numberIce/',sceneName:'ice',subject:'math',review:true},
		{name:'magnetRide',url:'http://yogome.com/epic/minigames/magnetRide/',sceneName:'magnet',subject:'science',review:true},
		{name:'saladCards',url:'http://yogome.com/epic/minigames/tapcards/',sceneName:'tapcards',subject:'language',review:false},
		{name:'skyLanguage',url:'http://yogome.com/epic/minigames/skyLanguage/',sceneName:'sky',subject:'language',review:true},
		{name:'flagRunner',url:'http://yogome.com/epic/minigames/flagRunner/',sceneName:'flag',subject:'geography',review:true},
		{name:'riftLand',url:'http://yogome.com/epic/minigames/riftLand/',sceneName:'rift',subject:'coding',review:true},
		{name:'puzzleRoad',url:'http://yogome.com/epic/minigames/puzzleRoad/',sceneName:'puzzle',subject:'creativity',review:true},
		{name:'geoJourney',url:'http://yogome.com/epic/minigames/geoJourney/',sceneName:'geoJourney',subject:'geography',review:true},
		{name:'memoNumbers',url:'http://yogome.com/epic/minigames/memoNumbers/',sceneName:'memo',subject:'math',review:true},
		{name:'beachNinja',url:'http://yogome.com/epic/minigames/beachNinja/',sceneName:'beach',subject:'math',review:true},
        {name:'flyingFractions',url:'http://yogome.com/epic/minigames/flyingFractions/',sceneName:'flyingFractions',subject:'math',review:true},
		{name:'colorAttack',url:'http://yogome.com/epic/minigames/colorAttack/',sceneName:'color',subject:'creativity',review:true},
		{name:'nutriCanon',url:'http://yogome.com/epic/minigames/nutriCanon/',sceneName:'nutri',subject:'health',review:true},
		{name:'microdefender',url:'http://yogome.com/epic/minigames/microdefender/',sceneName:'microdefender',subject:'health',review:true},
		{name:'healthyCollector',url:'http://yogome.com/epic/minigames/healthyCollector/',sceneName:'healthyCollector',subject:'health',review:true},
        {name:'CroakSong',url:'http://yogome.com/epic/minigames/CroakSong/',sceneName:'CroakSong',subject:'creativity',review:true},
		{name:'tiltSprout',url:'http://yogome.com/epic/minigames/tiltSprout/',sceneName:'tilt',subject:'science',review:true},
		{name:'cultureIcons',url:'http://yogome.com/epic/minigames/cultureIcons/',sceneName:'culture',subject:'geography',review:true},
		{name:'dizzyBoat',url:'http://yogome.com/epic/minigames/dizzyBoat/',sceneName:'dizzy',subject:'geography',review:true},
		{name:'flagCollector',url:'http://yogome.com/epic/minigames/flagCollector/',sceneName:'flagCollector',subject:'geography',review:true},
		{name:'mediCatcher',url:'http://yogome.com/epic/minigames/mediCatcher/',sceneName:'medi',subject:'health',review:true},
        {name:'wildSnaps',url:'http://yogome.com/epic/minigames/wildSnaps/',sceneName:'wild',subject:'creativity',review:true},
		{name:'geMath',url:'http://yogome.com/epic/minigames/geMath/',sceneName:'gem',subject:'math',review:true},
		{name:'hackaMole',url:'http://yogome.com/epic/minigames/hackaMole/',sceneName:'hack',subject:'coding',review:true},		
		{name:'lizart',url:'http://yogome.com/epic/minigames/lizart/',sceneName:'lizart',subject:'language',review:true},
		{name:'snoozeCrater',url:'http://yogome.com/epic/minigames/snoozeCrater/',sceneName:'snooze',subject:'Sustainability',review:true},//29
		{name:'mathFeed',url:'http://yogome.com/epic/minigames/mathFeed/',sceneName:'feed',subject:'math',review:true},//30
		{name:'galaxyHeroes',url:'http://yogome.com/epic/minigames/galaxyHeroes/',sceneName:'galaxy',subject:'geography',review:true},//31
		{name:'popFish',url:'http://yogome.com/epic/minigames/popFish/',sceneName:'fish',subject:'math',review:true},//32
		//{name:'bouncybath',url:'http://yogome.com/epic/minigames/bouncybathsite/',sceneName:'bouncybath',subject:'health',review:false},//33
        {name:'acornNumbers',url:'http://yogome.com/epic/minigames/acornNumbers/',sceneName:'acorn',subject:'math',review:true},//34
		{name:'popSteroids',url:'http://yogome.com/epic/minigames/popSteroids/',sceneName:'popScene',subject:'math',review:true},//35
		{name:'candyShapes',url:'http://yogome.com/epic/minigames/candyShapes/',sceneName:'candy',subject:'math',review:true},//36
		{name:'featherShelter',url:'http://yogome.com/epic/minigames/featherShelter/',sceneName:'feather',subject:'math',review:true},//37
		{name:'mathCircus',url:'http://yogome.com/epic/minigames/mathCircus/',sceneName:'circus',subject:'math',review:true},//38
		{name:'flightoclock',url:'http://yogome.com/epic/minigames/flightoclock/',sceneName:'flightoclock',subject:'math',review:true},//39
		{name:'clashCritters',url:'http://yogome.com/epic/minigames/clashCritters/',sceneName:'clash',subject:'math',review:true},//40
		{name:'mathPort',url:'http://yogome.com/epic/minigames/mathPort/',sceneName:'port',subject:'math',review:true},//41

		{name:'pizzafraction',url:'http://yogome.com/epic/minigames/pizzafraction/',sceneName:'pizzafraction',subject:'math',review:true},//42
		{name:'hungryToads',url:'http://yogome.com/epic/minigames/hungryToads/',sceneName:'hungry',subject:'math',review:true},//43
		{name:'skyTap',url:'http://yogome.com/epic/minigames/skyTap/',sceneName:'sky',subject:'math' ,review:true},//44
		{name:'evening',url:'http://yogome.com/epic/minigames/evening/',sceneName:'evening',subject:'math', review:true},//45
		{name:'minmaxduel',url:'http://yogome.com/epic/minigames/minmaxduel/',sceneName:'minmaxduel',subject:'math', review:true},//46		
		{name:'mathInvader',url:'http://yogome.com/epic/minigames/mathInvader/',sceneName:'invader',subject:'math', review:true},//47
        {name:'locksmath',url:'http://yogome.com/epic/minigames/locksmath/',sceneName:'lock',subject:'math', review:true},//48
		{name:'magicGate',url:'http://yogome.com/epic/minigames/magicGate/',sceneName:'magic',subject:'math', review:true},//49	
        {name:'luckynumber',url:'http://yogome.com/epic/minigames/luckyNumbers/',sceneName:'luckynumber',subject:'math', review:true},//50
        {name:'robovet',url:'http://yogome.com/epic/minigames/robovet/',sceneName:'robo',subject:'math', review:true},//51
		{name:'mathBomb',url:'http://yogome.com/epic/minigames/mathBomb/',sceneName:'bomb',subject:'math', review:true},//52
		{name:'uniDream',url:'http://yogome.com/epic/minigames/uniDream/',sceneName:'uni',subject:'math', review:true},//53
		{name:'countipede',url:'http://yogome.com/epic/minigames/countipede/',sceneName:'countip',subject:'math', review:true},//54
        {name:'toyfigure',url:'http://yogome.com/epic/minigames/ToyFigures/',sceneName:'toyfigure',subject:'math', review:true},//55
		{name:'jellyJump',url:'http://yogome.com/epic/minigames/jellyJump/',sceneName:'jelly',subject:'math', review:false},//56
		{name:'squatCount',url:'http://yogome.com/epic/minigames/squatCount/',sceneName:'squat',subject:'math', review:true},//57
		{name:'baxtion',url:'http://yogome.com/epic/minigames/baxtion/',sceneName:'bax',subject:'math', review:true},//58
		{name:'mathgicHat',url:'http://yogome.com/epic/minigames/mathgicHat/',sceneName:'magic',subject:'math', review:true},//59
		{name:'seaquence',url:'http://yogome.com/epic/minigames/seaquence/',sceneName:'seaquence',subject:'math', review:true},//60
		{name:'clockfix',url:'http://yogome.com/epic/minigames/clockfix/',sceneName:'clockfix',subject:'math', review:true},//61
		{name:'mathEngine',url:'http://yogome.com/epic/minigames/mathEngine/',sceneName:'engine',subject:'math', review:true},//62
		{name:'astronoMetric',url:'http://yogome.com/epic/minigames/astronoMetric/',sceneName:'astrono',subject:'math', review:true},//63
		{name:'jumptiply',url:'http://yogome.com/epic/minigames/jumptiply/',sceneName:'jump',subject:'math', review:true},//64
		{name:'swampShapes',url:'http://yogome.com/epic/minigames/swampShape/',sceneName:'swampShape',subject:'math', review:true},//65
		{name:'duckCount',url:'http://yogome.com/epic/minigames/duckCount/',sceneName:'duck',subject:'math', review:true},//66
        {name:'monsterDungeon',url:'http://yogome.com/epic/minigames/monsterDungeon/',sceneName:'monsterDungeon',subject:'math', review:true},//67
		{name:'nachoSmacho',url:'http://yogome.com/epic/minigames/nachoSmacho/',sceneName:'nacho',subject:'math', review:true},//68
		{name:'stackathon',url:'http://yogome.com/epic/minigames/stackathon/',sceneName:'stack',subject:'math', review:true},//69
		{name:'geometryWarp',url:'http://yogome.com/epic/minigames/geometryWarp/',sceneName:'geometry',subject:'math', review:true},//70
		{name:'mathrioska',url:'http://yogome.com/epic/minigames/mathrioska/',sceneName:'mathrioska',subject:'math', review:true},//71
        {name:'aracnumber',url:'http://yogome.com/epic/minigames/aracnumbers/',sceneName:'aracnumber',subject:'math', review:true},//72
		{name:'duskdefense',url:'http://yogome.com/epic/minigames/duskDefense/',sceneName:'dusk',subject:'math', review:true},//73
		{name:'Divisubmarine',url:'http://yogome.com/epic/minigames/diviSubmarine/',sceneName:'divisubmarine',subject:'math', review:true},//75
		{name:'sushiTowers',url:'http://yogome.com/epic/minigames/sushiTowers/',sceneName:'sushi',subject:'math', review:true},//76
		{name:'Float and Count',url:'http://yogome.com/epic/minigames/floatAndCount/',sceneName:'float',subject:'math', review:true},//77
		{name:'Space Count',url:'http://yogome.com/epic/minigames/SpaceCount/',sceneName:'spaceCount',subject:'math', review:true},//78
		{name:'Paper Ships',url:'http://yogome.com/epic/minigames/paperShips/',sceneName:'paper',subject:'math', review:true},//81
		{name:'Fractiorama',url:'http://yogome.com/epic/minigames/fractiorama/',sceneName:'frac',subject:'math', review:true},//83
		{name:'Geo Tunnel',url:'http://yogome.com/epic/minigames/geoTunnel/',sceneName:'geotunnel',subject:'math', review:true},//85
		{name:'Pirate Pieces',url:'http://yogome.com/epic/minigames/piratePieces/',sceneName:'piratePieces',subject:'math', review:true},// 89
		//{name:'Triangrid',url:'http://yogome.com/epic/minigames/triangridSite/',sceneName:'triangrid',subject:'math', review:false},// 90
		//{name:'iMagic',url:'http://yogome.com/epic/minigames/iMagicSite/',sceneName:'imagic',subject:'math', review:false},//91
		{name:'msNomNom',url:'http://yogome.com/epic/minigames/msNomNom/',sceneName:'ms',subject:'math', review:true},//92
		//{name:'frutiLluvia',url:'http://yogome.com/epic/minigames/frutiSite/',sceneName:'fruti',subject:'math', review:false},//93
		{name:'drZombie',url:'http://yogome.com/epic/minigames/drZombie/',sceneName:'drzombie',subject:'health', review:true},//94
		{name:'wildDentist',url:'http://yogome.com/epic/minigames/wildDentist/',sceneName:'wildDentist',subject:'health', review:false},//95
		{name:'Cog Count',url:'http://yogome.com/epic/minigames/cogCount/',sceneName:'cog',subject:'math', review:true},//96
        {name:'Galactic Pool',url:'http://yogome.com/epic/minigames/galacticPool/',sceneName:'galactic',subject:'geography', review:false},//97
        {name:'Oona Says Cook',url:'http://yogome.com/epic/minigames/oonaSaysCook/',sceneName:'oona',subject:'programming', review:false},//98
        {name:'River Rescue',url:'http://yogome.com/epic/minigames/RiverRescue/',sceneName:'riverRescue',subject:'Sustainability', review:false},//99
        {name:'River Cleaner',url:'http://yogome.com/epic/minigames/riverCleaner/',sceneName:'riverCleaner',subject:'Sustainability', review:false},//100
        {name:'Garbage Diving',url:'http://yogome.com/epic/minigames/garbageDiving/',sceneName:'garbageDiving',subject:'Sustainability', review:false}//101
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