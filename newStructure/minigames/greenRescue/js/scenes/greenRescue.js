
var soundsPath = "../../shared/minigames/sounds/"
var particlesPath="../../shared/minigames/images/particles/battle/"
var tutorialPath = "../../shared/minigames/"

var greenRescue = function(){

	var localizationData = {
		"EN":{
			"howTo":"How to Play?",
			"moves":"Moves left",
			"stop":"Stop!"
		},

		"ES":{
			"moves":"Movimientos extra",
			"howTo":"¿Cómo jugar?",
			"stop":"¡Detener!"
		}
	}


	assets = {
		atlases: [
			{   
				name: "atlas.green",
				json: "images/green/atlas.json",
				image: "images/green/atlas.png",
			},
			{   
				name: "atlas.time",
				json: "images/green/timeAtlas.json",
				image: "images/green/timeAtlas.png",
			},

		],
		images: [
			{
				name:"tutorial_image",
				file:"images/green/tutorial_image.png"
			}
		],
		sounds: [
			{	name: "magic",
			 file: soundsPath + "magic.mp3"},
			{	name: "cut",
			 file: soundsPath + "cut.mp3"},
			{	name: "wrong",
			 file: soundsPath + "wrong.mp3"},
			{	name: "explosion",
			 file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
			 file: soundsPath + "pop.mp3"},
			{	name: "shoot",
			 file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
			 file: soundsPath + "gameLose.mp3"},
			{	name: "water",
			 file: soundsPath + "sprinkler.mp3"},
			{	name: "swipe",
			 file: soundsPath + "swipe.mp3"},
			{	name: "plant",
			 file: soundsPath + "splashMud.mp3"},
			{	name: "morning",
			 file: soundsPath + "songs/forestAmbience.mp3"},
			{	name: "night",
			 file: soundsPath + "owl.mp3"},
			{	name: "danced",
			 file: soundsPath + "songs/jungle_fun.mp3"},
			{	name: "hole",
			 file: soundsPath + "flesh.mp3"},
			{	name: "combo",
			 file: soundsPath + "combo.mp3"},
			{	name: "cog",
			 file: soundsPath + "cog.mp3"},
			{	name: "cheers",
			 file: soundsPath + "cheers.mp3"},
			

		],
		jsons: [
			{
				name: 'pickedEnergy', 
				file: 'particles/battle/pickedEnergy/specialBar1.json'
			}
		],
		spritesheets: [
			{
				name:"hand",
				file:"images/Spine/hand/hand.png",
				width:115,
				height:111,
				frames:5
			},
			{
				name:"coin",
				file:"images/Spine/coin/coin.png",
				width:122,
				height:123,
				frames:12
			},
			{
				name:"sprinkler",
				file:'images/Spine/sprinkler/sprinker.png',
				width:272,
				height:305,
				frames:23
			},
			{
				name:"can",
				file:'images/Spine/trashcan/trashcan.png',
				width:162,
				height:260,
				frames:24
			},
		],
		spines: [
			{
				name:"floor",
				file:"images/Spine/Floor/floor.json"
			},
			{
				name:"trash",
				file:"images/Spine/Trash/trash.json"
			},
			{
				name:"trees",
				file:"images/Spine/Trees/trees.json"
			},
			{
				name:"nao",
				file:"images/Spine/Yogotars/nao.json"
			},
			{
				name:"justice",
				file:"images/Spine/Yogotars/justice.json"
			},
			{
				name:"estrella",
				file:"images/Spine/Yogotars/estrella.json"
			},

		],
	}


	var lives = null
	var sceneGroup = null
	var background
	var gameActive
	var particlesGroup, particlesUsed
	var gameIndex = 124
	var indexGame
	var overlayGroup
	var coinsGroup=null
	var morning,night, danced
	var velocidadNubes=4
	var backgroundGroup=null
	var clock, timeBar,tweenTiempo;
	var activeObj;
	var proxy=new Array(9);
	var iconic=new Array(9);
	var trash=new Array(9);
	var tree=new Array(9);
	var estados=new Array(9);
	var readyToPlant=new Array(9);
	var readyToWater=new Array(9);
	var animations=new Array(7);
	var animatedSprinklers=new Array(9)
	var broomIcon, shovelIcon, sprinklerIcon, sproutIcon, board
	var shovel,broom, sprinkler, sprout, shovelProxy, sprinklerProxy, sproutProxy
	var hole=[]
	var objectOverlaping;
	var tutorialState
	var dificulty;
	var tutorial
	var checked, allClean,canPlant;
	var tweenIcon=new Array(9);
	var colora1,colora2,colora3;
	var colorb1,colora2,colora3;
	var bmd, gradient
	var nao, estrella, justice;
	var hand
	var tutorialTween
	var out, passingLevel;
	var y
	var sumX,sumY
	var sunAct,moonAct;
	var emitter
	var index
	var coinS


	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		for(var falseStates=0;falseStates<estados.length;falseStates++){
			estados[falseStates]=0;
			proxy[falseStates].tag=falseStates
			readyToPlant[falseStates]=false;
			readyToWater[falseStates]=false;
		}
		passingLevel=false;
		index=0;
		animations[0]="BAG";
		animations[1]="BOMB";
		animations[2]="BOX";
		animations[3]="CASSETS";
		animations[4]="SODA";
		animations[5]="TIRE";
		animations[6]="TV";

		transition=0
		canPlant=false;
		emitter="";
		tutorial=true;
		tutorialState=0;
		sunAct=false
		moonAct=false
		checked=0;
		allClean=0;
		dificulty=3;
		gameActive=true
		velocidadNubes=4;
		lives = 3
		sumX=1
		sumY=1

		loadSounds()
	}

	function popObject(obj,delay){

		game.time.events.add(delay,function(){

			sound.play("cut")
			obj.alpha = 1
			game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
		},this)
	}

	function animateScene() {
		var startGroup = new Phaser.Group(game)
		sceneGroup.add(startGroup)

		sceneGroup.alpha = 0
		game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
	}

	function changeImage(index,group){
		for (var i = 0;i< group.length; i ++){
			group.children[i].alpha = 0
			if( i == index){
				group.children[i].alpha = 1
			}
		}
	} 

	function addNumberPart(obj,number,isScore){

		var pointsText = lookParticle('text')
		if(pointsText){

			pointsText.x = obj.world.x
			pointsText.y = obj.world.y
			pointsText.anchor.setTo(0.5,0.5)
			pointsText.setText(number)
			pointsText.scale.setTo(1,1)

			var offsetY = -100

			pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

			deactivateParticle(pointsText,800)
			if(isScore){

				pointsText.scale.setTo(0.7,0.7)
				var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
				tweenScale.onComplete.add(function(){
					game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
				})

				offsetY = 100
			}

			game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
			game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
		}
	}

	function missPoint(){

		sound.play("wrong")

		lives--;
		heartsGroup.text.setText('X ' + lives)

		var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		})

		if(lives == 0){
			stopGame(false)
		}

		addNumberPart(heartsGroup.text,'-1',true)

	}

	function addPoint(number){

		sound.play("magic")
		pointsBar.number+=number;
		pointsBar.text.setText(pointsBar.number)

		var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		})

		addNumberPart(pointsBar.text,'+' + number,true)		

	}

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.green','xpcoins')
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

	function createHearts(){

		heartsGroup = game.add.group()
		heartsGroup.y = 10
		sceneGroup.add(heartsGroup)


		var pivotX = 10
		var group = game.add.group()
		group.x = pivotX
		heartsGroup.add(group)

		var heartImg = group.create(0,0,'atlas.green','life_box')

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

	function stopGame(win){

		sound.play("wrong")
		sound.play("gameLose")

		gameActive = false
		if(sunAct){
			morning.stop()
		}else{
			night.stop()
		}
		tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
			sceneloader.show("result")
		})
	}


	function preload(){
		epicparticles.loadEmitter(game.load, "pickedEnergy")
	}

	function createOverlay(){

		overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
		sceneGroup.add(overlayGroup)

		tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
	}

	function onClickPlay(){
		sunAct=true
		startGame=true
		coinsGroup= new Phaser.Group(game)
		sceneGroup.add(coinsGroup)
		coinsGroup.add(coinS)
		game.time.events.add(1250, function(){
			putTrash();
		});
		overlayGroup.y = -game.world.height
	}

	function releaseButton(obj){

		obj.parent.children[1].alpha = 1
	}

	function createBackground(){

		backgroundGroup = game.add.group()
		sceneGroup.add(backgroundGroup)


		colora1=0x398270;
		colorb1=0xf5e46e;
		colora2=0x386277;
		colorb2=0x398270;

		tutorial=true;

		//Grupo de estrellas

		starsGroup=game.add.group();
		sceneGroup.add(starsGroup);

		//Grupo de nubes

		cloudsGroup=game.add.group();
		sceneGroup.add(cloudsGroup);



		platformGroup=game.add.group();
		sceneGroup.add(platformGroup)

		UIGroup=game.add.group();
		sceneGroup.add(UIGroup);

		thrashGroup=game.add.group();
		sceneGroup.add(thrashGroup);

		//Aqui inicializo los botones
		controles=game.input.keyboard.createCursorKeys()

		correctParticle = createPart("star");
		sceneGroup.add(correctParticle);
		boomParticle = createPart("smoke");
		sceneGroup.add(boomParticle);


		//		//Coins
		//		coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
		//		coins.anchor.setTo(0.5)
		//		coins.scale.setTo(0.5)
		//		coins.animations.add('coin');
		//		coins.animations.play('coin', 24, true);
		//		coins.alpha=0

		//Colocamos el escenario

		out = [];

		bmd = game.add.bitmapData(game.world.width, game.world.height);
		gradient=bmd.addToWorld();

		bmd2 = game.add.bitmapData(game.world.width, game.world.height);
		gradient2=bmd2.addToWorld();

		bmd3 = game.add.bitmapData(game.world.width, game.world.height);
		gradient3=bmd3.addToWorld();

		y = 0;

		for (var i = 0; i < 400; i++)
		{

			var c = Phaser.Color.interpolateColor(colora1, colorb1, 400, i);
			var c2 = Phaser.Color.interpolateColor(colora2, colorb2, 400, i);

			// console.log(Phaser.Color.getWebRGB(c));

			bmd.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c));
			bmd2.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c2));

			out.push(Phaser.Color.getWebRGB(c));
			out.push(Phaser.Color.getWebRGB(c2));

			y += 2;
		}
		backgroundGroup.add(gradient)
		backgroundGroup.add(gradient2)
		gradient2.alpha=0

		sun=game.add.sprite(-200,game.world.centerY+300,"atlas.green","SUN");
		moon=game.add.sprite(sun.x,game.world.centerY+300,"atlas.green","MOON");



		clouds1=game.add.sprite(0,game.rnd.integerInRange(0,game.world.height),"atlas.green","CLOUD");
		clouds2=game.add.sprite(0,game.rnd.integerInRange(0,game.world.height),"atlas.green","CLOUD");
		clouds3=game.add.sprite(0,game.rnd.integerInRange(0,game.world.height),"atlas.green","CLOUD");
		clouds4=game.add.sprite(0,game.rnd.integerInRange(0,game.world.height),"atlas.green","CLOUD");

		clouds1.anchor.setTo(0.5)
		clouds2.anchor.setTo(0.5)
		clouds3.anchor.setTo(0.5)
		clouds4.anchor.setTo(0.5)

		cloudsGroup.add(clouds1)
		cloudsGroup.add(clouds2)
		cloudsGroup.add(clouds3)
		cloudsGroup.add(clouds4)
		backgroundGroup.add(sun)
		backgroundGroup.add(moon)

		hand=game.add.sprite(0,0, "hand")
		hand.anchor.setTo(0.5,0.5);
		hand.scale.setTo(1,1);
		hand.alpha=0;
		hand.animations.add('hand');
		hand.animations.play('hand', 3, false);
		sceneGroup.add(hand)

		stars=game.add.tileSprite(0,10,game.world.width,game.world.height/7.7,'atlas.green',"STARS")
		starsGroup.add(stars)
		starsGroup.alpha=1

		board=game.add.sprite(game.world.centerX,game.world.height-90,"atlas.green","BOARD")
		board.anchor.setTo(0.5,0.5)
		board.width=650

		broomIcon=game.add.sprite(board.centerX-230,board.centerY,"atlas.green","ICON_BROOM");
		shovelIcon=game.add.sprite(board.centerX-100,board.centerY,"atlas.green","ICON SHOVEL");
		sprinklerIcon=game.add.sprite(board.centerX+180,board.centerY,"atlas.green","ICON SPRINKLER");
		sproutIcon=game.add.sprite(board.centerX+30,board.centerY,"atlas.green","ICON SPROUT");


		broomIcon.anchor.setTo(0.5,0.5)
		shovelIcon.anchor.setTo(0.5,0.5)
		sprinklerIcon.anchor.setTo(0.5,0.5)
		sproutIcon.anchor.setTo(0.5,0.5)

		broom=game.add.sprite(broomIcon.x,broomIcon.y,"atlas.green","BROOM")
		shovel=game.add.sprite(shovelIcon.x,shovelIcon.y,"atlas.green","SHOVEL")
		sprinkler=game.add.sprite(sprinklerIcon.x,sprinklerIcon.y,"atlas.green","SPRINKLER")
		sprout=game.add.sprite(sproutIcon.x,sproutIcon.y,"atlas.green","SPROUT")

		sprinkler.anchor.setTo(.8)
		sprinkler.scale.setTo(1)

		broomProxy=game.add.sprite(board.centerX-230,board.centerY,"atlas.green","BROOM")
		shovelProxy=game.add.sprite(board.centerX-170,board.centerY,"atlas.green","SHOVEL")
		sprinklerProxy=game.add.sprite(board.centerX-10,board.centerY,"atlas.green","SPRINKLER")
		sproutProxy=game.add.sprite(board.centerX+170,board.centerY,"atlas.green","SPROUT")

		broomProxy.alpha=0;
		shovelProxy.alpha=0;
		sprinklerProxy.alpha=0;
		sproutProxy.alpha=0;

		broomProxy.scale.setTo(0.5,0.5);
		broomProxy.anchor.setTo(0.5,0.5);

		shovelProxy.scale.setTo(0.5,0.5);
		shovelProxy.anchor.setTo(0.5,0.5);

		sprinklerProxy.scale.setTo(0.5,0.5);
		sprinklerProxy.anchor.setTo(0.5,0.5);

		sproutProxy.scale.setTo(0.5,0.5);
		sproutProxy.anchor.setTo(0.5,0.5);

		broom.inputEnabled=true;
		shovel.inputEnabled=true;
		sprinkler.inputEnabled=true;
		sprout.inputEnabled=true;
		broom.events.onInputDown.add(activeObject,this);
		shovel.events.onInputDown.add(activeObject,this);
		sprout.events.onInputDown.add(activeObject,this);
		sprinkler.events.onInputDown.add(activeObject,this);

		broom.anchor.setTo(0.5,0.5);
		shovel.anchor.setTo(0.5,0.5);
		sprinkler.anchor.setTo(0.5,0.5);
		sprout.anchor.setTo(0.5,0.5);

		broom.tag="bro";
		shovel.tag="sho";
		sprinkler.tag="sprin";
		sprout.tag="sprout";

		UIGroup.add(board)

		UIGroup.add(broomIcon)
		UIGroup.add(shovelIcon)
		UIGroup.add(sprinklerIcon)
		UIGroup.add(sproutIcon)

		UIGroup.add(broom)
		UIGroup.add(shovel)
		UIGroup.add(sprinkler)
		UIGroup.add(sprout)

		platform1=game.add.spine(game.world.centerX,game.world.centerY,"floor")
		platform1.scale.setTo(1,1)
		platform1.alpha=1
		platform1.speed =0.5
		platform1.setSkinByName("normal");
		platform1.setAnimationByName(0,"STAR_DIRTY",false)
		platformGroup.add(platform1)

		platform2=game.add.spine(game.world.centerX,game.world.centerY,"floor")
		platform2.scale.setTo(1,1)
		platform2.alpha=0
		platform2.speed =0.5
		platform2.setSkinByName("normal");
		platform2.setAnimationByName(0,"START_CLEAN",false)
		platformGroup.add(platform2)

		platformGroup.y-=100

		//Put the trash and the trees in their place

		var acomodateX=100;
		var standarX=190;
		var acomodateY=40;
		var standarY=40;
		var general=0;
		var treeScale=0.5

		for(var translate=0;translate<9;translate++){


			if(translate==3){
				standarX=120;
				standarY=100;
				acomodateY=50;
				general=0
			}
			if(translate==6){
				standarX=30;
				standarY=200;
				acomodateX=110;
				acomodateY=80;
				general=0
			}

			if(translate==0 || translate==1 || translate==2 || translate==5 || translate==8){
				treeScale=0.7
			}else if(translate==3 || translate==4 || translate==7){
				treeScale=0.6
			}else if(translate==6){
				treeScale=0.5
			}

			animatedSprinklers[translate]=game.add.sprite(game.world.centerX-standarX+acomodateX*general,game.world.centerY+standarY-acomodateY*general-100,"sprinkler")
			animatedSprinklers[translate].scale.setTo(.5,.5)
			animatedSprinklers[translate].alpha=0
			animatedSprinklers[translate].animations.add('sprinkler');
			animatedSprinklers[translate].anchor.setTo(0.5,0.5)
			//trash[translate].setAnimationByName(0,"START_BAG",false)
			platformGroup.add(animatedSprinklers[translate])

			trash[translate]=game.add.spine(game.world.centerX-standarX+acomodateX*general,game.world.centerY+standarY-acomodateY*general,"trash")
			trash[translate].scale.setTo(1,1)
			trash[translate].alpha=0
			trash[translate].setSkinByName("normal");
			//trash[translate].setAnimationByName(0,"START_BAG",false)
			platformGroup.add(trash[translate])

			tree[translate]=game.add.spine(game.world.centerX-standarX+acomodateX*general,game.world.centerY+standarY-acomodateY*general,"trees")
			tree[translate].scale.setTo(treeScale,treeScale)
			tree[translate].alpha=0
			tree[translate].setSkinByName("normal");
			//tree[translate].setAnimationByName(0,"SHOOT",false)
			platformGroup.add(tree[translate])

			hole[translate]=game.add.sprite(game.world.centerX-standarX+5+acomodateX*general,game.world.centerY-10+standarY-acomodateY*general,"atlas.green","hole")
			hole[translate].scale.setTo(1,0.7)
			hole[translate].anchor.setTo(0.5,0.5)
			hole[translate].alpha=0;
			if(translate==2){
				hole[translate].scale.setTo(0.8,0.5)
			}
			if(translate==6){
				hole[translate].x+=10
				hole[translate].y-=20
			}
			platformGroup.add(hole[translate])

			iconic[translate]=game.add.sprite(trash[translate].x ,trash[translate].y-90,"atlas.green","SHOVEL")
			iconic[translate].scale.setTo(0.5,0.5)
			iconic[translate].anchor.setTo(0.5,0.5)
			iconic[translate].alpha=0
			platformGroup.add(iconic[translate])

			proxy[translate]=game.add.sprite(game.world.centerX-standarX+10+acomodateX*general,game.world.centerY-40+standarY-acomodateY*general,"atlas.green","OLD BAG")
			proxy[translate].scale.setTo(1.2,1.2)
			proxy[translate].anchor.setTo(0.5,0.5)
			proxy[translate].alpha=0
			proxy[translate].inputEnabled=true;
			proxy[translate].input.priorityID =2;
			proxy[translate].events.onInputDown.add(managerObjects,this);
			platformGroup.add(proxy[translate])

			general++;
		}

		platformGroup.bringToTop(tree[2]);
		platformGroup.bringToTop(iconic[2]);
		platformGroup.bringToTop(animatedSprinklers[2]);
		platformGroup.bringToTop(tree[1]);
		platformGroup.bringToTop(iconic[1]);
		platformGroup.bringToTop(animatedSprinklers[1]);
		platformGroup.bringToTop(tree[0]);
		platformGroup.bringToTop(iconic[0]);
		platformGroup.bringToTop(animatedSprinklers[0]);
		platformGroup.bringToTop(tree[5]);
		platformGroup.bringToTop(iconic[5]);
		platformGroup.bringToTop(animatedSprinklers[5]);
		platformGroup.bringToTop(tree[4]);
		platformGroup.bringToTop(iconic[4]);
		platformGroup.bringToTop(animatedSprinklers[4]);
		platformGroup.bringToTop(tree[3]);
		platformGroup.bringToTop(iconic[3]);
		platformGroup.bringToTop(animatedSprinklers[3]);
		platformGroup.bringToTop(tree[8]);
		platformGroup.bringToTop(iconic[8]);
		platformGroup.bringToTop(animatedSprinklers[8]);
		platformGroup.bringToTop(tree[7]);
		platformGroup.bringToTop(iconic[7]);
		platformGroup.bringToTop(animatedSprinklers[7]);
		platformGroup.bringToTop(tree[6]);
		platformGroup.bringToTop(iconic[6]);
		platformGroup.bringToTop(animatedSprinklers[6]);
	}

	function tutorialLevel(tutorialStates, position){
		hand.alpha=1;
		if(tutorialStates==0){
			hand.x=broomIcon.x+30;
			hand.y=broomIcon.y+10;
			tutorialTween=game.add.tween(hand).to({x:hole[position].x+30,y:hole[position].y-70},1000,Phaser.Easing.Cubic.InOut,true).loop(true);
			tutorialState++;
		}else if(tutorialStates==1){
			tutorialTween.stop();
			hand.x=shovelIcon.x+30;
			hand.y=shovelIcon.y+10;
			tutorialTween=game.add.tween(hand).to({x:hole[position].x+30,y:hole[position].y-70},1000,Phaser.Easing.Cubic.InOut,true).loop(true);
			tutorialState++;
		}else if(tutorialStates==2){
			tutorialTween.stop();
			hand.x=sproutIcon.x+30;
			hand.y=sproutIcon.y+10;
			tutorialTween=game.add.tween(hand).to({x:hole[position].x+30,y:hole[position].y-70},1000,Phaser.Easing.Cubic.InOut,true).loop(true);
			tutorialState++;
		}else if(tutorialStates==3){
			tutorialTween.stop();
			hand.x=sprinklerIcon.x+30;
			hand.y=sprinklerIcon.y+10;
			tutorialTween=game.add.tween(hand).to({x:tree[position].x+40,y:tree[position].y-130},1000,Phaser.Easing.Cubic.InOut,true).loop(true);
			tutorialState++;
		}
	}
	function positionTimer(){
		clock=game.add.image(game.world.centerX-150,20,"atlas.time","clock")
		clock.scale.setTo(.7)
		timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
		timeBar.scale.setTo(8,.45)
		backgroundGroup.add(clock)
		backgroundGroup.add(timeBar)
		timeBar.alpha=1
		clock.alpha=1
		UIGroup.add(clock)
		UIGroup.add(timeBar)
	}
	function stopTimer(){
		tweenTiempo.stop()
		tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, 500, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
		})
	}
	function startTimer(time){
		tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
		tweenTiempo.onComplete.add(function(){
			missPoint()
			broom.inputEnabled=false;
			shovel.inputEnabled=false;
			sprout.inputEnabled=false;
			sprinkler.inputEnabled=false;

			game.sound.setDecodedCallback(danced, function(){
				danced.loopFull(0.6)
			}, this);
			stopTimer()
			game.time.events.add(2500,function(){
				reset()
			});
			canPlant=false
		})
	}

	function checkOverlap(spriteA, spriteB) {


		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA, boundsB);
	}
	function activeObject(obj){

		if(activeObj!=null)onChangeObj(activeObj)
		broom.input.priorityID = 1;
		shovel.input.priorityID = 1;
		sprout.input.priorityID = 1;
		sprinkler.input.priorityID = 1;
		obj.input.priorityID = 0;
		activeObj=obj.tag;
		UIGroup.bringToTop(obj)
		if(obj.tag=="bro"){
			game.add.tween(nao).to({y:board.y-	100},300,Phaser.Easing.linear,true).onComplete.add(function(){
				nao.setAnimationByName(0,"idle",true);
			})
		}else{
			game.add.tween(nao).to({y:game.world.height},300,Phaser.Easing.linear,true)
		}
	}

	function update(){
		for(var mess=0;mess<estados.length;mess++){
			if(tweenIcon[mess] && estados[mess]==0 || estados[mess]==7){
				tweenIcon[mess].stop()
				iconic[mess].alpha=0
			}
		}

		if(startGame){
			objectOverlaping=null   
			//Trancision dia y noche
			if(sunAct){
				if(sun.x>game.world.centerY+100){
					sumX+=0.0001
					sumY-=0.0001              
					sun.position.x+=sumX*sumX
					sun.position.y+=sumY*sumY
				}else if(sun.x<=game.world.centerY+100){
					sumX+=0.0001
					sumY+=0.0001  
					sun.position.x+=sumX*sumX
					sun.position.y-=sumY*sumY
				}
			}

			if(moonAct){
				if(moon.x>game.world.centerY+100){
					sumX+=0.0001
					sumY-=0.0001
					moon.position.x+=sumX*sumX
					moon.position.y+=sumY*sumY
				}else if(moon.x<=game.world.centerY+100){
					sumX+=0.0001
					sumY+=0.0001
					moon.position.x+=sumX*sumX
					moon.position.y-=sumY*sumY
				}
			}

			if(sun.x>=game.world.width){
				game.add.tween(gradient2).to({alpha:1},2500,Phaser.Easing.Cubic.Out,true,300);
				game.add.tween(starsGroup).to({alpha:1},2500,Phaser.Easing.Cubic.Out,true,300);
				sun.position.x=-200
				sun.position.y=game.world.centerY+300
				moonAct=true
				sunAct=false
				sumX=1;
				sumY=1;
				game.sound.setDecodedCallback(night, function(){
					night.loopFull(0.6)
				}, this);
				morning.stop()
			}
			if(moon.x>=game.world.width){
				game.add.tween(gradient2).to({alpha:0},2500,Phaser.Easing.Cubic.Out,true,300);
				game.add.tween(starsGroup).to({alpha:0},2500,Phaser.Easing.Cubic.Out,true,300);
				moon.position.x=-200
				moon.position.y=game.world.centerY+300
				sunAct=true
				moonAct=false
				sumX=1;
				sumY=1;
				game.sound.setDecodedCallback(morning, function(){
					morning.loopFull(0.6)
				}, this);
				night.stop()
			}
			stars.tilePosition.x+=0.1

			epicparticles.update()
			//Nubes moviendose
			cloudsGroup.position.x-=velocidadNubes;
			if(cloudsGroup.x<-game.world.width*2.4){
				cloudsGroup.position.x=+100
				clouds1.position.y=game.rnd.integerInRange(0,game.world.height);
				clouds2.position.y=game.rnd.integerInRange(0,game.world.height);
				clouds3.position.y=game.rnd.integerInRange(0,game.world.height);
				clouds4.position.y=game.rnd.integerInRange(0,game.world.height);

				clouds1.position.x=game.rnd.integerInRange(game.world.width+100,game.world.width*1.4);
				clouds2.position.x=game.rnd.integerInRange(game.world.width+100,game.world.width*1.4);
				clouds3.position.x=game.rnd.integerInRange(game.world.width+100,game.world.width*1.4);
				clouds4.position.x=game.rnd.integerInRange(game.world.width+100,game.world.width*1.4);
			}

			animations[0]="BAG";
			animations[1]="BOMB";
			animations[2]="BOX";
			animations[3]="CASSETS";
			animations[4]="SODA";
			animations[5]="TIRE";
			animations[6]="TV";

			if(gameActive){
				for(var checkOverlaping=0;checkOverlaping<estados.length;checkOverlaping++){
					if (checkOverlap(sprinklerProxy,proxy[checkOverlaping]) && sprinklerProxy.alpha==0)
					{
						objectOverlaping=proxy[checkOverlaping];
						objectOverlaping.tag=proxy[checkOverlaping].tag
					}
					if(iconic[checkOverlaping].alpha !=0 && checkOverlap(sprinklerProxy,iconic[checkOverlaping])){
						objectOverlaping=proxy[checkOverlaping];
						objectOverlaping.tag=proxy[checkOverlaping].tag
					}
					if (checkOverlap(sproutProxy,proxy[checkOverlaping]) && sproutProxy.alpha==0)
					{
						objectOverlaping=proxy[checkOverlaping];
						objectOverlaping.tag=proxy[checkOverlaping].tag
					}
					if (checkOverlap(shovelProxy,proxy[checkOverlaping]) && shovelProxy.alpha==0)
					{
						objectOverlaping=proxy[checkOverlaping];
						objectOverlaping.tag=proxy[checkOverlaping].tag
					}
					if (checkOverlap(broomProxy,proxy[checkOverlaping]) && broomProxy.alpha==0)
					{
						objectOverlaping=proxy[checkOverlaping];
						objectOverlaping.tag=proxy[checkOverlaping].tag
					}
				}
			}

			for(var hide=0; hide<estados.length;hide++){
				if(estados[hide-2]>2 && estados[hide-2]<7  && estados[hide]==6 && (hide!=2 && hide!=5 && hide!=7)){
					game.add.tween(tree[hide]).to({alpha:0.5},10,Phaser.Easing.Cubic.Out,true,200);
				}
			}
			checkMouse();
			broomProxy.position.x=broom.x;
			broomProxy.position.y=broom.y;

			shovelProxy.position.x=shovel.x;
			shovelProxy.position.y=shovel.y;

			sprinklerProxy.position.x=sprinkler.x;
			sprinklerProxy.position.y=sprinkler.y;

			sproutProxy.position.x=sprout.x;
			sproutProxy.position.y=sprout.y;
		}

	}

	function checkMouse(){

		if(activeObj=="bro"){
			broom.position.x=game.input.mousePointer.x;
			broom.position.y=game.input.mousePointer.y;
			broom.alpha=1
		}else{
			broom.alpha=1
		}
		if(activeObj=="sho"){
			shovel.position.x=game.input.mousePointer.x;
			shovel.position.y=game.input.mousePointer.y;
			shovel.alpha=1
		}else{
			shovel.alpha=1
		}
		if(activeObj=="sprin"){
			sprinkler.position.x=game.input.mousePointer.x;
			sprinkler.position.y=game.input.mousePointer.y;
			sprinkler.alpha=1
		}else{
			sprinkler.alpha=1
		}
		if(activeObj=="sprout"){
			sprout.position.x=game.input.mousePointer.x;
			sprout.position.y=game.input.mousePointer.y;
			sprout.alpha=1
		}else{
			sprout.alpha=1
		}
	}

	function yogotars(){
		nao=game.add.spine(0,0,"nao");
		nao.setSkinByName("normal1");
		nao.setAnimationByName(0,"idle",true);
		nao.y=game.world.height;
		nao.x=game.world.centerX-250;
		nao.scale.setTo(0.8,0.8);
		
		estrella=game.add.spine(0,0,"estrella");
		estrella.setSkinByName("normal1");
		estrella.setAnimationByName(0,"win",true);
		estrella.x=game.world.centerX+230;
		estrella.y=game.world.height-200;
		estrella.alpha=0;
		
		justice=game.add.spine(0,0,"justice");
		justice.setSkinByName("normal2");
		justice.setAnimationByName(0,"win",true);
		justice.x=game.world.centerX+230;
		justice.y=game.world.height-200;
		justice.alpha=0;
		
		backgroundGroup.add(nao)
		backgroundGroup.add(estrella)
		backgroundGroup.add(justice)
		
	}

	function onChangeObj(obj){
		sound.play("cog")
		if(obj=="sho"){
			shovel.x=shovelIcon.x;
			shovel.y=shovelIcon.y;
			shovel.alpha=0;

		}else if(obj=="sprin"){
			sprinkler.x=sprinklerIcon.x;
			sprinkler.y=sprinklerIcon.y;
			sprinkler.alpha=0;
		}else if(obj=="sprout"){
			sprout.x=sproutIcon.x;
			sprout.y=sproutIcon.y;
			sprout.alpha=0;
		}
		else if(obj=="bro"){
			broom.x=broomIcon.x;
			broom.y=broomIcon.y;
			broom.alpha=0;
		}



		for(var show=0; show<estados.length;show++){
			if(estados[show-2]>2 && estados[show]==7 && (show!=2 && show!=5 && show!=8) && !passingLevel){
				game.add.tween(tree[show]).to({alpha:1},10,Phaser.Easing.Cubic.In,true,200);
			}
		}
	}

	function putTrash(){

		var counter=0;
		var donde=0;
		var whichOne=0;
		var tutoTrash

		if(counter<9){
			while(counter<dificulty){ 
				donde=game.rnd.integerInRange(0,8)
				if(estados[donde]==0){
					estados[donde]=1;
					tutoTrash=donde
					counter++;
				}
			}
		}else{
			for(var allEstates=0;allEstates<estados.length;allEstates++){
				estados[allEstates]=0;
			}
		}
		for(var placeTrash=0;placeTrash<estados.length;placeTrash++){
			if(estados[placeTrash]==1){
				whichOne=game.rnd.integerInRange(0,6);
				trash[placeTrash].setAnimationByName(0,"START_"+animations[whichOne],false);
				trash[placeTrash].alpha=1;
			}
		}
		if(!tutorial){
			positionTimer();
			startTimer(50000);
			broom.inputEnabled=true;
			shovel.inputEnabled=true;
			sprout.inputEnabled=true;
			sprinkler.inputEnabled=true;
		}else{
			tutorialLevel(tutorialState, tutoTrash);
		}
	}


	function managerObjects(obj){
		if(objectOverlaping){
			if(activeObj=="bro" && estados[objectOverlaping.tag]==1 && broom.alpha==1){
				clean(objectOverlaping);
			}
			if(activeObj=="sho" && estados[objectOverlaping.tag]==3 && shovel.alpha==1){
				makeHole(objectOverlaping);
			}
			if(activeObj=="sprout" && estados[objectOverlaping.tag]==4 && sprout.alpha==1){
				plant(objectOverlaping);
			}
			if(activeObj=="sprin" && estados[objectOverlaping.tag]>=5 && sprinkler.alpha==1){
				water(objectOverlaping);
			}
		}
		objectOverlaping=null
	}

	function clean(obj){
		var counterHole=0;
		sound.play("swipe")
		nao.setAnimationByName(0,"appear",false).onComplete=function(){
			nao.setAnimationByName(0,"idle",true)
		};
		game.add.tween(trash[obj.tag]).to({x:nao.x+50,y:nao.y},300,Phaser.Easing.Cubic.In,true);
		game.add.tween(trash[obj.tag]).to({alpha:0},300,Phaser.Easing.Cubic.Out,true,300);
		game.add.tween(trash[obj.tag]).to({x:trash[obj.tag].x,y:trash[obj.tag].y},200,Phaser.Easing.Cubic.In,true,1200);
		estados[obj.tag]=3;
		iconic[obj.tag].loadTexture("atlas.green","SHOVEL")
		tweenIcon[obj.tag]=game.add.tween(iconic[obj.tag]).to({alpha:0.8}, (620), Phaser.Easing.Cubic.inOut, true).yoyo(true).loop(true)
		game.add.tween(iconic[obj.tag].scale).to({x:0.6,y:0.6}, (620), Phaser.Easing.Cubic.inOut, true).yoyo(true).loop(true)


		allClean++;
		if(tutorial){
			hand.alpha=0;
		}

		if(allClean==dificulty){
			if(tutorial){
				tutorialLevel(tutorialState,obj.tag);
			}
			allClean=0;
			platform1.alpha=0;
			platform2.alpha=1;
			sound.play("combo")
			emitter = epicparticles.newEmitter("pickedEnergy")
			emitter.duration=0.2;
			emitter.x = platform1.x
			emitter.y = platform1.y
			platformGroup.add(emitter)

		}
	}

	function makeHole(obj){
		var counterToPlant=0;
		hand.alpha=0;
		if(estados[obj.tag]==3){
			sound.play("hole");
			estados[obj.tag]=4;
			hole[obj.tag].alpha=1;
			readyToPlant[obj.tag]=true;
			for(var checkToPlant=0; checkToPlant<estados.length; checkToPlant++){
				if(readyToPlant[checkToPlant]){
					counterToPlant++;
				}
			}
			tweenIcon[obj.tag].stop();
			iconic[obj.tag].alpha=0;
			if(counterToPlant==dificulty){
				if(tutorial){
					tutorialLevel(tutorialState,obj.tag);
				}
				for(var checkHoles=0; checkHoles<estados.length; checkHoles++){
					iconic[checkHoles].loadTexture("atlas.green","SPROUT")
					tweenIcon[checkHoles]=game.add.tween(iconic[checkHoles]).to({alpha:0.8}, (620), Phaser.Easing.Cubic.inOut, true).yoyo(true).loop(true)
					game.add.tween(iconic[checkHoles].scale).to({x:0.6,y:0.6}, (620), Phaser.Easing.Cubic.inOut, true).yoyo(true).loop(true)
				}
				canPlant=true;
			}
		}
	}
	function plant(obj){
		if(canPlant){
			sound.play("plant")
			if(tutorial && tutorialState==3){
				tutorialLevel(tutorialState,obj.tag);
			}
			tree[obj.tag].setAnimationByName(0,"shoot",false);
			tree[obj.tag].alpha=1;
			hole[obj.tag].alpha=0;
			estados[obj.tag]=5;
			iconic[obj.tag].loadTexture("atlas.green","SPRINKLER")
		}
	}
	function water(obj){
		var objHere=obj.tag 
		if(estados[obj.tag]==4 || estados[obj.tag]==5 || estados[obj.tag]==6){
			sound.play("water");
		}
		tweenIcon[obj.tag].stop()
		iconic[obj.tag].alpha=0
		if(estados[obj.tag]==5){
			animatedSprinklers[objHere].alpha=1
			animatedSprinklers[objHere].animations.play('sprinkler', 24,false);
			iconic[obj.tag].alpha=0
			tree[obj.tag].setAnimationByName(0,"half",false);
			iconic[obj.tag].y-=70
			animatedSprinklers[objHere].y-=70
			estados[obj.tag]=6
			game.time.events.add(1100,function(){
				sound.stop("water")
				tweenIcon[objHere]=game.add.tween(iconic[objHere]).to({alpha:0.8}, (620), Phaser.Easing.Cubic.inOut, true).yoyo(true).loop(true)
				animatedSprinklers[objHere].alpha=0
			})
		}else if(estados[obj.tag]==6){
			animatedSprinklers[objHere].alpha=10
			animatedSprinklers[objHere].animations.play('sprinkler', 24,false);
			tree[obj.tag].setAnimationByName(0,"complete",false);
			estados[obj.tag]=7;
			iconic[obj.tag].y-=100
			if(tutorial){
				tutorialTween.stop()
				hand.alpha=0;
			}
			animatedSprinklers[objHere].y-=100
			tweenIcon[obj.tag].stop()
			getCoins(platform1)
			emitter = epicparticles.newEmitter("pickedEnergy")
			emitter.duration=0.2;
			emitter.x = platform1.x
			emitter.y = platform1.y
			game.add.tween(iconic[obj.tag]).to({alpha:0}, (620), Phaser.Easing.Cubic.inOut, true).onComplete.add(function(){
				iconic[obj.tag].y+=170
				game.time.events.add(390,function(){
					sound.stop("water")
					animatedSprinklers[objHere].alpha=0
					animatedSprinklers[objHere].y+=170
				})

			})


			checked++
		}
		if(checked==dificulty){

			if(!tutorial){
				stopTimer()
			}
			tutorial=false;
			for(var mess=0;mess<estados.length;mess++){
				if(tweenIcon[mess]){
					tweenIcon[mess].stop()
					iconic[mess].alpha=0
				}
			}
			broom.inputEnabled=false;
			shovel.inputEnabled=false;
			sprout.inputEnabled=false;
			sprinkler.inputEnabled=false;
			game.time.events.add(100,function(){
				checked=0;
				canPlant=false
				game.time.events.add(1500,function(){
					game.add.tween(platformGroup).to({x:-game.world.width}, (620), Phaser.Easing.Cubic.inOut, true).onComplete.add(function(){
						platformGroup.alpha=0;
						for(var allObjects=0;allObjects<estados.length;allObjects++){
							tree[allObjects].alpha=0
							trash[allObjects].alpha=0
							readyToPlant[allObjects]=false;
							estados[allObjects]=0
						}
						platformGroup.position.x=0	
						platform1.setAnimationByName(0,"OUT_DIRTY",false);
						nextLevel()
					})
				});

			});
		}
	}

	//	function Coin(objectBorn,objectDestiny,time){
	//
	//
	//		//objectBorn= Objeto de donde nacen
	//		coins.x=objectBorn.centerX
	//		coins.y=objectBorn.centerY
	//
	//		emitter = epicparticles.newEmitter("pickedEnergy")
	//		emitter.duration=0.2;
	//		emitter.x = coins.x
	//		emitter.y = coins.y
	//		platformGroup.add(emitter)
	//		game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
	//		game.add.tween(coins).to({y:objectBorn.centerY-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
	//			game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
	//			game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
	//				coins.x=objectBorn.centerX
	//				coins.y=objectBorn.centerY
	//				addPoint(1)
	//			})
	//		})
	//	}

	function getCoins(player){
		var coin=coinsGroup.getFirstDead();

		if(coin==undefined){
			game["coinS"+index] = game.add.sprite(0, 0, "coin")
			game["coinS"+index].anchor.setTo(0.5)
			game["coinS"+index].scale.setTo(0.8)
			game["coinS"+index].animations.add('coin')
			game["coinS"+index].animations.play('coin', 24, true)
			game["coinS"+index].alpha = 0
			coinsGroup.add(game["coinS"+index])
			coin=game["coinS"+index];
			index++;
			addCoin(coin,player)
		}else{
			addCoin(coin,player)
		}
	}
	function createCoin(){

		coinS = game.add.sprite(0, 0, "coin")
		coinS.anchor.setTo(0.5)
		coinS.scale.setTo(0.8)
		coinS.animations.add('coin')
		coinS.animations.play('coin', 24, true)
		coinS.alpha = 0
		coinS.kill()

	}

	function addCoin(coin,obj){

		if(coin.motion)
			coin.motion.stop()

		coin.reset(obj.centerX,obj.centerY);

		game.add.tween(coin).to({alpha:1}, 100, Phaser.Easing.linear, true)

		coin.motion = game.add.tween(coin).to({y:coin.y - 100}, 200, Phaser.Easing.Cubic.InOut,true)
		coin.motion.onComplete.add(function(){
			coin.motion = game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true)
			coin.motion.onComplete.add(function(){
				coin.motion = game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true)
				coin.motion.onComplete.add(function(){
					addPoint(1);
					coin.kill();
					createTextPart('+1',pointsBar.text)
				})
			})
		})
	}

	function reset(){
		checked=0;
		allClean=0;

		for(var iconicDissapear=0; iconicDissapear<estados.length;iconicDissapear++){
			if(readyToPlant[iconicDissapear] && iconic[iconicDissapear].alpha!=0){
				tweenIcon[iconicDissapear].stop()
			}
			iconic[iconicDissapear].alpha=0
			iconic[iconicDissapear].y=trash[iconicDissapear].y-90
			iconic[iconicDissapear].x=trash[iconicDissapear].x
			animatedSprinklers[iconicDissapear].y=trash[iconicDissapear].y-90
			animatedSprinklers[iconicDissapear].x=trash[iconicDissapear].x
		}
		game.add.tween(platformGroup).to({x:-game.world.width}, (620), Phaser.Easing.Cubic.inOut, true).onComplete.add(function(){
			platformGroup.alpha=0;
			for(var allObjects=0;allObjects<estados.length;allObjects++){
				tree[allObjects].alpha=0
				trash[allObjects].alpha=0
				hole[allObjects].alpha=0;
				readyToPlant[allObjects]=false;
				estados[allObjects]=0
			}
			platformGroup.position.x=0
		})

		game.time.events.add(650,function(){
			platformGroup.alpha=1
			platform1.alpha=1;
			platform2.alpha=0;
			platform1.setAnimationByName(0,"STAR_DIRTY",false);
			game.time.events.add(1500,function(){
				putTrash();
			})
		})

	}

	function nextLevel(){

		if(dificulty<9)dificulty++;
		passingLevel=true;
		var witchYogotar=game.rnd.integerInRange(0,1);
		sound.play("cheers")
		if(witchYogotar==0){
			game.add.tween(estrella).to({alpha:1},200,Phaser.Easing.Cubic.In,true).onComplete.add(function(){
				game.add.tween(estrella).to({alpha:0},200,Phaser.Easing.Cubic.Out,true,1500)																		 
			});																					 
		}
		else if(witchYogotar==1){
			game.add.tween(justice).to({alpha:1},200,Phaser.Easing.Cubic.In,true).onComplete.add(function(){
				game.add.tween(justice).to({alpha:0},200,Phaser.Easing.Cubic.Out,true,1500)																		 
			});	
		}
		game.time.events.add(1500,function(){
			platformGroup.alpha=1
			platform1.alpha=1;
			platform2.alpha=0;
			platform1.setAnimationByName(0,"STAR_DIRTY",false);
			game.time.events.add(1500,function(){
				putTrash();
				passingLevel=false;
			})
		})
	}


	function createTextPart(text,obj){

		var pointsText = lookParticle('text')

		if(pointsText){

			pointsText.x = obj.world.x
			pointsText.y = obj.world.y - 60
			pointsText.setText(text)
			pointsText.scale.setTo(1,1)

			game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
			game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

			deactivateParticle(pointsText,750)
		}

	}

	function lookParticle(key){

		for(var i = 0;i<particlesGroup.length;i++){

			var particle = particlesGroup.children[i]
			//console.log(particle.tag + ' tag,' + particle.used)
			if(!particle.used && particle.tag == key){

				particle.used = true
				particle.alpha = 1

				particlesGroup.remove(particle)
				particlesUsed.add(particle)

				return particle
				break
			}
		}

	}

	function deactivateParticle(obj,delay){

		game.time.events.add(delay,function(){

			obj.used = false

			particlesUsed.remove(obj)
			particlesGroup.add(obj)

		},this)
	}

	function createPart(key){
		var particle = game.add.emitter(0, 0, 100);
		particle.makeParticles('atlas.green',key);
		particle.minParticleSpeed.setTo(-200, -50);
		particle.maxParticleSpeed.setTo(200, -100);
		particle.minParticleScale = 0.3;
		particle.maxParticleScale = .8;
		particle.gravity = 150;
		particle.angularDrag = 30;
		particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
		return particle
	}

	function createParticles(tag,number){

		for(var i = 0; i < number;i++){

			var particle
			if(tag == 'text'){

				var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

				var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
				particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
				particlesGroup.add(particle)

			}else{
				var particle = game.add.emitter(0, 0, 100);

				particle.makeParticles('atlas.green',tag);
				particle.minParticleSpeed.setTo(-200, -50);
				particle.maxParticleSpeed.setTo(200, -100);
				particle.minParticleScale = 0.6;
				particle.maxParticleScale = 1.5;
				particle.gravity = 150;
				particle.angularDrag = 30;

				particlesGroup.add(particle)

			}

			particle.alpha = 0
			particle.tag = tag
			particle.used = false
			//particle.anchor.setTo(0.5,0.5)
			particle.scale.setTo(1,1)
		}


	}

	function addParticles(){

		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)

		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)

		createParticles('star',3)
		createParticles('text',5)
		createParticles('smoke',1)

	}

	function setExplosion(obj){

		var posX = obj.x
		var posY = obj.y

		if(obj.world){
			posX = obj.world.x
			posY = obj.world.y
		}

		var rect = new Phaser.Graphics(game)
		rect.beginFill(0xffffff)
		rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
		rect.alpha = 0
		rect.endFill()
		sceneGroup.add(rect)

		game.add.tween(rect).from({alpha:1},500,"Linear",true)

		var exp = sceneGroup.create(0,0,'atlas.green','cakeSplat')
		exp.x = posX
		exp.y = posY
		exp.anchor.setTo(0.5,0.5)

		exp.scale.setTo(6,6)
		game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
		var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)

		particlesNumber = 8

		var particlesGood = game.add.emitter(0, 0, 100);

		particlesGood.makeParticles('atlas.green','smoke');
		particlesGood.minParticleSpeed.setTo(-200, -50);
		particlesGood.maxParticleSpeed.setTo(200, -100);
		particlesGood.minParticleScale = 0.6;
		particlesGood.maxParticleScale = 1.5;
		particlesGood.gravity = 150;
		particlesGood.angularDrag = 30;

		particlesGood.x = posX;
		particlesGood.y = posY;
		particlesGood.start(true, 1000, null, particlesNumber);

		game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
		sceneGroup.add(particlesGood)

	}

	function inputButton(obj){

		if(!gameActive){
			return
		}

	}

	return {

		assets: assets,
		name: "greenRescue",
		update: update,
		preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){

			sceneGroup = game.add.group()

			document.addEventListener("contextmenu", function(e){
				e.preventDefault();
			}, false);
			
			
			createBackground()
			yogotars();
			addParticles()

			morning = game.add.audio('morning')
			game.sound.setDecodedCallback(morning, function(){
				morning.loopFull(0.6)
			}, this);

			night = game.add.audio('night')
			game.sound.setDecodedCallback(night, function(){
				night.loopFull(0.6)
			}, this);

			danced = game.add.audio('danced')
			game.sound.setDecodedCallback(danced, function(){
				danced.loopFull(0.7)
			}, this);
			night.stop();

			game.onPause.add(function(){
				game.sound.mute = true
			} , this);

			game.onResume.add(function(){
				game.sound.mute = false
			}, this);

			initialize();

			createPointsBar();
			createHearts();
			createCoin();
			

			buttons.getButton(morning,sceneGroup)
			createOverlay()

			animateScene()

		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()