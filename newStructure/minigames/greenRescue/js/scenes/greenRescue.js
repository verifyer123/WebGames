
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
				name: "atlas.greenRescue",
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


		],
		jsons: [
			{
				name: 'pickedEnergy', 
				file: 'particles/battle/pickedEnergy/specialBar1.json'
			}
		],
		spritesheets: [
			{
				name:"coin",
				file:"images/Spine/coin.png",
				width:122,
				height:123,
				frames:12
			},
			{  
				name: "hand",
				file: "images/Spine/hand.png",
				width: 115,
				height: 111,
				frames: 10
			}
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
	var morning,night, danced
	var velocidadNubes=4
	var objectsGroup=null;
	var platformsGroup=null;
	var backgroundGroup=null
	var clock, timeBar,tweenTiempo;
	var iconic=[];
	var trash=[];
	var tree=[];
	var animations=[];
	var tutorialHand;
	var actualState;
	var objectOverlaping;
	var dificulty;
	var TOTAL_OBJS=9;
	var checked, allClean,canPlant;
	var tweenIcon=[];
	var colora1,colora2,colora3;
	var broom, sprout, sprinkler
	var colorb1,colorb2,colorb3;
	var bmd, gradient
	var out, passingLevel;
	var placeHolders=[]
	var y
	var broomIco, sproutIco, sprinklerIco
	var hand;
	var tutorial
	var tutorialCount;
	var sumX,sumY
	var transition
	var coin
	var sunAct,moonAct;
	var emitter
	var positionX=[];
	var positionY=[];
	var positionPlatformsX


	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		transition=0
		canPlant=false;
		emitter="";
		sunAct=false
		tutorialCount=0;
		tutorial=true;
		moonAct=false
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

		var pointsImg = pointsBar.create(-10,10,'atlas.greenRescue','xpcoins')
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

		var heartImg = group.create(0,0,'atlas.greenRescue','life_box')

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

		game.stage.disableVisibilityChange = false;

		game.load.audio('morning', soundsPath + 'songs/forestAmbience.mp3');
		game.load.audio('night', soundsPath + 'owl.mp3');
		game.load.audio('danced', soundsPath + 'songs/jungle_fun.mp3');

		game.load.spine("floor","images/Spine/Floor/floor.json")
		game.load.spine("trash","images/Spine/Trash/trash.json")
		game.load.spine("trees","images/Spine/Trees/trees.json")

		game.load.spritesheet("sprinkler", 'images/Spine/sprinkler/sprinker.png', 272, 305, 23)
		game.load.spritesheet("can", 'images/Spine/trashcan/trashcan.png', 162, 260, 24)


		game.load.image('tutorial_image',"images/green/tutorial_image.png")
		//loadType(gameIndex)
	}

	function createOverlay(){
		overlayGroup = game.add.group()
		sceneGroup.add(overlayGroup)
		tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
	}
	function onClickPlay(){
		sunAct=true
		//Aqui va la primera funciòn que realizara el juego
		startGame=true
		game.time.events.add(1250, function(){
			tutorialLevel();
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

		//Grupo de estrellas

		starsGroup=game.add.group();
		sceneGroup.add(starsGroup);

		//Grupo de nubes

		cloudsGroup=game.add.group();
		sceneGroup.add(cloudsGroup);

		UIGroup=game.add.group();
		sceneGroup.add(UIGroup);

		platformsGroup=game.add.group();
		sceneGroup.add(platformsGroup);

		objectsGroup=game.add.group();
		sceneGroup.add(objectsGroup)

		//Aqui inicializo los botones
		controles=game.input.keyboard.createCursorKeys()

		correctParticle = createPart("star");
		sceneGroup.add(correctParticle);
		boomParticle = createPart("smoke");
		sceneGroup.add(boomParticle);

		//Coins
		coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
		coins.anchor.setTo(0.5)
		coins.scale.setTo(0.5)
		coins.animations.add('coin');
		coins.animations.play('coin', 24, true);
		coins.alpha=0

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

		sun=game.add.sprite(-200,game.world.centerY+300,"atlas.greenRescue","SUN");
		moon=game.add.sprite(sun.x,game.world.centerY+300,"atlas.greenRescue","MOON");

		container=game.add.sprite(game.world.centerX-75,game.world.height-100,"atlas.greenRescue","BOARD");
		container.anchor.setTo(0.5,0.5);
		container.scale.setTo(0.7,1);
		broomIco=game.add.sprite(container.x-170,container.y-76,"atlas.greenRescue","ICON_BROOM");
		sproutIco=game.add.sprite(broomIco.x+100,container.y-76,"atlas.greenRescue","ICON SPROUT");
		sprinklerIco=game.add.sprite(sproutIco.x+80,container.y-76,"atlas.greenRescue","ICON SPRINKLER");

		backgroundGroup.add(container);
		backgroundGroup.add(broomIco);
		backgroundGroup.add(sproutIco);
		backgroundGroup.add(sprinklerIco);

		for(var loadFloor=0; loadFloor<3; loadFloor++){
			floor=game.add.spine(game.world.centerX,game.world.centerY,"floor");
			floor.setSkinByName("normal");
			platformsGroup.add(floor);
		}

		clouds1=game.add.sprite(0,game.rnd.integerInRange(0,game.world.height),"atlas.greenRescue","CLOUD");
		clouds2=game.add.sprite(0,game.rnd.integerInRange(0,game.world.height),"atlas.greenRescue","CLOUD");
		clouds3=game.add.sprite(0,game.rnd.integerInRange(0,game.world.height),"atlas.greenRescue","CLOUD");
		clouds4=game.add.sprite(0,game.rnd.integerInRange(0,game.world.height),"atlas.greenRescue","CLOUD");

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

		stars=game.add.tileSprite(0,10,game.world.width,game.world.height/7.7,'atlas.greenRescue',"STARS")
		starsGroup.add(stars)
		starsGroup.alpha=1

		for(var placeHolder=0; placeHolder<TOTAL_OBJS;placeHolder++){
			trash[placeHolder]=game.add.spine(0,0,"trash")
			trash[placeHolder].setSkinByName("normal")
			tree[placeHolder]=game.add.spine(0, 0, "trees");
			tree[placeHolder].setSkinByName("normal");
			positionX[placeHolder]=0;
			positionY[placeHolder]=0;
			placeHolders[placeHolder]=game.add.sprite(0,0,"atlas.greenRescue","OLD BAG")
			placeHolders[placeHolder].x=positionX[placeHolder];
			placeHolders[placeHolder].y=positionY[placeHolder];
			placeHolders[placeHolder].inputEnabled=true;
			placeHolders[placeHolder].tag=placeHolder;
			placeHolders[placeHolder].events.onInputDown.add(checkObjects,this);
		}
		placeObjs();
	}


	function placeObjs(){
		for(var placeTrash=0; placeTrash<TOTAL_OBJS; placeTrash++){
			trash[placeTrash].x=positionX[placeTrash];
			trash[placeTrash].y=positionY[placeTrash];
			//objectsGroup.add(trash[placeTrash])
		}
		for(var placeTrees=0; placeTrees<TOTAL_OBJS; placeTrees++){
			tree[placeTrees].x=positionX[placeTrees];
			tree[placeTrees].y=positionY[placeTrees];
			//objectsGroup.add(tree[placeTrash])
		}
	}
	function checkPlatforms(){
		var platformChecked1=0;
		var platformChecked2=0;
		var platformChecked3=0;
		for(var platform1=0; platform1<3; platform1++){
			if(placeHolders[platform1].state=="")platformChecked1++
		}
		for(var platform2=3; platform2<6; platform2++){
			if(placeHolders[platform2].state=="")platformChecked2++
		}
		for(var platform3=6; platform3<9; platform3++){
			if(placeHolders[platform3].state=="")platformChecked3++
		}
	}
	function removePlatform(platform){
		var positionX=platform.x;
		game.add.tween(platform).to({x:-500},500,Phaser.Easing.Linear.Out,true).onComplete.add(function(platform,positionX){
			platform.x=positionX;
			platform.alpha=0;
		});
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
	function planetVisual(){

		planet.x=game.world.centerX+100;
		planet.y=200;

		NAO.setAnimationByName(0,"idle",true);

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
	function update(){

		if(startGame){

			if(actualState=="broom"){
				broom.x=game.input.activePointer.x;
				broom.y=game.input.activePointer.y;
			}else 
				if(actualState=="sprinkler"){
					sprinkler.x=game.input.activePointer.x;
					sprinkler.y=game.input.activePointer.y;	 
				}else
					if(actualState=="sprout"){
						sprout.x=game.input.activePointer.x;
						sprout.y=game.input.activePointer.y;	 
					}


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
		}
	}


	function onActivate(obj){
		if(obj.tag=="broom"){
			actualState="broom";
		}else if(obj.tag=="sprinkler"){
			actualState="sprinkler";
		}else if(obj.tag=="sprout"){
			actualState="sprout";
		}
	}
	function onDeactivate(obj){
		actualState="";
	}
	function checkObjects(obj){
		if(obj.state=="trash" && actualState=="broom"){
			obj.state="";
			trash[obj.tag].setAnimationByName(0,"dissapear",false);
			obj.inputEnabled=false;
			checkPlatforms();
			if(tutorial){
				tutorialCount++
				tutorialHand.stop();
				hand.x=sproutIco.x;
				hand.y=sproutIco.y;
			}
			game.add.tween(trash[obj.tag]).to({x:trashCan.x, y:trashCan.y},500,Phaser.Easing.Linear.Out,true);
		}else if(obj.state=="tree" && actualState=="sprout"){
			obj.state="tree2";
			tree[obj.tag].alpha=1;
			obj.setAnimationByName(0,"sprout",false);
			if(tutorial){
				tutorialHand.stop();
				hand.x=sprinklerIco.x;
				hand.y=sprinklerIco.y;
			}
		}else if((obj.state=="tree2" || obj.state=="tree3") && actualState=="spinkler"){
			if(obj.state=="tree3"){
				obj.setAnimationByName(0,"allbig",false);
				obj.state="";
				tutorialCount++;
				if(tutorialCount==3){
					tutorial=false;
				}
				obj.inputEnabled=false;
				checkPlatforms();
			}
			if(obj.state=="tree2"){
				obj.setAnimationByName(0,"bigger",false);
				obj.state="tree3";
				if(tutorial){
					tutorialHand.stop();
					hand.x=sprinkler.x;
					hand.y=sprinkler.y;
				}
			}
			tree[obj.tag].alpha=1;
		}else{
			missPoint();
		}
		if(tutorialCount==1 && tutorial){
			tutorialHand=game.add.tween(hand).to({x:placeHolders[4].x, y:placeHolders[4].y},500,Phaser.Easing.Cubic.Out).loop(true);
		}else if(tutorialCount==2 && tutorial){
			tutorialHand=game.add.tween(hand).to({x:placeHolders[7].x, y:placeHolders[7].y},500,Phaser.Easing.Cubic.Out).loop(true);
		}
	}

	function Coin(objectBorn,objectDestiny,time){


		//objectBorn= Objeto de donde nacen
		coins.x=objectBorn.centerX
		coins.y=objectBorn.centerY

		emitter = epicparticles.newEmitter("pickedEnergy")
		emitter.duration=1;
		emitter.x = coins.x
		emitter.y = coins.y
		platformsGroup.add(emitter)
		game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
		game.add.tween(coins).to({y:objectBorn.centerY-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
			game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
			game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
				coins.x=objectBorn.centerX
				coins.y=objectBorn.centerY
				addPoint(1)
			})
		})
	}

	function reset(){
		var trashOrTree;
		for(var cleanAll=0; cleanAll<TOTAL_OBJS;cleanAll++){
			placeHolders[cleanAll].state="";
			placeHolders[cleanAll].inputEnabled=false;
			trash[cleanAll].alpha=0;
			tree[cleanAll].alpha=0;
		}
		placeObjs();
		for(var resetObjsPlatform1=0; resetObjsPlatform1<dificulty; resetObjsPlatform1++){
			trashOrTree=game.rnd.integerInRange(0,1);
			if(trashOrTree==1){
				placeHolders[resetObjsPlatform1].state="tree";
			}else{
				placeHolders[resetObjsPlatform1].state="trash";
			}
		}
		for(var resetObjsPlatform2=0; resetObjsPlatform2<dificulty; resetObjsPlatform2++){
			trashOrTree=game.rnd.integerInRange(0,1);
			if(trashOrTree==1){
				placeHolders[resetObjsPlatform2].state="tree";
			}else{
				placeHolders[resetObjsPlatform2].state="trash";
			}
		}
		for(var resetObjsPlatform3=0; resetObjsPlatform3<dificulty; resetObjsPlatform3++){
			trashOrTree=game.rnd.integerInRange(0,1);
			if(trashOrTree==1){
				placeHolders[resetObjsPlatform3].state="tree";
			}else{
				placeHolders[resetObjsPlatform3].state="trash";
			}
		}
		game.time.events.add(1500,function(){
			for(var platformsInGame=0; platformsInGame<platformsGroup.length; platformsInGame){
				platformsGroup.children[platformsInGame].x=positionPlatformsX[platformsInGame];
				platformsGroup.children[platformsInGame].setAnimationByName(0,"start_dirty",false).onComplete.add=function(){
					for(var appearTrashandIcons=0; appearTrashandIcons<TOTAL_OBJS; appearTrashandIcons++){
						if(placeHolders[appearTrashandIcons].state=="trash"){
							trash[appearTrashandIcons].alpha=1;
							placeHolders[appearTrashandIcons].inputEnabled=true;
							iconAnimation[appearTrashandIcons]=game.add.tween(icons[appearTrashandIcons]).to({alpha:0},500,Phaser.Easing.Linear.Out,true);
						}
						if(placeHolders[appearTrashandIcons].state=="tree"){
							placeHolders[appearTrashandIcons].inputEnabled=true;
						}
					}
				};
			}
		});
	}
	function tutorialLevel(){
		for(var platformsInGame=0; platformsInGame<platformsGroup.length; platformsInGame){
			platformsGroup.children[platformsInGame].setAnimationByName(0,"start_dirty",false);
		}
//		placeHolders[1].state="trash";
//		placeHolders[4].state="tree";
//		placeHolders[7].state="tree";
//        
//		placeHolders[1].inputEnabled=true;
//		placeHolders[4].inputEnabled=false;
//		placeHolders[7].inputEnabled=false;
//
//		hand.x=broomIco.x;
//		hand.y=broomIco.y;
//
//		tutorialHand=game.add.tween(hand).to({x:placeHolders[1].x, y:placeHolders[1].y},500,Phaser.Easing.Cubic.Out).loop(true);
//		tutorial=0;
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
		particle.makeParticles('atlas.greenRescue',key);
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

				particle.makeParticles('atlas.greenRescue',tag);
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

		var exp = sceneGroup.create(0,0,'atlas.greenRescue','cakeSplat')
		exp.x = posX
		exp.y = posY
		exp.anchor.setTo(0.5,0.5)

		exp.scale.setTo(6,6)
		game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
		var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)

		particlesNumber = 8

		var particlesGood = game.add.emitter(0, 0, 100);

		particlesGood.makeParticles('atlas.greenRescue','smoke');
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

	function createInteractives(){

		coin = game.add.sprite(0, 0, "coin")
		coin.anchor.setTo(0.5)
		coin.scale.setTo(0.8)
		coin.animations.add('coin');
		coin.animations.play('coin', 24, true);
		coin.alpha = 0

		hand = game.add.sprite(0, 0, "hand")
		hand.animations.add('hand')
		hand.animations.play('hand', 24, true)
		hand.alpha = 0

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

			initialize()
			createInteractives();
			createPointsBar()
			createHearts()

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