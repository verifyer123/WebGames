var soundsPath = "../../shared/minigames/sounds/"
var tapcards = function(){

	assets = {
        atlases: [                
			{
				//name: "atlas.jump",
                //json: "images/spinwheel/atlas.json",
                //image: "images/spinwheel/atlas.png"
			}],
        images: [],
		sounds: [
            {	name: "pop",
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
				file: soundsPath + "shootBall.mp3"}
		],
	}
    
	var background;
	var book;
	var pencilEraser;
	var paperEraser;
	var paper;
	var heartsIcon;
	var heartsText;
	var lives = 1;
	var frutas = new Array;
	var randomFruits;
	var blueBg  = new Array;
	var blueText = new Array;
	var imagesCards = new Array;
	var styleCards;
	var NumColumnas = 2;
	var leveldifficulty = 1;
	
	var style = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};

	function fontsSize(){
			if(game.world.width < 721){
				styleCards = {font: "2rem VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
			}else{
				styleCards = {font: "3rem VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
			}
	}
	
    function preload() {
        //game.load.spine('animations', "images/spines/skeleton.json");		
		//game.load.image("fondo", "images/spinwheel/fondo-01.png");
		game.load.image("background", "images/tapcards/background.png");
		game.load.image("book", "images/tapcards/libro.png");
		game.load.image("paperPencil", "images/tapcards/paperPencil.png");
		game.load.image("pencilEraser", "images/tapcards/pencilEraser.png");
		game.load.image("paper", "images/tapcards/paper.png");
		game.load.image("heartsIcon", "images/tapcards/hearts.png");
		
		
		game.load.image("avocade", "images/tapcards/items/aguacate.png");
		game.load.image("broccoli", "images/tapcards/items/brocoli.png");
		game.load.image("cherry", "images/tapcards/items/cereza.png");
		game.load.image("coconut", "images/tapcards/items/coco.png");
		game.load.image("peach", "images/tapcards/items/durazno.png");
		game.load.image("strawberry", "images/tapcards/items/fresa.png");
		game.load.image("kiwi", "images/tapcards/items/kiwi.png");
		game.load.image("apple", "images/tapcards/items/manzana.png");
		game.load.image("orange", "images/tapcards/items/naranja.png");
		game.load.image("potato", "images/tapcards/items/papa.png");
		game.load.image("watermelon", "images/tapcards/items/sandia.png");
		game.load.image("tomato", "images/tapcards/items/tomate.png");
		game.load.image("grapes", "images/tapcards/items/uvas.png");
		game.load.image("carrot", "images/tapcards/items/zanahoria.png");
				
		game.load.audio('runningSong', soundsPath + 'songs/running_game.mp3');
   		//game.load.spritesheet('coins', 'images/spinwheel/coinS.png', 68, 70, 12);

	}
	
	frutas = [
		"avocade",	
		"broccoli",
		"cherry",
		"coconut",
		"peach",
		"strawberry",
		"kiwi",
		"apple",
		"orange",
		"potato",
		"watermelon",
		"tomato",
		"grapes",
		"carrot"
	];
	
	
		var selectFruits = [];
	
	

		function shuffle(array) {
			var i = array.length,
				j = 0,
				temp;

			while (i--) {
				j = Math.floor(Math.random() * (i+1));
				temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}

			return array;
		}
	
		
	
	function loadSounds(){
		sound.decode(assets.sounds)
	}
	
	function initialize(){
	}	
	
	function createCardsBlue(){
				for(var i = 0;i<=leveldifficulty;i++){


					blueBg[i] = game.add.graphics(0, 0);
					blueBg[i].id = i;
					blueBg[i].beginFill(0x379FED);
					blueBg[i].lineStyle(10, 0xFFFFFF, 1);
					blueBg[i].anchor.setTo(0.5, 0.5);
					if(game.world.width < 721){
						blueBg[i].drawRoundedRect(0, 0, game.world.width * 0.35, game.world.width * 0.35, 25);

						if(i < NumColumnas){
							blueBg[i].x = (game.world.width * 0.13) + game.world.width * 0.3 * i + blueBg[i].width/4 * i; 	
							blueBg[i].y = game.world.height * 0.3; 
						}else{
							blueBg[i].x = blueBg[i-NumColumnas].x 	
							blueBg[i].y = blueBg[i-NumColumnas].y  + blueBg[i].height + 10; 	
						}

					}else{
						blueBg[i].drawRoundedRect(0, 0, game.world.width * 0.2, game.world.width * 0.2, 25);
						blueBg[i].x = (game.world.width * 0.07) + game.world.width * 0.22 * i ;
						blueBg[i].y = game.world.height * 0.3; 
					}

					blueBg[i].originalPositionX = blueBg[i].x;
					blueBg[i].originalPositionY = blueBg[i].y;	

					blueText[i] =  game.add.text(0, 0, randomFruits[i], styleCards);
					blueText[i].anchor.setTo(0.5, 0.5);
					blueText[i].x = blueBg[i].x + blueBg[i].width/2.1;
					blueText[i].y = blueBg[i].y + blueBg[i].height/1.3;
					blueText[i].originalPositionX = blueText[i].x;
					blueText[i].originalPositionY = blueText[i].y;

					imagesCards[i] = game.add.sprite(0,0,randomFruits[i]);
					imagesCards[i].anchor.setTo(0, 0);
					imagesCards[i].width = blueBg[i].width/2;
					imagesCards[i].height = blueBg[i].height/2;
					imagesCards[i].x = blueBg[i].x + imagesCards[i].width/2.2;
					imagesCards[i].y = blueBg[i].y + imagesCards[i].height * 0.2;	
					imagesCards[i].originalPositionX = imagesCards[i].x;
					imagesCards[i].originalPositionY = imagesCards[i].y;

				}    
			}	

	function positionCardsBlue(){
		for(var i = 0;i<=leveldifficulty;i++){
			if(leveldifficulty == 1){
					if(game.world.width < 721){
						blueBg[i].drawRoundedRect(0, 0, game.world.width * 0.35, game.world.width * 0.35, 25);

						if(i < NumColumnas){
							blueBg[i].x = (game.world.width * 0.13) + game.world.width * 0.3 * i + blueBg[i].width/4 * i; 	
							blueBg[i].y = game.world.height * 0.3; 
						}else{
							blueBg[i].x = blueBg[i-NumColumnas].x 	
							blueBg[i].y = blueBg[i-NumColumnas].y  + blueBg[i].height + 10; 	
						}

					}else{
						blueBg[i].drawRoundedRect(0, 0, game.world.width * 0.2, game.world.width * 0.2, 25);
						blueBg[i].x = (game.world.width * 0.07) + game.world.width * 0.22 * i ;
						blueBg[i].y = game.world.height * 0.3; 
					}
				
					blueBg[i].originalPositionX = blueBg[i].x;
					blueBg[i].originalPositionY = blueBg[i].y;
				
					
			}
			
					blueText[i].x = blueBg[i].x + blueBg[i].width/2.1;
					blueText[i].y = blueBg[i].y + blueBg[i].height/1.3;
					blueText[i].originalPositionX = blueText[i].x;
					blueText[i].originalPositionY = blueText[i].y;
					imagesCards[i].x = blueBg[i].x + imagesCards[i].width/2.2;
					imagesCards[i].y = blueBg[i].y + imagesCards[i].height * 0.2;	
					imagesCards[i].originalPositionX = imagesCards[i].x;
					imagesCards[i].originalPositionY = imagesCards[i].y;
			
		}
	
	}
	

    function createScene(){
		
		randomFruits = shuffle(frutas);
		console.log("Array: " + randomFruits);
		console.log("ok " + randomFruits[0]);
		
		
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		fontsSize();
		
		loadSounds();		
		
		background = game.add.tileSprite(0,0,game.world.width, game.world.height, "background");
		book = game.add.sprite(0,0,"book");
		book.anchor.setTo(0.5, 0.5);	
		book.x = game.world.width * 0.98;
		book.y = game.world.height * 0.9;
		
		paperPencil = game.add.sprite(0,0,"paperPencil");
		paperPencil.anchor.setTo(0.5, 0.5);	
		paperPencil.x = 0;
		paperPencil.y = game.world.height * 0.9;	
		
		pencilEraser = game.add.sprite(0,0,"pencilEraser");
		pencilEraser.anchor.setTo(0.5, 0.5);	
		pencilEraser.x = 0;
		pencilEraser.y = game.world.height * 0.05;
		
		paper = game.add.sprite(0,0,"paper");
		paper.anchor.setTo(0.5, 0.5);	
		paper.x = game.world.width * 0.98;
		paper.y = 0;
		
		heartsIcon = game.add.sprite(0,0,"heartsIcon");
		heartsIcon.anchor.setTo(0, 0);	
		heartsIcon.x = game.world.width - heartsIcon.width;
		heartsIcon.y = 0 + 10;
		
		heartsText = game.add.text(50, 10, "x " + lives, style);	
		heartsText.anchor.setTo(0, 0);	
		heartsText.x = game.world.width - 75;
		heartsText.y = 0 + 10;
		
		createCardsBlue();
			this.game.physics.arcade.enable(blueBg[0]);
			this.game.physics.arcade.enable(blueBg[1]);
		
		
			blueBg[1].inputEnabled = true;
			blueBg[1].input.enableDrag();
			blueBg[1].originalPosition = blueBg[1].position.clone();
			blueBg[1].events.onDragUpdate.add(onDragUpdate, this);
			blueBg[1].events.onDragStop.add(function(currentSprite){
			  stopDrag(currentSprite, blueBg[0]);
			}, this);
		
			function onDragUpdate(object){
					blueText[object.id].x = blueBg[object.id].x + blueBg[object.id].width/2.1;
					blueText[object.id].y = blueBg[object.id].y + blueBg[object.id].height/1.3;
					imagesCards[object.id].x = blueBg[object.id].x + imagesCards[object.id].width/2.2;
					imagesCards[object.id].y = blueBg[object.id].y + imagesCards[object.id].height * 0.2;
			}
		
			function stopDrag (currentSprite, endSprite){
				if (!this.game.physics.arcade.overlap(currentSprite, endSprite, function() {
				currentSprite.input.draggable = false;
				//currentSprite.position.copyFrom(endSprite.position);
				TweenMax.to(currentSprite,0.4,{x:endSprite.originalPositionX,y:endSprite.originalPositionY});	
				currentSprite.anchor.setTo(endSprite.anchor.x, endSprite.anchor.y); 
				TweenMax.to(blueText[currentSprite.id],0.4,{x:blueText[endSprite.id].originalPositionX,y:blueText[endSprite.id].originalPositionY});	
				TweenMax.to(imagesCards[currentSprite.id],0.4,{x: imagesCards[endSprite.id].originalPositionX,y: imagesCards[endSprite.id].originalPositionY});	
		
			  })) { 
					TweenMax.to(currentSprite,0.4,{x:currentSprite.originalPositionX,y:currentSprite.originalPositionY});
					//currentSprite.position.copyFrom(currentSprite.originalPosition);
					TweenMax.to(blueText[currentSprite.id],0.4,{x:blueText[currentSprite.id].originalPositionX,y:blueText[currentSprite.id].originalPositionY});
					TweenMax.to(imagesCards[currentSprite.id],0.4,{x:imagesCards[currentSprite.id].originalPositionX,y:imagesCards[currentSprite.id].originalPositionY});
			  }
			 
			}
			
		
		
	}
	
	
	
	function update() {
		background.tilePosition.x += 1;
	}
	
	return {
		assets: assets,
		name: "tapcards",
		create: createScene,
        preload: preload,
		update:update,
		show: function(event){
			//loadSounds()
			initialize()
		}
		
		
	}

}()




