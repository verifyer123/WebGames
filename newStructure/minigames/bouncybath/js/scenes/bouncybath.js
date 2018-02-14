var soundsPath = "../../shared/minigames/sounds/"
var imagePath = "images/bouncybath/"
var bouncybath = function(){

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
    var gameIndex = 33;
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
	var puerco;
	var puercos = new Array;
	var pigBullets = new Array;
	var trampolin;
	var pigSprite;
	var arbusto1;
	var floor;
	var wallLeft;
	var wallRight;
	var rectTrampolin;
	var contador = 0;
	var numPigs = 10;
	var watergunLeft;
	var watergunRight;
	var waterRight;
	var waterleft;
	var lodoGroup = null;
	var lodo;
	var lodo2;
	var timePig = 2;
	var morePigs = new Array;
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
		game.load.image("background",imagePath + "background.png");
		
		game.load.image("heartsIcon", imagePath +"hearts.png");
		game.load.image("xpIcon", imagePath +"xpcoins.png");	
		game.load.image('buttonPlay',imagePath +"tutorial/button.png");		
		game.load.image('pc',imagePath +"tutorial/desktop.png");
		game.load.image('gametuto',imagePath +"tutorial/gametuto.png");
		game.load.image('introscreen',imagePath +"tutorial/introscreen.png");
		game.load.image('howTo',imagePath +"tutorial/how"  + localization.getLanguage()  + ".png");
		game.load.image('buttonText',imagePath +"tutorial/play" + localization.getLanguage() + ".png");	
		game.load.image("lodo",imagePath + "lodo.png");
		game.load.image("lodo2",imagePath + "lodo2.png");
		game.load.image("trampolin",imagePath + "trampolin.png");
		game.load.image("trampolin2",imagePath + "trampolin2.png");
		game.load.image("bgtrampolin",imagePath + "bgtrampolin.png");
		game.load.image("arbusto",imagePath + "arbusto.png");
		game.load.image("bullet",imagePath + "bullet.png");
		game.load.image("watergun",imagePath + "watergun.png");
		game.load.spritesheet('water', imagePath + "sprites/" + 'waterPump.png', 128, 128, 6);
		game.load.spine("cochino", imagePath + "spine/skeleton.json");
		
		;
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
		
        sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); ;
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
		xpText = game.add.text(50, 10, coins, style,coinsGroup);	
		xpText.anchor.setTo(0, 0);	
		xpText.x = 75;
		xpText.y = 2;	
		sceneGroup.add(coinsGroup);
	}	

	
	/*CREATE SCENE*/
    function createScene(){
		sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); ;
		loadSounds();
		
			
		game.physics.startSystem(Phaser.Physics.P2JS);
		//game.physics.p2.gravity.y = 1;
		
		
		var background = game.add.tileSprite(0,0,game.width,game.height,"background");
		sceneGroup.add(background);
		lodoGroup = game.add.group();
		lodo = game.add.tileSprite(0,0,game.width/1.3,128,"lodo");
		lodo.x = game.world.centerX;
		lodo.y = game.height - lodo.height*3;
		lodo.anchor.setTo(0.5,0);
		
		lodo2 = game.add.tileSprite(0,0,game.width/1.3,game.height,"lodo2");
		lodo2.x = game.world.centerX;
		lodo2.y = game.height - game.height/2.9
		lodo2.anchor.setTo(0.5,0);
		lodoGroup.add(lodo);
		lodoGroup.add(lodo2);
		sceneGroup.add(lodoGroup);
		lodoGroup.y = 240;
		
		
		trampolin = sceneGroup.create(game.world.centerX,game.world.centerY,"trampolin")
		trampolin.anchor.setTo(0.5,0.4);
		var bgtrampolin = sceneGroup.create(game.world.centerX,game.world.centerY,"bgtrampolin")
		bgtrampolin.anchor.setTo(0.5,0.4);
		bgtrampolin.blendMode = Phaser.blendModes.SCREEN;
		var trampolin2 = sceneGroup.create(0,240,"trampolin2");
		trampolin2.width = game.width/2;
		trampolin2.x = trampolin.x + trampolin2.width + 35;
		
		trampolin2.anchor.setTo(1,1);
		
		arbusto1 = sceneGroup.create(0,game.height,"arbusto")
		arbusto1.anchor.setTo(0.5,1);		
		var arbusto2 = sceneGroup.create(game.width,game.height,"arbusto")
		arbusto2.anchor.setTo(0.5,0.5);
		
		watergunLeft =sceneGroup.create(0,290,"watergun");
		watergunLeft.x = trampolin.x - trampolin.width/1.55;
		
		
		watergunRight =sceneGroup.create(0,730,"watergun");
		watergunRight.x = trampolin.x + trampolin.width/1.55;
		watergunRight.anchor.setTo(0,1);
		watergunRight.angle = 180;
		
		var animaLeft = TweenMax.fromTo(watergunLeft,4,{y:290},{y:730,yoyo:true,repeat:-1});
		var animaRigth = TweenMax.fromTo(watergunRight,4,{y:730},{y:290,yoyo:true,repeat:-1});
		
		
		var leftBulletGroup = game.add.group();
		var bulletsLeft = new Array;
		
		var rightBulletGroup = game.add.group();
		var bulletsRight = new Array;
		
		
		
		for(var i = 0;i<=8;i++){
			bulletsLeft[i] = leftBulletGroup.create(0, i * 55,"bullet");
			bulletsRight[i] = rightBulletGroup.create(0, i * 55,"bullet");			
		}

	
		leftBulletGroup.x = trampolin.x - trampolin.width/1.6;
		leftBulletGroup.y = 300;
		rightBulletGroup.x = trampolin.x + trampolin.width/1.9;
		rightBulletGroup.y = 300;
		
		
		waterRight= game.add.sprite(0, 0, 'water');
		waterRight.alpha = 0;
		waterRight.y = 260;
		waterRight.x = rightBulletGroup.x - 185;
		var waterpump1 = waterRight.animations.add('waterpump1');
		
		waterleft = game.add.sprite(watergunLeft.x + watergunLeft.width*1.4, 0, 'water');
		waterleft.angle = 180;
		waterleft.anchor.setTo(0.5,0.5)
		waterleft.alpha = 1;
		waterleft.y = 315;
		waterleft.width = 0;
		var waterpump2 = waterleft.animations.add('waterpump2');
		


    	game.physics.startSystem(Phaser.Physics.ARCADE);
		
		floor = new Phaser.Graphics(game)
        floor.beginFill(0x000000)
        floor.drawRect(0,0,game.world.width, game.world.height /14)
        floor.alpha = 0.4;
		floor.x = game.world.centerX - floor.width/2;
		floor.y = game.height - floor.height;
        floor.endFill();
		sceneGroup.add(floor);
		
		rectTrampolin = new Phaser.Graphics(game)
        rectTrampolin.beginFill(0x000000)
        rectTrampolin.drawRect(0,0,game.world.width/2.4, game.world.height /20)
        rectTrampolin.alpha = 0.4;
		rectTrampolin.x = trampolin.x +  rectTrampolin.width;
		rectTrampolin.y = trampolin.y - trampolin.height/2.9;
        rectTrampolin.endFill();
		sceneGroup.add(rectTrampolin);
		
		wallLeft = new Phaser.Graphics(game)
        wallLeft.beginFill(0x000000)
        wallLeft.drawRect(0,0,20, game.world.height /1.39)
        wallLeft.alpha = 0.4;
		wallLeft.x = trampolin.x - trampolin.width/2;
		wallLeft.y = floor.y - wallLeft.height;
        wallLeft.endFill();
		sceneGroup.add(wallLeft);
		
		wallRight = new Phaser.Graphics(game)
        wallRight.beginFill(0x000000)
        wallRight.drawRect(0,0,20, game.world.height /1.39)
        wallRight.alpha = 0.4;
		wallRight.x = trampolin.x + trampolin.width/2.2;
		wallRight.y = floor.y - wallRight.height;
        wallRight.endFill();
		sceneGroup.add(wallRight);

		
		game.physics.enable( [ floor, wallLeft, wallRight, rectTrampolin,waterleft,waterRight], Phaser.Physics.ARCADE);
		floor.body.collideWorldBounds = true;
		floor.body.immovable = true;
		
		wallLeft.body.collideWorldBounds = true;
		wallLeft.body.immovable = true;
		
		wallRight.body.collideWorldBounds = true;
		wallRight.body.immovable = true;
		
		rectTrampolin.body.collideWorldBounds = true;
		rectTrampolin.body.immovable = true;
		
		waterRight.body.collideWorldBounds = true;
		waterRight.body.immovable = true;
		waterRight.body.enable = false;
		
		waterleft.body.collideWorldBounds = true;
		waterleft.body.immovable = true;
		waterleft.body.enable = false;

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
			sound.play("watersplash");
			animaRigth.pause();
			animaLeft.pause();
			waterleft.body.enable = true;
			waterleft.width = 128;
			waterleft.animations.play('waterpump2', 24, true);	
			waterRight.body.enable = true;
			waterRight.alpha=1;
			waterRight.animations.play('waterpump1', 24, true);	
			waterleft.y = watergunLeft.y + watergunLeft.height/2.3;
			waterRight.y = watergunRight.y - watergunRight.height/2.3;
		}
		
		function stopTouchFun(){
			animaRigth.resume();
			animaLeft.resume();
			waterleft.body.enable = false;
			waterleft.width = 0;
			waterleft.animations.stop('waterpump2', 24, true);
			waterRight.body.enable = false;
			waterRight.alpha=0;
			waterRight.animations.stop('waterpump1', 24, true);	
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
		
		if(lodoGroup.y <= 0){
			sound.play("gameLose");
			bgm.stop();
			gameOver();
		}
		
		lodo.tilePosition.x += 2;
		lodo2.tilePosition.x += 2;
		game.physics.arcade.overlap(morePigs,waterleft,collisionHandler, null, this);
		game.physics.arcade.overlap(morePigs,waterRight,collisionHandler, null, this);
		game.physics.arcade.overlap(morePigs,floor,collisionHandler2, null, this);
		for(var p = 0;p<=morePigs.length-1;p++){
			puercos[p].x = pigBullets[p].x;
			puercos[p].y = pigBullets[p].y;
			}
		
		game.physics.arcade.collide(morePigs,waterRight);
		game.physics.arcade.collide(morePigs,waterleft);
		game.physics.arcade.collide(morePigs,wallLeft);
		game.physics.arcade.collide(morePigs,wallRight);
		game.physics.arcade.collide(morePigs,floor);
		game.physics.arcade.collide(morePigs,rectTrampolin);
		game.physics.arcade.collide(morePigs,morePigs);
		game.physics.arcade.collide(morePigs,floor);
	}
	
	function collisionHandler (pig) {
		pig.kill();



			if(timePig >= 0.4){
				timePig = timePig - 0.05;
			}
		puercos[pig.name.substr(3,3)].setAnimationByName(0, "CLEAN", true);
		puercos[pig.name.substr(3,3)].setSkinByName("pig");
		sound.play("clean");

		TweenMax.to(puercos[pig.name.substr(3,3)],0.5,{alpha:0,delay:0,onComplete:killPig});
		function killPig(){
			waterleft.body.enable = false;
			waterRight.body.enable = false;
			puercos[pig.name.substr(3,3)].kill();


		}
		coins++
		xpText.setText(coins);
	}
	
	function collisionHandler2(pig){
		lodoGroup.y = lodoGroup.y - 25;
		/*if(pig.activeHits == false){
			if(pig.hits <= 1){
				pig.hits += 1;
				
			}else{
				lodoGroup.y = lodoGroup.y - 55;

					pig.activeHits = true;
				
			}
		   }*/
			
	}
	
	function createNewPig(){
		var lastPig = parseInt(morePigs.length);
			puercos[lastPig] = game.add.spine(0,100,"cochino");
			puercos[lastPig].setAnimationByName(0, "DIRTY", true);
			
			puercos[lastPig].setSkinByName("pig");
			pigBullets[lastPig] = sceneGroup.create(0,200,"bullet");
			pigBullets[lastPig].name = "pig" + lastPig;
			pigBullets[lastPig].hits = 0;
			pigBullets[lastPig].activeHits = false;
			pigBullets[lastPig].x = game.width + pigBullets[lastPig].width*1.5;
			pigBullets[lastPig].anchor.setTo(0.5,1);
			pigBullets[lastPig].scale.setTo(2.3);
			pigBullets[lastPig].alpha = 0;
			game.physics.enable(pigBullets[lastPig] , Phaser.Physics.ARCADE);
			pigBullets[lastPig].body.collideWorldBounds = false;
			pigBullets[lastPig].body.bounce.set(0.7);
			morePigs[lastPig] = pigBullets[lastPig];
	}			

		var velocityPig = -200;
		
		function goPigs(){
			TweenMax.to(arbusto1,timePig,{alpha:1,onComplete:completePigs});
			velocityPig = velocityPig;
			createNewPig();	
					sound.play("pigsnort");
		}
		
		
		function completePigs(){
			pigBullets[contador].body.velocity.x = velocityPig;
			pigBullets[contador].body.gravity.set(0,600);
			contador++;
			velocityPig = velocityPig - 1
			goPigs();
		}	
	
	
	return {
		assets: assets,
		name: "bouncybath",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()