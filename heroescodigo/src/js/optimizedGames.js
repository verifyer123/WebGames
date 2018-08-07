
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

        {name:'Uni Dream',url:'uniDream/',mapUrl:'uniDream', sceneName:'uni',subject:'math', review:true,objective:20,demo:false,song:1,age:5,type:{TARGET:0,COUNT:1,CHOOSE:0,MATCH:1,GRAB:1,SEQUENCE:0,TRACE:0}},
        {name:'Selfie Planet',url:'selfiePlanet/',mapUrl:'selfiePlanet', sceneName:'selfiePlanet',subject:'geography', review:false,objective:15,demo:false,song:2,age:7,type:{TARGET:1,COUNT:0,CHOOSE:0,MATCH:0,GRAB:0,SEQUENCE:0,TRACE:0}},
        {name:'Wild Dentist',url:'wildDentist/',mapUrl:'wildDentist', sceneName:'wildDentist',subject:'health', review:true,objective:25,demo:false,song:3,age:8,type:{TARGET:0,COUNT:0,CHOOSE:1,MATCH:0,GRAB:0,SEQUENCE:0,TRACE:0}},
        {name:'Sushi Towers',url:'sushiTowers/',mapUrl:'sushiTowers', sceneName:'sushi',subject:'math', review:true,objective:20,demo:false,song:4,age:10,type:{TARGET:0,COUNT:1,CHOOSE:1,MATCH:1,GRAB:1,SEQUENCE:0,TRACE:0}},
        {name:'Math Run',url:'mathRun/',mapUrl:'mathRun', sceneName:'mathRun',subject:'math',review:true,objective:20,demo:true,song:5,age:11,type:{TARGET:1,COUNT:1,CHOOSE:1,MATCH:1,GRAB:1,SEQUENCE:1,TRACE:1}},
		]
	}