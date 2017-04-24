var soundsPath = "../../shared/minigames/sounds/"
var imagePath = "images/CroakSong/"
var CroakSong = function(){

	assets = {
        atlases: [                
			{
                name: "atlas.frogs",
                json: imagePath + "ranas/atlas.json",
                image: imagePath + "ranas/atlas.png",
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
				file: "frogsNotes/a4.mp3"
			},
			{	name: "a5",
				file: "frogsNotes/a5.mp3"
			},
			{	name: "a4",
				file: "frogsNotes/b4.mp3"
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
			}
		],
	}
    var starGame = false;
	var background;
	var background2;
	var heartsIcon;
	var heartsText;
	var xpIcon;
	var xpText;
	var lives;
	var coins;	
	var finish = false;
	var speedGame = 1;
	var lives = 3;
	var coins = 0;
	var timerCount;
	var timer = 10;
	
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

	function getRandomArbitrary(min, max) {
  			return Math.floor(Math.random() * (max - min) + min);
	}

	var songs =
		[
			"d5","g4","a4","b4","c5","d5","g4",
			"g4","e5","c5","d5","e5","gb5","g5","g4",
			"g4","c5","d5","c5","b4","a4","b4","c5",
			"b4","a4","g4","gb4","g4","a4","b4","g4","b4","a4"
		]
	
	
	var style = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	var styleClock = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"};

	function fontsSize(){
			if(game.world.width < 721){
				styleCards = {font: "2.5vh VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
			}else{
				styleCards = {font: "11vh VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
			}
	}
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
		game.load.image('bgclock',imagePath + "bgclock.png");
		/*Default*/
		game.load.image("background2", imagePath +"background2.png");
		game.load.image("carril",imagePath + "carril.png");
		game.load.image("vapor",imagePath + "vapor.png");
		game.load.image("planta",imagePath + "planta.png");
		game.load.image('tronco',imagePath + "tronco.png");
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
	
	function createOverlay(){
		lives = 1;
		coins = 0;
		finish = false;

		heartsText.setText("x " + lives);
		xpText.setText(coins);
		starGame = false;
		
        sceneGroup = game.add.group()
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
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                overlayGroup.y = -game.world.height
		
		bgm = game.add.audio('bgm8bits')
            game.sound.setDecodedCallback(bgm, function(){
            }, this);
		
		bgm.loopFull(0.5);
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
        	inputLogo.anchor.setTo(0.2,0.5);	
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
		background2 = game.add.tileSprite(0,225,game.width, game.height, "background2");
		
		/*GAME*/
		carril[1] = game.add.tileSprite(game.world.centerX, 225,101, game.height, "carril");
		carril[1].anchor.setTo(0.5,0);
		carril[0] = game.add.tileSprite(carril[1].x - 152,225,101,game.height, "carril");
		carril[0].anchor.setTo(0.5,0);
		carril[2] = game.add.tileSprite(carril[1].x + 152,225,101, game.height, "carril");
		carril[2].anchor.setTo(0.5,0);
		
		/*
		bicho = game.add.sprite(carril[0].x, carril[0].y, 'bicho');
		var bichoSprite = bicho.animations.add('bichoSprite');
		bicho.animations.play('bichoSprite', 12, true);
		bicho.anchor.setTo(0.5,0);		
		
		tronco = game.add.sprite(carril[1].x, carril[1].y, 'tronco');
		tronco.anchor.setTo(0.5,0);
		*/
		
		for(var p = 0;p<=5;p++){
			
			var num = getRandomArbitrary(0,3);
			var varP = p;
			
			bichos[p] = game.add.sprite(0, 0, 'bicho');
			bichos[p].x = carril[num].x + bichos[p].width/8;
			var bichoSprite = bichos[p].animations.add('bichoSprite');
			bichos[p].animations.play('bichoSprite', 12, true);
			bichos[p].anchor.setTo(0.5,0);	
				
			
			if(p == 0){
				bichos[p].y = 300;
			}else{
				bichos[p].y = bichos[p-1].y - 100;
			}
			
			console.log(num);
			
			switch(num){
				case 0:			
				troncos[varP] = game.add.sprite(carril[1].x, bichos[varP].y, 'tronco');
				troncos[varP].anchor.setTo(0.5,0);	
				
				troncos[varP] = game.add.sprite(carril[2].x, bichos[varP].y, 'tronco');
				troncos[varP].anchor.setTo(0.5,0);		
					
				break;	
				
				case 1:			
				troncos[varP] = game.add.sprite(carril[2].x, bichos[varP].y, 'tronco');
				troncos[varP].anchor.setTo(0.5,0);		
				break;
					
				case 2:			
				troncos[varP] = game.add.sprite(carril[0].x, bichos[varP].y, 'tronco');
				troncos[varP].anchor.setTo(0.5,0);		
				break;	
					
					
			}
			
			//game.world.swap(background, bichos[p]);
			//game.world.swap(background, troncos[p]);
			
		}
		
		vapor = game.add.sprite(-1,0, 'vapor');
		vapor.y = game.height - vapor.height * 1.2;
		vapor.scale.setTo(0.7);
		
		vapor2 = game.add.sprite(game.width,0, 'vapor');
		vapor2.y = game.height - vapor2.height * 1.2;
		vapor2.scale.setTo(-0.7,0.7);	
				/*background clouds*/
		background = game.add.tileSprite(0,0,game.width, 225, "background");
		var agua = game.add.graphics(0, 0);
        agua.beginFill(0x5f8dca);
        agua.drawRect(0,game.world.height-132,game.world.width *2, game.world.height /6)
        agua.endFill();
		
		
		var ButtonsFrogs = new Array;
		
		for(var i = 0;i<=2;i++){
			ranas[i] = game.add.spine(carril[i].x,carril[i].y+carril[i].height/1.55,"frogs");
			ranas[i].setAnimationByName(0, "IDLE", true);
			
			ButtonsFrogs[i] = game.add.graphics(0, 0);
			ButtonsFrogs[i].beginFill(0x5f8dca);
			ButtonsFrogs[i].drawRect(ranas[i].x-50,ranas[i].y-100,100,130);
			ButtonsFrogs[i].id = i;
			ButtonsFrogs[i].alpha = 0;
			ButtonsFrogs[i].endFill();
			
			ButtonsFrogs[i].inputEnabled = true
			ButtonsFrogs[i].events.onInputDown.add(downFrog);
			ButtonsFrogs[i].events.onInputUp.add(upFrog);
			
		}
		
		ranas[0].setSkinByName("blue");
		ranas[1].setSkinByName("cherry");
		ranas[2].setSkinByName("green");
		
		function downFrog(object){
			ranas[object.id].setAnimationByName(0, "SING2", true);
			sound.play(songs[object.id]);
			console.log("bichos[0].y: " + bichos[0].y);
			if(bichos[0].y <= 844.35){
				console.log("OK");
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
		/*assets defautl*/
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
		bgclock = game.add.sprite(0,1,"bgclock");
		bgclock.x = game.width * 0.5;
		bgclock.anchor.setTo(0.5, 0);
		clockText = game.add.text(50, 46, timer, styleClock);	
		clockText.x = game.width * 0.5;
		clockText.anchor.setTo(0.5, 0);
		bgclock.alpha = 0;
		clockText.alpha = 0;
		//createOverlay();
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
		
		
	}
	
	
	function gameOver(){
		var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,14)
			sceneloader.show("result");
	}	
	
	
	function update() {
		
		background2.tilePosition.y += speedGame;
		for(var r = 0;r<=5;r++){
		//bichos[r].y += speedGame;
		//troncos[r].y += speedGame;
		}
		if(starGame){	
			if(lives != 0){
				background.tilePosition.y += speedGame;
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