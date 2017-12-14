var yogomeGames = {}
var gameLives = 0
var timeCount = 0
var addingTime = true
var urlMap = 'http://yogome.com/epic/minigames/epicSite/#/minigames/'

yogomeGames.getGames = function(){
	var games = [
	
		{name:'Addition Dojo',url:'http://yogome.com/epic/minigames/dojoSite/',mapUrl:urlMap + 'additiondojo', sceneName:'dojo',subject:'math',review:true,objective:15,demo:false},
        {name:'Space Words',url:'http://yogome.com/epic/minigames/spaceSite/',mapUrl:urlMap + 'spaceWords', sceneName:'space',subject:'language',review:true,objective:20,demo:false},
        {name:'Math Run',url:'http://yogome.com/epic/minigames/runnerSite/',mapUrl:urlMap + 'runneryogome', sceneName:'runneryogome',subject:'math',review:true,objective:20,demo:true},
        {name:'Water Morphosis',url:'http://yogome.com/epic/minigames/waterSite/',mapUrl:urlMap + 'waterMorph', sceneName:'water',subject:'science',review:true,objective:40,demo:false},
		{name:'Ice Cream Numbers',url:'http://yogome.com/epic/minigames/iceSite/',mapUrl:urlMap + 'numberIce', sceneName:'ice',subject:'math',review:false,objective:10,demo:false},
		{name:'Magnet Ride',url:'http://yogome.com/epic/minigames/magnetSite/',mapUrl:urlMap + 'magnetRide', sceneName:'magnet',subject:'science',review:true,objective:30,demo:false},
		{name:'Salad Cards',url:'http://yogome.com/epic/minigames/tapsite/',mapUrl:urlMap + 'tapcards', sceneName:'tapcards',subject:'language',review:false,objective:30,demo:false},
		{name:'Sky Language',url:'http://yogome.com/epic/minigames/skySite/',mapUrl:urlMap + 'skyLanguage', sceneName:'sky',subject:'language',review:true,objective:15,demo:false},
		{name:'Flag Runner',url:'http://yogome.com/epic/minigames/flagSite/',mapUrl:urlMap + 'flagRunner', sceneName:'flag',subject:'geography',review:true,objective:15,demo:false},
		{name:'Rift Land',url:'http://yogome.com/epic/minigames/riftSite/',mapUrl:urlMap + 'riftLand', sceneName:'rift',subject:'coding',review:true,objective:20,demo:false},
		{name:'Puzzle Road',url:'http://yogome.com/epic/minigames/puzzleSite/',mapUrl:urlMap + 'puzzleRoad', sceneName:'puzzle',subject:'creativity',review:true,objective:25,demo:false},
		{name:'Geo Journey',url:'http://yogome.com/epic/minigames/geoSite/',mapUrl:urlMap + 'geoJourney', sceneName:'geoJourney',subject:'geography',review:false,objective:20,demo:false},
		{name:'Memonumbers',url:'http://yogome.com/epic/minigames/memoSite/',mapUrl:urlMap + 'memoNumbers', sceneName:'memo',subject:'math',review:true,objective:40,demo:false},
		{name:'Beach Ninja',url:'http://yogome.com/epic/minigames/beachSite/',mapUrl:urlMap + 'beachNinja', sceneName:'beach',subject:'math',review:true,objective:15,demo:false},
        {name:'Flying Fractions',url:'http://yogome.com/epic/minigames/flyingFractionsSite/',mapUrl:urlMap + 'flyingFractions', sceneName:'flyingFractions',subject:'math',review:true,objective:20,demo:false},
		{name:'Color Attack',url:'http://yogome.com/epic/minigames/colorSite/',mapUrl:urlMap + 'colorAttack', sceneName:'color',subject:'creativity',review:true,objective:15,demo:false},
		{name:'Nutricanon',url:'http://yogome.com/epic/minigames/nutriSite/',mapUrl:urlMap + 'nutriCanon', sceneName:'nutri',subject:'health',review:true,objective:20,demo:false},
		{name:'Microdefender',url:'http://yogome.com/epic/minigames/microdefendersite/',mapUrl:urlMap + 'microdefender', sceneName:'microdefender',subject:'health',review:true,objective:30,demo:false},
		{name:'Healthy Collector',url:'http://yogome.com/epic/minigames/healthySite/',mapUrl:urlMap + 'healthyCollector', sceneName:'healthyCollector',subject:'health',review:false,objective:30,demo:false},
        {name:'Croak Song',url:'http://yogome.com/epic/minigames/CroakSongSite/',mapUrl:urlMap + 'CroakSong', sceneName:'CroakSong',subject:'creativity',review:true,objective:40,demo:false},
		{name:'Tilt Sprout',url:'http://yogome.com/epic/minigames/tiltSite/',mapUrl:urlMap + 'tiltSprout', sceneName:'tilt',subject:'science',review:true,objective:10,demo:false},
		{name:'Culture Icons',url:'http://yogome.com/epic/minigames/cultureSite/',mapUrl:urlMap + 'cultureIcons', sceneName:'culture',subject:'geography',review:true,objective:20,demo:false},
		{name:'Dizzy Boat',url:'http://yogome.com/epic/minigames/dizzySite/',mapUrl:urlMap + 'dizzyBoat', sceneName:'dizzy',subject:'geography',review:true,objective:15,demo:false},
		{name:'Flag Collector',url:'http://yogome.com/epic/minigames/flagCollectorSite/',mapUrl:urlMap + 'flagCollector', sceneName:'flagCollector',subject:'geography',review:true,objective:15,demo:false},
		{name:'Medicatcher',url:'http://yogome.com/epic/minigames/mediSite/',mapUrl:urlMap + 'mediCatcher', sceneName:'medi',subject:'health',review:false,objective:30,demo:false},
        {name:'Wild Snaps',url:'http://yogome.com/epic/minigames/wildSite/',mapUrl:urlMap + 'wildSnaps', sceneName:'wild',subject:'creativity',review:true,objective:15,demo:false},
		{name:'Gemath',url:'http://yogome.com/epic/minigames/gemSite/',mapUrl:urlMap + 'geMath', sceneName:'gem',subject:'math',review:true,objective:15,demo:false},
		{name:'Hackamole',url:'http://yogome.com/epic/minigames/hackSite/',mapUrl:urlMap + 'hackaMole', sceneName:'hack',subject:'coding',review:true,objective:20,demo:false},		
		{name:'Lizart',url:'http://yogome.com/epic/minigames/lizartsite/',mapUrl:urlMap + 'lizart', sceneName:'lizart',subject:'language',review:true,objective:20,demo:false},
		{name:'Snooze Crater',url:'http://yogome.com/epic/minigames/snoozeSite/',mapUrl:urlMap + 'snoozeCrater', sceneName:'snooze',subject:'Sustainability',review:true,objective:10,demo:false},//29
		{name:'Math Feed',url:'http://yogome.com/epic/minigames/feedSite/',mapUrl:urlMap + 'mathFeed', sceneName:'feed',subject:'math',review:false,objective:25,demo:false},//30
		{name:'Galaxy Heroes',url:'http://yogome.com/epic/minigames/galaxySite/',mapUrl:urlMap + 'galaxyHeroes', sceneName:'galaxy',subject:'geography',review:true,objective:20,demo:false},//31
		{name:'Pop Fish',url:'http://yogome.com/epic/minigames/fishSite/',mapUrl:urlMap + 'popFish', sceneName:'fish',subject:'math',review:true,objective:15,demo:false},//32
		{name:'Bouncy Bath',url:'http://yogome.com/epic/minigames/bouncybathsite/',mapUrl:urlMap + 'bouncybath', sceneName:'bouncybath',subject:'health',review:false,objective:3,demo:false},//33
        {name:'Acorn Numbers',url:'http://yogome.com/epic/minigames/acornSite/',mapUrl:urlMap + 'acornNumbers', sceneName:'acorn',subject:'math',review:true,objective:30,demo:true},//34
		{name:'Popsteroids',url:'http://yogome.com/epic/minigames/popSite/',mapUrl:urlMap + 'popSteroids', sceneName:'popScene',subject:'math',review:true,objective:40,demo:false},//35
		{name:'Candy Shapes',url:'http://yogome.com/epic/minigames/candySite/',mapUrl:urlMap + 'candyShapes', sceneName:'candy',subject:'math',review:true,objective:40,demo:false},//36
		{name:'Feather Shelter',url:'http://yogome.com/epic/minigames/featherSite/',mapUrl:urlMap + 'featherShelter', sceneName:'feather',subject:'math',review:false,objective:10,demo:false},//37
		{name:'Math Circus',url:'http://yogome.com/epic/minigames/circusSite/',mapUrl:urlMap + 'mathCircus', sceneName:'circus',subject:'math',review:true,objective:20,demo:false},//38
		{name:'Flight o Clock',url:'http://yogome.com/epic/minigames/flightoclocksite/',mapUrl:urlMap + 'flightoclock', sceneName:'flightoclock',subject:'math',review:true,objective:25,demo:false},//39
		{name:'Clash Critters',url:'http://yogome.com/epic/minigames/clashSite/',mapUrl:urlMap + 'clashCritters', sceneName:'clash',subject:'math',review:true,objective:50,demo:false},//40
		{name:'Math Port',url:'http://yogome.com/epic/minigames/portSite/',mapUrl:urlMap + 'mathPort', sceneName:'port',subject:'math',review:true,objective:30,demo:false},//41

		{name:'Pizza Fraction',url:'http://yogome.com/epic/minigames/pizzafractionsite/',mapUrl:urlMap + 'pizzafraction', sceneName:'pizzafraction',subject:'math',review:true,objective:25,demo:false},//42
		{name:'Hungry Toads',url:'http://yogome.com/epic/minigames/hungrySite/',mapUrl:urlMap + 'hungryToads', sceneName:'hungry',subject:'math',review:true,objective:25,demo:false},//43
		{name:'Sky Tap',url:'http://yogome.com/epic/minigames/skyTapSite/',mapUrl:urlMap + 'skyTap', sceneName:'sky',subject:'math' ,review:true,objective:30,demo:false},//44
		{name:'Evening',url:'http://yogome.com/epic/minigames/eveningSite/',mapUrl:urlMap + 'evening', sceneName:'evening',subject:'math', review:true,objective:40,demo:false},//45
		{name:'Minmax Duel',url:'http://yogome.com/epic/minigames/minmaxduelsite/',mapUrl:urlMap + 'minmaxduel', sceneName:'minmaxduel',subject:'math', review:true,objective:15,demo:false},//46		
		{name:'Math Invader',url:'http://yogome.com/epic/minigames/invaderSite/',mapUrl:urlMap + 'mathInvader', sceneName:'invader',subject:'math', review:true,objective:30,demo:false},//47
        {name:'Locksmath',url:'http://yogome.com/epic/minigames/lockSite/',mapUrl:urlMap + 'locksmath', sceneName:'lock',subject:'math', review:true,objective:50,demo:false},//48
		{name:'Magic Gate',url:'http://yogome.com/epic/minigames/magicSite/',mapUrl:urlMap + 'magicGate', sceneName:'magic',subject:'math', review:true,objective:20,demo:false},//49	
        {name:'Lucky Numbers',url:'http://yogome.com/epic/minigames/luckynumbersite/',mapUrl:urlMap + 'luckynumber', sceneName:'luckynumber',subject:'math', review:true,objective:10,demo:false},//50
        {name:'Robovet',url:'http://yogome.com/epic/minigames/roboSite/',mapUrl:urlMap + 'robotvet', sceneName:'robo',subject:'math', review:true,objective:30,demo:false},//51
		{name:'Math Bomb',url:'http://yogome.com/epic/minigames/bombSite/',mapUrl:urlMap + 'mathBomb', sceneName:'bomb',subject:'math', review:true,objective:20,demo:false},//52
		{name:'UniDream',url:'http://yogome.com/epic/minigames/uniSite/',mapUrl:urlMap + 'uniDream', sceneName:'uni',subject:'math', review:true,objective:20,demo:false},//53
		{name:'Countipede',url:'http://yogome.com/epic/minigames/countipSite/',mapUrl:urlMap + 'countipede', sceneName:'countip',subject:'math', review:true,objective:35,demo:false},//54
        {name:'Toy Figures',url:'http://yogome.com/epic/minigames/toyfigureSite/',mapUrl:urlMap + 'toyfigure', sceneName:'toyfigure',subject:'math', review:true,objective:25,demo:false},//55
		{name:'Jelly Jump',url:'http://yogome.com/epic/minigames/jellySite/',mapUrl:urlMap + 'jellyJump', sceneName:'jelly',subject:'math', review:false,objective:3,demo:false},//56
		{name:'Squat Count',url:'http://yogome.com/epic/minigames/squatSite/',mapUrl:urlMap + 'squatCount', sceneName:'squat',subject:'math', review:true,objective:10,demo:false},//57
		{name:'Baxtion',url:'http://yogome.com/epic/minigames/baxSite/',mapUrl:urlMap + 'baxtion', sceneName:'bax',subject:'math', review:true,objective:10,demo:false},//58
		{name:'Mathgic Hat',url:'http://yogome.com/epic/minigames/hatSite/',mapUrl:urlMap + 'mathgicHat', sceneName:'magic',subject:'math', review:true,objective:25,demo:false},//59
		{name:'Seaquence',url:'http://yogome.com/epic/minigames/seaSite/',mapUrl:urlMap + 'seaquence', sceneName:'seaquence',subject:'math', review:true,objective:30,demo:false},//60
		{name:'Clock Fix',url:'http://yogome.com/epic/minigames/clockfixSite/',mapUrl:urlMap + 'clockfix', sceneName:'clockfix',subject:'math', review:true,objective:20,demo:false},//61
		{name:'Math Engine',url:'http://yogome.com/epic/minigames/engineSite/',mapUrl:urlMap + 'mathEngine', sceneName:'engine',subject:'math', review:true,objective:25,demo:false},//62
		{name:'Astronometric',url:'http://yogome.com/epic/minigames/astronoSite/',mapUrl:urlMap + 'astronoMetric', sceneName:'astrono',subject:'math', review:true,objective:15,demo:false},//63
		{name:'Jumptiply',url:'http://yogome.com/epic/minigames/jumpSite/',mapUrl:urlMap + 'jumptiply', sceneName:'jump',subject:'math', review:true,objective:25,demo:false},//64
		{name:'Swamp Shapes',url:'http://yogome.com/epic/minigames/swampShapeSite/',mapUrl:urlMap + 'swampShape', sceneName:'swampShape',subject:'math', review:true,objective:20,demo:false},//65
		{name:'Duck Count',url:'http://yogome.com/epic/minigames/duckSite/',mapUrl:urlMap + 'duckCount', sceneName:'duck',subject:'math', review:true,objective:10,demo:false},//66
        {name:'Monster Dungeon',url:'http://yogome.com/epic/minigames/monsterDungeonsite/',mapUrl:urlMap + 'monsterDungeon', sceneName:'monsterDungeon',subject:'math', review:true,objective:20,demo:false},//67
		{name:'Nacho Smacho',url:'http://yogome.com/epic/minigames/nachoSite/',mapUrl:urlMap + 'nachoSmacho', sceneName:'nacho',subject:'math', review:true,objective:25,demo:false},//68
		{name:'Stackathon',url:'http://yogome.com/epic/minigames/stackSite/',mapUrl:urlMap + 'stackathon', sceneName:'stack',subject:'math', review:true,objective:30,demo:false},//69
		{name:'Geometry Warp',url:'http://yogome.com/epic/minigames/geometrySite/',mapUrl:urlMap + 'geometryWarp', sceneName:'geometry',subject:'math', review:true,objective:30,demo:false},//70
		{name:'Mathrioska',url:'http://yogome.com/epic/minigames/mathrioskaSite/',mapUrl:urlMap + 'mathrioska', sceneName:'mathrioska',subject:'math', review:true,objective:30,demo:false},//71
        {name:'Aracnumber',url:'http://yogome.com/epic/minigames/aracnumberSite/',mapUrl:urlMap + 'aracnumber', sceneName:'aracnumber',subject:'math', review:true,objective:15,demo:false},//72
		{name:'Dusk Defense',url:'http://yogome.com/epic/minigames/duskSite/',mapUrl:urlMap + 'duskDefense', sceneName:'dusk',subject:'math', review:true,objective:20,demo:false},//73
		{name:'zucaritas',url:'http://yogome.com/epic/minigames/zucaritasSite/',mapUrl:urlMap + 'zucaritas', sceneName:'zucaritas',subject:'geography', review:false,objective:3,demo:false},//74 K
		{name:'Divisubmarine',url:'http://yogome.com/epic/minigames/diviSite/',mapUrl:urlMap + 'diviSubmarine', sceneName:'divisubmarine',subject:'math', review:false,objective:30,demo:false},//75
		{name:'Sushi Towers',url:'http://yogome.com/epic/minigames/sushiSite/',mapUrl:urlMap + 'sushiTowers', sceneName:'sushi',subject:'math', review:true,objective:20,demo:false},//76
		{name:'Float and Count',url:'http://yogome.com/epic/minigames/floatSite/',mapUrl:urlMap + 'floatAndCount', sceneName:'float',subject:'math', review:true,objective:20,demo:false},//77
		{name:'Space Count',url:'http://yogome.com/epic/minigames/spaceCountSite/',mapUrl:urlMap + 'SpaceCount', sceneName:'spaceCount',subject:'math', review:true,objective:15,demo:false},//78
		{name:'Loop Roll',url:'http://yogome.com/epic/minigames/loopSite/',mapUrl:urlMap + 'loopRoll', sceneName:'loop',subject:'math', review:false,objective:3,demo:false},//79 K
		{name:'Melvin Travel',url:'http://yogome.com/epic/minigames/melvinSite/',mapUrl:urlMap + 'melvinTravel', sceneName:'melvin',subject:'geography', review:false,objective:3,demo:false},//80 K
		{name:'Paper Ships',url:'http://yogome.com/epic/minigames/paperSite/',mapUrl:urlMap + 'paperShips', sceneName:'paper',subject:'math', review:true,objective:20,demo:false},//81
		{name:'FrooTemple',url:'http://yogome.com/epic/minigames/frooTempleSite/',mapUrl:urlMap + 'frooTemple', sceneName:'frootemple',subject:'math', review:false,objective:3,demo:false},//82 K
		{name:'Fractiorama',url:'http://yogome.com/epic/minigames/fracSite/',mapUrl:urlMap + 'fractiorama', sceneName:'frac',subject:'math', review:true,objective:20,demo:false},//83
		{name:'Frosty Run',url:'http://yogome.com/epic/minigames/frostySite/',mapUrl:urlMap + 'frostyRun', sceneName:'frosty',subject:'math', review:false,objective:3,demo:false},//84 K
		{name:'Geo Tunnel',url:'http://yogome.com/epic/minigames/geotunnelSite/',mapUrl:urlMap + 'geoTunnel', sceneName:'geotunnel',subject:'math', review:true,objective:15,demo:false},//85
		{name:'Hover Ride',url:'http://yogome.com/epic/minigames/hoverSite/',mapUrl:urlMap + 'hoverRide', sceneName:'hover',subject:'math', review:false,objective:3,demo:false},//86 K
		{name:'Cereal Buffet',url:'http://yogome.com/epic/minigames/cerealSite/',mapUrl:urlMap + 'cerealBuffet', sceneName:'cereal',subject:'math', review:false,objective:3,demo:false},//87 K
		{name:'Froot Math',url:'http://yogome.com/epic/minigames/frootSite/',mapUrl:urlMap + 'frootMath', sceneName:'frootMath',subject:'math', review:false,objective:3,demo:false},//88 K
		{name:'Pirate Pieces',url:'http://yogome.com/epic/minigames/piratePiecesSite/',mapUrl:urlMap + 'piratePieces', sceneName:'piratePieces',subject:'math', review:true,objective:15,demo:false},// 89
		{name:'Triangrid',url:'http://yogome.com/epic/minigames/triangridSite/',mapUrl:urlMap + 'triangrid', sceneName:'triangrid',subject:'math', review:false,objective:20,demo:false},// 90
		{name:'iMagic',url:'http://yogome.com/epic/minigames/iMagicSite/',mapUrl:urlMap + 'iMagic', sceneName:'imagic',subject:'math', review:false,objective:3,demo:false},//91
		{name:'Ms NomNom',url:'http://yogome.com/epic/minigames/msSite/',mapUrl:urlMap + 'msNomNom', sceneName:'ms',subject:'math', review:true,objective:15,demo:false},//92
		{name:'FrutiLluvia',url:'http://yogome.com/epic/minigames/frutiSite/',mapUrl:urlMap + 'frutiLluvia', sceneName:'fruti',subject:'math', review:false,objective:3,demo:false},//93
		{name:'Dr Zombie',url:'http://yogome.com/epic/minigames/drZombieSite/',mapUrl:urlMap + 'drZombie', sceneName:'drzombie',subject:'health', review:true,objective:20,demo:true},//94
		{name:'Wild Dentist',url:'http://yogome.com/epic/minigames/wildDentistSite/',mapUrl:urlMap + 'wildDentist', sceneName:'wildDentist',subject:'health', review:true,objective:25,demo:false},//95
		{name:'Cog Count',url:'http://yogome.com/epic/minigames/cogSite/',mapUrl:urlMap + 'cogCount', sceneName:'cog',subject:'math', review:true,objective:50,demo:false},//96
        {name:'Galactic Pool',url:'http://yogome.com/epic/minigames/galacticSite/',mapUrl:urlMap + 'galacticPool', sceneName:'galactic',subject:'geography', review:true,objective:10,demo:false},//97
        {name:'Oona Says Cook',url:'http://yogome.com/epic/minigames/oonaSite/',mapUrl:urlMap + 'oonaSaysCook', sceneName:'oona',subject:'programming', review:false,objective:15,demo:true},//98
        {name:'River Rescue',url:'http://yogome.com/epic/minigames/riverSite/',mapUrl:urlMap + 'riverRescue', sceneName:'riverRescue',subject:'Sustainability', review:true,objective:5,demo:false},//99
        {name:'River Cleaner',url:'http://yogome.com/epic/minigames/cleanerSite/',mapUrl:urlMap + 'riverCleaner', sceneName:'river',subject:'Sustainability', review:true,objective:10,demo:true},//100
        {name:'Garbage Diving',url:'http://yogome.com/epic/minigames/garbageSite/',mapUrl:urlMap + 'garbageDiving', sceneName:'garbageDiving',subject:'Sustainability', review:true,objective:5,demo:false},//101
        {name:'Space Vaccum',url:'http://yogome.com/epic/minigames/vaccumSite/',mapUrl:urlMap + 'spaceVaccum', sceneName:'spaceVaccum',subject:'Sustainability', review:true,objective:5,demo:false},//102
        {name:'Garbage Mole',url:'http://yogome.com/epic/minigames/gMoleSite/',mapUrl:urlMap + 'garbageMole', sceneName:'mole',subject:'Sustainability', review:true,objective:5,demo:false},//103
        {name:'Elemental Witch',url:'http://yogome.com/epic/minigames/elementalSite/',mapUrl:urlMap + 'elementalWitch', sceneName:'elemental',subject:'Creativity', review:true,objective:15,demo:true},//104
        {name:'Milky Saloon',url:'http://yogome.com/epic/minigames/milkySite/',mapUrl:urlMap + 'milkySaloon', sceneName:'milky',subject:'programming', review:false,objective:3,demo:false},//105
        //{name:'Calendrigon',url:'http://yogome.com/epic/minigames/calendrigonSite/',mapUrl:urlMap + 'calendrigon', sceneName:'calendrigon',subject:'math', review:false,objective:3}//106
        ]
    return games
        
}

function addTime(){
	
	timeCount++
	if(addingTime){
		setTimeout(addTime,1000)
	}
}

yogomeGames.returnData = function(){
	
	addingTime = false
	return {timeReady:timeCount,lives:gameLives}
}

yogomeGames.mixpanelCall = function(callName,gameIndex,lives,model){
	
	var gamesList = yogomeGames.getGames()
	
	var email = "noEmail"
	var playerId = "noPlayerId"
	var hasMap = true
	
	if(model){
		
		email = model.getCredentials().email
		playerId = model.getCredentials().remoteId
	}else if(!model){
		hasMap = false
	}
	
	timeCount = 0
	addingTime = true
	addTime()
		
	console.log('gameIndex sent ' + gameIndex )
	
	gameLives = lives || 1

	mixpanel.track(
		callName,
		{"gameName": gamesList[gameIndex].name,"app":"epicWeb","isMap":hasMap,"email":email,"playerId":playerId}
	);
	
		
}