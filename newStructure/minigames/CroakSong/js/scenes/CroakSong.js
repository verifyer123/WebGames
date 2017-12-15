var soundsPath = "../../shared/minigames/sounds/"
var imagePath = "images/CroakSong/"
var CroakSong = function(){

	assets = {
        atlases: [                
			{
                //name: "atlas.frogs",
                //json: imagePath + "ranas/atlas.json",
                //image: imagePath + "ranas/atlas.png",
			}],
        images: [],
		sounds: [
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "wrongItem",
				file: soundsPath + "wrongItem.mp3"},
            {	name: "break",
				file: soundsPath + "glassbreak.mp3"},
            {	name: "powerup",
				file: soundsPath + "powerup.mp3"},
            {	name: "balloon",
				file: soundsPath + "inflateballoon.mp3"},
			{	name: "explode",
				file: soundsPath + "explode.mp3"},
			{	name: "shootBall",
				file: soundsPath + "shootBall.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"},
			//Sonidos
			{	name: "a4",
				file: "frogsNotes/a4.mp3"
			},
			{	name: "a5",
				file: "frogsNotes/a5.mp3"
			},
			{	name: "a6",
				file: "frogsNotes/a6.mp3"
			},
			{	name: "ab4",
				file: "frogsNotes/ab4.mp3"
			},
			{	name: "ab5",
				file: "frogsNotes/ab5.mp3"
			},
			{	name: "ab6",
				file: "frogsNotes/ab6.mp3"
			},
			{	name: "b4",
				file: "frogsNotes/b4.mp3"
			},
			{	name: "a5",
				file: "frogsNotes/a5.mp3"
			},
			{	name: "a4",
				file: "frogsNotes/a4.mp3"
			},
			{	name: "b5",
				file: "frogsNotes/b5.mp3"
			},
			{	name: "b6",
				file: "frogsNotes/b6.mp3"
			},
			{	name: "c4",
				file: "frogsNotes/c4.mp3"
			},
			{	name: "c5",
				file: "frogsNotes/c5.mp3"
			},
			{	name: "c6",
				file: "frogsNotes/c6.mp3"
			},
			{	name: "cb4",
				file: "frogsNotes/cb4.mp3"
			},
			{	name: "cb5",
				file: "frogsNotes/cb5.mp3"
			},
			{	name: "cb6",
				file: "frogsNotes/cb6.mp3"
			},
			{	name: "d4",
				file: "frogsNotes/d4.mp3"
			},
			{	name: "d5",
				file: "frogsNotes/d5.mp3"
			},
			{	name: "d6",
				file: "frogsNotes/d6.mp3"
			},
			{	name: "db4",
				file: "frogsNotes/db4.mp3"
			},
			{	name: "db5",
				file: "frogsNotes/db5.mp3"
			},
			{	name: "db6",
				file: "frogsNotes/db6.mp3"
			},
			{	name: "e4",
				file: "frogsNotes/e4.mp3"
			},
			{	name: "e5",
				file: "frogsNotes/e5.mp3"
			},
			{	name: "e6",
				file: "frogsNotes/e6.mp3"
			},
			{	name: "f4",
				file: "frogsNotes/f4.mp3"
			},
			{	name: "f5",
				file: "frogsNotes/f5.mp3"
			},
			{	name: "f6",
				file: "frogsNotes/f6.mp3"
			},
			{	name: "fb4",
				file: "frogsNotes/fb4.mp3"
			},
			{	name: "fb5",
				file: "frogsNotes/fb5.mp3"
			},
			{	name: "fb6",
				file: "frogsNotes/fb6.mp3"
			},
			{	name: "g4",
				file: "frogsNotes/g4.mp3"
			},
			{	name: "g5",
				file: "frogsNotes/g5.mp3"
			},
			{	name: "g6",
				file: "frogsNotes/g6.mp3"
			},
			{	name: "gb4",
				file: "frogsNotes/gb4.mp3"
			},
			{	name: "gb5",
				file: "frogsNotes/gb5.mp3"
			},
			{	name: "gb6",
				file: "frogsNotes/gb6.mp3"
			},
			{	name: "badcroak",
				file: "frogsNotes/badcroak.mp3"
			},
			/*PIANO
			{	name: "C3",
				file: "pianoNotes/Piano.ff.C3.mp3"},
			{	name: "Db3",
				file: "pianoNotes/Piano.ff.Db3.mp3",},
			{	name: "D3",
				file: "pianoNotes/Piano.ff.D3.mp3",},
			{	name: "Eb3",
				file: "pianoNotes/Piano.ff.Eb3.mp3",},
			{	name: "E3",
				file: "pianoNotes/Piano.ff.E3.mp3",},
			{	name: "F3",
				file: "pianoNotes/Piano.ff.F3.mp3"},
			{	name: "Gb3",
				file: "pianoNotes/Piano.ff.Gb3.mp3"},
			{	name: "G3",
				file: "pianoNotes/Piano.ff.G3.mp3"},
			{	name: "Ab3",
				file: "pianoNotes/Piano.ff.Ab3.mp3"},
			{	name: "A3",
				file: "pianoNotes/Piano.ff.A3.mp3"},
			{	name: "Bb3",
				file: "pianoNotes/Piano.ff.Bb3.mp3"},
			{	name: "B3",
				file: "pianoNotes/Piano.ff.B3.mp3"},
			{	name: "C4",
				file: "pianoNotes/Piano.ff.C4.mp3"},
			{	name: "Db4",
				file: "pianoNotes/Piano.ff.Db4.mp3"},
			{	name: "D4",
				file: "pianoNotes/Piano.ff.D4.mp3"},
			{	name: "Eb4",
				file: "pianoNotes/Piano.ff.Eb4.mp3"},
			{	name: "E4",
				file: "pianoNotes/Piano.ff.E4.mp3"},
			{	name: "F4",
				file: "pianoNotes/Piano.ff.F4.mp3"},
			{	name: "Gb4",
				file: "pianoNotes/Piano.ff.Gb4.mp3"},
			{	name: "G4",
				file: "pianoNotes/Piano.ff.G4.mp3"},
			{	name: "Ab4",
				file: "pianoNotes/Piano.ff.Ab4.mp3"},
			{	name: "A4",
				file: "pianoNotes/Piano.ff.A4.mp3"},
			{	name: "Bb4",
				file: "pianoNotes/Piano.ff.Bb4.mp3"},
			{	name: "B4",
				file: "pianoNotes/Piano.ff.B4.mp3"},
			{	name: "C5",
				file: "pianoNotes/Piano.ff.C5.mp3"},
			{	name: "Db5",
				file: "pianoNotes/Piano.ff.Db5.mp3"},
			{	name: "D5",
				file: "pianoNotes/Piano.ff.D5.mp3"},
			{	name: "Eb5",
				file: "pianoNotes/Piano.ff.Eb5.mp3"},
			{	name: "E5",
				file: "pianoNotes/Piano.ff.E5.mp3"},
			{	name: "F5",
				file: "pianoNotes/Piano.ff.F5.mp3"},
			{	name: "Gb5",
				file: "pianoNotes/Piano.ff.Gb5.mp3"},
			{	name: "G5",
				file: "pianoNotes/Piano.ff.G5.mp3"},
			{	name: "Ab5",
				file: "pianoNotes/Piano.ff.Ab5.mp3"},
			{	name: "A5",
				file: "pianoNotes/Piano.ff.A5.mp3"},
			{	name: "Bb5",
				file: "pianoNotes/Piano.ff.Bb5.mp3"},
			{	name: "B5",
				file: "pianoNotes/Piano.ff.B5.mp3"},
			{	name: "C6",
				file: "pianoNotes/Piano.ff.C6.mp3"}
			PIANO*/
		],
	}
    var gameIndex = 19;
    var starGame = false;
	var background;
	var background2;
	var heartsIcon;
	var heartsText;
	var xpIcon;
	var xpText;
	var lives;
	var coins;	
	var finishGame = false;
	var speedGame = 2;
	var lives = 3;
	var coins = 0;
	var timerCount;
	var timer = 10;
	var cursors;
	var carril = new Array;
	var bicho;
	var tronco;
	var vapor;
	var vapor2;
	var planta;
	var planta2;
	var ranas = new Array;
	var bichos = new Array;
	var troncos = new Array;
	var troncos2 = new Array;
	var readySound = 0;
	var activeBug = false;
	var spaceItems = 200;
	var star;
	var wrong;
	var selectMusic;
	var level = 1;
	var levelText;
	var ButtonsFrogs = new Array;
	var pressLeft = false;
	var pressDown = false;
	var pressRight = false;
	var minSpaceItems = 70;

	function getRandomArbitrary(min, max) {
  			return Math.floor(Math.random() * (max - min) + min);
	}

