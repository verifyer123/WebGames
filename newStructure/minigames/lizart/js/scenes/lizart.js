var soundsPath = "../../shared/minigames/sounds/"
var imagePath = "images/lizart/"
var tutorialPath = "../../shared/minigames/"

var lizart = function(){

	assets = {
		atlases: [                
			{
				//name: "atlas.lizart",
				//json: "images/lizart/atlas.json",
				//image: "images/lizart/atlas.png",
			},
			{   
				name: "atlas.tutorial",
				json: tutorialPath+"images/tutorial/tutorial_atlas.json",
				image: tutorialPath+"images/tutorial/tutorial_atlas.png"
			}
		],
		images: [
			{
				name:"heartsIcon",
				file:imagePath +"hearts.png"
			},
			{
				name:"xpIcon",
				file:imagePath +"xpcoins.png"
			},
			{
				name:"shadowLizar",
				file:imagePath +"shadow.png"
			},
			{
				name:"tree",
				file:imagePath +"tree.png"
			},
			{
				name:"piso",
				file:imagePath +"piso.png"
			},
			{
				name:"globo",
				file:imagePath +"globo.png"
			},
			{
				name:"fruit0",
				file:imagePath +"fruit0.png"
			},
			{
				name:"fruit1",
				file:imagePath +"fruit1.png"
			},
			{
				name:"fruit2",
				file:imagePath +"fruit2.png"
			},
			{
				name:"fruit3",
				file:imagePath +"fruit3.png"
			},
			{
				name:"fruit4",
				file:imagePath +"fruit4.png"
			},
			{
				name:"fruit5",
				file:imagePath +"fruit5.png"
			},
			{
				name:"tutorial_image",
				file:imagePath +"tutorial_image.png"
			},
		],
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
			{	name: "wormwood",
			 file: soundsPath + "songs/wormwood.mp3"},
		],
		spritesheets: [
			{
                name:"hand",
                file:"images/spine/hand/hand.png",
                width:115,
                height:111,
                frames:5
            },
			{
                name:"coin",
                file:"images/spine/coin/coin.png",
                width:122,
                height:123,
                frames:12
			},
			{
                name:"idleEyes",
                file:imagePath + "sheets/idle_ojos.png",
                width:149,
                height:187,
                frames:24
            },
			{
                name:"idleBody",
                file:imagePath + "sheets/idle.png",
                width:350,
                height:213,
                frames:24
            },
			{
                name:"rightEyes",
                file:imagePath + "sheets/rigth_ojos.png",
                width:308,
                height:313,
                frames:16
            },
			{
                name:"rightBody",
                file:imagePath + "sheets/rigth.png",
                width:355,
                height:309,
                frames:16
            },
			{
                name:"wrongEyes",
                file:imagePath + "sheets/wrong_ojos.png",
                width:170,
                height:196,
                frames:16
            },
			{
                name:"wrongBody",
                file:imagePath + "sheets/wrong.png",
                width:347,
                height:222,
                frames:11
            }
		]
	}
	var INITIAL_LIVES = 3

	var gameIndex = 28;
	var background;
	var sceneGroup = null;
	var heartsGroup = null;
	var speedGame = 5;
	var tree;
	var piso;
	var heartsIcon;
	var heartsText;	
	var xpIcon;
	var xpText;
	var cursors;
	var lives = 1;
	var coins = 0;
	var bgm = null;
	var colorSelect = null;
	var colorsArray =[
		"Blue",
		"Brown",
		"Green",
		"Orange",
		"Purple",
		"Red"
	]
	var hand
	var coin
	var globo;
	var textGlobo;
	var idleBody;
	var idleEyes;
	var wrongIdleEyes	
	var rightBody;
	var rightEyes;	
	var wrongBody;
	var wrongEyes;
	var shadowLizar;
	var good;
	var wrong;
	var stars;
	var fruits = new Array;
	var canTakeFruit = true

	var style = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	var styleClock = {font: "60px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"};

	function fontsSize(){
		if(game.world.width < 721){
			styleCards = {font: "2.5vh VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
		}else{
			styleCards = {font: "11vh VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
		}
	}
	function preload() {
	


		//loadType(gameIndex)

	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}
	function initialize(){
		lives = INITIAL_LIVES;
		coins = 0;
		heartsText.setText("x " + lives);
		xpText.setText(coins);
		speedGame = 5;
		starGame = false;

	}	

	var getRand = (function() {
		var nums = [0,1,2,3,4,5];
		var current = [];

		function rand(n) {
			return (Math.random() * n)|0;
		}
		return function() {
			if (!current.length) current = nums.slice();
			return current.splice(rand(current.length), 1);
		}
	}());

	function getRandomArbitrary(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	function createOverlay(){
		lives = INITIAL_LIVES;
		coins = 0;
		heartsText.setText("x " + lives);
		xpText.setText(coins);
		speedGame = 5;
		starGame = false;

		sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); ;
		overlayGroup = game.add.group()

		sceneGroup.add(overlayGroup)

		tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)

	}	

	function onClickPlay(){
		overlayGroup.y = -game.world.height
		TweenMax.to(idleEyes,0.5,{alpha:1});
		TweenMax.to(idleBody,1,{alpha:1,tint:0xb7b7b7,delay:1,onComplete:keepBallon});
		bgm = game.add.audio('wormwood')
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

	function createBallon(ColorSelect){

		globo = sceneGroup.create(game.width-50,game.height-200,"globo");
		globo.x = game.world.centerX
		globo.anchor.setTo(0,1);
		textGlobo = game.add.text(0, 0, ColorSelect, styleClock,sceneGroup);
		textGlobo.x = globo.x + globo.width/2;
		textGlobo.y = globo.y-globo.height/2;
		textGlobo.anchor.setTo(0.5,0.8);
		TweenMax.fromTo(globo.scale,0.5,{x:0,y:0},{x:1,y:1});
		TweenMax.fromTo(textGlobo.scale,0.5,{x:0,y:0},{x:1,y:1,delay:1});

	}

	function tutorial(){

	}

	function keepBallon(){
		createBallon(colorSelect);
	}	

	/*CREATE SCENE*/
	function createScene(){

		canTakeFruit = true

		sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel);
		loadSounds();

		game.physics.startSystem(Phaser.Physics.ARCADE);	
		game.physics.startSystem(Phaser.Physics.P2JS);

		var background = new Phaser.Graphics(game)
		background.beginFill(0x64e2ff)
		background.drawRect(0,0,game.world.width, game.world.height)
		background.endFill()
		sceneGroup.add(background);
		
		hand=game.add.sprite(0,0, "hand")
        hand.anchor.setTo(0.5,0.5);
        hand.scale.setTo(0.6,0.6);
        hand.animations.add('hand');
        hand.animations.play('hand', 5, false);
		
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin");
        coins.anchor.setTo(0.5);
        coins.scale.setTo(0.5);
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0;

		piso = game.add.tileSprite(0,game.height-150,game.width,150,"piso");
		sceneGroup.add(piso);
		tree = sceneGroup.create(game.world.centerX,0,"tree");
		tree.anchor.setTo(0.5,0.2);

		var idleGroup = game.add.group();
		idleBody = idleGroup.create(0, 0, 'idleBody');
		idleBody.y = game.height - idleBody.height * 1.14;
		var idleBodyAnimation = idleBody.animations.add('idleBodyAnimation');
		idleBody.animations.play('idleBodyAnimation', 24, true);
		idleBody.alpha = 0;

		idleEyes = idleGroup.create(0, 0, 'idleEyes');
		idleEyes.y = idleBody.y - idleBody.height/10;
		idleEyes.x = idleBody.x + idleBody.width/1.8;
		var idleEyesAnimation = idleEyes.animations.add('idleEyesAnimation');
		idleEyes.animations.play('idleEyesAnimation', 24, true);
		idleEyes.alpha = 0;
		idleGroup.x = game.world.centerX/2;

		var rightGroup = game.add.group();
		rightBody = rightGroup.create(0, 0, 'rightBody');
		rightBody.y = game.height - rightBody.height * 1.1;
		var rightBodyAnimation = rightBody.animations.add('rightBodyAnimation');
		rightBody.animations.play('rightBodyAnimation', 24, true);

		rightEyes = rightGroup.create(0, 0, 'rightEyes');
		rightEyes.y = rightBody.y - 10;
		rightEyes.x = rightBody.x + 30;
		var rightEyesAnimation = rightEyes.animations.add('rightEyesAnimation');
		rightEyes.animations.play('rightEyesAnimation', 24, true);
		rightGroup.alpha = 0;
		rightGroup.x = game.world.centerX/2;

		var wrongGroup = game.add.group();
		wrongBody = wrongGroup.create(0, 0, 'wrongBody');
		wrongBody.y = game.height - wrongBody.height * 1.1;
		var wrongBodyAnimation = wrongBody.animations.add('wrongBodyAnimation');

		wrongEyes = wrongGroup.create(0, 0, 'wrongEyes');
		wrongEyes.y = wrongBody.y - 20;
		wrongEyes.x = wrongBody.x + 170;
		var wrongEyesAnimation = wrongEyes.animations.add('wrongEyesAnimation');
		wrongGroup.alpha = 0;
		wrongGroup.x = game.world.centerX/2;		


		shadowLizar = sceneGroup.create(game.world.centerX/1.8,game.height-50,"shadowLizar");

		var colors = [
			0x196abc,
			0x6c4f0d,
			0x36c462,
			0xe08b28,
			0x9733e0,
			0xf21414
		]

		for(var i = 0;i<=5;i++){
			fruits[i] = sceneGroup.create(-500,0,"fruit" + i);
			fruits[i].id = i;
			fruits[i].anchor.setTo(0.5,0);
			fruits[i].color = colors[i];
			fruits[i].inputEnabled = true
			fruits[i].events.onInputDown.add(downFruit,this);
		}

		var indexNumber = new Array;
		var option1;
		var option2;
		var option3;


		option1 = [game.world.centerX/2,80];
		option2 = [game.world.centerX + game.width/4,80];
		option3 = [game.world.centerX,250];

		function createFruits(){
			for(var i = 0;i<=5;i++){
				fruits[i].y = -500;
			}

			for(var e = 0;e<=2;e++){
				indexNumber[e] = getRand();

			}
			fruits[indexNumber[0]].x = option1[0];
			fruits[indexNumber[1]].x = option2[0];
			fruits[indexNumber[2]].x = option3[0];

			TweenMax.to(fruits[indexNumber[0]],1,{y:option1[1],ease:Bounce.easeOut,delay:1});
			TweenMax.to(fruits[indexNumber[1]],1.2,{y:option2[1],ease:Bounce.easeOut,delay:1.2});
			TweenMax.to(fruits[indexNumber[2]],1.4,{y:option3[1],ease:Bounce.easeOut,delay:1.4});

			good = getRandomArbitrary(0,3);
			if(tutorial){
				hand.x=fruits[good].x;
				hand.y=fruits[good].y;
				for(var deactivate=0; deactivate<5; deactivate++){
					if(deactivate!=good){
						fruits[deactivate].inputEnabled=false;
					}
				}
			}
			colorSelect = colorsArray[fruits[indexNumber[good] ].id ];
			//console.log(colorSelect);

		}



		function downFruit(fruitItem){
			if(!canTakeFruit){
				return
			}
			canTakeFruit = false
			if(indexNumber[good] == fruitItem.id){
				rightBody.tint=fruitItem.color;
				TweenMax.to(fruitItem,1,{y:game.height - fruitItem.height,ease:Bounce.easeOut});
				TweenMax.to(idleBody,0.5,{tint:fruitItem.color,onComplete:winLizar});	
				sound.play("magic");
			}else{
				//wrongBody.animations.play('wrongBodyAnimation', 24, false);


				//idleGroup.alpha = 0;
				lives--;
				heartsText.setText("x " + lives);

				if(lives<=0){
					idleGroup.alpha = 0;
					wrongGroup.alpha = 1;
					wrongEyes.animations.play('wrongEyesAnimation', 24, false);
					wrongBody.animations.play('wrongBodyAnimation', 24, false);
					TweenMax.to(wrongBody,1,{alpha:0,onComplete:gameOver});	
					sound.play("gameLose");
					bgm.stop();
				}
				else{
					sound.play("wrong")
					//idleEyes.alpha = 0;
					//wrongIdleEyes.alpha = 1;
					globo.destroy();
					textGlobo.destroy();
					idleGroup.alpha = 0;
					wrongGroup.alpha = 1;
					wrongEyes.animations.play('wrongEyesAnimation', 24, false);
					wrongBody.animations.play('wrongBodyAnimation', 24, false);
					//wrongIdleEyes.animations.play('wrongEyesAnimation', 24, false);
					TweenMax.to(wrongBody,1,{alpha:0,onComplete:endwrong});	
				}	
			}
		}

		function endwrong(){
			//globo.destroy();
			//textGlobo.destroy();
			idleGroup.alpha = 0;
			wrongGroup.alpha = 0;
			//createFruits()
			for(var i = 0;i<=5;i++){
				fruits[i].y = -500;
			}
			TweenMax.to(idleGroup,1,{alpha:1,onComplete:newLizar,delay:0});
			//newLizar()
		}

		function winLizar(){
			globo.destroy();
			textGlobo.destroy();
			rightGroup.alpha = 1;
			idleGroup.alpha = 0;
			coins++;
			xpText.setText(coins)
			sound.play("combo");
			TweenMax.to(rightGroup,1,{alpha:1,onComplete:newLizar,delay:1});
		}

		function newLizar(){
			canTakeFruit = true

			rightGroup.alpha = 0;
			idleGroup.alpha = 1;
			createFruits();
			createBallon(colorSelect);
		}


		cursors = game.input.keyboard.createCursorKeys();


		createFruits();	
		createHearts();
		createCoins();
		createOverlay();
	}


	function gameOver(){
		var resultScreen = sceneloader.getScene("result")
		resultScreen.setScore(true, coins,gameIndex)
		sceneloader.show("result");
	}


	function moveObject(object){

	}	

	function update() {

	}

	return {
		assets: assets,
		name: "lizart",
		preload:preload,
		getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create:createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()