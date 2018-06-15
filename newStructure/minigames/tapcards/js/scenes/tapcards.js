var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var tapcards = function(){

	assets = {
        atlases: [                
			{
                name: "atlas.cards",
                json: "images/tapcards/atlas.json",
                image: "images/tapcards/atlas.png",
			},
			{
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
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
				file: soundsPath + "combo.mp3"}
		],
	}
    var gameIndex = 6;
	var background;
	var book;
	var pencilEraser;
	var paperEraser;
	var paper;
	var heartsIcon;
	var heartsText;
	var xpIcon;
	var xpText;	
	var readyButton;
	var starPart;
	var wrongPart;
	var lives = 5;
	var frutas = new Array;
	var randomFruits;
	var blueBg  = new Array;
	var blueText = new Array;
	var redBg  = new Array;
	var redText  = new Array;
	var greenBg  = new Array;
	var imagesCardsGreen = new Array;
	var imagesCards = new Array;
	var positionsRedsX = new Array;
	var positionsRedsY = new Array;
	var styleCards;
	var NumColumnas = 2;
	var leveldifficulty = 0;
	var count = 0;
	var enterFunctionbad = 0;
	var coins = 0;
	var bgclock;
	var clockText;
	var timerCount;
	var timer = 30;
	var sceneGroup = null;
	
	var style = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	var styleClock = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"};

	function fontsSize(){
			if(game.world.width < 500){
				styleCards = {font: "6vw VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
			}else if(game.world.width < 781){
				styleCards = {font: "6vw VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
			}else{
				styleCards = {font: "4vw VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
			}
	}
	
    function preload() {
		game.load.image("background", "images/tapcards/background.png");
		game.load.image("book", "images/tapcards/libro.png");
		game.load.image("paperPencil", "images/tapcards/paperPencil.png");
		game.load.image("pencilEraser", "images/tapcards/pencilEraser.png");
		game.load.image("paper", "images/tapcards/paper.png");
		game.load.image("heartsIcon", "images/tapcards/hearts.png");
		game.load.image("xpIcon", "images/tapcards/xpcoins.png");
		game.load.image("avocado", "images/tapcards/items/aguacate.png");
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
		game.load.image("carrot", "images/tapcards/items/zanahoria.png");
		game.load.image("lettuce", "images/tapcards/items/lechuga.png");
		game.load.image("beet", "images/tapcards/items/betabel.png");
		game.load.image("readyButton", "images/tapcards/ready_button.png");
		game.load.image("starPart", "images/tapcards/starPart.png");
		game.load.image("wrongPart", "images/tapcards/wrongPart.png");	
		game.load.image('gametuto',"images/tapcards/gametuto.png");
		game.load.image('introscreen',"images/tapcards/introscreen.png");
		game.load.image('bgclock',"images/tapcards/bgclock.png");
		game.load.image('pc',"images/tapcards/pc.png");
		game.load.image('movil',"images/tapcards/movil.png");
		//game.load.image('howTo',"images/tapcards/how"  + localization.getLanguage()  + ".png");
		//game.load.image('buttonText',"images/tapcards/play" + localization.getLanguage() + ".png");		
		//game.load.audio('runningSong', soundsPath + 'songs/running_game.mp3');

		game.load.image('tutorial_image',"images/tapcards/tutorial_image.png")
		//loadType(gameIndex)

	}
	
	frutas = [
		"avocado",	
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
		"carrot",
		"lettuce",
		"beet"
	];
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
		lives = 5;
		leveldifficulty = 0;
		count= 0;
        coins = 0;
	}	
	
	function createOverlay(){
        sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel);
		var overlayGroup = game.add.group()
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
		createCardsGreen();
		createCardsBlue();
		createCardsRed();
		positionCardsBlue();
		TweenMax.to(readyButton,1,{y:game.height - readyButton.height,ease:Back.easeOut});		
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.45,0.5);
		//plane.x = game.world.width * 0.55;
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'gametuto')
		tuto.anchor.setTo(0.2,0.5)
		
        
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
			var inputLogo = overlayGroup.create(game.world.centerX,game.world.centerY + 145,'pc');
        	inputLogo.anchor.setTo(0.2,0.5);	
		}
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height,'atlas.cards','button')
		button.anchor.setTo(0.2,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0,0.5)*/
    }	

    function onClickPlay(){
    	overlayGroup.y = -game.world.height
		createCardsGreen();
		createCardsBlue();
		createCardsRed();
		positionCardsBlue();
		TweenMax.to(readyButton,1,{y:game.height - readyButton.height,ease:Back.easeOut});
    }
	
	
	function createCardsGreen(){
				for(var i = 0;i<=frutas.length-1;i++){	
					imagesCardsGreen[i] = null;
					greenBg[i] = game.add.graphics(0, 0);
					greenBg[i].id = i;
					greenBg[i].beginFill(0x71C64E);
					greenBg[i].lineStyle(10, 0xFFFFFF, 1);
					greenBg[i].anchor.setTo(0.5, 0.5);
					if(game.world.width < 721){
						greenBg[i].drawRoundedRect(0, 0, game.world.width * 0.35, game.world.width * 0.35, 25);
					}else{
						greenBg[i].drawRoundedRect(0, 0, game.world.width * 0.2, game.world.width * 0.2, 25);
					}
					imagesCardsGreen[i] = game.add.sprite(0,0,randomFruits[i]);
					imagesCardsGreen[i].anchor.setTo(0, 0);
					imagesCardsGreen[i].width = greenBg[i].width/2;
					imagesCardsGreen[i].height = greenBg[i].height/2;	
					greenBg[i].x = game.world.width * 2;
					imagesCardsGreen[i].x = game.world.width * 2;
					this.game.physics.arcade.enable(greenBg[i]);
				}	
	}
	function createCardsBlue(){
		
				for(var i = 0;i<=frutas.length-1;i++){	
					imagesCards[i] = null;
					blueText[i] = null;
					blueBg[i] = game.add.graphics(0, 0);
					blueBg[i].id = i;
					blueBg[i].beginFill(0x379FED);
					blueBg[i].lineStyle(10, 0xFFFFFF, 1);
					blueBg[i].anchor.setTo(0.5, 0.5);
					if(game.world.width < 721){
						blueBg[i].drawRoundedRect(0, 0, game.world.width * 0.35, game.world.width * 0.35, 25);
					}else{
						blueBg[i].drawRoundedRect(0, 0, game.world.width * 0.2, game.world.width * 0.2, 25);
					}
					blueText[i] =  game.add.text(0, 0, randomFruits[i], styleCards);
					blueText[i].anchor.setTo(0.5, 0.5);
					imagesCards[i] = game.add.sprite(0,0,randomFruits[i]);
					imagesCards[i].anchor.setTo(0, 0);
					imagesCards[i].width = blueBg[i].width/2;
					imagesCards[i].height = blueBg[i].height/2;
					blueBg[i].alpha = 0;
					blueText[i].alpha = 0;
					imagesCards[i].alpha = 0;
					blueBg[i].x = game.world.width * 2;
					blueText[i].x = game.world.width * 2;
					imagesCards[i].x = game.world.width * 2;
					
				}    
		}
	function createCardsRed(){
				for(var i = 0;i<=frutas.length-1;i++){	
					redText[i] = null;
					redBg[i] = game.add.graphics(0, 0);
					redBg[i].id = i;
					redBg[i].beginFill(0xE23434);
					redBg[i].lineStyle(10, 0xFFFFFF, 1);
					redBg[i].anchor.setTo(0.5, 0.5);
					if(game.world.width < 721){
						redBg[i].drawRoundedRect(0, 0, game.world.width * 0.35, game.world.width * 0.35, 25);
					}else{
						redBg[i].drawRoundedRect(0, 0, game.world.width * 0.2, game.world.width * 0.2, 25);
					}
					redText[i] =  game.add.text(0, 0, randomFruits[i], styleCards);
					redText[i].anchor.setTo(0.5, 0.5);
					redBg[i].x = game.world.width * 2;
					redText[i].x = game.world.width * 2;
				}    
		}	
	function positionCardsBlue(){
		for(var p = 0;p<=leveldifficulty;p++){
			blueBg[p].x = game.world.width * 2;
			blueBg[p].alpha = 0; 
		}
		for(var i = 0;i<=leveldifficulty;i++){
			if(leveldifficulty == 0){
					if(game.world.width < 721){
							blueBg[i].x = (game.world.width * 0.13) + blueBg[i].width/2; 	
							blueBg[i].y = game.world.height * 0.4; 
					}else{
						blueBg[i].x = game.world.width * 0.3 + blueBg[i].width/2; 
						blueBg[i].y = game.world.height * 0.3; 
					}
			}else if(leveldifficulty == 1){
					if(game.world.width < 721){
						if(i < NumColumnas){
							blueBg[i].x = (game.world.width * 0.13) + game.world.width * 0.3 * i + blueBg[i].width/4 * i;
							blueBg[i].y = game.world.height * 0.4; 
						}else{
							blueBg[i].x = blueBg[i-NumColumnas].x 	
							blueBg[i].y = blueBg[i-NumColumnas].y  + blueBg[i].height + 10; 	
						}
					}else{
						blueBg[i].x = (game.world.width * 0.28) + game.world.width * 0.22 * i ;
						blueBg[i].y = game.world.height * 0.3; 
					}	
			}else if(leveldifficulty == 2){
				if(i <= 1){
					if(game.world.width < 721){
						if(i < NumColumnas){
							blueBg[i].x = (game.world.width * 0.13) + game.world.width * 0.3 * i + blueBg[i].width/4 * i; blueBg[i].y = game.world.height * 0.4; 
							}
						}else{
							blueBg[i].x = (game.world.width * 0.28) + game.world.width * 0.22 * i ;
							blueBg[i].y = game.world.height * 0.3; 
						}
					}
			}else if(leveldifficulty >= 3){
				if(i <= 2){
					if(game.world.width < 721){
						if(i < NumColumnas){
							blueBg[i].x = (game.world.width * 0.13) + game.world.width * 0.3 * i + blueBg[i].width/4 * i;
							blueBg[i].y = game.world.height * 0.3; 
						}else{
							blueBg[i].x = blueBg[i-NumColumnas].x  + blueBg[i].width/4 * i	
							blueBg[i].y = blueBg[i-NumColumnas].y  + blueBg[i].height + 10; 	
						}
					}else{
						blueBg[i].x = (game.world.width * 0.18) + game.world.width * 0.22 * i ;
						blueBg[i].y = game.world.height * 0.3; 
					}
				}
				
			}	
					blueBg[i].originalPositionX = blueBg[i].x;
					blueBg[i].originalPositionY = blueBg[i].y;
					blueText[i].x = blueBg[i].x + blueBg[i].width/2.1;
					blueText[i].y = blueBg[i].y + blueBg[i].height/1.3;
					blueText[i].originalPositionX = blueText[i].x;
					blueText[i].originalPositionY = blueText[i].y;
					imagesCards[i].x = blueBg[i].x + imagesCards[i].width/2.2;
					imagesCards[i].y = blueBg[i].y + imagesCards[i].height * 0.2;	
					imagesCards[i].originalPositionX = imagesCards[i].x;
					imagesCards[i].originalPositionY = imagesCards[i].y;
					TweenMax.to(blueBg[i],0.5,{alpha:1,delay:i * 0.2,ease:Linear.easeOut});
					TweenMax.fromTo(blueBg[i],0.5,{x:blueBg[i].x},{x:blueBg[i].originalPositionX,delay:i * 0.2,ease:Elastic.easeOut});
					TweenMax.to(blueText[i],0.5,{alpha:1,delay:i * 0.2,ease:Linear.easeOut});
					TweenMax.fromTo(blueText[i],0.5,{x:blueText[i].x-blueText[i].width},{x:blueText[i].originalPositionX,delay:i * 0.2,ease:Elastic.easeOut});
					TweenMax.to(imagesCards[i],0.5,{alpha:1,delay:i * 0.2,ease:Linear.easeOut});
					TweenMax.fromTo(imagesCards[i],0.5,{x:imagesCards[i].x-imagesCards[i].width},{x:imagesCards[i].originalPositionX,delay:i * 0.2,ease:Elastic.easeOut});
		}
	}
