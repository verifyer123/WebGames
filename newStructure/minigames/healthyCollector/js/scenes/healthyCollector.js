var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var healthyCollector = function(){

	assets = {
        atlases: [                
			{
                //name: "atlas.healthyCollector",
                //json: "images/healthyCollector/atlas.json",
                //image: "images/healthyCollector/atlas.png",
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
				file: soundsPath + "combo.mp3"}
		],
	}
    
    var gameIndex = 18;
	var background;
	var carril = new Array;
	var buttonsGame = new Array;
	var baseBotones;
	var items = new Array;
	var NumGlow = new Array;	
	var sceneGroup = null;
	var heartsGroup = null;
	var blockCollisionGroup;
	var dinamita;
	var speedGame = 5;
	var wallLeft;
	var wallRigth;
	var heartsIcon;
	var heartsText;	
	var xpIcon;
	var xpText;
	var lastItem;
	var cursors;
	var leftMove = false;
	var rightMove = false;
	var lives = 3;
	var coins = 0;
	var bgm = null;
	var starGame = false;
	var pressLeft = false;
	var pressRight = false;
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
		game.load.image("item0", "images/healthyCollector/item1.png");
		game.load.image("item1", "images/healthyCollector/item2.png");
		game.load.image("item2", "images/healthyCollector/item3.png");
		game.load.image("item3", "images/healthyCollector/item4.png");	
		game.load.image("item4", "images/healthyCollector/item5.png");
		game.load.image("item5", "images/healthyCollector/item6.png");
		game.load.image("item6", "images/healthyCollector/item7.png");
		game.load.image("item7", "images/healthyCollector/item8.png");		
		game.load.spine("dinamita", "images/healthyCollector/dinamita/skeleton.json");
		game.load.image("heartsIcon", "images/healthyCollector/hearts.png");
		game.load.image("xpIcon", "images/healthyCollector/xpcoins.png");
		game.load.image("background", "images/healthyCollector/background.png");
		game.load.image("carril", "images/healthyCollector/carril.png");
		game.load.image("baseBotones", "images/healthyCollector/baseBotones.png");
		game.load.image("ButtonLeft_1", "images/healthyCollector/ButtonLeft_1.png");
		game.load.image("ButtonLeft_2", "images/healthyCollector/ButtonLeft_2.png");
		game.load.image("ButtonRight_1", "images/healthyCollector/ButtonRight_1.png");
		game.load.image("ButtonRight_2", "images/healthyCollector/ButtonRight_2.png");
		game.load.image("starPart", "images/healthyCollector/starPart.png");
		game.load.image("wrongPart", "images/healthyCollector/wrongPart.png");	
		game.load.image('gametuto',"images/healthyCollector/gametuto.png");
		//game.load.image('introscreen',"images/healthyCollector/introscreen.png");
		game.load.image('bgclock',"images/healthyCollector/bgclock.png");
		//game.load.image('buttonPlay',"images/healthyCollector/button.png");		game.load.image('pc',"images/healthyCollector/desktop.png");
		//game.load.image('howTo',"images/healthyCollector/how"  + localization.getLanguage()  + ".png");
		game.load.image('buttonText',"images/healthyCollector/play" + localization.getLanguage() + ".png");		
		game.load.audio('wormwood',  soundsPath + 'songs/wormwood.mp3');
		game.load.spritesheet('glow', 'images/healthyCollector/glow.png', 170, 141, 11);
		;
		game.load.image('tutorial_image',"images/healthyCollector/tutorial_image.png")
		//loadType(gameIndex)

	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}
	function initialize(){
		lives = 3;
		coins = 0;
		heartsText.setText("x " + lives);
		xpText.setText(coins);
		speedGame = 5;
		starGame = false;

	}	

	function getRandomArbitrary(min, max) {
  			return Math.floor(Math.random() * (max - min) + min);
	}
	
	function createOverlay(){
		lives = 3;
		coins = 0;
		heartsText.setText("x " + lives);
		xpText.setText(coins);
		speedGame = 5;
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
		
		bgm = game.add.audio('wormwood');
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
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText');
		playText.anchor.setTo(0.1,0.5)*/
    }	

    function onClickPlay(){

		overlayGroup.y = -game.world.height
		
		bgm = game.add.audio('wormwood');
            game.sound.setDecodedCallback(bgm, function(){
            }, this);
		
		bgm.loopFull(0.5);
		starGame = true;
		buttons.getButton(bgm,sceneGroup)

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
		sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel);
		loadSounds();
	
		game.physics.startSystem(Phaser.Physics.ARCADE);	
		game.physics.startSystem(Phaser.Physics.P2JS);
		background = game.add.tileSprite(0,0,game.world.width, game.world.height, "background");
		sceneGroup.add(background);

		carril[1] = game.add.tileSprite(game.world.centerX - 85,0,169, 839, "carril");
		carril[0] = game.add.tileSprite(carril[1].x - 169,0,169, 839, "carril");
		carril[2] = game.add.tileSprite(carril[1].x + 169,0,169, 839, "carril");
		sceneGroup.add(carril[0]);
		sceneGroup.add(carril[1]);
		sceneGroup.add(carril[2]);
		
			for(var c = 0;c<=7;c++){
				
				NumGlow[c] = game.add.sprite(0, -500, 'glow');
				var glowObject = NumGlow[c].animations.add('glowObject');
				NumGlow[c].animations.play('glowObject', 11, true);
				NumGlow[c].anchor.setTo(0.1,0);
				items[c] = game.add.sprite(0, 0, "item" + c);
				items[c].id = c;
				items[c].x = carril[getRandomArbitrary(0,3)].x + items[c].width/8;
				if(c == 0){
					items[c].y = -500;
				}else{
					items[c].y = items[c-1].y - 180;
				}
				items[c].impact = false;
				items[c].anchor.setTo(0);	
				
				if(c % 2 == 0) {
    				items[c].numero = "par";
				 }else{
					items[c].numero = "impar";
					 NumGlow[c].visible = false;
				 }
				sceneGroup.add(NumGlow[c]);
				sceneGroup.add(items[c]);			
			}
		dinamita = game.add.spine(game.world.centerX,game.world.centerY + (game.world.centerY/2) ,"dinamita");
		dinamita.setAnimationByName(0, "RUN", true);
		dinamita.setSkinByName("normal");
		dinamita.x = carril[1].x + dinamita.width/1.3;
		//var childrens = dinamita.slotContainers[4].children[0]
		//var childrens = dinamita.slotContainers[4].children[0].scale.x = 1.5;
		//console.log(childrens);
		
		sceneGroup.add(dinamita);
		
		lastItem = items[2].y; 
		cursors = game.input.keyboard.createCursorKeys();
		
		baseBotones = game.add.sprite(0,game.world.centerY + 250,"baseBotones");
		baseBotones.width = game.width; 
		sceneGroup.add(baseBotones);
		
		
     	var groupButton1 = game.add.group()
        groupButton1.x = game.world.centerX - carril[1].width;
        groupButton1.y = game.world.height -125;
        groupButton1.isPressed = false;
        
        var button1 = groupButton1.create(0,0,'ButtonLeft_2')
        button1.anchor.setTo(0,0.5);
        
        var button2 = groupButton1.create(0,0, 'ButtonLeft_1')
        button2.anchor.setTo(0,0.5);
        button2.inputEnabled = true
        button2.tag = 'left'
        button2.events.onInputDown.add(inputButton1)
        button2.events.onInputUp.add(releaseButton1)	
		
		//var graphics = game.add.graphics(100, 100);
	
     	var groupButton2 = game.add.group()
        groupButton2.x = game.world.centerX + 10;
        groupButton2.y = game.world.height -125
        groupButton2.isPressed = false
        
        var button1 = groupButton2.create(0,0, 'ButtonRight_2')
        button1.anchor.setTo(0,0.5);
        
        var button2 = groupButton2.create(0,0,'ButtonRight_1')
        button2.anchor.setTo(0,0.5);
        button2.inputEnabled = true
        button2.tag = 'right'
        button2.events.onInputDown.add(inputButton2);
        button2.events.onInputUp.add(releaseButton2);
	
		sceneGroup.add(groupButton1);
		sceneGroup.add(groupButton2);
		
		createHearts();
		createCoins();
		createOverlay();
	}

	function inputButton1(){
		leftMove = true;
		if(dinamita.x > carril[0].x + dinamita.width/1.3){
		dinamita.x = dinamita.x - carril[0].width;
		}	
	}
	
	function inputButton2(){
		rightMove = true;	
		if(dinamita.x < carril[2].x + dinamita.width/2){
		dinamita.x = dinamita.x + carril[0].width;;
		}
	}	
	

	function releaseButton1(){
		leftMove = false;
	}
	
	function releaseButton2(){
		rightMove = false;	
	}	
	
	
	function newPosition(object){
		object.y = lastItem;
		object.x = carril[getRandomArbitrary(0,3)].x + object.width/8;
		object.impact = false;
		NumGlow[object.id].alpha = 1;
	}
		
	
	function SumeCoins(){
	
			dinamita.setAnimationByName(0, "WIN", true);
			dinamita.setSkinByName("win");		
				
	}
	
	function gameOver(){
		var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,gameIndex)
			sceneloader.show("result");
	}

	
	function moveObject(object){
		object.y += speedGame;
					NumGlow[object.id].x = object.x;
					NumGlow[object.id].y = object.y;
		
		if (parseFloat(object.y) >= 500 && parseFloat(object.y) <= 650 ) {
			if (parseFloat(object.x) >= dinamita.x - 100 && parseFloat(object.x) <= dinamita.x + object.width/2){
				speedGame = speedGame + 0.010;
				
				if(!object.impact){
					if(object.numero == "par"){	
						TweenMax.to(object.scale,0.3,{x:1.5,y:1.5});
						TweenMax.to(object,0.2,{alpha:0,onComplete:SumeCoins});
						dinamita.setAnimationByName(0, "WIN", true);
						dinamita.setSkinByName("WIN");
						coins++;
						xpText.setText(coins);	
						sound.play("magic");	
						TweenMax.to(NumGlow[object.id],0.2,{alpha:0});
					}
					if(object.numero == "impar"){
						TweenMax.to(object,0.2,{tint:0xff0000, yoyo:true,repeat:5});
						//TweenMax.to(object.scale,0.3,{x:1.5,y:1.5});
						//TweenMax.to(object,0.2,{alpha:0});	
							lives--;
							heartsText.setText("x " + lives);
						TweenMax.to(dinamita,1,{tint:0xff0707,yoyo:true,repeat:3})
							if(lives != 0){
								sound.play("wrong");	
								

							}else{
								dinamita.setAnimationByName(0, "LOSE", true);
								dinamita.setSkinByName("LOSE");	
								bgm.stop();
								sound.play("gameLose");
								TweenMax.to(this,1,{alpha:0,onComplete:gameOver});
									
							}
						}
					object.impact = true;
					}
				}
		}
				
		if(object.y > game.height - baseBotones.y/4){
				newPosition(object);
				object.alpha = 1;
				TweenMax.to(object.scale,0,{x:1,y:1});
		}
		
		
	}	
	
	function update() {

		
		
		
		if(starGame){	
			if(lives != 0){
					carril[0].tilePosition.y += speedGame;
					carril[1].tilePosition.y += speedGame/2;
					carril[2].tilePosition.y += speedGame;	
					moveObject(items[0])
					moveObject(items[1])
					moveObject(items[2]);
					moveObject(items[3]);
					moveObject(items[4])
					moveObject(items[5])
					moveObject(items[6]);
					moveObject(items[7]);
				

				
				if (cursors.left.isUp){
				pressLeft = false;
				}
				
				if (cursors.right.isUp){
				pressRight = false;
				}
				

				if (cursors.left.isDown){
					if(!pressLeft){
						if(dinamita.x > carril[0].x + dinamita.width/1.3){
							dinamita.x = dinamita.x - carril[0].width;
						}
						pressLeft = true;
					}

				}else if (cursors.right.isDown){
					if(!pressRight){
						if(dinamita.x < carril[2].x + dinamita.width/2){
							dinamita.x = dinamita.x + carril[2].width;
							pressRight = true;
							}
						}
				}
			}
		}
	}
	
	return {
		assets: assets,
		name: "healthyCollector",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()