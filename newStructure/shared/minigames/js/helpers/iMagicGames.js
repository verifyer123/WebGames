var gameTypeEnum = {
	CHOOSE:0,
	COUNT:1,
	GRAB:2,
	MATCH:3,
	SEQUENCE:4,
	TARGET:5,
	TRACE:6,
	TAP:7,
	DRAG:8,
};

// En esta lista se tiene que incluir Imagic que es la plataforma y el nombre del juego, tambien hay un parametro llamado yogotar en este iria el yogotar del juego:
//eagle, luna, arthurius, theffanie, dinamita, estrella, nao, tomiko, oof, oona, razzle, dazzle, justice, paz.
//Materias 

var iMagicGames = {
	config:{
		tutorial:"tutorialImagic",
		results:"result_iMagic",
		platform:"imagic"
	},

	minigames:[
		{name:'Imagic UniDream',url:'uniDream/',mapUrl:'uniDream', sceneName:'uni',subject:'math',yogotar:"theffanie", review:true,objective:20,demo:false,type:gameTypeEnum.COUNT},
        {name:'Imagic Selfie Planet',url:'selfiePlanet/',mapUrl:'selfiePlanet', sceneName:'selfiePlanet',subject:'geography',yogotar:"eagle", review:false,objective:15,demo:false,type:gameTypeEnum.TARGET},
        {name:'Imagic Wild Dentist',url:'wildDentist/',mapUrl:'wildDentist', sceneName:'wildDentist',subject:'health', review:true,objective:25,demo:false,type:gameTypeEnum.CHOOSE},
        {name:'Imagic Math Run',url:'mathRun/',mapUrl:'mathRun', sceneName:'mathRun',subject:'math',yogotar:"arthurius",review:true,objective:20,demo:true,type:gameTypeEnum.COUNT},
		{name:'Imagic Dinamita Dance',url:'dinamitaDance/',mapUrl:'dinamitaDance', sceneName:'dinamitaDance',subject:'language' ,yogotar:"dinamita", review:false,objective:15,demo:false,type:gameTypeEnum.CHOOSE},
		{name:'Imagic Oona Says Cook',url:'oonaSaysCook/',mapUrl:'oonaSaysCook', sceneName:'oona',subject:'coding',yogotar:"oona", review:true,objective:15,demo:true,type:gameTypeEnum.CHOOSE},
		{name:'Imagic Magnet Ride',url:'magnetRide/',mapUrl:'magnetRide', sceneName:'magnet',subject:'science',yogotar:"oof",review:true,objective:30,demo:false,type:gameTypeEnum.GRAB},
		{name:'Imagic River Cleaner',url:'riverCleaner/',mapUrl:'riverCleaner', sceneName:'river',subject:'sustainability',yogotar:"nao", review:true,objective:5,demo:true,type:gameTypeEnum.GRAB},
		{name:'Imagic Color Invaders',url:'colorInvaders/',mapUrl:'colorInvaders', sceneName:'colorInvaders',subject:'language', review:false,objective:30,demo:false, type:gameTypeEnum.CHOOSE},
		{name:'Imagic Mathgic Gate',url:'mathgicGate/',mapUrl:'mathgicGate', sceneName:'mathgicGate',subject:'math',yogotar:"arthurius", review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},
		{name:'Imagic Galactic Pool',url:'galacticPool/',mapUrl:'galacticPool', sceneName:'galacticPool',subject:'geography', review:true,objective:10,demo:false,type:gameTypeEnum.SEQUENCE},
		{name:'Imagic Dr Zombie',url:'drZombie/',mapUrl:'drZombie', sceneName:'drzombie',subject:'health' ,yogotar:"theffanie", review:false,objective:20,demo:true,type:gameTypeEnum.MATCH},
		{name:'Imagic Clash Critters',url:'clashCritters/',mapUrl:'clashCritters', sceneName:'clash',subject:'math',review:true,objective:50,demo:false,type:gameTypeEnum.CHOOSE},
		{name:'Imagic Math Circus',url:'mathCircus/',mapUrl:'mathCircus', sceneName:'circus',subject:'math',yogotar:"oona",review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},
		{name:'Imagic Astronometric',url:'astronoMetric/',mapUrl:'astronoMetric', sceneName:'astrono',subject:'math',yogotar:"oof", review:true,objective:15,demo:false,type:gameTypeEnum.TRACE},
		{name:'Imagic Green Rescue',url:'greenRescue/',mapUrl:'greenRescue', sceneName:'greenRescue',subject:'sustainability',yogotar:"nao", review:false,objective:10,demo:false,type:gameTypeEnum.TAP},
		{name:'Imagic Elemental Witch',url:'elementalWitch/',mapUrl:'elementalWitch', sceneName:'elemental',subject:'creativity', review:true,objective:15,demo:true,type:gameTypeEnum.CHOOSE},
		{name:'Imagic Acorn Numbers',url:'acornNumbers/',mapUrl:'acornNumbers', sceneName:'acorn',subject:'math',review:true,objective:30,demo:true,type:gameTypeEnum.CHOOSE},
		{name:'Imagic Lizart',url:'lizart/',mapUrl:'lizart', sceneName:'lizart',subject:'language',review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},
		{name:'Imagic Flag Runner',url:'flagRunner/',mapUrl:'flagRunner', sceneName:'flag',yogotar:"dazzle",subject:'geography',review:true,objective:15,demo:false,type:gameTypeEnum.CHOOSE},
		{name:'Imagic Hackamole',url:'hackaMole/',mapUrl:'hackaMole', sceneName:'hack',subject:'programming',review:true,objective:15,demo:false,type:gameTypeEnum.GRAB},
		{name:'Imagic Space Words',url:'spaceWords/',mapUrl:'spaceWords', sceneName:'space' ,yogotar:"eagle",subject:'language',review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},
		{name:'Imagic Magic Spell',url:'magicSpell/',mapUrl:'magicSpell', sceneName:'magicSpell',yogotar:"dinamita",subject:'language', review:false,objective:10,demo:false, type:gameTypeEnum.MATCH},
		{name:'Imagic Symfunny',url:'symfunny/',mapUrl:'symfunny', sceneName:'symfunny',yogotar:"oof",subject:'creativity', review:false,objective:15,demo:false,type:gameTypeEnum.SEQUENCE},
		{name:'Imagic Word Blast',url:'wordBlast/',mapUrl:'wordBlast', sceneName:'wordBlast',subject:'language', review:false,objective:20,demo:false, type:gameTypeEnum.SEQUENCE},
		{name:'Imagic Kinetic Jump',url:'kineticJump/',mapUrl:'kineticJump', sceneName:'kineticJump',yogotar:"dax",subject:'science', review:false,objective:30,demo:false, type:gameTypeEnum.TAP},
		{name:'Imagic Float and Count',url:'floatAndCount/',mapUrl:'floatAndCount', sceneName:'float',yogotar:"oof",subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.SEQUENCE},
		{name:'Imagic Beat O Matic',url:'beatOMatic/',mapUrl:'beatOMatic', sceneName:'beatOMatic',yogotar:"dazzle",subject:'creativity', review:false,objective:10,demo:false, type:gameTypeEnum.SEQUENCE},
	]
}