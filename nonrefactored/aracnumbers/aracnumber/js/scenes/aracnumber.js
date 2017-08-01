var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/aracnumber/";

var aracnumber = function(){

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
	
	var speedGame = 5;
	var background;
	var heartsGroup = null;
	var heartsIcon;
	var heartsText;	
	var xpIcon;
	var xpText;
	var lives = 1;
	var cursors;
	var coins = 0;
	var bgm = null;
	var activeGame = true;
    var gameIndex = 60;

	
	styleWhite = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	styleBlack = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };
	styleSpider = {font: "70px VAGRounded", fontWeight: "bold", fill: "#FFF", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };

    function preload() {
		game.load.audio('sillyAdventureGameLoop',  soundsPath + 'songs/sillyAdventureGameLoop.mp3');
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
        game.load.image("arbusto_fondo",imagePath + "arbusto_fondo.png");
        game.load.image("arbustos",imagePath + "arbustos.png");
        game.load.image("cuerda",imagePath + "cuerda.png");
        game.load.image("rama",imagePath + "rama.png");
        game.load.image("ramas",imagePath + "ramas.png");
        game.load.image("web",imagePath + "web.png");

		/*SPINE*/
		game.load.spine("spider", imagePath + "spine/spider/spider.json");
        game.load.spine("fly", imagePath + "spine/fly/fly.json");

		
		
		
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

	/*CREATE SCENE*/
    function createScene(){
		sceneGroup = game.add.group(); 
        yogomeGames.mixpanelCall("enterGame",gameIndex);
		loadSounds();
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		var background = game.add.tileSprite(0,0,game.width,game.height,"background");
		sceneGroup.add(background);
         
        var groupBackground = game.add.group();
        
        var rama1 = groupBackground.create(0,0,"rama");
        rama1.anchor.setTo(0.3,0.5);
        rama1.y = game.world.centerY;
        
        var rama2 = groupBackground.create(0,0,"ramas");
        rama2.anchor.setTo(0.3,1);
        rama2.x = game.width - rama2.width/2;
        rama2.y = game.world.centerY;
        
        var arbusto_fondo = groupBackground.create(0,0,"arbusto_fondo");
        arbusto_fondo.anchor.setTo(0.5,0.5);
        arbusto_fondo.x = game.world.centerX;
        arbusto_fondo.y = game.height - arbusto_fondo.height/2;
        arbusto_fondo.width = game.width;
        
        sceneGroup.add(groupBackground);
        
        var arbustos = sceneGroup.create(0,0,"arbustos");
        arbustos.anchor.setTo(0.5,0.3);
        arbustos.x = game.world.centerX;
        
        var webSpider = sceneGroup.create(0,0,"web");
        webSpider.anchor.setTo(0.5,0.5);
        webSpider.x = game.world.centerX;
        webSpider.y = game.world.centerY;
        
        var spiderGroup = game.add.group();
        var cuerda = spiderGroup.create(0,0,"cuerda");
        cuerda.anchor.setTo(0.5,0);
        cuerda.x = game.world.centerX;
        var spider = game.add.spine(0,0,"spider");
        spider.setAnimationByName(0, "IDLE", true);
		spider.setSkinByName("normal");
        spider.x = game.world.centerX;
        spider.y = game.world.centerY + spider.height/1.5;
        spiderGroup.add(spider);
        var textSpider = game.add.text(0, 0,"10", styleSpider,spiderGroup);
        textSpider.anchor.setTo(0.5,0.5);
        textSpider.x = spider.x;
        textSpider.y = spider.y - spider.height/3;
        TweenMax.fromTo(textSpider,0.3,{y:spider.y - spider.height/3},{y:spider.y - spider.height/3.1,yoyo:true,repeat:-1});
        spiderGroup.x = game.world.centerX - game.width/2;
        spiderGroup.posx = spiderGroup.x;
        sceneGroup.add(spiderGroup);
        TweenMax.fromTo(spiderGroup,2,{x:spiderGroup.posx - 20},{x:spiderGroup.posx + 10,yoyo:true,repeat:-1});
        
        
        var flyGroup1 = game.add.group();
        
        var fly1 = game.add.spine(0,0,"fly");
        fly1.setAnimationByName(0, "IDLE", true);
		fly1.setSkinByName("normal");
        fly1.x = game.width/3 - fly1.width/2;
        fly1.y = game.world.centerY;
        flyGroup1.add(fly1);        
        var textFly1 = game.add.text(0, 0,"10", styleBlack,flyGroup1);
        textFly1.anchor.setTo(0.5,0.5);
        textFly1.x = fly1.x;
        textFly1.y = fly1.y + 3;
        TweenMax.fromTo(textFly1,0.5,{y:fly1.y+3},{y:fly1.y+8,yoyo:true,repeat:-1});
       
        sceneGroup.add(flyGroup1);
        
        var flyGroup2 = game.add.group();
        
        var fly2 = game.add.spine(0,0,"fly");
        fly2.setAnimationByName(0, "IDLE", true);
		fly2.setSkinByName("normal");
        fly2.x = game.width - game.width/3 + fly2.width/2;
        fly2.y = game.world.centerY;
        flyGroup2.add(fly2);
        
        var textFly2 = game.add.text(0, 0,"1000", styleBlack,flyGroup2);
        textFly2.anchor.setTo(0.5,0.5);
        textFly2.x = fly2.x;
        textFly2.y = fly2.y;
        TweenMax.fromTo(textFly2,0.5,{y:fly2.y+3},{y:fly2.y+8,yoyo:true,repeat:-1});
        sceneGroup.add(flyGroup2);
        
        
       /* var buttonLeft = new Phaser.Graphics(game);
        buttonLeft.beginFill(0x000000)
        buttonLeft.drawRect(0,0,game.world.width/2, game.height)
        buttonLeft.alpha = 0.7
        buttonLeft.endFill()
        buttonLeft.inputEnabled = true
        buttonLeft.events.onInputDown.add(function(){
        });*/
        
        
		createCoins(coins);
		createHearts(lives);
		//createOverlay();
		
	}


	
	function update() {
		
	}
		

	
	
	return {
		assets: assets,
		name: "aracnumber",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()