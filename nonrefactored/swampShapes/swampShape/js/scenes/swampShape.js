var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/swampShape/";

var swampShape = function(){

	assets = {
        atlases: [                
			{
                name: "atlas.swampShape",
                json:  imagePath + "atlas.json",
                image:  imagePath + "atlas.png",
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
	
	var speedShapes = 2;
	var background;
	var heartsGroup = null;
	var heartsIcon;
	var lives = 1;
	var cursors;
	var coins = 0;
	var bgm = null;
	var activeGame = true;
    var timerCount = null;
    var timer = 10;
    var shapesBottle = new Array;
    var shapes = new Array;
    var bottle;
    var lastShape;

	
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

		/*SPINE*/
		//game.load.spine("helicoptero", imagePath + "spine/helicoptero.json");

		
		
		
	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}
    
    function getRandomArbitrary(min, max) {
  		return Math.floor(Math.random() * (max - min) + min);
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

		var background = game.add.tileSprite(0,0,game.width,game.height,'atlas.swampShape',"swamp-03");
		sceneGroup.add(background);
        
        bottle = sceneGroup.create(0,0,"atlas.swampShape","swamp-05");
        bottle.anchor.setTo(0.5,0.5);
        bottle.x = game.world.centerX;
        bottle.y = game.height - bottle.height/1.8;
        bottle.id = 0;
        
       
        for(var i = 0;i<=2;i++){
            shapesBottle[i] = sceneGroup.create(0,0,"atlas.swampShape","swamp-0" + [i + 6]);
            shapesBottle[i].anchor.setTo(0.5,0.5);
            shapesBottle[i].x = bottle.x;
            shapesBottle[i].y = bottle.y + shapesBottle[i].height/3;   
            shapesBottle[i].id = i;
            shapesBottle[i].alpha = 0;
        }
        
        
        var allShapes = [
            {
            shape:"swamp-09",
            id:0
            },
            {
            shape:"swamp-11",
            id:1
            },
            {
            shape:"swamp-10",
            id:2
            }
        ];
        
        for(var i = 0;i<=10;i++){
            var randomShape = getRandomArbitrary(0,3);
            shapes[i] = sceneGroup.create(0,0,"atlas.swampShape",allShapes[randomShape].shape); 
            shapes[i].id = allShapes[randomShape].id;
            shapes[i].x =  0 - (i * shapes[i].width*2);
            shapes[i].y = getRandomArbitrary(300, game.height/1.5); 
            shapes[i].anchor.setTo(0.5,0.5);
            ActiveDrag(shapes[i],bottle);
            shapes[i].active = false;
            shapes[i].events.onDragUpdate.add(onDragUpdate, this);
            shapes[i].events.onDragStop.add(function(currentSprite){
                      stopDrag(currentSprite,bottle);}, this);
        }
        
        lastShape = shapes[10];
        
        function onDragUpdate(object){
            object.active = true;
            object.alpha = 1;
        }

        function stopDrag(currentSprite, endSprite){   
            currentSprite.active = false;
            if (!this.game.physics.arcade.overlap(currentSprite, endSprite, function() {
            currentSprite.input.draggable = false;
                TweenMax.to(currentSprite,0.4,{x:endSprite.x,y:endSprite.y});
                speedShapes = speedShapes + 0.1;
                if(endSprite.id == currentSprite.id){
                    coins++;
                    xpText.setText(coins);
                }else{
                    lives--;
                    heartsText.setText("x " + lives);
                }
                
          })) { 
                //que regrese a su posicion original 
                console.log("id del objeto: " + currentSprite.id);
          }
          }        
        
    function changeShape(){
        TweenMax.fromTo(sceneGroup,1,{alpha:1},{alpha:1,delay:2,onComplete:nextShape});   
    }
    
    function nextShape(){
        bottle.id = getRandomArbitrary(0,3); 
        console.log("este es su id: " + bottle.id);
        TweenMax.fromTo(bottle.scale,0.2,{x:1,y:1},{x:1.2,y:1.2,yoyo:true,repeat:1});
        changeShape();
    }
    
    changeShape();
        
		createCoins(coins);
		createHearts(lives);
		//createOverlay();
		
	}

    

	
	function update() {
		for(var i = 0;i<=10;i++){
            if(!shapes[i].active){
            
            
            shapes[i].x += speedShapes;
                
            if(shapes[i].x >= game.width){
                shapes[i].x = lastShape.x - shapes[i].width*2;
                shapes[i].y = getRandomArbitrary(300, game.height/1.5); 
                lastShape = shapes[i];
                shapes[i].input.draggable = true;
                  
                }
            }
        }
        if(bottle.id == 0){
            shapesBottle[0].alpha = 1;
            shapesBottle[1].alpha = 0;
            shapesBottle[2].alpha = 0;            
        }else if(bottle.id == 1){
            shapesBottle[0].alpha = 0;
            shapesBottle[1].alpha = 1;
            shapesBottle[2].alpha = 0;                     
        }else if(bottle.id == 2){
            shapesBottle[0].alpha = 0;
            shapesBottle[1].alpha = 0;
            shapesBottle[2].alpha = 1;                     
        }
        
	}
		

	
	
	return {
		assets: assets,
		name: "swampShape",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()