/*
	[
			"c4","cb4","d4","db4","e4","f4","fb4","g4","gb4","a4","ab4","b4","c5",
			"cb5","d5","db5","e5","f5","fb5","g5","gb5","a5","ab5","b5","c6","cb6",
			"d6","db6","e6","f6","fb6","g6","gb6","a6","ab6","b6"
		]*/
	
	var pianoSong =[
		[
			"D5","G4","A4","B4","C5","D5","G4",
			"G4","E5","C5","D5","E5","Gb5","G5","G4",
			"G4","C5","D5","C5","B4","A4","B4","C5",
			"B4","A4","G4","Gb4","G4","A4","B4","G4","B4","A4"
		],
		[
			"D3", "E3", "F3", "G3", "A3", "F3", "A3",
			"Ab3", "E3", "Ab3", "G3", "Eb3", "G3",
			"D3", "E3", "F3", "G3", "A3", "F3", "A3",
			"D4", "C4", "A3", "F3", "A3", "C4",
			
			"D3", "E3", "F3", "G3", "A3", "F3", "A3",
			"Ab3", "E3", "Ab3", "G3", "Eb3", "G3",
			"D3", "E3", "F3", "G3", "A3", "F3", "A3",
			"D4", "C4", "A3", "F3", "A3", "C4",
		],
		[
			"E5", "Eb5", "E5", "Eb5", "E5", "B4", "D5",
			"C5", "A4", "C4", "E4", "A4", "B4", "E4",
			"G4", "B4", "C5", "E5", "Eb5", "E5", "Eb5",
			"E5", "B4", "D5", "C5", "A4", "C4", "E4",
			"A4", "B4", "E4", "C5", "B4", "A4",
			"E5", "Eb5", "E5", "Eb5", "E5", "B4", "D5",
			"C5", "A4", "C4", "E4", "A4", "B4", "E4",
			"G4", "B4", "C5", "E5", "Eb5", "E5", "Eb5",
			"E5", "B4", "D5", "C5", "A4", "C4", "E4",
			"A4", "B4", "E4", "C5", "B4", "A4",
		],
		[
			"B4", "A4", "Ab4", "A4", "C5",
			"D5", "C5", "B4", "C5", "E5",
			"F5", "E5", "Eb5", "E5",
			"B5", "A5", "Ab5", "A5", "B5", 
			"A5", "Ab5", "A5", "C6",
			"A5", "C6", "B5", "A5", "G5",
			"A5" , "B5", "A5", "G5", "A5", 
			"B5", "A5", "G5", "Gb5", "E5",
			"B4", "A4", "Ab4", "A4", "C5",
			"D5", "C5", "B4", "C5", "E5",
			"F5", "E5", "Eb5", "E5",
			"B5", "A5", "Ab5", "A5", "B5", 
			"A5", "Ab5", "A5", "C6",
			"A5", "C6", "B5", "A5", "G5",
			"A5" , "B5", "A5", "G5", "A5", 
			"B5", "A5", "G5", "Gb5", "E5",
		]
	]
	
		
    var songs = [
		
	
		
		[
			"d5","g4","a4","b4","c5","d5","g4",
			"g4","e5","c5","d5","e5","gb5","g5","g4",
			"g4","c5","d5","c5","b4","a4","b4","c5",
			"b4","a4","g4","gb4","g4","a4","b4","g4","b4","a4"
		],
		[
			"d4", "e4", "f4", "g4", "a4", "f4", "a4",
			"ab4", "d4", "ab4","g4", "fb4", "g4",
			"d4", "e4", "f4", "g4", "a4", "f4", "a4",
			"d5", "c5", "a4", "f4", "a4", "c5",
			"d4", "e4", "f4", "g4", "a4", "f4", "a4",
			"ab4", "e4", "ab4", "g4", "fb4", "g4",
			"d4", "e4", "f4", "g4", "a4", "f4", "a4",
			"d5", "c5", "a4", "f4", "a4", "c5",
		],
		[
			"e5", "cb5", "e5", "cb5", "e5", "b4", "d5",
			"c5", "a4", "c4", "e4", "a4", "b4", "e4",
			"g4", "b4", "c5", "e5", "cb5", "e5", "cb5",
			"e5", "b4", "d5", "c5", "a4", "c4", "e4",
			"a4", "b4", "e4", "c5", "b4", "a4",
			"e5", "cb5", "e5", "cb5", "e5", "b4", "d5",
			"c5", "a4", "c4", "e4", "a4", "b4", "e4",
			"g4", "b4", "c5", "e5", "cb5", "e5", "cb5",
			"e5", "b4", "d5", "c5", "a4", "c4", "e4",
			"a4", "b4", "e4", "c5", "b4", "a4",
		],
		[
			"b4", "a4", "ab4", "a4", "c5",
			"d5", "c5", "b4", "c5", "e5",
			"f5", "e5", "cb5", "e5",
			"b5", "a5", "ab5", "a5", "b5", 
			"a5", "ab5", "a5", "c6",
			"a5", "c6", "b5", "a5", "g5",
			"a5" , "b5", "a5", "g5", "a5", 
			"b5", "a5", "g5", "gb5", "e5",
			"b4", "a4", "ab4", "a4", "c5",
			"d5", "c5", "b4", "c5", "e5",
			"f5", "e5", "cb5", "e5",
			"b5", "a5", "ab5", "a5", "b5", 
			"a5", "ab5", "a5", "c6",
			"a5", "c6", "b5", "a5", "g5",
			"a5" , "b5", "a5", "g5", "a5", 
			"b5", "a5", "g5", "gb5", "e5",
		]
		/*PIANO
		[
	        "Db5", "D5", "Eb5", "E5","A5","E5","D5","Db5","B4","D5","Gb5","D5","B4",
			"Bb4","B4","C5","Db5","E5","D5","Db5","B4","A4","Ab4","A4","Db5","B4"
		],
		[
			"D5","G4","A4","B4","C5","D5","G4",
			"G4","E5","C5","D5","E5","Gb5","G5","G4",
			"G4","C5","D5","C5","B4","A4","B4","C5",
			"B4","A4","G4","Gb4","G4","A4","B4","G4","B4","A4"
		],
		[
			"E4", "E4", "B4", "B4", "Db5", "Db5", "B4", 
			"A4", "A4", "Ab4", "Ab4", "Gb4", "Gb4", "E4", 
			"B4", "B4", "A4", "A4", "Ab4", "Ab4", "Gb4",
			"B4", "B4", "A4", "A4", "Ab4", "Ab4", "Gb4",
			"E4", "E4", "B4", "B4", "Db5", "Db5", "B4",
			"A4", "A4", "Ab4", "Ab4", "Gb4", "Gb4", "E4"
		],
		[
			"D3", "E3", "F3", "G3", "A3", "F3", "A3",
			"Ab3", "E3", "Ab3", "G3", "Eb3", "G3",
			"D3", "E3", "F3", "G3", "A3", "F3", "A3",
			"D4", "C4", "A3", "F3", "A3", "C4",
			
			"D3", "E3", "F3", "G3", "A3", "F3", "A3",
			"Ab3", "E3", "Ab3", "G3", "Eb3", "G3",
			"D3", "E3", "F3", "G3", "A3", "F3", "A3",
			"D4", "C4", "A3", "F3", "A3", "C4",
		],
		[
			"E5", "Eb5", "E5", "Eb5", "E5", "B4", "D5",
			"C5", "A4", "C4", "E4", "A4", "B4", "E4",
			"G4", "B4", "C5", "E5", "Eb5", "E5", "Eb5",
			"E5", "B4", "D5", "C5", "A4", "C4", "E4",
			"A4", "B4", "E4", "C5", "B4", "A4",
			"E5", "Eb5", "E5", "Eb5", "E5", "B4", "D5",
			"C5", "A4", "C4", "E4", "A4", "B4", "E4",
			"G4", "B4", "C5", "E5", "Eb5", "E5", "Eb5",
			"E5", "B4", "D5", "C5", "A4", "C4", "E4",
			"A4", "B4", "E4", "C5", "B4", "A4",
		],
		[
			"B4", "A4", "Ab4", "A4", "C5",
			"D5", "C5", "B4", "C5", "E5",
			"F5", "E5", "Eb5", "E5",
			"B5", "A5", "Ab5", "A5", "B5", 
			"A5", "Ab5", "A5", "C6",
			"A5", "C6", "B5", "A5", "G5",
			"A5" , "B5", "A5", "G5", "A5", 
			"B5", "A5", "G5", "Gb5", "E5",
			"B4", "A4", "Ab4", "A4", "C5",
			"D5", "C5", "B4", "C5", "E5",
			"F5", "E5", "Eb5", "E5",
			"B5", "A5", "Ab5", "A5", "B5", 
			"A5", "Ab5", "A5", "C6",
			"A5", "C6", "B5", "A5", "G5",
			"A5" , "B5", "A5", "G5", "A5", 
			"B5", "A5", "G5", "Gb5", "E5",
		]*/
	]
	
	
	var style = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	var styleClock = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"};
	var styleLevel = {font: "70px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
    function preload() {
		//bgm
		game.load.audio('bgm8bits',  soundsPath + 'songs/8-bit-Video-Game.mp3');
		
		/*Default*/
		game.load.image("background", imagePath +"background.png");
		game.load.image("heartsIcon", imagePath +"hearts.png");
		game.load.image("xpIcon", imagePath +"xpcoins.png");	
		game.load.image('buttonPlay',imagePath +"tutorial/button.png");		
		game.load.image('pc',imagePath +"tutorial/desktop.png");
		game.load.image('gametuto',imagePath +"tutorial/gametuto.png");
		game.load.image('introscreen',imagePath +"tutorial/introscreen.png");
		game.load.image('howTo',imagePath +"tutorial/how"  + localization.getLanguage()  + ".png");
		game.load.image('buttonText',imagePath +"tutorial/play" + localization.getLanguage() + ".png");	
		//game.load.image('bgclock',imagePath + "bgclock.png");
		/*Default*/
		game.load.image("background2", imagePath +"background2.png");
		game.load.image("carril",imagePath + "carril.png");
		game.load.image("vapor",imagePath + "vapor.png");
		
		game.load.spritesheet("olas",imagePath + "olas.png",374,300,13);
		
		game.load.image("planta",imagePath + "planta.png");
		game.load.image('tronco',imagePath + "tronco.png");
		game.load.image('star',imagePath + "star.png");
		game.load.image('wrong',imagePath + "wrong.png");
		game.load.spritesheet('bicho', imagePath +  'bicho.png', 74, 79, 12);
		game.load.spine("frogs", imagePath + "ranas/skeleton.json");
	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}
	function initialize(){
		lives = 1;
		coins = 0;
		heartsText.setText("x " + lives);
		xpText.setText(coins);
		speedGame = 2;
		starGame = false;

	}	

	function getRandomArbitrary(min, max) {
  			return Math.floor(Math.random() * (max - min) + min);
	}
	
	
	
		function TextLevelfunction(){
			levelText = game.add.text(game.world.centerX, game.world.centerY,"Nivel " + level, styleLevel);	
			levelText.anchor.setTo(0.5, 0.5);	
			levelText.stroke = '#67ca5f';
			levelText.strokeThickness = 15;
			levelText.alpha = 0;
		
			TweenMax.fromTo(levelText,0.5,{alpha:0,y:game.world.centerY - 100},{alpha:1,y:game.world.centerY,onComplete:sigueLevel});
			
			function sigueLevel(){
				TweenMax.fromTo(levelText,0.5,{alpha:1,y:game.world.centerY},{alpha:0,y:game.world.centerY + 100,delay:1,onComplete:startNextLvl})
			}
            
            function startNextLvl(){
                finishGame = false
            }
		}	
	

		function createBugs(){
			selectMusic = getRandomArbitrary(0, songs.length);
			
			for(var p = 0;p<=songs[selectMusic].length-1;p++){

				var num = getRandomArbitrary(0,3);
				var varP = p;
				

				bichos[p] = game.add.sprite(0, 0, 'bicho');
				bichos[p].x = carril[num].x + bichos[p].width/8;
				var bichoSprite = bichos[p].animations.add('bichoSprite');
				bichos[p].animations.play('bichoSprite', 12, true);
				bichos[p].anchor.setTo(0.5,0);	
				bichos[p].id = p;
				bichos[p].carril = num;


				if(p == 0){
					bichos[p].y = -600;
				}else{
					bichos[p].y = bichos[p-1].y - spaceItems;
				}

				switch(num){
					case 0:			
					troncos[varP] = game.add.sprite(carril[1].x, bichos[varP].y, 'tronco');
					troncos[varP].anchor.setTo(0.5,0);		
					troncos[varP].scale.setTo(0.7);			
					troncos2[varP] = game.add.sprite(carril[2].x, bichos[varP].y, 'tronco');
					troncos2[varP].anchor.setTo(0.5,0);		
					troncos2[varP].scale.setTo(0.7);	
					break;	

					case 1:			
					troncos[varP] = game.add.sprite(carril[0].x, bichos[varP].y, 'tronco');
					troncos[varP].anchor.setTo(0.5,0);
					troncos[varP].scale.setTo(0.7);				
					troncos2[varP] = game.add.sprite(carril[2].x, bichos[varP].y, 'tronco');
					troncos2[varP].anchor.setTo(0.5,0);
					troncos2[varP].scale.setTo(0.7);	
					break;

					case 2:			
					troncos[varP] = game.add.sprite(carril[0].x, bichos[varP].y, 'tronco');
					troncos[varP].anchor.setTo(0.5,0);	
					troncos[varP].scale.setTo(0.7);			
					troncos2[varP] = game.add.sprite(carril[1].x, bichos[varP].y, 'tronco');
					troncos2[varP].anchor.setTo(0.5,0);	
					troncos2[varP].scale.setTo(0.7);		
					break;	
				}
				
				TweenMax.to(bichos[p],1,{y:bichos[p].y+1200});
				TweenMax.to(troncos[p],1,{y:troncos[p].y+1200});
				TweenMax.to(troncos2[p],1,{y:troncos2[p].y+1200});
				
			}
		/*background clouds*/
			ranas[0].setAnimationByName(0, "IDLE", true);
			ranas[1].setAnimationByName(0, "IDLE", true);
			ranas[2].setAnimationByName(0, "IDLE", true);
		background = game.add.tileSprite(0,0,game.width, 225, "background");	
		}	
	
		/*assets defautl*/
		function createItemsGame(){		
			heartsIcon = game.add.sprite(0,0,"heartsIcon");
			heartsIcon.anchor.setTo(0, 0);	
			heartsIcon.x = game.world.width - heartsIcon.width;
			heartsIcon.y = 25;	
			heartsText = game.add.text(50, 10, "x " + lives, style);	
			heartsText.anchor.setTo(0, 0);	
			heartsText.x = game.world.width - 75;
			heartsText.y = 25;
			xpIcon = game.add.sprite(0,0,"xpIcon");
			xpIcon.anchor.setTo(0, 0);	
			xpIcon.x = 0;
			xpIcon.y = 30;	
			xpText = game.add.text(50, 10,coins, style);	
			xpText.anchor.setTo(0, 0);	
			xpText.x = 75;
			xpText.y = 28;	
			//bgclock = game.add.sprite(0,1,"bgclock");
			//bgclock.x = game.width * 0.5;
			//bgclock.anchor.setTo(0.5, 0);
			clockText = game.add.text(50, 46, timer, styleClock);	
			clockText.x = game.width * 0.5;
			clockText.anchor.setTo(0.5, 0);
			//bgclock.alpha = 0;
			clockText.alpha = 0;
		}	
	
	
	function createOverlay(){
		lives = 3;
		coins = 0;
		readySound = 0;
		activeBug = false;
		spaceItems = 200;
		level = 1;
		finishGame = false;
		minSpaceItems = 20;

		heartsText.setText("x " + lives);
		xpText.setText(coins);
		starGame = false;
		
        sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
        overlayGroup = game.add.group()
		if(game.device != 'desktop'){
		overlayGroup.scale.setTo(0.9,0.9);
		}else{
			overlayGroup.scale.setTo(1.2,1.2);
		}
		
        sceneGroup.add(overlayGroup)
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
			sound.play("pop")
			sound.play("combo");
						TextLevelfunction();

            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                overlayGroup.y = -game.world.height

			starGame = true;

				//TweenMax.to(readyButton,1,{y:game.height - readyButton.height,ease:Back.easeOut});		
            })
            
        })
        
        overlayGroup.add(rect);
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.45,0.5);
		//plane.x = game.world.width * 0.55;
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'gametuto')
		tuto.anchor.setTo(0.4,0.5)
		
        
        var action = 'tap'
        
        if(game.device == 'desktop'){
            action = 'click'
        }
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 225,'howTo')
		howTo.anchor.setTo(0.4,0.5)
		howTo.scale.setTo(0.7,0.7)
        
		var deviceName = 'pc'
		var offsetX = 0
        if(!game.device.desktop){
           deviceName = 'tablet'
			offsetX = 50
		  	var inputLogo = overlayGroup.create(game.world.centerX + offsetX,game.world.centerY + 145,'movil');
        	inputLogo.anchor.setTo(0.5,0.5);	 
        }else{
			var inputLogo = overlayGroup.create(game.world.centerX-20,game.world.centerY + 145,'pc');
        	inputLogo.anchor.setTo(0.35,0.6);	
		}
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height,'buttonPlay')
		button.anchor.setTo(0.2,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.1,0.5)
    }	
	
	
	/*CREATE SCENE*/
    function createScene(){
		loadSounds();
		game.physics.startSystem(Phaser.Physics.ARCADE);	
		game.physics.startSystem(Phaser.Physics.P2JS);
		/*background*/
		background2 = game.add.tileSprite(0,0,game.world.width, game.world.height, "background2");
		
		/*GAME*/
		carril[1] = game.add.tileSprite(game.world.centerX, 225,101, game.height, "carril");
		carril[1].anchor.setTo(0.5,0);
		carril[0] = game.add.tileSprite(carril[1].x - 152,225,101,game.height, "carril");
		carril[0].anchor.setTo(0.5,0);
		carril[2] = game.add.tileSprite(carril[1].x + 152,225,101, game.height, "carril");
		carril[2].anchor.setTo(0.5,0);

		vapor = game.add.sprite(-1, 0, 'olas');
		vapor.y = game.height - vapor.height * 1.14;
		var vaporSprite = vapor.animations.add('vaporSprite');
		vapor.animations.play('vaporSprite', 13, true);
		vapor.scale.setTo(0.7);
		
		vapor2 = game.add.sprite(game.width, 0, 'olas');
		vapor2.y = game.height - vapor.height * 1.62;
		var vaporSprite = vapor2.animations.add('vaporSprite');
		vapor2.animations.play('vaporSprite', 13, true);
		vapor2.scale.setTo(-0.7,0.7);
		

		var agua = game.add.graphics(0, 0);
        agua.beginFill(0x5f8dca);
        agua.drawRect(0,game.world.height-132,game.world.width, game.world.height /6)
        agua.endFill();

		for(var i = 0;i<=2;i++){
			ranas[i] = game.add.spine(carril[i].x,carril[i].y+carril[i].height/1.55,"frogs");
			ranas[i].setAnimationByName(0, "IDLE", true);
			ButtonsFrogs[i] = game.add.graphics(0, 0);
			ButtonsFrogs[i].beginFill(0x5f8dca);
			ButtonsFrogs[i].drawRect(ranas[i].x-50,ranas[i].y-100,100,130);
			ButtonsFrogs[i].id = i;
			ButtonsFrogs[i].carril = i;
			ButtonsFrogs[i].alpha = 0;
			ButtonsFrogs[i].endFill();
			ButtonsFrogs[i].inputEnabled = true
			ButtonsFrogs[i].events.onInputDown.add(downFrog);
			ButtonsFrogs[i].events.onInputUp.add(upFrog);	
		}
		
		ranas[0].setSkinByName("blue");
		ranas[1].setSkinByName("cherry");
		ranas[2].setSkinByName("green");
		
		star =  game.add.sprite(ranas[0].x, ranas[0].y, 'star');
		star.anchor.setTo(0.5,1);
		star.alpha= 0;
		wrong =  game.add.sprite(ranas[0].x, ranas[0].y, 'wrong');
		wrong.anchor.setTo(0.5,1);
		wrong.alpha= 0;
		createBugs();
		
		function downFrog(object){
			if(finishGame == false){

			for(var i = 0;i<=songs[selectMusic].length-1;i++){
				TweenMax.to(bichos[i],0.05,{y: bichos[i].y+spaceItems});
				TweenMax.to(troncos[i],0.05,{y: troncos[i].y+spaceItems});
				TweenMax.to(troncos2[i],0.05,{y: troncos2[i].y+spaceItems});
			}		
				if(bichos[readySound].y >=  600){
					console.log("ok");
					TweenMax.to(troncos[readySound],0.2,{alpha:0});
					TweenMax.to(troncos2[readySound],0.2,{alpha:0});
					if(object.carril == bichos[readySound].carril){
						sound.play(songs[selectMusic][readySound]);
						//sound.play(pianoSong[selectMusic][readySound]);
						ranas[object.id].setAnimationByName(0, "SING2", false);
						TweenMax.to(bichos[readySound].scale,0.2,{x:0,y:0});
						star.x = ranas[object.id].x;
						star.y = ranas[object.id].y;
						TweenMax.fromTo(star.scale,0.5,{x:1,y:1},{x:2,y:2});
						TweenMax.fromTo(star,0.5,{alpha:1},{alpha:0});
						coins++;
						xpText.setText(coins);
					}else{
						sound.play("badcroak");
						lives--;
						heartsText.setText("x " + lives );
		
						ranas[object.id].setAnimationByName(0, "LOSE", false);
						TweenMax.to(bichos[readySound],0.2,{alpha:0});
						wrong.x = ranas[object.id].x;
						wrong.y = ranas[object.id].y;
						TweenMax.fromTo(wrong.scale,0.5,{x:1,y:1},{x:2,y:2});
						TweenMax.fromTo(wrong,0.5,{alpha:1},{alpha:0});
										
						if(lives == 0){
							ranas[0].setAnimationByName(0, "LOSE", true);
							ranas[1].setAnimationByName(0, "LOSE", true);
							ranas[2].setAnimationByName(0, "LOSE", true);
							ButtonsFrogs[0].inputEnabled = false;
							ButtonsFrogs[1].inputEnabled = false;
							ButtonsFrogs[2].inputEnabled = false;
							sound.play("gameLose");
								for(var p = 0;p<=songs[selectMusic].length-1;p++){
									bichos[p].destroy();
									troncos[p].destroy();
									troncos2[p].destroy();
								}
							TweenMax.to(troncos[readySound],1,{alpha:1,onComplete:gameOver});
							finishGame = true;
						  }

					}
				}				
			
			if(readySound <= songs[selectMusic].length-2){
				readySound++;

			}else{
				readySound = 0;
				for(var p = 0;p<=songs[selectMusic].length-1;p++){
					bichos[p].destroy();
					troncos[p].destroy();
					troncos2[p].destroy();
				}
				level++;
				if(spaceItems >= minSpaceItems){
					spaceItems = spaceItems - 10;
				}
				sound.play("combo");
				createBugs();
				createItemsGame();
				TextLevelfunction();
			}
		}
	}
		
		function upFrog(object){
			ranas[object.id].setAnimationByName(0, "IDLE", true);
		}
	
		
		planta = game.add.sprite(0,0, 'planta');
		planta.y = game.height - vapor.height * 1.2;
		planta.x = -planta.width/2;
		planta.scale.setTo(1);
		
		planta2 = game.add.sprite(game.width + planta.width/2,0, 'planta');
		planta2.y = game.height - vapor2.height * 1.2;
		planta2.scale.setTo(-1,1);		
		
		
		/*GAME*/
		createItemsGame();																		
		createOverlay();
		function timerFunction(){
			if(timer != 0){
				timer-- 
			}else if(timer == 0){
					lives--
					heartsText.setText("x " + lives);
				clearInterval(timerCount);

			}
			clockText.setText(timer);
		}		
		
		cursors = game.input.keyboard.createCursorKeys();
		
	}

