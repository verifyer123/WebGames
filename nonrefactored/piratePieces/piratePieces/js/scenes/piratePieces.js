var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/piratePieces/";

var piratePieces = function(){

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
    var gameIndex = 0;
    var sea;
    var seaShip1;
    var seaShip2;
    
    
    function getSlotContainer (spineSkeleton, slotName) {
            var slotIndex
            for(var index = 0, n = spineSkeleton.skeletonData.slots.length; index < n; index++){
                var slotData = spineSkeleton.skeletonData.slots[index]
                if(slotData.name === slotName){
                    slotIndex = index;
                    
                    
                }
            }
            if (slotIndex){     
                return spineSkeleton.slotContainers[slotIndex]
            }
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
		game.load.image("sea",imagePath + "sea.png");
        game.load.image("island",imagePath + "island.png");
        game.load.image("seaShip",imagePath + "sea_ship.png");
        game.load.image("chest",imagePath + "cofre.png");
		/*SPINE*/
		game.load.spine("ship", imagePath + "spine/ships.json");

		
		
		
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

		sea = game.add.tileSprite(0,0,game.width,game.height,"sea");
		sceneGroup.add(sea);
        
        var island = sceneGroup.create(0,0,"island");
        island.width = game.width;
        island.y = game.height - island.height;
        
        var shipGroup1 = game.add.group();
        var ship1 = game.add.spine(0,0,"ship");
        ship1.setAnimationByName(0, "IDLE", true);
		ship1.setSkinByName("barco_M2"); 
        ship1.x = game.world.centerX;
        ship1.y = game.world.centerY + ship1.height/1.5;
        shipGroup1.add(ship1);
        seaShip1 = game.add.tileSprite(0,ship1.y-30,game.width*2,35,"seaShip");
        shipGroup1.add(seaShip1);
        var mask = game.add.graphics(0,0)
        mask.beginFill(0xFFFFFF)
        mask.drawRoundedRect(0, 0, game.width, ship1.height-20,0)
        mask.endFill();
        mask.x = 0;
        mask.y = ship1.y-ship1.height;
        shipGroup1.mask = mask;
        sceneGroup.add(shipGroup1);
        var shipGroup2 = game.add.group();
        var ship2 = game.add.spine(0,0,"ship");
        ship2.setAnimationByName(0, "IDLE", true);
		ship2.setSkinByName("barco_M3"); 
        ship2.x = game.world.centerX;
        ship2.y = game.world.centerY - 100;
        shipGroup2.add(ship2);
        seaShip2 = game.add.tileSprite(0,ship2.y-30,game.width*2,35,"seaShip");
        shipGroup2.add(seaShip2);
        var mask2 = game.add.graphics(0,0)
        mask2.beginFill(0xFFFFFF)
        mask2.drawRoundedRect(0, 0, game.width, ship2.height-20,0)
        mask2.endFill();
        mask2.x = 0;
        mask2.y = ship2.y-ship2.height;
        shipGroup2.mask = mask2;
        sceneGroup.add(shipGroup2);
        
        
        
        var ship1Hits = [{object:"",slot:"empty",group:""},{object:"",slot:"empty2",group:""},{object:"",slot:"empty3",group:""}];
        var ship2Hits = [{object:"",slot:"empty",group:""},{object:"",slot:"empty2",group:""},{object:"",slot:"empty3",group:""}];
        
        for(p=0;p<=2;p++){
            ship1Hits[p].group = getSlotContainer(ship1, ship1Hits[p].slot);
            ship1Hits[p].object = new Phaser.Graphics(game);
            ship1Hits[p].object.beginFill(0x000000);
            ship1Hits[p].object.drawRect(0,ship1Hits[p].group.y+10,ship1Hits[p].group.width + 10,ship1Hits[p].group.height + 20);
            ship1Hits[p].object.x =( ship1Hits[p].group.width - ship1Hits[p].object.width + 15 ) * p -50;
            ship1Hits[p].object.alpha = 0.7;
            ship1Hits[p].object.endFill();
            ship1Hits[p].object.inputEnabled = true;
            this.game.physics.arcade.enable(ship1Hits[p].object);
            ship1Hits[p].group.add(ship1Hits[p].object); 
        }       
        for(p=0;p<=2;p++){
            ship2Hits[p].group = getSlotContainer(ship2, ship1Hits[p].slot);
            ship2Hits[p].object = new Phaser.Graphics(game);
            ship2Hits[p].object.beginFill(0x000000);
            ship2Hits[p].object.drawRect(0,ship2Hits[p].group.y+10,ship2Hits[p].group.width + 10,ship2Hits[p].group.height + 20);
            ship2Hits[p].object.x =( ship2Hits[p].group.width - ship2Hits[p].object.width + 15 ) * p -50;
            ship2Hits[p].object.alpha = 0.7;
            ship2Hits[p].object.endFill();
            ship2Hits[p].object.inputEnabled = true;
            this.game.physics.arcade.enable(ship2Hits[p].object);
            ship2Hits[p].group.add(ship2Hits[p].object); 
        }
        

        
        
        
        
        
        
        var arrayChest = new Array;

        for(i=0;i<=10;i++){
            arrayChest[i] = sceneGroup.create(0,0,"chest");
            arrayChest[i].x = i * arrayChest[i].width/2;
            if(i%2 == 0){
                arrayChest[i].y = island.y + arrayChest[i].height;
            }else{
                arrayChest[i].y = island.y + arrayChest[i].height*2;
            }
            arrayChest[i].originalPositionX = arrayChest[i].x;
            arrayChest[i].originalPositionY = arrayChest[i].y;        
            arrayChest[i].inputEnabled = true;
            arrayChest[i].input.enableDrag();
            arrayChest[i].originalPosition = arrayChest[i].position.clone();
					//arrayChest[i].events.onDragUpdate.add(onDragUpdate, this);
            arrayChest[i].events.onDragStop.add(function(currentSprite){
					  stopDrag(currentSprite)});
        this.game.physics.arcade.enable(arrayChest[i]);
        }
        
           
        function onDragUpdate(object){
        }
            
        var slotHitsArray = [ship1Hits[0].object,ship1Hits[1].object,ship2Hits[0].object,ship2Hits[1].object,ship2Hits[2].object]
        

        function stopDrag(currentSprite){  
             for(i=0;i<=1;i++){
            if (this.game.physics.arcade.overlap(currentSprite, ship1Hits[i].object, function() {
            currentSprite.input.draggable = false;
                
          })) {
                break;
              }
             }
            
        //TweenMax.to(currentSprite,0.4,{x:currentSprite.originalPositionX,y:currentSprite.originalPositionY});

            
          }
        
                                                        
		createCoins(coins);
		createHearts(lives);
		//createOverlay();
		
	}


	
	function update() {
		sea.tilePosition.x += 2;
        seaShip1.tilePosition.x += 2;
        seaShip2.tilePosition.x += 2;
	}
		

	
	
	return {
		assets: assets,
		name: "piratePieces",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()