var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/toyfigure/";

var toyfigure = function(){

	assets = {
        atlases: [                
			{
                name: "atlas.toy",
                json: "images/toyfigure/atlas.json",
                image: "images/toyfigure/atlas.png",
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
    var repizasArray = new Array;

    
    function getRandomArbitrary(min, max) {
  		return Math.floor(Math.random() * (max - min) + min);
	}
	
	styleWhite = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	styleBlack = {font: "80px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };
	styleClock = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };

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
        game.load.image("floor",imagePath + "floor.png");
        game.load.image("clock",imagePath + "clock.png");
        game.load.image("star",imagePath + "star.png");

		/*SPINE*/
		game.load.spine("dinamita", imagePath + "spine/dinamita.json");

		
		
		
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

		var background = sceneGroup.create(0,0,"background");
        background.width = game.width;
        background.height = game.height;
        
		var floor = sceneGroup.create(0,game.height/1.5,"floor");
        floor.anchor.setTo(0,0);
        floor.width = game.width;
        floor.height = game.height/3;
        
        var bed = sceneGroup.create(0,0,"atlas.toy","cama.png");
        bed.x = game.width - bed.width;
        bed.y = floor.y - bed.height/1.9;
        
        var dinamita = game.add.spine(0,0,"dinamita");
        dinamita.setAnimationByName(0, "LOSE", true);
		dinamita.setSkinByName("normal");
        dinamita.scale.setTo(-1,1);
        dinamita.x =   bed.x - dinamita.width;
        dinamita.y = bed.y + dinamita.height/1.2;        
        sceneGroup.add(dinamita);
        
        var clock = sceneGroup.create(0,0,"clock");
        clock.anchor.setTo(0.5,0.5);
        clock.x = game.world.centerX;
        clock.y = game.height - clock.height/1.5;
        
        var santo = sceneGroup.create(0,0,"atlas.toy","elsanto.png");
        santo.x = game.width - santo.width* 1.2;
        santo.y = bed.y - santo.height*1.1;
        
        var newPositionRepiza = new Array;
        
        for(var i = 0; i<=8;i++){
            repizasArray[i] = sceneGroup.create(-150,-150,"atlas.toy","repizas" + i + ".png");
            repizasArray[i].anchor.setTo(0.5,0.5);
            this.game.physics.arcade.enable(repizasArray[i]);
            repizasArray[i].id = i;
            newPositionRepiza[i] = repizasArray[i];

        }
        
        var position0x = 0 + repizasArray[0].width/1.5;
        var position0y = game.world.centerY - repizasArray[0].height*2.2;
        
        var position1x = 0 + repizasArray[0].width*1.9;
        var position1y = game.world.centerY - repizasArray[0].height*2.2; 
        
        var position2x = game.world.centerX + repizasArray[0].width*1.2;
        var position2y = game.world.centerY - repizasArray[0].height*2.2;
        
        var position3x = 0 + repizasArray[0].width/1.5;
        var position3y = game.world.centerY - repizasArray[0].height;  
        
        var position4x = 0 + repizasArray[0].width*1.9;
        var position4y = game.world.centerY - repizasArray[0].height; 
        
        var position5x = 0 + repizasArray[0].width/1.5;
        var position5y = game.world.centerY + repizasArray[0].height/8;          
        
        var toysArray = new Array;
        var typeToys = new Array;
        
        
        
        for(var p = 0; p<= 17;p++){
            toysArray[p] = sceneGroup.create(-150,-150,"atlas.toy","toy" + p + ".png");
            toysArray[p].anchor.setTo(0.5,0.5);
            toysArray[p].x = getRandomArbitrary(0 + toysArray[p].width/2, game.world.centerX - toysArray[p].width/2);
            toysArray[p].y = getRandomArbitrary(floor.y , clock.y - toysArray[p].width/2);
			this.game.physics.arcade.enable(toysArray[p]);
			toysArray[p].inputEnabled = true;
			toysArray[p].originalPosition = toysArray[p].position.clone();
			toysArray[p].input.enableDrag();
			toysArray[p].positionX = toysArray[p].x;
			toysArray[p].positionY = toysArray[p].y;  
        }
        
       
        
        

toysArray[0].id = 0;
toysArray[1].id = 0;
toysArray[2].id = 1;
toysArray[3].id = 1;
toysArray[4].id = 2;
toysArray[5].id = 2;     
toysArray[6].id = 3;
toysArray[7].id = 3;    
toysArray[8].id = 4;
toysArray[9].id = 4;      
toysArray[10].id = 5;
toysArray[11].id = 5;          
toysArray[12].id = 6;
toysArray[13].id = 6;       
toysArray[14].id = 7;
toysArray[15].id = 7;      
toysArray[16].id = 8;
toysArray[17].id = 8;   
        
        
toysArray[0].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[0]);}, this);
toysArray[1].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[0]);}, this);  
        
toysArray[2].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[1]);}, this);
toysArray[3].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[1]);}, this); 
        
toysArray[4].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[2]);}, this);
toysArray[5].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[2]);}, this);        
toysArray[6].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[3]);}, this);
toysArray[7].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[3]);}, this);        
toysArray[8].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[4]);}, this);
toysArray[9].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[4]);}, this);        
toysArray[10].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[5]);}, this);
toysArray[11].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[5]);}, this);        
toysArray[12].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[6]);}, this);
toysArray[13].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[6]);}, this);        
toysArray[14].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[7]);}, this);
toysArray[15].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[7]);}, this);        
toysArray[16].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[8]);}, this);
toysArray[17].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[8]);}, this);        

        var star = sceneGroup.create(0,0,"star");
        star.anchor.setTo(0.5,0.5);
        star.alpha = 0;

        function stopDrag(currentSprite, endSprite){   
            console.log(currentSprite.id);
            
            if (!this.game.physics.arcade.overlap(currentSprite, endSprite, function() {
            currentSprite.input.draggable = false;
                TweenMax.to(currentSprite,0.4,{x:endSprite.x,y:endSprite.y});
                console.log("ok");
                star.x = endSprite.x;
                star.y = endSprite.y;
                TweenMax.fromTo(star.scale,0.5,{x:1,y:1},{x:2,y:2});
                TweenMax.fromTo(star,0.5,{alpha:1},{alpha:0});
                TweenMax.to(currentSprite.scale,0.5,{x:0,y:0,delay:0.5});
                
                
          })) { 
                if(currentSprite.y <= floor.y){
                    TweenMax.to(currentSprite,1,{x:currentSprite.positionX,y:currentSprite.positionY});
                }
          }
          }        
        
       
        
        function choiceToy(){
            
            shuffle(newPositionRepiza);

             for(var i = 0; i<=5;i++){
                 console.log(newPositionRepiza[i].id);
                newPositionRepiza[i].x = eval("position" +[i] + "x");
                newPositionRepiza[i].y = eval("position" +[i] + "y");  
             }
 
        }
        
        choiceToy();
        
        
		createCoins(coins);
		createHearts(lives);
		//createOverlay();
		
	}


	
	function update() {
		
	}
		

	
	
	return {
		assets: assets,
		name: "toyfigure",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()