function keyDownFrog(object){
			

			for(var i = 0;i<=songs[selectMusic].length-1;i++){
				TweenMax.to(bichos[i],0.05,{y: bichos[i].y+spaceItems});
				TweenMax.to(troncos[i],0.05,{y: troncos[i].y+spaceItems});
				TweenMax.to(troncos2[i],0.05,{y: troncos[i].y+spaceItems});
			}
					
				if(bichos[readySound].y >=  600){
					TweenMax.to(troncos[readySound],0.2,{alpha:0});
					TweenMax.to(troncos2[readySound],0.2,{alpha:0});
					
					
					if(object == bichos[readySound].carril){
						ranas[object].setAnimationByName(0, "SING2", false);
						sound.play(songs[selectMusic][readySound]);
						//sound.play(pianoSong[selectMusic][readySound]);
						//console.log("note: " + songs[selectMusic][readySound]);
						TweenMax.to(bichos[readySound].scale,0.2,{x:0,y:0});
						star.x = ranas[object].x;
						star.y = ranas[object].y;
						TweenMax.fromTo(star.scale,0.5,{x:1,y:1},{x:2,y:2});
						TweenMax.fromTo(star,0.5,{alpha:1},{alpha:0});
						coins++;
						xpText.setText(coins);
					}else{
						sound.play("badcroak");
						lives--;
						heartsText.setText("x " + lives );
						ranas[object].setAnimationByName(0, "LOSE", false);
						TweenMax.to(bichos[readySound],0.2,{alpha:0});
						wrong.x = ranas[object].x;
						wrong.y = ranas[object].y;
						TweenMax.fromTo(wrong.scale,0.5,{x:1,y:1},{x:2,y:2});
						TweenMax.fromTo(wrong,0.5,{alpha:1},{alpha:0});
										
						if(lives == 0){
							ranas[0].setAnimationByName(0, "LOSE", true);
							ranas[1].setAnimationByName(0, "LOSE", true);
							ranas[2].setAnimationByName(0, "LOSE", true);
							ButtonsFrogs[0].inputEnabled = false;
							ButtonsFrogs[1].inputEnabled = false;
							ButtonsFrogs[2].inputEnabled = false;
							finishGame = true;
							sound.play("gameLose");
								for(var p = 0;p<=songs[selectMusic].length-1;p++){
									bichos[p].destroy();
									troncos[p].destroy();
									troncos2[p].destroy();
								}
							TweenMax.to(bichos[readySound],1,{alpha:1,onComplete:gameOver});
						  }

					}
				}				
			
			if(readySound <= songs[selectMusic].length-2){
				readySound++;

			}else{
                finishGame = true
				readySound = 0;
				for(var p = 0;p<=songs[selectMusic].length-1;p++){
					bichos[p].destroy();
					troncos[p].destroy();
					troncos2[p].destroy();
				}
				level++;
				if(spaceItems >= minSpaceItems){
					spaceItems = spaceItems - 10;
				}
				sound.play("combo");
				createBugs();
				createItemsGame();
				TextLevelfunction();
			}

		}	
	
	
	function gameOver(){
		spaceItems = 200;

		var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,gameIndex)
			sceneloader.show("result");
	}	
	
	var key1;
		key1 = 0;
		key1 = 0;		
	var key2;
		key2 = 1;
		key2 = 1;		
	var key3;
		key3 = 2;
		key3 = 2;	
	
	function update() {
		background2.tilePosition.y += speedGame;
		
		if(finishGame == false){
			if (cursors.left.isUp){
				if(pressLeft){
				pressLeft = false;
				ranas[key1].setAnimationByName(0, "IDLE", true);
				}
			}
				
			if (cursors.right.isUp){
				if(pressRight){
				pressRight = false;
				ranas[key2].setAnimationByName(0, "IDLE", true);
				}
			}
				
			if (cursors.down.isUp){
				if(pressDown){
				pressDown = false;
				ranas[key3].setAnimationByName(0, "IDLE", true);
				}
			}
		
			if (cursors.left.isDown){
				
					if(!pressLeft){
						keyDownFrog(key1);
						pressLeft = true;
						
					}
				
				}else if (cursors.down.isDown){
					if(!pressDown){
						keyDownFrog(key2);
						pressDown = true;
						
					}
					
				}else if (cursors.right.isDown){
					if(!pressRight){
						keyDownFrog(key3);
						pressRight = true;
						
					}
				}
		}
		
	}
	
	return {
		assets: assets,
		name: "CroakSong",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()