function positionCardsRed(){

		for(var i = 0;i<=frutas.length-1;i++){
			redBg[i].alpha = 1;
			redText[i].alpha = 1;
			if(leveldifficulty == 0){
					if(game.world.width < 721){
						positionsRedsX[i] = (game.world.width * 0.13) + redBg[i].width/2;	
						positionsRedsY[i] = game.world.height * 0.2; 
					}else{
						positionsRedsX[i] = game.world.width * 0.28 + redBg[i].width/2; 
						positionsRedsY[i] = game.world.height * 0.1; 
					}
					
			}else if(leveldifficulty == 1){
					if(game.world.width < 721){
						if(i < NumColumnas){
							positionsRedsX[i] = (game.world.width * 0.13) + game.world.width * 0.3 * i + redBg[i].width/4 * i; 
							positionsRedsY[i] = game.world.height * 0.2; 
						}else{
							positionsRedsX[i] = redBg[i-NumColumnas].x 	
							positionsRedsY[i] = redBg[i-NumColumnas].y  + redBg[i].height + 10; 	
						}

					}else{
						positionsRedsX[i] = (game.world.width * 0.28) + game.world.width * 0.22 * i ;
						positionsRedsY[i] = game.world.height * 0.1; 
					}
					
			}else if(leveldifficulty == 2){
				if(i <= 1){
					if(game.world.width < 721){
						if(i < NumColumnas){
							positionsRedsX[i] = (game.world.width * 0.13) + game.world.width * 0.3 * i + redBg[i].width/4 * i;
							positionsRedsY[i] = game.world.height * 0.2; 
						}

					}else{
						positionsRedsX[i] = (game.world.width * 0.28) + game.world.width * 0.22 * i ;
						positionsRedsY[i] = game.world.height * 0.1; 
					}
				}else{
					positionsRedsX[i] = 2000;
				}
				
			}else if(leveldifficulty == 3){
				if(i <= 2){
					if(game.world.width < 721){
						if(i < NumColumnas){
							positionsRedsX[i] = (game.world.width * 0.13) + game.world.width * 0.3 * i + redBg[i].width/4 * i; 	
							positionsRedsY[i] = game.world.height * 0.1; 
						}else{
							positionsRedsX[i] = redBg[i-NumColumnas].x + redBg[i].width/4 * i;	
							positionsRedsY[i] = redBg[i-NumColumnas].y  + redBg[i].height + 10; 	
						}

					}else{
						positionsRedsX[i] = (game.world.width * 0.18) + game.world.width * 0.22 * i ;
						positionsRedsY[i] = game.world.height * 0.1; 
					}
			
				}
			}else if(leveldifficulty == 4){
				if(i <= 2){
					if(game.world.width < 721){
						if(i < NumColumnas){
							positionsRedsX[i] = (game.world.width * 0.13) + game.world.width * 0.3 * i + redBg[i].width/4 * i; 	
							positionsRedsY[i] = game.world.height * 0.1; 
						}else{
							positionsRedsX[i] = redBg[i-NumColumnas].x + redBg[i].width/4 * i;	
							positionsRedsY[i] = redBg[i-NumColumnas].y  + redBg[i].height + 10; 	
						}

					}else{
						positionsRedsX[i] = (game.world.width * 0.18) + game.world.width * 0.22 * i ;
						positionsRedsY[i] = game.world.height * 0.1; 
					}
			
				}
			}else if(leveldifficulty == 5){
				
				
				
				if(i <= 2){
					if(game.world.width < 721){
							positionsRedsX[i] = (game.world.width * 0.13); 	
							positionsRedsY[i] = (game.world.height * 0.1 + redBg[i].height * i) + redBg[i].height/10 * i; 	
						

					}else{
						positionsRedsX[i] = (game.world.width * 0.18) + game.world.width * 0.22 * i ;
						positionsRedsY[i] = game.world.height * 0.1; 
					}
			
				}
			}
			
		}

		var newPositionsx = new Array;
		var newPositionsy = new Array;
	
		for(var s = 0;s<=leveldifficulty;s++){
			if(leveldifficulty == 0){
					newPositionsx[s] = positionsRedsX[s];
				
					
			}
			if(leveldifficulty == 1){
					newPositionsx[s] = positionsRedsX[s];
			}			
			if(leveldifficulty == 2){
				if(s <= 1){
					newPositionsx[s] = positionsRedsX[s];
				}
			}
			if(leveldifficulty == 3){
				if(s <= 1){
					newPositionsx[s] = positionsRedsX[s];
				}
			}	
			if(leveldifficulty == 4){
				if(s <= 1){
					newPositionsx[s] = positionsRedsX[s];
				}
			}
			
			if(leveldifficulty == 5){
				
				if(s <= 2){
					newPositionsx[s] = positionsRedsX[s];
					newPositionsy[s] = positionsRedsY[s];
				}
			}
			
		}
		
		shuffle(newPositionsx);
		shuffle(newPositionsy);
	
		for(var r = 0;r<=leveldifficulty;r++){
					
					redBg[r].y = positionsRedsY[r];
					redBg[r].x = newPositionsx[r];
					
			
					if(leveldifficulty == 2 || leveldifficulty == 3 || leveldifficulty == 4){
						if(r > 1){
							redBg[r].x  = positionsRedsX[r];
						}
					}
			
					if(leveldifficulty >= 5){
						if(game.world.width < 721){
						if(r <= 2){
							redBg[r].x  = positionsRedsX[r];
							redBg[r].y = newPositionsy[r];
						}else{
							redBg[r].x  = positionsRedsX[r];
							redBg[r].y = positionsRedsY[r];	
						}
					}else{
						if(r <= 2){
							redBg[r].x  = newPositionsx[r];
							redBg[r].y = positionsRedsY[r];
						}else{
							redBg[r].x  = positionsRedsX[r];
							redBg[r].y = positionsRedsY[r];
						}
					}
					}
			
					redBg[r].originalPositionX = redBg[r].x;
					redBg[r].originalPositionY = redBg[r].y;
					redText[r].x = redBg[r].x + redBg[r].width/2.1;
					redText[r].y = redBg[r].y + redBg[r].height/2;
					redText[r].originalPositionX = redText[r].x;
					redText[r].originalPositionY = redText[r].y;
					this.game.physics.arcade.enable(redBg[r]);
					redBg[r].inputEnabled = true;
					redBg[r].input.enableDrag();
					redBg[r].originalPosition = redBg[r].position.clone();
					redBg[r].events.onDragUpdate.add(onDragUpdate, this);
					redBg[r].events.onDragStop.add(function(currentSprite){
					  stopDrag(currentSprite, greenBg[r]);
					}, this);
		}

	function wrongCard(target){
		if(enterFunctionbad == 0){
		lives--
		heartsText.setText("x " + lives);
		TweenMax.fromTo(wrongPart,0.3,{alpha:0},{alpha:1});
		TweenMax.fromTo(wrongPart.scale,0.3,{x:0.9},{x:1.1,onComplete:continuewrong});	
		wrongPart.x = target.x;
		wrongPart.y = target.y;	
		enterFunctionbad++;
		}
		
		function continuewrong(){
			TweenMax.to(wrongPart,0.3,{alpha:0});
			if(lives == 0){
				clearInterval(timerCount);
				var resultScreen = sceneloader.getScene("result")
				resultScreen.setScore(true, coins,gameIndex)
				sceneloader.show("result");
				lives = 5;
				leveldifficulty = 0;
				count= 0;
			}
		}
	}

	
	function onDragUpdate(object){
					enterFunctionbad = 0;
					redText[object.id].x = redBg[object.id].x + redBg[object.id].width/2.1;
					redText[object.id].y = redBg[object.id].y + redBg[object.id].height/2;
			}
		
			function stopDrag (currentSprite, endSprite){
				var targetBg = greenBg[currentSprite.id];
				if (!this.game.physics.arcade.overlap(currentSprite, targetBg, function() {
				currentSprite.input.draggable = false;
				TweenMax.to(currentSprite,0.4,{x:targetBg.originalPositionX,y:targetBg.originalPositionY});	
				TweenMax.to(redText[currentSprite.id],0.4,{x:targetBg.originalPositionX + targetBg.width/2,y:targetBg.originalPositionY + targetBg.height/2});	
				TweenMax.fromTo(starPart,0.3,{alpha:0},{alpha:1});
				TweenMax.fromTo(starPart.scale,0.3,{x:0.9},{x:1.1,onComplete:continueStar});	
				starPart.x = targetBg.originalPositionX;
				starPart.y = targetBg.originalPositionY;
				sound.play("magic");	
				coins++
				xpText.setText(coins);	

					
			  })) { 
					for(var r = 0;r<=frutas.length-1;r++){
					if (!this.game.physics.arcade.overlap(currentSprite,greenBg[r], function() {	
						wrongCard(currentSprite);
						sound.play("wrong");
					 })) {}
					}
						
					TweenMax.to(currentSprite,0.4,{x:currentSprite.originalPositionX,y:currentSprite.originalPositionY});
					TweenMax.to(redText[currentSprite.id],0.4,{x:redText[currentSprite.id].originalPositionX,y:redText[currentSprite.id].originalPositionY});
			
			  }
			 
			}
	
	
		if(leveldifficulty == 5){
			console.log("Empieza timer");
			timerCount = setInterval(timerFunction, 1000);
			TweenMax.to(bgclock.scale,0.5,{x:1,ease:Back.easeOut});
			TweenMax.to(clockText.scale,0.5,{x:1,ease:Back.easeOut});			
	}
	
	}	

	
