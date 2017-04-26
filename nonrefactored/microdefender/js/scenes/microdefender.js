var soundsPath = "../../shared/minigames/sounds/"
var microdefender = function(){

	assets = {
        atlases: [                
			{
                name: "atlas.microdefender",
                json: "images/microdefender/atlas.json",
                image: "images/microdefender/atlas.png",
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
    
	var background;
	var lado_izq;
	var lado_der;
	var germenes = new Array;
	var globuloRojo = new Array;
	var sceneGroup;
	var blockCollisionGroup;
	var globuloBlanco;
	var speedGame = 3.5;
	var globuloRojo;
	var wallLeft;
	var wallRigth;
	var heartsIcon;
	var heartsText;	
	var xpIcon;
	var xpText;
	var cursors;
	var leftMove = false;
	var rightMove = false;
	var lives = 3;
	var coins = 0;
	var bgm = null;
	var starGame = false;
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

        game.load.spine("ger1", "images/microdefender/germen1/germ1.json");
		game.load.spine("ger2", "images/microdefender/germen2/germ2.json");
		game.load.spine("ger3", "images/microdefender/germen3/germ3.json");
		game.load.spine("globuloRojo", "images/microdefender/bloodcell/bloodcell.json");
		game.load.spine("globuloBlanco", "images/microdefender/whitecell/whitecell.json");
		game.load.image("heartsIcon", "images/microdefender/hearts.png");
		game.load.image("xpIcon", "images/microdefender/xpcoins.png");
		game.load.image("background", "images/microdefender/background.png");
		game.load.image("lado_der", "images/microdefender/lado_der.png");
		game.load.image("lado_izq", "images/microdefender/lado_izq.png");
		game.load.image("starPart", "images/microdefender/starPart.png");
		game.load.image("wrongPart", "images/microdefender/wrongPart.png");	
		game.load.image('gametuto',"images/microdefender/gametuto.png");
		game.load.image('introscreen',"images/microdefender/introscreen.png");
		game.load.image('bgclock',"images/microdefender/bgclock.png");
		game.load.image('buttonPlay',"images/microdefender/button.png");		game.load.image('pc',"images/microdefender/pc.png");
		game.load.image('movil',"images/microdefender/movil.png");
		game.load.image('howTo',"images/microdefender/how"  + localization.getLanguage()  + ".png");
		game.load.image('buttonText',"images/microdefender/play" + localization.getLanguage() + ".png");		
		game.load.audio('wormwood',  soundsPath + 'songs/wormwood.mp3');
	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}
	function initialize(){
		lives = 3;
		coins = 0;
		heartsText.setText("x " + lives);
		xpText.setText(coins);
		speedGame = 3.5;
		starGame = false;

	}	

	function getRandomArbitrary(min, max) {
  				return Math.random() * (max - min) + min;
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
			var inputLogo = overlayGroup.create(game.world.centerX - 50,game.world.centerY + 145,'pc');
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
		background = game.add.tileSprite(0,0,game.world.width, game.world.height, "background");
		lado_izq = game.add.tileSprite(0,0,460,game.world.height, "lado_izq");
		lado_der = game.add.tileSprite(0,0,459,game.world.height, "lado_der");
		lado_der.alignIn(game.world.bounds, Phaser.RIGHT);

		if(!game.device.desktop){
				lado_der.x = lado_der.x + lado_der.width/1.3;
				lado_izq.x = lado_izq.x - lado_izq.width/1.2;
			}
		
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
		globuloBlanco = game.add.spine(game.world.centerX,250,"globuloBlanco");
		globuloBlanco.scale.setTo(0.25,0.25);
		globuloBlanco.setAnimationByName(0, "IDLE", true);
		globuloBlanco.setSkinByName("whitecell");

			wallLeft = lado_izq.x + lado_izq.width;
			wallRigth = lado_der.x;
		
			for(var c = 0;c<=2;c++){
				germenes[c] = game.add.spine(0, 0, "ger" + [c+1]);
				germenes[c].scale.setTo(0.25,0.25);
				germenes[c].id = 1;
				germenes[c].setAnimationByName(0, "IDLE", true);
				germenes[c].setSkinByName("germ" + [c+1]);
				germenes[c].x = getRandomArbitrary(wallLeft, wallRigth) + germenes[c].width;
				germenes[c].y = 350 * [c + 1] + germenes[c].height;	
				germenes[c].impact = false;
				
				globuloRojo[c] = game.add.spine(0, 0, "globuloRojo");
				globuloRojo[c].scale.setTo(0.25,0.25);
				globuloRojo[c].id = 2;
				globuloRojo[c].setAnimationByName(0, "IDLE", true);
				globuloRojo[c].setSkinByName("bloodcell");
				globuloRojo[c].x = getRandomArbitrary(wallLeft, wallRigth) + globuloRojo[c].width;
				globuloRojo[c].y = 350 * [c + 1] + game.height + globuloRojo[c].height;
				globuloRojo[c].impact = false;
								
			}
		
		

		cursors = game.input.keyboard.createCursorKeys();
		console.log(globuloBlanco.y);

     var groupButton = game.add.group()
        groupButton.x = game.world.centerX + 135
        groupButton.y = game.world.height -125
        groupButton.scale.setTo(1.4,1.4)
        groupButton.isPressed = false
        
        var button1 = groupButton.create(0,0, 'atlas.microdefender','right_press')
        button1.anchor.setTo(0.5,0.5)
		
		//var rect1 = groupButton.createsetRectangle
        
        var button2 = groupButton.create(0,0, 'atlas.microdefender','right_idle')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.tag = 'right'
        button2.events.onInputDown.add(inputButton1)
        button2.events.onInputUp.add(releaseButton1)
        
        var groupButton = game.add.group()
        groupButton.x = game.world.centerX - 135
        groupButton.y = game.world.height -125
        groupButton.scale.setTo(1.4,1.4)
        groupButton.isPressed = false
        
        var button1 = groupButton.create(0,0, 'atlas.microdefender','left_press')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.microdefender','left_idle')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.tag = 'left'
        button2.events.onInputDown.add(inputButton2)
        button2.events.onInputUp.add(releaseButton2)		
		
		
		createOverlay();
		
		
		

	}

	function inputButton1(){
		leftMove = true;
	}
	
	function inputButton2(){
		rightMove = true;	
	}	
	
	function releaseButton1(){
		leftMove = false;
	}
	
	function releaseButton2(){
		rightMove = false;	
	}	
	
	function moveLeft(){
		if(leftMove){
			if(globuloBlanco.x < wallRigth){
					globuloBlanco.x += 4 + speedGame/2;
				}
		}
	}	
	
	function moveRight(){
		if(rightMove){
			if(globuloBlanco.x >= wallLeft){
				globuloBlanco.x -= 4 + speedGame/2;
			}
			
		}
	}
	
	
	
	function newPosition(object){
		object.y = game.height;
		object.x = getRandomArbitrary(wallLeft, wallRigth);
		object.impact = false;
	}
		
	
	function SumeCoins(){
	
			globuloBlanco.setAnimationByName(0, "IDLE", true);
			globuloBlanco.setSkinByName("whitecell");		
				
	}
	
	function gameOver(){
		var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,17)
			sceneloader.show("result");
	}

	
	function moveObject(object){
		object.y -= speedGame;
		if (parseFloat(object.y) >= 110 && parseFloat(object.y) <= globuloBlanco.y + globuloBlanco.height + 50) {
			if (parseFloat(object.x) >= globuloBlanco.x - 50 && parseFloat(object.x) <= globuloBlanco.x + object.width + 50){
				speedGame = speedGame + 0.005;

				if(!object.impact){
					if(object.id == 1){		
						TweenMax.to(object.scale,0.3,{x:0.7,y:0.7});
						TweenMax.to(object,0.2,{alpha:0,onComplete:SumeCoins});
						globuloBlanco.setAnimationByName(0, "WIN", true);
						globuloBlanco.setSkinByName("WIN");
						coins++;
						xpText.setText(coins);	
						sound.play("magic");	
					}
					if(object.id == 2){
						TweenMax.to(object.scale,0.3,{x:0.7,y:0.7});
						TweenMax.to(object,0.2,{alpha:0});	
							lives--;
							heartsText.setText("x " + lives);
							if(lives != 0){
								sound.play("wrong");
								globuloBlanco.setAnimationByName(0, "IDLE", true);
								globuloBlanco.setSkinByName("whitecell");	

							}else{
								globuloBlanco.setAnimationByName(0, "LOSE", true);
								globuloBlanco.setSkinByName("LOSE");	
								bgm.stop();
								sound.play("gameLose");
								TweenMax.to(this,1,{alpha:0,delay:2,onComplete:gameOver});
									
							}
						}
					object.impact = true;
					}
				}
		}
				
		if(object.y < -50){
				newPosition(object);
				object.alpha = 1;
				TweenMax.to(object.scale,0,{x:0.25,y:0.25});
		}
		
		
	}	
	
	function update() {
	if(starGame){	
		if(lives != 0){
				moveLeft();
				moveRight();
				moveObject(germenes[0])
				moveObject(germenes[1])
				moveObject(germenes[2]);
			
				moveObject(globuloRojo[0]);
				moveObject(globuloRojo[1]);
				moveObject(globuloRojo[2]);
	
		
		
			background.tilePosition.y -= speedGame;
			lado_der.tilePosition.y -= speedGame;
			lado_izq.tilePosition.y -= speedGame;

			
			
			
			if (cursors.left.isDown){
				rightMove = false;
				leftMove = false;

			if(globuloBlanco.x >= wallLeft){
				globuloBlanco.x -= 4 + speedGame/2;
			}
			}else if (cursors.right.isDown){
				rightMove = false;
				leftMove = false;
				if(globuloBlanco.x < wallRigth){
					globuloBlanco.x += 4 + speedGame/2;
				}
			}
		}
	}
	}
	
	return {
		assets: assets,
		name: "microdefender",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()