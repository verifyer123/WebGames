var soundsPath = "../../shared/minigames/sounds/";
//#region Assets
var flag = function () {

	var localizationData = {
		"EN": {
			"howTo": "How to Play?",
			"moves": "Moves left",
			"stop": "Stop!",
			"canada": "Canada",
			"argentina": "Argentina",
			"mexico": "Mexico",
			"brazil": "Brazil",
			"usa": "USA",
			"angola": "Angola",
			"nigeria": "Nigeria",
			"senegal": "Senegal",
			"somalia": "Somalia",
			"spain": "Spain",
			"france": "France",
			"germany": "Germany",
			"japan": "Japan",
			"china": "China",
			"turkey": "Turkey",
			"russia": "Russia",
			"australia": "Australia",
			"newzealand": "New Zealand",
			"samoa": "Samoa",
			"tonga": "Tonga",
			/*"tutorial_image_desktop" : "images/flag/tutorial_image_desktop_EN.png",
			"tutorial_image_movil" : "images/flag/tutorial_image_movil_EN.png"*/
		},
		"ES": {
			"moves": "Movimientos extra",
			"howTo": "¿Cómo jugar?",
			"stop": "¡Detener!",
			"canada": "Canadá",
			"argentina": "Argentina",
			"mexico": "México",
			"brazil": "Brasil",
			"usa": "EU",
			"angola": "Angola",
			"nigeria": "Nigeria",
			"senegal": "Senegal",
			"somalia": "Somalia",
			"spain": "España",
			"france": "Francia",
			"germany": "Alemania",
			"japan": "Japón",
			"china": "China",
			"turkey": "Turquía",
			"russia": "Rusia",
			"australia": "Australia",
			"newzealand": "Nueva Zelanda",
			"samoa": "Samoa",
			"tonga": "Tonga",
			/*"tutorial_image_desktop" : "images/flag/tutorial_image_desktop_ES.png",
			"tutorial_image_movil" : "images/flag/tutorial_image_movil_ES.png"*/
		}
	}

	var assets = {
		atlases: [
			{
				name: "atlas.flag",
				json: "images/flag/atlas.json",
				image: "images/flag/atlas.png",
			},

		],
		images: [
			/*{
				name: "tutorial_image",
				file: "%lang"
			}*/
		],
		sounds: [
			{
				name: "magic",
				file: soundsPath + "magic.mp3"
			},
			{
				name: "cut",
				file: soundsPath + "cut.mp3"
			},
			{
				name: "wrong",
				file: soundsPath + "wrong.mp3"
			},
			{
				name: "explosion",
				file: soundsPath + "laserexplode.mp3"
			},
			{
				name: "pop",
				file: soundsPath + "pop.mp3"
			},
			{
				name: "whoosh",
				file: soundsPath + "whoosh.mp3"
			},
			{
				name: "gameLose",
				file: soundsPath + "gameLose.mp3"
			},
			{
				name: "spaceShip",
				file: soundsPath + "whoosh.mp3"
			},
			{
				name: "fly",
				file: soundsPath + "inflateballoon.mp3"
			},
			{
				name: "spaceSong",
				file: soundsPath + "songs/musicVideogame9.mp3"
			}
		],
		spritesheets: [
			{
				name: "coin",
				file: "images/flag/coin.png",
				width: 122,
				height: 123,
				frames: 12
			},
			{
				name: "hand",
				file: "images/flag/hand.png",
				width: 115,
				height: 111,
				frames: 23
			}
		],
		spines: [
			{
				name: "robot",
				file: "images/spines/razzle_dazzle.json"
			},
			{
				name: "helicopter",
				file: "images/spines/helicopter.json"
			},
			{
				name: "box",
				file: "images/spines/box.json"
			}
		]
	}
	//#endregion
	//#region Variables
	var gameIndex = 8;
	var lives = null;
	var sceneGroup = null;
	var tutoGroup;
	var heartsGroup = null;
	var pointsBar;
	var coin;
	var particleCorrect;
	var particleWrong;
	var hand;

	var laneSpeed;
	var gameActive;
	var robot;
	var tagsToUse;
	var correctIndex;
	var otherIndex;
	var anotherIndex;
	var offsetObjs;
	var lanesGroup;
	var boxesGroup;
	var spaceSong;
	//var objectsGroup;
	var usedObjects;
	var moveSideLeft;
	var moveSideRight;
	var flagGroup;
	var grabGroup;
	var typeRobot;
	var levelCounter;
	var levelChange;
	var levelZero;
	var moveSideUp;
	var moveSideDown;
	//var levelZeroColocation = [1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1];
	var steps;
	var directionMove;
	var tweenHand;
	var historialAns;
	var flagList = ['angola', 'argentina', 'france', 'canada', 'china', 'mexico', 'usa', 'spain', 'japan', 'brazil', 'nigeria', 'senegal', 'somalia', 'germany', 'turkey', 'russia', 'australia', 'newzealand', 'samoa', 'tonga'];
	//#endregion
	//#region Basic functions
	function loadSounds() {
		sound.decode(assets.sounds);
	}

	function initialize() {

		game.stage.backgroundColor = "#ffffff";
		lives = 3;
		laneSpeed = 2;
		tagsToUse = ['enemy'];
		offsetObjs = 300;
		gameActive = false;
		levelCounter = 0;
		levelChange = 6;
		levelZero = true;
		moveSideLeft = false;
		moveSideRight = false;
		moveSideUp = false;
		moveSideDown = false;
		steps = 0;
		directionMove = -1;
		historialAns = [];
		loadSounds();
	}

	function preload() {
		addTutorialImage();
		game.stage.disableVisibilityChange = false;
	}

	function stopGame(win) {

		sound.play("wrong");
		gameActive = false;

		var tweenScene = game.add.tween(sceneGroup).to({ alpha: 0 }, 500, Phaser.Easing.Cubic.In, true, 1300);
		tweenScene.onComplete.add(function () {

			spaceSong.stop();
			var resultScreen = sceneloader.getScene("result");
			resultScreen.setScore(true, pointsBar.number, gameIndex);
			sceneloader.show("result");
			sound.play("gameLose");
		});
	}

	function createTutorial() {
		tutoGroup = game.add.group();
		sceneGroup.add(tutoGroup);

		tutorialHelper.createTutorialGif(tutoGroup, onClickPlay);
	}

	function onClickPlay() {
		tutoGroup.y = -game.world.height;
		setScene();
	}

	function update() {

		if (!gameActive) {
			this.swipe.direction = null;
			return;
		}

		if (!levelZero) {
			for (var i = 0; i < lanesGroup.length; i++) {

				var lane = lanesGroup.children[i];
				if (lane.left == 0) {
					lane.tilePosition.x += laneSpeed;
				} else if (lane.left == 1) {
					lane.tilePosition.x -= laneSpeed;
				}
			}
		}

		var direction = this.swipe.check();

		if (direction !== null && gameActive) {
			switch (direction.direction) {
				case this.swipe.DIRECTION_UP:
					if (moveSideUp) {
						moveRobot('up');
						directionMove = 0;
					}
					break;
				case this.swipe.DIRECTION_DOWN:
					if (moveSideDown) {
						moveRobot('down');
						directionMove = 1;
					}
					break;
				case this.swipe.DIRECTION_LEFT:
					if (moveSideLeft) {
						moveRobot('left');
						directionMove = 2;
					}
					break;
				case this.swipe.DIRECTION_RIGHT:
					if (moveSideRight) {
						moveRobot('right');
						directionMove = 3;
					}
					break;
			}
		}

		checkObjects();
		if (levelZero) {
			checkObjectsLevelZero();
		}
	}

	function createPointsBar() {

		pointsBar = game.add.group();
		pointsBar.x = game.world.width;
		pointsBar.y = 0;
		sceneGroup.add(pointsBar);

		var pointsImg = pointsBar.create(-10, 10, 'atlas.flag', 'xpcoins');
		pointsImg.anchor.setTo(1, 0);

		var fontStyle = { font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center" };
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle);
		pointsText.x = -pointsImg.width * 0.45;
		pointsText.y = pointsImg.height * 0.25;
		pointsBar.add(pointsText);

		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

		pointsBar.text = pointsText;
		pointsBar.number = 0;

	}

	function addPoint(number) {
		sound.play("magic");
		pointsBar.number += number;
		pointsBar.text.setText(pointsBar.number);

		var scaleTween = game.add.tween(pointsBar.scale).to({ x: 1.05, y: 1.05 }, 200, Phaser.Easing.linear, true);
		scaleTween.onComplete.add(function () {
			game.add.tween(pointsBar.scale).to({ x: 1, y: 1 }, 200, Phaser.Easing.linear, true);
		})

		addNumberPart(pointsBar.text, '+' + number);
	}

	function addCoin(obj) {
		coin.x = obj.centerX;
		coin.y = obj.centerY;
		var time = 300;

		game.add.tween(coin).to({ alpha: 1 }, time, Phaser.Easing.linear, true);

		game.add.tween(coin).to({ y: coin.y - 100 }, time + 200, Phaser.Easing.Cubic.InOut, true).onComplete.add(function () {
			game.add.tween(coin).to({ x: pointsBar.centerX, y: pointsBar.centerY }, 200, Phaser.Easing.Cubic.InOut, true).onComplete.add(function () {
				game.add.tween(coin).to({ alpha: 0 }, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function () {
					addPoint(1);
				});
			});
		});
	}

	function createCoin() {
		coin = game.add.sprite(0, 0, "coin");
		coin.anchor.setTo(0.5);
		coin.scale.setTo(0.8);
		coin.animations.add('coin');
		coin.animations.play('coin', 24, true);
		coin.alpha = 0;
	}

	function addNumberPart(obj, number) {

		var fontStyle = { font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center" };

		var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle);
		pointsText.x = obj.world.x;
		pointsText.y = obj.world.y;
		pointsText.anchor.setTo(0.5, 0.5);
		sceneGroup.add(pointsText);

		game.add.tween(pointsText).to({ y: pointsText.y + 100 }, 800, Phaser.Easing.linear, true);
		game.add.tween(pointsText).to({ alpha: 0 }, 250, null, true, 500);

		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

	}

	function createHearts() {

		heartsGroup = game.add.group();
		heartsGroup.y = 10;
		sceneGroup.add(heartsGroup);

		var pivotX = 10;
		var group = game.add.group();
		group.x = pivotX;
		heartsGroup.add(group);

		var heartImg = group.create(0, 0, 'atlas.flag', 'life_box');

		pivotX += heartImg.width * 0.45;

		var fontStyle = { font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center" };
		var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle);
		pointsText.x = pivotX;
		pointsText.y = heartImg.height * 0.15;
		pointsText.setText('X ' + lives);
		heartsGroup.add(pointsText);

		pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

		heartsGroup.text = pointsText;

	}

	function missPoint() {

		sound.play("wrong");
		lives--;
		heartsGroup.text.setText('X ' + lives);
		gameActive = false;

		var scaleTween = game.add.tween(heartsGroup.scale).to({ x: 0.7, y: 0.7 }, 200, Phaser.Easing.linear, true);
		scaleTween.onComplete.add(function () {
			game.add.tween(heartsGroup.scale).to({ x: 1, y: 1 }, 200, Phaser.Easing.linear, true);
		})

		if (lives == 0) {
			stopGame(false);
		} else {
			restartPlayer();
		}

		addNumberPart(heartsGroup.text, '-1');
	}

	function createPart(key) {
		var particle = game.add.emitter(0, 0, 100);

		particle.makeParticles('atlas.flag', key);
		particle.minParticleSpeed.setTo(-200, -50);
		particle.maxParticleSpeed.setTo(200, -100);
		particle.minParticleScale = 0.6;
		particle.maxParticleScale = 1;
		particle.gravity = 150;
		particle.angularDrag = 30;

		return particle;
	}
	//#endregion
	//#region Own functions
	function addTutorialImage() {
		var inputName = 'movil';
		if (game.device.desktop) {
			inputName = 'desktop';
		}
		game.load.image("tutorial_image", "images/flag/" + localization.getLanguage() + "_" + inputName + ".png");
	}

	function changeHand(step) {
		hand.x = robot.x;
		hand.y = robot.y;
		if (tweenHand != null) {
			tweenHand.stop();
		}
		switch (steps) {
			case 0:
				hand.y += 80;
				tweenHandAnimation(0);
				break;
			case 1:
				hand.x += 80;
				tweenHandAnimation(2);
				break;
			// case 2:
			// 	hand.y += 80;
			// 	tweenHandAnimation(2);
			// 	break;
			// case 3:
			// 	hand.y += 80;
			// 	tweenHandAnimation(1);
			// 	break;
			// case 4:
			// 	hand.x -= 80;
			// 	tweenHandAnimation(2);
			// 	break;
			// case 5:
			// 	hand.y += 80;
			// 	tweenHandAnimation(2);
			// 	break;
			// case 6:
			// 	hand.y += 80;
			// 	tweenHandAnimation(3);
			// 	break;
			// case 7:
			// 	hand.y -= 160;
			// 	tweenHandAnimation(2);
			// 	break;
			// case 8:
			// 	hand.y += 80;
			// 	tweenHandAnimation(1);
			// 	break;
			// case 9:
			// 	hand.x -= 80;
			// 	hand.y -= 80;
			// 	tweenHandAnimation(2);
			// 	break;
			// case 10:
			// 	game.add.tween(hand).to({ alpha: 0 }, 250, "Linear", true);
			// 	break;
		}
	}

	function tweenHandAnimation(typeAnim) {
		if (typeAnim == 0) {
			tweenHand = game.add.tween(hand).to({ x: hand.x + 120 }, 800, Phaser.Easing.Linear.In, true, 0, -1);
		}
		// else if (typeAnim == 1) {
		// 	tweenHand = game.add.tween(hand).to({ x: hand.x - 120 }, 800, Phaser.Easing.Linear.In, true, 0, -1);
		// } else if (typeAnim == 2) {
		// 	tweenHand = game.add.tween(hand).to({ y: hand.y + 120 }, 800, Phaser.Easing.Linear.In, true, 0, -1);
		// }
		else if (typeAnim == 3) {
			tweenHand = game.add.tween(hand).to({ y: hand.y - 120 }, 800, Phaser.Easing.Linear.In, true, 0, -1);
		}
	}

	function checkObjectsLevelZero() {
		switch (steps) {
			case 0:
				moveSideDown = moveForwarSteps(1);
				break;
			case 1:
				moveSideRight = moveForwarSteps(3);
				break;
			case 2:
				moveSideLeft = true;
				moveSideRight = true;
				moveSideUp = true;
				moveSideDown = true;
				levelZero = false;
				game.add.tween(hand).to({ alpha: 0 }, 250, "Linear", true);
				for (var i = 0; i < 8; i++) {
					addObject();
				}
				break;
			// case 2:
			// 	moveSideDown = moveForwarSteps(1);
			// 	break;
			// case 3:
			// 	moveSideDown = moveForwarSteps(1);
			// 	break;
			// case 4:
			// 	moveSideLeft = moveForwarSteps(2);
			// 	break;
			// case 5:
			// 	moveSideDown = moveForwarSteps(1);
			// 	break;
			// case 6:
			// 	moveSideDown = moveForwarSteps(1);
			// 	break;
			// case 7:
			// 	moveSideUp = moveForwarSteps(0);
			// 	break;
			// case 8:
			// 	moveSideDown = moveForwarSteps(1);
			// 	break;
			// case 9:
			// 	moveSideLeft = moveForwarSteps(2);
			// 	break;
			// case 10:
			// 	moveSideDown = moveForwarSteps(1);
			// 	break;
			// case 11:
			// 	game.add.tween(objectsGroup).to({ alpha: 0 }, 1000, "Linear", true).onComplete.add(function () {
			// 		moveSideLeft = true;
			// 		moveSideRight = true;
			// 		moveSideUp = true;
			// 		moveSideDown = true;
			// 		objectsGroup.callAll('kill');
			// 		objectsGroup.destroy();
			// 		levelZero = false;
			// 	});
			// 	break;
		}

	}

	function moveForwarSteps(directionTo) {
		if (directionMove == directionTo) {
			changeHand(steps);
			steps++;
			directionMove = -1;
			return false;
		}
		return true;
	}

	function restartPlayer() {

		gameActive = false
		//robot.alpha = 0

		game.time.events.add(1000, function () {

			for (var i = 0; i < boxesGroup.length; i++) {
				var box = boxesGroup.children[i]
				box.anim.setAnimationByName(0, "idle", true);
			}

			robot.x = robot.initX;
			robot.y = robot.initY;
			robot.alpha = 1;
			robot.index = 0;
			robot.anim.setAnimationByName(0, "idle", true);//IDLEBOX

			sound.play("cut");
			game.add.tween(robot).from({ y: -50 }, 500, "Linear", true).onComplete.add(function () {
				gameActive = true;
			})
		})
	}

	function addObject(name) {

		Phaser.ArrayUtils.shuffle(tagsToUse);

		var tag = name || tagsToUse[0];

		for (var i = 0; i < usedObjects.length; i++) {

			var obj = usedObjects.children[i];
			if (!obj.used && obj.tag == tag) {

				activateObject(obj);
				break;
			}
		}
	}

	function activateObject(obj) {

		obj.alpha = 1;
		obj.used = false;

		var laneToUse = game.rnd.integerInRange(1, 5);

		obj.lane = lanesGroup.children[laneToUse];
		if (obj.lane.left == 0) {
			obj.x = -100;
			obj.scale.x = Math.abs(obj.scale.x) * -1;
		} else {
			obj.x = game.width + 100;
			obj.scale.x = Math.abs(obj.scale.x);
		}

		obj.y = obj.lane.y + obj.lane.height * 0.65;
		var posX = obj.x;
		var posY = obj.y;

		while (checkPosObj(posX, posY)) {
			if (obj.lane.left == 0) {
				posX -= offsetObjs;
			} else {
				posX += offsetObjs;
			}
		}

		obj.x = posX;
		obj.used = true;
	}

	function checkPosObj(posX, posY) {
		var samePos = false;
		for (var i = 0; i < usedObjects.length; i++) {
			var obj = usedObjects.children[i];

			if (Math.abs(obj.x - posX) < 160 && Math.abs(obj.y - posY) < 25 && obj.used) {
				samePos = true;
			}
		}
		return samePos;
	}

	function setScene() {
		if (!levelZero) {
			for (var i = 0; i < 8; i++) {
				addObject();
			}
		}

		setCountrys();

		var pivotX;
		if (levelCounter < levelChange) {
			pivotX = game.world.centerX - 150;
		} else {
			pivotX = game.world.centerX - 200;
		}
		for (var i = 0; i < boxesGroup.length; i++) {

			var box = boxesGroup.children[i];

			box.alpha = 1;
			game.add.tween(box).from({ y: game.world.height * 1.1 }, 500, "Linear", true);
			box.anim.setAnimationByName(0, "idle", true);
			box.x = pivotX;
			if (levelCounter < levelChange) {
				pivotX += 300;
			} else {
				pivotX += 200;
			}

		}
		if (levelCounter < levelChange) {
			boxesGroup.children[2].alpha = 0;
		}

		game.time.events.add(500, function () {

			sound.play("cut");
			robot.alpha = 1;
			game.add.tween(robot).from({ y: -50 }, 500, "Linear", true).onComplete.add(function () {
				gameActive = true;
				if (levelZero) {
					hand.x = robot.x;
					hand.y = robot.y;
					game.add.tween(hand).to({ alpha: 1 }, 250, "Linear", true);
					tweenHand = game.add.tween(hand).to({ y: hand.y + 80 }, 800, Phaser.Easing.Linear.In, true, 0, -1);
				}
			});
		});
	}

	function setCountrys() {

		correctIndex = game.rnd.integerInRange(0, flagList.length - 1);
		otherIndex = correctIndex;
		var indexList = [];
		var repeatRandom = false;
		if (levelCounter < levelChange) {
			while (otherIndex == correctIndex) {
				otherIndex = game.rnd.integerInRange(0, flagList.length - 1);
				repeatRandom = checkIfRepeat();
				if(repeatRandom){
					otherIndex = correctIndex;
					repeatRandom = false;
				}
			}
			indexList = [correctIndex, otherIndex];
		} else {
			anotherIndex = correctIndex;
			while (otherIndex == correctIndex) {
				otherIndex = game.rnd.integerInRange(0, flagList.length - 1);
				while (anotherIndex == correctIndex) {
					anotherIndex = game.rnd.integerInRange(0, flagList.length - 1);
				}
				repeatRandom = checkIfRepeat();
				if (otherIndex == anotherIndex || repeatRandom) {
					anotherIndex = correctIndex;
					otherIndex = correctIndex;
					repeatRandom = false;
				}
			}
			indexList = [correctIndex, otherIndex, anotherIndex];
		}
		console.log("" + historialAns);
		historialAns = indexList;
		//if (!levelZero) {
		Phaser.ArrayUtils.shuffle(indexList);
		//}

		for (var i = 0; i < boxesGroup.length; i++) {

			var box = boxesGroup.children[i];
			box.text.setText(localization.getString(localizationData, flagList[indexList[i]]));
			box.index = indexList[i];
		}

		//var skinToUse = localization.getString(localizationData,flagList[correctIndex]);
		flagGroup.children[0].children[0].loadTexture('atlas.flag', flagList[correctIndex], 0, false);
		//console.log(flagList[correctIndex] + ' skin');

		robot.index = 0;
		robot.anim.setAnimationByName(0, "idle", true);//IDLEBOX
		//robot.anim.setSkinByName(flagList[correctIndex]);
		robot.flagIndex = correctIndex;

	}

	function checkIfRepeat(){
		var repeatProcess = false;
		for(var h=0; h<historialAns.length; h++){
			if(historialAns[h] == otherIndex){
				repeatProcess = true;
			}
			if(historialAns[h] == correctIndex){
				repeatProcess = true;
			}
			if(historialAns.length==3){
				if(historialAns[h] == anotherIndex){
					repeatProcess = true;
				}
			}
		}
		return repeatProcess;
	}

	function deactivateObject(obj) {

		obj.setAnimationByName(0, "unhit", false);
		obj.alpha = 1;
		obj.lane = null;
		obj.used = false;

	}

	function createBackground() {
		lanesGroup = game.add.group();
		sceneGroup.add(lanesGroup);

		var pivotY = 0;

		for (var i = 0; i < 8; i++) {

			var tileName;
			var left = 0;
			var tileHeight = 128;

			if (i % 2 == 0) {
				tileName = 'leftP';
				left = 1;
			} else {
				tileName = 'rightP';
			}

			if (i == 0 || i > 5) {
				tileName = 'safeP';
				left = -10;
				tileHeight = 160;
			}

			var tile = game.add.tileSprite(0, pivotY, game.world.width + 10, tileHeight, 'atlas.flag', tileName);
			tile.left = left;
			lanesGroup.add(tile);

			pivotY += tile.height;
		}

		var boxesLeft = game.add.sprite(0, 0, 'atlas.flag', 'scenery_a');
		sceneGroup.add(boxesLeft);
		var boxesRight = game.add.sprite(game.width - 118, -15, 'atlas.flag', 'scenery_b');
		sceneGroup.add(boxesRight);
	}

	function checkObjects() {
		if (!levelZero) {
			if (robot.index > 0 && robot.index < 6) {
				var lane = lanesGroup.children[robot.index];
				if (lane.left == 0) {
					robot.x += laneSpeed;
				} else {
					robot.x -= laneSpeed;
				}
			}
		}

		if ((robot.x < 0 && (robot.y > 100 || robot.y < game.height - 100)) || (robot.x > game.width && (robot.y > 100 || robot.y < game.height - 100))) {
			animationMissPoint();
			particleWrong.x = robot.x;
			particleWrong.y = robot.y;
			particleWrong.start(true, 1000, null, 5);
			missPoint();
		}
		//<<Limitar movimiento en piso izquierdo
		if ((robot.x < 70 && (robot.y < 100)) || (robot.x < 70 && (robot.y > game.height - 100))) {
			moveSideLeft = false;
		} else if (!levelZero) {
			moveSideLeft = true;
		}
		//<<Limitar movimiento en piso derecho
		if ((robot.x > game.width - 70 && (robot.y < 100)) || (robot.x > game.width - 70 && (robot.y > game.height - 100))) {
			moveSideRight = false;
		} else if (!levelZero) {
			moveSideRight = true;
		}

		for (var i = 0; i < usedObjects.length; i++) {
			var obj = usedObjects.children[i]

			if (obj.used) {
				if (obj.lane.left == 0) {
					obj.x += laneSpeed;
				} else {
					obj.x -= laneSpeed;
				}

				if (checkOverlap(robot.hitBox, obj.hitBox) && obj.used && robot.active) {
					obj.setAnimationByName(0, 'hit', false);
					animationMissPoint();
					sound.play("explosion");
					particleWrong.x = robot.x;
					particleWrong.y = robot.y;
					particleWrong.start(true, 1000, null, 10);
					missPoint();
					break;
				}

				//<<Funciones para reutilizar enemigos
				//if(obj.lane && obj.lane.left == 0 && obj.world.x > game.world.width + 50){
				if (obj.lane && obj.lane.left == 0 && obj.x > game.width + 100) {
					deactivateObject(obj);
					//createAsset('enemy',0.8,1);
					addObject();
				}

				//if(obj.lane && obj.lane.left == 1 && obj.world.x < -50){
				if (obj.lane && obj.lane.left == 1 && obj.x < -100) {
					deactivateObject(obj);
					//createAsset('enemy',0.8,1);
					addObject();
				}
			}
		}

		for (var i = 0; i < boxesGroup.length; i++) {

			var box = boxesGroup.children[i]

			if (checkOverlap(robot.hitBox, box)) {
				gameActive = false;
				if (robot.flagIndex == box.index) {

					particleCorrect.x = robot.x;
					particleCorrect.y = robot.y;
					particleCorrect.start(true, 1000, null, 5);
					//addPoint(1);
					addCoin(robot);
					laneSpeed += 0.35;
					levelCounter++;
					//box.anim.setAnimationByName(0,"win",true);
					robot.anim.setAnimationByName(0, "win", true);
					addObject();

					hideScene();
					//gameActive = false;

				} else {
					//missPoint()
					//box.anim.setAnimationByName(0,"lose",true)
					if (lives - 1 == 0) {
						robot.anim.setAnimationByName(0, "lose", false);
					} else {
						robot.anim.setAnimationByName(0, "hit", false);
					}
					sound.play("explosion");
					particleWrong.x = robot.x;
					particleWrong.y = robot.y;
					particleWrong.start(true, 1000, null, 5);
					game.add.tween(robot).to({ angle: robot.angle + 360 }, 500, "Linear", true).onComplete.add(function () {
						game.add.tween(robot).to({ alpha: 0 }, 1000, "Linear", true).onComplete.add(function () {
							missPoint();
						});
					});
				}
				break;
			}
		}
	}

	function animationMissPoint(){
		if (lives - 1 == 0) {
			robot.anim.setAnimationByName(0, "lose", false);
		} else {
			robot.anim.setAnimationByName(0, "hit", false).onComplete = function(){
				game.add.tween(robot).to({ alpha: 0 }, 500, "Linear", true).onComplete.add(function(){
					robot.alpha = 1;
				})
			};
		}
	}

	function hideScene() {

		game.add.tween(robot.children[1]).to({ y: robot.children[1].y + 30 }, 500, "Linear", true).onComplete.add(function () {
			for (var i = 0; i < boxesGroup.length; i++) {

				var box = boxesGroup.children[i]
				game.add.tween(box).to({ y: game.world.height * 1.2 }, 500, "Linear", true);
			}
			game.add.tween(robot.children[1]).to({ y: robot.children[1].y + 200 }, 500, "Linear", true);
			sound.play("fly");
			game.time.events.add(1500, function () {

				sound.play("spaceShip")
				//game.add.tween(robot).to({alpha : 0, angle:robot.angle + 360},500,"Linear",true).onComplete.add(function(){
				game.add.tween(robot).to({ y: game.world.height * 1.2 }, 500, "Linear", true).onComplete.add(function () {
					robot.alpha = 0;
					robot.x = robot.initX;
					robot.y = robot.initY;
					robot.children[1].y = robot.children[1].initY;
					if (typeRobot == 1) {
						typeRobot = 2;
					} else {
						typeRobot = 1;
					}
					robot.anim.setSkinByName('normal' + typeRobot);
				})

				for (var i = 0; i < boxesGroup.length; i++) {

					var box = boxesGroup.children[i];
					box.alpha = 0;
					box.y = box.initY;
				}

				game.time.events.add(1000, setScene);
			});
		});
	}

	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA, boundsB);

	}

	function moveRobot(inDirection) {

		if (!robot.active || !gameActive) {
			return
		}

		if (!robot.ready) {
			robot.ready = true
			return
		}

		var jumpY = 0
		var jumpX = 0
		robot.active = false

		var lane = lanesGroup.children[robot.index]

		switch (inDirection) {
			case 'up':

				jumpY = -128
				if (robot.index == 0) {
					robot.active = true
					return
				} else if (robot.index == 6 || robot.index == 1) {
					jumpY = -140
				}

				robot.index--
				break;

			case 'down':

				jumpY = 128
				if (robot.index == 6) {
					robot.active = true
					return
				} else if (robot.index == 0 || robot.index == 5) {

					jumpY = 140
				}

				robot.index++
				break;

			case 'right':
				jumpX = 128
				if (lane.left == 1) {
					jumpX = 90
				}
				//<<Limite de salto a la derecha para que no muera si se mueve de ubicación
				if (robot.x > game.width - 140 && (robot.index == 0 || robot.index == 6)) {
					jumpX = -(robot.x - (game.width - 69));
				}
				robot.anim.setAnimationByName(0, "right", false);//RIGHTBOX
				break;

			case 'left':
				jumpX = -128
				if (lane.left == 0) {
					jumpX = -90;
				}
				//<<Limite de salto a la izquierda para que no muera si se mueve de ubicación
				if (robot.x < 140 && (robot.index == 0 || robot.index == 6)) {
					jumpX = -(robot.x - 69);
				}
				robot.anim.setAnimationByName(0, "left", false)//LEFTBOX
				break;

		}

		game.add.tween(robot).to({ x: robot.x + jumpX, y: robot.y + jumpY }, 100, "Linear", true).onComplete.add(function () {
			robot.active = true
			if (gameActive) {
				robot.anim.setAnimationByName(0, "idle", true)//IDLEBOX
			}

		})
		sound.play("whoosh")

	}

	function createRobot() {

		robot = game.add.group();
		robot.x = game.world.centerX;
		robot.y = 70;
		robot.initX = robot.x;
		robot.initY = robot.y;
		robot.index = 0;
		robot.flagIndex = null;
		robot.ready = true;
		robot.alpha = 0;
		robot.active = true;
		sceneGroup.add(robot);

        /*var robotImg = robot.create(0,0,'atlas.flag','robot')
        robotImg.anchor.setTo(0.5,0.5)
        robotImg.scale.setTo(0.8,0.8)
        robot.img = robotImg*/

		var sRobot = game.add.spine(0, 30, 'robot');
		sRobot.scale.setTo(0.7, 0.7);
		typeRobot = game.rnd.integerInRange(1, 2);
		//console.log("Random:" + typeRobot);
		sRobot.setSkinByName('normal' + typeRobot);
		sRobot.setAnimationByName(0, 'idle', true);
		robot.add(sRobot);
		robot.anim = sRobot;

		grabGroup = game.add.group();
		grabGroup.y = 25;
		grabGroup.initY = grabGroup.y;
		robot.add(grabGroup);

		var hitBoxRobot = new Phaser.Graphics(game);
		hitBoxRobot.beginFill(0xFFFFFF);
		hitBoxRobot.drawRect(-40, -30, 80, 60);
		hitBoxRobot.alpha = 0;
		hitBoxRobot.endFill();
		robot.add(hitBoxRobot);
		robot.hitBox = hitBoxRobot;

		flagGroup = game.add.group();
		var boxContainer = game.add.sprite(0, 0, 'atlas.flag', 'grabbox');
		boxContainer.anchor.setTo(0.5, 0.5);
		boxContainer.scale.setTo(0.8, 0.8);
		flagGroup.add(boxContainer);
		var flagInBox = game.add.sprite(boxContainer.centerX, boxContainer.centerY + 8, 'atlas.flag', 'mexico');
		flagInBox.anchor.setTo(0.5, 0.5);
		boxContainer.addChild(flagInBox);
		grabGroup.add(flagGroup);
	}

	function createObjects() {

		// //Para juego tutorial
		// objectsGroup = game.add.group();
		// sceneGroup.add(objectsGroup);

		//Para juego normal
		usedObjects = game.add.group();
		sceneGroup.add(usedObjects);

		//createAssetLevelZero('enemy', 0.8, 25);
		createAsset('enemy', 0.8, 10);

		particleCorrect = createPart("star");
		sceneGroup.add(particleCorrect);

		particleWrong = createPart("smoke");
		sceneGroup.add(particleWrong);

		hand = game.add.sprite(0, 0, "hand");
		hand.animations.add('hand');
		hand.animations.play('hand', 24, true);
		hand.alpha = 0;
	}

	// function createAssetLevelZero(tagTuto, scaleTuto, numberTuto) {
	// 	var counterLane = 1;
	// 	var actualLane = 1;
	// 	for (var t = 0; t < numberTuto; t++) {
	// 		var enemyTuto = game.add.spine(100, 100, 'box');
	// 		objectsGroup.add(enemyTuto);
	// 		enemyTuto.setSkinByName('normal4');
	// 		enemyTuto.scale.setTo(scaleTuto, scaleTuto);
	// 		console.log(actualLane);
	// 		enemyTuto.lane = lanesGroup.children[actualLane];
	// 		enemyTuto.used = false;
	// 		enemyTuto.tag = tagTuto;
	// 		if (enemyTuto.lane.left == 0) {
	// 			enemyTuto.x = (140 * (counterLane - 1)) + 60;
	// 			enemyTuto.scale.x = Math.abs(enemyTuto.scale.x) * -1;
	// 		} else {
	// 			enemyTuto.x = game.width - (140 * (counterLane - 1)) - 60;
	// 			enemyTuto.scale.x = Math.abs(enemyTuto.scale.x);
	// 		}
	// 		enemyTuto.y = enemyTuto.lane.y + enemyTuto.lane.height * 0.65;
	// 		enemyTuto.used = true;
	// 		counterLane++;
	// 		if (counterLane > 5) {
	// 			actualLane++;
	// 			counterLane = 1;
	// 		}
	// 		if (levelZeroColocation[t] == 0) {
	// 			enemyTuto.alpha = 0;
	// 		}
	// 	}
	// }

	function createAsset(tag, scale, number) {

		for (var i = 0; i < number; i++) {

			var enemy = game.add.spine(-300, 200, 'box');
			usedObjects.add(enemy);
			var randomBox = game.rnd.integerInRange(1, 2);
			var widthBox = 80;
			var xBox = -40;

			if (randomBox == 1) {
				enemy.setSkinByName('normal4');
			} else {
				enemy.setSkinByName('normal5');
				xBox = -120;
				widthBox *= 3;
			}
			enemy.scale.setTo(scale, scale);
			enemy.lane = null;
			enemy.used = false;
			enemy.tag = tag;

			var hitBox = new Phaser.Graphics(game);
			hitBox.beginFill(0xFFFFFF);
			hitBox.drawRect(xBox, -60, widthBox, 80);
			hitBox.alpha = 0;
			hitBox.endFill();
			enemy.add(hitBox);
			enemy.hitBox = hitBox;
		}
	}

	function createBoxes() {

		boxesGroup = game.add.group();
		sceneGroup.add(boxesGroup);

		var pivotX = game.world.centerX - 150;
		for (var i = 0; i < 3; i++) {

			var boxGroup = game.add.group();
			boxGroup.x = pivotX;
			boxGroup.y = game.world.height * 0.94;
			boxGroup.initY = boxGroup.y;
			boxGroup.scale.setTo(0.7, 0.7);
			boxGroup.country = '';
			boxGroup.alpha = 0;
			boxesGroup.add(boxGroup);

			var boxImage = game.add.spine(0, 75, 'helicopter');
			boxImage.setSkinByName("normal3");
			boxImage.setAnimationByName(0, "idle", true);
			boxImage.scale.setTo(0.4, 0.4);
			boxGroup.add(boxImage);
			boxGroup.anim = boxImage;

			var fontStyle = { font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 220 };

			var pointsText = new Phaser.Text(sceneGroup.game, 0, 26, "0", fontStyle);
			pointsText.lineSpacing = -10;
			pointsText.anchor.setTo(0.5, 0.5);
			boxGroup.add(pointsText);

			boxGroup.text = pointsText;

			pivotX += 300;

		}
	}
	//#endregion

	return {
		assets: assets,
		name: "flag",
		update: update,
		preload: preload,
		localizationData: localizationData,
		getGameData: function () {
			var games = yogomeGames.getGames();
			return games[gameIndex];
		},
		create: function (event) {
			sceneGroup = game.add.group();
			yogomeGames.mixpanelCall("enterGame", gameIndex, lives, parent.epicModel);

			this.swipe = new Swipe(this.game);

			spaceSong = game.add.audio('spaceSong')
			game.sound.setDecodedCallback(spaceSong, function () {
				spaceSong.loopFull(0.6)
			}, this);

			game.onPause.add(function () {
				game.sound.mute = true
			}, this);

			game.onResume.add(function () {
				game.sound.mute = false
			}, this);

			initialize();
			createBackground();
			createBoxes();
			createRobot();
			createObjects();

			createHearts();
			createPointsBar();
			createCoin();
			createTutorial();

			buttons.getButton(spaceSong, sceneGroup);

		},
	}
}()