function clearCards(){
	
	
	
		for(var p = 0;p<=frutas.length-1;p++){
			redBg[p].x = game.world.width * 2;
			redBg[p].alpha = 0;
			redText[p].x = game.world.width * 2;
			redText[p].alpha = 0;
			greenBg[p].x = game.world.width * 2;
			imagesCardsGreen[p].alpha = 0;
		}	
	
	//TweenMax.to(readyButton,1,{y:game.height - readyButton.height,ease:Back.easeOut});
}
	
	function timerFunction(){
		if(timer != 0){
			timer-- 
		}else if(timer == 0){
			lives--;	
			heartsText.setText("x " + lives);	
			TweenMax.fromTo(heartsText.scale,1,{x:1.2,y:1.2},{x:1,y:1});
			sound.play("wrong");
			clearInterval(timerCount);
			console.log("clear interval")
			if(lives == 0){
				clearInterval(timerCount);
				clearCards();
				var resultScreen = sceneloader.getScene("result")
				resultScreen.setScore(true, coins,6)
				sceneloader.show("result");
				lives = 5;
				leveldifficulty = 0;
				count= 0;
			}else{
			randomFruits = shuffle(frutas);
	
	
			count = 0;	
			timer = 31;	
			clearCards();
			createCardsGreen();
			createCardsRed();
			positionCardsRed();
			positionCardsGreen();
			sound.play("combo");	
			}
			
			//nextLevel();
			
		}
		clockText.setText(timer);
	}	
	
