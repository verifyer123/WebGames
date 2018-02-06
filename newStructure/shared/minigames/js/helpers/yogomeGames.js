var yogomeGames = function () {
	var gameLives = 0
	var timeCount = 0
	var addingTime = true
	var yogoUrl = 'epicweb/minigames/'
	var urlMap = 'epicSite/#/minigames/'
	var relativeUrl = "../"

	function getGames(pathTag){
		var urlSet
		if(pathTag === "absolute"){
			urlSet = yogoUrl
		}else
			urlSet = relativeUrl

		var games = [

			{name:'Addition Dojo',url:urlSet + 'additiondojo/',mapUrl:urlMap + 'AdditionDojo', sceneName:'dojo',subject:'math',review:false,objective:15,demo:false},
			{name:'Space Words',url:urlSet + 'spaceWords/',mapUrl:urlMap + 'spaceWords', sceneName:'space',subject:'language',review:true,objective:20,demo:false},
			{name:'Math Run',url:urlSet + 'runneryogome/',mapUrl:urlMap + 'runneryogome', sceneName:'runneryogome',subject:'math',review:true,objective:20,demo:true},
			{name:'Water Morphosis',url:urlSet + 'waterMorph/',mapUrl:urlMap + 'waterMorph', sceneName:'water',subject:'science',review:false,objective:40,demo:false},
			{name:'Ice Cream Numbers',url:urlSet + 'numberIce/',mapUrl:urlMap + 'numberIce', sceneName:'ice',subject:'math',review:false,objective:10,demo:false},
			{name:'Magnet Ride',url:urlSet + 'magnetRide/',mapUrl:urlMap + 'magnetRide', sceneName:'magnet',subject:'science',review:true,objective:30,demo:false},
			{name:'Salad Cards',url:urlSet + 'tapcards/',mapUrl:urlMap + 'tapcards', sceneName:'tapcards',subject:'language',review:false,objective:30,demo:false},
			{name:'Sky Language',url:urlSet + 'skyLanguage/',mapUrl:urlMap + 'skyLanguage', sceneName:'sky',subject:'language',review:true,objective:15,demo:false},
			{name:'Flag Runner',url:urlSet + 'flagRunner/',mapUrl:urlMap + 'flagRunner', sceneName:'flag',subject:'geography',review:true,objective:15,demo:false},
			{name:'Rift Land',url:urlSet + 'riftLand/',mapUrl:urlMap + 'riftLand', sceneName:'rift',subject:'coding',review:true,objective:20,demo:false},
			{name:'Puzzle Road',url:urlSet + 'puzzleRoad/',mapUrl:urlMap + 'puzzleRoad', sceneName:'puzzle',subject:'creativity',review:true,objective:25,demo:false},
			{name:'Geo Journey',url:urlSet + 'geoJourney/',mapUrl:urlMap + 'geoJourney', sceneName:'geoJourney',subject:'geography',review:false,objective:20,demo:false},
			{name:'Memonumbers',url:urlSet + 'memoNumbers/',mapUrl:urlMap + 'memoNumbers', sceneName:'memo',subject:'math',review:true,objective:40,demo:false},
			{name:'Beach Ninja',url:urlSet + 'beachNinja/',mapUrl:urlMap + 'beachNinja', sceneName:'beach',subject:'math',review:true,objective:15,demo:false},
			{name:'Flying Fractions',url:urlSet + 'flyingFractions/',mapUrl:urlMap + 'flyingFractions', sceneName:'flyingFractions',subject:'math',review:true,objective:20,demo:false},
			{name:'Color Attack',url:urlSet + 'colorAttack/',mapUrl:urlMap + 'colorAttack', sceneName:'color',subject:'creativity',review:true,objective:15,demo:false},
			{name:'Nutricanon',url:urlSet + 'nutriCanon/',mapUrl:urlMap + 'nutriCanon', sceneName:'nutri',subject:'health',review:true,objective:20,demo:false},
			{name:'Microdefender',url:urlSet + 'microdefender/',mapUrl:urlMap + 'microdefender', sceneName:'microdefender',subject:'health',review:true,objective:30,demo:false},
			{name:'Healthy Collector',url:urlSet + 'healthyCollector/',mapUrl:urlMap + 'healthyCollector', sceneName:'healthyCollector',subject:'health',review:false,objective:30,demo:false},
			{name:'Croak Song',url:urlSet + 'CroakSong/',mapUrl:urlMap + 'CroakSong', sceneName:'CroakSong',subject:'creativity',review:true,objective:40,demo:false},
			{name:'Tilt Sprout',url:urlSet + 'tiltSprout/',mapUrl:urlMap + 'tiltSprout', sceneName:'tilt',subject:'science',review:true,objective:10,demo:false},
			{name:'Culture Icons',url:urlSet + 'cultureIcons/',mapUrl:urlMap + 'cultureIcons', sceneName:'culture',subject:'geography',review:true,objective:20,demo:false},
			{name:'Dizzy Boat',url:urlSet + 'dizzyBoat/',mapUrl:urlMap + 'dizzyBoat', sceneName:'dizzy',subject:'geography',review:true,objective:15,demo:false},
			{name:'Flag Collector',url:urlSet + 'flagCollector/',mapUrl:urlMap + 'flagCollector', sceneName:'flagCollector',subject:'geography',review:true,objective:15,demo:false},
			{name:'Medicatcher',url:urlSet + 'mediCatcher/',mapUrl:urlMap + 'mediCatcher', sceneName:'medi',subject:'health',review:false,objective:30,demo:false},
			{name:'Wild Snaps',url:urlSet + 'wildSnaps/',mapUrl:urlMap + 'wildSnaps', sceneName:'wild',subject:'creativity',review:true,objective:15,demo:false},
			{name:'Gemath',url:urlSet + 'geMath/',mapUrl:urlMap + 'geMath', sceneName:'gem',subject:'math',review:true,objective:15,demo:false},
			{name:'Hackamole',url:urlSet + 'hackaMole/',mapUrl:urlMap + 'hackaMole', sceneName:'hack',subject:'coding',review:true,objective:20,demo:false},
			{name:'Lizart',url:urlSet + 'lizart/',mapUrl:urlMap + 'lizart', sceneName:'lizart',subject:'language',review:true,objective:20,demo:false},
			{name:'Snooze Crater',url:urlSet + 'snoozeCrater/',mapUrl:urlMap + 'snoozeCrater', sceneName:'snooze',subject:'sustainability',review:true,objective:10,demo:false},//29
			{name:'Math Feed',url:urlSet + 'mathFeed/',mapUrl:urlMap + 'mathFeed', sceneName:'feed',subject:'math',review:false,objective:25,demo:false},//30
			{name:'Galaxy Heroes',url:urlSet + 'galaxyHeroes/',mapUrl:urlMap + 'galaxyHeroes', sceneName:'galaxy',subject:'geography',review:true,objective:20,demo:false},//31
			{name:'Pop Fish',url:urlSet + 'popFish/',mapUrl:urlMap + 'popFish', sceneName:'fish',subject:'math',review:true,objective:15,demo:false},//32
			{name:'Bouncy Bath',url:urlSet + 'bouncybath/',mapUrl:urlMap + 'bouncybath', sceneName:'bouncybath',subject:'health',review:false,objective:3,demo:false},//33
			{name:'Acorn Numbers',url:urlSet + 'acornNumbers/',mapUrl:urlMap + 'acornNumbers', sceneName:'acorn',subject:'math',review:true,objective:30,demo:true},//34
			{name:'Popsteroids',url:urlSet + 'popSteroids/',mapUrl:urlMap + 'popSteroids', sceneName:'popScene',subject:'math',review:true,objective:40,demo:false},//35
			{name:'Candy Shapes',url:urlSet + 'candyShapes/',mapUrl:urlMap + 'candyShapes', sceneName:'candy',subject:'math',review:true,objective:40,demo:false},//36
			{name:'Feather Shelter',url:urlSet + 'featherShelter/',mapUrl:urlMap + 'featherShelter', sceneName:'feather',subject:'math',review:false,objective:10,demo:false},//37
			{name:'Math Circus',url:urlSet + 'mathCircus/',mapUrl:urlMap + 'mathCircus', sceneName:'circus',subject:'math',review:true,objective:20,demo:false},//38
			{name:'Flight o Clock',url:urlSet + 'flightoclock/',mapUrl:urlMap + 'flightoclock', sceneName:'flightoclock',subject:'math',review:true,objective:25,demo:false},//39
			{name:'Clash Critters',url:urlSet + 'clashCritters/',mapUrl:urlMap + 'clashCritters', sceneName:'clash',subject:'math',review:true,objective:50,demo:false},//40
			{name:'Math Port',url:urlSet + 'mathPort/',mapUrl:urlMap + 'mathPort', sceneName:'port',subject:'math',review:true,objective:30,demo:false},//41

			{name:'Pizza Fraction',url:urlSet + 'pizzafraction/',mapUrl:urlMap + 'pizzafraction', sceneName:'pizzafraction',subject:'math',review:true,objective:25,demo:false},//42
			{name:'Hungry Toads',url:urlSet + 'hungryToads/',mapUrl:urlMap + 'hungryToads', sceneName:'hungry',subject:'math',review:true,objective:25,demo:false},//43
			{name:'Sky Tap',url:urlSet + 'skyTap/',mapUrl:urlMap + 'skyTap', sceneName:'sky',subject:'math' ,review:true,objective:30,demo:false},//44
			{name:'Evening',url:urlSet + 'evening/',mapUrl:urlMap + 'evening', sceneName:'evening',subject:'math', review:true,objective:40,demo:false},//45
			{name:'Minmax Duel',url:urlSet + 'minmaxduel/',mapUrl:urlMap + 'minmaxduel', sceneName:'minmaxduel',subject:'math', review:true,objective:15,demo:false},//46
			{name:'Math Invader',url:urlSet + 'mathInvader/',mapUrl:urlMap + 'mathInvader', sceneName:'invader',subject:'math', review:true,objective:30,demo:false},//47
			{name:'Locksmath',url:urlSet + 'locksmath/',mapUrl:urlMap + 'locksmath', sceneName:'lock',subject:'math', review:true,objective:50,demo:false},//48
			{name:'Magic Gate',url:urlSet + 'magicGate/',mapUrl:urlMap + 'magicGate', sceneName:'magicGate',subject:'math', review:true,objective:20,demo:false},//49
			{name:'Lucky Numbers',url:urlSet + 'luckynumber/',mapUrl:urlMap + 'luckynumber', sceneName:'luckynumber',subject:'math', review:true,objective:10,demo:false},//50
			{name:'Robovet',url:urlSet + 'robovet/',mapUrl:urlMap + 'robovet', sceneName:'robo',subject:'math', review:true,objective:30,demo:false},//51
			{name:'Math Bomb',url:urlSet + 'mathBomb/',mapUrl:urlMap + 'mathBomb', sceneName:'bomb',subject:'math', review:true,objective:20,demo:false},//52
			{name:'UniDream',url:urlSet + 'uniDream/',mapUrl:urlMap + 'uniDream', sceneName:'uni',subject:'math', review:true,objective:20,demo:false},//53
			{name:'Countipede',url:urlSet + 'countipede/',mapUrl:urlMap + 'countipede', sceneName:'countip',subject:'math', review:true,objective:35,demo:false},//54
			{name:'Toy Figures',url:urlSet + 'toyfigure/',mapUrl:urlMap + 'toyfigure', sceneName:'toyfigure',subject:'math', review:true,objective:25,demo:false},//55
			{name:'Jelly Jump',url:urlSet + 'jellyJump/',mapUrl:urlMap + 'jellyJump', sceneName:'jelly',subject:'math', review:false,objective:3,demo:false},//56
			{name:'Squat Count',url:urlSet + 'squatCount/',mapUrl:urlMap + 'squatCount', sceneName:'squat',subject:'math', review:true,objective:10,demo:false},//57
			{name:'Baxtion',url:urlSet + 'baxtion/',mapUrl:urlMap + 'baxtion', sceneName:'bax',subject:'math', review:true,objective:10,demo:false},//58
			{name:'Mathgic Hat',url:urlSet + 'mathgicHat/',mapUrl:urlMap + 'mathgicHat', sceneName:'magic',subject:'math', review:true,objective:25,demo:false},//59
			{name:'Seaquence',url:urlSet + 'seaquence/',mapUrl:urlMap + 'seaquence', sceneName:'seaquence',subject:'math', review:true,objective:30,demo:false},//60
			{name:'Clock Fix',url:urlSet + 'clockfix/',mapUrl:urlMap + 'clockfix', sceneName:'clockfix',subject:'math', review:true,objective:20,demo:false},//61
			{name:'Math Engine',url:urlSet + 'mathEngine/',mapUrl:urlMap + 'mathEngine', sceneName:'engine',subject:'math', review:true,objective:25,demo:false},//62
			{name:'Astronometric',url:urlSet + 'astronoMetric/',mapUrl:urlMap + 'astronoMetric', sceneName:'astrono',subject:'math', review:true,objective:15,demo:false},//63
			{name:'Jumptiply',url:urlSet + 'jumptiply/',mapUrl:urlMap + 'jumptiply', sceneName:'jump',subject:'math', review:true,objective:25,demo:false},//64
			{name:'Swamp Shapes',url:urlSet + 'swampShape/',mapUrl:urlMap + 'swampShape', sceneName:'swampShape',subject:'math', review:true,objective:20,demo:false},//65
			{name:'Duck Count',url:urlSet + 'duckCount/',mapUrl:urlMap + 'duckCount', sceneName:'duck',subject:'math', review:true,objective:10,demo:false},//66
			{name:'Monster Dungeon',url:urlSet + 'monsterDungeon/',mapUrl:urlMap + 'monsterDungeon', sceneName:'monsterDungeon',subject:'math', review:true,objective:20,demo:false},//67
			{name:'Nacho Smacho',url:urlSet + 'nachoSmacho/',mapUrl:urlMap + 'nachoSmacho', sceneName:'nacho',subject:'math', review:true,objective:25,demo:false},//68
			{name:'Stackathon',url:urlSet + 'stackathon/',mapUrl:urlMap + 'stackathon', sceneName:'stack',subject:'math', review:true,objective:30,demo:false},//69
			{name:'Geometry Warp',url:urlSet + 'geometryWarp/',mapUrl:urlMap + 'geometryWarp', sceneName:'geometry',subject:'math', review:true,objective:30,demo:false},//70
			{name:'Mathrioska',url:urlSet + 'mathrioska/',mapUrl:urlMap + 'mathrioska', sceneName:'mathrioska',subject:'math', review:true,objective:30,demo:false},//71
			{name:'Aracnumber',url:urlSet + 'aracnumber/',mapUrl:urlMap + 'aracnumber', sceneName:'aracnumber',subject:'math', review:true,objective:15,demo:false},//72
			{name:'Dusk Defense',url:urlSet + 'duskDefense/',mapUrl:urlMap + 'duskDefense', sceneName:'dusk',subject:'math', review:true,objective:20,demo:false},//73
			{name:'zucaritas',url:urlSet + 'zucaritas/',mapUrl:urlMap + 'zucaritas', sceneName:'zucaritas',subject:'geography', review:false,objective:3,demo:false},//74 K
			{name:'Divisubmarine',url:urlSet + 'diviSubmarine/',mapUrl:urlMap + 'diviSubmarine', sceneName:'divisubmarine',subject:'math', review:false,objective:30,demo:false},//75
			{name:'Sushi Towers',url:urlSet + 'sushiTowers/',mapUrl:urlMap + 'sushiTowers', sceneName:'sushi',subject:'math', review:true,objective:20,demo:false},//76
			{name:'Float and Count',url:urlSet + 'floatAndCount/',mapUrl:urlMap + 'floatAndCount', sceneName:'float',subject:'math', review:true,objective:20,demo:false},//77
			{name:'Space Count',url:urlSet + 'SpaceCount/',mapUrl:urlMap + 'SpaceCount', sceneName:'spaceCount',subject:'math', review:true,objective:15,demo:false},//78
			{name:'Loop Roll',url:urlSet + 'loopRoll/',mapUrl:urlMap + 'loopRoll', sceneName:'loop',subject:'math', review:false,objective:3,demo:false},//79 K
			{name:'Melvin Travel',url:urlSet + 'melvinTravel/',mapUrl:urlMap + 'melvinTravel', sceneName:'melvin',subject:'geography', review:false,objective:3,demo:false},//80 K
			{name:'Paper Ships',url:urlSet + 'paperShips/',mapUrl:urlMap + 'paperShips', sceneName:'paper',subject:'math', review:true,objective:20,demo:false},//81
			{name:'FrooTemple',url:urlSet + 'frooTemple/',mapUrl:urlMap + 'frooTemple', sceneName:'frootemple',subject:'math', review:false,objective:3,demo:false},//82 K
			{name:'Fractiorama',url:urlSet + 'fractiorama/',mapUrl:urlMap + 'fractiorama', sceneName:'frac',subject:'math', review:true,objective:20,demo:false},//83
			{name:'Frosty Run',url:urlSet + 'frostyRun/',mapUrl:urlMap + 'frostyRun', sceneName:'frosty',subject:'math', review:false,objective:3,demo:false},//84 K
			{name:'Geo Tunnel',url:urlSet + 'geoTunnel/',mapUrl:urlMap + 'geoTunnel', sceneName:'geotunnel',subject:'math', review:true,objective:15,demo:false},//85
			{name:'Hover Ride',url:urlSet + 'hoverRide/',mapUrl:urlMap + 'hoverRide', sceneName:'hover',subject:'math', review:false,objective:3,demo:false},//86 K
			{name:'Cereal Buffet',url:urlSet + 'cerealBuffet/',mapUrl:urlMap + 'cerealBuffet', sceneName:'cereal',subject:'math', review:false,objective:3,demo:false},//87 K
			{name:'Froot Math',url:urlSet + 'frootMath/',mapUrl:urlMap + 'frootMath', sceneName:'frootMath',subject:'math', review:false,objective:3,demo:false},//88 K
			{name:'Pirate Pieces',url:urlSet + 'piratePieces/',mapUrl:urlMap + 'piratePieces', sceneName:'piratePieces',subject:'math', review:true,objective:15,demo:false},// 89
			{name:'Triangrid',url:urlSet + 'triangrid/',mapUrl:urlMap + 'triangrid', sceneName:'triangrid',subject:'math', review:false,objective:20,demo:false},// 90
			{name:'iMagic',url:urlSet + 'iMagic/',mapUrl:urlMap + 'iMagic', sceneName:'imagic',subject:'math', review:false,objective:3,demo:false},//91
			{name:'Ms NomNom',url:urlSet + 'msNomNom/',mapUrl:urlMap + 'msNomNom', sceneName:'ms',subject:'math', review:true,objective:15,demo:false},//92
			{name:'FrutiLluvia',url:urlSet + 'frutiLluvia/',mapUrl:urlMap + 'frutiLluvia', sceneName:'fruti',subject:'math', review:false,objective:3,demo:false},//93
			{name:'Dr Zombie',url:urlSet + 'drZombie/',mapUrl:urlMap + 'drZombie', sceneName:'drzombie',subject:'health', review:false,objective:20,demo:true},//94
			{name:'Wild Dentist',url:urlSet + 'wildDentist/',mapUrl:urlMap + 'wildDentist', sceneName:'wildDentist',subject:'health', review:true,objective:25,demo:false},//95
			{name:'Cog Count',url:urlSet + 'cogCount/',mapUrl:urlMap + 'cogCount', sceneName:'cog',subject:'math', review:true,objective:50,demo:false},//96
			{name:'Galactic Pool',url:urlSet + 'galacticPool/',mapUrl:urlMap + 'galacticPool', sceneName:'galactic',subject:'geography', review:true,objective:10,demo:false},//97
			{name:'Oona Says Cook',url:urlSet + 'oonaSaysCook/',mapUrl:urlMap + 'oonaSaysCook', sceneName:'oona',subject:'coding', review:true,objective:15,demo:true},//98
			{name:'River Rescue',url:urlSet + 'riverRescue/',mapUrl:urlMap + 'riverRescue', sceneName:'riverRescue',subject:'sustainability', review:true,objective:5,demo:false},//99
			{name:'River Cleaner',url:urlSet + 'riverCleaner/',mapUrl:urlMap + 'riverCleaner', sceneName:'river',subject:'sustainability', review:true,objective:10,demo:true},//100
			{name:'Garbage Diving',url:urlSet + 'garbageDiving/',mapUrl:urlMap + 'garbageDiving', sceneName:'garbageDiving',subject:'sustainability', review:true,objective:5,demo:false},//101
			{name:'Space Vaccum',url:urlSet + 'spaceVaccum/',mapUrl:urlMap + 'spaceVaccum', sceneName:'spaceVaccum',subject:'sustainability', review:true,objective:5,demo:false},//102
			{name:'Garbage Mole',url:urlSet + 'garbageMole/',mapUrl:urlMap + 'garbageMole', sceneName:'mole',subject:'sustainability', review:true,objective:5,demo:false},//103
			{name:'Elemental Witch',url:urlSet + 'elementalWitch/',mapUrl:urlMap + 'elementalWitch', sceneName:'elemental',subject:'creativity', review:true,objective:15,demo:true},//104
			{name:'Milky Saloon',url:urlSet + 'milkySaloon/',mapUrl:urlMap + 'milkySaloon', sceneName:'milky',subject:'coding', review:false,objective:20,demo:false},//105
			{name:'Calendrigon',url:urlSet + 'calendrigon/',mapUrl:urlMap + 'calendrigon', sceneName:'calendrigon',subject:'math', review:false,objective:10,demo:false},//106
            {name:'Symfunny',url:urlSet + 'symfunny/',mapUrl:urlMap + 'symfunny', sceneName:'symfunny',subject:'creativity', review:false,objective:15,demo:false},//107
			{name:'Shot Put',url:urlSet + 'shotPut/',mapUrl:urlMap + 'shotPut', sceneName:'shotPut',subject:'sciencie', review:false,objective:10,demo:false},//108
			{name:'Dino Dig',url:urlSet + 'dinoDigger/',mapUrl:urlMap + 'dinoDigger', sceneName:'dino',subject:'sciencie', review:false,objective:35,demo:false},//109
            {name:'Animal Route',url:urlSet + 'animalRoute/',mapUrl:urlMap + 'animalRoute', sceneName:'animalRoute',subject:'sciencie', review:false,objective:10,demo:false},//110
            {name:'Selfie Planet',url:urlSet + 'selfiePlanet/',mapUrl:urlMap + 'selfiePlanet', sceneName:'selfiePlanet',subject:'geography', review:false,objective:15,demo:false},//111
            {name:'Smoke Buster',url:urlSet + 'smokeBuster/',mapUrl:urlMap + 'smokeBuster', sceneName:'smokeBusters',subject:'sustainability', review:false,objective:25,demo:false},//112
            {name:'Milky Bar',url:urlSet + 'milkyBar/',mapUrl:urlMap + 'milkyBar', sceneName:'milkyBar',subject:'coding', review:false,objective:25,demo:false},//113
            {name:'Color Scientist',url:urlSet + 'colorScientist/',mapUrl:urlMap + 'colorScientist', sceneName:'colorScientist',subject:'creativity', review:false,objective:30,demo:false},//114
            {name:'Where Is My',url:urlSet + 'whereIsMy/',mapUrl:urlMap + 'whereIsMy', sceneName:'whereIsMy',subject:'language', review:false,objective:25,demo:false},//115
            {name:'H2Orbit',url:urlSet + 'H2Orbit/',mapUrl:urlMap + 'H2Orbit', sceneName:'H2Orbit',subject:'sciencie', review:false,objective:40,demo:false},//116
            {name:'Fridge',url:urlSet + 'fridge/',mapUrl:urlMap + 'fridge', sceneName:'fridge',subject:'health', review:false,objective:25,demo:false},//117
            {name:'Sympho Master',url:urlSet + 'symphoMaster/',mapUrl:urlMap + 'symphoMaster', sceneName:'symphoMaster',subject:'creativity', review:false,objective:20,demo:false},//118
            {name:'Dinamita Dance',url:urlSet + 'dinamitaDance/',mapUrl:urlMap + 'dinamitaDance', sceneName:'dinamitaDance',subject:'language', review:false,objective:15,demo:false},//119
            {name:'Rabbit Trace',url:urlSet + 'rabitTrace/',mapUrl:urlMap + 'rabitTrace', sceneName:'rabitTrace',subject:'sciencie', review:false,objective:15,demo:false},//120
            {name:'Noisy Monsters',url:urlSet + 'noisyMonsters/',mapUrl:urlMap + 'noisyMonsters', sceneName:'noisyMonsters',subject:'sustainability', review:false,objective:25,demo:false},//121
            {name:'Balance Science',url:urlSet + 'balanceScience/',mapUrl:urlMap + 'balanceScience', sceneName:'balanceScience',subject:'sciencie', review:false,objective:15,demo:false},//122
            {name:'Liquidungeon',url:urlSet + 'liquidungeon/',mapUrl:urlMap + 'liquidungeon', sceneName:'liquidungeon',subject:'sciencie', review:false,objective:40,demo:false},//123
            {name:'Green Rescue',url:urlSet + 'greenRescue/',mapUrl:urlMap + 'greenRescue', sceneName:'greenRescue',subject:'sustainability', review:false,objective:10,demo:false},//124
            {name:'Lake Strike',url:urlSet + 'lakeStrike/',mapUrl:urlMap + 'lakeStrike', sceneName:'lakeStrike',subject:'sustainability', review:false,objective:30,demo:false},//125
            {name:'Nosiy Streets',url:urlSet + 'noisyStreets/',mapUrl:urlMap + 'noisyStreets', sceneName:'noisyStreets',subject:'sustainability', review:false,objective:15,demo:false},//126
            {name:'Continental Puzzle',url:urlSet + 'continentalPuzzle/',mapUrl:urlMap +'continentalPuzzle',sceneName:'continentalPuzzle',subject:'geography',review:false,objective:15,demo:false},//127
            {name:'Geo Beat',url:urlSet + 'geoBeat/',mapUrl:urlMap + 'geoBeat', sceneName:'geoBeat',subject:'geography', review:false,objective:25,demo:false},//128
            {name:'Mirror World',url:urlSet + 'mirrorWorld/',mapUrl:urlMap + 'mirrorWorld', sceneName:'mirrorWorld',subject:'creativity', review:false,objective:10,demo:false},//129
            {name:'Solar Wing',url:urlSet + 'solarWing/',mapUrl:urlMap + 'solarWing', sceneName:'solarWing',subject:'sustainability', review:false,objective:30,demo:false},//130
            {name:'Donnie Bunny',url:urlSet + 'donnieBunny/',mapUrl:urlMap + 'donnieBunny', sceneName:'donnieBunny',subject:'language', review:false,objective:30,demo:false},//131
            {name:'Hack A Ton',url:urlSet + 'hackATon/',mapUrl:urlMap + 'hackATon', sceneName:'hackATon',subject:'coding', review:false,objective:20,demo:false},//132
            {name:'Solar Shield Squad',url:urlSet + 'solarShieldSquad/',mapUrl:urlMap + 'solarShieldSquad', sceneName:'solarShieldSquad',subject:'Geography', review:false,objective:35,demo:false},//133
            {name:'Galaxy Jumper',url:urlSet + 'galaxyJumper/',mapUrl:urlMap + 'galaxyJumper', sceneName:'galaxyJumper',subject:'Geography', review:false,objective:20,demo:false},//134
            {name:'Stomake',url:urlSet + 'stomake/',mapUrl:urlMap + 'stomake', sceneName:'stomake',subject:'sciencie', review:false,objective:30,demo:false},//135
            {name:'Scranimal',url:urlSet + 'scranimal/',mapUrl:urlMap + 'scranimal', sceneName:'scranimal',subject:'language', review:false,objective:50,demo:false},//136
		]

		for(var gIndex = 0; gIndex < games.length; gIndex++){
			var game = games[gIndex]
			var gameId = game.name.replace(/\s/g, "")
			games[gIndex].mapUrl = urlSet + urlMap + gameId
			games[gIndex].id = gameId
		}

		return games

	}
	
	function getObjectGames() {
		var object = {}

		var games = getGames()

		for(var gIndex = 0; gIndex < games.length; gIndex++){
			var game = games[gIndex]
			var gameId = game.name.replace(/\s/g, "")
			game.id = gameId
			object[gameId] = game
		}

		return object
	}

	function addTime(){

		timeCount++
		if(addingTime){
			setTimeout(addTime,1000)
		}
	}

	function returnData(){

		addingTime = false
		return {timeReady:timeCount,lives:gameLives}
	}

	function mixpanelCall(callName,gameIndex,lives,childata) {

		var gamesList = getGames()

		var email = "noEmail"
		var playerId = "noPlayerId"
		var hasMap = false

		if (childata) {

			email = childata.parentMail
			playerId = childata.remoteId
			if (childata.isMap) {
				hasMap = true
			}
		}

		timeCount = 0
		addingTime = true
		addTime()

		console.log('gameIndex sent ' + gameIndex)

		gameLives = lives || 1

		mixpanel.track(
			callName,
			{
				"minigame": gamesList[gameIndex].name,
				"subject": gamesList[gameIndex].subject,
				"app": "epicWeb",
				"isMap": hasMap,
				"email": email,
				"user_id": playerId
			}
		);
	}

	return{
		getGames:getGames,
		returnData:returnData,
		mixpanelCall:mixpanelCall,
		getObjectGames:getObjectGames
	}
		
}()