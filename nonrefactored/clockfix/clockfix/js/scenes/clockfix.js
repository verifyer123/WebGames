var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/clockfix/";

var clockfix = function(){

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
			{	name: "windingClock",
				file: "sounds/windingclock.mp3"}
		],
	}
    
	
	sceneGroup = null;
	
	var speedGame = 5;
	var background;
	var heartsGroup = null;
	var heartsIcon;
	var heartsText;	
	var xpIcon;
	var lives = 1;
	var cursors;
	var coins = 0;
	var bgm = null;
	var activeGame = true;
    var manecilla1;
    var manecilla2;
    var dragging = false;
    var morning_swatch;
	
	styleWhite = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	styleBlack = {font: "80px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };
	styleClock = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };

    function preload() {
        game.input.maxPointers = 1;
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
		game.load.image("morning",imagePath + "morning.png");
        game.load.image("noche",imagePath + "noche.png");
        game.load.image("morning_swatch",imagePath + "morning_swatch.png");
        game.load.image("noche_swatch",imagePath + "noche_swatch.png");
        game.load.image("body_clock",imagePath + "body_clock.png");
        game.load.image("clock",imagePath + "clock.png");
        game.load.image("manecilla1",imagePath + "manecilla1.png");
        game.load.image("manecilla2",imagePath + "manecilla2.png");
        game.load.image("boton_manecillas",imagePath + "boton_manecillas.png");
        game.load.image("body_digi",imagePath + "body_digi.png");
        game.load.image("boca_digi",imagePath + "boca_digi.png");
        game.load.image("ojos_digi",imagePath + "ojos_digi.png");
		/*SPINE*/
		//game.load.spine("helicoptero", imagePath + "spine/helicoptero.json");

		
		
		
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
		loadSounds();
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		
        /*
        var morning = sceneGroup.create(0,0,"morning");
        morning.width = game.width;

        morning_swatch = game.add.tileSprite(0,0,game.width,game.height,"morning_swatch");
		sceneGroup.add(morning_swatch);
        */
        
        var noche = sceneGroup.create(0,0,"noche");
        noche.width = game.width;

        morning_swatch = game.add.tileSprite(0,0,game.width,game.height,"noche_swatch");
		sceneGroup.add(morning_swatch);

        var body_clock = sceneGroup.create(0,0,"body_clock");
        body_clock.anchor.setTo(0.5,0.5);
        body_clock.x = game.world.centerX;
        body_clock.y = game.world.centerY + body_clock.height/3;
        
        var clock = sceneGroup.create(0,0,"clock");
        clock.anchor.setTo(0.5,0.5);
        clock.x = game.world.centerX;
        clock.y = game.world.centerY + clock.height/1.4;
        
        var clockDigi = sceneGroup.create(0,0,"body_digi");
        clockDigi.anchor.setTo(0.5,0.5);
        clockDigi.x = game.world.centerX;
        clockDigi.y = game.world.centerY - clockDigi.height*1.4;
        
        var bocaDigi = sceneGroup.create(0,0,"boca_digi");
        bocaDigi.anchor.setTo(0.5,0.5);
        bocaDigi.x = game.world.centerX;
        bocaDigi.y = clockDigi.y;
        
        var ojosDigi = sceneGroup.create(0,0,"ojos_digi");
        ojosDigi.anchor.setTo(0.5,0.5);
        ojosDigi.x = game.world.centerX;
        ojosDigi.y = clockDigi.y - clockDigi.height/2;

        
        var blockCollisionGroup = game.physics.p2.createCollisionGroup();
    
        manecilla1 = sceneGroup.create(0,0,"manecilla1");
        manecilla1.anchor.setTo(0.5,1);
        manecilla1.x = game.world.centerX;
        manecilla1.y = clock.y - manecilla1.height/10;
     
        
		manecilla1.inputEnabled = true;
    	manecilla1.input.enableDrag(false);
		manecilla1.events.onDragStart.add(dragStart,this);
		manecilla1.events.onDragUpdate.add(dragUpdate,this);
        manecilla1.input.setDragLock(false, false);	
        
        manecilla2 = sceneGroup.create(0,0,"manecilla2");
        manecilla2.anchor.setTo(0.5,1);
        manecilla2.x = game.world.centerX;
        manecilla2.y = clock.y - manecilla2.height/6;
        
		manecilla2.inputEnabled = true;
    	manecilla2.input.enableDrag(false);
		manecilla2.events.onDragStart.add(dragStart,this);
		manecilla2.events.onDragUpdate.add(dragUpdate,this);
        manecilla2.input.setDragLock(false, false);	        
        
    
        
        var boton_manecillas = sceneGroup.create(0,0,"boton_manecillas");
        boton_manecillas.anchor.setTo(0.5,0.5);
        boton_manecillas.x = game.world.centerX;
        boton_manecillas.y = clock.y - boton_manecillas.height/2;        
        
        
        function hitBar(){
            
        }
        
        
        function dragStart(){
            
        }        
        
        function dragUpdate(object){
            //sound.play("windingClock");
            var targetAngle = (360 / (2 * Math.PI)) * game.math.angleBetween(
                  object.x, object.y,
                  this.game.input.activePointer.x, this.game.input.activePointer.y) + 90;

                if(targetAngle < 0)
                    targetAngle += 360;

                if(game.input.activePointer.isDown && !dragging)
                {
                    
                    dragging = true;
                    
                    
                }
                if(!game.input.activePointer.isDown && dragging)
                {
                    
                    dragging = false;
                    
                }

                if(dragging)
                {
                    
                    object.angle = targetAngle;
                    //console.log(Math.round(targetAngle));
                    
                }
        }
        
		createCoins(coins);
		createHearts(lives);
		//createOverlay();
		
	}

	
	function update() {
		morning_swatch.tilePosition.x += 1;
        

            
        
        
	}
		

	
	
	return {
		assets: assets,
		name: "clockfix",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()