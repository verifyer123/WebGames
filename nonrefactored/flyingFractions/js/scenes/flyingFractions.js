var soundsPath = "../../shared/minigames/sounds/"
var imagePath = "images/flyingFractions/"
var flyingFractions = function(){

	assets = {
        atlases: [                
			{
                name: "atlas.flyingFractions",
                json: imagePath + "atlas.json",
                image: imagePath + "atlas.png",
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
    var starGame = false;
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
	var fraccionesText;
	var malo;
	var malo_shoot;
	var marcoFracciones;
	var maloShoot;
	
	var result1;
	var result2;		
	var good;

	
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
			name:"3/2",
			base:"f3",
			fraction: "3_2"	
		},
		{
			name:"1/3",
			base:"f3",
			fraction: "3_3"	
		},
		{
			name:"3/1",
			base:"f4",
			fraction: "4_2"	
		},
		{
			name:"4/2",
			base:"f4",
			fraction: "4_3"	
		},
		{
			name:"1/4",
			base:"f4",
			fraction: "4_4"	
		},
		{
			name:"5/2",
			base:"f5",
			fraction: "5_2"	
		},
		{
			name:"5/3",
			base:"f5",
			fraction: "5_3"	
		},
		{
			name:"5/4",
			base:"f5",
			fraction: "5_4"	
		},
		{
			name:"5/5",
			base:"f5",
			fraction: "5_5"	
		},
		{
			name:"6/2",
			base:"f6",
			fraction: "6_2"	
		},
		{
			name:"6/3",
			base:"f6",
			fraction: "6_3"	
		},
		{
			name:"6/4",
			base:"f6",
			fraction: "6_4"	
		},
		{
			name:"6/5",
			base:"f6",
			fraction: "6_5"	
		},
		{
			name:"6/6",
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
		/*Default*/
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
		
		
		

		
		
		
	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}
	function initialize(){
		lives = 3;
		coins = 0;
		heartsText.setText("x " + lives);
		xpText.setText(coins);
		speedGame = 2;
		starGame = false;

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
		lives = 3;
		coins = 0;
		heartsText.setText("x " + lives);
		xpText.setText(coins);
		speedGame = 3.5;
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
		
		bgm = game.add.audio('wormwood')
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
		background = game.add.tileSprite(0,0,1280, game.world.height, "background");
		background.x = -background.width/4;
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
		xpText = game.add.text(50, 10, coins, style);	
		xpText.anchor.setTo(0, 0);	
		xpText.x = 75;
		xpText.y = 28;	
		

		
		console.log("good: " + good);
		
		malo = game.add.sprite(game.world.centerX, 50 , "malo");
		malo.anchor.setTo(0.5,0);
		TweenMax.fromTo(malo,0.5,{y:malo.y},{y:malo.y+10,yoyo:true,repeat:-1});
		
		maloShoot = game.add.sprite(malo.x, malo.y + malo.height , "maloShoot");
		maloShoot.anchor.setTo(0.5,0);
		maloShoot.alpha = 0;
		
		
		ship = game.add.spine(game.world.centerX,game.world.centerY + (game.world.centerY/1.3) ,"ship");
		ship.setAnimationByName(0, "IDLE", true);
		ship.setSkinByName("normal");
		
		game.world.swap(xpText, xpIcon);
		game.world.swap(heartsText, heartsIcon);
		choiceFraction();
		
		
		baseFracciones = game.add.sprite(game.world.centerX , game.world.centerY - (game.world.centerY/2),"baseFracciones");
		baseFracciones.anchor.setTo(0.5,0);
		baseFracciones.scale.setTo(0.7);
		fraccionesText = game.add.text(baseFracciones.x, baseFracciones.y + baseFracciones.height/4, fractionsInfo[good].name, style);	
		fraccionesText.anchor.setTo(0.5,0);
		
		var groupMarco1 = game.add.group();
		groupMarco1.x = game.world.centerX - game.width/4;
		marcoFracciones = groupMarco1.create(0 , game.world.centerY,"marcoFracciones");
		marcoFracciones.anchor.setTo(0.5,0.5);
		bgFracciones = groupMarco1.create(marcoFracciones.x ,marcoFracciones.y,fractionsInfo[result1].base);
		bgFracciones.anchor.setTo(0.5,0.5);
		groupMarco1.swap(marcoFracciones,bgFracciones);

		
		var fraction1 = groupMarco1.create(bgFracciones.x,bgFracciones.y,'atlas.flyingFractions',fractionsInfo[result1].fraction);
		fraction1.anchor.setTo(0.5,0.5);
		fraction1.alpha = 0.7;
		fraction1.id = result1;
		fraction1.inputEnabled = true
		fraction1.events.onInputDown.add(buttonSelect,this);
		
		
		var groupMarco2 = game.add.group();
		groupMarco2.x = game.world.centerX + game.width/4;
		marcoFracciones = groupMarco2.create(0 , game.world.centerY,"marcoFracciones");
		marcoFracciones.anchor.setTo(0.5,0.5);
		bgFracciones = groupMarco2.create(marcoFracciones.x ,marcoFracciones.y,fractionsInfo[result2].base);
		bgFracciones.anchor.setTo(0.5,0.5);
		groupMarco2.swap(marcoFracciones,bgFracciones);		
		
		var fraction2 = groupMarco2.create(bgFracciones.x,bgFracciones.y,'atlas.flyingFractions',fractionsInfo[result2].fraction);
		fraction2.anchor.setTo(0.5,0.5);
		fraction2.alpha = 0.7;
		//createOverlay();
		
		function buttonSelect (object){
			if(good == object.id){
				console.log("ok");
			}
			
			maloShoot.alpha = 1;
			TweenMax.fromTo(maloShoot.scale,1,{x:2},{x:1});
			TweenMax.fromTo(maloShoot,2,{y:malo.y + malo.height},{y: game.height});
			
		}
		
		
	}
	
	function update() {

		
		
		
		if(starGame){	
			if(lives != 0){


				background.tilePosition.y += speedGame;

			}
		}
	}
	
	return {
		assets: assets,
		name: "flyingFractions",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()