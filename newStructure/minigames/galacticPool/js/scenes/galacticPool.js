
var soundsPath = "../../shared/minigames/sounds/"
var particlesPath="../../shared/minigames/images/particles/battle/"
var tutorialPath = "../../shared/minigames/"
var galacticPool = function(){

	var localizationData = {
		"EN":{
			"howTo":"How to Play?",
			"moves":"Moves left",
			"stop":"Stop!",
			"tutorial_image":"images/galacticPool/tutorial_image_EN_movil.png",
			"tutorial_image":"images/galacticPool/tutorial_image_EN.png",
			"planet1":"Sun",
			"planet2":"Mercury",
			"planet3":"Venus",
			"planet4":"Earth",
			"planet5":"Mars",
			"planet6":"Jupiter",
			"planet7":"Saturn",
			"planet8":"Uranus",
			"planet9":"Neptune",
		},

		"ES":{
			"moves":"Movimientos extra",
			"howTo":"¿Cómo jugar?",
			"stop":"¡Detener!",
			"tutorial_image":"images/galacticPool/tutorial_image_ES_desktop.png",
			"tutorial_image":"images/galacticPool/tutorial_image_ES.png",
			"planet1":"Sol",
			"planet2":"Mercurio",
			"planet3":"Venus",
			"planet4":"Tierra",
			"planet5":"Marte",
			"planet6":"Jupiter",
			"planet7":"Saturno",
			"planet8":"Urano",
			"planet9":"Neptuno",
		}
	}

	assets = {
		atlases: [
			{   
				name: "atlas.galacticPool",
				json: "images/galacticPool/atlas.json",
				image: "images/galacticPool/atlas.png",
			},
			{   
				name: "atlas.time",
				json: "images/galacticPool/timeAtlas.json",
				image: "images/galacticPool/timeAtlas.png",
			},
			{   
				name: "atlas.tutorial",
				json: tutorialPath+"images/tutorial/tutorial_atlas.json",
				image: tutorialPath+"images/tutorial/tutorial_atlas.png"
			}
		],
		images: [

			{
				name:'tutorial_image',
				file:"%lang_%input",
			},
			{
				name:'tile_back',
				file:"images/galacticPool/tile_back.png"
			},

		],
		spines: [
			{
				name:"planet",
				file:"images/Spine/planetas/planets.json"
			},
			{
				name:"blackHole",
				file:"images/Spine/black_hole/blakc_hole.json"
			},
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
			},
			{  
				name: "comet",
				file: "images/Spine/comet.png",
				width: 225,
				height: 224,
				frames: 24
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
			{	name: "ship",
			 file: soundsPath + "robotBeep.mp3"},
			{   name:"acornSong",
			 file: soundsPath + 'songs/musicVideogame9.mp3'},
			{   name:"swallow",
			 file: soundsPath + 'swallow.mp3'},
			{   name:"inflateballoon",
			 file: soundsPath + 'inflateballoon.mp3'},

		],
		jsons: [
			{
				name: 'pickedEnergy', 
				file:  particlesPath + 'pickedEnergy/specialBar1.json'
			}
		],
	}


	var lives = null
	var sceneGroup = null
	var background
	var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
	var physicPlanets
	var tutoGroup
	var indexGame
	var overlayGroup
	var blackHole
	var stick;
	var gameIndex;
	var planetsGroup;
	var fontStyleWord
	var targetsGroup;
	var wall
	var wordFont;
	var coinsGroup;
	var nebulsInGame;
	var UIGroup;
	var baseSong
	var canCollide;
	var dificulty;
	var coin;
	var tweenActualPlanet;
	var hand;
	var START_TIMING;
	var star;
	var star2;
	var star3;
	var texture;
	var texture2;
	var texture3;
	var distance = 950;
	var max = 250;
	var xx = [];
	var yy = [];
	var zz = [];
	var xx2 = [];
	var yy2 = [];
	var zz2 = [];
	var xx3 = [];
	var yy3 = [];
	var zz3 = [];
	var a1 = [];
	var a2 = [];
	var a3 = [];
	var speedStars = 3;
	var planets=[];
	var tutorial;
	var targets=[];
	var speedTimer;
	var nebul=[];
	var planetsNames;
	var positionPoolX=[];
	var positionPoolY=[];
	var handFollowing;
	var tutoPlanet;
	var positionX=[];
	var positionY=[];
	var goal;
	var planetsNames=[
		{SKIN:"neptune",word:localization.getString(localizationData,"planet9")},
		{SKIN:"uranus",word:localization.getString(localizationData,"planet8")},
		{SKIN:"saturn",word:localization.getString(localizationData,"planet7")},
		{SKIN:"jupiter",word:localization.getString(localizationData,"planet6")},
		{SKIN:"mars",word:localization.getString(localizationData,"planet5")},
		{SKIN:"earth",word:localization.getString(localizationData,"planet4")},
		{SKIN:"venus",word:localization.getString(localizationData,"planet3")},
		{SKIN:"mercury",word:localization.getString(localizationData,"planet2")},
		{SKIN:"sun",word:localization.getString(localizationData,"planet1")}
	];	
	var TOTAL_PLANETS=9;
	var PLANETS_SPINES="planet";
	var delayDefault
	var clock, timeBar
	var backgroundGroup=null

	var tweenTiempo
	var clock, timeBar
	var emitter



	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

		//game.stage.backgroundColor = "#000000"
		lives = 3
		emitter=""
		START_TIMING=300;
		nebulsInGame=0;
		dificulty=1;
		speedTimer=30000;
		handFollowing=false;
		goal=0;
		PLANETS_SPINES="planet";
		tutoPlanet=0;
		canCollide=false;
		tutorial=false;
		loadSounds()
	}

	function onClickPlay(rect) {
		tutoGroup.y = -game.world.height
		game.time.events.add(900,function(){
			stickAnimation()
		});
	}

	function createTutorial(){
		tutoGroup = game.add.group()
		sceneGroup.add(tutoGroup)
		tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
	}


	function reset(){

		for(var resetPlanets=0; resetPlanets<planets.length; resetPlanets++){
			game.add.tween(planets[resetPlanets].spines).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
			game.add.tween(planets[resetPlanets].text).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
			game.add.tween(targets[resetPlanets]).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
			targets[resetPlanets].inUse=false;
		}
		if(pointsBar.number>40 && dificulty<2){
			dificulty++;
		}
		game.time.events.add(3000, function(){
			for(var resetGame=0; resetGame<planets.length; resetGame++){
				planets[resetGame].body.x=positionX[resetGame];
				planets[resetGame].body.y=positionY[resetGame];
				planets[resetGame].spines.x=positionX[resetGame];
				planets[resetGame].spines.y=positionY[resetGame];
				planets[resetGame].text.x=positionX[resetGame]+50;
				planets[resetGame].text.y=positionY[resetGame];
				planets[resetGame].body.data.shapes[0].sensor= false
				planets[resetGame].text.alpha=1;
			}
			game.physics.p2.updateBoundsCollisionGroup();
			UIGroup.alpha=1;

			planets[8].body.x=game.world.centerX
			planets[8].body.y=game.world.height-100
			planets[8].text.x=positionX[8]+50;
			planets[8].text.y=positionY[8]
			for(var resetPlanets=0; resetPlanets<planets.length; resetPlanets++){
				game.add.tween(planets[resetPlanets].spines).to({alpha:1},1000,Phaser.Easing.Cubic.In,true)
			}
			game.add.tween(stick).to({alpha:1},1000,Phaser.Easing.Cubic.In,true)
			stickAnimation();
		});
	}
	function dragging(obj){
		if(dificulty>=2){
			canCollide=false;
			obj.body.setZeroVelocity();
			obj.body.data.shapes[0].sensor= true;
		}
		if(dificulty>=3){
			obj.changing=false;
		}
		obj.body.x=game.input.x;
		obj.body.y=game.input.y;
		
		if(tutorial){
			for(var alphaPlanets=0; alphaPlanets<TOTAL_PLANETS; alphaPlanets++){
				if(planets[alphaPlanets].spines!=obj.spines){
					planets[alphaPlanets].spines.alpha=0.2;
				}
			}
		}
	}
	//Si en algun momento se le quiere meter una nueva dificultad usar esta funcion y modificar a gusto.
	function changePlanetToRock(obj,howManyRocks){
		obj.loadTexture("atlas.galacticPool","rock");
		game.time.events.add(500,function(){
			obj.loadTexture("atlas.galacticPool",obj.tag);
		});
	}
	function stopDragging(obj){
		sound.play("pop")
		for(var overTargets=0; overTargets<planets.length; overTargets++){
			if(checkOverlap(obj,targets[overTargets]) && obj.inputEnabled && !targets[overTargets].inUse){
				checkIfCorrect(obj,targets[overTargets]);
			}
		}
		if(tutorial){
			for(var alphaPlanets=0; alphaPlanets<TOTAL_PLANETS; alphaPlanets++){
				planets[alphaPlanets].spines.alpha=1;
			}
		}
	}
	function giveInputs(switched){
		for(var inputPhysics=0; inputPhysics<planets.length; inputPhysics++){
			planets[inputPhysics].inputEnabled=switched;
			planets[inputPhysics].input.enableDrag(switched);
			planets[inputPhysics].events.onDragStop.add(stopDragging,planets[inputPhysics]);
			planets[inputPhysics].events.onDragUpdate.add(dragging,planets[inputPhysics]);
		}
	}
	function stopAllPlanets(CONTEXT){
		game.time.events.add(6000,function(){
			for(var stopPlanets=0; stopPlanets<planets.length; stopPlanets++){
				if(dificulty<2){
					canCollide=false;
					planets[stopPlanets].body.setZeroVelocity();
					planets[stopPlanets].body.data.shapes[0].sensor= true;
				}
			}
			if(tutoPlanet!=TOTAL_PLANETS)tutorial=true;
			for(var appearTargets=0; appearTargets<planets.length; appearTargets++){
				targets[appearTargets].alpha=1;
			}
			if(pointsBar.number>16 && dificulty==1){
				placeNebuls(game.rnd.integerInRange(1,5));
			}
			if(!tutorial){
				clock.alpha=1;
				timeBar.alpha=1;
				startTimer(speedTimer);
				giveInputs(CONTEXT);
			}else{
				planets[0].inputEnabled=true;
				planets[0].input.enableDrag(true);
				planets[0].events.onDragStop.add(stopDragging,planets[0]);
				planets[0].events.onDragUpdate.add(dragging,planets[0]);
			}


		});
	}
	function placeNebuls(howManyNebuls){
		nebulsInGame=howManyNebuls;
		var where=game.rnd.integerInRange(0,planets.length-1);
		for(var placeNebuls=0;placeNebuls<howManyNebuls;placeNebuls++){
			nebul[placeNebuls].x=planets[where].x;
			nebul[placeNebuls].y=planets[where].y;
			nebul[placeNebuls].alpha=0.5;
			where=game.rnd.integerInRange(0,planets.length-1);
		}
	}
	function handFollow(actualPlanet){
		if(actualPlanet<TOTAL_PLANETS){
			hand.alpha=1;
			planets[actualPlanet].inputEnabled=true;
			planets[actualPlanet].input.enableDrag(true);
			planets[actualPlanet].events.onDragStop.add(stopDragging,planets[actualPlanet]);
			planets[actualPlanet].events.onDragUpdate.add(dragging,planets[actualPlanet]);
			hand.x=planets[actualPlanet].x+40;
			hand.y=planets[actualPlanet].y+30;
			tweenActualPlanet=game.add.tween(hand).to({x:targets[actualPlanet].x+30,y:targets[actualPlanet].y+30},1000,Phaser.Easing.linear,true)
			tweenActualPlanet.onComplete.add(function(){
				handFollowing=false;
			});
		}
	}
	function stopTimer(){
		if(lives>0){
			tweenTiempo.stop()
			tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, START_TIMING, Phaser.Easing.Linear.Out, true, delayDefault).onComplete.add(function(){
				if(lives>0)reset();
				for(var dissapearNebuls=0;dissapearNebuls<nebulsInGame;dissapearNebuls++){
					nebul[dissapearNebuls].alpha=0;
				}
			})
		}
	}
	function checkIfCorrect(planet,target){
		goal++;
		planetsGroup.sendToBack(planet.spines)
		if(planet.tag==target.tag){
			getCoins(planet);
			target.inUse=true;
			correctParticle.x = planet.centerX;
			correctParticle.y = planet.centerY;
			correctParticle.start(true, 1200, null, 10)
			game.add.tween(planet.body).to({x:target.x,y:target.y},100,Phaser.Easing.Cubic.In,true);
			planet.text.alpha=1;
			speedTimer-=200;
			sound.play("pop")
			planet.inputEnabled=false;
			if(goal==TOTAL_PLANETS && !tutorial){
				goal=0;
				stopTimer();
			}
			if(tutorial){
				tutoPlanet++;
			}
			if(tutoPlanet==TOTAL_PLANETS && tutorial){
				tutorial=false;
				tweenActualPlanet.stop();
				reset();
				goal=0;
				hand.alpha=0
			}
		}else if(!tutorial){
			missPoint();
			for(var checkRightPlace=0; checkRightPlace<planets.length; checkRightPlace++){
				if(planet.tag==targets[checkRightPlace].tag){
					targets[checkRightPlace].inUse=true;
					game.add.tween(planet.body).to({x:positionX[checkRightPlace],y:positionY[checkRightPlace]},100,Phaser.Easing.Cubic.In,true);
					planet.text.alpha=1;
					planet.inputEnabled=false;
				}
			}
			boomParticle.x = planet.centerX
			boomParticle.y = planet.centerY
			boomParticle.start(true, 1200, null, 10)
		}
	}
	function starField(){
		star = game.make.sprite(-300, 0, "atlas.galacticPool",'star_1');
		star.scale.setTo(0.4,0.4)
		star.anchor.setTo(0.5,0.5)
		star.tint=0x00ffff

		star2 = game.make.sprite(-300, 0, "atlas.galacticPool",'star_2');
		star2.scale.setTo(0.5,0.5)
		star2.anchor.setTo(0.5,0.5)
		star2.tint=0xff0000

		star3 = game.make.sprite(-300, 0, "atlas.galacticPool",'star_3');
		star3.scale.setTo(0.5,0.5)
		star3.anchor.setTo(0.5,0.5)
		star3.tint=0xffff00

		texture = game.add.renderTexture(game.world.width, game.world.height, 'texture');
		texture2 = game.add.renderTexture(game.world.width, game.world.height, 'texture2');
		texture3 = game.add.renderTexture(game.world.width, game.world.height, 'texture3');
		
		for (var i = 0; i < max; i++)
		{
			xx[i] = Math.floor(Math.random() * game.world.width) - 400;
			yy[i] = Math.floor(Math.random() * game.world.height) - 300;
			zz[i] = Math.floor(Math.random() * 1700) - 100;

			xx2[i] = Math.floor(Math.random() * game.world.width) - 400;
			yy2[i] = Math.floor(Math.random() * game.world.height) - 300;
			zz2[i] = Math.floor(Math.random() * 1700) - 100;

			xx3[i] = Math.floor(Math.random() * game.world.width) - 400;
			yy3[i] = Math.floor(Math.random() * game.world.height) - 300;
			zz3[i] = Math.floor(Math.random() * 1700) - 100;

			a1[i]=1;
			a2[i]=1;
			a3[i]=1;
		}

	}
	function positionTimer(){
		clock=game.add.image(game.world.centerX-150,80,"atlas.time","clock")
		clock.scale.setTo(.7)
		timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
		timeBar.scale.setTo(8,.45)
		timeBar.alpha=1;
		clock.alpha=1;
		UIGroup.add(clock);
		UIGroup.add(timeBar);
		UIGroup.alpha=0;
	}
	function biggerBlackHole(lost){
		if(!lost){
			game.add.tween(blackHole.scale).to({x:blackHole.scale.x-1,y:blackHole.scale.y-1}, 500, Phaser.Easing.Linear.Out, true).onComplete.add(function(){
				sound.play("inflateballoon")
				blackHole.alpha+=0.2;
				game.add.tween(blackHole.scale).to({x:blackHole.scale.x+1.5,y:blackHole.scale.y+1.5}, 500, Phaser.Easing.Linear.Out, true)
			});
		}else{
			stopTimer()
			blackHole.alpha=1;
			game.add.tween(blackHole.scale).to({x:blackHole.scale.x-1,y:blackHole.scale.y-1}, 500, Phaser.Easing.Linear.Out, true).onComplete.add(function(){
				for(var toHole=0; toHole<TOTAL_PLANETS; toHole++){
					planets[toHole].text.alpha=0;
					targets[toHole].alpha=0;
					planets[toHole].body.data.shapes[0].sensor= false
					nebul[toHole].alpha=0;
					UIGroup.alpha=0;
					game.add.tween(planets[toHole].body).to({x:blackHole.centerX,y:blackHole.centerY},300,Phaser.Easing.Linear.In,true);
					game.add.tween(planets[toHole].spines.scale).to({x:0,y:0},300,Phaser.Easing.Linear.In,true);
					game.add.tween(planets[toHole].spines).to({alpha:0},300,Phaser.Easing.Linear.In,true);
				}
				sound.play("swallow")
				game.add.tween(blackHole.scale).to({x:blackHole.scale.x+4,y:blackHole.scale.y+4}, 1000, Phaser.Easing.Linear.Out, true).onComplete.add(function(){
					stopGame(false)
				})
			});
		}
	}
	function startTimer(time){
		var SWITCHING=false;
		tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, delayDefault)
		tweenTiempo.onComplete.add(function(){
			boomParticle.x = clock.centerX
			boomParticle.y = clock.centerY
			boomParticle.start(true, 1200, null, 10)
			for(var feedBack=0; feedBack<TOTAL_PLANETS; feedBack++){
				planets[feedBack].x=targets[feedBack].x;
				planets[feedBack].y=targets[feedBack].y;	
				planets[feedBack].text.alpha=1;
			}
			goal=0;
			giveInputs(SWITCHING)
			missPoint();
			stopTimer()
		})
	}
	function checkOverlap(spriteA, spriteB) {
		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();
		return Phaser.Rectangle.intersects(boundsA, boundsB);
	}
	function stickAnimation(){
		var START=true;

		for(var dissapearText=0; dissapearText<planets.length; dissapearText++){
			planets[dissapearText].text.alpha=0;
			targets[dissapearText].alpha=0;
		}
		game.add.tween(stick).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
			game.add.tween(stick).to({y:stick.y+200},2000,Phaser.Easing.Cubic.Out,true).onComplete.add(function(){
				game.add.tween(stick).to({y:stick.y-200},200,Phaser.Easing.Cubic.In,true).onComplete.add(function(){
					canCollide=true;
					sound.play("shoot")
					game.add.tween(stick).to({alpha: 0}, 1000, Phaser.Easing.Cubic.In, true)
					planets[8].body.velocity.y = -2000;
					stick.x=game.world.centerX-20;
					stick.y=game.world.height-100;
					stopAllPlanets(START);
				})
			})
		})
	}
	function initCoin(){
		coin = game.add.sprite(0, 0, "coin")
		coin.anchor.setTo(0.5)
		coin.scale.setTo(0.8)
		coin.animations.add('coin');
		coin.animations.play('coin', 24, true);
		coin.alpha = 0

		hand = game.add.sprite(0, 0, "hand")
		hand.anchor.setTo(0.5,0.5)
		hand.animations.add('hand')
		hand.animations.play('hand', 10, true)
		hand.alpha=0
	}
	function popObject(obj,delay){

		game.time.events.add(delay,function(){

			sound.play("cut")
			obj.alpha = 1
			game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
		},this)
	}

	function animateScene() {

		gameActive = false

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
		if(lives==0){
			biggerBlackHole(true);
		}else{
			biggerBlackHole(false);
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

		var pointsImg = pointsBar.create(-10,10,'atlas.galacticPool','xpcoins')
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

		var heartImg = group.create(0,0,'atlas.galacticPool','life_box')

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


		sound.play("gameLose")
		gameActive = false

		tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			baseSong.stop()
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number, gameIndex)		
			sceneloader.show("result")
		})
	}


	function preload(){		
		//game.stage.disableVisibilityChange = false;
		epicparticles.loadEmitter(game.load, "pickedEnergy") 
	}


	function releaseButton(obj){

		obj.parent.children[1].alpha = 1
	}
	function placePlanetsAndTargets(){
		var BOUNCE_LEVEL=1;
		var SWITCHING=true;
		fontStyleWord = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
		for(var planetsTargets=0; planetsTargets<TOTAL_PLANETS; planetsTargets++){
			planets[planetsTargets].spines=game.add.spine(0, 0, PLANETS_SPINES);
			planets[planetsTargets].spines.setSkinByName(planetsNames[planetsTargets].SKIN);
			planets[planetsTargets].spines.setAnimationByName(0, "idle", true);
			planets[planetsTargets].spines.alpha=1;
			planets[planetsTargets].spines.scale.setTo(planetsNames[planetsTargets].size,planetsNames[planetsTargets].size);
			planets[planetsTargets].body.x=positionX[planetsTargets];
			planets[planetsTargets].body.y=positionY[planetsTargets];
			planets[planetsTargets].tag=planetsNames[planetsTargets].word;
			planets[planetsTargets].spines.x=positionX[planetsTargets];
			planets[planetsTargets].spines.y=positionY[planetsTargets];
			planets[planetsTargets].text= new Phaser.Text(planetsGroup.game, 0, 0, "", fontStyleWord)
			planets[planetsTargets].text.x=positionX[planetsTargets]+50;
			planets[planetsTargets].text.y=positionY[planetsTargets];
			planets[planetsTargets].text.setText(planetsNames[planetsTargets].word);
			targets[planetsTargets]=game.add.sprite(0,0,"atlas.galacticPool","destino");
			targets[planetsTargets].x=positionX[planetsTargets];
			targets[planetsTargets].y=positionY[planetsTargets];
			targets[planetsTargets].scale.setTo(planetsNames[planetsTargets].size,planetsNames[planetsTargets].size);
			targets[planetsTargets].anchor.setTo(0.5,0.5);
			targets[planetsTargets].tag=planetsNames[planetsTargets].word;
			targets[planetsTargets].alpha=0;
			targets[planetsTargets].inUse=false;
			if(planetsTargets==8){
				planets[planetsTargets].body.x=game.world.centerX
				planets[planetsTargets].body.y=game.world.height-100
				planets[planetsTargets].text.x=game.world.centerX+50;
				planets[planetsTargets].text.y=game.world.height-100;
			}
		}
		for(var addInRest=0; addInRest<TOTAL_PLANETS; addInRest++){
			planetsGroup.add(planets[addInRest].spines);
			targetsGroup.add(targets[addInRest]);
		}
		for(var addInGroup=0; addInGroup<TOTAL_PLANETS; addInGroup++){
			planetsGroup.add(planets[addInGroup].text);
			planetsGroup.add(nebul[addInGroup]);
		}
	}

	function createBackground(){

		starField();
		var pivotX;
		var pivotY=200;
		var PLANETS_TOTAL=9;
		var back

		backgroundGroup = game.add.group()
		sceneGroup.add(backgroundGroup)

		targetsGroup = game.add.group()
		sceneGroup.add(targetsGroup)

		planetsGroup = game.add.group()
		sceneGroup.add(planetsGroup)

		UIGroup = game.add.group()
		sceneGroup.add(UIGroup)

		coinsGroup = game.add.group()
		sceneGroup.add(coinsGroup)

		physicPlanets = game.add.group();
		sceneGroup.add(physicPlanets);

		planetsGroup.add(game.add.sprite(0, 0, texture));
		planetsGroup.add(game.add.sprite(0, 0, texture2));
		planetsGroup.add(game.add.sprite(0, 0, texture3));

		positionTimer()

		var pivotXPool=clock.x+20;
		var pivotYPool=clock.y+200;

		//Aqui inicializo los botones

		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.setImpactEvents(true);
		game.physics.p2.restitution = 0.8;
		game.physics.p2.updateBoundsCollisionGroup();

		var allPlanets= game.physics.p2.createCollisionGroup();

		physicPlanets.enableBody=true;
		physicPlanets.physicsBodyType = Phaser.Physics.P2JS;

		var back=game.add.tileSprite(0,0,game.world.width,game.world.height,"tile_back");
		backgroundGroup.add(back)

		controles=game.input.keyboard.createCursorKeys();

		correctParticle = createPart("star")
		sceneGroup.add(correctParticle)
		wrongParticle = createPart("wrong")
		sceneGroup.add(wrongParticle)
		boomParticle = createPart("smoke")
		sceneGroup.add(boomParticle)


		blackHole=game.add.spine(game.world.centerX, game.world.centerY, "blackHole");
		blackHole.setSkinByName("normal");
		blackHole.alpha=0.3;
		blackHole.setAnimationByName(0, "black_hole", true);
		blackHole.scale.setTo(0.2,0.2)
		backgroundGroup.add(blackHole)

		planetsNames=[
			{SKIN:"neptune",word:localization.getString(localizationData,"planet9"),size:0.8},
			{SKIN:"uranus",word:localization.getString(localizationData,"planet8"),size:0.8},
			{SKIN:"saturn",word:localization.getString(localizationData,"planet7"),size:0.8},
			{SKIN:"jupiter",word:localization.getString(localizationData,"planet6"),size:0.9},
			{SKIN:"mars",word:localization.getString(localizationData,"planet5"),size:0.7},
			{SKIN:"earth",word:localization.getString(localizationData,"planet4"),size:0.6},
			{SKIN:"venus",word:localization.getString(localizationData,"planet3"),size:0.6},
			{SKIN:"mercury",word:localization.getString(localizationData,"planet2"),size:0.6},
			{SKIN:"sun",word:localization.getString(localizationData,"planet1"),size:0.8}
		];
		wall=game.add.sprite(game.world.centerX,-350,"atlas.galacticPool","fondo");
		wall.scale.setTo(game.world.width,1)
		physicPlanets.add(wall)
		wall.alpha=0;
		wall.body.setCollisionGroup(allPlanets);
		wall.body.kinematic=true;
		wall.body.collides(allPlanets);
		physicPlanets.add(wall)
		for(var placingPositions=0; placingPositions<PLANETS_TOTAL; placingPositions++){
			planets[placingPositions]=physicPlanets.create(0,0,"atlas.galacticPool",planetsNames[placingPositions].SKIN);
			planets[placingPositions].anchor.setTo(0.5,0.5);
			planets[placingPositions].scale.setTo(0.5,0.5);
			planets[placingPositions].alpha=0;
			planets[placingPositions].body.x=placingPositions*10;
			planets[placingPositions].body.setCircle(35);
			planets[placingPositions].body.setZeroVelocity();
			planets[placingPositions].body.setCollisionGroup(allPlanets);
			planets[placingPositions].body.collides(allPlanets);
			positionX[placingPositions]=game.rnd.integerInRange(game.world.centerX-100, game.world.centerX+100);
			positionY[placingPositions]=pivotY;
			pivotY+=80;
		}
		for(var poolPositions=0; poolPositions<PLANETS_TOTAL; poolPositions++){
			positionPoolX[poolPositions]=pivotXPool;
			positionPoolY[poolPositions]=pivotYPool;
			pivotXPool+=90;
			if(poolPositions==3){
				pivotXPool=positionPoolX[1]-50;
				pivotYPool=pivotYPool+70;
			}
			if(poolPositions==6){
				pivotXPool=positionPoolX[4]+85;
				pivotYPool=pivotYPool+80;
			}
		}
		planets[PLANETS_TOTAL-1].scale.setTo(0.4,0.4);


		for(var positionNebuls=0;positionNebuls<TOTAL_PLANETS;positionNebuls++){
			nebul[positionNebuls]=game.add.sprite(0,0,"atlas.galacticPool","nebula");
			nebul[positionNebuls].alpha=0;
			nebul[positionNebuls].anchor.setTo(0.5,0.5);
			nebul[positionNebuls].x=planets[positionNebuls].x;
			nebul[positionNebuls].y=planets[positionNebuls].y;
		}
		stick=game.add.sprite(game.world.centerX-20,game.world.height-100,"atlas.galacticPool","cue");
		planetsGroup.add(stick)
		placePlanetsAndTargets();
		//positionTimer();
		initCoin();


	}

	function getCoins(player){
		var coin=coinsGroup.getFirstDead();
		var index;

		if(coin==undefined){
			game["coin"+index] = game.add.sprite(0, 0, "coin")
			game["coin"+index].anchor.setTo(0.5)
			game["coin"+index].scale.setTo(0.8)
			game["coin"+index].animations.add('coin')
			game["coin"+index].animations.play('coin', 24, true)
			game["coin"+index].alpha = 0
			coinsGroup.add(game["coin"+index])
			coin=game["coin"+index];
			index++;
			addCoin(coin,player)
		}else{
			addCoin(coin,player)
		}
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


	function update(){

		if(startGame){
			epicparticles.update();
			if(tutorial && !handFollowing){
				handFollowing=true;
				handFollow(tutoPlanet);
			}
			for(var followPlanetSpine=0; followPlanetSpine<planets.length; followPlanetSpine++){
				if(planets[followPlanetSpine].spines){
					planets[followPlanetSpine].spines.x=planets[followPlanetSpine].x;
					planets[followPlanetSpine].spines.y=planets[followPlanetSpine].y;
				}
			}
			if(lives>0){
				movingStars()
			}else{
				texture.clear();
				texture2.clear();
				texture3.clear();
			}
		}
	}

	function movingStars(){

		texture.clear();
		texture2.clear();
		texture3.clear();

		for (var i = 0; i < max; i++)
		{
			var perspective = distance / (distance - zz[i]);
			var x = game.world.centerX + xx[i] * perspective;
			var y = game.world.centerY+ yy[i] * perspective;


			zz[i] -= speedStars;

			if (zz[i] < 100)
			{
				zz[i] = 950;
			}
			var newStar=game.rnd.integerInRange(0,2);
			star.alpha=0.9;
			texture.renderXY(star, x, y);
		}
		for (var i = 0; i < max/2; i++)
		{
			var perspective = distance / (distance - zz2[i]);
			var x = game.world.centerX + xx2[i] * perspective;
			var y = game.world.centerY+ yy2[i] * perspective;

			zz2[i] -= speedStars;
			if (zz2[i] < 100)
			{
				zz2[i] = 950;
			}
			star2.alpha=0.7;
			texture2.renderXY(star2, x, y);
			var perspective = distance / (distance - zz3[i]);
			var x = game.world.centerX + xx3[i] * perspective;
			var y = game.world.centerY+ yy3[i] * perspective;

			zz3[i] -= speedStars;
			if (zz3[i] < 100)
			{
				zz3[i] = 950;
			}	
			star3.alpha=0.5
			texture3.renderXY(star3, x, y);
		}
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
		particle.makeParticles('atlas.galacticPool',key);
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

				fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

				var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
				particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
				particlesGroup.add(particle)

			}else{
				var particle = game.add.emitter(0, 0, 100);

				particle.makeParticles('atlas.galacticPool',tag);
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
		createParticles('wrong',1)
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

		var exp = sceneGroup.create(0,0,'atlas.galacticPool','cakeSplat')
		exp.x = posX
		exp.y = posY
		exp.anchor.setTo(0.5,0.5)

		exp.scale.setTo(6,6)
		game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
		var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)

		particlesNumber = 8

		var particlesGood = game.add.emitter(0, 0, 100);

		particlesGood.makeParticles('atlas.galacticPool','smoke');
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
		name: "galacticPool",
		localizationData:localizationData,
		preload:preload,
		update:update,
		create: function(event){


			sceneGroup = game.add.group()
			sceneGroup.alpha=1;
			createBackground()
			addParticles()
			//			baseSong = sound.play("acornSong", {loop:true, volume:0.6})

			baseSong = game.add.audio('acornSong')
			game.sound.setDecodedCallback(baseSong, function(){
				baseSong.loopFull(0.6)
			}, this);

			game.onPause.add(function(){
				game.sound.mute = true
			} , this);

			game.onResume.add(function(){
				game.sound.mute = false
			}, this);

			initialize()
			createPointsBar()
			createHearts()
			createTutorial()

			buttons.getButton(baseSong,sceneGroup)

			animateScene()

		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()