
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

var gameList={
	
    config:{
		tutorial:"nostars"
	},

    minigames : [

        {name:'MichoMau Corto Circuito',url:'cortoCircuito/cortoCircuito/',mapUrl:'cortoCircuito', sceneName:'cortoCircuito',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.COUNT},
        {name:'MichoMau Cuenta Contactos',url:'cuentaContactos/cuentaContactos',mapUrl:'cuentaContactos', sceneName:'cuentaContactos',subject:'geography', review:false,objective:15,demo:false,type:gameTypeEnum.TARGET},
        {name:'MichoMau Esquiva Cohetes',url:'esquivaCohetes/esquivaCohetes',mapUrl:'esquivaCohetes', sceneName:'esquivaCohetes',subject:'health', review:true,objective:25,demo:false,type:gameTypeEnum.CHOOSE},
        {name:'MichoMau Humo Cocina',url:'humo_enlacocina/humo_enlacocina',mapUrl:'humoCocina', sceneName:'humoCocina',subject:'math', review:true,objective:20,demo:false,type:gameTypeEnum.MATCH},
        {name:'MichoMau Ollas Locas',url:'ollasLocas/ollasLocas',mapUrl:'ollasLocas', sceneName:'ollasLocas',subject:'math',review:true,objective:20,demo:true,type:gameTypeEnum.COUNT},
		]
	}