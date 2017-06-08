var soundsPath = "../../shared/minigames/sounds/"
var imagePath = "images/flightoclock/"
var flightoclock = function(){

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
				file: soundsPath + "combo.mp3"},
			{	name: "clean",
				file: "sounds/clean.mp3"},
			{	name: "pigsnort",
				file: "sounds/pigsnort.mp3"},
			{	name: "watersplash",
				file: "sounds/watersplash.mp3"}
		],
	}
    
	var background;
	var sceneGroup = null;
	var heartsGroup = null;
	var speedGame = 5;
	var tree;
	var piso;
	var heartsIcon;
	var heartsText;	
	var xpIcon;
	var xpText;
	var cursors;
	var lives = 1;
	var coins = 0;
	var bgm = null;
	
	var minute;
	var hour;
	var watch;
	var style1 = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	var style = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	var styleClock = {font: "60px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"};

	function fontsSize(){
			if(game.world.width < 721){
				styleCards = {font: "2.5vh VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
			}else{
				styleCards = {font: "11vh VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
			}
	}
    function preload() {
		game.load.audio('wormwood',  soundsPath + 'songs/wormwood.mp3');

		/*Default*/
		buttons.getImages(game);
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
		game.load.image("background2",imagePath + "background2.png");
		game.load.image("base",imagePath + "base.png");
		game.load.image("baseboton",imagePath + "baseboton.png");
		game.load.image("boton",imagePath + "boton.png");
		game.load.image("helicopter",imagePath + "helicopter.png");
		game.load.image("clock",imagePath + "clock.png");
		game.load.image("hour",imagePath + "hour.png");
		game.load.image("minute",imagePath + "minutes.png");
		game.load.image("watch",imagePath + "watch.png");
		/*SPINE*/
		game.load.spine("helicoptero", imagePath + "spine/helicoptero.json");
		
		
		
	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}
	function initialize(){
		lives = 1;
		coins = 0;
		heartsText.setText("x " + lives);
		xpText.setText(coins);
		speedGame = 5;
		starGame = false;

	}	

		var getRand = (function() {
			var nums = [0,1,2,3,4,5];
			var current = [];
			
			function rand(n) {
				return (Math.random() * n)|0;
			}
			return function() {
			  if (!current.length) current = nums.slice();
			  return current.splice(rand(current.length), 1);
			}
		}());
	
		function getRandomArbitrary(min, max) {
  			return Math.floor(Math.random() * (max - min) + min);
		}
	
	function createOverlay(){
		lives = 1;
		coins = 0;
		heartsText.setText("x " + lives);
		xpText.setText(coins);
		speedGame = 5;
		starGame = false;
		
        sceneGroup = game.add.group();
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
           goPigs(); game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                overlayGroup.y = -game.world.height

		
		bgm = game.add.audio('wormwood')
            game.sound.setDecodedCallback(bgm, function(){
            }, this);
		
		bgm.loopFull(0.5);
		starGame = true;
		buttons.getButton(bgm,sceneGroup)
				//TweenMax.to(readyButton,1,{y:game.height - readyButton.height,ease:Back.easeOut});		
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.45,0.5);
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
			inputLogo.alpha =0;
        }else{
			var inputLogo = overlayGroup.create(game.world.centerX-20,game.world.centerY + 145,'pc');
        	inputLogo.anchor.setTo(0.2,0.5);	
			inputLogo.alpha =0;
		}
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height,'buttonPlay')
		button.anchor.setTo(0.2,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.1,0.5)
    }	
	
	function createHearts(){
		heartsGroup = game.add.group();
		heartsIcon = heartsGroup.create(0,0,"heartsIcon");
		heartsIcon.anchor.setTo(0, 0);	
		heartsIcon.x = game.world.width - heartsIcon.width;
		heartsIcon.y = 5;	
		heartsText = game.add.text(50, 10, "x " + lives, style,heartsGroup);	
		heartsText.anchor.setTo(0, 0);	
		heartsText.x = game.world.width - 75;
		heartsText.y = 5;
		sceneGroup.add(heartsGroup);		
	}
	
	function createCoins(){
		coinsGroup = game.add.group();
		xpIcon = coinsGroup.create(0,0,"xpIcon");
		xpIcon.anchor.setTo(0, 0);	
		xpIcon.x = 0;
		xpIcon.y = 5;	
		xpText = game.add.text(50, 10, coins, style1,coinsGroup);	
		xpText.anchor.setTo(0, 0);	
		xpText.x = 75;
		xpText.y = 2;	
		sceneGroup.add(coinsGroup);
	}	

	
	/*CREATE SCENE*/
    function createScene(){
		sceneGroup = game.add.group();
		//loadSounds();
		
			
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//game.physics.p2.gravity.y = 1;
		
		
		var background = game.add.tileSprite(0,0,game.width,game.height,"background");
		sceneGroup.add(background);
		var background2 = sceneGroup.create(game.world.centerX,game.world.centerY,"background2");
		background2.anchor.setTo(0.5,0.5);
		var base = game.add.tileSprite(game.world.centerX,0,game.width,293,"base");
		base.y = game.world.centerY + base.height/1.48;
		base.anchor.setTo(0.5,0);
		sceneGroup.add(base);
		var base1 = game.add.group();
			var baseboton = base1.create(0,0,"baseboton");
			baseboton.y =game.height - baseboton.height*1.3;
			var botonWhite = base1.create(0,0,"boton");
			botonWhite.x = baseboton.x + botonWhite.width/7;
			botonWhite.y = baseboton.y + botonWhite.width/7;
			botonWhite.anchor.setTo(0,0);
		sceneGroup.add(base1);
		var base2 = game.add.group();
			var baseboton = base2.create(0,0,"baseboton");
			baseboton.y =game.height - baseboton.height*1.3;
			var botonWhite = base2.create(0,0,"boton");
			botonWhite.x = baseboton.x + botonWhite.width/7;
			botonWhite.y = baseboton.y + botonWhite.width/7;
			botonWhite.anchor.setTo(0.,0);
		sceneGroup.add(base2);
		var base3 = game.add.group();
			var baseboton = base3.create(0,0,"baseboton");
			baseboton.y =game.height - baseboton.height*1.3;
			var botonWhite = base3.create(0,0,"boton");
			botonWhite.x = baseboton.x + botonWhite.width/7;
			botonWhite.y = baseboton.y + botonWhite.width/7;
			botonWhite.anchor.setTo(0.,0);
		sceneGroup.add(base3);
		base1.x =20;
		base2.x = game.width/2 - baseboton.width/2;
		base3.x = game.width - baseboton.width - 20;
		
		/*var helicoptero = game.add.spine(game.world.centerX - game.width/8,game.world.centerY + (game.world.centerY/2) ,"helicoptero");
		helicoptero.setAnimationByName(0, "IDLE", true);
		helicoptero.setSkinByName("normal");
		sceneGroup.add(helicoptero);*/
		var heligroup = game.add.group();
		var helicoptero = heligroup.create(0,0,"helicopter");
		helicoptero.x = game.world.centerX - helicoptero.width/2;
		helicoptero.y = game.world.centerY;
		
		var clock = heligroup.create(0,0,"clock");
		clock.x = helicoptero.x + clock.width/1.4;
		clock.y = helicoptero.y + clock.height/2.6;
	
		hour = heligroup.create(0,0,"hour");
		hour.x = clock.x + clock.width/2 - 2;
		hour.y = clock.y + clock.height/2;
		hour.angle = 0;
		hour.anchor.setTo(0.5,1);
		
		minute = heligroup.create(0,0,"minute");
		minute.x = clock.x + clock.width/2 -2;
		minute.y = clock.y + clock.height/2;
		minute.angle = 0;
		minute.anchor.setTo(0.5,1);
		
		watch = heligroup.create(0,0,"watch");
		watch.x = clock.x + clock.width + 20;
		watch.y = clock.y + clock.height/2.8;
		
		TweenMax.fromTo(hour,0.8,{angle:0},{angle:90,ease:Back.esaeOut});
		
		TweenMax.fromTo(heligroup.scale,0.8,{y:1},{y:0.9,repeat:-1,yoyo:true,ease:Bounce.esaeOut});
		TweenMax.fromTo(heligroup,0.8,{y:heligroup.y},{y:heligroup.y + 80,repeat:-1,yoyo:true,ease:Bounce.esaeOut});
		//heligroup.width = game.width;
		//heligroup.height = game.height/3;
		
		sceneGroup.add(heligroup);
		
		
		var rectButton = new Phaser.Graphics(game)
        rectButton.beginFill(0x000000)
        rectButton.drawRect(0,0,game.world.width *2, game.world.height *2)
        rectButton.alpha = 0
        rectButton.endFill()
        rectButton.inputEnabled = true
        rectButton.events.onInputDown.add(touchFun,this);	
		rectButton.events.onInputUp.add(stopTouchFun,this);	
		sceneGroup.add(rectButton);
		
		
		function touchFun(){
		}
		
		function stopTouchFun(){
		}
		
		
		
		//createHearts();
		createCoins();
		//createOverlay();
	}

	
	function gameOver(){
		var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,28)
			sceneloader.show("result");
	}


	
	function update() {
		
	}
		

	
	
	return {
		assets: assets,
		name: "flightoclock",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()