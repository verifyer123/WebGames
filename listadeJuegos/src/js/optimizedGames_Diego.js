
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

var optimizedGames={
	
    config:{
		tutorial:"nostars"
	},

    minigames : [

        {name:'Optimized UniDream',url:'uniDream/',mapUrl:'uniDream', sceneName:'uni',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.COUNT},
        {name:'Optimized Selfie Planet',url:'selfiePlanet/',mapUrl:'selfiePlanet', sceneName:'selfiePlanet',subject:'geography', review:false,objective:15,demo:false,type:gameTypeEnum.TARGET},
        {name:'Optimized Wild Dentist',url:'wildDentist/',mapUrl:'wildDentist', sceneName:'wildDentist',subject:'health', review:true,objective:25,demo:false,type:gameTypeEnum.CHOOSE},
        {name:'Optimized Sushi Towers',url:'sushiTowers/',mapUrl:'sushiTowers', sceneName:'sushi',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.MATCH},
        {name:'Optimized Math Run',url:'mathRun/',mapUrl:'mathRun', sceneName:'mathRun',subject:'math',review:true,objective:20,demo:true,type:gameTypeEnum.COUNT},
		]
	}