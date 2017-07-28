var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/pizzafraction/";

var pizzafraction = function(){

	assets = {
        atlases: [                
			{
                //name: "atlas.bouncybath",
                //json: "images/bouncybath/atlas.json",
                //image: "images/bouncybath/atlas.png",
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
				file: soundsPath + "combo.mp3"}
		],
	}
    
	
	sceneGroup = null;
	var gameIndex = 42;
	var speedGame = 5;
	var background;
	var heartsGroup = null;
	var heartsIcon;
	timer = 10;
	timerCount = null;
	var xpIcon;
	
	lives = 1;
	var count = 0;
	var cursors;
	coins = 0;
	heartsText = null;	
	xpText = null;
	bgm = null;
	var activeGame = true;

	
	styleWhite = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	styleBlack = {font: "60px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };
	styleClock = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };

    function preload() {
		game.load.audio('sillyAdventureGameLoop',  soundsPath + 'songs/sillyAdventureGameLoop.mp3');
		/*Default*/
		buttons.getImages(game);
		game.load.image('bgclock',imagePath + "bgclock.png");
		game.load.image("heartsIcon", imagePath +"hearts.png");
		game.load.image("xpIcon", imagePath +"xpcoins.png");	
		game.load.image('buttonPlay',imagePath +"tutorial/button.png");		
		game.load.image('pc',imagePath +"tutorial/desktop.png");
		game.load.image('gametuto',imagePath +"tutorial/gametuto.png");
		game.load.image('introscreen',imagePath +"tutorial/introscreen.png");
		game.load.image('howTo',imagePath +"tutorial/how"  + localization.getLanguage()  + ".png");
		game.load.image('buttonText',imagePath +"tutorial/play" + localization.getLanguage() + ".png");
		/*GAME*/
		game.load.image("background",imagePath + "background.png");
		game.load.image("circles",imagePath + "circles.png");
		game.load.image("base",imagePath + "base.png");
		game.load.image("plato",imagePath + "plato.png");
		game.load.image("globe",imagePath + "globe.png");
		game.load.image("noveno1",imagePath + "noveno1.png");
		game.load.image("timbre_iddle",imagePath + "timbre_iddle.png");
		game.load.image("timbre_on",imagePath + "timbre_on.png");
		game.load.image("star",imagePath + "star.png");
		game.load.image("wrong",imagePath + "wrong.png");		
		/*SPINE*/
		game.load.spine("yogotar", imagePath + "spine/skeleton.json");

		
		
		
	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}
	
	function initialize(){
		lives = 1;
		coins = 0;
		speedGame = 5;
		starGame = false;

	}	
	
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};



	/*CREATE SCENE*/
    function createScene(){
		
		sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex);;
		loadSounds();
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);
		


		var background = new Phaser.Graphics(game)
        background.beginFill(0xf15a24)
        background.drawRect(0,0,game.world.width *2, game.world.height *2)
        background.alpha = 0.7
        background.endFill()
		sceneGroup.add(background);

		var circles = sceneGroup.create(0,0,"circles");
		circles.y = 0;
		circles.x = game.world.centerX - circles.width/2;		
		
		var base = sceneGroup.create(0,0,"base");
		base.y = game.height - base.height;
		base.x = game.world.centerX - base.width/2;

		var plato = sceneGroup.create(0,0,"plato");
		plato.y = game.height - base.height - plato.height;
		plato.x = game.world.centerX - plato.width/2;
		
		
		var characters = ["dinamita","estrella","nao","tomiko"];
		
		var yogotar1 = game.add.spine(0,0,"yogotar");
		yogotar1.y = game.height  - 10;
		yogotar1.x = base.x + base.width/5;
		yogotar1.posx = base.x + base.width/5;
		yogotar1.setAnimationByName(0, "IDLE", true);
		yogotar1.setSkinByName(characters[0]);
		sceneGroup.add(yogotar1);	
		
		var fractions = [
			{fraction:"1/8",id:1},
			{fraction:"2/8",id:2},
			{fraction:"3/8",id:3},
			{fraction:"4/8",id:4},
			{fraction:"5/8",id:5},
			{fraction:"6/8",id:6},
			{fraction:"7/8",id:7},
			{fraction:"8/8",id:8},
			{fraction:"1/4",id:2},
			{fraction:"1/2",id:4}
		];
		//shuffle(fractions)
		
		var globe = sceneGroup.create(0,0,"globe");
			globe.x = base.x + globe.width*1.15;
			globe.y = base.y + globe.height/6;	
		var textGlobe = game.add.text(50, 10, fractions[0].fraction, styleBlack,sceneGroup);	
			textGlobe.anchor.setTo(0,0.3);
			textGlobe.setTextBounds(globe.x,globe.y,globe.width/2,globe.height);

		var fractionPizza = new Array;
		var numPizzas = 8;
		
		for(i=0;i<=numPizzas-1;i++){
			fractionPizza[i] = sceneGroup.create(0,0,"noveno1");
			fractionPizza[i].anchor.setTo(0.5,1);
			fractionPizza[i].y = plato.y + fractionPizza[i].height + plato.height/20
			fractionPizza[i].x = plato.x + plato.width/2;
			fractionPizza[i].width = 180
			fractionPizza[i].blendMode = 3; 
			fractionPizza[i].angle = i * 45;
			fractionPizza[i].inputEnabled = true;
			fractionPizza[i].over = false;
			if(isMobile.any()){
			   fractionPizza[i].events.onInputOver.add(onPress,this);
			   }else{
				fractionPizza[i].events.onInputDown.add(onPress,this);	   
			   }
        	
		}
		
		var star = sceneGroup.create(0,0,"star");
			star.scale.setTo(2);
			star.anchor.setTo(0.5,0.5);
			star.x = plato.x + plato.width/2;
			star.y = plato.y + plato.height/2;
			star.alpha= 0;
		
		function onPress(pizza){
			if(!pizza.over){
				count = count + 1;
				pizza.blendMode = 0;
				pizza.over = true;
			}else{
				count = count - 1;
				pizza.blendMode = 3;
				pizza.over = false;
			}
			
		}
		
	
		
		var timbre_iddle = sceneGroup.create(0,0,"timbre_iddle");
			timbre_iddle.x = globe.x + timbre_iddle.width;
			timbre_iddle.y = globe.y + timbre_iddle.height + 10; 
			timbre_iddle.inputEnabled = true;
			timbre_iddle.events.onInputDown.add(onPressBell,this);
		
		function onPressBell(bell){
			
				
			

			timbre_iddle.inputEnabled = false;
			if(fractions[0].id == count){
				sound.play("magic");
				coins++;
				xpText.setText(coins);
				yogotar1.setAnimationByName(0, "WIN", true);
				TweenMax.fromTo(star.scale,3,{x:4,y:4},{x:8,y:8})
				TweenMax.fromTo(star,3,{alpha:1},{alpha:0,onComplete:newPizza});
				for(i=0;i<=numPizzas-1;i++){
					fractionPizza[i].inputEnabled = false;
				}
			}else{
				bgm.stop();
				sound.play("wrong");
				sound.play("gameLose");
				for(i=0;i<=numPizzas-1;i++){
					fractionPizza[i].inputEnabled = false;
				}
				yogotar1.setAnimationByName(0, "LOSE", true);
				TweenMax.fromTo(sceneGroup,1,{alpha:1},{alpha:0,delay:1,onComplete:gameOver})
			}
			
			bell.alpha= 1;
			TweenMax.fromTo(bell,0.5,{y:bell.y + 20},{y:bell.y,ease:Elastic.easeOut,onComplete:completeBell});
			function completeBell(){
					bell.alpha= 1;
			}
			
			if(coins == 3){
						bgclock.alpha = 1;
						clockText.alpha = 1;
						TweenMax.to(bgclock.scale,0.5,{x:1,ease:Back.easeOut});
						TweenMax.to(clockText.scale,0.5,{x:1,ease:Back.easeOut});
						
			}
			
			if(coins > 3){
				clearInterval(timerCount);
			}
			
		}		
		
		
		function newPizza(){
			
			TweenMax.fromTo(yogotar1,1,{x:yogotar1.x},{x:yogotar1.x + game.width,onComplete:newYogotar});
			if(coins >= 3){
				timer = 10;
				clearInterval(timerCount);
				timerCount = setInterval(timerFunction, 1000);
			}
			
			
			function newYogotar(){
				timbre_iddle.inputEnabled = true;
				shuffle(fractions);
				shuffle(characters);
				count = 0;
				for(i=0;i<=numPizzas-1;i++){
					fractionPizza[i].blendMode = 3;
					fractionPizza[i].inputEnabled = true;
					fractionPizza[i].over = false;
				}
				textGlobe.setText(fractions[0].fraction);
				TweenMax.fromTo(yogotar1,1,{x:-300},{x:yogotar1.posx});
				yogotar1.setSkinByName(characters[0]);
				yogotar1.setAnimationByName(0, "IDLE", true);
				sound.play("combo");
			}

		}
		
		
	function gameOver(){
		var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,gameIndex)
			sceneloader.show("result");
	}		
		
		
	timerFunction = function(){
		if(timer != 0){
			timer-- 
		}else if(timer == 0){
				lives--
			clearInterval(timerCount);
					TweenMax.fromTo(sceneGroup,1,{alpha:1},{alpha:1,delay:1,onComplete:gameOver});
					sound.play("wrong");
					sound.play("gameLose");
					bgm.stop();	
		}
		clockText.setText(timer);
	}		
		
	
		bgclock = sceneGroup.create(0,1,"bgclock");
		bgclock.x = game.width * 0.5;
		bgclock.anchor.setTo(0.5, 0);
		clockText = game.add.text(50, 46, timer, styleClock,sceneGroup);	
		clockText.x = game.width * 0.5;
		clockText.anchor.setTo(0.5, 0);
		bgclock.alpha = 0;
		clockText.alpha = 0;
		
		createCoins(coins);
		createHearts(lives);
		createOverlay();
		
	}


	
	function update() {
		
	}
		

	
	
	return {
		assets: assets,
		name: "pizzafraction",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()