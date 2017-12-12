var yogomeGames = {}

yogomeGames.getGames = function(){
	var games = [
	
		{name:'Addition Dojo',url:'http://yogome.com/epic/minigames/dojoSite/',sceneName:'dojo',subject:'math',review:true,objective:15,demo:false},
        {name:'Space Words',url:'http://yogome.com/epic/minigames/spaceSite/',sceneName:'space',subject:'language',review:true,objective:20,demo:false},
        {name:'Math Run',url:'http://yogome.com/epic/minigames/runnerSite/',sceneName:'runneryogome',subject:'math',review:true,objective:20,demo:true},
        {name:'Water Morphosis',url:'http://yogome.com/epic/minigames/waterSite/',sceneName:'water',subject:'science',review:true,objective:40,demo:false},
		{name:'Ice Cream Numbers',url:'http://yogome.com/epic/minigames/iceSite/',sceneName:'ice',subject:'math',review:false,objective:10,demo:false},
		{name:'Magnet Ride',url:'http://yogome.com/epic/minigames/magnetSite/',sceneName:'magnet',subject:'science',review:true,objective:30,demo:false},
		{name:'Salad Cards',url:'http://yogome.com/epic/minigames/tapsite/',sceneName:'tapcards',subject:'language',review:false,objective:30,demo:false},
		{name:'Sky Language',url:'http://yogome.com/epic/minigames/skySite/',sceneName:'sky',subject:'language',review:true,objective:15,demo:false},
		{name:'Flag Runner',url:'http://yogome.com/epic/minigames/flagSite/',sceneName:'flag',subject:'geography',review:true,objective:15,demo:false},
		{name:'Rift Land',url:'http://yogome.com/epic/minigames/riftSite/',sceneName:'rift',subject:'coding',review:true,objective:20,demo:false},
		{name:'Puzzle Road',url:'http://yogome.com/epic/minigames/puzzleSite/',sceneName:'puzzle',subject:'creativity',review:true,objective:25,demo:false},
		{name:'Geo Journey',url:'http://yogome.com/epic/minigames/geoSite/',sceneName:'geoJourney',subject:'geography',review:false,objective:20,demo:false},
		{name:'Memonumbers',url:'http://yogome.com/epic/minigames/memoSite/',sceneName:'memo',subject:'math',review:true,objective:40,demo:false},
		{name:'Beach Ninja',url:'http://yogome.com/epic/minigames/beachSite/',sceneName:'beach',subject:'math',review:true,objective:15,demo:false},
        {name:'Flying Fractions',url:'http://yogome.com/epic/minigames/flyingFractionsSite/',sceneName:'flyingFractions',subject:'math',review:true,objective:20,demo:false},
		{name:'Color Attack',url:'http://yogome.com/epic/minigames/colorSite/',sceneName:'color',subject:'creativity',review:true,objective:15,demo:false},
		{name:'Nutricanon',url:'http://yogome.com/epic/minigames/nutriSite/',sceneName:'nutri',subject:'health',review:true,objective:20,demo:false},
		{name:'Microdefender',url:'http://yogome.com/epic/minigames/microdefendersite/',sceneName:'microdefender',subject:'health',review:true,objective:30,demo:false},
		{name:'Healthy Collector',url:'http://yogome.com/epic/minigames/healthySite/',sceneName:'healthyCollector',subject:'health',review:false,objective:30,demo:false},
        {name:'Croak Song',url:'http://yogome.com/epic/minigames/CroakSongSite/',sceneName:'CroakSong',subject:'creativity',review:true,objective:40,demo:false},
		{name:'Tilt Sprout',url:'http://yogome.com/epic/minigames/tiltSite/',sceneName:'tilt',subject:'science',review:true,objective:10,demo:false},
		{name:'Culture Icons',url:'http://yogome.com/epic/minigames/cultureSite/',sceneName:'culture',subject:'geography',review:true,objective:20,demo:false},
		{name:'Dizzy Boat',url:'http://yogome.com/epic/minigames/dizzySite/',sceneName:'dizzy',subject:'geography',review:true,objective:15,demo:false},
		{name:'Flag Collector',url:'http://yogome.com/epic/minigames/flagCollectorSite/',sceneName:'flagCollector',subject:'geography',review:true,objective:15,demo:false},
		{name:'Medicatcher',url:'http://yogome.com/epic/minigames/mediSite/',sceneName:'medi',subject:'health',review:false,objective:30,demo:false},
        {name:'Wild Snaps',url:'http://yogome.com/epic/minigames/wildSite/',sceneName:'wild',subject:'creativity',review:true,objective:15,demo:false},
		{name:'Gemath',url:'http://yogome.com/epic/minigames/gemSite/',sceneName:'gem',subject:'math',review:true,objective:15,demo:false},
		{name:'Hackamole',url:'http://yogome.com/epic/minigames/hackSite/',sceneName:'hack',subject:'coding',review:true,objective:20,demo:false},		
		{name:'Lizart',url:'http://yogome.com/epic/minigames/lizartsite/',sceneName:'lizart',subject:'language',review:true,objective:20,demo:false},
		{name:'Snooze Crater',url:'http://yogome.com/epic/minigames/snoozeSite/',sceneName:'snooze',subject:'Sustainability',review:true,objective:10,demo:false},//29
		{name:'Math Feed',url:'http://yogome.com/epic/minigames/feedSite/',sceneName:'feed',subject:'math',review:false,objective:25,demo:false},//30
		{name:'Galaxy Heroes',url:'http://yogome.com/epic/minigames/galaxySite/',sceneName:'galaxy',subject:'geography',review:true,objective:20,demo:false},//31
		{name:'Pop Fish',url:'http://yogome.com/epic/minigames/fishSite/',sceneName:'fish',subject:'math',review:true,objective:15,demo:false},//32
		{name:'Bouncy Bath',url:'http://yogome.com/epic/minigames/bouncybathsite/',sceneName:'bouncybath',subject:'health',review:false,objective:3,demo:false},//33
        {name:'Acorn Numbers',url:'http://yogome.com/epic/minigames/acornSite/',sceneName:'acorn',subject:'math',review:true,objective:30,demo:true},//34
		{name:'Popsteroids',url:'http://yogome.com/epic/minigames/popSite/',sceneName:'popScene',subject:'math',review:true,objective:40,demo:false},//35
		{name:'Candy Shapes',url:'http://yogome.com/epic/minigames/candySite/',sceneName:'candy',subject:'math',review:true,objective:40,demo:false},//36
		{name:'Feather Shelter',url:'http://yogome.com/epic/minigames/featherSite/',sceneName:'feather',subject:'math',review:false,objective:10,demo:false},//37
		{name:'Math Circus',url:'http://yogome.com/epic/minigames/circusSite/',sceneName:'circus',subject:'math',review:true,objective:20,demo:false},//38
		{name:'Flight o Clock',url:'http://yogome.com/epic/minigames/flightoclocksite/',sceneName:'flightoclock',subject:'math',review:true,objective:25,demo:false},//39
		{name:'Clash Critters',url:'http://yogome.com/epic/minigames/clashSite/',sceneName:'clash',subject:'math',review:true,objective:50,demo:false},//40
		{name:'Math Port',url:'http://yogome.com/epic/minigames/portSite/',sceneName:'port',subject:'math',review:true,objective:30,demo:false},//41

		{name:'Pizza Fraction',url:'http://yogome.com/epic/minigames/pizzafractionsite/',sceneName:'pizzafraction',subject:'math',review:true,objective:25,demo:false},//42
		{name:'Hungry Toads',url:'http://yogome.com/epic/minigames/hungrySite/',sceneName:'hungry',subject:'math',review:true,objective:25,demo:false},//43
		{name:'Sky Tap',url:'http://yogome.com/epic/minigames/skyTapSite/',sceneName:'sky',subject:'math' ,review:true,objective:30,demo:false},//44
		{name:'Evening',url:'http://yogome.com/epic/minigames/eveningSite/',sceneName:'evening',subject:'math', review:true,objective:40,demo:false},//45
		{name:'Minmax Duel',url:'http://yogome.com/epic/minigames/minmaxduelsite/',sceneName:'minmaxduel',subject:'math', review:true,objective:15,demo:false},//46		
		{name:'Math Invader',url:'http://yogome.com/epic/minigames/invaderSite/',sceneName:'invader',subject:'math', review:true,objective:30,demo:false},//47
        {name:'Locksmath',url:'http://yogome.com/epic/minigames/lockSite/',sceneName:'lock',subject:'math', review:true,objective:50,demo:false},//48
		{name:'Magic Gate',url:'http://yogome.com/epic/minigames/magicSite/',sceneName:'magic',subject:'math', review:true,objective:20,demo:false},//49	
        {name:'Lucky Numbers',url:'http://yogome.com/epic/minigames/luckynumbersite/',sceneName:'luckynumber',subject:'math', review:true,objective:10,demo:false},//50
        {name:'Robovet',url:'http://yogome.com/epic/minigames/roboSite/',sceneName:'robo',subject:'math', review:true,objective:30,demo:false},//51
		{name:'Math Bomb',url:'http://yogome.com/epic/minigames/bombSite/',sceneName:'bomb',subject:'math', review:true,objective:20,demo:false},//52
		{name:'UniDream',url:'http://yogome.com/epic/minigames/uniSite/',sceneName:'uni',subject:'math', review:true,objective:20,demo:false},//53
		{name:'Countipede',url:'http://yogome.com/epic/minigames/countipSite/',sceneName:'countip',subject:'math', review:true,objective:35,demo:false},//54
        {name:'Toy Figures',url:'http://yogome.com/epic/minigames/toyfigureSite/',sceneName:'toyfigure',subject:'math', review:true,objective:25,demo:false},//55
		{name:'Jelly Jump',url:'http://yogome.com/epic/minigames/jellySite/',sceneName:'jelly',subject:'math', review:false,objective:3,demo:false},//56
		{name:'Squat Count',url:'http://yogome.com/epic/minigames/squatSite/',sceneName:'squat',subject:'math', review:true,objective:10,demo:false},//57
		{name:'Baxtion',url:'http://yogome.com/epic/minigames/baxSite/',sceneName:'bax',subject:'math', review:true,objective:10,demo:false},//58
		{name:'Mathgic Hat',url:'http://yogome.com/epic/minigames/hatSite/',sceneName:'magic',subject:'math', review:true,objective:25,demo:false},//59
		{name:'Seaquence',url:'http://yogome.com/epic/minigames/seaSite/',sceneName:'seaquence',subject:'math', review:true,objective:30,demo:false},//60
		{name:'Clock Fix',url:'http://yogome.com/epic/minigames/clockfixSite/',sceneName:'clockfix',subject:'math', review:true,objective:20,demo:false},//61
		{name:'Math Engine',url:'http://yogome.com/epic/minigames/engineSite/',sceneName:'engine',subject:'math', review:true,objective:25,demo:false},//62
		{name:'Astronometric',url:'http://yogome.com/epic/minigames/astronoSite/',sceneName:'astrono',subject:'math', review:true,objective:15,demo:false},//63
		{name:'Jumptiply',url:'http://yogome.com/epic/minigames/jumpSite/',sceneName:'jump',subject:'math', review:true,objective:25,demo:false},//64
		{name:'Swamp Shapes',url:'http://yogome.com/epic/minigames/swampShapeSite/',sceneName:'swampShape',subject:'math', review:true,objective:20,demo:false},//65
		{name:'Duck Count',url:'http://yogome.com/epic/minigames/duckSite/',sceneName:'duck',subject:'math', review:true,objective:10,demo:false},//66
        {name:'Monster Dungeon',url:'http://yogome.com/epic/minigames/monsterDungeonsite/',sceneName:'monsterDungeon',subject:'math', review:true,objective:20,demo:false},//67
		{name:'Nacho Smacho',url:'http://yogome.com/epic/minigames/nachoSite/',sceneName:'nacho',subject:'math', review:true,objective:25,demo:false},//68
		{name:'Stackathon',url:'http://yogome.com/epic/minigames/stackSite/',sceneName:'stack',subject:'math', review:true,objective:30,demo:false},//69
		{name:'Geometry Warp',url:'http://yogome.com/epic/minigames/geometrySite/',sceneName:'geometry',subject:'math', review:true,objective:30,demo:false},//70
		{name:'Mathrioska',url:'http://yogome.com/epic/minigames/mathrioskaSite/',sceneName:'mathrioska',subject:'math', review:true,objective:30,demo:false},//71
        {name:'Aracnumber',url:'http://yogome.com/epic/minigames/aracnumberSite/',sceneName:'aracnumber',subject:'math', review:true,objective:15,demo:false},//72
		{name:'Dusk Defense',url:'http://yogome.com/epic/minigames/duskSite/',sceneName:'dusk',subject:'math', review:true,objective:20,demo:false},//73
		{name:'zucaritas',url:'http://yogome.com/epic/minigames/zucaritasSite/',sceneName:'zucaritas',subject:'geography', review:false,objective:3,demo:false},//74 K
		{name:'Divisubmarine',url:'http://yogome.com/epic/minigames/diviSite/',sceneName:'divisubmarine',subject:'math', review:false,objective:30,demo:false},//75
		{name:'Sushi Towers',url:'http://yogome.com/epic/minigames/sushiSite/',sceneName:'sushi',subject:'math', review:true,objective:20,demo:false},//76
		{name:'Float and Count',url:'http://yogome.com/epic/minigames/floatSite/',sceneName:'float',subject:'math', review:true,objective:20,demo:false},//77
		{name:'Space Count',url:'http://yogome.com/epic/minigames/spaceCountSite/',sceneName:'spaceCount',subject:'math', review:true,objective:15,demo:false},//78
		{name:'Loop Roll',url:'http://yogome.com/epic/minigames/loopSite/',sceneName:'loop',subject:'math', review:false,objective:3,demo:false},//79 K
		{name:'Melvin Travel',url:'http://yogome.com/epic/minigames/melvinSite/',sceneName:'melvin',subject:'geography', review:false,objective:3,demo:false},//80 K
		{name:'Paper Ships',url:'http://yogome.com/epic/minigames/paperSite/',sceneName:'paper',subject:'math', review:true,objective:20,demo:false},//81
		{name:'FrooTemple',url:'http://yogome.com/epic/minigames/frooTempleSite/',sceneName:'frootemple',subject:'math', review:false,objective:3,demo:false},//82 K
		{name:'Fractiorama',url:'http://yogome.com/epic/minigames/fracSite/',sceneName:'frac',subject:'math', review:true,objective:20,demo:false},//83
		{name:'Frosty Run',url:'http://yogome.com/epic/minigames/frostySite/',sceneName:'frosty',subject:'math', review:false,objective:3,demo:false},//84 K
		{name:'Geo Tunnel',url:'http://yogome.com/epic/minigames/geotunnelSite/',sceneName:'geotunnel',subject:'math', review:true,objective:15,demo:false},//85
		{name:'Hover Ride',url:'http://yogome.com/epic/minigames/hoverSite/',sceneName:'hover',subject:'math', review:false,objective:3,demo:false},//86 K
		{name:'Cereal Buffet',url:'http://yogome.com/epic/minigames/cerealSite/',sceneName:'cereal',subject:'math', review:false,objective:3,demo:false},//87 K
		{name:'Froot Math',url:'http://yogome.com/epic/minigames/frootSite/',sceneName:'frootMath',subject:'math', review:false,objective:3,demo:false},//88 K
		{name:'Pirate Pieces',url:'http://yogome.com/epic/minigames/piratePiecesSite/',sceneName:'piratePieces',subject:'math', review:true,objective:15,demo:false},// 89
		{name:'Triangrid',url:'http://yogome.com/epic/minigames/triangridSite/',sceneName:'triangrid',subject:'math', review:false,objective:20,demo:false},// 90
		{name:'iMagic',url:'http://yogome.com/epic/minigames/iMagicSite/',sceneName:'imagic',subject:'math', review:false,objective:3,demo:false},//91
		{name:'Ms NomNom',url:'http://yogome.com/epic/minigames/msSite/',sceneName:'ms',subject:'math', review:true,objective:15,demo:false},//92
		{name:'FrutiLluvia',url:'http://yogome.com/epic/minigames/frutiSite/',sceneName:'fruti',subject:'math', review:false,objective:3,demo:false},//93
		{name:'Dr Zombie',url:'http://yogome.com/epic/minigames/drZombieSite/',sceneName:'drzombie',subject:'health', review:true,objective:20,demo:true},//94
		{name:'Wild Dentist',url:'http://yogome.com/epic/minigames/wildDentistSite/',sceneName:'wildDentist',subject:'health', review:true,objective:25,demo:false},//95
		{name:'Cog Count',url:'http://yogome.com/epic/minigames/cogSite/',sceneName:'cog',subject:'math', review:true,objective:50,demo:false},//96
        {name:'Galactic Pool',url:'http://yogome.com/epic/minigames/galacticSite/',sceneName:'galactic',subject:'geography', review:true,objective:10,demo:false},//97
        {name:'Oona Says Cook',url:'http://yogome.com/epic/minigames/oonaSite/',sceneName:'oona',subject:'programming', review:false,objective:15,demo:true},//98
        {name:'River Rescue',url:'http://yogome.com/epic/minigames/riverSite/',sceneName:'riverRescue',subject:'Sustainability', review:true,objective:5,demo:false},//99
        {name:'River Cleaner',url:'http://yogome.com/epic/minigames/cleanerSite/',sceneName:'river',subject:'Sustainability', review:true,objective:10,demo:true},//100
        {name:'Garbage Diving',url:'http://yogome.com/epic/minigames/garbageSite/',sceneName:'garbageDiving',subject:'Sustainability', review:true,objective:5,demo:false},//101
        {name:'Space Vaccum',url:'http://yogome.com/epic/minigames/vaccumSite/',sceneName:'spaceVaccum',subject:'Sustainability', review:true,objective:5,demo:false},//102
        {name:'Garbage Mole',url:'http://yogome.com/epic/minigames/gMoleSite/',sceneName:'mole',subject:'Sustainability', review:true,objective:5,demo:false},//103
        {name:'Elemental Witch',url:'http://yogome.com/epic/minigames/elementalSite/',sceneName:'elemental',subject:'Creativity', review:true,objective:15,demo:true},//104
        {name:'Milky Saloon',url:'http://yogome.com/epic/minigames/milkySite/',sceneName:'milky',subject:'programming', review:false,objective:3,demo:false},//105
        //{name:'Calendrigon',url:'http://yogome.com/epic/minigames/calendrigonSite/',sceneName:'calendrigon',subject:'math', review:false,objective:3}//106
        ]
    return games
        
}

yogomeGames.mixpanelCall = function(callName,gameIndex){
	
	var gamesList = yogomeGames.getGames()
		
	console.log('gameIndex sent ' + gameIndex )

	mixpanel.track(
		callName,
		{"gameName": gamesList[gameIndex].name,}
	);
	
		
}