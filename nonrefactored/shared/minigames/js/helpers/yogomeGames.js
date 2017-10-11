var yogomeGames = {}

yogomeGames.getGames = function(){
	var games = [
	
		{name:'additionDojo',url:'http://yogome.com/epic/minigames/dojoSite/',sceneName:'dojo',subject:'math',review:true},
        {name:'spaceWords',url:'http://yogome.com/epic/minigames/spaceSite/',sceneName:'space',subject:'language',review:true},
        {name:'yogomeRunner',url:'http://yogome.com/epic/minigames/runnerSite/',sceneName:'runneryogome',subject:'math',review:true},
        {name:'waterMorphosis',url:'http://yogome.com/epic/minigames/waterSite/',sceneName:'water',subject:'science',review:true},
		{name:'numberIceCream',url:'http://yogome.com/epic/minigames/iceSite/',sceneName:'ice',subject:'math',review:true},
		{name:'magnetRide',url:'http://yogome.com/epic/minigames/magnetSite/',sceneName:'magnet',subject:'science',review:true},
		{name:'saladCards',url:'http://yogome.com/epic/minigames/tapsite/',sceneName:'tapcards',subject:'language',review:true},
		{name:'skyLanguage',url:'http://yogome.com/epic/minigames/skySite/',sceneName:'sky',subject:'language',review:true},
		{name:'flagRunner',url:'http://yogome.com/epic/minigames/flagSite/',sceneName:'flag',subject:'geography',review:true},
		{name:'riftLand',url:'http://yogome.com/epic/minigames/riftSite/',sceneName:'rift',subject:'coding',review:true},
		{name:'puzzleRoad',url:'http://yogome.com/epic/minigames/puzzleSite/',sceneName:'puzzle',subject:'creativity',review:true},
		{name:'geoJourney',url:'http://yogome.com/epic/minigames/geoSite/',sceneName:'geoJourney',subject:'geography',review:true},
		{name:'memoNumbers',url:'http://yogome.com/epic/minigames/memoSite/',sceneName:'memo',subject:'math',review:true},
		{name:'beachNinja',url:'http://yogome.com/epic/minigames/beachSite/',sceneName:'beach',subject:'math',review:true},
        {name:'flyingFractions',url:'http://yogome.com/epic/minigames/flyingFractionsSite/',sceneName:'flyingFractions',subject:'math',review:true},
		{name:'colorAttack',url:'http://yogome.com/epic/minigames/colorSite/',sceneName:'color',subject:'creativity',review:true},
		{name:'nutriCanon',url:'http://yogome.com/epic/minigames/nutriSite/',sceneName:'nutri',subject:'health',review:true},
		{name:'microdefender',url:'http://yogome.com/epic/minigames/microdefendersite/',sceneName:'microdefender',subject:'health',review:true},
		{name:'healthyCollector',url:'http://yogome.com/epic/minigames/healthySite/',sceneName:'healthyCollector',subject:'health',review:true},
        {name:'CroakSong',url:'http://yogome.com/epic/minigames/CroakSongSite/',sceneName:'CroakSong',subject:'creativity',review:true},
		{name:'tiltSprout',url:'http://yogome.com/epic/minigames/tiltSite/',sceneName:'tilt',subject:'science',review:true},
		{name:'cultureIcons',url:'http://yogome.com/epic/minigames/cultureSite/',sceneName:'culture',subject:'geography',review:true},
		{name:'dizzyBoat',url:'http://yogome.com/epic/minigames/dizzySite/',sceneName:'dizzy',subject:'geography',review:true},
		{name:'flagCollector',url:'http://yogome.com/epic/minigames/flagCollectorSite/',sceneName:'flag',subject:'geography',review:true},
		{name:'mediCatcher',url:'http://yogome.com/epic/minigames/mediSite/',sceneName:'medi',subject:'health',review:true},
        {name:'wildSnaps',url:'http://yogome.com/epic/minigames/wildSite/',sceneName:'wild',subject:'creativity',review:true},
		{name:'geMath',url:'http://yogome.com/epic/minigames/gemSite/',sceneName:'gem',subject:'math',review:true},
		{name:'hackaMole',url:'http://yogome.com/epic/minigames/hackSite/',sceneName:'hack',subject:'coding',review:true},		
		{name:'lizart',url:'http://yogome.com/epic/minigames/lizartsite/',sceneName:'lizart',subject:'language',review:true},
		{name:'snoozeCrater',url:'http://yogome.com/epic/minigames/snoozeSite/',sceneName:'snooze',subject:'Sustainability',review:true},//29
		{name:'mathFeed',url:'http://yogome.com/epic/minigames/feedSite/',sceneName:'feed',subject:'math',review:true},//30
		{name:'galaxyHeroes',url:'http://yogome.com/epic/minigames/galaxySite/',sceneName:'galaxy',subject:'geography',review:true},//31
		{name:'popFish',url:'http://yogome.com/epic/minigames/fishSite/',sceneName:'fish',subject:'math',review:true},//32
		{name:'bouncybath',url:'http://yogome.com/epic/minigames/bouncybathsite/',sceneName:'bouncybath',subject:'health',review:false},//33
        {name:'acornNumbers',url:'http://yogome.com/epic/minigames/acornSite/',sceneName:'acorn',subject:'math',review:true},//34
		{name:'popSteroids',url:'http://yogome.com/epic/minigames/popSite/',sceneName:'popScene',subject:'math',review:true},//35
		{name:'candyShapes',url:'http://yogome.com/epic/minigames/candySite/',sceneName:'candy',subject:'math',review:true},//36
		{name:'featherShelter',url:'http://yogome.com/epic/minigames/featherSite/',sceneName:'feather',subject:'math',review:true},//37
		{name:'mathCircus',url:'http://yogome.com/epic/minigames/circusSite/',sceneName:'circus',subject:'math',review:true},//38
		{name:'flightoclock',url:'http://yogome.com/epic/minigames/flightoclocksite/',sceneName:'flightoclock',subject:'math',review:true},//39
		{name:'clashCritters',url:'http://yogome.com/epic/minigames/clashSite/',sceneName:'clash',subject:'math',review:true},//40
		{name:'mathPort',url:'http://yogome.com/epic/minigames/portSite/',sceneName:'port',subject:'math',review:true},//41

		{name:'pizzafraction',url:'http://yogome.com/epic/minigames/pizzafractionsite/',sceneName:'pizzafraction',subject:'math',review:true},//42
		{name:'hungryToads',url:'http://yogome.com/epic/minigames/hungrySite/',sceneName:'hungry',subject:'math',review:true},//43
		{name:'skyTap',url:'http://yogome.com/epic/minigames/skyTapSite/',sceneName:'sky',subject:'math' ,review:true},//44
		{name:'evening',url:'http://yogome.com/epic/minigames/eveningSite/',sceneName:'evening',subject:'math', review:true},//45
		{name:'minmaxduel',url:'http://yogome.com/epic/minigames/minmaxduelsite/',sceneName:'minmaxduel',subject:'math', review:true},//46		
		{name:'mathInvader',url:'http://yogome.com/epic/minigames/invaderSite/',sceneName:'invader',subject:'math', review:true},//47
        {name:'locksmath',url:'http://yogome.com/epic/minigames/lockSite/',sceneName:'lock',subject:'math', review:true},//48
		{name:'magicGate',url:'http://yogome.com/epic/minigames/magicSite/',sceneName:'magic',subject:'math', review:true},//49	
        {name:'luckynumber',url:'http://yogome.com/epic/minigames/luckynumbersite/',sceneName:'luckynumber',subject:'math', review:true},//50
        {name:'robovet',url:'http://yogome.com/epic/minigames/roboSite/',sceneName:'robo',subject:'math', review:true},//51
		{name:'mathBomb',url:'http://yogome.com/epic/minigames/bombSite/',sceneName:'bomb',subject:'math', review:true},//52
		{name:'uniDream',url:'http://yogome.com/epic/minigames/uniSite/',sceneName:'uni',subject:'math', review:true},//53
		{name:'countipede',url:'http://yogome.com/epic/minigames/countipSite/',sceneName:'countip',subject:'math', review:true},//54
        {name:'toyfigure',url:'http://yogome.com/epic/minigames/toyfigureSite/',sceneName:'toyfigure',subject:'math', review:true},//55
		{name:'jellyJump',url:'http://yogome.com/epic/minigames/jellySite/',sceneName:'jelly',subject:'math', review:false},//56
		{name:'squatCount',url:'http://yogome.com/epic/minigames/squatSite/',sceneName:'squat',subject:'math', review:true},//57
		{name:'baxtion',url:'http://yogome.com/epic/minigames/baxSite/',sceneName:'bax',subject:'math', review:true},//58
		{name:'mathgicHat',url:'http://yogome.com/epic/minigames/hatSite/',sceneName:'magic',subject:'math', review:true},//59
		{name:'seaquence',url:'http://yogome.com/epic/minigames/seaSite/',sceneName:'seaquence',subject:'math', review:true},//60
		{name:'clockfix',url:'http://yogome.com/epic/minigames/clockfixSite/',sceneName:'clockfix',subject:'math', review:true},//61
		{name:'mathEngine',url:'http://yogome.com/epic/minigames/engineSite/',sceneName:'engine',subject:'math', review:true},//62
		{name:'astronoMetric',url:'http://yogome.com/epic/minigames/astronoSite/',sceneName:'astrono',subject:'math', review:true},//63
		{name:'jumptiply',url:'http://yogome.com/epic/minigames/jumpSite/',sceneName:'jump',subject:'math', review:true},//64
		{name:'swampShapes',url:'http://yogome.com/epic/minigames/swampShapeSite/',sceneName:'swampShape',subject:'math', review:true},//65
		{name:'duckCount',url:'http://yogome.com/epic/minigames/duckSite/',sceneName:'duck',subject:'math', review:true},//66
        {name:'monsterDungeon',url:'http://yogome.com/epic/minigames/monsterDungeonsite/',sceneName:'monsterDungeon',subject:'math', review:true},//67
		{name:'nachoSmacho',url:'http://yogome.com/epic/minigames/nachoSite/',sceneName:'nacho',subject:'math', review:true},//68
		{name:'stackathon',url:'http://yogome.com/epic/minigames/stackSite/',sceneName:'stack',subject:'math', review:true},//69
		{name:'geometryWarp',url:'http://yogome.com/epic/minigames/geometrySite/',sceneName:'geometry',subject:'math', review:true},//70
		{name:'mathrioska',url:'http://yogome.com/epic/minigames/mathrioskaSite/',sceneName:'mathrioska',subject:'math', review:true},//71
        {name:'aracnumber',url:'http://yogome.com/epic/minigames/aracnumberSite/',sceneName:'aracnumber',subject:'math', review:true},//72
		{name:'duskdefense',url:'http://yogome.com/epic/minigames/duskSite/',sceneName:'dusk',subject:'math', review:true},//73
		{name:'zucaritas',url:'http://yogome.com/epic/minigames/zucaritasSite/',sceneName:'zucaritas',subject:'geography', review:false},//74 K
		{name:'Divisubmarine',url:'http://yogome.com/epic/minigames/diviSite/',sceneName:'divisubmarine',subject:'math', review:true},//75
		{name:'sushiTowers',url:'http://yogome.com/epic/minigames/sushiSite/',sceneName:'sushi',subject:'math', review:true},//76
		{name:'Float and Count',url:'http://yogome.com/epic/minigames/floatSite/',sceneName:'float',subject:'math', review:true},//77
		{name:'Space Count',url:'http://yogome.com/epic/minigames/spaceCountSite/',sceneName:'spaceCount',subject:'math', review:true},//78
		{name:'Loop Roll',url:'http://yogome.com/epic/minigames/loopSite/',sceneName:'loop',subject:'math', review:false},//79 K
		{name:'Melvin Travel',url:'http://yogome.com/epic/minigames/melvinSite/',sceneName:'melvin',subject:'geography', review:false},//80 K
		{name:'Paper Ships',url:'http://yogome.com/epic/minigames/paperSite/',sceneName:'paper',subject:'math', review:true},//81
		{name:'FrooTemple',url:'http://yogome.com/epic/minigames/frooTempleSite/',sceneName:'frootemple',subject:'math', review:false},//82 K
		{name:'Fractiorama',url:'http://yogome.com/epic/minigames/fracSite/',sceneName:'frac',subject:'math', review:true},//83
		{name:'Frosty Run',url:'http://yogome.com/epic/minigames/frostySite/',sceneName:'frosty',subject:'math', review:false},//84 K
		{name:'Geo Tunnel',url:'http://yogome.com/epic/minigames/geotunnelSite/',sceneName:'geotunnel',subject:'math', review:true},//85
		{name:'Hover Ride',url:'http://yogome.com/epic/minigames/hoverSite/',sceneName:'hover',subject:'math', review:false},//86 K
		{name:'Cereal Buffet',url:'http://yogome.com/epic/minigames/cerealSite/',sceneName:'cereal',subject:'math', review:false},//87 K
		{name:'Froot Math',url:'http://yogome.com/epic/minigames/frootSite/',sceneName:'frootMath',subject:'math', review:false},//88 K
		{name:'Pirate Pieces',url:'http://yogome.com/epic/minigames/piratePiecesSite/',sceneName:'piratePieces',subject:'math', review:true},// 89
		{name:'Triangrid',url:'http://yogome.com/epic/minigames/triangridSite/',sceneName:'triangrid',subject:'math', review:false},// 90
		{name:'iMagic',url:'http://yogome.com/epic/minigames/iMagicSite/',sceneName:'imagic',subject:'math', review:false},//91
		{name:'msNomNom',url:'http://yogome.com/epic/minigames/msSite/',sceneName:'ms',subject:'math', review:true},//92
		{name:'frutiLluvia',url:'http://yogome.com/epic/minigames/frutiSite/',sceneName:'fruti',subject:'math', review:false},//93
		{name:'drZombie',url:'http://yogome.com/epic/minigames/drZombieSite/',sceneName:'drzombie',subject:'health', review:false}//94
	]
    
    return games
}

yogomeGames.mixpanelCall = function(callName,gameIndex){
	
	var gamesList = yogomeGames.getGames()
		
	console.log('gameIndex sent ' + gameIndex )

	mixpanel.track(
		callName,
		{"gameName": gamesList[gameIndex].name}
	);
	
		
}