function continueStar(){
	TweenMax.to(starPart,0.3,{alpha:0,onComplete:nextLevel});
}	
	
function nextLevel(){
	
	if(leveldifficulty != 0){
		count++;
	}
	if(lives <= 4){
	//lives++;
	heartsText.setText("x " + lives);
		
		TweenMax.fromTo(heartsText.scale,1,{x:1.2,y:1.2},{x:1,y:1})
	}
	randomFruits = shuffle(frutas);
	
	//createCardsBlue();
	
	switch(leveldifficulty){
		case 0:
			leveldifficulty++;
			count = 0;
			clearCards();
			createCardsGreen();
			createCardsRed();
			positionCardsRed();
			positionCardsGreen();	
			sound.play("combo");
		break;
		
		case 1:
			leveldifficulty++;
			count = 0;
			//positionCardsBlue();
			clearCards();
			createCardsGreen();
			createCardsRed();
			positionCardsRed();
			positionCardsGreen();
			sound.play("combo");
		break;
			
		case 2:
			
			if(count == 2){
			
				leveldifficulty++;
				count = 0;
			clearCards();
			createCardsGreen();
			createCardsRed();
			positionCardsRed();
			positionCardsGreen();
				sound.play("combo");
			}
		break;
			
		case 3:
				leveldifficulty++;
				count = 0;
			clearCards();
			createCardsGreen();
			createCardsRed();
			positionCardsRed();
			positionCardsGreen();
			sound.play("combo");
			
		break;	
			
		case 4:
			if(count == 2){
				leveldifficulty++;
				count = 0;
			clearCards();
			createCardsGreen();
			createCardsRed();
			positionCardsRed();
			positionCardsGreen();
				sound.play("combo");
			}
		break;		
			
		case 5:
			if(count == 3){
			clearInterval(timerCount);	
			count = 0;	
			timer = 31;	
			clearCards();
			createCardsGreen();
			createCardsRed();
			positionCardsRed();
			positionCardsGreen();
				sound.play("combo");
			}
		break;
			
	}
}	
	
