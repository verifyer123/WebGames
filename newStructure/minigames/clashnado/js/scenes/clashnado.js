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
                {
                    name: "tutorial_image",
                    file: "images/clashnado/gametuto.png"
                }
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
                    name: "swallow",
                    file: soundsPath + "swallow.mp3"
                },
                {
                    name: "swipe",
                    file: soundsPath + "swipe.mp3"
                },
                {
                    name: "gear",
                    file: soundsPath + "gear.mp3"
                },
                {
                    name: "fireExplosion",
                    file: soundsPath + "fireExplosion.mp3"
                },
                {
                    name: "punchAlly",
                    file: soundsPath + "punch3.mp3"
                },
                {
                    name: "punchEnemy",
                    file: soundsPath + "punch2.mp3"
                },
                {
                    name: "backgroundSong",
                    file: soundsPath + "songs/battleLoop.mp3"
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

    var xPositions = [-187, -67, 60, 187];
    var yPositions = [207, 314, 421, 542, 649];

    var backgroundGroup;
    var levelGroup;
    var alliesGroup;
    var bulletsGroup;
    var enemiesGroup;
    var uiGroup;
    var cloudCoinGroup;

    var weaponBar;
    var gunnerButton;
    var bombButton;
    var wallButton;
    var sand;
    var water;
    var actualCloud = 0;

    var actualEnemyTime = 0;
    var timeForNextEnemy = 500;
    var actualCoinTime = 0;
    var timeForNextCoin = 250;
    var actualDifficultLevel = 0;
    var difficultyUp = 5;
    var levelEnemy = 1;

    var allPositionsGroup;

    var COLLIDERSIZE = 100;

    var enemyRow1 = [], enemyRow2 = [], enemyRow3 = [], enemyRow4 = [];

    var tutorialPhase = 0;
    var tutorialPhaseComplete = true;
    var tutorialCoin;
    var tutorialPlace;

    //#endregion

    //#region Level construction

    function levelConstruction() {
        startPhysics();
        createGroups();
        createUI();
        createBackground();
        //createTimer();
        createHandTutorial();
        createAllAvailablePositions();

        cleanAllArrays();
        lives = 3;
        gamestate = tutorialClashnado;
        tutorialPhase = 0;
        tutorialPhaseComplete = true;

        actualEnemyTime = 0;
        timeForNextEnemy = 500;
        actualCoinTime = 0;
        actualDifficultLevel = 0;
        levelEnemy = 1;
    }

    function startPhysics() {
        game.physics.startSystem( Phaser.Physics.Arcade );
        //game.time.advancedTiming = true;
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

        bulletsGroup = game.add.group();
        sceneGroup.add( bulletsGroup );
        bulletsGroup.activeBullets = [];
        bulletsGroup.poolBullets = [];

        uiGroup = game.add.group();
        sceneGroup.add( uiGroup );
        uiGroup.x = game.world.centerX;
        uiGroup.y = 70;

        cloudCoinGroup = game.add.group();
        sceneGroup.add( cloudCoinGroup );
    }

    function createBaseFontStyle( size ) {
        return fontStyle = { font: size + "px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center" };
    }

    function createButton( xPosition, spriteButton, type, activeGroup, poolGroup, cost ) {
        var newButton = uiGroup.create( xPosition, weaponBar.height / 2, "atlas.basegame", spriteButton );
        newButton.anchor.setTo( 0.5 );
        newButton.resetPositionX = xPosition;
        newButton.resetPositionY = weaponBar.height / 2;
        newButton.type = type;
        newButton.activeGroup = activeGroup;
        newButton.poolGroup = poolGroup;
        newButton.cost = cost;

        game.physics.enable( newButton, Phaser.Physics.ARCADE );
        newButton.body.width = newButton.width / 2;
        newButton.body.height = newButton.height / 2;
        newButton.body.offset.setTo( newButton.width / 4, newButton.height / 4 );
        newButton.inputEnabled = true;
        newButton.input.enableDrag();
        newButton.events.onDragStart.add( startDrag, this );
        newButton.events.onDragStop.add( stopDrag, newButton );
        setButtonStatus( newButton, false );
        return newButton;
    }

    function startDrag( actualButton ) {
        uiGroup.bringToTop( actualButton );
    }

    function stopDrag( actualButton ) {
        if ( game.physics.arcade.overlap( actualButton, allPositionsGroup.allAvailablePositions, function ( actualButton, actualPosition ) {
            if ( actualPosition.available )
            {
                actualPosition.available = false;
                var newAlly = createAlly( actualButton.type, actualButton.poolGroup, actualPosition.correctX, actualPosition.correctY );
                actualButton.activeGroup.push( newAlly );
                newAlly.actualPlace = actualPosition;
                actualCloud.text = Math.floor( actualCloud.text ) - actualButton.cost;
                enableButtons();
            }
        } ) ) { }
        actualButton.x = actualButton.resetPositionX;
        actualButton.y = actualButton.resetPositionY;
    }

    function createUI() {
        weaponBar = uiGroup.create( 0, 0, "atlas.basegame", "barra-8" );
        weaponBar.anchor.setTo( 0.5, 0 );

        actualCloud = game.add.text( -155, ( weaponBar.height / 2 ) + 5, "50", createBaseFontStyle( "35" ) );
        actualCloud.anchor.setTo( 0.5 );
        uiGroup.add( actualCloud );

        gunnerButton = createButton( -50, "tiro-8", "gunner", alliesGroup.gunners, alliesGroup.poolGunners, 100 );
        bombButton = createButton( 70, "bomba-8", "bomb", alliesGroup.bombs, alliesGroup.poolBombs, 150 );
        wallButton = createButton( 190, "defensa-8", "wall", alliesGroup.walls, alliesGroup.poolWalls, 50 );
        uiGroup.add( gunnerButton );
        uiGroup.add( bombButton );
        uiGroup.add( wallButton );
    }

    function createBackground() {
        sand = game.add.tileSprite( 0, 0, game.world.width, ( game.world.height / 2 ) + 70, "atlas.basegame", "arena-8" );
        backgroundGroup.add( sand );

        water = game.add.tileSprite( 0, game.world.centerY + 70, game.world.width, game.world.height / 2, "atlas.basegame", "tile agua-8" );
        backgroundGroup.add( water );

        border = game.add.tileSprite( game.world.centerX, game.world.centerY + 80, game.world.width, 60, "atlas.basegame", "orilla-8" );
        backgroundGroup.add( border );
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

    function createAllAvailablePositions() {
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

    function createSpine( typeElement, ally ) {
        var newSpine = game.add.spine( COLLIDERSIZE / 2, ally ? COLLIDERSIZE : COLLIDERSIZE / 2, typeElement == "hurricaneHelmet" ? "hurricane" : typeElement );
        newSpine.scale.setTo( ally ? 0.45 : 0.4 );
        newSpine.setAnimationByName( 0, typeElement == "hurricaneHelmet" ? "idle_helmet" : "idle", true );
        newSpine.setSkinByName( "normal" );
        return newSpine;
    }

    function createAlly( type, poolGroup, positionX, positionY ) {
        sound.play( "gear" );
        if ( poolGroup.length == 0 )
        {
            var allyHolder = createCollitionHolder( game.world.centerX - positionX - ( COLLIDERSIZE / 2 ), positionY );
            allyHolder.body.immovable = true;
            allyHolder.addChild( createSpine( type, true ) );
            allyHolder.spine = allyHolder.children[0];
            allyHolder.type = type;
            switch ( type )
            {
                case "gunner":
                    allyHolder.activeGroup = alliesGroup.gunners;
                    allyHolder.poolGroup = alliesGroup.poolGunners;
                    allyHolder.fullLife = 4;
                    allyHolder.cooldown = 150;
                    allyHolder.cooldownRemaining = 0;
                    break;
                case "bomb":
                    allyHolder.activeGroup = alliesGroup.bombs;
                    allyHolder.poolGroup = alliesGroup.poolBombs;
                    allyHolder.fullLife = 1;
                    break;
                case "wall":
                    allyHolder.activeGroup = alliesGroup.walls;
                    allyHolder.poolGroup = alliesGroup.poolWalls;
                    allyHolder.fullLife = 40;
                    break;
            }
            allyHolder.lifePoints = allyHolder.fullLife;
            allyHolder.alive = true;
            allyHolder.row = getRow( positionX );
            alliesGroup.add( allyHolder );
            return allyHolder;
        }
        return resetAlly( poolGroup.pop(), positionX, positionY );
    }

    function resetAlly( allyToReset, positionX, positionY ) {
        allyToReset.x = game.world.centerX - positionX - ( COLLIDERSIZE / 2 );
        allyToReset.y = positionY;
        allyToReset.body.width = 100;
        allyToReset.body.height = 100;
        allyToReset.body.offset.setTo( 0 );
        allyToReset.alive = true;
        allyToReset.lifePoints = allyToReset.fullLife;
        allyToReset.row = getRow( positionX );

        allyToReset.spine.setToSetupPose();
        allyToReset.spine.setAnimationByName( 0, "idle", true );
        return allyToReset;
    }

    function createEnemy( type, poolGroup ) {
        if ( poolGroup.length == 0 )
        {
            var randomPosition = getValidPosition();
            var enemyHolder = createCollitionHolder( game.world.centerX - randomPosition - ( COLLIDERSIZE / 2 ), game.world.height + 200 );
            enemyHolder.addChild( createSpine( type, false ) );
            enemyHolder.spine = enemyHolder.children[0];
            enemyHolder.alive = true;
            enemyHolder.type = type;
            switch ( type )
            {
                case "hurricane":
                    enemyHolder.activeGroup = enemiesGroup.hurricanes;
                    enemyHolder.poolGroup = enemiesGroup.poolHurricanes;
                    setEnemyStats( enemyHolder, 2, -100, 2, 100 );
                    break;
                case "hurricaneHelmet":
                    enemyHolder.activeGroup = enemiesGroup.hurricanesHelmet;
                    enemyHolder.poolGroup = enemiesGroup.poolHurricanesHelmet;
                    setEnemyStats( enemyHolder, 4, -120, 4, 80 );
                    enemyHolder.isHelmet = true;
                    break;
                case "evilCloud":
                    enemyHolder.activeGroup = enemiesGroup.evilClouds;
                    enemyHolder.poolGroup = enemiesGroup.poolEvilClouds;
                    setEnemyStats( enemyHolder, 6, -50, 6, 120 );
                    break;
            }
            enemyHolder.cooldownRemaining = 0;
            enemyHolder.lifePoints = enemyHolder.fullLife;
            enemyHolder.body.velocity.y = enemyHolder.speed;
            getRow( randomPosition ).push( enemyHolder );
            enemyHolder.row = getRow( randomPosition );
            enemiesGroup.add( enemyHolder );
            return enemyHolder;
        }
        return resetEnemy( poolGroup.pop() );
    }

    function resetEnemy( enemyToReset ) {
        var randomPosition = getValidPosition();
        enemyToReset.x = game.world.centerX - randomPosition - ( COLLIDERSIZE / 2 );
        enemyToReset.y = game.world.height + 200;
        enemyToReset.body.velocity.y = enemyToReset.speed;
        enemyToReset.alive = true;
        enemyToReset.lifePoints = enemyToReset.fullLife * levelEnemy;
        enemyToReset.cooldownRemaining = 0;
        getRow( randomPosition ).push( enemyToReset );
        enemyToReset.row = getRow( randomPosition );
        enemyToReset.spine.setToSetupPose();
        enemyToReset.spine.addAnimationByName( 0, enemyToReset.isHelmet ? "idle_helmet" : "idle", true );
        return enemyToReset;
    }

    function setEnemyStats( enemyToSet, fullLife, speed, attack, cooldown ) {
        enemyToSet.fullLife = fullLife * levelEnemy;
        enemyToSet.speed = speed;
        enemyToSet.attack = attack;
        enemyToSet.cooldown = cooldown;
    }

    function createBullet( originPositionX, originPositionY ) {
        if ( bulletsGroup.poolBullets.length == 0 )
        {
            var newBullet = bulletsGroup.create(
                originPositionX + ( COLLIDERSIZE / 2 ),
                originPositionY + ( COLLIDERSIZE / 2 ),
                "atlas.basegame", "golden_cloud-8" );
            newBullet.anchor.setTo( 0.5 );
            newBullet.scale.setTo( 0.5 );
            game.physics.enable( newBullet, Phaser.Physics.ARCADE );
            newBullet.speed = 100;
            newBullet.activeGroup = bulletsGroup.activeBullets;
            newBullet.poolGroup = bulletsGroup.poolBullets;
            newBullet.attack = 1;
            newBullet.body.velocity.y = newBullet.speed;
            bulletsGroup.activeBullets.push( newBullet );
        }
        else
        {
            var oldBullet = bulletsGroup.poolBullets.pop();
            oldBullet.x = originPositionX + ( COLLIDERSIZE / 2 );
            oldBullet.y = originPositionY + ( COLLIDERSIZE / 2 );
            oldBullet.body.velocity.y = oldBullet.speed;
            bulletsGroup.activeBullets.push( oldBullet );
        }
    }

    function createCloudCoin() {
        var newCoin = cloudCoinGroup.create(
            game.world.centerX - xPositions[game.rnd.integerInRange( 0, xPositions.length - 1 )],
            yPositions[game.rnd.integerInRange( 0, yPositions.length - 1 )] + ( COLLIDERSIZE / 2 ),
            "atlas.basegame", "golden_cloud-8" );
        newCoin.anchor.setTo( 0.5 );
        game.physics.enable( newCoin, Phaser.Physics.ARCADE );
        newCoin.inputEnabled = true;
        newCoin.events.onInputDown.add( addCloudCoins, newCoin );
        newCoin.introTween = game.add.tween( newCoin ).from( { y: newCoin.y - 100, alpha: 0 }, 1000, Phaser.Easing.Cubic.Out, true );
        return newCoin;
    }

    function setElementInPool( element ) {
        for ( var i = 0; i < element.activeGroup.length; i++ )
        {
            if ( element === element.activeGroup[i] )
            {
                element.activeGroup[i].x = -500;
                element.poolGroup.push( element.activeGroup.splice( i, 1 )[0] );
            }
        }
    }

    function removeFromRow( element ) {
        for ( var i = 0; i < element.row.length; i++ )
        {
            if ( element === element.row[i] )
            {
                element.row.splice( i, 1 );
                return;
            }
        }
    }

    function setAnimation( elementToSetAnimation, animation ) {
        switch ( animation )
        {
            case "lose":
                elementToSetAnimation.spine.setAnimationByName( 0, animation, false ).onComplete = function () {
                    setElementInPool( elementToSetAnimation );
                };
                return;
            case "hit":
                elementToSetAnimation.spine.setAnimationByName( 0, animation, false );
                elementToSetAnimation.spine.addAnimationByName( 0, "idle", true );
                return;
            case "attack":
                if ( elementToSetAnimation.type == "bomb" )
                {
                    elementToSetAnimation.spine.setAnimationByName( 0, animation, false ).onComplete = function () {
                        setElementInPool( elementToSetAnimation );
                    };
                }
                else
                {
                    elementToSetAnimation.spine.setAnimationByName( 0, animation, false );
                    elementToSetAnimation.spine.addAnimationByName( 0, "idle", true );
                }
                return;
        }
    }

    function getValidPosition() {
        var randomPosition = game.rnd.integerInRange( 1, 4 );
        return xPositions[randomPosition - 1];
    }

    function getRow( position ) {
        switch ( position )
        {
            case -187:
                return enemyRow1;
            case -67:
                return enemyRow2;
            case 60:
                return enemyRow3;
            case 187:
                return enemyRow4;
        }
    }

    function killAllRow( row ) {
        var rowToKill = row.splice( 0, row.length );
        for ( var i = 0; i < rowToKill.length; i++ )
        {
            rowToKill[i].alive = false;
            setAnimation( rowToKill[i], "lose" );
        }
    }

    function sendNextEnemy() {
        var nextAttack = game.rnd.integerInRange( 1, levelEnemy > 3 ? 3 : levelEnemy );
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

    function addCloudCoins( newCoin ) {
        if ( lives == 0 ) return;
        sound.play( "swipe" );
        grabedTween = game.add.tween( newCoin ).to( { x: game.world.centerX + actualCloud.x - 70, y: actualCloud.y + 60 }, 300, Phaser.Easing.Cubic.Out, true );
        grabedTween.onComplete.add( function () {
            if ( lives == 0 ) return;
            actualCloud.text = Math.floor( actualCloud.text ) + 50 > 999 ? 999 : Math.floor( actualCloud.text ) + 50;
            enableButtons();
            newCoin.kill();
        } )
    }

    function setButtonStatus( buttonToSet, enable ) {
        buttonToSet.inputEnabled = enable;
        if ( enable )
            buttonToSet.tint = 16777215;
        else
            buttonToSet.tint = 8421504;
    }

    function enableButtons() {
        var actualCloudCoins = Math.floor( actualCloud.text );
        switch ( true )
        {
            case ( actualCloudCoins > 149 ):
                setButtonStatus( wallButton, true );
                setButtonStatus( gunnerButton, true );
                setButtonStatus( bombButton, true );
                return;
            case ( actualCloudCoins > 99 ):
                setButtonStatus( wallButton, true );
                setButtonStatus( gunnerButton, true );
                setButtonStatus( bombButton, false );
                return;
            case ( actualCloudCoins > 49 ):
                setButtonStatus( wallButton, true );
                setButtonStatus( gunnerButton, false );
                setButtonStatus( bombButton, false );
                return;
            case ( actualCloudCoins < 50 ):
                setButtonStatus( wallButton, false );
                setButtonStatus( gunnerButton, false );
                setButtonStatus( bombButton, false );
                return;
        }
    }

    function loseHeart() {
        missPoint();
        if ( lives == 0 )
        {
            gamestate = null;
            stopAllEnemies();
            setButtonStatus( gunnerButton, false );
            setButtonStatus( bombButton, false );
            setButtonStatus( wallButton, false );
        }
    }

    function cleanAllArrays() {
        cleanArray( enemyRow1 );
        cleanArray( enemyRow2 );
        cleanArray( enemyRow3 );
        cleanArray( enemyRow4 );
        cleanArray( enemiesGroup.hurricanes );
        cleanArray( enemiesGroup.hurricanesHelmet );
        cleanArray( enemiesGroup.evilClouds );
        cleanArray( alliesGroup.gunners );
        cleanArray( alliesGroup.bombs );
        cleanArray( alliesGroup.walls );
    }

    function cleanArray( arrayToClean ) {
        arrayToClean.splice( 0, arrayToClean.length );
    }

    function stopAllEnemies() {
        stopEnemyGroup( enemiesGroup.hurricanes );
        stopEnemyGroup( enemiesGroup.hurricanesHelmet );
        stopEnemyGroup( enemiesGroup.evilClouds );
    }

    function stopEnemyGroup( enemyGroup ) {
        for ( i = 0; i < enemyGroup.length; i++ )
        {
            enemyGroup[i].body.velocity.y = 0;
        }
    }

    function render() {
        //game.debug.text( game.time.fps, 2, 14, "#00ff00" );
        //debugBodys();
    }

    function debugBodys() {

        game.debug.body( bombButton );
        //game.debug.bodyInfo( enemiesGroup.hurricanes[0], 32, 32 );

        for ( var i = 0; i < enemiesGroup.hurricanes.length; i++ )
        {
            game.debug.body( enemiesGroup.hurricanes[i] );
        }

        for ( var i = 0; i < enemiesGroup.hurricanesHelmet.length; i++ )
        {
            game.debug.body( enemiesGroup.hurricanesHelmet[i] );
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

    //#endregion

    //#region Update

    function tutorialClashnado() {
        switch ( tutorialPhase )
        {
            case 0:
                if ( tutorialPhaseComplete )
                {
                    tutorialPhaseComplete = false;
                    enemiesGroup.hurricanes.push( createEnemy( "hurricane", enemiesGroup.poolHurricanes ) );
                    enemiesGroup.hurricanes[0].y = yPositions[yPositions.length - 1] + COLLIDERSIZE * 2;
                    enemiesGroup.hurricanes[0].body.velocity.y = 0;
                    tutorialCoin = createCloudCoin();
                    hand.x = tutorialCoin.x;
                    hand.y = tutorialCoin.y + COLLIDERSIZE / 2;
                    hand.alpha = 1;
                }
                if ( actualCloud.text == "100" )
                {
                    tutorialPhaseComplete = true;
                    tutorialPhase = 1;
                }
                return;
            case 1:
                if ( tutorialPhaseComplete )
                {
                    tutorialPhaseComplete = false;
                    setButtonStatus( wallButton, false );
                    hand.x = game.world.centerX + gunnerButton.x - 10;
                    hand.y = gunnerButton.y + 30;
                    game.add.tween( hand ).to( { x: enemiesGroup.hurricanes[0].x + COLLIDERSIZE / 2, y: hand.y + COLLIDERSIZE * 1.5 }, 1200, Phaser.Easing.Cubic.Out, true ).loop( true );
                    for ( var i = 0; i < allPositionsGroup.allAvailablePositions.length; i++ )
                    {
                        allPositionsGroup.allAvailablePositions[i].available = false;
                    }
                    switch ( true )
                    {
                        case enemyRow1.length > 0:
                            tutorialPlace = 0;
                            break;
                        case enemyRow2.length > 0:
                            tutorialPlace = 5;
                            break;
                        case enemyRow3.length > 0:
                            tutorialPlace = 10;
                            break;
                        case enemyRow4.length > 0:
                            tutorialPlace = 15;
                            break;
                    }
                    allPositionsGroup.allAvailablePositions[tutorialPlace].available = true;
                }
                if ( actualCloud.text == "0" )
                {
                    hand.alpha = 0;
                    for ( var i = 0; i < allPositionsGroup.allAvailablePositions.length; i++ )
                    {
                        allPositionsGroup.allAvailablePositions[i].available = true;
                    }
                    allPositionsGroup.allAvailablePositions[tutorialPlace].available = false;
                }
                gunnersAttack();
                checkAllCollitions();
                if ( enemiesGroup.hurricanes.length == 0 )
                {
                    tutorialPhase = 2;
                    tutorialPhaseComplete = true;
                    gamestate = updateClashnado;
                }
                return;
        }
    }

    function updateClashnado() {

        sendEnemiesAndCloudCoins();

        checkAllCollitions();

        checkLimits();

        gunnersAttack();
    }

    function sendEnemiesAndCloudCoins() {
        actualEnemyTime++;
        if ( actualEnemyTime >= timeForNextEnemy )
        {
            sendNextEnemy();
            actualEnemyTime = 0;
            actualDifficultLevel++;
            if ( actualDifficultLevel == difficultyUp )
            {
                levelEnemy += 0.1;
                actualDifficultLevel = 0;
                timeForNextEnemy = timeForNextEnemy != 100 ? timeForNextEnemy - 100 : 100;
            }
        }

        actualCoinTime++;
        if ( actualCoinTime >= timeForNextCoin )
        {
            createCloudCoin();
            actualCoinTime = 0;
        }
    }

    function gunnersAttack() {
        for ( var i = 0; i < alliesGroup.gunners.length; i++ )
        {
            alliesGroup.gunners[i].cooldownRemaining--;
            if ( alliesGroup.gunners[i].cooldownRemaining <= 0 && alliesGroup.gunners[i].alive && alliesGroup.gunners[i].row.length > 0 )
            {
                sound.play( "shoot" );
                var gunnerOnAttack = alliesGroup.gunners[i];
                gunnerOnAttack.spine.setAnimationByName( 0, "attack", false );
                gunnerOnAttack.spine.addAnimationByName( 0, "idle", true );
                gunnerOnAttack.cooldownRemaining = gunnerOnAttack.cooldown;
                createBullet( gunnerOnAttack.x, gunnerOnAttack.y );
            }
        }
    }

    function checkLimits() {

        checkLimitOfEnemyType( enemiesGroup.hurricanes );
        checkLimitOfEnemyType( enemiesGroup.hurricanesHelmet );
        checkLimitOfEnemyType( enemiesGroup.evilClouds );

        for ( var i = 0; i < bulletsGroup.activeBullets.length; i++ )
            if ( bulletsGroup.activeBullets[i].y > game.world.height )
                setElementInPool( bulletsGroup.activeBullets[i] );
    }

    function checkLimitOfEnemyType( groupToCheck ) {
        for ( var i = 0; i < groupToCheck.length; i++ )
        {
            if ( groupToCheck[i].alive && groupToCheck[i].y < game.world.centerY / 4 )
            {
                groupToCheck[i].alive = false;
                loseHeart();
                killAllRow( groupToCheck[i].row );
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

        game.physics.arcade.collide( bulletsGroup, enemiesGroup.hurricanes, bulletVsEnemy );
        game.physics.arcade.collide( bulletsGroup, enemiesGroup.hurricanesHelmet, bulletVsEnemy );
        game.physics.arcade.collide( bulletsGroup, enemiesGroup.evilClouds, bulletVsEnemy );
    }

    function allyVsEnemy( actualAlly, actualEnemy ) {
        if ( !actualEnemy.alive ) return;
        if ( !actualAlly.alive )
        {
            actualEnemy.body.velocity.y = actualEnemy.speed;
            return;
        }

        actualEnemy.cooldownRemaining--;
        if ( actualEnemy.cooldownRemaining <= 0 )
        {
            if ( actualAlly.lifePoints - actualEnemy.attack > 0 )
            {
                sound.play( "punchEnemy" );
                actualAlly.lifePoints -= actualEnemy.attack;
                setAnimation( actualAlly, "hit" );
            }
            else
            {
                sound.play( "swallow" );
                actualAlly.actualPlace.available = true;
                actualAlly.alive = false;
                setAnimation( actualAlly, "lose" );
            }

            if ( actualEnemy.type == "evilCloud" ) setAnimation( actualEnemy, "attack" );

            actualEnemy.cooldownRemaining = actualEnemy.cooldown;
        }
        actualEnemy.body.velocity.y = actualEnemy.speed;
    }

    function bombVsEnemy( bomb, enemy ) {
        if ( bomb.alive == true )
        {
            sound.play( "fireExplosion" );
            setAnimation( bomb, "attack" );
            bomb.actualPlace.available = true;
            bomb.body.width = 300;
            bomb.body.height = 300;
            bomb.body.offset.setTo( -100 );
            bomb.alive = false;
        }
        if ( enemy.alive == true )
        {
            addCoin( enemy, 3 );
            enemy.alive = false;
            removeFromRow( enemy );
            setAnimation( enemy, "lose" );
        }
    }

    function bulletVsEnemy( actualEnemy, bullet ) {
        if ( !actualEnemy.alive )
        {
            bullet.body.velocity.y = bullet.speed;
            return;
        }
        sound.play( "punchAlly" );
        if ( actualEnemy.lifePoints - bullet.attack > 0 )
        {
            actualEnemy.lifePoints -= bullet.attack;
            if ( actualEnemy.isHelmet )
            {
                setAnimation( actualEnemy, "hit" );
                actualEnemy.isHelmet = false;
            }
            actualEnemy.body.velocity.y = actualEnemy.speed;
        }
        else
        {
            sound.play( "pop" );
            switch ( actualEnemy.type )
            {
                case "hurricane":
                    addCoin( actualEnemy, 1 );
                    break;
                case "hurricaneHelmet":
                    addCoin( actualEnemy, 2 );
                    break;
                case "evilCloud":
                    addCoin( actualEnemy, 3 );
                    break;
            }
            actualEnemy.alive = false;
            removeFromRow( actualEnemy );
            setAnimation( actualEnemy, "lose" );
        }
        setElementInPool( bullet );
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
        lives = 3;
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
        //render: render,
        preload: preload,
        getGameData: function () {
            var games = yogomeGames.getGames();
            return games[gameIndex];
        },
        create: function ( event ) {

            sceneGroup = game.add.group();

            spaceSong = game.add.audio( 'backgroundSong' );
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