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
				file: soundsPath + "combo.mp3"}
		],
	}
    var gameIndex = 39;
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
	var angulo = 0;
	var activeGame = true;
	var minute;
	var hour;
	var watch;
	var bigStar;
	var bigWrong;
	var heligroup;
	var planegroup;
	var rocketgroup;
	var ship = 0;
	var bgclock;
	var clockText;	
	var timerCount;
	var timer = 10;
	var timerFunction;
	
	var styleWhite = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	var styleBlack = {font: "80px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };
	var styleClock = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };

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
		game.load.image("bigStar",imagePath + "star.png");
		game.load.image("bigWrong",imagePath + "wrong.png");
		game.load.image("background",imagePath + "background.png");
		game.load.image("background2",imagePath + "background2.png");
		game.load.image("base",imagePath + "base.png");
		game.load.image("baseboton",imagePath + "baseboton.png");
		game.load.image("boton",imagePath + "boton.png");
		game.load.image("helicopter",imagePath + "helicopter.png");
		game.load.image("plane",imagePath + "plane.png");
		game.load.image("rocket",imagePath + "rocket.png");
		game.load.image("clock",imagePath + "clock.png");
		game.load.image("hour",imagePath + "hour.png");
		game.load.image("minute",imagePath + "minutes.png");
		game.load.image("watch",imagePath + "watch.png");
		/*SPINE*/
		game.load.spine("helicoptero", imagePath + "spine/helicoptero.json");
		game.load.spine("avion", imagePath + "spine/avion.json");
		game.load.spine("cohete", imagePath + "spine/coete.json");
		
		
		
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

		function getRandomArbitrary(min, max) {
  			return Math.floor(Math.random() * (max - min) + min);
	}	
	
	var nums = [12,1,2,3,4,5,6,7,8,9,10,11];


		function shuffle(array) {
		  var currentIndex = array.length, temporaryValue, randomIndex;
		  while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		  }
		  return array;
		}
		
	
	function createOverlay(){
		lives = 1;
		coins = 0;
		heartsText.setText("x " + lives);
		xpText.setText(coins);
		speedGame = 5;
		starGame = false;
		
        sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex);;
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

		
		bgm = game.add.audio('sillyAdventureGameLoop')
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
		heartsText = game.add.text(50, 10, "x " + lives, styleWhite,heartsGroup);	
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
		xpText = game.add.text(50, 10, coins, styleWhite,coinsGroup);	
		xpText.anchor.setTo(0, 0);	
		xpText.x = 75;
		xpText.y = 2;	
		sceneGroup.add(coinsGroup);
	}	

	
	/*CREATE SCENE*/
    function createScene(){
		nums = shuffle(nums);
		function whatTime(){
			switch(nums[0]){
				case 12:
					angulo = 0;
				break;
				case 1:
					angulo = 40;
				break;
				case 2:
					angulo = 60;
				break;
				case 3:
					angulo = 90;
				break;
				case 4:
					angulo = 120;
				break;
				case 5:
					angulo = 155;
				break;
				case 6:
					angulo = 180;
				break;
				case 7:
					angulo = 210;
				break;
				case 8:
					angulo = 230;
				break;
				case 9:
					angulo = 270;
				break;
				case 10:
					angulo = 300;
				break;
				case 11:
					angulo = 330;
				break;
				}
			}
		whatTime();		
		
		sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex);;
		loadSounds();
		
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		var background = game.add.tileSprite(0,0,game.width,game.height,"background");
		sceneGroup.add(background);
		var background2 = sceneGroup.create(game.world.centerX,game.world.centerY,"background2");
		background2.anchor.setTo(0.5,0.5);
		var base = game.add.tileSprite(game.world.centerX,0,game.width,293,"base");
		base.y = game.world.centerY + base.height/1.48;
		base.anchor.setTo(0.5,0);
		sceneGroup.add(base);

		function createHelicopter(){
			heligroup = game.add.group();
			var helicoptero = heligroup.create(0,0,"helicopter");
			helicoptero.x = game.world.centerX - helicoptero.width/2;
			helicoptero.y = game.world.centerY;

			var clock = heligroup.create(0,0,"clock");
			clock.x = helicoptero.x + clock.width/1.4;
			clock.y = helicoptero.y + clock.height/2.6;

			var hour = heligroup.create(0,0,"hour");
			hour.x = clock.x + clock.width/2 - 2;
			hour.y = clock.y + clock.height/2;
			hour.angle = 0;
			hour.anchor.setTo(0.5,1);

			var minute = heligroup.create(0,0,"minute");
			minute.x = clock.x + clock.width/2 -2;
			minute.y = clock.y + clock.height/2;
			minute.angle = 0;
			minute.anchor.setTo(0.5,1);

			var watch = heligroup.create(0,0,"watch");
			watch.x = clock.x + clock.width + 20;
			watch.y = clock.y + clock.height/2.8;
			
			if(coins == 0){
			heligroup.glow = game.add.text(0, 0, "?");
			heligroup.glow.anchor.setTo(0.5,0.5); 
			heligroup.glow.align = 'center';
			heligroup.glow.font = 'Arial Black';
			heligroup.glow.fontSize = 50;
			heligroup.glow.fontWeight = 'bold';
			heligroup.glow.fill = '#ff0000';
			heligroup.glow.x = watch.x + heligroup.glow.width/1.2;
			heligroup.glow.y = watch.y + heligroup.glow.height/1.8;
			heligroup.add(heligroup.glow);
			
				TweenMax.fromTo(heligroup.glow.scale,1,{x:1,y:1},{x:2,y:2,repeat:-1});
				TweenMax.fromTo(heligroup.glow,1,{alpha:1},{alpha:0,repeat:-1})				
			}

			
			
			heligroup.textWatch = game.add.text(0, 0, "?", styleWhite,heligroup);
			heligroup.textWatch.anchor.setTo(0.2,0.3); 
			heligroup.textWatch.x = watch.x + heligroup.textWatch.width;
			heligroup.textWatch.y = watch.y + heligroup.textWatch.height/2;
			heligroup.textWatch.id = heligroup.textWatch.x;
			
			
			var textWatch1 = game.add.text(0, 0, "0", styleWhite,heligroup);
			textWatch1.anchor.setTo(0.2,0.3);
			textWatch1.x = watch.x + heligroup.textWatch.width*4.5;
			textWatch1.y = watch.y + heligroup.textWatch.height/2;	

			var textWatch2 = game.add.text(0, 0, "0", styleWhite,heligroup);
			textWatch2.anchor.setTo(0.2,0.3);
			textWatch2.x = watch.x + heligroup.textWatch.width*7;
			textWatch2.y = watch.y + heligroup.textWatch.height/2;		

			TweenMax.fromTo(hour,0.8,{angle:0},{angle:angulo,ease:Back.esaeOut});
			TweenMax.fromTo(heligroup.scale,0.8,{y:1},{y:0.9,repeat:-1,yoyo:true,ease:Bounce.esaeOut});
			TweenMax.fromTo(heligroup,0.8,{y:heligroup.y},{y:heligroup.y + 80,repeat:-1,yoyo:true,ease:Bounce.esaeOut});	
			
			TweenMax.fromTo(heligroup,1,{x:heligroup.x - game.width},{x:heligroup.x});
			
			sceneGroup.add(heligroup);
		}
		

		function createPlane(){
			planegroup = game.add.group();
			var plane = planegroup.create(0,0,"plane");
			plane.x = game.world.centerX - plane.width/2;
			plane.y = game.world.centerY - 30;

			var clockPlane = planegroup.create(0,0,"clock");
			clockPlane.x = plane.x + clockPlane.width/3.3;
			clockPlane.y = plane.y + clockPlane.height/2.5

			var watchPlane = planegroup.create(0,0,"watch");
			watchPlane.x = clockPlane.x + clockPlane.width + 15;
			watchPlane.y = clockPlane.y + clockPlane.height/1.9;
			
			planegroup.textWatch = game.add.text(0, 0, "?", styleWhite,planegroup);
			planegroup.textWatch.anchor.setTo(0.2,0.3);
			planegroup.textWatch.x = watchPlane.x + planegroup.textWatch.width;
			planegroup.textWatch.y = watchPlane.y + planegroup.textWatch.height/2;
			planegroup.textWatch.id = planegroup.textWatch.x;

			var textWatch1 = game.add.text(0, 0, "0", styleWhite,planegroup);
			textWatch1.anchor.setTo(0.2,0.3);
			textWatch1.x = watchPlane.x + planegroup.textWatch.width*4.5;
			textWatch1.y = watchPlane.y + planegroup.textWatch.height/2;	

			var textWatch2 = game.add.text(0, 0, "0", styleWhite,planegroup);
			textWatch2.anchor.setTo(0.2,0.3);
			textWatch2.x = watchPlane.x + planegroup.textWatch.width*7;
			textWatch2.y = watchPlane.y + planegroup.textWatch.height/2;	
			
			var hour = planegroup.create(0,0,"hour");
			hour.x = clockPlane.x + clockPlane.width/2 - 2;
			hour.y = clockPlane.y + clockPlane.height/2;
			hour.angle = 0;
			hour.anchor.setTo(0.5,1);

			var minute = planegroup.create(0,0,"minute");
			minute.x = clockPlane.x + clockPlane.width/2 -2;
			minute.y = clockPlane.y + clockPlane.height/2;
			minute.angle = 0;
			minute.anchor.setTo(0.5,1);
			
			TweenMax.fromTo(hour,0.8,{angle:0},{angle:angulo,ease:Back.esaeOut});
			TweenMax.fromTo(planegroup.scale,0.8,{y:1},{y:0.9,repeat:-1,yoyo:true,ease:Bounce.esaeOut});
			TweenMax.fromTo(planegroup,0.8,{y:planegroup.y},{y:planegroup.y + 80,repeat:-1,yoyo:true,ease:Bounce.esaeOut});		
			
			TweenMax.fromTo(planegroup,1,{x:planegroup.x + game.width},{x:planegroup.x});
			
			sceneGroup.add(planegroup);
			
		}
		
		function createRocket(){
			rocketgroup = game.add.group();
			var rocket = rocketgroup.create(0,0,"rocket");
			rocket.x = game.world.centerX - rocket.width/2;
			rocket.y = game.world.centerY - rocket.height/3;

			var clockRocket = rocketgroup.create(0,0,"clock");
			clockRocket.x = rocket.x + clockRocket.width/2.6;
			clockRocket.y = rocket.y + clockRocket.height/1.8;

			var watchRocket = rocketgroup.create(0,0,"watch");
			watchRocket.x = clockRocket.x - 10;
			watchRocket.y = clockRocket.y + clockRocket.height + 20;
			
			rocketgroup.textWatch = game.add.text(0, 0, "?", styleWhite,rocketgroup);
			rocketgroup.textWatch.anchor.setTo(0.2,0.3);
			rocketgroup.textWatch.x = watchRocket.x + rocketgroup.textWatch.width;
			rocketgroup.textWatch.y = watchRocket.y + rocketgroup.textWatch.height/2;
			rocketgroup.textWatch.id= rocketgroup.textWatch.x;

			var textWatch1 = game.add.text(0, 0, "0", styleWhite,rocketgroup);
			textWatch1.anchor.setTo(0.2,0.3);
			textWatch1.x = watchRocket.x + rocketgroup.textWatch.width*4.5;
			textWatch1.y = watchRocket.y + rocketgroup.textWatch.height/2;	

			var textWatch2 = game.add.text(0, 0, "0", styleWhite,rocketgroup);
			textWatch2.anchor.setTo(0.2,0.3);
			textWatch2.x = watchRocket.x + rocketgroup.textWatch.width*7;
			textWatch2.y = watchRocket.y + rocketgroup.textWatch.height/2;	
			
			var hour = rocketgroup.create(0,0,"hour");
			hour.x = clockRocket.x + clockRocket.width/2 - 2;
			hour.y = clockRocket.y + clockRocket.height/2;
			hour.angle = 0;
			hour.anchor.setTo(0.5,1);

			var minute = rocketgroup.create(0,0,"minute");
			minute.x = clockRocket.x + clockRocket.width/2 -2;
			minute.y = clockRocket.y + clockRocket.height/2;
			minute.angle = 0;
			minute.anchor.setTo(0.5,1);
			
			TweenMax.fromTo(hour,0.8,{angle:0},{angle:angulo,ease:Back.esaeOut});
			TweenMax.fromTo(rocketgroup.scale,0.8,{y:1},{y:0.9,repeat:-1,yoyo:true,ease:Bounce.esaeOut});
			TweenMax.fromTo(rocketgroup,0.8,{y:rocketgroup.y},{y:rocketgroup.y + 80,repeat:-1,yoyo:true,ease:Bounce.esaeOut});		
			
			TweenMax.fromTo(rocketgroup,1,{x:rocketgroup.x + game.width},{x:rocketgroup.x});
			
			sceneGroup.add(rocketgroup);
			
		}		
			
		
		createHelicopter();
		//createPlane();
		//createRocket();
		
		var planeSpine = game.add.spine(game.world.centerX,game.world.centerY + (game.world.centerY/2) ,"avion");
		sceneGroup.add(planeSpine);	
		planeSpine.alpha = 0;
		
		var helicopteroSpine = game.add.spine(game.world.centerX - game.width/8,game.world.centerY + (game.world.centerY/2) ,"helicoptero");
		sceneGroup.add(helicopteroSpine);	
		helicopteroSpine.alpha = 0;
		
		var rocketSpine = game.add.spine(game.world.centerX,game.world.centerY + (game.world.centerY/2) ,"cohete");
		sceneGroup.add(rocketSpine);	
		rocketSpine.alpha = 0;
		


		var textArray = [nums[0],nums[1],nums[2]];
		textArray = shuffle(textArray);
		var options = new Array;
		var basesGroup = new Array;
		var Buttons = new Array; 
	
		for(var p=0;p<=2;p++){
			basesGroup[p] = game.add.group();
			var baseboton = basesGroup[p].create(0,0,"baseboton");
			baseboton.y =game.height - baseboton.height*1.3;
			var botonWhite = basesGroup[p].create(0,0,"boton");
			botonWhite.x = baseboton.x + botonWhite.width/7;
			botonWhite.y = baseboton.y + botonWhite.width/7;
			botonWhite.anchor.setTo(0,0);
						
			options[p] = game.add.text(0, 0, textArray[p], styleBlack,basesGroup[p] );
			options[p].anchor.setTo(0,0.3);
			options[p].setTextBounds(baseboton.x, baseboton.y, baseboton.width, baseboton.height + options[p].height/1.5);
			options[p].id = textArray[p];
			
			Buttons[p] = new Phaser.Graphics(game)
        	Buttons[p].beginFill(0x000000)
        	Buttons[p].drawRect(botonWhite.x-10,botonWhite.y-10,basesGroup[p].width, basesGroup[p].height)
        	Buttons[p].alpha = 0;
			Buttons[p].id = textArray[p];
        	Buttons[p].endFill()
			Buttons[p].inputEnabled = true
        	Buttons[p].events.onInputDown.add(pressTime,this);	
			basesGroup[p].add(Buttons[p]);
			
			sceneGroup.add(basesGroup[p]);
			
		}

		basesGroup[0].x =20;
		basesGroup[1].x = game.width/2 - baseboton.width/2;
		basesGroup[2].x = game.width - baseboton.width - 20;	
		

		
		
		function pressTime(item){
			if(activeGame){
				console.log("press");
				
				if(item.id == nums[0]){
					sound.play("magic");
					coins++;
					xpText.setText(coins);
					clearInterval(timerCount);
					if(coins == 3){
						bgclock.alpha = 1;
						clockText.alpha = 1;
						TweenMax.to(bgclock.scale,0.5,{x:1,ease:Back.easeOut});
						TweenMax.to(clockText.scale,0.5,{x:1,ease:Back.easeOut});			
					}
					switch(ship){
						case 0:
						helicopteroSpine.setAnimationByName(0, "FLAYING", true);
						helicopteroSpine.setSkinByName("normal");	
						var timeHel  = heligroup.textWatch;
						timeHel.setText(nums[0]);	
							if(item.id >= 10){
								timeHel.x = timeHel.id - 5;
							}else{
								timeHel.x = timeHel.id;
							}
						TweenMax.fromTo(timeHel.scale,0.5,{x:1.2},{x:1,onComplete:completeHeli});
						function completeHeli(){
							heligroup.destroy();
							helicopteroSpine.alpha = 1;
							TweenMax.fromTo(bigStar.scale,1,{y:3,x:3},{y:6,x:6});
							TweenMax.fromTo(bigStar,1,{alpha:1},{alpha:0});
							TweenMax.fromTo(helicopteroSpine,1,{y:game.world.centerY + (game.world.centerY/2)},{y:-100,delay:1,ease:Back.easeIn,onComplete:newGame});	
						}	
						
							ship = 1;
						break;
						
						case 1:
						planeSpine.setAnimationByName(0, "FLAYING", true);
						planeSpine.setSkinByName("normal");	
						var timePlane  = planegroup.textWatch;
						timePlane.setText(nums[0]);	
							if(item.id >= 10){
								timePlane.x = timePlane.id - 5;
							}else{
								timePlane.x = timePlane.id;
							}
						TweenMax.fromTo(timePlane.scale,0.5,{x:1.2},{x:1,onComplete:completePlane});
						function completePlane(){
							planegroup.destroy();
							planeSpine.alpha = 1;
							TweenMax.fromTo(bigStar.scale,1,{y:3,x:3},{y:6,x:6});
							TweenMax.fromTo(bigStar,1,{alpha:1},{alpha:0});
							TweenMax.fromTo(planeSpine,1,{y:game.world.centerY + (game.world.centerY/2)},{y:-100,delay:1,ease:Back.easeIn,onComplete:newGame});
						}	
							ship= 2;
						break;
						
						case 2:
						rocketSpine.setAnimationByName(0, "FLAYING", true);
						rocketSpine.setSkinByName("normal");	
						var timeRocket  = rocketgroup.textWatch;
						timeRocket.setText(nums[0]);	
							if(item.id >= 10){
								timeRocket.x = timeRocket.id - 5;
							}else{
								timeRocket.x = timeRocket.id;
							}
						TweenMax.fromTo(timeRocket.scale,0.5,{x:1.2},{x:1,onComplete:completeRocket});
						function completeRocket(){
							rocketgroup.destroy();
							rocketSpine.alpha = 1;	
							TweenMax.fromTo(bigStar.scale,1,{y:3,x:3},{y:6,x:6});
							TweenMax.fromTo(bigStar,1,{alpha:1},{alpha:0});
							TweenMax.fromTo(rocketSpine,1,{y:game.world.centerY + (game.world.centerY/2)},{y:-100,delay:1,ease:Back.easeIn,onComplete:newGame});
						}								
							
							ship= 0;						
						break;
							
					 }
					
					
				}else{
					sound.play("wrong");
					sound.play("gameLose");
					bgm.stop();
					TweenMax.fromTo(bigWrong.scale,1,{y:3,x:3},{y:6,x:6});
					TweenMax.fromTo(bigWrong,1,{alpha:1},{alpha:0});
					clearInterval(timerCount);
					switch(ship){
						case 0:
							heligroup.destroy();
							helicopteroSpine.alpha = 1;
							helicopteroSpine.y= game.world.centerY + (game.world.centerY/2)
							helicopteroSpine.setAnimationByName(0, "BROKENSTILL", true);
							helicopteroSpine.setSkinByName("normal");
							TweenMax.fromTo(sceneGroup,1,{alpha:1},{alpha:1,delay:1,onComplete:gameOver});
						break;
						case 1:
							planegroup.destroy();
							planeSpine.alpha = 1;
							planeSpine.y= game.world.centerY + (game.world.centerY/2)
							planeSpine.setAnimationByName(0, "BROKENSTILL", true);
							planeSpine.setSkinByName("normal");		
							TweenMax.fromTo(sceneGroup,1,{alpha:1},{alpha:1,delay:1,onComplete:gameOver});
						break;
						case 2:
							rocketgroup.destroy();
							rocketSpine.alpha = 1;
							rocketSpine.y= game.world.centerY + (game.world.centerY/2)
							rocketSpine.setAnimationByName(0, "BROKENSTILL", true);
							rocketSpine.setSkinByName("normal");	
							TweenMax.fromTo(sceneGroup,1,{alpha:1},{alpha:1,delay:1,onComplete:gameOver});
							
							
						break;
							   
					}

				
				}
				activeGame = false;
			}
		}
		


		
		

		bigStar = sceneGroup.create(0,0,"bigStar");
		bigStar.scale.setTo(3);
		bigStar.alpha = 0;
		bigStar.anchor.setTo(0.5,0.5);
		bigStar.x = helicopteroSpine.x + bigStar.width/2;
		bigStar.y = helicopteroSpine.y - bigStar.height/2;
		
		bigWrong = sceneGroup.create(0,0,"bigWrong");
		bigWrong.scale.setTo(3);
		bigWrong.alpha = 0;
		bigWrong.anchor.setTo(0.5,0.5);
		bigWrong.x = helicopteroSpine.x + bigWrong.width/2;
		bigWrong.y = helicopteroSpine.y - bigWrong.height/2;
		
		
		function newGame(){
			nums = shuffle(nums);
			whatTime();
			sound.play("combo");
			textArray = [nums[0],nums[1],nums[2]];
			textArray = shuffle(textArray);
			if(coins >= 3){
				timer = 10;
				clearInterval(timerCount);
				timerCount = setInterval(timerFunction, 1000);
			}
			
			for(var p=0;p<=2;p++){
				options[p].setText(textArray[p]);
				Buttons[p].id = textArray[p];
			}
			
			activeGame = true;
			switch(ship){
				case 0:
					createHelicopter();
				break;
					
			case 1:
					createPlane();
				break;
					
			case 2:
					createRocket();
				break;
					
			
			}
			
		}
		
		
		bgclock = sceneGroup.create(0,1,"bgclock");
		bgclock.x = game.width * 0.5;
		bgclock.anchor.setTo(0.5, 0);
		clockText = game.add.text(50, 46, timer, styleClock,sceneGroup);	
		clockText.x = game.width * 0.5;
		clockText.anchor.setTo(0.5, 0);
		bgclock.alpha = 0;
		clockText.alpha = 0;		
		
		
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
		
		
		createHearts();
		createCoins();
		createOverlay();
	}

	
	function gameOver(){
		var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,gameIndex)
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