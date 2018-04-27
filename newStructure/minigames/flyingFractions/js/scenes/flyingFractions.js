var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var imagePath = "images/flyingFractions/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"

var flyingFractions = function(){

	assets = {
        atlases: [                
			{
                name: "atlas.flyingFractions",
                json: imagePath + "atlas.json",
                image: imagePath + "atlas.png",
			},
			],
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
			{	name: "laserexplode",
				file: soundsPath + "laserexplode.mp3"}
		],
	}
    var gameIndex = 14;
    var starGame = false;
	var sceneGroup = null;
	var coinsGroup = null;
	var heartsGroup = null;
	var background;
	var heartsIcon;
	var heartsText;
	var xpIcon;
	var xpText;
	var lives;
	var coins;
	var ship;
	var baseFracciones;
	var bgFracciones;
	var bgFracciones2;
	var fraccionesText;
	var malo;
	var malo_shoot;
	var marcoFracciones;
	var maloShoot;
	var goodShoot;
	var finish = false;
	var result1;
	var result2;		
	var good;
	var explosion;
	var fraction1;
	var fraction2;
	var timerCount;
	var timer = 10;
	var timerEvent = null

	var gamePaused = false

	
	var fractionsInfo =[{
			name:"1",
			base:"f2",
			fraction: "full"
		},
		{
			name:"1/2",
			base:"f2",
			fraction: "2_2"	
		},
		{
			name:"2/3",
			base:"f3",
			fraction: "3_2"	
		},
		{
			name:"1/3",
			base:"f3",
			fraction: "3_3"	
		},
		{
			name:"3/4",
			base:"f4",
			fraction: "4_2"	
		},
		{
			name:"2/4",
			base:"f4",
			fraction: "4_3"	
		},
		{
			name:"1/4",
			base:"f4",
			fraction: "4_4"	
		},
		{
			name:"4/5",
			base:"f5",
			fraction: "5_2"	
		},
		{
			name:"3/5",
			base:"f5",
			fraction: "5_3"	
		},
		{
			name:"2/5",
			base:"f5",
			fraction: "5_4"	
		},
		{
			name:"1/5",
			base:"f5",
			fraction: "5_5"	
		},
		{
			name:"5/6",
			base:"f6",
			fraction: "6_2"	
		},
		{
			name:"4/6",
			base:"f6",
			fraction: "6_3"	
		},
		{
			name:"3/6",
			base:"f6",
			fraction: "6_4"	
		},
		{
			name:"2/6",
			base:"f6",
			fraction: "6_5"	
		},
		{
			name:"1/6",
			base:"f6",
			fraction: "6_6"	
		}]

	function getRandomArbitrary(min, max) {
  			return Math.floor(Math.random() * (max - min) + min);
	}

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

		game.stage.disableVisibilityChange = false;
		
		game.load.audio('bgm8bits',  soundsPath + 'songs/technology_action.mp3');
		
		/*Default*/
		game.load.image("background", imagePath +"background.png");
		game.load.image("heartsIcon", imagePath +"hearts.png");
		game.load.image("xpIcon", imagePath +"xpcoins.png");	
		game.load.image('buttonPlay',imagePath +"tutorial/button.png");		
		game.load.image('pc',imagePath +"tutorial/desktop.png");
		game.load.image('gametuto',imagePath +"tutorial/gametuto.png");
		/*game.load.image('introscreen',imagePath +"tutorial/introscreen.png");
		game.load.image('howTo',imagePath +"tutorial/how"  + localization.getLanguage()  + ".png");
		game.load.image('buttonText',imagePath +"tutorial/play" + localization.getLanguage() + ".png");	*/
		/*Default*/
		game.load.image('bgclock',imagePath + "bgclock.png");
		game.load.spine("ship", imagePath + "ship/skeleton.json");
		game.load.image("malo", imagePath + "malo.png");
		game.load.image("maloShoot", imagePath + "maloShoot.png");
		game.load.image("baseFracciones", imagePath + "baseFracciones.png");
		game.load.image("marcoFracciones", imagePath + "marcoFracciones.png");
		game.load.image("f2", imagePath + "f2.png");
		game.load.image("f3", imagePath + "f3.png");
		game.load.image("f4", imagePath + "f4.png");
		game.load.image("f5", imagePath + "f5.png");
		game.load.image("f6", imagePath + "f6.png");	
		game.load.spritesheet('explosion', imagePath +  'explosion.png', 118, 118, 6);

		game.load.image('tutorial_image',imagePath+"tutorial_image.png")
		//loadType(gameIndex)

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
		gamePaused = false

	}	

	function getRandomArbitrary(min, max) {
  			return Math.floor(Math.random() * (max - min) + min);
	}
	
	function choiceFraction(){
		result1 = getRandomArbitrary(0,15);
		result2 = getRandomArbitrary(0,15);		
		good;
		
		if(result1 > result2){
			good = result1
		}else{
			good = result2
		}
	}
	

	
	function createOverlay(){
		lives = 1;
		coins = 0;
		finish = false;
		baseFracciones.alpha= 1;
		fraccionesText.alpha = 1;
		heartsText.setText("x " + lives);
		xpText.setText(coins);
		speedGame = 3.5;
		starGame = false;
		
        sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
        overlayGroup = game.add.group()
		if(game.device != 'desktop'){
		overlayGroup.scale.setTo(0.9,0.9);
		}else{
			overlayGroup.scale.setTo(1.2,1.2);
		}
		
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)

        /*var rect = new Phaser.Graphics(game)
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
		playText.anchor.setTo(0.1,0.5)*/
		
    }
    	
    function onClickPlay(){
		overlayGroup.y = -game.world.height
		
		starGame = true;
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
		sceneGroup = game.add.group()
		coins = 0;
		lives = 1;
		loadSounds();
		game.physics.startSystem(Phaser.Physics.ARCADE);	
		game.physics.startSystem(Phaser.Physics.P2JS);
		background = game.add.tileSprite(0,0,1280, game.world.height, "background");
		background.x = -background.width/6;
		sceneGroup.add(background);
		
		createHearts();
		createCoins();

		malo = game.add.sprite(game.world.centerX, 100 , "malo");
		malo.anchor.setTo(0.5,0);
		TweenMax.fromTo(malo,0.5,{y:malo.y},{y:malo.y+10,yoyo:true,repeat:-1});
		sceneGroup.add(malo);
		
		ship = game.add.spine(game.world.centerX,game.world.centerY + (game.world.centerY/1.5) ,"ship");
		
		ship.setAnimationByName(0, "IDLE", true);
		ship.setSkinByName("normal");
		sceneGroup.add(ship);
		
		maloShoot = game.add.sprite(malo.x, malo.y + malo.height , "maloShoot");
		maloShoot.anchor.setTo(0.5,0);
		maloShoot.alpha = 0;
		sceneGroup.add(maloShoot);
		
		goodShoot = game.add.sprite(ship.x, ship.y - ship.height , "maloShoot");
		goodShoot.anchor.setTo(0.5,1);
		goodShoot.scale.setTo(-1);
		goodShoot.alpha = 0;
		sceneGroup.add(goodShoot);
		
		choiceFraction();
		
		
		baseFracciones = game.add.sprite(game.world.centerX , game.world.centerY - (game.world.centerY/2),"baseFracciones");
		baseFracciones.anchor.setTo(0.5,0);
		baseFracciones.scale.setTo(0.7);
		sceneGroup.add(baseFracciones);
		
		fraccionesText = game.add.text(baseFracciones.x, baseFracciones.y + baseFracciones.height/4, fractionsInfo[good].name, style);	
		fraccionesText.anchor.setTo(0.5,0);
		baseFracciones.alpha= 0;
		fraccionesText.alpha = 0;
		sceneGroup.add(fraccionesText);
		
		var groupMarco1 = game.add.group();
		groupMarco1.x = game.world.centerX - game.width/4;
		marcoFracciones = groupMarco1.create(0 , game.world.centerY,"marcoFracciones");
		marcoFracciones.anchor.setTo(0.5,0.5);
		bgFracciones = groupMarco1.create(marcoFracciones.x ,marcoFracciones.y,fractionsInfo[result1].base);
		bgFracciones.anchor.setTo(0.5,0.5);
		groupMarco1.swap(marcoFracciones,bgFracciones);

		
		fraction1 = groupMarco1.create(bgFracciones.x,bgFracciones.y,'atlas.flyingFractions',fractionsInfo[result1].fraction);
		fraction1.anchor.setTo(0.5,0.5);
		fraction1.alpha = 0.7;
		fraction1.id = result1;
		fraction1.inputEnabled = true
		fraction1.events.onInputDown.add(buttonSelect,this);
		
		
		var groupMarco2 = game.add.group();
		groupMarco2.x = game.world.centerX + game.width/4;
		marcoFracciones = groupMarco2.create(0 , game.world.centerY,"marcoFracciones");
		marcoFracciones.anchor.setTo(0.5,0.5);
		bgFracciones2 = groupMarco2.create(marcoFracciones.x ,marcoFracciones.y,fractionsInfo[result2].base);
		bgFracciones2.anchor.setTo(0.5,0.5);
		groupMarco2.swap(marcoFracciones,bgFracciones2);		
		
		fraction2 = groupMarco2.create(bgFracciones.x,bgFracciones.y,'atlas.flyingFractions',fractionsInfo[result2].fraction);
		fraction2.anchor.setTo(0.5,0.5);
		fraction2.alpha = 0.7;
		fraction2.id = result2;
		fraction2.inputEnabled = true
		fraction2.events.onInputDown.add(buttonSelect,this);	
		sceneGroup.add(groupMarco1);
		sceneGroup.add(groupMarco2);
		
		bgclock = sceneGroup.create(0,1,"bgclock");
		bgclock.x = game.width * 0.5;
		bgclock.anchor.setTo(0.5, 0);
		clockText = game.add.text(50, 46, timer, styleClock,sceneGroup);	
		clockText.x = game.width * 0.5;
		clockText.anchor.setTo(0.5, 0);
		bgclock.alpha = 0;
		clockText.alpha = 0;
		
		bgm = game.add.audio('bgm8bits')
		game.sound.setDecodedCallback(bgm, function(){
			bgm.loopFull(0.6)
		}, this);

		game.onPause.add(function(){
			game.sound.mute = true
			gamePaused = true
		} , this);

		game.onResume.add(function(){
			game.sound.mute = false
			gamePaused = false
		}, this);
		
		buttons.getButton(bgm,sceneGroup)
		createOverlay();
		
		function createLevel(){
			
			choiceFraction();
			fraccionesText.setText(fractionsInfo[good].name);
			TweenMax.to(fraccionesText,1,{alpha:1});
			TweenMax.to(groupMarco1.scale,0.5,{x:1 , y:1});
			TweenMax.to(groupMarco1,0.5,{alpha:1});
			TweenMax.to(groupMarco2.scale,0.5,{x:1, y:1});
			TweenMax.to(groupMarco2,0.5,{alpha:1});
			bgFracciones = groupMarco1.create(marcoFracciones.x ,marcoFracciones.y,fractionsInfo[result1].base);
			bgFracciones.anchor.setTo(0.5,0.5);
			bgFracciones2 = groupMarco2.create(marcoFracciones.x ,marcoFracciones.y,fractionsInfo[result2].base);
			bgFracciones2.anchor.setTo(0.5,0.5);
			fraction1 = groupMarco1.create(bgFracciones.x,bgFracciones.y,'atlas.flyingFractions',fractionsInfo[result1].fraction);
			fraction1.anchor.setTo(0.5,0.5);
			fraction1.alpha = 0.7;
			fraction1.id = result1;
			fraction1.inputEnabled = true
			fraction1.events.onInputDown.add(buttonSelect,this);
			
			fraction2 = groupMarco2.create(bgFracciones.x,bgFracciones.y,'atlas.flyingFractions',fractionsInfo[result2].fraction);
			fraction2.anchor.setTo(0.5,0.5);
			fraction2.alpha = 0.7;
			fraction2.id = result2;
			fraction2.inputEnabled = true
			fraction2.events.onInputDown.add(buttonSelect,this);	
			TweenMax.fromTo(malo,0.5,{y:-100},{y:100});
			malo.scale.setTo(1);
			malo.alpha= 1;
		}
		
		function buttonSelect (object){
			
			TweenMax.to(groupMarco1.scale,3,{x:1.2 , y:1.2});
			TweenMax.to(groupMarco1,0.5,{alpha:0});
			TweenMax.to(groupMarco2.scale,3,{x:1.2 , y:1.2});
			TweenMax.to(groupMarco2,0.5,{alpha:0});
			fraccionesText.alpha = 0;
			fraction1.destroy();
			fraction2.destroy();
			bgFracciones.destroy();
			bgFracciones2.destroy();
			sound.play("laserexplode");
			if(good == object.id){
				timer = 11;
				goodShoot.alpha = 1;	
				TweenMax.fromTo(goodShoot.scale,1,{x:2},{x:1});
				TweenMax.fromTo(goodShoot,1,{y:ship.y - ship.height},{y: malo.y});
				TweenMax.fromTo(goodShoot,0,{alpha:1},{alpha:0,delay:0.8,onComplete:goodFun});
				baseFracciones.alpha = 0;
				function goodFun(){
					clearInterval(timerCount)
					sound.play("explode");
					sound.play("magic");
					coins++;
					xpText.setText(coins);
					if(coins == 3){
						bgclock.alpha = 1;
						clockText.alpha = 1;
						console.log("Empieza timer");
						TweenMax.to(bgclock.scale,0.5,{x:1,ease:Back.easeOut});
						TweenMax.to(clockText.scale,0.5,{x:1,ease:Back.easeOut});			
					}
					
					if(coins>=3){
						var waitTime = 0
						if(coins>3){
							waitTime = 750
						}
						game.time.events.add(waitTime,function(){
							timerCount = setInterval(timerFunction, 1000);
						})
						
					}
					TweenMax.fromTo(malo,0.5,{alpha:1},{alpha:0});
					TweenMax.to(malo.scale,0.7,{x:2,y:2});
					explosion = game.add.sprite(malo.x, malo.y, 'explosion');
					var objectexplosion = explosion.animations.add('objectexplosion');
					explosion.animations.play('objectexplosion', 5, false);
					explosion.anchor.setTo(0.5,0);	
					TweenMax.to(baseFracciones,0.3,{alpha:1,delay:1,onComplete:createLevel});
				}
			}else{
				clearInterval(timerCount);
				lives--
				heartsText.setText("x " + lives);
				maloShoot.alpha = 1;
				baseFracciones.alpha = 0;
				TweenMax.fromTo(maloShoot.scale,1,{x:2},{x:1});
				TweenMax.fromTo(maloShoot,1,{y:malo.y + malo.height},{y: ship.y-ship.height/2});
				TweenMax.fromTo(maloShoot,0,{alpha:1},{alpha:0,delay:0.8,onComplete:badFun});
				function badFun(){
					sound.play("explode");
					sound.play("gameLose");
					bgm.stop();
					explosion = game.add.sprite(ship.x, ship.y, 'explosion');
					var objectexplosion = explosion.animations.add('objectexplosion');
					explosion.animations.play('objectexplosion', 5, false);
					explosion.anchor.setTo(0.5,1);
				}
			}
			
		
			
		}
		

	function timerFunction(){
		if(gamePaused){
			return
		}

		if(timer != 0){
			timer-- 
			clockText.setText(timer);
			if(timer == 0){
					lives--
				
				TweenMax.to(groupMarco1.scale,3,{x:1.2 , y:1.2});
				TweenMax.to(groupMarco1,0.5,{alpha:0});
				TweenMax.to(groupMarco2.scale,3,{x:1.2 , y:1.2});
				TweenMax.to(groupMarco2,0.5,{alpha:0});
				fraccionesText.alpha = 0;
				fraction1.destroy();
				fraction2.destroy();
				bgFracciones.destroy();
				bgFracciones2.destroy();
				sound.play("shootBall");
				
				
					heartsText.setText("x " + lives);
					maloShoot.alpha = 1;
					TweenMax.fromTo(maloShoot.scale,1,{x:2},{x:1});
					TweenMax.fromTo(maloShoot,1,{y:malo.y + malo.height},{y: ship.y-ship.height/2});
					TweenMax.fromTo(maloShoot,0,{alpha:1},{alpha:0,delay:0.8,onComplete:badFun});
					function badFun(){
						sound.play("explode");
						sound.play("gameLose");
						bgm.stop();
						explosion = game.add.sprite(ship.x, ship.y, 'explosion');
						var objectexplosion = explosion.animations.add('objectexplosion');
						explosion.animations.play('objectexplosion', 5, false);
						explosion.anchor.setTo(0.5,1);
					}
				clearInterval(timerCount);
				
			}
		}
		
	}		
		
		
	}
	
	
	function gameOver(){
		var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,gameIndex)
			sceneloader.show("result");
	}	
	
	
	function update() {

		if(maloShoot.y >= ship.y-ship.height/2){
				if(!finish){
				ship.setAnimationByName(0, "LOSE", false);
				ship.setSkinByName("normal");
				finish = true;
				TweenMax.to(ship,0.5,{alpha:0,delay:1,onComplete:gameOver});	
					
			}
			
		}
		
		
		if(starGame){	
			if(lives != 0){
				background.tilePosition.y += speedGame;
			}
		}
	}
	
	return {
		assets: assets,
		name: "flyingFractions",
		preload: preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()