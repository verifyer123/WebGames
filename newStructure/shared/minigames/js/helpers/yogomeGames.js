
var gameTypeEnum = {
	CHOOSE:0,
	COUNT:1,
	GRAB:2,
	MATCH:3,
	SEQUENCE:4,
	TARGET:5,
	TRACE:6,
	TAP:7,
};

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

			{name:'Addition Dojo',url:urlSet + 'additiondojo/',mapUrl:urlMap + 'AdditionDojo', sceneName:'dojo',subject:'math',review:false,objective:15,demo:false,type:gameTypeEnum.COUNT},
			{name:'Space Words',url:urlSet + 'spaceWords/',mapUrl:urlMap + 'spaceWords', sceneName:'space',subject:'language',review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},
			{name:'Math Run',url:urlSet + 'runneryogome/',mapUrl:urlMap + 'runneryogome', sceneName:'runneryogome',subject:'math',review:true,objective:20,demo:true,type:gameTypeEnum.COUNT},
			{name:'Water Morphosis',url:urlSet + 'waterMorph/',mapUrl:urlMap + 'waterMorph', sceneName:'water',subject:'science',review:false,objective:40,demo:false,type:gameTypeEnum.MATCH},
			{name:'Ice Cream Numbers',url:urlSet + 'numberIce/',mapUrl:urlMap + 'numberIce', sceneName:'ice',subject:'math',review:false,objective:10,demo:false,type:gameTypeEnum.COUNT},
			{name:'Magnet Ride',url:urlSet + 'magnetRide/',mapUrl:urlMap + 'magnetRide', sceneName:'magnet',subject:'science',review:true,objective:30,demo:false,type:gameTypeEnum.GRAB},
			{name:'Salad Cards',url:urlSet + 'tapcards/',mapUrl:urlMap + 'tapcards', sceneName:'tapcards',subject:'language',review:false,objective:30,demo:false,type:gameTypeEnum.MATCH},
			{name:'Sky Language',url:urlSet + 'skyLanguage/',mapUrl:urlMap + 'skyLanguage', sceneName:'skyLanguage',subject:'language',review:true,objective:15,demo:false,type:gameTypeEnum.CHOOSE},
			{name:'Flag Runner',url:urlSet + 'flagRunner/',mapUrl:urlMap + 'flagRunner', sceneName:'flag',subject:'geography',review:true,objective:15,demo:false,type:gameTypeEnum.MATCH},
			{name:'Rift Land',url:urlSet + 'riftLand/',mapUrl:urlMap + 'riftLand', sceneName:'rift',subject:'coding',review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},
			{name:'Puzzle Road',url:urlSet + 'puzzleRoad/',mapUrl:urlMap + 'puzzleRoad', sceneName:'puzzle',subject:'creativity',review:true,objective:25,demo:false,type:gameTypeEnum.MATCH},
			{name:'Geo Journey',url:urlSet + 'geoJourney/',mapUrl:urlMap + 'geoJourney', sceneName:'geoJourney',subject:'geography',review:false,objective:20,demo:false,type:gameTypeEnum.GRAB},
			{name:'Memonumbers',url:urlSet + 'memoNumbers/',mapUrl:urlMap + 'memoNumbers', sceneName:'memo',subject:'math',review:true,objective:40,demo:false,type:gameTypeEnum.MATCH},
			{name:'Beach Ninja',url:urlSet + 'beachNinja/',mapUrl:urlMap + 'beachNinja', sceneName:'beach',subject:'math',review:true,objective:15,demo:false,type:gameTypeEnum.CHOOSE},
			{name:'Flying Fractions',url:urlSet + 'flyingFractions/',mapUrl:urlMap + 'flyingFractions', sceneName:'flyingFractions',subject:'math',review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},
			{name:'Color Attack',url:urlSet + 'colorAttack/',mapUrl:urlMap + 'colorAttack', sceneName:'color',subject:'creativity',review:true,objective:15,demo:false,type:gameTypeEnum.MATCH},
			{name:'Nutricanon',url:urlSet + 'nutriCanon/',mapUrl:urlMap + 'nutriCanon', sceneName:'nutri',subject:'health',review:true,objective:20,demo:false,type:gameTypeEnum.TARGET},
			{name:'Microdefender',url:urlSet + 'microdefender/',mapUrl:urlMap + 'microdefender', sceneName:'microdefender',subject:'health',review:true,objective:30,demo:false,type:gameTypeEnum.GRAB},
			{name:'Healthy Collector',url:urlSet + 'healthyCollector/',mapUrl:urlMap + 'healthyCollector', sceneName:'healthyCollector',subject:'health',review:false,objective:30,demo:false,type:gameTypeEnum.GRAB},
			{name:'Croak Song',url:urlSet + 'CroakSong/',mapUrl:urlMap + 'CroakSong', sceneName:'CroakSong',subject:'creativity',review:true,objective:40,demo:false,type:gameTypeEnum.SEQUENCE},
			{name:'Tilt Sprout',url:urlSet + 'tiltSprout/',mapUrl:urlMap + 'tiltSprout', sceneName:'tilt',subject:'science',review:true,objective:10,demo:false,type:gameTypeEnum.GRAB},
			{name:'Culture Icons',url:urlSet + 'cultureIcons/',mapUrl:urlMap + 'cultureIcons', sceneName:'culture',subject:'geography',review:true,objective:20,demo:false,type:gameTypeEnum.MATCH},
			{name:'Dizzy Boat',url:urlSet + 'dizzyBoat/',mapUrl:urlMap + 'dizzyBoat', sceneName:'dizzy',subject:'geography',review:true,objective:15,demo:false,type:gameTypeEnum.TARGET},
			{name:'Flag Collector',url:urlSet + 'flagCollector/',mapUrl:urlMap + 'flagCollector', sceneName:'flagCollector',subject:'geography',review:true,objective:15,demo:false,type:gameTypeEnum.CHOOSE},
			{name:'Medicatcher',url:urlSet + 'mediCatcher/',mapUrl:urlMap + 'mediCatcher', sceneName:'medi',subject:'health',review:false,objective:30,demo:false,type:gameTypeEnum.GRAB},
			{name:'Wild Snaps',url:urlSet + 'wildSnaps/',mapUrl:urlMap + 'wildSnaps', sceneName:'wild',subject:'creativity',review:true,objective:15,demo:false,type:gameTypeEnum.TARGET},
			{name:'Gemath',url:urlSet + 'geMath/',mapUrl:urlMap + 'geMath', sceneName:'gem',subject:'math',review:true,objective:15,demo:false,type:gameTypeEnum.TRACE},
			{name:'Hackamole',url:urlSet + 'hackaMole/',mapUrl:urlMap + 'hackaMole', sceneName:'hack',subject:'coding',review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},
			{name:'Lizart',url:urlSet + 'lizart/',mapUrl:urlMap + 'lizart', sceneName:'lizart',subject:'language',review:true,objective:20,demo:false,type:gameTypeEnum.MATCH},
			{name:'Snooze Crater',url:urlSet + 'snoozeCrater/',mapUrl:urlMap + 'snoozeCrater', sceneName:'snooze',subject:'sustainability',review:true,objective:10,demo:false,type:gameTypeEnum.GRAB},//29
			{name:'Math Feed',url:urlSet + 'mathFeed/',mapUrl:urlMap + 'mathFeed', sceneName:'feed',subject:'math',review:false,objective:25,demo:false,type:gameTypeEnum.MATCH},//30
			{name:'Galaxy Heroes',url:urlSet + 'galaxyHeroes/',mapUrl:urlMap + 'galaxyHeroes', sceneName:'galaxy',subject:'geography',review:true,objective:20,demo:false,type:gameTypeEnum.GRAB},//31
			{name:'Pop Fish',url:urlSet + 'popFish/',mapUrl:urlMap + 'popFish', sceneName:'fish',subject:'math',review:true,objective:15,demo:false,type:gameTypeEnum.GRAB},//32
			{name:'Bouncy Bath',url:urlSet + 'bouncybath/',mapUrl:urlMap + 'bouncybath', sceneName:'bouncybath',subject:'health',review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//33
			{name:'Acorn Numbers',url:urlSet + 'acornNumbers/',mapUrl:urlMap + 'acornNumbers', sceneName:'acorn',subject:'math',review:true,objective:30,demo:true,type:gameTypeEnum.CHOOSE},//34
			{name:'Popsteroids',url:urlSet + 'popSteroids/',mapUrl:urlMap + 'popSteroids', sceneName:'popScene',subject:'math',review:true,objective:40,demo:false,type:gameTypeEnum.MATCH},//35
			{name:'Candy Shapes',url:urlSet + 'candyShapes/',mapUrl:urlMap + 'candyShapes', sceneName:'candy',subject:'math',review:true,objective:40,demo:false,type:gameTypeEnum.MATCH},//36
			{name:'Feather Shelter',url:urlSet + 'featherShelter/',mapUrl:urlMap + 'featherShelter', sceneName:'feather',subject:'math',review:false,objective:10,demo:false,type:gameTypeEnum.COUNT},//37
			{name:'Math Circus',url:urlSet + 'mathCircus/',mapUrl:urlMap + 'mathCircus', sceneName:'circus',subject:'math',review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},//38
			{name:'Flight o Clock',url:urlSet + 'flightoclock/',mapUrl:urlMap + 'flightoclock', sceneName:'flightoclock',subject:'math',review:true,objective:25,demo:false,type:gameTypeEnum.MATCH},//39
			{name:'Clash Critters',url:urlSet + 'clashCritters/',mapUrl:urlMap + 'clashCritters', sceneName:'clash',subject:'math',review:true,objective:50,demo:false,type:gameTypeEnum.CHOOSE},//40
			{name:'Math Port',url:urlSet + 'mathPort/',mapUrl:urlMap + 'mathPort', sceneName:'port',subject:'math',review:true,objective:30,demo:false,type:gameTypeEnum.CHOOSE},//41
			{name:'Pizza Fraction',url:urlSet + 'pizzafraction/',mapUrl:urlMap + 'pizzafraction', sceneName:'pizzafraction',subject:'math',review:true,objective:25,demo:false,type:gameTypeEnum.MATCH},//42
			{name:'Hungry Toads',url:urlSet + 'hungryToads/',mapUrl:urlMap + 'hungryToads', sceneName:'hungry',subject:'math',review:true,objective:25,demo:false,type:gameTypeEnum.CHOOSE},//43
			{name:'Sky Tap',url:urlSet + 'skyTap/',mapUrl:urlMap + 'skyTap', sceneName:'sky',subject:'math' ,review:true,objective:30,demo:false,type:gameTypeEnum.COUNT},//44
			{name:'Evening',url:urlSet + 'evening/',mapUrl:urlMap + 'evening', sceneName:'evening',subject:'math', review:true,objective:40,demo:false,type:gameTypeEnum.MATCH},//45
			{name:'Minmax Duel',url:urlSet + 'minmaxduel/',mapUrl:urlMap + 'minmaxduel', sceneName:'minmaxduel',subject:'math', review:true,objective:15,demo:false,type:gameTypeEnum.CHOOSE},//46
			{name:'Math Invader',url:urlSet + 'mathInvader/',mapUrl:urlMap + 'mathInvader', sceneName:'invader',subject:'math', review:true,objective:30,demo:false,type:gameTypeEnum.SEQUENCE},//47
			{name:'Locksmath',url:urlSet + 'locksmath/',mapUrl:urlMap + 'locksmath', sceneName:'lock',subject:'math', review:true,objective:50,demo:false,type:gameTypeEnum.MATCH},//48
			{name:'Magic Gate',url:urlSet + 'magicGate/',mapUrl:urlMap + 'magicGate', sceneName:'magicGate',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},//49
			{name:'Lucky Numbers',url:urlSet + 'luckynumber/',mapUrl:urlMap + 'luckynumber', sceneName:'luckynumber',subject:'math', review:true,objective:10,demo:false,type:gameTypeEnum.MATCH},//50
			{name:'Robovet',url:urlSet + 'robovet/',mapUrl:urlMap + 'robovet', sceneName:'robo',subject:'math', review:true,objective:30,demo:false,type:gameTypeEnum.CHOOSE},//51
			{name:'Math Bomb',url:urlSet + 'mathBomb/',mapUrl:urlMap + 'mathBomb', sceneName:'bomb',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.MATCH},//52
			{name:'UniDream',url:urlSet + 'uniDream/',mapUrl:urlMap + 'uniDream', sceneName:'uni',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.COUNT},//53
			{name:'Countipede',url:urlSet + 'countipede/',mapUrl:urlMap + 'countipede', sceneName:'countip',subject:'math', review:true,objective:35,demo:false,type:gameTypeEnum.COUNT},//54
			{name:'Toy Figures',url:urlSet + 'toyfigure/',mapUrl:urlMap + 'toyfigure', sceneName:'toyfigure',subject:'math', review:true,objective:25,demo:false,type:gameTypeEnum.MATCH},//55
			{name:'Jelly Jump',url:urlSet + 'jellyJump/',mapUrl:urlMap + 'jellyJump', sceneName:'jelly',subject:'math', review:false,objective:10,demo:false,type:gameTypeEnum.COUNT},//56
			{name:'Squat Count',url:urlSet + 'squatCount/',mapUrl:urlMap + 'squatCount', sceneName:'squat',subject:'math', review:true,objective:10,demo:false,type:gameTypeEnum.COUNT},//57
			{name:'Baxtion',url:urlSet + 'baxtion/',mapUrl:urlMap + 'baxtion', sceneName:'bax',subject:'math', review:true,objective:10,demo:false,type:gameTypeEnum.COUNT},//58
			{name:'Mathgic Hat',url:urlSet + 'mathgicHat/',mapUrl:urlMap + 'mathgicHat', sceneName:'magic',subject:'math', review:true,objective:25,demo:false,type:gameTypeEnum.CHOOSE},//59
			{name:'Seaquence',url:urlSet + 'seaquence/',mapUrl:urlMap + 'seaquence', sceneName:'seaquence',subject:'math', review:true,objective:30,demo:false,type:gameTypeEnum.SEQUENCE},//60
			{name:'Clock Fix',url:urlSet + 'clockfix/',mapUrl:urlMap + 'clockfix', sceneName:'clockfix',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.MATCH},//61
			{name:'Math Engine',url:urlSet + 'mathEngine/',mapUrl:urlMap + 'mathEngine', sceneName:'engine',subject:'math', review:true,objective:25,demo:false,type:gameTypeEnum.CHOOSE},//62
			{name:'Astronometric',url:urlSet + 'astronoMetric/',mapUrl:urlMap + 'astronoMetric', sceneName:'astrono',subject:'math', review:true,objective:15,demo:false,type:gameTypeEnum.TRACE},//63
			{name:'Jumptiply',url:urlSet + 'jumptiply/',mapUrl:urlMap + 'jumptiply', sceneName:'jump',subject:'math', review:true,objective:25,demo:false,type:gameTypeEnum.CHOOSE},//64
			{name:'Swamp Shapes',url:urlSet + 'swampShape/',mapUrl:urlMap + 'swampShape', sceneName:'swampShape',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.TRACE},//65
			{name:'Duck Count',url:urlSet + 'duckCount/',mapUrl:urlMap + 'duckCount', sceneName:'duck',subject:'math', review:true,objective:10,demo:false,type:gameTypeEnum.SEQUENCE},//66
			{name:'Monster Dungeon',url:urlSet + 'monsterDungeon/',mapUrl:urlMap + 'monsterDungeon', sceneName:'monsterDungeon',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},//67
			{name:'Nacho Smacho',url:urlSet + 'nachoSmacho/',mapUrl:urlMap + 'nachoSmacho', sceneName:'nacho',subject:'math', review:true,objective:25,demo:false,type:gameTypeEnum.COUNT},//68
			{name:'Stackathon',url:urlSet + 'stackathon/',mapUrl:urlMap + 'stackathon', sceneName:'stack',subject:'math', review:true,objective:30,demo:false,type:gameTypeEnum.CHOOSE},//69
			{name:'Geometry Warp',url:urlSet + 'geometryWarp/',mapUrl:urlMap + 'geometryWarp', sceneName:'geometry',subject:'math', review:true,objective:30,demo:false,type:gameTypeEnum.MATCH},//70
			{name:'Mathrioska',url:urlSet + 'mathrioska/',mapUrl:urlMap + 'mathrioska', sceneName:'mathrioska',subject:'math', review:true,objective:30,demo:false,type:gameTypeEnum.CHOOSE},//71
			{name:'Aracnumber',url:urlSet + 'aracnumber/',mapUrl:urlMap + 'aracnumber', sceneName:'aracnumber',subject:'math', review:true,objective:15,demo:false,type:gameTypeEnum.SEQUENCE},//72
			{name:'Dusk Defense',url:urlSet + 'duskDefense/',mapUrl:urlMap + 'duskDefense', sceneName:'dusk',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.TARGET},//73
			{name:'zucaritas',url:urlSet + 'zucaritas/',mapUrl:urlMap + 'zucaritas', sceneName:'zucaritas',subject:'geography', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//74 K
			{name:'Divisubmarine',url:urlSet + 'diviSubmarine/',mapUrl:urlMap + 'diviSubmarine', sceneName:'divisubmarine',subject:'math', review:false,objective:30,demo:false,type:gameTypeEnum.CHOOSE},//75
			{name:'Sushi Towers',url:urlSet + 'sushiTowers/',mapUrl:urlMap + 'sushiTowers', sceneName:'sushi',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.MATCH},//76
			{name:'Float and Count',url:urlSet + 'floatAndCount/',mapUrl:urlMap + 'floatAndCount', sceneName:'float',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.SEQUENCE},//77
			{name:'Space Count',url:urlSet + 'SpaceCount/',mapUrl:urlMap + 'SpaceCount', sceneName:'spaceCount',subject:'math', review:true,objective:15,demo:false,type:gameTypeEnum.COUNT},//78
			{name:'Loop Roll',url:urlSet + 'loopRoll/',mapUrl:urlMap + 'loopRoll', sceneName:'loop',subject:'math', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//79 K
			{name:'Melvin Travel',url:urlSet + 'melvinTravel/',mapUrl:urlMap + 'melvinTravel', sceneName:'melvin',subject:'geography', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//80 K
			{name:'Paper Ships',url:urlSet + 'paperShips/',mapUrl:urlMap + 'paperShips', sceneName:'paper',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.TARGET},//81
			{name:'FrooTemple',url:urlSet + 'frooTemple/',mapUrl:urlMap + 'frooTemple', sceneName:'frootemple',subject:'math', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//82 K
			{name:'Fractiorama',url:urlSet + 'fractiorama/',mapUrl:urlMap + 'fractiorama', sceneName:'frac',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.MATCH},//83
			{name:'Frosty Run',url:urlSet + 'frostyRun/',mapUrl:urlMap + 'frostyRun', sceneName:'frosty',subject:'math', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//84 K
			{name:'Geo Tunnel',url:urlSet + 'geoTunnel/',mapUrl:urlMap + 'geoTunnel', sceneName:'geotunnel',subject:'math', review:true,objective:15,demo:false,type:gameTypeEnum.MATCH},//85
			{name:'Hover Ride',url:urlSet + 'hoverRide/',mapUrl:urlMap + 'hoverRide', sceneName:'hover',subject:'math', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//86 K
			{name:'Cereal Buffet',url:urlSet + 'cerealBuffet/',mapUrl:urlMap + 'cerealBuffet', sceneName:'cereal',subject:'math', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//87 K
			{name:'Froot Math',url:urlSet + 'frootMath/',mapUrl:urlMap + 'frootMath', sceneName:'frootMath',subject:'math', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//88 K
			{name:'Pirate Pieces',url:urlSet + 'piratePieces/',mapUrl:urlMap + 'piratePieces', sceneName:'piratePieces',subject:'math', review:true,objective:15,demo:false,type:gameTypeEnum.COUNT},// 89
			{name:'Triangrid',url:urlSet + 'triangrid/',mapUrl:urlMap + 'triangrid', sceneName:'triangrid',subject:'math', review:false,objective:20,demo:false,type:gameTypeEnum.MATCH},// 90
			{name:'iMagic',url:urlSet + 'iMagic/',mapUrl:urlMap + 'iMagic', sceneName:'imagic',subject:'math', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//91
			{name:'Ms NomNom',url:urlSet + 'msNomNom/',mapUrl:urlMap + 'msNomNom', sceneName:'ms',subject:'math', review:true,objective:15,demo:false,type:gameTypeEnum.GRAB},//92
			{name:'FrutiLluvia',url:urlSet + 'frutiLluvia/',mapUrl:urlMap + 'frutiLluvia', sceneName:'fruti',subject:'math', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//93
			{name:'Dr Zombie',url:urlSet + 'drZombie/',mapUrl:urlMap + 'drZombie', sceneName:'drzombie',subject:'health', review:false,objective:20,demo:true,type:gameTypeEnum.MATCH},//94
			{name:'Wild Dentist',url:urlSet + 'wildDentist/',mapUrl:urlMap + 'wildDentist', sceneName:'wildDentist',subject:'health', review:true,objective:25,demo:false,type:gameTypeEnum.MATCH},//95
			{name:'Cog Count',url:urlSet + 'cogCount/',mapUrl:urlMap + 'cogCount', sceneName:'cog',subject:'math', review:true,objective:50,demo:false,type:gameTypeEnum.COUNT},//96
			{name:'Galactic Pool',url:urlSet + 'galacticPool/',mapUrl:urlMap + 'galacticPool', sceneName:'galactic',subject:'geography', review:true,objective:10,demo:false,type:gameTypeEnum.SEQUENCE},//97
			{name:'Oona Says Cook',url:urlSet + 'oonaSaysCook/',mapUrl:urlMap + 'oonaSaysCook', sceneName:'oona',subject:'coding', review:true,objective:15,demo:true,type:gameTypeEnum.MATCH},//98
			{name:'River Rescue',url:urlSet + 'riverRescue/',mapUrl:urlMap + 'riverRescue', sceneName:'riverRescue',subject:'sustainability', review:true,objective:5,demo:false,type:gameTypeEnum.GRAB},//99
			{name:'River Cleaner',url:urlSet + 'riverCleaner/',mapUrl:urlMap + 'riverCleaner', sceneName:'river',subject:'sustainability', review:true,objective:5,demo:true,type:gameTypeEnum.GRAB},//100
			{name:'Garbage Diving',url:urlSet + 'garbageDiving/',mapUrl:urlMap + 'garbageDiving', sceneName:'garbageDiving',subject:'sustainability', review:true,objective:5,demo:false,type:gameTypeEnum.GRAB},//101
			{name:'Space Vaccum',url:urlSet + 'spaceVaccum/',mapUrl:urlMap + 'spaceVaccum', sceneName:'spaceVaccum',subject:'sustainability', review:true,objective:5,demo:false,type:gameTypeEnum.GRAB},//102
			{name:'Garbage Mole',url:urlSet + 'garbageMole/',mapUrl:urlMap + 'garbageMole', sceneName:'mole',subject:'sustainability', review:true,objective:5,demo:false,type:gameTypeEnum.GRAB},//103
			{name:'Elemental Witch',url:urlSet + 'elementalWitch/',mapUrl:urlMap + 'elementalWitch', sceneName:'elemental',subject:'creativity', review:true,objective:15,demo:true,type:gameTypeEnum.MATCH},//104
			{name:'Milky Saloon',url:urlSet + 'milkySaloon/',mapUrl:urlMap + 'milkySaloon', sceneName:'milky',subject:'coding', review:false,objective:20,demo:false,type:gameTypeEnum.CHOOSE},//105
			{name:'Calendrigon',url:urlSet + 'calendrigon/',mapUrl:urlMap + 'calendrigon', sceneName:'calendrigon',subject:'math', review:false,objective:10,demo:false,type:gameTypeEnum.MATCH},//106
            {name:'Symfunny',url:urlSet + 'symfunny/',mapUrl:urlMap + 'symfunny', sceneName:'symfunny',subject:'creativity', review:false,objective:15,demo:false,type:gameTypeEnum.SEQUENCE},//107
			{name:'Shot Put',url:urlSet + 'shotPut/',mapUrl:urlMap + 'shotPut', sceneName:'shotPut',subject:'sciencie', review:false,objective:10,demo:false,type:gameTypeEnum.MATCH},//108
			{name:'Dino Dig',url:urlSet + 'dinoDigger/',mapUrl:urlMap + 'dinoDigger', sceneName:'dino',subject:'sciencie', review:false,objective:35,demo:false,type:gameTypeEnum.CHOOSE},//109
            {name:'Animal Route',url:urlSet + 'animalRoute/',mapUrl:urlMap + 'animalRoute', sceneName:'animalRoute',subject:'sciencie', review:false,objective:10,demo:false,type:gameTypeEnum.CHOOSE},//110
            {name:'Selfie Planet',url:urlSet + 'selfiePlanet/',mapUrl:urlMap + 'selfiePlanet', sceneName:'selfiePlanet',subject:'geography', review:false,objective:15,demo:false,type:gameTypeEnum.TARGET},//111
            {name:'Smoke Buster',url:urlSet + 'smokeBuster/',mapUrl:urlMap + 'smokeBuster', sceneName:'smokeBusters',subject:'sustainability', review:false,objective:25,demo:false,type:gameTypeEnum.GRAB},//112
            {name:'Milky Bar',url:urlSet + 'milkyBar/',mapUrl:urlMap + 'milkyBar', sceneName:'milkyBar',subject:'coding', review:false,objective:25,demo:false,type:gameTypeEnum.MATCH},//113
            {name:'Color Scientist',url:urlSet + 'colorScientist/',mapUrl:urlMap + 'colorScientist', sceneName:'colorScientist',subject:'creativity', review:false,objective:30,demo:false,type:gameTypeEnum.CHOOSE},//114
            {name:'Where Is My',url:urlSet + 'whereIsMy/',mapUrl:urlMap + 'whereIsMy', sceneName:'whereIsMy',subject:'language', review:false,objective:25,demo:false,type:gameTypeEnum.GRAB},//115
            {name:'H2Orbit',url:urlSet + 'H2Orbit/',mapUrl:urlMap + 'H2Orbit', sceneName:'H2Orbit',subject:'sciencie', review:false,objective:40,demo:false,type:gameTypeEnum.MATCH},//116
            {name:'Fridge',url:urlSet + 'fridge/',mapUrl:urlMap + 'fridge', sceneName:'fridge',subject:'health', review:false,objective:25,demo:false,type:gameTypeEnum.MATCH},//117
            {name:'Sympho Master',url:urlSet + 'symphoMaster/',mapUrl:urlMap + 'symphoMaster', sceneName:'symphoMaster',subject:'creativity', review:false,objective:15,demo:false,type:gameTypeEnum.MATCH},//118
            {name:'Dinamita Dance',url:urlSet + 'dinamitaDance/',mapUrl:urlMap + 'dinamitaDance', sceneName:'dinamitaDance',subject:'language', review:false,objective:15,demo:false,type:gameTypeEnum.CHOOSE},//119
            {name:'Rabbit Trace',url:urlSet + 'rabitTrace/',mapUrl:urlMap + 'rabitTrace', sceneName:'rabitTrace',subject:'sciencie', review:false,objective:15,demo:false,type:gameTypeEnum.TRACE},//120
            {name:'Noisy Monsters',url:urlSet + 'noisyMonsters/',mapUrl:urlMap + 'noisyMonsters', sceneName:'noisyMonsters',subject:'sustainability', review:false,objective:25,demo:false,type:gameTypeEnum.MATCH},//121
            {name:'Balance Science',url:urlSet + 'balanceScience/',mapUrl:urlMap + 'balanceScience', sceneName:'balanceScience',subject:'sciencie', review:false,objective:15,demo:false,type:gameTypeEnum.MATCH},//122
            {name:'Liquidungeon',url:urlSet + 'liquidungeon/',mapUrl:urlMap + 'liquidungeon', sceneName:'liquidungeon',subject:'sciencie', review:false,objective:40,demo:false,type:gameTypeEnum.CHOOSE},//123
            {name:'Green Rescue',url:urlSet + 'greenRescue/',mapUrl:urlMap + 'greenRescue', sceneName:'greenRescue',subject:'sustainability', review:false,objective:10,demo:false,type:gameTypeEnum.MATCH},//124
            {name:'Lake Strike',url:urlSet + 'lakeStrike/',mapUrl:urlMap + 'lakeStrike', sceneName:'lakeStrike',subject:'sustainability', review:false,objective:30,demo:false,type:gameTypeEnum.TARGET},//125
            {name:'Noisy Streets',url:urlSet + 'noisyStreets/',mapUrl:urlMap + 'noisyStreets', sceneName:'noisyStreets',subject:'sustainability', review:false,objective:15,demo:false,type:gameTypeEnum.MATCH},//126
            {name:'Continental Puzzle',url:urlSet + 'continentalPuzzle/',mapUrl:urlMap +'continentalPuzzle',sceneName:'continentalPuzzle',subject:'geography',review:false,objective:15,demo:false,type:gameTypeEnum.CHOOSE},//127
            {name:'Geo Beat',url:urlSet + 'geoBeat/',mapUrl:urlMap + 'geoBeat', sceneName:'geoBeat',subject:'geography', review:false,objective:25,demo:false,type:gameTypeEnum.SEQUENCE},//128
            {name:'Mirror World',url:urlSet + 'mirrorWorld/',mapUrl:urlMap + 'mirrorWorld', sceneName:'mirrorWorld',subject:'creativity', review:false,objective:10,demo:false,type:gameTypeEnum.MATCH},//129
            {name:'Solar Wing',url:urlSet + 'solarWing/',mapUrl:urlMap + 'solarWing', sceneName:'solarWing',subject:'sustainability', review:false,objective:30,demo:false,type:gameTypeEnum.CHOOSE},//130
            {name:'Face Ahoy',url:urlSet + 'faceAhoy/',mapUrl:urlMap + 'faceAhoy', sceneName:'faceAhoy',subject:'language', review:false,objective:30,demo:false,type:gameTypeEnum.MATCH},//131
            {name:'Hack A Ton',url:urlSet + 'hackATon/',mapUrl:urlMap + 'hackATon', sceneName:'hackATon',subject:'coding', review:false,objective:20,demo:false,type:gameTypeEnum.CHOOSE},//132
            {name:'Solar Shield Squad',url:urlSet + 'solarShieldSquad/',mapUrl:urlMap + 'solarShieldSquad', sceneName:'solarShieldSquad',subject:'Geography', review:false,objective:35,demo:false, type:gameTypeEnum.TARGET},//133
            {name:'Galaxy Jumper',url:urlSet + 'galaxyJumper/',mapUrl:urlMap + 'galaxyJumper', sceneName:'galaxyJumper',subject:'Geography', review:false,objective:20,demo:false, type:gameTypeEnum.GRAB},//134
            {name:'Stomake',url:urlSet + 'stomake/',mapUrl:urlMap + 'stomake', sceneName:'stomake',subject:'sciencie', review:false,objective:30,demo:false, type:gameTypeEnum.GRAB},//135
            {name:'Scranimal',url:urlSet + 'scranimal/',mapUrl:urlMap + 'scranimal', sceneName:'scranimal',subject:'language', review:false,objective:50,demo:false, type:gameTypeEnum.SEQUENCE},//136
            {name:'Fruity Chaser',url:urlSet + 'fruityChaser/',mapUrl:urlMap + 'fruityChaser', sceneName:'fruityChaser',subject:'language', review:false,objective:30,demo:false, type:gameTypeEnum.TRACE},//137
            {name:'Pull The Monster',url:urlSet + 'pullTheMonster/',mapUrl:urlMap + 'pullTheMonster', sceneName:'pullTheMonster',subject:'sciencie', review:false,objective:15,demo:false, type:gameTypeEnum.TARGET},//138
            {name:'Color Jewel',url:urlSet + 'colorJewel/',mapUrl:urlMap + 'colorJewel', sceneName:'colorJewel',subject:'language', review:false,objective:50,demo:false, type:gameTypeEnum.CHOOSE},//139
            {name:'Pizza Lab',url:urlSet + 'pizzaLab/',mapUrl:urlMap + 'pizzaLab', sceneName:'pizzaLab',subject:'coding', review:false,objective:15,demo:false, type:gameTypeEnum.MATCH},//140
            {name:'Sweet Emotions',url:urlSet + 'sweetEmotions/',mapUrl:urlMap + 'sweetEmotions', sceneName:'sweetEmotions',subject:'language', review:false,objective:25,demo:false, type:gameTypeEnum.TRACE},//141
            {name:'Satellite',url:urlSet + 'satellite/',mapUrl:urlMap + 'satellite', sceneName:'satellite',subject:'coding', review:false,objective:15,demo:false, type:gameTypeEnum.MATCH},//142
            {name:'Gourmet Traveller',url:urlSet + 'gourmetTraveller/',mapUrl:urlMap + 'gourmetTraveller', sceneName:'gourmetTraveller',subject:'language', review:false,objective:20,demo:false, type:gameTypeEnum.CHOOSE},//143
            {name:'Beat O Matic',url:urlSet + 'beatOMatic/',mapUrl:urlMap + 'beatOMatic', sceneName:'beatOMatic',subject:'creativity', review:false,objective:10,demo:false, type:gameTypeEnum.SEQUENCE},//144
            {name:'Bee Travel',url:urlSet + 'beeTravel/',mapUrl:urlMap + 'beeTravel', sceneName:'beeTravel',subject:'sciencie', review:false,objective:15,demo:false, type:gameTypeEnum.TRACE},//145
            {name:'Flappitat',url:urlSet + 'flapitat/',mapUrl:urlMap + 'flapitat', sceneName:'flapitat',subject:'sciencie', review:false,objective:20,demo:false, type:gameTypeEnum.CHOOSE},//146
            {name:'OrbitalOrder',url:urlSet + 'orbitalOrder/',mapUrl:urlMap + 'orbitalOrder', sceneName:'orbitalOrder',subject:'Geography', review:false,objective:25,demo:false, type:gameTypeEnum.MATCH},//147
            {name:'Cheesy Maze',url:urlSet + 'cheesyMaze/',mapUrl:urlMap + 'cheesyMaze', sceneName:'cheesyMaze',subject:'health', review:false,objective:15,demo:false, type:gameTypeEnum.GRAB},//148
            {name:'Code Cake',url:urlSet + 'codeCake/',mapUrl:urlMap + 'codeCake', sceneName:'codeCake',subject:'coding', review:false,objective:15,demo:false, type:gameTypeEnum.MATCH},//149
            {name:'S Mart',url:urlSet + 'smart/',mapUrl:urlMap + 'smart', sceneName:'smart',subject:'coding', review:false,objective:15,demo:false, type:gameTypeEnum.MATCH},//150
            {name:'Y Factor',url:urlSet + 'Yfactor/',mapUrl:urlMap + 'Yfactor', sceneName:'Yfactor',subject:'creativity', review:false,objective:30,demo:false, type:gameTypeEnum.SEQUENCE},//151
            {name:'Smoothie Loops',url:urlSet + 'smoothieLoops/',mapUrl:urlMap + 'smoothieLoops', sceneName:'smoothieLoops',subject:'coding', review:false,objective:20,demo:false, type:gameTypeEnum.SEQUENCE},//152
            {name:'Bondroid',url:urlSet + 'bondroid/',mapUrl:urlMap + 'bondroid', sceneName:'bondroid',subject:'coding', review:false,objective:10,demo:false, type:gameTypeEnum.TRACE},//153
            {name:'Chiseler',url:urlSet + 'chiseler/',mapUrl:urlMap + 'chiseler', sceneName:'chiseler',subject:'creativity', review:false,objective:5,demo:false, type:gameTypeEnum.CHOOSE},//154
            {name:'Soccer Wheel',url:urlSet + 'soccerWheel/',mapUrl:urlMap + 'soccerWheel', sceneName:'soccerWheel',subject:'language', review:false,objective:20,demo:false, type:gameTypeEnum.TARGET},//155
            {name:'Tapchitect',url:urlSet + 'tapchitect/',mapUrl:urlMap + 'tapchitect', sceneName:'tapchitect',subject:'math', review:false,objective:10,demo:false, type:gameTypeEnum.MATCH},//156
            {name:'Picto Tribe',url:urlSet + 'pictoTribe/',mapUrl:urlMap + 'pictoTribe', sceneName:'pictoTribe',subject:'creativity', review:false,objective:25,demo:false, type:gameTypeEnum.MATCH},//157
            {name:'Tri Olimpics',url:urlSet + 'triOlimpics/',mapUrl:urlMap + 'triOlimpics', sceneName:'triOlimpics',subject:'health', review:false,objective:35,demo:false, type:gameTypeEnum.TARGET},//158
            {name:'Soil Sweeper',url:urlSet + 'soilSweeper/',mapUrl:urlMap + 'soilSweeper', sceneName:'soilSweeper',subject:'sustainability', review:false,objective:25,demo:false, type:gameTypeEnum.CHOOSE},//159
            {name:'Grave Matter',url:urlSet + 'graveMatter/',mapUrl:urlMap + 'graveMatter', sceneName:'graveMatter',subject:'health', review:false,objective:25,demo:false, type:gameTypeEnum.TRACE},//160
            {name:'Brain Rail',url:urlSet + 'brainRail/',mapUrl:urlMap + 'brainRail', sceneName:'brainRail',subject:'health', review:false,objective:30,demo:false, type:gameTypeEnum.MATCH},//161
            {name:'Tree Numbers',url:urlSet + 'treeNumbers/',mapUrl:urlMap + 'treeNumbers', sceneName:'treeNumbers',subject:'sustainability', review:false,objective:10,demo:false, type:gameTypeEnum.MATCH},//162
            {name:'Leak Tweak',url:urlSet + 'leakTweak/',mapUrl:urlMap + 'leakTweak', sceneName:'leakTweak',subject:'sustainability', review:false,objective:20,demo:false, type:gameTypeEnum.TARGET},//163
            {name:'Tower Buffet',url:urlSet + 'towerBuffet/',mapUrl:urlMap + 'towerBuffet', sceneName:'towerBuffet',subject:'health', review:false,objective:15,demo:false, type:gameTypeEnum.GRAB},//164
            {name:'Happypolis',url:urlSet + 'happypolis/',mapUrl:urlMap + 'happypolis', sceneName:'happypolis',subject:'sustainability', review:false,objective:10,demo:false, type:gameTypeEnum.TARGET},//165
            {name:'Spatial Overdrive',url:urlSet + 'spatialOverdrive/',mapUrl:urlMap + 'spatialOverdrive', sceneName:'spatialOverdrive',subject:'language', review:false,objective:20,demo:false, type:gameTypeEnum.CHOOSE},//166
            {name:'Sonar Ride',url:urlSet + 'sonarRide/',mapUrl:urlMap + 'sonarRide', sceneName:'sonarRide',subject:'health', review:false,objective:10,demo:false, type:gameTypeEnum.TARGET},//167
            {name:'Homework Rain',url:urlSet + 'homeworkRain/',mapUrl:urlMap + 'homeworkRain', sceneName:'homeworkRain',subject:'health', review:false,objective:20,demo:false, type:gameTypeEnum.MATCH},//168
            {name:'Forest Justice',url:urlSet + 'forestJustice/',mapUrl:urlMap + 'forestJustice', sceneName:'forestJustice',subject:'sustainability', review:false,objective:20,demo:false, type:gameTypeEnum.TARGET},//169
            {name:'Rock Orama',url:urlSet + 'rockOrama/',mapUrl:urlMap + 'rockOrama', sceneName:'rockOrama',subject:'creativity', review:false,objective:15,demo:false, type:gameTypeEnum.SEQUENCE},//170
            {name:'Squared Squares',url:urlSet + 'squaredSquares/',mapUrl:urlMap + 'squaredSquares', sceneName:'squaredSquares',subject:'health', review:false,objective:15,demo:false, type:gameTypeEnum.CHOOSE},//171
            {name:'Germ Strike',url:urlSet + 'germStrike/',mapUrl:urlMap + 'germStrike', sceneName:'germStrike',subject:'health', review:false,objective:30,demo:false, type:gameTypeEnum.CHOOSE},//172
            {name:'Artwist',url:urlSet + 'artwist/',mapUrl:urlMap + 'artwist', sceneName:'artwist',subject:'creativity', review:false,objective:10,demo:false, type:gameTypeEnum.CHOOSE},//173
            {name:'Hygiene Plus',url:urlSet + 'hygienePlus/',mapUrl:urlMap + 'hygienePlus', sceneName:'hygienePlus',subject:'language', review:false,objective:15,demo:false, type:gameTypeEnum.CHOOSE},//174
            {name:'Wild Feed',url:urlSet + 'wildFeed/',mapUrl:urlMap + 'wildFeed', sceneName:'wildFeed',subject:'sciencie', review:false,objective:30,demo:false, type:gameTypeEnum.CHOOSE},//175
            {name:'Cubetinent',url:urlSet + 'cubetinent/',mapUrl:urlMap + 'cubetinent', sceneName:'cubetinent',subject:'language', review:false,objective:10,demo:false, type:gameTypeEnum.MATCH},//176
            {name:'Color Invaders',url:urlSet + 'colorInvaders/',mapUrl:urlMap + 'colorInvaders', sceneName:'colorInvaders',subject:'language', review:false,objective:30,demo:false, type:gameTypeEnum.CHOOSE},//177
            {name:'Clean Crossing',url:urlSet + 'cleanCrossing/',mapUrl:urlMap + 'cleanCrossing', sceneName:'cleanCrossing',subject:'sustainability', review:false,objective:20,demo:false, type:gameTypeEnum.CHOOSE},//178
            {name:'Climb O Weight',url:urlSet + 'climbOWeight/',mapUrl:urlMap + 'climbOWeight', sceneName:'climbOWeight',subject:'sciencie', review:false,objective:25,demo:false, type:gameTypeEnum.MATCH},//179
            {name:'Water Gunner',url:urlSet + 'waterGunner/',mapUrl:urlMap + 'waterGunner', sceneName:'waterGunner',subject:'sciencie', review:false,objective:20,demo:false, type:gameTypeEnum.MATCH},//180
            {name:'Scary Shadows',url:urlSet + 'scaryShadows/',mapUrl:urlMap + 'scaryShadows', sceneName:'scaryShadows',subject:'sciencie', review:false, objective:15, demo:false, type:gameTypeEnum.MATCH},//181
            {name:'Tile A Roid',url:urlSet + 'tileARoid/',mapUrl:urlMap + 'tileARoid', sceneName:'tileARoid',subject:'language', review:false,objective:20,demo:false, type:gameTypeEnum.MATCH},//182
            {name:'Geondrian',url:urlSet + 'geondrian/',mapUrl:urlMap + 'geondrian', sceneName:'geondrian',subject:'creativity', review:false,objective:10,demo:false, type:gameTypeEnum.CHOOSE},//183
            {name:'Shapesody',url:urlSet + 'shapesody/',mapUrl:urlMap + 'shapesody', sceneName:'shapesody',subject:'creativity', review:false,objective:10,demo:false, type:gameTypeEnum.MATCH},//184
            {name:'Euro Flag',url:urlSet + 'euroFlag/',mapUrl:urlMap + 'euroFlag', sceneName:'euroFlag',subject:'geography', review:false,objective:20,demo:false, type:gameTypeEnum.MATCH},//185
            {name:'Puzzoole',url:urlSet + 'puzzoole/',mapUrl:urlMap + 'puzzoole', sceneName:'puzzoole',subject:'sciencie', review:false,objective:20,demo:false, type:gameTypeEnum.MATCH},//186
            {name:'Motion Slip',url:urlSet + 'motionSlip/',mapUrl:urlMap + 'motionSlip', sceneName:'motionSlip',subject:'creativity', review:false,objective:20,demo:false, type:gameTypeEnum.CHOOSE},//187
            {name:'Syncphony',url:urlSet + 'syncphony/',mapUrl:urlMap + 'syncphony', sceneName:'syncphony',subject:'creativity', review:false,objective:25,demo:false, type:gameTypeEnum.MATCH},//188
            {name:'Orbiturn',url:urlSet + 'orbiturn/',mapUrl:urlMap + 'orbiturn', sceneName:'orbiturn',subject:'math', review:false,objective:30,demo:false, type:gameTypeEnum.MATCH},//189
            {name:'Magic Spell',url:urlSet + 'magicSpell/',mapUrl:urlMap + 'magicSpell', sceneName:'magicSpell',subject:'language', review:false,objective:10,demo:false, type:gameTypeEnum.MATCH},//190
            {name:'Grammart',url:urlSet + 'grammart/',mapUrl:urlMap + 'grammart', sceneName:'grammart',subject:'language', review:false,objective:10,demo:false, type:gameTypeEnum.CHOOSE},//191
            {name:'Robotic Figures',url:urlSet + 'roboticFigures/',mapUrl:urlMap + 'roboticFigures', sceneName:'roboticFigures',subject:'creativity', review:false,objective:20,demo:false, type:gameTypeEnum.MATCH},//192
            {name:'Nestling Quest',url:urlSet + 'nestlingQuest/',mapUrl:urlMap + 'nestlingQuest', sceneName:'nestlingQuest',subject:'sciencie', review:false,objective:30,demo:false, type:gameTypeEnum.MATCH},//193
            {name:'Climbvoid',url:urlSet + 'climbvoid/',mapUrl:urlMap + 'climbvoid', sceneName:'climbvoid',subject:'creativity', review:false,objective:30,demo:false, type:gameTypeEnum.GRAB},//194
            {name:'Verte Who',url:urlSet + 'verteWho/',mapUrl:urlMap + 'verteWho', sceneName:'verteWho',subject:'sciencie', review:false,objective:15,demo:false, type:gameTypeEnum.MATCH},//195
            {name:'Word Blast',url:urlSet + 'wordBlast/',mapUrl:urlMap + 'wordBlast', sceneName:'wordBlast',subject:'language', review:false,objective:20,demo:false, type:gameTypeEnum.SEQUENCE},//196
            {name:'Address In Town',url:urlSet + 'addressInTown/',mapUrl:urlMap + 'addressInTown', sceneName:'addressInTown',subject:'geography', review:false,objective:30,demo:false, type:gameTypeEnum.SEQUENCE},//197
            {name:'Deliver In Town',url:urlSet + 'deliverInTown/',mapUrl:urlMap + 'deliverInTown', sceneName:'deliverInTown',subject:'coding', review:false,objective:20,demo:false, type:gameTypeEnum.SEQUENCE},//198
            {name:'Chainge',url:urlSet + 'chainge/',mapUrl:urlMap + 'chainge', sceneName:'chainge',subject:'math', review:false,objective:20,demo:false, type:gameTypeEnum.TRACE},//199
            {name:'Greet Chirp',url:urlSet + 'greetChirp/',mapUrl:urlMap + 'greetChirp', sceneName:'greetChirp',subject:'language', review:false,objective:20,demo:false, type:gameTypeEnum.CHOOSE},//200
            {name:'Icy Rush',url:urlSet + 'icyRush/',mapUrl:urlMap + 'icyRush', sceneName:'icyRush',subject:'sustainability', review:false,objective:25,demo:false, type:gameTypeEnum.CHOOSE},//201
            {name:'Sports Ball',url:urlSet + 'sportsBall/',mapUrl:urlMap + 'sportsBall', sceneName:'sportsBall',subject:'health', review:false,objective:25,demo:false, type:gameTypeEnum.TARGET},//202
            {name:'Quake Run',url:urlSet + 'quakeRun/',mapUrl:urlMap + 'quakeRun', sceneName:'quakeRun',subject:'health', review:false,objective:15,demo:false, type:gameTypeEnum.TAP},//203
            {name:'Tidygram',url:urlSet + 'tidygram/',mapUrl:urlMap + 'tidygram', sceneName:'tidygram',subject:'language', review:false,objective:15,demo:false, type:gameTypeEnum.MATCH},//204
            {name:'Gift Figures',url:urlSet + 'giftFigures/',mapUrl:urlMap + 'giftFigures', sceneName:'giftFigures',subject:'language', review:false,objective:30,demo:false, type:gameTypeEnum.MATCH},//205
            {name:'Anatomeal',url:urlSet + 'anatomeal/',mapUrl:urlMap + 'anatomeal', sceneName:'anatomeal',subject:'health', review:false,objective:20,demo:false, type:gameTypeEnum.MATCH},//206
            {name:'Solar City',url:urlSet + 'solarCity/',mapUrl:urlMap + 'solarCity', sceneName:'solarCity',subject:'sustainability', review:false,objective:20,demo:false, type:gameTypeEnum.MATCH},//207
            {name:'Milk Shake',url:urlSet + 'milkShake/',mapUrl:urlMap + 'milkShake', sceneName:'milkShake',subject:'language', review:false,objective:20,demo:false, type:gameTypeEnum.CHOOSE},//208
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