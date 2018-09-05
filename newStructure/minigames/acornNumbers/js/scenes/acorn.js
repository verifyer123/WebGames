var soundsPath = "../../shared/minigames/sounds/"

var acorn = function(){

    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?"
		}
	}

	var assets = {
        atlases: [
            {
                name: "atlas.acorn",
                json: "images/acorn/atlas.json",
                image: "images/acorn/atlas.png"
            },

        ],
        images: [
            {   name:"fondo",
				file: "images/acorn/fondo.png"},
            {   name:"montains0",
                file: "images/acorn/fondo_morning.png"},
            {   name:"montains1",
                file: "images/acorn/fondo_noon.png"},
            {   name:"montains2",
                file: "images/acorn/fondo_night.png"},
			{   name:'tutorial_image',
				file:"images/acorn/tutorial_image_%input.png"
			}
		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "hit",
				file: soundsPath + "squeeze.mp3"},
            {	name: "flip",
				file: soundsPath + "flipCard.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "right",
				file: soundsPath + "rightChoice.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "win",
                file: soundsPath + "moleHit.mp3"},
            {   name: "knockout",
                file: soundsPath + "knockOut1.mp3"},
            {   name:"acornSong",
				file: soundsPath + 'songs/childrenbit.mp3'}
		],
        spritesheets:[
            {   name: "coin",
               file: "images/acorn/coin.png",
               width: 122,
               height: 123,
               frames: 12
           },
           {   name: "hand",
               file: "images/acorn/hand.png",
               width: 115,
               height: 111,
               frames: 23
           }
        ],
		spines:[
			{
				name:"ardilla",
				file:"images/spine/skeleton.json"
			}
		]
    }

    var NUM_LIFES = 3;
    var NUM_LANES = 3;
    var TOP_LANE_Y = 545;
    var LANE_HEIGHT = 150;
    var NUM_OBJECTS = 50;
    var DISTANCE_BETWEEN = 420;
    var ROUNDS = [
        {acorn: 7, stone:3, operator:"+", maxNumber:5},
        {acorn: 6, stone:4, operator:"+", maxNumber:5},
        {acorn: 7, stone:7, operator:"+", maxNumber:5}];
    var OBJECTS = [{image:"stone", event:"hit"}, {image:"acorn", event:"addPoint"}];
    var OPERATIONS = ["+", "-"];

    var gameIndex = 34;
    var lives;
	var sceneGroup = null;
    var tutoGroup;
    var heartsGroup = null;
    var pointsBar;
    var coin;
    var coinsGroup=null;
    var particleCorrect;
    var particleWrong;
    var hand;
    var index;

    var pullGroup = null;
    var clock;
    var timeValue;
    var quantNumber;
    var inputsEnabled;
    var roundCounter;
    var background;
    var ardilla;
    var swipe;
    var runnerMode;
    var mountains;
    var boardGroup;
    var blocksGroup;
    var gameGroup;
    var distance;
    var currentDistance;
    var objectList;
    var grabGroup;
    var speed;
    var canSwipe;
    var gameState;
    var tutorial;
    var tweenHand;
    var tutorialColocationX;
    var tutorialColocationY;
    var tutorialType;
    var isRunning;
    var pickAcornTutorial;
    var counterTimeBackground;
    var mountainsBack;
    var backgroundGroup;
    var counterAcorn;
    var weapon;
    var spaceKey;
    var sun;
    var pointsTutorial;
    var positionTutorial;
    var wasShot;
    var canSwipeUp;
    var canSwipeDown;
    var isDesktop = false;
    var mouseIsDown;
    var startY;
    var spaceIsDown;

    function loadSounds(){
        sound.decode(assets.sounds);
    }

    function initialize(){

        game.stage.backgroundColor = "#ffffff";
        lives = NUM_LIFES;
        timeValue = 7;
        quantNumber = 2;
        roundCounter = 0;
        runnerMode = false;
        objectList = [];
        inputsEnabled = false;
        distance = 0;
        currentDistance = 0;
        speed = 4;
        canSwipe = false;
        tutorial = true;
        tutorialColocationX = [0,1,1,2,3,3,4,4,4,5,5,6,6,6];
        tutorialColocationY = [2,1,2,2,0,2,0,1,2,0,2,0,1,2];
        tutorialType = [0,0,0,0,0,0,0,1,0,0,0,0,0,0];
        pickAcornTutorial = false;
        counterTimeBackground = 0;
        counterAcorn = 0;
        pointsTutorial = [];
        positionTutorial = [0,2,3,5,8];
        wasShot = false;
        canSwipeUp = false;
        canSwipeDown = false;
        if(this.game.device.desktop) {
            isDesktop = true;
        }
        mouseIsDown = false;
        spaceIsDown = false;
        index = 0;

        sceneGroup.alpha = 0;
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true);

        loadSounds();

    }

   function preload(){

        game.stage.disableVisibilityChange = false;

    }

    function stopGame(win){

        inputsEnabled = false;
        canSwipe = false;

        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 3000)
        tweenScene.onComplete.add(function(){

            sound.stop("acornSong");
            var resultScreen = sceneloader.getScene("result");
            resultScreen.setScore(true, pointsBar.number, gameIndex);
            sceneloader.show("result");
            sound.play("gameLose");
        })
    }

    function createTutorial(){
        tutoGroup = game.add.group();
        sceneGroup.add(tutoGroup);

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay);
    }

    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height;

        tweenHand = game.add.tween(hand).to( { alpha: 1 }, 300, Phaser.Easing.Bounce.In, true, 0, 0);
        bringElementsToTop();
        changeDay();
        gameState = createDelegate(gamePlayTutorial);
    }

    function update() {
        if(gameState!=null){
            gameState();
        }
    }

    function createPointsBar(){

        pointsBar = game.add.group();
        pointsBar.x = game.world.width;
        pointsBar.y = 0;
        sceneGroup.add(pointsBar);

        var pointsImg = pointsBar.create(-10,10,'atlas.acorn','xpcoins');
        pointsImg.anchor.setTo(1,0);

        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle);
        pointsText.x = -pointsImg.width * 0.45;
        pointsText.y = pointsImg.height * 0.25;
        pointsBar.add(pointsText);

        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

        pointsBar.text = pointsText;
        pointsBar.number = 0;

    }

    function addPoint(number){

        sound.play("magic");
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number);

        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true);
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true);
        })

        addNumberPart(pointsBar.text,'+' + number);

        // if(pointsBar.number % 2 == 0){
        timeValue-=timeValue * 0.10;
        // }

    }

    function getCoins(objX,objY){
        var coin=coinsGroup.getFirstDead();

        if(coin==undefined){
            game["coin"+index] = game.add.sprite(0, 0, "coin");
            game["coin"+index].anchor.setTo(0.5);
            game["coin"+index].scale.setTo(0.8);
            game["coin"+index].animations.add('coin');
            game["coin"+index].animations.play('coin', 24, true);
            game["coin"+index].alpha = 0;
            coinsGroup.add(game["coin"+index]);
            coin=game["coin"+index];
            index++;
            addCoin(coin,objX,objY);
        }else{
            addCoin(coin,objX,objY);
        }
    }

    function addCoin(coin,oX,oY){

        if(coin.motion)
            coin.motion.stop();

        coin.reset(oX,oY);

        game.add.tween(coin).to({alpha:1}, 100, Phaser.Easing.linear, true)

        coin.motion = game.add.tween(coin).to({y:coin.y - 100}, 200, Phaser.Easing.Cubic.InOut,true);
        coin.motion.onComplete.add(function(){
            coin.motion = game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true);
            coin.motion.onComplete.add(function(){
                coin.motion = game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true);
                coin.motion.onComplete.add(function(){
                    addPoint(1);
                    coin.kill();
                })
            })
        })
    }

    function createCoin(){
        coin = game.add.sprite(0, 0, "coin");
        coin.anchor.setTo(0.5);
        coin.scale.setTo(0.8);
        coin.animations.add('coin');
        coin.animations.play('coin', 24, true);
        coin.alpha = 0;

        coinsGroup= new Phaser.Group(game);
        sceneGroup.add(coinsGroup);
        coinsGroup.add(coin);
   }

    function addNumberPart(obj,number){

        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};

        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle);
        pointsText.x = obj.world.x;
        pointsText.y = obj.world.y;
        pointsText.anchor.setTo(0.5,0.5);
        sceneGroup.add(pointsText);

        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true);
        game.add.tween(pointsText).to({alpha:0},250,null,true,500);

        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

    }

    function createHearts(){

        heartsGroup = game.add.group();
        heartsGroup.y = 10;
        sceneGroup.add(heartsGroup);

        var pivotX = 10;
        var group = game.add.group();
        group.x = pivotX;
        heartsGroup.add(group);

        var heartImg = group.create(0,0,'atlas.acorn','life_box');

        pivotX+= heartImg.width * 0.45;

        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle);
        pointsText.x = pivotX;
        pointsText.y = heartImg.height * 0.15;
        pointsText.setText('X ' + lives);
        heartsGroup.add(pointsText);

        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

        heartsGroup.text = pointsText;

    }

    function missPoint(){

        lives--;
        sound.play("wrong");
        console.log("entre a perder");
        
        heartsGroup.text.setText('X ' + lives);

        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true);
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true);
        })

        if(lives === 0){
            stopGame(false);
        }

        addNumberPart(heartsGroup.text,'-1');
    }

    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.acorn',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle;
    }

    function createParticles(){
        particleCorrect = createPart('star');
        sceneGroup.add(particleCorrect);
        
        particleWrong = createPart('smoke');
        sceneGroup.add(particleWrong);
    }

    function createSpine() {
        ardilla = game.add.group();
        ardilla.x = 150;
        ardilla.y = TOP_LANE_Y + LANE_HEIGHT + 50;
        sceneGroup.add(ardilla);
        ardilla.currentLane = 2;

        var ardillaSpine = game.add.spine(0, 0, "ardilla");
        ardillaSpine.x = 0; ardillaSpine.y = 0;
        ardillaSpine.scale.setTo(0.8,0.8);
        ardillaSpine.setSkinByName("normal");
        ardillaSpine.setAnimationByName(0, "idle", true);
        // ardillaSpine.y = TOP_LANE_Y + LANE_HEIGHT + 50
        //ardillaSpine.currentLane = 2
        ardilla.add(ardillaSpine);

        var hitBox = new Phaser.Graphics(game);
        hitBox.beginFill(0xFFFFFF);
        hitBox.drawRect(40,-35,50, 50);
        hitBox.alpha = 0;
        hitBox.endFill();
        hitBox.x = -hitBox.width * 0.5;
        hitBox.y = -hitBox.height;
        ardilla.add(hitBox);
        ardilla.hitBox = hitBox;
        
        ardilla.setAnimation = function (animations, loop) {
            ardillaSpine.setAnimationByName(0, animation, loop);
            if(!loop){
                ardillaSpine.addAnimationByName(0, "idle", true);
            }
            for(var index = 0; index < animations.length; index++) {
                var animation = animations[index];
                var loop = index == animations.length - 1;
                if (index === 0)
                    ardillaSpine.setAnimationByName(0, animation, loop);
                else
                    ardillaSpine.addAnimationByName(0, animation, loop);
            }
        }

        hand = game.add.sprite(0, 0, "hand");
        hand.animations.add('hand');
        hand.animations.play('hand', 24, true);
        hand.alpha = 0;
    }

    function tweenTint(obj, startColor, endColor, time, delay, callback) {
        // check if is valid object
        time = time || 250
        //delay = delay || 0

        // if (obj) {
        //     // create a step object
        //     var colorBlend = { step: 0 };
        //     // create a tween to increment that step from 0 to 100.
        //     var colorTween = game.add.tween(colorBlend).to({ step: 100 }, time, Phaser.Easing.Linear.None, delay);
        //     // add an anonomous function with lexical scope to change the tint, calling Phaser.Colour.interpolateColor
        //     colorTween.onUpdateCallback(function () {
        //         obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
        //     })
        //     // set object to the starting colour
        //     obj.tint = startColor;
        //     // if you passed a callback, add it to the tween on complete
        //     if (callback) {
        //         colorTween.onComplete.add(callback, this);
        //     }
        //     // finally, start the tween
        //     colorTween.start();
        // }

        var colorBlend = {step: 0};

        game.add.tween(colorBlend).to({step: 100}, time, Phaser.Easing.Default, false)
        .onUpdateCallback(() => {
            obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step, 1);
        })
        .start();
    }

    function swipeInGame(){
        if (canSwipe) {
            var direction = swipe.check();
            if (direction !== null) {
                switch (direction.direction) {
                    case swipe.DIRECTION_UP:
                        if (canSwipeUp){
                              ardilla.currentLane = ardilla.currentLane - 1 > 0 ? ardilla.currentLane - 1 : 1;
                            changeLane();
                        }
                        break;
                    case swipe.DIRECTION_DOWN:
                        if (canSwipeDown){
                              ardilla.currentLane = ardilla.currentLane + 1 <= NUM_LANES ? ardilla.currentLane + 1 : NUM_LANES;
                            changeLane();
                        }
                        break;
                }
            }
        }
    }

    function createDelegate(func) {
        return function() { 
            return func.apply(arguments);
        };
    }

    function gamePlayTutorial(){
        swipeInGame();
        shot();

        if(runnerMode) {

            moveBackGround();

            if(ardilla.currentLane == 2 && currentDistance >= pointsTutorial[0] && currentDistance < pointsTutorial[0] + 10){
                runnerMode = false;
                canSwipeUp = true;
                canSwipeDown = false;
                ardilla.setAnimation(["idle"], true);
                isRunning = false;
                hand.x = ardilla.x + 80;
                hand.y = ardilla.y - ardilla.height/ 2;
                tweenHand = game.add.tween(hand).to( { alpha: 1 }, 300, Phaser.Easing.Bounce.In, true, 0, 0);
                tweenHand = game.add.tween(hand).to( { y: ardilla.y - ardilla.height/ 2 - 150 }, 1000, Phaser.Easing.Linear.In, true, 0, -1);
            }

            if(ardilla.currentLane == 1 && currentDistance >= pointsTutorial[1] && currentDistance < pointsTutorial[1] + 10){
                runnerMode = false;
                canSwipeUp = false;
                canSwipeDown = true;
                ardilla.setAnimation(["idle"], true);
                isRunning = false;
                hand.x = ardilla.x + 80;
                hand.y = ardilla.y - ardilla.height/ 2;
                tweenHand = game.add.tween(hand).to( { alpha: 1 }, 300, Phaser.Easing.Bounce.In, true, 0, 0);
                tweenHand = game.add.tween(hand).to( { y: ardilla.y - ardilla.height/ 2 + 150 }, 1000, Phaser.Easing.Linear.In, true, 0, -1);
            }

            if(currentDistance >= pointsTutorial[2] && currentDistance < pointsTutorial[2] + 10){
                var diffDistance =  (game.width + (250 * 3) + 30 - boardGroup.width) + ardilla.width;
                pointsTutorial[4] = currentDistance + diffDistance;
                boardGroup.x = diffDistance + 180;
                blocksGroup.x = diffDistance + game.width - 100;
                blocksGroup.alpha = 1;
                tutorial = false;
                generateQuestion();
            }

            if(ardilla.currentLane == 2 && currentDistance >= pointsTutorial[3] && currentDistance < pointsTutorial[3] + 10 && !wasShot){
                runnerMode = false;
                hand.x = ardilla.x + 350;
                hand.y = ardilla.y - ardilla.height/ 2;
                tweenHand = game.add.tween(hand).to( { alpha: 1 }, 300, Phaser.Easing.Bounce.In, true, 0, 0);
                tweenHand = game.add.tween(hand).to( { y: ardilla.y - ardilla.height/ 2 }, 1000, Phaser.Easing.Linear.In, true, 0, -1);
            }

            if(currentDistance >= pointsTutorial[4] && currentDistance < pointsTutorial[4] + 10){
                runnerMode = false;
                canSwipe = false;
                inputsEnabled = true;
                currentDistance = 0;
                gameGroup.x = 0;
                ardilla.setAnimation(["idle"], true);
                isRunning = false;
                canSwipeUp = true;
                canSwipeDown = true;
                removeObjects();
                startRound();
                gameState = createDelegate(gamePlayGame);
            }
        }

        for(var objectIndex = 0; objectIndex < gameGroup.objects.length; objectIndex++){
            var object = gameGroup.objects[objectIndex]
            var isCollision = checkOverlap(object, ardilla.hitBox)
            if ((isCollision)&&(!object.collided)){
                object.collided = true
                if (object.event == "addPoint" && !pickAcornTutorial){
                    pickAcornTutorial = true;
                    grabObject(object);
                    counterAcorn++;
                    if(counterAcorn == 1){
                        ardilla.setAnimation(["run_cachetes"]);
                    }
                }
            }
            checkShot(object,true);
        }

        if ((ardilla.currentLane == 1 &&  currentDistance>= pointsTutorial[0] && currentDistance < pointsTutorial[0] + 10)
            || (ardilla.currentLane == 2 && currentDistance>= pointsTutorial[1] && currentDistance < pointsTutorial[1] + 10)
            || (ardilla.currentLane == 2 && currentDistance>= pointsTutorial[3] && currentDistance < pointsTutorial[3] + 10 && wasShot)
            ){
            if(!isRunning){
                if(counterAcorn == 1){
                    ardilla.setAnimation(["run_cachetes"]);
                }else{
                    ardilla.setAnimation(["run"]);
                }
                isRunning = true;
            }
            tweenHand = game.add.tween(hand).to( { alpha: 0 }, 300, Phaser.Easing.Bounce.In, true, 0, 0);
            runnerMode = true;
            canSwipeUp = false;
            canSwipeDown = false;
        }

    }

    function gamePlayGame(){
        if(runnerMode) {

            swipeInGame();
            shot();
            moveBackGround();

            if (boardGroup.x < 0 - boardGroup.width){
                var diffDistance = distance - currentDistance;
                boardGroup.x = diffDistance + 180;
                blocksGroup.x = diffDistance + game.width - 100;
                blocksGroup.alpha = 1;
                generateQuestion();
            }

            // timeElapsed += game.time.elapsedMS

            for(var objectIndex = 0; objectIndex < gameGroup.objects.length; objectIndex++){
                var object = gameGroup.objects[objectIndex];
                var isCollision = checkOverlap(object, ardilla.hitBox);
                if ((isCollision)&&(!object.collided)){
                    object.collided = true;
                    switch (object.event){
                        case "hit":
                            missPoint();
                            hitObject(object);
                            break;
                        case "addPoint":
                            grabObject(object);
                            //addCoin(ardilla.centerX,ardilla.centerY); //addPoint(1)
                            getCoins(ardilla.centerX,ardilla.centerY);
                            counterAcorn++;
                            if(counterAcorn == 1){
                                ardilla.setAnimation(["run_cachetes"]);
                            }
                            break;
                    }
                }
                checkShot(object,false);
            }

            if (distance <= currentDistance){
                runnerMode = false;
                canSwipe = false;
                inputsEnabled = true;
                currentDistance = 0;
                gameGroup.x = 0;
                if(counterAcorn>0){
                    ardilla.setAnimation(["idle_cachetes"], true);
                }else{
                   ardilla.setAnimation(["idle"], true); 
                }
                removeObjects();
                startRound();
            }
        }
    }

    function checkShot(object,tutorial){
        weapon.bullets.forEachExists(function(bullet){
            isCollision = checkOverlap(object, bullet);
            if ((isCollision)&&(!object.collided)){
                object.collided = true
                if(object.event == "hit"){
                    if(tutorial){
                        runnerMode = true;
                    }
                    deleteStone(bullet,object);
                } else {
                    object.collided = false;
                }
            }
        });
    }

    function checkSwipeOrClick(){
        if (mouseIsDown == true) {
            var endY = game.input.y;

            if(!(endY < startY) && !(endY > startY)){
                if (canSwipe && counterAcorn>0) {
                    if(!wasShot){
                        wasShot = true;
                    }
                    weapon.fire();
                }
            }
        }
    }

    function shot(){
        if(spaceKey.isDown){
            spaceIsDown = true;
        }
        if(spaceIsDown && (spaceKey.isUp) && counterAcorn>0 && canSwipe){
            if(!wasShot){
                wasShot = true;
            }
            weapon.fire();
            spaceIsDown = false;
        }
    }

    function deleteStone(bullet, obstacle){
        bullet.kill();
        
        game.add.tween(obstacle.scale).to({x: 0.5, y: 0.5}, 500, Phaser.Easing.Linear.InOut, true);
        game.add.tween(obstacle).to({angle: 359}, 1000, Phaser.Easing.Linear.InOut, true);
        game.add.tween(obstacle).to({x: obstacle.x+200, y: obstacle.y-150}, 1000, Phaser.Easing.Linear.InOut, true).onComplete.add(function(){
            game.add.tween(obstacle).to({alpha: 0}, 200, Phaser.Easing.Linear.InOut, true).onComplete.add(function(){
                obstacle.collided = false;
                obstacle.x = -200;
                obstacle.y = -200;
                obstacle.scale.setTo(1,1);
                obstacle.alpha = 1;
                obstacle.angle = 0;
            }, this);
        }, this);
    }

    function createWeapon(){
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        weapon = game.add.weapon(5, "atlas.acorn","acorn");
        weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        weapon.bulletLifespan = 1000;
        weapon.bulletSpeed = 800;
        weapon.fireRate = 500;
        weapon.trackSprite(ardilla.children[1], 120, -15, true);
        weapon.bullets.setAll('scale.x', 0.5);
        weapon.bullets.setAll('scale.y', 0.5);
        weapon.onFire.add(function(){
            counterAcorn--;
            if(counterAcorn == 0){
               ardilla.setAnimation(["run_shooting", "run"]);
            }else{
                ardilla.setAnimation(["run_shooting", "run_cachetes"]);
            }
        });
    }

    function moveBackGround(){
        background.tilePosition.x -= speed;
        mountains.tilePosition.x -= speed * 0.1;
        mountainsBack.tilePosition.x -= speed * 0.1;
        boardGroup.x -= speed;
        blocksGroup.x -= speed;
        gameGroup.x -= speed;
        currentDistance += speed;
    }

    function createBackground(){
        backgroundGroup = game.add.group();
        sceneGroup.add(backgroundGroup);

        mountainsBack = game.add.tileSprite(0,0,game.world.width,961,'montains0');
        backgroundGroup.add(mountainsBack);
        mountains = game.add.tileSprite(0,0,game.world.width,961,'montains0');
        backgroundGroup.add(mountains);

        sun = game.add.sprite(game.world.width + 64,game.world.height * 0.05,"atlas.acorn","sun");
        sceneGroup.add(sun);

        moon = game.add.sprite(game.world.width/2,game.world.height * 0.05,"atlas.acorn","moon");
        moon.alpha = 0;
        sceneGroup.add(moon);

        background = game.add.tileSprite(0,0,game.world.width,961,'fondo');
        sceneGroup.add(background);
    }

    function inputs(){
        game.input.onUp.add(mouseUp, this);
        game.input.onDown.add(mouseDown, this);
    }

    function mouseDown() {
        if(!mouseIsDown){   
            mouseIsDown = true;
            startY = game.input.y;
        }
    }

    function mouseUp() {
        checkSwipeOrClick();
        mouseIsDown = false;
    }

    function changeDay(){
        counterTimeBackground++;
        if(counterTimeBackground==3){
            counterTimeBackground = 0;
        }

        if(counterTimeBackground == 1){
            game.add.tween(sun).to({x: game.world.width/2}, 20000, Phaser.Easing.Linear.InOut, true);
            game.time.events.add(20000,function(){
                game.add.tween(sun).to({alpha:0, x: game.world.width/2 - 150}, 18000, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
                    sun.x = game.world.width + 64;
                });
                game.add.tween(moon).to({alpha:1, x: game.world.width/2 - 150}, 18000, Phaser.Easing.Cubic.Out, true);
            });
        }else if(counterTimeBackground == 0){
            game.add.tween(moon).to({x: -64}, 10000, Phaser.Easing.Linear.InOut, true).onComplete.add(function(){
                moon.x = game.world.width/2;
                moon.alpha = 0;
                sun.alpha = 1;
            });
        }

        game.time.events.add(10000,function(){
            backgroundGroup.bringToTop(mountains);
            mountainsBack.alpha = 1;
            mountainsBack.loadTexture("montains"+ counterTimeBackground);
            game.add.tween(mountains).to({alpha:0}, 5000, Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
                var tempBackground = mountains; 
                mountains = mountainsBack;
                mountainsBack = tempBackground;
                changeDay();
            });
        },this);
    }

    function createGameObjects(){
        pullGroup = game.add.group();
        pullGroup.x = -game.world.centerX * 2;
        pullGroup.y = -game.world.centerY * 2;
        sceneGroup.add(pullGroup);
        pullGroup.alpha = 0;

        gameGroup = game.add.group();
        gameGroup.x = 0;
        sceneGroup.add(gameGroup);

        createObjects(tutorialColocationX.length,true);
        createObjects(NUM_OBJECTS,false);

    }

    function createObjects(totalObjects, elements){
        var objectData;
        for(var objectIndex = 0; objectIndex < totalObjects; objectIndex++){
            if(elements){
                objectData = OBJECTS[tutorialType[objectIndex]];
            }else{
                objectData = OBJECTS[objectIndex % OBJECTS.length];   
            }
            var object = pullGroup.create(0,0,'atlas.acorn',objectData.image);
            object.anchor.setTo(0.5, 0.5);
            object.event = objectData.event;
            objectList.push(object);
            object.name = objectData.image;
        }
    }
    
    function generateQuestion() {
        var round = ROUNDS[roundCounter] ? ROUNDS[roundCounter] : ROUNDS[ROUNDS.length - 1];

        var number1 = game.rnd.integerInRange(0, round.maxNumber);
        var number2 = game.rnd.integerInRange(0, round.maxNumber);
        var answer;

        var operation = round.operator;
        if(round.operator === "random")
            operation = OPERATIONS[game.rnd.integerInRange(0, OPERATIONS.length - 1)];

        if (operation === "+"){
            answer = number1 + number2;
        }else if(operation === "-"){
            if (number2 > number1){
                var prev = number2;
                number2 = number1;
                number1 = prev;
            }
            answer = number1 - number2;
        }

        boardGroup.answer = answer;
        boardGroup.number1.setText(number1);
        boardGroup.operator.setText(operation);
        boardGroup.number2.setText(number2);

        var fakeAnswers = [];
        for(var answerIndex = 0; answerIndex < round.maxNumber + round.maxNumber + 1; answerIndex++){
            if (answerIndex !== answer)
                fakeAnswers.push(answerIndex);
        }

        fakeAnswers = Phaser.ArrayUtils.shuffle(fakeAnswers);

        var correctBox = game.rnd.integerInRange(0, NUM_LANES - 1)
        for (var blockIndex = 0; blockIndex < NUM_LANES; blockIndex++){
            var block = blocksGroup.blocks[blockIndex];
            block.inputEnabled = true;
            block.tint = "0xffffff";
            if (correctBox === blockIndex) {
                block.text.setText(answer);
                block.number = answer;
                if(tutorial){
                    hand.x = block.x + blocksGroup.x;
                    hand.y = block.y;
                }
            }
            else {
                block.text.setText(fakeAnswers[blockIndex]);
                block.number = fakeAnswers[blockIndex];
                if(tutorial){
                    block.inputEnabled = false;
                    block.tint = "0x909090";
                }else{
                    block.tint = "0xffffff";
                }
            }
        }

    }

    function bringElementsToTop(){
        sceneGroup.bringToTop(ardilla);
        sceneGroup.bringToTop(particleCorrect);
    }

    function startRound() {

        bringElementsToTop();
        var round = ROUNDS[roundCounter] ? ROUNDS[roundCounter] : ROUNDS[ROUNDS.length - 1];
        speed = speed + roundCounter;

        inputsEnabled = true;
        objectList = Phaser.ArrayUtils.shuffle(objectList);

        addObjects(round);
        roundCounter++;
    }

    function startTutorialRound(){
        inputsEnabled = true;
        gameGroup.objects = [];

        for(var i = 0; i< positionTutorial.length; i++){
             pointsTutorial[i] = (game.width + (250 * positionTutorial[i]) + 30 - boardGroup.width) + ardilla.width;
        }

        for(var tc = 0; tc < tutorialColocationX.length; tc++){
            var object = objectList[tc];
            object.x = game.width + (250 * tutorialColocationX[tc]) + 60;
            object.y = TOP_LANE_Y + LANE_HEIGHT * tutorialColocationY[tc];
            pullGroup.remove(object);
            gameGroup.add(object);
            gameGroup.objects.push(object);
            object.collided = false;
            object.alpha = 1;
            object.scale.x = 1;
            object.scale.y = 1;
        }
        
    }

    function changeLane() {
        sound.play("cut");
        var toY = TOP_LANE_Y + LANE_HEIGHT * (ardilla.currentLane - 1) + 50;
        game.add.tween(ardilla).to({y:toY}, 500, Phaser.Easing.Cubic.Out, true);
    }
    
    function checkAnswer(block) {
        if(inputsEnabled){
            if(tutorial){
                tweenHand = game.add.tween(hand).to( { alpha: 0 }, 300, Phaser.Easing.Bounce.In, true, 0, 0);
            }

            block.inputEnabled = false
            var tween = game.add.tween(blocksGroup).to({alpha:0}, 600, Phaser.Easing.Cubic.Out, false, 750)
            var buttonEffect = game.add.tween(block.scale).to({x: 1.2, y: 1.2}, 300, Phaser.Easing.Cubic.Out, true)
            buttonEffect.onComplete.add(function () {
                game.add.tween(block.scale).to({x: 1, y: 1}, 300, Phaser.Easing.Cubic.In, true)
            })

            if (block.number == boardGroup.answer) {
                particleCorrect.x = block.x + blocksGroup.x;
                particleCorrect.y = block.y;

                particleCorrect.start(true, 1000, null, 3);
                tweenTint(block, 0xffffff, 0x46FF46, 500);
                if(counterAcorn>0){
                    ardilla.setAnimation(["win_cachetes"]);
                }else{
                    ardilla.setAnimation(["win"]);
                }
                sound.play("win");

                // runnerMode = true
                inputsEnabled = false;
                tween.start();
                //addCoin(block.centerX + blocksGroup.centerX, block.centerY); //addPoint(1)
                getCoins(block.centerX + blocksGroup.centerX, block.centerY);
                tween.onComplete.add(function () {
                    if(counterAcorn>0){
                        ardilla.setAnimation(["run_cachetes"]);
                    }else{
                        ardilla.setAnimation(["run"]);
                    }
                    if(tutorial){
                        isRunning = true;
                    }
                    runnerMode = true;
                    canSwipe = true;
                    //inputsEnabled = false
                })
            }else{
                //inputsEnabled = false
                particleWrong.x = block.x + blocksGroup.x;
                particleWrong.y = block.y;

                particleWrong.start(true, 1000, null, 3);
                tweenTint(block, 0xffffff, 0xff5151, 500);
                missPoint();
                if (lives === 0){
                    if(counterAcorn>0){
                        ardilla.setAnimation(["sad_cachetes"]);
                    }else{
                        ardilla.setAnimation(["sad"]);
                    }
                }
                else{
                    if(counterAcorn>0){
                        ardilla.setAnimation(["sad_cachetes","idle_cachetes"]);
                    }else{
                        ardilla.setAnimation(["sad","idle"]); 
                    }
                    
                }
                // tween.onComplete.add(function () {
                //     // runnerMode = true
                // })
            }
        }
    }
    
    function createBlocks() {
        blocksGroup = game.add.group();
        blocksGroup.x = game.width - 100;
        sceneGroup.add(blocksGroup);
        blocksGroup.blocks = [];
        var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

        for(var blockIndex = 0; blockIndex < NUM_LANES; blockIndex++){
            var block = blocksGroup.create(0, 0,'atlas.acorn','respuesta');
            block.y = TOP_LANE_Y + (LANE_HEIGHT * blockIndex);
            block.anchor.setTo(0.5, 0.5);
            blocksGroup.add(block);

            var text = new Phaser.Text(game, 0, block.y + 5, "0", fontStyle);
            text.anchor.setTo(0.5, 0.5);
            blocksGroup.add(text);
            block.text = text;
            block.number = 0;
            block.inputEnabled = true;

            block.events.onInputDown.add(checkAnswer);
            blocksGroup.blocks.push(block);
        }
    }

    function createBoard(){
        boardGroup = game.add.group()
        boardGroup.x = 180
        boardGroup.y = game.world.centerY - 60
        sceneGroup.add(boardGroup)
        var board = boardGroup.create(0,0,'atlas.acorn', 'tabla')
        board.anchor.setTo(0.5, 0.5)
        var fontStyle = {font: "48px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var number1 = new Phaser.Text(game, -86, -28, "0", fontStyle)
        number1.anchor.setTo(0.5, 0.5)
        boardGroup.add(number1)
        boardGroup.number1 = number1

        var operator = new Phaser.Text(game, 0, -32, "+", fontStyle)
        operator.anchor.setTo(0.5, 0.5)
        boardGroup.add(operator)
        boardGroup.operator = operator

        var number2 = new Phaser.Text(game, 86, -28, "0", fontStyle)
        number2.anchor.setTo(0.5, 0.5)
        boardGroup.add(number2)
        boardGroup.number2 = number2

        boardGroup.answer = 0
    }
    
    function removeObjects() {
        for(var objectIndex = 0; objectIndex < gameGroup.objects.length; objectIndex++){
            var object = gameGroup.objects[objectIndex];
            object.alpha = 0;
            object.x = -300;
            object.y = -300;
            gameGroup.remove(object);
            pullGroup.add(object);
        }
    }
    
    function addObjects(round) {
        var objectsNumber = round.acorn + round.stone;
        var counters = {acorn:0, stone:0};
        gameGroup.objects = [];
        distance = game.width + 100 + (DISTANCE_BETWEEN * objectsNumber);
        // var DISTANCE_BETWEEN = (distance - game.width - 100) / objectsNumber
        for(var objectIndex = 0; objectIndex < objectList.length; objectIndex++){
            var object = objectList[objectIndex];

            if(counters[object.name] < round[object.name] ) {
                object.x = game.width + DISTANCE_BETWEEN * gameGroup.objects.length + 100;
                var randomLane = game.rnd.integerInRange(1, NUM_LANES);
                object.y = TOP_LANE_Y + LANE_HEIGHT * (randomLane - 1);
                pullGroup.remove(object);
                gameGroup.add(object);
                gameGroup.objects.push(object);
                object.collided = false;
                object.alpha = 1;
                object.scale.x = 1;
                object.scale.y = 1;

                counters[object.name]++;
            }
        }
    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
    
    function rotateObject(object) {
        game.add.tween(object).to({angle: 360}, 600, Phaser.Easing.Cubic.Out, true)
    }
    
    function hitObject(object) {
        runnerMode = false;

        sound.play("hit");
        var secondAnimation = lives > 0 ? "run" : "losestill";
        console.log("Animation " + secondAnimation);
        if(secondAnimation == "run" && counterAcorn>0){
            secondAnimation = "run_cachetes";
        }
        ardilla.setAnimation(["hit", secondAnimation]);
        var toX = (-object.world.x + ardilla.x) + 300;
        currentDistance -= toX;
        game.add.tween(background.tilePosition).to({x: background.tilePosition.x + toX}, 800, Phaser.Easing.Cubic.Out, true);
        game.add.tween(boardGroup).to({x: boardGroup.x + toX}, 800, Phaser.Easing.Cubic.Out, true);
        game.add.tween(blocksGroup).to({x: blocksGroup.x + toX}, 800, Phaser.Easing.Cubic.Out, true);
        var tween = game.add.tween(gameGroup).to({x: gameGroup.x + toX}, 800, Phaser.Easing.Cubic.Out, true);
        tween.onComplete.add(function () {
            if (lives > 0) {
                runnerMode = true;
                object.collided = false;
            }else
                sound.play("knockout");
        });
    }
    
    function grabObject(object) {
        object.x = object.world.x - ardilla.x;
        object.y = object.world.y - ardilla.y;
        ardilla.add(object);

        rotateObject(object);
        game.add.tween(object).to({x: 0}, 200, Phaser.Easing.Cubic.Out, true);
        var tween = game.add.tween(object).to({y: - 140}, 400, Phaser.Easing.Cubic.Out, true);
        game.add.tween(object.scale).to({x: 1.4, y:1.4}, 400, Phaser.Easing.Cubic.Out, true);
        tween.onComplete.add(function () {
            particleCorrect.x = object.world.x;
            particleCorrect.y = object.world.y;

            particleCorrect.start(true, 1000, null, 1);
            game.add.tween(object).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                ardilla.remove(object);
                pullGroup.add(object);
                object.x = -300;
                object.y = -300;
            });
        });
    }

	return {
		assets: assets,
		name: "acorn",
        preload:preload,
        update:update,
		getGameData:function () {
			var games = yogomeGames.getGames();
			return games[gameIndex];
		},
		create: function(event){

            swipe = new Swipe(game);
		    sceneGroup = game.add.group(); 
            yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel);

            game.onPause.add(function(){
                game.sound.mute = true;
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false;
            }, this);

            initialize();
			var acornSong = sound.play("acornSong", {loop:true, volume:0.6});

            inputs();
            createBackground();
            createBoard();
            createBlocks();
            createSpine();
            createGameObjects();
            generateQuestion();
            createWeapon();

            createHearts();
            createPointsBar();
            createCoin();
            createTutorial();
            createParticles();

            startTutorialRound();

            grabGroup = game.add.group();
            sceneGroup.add(grabGroup);

            buttons.getButton(acornSong,sceneGroup);
		}
	}
}()