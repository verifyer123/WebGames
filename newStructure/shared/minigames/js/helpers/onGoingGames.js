
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

var onGoingGames={
	
    config:{
		tutorial:"withstars"
	},
    
    minigames:[
			{name:'Addition Dojo',url:'additiondojo/',mapUrl:'AdditionDojo', sceneName:'dojo',subject:'math',review:false,objective:15,demo:false,type:gameTypeEnum.COUNT},
			{name:'Space Words',url:'spaceWords/',mapUrl:'spaceWords', sceneName:'space',subject:'language',review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},
			{name:'Water Morphosis',url:'waterMorph/',mapUrl:'waterMorph', sceneName:'water',subject:'science',review:false,objective:40,demo:false,type:gameTypeEnum.MATCH},
			{name:'Ice Cream Numbers',url:'numberIce/',mapUrl:'numberIce', sceneName:'ice',subject:'math',review:false,objective:10,demo:false,type:gameTypeEnum.COUNT},
			{name:'Salad Cards',url:'tapcards/',mapUrl:'tapcards', sceneName:'tapcards',subject:'language',review:false,objective:30,demo:false,type:gameTypeEnum.MATCH},
			{name:'Sky Language',url:'skyLanguage/',mapUrl:'skyLanguage', sceneName:'skyLanguage',subject:'language',review:true,objective:15,demo:false,type:gameTypeEnum.CHOOSE},
			{name:'Flag Runner',url:'flagRunner/',mapUrl:'flagRunner', sceneName:'flag',subject:'geography',review:true,objective:15,demo:false,type:gameTypeEnum.MATCH},
			{name:'Rift Land',url:'riftLand/',mapUrl:'riftLand', sceneName:'rift',subject:'coding',review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},
			{name:'Puzzle Road',url:'puzzleRoad/',mapUrl:'puzzleRoad', sceneName:'puzzle',subject:'creativity',review:true,objective:25,demo:false,type:gameTypeEnum.MATCH},
			{name:'Geo Journey',url:'geoJourney/',mapUrl:'geoJourney', sceneName:'geoJourney',subject:'geography',review:false,objective:20,demo:false,type:gameTypeEnum.GRAB},
			{name:'Memonumbers',url:'memoNumbers/',mapUrl:'memoNumbers', sceneName:'memo',subject:'math',review:true,objective:40,demo:false,type:gameTypeEnum.MATCH},
			{name:'Beach Ninja',url:'beachNinja/',mapUrl:'beachNinja', sceneName:'beach',subject:'math',review:true,objective:15,demo:false,type:gameTypeEnum.CHOOSE},
			{name:'Flying Fractions',url:'flyingFractions/',mapUrl:'flyingFractions', sceneName:'flyingFractions',subject:'math',review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},
			{name:'Color Attack',url:'colorAttack/',mapUrl:'colorAttack', sceneName:'color',subject:'creativity',review:true,objective:15,demo:false,type:gameTypeEnum.MATCH},
			{name:'Nutricanon',url:'nutriCanon/',mapUrl:'nutriCanon', sceneName:'nutri',subject:'health',review:true,objective:20,demo:false,type:gameTypeEnum.TARGET},
			{name:'Microdefender',url:'microdefender/',mapUrl:'microdefender', sceneName:'microdefender',subject:'health',review:true,objective:30,demo:false,type:gameTypeEnum.GRAB},
			{name:'Healthy Collector',url:'healthyCollector/',mapUrl:'healthyCollector', sceneName:'healthyCollector',subject:'health',review:false,objective:30,demo:false,type:gameTypeEnum.GRAB},
			{name:'Croak Song',url:'CroakSong/',mapUrl:'CroakSong', sceneName:'CroakSong',subject:'creativity',review:true,objective:40,demo:false,type:gameTypeEnum.SEQUENCE},
			{name:'Tilt Sprout',url:'tiltSprout/',mapUrl:'tiltSprout', sceneName:'tilt',subject:'science',review:true,objective:10,demo:false,type:gameTypeEnum.GRAB},
			{name:'Culture Icons',url:'cultureIcons/',mapUrl:'cultureIcons', sceneName:'culture',subject:'geography',review:true,objective:20,demo:false,type:gameTypeEnum.MATCH},
			{name:'Dizzy Boat',url:'dizzyBoat/',mapUrl:'dizzyBoat', sceneName:'dizzy',subject:'geography',review:true,objective:15,demo:false,type:gameTypeEnum.TARGET},
			{name:'Flag Collector',url:'flagCollector/',mapUrl:'flagCollector', sceneName:'flagCollector',subject:'geography',review:true,objective:15,demo:false,type:gameTypeEnum.CHOOSE},
			{name:'Medicatcher',url:'mediCatcher/',mapUrl:'mediCatcher', sceneName:'medi',subject:'health',review:false,objective:30,demo:false,type:gameTypeEnum.GRAB},
			{name:'Wild Snaps',url:'wildSnaps/',mapUrl:'wildSnaps', sceneName:'wild',subject:'creativity',review:true,objective:15,demo:false,type:gameTypeEnum.TARGET},
			{name:'Gemath',url:'geMath/',mapUrl:'geMath', sceneName:'gem',subject:'math',review:true,objective:15,demo:false,type:gameTypeEnum.TRACE},
			{name:'Hackamole',url:'hackaMole/',mapUrl:'hackaMole', sceneName:'hack',subject:'coding',review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},
			{name:'Lizart',url:'lizart/',mapUrl:'lizart', sceneName:'lizart',subject:'language',review:true,objective:20,demo:false,type:gameTypeEnum.MATCH},
			{name:'Snooze Crater',url:'snoozeCrater/',mapUrl:'snoozeCrater', sceneName:'snooze',subject:'sustainability',review:true,objective:10,demo:false,type:gameTypeEnum.GRAB},//29
			{name:'Math Feed',url:'mathFeed/',mapUrl:'mathFeed', sceneName:'feed',subject:'math',review:false,objective:25,demo:false,type:gameTypeEnum.MATCH},//30
			{name:'Galaxy Heroes',url:'galaxyHeroes/',mapUrl:'galaxyHeroes', sceneName:'galaxy',subject:'geography',review:true,objective:20,demo:false,type:gameTypeEnum.GRAB},//31
			{name:'Pop Fish',url:'popFish/',mapUrl:'popFish', sceneName:'fish',subject:'math',review:true,objective:15,demo:false,type:gameTypeEnum.GRAB},//32
			{name:'Bouncy Bath',url:'bouncybath/',mapUrl:'bouncybath', sceneName:'bouncybath',subject:'health',review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//33
			{name:'Acorn Numbers',url:'acornNumbers/',mapUrl:'acornNumbers', sceneName:'acorn',subject:'math',review:true,objective:30,demo:true,type:gameTypeEnum.CHOOSE},//34
			{name:'Popsteroids',url:'popSteroids/',mapUrl:'popSteroids', sceneName:'popScene',subject:'math',review:true,objective:40,demo:false,type:gameTypeEnum.MATCH},//35
			{name:'Candy Shapes',url:'candyShapes/',mapUrl:'candyShapes', sceneName:'candy',subject:'math',review:true,objective:40,demo:false,type:gameTypeEnum.MATCH},//36
			{name:'Feather Shelter',url:'featherShelter/',mapUrl:'featherShelter', sceneName:'feather',subject:'math',review:false,objective:10,demo:false,type:gameTypeEnum.COUNT},//37
			{name:'Math Circus',url:'mathCircus/',mapUrl:'mathCircus', sceneName:'circus',subject:'math',review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},//38
			{name:'Flight o Clock',url:'flightoclock/',mapUrl:'flightoclock', sceneName:'flightoclock',subject:'math',review:true,objective:25,demo:false,type:gameTypeEnum.MATCH},//39
			{name:'Clash Critters',url:'clashCritters/',mapUrl:'clashCritters', sceneName:'clash',subject:'math',review:true,objective:50,demo:false,type:gameTypeEnum.CHOOSE},//40
			{name:'Math Port',url:'mathPort/',mapUrl:'mathPort', sceneName:'port',subject:'math',review:true,objective:30,demo:false,type:gameTypeEnum.CHOOSE},//41
			{name:'Pizza Fraction',url:'pizzafraction/',mapUrl:'pizzafraction', sceneName:'pizzafraction',subject:'math',review:true,objective:25,demo:false,type:gameTypeEnum.MATCH},//42
			{name:'Hungry Toads',url:'hungryToads/',mapUrl:'hungryToads', sceneName:'hungry',subject:'math',review:true,objective:25,demo:false,type:gameTypeEnum.CHOOSE},//43
			{name:'Sky Tap',url:'skyTap/',mapUrl:'skyTap', sceneName:'sky',subject:'math' ,review:true,objective:30,demo:false,type:gameTypeEnum.COUNT},//44
			{name:'Evening',url:'evening/',mapUrl:'evening', sceneName:'evening',subject:'math', review:true,objective:40,demo:false,type:gameTypeEnum.MATCH},//45
			{name:'Minmax Duel',url:'minmaxduel/',mapUrl:'minmaxduel', sceneName:'minmaxduel',subject:'math', review:true,objective:15,demo:false,type:gameTypeEnum.CHOOSE},//46
			{name:'Math Invader',url:'mathInvader/',mapUrl:'mathInvader', sceneName:'invader',subject:'math', review:true,objective:30,demo:false,type:gameTypeEnum.SEQUENCE},//47
			{name:'Locksmath',url:'locksmath/',mapUrl:'locksmath', sceneName:'lock',subject:'math', review:true,objective:50,demo:false,type:gameTypeEnum.MATCH},//48
			{name:'Magic Gate',url:'magicGate/',mapUrl:'magicGate', sceneName:'magicGate',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},//49
			{name:'Lucky Numbers',url:'luckynumber/',mapUrl:'luckynumber', sceneName:'luckynumber',subject:'math', review:true,objective:10,demo:false,type:gameTypeEnum.MATCH},//50
			{name:'Robovet',url:'robovet/',mapUrl:'robovet', sceneName:'robo',subject:'math', review:true,objective:30,demo:false,type:gameTypeEnum.CHOOSE},//51
			{name:'Math Bomb',url:'mathBomb/',mapUrl:'mathBomb', sceneName:'bomb',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.MATCH},//52
			{name:'Countipede',url:'countipede/',mapUrl:'countipede', sceneName:'countip',subject:'math', review:true,objective:35,demo:false,type:gameTypeEnum.COUNT},//54
			{name:'Toy Figures',url:'toyfigure/',mapUrl:'toyfigure', sceneName:'toyfigure',subject:'math', review:true,objective:25,demo:false,type:gameTypeEnum.MATCH},//55
			{name:'Jelly Jump',url:'jellyJump/',mapUrl:'jellyJump', sceneName:'jelly',subject:'math', review:false,objective:10,demo:false,type:gameTypeEnum.COUNT},//56
			{name:'Squat Count',url:'squatCount/',mapUrl:'squatCount', sceneName:'squat',subject:'math', review:true,objective:10,demo:false,type:gameTypeEnum.COUNT},//57
			{name:'Baxtion',url:'baxtion/',mapUrl:'baxtion', sceneName:'bax',subject:'math', review:true,objective:10,demo:false,type:gameTypeEnum.COUNT},//58
			{name:'Mathgic Hat',url:'mathgicHat/',mapUrl:'mathgicHat', sceneName:'magic',subject:'math', review:true,objective:25,demo:false,type:gameTypeEnum.CHOOSE},//59
			{name:'Seaquence',url:'seaquence/',mapUrl:'seaquence', sceneName:'seaquence',subject:'math', review:true,objective:30,demo:false,type:gameTypeEnum.SEQUENCE},//60
			{name:'Clock Fix',url:'clockfix/',mapUrl:'clockfix', sceneName:'clockfix',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.MATCH},//61
			{name:'Math Engine',url:'mathEngine/',mapUrl:'mathEngine', sceneName:'engine',subject:'math', review:true,objective:25,demo:false,type:gameTypeEnum.CHOOSE},//62
			{name:'Astronometric',url:'astronoMetric/',mapUrl:'astronoMetric', sceneName:'astrono',subject:'math', review:true,objective:15,demo:false,type:gameTypeEnum.TRACE},//63
			{name:'Jumptiply',url:'jumptiply/',mapUrl:'jumptiply', sceneName:'jump',subject:'math', review:true,objective:25,demo:false,type:gameTypeEnum.CHOOSE},//64
			{name:'Swamp Shapes',url:'swampShape/',mapUrl:'swampShape', sceneName:'swampShape',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.TRACE},//65
			{name:'Duck Count',url:'duckCount/',mapUrl:'duckCount', sceneName:'duck',subject:'math', review:true,objective:10,demo:false,type:gameTypeEnum.SEQUENCE},//66
			{name:'Monster Dungeon',url:'monsterDungeon/',mapUrl:'monsterDungeon', sceneName:'monsterDungeon',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},//67
			{name:'Nacho Smacho',url:'nachoSmacho/',mapUrl:'nachoSmacho', sceneName:'nacho',subject:'math', review:true,objective:25,demo:false,type:gameTypeEnum.COUNT},//68
			{name:'Stackathon',url:'stackathon/',mapUrl:'stackathon', sceneName:'stack',subject:'math', review:true,objective:30,demo:false,type:gameTypeEnum.CHOOSE},//69
			{name:'Geometry Warp',url:'geometryWarp/',mapUrl:'geometryWarp', sceneName:'geometry',subject:'math', review:true,objective:30,demo:false,type:gameTypeEnum.MATCH},//70
			{name:'Mathrioska',url:'mathrioska/',mapUrl:'mathrioska', sceneName:'mathrioska',subject:'math', review:true,objective:30,demo:false,type:gameTypeEnum.CHOOSE},//71
			{name:'Aracnumber',url:'aracnumber/',mapUrl:'aracnumber', sceneName:'aracnumber',subject:'math', review:true,objective:15,demo:false,type:gameTypeEnum.SEQUENCE},//72
			{name:'Dusk Defense',url:'duskDefense/',mapUrl:'duskDefense', sceneName:'dusk',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.TARGET},//73
			{name:'zucaritas',url:'zucaritas/',mapUrl:'zucaritas', sceneName:'zucaritas',subject:'geography', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//74 K
			{name:'Divisubmarine',url:'diviSubmarine/',mapUrl:'diviSubmarine', sceneName:'divisubmarine',subject:'math', review:false,objective:30,demo:false,type:gameTypeEnum.CHOOSE},//75
			{name:'Float and Count',url:'floatAndCount/',mapUrl:'floatAndCount', sceneName:'float',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.SEQUENCE},//77
			{name:'Space Count',url:'SpaceCount/',mapUrl:'SpaceCount', sceneName:'spaceCount',subject:'math', review:true,objective:15,demo:false,type:gameTypeEnum.COUNT},//78
			{name:'Loop Roll',url:'loopRoll/',mapUrl:'loopRoll', sceneName:'loop',subject:'math', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//79 K
			{name:'Melvin Travel',url:'melvinTravel/',mapUrl:'melvinTravel', sceneName:'melvin',subject:'geography', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//80 K
			{name:'Paper Ships',url:'paperShips/',mapUrl:'paperShips', sceneName:'paper',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.TARGET},//81
			{name:'FrooTemple',url:'frooTemple/',mapUrl:'frooTemple', sceneName:'frootemple',subject:'math', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//82 K
			{name:'Fractiorama',url:'fractiorama/',mapUrl:'fractiorama', sceneName:'frac',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.MATCH},//83
			{name:'Frosty Run',url:'frostyRun/',mapUrl:'frostyRun', sceneName:'frosty',subject:'math', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//84 K
			{name:'Geo Tunnel',url:'geoTunnel/',mapUrl:'geoTunnel', sceneName:'geotunnel',subject:'math', review:true,objective:15,demo:false,type:gameTypeEnum.MATCH},//85
			{name:'Hover Ride',url:'hoverRide/',mapUrl:'hoverRide', sceneName:'hover',subject:'math', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//86 K
			{name:'Cereal Buffet',url:'cerealBuffet/',mapUrl:'cerealBuffet', sceneName:'cereal',subject:'math', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//87 K
			{name:'Froot Math',url:'frootMath/',mapUrl:'frootMath', sceneName:'frootMath',subject:'math', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//88 K
			{name:'Pirate Pieces',url:'piratePieces/',mapUrl:'piratePieces', sceneName:'piratePieces',subject:'math', review:true,objective:15,demo:false,type:gameTypeEnum.COUNT},// 89
			{name:'Triangrid',url:'triangrid/',mapUrl:'triangrid', sceneName:'triangrid',subject:'math', review:false,objective:20,demo:false,type:gameTypeEnum.MATCH},// 90
			{name:'iMagic',url:'iMagic/',mapUrl:'iMagic', sceneName:'imagic',subject:'math', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//91
			{name:'Ms NomNom',url:'msNomNom/',mapUrl:'msNomNom', sceneName:'ms',subject:'math', review:true,objective:15,demo:false,type:gameTypeEnum.GRAB},//92
			{name:'FrutiLluvia',url:'frutiLluvia/',mapUrl:'frutiLluvia', sceneName:'fruti',subject:'math', review:false,objective:3,demo:false,type:gameTypeEnum.CHOOSE},//93
			{name:'Dr Zombie',url:'drZombie/',mapUrl:'drZombie', sceneName:'drzombie',subject:'health', review:false,objective:20,demo:true,type:gameTypeEnum.MATCH},//94
			{name:'Cog Count',url:'cogCount/',mapUrl:'cogCount', sceneName:'cog',subject:'math', review:true,objective:50,demo:false,type:gameTypeEnum.COUNT},//96
			{name:'Galactic Pool',url:'galacticPool/',mapUrl:'galacticPool', sceneName:'galactic',subject:'geography', review:true,objective:10,demo:false,type:gameTypeEnum.SEQUENCE},//97
			{name:'River Rescue',url:'riverRescue/',mapUrl:'riverRescue', sceneName:'riverRescue',subject:'sustainability', review:true,objective:5,demo:false,type:gameTypeEnum.GRAB},//99
			{name:'Garbage Diving',url:'garbageDiving/',mapUrl:'garbageDiving', sceneName:'garbageDiving',subject:'sustainability', review:true,objective:5,demo:false,type:gameTypeEnum.GRAB},//101
			{name:'Space Vaccum',url:'spaceVaccum/',mapUrl:'spaceVaccum', sceneName:'spaceVaccum',subject:'sustainability', review:true,objective:5,demo:false,type:gameTypeEnum.GRAB},//102
			{name:'Garbage Mole',url:'garbageMole/',mapUrl:'garbageMole', sceneName:'mole',subject:'sustainability', review:true,objective:5,demo:false,type:gameTypeEnum.GRAB},//103
			{name:'Elemental Witch',url:'elementalWitch/',mapUrl:'elementalWitch', sceneName:'elemental',subject:'creativity', review:true,objective:15,demo:true,type:gameTypeEnum.CHOOSE},//104
			{name:'Milky Saloon',url:'milkySaloon/',mapUrl:'milkySaloon', sceneName:'milky',subject:'coding', review:false,objective:20,demo:false,type:gameTypeEnum.CHOOSE},//105
			{name:'Calendrigon',url:'calendrigon/',mapUrl:'calendrigon', sceneName:'calendrigon',subject:'math', review:false,objective:10,demo:false,type:gameTypeEnum.MATCH},//106
		   {name:'Symfunny',url:'symfunny/',mapUrl:'symfunny', sceneName:'symfunny',subject:'creativity', review:false,objective:15,demo:false,type:gameTypeEnum.SEQUENCE},//107
			{name:'Shot Put',url:'shotPut/',mapUrl:'shotPut', sceneName:'shotPut',subject:'sciencie', review:false,objective:10,demo:false,type:gameTypeEnum.MATCH},//108
			{name:'Dino Dig',url:'dinoDigger/',mapUrl:'dinoDigger', sceneName:'dino',subject:'sciencie', review:false,objective:35,demo:false,type:gameTypeEnum.CHOOSE},//109
		   {name:'Animal Route',url:'animalRoute/',mapUrl:'animalRoute', sceneName:'animalRoute',subject:'sciencie', review:false,objective:10,demo:false,type:gameTypeEnum.CHOOSE},//110
		   {name:'Smoke Buster',url:'smokeBuster/',mapUrl:'smokeBuster', sceneName:'smokeBusters',subject:'sustainability', review:false,objective:25,demo:false,type:gameTypeEnum.GRAB},//112
		   {name:'Milky Bar',url:'milkyBar/',mapUrl:'milkyBar', sceneName:'milkyBar',subject:'coding', review:false,objective:25,demo:false,type:gameTypeEnum.MATCH},//113
		   {name:'Color Scientist',url:'colorScientist/',mapUrl:'colorScientist', sceneName:'colorScientist',subject:'creativity', review:false,objective:30,demo:false,type:gameTypeEnum.CHOOSE},//114
		   {name:'Where Is My',url:'whereIsMy/',mapUrl:'whereIsMy', sceneName:'whereIsMy',subject:'language', review:false,objective:25,demo:false,type:gameTypeEnum.GRAB},//115
		   {name:'H2Orbit',url:'H2Orbit/',mapUrl:'H2Orbit', sceneName:'H2Orbit',subject:'sciencie', review:false,objective:40,demo:false,type:gameTypeEnum.MATCH},//116
		   {name:'Fridge',url:'fridge/',mapUrl:'fridge', sceneName:'fridge',subject:'health', review:false,objective:25,demo:false,type:gameTypeEnum.MATCH},//117
		   {name:'Sympho Master',url:'symphoMaster/',mapUrl:'symphoMaster', sceneName:'symphoMaster',subject:'creativity', review:false,objective:15,demo:false,type:gameTypeEnum.MATCH},//118
		   {name:'Rabbit Trace',url:'rabitTrace/',mapUrl:'rabitTrace', sceneName:'rabitTrace',subject:'sciencie', review:false,objective:15,demo:false,type:gameTypeEnum.TRACE},//120
		   {name:'Noisy Monsters',url:'noisyMonsters/',mapUrl:'noisyMonsters', sceneName:'noisyMonsters',subject:'sustainability', review:false,objective:25,demo:false,type:gameTypeEnum.MATCH},//121
		   {name:'Balance Science',url:'balanceScience/',mapUrl:'balanceScience', sceneName:'balanceScience',subject:'sciencie', review:false,objective:15,demo:false,type:gameTypeEnum.MATCH},//122
		   {name:'Liquidungeon',url:'liquidungeon/',mapUrl:'liquidungeon', sceneName:'liquidungeon',subject:'sciencie', review:false,objective:40,demo:false,type:gameTypeEnum.CHOOSE},//123
		   {name:'Green Rescue',url:'greenRescue/',mapUrl:'greenRescue', sceneName:'greenRescue',subject:'sustainability', review:false,objective:10,demo:false,type:gameTypeEnum.MATCH},//124
		   {name:'Lake Strike',url:'lakeStrike/',mapUrl:'lakeStrike', sceneName:'lakeStrike',subject:'sustainability', review:false,objective:30,demo:false,type:gameTypeEnum.TARGET},//125
		   {name:'Noisy Streets',url:'noisyStreets/',mapUrl:'noisyStreets', sceneName:'noisyStreets',subject:'sustainability', review:false,objective:15,demo:false,type:gameTypeEnum.MATCH},//126
		   {name:'Continental Puzzle',url:'continentalPuzzle/',mapUrl:'continentalPuzzle',sceneName:'continentalPuzzle',subject:'geography',review:false,objective:15,demo:false,type:gameTypeEnum.CHOOSE},//127
		   {name:'Geo Beat',url:'geoBeat/',mapUrl:'geoBeat', sceneName:'geoBeat',subject:'geography', review:false,objective:25,demo:false,type:gameTypeEnum.SEQUENCE},//128
		   {name:'Mirror World',url:'mirrorWorld/',mapUrl:'mirrorWorld', sceneName:'mirrorWorld',subject:'creativity', review:false,objective:10,demo:false,type:gameTypeEnum.MATCH},//129
		   {name:'Solar Wing',url:'solarWing/',mapUrl:'solarWing', sceneName:'solarWing',subject:'sustainability', review:false,objective:30,demo:false,type:gameTypeEnum.CHOOSE},//130
		   {name:'Face Ahoy',url:'faceAhoy/',mapUrl:'faceAhoy', sceneName:'faceAhoy',subject:'language', review:false,objective:30,demo:false,type:gameTypeEnum.MATCH},//131
		   {name:'Hack A Ton',url:'hackATon/',mapUrl:'hackATon', sceneName:'hackATon',subject:'coding', review:false,objective:20,demo:false,type:gameTypeEnum.CHOOSE},//132
		   {name:'Solar Shield Squad',url:'solarShieldSquad/',mapUrl:'solarShieldSquad', sceneName:'solarShieldSquad',subject:'Geography', review:false,objective:35,demo:false, type:gameTypeEnum.TARGET},//133
		   {name:'Galaxy Jumper',url:'galaxyJumper/',mapUrl:'galaxyJumper', sceneName:'galaxyJumper',subject:'Geography', review:false,objective:20,demo:false, type:gameTypeEnum.GRAB},//134
		   {name:'Stomake',url:'stomake/',mapUrl:'stomake', sceneName:'stomake',subject:'sciencie', review:false,objective:30,demo:false, type:gameTypeEnum.GRAB},//135
		   {name:'Scranimal',url:'scranimal/',mapUrl:'scranimal', sceneName:'scranimal',subject:'language', review:false,objective:50,demo:false, type:gameTypeEnum.SEQUENCE},//136
		   {name:'Fruity Chaser',url:'fruityChaser/',mapUrl:'fruityChaser', sceneName:'fruityChaser',subject:'language', review:false,objective:30,demo:false, type:gameTypeEnum.TRACE},//137
		   {name:'Pull The Monster',url:'pullTheMonster/',mapUrl:'pullTheMonster', sceneName:'pullTheMonster',subject:'sciencie', review:false,objective:15,demo:false, type:gameTypeEnum.TARGET},//138
		   {name:'Color Jewel',url:'colorJewel/',mapUrl:'colorJewel', sceneName:'colorJewel',subject:'language', review:false,objective:50,demo:false, type:gameTypeEnum.CHOOSE},//139
		   {name:'Pizza Lab',url:'pizzaLab/',mapUrl:'pizzaLab', sceneName:'pizzaLab',subject:'coding', review:false,objective:15,demo:false, type:gameTypeEnum.MATCH},//140
		   {name:'Sweet Emotions',url:'sweetEmotions/',mapUrl:'sweetEmotions', sceneName:'sweetEmotions',subject:'language', review:false,objective:25,demo:false, type:gameTypeEnum.TRACE},//141
		   {name:'Satellite',url:'satellite/',mapUrl:'satellite', sceneName:'satellite',subject:'coding', review:false,objective:15,demo:false, type:gameTypeEnum.MATCH},//142
		   {name:'Gourmet Traveller',url:'gourmetTraveller/',mapUrl:'gourmetTraveller', sceneName:'gourmetTraveller',subject:'language', review:false,objective:20,demo:false, type:gameTypeEnum.CHOOSE},//143
		   {name:'Beat O Matic',url:'beatOMatic/',mapUrl:'beatOMatic', sceneName:'beatOMatic',subject:'creativity', review:false,objective:10,demo:false, type:gameTypeEnum.SEQUENCE},//144
		   {name:'Bee Travel',url:'beeTravel/',mapUrl:'beeTravel', sceneName:'beeTravel',subject:'sciencie', review:false,objective:15,demo:false, type:gameTypeEnum.TRACE},//145
		   {name:'Flappitat',url:'flapitat/',mapUrl:'flapitat', sceneName:'flapitat',subject:'sciencie', review:false,objective:20,demo:false, type:gameTypeEnum.CHOOSE},//146
		   {name:'OrbitalOrder',url:'orbitalOrder/',mapUrl:'orbitalOrder', sceneName:'orbitalOrder',subject:'Geography', review:false,objective:25,demo:false, type:gameTypeEnum.MATCH},//147
		   {name:'Cheesy Maze',url:'cheesyMaze/',mapUrl:'cheesyMaze', sceneName:'cheesyMaze',subject:'health', review:false,objective:15,demo:false, type:gameTypeEnum.GRAB},//148
		   {name:'Code Cake',url:'codeCake/',mapUrl:'codeCake', sceneName:'codeCake',subject:'coding', review:false,objective:15,demo:false, type:gameTypeEnum.MATCH},//149
		   {name:'S Mart',url:'smart/',mapUrl:'smart', sceneName:'smart',subject:'coding', review:false,objective:15,demo:false, type:gameTypeEnum.MATCH},//150
		   {name:'Y Factor',url:'Yfactor/',mapUrl:'Yfactor', sceneName:'Yfactor',subject:'creativity', review:false,objective:30,demo:false, type:gameTypeEnum.SEQUENCE},//151
		   {name:'Smoothie Loops',url:'smoothieLoops/',mapUrl:'smoothieLoops', sceneName:'smoothieLoops',subject:'coding', review:false,objective:20,demo:false, type:gameTypeEnum.SEQUENCE},//152
		   {name:'Bondroid',url:'bondroid/',mapUrl:'bondroid', sceneName:'bondroid',subject:'coding', review:false,objective:10,demo:false, type:gameTypeEnum.TRACE},//153
		   {name:'Chiseler',url:'chiseler/',mapUrl:'chiseler', sceneName:'chiseler',subject:'creativity', review:false,objective:5,demo:false, type:gameTypeEnum.CHOOSE},//154
		   {name:'Soccer Wheel',url:'soccerWheel/',mapUrl:'soccerWheel', sceneName:'soccerWheel',subject:'language', review:false,objective:20,demo:false, type:gameTypeEnum.TARGET},//155
		   {name:'Tapchitect',url:'tapchitect/',mapUrl:'tapchitect', sceneName:'tapchitect',subject:'math', review:false,objective:10,demo:false, type:gameTypeEnum.MATCH},//156
		   {name:'Picto Tribe',url:'pictoTribe/',mapUrl:'pictoTribe', sceneName:'pictoTribe',subject:'creativity', review:false,objective:25,demo:false, type:gameTypeEnum.MATCH},//157
		   {name:'Tri Olimpics',url:'triOlimpics/',mapUrl:'triOlimpics', sceneName:'triOlimpics',subject:'health', review:false,objective:35,demo:false, type:gameTypeEnum.TARGET},//158
		   {name:'Soil Sweeper',url:'soilSweeper/',mapUrl:'soilSweeper', sceneName:'soilSweeper',subject:'sustainability', review:false,objective:25,demo:false, type:gameTypeEnum.CHOOSE},//159
		   {name:'Grave Matter',url:'graveMatter/',mapUrl:'graveMatter', sceneName:'graveMatter',subject:'health', review:false,objective:25,demo:false, type:gameTypeEnum.TRACE},//160
		   {name:'Brain Rail',url:'brainRail/',mapUrl:'brainRail', sceneName:'brainRail',subject:'health', review:false,objective:30,demo:false, type:gameTypeEnum.MATCH},//161
		   {name:'Tree Numbers',url:'treeNumbers/',mapUrl:'treeNumbers', sceneName:'treeNumbers',subject:'sustainability', review:false,objective:10,demo:false, type:gameTypeEnum.MATCH},//162
		   {name:'Leak Tweak',url:'leakTweak/',mapUrl:'leakTweak', sceneName:'leakTweak',subject:'sustainability', review:false,objective:20,demo:false, type:gameTypeEnum.TARGET},//163
		   {name:'Tower Buffet',url:'towerBuffet/',mapUrl:'towerBuffet', sceneName:'towerBuffet',subject:'health', review:false,objective:15,demo:false, type:gameTypeEnum.GRAB},//164
		   {name:'Happypolis',url:'happypolis/',mapUrl:'happypolis', sceneName:'happypolis',subject:'sustainability', review:false,objective:10,demo:false, type:gameTypeEnum.TARGET},//165
		   {name:'Spatial Overdrive',url:'spatialOverdrive/',mapUrl:'spatialOverdrive', sceneName:'spatialOverdrive',subject:'language', review:false,objective:20,demo:false, type:gameTypeEnum.CHOOSE},//166
		   {name:'Sonar Ride',url:'sonarRide/',mapUrl:'sonarRide', sceneName:'sonarRide',subject:'health', review:false,objective:10,demo:false, type:gameTypeEnum.TARGET},//167
		   {name:'Homework Rain',url:'homeworkRain/',mapUrl:'homeworkRain', sceneName:'homeworkRain',subject:'health', review:false,objective:20,demo:false, type:gameTypeEnum.MATCH},//168
		   {name:'Forest Justice',url:'forestJustice/',mapUrl:'forestJustice', sceneName:'forestJustice',subject:'sustainability', review:false,objective:20,demo:false, type:gameTypeEnum.TARGET},//169
		   {name:'Rock Orama',url:'rockOrama/',mapUrl:'rockOrama', sceneName:'rockOrama',subject:'creativity', review:false,objective:15,demo:false, type:gameTypeEnum.SEQUENCE},//170
		   {name:'Squared Squares',url:'squaredSquares/',mapUrl:'squaredSquares', sceneName:'squaredSquares',subject:'health', review:false,objective:15,demo:false, type:gameTypeEnum.CHOOSE},//171
		   {name:'Germ Strike',url:'germStrike/',mapUrl:'germStrike', sceneName:'germStrike',subject:'health', review:false,objective:30,demo:false, type:gameTypeEnum.CHOOSE},//172
		   {name:'Artwist',url:'artwist/',mapUrl:'artwist', sceneName:'artwist',subject:'creativity', review:false,objective:10,demo:false, type:gameTypeEnum.CHOOSE},//173
		   {name:'Hygiene Plus',url:'hygienePlus/',mapUrl:'hygienePlus', sceneName:'hygienePlus',subject:'language', review:false,objective:15,demo:false, type:gameTypeEnum.CHOOSE},//174
		   {name:'Wild Feed',url:'wildFeed/',mapUrl:'wildFeed', sceneName:'wildFeed',subject:'sciencie', review:false,objective:30,demo:false, type:gameTypeEnum.CHOOSE},//175
		   {name:'Cubetinent',url:'cubetinent/',mapUrl:'cubetinent', sceneName:'cubetinent',subject:'language', review:false,objective:10,demo:false, type:gameTypeEnum.MATCH},//176
		   {name:'Color Invaders',url:'colorInvaders/',mapUrl:'colorInvaders', sceneName:'colorInvaders',subject:'language', review:false,objective:30,demo:false, type:gameTypeEnum.CHOOSE},//177
		   {name:'Clean Crossing',url:'cleanCrossing/',mapUrl:'cleanCrossing', sceneName:'cleanCrossing',subject:'sustainability', review:false,objective:20,demo:false, type:gameTypeEnum.CHOOSE},//178
		   {name:'Climb O Weight',url:'climbOWeight/',mapUrl:'climbOWeight', sceneName:'climbOWeight',subject:'sciencie', review:false,objective:25,demo:false, type:gameTypeEnum.MATCH},//179
		   {name:'Water Gunner',url:'waterGunner/',mapUrl:'waterGunner', sceneName:'waterGunner',subject:'sciencie', review:false,objective:20,demo:false, type:gameTypeEnum.MATCH},//180
		   {name:'Scary Shadows',url:'scaryShadows/',mapUrl:'scaryShadows', sceneName:'scaryShadows',subject:'sciencie', review:false, objective:15, demo:false, type:gameTypeEnum.MATCH},//181
		   {name:'Tile A Roid',url:'tileARoid/',mapUrl:'tileARoid', sceneName:'tileARoid',subject:'language', review:false,objective:20,demo:false, type:gameTypeEnum.MATCH},//182
		   {name:'Geondrian',url:'geondrian/',mapUrl:'geondrian', sceneName:'geondrian',subject:'creativity', review:false,objective:10,demo:false, type:gameTypeEnum.CHOOSE},//183
		   {name:'Shapesody',url:'shapesody/',mapUrl:'shapesody', sceneName:'shapesody',subject:'creativity', review:false,objective:10,demo:false, type:gameTypeEnum.MATCH},//184
		   {name:'Euro Flag',url:'euroFlag/',mapUrl:'euroFlag', sceneName:'euroFlag',subject:'geography', review:false,objective:20,demo:false, type:gameTypeEnum.MATCH},//185
		   {name:'Puzzoole',url:'puzzoole/',mapUrl:'puzzoole', sceneName:'puzzoole',subject:'sciencie', review:false,objective:20,demo:false, type:gameTypeEnum.MATCH},//186
		   {name:'Motion Slip',url:'motionSlip/',mapUrl:'motionSlip', sceneName:'motionSlip',subject:'creativity', review:false,objective:20,demo:false, type:gameTypeEnum.CHOOSE},//187
		   {name:'Syncphony',url:'syncphony/',mapUrl:'syncphony', sceneName:'syncphony',subject:'creativity', review:false,objective:25,demo:false, type:gameTypeEnum.MATCH},//188
		   {name:'Orbiturn',url:'orbiturn/',mapUrl:'orbiturn', sceneName:'orbiturn',subject:'math', review:false,objective:30,demo:false, type:gameTypeEnum.MATCH},//189
		   {name:'Magic Spell',url:'magicSpell/',mapUrl:'magicSpell', sceneName:'magicSpell',subject:'language', review:false,objective:10,demo:false, type:gameTypeEnum.MATCH},//190
		   {name:'Grammart',url:'grammart/',mapUrl:'grammart', sceneName:'grammart',subject:'language', review:false,objective:10,demo:false, type:gameTypeEnum.CHOOSE},//191
		   {name:'Robotic Figures',url:'roboticFigures/',mapUrl:'roboticFigures', sceneName:'roboticFigures',subject:'creativity', review:false,objective:20,demo:false, type:gameTypeEnum.MATCH},//192
		   {name:'Nestling Quest',url:'nestlingQuest/',mapUrl:'nestlingQuest', sceneName:'nestlingQuest',subject:'sciencie', review:false,objective:30,demo:false, type:gameTypeEnum.MATCH},//193
		   {name:'Climbvoid',url:'climbvoid/',mapUrl:'climbvoid', sceneName:'climbvoid',subject:'creativity', review:false,objective:30,demo:false, type:gameTypeEnum.GRAB},//194
		   {name:'Verte Who',url:'verteWho/',mapUrl:'verteWho', sceneName:'verteWho',subject:'sciencie', review:false,objective:15,demo:false, type:gameTypeEnum.MATCH},//195
		   {name:'Word Blast',url:'wordBlast/',mapUrl:'wordBlast', sceneName:'wordBlast',subject:'language', review:false,objective:20,demo:false, type:gameTypeEnum.SEQUENCE},//196
		   {name:'Address In Town',url:'addressInTown/',mapUrl:'addressInTown', sceneName:'addressInTown',subject:'geography', review:false,objective:30,demo:false, type:gameTypeEnum.SEQUENCE},//197
		   {name:'Deliver In Town',url:'deliverInTown/',mapUrl:'deliverInTown', sceneName:'deliverInTown',subject:'coding', review:false,objective:20,demo:false, type:gameTypeEnum.SEQUENCE},//198
		   {name:'Chainge',url:'chainge/',mapUrl:'chainge', sceneName:'chainge',subject:'math', review:false,objective:20,demo:false, type:gameTypeEnum.TRACE},//199
		   {name:'Greet Chirp',url:'greetChirp/',mapUrl:'greetChirp', sceneName:'greetChirp',subject:'language', review:false,objective:20,demo:false, type:gameTypeEnum.CHOOSE},//200
		   {name:'Icy Rush',url:'icyRush/',mapUrl:'icyRush', sceneName:'icyRush',subject:'sustainability', review:false,objective:25,demo:false, type:gameTypeEnum.CHOOSE},//201
		   {name:'Sports Ball',url:'sportsBall/',mapUrl:'sportsBall', sceneName:'sportsBall',subject:'health', review:false,objective:25,demo:false, type:gameTypeEnum.TARGET},//202
		   {name:'Quake Run',url:'quakeRun/',mapUrl:'quakeRun', sceneName:'quakeRun',subject:'health', review:false,objective:15,demo:false, type:gameTypeEnum.TAP},//203
		   {name:'Tidygram',url:'tidygram/',mapUrl:'tidygram', sceneName:'tidygram',subject:'language', review:false,objective:15,demo:false, type:gameTypeEnum.MATCH},//204
		   {name:'Gift Figures',url:'giftFigures/',mapUrl:'giftFigures', sceneName:'giftFigures',subject:'language', review:false,objective:30,demo:false, type:gameTypeEnum.MATCH},//205
		   {name:'Anatomeal',url:'anatomeal/',mapUrl:'anatomeal', sceneName:'anatomeal',subject:'health', review:false,objective:20,demo:false, type:gameTypeEnum.MATCH},//206
		   {name:'Solar City',url:'solarCity/',mapUrl:'solarCity', sceneName:'solarCity',subject:'sustainability', review:false,objective:20,demo:false, type:gameTypeEnum.MATCH},//207
		   {name:'Milk Shake',url:'milkShake/',mapUrl:'milkShake', sceneName:'milkShake',subject:'language', review:false,objective:20,demo:false, type:gameTypeEnum.CHOOSE},//208
		   {name:'Purrjectile',url:'purrjectile/',mapUrl:'purrjectile', sceneName:'purrjectile',subject:'sustainability', review:false,objective:5,demo:false, type:gameTypeEnum.TARGET},//209
		   {name:'Ocean Quest',url:'oceanQuest/',mapUrl:'oceanQuest', sceneName:'oceanQuest',subject:'geography', review:false,objective:15,demo:false, type:gameTypeEnum.TARGET},//210
		   {name:'Star Explore Command',url:'starExploreCommand/',mapUrl:'starExploreCommand', sceneName:'starExploreCommand',subject:'geography', review:false,objective:15,demo:false, type:gameTypeEnum.TARGET},//211
		   {name:'Origamimic',url:'origamimic/',mapUrl:'origamimic', sceneName:'origamimic',subject:'creativity', review:false,objective:20,demo:false, type:gameTypeEnum.TRACE},//212
		   {name:'Dino Dash',url:'dinoDash/',mapUrl:'dinoDash', sceneName:'dinoDash',subject:'health', review:false,objective:15,demo:false, type:gameTypeEnum.TAP},//213
		   {name:'Whose Turn',url:'whoseTurn/',mapUrl:'whoseTurn', sceneName:'whoseTurn',subject:'math', review:false,objective:30,demo:false, type:gameTypeEnum.COUNT},//214
			{name:'Wash Clash',url:'washClash/',mapUrl:'washClash', sceneName:'washClash',subject:'health', review:false,objective:20,demo:false, type:gameTypeEnum.TARGET},//215
			{name:'Ear Drummer',url:'earDrummer/',mapUrl:'earDrummer', sceneName:'earDrummer',subject:'health', review:false,objective:25,demo:false, type:gameTypeEnum.SEQUENCE},//216
			{name:'Measuridge',url:'measuridge/',mapUrl:'measuridge', sceneName:'measuridge',subject:'math', review:false,objective:15,demo:false, type:gameTypeEnum.COUNT},//217
			{name:'H2os',url:'h2os/',mapUrl:'h2os', sceneName:'h2os',subject:'math',review:false,objective:30,demo:false,type:gameTypeEnum.COUNT},//218
			{name:'UpRoar',url:'upRoar/',mapUrl:'upRoar', sceneName:'upRoar',subject:'language',review:false,objective:20,demo:false,type:gameTypeEnum.CHOOSE},//219
			{name:'Mambo Jump O',url:'mamboJumpO/',mapUrl:'mamboJumpO', sceneName:'mamboJumpO',subject:'creativity',review:false,objective:25,demo:false,type:gameTypeEnum.MATCH},//220
			{name:'Ani Marathon',url:'aniMarathon/',mapUrl:'aniMarathon', sceneName:'aniMarathon',subject:'language',review:false,objective:25,demo:false,type:gameTypeEnum.CHOOSE},//221
			{name:'Circulead',url:'circulead/',mapUrl:'circulead', sceneName:'circulead',subject:'math',review:false,objective:10,demo:false,type:gameTypeEnum.COUNT},//222
	]
	}