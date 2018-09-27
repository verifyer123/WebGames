//#region Assets

var soundsPath = "../../shared/minigames/sounds/";
var tutorialPath = "../../shared/minigames/";

var clashnado = function () {
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
                    json: "images/clashnado/atlas.json",
                    image: "images/clashnado/atlas.png",
                },
                {
                    name: "atlas.tutorial",
                    json: tutorialPath + "images/tutorial/tutorial_atlas.json",
                    image: tutorialPath + "images/tutorial/tutorial_atlas.png"
                },
            ],
        images:
            [
                // {
                //     name: "tutorial_image",
                //     file: "images/clashnado/gametuto.png"
                // },
                // {
                //     name: "background",
                //     file: "images/clashnado/fondo.png"
                // }
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
                    file: "images/clashnado/coin.png",
                    width: 122,
                    height: 123,
                    frames: 12
                },
                {
                    name: "hand",
                    file: "images/clashnado/hand.png",
                    width: 115,
                    height: 111,
                    frames: 23
                }
            ],
        spines:
            [
                {
                    name: "bomb",
                    file: "images/spines/bomb/bomb.json"
                },
                {
                    name: "gunner",
                    file: "images/spines/gunner/gunner.json"
                },
                {
                    name: "wall",
                    file: "images/spines/defense/defense.json"
                },
                {
                    name: "bomb",
                    file: "images/spines/bomb/bomb.json"
                },
                {
                    name: "hurricane",
                    file: "images/spines/hurricane/hurricane.json"
                },
                {
                    name: "evilCloud",
                    file: "images/spines/evil_cloud/evil_cloud.json"
                }
            ]
    }

    //#endregion

    //#region Variables

    var lives = null;
    var sceneGroup = null;
    var tutoGroup = null;
    var gameActive = false;
    var gameIndex = 223;
    var particleCorrect;
    var particleWrong;
    var hand;
    var tutoGroup;
    var heartsGroup = null;
    var pointsBar;
    var coin;

    var gamestate;

    var backgroundGroup;
    var levelGroup;
    var uiGroup;

    var weaponBar;
    var gunnerButton;
    var bombButton;
    var wallButton;
    var sand;
    var water;
    var actualCloud = 0;

    var actualTime = 0;
    var timeForNextEnemy = 500;

    var allPositionsGroup;

    var alliesGroup;
    var alliesBulletsGroup;
    var enemiesGroup;

    var COLLIDERSIZE = 100;

    //#endregion

    //#region Level construction

    function levelConstruction() {
        console.clear();
        gamestate = keepSendingEnemies;
        startPhysics();
        createGroups();
        createUI();
        createBackground();
        //createTimer();
        createHandTutorial();

        createAllAvailablePositions();

        enemiesGroup.hurricanes.push( createEnemy( "hurricane", enemiesGroup.poolHurricanes ) );
        enemiesGroup.hurricanesHelmet.push( createEnemy( "hurricaneHelmet", enemiesGroup.poolHurricanesHelmet ) );
        enemiesGroup.evilClouds.push( createEnemy( "evilCloud", enemiesGroup.poolEvilClouds ) );
    }

    function startPhysics() {
        game.physics.startSystem( Phaser.Physics.Arcade );
    }

    function createGroups() {
        backgroundGroup = game.add.group();
        sceneGroup.add( backgroundGroup );

        levelGroup = game.add.group();
        sceneGroup.add( levelGroup );

        allPositionsGroup = game.add.group();
        sceneGroup.add( allPositionsGroup );
        allPositionsGroup.allAvailablePositions = [];
        allPositionsGroup.enableBody = true;
        allPositionsGroup.inputEnabled = true;

        alliesGroup = game.add.group();
        sceneGroup.add( alliesGroup );
        alliesGroup.gunners = [];
        alliesGroup.poolGunners = [];
        alliesGroup.bombs = [];
        alliesGroup.poolBombs = [];
        alliesGroup.walls = [];
        alliesGroup.poolWalls = [];
        alliesGroup.enableBody = true;

        enemiesGroup = game.add.group();
        sceneGroup.add( enemiesGroup );
        enemiesGroup.hurricanes = [];
        enemiesGroup.poolHurricanes = [];
        enemiesGroup.hurricanesHelmet = [];
        enemiesGroup.poolHurricanesHelmet = [];
        enemiesGroup.evilClouds = [];
        enemiesGroup.poolEvilClouds = [];
        enemiesGroup.enableBody = true;

        uiGroup = game.add.group();
        sceneGroup.add( uiGroup );
        uiGroup.x = game.world.centerX;
        uiGroup.y = 70;

    }

    function createBaseFontStyle( size ) {
        return fontStyle = { font: size + "px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center" };
    }

    function createButton( xPosition, spriteButton, type, activeGroup, poolGroup ) {
        var newButton = uiGroup.create( xPosition, weaponBar.height / 2, "atlas.basegame", spriteButton );
        newButton.anchor.setTo( 0.5 );
        newButton.resetPositionX = xPosition;
        newButton.resetPositionY = weaponBar.height / 2;
        newButton.type = type;
        newButton.activeGroup = activeGroup;
        newButton.poolGroup = poolGroup;

        game.physics.enable( newButton, Phaser.Physics.ARCADE );
        newButton.inputEnabled = true;
        newButton.input.enableDrag();
        newButton.events.onDragStop.add( stopDrag, newButton );

        setButtonStatus( newButton, true );
        return newButton;
    }

    function stopDrag( actualButton ) {
        if ( game.physics.arcade.overlap( actualButton, allPositionsGroup.allAvailablePositions, function ( actualButton, actualPosition ) {
            if ( actualPosition.available )
            {
                actualPosition.available = false;
                var newAlly = createAlly( actualButton.type, actualButton.poolGroup, actualPosition.correctX, actualPosition.correctY );
                actualButton.activeGroup.push( newAlly );
                newAlly.actualPlace = actualPosition;
            }
        } ) ) { }
        actualButton.x = actualButton.resetPositionX;
        actualButton.y = actualButton.resetPositionY;
    }

    function createUI() {
        weaponBar = uiGroup.create( 0, 0, "atlas.basegame", "barra-8" );
        weaponBar.anchor.setTo( 0.5, 0 );

        actualCloud = game.add.text( -155, ( weaponBar.height / 2 ) + 5, "250", createBaseFontStyle( "35" ) );
        actualCloud.anchor.setTo( 0.5 );
        uiGroup.add( actualCloud );

        gunnerButton = createButton( -50, "tiro-8", "gunner", alliesGroup.gunners, alliesGroup.poolGunners );
        bombButton = createButton( 70, "bomba-8", "bomb", alliesGroup.bombs, alliesGroup.poolBombs );
        wallButton = createButton( 190, "defensa-8", "wall", alliesGroup.walls, alliesGroup.poolWalls );

        setButtonStatus( gunnerButton, true );
    }

    function createBackground() {
        sand = game.add.tileSprite( 0, 0, game.world.width, ( game.world.height / 2 ) + 70, "atlas.basegame", "arena-8" );
        backgroundGroup.add( sand );

        water = game.add.tileSprite( 0, game.world.centerY + 70, game.world.width, game.world.height / 2, "atlas.basegame", "tile agua-8" );
        backgroundGroup.add( water );

        border = backgroundGroup.create( game.world.centerX, game.world.centerY + 80, "atlas.basegame", "orilla-8" );
        border.anchor.setTo( 0.5 );

        playground = backgroundGroup.create( 0, weaponBar.height + 80, "atlas.basegame", "cuadricula-8" );
        playground.anchor.setTo( 0.5, 0 );
        playground.x = game.world.centerX;

        lane1 = game.add.tileSprite( game.world.centerX - 125, game.world.centerY + 70, 46, game.world.height / 2, "atlas.basegame", "tile_carrril-8" );
        lane1.anchor.setTo( 0.5, 0 );
        backgroundGroup.add( lane1 );

        lane2 = game.add.tileSprite( game.world.centerX, game.world.centerY + 70, 46, game.world.height / 2, "atlas.basegame", "tile_carrril-8" );
        lane2.anchor.setTo( 0.5, 0 );
        backgroundGroup.add( lane2 );

        lane3 = game.add.tileSprite( game.world.centerX + 125, game.world.centerY + 70, 46, game.world.height / 2, "atlas.basegame", "tile_carrril-8" );
        lane3.anchor.setTo( 0.5, 0 );
        backgroundGroup.add( lane3 );
    }

    function createTimer() {
        timerGroup = game.add.group();
        sceneGroup.add( timerGroup );
        var clock = timerGroup.create( game.world.centerX, game.world.centerY + 430, "atlas.basegame", "clock" );
        clock.anchor.setTo( 0.5 );
        timeBar = timerGroup.create( clock.centerX - 175, clock.centerY + 19, "atlas.basegame", "bar" );
        timeBar.anchor.setTo( 0, 0.5 );
        timeBar.scale.setTo( 11.5, 0.65 );
        timerGroup.timeBar = timeBar;
    }

    function createHandTutorial() {
        hand = game.add.sprite( 0, 0, "hand" );
        hand.animations.add( 'hand' );
        hand.animations.play( 'hand', 24, true );
        hand.alpha = 0;
    }

    function createCollitionHolder( createOnPositionX, createOnPositionY, isButton ) {
        var collitionHolder = game.add.graphics( createOnPositionX, createOnPositionY );
        collitionHolder.beginFill( 0xff0000, 0 );
        if ( isButton )
        {
            collitionHolder.drawRect( 0, 0, COLLIDERSIZE / 16, COLLIDERSIZE / 16 );
        } else
        {
            collitionHolder.drawRect( 0, 0, COLLIDERSIZE, COLLIDERSIZE );
        }
        collitionHolder.endFill();
        collitionHolder.deltaY = collitionHolder.height * 0.5;
        game.physics.enable( collitionHolder, Phaser.Physics.ARCADE );
        return collitionHolder;
    }

    function createBaseAlly( typeElement ) {
        var newBaseAlly = game.add.spine( COLLIDERSIZE / 2, COLLIDERSIZE, typeElement );
        newBaseAlly.scale.setTo( 0.45 );
        newBaseAlly.setAnimationByName( 0, "idle", true );
        newBaseAlly.setSkinByName( "normal" );
        newBaseAlly.type = typeElement;
        switch ( typeElement )
        {
            case "gunner":
                newBaseAlly.activeGroup = alliesGroup.gunners;
                newBaseAlly.poolGroup = alliesGroup.poolGunners;
                newBaseAlly.fullLife = 4;
                break;
            case "bomb":
                newBaseAlly.activeGroup = alliesGroup.bombs;
                newBaseAlly.poolGroup = alliesGroup.poolBombs;
                newBaseAlly.fullLife = 1;
                break;
            case "wall":
                newBaseAlly.activeGroup = alliesGroup.walls;
                newBaseAlly.poolGroup = alliesGroup.poolWalls;
                newBaseAlly.fullLife = 10;
                break;
        }
        newBaseAlly.alive = true;
        newBaseAlly.lifePoints = newBaseAlly.fullLife;
        return newBaseAlly;
    }

    function createAlly( type, poolGroup, positionX, positionY ) {
        if ( poolGroup.length == 0 )
        {
            var allyHolder = createCollitionHolder( game.world.centerX - positionX - ( COLLIDERSIZE / 2 ), positionY );
            allyHolder.body.immovable = true;
            allyHolder.addChild( createBaseAlly( type ) );
            return allyHolder;
        }
        return resetAlly( poolGroup.pop(), positionX, positionY );
    }

    function resetAlly( allyToReset, positionX, positionY ) {
        allyToReset.x = game.world.centerX - positionX - ( COLLIDERSIZE / 2 );
        allyToReset.y = positionY;
        allyToReset.children[0].alive = true;
        allyToReset.children[0].lifePoints = allyToReset.children[0].fullLife;

        allyToReset.children[0].setAnimationByName( 0, "lose", true );
        allyToReset.children[0].addAnimationByName( 0, "idle", true );
        //allyToReset.children[0].setAnimationByName( 0, "idle", true );
        return allyToReset;
    }

    function createAllAvailablePositions() {
        var xPositions = [-187, -67, 60, 187];
        var yPositions = [207, 314, 421, 542, 649];
        for ( var i = 0; i < xPositions.length; i++ )
        {
            for ( var j = 0; j < yPositions.length; j++ )
            {
                allPositionsGroup.allAvailablePositions.push( createCollitionHolder( game.world.centerX - xPositions[i] - ( COLLIDERSIZE / 32 ), yPositions[j] + ( ( COLLIDERSIZE / 2 ) - COLLIDERSIZE / 32 ), true ) );
                allPositionsGroup.allAvailablePositions[allPositionsGroup.allAvailablePositions.length - 1].correctX = xPositions[i];
                allPositionsGroup.allAvailablePositions[allPositionsGroup.allAvailablePositions.length - 1].correctY = yPositions[j];
            }
        }
        for ( var i = 0; i < allPositionsGroup.allAvailablePositions.length; i++ )
        {
            allPositionsGroup.allAvailablePositions[i].available = true;
        }
    }

    function setEnemyStats( enemyToSet, fullLife, speed, attack ) {
        enemyToSet.fullLife = fullLife;
        enemyToSet.speed = speed;
        enemyToSet.attack = attack;
    }

    function createBaseEnemy( typeElement ) {
        var newBaseEnemy = game.add.spine( COLLIDERSIZE / 2, COLLIDERSIZE / 2, typeElement != "evilCloud" ? "hurricane" : "evilCloud" );
        newBaseEnemy.scale.setTo( 0.4 );
        newBaseEnemy.setAnimationByName( 0, "idle", true );
        newBaseEnemy.setSkinByName( "normal" );
        newBaseEnemy.alive = true;
        newBaseEnemy.type = typeElement;
        switch ( typeElement )
        {
            case "hurricane":
                newBaseEnemy.activeGroup = enemiesGroup.hurricanes;
                newBaseEnemy.poolGroup = enemiesGroup.poolHurricanes;
                setEnemyStats( newBaseEnemy, 2, -100, 2 );
                break;
            case "hurricaneHelmet":
                newBaseEnemy.activeGroup = enemiesGroup.hurricanesHelmet;
                newBaseEnemy.poolGroup = enemiesGroup.poolHurricanesHelmet;
                setEnemyStats( newBaseEnemy, 6, -120, 4 );
                newBaseEnemy.setAnimationByName( 0, "idle_helmet", true );
                newBaseEnemy.isHelmet = true;
                break;
            case "evilCloud":
                newBaseEnemy.activeGroup = enemiesGroup.evilClouds;
                newBaseEnemy.poolGroup = enemiesGroup.poolEvilClouds;
                setEnemyStats( newBaseEnemy, 6, -50, 4 );
                break;
        }
        newBaseEnemy.lifePoints = newBaseEnemy.fullLife;
        return newBaseEnemy;
    }

    function createEnemy( type, poolGroup ) {
        if ( poolGroup.length == 0 )
        {
            var newEnemy = createBaseEnemy( type );
            var enemyHolder = createCollitionHolder( game.world.centerX - getValidPosition() - ( COLLIDERSIZE / 2 ), game.world.height + 200 );
            enemyHolder.body.velocity.y = newEnemy.speed;
            enemyHolder.addChild( newEnemy );
            return enemyHolder;
        }
        return resetEnemy( poolGroup.pop() );
    }

    function resetEnemy( enemyToReset ) {
        enemyToReset.x = game.world.centerX - getValidPosition() - ( COLLIDERSIZE / 2 );
        enemyToReset.y = game.world.height + 200;
        enemyToReset.children[0].alive = true;
        enemyToReset.children[0].lifePoints = enemyToReset.children[0].fullLife;
        enemyToReset.children[0].addAnimationByName( 0, enemyToReset.children[0].isHelmet ? "idle_helmet" : "idle", true );
        return enemyToReset;
    }

    function getValidPosition() {
        var randomPosition = game.rnd.integerInRange( 1, 4 );
        switch ( randomPosition )
        {
            case 1:
                return -187;
            case 2:
                return -67;
            case 3:
                return 60;
            case 4:
                return 187;
        }
    }

    function sendNextEnemy() {
        var nextAttack = game.rnd.integerInRange( 1, 3 );
        switch ( nextAttack )
        {
            case 1:
                enemiesGroup.hurricanes.push( createEnemy( "hurricane", enemiesGroup.poolHurricanes ) );
                return;
            case 2:
                enemiesGroup.hurricanesHelmet.push( createEnemy( "hurricaneHelmet", enemiesGroup.poolHurricanesHelmet ) );
                return;
            case 3:
                enemiesGroup.evilClouds.push( createEnemy( "evilCloud", enemiesGroup.poolEvilClouds ) );
                return;
        }
    }

    function render() {
        //debugBodys();
    }

    function debugBodys() {
        game.debug.bodyInfo( enemiesGroup.hurricanes[0], 32, 32 );
        for ( var i = 0; i < enemiesGroup.hurricanes.length; i++ )
        {
            game.debug.body( enemiesGroup.hurricanes[i] );
        }

        for ( var i = 0; i < enemiesGroup.evilClouds.length; i++ )
        {
            game.debug.body( enemiesGroup.evilClouds[i] );
        }

        for ( var i = 0; i < alliesGroup.gunners.length; i++ )
        {
            game.debug.body( alliesGroup.gunners[i] );
        }

        for ( var i = 0; i < alliesGroup.bombs.length; i++ )
        {
            game.debug.body( alliesGroup.bombs[i] );
        }

        for ( var i = 0; i < alliesGroup.walls.length; i++ )
        {
            game.debug.body( alliesGroup.walls[i] );
        }

        for ( var i = 0; i < allPositionsGroup.allAvailablePositions.length; i++ )
        {
            game.debug.body( allPositionsGroup.allAvailablePositions[i] );
        }
    }

    function setElementInPool( element ) {
        var index = getIndexToSetInPool( element, element.activeGroup );
        element.activeGroup[index].immovable = false;
        element.activeGroup[index].x = -500;
        element.poolGroup.push( element.activeGroup.splice( index, 1 )[0] );
    }

    function getIndexToSetInPool( element ) {
        for ( var i = 0; i < element.activeGroup.length; i++ )
        {
            if ( element === element.activeGroup[i].children[0] )
            {
                return i;
            }
        }
    }

    //#endregion

    //#region Tweens



    //#endregion

    //#region Tutorial



    //#endregion

    //#region Game Logic

    function setButtonStatus( buttonToSet, enable ) {
        buttonToSet.inputEnabled = enable;
        if ( enable )
            buttonToSet.tint = 16777215;
        else
            buttonToSet.tint = 8421504;
    }

    function keepSendingEnemies() {

        actualTime++;
        if ( actualTime >= timeForNextEnemy )
        {
            sendNextEnemy();
            actualTime = 0;
        }

        checkAllCollitions();

        for ( var i = 0; i < enemiesGroup.hurricanes.length; i++ )
        {
            if ( enemiesGroup.hurricanes[i].y < game.world.centerY / 4 )
            {
                setElementInPool( enemiesGroup.hurricanes[i].children[0] );
            }
        }

        for ( var i = 0; i < enemiesGroup.evilClouds.length; i++ )
        {
            if ( enemiesGroup.evilClouds[i].y < game.world.centerY / 4 )
            {
                setElementInPool( enemiesGroup.evilClouds[i].children[0] );
            }
        }
    }

    function checkAllCollitions() {

        game.physics.arcade.collide( alliesGroup.gunners, enemiesGroup.hurricanes, allyVsEnemy );
        game.physics.arcade.collide( alliesGroup.gunners, enemiesGroup.hurricanesHelmet, allyVsEnemy );
        game.physics.arcade.collide( alliesGroup.gunners, enemiesGroup.evilClouds, allyVsEnemy );

        game.physics.arcade.collide( alliesGroup.walls, enemiesGroup.hurricanes, allyVsEnemy );
        game.physics.arcade.collide( alliesGroup.walls, enemiesGroup.hurricanesHelmet, allyVsEnemy );
        game.physics.arcade.collide( alliesGroup.walls, enemiesGroup.evilClouds, allyVsEnemy );

        game.physics.arcade.collide( alliesGroup.bombs, enemiesGroup.hurricanes, bombVsEnemy );
        game.physics.arcade.collide( alliesGroup.bombs, enemiesGroup.hurricanesHelmet, bombVsEnemy );
        game.physics.arcade.collide( alliesGroup.bombs, enemiesGroup.evilClouds, bombVsEnemy );

        game.physics.arcade.collide( alliesBulletsGroup, enemiesGroup.hurricanes, bulletVsEnemy );
        game.physics.arcade.collide( alliesBulletsGroup, enemiesGroup.hurricanesHelmet, bulletVsEnemy );
        game.physics.arcade.collide( alliesBulletsGroup, enemiesGroup.evilClouds, bulletVsEnemy );
    }

    function allyVsEnemy( actualAlly, actualEnemy ) {
        if ( actualAlly.children[0].lifePoints - actualEnemy.children[0].attack > 0 )
        {
            actualAlly.children[0].lifePoints -= actualEnemy.children[0].attack;
            setAnimation( actualAlly.children[0], "hit" );
        }
        else
        {
            setAnimation( actualAlly.children[0], "lose" );
            actualAlly.actualPlace.available = true;
            SendAllEnemiesToAttack();
        }
        if ( actualEnemy.children[0].type == "evilCloud" )
            setAnimation( actualEnemy.children[0], "attack" );
        actualEnemy.body.velocity.y = 150;
        game.time.events.add( 400, setBackForNextAttack, { enemy: actualEnemy } );
    }

    function bombVsEnemy( bomb, enemy ) {
        setAnimation( bomb.children[0], "attack" );
        setAnimation( enemy.children[0], "lose" );
        bomb.actualPlace.available = true;
    }

    function bulletVsEnemy( bullet, enemy ) {
        setAnimation( enemy.children[0], "hit" );
    }

    function setBackForNextAttack() {
        this.enemy.body.velocity.y = this.enemy.children[0].speed;
    }

    function setAnimation( elementToSetAnimation, animation ) {
        switch ( animation )
        {
            case "lose":
                if ( !elementToSetAnimation.alive ) return;
                elementToSetAnimation.alive = false;
                elementToSetAnimation.setAnimationByName( 0, animation, false ).onComplete = function () {
                    setElementInPool( elementToSetAnimation );
                };
                return;
            case "hit":
                elementToSetAnimation.setAnimationByName( 0, animation, false );
                elementToSetAnimation.addAnimationByName( 0, "idle", true );
                return;
            case "attack":
                if ( elementToSetAnimation.type == "bomb" )
                {
                    elementToSetAnimation.setAnimationByName( 0, animation, false ).onComplete = function () {
                        setElementInPool( elementToSetAnimation );
                    };
                }
                else
                {
                    elementToSetAnimation.setAnimationByName( 0, animation, false );
                    elementToSetAnimation.addAnimationByName( 0, "idle", true );
                }
                return;
        }
    }

    function SendAllEnemiesToAttack() {
        for ( var i = 0; i < enemiesGroup.hurricanes.length; i++ )
            enemiesGroup.hurricanes[i].body.velocity.y = -100;

        for ( var i = 0; i < enemiesGroup.evilClouds.length; i++ )
            enemiesGroup.evilClouds[i].body.velocity.y = -50;
    }

    //#endregion

    //#region Yogome Template

    function createTutorial() {
        tutoGroup = game.add.group();
        sceneGroup.add( tutoGroup );
        tutorialHelper.createTutorialGif( tutoGroup, onClickPlay );
    }

    function onClickPlay( rect ) {
        tutoGroup.y = -game.world.height
    }


    function loadSounds() {
        sound.decode( assets.sounds );
    }

    function initialize() {

        game.stage.backgroundColor = "#ffffff";

        levelConstruction();

        lives = 5;

        loadSounds();

    }

    function preload() {

        game.stage.disableVisibilityChange = false;

    }

    function stopGame( win ) {

        sound.play( "wrong" );
        gameActive = false;

        tweenScene = game.add.tween( sceneGroup ).to( { alpha: 0 }, 500, Phaser.Easing.Cubic.In, true, 3500 );
        tweenScene.onComplete.add( function () {
            spaceSong.stop();
            var resultScreen = sceneloader.getScene( "result" );
            resultScreen.setScore( true, pointsBar.number, gameIndex );
            sceneloader.show( "result" );
            sound.play( "gameLose" );
        } );
    }

    function update() {
        if ( gamestate != null )
            gamestate();
        water.tilePosition.y -= 0.1;
    }

    function createPointsBar() {

        pointsBar = game.add.group();
        pointsBar.x = game.world.width;
        pointsBar.y = 0;
        sceneGroup.add( pointsBar );

        var pointsImg = pointsBar.create( -10, 10, 'atlas.basegame', 'xpcoins' );
        pointsImg.anchor.setTo( 1, 0 );

        var fontStyle = { font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center" };
        var pointsText = new Phaser.Text( sceneGroup.game, 0, 0, "0", fontStyle );
        pointsText.x = -pointsImg.width * 0.45;
        pointsText.y = pointsImg.height * 0.25;
        pointsBar.add( pointsText );

        pointsText.setShadow( 3, 3, 'rgba(0,0,0,0.5)', 0 );

        pointsBar.text = pointsText;
        pointsBar.number = 0;

    }

    function addPoint( number ) {

        sound.play( "magic" )
        pointsBar.number += number;
        pointsBar.text.setText( pointsBar.number );

        var scaleTween = game.add.tween( pointsBar.scale ).to( { x: 1.05, y: 1.05 }, 200, Phaser.Easing.linear, true );
        scaleTween.onComplete.add( function () {
            game.add.tween( pointsBar.scale ).to( { x: 1, y: 1 }, 200, Phaser.Easing.linear, true );
        } )

        addNumberPart( pointsBar.text, '+' + number );

    }

    function addCoin( obj, points ) {
        coin.x = obj.centerX;
        coin.y = obj.centerY;
        var time = 300;

        game.add.tween( coin ).to( { alpha: 1 }, time, Phaser.Easing.linear, true );

        game.add.tween( coin ).to( { y: coin.y - 100 }, time + 200, Phaser.Easing.Cubic.InOut, true ).onComplete.add( function () {
            game.add.tween( coin ).to( { x: pointsBar.centerX, y: pointsBar.centerY }, 200, Phaser.Easing.Cubic.InOut, true ).onComplete.add( function () {
                game.add.tween( coin ).to( { alpha: 0 }, 200, Phaser.Easing.Cubic.In, true ).onComplete.add( function () {
                    addPoint( points );
                } );
            } );
        } );
    }

    function createCoin() {
        coin = game.add.sprite( 0, 0, "coin" );
        coin.anchor.setTo( 0.5 );
        coin.scale.setTo( 0.8 );
        coin.animations.add( 'coin' );
        coin.animations.play( 'coin', 24, true );
        coin.alpha = 0;
    }

    function addNumberPart( obj, number ) {

        var fontStyle = { font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center" };

        var pointsText = new Phaser.Text( sceneGroup.game, 0, 5, number, fontStyle );
        pointsText.x = obj.world.x;
        pointsText.y = obj.world.y;
        pointsText.anchor.setTo( 0.5, 0.5 );
        sceneGroup.add( pointsText );

        game.add.tween( pointsText ).to( { y: pointsText.y + 100 }, 800, Phaser.Easing.linear, true );
        game.add.tween( pointsText ).to( { alpha: 0 }, 250, null, true, 500 );

        pointsText.setShadow( 3, 3, 'rgba(0,0,0,0.5)', 0 );

    }

    function createHearts() {

        heartsGroup = game.add.group();
        heartsGroup.y = 10;
        sceneGroup.add( heartsGroup );

        var pivotX = 10;
        var group = game.add.group();
        group.x = pivotX;
        heartsGroup.add( group );

        var heartImg = group.create( 0, 0, 'atlas.basegame', 'life_box' );

        pivotX += heartImg.width * 0.45;

        var fontStyle = { font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center" };
        var pointsText = new Phaser.Text( sceneGroup.game, 0, 18, "0", fontStyle );
        pointsText.x = pivotX;
        pointsText.y = heartImg.height * 0.15;
        pointsText.setText( 'X ' + lives );
        heartsGroup.add( pointsText );

        pointsText.setShadow( 3, 3, 'rgba(0,0,0,0.5)', 0 );

        heartsGroup.text = pointsText;

    }

    function missPoint() {

        sound.play( "wrong" );

        lives--;
        heartsGroup.text.setText( 'X ' + lives );

        var scaleTween = game.add.tween( heartsGroup.scale ).to( { x: 0.7, y: 0.7 }, 200, Phaser.Easing.linear, true );
        scaleTween.onComplete.add( function () {
            game.add.tween( heartsGroup.scale ).to( { x: 1, y: 1 }, 200, Phaser.Easing.linear, true );
        } )

        if ( lives == 0 )
        {
            stopGame( false );
        }

        addNumberPart( heartsGroup.text, '-1' );
    }

    function createPart( key ) {
        var particle = game.add.emitter( 0, 0, 100 );

        particle.makeParticles( 'atlas.basegame', key );
        particle.minParticleSpeed.setTo( -200, -50 );
        particle.maxParticleSpeed.setTo( 200, -100 );
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle;
    }

    function createParticles() {
        particleCorrect = createPart( "star" );
        sceneGroup.add( particleCorrect );

        particleWrong = createPart( "smoke" );
        sceneGroup.add( particleWrong );
    }

    return {

        assets: assets,
        name: "clashnado",
        update: update,
        render: render,
        preload: preload,
        getGameData: function () {
            var games = yogomeGames.getGames();
            return games[gameIndex];
        },
        create: function ( event ) {

            sceneGroup = game.add.group();

            spaceSong = game.add.audio( 'spaceSong' );
            game.sound.setDecodedCallback( spaceSong, function () {
                spaceSong.loopFull( 0.6 );
            }, this );

            game.onPause.add( function () {
                game.sound.mute = true;
            }, this );

            game.onResume.add( function () {
                game.sound.mute = false;
            }, this );

            initialize();

            createHearts();
            createPointsBar();
            createCoin();
            //createTutorial();
            createParticles();

            buttons.getButton( spaceSong, sceneGroup );

        }
    }
}()

//#endregion