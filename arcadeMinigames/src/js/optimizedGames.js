
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

        {name:'Optimized UniDream',url:'uniDream/',mapUrl:'uniDream', sceneName:'uni',subject:'math', review:true,objective:20,demo:false,song:1,type:{TARGET:0,COUNT:1,CHOOSE:0,MATCH:1,GRAB:1,SEQUENCE:0,TRACE:0}},
        {name:'Optimized Selfie Planet',url:'selfiePlanet/',mapUrl:'selfiePlanet', sceneName:'selfiePlanet',subject:'geography', review:false,objective:15,demo:false,song:2,type:{TARGET:1,COUNT:0,CHOOSE:0,MATCH:0,GRAB:0,SEQUENCE:0,TRACE:0}},
        {name:'Optimized Wild Dentist',url:'wildDentist/',mapUrl:'wildDentist', sceneName:'wildDentist',subject:'health', review:true,objective:25,demo:false,song:3,type:{TARGET:0,COUNT:0,CHOOSE:1,MATCH:0,GRAB:0,SEQUENCE:0,TRACE:0}},
        {name:'Optimized Sushi Towers',url:'sushiTowers/',mapUrl:'sushiTowers', sceneName:'sushi',subject:'math', review:true,objective:20,demo:false,song:4,type:{TARGET:0,COUNT:0,CHOOSE:0,MATCH:1,GRAB:0,SEQUENCE:0,TRACE:0}},
        {name:'Optimized Math Run',url:'mathRun/',mapUrl:'mathRun', sceneName:'mathRun',subject:'math',review:true,objective:20,demo:true,song:5,type:{TARGET:1,COUNT:1,CHOOSE:0.5,MATCH:0.3,GRAB:0,SEQUENCE:0.8,TRACE:0}},
		]
	}