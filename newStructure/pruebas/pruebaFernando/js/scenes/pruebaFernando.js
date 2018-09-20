//#region Assets

var soundsPath = "../../shared/minigames/sounds/";

var basegame = function () {
    var localizationData =
    {
        "EN":
        {
            "howTo": "How to Play?",
            "moves": "Moves left",
        },

        "ES":
        {
            "moves": "Movimientos extra",
            "howTo": "¿Cómo jugar?",
        }
    }

    var assets =
    {
        atlases:
            [
                {
                    name: "atlas.basegame",
                    json: "images/pruebaFernando/atlas.json",
                    image: "images/pruebaFernando/atlas.png",
                },
                {
                    name: "atlas.timeAtlas",
                    json: "images/pruebaFernando/timeAtlas.json",
                    image: "images/pruebaFernando/timeAtlas.png",
                },
            ],
        images:
            [
                {
                    name: "tutorial_image",
                    file: "images/pruebaFernando/gametuto.png"
                },
                {
                    name: "background",
                    file: "images/pruebaFernando/fondo.png"
                }
            ],
        sounds:
            [
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
                    name: "shoot",
                    file: soundsPath + "shoot.mp3"
                },
                {
                    name: "gameLose",
                    file: soundsPath + "gameLose.mp3"
                },
                {
                    name: "steam",
                    file: soundsPath + "steam.mp3"
                },
                {
                    name: "zombieUp",
                    file: soundsPath + "zombieUp.mp3"
                },
                {
                    name: "drag",
                    file: soundsPath + "drag.mp3"
                },
                {
                    name: "gear",
                    file: soundsPath + "gear.mp3"
                },
                {
                    name: "spaceSong",
                    file: soundsPath + "songs/space_bridge.mp3"
                }
            ],
        spritesheets:
            [
                {
                    name: "coin",
                    file: "images/pruebaFernando/coin.png",
                    width: 122,
                    height: 123,
                    frames: 12
                },
                {
                    name: "hand",
                    file: "images/pruebaFernando/hand.png",
                    width: 115,
                    height: 111,
                    frames: 23
                }
            ],
        spines:
            [
                {
                    name: "master",
                    file: "images/spines/skeleton.json"
                }
            ]
    }

    //#endregion

    //#region Variables

    var lives = null;
    var sceneGroup = null;
    var gameActive = false;
    var gameIndex = 223;
    var particleCorrect;
    var particleWrong;
    var hand;
    var tutoGroup;
    var heartsGroup = null;
    var pointsBar;
    var coin;

    var levelGroup = null;
    var quizGroup = null;
    var correctAnswer;
    var playerAnswer;
    var quiz = new Array;
    var allPanels = new Array;
    var allNumbersForPlay = new Array;
    var lastPanelClicked;
    var gametype;
    var scrollQuiz;
    var playing = false;
    var timeBar;
    var timeLimit = 10000;
    var colorTweenTimeBar
    var playedTimes = 0;
    var timesForHard = 3;
    var quizLevel = 1;
    var timeBarTween;
    var cellSize = 50;

    //#endregion

    //#region Level construction

    function levelConstruction() {
        playedTimes = 0;
        createBackground();
        createLevel();
        createPanels();
        createMaster();
        createTimer();
        createPergamino();
    }

    function createBaseFontStyle(size) {
        return fontStyle = { font: size + "px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center" };
    }

    function createBackground() {
        var background = sceneGroup.create(game.world.centerX, game.world.centerY, "background");
        background.anchor.setTo(0.5, 0.5);
        background.width = game.world.width;
        background.height = game.world.height;
    }

    function createTimer() {
        timerGroup = game.add.group();
        sceneGroup.add(timerGroup);
        var clock = timerGroup.create(game.world.centerX, game.world.centerY + 430, "atlas.timeAtlas", "clock");
        clock.anchor.setTo(0.5);
        timeBar = timerGroup.create(clock.centerX - 175, clock.centerY + 19, "atlas.timeAtlas", "bar");
        timeBar.anchor.setTo(0, 0.5);
        timeBar.scale.setTo(11.5, 0.65);
        timerGroup.timeBar = timeBar;
    }

    function createLevel() {
        levelGroup = game.add.group();
        sceneGroup.add(levelGroup);

        quizGroup = game.add.group();
        sceneGroup.add(quizGroup);

        var gong = levelGroup.create(game.world.centerX, game.world.centerY + 250, "atlas.basegame", "board");
        gong.anchor.setTo(0.5, 0.5);
        gong.scale.setTo(1.6, 1.6);

        levelGroup.create(quiz = game.add.text(game.world.centerX, game.world.centerY, "", createBaseFontStyle("64")));
        quiz.anchor.setTo(0.5, 0.5);
        levelGroup.add(quiz);
    }

    function createPanels() {
        var offsetX = 110;
        var offsetY = -100;

        for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
                if ((x + y) % 2 == 0) {
                    allPanels.push(levelGroup.create(
                        game.world.centerX - offsetX + (x * offsetX),
                        game.world.centerY - offsetY + (y * offsetX),
                        "atlas.basegame", "panelClear"));
                } else {
                    allPanels.push(levelGroup.create(
                        game.world.centerX - offsetX + (x * offsetX),
                        game.world.centerY - offsetY + (y * offsetX),
                        "atlas.basegame", "panelDark"));
                }
                allPanels[allPanels.length - 1].anchor.setTo(0.5, 0.5);
                allPanels[allPanels.length - 1].scale.setTo(0, 0);
                var numberToShow = game.add.text(0, 0, "", createBaseFontStyle("64"));
                numberToShow.anchor.setTo(0.5, 0.5);
                allPanels[allPanels.length - 1].addChild(numberToShow);
                allPanels[allPanels.length - 1].events.onInputDown.add(
                    savePlayerInput,
                    {
                        playerInput: allPanels[allPanels.length - 1].children[0],
                        actualButton: allPanels[allPanels.length - 1]
                    });
            }
        }
    }

    function createPergamino() {
        scrollQuiz = levelGroup.create(game.world.centerX, game.world.centerY - 100, "atlas.basegame", "pergamino");
        scrollQuiz.anchor.setTo(0.5, 0.5);
        scrollQuiz.scale.setTo(1, 1);
        scrollQuiz.alpha = 0;
    }

    function createMaster() {
        master = game.add.spine(game.world.centerX - 100, 330, "master");
        master.scale.setTo(.7, .7);
        master.setAnimationByName(0, "IDLE", true);
        master.setSkinByName("normal");
        levelGroup.add(master);
    }

    function animateMaster(animationToPlay) {
        master.setAnimationByName(0, animationToPlay, false);
        master.addAnimationByName(0, "IDLE", true);
    }

    //#endregion

    //#region Tweens

    function tweenAlphaScrollQuiz(show) {
        game.add.tween(scrollQuiz).to({ alpha: show ? 1 : 0 }, 400, Phaser.Easing.Cubic.Out, true);
        game.add.tween(quizGroup).to({ alpha: show ? 1 : 0 }, 400, Phaser.Easing.Cubic.Out, true);
    }

    function tweenScaleAllPanels(show) {
        if (!show) {
            for (var i = 0; i < allPanels.length; i++) {
                singlePanel = game.add.tween(allPanels[i].scale);
                singlePanel.to({ x: show ? 0.6 : 0, y: show ? 0.6 : 0 }, 250, Phaser.Easing.Linear.None);
                singlePanel.start();
            }
        } else
            game.time.events.add(400, tweenScaleSinglePanel, { panelToTween: 0, show: show });
    }

    function tweenScaleSinglePanel(playerPanel = 0) {
        if (playerPanel != 0) {
            playerPanelTween = game.add.tween(playerPanel.scale);
            playerPanelTween.to({ x: 0, y: 0 }, 450, Phaser.Easing.Linear.None);
            playerPanelTween.start();
            return;
        }
        singlePanel = game.add.tween(allPanels[this.panelToTween].scale);
        singlePanel.to({ x: this.show ? 0.6 : 0, y: this.show ? 0.6 : 0 }, 150, Phaser.Easing.Linear.None);
        singlePanel.start();
        sound.play("pop");
        if (this.panelToTween < allPanels.length - 1)
            game.time.events.add(200, tweenScaleSinglePanel, { panelToTween: this.panelToTween + 1, show: this.show });
        else {
            setInputPanels(this.show);
            tweenScaleStartTimeLimit();
            tweenTintTimeBar(65280, 16711680, timeLimit);
        }
    }

    function tweenScaleStartTimeLimit() {
        timeBar.scale.setTo(11.5, 0.65);
        timeBarTween = game.add.tween(timeBar.scale);
        timeBarTween.to({ x: 0, y: 0.65 }, timeLimit, Phaser.Easing.Linear.None);
        timeBarTween.onComplete.add(evaluateQuiz);
        timeBarTween.start();
    }

    function tweenScaleFillBar() {
        timeBarTween = game.add.tween(timeBar.scale);
        timeBarTween.to({ x: 11.5, y: 0.65 }, 300, Phaser.Easing.Linear.None);
        timeBarTween.start();
    }

    function tweenTintTimeBar(startColor, endColor, time) {
        var actualStep = { step: 0 };
        colorTweenTimeBar = game.add.tween(actualStep).to({ step: 100 }, time);
        timeBar.tint = startColor;
        colorTweenTimeBar.onUpdateCallback(function () {
            timeBar.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, actualStep.step);
        });
        colorTweenTimeBar.start();
    }

    //#endregion

    //#region GameLogic

    function startNewGame() {
        playedTimes++;
        if (playedTimes == timesForHard) {
            playedTimes = 0;
            timeLimit = (timeLimit - 1000 > 2000) ? timeLimit - 1000 : 2000;
            quizLevel = quizLevel + 1 == 5 ? 4 : quizLevel + 1;
        }
        tweenScaleFillBar();
        tweenTintTimeBar(timeBar.tint, 65280, 300);
        gametype = game.rnd.integerInRange(1, quizLevel);
        switch (gametype) {
            case 1:
                quiz = ["[ ]", "+", "[ ]", "="];
                createAllNumbers(true, 2);
                break;
            case 2:
                quiz = ["[ ]", "+", "[ ]", "+", "[ ]", "="];
                createAllNumbers(true, 3);
                break;
            case 3:
                quiz = ["[ ]", "-", "[ ]", "="];
                createAllNumbers(false, 2);
                break;
            case 4:
                quiz = ["[ ]", "-", "[ ]", "-", "[ ]", "="];
                createAllNumbers(false, 3);
                break;
        }
    }

    function createAllNumbers(adittion, numbersToPlace) {
        correctAnswer = 0;
        for (var i = 0; i < 9; i++) {
            var numberToSave = game.rnd.integerInRange(1, 7);
            if (i == 0)
                correctAnswer += numberToSave;
            else if (i < numbersToPlace)
                correctAnswer = adittion ? correctAnswer + numberToSave : correctAnswer - numberToSave;
            allNumbersForPlay[i] = numberToSave;
        }
        Phaser.ArrayUtils.shuffle(allNumbersForPlay);
        fillPanels();
    }

    function fillPanels() {
        for (var x = 0; x < 9; x++) {
            allPanels[x].children[0].setText(allNumbersForPlay[x]);
        }
        generateQuiz();
    }

    function generateQuiz() {
        quiz.push(correctAnswer);
        playerAnswer = 0;
        playing = true;
        showQuiz();
        tweenAlphaScrollQuiz(true);
        tweenScaleAllPanels(true);
    }

    function showQuiz() {
        quizGroup.removeAll();
        quizGroup.x = game.world.centerX - (cellSize * (quiz.length / 2));
        quizGroup.y = game.world.centerY - 120;
        for (var i = 0; i < quiz.length; i++) {
            if (quiz[i] == "[ ]") {
                numFaltante = quizGroup.create(0, 0, "atlas.basegame", "numFaltante");
                numFaltante.scale.setTo(0.7, 0.7);
            }
            else {
                var numberToShow = game.add.text(0, 0, quiz[i], createBaseFontStyle("50"));
                numberToShow.stroke = '#000000';
                numberToShow.strokeThickness = 6;
                quizGroup.add(numberToShow);
            }
        }
        quizGroup.align(-1, 1, cellSize, cellSize, Phaser.CENTER);
    }

    function setInputPanels(enable) {
        for (var i = 0; i < allPanels.length; i++) {
            allPanels[i].inputEnabled = enable;
        }
    }

    function savePlayerInput() {
        if (!playing) return;
        tweenScaleSinglePanel(this.actualButton);
        lastPanelClicked = this.actualButton;
        this.actualButton.inputEnabled = false;
        for (var i = 0; i < quiz.length; i++) {
            if (i == 0 && quiz[i] == "[ ]") {
                playerAnswer = Math.floor(this.playerInput.text);
                quiz[i] = Math.floor(this.playerInput.text);
                showQuiz();
                sound.play("cut");
                return;
            }
            if (quiz[i] == "[ ]") {
                playerAnswer =
                    gametype < 3 ?
                        playerAnswer + Math.floor(this.playerInput.text) :
                        playerAnswer - Math.floor(this.playerInput.text);
                quiz[i] = Math.floor(this.playerInput.text);
                sound.play("cut");
                showQuiz();
                if (quiz[i + 1] != "=")
                    return;
            }
        }
        timeBarTween.stop();
        colorTweenTimeBar.stop();
        finishGame();
        game.time.events.add(1000, evaluateQuiz);
    }

    function evaluateQuiz() {
        tweenAlphaScrollQuiz(false);
        finishGame();
        if (playerAnswer == correctAnswer && isAllQuizSolved()) {
            animateMaster("WIN");
            addCoin(lastPanelClicked, gametype);
        }
        else {
            animateMaster("LOSE");
            missPoint();
        }
        sendNewGame();
    }

    function isAllQuizSolved() {
        for (var i = 0; i < quiz.length; i++) {
            if (quiz[i] == "[ ]")
                return false;
        }
        return true;
    }

    function finishGame() {
        setInputPanels(false);
        game.time.events.add(500, tweenScaleAllPanels, false);
        playing = false;
        showQuiz();
    }

    function sendNewGame() {
        if (lives > 0)
            game.time.events.add(1000, startNewGame);
    }

    //#endregion

    //#region Yogome Template

    function loadSounds() {
        sound.decode(assets.sounds);
    }

    function initialize() {

        game.stage.backgroundColor = "#ffffff";

        levelConstruction();

        lives = 5;

        loadSounds();

        startNewGame();


    }

    function preload() {

        game.stage.disableVisibilityChange = false;

    }

    function stopGame(win) {

        sound.play("wrong");
        gameActive = false;

        tweenScene = game.add.tween(sceneGroup).to({ alpha: 0 }, 500, Phaser.Easing.Cubic.In, true, 3500);
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

    }

    function update() {

    }

    function createPointsBar() {

        pointsBar = game.add.group();
        pointsBar.x = game.world.width;
        pointsBar.y = 0;
        sceneGroup.add(pointsBar);

        var pointsImg = pointsBar.create(-10, 10, 'atlas.basegame', 'xpcoins');
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

        sound.play("magic")
        pointsBar.number += number;
        pointsBar.text.setText(pointsBar.number);

        var scaleTween = game.add.tween(pointsBar.scale).to({ x: 1.05, y: 1.05 }, 200, Phaser.Easing.linear, true);
        scaleTween.onComplete.add(function () {
            game.add.tween(pointsBar.scale).to({ x: 1, y: 1 }, 200, Phaser.Easing.linear, true);
        })

        addNumberPart(pointsBar.text, '+' + number);

    }

    function addCoin(obj, points) {
        coin.x = obj.centerX;
        coin.y = obj.centerY;
        var time = 300;

        game.add.tween(coin).to({ alpha: 1 }, time, Phaser.Easing.linear, true);

        game.add.tween(coin).to({ y: coin.y - 100 }, time + 200, Phaser.Easing.Cubic.InOut, true).onComplete.add(function () {
            game.add.tween(coin).to({ x: pointsBar.centerX, y: pointsBar.centerY }, 200, Phaser.Easing.Cubic.InOut, true).onComplete.add(function () {
                game.add.tween(coin).to({ alpha: 0 }, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function () {
                    addPoint(points);
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

        var heartImg = group.create(0, 0, 'atlas.basegame', 'life_box');

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

        var scaleTween = game.add.tween(heartsGroup.scale).to({ x: 0.7, y: 0.7 }, 200, Phaser.Easing.linear, true);
        scaleTween.onComplete.add(function () {
            game.add.tween(heartsGroup.scale).to({ x: 1, y: 1 }, 200, Phaser.Easing.linear, true);
        })

        if (lives == 0) {
            stopGame(false);
        }

        addNumberPart(heartsGroup.text, '-1');
    }

    function createPart(key) {
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.basegame', key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle;
    }

    function createParticles() {
        particleCorrect = createPart("star");
        sceneGroup.add(particleCorrect);

        particleWrong = createPart("smoke");
        sceneGroup.add(particleWrong);
    }

    return {

        assets: assets,
        name: "pruebaFernando",
        update: update,
        preload: preload,
        getGameData: function () {
            var games = yogomeGames.getGames();
            return games[gameIndex];
        },
        create: function (event) {

            sceneGroup = game.add.group();

            spaceSong = game.add.audio('spaceSong');
            game.sound.setDecodedCallback(spaceSong, function () {
                spaceSong.loopFull(0.6);
            }, this);

            game.onPause.add(function () {
                game.sound.mute = true;
            }, this);

            game.onResume.add(function () {
                game.sound.mute = false;
            }, this);

            initialize();

            createHearts();
            createPointsBar();
            createCoin();
            //createTutorial();
            createParticles();

            buttons.getButton(spaceSong, sceneGroup);

        }
    }
}()

//#endregion