function positionCardsGreen(){
		for(var i = 0;i<=leveldifficulty;i++){
			greenBg[i].alpha = 1;
			imagesCardsGreen[i].alpha = 1;
			if(leveldifficulty == 0){
					if(game.world.width < 721){
							greenBg[i].x = (game.world.width * 0.13) + greenBg[i].width/2; 
							greenBg[i].y = game.world.height * 0.55; 	
					}else{
	
							greenBg[i].x = game.world.width * 0.28 + greenBg[i].width/2; 
							greenBg[i].y = game.world.height * 0.55; 	

					}
					
			}else if(leveldifficulty == 1){
					if(game.world.width < 721){
						
						if( i == 0){
							greenBg[i].x = (game.world.width * 0.13) + greenBg[i].width/2; 
							greenBg[i].y = game.world.height * 0.55; 	

						}
						
					}else{
						
						if( i == 0){
							greenBg[i].x = game.world.width * 0.28 + greenBg[i].width/2; 
							greenBg[i].y = game.world.height * 0.55; 	
						}
					}
					
			}else if(leveldifficulty == 2){
				if( i <= 1){
					if(game.world.width < 721){	
						greenBg[i].x = (game.world.width * 0.13) + game.world.width * 0.3 * i + greenBg[i].width/4 * i;
						greenBg[i].y = game.world.height * 0.55; 
					}else{
						greenBg[i].x = (game.world.width * 0.28) + game.world.width * 0.22 * i ;
						greenBg[i].y = game.world.height * 0.55; 
					}
				}
				
				
			}else if(leveldifficulty == 3){
				if( i == 0){
					if(game.world.width < 721){
							greenBg[i].x = (game.world.width * 0.13) + greenBg[i].width/2; 
							greenBg[i].y = game.world.height * 0.69; 	
						
					}else{
							greenBg[i].x = game.world.width * 0.3 + greenBg[i].width/2; 
							greenBg[i].y = game.world.height * 0.55; 	
						}
					}
			}else if(leveldifficulty == 4){
				if(i <= 1){
					if(game.world.width < 721){
						
							greenBg[i].x = (game.world.width * 0.13) + game.world.width * 0.3 * i + greenBg[i].width/4 * i;
							greenBg[i].y = game.world.height * 0.69; 
					}else{
						greenBg[i].x = (game.world.width * 0.28) + game.world.width * 0.22 * i ;
						greenBg[i].y = game.world.height * 0.55; 
					}
				}
			}else if(leveldifficulty == 5){
				if(i <= 2){
					if(game.world.width < 721){
							greenBg[i].x = (game.world.width * 0.6);
							greenBg[i].y = (game.world.height * 0.1 + greenBg[i].height * i) + greenBg[i].height/10 * i;  
					}else{
						greenBg[i].x = (game.world.width * 0.18) + game.world.width * 0.22 * i ;
						greenBg[i].y = game.world.height * 0.55; 
					}
				}
			}
	
			
					greenBg[i].originalPositionX = greenBg[i].x;
					greenBg[i].originalPositionY = greenBg[i].y;
					imagesCardsGreen[i].x = greenBg[i].x + imagesCardsGreen[i].width/2.2;
					imagesCardsGreen[i].y = greenBg[i].y + imagesCardsGreen[i].height * 0.45;	
					imagesCardsGreen[i].originalPositionX = imagesCardsGreen[i].x;
					imagesCardsGreen[i].originalPositionY = imagesCardsGreen[i].y;
					this.game.physics.arcade.enable(greenBg[i]);

		}
	
	}		
	/*CREATE SCENE*/
    function createScene(){
		randomFruits = shuffle(frutas);

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
		heartsIcon.y = 25;	
		heartsText = game.add.text(50, 10, "x " + lives, style);	
		heartsText.anchor.setTo(0, 0);	
		heartsText.x = game.world.width - 75;
		heartsText.y = 25;
		
		xpIcon = game.add.sprite(0,0,"xpIcon");
		xpIcon.anchor.setTo(0, 0);	
		xpIcon.x = 0;
		xpIcon.y = 30;	
		xpText = game.add.text(50, 10, "0", style);	
		xpText.anchor.setTo(0, 0);	
		xpText.x = 75;
		xpText.y = 28;		
		
		bgclock = game.add.sprite(0,1,"bgclock");
		bgclock.x = game.width * 0.5;
		bgclock.anchor.setTo(0.5, 0);
		bgclock.scale.x = 0;
		clockText = game.add.text(50, 46, timer, styleClock);	
		clockText.x = game.width * 0.5;
		clockText.anchor.setTo(0.5, 0);
		clockText.scale.x = 0;
		createOverlay();
        coins = 0;

	
		function createLevel(){
			
			for(var i = 0;i<=frutas.length-1;i++){
					TweenMax.to(blueBg[i],0.5,{alpha:0,ease:Linear.easeInOut});
					TweenMax.to(blueText[i],0.5,{alpha:0,ease:Linear.easeInOut});
					TweenMax.to(imagesCards[i],0.5,{alpha:0,ease:Linear.easeInOut});
			}
		
		}
		
		readyButton = game.add.sprite(0,0,"readyButton");
		readyButton.anchor.setTo(0.5, 0.5);	
		readyButton.x = game.world.width * 0.5;
		readyButton.y = game.world.height + readyButton.height;
		readyButton.inputEnabled = true;
		readyButton.events.onInputDown.add(readyFunction, this);
		
		starPart = game.add.sprite(0,0,"starPart");
		starPart.anchor.setTo(0.5, 0.5);	
		starPart.alpha = 0;
		starPart.x = game.world.width * 0.5;
		starPart.y = game.world.height - starPart.height;
		
		wrongPart = game.add.sprite(0,0,"wrongPart");
		wrongPart.anchor.setTo(0.5, 0.5);	
		wrongPart.alpha = 0;
		wrongPart.x = game.world.width * 0.5;
		wrongPart.y = game.world.height - starPart.height;
		
		function readyFunction(object){
			sound.play("pop");
			TweenMax.to(object,1,{y:game.height + object.height,ease:Back.easeOut});
			createLevel();
			createCardsGreen();
			positionCardsGreen();
			createCardsRed();
			positionCardsRed();
			
		}
	}
	
			
	
			
		
	

	
	function update() {
		background.tilePosition.x += 1;
		

	}
	
	return {
		assets: assets,
		name: "tapcards",
		getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene,
        preload: preload,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()