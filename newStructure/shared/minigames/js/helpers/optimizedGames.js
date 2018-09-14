
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

var optimizedGames={
	
    config:{
		tutorial:"tutorial",
		results:"result",
		platform:"epic"
	},

    minigames : [

        {name:'Optimized UniDream',url:'uniDream/',mapUrl:'uniDream', sceneName:'uni',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.COUNT},
        {name:'Optimized Selfie Planet',url:'selfiePlanet/',mapUrl:'selfiePlanet', sceneName:'selfiePlanet',subject:'geography', review:false,objective:15,demo:false,type:gameTypeEnum.TARGET},
        {name:'Optimized Wild Dentist',url:'wildDentist/',mapUrl:'wildDentist', sceneName:'wildDentist',subject:'health', review:true,objective:25,demo:false,type:gameTypeEnum.CHOOSE},
        {name:'Optimized Sushi Towers',url:'sushiTowers/',mapUrl:'sushiTowers', sceneName:'sushi',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.MATCH},
        {name:'Optimized Math Run',url:'mathRun/',mapUrl:'mathRun', sceneName:'mathRun',subject:'math',review:true,objective:20,demo:true,type:gameTypeEnum.COUNT},
		{name:'Optimized Dinamita Dance',url:'dinamitaDance/',mapUrl:'dinamitaDance', sceneName:'dinamitaDance',subject:'language', review:false,objective:15,demo:false,type:gameTypeEnum.CHOOSE},
		{name:'Optimized Oona Says Cook',url:'oonaSaysCook/',mapUrl:'oonaSaysCook', sceneName:'oona',subject:'coding', review:true,objective:15,demo:true,type:gameTypeEnum.CHOOSE},
		{name:'Optimized Magnet Ride',url:'magnetRide/',mapUrl:'magnetRide', sceneName:'magnet',subject:'science',review:true,objective:30,demo:false,type:gameTypeEnum.GRAB},
		{name:'Optimized River Cleaner',url:'riverCleaner/',mapUrl:'riverCleaner', sceneName:'river',subject:'sustainability', review:true,objective:5,demo:true,type:gameTypeEnum.GRAB},
		{name:'Optimized Color Invaders',url:'colorInvaders/',mapUrl:'colorInvaders', sceneName:'colorInvaders',subject:'language', review:false,objective:30,demo:false, type:gameTypeEnum.CHOOSE},
		{name:'Optimized Mathgic Gate',url:'mathgicGate/',mapUrl:'mathgicGate', sceneName:'mathgicGate',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},
		{name:'Optimized Galactic Pool',url:'galacticPool/',mapUrl:'galacticPool', sceneName:'galacticPool',subject:'geography', review:true,objective:10,demo:false,type:gameTypeEnum.SEQUENCE},
		{name:'Optimized Dr Zombie',url:'drZombie/',mapUrl:'drZombie', sceneName:'drzombie',subject:'health', review:false,objective:20,demo:true,type:gameTypeEnum.MATCH},
		{name:'Optimized Clash Critters',url:'clashCritters/',mapUrl:'clashCritters', sceneName:'clash',subject:'math',review:true,objective:50,demo:false,type:gameTypeEnum.CHOOSE},
		{name:'Optimized Math Circus',url:'mathCircus/',mapUrl:'mathCircus', sceneName:'circus',subject:'math',review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},
		{name:'Optimized Astronometric',url:'astronoMetric/',mapUrl:'astronoMetric', sceneName:'astrono',subject:'math', review:true,objective:15,demo:false,type:gameTypeEnum.TRACE},
		{name:'Optimized Green Rescue',url:'greenRescue/',mapUrl:'greenRescue', sceneName:'greenRescue',subject:'sustainability', review:false,objective:10,demo:false,type:gameTypeEnum.TAP},
		{name:'Optimized Elemental Witch',url:'elementalWitch/',mapUrl:'elementalWitch', sceneName:'elemental',subject:'creativity', review:true,objective:15,demo:true,type:gameTypeEnum.CHOOSE},
		{name:'Optimized Acorn Numbers',url:'acornNumbers/',mapUrl:'acornNumbers', sceneName:'acorn',subject:'math',review:true,objective:30,demo:true,type:gameTypeEnum.CHOOSE},
		{name:'Optimized Lizart',url:'lizart/',mapUrl:'lizart', sceneName:'lizart',subject:'language',review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},
		{name:'Optimized Flag Runner',url:'flagRunner/',mapUrl:'flagRunner', sceneName:'flag',subject:'geography',review:true,objective:15,demo:false,type:gameTypeEnum.MATCH},
		{name:'Optimized Hackamole',url:'hackaMole/',mapUrl:'hackaMole', sceneName:'hack',subject:'programming',review:true,objective:15,demo:false,type:gameTypeEnum.GRAB},
		{name:'Optimized Space Words',url:'spaceWords/',mapUrl:'spaceWords', sceneName:'space',subject:'language',review:true,objective:20,demo:false,type:gameTypeEnum.CHOOSE},
		{name:'Optimized Magic Spell',url:'magicSpell/',mapUrl:'magicSpell', sceneName:'magicSpell',subject:'language', review:false,objective:10,demo:false, type:gameTypeEnum.GRAB},
		{name:'Optimized Symfunny',url:'symfunny/',mapUrl:'symfunny', sceneName:'symfunny',subject:'creativity', review:false,objective:15,demo:false,type:gameTypeEnum.SEQUENCE},
		{name:'Optimized Word Blast',url:'wordBlast/',mapUrl:'wordBlast', sceneName:'wordBlast',subject:'language', review:false,objective:20,demo:false, type:gameTypeEnum.SEQUENCE},//196
	]
	
}