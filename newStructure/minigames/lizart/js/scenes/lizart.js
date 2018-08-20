var soundsPath = "../../shared/minigames/sounds/"
var imagePath = "images/lizart/"
var tutorialPath = "../../shared/minigames/"

var lizart = function(){

	assets = {
		atlases: [                
			{
				name: "atlas.lizart",
				json: "images/lizart/atlas.json",
				image: "images/lizart/atlas.png",
			},
			{   
				name: "atlas.tutorial",
				json: tutorialPath+"images/tutorial/tutorial_atlas.json",
				image: tutorialPath+"images/tutorial/tutorial_atlas.png"
			},
			{
				name: "atlas.time",
				json: "images/lizart/timeAtlas.json",
				image: "images/lizart/timeAtlas.png",
			},
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
				name:"back",
				file:imagePath +"back.png"
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
				file:imagePath + "sheets/hand.png",
				width:115,
				height:111,
				frames:5
			},
			{
				name:"coin",
				file:imagePath + "sheets/coin.png",
				width:122,
				height:123,
				frames:12
			},
			{
				name:"idleEyes_1",
				file:imagePath + "sheets/idle_ojos_1.png",
				width:142,
				height:135,
				frames:17
			},
			{
				name:"idleEyes_2",
				file:imagePath + "sheets/idle_ojos_2.png",
				width:128,
				height:150,
				frames:17
			},
			{
				name:"idleBody",
				file:imagePath + "sheets/idle.png",
				width:353,
				height:287,
				frames:17
			},
			{
				name:"rightEyes",
				file:imagePath + "sheets/rigth_ojos.png",
				width:308,
				height:313,
				frames:16
			},
			{
				name:"runBody",
				file:imagePath + "sheets/right.png",
				width:334,
				height:284,
				frames:22
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
			},
			{
				name:"eatingBody",
				file:imagePath + "sheets/eat.png",
				width:366,
				height:286,
				frames:19
			},
			{
				name:"eatingEyes1",
				file:imagePath + "sheets/eat_ojos_1.png",
				width:207,
				height:156,
				frames:19
			},
			{
				name:"eatingEyes2",
				file:imagePath + "sheets/eat_ojos_2.png",
				width:216,
				height:212,
				frames:19

			},
			{
				name:"runEyes_2",
				file:imagePath + "sheets/run_ojos_1.png",
				width:106,
				height:92,
				frames:22
			},
			{
				name:"runEyes_1",
				file:imagePath + "sheets/run_ojos_2.png",
				width:122,
				height:118,
				frames:22
			}
		],
		spines: [
			{
				name:"tongue",
				file:imagePath+"Spine/lengua.json"
			},
		]
	}
	var INITIAL_LIVES = 3

	var gameIndex = 28;
	var background;
	var sceneGroup = null;
	var heartsGroup = null;
	var UIGroup=null;
	var speedGame = 5;
	var tree;
	var piso;
	var POINT_TO_CHANGE_DIFICULTY=5
	var ALL_FRUITS=5;
	var wasCorrect;
	var heartsIcon;
	var dificultyTimer
	var score;
	var pointsBar
	var START_TIMING=300;
	var tutorial;
	var heartsText;	
	var GAP_BETWEEN_FRUITS=150;
	var functionTween, functionTime;
	var xpIcon;
	var xpText;
	var currentFruits=[]
	var cursors;
	var lives = 1;
	var passingLevel
	var INDEX_NUMBER=[0,1,2,3,4,5]
	var positionLizardX;
	var coins = 0;
	var fruitsDificulty;
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
	var positionStates=[]
	var allPositions;
	var POSITION_LIST_1=[
		{x:130,y:350},
		{x:200,y:200},
		{x:450,y:450},
		{x:350,y:250},
		{x:270,y:390},
		{x:500,y:180}
	];
	var POSITION_LIST_2=[
		{x:490,y:210},
		{x:240,y:350},
		{x:400,y:400},
		{x:100,y:390},
		{x:350,y:220},
		{x:150,y:220}
	];
	var POSITION_LIST_3=[
		{x:300,y:430},
		{x:340,y:270},
		{x:440,y:420},
		{x:490,y:250},
		{x:150,y:230},
		{x:130,y:400}
	];
	var pasing=[];
	var hand, coin, timeBar, clock; 
	var globo, textGlobo;
	var idleBody, idleEyes_1, idleEyes_2;
	var wrongIdleEyes, wrongEyes;	
	var rightBody, rightEyes_1, rightEyes_2;
	var wrongBody;
	var eatingBodys, eatingEyes_1, eatingEyes_2;
	var tongue;
	var shadowLizar;
	var tweenTiempo;
	var good, wrong, stars;
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

	function loadSounds(){
		sound.decode(assets.sounds)
	}
	function initialize(){
		lives = INITIAL_LIVES;
		coins = 0;
		canTakeFruit = true;
		passingLevel=true;
		wasCorrect=false;
		heartsText.setText("x " + lives);;
		xpText.setText(coins);
		speedGame = 5;
		starGame = false;
	}	

	function getRandomArbitrary(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	function createOverlay(){
		lives = INITIAL_LIVES;
		coins = 0;
		speedGame = 5;
		starGame = false;
		pasing=[null]
		sceneGroup = game.add.group(); 
		yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); ;
		overlayGroup = game.add.group()

		createHearts();
		createPointsBar();

		hand=game.add.sprite(0,0, "hand")
		hand.anchor.setTo(0.5,0.5);
		hand.scale.setTo(1,1);
		hand.alpha=0;
		hand.animations.add('hand');
		hand.animations.play('hand', 5, true);
		sceneGroup.add(hand)

		coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin");
		coins.anchor.setTo(0.5);
		coins.scale.setTo(0.5);
		coins.animations.add('coin');
		coins.animations.play('coin', 24, true);
		coins.alpha=0;
		sceneGroup.add(coins)

		sceneGroup.add(overlayGroup)

		tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)

	}
	function createHearts(){

		heartsGroup = game.add.group()
		heartsGroup.y = 10
		sceneGroup.add(heartsGroup)

		var pivotX = 10
		var group = game.add.group()
		group.x = pivotX
		heartsGroup.add(group)

		var heartImg = group.create(0,0,'atlas.lizart','hearts')

		pivotX+= heartImg.width * 0.45

		var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
		pointsText.x = pivotX
		pointsText.y = heartImg.height * 0.15
		pointsText.setText('X ' + lives)
		heartsGroup.add(pointsText)

		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

		heartsGroup.text = pointsText

	}

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.lizart','xpcoins')
		pointsImg.anchor.setTo(1,0)

		var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
		pointsText.x = -pointsImg.width * 0.45
		pointsText.y = pointsImg.height * 0.25
		pointsBar.add(pointsText)

		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

		pointsBar.text = pointsText
		pointsBar.number = 0

	}

	function onClickPlay(){
		overlayGroup.y = -game.world.height
		TweenMax.to(idleEyes_1,0.5,{alpha:1});
		TweenMax.to(idleEyes_2,0.5,{alpha:1});
		TweenMax.to(idleBody,1,{alpha:1,tint:0xb7b7b7,delay:1,onComplete:keepBallon});
		bgm = game.add.audio('wormwood')
		game.sound.setDecodedCallback(bgm, function(){
		}, this);
		bgm.loopFull(0.5);
		starGame = true;
		buttons.getButton(bgm,sceneGroup)
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
		TweenMax.fromTo(textGlobo.scale,0.5,{x:0,y:0},{x:1,y:1,delay:0.5});
		if(tutorial){
			hand.alpha=1
			fruits[INDEX_NUMBER[good]].inputEnabled=true;
			hand.x=fruits[INDEX_NUMBER[good]].x+50;
			hand.y=fruits[INDEX_NUMBER[good]].y+50;
		}
	}

	function keepBallon(){
		createBallon(colorSelect);
	}	

	/*CREATE SCENE*/


	function createScene(){

		canTakeFruit = true
		tutorial=true;
		score=0;
		wasCorrect=true;
		fruitsDificulty=3;
		dificultyTimer=30000;

		sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel);
		loadSounds();

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.startSystem(Phaser.Physics.P2JS);

		var background = new Phaser.Graphics(game)
		background.beginFill(0x64e2ff)
		background.drawRect(0,0,game.world.width, game.world.height)
		background.endFill()
		sceneGroup.add(background);

		back = game.add.tileSprite(0,0,game.world.width,game.world.height,"back");
		sceneGroup.add(back);

		var colors = [
			0x196abc,
			0x6c4f0d,
			0x36c462,
			0xe08b28,
			0x9733e0,
			0xf21414
		]
		tongue=game.add.spine(0,0,"tongue");
		tongue.setSkinByName("normal");
		tongue.alpha=0;
		sceneGroup.add(tongue)

		for(var i = 0;i<=ALL_FRUITS;i++){
			fruits[i] = sceneGroup.create(-500,0,"fruit" + i);
			fruits[i].id = i;
			fruits[i].anchor.setTo(0.5,0.5);
			fruits[i].color = colors[i];
			fruits[i].inputEnabled = true
			fruits[i].events.onInputDown.add(chooseFruit,this);
		}
		idleGroup = game.add.group();
		idleBody = idleGroup.create(0, 0, 'idleBody');
		idleBody.y = game.height -170;
		idleBody.x = game.world.centerX-140;
		idleBodyAnimation = idleBody.animations.add('idleBodyAnimation');
		idleBody.animations.play('idleBodyAnimation', 24, true);
		idleBody.alpha = 0;
		idleBody.anchor.setTo(0.5,0.5);

		idleEyes_2 = idleGroup.create(0, 0, 'idleEyes_2');
		idleEyes_2.y = idleBody.y-40;
		idleEyes_2.x = idleBody.x + 130;
		idleEyesAnimation2 = idleEyes_2.animations.add('idleEyesAnimation2');
		idleEyes_2.animations.play('idleEyesAnimation2', 24, true);
		idleEyes_2.alpha = 0;
		idleEyes_2.anchor.setTo(0.5,0.5);
		idleGroup.x = game.world.centerX/2;
		idleBody.bringToTop();

		idleEyes_1 = idleGroup.create(0, 0, 'idleEyes_1');
		idleEyes_1.y = idleBody.y -20;
		idleEyes_1.x = idleBody.x +70;
		idleEyes_1.anchor.setTo(0.5,0.5);
		idleEyesAnimation1 = idleEyes_1.animations.add('idleEyesAnimation');
		idleEyes_1.animations.play('idleEyesAnimation', 24, true);
		idleEyes_1.alpha = 0;

		rightGroup = game.add.group();
		rightBody = rightGroup.create(0, 0, 'runBody');
		rightBody.y = game.height -170;
		rightBody.x = game.world.centerX-140;
		rightBodyAnimation = rightBody.animations.add('rightBodyAnimation');
		rightBody.animations.play('rightBodyAnimation', 24, true);
		rightBody.anchor.setTo(0.5,0.5);
		rightBody.tint=0xb7b7b7;

		rightEyes_2 = rightGroup.create(0, 0, 'runEyes_2');
		rightEyes_2.y = rightBody.y - 80;
		rightEyes_2.x = rightBody.x + 100;
		rightEyes_2.anchor.setTo(0.5,0.5);
		rightEyesAnimation_2 = rightEyes_2.animations.add('rightEyesAnimation_2');
		rightEyes_2.animations.play('rightEyesAnimation_2', 24, true);
		rightGroup.alpha = 0;
		rightGroup.x = game.world.centerX/2;
		rightBody.bringToTop();

		rightEyes_1 = rightGroup.create(0, 0, 'runEyes_1');
		rightEyes_1.y = rightBody.y - 40;
		rightEyes_1.x = rightBody.x + 50;
		rightEyes_1.anchor.setTo(0.5,0.5);
		rightEyesAnimation_1 = rightEyes_1.animations.add('rightEyesAnimation_1');
		rightEyes_1.animations.play('rightEyesAnimation_1', 24, true);
		rightGroup.x = game.world.centerX/2;

		wrongGroup = game.add.group();
		wrongBody = wrongGroup.create(0, 0, 'wrongBody');
		wrongBody.y = game.height - wrongBody.height * 1.1;
		wrongBodyAnimation = wrongBody.animations.add('wrongBodyAnimation');

		wrongEyes = wrongGroup.create(0, 0, 'wrongEyes');
		wrongEyes.y = wrongBody.y - 20;
		wrongEyes.x = wrongBody.x + 170;
		wrongEyesAnimation = wrongEyes.animations.add('wrongEyesAnimation');
		wrongGroup.alpha = 0;
		wrongGroup.x = game.world.centerX/2;		

		eatingGroup = game.add.group();

		eatingBodys = eatingGroup.create(0, 0, 'eatingBody');
		eatingBodys.y =game.height -170;
		eatingBodys.x = game.world.centerX-140;
		eatingBodyAnimation = eatingBodys.animations.add('eatingBodyAnimation');
		eatingBodys.alpha = 1;
		eatingBodys.anchor.setTo(0.5,0.5)
		eatingBodys.tint=0xb7b7b7;

		tongue.x=eatingBodys.x+50;
		tongue.y=eatingBodys.y-80;
		tongue.alpha=1;
		eatingGroup.add(tongue)

		eatingEyes_2 = eatingGroup.create(0, 0, 'eatingEyes2');
		eatingEyes_2.y = eatingBodys.y - 10;
		eatingEyes_2.x = eatingBodys.x + 90;
		eatingEyes_2.alpha=1
		eatingEyes_2.anchor.setTo(0.5,0.5)
		eatingEyesAnimation2 = eatingEyes_2.animations.add('eatingEyesAnimation2');

		eatingGroup.x = game.world.centerX/2;	
		eatingGroup.alpha=0

		eatingBodys.bringToTop();

		eatingEyes_1 = eatingGroup.create(0, 0, 'eatingEyes1');
		eatingEyes_1.y = eatingBodys.y - 20;
		eatingEyes_1.x = eatingBodys.x;
		eatingEyesAnimation1 = eatingEyes_1.animations.add('eatingEyesAnimation1');
		eatingEyes_1.alpha = 1;
		eatingEyes_1.anchor.setTo(0.5,0.5)
		eatingGroup.x = game.world.centerX/2;	

		//eatingGroup.alpha=1;
		UIGroup= game.add.group();
		sceneGroup.add(UIGroup)
		positionTimer()

		shadowLizar = sceneGroup.create(game.world.centerX/1.8,game.height-50,"shadowLizar");

		var options=[];

		cursors = game.input.keyboard.createCursorKeys();
		createFruits();	
		createOverlay();
	}

	function checkPositionList(options){
		displayFruits(options)
	}
	function createFruits(){

		var options;
		var selectList=game.rnd.integerInRange(1,3);
		if(selectList==1){
			options=POSITION_LIST_1;
		}else if(selectList==2){
			options=POSITION_LIST_2;
		}else if(selectList==3){
			options=POSITION_LIST_3;
		}

		pasing=[];

		Phaser.ArrayUtils.shuffle(options)
		for(var i = 0;i<=ALL_FRUITS;i++){
			pasing[i]={x:0,y:0};
			fruits[i].y = -500;
			fruits[i].scale.setTo(0.7,0.7);
			fruits[i].anchor.setTo(0.5,0.5);
			fruits[i].inputEnabled=true;
		}
		Phaser.ArrayUtils.shuffle(INDEX_NUMBER)
		for(var e = 0;e<fruitsDificulty;e++){
			fruits[INDEX_NUMBER[e]].x = options[e].x;
		}
		good = getRandomArbitrary(0,fruitsDificulty);
		colorSelect = colorsArray[fruits[INDEX_NUMBER[good] ].id ];
		checkPositionList(options)
	}
	function nextDificultyApearFruit(options){
		var fruitToAppear=game.rnd.integerInRange(0,ALL_FRUITS);
		var position=game.rnd.integerInRange(0,options.length-1);
		while(fruits[INDEX_NUMBER[fruitToAppear]].y>0 && pasing[fruitToAppear].x!=0){
			fruitToAppear=game.rnd.integerInRange(0,ALL_FRUITS);
		}
		fruits[INDEX_NUMBER[fruitToAppear]].inputEnabled=true
		fruits[INDEX_NUMBER[fruitToAppear]].x=options[fruitToAppear].x;
		fruits[INDEX_NUMBER[fruitToAppear]].alpha=1;
		TweenMax.to(fruits[INDEX_NUMBER[fruitToAppear]],1,{y:options[fruitToAppear].y,ease:Bounce.easeOut,delay:0});

		game.time.events.add(1000,function(){
			pasing[fruitToAppear].x=options[fruitToAppear].x;
			pasing[fruitToAppear].y=options[fruitToAppear].y;
			dificultyDisappearingAndApearing(options)
		})
	}
	function positionTimer(){

		clock=game.add.image(game.world.centerX-150,60,"atlas.time","clock")
		clock.scale.setTo(.7)
		timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
		timeBar.scale.setTo(8,.45)
		timeBar.alpha=1;
		clock.alpha=1;
		UIGroup.add(clock);
		UIGroup.add(timeBar);
		UIGroup.alpha=0;
	}
	function nextDificultyDissaperFruit(options){
		var fruitToDissapear=game.rnd.integerInRange(0,ALL_FRUITS);
		while(fruits[INDEX_NUMBER[fruitToDissapear]].y<0){
			fruitToDissapear=game.rnd.integerInRange(0,ALL_FRUITS);
		}
		fruits[INDEX_NUMBER[fruitToDissapear]].inputEnabled=false
		game.add.tween(fruits[INDEX_NUMBER[fruitToDissapear]]).to({alpha:0},500,Phaser.Easing.Cubic.In,true).onComplete.add(function(){
			fruits[INDEX_NUMBER[fruitToDissapear]].y=-500;
			nextDificultyApearFruit(options);
		})
	}
	function dificultyDisappearingAndApearing(options){
		functionTime=game.time.events.add(1000,function(){
			if(!passingLevel)nextDificultyDissaperFruit(options);
		});
	}
	function appearFruit(options,optionToPlace,optionId,functionTween){
		functionTween=game.add.tween(fruits[INDEX_NUMBER[optionId]]).to({alpha:1},300,Phaser.Easing.Cubic.In,true).onComplete.add(function(){
			fruits[INDEX_NUMBER[optionId]].x=options[optionToPlace].x;
			fruits[INDEX_NUMBER[optionId]].y=options[optionToPlace].y;
			pasing[optionToPlace].x=options[optionToPlace].x;
			pasing[optionToPlace].y=options[optionToPlace].y;
			dificultyDisappearingAndApearing(options);
		});
	}
	function displayFruits(options){
		for(var tweenFruits=0; tweenFruits<fruitsDificulty; tweenFruits++){
			fruits[INDEX_NUMBER[tweenFruits]].alpha=1;
			pasing[tweenFruits]=options[tweenFruits];
			TweenMax.to(fruits[INDEX_NUMBER[tweenFruits]],tweenFruits*0.5+1,{y:options[tweenFruits].y,ease:Bounce.easeOut,delay:0});
		}

		passingLevel=false;
		if(score>=POINT_TO_CHANGE_DIFICULTY-2){
			UIGroup.alpha=1;
		}
		if(score>=POINT_TO_CHANGE_DIFICULTY){
			dificultyDisappearingAndApearing(options);
		}else{
			return
		}
		if(pointsBar.number%POINT_TO_CHANGE_DIFICULTY==0 && pointsBar.number!=0 && pointsBar.number!=1){
			if(fruitsDificulty<5)fruitsDificulty++;
		}
		console.log(dificultyTimer)
		startTimer(dificultyTimer);
	}
	function correctFruit(fruitItem){
		passing=true;
		globo.destroy();
		textGlobo.destroy();
		if(dificultyTimer>5000)dificultyTimer=dificultyTimer-1000;
		if(idleGroup.x>fruitItem.x){

			eatingGroup.scale.setTo(1,1);
			rightGroup.scale.setTo(1,1);
		}
		canTakeFruit = false

		hand.alpha=0;
		for(var deactivate=0; deactivate<ALL_FRUITS; deactivate++){
			fruits[deactivate].inputEnabled=false;
		}
		positionLizardX=idleGroup.x;
		tutorial=false;
		eatingGroup.x=fruitItem.x-200;
		idleGroup.alpha=0;
		rightGroup.alpha=1;
		game.add.tween(shadowLizar).to({x:fruitItem.x-200},500,Phaser.Easing.Cubic.In,true)
		game.add.tween(rightGroup).to({x:fruitItem.x-200},500,Phaser.Easing.Cubic.In,true).onComplete.add(function(){

			idleGroup.alpha=0;
			rightGroup.alpha=0;
			idleGroup.x=positionLizardX;
			eatingGroup.alpha=1;
			rightBody.tint=fruitItem.color;

			eatingBodys.alpha=1;
			eatingBodys.animations.play('eatingBodyAnimation', 24, false)
			eatingEyes_1.animations.play('eatingEyesAnimation1', 24, false);
			eatingEyes_2.animations.play('eatingEyesAnimation2', 24, false);
			tongue.alpha=1;
			tongue.setAnimationByName(0,"lengua",false)

			game.time.events.add(150,function(){
				TweenMax.to(fruitItem,0.8,{y:game.height - fruitItem.height,ease:Bounce.easeOut});
				game.add.tween(fruitItem.scale).to({x:0,y:0},390,Phaser.Easing.Cubic.In,true)
				game.add.tween(fruitItem).to({x:eatingGroup.x+300,y:idleEyes_1.y+50},350,Phaser.Easing.Cubic.In,true).onComplete.add(function(){
					eatingGroup.scale.setTo(1,1);
					idleGroup.scale.setTo(1,1);
					rightGroup.scale.setTo(1,1);
					tongue.alpha=0;
					winLizar();
					eatingBodys.tint=fruitItem.color;
					sound.play("magic");
				});
			})
		});
	}

	function wrongFruit(){
		//wrongBody.animations.play('wrongBodyAnimation', 24, false);
		globo.destroy();
		textGlobo.destroy();
		//idleGroup.alpha = 0;
		for(var deactivate=0; deactivate<ALL_FRUITS; deactivate++){
			fruits[deactivate].inputEnabled=false;
		}
		missPoint()

		if(lives<=0){
			idleGroup.alpha = 0;
			wrongGroup.alpha = 1;
			wrongEyes.animations.play('wrongEyesAnimation', 24, false);
			wrongBody.animations.play('wrongBodyAnimation', 24, false);
			//					TweenMax.to(wrongBody,1,{alpha:0,onComplete:stopGame});	
			bgm.stop();
		}
		else{
			sound.play("wrong")
			idleGroup.alpha = 0;
			wrongGroup.alpha = 1;
			wrongEyes.animations.play('wrongEyesAnimation', 24, false);
			wrongBody.animations.play('wrongBodyAnimation', 24, false);
			TweenMax.to(wrongBody,1,{alpha:0,onComplete:endwrong});	
		}	
		canTakeFruit = false
	}
	function chooseFruit(fruitItem){
		passingLevel=true;
		if(tweenTiempo)stopTimer();
		if(functionTime)functionTime.clearEvents=true;
		if(INDEX_NUMBER[good] == fruitItem.id && canTakeFruit){
			correctFruit(fruitItem);
		}else if(INDEX_NUMBER[good] != fruitItem.id && !tutorial && canTakeFruit){
			wrongFruit();
		}
	}
	function endwrong(){
		idleGroup.alpha = 0;
		wrongGroup.alpha = 0;
		for(var i = 0;i<=ALL_FRUITS;i++){
			fruits[i].y = -500;
		}
		TweenMax.to(idleGroup,1,{alpha:1,onComplete:newLizar,delay:0});
	}

	function winLizar(){
		Coin(rightGroup,pointsBar,50)
		eatingGroup.alpha=0;
		wasCorrect=true;
		game.add.tween(shadowLizar).to({x:game.world.width+100},1200,Phaser.Easing.linear,true);
		game.add.tween(rightGroup).to({x:game.world.width+100},1200,Phaser.Easing.linear,true);
		globo.destroy();
		textGlobo.destroy();
		rightGroup.alpha = 1;
		idleGroup.alpha = 0;
		sound.play("combo");
		TweenMax.to(rightGroup,1,{alpha:1,onComplete:newLizar,delay:1});
	}

	function newLizar(){
		canTakeFruit = true

		rightBody.tint=0xb7b7b7;
		eatingBodys.tint=0xb7b7b7;
		globo.destroy();
		if(wasCorrect){
			shadowLizar.x=-200;
			rightGroup.x=-200;
			game.add.tween(shadowLizar).to({x:game.world.centerX/1.6, y:game.height-50},500,Phaser.Easing.linear,true);
			game.add.tween(rightGroup).to({x: game.world.centerX/2},500,Phaser.Easing.linear,true).onComplete.add(function(){
				idleGroup.alpha = 1;
				rightGroup.alpha = 0;
			});
			wasCorrect=false;
		}
		createFruits();
		createBallon(colorSelect);
	}

	function addNumberPart(obj,number){

		var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

		var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
		pointsText.x = obj.world.x
		pointsText.y = obj.world.y
		pointsText.anchor.setTo(0.5,0.5)
		sceneGroup.add(pointsText)

		game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
		game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)

		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

	}
	function missPoint(){

		sound.play("wrong")
		lives--;
		heartsGroup.text.setText('X ' + lives)

		var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		})

		if(lives === 0){
			stopGame(false)
		}

		addNumberPart(heartsGroup.text,'-1')
	}	

	function stopGame(win){

		gameActive = false	
		bgm.stop()
		sound.play("gameLose")
		var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Sinusoidal.In, true, 1500)
		tweenScene.onComplete.add(function(){

			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number, gameIndex)

			//amazing.saveScore(pointsBar.number)
			sceneloader.show("result")

		})
	}
	function addPoint(number){

		sound.play("magic")
		pointsBar.number+=number;
		score++;
		pointsBar.text.setText(pointsBar.number)

		var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		})
		addNumberPart(pointsBar.text,'+' + number)
	}

	function Coin(objectBorn,objectDestiny,time){
		coins.x=objectBorn.centerX
		coins.y=objectBorn.centerY
		game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
		game.add.tween(coins).to({y:objectBorn.centerY-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
			game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
			game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
				coins.x=objectBorn.centerX
				coins.y=objectBorn.centerY
				addPoint(1)
				score++;
			})
		})
	}

	function stopTimer(){
		if(lives>0){
			tweenTiempo.stop()
			tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, START_TIMING, Phaser.Easing.Linear.Out, true)
		}
	}
	function startTimer(time){
		tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true)
		tweenTiempo.onComplete.add(function(){
			passingLevel=true;
			if(functionTime)functionTime.clearEvents=true;
			wrongFruit();
			stopTimer();
		})
	}

	return {
		assets: assets,
		name: "lizart",
		getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create:createScene,
		show: function(event){
			initialize();
		}			
	}
}()