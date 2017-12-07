var yogomeGames = {}

yogomeGames.getGames = function(){
	var games = [
	
		{name:'Addition Dojo',url:'http://yogome.com/epic/minigames/dojoSite/',sceneName:'dojo',subject:'math',review:true},
        {name:'Space Words',url:'http://yogome.com/epic/minigames/spaceSite/',sceneName:'space',subject:'language',review:true},
        {name:'Math Run',url:'http://yogome.com/epic/minigames/runnerSite/',sceneName:'runneryogome',subject:'math',review:true},
        {name:'Water Morphosis',url:'http://yogome.com/epic/minigames/waterSite/',sceneName:'water',subject:'science',review:true},
		{name:'Ice Cream Numbers',url:'http://yogome.com/epic/minigames/iceSite/',sceneName:'ice',subject:'math',review:true},
		{name:'Magnet Ride',url:'http://yogome.com/epic/minigames/magnetSite/',sceneName:'magnet',subject:'science',review:true},
		{name:'Salad Cards',url:'http://yogome.com/epic/minigames/tapsite/',sceneName:'tapcards',subject:'language',review:false},
		{name:'Sky Language',url:'http://yogome.com/epic/minigames/skySite/',sceneName:'sky',subject:'language',review:true},
		{name:'Flag Runner',url:'http://yogome.com/epic/minigames/flagSite/',sceneName:'flag',subject:'geography',review:true},
		{name:'Rift Land',url:'http://yogome.com/epic/minigames/riftSite/',sceneName:'rift',subject:'coding',review:true},
		{name:'Puzzle Road',url:'http://yogome.com/epic/minigames/puzzleSite/',sceneName:'puzzle',subject:'creativity',review:true},
		{name:'Geo Journey',url:'http://yogome.com/epic/minigames/geoSite/',sceneName:'geoJourney',subject:'geography',review:true},
		{name:'Memonumbers',url:'http://yogome.com/epic/minigames/memoSite/',sceneName:'memo',subject:'math',review:true},
		{name:'Beach Ninja',url:'http://yogome.com/epic/minigames/beachSite/',sceneName:'beach',subject:'math',review:true},
        {name:'Flying Fractions',url:'http://yogome.com/epic/minigames/flyingFractionsSite/',sceneName:'flyingFractions',subject:'math',review:true},
		{name:'Color Attack',url:'http://yogome.com/epic/minigames/colorSite/',sceneName:'color',subject:'creativity',review:true},
		{name:'Nutricanon',url:'http://yogome.com/epic/minigames/nutriSite/',sceneName:'nutri',subject:'health',review:true},
		{name:'Microdefender',url:'http://yogome.com/epic/minigames/microdefendersite/',sceneName:'microdefender',subject:'health',review:true},
		{name:'Healthy Collector',url:'http://yogome.com/epic/minigames/healthySite/',sceneName:'healthyCollector',subject:'health',review:true},
        {name:'Croak Song',url:'http://yogome.com/epic/minigames/CroakSongSite/',sceneName:'CroakSong',subject:'creativity',review:true},
		{name:'Tilt Sprout',url:'http://yogome.com/epic/minigames/tiltSite/',sceneName:'tilt',subject:'science',review:true},
		{name:'Culture Icons',url:'http://yogome.com/epic/minigames/cultureSite/',sceneName:'culture',subject:'geography',review:true},
		{name:'Dizzy Boat',url:'http://yogome.com/epic/minigames/dizzySite/',sceneName:'dizzy',subject:'geography',review:true},
		{name:'Flag Collector',url:'http://yogome.com/epic/minigames/flagCollectorSite/',sceneName:'flagCollector',subject:'geography',review:true},
		{name:'Medicatcher',url:'http://yogome.com/epic/minigames/mediSite/',sceneName:'medi',subject:'health',review:true},
        {name:'Wild Snaps',url:'http://yogome.com/epic/minigames/wildSite/',sceneName:'wild',subject:'creativity',review:true},
		{name:'Gemath',url:'http://yogome.com/epic/minigames/gemSite/',sceneName:'gem',subject:'math',review:true},
		{name:'Hackamole',url:'http://yogome.com/epic/minigames/hackSite/',sceneName:'hack',subject:'coding',review:true},		
		{name:'Lizart',url:'http://yogome.com/epic/minigames/lizartsite/',sceneName:'lizart',subject:'language',review:true},
		{name:'Snooze Crater',url:'http://yogome.com/epic/minigames/snoozeSite/',sceneName:'snooze',subject:'Sustainability',review:true},//29
		{name:'Math Feed',url:'http://yogome.com/epic/minigames/feedSite/',sceneName:'feed',subject:'math',review:true},//30
		{name:'Galaxy Heroes',url:'http://yogome.com/epic/minigames/galaxySite/',sceneName:'galaxy',subject:'geography',review:true},//31
		{name:'Pop Fish',url:'http://yogome.com/epic/minigames/fishSite/',sceneName:'fish',subject:'math',review:true},//32
		{name:'Bouncy Bath',url:'http://yogome.com/epic/minigames/bouncybathsite/',sceneName:'bouncybath',subject:'health',review:false},//33
        {name:'Acorn Numbers',url:'http://yogome.com/epic/minigames/acornSite/',sceneName:'acorn',subject:'math',review:true},//34
		{name:'Popsteroids',url:'http://yogome.com/epic/minigames/popSite/',sceneName:'popScene',subject:'math',review:true},//35
		{name:'Candy Shapes',url:'http://yogome.com/epic/minigames/candySite/',sceneName:'candy',subject:'math',review:true},//36
		{name:'Feather Shelter',url:'http://yogome.com/epic/minigames/featherSite/',sceneName:'feather',subject:'math',review:true},//37
		{name:'Math Circus',url:'http://yogome.com/epic/minigames/circusSite/',sceneName:'circus',subject:'math',review:true},//38
		{name:'Flight o Clock',url:'http://yogome.com/epic/minigames/flightoclocksite/',sceneName:'flightoclock',subject:'math',review:true},//39
		{name:'Clash Critters',url:'http://yogome.com/epic/minigames/clashSite/',sceneName:'clash',subject:'math',review:true},//40
		{name:'Math Port',url:'http://yogome.com/epic/minigames/portSite/',sceneName:'port',subject:'math',review:true},//41

		{name:'Pizza Fraction',url:'http://yogome.com/epic/minigames/pizzafractionsite/',sceneName:'pizzafraction',subject:'math',review:true},//42
		{name:'Hungry Toads',url:'http://yogome.com/epic/minigames/hungrySite/',sceneName:'hungry',subject:'math',review:true},//43
		{name:'Sky Tap',url:'http://yogome.com/epic/minigames/skyTapSite/',sceneName:'sky',subject:'math' ,review:true},//44
		{name:'Evening',url:'http://yogome.com/epic/minigames/eveningSite/',sceneName:'evening',subject:'math', review:true},//45
		{name:'Minmax Duel',url:'http://yogome.com/epic/minigames/minmaxduelsite/',sceneName:'minmaxduel',subject:'math', review:true},//46		
		{name:'Math Invader',url:'http://yogome.com/epic/minigames/invaderSite/',sceneName:'invader',subject:'math', review:true},//47
        {name:'Locksmath',url:'http://yogome.com/epic/minigames/lockSite/',sceneName:'lock',subject:'math', review:true},//48
		{name:'Magic Gate',url:'http://yogome.com/epic/minigames/magicSite/',sceneName:'magic',subject:'math', review:true},//49	
        {name:'Lucky Numbers',url:'http://yogome.com/epic/minigames/luckynumbersite/',sceneName:'luckynumber',subject:'math', review:true},//50
        {name:'Robovet',url:'http://yogome.com/epic/minigames/roboSite/',sceneName:'robo',subject:'math', review:true},//51
		{name:'Math Bomb',url:'http://yogome.com/epic/minigames/bombSite/',sceneName:'bomb',subject:'math', review:true},//52
		{name:'UniDream',url:'http://yogome.com/epic/minigames/uniSite/',sceneName:'uni',subject:'math', review:true},//53
		{name:'Countipede',url:'http://yogome.com/epic/minigames/countipSite/',sceneName:'countip',subject:'math', review:true},//54
        {name:'Toy Figures',url:'http://yogome.com/epic/minigames/toyfigureSite/',sceneName:'toyfigure',subject:'math', review:true},//55
		{name:'Jelly Jump',url:'http://yogome.com/epic/minigames/jellySite/',sceneName:'jelly',subject:'math', review:false},//56
		{name:'Squat Count',url:'http://yogome.com/epic/minigames/squatSite/',sceneName:'squat',subject:'math', review:true},//57
		{name:'Baxtion',url:'http://yogome.com/epic/minigames/baxSite/',sceneName:'bax',subject:'math', review:true},//58
		{name:'Mathgic Hat',url:'http://yogome.com/epic/minigames/hatSite/',sceneName:'magic',subject:'math', review:true},//59
		{name:'Seaquence',url:'http://yogome.com/epic/minigames/seaSite/',sceneName:'seaquence',subject:'math', review:true},//60
		{name:'Clock Fix',url:'http://yogome.com/epic/minigames/clockfixSite/',sceneName:'clockfix',subject:'math', review:true},//61
		{name:'Math Engine',url:'http://yogome.com/epic/minigames/engineSite/',sceneName:'engine',subject:'math', review:true},//62
		{name:'Astronometric',url:'http://yogome.com/epic/minigames/astronoSite/',sceneName:'astrono',subject:'math', review:true},//63
		{name:'Jumptiply',url:'http://yogome.com/epic/minigames/jumpSite/',sceneName:'jump',subject:'math', review:true},//64
		{name:'Swamp Shapes',url:'http://yogome.com/epic/minigames/swampShapeSite/',sceneName:'swampShape',subject:'math', review:true},//65
		{name:'Duck Count',url:'http://yogome.com/epic/minigames/duckSite/',sceneName:'duck',subject:'math', review:true},//66
        {name:'Monster Dungeon',url:'http://yogome.com/epic/minigames/monsterDungeonsite/',sceneName:'monsterDungeon',subject:'math', review:true},//67
		{name:'Nacho Smacho',url:'http://yogome.com/epic/minigames/nachoSite/',sceneName:'nacho',subject:'math', review:true},//68
		{name:'Stackathon',url:'http://yogome.com/epic/minigames/stackSite/',sceneName:'stack',subject:'math', review:true},//69
		{name:'Geometry Warp',url:'http://yogome.com/epic/minigames/geometrySite/',sceneName:'geometry',subject:'math', review:true},//70
		{name:'Mathrioska',url:'http://yogome.com/epic/minigames/mathrioskaSite/',sceneName:'mathrioska',subject:'math', review:true},//71
        {name:'Aracnumber',url:'http://yogome.com/epic/minigames/aracnumberSite/',sceneName:'aracnumber',subject:'math', review:true},//72
		{name:'Dusk Defense',url:'http://yogome.com/epic/minigames/duskSite/',sceneName:'dusk',subject:'math', review:true},//73
		{name:'zucaritas',url:'http://yogome.com/epic/minigames/zucaritasSite/',sceneName:'zucaritas',subject:'geography', review:false},//74 K
		{name:'Divisubmarine',url:'http://yogome.com/epic/minigames/diviSite/',sceneName:'divisubmarine',subject:'math', review:true},//75
		{name:'Sushi Towers',url:'http://yogome.com/epic/minigames/sushiSite/',sceneName:'sushi',subject:'math', review:true},//76
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
		{name:'Ms NomNom',url:'http://yogome.com/epic/minigames/msSite/',sceneName:'ms',subject:'math', review:true},//92
		{name:'FrutiLluvia',url:'http://yogome.com/epic/minigames/frutiSite/',sceneName:'fruti',subject:'math', review:false},//93
		{name:'Dr Zombie',url:'http://yogome.com/epic/minigames/drZombieSite/',sceneName:'drzombie',subject:'health', review:true},//94
		{name:'Wild Dentist',url:'http://yogome.com/epic/minigames/wildDentistSite/',sceneName:'wildDentist',subject:'health', review:false},//95
		{name:'Cog Count',url:'http://yogome.com/epic/minigames/cogSite/',sceneName:'cog',subject:'math', review:true},//96
        {name:'Galactic Pool',url:'http://yogome.com/epic/minigames/galacticSite/',sceneName:'galactic',subject:'geography', review:false},//97
        {name:'Oona Says Cook',url:'http://yogome.com/epic/minigames/oonaSite/',sceneName:'oona',subject:'programming', review:false},//98
        {name:'River Rescue',url:'http://yogome.com/epic/minigames/riverSite/',sceneName:'riverRescue',subject:'Sustainability', review:false},//99
        {name:'River Cleaner',url:'http://yogome.com/epic/minigames/cleanerSite/',sceneName:'river',subject:'Sustainability', review:false},//100
        {name:'Garbage Diving',url:'http://yogome.com/epic/minigames/garbageSite/',sceneName:'garbageDiving',subject:'Sustainability', review:false},//101
        {name:'Space Vaccum',url:'http://yogome.com/epic/minigames/vaccumSite/',sceneName:'spaceVaccum',subject:'Sustainability', review:false},//102
        {name:'Garbage Mole',url:'http://yogome.com/epic/minigames/gMoleSite/',sceneName:'mole',subject:'Sustainability', review:false},//103
        {name:'Elemental Witch',url:'http://yogome.com/epic/minigames/elementalSite/',sceneName:'elemental',subject:'Creativity', review:false},//104
        {name:'Milky Saloon',url:'http://yogome.com/epic/minigames/milkySite/',sceneName:'milky',subject:'programming', review:false}//105
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